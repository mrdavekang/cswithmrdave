/* Bounded requests and replaceable presence checks. No pupil work or keys are logged. */
window.GameConnection = (() => {
  'use strict';
  const members=new Map();
  function abortError(){const e=new Error('Connection check replaced. Your work is kept.');e.name='AbortError';return e;}
  function request(work,{signal,timeoutMs=12000}={}){
    return new Promise((resolve,reject)=>{
      const controller=new AbortController();let done=false,timer;
      const finish=(fn,value)=>{if(done)return;done=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);fn(value);};
      const cancel=()=>{controller.abort();finish(reject,abortError());};
      if(signal?.aborted){cancel();return;}
      signal?.addEventListener('abort',cancel,{once:true});
      timer=setTimeout(()=>{controller.abort();const e=new Error('Connection timed out. Your work is kept. Tap Reconnect to class.');e.name='TimeoutError';finish(reject,e);},timeoutMs);
      // The deadline settles even if an old browser request ignores AbortSignal.
      Promise.resolve().then(()=>work(controller.signal)).then(v=>finish(resolve,v),e=>finish(reject,e));
    });
  }
  function lane({timeoutMs=12000,now=()=>Date.now()}={}){
    let current=null;
    const cancel=()=>{const old=current;current=null;old?.controller.abort();};
    return {
      get busy(){return !!current;},get age(){return current?now()-current.started:0;},cancel,
      async run(work,{replace=false}={}){
        if(current&&!replace&&now()-current.started<timeoutMs)return {skipped:true};
        cancel();const job={controller:new AbortController(),started:now()};current=job;
        try{const value=await request(work,{signal:job.controller.signal,timeoutMs});return current===job?{value}:{superseded:true};}
        catch(e){if(current!==job)return {superseded:true};throw e;}
        finally{if(current===job)current=null;}
      }
    };
  }
  function member(key,{stores=[()=>window.localStorage,()=>window.sessionStorage],random=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('')}={}){
    let credential=members.get(key);
    if(!credential)for(const get of stores){try{const value=JSON.parse(get().getItem(key));if(/^[a-f0-9]{64}$/.test(value?.token||'')){credential=value;break;}}catch{}}
    credential ||= {token:random()};members.set(key,credential);let stored=false;
    for(const get of stores){try{const storage=get();storage.setItem(key,JSON.stringify(credential));stored ||= JSON.parse(storage.getItem(key))?.token===credential.token;}catch{}}
    return {credential,memoryOnly:!stored};
  }
  function confirm(record,pending,data){
    const p=pending.packet,server=data.responses.find(x=>x.round_no===p.round&&x.kind===p.kind);
    if(!server||server.code!==p.code)throw Error('Another tab changed this response. Your draft is kept. Use one lesson tab and ask your teacher to compare the saved versions.');
    record.version=server.version;
    if(record.pendingSend?.packet.eventId===p.eventId)delete record.pendingSend;
    const unchanged=record.code===p.code&&(record.output||'')===(p.output||'')&&(record.error||'')===(p.error||'');
    record.dirty=!unchanged;record.submitted=unchanged&&!!server.submitted_at;
  }
  return {request,lane,member,confirm};
})();
