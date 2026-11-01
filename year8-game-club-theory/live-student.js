/* This overlay never rebuilds the lesson card underneath it. Registration has no pupil join code. */
(() => {
  'use strict';
  const G=GameLive,E=G.esc,$=id=>document.getElementById(id);
  let identity='',credential=null,room=null,own=null,offset=0,lastSeen=0,noticeUntil=0,lastDiscover=0,
    failure='',view='',serial=Promise.resolve(),saveTimer,running=false,attentionKey='',dismissedAttention='',busySend=false;
  const presence=GameConnection.lane(),sendJobs=new Set();
  let memoryOnly=false,checkingConnection=false,waiting=false;
  const celebration=GameCelebrations.create();
  const root=document.createElement('div');root.id='gc-live-root';
  root.innerHTML='<aside id="gc-live-dock" class="gc-live-dock" hidden aria-label="Live classroom invitation"><div><strong id="gc-dock-title"></strong><p id="gc-dock-text"></p></div>'+G.clockHTML()+'<button id="gc-join" class="gc-primary">Join live question →</button></aside><dialog id="gc-live-dialog" class="gc-live-dialog" aria-labelledby="gc-live-title"><div id="gc-live-content"></div></dialog><dialog id="gc-attention" class="gc-attention" aria-labelledby="gc-attention-title"><h2 id="gc-attention-title">Eyes to the board</h2><p id="gc-attention-copy"></p><button id="gc-see-demo" class="gc-primary">See the teacher’s demonstration</button><button id="gc-recovery">Connection problem? Return to my work</button></dialog>';
  document.body.append(root);
  const connectionBar=document.createElement('div');connectionBar.id='gc-live-connection';connectionBar.className='gc-live-connection';
  connectionBar.innerHTML='<div class="gc-connection-controls"><span id="gc-live-indicator" role="status" aria-live="polite"></span><button id="gc-reconnect" type="button">Reconnect to class</button></div><p id="gc-connection-detail" role="status"></p><div id="gc-storage-warning" hidden><p id="gc-storage-copy"></p><button id="gc-storage-backup" type="button">Download a work backup</button></div>';
  document.querySelector('.toolbar>div')?.append(connectionBar);const indicator=$('gc-live-indicator');
  const teacherLink=document.createElement('a');teacherLink.href='teacher.html';teacherLink.target='_blank';teacherLink.rel='noopener noreferrer';teacherLink.className='gc-button';teacherLink.textContent='Teacher dashboard ↗';teacherLink.hidden=true;document.querySelector('.toolbar .tools')?.append(teacherLink);
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
  function preserveDraft(){
    const editor=$('gc-live-code');if(!editor||!room||!state()||view!==key(room))return;
    const a=rec();if(a.code!==editor.value){a.code=editor.value;a.dirty=true;a.submitted=false;a.editedAt=new Date().toISOString();}
    save('connection-check',{round:a.round,kind:a.kind});
  }
  async function poll(force=false){
    const s=state();if(!s||s.teacher||!credential||document.hidden&&!force)return;
    if(presence.busy&&!force&&presence.age<12000)return;
    const who=identity,cap=credential;if(force)preserveDraft();
    checkingConnection=force||!waiting&&!current()?.connected;
    try{
      const discover=force||!room||Date.now()-lastDiscover>12000;
      if(discover)lastDiscover=Date.now();
      const task=presence.run(signal=>discover
        ?G.rpc('join',{p_token:cap.token,p_name:s.name,p_class:s.className},{signal})
        :G.rpc('student',{p_action:'read',p_room:room.id,p_token:cap.token},{signal}),{replace:force});
      render();const result=await task;
      if(result.skipped||result.superseded||identity!==who||credential!==cap)return;
      const data=result.value;
      if(data.waiting||data.blocked){
        waiting=!!data.waiting;failure=data.blocked?'Speak to your teacher about live access.':'';
        if(room)room={...room,connected:false};
        $('gc-attention').close();render();return;
      }
      waiting=false;accept(data);
    }catch(e){if(identity===who){failure=e.name==='TimeoutError'?'The connection took too long. Check Wi-Fi and tap Reconnect to class.':e.message;render();}}
    finally{if(identity===who&&!presence.busy){checkingConnection=false;render();}}
  }
  function attach(){
    const s=state(),next=s&&!s.teacher?s.name.trim()+':'+s.className:'';
    if(next===identity){if(next)poll(true);else render();return;}
    preserveDraft();presence.cancel();close();$('gc-attention').close();clearTimeout(saveTimer);
    identity=next;room=null;own=null;failure='';lastSeen=0;lastDiscover=0;credential=null;waiting=false;checkingConnection=false;memoryOnly=false;
    if(next){const member=GameConnection.member('gameclub-live-member:'+next);credential=member.credential;memoryOnly=member.memoryOnly;poll(true);}
    render();
  }
  function connectionState(){
    const r=current();
    if(checkingConnection)return tr('Live: Reconnecting…','实时课堂：正在重新连接…','실시간: 다시 연결 중…');
    if(failure||room&&!r?.connected&&!waiting)return tr('Live: Connection interrupted','实时课堂：连接中断','실시간: 연결 중단');
    return r?.connected?tr('Live: Connected · '+state().className,'实时课堂：已连接','실시간: 연결됨'):tr('Live: Waiting for teacher','实时课堂：等待老师','실시간: 선생님 기다리는 중');
  }
  function render(){
    const s=state(),d=$('gc-live-dock'),r=current();
    teacherLink.hidden=!s?.teacher;connectionBar.hidden=!s||s.teacher;
    if(!s||s.teacher){d.hidden=true;document.body.classList.remove('gc-has-dock');return;}
    const active=r?.connected&&r.phase!=='work';
    indicator.textContent=connectionState();indicator.dataset.state=checkingConnection?'checking':failure||room&&!r?.connected&&!waiting?'interrupted':r?.connected?'connected':'waiting';
    $('gc-reconnect').textContent=tr('Reconnect to class','重新连接课堂','교실에 다시 연결');
    $('gc-connection-detail').textContent=checkingConnection?tr('Keeping your code and lesson position. You can tap Reconnect again if a request stalls.','保留代码和学习位置。如请求卡住，可再次点击重新连接。','코드와 학습 위치를 유지합니다. 요청이 멈추면 다시 연결을 다시 누르세요.'):failure?failure:waiting?tr('Ask your teacher to open '+s.className+' on their live dashboard. Your work stays here.','请老师在实时面板打开 '+s.className+'。你的作品保留在这里。','선생님께 실시간 대시보드에서 '+s.className+'를 열어 달라고 하세요. 작업은 유지됩니다.'):'';
    $('gc-connection-detail').hidden=!$('gc-connection-detail').textContent;
    $('gc-storage-warning').hidden=!memoryOnly;$('gc-storage-copy').textContent=tr('Browser storage is unavailable. Your work is in this open tab: keep it open and download a backup before leaving.','浏览器存储不可用。作品保存在当前打开的标签中：请不要关闭，并在离开前下载备份。','브라우저 저장소를 사용할 수 없습니다. 열린 탭에 작업이 있습니다. 닫지 말고 나가기 전에 백업을 받으세요.');
    $('gc-storage-backup').textContent=tr('Download a work backup','下载作品备份','작업 백업 다운로드');
    d.hidden=!active&&Date.now()>noticeUntil;document.body.classList.toggle('gc-has-dock',!d.hidden);
    if(!d.hidden){
      $('gc-dock-title').textContent=active?G.rounds[r.round].title:tr('Live class connected','实时课堂已连接','실시간 수업 연결됨');
      $('gc-dock-text').textContent=active?tr('Open when ready. Your current task stays exactly where you left it.','准备好后点击加入。当前任务会保留。','준비되면 여세요. 원래 과제 위치는 그대로 유지됩니다.'):tr('Continue your own work. Invitations appear here.','继续自己的任务。邀请会显示在这里。','자신의 과제를 계속하세요. 초대는 여기에 표시됩니다.');
      $('gc-join').hidden=!active;$('gc-join').textContent=r?.phase==='discuss'?tr('View class discussion','查看课堂讨论','학급 토론 보기'):r?.phase==='follow'||r?.phase==='retry'?tr('Open code improvement','打开代码改进','코드 개선 열기'):r&&state()?.live?.[key(r)]?.submitted?tr('Review my sent answer','查看已发送的答案','보낸 답 보기'):tr('Open live coding question','打开实时编程题','실시간 코딩 문제 열기');G.countdown(d.querySelector('.gc-countdown'),r?{...r,viewerSubmitted:!!state()?.live?.[key(r)]?.submitted}:r,now());
    }
    if(!r?.connected){
      $('gc-attention').close();if($('gc-live-dialog').open&&room)updateWorkspace(r||{...room,connected:false});return;
    }
    if(r.phase==='work'){if($('gc-live-dialog').open)close();$('gc-attention').close();return;}
    const roundKey=r.id+':'+r.round;
    if($('gc-live-dialog').open){if(view!==key(r)){if(running)PythonRunner.stop();buildWorkspace(r);}updateWorkspace(r);}
    if(r.phase==='discuss'&&attentionKey!==roundKey+':'+r.responseEpoch){attentionKey=roundKey+':'+r.responseEpoch;dismissedAttention='';}
    if(r.phase==='discuss'&&!$('gc-live-dialog').open&&dismissedAttention!==attentionKey){
      $('gc-attention-copy').textContent=tr('Your code is saved. Compare the class ideas now. You can follow the teacher’s demonstration on your device; editing reopens when your teacher allows improvements.','代码已保存。现在一起比较想法。你可以在设备上看老师的示范；老师允许改进后再修改。','코드가 저장됐습니다. 함께 생각을 비교하세요. 기기에서 시연을 볼 수 있고 선생님이 개선을 허용하면 수정할 수 있습니다.');
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
    $('gc-live-content').innerHTML='<header class="gc-modal-head"><div><span class="gc-eyebrow">LIVE CHECKPOINT '+r.round+'</span><h2 id="gc-live-title">'+E(c.title)+'</h2></div><button id="gc-resume" class="gc-return-action">Back to my lesson task</button></header>'+G.clockHTML()+
      '<p id="gc-phase-note" class="gc-callout"></p><div class="gc-workspace-reconnect"><button id="gc-live-reconnect" type="button">Reconnect to class</button><small id="gc-workspace-connection" role="status"></small></div><div class="gc-two"><section class="gc-question"><h3>'+E(tr('Your coding task','你的编程任务','코딩 과제'))+'</h3><p class="gc-task-prompt">'+E(c.prompt)+'</p>'+(state().language!=='en'?'<p class="gc-translation">'+E(c[state().language])+'</p>':'')+'<ol>'+c.steps.map((x,i)=>'<li>'+E(x)+(state().language!=='en'?'<br><span class="gc-translation">'+E(c[state().language==='zh'?'stepsZh':'stepsKo'][i])+'</span>':'')+'</li>').join('')+'</ol></section><section class="gc-target"><h3>'+E(tr('Expected output','预期输出','예상 출력'))+'</h3><p>Compare all lines, in order.</p><pre>'+E(c.output)+'</pre><p>'+E(tr('Type Python below, not in this target.','在下面的编辑器输入 Python，不要输入在这个目标框。','아래 편집기에 Python을 입력하세요. 이 목표 칸에 입력하지 마세요.'))+'</p></section></div>'+
      '<div class="gc-two"><section><h3>Your Python code · '+(G.kind(r)==='revision'?'improved version':'first response')+'</h3><label for="gc-live-code">Edit here. Keep the starter data.</label><textarea id="gc-live-code" class="gc-editor" spellcheck="false" autocapitalize="off" autocomplete="off" maxlength="8000">'+E(a.code)+'</textarea><div class="gc-live-actions"><div class="gc-code-testing"><button id="gc-live-run" class="gc-run">▶ Run my code</button><button id="gc-live-stop">Stop my code</button><small id="gc-run-hint"></small></div><div class="gc-code-sending"><button id="gc-send" class="gc-primary">Send answer to teacher</button><small id="gc-send-hint"></small></div><button id="gc-help" class="gc-help-action">Ask teacher for help</button></div><pre id="gc-live-output" class="gc-console">'+E(a.output+(a.error?'\n'+a.error:''))+'</pre><p id="gc-live-status" role="status"></p><button id="gc-work-after-send" hidden>Response sent · continue my own task →</button></section><section class="gc-demo"><h3>Teacher’s live demonstration</h3><p>Teacher example and your own code are separate.</p><pre id="gc-demo-code"></pre><h4>Teacher’s output</h4><pre id="gc-demo-output" class="gc-console"></pre><p id="gc-demo-explain"></p></section></div>';
    const editor=$('gc-live-code');editor.onkeydown=e=>{G.indent(editor,e);if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run();}};
    editor.oninput=()=>{const a=rec();a.code=editor.value;a.output='';a.error='';a.dirty=true;a.submitted=false;a.editedAt=new Date().toISOString();save('edit',{round:a.round,kind:a.kind});$('gc-live-output').textContent='Code changed. Run this version.';status('Draft saved here · sending…');clearTimeout(saveTimer);saveTimer=setTimeout(()=>send('save'),800);};
    $('gc-live-run').textContent=tr('▶ Run my code','▶ 运行我的代码','▶ 내 코드 실행');$('gc-live-stop').textContent=tr('Stop my code','停止我的代码','내 코드 중지');$('gc-send').textContent=tr('Send answer to teacher','把答案发给老师','선생님께 답 보내기');$('gc-help').textContent=tr('Ask teacher for help','向老师求助','선생님께 도움 요청');$('gc-resume').textContent=tr('Back to my lesson task','返回自己的课堂任务','내 수업 과제로 돌아가기');$('gc-run-hint').textContent=tr('1 · Test your code and read its output. Running is not the same as sending your answer.','1 · 测试代码并阅读输出。运行不等于发送答案。','1 · 코드를 테스트하고 출력을 읽으세요. 실행은 답 보내기와 다릅니다.');$('gc-send-hint').textContent=tr('2 · When ready, send this version to your teacher. You can then return to your own lesson task.','2 · 准备好后，把这个版本发给老师，然后可返回自己的课堂任务。','2 · 준비되면 이 버전을 선생님께 보내세요. 그다음 원래 과제로 돌아갈 수 있습니다.');$('gc-help').setAttribute('aria-description',tr('Signals your teacher. Your code stays here.','通知老师，你的代码会保留。','선생님께 알립니다. 코드는 여기에 남습니다.'));
    $('gc-live-reconnect').textContent=tr('Reconnect to class','重新连接课堂','교실에 다시 연결');$('gc-live-reconnect').onclick=()=>poll(true);
    $('gc-live-run').onclick=run;$('gc-live-stop').onclick=()=>PythonRunner.stop();$('gc-send').onclick=()=>send('submit');
    $('gc-help').onclick=async()=>{try{accept(await G.rpc('student',{p_action:'help',p_room:room.id,p_token:credential.token}));status('Your teacher can see your help signal.');}catch(e){status(e.message,true);}};
    $('gc-resume').onclick=close;$('gc-work-after-send').onclick=close;
  }
  function updateWorkspace(r){
    const a=rec(),edit=G.writable(r,now());if(!a)return;
    $('gc-workspace-connection').textContent=connectionState();$('gc-live-code').readOnly=!edit||running;
    $('gc-live-run').disabled=!edit||running||busySend;$('gc-send').disabled=!edit||running||busySend;$('gc-live-stop').disabled=!running;
    $('gc-resume').disabled=running;$('gc-work-after-send').hidden=!a.submitted;
    G.countdown($('gc-live-dialog').querySelector('.gc-countdown'),{...r,viewerSubmitted:!!a.submitted},now());
    $('gc-phase-note').textContent=!r.connected?tr('Connection interrupted. Your code is kept here. Tap Reconnect to class, or return to your lesson without losing your place.','连接中断。代码保留在这里。点击重新连接课堂，或返回课堂任务，不会丢失位置。','연결이 중단됐습니다. 코드는 여기에 유지됩니다. 교실에 다시 연결하거나 원래 위치의 수업 과제로 돌아가세요.'):r.phase==='invite'?tr('Get ready. Read the task; your teacher starts the timer. Your saved response stays here if this invitation reopens.','先阅读任务，等待老师开始计时。重新邀请时，你的回答仍会保留。','과제를 읽고 선생님이 타이머를 시작할 때까지 기다리세요. 다시 초대돼도 응답은 유지됩니다.'):r.phase==='discuss'?tr('Eyes to the board. Your teacher is discussing the code. Editing opens when your teacher allows improvements.','看前面的讲解。老师允许改进后再修改。','앞의 설명을 보세요. 선생님이 개선을 허용하면 수정할 수 있습니다.'):r.phase==='follow'||r.phase==='retry'?tr('Watch the live model here, then improve and run your own code. Your first response is kept.','观察实时示范，再改进并运行自己的代码。第一次回答会保留。','실시간 예시를 보고 자신의 코드를 개선해 실행하세요. 첫 응답은 유지됩니다.'):tr('Run your code, compare the output, then send your answer to the teacher. After sending, you may continue your own task while the timer runs.','运行并比较，再发送回答。发送后可以在计时结束前继续自己的任务。','실행하고 비교한 뒤 응답을 보내세요. 보내면 시간이 남아 있어도 자신의 과제를 계속할 수 있습니다.');
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
    clearTimeout(saveTimer);if(!source||!room||!credential||source.roomId&&source.roomId!==room.id)return Promise.resolve();
    const a=source,who=identity,cap=credential,roomId=room.id,jobId=crypto.randomUUID();
    const packet={round:a.round,kind:a.kind,code:snapshot?.code??a.code,output:snapshot?.output??a.output,error:snapshot?.error??a.error,eventId:crypto.randomUUID()};
    sendJobs.add(jobId);busySend=true;if($('gc-live-dialog').open)updateWorkspace(current());
    serial=serial.catch(()=>{}).then(async()=>{
      try{
        if(who!==identity||cap!==credential)return;
        // Retry an unconfirmed event with exactly the same ID. The database
        // deduplicates it even if the original send succeeded but its reply was lost.
        if(a.pendingSend){
          const prior=a.pendingSend;
          const result=await G.rpc('student',{p_action:prior.action,p_room:roomId,p_token:cap.token,p_data:prior.packet});
          if(who!==identity||cap!==credential)return;
          GameConnection.confirm(a,prior,result);save('send-confirmed',{round:a.round,kind:a.kind});accept(result);
          if(prior.action===action&&['code','output','error'].every(k=>(prior.packet[k]||'')===(packet[k]||''))){
            status(action==='submit'?'Your earlier response is confirmed as sent. You can return to your task.':'Your earlier save is confirmed.');return;
          }
        }
        const pending={action,packet:{...packet,baseVersion:a.version||0}};
        a.pendingSend=pending;a.dirty=true;save('send-pending',{round:a.round,kind:a.kind});
        const result=await G.rpc('student',{p_action:action,p_room:roomId,p_token:cap.token,p_data:pending.packet});
        if(who!==identity||cap!==credential)return;
        GameConnection.confirm(a,pending,result);
        save(action,{round:a.round,kind:a.kind,code:packet.code,output:packet.output,error:packet.error,submitted:a.submitted});accept(result);
        status(action==='submit'?'Response sent. You may return to your own task now.':'Saved to the live classroom.');
      }catch(e){if(who===identity){status('Not confirmed as sent: '+e.message+' Your code is kept here. Reconnect, then use Send when the response window is open.',true);save('sync-paused',{round:a.round,error:e.message});}}
      finally{sendJobs.delete(jobId);busySend=sendJobs.size>0;if($('gc-live-dialog').open)updateWorkspace(current());}
    });return serial;
  }
  $('gc-join').onclick=enter;$('gc-see-demo').onclick=enter;
  $('gc-reconnect').onclick=()=>poll(true);
  $('gc-storage-backup').onclick=()=>window.GameClubBridge?.backup();
  $('gc-recovery').onclick=()=>{dismissedAttention=attentionKey;$('gc-attention').close();};
  $('gc-attention').addEventListener('cancel',e=>{e.preventDefault();dismissedAttention=attentionKey;$('gc-attention').close();});
  $('gc-live-dialog').addEventListener('cancel',e=>{if(running){e.preventDefault();return;}dismissedAttention=attentionKey;view='';});
  document.addEventListener('gameclub-profile',attach);document.addEventListener('gameclub-language',()=>{view='';render();});
  const resume=()=>{if(!document.hidden)poll(true);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){preserveDraft();presence.cancel();checkingConnection=false;}else resume();});
  window.addEventListener('pageshow',resume);window.addEventListener('focus',resume);window.addEventListener('online',resume);
  window.addEventListener('pagehide',()=>{preserveDraft();presence.cancel();});
  setInterval(()=>{if(state()&&!state().teacher)poll();},3000);setInterval(render,1000);attach();
})();
