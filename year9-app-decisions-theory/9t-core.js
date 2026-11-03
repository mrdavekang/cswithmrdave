(function(root){'use strict';
const D=typeof module==='object'&&module.exports?require('./9t-content.js'):root.StudioContent;
const KEY='mrdave-y9t-app-design-research-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function initial(){return {version:1,trackingId:'',student:{name:'',form:'9T'},joined:false,lang:'en',slide:'mission',visited:[],answers:{},checked:{},learning:{},pit:{},support:{open:false,at:'',page:'mission'},live:{},feature:{name:'App design research',a:'[9T App Design Studio]',b:'Paper Section B',outA:'',outB:'',seen:{a:false,b:false}},studio:{edition:D.edition,selected:[],opened:[],paperA:false,paperB:false,sketch:'',wagoll:'',quizOrders:{}},updated:''};}
function restore(raw){const s=initial();if(!raw||typeof raw!=='object')return s;
 s.student.name=String(raw.student?.name||'').slice(0,90);s.joined=raw.joined===true&&s.student.name.trim().length>=2;
 s.trackingId=typeof raw.trackingId==='string'?raw.trackingId:'';s.lang=raw.lang==='bi'?'bi':'en';s.slide=D.pages.some(p=>p.id===raw.slide)?raw.slide:'mission';
 s.visited=Array.isArray(raw.visited)?raw.visited.filter(id=>D.pages.some(p=>p.id===id)):[];
 for(const [id,q]of Object.entries(D.quiz)){if(q.options.some(o=>o[0]===raw.answers?.[id]))s.answers[id]=raw.answers[id];if(raw.checked?.[id]===true)s.checked[id]=true;}
 for(const ch of D.checks)if(['secure','new','help'].includes(raw.learning?.[ch.id]))s.learning[ch.id]=raw.learning[ch.id];
 for(const a of ['K','S','U'])if(D.phases.some(p=>p.id===raw.pit?.[a]))s.pit[a]=raw.pit[a];
 s.studio.selected=Array.isArray(raw.studio?.selected)?[...new Set(raw.studio.selected.filter(id=>D.apps.some(a=>a.id===id)))].slice(0,2):[];
 s.studio.opened=Array.isArray(raw.studio?.opened)?[...new Set(raw.studio.opened.filter(id=>D.apps.some(a=>a.id===id)))]:[];
 s.studio.paperA=raw.studio?.paperA===true;s.studio.paperB=raw.studio?.paperB===true;
 s.studio.sketch=['have','start'].includes(raw.studio?.sketch)?raw.studio.sketch:'';
 s.studio.wagoll=['fashion','help'].includes(raw.studio?.wagoll)?raw.studio.wagoll:'';
 const orders=raw.studio?.quizOrders||{};for(const [id,q]of Object.entries(D.quiz))if(Array.isArray(orders[id])&&orders[id].length===3&&new Set(orders[id]).size===3&&orders[id].every(v=>q.options.some(o=>o[0]===v)))s.studio.quizOrders[id]=orders[id];
 s.live=cleanLive(raw.live);
 s.support={open:raw.support?.open===true,at:typeof raw.support?.at==='string'?raw.support.at.slice(0,40):'',page:D.pages.some(p=>p.id===raw.support?.page)?raw.support.page:s.slide};
 sync(s);return s;
}
function cleanLive(raw){const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;const id=/^[0-9a-f-]{36}$/i;for(const [key,a]of Object.entries(raw).slice(-8)){if(!a||typeof a!=='object'||!id.test(a.roomId)||![1,2].includes(a.round)||!['initial','revision'].includes(a.kind)||key!==a.roomId+':'+a.round+':'+a.kind)continue;out[key]={studentId:id.test(a.studentId||'')?a.studentId:'',roomId:a.roomId,round:a.round,kind:a.kind,code:String(a.code||'').slice(0,2400),output:'',error:'',version:Number.isSafeInteger(a.version)&&a.version>=0?a.version:0,submitted:a.submitted===true,dirty:a.dirty===true,editedAt:String(a.editedAt||'').slice(0,40),history:(Array.isArray(a.history)?a.history:[]).slice(-12).map(h=>({action:['save','submit','draft'].includes(h?.action)?h.action:'draft',at:String(h?.at||'').slice(0,40),code:String(h?.code||'').slice(0,2400)}))};}while(new TextEncoder().encode(JSON.stringify(out)).length>400000){const oldest=Object.values(out).find(a=>a.history.length);if(!oldest)break;oldest.history.shift();}return out;}
function sync(s){s.feature.outA=s.studio.paperA?'Student marked Section A complete; inspect the paper.':'';s.feature.outB=s.studio.paperB?'Student marked Section B complete; inspect the drawing.':'';return s;}
function focus(s){const counts={K:0,S:0,U:0};let missing=0;for(const c of D.checks){const v=s.learning[c.id];if(!v)missing++;if(v==='new'||v==='help')counts[c.area]++;}const max=Math.max(...Object.values(counts));return {counts,missing,max,winners:max?Object.keys(counts).filter(a=>counts[a]===max):[]};}
function phaseSummary(s){const counts={};for(const v of Object.values(s.pit))if(D.phases.some(p=>p.id===v))counts[v]=(counts[v]||0)+1;const total=Object.values(counts).reduce((a,b)=>a+b,0),max=Math.max(0,...Object.values(counts));return {total,max,winners:max?Object.keys(counts).filter(k=>counts[k]===max):[]};}
function toggleApp(s,id){if(!D.apps.some(a=>a.id===id))return false;const i=s.studio.selected.indexOf(id);if(i>=0)s.studio.selected.splice(i,1);else if(s.studio.selected.length<2)s.studio.selected.push(id);else return false;return true;}
const api={D,KEY,esc,initial,restore,sync,focus,phaseSummary,toggleApp,cleanLive};if(typeof module==='object'&&module.exports)module.exports=api;else root.StudioCore=api;
})(typeof window!=='undefined'?window:globalThis);
