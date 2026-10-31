/* This overlay never rebuilds the lesson card underneath it. Registration has no pupil join code. */
(() => {
  'use strict';
  const G=GameLive,E=G.esc,$=id=>document.getElementById(id);
  let identity='',credential=null,room=null,own=null,offset=0,lastSeen=0,noticeUntil=0,polling=false,lastDiscover=0,
    failure='',view='',serial=Promise.resolve(),saveTimer,running=false,attentionKey='',dismissedAttention='',busySend=false;
  const celebration=GameCelebrations.create();
  const root=document.createElement('div');root.id='gc-live-root';
  root.innerHTML='<aside id="gc-live-dock" class="gc-live-dock" hidden aria-label="Live classroom invitation"><div><strong id="gc-dock-title"></strong><p id="gc-dock-text"></p></div>'+G.clockHTML()+'<button id="gc-join" class="gc-primary">Join live question →</button></aside><dialog id="gc-live-dialog" class="gc-live-dialog" aria-labelledby="gc-live-title"><div id="gc-live-content"></div></dialog><dialog id="gc-attention" class="gc-attention" aria-labelledby="gc-attention-title"><h2 id="gc-attention-title">Eyes to the board</h2><p id="gc-attention-copy"></p><button id="gc-see-demo" class="gc-primary">See the teacher’s demonstration</button><button id="gc-recovery">Connection problem? Return to my work</button></dialog>';
  document.body.append(root);
  const indicator=document.createElement('button');indicator.id='gc-live-indicator';indicator.type='button';indicator.textContent='Live class · checking';document.querySelector('.toolbar>div')?.append(indicator);
  const teacherLink=document.createElement('a');teacherLink.href='teacher.html';teacherLink.target='_blank';teacherLink.rel='noopener noreferrer';teacherLink.className='gc-button';teacherLink.textContent='Live teacher dashboard ↗';teacherLink.hidden=true;document.querySelector('.toolbar .tools')?.append(teacherLink);
  const state=()=>window.GameClubBridge?.getState();
  const tr=(en,zh,ko)=>state()?.language==='zh'?en+' · '+zh:state()?.language==='ko'?en+' · '+ko:en;
  const save=(action='draft',data={})=>window.GameClubBridge?.saveLive(action,data);
  const now=()=>Date.now()+offset;
  const current=()=>{const r=G.effective(room,now());if(r&&Date.now()-lastSeen>18000){r.connected=false;r.phase='work';}return r;};
  const key=(r=room,k=G.kind(r))=>r.id+':'+r.round+':'+k;
  function rec(){
    if(!room||!state())return null;const s=state();s.live ||= {};const k=key(),server=own?.responses.find(x=>x.round_no===room.round&&x.kind===G.kind(room));
    if(!s.live[k])s.live[k]={roomId:room.id,round:room.round,kind:G.kind(room),code:server?.code??s.live[key(room,'initial')]?.code??G.rounds[room.round].starter,output:server?.output||'',error:server?.error||'',runs:[],version:server?.version||0,submitted:!!server?.submitted_at,dirty:false};
    return s.live[k];
  }
  function status(text,bad=false){const e=$('gc-live-status');if(e){e.textContent=text;e.classList.toggle('gc-error',bad);}}
  function close(){if(running)PythonRunner.stop();$('gc-live-dialog').close();view='';}
  function accept(data){
    if(!data.room||room?.id===data.room.id&&(data.room.revision<room.revision||Date.parse(data.room.serverNow)<Date.parse(room.serverNow)))return;
    if(room?.id!==data.room.id){close();noticeUntil=Date.now()+5000;attentionKey='';dismissedAttention='';}
    room=data.room;own=data;offset=Date.parse(room.serverNow)-Date.now();lastSeen=Date.now();failure='';
    // Server versions are recorded separately from local edits. A delayed poll never replaces typing.
    const s=state();if(s?.live)for(const x of data.responses||[]){const k=room.id+':'+x.round_no+':'+x.kind,r=s.live[k];if(r&&!r.dirty&&(x.version||0)>=(r.version||0)){Object.assign(r,{code:x.code,output:x.output,error:x.error,version:x.version,submitted:!!x.submitted_at});}}
    celebration.observe(room,data.awards||[],data.student.id);render();
  }
  async function poll(force=false){
    const s=state();if(polling||!s||s.teacher||!credential)return;polling=true;const who=identity,cap=credential;
    try{
      let data;
      if(force||!room||Date.now()-lastDiscover>12000){lastDiscover=Date.now();data=await G.rpc('join',{p_token:cap.token,p_name:s.name,p_class:s.className});}
      else data=await G.rpc('student',{p_action:'read',p_room:room.id,p_token:cap.token});
      if(identity!==who||credential!==cap)return;
      if(data.waiting||data.blocked){room=null;own=null;failure=data.blocked?'Speak to your teacher about live access.':'';close();$('gc-attention').close();render();return;}
      accept(data);
    }catch(e){if(identity===who){failure=e.message;render();}}finally{polling=false;}
  }
  function attach(){
    const s=state(),next=s&&!s.teacher?s.name.trim()+':'+s.className:'';
    if(next===identity){render();return;}close();$('gc-attention').close();clearTimeout(saveTimer);identity=next;room=null;own=null;failure='';lastSeen=0;lastDiscover=0;credential=null;
    if(next){const store='gameclub-live-member:'+next;try{credential=JSON.parse(localStorage.getItem(store));}catch{}
      if(!/^[a-f0-9]{64}$/.test(credential?.token||''))credential={token:Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('')};
      try{localStorage.setItem(store,JSON.stringify(credential));}catch{failure='Live membership cannot survive refresh on this device. Your lesson work is still available.';}
      poll(true);
    }render();
  }
  function render(){
    const s=state(),d=$('gc-live-dock'),r=current();
    teacherLink.hidden=!s?.teacher;indicator.hidden=!s||s.teacher;
    if(!s||s.teacher){d.hidden=true;document.body.classList.remove('gc-has-dock');return;}
    const active=r?.connected&&r.phase!=='work';
    indicator.textContent=failure?'Live connection · needs attention':r?.connected?'Live class · '+(active?'question ready':'connected'):'Live class · waiting for teacher';indicator.title=failure||'Your work saves independently. Live invitations appear when your teacher opens a round.';
    d.hidden=!active&&Date.now()>noticeUntil;document.body.classList.toggle('gc-has-dock',!d.hidden);
    if(!d.hidden){
      $('gc-dock-title').textContent=active?G.rounds[r.round].title:tr('Live class connected','实时课堂已连接','실시간 수업 연결됨');
      $('gc-dock-text').textContent=active?tr('Open when ready. Your current task stays exactly where you left it.','准备好后点击加入。当前任务会保留。','준비되면 여세요. 원래 과제 위치는 그대로 유지됩니다.'):tr('Continue your own work. Invitations appear here.','继续自己的任务。邀请会显示在这里。','자신의 과제를 계속하세요. 초대는 여기에 표시됩니다.');
      $('gc-join').hidden=!active;G.countdown(d.querySelector('.gc-countdown'),r?{...r,viewerSubmitted:!!state()?.live?.[key(r)]?.submitted}:r,now());
    }
    if(!r?.connected||r.phase==='work'){
      if($('gc-live-dialog').open)close();$('gc-attention').close();return;
    }
    const roundKey=r.id+':'+r.round;
    if($('gc-live-dialog').open){if(view!==key(r)){if(running)PythonRunner.stop();buildWorkspace(r);}updateWorkspace(r);}
    if(r.phase==='discuss'&&attentionKey!==roundKey+':'+r.responseEpoch){attentionKey=roundKey+':'+r.responseEpoch;dismissedAttention='';}
    if(r.phase==='discuss'&&!$('gc-live-dialog').open&&dismissedAttention!==attentionKey){
      $('gc-attention-copy').textContent=tr('Your code is saved. Compare the class ideas now. You can follow the teacher’s demonstration on your device; editing reopens when your teacher selects Follow along.','代码已保存。现在一起比较想法。你可以在设备上看老师的示范；老师开启 Follow along 后再修改。','코드가 저장됐습니다. 함께 생각을 비교하세요. 기기에서 시연을 볼 수 있고 Follow along이 열리면 수정할 수 있습니다.');
      if(!$('gc-attention').open)$('gc-attention').showModal();
    }else if(r.phase!=='discuss')$('gc-attention').close();
  }
  async function enter(){
    const r=current();if(!r?.connected||r.phase==='work')return;
    if(window.GameClubBridge?.busy()||PythonRunner.busy()){status('Finish or stop your current program first.');$('gc-dock-text').textContent='Finish or stop the program running in your lesson, then join.';return;}
    $('gc-attention').close();buildWorkspace(r);$('gc-live-dialog').showModal();updateWorkspace(r);
    try{accept(await G.rpc('student',{p_action:'ready',p_room:r.id,p_token:credential.token}));}catch(e){status(e.message,true);}
  }
  function buildWorkspace(r){
    view=key(r);const c=G.rounds[r.round],a=rec();
    $('gc-live-content').innerHTML='<header class="gc-modal-head"><div><span class="gc-eyebrow">LIVE CHECKPOINT '+r.round+'</span><h2 id="gc-live-title">'+E(c.title)+'</h2></div><button id="gc-resume">Return to my task →</button></header>'+G.clockHTML()+
      '<p id="gc-phase-note" class="gc-callout"></p><div class="gc-two"><section class="gc-question"><h3>'+E(tr('Your coding task','你的编程任务','코딩 과제'))+'</h3><p class="gc-task-prompt">'+E(c.prompt)+'</p>'+(state().language!=='en'?'<p class="gc-translation">'+E(c[state().language])+'</p>':'')+'<ol>'+c.steps.map((x,i)=>'<li>'+E(x)+(state().language!=='en'?'<br><span class="gc-translation">'+E(c[state().language==='zh'?'stepsZh':'stepsKo'][i])+'</span>':'')+'</li>').join('')+'</ol></section><section class="gc-target"><h3>'+E(tr('Expected output','预期输出','예상 출력'))+'</h3><p>Compare all lines, in order.</p><pre>'+E(c.output)+'</pre><p>'+E(tr('Type Python below, not in this target.','在下面的编辑器输入 Python，不要输入在这个目标框。','아래 편집기에 Python을 입력하세요. 이 목표 칸에 입력하지 마세요.'))+'</p></section></div>'+
      '<div class="gc-two"><section><h3>Your Python code · '+(G.kind(r)==='revision'?'improved version':'first response')+'</h3><label for="gc-live-code">Edit here. Keep the starter data.</label><textarea id="gc-live-code" class="gc-editor" spellcheck="false" autocapitalize="off" autocomplete="off" maxlength="8000">'+E(a.code)+'</textarea><div class="gc-actions"><button id="gc-live-run" class="gc-run">▶ Run</button><button id="gc-live-stop">■ Stop</button><button id="gc-send" class="gc-primary">Send my response</button><button id="gc-help">I need help</button></div><pre id="gc-live-output" class="gc-console">'+E(a.output+(a.error?'\n'+a.error:''))+'</pre><p id="gc-live-status" role="status"></p><button id="gc-work-after-send" hidden>Response sent · continue my own task →</button></section><section class="gc-demo"><h3>Teacher’s live demonstration</h3><p>Teacher example and your own code are separate.</p><pre id="gc-demo-code"></pre><h4>Teacher’s output</h4><pre id="gc-demo-output" class="gc-console"></pre><p id="gc-demo-explain"></p></section></div>';
    const editor=$('gc-live-code');editor.onkeydown=e=>{G.indent(editor,e);if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run();}};
    editor.oninput=()=>{const a=rec();a.code=editor.value;a.output='';a.error='';a.dirty=true;a.submitted=false;a.editedAt=new Date().toISOString();save('edit',{round:a.round,kind:a.kind});$('gc-live-output').textContent='Code changed. Run this version.';status('Draft saved here · sending…');clearTimeout(saveTimer);saveTimer=setTimeout(()=>send('save'),800);};
    $('gc-live-run').textContent=tr('▶ Run','运行','실행');$('gc-send').textContent=tr('Send my response','发送我的回答','응답 보내기');$('gc-resume').textContent=tr('Return to my task →','返回自己的任务 →','원래 과제로 →');
    $('gc-live-run').onclick=run;$('gc-live-stop').onclick=()=>PythonRunner.stop();$('gc-send').onclick=()=>send('submit');
    $('gc-help').onclick=async()=>{try{accept(await G.rpc('student',{p_action:'help',p_room:room.id,p_token:credential.token}));status('Your teacher can see your help signal.');}catch(e){status(e.message,true);}};
    $('gc-resume').onclick=close;$('gc-work-after-send').onclick=close;
  }
  function updateWorkspace(r){
    const a=rec(),edit=G.writable(r,now());$('gc-live-code').readOnly=!edit||running;
    $('gc-live-run').disabled=!edit||running||busySend;$('gc-send').disabled=!edit||running||busySend;$('gc-live-stop').disabled=!running;
    $('gc-resume').disabled=running;$('gc-work-after-send').hidden=!a.submitted;
    G.countdown($('gc-live-dialog').querySelector('.gc-countdown'),{...r,viewerSubmitted:!!a.submitted},now());
    $('gc-phase-note').textContent=r.phase==='invite'?tr('Get ready. Read the task; your teacher starts the timer. Your saved response stays here if this invitation reopens.','先阅读任务，等待老师开始计时。重新邀请时，你的回答仍会保留。','과제를 읽고 선생님이 타이머를 시작할 때까지 기다리세요. 다시 초대돼도 응답은 유지됩니다.'):r.phase==='discuss'?tr('Eyes to the board. Your teacher is discussing the code. Editing opens in Follow along.','看前面的讲解。开启 Follow along 后再修改。','앞의 설명을 보세요. Follow along에서 수정할 수 있습니다.'):r.phase==='follow'||r.phase==='retry'?tr('Watch the live model here, then improve and run your own code. Your first response is kept.','观察实时示范，再改进并运行自己的代码。第一次回答会保留。','실시간 예시를 보고 자신의 코드를 개선해 실행하세요. 첫 응답은 유지됩니다.'):tr('Run, compare, then Send my response. After sending, you may continue your own task while the timer runs.','运行并比较，再发送回答。发送后可以在计时结束前继续自己的任务。','실행하고 비교한 뒤 응답을 보내세요. 보내면 시간이 남아 있어도 자신의 과제를 계속할 수 있습니다.');
    $('gc-demo-code').textContent=r.demo?.code||G.rounds[r.round].starter;$('gc-demo-output').textContent=r.demo?.output||'The worked answer is not revealed yet.';
    $('gc-demo-explain').textContent=r.revealed?G.rounds[r.round].explanation:'Use the question and expected output to try your own idea first.';
  }
  async function run(){
    const r=current();if(!G.writable(r,now())||PythonRunner.busy())return;const a=rec(),code=a.code,k=key();running=true;updateWorkspace(r);$('gc-live-output').textContent='';
    const result=await PythonRunner.run(code);running=false;const attempt={at:new Date().toISOString(),code,output:result.stdout||'',error:result.error||''};a.runs.push(attempt);
    if(a.code===code){a.output=attempt.output;a.error=attempt.error;a.dirty=true;}save('run',{round:a.round,kind:a.kind,...attempt});
    if(view===k&&$('gc-live-output')){$('gc-live-output').textContent=a.output+(a.error?'\n'+a.error:'');updateWorkspace(current());}send('run',a,attempt);
  }
  function send(action,source=rec(),snapshot=null){
    clearTimeout(saveTimer);if(!source)return Promise.resolve();const a=source,who=identity,cap=credential,roomId=room.id;
    const packet={round:a.round,kind:a.kind,code:snapshot?.code??a.code,output:snapshot?.output??a.output,error:snapshot?.error??a.error,eventId:crypto.randomUUID()};
    busySend=true;if($('gc-live-dialog').open)updateWorkspace(current());
    serial=serial.catch(()=>{}).then(async()=>{
      if(who!==identity||cap!==credential)return;
      try{
        const result=await G.rpc('student',{p_action:action,p_room:roomId,p_token:cap.token,p_data:{...packet,baseVersion:a.version||0}});
        const server=result.responses.find(x=>x.round_no===a.round&&x.kind===a.kind);if(server)a.version=server.version;
        if(a.code===packet.code){a.dirty=false;a.submitted=!!server?.submitted_at;}
        save(action,{round:a.round,kind:a.kind,code:packet.code,output:packet.output,error:packet.error,submitted:a.submitted});accept(result);
        status(action==='submit'?'Response sent. You may return to your own task now.':'Saved to the live classroom.');
      }catch(e){status('Not sent: '+e.message+' Your draft is kept here. Use Send again when the response window opens.',true);save('sync-paused',{round:a.round,error:e.message});}
      finally{busySend=false;if($('gc-live-dialog').open)updateWorkspace(current());}
    });return serial;
  }
  $('gc-join').onclick=enter;$('gc-see-demo').onclick=enter;
  indicator.onclick=()=>{if(current()?.connected&&current().phase!=='work')enter();else{noticeUntil=Date.now()+5000;render();$('gc-dock-text').textContent=failure||'Keep working. A live question will appear when your teacher invites the class.';poll(true);}};
  $('gc-recovery').onclick=()=>{dismissedAttention=attentionKey;$('gc-attention').close();};
  $('gc-attention').addEventListener('cancel',e=>{e.preventDefault();dismissedAttention=attentionKey;$('gc-attention').close();});
  $('gc-live-dialog').addEventListener('cancel',e=>{if(running){e.preventDefault();return;}dismissedAttention=attentionKey;view='';});
  document.addEventListener('gameclub-profile',attach);document.addEventListener('gameclub-language',()=>{view='';render();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll(true);});window.addEventListener('online',()=>poll(true));
  setInterval(()=>{if(state()&&!state().teacher)poll();},3000);setInterval(render,1000);attach();
})();
