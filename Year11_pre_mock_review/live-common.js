(() => {
  'use strict';
  const cfg=window.REVIEW_CONFIG;
  window.ReviewCommon={
    client(teacher=false){return window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:teacher,storage:teacher?sessionStorage:undefined,storageKey:'y11-live-teacher',autoRefreshToken:teacher,detectSessionInUrl:false}});},
    async rpc(client,name,args={}){const {data,error}=await client.rpc(name,args);if(error)throw Error(error.message);return data;},
    escape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
    token(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');},
    value(value){return typeof value==='string'?value:JSON.stringify(value,null,2);}
  };
})();
