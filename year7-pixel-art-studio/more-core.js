(() => {
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const rowsOK=(x,n=8)=>Array.isArray(x)&&x.length===n&&x.every(r=>typeof r==='string'&&new RegExp(`^[01]{${n}}$`).test(r));
 const dataQuestions=[
  {id:'pixels',en:'An 8×8 picture has how many pixels?',zh:'8×8图片共有多少个像素？',answer:64,unit:'pixels',rows:8,why:'8 rows × 8 pixels = 64 pixels.',whyZh:'8行×每行8个像素＝64个像素。'},
  {id:'bytes',en:'At one bit per pixel, how many bytes of pixel data does an 8×8 picture need?',zh:'每个像素用一位，8×8图片需要多少字节的像素数据？',answer:8,unit:'bytes',rows:8,why:'Each row has 8 bits = 1 byte. Eight rows use 8 bytes.',whyZh:'每行8位＝1字节。八行需要8字节。'},
  {id:'transfer',en:'A picture is 8 pixels wide and 4 rows high. At one bit per pixel, how many bytes of pixel data does it need?',zh:'图片宽8个像素、高4行。每像素用一位，共需要多少字节的像素数据？',answer:4,unit:'bytes',rows:4,why:'4 rows × 8 bits = 32 bits. 32 ÷ 8 = 4 bytes.',whyZh:'4行×每行8位＝32位。32÷8＝4字节。'}
 ];
 function invert(rows){return rows.map(r=>[...r].map(b=>b==='1'?'0':'1').join(''));}
 function reshape(bits,width){if(!/^[01]+$/.test(bits)||!Number.isInteger(width)||width<1||bits.length%width)throw Error('Use a width that divides the bit count.');return Array.from({length:bits.length/width},(_,i)=>bits.slice(i*width,(i+1)*width));}
 function upscale(rows){if(!rowsOK(rows))throw Error('Use an 8×8 source.');return rows.flatMap(r=>{const d=[...r].map(b=>b+b).join('');return[d,d];});}
 function toggle16(rows,r,c){if(!rowsOK(rows,16)||r<0||r>15||c<0||c>15)return rows;return rows.map((s,i)=>i===r?s.slice(0,c)+(s[c]==='1'?'0':'1')+s.slice(c+1):s);}
 function countBlack(rows){return rows.reduce((n,r)=>n+[...r].filter(b=>b==='1').length,0);}
 function colourDecode(s){const b=String(s).normalize('NFKC').replace(/\s/g,'');if(!/^[01]+$/.test(b)||b.length%2)throw Error('Use pairs of bits.');return b.match(/../g).map(x=>parseInt(x,2));}
 function colourEncode(values){if(!Array.isArray(values)||values.some(x=>!Number.isInteger(x)||x<0||x>3))throw Error('Choose one of four colours.');return values.map(x=>x.toString(2).padStart(2,'0')).join(' ');}
 const colourTarget='00 01 10 11 00 10 01 11';
 function defaults(){return{investigations:{inversion:{prediction:null,tested:false,answer:null,checks:[]},order:{prediction:null,tested:false,answer:null,restored:false,checks:[]},metadata:{width:8,tested:[],selected:[],checks:[]}},dataIndex:0,dataAnswers:{},purpose:'game',advanced:{resolution:{prediction:null,grid:null,quadrant:0,edits:0,answer:null,started:false},colour:{values:Array(8).fill(0),brush:1,mode:'decode',checks:[],started:false},budget:{grid:Array(8).fill('00000000'),checks:[],answer:null,started:false}}};}
 function upgrade(s){
  const d=defaults();if(!record(s.investigations))s.investigations=d.investigations;
  for(const k of ['inversion','order','metadata']){s.investigations[k]=Object.assign(record(s.investigations[k])?s.investigations[k]:{},{...d.investigations[k],...(record(s.investigations[k])?s.investigations[k]:{})});if(!Array.isArray(s.investigations[k].checks))s.investigations[k].checks=[];}
  const m=s.investigations.metadata;m.width=m.width===16?16:8;m.tested=Array.isArray(m.tested)?m.tested.filter(x=>[8,16].includes(x)):[];m.selected=Array.isArray(m.selected)?m.selected.filter(x=>['size','key','order','name'].includes(x)):[];
  if(!record(s.dataAnswers))s.dataAnswers={};s.dataIndex=[0,1,2].includes(s.dataIndex)?s.dataIndex:0;
  if(!record(s.advanced))s.advanced=d.advanced;for(const k of ['resolution','colour','budget'])s.advanced[k]=Object.assign(record(s.advanced[k])?s.advanced[k]:{},{...d.advanced[k],...(record(s.advanced[k])?s.advanced[k]:{})});
  const res=s.advanced.resolution;if(res.grid&&!rowsOK(res.grid,16))res.grid=null;res.quadrant=[0,1,2,3].includes(res.quadrant)?res.quadrant:0;
  const col=s.advanced.colour;if(!Array.isArray(col.values)||col.values.length!==8||col.values.some(x=>![0,1,2,3].includes(x)))col.values=Array(8).fill(0);col.brush=[0,1,2,3].includes(col.brush)?col.brush:1;col.mode=col.mode==='free'?'free':'decode';if(!Array.isArray(col.checks))col.checks=[];
  if(!rowsOK(s.advanced.budget.grid))s.advanced.budget.grid=d.advanced.budget.grid;if(!Array.isArray(s.advanced.budget.checks))s.advanced.budget.checks=[];
  for(const p of s.projects){if(p.version1&&!rowsOK(p.version1.original))p.version1=null;if(p.version2&&(!rowsOK(p.version2.grid)||!Array.isArray(p.version2.codes)||p.version2.codes.length!==8))p.version2=null;if(p.version2){const v=p.version2;v.codes=v.codes.map(x=>String(x||'').slice(0,40));v.checks=Array.isArray(v.checks)?v.checks:[];v.row=Math.max(0,Math.min(7,Number(v.row)||0));v.tab=[0,1,2].includes(v.tab)?v.tab:0;v.reason=String(v.reason||'').slice(0,600);v.undo=Array.isArray(v.undo)?v.undo.filter(x=>rowsOK(x)).slice(-40):[];if(v.built&&(!Array.isArray(v.built)||v.built.length!==8||v.built.some(x=>x!==null&&!/^[01]{8}$/.test(x))))v.built=null;}}
  return s;
 }
 function beginVersion(p){if(!p.version1)p.version1={original:[...p.original],codes:[...p.codes],at:new Date().toISOString()};if(!p.version2)p.version2={grid:[...p.version1.original],codes:[...p.version1.codes],row:0,tab:0,built:null,builtFrom:null,checks:[],reason:'',undo:[]};return p.version2;}
 function versionDiff(p){return globalThis.PixelCore.differences(p.version1.original,p.version2.grid);}
 function versionStatus(p){if(!p.version2)return'not-started';const v=p.version2;if(!v.checks.length)return'in-progress';const C=globalThis.PixelCore,b=C.rebuild(v.codes);return versionDiff(p).length>0&&b.every(Boolean)&&C.differences(v.grid,b).length===0&&v.builtFrom?.join('|')===v.codes.map(C.normalize).join('|')?'complete':'review';}
 function checked(x,ok){return x.checks.length?(ok?'complete':'review'):(Array.isArray(x.tested)?x.tested.length:x.tested)?'in-progress':x.prediction!=null?'in-progress':'not-started';}
 function checklist(s){upgrade(s);const a=s.investigations;return[
  {id:'inversion',stage:3,mission:3,label:'Investigate the colour rule',labelZh:'探究颜色规则',status:checked(a.inversion,a.inversion.tested&&a.inversion.answer===1)},
  {id:'order',stage:3,mission:4,label:'Investigate reading order',labelZh:'探究读取顺序',status:checked(a.order,a.order.tested&&a.order.answer===0&&a.order.restored)},
  {id:'metadata',stage:3,mission:5,label:'Find the missing picture instructions',labelZh:'找出缺少的图片信息',status:checked(a.metadata,[8,16].every(x=>a.metadata.tested.includes(x))&&['size','key','order'].every(x=>a.metadata.selected.includes(x))&&!a.metadata.selected.includes('name'))},
  {id:'version2',stage:5,step:4,label:'Improve and test version 2',labelZh:'改进并测试第二版',status:versionStatus(s.projects[0])},
  {id:'picturedata',stage:5,step:5,label:'Picture bits and bytes',labelZh:'图片中的位与字节',status:dataQuestions.every(q=>s.dataAnswers[q.id]?.correct)?'complete':Object.values(s.dataAnswers).some(x=>x.attempts?.length)?'review':'not-started'}
 ];}
 globalThis.PixelMoreCore={copy,defaults,upgrade,invert,reshape,upscale,toggle16,countBlack,colourDecode,colourEncode,colourTarget,dataQuestions,beginVersion,versionDiff,versionStatus,checklist};
})();
