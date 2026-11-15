(() => {
'use strict';
const cfg=window.TrailTrackingConfig;
if(!cfg?.key?.startsWith('sb_publishable_')||!globalThis.crypto?.getRandomValues)return;
const hex=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),x=>x.toString(16).padStart(2,'0')).join('');
function uuid(){
  const h=hex(16);
  return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-${'89ab'[parseInt(h[16],16)%4]}${h.slice(17,20)}-${h.slice(20)}`;
}
const size=x=>new TextEncoder().encode(JSON.stringify(x)).length;
function fit(factory,max){for(const limit of [5000,1800,600,180]){const obj=factory(limit);if(size(obj)<max)return obj;}return null;}
function clean(value,n,depth=0,mark=()=>{}){
  if(typeof value==='string'){if(value.length<=n)return value;mark();return value.slice(0,n)+'\n[… shortened in school copy]';}
  if(depth>6){mark();return null;}
  if(Array.isArray(value)){if(value.length>80)mark();return value.slice(0,80).map(v=>clean(v,n,depth+1,mark));}
  if(value&&typeof value==='object'){const entries=Object.entries(value);if(entries.length>300)mark();return Object.fromEntries(entries.slice(0,300).map(([k,v])=>[k,clean(v,n,depth+1,mark)]));}
  return value;
}
function create({get,snapshot,persist,status}){
  let timer=null,busy=false,failures=0;
  const meta=()=>get().sync;
  const pending=()=>{const m=meta();return Boolean(m&&(m.version>m.acked||m.queue.length));};
  function schedule(ms=1600){
    if(!pending()||busy||timer!==null)return;
    timer=setTimeout(()=>{timer=null;void flush();},ms);
  }
  function enable(){
    const s=get();
    if(!s.sync&&s.name?.trim())s.sync={id:uuid(),key:hex(32),version:0,acked:0,queue:[]};
  }
  function changed(){
    const m=meta();if(!m)return;
    m.version=Math.max(Date.now(),m.version+1);if(!busy)status(navigator.onLine?'pending':'offline');schedule();
  }
  function record(kind,payload){
    const m=meta();if(!m)return;
    const e=fit(n=>({id:uuid(),card:get().id,kind,at:new Date().toISOString(),...clean(payload,n)}),23000);
    if(e)m.queue.push(e);
  }
  async function flush(){
    if(!pending()||busy)return;
    if(timer!==null){clearTimeout(timer);timer=null;}
    if(!navigator.onLine){status('offline');return;}
    const m=meta(),version=m.version,events=m.queue.slice(0,10);
    const copied=fit(n=>{let shortened=false;const data=clean(snapshot(),n,0,()=>{shortened=true;});return {...data,shortened};},430000);
    if(!copied){status('error');return;}
    busy=true;status('syncing');
    const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),10000);
    try{
      const body=JSON.stringify({p_id:m.id,p_key:m.key,p_name:get().name,p_version:version,p_snapshot:copied,p_attempts:events});
      const response=await fetch(cfg.url+'/rest/v1/rpc/y8_trail_pass_save',{
        method:'POST',credentials:'omit',keepalive:new TextEncoder().encode(body).length<60000,signal:ctl.signal,headers:{apikey:cfg.key,'Content-Type':'application/json'},body
      });
      if(!response.ok||Number(await response.json())<version)throw Error('School copy not confirmed');
      const accepted=new Set(events.map(e=>e.id));m.queue=m.queue.filter(e=>!accepted.has(e.id));m.acked=Math.max(m.acked,version);
      persist();failures=0;status(pending()?'pending':'synced');
    }catch{failures++;status(navigator.onLine?'error':'offline');}
    finally{busy=false;clearTimeout(timeout);if(navigator.onLine)schedule(failures?Math.min(30000,1500*2**Math.min(5,failures)):450);}
  }
  function resume(){if(!meta())return;status(navigator.onLine?(pending()?'pending':'synced'):'offline');schedule(150);}
  addEventListener('online',()=>flush());
  addEventListener('offline',()=>{if(meta())status('offline');});
  document.addEventListener('visibilitychange',()=>{if(meta())void flush();});
  return {enable,changed,record,flush,resume};
}
window.TrailSync={create};
})();
