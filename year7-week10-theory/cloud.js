/* Pupil transport: no Auth session, no teacher JWT, private device capabilities. */
window.BinaryCloud=(()=>{
  'use strict';
  const cfg=window.BINARY_CLOUD_CONFIG,C=window.BinaryTrackingCore,L=window.ARCADE;
  let active=null,hooks={},generation=0,timer=null,busy=false,retryTimer=null,retries=0,connecting=null;
  let label={kind:'idle',en:'School save starts after entry',zh:'填写姓名班级后开始学校保存'};
  const enabled=()=>cfg.enabled&&(location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname));
  const stamp=()=>new Date().toISOString();
  const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');
  function status(){return label;}
  function say(en,zh,kind='pending'){label={en,zh,kind};hooks.status?.(label);}
  function persist(){if(hooks.persist?.()===false)throw Error('Device storage is unavailable. Keep a backup; school saving is paused.');}
  async function rpc(name,args){
    const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),10000);
    try{const response=await fetch(cfg.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(args),credentials:'omit',referrerPolicy:'no-referrer',signal:abort.signal});
      const data=await response.json();if(!response.ok)throw Object.assign(Error(data.message||'School saving is unavailable.'),{code:data.code,status:response.status});return data;
    }finally{clearTimeout(timeout);}
  }
  function schedule(ms=cfg.debounceMs){clearTimeout(timer);timer=setTimeout(()=>flush().catch(fail),ms);}
  function fail(error){
    if(error?.code==='PT409'){if(active?.cloud)active.cloud.conflict=true;say('A newer class copy exists · keep a backup, then load it','学校已有较新副本，请先备份，再载入','conflict');return;}
    if(['42501','22023','54000','PGRST202'].includes(error?.code)){if(active?.cloud)active.cloud.blocked=true;say(error.code==='PGRST202'?'School saving is not ready · device work is kept':'School save paused · keep a backup and tell your teacher','学校保存暂停，设备副本仍保留，请备份并告诉老师','error');return;}
    say(navigator.onLine?'Connection interrupted · device work is kept; retrying':'Offline · work stays here until reconnecting','连接中断或离线，作品仍保存在本设备','offline');
    clearTimeout(retryTimer);retryTimer=setTimeout(()=>flush().catch(fail),Math.min(60000,3000*2**Math.min(retries++,4)));
  }
  function changed(s){
    if(s!==active||!s.cloud||s.cloud.conflict||!enabled())return;
    try{const p=C.payload(s,L);s.cloud.dirty=C.signature(p)!==s.cloud.lastAckSignature;s.cloud.localSequence=(s.cloud.localSequence||0)+1;persist();
      if(s.cloud.dirty){say(navigator.onLine?'Saved here · waiting to save to teacher':'Offline · saved here, waiting for internet','已保存在设备，等待保存给老师',navigator.onLine?'pending':'offline');schedule();}
    }catch(e){say(e.message,'设备保存暂不可用，请下载备份','error');}
  }
  const mapKind=type=>({'answer':'answer','check':'check','hint-opened':'hint','model-step':'model','external-link':'game','navigate':'navigate','restore':'restore'}[type]);
  function event(type,value){
    if(!active?.cloud||!enabled())return;const kind=mapKind(type);if(!kind)return;
    const data=C.object(value)?C.copy(value):{value};if(new TextEncoder().encode(JSON.stringify(data)).length>8000)return;
    const c=active.cloud;c.queue=c.queue||[];
    if(c.queue.length>=500){say('Many changes are waiting · keep a backup and reconnect','有较多更改等待保存，请备份并重新连接','error');return;}
    c.queue.push({event_id:crypto.randomUUID(),kind,card_id:L.cards[active.p].id,client_at:stamp(),data});
    try{persist();schedule(kind==='check'?150:cfg.debounceMs);}catch(e){c.blocked=true;say(e.message,'设备保存暂不可用，请下载备份','error');}
  }
  function validCloud(c){return C.object(c)&&C.uuid(c.id)&&C.key(c.token)&&Number.isSafeInteger(c.revision)&&c.revision>=0;}
  async function attach(s,callbacks){
    generation++;const gen=generation;clearTimeout(timer);clearTimeout(retryTimer);active=s;hooks=callbacks;retries=0;connecting=null;
    if(!enabled()){say('Local file · use the public lesson for school saving','本地文件，请用公开课程链接进行学校保存','local');return;}
    if(!s?.identity?.name||s.identity.name.toLowerCase()==='teacher'){say('Pupil saving is not active','学生保存未启用','local');return;}
    if(!validCloud(s.cloud))s.cloud={id:crypto.randomUUID(),token:token(),revision:0,queue:[],registered:false,dirty:true,lastAckSignature:''};
    if(!Array.isArray(s.cloud.queue))s.cloud.queue=[];s.cloud.blocked=false;
    try{persist();}catch(e){say(e.message,'无法在设备中保留私密保存密钥，请先下载备份','error');return;}
    say('Connecting to school saving…','正在连接学校保存…');
    connecting=(async()=>{
      try{const c=s.cloud,joined=await rpc('y7_binary_join',{p_id:c.id,p_token:c.token,p_name:s.identity.name,p_class:s.identity.cls});if(gen!==generation)return;
        c.registered=true;
        if(c.pending){const b=c.pending,ack=await rpc('y7_binary_save',{p_id:c.id,p_token:c.token,p_expected:b.expected,p_write_id:b.id,p_snapshot:b.snapshot,p_events:b.events});if(gen!==generation)return;acknowledge(s,b,ack);if(Number(ack.current_revision||joined.revision)>c.revision){c.conflict=true;persist();fail({code:'PT409'});return;}}
        else if(c.revision!==joined.revision){c.conflict=true;persist();fail({code:'PT409'});return;}
        c.conflict=false;persist();changed(s);if(!c.dirty&&!c.queue.length)say('Saved to teacher','已保存给老师','saved');
      }catch(e){if(gen===generation)fail(e);}finally{if(gen===generation)connecting=null;}
    })();await connecting;
  }
  function acknowledge(s,b,result){
    const c=s.cloud;c.revision=Number(result.revision);c.queue=(c.queue||[]).filter(e=>!b.events.some(sent=>sent.event_id===e.event_id));c.pending=null;c.lastAckSignature=C.signature(b.snapshot);c.syncedAt=result.server_now;c.dirty=C.signature(C.payload(s,L))!==c.lastAckSignature;persist();
  }
  async function flush(){
    clearTimeout(timer);if(!active||!enabled()||!validCloud(active.cloud)||!navigator.onLine)return false;
    if(connecting)await connecting;const s=active;if(!s||s.cloud.conflict||s.cloud.blocked||busy)return false;
    if(!s.cloud.registered){await attach(s,hooks);return false;}
    const c=s.cloud;if(!c.dirty&&!c.pending&&!c.queue.length)return true;
    busy=true;const gen=generation;
    try{
      if(!c.pending){const snapshot=C.payload(s,L),events=c.queue.slice(0,39);
        // Capture the draft visible at the save boundary, not every keystroke.
        events.push({event_id:crypto.randomUUID(),kind:'draft',card_id:snapshot.currentId,client_at:stamp(),data:{answer:snapshot.records[snapshot.currentId]?.answer||'',checked:snapshot.records[snapshot.currentId]?.checked===true}});
        c.pending={id:crypto.randomUUID(),expected:c.revision,snapshot,events};persist();}
      const b=c.pending;say('Saving to teacher…','正在保存给老师…');
      const result=await rpc('y7_binary_save',{p_id:c.id,p_token:c.token,p_expected:b.expected,p_write_id:b.id,p_snapshot:b.snapshot,p_events:b.events});
      if(gen!==generation)return false;acknowledge(s,b,result);retries=0;
      if(Number(result.current_revision||result.revision)>c.revision){c.conflict=true;persist();fail({code:'PT409'});return false;}
      say(c.dirty||c.queue.length?'Saved here · newer changes waiting':'Saved to teacher · '+new Date(result.server_now).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),c.dirty||c.queue.length?'设备有更新的更改等待保存':'已保存给老师',c.dirty||c.queue.length?'pending':'saved');
      if(c.dirty||c.queue.length)schedule(300);return true;
    }catch(e){if(gen===generation)fail(e);return false;}finally{busy=false;}
  }
  async function retry(){if(!active)return;active.cloud.conflict=false;clearTimeout(retryTimer);retries=0;await attach(active,hooks);await flush();}
  async function loadSaved(){
    if(!active)return;const s=active,c=s.cloud,remote=await rpc('y7_binary_load',{p_id:c.id,p_token:c.token});
    if(!confirm('Replace this tab’s work with your teacher-saved copy? Download a JSON backup first if you want to keep the current version. / 用学校保存的副本替换当前作品？如需保留当前版本，请先下载JSON备份。'))return;
    c.revision=Number(remote.revision);c.queue=[];c.pending=null;c.conflict=false;c.lastAckSignature=C.signature(remote.snapshot);c.dirty=false;c.syncedAt=remote.updated;
    hooks.remote?.(remote.snapshot,c);say('Saved class copy loaded','已载入学校保存的副本','saved');
  }
  function detach(){generation++;clearTimeout(timer);clearTimeout(retryTimer);active=null;hooks={};connecting=null;label={kind:'idle',en:'School save starts after entry',zh:'填写姓名班级后开始学校保存'};}
  async function ping(){if(active?.cloud?.registered&&!document.hidden&&navigator.onLine&&!active.cloud.conflict)try{await rpc('y7_binary_ping',{p_id:active.cloud.id,p_token:active.cloud.token});}catch{}}
  window.addEventListener('online',()=>retry().catch(fail));
  window.addEventListener('offline',()=>{if(active)say('Offline · your device copy is safe','离线，设备副本仍保留','offline');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)flush().catch(fail);});
  setInterval(()=>{if(active&&!busy)flush().catch(fail);},10000);setInterval(ping,30000);
  return Object.freeze({attach,changed,event,flush,retry,loadSaved,detach,status,validCloud});
})();
