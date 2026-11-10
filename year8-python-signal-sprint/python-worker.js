"use strict";
importScripts("vendor/skulpt.min.js","vendor/skulpt-stdlib.js");
let inputResolve,amount=0;
onmessage=async ({data})=>{
  if(data.kind==="input"){inputResolve?.(data.value);inputResolve=null;return;}
  if(data.kind!=="run")return;
  try{
    Sk.configure({__future__:Sk.python3,execLimit:2700,yieldLimit:25,
      output:text=>{amount+=text.length;if(amount>10000)throw Error("Output limit reached.");postMessage({kind:"output",text});},
      read:n=>{const f=Sk.builtinFiles?.files[n];if(f==null)throw Error("Module unavailable: "+n);return f;},
      inputfunTakesPrompt:true,inputfun:prompt=>{
        const begin=Date.now();postMessage({kind:"input",prompt:String(prompt)});
        return new Promise(resolve=>{inputResolve=value=>{Sk.execStart=Number(Sk.execStart)+Date.now()-begin;Sk.lastYield=Date.now();resolve(value);};});
      }
    });
    await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<student>",false,data.code,true));
    postMessage({kind:"done",error:null});
  }catch(e){postMessage({kind:"done",error:String(e)});}
};
