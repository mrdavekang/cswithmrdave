(() => {
  'use strict';
  const G=GameLive,E=G.esc,$=id=>document.getElementById(id);
  let data=null,roomId='',received=0,offset=0,polling=false,chain=Promise.resolve(),demoDirty=false,demoRound='',demoTimer,
    demoVersion=0,selected='',selectedHistory=[],recordPage=0,recordDetail=null,recordEvents=[],recordTotal=0,tab='live';
  const tiles=new Map(),awarding=new Set();
  let painted=new WeakMap();
  function paintHTML(el,html){if(painted.get(el)===html)return;el.innerHTML=html;painted.set(el,html);}
  function setText(el,text){if(el.textContent!==text)el.textContent=text;}
  const message=(txt,bad=false)=>{$('teacher-message').textContent=txt;$('teacher-message').classList.toggle('gc-error',bad);};
  const room=()=>G.effective(data?.room,Date.now()+offset);
  const when=x=>x?new Date(x).toLocaleString():'Not recorded';
  async function call(action,payload={},id=roomId){return G.rpc('teacher',{p_action:action,p_room:id||null,p_data:payload});}
  function receive(value){
    if(value.room.id!==roomId)return;
    if(data?.room.id===value.room.id&&(value.room.revision<data.room.revision||Date.parse(value.room.serverNow)<Date.parse(data.room.serverNow)))return;
    if(data?.room.id!==value.room.id){tiles.clear();$('response-grid').replaceChildren();selected='';$('student-detail').hidden=true;}
    data=value;received=Date.now();offset=Date.parse(value.room.serverNow)-Date.now();render();
  }
  function command(action,payload={}){
    const target=roomId,commandId=crypto.randomUUID();
    chain=chain.catch(()=>{}).then(async()=>{
      if(target!==roomId)throw Error('Class changed. Retry in the selected class.');
      try{const result=await call(action,{...payload,revision:data.room.revision,commandId},target);receive(result);message(action==='award'?'House point recorded. Student and projector celebration sent.':'Classroom updated.');return result;}
      catch(e){message(e.message,true);try{receive(await call('read'));}catch{}throw e;}
    });return chain;
  }
  async function rooms(){const rows=await call('list');$('room-select').innerHTML='<option value="">Choose a class session</option>'+rows.map(r=>'<option value="'+r.id+'">'+E(r.className+' · '+(r.ended?'ended':'open')+' · '+when(r.serverNow===undefined?null:r.createdAt))+'</option>').join('');$('room-select').value=roomId;}
  async function openRoom(id){clearTimeout(demoTimer);demoVersion++;roomId=id;data=null;demoDirty=false;demoRound='';selected='';tiles.clear();$('response-grid').replaceChildren();$('student-detail').hidden=true;$('room-dashboard').hidden=!id;$('gc-live-nav').hidden=!id;if(id)receive(await call('heartbeat'));}
  async function authenticate(){
    const {data:{session}}=await G.db().auth.getSession();$('teacher-login').hidden=!!session;$('teacher-app').hidden=!session;
    if(session){try{await rooms();message('Approved teacher signed in. Choose your class and open or resume it.');}catch(e){$('teacher-login').hidden=false;$('teacher-app').hidden=true;message(e.message,true);}}
  }
  function render(){
    const r=room();if(!r)return;$('room-dashboard').hidden=false;$('gc-live-nav').hidden=false;$('room-title').textContent=r.className+' · '+(r.ended?'Saved session':'Live classroom');
    $('projector-link').href='projector.html?key='+encodeURIComponent(data.boardKey);
    $('connection-note').textContent=r.ended?'Session ended. Records are retained. Open a new class for another lesson.':'Students on the normal link register automatically. Live connection checks every few seconds.';
    const students=G.stableStudents(data.students),responses=data.responses.filter(x=>x.round_no===r.round&&x.kind===r.responseKind);
    $('room-stats').innerHTML=[['Registered',students.filter(s=>s.status==='admitted').length],['Ready for this round',students.filter(s=>s.ready_round===r.round).length],[r.responseKind==='revision'?'Improvements sent':'First responses sent',responses.filter(s=>s.submitted_at).length],['Need help',students.filter(s=>s.help).length]].map(([label,n])=>'<div><b>'+n+'</b><span>'+label+'</span></div>').join('');
    $('end-class').disabled=r.ended;
    $('round-title').textContent='Checkpoint '+r.round+' · '+G.rounds[r.round].title+' · '+r.phase;
    $('round-prompt').textContent=G.rounds[r.round].prompt;
    const button=(a,t,p='')=>'<button data-command="'+a+'" '+(r.ended?'disabled':'')+' '+p+'>'+t+'</button>';
    let controls='';
    if(r.phase==='invite')controls+=button('start','Start 3-minute response','class="gc-primary"');
    if(['response','retry'].includes(r.phase))controls+=button('timer',r.pausedSeconds!=null?'Resume response timer':'Pause response timer')+button('extend','+30 seconds','data-seconds="30"')+button('extend','+60 seconds','data-seconds="60"');
    if(r.phase!=='work')controls+=button('discuss','Discuss · eyes to board');
    if(!r.revealed)controls+=button('reveal','Reveal worked model','class="gc-primary"');
    else controls+=button('follow','Follow along · edit improvements','class="gc-primary"')+button('retry','Start 1-minute improvement');
    controls+=button('release','Return everyone to independent work');
    const signature=r.phase+':'+r.revealed+':'+r.pausedSeconds+':'+r.ended;
    if($('round-controls').dataset.state!==signature){$('round-controls').innerHTML=controls;$('round-controls').dataset.state=signature;}
    for(const b of document.querySelectorAll('[data-invite]'))b.disabled=r.ended;
    $('teacher-demo-panel').hidden=!r.revealed;
    const demoKey=r.id+':'+r.round;
    if(demoRound!==demoKey){demoRound=demoKey;demoDirty=false;clearTimeout(demoTimer);}
    if(r.revealed&&!demoDirty&&document.activeElement!==$('teacher-code')){$('teacher-code').value=r.demo.code;$('teacher-output').textContent=r.demo.output;}
    if(document.activeElement!==$('board-stage'))$('board-stage').value=r.boardStage||'auto';
    const ids=new Set(students.map(s=>s.id));for(const [id,node]of tiles)if(!ids.has(id)){node.remove();tiles.delete(id);}
    for(const s of students){
      let tile=tiles.get(s.id);if(!tile){tile=document.createElement('article');tile.className='gc-response-tile';tile.dataset.student=s.id;tile.innerHTML='<div class="gc-tile-heading"><h3></h3><button class="gc-award" data-award="'+s.id+'">★ +1 house point</button></div><p class="gc-tile-status"></p><p class="gc-tile-result"></p><div class="gc-tile-code"><h4>Code</h4><pre></pre><h4>Output / error</h4><pre></pre></div><div class="gc-actions"><button data-detail="'+s.id+'">View history</button></div><span class="gc-points-total"></span>';tiles.set(s.id,tile);$('response-grid').append(tile);}
      // Keep the same tile nodes, button positions and focus during every poll.
      const first=data.responses.find(x=>x.student_id===s.id&&x.round_no===r.round&&x.kind==='initial'),improved=data.responses.find(x=>x.student_id===s.id&&x.round_no===r.round&&x.kind==='revision');
      const response=(r.responseKind==='revision'?improved||first:first),help=s.help?' · HELP REQUESTED':'',online=Date.now()+offset-Date.parse(s.last_seen)<22000;
      tile.querySelector('h3').textContent=s.name;tile.querySelector('.gc-tile-status').textContent=(s.status==='admitted'?(online?'Connected':'Not recently seen'):'Live access paused')+help;
      tile.querySelector('.gc-tile-result').textContent=(first?.submitted_at?'✓ First sent':first?'First draft saved':'No first response')+(r.responseKind==='revision'?(improved?.submitted_at?' · ✓ improvement sent':improved?' · improvement draft':' · improvement not yet'):'');
      tile.querySelector('.gc-tile-code h4').textContent=response?.kind==='revision'?'Improvement code':'First-response code';
      const pre=tile.querySelectorAll('pre');setText(pre[0],response?.code||'Waiting for this checkpoint.');setText(pre[1],response?(response.output+(response.error?'\n'+response.error:''))||'(No output saved)':'—');
      const award=tile.querySelector('[data-award]');award.disabled=r.ended||s.status!=='admitted'||awarding.has(s.id);award.textContent=awarding.has(s.id)?'Awarding…':'★ +1 house point';
      award.setAttribute('aria-label','Award one house point to '+s.name);
      tile.querySelector('.gc-points-total').textContent=data.awards.filter(a=>a.student_id===s.id&&!a.undone_at).reduce((n,a)=>n+a.amount,0)+' house points recorded';tile.classList.toggle('needs-help',s.help);
    }
    filter();paintHTML($('awards-list'),data.awards.map(a=>'<p>'+E(data.students.find(s=>s.id===a.student_id)?.name||'Student')+' · +'+a.amount+' · '+E(a.reason)+' · '+E(when(a.at))+(a.undone_at?' · reversed':' <button data-undo="'+a.id+'" '+(r.ended?'disabled':'')+'>Undo</button>')+'</p>').join('')||'<p>No house points recorded yet.</p>');
    if(selected)paintStudent();tick();
  }
  function filter(){const search=$('student-search').value.trim().toLocaleLowerCase();for(const tile of tiles.values())tile.hidden=!tile.querySelector('h3').textContent.toLocaleLowerCase().includes(search);}
  function tick(){
    if(!data)return;const r=room(),elapsed=G.elapsed(r,received),c=r.boardStage?G.cues.find(x=>x[2]===r.boardStage)||G.cue(elapsed):G.cue(elapsed);$('lesson-clock').textContent=G.time(elapsed);$('clock-toggle').textContent=r.clockRunning?'Pause lesson clock':'Start / resume lesson clock';$('clock-toggle').disabled=r.ended;
    $('cue-title').textContent=r.boardStage||c[2];$('cue-teacher').textContent='Teacher: '+c[3];$('cue-student').textContent='Students: '+c[4];$('round-clock').textContent=['response','retry'].includes(r.phase)?(r.pausedSeconds!=null?'Paused · ':'')+G.time(G.remaining(r,Date.now()+offset)):r.phase;
    $('gc-nav-time').textContent='Checkpoint '+r.round+' · '+$('round-clock').textContent;
  }
  function paintStudent(){
    const s=data.students.find(s=>s.id===selected);if(!s)return;const n=Number($('detail-round').value),responses=data.responses.filter(x=>x.student_id===s.id&&x.round_no===n);
    $('student-detail').hidden=false;$('detail-title').textContent=s.name+' · checkpoint '+n;
    paintHTML($('detail-work'),'<div class="gc-actions"><button data-access="'+s.id+'" data-status="'+(s.status==='admitted'?'rejected':'admitted')+'">'+(s.status==='admitted'?'Pause this entry’s live access':'Restore live access')+'</button>'+(s.help?'<button data-help-resolved="'+s.id+'">Help discussed</button>':'')+'</div><div class="gc-two">'+['initial','revision'].map(k=>{const x=responses.find(x=>x.kind===k);return '<section><h3>'+(k==='initial'?'First response':'Improvement · model-supported')+'</h3>'+(x?'<pre>'+E(x.code)+'</pre><h4>Output / error</h4><pre>'+E(x.output+(x.error?'\n'+x.error:''))+'</pre><p>'+E(x.submitted_at?'Sent '+when(x.submitted_at):'Draft saved '+when(x.saved_at))+'</p>':'<p>Not recorded.</p>')+'</section>';}).join('')+'</div>');
    paintHTML($('detail-history'),selectedHistory.filter(x=>x.round_no===n).map(x=>'<details><summary>'+E(x.kind+' · '+x.event_type+' · '+when(x.at))+'</summary><pre>'+E(x.code+'\n\n'+x.output+(x.error?'\n'+x.error:''))+'</pre></details>').join('')||'<p>No events loaded. Reopen View history to refresh.</p>');
    $('detail-award').disabled=room().ended||s.status!=='admitted';
  }
  async function student(id){selected=id;selectedHistory=[];$('detail-round').value=String(room().round);paintStudent();$('student-detail').scrollIntoView({behavior:'smooth',block:'start'});const result=await call('history',{studentId:id});if(selected===id){selectedHistory=result.attempts;paintStudent();}}
  async function award(id,amount=1,reason='Useful learning contribution'){
    if(awarding.has(id))return;awarding.add(id);render();try{await command('award',{studentId:id,amount,reason:reason.trim()});}finally{awarding.delete(id);render();}
  }
  async function broadcast(run=false){
    if(!room()?.revealed)return;const id=roomId,roundNo=room().round,version=demoVersion,code=$('teacher-code').value;
    let output='Teacher is editing. Run will show the output.';
    if(run){if(PythonRunner.busy())return;$('demo-run').disabled=true;$('demo-stop').disabled=false;const result=await PythonRunner.run(code);$('demo-run').disabled=false;$('demo-stop').disabled=true;if(version!==demoVersion||id!==roomId||roundNo!==room().round)return;output=(result.stdout||'')+(result.error?'\n'+result.error:'');}
    if(version!==demoVersion||id!==roomId)return;$('teacher-output').textContent=output;
    await command('demo',{code,output});if(version===demoVersion)demoDirty=false;$('demo-status').textContent='Broadcast to the safe projector and joined student screens.';
  }
  async function poll(){if(polling||!roomId||$('teacher-app').hidden)return;polling=true;try{receive(await call('heartbeat'));}catch(e){message('Live connection paused: '+e.message+' Student drafts stay on their devices.',true);}finally{polling=false;}}
  async function privateRpc(name,args){const {data,error}=await G.db().rpc(name,args);if(error)throw Error(error.message);return data;}
  async function records(){
    $('records-status').textContent='Loading private lesson work…';const rows=await privateRpc('y8_gameclub_teacher_records',{p_class_name:$('records-class').value||null,p_limit:100,p_offset:recordPage*100});
    $('records-list').innerHTML='<table><thead><tr><th>Student</th><th>Last save</th><th>Original core checks</th><th>Learning history</th><th>Work</th></tr></thead><tbody>'+rows.slice().sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id)).map(r=>'<tr><td>'+E(r.name+' · '+r.className)+'</td><td>'+E(when(r.updated))+'</td><td>'+r.coreMet+'/8 (not a grade)</td><td>'+r.eventCount+' events</td><td><button data-record="'+r.id+'">View all work</button></td></tr>').join('')+'</tbody></table>';
    $('records-prev').disabled=recordPage===0;$('records-next').disabled=rows.length<100;$('records-status').textContent=rows.length?'Saved sessions · page '+(recordPage+1)+'. Refresh to see the latest school sync.':'No records for this filter.';
  }
  const readable=v=>v&&typeof v==='object'?(v.en||JSON.stringify(v)):String(v??'');
  function learningWork(c,r){
    if(!r)return '<p>Not attempted. Do not infer misunderstanding from missing work.</p>';
    let html='<p><b>Status:</b> '+E(r.status||'Draft')+' · Hints: '+(r.hintCount||Number(!!r.hintShown))+(r.helpRequested?' · Help requested':'')+'</p>';
    if(r.answer!==undefined)html+='<h4>Student response</h4><pre>'+E(c.type==='choice'?readable(c.options?.[r.answer]):r.explanation||readable(r.answer))+'</pre>';
    if(r.typed)html+='<h4>Typing practice · not programming mastery</h4><pre>'+E(r.typed)+'</pre>';
    if(r.code!==undefined)html+='<h4>Latest code</h4><pre>'+E(r.code)+'</pre><h4>Console / error</h4><pre>'+E((r.stdout||r.transcript||'(No output)')+(r.error?'\n'+r.error:''))+'</pre>';
    if(c.type==='len-tutor')html+='<h4>Supplied len example · not pupil-authored</h4><pre>'+E(c.model)+'</pre><p>Example run: '+!!r.exampleRun+'</p><pre>'+E(r.stdout||'(Not run)')+'</pre>';
    if(r.feedback?.message)html+='<p><b>Feedback:</b> '+E(r.feedback.message)+'</p>';
    html+=(r.attempts||[]).map((a,i)=>'<details><summary>Attempt '+(i+1)+' · '+E(when(a.at))+' · '+E(a.suppliedModel?'Supplied example':a.ok===true?'Check met':a.ok===false?'Needs revision':'Recorded')+'</summary>'+(a.code!==undefined?'<pre>'+E(a.code)+'</pre><h4>Run output</h4><pre>'+E((a.stdout||a.transcript||'')+(a.error?'\n'+a.error:''))+'</pre>':'')+(a.answer!==undefined?'<p>'+E(c.type==='choice'?readable(c.options?.[a.answer]):readable(a.answer))+'</p>':'')+(a.feedback?'<p>'+E(a.feedback)+'</p>':'')+'</details>').join('');
    return html+'<details><summary>All saved fields for this activity</summary><pre>'+E(JSON.stringify(r,null,2))+'</pre></details>';
  }
  function paintRecord(){
    const d=recordDetail,responses=d.snapshot?.responses||{},cards=window.LESSON?.cards||[],done=Object.values(responses).filter(r=>['correct','viewed','reflected'].includes(r.status)).length;
    $('record-detail').hidden=false;$('record-detail').innerHTML='<h2>'+E(d.name+' · '+d.className)+'</h2><p>'+done+'/'+cards.length+' activities marked complete · not a grade. Last save '+E(when(d.updated))+'.</p><p>Support: '+E(d.snapshot.language||'en')+'. Current card: '+E(cards.find(c=>c.id===d.snapshot.current)?.title||d.snapshot.current)+'.</p><div class="gc-actions"><button id="record-refresh">Refresh this student</button><button id="record-download">Download complete private trace</button></div><h3>KSU and all lesson activities</h3>'+cards.map(c=>{
      const r=responses[c.id];return '<details><summary>'+E(c.stage+' · '+c.title+' · '+(r?.status||'Not attempted'))+'</summary><p>'+E(readable(c.question))+'</p>'+learningWork(c,r)+'</details>';
    }).join('')+'<h3>Live checkpoints saved with this learning session</h3>'+Object.values(d.snapshot.live||{}).map(x=>'<details><summary>Checkpoint '+x.round+' · '+E(x.kind==='revision'?'Model-supported improvement':'First-response workspace')+' · '+(x.submitted?'sent':'draft')+'</summary><h4>Code</h4><pre>'+E(x.code||'(No code)')+'</pre><h4>Output / error</h4><pre>'+E((x.output||'')+(x.error?'\n'+x.error:''))+'</pre><p>'+(x.runs||[]).length+' runs stored. Full live history is available in Live class → View history.</p></details>').join('')+'<h3>Learning timeline</h3><p>'+recordEvents.length+' of '+recordTotal+' events shown. Edits are grouped, not keylogged.</p>'+recordEvents.map(x=>'<details><summary>'+E(x.kind+' · '+(x.card_id||'lesson')+' · '+when(x.received_at))+'</summary><pre>'+E(JSON.stringify(x.data,null,2))+'</pre></details>').join('')+'<button id="record-older" '+(recordEvents.length>=recordTotal?'disabled':'')+'>Show older events</button>';
    $('record-refresh').onclick=()=>openRecord(d.id).catch(e=>message(e.message,true));$('record-download').onclick=()=>downloadRecord().catch(e=>message(e.message,true));$('record-older').onclick=async()=>{try{const page=await privateRpc('y8_gameclub_teacher_detail',{p_session_id:d.id,p_limit:200,p_before:recordEvents.at(-1)?.server_seq});recordEvents.push(...page.events);paintRecord();}catch(e){message(e.message,true);}};
  }
  async function openRecord(id){recordDetail=await privateRpc('y8_gameclub_teacher_detail',{p_session_id:id,p_limit:200});recordEvents=recordDetail.events;recordTotal=recordDetail.eventCount;paintRecord();}
  async function downloadRecord(){
    const d=await privateRpc('y8_gameclub_teacher_detail',{p_session_id:recordDetail.id,p_limit:200}),events=[...d.events];
    while(events.length<d.eventCount){const page=await privateRpc('y8_gameclub_teacher_detail',{p_session_id:d.id,p_limit:200,p_before:events.at(-1)?.server_seq});if(!page.events.length)break;events.push(...page.events);}
    G.download({...d,events,exportedAt:new Date().toISOString()},('Private_GameClub_'+d.className+'_'+d.name+'.json').replace(/[^\p{L}\p{N}._-]/gu,'_'));
  }
  $('board-stage').insertAdjacentHTML('beforeend',[...new Set(G.cues.map(c=>c[2]).filter(x=>!x.startsWith('Live discussion')))].map(x=>'<option>'+E(x)+'</option>').join(''));
  $('room-title').closest('.gc-panel').id='gc-overview';$('round-title').closest('.gc-panel').id='gc-round-controls';$('response-grid').closest('.gc-panel').id='gc-responses';
  $('cue-table').innerHTML=G.cues.map(c=>'<tr>'+[c[0]+'–'+c[1],...c.slice(2)].map(x=>'<td>'+E(x)+'</td>').join('')+'</tr>').join('');
  $('teacher-login-form').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;try{const {error}=await G.db().auth.signInWithPassword({email:$('teacher-email').value.trim(),password:$('teacher-password').value});if(error)throw error;await authenticate();}catch(e){message(e.message,true);}finally{$('teacher-password').value='';b.disabled=false;}};
  $('teacher-signout').onclick=async()=>{clearTimeout(demoTimer);demoVersion++;PythonRunner.stop();roomId='';data=null;recordDetail=null;recordEvents=[];selectedHistory=[];tiles.clear();painted=new WeakMap();for(const id of ['response-grid','records-list','record-detail','detail-work','detail-history','awards-list','room-stats'])$(id).replaceChildren();$('detail-title').textContent='';$('room-select').replaceChildren();$('student-detail').hidden=true;$('room-dashboard').hidden=true;await G.db().auth.signOut({scope:'local'});await authenticate();message('Signed out. Private classroom data cleared from this view.');};
  $('open-class').onclick=async()=>{try{const value=await call('create',{className:$('teacher-class').value},null);roomId=value.room.id;receive(value);await rooms();message('Class open. Students enter their own name and class at the normal lesson link.');}catch(e){message(e.message,true);}};
  $('room-select').onchange=e=>openRoom(e.target.value).catch(e=>message(e.message,true));$('clock-toggle').onclick=()=>command('clock').catch(()=>{});$('board-stage').onchange=e=>command('stage',{stage:e.target.value}).catch(()=>{});
  $('end-class').onclick=()=>{if(confirm('End this live class and release everyone? All responses, histories and points are kept.'))command('end').then(rooms).catch(()=>{});};
  $('teacher-code').onkeydown=e=>G.indent(e.target,e);$('teacher-code').oninput=()=>{demoDirty=true;demoVersion++;$('teacher-output').textContent='Teacher is editing. Run will show the output.';clearTimeout(demoTimer);demoTimer=setTimeout(()=>broadcast().catch(e=>message(e.message,true)),500);};
  $('demo-run').onclick=()=>{clearTimeout(demoTimer);broadcast(true).catch(e=>message(e.message,true));};$('demo-stop').onclick=()=>PythonRunner.stop();$('demo-reset').onclick=()=>{if(confirm('Restore the supplied example? Pupil work remains unchanged.')){$('teacher-code').value=G.rounds[room().round].model;demoVersion++;demoDirty=true;broadcast(true).catch(e=>message(e.message,true));}};
  $('student-search').oninput=filter;$('detail-round').onchange=paintStudent;$('close-detail').onclick=()=>{selected='';$('student-detail').hidden=true;};$('detail-award').onclick=()=>award(selected,Number($('point-amount').value),$('point-reason').value).catch(e=>message(e.message,true));
  $('export-live').onclick=async()=>{try{const attempts=[];for(const s of data.students){const x=await call('history',{studentId:s.id});attempts.push(...x.attempts);}G.download({lesson:'gameclub-live-v1',...data,attempts,exportedAt:new Date().toISOString()},'Private_GameClub_'+room().className+'_Live_Record.json');}catch(e){message(e.message,true);}};
  function tabs(next){tab=next;$('live-tab').hidden=next!=='live';$('records-tab').hidden=next!=='records';$('tab-live').setAttribute('aria-pressed',String(next==='live'));$('tab-records').setAttribute('aria-pressed',String(next==='records'));if(next==='records')records().catch(e=>message(e.message,true));}
  $('tab-live').onclick=()=>tabs('live');$('tab-records').onclick=()=>tabs('records');$('records-refresh').onclick=()=>records().catch(e=>message(e.message,true));$('records-class').onchange=()=>{recordPage=0;records().catch(e=>message(e.message,true));};$('records-prev').onclick=()=>{recordPage=Math.max(0,recordPage-1);records().catch(e=>message(e.message,true));};$('records-next').onclick=()=>{recordPage++;records().catch(e=>message(e.message,true));};
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.record){openRecord(b.dataset.record).catch(e=>message(e.message,true));return;}if(!data)return;
    if(b.dataset.invite)command('invite',{round:Number(b.dataset.invite)}).catch(()=>{});
    if(b.dataset.command){const a=b.dataset.command;command(a,a==='reveal'?{code:G.rounds[room().round].model,output:G.rounds[room().round].output}:a==='extend'?{seconds:Number(b.dataset.seconds)}:{}).catch(()=>{});}
    if(b.dataset.detail)student(b.dataset.detail).catch(e=>message(e.message,true));if(b.dataset.award)award(b.dataset.award).catch(e=>message(e.message,true));if(b.dataset.undo)command('undoAward',{awardId:b.dataset.undo}).catch(()=>{});
    if(b.dataset.access&&confirm('Change live access for this entry? All saved work and histories remain.'))command('admit',{studentId:b.dataset.access,status:b.dataset.status}).catch(()=>{});
    if(b.dataset.helpResolved)command('helpResolved',{studentId:b.dataset.helpResolved}).catch(()=>{});
  });
  authenticate().catch(e=>message(e.message,true));setInterval(poll,3000);setInterval(tick,1000);
})();
