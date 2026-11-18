(() => {
  const config=window.EcoFairLiveConfig;
  if(!config?.url||!config?.key)return;
  const url=config.url.replace(/\/$/,'');
  async function send(path,body,token){
    const res=await fetch(url+path,{method:'POST',cache:'no-store',headers:{
      apikey:config.key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})
    },body:JSON.stringify(body),signal:AbortSignal.timeout(12000)});
    let data;
    try{data=await res.json();}catch{const e=Error('The assessment server did not respond.');e.status=res.status;throw e;}
    if(!res.ok){const e=Error(data.message||data.msg||data.error_description||'Could not connect to the assessment.');e.status=res.status;throw e;}
    return data;
  }
  const rpc=(name,payload,token)=>send('/rest/v1/rpc/y7_term12_'+name,payload,token);
  let teacherSession=null, refreshing;
  try{teacherSession=JSON.parse(sessionStorage.getItem('ecofair-live-teacher')||'null');}catch{}
  function setTeacher(data){
    teacherSession=data?.access_token?{access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+1000*data.expires_in}:null;
    try{if(teacherSession)sessionStorage.setItem('ecofair-live-teacher',JSON.stringify(teacherSession));else sessionStorage.removeItem('ecofair-live-teacher');}catch{}
  }
  async function activeToken(){
    if(!teacherSession){const e=Error('Sign in to your school assessment account.');e.status=401;throw e;}
    if(teacherSession.expires_at>Date.now()+30000)return teacherSession.access_token;
    if(!refreshing)refreshing=(async()=>{
      try{setTeacher(await send('/auth/v1/token?grant_type=refresh_token',{refresh_token:teacherSession.refresh_token}));}
      catch(e){if(e.status===400||e.status===401)setTeacher(null);throw e;}
      finally{refreshing=null;}
    })();
    await refreshing;return teacherSession.access_token;
  }
  window.ExamCloud={
    pupil(action,body={},code){return rpc('pupil',{p_action:action,p_code:code?.toLowerCase(),p_draft:body.draft??null,p_stamp:body.stamp??null});},
    hasTeacher:()=>!!teacherSession,
    async signIn(email,password){setTeacher(await send('/auth/v1/token?grant_type=password',{email,password}));},
    async signOut(){
      const token=teacherSession?.access_token;setTeacher(null);
      if(token)await send('/auth/v1/logout?scope=local',{},token).catch(()=>{});
    },
    async teacher(action,sitting=null,data=null){
      return rpc('teacher',{p_action:action,p_sitting:sitting,p_data:data},await activeToken());
    }
  };
})();
