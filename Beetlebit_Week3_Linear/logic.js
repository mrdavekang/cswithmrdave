/* Pure, independently testable rules. No network or student-data upload. */
(function(root){
'use strict';
const icons={diamond:['00100','01010','10001','01010','00100'],tick:['00000','00001','00010','10100','01000'],blank:['00000','00000','00000','00000','00000'],heart:['01010','11111','11111','01110','00100']};
const maps=[
 {size:3,start:{x:0,y:2,d:0},target:{x:1,y:1},obstacles:[],length:4},
 {size:4,start:{x:0,y:3,d:0},target:{x:2,y:2},obstacles:[{x:1,y:3},{x:1,y:2}],length:8}
];
function route(seq,level=0){
 const map=maps[level]||maps[0];let {x,y,d}=map.start;const trace=[{x,y,d}],delta=[[0,-1],[1,0],[0,1],[-1,0]];
 if(!Array.isArray(seq)||seq.length!==map.length||seq.some(c=>!['F','R','S'].includes(c)))return {success:false,status:'invalid',trace,at:0};
 for(let i=0;i<seq.length;i++){
  const c=seq[i];if(c==='R')d=(d+1)%4;
  if(c==='F'){
   const nx=x+delta[d][0],ny=y+delta[d][1];
   if(nx<0||nx>=map.size||ny<0||ny>=map.size)return {success:false,status:'outside',trace,at:i+1};
   if(map.obstacles.some(p=>p.x===nx&&p.y===ny))return {success:false,status:'blocked',trace,at:i+1};
   x=nx;y=ny;
  }
  trace.push({x,y,d});
  if(c==='S'){
   const success=x===map.target.x&&y===map.target.y&&i===seq.length-1;
   return {success,status:success?'success':i<seq.length-1?'early':'target',trace,at:i+1};
  }
 }
 return {success:false,status:'missing',trace,at:seq.length};
}
const signalTiles={diamond:{en:'show icon · diamond',ko:'마름모 보여 주기',icon:'diamond'},clear:{en:'clear screen',ko:'화면 지우기',icon:'blank'},'pause-a':{en:'pause (ms) 500',ko:'500밀리초 기다리기'},'pause-b':{en:'pause (ms) 500',ko:'500밀리초 기다리기'},tick:{en:'show icon · tick',ko:'체크 표시 보여 주기',icon:'tick'}};
function signalCheck(order){
 const target=['diamond','pause','clear','pause','tick'];
 if(!Array.isArray(order)||order.length!==5||new Set(order).size!==5||order.some(v=>!signalTiles[v]))return {success:false,at:0};
 const actual=order.map(v=>v.startsWith('pause-')?'pause':v);const at=actual.findIndex((v,i)=>v!==target[i]);
 return {success:at===-1,at:at===-1?0:at+1};
}
function groupValue(v){const n=Number(v);return v!==''&&Number.isInteger(n)&&n>=0&&n<=255?n:23;}
function radioTrace(senderGroup,receiverGroup,message,level=1){
 if(groupValue(senderGroup)!==groupValue(receiverGroup))return {received:false,events:[],reason:'group'};
 if(message==='HELP')return {received:true,events:['diamond','pause','blank','pause','diamond','pause','blank','pause','tick'],reason:'matched'};
 if(message==='SAFE'&&level===2)return {received:true,events:['heart'],reason:'matched'};
 return {received:true,events:[],reason:'unmatched'};
}
function source(kind='starter',group=23){
 const flash='    basic.showIcon(IconNames.Diamond)\n    basic.pause(500)\n    basic.clearScreen()\n    basic.pause(500)\n';
 if(kind.startsWith('radio')){
  const g=groupValue(group);const startup=`radio.setGroup(${g})\nbasic.showIcon(IconNames.Yes)\n`;
  if(kind==='radio-controller-1'||kind==='radio-controller-2')return 'input.onButtonPressed(Button.A, function () {\n    radio.sendString("HELP")\n})\n'+(kind.endsWith('2')?'input.onButtonPressed(Button.B, function () {\n    radio.sendString("SAFE")\n})\n':'')+startup;
  const inner=kind==='radio-receiver-starter'?'        basic.showIcon(IconNames.Diamond)\n':(flash+flash+'    basic.showIcon(IconNames.Yes)\n').split('\n').filter(Boolean).map(v=>'    '+v).join('\n')+'\n';
  return 'radio.onReceivedString(function (receivedString) {\n    if (receivedString == "HELP") {\n'+inner+'    }'+(kind==='radio-receiver-2'?' else if (receivedString == "SAFE") {\n        basic.showIcon(IconNames.Heart)\n    }':'')+'\n})\n'+startup;
 }
 const body=kind==='starter'?'    basic.showIcon(IconNames.Diamond)\n':kind==='repeat'?'    for (let index = 0; index < 2; index++) {\n'+flash.split('\n').filter(Boolean).map(x=>'    '+x).join('\n')+'\n    }\n    basic.showIcon(IconNames.Yes)\n':flash+flash+'    basic.showIcon(IconNames.Yes)\n';
 return 'input.onButtonPressed(Button.A, function () {\n'+body+'})\nbasic.showIcon(IconNames.Yes)\n';
}
function project(name,code){
 const cfg={name,description:'Week 3: LED sequences and two-board radio. No motors.',dependencies:{core:'*',...(code.includes('radio.')?{radio:'*'}:{})},files:['main.ts'],preferredEditor:'blocksprj'};
 return JSON.stringify({meta:{cloudId:'ks/microbit',editor:'blocksprj',name},source:JSON.stringify({'pxt.json':JSON.stringify(cfg,null,2),'main.ts':code})},null,2);
}
function storageKey(name,klass,legacy=false){const txt=JSON.stringify([name.trim().toLowerCase(),klass.trim().toLowerCase()]);let h=2166136261;for(let i=0;i<txt.length;i++){h^=txt.charCodeAt(i);h=Math.imul(h,16777619);}return (legacy?'beetlebit-w3-beacon-v2-':'beetlebit-w3-radio-v3-')+(h>>>0).toString(36)+'-'+txt.length;}
const api={icons,maps,route,signalTiles,signalCheck,groupValue,radioTrace,source,project,storageKey};if(typeof module==='object'&&module.exports)module.exports=api;else root.BeaconLogic=api;
})(typeof globalThis==='object'?globalThis:this);
