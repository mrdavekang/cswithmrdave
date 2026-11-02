(function(root){'use strict';
 const cfg=root.WarningLiveConfig;let teacherClient,publicClient;
 function auth(){return teacherClient||=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storageKey:'y6w11-approved-teacher',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});}
 function anon(){return publicClient||=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storageKey:'y6w11-public',persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});}
 async function rpc(kind,args={},privateCall=false){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const{data,error}=await(privateCall?auth():anon()).rpc('y6w11_'+kind,args).abortSignal(controller.signal);if(error){const e=Error(error.code==='PGRST202'?'Live setup is not available yet. Your lesson still saves on this device.':error.message);e.code=error.code;throw e;}return data;}finally{clearTimeout(timeout);}}
 const uuid=()=>crypto.randomUUID();
 function token(){const b=new Uint8Array(32);crypto.getRandomValues(b);return [...b].map(n=>n.toString(16).padStart(2,'0')).join('');}
 function saveJSON(data,name){const safe=JSON.stringify(data,(k,v)=>/token|credential|password|view_key|projectorKey|publishableKey|resumeKey/i.test(k)?undefined:v,2),a=document.createElement('a'),u=URL.createObjectURL(new Blob([safe],{type:'application/json'}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 root.WarningLiveAPI={auth,anon,rpc,uuid,token,saveJSON};
})(window);
