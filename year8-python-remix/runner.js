/* Run pupil Python away from the interface; the parent can stop this worker. */
if(typeof Sk==='undefined')importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
let reply;
self.onmessage=async({data:m})=>{
 if(m.kind==='input'){if(reply){const r=reply;reply=null;r(m.value)}return}
 let text='',index=0,asks=0;
 Sk.configure({__future__:Sk.python3,execLimit:3000,yieldLimit:100,output:s=>{text+=s;if(text.length>16000)throw Error('Too much output. Try a shorter program.');if(m.interactive)postMessage({kind:'out',text:s})},
 read:path=>{if(!Sk.builtinFiles?.files?.[path])throw Error('Module not available');return Sk.builtinFiles.files[path]},
 inputfunTakesPrompt:true,inputfun:prompt=>{asks++;if(!m.interactive)return Promise.resolve(String(m.inputs[index++]??''));postMessage({kind:'ask',prompt});return new Promise(r=>reply=x=>{Sk.execStart=Date.now();r(x)})}});
 try{await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,m.code,true));postMessage({kind:'end',text,asks})}catch(e){postMessage({kind:'error',message:String(e)})}
};
