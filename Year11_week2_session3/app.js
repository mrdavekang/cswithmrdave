(() => {
  'use strict';
  const {lessons, escape} = window.lessonConfig;
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const core = ['starter','learning','main1','main2','pitstop','plenary'];
  const labels = Object.fromEntries(lessons.map(x=>[x.id,x.label]));
  const blank = () => ({schemaVersion:2,profile:{name:'',className:'',role:'student'},answers:{},uploads:{},completed:{},attempts:{q05:[],q06:[]},boundaryHistory:[],activePage:'overview',updatedAt:''});
  let state = blank(), storageKey = '', timer, toastTimer;
  let notebook = [];
  const teacherKey = 'year11-nov24-w2s3:teacher-notebook-v2';
  const safe = text => String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'student';
  const timestamp = () => new Date().toISOString();
  const readableDate = date => new Date(date).toLocaleString();
  const toast = text => { $('#toast').textContent=text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000); };
  function saveNow() {
    clearTimeout(timer);
    if(!storageKey || state.profile.role==='teacher')return true;
    state.updatedAt=timestamp();
    try {localStorage.setItem(storageKey,JSON.stringify(state));$('#save-status').textContent='Saved on this device';return true;}
    catch {$('#save-status').textContent='Not saved — export now';toast('Browser storage is unavailable or full. Your current work is still here: export it before closing.');return false;}
  }
  function scheduleSave(){ if(state.profile.role==='teacher')return;$('#save-status').textContent='Saving…';clearTimeout(timer);timer=setTimeout(saveNow,350); }
  function start(profile){
    storageKey=`year11-nov24-w2s3:${safe(profile.name)}:${safe(profile.className)}`;
    let stored={};
    if(profile.role!=='teacher')try {stored=JSON.parse(localStorage.getItem(storageKey))||{};}catch{}
    if(stored.schemaVersion!==2 && stored.answers){
      // The old exit ticket asked a different question. Retain it separately.
      for(const key of ['exit_reason','exit_statement']){
        if(key in stored.answers){stored.answers['previous_'+key]=stored.answers[key];delete stored.answers[key];}
      }
      if(stored.completed)delete stored.completed.plenary;
    }
    state={...blank(),...stored,profile,answers:stored.answers||{},uploads:stored.uploads||{},completed:stored.completed||{},attempts:{q05:stored.attempts?.q05||[],q06:stored.attempts?.q06||[]},boundaryHistory:stored.boundaryHistory||[]};
    state.schemaVersion=2;
    $('#landing').hidden=true;$('#lesson-app').hidden=false;
    document.body.classList.toggle('teacher-mode',profile.role==='teacher');
    $('#profile-name').textContent=profile.name;$('#profile-class').textContent=profile.role==='teacher'?'Teacher review · local notebook':profile.className;
    $$('.teacher-only,.teacher-note').forEach(x=>x.hidden=profile.role!=='teacher');
    $$('[data-save]').forEach(f=>{if(f.type==='checkbox')f.checked=state.answers[f.dataset.save]===f.value;else f.value=state.answers[f.dataset.save]??'';});
    hydrateUploads();updateEditors();renderAttempts();renderBoundary();updateProgress();
    if(profile.role==='teacher'){renderNotebook();$('#save-status').textContent='Teacher review';}
    showPage(state.activePage in labels ? state.activePage:'overview');
  }
  function showPage(id){
    if(id==='teacher'&&state.profile.role!=='teacher')return;
    if(!labels[id]&&id!=='teacher')return;
    document.body.classList.remove('review-focus');$$('.feedback-panel').forEach(x=>x.classList.remove('is-focused'));
    $$('[data-focus-review]').forEach(b=>{b.textContent='Focus view';b.setAttribute('aria-pressed','false');});
    $$('.lesson-page').forEach(p=>p.hidden=p.dataset.page!==id);
    $$('[data-nav]').forEach(b=>{b.classList.toggle('active',b.dataset.nav===id);if(b.dataset.nav===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    state.activePage=id;saveNow();$('#sidebar').classList.remove('open');$('#mobile-menu').setAttribute('aria-expanded','false');
    const heading=$(`[data-page="${id}"] h2`);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
    window.scrollTo({top:0,behavior:'instant'});
  }
  function updateProgress(){
    const count=core.filter(k=>state.completed[k]).length,value=Math.round(count/core.length*100);
    $('#progress-percent').textContent=value+'%';$('#progress-bar').value=value;
    $('#completion-list').innerHTML=core.map(id=>`<div><strong>${labels[id]}</strong><span>${state.completed[id]?'Recorded':'Not yet recorded'}</span></div>`).join('');
    $$('[data-record]').forEach(b=>{const done=!!state.completed[b.dataset.record];b.textContent=done?'Activity recorded ✓':'Record this activity';b.setAttribute('aria-pressed',String(done));});
  }
  function excerpt(code,key){
    if(!code.trim())return 'Paste your current draft into the source area above to show its relevant lines here.';
    const lines=code.split(/\r?\n/);let start=0,end=lines.length;
    if(key==='q05_code'){
      const load=lines.findIndex(l=>l.includes('loadImage('));
      if(load>=0){start=Math.max(0,load-2);end=Math.min(lines.length,load+8);}
    }else{
      const first=lines.findIndex(l=>l.includes('factor')&&l.includes('input('));
      const calculation=lines.findIndex((l,i)=>i>first&&l.includes('newWidth')&&l.includes('='));
      if(first>=0){start=Math.max(0,first-1);end=calculation>=0?calculation+1:Math.min(lines.length,first+14);}
    }
    return lines.slice(start,end).map((line,i)=>String(i+start+1).padStart(3)+'  '+line).join('\n');
  }
  function updateEditors(){
    $$('.editor textarea').forEach(t=>{const gutter=$('.line-numbers',t.parentElement);gutter.textContent=t.value.split('\n').map((_,i)=>i+1).join('\n');gutter.scrollTop=t.scrollTop;});
    $$('[data-excerpt]').forEach(el=>el.textContent=excerpt(state.answers[el.dataset.excerpt]||'',el.dataset.excerpt));
  }
  function relevantAnswers(q){return Object.fromEntries(Object.entries(state.answers).filter(([k])=>k.startsWith(q)||k.startsWith(q==='q05'?'q5_':'q6_')));}
  function snapshot(q,kind){
    const code=state.answers[q+'_code']||'';
    if(kind==='attempt'&&!code.trim()&&!String(state.answers[q+'_question']||'').trim()){toast('Paste a draft or record your question first. An unfinished attempt is welcome.');return;}
    if(kind==='retest'&&!String(state.answers[q+'_retest']||'').trim()){toast('Record the sequence you reran and what happened before saving the retest.');return;}
    state.attempts[q].push({kind,at:timestamp(),code,answers:relevantAnswers(q)});
    renderAttempts();saveNow();toast(kind==='attempt'?'Attempt preserved. Discuss it, then edit and retest.':'Correction and retest preserved with the current code.');
  }
  function renderAttempts(){
    for(const q of ['q05','q06']){
      $('[data-attempt-count="'+q+'"]').textContent=String(state.attempts[q].length);
      $('[data-attempts="'+q+'"]').innerHTML=state.attempts[q].map((a,i)=>`<details><summary>${i+1}. ${a.kind==='retest'?'Correction & retest':'Attempt for feedback'} · ${escape(readableDate(a.at))}</summary><p>${escape(a.answers[q+'_question']||a.answers[q+'_advice']||'Recorded draft')}</p><pre>${escape(a.code||'No code yet')}</pre>${a.kind==='retest'?`<p><strong>Change:</strong> ${escape(a.answers[q+'_change']||'Not recorded')}</p><p><strong>Retest:</strong> ${escape(a.answers[q+'_retest']||'Not recorded')}</p>`:''}</details>`).join('')||'<p>No saved attempts yet. Save one before editing so you can show what changed.</p>';
    }
  }
  function checkBoundary(){
    const choices=[5,6,7].map(n=>state.answers['q6_boundary_'+n]);
    if(choices.some(x=>!x)){toast('Predict Accept or Reject for each value first.');return;}
    const correct=choices.map((v,i)=>v===(i===0?'Accept':'Reject'));
    state.boundaryHistory.push({at:timestamp(),choices,condition:state.answers.q6_condition||'',correct});
    renderBoundary();saveNow();
  }
  function renderBoundary(){
    const latest=state.boundaryHistory.at(-1);
    $('#boundary-feedback').textContent=latest?(latest.correct.every(Boolean)?'All three predictions match the rule: accept 5; reject 6 and 7. Now explain why your condition will repeat for invalid input.':'Revisit the boundary: “less than 6” accepts 5 but rejects 6 and 7. Trace your comparison with 6, then revise and check again.')+` Checks recorded: ${state.boundaryHistory.length}. Your first predictions are preserved.`:'';
  }
  async function readImage(file){
    if(!file?.type.startsWith('image/'))throw new Error('Choose an image file.');
    if(file.size>25*1024*1024)throw new Error('Choose a screenshot smaller than 25 MB.');
    const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=data;});
    const scale=Math.min(1,2400/img.width,2400/img.height),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);
    return c.toDataURL('image/jpeg',0.9);
  }
  async function upload(key,file){try{const data=await readImage(file);state.uploads[key]=data;hydrateUploads();const saved=saveNow();if(saved)toast('Evidence added. Check that the text is readable.');}catch(e){toast(e.message||'Image could not be read. Try a PNG or JPEG screenshot.');}}
  function hydrateUploads(){
    $$('[data-upload-slot]').forEach(slot=>{const data=state.uploads[slot.dataset.uploadSlot];const img=$('img',slot);img.hidden=!data;if(data)img.src=data;else img.removeAttribute('src');$('.remove-upload',slot).hidden=!data;$('input',slot).value='';});
  }
  function setupUploads(){
    $$('[data-upload-slot]').forEach(slot=>{const key=slot.dataset.uploadSlot;
      $('input',slot).addEventListener('change',e=>{if(e.target.files[0])upload(key,e.target.files[0]);});
      slot.addEventListener('dragover',e=>{e.preventDefault();slot.classList.add('dragover');});slot.addEventListener('dragleave',()=>slot.classList.remove('dragover'));
      slot.addEventListener('drop',e=>{e.preventDefault();slot.classList.remove('dragover');if(e.dataTransfer.files[0])upload(key,e.dataTransfer.files[0]);});
      slot.addEventListener('paste',e=>{const item=[...(e.clipboardData?.items||[])].find(x=>x.type.startsWith('image/'));if(item){e.preventDefault();upload(key,item.getAsFile());}});
      $('.remove-upload',slot).addEventListener('click',()=>{delete state.uploads[key];hydrateUploads();saveNow();});
      $('img',slot).addEventListener('click',()=>openImage(state.uploads[key]));
    });
  }
  const columnOptions={boundary:['Not checked','Independent','Prompted','Revisit'],reinput:['Not checked','Independent','Prompted','Revisit'],test:['Not checked','Pass observed','Investigate'],followup:['Pending','Rechecked','Next lesson']};
  function renderNotebook(){
    try{notebook=JSON.parse(localStorage.getItem(teacherKey))||[];}catch{notebook=[];}
    if(!Array.isArray(notebook))notebook=[];
    while(notebook.length<7)notebook.push({name:'',boundary:'Not checked',reinput:'Not checked',test:'Not checked',note:'',followup:'Pending'});
    let page=$('[data-page="teacher"]');if(!page){page=document.createElement('article');page.className='lesson-page';page.dataset.page='teacher';$('#pages').append(page);}
    page.innerHTML=`<div class="page-heading"><span class="section-number">T</span><div><p class="eyebrow">Teacher notebook</p><h2>Notice. Respond. Recheck.</h2></div></div><div class="notice">This is your manual checklist on this device. Open a learner's feedback panel on their computer to review their draft. No live student responses are sent here.</div><section class="card"><h3>Focus of the 2:30–3:00 observation</h3><p>Use the boundary responses to choose who to visit. Ask about one condition or changing value, give an actionable prompt, and revisit to check the retest. If several learners share a misconception, pause for a brief model and check everyone again.</p><p>Examples: “Does your condition reject 6?” · “Where does factor change?” · “What happens for 6, 7, 3?” · “What did the retest prove?”</p></section><div class="table-scroll notebook"><table><thead><tr><th>Student</th><th>Boundary</th><th>Re-input explained</th><th>Test</th><th>Feedback / next action</th><th>Follow-up</th></tr></thead><tbody>${notebook.map((r,i)=>`<tr><td><input aria-label="Student ${i+1}" data-note-row="${i}" data-note-key="name" value="${escape(r.name||'')}" placeholder="Student ${i+1}" /></td>${['boundary','reinput','test'].map(k=>notebookSelect(i,k,r[k])).join('')}<td><textarea aria-label="Feedback for student ${i+1}" rows="3" data-note-row="${i}" data-note-key="note">${escape(r.note||'')}</textarea></td>${notebookSelect(i,'followup',r.followup)}</tr>`).join('')}</tbody></table></div><p id="notebook-status" role="status">Saved on this device as you type.</p><button class="button" id="export-notebook">Download teacher checklist PDF</button><p class="small">Keep this teacher record private; it is not part of any student's export.</p>`;
  }
  function notebookSelect(i,k,value){return `<td><select aria-label="${k} for student ${i+1}" data-note-row="${i}" data-note-key="${k}">${columnOptions[k].map(v=>`<option ${v===value?'selected':''}>${v}</option>`).join('')}</select></td>`;}
  function saveNotebook(field){const row=Number(field.dataset.noteRow);notebook[row][field.dataset.noteKey]=field.value;try{localStorage.setItem(teacherKey,JSON.stringify(notebook));$('#notebook-status').textContent='Saved on this device.';}catch{$('#notebook-status').textContent='Not saved. Export the checklist before closing.';}}

  function makePdf(title){
    if(!window.jspdf?.jsPDF)throw new Error('PDF support is unavailable. Refresh without closing this tab first.');
    const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true});let y=24;
    const bottom=278,margin=16,width=178;
    const clean=s=>String(s??'').replace(/[→]/g,' -> ').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/…/g,'...').replace(/✓/g,'[recorded]').replace(/·/g,'|');
    function header(){doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('YEAR 11 | WEEK 2 SESSION 3 | NOVEMBER 2024 PAPER 1',margin,11);doc.line(margin,15,194,15);y=24;}
    function newPage(){doc.addPage();header();}
    function ensure(height){if(y+height>bottom)newPage();}
    function write(text,{size=10,font='helvetica',style='normal',gap=3}={}){
      doc.setFont(font,style);doc.setFontSize(size);
      const raw=clean(text).replace(/\t/g,'    ');
      for(const line of raw.split(/\r?\n/)){
        // Wrap by measured characters, preserving Python's leading whitespace.
        const pieces=font==='courier'?[]:doc.splitTextToSize(line||' ',width);let rest=font==='courier'?(line||' '):'';
        while(rest.length){let n=rest.length;while(n>1&&doc.getTextWidth(rest.slice(0,n))>width)n--;pieces.push(rest.slice(0,n));rest=rest.slice(n);}
        for(const piece of pieces){ensure(size*.46+1);doc.setFont(font,style);doc.setFontSize(size);doc.text(piece,margin,y);y+=size*.46;}
      }y+=gap;
    }
    function heading(text){ensure(17);write(text,{size:15,style:'bold',gap:5});}
    function response(label,value){ensure(14);write(label,{size:8,style:'bold',gap:1.5});write(value||'Not recorded');}
    function source(label,value){heading(label);write(value||'No source submitted',{font:'courier',size:8,gap:5});}
    function picture(label,data){if(!data)return;newPage();heading(label);const p=doc.getImageProperties(data),scale=Math.min(width/p.width,220/p.height);doc.addImage(data,'JPEG',margin,y,p.width*scale,p.height*scale);y+=p.height*scale+5;}
    function finish(){for(let i=1;i<=doc.getNumberOfPages();i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(`${i} / ${doc.getNumberOfPages()}`,194,288,{align:'right'});}doc.setProperties({title,subject:'Programming learning evidence',creator:'Year 11 programming lab'});return doc;}
    header();heading(title);return {doc,newPage,heading,response,source,picture,write,finish};
  }
  function fieldLabel(f){const label=f.closest('label');return label?.querySelector('span')?.textContent.trim()||f.getAttribute('aria-label')||f.dataset.save;}
  async function exportPdf(){
    saveNow();const button=$('#export-pdf');button.disabled=true;button.textContent='Preparing PDF…';
    try{
      const pdf=makePdf('Programming learning record');
      pdf.response('Student',state.profile.name);pdf.response('Class',state.profile.className);pdf.response('Generated',new Date().toLocaleString());pdf.response('WAGBA','Translate requirements into correctly placed code, and use tests to explain and improve a solution.');
      pdf.write('Activity recording is a completion indicator, not a mark or mastery score. Code runs in the learner’s IDE; test results here are learner reports unless checked by the teacher.');
      for(const id of core)pdf.response(labels[id],state.completed[id]?'Recorded':'Not yet recorded');
      const used=new Set();
      for(const id of ['starter','learning','main1','main2','pitstop','extension','plenary']){
        const page=$(`[data-page="${id}"]`),fields=$$('[data-save]',page);
        if(id==='extension'&&!fields.some(f=>state.answers[f.dataset.save])&&!state.uploads.q07_image1&&!state.uploads.q07_image2)continue;
        pdf.newPage();pdf.heading(labels[id]);
        for(const f of fields){const key=f.dataset.save;used.add(key);if(key.endsWith('_code')||key==='exit_statement')pdf.source(fieldLabel(f),state.answers[key]);else pdf.response(fieldLabel(f),state.answers[key]);}
        if(id==='main2'&&state.boundaryHistory.length){pdf.heading('Boundary prediction history');state.boundaryHistory.forEach((h,i)=>{pdf.response(`Check ${i+1} | ${readableDate(h.at)}`,`5: ${h.choices[0]}; 6: ${h.choices[1]}; 7: ${h.choices[2]}.`);pdf.response('Condition and explanation at this check',h.condition);});}
        const q={main1:'q05',main2:'q06',extension:'q07'}[id];
        if(q&&state.attempts[q]?.length){
          for(const [i,a] of state.attempts[q].entries()){
            pdf.newPage();pdf.heading(`${q.toUpperCase()} saved ${a.kind} ${i+1}`);pdf.response('Saved at',readableDate(a.at));pdf.source('Code at this point',a.code);
            for(const [k,v] of Object.entries(a.answers)){if(k.endsWith('_code'))continue;const f=$(`[data-save="${k}"]`);pdf.response(f?fieldLabel(f):k,v);}
          }
        }
        if(q)for(const n of [1,2])pdf.picture(`${q.toUpperCase()} evidence ${n}`,state.uploads[q+'_image'+n]);
      }
      // Preserve fields from the previous lesson version when old records resume.
      const legacy=Object.entries(state.answers).filter(([k,v])=>!used.has(k)&&String(v??'').trim());
      if(legacy.length){pdf.newPage();pdf.heading('Earlier saved responses');legacy.forEach(([k,v])=>pdf.response(k,v));}
      pdf.finish().save(`${safe(state.profile.name)}_${safe(state.profile.className)}_Nov2024_Paper1_W2S3.pdf`);
      toast('PDF downloaded. Check it, then submit to Teams.');
    }catch(e){toast(e.message||'Could not export. Your work is still in this tab.');}
    finally{button.disabled=false;button.textContent='Download learning record PDF';}
  }
  function exportNotebook(){try{const p=makePdf('Teacher feedback checklist');p.response('Generated',new Date().toLocaleString());p.write('Manual observations from this device. Independent / prompted / revisit describe the evidence observed, not a grade.');notebook.forEach((r,i)=>{p.heading(r.name||'Student '+(i+1));for(const [k,v] of Object.entries(r))if(k!=='name')p.response(k,v);});p.finish().save('Teacher_W2S3_Feedback_Checklist.pdf');}catch(e){toast(e.message);}}
  function openImage(src){$('#modal-image').src=src;$('#image-modal').showModal();}
  $('#entry-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#student-name').value.trim(),className=$('#student-class').value.trim();const isTeacher=name.toLowerCase()==='teacher'||className.toLowerCase()==='teacher';if(!isTeacher&&(!name||!className)){toast('Enter both your name and class.');return;}start({name:isTeacher?'Teacher':name,className:isTeacher?'Teacher review':className,role:isTeacher?'teacher':'student'});});
  function captureField(e){const f=e.target.closest('[data-save]');if(f){state.answers[f.dataset.save]=f.type==='checkbox'?(f.checked?f.value:''):f.value;updateEditors();scheduleSave();}if(e.target.matches('[data-note-row]')&&state.profile.role==='teacher')saveNotebook(e.target);}
  document.addEventListener('input',captureField);document.addEventListener('change',captureField);
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.nav)showPage(b.dataset.nav);if(b.dataset.next)showPage(b.dataset.next);
    if(b.dataset.record){state.completed[b.dataset.record]=!state.completed[b.dataset.record];updateProgress();saveNow();}
    if(b.dataset.snapshot)snapshot(b.dataset.snapshot,'attempt');if(b.dataset.retest)snapshot(b.dataset.retest,'retest');
    if(b.dataset.focusReview){const panel=$(`[data-feedback="${b.dataset.focusReview}"]`),on=!panel.classList.contains('is-focused');document.body.classList.toggle('review-focus',on);panel.classList.toggle('is-focused',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'Return to activity':'Focus view';panel.scrollIntoView({block:'start'});}
    if(b.dataset.zoom)openImage(b.dataset.zoom);if(b.id==='export-notebook')exportNotebook();
  });
  $('#check-boundary').addEventListener('click',checkBoundary);$('#export-pdf').addEventListener('click',exportPdf);
  $('#mobile-menu').addEventListener('click',()=>{$('#sidebar').classList.toggle('open');$('#mobile-menu').setAttribute('aria-expanded',String($('#sidebar').classList.contains('open')));});
  $('#return-home').addEventListener('click',()=>{if(!saveNow()&&!confirm('Your latest work is not saved. Return to sign-in anyway? Export first to keep a copy.'))return;window.location.reload();});
  $('#clear-work').addEventListener('click',()=>{if(state.profile.role==='teacher')return;if(!confirm('Clear this student’s saved answers, attempts and images on this device? Download the PDF first if you need a copy.'))return;clearTimeout(timer);try{localStorage.removeItem(storageKey);}catch{}storageKey='';window.location.reload();});
  $('#close-modal').addEventListener('click',()=>$('#image-modal').close());
  $$('.editor textarea').forEach(t=>t.addEventListener('scroll',()=>$('.line-numbers',t.parentElement).scrollTop=t.scrollTop));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow();});window.addEventListener('pagehide',saveNow);
  setupUploads();
})();
