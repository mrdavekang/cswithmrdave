(function(root){'use strict';const C=typeof module==='object'&&module.exports?require('./9t-core.js'):root.StudioCore;
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[a-f0-9]{12}$/i.test(v);
function payload(s){const p=C.restore(s);delete p.trackingId;delete p.updated;p.lesson='year9-app-decisions-theory';return p;}
function diff(a,b){const r={};for(const k of ['answers','checked','learning','pit','feature','studio','support','live'])if(JSON.stringify(a?.[k])!==JSON.stringify(b[k]))r[k]=b[k];if(r.live){r.live=Object.fromEntries(Object.entries(b.live||{}).filter(([k,v])=>JSON.stringify(a?.live?.[k])!==JSON.stringify(v)).map(([k,v])=>[k,{round:v.round,kind:v.kind,codePreview:String(v.code||'').slice(0,240),submitted:v.submitted,editedAt:v.editedAt}]));}return r;}
function mergeDraft(a,b){const r={...(a||{})};for(const [k,v]of Object.entries(b||{}))r[k]=v&&typeof v==='object'&&!Array.isArray(v)&&r[k]&&typeof r[k]==='object'&&!Array.isArray(r[k])?{...r[k],...v}:v;return r;}
const api={uuid,payload,diff,mergeDraft};if(typeof module==='object'&&module.exports)module.exports=api;else root.DecisionEvidence=api;
})(typeof window!=='undefined'?window:globalThis);
