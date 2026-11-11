(() => {
  'use strict';
  const config = window.REVISION_CONFIG;
  const randomHex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
  const uuid = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    const s=randomHex();
    return s.slice(0,8)+'-'+s.slice(8,12)+'-4'+s.slice(13,16)+'-8'+s.slice(17,20)+'-'+s.slice(20,32);
  };
  const read = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
  const write = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } };
  const rpc = async (name,body,token) => {
    if (!config?.publishableKey) throw new Error('School saving is not configured.');
    const controller=new AbortController();
    const stop=setTimeout(()=>controller.abort(),8000);
    try {
      const response = await fetch(config.url+'/rest/v1/rpc/'+name,{
        method:'POST', headers:{apikey:config.publishableKey,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},
        body:JSON.stringify(body),signal:controller.signal,cache:'no-store'
      });
      const data=await response.json();
      if (!response.ok) {
        const err=new Error(data.message || 'School connection is unavailable.');
        err.code=data.code; throw err;
      }
      return data;
    } finally { clearTimeout(stop); }
  };
  const pupil = (action,id,key,extras={}) => rpc(config.pupilRpc,{p_action:action,p_id:id,p_key:key,...extras});
  const download = (filename,contents,type='application/json') => {
    const url = URL.createObjectURL(new Blob([contents],{type}));
    const a=document.createElement('a'); a.href=url; a.download=filename; document.body.append(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  };
  window.REVISION_CLOUD={config,randomHex,uuid,read,write,rpc,pupil,download};
})();
