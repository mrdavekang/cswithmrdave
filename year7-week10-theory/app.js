'use strict';
(() => {
  const L=window.ARCADE, cards=L.cards, $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stamp=()=>new Date().toISOString();
  const bits=n=>n.toString(2).padStart(8,'0');
  const sum=p=>[...p].reduce((n,b,i)=>n+Number(b)*L.weights.slice(-p.length)[i],0);
  const numeric=x=>String(x??'').normalize('NFKC').trim().replace(/[\s,]/g,'').replace(/(?:points?|bits?|分|位)$/i,'');
  const hash=s=>{let h=2166136261;for(const c of s){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(36);};
  const key=(name,cls)=>'binary-arcade:'+L.id+':'+hash(name.trim().toLowerCase()+'|'+cls.trim().toLowerCase());
  let state=null,storageKey='',storageOkay=true,toastTimer,importPurpose='resume',reportStudent=null;
  const current=()=>cards[state.p];
  const teacher=()=>state?.identity.name.toLowerCase()==='teacher';
  const zh=()=>state?.lang==='zh';
  const tr=(en,cn)=>esc(en)+(zh()&&cn?`<span class="zh" lang="zh-Hans">${esc(cn)}</span>`:'');
  const t=(en,cn)=>zh()&&cn?en+' / '+cn:en;
  const core=c=>!['extra','break','games'].includes(c.stage);
  const rec=(id=current().id)=>state.records[id]||(state.records[id]={answer:'',attempts:[],hint:false,checked:false});
  const isDone=c=>Boolean(state.done[c.id]);
  const event=(type,value)=>{state.events.push({at:stamp(),card:current().id,type,value});if(state.events.length>1500)state.events.shift();};
  function fresh(identity,lang,theme){return {lesson:L.id,version:1,identity,lang,theme,rainbow:false,p:0,records:{},done:{},events:[],practice:{level:'steady',index:0,records:{}},modelStep:0,created:stamp(),updated:stamp()};}
  function save(){
    if(!state)return;state.updated=stamp();
    try{localStorage.setItem(storageKey,JSON.stringify(state));storageOkay=true;}catch{storageOkay=false;}
    const s=$('#saved');if(s){s.textContent=storageOkay?t('Saved on this device','已保存在本设备'):t('Not saved — download backup','未保存，请下载备份');s.classList.toggle('warning-text',!storageOkay);}
  }
  function toast(msg){$('#notice').textContent=msg;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#notice').textContent='',6500);}
  function valid(s){
    if(!s||s.lesson!==L.id||s.version!==1||!s.identity||typeof s.identity.name!=='string'||typeof s.identity.cls!=='string')return false;
    if(s.identity.name.length>100||s.identity.cls.length>50||!s.identity.name.trim())return false;
    if(!Number.isInteger(s.p)||s.p<0||s.p>=cards.length)return false;
    if(!s.records||Array.isArray(s.records)||typeof s.records!=='object'||!s.done||Array.isArray(s.done)||typeof s.done!=='object')return false;
    if(!Array.isArray(s.events)||s.events.length>1500||!s.practice||typeof s.practice!=='object')return false;
    if(!['en','zh'].includes(s.lang)||!['garden','ocean','arcade','paper'].includes(s.theme))return false;
    for(const r of Object.values(s.records))if(!r||typeof r.answer!=='string'||r.answer.length>3000||!Array.isArray(r.attempts)||r.attempts.length>300)return false;
    if(!s.practice.records||typeof s.practice.records!=='object'||!['steady','stretch','expert'].includes(s.practice.level))return false;
    if(!Number.isInteger(s.practice.index)||s.practice.index<0||s.practice.index>10000)return false;
    if(!Number.isInteger(s.modelStep)||s.modelStep<0||s.modelStep>5)return false;
    return true;
  }
  function landing(){
    document.documentElement.dataset.theme='garden';
    $('#app').innerHTML=`<header class="landing-top"><a class="brand" href="index.html"><span class="logo" aria-hidden="true">01</span> BINARY ARCADE <small>YEAR 7 · WEEK 10</small></a><span class="lesson-tag">60-minute theory</span></header>
      <main id="lesson-main" class="landing-grid"><section class="landing-story"><p class="eyebrow">Same digits. Bigger possibilities.</p><h1>Level up<br>your binary.</h1><p class="large">Read the score. Build the message.<br>Fix the bit that went wrong.</p><img src="assets/${L.art.hero[0]}" alt="${L.art.hero[1]}" width="1600" height="1200"><div class="landing-goal"><strong>WAGBA</strong><p>${esc(L.wagba)}</p></div></section>
      <section class="entry"><p class="eyebrow">Start / resume</p><h2>Make this your lesson.</h2><p>You’ll use eight bits to work with arcade scores. No Python, Excel or screenshots needed.</p>
      <form id="entry-form" novalidate><div class="entry-inputs"><label>Your name <input id="name" type="text" autocomplete="off" maxlength="100" placeholder="Full name" required></label><label>Class <input id="class" type="text" autocomplete="off" maxlength="50" placeholder="e.g. 7T" required></label></div>
      <fieldset><legend>Language support / 语言支持</legend><label class="radio"><input type="radio" name="language" value="en" checked> English</label><label class="radio"><input type="radio" name="language" value="zh"> English + 中文</label><p class="small">English stays visible. Mandarin is an extra explanation, not a separate task.</p></fieldset>
      <fieldset><legend>Choose a calm colour style</legend><div class="themes">${[['garden','Garden'],['ocean','Ocean'],['arcade','Arcade'],['paper','Paper']].map(([id,label],i)=>`<label class="theme-choice ${id}"><input type="radio" name="theme" value="${id}" ${i===0?'checked':''}> ${label}</label>`).join('')}</div></fieldset>
      <p id="entry-error" class="error-text" role="alert"></p><button class="primary wide" type="submit">Start / resume my lesson →</button></form>
      <div class="entry-tools"><button data-action="restore">Restore a JSON backup</button><button data-action="device">iPad / laptop help</button></div>
      <p class="privacy">Progress stays in this browser on this device. This is not a school login or an online teacher tracker. Use your own details so another pupil’s work is not overwritten.</p><p class="small">Teacher preview: enter <strong>teacher</strong> as the name to open every card. Leave class blank.</p></section></main>`;
    $('#entry-form').onsubmit=e=>{
      e.preventDefault();const name=$('#name').value.trim(),cls=$('#class').value.trim(),isTeacher=name.toLowerCase()==='teacher';
      if(!name||(!isTeacher&&!cls)){const missing=!name?$('#name'):$('#class');$('#entry-error').textContent=!name?'Type your name first. / 请先输入姓名。':'Type your class, for example 7T. / 请输入班级，例如7T。';missing.setAttribute('aria-invalid','true');missing.focus();return;}
      const lang=$('input[name="language"]:checked').value,theme=$('input[name="theme"]:checked').value;
      storageKey=key(name,isTeacher?'preview':cls);let loaded;
      try{const raw=localStorage.getItem(storageKey);if(raw)loaded=JSON.parse(raw);}catch{}
      state=valid(loaded)?loaded:fresh({name:isTeacher?'teacher':name,cls:isTeacher?'Preview':cls},lang,theme);
      state.lang=lang;state.theme=theme;save();render(true);
    };
  }
  function headline(){
    const c=current(),completed=cards.filter(x=>core(x)&&isDone(x)).length,total=cards.filter(core).length;
    return `<header class="top"><div class="top-line"><a class="brand" href="#" data-action="home"><span class="logo" aria-hidden="true">01</span> BINARY ARCADE <small>YEAR 7 · WEEK 10</small></a><div class="top-controls"><label class="language-label"><span>Language / 语言</span><select id="language" aria-label="Language support"><option value="en" ${!zh()?'selected':''}>English</option><option value="zh" ${zh()?'selected':''}>English + 中文</option></select></label><button data-action="backup" class="backup">↓ ${t('Download backup','下载备份')}</button></div></div>
      <div class="goal-strip"><strong>WAGBA</strong><span>${tr(L.wagba,L.zhWagba)}</span><button data-action="goals">${t('K · S · U','学习目标')}</button></div>
      <div class="progress-heading"><span>${teacher()?'<strong class="teacher-badge">Teacher preview · all cards open</strong>':esc(state.identity.name)+' · '+esc(state.identity.cls)}</span><span id="saved" role="status">${storageOkay?t('Saved on this device','已保存在本设备'):t('Not saved — download backup','未保存，请下载备份')}</span><span>${completed}/${total} ${t('core steps attempted','核心步骤已尝试')}</span></div>
      <div class="progress-line" role="progressbar" aria-label="Core lesson progress" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${total}"><span style="width:${completed/total*100}%"></span></div>
      <nav class="stage-nav" aria-label="Lesson stages">${L.stages.map(([id,name,time],i)=>{const inStage=cards.filter(x=>x.stage===id),done=inStage.filter(isDone).length;return `<button data-stage="${id}" class="stage ${c.stage===id?'active':''}" ${c.stage===id?'aria-current="step"':''} title="${esc(time)} · ${done}/${inStage.length} steps"><span class="stage-n">${i+1}</span><span>${esc(name)}${done===inStage.length?' ✓':''}</span></button>`;}).join('')}</nav></header>`;
  }
  function tools(){return `<div class="tool-strip"><div class="word-strip"><strong>${t('Keywords','关键词')}</strong> ${['binary','denary','bit','byte','place value'].map(w=>`<button data-word="${w}">${esc(w)}</button>`).join('')}</div><div class="support-tools"><button data-action="vocabulary">${t('All words','全部词汇')}</button><button data-action="device">${t('iPad / laptop help','设备帮助')}</button>${teacher()?'<button data-action="teacher-plan">Teacher guide</button>':''}</div></div>`;}
  function image(key,src){
    const a=L.art[key];if(!a)return '';
    return `<figure class="visual"><img src="assets/${src||a[0]}" alt="${esc(a[1])}" width="1600" height="1200"><button class="zoom" data-zoom="${esc(src||a[0])}" data-alt="${esc(a[1])}">${t('Enlarge image','放大图片')} ↗</button></figure>`;
  }
  function mat(pattern,{editable=false,width=8,live=false}={}){
    const ws=L.weights.slice(-width);return `<div class="binary-mat ${state.rainbow?'rainbow':''}" style="--columns:${width}" role="group" aria-label="${editable?'Tap digit tiles to change your binary pattern':'Binary place-value chart'}"><div class="place-row">${ws.map(w=>`<span>${w}</span>`).join('')}</div><div class="bit-row">${[...pattern].map((b,i)=>editable?`<button data-bit="${i}" class="bit ${b==='1'?'on':''}" style="--bit-index:${i}" aria-label="${ws[i]} column: ${b}. Tap to change to ${b==='1'?0:1}." aria-pressed="${b==='1'}"><span>${b}</span></button>`:`<span class="bit fixed ${b==='1'?'on':''}">${b}</span>`).join('')}</div></div>${editable?`<p class="tile-help">${tr('Tap a digit: 0 leaves the value out · 1 includes it.','点数字：0不计入，1计入。')}</p>${live?`<div class="live-total">${t('Current total','当前总数')}: <strong>${sum(pattern)}</strong></div>`:''}`:''}`;
  }
  function readBox(c){return `<div class="read-box"><p class="eyebrow">${t(c.kind==='reflect'?'Think first':'Read first',c.kind==='reflect'?'先想一想':'先阅读')}</p><p>${tr(c.read,c.zhRead)}</p></div>`;}
  function options(c,r){return `<div class="options" role="radiogroup" aria-label="${esc(c.prompt)}">${c.options.map(([id,en,cn],i)=>`<button type="button" role="radio" aria-checked="${r.answer===id}" class="option ${r.answer===id?'selected':''}" data-answer="${esc(id)}"><span class="letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${tr(en,cn)}</span><span class="picked" aria-hidden="true">${r.answer===id?'✓':''}</span></button>`).join('')}</div>`;}
  function field(c,r){
    const prompt=`<p class="eyebrow question-label">${t(c.kind==='reflect'?'Your reflection':'Your turn',c.kind==='reflect'?'你的反思':'轮到你')}</p><h2 class="question" id="question-title">${tr(c.prompt,c.zhPrompt)}</h2>`;
    if(c.kind==='choice'||c.kind==='reflect')return `${prompt}${options(c,r)}`;
    if(c.kind==='number')return `${prompt}<label class="answer-label" for="number-answer">${t('Type the denary number','输入十进制数')}<input id="number-answer" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.answer)}" aria-describedby="answer-error feedback" placeholder="${t('Your number','你的数字')}"></label>`;
    if(c.kind==='build')return `<p class="eyebrow question-label">${t('Your turn','轮到你')}</p><h2 class="question" id="question-title">${tr(c.prompt,c.zhPrompt)}</h2><div class="target-chip">${t('Target score','目标分数')} <strong>${c.target}</strong></div>${mat(r.answer,{editable:true,live:c.live})}<p class="pattern-text">${t('Your eight bits','你的八位二进制数')}: <code>${r.answer}</code></p>`;
    return '';
  }
  const nextAdvice=phase=>({new:['Follow the 22 example again, then build 19 without looking at its answer.','再看22的示范，然后不看答案尝试组成19。'],consolidating:['Try 90 again. Say which columns you chose before checking.','再试90。检查前说出你选了哪些位值。'],treading:['Try the one-bit lab or the Expert practice level. Explain what changes.','尝试单个位实验或高阶练习，解释变化。'],drowning:['Show your teacher one place you got stuck. Use the 8, 4, 2, 1 end of the chart first, then add 16.','把卡住的一步给老师看。先从位值表右边8、4、2、1开始，再加16。']}[phase]);
  function feedback(c,r){
    if(!r.checked)return '';
    if(c.kind==='reflect'){const advice=c.phase?nextAdvice(r.answer):null;return `<div class="feedback info" role="status"><strong>${t('Reflection saved — there is no right or wrong rating.','反思已保存，评价没有对错。')}</strong>${advice?`<p>${tr(...advice)}</p>`:''}</div>`;}
    const correct=r.correct;return `<div class="feedback ${correct?'success':'review'}" role="status"><strong>${t(correct?'✓ That matches.':'↻ Not quite yet — here is the explanation.',correct?'✓ 正确。':'↻ 还不完全正确，看看解释。')}</strong><p>${tr(c.explain,c.zhExplain||explainZh(c))}</p>${!correct?`<p class="small">${tr('Try again, or continue and revisit this question later. Your first attempt is kept.','可以再试一次，也可以继续后再复习。第一次尝试会保留。')}</p>`:''}</div>`;
  }
  function explainZh(c){
    if(c.kind==='build')return `${c.target}＝${L.weights.filter(w=>(c.target&w)!==0).join('＋')||'0'}，八位二进制数是 ${c.answer}。`;
    if(c.pattern&&c.kind==='number')return `${c.pattern} 中1所在列的位值相加，得到 ${c.answer}。0所在列不计入。`;
    return {'retrieve-rule':'位值仍是8，但下面是0，所以不把8加入总数。','retrieve-double':'8＋8＝16，左边下一列的位值是16。','eight-places':'从左到右是128、64、32、16，右边仍是8、4、2、1。','byte-fact':'八个数字位置就是八位，包括0。八位组成一个字节。','cross-32':'A是31，B是32。较大的位值可以大于多个较小位值之和。','inspect-card':'A是15，B是16。C是32＋1＝33，不是35。','leading-zero':'两个数的值都是8＋2＝10。左边加0不改变数值。','same-value-space':'B有八位，是一个字节。A只有四位。数值相同不等于位数相同。','position-reason':'00000010＝2，01000000＝64。1所在列的位值决定它代表多少。','exit-byte':'数值是0，因为没有选中任何位值。长度仍是八位，也就是一个字节。'}[c.id]||'';
  }
  function checkArea(c,r){return `<p id="answer-error" class="error-text" role="alert"></p><div id="feedback">${feedback(c,r)}</div>${c.hint?`<button class="hint-button" data-action="hint">${t(r.hint?'Hint is open':'Show a hint',r.hint?'提示已打开':'看提示')}</button><div class="hint" ${r.hint?'':'hidden'}>${tr(c.hint,c.zhHint)}</div>`:''}`;}
  function model(c){const s=state.modelStep,step=L.workedSteps[s];return `<div class="model-grid">${image('model',`steps/step-0${s+1}.png`)}<section>${readBox(c)}<div class="model-step"><p class="eyebrow">${t('Teacher model','示范')} · ${s+1} / 6</p><h2>${esc(step[0])}</h2><p>${tr(step[1],step[2])}</p><div class="button-row"><button data-action="model-back" ${s===0?'disabled':''}>← ${t('Back','上一步')}</button><button class="primary" data-action="model-next" ${s===5?'disabled':''}>${t('Next step','下一步')} →</button><button data-action="replay">${t('Replay','重看')}</button></div></div><p class="small">${tr('Question marks are unfinished places, not binary digits. The finished pattern uses only 0 and 1. You can replay this model later using Read first.','问号表示尚未完成的位置，不是二进制数字。最终只会有0和1。之后可以回到“先阅读”重新观看。')}</p></section></div>`;}
  function practiceProblem(){
    const p=state.practice,sets={steady:[18,21,24,35,42,51],stretch:[66,73,90,101,129,154],expert:[173,201,218,239,250,255]},target=sets[p.level][p.index%6];
    const mode=['build','number','repair','number','build','repair'][p.index%6],id=p.level+'-'+p.index;
    const c={id,kind:mode==='repair'?'build':mode,target,answer:mode==='number'?String(target):bits(target),prompt:mode==='repair'?`Repair ${bits(target^1)} so it stores ${target}. Change one bit.`:mode==='build'?`Store a score of ${target} in eight bits.`:`Decode ${bits(target)}. What is the denary score?`,zhPrompt:mode==='repair'?`修复${bits(target^1)}，只改变一位，让它表示${target}。`:mode==='build'?`用八位二进制数存储${target}分。`:`读出${bits(target)}的十进制分数。`,explain:`${bits(target)} = ${L.weights.filter(w=>(w&target)!==0).join(' + ')} = ${target}.`,pattern:mode==='number'?bits(target):null};
    const r=p.records[id]||(p.records[id]={answer:mode==='repair'?bits(target^1):mode==='build'?'00000000':'',attempts:[],checked:false,hint:false});
    r.prompt=c.prompt;r.target=target;r.kind=c.kind;return {c,r};
  }
  function practice(){const {c,r}=practiceProblem();return `<div class="practice-layout"><div class="read-box"><p>${tr(current().read,current().zhRead)}</p></div><div class="practice-levels" role="group" aria-label="Practice level">${[['steady','Steady','巩固'],['stretch','Stretch','挑战'],['expert','Expert','高阶']].map(([id,en,cn])=>`<button data-level="${id}" class="${state.practice.level===id?'primary':''}" aria-pressed="${state.practice.level===id}">${t(en,cn)}</button>`).join('')}<label class="rainbow-choice"><input type="checkbox" id="rainbow" ${state.rainbow?'checked':''}> ${t('Rainbow bit tiles','彩虹数字方框')}</label></div><div class="practice-board"><p class="eyebrow">${t('Practice round','练习')} ${state.practice.index+1}</p>${c.pattern?mat(c.pattern):''}${field(c,r)}<p id="answer-error" class="error-text" role="alert"></p><div id="feedback">${feedback(c,r)}</div><div class="button-row"><button class="primary" data-action="practice-check">${t('Check this round','检查本轮')}</button><button data-action="practice-next">${t('Another question','再来一题')} →</button></div><p class="small">${t('Rounds attempted','已尝试轮数')}: ${Object.values(state.practice.records).filter(x=>x.checked).length}. ${tr('There is no timer or leaderboard. Keep practising, or move on when your teacher asks.','没有计时或排行榜。继续练习，或在老师要求时进入下一阶段。')}</p></div></div>`;}
  function games(){
    const now=Date.now(),defs=[
      ['gimkit','Gimkit · Don’t Look Down','Climb while practising our 15 questions. Checkpoints are on. Finish by reaching Summit 3 or answering 15 questions correctly.','一边攀爬一边练习15道题。已开启检查点。到达第3个山顶或答对15题即可完成。','2026-11-02T23:00:00+08:00','2 November 2026 · 11pm MYT'],
      ['blooket','Blooket · Binary Arcade','Choose a solo mode. Work towards 15 correct answers. Use the place values; speed is not the learning goal.','选择单人模式，以答对15题为目标。用位值思考，速度不是学习目标。','2026-11-09T13:41:00+08:00','9 November 2026 · 1:41pm MYT'],
      ['practice','Binary Game · untimed practice','Choose 8-bit, then Flip the bits or Read the binary. Leave the 60-second timer off at first. No sign-up is needed.','选择8-bit，再选Flip the bits或Read the binary。初次先关闭60秒计时，不需要注册。',null,'No assignment deadline']
    ];return `<div class="game-grid">${defs.map(([id,title,en,cn,date,due])=>{const expired=date&&now>new Date(date).getTime();return `<article class="game-card"><span class="game-icon" aria-hidden="true">${id==='gimkit'?'↗':id==='blooket'?'▦':'01'}</span><h2>${esc(title)}</h2><p>${tr(en,cn)}</p><p class="deadline">${expired?'Closed · ':''}${esc(due)}</p>${expired?`<p class="review-note">${t('This assignment has closed. Use the untimed Binary Game instead.','作业已截止，请用无计时Binary Game继续练习。')}</p>`:`<a class="primary external" data-external="${id}" href="${L.links[id]}" target="_blank" rel="noopener noreferrer">${t('Open game','打开游戏')} ↗</a>`}</article>`;}).join('')}</div><p class="small">${tr('Games open in a new tab. Return here when finished. This app records that you opened a link, not your game score. Assignment results are held by Blooket or Gimkit. Use only the name your teacher asks you to use; do not create accounts or enter an email just to play.','游戏在新标签页打开，结束后回到这里。本应用只记录打开链接，不记录游戏得分。作业成绩由Blooket或Gimkit保存。只使用老师要求的名字，不要为了游戏注册账户或输入邮箱。')}</p>`;
  }
  function summary(s=state){
    const rows=cards.filter(c=>core(c)),attempted=rows.filter(c=>s.done[c.id]).length,review=rows.filter(c=>s.records[c.id]?.checked&&s.records[c.id]?.correct===false);
    return `<div class="summary-grid"><div><strong>${attempted}/${rows.length}</strong><span>${t('core steps attempted','已尝试核心步骤')}</span></div><div><strong>${review.length}</strong><span>${t('questions to revisit','需要复习的题')}</span></div><div><strong>${Object.values(s.practice.records).filter(r=>r.checked).length}</strong><span>${t('extra practice rounds','额外练习轮数')}</span></div></div>`;
  }
  function finish(){
    const missing=cards.filter(c=>core(c)&&!isDone(c)),review=cards.filter(c=>state.records[c.id]?.checked&&state.records[c.id]?.correct===false);
    const list=(items,title)=>`<h2>${esc(title)}</h2>${items.map(c=>`<button data-card="${c.id}">↻ ${esc(c.title)} →</button>`).join('')}`;
    const missingHTML=missing.length?list(missing,t('Still to attempt','尚未尝试')):`<p class="success-note">✓ ${t('Every core step has an attempt.','所有核心步骤均已尝试。')}</p>`;
    const reviewHTML=review.length?list(review,t('Useful questions to revisit','值得再练习的题')):`<p>${t('Use an extra challenge to stretch your understanding.','可以用额外挑战拓展理解。')}</p>`;
    return `${summary()}<div class="review-list">${missingHTML}${reviewHTML}</div><div class="button-row"><button data-action="report">${t('Review my evidence','查看学习记录')}</button><button data-action="backup">${t('Download JSON backup','下载JSON备份')}</button><button data-action="print">${t('Print / save PDF','打印或保存PDF')}</button></div><p class="small">${tr('No screenshot upload or compulsory PDF submission is required in this app. Your teacher will tell you if they want a backup file. A backup is not a Teams submission until you upload it there.','本应用不要求上传截图或强制提交PDF。老师会告知是否需要备份文件。下载备份不等于已在Teams提交。')}</p>`;
  }
  function body(c,r){
    if(c.kind==='model')return model(c);
    if(c.kind==='practice')return practice();
    if(c.kind==='games')return readBox(c)+games();
    if(c.kind==='finish')return readBox(c)+finish();
    if(c.kind==='break')return `<div class="simple-card">${readBox(c)}<div class="break-action"><p class="eyebrow">8-BIT · NO TIMER</p><h2>${t('Make three targets, then come back.','组成三个目标数字，然后回来。')}</h2><a class="primary external" data-external="practice-break" href="${L.links.practice}" target="_blank" rel="noopener noreferrer">${t('Open Binary Game','打开Binary Game')} ↗</a><p>${tr('If it is not game time, continue to the learning pitstop. You do not have to open this link to move on.','如果现在不是游戏时间，请继续到学习反思。不打开游戏也可以继续。')}</p></div></div>`;
    if(c.kind==='read')return `<div class="${c.image?'content-grid':'simple-card'}">${c.image?image(c.image):''}<section>${c.definition?`<div class="definition-block"><p class="eyebrow">${t('School definition of learning','学校学习定义')}</p><blockquote>${tr(c.read,c.zhRead)}</blockquote></div>`:readBox(c)}${c.overview?`<div class="ksu-cards">${L.KSU.map(([label,en,cn])=>`<div><strong>${label}</strong><p>${tr(en,cn)}</p></div>`).join('')}</div><div class="expectations">${tr('Work independently. Read the goal, try an answer, check the feedback. When Mr Dave says “Pause and look”, stop tapping and look at the teacher.','独立完成。先读目标，再尝试作答并看反馈。老师说“暂停，看这里”时，停止点击，看老师。')}</div>`:''}${c.visual==='repair-steps'?'<ol class="repair-sequence"><li>Read the stored score.</li><li>Compare with the target.</li><li>Change the needed bit.</li><li>Add the values to check.</li></ol>':''}${c.aside?`<div class="meaning-box"><p class="eyebrow">${t(c.definition?'What this means today':'A small example',c.definition?'今天如何应用':'小示例')}</p><p>${tr(c.aside,c.zhAside)}</p></div>`:''}</section></div>`;
    if(c.kind==='build'&&!c.image)return `<div class="content-grid build-grid"><section>${readBox(c)}</section><section class="question-box" aria-labelledby="question-title">${field(c,r)}${checkArea(c,r)}<label class="rainbow-choice drawing-style"><input type="checkbox" id="rainbow" ${state.rainbow?'checked':''}> ${t('Rainbow bit tiles','彩虹数字方框')}</label></section></div>`;
    let visual='';if(c.image)visual=image(c.image);else if(c.visual==='doubling')visual=`<div class="doubling" aria-label="1 doubles to 2, then 4, then 8, then a missing value">${['1','2','4','8','?'].map((n,i)=>`<span>${n}</span>${i<4?'<b aria-hidden="true">→</b>':''}`).join('')}</div>`;else if(c.pattern&&c.kind!=='build')visual=`<div class="chart-panel"><p class="eyebrow">${t('Read the selected columns','读出选中的位值')}</p>${mat(c.pattern,{width:c.width||8})}<p class="chart-reminder">${tr('1 = include this value · 0 = leave it out','1＝计入位值，0＝不计入')}</p></div>`;else if(c.comparePatterns)visual=`<div class="comparison">${c.comparePatterns.map((p,i)=>`<section><p class="eyebrow">${t('Pattern','二进制数')} ${String.fromCharCode(65+i)}</p>${mat(p)}</section>`).join('')}</div>`;
    if(c.pattern&&!c.image&&c.kind==='number')return `<div class="content-grid"><section class="read-chart">${readBox(c)}${visual}</section><section class="question-box" aria-labelledby="question-title">${field(c,r)}${checkArea(c,r)}</section></div>`;
    return `<div class="${visual?'content-grid':'simple-card'}">${visual?`<div class="visual-side">${visual}</div>`:''}<section class="task-side">${c.learningType?`<p class="learning-type">${esc(c.learningType)}</p>`:''}${readBox(c)}<div class="question-box" aria-labelledby="question-title">${field(c,r)}${checkArea(c,r)}</div></section></div>`;
  }
  function render(focus=false){
    if(!state)return landing();document.documentElement.dataset.theme=state.theme;const c=current(),r=rec();
    if(c.kind==='build'&&!r.answer)r.answer=c.initial;
    const stage=L.stages.find(x=>x[0]===c.stage),within=cards.filter(x=>x.stage===c.stage),position=within.indexOf(c)+1;
    $('#app').innerHTML=headline()+`<main id="lesson-main" tabindex="-1">${tools()}<article class="lesson-card" data-card-id="${c.id}"><div class="card-title"><div><p class="eyebrow">${esc(stage[1])} · ${position} / ${within.length} · ${esc(stage[2])}</p><h1>${tr(c.title,c.zhTitle)}</h1></div><span class="card-state ${r.correct===false?'needs-review':''}">${isDone(c)?(r.correct===false?t('↻ Review','↻ 复习'):t('✓ Attempt saved','✓ 尝试已保存')):t('One step at a time','一步一步来')}</span></div>${body(c,r)}</article>
      <footer class="lesson-footer"><button data-action="back" ${state.p===0?'disabled':''}>← ${t('Back','上一步')}</button><div class="footer-center">${c.stage==='extra'?`<button data-stage="pitstop">${t('Teacher says move on? Go to pitstop','老师要求继续？进入学习反思')} →</button>`:`<span>${t('Read → try → check → continue','阅读 → 尝试 → 检查 → 继续')}</span>`}</div><button class="primary next" data-action="next">${nextLabel(c,r)}</button></footer></main>`;
    $('#language').onchange=e=>{state.lang=e.target.value;save();render();};
    const n=$('#number-answer');if(n){n.oninput=()=>answer(n.value,false);n.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(current().kind==='practice'){const {c,r}=practiceProblem();if(check(c,r))render();}else next();}};}
    const rainbow=$('#rainbow');if(rainbow)rainbow.onchange=e=>{state.rainbow=e.target.checked;save();render();};
    $('.stage.active')?.scrollIntoView({block:'nearest',inline:'nearest'});
    if(focus){$('#lesson-main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  }
  function nextLabel(c,r){
    if(c.kind==='reflect')return t('Save reflection & continue','保存反思并继续')+' →';
    if(['choice','number','build'].includes(c.kind)&&!r.checked)return t('Check my answer','检查答案');
    if(state.p===cards.length-1)return t('Review my progress','查看进度');
    return (r.correct===false?t('Continue — revisit later','继续，稍后复习'):t('Continue','继续'))+' →';
  }
  function answer(value,rerender=true){
    const r=current().kind==='practice'?practiceProblem().r:rec();r.answer=value;r.checked=false;delete r.correct;
    if(current().kind!=='practice')delete state.done[current().id];save();
    if(rerender){event('answer',value);render();}else {const f=$('#feedback');if(f)f.innerHTML='';const e=$('#answer-error');if(e)e.textContent='';$('.next').textContent=nextLabel(current(),r);$('#number-answer')?.removeAttribute('aria-invalid');}
  }
  function check(c,r){
    if(!String(r.answer).trim()){const e=$('#answer-error');e.textContent=t(c.kind==='number'?'Type a number in the answer box, then check.':'Choose one answer above, then continue.',c.kind==='number'?'先在答案框输入数字，再检查。':'先选择上面的一个答案，再继续。');$('#number-answer')?.setAttribute('aria-invalid','true');($('#number-answer')||$('.option'))?.focus();e.scrollIntoView({block:'nearest'});return false;}
    const correct=c.kind==='reflect'?null:c.kind==='number'?(/^\d+$/.test(numeric(r.answer))&&Number(numeric(r.answer))===Number(c.answer)):r.answer===c.answer;
    r.checked=true;r.correct=correct;r.attempts.push({at:stamp(),answer:r.answer,correct,hintUsed:r.hint});if(r.attempts.length>300)r.attempts.shift();
    if(cards.some(x=>x.id===c.id))state.done[c.id]=true;event('check',{id:c.id,answer:r.answer,correct});save();return true;
  }
  function next(){
    const c=current(),r=rec();
    if(c.kind==='reflect'&&!r.checked&&!teacher()){if(!check(c,r))return;}
    else if(['choice','number','build'].includes(c.kind)&&!r.checked&&!teacher()){if(check(c,r)){render();$('#feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'});}return;}
    else if(['read','model','break','practice','finish','games'].includes(c.kind)){state.done[c.id]=true;save();}
    if(state.p===cards.length-1){go(cards.findIndex(x=>x.id==='finish'),true);return;}
    go(state.p+1);
  }
  function go(index,force=false){
    if(index<0||index>=cards.length)return;
    if(!teacher()&&!force&&index>state.p){const missing=cards.slice(0,index).find(c=>core(c)&&!isDone(c));if(missing){state.p=cards.indexOf(missing);save();render(true);toast(t(`Next unfinished step: ${missing.title}. Read it, make an attempt and check. A wrong answer will not lock you out.`,`下一步尚未完成：${missing.title}。阅读、尝试并检查，答错也不会锁住进度。`));return;}}
    state.p=index;save();render(true);
  }
  function download(data,type,filename){const blob=new Blob([data],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  const filename=()=>`Year7_${state.identity.cls}_${state.identity.name}_Week10_Binary`.replace(/[^\p{L}\p{N}_-]/gu,'_');
  function backup(){if(!state){toast('Enter your name and start the lesson before downloading a backup.');return;}save();download(JSON.stringify(state,null,2),'application/json',filename()+'.json');toast(t('Backup requested. On iPad, look in Files → Downloads. If a preview opens, use Share → Save to Files.','已请求下载备份。iPad请查看“文件→下载”。如果打开预览，点击“共享→存储到文件”。'));}
  function modal(html){$('#support-body').innerHTML=html;const d=$('#support');if(!d.open)d.showModal();$('#close-support').textContent=t('Back to my lesson','回到课程');}
  function goals(){modal(`<p class="eyebrow">${t('Today’s learning','今天的学习')}</p><h1>WAGBA</h1><p class="large">${tr(L.wagba,L.zhWagba)}</p><div class="ksu-cards">${L.KSU.map(([k,en,cn])=>`<div><h2>${k}</h2><p>${tr(en,cn)}</p></div>`).join('')}</div><h2>${t('Challenge','挑战')}</h2><p>${esc(L.challenge)}</p>`);}
  function vocab(word){const list=word?L.vocabulary.filter(x=>x[0]===word):L.vocabulary;modal(`<h1>${t('Computing words','计算机词汇')}</h1><p>${tr('Use the English computing word. The Mandarin meaning is here to help you connect the idea.','使用英语计算机术语，中文解释帮助你理解和联系概念。')}</p><dl class="vocab">${list.map(([term,cn,en,zhText])=>`<div><dt>${esc(term)} <span lang="zh-Hans">${esc(cn)}</span></dt><dd>${esc(en)}<span class="zh" lang="zh-Hans">${esc(zhText)}</span></dd></div>`).join('')}</dl>`);}
  function device(){modal(`<h1>iPad / laptop help · 设备帮助</h1><div class="help-grid"><section><h2>iPad / tablet</h2><ol><li>Use Safari or Chrome in landscape if the screen feels narrow.</li><li>Tap a digit tile to switch 0 and 1. No dragging is needed.</li><li>For a number answer, tap the box to open the keyboard. Tap Done to close it.</li><li>Language / 语言 stays at the top. Choose English + 中文 whenever you need it.</li><li>For a backup, tap Download backup. Look in <strong>Files → Downloads</strong>. If you see a preview instead, tap <strong>Share → Save to Files</strong>.</li><li>To resume on a different device: move the JSON file to that device, choose Restore a JSON backup and select the file.</li></ol><p lang="zh-Hans">点击数字方框切换0和1，不需要拖动。语言支持在顶部。备份后查看“文件→下载”；如果打开预览，用“共享→存储到文件”。</p></section><section><h2>Laptop / Mac</h2><ol><li>Click a choice or bit tile. Tab moves between controls; Space selects a focused tile.</li><li>Type numbers in the answer box. Press Enter or Check my answer.</li><li>Use Continue after reading the feedback. You can move on after a genuine attempt, even if it was incorrect.</li><li>Download backup saves a JSON file to your browser’s download location.</li><li>Print / save PDF opens your device’s print options. Choose Save as PDF if available. It does not silently save to a folder.</li></ol></section></div><h2>No screenshot or file upload needed for the lesson</h2><p>Your answer, bit choices, checks and extra-practice attempts are saved automatically on this device. Nothing is sent to a teacher dashboard. If your teacher asks for evidence, use Review my evidence, a JSON backup or Print / save PDF.</p><p>On iPad, a PDF may open as a preview. Use Share → Save to Files. In a print preview, expand the preview if needed, then Share → Save to Files. To send a file to Teams, open the assignment your teacher names, choose Add work / Attach, select the saved file, and check that it appears before selecting Turn in. Downloading is not the same as submitting.</p>`);}
  const friendly=(c,r)=>!r?'Not attempted':(['choice','reflect'].includes(c.kind)?c.options.find(o=>o[0]===r.answer)?.[1]||r.answer:r.answer)||'No response';
  function evidence(s=state){return `<h1>Year 7 · Week 10 · Binary Arcade</h1><p><strong>${esc(s.identity.name)} · ${esc(s.identity.cls)}</strong><br>Saved: ${esc(new Date(s.updated).toLocaleString('en-GB',{timeZone:'Asia/Kuala_Lumpur'}))} MYT</p><h2>WAGBA</h2><p>${esc(L.wagba)}</p>${L.KSU.map(([k,en])=>`<p><strong>${k}:</strong> ${esc(en)}</p>`).join('')}<h2>Learning record</h2>${cards.filter(c=>!['games','finish','practice','break'].includes(c.kind)).map(c=>{const r=s.records[c.id];return `<section class="report-item"><h3>${esc(c.title)}</h3><p>${esc(c.prompt||'Read / follow the example')}</p><p><strong>Response:</strong> <code>${esc(friendly(c,r))}</code></p><p><strong>Status:</strong> ${r?.checked?(c.kind==='reflect'?'Self-assessment saved':r.correct?'Correct on latest check':'Attempt saved — revisit'):s.done[c.id]?'Reading completed':'Not attempted'} · Checks: ${r?.attempts?.length||0} · Hint used: ${r?.hint?'Yes':'No'}</p>${r?.attempts?.length?`<details open><summary>Check history</summary><ul>${r.attempts.map(a=>`<li><code>${esc(a.answer)}</code> — ${a.correct===null?'reflection':a.correct?'correct':'not yet correct'}${a.hintUsed?' (with hint)':''}</li>`).join('')}</ul></details>`:''}</section>`;}).join('')}<h2>Extra practice</h2>${Object.entries(s.practice.records).map(([id,r])=>`<p>${esc(id)}: <code>${esc(r.answer)}</code> · ${r.attempts?.length||0} checks · ${r.checked?(r.correct?'correct':'revisit'):'not checked'}</p>`).join('')||'<p>No extra-practice rounds attempted.</p>'}<h2>External game links opened</h2><p>Opening a link is not proof that a game was played or completed.</p><ul>${s.events.filter(e=>e.type==='external-link').map(e=>`<li>${esc(e.value)} · ${esc(e.at)}</li>`).join('')||'<li>No game link opened.</li>'}</ul>`;}
  function printReport(s=state){
    if(!s)return;save();let output=$('#print-report');if(!output){output=document.createElement('section');output.id='print-report';document.body.append(output);}output.innerHTML=evidence(s);window.print();
  }
  function showReport(s=state){reportStudent=s;modal(`<div class="button-row"><button class="primary" data-action="print-report">Print / save PDF</button></div><p class="small">PDF is a backup choice, not a compulsory step. Your device chooses whether to download, show a preview or open print options.</p><div class="evidence">${evidence(s)}</div>`);}
  function teacherPlan(){modal(`<h1>Teacher guide · 60 minutes</h1><p>Typing <strong>teacher</strong> opens all cards. Preview work is stored separately. This is a static lesson, not a central monitoring system.</p><table class="plan-table"><thead><tr><th>Time</th><th>Stage</th><th>Teaching / assessment focus</th></tr></thead><tbody>${[
    ['0–2','Welcome','Read the goal and set independent working routines.'],['2–7','Do now','Retrieve four-bit 1001, zero contribution and doubling 8 to 16.'],['7–10','Types of learning','Separate the school definition from today’s KSU. Ratings are not scored.'],['10–16','Read first','Model the eight places, count all eight bits, then reveal 22 in six steps.'],['16–30','Main task 1','Seven rounds: decode, build, decode, build, decode, build and compare. Pause after 45 to sample explanations.'],['30–32','Read first','Model read → compare → change → check on 8 to 9.'],['32–47','Main task 2','Read stored 36; repair to 38; check labels; compare leading zeros, size and position.'],['47–51','Extra challenges','One-bit change 41 to 57; largest unsigned eight-bit value; repeatable levelled practice. Pupils need not finish all extras.'],['51–53','Practice break','Teacher-controlled short Linguaholic game. Can be skipped without blocking plenary.'],['53–56','Learning pitstop','Phase and topic-specific next step. Drowning is not an ability label.'],['56–60','Plenary','Fresh build 70, decode 129 and distinguish zero’s value from its eight-bit length.'],['After plenary','Games / evidence','Independent Blooket and Don’t Look Down. Use actual assignment deadlines. No screenshot or compulsory PDF.']
  ].map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table><h2>Progression and feedback</h2><p>Core steps require an attempt, not a perfect score. Wrong answers show an amber explanation, preserve the first response and allow progress. Extra challenges and the game break are not prerequisites. Navigation redirects to the earliest unfinished core step and names it.</p><h2>Review pupil evidence</h2><p>Ask for a pupil’s JSON backup only if needed. Open it here to review, without overwriting teacher work. This does not provide live class monitoring.</p><button data-action="teacher-import">Open pupil JSON for review</button><h2>Curriculum and pedagogy</h2><p>This lesson adapts KS3 binary-number representation and conversion objectives for Year 7 after four-bit work. NCCE places its source unit in Year 8; this is not a claim of NCCE Year 7 year-by-year alignment. Scope is unsigned whole-number values only: no binary arithmetic, negative representation, text encoding, Python or spreadsheet launch.</p><ul><li><a href="https://teachcomputing.org/curriculum/key-stage-3/representations-from-clay-to-silicon/numbers-in-binary" target="_blank" rel="noopener">NCCE: Numbers in binary</a></li><li><a href="https://teachcomputing.org/curriculum/key-stage-3/representations-from-clay-to-silicon/binary-digits" target="_blank" rel="noopener">NCCE: Binary digits</a></li><li><a href="https://www.raspberrypi.org/blog/how-to-design-and-present-clear-computing-lessons-mayers-principles/" target="_blank" rel="noopener">Raspberry Pi Foundation: clear computing lessons</a></li></ul><p>Use short teacher modelling, gradually faded support, retrieval and worked examples. Pair talk is not required. Mandarin is selectable, and pupils can use it to rehearse the idea without a second written task.</p>`);}
  $('#close-support').onclick=()=>$('#support').close();
  $('#restore-file').onchange=async e=>{
    const f=e.target.files[0];e.target.value='';if(!f)return;if(f.size>2000000){toast('That file is too large. Choose a Week 10 JSON backup smaller than 2 MB.');return;}
    try{const imported=JSON.parse(await f.text());if(!valid(imported))throw Error('invalid');
      if(importPurpose==='review'&&teacher()){showReport(imported);return;}
      if(!confirm(`Restore the Week 10 backup for ${imported.identity.name}, ${imported.identity.cls}? This replaces only this pupil’s saved copy for this lesson on this device.`))return;
      state=imported;storageKey=key(state.identity.name,state.identity.name.toLowerCase()==='teacher'?'preview':state.identity.cls);save();$('#support').close();render(true);toast('Backup restored. / 备份已恢复。');
    }catch{toast('This is not a valid Week 10 Binary Arcade backup. No saved work was changed. / 备份不适用于本课，原记录没有改变。');}
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.dataset.external){if(state){event('external-link',b.dataset.external);save();}return;}
    if(b.dataset.word){vocab(b.dataset.word);return;}
    if(b.dataset.zoom){modal(`<h1>${t('Look closely','仔细看')}</h1><img class="enlarged" src="assets/${esc(b.dataset.zoom)}" alt="${esc(b.dataset.alt)}">`);return;}
    if(b.dataset.stage){go(cards.findIndex(c=>c.stage===b.dataset.stage));return;}
    if(b.dataset.card){go(cards.findIndex(c=>c.id===b.dataset.card),true);$('#support').close();return;}
    if(b.dataset.answer){answer(b.dataset.answer);const active=$(`[data-answer="${b.dataset.answer}"]`);active?.focus({preventScroll:true});if(current().kind==='reflect'){check(current(),rec());$('#feedback').innerHTML=feedback(current(),rec());}return;}
    if(b.dataset.bit!==undefined){const r=current().kind==='practice'?practiceProblem().r:rec(),index=Number(b.dataset.bit),p=[...r.answer];p[index]=p[index]==='1'?'0':'1';answer(p.join(''));$(`[data-bit="${index}"]`)?.focus({preventScroll:true});return;}
    if(b.dataset.level){state.practice.level=b.dataset.level;state.practice.index=0;save();render();return;}
    const a=b.dataset.action;if(!a)return;if(b.tagName==='A')e.preventDefault();
    if(a==='device')return device();if(a==='restore'||a==='teacher-import'){importPurpose=a==='teacher-import'?'review':'resume';$('#restore-file').click();return;}
    if(a==='backup')return backup();if(a==='vocabulary')return vocab();if(a==='goals')return goals();if(a==='teacher-plan')return teacherPlan();
    if(a==='home'){save();state=null;landing();return;}if(!state)return;
    if(a==='next')return next();if(a==='back')return go(state.p-1,true);if(a==='hint'){rec().hint=true;event('hint-opened',current().id);save();render();return;}
    if(a==='model-next')state.modelStep=Math.min(5,state.modelStep+1);
    if(a==='model-back')state.modelStep=Math.max(0,state.modelStep-1);
    if(a==='replay')state.modelStep=0;
    if(['model-next','model-back','replay'].includes(a)){event('model-step',state.modelStep);save();render();return;}
    if(a==='practice-check'){const {c,r}=practiceProblem();const n=$('#number-answer');if(n)r.answer=n.value;if(check(c,r))render();return;}
    if(a==='practice-next'){state.practice.index++;save();render();return;}
    if(a==='report')return showReport();if(a==='print')return printReport();if(a==='print-report')return printReport(reportStudent||state);
  });
  document.addEventListener('input',e=>{if(e.target.id==='number-answer'&&current()?.kind==='practice'){const r=practiceProblem().r;r.answer=e.target.value;r.checked=false;delete r.correct;save();const f=$('#feedback');if(f)f.innerHTML='';}});
  window.addEventListener('beforeunload',save);
  function showError(message){
    console.error('Binary Arcade:',String(message));
    let alert=$('#runtime-error');if(!alert){alert=document.createElement('aside');alert.id='runtime-error';alert.setAttribute('role','alert');document.body.append(alert);}
    alert.innerHTML=`<strong>This card could not open. Your saved work has not been deleted.</strong><p>${esc(message)}</p><button id="recover-home">Return to welcome</button>`;
    $('#recover-home').onclick=()=>{save();state=null;alert.remove();landing();window.scrollTo(0,0);};
  }
  window.addEventListener('error',e=>showError(e.message));
  window.addEventListener('unhandledrejection',e=>showError(e.reason?.message||'The action could not finish. Try returning to welcome.'));
  landing();
})();
