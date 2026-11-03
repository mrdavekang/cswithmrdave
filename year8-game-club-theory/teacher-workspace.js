/* Linear teacher workspace. Existing server permissions and checkpoint commands stay intact. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),G=GameLive,T=GameTeaching,E=G.esc,A=GameTeacherController,q=new URLSearchParams(location.search);
  const origin=location.origin;
  const move=(node,host)=>host.append(node);
  if(q.get('view')==='responses'){
    document.body.classList.add('gc-response-mode');
    document.querySelector('.gc-dash-header h1').textContent='Game Club · Student responses';
    document.title='Game Club · Private student responses';const back=document.querySelector('.gc-dash-header>a');back.textContent='Return to teaching window ↗';back.onclick=e=>{e.preventDefault();if(window.opener&&!window.opener.closed)window.opener.focus();else window.open('teacher.html','gameclub-teaching-workspace');};$('gc-responses').querySelector('h2').textContent='Student responses & house points';
    const archive=document.createElement('div');archive.hidden=true;
    const roomRoot=$('room-dashboard');for(const node of [...roomRoot.children])archive.append(node);roomRoot.append(archive);
    const head=document.createElement('div');head.className='ws-response-head';head.innerHTML='<div><h2 id="ws-response-class">Waiting for class selection</h2><small>Private window · responses, code attempts and house points</small></div><button id="ws-response-refresh">Reconnect responses</button>';
    roomRoot.append(head,$('gc-responses'),$('student-detail'),$('awards-list').closest('.gc-panel'));
    $('tab-live').innerHTML='Live responses<span>Read this checkpoint and award house points</span>';
    $('tab-records').innerHTML='Saved lesson work<span>Review all activities, code and progress</span>';
    $('ws-response-refresh').onclick=()=>A.reconnect();
    let wanted=q.get('room')||'',opening='';
    async function attach(){if($('teacher-app').hidden||!wanted||wanted===A.roomId()||opening===wanted)return;opening=wanted;try{await A.openRoom(wanted);}catch(e){$('teacher-message').textContent='Cannot open this class: '+e.message;}finally{opening='';}}
    document.addEventListener('gameclub-teacher-auth',e=>{if(e.detail.signedIn)attach();});
    document.addEventListener('gameclub-teacher-updated',()=>{$('ws-response-class').textContent=A.current()?.className+' · Checkpoint '+A.current()?.round+' · '+G.rounds[A.current()?.round]?.title+(A.current()?.ended?' · saved session':'');});
    window.addEventListener('message',e=>{if(e.origin!==origin||e.source!==window.opener)return;if(e.data?.type==='gameclub-response-class'&&/^[a-f0-9-]{36}$/i.test(e.data.roomId||'')){wanted=e.data.roomId;attach();}if(e.data?.type==='gameclub-teacher-signed-out')$('teacher-signout').click();});
    A.ready.then(async()=>{await attach();if(q.get('tab')==='records'&&!$('teacher-app').hidden)A.tab('records');});
    return;
  }
  document.body.classList.add('gc-workspace-mode');
  const route=GameTeacherRoute,labels={'Briefing':'Mission','Export PDF':'Save & submit'},token=crypto.randomUUID();
  let index=0,reveal=0,mode='page',roomId='',roomSignature='',board=null,responses=null,projecting=false,navBusy=false,frameReady=false,requestSeq=0,demoVersion=0,demoOutput=null;
  const pending=new Map(),positions=new Map(),examples=new Map();
  try{for(const [room,page]of JSON.parse(sessionStorage.getItem('gameclub-teacher-position-v1')||'[]')){const i=route.findIndex(p=>p.id===page);if(/^[a-f0-9-]{36}$/i.test(room)&&i>=0)positions.set(room,i);}}catch{}
  function remember(){positions.set(A.roomId(),index);try{sessionStorage.setItem('gameclub-teacher-position-v1',JSON.stringify([...positions].map(([room,i])=>[room,route[i].id])));}catch{}}
  const roomRoot=$('room-dashboard'),legacy=document.createElement('div');legacy.hidden=true;
  for(const node of [...roomRoot.children])legacy.append(node);roomRoot.append(legacy);
  const tabs=document.querySelector('.gc-mode-tabs');legacy.append(tabs);
  const classbar=document.createElement('section');classbar.id='ws-classbar';classbar.innerHTML='<span id="ws-session">Choose your class</span><span class="ws-spacer"></span><button id="ws-responses" class="ws-top-button" disabled>Student responses ↗</button><button id="ws-settings-open" class="ws-top-button">Class settings</button>';
  const classLabel=document.querySelector('label[for="teacher-class"]');classbar.prepend(classLabel,$('open-class'));
  $('live-tab').prepend(classbar);
  const welcome=document.createElement('section');welcome.id='ws-welcome';welcome.className='ws-empty';welcome.innerHTML='<h2>Your lesson, in order.</h2><p>Choose your class above, then select <b>Open selected live class</b>.</p><ol><li>The centre shows the same activity your pupils see.</li><li>Use Previous and Next along the bottom. Teaching slides appear before each Main Task.</li><li>Live controls and teacher notes stay on the right.</li><li>Student responses and house points open in their own private window.</li></ol>';
  roomRoot.before(welcome);
  const shell=document.createElement('section');shell.className='ws-app';shell.innerHTML='<nav class="ws-journey" aria-label="Linear teaching journey"><h2>Lesson journey</h2><div id="ws-stages"></div></nav><section class="ws-centre"><header class="ws-page-heading"><p id="ws-crumb"></p><span id="ws-kind" class="ws-chip"></span></header><div class="ws-canvas"><iframe id="ws-pupil-preview" title="Actual student activity · teacher rehearsal only" src="index.html?teacher=1&amp;teacherEmbed=1"></iframe><div id="ws-slide" class="ws-slide-host" hidden></div><section id="ws-discussion" class="ws-live-question" hidden></section><section id="ws-example" class="ws-demo" hidden><h2>Demonstrate this model</h2><p>This example appears on the projector only. It never replaces pupil code.</p><label for="ws-example-code">Teacher example</label><textarea id="ws-example-code" spellcheck="false" autocapitalize="off" maxlength="8000"></textarea><div class="ws-demo-actions"><button id="ws-example-run">▶ Run example &amp; show output</button><button id="ws-example-stop" disabled>■ Stop example</button><button id="ws-example-back">Back to teaching slide</button></div><pre id="ws-example-output">Run the model to see its output.</pre><p id="ws-example-status" role="status"></p></section><section id="ws-live-demo" class="ws-demo" hidden></section></div></section><aside class="ws-right" aria-label="Teacher notes and live controls"><section class="ws-clock"><div><small>LESSON ELAPSED</small><div id="ws-clock-slot"></div></div><span id="ws-class-count" class="ws-chip">Class not open</span><div id="ws-clock-button"></div></section><section class="ws-goals"><h2>WAGBA</h2><p>'+E(LESSON.wagba)+'</p><div class="ws-ksu">'+['K','S','U'].map(g=>'<b>'+g+'</b><span>'+E(LESSON.goals[g].en)+'</span>').join('')+'</div></section><section class="ws-context"><h2 id="ws-context-title">Teacher cue</h2><div id="ws-notes"></div><div id="ws-teach-tools" hidden><button id="ws-open-example" class="ws-respond-button">Demonstrate this model</button></div><div id="ws-independent"><p id="ws-cue"></p><label for="ws-language">Preview language<select id="ws-language"><option value="en">English</option><option value="zh">English + 中文</option><option value="ko">English + 한국어</option></select></label><p>Teacher rehearsal only. Your answers are not saved as pupil work.</p><button id="ws-open-discussion" class="ws-respond-button" hidden>Open the live question</button></div><div id="ws-live-controls" hidden><div id="ws-live-clock"></div><button id="ws-invite" class="ws-respond-button">Invite pupils</button><div id="ws-round-controls"></div><div id="ws-command-status"></div><button id="ws-live-demonstrate" class="ws-respond-button" hidden>Demonstrate the revealed answer</button></div><div id="ws-live-notice" class="ws-live-notice" hidden><p class="ws-live-status" id="ws-live-summary"></p><button id="ws-return-live">Return to live discussion</button></div><button id="ws-right-responses" class="ws-respond-button">Student responses &amp; house points ↗</button><p id="ws-status" role="status"></p></section></aside><footer class="ws-bottom"><button id="ws-back">← Previous</button><div class="ws-position"><label for="ws-page-select">All lesson pages · does not move pupils</label><select id="ws-page-select"></select></div><div class="ws-context-action"><button id="ws-reveal" hidden>Reveal visual</button><button id="ws-release" data-command="release" hidden>Return class to tasks</button><button id="ws-project">Open projector ↗</button></div><button id="ws-next">Next →</button><div class="ws-page-progress"><span id="ws-position-label"></span><progress id="ws-page-progress" aria-label="Position in teacher lesson sequence"></progress><span id="ws-next-label"></span></div></footer>';
  roomRoot.append(shell);move($('teacher-message'),$('ws-status').parentElement);
  if($('teacher-app').hidden)$('teacher-login').before($('teacher-message'));
  move($('lesson-clock'),$('ws-clock-slot'));move($('clock-toggle'),$('ws-clock-button'));move($('round-clock'),$('ws-live-clock'));move($('round-controls'),$('ws-round-controls'));move($('gc-action-status'),$('ws-command-status'));move($('teacher-demo-panel'),$('ws-live-demo'));
  const settings=document.createElement('dialog');settings.id='ws-settings';settings.className='ws-settings';settings.innerHTML='<button id="ws-settings-close" class="ws-top-button">Close settings ×</button><h2>Class settings</h2><p>Lesson navigation is in the main window. These controls manage the class connection, projector stage and saved sessions.</p>';
  const clockPanel=$('cue-title').closest('.gc-panel');legacy.append(document.querySelector('label[for="board-stage"]'));clockPanel.querySelector('.gc-control-note')?.remove();settings.append(document.querySelector('label[for="room-select"]'),$('teacher-reconnect'),clockPanel,$('gc-session-finish'),$('teacher-signout'));document.body.append(settings);
  $('ws-settings-open').onclick=()=>settings.showModal();$('ws-settings-close').onclick=()=>settings.close();$('room-select').addEventListener('change',()=>settings.close());
  $('ws-page-select').innerHTML=route.map((p,i)=>'<option value="'+i+'">'+(i+1)+'. '+E((labels[p.stage]||p.stage)+' · '+(p.kind==='teaching'?'TEACH · ':'')+p.title)+'</option>').join('');
  const stages=[...new Set(route.map(p=>p.stage))];$('ws-stages').innerHTML=stages.map((s,i)=>'<button class="ws-stage" data-ws-stage="'+E(s)+'"><b>'+(i+1)+'</b><span>'+E(labels[s]||s)+'<small>'+route.filter(p=>p.stage===s).length+' pages</small></span></button>').join('');
  const frame=$('ws-pupil-preview');
  const say=(text,bad=false)=>{$('ws-status').textContent=text;$('ws-status').style.color=bad?'#9d273c':'';};
  function ask(action,cardId,language){return new Promise(resolve=>{if(!frameReady){say('The activity preview is loading. Try again in a moment.',true);resolve(false);return;}const requestId=++requestSeq,timer=setTimeout(()=>{pending.delete(requestId);say('The preview did not respond. Your class is unchanged. Try again.',true);resolve(false);},6000);pending.set(requestId,{resolve,timer});frame.contentWindow.postMessage({type:'gameclub-preview-control',requestId,action,cardId,language},origin);});}
  function projectionPacket(){const p=route[index],r=A.current();return {type:'gameclub-teaching',token,active:p.kind!=='discussion'||!r?.connected||r.phase==='work'||r.round!==p.round,id:p.slide?.id||'m1-1',step:reveal,view:p.kind==='activity'?'activity':p.kind==='discussion'?'checkpoint':'slide',cardId:p.card?.id,round:p.round,language:$('ws-language').value,...(mode==='example'&&demoOutput?{demo:demoOutput}:{})};}
  function sendProjection(){if(projecting&&board&&!board.closed)board.postMessage(projectionPacket(),origin);}
  function openProjector(){if(!A.roomId()){say('Open your class first.',true);return;}const url=new URL($('projector-link').href,location.href);url.searchParams.set('teaching',token);url.searchParams.set('slide',route[index].slide?.id||'m1-1');board=window.open(url.href,'gameclub-teaching-'+token);projecting=!!board;$('ws-project').textContent=board?'Reopen projector ↗':'Allow popup · retry ↗';say(board?'Projector follows your lesson page. Notes and responses stay private.':'Allow the projector popup, then select Open projector again.',!board);}
  function openResponses(){if(!A.roomId())return;if(responses&&!responses.closed){responses.focus();responses.postMessage({type:'gameclub-response-class',roomId:A.roomId()},origin);return;}responses=window.open('teacher.html?view=responses&room='+encodeURIComponent(A.roomId()),'gameclub-student-responses');say(responses?'Student responses are in a separate private window.':'Allow the response popup, then try again.',!responses);}
  $('ws-responses').onclick=openResponses;$('ws-right-responses').onclick=openResponses;$('ws-project').onclick=openProjector;
  function notes(p){
    $('ws-independent').hidden=p.kind!=='activity';$('ws-teach-tools').hidden=p.kind!=='teaching'||!['lab','loop','random','finished'].includes(p.slide.kind);
    $('ws-context-title').textContent=p.kind==='teaching'?'Speaker notes · teacher only':p.kind==='discussion'?'Live discussion controls':'Teacher cue';
    if(p.kind==='teaching'){const n=GameTeachingNotes[p.slide.id];$('ws-notes').innerHTML='<p><b>Discussion answer</b><br>'+E(n.answer)+'</p><p lang="zh-Hans">'+E(n.zh)+'</p><p><b>Teaching cue</b><br>'+E(n.cue)+'</p><p><b>Watch for</b><br>'+E(n.misconception)+'</p>';}
    else{$('ws-notes').replaceChildren();const cue=G.cues.find(c=>c[2]===p.stage);$('ws-cue').textContent=cue?.[3]||'Let pupils complete this activity, then move on together.';}
  }
  function paint(){
    const p=route[index];$('ws-crumb').innerHTML='<strong>'+E(labels[p.stage]||p.stage)+'</strong> · '+E(p.title);$('ws-kind').textContent=p.kind==='teaching'?'TEACHING SLIDE':p.kind==='discussion'?'LIVE DISCUSSION':'STUDENT ACTIVITY';
    for(const b of document.querySelectorAll('[data-ws-stage]')){if(b.dataset.wsStage===p.stage)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');}
    $('ws-page-select').value=index;$('ws-position-label').textContent='Page '+(index+1)+' / '+route.length;$('ws-page-progress').max=route.length;$('ws-page-progress').value=index+1;$('ws-next-label').textContent=route[index+1]?'Next: '+route[index+1].title:'End of lesson';$('ws-back').disabled=index===0;$('ws-next').disabled=index===route.length-1;
    frame.hidden=p.kind!=='activity'||mode!=='page';$('ws-slide').hidden=p.kind!=='teaching'||mode!=='page';$('ws-discussion').hidden=p.kind!=='discussion'||mode!=='page';$('ws-example').hidden=mode!=='example';$('ws-live-demo').hidden=mode!=='live-demo';
    $('ws-reveal').hidden=p.kind!=='teaching'||mode!=='page';$('ws-reveal').disabled=p.kind==='teaching'&&reveal>=p.slide.steps;$('ws-reveal').textContent=p.kind==='teaching'?(reveal>=p.slide.steps?'All visuals shown':'Reveal visual '+(reveal+1)+'/'+p.slide.steps):'Reveal';
    if(p.kind==='teaching')$('ws-slide').innerHTML=T.render(p.slide.id,reveal);
    document.querySelector('.ws-goals').hidden=p.kind==='teaching';notes(p);updateLive();sendProjection();
  }
  async function go(next){next=Math.max(0,Math.min(route.length-1,Number(next)||0));if(navBusy||next===index)return;if(PythonRunner.busy()){say('Stop your teacher demonstration before changing pages.',true);$('ws-page-select').value=index;return;}const targetRoom=A.roomId();navBusy=true;try{
      const ok=await ask('leave');if(!ok){say('Finish or stop the program running in the activity preview before moving on.',true);$('ws-page-select').value=index;return;}
      if(targetRoom!==A.roomId())return;const p=route[next];if(p.kind==='activity'&&!await ask('navigate',p.card.id,$('ws-language').value)){ $('ws-page-select').value=index;return;}if(targetRoom!==A.roomId())return;
      index=next;remember();reveal=0;mode='page';demoOutput=null;demoVersion++;paint();say('');
    }finally{navBusy=false;}}
  $('ws-back').onclick=()=>go(index-1);$('ws-next').onclick=()=>go(index+1);$('ws-page-select').onchange=e=>go(e.target.value);$('ws-stages').onclick=e=>{const b=e.target.closest('[data-ws-stage]');if(b)go(route.findIndex(p=>p.stage===b.dataset.wsStage));};
  $('ws-reveal').onclick=()=>{if(route[index].kind==='teaching'){reveal=Math.min(reveal+1,route[index].slide.steps);paint();}};
  $('ws-language').onchange=async()=>{if(route[index].kind==='activity')await ask('navigate',route[index].card.id,$('ws-language').value);sendProjection();};
  function updateLive(){
    const r=A.current(),p=route[index],here=p.kind==='discussion',same=here&&p.round===r?.round;
    $('ws-release').hidden=!r?.connected||r.phase==='work';$('ws-release').disabled=!!r?.ended;
    $('ws-open-discussion').hidden=p.kind!=='activity'||!['Main Task 1','Main Task 2','Loop typing reset'].includes(p.stage);
    $('ws-open-discussion').textContent='Open live question '+(p.stage==='Main Task 1'?1:2)+' · no timer yet';
    $('ws-live-controls').hidden=!here;$('ws-round-controls').hidden=!same;$('ws-live-clock').hidden=!same;$('ws-invite').hidden=!!r?.ended||same&&r.phase!=='work';$('ws-invite').textContent='Invite pupils to checkpoint '+(p.round||1);$('ws-invite').dataset.invite=String(p.round||1);
    $('ws-live-demonstrate').hidden=!same||!r.revealed;$('ws-live-demonstrate').textContent=mode==='live-demo'?'Show the question again':'Demonstrate the revealed answer';$('ws-live-notice').hidden=here||!r?.connected||r.phase==='work';$('ws-live-summary').textContent='Checkpoint '+(r?.round||1)+' is still live · '+(GameControlDesign.model(r||{ended:true}).state)+'. Navigation does not stop it.';
    if(here){const round=G.rounds[p.round],revealed=same&&r?.revealed;$('ws-discussion').innerHTML='<h2>'+E(round.title)+'</h2><p>'+E(round.prompt)+'</p><p lang="zh-Hans">'+E(round.zh)+'</p><div class="ws-live-code"><section><h3>'+(revealed?'REVEALED TEACHER EXAMPLE':'STARTING CODE · Pupils complete this')+'</h3><pre>'+E(revealed?r.demo?.code||round.model:round.starter)+'</pre></section><section><h3>'+(revealed?'TEACHER OUTPUT':'EXPECTED OUTPUT')+'</h3><pre>'+E(revealed?r.demo?.output||round.output:round.output)+'</pre></section></div><p class="ws-live-label">'+(same&&r?.phase!=='work'?E(GameControlDesign.model(r).state):'First invite pupils using the right-hand control. Inviting does not start the timer.')+'</p>';}
    if(here&&same&&r.revealed)GameCodeFocus.paint($('ws-discussion').querySelector('.ws-live-code section:first-child pre'),r.demo?.code||G.rounds[p.round].model,{key:'teacher-question:'+r.id+':'+r.round+':'+r.revealed});
  }
  $('ws-open-discussion').onclick=()=>go(route.findIndex(p=>p.kind==='discussion'&&p.round===(route[index].stage==='Main Task 1'?1:2)));
  $('ws-return-live').onclick=()=>go(route.findIndex(p=>p.kind==='discussion'&&p.round===A.current()?.round));
  $('ws-invite').addEventListener('click',()=>{mode='page';paint();});
  $('ws-live-demonstrate').onclick=()=>{mode=mode==='live-demo'?'page':'live-demo';paint();};
  $('ws-open-example').onclick=()=>{const p=route[index];if(p.kind!=='teaching')return;mode='example';$('ws-example-code').value=examples.get(p.id)||p.slide.code;GameCodeFocus.update($('ws-example-code'));$('ws-example-output').textContent='Run the model to see its output.';paint();};
  $('ws-example-code').oninput=()=>{const el=$('ws-example-code');examples.set(route[index].id,el.value);demoOutput={editing:true,code:el.value,output:'Teacher is editing. Run again to update the output.',lines:GameCodeFocus.activeLines(el)};$('ws-example-output').textContent=demoOutput.output;sendProjection();};$('ws-example-code').onkeydown=e=>G.indent(e.target,e);
  $('ws-example-run').onclick=async()=>{if(PythonRunner.busy()){say('Another teacher example is running. Stop it first.',true);return;}const version=++demoVersion,code=$('ws-example-code').value;$('ws-example-run').disabled=true;$('ws-example-stop').disabled=false;$('ws-example-status').textContent='Running…';try{const result=await PythonRunner.run(code);if(version!==demoVersion)return;const output=(result.stdout||'')+(result.error?'\n'+result.error:'');demoOutput={code,output,lines:GameCodeFocus.activeLines($('ws-example-code'))};$('ws-example-output').textContent=output;$('ws-example-status').textContent=result.error?'Read the error and try a small correction.':'Run complete. Open the projector to share this example.';sendProjection();}finally{$('ws-example-run').disabled=false;$('ws-example-stop').disabled=true;}};
  GameCodeFocus.attach($('ws-example-code'));
  $('ws-example-stop').onclick=()=>PythonRunner.stop();$('ws-example-back').onclick=()=>{if(PythonRunner.busy()){say('Stop the example first.',true);return;}mode='page';demoOutput=null;paint();};
  window.addEventListener('message',e=>{
    if(e.origin!==origin)return;
    if(e.source===board&&e.data?.type==='gameclub-teaching-ready'&&e.data.token===token){sendProjection();return;}
    if(e.source!==frame.contentWindow||e.data?.type!=='gameclub-preview-state')return;
    const first=!frameReady;frameReady=true;const d=e.data,task=pending.get(d.requestId);if(task){clearTimeout(task.timer);pending.delete(d.requestId);task.resolve(d.ok);return;}
    if(first){const p=route[index];if(A.roomId()&&p.kind==='activity'&&p.id!==d.current)ask('navigate',p.id,$('ws-language').value);return;}
    if(!navBusy&&route[index]?.kind==='activity'&&route[index].id!==d.current){const i=LESSON.cards.findIndex(c=>c.id===route[index].id),next=LESSON.cards[i+1];go(next?.id===d.current?index+1:route.findIndex(p=>p.kind==='activity'&&p.id===d.current));}
  });
  document.addEventListener('gameclub-teacher-updated',()=>{
    const r=A.current();if(!r)return;$('ws-welcome').hidden=true;$('ws-session').textContent=r.className+' · '+(r.ended?'Saved session':'Class open');$('ws-responses').disabled=false;
    const admitted=$('room-stats').querySelector('b')?.textContent||'0';$('ws-class-count').textContent=admitted+(admitted==='1'?' pupil':' pupils');
    if(roomId!==A.roomId()){roomId=A.roomId();index=positions.get(roomId)||0;reveal=0;mode='page';demoOutput=null;if(responses&&!responses.closed)responses.postMessage({type:'gameclub-response-class',roomId},origin);if(frameReady&&route[index].kind==='activity')ask('navigate',route[index].id,$('ws-language').value);paint();if(projecting&&board&&!board.closed)openProjector();}
    const sig=r.round+':'+r.phase+':'+r.revealed+':'+JSON.stringify(r.demo);updateLive();if(sig!==roomSignature&&route[index].kind==='discussion'){roomSignature=sig;sendProjection();}
    if(mode==='live-demo'&&!r.revealed){mode='page';paint();}
  });
  document.addEventListener('gameclub-teacher-auth',e=>{if(e.detail.signedIn){move($('teacher-message'),$('ws-status').parentElement);}else{if(responses&&!responses.closed)responses.postMessage({type:'gameclub-teacher-signed-out'},origin);projecting=false;roomId='';$('ws-session').textContent='Choose your class';$('ws-responses').disabled=true;$('ws-welcome').hidden=false;settings.close();$('teacher-login').before($('teacher-message'));}});
  paint();
})();
