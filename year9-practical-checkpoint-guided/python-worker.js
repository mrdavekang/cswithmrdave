/* Local Python 3 subset (Skulpt), isolated from the lesson and student storage. */
'use strict';
let pending=null, running=false, outputSize=0, inputId=0;
self.onmessage=async({data})=>{
 if(data?.type==='input'){
  if(pending&&data.id===pending.id&&typeof data.value==='string'){
   const p=pending;pending=null;
   Sk.execStart=Number(Sk.execStart)+(Date.now()-p.started);
   p.resolve(data.value.slice(0,500));
  }
  return;
 }
 if(data?.type!=='run'||running||typeof data.code!=='string'||data.code.length>20000)return;
 running=true;
 try{
  importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
  Sk.configure({__future__:Sk.python3,execLimit:4000,
   output:text=>{outputSize+=String(text).length;if(outputSize>12000)throw Error('Output limit reached. Check for a repeating print.');postMessage({type:'output',text:String(text)});},
   read:name=>{const file=Sk.builtinFiles?.files[name];if(file===undefined)throw Error('Module unavailable: '+name);return file;},
   inputfun:prompt=>new Promise(resolve=>{pending={resolve,started:Date.now(),id:++inputId};postMessage({type:'input',id:pending.id,prompt:String(prompt)});}),inputfunTakesPrompt:true
  });
  await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,data.code,true));
  postMessage({type:'done'});
 }catch(error){postMessage({type:'error',error:String(error).slice(0,3000)});}
};
