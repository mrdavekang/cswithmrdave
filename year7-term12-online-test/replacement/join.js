(() => {
  if(!window.ExamCloud)return;
  ExamCloud.nameEntry=true;
  ExamCloud.joinName=async(name,device)=>{
    const c=window.EcoFairLiveConfig;
    const r=await fetch(c.url+'/rest/v1/rpc/y7_term12_claim_replacement',{method:'POST',cache:'no-store',headers:{apikey:c.key,'Content-Type':'application/json'},body:JSON.stringify({p_invite:location.hash.slice(1),p_name:name,p_device:device})});
    const d=await r.json(); if(!r.ok)throw Error(d.message||'Could not open the replacement. Contact your teacher.');return d;
  };
})();