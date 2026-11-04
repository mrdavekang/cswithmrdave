(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app'), sheets = window.FormulaLesson, engine = window.SheetEngine;
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  // Original portfolio illustrations; decorative poses never carry required instructions.
  const art = (n,kind='spot') => `<img class="character character--${kind}" src="assets/characters/illustration-${n}.png" alt="" decoding="async" draggable="false" data-illustration="${n}">`;
  const languageNote = content => `<aside class="gloss illustrated-note"><div lang="zh-Hans">${content}</div>${art(7,'language')}</aside>`;
  const mandarin=window.FormulaMandarin||{label:()=>'',stage:()=>[],task:()=>'',quiz:[]};
  const bi = value => zh&&value?`<small class="paired-zh" lang="zh-Hans">${esc(value)}</small>`:'';
  const close = (a,b) => typeof a === 'number' && Math.abs(a-b) < 0.000001;
  const base = 'eco-budget-formula-lab-v2:';
  const storage = {get(key){try{return localStorage.getItem(base+key)}catch{return null}},set(key,v){try{localStorage.setItem(base+key,v);return true}catch{return false}}};
  let zh = storage.get('zh') === 'true', student = null, state = null, page = 0, selected = 'D2', alertCell = '', feedback = null, formatOpen = false, draft = false, confirmCopy = '';
  const pages=[['Starter'],['Types of Learning'],['Read First: formulas'],
    ...sheets.slice(0,15).map((s,i)=>[s.title,i]),['Read First: SUM'],
    ...sheets.slice(15).map((s,i)=>[s.title,i+15]),['Learning Pit Stop'],['Plenary'],['Practice games']];
  pages.splice(31,0,['Save and submit']);
  const finishIndex=30, submitIndex=31, gamesIndex=32, pitIndex=29, extraStart=24;
  const current = () => sheets[pages[page]?.[1]];
  const book = () => state.sheets[pages[page]?.[1]];
  const keep = () => {
    state.page=page;
    return student.teacher || storage.set(student.key,JSON.stringify(state));
  };
  const fresh = () => ({page:0,done:{},warm:'',learning:'',reflection:'',phase:'',nextSkill:'',extraSkipped:false,sheets:sheets.map(s=>({cells:{...s.cells},styles:{},widths:{},heights:{},lines:true,plans:{},activePlan:null}))});
  const remaining = () => Array.from({length:gamesIndex},(_,i)=>i).find(i=>!state.done[i]&&!(state.extraSkipped&&i>=extraStart&&i<pitIndex)) ?? gamesIndex;
  const readingCards=window.FormulaReading;
  let readIndex=0, readMessage='', preparedPdf=null;
  const readBook=()=>((state.reading??={})[page]??={position:0,cards:{}});
  const readAnswer=()=>readBook().cards[readIndex]??={};
  const keyWord=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/\s+/g,'').replace(/[.!。]+$/,'');
  const shown = (v, fmt) => typeof v==='number' ? (fmt?.money ? v.toFixed(2) : String(Number(v.toFixed(8)))) : (v ?? '');
  function checkOne(q, s=current(), b=book()) {
    const val=b.cells[q.cell];
    if(q.input!=null) return +val===q.input && engine.numeric(val) ? '' : q.hint;
    if(!/^\s*=/.test(String(val??''))) return 'Write a formula in '+q.cell+' that starts with =. '+q.hint;
    const baseline=Object.fromEntries(s.inputs.map(a=>[a,s.cells[a]]));
    const live=engine.evaluate(b.cells,q.cell);
    if(live.error) return live.error;
    const actual=engine.evaluate(b.cells,q.cell,baseline);
    if(actual.error) return actual.error;
    if(!close(actual.value,+q.answer)) return 'This formula gives '+shown(actual.value)+' with the starting values. '+q.hint;
    for(const t of q.tests){
      const changed=engine.evaluate(b.cells,q.cell,{...baseline,...t.override});
      if(changed.error || !close(changed.value,t.expected)) return 'The starting answer is right, but it doesn’t update correctly when '+Object.keys(t.override)[0]+' changes. '+q.hint;
    }
    if(q.sum && !/\bSUM\s*\(/i.test(val)) return 'Your arithmetic works. This challenge asks you to practise SUM. '+q.hint;
    return '';
  }
  function load(e) {
    e.preventDefault();
    const data=new FormData(e.target), name=String(data.get('name')).trim(), group=String(data.get('class')).trim();
    const teacher=name.toLowerCase()==='teacher';
    if(!name || (!group&&!teacher)){ $('#login-note').textContent='Enter your name and class to start.'; (name?$('#class'):$('#name')).focus();return; }
    student={name,group,teacher,key:JSON.stringify([name.toLowerCase(),group.toLowerCase()])};
    try {state=teacher?fresh():JSON.parse(storage.get(student.key))||fresh()} catch {state=fresh()}
    go(teacher?0:Math.min(state.page||0,remaining()));
  }
  function intro() {
    app.innerHTML=`<section class="panel intro"><div class="hero"><div>
      <p class="eyebrow">YEAR 7 PRACTICAL / SPREADSHEETS</p>
      <h1>Can your class afford the celebration?${bi('班级的预算够办这次庆祝活动吗？')}</h1>
      <p>Run the numbers, spot a budget bug and recommend a plan. Every worksheet opens right here.${bi('计算费用，找出预算表中的错误，再推荐一个方案。所有工作表都在这里完成。')}</p>
      <p><strong>WAGBA:</strong> Use spreadsheet formulas that update correctly when inputs change.${bi('学习目标：编写能随输入变化而正确更新结果的公式。')}</p>
      </div>${art(1,'welcome')}</div><form id="login"><h2>Start or resume${bi('开始或继续')}</h2>
      <label class="field" for="name"><span>Name${bi('姓名')}</span><input id="name" name="name" autocomplete="off" maxlength="70"></label>
      <label class="field" for="class"><span>Class${bi('班级')}</span><input id="class" name="class" autocomplete="off" maxlength="20" placeholder="e.g. 7T"></label>
      <button class="primary">Open the lab →${bi('进入练习')}</button><p id="login-note" role="status" class="muted">Your work saves in this browser on this device when local storage is available.${bi('本浏览器允许本地存储时，进度保存在此设备上。')}</p></form></section>`;
    $('#login').addEventListener('submit',load);
  }
  const names=pages.map(p=>p[0]);
  const sections=[[0,0,'Starter'],[1,1,'Types of Learning'],[2,2,'Read: formulas'],[3,17,'Main Task 1'],[18,18,'Read: SUM'],[19,23,'Main Task 2'],[24,28,'Extra Challenges'],[29,29,'Pit Stop'],[30,30,'Plenary'],[31,31,'Save & submit'],[32,32,'Games']];
  const sectionsZh=['热身','学习类型','阅读：公式','主要任务 1','阅读：SUM','主要任务 2','拓展挑战','学习反思','课堂总结','保存与提交','游戏练习'];
  function progress() {
    const count=Object.keys(state.done).filter(k=>state.done[k]&&(k<extraStart||k>=pitIndex)&&k<submitIndex).length;
    const section=sections.find(([from,to])=>page>=from&&page<=to);
    return `<nav class="progress" aria-label="Lesson progress">
      <div class="row"><strong>${student.teacher?'Teacher preview · all pages open':esc(student.name)+' · '+esc(student.group)}</strong><span>${count} / 26 core steps complete</span></div>
      <meter min="0" max="26" value="${count}" aria-label="Core steps completed"></meter>
      <div class="steps">${sections.map(([from,to,label],i)=>`<button data-page="${section[0]===from?page:from}" class="${section[0]===from?'current ':''}${from>remaining()&&!student.teacher?'later':''}" ${section[0]===from?'aria-current="step"':''}>${label}${bi(sectionsZh[i])}</button>`).join('')}</div>
      ${current()?`<label class="worksheet-picker">Worksheet <select id="jump-sheet">${names.slice(section[0],section[1]+1).map((n,i)=>`<option value="${section[0]+i}" ${page===section[0]+i?'selected':''}>${i+1}. ${esc(n)}${state.done[section[0]+i]?' ✓':''}</option>`).join('')}</select></label>`:''}</nav>`;
  }
  function header(label,title,tag='',titleZh='') {
    return `<div class="sheet-heading"><div><p class="eyebrow">${label}</p><h2 id="stage-title" tabindex="-1">${esc(title)}${bi(titleZh)}</h2></div>${tag?'<span class="tag">'+tag+'</span>':''}</div>`;
  }
  function warm() {
    return header('STARTER / DO NOW','Read the celebration order','','读懂庆祝活动的订单')+
      `<div class="reading-layout"><div class="illustrated-note"><div><p>The eco-fair team has started an order sheet. The words tell us what we are buying. The numbers tell us how many we need and what one item costs.${bi('环保集市小组准备了订单表。文字告诉我们要买什么，数字告诉我们要买多少、每个多少钱。')}</p><p><strong>Read across the top for the column letter.</strong> Then read down the left for the row number. Together they give one cell address.${bi('先在表格上方找列字母，再在左侧找行号。把字母和数字合起来，就是单元格地址。')}</p></div>${art(2,'starter')}</div>
      ${diagram(['Item','Quantity','RM each'],[['Paper flags',8,2],['Score cards',6,3]],[], 'Starter example')}</div>
      <div class="task"><h3>Find the price${bi('找出单价')}</h3><label class="field answer"><span>Which cell holds the price of one paper flag?${bi('哪一个单元格存放一面纸旗的价格？')}</span>
      ${options('warm',state.warm,['B2','C2','C3'])}</label></div>`;
  }
  const options=(id,value,choices,translations=[])=>`<select id="${id}"><option value="">${zh?'Choose… / 请选择':'Choose…'}</option>${choices.map((x,i)=>`<option value="${esc(x)}" ${value===x?'selected':''}>${esc(x)}${zh&&translations[i]?' / '+esc(translations[i]):''}</option>`).join('')}</select>`;
  function diagram(head, data, hi, caption) {
    const letters=head.map((_,i)=>String.fromCharCode(65+i));
    return `<figure class="example-grid"><figcaption>${caption}</figcaption><table aria-label="${caption}"><thead><tr><th></th>${letters.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${[head,...data].map((r,i)=>`<tr><th scope="row">${i+1}</th>${r.map((v,j)=>`<td class="${hi.includes(letters[j]+(i+1))?'focus-cell':''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></figure>`;
  }
  const learningTypes=[['Knowledge','知识'],['Skills','技能'],['Understanding','理解']];
  const missingLearning=()=>learningTypes.map((_,i)=>i).filter(i=>!state['ksu'+i]);
  function flagLearning(focus=false) {
    const missing=missingLearning();
    for(let i=0;i<3;i++){
      const control=$('#ksu'+i);
      if(missing.includes(i)){control.setAttribute('aria-invalid','true');control.setAttribute('aria-describedby','feedback');}
      else {control.removeAttribute('aria-invalid');control.removeAttribute('aria-describedby');}
    }
    if(!missing.length){say('','');return;}
    say('info','Choose a statement for '+missing.map(i=>learningTypes[i][0]).join(', ')+'. There is no wrong choice.',false,
      '请在“'+missing.map(i=>learningTypes[i][1]).join('”“')+'”中各选择一项。没有对错之分。');
    if(focus){const first=$('#ksu'+missing[0]);first.focus({preventScroll:true});first.scrollIntoView({block:'center'});}
  }
  function learningStatus() {
    const count=3-missingLearning().length;
    const status=$('#learning-status');
    status.innerHTML=esc(count===3?'3 of 3 selected. You’re ready for Read: formulas.':count+' of 3 selected.')+
      bi(count===3?'已选择 3 项。可以进入“阅读：公式”。':'已选择 '+count+' 项，共 3 项。');
  }
  function learning() {
    const prompts=[['Knowledge','I can read a cell address and recognise a calculation symbol.',['I can recognise them on my own','I can recognise them with an example','I need a reminder']],
      ['Skills','I can enter and check a formula.',['I can enter one on my own','I can follow a worked example','I need someone to show me']],
      ['Understanding','I can explain why a result changes when an input changes.',['I can explain why','I can explain with a prompt','I need to see it happen first']]];
    const paired=[['知识','我能读出单元格地址，认识运算符号。',['我自己能认出来','我看例子就能认出来','我需要提醒']],['技能','我能输入并检查一个公式。',['我自己能输入','我能跟着例子做','我需要有人示范']],['理解','我能解释为什么更改输入值后，结果会改变。',['我能解释原因','有提示我就能解释','我需要先观察变化']]];
    return header('TYPES OF LEARNING','How will you get better today?','','今天我会怎样进步？')+
      `<aside class="definition illustrated-note"><div><strong>Definition of Learning</strong><p>Amazing Learning happens when we practise, try hard and use good struggle to get better.${bi('学习的定义：通过练习、努力和克服适当的困难，让自己不断进步。')}</p></div>${art(3,'starter')}</aside><h3>Today’s Knowledge, Skills and Understanding${bi('今天的知识、技能与理解')}</h3>
      <p>Choose one statement in each box: Knowledge, Skills and Understanding. This is a check-in, not a test. Choose what feels true for you today.${bi('在“知识”“技能”“理解”三个框中各选一项。这不是测验。选择最符合你现在情况的描述。')}</p>
      <div class="learning-grid">${prompts.map(([title,text,choices],i)=>`<label class="field" id="learning-field-${i}"><span class="learning-prompt"><b>${title}${bi(paired[i][0])}</b><span>${text}${bi(paired[i][1])}</span></span>${options('ksu'+i,state['ksu'+i],choices,paired[i][2])}</label>`).join('')}</div>
      <p id="learning-status" class="status" role="status"></p>
      <details><summary>Where else do inputs and outputs show up?${bi('输入和输出还会在哪里出现？')}</summary><div class="illustrated-note"><p>Pressing a button on a micro:bit can change what its display shows. In this lesson, changing a spreadsheet input can change a calculated result. You don’t need a micro:bit today.${bi('按下 micro:bit 的按钮，屏幕上显示的内容可能会变。在这节课中，修改电子表格的输入值也能改变计算结果。今天不需要使用 micro:bit。')}</p>${art(12)}</div></details>`;
  }
  function reading(sum) {
    const list=readingCards[page], c=list[readIndex], a=readAnswer();
    return header(sum?'READ FIRST / SUM':'READ FIRST / FORMULAS',c.title,`Card ${readIndex+1} of ${list.length}`,c.zhTitle)+
      `<p class="reading-goal">${esc(c.goal)}${bi(c.zhGoal)}</p><div class="reading-tabs" aria-label="Reading cards">${list.map((item,i)=>`<button type="button" data-reading="${i}" title="${esc(item.title)}" aria-label="${esc(item.title)}" ${i===readIndex?'aria-current="step"':''}>${i+1}${readBook().cards[i]?.done?' ✓':''}</button>`).join('')}</div>
      <ol class="model-steps" role="list">${c.steps.map((step,i)=>`<li><span class="step-number" aria-hidden="true">${i+1}</span><div class="step-copy">${esc(step)}${bi(c.zhSteps?.[i])}</div></li>`).join('')}</ol>
      ${window.FormulaModels.model(c,a,zh)}
      ${zh&&readIndex===0?languageNote(sum?'<b>把中英文连起来：</b> range = 单元格范围；subtotal = 小计。先用中文解释 B2:B4 包含哪些格，再用英语说出 range。':'<b>把中英文连起来：</b> column = 列；row = 行；cell reference = 单元格地址；formula bar = 公式栏。先用中文找格子，再用英语说出 column B, row 3。'):''}
      ${page===2&&readIndex===0?`<div class="row walkthrough"><button id="entry-walk" type="button">${a.entry===0?'2. Type =B3':a.entry===1?'3. Apply the formula':'Replay: 1. Select D3'}</button><span role="status">${a.entry===0?'D3 is selected and empty.':a.entry===1?'The rule is in the formula bar. D3 is still empty.':a.entry===2?'D3 now shows 8; the formula bar still shows =B3.':'Replay how a formula goes into the sheet.'}</span></div>`:''}
      ${readIndex===0?`<aside class="definition illustrated-note"><p>${sum?'A good total includes every cost once. Select the total cell to check its range.':'In our lab, Apply works like Enter in Excel. The formula bar shows the rule; the worksheet cell shows its result.'}</p>${art(sum?10:5)}</aside>`:''}
      <section class="task reading-check" aria-label="Check your understanding"><h3>Check your understanding${bi('检查理解')}</h3>
      <fieldset><legend>1. ${esc(c.question)}${zh?`<small lang="zh-Hans">${esc(c.zhQuestion)}</small>`:''}</legend><div class="checks">${c.choices.map((choice,i)=>`<button type="button" data-mcq="${i}" aria-pressed="${a.mcq===i}">${esc(choice)}${zh&&c.zhChoices?`<small lang="zh-Hans">${esc(c.zhChoices[i])}</small>`:''}</button>`).join('')}</div></fieldset>
      <label class="field answer" for="read-word"><span>2. ${esc(c.word)}${zh?`<small lang="zh-Hans">${esc(c.zhWord)}</small>`:''}</span><input id="read-word" value="${esc(a.word)}" maxlength="35" autocomplete="off" spellcheck="false" placeholder="Type a short answer"></label>
      <p id="read-feedback" class="feedback ${readMessage?'info':''}" tabindex="-1" role="status">${esc(readMessage)}</p></section>`;
  }
  function readMove(n) {
    readIndex=n;readBook().position=n;readMessage='';keep();render();
    $('#stage-title').focus({preventScroll:true});window.scrollTo(0,0);
  }
  function readFeedback(message,kind='info',focus=false) {
    const c=readingCards[page][readIndex];
    const support=message.startsWith('Correct')?'答对了。请回答第 2 题。':message.startsWith('Finish')?'先完成当前阅读卡的两道题，再继续。':message.startsWith('This card')?'本卡已完成，可以点 Check & next。':message.includes('question 2')?'请看第 2 题。'+(c.zhWordHint||'根据示例输入答案。'):message.startsWith('Choose')?'先为第 1 题选择一个答案。':'再看第 1 题。'+(c.zhHint||'参考上方的例子再试一次。');
    readMessage=message;const el=$('#read-feedback');el.innerHTML=esc(message)+bi(support);el.className='feedback '+kind;
    if(focus)el.focus();
  }
  function bindReading() {
    const list=readingCards[page], c=list[readIndex], a=readAnswer();
    const firstIncomplete=list.findIndex((_,i)=>!readBook().cards[i]?.done);
    app.querySelectorAll('[data-reading]').forEach(el=>el.onclick=()=>{
      const n=+el.dataset.reading;
      if(student.teacher||firstIncomplete<0||n<=firstIncomplete)readMove(n);
      else readFeedback('Finish the two questions on card '+(firstIncomplete+1)+' before moving on.','info',true);
    });
    app.querySelectorAll('[data-mcq]').forEach(el=>el.onclick=()=>{
      a.mcq=+el.dataset.mcq;a.done=false;invalidated();keep();
      app.querySelectorAll('[data-mcq]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));
      readFeedback(a.mcq===c.correct?'Correct. Now answer question 2.':'Not quite. '+c.hint,a.mcq===c.correct?'good':'info');
    });
    $('#read-word').oninput=e=>{a.word=e.target.value;a.done=false;invalidated();keep();};
    $('#read-word').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();next(false);}};
    if($('#entry-walk'))$('#entry-walk').onclick=()=>{a.entry=a.entry===0?1:a.entry===1?2:0;keep();render();$('#entry-walk').focus({preventScroll:true});};
    if(!c.range)return;
    const showRange=(first,last)=>{
      if(last){const lo=Math.min(+first.slice(1),+last.slice(1)),hi=Math.max(+first.slice(1),+last.slice(1));a.range=c.cells.filter(x=>+x.slice(1)>=lo&&+x.slice(1)<=hi);}
      else a.range=first?[first]:[];
      keep();render();
      const target=last||first;
      if(target) app.querySelector('[data-range-pick="'+target+'"]')?.focus({preventScroll:true});
      else $('#range-reset').focus({preventScroll:true});
    };
    let start=null,end=null;
    const zone=$('.model-scroll');
    zone.onpointerdown=e=>{const cell=e.target.closest('[data-range-pick]')?.dataset.rangePick;if(cell){start=end=cell;}};
    zone.onpointermove=e=>{
      if(!start)return;
      const cell=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-range-cell]')?.dataset.rangeCell;
      if(!cell||end===cell)return;
      end=cell;
      const lo=Math.min(+start.slice(1),+end.slice(1)),hi=Math.max(+start.slice(1),+end.slice(1));
      zone.querySelectorAll('[data-range-cell]').forEach(el=>el.classList.toggle('model-input',+el.dataset.rangeCell.slice(1)>=lo&&+el.dataset.rangeCell.slice(1)<=hi));
    };
    zone.onpointerup=()=>{if(start&&start!==end)showRange(start,end);start=end=null;};
    zone.onpointerleave=()=>{if(start&&start!==end)showRange(start,end);start=end=null;};
    zone.onpointercancel=()=>{start=end=null;render();};
    app.querySelectorAll('[data-range-pick]').forEach(el=>el.onclick=()=>{const x=el.dataset.rangePick;const from=a.range?.length===1?a.range[0]:null;showRange(from||x,from&&from!==x?x:null);});
    $('#range-reset').onclick=()=>showRange(null);
  }
  function grid() {
    const s=current(), b=book(), targets=new Set(s.checks.map(q=>q.cell));
    const cols=s.widths.map((_,i)=>String.fromCharCode(65+i));
    const rowCount=Math.max(5,...Object.keys(b.cells).filter(a=>/^[A-H][1-9]\d*$/.test(a)).map(a=>+a.slice(1)));
    return `<table class="grid" aria-label="Practice spreadsheet"><colgroup><col style="width:37px">${cols.map((c,i)=>`<col style="width:${b.widths[c]||s.widths[i]}px">`).join('')}</colgroup>
      <thead><tr><th aria-hidden="true"></th>${cols.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>
      ${Array.from({length:Math.min(12,rowCount+1)},(_,i)=>{
        const n=i+1;
        return `<tr><th class="row-num" scope="row">${n}</th>${cols.map(c=>{
          const a=c+n, f=b.styles[a]||{}, result=engine.evaluate(b.cells,a);
          const val=result.error?'! Formula':shown(result.value,f);
          const styles=`font-size:${f.size?f.size/16+'rem':'1.125rem'};text-align:${f.align||'left'};font-weight:${f.bold||n===1?750:520};min-height:${b.heights[n]||50}px;${f.border?'border'+(f.edge==='bottom'?'-bottom':'')+':'+f.border+'px solid '+(f.color||'#3a4d5b'):''}`;
          const classes=[n===1?'head-cell':'',targets.has(a)?'target':'',s.inputs.includes(a)?'input-cell':'',selected===a?'picked':'',alertCell===a?'bad':''].join(' ');
          return `<td class="${classes}"><button type="button" data-cell="${a}" aria-pressed="${selected===a}" aria-label="${a}${val?', '+esc(val):', blank'}" title="${a}: ${esc(result.error||val)}" class="${result.error?'error-text':''}${zh&&mandarin.label(val)?' cell-bilingual':''}" style="${styles}">${esc(val)||'&nbsp;'}${bi(mandarin.label(val))}</button></td>`;
        }).join('')}</tr>`;
      }).join('')}</tbody></table>`;
  }
  function formatting() {
    const b=book(), f=b.styles[selected]||{};
    const icon=(d)=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="${d}"/></svg>`;
    return `<div class="ribbon" aria-label="Home formatting ribbon"><div class="ribbon-tab">Home</div><div class="ribbon-tools">
      <div class="ribbon-group"><button id="bold" type="button" aria-pressed="${!!f.bold}"><strong>B</strong> Bold</button>
      <label><b>A↕</b> Font size <select id="size">${[14,16,18,20,24].map(x=>`<option ${(f.size||18)===x?'selected':''}>${x}</option>`).join('')}</select></label></div>
      <div class="ribbon-group"><button id="center" type="button" aria-pressed="${f.align==='center'}">${icon('M3 5h18M7 10h10M3 15h18M7 20h10')} Centre</button>
      <button id="bottom" type="button" aria-pressed="${f.border>0&&f.edge==='bottom'}">${icon('M4 17h16M4 7h16M4 7v10M20 7v10M3 20h18')} Bottom border</button>
      <label>${icon('M4 4h16v16H4zM12 4v16M4 12h16')} Border weight <select id="border">${[0,1,2,3].map((x)=>`<option value="${x}" ${(f.border||0)===x?'selected':''}>${['None','Thin','Medium','Thick'][x]}</option>`).join('')}</select></label>
      <label>Border colour <input id="color" type="color" value="${f.color||'#3a4d5b'}"></label></div>
      <div class="ribbon-group"><label>↔ Width <select id="width"><option value="">Default</option>${[90,125,165,210].map(x=>`<option ${b.widths[selected[0]]===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>↕ Height <select id="height"><option value="">Default</option>${[46,58,72].map(x=>`<option ${b.heights[selected.slice(1)]===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <button id="lines" type="button" aria-pressed="${b.lines}">${icon('M3 3h18v18H3zM9 3v18m6-18v18M3 9h18M3 15h18')} Gridlines</button>
      <button id="money" type="button" aria-pressed="${!!f.money}">.00</button>
      <button id="copy" type="button" title="Copy the selected formula down by one row">${icon('M7 4h10v9H7zM12 13v8m-4-4 4 4 4-4')} Copy down</button></div>
      </div></div>`;
  }
  function practice() {
    const s=current(), b=book();
    const activeCheck=s.checks.find(q=>q.cell===alertCell)||s.checks.find(q=>checkOne(q))||s.checks[0];
    const arithmetic=page<18, extra=page>=extraStart;
    const scene=s.title==='Music club passes'?8:s.title==='Snack stall plan'?11:page===extraStart?6:0;
    const [titleZh,storyZh]=mandarin.stage(s);
    const opHelp=activeCheck.sum?'使用 SUM 把连续的数值加起来；冒号表示“从……到……”。':activeCheck.formula.includes('(')?'先算括号内的成本，再用预算减去该成本。':activeCheck.formula.includes('/')?'用总量除以人数或组数，计算每份的数值。':activeCheck.formula.includes('*')?'把数量乘以每个的价格（或每组的数量）。':activeCheck.formula.includes('+')?'把两项数值加起来。':'从原来的数量或金额中减去已用的数值。';
    return header(extra?'EXTRA CHALLENGES':arithmetic?'MAIN TASK 1 / BASIC ARITHMETIC':'MAIN TASK 2 / SUM AND ARITHMETIC',s.title,
      extra?'Challenge '+(page-extraStart+1)+' / 5':arithmetic?'Question '+(page-2)+' / 15':'Worksheet '+(page-18)+' / 5 · 2 questions',titleZh)+
      `<div class="${scene?'illustrated-note worksheet-scene':'worksheet-scene'}"><p>${esc(s.story)}${bi(storyZh)}</p>${scene?art(scene,'worksheet'):''}</div>
      <section class="task task-guide" aria-label="What you need to accomplish"><h3>What you need to accomplish${bi('你需要完成什么')}</h3>
      <ol><li><strong>Read the table.</strong> ${arithmetic?(activeCheck.formula.includes('(')?'Find the budget and pack quantity on the Today row. Then read the price per pack in B3.':'Find the row named Today and read the headings above its blue cells. The headings tell you what each number means.'):'Read the three blue entries in column B. Decide what they represent before adding them. The value in B6 is used in the second calculation.'}</li>
      <li><strong>Enter your formula.</strong> Use the numbered question below to select the result cell. Type a formula beginning with <code>=</code>, using cell references instead of retyping the numbers. Tap <strong>Apply</strong>.${bi('点击下方对应题号，选中结果格。输入以 = 开头的公式，用 B2 等单元格地址，不要直接重写数值。点 Apply（应用）。')}</li>
      <li><strong>Test the result.</strong> Predict what will happen if one blue value changes. Change it and look at the result. Use <strong>Reset inputs</strong> to restore the starting numbers without losing your formula.${bi('先预测一个蓝色数值改变后，结果会怎样变。修改数值并检查。点 Reset inputs（重置输入）可恢复原来的数值，公式会保留。')}</li></ol>
      <div class="checks">
      ${s.checks.map((q,i)=>{const ok=!checkOne(q);return `<button type="button" data-jump="${q.cell}" class="${ok?'met':q===activeCheck?'next-action':''} ${alertCell===q.cell?'attention':''}">${ok?'✓ ':''}<strong>${i+1}. ${q.cell}</strong> · ${esc(q.goal)}${bi(mandarin.task(s,q,i))}</button>`}).join('')}</div>
      ${alertCell&&feedback?`<div class="feedback ${feedback.kind}" id="cell-feedback" tabindex="-1" role="status">${esc(feedback.text)}${bi('请检查 '+alertCell+'。公式从 = 开始，要引用正确的单元格，并在输入变化后得到正确结果。')}</div>`:''}</section>
      <details id="hint" ${alertCell?'open':''}><summary>See a worked example and a hint for this question${bi('查看这道题的示例和提示')}</summary><div class="${page===extraStart?'illustrated-note':''}"><div><p>${esc(s.tip)}</p>
      ${activeCheck?`<p><strong>For ${activeCheck.cell}:</strong> ${esc(activeCheck.hint)}${bi(opHelp)}</p>`:''}
      <p class="muted">This is a different worksheet. Use the same idea with the addresses in your own table.${bi('这是另一张工作表示例。用相同的方法，但要换成你自己的表格中的单元格地址。')}</p></div>${page===extraStart?art(13):''}</div>
      ${window.FormulaModels.model(window.FormulaModels.sample(activeCheck),{},zh)}</details>
      <div class="sheet">${formatting()}
      <div class="formula"><span class="address" aria-label="Selected cell">${selected}</span>
      <input id="formula" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Formula bar for ${selected}" value="${esc(b.cells[selected])}" maxlength="257" placeholder="Type a value or =formula">
      <button id="apply" type="button">Apply${bi('应用')}</button></div>
      <div class="symbol-keys" aria-label="Formula typing shortcuts">${(!arithmetic?['=','+','-','*','/','SUM(',':',')']:['=','+','-','*','/','(',')']).map(x=>`<button type="button" data-symbol="${x}" aria-label="Insert ${({'=':'equals','+':'plus','-':'minus','*':'multiply','/':'divide','(':'opening bracket',')':'closing bracket',':':'range colon','SUM(':'SUM'})[x]}">${x}</button>`).join('')}</div>
      <div class="grid-wrap ${b.lines?'':'no-lines'}">${grid()}</div>
      <div id="save-state" class="status">${student.teacher?'Teacher preview · work is not saved':'Select a cell to inspect it. Applied edits save on this device.'}</div></div>
      <div class="whatif"><div><b>What if?</b> Pick a blue input, predict what will happen, then change the value. Use Reset inputs to go back without losing your formulas.${bi('试一试：先预测，再修改一个蓝色输入值并观察。点 Reset inputs 可以恢复原来的数值，保留公式。')}</div><button id="reset-inputs" type="button">Reset inputs</button></div>
      ${s.plans?`<section class="task" id="plan-task"><h3>Test both plans${bi('测试两个方案')}</h3><p>Load each plan, read the total in D4, then record it. Plans change quantities, not formulas.${bi('依次载入两个方案。读取 D4 中的总价，再记录在相应的输入框里。方案只改变数量，不会改动公式。')}</p>
      <div class="plan-grid">${s.plans.map((p,i)=>`<div><button data-plan="${i}" type="button" aria-pressed="${b.activePlan===i}">Load ${esc(p.label)}${bi('载入方案 '+(i?'B':'A'))}</button>
      <label class="field">Plan ${i?'B':'A'} total (RM)${bi('方案 '+(i?'B':'A')+' 的总价（RM）')}<input data-total="${i}" inputmode="decimal" maxlength="20" value="${esc(b.plans[i]?.total)}" placeholder="Read D4 after loading"></label></div>`).join('')}</div>
      <label class="field answer">Which plan stays within RM90?${bi('哪个方案不超过 RM90？')}${options('decision',b.decision,['Plan A','Plan B','Both plans'],['方案 A','方案 B','两个方案'])}</label>
      </section>`:''}`;
  }
  function pitstop() {
    return header('LEARNING PIT STOP','Where are you in your learning?','','我现在处于哪个学习阶段？')+`<div class="illustrated-note pitstop-note"><div><p>Think about one formula you wrote or fixed. Did you learn something new, get better with practice, find it too easy, or need help?${bi('回想你写过或修正过的一个公式。你学到了新知识、通过练习变得更熟练、觉得太容易，还是需要帮助？')}</p><p class="muted">This is a pause, not a race. Name the next step that would help you.${bi('停下来想一想，不用赶。选出一个能帮你进步的下一步。')}</p></div>${art(14,'pitstop')}</div><div class="task"><h3>Reflect on today’s spreadsheet work${bi('反思今天的电子表格练习')}</h3>
      <label class="field answer"><span>Choose your learning phase.${bi('选择你的学习阶段。')}</span>${options('phase',state.phase,['New Learning — writing a formula was new to me','Consolidating — I’m getting better at using formulas','Treading Water — I’m ready for a harder formula','Drowning — I need help with a spreadsheet step'],['新学习：我第一次学写公式','巩固：我用公式更熟练了','原地踏步：我可以试更难的公式','需要帮助：我有一步卡住了'])}</label>
      <label class="field answer"><span>What will you practise next?${bi('接下来你会练习什么？')}</span>${options('nextSkill',state.nextSkill,['Reading a cell address','Choosing a calculation symbol','Writing a SUM range','Changing an input and checking the result'],['读单元格地址','选运算符号','写 SUM 的范围','修改输入并检查结果'])}</label></div>`;
  }
  function plenary() {
    return header('PLENARY','Explain what updates and why','','解释哪些结果会更新，以及为什么')+`<p>You are checking the celebration budget. The price of one poster goes up. The number of posters stays the same.${bi('你正在检查庆祝活动的预算。海报的单价上涨，但海报数量不变。')}</p>
    <div class="key-words"><span><b>Input</b> · a value you can change${bi('输入值：可以修改的数值')}</span><span><b>Cell reference</b> · a cell address such as C2${bi('单元格引用：例如 C2 这样的地址')}</span><span><b>Formula</b> · a calculation that starts with =${bi('公式：以 = 开头的计算式')}</span><span><b>Subtotal</b> · the sum of a group of costs${bi('小计：一组费用加在一起的结果')}</span></div>
    <div class="task"><h3>Exit ticket${bi('课末小结')}</h3><ol><li>Name the input that changed.${bi('写出哪个输入值改变了。')}</li><li>Explain what happens to the poster cost and to the overall subtotal. Use at least one of the keywords above if it helps.${bi('解释海报总价和小计会怎样变化。可使用上面的关键词。')}</li></ol>
    <label class="field answer" for="reflection"><span>Write your explanation. Short phrases are fine.${bi('可用中文、英文或两者一起作答。句式：改变的输入值是……。海报总价……，因为……。小计……。')}</span><textarea id="reflection" maxlength="500" placeholder="The input that changes is ____. The poster cost ____ because ____. The subtotal ____.">${esc(state.reflection)}</textarea></label></div>`;
  }
  function submission() {
    return header('SAVE AND SUBMIT','Download your lesson evidence','','下载你的学习记录')+`
      <p>The PDF contains your reading checks, worksheet formulas and results, and your reflection. Open it once and check that it shows your name and class.${bi('PDF 包含阅读题答案、表格公式和结果，以及你的反思。打开 PDF，检查姓名和班级。')}</p>
      <div class="task"><h3>1. Save your PDF${bi('保存 PDF')}</h3><div class="row"><button id="download-pdf" type="button" class="primary">Download evidence PDF${bi('下载学习记录 PDF')}</button>
      <button id="open-pdf" type="button" hidden>Open PDF preview${bi('打开 PDF 预览')}</button><button id="share-pdf" type="button" hidden>Share / Save to Files${bi('分享／存储到文件')}</button></div>
      <p><strong>Laptop:</strong> Look in Downloads for the PDF.${bi('电脑：打开 Downloads（下载）文件夹找 PDF。')}</p><p><strong>iPad:</strong> If Safari previews the PDF instead of saving it, tap <strong>Share → Save to Files</strong>. Choose a folder you can find again.${bi('iPad：如果 Safari 只打开预览，点 Share → Save to Files（分享 → 存储到文件），选一个你找得到的文件夹。')}</p></div>
      <div class="task"><h3>2. Upload it in Teams${bi('在 Teams 上传 PDF')}</h3><ol><li>Open your Computer Science class in Teams. Go to <strong>Assignments</strong> and open the Eco-Budget Formula Lab assignment your teacher directs you to.${bi('在 Teams 打开计算机科学班级，进入 Assignments（作业），打开老师指定的 Eco-Budget Formula Lab 作业。')}</li>
      <li>Tap <strong>Add work</strong> or <strong>Attach</strong>. Browse to the saved PDF in Downloads or Files and attach it.${bi('点 Add work（添加作业）或 Attach（附加文件），在 Downloads（下载）或 Files（文件）中找到刚保存的 PDF，再添加。')}</li><li>Check that the PDF appears, then tap <strong>Turn in</strong>. Come back here to mark the reminder below.${bi('确认附件列表中显示你的 PDF，再点 Turn in（交作业）。交完后回这里勾选下方提醒。')}</li></ol>
      <label><input id="teams-checked" type="checkbox" ${state.teamsChecked?'checked':''}> I checked that my PDF is attached and I turned it in.${bi('我确认已附上 PDF，并点了交作业。')}</label>
      <p class="muted">This is a reminder for you. The app does not upload to Teams or verify your submission.${bi('这只是自查提醒。网页不会代你上传，也不能验证 Teams 是否收到作业。')}</p></div>`;
  }
  let pdfURL=null;
  function preparePDF(){
    if(pdfURL)URL.revokeObjectURL(pdfURL);
    preparedPdf=window.FormulaEvidence.create(student,state,sheets,engine,readingCards);
    pdfURL=URL.createObjectURL(preparedPdf);return pdfURL;
  }
  function bindSubmission(){
    $('#open-pdf').hidden=!pdfURL;
    $('#share-pdf').hidden=!preparedPdf||!navigator.canShare?.({files:[preparedPdf]});
    $('#teams-checked').onchange=e=>{state.teamsChecked=e.target.checked;keep();};
    $('#download-pdf').onclick=()=>{
      try{
        const a=document.createElement('a');a.href=preparePDF();a.download=preparedPdf.name;
        document.body.append(a);a.click();a.remove();
        $('#open-pdf').hidden=false;
        $('#share-pdf').hidden=!navigator.canShare?.({files:[preparedPdf]});
        say('good','PDF ready: '+preparedPdf.name+'. Check Downloads, or use the preview and Save to Files.');
      }catch(e){say('bad','Could not prepare the PDF. Reopen the app and try again. Your work is still saved on this device.',true);}
    };
    $('#open-pdf').onclick=()=>{const a=document.createElement('a');a.href=pdfURL;a.target='_blank';a.rel='noopener';document.body.append(a);a.click();a.remove();};
    $('#share-pdf').onclick=async()=>{try{await navigator.share({files:[preparedPdf],title:'Eco-Budget evidence'});}catch(e){if(e.name!=='AbortError')say('info','Open the PDF preview, then use your browser’s Share or Download button.');}};
  }
  function games() {
    const bank=window.FormulaQuiz, n=state.quiz||0, links=window.FormulaGames;
    return header('AFTER THE PLENARY','Choose your 30-correct challenge','','选择一个答对 30 题的挑战')+`
      <div class="illustrated-note"><p>Choose Blooket homework or Formula Check below for a 30-correct goal. Gimkit is a free practice link; it doesn’t record homework completion.${bi('Blooket 作业和下面的 Formula Check 都以答对 30 题为目标。Gimkit 是自由练习，不记录作业是否完成。外部游戏中的这套题是英文；下面的应用内测验支持中英对照。')}</p>${art(n>=30?9:4)}</div>
      <div class="game-links">${Object.entries(links).map(([name,url])=>`<a class="game-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join('')}</div>
      <div class="definition"><h3>Play here · Formula Check</h3><p aria-live="polite">${n} / 30 correct</p>
      ${n>=30?`<p><b>Challenge complete.</b> You answered all 30 questions correctly.${bi('挑战完成：你答对了全部 30 题。')}</p>`:`<p><b>${esc(bank[n][0])}</b>${bi(mandarin.quiz?.[n]?.[0])}</p><div class="checks">${Array.from({length:4},(_,j)=>(j+n*3+1)%4+1).map(i=>`<button data-option="${i}">${esc(bank[n][i])}${bi(mandarin.quiz?.[n]?.[1]?.[i-1])}</button>`).join('')}</div>`}</div>`;
  }
  function navigate(n){
    if(!student.teacher&&page===1&&n===2&&remaining()===1)return next(false);
    if(student.teacher||n<=remaining())go(n);
    else if(page!==remaining()){say('info','Finish '+names[remaining()]+' before opening that stage.');go(remaining(),true);}
    else next(true);
  }
  function pairControls() {
    if(!zh)return;
    const map={
      '#back':'返回','#next':page===1?'继续到“阅读：公式”':page===finishIndex?'继续到学习记录 PDF':page===submitIndex?'进入练习游戏':readingCards[page]||current()||page===0?'检查并继续':'继续',
      '#skip-extra':'前往学习反思','#return-evidence':'返回 PDF 和 Teams 提交步骤',
      '.ribbon-tab':'开始选项卡','#bold':'加粗','#center':'居中','#bottom':'下边框',
      '#lines':'网格线','#money':'保留两位小数','#copy':'向下复制','#reset-inputs':'重置输入',
      '#save-state':student.teacher?'教师预览，不保存练习。':'选中单元格可查看公式。点 Apply 后，修改会保存在本设备。',
      '.task-guide ol li:first-child':page<18?'看 Today（今天）一行和蓝色数值上方的标题。若单价另列，也要找到那个格子。':'读懂 B 列的三项蓝色数值。第二题还会用到 B6。',
      '.lesson-strip span:first-child':'学习目标：编写能随输入变化而正确更新结果的公式。',
      '.lesson-strip span:nth-child(2)':'关键词：单元格引用、输入值、公式、范围、SUM 求和。'
    };
    Object.entries(map).forEach(([selector,label])=>$(selector)?.insertAdjacentHTML('beforeend',bi(label)));
    Object.entries({size:'字号',border:'边框粗细',color:'边框颜色',width:'列宽',height:'行高'}).forEach(([id,label])=>$('#'+id)?.closest('label')?.insertAdjacentHTML('beforeend',bi(label)));
    if($('#formula'))$('#formula').placeholder='Type a value or =formula / 输入数值或公式';
  }
  function render() {
    $('#language').setAttribute('aria-pressed',String(zh));
    $('#backup').hidden=!student; $('#switch').hidden=!student;
    if(!student) return intro();
    const content=current()?practice():page===0?warm():page===1?learning():readingCards[page]?reading(page===18):page===pitIndex?pitstop():page===finishIndex?plenary():page===submitIndex?submission():games();
    app.innerHTML=progress()+`<section class="panel"><div class="lesson-strip"><span><b>WAGBA</b> Use spreadsheet formulas that update correctly when inputs change.</span><span><b>Keywords</b> cell reference · input · formula · range · SUM</span></div>${content}
      <div id="feedback" tabindex="-1" aria-live="polite" class="feedback ${feedback?.kind||''}">${alertCell?'':esc(feedback?.text)+bi(feedback?.zhText)}</div>
      <div class="nav"><button type="button" id="back" ${page===0?'disabled':''}>← Back</button>
      ${page>=extraStart&&page<pitIndex?'<button id="skip-extra" type="button">Go to Learning Pit Stop →</button>':''}
      ${page===gamesIndex?'<button type="button" id="return-evidence">Return to PDF and Teams instructions</button>':`<button class="primary" type="button" id="next">${page===1?'Continue to Read: formulas →':page===finishIndex?'Continue to evidence PDF →':page===submitIndex?'Continue to practice →':current()||page===0||readingCards[page]?'Check & next →':'Continue →'}</button>`}</div></section>`;
    pairControls();
    app.querySelectorAll('[data-page]').forEach(el=>el.onclick=()=>navigate(+el.dataset.page));
    if($('#jump-sheet')) $('#jump-sheet').onchange=e=>{const n=+e.target.value; e.target.value=page;navigate(n);};
    if($('#skip-extra')) $('#skip-extra').onclick=()=>{state.extraSkipped=true;go(pitIndex);};
    $('#back').onclick=()=>{if(readingCards[page]&&readIndex>0)readMove(readIndex-1);else go(page-1);};
    if($('#return-evidence'))$('#return-evidence').onclick=()=>go(submitIndex);
    if($('#next')) $('#next').onclick=()=>next(false);
    if(page===0){
      $('#warm').onchange=e=>{state.warm=e.target.value;invalidated();keep();say(state.warm==='C2'?'good':'info',state.warm==='C2'?'Yes. C is the column and 2 is the row.':'Read the column letter first and the row number second. Try again.');};
    } else if(page===1) {
      learningStatus();
      for(let i=0;i<3;i++) $('#ksu'+i).onchange=e=>{
        state['ksu'+i]=e.target.value;invalidated();keep();learningStatus();
        if(app.querySelector('.learning-grid [aria-invalid]'))flagLearning();
      };
    } else if(readingCards[page]) {
      bindReading();
    } else if(page===pitIndex) {
      for(const id of ['phase','nextSkill']) $('#'+id).onchange=e=>{state[id]=e.target.value;invalidated();keep();};
    } else if(page===finishIndex) {
      $('#reflection').oninput=e=>{state.reflection=e.target.value;invalidated();keep();};
    } else if(page===submitIndex) {
      bindSubmission();
    } else if(page===gamesIndex){
      app.querySelectorAll('[data-option]').forEach(el=>el.onclick=()=>{
        if(+el.dataset.option!==1)return say('bad','Not quite. Try another answer. Check the formula or cell address before choosing.',true);
        state.quiz=(state.quiz||0)+1;keep();feedback={kind:'good',text:'Correct. '+state.quiz+' of 30 complete.'};render();$('#feedback').focus({preventScroll:true});
      });
    } else bindSheet();
  }
  function say(kind,text,focus=false,zhText='') {
    feedback={kind,text,zhText};
    const el=$('#feedback');
    if(el){el.className='feedback '+kind;el.innerHTML=esc(text)+bi(zhText);if(focus)el.focus();}
  }
  function go(n,preserve=false) {
    if(student&&current()&&draft) commit();
    page=Math.max(0,Math.min(n,gamesIndex));
    if(readingCards[page]){const b=readBook(), missing=readingCards[page].findIndex((_,i)=>!b.cards[i]?.done);readIndex=Math.min(b.position||0,student.teacher||missing<0?readingCards[page].length-1:missing);readMessage='';}
    selected=current()?.checks[0].cell||'D2'; alertCell=''; draft=false; formatOpen=false; confirmCopy='';
    if(!preserve) feedback=null;
    keep();render();
    $('#stage-title')?.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
  function invalidated() { delete state.done[page]; }
  function commit() {
    const input=$('#formula');
    if(!input || !draft) return false;
    const b=book(), value=input.value.trim(), old=String(b.cells[selected]??'');
    draft=false;
    if(value===old)return false;
    if(value) b.cells[selected]=value; else delete b.cells[selected];
    if(current().plans && Object.hasOwn(current().plans[0].values,selected)) b.activePlan=null;
    invalidated();
    const ok=keep();
    if(!ok) feedback={kind:'info',text:'Browser saving is unavailable. Keep this tab open or download a backup.'};
    return true;
  }
  function selectCell(a,edit=false) {
    if(draft)commit();
    selected=a;alertCell='';confirmCopy='';render();
    if(edit) $('#formula').focus({preventScroll:true});
    else app.querySelector('[data-cell="'+a+'"]')?.focus({preventScroll:true});
  }
  function apply() {
    commit();
    const res=engine.evaluate(book().cells,selected);
    const q=current().checks.find(q=>q.cell===selected), problem=q&&checkOne(q);
    if(res.error) {alertCell=selected; say('bad',selected+': '+res.error);}
    else if(problem) {alertCell=selected;say('info',selected+': '+problem);}
    else {alertCell='';say('good',selected+' updated'+(res.value==null?'.':': '+shown(res.value)+'.'));}
    render(); $('#formula').focus({preventScroll:true});
  }
  function bindSheet() {
    const b=book(), s=current(), f=()=>b.styles[selected]??=( {} );
    const restyle=fn=>{commit();fn();keep();formatOpen=true;render();};
    $('#formula').oninput=()=>{draft=true;};
    $('#formula').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();apply();}};
    $('#apply').onclick=apply;
    app.querySelectorAll('[data-symbol]').forEach(el=>el.onclick=()=>{
      const field=$('#formula');
      field.setRangeText(el.dataset.symbol,field.selectionStart,field.selectionEnd,'end');
      draft=true;
      field.focus({preventScroll:true});
    });
    app.querySelectorAll('[data-cell]').forEach(el=>{
      el.onclick=()=>selectCell(el.dataset.cell);
      el.onkeydown=e=>{
        const a=el.dataset.cell;
        if(e.key==='Enter' || e.key==='F2'){e.preventDefault();selectCell(a,true);}
        else if(e.key==='ArrowUp'||e.key==='ArrowDown'||e.key==='ArrowLeft'||e.key==='ArrowRight'){
          e.preventDefault();
          const c=a.charCodeAt(0)+({'ArrowLeft':-1,'ArrowRight':1}[e.key]||0),r=+a.slice(1)+({'ArrowUp':-1,'ArrowDown':1}[e.key]||0);
          const move=String.fromCharCode(c)+r;
          if(app.querySelector('[data-cell="'+move+'"]'))selectCell(move);
        }
      };
    });
    app.querySelectorAll('[data-jump]').forEach(el=>el.onclick=()=>{selectCell(el.dataset.jump,true);$('#formula').scrollIntoView({block:'nearest'});});
    $('#bold').onclick=()=>restyle(()=>{f().bold=!f().bold});
    $('#center').onclick=()=>restyle(()=>{f().align=f().align==='center'?'left':'center'});
    $('#bottom').onclick=()=>restyle(()=>{f().border=f().edge==='bottom'&&f().border?0:2;f().edge='bottom';});
    $('#size').onchange=e=>restyle(()=>{f().size=+e.target.value});
    $('#border').onchange=e=>restyle(()=>{f().border=+e.target.value});
    $('#color').onchange=e=>restyle(()=>{f().color=e.target.value;f().border||=1});
    $('#width').onchange=e=>restyle(()=>{b.widths[selected[0]]=+e.target.value});
    $('#height').onchange=e=>restyle(()=>{b.heights[selected.slice(1)]=+e.target.value});
    $('#money').onclick=()=>restyle(()=>{f().money=!f().money});
    $('#lines').onclick=()=>restyle(()=>{b.lines=!b.lines});
    $('#reset-inputs').onclick=()=>{commit();for(const a of s.inputs)b.cells[a]=s.cells[a];keep();alertCell='';say('info','Starting inputs restored. Your formulas are unchanged.');render();};
    $('#copy').onclick=()=>{
      commit();
      const nextRow=+selected.slice(1)+1, source=b.cells[selected], target=selected[0]+nextRow;
      if(!/^\s*=/.test(String(source??'')))return say('info','Select a cell that already contains a formula, then tap Copy ↓.',true);
      if(nextRow>12)return say('info','There is no row below this cell.',true);
      if(b.cells[target] && confirmCopy!==target){confirmCopy=target;return say('info',target+' already has content. Tap Copy ↓ again to replace it, or choose another cell.',true);}
      b.cells[target]=engine.shift(source,1);invalidated();keep();selected=target;alertCell='';confirmCopy='';
      say('good','Copied to '+target+'. Check how the row numbers changed in the formula bar.');render();
    };
    app.querySelectorAll('[data-plan]').forEach(el=>el.onclick=()=>{
      commit();
      const i=+el.dataset.plan;b.activePlan=i;
      Object.assign(b.cells,s.plans[i].values);b.plans[i]??={};
      invalidated();keep();selected='D4';alertCell='';
      say('info','Plan '+(i?'B':'A')+' loaded. Read D4 and enter the total below.');render();
      app.querySelector('[data-total="'+i+'"]').focus({preventScroll:true});
    });
    app.querySelectorAll('[data-total]').forEach(el=>el.oninput=()=>{
      const i=+el.dataset.total;
      b.plans[i]??={};b.plans[i].total=el.value;
      invalidated();keep();
    });
    if($('#decision')) $('#decision').onchange=e=>{b.decision=e.target.value;invalidated();keep();};
  }
  function next(jumpOnly) {
    if(readingCards[page]){
      const list=readingCards[page], c=list[readIndex], a=readAnswer();
      if(!student.teacher){
        if(a.mcq!==c.correct){readFeedback(a.mcq==null?'Choose an answer for question 1.':'Look back at the example. '+c.hint,'info',true);return;}
        if(!a.word?.trim()){readFeedback('Type the short answer for question 2. '+(c.wordHint||c.hint));$('#read-word').focus();return;}
        if(!c.answers.some(x=>keyWord(x)===keyWord(a.word))){readFeedback('Check question 2. '+(c.wordHint||c.hint),'info',true);return;}
      }
      if(jumpOnly){readFeedback('This card is ready. Tap Check & next to continue.','good',true);return;}
      a.done=true;
      if(readIndex+1<list.length){readMove(readIndex+1);return;}
      const missing=list.findIndex((_,i)=>!readBook().cards[i]?.done);
      if(!student.teacher&&missing>=0){readMove(missing);readFeedback('Finish this card before moving on.','info',true);return;}
      state.done[page]=true;go(page+1);return;
    }
    if(student.teacher && !jumpOnly) { if(page<gamesIndex)go(page+1);return; }
    if(page===0) {
      if(state.warm!=='C2'){say('info','Check the cell address: letter first, row number second. Choose the cell in column C and row 2.');$('#warm').focus();return;}
    } else if(page===1) {
      if(missingLearning().length){flagLearning(true);return;}
    } else if(page===pitIndex) {
      if(!state.phase||!state.nextSkill){say('info','Choose your learning phase and what you’ll practise next.');$(state.phase?'#nextSkill':'#phase').focus();return;}
    } else if(page===finishIndex) {
      if(!state.reflection.trim()){say('info','Write one short explanation. Start by naming a result that will change.');$('#reflection').focus();return;}
    } else if(current()) {
      commit();
      const s=current(), b=book();
      for(const q of s.checks) {
        const issue=checkOne(q);
        if(issue) {
          selected=q.cell; alertCell=q.cell; say('bad','Start at '+q.cell+': '+issue); render();
          $('#cell-feedback').focus();
          return;
        }
      }
      if(s.plans){
        for(let i=0;i<s.plans.length;i++){
          const label=i?'B':'A', p=b.plans[i];
          const value=engine.evaluate(b.cells,'D4',s.plans[i].values).value;
          if(!p || !engine.numeric(p.total) || !close(+p.total,value)){
            const loadFirst=!p;
            say('bad',loadFirst?'Load Plan '+label+' first, then record the total in D4.':'Check Plan '+label+' again. Load it and record the number shown in D4.');
            const target=loadFirst?'[data-plan="'+i+'"]':'[data-total="'+i+'"]'; $(target).focus();return;
          }
        }
        if(b.decision!=='Plan A'){say('bad','Compare both totals with RM90. A plan can cost RM90 or less. Choose the plan that fits.');$('#decision').focus();return;}
      }
    }
    if(jumpOnly){say('good','This stage is ready. Tap Check & next to continue.',true);return;}
    state.done[page]=true;
    go(page+1);
  }
  $('#language').onclick=()=>{const login=student?null:[$('#name')?.value,$('#class')?.value];if(student&&current())commit();zh=!zh;storage.set('zh',String(zh));render();if(login){$('#name').value=login[0]||'';$('#class').value=login[1]||'';}};
  $('#switch').onclick=()=>{if(current())commit();if(pdfURL)URL.revokeObjectURL(pdfURL);pdfURL=null;preparedPdf=null;student=null;state=null;render();$('#name').focus();};
  $('#backup').onclick=()=>{
    if(current())commit();
    const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({lesson:'Eco-Budget Formula Lab',version:1,name:student.name,class:student.group,work:state},null,2)],{type:'application/json'}));
    a.href=url;a.download='Eco-Budget_'+student.group.replace(/[^a-z0-9_-]/gi,'_')+'_'+student.name.replace(/[^a-z0-9_-]/gi,'_')+'.json';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  };
  render();
})();
