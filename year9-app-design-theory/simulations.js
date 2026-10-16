(function(root){'use strict';
const cities={'Kuala Lumpur':{temp:28,sky:'Cloudy, rain later / 多云，稍后有雨'},Tokyo:{temp:22,sky:'Bright / 晴朗'},London:{temp:16,sky:'Light rain / 小雨'}};
const slots=['10:00','12:00','15:00'];
const modes={fashion:['catalogue','heart'],camera:['details','star'],gaming:['details','compare'],weather:['weather','city'],booking:['events','slots'],planner:['timer','timetable']};
function initial(){return {saved:{fashion:false,camera:false},city:'Kuala Lumpur',slot:'',timer:{remaining:10,running:false,deadline:0,phase:'ready'}};}
function mode(id,index){return modes[id]?.[index]||'details';}
function advance(s,now=Date.now()){if(s.timer.running){s.timer.remaining=Math.max(0,Math.ceil((s.timer.deadline-now)/1000));if(!s.timer.remaining){s.timer.running=false;s.timer.phase='finished';}}return s;}
function timerAction(s,action,now=Date.now()){advance(s,now);if(action==='reset'){s.timer={remaining:10,running:false,deadline:0,phase:'ready'};return s;}if(s.timer.running){s.timer.running=false;s.timer.deadline=0;s.timer.phase='paused';}else{s.timer.remaining=s.timer.remaining||10;s.timer.running=true;s.timer.phase='running';s.timer.deadline=now+s.timer.remaining*1000;}return s;}
function tap(s,id,index,now=Date.now()){if(id==='fashion'&&index===1)s.saved.fashion=!s.saved.fashion;if(id==='camera'&&index===1)s.saved.camera=!s.saved.camera;if(id==='planner'&&index===0)timerAction(s,'toggle',now);return s;}
function choose(s,type,value){if(type==='city'&&Object.hasOwn(cities,value))s.city=value;if(type==='slot'&&slots.includes(value))s.slot=value;return s;}
const api={cities,slots,initial,mode,advance,tap,timerAction,choose};if(typeof module==='object'&&module.exports)module.exports=api;else root.AppSim=api;
})(typeof window==='undefined'?globalThis:window);
