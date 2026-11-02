(function(root){
 'use strict';
 const LESSON='y6-week11-warning-counter',VERSION=1;
 const safeKey=k=>/^[\w-]{1,90}$/.test(k)&&!['__proto__','constructor','prototype'].includes(k);
 const clean=(v,n=2000)=>typeof v==='string'?v.slice(0,n):'';
 const fresh=()=>({lesson:LESSON,version:VERSION,started:false,startedAt:'',profile:{name:'',className:'',mode:'solo',partner:''},lang:'en',card:'mission',branch:'',values:{},firstValues:{},liveIdentity:null,orders:{},completed:[],skipped:[],visited:[],events:[]});
 function record(s,type,key,value){s.events.push({at:new Date().toISOString(),type:clean(type,50),key:clean(key,90),value:clean(String(value),300)});s.events=s.events.slice(-300);}
 function shuffle(n,random=Math.random){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function order(s,key,n){const a=s.orders[key];if(!Array.isArray(a)||a.length!==n||new Set(a).size!==n||a.some(i=>!Number.isInteger(i)||i<0||i>=n))s.orders[key]=shuffle(n);return s.orders[key];}
 function route(s,cards,teacher=false){return cards.filter(c=>teacher||(!c.branch||c.branch===s.branch)&&(!c.importHelp||s.values.importHelp==='yes')).map(c=>c.id);}
 function restore(x,cards){
  if(!x||x.lesson!==LESSON||x.version!==VERSION||x.started!==true||!clean(x.profile?.name).trim())throw Error('Not a Week 11 lesson backup');
  const s=fresh(),ids=cards.map(c=>c.id);s.started=true;s.startedAt=clean(x.startedAt,50);s.lang=['en','zh','ko'].includes(x.lang)?x.lang:'en';
  for(const k of ['name','className','partner'])s.profile[k]=clean(x.profile[k],100);
  s.profile.mode=x.profile.mode==='pair'?'pair':'solo';s.branch=['threshold','led','display','gesture'].includes(x.branch)?x.branch:'';
  if(x.values&&typeof x.values==='object'&&!Array.isArray(x.values))for(const[k,v]of Object.entries(x.values).slice(0,180))if(safeKey(k)&&typeof v==='string')s.values[k]=clean(v);
  if(x.firstValues&&typeof x.firstValues==='object'&&!Array.isArray(x.firstValues))for(const[k,v]of Object.entries(x.firstValues).slice(0,180))if(safeKey(k)&&typeof v==='string')s.firstValues[k]=clean(v);
  if(x.liveIdentity&&/^[a-f0-9-]{36}$/.test(x.liveIdentity.id)&&/^[a-f0-9]{64}$/.test(x.liveIdentity.token))s.liveIdentity={id:x.liveIdentity.id,token:x.liveIdentity.token,revision:Math.max(0,Number(x.liveIdentity.revision)||0)};
  if(x.orders&&typeof x.orders==='object')for(const[k,v]of Object.entries(x.orders).slice(0,20))if(safeKey(k)&&Array.isArray(v)&&v.length<=8&&v.every(n=>Number.isInteger(n)&&n>=0&&n<8)&&new Set(v).size===v.length)s.orders[k]=v;
  for(const k of ['completed','skipped','visited'])s[k]=Array.isArray(x[k])?[...new Set(x[k].filter(id=>ids.includes(id)))]:[];
  s.events=Array.isArray(x.events)?x.events.slice(-300).filter(e=>e&&typeof e==='object').map(e=>({at:clean(e.at,50),type:clean(e.type,50),key:clean(e.key,90),value:clean(e.value,300)})):[];
  const r=route(s,cards);s.card=r.includes(x.card)?x.card:'mission';return s;
 }
 function missing(s,c){if(c.type==='quiz')return s.values[c.id]===undefined;if(c.type==='written')return !s.values[c.id]?.trim()&&s.values[c.id+'-oral']!=='yes';if(c.type==='learning'||c.type==='open')return !s.values[c.id];if(c.type==='build'||c.type==='test')return !s.values[c.id];if(c.type==='pit')return !s.values.phase;if(c.type==='exit')return !s.values['exit-focus'];return false;}
 function commit(s,key){if(typeof s.values[key]==='string'&&s.values[key].trim()&&s.firstValues[key]===undefined)s.firstValues[key]=s.values[key];}
 const api={commit,LESSON,VERSION,fresh,restore,record,shuffle,order,route,missing};root.WarningModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
