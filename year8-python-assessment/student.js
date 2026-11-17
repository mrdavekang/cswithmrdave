"use strict";
const el=id=>document.getElementById(id);
const main=el("main"), clock=el("clock"), timer=el("test-timer"), timerWarning=el("timer-warning");
const formByClass = { "8t": "A", "8e": "B" };
const form = formByClass[new URLSearchParams(location.search).get("class")];
const className = form === "A" ? "8T" : "8E";
const classKey = location.hash.slice(1);
const classReady = Boolean(form && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(classKey));

function getBrowserKey() {
  const newKey = Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) => n.toString(16).padStart(2, "0")).join("");
  try {
    const key = "year8-assessment:browser:" + classKey;
    const existing = localStorage.getItem(key);
    if (/^[a-f0-9]{64}$/.test(existing || "")) return existing;
    localStorage.setItem(key, newKey);
  } catch {
    // Continue in this tab when the browser blocks storage.
  }
  return newKey;
}

const browserKey = classReady ? getBrowserKey() : "";
const copy={
  welcome:["Get ready for your Python test","准备开始 Python 测试","Python 시험 준비"],
  prepName:["Type your name exactly as it appears on the class register.","请输入与你在班级名单上一致的姓名。","출석부에 적힌 이름을 그대로 입력하세요."],
  prepStart:["Keep this tab open. When your teacher opens the test, select Start test.","请保持此标签页打开。老师开放测试后，点击“Start test”（开始测试）。","이 탭을 열어 두세요. 선생님이 시험을 열면 ‘Start test’(시험 시작)를 누르세요."],
  prepTimer:["The 40-minute timer starts for everyone when your teacher opens the test. If this tab closes, reopen the same class link in the same browser.","老师开放测试时，全班的 40 分钟计时同时开始。如果标签页关闭，请在同一浏览器中重新打开本班的链接。","선생님이 시험을 열면 모두의 40분 타이머가 시작됩니다. 탭이 닫히면 같은 브라우저에서 같은 반 링크를 다시 여세요."],
  guide:["Work through one question at a time. You can skip, go back or flag a question. Review your work after question 20.","每次做一题。可以跳过、返回或标记题目。完成第 20 题后检查答案。","한 번에 한 문항씩 푸세요. 건너뛰거나 이전 문항으로 돌아가거나 표시할 수 있습니다. 20번 뒤에 답을 확인하세요."],
  waiting:["Waiting for your teacher to open the test. You don’t need to refresh.","正在等待老师开放测试。无需刷新。","선생님이 시험을 열 때까지 기다리세요. 새로고침할 필요가 없습니다."],
  open:["The test is open. Enter your name and select Start test.","测试已开放。输入你的名字，然后选择开始测试。","시험이 열렸습니다. 이름을 입력하고 시험 시작을 선택하세요."],
  ended:["This test has ended. Tell your teacher if you could not finish.","本次测试已结束。如果没能完成，请告诉老师。","시험이 끝났습니다. 마치지 못했다면 선생님께 알려 주세요."],
  mc:["Choose one answer.","只选一个答案。","답 하나를 고르세요."],
  blank:["Type only the missing part.","只输入空白处缺少的部分。","빈칸에 빠진 부분만 입력하세요."],
  parsons:["Put the blocks in order from top to bottom. Each block already has its indentation.","把代码块从上到下排好。每块都已设置缩进。","코드 블록을 위에서 아래로 배열하세요. 각 블록에는 이미 들여쓰기가 적용되어 있습니다."],
  reorder:["Drag the dotted handle and drop at the blue line. You can also use Up and Down.","拖动点状手柄，在蓝线处放下。也可以使用 Up（上移）和 Down（下移）。","점 모양 손잡이를 끌어 파란 선에 놓으세요. Up(위)과 Down(아래) 버튼을 사용해도 됩니다."],
  code:["The starter code runs first. Type only your additions in Your Python code. Select Run Python to check your output. Running does not submit your answer.","起始代码会先运行。请只在“Your Python code”中填写你添加的代码。点击“Run Python”查看输出；运行不等于提交。","시작 코드가 먼저 실행됩니다. ‘Your Python code’에 추가할 코드만 쓰세요. ‘Run Python’을 눌러 출력을 확인하세요. 실행해도 답안은 제출되지 않습니다."],
  requirements:["What your program must do","程序要求","프로그램 요구 사항"],
  example:["Example run","运行示例","실행 예시"],
  examples:["Example runs","运行示例","실행 예시"],
  input:["Example input","示例输入","예시 입력"],
  output:["Expected output","预期输出","예상 출력"],
  timeShort:["5 minutes or less","剩余 5 分钟或更少","5분 이하 남음"],
  timeUp:["Time is up","时间到","시간 종료"],
  review:["Review before submitting","提交前检查","제출 전 확인"],
  reviewHelp:["Check any unanswered or flagged question. Submitting locks your work.","检查未答题目或已标记的题目。提交后不能修改。","미응답 또는 표시한 문항을 확인하세요. 제출한 답은 수정할 수 없습니다."],
  receipt:["Your test is submitted.","你的测试已提交。","시험 답안이 제출되었습니다."],
  rules:["40 minutes · 30 marks · 20 questions · No loops","40 分钟 · 30 分 · 20 题 · 不使用循环","40분 · 30점 · 20문항 · 반복문 사용 금지"]
};
const groups=[["A · Multiple choice","A · 选择题","A · 객관식"],["B · Fill in the blanks","B · 填空题","B · 빈칸 채우기"],["C · Parsons problems","C · 代码排序","C · 코드 순서 배열"],["D · Programming","D · 编程题","D · 프로그래밍"]];
const sectionId={mc:0,blank:1,parsons:2,code:3};
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[m]);
const t=v=>Array.isArray(v)?v:[v];
let language=0, session=null, question="1", fromReview=false, draft={answers:{},flags:[]}, revision=0, offset=0, orderDrag=null, reviewPage=0;
let nextDeadlineCheck=0;
let version=0, savedVersion=0, warning="", uploading=false, polling=false, timeout=0, runner=null, runGeneration=0, localWorks=true, conflicted=false;
try{language=Number(localStorage.getItem("y8test-language")||0);}catch{localWorks=false;}
if(![0,1,2].includes(language))language=0;
el("language").value=language;
const word=list=>esc(t(list)[language]||t(list)[0]);
const support=list=>language&&t(list)[language]?'<p class="support" lang="'+(language===1?"zh-Hans":"ko")+'">'+word(list)+'</p>':"";
const instruction=list=>'<p>'+esc(t(list)[0])+'</p>'+support(list);
const localKey=()=>"y8test:draft:"+session.id+":"+session.start;
const hasAnswer=q=>Array.isArray(draft.answers[q.id])||Boolean(String(draft.answers[q.id]||"").trim());
const label=q=>draft.flags.includes(q.id)?"Flagged":hasAnswer(q)?"Answered":"Unanswered";
function note(msg,error=false){const n=el("notice");if(n){n.textContent=msg;n.classList.toggle("error",error);}warning=msg;}
function api(action, body = {}) {
  return assessmentRequest({ ...body, action, form, classKey, browserKey });
}
function saveLocal(){
  if(!session?.start||session.submitted)return;
  try{localStorage.setItem(localKey(),JSON.stringify({draft,revision,question,dirty:version!==savedVersion}));}
  catch{localWorks=false;}
}
function restore(s){
  draft=s.draft||{answers:{},flags:[]};
  revision=s.rev||0;version=savedVersion=0;conflicted=false;
  try{
    const saved=JSON.parse(localStorage.getItem(localKey())||"null");
    if(saved){
      question=saved.question==="review"||s.questions.some(x=>x.id===saved.question)?saved.question:"1";
      if(saved.dirty&&saved.revision===revision){draft=saved.draft;version=1;}
      if(saved.dirty&&saved.revision!==revision&&JSON.stringify(saved.draft)!==JSON.stringify(draft)){
        draft=saved.draft;version=1;conflicted=true;
        warning="A newer copy exists on the host. Ask your teacher before using the draft on this device.";
      }
    }
  }catch{localWorks=false;}
}
function takeSession(s){
  const previous=session;
  if(previous?.submitted&&s.id===previous.id&&!s.submitted)return;
  if(s.serverTime)offset=s.serverTime-Date.now();
  if(!s.connected){
    if(previous?.connected){
      note("Your test has been disconnected. Tell your teacher and keep this tab open.",true);
      const node=el("save-state");if(node)node.textContent="Test disconnected";
      return;
    }
    session=s;
    if(!el("join-form"))render();else updateEntry();
    return;
  }
  const firstRunning=!previous?.questions&&s.questions;
  session=s;
  if(s.submitted){
    if(!previous?.submitted){
      stopRun();
      if(!previous?.questions&&session.start)try{
        const pending=JSON.parse(localStorage.getItem(localKey())||"null");
        if(pending?.dirty&&pending.revision>=s.rev&&pending.draft){draft=pending.draft;version=1;savedVersion=0;}
      }catch{}
      if(version===savedVersion)try{localStorage.removeItem(localKey());}catch{}
      render();
    }
  }else if(firstRunning){
    restore(s);render();if(version!==savedVersion&&!conflicted)void sync();
  }else if(!previous?.connected||previous.status!==s.status){render();}
  else if(s.questions&&s.rev>revision&&!uploading&&version===savedVersion){
    revision=s.rev;draft=s.draft;saveLocal();
    note("Your test was updated in another tab. Reload to see the latest answer.",true);
  }
}
async function refresh(){
  if(polling||!classReady||session?.submitted)return;polling=true;
  try{takeSession(await api("session"));if(version!==savedVersion&&!conflicted)void sync();}
  catch(error){
    if(!session){session={connected:false};render();}
    note(error.status===403?error.message:"Can’t reach the test host. Check the connection and try again.",true);
  }
  finally{polling=false;}
}
function htmlCode(value){return '<pre><code>'+esc(value)+'</code></pre>';}
const caption=list=>esc(list[0])+(language?' <span class="translation-label" lang="'+(language===1?"zh-Hans":"ko")+'">'+word(list)+'</span>':"");
function exampleHtml(q){
  if(!q.exampleRuns?.length)return "";
  const cell=(name,value)=>'<div><dt>'+caption(name)+'</dt><dd>'+htmlCode(value)+'</dd></div>';
  return '<section class="example-run" aria-labelledby="example-heading"><h3 id="example-heading">'+caption(q.exampleRuns.length===1?copy.example:copy.examples)+'</h3>'+
    (q.exampleContext?instruction(q.exampleContext):"")+q.exampleRuns.map(run=>'<dl class="example-io">'+
      (run.input===undefined?"":cell(copy.input,run.input))+cell(copy.output,run.output)+'</dl>').join("")+'</section>';
}
const flagButton=q=>'<button class="secondary" type="button" data-act="flag" aria-pressed="'+draft.flags.includes(q.id)+'">'+(draft.flags.includes(q.id)?"⚑ Flagged for review":"Flag for review")+'</button>';
const saveStatus=()=>version===savedVersion?"Saved to the test host":uploading?"Saving…":localWorks?"Saved on this device · waiting to sync":"Not yet saved to the host";
const alert=()=>'<p class="notice" id="notice" role="status">'+esc(warning)+'</p>';
function joinScreen(){
  return '<section class="card"><p class="eyebrow">YEAR '+className+' · TERM 1.2</p><h1>'+copy.welcome[0]+'</h1>'+support(copy.welcome)+
    '<p class="pill">'+word(copy.rules)+'</p><div id="entry-status" class="waiting-status" role="status"></div>'+
    '<ol class="waiting-steps">'+[copy.prepName,copy.prepStart].map(step=>'<li>'+instruction(step)+'</li>').join("")+'</ol>'+
    '<form id="join-form"><label class="field">Classroom name<input name="name" required maxlength="70" autocomplete="off" aria-describedby="entry-status"></label><button id="start-test" class="primary" disabled>Start test</button></form>'+
    '<div class="waiting-detail">'+instruction(copy.prepTimer)+'</div>'+alert()+'<div id="waiting-review" hidden></div></section>';
}
function updateEntry(){
  const status=el("entry-status"),button=el("start-test");
  if(!status||!button)return;
  const key=session?.status==="running"?"open":session?.status==="finished"?"ended":"waiting";
  if(status.dataset.state===key)return;
  status.dataset.state=key;status.innerHTML='<p><strong>'+esc(copy[key][0])+'</strong></p>'+support(copy[key]);
  button.disabled=key!=="open";
  const deck=el("waiting-review");
  const wasReading=deck?.contains(document.activeElement);
  if(deck)deck.hidden=key!=="waiting";
  if(wasReading&&key==="open")button.focus();
}
function receipt(){
  return '<section class="card"><p class="eyebrow">FORM '+esc(session.form)+' · YEAR '+esc(session.className)+'</p><h1>Submitted</h1>'+instruction(copy.receipt)+
     '<p>Receipt: <strong>'+esc(session.submitted.receipt)+'</strong></p><p class="muted">Your answers are locked. Your teacher will share results later.</p>'+
     (version!==savedVersion?'<p class="notice error">Some changes did not reach the host before submission. Tell your teacher and save the device copy.</p><button class="secondary" data-act="download">Save device copy</button>':'')+
     '</section>';
}
const currentOrder=q=>draft.answers[q.id]||"ABCDE".slice(0,q.blocks.length).split("");
function orderRows(q){
  const order=currentOrder(q);
  return order.map((l,i)=>'<li data-letter="'+l+'"><span class="block-grip" aria-hidden="true" title="Drag to move this block">⠿</span><span class="pill">'+l+'</span><code>'+esc(q.blocks[l.charCodeAt(0)-65])+'</code><div class="moves"><button class="secondary" data-act="move" data-index="'+i+'" data-delta="-1" aria-label="Move block '+l+' up" '+(!i?'disabled':'')+'>↑ Up</button><button class="secondary" data-act="move" data-index="'+i+'" data-delta="1" aria-label="Move block '+l+' down" '+(i===order.length-1?'disabled':'')+'>↓ Down</button></div></li>').join("");
}
function orderHtml(q){
  return '<h3 class="order-title" id="order-title">Arrange the code blocks</h3>'+instruction(copy.reorder)+
    '<ol class="order" id="order" aria-labelledby="order-title">'+orderRows(q)+'</ol>'+
    '<button class="secondary" data-act="keep-order">Save this order</button><p class="sr-only" id="order-status" role="status"></p>';
}
function putBlock(q,from,to){
  const list=el("order"), order=[...currentOrder(q)];
  if(!list||!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=order.length||to>=order.length||from===to)return false;
  const [letter]=order.splice(from,1);
  order.splice(to,0,letter);
  draft.answers[q.id]=order;edit();
  list.innerHTML=orderRows(q);
  const messages=["Block "+letter+" moved to position "+(to+1)+".","代码块 "+letter+" 已移到第 "+(to+1)+" 位。",letter+" 블록을 "+(to+1)+"번 위치로 옮겼습니다."];
  el("order-status").textContent=messages[language];
  return true;
}
function questionHtml(q){
  const common='<section class="card"><p class="eyebrow">'+groups[sectionId[q.kind]][0]+'</p>'+support(groups[sectionId[q.kind]])+
    '<div class="between"><h1 id="heading" tabindex="-1">Question '+q.id+' of 20</h1><span class="pill">'+q.marks+' '+(q.marks===1?"mark":"marks")+'</span></div>'+
    '<progress class="question-progress" max="20" value="'+q.id+'" aria-label="Question '+q.id+' of 20"></progress>'+
    '<h2>'+esc(q.prompt[0])+'</h2>'+support(q.prompt)+(q.kind!=="code"?instruction(copy[q.kind]):"")+(q.snippet?htmlCode(q.snippet):"");
  let body="";
  if(q.kind==="mc")body='<fieldset><legend>Answer</legend>'+q.options.map((v,i)=>{const l="ABCD"[i];return '<label class="option"><input type="radio" name="choice" value="'+l+'" '+(draft.answers[q.id]===l?"checked":"")+'><strong>'+l+'</strong> '+esc(v)+'</label>';}).join("")+'</fieldset>';
  if(q.kind==="blank")body='<label class="field">Your answer<input id="blank" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" maxlength="100" value="'+esc(draft.answers[q.id])+'"></label>';
  if(q.kind==="parsons")body=exampleHtml(q)+orderHtml(q);
  if(q.kind==="code")body='<section class="requirements" aria-labelledby="requirements-heading"><h3 id="requirements-heading">'+caption(copy.requirements)+'</h3><ul class="questions-list">'+q.instructions.map(s=>'<li>'+instruction(s)+'</li>').join("")+'</ul>'+(q.requirementNote?instruction(q.requirementNote):"")+'</section>'+exampleHtml(q)+
    '<p class="starter-label">Starter code · read only</p>'+htmlCode(q.starter)+instruction(copy.code)+
    '<label class="field">Your Python code<textarea id="editor" class="editor" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" maxlength="6000" placeholder="Type your code here">'+esc(draft.answers[q.id])+'</textarea></label>'+
    (q.sample?'<label class="field small-field">Test input<input id="test-input" inputmode="numeric" maxlength="30" value="'+esc(q.sample)+'"></label>':'')+
    '<div class="toolbar"><button class="secondary run-action" data-act="run">Run Python</button><button class="secondary" data-act="stop">Stop</button><button class="secondary" data-act="indent">Indent 4 spaces</button></div>'+
    '<div class="console"><span class="output-label">YOUR OUTPUT</span><pre id="run-output" role="status">Your output appears here.</pre></div>';
  return common+body+'<div class="action-footer between"><div class="toolbar">'+
    (q.id!=="1"?'<button class="secondary" data-go="'+(Number(q.id)-1)+'">Previous</button>':'')+flagButton(q)+
    '</div><button class="primary" data-go="'+(q.id==="20"||fromReview?"review":Number(q.id)+1)+'">'+(q.id==="20"||fromReview?"Review & submit":"Next question")+
    ' →</button></div><p class="muted" id="save-state" role="status">'+saveStatus()+'</p>'+alert()+'</section>';
}
function review(){
  const remaining=session.questions.filter(q=>!hasAnswer(q)).length;
  const attention=session.questions.filter(q=>!hasAnswer(q)||draft.flags.includes(q.id));
  const tiles=qs=>'<div class="review-list">'+qs.map(q=>'<button class="secondary'+(draft.flags.includes(q.id)?' flagged':'')+'" data-go="'+q.id+'">Q'+q.id+' · '+label(q)+'</button>').join("")+'</div>';
  return '<section class="card"><p class="eyebrow">FINAL CHECK</p><h1 id="heading" tabindex="-1">'+copy.review[0]+'</h1>'+support(copy.review)+instruction(copy.reviewHelp)+
    '<p><strong>'+remaining+' unanswered · '+draft.flags.length+' flagged</strong></p>'+(attention.length?tiles(attention):'<p>All questions have an answer.</p>')+
    '<details class="all-questions"><summary>Show all questions</summary>'+tiles(session.questions)+'</details>'+
    '<div class="toolbar"><button class="primary" data-act="submit">Submit my test</button></div>'+
    '<p id="save-state" class="muted" role="status">'+saveStatus()+'</p>'+alert()+'</section>';
}
function render(){
  cancelOrderDrag();
  const active=!!session?.questions&&!session.submitted;
  timer.hidden=!active;
  if(!classReady){main.innerHTML='<section class="card"><h1>Open your class link</h1><p>Use the full Year 8 Python Assessment link your teacher shared.</p></section>';return;}
  if(!session?.connected){
    const existing=el("join-form")?.elements.namedItem("name")?.value;
    main.innerHTML=joinScreen();if(existing)el("join-form").elements.namedItem("name").value=existing;
    window.Year8QuickReview.mount(el("waiting-review"),{lang:language,page:reviewPage,onPage:i=>{reviewPage=i;}});
    updateEntry();return;
  }
  if(session.submitted){main.innerHTML=receipt();return;}
  if(!active){main.innerHTML='<section class="card"><h1>Waiting for the questions</h1>'+instruction(copy.waiting)+alert()+'</section>';return;}
  main.innerHTML=question==="review"?review():questionHtml(session.questions.find(q=>q.id===question)||session.questions[0]);
  if(question==="1"&&!fromReview)el("heading").parentElement.insertAdjacentHTML("afterend",'<details class="all-questions"><summary>How to use this test</summary>'+instruction(copy.guide)+'</details>');
  tick();
}
function go(id){
  if(!session?.questions||session.submitted)return;
  if(id==="review")fromReview=false;
  else if(question==="review")fromReview=true;
  stopRun();question=id;saveLocal();render();el("heading")?.focus();window.scrollTo(0,0);
}
function edit(){
  if(!session?.questions||session.submitted||Date.now()+offset>=session.end)return;
  version++;saveLocal();
  const n=el("save-state");if(n)n.textContent=saveStatus();
  clearTimeout(timeout);timeout=setTimeout(()=>void sync(),550);
}
async function sync(submit=false){
  if(uploading||!session?.questions||session.submitted||conflicted||(!submit&&version===savedVersion))return;
  uploading=true;const sending=version;
  try{
    const r=await api(submit?"submit":"save",{form,rev:revision,draft});
    revision=r.rev;offset=r.serverTime-Date.now();
    if(r.accepted)savedVersion=sending;
    saveLocal();
    if(r.submitted){session.submitted=r.submitted;stopRun();if(version===savedVersion)try{localStorage.removeItem(localKey());}catch{} render();}
    else if(warning)note("");
  }catch(e){
    if(e.conflict){conflicted=true;note("Another tab saved this test first. Tell your teacher and keep this tab open.",true);}
    else note("Could not reach the host. Keep this tab open so saving can retry.",true);
  }finally{
    uploading=false;
    const n=el("save-state");if(n)n.textContent=saveStatus();
    if(sending!==version&&!conflicted)timeout=setTimeout(()=>void sync(),250);
  }
}
function tick(){
  if(session?.status!=="running"||session.submitted)return;
  const secs=Math.max(0,Math.ceil((session.end-Date.now()-offset)/1000));
  clock.textContent=Math.floor(secs/60)+":"+String(secs%60).padStart(2,"0");
  timer.classList.toggle("urgent",secs<=300);
  const warningText=secs===0?copy.timeUp[language]:secs<=300?copy.timeShort[language]:"";
  if(timerWarning.textContent!==warningText)timerWarning.textContent=warningText;
  if(secs===0&&session.questions){
    main.querySelectorAll("input,textarea,button:not([data-act=download])").forEach(n=>{n.disabled=true;});
    note("Time is up. Waiting for the host to confirm your submission.",false);
    if(Date.now()>=nextDeadlineCheck){nextDeadlineCheck=Date.now()+3000;void refresh();}
  }
}
function stopRun(){runGeneration++;runner?.stop();runner=null;}
async function run(){
  stopRun();const generation=runGeneration, output=el("run-output");
  if(!output)return; output.textContent="Running…";
  const q=session?.questions?.find(x=>x.id===question), data=el("test-input")?.value;
  const code=q.starter+"\n"+(draft.answers[question]||"");
  let asked=false;
  runner=runSprintPython(code,{input:()=>{
    if(data===undefined||asked)throw Error("No additional input is available.");
    asked=true;return data;
  }});
  const r=await runner.result;
  if(generation!==runGeneration)return;
  runner=null;output.textContent=[r.stdout,r.error].filter(Boolean).join("\n").trim()||"No output.";
}
function download(){
  const url=URL.createObjectURL(new Blob([JSON.stringify({attempt:session.id,form:session.form,draft},null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="Year8-device-copy-"+session.id+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
el("language").addEventListener("change",e=>{
  language=Number(e.target.value);try{localStorage.setItem("y8test-language",String(language));}catch{} stopRun();render();
});
main.addEventListener("submit",async e=>{
  if(e.target.id!=="join-form")return;e.preventDefault();
  const data=new FormData(e.target), b=e.target.querySelector("button");b.disabled=true;
  try{warning="";takeSession(await api("join",{form,name:data.get("name")}));}
  catch(e){note(e.message,true);}
  finally{b.disabled=false;}
});
main.addEventListener("input",e=>{
  const n=e.target;
  if(!session?.questions||session.submitted)return;
  if(n.name==="choice"||n.id==="blank"||n.id==="editor"){
    draft.answers[question]=n.value;edit();
  }
});
function clearDropMarker(d){
  d.marker?.classList.remove("drop-before","drop-after");d.marker=null;
}
function cancelOrderDrag(){
  if(!orderDrag)return;
  const d=orderDrag;orderDrag=null;
  clearDropMarker(d);d.row.classList.remove("drag-source");d.list.classList.remove("is-sorting");
  if(d.list.hasPointerCapture(d.id))d.list.releasePointerCapture(d.id);
}
const canReorder=()=>session?.status==="running"&&session.questions&&!session.submitted&&Date.now()+offset<session.end;
function dropSlot(d,x,y){
  const box=d.list.getBoundingClientRect();
  if(x<box.left-16||x>box.right+16||y<box.top-24||y>box.bottom+24)return -1;
  const slot=d.rows.findIndex(row=>{const rect=row.getBoundingClientRect();return y<(rect.top+rect.bottom)/2;});
  return slot===-1?d.rows.length:slot;
}
main.addEventListener("pointerdown",e=>{
  const row=e.target.closest("#order>li"), handle=e.target.closest(".block-grip");
  if(!row||!e.isPrimary||e.button!==0||!canReorder()||orderDrag||e.target.closest("button"))return;
  if(e.pointerType!=="mouse"&&!handle)return;
  const list=row.parentElement,rows=[...list.children];
  orderDrag={id:e.pointerId,question,list,rows,row,from:rows.indexOf(row),x:e.clientX,y:e.clientY,marker:null,active:false};
  list.setPointerCapture(e.pointerId);
});
main.addEventListener("pointermove",e=>{
  const d=orderDrag;
  if(d?.id!==e.pointerId)return;
  if(!canReorder()){cancelOrderDrag();return;}
  if(!d.active&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<5)return;
  if(!d.active){d.active=true;d.row.classList.add("drag-source");d.list.classList.add("is-sorting");}
  const slot=dropSlot(d,e.clientX,e.clientY);
  clearDropMarker(d);
  if(slot>-1){
    d.marker=d.rows[Math.min(slot,d.rows.length-1)];
    d.marker.classList.add(slot===d.rows.length?"drop-after":"drop-before");
  }
});
main.addEventListener("pointerup",e=>{
  const d=orderDrag;
  if(d?.id!==e.pointerId)return;
  const slot=d.active?dropSlot(d,e.clientX,e.clientY):-1;
  cancelOrderDrag();
  if(slot<0||d.question!==question||!canReorder())return;
  const q=session.questions.find(x=>x.id===question);
  putBlock(q,d.from,slot>d.from?slot-1:slot);
});
for(const type of ["pointercancel","lostpointercapture"]){
  main.addEventListener(type,e=>{if(orderDrag?.id===e.pointerId)cancelOrderDrag();});
}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&orderDrag)cancelOrderDrag();});
document.addEventListener("click",async e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.go)return go(b.dataset.go);
  const act=b.dataset.act;
  if(act==="download")return download();
  if(!session?.questions||session.submitted||Date.now()+offset>=session.end)return;
  const q=session.questions.find(x=>x.id===question);
  if(act==="flag"){
    draft.flags=draft.flags.includes(question)?draft.flags.filter(x=>x!==question):[...draft.flags,question];edit();
    b.setAttribute("aria-pressed",draft.flags.includes(question));b.textContent=draft.flags.includes(question)?"⚑ Flagged for review":"Flag for review";
  }
  if(act==="move"){
    const from=Number(b.dataset.index),delta=Number(b.dataset.delta),letter=currentOrder(q)[from];
    if(putBlock(q,from,from+delta)){
      const row=el("order").querySelector('[data-letter="'+letter+'"]');
      (row.querySelector('button[data-delta="'+delta+'"]:not(:disabled)')||row.querySelector("button:not(:disabled)"))?.focus();
    }
  }
  if(act==="keep-order"){
    draft.answers[question]=[...currentOrder(q)];edit();note("Order saved as your answer.");
  }
  if(act==="indent"){
    const box=el("editor");box.setRangeText("    ",box.selectionStart,box.selectionEnd,"end");
    box.dispatchEvent(new Event("input",{bubbles:true}));box.focus();
  }
  if(act==="run")void run();
  if(act==="stop"){stopRun();el("run-output").textContent="Stopped.";}
  if(act==="submit"){
    if(uploading){note("Saving your latest changes. Wait a moment, then select Submit my test again.");return;}
    if(await confirmAction("Submit your test? You won’t be able to change your answers.","Submit and lock")){
      if(uploading){note("Saving your latest changes. Wait a moment and try again.");return;}
      b.disabled=true;void sync(true).finally(()=>{b.disabled=false;});
    }
  }
});
window.addEventListener("online",()=>void refresh());
window.addEventListener("pagehide",saveLocal);
document.querySelector(".skip").addEventListener("click",event=>{
  event.preventDefault();
  main.focus();
});
if(classReady){void refresh();setInterval(()=>void refresh(),8000);setInterval(tick,500);}else render();
