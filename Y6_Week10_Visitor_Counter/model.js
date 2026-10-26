(function(root){
 'use strict';
 const LESSON='y6-week10-visitor-counter',VERSION=1;
 const fresh=()=>({lesson:LESSON,version:VERSION,started:false,startedAt:'',profile:{name:'',className:'',mode:'solo',partner:''},lang:'en',card:0,furthest:0,values:{},checks:{},orders:{},visited:[],skipped:[],events:[]});
 const clean=v=>typeof v==='string'?v.slice(0,3000):'';
 const record=(s,type,key,value)=>{s.events.push({at:new Date().toISOString(),type:clean(type),key:clean(key),value:clean(String(value))});s.events=s.events.slice(-600);};
 function restore(x,max){
  if(!x||x.lesson!==LESSON||x.version!==VERSION||!x.started||!x.profile||!clean(x.profile.name).trim())throw Error('Not a Week 10 backup');
  const s=fresh();s.started=true;s.startedAt=clean(x.startedAt);s.lang=['en','zh','ko'].includes(x.lang)?x.lang:'en';
  for(const k of ['name','className','partner'])s.profile[k]=clean(x.profile[k]).slice(0,100);
  s.profile.mode=x.profile.mode==='pair'?'pair':'solo';
  s.card=Number.isInteger(x.card)?Math.max(0,Math.min(max-1,x.card)):0;
  s.furthest=Number.isInteger(x.furthest)?Math.max(s.card,Math.min(max-1,x.furthest)):s.card;
  for(const k of ['values','checks','orders'])if(x[k]&&typeof x[k]==='object'&&!Array.isArray(x[k]))for(const [key,v] of Object.entries(x[k]).slice(0,250)){
   if(!/^[\w-]{1,90}$/.test(key)||['__proto__','constructor','prototype'].includes(key))continue;
   if(k==='values')s.values[key]=clean(v);
   if(k==='checks'&&typeof v==='boolean')s.checks[key]=v;
   if(k==='orders'&&Array.isArray(v)&&v.length<=8&&v.every(n=>Number.isInteger(n)&&n>=0&&n<8)&&new Set(v).size===v.length)s.orders[key]=v;
  }
  for(const k of ['visited','skipped'])s[k]=Array.isArray(x[k])?[...new Set(x[k].filter(n=>Number.isInteger(n)&&n>=0&&n<max))]:[];
  s.events=Array.isArray(x.events)?x.events.slice(-600).filter(e=>e&&typeof e==='object').map(e=>({at:clean(e.at),type:clean(e.type),key:clean(e.key),value:clean(e.value)})):[];
  return s;
 }
 function shuffle(n,random=Math.random){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function order(s,key,n){const a=s.orders[key];if(!a||a.length!==n||a.some(i=>i>=n))s.orders[key]=shuffle(n);return s.orders[key];}
 function missing(s,c){return (c.required||[]).filter(k=>!s.checks[k]&&!String(s.values[k]||'').trim());}
 function advance(s,cards,skip=false){if(skip&&!s.skipped.includes(s.card))s.skipped.push(s.card);if(!skip)s.skipped=s.skipped.filter(i=>i!==s.card);record(s,skip?'help-skip':'continue',cards[s.card].id,skip?'Help requested or step skipped; no completion assumed':'Learner continued');s.card=Math.min(cards.length-1,s.card+1);s.furthest=Math.max(s.furthest,s.card);}
 function route(s,cards,teacher=false){return cards.map((c,i)=>({c,i})).filter(({c})=>teacher||!c.optional||c.type==='extension'&&(s.values.practice==='all'||s.values.practice===c.id)||c.type==='hardware'&&s.values.hardwareRoute==='board'||c.type==='reference'&&s.checks.reopen).map(x=>x.i);}
 const api={LESSON,VERSION,fresh,restore,record,shuffle,order,missing,advance,route};root.CounterModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
