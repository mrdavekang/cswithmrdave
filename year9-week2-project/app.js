const STAGES=[
  {id:"starter",title:"Case file",core:true},
  {id:"brief",title:"Big job",core:true},
  {id:"model",title:"Jobs + IPO",core:true},
  {id:"algorithm",title:"Build + trace",core:true},
  {id:"extension",title:"Level-up",core:false},
  {id:"plenary",title:"Exit check",core:true},
  {id:"review",title:"Report",core:false}
];

const REQUIRED={
  starter:["starterTool","starterIgnore","clueUrgency","clueReward","clueLink","clueSignIn","clueTime","clueNotebook"],
  brief:["briefUser","briefNeed","briefLimit","reqAsk","reqScore","reqExplain","successCriterion","briefSequenceA","briefSequenceB","briefSequenceC"],
  model:["jobFirst","jobSecond","jobThird","jobLast","ipoClass1","ipoClass2","ipoClass3","ipoClass4","ipoClass5","ipoClass6","ipoClass7","ipoClass8","ipoClass9","ipoClass10","ipoClass11","ipoClass12","ipoClass13","ipoClass14"],
  algorithm:["sampleBPurpose","sampleBScore","sampleBOutput","sampleBDescription","sampleCMaybe","sampleCStop","sampleCInput","sampleCDescription","pseudoStart","pseudoInput","pseudoDecision","pseudoUpdate","pseudoOutput","ownPseudoDescription","algoOrder1a","algoOrder1b","algoOrder1c","algoValidationNext","algoOutputOrder","tracePredictionScore","tracePredictionLevel","traceReflection","peerName","peerCase","peerScore","peerLevel"],
  plenary:["plenaryAO1","plenaryAO2","plenaryAO3","nextTarget"]
};

const CHECKS_REQUIRED={starter:["starter","clues"],brief:["brief","briefSequences"],model:["jobs","ipo"],algorithm:["pseudoReading","pseudo","algoSequences","trace","peer"],plenary:["plenary"]};
const DEFAULT_STATE={studentName:"",studentClass:"",current:"starter",completed:{},responses:{},checks:{},updated:null};
const STUDENT_KEY="y9-t1-w2-scam-detective-guided-v4";
const TEACHER_KEY="y9-t1-w2-scam-detective-guided-teacher-v4";
let teacherMode=new URLSearchParams(location.search).get("teacher")==="1";
let storageKey=teacherMode?TEACHER_KEY:STUDENT_KEY;
let state=loadState(storageKey);
let evidenceImage="";
let traceStep=0;
let traceHistory=[];
let saveTimer;
let pythonRunning=false;
const PYTHON_STARTER=`# Scam Detective — Creator Mode
# Build one small working version, then improve it.

concern = 0

# TIP: collect your first YES/NO answer here

# TIP: use an if statement to update concern

# Finish by displaying a level and a safe next step
print("Concern score:", concern)
`;

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
function clone(value){return JSON.parse(JSON.stringify(value))}
const clean=value=>typeof value==="string"?value.trim():value;
const safe=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
const slug=value=>String(value||"student").replace(/[^a-z0-9]+/gi,"_").replace(/^_|_$/g,"");

function loadState(key){try{return {...clone(DEFAULT_STATE),...JSON.parse(localStorage.getItem(key)||"{}")}}catch{return clone(DEFAULT_STATE)}}
function store(){
  state.updated=new Date().toISOString();
  try{localStorage.setItem(storageKey,JSON.stringify(state));if($("#save-status"))$("#save-status").textContent="Saved locally"}catch{if($("#save-status"))$("#save-status").textContent="Could not save"}
  renderProgress();
}
function queueStore(){if($("#save-status"))$("#save-status").textContent="Saving…";clearTimeout(saveTimer);saveTimer=setTimeout(store,220)}
function hasSavedStudent(){return Boolean(state.studentName&&state.studentClass)}

function populateEntry(){
  if(hasSavedStudent()){
    $("#resume-button").classList.remove("hidden");
    $("#resume-button").textContent=`Resume ${state.studentName}'s saved work`;
  }
}
populateEntry();

$("#entry-form").addEventListener("submit",event=>{
  event.preventDefault();
  const name=$("#student-name").value.trim();
  const group=$("#student-class").value.trim();
  if(name.toLowerCase()==="teacher"){
    teacherMode=true;storageKey=TEACHER_KEY;state=loadState(storageKey);
    state.studentName="Teacher Preview";state.studentClass=group||"Year 9";state.current=state.current||"starter";
    store();startApp();return;
  }
  if(!name||!group){$("#entry-error").textContent="Enter your full name and class before opening the case.";return}
  const saved=loadState(STUDENT_KEY);
  state=saved.studentName&&(saved.studentName!==name||saved.studentClass!==group)?clone(DEFAULT_STATE):saved;
  storageKey=STUDENT_KEY;teacherMode=false;state.studentName=name;state.studentClass=group;state.current=state.current||"starter";
  store();startApp();
});
$("#resume-button").addEventListener("click",startApp);

function startApp(){
  $("#landing").classList.add("hidden");$("#app").classList.remove("hidden");
  $("#student-badge").textContent=`${state.studentName} · ${state.studentClass}`;
  renderJourney();showStage(state.current||"starter",true);
}
if(teacherMode&&!state.studentName){state.studentName="Teacher Preview";state.studentClass="Year 9";store()}
if(new URLSearchParams(location.search).get("teacher")==="1")startApp();

function stageIndex(id){return STAGES.findIndex(stage=>stage.id===id)}
function unlocked(id){
  if(teacherMode||id==="starter")return true;
  if(id==="brief")return Boolean(state.completed.starter);
  if(id==="model")return Boolean(state.completed.brief);
  if(id==="algorithm")return Boolean(state.completed.model);
  if(id==="extension"||id==="plenary")return Boolean(state.completed.algorithm);
  if(id==="review")return Boolean(state.completed.plenary);
  return false;
}
function renderJourney(){
  const nav=$("#journey-nav");nav.innerHTML="";
  STAGES.forEach((stage,index)=>{
    const button=document.createElement("button");button.type="button";button.dataset.stage=stage.id;
    button.innerHTML=`<strong>${String(index+1).padStart(2,"0")} · ${stage.title}</strong><small>${stage.core?"Core evidence":"Optional / final"}</small>`;
    button.addEventListener("click",()=>showStage(stage.id));nav.append(button);
  });
  renderProgress();
}
function renderProgress(){
  const core=STAGES.filter(stage=>stage.core);const done=core.filter(stage=>state.completed[stage.id]).length;
  if($("#progress-bar"))$("#progress-bar").style.width=`${Math.round(done/core.length*100)}%`;
  $$("#journey-nav button").forEach(button=>{
    button.disabled=!unlocked(button.dataset.stage);
    button.classList.toggle("current",button.dataset.stage===state.current);
    button.classList.toggle("complete",Boolean(state.completed[button.dataset.stage]));
  });
}
function showStage(id,force=false){
  if(!force&&!unlocked(id))return;
  state.current=id;queueStore();
  const template=$(`#stage-${id}`);$("#stage-host").replaceChildren(template.content.cloneNode(true));
  bindStage();restoreStage();
  if(id==="review")renderReport();
  const index=stageIndex(id);$("#back-button").disabled=index===0;
  $("#back-button").onclick=()=>showStage(STAGES[Math.max(0,index-1)].id,true);
  $("#next-button").textContent=id==="review"?"Return to case file":id==="extension"?"Skip / continue":"Check and continue";
  $("#next-button").onclick=()=>advance(id,index);
  renderProgress();window.scrollTo({top:0,behavior:"auto"});
}

function bindStage(){
  $$("[data-save]").forEach(element=>{element.addEventListener("input",capture);element.addEventListener("change",capture)});
  $$("[data-action]").forEach(element=>element.addEventListener("click",()=>handleAction(element.dataset.action)));
  $$("[data-enlarge]").forEach(element=>element.addEventListener("click",()=>openImage(element.dataset.enlarge,element.querySelector("img").alt)));
  if($("#evidence-file"))$("#evidence-file").addEventListener("change",handleFile);
  if($("#paste-zone"))$("#paste-zone").addEventListener("paste",handlePaste);
  if($("#download-backup"))$("#download-backup").addEventListener("click",downloadBackup);
  if($("#download-pdf"))$("#download-pdf").addEventListener("click",downloadPDF);
}
function capture(event){
  const element=event.currentTarget;state.responses[element.dataset.save]=element.type==="checkbox"?element.checked:element.value;
  queueStore();
}
function restoreStage(){
  $$("[data-save]").forEach(element=>{
    const value=state.responses[element.dataset.save];if(value===undefined)return;
    if(element.type==="checkbox")element.checked=Boolean(value);else element.value=value;
  });
  Object.entries(state.checks).forEach(([id,result])=>showFeedback(id,result.ok,result.message));
  if(state.current==="algorithm")renderBuiltAlgorithm();
  if(state.current==="extension")unlockPython();
  renderEvidence();
}
function setCheck(id,ok,message){state.checks[id]={ok,message};showFeedback(id,ok,message);store()}
function showFeedback(id,ok,message){
  const element=$(`[data-feedback="${id}"]`);if(!element)return;
  element.textContent=message;element.className=`feedback ${ok?"success":"improve"}`;
}

function handleAction(action){
  const actions={
    "check-starter":checkStarter,"check-clues":checkClues,"check-brief":checkBrief,"check-brief-sequences":checkBriefSequences,"check-jobs":checkJobs,"check-ipo":checkIPO,
    "check-pseudo-reading":checkPseudoReading,"check-pseudo":checkPseudo,"check-algo-sequences":checkAlgoSequences,"trace-next":traceNext,"trace-reset":resetTrace,"check-peer":checkPeer,"check-extension":checkExtension,"check-plenary":checkPlenary,
    "run-python":runPython,"stop-python":stopPython,"reset-python":resetPython,"download-python":downloadPython
  };
  actions[action]?.();
}
function checkStarter(){
  const ok=state.responses.starterTool==="Decomposition"&&state.responses.starterIgnore==="Abstraction";
  setCheck("starter",ok,ok?"Secure: decomposition splits the big job; abstraction removes irrelevant detail.":"Look again: splitting into jobs is decomposition. Keeping only useful details is abstraction.");
}
function checkClues(){
  const expected={clueUrgency:"Warning sign",clueReward:"Warning sign",clueLink:"Warning sign",clueSignIn:"Warning sign",clueTime:"Neutral detail",clueNotebook:"Neutral detail"};
  const score=Object.entries(expected).filter(([key,value])=>state.responses[key]===value).length;
  setCheck("clues",score===6,score===6?"6/6: you kept the four observable warning signs and ignored two neutral details.":`${score}/6 correct. A detail matters only if it helps the program judge the fictional message.`);
}
function checkBrief(){
  const r=state.responses;
  const core=r.briefUser==="Sam, a Year 9 student who received a message"&&r.briefNeed==="Help noticing warning signs and choosing a safe next step"&&r.briefLimit==="Claim certainty, request a password or open a link"&&r.reqAsk&&r.reqScore&&r.reqExplain&&r.successCriterion==="Given a test case with three warning signs, the program displays HIGH concern, gives the reasons and advises the user not to open the link.";
  const unsafe=r.reqOpen||r.reqPassword;
  setCheck("brief",core&&!unsafe,core&&!unsafe?"Design brief ready: the user, need, safety limit, functions and observable success test all match the project.":unsafe?"Remove unsafe functions: the detector must not open links or request passwords.":"Use the big-job statement and examples above. The detector asks, scores, explains and gives safe advice; success must be observable during a test.");
}
function checkBriefSequences(){
  const r=state.responses;
  const ok=r.briefSequenceA==="Ask about warning signs → calculate concern → explain reasons → recommend a safe action"&&r.briefSequenceB==="Collect observations → apply the same rules → explain a LOW result while reminding the user to stay cautious"&&r.briefSequenceC==="Validate → explain the allowed answers → ask the same question again → continue scoring";
  setCheck("briefSequences",ok,ok?"3/3: every sequence collects usable information before judging and finishes with an honest, safe output.":"Think about dependency: the program must collect and validate information before rules can use it, then explain the result before advising the user.");
}
function checkJobs(){
  const r=state.responses;const ok=r.jobFirst==="Collect observations"&&r.jobSecond==="Validate responses"&&r.jobThird==="Apply the scoring rules"&&r.jobLast==="Explain reasons and safe advice";
  setCheck("jobs",ok,ok?"Correct sequence: collect → validate → apply rules → choose level → explain and advise.":"Follow the five job cards from top to bottom. The program needs valid observations before it can score or explain.");
}
function checkIPO(){
  const r=state.responses;
  const expected={ipoClass1:"Input",ipoClass2:"Process",ipoClass3:"Not used",ipoClass4:"Output",ipoClass5:"Input",ipoClass6:"Not used",ipoClass7:"Process",ipoClass8:"Output",ipoClass9:"Input",ipoClass10:"Process",ipoClass11:"Not used",ipoClass12:"Output",ipoClass13:"Input",ipoClass14:"Not used"};
  let score=0;
  Object.entries(expected).forEach(([key,value])=>{const select=$(`[data-save="${key}"]`);const correct=r[key]===value;if(correct)score++;select?.closest("label")?.classList.toggle("answer-correct",correct);select?.closest("label")?.classList.toggle("answer-review",!correct)});
  const ok=score===Object.keys(expected).length;
  setCheck("ipo",ok,ok?"14/14: your model matches this version—four inputs, three internal processes, three outputs and four deliberately unused details.":`${score}/14 correct. Reconsider the rows marked “review”. Ask: does it enter, happen inside, leave for the user, or sit outside the agreed requirements?`);
}
function checkPseudo(){
  const r=state.responses;const ok=r.pseudoStart==="concern ← 0"&&r.pseudoInput==="INPUT urgent"&&r.pseudoDecision==="IF urgent = YES THEN"&&r.pseudoUpdate==="concern ← concern + 1"&&r.pseudoOutput==="OUTPUT concern";
  setCheck("pseudo",ok,ok?"Mini-algorithm built. Read it down: initialise → input → decide → update → output.":"Match each line to its purpose. Use the five building-block cards directly above.");
  renderBuiltAlgorithm();
}
function checkPseudoReading(){
  const r=state.responses;
  const knowledge=r.sampleBPurpose==="Use two observations to decide whether the student should check before acting"&&r.sampleBScore==="1"&&r.sampleBOutput==="Check before acting"&&r.sampleCMaybe==="The program explains the allowed answers and asks again"&&r.sampleCStop==="When the answer is YES or NO"&&r.sampleCInput==="To give the user another opportunity to enter a valid answer";
  const b=clean(r.sampleBDescription||""),c=clean(r.sampleCDescription||"");
  const bWords=b.split(/\s+/).filter(Boolean).length,cWords=c.split(/\s+/).filter(Boolean).length;
  const bMeaning=/input|sender|link/i.test(b)&&/concern|point|add/i.test(b)&&/output|display|check/i.test(b);
  const cMeaning=/repeat|again|while|loop/i.test(c)&&/yes|no|valid/i.test(c)&&/stop|until|when/i.test(c);
  const descriptions=bWords>=25&&cWords>=15&&bMeaning&&cMeaning;
  setCheck("pseudoReading",knowledge&&descriptions,knowledge&&descriptions?"Both descriptions are ready: you identified the inputs, decisions, variable change, repetition and outputs without copying the pseudocode line by line.":!knowledge?"Re-read each algorithm from top to bottom and correct the selected answers. Follow the value of each variable after every condition.":`Your selections are secure. Strengthen the written descriptions: Sample B needs at least 25 words about inputs, concern changes and output; Sample C needs at least 15 words about repetition, valid answers and when it stops.`);
}
function checkAlgoSequences(){
  const r=state.responses;
  const ok=r.algoOrder1a==="INPUT urgent"&&r.algoOrder1b==="IF urgent = YES THEN"&&r.algoOrder1c==="concern ← concern + 1"&&r.algoValidationNext==="Display “Enter YES or NO”, then ask again"&&r.algoOutputOrder==="Initialise → collect four answers → apply four rules → choose level → explain output";
  setCheck("algoSequences",ok,ok?"All three repaired: input exists before a decision uses it, invalid data is corrected, and the final level waits until every rule has run.":"Use the clue in each card: INPUT must come before IF; invalid data must be requested again; final output comes after all four rules.");
}
function renderBuiltAlgorithm(){
  const host=$("#built-algorithm");if(!host)return;
  if(!state.checks.pseudo?.ok){host.innerHTML="";return}
  host.innerHTML=`<strong>YOUR WORKING MINI-ALGORITHM</strong><pre>concern ← 0\nINPUT urgent\nIF urgent = YES THEN\n    concern ← concern + 1\nENDIF\nOUTPUT concern</pre><p>One warning sign is now working. The full detector repeats the IF-and-update pattern four times.</p>`;
}

const TRACE_STEPS=[
  {line:"Initialise concern ← 0",score:0,level:"Running",explain:"The variable is created. It must start at 0 before any rules run."},
  {line:"Unknown sender? NO",score:0,level:"Running",explain:"The condition is false, so no point is added."},
  {line:"Urgent language? YES",score:1,level:"Running",explain:"The condition is true. concern changes from 0 to 1."},
  {line:"Unexpected link? YES",score:2,level:"Running",explain:"The condition is true. concern changes from 1 to 2."},
  {line:"Requests sign-in information? NO",score:2,level:"Running",explain:"The condition is false, so concern stays at 2."},
  {line:"Compare score 2 with boundaries",score:2,level:"MEDIUM",explain:"A score of 1–2 selects MEDIUM concern. The detector explains urgency and the unexpected link, then advises Sam not to open it and to check with a trusted source."}
];
function traceNext(){
  const r=state.responses;
  if(!r.tracePredictionScore||!r.tracePredictionLevel){showFeedback("trace",false,"Make both predictions before running the trace.");return}
  if(traceStep>=TRACE_STEPS.length)return;
  const item=TRACE_STEPS[traceStep];traceHistory.push(item);traceStep++;
  $("#trace-score").textContent=String(item.score);$("#trace-level").textContent=item.level;
  $("#trace-line").innerHTML=`<strong>${safe(item.line)}</strong><br>${safe(item.explain)}`;
  $("#trace-history").innerHTML=traceHistory.map((entry,index)=>`<div><span>${index+1}</span><b>${safe(entry.line)}</b><em>concern = ${entry.score}</em></div>`).join("");
  if(traceStep===TRACE_STEPS.length){
    const ok=r.tracePredictionScore==="2"&&r.tracePredictionLevel==="MEDIUM";
    setCheck("trace",true,ok?"Trace complete: your prediction matched the rules. concern ended at 2, so MEDIUM ran.":`Trace complete: the actual result is score 2, MEDIUM. Compare this with your prediction and explain the difference below.`);
  }else showFeedback("trace",true,`Step ${traceStep} of ${TRACE_STEPS.length}. Read why the score changed or stayed the same, then run the next step.`);
}
function resetTrace(){traceStep=0;traceHistory=[];if($("#trace-score"))$("#trace-score").textContent="?";if($("#trace-level"))$("#trace-level").textContent="Not started";if($("#trace-line"))$("#trace-line").textContent="Make both predictions, then run the first step.";if($("#trace-history"))$("#trace-history").innerHTML="";delete state.checks.trace;queueStore();showFeedback("trace",false,"Trace reset. Your prediction is still saved; run the first step again.")}
function checkPeer(){
  const answers={A:{score:"0",level:"LOW"},B:{score:"2",level:"MEDIUM"},C:{score:"4",level:"HIGH"}};
  const r=state.responses;if(!r.peerName||!r.peerCase||!r.peerScore||!r.peerLevel){setCheck("peer",false,"Complete the partner/solo name, case, predicted score and predicted level.");return}
  const expected=answers[r.peerCase],ok=r.peerScore===expected.score&&r.peerLevel===expected.level;
  setCheck("peer",ok,ok?`Prediction matched: case ${r.peerCase} produces score ${expected.score}, ${expected.level}.`:`Check the four answers again. Case ${r.peerCase} produces score ${expected.score}, so the level is ${expected.level}. Find the first point that was missed or added incorrectly.`);
}
function checkExtension(){
  const r=state.responses;const ok=r.extValidation==="Display “Enter YES or NO” and ask the same question again"&&r.extBoundary==="HIGH"&&r.extOutput==="HIGH concern: three warning signs found. Do not open the link; show a trusted adult. This is an estimate, not proof.";
  setCheck("extension",ok,ok?"3/3: the detector now handles invalid input, the exact boundary and honest output.":"Revisit each mission: invalid input must be requested again, 3 is the HIGH boundary, and useful output explains both reasons and limits.");
  unlockPython(ok);
}
function unlockPython(ok=Boolean(state.checks.extension?.ok)){
  if($("#extension-unlock"))$("#extension-unlock").classList.toggle("hidden",!ok);
  if($("#python-studio"))$("#python-studio").classList.toggle("hidden",!ok);
  if(ok&&$("#python-code")){
    $("#python-code").value=state.responses.pythonCode||PYTHON_STARTER;
    $("#python-console").textContent=state.responses.pythonOutput||"Python is ready. Write a small part, then select Run program.";
    $("#python-code").addEventListener("input",event=>{state.responses.pythonCode=event.currentTarget.value;queueStore()});
  }
}
function builtinRead(name){if(Sk.builtinFiles===undefined||Sk.builtinFiles.files[name]===undefined)throw new Error(`File not found: ${name}`);return Sk.builtinFiles.files[name]}
function normalisePython(code){return String(code||"").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/−/g,"-")}
function friendlyPythonError(error){
  const raw=String(error),match=raw.match(/line\s+(\d+)/i);let help="Read the named line and compare its spelling, brackets and indentation with the lines around it.";
  if(/indent/i.test(raw))help="Check the spaces at the beginning of this line. Instructions inside an if statement must be indented.";
  else if(/bad input|EOF|never closed|unexpected/i.test(raw))help="Check for a missing colon, bracket or quotation mark near this line.";
  else if(/NameError/i.test(raw))help="Check the spelling and capital letters in your variable name.";
  return `Your program needs one correction${match?` near line ${match[1]}`:""}.\n${help}\n\nTechnical detail: ${raw}`;
}
function runPython(){
  if(pythonRunning||!state.checks.extension?.ok)return;
  const editor=$("#python-code"),consoleBox=$("#python-console");if(!editor||!consoleBox)return;
  const code=normalisePython(editor.value);editor.value=code;state.responses.pythonCode=code;state.responses.pythonRuns=(Number(state.responses.pythonRuns)||0)+1;consoleBox.textContent="Running…\n";pythonRunning=true;
  try{
    Sk.configure({output:text=>{consoleBox.textContent+=text},read:builtinRead,__future__:Sk.python3,execLimit:8000,inputfun:promptText=>window.prompt(promptText)||"",inputfunTakesPrompt:true});
    Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<student>",false,code,true)).then(()=>{pythonRunning=false;consoleBox.textContent+=(consoleBox.textContent.endsWith("\n")?"":"\n")+`Run ${state.responses.pythonRuns} finished.`;state.responses.pythonOutput=consoleBox.textContent;state.responses.pythonSuccessful=true;showFeedback("python",true,"Program ran. Read the console, improve one part, then run it again or download your .py file.");store()},error=>{pythonRunning=false;consoleBox.textContent+="\n"+friendlyPythonError(error);state.responses.pythonOutput=consoleBox.textContent;state.responses.pythonSuccessful=false;showFeedback("python",false,"Use the console guidance to make one correction, then run again.");store()});
  }catch(error){pythonRunning=false;consoleBox.textContent+="\n"+friendlyPythonError(error);state.responses.pythonOutput=consoleBox.textContent;showFeedback("python",false,"Make one correction and try again.");store()}
}
function stopPython(){pythonRunning=false;if($("#python-console"))$("#python-console").textContent+="\nStopped. If an input box is open, close it before running again."}
function resetPython(){if(!$("#python-code"))return;if(confirm("Replace the Python editor with the small starter framework?")){$("#python-code").value=PYTHON_STARTER;state.responses.pythonCode=PYTHON_STARTER;state.responses.pythonOutput="Python reset. Add your own questions and rules.";$("#python-console").textContent=state.responses.pythonOutput;queueStore()}}
function downloadPython(){
  const code=$("#python-code")?.value||state.responses.pythonCode||PYTHON_STARTER;state.responses.pythonCode=code;
  const blob=new Blob([code],{type:"text/x-python"});downloadBlob(blob,`Y9_${slug(state.studentClass)}_${slug(state.studentName)}_Scam_Detective.py`);showFeedback("python",true,"Python file downloaded. Keep it with your project evidence.");store();
}
function checkPlenary(){
  const r=state.responses;const ok=r.plenaryAO1==="Splitting a large problem into smaller manageable jobs"&&r.plenaryAO2==="MEDIUM"&&r.plenaryAO3==="Explain the warning signs and give a safe action";
  setCheck("plenary",ok,ok?"3/3: AO1 knowledge, AO2 application and AO3 evaluation are secure.":"Use today's model: decomposition splits jobs; two signs produce MEDIUM; useful output explains reasons and a safe action.");
}

function missingFor(id){
  if(teacherMode||id==="extension"||id==="review")return [];
  const missing=(REQUIRED[id]||[]).filter(key=>{const value=state.responses[key];return value===undefined||value===false||clean(value)===""});
  for(const check of CHECKS_REQUIRED[id]||[]){if(!state.checks[check]?.ok)missing.push(`complete and check: ${check}`)}
  if(id==="algorithm"){
    const description=clean(state.responses.ownPseudoDescription||"");
    const words=description.split(/\s+/).filter(Boolean).length;
    if(words<20||!/input|urgent/i.test(description)||!/concern|point|add/i.test(description)||!/output|display|show/i.test(description))missing.push("describe your own mini-algorithm in at least 20 words, including its input, concern change and output");
  }
  if(id==="brief"&&(state.responses.reqOpen||state.responses.reqPassword))missing.push("remove unsafe requirements");
  return [...new Set(missing)];
}
function advance(id,index){
  if(id==="review"){showStage("starter",true);return}
  const missing=missingFor(id);
  if(missing.length){alert("Before continuing:\n• "+missing.join("\n• "));return}
  if(id!=="extension")state.completed[id]=true;
  store();showStage(STAGES[Math.min(index+1,STAGES.length-1)].id,true);
}

$("#learning-toggle").addEventListener("click",()=>{const panel=$("#learning-panel");panel.classList.toggle("open");$("#learning-toggle").setAttribute("aria-expanded",panel.classList.contains("open"))});
$("#learning-close").addEventListener("click",()=>$("#learning-panel").classList.remove("open"));
$("#report-button").addEventListener("click",()=>{if(teacherMode||unlocked("review"))showStage("review",true);else alert("Complete the exit check before opening the final report.")});
$("#reset-button").addEventListener("click",()=>{if(confirm("Delete all locally saved answers and the optional evidence image for this lesson?")){localStorage.removeItem(storageKey);localStorage.removeItem(storageKey+"-image");location.reload()}});
function openImage(src,alt){$("#dialog-image").src=src;$("#dialog-image").alt=alt;$("#image-dialog").showModal();document.body.classList.add("dialog-open")}
$("#dialog-close").addEventListener("click",()=>{$("#image-dialog").close();document.body.classList.remove("dialog-open")});
$("#image-dialog").addEventListener("click",event=>{if(event.target===$("#image-dialog"))$("#dialog-close").click()});

const REPORT_SECTIONS=[
  ["Case file and clue sorting",[["Thinking tool for splitting jobs","starterTool"],["Thinking tool for ignoring detail","starterIgnore"],["Urgency","clueUrgency"],["Unexpected reward","clueReward"],["Unexpected link","clueLink"],["Sign-in request","clueSignIn"],["Time shown","clueTime"],["Notebook colour","clueNotebook"]]],
  ["Program purpose and sequences",[["User","briefUser"],["User need","briefNeed"],["Safety limit","briefLimit"],["Ask four questions","reqAsk"],["Calculate concern","reqScore"],["Explain and advise","reqExplain"],["Success criterion","successCriterion"],["Gaming reward sequence","briefSequenceA"],["School email sequence","briefSequenceB"],["Invalid response sequence","briefSequenceC"]]],
  ["Decomposition and IPO classification",[["First job","jobFirst"],["After collecting","jobSecond"],["Before level selection","jobThird"],["Last job","jobLast"],["Unknown sender answer","ipoClass1"],["Compare level boundaries","ipoClass2"],["Message arrival time","ipoClass3"],["Warning signs found","ipoClass4"],["Sign-in request answer","ipoClass5"],["Complete original message","ipoClass6"],["Reject MAYBE and ask again","ipoClass7"],["Concern level","ipoClass8"],["Unexpected link answer","ipoClass9"],["Add a concern point","ipoClass10"],["Gaming username","ipoClass11"],["Safe next step","ipoClass12"],["Urgent language answer","ipoClass13"],["Name of game","ipoClass14"]]],
  ["Pseudocode reading, description and testing",[["Sample B purpose","sampleBPurpose"],["Sample B predicted score","sampleBScore"],["Sample B predicted output","sampleBOutput"],["Sample B description","sampleBDescription"],["Sample C invalid-answer behaviour","sampleCMaybe"],["Sample C stopping condition","sampleCStop"],["Sample C repeated input","sampleCInput"],["Sample C description","sampleCDescription"],["Initialise","pseudoStart"],["Input","pseudoInput"],["Decision","pseudoDecision"],["Update","pseudoUpdate"],["Output","pseudoOutput"],["Own pseudocode description","ownPseudoDescription"],["Repair 1 line 1","algoOrder1a"],["Repair 1 line 2","algoOrder1b"],["Repair 1 line 3","algoOrder1c"],["Validation repair","algoValidationNext"],["Full detector order","algoOutputOrder"],["Predicted score","tracePredictionScore"],["Predicted level","tracePredictionLevel"],["Trace reflection","traceReflection"],["Partner / solo","peerName"],["Peer case","peerCase"],["Peer score","peerScore"],["Peer level","peerLevel"]]],
  ["Exit check",[["AO1","plenaryAO1"],["AO2","plenaryAO2"],["AO3","plenaryAO3"],["Week 3 focus","nextTarget"]]]
];
function answer(key){const value=state.responses[key];if(value===undefined||value===false||clean(value)==="")return '<span class="not-complete">Not selected</span>';return `<div class="report-answer">${safe(value===true?"Selected":value)}</div>`}
function renderReport(){
  const extension=["extValidation","extBoundary","extOutput"].some(key=>clean(state.responses[key]||""));
  const python=Boolean(state.responses.pythonCode||state.responses.pythonRuns||state.responses.pythonReflection);
  const extras=[];if(extension)extras.push(["Optional level-up",[["Validation","extValidation"],["Boundary","extBoundary"],["Improved output","extOutput"]]]);if(python)extras.push(["Optional Python creator mode",[["Runs","pythonRuns"],["Successful run","pythonSuccessful"],["Python code","pythonCode"],["Last console output","pythonOutput"],["Improvement reflection","pythonReflection"]]]);
  const sections=[...REPORT_SECTIONS.slice(0,4),...extras,REPORT_SECTIONS[4]];
  $("#report-summary").innerHTML=`<section class="report-card"><h3>Student and project</h3><div class="report-item"><strong>Name</strong><div class="report-answer">${safe(state.studentName)}</div></div><div class="report-item"><strong>Class</strong><div class="report-answer">${safe(state.studentClass)}</div></div><div class="report-item"><strong>WAGBA</strong><div class="report-answer">Turn a familiar cybersecurity problem into a clear, testable program plan.</div></div><div class="report-item"><strong>Safety boundary</strong><div class="report-answer">Fictional messages only. The detector estimates concern; it does not prove a scam.</div></div></section>`+sections.map(([title,items])=>`<section class="report-card"><h3>${safe(title)}</h3>${items.map(([label,key])=>`<div class="report-item"><strong>${safe(label)}</strong>${answer(key)}</div>`).join("")}</section>`).join("");
  loadEvidence();renderEvidence();
}

function loadEvidence(){try{evidenceImage=localStorage.getItem(storageKey+"-image")||""}catch{evidenceImage=""}}
loadEvidence();
function handleFile(event){const file=event.target.files?.[0];if(file)storeImage(file)}
function handlePaste(event){const item=[...(event.clipboardData?.items||[])].find(entry=>entry.type.startsWith("image/"));if(!item){alert("No image was found on the clipboard.");return}event.preventDefault();storeImage(item.getAsFile())}
function storeImage(file){
  if(!file)return;if(file.size>4*1024*1024){alert("Choose an image smaller than 4 MB.");return}
  const reader=new FileReader();reader.onload=()=>{evidenceImage=reader.result;try{localStorage.setItem(storageKey+"-image",evidenceImage)}catch{alert("The image is too large to save. Try a smaller screenshot.")}renderEvidence()};reader.readAsDataURL(file);
}
function renderEvidence(){const host=$("#image-preview");if(!host)return;host.innerHTML=evidenceImage?`<img src="${evidenceImage}" alt="Uploaded supporting project evidence"><button id="remove-image" class="button secondary" type="button">Remove image</button>`:"";if($("#remove-image"))$("#remove-image").onclick=()=>{evidenceImage="";localStorage.removeItem(storageKey+"-image");renderEvidence()}}
function downloadBackup(){const blob=new Blob([JSON.stringify({lesson:"Y9-T1-W2-Scam-Detective-Guided",version:4,...state},null,2)],{type:"application/json"});downloadBlob(blob,`Y9_${slug(state.studentClass)}_${slug(state.studentName)}_W2_Scam_Detective_Backup.json`)}
function downloadBlob(blob,name){const anchor=document.createElement("a");anchor.href=URL.createObjectURL(blob);anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(anchor.href),500)}
function addWrapped(doc,text,x,y,maxWidth,lineHeight=5){const lines=doc.splitTextToSize(String(text||"Not selected"),maxWidth);lines.forEach(line=>{if(y>277){doc.addPage();y=18}doc.text(line,x,y);y+=lineHeight});return y}
async function downloadPDF(){
  const status=$("#pdf-status");status.className="pdf-status";status.textContent="Creating your PDF report…";
  try{
    if(!window.jspdf?.jsPDF)throw new Error("PDF library unavailable");
    const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:"mm",format:"a4"});const margin=15,width=180;let y=18;
    doc.setFillColor(17,17,17);doc.rect(0,0,210,36,"F");doc.setTextColor(255,255,255);doc.setFont("helvetica","bold");doc.setFontSize(18);doc.text("Year 9 Scam Detective Lab",margin,16);doc.setFontSize(10);doc.text("Week 2 project planning evidence",margin,26);
    doc.setTextColor(17,17,17);y=45;doc.setFontSize(11);doc.setFont("helvetica","bold");doc.text("Student",margin,y);doc.setFont("helvetica","normal");doc.text(`${state.studentName} · ${state.studentClass}`,margin+28,y);y+=8;
    doc.setFont("helvetica","bold");doc.text("WAGBA",margin,y);doc.setFont("helvetica","normal");y=addWrapped(doc,"Turn a familiar cybersecurity problem into a clear, testable program plan.",margin+28,y,width-28,5)+4;
    doc.setFont("helvetica","bold");doc.text("Safety",margin,y);doc.setFont("helvetica","normal");y=addWrapped(doc,"Fictional messages only. The detector estimates concern; it does not prove a scam.",margin+28,y,width-28,5)+5;
    const extension=["extValidation","extBoundary","extOutput"].some(key=>clean(state.responses[key]||""));
    const python=Boolean(state.responses.pythonCode||state.responses.pythonRuns||state.responses.pythonReflection);const extras=[];if(extension)extras.push(["Optional level-up",[["Validation","extValidation"],["Boundary","extBoundary"],["Improved output","extOutput"]]]);if(python)extras.push(["Optional Python creator mode",[["Runs","pythonRuns"],["Successful run","pythonSuccessful"],["Python code","pythonCode"],["Last console output","pythonOutput"],["Improvement reflection","pythonReflection"]]]);const sections=[...REPORT_SECTIONS.slice(0,4),...extras,REPORT_SECTIONS[4]];
    for(const [title,items] of sections){
      if(y>255){doc.addPage();y=18}doc.setFillColor(235,229,214);doc.rect(margin,y-5,width,8,"F");doc.setFont("helvetica","bold");doc.setFontSize(12);doc.text(title,margin+2,y);y+=8;
      for(const [label,key] of items){if(y>265){doc.addPage();y=18}doc.setFont("helvetica","bold");doc.setFontSize(8.5);doc.text(label.toUpperCase(),margin,y);y+=5;doc.setFont("helvetica","normal");doc.setFontSize(10);const value=state.responses[key]===true?"Selected":state.responses[key]||"Not selected";y=addWrapped(doc,value,margin,y,width,5)+3}
    }
    if(evidenceImage){if(y>190){doc.addPage();y=18}doc.setFont("helvetica","bold");doc.setFontSize(12);doc.text("Supporting image",margin,y);y+=5;const properties=doc.getImageProperties(evidenceImage),ratio=Math.min(width/properties.width,80/properties.height);doc.addImage(evidenceImage,properties.fileType||"PNG",margin,y,properties.width*ratio,properties.height*ratio)}
    const pages=doc.getNumberOfPages();for(let page=1;page<=pages;page++){doc.setPage(page);doc.setFontSize(8);doc.setTextColor(90);doc.text(`Year 9 Week 2 · ${state.studentName} · Page ${page} of ${pages}`,margin,290)}
    doc.save(`Y9_${slug(state.studentClass)}_${slug(state.studentName)}_Scam_Detective.pdf`);status.textContent="PDF downloaded. Open it, check it, then upload it to Microsoft Teams: Week 2 Project.";
  }catch(error){status.className="pdf-status error";status.textContent="The direct download could not be created. Use the browser's Print option and choose Save as PDF.";console.error(error);setTimeout(()=>window.print(),200)}
}
