(function(root){'use strict';
 const M=typeof module==='object'&&module.exports?require('./model.js'):root.CounterModel;
 const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
 const copy=x=>JSON.parse(JSON.stringify(x));
 function payload(s,cards){const p=M.restore(s,cards.length);delete p.liveId;delete p.events;delete p.orders;p.page=cards[p.card].id;if(!cards.some(c=>c.id===p.support.page))p.support.page=p.page;return p;}
 function diff(before,after){const out={};for(const key of ['profile','values','checks','visited','skipped','lang','card','furthest','support']){
  const a=before?.[key],b=after[key];if(JSON.stringify(a)===JSON.stringify(b))continue;
  if(['profile','values','checks'].includes(key)&&b&&typeof b==='object'&&!Array.isArray(b)){
   const d={};for(const [k,v]of Object.entries(b))if(JSON.stringify(a?.[k])!==JSON.stringify(v))d[k]=v;
   for(const k of Object.keys(a||{}))if(!(k in b))d[k]=null;if(Object.keys(d).length)out[key]=d;
  }else out[key]=b;
 }return out;}
 function merge(a,b){const out={...(a||{})};for(const[k,v]of Object.entries(b||{}))out[k]=v&&typeof v==='object'&&!Array.isArray(v)&&out[k]&&typeof out[k]==='object'&&!Array.isArray(out[k])?{...out[k],...v}:v;return out;}
 function backup(s){const p=copy(s);delete p.liveId;delete p.token;delete p.resumeKey;delete p.trackingId;return p;}
 function summary(r,cards){const quizzes=cards.filter(c=>c.type==='quiz'),q=r.quiz||{},tests=r.tests||{};let answered=0,matches=0;for(const c of quizzes)if(typeof q[c.id]==='string'&&/^\d+$/.test(q[c.id])&&c.options[Number(q[c.id])]){answered++;if(Number(q[c.id])===c.correct)matches++;}
  const testKeys=['count1','count2','count3','beforeReset','afterReset','afterAgain'];const testEntries=testKeys.filter(k=>typeof tests[k]==='string'&&tests[k].trim()).length;
  const asked=r.support?.open===true&&r.support.at!==r.reviewed_help_key;
  return {answered,matches,unanswered:quizzes.length-answered,testEntries,asked,needsSupport:asked||r.phase==='help'||Object.values(r.readiness||{}).includes('2')};
 }
 const api={uuid,payload,diff,merge,backup,summary};root.CounterEvidence=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
