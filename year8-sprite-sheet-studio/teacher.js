'use strict';
const timing=document.querySelector('#timing'), readout=document.querySelector('#time'), start=document.querySelector('#start');
const schedule=[['Mission',5],['Do Now & Types of Learning',6],['Main Task 1',20],['Main Task 2',17],['Pit Stop & Go Further',7],['Plenary & submit',5]];
schedule.forEach(([s,m])=>timing.add(new Option(s,m)));
let left=300, ends=0;
function show(){const n=ends?Math.max(0,Math.ceil((ends-Date.now())/1000)):left;readout.textContent=Math.floor(n/60)+':'+String(n%60).padStart(2,'0');if(!n&&ends){ends=0;left=0;start.textContent='Start';}}
function reset(){ends=0;left=+timing.value*60;start.textContent='Start';show();}
timing.onchange=reset;document.querySelector('#reset').onclick=reset;
start.onclick=()=>{if(ends){left=Math.max(0,Math.ceil((ends-Date.now())/1000));ends=0;start.textContent='Resume';}else{if(!left)left=+timing.value*60;ends=Date.now()+left*1000;start.textContent='Pause';}show();};
setInterval(show,200);reset();
