(() => {
  'use strict';
  const L=window.LISTS_LESSON,C=window.ListsCore;
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const group=id=>L.groups.find(g=>g.id===id),page=C.page;
  const response=()=>C.response(notebook,current);
  const allIds=L.pages.map(p=>p.id),coreIds=C.core.map(p=>p.id);
  let notebook=null,current='ready',role='student',independent=true,profile='',dbPromise=null,storageWarned=false;
  let session=0,dirty=new Set(),dirtyVersion=new Map(),syncTimer=null,saveTimer=null,saveQueue=Promise.resolve();
  let activeRun=null,navigating=0,exporting=false;
  const editors=new Map();
  if(window.ResizeObserver)new ResizeObserver(()=>document.documentElement.style.setProperty('--lesson-bar-height',Math.ceil($('.topbar').getBoundingClientRect().height)+'px')).observe($('.topbar'));
  if(window.ResizeObserver)new ResizeObserver(()=>document.documentElement.style.setProperty('--preview-bar-height',Math.ceil($('#preview-navigation').getBoundingClientRect().height)+'px')).observe($('#preview-navigation'));
  const pythonBusy=()=>[...editors.values()].some(b=>b.busy);
  function notice(message,kind=''){const n=$('#notice');n.textContent=message;n.className='notice '+kind;n.hidden=!message;}
  function saveKey(name,className,mode){return L.id+':'+mode+':'+name.trim().toLowerCase()+':'+className.trim().toLowerCase();}
  async function database(){
    if(dbPromise)return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{const request=indexedDB.open('tenby-y10-lists-notebooks',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('notebooks');
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
    return dbPromise;
  }
  async function dbGet(key){let value=null;try{const db=await database();value=await new Promise((resolve,reject)=>{const r=db.transaction('notebooks').objectStore('notebooks').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}catch{try{value=JSON.parse(localStorage.getItem(key)||'null');}catch{}}try{const rescue=JSON.parse(localStorage.getItem(key+':rescue')||'null');if(rescue&&(!value||Date.parse(rescue.updatedAt)>Date.parse(value.updatedAt)))return {...rescue,images:value?.images||[]};}catch{}return value;}
  async function dbPut(key,value){try{const db=await database();await new Promise((resolve,reject)=>{const t=db.transaction('notebooks','readwrite');t.objectStore('notebooks').put(value,key);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});return true;}
    catch(error){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{if(!storageWarned){storageWarned=true;notice('Device storage could not save your work. Keep this page open and download a notebook backup or PDF now.','error');}return false;}}}
  function saveLocal(immediate=false){
    if(!notebook)return Promise.resolve();notebook.stage=current;notebook.updatedAt=C.now();notebook.unsynced=[...dirty];
    try{localStorage.setItem(profile+':rescue',JSON.stringify({...notebook,images:[]}));}catch{ /* IndexedDB remains the primary store, including images. */ }
    clearTimeout(saveTimer);const go=()=>{const key=profile,copy=C.clone(notebook);saveQueue=saveQueue.catch(()=>{}).then(async()=>{const ok=await dbPut(key,copy);if(profile===key)$('#saved-status').textContent=ok?('Saved on this device'):'Not saved · export a backup';});return saveQueue;};
    if(immediate)return go();saveTimer=setTimeout(go,250);$('#saved-status').textContent='Saving on this device…';return Promise.resolve();
  }
  function changed(id=current){
    if(!notebook)return;const r=C.response(notebook,id);r.updatedAt=C.now();dirty.add(id);dirtyVersion.set(id,(dirtyVersion.get(id)||0)+1);saveLocal();ListsRecords.capture(notebook);ListsRecords.record('page_state',id,{...C.cloudPayload(notebook,id),runs:[],help:r.help||'',visitedAt:r.visitedAt},'page-state');
  }
  function canEdit(){return Boolean(notebook);}
  function released(){return true;}
  function answered(p){
    const r=notebook?.pages[p.id];if(!r)return false;
    if(['info','extensions','finish'].includes(p.kind))return !!r.visitedAt;
    return ['submitted','correct','retry','attempted','test-passed','test-review','review-later'].includes(r.status);
  }
  function nextId(id=current){const p=page(id);if(p.optional)return 'extension-menu';const n=coreIds.indexOf(id);return coreIds[n+1]||null;}
  function prevId(id=current){const p=page(id);if(p.optional)return 'extension-menu';return coreIds[coreIds.indexOf(id)-1]||null;}
  function accessible(id){
    if(role==='preview')return true;
    if(id===current||notebook.pages[id]?.visitedAt)return true;
    if(page(id).optional)return notebook.pages['extension-menu']?.visitedAt&&released(id);
    const idx=coreIds.indexOf(id);if(idx<=0)return true;
    return C.core.slice(0,idx).every(p=>answered(p));
  }
  function statusLabel(id){const s=notebook.pages[id]?.status;return window.ListsReport.statusLabels[s]||'Not started';}
  function codeHTML(code,highlight=0){return '<ol class="numbered-code" aria-label="Numbered code">'+String(code).split('\n').map((line,i)=>'<li class="'+(i+1===highlight?'current':'')+'"><span class="ln">'+(i+1)+'</span><code>'+esc(line||' ')+'</code></li>').join('')+'</ol>';}
  function visualHTML(image){return '<figure class="visual"><img src="'+esc(image.src)+'" alt="'+esc(image.alt)+'" data-zoom="'+esc(image.src)+'"><figcaption>'+esc(image.caption)+' Select the image to enlarge.</figcaption><p class="image-description"><strong>Diagram in words:</strong> '+esc(image.alt)+'</p></figure>';}
  function guideHTML(p){return '<section class="guide" aria-labelledby="guide-heading"><h3 id="guide-heading">'+esc(p.guideTitle||'Study the model one step at a time')+'</h3><p class="small">The model and explanation are visible below. Use Next step to move the highlighted line. This is a prepared walkthrough, not a debugger for your own code.</p><div id="guide-code"></div><div class="guide-nav"><button id="guide-prev" class="secondary">Previous step</button><button id="guide-next" class="secondary">Next step</button></div><p id="guide-text" aria-live="polite"></p><p id="guide-value" class="guide-values"></p></section>';}
  function readHTML(p){return (p.read||[]).map(t=>'<p>'+esc(t)+'</p>').join('');}
  function indexMapHTML(values){return '<section class="index-map" aria-label="Current list positions"><h3>This list · positions and values</h3><table><caption>Each index selects one whole title.</caption><thead><tr><th scope="col">Index</th><th scope="col">Value</th></tr></thead><tbody>'+values.map((v,i)=>'<tr><th scope="row">'+i+'</th><td>'+esc(v)+'</td></tr>').join('')+'</tbody></table></section>';}
  function exampleHTML(p){return p.exampleInputs?'<section class="expected-run"><h3>Your test · inputs and expected result</h3><p><strong>Type in the Shell:</strong> '+esc(p.exampleInputs.length?p.exampleInputs.join(' → '):'No input is needed.')+'</p><p><strong>Expected printed output:</strong></p><pre>'+esc(p.exampleOutput.join('\n'))+'</pre><p class="small">The Shell also shows prompts and your typed input. Enter each value only when asked. Saving alone does not mark this example correct.</p></section>':'';}
  function renderGoals(p){$('#ksu-goals').innerHTML=L.ksu.map(k=>'<div class="ksu-goal '+(k.id===p.ksu?'active':'')+'"><strong>'+k.id+' · '+k.name+(k.id===p.ksu?' · current focus':'')+'</strong>'+esc(k.short)+'</div>').join('');}
  function header(){
    const p=page(current),siblings=L.pages.filter(x=>x.group===p.group&&!x.optional);
    $('#activity-label').textContent=group(p.group).name;$('#page-position').textContent=p.optional?'Optional challenge · return to the extension menu when ready':'Step '+(siblings.findIndex(x=>x.id===current)+1)+' of '+siblings.length+' in this activity';
    $('#identity').textContent=role==='preview'?'Teacher preview · no pupil tracking':notebook.name+' · '+notebook.className;
    if(role==='preview')$('#preview-page').value=current;
    renderGoals(p);const prev=prevId(),next=nextId();$('#previous').disabled=!prev||!accessible(prev)||pythonBusy();
    $('#next').disabled=!next||!accessible(next)||pythonBusy()||!(role==='preview'||answered(p));
    $('#next').textContent=p.optional?'Return to extensions':!next?'End of lesson':'Continue';
    $('#help').hidden=$('#pause-request').hidden=role!=='student';
    $('#outline').querySelectorAll('[data-page]').forEach(b=>{b.disabled=!accessible(b.dataset.page)||pythonBusy();if(b.dataset.page===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});

  }
  function renderOutline(){
    $('#outline').innerHTML=L.groups.map(g=>'<h3>'+esc(g.name)+'</h3>'+L.pages.filter(p=>p.group===g.id&&!p.optional).map(p=>'<button data-page="'+p.id+'" '+(!accessible(p.id)?'disabled':'')+'>'+esc(p.title)+'<span>'+esc(statusLabel(p.id))+'</span></button>').join('')).join('');
    $('#outline').onclick=e=>{const b=e.target.closest('[data-page]');if(b)navigate(b.dataset.page);};
  }
  function questionHTML(p,r){
    let html=(p.studyCheck?'<h3 class="check-heading">Check your understanding</h3><p class="small">Use the explanation above. Answer this one question, then check your response before continuing. You can flag it for written help if needed.</p>':'')+'<div class="question" id="question-label">'+esc(p.prompt||'')+'</div>';
    if(['choice','baseline','focus','reflection'].includes(p.kind))html+='<fieldset class="options" aria-labelledby="question-label">'+C.orderedOptions(notebook,p.id).map(o=>'<label class="option"><input type="radio" name="response" value="'+esc(o.id)+'" '+(r.answer===o.id?'checked':'')+'><span>'+esc(o.label)+(o.why&&p.kind==='reflection'?'<small>'+esc(o.why)+'</small>':'')+'</span></label>').join('')+'</fieldset>';
    else if(p.kind==='number')html+='<label for="answer" class="small">Your prediction · enter one whole number</label><input id="answer" class="numeric-answer" inputmode="numeric" maxlength="20" value="'+esc(r.answer)+'">';
    else if(p.kind==='text')html+='<label for="answer" class="small">Your explanation · '+(p.id==='ex-repeat-theory'?'write pseudocode':'a short, specific response')+'</label><textarea id="answer" maxlength="1500" spellcheck="false">'+esc(r.answer)+'</textarea>';
    if(p.kind==='reflection')html+='<p class="phase-evidence" id="phase-summary">'+esc(reflectionEvidence(p))+'</p><label for="evidence-note" class="small">Optional evidence for your choice · name a line, prediction or test</label><textarea id="evidence-note" maxlength="700">'+esc(r.evidence||'')+'</textarea>';
    if(p.kind==='baseline')html+='<p class="evidence-note">This is your starting self-report, not a test mark. Evidence to look for: '+esc(p.evidence)+'</p>';
    const auto=p.correct||p.kind==='number';
    html+='<div class="answer-actions"><button id="submit-answer">'+(auto?'Check my answer':['baseline','reflection','focus'].includes(p.kind)?'Save my choice':'Save my response')+'</button>'+(p.hint?'<button id="show-hint" class="quiet">One hint</button>':'')+'<button id="review-later" class="quiet">I need help · flag for return</button></div><div id="hint" class="hint" hidden></div><div id="answer-feedback" role="status"></div>';
    if(p.kind==='text')html+='<p class="small">Your explanation is saved for teacher review. The app does not award marks by keyword matching.</p>';
    return html;
  }
  function reflectionEvidence(p){
    const k=L.ksu.find(x=>x.id===p.ksu),base=notebook.pages['types-'+p.ksu.toLowerCase()]?.answer;
    const checkIds=['m1-positions','m1-compare'];
    const checked=checkIds.filter(id=>notebook.pages[id]?.status==='correct').length;
    const matched=ids=>ids.filter(id=>{const q=page(id),r=notebook.pages[id],run=C.evidenceRuns(notebook,id).find(x=>x.id===r?.test?.runId);return r?.test?.ok&&C.testRun(q.test,run,run?.code).ok;}).length;
    const summary=p.ksu==='S'?'List-program evidence: '+matched(['m1-create','m1-update','m1-build'])+'/3 saved test cases matched (access, update, traversal). This refers to saved run versions; retest later edits.':p.ksu==='K'?'List-position and string/list checks: '+checked+'/2 currently correct.':'Menu-test evidence: '+matched(['m2-build','m2-sequence'])+'/2 saved cases matched. Your two-loop explanation is '+(notebook.pages['m2-explain']?.status==='submitted'?'saved for teacher review':'not yet saved')+'. A working run is evidence, not an automatic judgement of understanding.';
    return 'Starting point: '+({independent:'independent',support:'with an example',notyet:'new / needing help'}[base]||'not selected')+'. '+summary+' Evidence: '+k.proof+' Your phase is a personal support signal, not a grade.';
  }
  function renderPage(){
    const p=page(current),r=C.visit(notebook,current);const main=$('#main');
    for(const bundle of editors.values())bundle.root.remove();
    const kind={info:'Study',choice:'One question',number:'Predict',baseline:'Starting point',focus:'Choose a focus',text:'Explain',code:'Program',test:'Test your program',reflection:'Reflect',extensions:'Optional practice',finish:'Save and submit'}[p.kind];
    let html='<span class="page-kind">'+esc(p.studyCheck?'Study · then one question':kind)+'</span><h2>'+esc(p.title)+'</h2><p class="goal-chip">'+p.ksu+' · '+esc(L.ksu.find(k=>k.id===p.ksu).name)+'</p>';
    if(p.context)html+='<p class="lead">'+esc(p.context)+'</p>';
    if(p.read?.length)html+='<div class="reading">'+readHTML(p)+'</div>';
    if(p.reading)html+='<p class="'+(p.id==='ready'?'coach':'small')+'">'+esc(p.reading)+'</p>';
    if(p.image)html+=visualHTML(p.image);
    if(p.indexMap)html+=indexMapHTML(p.indexMap);
    if(p.code!==undefined)html+=codeHTML(p.code);
    if(p.note)html+='<p class="instruction">'+esc(p.note)+'</p>';
    if(p.id==='ready')html+='<p class="evidence-note">'+esc(p.evidence)+'</p>';
    if(p.referenceCode)html+=codeHTML(p.referenceCode);
    if(p.referenceWorkspace){const w=C.workspace(notebook,p.referenceWorkspace,L.models.scaffold);r.snapshot={code:w.code,shell:w.shell};html+='<h3>Your current program · reference</h3>'+codeHTML(w.code);}
    if(p.guide&&!['code','test'].includes(p.kind))html+=guideHTML(p);
    if(p.supplement)html+='<section class="supplement"><h3>The same idea with a number</h3><p class="small">In this donation example, each new input also replaces the value of one variable. Study the changes, then answer the question below about ready.</p>'+visualHTML(p.supplement)+'</section>';
    if(p.criteria&&p.kind==='text')html+='<section class="task-requirements"><h3>What to include</h3><ul>'+p.criteria.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></section>';
    if(['choice','number','text','baseline','reflection','focus'].includes(p.kind))html+=questionHTML(p,r);
    if(['code','test'].includes(p.kind)){
      if(p.requirements)html+='<section class="task-requirements"><h3>What your program must do</h3><ul>'+p.requirements.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></section>';
      html+='<p class="question">'+esc(p.prompt)+'</p>'+(p.steps?'<ol class="steps">'+p.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':'');
      if(p.sampleCode)html+='<section class="sample-pattern"><h3>'+esc(p.sampleLabel||'Code pattern to use')+'</h3>'+codeHTML(p.sampleCode)+'</section>';
      if(p.testText)html+='<p class="test-spec">'+esc(p.testText)+'</p>';
      html+=exampleHTML(p);
      if(p.test)html+='<div class="test-spec"><strong>Inputs to type in the Shell:</strong> '+esc(p.test.inputs.length?p.test.inputs.join(' → '):'None for this program.')+'<br><strong>Printed output, one item per line:</strong><pre>'+esc(p.test.lines.join('\n'))+'</pre>'+(p.test.inputs.length?'<span class="small">Menu prompts and your typed inputs also appear in the Shell; they are not extra printed-result lines.</span>':'')+'</div>';
      if(p.guide)html+=guideHTML(p);
      if(p.support&&!p.guide)html+='<section class="model-support"><h3>'+esc(p.supportTitle||'Worked model · study before typing')+'</h3><p class="small">Study or adapt this example in the Editor below. It does not replace your code automatically.</p>'+codeHTML(p.support)+'</section>';
      html+='<div id="ide-mount"></div><p class="evidence-note">'+esc(p.evidence)+'</p><div class="answer-actions">'+(p.test?'<button id="check-run">Check this run</button>':'<button id="save-attempt">Save this programming step</button>')+(p.hint?'<button id="show-hint" class="quiet">One hint</button>':'')+'<button id="review-later" class="quiet">Save unfinished · flag for return</button></div><div id="hint" class="hint" hidden></div><div id="answer-feedback" role="status"></div>';
      html+='<fieldset class="support-record"><legend>What helped on this step? · optional</legend><p class="small">This records the support you used, not a grade or a judgement of ability.</p>'+[['independent','I completed it independently.'],['hint','I used a written hint.'],['model','I followed a worked example.']].map(([value,label])=>'<label><input type="radio" name="support-level" value="'+value+'" '+(r.supportLevel===value?'checked':'')+'>'+label+'</label>').join('')+'</fieldset>';
    }
    if(p.kind==='extensions'){if(p.recommended)html+='<section class="recommended"><h3>Suggested next step</h3><button data-extension="'+esc(p.recommended)+'">'+esc(page(p.recommended).title)+'</button><p>One change: add the counter update. Or select Continue for your Learning Pit Stop.</p></section>';html+='<h3>Other practice choices · available now or later</h3><ul class="extension-menu">'+L.pages.filter(x=>x.optional&&x.id!==p.recommended).map(x=>'<li><button data-extension="'+x.id+'">'+esc(x.title)+'</button><p>'+esc(x.level)+' · '+esc(statusLabel(x.id))+'</p></li>').join('')+'</ul>';}
    if(p.optional)html+='<button id="extension-back" class="quiet">Back to the extension choices</button>';
    if(p.kind==='finish')html+=finishHTML();
    if(p.transition)html+='<p class="next-step-note">'+esc(p.transition)+'</p>';
    if(['code','test','text','finish'].includes(p.kind))html+='<details class="evidence-uploads"><summary>Add optional screenshot evidence</summary><p>Code and Shell runs are recorded automatically. If you add screenshots, the PDF includes each whole image, fitted without cropping. Screenshots are saved to your school record when connected and included in your PDF.</p><label for="evidence-upload">PNG, JPEG or WebP · up to 3 MB each, 8 images in this notebook</label><input id="evidence-upload" type="file" accept="image/png,image/jpeg,image/webp" multiple><div id="image-evidence" class="image-evidence"></div></details>';
    main.innerHTML=html;
    if(p.workspace)mountIDE(p);
    main.querySelectorAll('input[name="response"]').forEach(el=>el.onchange=()=>{r.answer=el.value;r.status='draft';changed();renderAnswerFeedback();header();});
    main.querySelectorAll('input[name="support-level"]').forEach(el=>el.onchange=()=>{if(!canEdit())return;r.supportLevel=el.value;changed();});
    $('#answer')?.addEventListener('input',e=>{r.answer=e.target.value;r.status='draft';changed();renderAnswerFeedback();header();});
    $('#evidence-note')?.addEventListener('input',e=>{r.evidence=e.target.value;changed();});
    $('#submit-answer')?.addEventListener('click',()=>{
      if(!canEdit())return;const result=C.submit(notebook,current);if(result.empty){notice('Choose or write your response first. You can also flag this page for help.');return;}
      changed();ListsRecords.record('attempt',current,{answer:r.answer,result,attempt:r.attempts.at(-1)});renderAnswerFeedback();header();
    });
    $('#review-later')?.addEventListener('click',()=>{if(!canEdit())return;snapshot();r.status='review-later';r.help='Please revisit '+p.title;changed();renderAnswerFeedback();header();ListsRecords.record('support',current,{help:r.help});notice('Flag saved for teacher review. If you need help now, use Teams chat or your agreed classroom signal.');});
    $('#show-hint')?.addEventListener('click',()=>{r.hintUsed=true;changed();ListsRecords.record('support',current,{hint:p.hint});$('#hint').hidden=false;$('#hint').textContent=p.hint;});
    $('#scaffold-support')?.addEventListener('toggle',e=>{if(e.target.open){r.hintUsed=true;changed();}});
    $('#save-attempt')?.addEventListener('click',()=>{snapshot();r.status='attempted';changed();renderAnswerFeedback();header();});
    $('#check-run')?.addEventListener('click',()=>{if(!canEdit()||activeRun)return;snapshot();C.checkTest(notebook,current);changed();ListsRecords.record('test',current,{test:r.test});renderAnswerFeedback();header();});
    $('#extension-back')?.addEventListener('click',()=>navigate('extension-menu'));
    main.querySelectorAll('[data-extension]').forEach(b=>b.onclick=()=>navigate(b.dataset.extension));
    main.querySelectorAll('[data-zoom]').forEach(im=>{im.tabIndex=0;im.setAttribute('role','button');const open=()=>{const large=$('#large-image');large.src=im.dataset.zoom;large.alt=im.alt;$('#image-dialog').showModal();};im.onclick=open;im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};});
    $('#evidence-upload')?.addEventListener('change',addImages);renderImages();bindGuide(p);
    $('#finish-export')?.addEventListener('click',exportPDF);$('#record-complete')?.addEventListener('click',recordComplete);
    renderAnswerFeedback();header();renderOutline();applyEditing();changed();
  }
  function renderAnswerFeedback(){
    const el=$('#answer-feedback');if(!el)return;const p=page(current),r=response();let text='',retry=false;
    if(r.status==='draft'&&r.attempts.length)text='Response edited. Check or save this new version when you are ready.';
    else if(r.status==='correct')text=p.success||'This check is correct.';
    else if(r.status==='retry'){text=p.options?.find(o=>o.id===r.submittedAnswer)?.why||p.hint||'Compare your response with the example and try again.';retry=true;}
    else if(r.status==='submitted')text=['baseline','reflection','focus'].includes(p.kind)?p.success||'Your choice is saved. It is a learning reflection, not a test mark.':'Your response is saved for teacher review. It has not been automatically marked.';
    else if(r.status==='attempted')text='Your program and attempts are saved. This is not an automatic correctness mark. Continue to test what it actually does.';
    else if(r.status==='review-later')text='Flag saved. Your unfinished work is kept, and you may continue to the next page.';
    else if(r.test){text=r.test.message;retry=!r.test.ok;}
    el.className=text?'feedback'+(retry?' retry':''):'';el.textContent=text;
  }
  function bindGuide(p){
    if(!p.guide)return;let i=0;const draw=()=>{const v=p.guide[i];$('#guide-code').innerHTML=codeHTML(p.model||p.code,v.line);$('#guide-text').textContent=v.description;$('#guide-value').textContent=v.value;$('#guide-prev').disabled=i===0;$('#guide-next').disabled=i===p.guide.length-1;};
    $('#guide-prev').onclick=()=>{i--;draw();};$('#guide-next').onclick=()=>{i++;draw();};draw();
  }
  function finishHTML(){
    const s=C.statistics(notebook);
    return '<p class="coach">Latest objective checks: '+s.checks+'/'+s.checkTotal+' correct. Recorded core test cases matched: '+s.tests+'/'+s.testTotal+'. These are practice indicators, not an examination grade.</p><table class="evidence-summary"><thead><tr><th>Activity</th><th>Your saved evidence</th></tr></thead><tbody>'+L.groups.filter(g=>!['ready','finish'].includes(g.id)).map(g=>{const ps=L.pages.filter(p=>p.group===g.id&&!p.optional);return '<tr><td>'+esc(g.name)+'</td><td>'+ps.filter(p=>answered(p)).length+'/'+ps.length+' core steps attempted or completed</td></tr>';}).join('')+'</tbody></table><div class="end-actions"><button id="finish-export">Export my complete PDF</button><button id="record-complete" class="secondary">Record notebook completion</button></div><p class="small">'+(notebook.submittedAt?'Completion recorded on this device at '+esc(notebook.submittedAt)+'.':'You can export unfinished work. Missing items will be labelled, not hidden.')+'</p><h3>Study references</h3>'+L.sources.map(s=>'<p class="small">'+(s.url?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a>':esc(s.title))+(s.note?'<br>'+esc(s.note):'')+'</p>').join('');
  }
  function mountIDE(p){
    let bundle=editors.get(p.workspace),w=C.workspace(notebook,p.workspace,p.initial||'');
    if(!bundle){
      const root=document.createElement('section');root.className='ide';root.setAttribute('aria-label','Python Editor and Shell');
      root.innerHTML='<div class="ide-toolbar"><strong>Python Editor · student.py</strong><button class="run-code">Run / F5</button><button class="stop-code secondary" disabled>Stop</button><button class="download-code quiet">Download .py</button><label class="small">Text size<select class="code-size" aria-label="Python code text size"><option>17</option><option>19</option><option selected>22</option><option>25</option></select></label></div><textarea class="code-editor" aria-label="Python source code"></textarea><div class="shell-heading">Python Shell · enter inputs here when the program asks</div><div class="shell-root"></div><p class="run-status" role="status"></p>';
      const cm=CodeMirror.fromTextArea(root.querySelector('textarea'),{value:w.code,mode:'python',lineNumbers:true,indentUnit:4,tabSize:4,matchBrackets:true,styleActiveLine:true,viewportMargin:30,readOnly:!canEdit(),
        extraKeys:{Tab:ed=>{if(canEdit())ed.somethingSelected()?ed.indentSelection('add'):ed.replaceSelection('    ');},'Shift-Tab':ed=>canEdit()&&ed.indentSelection('subtract'),F5:()=>runProgram()}});
      cm.setValue(w.code);cm.getInputField().setAttribute('aria-label','Python source code');cm.on('change',()=>{w.code=cm.getValue().slice(0,20000);w.updatedAt=C.now();if(notebook&&page(current)?.workspace===p.workspace){response().snapshot={code:w.code,shell:w.shell};changed();}});
      bundle={root,cm,shell:null,workspace:p.workspace,runPage:null};
      const owner=notebook,ownerSession=session;
      const shell=new PythonShell(root.querySelector('.shell-root'),{
        transcript:w.shell,canEdit:()=>canEdit()&&page(current)?.workspace===p.workspace,
        onTypedInput:(value,waiting)=>ListsRecords.record('console_input',bundle.runPage||current,{value,waiting}),
        onChange:transcript=>{w.shell=transcript;if(notebook!==owner||session!==ownerSession)return;if(bundle.runPage)changed(bundle.runPage);else changed();},
        onBusy:busy=>{if(busy){bundle.runPage=current;bundle.busy=true;}else {bundle.busy=false;bundle.runPage=null;}applyEditing();},
        onResult:result=>{const id=bundle.runPage||current;const r={...result,id:crypto.randomUUID(),pageId:id,at:C.now()};w.runs.push(r);if(notebook!==owner||session!==ownerSession)return;ListsRecords.record('run',id,{run:r});C.response(notebook,id).snapshot={code:w.code,shell:w.shell};C.response(notebook,id).status=C.response(notebook,id).status==='test-passed'?'test-review':'attempted';changed(id);
          const status=root.querySelector('.run-status');status.textContent=result.ok?'Actual run recorded. Compare the output with this page’s requirement.':friendlyError(result);header();},
      });bundle.shell=shell;
      root.querySelector('.run-code').onclick=runProgram;root.querySelector('.stop-code').onclick=()=>shell.stop();
      root.querySelector('.download-code').onclick=()=>download(C.safeName(notebook.name)+'_'+p.workspace+'.py',cm.getValue(),'text/x-python');
      root.querySelector('.code-size').onchange=e=>{cm.getWrapperElement().style.fontSize=e.target.value+'px';cm.refresh();};
      editors.set(p.workspace,bundle);
    }
    $('#ide-mount').append(bundle.root);bundle.cm.refresh();bundle.shell.setEditable(canEdit());bundle.cm.setOption('readOnly',!canEdit());
  }
  async function runProgram(){
    const p=page(current),bundle=editors.get(p.workspace);if(!bundle||!canEdit()||activeRun||bundle.busy)return;
    snapshot();activeRun=bundle.shell.execute(bundle.cm.getValue());applyEditing();
    try{await activeRun;}finally{activeRun=null;applyEditing();header();}
  }
  function friendlyError(r){
    let hint='';const msg=r.error||r.stderr||'The program stopped.';
    if(/IndexError/.test(msg))hint='Check the index on the indicated line. A three-element list has indexes 0, 1 and 2; index 3 is outside it.';
    else if(/TypeError/.test(msg))hint='Check what the variable holds. A list can replace an element; a string cannot be changed by assigning to a character position. Direct traversal gives title values, not numeric indexes.';
    else if(/ValueError/.test(msg))hint='Check whether a conversion is needed. Menu choices here are strings; the supplied model does not use int(input(...)).';
    else if(/IndentationError|TabError/.test(msg))hint='Follow one level at a time: WHILE body at 4 spaces, IF/FOR at 8, inner print at 12. Use spaces, not mixed tabs.';
    else if(/SyntaxError/.test(msg))hint='Check the indicated line for a colon, matching quotes or a closing bracket.';
    else if(/NameError/.test(msg))hint='Check the variable spelling and whether it has a value before this line.';
    else if(r.timedOut||r.stopped)hint='Stopped safely. Check whether the loop can change its condition. Your source and partial output are kept.';
    else if(/EOFError/.test(msg))hint='input() normally waits for your answer in this Shell. If the interpreter was interrupted or unavailable, rerun the program; do not add a separate input list.';
    return hint+(hint?'\n\n':'')+msg;
  }
  function snapshot(){
    if(!notebook)return;const p=page(current);if(p.workspace){const b=editors.get(p.workspace),w=C.workspace(notebook,p.workspace,p.initial||'');if(b){w.code=b.cm.getValue();w.shell=b.shell.transcript;}response().snapshot={code:w.code,shell:w.shell};}
  }
  function applyEditing(){
    if(notebook)$('#main').querySelectorAll('[name=support-level]').forEach(el=>el.disabled=!canEdit()||pythonBusy());
    if(!notebook)return;const edit=canEdit();$('#main').querySelectorAll('input[name="response"],#answer,#evidence-note,#submit-answer,#save-attempt,#check-run,#review-later,#evidence-upload,#record-complete').forEach(el=>el.disabled=!edit||pythonBusy());
    for(const b of editors.values()){const active=page(current)?.workspace===b.workspace;b.cm.setOption('readOnly',!edit||!active);b.shell.setEditable(edit&&active);b.root.querySelector('.run-code').disabled=!edit||!!activeRun||b.busy;b.root.querySelector('.stop-code').disabled=!b.busy;}
    $('#previous').disabled=pythonBusy()||!prevId()||!accessible(prevId());$('#next').disabled=pythonBusy()||!nextId()||!accessible(nextId())||!(role==='preview'||answered(page(current)));
    $('#change-student').disabled=pythonBusy();$('#restore').disabled=pythonBusy();
    $('#preview-page').disabled=$('#preview-go').disabled=$('#preview-exit').disabled=pythonBusy();
  }
  async function navigate(id,{force=false}={}){
    if(!page(id)||!notebook)return;if(!force&&!accessible(id)){notice('Complete or flag the current question first.');return;}
    const request=++navigating;snapshot();
    const bundle=editors.get(page(current)?.workspace);
    if(bundle?.busy){if(!force){notice('Stop the program before changing page. Your code and output will stay saved.');return;}bundle.shell.stop();if(activeRun)await activeRun;else await new Promise(resolve=>{const check=()=>bundle.busy?setTimeout(check,50):resolve();check();});}
    await saveLocal(true);if(request!==navigating)return;current=id;ListsRecords.record('navigate',id,{from:notebook.stage,to:id});$('#outline').hidden=true;$('#outline-toggle').setAttribute('aria-expanded','false');renderPage();$('#main').focus({preventScroll:true});$('#main').scrollIntoView({block:'start',behavior:'auto'});
  }
  async function addImages(event){
    if(!canEdit())return;const files=[...event.target.files],id=current;
    for(const file of files){if(notebook.images.length>=8){notice('This notebook has eight images. Your code and runs are still recorded without screenshots.');break;}
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>3*1024*1024){notice('Choose PNG, JPEG or WebP images no larger than 3 MB each.','error');continue;}
      const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
      try{const im=new Image();im.src=data;await im.decode();const image={id:crypto.randomUUID(),pageId:id,name:file.name.slice(0,100),data,at:C.now()};notebook.images.push(image);ListsRecords.captureImages(notebook);ListsRecords.record('evidence',id,{imageId:image.id,name:image.name});}catch{notice('That image could not be read; it was not added.','error');}
    }event.target.value='';changed(id);renderImages();await saveLocal(true);
  }
  function renderImages(){const root=$('#image-evidence');if(!root)return;root.innerHTML=notebook.images.filter(i=>i.pageId===current).map(im=>'<figure><img src="'+im.data+'" alt="Your screenshot evidence: '+esc(im.name)+'"><figcaption>'+esc(im.name)+' · saved in your PDF</figcaption></figure>').join('');}
  function download(filename,content,type){const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([content],{type}));link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),10000);}
  async function exportPDF(){
    if(!notebook||exporting)return;exporting=true;$('#export-pdf').disabled=true;snapshot();await saveLocal(true);ListsRecords.record('export',current,{format:'pdf'});await ListsRecords.flush();
    const bundle=editors.get(page(current)?.workspace),pending=bundle?.shell.runner.pending;
    const partial=pending?{workspace:bundle.workspace,run:{id:crypto.randomUUID(),pageId:bundle.runPage||current,kind:pending.kind,code:pending.code,inputs:[...pending.inputs],stdout:pending.stdout,stderr:pending.stderr,output:pending.output,error:'Still running or waiting for input when exported. This is partial evidence, not a completed test.',ok:false,at:C.now()}}:null;
    try{const result=await ListsReport.exportEvidence(notebook,{pendingRun:partial,onStatus:t=>notice(t)});notice('Saved '+result.filename+'. Open it to check, then attach and Turn in separately in Teams.','success');}catch(e){notice(e.message+' Your notebook backup remains available.','error');}finally{exporting=false;$('#export-pdf').disabled=false;}
  }
  async function flush(){await ListsRecords.flush();}
  async function recordComplete(){if(!canEdit())return;snapshot();notebook.submittedAt=C.now();C.response(notebook,'finish').status='submitted';changed('finish');ListsRecords.record('complete','finish',{at:notebook.submittedAt});await saveLocal(true);await flush();notice('Completion recorded. Check the school-save indicator, then export and Turn in your PDF separately.');renderPage();}
  async function begin(name,className,mode='student'){
    if(pythonBusy())return;session++;ListsRecords.stop();clearTimeout(syncTimer);clearTimeout(saveTimer);dirty.clear();dirtyVersion.clear();independent=true;role=mode==='preview'?'preview':'student';
    for(const b of editors.values())b.shell.dispose();editors.clear();
    profile=saveKey(name,className,role==='preview'?'preview':'student');const saved=await dbGet(profile);
    try{notebook=saved?C.validateNotebook(saved):C.fresh(name,className,role);}catch{notebook=C.fresh(name,className,role);notice('An incompatible saved draft was left untouched. Download a backup if you need your earlier work.');}
    notebook.name=name;notebook.className=className;notebook.role=role;current=page(notebook.stage)?notebook.stage:'ready';
    await ListsRecords.start(notebook);showLesson();await saveLocal(true);
  }
  function showLesson(){$('#landing').hidden=true;$('#lesson-layout').hidden=false;$('#export-pdf').disabled=false;$('#records-link').hidden=role!=='preview';$('#preview-navigation').hidden=role!=='preview';renderPage();}
  async function openTeacherPreview(){
    const button=$('#teacher-preview');button.disabled=true;
    try{await begin('Teacher preview','Year 10','preview');notice('Teacher preview: use Continue without answering, or choose any page above. No pupil records are opened or recorded.');
      const target=new URL(location.href).searchParams.get('page');if(page(target))await navigate(target,{force:true});
    }catch(e){notice(e.message,'error');}finally{button.disabled=false;}
  }
  async function returnEntry(){
    if(pythonBusy()){notice('Stop the Python run before returning to entry.');return;}
    snapshot();await saveLocal(true);await ListsRecords.flush();ListsRecords.stop();session++;role='student';$('#landing').hidden=false;$('#lesson-layout').hidden=true;$('#preview-navigation').hidden=true;$('#records-link').hidden=true;$('#export-pdf').disabled=true;notice('Your work is kept. Use the same name and class on this browser to return.');
  }
  $('#entry-form').onsubmit=async event=>{event.preventDefault();if(!$('#entry-form').reportValidity())return;const name=$('#name').value.trim(),cls=$('#class-name').value.trim().toUpperCase();const button=$('#entry-form button');button.disabled=true;try{await begin(name,cls,name.toLowerCase()==='teacher'?'preview':'student');}catch(e){notice(e.message,'error');}finally{button.disabled=false;}};
  $('#previous').onclick=()=>{const id=prevId();if(id)navigate(id,{force:role==='preview'});};
  $('#next').onclick=()=>{const id=nextId();if(id)navigate(id,{force:role==='preview'});};
  $('#outline-toggle').onclick=()=>{const open=$('#outline').hidden;$('#outline').hidden=!open;$('#outline-toggle').setAttribute('aria-expanded',String(open));if(open)renderOutline();};
  $('#export-pdf').onclick=exportPDF;$('#change-student').onclick=returnEntry;
  $('#backup').onclick=()=>{snapshot();download('Y10_LISTS_'+C.safeName(notebook.name)+'_notebook.json',JSON.stringify(notebook,null,2),'application/json');};
  $('#restore').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>30000000)throw Error('This backup is too large.');const imported=C.validateNotebook(JSON.parse(await file.text()));if(role==='preview')throw Error('Restore student backups after entering your name and class, not in teacher preview.');if(imported.name!==notebook.name||imported.className!==notebook.className)throw Error('The backup belongs to a different name or class. Return to entry and use that identity first.');if(!confirm('Restore this matching backup? Download a backup of your currently open work first if you need to keep both versions.'))return;for(const b of editors.values())b.shell.dispose();editors.clear();ListsRecords.stop();notebook=imported;current=imported.stage;await ListsRecords.start(notebook);ListsRecords.record('restore',current,{note:'Matching notebook restored'});for(const id of Object.keys(imported.pages))dirty.add(id);await saveLocal(true);renderPage();notice('Matching notebook restored. Screenshots and actual runs are included.','success');}catch(e){notice(e.message,'error');}finally{event.target.value='';}};
  $('#help').onclick=()=>$('#support-dialog').showModal();$('#pause-request').onclick=()=>{$('#help-note').value='I would like a quiet pause before continuing.';$('#support-dialog').showModal();};
  $('#support-form').onsubmit=async event=>{event.preventDefault();const note=$('#help-note').value;response().help=note;changed();ListsRecords.record('support',current,{note});$('#support-dialog').close();notice('Saved for teacher review. If you need help now, use Teams chat or your agreed classroom signal.');};
  document.addEventListener('keydown',event=>{if(event.key==='F5'&&notebook&&page(current)?.workspace){event.preventDefault();runProgram();}if(event.ctrlKey&&event.key.toLowerCase()==='c'&&activeRun)editors.get(page(current)?.workspace)?.shell.stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&notebook){snapshot();saveLocal(true);flush();}});
  window.addEventListener('beforeunload',()=>{snapshot();saveLocal(true);});
  $('#entry-form button').disabled=false;$('#entry-form button').textContent='Start lesson';
  $('#preview-page').innerHTML=L.groups.map(g=>'<optgroup label="'+esc(g.name)+'">'+L.pages.filter(p=>p.group===g.id).map((p,i)=>'<option value="'+esc(p.id)+'">'+(i+1)+'. '+esc(p.title)+(p.optional?' · optional':'')+'</option>').join('')+'</optgroup>').join('');
  $('#teacher-preview').onclick=openTeacherPreview;$('#teacher-preview').disabled=false;
  $('#preview-go').onclick=()=>{if(role==='preview')navigate($('#preview-page').value,{force:true});};
  $('#preview-exit').onclick=returnEntry;
  const route=new URL(location.href).searchParams;if(route.get('preview')==='1'||route.get('teacher')==='1')openTeacherPreview();

})();
