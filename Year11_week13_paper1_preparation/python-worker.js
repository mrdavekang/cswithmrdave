/* Genuine Python execution, isolated from the page and its notebook. */
importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
self.onmessage=async event=>{
  let length=0;
  Sk.configure({__future__:Sk.python3,execLimit:2500,yieldLimit:100,output:t=>{length+=t.length;if(length>15000)throw Error('Output limit reached.');postMessage({type:'output',text:t});},read:f=>{if(Sk.builtinFiles?.files[f]!==undefined)return Sk.builtinFiles.files[f];throw Error('This practice runner cannot open that file. Use your Python IDE for the full skeleton.');},inputfun:()=>{throw Error('Use your Python IDE for input(). The practice examples here need no input.');},inputfunTakesPrompt:true});
  try{await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,String(event.data.code),true));postMessage({type:'done'});}catch(e){postMessage({type:'error',text:String(e)});}
};
