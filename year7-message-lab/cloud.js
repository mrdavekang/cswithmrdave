/* A learner can save only their private UUID/key record. No pupil-list endpoint is called here. */
window.MessageCloud=(()=>{'use strict';const cfg=MESSAGE_CONFIG;let auth;
 const teacher=()=>auth||=supabase.createClient(cfg.url,cfg.key,{auth:{storage:sessionStorage,storageKey:'y7-message-teacher-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 async function rpc(name,args={},teacherMode=false){if(!cfg.enabled)throw Error('Cloud setup is not active');const stop=new AbortController(),timeout=setTimeout(()=>stop.abort(),12000);try{let bearer=cfg.key;if(teacherMode){const {data}=await teacher().auth.getSession();if(!data.session)throw Error('Sign in with your approved teacher account.');bearer=data.session.access_token;}const r=await fetch(cfg.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:cfg.key,Authorization:'Bearer '+bearer,'Content-Type':'application/json'},body:JSON.stringify(args),signal:stop.signal});const data=await r.json();if(!r.ok)throw Error(data.message||'Cloud request could not be completed');return data;}finally{clearTimeout(timeout);}}
 const own=(action,p,extra={})=>rpc('y7_message_student',{p_action:action,p_id:p.id,p_key:p.key,p_name:p.name,p_class:p.className,...extra});
 async function signIn(email,password){const {error}=await teacher().auth.signInWithPassword({email,password});if(error)throw error;try{return await teacherAction('authorize');}catch(e){await teacher().auth.signOut();throw e;}}
 const teacherAction=(action,args={})=>rpc('y7_message_teacher',{p_action:action,...args},true);
 const publicRoom=className=>rpc('y7_message_public',{p_class:className});
 const signOut=()=>teacher().auth.signOut();
 return {rpc,own,teacherAction,publicRoom,signIn,signOut,teacher};
})();
