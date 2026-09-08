/* Optional ordinary Python in an isolated worker. No micro:bit libraries or device access. */
let pendingInput=null;
self.onmessage=async({data})=>{
 if(data.type==='input'){if(pendingInput){const waiting=pendingInput;pendingInput=null;Sk.execStart=Number(Sk.execStart)+(Date.now()-waiting.started);waiting.resolve(String(data.value));}return;}
 if(data.type!=='run')return;
 try{
  importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
  Sk.configure({output:text=>postMessage({type:'output',text}),read:name=>{if(!Sk.builtinFiles?.files[name])throw Error('File not found: '+name);return Sk.builtinFiles.files[name];},__future__:Sk.python3,execLimit:10000,inputfun:prompt=>new Promise(resolve=>{pendingInput={resolve,started:Date.now()};postMessage({type:'input',prompt:String(prompt)});}),inputfunTakesPrompt:true});
  await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,data.code,true));postMessage({type:'done'});
 }catch(e){postMessage({type:'error',error:String(e)});}
};
