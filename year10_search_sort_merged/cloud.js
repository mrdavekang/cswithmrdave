/* Lesson-only drafts, learning evidence and student live-discussion calls; no pupil accounts.
   Records short-paused drafts, not individual keystrokes or other browser tabs. */
window.SearchRecords=(()=>{
 'use strict';
 const cfg=window.SEARCH_CONFIG,uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 const stamp=()=>new Date().toISOString(),copy=v=>JSON.parse(JSON.stringify(v)),bytes=v=>new TextEncoder().encode(JSON.stringify(v)).length;
 let dbPromise,active=null,preview=false,busy=false,timer,retryAt=0,error='',generation=0,writes=Promise.resolve();
 const drafts=new Map(),failedWrites=[],writer=crypto.randomUUID(),supported=new Set(['join','resume','page_state','attempt','run','test','navigate','support','evidence','export','restore','console_input','complete']);
 const el=id=>document.getElementById(id);
 function status(message,bad=false){const e=el('connection');if(e){e.textContent=message;e.dataset.problem=String(bad);if(!bad){e.removeAttribute('title');e.removeAttribute('aria-label');}}if(el('sync-retry'))el('sync-retry').hidden=!bad;}
 function fail(e){error=String(e?.message||e);status('School save paused · local work kept',true);const field=el('connection');if(field){field.title='Save detail: '+error;field.setAttribute('aria-label','School save paused. Local work kept. '+error);}if(el('sync-retry'))el('sync-retry').title=error;}
 function database(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('tenby-y10-search-sort-traces',1);r.onupgradeneeded=()=>{r.result.createObjectStore('profiles',{keyPath:'id'});r.result.createObjectStore('events',{keyPath:'event_id'});r.result.createObjectStore('images',{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return dbPromise;}
 async function read(store,id){const db=await database();return new Promise((resolve,reject)=>{const q=db.transaction(store).objectStore(store);const r=id===undefined?q.getAll():q.get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
 async function put(store,item){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction(store,'readwrite');t.objectStore(store).put(item);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Local outbox stopped'));});}
 async function change(id,fn){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction('profiles','readwrite'),s=t.objectStore('profiles'),q=s.get(id);q.onsuccess=()=>{if(q.result)s.put(fn(q.result));};t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Local outbox stopped'));});}
 async function remove(store,ids){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction(store,'readwrite');for(const id of ids)t.objectStore(store).delete(id);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
 function queue(fn){writes=writes.catch(()=>{}).then(fn).catch(e=>{failedWrites.push(fn);fail(e);});return writes;}
 async function rpc(name,args){const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),12000);try{const r=await fetch(cfg.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:cfg.key,'Content-Type':'application/json'},body:JSON.stringify(args),signal:abort.signal});const d=await r.json();if(!r.ok)throw Error(d.code==='PGRST202'?'School saving setup needs attention. Tell your teacher.':d.message||'School saving failed');return d;}finally{clearTimeout(timeout);}}
 function schedule(ms=1200){if(!timer)timer=setTimeout(()=>{timer=null;drain().catch(fail);},ms);}
 async function refreshStatus(){if(preview){status('Teacher preview · not recorded');return;}if(!active){status('School save starts after entry');return;}const id=active.id,p=await read('profiles',id),events=(await read('events')).filter(x=>x.session_id===id),images=(await read('images')).filter(x=>x.session_id===id);if(active?.id!==id)return;if(!navigator.onLine){status('Offline · changes queued here',true);return;}if(error){fail(error);return;}status(events.length||images.length||p?.needsSnapshot?'School save pending…':p?.syncedAt?'Saved to school · '+new Date(p.syncedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'Connecting to school…');}
 async function start(n){
  const gen=++generation;active=null;preview=n.role==='preview';if(preview){status('Teacher preview · not recorded');return;}
  try{
   if(!uuid.test(n.trackingId||''))n.trackingId=crypto.randomUUID();let p=await read('profiles',n.trackingId);
   if(!p||p.name!==n.name||p.className!==n.className){n.trackingId=crypto.randomUUID();const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');p={id:n.trackingId,token,name:n.name,className:n.className,joined:false};await put('profiles',p);}
   if(gen!==generation)return;active={id:p.id,notebook:n};error='';record(p.joined?'resume':'join',null,{contentRevision:SEARCH_LESSON.contentRevision});capture(n);captureImages(n);schedule(20);await refreshStatus();
  }catch(e){fail(e);}
 }
 function capture(n){if(!active||active.notebook!==n||preview)return;const id=active.id,snapshot=copy({...n,images:[]}),v=crypto.randomUUID(),at=stamp();
  // Individual runs remain in events if a large latest snapshot is compacted.
  if(bytes(snapshot)>3500000)for(const w of Object.values(snapshot.workspaces)){w.runCount=w.runs.length;w.runs=w.runs.slice(-3);}
  queue(()=>change(id,p=>({...p,snapshot,snapshotAt:at,snapshotVersion:v,needsSnapshot:true}))).then(()=>{schedule();refreshStatus().catch(fail);});
 }
 function record(kind,pageId,data={},field=null){if(!active||preview||!supported.has(kind))return;const id=active.id,key=field?id+':'+pageId+':'+field:null,old=key?drafts.get(key):null;
  const e={event_id:old?.event_id||crypto.randomUUID(),session_id:id,writer_id:writer,kind,page_id:pageId||null,client_at:stamp(),data:copy(data),readyAt:Date.now()+(field?900:0),draftKey:key};if(key)drafts.set(key,e);
  queue(()=>put('events',e)).then(()=>{schedule();refreshStatus().catch(fail);});
 }
 function captureImages(n){if(!active||active.notebook!==n||preview)return;const session_id=active.id;
  for(const im of n.images){if(!uuid.test(im.id||''))im.id=crypto.randomUUID();const image=copy({...im,session_id});queue(async()=>{const p=await read('profiles',session_id);if(!(p.imageIds||[]).includes(image.id)&&!await read('images',image.id))await put('images',image);}).then(()=>schedule());}
 }
 async function drain(force=false){
  if(busy||!cfg?.url||!navigator.onLine||(!force&&Date.now()<retryAt))return;busy=true;
  try{await writes;if(failedWrites.length)throw Error('Local save queue needs retry. Keep this page open.');for(const saved of await read('profiles')){
   let p=await read('profiles',saved.id);const identity=SearchCore.entryCheck(p.name,p.className);
   // Preserve legacy invalid local notebooks, but never let one block another pupil's valid save.
   if(!identity.nameValid||!identity.classValid){if(p.id===active?.id)throw Error('Check your name and Year 10 class. Use a class such as 10E or 10T.');continue;}
   const images=(await read('images')).filter(i=>i.session_id===p.id);const events=(await read('events')).filter(e=>e.session_id===p.id&&(force||e.readyAt<=Date.now())).sort((a,b)=>a.client_at.localeCompare(b.client_at));
   if(!events.length&&!images.length&&!p.needsSnapshot)continue;
   const batch=[];let size=0;for(const e of events){if(batch.length===40||size+bytes(e)>1800000)break;batch.push(e);size+=bytes(e);}
   // New edits get new IDs while these drafts are in flight; acknowledgements
   // therefore cannot delete a later edit made during a slow save.
   for(const e of batch)if(e.draftKey&&drafts.get(e.draftKey)?.event_id===e.event_id)drafts.delete(e.draftKey);
   if(!p.joined){await rpc('y10_search_sort_records_join',{p_session_id:p.id,p_token:p.token,p_name:p.name,p_class_name:p.className});await change(p.id,x=>({...x,joined:true}));p=await read('profiles',p.id);}
   const result=await rpc('y10_search_sort_records_save',{p_session_id:p.id,p_token:p.token,p_events:batch.map(({event_id,writer_id,kind,page_id,client_at,data})=>({event_id,writer_id,kind,page_id,client_at,data})),p_snapshot:p.needsSnapshot?p.snapshot:null,p_snapshot_at:p.needsSnapshot?p.snapshotAt:null});
   await remove('events',batch.map(e=>e.event_id));await change(p.id,x=>({...x,needsSnapshot:x.snapshotVersion===p.snapshotVersion?false:x.needsSnapshot,syncedAt:result.server_now}));
   for(const im of images){await rpc('y10_search_sort_records_image_save',{p_session_id:p.id,p_token:p.token,p_image:{id:im.id,pageId:im.pageId,name:im.name,data:im.data,at:im.at}});await change(p.id,x=>({...x,imageIds:[...new Set([...(x.imageIds||[]),im.id])]}));await remove('images',[im.id]);}
  }error='';retryAt=0;await refreshStatus();}
  catch(e){retryAt=Date.now()+10000;fail(e);}finally{busy=false;}
 }
 async function flush(){await writes;await drain(true);}
 function retry(){error='';retryAt=0;for(const fn of failedWrites.splice(0))queue(fn);flush().catch(fail);}
 function stop(){generation++;active=null;preview=false;drafts.clear();schedule(20);status('School save starts after entry');}
 window.addEventListener('online',retry);window.addEventListener('pagehide',()=>{for(const e of drafts.values())queue(()=>put('events',{...e,readyAt:0}));});
 setInterval(()=>drain().catch(fail),5000);el('sync-retry').onclick=retry;
 async function liveCall(name,args={}){if(!active||preview)throw Error('Live discussion requires a student session.');await flush();const p=await read('profiles',active.id);if(!p?.joined)throw Error('Waiting for school connection.');return rpc(name,{...args,p_session_id:p.id,p_token:p.token});}
 return Object.freeze({start,stop,capture,captureImages,record,flush,retry,liveCall,getStatus:()=>({sessionId:active?.id||null,error:error||null})});
})();

