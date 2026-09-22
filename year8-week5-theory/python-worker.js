'use strict';
let pending;
self.onmessage=async({data})=>{
 if(data.type==='input'&&pending){const p=pending;pending=null;Sk.execStart+=Date.now()-p.time;p.resolve(data.value);return;}
 if(data.type!=='run')return;
 try{
  importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
  let size=0;
  Sk.configure({__future__:Sk.python3,execLimit:3500,
   output:s=>{size+=s.length;if(size>16000)throw Error('Too much output. Check for a repeating print.');postMessage({type:'output',text:s});},
   read:n=>{if(Sk.builtinFiles.files[n]===undefined)throw Error('Module not available: '+n);return Sk.builtinFiles.files[n];},
   inputfun:p=>new Promise(resolve=>{pending={resolve,time:Date.now()};postMessage({type:'input',prompt:String(p)});}),inputfunTakesPrompt:true});
  await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,data.code,true));
  postMessage({type:'done'});
 }catch(e){postMessage({type:'error',error:String(e)});}
};
