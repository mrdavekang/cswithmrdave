/* The Mac publishes lesson state. The paired screen reads only projector-safe data. */
(() => {
 'use strict';
 const F=DesignLessonFlow,T=DesignLessonTimer,C=DesignLessonTiming,G=DesignLive;
 function restore(value){
  if(!value.presenter)return;
  const {position,timer}=value.presenter;
  const offset=Date.parse(value.serverNow)-Date.now();
  T.restore(position,{...timer,anchor:timer.anchor-offset});
 }

 const board=new URLSearchParams(location.search).get('board');
 if(document.body.classList.contains('lesson-screen')){
  if(!board)return;
  const status=document.getElementById('screen-sync-status');
  let lastRevision=-1,lastLive='',busy=false,finished=false;
  async function poll(){
   if(busy||finished)return;
   busy=true;
   try{
    const value=await G.rpc('projector',{p_key:board});
    if(value.ended){
     const timer=T.get();T.restore(F.get(),{...timer,running:false});F.receiveLive(null);
     finished=true;status.textContent='Class ended. Open a fresh projector link for the next class.';return;
    }
    if(value.revision!==lastRevision){restore(value);lastRevision=value.revision;}
    const liveKey=JSON.stringify(value.live);
    if(liveKey!==lastLive){
     const live=value.live;
     if(live?.deadline)live.deadline=new Date(Date.parse(live.deadline)-Date.parse(value.serverNow)+Date.now()).toISOString();
     F.receiveLive(live);lastLive=liveKey;
    }
    status.textContent=value.presenter?'Connected · following the teacher':'Connected · waiting for the teacher';
   }catch{status.textContent='Projector connection lost · retrying';}
   finally{busy=false;}
  }
  poll();setInterval(poll,1500);return;
 }

 const link=document.getElementById('presenter-projector-link');
 if(!link)return;
 const copy=document.getElementById('presenter-projector-copy'),status=document.getElementById('presenter-sync-status');
 let session=null,busy=false,dirty=false,revision=null,scheduled=null;
 function schedule(){
  if(!session)return;
  dirty=true;clearTimeout(scheduled);scheduled=setTimeout(flush,40);
 }
 async function flush(){
  if(busy||!session||!dirty||revision==null)return;
  busy=true;dirty=false;
  const target=session,position=F.get(),{version,id,running,anchor,elapsed,spent,extra}=T.get();
  try{
   const value=await G.rpc('presenter',{p_room:target.id,p_expected:revision,p_position:position,p_timer:{version,id,running,anchor,elapsed,spent,extra}});
   if(session===target){revision=value.revision;status.textContent='Projector synced · open this link on Windows';}
  }catch(e){
   if(session===target){
    if(e.code==='40001'){
     revision=null;dirty=false;status.textContent='Another teacher control updated the projector · reconnecting';
    }else{dirty=true;status.textContent='Projector sync interrupted · retrying';}
   }
  }finally{busy=false;if(dirty&&session!==target)setTimeout(flush,0);}
 }
 async function load(target){
  if(busy||!target)return;
  busy=true;
  try{
   const value=await G.rpc('presenter',{p_room:target.id});
   if(session!==target)return;
   revision=value.revision;
   if(value.presenter&&!dirty)restore(value);
   if(!value.presenter)dirty=true;
   status.textContent='Projector connected · open this link on Windows';
  }catch{if(session===target)status.textContent='Projector sync unavailable · retrying';}
  finally{busy=false;if(dirty&&revision!=null)flush();}
 }
 function attach(){
  const key=window.DesignTeacherSession?.boardKey(),room=window.DesignTeacherSession?.snapshot();
  if(session?.id===room?.id&&session?.key===key)return;
  const previous=session;
  session=key&&room?{key,id:room.id}:null;dirty=false;revision=null;
  link.href=session?'lesson-screen.html?board='+encodeURIComponent(key):'lesson-screen.html';
  copy.hidden=!session;
  if(!session){status.textContent='Open your class to connect a projector on another device.';return;}
  if(previous&&previous.id!==session.id)T.restore({...F.get(),id:'start',reveal:0},C.fresh());
  status.textContent='Connecting projector…';load(session);
 }
 copy.onclick=async()=>{
  try{await navigator.clipboard.writeText(link.href);status.textContent='Link copied · paste it on the Windows projector';}
  catch{status.textContent='Open classroom screen, then copy its address to Windows.';}
 };
 F.onSet(schedule);T.onChange(schedule);
 document.addEventListener('y9-live-update',attach);
 document.addEventListener('y9-teacher-auth',attach);
 setInterval(()=>{if(session){if(revision==null)load(session);else flush();}},1800);
 attach();
})();
