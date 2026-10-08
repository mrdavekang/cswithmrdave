(() => {
  'use strict';
  const L=window.LESSON,root=document.getElementById('app'),plenaryIndex=L.cards.findIndex(c=>c.id==='plenary');
  const main1Stage=L.stages.indexOf('Main Task 1'),main2Stage=L.stages.indexOf('Main Task 2'),furtherStage=L.stages.indexOf('Go Further');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields=L.cards.flatMap(c=>c.fields),fieldMap=Object.fromEntries(fields.map(f=>[f.id,f]));
  const storageKey=mode=>'countdown-crew.'+mode+'.v1';
  const fresh=mode=>({lessonId:L.id,version:1,contentRevision:L.contentRevision,mode,student:{name:'',className:''},editor:'blocks',language:'en',card:0,reached:0,visited:{},answers:{},attempts:{},reactorRounds:[],reactorSound:false,savedAt:null,teamsSubmitted:false});
  let mode=new URLSearchParams(location.search).get('teacher')==='1'?'teacher':'student';
  let s=readState(mode),images={},started=false,db=null,persistent=true,demoTimer=null,toastTimer=null,reactor=null;
  function resumePosition(value){
    const order=value.contentRevision===L.contentRevision?L.cards.map(c=>c.id):value.contentRevision===2?L.previousCardIds:L.legacyCardIds;
    const position=(id,n)=>{const old=order[Math.max(0,Math.min(order.length-1,Number(n)||0))];const i=L.cards.findIndex(c=>c.id===(id||old));return Math.max(0,i);};
    const card=position(value.cardId,value.card),reached=Math.max(card,position(value.reachedId,value.reached));
    return {card,reached,contentRevision:L.contentRevision};
  }
  function readState(m){try{const raw=localStorage.getItem(storageKey(m));if(raw){const value=JSON.parse(raw);if(value.lessonId===L.id&&value.version===1)return {...fresh(m),...value,...resumePosition(value),reactorRounds:window.CrewReactor.safeRounds(value.reactorRounds),reactorSound:false,mode:m};}}catch(e){}return fresh(m);}
  function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),5000);}
  function askReplace(message){return new Promise(resolve=>{const dialog=document.getElementById('confirmation');document.getElementById('confirmation-message').textContent=message;dialog.returnValue='cancel';dialog.addEventListener('close',()=>resolve(dialog.returnValue==='replace'),{once:true});dialog.showModal();});}
  function save(){
    s.savedAt=new Date().toISOString();
    s.contentRevision=L.contentRevision;s.cardId=L.cards[s.card].id;s.reachedId=L.cards[s.reached].id;
    try{localStorage.setItem(storageKey(mode),JSON.stringify(s));setSave('Saved on this device');}
    catch(e){persistent=false;setSave('Not saved—download a backup');}
  }
  function setSave(message){const el=document.getElementById('save-status');if(el)el.textContent=message+(persistent?' · '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'');}
  async function openDb(){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(new Error('Image saving is not available.'));const req=indexedDB.open('countdown-crew-evidence-v1',1);req.onupgradeneeded=()=>req.result.createObjectStore('images');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
  async function imageOp(action,key,value){
    if(!db){if(action==='get')return images[key];return;}
    return new Promise((resolve,reject)=>{const tx=db.transaction('images',action==='get'?'readonly':'readwrite'),store=tx.objectStore('images');const req=action==='get'?store.get(mode+':'+key):action==='delete'?store.delete(mode+':'+key):store.put(value,mode+':'+key);let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Image save failed.'));});
  }
  async function loadImages(){images={};for(const key of ['code']){const value=await imageOp('get',key);if(value)images[key]=value;}}
  function value(f){return s.answers[f.id];}
  function fieldHTML(f){
    const v=value(f),id='field-'+f.id;
    if(f.type==='check')return `<label class="check-line"><input type="checkbox" data-field="${f.id}" id="${id}" ${v===true?'checked':''}>${esc(f.label)}</label>`;
    if(f.type==='choice')return `<section class="question" aria-labelledby="label-${f.id}"><h3 id="label-${f.id}">${esc(f.label)}</h3><fieldset aria-labelledby="label-${f.id}" class="options">${f.options.map((option,i)=>`<label class="choice"><input type="radio" data-field="${f.id}" name="${f.id}" value="${i}" ${String(v)===String(i)?'checked':''}>${esc(option)}</label>`).join('')}</fieldset><button type="button" data-check="${f.id}">Check answer ${f.label.match(/^\d/)?.[0]||''}</button><div id="feedback-${f.id}" aria-live="polite">${feedbackHTML(f)}</div></section>`;
    if(f.type==='select')return `<div class="field"><label for="${id}">${esc(f.label)}</label><select data-field="${f.id}" id="${id}"><option value="">Choose your response</option>${f.options.map(option=>`<option ${v===option?'selected':''}>${esc(option)}</option>`).join('')}</select></div>`;
    return `<div class="field"><label for="${id}">${esc(f.label)}</label><span class="muted">${esc(f.prompt)}</span>${f.type==='input'?`<input id="${id}" data-field="${f.id}" value="${esc(v||'')}" maxlength="160">`:`<textarea id="${id}" data-field="${f.id}" maxlength="2500">${esc(v||'')}</textarea>`}</div>`;
  }
  function feedbackHTML(f){const a=(s.attempts[f.id]||[]).at(-1);if(!a||String(a.value)!==String(value(f)))return '';return `<div class="feedback ${a.correct?'good':''}"><strong>${a.correct?'You’ve got it.':'Let’s revisit this.'}</strong> ${esc(f.explanation)}${a.correct?'':' You may try again or continue with this reminder.'}</div>`;}
  function guideHTML(key,enlarge=true){
    const g=L.guides[key];if(!g)return '';
    return `<figure class="guide">${enlarge?`<button type="button" data-guide="${key}">Enlarge this visual guide ⤢</button>`:''}<div style="height:16px"></div><div class="guide-frame"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="eager">${g.marks.map(m=>`<span class="guide-mark" style="left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%"><span class="guide-number">${m.n}</span></span>`).join('')}</div><figcaption>Real MakeCode capture · layout may move on smaller screens</figcaption><ul class="guide-notes">${g.notes.map(n=>'<li>'+esc(n)+'</li>').join('')}</ul></figure>`;
  }
  function demoHTML(){return `<div class="preview-scene"><span class="scene-label">LAUNCH BAY · LIVE PREVIEW</span><div class="scene-floor"></div><img class="scene-crew" src="assets/crew.svg" alt="Crew member waiting for the launch"><div class="count-display" id="demo-count" aria-live="polite">5</div><img class="scene-ship" id="demo-ship" src="assets/ship.svg" alt="Launch pod"></div><div class="demo-controls"><button type="button" data-action="demo">▶ Try the countdown</button><span id="demo-note">5 → 4 → 3 → 2 → 1 → GO!</span></div><p class="preview-caption">Visual mission preview, not an editor. Your real game is the MakeCode template.</p>`;}
  function supportHTML(i){
    const translated=L.languageHelp[s.language]?.[i];
    const index={en:0,zh:1,ko:2,ms:3}[s.language]||0;
    return `${translated?`<div class="support" lang="${s.language==='zh'?'zh-Hans':s.language}"><strong>${{zh:'Mandarin support · 中文提示',ko:'Korean support · 한국어 도움',ms:'Bahasa Melayu support'}[s.language]}</strong><p class="sentence">${esc(translated)}</p></div>`:''}<details class="help-box"><summary>Key words, in plain language</summary>${Object.entries(L.vocab).map(([word,definition])=>'<p><strong>'+word+'</strong>: '+esc(definition[0])+(index?'<br>'+esc(definition[index]):'')+'</p>').join('')}</details>`;
  }
  function evidenceHTML(){const image=images.code;return `<section class="evidence-area" tabindex="0" aria-label="Screenshot evidence. Upload a file or paste an image here."><h3>One screenshot is enough</h3><p class="muted">Show the countdown code clearly. On a laptop, copy a screenshot and paste it here. On a tablet, upload it from Photos or Files. Do not upload a project PNG in place of a code screenshot.</p><label for="evidence-file">Choose screenshot</label><input id="evidence-file" type="file" accept="image/png,image/jpeg,image/webp"><div class="evidence-actions"><button data-action="paste-image">Paste screenshot</button>${image?'<button data-action="delete-image" class="danger">Remove screenshot</button>':''}</div>${image?'<img src="'+image.data+'" alt="Your uploaded countdown code screenshot"><p class="muted">Image saved '+esc(new Date(image.at).toLocaleString())+'</p>':''}<div class="field"><label for="evidence-caption">Screenshot caption</label><input id="evidence-caption" data-field="evidence-caption" maxlength="250" value="${esc(s.answers['evidence-caption']||'')}" placeholder="For example: Start 7, pause 500, change -1"></div><label class="check-line"><input type="checkbox" data-field="teacher-evidence" ${s.answers['teacher-evidence']?'checked':''}>I cannot capture a screenshot; I will show my code and game to my teacher.</label><p class="muted">This records your request for a teacher check, not a verified teacher signature.</p></section>`;}
  function beforeGuidance(){const chosen=['before-k','before-s','before-u'].filter(id=>s.answers[id]&&s.answers[id]!=='Already confident');return chosen.length?'Your next practice: '+chosen.map(id=>({'before-k':'name what the counter stores','before-s':'follow one annotated edit','before-u':'trace the last repetition'}[id])).join('; ')+'.':'You can still learn from investigating the stopping value. If the main mission is easy, continue to Go Further.';}
  function pitGuidance(){
    const count=['pit-k','pit-s','pit-u'].filter(id=>s.answers[id]===true).length,feel=s.answers['pit-feeling']||'';
    let next='Choose how the learning felt. Your ticks are self-reports; explain or demonstrate them to your teacher.';
    if(feel.startsWith('New'))next='New learning: keep the worked example nearby. Try one edit, test it, and point to what changed.';
    if(feel.startsWith('Consolidating'))next='Consolidating: test a new starting value, then explain the last repetition without reading the example.';
    if(feel.startsWith('Treading'))next=count===3?'You report confidence in all three areas. Try a different counter step or the reactor mission.':'You feel ready for challenge, but some KSU still need practice. Revisit the unticked area, then try a mission.';
    if(feel.startsWith('Drowning'))next='Ask for a short teacher check now. Show the exact block or line you cannot find; return to the related guide and try one small action.';
    return '<strong>'+count+' / 3 KSU areas you report achieving</strong><br>'+esc(next);
  }
  function reviewHTML(){
    return `<div class="review-grid">${L.stages.map((name,i)=>{const cc=L.cards.filter(c=>c.stage===i&&!c.review);const done=cc.filter(c=>window.CrewReport.cardStatus(c,s,images).startsWith('Responses recorded')).length;const summary=cc[0]?.game||cc[0]?.externalQuiz?window.CrewReport.cardStatus(cc[0],s,images):done+' / '+cc.length+' cards with responses recorded';return '<div class="review-item"><strong>'+name+'</strong>'+summary+' <button class="small-link" data-goto="'+L.cards.findIndex(c=>c.stage===i)+'">Review</button></div>';}).join('')}</div><p class="muted">Recorded responses are not a grade. Your teacher will assess your code, test results and explanation. Empty answers remain “Not answered” in the report.</p><div class="inline-actions"><button class="primary" data-action="pdf">Download my PDF report ↓</button><button data-action="print">Print / save as PDF</button></div>${images.code?'<p class="pill">✓ Screenshot included</p>':'<p class="warning">No screenshot saved. A teacher-check request can be recorded in “Show your launch works”.</p>'}<details class="help-box"><summary>Read my recorded answers</summary>${L.cards.filter(c=>c.fields.length).map(c=>'<h3>'+esc(c.title)+'</h3>'+c.fields.map(f=>'<p><strong>'+esc(f.label)+'</strong><br>'+esc(window.CrewReport.answer(f,s.answers[f.id]))+'</p>').join('')).join('')}</details><div class="submission-banner"><strong>Upload your PDF to Teams</strong><p>Open your class’s Classwork assignment for this Arcade countdown project, attach the PDF, then select Turn in. Follow the assignment title your teacher has given you.</p><button data-action="submission">Show submission guide</button>${s.teamsSubmitted?'<p>✓ You reported submitting to Teams. This app cannot verify Teams submissions.</p>':''}</div>`;
  }
  function renderLanding(){
    const teacher=mode==='teacher';
    root.innerHTML=`<main class="landing" id="main"><div class="brand landing-brand"><img src="assets/crew.svg" alt=""><span>CS WITH MR DAVE <span class="muted">/ YEAR 8</span></span></div><div class="landing-panel"><section class="landing-left"><span class="pill">MakeCode Arcade · Project session · 60 minutes</span><h1>Small changes.<br>Big launch.</h1><p class="lead">Join the Countdown Crew. Open a ready-made game, engineer its countdown and send your pod safely into space.</p>${demoHTML()}<div class="journey-mini"><span>Read & predict</span><span>Run & explore</span><span>Modify & launch</span><span>Challenge & share</span></div><p class="entry-details"><strong>WAGBA</strong><br>${L.wagba}</p></section><section><p class="eyebrow">Your mission starts here</p><h2>Ready, flight engineer?</h2><p>No micro:bit needed. Use a laptop or tablet browser. Blocks is the recommended first-time route.</p><form id="entry" class="entry-fields" novalidate><label for="full-name">Your name<input id="full-name" autocomplete="name" maxlength="80" value="${esc(teacher?'Test Student':s.student.name)}" required></label><label for="class-name">Your class<input id="class-name" maxlength="32" value="${esc(teacher?'8T':s.student.className)}" placeholder="For example: 8T" required></label><div class="row"><label for="entry-editor">Coding route<select id="entry-editor"><option value="blocks" ${s.editor==='blocks'?'selected':''}>MakeCode Blocks</option><option value="python" ${s.editor==='python'?'selected':''}>Arcade Python</option></select></label><label for="entry-language">Language support<select id="entry-language">${languageOptions(s.language)}</select></label></div><p class="muted">Support appears beside the instructions, not in a hidden vocabulary menu. Code keywords stay in English.</p><div id="entry-error" class="entry-error" role="alert"></div><button class="primary" type="submit">${s.student.name?'Continue my mission':'Start my mission'} →</button><p class="entry-details">Progress stays in this browser. Download a lesson backup before changing device or using a shared computer.</p></form><button data-action="tools" class="secondary">Restore a lesson backup</button></section></div></main>`;
  }
  function languageOptions(current){return Object.entries({en:'English',zh:'中文 / Mandarin',ko:'한국어 / Korean',ms:'Bahasa Melayu'}).map(([key,name])=>'<option value="'+key+'" '+(current===key?'selected':'')+'>'+name+'</option>').join('');}
  function render(focus=false){
    clearInterval(demoTimer);demoTimer=null;
    if(reactor){reactor.destroy();reactor=null;}
    if(!started){renderLanding();return;}
    const card=L.cards[s.card];s.visited[card.id]=true;s.reached=Math.max(s.reached,s.card);save();
    const group=L.cards.filter(c=>c.stage===card.stage),local=group.indexOf(card)+1;
    const key=s.editor==='python'&&card.pythonGuide?card.pythonGuide:card.guide;
    const stageLinks=L.stages.map((name,i)=>{const first=L.cards.findIndex(c=>c.stage===i),reached=first<=s.reached||mode==='teacher';return `<button data-goto="${first}" class="${i===card.stage?'current':''}" ${!reached?'disabled title="Continue through the lesson to reach this stage"':''} ${i===card.stage?'aria-current="step"':''}><span class="stage-num">${i+1}</span>${name}</button>`;}).join('');
    let content='';
    if(card.body)content+='<p>'+esc(card.body)+'</p>';
    if(card.where)content+='<div class="where">↗ Work in: '+esc(card.where)+'</div>';
    if(card.externalQuiz)content+='<a class="button primary" data-quiz-link="'+card.link+'" href="'+L.links[card.link]+'" target="_blank" rel="noopener noreferrer">'+card.linkLabel+'</a>';
    if(card.steps)content+='<ol class="action-list">'+card.steps.map(step=>'<li>'+step+'</li>').join('')+'</ol>';
    if(card.link&&!card.externalQuiz)content+='<a class="button primary" data-editor-link="'+card.link+'" href="'+L.links[card.link]+'" target="_blank" rel="noopener noreferrer">'+card.linkLabel+'</a>';
    if(card.backup){const n=card.backup;const path=n===2?'02-countdown-crew-student-template.png':'03-reactor-recharge-challenge.png';content+='<p class="muted" style="margin-top:10px">Link blocked? <a href="assets/templates/'+path+'" download>Download the editable template PNG</a> and import it in Arcade.</p>';}
    if(card.code&&s.editor==='python')content+='<p class="sample-label">EDIT THIS LINE IN YOUR EXISTING PROJECT</p><pre class="steps-code"><code>'+esc(card.code)+'</code></pre>';
    if(card.expected)content+='<div class="expect"><strong>'+(card.externalQuiz?'Assignment deadline':'What you should see')+'</strong>'+esc(card.expected)+'</div>';
    if(card.ksu)content+='<div class="ksu-grid">'+card.fields.map((f,i)=>'<section class="ksu-box"><h3>'+['Knowledge','Skills','Understanding'][i]+'</h3><p>'+esc(L.ksu[i])+'</p>'+fieldHTML(f)+'</section>').join('')+'</div><div class="goal" id="before-guidance">'+esc(beforeGuidance())+'</div>';
    else {if(card.game)content+=window.CrewReactor.html();content+=card.fields.map(fieldHTML).join('');}
    if(card.pit)content+='<div class="goal" id="pit-analysis" aria-live="polite">'+pitGuidance()+'</div>';
    if(card.evidence)content+=evidenceHTML();
    if(card.review)content+=reviewHTML();
    const visuals=(key?guideHTML(key):'')+(card.demo?demoHTML():'');
    const html=visuals?'<div class="split '+(card.stage===main2Stage?'wide-visual':'')+'"><section>'+content+'</section><section>'+visuals+'</section></div>':content;
    root.innerHTML=`<div class="shell"><aside class="rail" aria-label="Learning goals and lesson progress"><div class="brand"><img src="assets/crew.svg" alt=""><span>CS WITH MR DAVE<br><span class="muted">Year 8 · Arcade</span></span></div><h2 class="rail-title">Countdown Crew</h2><div class="objective"><strong>WAGBA</strong><p>${L.wagba}</p></div><div class="objective ksu-mini">${L.ksu.map((item,i)=>'<p><b>'+['K','S','U'][i]+'</b>'+item+'</p>').join('')}</div><nav class="stage-nav" aria-label="Lesson stages">${stageLinks}</nav><p class="rail-foot">${L.challenge}<br>counter · condition · while · pause · test</p></aside><section class="workspace"><header class="topbar"><div class="identity">${esc(s.student.name)} · ${esc(s.student.className)}${mode==='teacher'?' <span class="pill">Testing</span>':''}<span class="save-status" id="save-status">Saved on this device</span></div><div class="top-tools"><label class="muted" for="language-choice">Support</label><select id="language-choice" aria-label="Language support">${languageOptions(s.language)}</select><button data-action="pdf">Export PDF ↓</button><button data-action="tools">Work tools</button></div></header><main class="main-wrap" id="main"><div class="stage-strip"><span>${L.stages[card.stage]} · Card ${local} of ${group.length}</span><div class="mini-track" aria-label="Card ${local} of ${group.length}">${group.map((_,i)=>'<span class="'+(i<local?'on':'')+'"></span>').join('')}</div></div><article class="lesson-card"><div class="card-title-row"><div><p class="eyebrow">${card.tag}</p><h1 id="card-heading" tabindex="-1">${card.title}</h1></div><img src="assets/crew.svg" alt=""></div><p class="lead">${card.intro}</p>${[main1Stage,main2Stage,furtherStage].includes(card.stage)?`<label class="muted" style="display:flex;gap:8px;align-items:center;margin-bottom:17px" for="editor-choice">Your coding route <select id="editor-choice" style="width:175px;padding:5px 9px;font-size:13px"><option value="blocks" ${s.editor==='blocks'?'selected':''}>MakeCode Blocks</option><option value="python" ${s.editor==='python'?'selected':''}>Arcade Python</option></select></label>`:''}${html}${card.secondaryGuide?'<details class="help-box"><summary>Show the project-name field</summary>'+guideHTML(card.secondaryGuide)+'</details>':''}${card.languageGuide?'<details class="help-box"><summary>Show the Arcade Python menu</summary>'+guideHTML('language')+'</details>':''}${supportHTML(s.card)}${card.help?'<details class="help-box"><summary>If you need help</summary><p>'+esc(card.help)+'</p></details>':''}</article><footer class="card-footer"><button data-action="back" ${s.card===0?'disabled':''}>← Back</button><div class="right">${card.stage===furtherStage?'<button data-goto="${plenaryIndex}" class="secondary">Go to plenary</button>':'<span class="complete-note">Work is saved. Blank answers remain unfinished in your report.</span>'}${s.card<L.cards.length-1?'<button data-action="next" class="primary">'+(L.cards[s.card+1].stage===card.stage?'Next card':'Next: '+L.stages[L.cards[s.card+1].stage])+' →</button>':'<button data-action="pdf" class="primary">Download report ↓</button>'}</div></footer></main></section></div>`;
    const skipButton=root.querySelector('[data-goto="${plenaryIndex}"]');
    if(skipButton)skipButton.dataset.goto=String(plenaryIndex);
    const routeSelect=document.getElementById('editor-choice');
    if(routeSelect)routeSelect.setAttribute('aria-label','Your coding route');
    setSave(persistent?'Saved on this device':'Not saved—download a backup');
    if(card.game)reactor=window.CrewReactor.mount({host:document.getElementById('reactor-rush'),rounds:s.reactorRounds,sound:s.reactorSound,onSound:value=>{s.reactorSound=value;save();},onRound:round=>{const i=s.reactorRounds.findIndex(r=>r.id===round.id);if(i<0)s.reactorRounds.push(round);else s.reactorRounds[i]=round;s.reactorRounds=s.reactorRounds.slice(-40);s.teamsSubmitted=false;save();}});
    if(focus){document.getElementById('card-heading').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  }
  function navigate(index){if(!Number.isInteger(index)||index<0||index>=L.cards.length)return;if(index>s.reached+1&&mode!=='teacher'&&index!==plenaryIndex)return; s.card=index;render(true);}
  async function start(event){event.preventDefault();
    const name=document.getElementById('full-name').value.trim(),className=document.getElementById('class-name').value.trim(),editor=document.getElementById('entry-editor').value,language=document.getElementById('entry-language').value;
    const testing=name.toLowerCase()==='teacher'||mode==='teacher';
    const error=document.getElementById('entry-error');
    if(!testing&&(name.length<2||!className)){error.textContent=name.length<2?'Please enter your name (at least two characters).':'Please enter your class, for example 8T.';document.getElementById(name.length<2?'full-name':'class-name').focus();return;}
    const nextMode=testing?'teacher':'student';
    let next=readState(nextMode);
    if(nextMode==='student'&&next.student.name&&(next.student.name!==name||next.student.className!==className)){
      if(!await askReplace('This browser has work saved for '+next.student.name+'. Download their backup first if needed. Start a new lesson for '+name+' and replace this lesson’s saved responses?'))return;
      next=fresh(nextMode);mode=nextMode;await imageOp('delete','code');
    }
    mode=nextMode;s=next;s.student=testing?{name:'Test Student',className:className||'8T'}:{name,className};s.editor=editor;s.language=language;
    let imageWarning=false;
    try{await loadImages();}catch(e){persistent=false;imageWarning=true;}
    started=true;render(true);
    if(imageWarning)toast('Your responses are available, but stored evidence could not load. Restore a backup or show your teacher; you can still continue.');
  }
  function download(blob,filename){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  async function exportPdf(){
    if(!started){toast('Enter your name and class first.');return;}
    const buttons=[...document.querySelectorAll('[data-action="pdf"]')];buttons.forEach(b=>b.disabled=true);toast('Preparing your full progress report…');
    try{const blob=await window.CrewReport.pdf(s,images);download(blob,window.CrewReport.filename(s));s.exportedAt=new Date().toISOString();save();document.getElementById('submission').showModal();}
    catch(e){toast(e.message||'PDF export failed. Use Print / save as PDF in Work tools.');}
    finally{buttons.forEach(b=>b.disabled=false);}
  }
  async function backup(){if(!s.student.name){toast('Enter your name and class before backing up.');return;}const data={lessonId:L.id,version:1,state:s,evidence:images,exportedAt:new Date().toISOString()};download(new Blob([JSON.stringify(data)],{type:'application/json'}),window.CrewReport.filename(s).replace('.pdf','_Backup.json'));s.backedUpAt=new Date().toISOString();save();toast('Lesson backup downloaded. Save your MakeCode game separately.');}
  async function importBackup(file){
    if(!file)return;
    try{
      if(file.size>25*1024*1024)throw new Error('Backup is too large. Choose a file below 25 MB.');
      const b=JSON.parse(await file.text());if(b.lessonId!==L.id||b.version!==1||!b.state?.student||typeof b.state.student.name!=='string'||typeof b.state.student.className!=='string')throw new Error('This is not a supported Countdown Crew lesson backup.');
      const response=b.state.answers||{},safeAnswers={};
      for(const key of [...Object.keys(fieldMap),'evidence-caption','teacher-evidence','opened-link-gimkit']){const val=response[key];if(typeof val==='string')safeAnswers[key]=val.slice(0,2500);else if(typeof val==='boolean'||typeof val==='number')safeAnswers[key]=val;}
      if(b.evidence?.code&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(b.evidence.code.data||''))throw new Error('Backup contains invalid screenshot data.');
      if(!await askReplace('Restore work for '+b.state.student.name+'? This replaces the current saved work for this lesson.'))return;
      const oldState=s,oldImages=images,newState=fresh(mode);
      newState.student={name:b.state.student.name.slice(0,80),className:b.state.student.className.slice(0,32)};
      newState.answers=safeAnswers;newState.language=['en','zh','ko','ms'].includes(b.state.language)?b.state.language:'en';newState.editor=b.state.editor==='python'?'python':'blocks';
      Object.assign(newState,resumePosition(b.state));
      newState.reactorRounds=window.CrewReactor.safeRounds(b.state.reactorRounds);
      for(const c of L.cards)if(b.state.visited?.[c.id]===true)newState.visited[c.id]=true;
      for(const f of fields.filter(f=>f.type==='choice'))newState.attempts[f.id]=(Array.isArray(b.state.attempts?.[f.id])?b.state.attempts[f.id]:[]).slice(-50).filter(a=>a&&Number.isInteger(Number(a.value))).map(a=>({value:Number(a.value),correct:Number(a.value)===f.correct,at:String(a.at||'')}));
      newState.teamsSubmitted=b.state.teamsSubmitted===true;
      newState.exportedAt=typeof b.state.exportedAt==='string'?b.state.exportedAt:null;
      try{if(b.evidence?.code)await imageOp('put','code',b.evidence.code);else await imageOp('delete','code');s=newState;images=b.evidence?.code?{code:b.evidence.code}:{};save();}
      catch(e){s=oldState;images=oldImages;throw e;}
      document.getElementById('tools').close();started=true;render(true);toast('Backup restored, including screenshot evidence.');
    }catch(e){toast(e.message||'That backup could not be restored.');}
    finally{document.getElementById('import-backup').value='';}
  }
  async function storeScreenshot(file){
    if(!file)return;
    if(!/^image\/(png|jpeg|webp)$/.test(file.type))return toast('Choose a PNG, JPEG or WebP screenshot.');
    if(file.size>8*1024*1024)return toast('Choose a screenshot smaller than 8 MB.');
    try{const url=URL.createObjectURL(file),img=new Image();img.src=url;try{await img.decode();}finally{URL.revokeObjectURL(url);}
      const factor=Math.min(1,1600/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*factor);canvas.height=Math.round(img.height*factor);const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const data={data:canvas.toDataURL('image/jpeg',.93),name:file.name||'Pasted screenshot',at:new Date().toISOString(),width:canvas.width,height:canvas.height};
      await imageOp('put','code',data);images.code=data;save();render();toast(db?'Screenshot saved on this device.':'Screenshot is in memory only—download a backup now.');
    }catch(e){toast('Screenshot could not be saved. Try a smaller image or use the teacher-check option.');}
  }
  function startDemo(){
    if(demoTimer)return;let counter=5;const display=document.getElementById('demo-count'),ship=document.getElementById('demo-ship'),note=document.getElementById('demo-note');if(!display)return;ship.classList.remove('launched');display.textContent=counter;note.textContent='Repeating while the counter is greater than 0…';
    demoTimer=setInterval(()=>{counter--;if(counter>0)display.textContent=counter;else{clearInterval(demoTimer);demoTimer=null;display.textContent='GO!';ship.classList.add('launched');note.textContent='Counter is 0: condition false → launch.';}},1000);
  }
  document.addEventListener('submit',event=>{if(event.target.id==='entry')start(event);});
  document.addEventListener('input',event=>{
    const el=event.target,id=el.dataset.field;if(!id)return;
    s.answers[id]=el.type==='checkbox'?el.checked:el.type==='radio'?Number(el.value):el.value;s.teamsSubmitted=false;save();
    if(fieldMap[id]?.type==='choice'){const box=document.getElementById('feedback-'+id);if(box)box.innerHTML=feedbackHTML(fieldMap[id]);}
    if(document.getElementById('before-guidance'))document.getElementById('before-guidance').textContent=beforeGuidance();
    if(document.getElementById('pit-analysis'))document.getElementById('pit-analysis').innerHTML=pitGuidance();
  });
  document.addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='language-choice'){s.language=el.value;save();render();}
    if(el.id==='editor-choice'){s.editor=el.value;save();render();toast('Select the same coding language in your MakeCode editor.');}
    if(el.id==='evidence-file')storeScreenshot(el.files[0]);
    if(el.id==='import-backup')importBackup(el.files[0]);
  });
  document.addEventListener('paste',event=>{if(!started||L.cards[s.card].evidence!=='code')return;const item=[...(event.clipboardData?.items||[])].find(i=>i.type.startsWith('image/'));if(item){event.preventDefault();storeScreenshot(item.getAsFile());}});
  document.addEventListener('error',event=>{if(event.target.tagName==='IMG'&&event.target.closest('.guide-frame')){event.target.closest('.guide-frame').innerHTML='<div class="image-fallback">The visual guide could not load. Follow the written steps beside it. Your teacher can show this action in MakeCode.</div>'; }},true);
  document.addEventListener('click',async event=>{
    const target=event.target.closest('button,a');if(!target)return;
    if(target.dataset.editorLink){s.answers['opened-link-'+target.dataset.editorLink]=new Date().toISOString();save();}
    if(target.dataset.quizLink){s.answers['opened-link-'+target.dataset.quizLink]=new Date().toISOString();save();}
    if(target.dataset.check){const f=fieldMap[target.dataset.check];if(value(f)===undefined){document.getElementById('feedback-'+f.id).innerHTML='<div class="feedback">Choose your best answer first. You can continue if you need help.</div>';return;}const arr=s.attempts[f.id]||[];arr.push({value:value(f),correct:Number(value(f))===f.correct,at:new Date().toISOString()});s.attempts[f.id]=arr.slice(-50);save();document.getElementById('feedback-'+f.id).innerHTML=feedbackHTML(f);return;}
    if(target.dataset.guide){document.getElementById('lightbox-content').innerHTML=guideHTML(target.dataset.guide,false);document.getElementById('lightbox').showModal();return;}
    if(target.dataset.goto!==undefined){navigate(Number(target.dataset.goto));return;}
    const action=target.dataset.action;
    if(action==='next')navigate(s.card+1);
    if(action==='back')navigate(s.card-1);
    if(action==='demo')startDemo();
    if(action==='tools')document.getElementById('tools').showModal();
    if(action==='submission')document.getElementById('submission').showModal();
    if(action==='close-dialog')target.closest('dialog').close();
    if(action==='pdf')exportPdf();
    if(action==='backup')backup();
    if(action==='print'){if(!started)return toast('Start the lesson first.');document.getElementById('print-report').innerHTML=window.CrewReport.html(s,images);await document.fonts.ready;const loaded=[...document.querySelectorAll('#print-report img')].map(i=>i.decode().catch(()=>{}));await Promise.all(loaded);window.print();}
    if(action==='paste-image'){try{if(!navigator.clipboard?.read)throw new Error();const items=await navigator.clipboard.read();const item=items.find(i=>i.types.some(t=>/^image\/(png|jpeg|webp)$/.test(t)));if(!item)return toast('Copy a screenshot first, or use Choose screenshot.');const type=item.types.find(t=>/^image\/(png|jpeg|webp)$/.test(t));const blob=await item.getType(type);await storeScreenshot(new File([blob],'Pasted screenshot',{type}));}catch(e){toast('Paste is unavailable here. On a laptop press Ctrl/Cmd+V, or use Choose screenshot on a tablet.');}}
    if(action==='delete-image'){await imageOp('delete','code');delete images.code;save();render();toast('Screenshot removed from this lesson.');}
    if(action==='submission-done'){if(!document.getElementById('teams-confirm').checked)return toast('Check the box after attaching your PDF and selecting Turn in, or choose “I will submit later”.');s.teamsSubmitted=true;save();document.getElementById('submission').close();if(L.cards[s.card].review)render();toast('Submission reminder saved. Your teacher checks Teams directly.');}
    if(action==='reset'){if(!await askReplace('Reset only this Countdown Crew lesson’s responses and screenshot on this browser? Download a backup first if needed. Your MakeCode projects are not affected.'))return;try{await imageOp('delete','code');localStorage.removeItem(storageKey(mode));s=fresh(mode);images={};started=false;document.getElementById('tools').close();render();toast('This lesson was reset. MakeCode projects were not changed.');}catch(e){toast('Reset could not finish. Keep a backup and ask your teacher for help.');}}
  });
  openDb().then(async value=>{db=value;await loadImages();render();}).catch(()=>{db=null;persistent=false;render();toast('Screenshot persistence is unavailable. Use a downloaded backup before closing.');});
  render();
})();
