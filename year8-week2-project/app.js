/* Static, account-free lesson. Student evidence never leaves the browser except by export. */
(function () {
  'use strict';
  const L = window.Lesson, V = window.Views;
  const $ = id => document.getElementById(id);
  const PREFIX = 'y8w2project.v3.';
  let state = null, images = {}, profile = '', teacher = false, dbPromise;
  let saveTimer, toastTimer, storageHealthy = true, imageHealthy = true, lastFocus, pending = Promise.resolve(), evidenceLoading = Promise.resolve();
  let originals = {};
  const now = () => new Date().toISOString();
  const profileKey = (name, cls, isTeacher) => isTeacher ? PREFIX + 'teacher' : PREFIX + 'student.' + encodeURIComponent(name.trim().toLowerCase() + '|' + cls.trim().toLowerCase());
  function safeRead(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(()=>{$('toast').hidden=true;},6500); }
  function save(sync = false) {
    if (!state) return;
    clearTimeout(saveTimer);
    $('saveStatus').textContent = 'Saving…';
    const write = () => {
      state.updated = now();
      try {
        localStorage.setItem(profile, JSON.stringify(state));
        if (!teacher) localStorage.setItem(PREFIX+'lastStudent', JSON.stringify({profile,name:state.student.name,className:state.student.className}));
        storageHealthy = true;
      } catch { storageHealthy = false; }
      $('saveStatus').textContent = storageHealthy && imageHealthy ? 'Saved on this device' : 'Save incomplete — back up now';
      $('saveStatus').classList.toggle('save-warning',!storageHealthy || !imageHealthy);
    };
    if (sync) write(); else saveTimer = setTimeout(write,180);
  }
  function log(type, data = {}, card = state?.current) {
    if (!state) return;
    state.history.push({at:now(),card,type,data:JSON.parse(JSON.stringify(data))});
  }
  function openDB() {
    if (!dbPromise) dbPromise = new Promise((resolve,reject) => {
      if (!window.indexedDB) { reject(new Error('Image storage is unavailable.')); return; }
      const q = indexedDB.open('year8-week2-project-evidence-v3',1);
      q.onupgradeneeded = () => { if (!q.result.objectStoreNames.contains('images')) q.result.createObjectStore('images'); };
      q.onsuccess = () => resolve(q.result);
      q.onerror = () => reject(q.error || new Error('Image storage could not open.'));
      q.onblocked = () => reject(new Error('Close other copies of the lesson, then try again.'));
    });
    return dbPromise;
  }
  async function readImages(sessionId) {
    const db = await openDB(), found = {};
    await Promise.all(['code','device'].map(slot => new Promise((resolve,reject)=>{
      const q=db.transaction('images','readonly').objectStore('images').get(sessionId+'|'+slot);
      q.onsuccess=()=>{if(q.result)found[slot]=q.result;resolve();}; q.onerror=()=>reject(q.error);
    })));
    return found;
  }
  async function writeImages(sessionId, values) {
    const db=await openDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('images','readwrite'), store=tx.objectStore('images');
      for(const slot of ['code','device']) { if(values[slot])store.put(values[slot],sessionId+'|'+slot);else store.delete(sessionId+'|'+slot); }
      tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error || new Error('Evidence could not be saved.')); tx.onabort=()=>reject(tx.error || new Error('Evidence save was interrupted.'));
    });
  }
  async function activate(s, key, isTeacher) {
    state=s;profile=key;teacher=isTeacher;originals={...state.responses};images={};storageHealthy=true;imageHealthy=true;evidenceLoading=Promise.resolve();
    const session=s.sessionId;
    $('entry').hidden=true;$('app').hidden=false;
    render();save(true); // Navigation must not wait on IndexedDB, especially on managed iPads.
    if(!Object.keys(state.evidence).length)return;
    $('saveStatus').textContent='Loading saved evidence…';
    evidenceLoading=Promise.race([
      readImages(session),
      new Promise((resolve,reject)=>setTimeout(()=>reject(new Error('Saved images took too long to load.')),5000))
    ]);
    try {
      const loaded=await evidenceLoading;
      if(!state || state.sessionId!==session)return;
      images=loaded;state.evidenceUnavailable=false;
      for(const slot of ['code','device']) {
        if(images[slot] && state.evidence[slot]) {
          images[slot].caption=state.evidence[slot]?.caption ?? images[slot].caption;
          state.evidence[slot]={caption:images[slot].caption,at:images[slot].at};
        } else if(state.evidence[slot]) {
          delete state.evidence[slot]; imageHealthy=false;state.evidenceUnavailable=true;
          if(state.cards.evidence)state.cards.evidence.status='review';
          toast('A saved image is missing. Restore your backup or add the image again.');
        } else {
          delete images[slot]; // Ignore any orphaned copy from an earlier failed deletion.
        }
      }
    } catch {
      if(!state || state.sessionId!==session)return;
      imageHealthy=false;state.evidenceUnavailable=true;
      if(state.cards.evidence)state.cards.evidence.status='review';
      toast('Saved images could not load. Keep working; restore an earlier backup or add evidence again.');
    }
    save(true);render(false);
  }
  function normalizeSaved(s) {
    if(!s || s.lessonId!==L.ID || s.version!==L.VERSION || !s.student || typeof s.sessionId!=='string')return null;
    s.responses=s.responses || {};s.cards=s.cards || {};s.checks=s.checks || {};s.evidence=s.evidence || {};s.history=Array.isArray(s.history)?s.history:[];
    if(!L.CARDS.some(c=>c.id===s.current))s.current='starter';
    s.reached=Math.min(L.CORE.length-1,Math.max(0,Number(s.reached)||0));
    return s;
  }
  function preserveLegacy(s,isTeacher) {
    const old=safeRead(isTeacher?'y8-w2-project-teacher':'y8-w2-project-student');
    if(old && (isTeacher || (String(old.studentName).trim().toLowerCase()===s.student.name.toLowerCase() && String(old.studentClass).trim().toLowerCase()===s.student.className.toLowerCase()))) {
      s.legacy={studentName:old.studentName,studentClass:old.studentClass,responses:old.responses || {},checks:old.checks || {},completed:old.completed || [],updated:old.updated};
    }
  }
  function enter(event) {
    event.preventDefault();
    const name=$('fullName').value.trim(), cls=$('className').value.trim();
    const isTeacher=name.toLowerCase()==='teacher' || new URLSearchParams(location.search).get('teacher')==='1';
    if(!name && !isTeacher) { $('entryError').textContent='Enter your full name to start.';$('fullName').focus();return; }
    if(!cls && !isTeacher) { $('entryError').textContent='Enter your class to start.';$('className').focus();return; }
    const student=name || 'Teacher', className=cls || '8T';
    const key=profileKey(student,className,isTeacher);
    const saved=normalizeSaved(safeRead(key));
    const s=saved || L.blank(student,className,$('entryLanguage').value);
    s.language=$('entryLanguage').value;
    if(isTeacher && !saved)Object.assign(s.responses,{device:'laptop',editor:'blocks',icon:'HEART',message:'AB'});
    if(!saved)preserveLegacy(s,isTeacher);
    $('entryError').textContent='';
    activate(s,key,isTeacher).catch(err=>{ $('entryError').textContent='Could not start: '+err.message; });
  }
  function render(focus = true) {
    if(!state)return;
    const focusedField=document.activeElement?.dataset?.field;
    const focusedValue=document.activeElement?.value;
    const c=L.CARDS.find(c=>c.id===state.current);
    const coreIndex=L.CORE.findIndex(item=>item.id===state.current);
    $('studentIdentity').textContent=state.student.name+' · '+state.student.className;
    $('locationLabel').textContent=c.stage;
    $('cardCount').textContent=c.optional?'Optional · choose your level':`Card ${coreIndex+1} of ${L.CORE.length}`;
    $('card').innerHTML=V.card(state,images);
    $('continueFeedback').hidden=true;
    const recorded=L.CORE.filter(item=>['done','review'].includes(state.cards[item.id]?.status)).length;
    $('progressFill').style.width=(recorded/L.CORE.length*100)+'%';
    document.querySelector('.progress-track').setAttribute('aria-valuenow',String(recorded));
    document.querySelector('.progress-track').setAttribute('aria-valuetext',`${recorded} of ${L.CORE.length} core cards recorded; some may need review`);
    $('backButton').disabled=!c.optional && coreIndex===0;
    $('nextButton').hidden=state.current==='review';
    $('nextButton').textContent=c.optional ? 'Save extension & choose next →' : state.current==='plenary' ? 'Review my work →' : 'Continue →';
    if(focus){ $('card').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    else if(focusedField){
      const nodes=Array.from(document.querySelectorAll(`[data-field="${focusedField}"]`));
      const replacement=nodes.find(n=>n.value===focusedValue) || nodes[0];
      const detail=replacement?.closest('details');
      if(detail && !detail.open)detail.querySelector('summary')?.focus({preventScroll:true});
      else replacement?.focus({preventScroll:true});
    }
  }
  function snapshot(id) {
    const data={}; for(const [k,[card]]of Object.entries(L.FIELDS))if(card===id && state.responses[k])data[k]=state.responses[k];
    return data;
  }
  function record(id, force=false) {
    const reasons=L.reviewReasons(state,id);
    state.cards[id]={status:reasons.length || force ? 'review':'done',at:now()};
    log(reasons.length || force ? 'Submitted for review':'Submitted',snapshot(id),id);
    save(true);
  }
  function continueCard(force=false) {
    if(!state)return;
    const c=L.CARDS.find(c=>c.id===state.current), missing=L.missing(state,c.id);
    if(missing.length && !force && !teacher) {
      $('continueFeedback').hidden=false;
      $('continueFeedback').innerHTML=`<strong>One small thing to finish, or ask for help</strong><ul>${missing.map(x=>`<li>${V.e(x)}</li>`).join('')}</ul><p>You will not be locked here. If you are stuck, keep what you have and continue with a “needs review” record.</p>${V.button('continue-review','Continue — mark for review')}`;
      $('continueFeedback').scrollIntoView({block:'nearest',behavior:'smooth'});return;
    }
    for(const key of ['prediction','eventCheck'])if(L.FIELDS[key][0]===c.id && state.responses[key] && !state.checks[key])check(key,false);
    record(c.id,force);
    if(c.optional){extensions();return;}
    const idx=L.CORE.findIndex(x=>x.id===c.id), next=L.CORE[idx+1];
    if(next){state.reached=Math.max(state.reached,idx+1);go(next.id);}
  }
  function go(id, allow=false) {
    const c=L.CARDS.find(x=>x.id===id);if(!c)return;
    if(c.optional && !teacher && state.reached<8){toast('Try the main badge tasks first. Extensions open when you reach the evidence card.');return;}
    const idx=L.CORE.findIndex(x=>x.id===id);
    if(!teacher && !c.optional && idx>state.reached && !allow){toast('Use Continue to record your current card first. You can always choose “mark for review” if you need help.');return;}
    if(c.optional && state.current==='evidence')record('evidence');
    state.current=id;save(true);if($('dialog').open)$('dialog').close();render();
  }
  function check(key, update=true) {
    const value=state.responses[key];
    if(!value){toast('Choose a prediction first. You can still continue for teacher review.');return;}
    const result=L.grade(key,value);if(!result)return;
    state.checks[key]={...result,answer:value,at:now()};log('Concept-check attempt',{[key]:value,result:result.correct?'correct':'review needed'});save();
    if(update){const target=$('feedback-'+key);if(target)target.innerHTML=V.feedback(state,key,result);}
  }
  function openDialog(title,html) {
    lastFocus=document.activeElement;$('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;
    if(!$('dialog').open)$('dialog').showModal();
  }
  function closeDialog(){ $('dialog').close();if(lastFocus?.isConnected)lastFocus.focus(); }
  function menu() {
    openDialog('Your lesson',`<ol class="menu-list">${L.CORE.map((c,i)=>`<li>${V.button('go',`${i+1}. ${V.e(c.title)}`,`data-card="${c.id}" ${!teacher && i>state.reached?'disabled':''}`)}<span class="badge ${state.cards[c.id]?.status==='done'?'done':'review'}">${V.e(V.status(state,c.id))}</span></li>`).join('')}</ol><div class="buttons">${V.button('extensions','Optional extensions')}${V.button('pdf','Export current progress as PDF')}${V.button('backup','Download progress backup')}${V.button('import','Restore backup')}${V.button('reset','Reset this student’s progress')}</div><p class="small">Progress is private to this browser. You can export a partial report at any time. Nothing is sent to your teacher automatically.</p>`);
  }
  function extensions() {
    if(!teacher && state.reached<8){toast('Extensions open after the main build-and-test cards.');return;}
    openDialog('Finished early? Keep learning.',`<p>Choose the challenge that stretches you. After one, choose another while there is time. You do not need to finish all three to reach the plenary.</p><div class="choices">${L.CARDS.filter(c=>c.optional).map(c=>V.button('go',V.e(c.stage+' — '+c.title),`data-card="${c.id}"`)).join('')}</div><p class="small">Level 1: another event. Level 2: diagnose and explain. Level 3: evaluate with a user. Levels 2 and 3 can use A4 paper.</p>${V.button('return-pitstop','Continue to Learning Pitstop','',true)}`);
  }
  function glossary() {
    const col={zh:2,ko:3,bm:4}[state.language];
    openDialog('Useful words',`<dl class="glossary">${L.GLOSSARY.map(row=>`<dt>${V.e(row[0])}${col?' · '+V.e(row[col]):''}</dt><dd>${V.e(row[1])}</dd>`).join('')}</dl><p class="small">Code and editor labels stay in their original language. You may explain your thinking using your support language.</p>`);
  }
  function help() {
    openDialog('Find your next small step',`<p>You do not need to guess where to work.</p><ul><li><strong>Building code?</strong> ${V.link(state.responses.editor==='micropython'?L.LINKS.micropython:L.LINKS.makecode,'Open the selected editor')}. Return to this lesson tab for answers.</li><li><strong>Different Python commands?</strong> Your route is ${V.e(L.label('editor',state.responses.editor)||'not chosen')}. Use only that route’s example.</li><li><strong>Connection problem?</strong> Keep your simulator evidence. Raise your hand and show the exact step you reached.</li><li><strong>Unsure what to write?</strong> Use the sentence frame above the box. A short, honest answer is enough.</li></ul><div class="buttons">${V.button('go','Revisit device & editor choice','data-card="setup"')}${V.button('glossary','Vocabulary help')}${V.button('help-record','Record that I need help')}</div><p class="small">This app cannot alert your teacher remotely. Please raise your hand or speak to them.</p>`);
  }
  async function compress(file) {
    if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Choose a PNG, JPEG or WebP image. On iPad, use a screenshot or export the photo as JPEG.');
    if(file.size>12*1024*1024)throw new Error('This image is over 12 MB. Use a smaller screenshot or photo.');
    const url=URL.createObjectURL(file);
    try {
      const img=await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('This image could not be opened.'));im.src=url;});
      const scale=Math.min(1,1600/Math.max(img.width,img.height)), canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
      const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      return canvas.toDataURL('image/jpeg',.88);
    } finally {URL.revokeObjectURL(url);}
  }
  function upload(slot,file) {
    if(!file)return;
    const session=state.sessionId;
    const status=$('upload-status-'+slot);if(status)status.textContent='Compressing and saving image…';
    pending=pending.then(async()=>{
      try {
        const data=await compress(file);
        if(state.sessionId!==session)return;
        images[slot]={data,caption:images[slot]?.caption || '',at:now()};
        state.evidence[slot]={caption:images[slot].caption,at:images[slot].at};
        state.evidenceUnavailable=Object.keys(state.evidence).some(k=>!images[k]);
        log('Evidence image added',{slot,filename:file.name || 'Pasted screenshot'});
        if(state.cards.evidence)state.cards.evidence.status='started';
        try { await writeImages(session,images); imageHealthy=true; }
        catch {imageHealthy=false;toast('Image kept for this session only. Download a backup now to protect it.');}
        save(true);if(state.current==='evidence')render(false);
      } catch(err){const el=$('upload-status-'+slot);if(el)el.textContent=err.message;toast(err.message);}
    });
  }
  async function paste(slot) {
    try {
      if(!navigator.clipboard?.read)throw new Error('Use the paste area below or Choose file.');
      const items=await navigator.clipboard.read();
      for(const item of items){const type=item.types.find(t=>['image/png','image/jpeg','image/webp'].includes(t));if(type){upload(slot,await item.getType(type));return;}}
      throw new Error('No image found on the clipboard. Copy a screenshot first.');
    } catch(err){toast('Direct clipboard access is unavailable. Focus the paste area and use Ctrl+V / ⌘V, or choose an image file.');document.querySelector(`[data-paste="${slot}"]`)?.focus();}
  }
  function download(blob,filename) {
    const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  async function backup() {
    await evidenceLoading.catch(()=>{});await pending;save(true);
    download(new Blob([JSON.stringify({lessonId:L.ID,version:L.VERSION,exported:now(),state,images})],{type:'application/json'}),L.filename(state,'Project_Backup','json'));
    toast(state.evidenceUnavailable?'Backup requested, but some earlier images could not be loaded. Keep your earlier backup too.':'Backup requested. Check that the JSON file saved; it contains your responses and images.');
  }
  async function importBackup(file) {
    if(!file)return;
    try {
      if(file.size>24*1024*1024)throw new Error('This backup is too large (maximum 24 MB).');
      const restored=L.validateBackup(JSON.parse(await file.text()));
      if(!confirm(`Restore work for ${restored.state.student.name}, ${restored.state.student.className}? This replaces that student’s current version 3 progress in this browser. Cancel and download a backup first if needed.`))return;
      await evidenceLoading.catch(()=>{});await pending;
      const isTeacher=state?teacher:new URLSearchParams(location.search).get('teacher')==='1';
      const s=restored.state,key=profileKey(s.student.name,s.student.className,isTeacher);
      if(Object.keys(restored.images).length)await writeImages(s.sessionId,restored.images);
      // Do not touch an existing profile until the replacement images have saved successfully.
      try {localStorage.setItem(key,JSON.stringify(s));}catch{throw new Error('There is not enough browser storage to restore this backup. Existing work has not been replaced.');}
      await activate(s,key,isTeacher);toast('Backup restored, including the images it contained.');
    } catch(err){alert('Backup not restored: '+err.message);}
    finally{$('backupFile').value='';}
  }
  async function pdf() {
    await evidenceLoading.catch(()=>{});await pending;
    if(state.current==='review'){state.cards.review={status:'done',at:now()};log('Report prepared',{note:'Browser print requested; PDF saving is not automatically confirmed.'});}
    save(true);
    if($('dialog').open)$('dialog').close();
    $('printReport').innerHTML=V.report(state,images);
    const originalTitle=document.title;
    document.title=L.filename(state,'Project','pdf').replace(/\.pdf$/,'');
    // The print UI may choose a different filename, particularly on iPad. Never claim a download was confirmed.
    await Promise.all(Array.from($('printReport').querySelectorAll('img')).map(im=>im.decode?.().catch(()=>{}) || Promise.resolve()));
    const after=()=>{document.title=originalTitle;window.removeEventListener('afterprint',after);};
    window.addEventListener('afterprint',after);
    try {window.print();}catch{toast('The print window was blocked. Use your browser’s Print command.');}
    openDialog('Save the PDF, then submit',`${V.teams()}<p>Suggested filename: <strong>${V.e(L.filename(state))}</strong></p><p>The browser cannot confirm that you saved the PDF. If you cancelled, choose Export again. On iPad, use the print preview’s Share / Save to Files options.</p>`);
  }
  async function reset() {
    if(!confirm(`Delete version 3 progress and evidence for ${state.student.name}, ${state.student.className}, on this browser? Download a backup first if you want to restore it. Other students and the previous app’s storage will not be deleted.`))return;
    await evidenceLoading.catch(()=>{});await pending;
    try {await writeImages(state.sessionId,{});}catch{toast('Evidence storage could not be cleared. Browser settings may be needed to remove it.');}
    try {localStorage.removeItem(profile);const last=safeRead(PREFIX+'lastStudent');if(last?.profile===profile)localStorage.removeItem(PREFIX+'lastStudent');}catch{}
    state=null;images={};clearTimeout(saveTimer);if($('dialog').open)$('dialog').close();$('entry').hidden=false;$('app').hidden=true;$('resumeButton').hidden=true;$('entryForm').reset();$('fullName').focus();
  }
  function changed(target, final=false) {
    const key=target.dataset.field;
    if(key && L.FIELDS[key]) {
      const value=target.value;
      if(L.VALUES[key] && !Object.hasOwn(L.VALUES[key],value))return;
      const prior=state.responses[key];
      state.responses[key]=value;
      if(prior!==value){delete state.checks[key];const card=L.FIELDS[key][0];if(state.cards[card])state.cards[card].status='started';const feedback=$('feedback-'+key);if(feedback)feedback.innerHTML='';}
      if(final && originals[key]!==value){log('Response changed',{field:L.FIELDS[key][1],before:originals[key] || '(empty)',after:L.label(key,value)});originals[key]=value;}
      if(key==='device' && value==='ipad' && state.responses.editor==='micropython'){
        log('Route changed',{previousEditor:'MicroPython',reason:'iPad route selected'});state.responses.editor='';toast('Choose a MakeCode route for this iPad lesson. Your earlier work stays in the report.');
      }
      if(['device','editor'].includes(key) && prior!==value){
        for(const id of ['try','button','test','transfer'])if(state.cards[id])state.cards[id].status='review';
      }
      if(['device','editor','icon','message'].includes(key) && prior!==value){
        const sensitive=['startTest','pressTest','physical'];
        if(['device','editor'].includes(key))sensitive.push('firstRun','buttonBuild');
        const oldResults={};for(const k of sensitive)if(state.responses[k])oldResults[k]=state.responses[k];
        if(Object.keys(oldResults).length){
          log('Earlier test results preserved — retest after change',{changedField:L.FIELDS[key][1],previousResults:oldResults});
          for(const k of sensitive)delete state.responses[k];
          for(const id of ['test','transfer'])if(state.cards[id])state.cards[id].status='review';
          toast('Your choices changed. Previous results are kept in the report; please run the two tests again.');
        }
      }
      save();
      if(final && ['device','editor','startTest','pressTest'].includes(key))render(false);
      if(final && (key==='icon'||key==='message'))render(false);
    }
    const slot=target.dataset.caption;
    if(slot && images[slot]){
      images[slot].caption=target.value;state.evidence[slot].caption=target.value;save();
      if(final){log('Image caption changed',{slot,caption:target.value});pending=pending.then(()=>writeImages(state.sessionId,images)).catch(()=>{imageHealthy=false;save(true);});}
    }
  }
  async function action(el) {
    const a=el.dataset.action;
    if(a==='close'){closeDialog();return;}
    if(a==='import'){$('backupFile').click();return;}
    if(!state)return;
    switch(a){
      case 'menu':menu();break;
      case 'go':go(el.dataset.card);break;
      case 'check':check(el.dataset.key);break;
      case 'continue-review':continueCard(true);break;
      case 'ksu':openDialog('Our learning today',`<dl class="glossary">${Object.entries(L.OBJECTIVES).map(([k,v])=>`<dt>${V.e(k)}</dt><dd>${V.e(v)}</dd>`).join('')}</dl>`);break;
      case 'language':openDialog('Language support',`<p>English stays visible. Choose a language for task instructions and vocabulary on every card.</p><label for="languageChoice">Support language</label><select id="languageChoice"><option value="en">English</option><option value="zh">English + 中文（简体）</option><option value="ko">English + 한국어</option><option value="bm">English + Bahasa Melayu</option></select><p class="small">Technical code remains unchanged. These are learning supports, not automatic translations of your answers.</p>${V.button('glossary','Open vocabulary')}`);$('languageChoice').value=state.language;break;
      case 'glossary':glossary();break;
      case 'help':help();break;
      case 'help-record':log('Support requested',{step:state.current});save();toast('Help request recorded for your report. Raise your hand and show your teacher this step.');closeDialog();break;
      case 'extensions':extensions();break;
      case 'return-pitstop':state.reached=Math.max(state.reached,9);go('pitstop',true);break;
      case 'copy-code':{
        const area=$('exampleCode');if(!area)break;
        try {await navigator.clipboard.writeText(area.value);toast('Copied. Paste into the matching Python editor’s code area.');}
        catch{area.focus();area.select();toast('Code selected. Use Copy, then paste into the matching Python editor.');}break;
      }
      case 'image':openDialog('Picture support',`<img src="assets/images/${V.e(el.dataset.image)}" alt="${V.e(el.dataset.alt)}" style="width:100%;height:auto"><p>${V.e(el.dataset.alt)}</p>`);break;
      case 'paste':await paste(el.dataset.slot);break;
      case 'remove-image':{
        const slot=el.dataset.slot;if(!confirm('Delete this evidence image? You can add another or restore it from a saved backup.'))break;
        await pending;delete images[slot];delete state.evidence[slot];if(state.cards.evidence)state.cards.evidence.status='started';log('Evidence image deleted',{slot});
        try{await writeImages(state.sessionId,images);imageHealthy=true;}catch{imageHealthy=false;toast('Could not remove the stored copy. Your report no longer includes it; browser storage may need clearing.');}save(true);render(false);break;
      }
      case 'backup':await backup();break;
      case 'pdf':await pdf();break;
      case 'reset':await reset();break;
    }
  }
  function init(){
    $('entryForm').addEventListener('submit',enter);
    $('nextButton').addEventListener('click',()=>continueCard());
    $('backButton').addEventListener('click',()=>{const idx=L.CORE.findIndex(c=>c.id===state.current);go(idx<0?'evidence':L.CORE[Math.max(0,idx-1)].id);});
    document.addEventListener('click',ev=>{const el=ev.target.closest('[data-action]');if(el){ev.preventDefault();action(el).catch(err=>toast('That action did not finish: '+err.message));}});
    document.addEventListener('input',ev=>{if(state)changed(ev.target,false);});
    document.addEventListener('change',ev=>{
      if(ev.target.id==='backupFile'){importBackup(ev.target.files[0]);return;}
      if(!state)return;
      if(ev.target.id==='languageChoice'){state.language=ev.target.value;log('Language support changed',{language:state.language});save();render(false);return;}
      if(ev.target.dataset.upload){upload(ev.target.dataset.upload,ev.target.files[0]);return;}
      changed(ev.target,true);
    });
    document.addEventListener('paste',ev=>{const zone=ev.target.closest('[data-paste]');if(!zone || !state)return;const item=Array.from(ev.clipboardData?.items || []).find(x=>x.type.startsWith('image/'));if(item){ev.preventDefault();upload(zone.dataset.paste,item.getAsFile());}});
    document.addEventListener('error',ev=>{if(ev.target.tagName==='IMG'){const img=ev.target;img.hidden=true;const fallback=document.createElement('p');fallback.className='small';fallback.textContent='Picture unavailable. Follow the written instructions on this card.';img.insertAdjacentElement('afterend',fallback);}},true);
    window.addEventListener('pagehide',()=>save(true));
    window.addEventListener('beforeprint',()=>{if(state)$('printReport').innerHTML=V.report(state,images);});
    $('dialog').addEventListener('click',ev=>{if(ev.target===$('dialog'))closeDialog();});
    const last=safeRead(PREFIX+'lastStudent');
    if(last && normalizeSaved(safeRead(last.profile))){$('resumeButton').hidden=false;$('resumeButton').textContent=`Resume ${last.name} · ${last.className}`;$('resumeButton').addEventListener('click',()=>activate(normalizeSaved(safeRead(last.profile)),last.profile,false));}
    if(new URLSearchParams(location.search).get('teacher')==='1'){$('fullName').value='teacher';$('className').value='8T';}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
