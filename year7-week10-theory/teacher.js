/* Only authenticated, server-approved teacher RPCs can return pupil responses. */
(()=>{
  'use strict';
  const $=s=>document.querySelector(s),L=window.ARCADE,C=window.BinaryTrackingCore,cfg=window.BINARY_CLOUD_CONFIG;
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const client=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,detectSessionInUrl:false,autoRefreshToken:true,storageKey:'y7-binary-teacher-memory-only'}});
  let authorised=false,generation=0,rows=[],page=0,total=0,selected=null,selectedRevision=null,detail=null,detailTicket=0,busy=false,mfaFactor=null,historyBefore=null;
  const date=v=>Number.isFinite(Date.parse(v))?new Date(v).toLocaleString('en-GB',{timeZone:'Asia/Kuala_Lumpur',hour12:false}):'Not recorded';
  const card=id=>L.cards.find(c=>c.id===id),title=id=>card(id)?.title||'Joining the lesson';
  const object=v=>C.object(v)?v:{};
  function say(message,bad=false){$('#teacher-status').textContent=message;$('#teacher-status').dataset.error=String(bad);}
  async function rpc(name,args={}){const {data,error}=await client.rpc(name,args);if(error)throw error;return data;}
  function clear(){authorised=false;generation++;detailTicket++;rows=[];detail=null;selected=null;selectedRevision=null;historyBefore=null;
    for(const id of ['student-list','student-detail','class-summary'])$('#'+id).replaceChildren();
    $('#teacher-workspace').hidden=true;$('#login-panel').hidden=false;$('#sign-out').hidden=true;$('#teacher-mfa').hidden=true;
    if($('#lesson-preview').open)$('#lesson-preview').close();$('#preview-content').replaceChildren();
  }
  async function signOut(message='Signed out. Private responses have been cleared from this view.'){clear();await client.auth.signOut({scope:'local'});say(message);}
  function flags(r){const m=object(r.metrics),f=[];if(m.wrong>0)f.push(m.wrong+' latest checked answers to revisit');if(m.phase==='drowning')f.push('Pitstop: needs an example/help');if(m.startingSupport>0)f.push('Starting KSU: help requested');return f;}
  function listed(){const q=$('#name-filter').value.trim().toLowerCase();return rows.filter(r=>(!q||r.name.toLowerCase().includes(q))&&(!$('#support-only').checked||C.needsReview(r.metrics)));}
  function paintRows(){
    const visible=listed(),focused=document.activeElement?.dataset?.record;
    $('#student-list').innerHTML=visible.length?`<table><caption class="small">${rows.length} loaded records; ${visible.length} shown. A record is a private device/backup session, not a verified school identity.</caption><thead><tr><th>Student / class</th><th>Working on</th><th>Learning progress</th><th>Support to check</th><th>Latest save</th><th>Review</th></tr></thead><tbody>${visible.map(r=>{const m=object(r.metrics),f=flags(r),recent=Date.now()-Date.parse(r.seen)<90000;return `<tr class="${selected===r.id?'selected-record':''}"><td><strong>${esc(r.name)}</strong><br>${esc(r.className)}<small class="session-label">Record …${esc(r.id.slice(-6))}</small></td><td>${esc(title(r.currentId))}<small>${recent?'Tab seen within 90 seconds':'No recent tab heartbeat'} · not proof of attention</small></td><td>${Number(m.progress)||0}/30 core steps attempted<br><span class="answer-good">${Number(m.correct)||0} currently correct</span><small>${Number(m.answered)||0}/22 core questions answered · ${Number(m.unchecked)||0} drafts not checked<br>${Number(m.improved)||0} improved after checking · ${Number(m.hints)||0} hints used</small></td><td>${f.length?f.map(x=>`<span class="support-flag">${esc(x)}</span>`).join(''):'<span class="neutral-flag">No support signal recorded</span>'}</td><td>${esc(date(r.updated))}</td><td><button data-record="${esc(r.id)}">View responses</button></td></tr>`;}).join('')}</tbody></table>`:'<p>No pupil records match this view yet. They appear when pupils enter the public lesson and school saving connects.</p>';
    const count=test=>rows.filter(test).length;
    $('#class-summary').innerHTML=[['Records loaded',rows.length],['With support signals',count(r=>C.needsReview(r.metrics))],['Reached plenary end',count(r=>r.metrics?.progress===30)],['Used a hint',count(r=>r.metrics?.hints>0)],['Improved an answer',count(r=>r.metrics?.improved>0)]].map(([label,n])=>`<div><strong>${n}</strong><span>${esc(label)}</span></div>`).join('');
    $('#page-count').textContent=`Page ${page+1} · ${total} matching records`;
    $('#previous-page').disabled=page===0;$('#next-page').disabled=(page+1)*100>=total;
    if(focused)$('#student-list').querySelector(`[data-record="${focused}"]`)?.focus({preventScroll:true});
  }
  async function roster(){
    if(!authorised||busy)return;busy=true;const gen=generation;
    try{const data=await rpc('y7_binary_teacher_rows',{p_class:$('#class-filter').value||null,p_limit:100,p_offset:page*100,p_archived:$('#show-archived').checked});if(!authorised||gen!==generation)return;
      const chosen=$('#class-filter').value;$('#class-filter').innerHTML='<option value="">All Year 7 classes</option>'+(data.classes||[]).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');$('#class-filter').value=chosen;
      rows=Array.isArray(data.records)?data.records:[];total=Number(data.total)||0;paintRows();
      say(($('#pause-live').checked?'Live updates paused · ':'Live · refresh every 5 seconds · ')+date(data.server_now)+' MYT');
      const selectedRow=rows.find(r=>r.id===selected);if(selectedRow&&selectedRow.revision!==selectedRevision)await loadDetail(selected);
      else if(selected&&!selectedRow){selected=null;detail=null;selectedRevision=null;$('#student-detail').innerHTML='<h2>Choose a pupil in the current view.</h2>';}
    }catch(e){if(gen!==generation)return;if(['42501','PGRST301'].includes(e.code)||e.status===401)await signOut('Your teacher session is unavailable or no longer approved. Sign in again.');else say('Live connection interrupted. This view may be out of date. Refresh to retry.',true);}finally{busy=false;}
  }
  function response(c,r,value=r?.answer){if(value===undefined||value===null||value==='')return 'No response';return c?.options?.find(x=>x[0]===value)?.[1]||String(value);}
  function status(r,c){if(!r)return 'Not attempted';if(c.kind==='reflect')return r.answer?'Self-assessment saved':'No rating selected';if(r.checked!==true)return r.answer?'Draft — not checked':'Not attempted';return r.correct===true?'Correct on latest check':r.correct===false?'Revisit latest check':'Not scored';}
  function paintDetail(){
    if(!detail)return;const s=object(detail.snapshot),records=object(s.records),done=object(s.done),practice=object(object(s.practice).records),m=C.metrics(s,L);
    const open=[...$('#student-detail').querySelectorAll('details[open][data-history]')].map(e=>e.dataset.history),row=rows.find(r=>r.id===selected);
    const fields=L.cards.filter(c=>['number','choice','build','reflect'].includes(c.kind));
    $('#student-detail').innerHTML=`<div class="detail-intro"><div><h2>${esc(detail.name)} · ${esc(detail.className)}</h2><p>Working on ${esc(title(s.currentId))} · saved ${esc(date(detail.updated))} MYT<br><span class="session-label">${esc(detail.id)}</span></p></div><button class="archive-button" data-archive="${row?.archived?'restore':'archive'}">${row?.archived?'Restore archived record':'Archive duplicate / test record'}</button></div>
      <div class="detail-notes">${m.progress}/30 core steps attempted · ${m.correct}/22 currently correct · ${m.wrong} checked answers to revisit · ${m.unchecked} unchecked drafts. First-check correct: ${m.firstCorrect}; improved after a check: ${m.improved}. These are formative signals, not a formal grade.</div>
      <div class="teacher-table-scroll"><table><thead><tr><th>Question / learning check</th><th>Current response or draft</th><th>First checked response</th><th>Latest status</th><th>Checks / hint</th></tr></thead><tbody>${fields.map(c=>{const r=C.object(records[c.id])?records[c.id]:null,a=Array.isArray(r?.attempts)?r.attempts:[],tone=r?.checked===true?(r.correct===true?'answer-good':r.correct===false?'answer-review':''):'answer-draft';return `<tr><td><strong>${esc(c.title)}</strong><small>${esc(c.prompt)}</small></td><td class="table-answer"><span class="answer-value">${esc(response(c,r))}</span></td><td class="table-answer"><span class="answer-value">${esc(a.length?response(c,r,a[0].answer):'Not checked yet')}</span></td><td class="${tone}">${esc(status(r,c))}</td><td>${a.length} checks<br>${r?.hint?'Hint opened':'No hint recorded'}</td></tr>`;}).join('')}</tbody></table></div>
      <details data-history="checks"><summary>Answer/check history — including corrections</summary>${fields.map(c=>{const r=records[c.id],a=Array.isArray(r?.attempts)?r.attempts:[];return a.length?`<h3>${esc(c.title)}</h3><ol>${a.map(x=>`<li><code>${esc(response(c,r,x.answer))}</code> · ${x.correct===true?'correct':x.correct===false?'not yet correct':'self-rating'}${x.hintUsed?' · with hint':''} · ${esc(date(x.at))}</li>`).join('')}</ol>`:'';}).join('')}</details>
      <details data-history="extra"><summary>Extra-practice responses</summary>${Object.entries(practice).map(([id,r])=>`<p><strong>${esc(r.prompt||id)}</strong><br><code>${esc(r.answer)}</code> · ${r.attempts?.length||0} checks · ${r.checked?(r.correct?'correct on latest check':'revisit'):'draft, not checked'}</p>`).join('')||'<p>No extra-practice rounds recorded.</p>'}</details>
      <details data-history="events"><summary>Recent response changes and lesson actions (${detail.eventCount} stored)</summary><ol>${(detail.events||[]).map(e=>`<li>${esc(date(e.received_at))} · ${esc(e.kind)} · ${esc(title(e.card_id))}<br><code>${esc(JSON.stringify(e.data))}</code></li>`).join('')}</ol>${detail.events?.length===100?'<button id="older-history">Load earlier actions</button>':''}</details>`;
    for(const id of open)$('#student-detail').querySelector(`[data-history="${id}"]`)?.setAttribute('open','');
  }
  async function loadDetail(id,before=null){
    if(!authorised)return;const gen=generation,ticket=++detailTicket;
    try{const data=await rpc('y7_binary_teacher_detail',{p_id:id,p_before:before,p_limit:100});if(!authorised||gen!==generation||ticket!==detailTicket)return;
      selected=id;selectedRevision=data.revision;detail=data;historyBefore=data.events?.at(-1)?.seq||null;paintDetail();paintRows();
    }catch(e){if(ticket===detailTicket)say('Could not load that private response record. Please refresh.',true);}
  }
  async function approve(){const data=await rpc('y7_binary_teacher_rows',{p_class:null,p_limit:100,p_offset:0,p_archived:false});authorised=true;generation++;rows=data.records||[];total=data.total||0;page=0;$('#teacher-login').reset();$('#teacher-mfa').reset();$('#teacher-mfa').hidden=true;$('#login-panel').hidden=true;$('#teacher-workspace').hidden=false;$('#sign-out').hidden=false;await roster();}
  $('#teacher-login').onsubmit=async e=>{e.preventDefault();$('#login-button').disabled=true;say('Checking secure teacher sign-in…');
    try{const {error}=await client.auth.signInWithPassword({email:$('#teacher-email').value.trim(),password:$('#teacher-password').value});if(error)throw error;
      const {data:aal,error:aalError}=await client.auth.mfa.getAuthenticatorAssuranceLevel();if(aalError)throw aalError;
      if(aal?.nextLevel==='aal2'&&aal.currentLevel!=='aal2'){const {data,error}=await client.auth.mfa.listFactors();if(error)throw error;mfaFactor=data.totp?.find(f=>f.status==='verified')?.id;if(!mfaFactor)throw Error('Complete your existing account verification before continuing.');$('#teacher-mfa').hidden=false;say('Enter the code from your existing authenticator.');}
      else await approve();
    }catch(e){clear();await client.auth.signOut({scope:'local'});say(e.code==='42501'?'This account is not approved to view Week 10 responses.':e.message||'Sign-in failed.',true);}
    finally{$('#teacher-password').value='';$('#login-button').disabled=false;}
  };
  $('#teacher-mfa').onsubmit=async e=>{e.preventDefault();try{const {error}=await client.auth.mfa.challengeAndVerify({factorId:mfaFactor,code:$('#mfa-code').value.trim()});if(error)throw error;await approve();}catch(e){say('Verification was not completed. Check your authenticator code.',true);}finally{$('#mfa-code').value='';}};
  $('#sign-out').onclick=()=>signOut();$('#refresh').onclick=()=>roster();
  for(const id of ['class-filter','show-archived'])$('#'+id).onchange=()=>{page=0;selected=null;selectedRevision=null;detail=null;detailTicket++;$('#student-detail').replaceChildren();roster();};
  $('#name-filter').oninput=paintRows;$('#support-only').onchange=paintRows;$('#pause-live').onchange=()=>{if(!$('#pause-live').checked)roster();else say('Automatic updates paused. Refresh now still works.');};
  $('#previous-page').onclick=()=>{page=Math.max(0,page-1);roster();};$('#next-page').onclick=()=>{page++;roster();};
  $('#student-list').onclick=e=>{const b=e.target.closest('[data-record]');if(b)loadDetail(b.dataset.record);};
  $('#student-detail').onclick=async e=>{const archive=e.target.closest('[data-archive]');if(archive&&selected){const archiveValue=archive.dataset.archive==='archive';if(!confirm(archiveValue?'Archive this record from the main view? Its responses remain recoverable under Archived records.':'Restore this archived record?'))return;await rpc('y7_binary_teacher_archive',{p_id:selected,p_archive:archiveValue});selected=null;selectedRevision=null;detail=null;$('#student-detail').replaceChildren();await roster();}
    if(e.target.closest('#older-history')&&selected&&historyBefore)loadDetail(selected,historyBefore);
  };
  $('#preview-card').innerHTML=L.cards.map(c=>`<option value="${c.id}">${esc(L.stages.find(s=>s[0]===c.stage)[1]+' · '+c.title)}</option>`).join('');
  function preview(){if(!authorised)return;const c=card($('#preview-card').value),art=c.image?L.art[c.image]:null;$('#preview-content').innerHTML=`<h2>${esc(c.title)}</h2><p>${esc(c.read)}<span class="zh" lang="zh-Hans">${esc(c.zhRead||'')}</span></p>${art?`<img src="assets/${esc(art[0])}" alt="${esc(art[1])}">`:''}<p><strong>${esc(c.prompt)}</strong></p>${c.options?`<ul>${c.options.map(o=>`<li>${esc(o[1])}</li>`).join('')}</ul>`:''}${c.answer!==undefined?`<p class="answer-key">Teacher answer: <code>${esc(c.options?.find(o=>o[0]===c.answer)?.[1]||c.answer)}</code><br>${esc(c.explain||'')}</p>`:''}${c.hint?`<p>Hint: ${esc(c.hint)}</p>`:''}`;}
  $('#preview-lesson').onclick=()=>{preview();$('#lesson-preview').showModal();};$('#preview-card').onchange=preview;$('#close-preview').onclick=()=>$('#lesson-preview').close();
  client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')clear();});
  setInterval(()=>{if(authorised&&!document.hidden&&!$('#pause-live').checked)roster();},5000);
  document.addEventListener('visibilitychange',()=>{if(authorised&&!document.hidden&&!$('#pause-live').checked)roster();});
  window.addEventListener('pagehide',clear);
})();
