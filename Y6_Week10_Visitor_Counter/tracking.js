/* Lesson-only school saving. Private record keys stay in IndexedDB, never backups. */
window.CounterTracking=(()=>{'use strict';
 const cfg=window.COUNTER_LIVE_CONFIG,E=window.CounterEvidence,L=window.CounterLesson;
 const liveProtocol=location.protocol==='https:'||['127.0.0.1','localhost'].includes(location.hostname),stamp=()=>new Date().toISOString(),copy=x=>JSON.parse(JSON.stringify(x));
 let dbPromise,active=null,chain=Promise.resolve(),busy=false,timer,error='',conflict=false,retryAt=0,retryCount=0,localError=false,restoreHandler=null;
 const drafts=new Map();
 const words=(en,zh,ko)=>{const v=document.querySelector('[data-setting="lang"]')?.value;return en+(v==='zh'&&zh?' / '+zh:v==='ko'&&ko?' / '+ko:'');};
 function status(text,bad=false){const el=document.getElementById('school-save');if(el){el.textContent=text;el.dataset.problem=String(bad);}for(const id of ['sync-retry','cloud-restore']){const b=document.getElementById(id);if(b)b.hidden=id==='cloud-restore'?!conflict:!bad;}}
 function fail(err){error=err?.code==='PGRST202'?'School saving is not ready. Tell your teacher.':err?.code==='PT409'?'Another tab saved newer work. Back up, then restore the school copy.':err?.message||'Connection interrupted';if(err?.code==='PT409')conflict=true;status(words('School save paused — your device copy is kept','学校保存已暂停，设备副本仍保留','학교 저장이 잠시 멈췄어요. 기기 기록은 보관돼요.'),true);}
 function db(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('tenby-y6-week10-live',1);r.onupgradeneeded=()=>{r.result.createObjectStore('profiles',{keyPath:'id'});r.result.createObjectStore('events',{keyPath:'event_id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return dbPromise;}
 async function read(store,id){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store),r=id===undefined?t.objectStore(store).getAll():t.objectStore(store).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
 async function put(store,item){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).put(item);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
 async function alter(id,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('profiles','readwrite'),st=t.objectStore('profiles'),r=st.get(id);r.onsuccess=()=>{if(r.result)st.put(fn(r.result));};t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
 async function removeEvents(ids){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('events','readwrite');for(const id of ids)t.objectStore('events').delete(id);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
 function queue(fn){chain=chain.then(fn).catch(err=>{localError=true;fail(err);});return chain;}
 async function rpc(name,args){const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),12000);try{const r=await fetch(cfg.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(args),signal:abort.signal});const data=await r.json();if(!r.ok)throw Object.assign(Error(data.message||'School saving failed'),{code:data.code});return data;}finally{clearTimeout(timeout);}}
 function identify(s){if(!s.started||s.profile.name.trim().toLowerCase()==='teacher'||!liveProtocol){active=null;return false;}if(!s.profile.name.trim()||!s.profile.className.trim())return false;if(!E.uuid(s.liveId))s.liveId=crypto.randomUUID();if(active?.id!==s.liveId){error='';conflict=false;retryAt=0;retryCount=0;localError=false;}active={id:s.liveId,name:s.profile.name,form:s.profile.className};return true;}
 function schedule(ms=1400){clearTimeout(timer);timer=setTimeout(()=>drain().catch(fail),ms);}
 function capture(s){if(!identify(s))return;const id=s.liveId,payload=E.payload(s,L.cards),at=stamp(),version=crypto.randomUUID(),action=copy(s.events.at(-1)||{}),actionKey=JSON.stringify(action);
  queue(async()=>{let p=await read('profiles',id);if(!p){const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');p={id,token,name:payload.profile.name,form:payload.profile.className,joined:false,revision:0};await put('profiles',p);}
   if(p.name!==payload.profile.name||p.form!==payload.profile.className)throw Error('This record has another name. Back up and start a new learner record.');
   const changed=E.diff(p.latest,payload),moved=p.latest?.page!==payload.page,newAction=p.actionKey!==actionKey;
   if(!Object.keys(changed).length&&!moved&&!newAction)return;
   status(words('Waiting to save to your teacher…','等待保存给老师……','선생님께 저장하는 중…'));
   const allowed=['choice','response','check','support','support-clear','export','restore','help-skip','continue','picture','mode','language','open','report','start','download'];
   const kind=!p.latest?'join':moved?'navigate':newAction&&allowed.includes(action.type)?action.type:'update';
   const data={...changed,...(moved?{from:p.latest?.page||null,to:payload.page}:{}),...(newAction?{action}:{} )};
   const key=id+':'+payload.page,old=kind==='update'?drafts.get(key):null,event_id=old||crypto.randomUUID();if(kind==='update')drafts.set(key,event_id);
   const prior=old?await read('events',old):null;
   const ev={event_id,record_id:id,kind,page_id:payload.page,client_at:at,data:kind==='update'?E.merge(prior?.data,data):data,readyAt:Date.now()+(kind==='update'?1000:0),draftKey:kind==='update'?key:null};
   await put('events',ev);await alter(id,x=>({...x,latest:payload,actionKey,version,needsSave:true}));
  }).then(()=>{schedule(1400);refresh().catch(fail);});
 }
 async function refresh(){if(!liveProtocol){status(words('Local copy — use the public lesson for school saving','本地副本：使用公开网址才能保存到学校','로컬 기록이에요. 학교 저장은 공개 수업 주소를 사용해요.'));return;}
  if(!active){status(words('School saving starts when you enter the lesson','进入课程后开始学校保存','수업에 들어가면 학교 저장을 시작해요.'));return;}
  const p=await read('profiles',active.id);if(p?.blocked){conflict=true;fail({code:'PT409'});return;}if(error||conflict||localError){fail({message:error,code:conflict?'PT409':null});return;}
  if(!navigator.onLine){status(words('Offline — saved here; school save will retry','离线：保存在本机，稍后重试学校保存','오프라인이에요. 기기에 보관하고 학교 저장을 다시 시도해요.'),true);return;}
  status(p?.needsSave||p?.pending?words('Waiting to save to your teacher…','等待保存给老师……','선생님께 저장하는 중…'):p?.syncedAt?words('Saved to school at '+new Date(p.syncedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}),'已保存到学校','학교에 저장됨'):words('Connecting to school…','正在连接学校……','학교에 연결하는 중…'));
 }
 async function drain(){if(busy||!liveProtocol||!navigator.onLine||Date.now()<retryAt||localError)return;busy=true;try{await chain;
  for(const old of await read('profiles')){let p=await read('profiles',old.id);if(p.blocked)continue;
   const due=(await read('events')).filter(e=>e.record_id===p.id&&e.readyAt<=Date.now()).sort((a,b)=>a.client_at.localeCompare(b.client_at));if(!p.pending&&!due.length)continue;
   if(!p.joined){const joined=await rpc('y6w10_join',{p_record_id:p.id,p_token:p.token,p_name:p.name,p_class:p.form});if(joined.revision!==p.revision){await alter(p.id,x=>({...x,joined:true,blocked:true}));if(active?.id!==p.id)continue;throw Object.assign(Error('Another tab saved newer work'),{code:'PT409'});}await alter(p.id,x=>({...x,joined:true}));p=await read('profiles',p.id);}
   if(!p.pending){let bytes=0;const events=[];for(const ev of due){const size=new TextEncoder().encode(JSON.stringify(ev.data)).length;if(size>100000)throw Error('A response is too large for school saving. Download your backup and tell your teacher.');if(events.length>=40||bytes+size>180000)break;events.push(ev);bytes+=size;}
    for(const ev of events)if(ev.draftKey&&drafts.get(ev.draftKey)===ev.event_id)drafts.delete(ev.draftKey);
    const pending={writeId:crypto.randomUUID(),expected:p.revision,version:p.version,snapshot:copy(p.latest),events:events.map(({event_id,kind,page_id,client_at,data})=>({event_id,kind,page_id,client_at,data}))};await alter(p.id,x=>({...x,pending}));p=await read('profiles',p.id);
   }
   const b=p.pending;let result;try{result=await rpc('y6w10_save',{p_record_id:p.id,p_token:p.token,p_expected_revision:b.expected,p_write_id:b.writeId,p_snapshot:b.snapshot,p_events:b.events});}catch(e){if(e.code==='PT409'){await alter(p.id,x=>({...x,blocked:true}));if(active?.id!==p.id)continue;}throw e;}
   await removeEvents(b.events.map(e=>e.event_id));await alter(p.id,x=>({...x,revision:result.revision,pending:null,needsSave:x.version!==b.version,syncedAt:result.server_now}));
  }error='';retryAt=0;retryCount=0;await refresh();
 }catch(e){retryCount++;retryAt=Date.now()+Math.min(60000,10000*2**Math.min(3,retryCount-1));fail(e);}finally{busy=false;}}
 async function retry(s){error='';retryAt=0;retryCount=0;localError=false;if(s)capture(s);await chain;await drain();await refresh();}
 async function flush(){clearTimeout(timer);await chain;await drain();}
 async function restoreSaved(){if(!active)return;const id=active.id,p=await read('profiles',id);if(!p)return;const cloud=await rpc('y6w10_load',{p_record_id:id,p_token:p.token});if(!cloud.snapshot?.started)throw Error('No saved school copy yet. Keep your local backup.');
  if(!confirm(words('Replace this tab’s work with the school-saved copy? Download a JSON backup first if you want to keep this version.','用学校副本替换本页？需要保留当前版本请先下载 JSON 备份。','이 탭을 학교 기록으로 바꿀까요? 현재 기록을 지키려면 먼저 JSON 백업을 받으세요.')))return;
  await removeEvents((await read('events')).filter(e=>e.record_id===id).map(e=>e.event_id));await alter(id,x=>({...x,latest:cloud.snapshot,revision:cloud.revision,pending:null,needsSave:false,blocked:false,syncedAt:cloud.updated}));conflict=false;error='';localError=false;restoreHandler?.({...cloud.snapshot,liveId:id});await refresh();
 }
 async function ping(){if(!active||document.hidden||!navigator.onLine||error)return;const p=await read('profiles',active.id);if(p?.joined)await rpc('y6w10_ping',{p_record_id:p.id,p_token:p.token});}
 function stop(){active=null;refresh().catch(fail);schedule(20);}
 window.addEventListener('online',()=>retry().catch(fail));window.addEventListener('pagehide',()=>{flush().catch(()=>{});});setInterval(()=>drain().catch(fail),5000);setInterval(()=>ping().catch(()=>{}),30000);
 return Object.freeze({capture,refresh,retry,restoreSaved,flush,stop,onRestore(fn){restoreHandler=fn;},details:()=>({error,conflict,active:!!active})});
})();
