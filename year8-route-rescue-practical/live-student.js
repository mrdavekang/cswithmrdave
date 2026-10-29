/* Live rounds are an additional workspace. Polling never rebuilds the practical card. */
(() => {
  'use strict';
  const R=RouteLive,$=id=>document.getElementById(id),E=R.esc;
  let profile='',member=null,room=null,own=null,lastSeen=0,lastDiscovery=0,offset=0,polling=false,joinedRound=null,viewKey='',context=null,saveTimer,pending=false,serial=Promise.resolve(),failure='',blocked=false,dismissed=false,connectedNoticeUntil=0;
  const celebration=window.RouteCelebrations?.create();
  const root=document.createElement('div');root.id='route-live-root';document.body.append(root);
  root.innerHTML='<div id="live-dock" class="live-dock" hidden></div><section id="live-layer" class="live-layer" aria-label="Live coding workspace" hidden><div class="live-shell" id="live-shell"></div></section><div id="live-attention" class="live-screen-lock" hidden><div><h2>Eyes to the board</h2><p>Your practical is saved. We are comparing our code together.</p><p class="live-language" id="attention-language"></p><button id="see-discussion" class="button primary">See the live demonstration</button><p class="live-note">Your teacher will open Follow along when it is time to edit.</p><button id="attention-recovery" class="text-button">Connection problem? Return to my saved work</button></div></div>';
  const getStore=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
  const putStore=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}};
  const state=()=>RouteApp.getState();
  const tr=(en,zh,ko)=>state()?.language==='zh'?zh:state()?.language==='ko'?ko:en;
  const support=(zh,ko)=>state()?.language==='en'?'':'<p class="live-language">'+E(state()?.language==='zh'?zh:ko)+'</p>';
  function status(text,bad=false){const e=$('live-status');if(e){e.textContent=text;e.classList.toggle('live-error',bad);}}
  function currentRoom(){const r=R.effective(room,Date.now()+offset);if(r&&Date.now()-lastSeen>15000){r.connected=false;r.phase='work';}return r;}
  const key=(round=room?.round,kind=R.kind(room||{}))=>room?.id+':'+round+':'+kind;
  function record(){const s=state();if(!s||!room)return null;s.live=s.live||{};const k=key();if(!s.live[k]){
    const prior=s.live[key(room.round,'initial')],server=own?.responses?.find(x=>x.round_no===room.round&&x.kind===R.kind(room));
    s.live[k]={roomId:room.id,round:room.round,kind:R.kind(room),code:server?.code??(R.kind(room)==='revision'?prior?.code:null)??R.rounds[room.round].starter,output:server?.output||'',error:server?.error||'',runs:[],synced:!!server,submitted:!!server?.submitted_at};
  }return s.live[k];}
  function persist(){RouteApp.saveLive();}
  function token(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');}
  function credentialsKey(){return 'route-live-member:'+profile;}
  function attach(){
    const s=state(),next=s?s.name.trim().toLowerCase()+':'+s.className:'';
    if(next!==profile){
      leaveView(false);profile=next;room=null;own=null;lastSeen=0;lastDiscovery=0;failure='';blocked=false;dismissed=false;connectedNoticeUntil=0;
      member=getStore(credentialsKey());
      if(s&&!s.teacher&&(!member||!/^[a-f0-9]{64}$/.test(member.token||'')))member={token:token()};
      if(member)putStore(credentialsKey(),member);
    }
    if(!s){$('live-dock').hidden=true;return;}
    if(s.teacher){dock();return;}
    dock();poll(true);
  }
  async function call(action,data={}){
    if(!member?.code)throw Error('Your live class is connecting automatically.');
    try{return await R.rpc('student',{p_action:action,p_code:member.code,p_token:member.token,p_data:data});}
    catch(e){if(/current code|Classroom is not open|different class/i.test(e.message))throw Error('This live session has closed. Your work is saved; reconnecting automatically.');throw e;}
  }
  function accept(data){
    if(!data?.room||room?.id===data.room.id&&data.room.revision<room.revision)return;
    const oldPhase=room?.phase,newConnection=room?.id!==data.room.id;room=data.room;own=data;offset=Date.parse(room.serverNow)-Date.now();lastSeen=Date.now();failure='';blocked=false;
    if(newConnection)connectedNoticeUntil=Date.now()+5000;
    celebration?.observe(room,data.awards||[],data.student?.id||profile);
    if(oldPhase!=='discuss'&&room.phase==='discuss')dismissed=false;
    if(own.student?.status==='admitted')record();
  }
  function disconnected(){
    if(room||context)leaveView(true);
    room=null;own=null;lastSeen=0;
    if(member?.code){member={token:member.token};putStore(credentialsKey(),member);}
  }
  async function poll(force=false){
    const s=state();if(polling||!s||s.teacher||!['8T','8E'].includes(s.className))return;
    polling=true;const identity=profile,credentials=member;
    try{
      if(force||!room||!member?.code||Date.now()-lastDiscovery>=12000){
        lastDiscovery=Date.now();
        const data=await R.rpc('autojoin',{p_token:credentials.token,p_name:s.name,p_class:s.className});
        if(identity!==profile||credentials!==member)return;
        if(data.waiting||data.blocked){disconnected();blocked=!!data.blocked;failure='';return;}
        if(room&&room.id!==data.room.id)leaveView(true);
        if(member.code!==data.room.code){member={token:credentials.token,code:data.room.code};putStore(credentialsKey(),member);}
        accept(data);
      }else{
        const data=await call('read');if(identity===profile&&credentials===member)accept(data);
      }
    }catch(e){
      if(identity===profile){failure='Live connection unavailable. Your practical is saved. Retrying automatically.';
        if(/closed|not admitted|not open/i.test(e.message)){disconnected();lastDiscovery=0;}
      }
    }finally{polling=false;paint();}
  }
  function dock(){
    const s=state(),d=$('live-dock');
    const show=visible=>{d.hidden=!visible;document.body.classList.toggle('live-bottom-space',visible);};
    if(!s){show(false);return;}show(true);
    if(s.teacher){R.paint(d,'<span class="live-pill">Teacher preview</span><p>This entry does not grant access to student records.</p><a class="button primary" href="teacher.html" target="_blank" rel="noopener">Open teacher dashboard ↗</a>');return;}
    if(!room||!member?.code){
      const title=blocked?'Speak to your teacher':failure?'Reconnecting to your class':'Ready for your live class';
      const text=blocked?'Your teacher has paused your live access. Your practical work remains available.':!['8T','8E'].includes(s.className)?'Choose 8T or 8E on the entry page for a live class.':failure||tr('You will connect automatically when your teacher opens the live class. Keep working on your practical.','老师开启实时课堂后，你会自动连接。现在可以继续练习。','선생님이 실시간 수업을 열면 자동으로 연결됩니다. 실습을 계속하세요.');
      R.paint(d,'<span class="live-pill">'+E(s.className)+'</span><div><b>'+E(title)+'</b><p>'+E(text)+'</p></div><button id="live-retry" class="button outline">Check live connection</button>');return;
    }
    const r=currentRoom(),admitted=own?.student?.status==='admitted';
    if(admitted&&r?.connected&&r.phase==='work'&&!context&&!failure&&Date.now()>=connectedNoticeUntil){show(false);return;}
    const title=failure?'Reconnecting to your class':!admitted?'Connecting to your class':!r?.connected?'Practical work · live connection paused':r.phase==='work'?'Live class connected':r.phase==='invite'?'Live question ready':r.phase==='discuss'?'Class discussion':r.phase==='follow'?'Follow along with your teacher':'Live coding is open';
    R.paint(d,'<span class="live-pill">'+E(room.className)+'</span><div class="live-dock-message"><b>'+E(title)+'</b><p>'+E(failure||(r?.phase==='invite'?'Open the question when you are ready. Your practical is saved.':r?.phase==='work'?'You are registered with your teacher. Continue your practical.':R.rounds[r?.round||1].title))+'</p></div><div id="dock-response-clock" class="response-clock" hidden></div>'+(admitted&&r?.connected&&r.phase!=='work'?'<button id="join-round" class="button primary">Open live question</button>':'')+(context&&r?.phase==='work'?'<button id="resume-practical" class="button primary">Resume my practical →</button>':''));
    R.paintCountdown($('dock-response-clock'),r,Date.now()+offset);
  }
  function savePosition(){if(!context)context=RouteApp.capture();RouteApp.suspend();}
  async function enter(){const r=currentRoom();if(!r?.connected||own?.student?.status!=='admitted')return;savePosition();joinedRound=r.round;dismissed=false;viewKey='';paint();try{accept(await call('ready'));}catch(e){status(e.message,true);}}
  function leaveView(restore=true){$('live-layer').hidden=true;$('live-attention').hidden=true;$('workspace').inert=false;if(restore&&context)RouteApp.restore(context);context=null;joinedRound=null;viewKey='';}
  function renderWorkspace(r){const c=R.rounds[r.round],rec=record(),editable=R.writable(r),discuss=r.phase==='discuss',model=r.revealed&&r.demo;
    const steps=r.round===1?['Keep the supplies list on the first line.','Add one instruction to print only the stored value radio. Read it from the list; do not type a new radio string.','Press Run. Compare with the target, then choose Send my response.']:['Keep the gear list on the first line.','Use an index to replace only map with compass. Do not rewrite the list.','Print the whole list, press Run, then choose Send my response.'];
    $('live-shell').innerHTML='<header class="live-top"><span class="live-pill">LIVE '+r.round+' · '+E(r.phase==='follow'?'FOLLOW ALONG':R.kind(r)==='revision'?'CORRECTION':'FIRST ATTEMPT')+'</span><h1>'+E(c.title)+'</h1><span class="spacer"></span><label>Support <select id="live-language"><option value="en">English</option><option value="zh">中文</option><option value="ko">한국어</option></select></label><strong id="live-timer" class="live-count"></strong><button id="live-minimise" class="button outline">Keep my place</button></header><div id="workspace-response-clock" class="response-clock response-clock-wide" hidden></div><div id="live-phase-note" class="live-banner"></div><div class="live-brief-grid"><section class="live-task-brief"><h2>Your coding task</h2><p class="live-question-prompt">'+E(c.prompt)+'</p>'+support(c.zh,c.ko)+'<ol>'+steps.map(t=>'<li>'+E(t)+'</li>').join('')+'</ol></section><section class="live-target-brief study-reference"><h2>Expected output</h2><p>After running your completed code, your console should show:</p><pre>'+E(c.output)+'</pre><p>Type Python in <b>Your Python code</b> below—not in this output target.</p></section></div><div class="live-grid">'+
      '<section class="live-panel"><h2>'+E(R.kind(r)==='revision'?'Your correction':'Your response')+'</h2><p class="live-note">'+E(R.kind(r)==='revision'?'Try the improvement yourself. Your original attempt is kept.':'Type below. Run to see the result, then send your response.')+'</p><label for="live-code-editor">Your Python code</label><textarea id="live-code-editor" class="live-editor" spellcheck="false" autocapitalize="off" maxlength="8000">'+E(rec.code)+'</textarea><div class="live-actions"><button id="live-run" class="button run">▶ Run</button><button id="live-stop" class="button outline">■ Stop</button><button id="live-submit" class="button primary">Send my response</button><button id="live-help" class="button outline">I need help</button></div><pre id="live-output" class="live-output" aria-label="Your Python output">'+E(rec.output+(rec.error?'\n'+rec.error:''))+'</pre><p id="live-status" class="live-status" role="status">'+E(rec.synced?'Latest response saved to classroom.':'Draft saved on this device.')+'</p></section>'+
      '<section class="live-panel live-model"><h2>'+(model?'Teacher’s live demonstration':'Look for the important index')+'</h2><div id="live-demo"></div><p class="live-note">Teacher example and your work are separate. Follow the change, then try it yourself.</p></section></div>';
    const editor=$('live-code-editor');editor.disabled=!editable;editor.onkeydown=e=>{R.indent(editor,e);if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run();}};
    editor.oninput=()=>{const a=record();a.code=editor.value;a.output='';a.error='';a.synced=false;a.submitted=false;a.editedAt=new Date().toISOString();persist();$('live-output').textContent='Code changed. Run this version.';status('Saved on this device · sending…');clearTimeout(saveTimer);saveTimer=setTimeout(()=>queue('save'),650);};
    $('live-run').onclick=run;$('live-stop').onclick=()=>RouteRunner.stop();$('live-submit').onclick=()=>queue('submit');$('live-help').onclick=async()=>{try{accept(await call('help',{help:true}));status('Your teacher can see your help signal.');}catch(e){status(e.message,true);}};
    $('live-language').value=state().language;$('live-language').onchange=e=>RouteApp.setLanguage(e.target.value);
    $('live-minimise').onclick=()=>{RouteApp.suspend();$('live-layer').hidden=true;viewKey='';dismissed=true;paint();};updateWorkspace(r);
  }
  function updateWorkspace(r){const rec=record(),editable=R.writable(r);$('live-code-editor').disabled=!editable;$('live-run').disabled=!editable||RouteRunner.busy();$('live-submit').disabled=!editable;
    document.querySelector('#live-shell .live-model h2').textContent=r.revealed?'Teacher’s live demonstration':'Look for the important index';
    $('live-timer').textContent=r.phase==='follow'?'Follow along':r.pausedSeconds!=null?'Paused':r.phase==='invite'?'Get ready':r.phase==='discuss'?'Discuss':R.time(R.remaining({...r,deadline:r.deadline?new Date(Date.parse(r.deadline)-offset).toISOString():null}));
    R.paintCountdown($('workspace-response-clock'),r,Date.now()+offset);
    $('live-phase-note').textContent=r.phase==='invite'?tr('Ready? Keep the starter line. Your teacher starts the timer when the class is ready.','保留开头的列表。全班准备好后，老师开始计时。','시작 리스트를 유지하세요. 준비되면 선생님이 타이머를 시작합니다.'):r.phase==='discuss'?tr('Eyes to the board. Compare ideas; your teacher will open Follow along for corrections.','先看前面的讲解。老师开启“跟着做”后，你就可以修改代码。','앞의 설명을 보세요. 선생님이 따라 하기를 열면 코드를 수정할 수 있어요.'):r.phase==='follow'?tr('Follow along: watch the teacher’s code change here, then edit and Run your own version.','跟着做：观察老师的代码变化，再修改并运行自己的代码。','따라 하기: 선생님의 코드 변화를 보고 자신의 코드를 수정하고 실행하세요.'):r.pausedSeconds!=null?'Timer paused. Your draft is safe.':'Try it yourself. A mistake is useful evidence, not a lost house point.';
    const model=r.demo,html=model?'<span class="live-pill">TEACHER EXAMPLE · LIVE</span><pre>'+E(model.code)+'</pre><b>Teacher’s output</b><pre class="live-output">'+E(model.output||'Teacher is editing. Run will show the output.')+'</pre><p>'+E(R.rounds[r.round].explain)+'</p>':'<pre>'+E(R.rounds[r.round].starter)+'</pre><p>Use the index, then compare your output with the question.</p>';
    R.paint($('live-demo'),html);
    if(rec.submitted)status('Response sent. Later edits need sending again.');
  }
  function paint(){dock();const r=currentRoom(),admitted=own?.student?.status==='admitted';
    if(!admitted||!r?.connected||r.phase==='work'){
      if(!$('live-layer').hidden){$('live-layer').hidden=true;viewKey='';}
      $('live-attention').hidden=true;$('workspace').inert=false;return;
    }
    if(joinedRound===r.round&&!dismissed){$('workspace').inert=true;$('live-layer').hidden=false;$('live-attention').hidden=true;const k=r.round+':'+R.kind(r);if(viewKey!==k){viewKey=k;RouteApp.suspend();renderWorkspace(r);}else updateWorkspace(r);}
    else if(r.phase==='discuss'&&!dismissed){RouteApp.suspend();$('live-attention').hidden=false;$('workspace').inert=true;$('attention-language').textContent=tr('','你的代码已保存。现在看老师的讲解。','코드가 저장됐어요. 지금은 선생님의 설명을 보세요.');}
    else{$('live-attention').hidden=true;$('workspace').inert=false;}
  }
  async function run(){const r=currentRoom();if(!R.writable(r)||RouteRunner.busy())return;const rec=record(),code=rec.code,k=key();$('live-run').disabled=true;$('live-output').textContent='';const result=await RouteRunner.run(code,null,()=>Promise.resolve(''));rec.runs=rec.runs||[];const attempt={at:new Date().toISOString(),code,output:result.stdout||'',error:result.error||'',kind:rec.kind};rec.runs.push(attempt);if(rec.code===code){rec.output=attempt.output;rec.error=attempt.error;rec.synced=false;}persist();if(key()===k&&$('live-output')){$('live-output').textContent=rec.output+(rec.error?'\n'+rec.error:'');$('live-run').disabled=!R.writable(currentRoom());}queue('run',attempt,k);}
  function queue(action,snapshot,recordKey){clearTimeout(saveTimer);const rec=snapshot?{...snapshot,round:Number((recordKey||key()).split(':')[1]),kind:(recordKey||key()).split(':')[2]}:{...record()},target=recordKey||key(),identity=profile,credentials=member;
    if(!rec)return;const packet={round:rec.round,kind:rec.kind,code:rec.code,output:rec.output||'',error:rec.error||'',eventId:crypto.randomUUID()};pending=true;
    serial=serial.catch(()=>{}).then(async()=>{if(identity!==profile||credentials!==member)return;try{const data=await call(action,packet);accept(data);const item=state()?.live?.[target];if(item&&item.code===rec.code){item.synced=true;item.submitted=action==='submit';item.savedAt=new Date().toISOString();persist();}if(key()===target)status(action==='submit'?'Response sent to your teacher.':'Saved to classroom.');}catch(e){failure=e.message;status('Not sent: '+e.message+' Keep this draft or export your report.',true);}finally{pending=false;}});return serial;
  }
  root.addEventListener('click',e=>{const id=e.target.closest('button')?.id;if(id==='live-retry')poll(true);if(id==='join-round'||id==='see-discussion')enter();if(id==='resume-practical'){leaveView();paint();}if(id==='attention-recovery'){dismissed=true;leaveView();paint();}});
  document.addEventListener('route-profile',attach);document.addEventListener('route-language',()=>{viewKey='';paint();});
  setInterval(()=>{if(state()&&!state().teacher)poll();},3000);setInterval(()=>{if(room)paint();},1000);
  window.addEventListener('online',poll);window.addEventListener('beforeunload',()=>{if(pending)persist();});attach();
})();
