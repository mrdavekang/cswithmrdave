/* Lesson responses only. Durable local outbox, private per-record keys, bounded retries. */
window.DecisionTracking=(()=>{'use strict';
const cfg=window.DECISION_LIVE_CONFIG,E=window.DecisionEvidence;
let databasePromise,active=null,chain=Promise.resolve(),busy=false,timer,error='',conflict=false,retryAt=0,retryCount=0,localError=false,restoreHandler=null;
const drafts=new Map(),liveProtocol=location.protocol==='https:'||['127.0.0.1','localhost'].includes(location.hostname),stamp=()=>new Date().toISOString(),copy=x=>JSON.parse(JSON.stringify(x));
function words(en,zh){return document.querySelector('#language')?.value==='bi'?en+' / '+zh:en;}
function status(text,bad=false){const el=document.querySelector('#school-save');if(el){el.textContent=text;el.dataset.problem=String(bad);}for(const id of ['sync-retry','cloud-restore']){const b=document.getElementById(id);if(b)b.hidden=id==='cloud-restore'?!conflict:!bad;}}
function fail(err){error=err?.code==='PGRST202'?'School saving is not ready. Tell your teacher.':err?.code==='PT409'?'Another tab saved newer work. Download a backup, then restore the saved copy.':err?.message||'Connection interrupted';if(err?.code==='PT409')conflict=true;status(words('School save paused · your device copy is kept','学校保存暂停，设备副本仍保留'),true);}
function db(){if(!databasePromise)databasePromise=new Promise((resolve,reject)=>{const r=indexedDB.open('tenby-y9-app-decisions-live',1);r.onupgradeneeded=()=>{r.result.createObjectStore('profiles',{keyPath:'id'});r.result.createObjectStore('events',{keyPath:'event_id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return databasePromise;}
async function read(store,id){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store),r=id===undefined?t.objectStore(store).getAll():t.objectStore(store).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function put(store,item){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).put(item);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
async function alter(id,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('profiles','readwrite'),st=t.objectStore('profiles'),r=st.get(id);r.onsuccess=()=>{if(r.result)st.put(fn(r.result));};t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
async function removeEvents(ids){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('events','readwrite');for(const id of ids)t.objectStore('events').delete(id);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
function queue(fn){chain=chain.then(fn).catch(err=>{localError=true;fail(err);});return chain;}
async function rpc(name,args){const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),12000);try{const r=await fetch(cfg.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(args),signal:abort.signal});const data=await r.json();if(!r.ok)throw Object.assign(Error(data.message||'School saving failed'),{code:data.code});return data;}finally{clearTimeout(timeout);}}
function identify(s){if(!s.joined||!liveProtocol||!s.student.name.trim()||!['9E','9T'].includes(s.student.form))return;if(!E.uuid(s.trackingId))s.trackingId=crypto.randomUUID();if(active?.id!==s.trackingId){error='';conflict=false;retryAt=0;retryCount=0;}active={id:s.trackingId,name:s.student.name,form:s.student.form};}
function schedule(ms=1400){clearTimeout(timer);timer=setTimeout(()=>drain().catch(fail),ms);}
function capture(s,kind='update',data={}){
 if(!liveProtocol||!s.joined||!E.uuid(s.trackingId)||!active||active.id!==s.trackingId)return;
 const id=s.trackingId,payload=E.payload(s),at=stamp(),version=crypto.randomUUID();status(words('Waiting to save to teacher…','等待保存给老师…'));
 queue(async()=>{let p=await read('profiles',id);if(!p){const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');p={id,token,name:s.student.name,form:s.student.form,joined:false,revision:0};await put('profiles',p);}
  if(p.name!==payload.student.name||p.form!==payload.student.form)throw Error('The record belongs to another name. Start a new learner record.');
  const changed=E.diff(p.latest,payload),moved=p.latest?.slide!==payload.slide;
  if(!Object.keys(changed).length&&!moved&&kind==='update')return;
  const eventKind=!p.latest?'join':kind==='update'&&moved?'navigate':kind;
  const eventData=eventKind==='navigate'?{from:p.latest?.slide||null,to:payload.slide,...changed}:eventKind==='update'?changed:{...data,...changed};
  const key=id+':'+payload.slide,old=eventKind==='update'?drafts.get(key):null,event_id=old||crypto.randomUUID();if(eventKind==='update')drafts.set(key,event_id);
  const prior=old?await read('events',old):null;const mergedData=eventKind==='update'?E.mergeDraft(prior?.data,eventData):eventData;
  const ev={event_id,record_id:id,kind:eventKind,page_id:payload.slide,client_at:at,data:mergedData,readyAt:Date.now()+(eventKind==='update'?1000:0),draftKey:eventKind==='update'?key:null};
  await put('events',ev);await alter(id,x=>({...x,latest:payload,version,needsSave:true}));
 }).then(()=>{schedule(kind==='update'?1400:80);refresh().catch(fail);});
}
async function refresh(){if(!liveProtocol){status(words('Local copy · open the public lesson for live saving','本地副本，请打开公开课程网址进行学校保存'));return;}if(!active){status(words('School save starts after entry','填写姓名班级后开始学校保存'));return;}const p=await read('profiles',active.id);if(p?.blocked){conflict=true;fail({code:'PT409',message:'Another tab saved newer work.'});return;}if(error||conflict||localError){fail({message:error,code:conflict?'PT409':null});return;}if(!navigator.onLine){status(words('Offline · work kept here until reconnecting','离线，作品保留在此设备，连接后再保存'),true);return;}status(words(p?.needsSave||p?.pending?'Waiting to save to teacher…':p?.syncedAt?'Saved to teacher · '+new Date(p.syncedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'Connecting to school…',p?.needsSave||p?.pending?'等待保存给老师…':p?.syncedAt?'已保存给老师':'正在连接学校…'));}
async function drain(){
 if(busy||!liveProtocol||!navigator.onLine||Date.now()<retryAt||localError)return;busy=true;
 try{await chain;for(const old of await read('profiles')){
  let p=await read('profiles',old.id);if(p.blocked)continue;
  const due=(await read('events')).filter(e=>e.record_id===p.id&&e.readyAt<=Date.now()).sort((a,b)=>a.client_at.localeCompare(b.client_at));
  if(!p.pending&&due.length===0)continue;
  if(!p.joined){const joined=await rpc('y9_decisions_join',{p_record_id:p.id,p_token:p.token,p_name:p.name,p_class:p.form});if(joined.revision!==p.revision){await alter(p.id,x=>({...x,joined:true,blocked:true}));if(active?.id!==p.id)continue;throw Object.assign(Error('Newer work is already saved.'),{code:'PT409'});}await alter(p.id,x=>({...x,joined:true}));p=await read('profiles',p.id);}
  if(!p.pending){const events=due.slice(0,40);for(const ev of events)if(ev.draftKey&&drafts.get(ev.draftKey)===ev.event_id)drafts.delete(ev.draftKey);const pending={writeId:crypto.randomUUID(),expected:p.revision,version:p.version,snapshot:copy(p.latest),events:events.map(({event_id,kind,page_id,client_at,data})=>({event_id,kind,page_id,client_at,data}))};await alter(p.id,x=>({...x,pending}));p=await read('profiles',p.id);}
  const b=p.pending;let result;try{result=await rpc('y9_decisions_save',{p_record_id:p.id,p_token:p.token,p_expected_revision:b.expected,p_write_id:b.writeId,p_snapshot:b.snapshot,p_events:b.events});}catch(e){if(e.code==='PT409'){await alter(p.id,x=>({...x,blocked:true}));if(active?.id!==p.id)continue;}throw e;}
  await removeEvents(b.events.map(e=>e.event_id));await alter(p.id,x=>({...x,revision:result.revision,pending:null,needsSave:x.version!==b.version,syncedAt:result.server_now}));
 }
 error='';retryAt=0;retryCount=0;await refresh();
 }catch(e){retryCount++;retryAt=Date.now()+Math.min(60000,10000*2**Math.min(3,retryCount-1));fail(e);}finally{busy=false;}
}
async function retry(s){error='';retryAt=0;retryCount=0;localError=false;if(s){identify(s);capture(s);}await chain;await drain();await refresh();}
function stop(){active=null;refresh().catch(fail);schedule(20);}
async function flush(){clearTimeout(timer);await chain;await drain();}
async function restoreSaved(){if(!active)return;const p=await read('profiles',active.id);if(!p)return;const cloud=await rpc('y9_decisions_load',{p_record_id:p.id,p_token:p.token});if(!confirm(words('Replace this tab’s work with the teacher-saved copy? Download a backup first if you need to keep this version.','用已保存给老师的副本替换此页面？如需保留当前作品，请先下载备份。')))return;
 await removeEvents((await read('events')).filter(e=>e.record_id===p.id).map(e=>e.event_id));await alter(p.id,x=>({...x,latest:cloud.snapshot,revision:cloud.revision,pending:null,needsSave:false,blocked:false,syncedAt:cloud.updated}));conflict=false;error='';localError=false;restoreHandler?.({...cloud.snapshot,trackingId:p.id});await refresh();}
async function ping(){if(!active||document.hidden||!navigator.onLine||error)return;const id=active.id,p=await read('profiles',id);if(p?.joined)await rpc('y9_decisions_ping',{p_record_id:id,p_token:p.token});}
window.addEventListener('online',()=>retry().catch(fail));window.addEventListener('pagehide',()=>{flush().catch(()=>{});});setInterval(()=>drain().catch(fail),5000);setInterval(()=>ping().catch(()=>{}),30000);
return Object.freeze({identify,capture,refresh,stop,flush,retry,restoreSaved,onRestore(fn){restoreHandler=fn;},details:()=>({error,conflict,active:!!active})});
})();
