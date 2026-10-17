(() => {
  'use strict';
  const L=window.LISTS_LESSON,C=window.ListsCore;
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const group=id=>L.groups.find(g=>g.id===id),page=C.page;
  const response=()=>C.response(notebook,current);
  const allIds=L.pages.map(p=>p.id),coreIds=C.core.map(p=>p.id);
  let notebook=null,current='ready',role='student',independent=true,profile='',dbPromise=null,storageWarned=false;
  let room=null,learner=null,students=[],pollTimer=null,polling=false,session=0,dirty=new Set(),dirtyVersion=new Map(),syncing=false,syncTimer=null,saveTimer=null,saveQueue=Promise.resolve();
  let waitTimer=null,lastBring=-1,connectionFailure='',selectedStudent=null,shareSafe=false,responsePage=null;
  let activeRun=null,navigating=0,exporting=false,teacherBusy=false,demoShell=null,demoRun=null,demoRunCode='',demoTimer=null,demoSending=false,demoQueued=false,lastDemo='',demoSource='',demoRunning=false;
  const editors=new Map(),feedbackDrafts=new Map();
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
    clearTimeout(saveTimer);const go=()=>{const key=profile,copy=C.clone(notebook);saveQueue=saveQueue.catch(()=>{}).then(async()=>{const ok=await dbPut(key,copy);if(profile===key)$('#saved-status').textContent=ok?(independent||role!=='student'?'Saved on this device':dirty.size?'Saved on device · sync pending':'Saved on device and synced'):'Not saved · export a backup';});return saveQueue;};
    if(immediate)return go();saveTimer=setTimeout(go,250);$('#saved-status').textContent='Saving on this device…';return Promise.resolve();
  }
  function changed(id=current){
    if(!notebook)return;const r=C.response(notebook,id);r.updatedAt=C.now();dirty.add(id);dirtyVersion.set(id,(dirtyVersion.get(id)||0)+1);saveLocal();clearTimeout(syncTimer);syncTimer=setTimeout(flush,800);
  }
  function canEdit(id=current){
    return role==='teacher'||role==='preview'||independent||Boolean(learner?.status==='admitted'&&room&&!room.ended&&room.mode==='work'&&released(id));
  }
  function released(id){return independent||role==='teacher'||role==='preview'||id==='ready'||Boolean(learner?.status==='admitted'&&(room?.released_stages?.includes(id)||learner.unlocked_stages?.includes(id)));}
  function answered(p){
    const r=notebook?.pages[p.id];if(!r)return false;
    if(['info','extensions','finish'].includes(p.kind))return !!r.visitedAt;
    return ['submitted','correct','retry','attempted','test-passed','test-review','review-later'].includes(r.status);
  }
  function nextId(id=current){const p=page(id);if(p.optional)return 'extension-menu';const n=coreIds.indexOf(id);return coreIds[n+1]||null;}
  function prevId(id=current){const p=page(id);if(p.optional)return 'extension-menu';return coreIds[coreIds.indexOf(id)-1]||null;}
  function accessible(id){
    if(!released(id))return false;if(role==='teacher'||role==='preview')return true;
    if(!independent&&!room?.ended&&room?.mode==='present'&&id!==room.stage)return false;
    // In class, the teacher's release is the navigation authority. Skipped
    // earlier activities must not block an explicitly released practice page.
    if(!independent)return true;
    if(learner?.unlocked_stages?.includes(id))return true;
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
  function renderGoals(p){$('#ksu-goals').innerHTML=L.ksu.map(k=>'<div class="ksu-goal '+(k.id===p.ksu?'active':'')+'"><strong>'+k.id+' · '+k.name+(k.id===p.ksu?' · current focus':'')+'</strong>'+esc(k.short)+'</div>').join('');}
  function header(){
    const p=page(current),siblings=L.pages.filter(x=>x.group===p.group&&!x.optional);
    $('#activity-label').textContent=group(p.group).name;$('#page-position').textContent=p.optional?'Optional challenge · return to the extension menu when ready':'Step '+(siblings.findIndex(x=>x.id===current)+1)+' of '+siblings.length+' in this activity';
    $('#identity').textContent=role==='teacher'?'Teacher rehearsal · separate from pupils':role==='preview'?'Teacher preview · no student access':notebook.name+' · '+notebook.className;
    renderGoals(p);const prev=prevId(),next=nextId();$('#previous').disabled=!prev||!accessible(prev)||pythonBusy();
    $('#next').disabled=!next||!accessible(next)||pythonBusy()||!(role==='teacher'||role==='preview'||answered(p));
    $('#next').textContent=p.optional?'Return to extensions':!next?'End of lesson':!released(next)?'Next page · not released':'Continue';
    $('#help').hidden=$('#pause-request').hidden=role!=='student';
    const state=$('#class-status');state.hidden=independent||role!=='student';
    if(!state.hidden){state.replaceChildren();const span=document.createElement('span');
      span.textContent=learner?.status==='pending'?'Waiting for teacher admission. Get ready is available; your earlier work is safe.':learner?.status==='rejected'?'Live access was not admitted. Ask your teacher; your local notebook is safe.':room?.ended?'The live session has ended. Your saved work and exports remain available.':room?.mode==='paused'?'Class paused. Your work is protected; written help and PDF export remain available.':room?.mode==='present'?'Watch the current page. Your teacher will enable answers when it is time to work.':'Work time · use the released pages at your pace.';
      state.append(span);if(room?.stage&&current!==room.stage&&released(room.stage)){const b=document.createElement('button');b.className='quiet';b.textContent='Go to class page';b.onclick=()=>navigate(room.stage,{force:true});state.append(b);}}
    $('#outline').querySelectorAll('[data-page]').forEach(b=>{b.disabled=!accessible(b.dataset.page)||pythonBusy();if(b.dataset.page===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    updateTeacherStatus();renderFeedback();renderDemo();
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
    if(p.code!==undefined)html+=codeHTML(p.code);
    if(p.note)html+='<p class="instruction">'+esc(p.note)+'</p>';
    if(p.id==='ready')html+='<p class="evidence-note">'+esc(p.evidence)+'</p>';
    if(p.referenceCode)html+=codeHTML(p.referenceCode);
    if(p.referenceWorkspace){const w=C.workspace(notebook,p.referenceWorkspace,L.models.scaffold);r.snapshot={code:w.code,shell:w.shell};html+='<h3>Your current program · reference</h3>'+codeHTML(w.code);}
    if(p.guide&&!['code','test'].includes(p.kind))html+=guideHTML(p);
    if(p.supplement)html+='<section class="supplement"><h3>The same idea with a number</h3><p class="small">In this donation example, each new input also replaces the value of one variable. Study the changes, then answer the question below about ready.</p>'+visualHTML(p.supplement)+'</section>';
    if(['choice','number','text','baseline','reflection','focus'].includes(p.kind))html+=questionHTML(p,r);
    if(['code','test'].includes(p.kind)){
      html+='<p class="question">'+esc(p.prompt)+'</p>'+(p.steps?'<ol class="steps">'+p.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':'');
      if(p.testText)html+='<p class="test-spec">'+esc(p.testText)+'</p>';
      if(p.test)html+='<div class="test-spec"><strong>Inputs to type in the Shell:</strong> '+esc(p.test.inputs.length?p.test.inputs.join(' → '):'None for this program.')+'<br><strong>Printed output, one item per line:</strong><pre>'+esc(p.test.lines.join('\n'))+'</pre><span class="small">Menu prompts and your typed inputs also appear in the Shell; they are not extra printed-result lines.</span></div>';
      if(p.guide)html+=guideHTML(p);
      if(p.support&&!p.guide)html+='<section class="model-support"><h3>Worked model · study before typing</h3><p class="small">Type or adapt this model in the Editor below. It does not replace your code automatically.</p>'+codeHTML(p.support)+'</section>';
      html+='<div id="ide-mount"></div><p class="evidence-note">'+esc(p.evidence)+'</p><div class="answer-actions">'+(p.test?'<button id="check-run">Check this run</button>':'<button id="save-attempt">Save this programming step</button>')+(p.hint?'<button id="show-hint" class="quiet">One hint</button>':'')+'<button id="review-later" class="quiet">Save unfinished · flag for return</button></div><div id="hint" class="hint" hidden></div><div id="answer-feedback" role="status"></div>';
    }
    if(p.kind==='extensions')html+='<ul class="extension-menu">'+L.pages.filter(x=>x.optional).map(x=>'<li><button data-extension="'+x.id+'">'+esc(x.title)+'</button><p>'+esc(x.level)+' · '+esc(statusLabel(x.id))+'</p></li>').join('')+'</ul>';
    if(p.optional)html+='<button id="extension-back" class="quiet">Back to the extension choices</button>';
    if(p.kind==='finish')html+=finishHTML();
    if(['code','test','text','finish'].includes(p.kind))html+='<details class="evidence-uploads"><summary>Add optional screenshot evidence</summary><p>Code and Shell runs are recorded automatically. If you add screenshots, the PDF includes each whole image, fitted without cropping. Images stay on this device, not the live board.</p><label for="evidence-upload">PNG, JPEG or WebP · up to 3 MB each, 8 images in this notebook</label><input id="evidence-upload" type="file" accept="image/png,image/jpeg,image/webp" multiple><div id="image-evidence" class="image-evidence"></div></details>';
    main.innerHTML=html;
    if(p.workspace)mountIDE(p);
    main.querySelectorAll('input[name="response"]').forEach(el=>el.onchange=()=>{r.answer=el.value;r.status='draft';changed();renderAnswerFeedback();header();});
    $('#answer')?.addEventListener('input',e=>{r.answer=e.target.value;r.status='draft';changed();renderAnswerFeedback();header();});
    $('#evidence-note')?.addEventListener('input',e=>{r.evidence=e.target.value;changed();});
    $('#submit-answer')?.addEventListener('click',()=>{
      if(!canEdit())return;const result=C.submit(notebook,current);if(result.empty){notice('Choose or write your response first. You can also flag this page for help.');return;}
      changed();renderAnswerFeedback();header();
    });
    $('#review-later')?.addEventListener('click',()=>{if(!canEdit())return;snapshot();r.status='review-later';r.help='Please revisit '+p.title;changed();renderAnswerFeedback();header();if(!independent&&role==='student')LiveCloud.setHelp(true,r.help).catch(()=>notice('Your flag is saved here but did not reach your teacher. Use your agreed support signal.','error'));});
    $('#show-hint')?.addEventListener('click',()=>{r.hintUsed=true;changed();$('#hint').hidden=false;$('#hint').textContent=p.hint;});
    $('#scaffold-support')?.addEventListener('toggle',e=>{if(e.target.open){r.hintUsed=true;changed();}});
    $('#save-attempt')?.addEventListener('click',()=>{snapshot();r.status='attempted';changed();renderAnswerFeedback();header();});
    $('#check-run')?.addEventListener('click',()=>{if(!canEdit()||activeRun)return;snapshot();C.checkTest(notebook,current);changed();renderAnswerFeedback();header();});
    $('#extension-back')?.addEventListener('click',()=>navigate('extension-menu'));
    main.querySelectorAll('[data-extension]').forEach(b=>b.onclick=()=>navigate(b.dataset.extension));
    main.querySelectorAll('[data-zoom]').forEach(im=>{im.tabIndex=0;im.setAttribute('role','button');const open=()=>{const large=$('#large-image');large.src=im.dataset.zoom;large.alt=im.alt;$('#image-dialog').showModal();};im.onclick=open;im.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};});
    $('#evidence-upload')?.addEventListener('change',addImages);renderImages();bindGuide(p);
    $('#finish-export')?.addEventListener('click',exportPDF);$('#record-complete')?.addEventListener('click',recordComplete);
    renderAnswerFeedback();header();renderOutline();applyEditing();changed();if(role==='teacher'&&!$('#responses').hidden)renderRoster();
  }
  function renderAnswerFeedback(){
    const el=$('#answer-feedback');if(!el)return;const p=page(current),r=response();let text='',retry=false;
    if(r.status==='draft'&&r.attempts.length)text='Response edited. Check or save this new version when you are ready.';
    else if(r.status==='correct')text=p.success||'This check is correct.';
    else if(r.status==='retry'){text=p.options?.find(o=>o.id===r.submittedAnswer)?.why||p.hint||'Compare your response with the example and try again.';retry=true;}
    else if(r.status==='submitted')text=['baseline','reflection','focus'].includes(p.kind)?p.success||'Your choice is saved. It is a learning reflection, not a test mark.':'Your response is saved for teacher review. It has not been automatically marked.';
    else if(r.status==='attempted')text='Your program and attempts are saved. This is not an automatic correctness mark. Continue to test what it actually does.';
    else if(r.status==='review-later')text='Flag saved. Your unfinished work is kept, and you may continue to the next released page.';
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
        onChange:transcript=>{w.shell=transcript;if(notebook!==owner||session!==ownerSession)return;if(bundle.runPage)changed(bundle.runPage);else changed();},
        onBusy:busy=>{if(busy){bundle.runPage=current;bundle.busy=true;}else {bundle.busy=false;bundle.runPage=null;}applyEditing();},
        onResult:result=>{const id=bundle.runPage||current;const r={...result,id:crypto.randomUUID(),pageId:id,at:C.now()};w.runs.push(r);if(notebook!==owner||session!==ownerSession)return;C.response(notebook,id).snapshot={code:w.code,shell:w.shell};C.response(notebook,id).status=C.response(notebook,id).status==='test-passed'?'test-review':'attempted';changed(id);
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
    if(!notebook)return;const edit=canEdit();$('#main').querySelectorAll('input[name="response"],#answer,#evidence-note,#submit-answer,#save-attempt,#check-run,#review-later,#evidence-upload,#record-complete').forEach(el=>el.disabled=!edit||pythonBusy());
    for(const b of editors.values()){const active=page(current)?.workspace===b.workspace;b.cm.setOption('readOnly',!edit||!active);b.shell.setEditable(edit&&active);b.root.querySelector('.run-code').disabled=!edit||!!activeRun||b.busy;b.root.querySelector('.stop-code').disabled=!b.busy;}
    $('#previous').disabled=pythonBusy()||!prevId()||!accessible(prevId());$('#next').disabled=pythonBusy()||!nextId()||!accessible(nextId())||!(role==='teacher'||role==='preview'||answered(page(current)));
    $('#change-student').disabled=pythonBusy();$('#teacher-entry').disabled=pythonBusy();$('#restore').disabled=pythonBusy();
  }
  async function navigate(id,{force=false}={}){
    if(!page(id)||!notebook)return;if(!force&&!accessible(id)){notice('Complete or flag the current question first. Your teacher may also need to release the next activity.');return;}
    const request=++navigating;snapshot();
    const bundle=editors.get(page(current)?.workspace);
    if(bundle?.busy){if(!force){notice('Stop the program before changing page. Your code and output will stay saved.');return;}bundle.shell.stop();if(activeRun)await activeRun;else await new Promise(resolve=>{const check=()=>bundle.busy?setTimeout(check,50):resolve();check();});}
    await saveLocal(true);if(request!==navigating)return;current=id;$('#outline').hidden=true;$('#outline-toggle').setAttribute('aria-expanded','false');renderPage();$('#main').focus({preventScroll:true});$('.progress-nav').scrollIntoView({block:'start',behavior:'auto'});
  }
  async function addImages(event){
    if(!canEdit())return;const files=[...event.target.files],id=current;
    for(const file of files){if(notebook.images.length>=8){notice('This notebook has eight images. Your code and runs are still recorded without screenshots.');break;}
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>3*1024*1024){notice('Choose PNG, JPEG or WebP images no larger than 3 MB each.','error');continue;}
      const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
      try{const im=new Image();im.src=data;await im.decode();notebook.images.push({pageId:id,name:file.name.slice(0,100),data,at:C.now()});}catch{notice('That image could not be read; it was not added.','error');}
    }event.target.value='';changed(id);renderImages();await saveLocal(true);
  }
  function renderImages(){const root=$('#image-evidence');if(!root)return;root.innerHTML=notebook.images.filter(i=>i.pageId===current).map(im=>'<figure><img src="'+im.data+'" alt="Your screenshot evidence: '+esc(im.name)+'"><figcaption>'+esc(im.name)+' · saved in your PDF</figcaption></figure>').join('');}
  function download(filename,content,type){const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([content],{type}));link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),10000);}
  async function exportPDF(){
    if(!notebook||exporting)return;exporting=true;$('#export-pdf').disabled=true;snapshot();await saveLocal(true);
    const bundle=editors.get(page(current)?.workspace),pending=bundle?.shell.runner.pending;
    const partial=pending?{workspace:bundle.workspace,run:{id:crypto.randomUUID(),pageId:bundle.runPage||current,kind:pending.kind,code:pending.code,inputs:[...pending.inputs],stdout:pending.stdout,stderr:pending.stderr,output:pending.output,error:'Still running or waiting for input when exported. This is partial evidence, not a completed test.',ok:false,at:C.now()}}:null;
    try{const result=await ListsReport.exportEvidence(notebook,{pendingRun:partial,onStatus:t=>notice(t)});notice('Saved '+result.filename+'. Open it to check, then attach and Turn in separately in Teams.','success');}catch(e){notice(e.message+' Your notebook backup remains available.','error');}finally{exporting=false;$('#export-pdf').disabled=false;}
  }
  async function recordComplete(){if(!canEdit())return;snapshot();notebook.submittedAt=C.now();C.response(notebook,'finish').status='submitted';changed('finish');await saveLocal(true);await flush();notice(independent?'Completion recorded on this device. Export and Turn in your PDF separately.':dirty.has('finish')?'Completion is saved locally but has not synced yet. Keep the page open.':'Completion reached your teacher. Export and Turn in your PDF separately.',dirty.has('finish')?'':'success');renderPage();}
  async function begin(name,className,mode){
    if(pythonBusy())return;session++;clearInterval(pollTimer);clearTimeout(waitTimer);clearTimeout(syncTimer);clearTimeout(saveTimer);dirty.clear();dirtyVersion.clear();room=learner=null;lastBring=-1;independent=mode==='independent'||mode==='preview';role=mode==='preview'?'preview':'student';
    for(const b of editors.values())b.shell.dispose();editors.clear();
    profile=saveKey(name,className,mode==='preview'?'preview':'student');const saved=await dbGet(profile);try{notebook=saved?C.validateNotebook(saved):C.fresh(name,className,role);}catch{notebook=C.fresh(name,className,role);notice('An incompatible saved draft was left untouched. This lesson uses a new notebook.');}
    notebook.name=name;notebook.className=className;notebook.role=role;current=page(notebook.stage)?notebook.stage:'ready';
    for(const id of saved?.unsynced||[])if(page(id))dirty.add(id);
    try{const last=localStorage.getItem('y10-lists-last-person');if(last!==name+'|'+className)LiveCloud.forgetJoin();localStorage.setItem('y10-lists-last-person',name+'|'+className);}catch{}
    if(!independent){current='ready';await joinLive();}else showLesson();
  }
  function showLesson(){$('#landing').hidden=$('#login').hidden=true;$('#lesson-layout').hidden=false;$('#export-pdf').disabled=false;$('#teacher-controls').hidden=role!=='teacher'&&role!=='preview';renderPage();if(role==='teacher'||role==='preview')renderTeacherControls();connectionLabel();}
  function connectionLabel(){$('#connection').textContent=role==='preview'?'Preview · no live access':role==='teacher'?(connectionFailure?'Teacher connection interrupted':'Teacher controls connected'):independent?'Independent · device notebook':connectionFailure?'Offline · local drafts safe':learner?.status==='admitted'?'Live class connected':'Waiting for teacher';}
  async function joinLive(){
    const version=session;$('#waiting-message').hidden=false;$('#waiting-message').textContent='Finding your teacher’s Lists/Menu lesson…';
    try{await LiveCloud.init({config:CLASSROOM_CONFIG,classId:CLASSROOM_CONFIG.classId});const snapshot=await LiveCloud.joinStudent(notebook.name);if(version!==session)return;room=snapshot.room;learner=snapshot.student;mergeRemote();showLesson();if(learner.status==='admitted')await receiveRoom(room,true);startPoll();}
    catch(e){if(version!==session)return;if(e.code==='P0002'){$('#waiting-message').textContent='No live Lists/Menu class has started yet. This page will check again. You can choose independent practice instead.';waitTimer=setTimeout(joinLive,8000);}else{$('#waiting-message').textContent=e.userMessage||e.message;notice('Live access did not start. Your saved work is safe; independent practice is available.','error');}}
  }
  function mergeRemote(){
    if(!learner?.work)return;
    for(const p of L.pages){const remote=learner.work[p.id];if(remote?.answers?._lesson!==L.version)continue;const local=notebook.pages[p.id];if(local&&(dirty.has(p.id)||Date.parse(local.updatedAt||0)>=Date.parse(remote.updated_at||0)))continue;
      const r=C.response(notebook,p.id);r.answer=String(remote.answers.answer||'');r.evidence=String(remote.answers.evidence||'');r.status=remote.answers._status||'draft';r.attempts=remote.answers.attempts||[];r.test=remote.answers.test||null;r.hintUsed=remote.answers.hintUsed===true;r.updatedAt=remote.updated_at;r.visitedAt=remote.updated_at;
      if(Array.isArray(remote.answers.optionOrder))r.optionOrder=remote.answers.optionOrder;
      if(p.workspace){const existed=!!notebook.workspaces[p.workspace],w=C.workspace(notebook,p.workspace,p.initial||'');if(!existed||!w.updatedAt||Date.parse(w.updatedAt)<Date.parse(remote.updated_at)){w.code=remote.code||w.code;w.shell=remote.answers._shell||w.shell;w.updatedAt=remote.updated_at;}for(let i=0;i<(remote.runs||[]).length;i++){const run=remote.runs[i],id='cloud-'+p.id+'-'+remote.updated_at+'-'+i;if(!w.runs.some(x=>x.id===id||x.pageId===p.id&&x.at===run.at&&x.code===run.code&&JSON.stringify(x.inputs)===JSON.stringify(run.inputs)))w.runs.push({...run,id,pageId:p.id,kind:'module'});}}
    }
    rememberFeedback();saveLocal();
  }
  function rememberFeedback(){const text=String(learner?.feedback||'');if(text&&!notebook.feedback.some(f=>f.text===text&&f.at===learner.feedback_at)){notebook.feedback.push({text,at:learner.feedback_at||C.now()});saveLocal();}}
  async function receiveRoom(next,initial=false){
    if(!next)return;room=next;connectionFailure='';rememberFeedback();
    if(learner?.status==='admitted'&&!room.ended){const bring=Number(room.bring_revision)||0;if(initial||bring>lastBring){lastBring=bring;if(page(room.stage))await navigate(room.stage,{force:true});}else if(room.mode==='present'&&current!==room.stage)await navigate(room.stage,{force:true});}
    header();applyEditing();connectionLabel();
  }
  async function flush(){
    if(syncing||independent||role!=='student'||learner?.status!=='admitted'||!room||room.ended||room.mode!=='work')return;
    syncing=true;const version=session;
    try{for(const id of [...dirty]){if(!canEdit(id))continue;const stamp=dirtyVersion.get(id)||0;const updated=await LiveCloud.studentSave(C.cloudPayload(notebook,id));if(version!==session)return;learner=updated;if(stamp===(dirtyVersion.get(id)||0))dirty.delete(id);}connectionFailure='';await saveLocal(true);}
    catch(e){if(version===session){connectionFailure=e.userMessage||e.message;$('#saved-status').textContent='Saved on device · cloud sync pending';}}finally{syncing=false;connectionLabel();}
  }
  function startPoll(){clearInterval(pollTimer);pollTimer=setInterval(poll,2500);}
  async function poll(){
    if(polling||independent||!notebook)return;polling=true;const version=session;
    try{if(role==='teacher'){const state=await LiveCloud.teacherState();if(version!==session)return;room=state.room;students=state.students;connectionFailure='';updateTeacherStatus();if(!$('#responses').hidden)renderRoster();}else{const state=await LiveCloud.studentPoll();if(version!==session)return;learner=state.student;await receiveRoom(state.room);await flush();}connectionLabel();}
    catch(e){if(version===session){connectionFailure=e.userMessage||e.message;connectionLabel();}}finally{polling=false;}
  }
  function renderFeedback(){const el=$('#private-feedback');if(role!=='student'){el.hidden=true;return;}const text=String(learner?.feedback||'');el.hidden=!text;el.textContent=text?'Private teacher feedback\n'+text:'';}
  function renderDemo(){
    const el=$('#live-demo'),d=room?.demo;if(role!=='student'||independent||learner?.status!=='admitted'||room?.ended||current!==room?.stage||!d?.code){el.hidden=true;return;}
    el.hidden=false;const sig=JSON.stringify([d.code,d.line,d.output]);if(el.dataset.signature===sig)return;el.dataset.signature=sig;
    el.innerHTML='<p class="eyebrow">LIVE TEACHER DEMONSTRATION · READ ONLY</p><h2>Watch the shared code.</h2><pre aria-label="Teacher shared code">'+d.code.split('\n').map((line,i)=>'<span class="demo-line '+(i+1===Number(d.line)?'current':'')+'">'+String(i+1).padStart(2,' ')+'  '+esc(line||' ')+'</span>').join('')+'</pre><p>The highlighted line is your teacher’s pointer, not an automatic execution trace. Your own program is saved separately.</p>'+(d.output?'<h3>Teacher Shell output</h3><pre>'+esc(d.output)+'</pre>':'');
  }
  // Teacher controls below never grant authority from a name or URL parameter.
  // Every live mutation is checked against the approved owner by Supabase.
  function renderTeacherControls(){
    const root=$('#teacher-controls');
    if(role==='preview'){root.innerHTML='<div class="teacher-row"><strong>Teacher preview · no live access</strong><button id="preview-signin">Sign in for live controls</button><button id="preview-exit" class="quiet">Return to entry</button></div><p>You can review all lesson pages and rehearse Python. No students, admission controls or classroom data are loaded.</p>';$('#preview-signin').onclick=showLogin;$('#preview-exit').onclick=returnEntry;return;}
    root.innerHTML='<div class="teacher-row"><strong id="teacher-status">Teacher classroom</strong><button id="start-class">Start Lists/Menu classroom</button><button id="bring-class">Bring class to this page</button><button id="mode-present" class="secondary">Watch</button><button id="mode-work" class="secondary">Enable answers</button><button id="mode-paused" class="secondary">Pause</button><button id="show-responses" class="secondary">Class responses</button><button id="share-safe" class="quiet">Share-safe view</button></div><div class="teacher-row"><label for="teacher-page">Preview page</label><select id="teacher-page">'+L.pages.map(p=>'<option value="'+p.id+'">'+esc(group(p.group).name+' · '+p.title)+'</option>').join('')+'</select><button id="release-activity" class="secondary">Release this activity for practice</button><button id="end-class" class="quiet">End class</button><button id="teacher-signout" class="quiet">Sign out</button></div><p id="teacher-location"></p><details class="demo-tools"><summary>Live Python demonstration</summary><p>Your model appears directly on students’ current class page. Their own code is never overwritten. Bring the class to this page before sharing.</p><div class="teacher-row"><label for="demo-model">Prepared model</label><select id="demo-model"><option value="first">Create and access a list</option><option value="traversal">Traverse the updated list</option><option value="menu">Complete nested menu</option><option value="scaffold">Menu scaffold</option></select><button id="load-demo" class="secondary">Load model</button><button id="share-demo">Share code</button><button id="run-demo" class="secondary">Run and share</button><button id="stop-demo" class="secondary">Stop run</button><button id="hide-demo" class="quiet">Hide shared demo</button></div><label for="demo-code">Teacher source · Python</label><textarea id="demo-code" spellcheck="false">'+esc(demoSource||L.models.first)+'</textarea><div class="teacher-row"><label for="demo-line">Highlight line</label><input id="demo-line" type="number" min="0" max="2000" value="0" style="width:90px"><label><input id="auto-demo" type="checkbox" style="width:auto"> Share edits automatically</label></div><div id="demo-shell"></div></details>';
    $('#teacher-page').value=current;
    $('#start-class').onclick=()=>teacherAction(async()=>{if(room&&!room.ended){notice('A Lists/Menu classroom is already running. Use Bring class or End class; no new room was created.');return;}const state=await LiveCloud.teacherStart('ready');room=state.room;students=state.students;await control({stage:'ready',mode:'present',released_stages:['ready']});notice('Lists/Menu classroom started. Share this lesson’s permanent link and admit students.','success');});
    $('#bring-class').onclick=()=>teacherAction(async()=>{lastDemo='';await control({stage:current,mode:room?.mode==='paused'?'present':room?.mode||'present',demo:{code:'',output:'',line:0}});notice('Class recalled to '+page(current).title+'. Drafts are protected.','success');});
    for(const mode of ['present','work','paused'])$('#mode-'+mode).onclick=()=>teacherAction(()=>control({mode}));
    $('#release-activity').onclick=()=>teacherAction(async()=>{const ids=L.pages.filter(p=>p.group===page(current).group).map(p=>p.id);await control({stage:current,mode:'work',released_stages:[...new Set([...(room?.released_stages||[]),...ids])],demo:{code:'',output:'',line:0}});notice('This activity is released for student-paced practice. Earlier work stays available.','success');});
    $('#teacher-page').onchange=e=>navigate(e.target.value,{force:true});
    $('#show-responses').onclick=()=>{if(shareSafe){notice('Leave share-safe view before opening private student responses.');return;}selectedStudent=null;responsePage=current;$('#responses').hidden=false;document.body.classList.add('responses-open');renderRoster();for(const b of editors.values())b.cm.refresh();};
    $('#share-safe').onclick=()=>{shareSafe=!shareSafe;document.body.classList.toggle('share-safe',shareSafe);closeResponses();$('#share-safe').textContent=shareSafe?'Exit share-safe view':'Share-safe view';notice(shareSafe?'Private responses are hidden. Keep this teaching view on the projector; do not share the private panel.':'Private teacher controls available again.');};
    $('#end-class').onclick=()=>teacherAction(async()=>{if(!room||room.ended)return;if(!confirm('End this live Lists/Menu session? Saved student work is retained for review.'))return;await control({ended:true});});
    $('#teacher-signout').onclick=async()=>{await stopDemonstration();await LiveCloud.teacherLogout();returnEntry();};
    $('#load-demo').onclick=async()=>{if(demoRunning){notice('Stop the teacher run before loading a different model.');return;}$('#demo-code').value=L.models[$('#demo-model').value];demoSource=$('#demo-code').value;if($('#auto-demo').checked)queueDemo();};
    $('#share-demo').onclick=()=>teacherAction(()=>shareDemo());
    $('#demo-code').oninput=()=>{demoSource=$('#demo-code').value;if($('#auto-demo').checked)queueDemo();};
    $('#demo-line').oninput=()=>{if($('#auto-demo').checked)queueDemo();};
    $('#run-demo').onclick=runDemonstration;$('#stop-demo').onclick=()=>demoShell?.stop();
    $('#hide-demo').onclick=()=>teacherAction(async()=>{await stopDemonstration();$('#auto-demo').checked=false;lastDemo='';await control({demo:{code:'',output:'',line:0}});});
    demoSource=$('#demo-code').value;
    demoShell?.dispose();demoShell=new PythonShell($('#demo-shell'),{canEdit:()=>role==='teacher',onChange:text=>{if(demoRunning){demoRun={code:demoRunCode,output:text};queueDemo();}},onBusy:b=>{demoRunning=b;},onResult:r=>{demoRun={code:r.code,output:r.shellTranscript};queueDemo();}});
    updateTeacherStatus();
  }
  function updateTeacherStatus(){
    if(role!=='teacher')return;const status=$('#teacher-status');if(!status)return;status.textContent=room&&!room.ended?'LIVE · '+({present:'Watch',work:'Answers enabled',paused:'Paused'}[room.mode]):'Lists/Menu classroom not running';
    $('#teacher-location').textContent='Preview: '+page(current).title+'. '+(room&&!room.ended?'Class page: '+(page(room.stage)?.title||room.stage)+'. Previewing does not move students; use Bring class.':'Start this lesson to use live controls. No FOR-loop session is changed.');
    $('#teacher-page').value=current;for(const id of ['bring-class','mode-present','mode-work','mode-paused','release-activity','end-class'])$('#'+id).disabled=teacherBusy||!room||room.ended;
    $('#start-class').disabled=teacherBusy||Boolean(room&&!room.ended);
  }
  async function control(patch){if(role!=='teacher')throw Error('Teacher sign-in is required.');room=await LiveCloud.teacherControl(patch);updateTeacherStatus();if(!$('#responses').hidden)renderRoster();return room;}
  async function teacherAction(fn){if(teacherBusy)return;teacherBusy=true;updateTeacherStatus();try{await fn();connectionFailure='';}catch(e){notice(e.userMessage||e.message,'error');connectionFailure=e.userMessage||e.message;}finally{teacherBusy=false;updateTeacherStatus();connectionLabel();}}
  function closeResponses(){saveFeedbackDraft();$('#responses').hidden=true;document.body.classList.remove('responses-open');for(const b of editors.values())b.cm.refresh();}
  function saveFeedbackDraft(){const field=$('#feedback-text');if(field&&selectedStudent)feedbackDrafts.set(selectedStudent,field.value);}
  function renderRoster(){
    if(role!=='teacher'||shareSafe||$('#responses').hidden)return;
    if(selectedStudent){renderIndividual();return;}
    const id=responsePage||current,p=page(id);const panel=$('#responses');
    panel.innerHTML='<div class="response-top"><h2>Class responses</h2><button id="close-responses" class="quiet">Close</button></div><p class="small">Private teacher view. This is saved work, not a claim that someone is typing or understands.</p><label for="response-page">Responses for</label><select id="response-page">'+L.pages.map(x=>'<option value="'+x.id+'" '+(x.id===id?'selected':'')+'>'+esc(x.title)+'</option>').join('')+'</select><p class="response-meta">'+students.filter(s=>s.status==='admitted').length+' admitted · '+students.filter(s=>s.status==='pending').length+' waiting</p>'+(!students.length?'<p>No students have joined this Lists/Menu session yet.</p>':students.map(s=>{
      const w=s.work?.[id],a=w?.answers?.answer,run=w?.runs?.at(-1);
      return '<button class="student-card" data-student="'+s.id+'"><strong>'+esc(s.name)+(s.help_requested?' · HELP REQUEST':'')+'</strong><p>'+esc(s.status)+' · On '+esc(page(s.latest_stage)?.title||'Get ready')+'</p><p>'+esc(w?.answers?._status||'No saved response on this page')+'</p>'+(a?'<p>'+esc(ListsReport.readable(p,a)).slice(0,330)+'</p>':'')+(w?.code?'<pre>'+esc(w.code.slice(0,500))+'</pre>':'')+(run?'<p>Last run: '+(run.ok?'finished; inspect evidence':'needs review')+'</p>':'')+'<p>Last contact: '+esc(formatTime(s.last_seen_at))+'</p></button>';
    }).join(''));
    $('#close-responses').onclick=closeResponses;$('#response-page').onchange=e=>{responsePage=e.target.value;renderRoster();};
    panel.querySelectorAll('[data-student]').forEach(b=>b.onclick=()=>{selectedStudent=b.dataset.student;renderIndividual(true);});
  }
  function formatTime(value){try{return new Date(value).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Asia/Kuala_Lumpur'});}catch{return value||'not recorded';}}
  function renderIndividual(force=false){
    const s=students.find(x=>x.id===selectedStudent);if(!s){selectedStudent=null;renderRoster();return;}
    const id=responsePage||current,p=page(id),w=s.work?.[id],panel=$('#responses');
    if(!force&&panel.querySelector('#feedback-text')===document.activeElement){const region=$('#student-work');if(region)region.innerHTML=studentWorkHTML(w,p);return;}
    saveFeedbackDraft();panel.innerHTML='<div class="response-top"><h2>'+esc(s.name)+'</h2><button id="close-responses" class="quiet">Close</button></div><button id="back-roster" class="quiet">← All students</button><p class="response-meta">'+esc(s.status)+' · Last contact '+esc(formatTime(s.last_seen_at))+'</p>'+(s.help_requested?'<p class="coach">'+esc(s.help_note||'Written help requested')+'</p>':'')+'<label for="individual-page">Inspect page</label><select id="individual-page">'+L.pages.map(x=>'<option value="'+x.id+'" '+(x.id===id?'selected':'')+'>'+esc(x.title)+'</option>').join('')+'</select><div id="student-work">'+studentWorkHTML(w,p)+'</div>'+(s.status!=='admitted'?'<button id="admit-student">Admit this student</button>':'')+'<label for="feedback-text">One private written next step</label><textarea id="feedback-text" maxlength="3000">'+esc(feedbackDrafts.get(s.id)??s.feedback??'')+'</textarea><button id="send-feedback" '+(s.status!=='admitted'?'disabled':'')+'>Send private feedback</button><label for="unlock-page">Individual page release</label><select id="unlock-page">'+L.pages.map(x=>'<option value="'+x.id+'" '+(x.id===id?'selected':'')+'>'+esc(x.title)+'</option>').join('')+'</select><button id="unlock-student" class="secondary" '+(s.status!=='admitted'?'disabled':'')+'>Release this page for this student</button><p class="small" id="feedback-state">'+(s.feedback?'Last feedback: '+esc(s.feedback):'No feedback sent yet.')+'</p>';
    $('#close-responses').onclick=closeResponses;$('#back-roster').onclick=()=>{saveFeedbackDraft();selectedStudent=null;renderRoster();};$('#individual-page').onchange=e=>{saveFeedbackDraft();responsePage=e.target.value;renderIndividual(true);};
    $('#admit-student')?.addEventListener('click',()=>teacherAction(async()=>{await LiveCloud.teacherAdmit(s.id,true);await refreshTeacher();renderIndividual(true);}));
    $('#send-feedback').onclick=()=>teacherAction(async()=>{const text=$('#feedback-text').value.trim();if(!text){notice('Write a clear next step before sending feedback.');return;}feedbackDrafts.set(s.id,text);await LiveCloud.teacherFeedback(s.id,text);await refreshTeacher();notice('Private written feedback sent.','success');renderIndividual(true);});
    $('#unlock-student').onclick=()=>teacherAction(async()=>{await LiveCloud.teacherUnlock(s.id,$('#unlock-page').value,true);notice('Individual page released. It becomes editable when classroom answers are enabled.','success');await refreshTeacher();});
  }
  function studentWorkHTML(w,p){
    if(!w||w.answers?._lesson!==L.version)return '<p>No saved work on this page yet.</p>';
    const a=w.answers,run=w.runs?.at(-1);
    return '<h3>'+esc(p.prompt||p.title)+'</h3><p>Status: '+esc(a._status||'saved')+'</p><p>'+esc(ListsReport.readable(p,a.answer))+'</p>'+(a.evidence?'<p>Student note: '+esc(a.evidence)+'</p>':'')+(a.test?'<p class="coach">'+esc(a.test.message)+'</p>':'')+(w.code?'<h3>Current source</h3><pre>'+esc(w.code)+'</pre>':'')+(a._shell?'<h3>Recent Shell snapshot</h3><pre>'+esc(a._shell)+'</pre>':'')+(run?'<h3>Latest actual run</h3><p>Inputs: '+esc(JSON.stringify(run.inputs))+'</p><pre>'+esc(run.stdout||run.output||'(No output.)')+'</pre>'+(run.error?'<pre>'+esc(run.error)+'</pre>':'')+'<details><summary>Source actually executed</summary><pre>'+esc(run.code)+'</pre></details>':'<p>No actual run saved on this page.</p>')+'<p class="small">The cloud view holds the latest eight runs per page. The student PDF / backup preserves their device history and screenshots.</p>';
  }
  async function refreshTeacher(){const state=await LiveCloud.teacherState();room=state.room;students=state.students;updateTeacherStatus();}
  function queueDemo(){clearTimeout(demoTimer);demoTimer=setTimeout(()=>{if(role==='teacher'&&$('#auto-demo')?.checked)shareDemo().catch(e=>notice(e.userMessage||e.message,'error'));},450);}
  async function shareDemo(){
    if(role!=='teacher'||!room||room.ended||room.stage!==current)throw Error('Bring the class to this page before sharing a live model.');
    if(demoSending){demoQueued=true;return;}demoSending=true;
    try{const code=$('#demo-code').value.slice(0,20000);demoSource=code;$('#auto-demo').checked=true;const demo={code,line:Math.max(0,Math.min(2000,Math.floor(Number($('#demo-line').value)||0))),output:demoRun?.code===code?demoRun.output.slice(-16000):''};const signature=JSON.stringify([room.id,current,demo]);if(signature!==lastDemo){await control({demo});lastDemo=signature;}}
    finally{demoSending=false;if(demoQueued){demoQueued=false;queueDemo();}}
  }
  async function runDemonstration(){
    if(demoRunning||!demoShell)return;
    try{await shareDemo();demoRunCode=$('#demo-code').value;demoShell.transcript='';demoShell.draw();demoRun={code:demoRunCode,output:''};await demoShell.execute(demoRunCode);await shareDemo();}
    catch(e){notice(e.userMessage||e.message,'error');}
  }
  async function stopDemonstration(){clearTimeout(demoTimer);if(demoShell?.busy)demoShell.stop();}
  async function teacherLogin(event){
    event.preventDefault();const button=$('#login-form button');button.disabled=true;notice('Checking your existing teacher permissions…');
    try{await LiveCloud.init({config:CLASSROOM_CONFIG,classId:CLASSROOM_CONFIG.classId});const state=await LiveCloud.teacherLogin($('#email').value,$('#password').value);$('#password').value='';await begin('Teacher rehearsal','Year 10','preview');role='teacher';independent=false;notebook.role='teacher';room=state.room;students=state.students;current=page(room?.stage)?room.stage:'ready';showLesson();startPoll();notice('Teacher access confirmed. This Lists/Menu room is separate from the FOR and WHILE lessons.','success');}
    catch(e){$('#password').value='';notice(e.userMessage||e.message,'error');}finally{button.disabled=false;}
  }
  function showLogin(){if(pythonBusy()){notice('Stop your program before opening teacher sign-in.');return;}snapshot();saveLocal(true);$('#login').hidden=false;$('#landing').hidden=true;$('#lesson-layout').hidden=true;$('#teacher-controls').hidden=true;}
  async function returnEntry(){
    if(pythonBusy()){notice('Stop the Python run before returning to entry.');return;}snapshot();await saveLocal(true);session++;clearInterval(pollTimer);clearTimeout(waitTimer);clearTimeout(syncTimer);await stopDemonstration();closeResponses();room=learner=null;role='student';independent=true;$('#landing').hidden=false;$('#login').hidden=true;$('#lesson-layout').hidden=true;$('#teacher-controls').hidden=true;$('#waiting-message').hidden=true;$('#export-pdf').disabled=true;notice('Your notebook is saved on this device. Enter the same name and class to return.');connectionLabel();
  }
  $('#entry-form').onsubmit=event=>{event.preventDefault();const name=$('#name').value.trim(),cls=$('#class-name').value.trim();if(name.toLowerCase()==='teacher'){begin('Teacher preview','Year 10','preview');return;}if(name.length>=2&&cls)begin(name,cls,'live');};
  $('#independent').onclick=()=>{if(!$('#entry-form').reportValidity())return;const name=$('#name').value.trim();begin(name.toLowerCase()==='teacher'?'Teacher preview':name,$('#class-name').value.trim(),name.toLowerCase()==='teacher'?'preview':'independent');};
  $('#teacher-entry').onclick=showLogin;$('#back-entry').onclick=returnEntry;$('#login-form').onsubmit=teacherLogin;$('#preview').onclick=()=>begin('Teacher preview','Year 10','preview');
  $('#previous').onclick=()=>{const id=prevId();if(id)navigate(id,{force:role==='teacher'||role==='preview'});};
  $('#next').onclick=()=>{const id=nextId();if(id)navigate(id,{force:role==='teacher'||role==='preview'});};
  $('#outline-toggle').onclick=()=>{const open=$('#outline').hidden;$('#outline').hidden=!open;$('#outline-toggle').setAttribute('aria-expanded',String(open));if(open)renderOutline();};
  $('#export-pdf').onclick=exportPDF;$('#change-student').onclick=returnEntry;
  $('#backup').onclick=()=>{snapshot();download('Y10_LISTS_'+C.safeName(notebook.name)+'_notebook.json',JSON.stringify(notebook,null,2),'application/json');};
  $('#restore').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>30000000)throw Error('This backup is too large.');const imported=C.validateNotebook(JSON.parse(await file.text()));if(role==='teacher'||role==='preview')throw Error('Restore student backups from student or independent mode, not teacher preview.');if(imported.name!==notebook.name||imported.className!==notebook.className)throw Error('The backup belongs to a different name or class. Return to entry and use that identity first.');if(!confirm('Restore this matching backup? Download a backup of your currently open work first if you need to keep both versions.'))return;for(const b of editors.values())b.shell.dispose();editors.clear();notebook=imported;current=imported.stage;for(const id of Object.keys(imported.pages))dirty.add(id);await saveLocal(true);renderPage();notice('Matching notebook restored. Screenshots and actual runs are included.','success');}catch(e){notice(e.message,'error');}finally{event.target.value='';}};
  $('#help').onclick=()=>$('#support-dialog').showModal();$('#pause-request').onclick=()=>{$('#help-note').value='I would like a quiet pause before continuing.';$('#support-dialog').showModal();};
  $('#support-form').onsubmit=async event=>{event.preventDefault();const note=$('#help-note').value;response().help=note;changed();$('#support-dialog').close();if(!independent&&role==='student'){try{await LiveCloud.setHelp(true,note);notice('Your private written request reached your teacher.','success');}catch{notice('Request saved locally, but the teacher connection is unavailable. Use Teams chat or your agreed support signal.','error');}}else notice('Your request is saved in this notebook. Independent mode cannot send it: use Teams chat or your agreed support signal.');};
  document.addEventListener('keydown',event=>{if(event.key==='F5'&&notebook&&page(current)?.workspace){event.preventDefault();runProgram();}if(event.ctrlKey&&event.key.toLowerCase()==='c'&&activeRun)editors.get(page(current)?.workspace)?.shell.stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&notebook){snapshot();saveLocal(true);flush();}});
  window.addEventListener('beforeunload',()=>{snapshot();saveLocal(true);});
  if(new URL(location.href).searchParams.get('teacher')==='1')showLogin();
})();
