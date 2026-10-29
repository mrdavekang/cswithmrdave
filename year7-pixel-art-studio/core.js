/* Pure lesson rules. No DOM, network calls, student data or keyword gates. */
(() => {
 'use strict';
 const blank=()=>Array(8).fill('00000000');
 const normalize=s=>String(s??'').normalize('NFKC').replace(/\s/g,'');
 function inspect(s){const bits=normalize(s);return{bits,valid:/^[01]{8}$/.test(bits),length:bits.length,nonBinary:/[^01]/.test(bits)};}
 function validateGrid(rows){return Array.isArray(rows)&&rows.length===8&&rows.every(r=>typeof r==='string'&&/^[01]{8}$/.test(r));}
 function toggle(rows,r,c){if(!validateGrid(rows)||r<0||r>7||c<0||c>7)return rows;return rows.map((s,i)=>i===r?s.slice(0,c)+(s[c]==='0'?'1':'0')+s.slice(c+1):s);}
 function differences(a,b){let diff=[];for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(a[r]!=null&&b[r]!=null&&a[r][c]!==b[r][c])diff.push({row:r,col:c,expected:a[r][c],actual:b[r][c]});return diff;}
 function rebuild(codes){return Array.from({length:8},(_,r)=>{const v=inspect(codes[r]);return v.valid?v.bits:null;});}
 function mirror(rows){return rows.map(r=>[...r].reverse().join(''));}
 function shiftRight(rows){return rows.map(r=>'0'+r.slice(0,7));}
 function fnv(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.codePointAt(0),16777619);return(h>>>0).toString(36);}
 function profileKey(name,cls){const clean=x=>String(x).normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');return fnv(clean(name)+'|'+clean(cls));}
 const ghost=['00111100','01111110','11111111','11011011','11111111','11111111','10100101','00000000'];
 const repair=['00111100','01000010','10100101','10000001','10100101','10011001','01000010','00111100'];
 const repairStart=level=>level===1?toggle(repair,2,2):toggle(toggle(repair,0,3),5,4);
 const arrow=['00010000','00011000','11111100','11111110','11111100','00011000','00010000','00000000'];
 const tree=['00000000','00100000','01110000','11111000','00100000','00100000','00000000','00000000'];
 const diamond=['00011000','00111100','01111110','11111111','11111111','01111110','00111100','00011000'];
 function project(){return{original:blank(),codes:Array(8).fill(''),selectedRow:0,step:0,undo:[],touches:0,checks:{},built:null,builtFrom:null,compared:false,compares:[],explanation:'',savedImage:false};}
 function initial(name,cls,teacher=false){return{schema:1,lesson:'year7-week10-pixel-art-studio',id:globalThis.crypto?.randomUUID?.()||'pixel-'+Date.now()+'-'+Math.random().toString(36).slice(2),name,cls,teacher,stage:0,language:'en',theme:'garden',createdAt:new Date().toISOString(),updatedAt:null,starter:{},ksu:{},ksuTab:0,learnStep:0,learnSeen:[],briefSeen:false,mission:0,row:Array(8).fill('0').join(''),rowChecks:[],mystery:blank(),mysteryRow:0,mysteryChecks:{},repairLevel:1,repairs:{1:{grid:repairStart(1),checks:[]},2:{grid:repairStart(2),checks:[]}},projects:[project(),project()],design:0,extra:'mirror',extras:{mirror:{grid:[...arrow],checks:[],started:false},move:{grid:[...tree],checks:[],started:false},mystery:{grid:blank(),checks:[],started:false},create:{started:false}},pit:{phase:'',next:''},plenary:{},finished:false,visits:{},events:[]};}
 function restore(raw){
  if(!raw||raw.schema!==1||raw.lesson!=='year7-week10-pixel-art-studio'||typeof raw.name!=='string'||typeof raw.cls!=='string')throw Error('This is not a Pixel Art Studio backup.');
  if(raw.name.length>120||raw.cls.length>40)throw Error('The backup name or class is too long.');
  const s={...initial(raw.name,raw.cls,raw.teacher===true),...raw};
  const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
  for(const k of ['starter','ksu','mysteryChecks','repairs','extras','pit','plenary','visits'])if(!record(s[k]))throw Error('The backup structure is incomplete. Your current work is unchanged.');
  if(!Array.isArray(s.rowChecks)||!Array.isArray(s.learnSeen))throw Error('The backup progress is incomplete.');
  s.learnSeen=[...new Set(s.learnSeen.filter(x=>[0,1,2].includes(x)))];s.language=s.language==='zh'?'zh':'en';s.theme=['garden','ocean','arcade','paper'].includes(s.theme)?s.theme:'garden';
  if(!Array.isArray(s.projects)||s.projects.length!==2)throw Error('The drawing data is missing.');
  for(const p of s.projects){if(!record(p)||!validateGrid(p.original)||!Array.isArray(p.codes)||p.codes.length!==8||p.codes.some(x=>typeof x!=='string'||x.length>80))throw Error('A picture or its binary rows could not be read.');p.undo=Array.isArray(p.undo)?p.undo.filter(validateGrid).slice(-40):[];if(p.built!==null&&(!Array.isArray(p.built)||p.built.length!==8||p.built.some(x=>x!==null&&!/^[01]{8}$/.test(x))))throw Error('The rebuilt image is invalid.');p.checks=record(p.checks)?p.checks:{};p.compares=Array.isArray(p.compares)?p.compares:[];p.touches=Number(p.touches)||0;p.explanation=String(p.explanation||'').slice(0,600);p.builtFrom=Array.isArray(p.builtFrom)&&p.builtFrom.length===8?p.builtFrom:null;}
  if(!validateGrid(s.mystery))throw Error('The mystery picture is invalid.');
  for(const n of [1,2])if(!record(s.repairs[n])||!validateGrid(s.repairs[n].grid)||!Array.isArray(s.repairs[n].checks))throw Error('The repair picture is invalid.');
  for(const k of ['mirror','move','mystery'])if(!record(s.extras[k])||!validateGrid(s.extras[k].grid)||!Array.isArray(s.extras[k].checks))throw Error('An extra picture is invalid.');
  s.extras.create=record(s.extras.create)?s.extras.create:{started:false};s.extra=['mirror','move','mystery','create','resolution','colour','budget'].includes(s.extra)?s.extra:'mirror';
  s.stage=Number.isInteger(s.stage)?Math.min(9,Math.max(0,s.stage)):0;s.design=s.design===1?1:0;s.mission=[0,1,2,3,4,5].includes(s.mission)?s.mission:0;s.learnStep=[0,1,2].includes(s.learnStep)?s.learnStep:0;s.ksuTab=[0,1,2].includes(s.ksuTab)?s.ksuTab:0;
  s.repairLevel=s.repairLevel===2?2:1;s.mysteryRow=Math.min(7,Math.max(0,Number(s.mysteryRow)||0));
  if(!/^[01]{8}$/.test(s.row))s.row='00000000';s.events=Array.isArray(s.events)?s.events.slice(-3000):[];
  for(const p of s.projects){p.selectedRow=Math.min(7,Math.max(0,Number(p.selectedRow)||0));p.step=Math.min(5,Math.max(0,Number(p.step)||0));}
  s.afterPlenary=[0,1,2].includes(s.afterPlenary)?s.afterPlenary:0;
  if(globalThis.PixelWorkings)s.workings=PixelWorkings.clean(s.workings);
  return globalThis.PixelMoreCore?PixelMoreCore.upgrade(s):s;
 }
 function lastStatus(checks,correct){return checks?.length?(correct?'complete':'review'):'not-started';}
 function checklist(s){const p=s.projects[0],codeValid=p.codes.every(x=>inspect(x).valid),builtCurrent=p.builtFrom?.join('|')===p.codes.map(normalize).join('|'),match=p.built&&p.built.every(Boolean)&&differences(p.original,p.built).length===0;
  const q=(id,k)=>({id,stage:0,label:k,status:s.starter[id]?s.starter[id].correct?'complete':'review':'not-started'});
  return[
   q('byte','Eight bits'),q('number','Read a score'),q('pixels','Read the picture key'),
   {id:'ksu',stage:1,label:'My learning starting point',status:['knowledge','skills','understanding'].every(k=>s.ksu[k]!==undefined)?'complete':Object.keys(s.ksu).length?'in-progress':'not-started'},
   {id:'learn',stage:2,label:'Pixels, encoding and decoding',status:s.learnSeen.length===3?'complete':s.learnSeen.length?'in-progress':'not-started'},
   {id:'row',stage:3,mission:0,label:'Mission A · decode one row',status:lastStatus(s.rowChecks,s.row==='00111100')},
   {id:'mystery',stage:3,mission:1,label:'Mission B · mystery picture',status:Object.keys(s.mysteryChecks).length?Object.keys(s.mysteryChecks).length===8&&differences(ghost,s.mystery).length===0?'complete':'review':'not-started'},
   {id:'repair',stage:3,mission:2,label:'Mission C · repair the picture',status:lastStatus(s.repairs[1].checks,differences(repair,s.repairs[1].grid).length===0)},
   {id:'brief',stage:4,label:'The four-step studio method',status:s.briefSeen?'complete':'not-started'},
   {id:'draw',stage:5,step:0,label:'Draw my icon',status:p.touches?'complete':'not-started'},
   {id:'encode',stage:5,step:1,label:'Encode eight rows',status:codeValid?differences(p.original,p.codes.map(normalize)).length===0?'complete':'review':p.codes.some(Boolean)?'in-progress':'not-started'},
   {id:'compare',stage:5,step:3,label:'Rebuild and compare',status:p.compared?builtCurrent&&match?'complete':'review':p.built?'in-progress':'not-started'},
   {id:'pit',stage:7,label:'Learning pitstop',status:s.pit.phase&&s.pit.next?'complete':s.pit.phase?'in-progress':'not-started'},
   {id:'plenary',stage:8,label:'Three exit checks',status:Object.keys(s.plenary).length===3?Object.values(s.plenary).every(x=>x.correct)?'complete':'review':Object.keys(s.plenary).length?'in-progress':'not-started'},
   {id:'finish',stage:9,label:'Save and finish',status:s.finished?'complete':'not-started'},
   ...(globalThis.PixelMoreCore?PixelMoreCore.checklist(s):[])
  ].sort((a,b)=>a.stage-b.stage||(a.mission??a.step??0)-(b.mission??b.step??0));
 }
 globalThis.PixelCore={blank,normalize,inspect,validateGrid,toggle,differences,rebuild,mirror,shiftRight,profileKey,ghost,repair,repairStart,arrow,tree,diamond,initial,restore,checklist};
})();
