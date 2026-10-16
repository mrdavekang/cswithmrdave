(function(root){
 'use strict';
 const APP='year6-classroom-signals',VERSION=4,KEY='y6-classroom-signals-v1';
 const LEGACY_CARDS=['predictA','mission','learning','simulator','input','process','output','launch','predictB','testStarter','change','changeReason','purpose','plan','build','testCreate','pitstop','plenary','reflection','save','submit','finish'];
 const V2_CARDS=['predictA','mission','learning','learningSkills','learningUnderstanding','learningFocus','simulator','input','process','output','launch','predictB','testStarter','change','changeReason','purpose','plan','build','testCreate','pitstop','plenary','reflection','save','submit','finish'];
 const V3_CARDS=['mission','meetButtons','predictA','learning','learningSkills','learningUnderstanding','learningFocus','launch','simulator','input','process','output','predictB','testStarter','change','changeTest','changeReason','purpose','plan','build','designSymbol','testCreate','pitstop','plenary','reflection','save','reopenHome','reopenFile','submit','finish'];
 const CARD_IDS=[...V3_CARDS.slice(0,22),'hardware',...V3_CARDS.slice(22)];
 const COUNT=CARD_IDS.length;
 const text=(v,max=300)=>typeof v==='string'?v.slice(0,max):'';
 const fresh=()=>({app:APP,version:VERSION,started:false,profile:{name:'',className:'',partner:'',mode:'solo',originalPartner:''},lang:'en',card:0,maxCard:0,completed:[],skipped:[],answers:{},quizOrders:{},checks:{},texts:{},tests:{A:'',B:''},phase:'',purpose:'classroom',extensions:{1:{done:false,attempted:false,note:''},2:{done:false,attempted:false,note:''},3:{done:false,attempted:false,note:''}},reveals:[],events:[],openedMakecode:false,continuedAlone:false,startedAt:'',updatedAt:''});
 function sanitise(data){
  if(!data||data.app!==APP||![1,2,3,VERSION].includes(data.version)||typeof data.profile!=='object'||!data.profile)throw Error('This is not a Classroom Signals backup.');
  if(data.version!==VERSION){
   const oldVersion=data.version,oldCards=oldVersion===1?LEGACY_CARDS:oldVersion===2?V2_CARDS:V3_CARDS;
   const move=n=>CARD_IDS.indexOf(oldCards[Math.max(0,Math.min(oldCards.length-1,Number.isInteger(n)?n:0))]);
   const moveList=a=>Array.isArray(a)?a.filter(n=>Number.isInteger(n)&&n>=0&&n<oldCards.length).map(move):[];
   data={...data,version:VERSION,card:move(data.card),maxCard:move(data.maxCard),completed:moveList(data.completed).filter(n=>oldVersion!==1||CARD_IDS[n]!=='learning'),skipped:moveList(data.skipped)};
  }
  const s=fresh(),p=data.profile;
  s.profile={name:text(p.name,80),className:text(p.className,40),partner:text(p.partner,80),mode:p.mode==='pair'?'pair':'solo',originalPartner:text(p.originalPartner,80)};
  s.started=!!data.started&&!!s.profile.name&&!!s.profile.className;
  s.lang=['en','zh','ko'].includes(data.lang)?data.lang:'en';
  s.card=Number.isInteger(data.card)?Math.max(0,Math.min(COUNT-1,data.card)):0;
  s.maxCard=Number.isInteger(data.maxCard)?Math.max(s.card,Math.min(COUNT-1,Math.max(0,data.maxCard))):s.card;
  for(const k of ['completed','skipped'])s[k]=Array.isArray(data[k])?[...new Set(data[k].filter(n=>Number.isInteger(n)&&n>=0&&n<COUNT))]:[];
  for(const k of ['answers','texts'])if(data[k]&&typeof data[k]==='object')for(const [key,val] of Object.entries(data[k]))if(/^[a-zA-Z0-9_-]{1,40}$/.test(key)&&!['__proto__','constructor','prototype'].includes(key)&&typeof val==='string')s[k][key]=text(val,k==='texts'?1000:80);
  for(const g of ['knowledge','skills','understanding'])if(!['ready','new','help'].includes(s.answers['goal_'+g]))delete s.answers['goal_'+g];
  if(!['knowledge','skills','understanding'].includes(s.answers.learningFocus))delete s.answers.learningFocus;
  if(data.quizOrders&&typeof data.quizOrders==='object'&&!Array.isArray(data.quizOrders))for(const [id,order] of Object.entries(data.quizOrders).slice(0,60)){
   if(!/^[a-zA-Z0-9_-]{1,40}$/.test(id)||['__proto__','constructor','prototype'].includes(id)||!Array.isArray(order)||order.length<2||order.length>12)continue;
   if(order.every(v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,40}$/.test(v))&&new Set(order).size===order.length)s.quizOrders[id]=order.slice();
  }
  if(data.checks&&typeof data.checks==='object')for(const [key,val] of Object.entries(data.checks))if(/^[a-zA-Z0-9_-]{1,40}$/.test(key)&&!['__proto__','constructor','prototype'].includes(key))s.checks[key]=val===true;
  if(data.tests&&typeof data.tests==='object')for(const k of ['A','B'])s.tests[k]=['worked','fix',''].includes(data.tests[k])?data.tests[k]:'';
  s.phase=['new','consolidating','water','help'].includes(data.phase)?data.phase:'';
  s.purpose=['classroom','library','exhibition'].includes(data.purpose)?data.purpose:'classroom';
  for(const n of [1,2,3]){const e=data.extensions?.[n];if(e&&typeof e==='object')s.extensions[n]={done:e.done===true,attempted:e.attempted===true,note:text(e.note,1000)};}
  s.reveals=Array.isArray(data.reveals)?data.reveals.filter(x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,40}$/.test(x)).slice(0,40):[];
  s.events=Array.isArray(data.events)?data.events.slice(-500).filter(e=>e&&typeof e==='object').map(e=>({type:text(e.type,30),key:text(e.key,40),value:text(e.value,1000),at:text(e.at,50)})):[];
  s.openedMakecode=data.openedMakecode===true;s.continuedAlone=data.continuedAlone===true;
  s.startedAt=text(data.startedAt,50);s.updatedAt=text(data.updatedAt,50);
  return s;
 }
 function advance(s,skip=false){const n=s.card;if(skip){if(!s.skipped.includes(n))s.skipped.push(n);s.completed=s.completed.filter(i=>i!==n);}else{if(!s.completed.includes(n))s.completed.push(n);s.skipped=s.skipped.filter(i=>i!==n);}s.card=Math.min(COUNT-1,n+1);s.maxCard=Math.max(s.maxCard,s.card);return s;}
 function jump(s,n,teacher=false){if(!Number.isInteger(n)||n<0||n>=COUNT||(!teacher&&n>s.maxCard))return false;s.card=n;return true;}
 function practicalStatus(s){return {explored:!!s.checks.testedA&&!!s.checks.testedB,modified:!!s.checks.changedB,created:!!s.checks.created&&s.tests.A==='worked'&&s.tests.B==='worked',saved:!!s.checks.hexSaved,reportRequested:!!s.checks.reportRequested};}
 function alone(s){s.continuedAlone=s.profile.mode==='pair'||s.continuedAlone;s.profile.originalPartner=s.profile.originalPartner||s.profile.partner;s.profile.mode='solo';return s;}
 function suggestedFocus(s){const goals=['knowledge','skills','understanding'];return goals.find(g=>s.answers['goal_'+g]==='help')||goals.find(g=>s.answers['goal_'+g]==='new')||'understanding';}
 function hasShortResponse(s,key){return typeof s.texts[key]==='string'&&s.texts[key].trim().length>0;}
 function validOptionOrder(order,options){const values=new Set(options.map(o=>o[0]));return Array.isArray(order)&&order.length===options.length&&new Set(order).size===order.length&&order.every(v=>values.has(v));}
 function shuffle(values,random){const result=values.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
 function prepareQuizOrders(s,cards,random=Math.random){
  if(!s.quizOrders)s.quizOrders={};
  const quizzes=cards.filter(c=>c.type==='quiz'),countsBySize=new Map();let changed=false;
  const countsFor=n=>{if(!countsBySize.has(n))countsBySize.set(n,Array(n).fill(0));return countsBySize.get(n);};
  // Keep existing orders. Balance new correct-answer positions across the lesson,
  // so a short lesson cannot randomly end up with every answer at the top again.
  for(const c of quizzes)if(validOptionOrder(s.quizOrders[c.id],c.options)){const position=s.quizOrders[c.id].indexOf(c.correct);if(position>=0)countsFor(c.options.length)[position]++;}
  for(const c of quizzes){
   if(validOptionOrder(s.quizOrders[c.id],c.options))continue;
   const order=shuffle(c.options.map(o=>o[0]),random),counts=countsFor(order.length),least=Math.min(...counts);
   const slots=counts.map((count,i)=>count===least?i:-1).filter(i=>i>=0),target=slots[Math.floor(random()*slots.length)],correct=order.indexOf(c.correct);
   if(correct>=0){[order[correct],order[target]]=[order[target],order[correct]];counts[target]++;}
   s.quizOrders[c.id]=order;changed=true;
  }
  return changed;
 }
 function quizOptions(s,c){const order=s.quizOrders?.[c.id];return validOptionOrder(order,c.options)?order.map(value=>c.options.find(o=>o[0]===value)):c.options.slice();}
 function log(s,type,key,value){s.events.push({type:text(type,30),key:text(key,40),value:text(String(value),1000),at:new Date().toISOString()});if(s.events.length>500)s.events.shift();}
 const api={APP,VERSION,COUNT,CARD_IDS,KEY,fresh,sanitise,advance,jump,practicalStatus,alone,suggestedFocus,hasShortResponse,validOptionOrder,prepareQuizOrders,quizOptions,log};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.Y6Model=api;
})(typeof window!=='undefined'?window:this);
