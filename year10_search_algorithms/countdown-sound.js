(function(root){
 'use strict';
 function create(context){
  let loop=null,key='',previous=null;const warned=new Set(),chimes=new Set();
  const buffer=context.createBuffer(1,context.sampleRate,context.sampleRate),samples=buffer.getChannelData(0);
  // A soft clock-like pulse followed by silence; repeated for the full final 15 seconds.
  for(let i=0;i<Math.floor(context.sampleRate*.16);i++){const t=i/context.sampleRate,attack=Math.min(1,t/.008);samples[i]=attack*Math.exp(-27*t)*(Math.sin(2*Math.PI*660*t)+.18*Math.sin(2*Math.PI*990*t))*.55;}
  function end(node){try{node.stop();}catch{}try{node.disconnect();}catch{}}
  function stopLoop(){if(loop){const old=loop;loop=null;end(old.source);old.gain.disconnect();}}
  function stop(){stopLoop();for(const node of chimes)end(node);chimes.clear();}
  function chime(){
   const source=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
   source.type='sine';source.frequency.value=659;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.07,now+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+.32);source.connect(gain);gain.connect(context.destination);chimes.add(source);source.onended=()=>{chimes.delete(source);source.disconnect();gain.disconnect();};source.start(now);source.stop(now+.35);
  }
  function update(state,remaining,{enabled=false,connected=true}={}){
   const nextKey=[state?.stage_run_id,state?.stage_id,state?.phase,state?.round_id].join(':');
   if(nextKey!==key){stop();key=nextKey;previous=null;warned.clear();}
   const eligible=enabled&&connected&&context.state==='running'&&state&&!state.paused&&['work','question'].includes(state.phase)&&!(state.stage_id==='overview'&&state.phase==='work')&&Number.isFinite(remaining)&&remaining>0;
   if(!eligible){stop();previous=remaining;return false;}
   for(const threshold of [60000,30000])if(previous!==null&&previous>threshold&&remaining<=threshold&&!warned.has(threshold)){warned.add(threshold);chime();}
   previous=remaining;
   if(remaining>15000){stopLoop();return false;}
   const endAt=context.currentTime+remaining/1000;
   if(loop&&Math.abs(loop.endAt-endAt)>.4)stopLoop();
   if(!loop){const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=.09;source.connect(gain);gain.connect(context.destination);loop={source,gain,endAt};source.onended=()=>{if(loop?.source===source)loop=null;source.disconnect();gain.disconnect();};source.start(context.currentTime);source.stop(endAt);}
   return true;
  }
  return {update,stop};
 }
 const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SearchCountdownSound=api;
})(typeof window!=='undefined'?window:globalThis);
