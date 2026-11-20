(() => {
'use strict';
const day=Number(document.body.dataset.day), cards=window.COVER_CARDS[day];
const core=day===1?[0,3,9,11,19,21,24,28,34,35,44,45,54,55]:[1,2,11,13,18,23,24,28,32,37,40,44,53,55];
const types=['typing','mcq','blank','parsons','debug','explain','challenge'];
const names=['Type to play','Quick quiz','Fill the gap','Order the code','Fix the bug','Explain it','Programming challenge'];
const cn=['打字游戏','小测验','选择填空','代码排序','修正错误','解释代码','编程挑战'];
const key='y9-cover-arcade-v1-day'+day;
function get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}}
function put(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}
const state=Object.assign({done:{},drafts:{},scores:{},jamChecks:{},last:null,platform:'Scratch',explanations:{}},get(key)||{});
let zh=Boolean(get('y9-cover-zh')), closeArt,stopWork,interval;
// Merge changed answers into the current record when the lesson is open in two tabs.
let snapshot=JSON.parse(JSON.stringify(state));
function save(){
 const latest=get(key)||{};
 for(const [name,value] of Object.entries(state)){
   if(JSON.stringify(value)===JSON.stringify(snapshot[name]))continue;
   if(['drafts','done','scores','explanations','jamChecks','jamNeed','jamBenefit','answers'].includes(name)){
     const merged={...latest[name]};
     for(const [id,answer] of Object.entries(value)){
       if(JSON.stringify(answer)!==JSON.stringify(snapshot[name]?.[id]))merged[id]=answer;
     }
     latest[name]=merged;
   }else latest[name]=value;
 }
 if(put(key,latest)){snapshot=JSON.parse(JSON.stringify(state));return true;}
 let warning=document.getElementById('storage-warning');
 if(!warning){warning=document.createElement('p');warning.id='storage-warning';warning.setAttribute('role','status');warning.className='sample';document.querySelector('header').after(warning);}
 warning.textContent='This browser could not save your progress. Keep this tab open and save your code or proposal separately. 本浏览器无法保存进度。请保留此页面，并另存程序或提案。';
 return false;
}
state.answers=state.answers||{};
function savedRoute(record){
 if(!record)return '';
 const last=record.last;
 if(record.track==='jam'||(!last&&(record.jamTool||record.jamNeed||Object.values(record.jamChecks||{}).some(Boolean))))return '#jam';
 if(last&&['core','bank'].includes(last.mode)&&Number.isInteger(last.i)&&last.i>=0&&last.i<56)return '#'+last.mode+'/'+last.i;
 return record.track==='python'?'#python':'';
}
function resumeUrl(number){const prefix=number===day?'':'../year9-cover-day'+number+'/';return prefix+'#resume';}
function resumeHeading(number,record){
 const path=savedRoute(record);
 if(!path)return pair('Open Day '+number, '打开第 '+number+' 天');
 return path==='#jam'?pair('Continue Day '+number+' · Coding Jam','继续第 '+number+' 天的 Coding Jam'):pair('Continue Day '+number+' · Python','继续第 '+number+' 天的 Python');
}
function continuePanel(){
 const first=day===1?state:get('y9-cover-arcade-v1-day1');
 const same=savedRoute(state);
 if(day===1&&!same&&!window.coverDay2Open())return '';
 let buttons='';
 if(day===2||same) buttons+='<a class="btn primary" href="'+resumeUrl(1)+'">'+resumeHeading(1,first)+'</a>';
 if(day===2&&same) buttons+='<a class="btn" href="#resume">'+resumeHeading(2,state)+'</a>';
 if(day===1&&window.coverDay2Open())buttons+='<a class="btn" href="../year9-cover-day2/">'+pair('Open Day 2','进入第二天')+'</a>';
 return '<section class="panel"><h2>'+pair(day===2?'Still finishing Day 1?':'Pick up your work',day===2?'还在完成第一天的任务吗？':'继续之前的学习')+'</h2><p>'+pair('Use the same device and browser profile to return to your saved work. On a different device, use your saved Python file or shared slide deck.','使用同一台设备和同一个浏览器配置，才能恢复本机进度。换设备时，请打开自己保存的 Python 文件或共享幻灯片。')+'</p><div class="actions">'+buttons+'</div></section>';
}
const main=document.getElementById('main');
const q=sel=>main.querySelector(sel);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c])}
const pair=(en,mandarin)=>esc(en)+(zh&&mandarin?'<span class="zh" lang="zh-Hans">'+esc(mandarin)+'</span>':'');
const link=(target,label,primary=false)=>'<a class="btn '+(primary?'primary':'')+'" href="'+target+'">'+esc(label)+'</a>';
const button=(id,label,primary=false)=>'<button id="'+id+'" class="'+(primary?'primary':'')+'">'+esc(label)+'</button>';
const pre=code=>'<pre class="code">'+esc(code)+'</pre>';
const story=day===1?'Arcade Pass':'Level Runner';
const goal=day===1?['Build an arcade pass that greets a player and opens the gate when they have five coins.','制作街机通行证：问候玩家，金币达到五枚就开门。']:['Upgrade your Arcade Pass. Give the player five named levels when the gate opens.','升级第一天的街机通行证。闸门开启后显示五个带游戏名的关卡。'];
function resetView(){if(closeArt)closeArt();closeArt=null;if(stopWork)stopWork();stopWork=null;clearInterval(interval);}
function art(progress=0,active=false,complete=false){
  if(closeArt?.updateProgress){closeArt.updateProgress(progress,active,complete);return}
  const canvas=q('canvas');
  if(canvas)closeArt=window.drawCoverArcade(canvas,day,progress,{active,complete});
}
function download(file,text){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function nextCore(){return core.find(i=>!state.done[i])??core[core.length-1]}
function home(){
  const jamTitle=day===1?'Pitch an app in Canva':'Build a working prototype';
  main.innerHTML='<section class="hero"><div class="words"><p class="kicker">Year 9 / Cover studio / Day '+day+'</p><h1>'+story+'</h1><p>'+pair(day===1?'Your first play starts here. Choose your lesson.':'Welcome back. Choose the project you’re continuing.',day===1?'选择今天的学习任务。':'欢迎回来，选择你要继续的项目。')+'</p></div><div class="visual"><canvas aria-label="Illustrated arcade scene" role="img"></canvas></div></section><div class="grid"><section class="route"><p class="kicker"><span class="glyph" aria-hidden="true">&lt;/&gt;</span>Python arcade</p><h2>'+ (day===1?'Code the entry gate':'Unlock five levels')+'</h2><p>'+pair(...goal)+'</p>'+link('#python',state.last===null?'Start Python':'Open Python',true)+'</section><section class="route jam"><p class="kicker"><span class="glyph" aria-hidden="true">✦</span>Coding Jam</p><h2>'+jamTitle+'</h2><p>'+pair(day===1?'Pitch one idea for your school or community. Open a copy of the team slide template.':'Use slide 4 of your proposal. Bring one tap and its result to life with your partner.',day===1?'向大家介绍一个帮助学校或社区的想法。打开团队幻灯片模板的副本。':'用提案第 4 页，和同伴做出一个点击后能显示结果的原型。')+'</p>'+link('#jam',day===1?'Open proposal studio':'Open prototype studio',true)+'</section></div><p class="sub">'+pair('Coding Jam pairs work together. Everyone else may choose either route. If your teacher assigned the catch-up test, open that assignment in Teams first.','Coding Jam 的同伴一起做；其他同学可任选路线。如老师安排了补测，请先在 Teams 打开补测作业。')+'</p>';
  main.querySelector('.hero').insertAdjacentHTML('afterend',continuePanel());
  art(.16);
}
function overview(){
  const completed=core.filter(i=>state.done[i]).length, last=state.last;
  main.innerHTML='<section class="panel"><p class="kicker">Python arcade / Day '+day+'</p><h1>'+story+'</h1><p>'+pair(...goal)+'</p><div class="sample"><strong>What your program will show</strong>'+pre(day===1?'Welcome Alex\nGame: Maze\nPass unlocked':'Game: Maze\nPass unlocked\nMaze - Level 1\nMaze - Level 2\n…\nMaze - Level 5')+'</div><div class="actions">'+link(completed===14?'#finish':'#core/'+nextCore(),completed===14?'View my finish screen':completed?'Continue the guided route':'Start the guided route',true)+link('#library','Explore all 56 cards')+(last&&last.mode==='bank'?link('#bank/'+last.i,'Resume practice card'):'')+'</div><p class="sub">'+pair(completed+' of 14 guided cards complete. Try two of each activity, then choose extra practice if you have time.', '核心路线已完成 '+completed+'/14。每类做两题，有时间可再加练。')+'</p><progress class="progress" max="14" value="'+completed+'"></progress></section><details><summary>How to use your 60 minutes</summary><p>'+pair('Allow 5 minutes to start, 10 for typing and quiz, 10 for gaps and code ordering, 15 for debugging and explaining, 15 to build, and 5 to save your .py file.','用 5 分钟准备，10 分钟打字和小测，10 分钟填空排序，15 分钟调试与解释，15 分钟编程，最后 5 分钟保存 .py。')+'</p></details>';
}
function library(){
  main.innerHTML='<div class="toolbar">'+link('#python','Python home')+link('#core/'+nextCore(),'Guided route')+'</div><section class="panel"><h1>Practice library</h1><p>'+pair('Choose a skill. Each shelf has eight cards, from a first try to a bigger challenge. A tick marks a card you have completed on this device.','选择一项技能。每组八题，由浅入深。打勾的题已在此设备上完成。')+'</p>'+types.map((type,g)=>'<details><summary>'+pair(names[g]+' · '+cards.filter((c,i)=>c.type===type&&state.done[i]).length+'/8',cn[g])+'</summary><div class="cardlist">'+cards.map((c,i)=>c.type===type?'<a href="#bank/'+i+'">'+(state.done[i]?'✓ ':'')+esc(c.title)+'</a>':'').join('')+'</div></details>').join('')+'</section>';
}
function finish(){
  const count=core.filter(i=>state.done[i]).length;
  main.innerHTML='<section class="panel"><p class="kicker">Python arcade / Save your work</p><h1>'+ (count===14?'Guided route complete':'Your session so far')+'</h1><p>'+pair(count+' of 14 guided cards complete. Your answers stay in this browser. Download your best program and a progress record before leaving a shared device.','核心路线已完成 '+count+'/14。答案保存在本浏览器中。离开公用设备前，请下载程序和进度记录。')+'</p><div class="actions">'+(state.drafts[55]?button('getpy','Download arcade_pass.py',true):link('#core/55','Open the final program',true))+button('record','Download my progress')+link('#library','More practice')+'</div><p>'+pair('Keep the .py file for the next lesson. Attach it to the cover assignment if your teacher has opened one.','保留 .py 文件供下次使用。若老师已开放代课作业，可在那里提交。')+'</p></section>';
  if(q('#getpy'))q('#getpy').onclick=()=>download('arcade_pass.py',state.drafts[55]);
  q('#record').onclick=()=>download('day'+day+'-arcade-progress.txt',['Day '+day+' • '+story,count+'/14 on the guided route',...cards.flatMap((c,i)=>state.done[i]?[names[types.indexOf(c.type)]+' | '+c.title+(state.scores[i]?' | '+state.scores[i]+' WPM':'')+(c.type==='explain'?' | '+(state.explanations[i]||''):'')]:[])].join('\n'));
}
function setFeedback(text,ok=false){const el=q('#feedback');el.className='feedback'+(ok?' good':'');el.textContent=text}
function shuffled(n){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function card(mode,i){
  const c=cards[i], isCore=mode==='core', list=isCore?core:cards.map((_,n)=>n), pos=list.indexOf(i), total=list.length;
  if(pos<0){location.hash='python';return}
  state.track='python';state.last={mode,i};save();
  const next=pos+1===total?'#finish':'#'+mode+'/'+list[pos+1],nextText=pos+1===total?'Finish and save':'Next card';
  main.innerHTML='<div class="toolbar">'+link(isCore?'#python':'#library',isCore?'Guided route':'Practice library')+link('#finish','Save & finish')+'</div><section class="panel"><div class="row"><p class="kicker">'+names[types.indexOf(c.type)]+'</p><span class="sub">'+(isCore?'Guided route':'Practice bank')+' · '+(pos+1)+' / '+total+'</span></div><progress class="progress" max="'+total+'" value="'+(pos+1)+'"></progress><h1>'+esc(c.title)+'</h1><p>'+pair(c.prompt,c.zh)+'</p><div id="activity"></div><details><summary>'+pair('Give me a hint','给我一点提示')+'</summary><p>'+pair(c.hint,c.hintZh)+'</p></details><div id="feedback" class="feedback" role="status"></div><div class="actions lower">'+(pos?link('#'+mode+'/'+list[pos-1],'Previous'):'')+'<span id="next">'+(state.done[i]?link(next,nextText,true):'')+'</span><span class="sub" id="saved">'+(state.done[i]?'✓ Completed on this device':'')+'</span></div></section>';
  const complete=(en,mandarin)=>{state.done[i]=true;save();q('#next').innerHTML=link(next,nextText,true);q('#saved').textContent='✓ Completed on this device';setFeedback(en+(zh&&mandarin?'\n'+mandarin:''),true)};
  const a=q('#activity');
  if(c.type==='typing')typing(c,i,a,complete);
  if(c.type==='mcq'||c.type==='blank'){
    const answer=state.answers[i]||{};
    let choice=answer.choice??null;const order=answer.order||shuffled(c.options.length);
    a.innerHTML=(c.code?pre(c.code):'')+order.map(n=>'<button data-opt="'+n+'" class="opt" aria-pressed="'+(n===choice)+'">'+esc(c.options[n])+'</button>').join('')+button('check','Check answer',true);
    a.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>{choice=Number(b.dataset.opt);state.answers[i]={choice,order};save();a.querySelectorAll('[data-opt]').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));setFeedback('')});
    q('#check').onclick=()=>choice===c.correct?complete('Correct. '+(c.type==='blank'?'The missing part is '+c.options[choice]+'.':'You can move on.'),'正确，可以继续。'):setFeedback(choice===null?'Choose one answer first.':c.hint+(zh?'\n'+c.hintZh:''));
  }
  if(c.type==='parsons'){
    let order=state.answers[i]?.order||shuffled(c.lines.length);if(order.every((v,n)=>v===n))order.reverse();let chosen=state.answers[i]?.chosen||[];
    function keepOrder(){state.answers[i]={order,chosen:[...chosen]};save();}
    function lines(){a.innerHTML='<p>'+pair('Tap a line to add it below. Tap an added line to put it back. Keep the indentation you see.','按顺序点选代码行。点已选的行可将其放回。保留显示的缩进。')+'</p><div id="bankLines"></div><strong>Your program</strong><div class="ordered" id="ordered"></div><div class="actions">'+button('check','Check order',true)+button('clear','Start again')+'</div>';
      function line(n,to){return '<button class="line" data-n="'+n+'" data-to="'+to+'">'+esc(c.lines[n])+'</button>'}
      q('#bankLines').innerHTML=order.filter(n=>!chosen.includes(n)).map(n=>line(n,'add')).join('');
      q('#ordered').innerHTML=chosen.map(n=>line(n,'remove')).join('')||'<span class="sub">Your first line goes here.</span>';
      a.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const n=+b.dataset.n;chosen=b.dataset.to==='add'?[...chosen,n]:chosen.filter(x=>x!==n);keepOrder();lines();setFeedback('')});
      q('#check').onclick=()=>chosen.length===c.lines.length&&chosen.every((n,k)=>n===k)?complete('Your lines are in the right order.','顺序正确。'):setFeedback(chosen.length<c.lines.length?'Choose all the lines first.':c.hint+(zh?'\n'+c.hintZh:''));
      q('#clear').onclick=()=>{chosen=[];keepOrder();lines();setFeedback('')};
    }lines();
  }
  if(c.type==='explain'){
    a.innerHTML=(c.code?pre(c.code):'')+'<label class="label" for="explain">'+pair('Explain in your own words. Short phrases in English or Mandarin are welcome.','用自己的话解释，可用中文或英文写短语。')+'</label><textarea id="explain" rows="3"></textarea><div class="actions">'+button('compare','Compare with an example',true)+'</div><div id="sample"></div>';
    q('#explain').value=state.explanations[i]||'';q('#explain').oninput=e=>{state.explanations[i]=e.target.value;save();q('#sample').innerHTML=''};
    q('#compare').onclick=()=>{if(!q('#explain').value.trim()){setFeedback('Write your idea first.');return}setFeedback('');q('#sample').innerHTML='<div class="sample"><strong>One possible explanation</strong><p>'+pair(c.sample,c.sampleZh)+'</p><p>'+pair('Compare the computing idea. If something is missing, edit your answer above and compare again.','对照编程要点；如有遗漏，在上方修改后再比较。')+'</p>'+button('self','I compared my explanation',true)+'</div>';q('#self').onclick=()=>complete('Self-check recorded.','已记录自评。')};
  }
  if(c.type==='debug'||c.type==='challenge')editor(c,i,a,complete);
}
function insertIndent(input) {
  input.setRangeText('    ', input.selectionStart, input.selectionEnd, 'end');
  input.dispatchEvent(new Event('input', {bubbles:true}));
}

function typing(c, i, activity, complete) {
  const target = c.code;
  activity.innerHTML = `
    <div class="type-controls">
      <label for="typed">${pair('Tap the code to type. Use Space for · and Enter for ↵.',
                                '点代码开始输入。· 表示空格，↵ 表示回车。')}</label>
      <label class="type-mode"><input type="checkbox" id="speed" checked> WPM mode</label>
    </div>
    <div class="type-deck">
      <div class="type-status">
        <div class="neon-wpm">
          <div class="neon-dial" aria-hidden="true">
            <svg viewBox="0 0 96 70" focusable="false">
              <defs><linearGradient id="speed-spectrum"><stop stop-color="#38f9fe"/><stop offset=".52" stop-color="#a88aff"/><stop offset="1" stop-color="#ff68d5"/></linearGradient></defs>
              <path class="dial-track" d="M12 58 A38 38 0 1 1 84 58" pathLength="100"/>
              <path class="dial-fill" d="M12 58 A38 38 0 1 1 84 58" pathLength="100" stroke="url(#speed-spectrum)"/>
            </svg>
          </div>
          <div class="speed-value"><strong id="live-wpm">0</strong> <span>WPM</span></div>
        </div>
        <div class="type-readout" id="meter"></div>
        <div class="type-next" aria-hidden="true"><span>${zh?'Next key / 下一键':'Next key'}</span> <kbd></kbd></div>
      </div>
      <div class="type-pad">
        <pre class="type-sr" id="type-target">${esc(target)}</pre>
        <div class="type-track" aria-hidden="true"></div>
        <i class="type-caret" aria-hidden="true"></i>
        <textarea id="typed" aria-label="Type the Python code" aria-describedby="type-target type-keys"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" rows="1"></textarea>
      </div>
      <canvas class="type-scene" aria-hidden="true"></canvas>
    </div>
    <div class="type-actions">
      ${target.includes('\n') ? button('type-indent',zh?'Tab · 缩进四格':'Tab · Indent 4 spaces') : ''}
      ${button('retry','Restart typing')}
    </div>
    <p class="sub" id="type-keys">${pair('Tab inserts four spaces. Press Esc to leave the typing area.', '按 Tab 缩进四个空格。按 Esc 离开输入区。')}</p>`;

  const input = q('#typed'), speed = q('#speed'), track = q('.type-track');
  const pad = q('.type-pad'), caret = q('.type-caret'), keycap = q('.type-next kbd');
  const dial = q('.neon-wpm');
  const dialFill = q('.dial-fill');
  const liveWpm = q('#live-wpm');
  const indentButton = q('#type-indent');
  const glyphs = [];
  function glyph(char) {
    const s = document.createElement('span');
    s.textContent = char === ' ' ? '·' : char === '\n' ? '↵' : char;
    track.append(s);
    return s;
  }
  for (const char of target) {
    glyphs.push(glyph(char));
    if (char === '\n') track.append(document.createElement('br'));
  }
  const end = glyph('\u200b');
  let started = 0, elapsed = 0, previous = '', prefix = 0, finished = false;
  const attempt=state.answers[i]||{};
  let carried=attempt.elapsed||0;
  let attempts=attempt.attempts||0, correctAttempts=attempt.correctAttempts||0, keyAnimation;
  previous=input.value=attempt.text||'';
  speed.checked=attempt.speed!==false;
  finished=previous===target;
  while(prefix<previous.length&&prefix<target.length&&previous[prefix]===target[prefix])prefix++;
  elapsed=carried;input.readOnly=finished;
  pad.classList.toggle('is-finished',finished);
  if(indentButton)indentButton.disabled=finished;
  function storeAttempt(){state.answers[i]={text:input.value,elapsed,attempts,correctAttempts,speed:speed.checked};save();}
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function updateMeter() {
    const ms = finished || !started ? elapsed : carried + performance.now() - started;
    const wpm = ms > 0 ? Math.round(prefix * 12000 / Math.max(ms, 750)) : 0;
    const accuracy = attempts ? Math.round(100 * correctAttempts / attempts) + '%' : '—';
    dial.hidden = !speed.checked;
    liveWpm.textContent = wpm;
    // The arc approaches full scale smoothly and the number gives the exact rate.
    dialFill.style.strokeDashoffset = String(100 - 100 * wpm / (wpm + 40));
    dial.classList.toggle('is-running', Boolean(started && !finished));
    dial.classList.toggle('is-complete', finished);
    q('#meter').textContent = [
      accuracy + (zh ? ' 准确率' : ' accuracy'), prefix + ' / ' + target.length,
      speed.checked && state.scores[i] ? (zh?'最佳 ':'Best ') + state.scores[i] + ' WPM' : null].filter(Boolean).join('   ·   ');
    return wpm;
  }
  function positionCaret() {
    const pos = Math.min(input.selectionEnd, target.length);
    const current = glyphs[pos] || end;
    const x = track.offsetLeft + current.offsetLeft;
    const y = track.offsetTop + current.offsetTop;
    caret.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    input.style.left = x + 'px';
    input.style.top = y + 'px';
    const char = target[pos];
    const lineStart = target.lastIndexOf('\n', pos - 1) + 1;
    const indentAhead = /^ *$/.test(target.slice(lineStart, pos)) && target.startsWith('    ', pos);
    keycap.textContent = finished ? '✓' : prefix < input.value.length && input.selectionEnd === input.value.length
      ? 'Backspace' : indentAhead ? 'Tab' : ({' ':'Space','\n':'Enter'})[char] || char || 'Backspace';
    const lo = input.selectionStart, hi = input.selectionEnd;
    glyphs.forEach((g, n) => g.classList.toggle('in-selection', n >= lo && n < hi));
  }
  function paint() {
    const value = input.value;
    glyphs.forEach((g, n) => {
      g.className = n < value.length ? (value[n] === target[n] ? 'hit' : 'miss') : '';
    });
    end.textContent = value.slice(target.length) || '\u200b';
    end.className = value.length > target.length ? 'miss extra' : '';
    positionCaret();
  }
  function countNewCharacters(value) {
    let from = 0;
    while (from < previous.length && from < value.length && previous[from] === value[from]) from++;
    let oldEnd = previous.length, newEnd = value.length;
    while (oldEnd > from && newEnd > from && previous[oldEnd-1] === value[newEnd-1]) {
      oldEnd--; newEnd--;
    }
    for (let n = from; n < newEnd; n++) {
      attempts++;
      if (value[n] === target[n]) correctAttempts++;
    }
  }
  function onInput() {
    if (finished || input.value === previous) return;
    const now = performance.now(), value = input.value;
    if (!started) started = now;
    countNewCharacters(value);
    previous = value;
    prefix = 0;
    while (prefix < value.length && prefix < target.length && value[prefix] === target[prefix]) prefix++;
    finished = value === target;
    elapsed = carried + now - started;
    storeAttempt();
    paint();
    art(prefix / target.length, true, finished);
    if (!reducedMotion.matches && keycap.animate) {
      keyAnimation?.cancel();
      keyAnimation = keycap.animate([{transform:'translateY(2px) scale(.94)'},{transform:'none'}], {duration:140});
    }
    const wpm = updateMeter();
    if (finished) {
      input.readOnly = true;
      if (indentButton) indentButton.disabled = true;
      pad.classList.add('is-finished');
      if (speed.checked) state.scores[i] = Math.max(state.scores[i] || 0, wpm);
      complete(speed.checked ? 'Code matched. ' + wpm + ' WPM.' : 'Code matched.', '输入正确。');
    } else {
      const wrong = prefix < value.length;
      setFeedback(wrong ? (zh ? '用退格键修改有下划线的字符。' : 'Use Backspace to correct the underlined character.') : '');
    }
  }
  function reset() {
    started = carried = elapsed = prefix = attempts = correctAttempts = 0;
    previous = '';
    finished = false;
    input.readOnly = false;
    if (indentButton) indentButton.disabled = false;
    input.value = '';storeAttempt();
    pad.classList.remove('is-finished');
    setFeedback('');
    paint();
    updateMeter();
    art(0, true);
    input.focus({preventScroll:true});
  }
  pad.addEventListener('click', () => input.focus({preventScroll:true}));
  input.onkeydown = e => {
    if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      q('#retry').focus();
    } else if (e.key === 'Tab' && !input.readOnly) {
      e.preventDefault();
      insertIndent(input);
    }
  };
  if (indentButton) indentButton.onclick = () => {
    input.focus({preventScroll:true});
    insertIndent(input);
  };
  input.onpaste = e => {
    if (!speed.checked) return;
    e.preventDefault();
    setFeedback(zh ? '速度模式需要逐键输入。' : 'Type each key for a WPM score.');
  };
  input.oninput = e => { if (!e.isComposing) onInput(); };
  input.oncompositionend = onInput;
  input.onselect = input.onkeyup = input.onclick = positionCaret;
  input.onfocus = positionCaret;
  q('#retry').onclick = reset;
  speed.onchange = reset;
  const resize = new ResizeObserver(positionCaret);
  resize.observe(track);
  stopWork = () => { resize.disconnect(); keyAnimation?.cancel(); };
  interval = setInterval(() => { if (started && !finished && speed.checked) updateMeter(); }, 350);
  paint();
  updateMeter();
  art(prefix/target.length,true,finished);
}
function editor(c,i,a,complete){
 const jump=day===2&&(i===53||i===55);
 a.innerHTML='<label for="src" class="label">Python editor</label><textarea id="src" class="editor" rows="'+Math.min(19,Math.max(5,c.starter.split('\n').length+2))+'" autocapitalize="off" autocomplete="off" spellcheck="false"></textarea><div class="actions">'+button('run','▶ Run')+button('stop','Stop')+button('test','Check my code',true)+button('py','Save .py')+'</div><div class="log"><strong class="label">Console</strong><pre class="console" id="out" role="log"></pre><form id="inputForm" hidden><label class="label" for="reply" id="prompt">Your input</label><div class="actions"><input type="text" autocomplete="off" id="reply"><button>Send input</button></div></form></div><details><summary>'+pair('See the check inputs and expected output','查看测试输入和预期输出')+'</summary>'+c.tests.map((t,n)=>'<strong>Check '+(n+1)+'</strong><p>Inputs · '+esc(t.inputs.join(' / ')||'none')+'</p>'+pre(t.expected.join('\n'))).join('')+'</details>'+(jump?'<details><summary>'+pair('Continue your saved Arcade Pass','继续之前保存的通行证程序')+'</summary><p>'+pair('Load your own .py file or use your last saved code from this browser. Keep the coin gate. Inside the unlocked branch, add a for loop for levels 1 to 3 on “Add levels”; for the final challenge use 1 to 5 and print the game name on each line.','可导入自己的 .py 文件，或载入浏览器中保存的程序。保留金币判断，在解锁分支内加循环：“Add levels”显示 1 至 3 关；最后挑战显示 1 至 5 关，每行带游戏名。')+'</p><label class="label" for="loadFile">Open my .py</label><input type="file" accept=".py,text/plain" id="loadFile">'+button('loadLocal','Load saved Arcade Pass')+'</details>':'');
 const src=q('#src'),out=q('#out'),form=q('#inputForm'),reply=q('#reply');let worker=null,alarm,stopReject;
 src.value=state.drafts[i]??c.starter;
 const retain=()=>{state.drafts[i]=src.value;save()};
 src.oninput=retain;
 src.onkeydown=e=>{if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
   if(e.key==='Tab'&&!e.shiftKey&&document.getElementById('indent').checked){e.preventDefault();insertIndent(src)}
   if(e.key==='Escape'){e.preventDefault();q('#indent').focus();return}
   if(e.key==='Enter'){e.preventDefault();const line=src.value.slice(0,src.selectionStart).split('\n').pop();const indent=(line.match(/^ */)||[''])[0]+(line.trimEnd().endsWith(':')?'    ':'');src.setRangeText('\n'+indent,src.selectionStart,src.selectionEnd,'end');retain()}
 };
 src.insertAdjacentHTML('afterend','<label class="sub"><input id="indent" type="checkbox" checked> Use Tab to indent · Esc to leave the editor</label>');
 function loadCode(value){src.value=value;retain();setFeedback('Your program is in the editor. Make your changes, then check the code.')}
 if(jump){
  q('#loadFile').onchange=async(e)=>{const f=e.target.files[0];if(f&&f.size<250000)loadCode(await f.text());else setFeedback('Choose a small Python .py file.')};
  q('#loadLocal').onclick=()=>{const prior=(i===55&&state.drafts[54])||(i===55&&state.drafts[53])||get('y9-cover-arcade-v1-day1')?.drafts?.[55];if(prior)loadCode(prior);else setFeedback('No saved Arcade Pass was found here. Open your .py file or use the starter in the editor.')};
 }
 q('#py').onclick=()=>{retain();download(c.type==='challenge'&&i>=53?'arcade_pass.py':'day'+day+'-'+(i+1)+'.py',src.value);setFeedback('Python file downloaded.')};
 function busy(on){q('#run').disabled=on;q('#test').disabled=on;q('#stop').disabled=!on}
 busy(false);
 function cancel(message){clearTimeout(alarm);if(worker)worker.terminate();worker=null;form.hidden=true;const reject=stopReject;stopReject=null;if(reject)reject(Error(message||'Stopped'))}
 stopWork=()=>cancel();q('#stop').onclick=()=>cancel('Program stopped.');
 function execute(code,inputs){
   return new Promise((resolve,reject)=>{
    stopReject=reject;
    try{worker=new Worker('../year9-cover-shared/python-worker.js')}catch(error){stopReject=null;reject(error);return}
    const limit=()=>{clearTimeout(alarm);alarm=setTimeout(()=>cancel('Stopped after 6 seconds. Check that your loop can finish.'),6000)};
    function finish(ok,result){clearTimeout(alarm);worker?.terminate();worker=null;stopReject=null;form.hidden=true;if(ok)resolve(result);else reject(Error(result))}
    worker.onerror=()=>finish(false,'Could not load the Python runner. Open the public lesson link in your browser and try again.');
    worker.onmessage=({data})=>{switch(data.kind){
     case 'write':out.textContent+=data.value;out.scrollTop=out.scrollHeight;break;
     case 'prompt':clearTimeout(alarm);form.hidden=false;q('#prompt').textContent=data.value||'Your input';reply.value='';reply.focus();break;
     case 'done':finish(true,data.output);break;
     case 'error':finish(false,data.value);break;
    }};
    form.onsubmit=e=>{e.preventDefault();if(!worker)return;out.textContent+=q('#prompt').textContent+reply.value+'\n';form.hidden=true;worker.postMessage({kind:'answer',value:reply.value});limit()};
    worker.postMessage({code,inputs});limit();
   });
 }
 const alive=()=>document.contains(src);
 async function run(test){
  retain();busy(true);out.textContent='';setFeedback('');const code=src.value;
  try{
   if(!test){await execute(code,null);if(alive())setFeedback('Run finished. Use “Check my code” to compare the results.');return}
   let passed=true;
   for(const [n,t] of c.tests.entries()){
     const raw=await execute(code,t.inputs);if(!alive())return;
     const actual=raw.replace(/\r/g,'').replace(/\n$/,'');const expected=t.expected.join('\n');const ok=actual===expected;passed=passed&&ok;
     out.textContent+='Check '+(n+1)+' · '+(ok?'Passed':'Try again')+'\n';
     if(!ok)out.textContent+='Inputs: '+(t.inputs.join(', ')||'none')+'\nExpected:\n'+expected+'\nYour output:\n'+(actual||'(no output)')+'\n';
   }
   if(passed)complete('All code checks passed. Save your program or continue.','通过所有代码测试。可以保存程序或继续。');
   else setFeedback('Compare the expected output with yours in the console. '+c.hint+(zh?'\n'+c.hintZh:''));
  }catch(e){if(alive()){out.textContent+='\n'+e.message;setFeedback('Read the last message in the console, then try again.')}}finally{if(alive())busy(false)}
 }
 q('#run').onclick=()=>run(false);q('#test').onclick=()=>run(true);
}
function render(){
 resetView();let [route,arg]=location.hash.slice(1).split('/');
 const resuming=route==='resume';
 if(resuming){
   const destination=savedRoute(state)||'#home';
   history.replaceState(null,'',destination);
   [route,arg]=destination.slice(1).split('/');
 }
 if(route==='jam'||route==='python'){state.track=route;save();}
const lang=document.getElementById('lang');lang.setAttribute('aria-pressed',String(zh));lang.textContent=zh?'English only':'English + 中文';
 if(route==='python')overview();else if(route==='library')library();else if(route==='finish')finish();else if(route==='jam')window.coverJam({day,state,save,esc,pair,main,zh,button,localLink:link});
 else if((route==='core'||route==='bank')&&/^\d+$/.test(arg||'')&&cards[Number(arg)])card(route,Number(arg));else home();
 if(route==='jam'&&resuming&&Number.isInteger(state.jamSection)){
   const section=main.querySelectorAll('section.panel')[state.jamSection];
   if(section)requestAnimationFrame(()=>section.scrollIntoView({block:'start'}));
 }
 if(day===1&&window.coverDay2Open()&&['jam','finish'].includes(route)){
   main.insertAdjacentHTML('beforeend','<div class="actions"><a class="btn" href="../year9-cover-day2/">'+pair('Ready for Day 2? Open the next lesson','准备好了吗？打开第二天的课程')+'</a></div>');
 }
}
function rememberJamSection(e){
 if(location.hash!=='#jam')return;
 const sections=[...main.querySelectorAll('section.panel')];
 const section=e.target.closest?.('section.panel');
 const index=sections.indexOf(section);
 if(index>=0&&state.jamSection!==index){state.jamSection=index;save();}
}
main.addEventListener('focusin',rememberJamSection);
main.addEventListener('click',rememberJamSection);
document.getElementById('lang').onclick=()=>{zh=!zh;put('y9-cover-zh',zh);render()};
document.getElementById('home').onclick=()=>location.hash='home';
window.addEventListener('hashchange',()=>{render();scrollTo(0,0);main.focus({preventScroll:true})});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
render();
})();
