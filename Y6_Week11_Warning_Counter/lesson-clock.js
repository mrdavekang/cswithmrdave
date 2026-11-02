(function(root){'use strict';
 const copy=v=>JSON.parse(JSON.stringify(v));
 function fresh(slide){return {slide,started:false,running:false,anchor:null,totalMs:0,spent:{}};}
 function normalise(v,ids,now=Date.now()){const s=fresh(ids[0]);if(!v||typeof v!=='object')return s;s.slide=ids.includes(v.slide)?v.slide:ids[0];s.started=!!v.started;s.running=!!v.running;s.anchor=Number.isFinite(v.anchor)&&v.anchor>0?Math.min(v.anchor,now):null;s.totalMs=Math.max(0,Math.min(Number(v.totalMs)||0,86400000));for(const id of ids)s.spent[id]=Math.max(0,Math.min(Number(v.spent?.[id])||0,86400000));if(!s.anchor)s.running=false;return s;}
 function settle(value,now=Date.now()){const s=copy(value);if(s.running){const delta=Math.max(0,now-(s.anchor||now));s.spent[s.slide]=(s.spent[s.slide]||0)+delta;s.totalMs+=delta;s.anchor=now;}return s;}
 function navigate(value,id,now=Date.now()){const s=settle(value,now);s.slide=id;return s;}
 function toggle(value,now=Date.now()){const s=settle(value,now);s.running=!s.running;s.started=true;s.anchor=s.running?now:null;return s;}
 function resetSlide(value,now=Date.now()){const s=settle(value,now);s.spent[s.slide]=0;return s;}
 function read(s,allowance,now=Date.now()){const delta=s.running?Math.max(0,now-(s.anchor||now)):0;return {slide:allowance*1000-(s.spent[s.slide]||0)-delta,total:3600000-s.totalMs-delta,running:s.running};}
 function format(ms){const n=Math.ceil(Math.abs(ms)/1000),time=Math.floor(n/60)+':'+String(n%60).padStart(2,'0');return ms<0?'Overtime +'+time:time;}
 const api={fresh,normalise,settle,navigate,toggle,resetSlide,read,format};root.WarningClock=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
