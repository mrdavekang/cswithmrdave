/* Lesson-only, explicit capture. Never record the teacher password or unrelated
   keyboard, clipboard, browser or device activity. Anonymous pupils can write
   only with their own random key; only the verified Auth owner can read. */
window.ListsCloud=(()=>{
 'use strict';
 const cfg=window.LISTS_CLOUD_CONFIG,$=s=>document.querySelector(s),copy=v=>JSON.parse(JSON.stringify(v)),stamp=()=>new Date().toISOString();
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 const randomHex=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
 const newId=()=>crypto.randomUUID();
 const bytes=v=>new TextEncoder().encode(JSON.stringify(v)).length;
 let active=null,preview=false,dbPromise,timer,busy=false,retryAt=0,lastError='',lastSynced=null,startGeneration=0;
 const writers=new Map(),coalesced=new Map();
 const words=(en,zh,ko)=>active?.state.language==='zh'?`${en} · ${zh}`:active?.state.language==='ko'?`${en} · ${ko}`:en;
 function status(message,bad=false){const el=$('#cloud-status');if(el){el.textContent=message;el.dataset.problem=String(bad);}}
 function fail(error){lastError=String(error?.message||error);status(words('School sync paused · work stays on this device','学校同步暂停，作品保存在本设备','학교 동기화 일시 중지 · 이 기기에 저장됨'),true);}
 function database(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open('y8-lists-learning-records',1);req.onupgradeneeded=()=>{const p=req.result.createObjectStore('profiles',{keyPath:'id'});p.createIndex('dirty','dirty');const e=req.result.createObjectStore('events',{keyPath:'event_id'});e.createIndex('session','session_id');};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return dbPromise;}
 async function dirtyProfiles(){const db=await database();return new Promise((resolve,reject)=>{const q=db.transaction('profiles').objectStore('profiles').index('dirty').getAll(1);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});}
 async function read(store,id){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(store),q=id===undefined?tx.objectStore(store).getAll():tx.objectStore(store).get(id);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);});}
 async function put(store,value){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Storage transaction stopped'));});}
 async function queueEvent(event,previousId){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('events','readwrite'),s=tx.objectStore('events');if(previousId)s.delete(previousId);s.put(event);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Storage transaction stopped'));});}
 async function changeProfile(id,fn){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('profiles','readwrite'),s=tx.objectStore('profiles'),q=s.get(id);let result;q.onsuccess=()=>{if(q.result){result=fn(q.result)||q.result;s.put(result);}};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Storage transaction stopped'));});}
 async function removeEvents(ids){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('events','readwrite');for(const id of ids)tx.objectStore('events').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
 async function rpc(name,args){const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),15000);try{const r=await fetch(cfg.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(args),signal:abort.signal});const data=await r.json();if(!r.ok)throw Error(data.code==='PGRST202'?'Teacher database setup is required.':data.message||'School save failed');return data;}finally{clearTimeout(timeout);}}
 function schedule(delay=1300){if(timer)return;timer=setTimeout(()=>{timer=null;drain().catch(fail);},delay);}
 async function updateStatus(){
  if(preview){status('Teacher preview · no pupil work recorded');return;}
  if(!active){status('School save starts after student entry');return;}
  const target=active;const [p,events]=await Promise.all([read('profiles',target.id),read('events')]);if(active!==target||preview)return;const count=events.filter(e=>e.session_id===target.id).length;
  if(navigator.onLine===false){status(words(`Offline · ${count} changes queued here`,`离线 · ${count} 项更改待同步`,`오프라인 · 변경 ${count}개 대기`),true);return;}
  if(lastError){fail(lastError);return;}
  if(count||p?.needsSnapshot||p?.evidenceAction!=='keep'){status(words(`School save pending · ${count} changes`,`学校保存待处理 · ${count} 项更改`,`학교 저장 대기 · 변경 ${count}개`));return;}
  if(p?.syncedAt){lastSynced=p.syncedAt;status(words('Synced to school · '+new Date(p.syncedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'已同步到学校','학교에 동기화됨'));}
 }
 async function start(state,evidence){
  const generation=++startGeneration;preview=!!state.teacher;active=null;lastSynced=null;$('#cloud-teacher').hidden=!preview;
  if(preview||!cfg?.enabled){status(preview?'Teacher preview · no pupil work recorded':'School save is not enabled');return;}
  try{
   if(!uuid.test(state.cloudSessionId||''))state.cloudSessionId=newId();
   let p=await read('profiles',state.cloudSessionId);
   if(p&&(p.name!==state.name||p.className!==state.className)){state.cloudSessionId=newId();p=null;}
   if(!p){
    // A backup deliberately excludes write keys. On another browser it becomes
    // a new trace, rather than granting name-only access to somebody else's work.
    if(state.cloudSessionId&&await read('profiles',state.cloudSessionId)===undefined)state.cloudSessionId=newId();
    const source=new URL(location.href).searchParams.get('classId');
    p={id:state.cloudSessionId,token:randomHex(),name:state.name,className:state.className,sourceClassId:uuid.test(source||'')?source:null,joined:false,evidenceAction:'keep',needsSnapshot:false,dirty:1};await put('profiles',p);
   }
   if(generation!==startGeneration)return;
   active={id:p.id,state};writers.set(p.id,writers.get(p.id)||newId());lastError='';
   record(p.joined?'resume':'join',null,{name:state.name,className:state.className,language:state.language,guidance:state.guidance,contentVersion:state.contentVersion});
   capture(state);setEvidence(evidence||null);window.dispatchEvent(new CustomEvent('lists-cloud-identity'));schedule(50);await updateStatus();
  }catch(e){fail(e);}
 }
 function capture(state){
  if(!active||active.state!==state||state.teacher)return;const id=active.id,snapshot=copy(state),version=newId(),at=stamp();
  // Keep local histories unchanged. Only unusually large cloud snapshots are
  // compacted; complete new attempts still live in the append-only event log.
  if(bytes(snapshot)>3500000)for(const r of Object.values(snapshot.responses||{})){r.attemptCount=r.attempts?.length||0;r.attempts=(r.attempts||[]).slice(-3);}
  changeProfile(id,p=>({...p,snapshot,snapshotAt:at,snapshotVersion:version,needsSnapshot:true,dirty:1})).then(()=>{schedule();updateStatus().catch(fail);}).catch(fail);
 }
 function record(kind,cardId,data={},fieldKey=null){
  if(!active||active.state.teacher)return;const id=active.id,key=fieldKey?id+':'+cardId+':'+fieldKey:null;
  const previousId=key?coalesced.get(key)?.event_id:null;
  const event={event_id:newId(),session_id:id,writer_id:writers.get(id),kind,card_id:cardId||null,data:copy(data),client_at:stamp(),readyAt:Date.now()+(fieldKey?1000:0),coalesceKey:key};if(key)coalesced.set(key,event);
  // Every field edit reaches the local outbox immediately. Repeated typing in
  // the same field is coalesced into a draft until a short pause, not keylogged.
  // Replace only the unsent draft. A new ID on each revision also protects
  // edits if another lesson tab is acknowledging an older queued revision.
  queueEvent(event,previousId).then(()=>{schedule();updateStatus().catch(fail);}).catch(fail);
 }
 function setEvidence(evidence){if(!active||active.state.teacher)return;const id=active.id,version=newId(),at=stamp();changeProfile(id,p=>({...p,evidence:copy(evidence),evidenceAction:evidence?'set':'delete',evidenceAt:at,evidenceVersion:version,dirty:1})).then(()=>schedule()).catch(fail);}
 function stop(){startGeneration++;active=null;preview=false;coalesced.clear();schedule(20);status('School save starts after student entry');}
 async function drain(force=false){
  if(busy||!cfg?.enabled||(!force&&Date.now()<retryAt))return;if(navigator.onLine===false){await updateStatus();return;}busy=true;
  try{
   const [dirty,queued]=await Promise.all([dirtyProfiles(),read('events')]),ids=new Set([...dirty.map(p=>p.id),...queued.map(e=>e.session_id)]);
   for(const id of ids){
    let p=await read('profiles',id),events=(await read('events')).filter(e=>e.session_id===p.id&&(force||e.readyAt<=Date.now())).sort((a,b)=>a.client_at.localeCompare(b.client_at));
    if(!events.length&&!p.needsSnapshot&&p.evidenceAction==='keep')continue;
    if(!p.joined){await rpc('y8_lists_join',{p_session_id:p.id,p_token:p.token,p_name:p.name,p_class_name:p.className,p_source_class_id:p.sourceClassId});await changeProfile(p.id,x=>({...x,joined:true}));p=await read('profiles',p.id);}
    const batch=[];let size=0;for(const e of events){if(batch.length===40||size+bytes(e)>800000)break;batch.push(e);size+=bytes(e);}
    for(const e of batch)if(e.coalesceKey&&coalesced.get(e.coalesceKey)?.event_id===e.event_id)coalesced.delete(e.coalesceKey);
    const result=await rpc('y8_lists_save',{p_session_id:p.id,p_token:p.token,p_events:batch.map(({event_id,writer_id,kind,card_id,client_at,data})=>({event_id,writer_id,kind,card_id,client_at,data})),p_snapshot:p.needsSnapshot?p.snapshot:null,p_snapshot_at:p.needsSnapshot?p.snapshotAt:null,p_evidence_action:p.evidenceAction,p_evidence:p.evidenceAction==='set'?p.evidence:null,p_evidence_at:p.evidenceAction!=='keep'?p.evidenceAt:null});
    // Delete only acknowledged IDs. An edit made while a request is in flight
    // has a different ID/version and cannot be accidentally acknowledged away.
    await removeEvents(batch.map(e=>e.event_id));await changeProfile(p.id,x=>{const needsSnapshot=x.snapshotVersion===p.snapshotVersion?false:x.needsSnapshot,evidenceAction=x.evidenceVersion===p.evidenceVersion?'keep':x.evidenceAction;return {...x,needsSnapshot,snapshot:needsSnapshot?x.snapshot:null,evidenceAction,evidence:evidenceAction==='keep'?null:x.evidence,dirty:Number(needsSnapshot||evidenceAction!=='keep'),syncedAt:result.server_now};});
   }
   lastError='';retryAt=0;await updateStatus();
  }catch(e){lastError=String(e.message||e);retryAt=Date.now()+10000;fail(e);}
  finally{busy=false;}
 }
 function retry(){lastError='';retryAt=0;status(words('Connecting to school…','正在连接学校…','학교에 연결 중…'));drain(true).catch(fail);}
 window.addEventListener('online',retry);
 window.addEventListener('pagehide',()=>{for(const e of coalesced.values())put('events',{...e,readyAt:0}).catch(()=>{});});
 setInterval(()=>drain().catch(fail),5000);
 $('#cloud-retry').onclick=retry;
 $('#cloud-status').onclick=()=>{$('#cloud-explanation').textContent=lastError?'School save needs attention: '+lastError+' Your local copy and outbox are kept. Retry when connected; tell your teacher if this continues.':'This lesson saves answers, code drafts, runs, hints, help requests and evidence for your teacher. Typing is grouped after short pauses. Queued work is on this browser until acknowledged by Supabase. It is not a record of other apps or browser tabs.';$('#cloud-info').showModal();};

 // The teacher preview flag affects only visibility. All reads are authorised
 // again by Supabase Auth + the database's fixed lesson-owner check.
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let teacherClient,selected=null,loaded=[],selectedCount=0,recordPage=0;
 const admin=()=>teacherClient||(teacherClient=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,detectSessionInUrl:false,autoRefreshToken:true,storageKey:'y8-lists-teacher-memory'}}));
 async function teacherRpc(name,args){const {data,error}=await admin().rpc(name,args);if(error)throw error;return data;}
 const message=s=>{$('#cloud-admin-message').textContent=s;};
 const date=v=>Number.isNaN(Date.parse(v))?'Not recorded':new Date(v).toLocaleString();
 async function roster(){const rows=await teacherRpc('y8_lists_teacher_records',{p_class_name:$('#cloud-class-filter').value||null,p_limit:100,p_offset:recordPage*100});$('#cloud-record-list').innerHTML=rows.length?`<table><caption>Saved work sessions · page ${recordPage+1}. Names are self-entered, not verified logins.</caption><thead><tr><th>Name / class</th><th>Last school save</th><th>Core checks</th><th>History</th><th>Work</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.name)} · ${esc(r.className)}</td><td>${esc(date(r.updated))}</td><td>${r.coreMet}/6</td><td>${r.eventCount} events</td><td><button data-cloud-record="${esc(r.id)}">View work</button></td></tr>`).join('')}</tbody></table>`:'<p>No saved sessions for this filter yet.</p>';$('#cloud-record-prev').disabled=recordPage===0;$('#cloud-record-next').disabled=rows.length<100;for(const b of document.querySelectorAll('[data-cloud-record]'))b.onclick=()=>details(b.dataset.cloudRecord).catch(e=>message(e.message));message('Private records loaded. Core checks are formative evidence, not grades.');}
 function eventHTML(e){return `<details class="cloud-event"><summary>${esc(e.kind)} · ${esc(e.card_id||'lesson')} · received ${esc(date(e.received_at))}</summary><p>Device time: ${esc(date(e.client_at))}</p><pre>${esc(JSON.stringify(e.data,null,2))}</pre></details>`;}
 const readable=v=>v&&typeof v==='object'?(v.en||JSON.stringify(v)):String(v??'');
 function answerText(c,r){if(c.type==='choice')return readable(c.options?.[r.answer]);if(c.type==='checklist')return (r.answer||[]).map(i=>readable(c.options?.[i])).join('; ')||'No goals selected';return readable(r.answer);}
 function paintDetail(d){
  const responses=d.snapshot.responses||{};
  $('#cloud-record-detail').innerHTML=`<h3>${esc(d.name)} · ${esc(d.className)}</h3><p>First joined: ${esc(date(d.started))}. Last school save: ${esc(date(d.updated))}.</p><p>Reading support: ${esc(d.snapshot.language||'en')}. Guidance: ${esc(d.snapshot.guidance||'steps')}. Teams turn-in: ${d.snapshot.teamsSubmitted?'student confirmed (not verified by Teams)':'not confirmed'}.</p><h4>Latest saved work</h4>${LESSON.cards.filter(c=>responses[c.id]).map(c=>{
   const r=responses[c.id];if(!r.code&&r.answer===undefined&&!r.helpRequested&&!r.stillLearning)return '';
   return `<details class="cloud-work"><summary>${esc(c.title)} · ${esc(r.status)}</summary><p>${esc(readable(c.question))}</p>${r.answer!==undefined?`<p>Response: ${esc(answerText(c,r))}</p>`:''}${r.stillLearning?'<p>Student says they still need help with these goals.</p>':''}${r.code?`<pre>${esc(r.code)}</pre><h5>Console</h5><pre>${esc(r.stdout||'(no output)')}</pre>`:''}${r.error?`<p>${esc(r.error)}</p>`:''}${r.feedback?`<p>${esc(r.feedback.message)}</p>`:''}<p>Hints opened: ${r.hintCount||Number(!!r.hintShown)}. ${r.helpRequested?'Help requested.':''}</p></details>`;
  }).join('')}${d.evidence&&/^data:image\/(jpeg|png|webp);base64,/.test(d.evidence.data)?`<figure><img class="cloud-evidence" src="${esc(d.evidence.data)}" alt="Student evidence"><figcaption>${esc(d.evidence.caption)}</figcaption></figure>`:''}<details class="cloud-work"><summary>All saved responses and learning choices</summary><pre>${esc(JSON.stringify(d.snapshot,null,2))}</pre></details><div class="check-row"><button id="cloud-download-trace">Download full learning trace</button></div><h4>Learning timeline</h4><p id="cloud-timeline-count">Showing ${loaded.length} of ${selectedCount} saved events. Device times can differ; receipt times are supplied by the server.</p><div id="cloud-timeline">${loaded.map(eventHTML).join('')}</div><button id="cloud-older" ${loaded.length>=selectedCount?'disabled':''}>Show older events</button>`;
  $('#cloud-older').onclick=()=>older().catch(e=>message(e.message));$('#cloud-download-trace').onclick=()=>downloadTrace().catch(e=>message(e.message));
 }
 async function details(id){const d=await teacherRpc('y8_lists_teacher_detail',{p_session_id:id,p_limit:100});selected=d;loaded=d.events;selectedCount=d.eventCount;paintDetail(d);}
 async function older(){if(!selected||!loaded.length)return;const d=await teacherRpc('y8_lists_teacher_detail',{p_session_id:selected.id,p_before:loaded.at(-1).server_seq,p_limit:100});loaded.push(...d.events);paintDetail(selected);}
 async function downloadTrace(){
  if(!selected)return;message('Preparing complete private trace…');const d=await teacherRpc('y8_lists_teacher_detail',{p_session_id:selected.id,p_limit:200}),events=[...d.events];
  while(events.length<d.eventCount){const page=await teacherRpc('y8_lists_teacher_detail',{p_session_id:d.id,p_before:events.at(-1)?.server_seq,p_limit:200});if(!page.events.length)throw Error('History changed while exporting. Refresh and try again.');events.push(...page.events);}
  const data={...d,events,exportedAt:stamp(),note:'Names are self-entered. Includes current saved evidence and all server-received lesson events; not a secure exam or attendance record.'},url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=('Year8_'+d.className+'_'+d.name+'_Learning_Trace.json').replace(/[^\p{L}\p{N}._-]+/gu,'_');a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);message('Full trace downloaded. Keep this pupil data private.');
 }
 $('#cloud-teacher').onclick=()=>$('#cloud-dashboard').showModal();
 $('#cloud-login').onsubmit=async e=>{e.preventDefault();const button=$('#cloud-login button');button.disabled=true;message('Signing in…');try{const {error}=await admin().auth.signInWithPassword({email:$('#cloud-email').value.trim(),password:$('#cloud-password').value});if(error)throw error;await roster();$('#cloud-login').hidden=true;$('#cloud-records').hidden=false;}catch(e){message(e.message||'Could not sign in');await admin().auth.signOut({scope:'local'});}finally{$('#cloud-password').value='';button.disabled=false;}};
 $('#cloud-refresh').onclick=()=>roster().catch(e=>message(e.message));$('#cloud-class-filter').onchange=()=>{recordPage=0;roster().catch(e=>message(e.message));};
 $('#cloud-record-prev').onclick=()=>{recordPage=Math.max(0,recordPage-1);roster().catch(e=>message(e.message));};$('#cloud-record-next').onclick=()=>{recordPage++;roster().catch(e=>message(e.message));};
 $('#cloud-signout').onclick=async()=>{await admin().auth.signOut({scope:'local'});selected=null;loaded=[];$('#cloud-record-list').replaceChildren();$('#cloud-record-detail').replaceChildren();$('#cloud-records').hidden=true;$('#cloud-login').hidden=false;message('Signed out. Private records cleared from this view.');};
 $('#cloud-dashboard').addEventListener('close',()=>$('#cloud-password').value='');
 return {start,capture,record,setEvidence,stop,retry,flush:()=>drain(true),getStatus:()=>({sessionId:active?.id||null,lastSynced,error:lastError||null})};
})();
