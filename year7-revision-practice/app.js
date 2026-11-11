(() => {
  'use strict';
  const L=window.REVISION_LESSON, C=window.REVISION_CLOUD;
  const $=id=>document.getElementById(id);
  const root=$('content');
  const e=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const h=(label,attr='')=>'<button type="button" '+attr+'>'+label+'</button>';
  const art=(id,kind='art')=>'<img class="'+kind+'" src="assets/characters/illustration-'+id+'.png" alt="" aria-hidden="true">';
  const hash=new URLSearchParams(location.hash.slice(1));
  const invitedClass=/^7[A-Z]{1,2}$/.test(hash.get('class')||'')?hash.get('class'):'';
  const invite=invitedClass && /^[0-9a-f]{64}$/.test(hash.get('join')||'')?hash.get('join'):'';
  if(invite) document.querySelector('.brand').setAttribute('href','./index.html#'+new URLSearchParams({class:invitedClass,join:invite}));
  let bi=C.read('y7-revision-language')==='bi';
  const t=(en,zh)=>bi&&zh?en+' · '+zh:en;
  const z=str=>bi&&str?'<p class="zh" lang="zh-Hans">'+e(str)+'</p>':'';
  const getOption=str=>e(bi?str:str.split(' / ')[0]);
  const goal='Use bits to represent numbers, pictures and text.';
  const goalZh='用比特表示数字、图片和文字。';
  const stages=['Do Now','Types of Learning','Read First','Main Task 1','Main Task 2','Learning Pitstop','Extra Challenges','Plenary','15-question quiz'];
  const stageZh=['热身','学习类型','先阅读','任务一','任务二','学习反思','进阶挑战','总结','15 题自测'];
  const focusLabels=['Knowledge','Skills','Understanding'];
  const focusZh=['知识','技能','理解'];
  const desc=[
    ['Remember what a bit and a byte are.','记住比特和字节是什么。'],
    ['Convert binary numbers and encode or decode pictures and text.','转换二进制数字，给图片和文字编码或解码。'],
    ['Explain why the same bits can mean different things.','解释为什么同一组比特可以表示不同内容。']
  ];
  const confidence=[
    ['Not yet','还不会'],['With an example','参考示例就会'],['On my own','可以独立完成']
  ];
  const phases=[
    ['New learning','新学习','I’m trying something new and making progress.','我正在尝试新内容，并且有进步。'],
    ['Consolidating','巩固','I’m practising something I’ve learned.','我正在练习已学过的内容。'],
    ['Treading water','缺少挑战','I can do this already and need a tougher example.','我已经会做，需要更有挑战的例子。'],
    ['Drowning','需要帮助','I’m stuck and need help with the next step.','我卡住了，需要下一步的帮助。']
  ];
  const paths=[L.starter,null,null,L.main1,L.main2,null,L.extra,L.plenary,L.quiz];
  const coach=[
    ['Find the 1s. Look up to the place values above them. Add those values.','找到所有的 1，看看它们上方的位值，再把这些位值相加。'],
    ['Read one bit at a time for pixels. For text, look up the whole eight-bit group.','看像素时一位一位读；看文字时在表中查整组八位编码。']
  ];
  const coachBox=(id,copy)=>'<div class="box intro"><div><span class="eyebrow">'+t('Mr Dave’s tip','老师提示')+'</span><p>'+copy[0]+'</p>'+z(copy[1])+'</div>'+art(id)+'</div>';
  const contextKSU=()=>desc.map((d,i)=>'<div class="box"><h3>'+t(focusLabels[i],focusZh[i])+'</h3><p>'+d[0]+'</p>'+z(d[1])+'</div>').join('');
  let profile=null, state=null, key=null, joinBusy=false, syncBusy=false, syncTimer=0, retry=0, problem='', showSaveError=false, newExtra=false, notice='', noticeKind='', lessonStep=0;
  let worked=0, compare=false, keeping={};
  const blank=()=>({answers:{},ksu:{},pit:{},stage:0,at:{},unlocked:0,reading:0,extraDone:false,submitted:false,quizDone:false});
  const buildSnapshot=()=>{
    const byTopic={};
    for(const q of L.all) {
      const row=state.answers[q.id];
      if(!row?.attemptCount) continue;
      const bucket=byTopic[q.topic]??={checked:0,correct:0,firstCorrect:0,manual:0};
      bucket.checked++;
      if(q.kind==='write') bucket.manual++;
      else {if(row.lastCorrect) bucket.correct++; if(row.firstCorrect) bucket.firstCorrect++;}
    }
    return {...state,stage:stages[state.stage],stageIndex:state.stage,summary:{
      main:L.main1.concat(L.main2).filter(q=>state.answers[q.id]?.attemptCount).length,
      plenary:L.plenary.filter(q=>state.answers[q.id]?.attemptCount).length,
      quiz:L.quiz.filter(q=>state.answers[q.id]?.lastCorrect).length,
      quizChecked:L.quiz.filter(q=>state.answers[q.id]?.attemptCount).length,byTopic
    }};
  };
  function status() {
    if(!profile) return;
    const s=$('save'); s.hidden=false;
    s.textContent=showSaveError?t('Device storage unavailable — download a backup','无法在此设备保存，请下载备份'):
      problem||(!profile.cloud?t('Device only','仅保存在此设备'):profile.dirty?t('Saved here · school sync pending','已存到设备 · 等待同步'):t('Saved to school','已保存到学校'));
    $('recover').hidden=!problem.includes('another tab');
  }
  function persist() {
    profile.state=state; showSaveError=!C.write(key,profile); status();
  }
  function changed() {
    if(!profile) return;
    profile.dirty=true; persist(); clearTimeout(syncTimer);
    if(profile.cloud && !problem.includes('another tab')) syncTimer=setTimeout(sync,650);
  }
  async function sync() {
    if(!profile?.cloud||!profile.dirty||syncBusy||problem.includes('another tab')) return;
    const owner=profile, data=buildSnapshot(), raw=JSON.stringify(data);
    syncBusy=true;
    try {
      const result=await C.pupil('save',owner.id,owner.secret,{p_state:data,p_version:owner.version});
      if(profile!==owner) return;
      if(result.conflict) {
        problem='Work changed in another tab — back up, then load the school copy';
      } else {
        owner.version=result.version; owner.dirty=JSON.stringify(buildSnapshot())!==raw; retry=0; problem='';
      }
    } catch {
      if(profile!==owner) return;
      problem=t('Saved here · will retry school sync','已存到设备 · 将重试同步'); retry=Math.min(retry+1,4);
    } finally {
      syncBusy=false;
      if(profile===owner) {
        persist();
        if(owner.dirty && !problem.includes('another tab')) { clearTimeout(syncTimer); syncTimer=setTimeout(sync, retry ? 2000*2**retry : 650); }
      }
    }
  }
  async function start(form) {
    if(joinBusy) return;
    const d=new FormData(form), name=String(d.get('name')||'').trim().replace(/\s+/g,' '), group=String(d.get('class')||'').trim().toUpperCase();
    if(name.length<2||!/^7[A-Z]{1,2}$/.test(group)){ $('start-error').textContent=t('Enter your name and a Year 7 class, such as 7T.','请输入姓名和七年级班级，例如 7T。'); return; }
    joinBusy=true;
    const startBtn=$('begin'); startBtn.disabled=true; $('start-error').textContent='';
    key='y7-revision-01:'+group+':'+name.toLocaleLowerCase();
    const old=C.read(key);
    const p=old?.state&&old?.id&&old?.secret?old:{id:C.uuid(),secret:C.randomHex(),state:blank(),version:0,dirty:false,cloud:false,name,group};
    try {
      if(p.cloud||invite) {
        let reply=null;
        try { reply=await C.pupil(p.cloud?'load':'join',p.id,p.secret,{p_name:name,p_class:group,p_invite:invite||null}); }
        catch(error) {
          if(error.code==='42501'&&!p.cloud) {
            $('start-error').textContent=t('This class link is no longer active. Ask your teacher for a fresh link.','此班级链接已失效，请向老师索取新链接。'); return;
          }
          p.connectPending=!p.cloud;
          problem=t('Saved here · school connection pending','仅存到设备 · 等待连接学校');
        }
        if(reply) {
          p.cloud=true; p.connectPending=false;
          if(Object.keys(reply.snapshot||{}).length && (!p.dirty||reply.version!==p.version)) {
            if(p.dirty) {
              problem='Work changed in another tab — back up, then load the school copy';
              p.conflict=true;
            } else p.state={...blank(),...reply.snapshot,stage:reply.snapshot.stageIndex??0};
          }
          if(!p.conflict) p.version=reply.version;
        }
      }
      profile=p; state=p.state; lessonStep=Math.min(state.reading,3);
      $('backup').hidden=false; persist(); draw(true);
      if(p.cloud && p.dirty) sync();
      if(p.connectPending) setTimeout(connect,4500);
    } finally { joinBusy=false; startBtn.disabled=false; }
  }
  async function connect() {
    const p=profile;
    if(!p?.connectPending||!invite||joinBusy) return;
    joinBusy=true;
    try {
      const r=await C.pupil('join',p.id,p.secret,{p_name:p.name,p_class:p.group,p_invite:invite});
      if(profile!==p) return;
      p.cloud=true; p.connectPending=false; p.version=r.version; p.dirty=true; problem=''; persist(); sync();
    } catch(err) {
      if(profile!==p) return;
      if(err.code==='42501') {p.connectPending=false; problem=t('Class link expired · work saved on this device','班级链接已失效 · 作业仍保存在此设备');persist();}
      else setTimeout(connect,12000);
    } finally {joinBusy=false;}
  }
  const stage=()=>state.stage;
  const index=()=>state.at[stage()]??0;
  const qNow=()=>paths[stage()]?.[index()];
  const row=q=>state.answers[q.id]??={draft:q.kind==='pixel'?'0'.repeat(q.answer.length):q.kind==='build'?'0'.repeat(q.width):'',attemptCount:0,attempts:[],working:'',places:[]};
  const checked=q=>Boolean(state.answers[q.id]?.attemptCount);
  const selected=()=>qNow()?row(qNow()):null;
  const flash=(str,kind='retry')=>{notice=str;noticeKind=kind;const n=$('notice');if(n){n.textContent=str;n.dataset.kind=kind;}};
  const updateCheck=(r,q)=> {
    if(!r.attemptCount) return '';
    if(r.draft!==r.lastAnswer) return t('Changed since your last check. Check again to save this as an attempt.','答案已修改。再次检查即可记录本次作答。');
    const feedback=t(q.feedback,q.feedbackZh);
    if(q.kind==='write') return t('Response saved. ','回答已保存。 ')+feedback;
    if(r.lastCorrect) return t('Correct. ','正确。 ')+feedback;
    return t('Not quite. Use this clue, then try again or continue. ','还不对。可以参考提示后再试，或继续下一题。 ')+feedback;
  };
  const allChecked=list=>list.every(checked);
  const stageDone=i=>[allChecked(L.starter),Object.keys(state.ksu).length===3,state.reading>=4,allChecked(L.main1),allChecked(L.main2),!!state.pit.phase&&!!state.pit.next?.trim(),state.extraDone,state.submitted,state.quizDone][i];
  const progress=()=>{
    const done=L.starter.concat(L.main1,L.main2,L.plenary).filter(checked).length, total=L.starter.length+L.main1.length+L.main2.length+L.plenary.length;
    return '<section class="progress" aria-label="Lesson progress"><div class="progress-top"><span>'+e(stages[stage()])+z(stageZh[stage()])+'</span><span>'+done+' / '+total+' '+t('core questions attempted','道核心题已作答')+'</span></div><div class="rail" role="progressbar" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+100*done/total+'%"></span></div><nav class="stages" aria-label="Lesson stages">'+stages.map((s,i)=>h((stageDone(i)?'✓ ':i>state.unlocked?'· ':'')+e(s),'data-stage="'+i+'" '+(stage()===i?'aria-current="step" ':'')+(i>state.unlocked?'aria-disabled="true" ':'')+'title="'+(i>state.unlocked?'Complete the current stage first':'Open '+e(s))+'"')).join('')+'</nav></section>';
  };
  const ksuDock=()=>'<section class="persistent"><details><summary>'+t('WAGBA, knowledge, skills and understanding','学习目标、知识、技能与理解')+'</summary><p>'+goal+'</p>'+z(goalZh)+'<div class="intro-foot">'+contextKSU()+'</div></details><details><summary>'+t('Key words','关键词')+'</summary><p><b>Bit</b> · 0 or 1. <b>Byte</b> · 8 bits. <b>Place value</b> · the value of a position. <b>Pixel</b> · one square in a digital image. <b>Encode</b> · turn into a code. <b>Decode</b> · read a code. <b>Character</b> · a letter, digit, symbol or space.</p>'+z('比特：0 或 1。字节：8 比特。位值：数字在某个位置所代表的数值。像素：数字图片中的一个小方格。编码：转换成代码。解码：读出代码表示的内容。字符：字母、数字、符号或空格。')+'</details></section>';
  function welcome() {
    root.innerHTML='<section class="hero"><div class="hero-copy"><div class="intro-meta"><span class="chip">60 MIN · REVISION 01</span><span class="chip">YEAR 7</span></div><h1>Bits, pictures &amp; messages.</h1>'+z('比特、图像和消息')+'<p class="lead">How can the same 0s and 1s tell you a score, draw a picture, or spell a message?</p>'+z('同样的 0 和 1 怎样表示分数、画出图片或拼出消息？')+art(2,'hero-art')+'</div><div class="stack"><div class="box goal"><span class="eyebrow">WAGBA</span><p>'+goal+'</p>'+z(goalZh)+'</div><form id="join" class="form"><label>'+t('Your name','姓名')+'<input name="name" autocomplete="off" required minlength="2" maxlength="80"></label><label>'+t('Your class','班级')+'<input name="class" autocomplete="off" autocapitalize="characters" placeholder="7T" required maxlength="3" value="'+e(invitedClass)+'" '+(invite?'readonly':'')+'></label><button id="begin" class="primary">'+t('Start or resume','开始或继续')+' →</button><p class="muted">'+(invite?t('Your teacher can see what you submit and your saved attempts.','老师可以看到你提交的答案和保存的尝试。'):t('Preview: work saves on this device. Use your teacher’s private class link for school saving.','预览：作业仅保存在此设备。使用老师给的班级链接，才能同步。'))+'</p><p id="start-error" class="notice" role="alert"></p></form></div></section><section class="intro-foot" aria-label="Today’s learning">'+contextKSU()+'</section>';
    $('join').addEventListener('submit',ev=>{ev.preventDefault();start(ev.currentTarget);});
  }
  const head=(name,title,zh,figure)=>'<div class="intro"><div><span class="eyebrow">'+e(name)+'</span><h2 id="card-title" tabindex="-1">'+title+'</h2>'+z(zh)+'</div>'+(figure?art(figure):'')+'</div>';
  const box=(title,body,zh)=>'<div class="box"><h3>'+title+'</h3><p>'+body+'</p>'+z(zh)+'</div>';
  const checkNote=()=>'<div id="notice" class="notice" aria-live="polite" data-kind="'+e(noticeKind)+'">'+e(notice)+'</div>';
  const weights=n=>Array.from({length:n},(_,i)=>2**(n-1-i));
  function bits(v,{edit=false,working=[],staticOnly=false}={}) {
    const ws=weights(v.length);
    return '<div class="bits-wrap"><table class="bits"><caption>'+t('Place-value table: read the number above each bit.','位值表：看每一位上方的数值。')+'</caption><thead><tr><th scope="col">'+t('Place','位值')+'</th>'+ws.map(w=>'<th scope="col">'+w+'</th>').join('')+'</tr></thead><tbody><tr><th scope="row">'+t('Bit','位')+'</th>'+Array.from(v,(b,i)=>'<td>'+(edit?h(b,'data-bit="'+i+'" aria-label="Place '+ws[i]+': '+b+'" aria-pressed="'+(b==='1')+'"'):'<span class="bit-plain'+(staticOnly&&working.includes(i)?' outline-bit':'')+'">'+b+'</span>')+'</td>').join('')+'</tr>'+(!edit&&!staticOnly?'<tr><th scope="row">'+t('Mark','标记')+'</th>'+ws.map((w,i)=>'<td>'+h(working.includes(i)?'✓':'·','data-mark="'+i+'" aria-label="'+(working.includes(i)?'Unmark':'Mark')+' '+w+'" aria-pressed="'+working.includes(i)+'"')+'</td>').join('')+'</tr>':'')+'</tbody></table></div>';
  }
  function pixels(s,w,interactive) {
    return '<div class="pixel-grid" style="--cols:'+w+'" role="group" aria-label="'+(interactive?'Your editable pixel grid':'Pixel example')+'">'+Array.from(s,(b,i)=>{
      const pos='Row '+(1+Math.floor(i/w))+', column '+(i%w+1)+': '+(b==='1'?'filled':'white');
      return interactive?h(b==='1'?'■':'□','data-pixel="'+i+'" aria-pressed="'+(b==='1')+'" aria-label="'+pos+'"'):'<span class="'+(b==='1'?'filled':'')+'" aria-label="'+pos+'">'+(b==='1'?'■':'□')+'</span>';
    }).join('')+'</div>';
  }
  function lookup() {
    return '<details class="box scratch" id="lookup" '+(keeping.lookup?'open':'')+'><summary>'+t('Open character-code table (A–Z and SPACE)','打开字符编码表（A–Z 和空格）')+'</summary><div class="scratch-body"><p>'+t('For each character, match all eight bits. Keep the first 0.','每个字符要匹配全部八位；开头的 0 也要保留。')+'</p><div class="lookup"><table class="codes"><thead><tr><th>'+t('Character','字符')+'</th><th>'+t('Eight-bit code','八位编码')+'</th></tr></thead><tbody>'+Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ ',c=>'<tr><td>'+(c===' '?t('SPACE','空格'):c)+'</td><td>'+c.charCodeAt(0).toString(2).padStart(8,'0')+'</td></tr>').join('')+'</tbody></table></div></div></details>';
  }
  const notes= (r,q)=>'<details class="box scratch" id="workbox" '+(keeping.workbox?'open':'')+'><summary>'+t('Show your working here or on paper','在这里或纸上写出过程')+'</summary><div class="scratch-body"><p>'+t('On paper: write the place values you need, then write the addition. Type the total in the answer box below. You can also type your calculation here.','纸上：先写用到的位值，再列加法算式。把总数填在下面的答案框。也可以在这里输入算式。')+'</p><label class="field">'+t('My calculation','我的算式')+'<input id="working" maxlength="140" value="'+e(r.working)+'" placeholder="e.g. 8 + …"></label></div></details>';
  function task(q) {
    const r=row(q), list=paths[stage()], i=index();
    const tips=q.kind==='number'?t('Type the number. If you have a place-value table, mark the places you will add.','输入数字。如果有位值表，标出需要相加的位值。'):q.kind==='build'?t('Tap a bit to switch it between 0 and 1. Then check the whole row.','点按二进制位，在 0 和 1 之间切换，再检查整行。'):q.kind==='pixel'?t('Tap a square to fill it or make it white again. Start at the top left.','点方格切换填色与白色。从左上角开始。'):q.kind==='choice'?t('Choose one answer, then check it.','选择一个答案，再检查。'):q.kind==='write'?t('A short phrase or calculation is enough. You can answer in English or Mandarin.','用短语或算式即可。可以用英语或中文作答。'):t('Type your answer, then check it.','输入答案，再检查。');
    let work='';
    if(q.bits) work+=bits(q.bits,{working:r.places,staticOnly:stage()===7});
    if(q.kind==='build') work+=bits(r.draft,{edit:true});
    if(q.kind==='number'&&stage()!==7) work+=notes(r,q);
    if(q.code) work+='<div><code class="code-banner">'+e(q.code)+'</code></div>';
    if(q.lookup) work+=lookup();
    if(q.pattern) work+=pixels(q.pattern,q.width,false);
    if(q.kind==='pixel') work+='<div class="pixel-layout"><div class="row-code">'+q.rows.map((code,j)=>'<div>'+t('Row','行')+' '+(j+1)+' <code>'+code+'</code></div>').join('')+'</div>'+pixels(r.draft,q.width,true)+'</div>';
    let answer='';
    if(q.kind==='choice') answer='<div class="answer-list" role="group" aria-label="Answer choices">'+q.options.map((opt,j)=>h('<span>'+String.fromCharCode(65+j)+'</span><span>'+getOption(opt)+'</span>','data-answer="'+j+'" aria-pressed="'+(String(j)===r.draft)+'"')).join('')+'</div>';
    if(!['choice','pixel','build'].includes(q.kind)){
      answer='<label class="field short-input">'+t('Your answer','你的答案')+
        (q.kind==='write'?'<textarea id="answer" rows="3" maxlength="340" placeholder="'+e(q.stem||'')+'">'+e(r.draft)+'</textarea>':'<input id="answer" class="'+(q.kind==='binary'?'letter-input':'')+'" autocomplete="off" spellcheck="false" '+(q.kind==='number'?'inputmode="numeric" maxlength="5"':q.kind==='binary'?'maxlength="28"':'maxlength="30" autocapitalize="characters"')+' value="'+e(r.draft)+'">')+'</label>';
    }
    const prompt=stage()===0&&i===0?'<div class="box intro"><div><span class="eyebrow">'+t('Your mission','你的任务')+'</span><p>Find out how a computer reads bits as numbers, images and messages. Start with the number on this class display.</p>'+z('探索计算机如何把比特读成数字、图像和消息。从班级屏幕上的数字开始。')+'</div>'+art(2)+'</div>':
      stage()===4&&i===0?'<div class="box intro"><div><span class="eyebrow">'+t('From bits to pixels','从比特到像素')+'</span><p>Think of the dots on a micro:bit display. Here, each square has a rule: <b>0 = white</b>, <b>1 = filled</b>. You do not need a micro:bit.</p>'+z('想一想 micro:bit 屏幕上的小点。本课规则：0 = 白色，1 = 填色。不需要 micro:bit。')+'</div>'+art(12)+'</div>':'';
    const feedback=updateCheck(r,q);
    return head(stages[stage()]+' · '+(i+1)+' / '+list.length,q.topic,q.topic==='Binary place value'?'二进制位值':q.topic==='Pixels'?'像素':q.topic==='Character codes'?'字符编码':'')+prompt+
      '<section class="practice" id="response" tabindex="-1"><div class="prompt"><span class="eyebrow">'+t('What you need to do','你需要做什么')+'</span><p class="question-title">'+e(q.en)+'</p>'+z(q.zh)+'<p class="muted">'+tips+'</p></div>'+work+answer+
      '<div class="action-group">'+h(t(q.kind==='write'?'Save my response':'Check my answer',q.kind==='write'?'保存回答':'检查答案'),'data-check')+'</div><div id="feedback" class="notice" aria-live="polite" data-kind="'+(r.lastCorrect||q.kind==='write'?'ok':'retry')+'">'+e(feedback)+'</div>'+checkNote()+'</section>';
  }
  function learning() {
    return head(stages[stage()],'What kind of learning will you do?','今天会进行哪种学习？',7)+
      box(t('Definition of learning','学习的定义'),'Amazing Learning happens when we practise, try hard and use good struggle to get better.','通过练习、努力和有收获的挑战，我们会不断进步。')+
      '<section class="stack" id="response" tabindex="-1"><h3>'+t('Today’s learning','今天的学习')+'</h3><p>'+t('For each goal, choose how much help you would need right now. This is a starting point, not a score.','为每个目标选择目前需要多少帮助。这是起点，不是成绩。')+'</p>'+
      desc.map((d,i)=>'<label class="field box">'+t(focusLabels[i],focusZh[i])+' — '+d[0]+z(d[1])+'<select data-ksu="'+i+'"><option value="">'+t('Choose one','请选择')+'</option>'+confidence.map((c,j)=>'<option value="'+j+'" '+(String(j)===state.ksu[i]?'selected':'')+'>'+t(c[0],c[1])+'</option>').join('')+'</select></label>').join('')+checkNote()+'</section>';
  }
  function reading() {
    const i=lessonStep, titles=['Data needs context','Eight bits make a byte','Read the place values','Same bits, different rules'];
    let body='';
    if(i===0) body=box(t('Example','示例'),'A screen shows <b>17</b>. Without a label, you don’t know what was counted. Now read <b>17 reusable bottles sold this morning</b>. The label adds context and turns the number into useful information.','屏幕显示 17。没有标签，你不知道数的是什么。读一读“今天上午售出了 17 个可重复使用的水瓶”。标签补充了背景，让数字变成有用的信息。');
    if(i===1) body=box(t('The rule','规则'),'One bit is a single 0 or 1. A byte is eight bits grouped together. Count the boxes in this byte.','一个比特是一个 0 或 1。八个比特组成一个字节。数一数下面有几个方格。')+'<div class="pixel-grid" style="--cols:8" aria-label="One byte, eight bits">'+Array.from('01010010',b=>'<span>'+b+'</span>').join('')+'</div>';
    if(i===2) body=coachBox(5,coach[0])+bits('00101100',{staticOnly:true,working:worked?[2,4,5]:[]})+
      '<div class="actions">'+h(worked?t('Show the numbers again','重新看数字'):t('Show the calculation','显示算式'),'data-reveal-number')+(worked?'<p class="mono">32 + 8 + 4 = 44</p>':'')+'</div>';
    if(i===3) body=coachBox(10,coach[1])+'<div><code class="code-banner">01000011</code></div>'+h(compare?t('Hide both readings','收起两种读法'):t('Reveal both readings','显示两种读法'),'data-reveal-code aria-expanded="'+compare+'"')+
      (compare?'<div class="pairs">'+box(t('Read as text','读成文字'),'The character table gives <b>C</b>.','查字符表得到 C。')+'<div class="box"><h3>'+t('Read as pixels','读成像素')+'</h3><p>'+t('0 = white; 1 = filled.','0 = 白色；1 = 填色。')+'</p>'+pixels('01000011',8,false)+'</div></div>':'');
    return head(t('Read first','先阅读')+' · '+(i+1)+' / 4',titles[i],['数据需要背景','八个比特组成一个字节','读位值','相同的比特，不同的规则'][i])+body+checkNote();
  }
  function pit() {
    return head(stages[stage()],'Think about one question.','想一想你做过的一道题。',7)+
      '<section class="stack" id="response" tabindex="-1"><p class="lead">'+t('Pick the description that fits that question. Then choose one thing to do next.','选择最符合做这道题时的描述，再选一个下一步行动。')+'</p><div class="choices" role="group" aria-label="Learning phase">'+phases.map((x,i)=>h('<strong>'+t(x[0],x[1])+'</strong><span>'+t(x[2],x[3])+'</span>','class="choice-card" data-phase="'+i+'" aria-pressed="'+(state.pit.phase===x[0])+'"')).join('')+'</div><label class="field">'+t('My next step','我的下一步')+'<select id="pit-next"><option value="">'+t('Choose one','请选择')+'</option>'+[
        ['Practise adding place values','练习位值相加'],['Decode another pixel row','再解码一行像素'],['Use the character table again','再练习查字符表'],['Try a harder comparison','试一道更难的比较题'],['Ask for one example','请老师再给一个例子']
      ].map(x=>'<option '+(state.pit.next===x[0]?'selected ':'')+'value="'+x[0]+'">'+t(x[0],x[1])+'</option>').join('')+'</select></label>'+checkNote()+'</section>';
  }
  function extras() {
    const labels=[['Decode a scoreboard','解码记分板'],['Build a bigger number','组合更大的数字'],['Draw a pixel badge','画像素徽章'],['Decode a secret message','解码秘密消息'],['Explain two readings','解释两种读法']];
    return head(stages[stage()],'Choose an extra challenge.','选择一道进阶挑战。',10)+'<p class="lead">'+t('Pick any challenge. You can try more than one, or go straight to Plenary.','任选一道；可以尝试多道，也可以直接进入总结。')+'</p><div class="choices">'+L.extra.map((q,i)=>h('<strong>'+(checked(q)?'✓ ':'')+t(labels[i][0],labels[i][1])+'</strong><span>'+e(q.topic)+'</span>','class="choice-card" data-extra="'+i+'"')).join('')+'</div>'+checkNote();
  }
  function finish(quiz=false) {
    const count=L.quiz.filter(q=>row(q).lastCorrect).length;
    return head(quiz?'15-question quiz':'Core lesson complete',quiz?'You finished the quiz.':'You finished the revision.',quiz?'自测已完成。':'复习已完成。',9)+
      (quiz?'<p class="lead">'+t(count+' / 15 correct on your latest attempts','最近作答答对 '+count+' / 15 题')+'</p>':'<p class="lead">'+t('Use the quiz to see what stuck. It’s practice, not a test grade.','用自测检查自己记住了什么。这是练习，不计为考试成绩。')+'</p>')+
      '<div class="box"><h3>'+t('Your work','你的作业')+'</h3><p>'+t('Check the save message at the top. “Saved to school” means your teacher can see this work. Keep a backup if school sync is pending.','看页面顶部的保存提示。“已保存到学校”表示老师可以看到。如果仍在等待同步，请保留备份。')+'</p></div>'+checkNote();
  }
  function draw(focus=false) {
    $('language').setAttribute('aria-pressed',String(bi));
    $('language').textContent=bi?'English + 中文':'中文 support';
    window.REVISION_THEME?.setBilingual(bi);
    if(!profile){welcome();return;}
    status();
    const s=stage(), q=qNow(), final=s===7&&state.submitted, quizEnd=s===8&&state.quizDone;
    const body=final||quizEnd?finish(quizEnd):s===1?learning():s===2?reading():s===5?pit():s===6&&!newExtra?extras():task(q);
    const prev=s===0&&index()===0?'':h(s===6&&newExtra?t('All challenges','全部挑战'):t('Back','返回'),'data-back');
    let next=quizEnd?'':final?t('Start the 15-question quiz','开始 15 题自测'):s===7&&index()===L.plenary.length-1?t('Finish revision','完成复习'):s===8&&index()===L.quiz.length-1?t('Finish quiz','完成自测'):s===6&&!newExtra?t('Go to Plenary','进入总结'):s===6?t('Back to challenges','返回挑战'):t('Continue','继续');
    root.innerHTML=progress()+'<section class="card" aria-labelledby="card-title">'+body+'<div class="actions"><div class="action-group">'+prev+(s===7&&final||s===8&&quizEnd?h(t('Review answers','回看答案'),'data-review'):'')+'</div>'+(next?h(next+' →','data-next class="primary"'):'')+'</div></section>'+ksuDock();
    ['lookup','workbox'].forEach(id=>$(id)?.addEventListener('toggle',ev=>{keeping[id]=ev.target.open;}));
    alignStage();
    if(focus) {window.scrollTo(0,0);$('card-title')?.focus({preventScroll:true});}
  }
  function alignStage() {
    const current=root.querySelector('[aria-current=step]'), rail=current?.parentElement;
    if(rail && current.offsetLeft+current.offsetWidth>rail.scrollLeft+rail.clientWidth) rail.scrollLeft=current.offsetLeft+current.offsetWidth-rail.clientWidth+8;
  }
  function relaunch(focusSelector) {draw();root.querySelector(focusSelector)?.focus({preventScroll:true});}
  function go(i) {
    if(i<0||i>=stages.length) return;
    state.stage=i; state.unlocked=Math.max(state.unlocked,i);
    newExtra=false; keeping={}; notice=''; lessonStep=Math.min(state.reading,3);
    changed(); draw(true);
  }
  function step(i) {state.at[stage()]=i; notice=''; keeping={}; changed();draw(true);}
  function missing(message) {
    flash(message); $('response')?.focus({preventScroll:true}); $('response')?.scrollIntoView({block:'nearest'});
  }
  function score(q,draft) {
    if(q.kind==='write') return null;
    if(q.kind==='number') return /^\d+$/.test(draft.trim())&&Number(draft.trim())===Number(q.answer);
    if(q.kind==='short') return draft.trim().toUpperCase().replace(/\s+/g,' ')===q.answer;
    if(q.kind==='binary') return draft.trim().replace(/\s/g,'')===String(q.answer).replace(/\s/g,'');
    return draft===String(q.answer);
  }
  function check(q) {
    const r=row(q);
    if(!r.draft.trim()) {missing(t(q.kind==='choice'?'Choose one answer first.':'Write your answer first.',q.kind==='choice'?'请先选一个答案。':'请先填写答案。'));return false;}
    const correct=score(q,r.draft);
    if(r.lastAnswer!==r.draft||!r.attemptCount) {
      const a={answer:r.draft,correct,at:new Date().toISOString()};
      r.attemptCount++;
      if(r.attemptCount===1) r.firstCorrect=correct;
      r.attempts.push(a);
      if(r.attempts.length>8) r.attempts.splice(1,1);
      r.lastAnswer=r.draft; r.lastCorrect=correct;
    }
    notice='';changed();
    const f=$('feedback'); if(f){f.dataset.kind=correct===false?'retry':'ok';f.textContent=updateCheck(r,q);}
    const n=$('notice'); if(n)n.textContent='';
    return true;
  }
  function next() {
    const s=stage(), q=qNow();
    if(s===7&&state.submitted){go(8);return;}
    if(s===1&&Object.keys(state.ksu).length!==3){missing(t('Choose one answer for Knowledge, Skills and Understanding.','请分别为知识、技能和理解选择一个答案。'));return;}
    if(s===2){state.reading=Math.max(state.reading,lessonStep+1); if(lessonStep<3){lessonStep++;changed();draw(true);}else go(3);return;}
    if(s===5&&(!state.pit.phase||!state.pit.next?.trim())){missing(t('Choose a phase and one next step.','请选择学习状态和下一步。'));return;}
    if(s===6&&!newExtra){state.extraDone=true;go(7);return;}
    if(q){
      const r=row(q);
      if(!r.attemptCount||r.draft!==r.lastAnswer){
        if(['build','pixel'].includes(q.kind)&&!r.touched&&!r.attemptCount){
          missing(t('Tap the grid to make your answer, or press Check my answer if you meant to leave every square off.','点按网格填写答案；如果确实想全部留空，请点检查答案。'));return;
        }
        if(!r.draft.trim()){missing(t('Give this question a try first.','请先尝试这道题。'));return;}
        check(q);
        flash(t('Read the feedback above. Press Continue again when ready.','请先读上面的反馈。准备好后再次点继续。'),'ok');
        $('feedback')?.scrollIntoView({block:'nearest'});return;
      }
      if(s===6){newExtra=false;notice='';draw(true);return;}
      if(index()+1<paths[s].length){step(index()+1);return;}
      const missed=paths[s].findIndex(item=>!checked(item));
      if(missed!==-1){step(missed);missing(t('This is the next question you haven’t tried.','这道题还没有尝试。'));return;}
      if(s===7||s===8){
        if(s===7) state.submitted=true; else state.quizDone=true;
        if(s===7) state.unlocked=8; notice='';changed();sync();draw(true);return;
      }
    }
    go(s+1);
  }
  function back() {
    const s=stage();
    if(s===6&&newExtra){newExtra=false;notice='';draw(true);}
    else if(s===2&&lessonStep>0){lessonStep--;notice='';draw(true);}
    else if(paths[s]&&index()>0&&!(s===7&&state.submitted)&&!(s===8&&state.quizDone)) step(index()-1);
    else go(s-1);
  }
  root.addEventListener('click',ev=>{
    const b=ev.target.closest('button'); if(!b||!profile) return;
    const d=b.dataset,q=qNow(), r=q?row(q):null;
    if('stage' in d){const n=Number(d.stage);if(n<=state.unlocked)go(n);else {flash(t('Finish this stage first. Use the task and Continue button below.','请先完成本阶段，再点下方继续。'));$('notice')?.scrollIntoView({block:'nearest'});}return;}
    if('next'in d){next();return;} if('back'in d){back();return;}
    if('review'in d){if(stage()===7)state.submitted=false;else state.quizDone=false;step(0);return;}
    if('check'in d&&q){check(q);return;}
    if('revealNumber'in d){worked=1-worked;relaunch('[data-reveal-number]');return;}
    if('revealCode'in d){compare=!compare;relaunch('[data-reveal-code]');return;}
    if('phase'in d){state.pit.phase=phases[+d.phase][0];notice='';changed();relaunch('[data-phase="'+d.phase+'"]');return;}
    if('extra'in d){newExtra=true;step(+d.extra);return;}
    if(!r) return;
    if('answer'in d) r.draft=d.answer;
    else if('mark'in d) {const n=+d.mark;r.places=r.places.includes(n)?r.places.filter(x=>x!==n):r.places.concat(n);}
    else if('bit'in d||'pixel'in d){const i=+(d.bit??d.pixel);r.touched=true;r.draft=Array.from(r.draft,(v,j)=>j===i?(v==='0'?'1':'0'):v).join('');}
    else return;
    notice='';changed();
    const type=['answer','mark','bit','pixel'].find(k=>k in d);relaunch('[data-'+type+'="'+d[type]+'"]');
  });
  root.addEventListener('input',ev=>{
    if(!profile)return;
    const el=ev.target,r=selected();
    if(el.id==='answer'&&r){r.draft=el.value;const f=$('feedback');if(f)f.textContent=updateCheck(r,qNow());}
    else if(el.id==='working'&&r)r.working=el.value;
    else return;
    changed();
  });
  root.addEventListener('change',ev=>{
    if(!profile)return;
    const el=ev.target;
    if('ksu'in el.dataset){if(el.value)state.ksu[el.dataset.ksu]=el.value;else delete state.ksu[el.dataset.ksu];}
    else if(el.id==='pit-next')state.pit.next=el.value;
    else return;
    changed(); if($('notice'))$('notice').textContent='';
  });
  $('language').addEventListener('click',()=>{if(joinBusy)return;const entries=!profile&&$('join')?[...new FormData($('join')).entries()]:[];bi=!bi;C.write('y7-revision-language',bi?'bi':'en');draw();for(const [k,v] of entries){$('join').elements[k].value=v;}});
  $('backup').addEventListener('click',()=>{if(profile)C.download('Year7_Revision_'+profile.group+'_Backup.json',JSON.stringify({name:profile.name,className:profile.group,...buildSnapshot()},null,2));});
  $('recover').addEventListener('click',async()=>{
    if(!profile||!confirm(t('Have you downloaded a backup? Loading the school copy replaces unsynced changes on this device.','下载备份了吗？加载学校版本将替换此设备上未同步的修改。')))return;
    try {
      const reply=await C.pupil('load',profile.id,profile.secret);
      state={...blank(),...reply.snapshot,stage:reply.snapshot.stageIndex??0};
      profile.version=reply.version;profile.dirty=false;profile.conflict=false;problem='';
      lessonStep=Math.min(state.reading,3);newExtra=false;keeping={};notice='';persist();draw(true);
    } catch { $('save').textContent=t('Could not load the school copy. Your local work is still here.','无法加载学校版本。本地作业仍保留。'); }
  });
  window.addEventListener('online',()=>{connect();sync();});
  window.addEventListener('resize',alignStage);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')sync();});
  draw();
})();
