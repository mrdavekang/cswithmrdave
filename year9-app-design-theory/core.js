(function(root){
  'use strict';
  const VERSION=1, KEY='mrdave-year9-app-design-v1';
  const stages=[['read','Read first','先读一读',4],['starter','Do now','课前练习',4],['learning','Types of learning','学习重点',2],['setup','MIT setup','设置 MIT',10],['investigate','Main Task 1','主任务 1',8],['reset','Quick reset','轻松回顾',2],['design','Main Task 2','主任务 2',21],['challenge','Further challenge','进一步挑战',3],['pitstop','Learning Pit Stop','学习加油站',2],['finish','Plenary & save','总结与保存',4]];
  const checks=[
    {id:'k1',area:'K',en:'Identify an interface.',zh:'识别什么是界面。',evidence:'Do now 1'},
    {id:'k2',area:'K',en:'Identify a user event and an app response.',zh:'识别用户事件和应用的回应。',evidence:'Do now 2–3'},
    {id:'s1',area:'S',en:'Record two precise action–response pairs.',zh:'准确记录两组“操作—回应”。',evidence:'Main Task 1'},
    {id:'s2',area:'S',en:'Label controls in my own screen sketch.',zh:'在自己的界面草图中标注控件。',evidence:'Main Task 2'},
    {id:'u1',area:'U',en:'Explain why a clear control label helps a user.',zh:'解释清楚的控件标签为什么能帮助用户。',evidence:'Do now 4 / Main Task 1'},
    {id:'u2',area:'U',en:'Connect my app’s content and controls to its audience.',zh:'让应用的内容和控件适合目标用户。',evidence:'Main Task 2'}
  ];
  function initial(){return {version:VERSION,student:{name:'',form:''},joined:false,lang:'en',guided:false,stage:'read',done:[],answers:{},checked:false,learning:{},setup:{route:'new',step:0,status:'not-started'},investigate:{source:'own',app:'',pairs:[{action:'',response:''},{action:'',response:''}],label:'',reason:''},reset:{index:0,answers:{}},design:{step:0,title:'',topic:'',audience:'',feature:'',method:'digital',nodes:[],photo:'',paper:false,pairs:[{action:'',response:''},{action:'',response:''}],review:[false,false],changeArea:'',change:''},challenge:{choice:'',note:''},pitstop:{},plenary:{event:'',reason:''},updated:''};}
  const text=(v,n=2500)=>typeof v==='string'?v.slice(0,n):'';
  function guidedName(name){
    const value=text(name).normalize('NFKC').toLowerCase().replace(/[^a-z]/g,'');
    const matches=value=>{let h=2166136261;for(const c of value)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0)===3309519253;};
    for(let i=0;i<=value.length-6;i++)if(matches(value.slice(i,i+6)))return true;
    return false;
  }
  function cleanNode(v){if(!v||!['text','button','image','input','menu'].includes(v.type))return null;return {id:text(v.id,50)||'node',type:v.type,label:text(v.label,120),x:Math.max(0,Math.min(v.type==='text'?56:v.type==='image'?72:70,Number(v.x)||0)),y:Math.max(0,Math.min(v.type==='image'?76:85,Number(v.y)||0))};}
  function restore(raw){
    if(!raw||raw.version!==VERSION||typeof raw!=='object')throw new Error('This is not a backup for this lesson.');
    const s=initial();
    s.student={name:text(raw.student?.name,90),form:text(raw.student?.form,50)};s.joined=!!raw.joined;s.lang=raw.lang==='bi'?'bi':'en';s.guided=!!raw.guided;s.stage=stages.some(x=>x[0]===raw.stage)?raw.stage:'read';s.done=Array.isArray(raw.done)?raw.done.filter(x=>stages.some(y=>x===y[0])):[];
    for(let i=0;i<4;i++)if(Number.isInteger(raw.answers?.[i])&&raw.answers[i]>=0&&raw.answers[i]<3)s.answers[i]=raw.answers[i];s.checked=!!raw.checked;
    checks.forEach(x=>{if(['secure','focus','untried'].includes(raw.learning?.[x.id]))s.learning[x.id]=raw.learning[x.id];});
    s.setup={route:raw.setup?.route==='existing'?'existing':'new',step:Math.max(0,Math.min(4,Number(raw.setup?.step)||0)),status:['not-started','waiting','ready','help'].includes(raw.setup?.status)?raw.setup.status:'not-started'};
    const pairs=v=>[0,1].map(i=>({action:text(v?.[i]?.action,350),response:text(v?.[i]?.response,700)}));
    const a=raw.investigate||{};s.investigate={source:a.source==='provided'?'provided':'own',app:text(a.app,120),pairs:pairs(a.pairs),label:text(a.label,150),reason:text(a.reason,700)};
    const d=raw.design||{};s.design={step:Math.max(0,Math.min(3,Number(d.step)||0)),title:text(d.title,100),topic:text(d.topic,600),audience:text(d.audience,350),feature:text(d.feature,900),method:d.method==='paper'?'paper':'digital',nodes:Array.isArray(d.nodes)?d.nodes.slice(0,30).map(cleanNode).filter(Boolean):[],photo:/^data:image\/(png|jpeg|webp);base64,/.test(d.photo||'')&&d.photo.length<3000000?d.photo:'',paper:!!d.paper,pairs:pairs(d.pairs),review:[!!d.review?.[0],!!d.review?.[1]],changeArea:text(d.changeArea,100),change:text(d.change,900)};
    s.reset={index:Math.max(0,Math.min(2,Number(raw.reset?.index)||0)),answers:{}};for(let i=0;i<3;i++)if(typeof raw.reset?.answers?.[i]==='boolean')s.reset.answers[i]=raw.reset.answers[i];
    s.challenge={choice:text(raw.challenge?.choice,100),note:text(raw.challenge?.note,1300)};['K','S','U'].forEach(a=>{if(['new','consolidating','easy','stuck'].includes(raw.pitstop?.[a]))s.pitstop[a]=raw.pitstop[a];});
    s.plenary={event:text(raw.plenary?.event,900),reason:text(raw.plenary?.reason,900)};s.updated=text(raw.updated,60);return s;
  }
  function dominance(values){const counts={};values.filter(Boolean).forEach(x=>counts[x]=(counts[x]||0)+1);const max=Math.max(0,...Object.values(counts));return {counts,max,winners:max?Object.keys(counts).filter(x=>counts[x]===max):[],total:values.filter(Boolean).length};}
  function learningFocus(s){return dominance(checks.filter(c=>s.learning[c.id]==='focus').map(c=>c.area));}
  function completeness(s){const d=s.design;return {brief:!!(d.title.trim()&&d.topic.trim()&&d.audience.trim()&&d.feature.trim()),sketch:d.method==='digital'?d.nodes.length>0:!!(d.paper||d.photo),interactions:d.pairs.filter(p=>p.action.trim()&&p.response.trim()).length===2,improvement:!!d.change.trim()};}
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const API={VERSION,KEY,stages,checks,initial,restore,dominance,learningFocus,completeness,guidedName,escape};if(typeof module==='object'&&module.exports)module.exports=API;else root.LessonCore=API;
})(typeof window==='undefined'?globalThis:window);
