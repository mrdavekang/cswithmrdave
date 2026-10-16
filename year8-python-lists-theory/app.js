(() => {
  'use strict';
  const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cards=LESSON.cards;let teacher=false,state=null,saveTimer,saveFailed=false,evidence=null,exporting=false;
  const key=()=>teacher?'rescue-lists-teacher-v1':'rescue-lists-student-v1';
  const translate=(v,lang=state?.language||'en')=>typeof v==='object'&&v!==null?(v[lang]||v.en):v;
  const en=v=>translate(v,'en');
  const textPair=v=>`<span>${esc(en(v))}</span>${state.language!=='en'&&translate(v)!==en(v)?`<span class="translation" lang="${state.language==='zh'?'zh-Hans':'ko'}">${esc(translate(v))}</span>`:''}`;
  const pairParagraph=v=>`<p>${esc(en(v))}</p>${state.language!=='en'&&translate(v)!==en(v)?`<p class="support-text" lang="${state.language==='zh'?'zh-Hans':'ko'}">${esc(translate(v))}</p>`:''}`;
  const now=()=>new Date().toISOString();
  function fresh(name,cls,language){return {lessonId:LESSON.id,schemaVersion:1,name,className:cls,language,teacher,current:0,furthest:0,responses:{},started:now(),updated:now(),teamsSubmitted:false};}
  function response(id){return state.responses[id]||(state.responses[id]={attempts:[],status:'not-completed'});}
  function save(immediate=false){
    if(!state)return;
    $('#save-status').textContent='Saving…';clearTimeout(saveTimer);
    const write=()=>{try{state.updated=now();localStorage.setItem(key(),JSON.stringify(state));$('#save-status').textContent='Saved locally';saveFailed=false;}catch{$('#save-status').textContent='Save failed — download a backup';saveFailed=true;}};
    if(immediate)write();else saveTimer=setTimeout(write,250);
  }
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3500);}
  function db(){return new Promise((resolve,reject)=>{if(!window.indexedDB){reject(new Error('Image storage is unavailable'));return;}const req=indexedDB.open('rescue-lists-evidence',1);req.onupgradeneeded=()=>req.result.createObjectStore('images');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function imageStore(action,value){const database=await db();return new Promise((resolve,reject)=>{const tx=database.transaction('images',action==='get'?'readonly':'readwrite'),store=tx.objectStore('images');let req;if(action==='get')req=store.get(key());else if(action==='put')req=store.put(value,key());else req=store.delete(key());let result;req.onsuccess=()=>result=req.result;tx.oncomplete=()=>{database.close();resolve(result);};tx.onerror=()=>{database.close();reject(tx.error);};});}
  async function showApp(){
    $('#landing').hidden=true;$('#lesson-app').hidden=false;
    $('#student-label').textContent=state.name+' · '+state.className;$('#teacher-badge').hidden=!teacher;
    $('#support-language').value=state.language;
    try{evidence=await imageStore('get')||null;}catch{evidence=null;}
    render();save(true);
  }
  function render(){
    const card=cards[state.current],r=response(card.id);$('#nav-message').textContent='';
    const stage=LESSON.stages.find(x=>x[0]===card.stage),stageCards=cards.filter(c=>c.stage===card.stage);
    $('#card-location').textContent=`${stage[1]} · Card ${stageCards.indexOf(card)+1} of ${stageCards.length}`;
    $('#sidebar-support').textContent=state.language==='zh'?'列表保存相关值；索引从 0 开始；更新替换一个元素。':state.language==='ko'?'리스트는 관련 값을 저장합니다. 인덱스는 0부터 시작합니다. 업데이트는 요소 하나를 바꿉니다.':'';
    $('#stage-nav').innerHTML=LESSON.stages.map(([id,title])=>{
      const index=cards.findIndex(c=>c.stage===id),isCurrent=card.stage===id,group=cards.filter(c=>c.stage===id),done=group.every(c=>['correct','reflected','reviewed'].includes(response(c.id).status));
      return `<button data-stage="${id}" ${!teacher&&index>state.furthest?'disabled':''} ${isCurrent?'aria-current="step"':''}><span class="dot ${done?'done':''}">${done?'✓':LESSON.stages.findIndex(s=>s[0]===id)+1}</span>${esc(title)}</button>`;
    }).join('');
    const practice=ListsPractice.get(card.id);
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
      html+=`<div class="check-row">${card.type==='coding'?'':`<button id="check-answer" class="outline">${card.type==='checklist'||card.answer===undefined&&!card.accepted&&!card.check?'Save my reflection':'Check this response'}</button>`}<button id="hint" class="text-button">Need a hint?</button></div><div id="hint-box" class="hint-box" ${r.hintShown?'':'hidden'}>${hintHTML(card)}</div><div id="feedback" class="feedback ${r.feedback?.ok?'good':'improve'}" role="status" ${r.feedback?'':'hidden'}>${esc(r.feedback?.message||'')}</div></section>`;
      if(card.evidence)html+=evidenceHTML();
    }
    if(card.stage==='extension'||card.id==='pit-phase')html+=`<p class="small">${card.stage==='extension'?'Finished this challenge? Continue to the next one.':'Ready for more? Continue to Go Further.'} When your teacher calls time, save your work and use <button class="text-button" id="go-plenary">Go to plenary →</button>.</p>`;
    $('#card').innerHTML=html;
    $('#back').disabled=state.current===0;$('#next').textContent=card.type==='review'?'Export PDF →':card.stage==='pit'&&card.id==='pit-phase'?'Go Further →':'Continue →';
    $('#help-continue').hidden=card.type==='review';
    bindCard(card,r);
    all('[data-stage]').forEach(b=>b.onclick=()=>{const idx=cards.findIndex(c=>c.stage===b.dataset.stage);go(idx);});
  }
  function visualHTML(card){
    const src=`assets/images/0${card.image}-${LESSON.assets[card.image-1]}.png`;
    const captions={1:'Your crew’s mission · organise equipment, then adapt the kit.',2:'Read across: separate variables become one ordered list.',3:'Each element has a position. Python indexes begin at 0.',4:'Compare the whole-list output with one-element output.',5:'One indexed update replaces one element. The other values stay unchanged.'};
    const alts={1:'Rescue crew with a torch, map and water bottle.',2:'Separate variables for spanner, wire and battery are combined into one repair_kit list.',3:'Spanner at index 0, wire at index 1 and battery at index 2.',4:'Printing the whole repair_kit list is compared with printing one element.',5:'Before and after: the selected element changes while the others remain in place.'};
    return `<figure class="visual ${card.id==='mission'?'mission-visual':'teaching-visual'}"><button class="image-button" data-enlarge="${src}" aria-label="Enlarge illustration: ${esc(card.title)}"><img src="${src}" alt="${esc(alts[card.image])}" width="1448" height="1086"></button><figcaption>${esc(captions[card.image])} Select to enlarge.</figcaption></figure>`;
  }
  function targetHTML(goal){
    if(!goal)return '';
    const icons={torch:'🔦',map:'🗺️',water:'💧',compass:'🧭'};
    let html=`<section class="task-target" aria-label="Your task target"><div class="target-heading"><span class="target-icon" aria-hidden="true">◎</span><h3>${textPair(goal.empty?LESSON.L('Your target · store these three items','你的目标 · 保存这三件物品','목표 · 세 물건 저장하기'):LESSON.L('Your target · expected output','你的目标 · 预期输出','목표 · 예상 출력'))}</h3></div>`;
    if(goal.kit)html+=`<div class="target-kit" aria-label="Required kit">${goal.kit.map(item=>`<div class="kit-tile"><span aria-hidden="true">${icons[item]||'▣'}</span><strong>${esc(item)}</strong></div>`).join('')}</div>`;
    if(goal.empty)html+=`<div class="target-console empty-console"><span class="terminal-label">Python console</span><p>${textPair(LESSON.L('No output yet — creating a list stores the values.','暂时没有输出——创建列表只保存值。','아직 출력 없음 — 리스트를 만들면 값이 저장됩니다.'))}</p></div>`;
    else html+=goal.rows.map(row=>`<div class="target-row"><p class="target-row-label">${textPair(row.label)}</p><pre class="target-console">${esc(row.text)}</pre></div>`).join('');
    html+=`<div class="target-note">${pairParagraph(goal.note)}</div>`;
    if(goal.cases)html+=`<div class="target-tests"><h4>${textPair(LESSON.L('It must also work when the kit changes','装备改变后也必须正确运行','장비가 바뀌어도 작동해야 합니다'))}</h4>${goal.cases.map((example,i)=>`<section class="target-test"><p><strong>Test ${i+2} · ${textPair(LESSON.L('Starting kit','起始装备','시작 장비'))}</strong></p><pre>${esc(example.input)}</pre><p><strong>${textPair(LESSON.L('Expected output','预期输出','예상 출력'))}</strong></p><pre class="target-console">${esc(example.output)}</pre></section>`).join('')}</div>`;
    return html+'</section>';
  }
  function hintHTML(card){let content=card.hint||card.explain||'Read the example one line at a time. Predict what changes and what stays the same. You can save this as needs help and discuss it with your teacher.';return `<strong>A next step</strong><p>${esc(content)}</p>${state.language==='zh'?'<p>先看示例，再尝试一小步。可以用短语作答，或请老师听你解释。</p>':state.language==='ko'?'<p>예시를 보고 한 단계씩 해 보세요. 짧은 답도 괜찮고 선생님께 말로 설명해도 됩니다.</p>':''}`;}
  function feedback(r,ok,message,status){r.feedback={ok,message};r.status=status||(ok?'correct':'needs-review');const el=$('#feedback');el.hidden=false;el.className='feedback '+(ok?'good':'improve');el.textContent=message;save();}
  function logAttempt(r,data){r.attempts.push({...data,time:now()});if(r.attempts.length>60)r.attempts.shift();r.checkedAt=now();}
  function bindCard(card,r){
    all('input[name="answer"]').forEach(i=>i.onchange=()=>{r.answer=Number(i.value);invalidate(r);save();});
    all('input[name="goal"]').forEach(i=>i.onchange=()=>{r.answer=all('input[name="goal"]:checked').map(x=>Number(x.value));invalidate(r);save();});
    if($('#still-learning'))$('#still-learning').onchange=e=>{r.stillLearning=e.target.checked;invalidate(r);save();};
    if($('#short-answer'))$('#short-answer').oninput=e=>{r.answer=e.target.value;invalidate(r);save();};
    if($('#check-answer'))$('#check-answer').onclick=()=>{
      if(!hasResponse(card,r)){toast('Choose or write a response first, or use Save as needs help and continue.');return;}
      let ok=true, message=card.explain||'Reflection saved. Use your work as evidence when you discuss it.',status='reflected';
      if(card.type==='choice'&&card.answer!==undefined){ok=r.answer===card.answer;status=ok?'correct':'needs-review';message=ok?'Correct. '+card.explain:'Not yet. '+card.explain+' You can try again or continue with this attempt saved.';}
      if(card.type==='short'){
        ok=card.accepted?card.accepted.includes(String(r.answer).trim()):ListsChecks.listLine(String(r.answer).trim(),['helmet','radio','blanket']);status=ok?'correct':'needs-review';message=(ok?'Correct. ':'Compare and improve: ')+card.explain;
      }
      logAttempt(r,{answer:r.answer,ok,message});feedback(r,ok,message,status);
    };
    if($('#hint'))$('#hint').onclick=()=>{r.hintShown=true;$('#hint-box').hidden=false;save();};
    if(card.type==='coding'){
      $('#code-editor').oninput=e=>{r.code=e.target.value;invalidate(r);save();};
      $('#code-editor').onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();const el=e.target;el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input'));}if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runCard(card,r);}};
      $('#run-code').onclick=()=>runCard(card,r);$('#stop-code').onclick=()=>PythonRunner.stop();
      $('#reset-code').onclick=()=>{if(confirm('Replace this card’s code with its starter? Your previous run attempts stay in the report.')){r.code=card.starter;r.stdout='';r.error=null;invalidate(r);save();render();}};
    }
    all('[data-enlarge]').forEach(button=>{button.onclick=()=>{$('#enlarged-image').src=button.dataset.enlarge;$('#enlarged-image').alt=card.title;$('#image-caption').textContent=card.title;$('#image-dialog').showModal();};button.querySelector('img').onerror=()=>{button.outerHTML='<p class="small">Illustration unavailable. The written instructions and code example contain everything needed.</p>';};});
    if($('#go-plenary'))$('#go-plenary').onclick=()=>go(cards.findIndex(c=>c.stage==='plenary'),true);
    if(card.evidence)bindEvidence();
    if(card.type==='review'){$('#final-pdf').onclick=exportPDF;$('#final-backup').onclick=backup;}
  }
  function invalidate(r){r.feedback=null;r.status='in-progress';const f=$('#feedback');if(f)f.hidden=true;}
  function hasResponse(card,r){return card.type==='coding'?r.code?.trim():card.type==='checklist'?(r.answer?.length||r.stillLearning):card.type==='choice'?Number.isInteger(r.answer):String(r.answer||'').trim().length>0;}
  async function runCard(card,r){
    if(PythonRunner.busy())return;
    const button=$('#run-code');button.disabled=true;button.textContent='Running…';const consoleEl=$('#console');consoleEl.replaceChildren();const output=document.createElement('pre');consoleEl.append(output);
    const source=r.code;const result=await PythonRunner.run((card.prefix||'')+source,s=>{output.textContent+=s;consoleEl.scrollTop=consoleEl.scrollHeight;},prompt=>new Promise(resolve=>{
      const form=document.createElement('form');form.className='prompt-form';const label=document.createElement('label');label.textContent=prompt;const input=document.createElement('input');input.setAttribute('aria-label',prompt||'Python input');label.append(input);form.append(label);consoleEl.append(form);input.focus();form.onsubmit=e=>{e.preventDefault();output.textContent+=prompt+input.value+'\n';form.remove();resolve(input.value);};
    }));
    r.stdout=result.stdout;r.error=result.error;
    if(result.error){const p=document.createElement('p');p.className='console-error';p.textContent=result.error;consoleEl.append(p);}
    let check=ListsChecks.evaluate(card.check,source,result);
    if(card.check==='swap'&&check.ok){
      const fixtures=[['key','food','coat','flare'],['alpha','beta','gamma','delta']];
      for(const kit of fixtures){const trial=await PythonRunner.run('kit = '+JSON.stringify(kit)+'\n'+source);const expected=[kit[3],kit[1],kit[2],kit[0]];if(trial.error||!ListsChecks.same(trial.vars.kit,expected)||!ListsChecks.listLine(trial.stdout.trim(),expected)){check={ok:false,message:'This worked for the first kit, but not a changed kit. Use stored values and indexes, not typed item names. Keep the supplied kit definition unchanged.'};break;}}
      if(check.ok)check.message='Passed all three kits. Your swap works without retyping item values; the two middle elements stay unchanged.';
    }
    if(card.check==='while'&&check.ok){const changed=source.replace(/(["'])torch\1/,'"helmet"');const trial=await PythonRunner.run(changed);if(trial.error||!ListsChecks.same(trial.stdout.trim().split('\n'),trial.vars.rescue_kit?.map(String)))check={ok:false,message:'Test a changed starting item. Read the values from your list rather than typing the output words.'};}
    logAttempt(r,{code:source,stdout:result.stdout,error:result.error,ok:check.ok,message:check.message});
    if(card.id===cards[state.current].id){button.disabled=false;button.textContent='▶ Run & check';feedback(r,check.ok,check.message);}else {r.feedback=check;r.status=check.ok?'correct':'needs-review';save();}
  }
  function go(index,force=false){
    if(PythonRunner.busy()){toast('Stop or finish the running program before moving.');return;}
    if(index<0||index>=cards.length)return;
    if(!teacher&&!force&&index>state.furthest)return;
    state.current=index;state.furthest=Math.max(state.furthest,index);save(true);render();$('#card').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  }
  function continueCard(needsHelp=false){
    if(PythonRunner.busy()){toast('Stop or finish your program first.');return;}
    const card=cards[state.current],r=response(card.id);
    if(card.type==='review'){exportPDF();return;}
    if(needsHelp){r.status='needs-help';r.helpRequested=now();}
    else if(!teacher&&!r.checkedAt){$('#nav-message').textContent='Run/check this response first, or choose “Save as needs help and continue”. Wrong answers do not lock you out.';return;}
    go(state.current+1,true);
  }
  function evidenceHTML(){return `<details class="evidence-section" ${evidence?'open':''}><summary>Add a screenshot · code and output already save automatically</summary><p class="small">You may attach one screenshot; it is not required to continue. Avoid names or faces of other students.</p><label for="evidence-file">Choose an image (PNG/JPEG/WebP, up to 8 MB)</label><input id="evidence-file" type="file" accept="image/png,image/jpeg,image/webp"><div id="paste-target" class="paste-target" tabindex="0" role="group" aria-label="Paste a screenshot here">Select here, then paste a screenshot with Ctrl/⌘ + V.</div><div id="evidence-preview">${evidence?`<img src="${evidence.data}" alt="Your evidence screenshot"><button id="remove-evidence" class="text-button">Remove image</button>`:''}</div><label for="evidence-caption">Image caption</label><input id="evidence-caption" maxlength="300" value="${esc(evidence?.caption||'')}"><p id="image-status" class="small" role="status"></p></details>`;}
  function bindEvidence(){
    $('#evidence-file').onchange=e=>uploadImage(e.target.files[0]);
    $('#paste-target').onpaste=e=>{const file=[...e.clipboardData.items].find(i=>i.type.startsWith('image/'))?.getAsFile();if(file){e.preventDefault();uploadImage(file);}else $('#image-status').textContent='No image found in the clipboard. Choose an image file instead.';};
    $('#evidence-caption').oninput=async e=>{if(!evidence)return;evidence.caption=e.target.value;try{await imageStore('put',evidence);}catch{$('#image-status').textContent='Image save failed. Download a backup now.';}save();};
    if($('#remove-evidence'))$('#remove-evidence').onclick=async()=>{if(confirm('Remove this evidence image?')){try{await imageStore('delete');evidence=null;render();save();}catch{toast('Could not remove stored image.');}}};
  }
  async function uploadImage(file){
    if(!file)return;const status=$('#image-status');
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){status.textContent='Choose a PNG, JPEG or WebP image smaller than 8 MB.';return;}
    try{status.textContent='Preparing screenshot…';const bitmap=await createImageBitmap(file),scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const candidate={data:canvas.toDataURL('image/jpeg',0.88),caption:$('#evidence-caption').value,time:now(),stage:'independent'};await imageStore('put',candidate);evidence=candidate;render();$('#image-status').textContent='Image saved on this device. It will be included in your backup and PDF.';save();}catch{status.textContent='This browser could not save the image. Try another image or use a backup-compatible browser. Your code is still saved.';}
  }
  function reviewHTML(){
    const attempted=cards.filter(c=>response(c.id).checkedAt).length,correct=cards.filter(c=>response(c.id).status==='correct').length;
    return `<div class="summary-grid"><div class="summary-stat"><strong>${attempted}</strong><span>cards attempted</span></div><div class="summary-stat"><strong>${correct}</strong><span>checks met (not a grade)</span></div><div class="summary-stat"><strong>${cards.filter(c=>response(c.id).status==='needs-help').length}</strong><span>help requests</span></div></div><div class="check-row"><button id="final-pdf" class="primary">Download current report PDF</button><button id="final-backup" class="outline">Download editable backup</button></div><p class="small">PDF for submission · JSON backup for continuing on another device. Your optional image is included in both.</p>${cards.filter(c=>c.type!=='review').map(c=>{const r=response(c.id);return `<details class="review-item"><summary>${esc(c.title)} — ${statusLabel(r.status)}</summary><p>${esc(answerLabel(c,r))}</p>${r.code?`<pre>${esc(r.code)}</pre><pre>${esc(r.stdout||'(no output)')}</pre>`:''}${r.feedback?`<p>${esc(r.feedback.message)}</p>`:''}<button class="text-button" data-review-card="${c.id}" onclick="window.ListsApp.goToCard('${c.id}')">Revisit this card →</button></details>`;}).join('')}`;
  }
  function answerLabel(c,r){if(r.answer===undefined)return 'Not completed';if(c.type==='choice')return en(c.options[r.answer]);if(c.type==='checklist')return (r.answer||[]).map(i=>en(c.options[i])).join('; ')+(r.stillLearning?'; Still needs help':'');return String(r.answer);}
  function statusLabel(s){return ({'not-completed':'Not completed','in-progress':'In progress','correct':'Checks met','reflected':'Reflection saved','needs-review':'Attempted — review needed','needs-help':'Needs help','reviewed':'Reviewed'})[s]||'Not completed';}
  function download(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function filename(ext){const safe=s=>String(s).normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu,'_').slice(0,85);return `Year8_${safe(state.className)}_${safe(state.name)}_Python_Lists_Theory.${ext}`;}
  function backup(){save(true);const data={...state,evidence};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),filename('json'));state.lastBackup=now();save();toast('Backup downloaded. Keep it private: it contains your name and work.');}
  function validBackup(v){
    if(!v||v.lessonId!==LESSON.id||v.schemaVersion!==1||typeof v.name!=='string'||v.name.length>80||!['8T','8E'].includes(v.className)||!['en','zh','ko'].includes(v.language)||!v.responses||typeof v.responses!=='object'||Array.isArray(v.responses))return false;
    if(!Number.isInteger(v.current)||v.current<0||v.current>=cards.length||!Number.isInteger(v.furthest)||v.furthest<0||v.furthest>=cards.length)return false;
    if(v.evidence&&(typeof v.evidence.data!=='string'||v.evidence.data.length>6e6||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v.evidence.data)))return false;
    for(const [id,r] of Object.entries(v.responses)){if(!cards.some(c=>c.id===id)||!r||typeof r!=='object'||!Array.isArray(r.attempts)||r.attempts.length>60||typeof r.status!=='string')return false;if(r.code!==undefined&&(typeof r.code!=='string'||r.code.length>30000))return false;if(r.answer!==undefined&&typeof r.answer!=='string'&&typeof r.answer!=='number'&&!Array.isArray(r.answer))return false;}
    return true;
  }
  async function importBackup(file){
    if(!file)return;try{
      if(file.size>10*1024*1024)throw new Error('Backup too large (maximum 10 MB).');const v=JSON.parse(await file.text());if(!validBackup(v))throw new Error('This is not a valid backup for this lesson.');
      if(!confirm('Replace the current browser progress with '+v.name+'’s backup? Download your current backup first if needed.'))return;
      teacher=v.teacher===true;state={...v};delete state.evidence;evidence=v.evidence||null;
      try{if(evidence)await imageStore('put',evidence);else await imageStore('delete');}catch{throw new Error('Could not restore image storage. Current text backup is still in your file.');}
      $('#tools-dialog').close();await showApp();toast('Backup restored, including any saved image.');
    }catch(error){alert('Could not import: '+error.message);}finally{$('#backup-input').value='';}
  }
  async function exportPDF(){
    if(exporting)return;
    if(PythonRunner.busy()){toast('Finish or stop your program before exporting.');return;}
    exporting=true;save(true);$('#export-pdf').disabled=true;$('#export-pdf').textContent='Preparing…';
    try{await ListsReport.exportPDF(state,evidence,filename('pdf'));$('#download-name').textContent='Downloaded: '+filename('pdf');$('#teams-confirm').checked=!!state.teamsSubmitted;$('#finish-submission').disabled=!state.teamsSubmitted;$('#submission-dialog').showModal();}
    catch(error){toast('PDF could not be generated. Use Work tools → Print / Save as PDF.');console.error(error);}
    finally{exporting=false;$('#export-pdf').disabled=false;$('#export-pdf').textContent='Export PDF';}
  }
  $('#entry-form').onsubmit=async e=>{e.preventDefault();const name=$('#full-name').value.trim(),cls=$('#class-name').value;teacher=name.toLowerCase()==='teacher';if(!teacher&&(name.length<2||!cls)){$('#entry-error').textContent='Enter your name and choose your class to start.';return;}
    let saved;try{saved=JSON.parse(localStorage.getItem(key()));}catch{}
    if(saved&&saved.lessonId===LESSON.id&&((teacher)||saved.name===name&&saved.className===cls))state=saved;
    else{if(saved&&!confirm('Start a different learner? This replaces the browser’s current text progress. Export a backup first if you need it.'))return;state=fresh(teacher?'Test Student':name,cls||'8T',$('#entry-language').value);try{await imageStore('delete');}catch{}}
    state.language=$('#entry-language').value;await showApp();
  };
  $('#start-mission').disabled=false;$('#start-mission').textContent='Start the mission →';
  $('#entry-language').onchange=e=>{$('#entry-support').textContent=e.target.value==='zh'?'每页提供英文和中文支持。Python 代码保持不变。可随时更改。':e.target.value==='ko'?'각 카드에 영어와 한국어 도움말을 함께 표시합니다. Python 코드는 바뀌지 않습니다. 언제든 변경할 수 있습니다.':'Choose support now. You can change it on any learning card. Python code stays the same.';};
  $('#support-language').onchange=e=>{state.language=e.target.value;save();render();};
  $('#back').onclick=()=>go(state.current-1);$('#next').onclick=()=>continueCard();$('#help-continue').onclick=()=>continueCard(true);
  $('#brand-home').onclick=e=>{e.preventDefault();go(0);};$('#export-pdf').onclick=exportPDF;
  $('#work-tools').onclick=()=>$('#tools-dialog').showModal();$('#backup').onclick=backup;
  $('#restore').onclick=$('#restore-entry').onclick=()=>$('#backup-input').click();$('#backup-input').onchange=e=>importBackup(e.target.files[0]);
  $('#print-report').onclick=async()=>{save(true);await ListsReport.build(state,evidence);$('#tools-dialog').close();window.print();};
  $('#switch-student').onclick=()=>{save(true);$('#tools-dialog').close();$('#lesson-app').hidden=true;$('#landing').hidden=false;$('#full-name').value='';$('#class-name').value='';state=null;evidence=null;};
  $('#reset').onclick=async()=>{if(confirm('Reset this learner’s responses and image in this browser? A previously downloaded backup can restore them.')){const old=state;state=fresh(old.name,old.className,old.language);try{await imageStore('delete');}catch{}evidence=null;$('#tools-dialog').close();save(true);render();toast('This browser’s lesson progress was reset. Downloaded backups were not removed.');}};
  $('#teams-confirm').onchange=e=>{$('#finish-submission').disabled=!e.target.checked;};$('#finish-submission').onclick=()=>{state.teamsSubmitted=true;state.teamsSubmittedAt=now();save();$('#submission-thanks').textContent='Thank you. Your submission confirmation has been saved. If you have time, revisit a Go Further challenge or explain an index to a partner.';};
  window.addEventListener('beforeunload',()=>{if(state)save(true);});
  window.ListsApp={goToCard:id=>go(cards.findIndex(c=>c.id===id),teacher),getState:()=>structuredClone(state),validBackup};
  (async()=>{try{
    if(new URLSearchParams(location.search).get('teacher')==='1'){teacher=true;state=JSON.parse(localStorage.getItem(key()))||fresh('Test Student','8T','en');await showApp();return;}
    teacher=false;const saved=JSON.parse(localStorage.getItem(key()));if(saved&&validBackup({...saved,evidence:null})){state=saved;await showApp();}
  }catch{toast('No saved session found. Start a new mission.');}})();
})();
