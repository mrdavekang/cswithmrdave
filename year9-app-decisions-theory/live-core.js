/* App Design only. Public key is not teacher authorisation. All rights are checked by Supabase. */
window.DesignLive = (() => {
  'use strict';
  const cfg = window.DECISION_LIVE_CONFIG;
  const rounds = {
    1: {title:'A feature worth borrowing',titleZh:'值得借鉴的功能',goal:'Explain how a design choice helps a user.',
      prompt:'You are researching a drawing app. Its three colour buttons are labelled Button 1, Button 2 and Button 3. Suggest clearer labels, then explain how they would help a new user. Use short phrases.',
      zh:'你正在研究绘画应用。三个颜色按钮名为 Button 1、Button 2、Button 3。建议更清楚的名称，再解释怎样帮助新用户。用短语即可。',
      steps:['Name what each button does.','Explain one benefit for the user.','Send your answer. Then return to Section A on your paper.'],
      stepsZh:['说明每个按钮的作用。','解释一个对用户的好处。','发送回答，再继续纸上 A 部分。'],
      starter:'Clearer labels: \nThis helps the user because: ',
      model:'Clearer labels: Red, Blue, Green.\nThis helps the user choose a colour without guessing what Button 1 means.',
      modelZh:'更清楚的名称：红色、蓝色、绿色。\n这些名称能让用户直接选择颜色，不用猜 Button 1 的作用。',
      outputZh:'红色 | 蓝色 | 绿色',output:'Red | Blue | Green',
      target:'Name the actions clearly. Explain how the labels help the user choose. Your wording may differ.',
      targetZh:'清楚写出操作名称，说明这些名称怎样帮助用户选择。你的措辞可以不同。',
      explanation:'A label is useful when it tells the user what will happen. Other sensible colour labels are valid.',
      explanationZh:'有用的标签能说明点击后会发生什么。其他合理的颜色名称也可以。'},
    2: {title:'Make the tap and result clear',titleZh:'让点击与结果更清楚',goal:'Connect a control, its response and the user benefit.',
      prompt:'A sketch for a music app shows a button labelled Go. The note says: “Something happens.” Improve this plan: name the button, state exactly what the same screen shows after a tap, and explain how it helps the user. You may use a Help button or another sensible idea.',
      zh:'音乐应用草图中有一个 Go 按钮，标注只写“发生一些事情”。改进计划：写出按钮名称、点击后同一界面显示的具体内容，以及怎样帮助用户。可以设计 Help 按钮或其他合理功能。',
      steps:['Write a clear button label.','Describe the visible result after one tap.','Explain the benefit. Send, then continue Section B on your paper.'],
      stepsZh:['写出清楚的按钮名称。','描述点击一次后看得见的结果。','解释好处。发送后继续纸上 B 部分。'],
      starter:'Button label: \nAfter the tap, the app shows: \nThis helps the user because: ',
      model:'Button label: Help.\nAfter the tap, the app shows: “Choose a music style, then tap Show playlist.”\nThis helps a new user know what to choose and which button to tap.',
      modelZh:'按钮名称：Help（帮助）。\n点击后显示：“先选择音乐风格，再点击 Show playlist（显示播放列表）。”\n这样新用户就知道该选什么、点击哪个按钮。',
      outputZh:'先选择音乐风格，再点击显示播放列表。',output:'Choose a music style, then tap Show playlist.',
      target:'Include a clear label, a specific visible response and a reason linked to the user. Keep your own app topic when drawing.',
      targetZh:'包含清楚的标签、具体可见的响应，以及与用户有关的理由。绘图时仍保留你自己的主题。',
      explanation:'The plan names the action and the result. The reason explains the benefit; it does not just say “better”.',
      explanationZh:'计划清楚说明操作及结果。理由要解释怎样帮助用户，不能只说“更好”。'}
  };
  const cues = [
    [0,5,'Read first & Do now','Connect purpose, audience, control and feedback.','Read the examples and answer the short design check.'],
    [5,7,'Types of Learning','Recognise prior knowledge and choose support.','Choose your starting point for each KSU check.'],
    [7,22,'Main Task 1 · Research','Discuss two Gallery designs. Check paper Section A.','Study TWO app pictures. Record a useful feature and one improvement in Section A.'],
    [22,27,'Live discussion 1','Invite → 3-minute response → 1-minute discussion → 1-minute improvement.','Explain a helpful design choice. Send, then return to Section A.'],
    [27,30,'Quick quiz break','Use feedback, without speed ranking.','Answer two short design questions and read the feedback.'],
    [30,50,'Main Task 2 · Draw','Use WAGOLL purposes. Keep the existing app topic.','On Section B draw before the tap, after the tap and another choice or Reset.'],
    [50,55,'Live discussion 2','Invite → discuss a vague plan → model a clearer response.','Name a button, its visible response and why it helps. Then improve your own drawing.'],
    [55,58,'Learning Pit Stop','Use students’ confidence reports, not a quiz score.','Choose a learning phase for Knowledge, Skills and Understanding.'],
    [58,60,'Save & hand in','Check the paper hand-in and the digital report.','Keep Sections A and B together. Save your learning-record PDF and follow the Teams hand-in instructions.']
  ];
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time = n => {n=Math.max(0,Math.ceil(Number(n)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
  let client,anonymous;
  function db(){return client ||= supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storageKey:'y9design-live-teacher-auth',persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});}
  async function rpc(action,args={}){
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),12000);
    const connection=action==='teacher'?db():(anonymous ||= supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'y9design-live-public'}}));
    try{const {data,error}=await connection.rpc('y9_design_live_'+action,args).abortSignal(abort.signal);if(error){const e=Error(error.code==='PGRST202'?'Live classroom setup is not active yet. Independent work still saves.':error.message);e.code=error.code;e.status=error.status;throw e;}return data;}finally{clearTimeout(timer);}
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
    const left=remaining(r,now),urgent=!r.viewerSubmitted&&r.pausedSeconds==null&&left>0&&left<r.responseDuration/2;
    el.classList.toggle('urgent',urgent);el.classList.toggle('paused',r.pausedSeconds!=null);
    const key=r.id+':'+r.round+':'+kind(r)+':'+r.responseEpoch;
    if(urgent&&el.dataset.nudged!==key){el.dataset.nudged=key;el.classList.remove('nudge');void el.offsetWidth;el.classList.add('nudge');}
    el.querySelector('strong').textContent=time(left);
    el.querySelector('span').textContent=r.viewerSubmitted?'Response sent · keep working':r.pausedSeconds!=null?'Timer paused':urgent?'Respond now · less than half remains':'Live response time';
    el.querySelector('progress').max=r.responseDuration||180;el.querySelector('progress').value=left;
  }
  const clockHTML=()=>'<div class="gc-countdown" hidden><span>Live response time</span><strong>3:00</strong><progress aria-label="Response time remaining" max="180" value="180"></progress></div>';
  const cue=seconds=>cues.find(c=>seconds/60>=c[0]&&seconds/60<c[1])||cues.at(-1);
  const elapsed=(room,received,now=Date.now())=>(room?.clockSeconds||0)+(room?.clockRunning?Math.max(0,(now-received)/1000):0);
  const stableStudents=students=>[...students].sort((a,b)=>a.joined_at.localeCompare(b.joined_at)||a.id.localeCompare(b.id));
  function indent(el,e){if(e.key==='Tab'){e.preventDefault();el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input',{bubbles:true}));}}
  function download(data,name){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,(key,value)=>/token|credential|password|boardKey|publishableKey/i.test(key)?undefined:value,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  return {rounds,cues,esc,time,db,rpc,effective,remaining,writable,kind,countdown,clockHTML,cue,elapsed,stableStudents,indent,download};
})();
