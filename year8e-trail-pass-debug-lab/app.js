(() => {
'use strict';
const preview=document.documentElement?.dataset.mode==='teacher-preview';
if(preview&&location.protocol!=='file:'&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname)){
  document.getElementById('lesson').innerHTML='<article class="card"><h1>Teacher Preview is local only</h1><p>Open the extracted teacher-preview.html file on your device.</p><p><a href="index.html">Open the student lesson</a></p></article>';
  return;
}
const {cards,drills,help,listModel,model,caseOf}=TrailData;
const {norm,casesFor,judge,errorHint}=TrailChecks;
const groups=(p,n)=>Array.from({length:n},(_,i)=>p+(i+1));
const sections=[['Briefing',['brief']],['Do Now',['D1','D2','D3','warm']],['Types of Learning',['types']],['List Syntax Sprint',['lists-0','lists-1']],['Main Task 1 · Lists',groups('A',20)],['Decision Syntax Sprint',['decisions-0','decisions-1']],['Main Task 2 · Decisions',groups('B',15)],['Independent Check',['C1','C2']],['Go Further',groups('E',10)],['Learning Pit Stop',['pit']],['Plenary',['P1','P2','P3','finish']],['After Plenary',['review-quiz']]];
const flow=sections.flatMap(s=>s[1]);
const priorities=[...groups('A',6),...groups('B',5)];
const checkpoints=[...priorities,'C1','C2'];
const required=id=>checkpoints.includes(id);
const further=groups('E',10);
const practice=[...groups('A',20),...groups('B',15)].filter(x=>!priorities.includes(x));
const storeKey='y8e-trail-pass-debug-lab-v1';
const fresh=()=>({id:'brief',started:preview,language:'en',answers:{},work:{},done:{},seen:{},stats:{},reflection:{},runs:{},gates:{},gateVersion:2});
let state=fresh(), persistent=true;
if(!preview)try{const saved=JSON.parse(localStorage.getItem(storeKey)||'null');if(saved?.started&&flow.includes(saved.id)){
  state={...state,...saved,gateVersion:2};
}}catch{persistent=false;}
let current=state.id, opened=false, expandedVariant=false, variantMsg='', note=null, runData=null, interactive=null, epoch=0, active=null, sprintTimer=0, goalRun=false, consoleEcho=null;
let tracker=null,syncStatus='pending';
const el=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const count=ids=>ids.filter(id=>state.done[id]).length;
const langIndex=()=>state.language==='zh'?0:state.language==='ko'?1:-1;
const i18=(pair)=>{const i=langIndex();return i>=0&&pair?.[i]?`<p class="support" lang="${i===0?'zh-Hans':'ko'}">${esc(pair[i])}</p>`:'';};
const translation=(key)=>i18(TrailSupport.ui[key]);
const topic=(key)=>i18(TrailSupport.topics[key]);
const code=(text,cls='')=>`<pre class="code ${cls}"><code>${esc(text)}</code></pre>`;
const button=(label,action,cls='secondary',attributes='')=>`<button type="button" class="${cls}" data-act="${action}" ${attributes}>${label}</button>`;
const core=id=>priorities.includes(id);
const tags=id=>core(id)?'<span class="pill">Core</span>':id.startsWith('E')?'<span class="pill stretch">Challenge</span>':practice.includes(id)?'<span class="pill extra">More practice</span>':'';
const sectionFor=id=>sections.find(s=>s[1].includes(id));
const sectionTitle=id=>sectionFor(id)[0];
const drillFor=id=>id==='warm'?drills.warm[0]:drills[id.split('-')[0]]?.[Number(id.split('-')[1])];
const cardTitle=id=>cards[id]?.title||drillFor(id)?.title||({brief:'Get the trail ready',types:'What can you do already?',pit:'Where are you now?',finish:'Review screen','review-quiz':'Trail Pass review games'})[id]||id;
const heading=(title,extra='')=>`<p class="eyebrow">${esc(sectionTitle(current))}${tags(current)}</p><h1 id="card-title" tabindex="-1">${esc(title)}</h1>${required(current)?'<div id="checkpoint-content"></div>':''}${extra}`;
const keyWords=text=>esc(text).replace(/\b(IndexError|NameError|append|len|int|index|indexes|list|length|boundary|indentation)\b/gi,'<strong>$1</strong>');
const term=(label,text)=>`<p><b>${label}</b><br>${text}</p>`;
const goals=`<div class="goals">${term('WAGBA','We are getting better at using lists and testing decisions, including at the boundary.')}${term('Knowledge','Recognise list elements, indexes, length and comparison operators.')}${term('Skills','Read and update a list; build and test an <code>if / else</code> decision.')}${term('Understanding','Explain why an index or an exact cutoff can change a program’s output.')}</div>`;

function save(track=true){
  if(preview||!state.started)return;
  if(track)tracker?.changed();
  try{localStorage.setItem(storeKey,JSON.stringify(state));persistent=true;}catch{persistent=false;}
  el('save').textContent=persistent?'Saved on this device':'Not saved · download before closing';
}
function trackEvent(kind,data){if(!state.sync||preview)return;tracker?.record(kind,data);save();}
function setAnswer(key,value){ state.answers[key]=value;save(); }
const parked=id=>Boolean(state.gates[id]?.parked);
const cleared=id=>state.done[id]||parked(id);
function practiceSnapshot(){return {lesson:'y8-trail-pass',current,language:state.language,counts:{core:count(priorities),practice:count(practice),extension:count(further)},completed:flow.filter(id=>state.done[id]),needsHelp:checkpoints.filter(parked),answers:state.answers,codeDrafts:state.work,lastTestResults:state.runs,reflection:state.reflection};}
const syncWords={pending:'Waiting to sync…',syncing:'Syncing with school…',synced:'School copy is up to date',offline:'Offline · waiting to sync',error:'School sync interrupted · try Sync now'};
function showSync(code){syncStatus=code;const node=el('sync-status');if(node)node.textContent=syncWords[code]??'';}
const syncDisclosure=()=>`<p class="under">School sync sends your classroom name or nickname, answers, code, console inputs, results and reflections to your teacher’s school practice record. Do not enter passwords or private information.</p>${i18(['同步到学校会发送你的课堂姓名或昵称、答案、代码、控制台输入、结果和反思。请勿填写密码或个人隐私信息。','학교에 동기화하면 수업 이름 또는 별명, 답, 코드, 콘솔 입력, 결과, 성찰이 교사에게 전송됩니다. 비밀번호나 개인정보를 입력하지 마세요.'])}`;
function syncPanel(){
  const node=el('sync-panel');if(!node||!tracker)return;
  node.hidden=!state.started;
  if(!state.started)return;
  node.innerHTML=state.sync?`<strong>School tracking</strong><p id="sync-status" role="status">${syncWords[syncStatus]}</p>${button('Sync now','sync-flush','plain')}`:`<strong>School tracking is off</strong><details><summary>Sync this practice</summary><form id="enable-sync">${syncDisclosure()}<label>Classroom name or nickname <input type="text" id="sync-name" maxlength="70" required value="${esc(state.name)}"></label><p class="under">This also sends the work already saved for this practice.</p><button class="plain" type="submit">Start school sync</button></form></details>`;
}
const hintCriteria={A2:'Print the place at index 2.',A3:'Print the route with just the second stop replaced.',A4:'Print the route with Camp added at the end.',A5:'Print just Camp.',A6:'Print Camp on line 1 and the number of stops on line 2.',B2:'Predict an outcome for each input: below, exactly at, and above 120.',B3:'Check the output for 119, 120 and 121.',B4:'Match all three expected outputs, including the one for exactly 120.'};
function done(id=current){state.done[id]=true;if(state.gates[id]){delete state.gates[id].parked;delete state.gates[id].legacy;}save();updateMap();updateProgress();updateCheckpoint();}
function edited(id){
  if(cards[id]?.type==='lab'&&runData?.tests){
    delete runData.tests;
    if(el('results'))el('results').innerHTML=casesTable(cards[id]);
    setNote('pending','<p><b>Code changed.</b> Check the new output when you’re ready.</p>');
  }
  if(!required(id)||!state.done[id])return;
  delete state.done[id];save();updateMap();updateProgress();updateCheckpoint();
  setNote('pending','<p><b>Work changed.</b> Check it again before continuing.</p>'+translation('gate'));
}
function gateFailures(){return state.gates[current]?.tries?.length||0;}
function failCheckpoint(value,infrastructure=false){
  if(preview||!required(current))return;
  const record=state.gates[current]??={};
  const sig=JSON.stringify(value);let hash=0x811c9dc5;
  for(let i=0;i<sig.length;i++)hash=Math.imul(hash^sig.charCodeAt(i),0x01000193);
  const tries=record.tries??=[];
  if(!tries.includes(hash)&&tries.length<2)tries.push(hash);
  if(infrastructure)record.unavailable=true;
  save();updateCheckpoint();
}
function updateCheckpoint(){
  if(!required(current))return;
  const check=el('checkpoint-content'), foot=el('footer-status');
  const c=cards[current], pass=Boolean(state.done[current]), review=parked(current);
  const action=c.type==='lab'?'Run checkpoint tests':'Check my answer';
  if(preview){
    if(check)check.innerHTML=`<div class="checkpoint" data-status="${pass?'passed':'todo'}"><p class="checkpoint-title"><strong>${pass?'✓ Demo check passed':'Checkpoint · preview only'}</strong></p><p>${esc(hintCriteria[current]||'Check a correct answer before continuing.')} Students need to pass this checkpoint. You can continue without checking it.</p></div>`;
    if(foot)foot.textContent='Checkpoint bypassed in preview.';
    return;
  }
  const canPark=!pass&&!review&&(gateFailures()>=2||state.gates[current]?.unavailable);
  if(check)check.innerHTML=`<div class="checkpoint" id="checkpoint" tabindex="-1" role="group" aria-label="Checkpoint status" data-status="${pass?'passed':review?'review':'todo'}"><p class="checkpoint-title"><strong>${pass?'✓ Checkpoint passed':review?'! Needs help · not completed':'◇ Required checkpoint'}</strong></p><p>${pass?'You can continue. Editing your answer or code means checking it again.':review?'Your attempt is saved for review. Come back and pass this check to mark it complete.':esc(hintCriteria[current]||'Check a correct answer before continuing.')+' Select <strong>'+action+'</strong> when you’re ready.'}</p>${!pass?translation(review?'deferred':'gate'):''}${state.gates[current]?.legacy&&!pass?'<p class="under">Your earlier draft is still here. Rerun it against the new checks.</p>':''}<div class="checkpoint-actions row">${canPark?button('Flag for teacher help','park','plain')+`<span class="under">Saved for review, not marked complete.</span>`:''}</div>${canPark?translation('defer'):''}</div>`;
  if(foot)foot.textContent=pass?'Checkpoint passed.':review?'Flagged for help · not complete.':'Pass this checkpoint to continue.';
}
function updateMap(){
  el('map-links').innerHTML=sections.map(([title,ids],i)=>{
    const inStage=ids.includes(current);
    const target=inStage?current:preview?ids[0]:(state.seen[ids[0]]?(ids.find(x=>!cleared(x))||ids[0]):ids[0]);
    const total=ids.filter(x=>!['warm','finish'].includes(x));
    const label=ids[0]==='review-quiz'?'Games':preview?ids.length+(ids.length===1?' card':' cards'):count(total)===total.length?'✓ '+count(total)+'/'+total.length:count(total)+'/'+total.length;
    return `<button type="button" data-act="jump" data-id="${target}" class="nav-stage" ${inStage?'aria-current="true"':''} ${state.started?'':'disabled'}><span>${esc(title)}</span><small>${label}</small></button>${inStage&&state.started&&ids.length>1?`<div class="nav-cards" role="group" aria-label="Cards in ${esc(title)}">${ids.map((id,j)=>`<button type="button" data-act="jump" data-id="${id}" title="${esc(cards[id]?.title||drillFor(id)?.title||(id==='finish'?'Review':'Card '+(j+1)))}" aria-label="${esc(id+' '+(state.done[id]?'complete':parked(id)?'flagged for help, not complete':'not complete'))}" ${id===current?'aria-current="step"':''} data-done="${Boolean(state.done[id])}" data-parked="${parked(id)}">${id==='warm'?'Type':id==='finish'?'End':id.includes('-')?j+1:id}</button>`).join('')}</div>`:''}`;
  }).join('');
}
function updateProgress(){
  const p=el('progress-content');if(!p)return;
  const sec=sectionFor(current), at=sec[1].indexOf(current)+1;
  p.innerHTML=`<div class="progress"><span><strong>${esc(sec[0])}</strong> · Card ${at} of ${sec[1].length}</span><span>${preview?'Preview · no student progress':`Core ${count(priorities)}/11 · More practice ${count(practice)}/24 · Go Further ${count(further)}/10`}</span></div><div class="meter" aria-hidden="true"><span style="width:${(at/sec[1].length)*100}%"></span></div>`;
}
function go(id){
  if(!state.started||!flow.includes(id)||id===current)return;
  const target=flow.indexOf(id), here=flow.indexOf(current);
  const blocking=!preview&&target>here?checkpoints.find(k=>flow.indexOf(k)<target&&!cleared(k)):null;
  if(blocking){
    if(blocking!==current)openCard(blocking);
    const action=cards[current].type==='lab'?'Run checkpoint tests':'Check my answer';
    setNote('pending',`<p><b>${esc(cards[blocking].title)} needs a check first.</b> Try the task, then select <strong>${action}</strong>. The worked example is available if you need it.</p>`+translation('gate'));
    el('checkpoint')?.focus();return;
  }
  openCard(id);
}
function openCard(id){
  stop(false);clearInterval(sprintTimer);sprintTimer=0;
  current=id;state.id=id;state.seen[id]=true;opened=false;expandedVariant=false;variantMsg='';note=null;runData=null;goalRun=false;save();render(true);
  if(matchMedia('(max-width: 660px)').matches)el('map').open=false;
}
function nextId(){
  if(preview)return flow[flow.indexOf(current)+1];
  if(current==='D3')return 'types';
  if(current==='A6')return 'decisions-0';
  if(current==='B5')return 'C1';
  if(current==='C2')return 'pit';
  return flow[flow.indexOf(current)+1];
}
function footer(){
  if(preview){
    const i=flow.indexOf(current),prev=flow[i-1],next=flow[i+1];
    return `<footer class="foot">${prev?button('← Back','jump','secondary',`data-id="${prev}"`):'<span></span>'}<div><span id="footer-status" class="footer-status">Teacher Preview</span></div>${next?button('Next card →','jump','primary',`data-id="${next}"`):button('Back to briefing','jump','primary','data-id="brief"')}</footer>`;
  }
  const i=flow.indexOf(current), prev=({types:'D3','decisions-0':'A6',C1:'B5',pit:'C2'})[current]||flow[i-1], next=nextId();
  let extras='';
  if(current==='D3')extras=button('Try keyboard warm-up','jump','plain','data-id="warm"');
  if(current==='A6')extras=button('More list practice →','jump','plain','data-id="A7"');
  if(current==='B5')extras=button('More decision practice →','jump','plain','data-id="B6"');
  if(current==='C2')extras=button('Try Go Further →','jump','plain','data-id="E1"');
  if(/^E[1-9]$/.test(current))extras=button('Go to Learning Pit Stop →','jump','plain','data-id="pit"');
  const status=required(current)?'<span id="footer-status" class="footer-status" aria-live="polite"></span>':'';
  return `<footer class="foot">${prev?button('← Back','jump','secondary',`data-id="${prev}"`):'<span></span>'}<div>${status}${extras||(!status?'<span>Practice cards can be revisited.</span>':'')}</div>${next?button('Next: '+(sectionFor(next)===sectionFor(current)?'card':esc(sectionTitle(next).split(' ·')[0]))+' →','jump','primary',`data-id="${next}"`):button('Download my practice','download','primary')}</footer>`;
}
const visuals={
  'trail-mission':{height:470,alt:'Field map with a student, the Pine, Lake and Ridge route, and a gate marked 120 cm.',caption:'Two jobs: repair the route list, then fix the height check.',support:['两个任务：修正路线列表，然后修复身高检查。','두 가지 임무: 경로 리스트를 고치고 키 제한 검사를 수정하세요.']},
  'list-slots':{height:238,alt:'Four labelled slots: index 0 Map, index 1 Torch, index 2 Rope, index 3 Radio.',caption:'The index is the slot number. The element is the value inside. Four items have indexes 0 to 3.',support:['索引是位置编号，元素是该位置上的值。四项的索引是 0 到 3。','인덱스는 칸의 번호, 요소는 칸 안의 값입니다. 네 항목의 인덱스는 0부터 3까지입니다.']},
  'replace-append':{height:354,alt:'Replacing Blue with Silver keeps three slots. Appending White adds a fourth slot.',caption:'Replace Blue with Silver: still 3 items. Append White at the end: now 4 items.',support:['把 Blue 替换成 Silver：仍有 3 项。在末尾追加 White：现在有 4 项。','Blue를 Silver로 바꿔도 항목은 3개입니다. 끝에 White를 추가하면 4개가 됩니다.']},
  'text-to-number':{height:228,alt:'Three steps: text "85", conversion with int(), then the integer 85.',caption:'input() gives text such as "85". int() converts it to 85, a whole number you can compare.',support:['input() 返回文本，例如 "85"。int() 将它转换为可进行数值比较的整数 85。','input()은 "85" 같은 문자열을 반환합니다. int()는 이를 비교할 수 있는 정수 85로 바꿉니다.']},
  'cutoff-gate':{height:280,alt:'For a 5-token minimum: 4 waits, exactly 5 opens, and 6 opens.',caption:'The rule is tokens >= 5. The equals part lets the gate open at exactly 5.',support:['规则是 tokens >= 5。等号表示正好 5 枚代币时门也会开。','규칙은 tokens >= 5입니다. 등호가 있어서 토큰이 정확히 5개일 때도 문이 열립니다.']}
};
function visual(id,hero=false){
  const v=visuals[id], src=`visuals/${id}.svg`;
  return `<figure class="lesson-visual${hero?' hero-art':''}"><img src="${src}" width="720" height="${v.height}" alt="${esc(v.alt)}" decoding="async"><figcaption><span>${esc(v.caption)}</span>${i18(v.support)}<a href="${src}" target="_blank" rel="noopener" aria-label="Enlarge visual in a new tab: ${esc(v.alt)}">Enlarge visual ↗</a></figcaption></figure>`;
}
const lessonVisual={A1:'list-slots',A3:'replace-append',A4:'replace-append',B1:'text-to-number',B2:'cutoff-gate'};
const independentVisual={C1:'cutoff-gate',C2:'list-slots'};
const supportVisual={index:'list-slots',length:'list-slots',replace:'replace-append',append:'replace-append',input:'text-to-number',boundary:'cutoff-gate'};
function startForm(){return `<form id="start" class="intro-form"><label for="name" class="field">Name or classroom nickname <span class="name-note">(${tracker?'needed for school sync':'optional'})</span><input id="name" type="text" maxlength="70" autocomplete="off"></label>${tracker?`${syncDisclosure()}<label class="sync-opt"><input type="checkbox" id="school-sync" checked> Sync my practice with school</label><p class="under">Untick for practice on this device only. The activity works offline.</p>`:'<p class="under">Your draft stays in this browser on this device.</p>'}<p id="start-error" class="under" role="status"></p>${translation('start')}<button class="primary">Start practice →</button></form>`;}
function briefing(){return `${heading('Get the trail ready')}<div class="hero"><div><p class="reading">A trail has a route and a ride. A detour changes the second stop, and a buggy height check turns away someone who is exactly <strong>120 cm</strong>. Your job is to repair both.</p>${translation('welcome')}<div class="chunk"><h2>What success looks like</h2><p>Change a route without rebuilding its list. Make the ride print the right message for <strong>119, 120 and 121</strong>.</p></div><p class="under">Year 8 · 60-minute revision · No loops · This is practice, not the test.</p></div>${visual('trail-mission',true)}</div><p class="under"><strong>Start with Core.</strong> More practice helps you repeat a skill. Go Further lets you apply it to something new. You don’t have to finish all 45 cards today.</p>${state.started?footer():startForm()}`;}
function readingExample(c){
  let graphic=lessonVisual[c.id]?visual(lessonVisual[c.id]):'';
  if(c.id==='A2')graphic=`<div class="chips" aria-label="Route slots: index 0 Pine, index 1 Lake, index 2 Ridge">${['Pine','Lake','Ridge'].map((v,i)=>`<span><small>Index ${i}</small>${v}</span>`).join('')}</div>`;
  const example=c.source||((c.type==='lab'&&c.id.startsWith('B')&&c.id!=='B4')?help[c.help]?.code:null);
  const names=c.group==='route'&&example?.includes('markers')?`<p class="example-names"><strong>Example only:</strong> <code>markers</code> is the list in this example. In <strong>Your Code</strong>, the starter list is called <code>stops</code>.</p>${i18(['markers 是示例列表。你的代码中，初始列表名叫 stops。','markers는 예시 리스트입니다. 내 코드의 시작 리스트 이름은 stops입니다.'])}`:'';
  return `<p class="reading">${keyWords(c.read)}</p>${graphic}${example?`<span class="label">${c.type==='lab'?'Read this before editing':'Read this before answering'}</span>${code(example)}${names}`:''}`;
}
const taskText=c=>`<div class="task"><p><strong>${esc(c.prompt)}</strong></p>${i18(TrailSupport.a[c.id])}</div>`;
function options(list,which,kind='answer'){
  return list.map((o,i)=>`<label class="choice"><input type="radio" name="${kind}-choice" data-field="${kind}" value="${i}" ${which===i?'checked':''}><span>${esc(o)}</span></label>`).join('');
}
function feedback(){return `<div id="feedback" role="status" class="notice" ${note?`data-kind="${note.kind}"`:''}>${note?note.html:''}</div>`;}
function setNote(kind,html){note={kind,html};const node=el('feedback');if(node){node.dataset.kind=kind;node.innerHTML=html;}}
const helpButton=c=>c.help?button(opened?'Hide help':'Show a worked example','help','secondary',`aria-expanded="${opened}" aria-controls="help-panel"`):'';
function helpHtml(c){
  const h=help[c.help];if(!h)return '';
  const [prompt,source,opts]=h.variant;
  const v=supportVisual[c.help];
  const diagram=v&&!independentVisual[c.id]&&lessonVisual[c.id]!==v?visual(v):'';
  return `<div id="help-panel" class="help-panel" ${opened?'':'hidden'}><h2>Same skill, different data</h2>${translation('help')}${topic(c.help)}${diagram}${code(h.code)}<ol>${h.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>${button(expandedVariant?'Hide a similar question':'Try a similar question','variant','plain',`aria-expanded="${expandedVariant}" aria-controls="variant-panel"`)}<div id="variant-panel" ${expandedVariant?'':'hidden'}>${code(source)}<fieldset><legend>${esc(prompt)}</legend>${options(opts,state.answers[current+'-variant'],'variant')}</fieldset>${button('Check this example','check-variant','plain')}<p id="variant-msg" role="status">${variantMsg}</p></div></div>`;
}
function optionCard(c){
  const value=state.answers[current];let input='';
  if(c.type==='choice')input=`<fieldset><legend class="sr-only">${esc(c.prompt)}</legend>${options(c.options,value)}</fieldset>`;
  if(c.type==='short')input=`<label class="field">Your answer<input type="text" data-field="answer" autocomplete="off" spellcheck="false" value="${esc(value)}"></label>`;
  if(c.type==='grid')input=`<div class="boundary">${c.inputs.map((v,i)=>`<label>${v}<select data-field="grid" data-idx="${i}"><option value="">Choose</option><option value="true" ${value?.[i]==='true'?'selected':''}>True</option><option value="false" ${value?.[i]==='false'?'selected':''}>False</option></select></label>`).join('')}</div>`;
  if(c.type==='order')input=`<ol class="order" aria-label="Code in your current order">${(value||c.lines.map((_,i)=>i)).map((v,i)=>`<li><code>${esc(c.lines[v])}</code><span class="row">${button('↑','order','plain',`data-i="${i}" data-delta="-1" aria-label="Move code line ${i+1} up" ${i===0?'disabled':''}`)}${button('↓','order','plain',`data-i="${i}" data-delta="1" aria-label="Move code line ${i+1} down" ${i===c.lines.length-1?'disabled':''}`)}</span></li>`).join('')}</ol>`;
  return `${heading(c.title)}${readingExample(c)}${taskText(c)}${input}<div class="row">${button('Check my answer','check','primary')}${helpButton(c)}</div>${feedback()}${helpHtml(c)}`;
}
function carryId(c){return c.group==='route'?({A4:'A3',A5:'A4',A6:'A5'}[c.id]):c.group==='pass'&&c.id==='B4'?'B3':undefined;}
function fallbackCode(c){const last=carryId(c);return last&&(parked(last)||(preview&&c.id==='B4'&&!state.work[last]))?cards[last].solution:undefined;}
function editor(c){const last=carryId(c);return state.work[c.id]??fallbackCode(c)??state.work[last]??c.starter??'';}
function casesTable(c,result){
  const use=result?.length?result:casesFor(c.cases).map(t=>({test:t}));
  return `<div class="table-wrap"><table><thead><tr><th scope="col">Test input</th><th scope="col">Expected output</th><th scope="col">Your result</th></tr></thead><tbody>${use.map(({test:t,verdict:v})=>`<tr><td>${esc(t.input.length?t.input.join(', '):'None')}</td><td><pre>${esc(t.output)}</pre></td><td>${v?`<strong class="test-badge ${v.pass?'test-pass':'test-fail'}">${v.pass?'✓ Matches':v.error?'! Python error':'! Different output'}</strong><pre>${esc(v.error||v.output||'No output')}</pre>`:'<span class="under">Not checked yet</span>'}</td></tr>`).join('')}</tbody></table></div>`;
}
function optionalCases(c){
  const cases=c.cases.filter(t=>t.edit);
  if(!cases.length)return '';
  return `<details class="chunk"><summary>Try changed data (optional)</summary><p>Try this with <strong>Run Python</strong>. Restore the original data before checking the task.</p><ul>${cases.map(t=>`<li><strong>${esc(t.label||'Changed data')}</strong>: change <code>${esc(t.edit[0])}</code> to <code>${esc(t.edit[1])}</code>.${t.input.length?` Input: <code>${esc(t.input.join(', '))}</code>.`:''} Expected: <code class="variant-output">${esc(t.output)}</code></li>`).join('')}</ul></details>`;
}
const edgeFeedback=value=>value===undefined?'':value===1?'Correct. 120 tests equality because it is exactly the cutoff.':'Try the number that is neither below nor above the cutoff.';
const edgeQuestion=()=>`<fieldset class="chunk"><legend>Quick self-check (optional): Which input is exactly at the cutoff?</legend>${translation('edge')}${options(['119','120','121'],state.answers[current+'-boundary'],'edge')}<p id="edge-feedback" role="status">${edgeFeedback(state.answers[current+'-boundary'])}</p></fieldset>`;
function lab(c){
  const answer=state.answers[current+'-prediction'];
  const checked=required(c.id), checkLabel=checked?'Run checkpoint tests':'Check output';
  const sampleNotice=!Object.hasOwn(state.work,c.id)&&fallbackCode(c)?`<p class="under"><strong>Starting code supplied:</strong> ${preview?'A sample decision is loaded so you can demonstrate the boundary tests.':'Your flagged draft is still saved on the previous card.'}</p>`:'';
  const cleanStart=carryId(c)&&c.id!=='B4'?`<details class="chunk"><summary>Need the starting code for this card?</summary><p>If your last solution looks different, you can use this starter. Your draft on the previous card stays saved.</p>${code(c.starter)}</details>`:'';
  return `${heading(c.title)}<div class="grid"><div>${readingExample(c)}${taskText(c)}${c.id==='A2'?`<label class="field">My prediction <input data-field="prediction" type="text" value="${esc(answer)}"></label>`:''}${c.explainEdge?edgeQuestion():''}${cleanStart}${optionalCases(c)}</div><div>${sampleNotice}<div class="editor-shell"><label class="label" for="code">1 · YOUR CODE — type and edit here</label><textarea id="code" class="editor" data-field="code" aria-label="Your Python code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(editor(c))}</textarea><div class="row editor-actions">${button(checkLabel,'test','primary')}${button('▶ Run Python','run','secondary')}${button('Stop','stop','plain','id="stop" disabled')}${button('Indent 4 spaces','indent','plain')}</div></div><section class="chunk output-check" aria-labelledby="output-check-title"><h2 id="output-check-title">2 · Expected output &amp; test results</h2><p>Match the outputs shown below. The checker runs your code as written.</p>${i18(['输出与下表一致即可通过。检查器不会修改你的代码。','아래 표와 출력이 같으면 통과합니다. 검사기는 코드를 바꾸지 않습니다.'])}${feedback()}<div id="results">${casesTable(c,runData?.tests)}</div></section><div class="terminal"><div class="label">3 · PYTHON CONSOLE</div><pre id="output" aria-live="polite">${esc(runData?.output||'Your output appears here.')}</pre><div id="inline-input"></div></div><p class="under">Use <strong>Run Python</strong> to try a run yourself. Use <strong>${checkLabel}</strong> to check the listed results.</p>${c.cases.some(t=>t.input.length)?translation('console'):''}<div class="row">${helpButton(c)}</div>${helpHtml(c)}</div></div>`;
}
function sprintStats(d){
  const s=state.stats[current]||{}, typed=String(state.answers[current]||'');
  const same=[...typed].filter((ch,i)=>ch===d.model[i]).length;
  const accuracy=typed.length?Math.round(100*same/typed.length):0;
  const seconds=s.start?Math.max(4,Math.min((s.finish||Date.now())-s.start,120000)/1000):0;
  return {typed,same,accuracy,seconds,wpm:seconds?Math.round(same/5/(seconds/60)):0};
}
function refreshSprint(){
  const d=drillFor(current);if(!d||!el('model'))return;
  const s=sprintStats(d);el('model').innerHTML=[...d.model].map((v,i)=>s.typed[i]===undefined?esc(v):`<span class="${s.typed[i]===v?'match':'mismatch'}">${esc(v)}</span>`).join('');
  el('matches').textContent=s.same+'/'+d.model.length;el('accuracy').textContent=s.typed.length?s.accuracy+'%':'—';el('wpm').textContent=s.typed.length?s.wpm+' WPM':'—';
  const wrong=[...s.typed].findIndex((v,i)=>v!==d.model[i]);const pos=wrong<0?-1:d.model.slice(0,wrong).split('\n').length;
  el('type-status').textContent=wrong>=0?`First difference on line ${pos}. Check the underlined character, spacing and case.`:s.typed===d.model?'Exact match. '+(d.output||d.tests?'Run your code to see what it does.':'Move on when ready.'):'Start with the first line. Accuracy matters more than speed.';
}
function sprint(d){return `${heading(d.title)}<p class="reading">Type the model as shown. Focus on <strong>${esc(d.focus)}</strong>. There is no speed target.</p>${translation('type')}<div class="sprint" aria-label="Personal typing stats"><div><strong id="matches">0/${d.model.length}</strong><span>Matching characters</span></div><div><strong id="accuracy">—</strong><span>Current accuracy</span></div><div><strong id="wpm">—</strong><span>Personal speed</span></div></div>${d.prefix?`<p class="under">This opening line is already supplied; type only the lines in the model.</p>${code(d.prefix)}`:''}<div class="grid"><div><span class="label">MODEL · READ AND TYPE</span><pre class="code sprint-code"><code id="model">${esc(d.model)}</code></pre></div><div><label class="label" for="typing">YOUR TYPING</label><textarea id="typing" class="editor code" data-field="typing" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(state.answers[current])}</textarea></div></div><p class="under" id="type-status"></p><div class="row">${d.output||d.tests?button('▶ Run what I typed','run-drill','primary'):''}${button('Indent 4 spaces','indent','plain')}${button('Try again','reset-drill','plain')}</div>${d.output||d.tests?`<div class="chunk"><h2>Run result</h2><pre class="code" id="output">${esc(runData?.output||'Type first, then run.')}</pre></div>`:''}${feedback()}`;}
const follows=['Show me how to read an index.','I want to practise editing and running code.','I can explain it; I will try a new case.'];
const phases=[['New learning','This is new to me. A model and one more try are helping.'],['Consolidating','I knew part of it and can now apply it more reliably.'],['Treading water','I can already do this. I need a different case to stretch me.'],['Drowning · need help','I am stuck and would like help with one step.']];
const field=(key,label,placeholder='',long=false)=>`<label class="field">${label}${long?`<textarea data-field="reflect" data-key="${key}" placeholder="${esc(placeholder)}" rows="2">${esc(state.reflection[key])}</textarea>`:`<input type="text" data-field="reflect" data-key="${key}" placeholder="${esc(placeholder)}" value="${esc(state.reflection[key])}">`}</label>`;
function types(){return `${heading('What can you do already?')}<p class="reading">Use one short program to show what you know, what you can do, and what you can explain.</p>${translation('types')}${code('badges = ["Fox", "Owl", "Bat"]\nprint(badges[1])')}<div class="chunk"><h2>Knowledge · Point to the stored value</h2>${field('type-value','Which value is at index 1?','One word is enough.')}</div><div class="chunk"><h2>Skills · Make a change</h2><p>Change only the number so the program reads the first badge. Then run it.</p><div class="editor-shell"><label for="goal-code" class="label">YOUR CODE</label><textarea class="editor" id="goal-code" data-field="goal-code" spellcheck="false" autocapitalize="off" autocorrect="off">${esc(state.work.types??'badges = ["Fox", "Owl", "Bat"]\nprint(badges[1])')}</textarea></div>${button('▶ Run my change','run-goal','primary')}<p id="output" class="under" role="status">${esc(runData?.output||'')}</p></div><div class="chunk"><h2>Understanding · Explain what stays the same</h2>${field('type-reason','Does print(badges[1]) change the list? Why?','Printing reads …; it does not …',true)}</div><label class="field">One way I’ll get better today <select data-field="reflect" data-key="type-next"><option value="">Choose a next step</option>${follows.map(v=>`<option ${state.reflection['type-next']===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label>${button('Save my starting point','types-done','primary')}${feedback()}${translation('reflect')}`;}
function pit(){const reports=priorities.filter(id=>state.done[id]).map(id=>id+' '+cards[id].title);return `${heading('Where are you now?')}<p class="reading">Use something you did today: a read, an update, or an exact-boundary test. Your choice is a reflection, not a grade.</p>${translation('pit')}<div class="review-summary"><div><b>Knowledge</b> · How is a value different from its index?</div><div><b>Skills</b> · Which edit or test can you now run?</div><div><b>Understanding</b> · Why can 120 behave differently under <code>&gt;</code> and <code>&gt;=</code>?</div></div><p class="under">${reports.length?'Core cards checked: '+esc(reports.join(' · ')):'If you have not checked a core card, use what you tried or explain where you got stuck.'}</p><fieldset><legend>Choose your learning phase</legend>${phases.map(([name,detail])=>`<label class="choice"><input type="radio" name="phase" data-field="reflect" data-key="pit-phase" value="${esc(name)}" ${state.reflection['pit-phase']===name?'checked':''}><span><strong>${esc(name)}</strong><br>${esc(detail)}</span></label>`).join('')}</fieldset>${field('pit-proof','What makes you choose that phase?','When I tried …, the program …',true)}${field('pit-next','What would you do next?','I will change/test … because …',true)}${button('Save my reflection','pit-done','primary')}${feedback()}${translation('reflect')}`;}
function finish(){const toReview=checkpoints.filter(parked);return `${heading('Check your practice')}<p class="reading">Your plenary and practice are saved separately on this device. Revisit any card using the lesson map, or download a review file before closing.</p><div class="review-summary"><div><strong>Core practice:</strong> ${count(priorities)} of 11</div><div><strong>More practice:</strong> ${count(practice)} of 24</div><div><strong>Go Further:</strong> ${count(further)} of 10</div><div><strong>Plenary:</strong> ${count(['P1','P2','P3'])} of 3</div>${toReview.length?`<div><strong>Flagged for help · not complete</strong><div class="row">${toReview.map(id=>button(esc(id+' · '+cards[id].title),'jump','plain',`data-id="${id}"`)).join('')}</div></div>`:''}</div><p class="under">A skipped card is not a missed mark. This is a revision lesson, not your assessment.</p>`;}
const reviewGames=[
  {name:'Blooket',detail:'To finish, get 40 answers correct. Due 22 November, 11:58 pm.',url:'https://play.blooket.com/play?hwId=6af95e5f540e3d60d8f071b2'},
  {name:'Gimkit · Don’t Look Down',detail:'Answer 40 questions correctly or reach the final summit. Due 22 November, 10:00 pm.',url:'https://www.gimkit.com/join/6af9602031761da09fec6c4a'}
];
function reviewQuiz(){return `${heading('Trail Pass review games')}<p class="reading">Finished the plenary? Choose <strong>one</strong> game. Both use the same 15 questions on lists, input and decisions. Questions repeat, so keep going towards <strong>40 correct answers</strong>.</p>${i18(['完成总结后，任选一个游戏。两个游戏使用相同的 15 道题，涵盖列表、输入和条件判断。题目会重复，目标是答对 40 次。','마무리 활동이 끝나면 게임을 하나 고르세요. 두 게임은 리스트, 입력, 조건 판단에 관한 같은 15문제를 사용합니다. 문제가 반복되며 목표는 40개를 맞히는 것입니다.'])}<div class="review-games" aria-label="Review assignments">${reviewGames.map(({name,detail,url})=>`<section class="chunk"><h2>${esc(name)}</h2><p>${esc(detail)}</p><a class="secondary review-game-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open ${esc(name.split(' · ')[0])} ↗</a></section>`).join('')}</div><p class="under">Each game opens in a new tab and records its own results. Your lesson progress stays here.</p>`;}
function render(focus=false){
  const c=cards[current],d=drillFor(current);
  const inner=c?(c.type==='lab'?lab(c):optionCard(c)):d?sprint(d):current==='brief'?briefing():current==='types'?types():current==='pit'?pit():current==='review-quiz'?reviewQuiz():preview?`${heading('End of lesson preview')}<p>Use <strong>Jump to any card</strong> to review another activity. No student work has been changed.</p>`:finish();
  el('lesson').innerHTML=(state.started?'<div id="progress-content"></div>':'')+`<article class="card" aria-labelledby="card-title">${inner}</article>`+(state.started&&current!=='brief'?footer():'');
  el('goal-text').innerHTML=goals;el('language').value=state.language;
  if(preview)el('preview-card').value=current;
  else{
    el('export').disabled=!state.started;
    if(state.started)el('save').textContent=persistent?'Saved on this device':'Not saved · download before closing';
  }
  updateProgress();updateMap();updateCheckpoint();syncPanel();
  if(d){refreshSprint();clearInterval(sprintTimer);sprintTimer=setInterval(refreshSprint,950);}
  if(focus){window.scrollTo(0,0);el('card-title').focus({preventScroll:true});}
}
function chooseCheck(){
  const c=cards[current];let a=state.answers[current];
  if(c.type==='order')a??=c.lines.map((_,i)=>i);
  if(a==null||a===''||(c.type==='grid'&&c.inputs.some((_,i)=>!a[i]))){setNote('try','<p>Answer the question first.</p>'+translation('choose'));return;}
  const correct=c.type==='short'?c.answer.includes(String(a).trim().toLowerCase()):Array.isArray(c.answer)?JSON.stringify(a)===JSON.stringify(c.answer):a===c.answer;
  trackEvent('answer-check',{selected:a,correct});
  const review=independentVisual[c.id]?`<details class="visual-review"><summary>Review the worked visual</summary>${visual(independentVisual[c.id])}</details>`:'';
  if(correct){done();setNote('ok','<p><b>That’s right.</b> '+esc(c.read)+'</p>'+translation('good')+review);}
  else{
    failCheckpoint(a);
    const incorrect=c.type==='grid'?c.inputs.filter((_,i)=>a[i]!==c.answer[i]):[];
    setNote('try',`<p><b>Try one adjustment.</b> ${incorrect.length?'Recheck '+esc(incorrect.join(', '))+'. ':''}${esc(c.hint)}</p>`+topic(c.help)+translation('again')+review);
  }
}
function stop(display){
  ++epoch;const live=active;active=null;consoleEcho=null;live?.stop();
  if(interactive){interactive.reject(new Error('Program stopped.'));interactive=null;}
  const node=el('inline-input');if(node)node.replaceChildren();
  setBusy(false);
  if(display){const o=el('output');if(o)o.textContent+='\nProgram stopped.';}
}
function setBusy(busy){
  if(el('stop'))el('stop').disabled=!busy;
  el('lesson').querySelectorAll('[data-act="run"],[data-act="test"],[data-act="run-drill"],[data-act="run-goal"]').forEach(b=>b.disabled=busy);
}
function askConsole(prompt,token){
  return new Promise((resolve,reject)=>{
    if(token!==epoch){reject(Error('Program stopped.'));return;}
    interactive={resolve,reject,prompt};
    el('inline-input').innerHTML=`<form id="terminal-form"><label for="console-value">${esc(prompt)}</label><input type="text" id="console-value" aria-label="Reply to ${esc(prompt)}" autocomplete="off" autocapitalize="off"><button class="secondary">Enter ↵</button></form>`;
    el('console-value').focus();
  });
}
async function manualRun(key,src){
  const token=++epoch;let log='';const update=()=>{if(token===epoch&&el('output'))el('output').textContent=log;};update();setBusy(true);
  consoleEcho=s=>{log+=s;update();};
  const r=runSprintPython(src,{output:s=>{log+=s;update();},input:p=>{if(!el('inline-input'))throw Error('This model does not ask for input. Only change the index.');return askConsole(p,token);}});active=r;
  const result=await r.result;
  if(token!==epoch)return;
  if(result.error)log+=(log?'\n':'')+result.error;
  else if(!log)log='No output yet. Add a print() line if this task needs one.';
  update();runData={output:log};active=null;consoleEcho=null;setBusy(false);
  trackEvent('python-run',{code:src,output:log,error:result.error||null});
  if(key==='types')goalRun=!result.error;
  if(result.error)setNote('try','<p>'+esc(errorHint(result.error))+'</p>'+translation('again'));
  else if(key==='types')setNote('ok','<p>Run complete. Is your first badge showing?</p>');
  else setNote('ok','<p>Run complete. Compare your output with the target, then use the check button when ready.</p>'+translation('tests'));
}
async function testRun(c,d){
  const token=++epoch;const original=d?(d.prefix||'')+(state.answers[current]||''):editor(c);
  const boundary=state.answers[current+'-boundary'];
  if(d&&!state.answers[current]?.trim()){setNote('try','<p>Type the model in the editor first.</p>'+translation('type'));return;}
  const cases=d?(d.tests||[caseOf([],d.output)]):casesFor(c.cases);let results=[];
  setBusy(true);
  if(el('output'))el('output').textContent='Running…';
  for(const t of cases){
    if(token!==epoch)return;
    let used=0;const r=runSprintPython(original,{input:()=>{if(used>=t.input.length)throw Error('Extra input requested. Use only the inputs listed for this case.');return t.input[used++];}});active=r;
    const result=await r.result;if(token!==epoch)return;
    results.push({test:t,verdict:judge(result,t)});
  }
  active=null;setBusy(false);
  if(d?(d.prefix||'')+(state.answers[current]||'')!==original:editor(c)!==original){
    if(el('output'))el('output').textContent='Work changed during the test.';
    setNote('pending','<p>Run checkpoint tests again to check the current draft.</p>'+translation('tests'));return;
  }
  const error=results.find(x=>x.verdict?.error)?.verdict.error;
  const atEdge=results.length>=3&&results[0].test.input[0]==='119'&&results[1].test.input[0]==='120'&&results[2].test.input[0]==='121'&&results[0].verdict?.pass&&!results[1].verdict?.pass&&results[2].verdict?.pass;
  const passed=results.every(x=>x.verdict?.pass);
  const outText=results.map(({test:t,verdict:v,raw})=>[t.label||'',t.input.length?'Input: '+t.input.join(', '):''].filter(Boolean).map(s=>s+'\n').join('')+(v?.error||v?.output||raw||'No output')).join('\n\n');
  runData={output:outText,tests:results};
  state.runs[current]={at:new Date().toISOString(),matched:passed,results:results.map(x=>({case:x.test.label||null,input:x.test.input,expected:x.test.output,actual:x.verdict?.output??'',error:x.verdict?.error??x.raw??null,matched:Boolean(x.verdict?.pass)}))};save();
  trackEvent('python-check',{code:original,boundary:boundary??null,matched:passed,results:state.runs[current].results});
  if(el('output'))el('output').textContent=outText;
  if(c&&el('results'))el('results').innerHTML=casesTable(c,results);
  if(passed){if(c)state.work[current]=original;done();setNote('ok','<p><b>✓ '+ (d?'Output matches.':results.length===3?'All three tests match.':'Output matches the target.')+'</b></p>'+translation('good'));}
  else{
    const unavailable=Boolean(error&&/Python could not load/.test(error));
    if(c&&original.trim())failCheckpoint(original.trim(),unavailable);
    const msg=unavailable?'The Python runner could not load. Flag this checkpoint for help and keep your draft.':error?errorHint(error):atEdge?'119 and 121 work. At exactly 120, check whether your comparison includes equality.':c?.hint||'Compare your output with the model.';
    setNote('try','<p><b>Try one adjustment.</b> '+esc(msg)+'</p>'+topic(c?.help)+translation('again'));
  }
  if(c)el('output-check-title')?.scrollIntoView?.({block:'nearest'});
}
function download(){
  if(preview)return;
  const report={lesson:'Year 8E · Trail Pass Debug Lab',date:new Date().toISOString(),name:state.name||'',counts:{core:count(priorities),practice:count(practice),extension:count(further)},completed:flow.filter(id=>state.done[id]),needsHelp:checkpoints.filter(parked),answers:state.answers,codeDrafts:state.work,lastTestResults:state.runs,reflection:state.reflection};
  const uri=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=uri;a.download='Trail_Pass_Practice.json';a.click();setTimeout(()=>URL.revokeObjectURL(uri),1500);
}
function insertSpaces(){
  const edit=el('code')||el('typing');if(!edit)return;const i=edit.selectionStart;
  edit.setRangeText('    ',i,edit.selectionEnd,'end');edit.focus();edit.dispatchEvent(new Event('input',{bubbles:true}));
}
function onInput(event){
  const node=event.target, f=node.dataset.field;
  if(!f)return;
  if(node.type==='radio'&&!node.checked)return;
  if(f==='code'||f==='goal-code'){const previous=f==='code'?editor(cards[current]):state.work[current];state.work[current]=node.value;if(previous!==node.value)edited(current);if(f==='goal-code')goalRun=false;save();}
  if(f==='typing'){
    const d=drillFor(current);const stats=state.stats[current]??={};
    stats.start??=Date.now();stats.finish=node.value===d.model?Date.now():undefined;setAnswer(current,node.value);
    if(node.value===d.model&&!d.output&&!d.tests)done();
    refreshSprint();
  }
  if(f==='answer'||f==='variant'||f==='edge'){
    const key=f==='answer'?current:f==='edge'?current+'-boundary':current+'-variant', value=node.type==='radio'?Number(node.value):node.value;
    const changed=state.answers[key]!==value;setAnswer(key,value);if(changed&&f==='answer')edited(current);
    if(f==='edge'&&el('edge-feedback'))el('edge-feedback').textContent=edgeFeedback(value);
  }
  if(f==='prediction')setAnswer(current+'-prediction',node.value);
  if(f==='grid'){const a=state.answers[current]||[],i=Number(node.dataset.idx),changed=a[i]!==node.value;a[i]=node.value;setAnswer(current,a);if(changed)edited(current);}
  if(f==='reflect'){state.reflection[node.dataset.key]=node.value;save();}
}
function bind(){
  el('language').addEventListener('change',e=>{stop(false);state.language=e.target.value;save();render();});
  if(preview){
    const picker=el('preview-card');
    picker.innerHTML=sections.map(([title,ids])=>`<optgroup label="${esc(title)}">${ids.map(id=>`<option value="${id}">${esc((cards[id]?id+' · ':'')+cardTitle(id))}</option>`).join('')}</optgroup>`).join('');
    picker.addEventListener('change',e=>go(e.target.value));
    el('preview-tools').hidden=false;
  }else el('export').onclick=download;
  el('lesson').addEventListener('input',onInput);
  el('lesson').addEventListener('keydown',e=>{
    if(e.key==='Tab'&&!e.shiftKey&&(e.target.id==='code'||e.target.id==='typing')&&(e.altKey||e.ctrlKey)){e.preventDefault();insertSpaces();}
  });
  el('lesson').addEventListener('submit',e=>{
    e.preventDefault();
    if(e.target.id==='start'&&!preview){
      const name=el('name').value.trim(), sync=tracker&&el('school-sync')?.checked;
      if(sync&&(!name||/[\u0000-\u001f\u007f]/.test(name))){el('start-error').textContent='Enter the name or nickname your teacher will recognise, or untick school sync.';el('name').focus();return;}
      state.started=true;state.name=name;state.seen.brief=true;state.done.brief=true;if(sync)tracker.enable();go('D1');
    }
    if(e.target.id==='terminal-form'&&interactive){const input=el('console-value').value,{resolve,prompt}=interactive;interactive=null;el('inline-input').replaceChildren();consoleEcho?.(prompt+input+'\n');trackEvent('console-input',{prompt,input});resolve(input);}
  });
  if(!preview&&tracker)document.querySelector('.shell').addEventListener('submit',e=>{
    if(e.target.id!=='enable-sync'||state.sync)return;
    e.preventDefault();const name=el('sync-name').value.trim();
    if(!name||/[\u0000-\u001f\u007f]/.test(name)){el('sync-name').focus();return;}
    state.name=name;tracker.enable();save();syncPanel();void tracker.flush();
  });
  document.querySelector('.shell').addEventListener('click',async e=>{
    const b=e.target.closest('button[data-act]');if(!b)return;const act=b.dataset.act,c=cards[current];
    if(act==='jump')go(b.dataset.id);
    if(act==='sync-flush'&&state.sync&&!preview)void tracker?.flush();
    if(act==='park'&&!preview&&required(current)&&!cleared(current)&&(gateFailures()>=2||state.gates[current]?.unavailable)){
      state.gates[current].parked=true;save();updateCheckpoint();updateMap();
      trackEvent('help-flag',{});
      setNote('pending','<p>Show this flag to your teacher. It is saved on this device. You can keep practising, but this checkpoint is not complete.</p>'+translation('deferred'));el('checkpoint')?.focus();
    }
    if(act==='download')download();
    if(act==='check')chooseCheck();
    if(act==='help'){
      opened=!opened;el('help-panel').hidden=!opened;b.setAttribute('aria-expanded',opened);b.textContent=opened?'Hide help':'Show a worked example';
    }
    if(act==='variant'){
      expandedVariant=!expandedVariant;el('variant-panel').hidden=!expandedVariant;b.setAttribute('aria-expanded',expandedVariant);b.textContent=expandedVariant?'Hide a similar question':'Try a similar question';
    }
    if(act==='check-variant'){
      const v=state.answers[current+'-variant'];variantMsg=v===undefined?'Choose an answer first.':v===help[c.help].variant[3]?'Yes. Try the original task again when you are ready.':'Read the example above and try this again.';el('variant-msg').textContent=variantMsg;
      if(v!==undefined)trackEvent('practice-retry',{selected:v,correct:v===help[c.help].variant[3]});
    }
    if(act==='order'){
      const a=[...(state.answers[current]||c.lines.map((_,i)=>i))],i=Number(b.dataset.i),j=i+Number(b.dataset.delta);[a[i],a[j]]=[a[j],a[i]];setAnswer(current,a);render();el('lesson').querySelector(`[data-i="${j}"][data-delta="${b.dataset.delta}"]:not([disabled])`)?.focus();
    }
    if(act==='run')manualRun(current,editor(c));
    if(act==='test')testRun(c);
    if(act==='stop')stop(true);
    if(act==='indent')insertSpaces();
    if(act==='run-drill')testRun(null,drillFor(current));
    if(act==='reset-drill'){stop(false);state.answers[current]='';delete state.stats[current];note=null;runData=null;save();render();el('typing').focus();}
    if(act==='run-goal')manualRun('types',el('goal-code').value);
    if(act==='types-done'){
      const complete=state.reflection['type-value']?.trim()&&goalRun&&state.reflection['type-reason']?.trim()&&state.reflection['type-next'];
      if(complete){done();trackEvent('reflection',{saved:true});setNote('ok','<p>Starting point recorded. Now practise your list syntax.</p>'+translation('good'));}
      else setNote('try','<p>Try each of the three activities, run your change and choose a next step. You can continue and come back.</p>'+translation('reflect'));
    }
    if(act==='pit-done'){
      const complete=['pit-phase','pit-proof','pit-next'].every(k=>state.reflection[k]?.trim());
      if(complete){done();trackEvent('reflection',{saved:true});setNote('ok','<p>Reflection saved. Your final check is next.</p>'+translation('good'));}
      else setNote('try','<p>Choose a phase, give one example and add your next step.</p>'+translation('reflect'));
    }
  });
}
if(matchMedia('(max-width: 660px)').matches){el('map').open=false;el('goals').open=false;}
if(!preview&&window.TrailSync)tracker=window.TrailSync.create({get:()=>state,snapshot:practiceSnapshot,persist:()=>save(false),status:showSync});
bind();render();tracker?.resume();
})();
