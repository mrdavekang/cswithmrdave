"use strict";
(() => {
 const lesson=window.SprintLesson, cfg=window.SPRINT_CONFIG;
 if(!lesson||!cfg?.publishableKey)return;
 let timer, busy=false, failures=0, status="", ids=new Set();
 const tx=(en,zh,ko)=>({en,zh,ko})[lesson.get().lang]||en;
 function show(s){status=s;lesson.status();}
 function schedule(ms=950){
  clearTimeout(timer);
  if(!lesson.get().name||lesson.get().preview)return;
  timer=setTimeout(()=>flush(),ms);
 }
 async function flush(manual=false){
  clearTimeout(timer);
  const d=lesson.get();
  if(!d.name||d.preview||busy)return;
  if(manual)failures=0;
  if(!navigator.onLine){show("Offline · queued on this device");return;}
  const pending=d.events.slice(0,30);
  if(!pending.length&&!manual)return;
  ids=new Set(pending.map(x=>x.id));busy=true;show("Syncing with school…");
  const control=new AbortController(), alarm=setTimeout(()=>control.abort(),9000);
  try{
   const r=await fetch(cfg.supabaseUrl+"/rest/v1/rpc/y8_signal_sprint_save",{
    method:"POST",headers:{apikey:cfg.publishableKey,"Content-Type":"application/json"},
    signal:control.signal,
    body:JSON.stringify({p_id:d.id,p_key:d.token,p_name:d.name,p_client_ms:Date.now(),p_snapshot:lesson.snapshot(),p_events:pending})
   });
   if(!r.ok||await r.json()!==pending.length)throw Error("Update not acknowledged");
   d.events=d.events.filter(e=>!ids.has(e.id));lesson.persist();failures=0;
   show(d.events.length?"Syncing with school…":"School sync up to date");
  }catch{
   failures++;show("School sync interrupted · try Reconnect");
  }finally{
   clearTimeout(alarm);busy=false;ids.clear();
   if(d.events.length)schedule(failures?Math.min(30000,1800*2**failures):250);
  }
 }
 window.SprintTracking={get status(){return ({
  "Offline · queued on this device":tx("Offline · queued on this device","离线 · 已在本机排队","오프라인 · 이 기기에 대기 중"),
  "Syncing with school…":tx("Syncing with school…","正在同步到学校…","학교에 동기화 중…"),
  "School sync up to date":tx("School sync up to date","已同步到学校","학교와 동기화 완료"),
  "School sync interrupted · try Reconnect":tx("School sync interrupted · try Reconnect","同步中断 · 请重新连接","동기화 중단 · 다시 연결")
 })[status]||status;},schedule,flush,inFlight:id=>ids.has(id)};
 addEventListener("online",()=>flush(true));
 addEventListener("offline",()=>{if(lesson.get().name&&!lesson.get().preview)show("Offline · queued on this device");});
 addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")flush(true);else if(lesson.get().events.length)flush();});
 if(lesson.get().name&&!lesson.get().preview)flush(true);
})();
