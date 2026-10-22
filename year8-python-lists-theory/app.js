(() => {
  'use strict';
  const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cards=LESSON.cards;let teacher=false,state=null,saveTimer,saveFailed=false,evidence=null,exporting=false,checking=false;
  const key=()=>teacher?'rescue-lists-teacher-v1':'rescue-lists-student-v1';
  const translate=(v,lang=state?.language||'en')=>typeof v==='object'&&v!==null?(v[lang]||v.en):v;
  const en=v=>translate(v,'en');
  const textPair=v=>`<span>${esc(en(v))}</span>${state.language!=='en'&&translate(v)!==en(v)?`<span class="translation" lang="${state.language==='zh'?'zh-Hans':'ko'}">${esc(translate(v))}</span>`:''}`;
  const pairParagraph=v=>`<p>${esc(en(v))}</p>${state.language!=='en'&&translate(v)!==en(v)?`<p class="support-text" lang="${state.language==='zh'?'zh-Hans':'ko'}">${esc(translate(v))}</p>`:''}`;
  const now=()=>new Date().toISOString();
  const trace=(kind,data={},cardId=cards[state?.current]?.id,fieldKey=null)=>window.ListsCloud?.record(kind,cardId,data,fieldKey);
  function fresh(name,cls,language){return {lessonId:LESSON.id,schemaVersion:1,contentVersion:2,name,className:cls,language,guidance:'steps',teacher,current:0,furthest:0,responses:{},started:now(),updated:now(),teamsSubmitted:false};}
  function migrate(s){
    if(s.contentVersion!==2){const prior=LESSON.legacyCardIds||[];for(const field of ['current','furthest']){const id=prior[s[field]];s[field]=Math.max(0,cards.findIndex(c=>c.id===id));}for(const [id,r]of Object.entries(s.responses||{})){if(cards.find(c=>c.id===id)?.edition===2){r.previousEdition=LESSON.legacyTitles[id]||id;r.feedback=null;r.status=r.code?'needs-review':'not-completed';r.checkedAt=null;}}s.contentVersion=2;}
    s.guidance=['steps','independent'].includes(s.guidance)?s.guidance:'steps';return s;
  }
  function response(id){return state.responses[id]||(state.responses[id]={attempts:[],status:'not-completed'});}
  function save(immediate=false){
    if(!state)return;
    $('#save-status').textContent='Saving…';clearTimeout(saveTimer);
    const write=()=>{try{state.updated=now();localStorage.setItem(key(),JSON.stringify(state));$('#save-status').textContent='Saved locally';saveFailed=false;}catch{$('#save-status').textContent='Save failed — download a backup';saveFailed=true;}window.ListsCloud?.capture(state);};
    if(immediate)write();else saveTimer=setTimeout(write,250);
  }
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3500);}
  function db(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(new Error('Image storage is unavailable'));return;}const req=indexedDB.open('rescue-lists-evidence',1);req.onupgradeneeded=()=>req.result.createObjectStore('images');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function imageStore(action,value){const database=await db();return new Promise((resolve,reject)=>{const tx=database.transaction('images',action==='get'?'readonly':'readwrite'),store=tx.objectStore('images');let req;if(action==='get')req=store.get(key());else if(action==='put')req=store.put(value,key());else req=store.delete(key());let result;req.onsuccess=()=>result=req.result;tx.oncomplete=()=>{database.close();resolve(result);};tx.onerror=()=>{database.close();reject(tx.error);};});}
  async function showApp(){
    migrate(state);
    $('#report-root').replaceChildren();
    $('#landing').hidden=true;$('#lesson-app').hidden=false;
    $('#student-label').textContent=state.name+' · '+state.className;$('#teacher-badge').hidden=!teacher;
    $('#support-language').value=state.language;
    $('#guidance-mode').value=state.guidance;
    try{evidence=await imageStore('get')||null;}catch{evidence=null;}
    await window.ListsCloud?.start(state,evidence);
    render();save(true);
  }
  function render(){
    const card=cards[state.current],r=response(card.id);$('#nav-message').textContent='';
    const stage=LESSON.stages.find(x=>x[0]===card.stage),stageCards=cards.filter(c=>c.stage===card.stage);
    $('#help-continue').textContent=translate(LESSON.L('Save as needs help and continue','保存为需要帮助并继续','도움 필요로 저장하고 계속'));
    $('#card-location').textContent=`${stage[1]} · Card ${stageCards.indexOf(card)+1} of ${stageCards.length}`;
    $('#sidebar-support').textContent=state.language==='zh'?'列表保存相关值；索引从 0 开始；更新替换一个元素。':state.language==='ko'?'리스트는 관련 값을 저장합니다. 인덱스는 0부터 시작합니다. 업데이트는 요소 하나를 바꿉니다.':'';
    $('#stage-nav').innerHTML=LESSON.stages.map(([id,title])=>{
      const index=cards.findIndex(c=>c.stage===id),isCurrent=card.stage===id,group=cards.filter(c=>c.stage===id&&(!c.tier||c.tier==='core')),done=group.length>0&&group.every(c=>['correct','reflected','reviewed'].includes(response(c.id).status));
      return `<button data-stage="${id}" ${!teacher&&id!=='review'&&index>state.furthest?'disabled':''} ${isCurrent?'aria-current="step"':''}><span class="dot ${done?'done':''}">${done?'✓':LESSON.stages.findIndex(s=>s[0]===id)+1}</span>${esc(title)}</button>`;
    }).join('');
    const practice=ListsPractice.get(card.id);updatePracticeProgress();
    if(practice){renderPractice(card,r,practice,stage);return;}
    renderGeneral(card,r,stage);
  }
  function updatePracticeProgress(){
    const core=cards.filter(c=>c.tier==='core'),coreMet=core.filter(c=>response(c.id).status==='correct').length,stretchMet=cards.filter(c=>c.tier&&c.tier!=='core'&&response(c.id).status==='correct').length;
    $('#practice-progress').innerHTML=`<strong>${textPair(LESSON.L('Core coding','基础编程','기본 코딩'))}: ${coreMet}/6</strong><span>${textPair(LESSON.L('Challenge bank','挑战题库','도전 문제'))}: ${stretchMet}/15 · ${textPair(LESSON.L('not a race','不是速度比赛','경주가 아닙니다'))}</span>`;
  }
  function renderGeneral(card,r,stage){
    const practice=null;
    let html=`<div class="card-top"><span class="pill">${esc(stage[1])}</span><span class="small">${esc(stage[2])}</span></div><h1>${esc(card.title)}</h1>`;
    const reading=`<div class="reading">${pairParagraph(card.reading)}</div>`;
    const visual=card.image?visualHTML(card):'';
    html+=card.id==='mission'?`<div class="mission-intro">${reading}${visual}</div>`:reading+visual;
    if(card.code)html+=`<section class="example" aria-label="Code example"><h2>${card.type==='coding'?'Reference example':'Read this code'}</h2><pre><code>${esc(card.code)}</code></pre>${card.output?`<p class="small">Expected output</p><pre class="output-example">${esc(card.output)}</pre>`:''}</section>`;
    const ref=practice?.reference||card.reference,refOutput=practice?.referenceOutput||card.referenceOutput;
    if(ref)html+=`<section class="reference visible-reference" aria-label="Reference code for a different scenario"><h2>${textPair(LESSON.L('Learn from a different example','参考另一个情境的示例','다른 상황의 예시로 배우기'))}</h2><p>${textPair(LESSON.L('Use this pattern to get started. Adapt it to your mission; it is not the solution to your task.','用这个模式开始，然后应用到自己的任务。它不是你任务的完整答案。','이 패턴으로 시작하고 여러분의 임무에 맞게 바꾸세요. 과제의 정답 코드는 아닙니다.'))}</p><pre><code>${esc(ref)}</code></pre>${refOutput?`<p class="small">${textPair(LESSON.L('This example produces:','这个示例的输出：','이 예시의 출력:'))}</p><pre class="reference-output">${esc(refOutput)}</pre>`:''}</section>`;
    if(card.type==='review')html+=reviewHTML();
    else{
      html+=`<section class="response-zone"><h2>${textPair(card.question)}</h2>`;
      if(card.type==='choice')html+=`<fieldset class="choices"><legend class="sr-only">Choose one response</legend>${card.options.map((o,i)=>`<label class="choice"><input type="radio" name="answer" value="${i}" ${r.answer===i?'checked':''}>${textPair(o)}</label>`).join('')}</fieldset>`;
      if(card.type==='checklist')html+=`<fieldset class="choices"><legend class="sr-only">Select goals you can demonstrate</legend>${card.options.map((o,i)=>`<label class="choice"><input type="checkbox" name="goal" value="${i}" ${(r.answer||[]).includes(i)?'checked':''}>${textPair(o)}</label>`).join('')}<label class="choice"><input type="checkbox" id="still-learning" ${r.stillLearning?'checked':''}>I still need help with these goals.${state.language==='zh'?'<span class="translation">这些目标我仍需要帮助。</span>':state.language==='ko'?'<span class="translation">이 목표들에 아직 도움이 필요해요.</span>':''}</label></fieldset>`;
      if(card.type==='short')html+=`<label class="sr-only" for="short-answer">Your answer</label><textarea id="short-answer" class="text-response" maxlength="2000" rows="3" placeholder="A short answer is enough. / 可以简短作答 / 짧게 답해도 됩니다.">${esc(r.answer||'')}</textarea>`;
      if(card.type==='coding'){
        if(!r.code){r.code=(card.carry&&response(card.carry).code)||card.starter;}
        html+=targetHTML(practice);
        html+=`<p class="small">Type your Python in the editor below, then choose <strong>Run & check</strong>. The console shows the real program output. Tab indents; Ctrl/⌘ + Enter runs. ${card.prefix?'The starting kit is supplied automatically.':''}</p><div class="editor-shell"><div class="editor-toolbar"><strong>🐾 Python Lab</strong><div><button id="run-code" class="primary">▶ Run & check</button><button id="stop-code" class="outline">■ Stop</button><button id="reset-code" class="text-button">Reset code</button></div></div><div class="editor-grid"><div class="code-pane"><label for="code-editor">Your code</label><textarea id="code-editor" class="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="runtime-note">${esc(r.code)}</textarea></div><section class="console-pane" aria-label="Python console"><h3>Console</h3><div id="console" class="console" role="log"><pre>${esc(r.stdout||'')}</pre>${r.error?`<p class="console-error">${esc(r.error)}</p>`:''}</div></section></div></div><p id="runtime-note" class="small">Real Python via the bundled Skulpt interpreter. This lab supports today’s list work; it is not the full desktop Python library. Infinite loops are stopped.</p>`;
      }
      html+=`<div class="check-row">${card.type==='coding'?'':`<button id="check-answer" class="outline">${card.type==='checklist'||card.answer===undefined&&!card.accepted&&!card.check?textPair(LESSON.L('Save my reflection','保存反思','성찰 저장')):textPair(LESSON.L('Check this response','检查答案','답 확인'))}</button>`}<button id="hint" class="text-button">${textPair(LESSON.L('Need a hint?','需要提示？','힌트가 필요한가요?'))}</button></div><div id="hint-box" class="hint-box" ${r.hintShown?'':'hidden'}>${hintHTML(card,r)}</div><div id="feedback" class="feedback ${r.feedback?.ok?'good':'improve'}" role="status" ${r.feedback?'':'hidden'}>${feedbackHTML(r.feedback)}</div></section>`;
      if(card.evidence)html+=evidenceHTML();
    }
    if(card.stage==='extension'||card.id==='pit-phase')html+=`<p class="small">${card.stage==='extension'?'Finished this challenge? Continue to the next one.':'Ready for more? Continue to Go Further.'} When your teacher calls time, save your work and use <button class="text-button" id="go-plenary">Go to plenary →</button>.</p>`;
    $('#card').innerHTML=html;
    $('#back').disabled=state.current===0;$('#next').textContent=card.type==='review'?'Export PDF →':card.stage==='pit'&&card.id==='pit-phase'?'Go Further →':'Continue →';
    $('#help-continue').hidden=card.type==='review';
    bindCard(card,r);
    all('[data-stage]').forEach(b=>b.onclick=()=>{const idx=cards.findIndex(c=>c.stage===b.dataset.stage);go(idx,b.dataset.stage==='review');});
  }
  function visualHTML(card){
    const src=`assets/images/0${card.image}-${LESSON.assets[card.image-1]}.png`;
    const captions={1:'Your crew’s mission · organise equipment, then adapt the kit.',2:'Read across: separate variables become one ordered list.',3:'Each element has a position. Python indexes begin at 0.',4:'Compare the whole-list output with one-element output.',5:'One indexed update replaces one element. The other values stay unchanged.'};
    const alts={1:'Rescue crew with a torch, map and water bottle.',2:'Separate variables for spanner, wire and battery are combined into one repair_kit list.',3:'Spanner at index 0, wire at index 1 and battery at index 2.',4:'Printing the whole repair_kit list is compared with printing one element.',5:'Before and after: the selected element changes while the others remain in place.'};
    return `<figure class="visual ${card.id==='mission'?'mission-visual':'teaching-visual'}"><button class="image-button" data-enlarge="${src}" aria-label="Enlarge illustration: ${esc(card.title)}"><img src="${src}" alt="${esc(alts[card.image])}" width="1448" height="1086"></button><figcaption>${esc(captions[card.image])} Select to enlarge.</figcaption></figure>`;
  }
  function renderPractice(card,r,p,stage){
    if(r.code===undefined)r.code=state.guidance==='steps'?card.guidedStarter:card.starter;
    const tier=({core:LESSON.L('Core · build your skills','基础 · 建立技能','기본 · 기능 익히기'),stretch:LESSON.L('Go deeper · apply and prove','深入 · 应用与验证','심화 · 적용하고 확인하기'),level1:LESSON.L('Level 1 · Apply','第 1 级 · 应用','1단계 · 적용'),level2:LESSON.L('Level 2 · Debug','第 2 级 · 调试','2단계 · 디버깅'),level3:LESSON.L('Level 3 · Automate','第 3 级 · 自动化','3단계 · 자동화')})[card.tier];
    let html=`<div class="card-top"><span class="pill">${textPair(tier)}</span><span class="small">${esc(stage[1])} · ${card.practiceNumber}/${card.stage==='extension'?9:6}</span></div><h1>${esc(card.title)}</h1><div class="reading compact-reading">${pairParagraph(card.reading)}</div><section class="your-job"><h2>${textPair(card.question)}</h2><p>${textPair(LESSON.L('Code HERE → Run & check → read Console','在本页写代码 → Run & check → 查看 Console','여기서 코딩 → Run & check → Console 확인'))}</p></section>`;
    if(r.previousEdition)html+=`<p class="revision-note">${textPair(LESSON.L('Your earlier code is kept. This question has changed: compare the new target and run again.','已保留之前的代码。本题已更新，请比较新目标，再运行。','이전 코드를 보존했습니다. 문제가 바뀌었으니 새 목표와 비교하고 다시 실행하세요.'))}</p>`;
    if(state.guidance==='steps')html+=`<ol class="action-steps">${card.steps.map(s=>`<li>${textPair(s)}</li>`).join('')}</ol>`;
    if(card.id==='print')html+=`<details class="picture-help"><summary>${textPair(LESSON.L('Picture help · a whole list or one item?','图片帮助 · 整个列表还是一个元素？','그림 도움 · 전체 리스트와 요소 하나'))}</summary>${visualHTML({...card,image:4})}</details>`;
    html+=`<div class="work-top"><section class="reference visible-reference"><h2>${textPair(LESSON.L('See the pattern · a different example','看写法 · 不同情境的示例','구조 보기 · 다른 예시'))}</h2><pre><code>${esc(p.reference)}</code></pre><p class="small">${textPair(LESSON.L('Its output','示例输出','예시 출력'))}</p><pre class="reference-output">${esc(p.referenceOutput)}</pre></section>${targetHTML(p)}</div>`;
    html+=`<section class="editor-shell" id="python-workspace"><div class="editor-toolbar"><strong>🐾 Python Lab</strong><div><button id="run-code" class="primary">▶ ${textPair(LESSON.L('Run & check','运行并检查','실행 및 확인'))}</button><button id="stop-code" class="outline">■ ${textPair(LESSON.L('Stop','停止','중지'))}</button><button id="reset-code" class="text-button">${textPair(LESSON.L('Load starter','载入起始代码','시작 코드 불러오기'))}</button></div></div><div class="editor-grid"><div class="code-pane"><label for="code-editor">1 · ${textPair(LESSON.L('Your code · type here','你的代码 · 在这里输入','내 코드 · 여기에 입력'))}</label><textarea id="code-editor" class="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="runtime-note">${esc(r.code)}</textarea></div><section class="console-pane" aria-label="Python console"><h3>2 · ${textPair(LESSON.L('Console · your result','控制台 · 你的结果','콘솔 · 내 결과'))}</h3><div id="console" class="console" role="log"><pre>${esc(r.stdout||'')}</pre>${r.error?`<p class="console-error">${esc(r.error)}</p>`:''}</div></section></div></section><p id="runtime-note" class="small">${textPair(LESSON.L('Run starts this card’s program again from the top. Tab indents. Ctrl/⌘ + Enter runs. Stop ends a stuck loop.','Run 从头重新运行本页程序。Tab 缩进，Ctrl/⌘ + Enter 运行。Stop 停止卡住的循环。','Run은 이 카드의 프로그램을 처음부터 다시 실행합니다. Tab은 들여쓰기, Ctrl/⌘ + Enter는 실행, Stop은 멈추지 않는 반복문을 중지합니다.'))}</p>`;
    html+=`<div class="check-row"><button id="hint" class="outline">${textPair(LESSON.L('Show my next hint','显示下一条提示','다음 힌트 보기'))}</button></div><div id="hint-box" class="hint-box" ${(r.hintCount||0)>0?'':'hidden'}>${hintHTML(card,r)}</div><div id="feedback" class="feedback ${r.feedback?.ok?'good':'improve'}" role="status" ${r.feedback?'':'hidden'}>${feedbackHTML(r.feedback)}</div>`;
    if(card.evidence)html+=evidenceHTML();
    const route=card.stage==='main1'?['main2',LESSON.L('Continue to Main Task 2','前往主任务 2','Main Task 2로 이동')]:card.stage==='main2'?['pit',LESSON.L('Continue to Learning Pit Stop','前往学习检查点','Learning Pit Stop으로 이동')]:['plenary',LESSON.L('Teacher called time? Go to Plenary','老师提醒时间到了？前往总结','수업 마무리 시간인가요? Plenary로 이동')];
    if(card.practiceNumber>=3||card.stage==='extension')html+=`<div class="route-choice"><p>${textPair(LESSON.L('Keep going for a harder challenge. If you need more time or your teacher calls time, save your work and move on. Unattempted challenges are not marked as failures.','可继续挑战更难题目。需要更多时间或老师提醒时间到时，保存后前往下一阶段。未尝试的挑战不会标为失败。','더 어려운 도전을 계속할 수 있습니다. 시간이 더 필요하거나 선생님이 마무리를 알리면 저장하고 다음 단계로 가세요. 시도하지 않은 도전은 실패가 아닙니다.'))}</p><button id="stage-forward" class="outline" data-destination="${route[0]}">${textPair(route[1])} →</button></div>`;
    $('#card').innerHTML=html;$('#back').disabled=state.current===0;$('#next').textContent=translate(LESSON.L('Next practice →','下一练习 →','다음 연습 →'));$('#help-continue').hidden=false;bindCard(card,r);
    if($('#stage-forward'))$('#stage-forward').onclick=()=>go(cards.findIndex(c=>c.stage===route[0]),true);
    all('[data-stage]').forEach(b=>b.onclick=()=>go(cards.findIndex(c=>c.stage===b.dataset.stage),b.dataset.stage==='review'));
  }
  function targetHTML(goal){
    if(!goal)return '';
    const icons={torch:'🔦',map:'🗺️',water:'💧',compass:'🧭',radio:'📻',blanket:'🛏️',shield:'🛡️',boots:'🥾',potion:'🧪',cap:'🧢',shirt:'👕',trainers:'👟',coin:'🪙',key:'🔑',gem:'💎',calm:'🌙',dance:'🎵',rock:'🎸',chill:'🌴',wave:'👋',peace:'✌️',star:'⭐',jump:'🕴️',red:'🔴',blue:'🔵',gold:'🟡',green:'🟢'};
    let html=`<section class="task-target" aria-label="Your task target"><div class="target-heading"><span class="target-icon" aria-hidden="true">◎</span><h3>${textPair(goal.empty?LESSON.L('Your target · store these three items','你的目标 · 保存这三件物品','목표 · 세 물건 저장하기'):LESSON.L('Your target · expected output','你的目标 · 预期输出','목표 · 예상 출력'))}</h3></div>`;
    if(goal.initial)html+=`<div class="index-heading"><code>${esc(goal.variable)}</code> · ${textPair(LESSON.L('starting list · indexes start at 0','起始列表 · 索引从 0 开始','시작 리스트 · 인덱스는 0부터'))}</div><div class="target-kit" aria-label="Starting values and indexes" style="--slots:${goal.initial.length}">${goal.initial.map((item,i)=>`<div class="kit-tile"><small>index ${i}</small>${goal.labels?`<span class="slot-label">${esc(goal.labels[i])}</span>`:''}<span aria-hidden="true">${icons[item]||'▣'}</span><strong>${esc(item)}</strong></div>`).join('')}</div>`;
    if(goal.empty)html+=`<div class="target-console empty-console"><span class="terminal-label">Python console</span><p>${textPair(LESSON.L('No output yet — creating a list stores the values.','暂时没有输出——创建列表只保存值。','아직 출력 없음 — 리스트를 만들면 값이 저장됩니다.'))}</p></div>`;
    else html+=`<div class="target-row"><p class="target-row-label">${textPair(LESSON.L('Console · '+goal.rows.length+' line(s), in this order','控制台 · '+goal.rows.length+' 行，按此顺序','콘솔 · 아래 순서로 '+goal.rows.length+'줄'))}</p><pre class="target-console">${esc(goal.rows.map(row=>row.text).join('\n'))}</pre></div>`;
    if(goal.cases?.length)html+=`<details class="target-tests" ${goal.tier==='core'?'':'open'}><summary>${textPair(LESSON.L('Also tested: changed data','还要测试：改变数据','추가 테스트: 데이터 변경'))} (${goal.cases.length})</summary>${goal.cases.map((example,i)=>`<section class="target-test"><p><strong>Test ${i+2} · ${textPair(LESSON.L('Starting data','起始数据','시작 데이터'))}</strong></p><pre>${esc(example.input)}</pre><p><strong>${textPair(LESSON.L('Expected output','预期输出','예상 출력'))}</strong></p><pre class="target-console">${esc(example.output)}</pre></section>`).join('')}</details>`;
    return html+'</section>';
  }
  function hintHTML(card,r={}){if(card.hints)return card.hints.slice(0,r.hintCount||0).map((h,i)=>`<p><strong>Hint ${i+1}</strong> · ${textPair(h)}</p>`).join('');const content=card.explainSupport||card.hint||card.explain||LESSON.L('Read the example one line at a time. You can save as needs help and continue.','逐行阅读示例。可保存为需要帮助并继续。','예시를 한 줄씩 읽으세요. 도움 필요로 저장하고 계속할 수 있습니다.');return pairParagraph(content);}
  function feedbackHTML(f){if(!f)return '';return `<strong>${textPair(f.ok?LESSON.L('Check met','检查通过','확인 완료'):LESSON.L('Try one improvement','尝试改进一处','한 곳 개선하기'))}</strong>${pairParagraph(f.support||f.message)}${f.actual!==undefined?`<div class="feedback-compare"><div><span>${textPair(LESSON.L('Your result','你的结果','내 결과'))}</span><pre>${esc(f.actual||'(no output)')}</pre></div><div><span>${textPair(LESSON.L('Target','目标','목표'))}</span><pre>${esc(f.expected)}</pre></div></div>`:''}${f.tests?.length?`<p class="small">${f.tests.map(t=>`Test ${t.test}: ${t.ok?'✓':'↻'}`).join(' · ')}</p>`:''}`;}
  function feedback(r,ok,message,status,support,details={}){r.feedback={ok,message,support,...details};r.status=status||(ok?'correct':'needs-review');const el=$('#feedback');el.hidden=false;el.className='feedback '+(ok?'good':'improve');el.innerHTML=feedbackHTML(r.feedback);updatePracticeProgress();save();}
  function logAttempt(r,data){const attempt={...data,time:now()};r.attempts.push(attempt);if(r.attempts.length>60)r.attempts.shift();r.checkedAt=now();trace('attempt',attempt);}
  function bindCard(card,r){
    all('input[name="answer"]').forEach(i=>i.onchange=()=>{r.answer=Number(i.value);trace('field',{field:'answer',value:r.answer});invalidate(r);save();});
    all('input[name="goal"]').forEach(i=>i.onchange=()=>{r.answer=all('input[name="goal"]:checked').map(x=>Number(x.value));trace('field',{field:'goals',value:r.answer});invalidate(r);save();});
    if($('#still-learning'))$('#still-learning').onchange=e=>{r.stillLearning=e.target.checked;trace('field',{field:'stillLearning',value:r.stillLearning});invalidate(r);save();};
    if($('#short-answer'))$('#short-answer').oninput=e=>{r.answer=e.target.value;trace('field',{field:'answer',value:r.answer},card.id,'answer');invalidate(r);save();};
    if($('#check-answer'))$('#check-answer').onclick=()=>{
      if(!hasResponse(card,r)){toast('Choose or write a response first, or use Save as needs help and continue.');return;}
      let ok=true, message=card.explain||'Reflection saved. Use your work as evidence when you discuss it.',status='reflected';
      if(card.type==='choice'&&card.answer!==undefined){ok=r.answer===card.answer;status=ok?'correct':'needs-review';message=ok?'Correct. '+card.explain:'Not yet. '+card.explain+' You can try again or continue with this attempt saved.';}
      if(card.type==='short'){
        ok=card.accepted?card.accepted.includes(String(r.answer).trim()):ListsChecks.listLine(String(r.answer).trim(),['helmet','radio','blanket']);status=ok?'correct':'needs-review';message=(ok?'Correct. ':'Compare and improve: ')+card.explain;
      }
      logAttempt(r,{answer:r.answer,ok,message,edition:2});feedback(r,ok,message,status,card.explainSupport);
    };
    if($('#hint'))$('#hint').onclick=()=>{r.hintShown=true;if(card.hints)r.hintCount=Math.min(card.hints.length,(r.hintCount||0)+1);trace('action',{action:'hint_opened',count:r.hintCount||1});$('#hint-box').innerHTML=hintHTML(card,r);$('#hint-box').hidden=false;if(card.hints&&r.hintCount===card.hints.length){$('#hint').textContent=translate(LESSON.L('All hints shown','全部提示已显示','모든 힌트 표시됨'));$('#hint').disabled=true;}save();};
    if($('#hint')&&card.hints&&(r.hintCount||0)>=card.hints.length){$('#hint').textContent=translate(LESSON.L('All hints shown','全部提示已显示','모든 힌트 표시됨'));$('#hint').disabled=true;}
    if(card.type==='coding'){
      $('#code-editor').maxLength=30000;$('#code-editor').oninput=e=>{r.code=e.target.value;trace('field',{field:'code',value:r.code},card.id,'code');invalidate(r);save();};
      $('#code-editor').onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();const el=e.target;el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input'));}if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runCard(card,r);}};
      $('#run-code').onclick=()=>runCard(card,r);$('#stop-code').onclick=()=>{trace('action',{action:'stop_program'});PythonRunner.stop();};
      $('#reset-code').onclick=()=>{if(checking)return;if(confirm(translate(LESSON.L('Load this card’s starter? Your current draft will be replaced; previous runs stay in your report.','载入本页起始代码？当前草稿会被替换，先前运行记录仍保留在报告中。','이 카드의 시작 코드를 불러올까요? 현재 초안은 바뀌지만 이전 실행 기록은 보고서에 남습니다.')))){r.code=state.guidance==='steps'?card.guidedStarter:card.starter;trace('field',{field:'code',action:'load_starter',value:r.code});r.stdout='';r.error=null;invalidate(r);save();render();}};
    }
    all('[data-enlarge]').forEach(button=>{button.onclick=()=>{$('#enlarged-image').src=button.dataset.enlarge;$('#enlarged-image').alt=card.title;$('#image-caption').textContent=card.title;$('#image-dialog').showModal();};button.querySelector('img').onerror=()=>{button.outerHTML='<p class="small">Illustration unavailable. The written instructions and code example contain everything needed.</p>';};});
    if($('#go-plenary'))$('#go-plenary').onclick=()=>go(cards.findIndex(c=>c.stage==='plenary'),true);
    if(card.evidence)bindEvidence();
    if(card.type==='review'){$('#final-pdf').onclick=exportPDF;$('#final-backup').onclick=backup;}
  }
  function invalidate(r){r.feedback=null;r.status='in-progress';const f=$('#feedback');if(f)f.hidden=true;updatePracticeProgress();}
  function hasResponse(card,r){return card.type==='coding'?r.code?.trim():card.type==='checklist'?(r.answer?.length||r.stillLearning):card.type==='choice'?Number.isInteger(r.answer):String(r.answer||'').trim().length>0;}
  async function runCard(card,r){
    if(PythonRunner.busy()||checking)return;checking=true;
    const button=$('#run-code'),editor=$('#code-editor');button.disabled=true;editor.readOnly=true;button.textContent=translate(LESSON.L('Running…','运行中…','실행 중…'));const consoleEl=$('#console');consoleEl.replaceChildren();const output=document.createElement('pre');consoleEl.append(output);
    const source=r.code;save(true);
    try{const result=await PythonRunner.run((card.prefix||'')+source,s=>{output.textContent+=s;consoleEl.scrollTop=consoleEl.scrollHeight;},prompt=>new Promise(resolve=>{
      const form=document.createElement('form');form.className='prompt-form';const label=document.createElement('label');label.textContent=prompt;const input=document.createElement('input');input.maxLength=2000;input.setAttribute('aria-label',prompt||'Python input');label.append(input);form.append(label);consoleEl.append(form);input.focus();form.onsubmit=e=>{e.preventDefault();trace('console_input',{prompt,value:input.value});output.textContent+=prompt+input.value+'\n';form.remove();resolve(input.value);};
    }));
    r.stdout=result.stdout;r.error=result.error;
    if(result.error){const p=document.createElement('p');p.className='console-error';p.textContent=result.error;consoleEl.append(p);}
    let check=ListsChecks.evaluate(card.check,source,result);
    if(check.ok&&ListsPractice.get(card.check)?.tests?.length)check=await ListsChecks.testCases(card.check,source,code=>PythonRunner.run(code));
    logAttempt(r,{code:source,stdout:result.stdout,error:result.error,ok:check.ok,message:check.message,tests:check.tests||[],guidance:state.guidance,hints:r.hintCount||0,edition:2});
    feedback(r,check.ok,check.message,undefined,check.support,{actual:check.actual,expected:check.expected,tests:check.tests||[]});
    }catch(error){r.error=String(error?.message||error);logAttempt(r,{code:source,error:r.error,ok:false,message:'The runner could not finish. Your code is saved; reload or save as needs help.',edition:2});feedback(r,false,'The runner could not finish. Your code is saved; reload or save as needs help.',undefined,LESSON.L('Your code is saved. Try again, or save as needs help and continue.','代码已保存。可重试，或保存为需要帮助并继续。','코드가 저장되었습니다. 다시 시도하거나 도움 필요로 저장하고 계속하세요.'));}
    finally{checking=false;button.disabled=false;editor.readOnly=false;button.innerHTML='▶ '+textPair(LESSON.L('Run & check','运行并检查','실행 및 확인'));}
  }
  function go(index,force=false){
    if(PythonRunner.busy()||checking){toast(translate(LESSON.L('Stop or finish the running program before moving.','请停止或等待程序结束后再前往下一页。','프로그램을 멈추거나 끝낸 뒤 이동하세요.')));return;}
    if(index<0||index>=cards.length)return;
    if(!teacher&&!force&&index>state.furthest)return;
    trace('navigate',{from:cards[state.current].id,to:cards[index].id});state.current=index;state.furthest=Math.max(state.furthest,index);save(true);render();$('#card').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  }
  function continueCard(needsHelp=false){
    if(PythonRunner.busy()||checking){toast('Stop or finish your program first.');return;}
    const card=cards[state.current],r=response(card.id);
    if(card.type==='review'){exportPDF();return;}
    if(needsHelp){r.status='needs-help';r.helpRequested=now();trace('action',{action:'help_requested'});}
    else if(!teacher&&!r.checkedAt){$('#nav-message').textContent=translate(LESSON.L('Run/check first, or save as needs help and continue. A wrong answer does not lock you out.','请先运行或检查，或选择保存为需要帮助并继续。答错不会锁住进度。','먼저 실행/확인하거나 도움 필요로 저장하고 계속하세요. 틀려도 진행이 막히지 않습니다.'));return;}
    go(state.current+1,true);
  }
  function evidenceHTML(){return `<details class="evidence-section" ${evidence?'open':''}><summary>Add a screenshot · code and output already save automatically</summary><p class="small">You may attach one screenshot; it is not required to continue. Avoid names or faces of other students.</p><label for="evidence-file">Choose an image (PNG/JPEG/WebP, up to 8 MB)</label><input id="evidence-file" type="file" accept="image/png,image/jpeg,image/webp"><div id="paste-target" class="paste-target" tabindex="0" role="group" aria-label="Paste a screenshot here">Select here, then paste a screenshot with Ctrl/⌘ + V.</div><div id="evidence-preview">${evidence?`<img src="${evidence.data}" alt="Your evidence screenshot"><button id="remove-evidence" class="text-button">Remove image</button>`:''}</div><label for="evidence-caption">Image caption</label><input id="evidence-caption" maxlength="300" value="${esc(evidence?.caption||'')}"><p id="image-status" class="small" role="status"></p></details>`;}
  function bindEvidence(){
    $('#evidence-file').onchange=e=>uploadImage(e.target.files[0]);
    $('#paste-target').onpaste=e=>{const file=[...e.clipboardData.items].find(i=>i.type.startsWith('image/'))?.getAsFile();if(file){e.preventDefault();uploadImage(file);}else $('#image-status').textContent='No image found in the clipboard. Choose an image file instead.';};
    $('#evidence-caption').oninput=async e=>{if(!evidence)return;evidence.caption=e.target.value;trace('evidence',{action:'caption',value:evidence.caption},'independent','caption');window.ListsCloud?.setEvidence(evidence);try{await imageStore('put',evidence);}catch{$('#image-status').textContent='Image save failed. Download a backup now.';}save();};
    if($('#remove-evidence'))$('#remove-evidence').onclick=async()=>{if(confirm('Remove this evidence image from your report and the school’s current evidence? The action remains in the learning log.')){try{await imageStore('delete');evidence=null;trace('evidence',{action:'remove'},'independent');window.ListsCloud?.setEvidence(null);render();save();}catch{toast('Could not remove stored image.');}}};
  }
  async function uploadImage(file){
    if(!file)return;const status=$('#image-status');
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){status.textContent='Choose a PNG, JPEG or WebP image smaller than 8 MB.';return;}
    try{status.textContent='Preparing screenshot…';const bitmap=await createImageBitmap(file),scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const candidate={data:canvas.toDataURL('image/jpeg',0.88),caption:$('#evidence-caption').value,time:now(),stage:'independent'};await imageStore('put',candidate);evidence=candidate;trace('evidence',{action:'upload',caption:candidate.caption,size:candidate.data.length},'independent');window.ListsCloud?.setEvidence(evidence);render();$('#image-status').textContent='Image saved here and queued for school save. It is included in your backup and PDF.';save();}catch{status.textContent='This browser could not save the image. Try another image or use a backup-compatible browser. Your code is still saved.';}
  }
  function reviewHTML(){
    const attempted=cards.filter(c=>response(c.id).checkedAt).length,correct=cards.filter(c=>response(c.id).status==='correct').length;
    return `<div class="summary-grid"><div class="summary-stat"><strong>${attempted}</strong><span>cards attempted</span></div><div class="summary-stat"><strong>${correct}</strong><span>checks met (not a grade)</span></div><div class="summary-stat"><strong>${cards.filter(c=>response(c.id).status==='needs-help').length}</strong><span>help requests</span></div></div><div class="check-row"><button id="final-pdf" class="primary">Download current report PDF</button><button id="final-backup" class="outline">Download editable backup</button></div><p class="small">PDF for submission · JSON backup for continuing on another device. Your optional image is included in both. Unattempted challenges are not failures or missing compulsory work.</p>${cards.filter(c=>c.type!=='review').map(c=>{const r=response(c.id),label=c.tier&&c.tier!=='core'&&r.status==='not-completed'?'Not attempted · challenge bank':statusLabel(r.status);return `<details class="review-item"><summary>${esc(c.title)} — ${label}</summary><p>${esc(answerLabel(c,r))}</p>${r.code?`<pre>${esc(r.code)}</pre><pre>${esc(r.stdout||'(no output)')}</pre>`:''}${r.feedback?feedbackHTML(r.feedback):''}<button class="text-button" data-review-card="${c.id}" onclick="window.ListsApp.goToCard('${c.id}')">Revisit this card →</button></details>`;}).join('')}`;
  }
  function answerLabel(c,r){if(r.answer===undefined)return 'Not completed';if(c.type==='choice')return en(c.options[r.answer]);if(c.type==='checklist')return (r.answer||[]).map(i=>en(c.options[i])).join('; ')+(r.stillLearning?'; Still needs help':'');return String(r.answer);}
  function statusLabel(s){return ({'not-completed':'Not completed','in-progress':'In progress','correct':'Checks met','reflected':'Reflection saved','needs-review':'Attempted — review needed','needs-help':'Needs help','reviewed':'Reviewed'})[s]||'Not completed';}
  function download(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function filename(ext){const safe=s=>String(s).normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu,'_').slice(0,85);return `Year8_${safe(state.className)}_${safe(state.name)}_Python_Lists_Theory.${ext}`;}
  function backup(){trace('export',{format:'json',action:'backup'});save(true);const data={...state,evidence};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),filename('json'));state.lastBackup=now();save();toast('Backup downloaded. Keep it private: it contains your name and work.');}
  function validBackup(v){
    if(!v||v.lessonId!==LESSON.id||v.schemaVersion!==1||typeof v.name!=='string'||v.name.length>80||!['8T','8E'].includes(v.className)||!['en','zh','ko'].includes(v.language)||!v.responses||typeof v.responses!=='object'||Array.isArray(v.responses))return false;
    if(v.contentVersion!==undefined&&![1,2].includes(v.contentVersion))return false;
    if(v.guidance!==undefined&&!['steps','independent'].includes(v.guidance))return false;
    if(!Number.isInteger(v.current)||v.current<0||v.current>=cards.length||!Number.isInteger(v.furthest)||v.furthest<0||v.furthest>=cards.length)return false;
    if(v.evidence&&(typeof v.evidence.data!=='string'||v.evidence.data.length>6e6||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v.evidence.data)))return false;
    for(const [id,r] of Object.entries(v.responses)){if(!cards.some(c=>c.id===id)||!r||typeof r!=='object'||!Array.isArray(r.attempts)||r.attempts.length>60||typeof r.status!=='string')return false;if(r.code!==undefined&&(typeof r.code!=='string'||r.code.length>30000))return false;if(r.answer!==undefined&&typeof r.answer!=='string'&&typeof r.answer!=='number'&&!Array.isArray(r.answer))return false;}
    return true;
  }
  async function importBackup(file){
    if(!file)return;if(checking){toast('Finish or stop the program before restoring.');return;}try{
      if(file.size>10*1024*1024)throw new Error('Backup too large (maximum 10 MB).');const v=JSON.parse(await file.text());if(!validBackup(v))throw new Error('This is not a valid backup for this lesson.');
      if(!confirm('Replace the current browser progress with '+v.name+'’s backup? Download your current backup first if needed.'))return;
      trace('restore',{action:'replace_from_backup'});window.ListsCloud?.stop();teacher=v.teacher===true;state={...v};delete state.evidence;evidence=v.evidence||null;
      try{if(evidence)await imageStore('put',evidence);else await imageStore('delete');}catch{throw new Error('Could not restore image storage. Current text backup is still in your file.');}
      $('#tools-dialog').close();await showApp();toast('Backup restored, including any saved image.');
    }catch(error){alert('Could not import: '+error.message);}finally{$('#backup-input').value='';}
  }
  async function exportPDF(){
    if(exporting)return;
    if(PythonRunner.busy()||checking){toast('Finish or stop your program before exporting.');return;}
    exporting=true;save(true);$('#export-pdf').disabled=true;$('#export-pdf').textContent='Preparing…';
    try{trace('export',{format:'pdf',action:'start'});await ListsReport.exportPDF(state,evidence,filename('pdf'));trace('export',{format:'pdf',action:'downloaded'});$('#download-name').textContent='Downloaded: '+filename('pdf');$('#teams-confirm').checked=!!state.teamsSubmitted;$('#finish-submission').disabled=!state.teamsSubmitted;$('#submission-dialog').showModal();}
    catch(error){toast('PDF could not be generated. Use Work tools → Print / Save as PDF.');console.error(error);}
    finally{exporting=false;$('#export-pdf').disabled=false;$('#export-pdf').textContent='Export PDF';}
  }
  $('#entry-form').onsubmit=async e=>{e.preventDefault();const name=$('#full-name').value.replace(/[\x00-\x1f\x7f]/g,'').trim(),cls=$('#class-name').value;teacher=name.toLowerCase()==='teacher';if(!teacher&&(name.length<2||!cls)){$('#entry-error').textContent='Enter your name and choose your class to start.';return;}
    let saved;try{saved=JSON.parse(localStorage.getItem(key()));}catch{}
    if(saved&&saved.lessonId===LESSON.id&&((teacher)||saved.name===name&&saved.className===cls))state=saved;
    else{if(saved&&!confirm('Start a different learner? This replaces the browser’s current text progress. Export a backup first if you need it.'))return;state=fresh(teacher?'Test Student':name,cls||'8T',$('#entry-language').value);try{await imageStore('delete');}catch{}}
    state.language=$('#entry-language').value;state.guidance=$('#entry-guidance').value;await showApp();
  };
  $('#start-mission').disabled=false;$('#start-mission').textContent='Start the mission →';
  $('#entry-language').onchange=e=>{$('#entry-support').textContent=e.target.value==='zh'?'每页提供英文和中文支持。Python 代码保持不变。可随时更改。':e.target.value==='ko'?'각 카드에 영어와 한국어 도움말을 함께 표시합니다. Python 코드는 바뀌지 않습니다. 언제든 변경할 수 있습니다.':'Choose support now. You can change it on any learning card. Python code stays the same.';};
  $('#support-language').onchange=e=>{if(checking){e.target.value=state.language;return;}state.language=e.target.value;trace('support',{field:'language',value:state.language});save();render();};
  $('#guidance-mode').onchange=e=>{if(checking){e.target.value=state.guidance;return;}state.guidance=e.target.value;trace('support',{field:'guidance',value:state.guidance});save();render();toast(translate(LESSON.L('Guidance changed; your draft is kept. Use Load starter if you want a fresh supported start.','帮助方式已更改，草稿已保留。若需要新的辅助起始代码，请点击 Load starter。','도움 설정이 바뀌었으며 초안은 유지됩니다. 지원되는 새 시작 코드가 필요하면 Load starter를 누르세요.')));};
  $('#back').onclick=()=>go(state.current-1);$('#next').onclick=()=>continueCard();$('#help-continue').onclick=()=>continueCard(true);
  $('#brand-home').onclick=e=>{e.preventDefault();go(0);};$('#export-pdf').onclick=exportPDF;
  $('#work-tools').onclick=()=>$('#tools-dialog').showModal();$('#backup').onclick=backup;
  $('#restore').onclick=$('#restore-entry').onclick=()=>$('#backup-input').click();$('#backup-input').onchange=e=>importBackup(e.target.files[0]);
  $('#print-report').onclick=async()=>{if(checking){toast('Finish or stop your program first.');return;}trace('export',{format:'print'});save(true);await ListsReport.build(state,evidence);$('#tools-dialog').close();window.print();};
  $('#switch-student').onclick=()=>{if(checking){toast('Finish or stop your program first.');return;}trace('action',{action:'switch_learner'});save(true);window.ListsCloud?.stop();$('#tools-dialog').close();$('#lesson-app').hidden=true;$('#landing').hidden=false;$('#full-name').value='';$('#class-name').value='';$('#report-root').replaceChildren();state=null;evidence=null;};
  $('#reset').onclick=async()=>{if(checking){toast('Finish or stop your program first.');return;}if(confirm('Reset this learner’s local responses and current image? Earlier school learning records are retained; this starts a new work session.')){trace('reset',{action:'new_work_session'});save(true);window.ListsCloud?.stop();const old=state;state=fresh(old.name,old.className,old.language);state.guidance=old.guidance;try{await imageStore('delete');}catch{}evidence=null;$('#tools-dialog').close();await window.ListsCloud?.start(state,evidence);save(true);render();toast('New local work session started. Earlier school records and downloaded backups were not removed.');}};
  $('#teams-confirm').onchange=e=>{trace('teams',{action:'confirmation_checkbox',value:e.target.checked});$('#finish-submission').disabled=!e.target.checked;};$('#finish-submission').onclick=()=>{state.teamsSubmitted=true;state.teamsSubmittedAt=now();trace('teams',{action:'student_confirmed_turn_in',verifiedByTeams:false});save();$('#submission-thanks').textContent='Thank you. Your submission confirmation has been saved. If you have time, revisit a Go Further challenge or explain an index to a partner.';};
  window.addEventListener('lists-cloud-identity',()=>save(true));
  window.addEventListener('beforeunload',()=>{if(state)save(true);});
  window.ListsApp={goToCard:id=>go(cards.findIndex(c=>c.id===id),teacher),getState:()=>structuredClone(state),validBackup};
  (async()=>{try{
    if(new URLSearchParams(location.search).get('teacher')==='1'){teacher=true;state=JSON.parse(localStorage.getItem(key()))||fresh('Test Student','8T','en');await showApp();return;}
    teacher=false;const saved=JSON.parse(localStorage.getItem(key()));if(saved&&validBackup({...saved,evidence:null})){state=saved;await showApp();}
  }catch{toast('No saved session found. Start a new mission.');}})();
})();
