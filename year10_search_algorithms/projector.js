(()=>{
 'use strict';
 const U=SearchUI,C=SearchCore,L=SEARCH_LESSON,$=id=>document.getElementById(id),esc=U.esc;
 $('school-panel').innerHTML=`
  <section class="tta-box tta-topic"><h2>Topic</h2><p>${esc(L.title)}</p></section>
  <section class="tta-box tta-wagba"><h2>WAGBA (KSU)</h2><p>${esc(L.wagba)}</p></section>
  <section class="tta-box tta-keywords"><h2>Keywords</h2>
   <p>target, index, value, sequential, sorted, midpoint, search area</p>
   <p class="tta-ksu"><strong>Knowledge:</strong> Know target, index, value and midpoint. Binary search needs sorted data.</p>
   <p class="tta-ksu"><strong>Skills:</strong> Trace each step in the pseudocode.</p>
   <p class="tta-ksu"><strong>Understanding:</strong> Explain the next move and stopping rule.</p>
  </section>`;
 $('tta-challenge').innerHTML='<h2>Challenge Task</h2><p>'+esc(L.challenge)+'</p>';
 let d=null,last='',awardRound=null,seenAwards=new Map(),focus,lastTeacherFocus,busy=false,timerKey='',timerMaximum=1;
 const demo=location.hash==='#demo';let creds=null;
 const titles={settle:'Welcome',starter:'Do Now',types:'Types of Learning',linear:'Main Task 1',binary:'Main Task 2',independent:'Compare',extension:'Extension',pit:'Learning Pitstop',plenary:'Plenary'};
 function fit(){document.documentElement.style.setProperty('--tta-scale',Math.min(innerWidth/1280,innerHeight/720));}
 window.addEventListener('resize',fit);fit();
 if(!demo){const p=new URLSearchParams(location.hash.slice(1));if(p.has('key')){creds={room:p.get('room'),key:p.get('key')};sessionStorage.setItem('search-projector',JSON.stringify(creds));history.replaceState(null,'',location.pathname+'#display');}else{try{creds=JSON.parse(sessionStorage.getItem('search-projector'));}catch{}}}
 function question(q){return '<h2 class="tta-question-title">'+esc(q.title)+'</h2>'+U.list(C.ITEMS,{current:q.indexes?.mid??-1})+U.indexLegend(q)+'<p class="tta-question-text">'+esc(q.prompt)+'</p>';}
 function paint(){
  const s=d.state;trackAwards();const key=s.revision+':'+s.phase+':'+s.reveal+':'+(s.focus_student||'')+':'+JSON.stringify(d.responses);if(key===last)return;last=key;
  if(lastTeacherFocus!==s.focus_student){focus=undefined;lastTeacherFocus=s.focus_student;}
  const normal=s.phase==='work'||s.phase==='closed',q=C.QUESTIONS[s.question],title=normal?(titles[s.stage_id]||'Lesson'):'Class Discussion';
  $('tta-slide').dataset.stage=s.stage_id;$('tta-slide').dataset.phase=s.phase;$('tta-title').textContent=title;$('tta-title').classList.toggle('long',title.length>14);$('tta-timer').dataset.phase=s.phase;$('clear-focus').hidden=s.phase!=='review';
  const nextTimer=s.stage_id+':'+s.phase+':'+(s.round_id||'');if(nextTimer!==timerKey){timerKey=nextTimer;timerMaximum=Math.max(1,U.deadline(s));}timerMaximum=Math.max(timerMaximum,U.deadline(s));
  let body='';
  if(normal){body=(s.attention?'<p class="tta-attention">Look at the board for your teacher’s explanation.</p>':'')+'<h2>'+esc(s.title)+'</h2><p class="tta-instructions">'+esc(s.instructions)+'</p>';if(['starter','linear','binary','independent','extension'].includes(s.stage_id))body+=U.list();body+='<p id="projector-attention" class="tta-stage-note"></p>';}
  else if(q){body=question(q);if(s.phase==='question')body+='<p class="tta-question-help">Open the discussion notice on your lesson page. Think through the next step, enter your response and select <strong>Submit</strong>.</p><p class="tta-private-reminder">Your responses stay private until the response window closes.</p><p id="projector-attention" class="tta-stage-note"></p>';
   else{const all=d.responses||[],selected=all.find(r=>r.id===(focus===undefined?s.focus_student:focus)),rows=selected?[selected]:all;
    body+='<div class="tta-review-layout"><section class="tta-response-grid '+(selected?'single':'')+'" aria-label="Submitted class responses">'+rows.map(r=>'<article class="tta-response" tabindex="0" role="button" data-focus="'+esc(r.id)+'" aria-label="Enlarge anonymous response '+(all.indexOf(r)+1)+'"><strong>Response '+(all.indexOf(r)+1)+'</strong>'+(r.point?'<span class="projector-point">★ +1 house point</span>':'')+'<p>'+esc(q.options?.find(o=>o.id===r.answer)?.text||r.answer)+'</p></article>').join('')+(rows.length?'':'<p class="tta-empty">No submitted answers yet. Discuss the correct answer together.</p>')+'</section><aside class="tta-model">'+(s.reveal?U.answer(q,true):'<h3>Correct answer not shown yet</h3><p>Your teacher will reveal it when ready.</p>')+'</aside></div>';
   }
  }
  $('projector-main').innerHTML=body;$('projector-main').scrollTop=0;
  document.querySelectorAll('[data-focus]').forEach(el=>{const fn=()=>{focus=focus===el.dataset.focus?null:el.dataset.focus;last='';paint();};el.onclick=fn;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}};});tick();
 }
 function trackAwards(){const round=d.state.round_id,rows=d.responses||[];if(round!==awardRound){awardRound=round;seenAwards=new Map(rows.map(r=>[r.id,Number(r.point||0)]));return;}const added=rows.filter(r=>Number(r.point)>0&&!seenAwards.get(r.id));rows.forEach(r=>seenAwards.set(r.id,Number(r.point||0)));if(added.length)U.celebrate(added.map(r=>'Response '+(r.number||rows.indexOf(r)+1)).join(' and ')+' — well done!',{container:$('tta-slide')});}
 function tick(){if(!d?.state)return;const s=d.state,remaining=U.deadline(s);$('projector-clock').textContent=s.phase==='review'?'Discuss':U.clock(remaining);$('projector-timer-label').textContent=s.phase==='review'?'Responses closed':s.paused?'Timer paused':s.phase==='question'?'Response time remaining':'Time remaining';$('tta-timer-progress').style.width=(s.phase==='review'?0:Math.min(100,100*remaining/timerMaximum))+'%';const a=$('projector-attention');if(a)a.textContent=!s.paused&&remaining>0&&remaining<=20000?(s.phase==='question'?'Finish your response and select Submit.':s.auto_question?'Discussion starts shortly. Finish your current sentence.':'Finish your current step and look at the board.'):'';}
 async function refresh(){if(busy)return;busy=true;try{if(demo){const value=localStorage.getItem('search-projector-demo');if(value)d=JSON.parse(value);}else if(creds){const r=await fetch(SEARCH_CONFIG.url+'/rest/v1/rpc/y10_search_projector',{method:'POST',headers:{apikey:SEARCH_CONFIG.key,'Content-Type':'application/json'},body:JSON.stringify({p_room:creds.room,p_key:creds.key})});d=await r.json();if(!r.ok)throw Error(d.message||'Projector connection failed');}if(d?.state){if(!demo)U.sync(d.server_now);paint();$('projector-status').textContent=demo?'Sample data · rehearsal':'Connected';$('projector-status').dataset.problem='false';}}catch(e){$('projector-status').textContent='Connection paused · '+e.message;$('projector-status').dataset.problem='true';}finally{busy=false;}}
 $('projector-fullscreen').onclick=()=>document.documentElement.requestFullscreen?.();$('clear-focus').onclick=()=>{focus=null;last='';paint();};setInterval(refresh,1600);setInterval(tick,250);refresh();
})();
