(() => {
  const $=s=>document.querySelector(s), status=$('#teacher-status'), roster=$('#roster'), response=$('#response');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=window.ExamCloud, sittings=$('#sittings'), hosted=document.documentElement.hasAttribute('data-hosted-teacher');
  let content, attempts=[], current, key='', workingMarks={},guide={}, sittingId=null, codes=[], live=false, refreshId, loading=null, snapshotEpoch=0, sittingPhase=null, signInEpoch=0;
  const report=e=>{
    if(hosted&&live&&(e.status===401||e.status===403)){clearDesk();cloud.forgetTeacher();drawAuth();}
    status.textContent=e.message;
  };
  const label=a=>a.record?.finished?({submitted:'Submitted','time-ended':'Time ended','session-closed':'Sitting closed'})[a.record.finished.kind]||'Finalised':a.record?'In progress':'Not started';
  const timeLabel=ms=>new Date(ms).toLocaleTimeString('en-MY',{timeZone:'Asia/Kuala_Lumpur',hour:'numeric',minute:'2-digit',second:'2-digit'});
  const markKey=id=>'ecofair-teacher-marks-'+content.version+'-'+id;
  const getMarks=()=>{
    if(!current)return {};
    if(!workingMarks[current.id]){
      try{workingMarks[current.id]=hosted?{}:JSON.parse(localStorage.getItem(markKey(current.id)))||{};}catch{workingMarks[current.id]={};}
    }
    return workingMarks[current.id];
  };
  function getLocalContent(){
    if(window.ExamContent)return Promise.resolve(window.ExamContent);
    return new Promise((yes,no)=>{const s=document.createElement('script');s.src='content.js';s.onload=()=>yes(window.ExamContent);s.onerror=()=>no(Error('On a configured host, load class attempts before opening a backup.'));document.head.append(s);});
  }
  function snapshot(cells, caption, count=9){
    return '<p class="worksheet-lbl"><strong>'+esc(caption)+'</strong></p><div class="tbl-scroll"><table class="data-table grid-snapshot"><thead><tr><th>Row</th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead><tbody>'+
      Array.from({length:count},(_,i)=>'<tr><th scope="row">'+(i+1)+'</th>'+['A','B','C','D'].map(c=>'<td>'+esc(ExamSheet.fmt(ExamSheet.result(cells,c+(i+1)))||'—')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const value=v=>Array.isArray(v)?v.join(', '):String(v??'');
  function answered(q,d){
    const stored=d.answers?.[q.id]||{};
    return q.fields.map(f=>'<p><strong>'+esc(f.label)+'</strong> '+esc(value(stored[f.key])||'—')+'</p>'+
      (['pixelgrid','bitgrid'].includes(f.kind)&&stored[f.key]?'<p aria-hidden="true" class="calc">'+[...stored[f.key]].map(x=>f.kind==='pixelgrid'?(x==='1'?'■':'□'):esc(x)).join(' ')+'</p>':'')).join('');
  }
  function evidence(q,d){
    let html='';
    if(!q.edits)return html;
    const isModel=q.sheet==='model', submitted=ExamSheet.applied(content,d,isModel), typed=ExamSheet.applied(content,d,isModel,true);
    for(const def of q.edits){
      const source=d[isModel?'model':'cells']?.[def.cell]||{}, value=ExamSheet.fmt(ExamSheet.result(submitted,def.cell));
      const raw=source.raw??'', applied=source.applied??'';
      html+='<p class="calc"><strong>'+def.cell+'</strong> · Entered: '+esc(raw||'—')+' · Applied: '+esc(applied||'—')+' · Grid result: '+esc(value||'—')+'</p>';
      if(raw!==applied&&raw)html+='<p class="calc muted">'+(!isModel&&ExamSheet.formulaRequirement(raw)
        ?'Not applied: entry does not start with = and include a cell address.'
        :'Draft was not applied. If applied: '+esc(ExamSheet.fmt(ExamSheet.result(typed,def.cell))||'—'))+'</p>';
    }
    if(isModel){
      const trail=Array.isArray(d.modelTrail)?d.modelTrail:[];
      html+='<p class="calc"><strong>Model changes</strong>: '+(trail.length?trail.map(e=>esc('B2 '+e.beforeInput+' → '+e.afterInput+'; D5 '+e.beforeOutput+' → '+e.afterOutput)).join('<br>'):'No applied change recorded.')+'</p>';
    }
    return html;
  }
  function scoreLine(){
    if(!current)return;
    const marks=getMarks(), subtotal={A:0,B:0,C:0,D:0};
    let count=0;
    for(const q of content.questions)if(Number.isInteger(marks[q.id])){subtotal[q.section]+=marks[q.id];count++;}
    const sum=Object.values(subtotal).reduce((a,b)=>a+b,0);
    $('#subtotal').textContent='A '+subtotal.A+'/6 · B '+subtotal.B+'/8 · C '+subtotal.C+'/10 · D '+subtotal.D+'/16 · '+sum+'/40 recorded · '+count+'/'+content.questions.length+' questions marked';
  }
  function showAttempt(a){
    current=a;
    if(!a?.record){response.innerHTML='';return;}
    if(!a.record.finished){
      const d=a.record.draft;
      response.innerHTML='<section class="card"><h2>'+esc(a.name)+'</h2><p>Draft only · last saved '+esc(new Date(a.record.savedAt).toLocaleTimeString())+'. Marking opens after the attempt is finalised.</p><details><summary>View saved draft</summary>'+
        content.questions.filter(q=>d.answers?.[q.id]||d.work?.[q.id]||q.edits?.some(x=>d[q.sheet==='model'?'model':'cells']?.[x.cell])).map(q=>'<div class="question-line"><div><h3>'+esc(q.id+' · '+q.title)+'</h3>'+answered(q,d)+evidence(q,d)+(d.work?.[q.id]?'<p class="calc"><strong>Working:</strong> '+esc(d.work[q.id])+'</p>':'')+'</div></div>').join('')+'</details></section>';return;
    }
    const {draft:d,finished}=a.record, marks=getMarks();
    response.innerHTML='<section class="card"><h1>'+esc(a.name)+'</h1><p class="intro">'+esc(finished.receipt?'Receipt '+finished.receipt:'Backup · no confirmed receipt')+'</p><p class="metric"><strong id="subtotal"></strong></p>'+
      '<p class="message">'+(hosted?'Marks stay in this tab until you reload, leave or sign out. Export the CSV to school storage before leaving.':'Marks are saved in this teacher’s browser. Export a mark summary to school storage.')+'</p><div class="sheet-actions"><button id="download-marks" class="btn">Download CSV summary</button><label for="jump">Review section</label><select id="jump" class="nav-select"><option value="">Choose…</option>'+Object.keys(content.section).map(k=>'<option value="teacher-'+k+'">'+k+' · '+esc(content.section[k].en)+'</option>').join('')+'</select></div></section>'+
      Object.keys(content.section).map(s=>'<section class="card" id="teacher-'+s+'"><h2>'+s+' · '+esc(content.section[s].en)+'</h2>'+
        (s==='D'?'<details><summary>Reopen the saved worksheets</summary>'+snapshot(ExamSheet.applied(content,d),'Pupil worksheet, applied entries')+snapshot(ExamSheet.applied(content,d,true),'Separate test model, last applied values',6)+'</details>':'')+
        content.questions.filter(q=>q.section===s).map(q=>'<div class="question-line"><div><h3 class="q-head">'+q.id+' · '+esc(q.title)+' <small>('+q.marks+')</small></h3>'+
        (q.intro?'<p>'+esc(q.intro)+'</p>':'')+answered(q,d)+evidence(q,d)+(d.work?.[q.id]?'<p class="calc"><strong>Working:</strong> '+esc(d.work[q.id])+'</p>':'')+
        (guide[q.id]?'<details><summary>Marking notes</summary><p>'+esc(guide[q.id])+'</p></details>':'')+'</div><label>Marks <input class="textbox part-score" type="number" min="0" max="'+q.marks+'" step="1" data-mark="'+q.id+'" value="'+esc(marks[q.id]??'')+'"></label></div>').join('')+'</section>').join('');
    scoreLine();
    for(const el of response.querySelectorAll('[data-mark]'))el.onchange=()=>{
      const id=el.dataset.mark;
      if(el.value==='')delete marks[id];
      else{const n=Math.max(0,Math.min(+el.max,Math.round(+el.value)));marks[id]=n;el.value=String(n);}
      if(!hosted)try{localStorage.setItem(markKey(a.id),JSON.stringify(marks));}catch{status.textContent='This browser could not save the marks locally. Download them before closing.';}
      scoreLine();
    };
    $('#download-marks').onclick=exportMarks;
    $('#jump').onchange=e=>document.getElementById(e.target.value)?.scrollIntoView();
  }
  function exportMarks(){
    const records=[...attempts];
    if(current&&!records.some(a=>a.id===current.id))records.push(current);
    const val=s=>'"'+String(s??'').replace(/^[=+@\-\t\r\n]/,"'$&").replace(/"/g,'""')+'"';
    const csv=[['Pupil','Attempt','Status','A /6','B /8','C /10','D /16','Total /40','Questions marked']];
    for(const a of records){
      let m={};
      try {m=workingMarks[a.id]||(hosted?{}:JSON.parse(localStorage.getItem(markKey(a.id))))||{};}catch{}
      const rated=content.questions.filter(q=>Number.isInteger(m[q.id]));
      const scores=['A','B','C','D'].map(s=>rated.filter(q=>q.section===s).reduce((n,q)=>n+m[q.id],0));
      csv.push([a.name,a.id,a.record?.finished?(a.record.finished.receipt?'Submitted':'Backup'):a.record?'In progress':'Not started',
        ...(rated.length?scores:['','','','']),rated.length===content.questions.length?scores.reduce((a,b)=>a+b,0):'',rated.length]);
    }
    const u=URL.createObjectURL(new Blob([csv.map(r=>r.map(val).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=u;a.download='year7-term12-marks.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);
  }
  function downloadResponses(){
    const u=URL.createObjectURL(new Blob([JSON.stringify({format:'y7-term12-teacher-export-v1',assessment:content.version,sitting:sittingId,exportedAt:new Date().toISOString(),attempts},null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=u;a.download='year7-term12-responses.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);
  }
  async function loadClass(background=false){
    if(cloud&&!sittingId)return;
    if(loading)return loading;
    const epoch=snapshotEpoch, id=sittingId;
    loading=(async()=>{
    let data;
    if(cloud)data=await cloud.teacher('read',id);
    else{
      const res=await fetch('/api/teacher/attempts',{cache:'no-store',headers:{Authorization:'Bearer '+key}});
      if(!res.ok)throw Error('Could not load attempts. Check the teacher key and host.');
      data=await res.json();
    }
    if(epoch!==snapshotEpoch)return;
    content=data.content;attempts=data.attempts;guide=data.guide||{};
    if(cloud&&data.state){
      sittingPhase=data.state;
      if($('#sitting-window'))$('#sitting-window').textContent=sittingPhase==='draft'?'Not started. Opening starts the shared timer.':
        sittingPhase==='closed'?'Closed by teacher.':sittingPhase==='ended'?'Ended automatically. No pupils can start or edit.':
        data.serverNow>=data.standardEnd?'Standard time has ended. Only pupils with extra time can continue.':
        'Shared deadline: '+timeLabel(data.standardEnd)+' (Malaysia time)';
      if(sittingPhase==='ended'||sittingPhase==='closed')clearInterval(refreshId);
    }
    const list='<section class="card"><h2>Class attempts</h2><p class="message">'+attempts.filter(a=>a.record?.finished).length+' finalised · '+attempts.filter(a=>a.record&&!a.record.finished).length+' in progress · '+attempts.length+' on roster</p><div class="sheet-actions"><button id="reload-class" class="btn">Refresh attempts</button>'+(cloud?'<button id="export-responses" class="btn">Download responses (JSON)</button>':'')+'</div><ul class="review-list">'+attempts.map((a,i)=>'<li><button class="btn" data-attempt="'+i+'">'+esc(a.name)+'<span class="q-state">'+label(a)+(a.extraMinutes?' · +'+a.extraMinutes+' min':'')+(a.record&&!a.record.finished?' · '+(cloud?'Ends '+timeLabel(a.record.deadline):'Saved '+new Date(a.record.savedAt).toLocaleTimeString()):'')+'</span></button></li>').join('')+'</ul></section>';
    updateTimeChoices(data);
    if(background&&roster.dataset.lastHtml===list)return;
    roster.dataset.lastHtml=list;roster.innerHTML=list;
    for(const b of roster.querySelectorAll('[data-attempt]'))b.onclick=()=>showAttempt(attempts[+b.dataset.attempt]);
    $('#reload-class').onclick=()=>loadClass().catch(report);
    if($('#export-responses'))$('#export-responses').onclick=downloadResponses;
    const updated=current&&attempts.find(a=>a.id===current.id);
    if(updated&&(!current.record?.finished)&&(updated.record?.finished||(!background&&updated.record)))showAttempt(updated);
    status.textContent='Class attempts loaded.'+(cloud?' Active sittings refresh automatically.':'');
    })();
    try{return await loading;}finally{loading=null;}
  }
  function updateTimeChoices(data){
    if(!cloud||!$('#extra-actions'))return;
    const holder=$('#extra-actions'), eligible=['draft','open'].includes(sittingPhase)?attempts.filter(a=>!a.record?.finished&&
      (sittingPhase==='draft'||data.serverNow<(a.record?.deadline||data.standardEnd+(a.extraMinutes||0)*60000))):[];
    const options=eligible.map(a=>'<option value="'+esc(a.id)+'">'+esc(a.name+(a.extraMinutes?' (+'+a.extraMinutes+' min)':''))+'</option>').join('');
    if(holder.dataset.options===options)return;
    holder.dataset.options=options;
    if(!eligible.length){holder.innerHTML='';return;}
    const last=$('#extra-pupil')?.value, mins=$('#extra-minutes')?.value||'5', wasOpen=$('#extra-menu')?.open;
    holder.innerHTML='<details id="extra-menu"'+(wasOpen?' open':'')+'><summary>Give extra time to a pupil</summary><form id="extra-form" class="field">'+
      '<p>Add time before the pupil’s deadline. This does not change the rest of the class’s timer.</p>'+
      '<label for="extra-pupil">Pupil</label><select id="extra-pupil" class="nav-select">'+options+'</select>'+
      '<label for="extra-minutes">Additional minutes</label><input id="extra-minutes" type="number" min="1" max="120" value="'+esc(mins)+'" class="textbox" required>'+
      '<button class="btn">Add minutes</button></form></details>';
    if(eligible.some(a=>a.id===last))$('#extra-pupil').value=last;
    $('#extra-form').onsubmit=async e=>{
      e.preventDefault();
      const id=sittingId, who=$('#extra-pupil').value, minutes=+$('#extra-minutes').value, b=e.submitter;
      const pupil=eligible.find(a=>a.id===who);
      if(!pupil||!confirm('Add '+minutes+' minutes for '+pupil.name+'? The rest of the class keeps its existing deadline.'))return;
      b.disabled=true;
      try{
        if(loading)await loading.catch(()=>{});
        await cloud.teacher('extend',id,{attempt:who,minutes});
        if(id===sittingId){await loadClass();status.textContent='Added '+minutes+' minutes for '+pupil.name+'.';}
      }catch(err){report(err);}finally{b.disabled=false;}
    };
  }
  function switchSitting(id){
    if(sittingId===id)return;
    snapshotEpoch++;sittingId=id;codes=[];current=null;attempts=[];roster.innerHTML=response.innerHTML='';delete roster.dataset.lastHtml;
  }
  async function drawSittings(confirmedRows){
    const rows=confirmedRows??(await cloud.teacher('list')).sittings;
    if(!live)return;
    if(!rows.some(r=>r.id===sittingId))switchSitting(rows[0]?.id||null);
    const s=rows.find(r=>r.id===sittingId);
    sittings.innerHTML='<section class="card"><h2>Live sittings</h2><p>'+(s?.entry_by_name?'Pupils enter their full names. No codes are needed. Check the names as pupils join. ':'Issue one private code per pupil. ')+'Start the sitting only when everyone is ready. Starting sets the same deadline for the whole class unless you give a pupil extra time.</p>'+
      '<div class="sheet-actions"><label for="pick-sitting">Select sitting</label><select id="pick-sitting" class="nav-select">'+(rows.length?rows.map(r=>'<option value="'+esc(r.id)+'"'+(r.id===sittingId?' selected':'')+'>'+esc(r.title+' · '+r.state)+'</option>').join(''):'<option>No sittings yet</option>')+'</select></div>'+
      '<details><summary>Create a sitting</summary><form id="new-sitting" class="field"><label for="sitting-title">Sitting title</label><input class="textbox" id="sitting-title" required maxlength="100" placeholder="Y7T · Term 1.2 assessment"><label for="sitting-minutes">Minutes per pupil</label><input class="textbox" id="sitting-minutes" type="number" min="1" max="120" value="45" required><button class="btn primary">Create as draft</button></form></details>'+
      (s?'<p class="message"><strong>'+esc(s.title)+'</strong> · '+s.minutes+' min<br><span id="sitting-window" role="status"></span></p><div class="sheet-actions">'+
        (s.state==='draft'?'<button id="open-sitting" class="btn primary">Start '+s.minutes+'-minute sitting</button>':'')+
        (s.state!=='closed'?'<button id="close-sitting" class="btn">Close sitting</button>':'')+'</div>'+
        (s.state!=='closed'&&!s.entry_by_name?'<details'+(codes.length?' open':'')+'><summary>Issue private pupil codes</summary><form id="issue-codes" class="field"><label for="code-names">Pupil names, one per line</label><textarea id="code-names" class="textbox" rows="3" required></textarea><button class="btn">Generate codes</button></form>'+
          (codes.length?'<p><strong>Copy these now.</strong> They are shown only at issue. Share a code only with its named pupil.</p><textarea class="textbox" rows="6" readonly aria-label="New private pupil codes">'+esc(codes.map(x=>x.name+' — '+x.code).join('\n'))+'</textarea>':'')+'</details>':'')+'<div id="extra-actions"></div>':'')+'</section>';
    const run=fn=>async e=>{e.preventDefault();const b=e.submitter||e.currentTarget;if(b.tagName==='BUTTON')b.disabled=true;try{await fn();}catch(err){report(err);}finally{if(b.tagName==='BUTTON')b.disabled=false;}};
    $('#pick-sitting').onchange=async e=>{const next=e.target.value;switchSitting(next);try{if(loading)await loading.catch(()=>{});await drawSittings();}catch(err){report(err);}};
    $('#new-sitting').onsubmit=run(async()=>{
      const {id}=await cloud.teacher('create',null,{title:$('#sitting-title').value,minutes:+$('#sitting-minutes').value});
      switchSitting(id);if(loading)await loading.catch(()=>{});await drawSittings();
    });
    if($('#issue-codes'))$('#issue-codes').onsubmit=run(async()=>{
      const names=$('#code-names').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
      const r=await cloud.teacher('issue',sittingId,{names});codes.push(...r.codes);await drawSittings();
      if(!r.codes.length)status.textContent='No new codes issued. Those pupils are already on the roster.';
    });
    if($('#open-sitting'))$('#open-sitting').onclick=run(async()=>{
      if(!confirm('Start the '+s.minutes+'-minute countdown now? Do this only when pupils are ready.'))return;
      await cloud.teacher('open',sittingId);codes=[];await drawSittings();
    });
    if($('#close-sitting'))$('#close-sitting').onclick=run(async()=>{
      if(!confirm('Close this sitting? Active attempts will be frozen with their last online save, and no new pupils can start.'))return;
      await cloud.teacher('close',sittingId);codes=[];if(loading)await loading.catch(()=>{});await drawSittings();
    });
    clearInterval(refreshId);
    if(s?.state==='open')refreshId=setInterval(()=>{if(!document.hidden)loadClass(true).catch(report);},10000);
    await loadClass();
  }
  function clearDesk(){
    signInEpoch++;live=false;clearInterval(refreshId);switchSitting(null);sittings.innerHTML='';
    content=null;guide={};workingMarks={};
    if($('#backup'))$('#backup').value='';
  }
  function drawAuth(){
    const form=$('#connect');
    if($('#hosted-backup'))$('#hosted-backup').hidden=!live;
    form.innerHTML=live?'<button type="button" class="btn" id="sign-out">Sign out</button>':'<label for="teacher-email">Teacher email</label><input id="teacher-email" class="textbox" type="email" autocomplete="username" required><label for="teacher-password">Password</label><input id="teacher-password" class="textbox" type="password" autocomplete="current-password" required><button class="btn primary">Sign in</button>';
    if(live)$('#sign-out').onclick=async()=>{
      if(hosted&&Object.values(workingMarks).some(m=>Object.keys(m).length)&&!confirm('Sign out? Download your marks first if you need to keep them.'))return;
      clearDesk();drawAuth();status.textContent='Signed out.';
      await cloud.signOut();
    };
    form.onsubmit=async e=>{
      e.preventDefault();if(live)return;const b=e.submitter;if(b)b.disabled=true;
      const epoch=++signInEpoch;
      try{
        await cloud.signIn($('#teacher-email').value,$('#teacher-password').value);
        if(epoch!==signInEpoch)return;
        const {sittings:allowed}=await cloud.teacher('list');
        if(epoch!==signInEpoch)return;
        live=true;drawAuth();await drawSittings(allowed);
      }catch(err){
        if(epoch===signInEpoch){clearDesk();const logout=cloud.signOut();drawAuth();report(err);await logout;}
      }finally{if(b)b.disabled=false;}
    };
  }
  if(cloud){
    live=cloud.hasTeacher();drawAuth();
    if(live)drawSittings().catch(async err=>{clearDesk();await cloud.signOut();drawAuth();report(err);});
  }else if(hosted){status.textContent='Could not load sign-in. Reload this page or contact your school administrator.';}
  else $('#connect').onsubmit=e=>{e.preventDefault();key=$('#key').value.trim();loadClass().catch(report);};
  if(hosted&&cloud)addEventListener('pagehide',()=>{clearDesk();cloud.forgetTeacher();drawAuth();status.textContent='';});
  $('#backup').onchange=async e=>{
    try{
      if(hosted&&(!live||!content))throw Error('Sign in and choose a sitting before opening a backup.');
      const epoch=snapshotEpoch;
      const file=e.target.files[0];if(!file)return;if(file.size>100000)throw Error('Response backup is too large.');
      const data=JSON.parse(await file.text());
      if(hosted&&(!live||epoch!==snapshotEpoch))return;
      if(data.format!=='y7-term12-response-v1'||!data.draft||typeof data.attemptId!=='string'||!data.finished)throw Error('This is not a finished Year 7 test backup.');
      content??=await getLocalContent(); if(data.assessment!==content.version)throw Error('The backup is for a different paper version.');
      const owner=attempts.find(a=>a.id===data.attemptId);
      showAttempt({id:data.attemptId,name:owner?.name||'Backup: '+data.attemptId,record:data});
      status.textContent='Response backup opened. Verify identity before updating the official record.';
    }catch(e){status.textContent=e.message;}
  };
})();
