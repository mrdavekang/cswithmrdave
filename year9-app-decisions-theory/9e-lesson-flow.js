/* Ordered lesson position only; no pupil records or sign-in credentials. */
(()=>{'use strict';
const pages={start:'mission',focus:'focus','task-research':'gallery',quiz:'break-1','task-draw':'idea',pit:'pit-summary',finish:'finish'};
const steps=[];for(const slide of DesignTeachingContent.slides){steps.push({...slide,mode:pages[slide.id]?'student':'teaching',page:pages[slide.id]||''});if(slide.id==='task-research'||slide.id==='task-draw'){const n=slide.id==='task-research'?1:2;steps.push({id:'discussion-'+n,mode:'discussion',round:n,title:[n===1?'Discussion 1: a feature worth borrowing':'Discussion 2: make the tap and result clear',n===1?'讨论 1：值得借鉴的功能':'讨论 2：让点击及结果更清楚'],stage:n===1?'Main Task 1 · Research':'Main Task 2 · Draw',reveals:0});}}
function normalise(s={}){if(!s||typeof s!=='object')s={};const slide=steps.find(x=>x.id===s.id)||steps[0];return {id:slide.id,reveal:Math.min(slide.reveals||0,Math.max(0,Math.floor(Number(s.reveal)||0))),lang:s.lang==='bi'?'bi':'en'};}
const storageKey='y9e-linear-lesson-position-v1',listeners=new Set(),liveListeners=new Set(),requestListeners=new Set();let channel,position=normalise(),live=null;try{position=normalise(JSON.parse(localStorage.getItem(storageKey)||'{}'));}catch{}try{channel=new BroadcastChannel(storageKey);}catch{}
const cleanLive=r=>{if(!r||!['invite','response','discuss','follow','retry','work'].includes(r.phase))return null;return {round:r.round===2?2:1,phase:r.phase,connected:!!r.connected&&!r.ended,revealed:!!r.revealed,deadline:typeof r.deadline==='string'?r.deadline:'',pausedSeconds:r.pausedSeconds==null?null:Math.max(0,Number(r.pausedSeconds)||0),demo:{code:String(r.demo?.code||'').slice(0,8000),output:String(r.demo?.output||'').slice(0,2400)}};};
function receive(s){position=normalise(s);for(const f of listeners)f({...position});}
function set(s){receive({...position,...s});try{localStorage.setItem(storageKey,JSON.stringify(position));}catch{}try{channel?.postMessage({type:'position',value:position});}catch{}return position;}
function sendLive(r){live=cleanLive(r);for(const f of liveListeners)f(live);try{channel?.postMessage({type:'safe-live',value:live});}catch{}}
if(channel)channel.onmessage=e=>{if(e.data?.type==='position')receive(e.data.value);if(e.data?.type==='safe-live'){live=cleanLive(e.data.value);for(const f of liveListeners)f(live);}if(e.data?.type==='request-live')for(const f of requestListeners)f();};
addEventListener('storage',e=>{if(e.key===storageKey){try{receive(JSON.parse(e.newValue||'{}'));}catch{}}});
window.DesignLessonFlow={steps,normalise,get:()=>({...position}),getLive:()=>live,set,sendLive,on:f=>listeners.add(f),onLive:f=>liveListeners.add(f),onRequest:f=>requestListeners.add(f),requestLive:()=>{try{channel?.postMessage({type:'request-live'});}catch{}}};
})();
