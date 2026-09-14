/* Short, device-local Python practice in an isolated worker. */
self.onmessage=async({data})=>{
 if(data?.type!=='run'||typeof data.code!=='string'||data.code.length>20000)return;
 try{
  importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
  let size=0;
  Sk.configure({__future__:Sk.python3,execLimit:2500,output:text=>{size+=String(text).length;if(size>5000)throw Error('Output limit reached. Check for a repeating print.');postMessage({type:'output',text:String(text)});},read:name=>{if(!Sk.builtinFiles?.files[name])throw Error('Module is not available: '+name);return Sk.builtinFiles.files[name];},inputfun:()=>{throw Error('Use the given starting values for these tasks; input() is not needed.');},inputfunTakesPrompt:true});
  await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,data.code,true));postMessage({type:'done'});
 }catch(error){postMessage({type:'error',error:String(error)});}
};
