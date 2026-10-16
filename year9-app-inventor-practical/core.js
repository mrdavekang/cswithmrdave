(function(root){'use strict';
const D=typeof module==='object'&&module.exports?require('./content.js'):root.PracticalContent;
const KEY='mrdave-year9-mit-practical-v1';
const text=(v,n=400)=>typeof v==='string'?v.slice(0,n):'';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shuffle(items,rng=Math.random){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function orders(raw={}){const out={};for(const [id,q] of Object.entries(D.quiz)){const valid=q.options.map(o=>o.id),saved=raw[id];out[id]=Array.isArray(saved)&&saved.length===valid.length&&new Set(saved).size===valid.length&&saved.every(x=>valid.includes(x))?saved.slice():shuffle(valid);}return out;}
function initial(){return {version:1,joined:false,student:{name:'',form:''},lang:'en',guided:false,slide:'mission',unlocked:0,route:'',topic:'own',device:'',access:'',words:{title:'',intro:'',button:'',response:'',reset:''},learning:{},pit:{},answers:{},attempted:{},optionOrders:orders(),work:{},helpFlags:[],demo:{topic:'fashion',clicked:false},tutor:0,challenge:'',downloaded:false,visited:[],updated:''};}
function guidedName(name){const v=text(name,100).normalize('NFKC').toLowerCase().replace(/[^a-z]/g,'');for(let i=0;i<=v.length-6;i++){let h=2166136261;for(const c of v.slice(i,i+6))h=Math.imul(h^c.charCodeAt(0),16777619);if((h>>>0)===3309519253)return true;}return false;}
function path(s){return D.pages.filter(p=>!(p.id==='idea-topic'&&s.route==='sketch'));}
function next(s){const a=path(s),i=a.findIndex(p=>p.id===s.slide);return a[Math.min(a.length-1,i+1)]?.id||'mission';}
function previous(s){const a=path(s),i=a.findIndex(p=>p.id===s.slide);return a[Math.max(0,i-1)]?.id||'mission';}
function index(id){return D.pages.findIndex(p=>p.id===id);}
function canVisit(s,id,teacher=false){return index(id)>=0&&(teacher||index(id)<=s.unlocked)&&!(id==='idea-topic'&&s.route==='sketch'&&!teacher);}
function visit(s,id,teacher=false){if(!canVisit(s,id,teacher))return false;s.slide=id;if(!s.visited.includes(id))s.visited.push(id);return true;}
function advance(s){const id=next(s);s.unlocked=Math.max(s.unlocked,index(id));visit(s,id);return id;}
function dominant(values){const counts={};for(const value of values.filter(Boolean))counts[value]=(counts[value]||0)+1;const max=Math.max(0,...Object.values(counts));return {counts,total:values.filter(Boolean).length,max,winners:max?Object.keys(counts).filter(k=>counts[k]===max):[]};}
function focus(s){return dominant(D.checks.filter(x=>['new','help'].includes(s.learning[x.id])).map(x=>x.area));}
function topic(s){return D.topics.find(t=>t.id===s.topic)||null;}
function seedTopic(s,id){const old=topic(s),t=D.topics.find(t=>t.id===id);for(const k of ['title','intro','button','response'])if(!s.words[k].trim()||(old&&s.words[k]===old[k]))s.words[k]=t?.[k]||'';s.topic=t?.id||'own';}
function statusFor(s,p){if(s.access==='waiting'&&['main1','main2','save'].includes(p.group))return 'awaiting-access';if(['try-button','try-reset','connection-code','connect'].includes(p.id)&&s.device==='no-device')return 'not-tried';return 'done';}
function restore(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==1)throw new Error('Choose a backup from this MIT practical lesson.');const s=initial();
 s.joined=!!raw.joined;s.student={name:text(raw.student?.name,90),form:text(raw.student?.form,35)};s.lang=raw.lang==='bi'?'bi':'en';s.guided=!!raw.guided;s.unlocked=Math.max(0,Math.min(D.pages.length-1,Number.isInteger(raw.unlocked)?raw.unlocked:0));
 s.slide=D.pages.some(p=>p.id===raw.slide)&&index(raw.slide)<=s.unlocked?raw.slide:'mission';
 s.route=['sketch','quick'].includes(raw.route)?raw.route:'';s.topic=D.topics.some(t=>t.id===raw.topic)?raw.topic:'own';s.device=['computer','ipad','no-device'].includes(raw.device)?raw.device:'';s.access=['ready','waiting'].includes(raw.access)?raw.access:'';
 for(const k of ['title','intro','button','response','reset'])s.words[k]=text(raw.words?.[k],k==='response'?240:120);
 for(const x of D.checks)if(D.starting.some(o=>o.id===raw.learning?.[x.id]))s.learning[x.id]=raw.learning[x.id];
 for(const a of ['K','S','U'])if(D.phases.some(p=>p.id===raw.pit?.[a]))s.pit[a]=raw.pit[a];
 for(const [id,q] of Object.entries(D.quiz)){if(q.options.some(o=>o.id===raw.answers?.[id]))s.answers[id]=raw.answers[id];s.attempted[id]=!!raw.attempted?.[id];}
 s.optionOrders=orders(raw.optionOrders);
 for(const p of D.pages)if(['done','help','not-tried','awaiting-access','needs-fix'].includes(raw.work?.[p.id]))s.work[p.id]=raw.work[p.id];
 s.helpFlags=Array.isArray(raw.helpFlags)?raw.helpFlags.filter(x=>typeof x==='string'&&(D.pages.some(p=>p.id===x)||Object.hasOwn(D.help,x))).slice(0,50):[];
 s.demo={topic:D.topics.some(t=>t.id===raw.demo?.topic)?raw.demo.topic:'fashion',clicked:!!raw.demo?.clicked};s.tutor=Math.max(0,Math.min(2,Number(raw.tutor)||0));s.challenge=['image','reset'].includes(raw.challenge)?raw.challenge:'';s.downloaded=!!raw.downloaded;
 s.visited=Array.isArray(raw.visited)?[...new Set(raw.visited.filter(id=>D.pages.some(p=>p.id===id)))]:[];s.updated=text(raw.updated,60);return s;
}
const api={D,KEY,esc,shuffle,orders,initial,guidedName,path,next,previous,index,canVisit,visit,advance,dominant,focus,topic,seedTopic,statusFor,restore};
if(typeof module==='object'&&module.exports)module.exports=api;else root.PracticalCore=api;
})(typeof window==='undefined'?globalThis:window);
