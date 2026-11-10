"use strict";
const $=id=>document.getElementById(id), E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const KEY="y8-signal-sprint-20261111-v1";
const cfg=window.SPRINT_CONFIG||{};
const uid=()=>crypto.randomUUID?.()||"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const b=crypto.getRandomValues(new Uint8Array(1))[0]&15;return(c==="x"?b:(b&3)|8).toString(16);});
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,"0")).join("");
const fresh=()=>({lang:"en",id:uid(),token:token(),name:"",current:"intro",attempts:{},code:{},typing:{},refs:{},events:[],review:{count:0,n:0,last:null},plenary:false});
let canSave=true, data;
try{const raw=localStorage.getItem(KEY);data=raw?JSON.parse(raw):fresh();if(!data?.id||!data?.token)data=fresh();}catch{canSave=false;data=fresh();}
const tr=s=>typeof s==="object"&&s?s[data.lang]||s.en||"":s??"";
const TX={
 back:L("← Back","← 返回","← 이전"), next:L("Next →","下一张 →","다음 →"),
 start:L("Start Launch Pad →","开始打字 →","타이핑 시작 →"), tap:L("Tap one answer","选择一个答案","답을 하나 고르세요"),
 number:L("Type one number","输入一个数字","숫자 하나를 입력하세요"), check:L("Check","检查","확인"),
 lang:L("Language support","语言支持","언어 지원"),calm:L("Calm effects","减少动画","움직임 줄이기"),
 result:L("Your output","你的输出","내 출력"),ready:L("Run Python to see output here.","运行 Python 后，这里会显示结果。","Python을 실행하면 여기에 출력돼요."),
 passed:L("Correct.","正确。","맞았어요."),retry:L("Try again.","再试一次。","다시 시도하세요."),
 view:L("Task map","任务地图","과제 지도"), progress:L("Core attempted","已尝试的核心任务","시도한 핵심 과제"),
 run:L("Run Python","运行 Python","Python 실행"),stop:L("Stop","停止","정지"),checkwork:L("Check work","检查代码","코드 검사"),
 skip:L("Go to core tasks →","开始核心任务 →","핵심 과제로 →"),more:L("More practice","更多练习","더 연습하기"),
 enter:L("Enter","输入","입력"),student:L("Name or teacher-approved ID","姓名或老师指定的编号","이름 또는 선생님이 지정한 ID"),
 started:L("Started","已开始","시작함"),core:L("Core","核心","핵심"), extra:L("Extra practice","额外练习","추가 연습"),
};
const stages=[
 ["intro",L("Briefing","课堂简介","수업 안내"),"0–2 min"],["launch",L("Launch Pad","打字起点","타이핑 시작"),"2–5 min"],
 ["starter",L("Do Now","课前练习","시작 활동"),"5–9 min"],["learning",L("Types of Learning","学习类型","학습 유형"),"9–12 min"],
 ["one",L("Main Task 1 · Values","任务 1 · 变量值","주요 과제 1 · 값"),"12–26 min"],
 ["dash",L("Symbol Dash","符号冲刺","기호 달리기"),"26–29 min"],["two",L("Main Task 2 · Branches","任务 2 · 分支","주요 과제 2 · 분기"),"29–43 min"],
 ["pit",L("Learning Pit Stop","学习检查站","학습 점검"),"43–47 min"],["extra",L("Go Further","拓展挑战","심화 도전"),"47–53 min"],
 ["plenary",L("Plenary","课末小结","마무리 활동"),"53–57 min"],["review",L("Review game","复习游戏","복습 게임"),"57–60 min"]
];
const seq={}, all={}, groups={};
function add(id,stage,kind,props={}){const d={...props,id,stage,kind};all[id]=d;(seq[stage]??=[]).push(id);return id;}
function bank(prefix,stage,group,items,required=0){
 groups[group]=items.map((item,i)=>add(prefix+(i+1),stage,item.kind,{...item,group,order:i+1,required:i<required}));
}
add("intro","intro","intro");add("launch","launch","typing",{drills:[0,1,2]});
bank("starter-","starter","starter",starter,3);add("learning","learning","learning");
add("model-1","one","demo",demos[0]);bank("value-start-","one","warm1",warm1);bank("value-","one","task1",task1,5);
add("dash","dash","typing",{drills:[3,4]});
add("model-2","two","demo",demos[1]);bank("branch-start-","two","warm2",warm2);bank("branch-","two","task2",task2,4);
add("pit","pit","pit");bank("stretch-","extra","extensions",extensions);bank("exit-","plenary","plenary",plenary,3);add("review","review","review");
const coreIds=Object.values(all).filter(s=>s.required).map(s=>s.id);
let active="intro", drill=0, since=0, finishAt=0, typingClock, runJob=null, runEpoch=0, inputPending, out="", runStatus="";
let reviewUnlocked=!!data.plenary;
const visited=[]; let activeStart=Date.now();
const first=stage=>seq[stage][0];
const title=s=>tr(s.title)||(s.kind==="question"?tr(L("Read and decide","读一读，做选择","읽고 판단하기")):tr(stages.find(x=>x[0]===s.stage)?.[1]));
const msg=(en,zh,ko)=>tr(L(en,zh,ko));
const cap=(s,n=3000)=>String(s??"").slice(0,n);
function persist(){if(data.preview)return;try{localStorage.setItem(KEY,JSON.stringify(data));canSave=true;}catch{canSave=false;}}
function snapshot(){return {lang:data.lang,calm:!!data.calm,current:active,attempts:data.attempts,code:data.code,typing:data.typing,refs:data.refs,review:data.review,plenary:data.plenary};}
function event(kind,card,detail={},quiet=false){
 if(!data.name||data.preview)return;
 const item={id:uid(),card,kind,at:new Date().toISOString(),detail};
 if(quiet){
   for(let i=data.events.length-1;i>=0;i--){const e=data.events[i];if(e.kind===kind&&e.card===card&&e.detail.drill===detail.drill&&!window.SprintTracking?.inFlight?.(e.id)){data.events.splice(i,1);break;}}
 }
 data.events.push(item);persist();window.SprintTracking?.schedule();
}
function flag(id,correct,value){
 const last=data.attempts[id];data.attempts[id]={correct,value,n:(last?.n||0)+1};
 persist();event("answer",id,{value,correct,attempt:data.attempts[id].n});
}
const attempt=s=>data.attempts[s.id];
const art=name=>'<span class="art" aria-hidden="true"><img src="assets/mr-dave-'+name+'.png" alt=""></span>';
const button=(act,v,label,cls="secondary",more="")=>`<button type="button" class="${cls}" data-act="${act}" data-v="${E(v)}" ${more}>${E(tr(label))}</button>`;
const codeBlock=src=>`<pre class="code"><code>${E(src)}</code></pre>`;
const arrow='<svg class="arrow" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 12h24m-8-8 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const tile=(name,value,cls="")=>`<div class="tile ${cls}"><span class="tag">${E(tr(name))}</span><code>${E(value)}</code></div>`;
const help=s=>s?.zh&&data.lang==="en"?`<details class="translation"><summary>中文 · 한국어 <span>Language help</span></summary><p lang="zh">${E(s.zh)}</p><p lang="ko">${E(s.ko)}</p></details>`:"";
const say=text=>{$("announce").textContent=text;};
const teamPreview=new URLSearchParams(location.search).get("teacher")==="1";
const practiceOnly=new URLSearchParams(location.search).get("practice")==="1";
if(teamPreview){data=fresh();data.preview=true;reviewUnlocked=true;}
function route(s){
 const ids=seq[s.stage],i=ids.indexOf(s.id);
 const nextStage=stages[stages.findIndex(x=>x[0]===s.stage)+1]?.[0];
 if(s.id==="intro")return ["launch",TX.start];
 if(s.group==="warm1"||s.group==="warm2"){
   if(s.order===4||s.order===10)return [groups[s.group==="warm1"?"task1":"task2"][0],TX.skip];
 }
 if(s.id==="value-5")return ["dash",L("Continue to Symbol Dash →","继续符号冲刺 →","기호 달리기로 →")];
 if(s.id==="branch-4")return ["pit",L("Continue to Pit Stop →","进入学习检查站 →","학습 점검으로 →")];
 if(s.id==="exit-3")return ["review",L("Finish plenary → Review game","完成小结 → 复习游戏","마무리 완료 → 복습 게임")];
 return [ids[i+1]??(nextStage?first(nextStage):"intro"),TX.next];
}
function labelForGroup(g){return tr({warm1:L("Start Here · 10 quick cards","从这里开始 · 10 张卡","여기부터 · 카드 10개"),warm2:L("Start Here · 10 quick cards","从这里开始 · 10 张卡","여기부터 · 카드 10개"),task1:L("Main Task 1 · 15 tasks","任务 1 · 15 项","주요 과제 1 · 15개"),task2:L("Main Task 2 · 10 tasks","任务 2 · 10 项","주요 과제 2 · 10개"),extensions:L("Five challenges","五个挑战","도전 5개"),starter:L("Starter · 3 checks","课前 · 3 题","시작 · 3문항"),plenary:L("Plenary · 3 checks","小结 · 3 题","마무리 · 3문항")}[g]||"");}
function menu(s){
 const stageGroups=[...new Set(seq[s.stage].map(id=>all[id].group).filter(Boolean))];
 if(!stageGroups.length)return "";
 return `<section id="map" class="map" aria-label="${E(tr(TX.view))}">${stageGroups.map(g=>`<section><h2>${E(labelForGroup(g))} · ${groups[g].filter(id=>attempt(all[id])).length}/${groups[g].length} ${E(msg("attempted","已尝试","시도함"))}</h2><div class="map-grid">${groups[g].map(id=>{const v=all[id];return button("go",id,`${v.order}${attempt(v)?" ✓":""}`,"micro",`title="${E(title(v))}" aria-label="${E(labelForGroup(g)+" "+v.order+": "+title(v))}" ${id===active?'aria-current="step"':""}`);}).join("")}</div></section>`).join("")}</section>`;
}
function heading(s,name,sub,who){
 const stage=stages.find(x=>x[0]===s.stage);
 const label=s.group?labelForGroup(s.group)+" · "+s.order:tr(stage[1])+" · "+stage[2];
 return `<div class="card-head"><div><span class="label">${E(label)}</span><h1 id="card-title" tabindex="-1">${E(name)}</h1></div>${who?art(who):""}</div>${sub?`<p class="prompt">${E(tr(sub))}</p>${help(sub)}`:""}`;
}
function consoleBox(value=null){
 return `<section class="console"><span class="tag">${E(tr(TX.result))}</span><pre class="${value==null?"placeholder":""}">${E(value??tr(TX.ready))}</pre></section>`;
}
function visual(s,ok){
 const v=s.visual;if(!v)return "";
 if(v.kind==="syntax"){const parts=E(v.value).split("&quot;");return `<div class="syntax-hero"><code>${parts.join("<mark>&quot;</mark>")}</code></div>`;}
 if(v.kind==="store")return `<div class="flow">${tile(s.id==="value-start-2"?L("Name","名称","이름"):L("Before","之前","바꾸기 전"),v.before,"slot")}${arrow}${tile(L("Stored value","存储的值","저장된 값"),ok?v.after:"?",ok?"reveal":"slot blank")}</div>`;
 if(v.kind==="receive")return `<div class="flow">${tile(L("Keyboard input","键盘输入","키보드 입력"),s.id==="value-start-6"?"Trays?":"5")}${arrow}${tile(L("Value received","收到的值","받은 값"),ok?(s.id==="value-start-6"?"input()":'"5"'):"?",ok?"reveal":"blank")}</div>`;
 if(v.kind==="convert")return `<div class="flow three">${tile(L("Text","文本","문자열"),'"5"')}${arrow}${tile(L("Operation","操作","동작"),ok?"int()":"?",ok?"reveal":"blank")}${arrow}${tile(L("Whole number","整数","정수"),"5")}</div>`;
 if(v.kind==="output")return consoleBox(ok?v.value:msg("What appears here?","这里会显示什么？","여기에 무엇이 출력될까요?"));
 if(v.kind==="branch")return `<div class="flow">${tile(L("Entered","实际输入","입력값"),v.input)}${tile(L("Expected","要求输入","기대값"),"music")}</div>${!v.test?`<div class="branches">${["if","else"].map((b,i)=>`<div class="branch ${ok&&((v.input==="music")===!i)?"active":""}"><code>${b}</code> · ${E(i?msg("Doesn’t match","不匹配","일치하지 않음"):msg("Matches","匹配","일치함"))}${ok&&((v.input==="music")===!i)?`<p class="branch-result">✓ ${E(msg("This path runs","执行这条路径","이 경로가 실행됨"))}</p>`:""}</div>`).join("")}</div>`:""}`;
 if(v.kind==="boundary")return `<div class="boundary">${[5,6,7].map(n=>tile(n===6?L("Test value","测试值","테스트 값"):L("Neighbour","相邻值","인접 값"),ok?`${n} · ${(v.inclusive?n<=6:n<6)?"✓":"✗"}`:n,n===6?"selected":"")).join("")}</div>`;
 if(v.kind==="indent"&&ok)return v.fix?codeBlock('if code == "music":\n    print("Open")'):consoleBox("Done");
 return "";
}
function question(s){
 const a=attempt(s),ok=a?.correct, helpText=ok?s.why:s.hint;
 const options=s.options?`<p class="kbd-cue">${E(tr(TX.tap))}</p><div class="answers">${s.options.map((opt,i)=>button("answer",i,opt,"choice"+(a?.value===i?(ok?" good":" wrong"):""),'aria-pressed="'+(a?.value===i)+'"')).join("")}</div>`:`<form id="short-form"><label for="short" class="kbd-cue">${E(tr(TX.number))}</label><div class="answers"><input id="short" class="number-in" value="${E(data.refs[s.id]?.draft??(typeof a?.value==="string"?a.value:""))}" inputmode="numeric" maxlength="16"><button class="next" type="submit">${E(tr(TX.check))}</button></div></form>`;
 return heading(s,title(s),s.prompt,s.visual?.art?"point":null)+`<div class="visual">${s.source?codeBlock(s.source):""}${visual(s,ok)}</div>${options}<div class="result ${a&&!ok?"hint":""}" id="feedback">${a?`<strong>${E(tr(ok?TX.passed:TX.retry))}</strong> ${E(tr(helpText))}${help(helpText)}`:""}</div>`;
}
function intro(s){
 const focus=L("Follow a value. Follow a decision.","跟踪变量的值，跟踪程序的分支。","값을 따라가고 프로그램의 분기를 읽어요.");
 return heading(s,"Python Signal Sprint",focus,"point")+`<div class="brief-grid">
 <section><span class="tag">WAGBA</span><p>${E(msg("We are getting better at tracing values and predicting which path Python takes.","我们在练习跟踪变量值，并预测 Python 会走哪条分支。","값을 추적하고 Python이 어느 분기를 실행할지 예상하는 연습을 해요."))}</p></section>
 <section><span class="tag">${E(msg("Knowledge · Skills · Understanding","知识 · 技能 · 理解","지식 · 기술 · 이해"))}</span><p><strong>K</strong> · ${E(msg("Recognise assignment, comparison and data types.","识别赋值、比较和数据类型。","대입, 비교, 자료형을 구별해요."))}</p><p><strong>S</strong> · ${E(msg("Type, run and trace short Python programs.","输入、运行并跟踪短 Python 程序。","짧은 Python 프로그램을 입력하고 실행하며 추적해요."))}</p><p><strong>U</strong> · ${E(msg("Explain why a value or branch changes the output.","解释值或分支为何改变输出。","값이나 분기가 출력에 미치는 영향을 설명해요."))}</p></section>
 </div>${!data.name&&!data.preview?`<form id="join" class="join"><label for="student">${E(tr(TX.student))}</label><input id="student" maxlength="60" autocomplete="off" placeholder="Year 8T" value="${E(data.joinDraft||"")}"><p class="quick-note">${E(msg("Only enter your name or class ID here. Lesson responses, code and practice are visible to your teacher when school sync is available.","只输入姓名或班级编号。学校同步可用时，老师能查看本课答案、代码和练习。","이름이나 수업 ID만 입력하세요. 학교 동기화가 되면 선생님이 이 수업의 답, 코드, 연습을 볼 수 있어요."))}</p><button class="next">${E(tr(TX.start))}</button>${practiceOnly?button("go","launch",L("Practise without school sync","仅本机练习","동기화 없이 연습")):""}</form>`:""}`;
}
function reflect(s){
 const isPit=s.kind==="pit";
 const key=s.id;
 const prompts=isPit?[L("I can trace a value","我会跟踪变量值","값을 추적할 수 있어요"),L("I can fix a syntax mistake","我会修正语法错误","문법 오류를 고칠 수 있어요"),L("I can predict a branch","我会预测分支","분기를 예상할 수 있어요")]:[L("Recognise text and numbers","识别文本和数字","문자열과 숫자 구별"),L("Track a value as it changes","跟踪值的变化","값의 변화 추적"),L("Explain why output changes","说明输出为何改变","출력이 변하는 이유 설명")];
 const p=isPit?L("Try this without running. Which value does the code display? Then record what you can now do.","先不运行。这段代码输出哪个值？再记录你现在会做什么。","실행하기 전에 어떤 값이 출력될지 고르세요. 이제 할 수 있는 것도 기록하세요."):L("Use an answer from Do Now to choose one goal to practise today.","根据课前练习的答案，选择今天想练习的目标。","시작 활동의 답을 보고 오늘 연습할 목표를 하나 고르세요.");
 const a=data.refs[key]||{};
 const phaseOptions=[
 L("New learning · I can do a new step with a little help.","新学习 · 我可以在少量帮助下完成一个新步骤。","새로운 학습 · 약간의 도움을 받아 새 단계를 할 수 있어요."),
 L("Consolidating · I did this before and I’m getting better.","巩固 · 我做过，现在更熟练了。","다지기 · 해 본 적이 있고 점점 더 잘해요."),
 L("Treading water · I can do this; I’m ready for a harder task.","原地踏步 · 我已经会了，可以试更难的任务。","제자리 · 이미 할 수 있어요. 더 어려운 과제를 하고 싶어요."),
 L("Need help · I’m stuck and want to see another example.","需要帮助 · 我卡住了，想再看一个示例。","도움 필요 · 막혔어요. 예시를 하나 더 보고 싶어요.")
 ];
 return heading(s,title(s),p,isPit?"celebrate":"point")+`${isPit?`<div class="visual">${codeBlock("pins = 8\npins = pins - 2\nprint(pins)")}</div><div class="answers">${["8","6","2"].map(v=>button("pit-answer",v,v,"choice",`aria-pressed="${a.check===v}"`)).join("")}</div>${a.check?`<p class="result ${a.check!=="6"?"hint":""}">${E(a.check==="6"?msg("Correct: subtract 2 before printing.","正确：先减 2，再输出。","맞아요. 2를 뺀 뒤 출력해요."):msg("Check the second line.","检查第二行。","두 번째 줄을 확인하세요."))}</p>`:""}`:""}<div class="goal-list">${prompts.map((v,i)=>button("goal",i,v,"choice",`aria-pressed="${a.goal===i}"`)).join("")}</div>${isPit?`<p class="kbd-cue">${E(msg("Choose the phase that fits your evidence today.","选择与你今天的表现最符合的阶段。","오늘의 증거와 가장 잘 맞는 단계를 고르세요."))}</p><div class="goal-list phases">${phaseOptions.map((v,i)=>button("phase",i,v,"choice",`aria-pressed="${a.phase===i}"`)).join("")}</div>`:""}<label class="kbd-cue" for="reflection">${E(isPit?msg("My evidence is… (a word or short phrase)","我的证据是……（一个词或短语）","내 증거는… (한 단어나 짧은 구절)"):msg("My next step is… (a word or short phrase)","我的下一步是……（一个词或短语）","내 다음 단계는… (한 단어나 짧은 구절)"))}</label><textarea id="reflection" rows="2" maxlength="500" class="typebox">${E(a.text||"")}</textarea>`;
}
function lab(s){
 const demo=s.kind==="demo";
 const expected=s.tests?.[0];
 const model=demo?`<section class="demo-model"><p class="tag">${E(msg("Model · Type this program","示例 · 输入此程序","예시 · 이 프로그램을 입력하세요"))}</p>${codeBlock(s.starter)}<p class="quick-note">${E(msg("Copy by typing. Press Run Python, then type your test input at the prompt.","请自己输入。按运行 Python，再在提示后输入测试值。","직접 입력하세요. Python 실행을 누른 뒤 프롬프트에 테스트 값을 입력하세요."))}</p></section>`:"";
 return heading(s,title(s),s.prompt,s.id==="value-1"?"point":null)+model+`<div class="lab-layout"><section class="lab-main">
 <label class="kbd-cue" for="editor">1 · ${E(msg("Type Python here","在此输入 Python","여기에 Python 입력"))}</label>
 <textarea id="editor" class="editor-input" rows="8" maxlength="5000" spellcheck="false" autocapitalize="off" autocorrect="off">${E(data.code[s.id]??(demo&&!data.preview?"":s.starter))}</textarea>
 <div class="actions lab-actions">${button("run","",`2 · ${tr(TX.run)}`,"next")}${button("stop","",TX.stop,"secondary","disabled")}${button("indent","",L("+ 4 spaces","+ 4 个空格","+ 공백 4개"),"micro")}${!demo?button("check-code","",TX.checkwork):""}</div>
 <section class="console lab-console" aria-label="${E(tr(TX.result))}"><span class="tag">3 · ${E(tr(TX.result))}</span><pre id="console-output">${E(out||tr(TX.ready))}</pre><form id="console-input" hidden></form></section>
 <div class="result" id="run-status">${E(runStatus||((attempt(s)?.correct)?msg("Sample checks matched.","样例测试通过。","예시 테스트와 일치했어요."):""))}</div>
 </section><aside class="lab-notes">${expected?`<section class="sample"><span class="tag">${E(msg("Expected sample","预期示例","예상 예시"))}</span>${expected.input.length?`<p>${E(msg("Input","输入","입력"))}: <code>${E(expected.input.join(", "))}</code></p>`:""}<pre>${E(expected.output.join("\n"))}</pre></section>`:""}
 ${s.reference?`<details class="translation"><summary>${E(msg(demo?"Teacher cue":"Different example","示范提示","다른 예시"))}</summary>${typeof s.reference==="string"?codeBlock(s.reference):`<p>${E(tr(s.reference))}</p>`}</details>`:""}
 ${s.hint?`<details class="translation" id="hint-details"><summary>${E(msg("Show one hint","显示一个提示","힌트 하나 보기"))}</summary><p>${E(tr(s.hint))}</p></details>`:""}</aside></div>`;
}
function typingView(s){
 if(!s.drills.includes(drill))drill=s.drills[0];
 const d=drills[drill];
 const p=L("Type the example exactly. Press Enter for a new line.","照着例子准确输入。按回车换行。","예시를 그대로 입력하세요. Enter로 줄을 바꾸세요.");
 const spec=d.indent?L("Dots show four spaces before print. Type spaces, not dots.","圆点表示 print 前的四个空格。输入空格，不要输入圆点。","점은 print 앞의 공백 네 개예요. 점 대신 공백을 입력하세요."):null;
 return heading(s,title(s),p)+`<div class="actions">${s.drills.map(i=>button("drill",i,drills[i].title,"chip",`aria-pressed="${i===drill}"`)).join("")}</div>${spec?`<p class="kbd-cue">${E(tr(spec))}</p>${help(spec)}`:""}
 <div class="runway" aria-hidden="true"><div class="racer">${art("run")}</div><div class="track"><span id="track"></span></div></div>
 <pre id="type-target" class="typing-target" aria-label="${E(msg("Text to copy","要输入的文本","따라 쓸 문장"))}"></pre>
 <label for="typing-box" class="kbd-cue">${E(msg("Type here · typing only","在此输入 · 只练打字","여기에 입력 · 타이핑만"))}</label>
 <textarea id="typing-box" rows="3" class="typebox" maxlength="240" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="off">${E(data.typing[drill]?.value||"")}</textarea>
 <div class="actions">${d.indent?button("indent","",L("Insert 4 spaces","插入 4 个空格","공백 4개 넣기"),"micro"):""}${button("type-reset","",L("Try again","重试","다시 하기"))}</div>
 <div class="stats" id="stats"><div><output id="wpm">—</output><span class="tag">WPM</span></div><div><output id="accuracy">—</output><span class="tag">${E(msg("Accuracy","准确率","정확도"))}</span></div><div><output id="matched">0</output><span class="tag">${E(msg("Matched","已匹配","일치한 글자"))}</span></div></div>
 <p id="type-note" class="quick-note"></p>`;
}
function reviewView(s){
 const r=data.review,i=r.n%review.length,row=review[i], rr=reviewChoices[i]||row[1], l=reviewLocal[i];
 const ask=L(row[0],l.zh,l.ko), complete=r.count>=30;
 const gameLinks=[
  [cfg.blooketUrl,msg("Blooket homework","Blooket 作业","Blooket 과제")],
  [cfg.gimkitAssignmentUrl,msg("Gimkit · Don’t Look Down","Gimkit · 别往下看","Gimkit · 아래를 보지 마세요")],
  [cfg.gimkitAssignmentUrl?"":cfg.gimkitPracticeUrl,msg("Gimkit practice","Gimkit 练习","Gimkit 연습")]
 ].filter(([url])=>typeof url==="string"&&url.startsWith("https://"));
 const games=gameLinks.length?`<section class="review-games" aria-label="${E(msg("External review games","外部复习游戏","외부 복습 게임"))}"><h2>${E(msg("Play the same questions in a review game","在复习游戏中练习同一组问题","복습 게임에서 같은 문제를 풀어 보세요"))}</h2><div class="actions">${gameLinks.map(([url,label])=>`<a class="secondary external" href="${E(url)}" target="_blank" rel="noopener noreferrer">${E(label)} ↗</a>`).join("")}</div><p class="quick-note">${E(msg("Scores in external games do not count towards the 30 below.","外部游戏的成绩不计入下方 30 题目标。","외부 게임 점수는 아래 30개 목표에 합산되지 않아요."))}</p></section>`:"";
 return heading(s,msg("Review relay","复习接力","복습 릴레이"),L("15 questions in the bank. Answer 30 correctly to finish. Questions repeat as you practise.","共 15 道题，答对 30 次完成。练习中题目会重复。","문제는 15개이며 30개를 맞히면 완료예요. 연습하면서 문제가 반복돼요."),"celebrate")+games+`<div class="review-meter"><progress value="${r.count}" max="30">${r.count} / 30</progress><strong>${r.count} / 30 ${E(msg("correct","答对","정답"))}</strong></div>
 ${complete?`<p class="result">✓ ${E(msg("Review complete. You reached 30 correct answers!","复习完成。你已答对 30 次！","복습 완료! 30개를 맞혔어요!"))}</p>`:`<p class="tag">${i+1} / 15</p><h2>${E(tr(ask))}</h2>${help(ask)}<div class="answers">${rr.map((x,k)=>button("review-answer",k,x,"choice",r.last!=null?"disabled":"")).join("")}</div>${r.last!=null?`<div class="result ${r.last?"":"hint"}">${E(r.last?tr(TX.passed):msg("Not quite. Correct answer: ","正确答案：","정답: ")+tr(rr[row[2]]))}</div>${button("review-next","",TX.next,"next")}`:""}`}
 `;
}
function render(){
 const s=all[active];
 clearInterval(typingClock);
 const contents=s.kind==="intro"?intro(s):s.kind==="question"?question(s):s.kind==="code"||s.kind==="demo"?lab(s):s.kind==="typing"?typingView(s):s.kind==="review"?reviewView(s):reflect(s);
 const [next,nextLabel]=route(s);
 const special=s.group==="warm1"&&s.order===4?"value-start-5":s.group==="warm2"&&s.order===4?"branch-start-5":s.id==="value-5"?"value-6":s.id==="branch-4"?"branch-5":null;
 const haveBack=visited.length>0;
 const moreDrills=s.kind==="typing"&&drill<s.drills.at(-1);
 const primary=moreDrills?button("drill",drill+1,L("Next typing round →","下一轮 →","다음 라운드 →"),"next"):button("go",next,nextLabel,"next");
 $("card").innerHTML=`<article class="card">${contents}${s.kind!=="review"&&!(s.kind==="intro"&&!data.name&&!data.preview)?`<div class="bottom">${haveBack?button("back","",TX.back):"<span></span>"}<div class="actions">${special?button("go",special,TX.more):""}${moreDrills?button("go",next,L("Finish typing for now","结束本轮打字","타이핑 마치기")):""}${primary}</div></div>`:s.kind==="review"&&haveBack?`<div class="bottom">${button("back","",TX.back)}</div>`:""}${menu(s)}</article>`;
 $("nav").innerHTML=stages.map(([id,label,t],i)=>`<button class="nav-btn" type="button" data-act="go" data-v="${first(id)}" ${id===s.stage?'aria-current="step"':""} ${((id==="review"&&!reviewUnlocked)||(id!=="intro"&&!data.name&&!data.preview&&!practiceOnly))?"disabled":""}><span>${String(i+1).padStart(2,"0")}</span><span>${E(tr(label))}<small>${t}</small></span></button>`).join("");
 const done=coreIds.filter(id=>data.attempts[id]).length;
 $("progress").textContent=`${done}/${coreIds.length}`;
 $("nav-label").textContent=tr(TX.progress);
 $("lang-label").textContent=tr(TX.lang);$("calm-label").textContent=tr(TX.calm);
 $("lang").value=data.lang;document.documentElement.lang=data.lang==="zh"?"zh-Hans":data.lang;
 $("hint-details")?.addEventListener("toggle",e=>{if(e.currentTarget.open)event("hint",active);});
 if(s.kind==="typing"){
   const saved=data.typing[drill];since=saved?.value?Date.now()-(saved.elapsed||0):0;finishAt=saved?.done?Date.now():0;
   $("typing-box").addEventListener("paste",e=>{e.preventDefault();say(msg("Type it yourself for this practice.","请自己输入。","직접 입력하는 연습이에요."));});
   showTyping(false);typingClock=setInterval(()=>{if(since&&!finishAt)showTyping(false);},550);
 }
 saveStatus();
}
function saveStatus(){
 const el=$("save-status");if(!el)return;
 const line=data.preview?msg("Teacher preview · nothing sent","老师预览 · 不发送","교사 미리 보기 · 전송 안 함"):!canSave?msg("Browser storage unavailable","浏览器存储不可用","브라우저에 저장할 수 없음"):msg("Saved on this device","已保存在本设备","이 기기에 저장됨");
 const c=window.SprintTracking?.status||"";
 el.innerHTML=`${E(line)}${c?`<br>${E(c)} ${button("sync","",L("Reconnect","重新连接","다시 연결"),"micro")}`:!data.name&&!data.preview&&active!=="intro"?`<br><a href="#intro">${E(msg("Enter your name to sync","输入姓名以同步","이름을 입력해 동기화"))}</a>`:""}`;
}
function go(id,history=true){
 if(!all[id]||id==="review"&&!reviewUnlocked||id!=="intro"&&!data.name&&!data.preview&&!practiceOnly)return;
 if(id===active)return;
 event("navigate",active,{to:id,seconds:Math.round((Date.now()-activeStart)/1000)});
 if(history)visited.push(active);
 stopProgram();out=runStatus="";activeStart=Date.now();
 active=id;data.current=id;persist();try{window.history.replaceState(null,"","#"+id);}catch{}
 render();$("card-title")?.focus({preventScroll:true});$("card").scrollIntoView({block:"start",behavior:"instant"});
}
function setChoice(v){
 const s=all[active],correct=v===s.answer;
 flag(s.id,correct,v);render();say(tr(correct?TX.passed:TX.retry)+" "+tr(correct?s.why:s.hint));
 const control=[...$("card").querySelectorAll('[data-act="answer"]')].find(x=>Number(x.dataset.v)===v)||$("short");control?.focus({preventScroll:true});
}
function showTyping(record){
 const field=$("typing-box");if(!field)return;
 const d=drills[drill],value=field.value,src=d.src;
 if(value.length&&!since)since=Date.now();
 const done=value===src, just=done&&!finishAt;
 if(just)finishAt=Date.now();if(!done)finishAt=0;
 let n=0,leading=true;
 $("type-target").innerHTML=Array.from(src,(c,i)=>{
   const cls=i<value.length?(c===value[i]?(n++,"ok"):"miss"):i===value.length?"current":"";
   if(c==="\n"){leading=true;return `<span class="char ${cls}">↵</span>\n`;}
   const mark=d.indent&&leading&&c===" ";if(c!==" ")leading=false;
   return `<span class="char ${cls}">${mark?"·":E(c)}</span>`;
 }).join("");
 const elapsed=since?Math.max(1000,(finishAt||Date.now())-since):0, wpm=elapsed>=1200||done?Math.round(n*12000/Math.max(elapsed,1000)):0, acc=value.length?Math.round(n/value.length*100):null;
 $("track").style.width=`${100*n/src.length}%`;document.querySelector(".racer .art").style.left=`calc(${100*n/src.length}% - ${59*n/src.length}px)`;
 $("wpm").textContent=wpm||"—";$("accuracy").textContent=acc==null?"—":acc+"%";$("matched").textContent=`${n} / ${src.length}`;
 $("stats").classList.toggle("complete",done);
 const best=Math.max(data.typing[drill]?.best||0,done?wpm:0);
 $("type-note").textContent=done?msg("✓ Exact match. Personal best: ","✓ 完全匹配。个人最佳：","✓ 정확히 입력했어요. 개인 최고: ")+best+" WPM":msg("Accuracy first. WPM does not affect progress.","准确优先。速度不影响进度。","정확도가 먼저예요. 속도는 진행에 영향을 주지 않아요.");
 if(record){data.typing[drill]={value,elapsed,wpm,acc,done,best};persist();event(just?"typing-complete":"typing-draft",active,{drill,value,wpm,accuracy:acc,matched:n},!just);if(just)say($("type-note").textContent);}
}
function output(t){out+=t;if($("console-output"))$("console-output").textContent=out;}
function setStatus(s){runStatus=s;if($("run-status"))$("run-status").textContent=s;say(s);}
function controls(busy){for(const b of document.querySelectorAll('[data-act="run"],[data-act="check-code"]'))b.disabled=busy;const b=document.querySelector('[data-act="stop"]');if(b)b.disabled=!busy;}
function stopProgram(){runEpoch++;runJob?.stop();runJob=null;inputPending?.reject(Error("Stopped"));inputPending=null;if($("console-input"))$("console-input").hidden=true;controls(false);}
function ask(prompt,inputs){
 return new Promise((resolve,reject)=>{
   const form=$("console-input");
   if(!form){reject(Error("Console is closed."));return;}
   inputPending={resolve,reject,inputs,prompt};
   form.innerHTML=`<label for="stdin"><span class="sr-only">${E(msg("Console input","终端输入","콘솔 입력"))}</span><code aria-hidden="true">${E(prompt)}</code></label><input id="stdin" maxlength="200" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><button class="secondary" type="submit">${E(tr(TX.enter))}</button>`;
   form.hidden=false;$("stdin").focus();
 });
}
async function run(check=false){
 if(runJob)return;
 const s=all[active],value=$("editor")?.value;
 if(value===undefined)return;
 data.code[s.id]=value;persist();out="";$("console-output").textContent="";controls(true);
 const epoch=++runEpoch;
 const inputs=[];
 event(check?"check-start":"run-start",s.id,{code:cap(value,5000)});
 const execute=(code,io)=>{runJob=runSprintPython(code,io);return runJob.result;};
 const input=prompt=>ask(prompt,inputs);
 const status=msg(check?"Checking sample runs…":"Running…",check?"正在检查样例…":"正在运行…",check?"예시를 검사하는 중…":"실행 중…");
 setStatus(status);
 if(!check){
   const result=await execute(value,{input,output});
   if(epoch!==runEpoch)return;
   runJob=null;controls(false);$("console-input").hidden=true;
   setStatus(result.error||msg("Run finished. Compare your output with the sample.","运行完成。对照输出示例。","실행이 끝났어요. 예시와 출력을 비교하세요."));
   if(result.error)output("\n"+result.error);
   if(!data.attempts[s.id])data.attempts[s.id]={correct:false,value:"run",n:1};persist();
   event("run",s.id,{code:cap(value,5000),input:inputs,output:cap(result.stdout),error:result.error});
   return;
 }
 const outcomes=[];
 for(const test of s.tests){
   let i=0;
   const result=await execute(value,{input:()=>{if(i>=test.input.length)throw Error("Unexpected input prompt.");return test.input[i++];}});
   if(epoch!==runEpoch)return;
   const lines=result.stdout.trim().split(/\r?\n/).map(x=>x.trim());
   outcomes.push({ok:!result.error&&i===test.input.length&&JSON.stringify(lines)===JSON.stringify(test.output),output:cap(result.stdout,600),error:result.error,input:test.input});
 }
 runJob=null;controls(false);
 const match=outcomes.filter(x=>x.ok).length,needsOperator=s.id==="stretch-4"&&!/^\s*if\s+[^#\n]+!=[^#\n]+:/m.test(value),correct=match===outcomes.length&&!needsOperator;
 $("console-output").textContent=outcomes.map((x,i)=>`${i+1}. ${x.ok?"✓":"–"} ${x.error||x.output.trim()||"(no output)"}`).join("\n");
 setStatus(correct?msg("All sample outputs matched. Try a new input to be sure.","所有样例输出都匹配。再试一个新输入。","모든 예시 출력이 일치해요. 새로운 입력값도 시험해 보세요."):needsOperator?msg("Use != on the if line and swap the messages.","在 if 行使用 !=，再交换两条消息。","if 줄에서 !=를 쓰고 두 메시지를 바꿔요."):msg("Compare the sample with your output. Then change one thing and try again.","比较样例和你的输出。改一处后再试。","예시와 출력을 비교한 뒤 한 곳을 바꾸고 다시 시도하세요."));
 data.attempts[s.id]={correct,value:"checked",n:(data.attempts[s.id]?.n||0)+1};persist();event("code-check",s.id,{code:cap(value,5000),correct,outcomes});
}
document.addEventListener("input",e=>{
 const id=e.target.id;
 if(id==="editor"){data.code[active]=e.target.value;persist();event("code-draft",active,{code:cap(e.target.value,5000)},true);}
 if(id==="typing-box")showTyping(true);
 if(id==="reflection"){(data.refs[active]??={}).text=e.target.value;persist();event("reflection-draft",active,{text:e.target.value},true);}
 if(id==="short"){(data.refs[active]??={}).draft=e.target.value;persist();event("short-draft",active,{value:e.target.value},true);}
 if(id==="stdin"){(data.refs[active]??={}).consoleDraft=e.target.value;persist();event("console-draft",active,{value:e.target.value},true);}
 if(id==="student"){e.target.setCustomValidity("");data.joinDraft=e.target.value;persist();}
});
document.addEventListener("submit",e=>{
 const id=e.target.id;if(!["join","short-form","console-input"].includes(id))return;e.preventDefault();
 if(id==="join"){
   const name=$("student").value.trim();
   if(name.length<2){$("student").setCustomValidity(msg("Enter at least two characters.","至少输入两个字符。","두 글자 이상 입력하세요."));$("student").reportValidity();return;}
   data.name=name.replace(/[\u0000-\u001f\u007f]/g," ");delete data.joinDraft;persist();event("join","intro",{language:data.lang});go("launch");return;
 }
 if(id==="short-form"){const value=$("short").value.trim().replace(/[０-９]/g,c=>String(c.charCodeAt(0)-65296));if(value)setChoice(value);else say(tr(TX.number));return;}
 if(id==="console-input"&&inputPending){
   const v=$("stdin").value;output(inputPending.prompt+v+"\n");inputPending.inputs.push(v);if(data.refs[active])delete data.refs[active].consoleDraft;event("console-input",active,{value:cap(v,200)});
   const f=inputPending;inputPending=null;e.target.hidden=true;f.resolve(v);
 }
});
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-act]");if(!b)return;
 const act=b.dataset.act,v=b.dataset.v,s=all[active];
 if(act==="go"){
   if(active==="exit-3"&&v==="review"){
     const missing=groups.plenary.find(id=>!data.attempts[id]);
     if(missing&&!data.preview){go(missing);const note=$("feedback");note.classList.add("hint");note.textContent=msg("Try each plenary question to open the review. You don’t need every answer right.","尝试回答每道小结题后即可复习，不要求全对。","마무리 문제를 모두 시도하면 복습이 열려요. 모두 맞힐 필요는 없어요.");return;}
     reviewUnlocked=data.plenary=true;persist();event("plenary-finish",active);
   }
   go(v);
 }
 if(act==="back"){const prev=visited.pop();if(prev)go(prev,false);}
 if(act==="answer")setChoice(Number(v));
 if(act==="goal"||act==="pit-answer"||act==="phase"){
   const r=data.refs[active]??={};r[act==="goal"?"goal":act==="phase"?"phase":"check"]=act==="pit-answer"?v:Number(v);
   persist();event(act,active,{value:v});render();
 }
 if(act==="drill"){drill=Number(v);render();$("typing-box")?.focus({preventScroll:true});}
 if(act==="type-reset"){const old=data.typing[drill];data.typing[drill]={best:old?.best||0};persist();event("typing-reset",active,{drill});render();$("typing-box")?.focus();}
 if(act==="indent"){
   const ed=$("typing-box")||$("editor");if(!ed)return;
   ed.setRangeText("    ",ed.selectionStart,ed.selectionEnd,"end");ed.focus();ed.dispatchEvent(new Event("input",{bubbles:true}));
 }
 if(act==="run")run();
 if(act==="check-code")run(true);
 if(act==="stop"){stopProgram();setStatus(msg("Program stopped.","程序已停止。","프로그램을 멈췄어요."));event("stop",active);}
 if(act==="review-answer"){
   const r=data.review;if(r.last!==null||r.count>=30)return;
   const i=r.n%review.length;r.last=Number(v)===review[i][2];if(r.last)r.count++;
   persist();event("review-answer","review",{question:i+1,value:Number(v),correct:r.last,correctTotal:r.count});render();
 }
 if(act==="review-next"){data.review.n++;data.review.last=null;persist();render();}
 if(act==="sync")window.SprintTracking?.flush(true);
});
$("lang").addEventListener("change",e=>{
 if(runJob)stopProgram();
 data.lang=e.target.value;persist();event("language",active,{value:data.lang});render();
});
$("calm").addEventListener("change",e=>{document.body.classList.toggle("calm-effects",e.target.checked);data.calm=e.target.checked;persist();event("calm-effects",active,{value:data.calm});});
$("calm").checked=!!data.calm;document.body.classList.toggle("calm-effects",!!data.calm);
addEventListener("hashchange",()=>{const v=location.hash.slice(1);if(all[v])go(v);});
const initial=location.hash.slice(1)||data.current;
if(all[initial]&&(initial!=="review"||reviewUnlocked)&&(data.name||data.preview||practiceOnly))active=initial;
window.SprintLesson={get:()=>data,snapshot,persist,status:saveStatus,catalog:()=>Object.values(all).map(s=>({id:s.id,title:s.title?.en||s.prompt?.en||s.stage,stage:s.stage,group:s.group,order:s.order,kind:s.kind,options:s.options?.map(x=>x.en||x)}))};
render();
