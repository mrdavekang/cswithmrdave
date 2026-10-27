importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
let inputResolve;
onmessage = async event => {
  if(event.data.type==='input'){if(inputResolve){inputResolve(event.data.value);inputResolve=null;}return;}
  const code=event.data.code;
  let stdout='';
  Sk.configure({
    output:s=>{stdout+=s;if(stdout.length>16000)throw new Error('Output limit reached. Check your loop condition.');postMessage({type:'output',text:s});},
    read:name=>{if(!Sk.builtinFiles?.files[name])throw new Error('This local Python runner does not include '+name);return Sk.builtinFiles.files[name];},
    __future__:Sk.python3,execLimit:2500,yieldLimit:30,
    inputfun:p=>{postMessage({type:'input',prompt:String(p)});const waitingAt=Date.now();return new Promise(resolve=>{inputResolve=value=>{Sk.execStart=Number(Sk.execStart)+(Date.now()-waitingAt);Sk.lastYield=Date.now();resolve(value);};});},inputfunTakesPrompt:true
  });
  try{
    const module=await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,code,true));
    const vars={};for(const [name,value] of Object.entries(module.$d)){if(!name.startsWith('_'))try{const v=Sk.ffi.remapToJs(value);if(v===null||['string','number','boolean'].includes(typeof v)||Array.isArray(v))vars[name]=v;}catch{}}
    postMessage({type:'done',stdout,vars,error:null});
  }catch(error){postMessage({type:'done',stdout,vars:{},error:String(error)});}
};
