/* Game Club only. Public key is not teacher authorisation. All rights are checked by Supabase. */
window.GameLive = (() => {
  'use strict';
  const cfg = window.LISTS_CLOUD_CONFIG;
  const rounds = {
    1: {title:'A late player joins', goal:'Add an element and check the length.',
      prompt:'The club starts with Nova, Echo and Pixel. Print the original list. Add Orbit at the end using append, then print the changed list and its length. Keep the original three players.',
      zh:'俱乐部最初有 Nova、Echo 和 Pixel。先输出原列表。用 append 在末尾添加 Orbit，再输出更改后的列表及其长度。保留原来的三位玩家。',
      ko:'처음 명단은 Nova, Echo, Pixel입니다. 원래 리스트를 출력하세요. append로 끝에 Orbit을 추가한 뒤 바뀐 리스트와 길이를 출력하세요. 원래 세 명은 유지하세요.',
      steps:['Keep the first line. Add print(players) below it.','Use players.append(...) to add the new player at the end.','Print players again, then print len(players). Run, compare and send.'],
      stepsZh:['保留第一行，在下面添加 print(players)。','用 players.append(...) 在末尾添加新玩家。','再次输出 players，再输出 len(players)。运行、比较、发送。'],
      stepsKo:['첫 줄을 유지하고 아래에 print(players)를 추가하세요.','players.append(...)로 끝에 새 플레이어를 추가하세요.','players를 다시 출력하고 len(players)를 출력하세요. 실행, 비교, 보내기를 하세요.'],
      starter:'players = ["Nova", "Echo", "Pixel"]\n',
      model:'players = ["Nova", "Echo", "Pixel"]\nprint(players)\nplayers.append("Orbit")\nprint(players)\nprint(len(players))',
      output:"['Nova', 'Echo', 'Pixel']\n['Nova', 'Echo', 'Pixel', 'Orbit']\n4",
      explanation:'append adds Orbit at the end. The original three stay. len counts four elements; it is not the last index.'},
    2: {title:'Give every player a turn', goal:'Move the counter so a while loop stops safely.',
      prompt:'This loop must print Nova, Luna, Pixel and Orbit once each, in that order. Complete the indented counter instruction. Do not add extra print lines or change the roster.',
      zh:'这个循环应依次输出 Nova、Luna、Pixel、Orbit，每人一次。补全有缩进的计数器指令。不要添加额外的 print 行或更改名单。',
      ko:'반복문은 Nova, Luna, Pixel, Orbit을 순서대로 한 번씩 출력해야 합니다. 들여쓰기 된 카운터 명령을 완성하세요. print 줄을 더하거나 명단을 바꾸지 마세요.',
      steps:['Keep i = 0: the first index is 0.','Inside while, below print(players[i]), add an instruction that increases i by 1.','Keep the same indentation as print. Run, compare and send. Stop if a name repeats endlessly.'],
      stepsZh:['保留 i = 0：第一个索引是 0。','在 while 内、print(players[i]) 下方，添加一条让 i 增加 1 的指令。','缩进与 print 相同。运行、比较、发送。如果姓名一直重复，点击 Stop。'],
      stepsKo:['i = 0을 유지하세요. 첫 인덱스는 0입니다.','while 안의 print(players[i]) 아래에 i를 1 늘리는 명령을 추가하세요.','print와 같은 들여쓰기를 하세요. 실행, 비교, 보내기를 하세요. 이름이 끝없이 반복되면 Stop을 누르세요.'],
      starter:'players = ["Nova", "Luna", "Pixel", "Orbit"]\ni = 0\nwhile i < len(players):\n    print(players[i])\n    # Move i to the next index here\n',
      model:'players = ["Nova", "Luna", "Pixel", "Orbit"]\ni = 0\nwhile i < len(players):\n    print(players[i])\n    i = i + 1',
      output:'Nova\nLuna\nPixel\nOrbit',
      explanation:'i increases from 0 to 4. The loop reads indexes 0–3. At 4, i < len(players) is false, so no invalid index is read.'}
  };
  const cues = [
    [0,7,'Starting drill','Model where to type and Run. Accuracy before speed.','Complete the warm-up and type-and-run model.'],
    [7,9,'Briefing','Show the original and final roster.','Read the mission and compare the target.'],
    [9,16,'Do Now','Check len versus last index; use the runnable example.','Read, run the len example and complete the short questions.'],
    [16,18,'Types of Learning','Use starter evidence to identify support for K, S and U.','Try the three goal checks and choose useful support.'],
    [18,25,'Main Task 1','Support replace, append and length.','Build and test the roster in small steps.'],
    [25,30,'Live discussion 1','Invite → 3-minute response → 1-minute discussion → 1-minute follow-along.','Print before/after, append Orbit and check len.'],
    [30,33,'Loop typing reset','Model indentation and the counter.','Type and run the loop; make the small change.'],
    [33,41,'Main Task 2','Check the condition and counter before running.','Loop through the current roster and test a captain.'],
    [41,46,'Live discussion 2','Invite → respond → explain why the counter matters.','Complete the loop, then improve with the live model.'],
    [46,51,'Extension','Offer the next challenge, not a speed reward.','Try another roster or a deeper challenge if you have time.'],
    [51,55,'Learning Pit Stop','Compare KSU evidence with students’ explanations.','Explain what improved and where support is still needed.'],
    [55,58,'Plenary','Check append, length and loop stopping.','Complete the exit questions.'],
    [58,60,'Save & submit','Check PDF attachment and Turn in.','Export your report, attach it in Teams and Turn in.']
  ];
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time = n => {n=Math.max(0,Math.ceil(Number(n)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
  let client,anonymous;
  function db(){return client ||= supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storage:sessionStorage,storageKey:'gameclub-live-teacher-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});}
  async function rpc(action,args={}){
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),12000);
    const connection=action==='teacher'?db():(anonymous ||= supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'gameclub-live-public'}}));
    try{const {data,error}=await connection.rpc('y8_gc_live_'+action,args).abortSignal(abort.signal);if(error)throw Error(error.code==='PGRST202'?'Live classroom setup is not active yet. Independent work still saves.':error.message);return data;}finally{clearTimeout(timer);}
  }
  function effective(room,now=Date.now()){
    if(!room)return null;const r={...room};
    if(!r.connected||r.ended)r.phase='work';
    else if(['response','retry'].includes(r.phase)&&r.pausedSeconds==null&&Date.parse(r.deadline)<=now)r.phase='discuss';
    return r;
  }
  const remaining=(r,now=Date.now())=>r?.pausedSeconds??Math.max(0,Math.ceil((Date.parse(r?.deadline)-now)/1000)||0);
  const writable=(r,now=Date.now())=>!!r?.connected&&(r.phase==='follow'||['response','retry'].includes(r.phase)&&r.pausedSeconds==null&&remaining(r,now)>0);
  const kind=r=>r?.responseKind||'initial';
  function countdown(el,r,now=Date.now()){
    if(!el)return;const timed=!!r?.connected&&['response','retry'].includes(r.phase);el.hidden=!timed;if(!timed)return;
    const left=remaining(r,now),urgent=r.pausedSeconds==null&&left>0&&left<r.responseDuration/2;
    el.classList.toggle('urgent',urgent);el.classList.toggle('paused',r.pausedSeconds!=null);
    const key=r.id+':'+r.round+':'+kind(r)+':'+r.responseEpoch;
    if(urgent&&el.dataset.nudged!==key){el.dataset.nudged=key;el.classList.remove('nudge');void el.offsetWidth;el.classList.add('nudge');}
    el.querySelector('strong').textContent=time(left);
    el.querySelector('span').textContent=r.pausedSeconds!=null?'Timer paused':urgent?'Respond now · less than half remains':'Live response time';
    el.querySelector('progress').max=r.responseDuration||180;el.querySelector('progress').value=left;
  }
  const clockHTML=()=>'<div class="gc-countdown" hidden><span>Live response time</span><strong>3:00</strong><progress aria-label="Response time remaining" max="180" value="180"></progress></div>';
  const cue=seconds=>cues.find(c=>seconds/60>=c[0]&&seconds/60<c[1])||cues.at(-1);
  const elapsed=(room,received,now=Date.now())=>(room?.clockSeconds||0)+(room?.clockRunning?Math.max(0,(now-received)/1000):0);
  const stableStudents=students=>[...students].sort((a,b)=>a.joined_at.localeCompare(b.joined_at)||a.id.localeCompare(b.id));
  function indent(el,e){if(e.key==='Tab'){e.preventDefault();el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input',{bubbles:true}));}}
  function download(data,name){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  return {rounds,cues,esc,time,db,rpc,effective,remaining,writable,kind,countdown,clockHTML,cue,elapsed,stableStudents,indent,download};
})();
