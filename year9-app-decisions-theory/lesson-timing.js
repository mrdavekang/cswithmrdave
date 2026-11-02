/* Public timing only. No class records, credentials or school connection. */
(function(root){'use strict';
const durations=[['start',300],['focus',120],['clear-labels',60],['visible-result',60],['investigate',120],['task-research',660],['discussion-1',300],['quiz',180],['one-improvement',45],['draw-before',75],['draw-after',90],['partner-check',90],['task-draw',900],['discussion-2',300],['pit',180],['finish',120]];
let offset=0;const plan=durations.map(([id,seconds])=>{const item={id,seconds,start:offset,end:offset+seconds};offset+=seconds;return Object.freeze(item);});
const totalSeconds=offset,valid=id=>plan.some(p=>p.id===id),safeNumber=n=>Number.isFinite(n)&&n>=0?n:0;
function fresh(id='start'){return {version:1,id:valid(id)?id:'start',running:false,anchor:0,elapsed:0,spent:{}};}
function normalise(raw){if(!raw||raw.version!==1)return fresh();const s=fresh(raw.id);s.running=raw.running===true;s.anchor=safeNumber(raw.anchor);s.elapsed=safeNumber(raw.elapsed);for(const p of plan)s.spent[p.id]=safeNumber(raw.spent?.[p.id]);return s;}
function settle(raw,now){const s=normalise(raw),delta=s.running?Math.max(0,now-s.anchor):0;s.elapsed+=delta;s.spent[s.id]=(s.spent[s.id]||0)+delta;s.anchor=now;return s;}
function action(raw,type,id,now){const s=settle(raw,now);if(type==='new')return {...fresh(id),anchor:now};if(type==='move'&&valid(id))s.id=id;if(type==='toggle')s.running=!s.running;if(type==='reset-stage')s.spent[s.id]=0;s.anchor=now;return s;}
function snapshot(raw,now){const s=settle(raw,now),slot=plan.find(p=>p.id===s.id);return {...s,slot,stageLeft:slot.seconds-(s.spent[s.id]||0)/1000,lessonLeft:totalSeconds-s.elapsed/1000};}
function time(seconds){const n=Math.max(0,Math.ceil(seconds));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');}
const api={plan,totalSeconds,fresh,normalise,action,snapshot,time};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DesignLessonTiming=api;
})(typeof window==='undefined'?globalThis:window);
