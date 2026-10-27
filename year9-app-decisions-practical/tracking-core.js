(function(root){'use strict';const C=typeof module==='object'&&module.exports?require('./core.js'):root.PracticalCore,D=C.D;
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
function payload(s){const p=C.restore(s);delete p.trackingId;delete p.orders;delete p.updated;p.lesson='year9-app-decisions-practical';return p;}
function diff(a,b){const out={};for(const k of ['answers','checked','learning','pit','feature','practical','support'])if(JSON.stringify(a?.[k])!==JSON.stringify(b[k]))out[k]=b[k];return out;}
function mergeDraft(a,b){const out={...(a||{})};for(const[k,v]of Object.entries(b||{}))out[k]=v&&typeof v==='object'&&!Array.isArray(v)&&out[k]&&typeof out[k]==='object'&&!Array.isArray(out[k])?{...out[k],...v}:v;return out;}
function summary(r){const n=C.restore({version:1,...(r.snapshot||r)}),answers=n.answers||{},checked=n.checked||{},pr=n.practical||{};let answered=0,correct=0,checkedCount=0;for(const[id,q]of Object.entries(D.quiz))if(q.options.some(v=>v.id===answers[id])){answered++;if(checked[id]){checkedCount++;if(q.correct===answers[id])correct++;}}
const help=n.support?.open===true&&n.support.at!==r.reviewed_help_key,needs=D.checks.filter(v=>n.learning?.[v.id]==='help').length,low=Object.values(n.pit||{}).includes('drowning'),s={...n,feature:n.feature||{a:'',b:'',button:'',outA:'',outB:''}};
const matched=['a','b'].filter(k=>{const t=pr.tests?.[k];return t?.status==='matched'&&(!n.feature?.outA||t.signature===C.signature(s.feature));}).length;
return{answered,checked:checkedCount,correct,wrong:checkedCount-correct,unattempted:Object.keys(D.quiz).length-answered,unchecked:answered-checkedCount,help,review:help||needs>0||low||Object.values(pr.tests||{}).some(v=>v.status==='different'),edits:Object.values(pr.edits||{}).filter(v=>v==='done').length,matched,notrun:['a','b'].filter(k=>pr.tests?.[k]?.status==='notrun').length};}
const out={uuid,payload,diff,mergeDraft,summary};if(typeof module==='object'&&module.exports)module.exports=out;else root.PracticalEvidence=out;
})(typeof window!=='undefined'?window:globalThis);
