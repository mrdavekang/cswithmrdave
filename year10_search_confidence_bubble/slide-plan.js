/* Suggested page allocations: 60 minutes altogether. Projection never moves pupils. */
window.BubbleSlidePlan=(()=>{
 'use strict';
 const durations={ready:60,q1a:180,q1b:120,types:120,read:60,routine:60,searchmodel:180,rules:60,q3:300,q3stretch:60,bridge:60,fact1:120,bubblemodel:300,fact3:120,q5trace:300,swap:120,q6:300,q7:480,extension:240,pit:180,plenary:180};
 const duration=id=>durations[id]||120;
 function view(state){
  const p=state.projector;
  if(p?.display==='discussion'&&state.round)return {...state,phase:state.round.status==='open'?'discussion':'review',reveal:state.round.status!=='open'};
  if(p)return {...p,phase:'slide',server_now:state.server_now};
  // Compatibility while an older tab reconnects during deployment.
  return state;
 }
 function demo(state,action,data){
  const p=state.projector??={display:'slide',page_id:'ready',step:0,reveal:false,timer_remaining:60,paused:true,timer_end:null};
  state.slide_timers??={};
  if(action==='project'){
   const old={...p};delete old.display;delete old.page_id;delete old.step;delete old.reveal;
   if(data.page!==p.page_id)Object.assign(old,{timer_remaining:Math.ceil(BubbleLive.seconds(p)),paused:true,timer_end:null});
   state.slide_timers[p.page_id]=old;
   const timer=data.page===p.page_id?old:state.slide_timers[data.page]||{timer_remaining:data.seconds||duration(data.page),paused:true,timer_end:null};
   state.projector={...timer,display:'slide',page_id:data.page,step:data.step||0,reveal:!!data.reveal};
  }else if(action==='project_reveal')p.reveal=!!data.visible;
  else if(action==='project_timer')Object.assign(p,{duration:data.seconds,timer_remaining:data.seconds,paused:false,timer_end:new Date(Date.now()+data.seconds*1000).toISOString()});
  else if(action==='project_pause')Object.assign(p,{timer_remaining:Math.ceil(BubbleLive.seconds(p)),paused:true,timer_end:null});
  else if(action==='project_resume')Object.assign(p,{paused:false,timer_end:new Date(Date.now()+p.timer_remaining*1000).toISOString()});
  else return false;
  state.slide_timers[state.projector.page_id]={duration:state.projector.duration||duration(state.projector.page_id),timer_remaining:state.projector.timer_remaining,paused:state.projector.paused,timer_end:state.projector.timer_end};
  return true;
 }
 return {durations,duration,view,demo};
})();
