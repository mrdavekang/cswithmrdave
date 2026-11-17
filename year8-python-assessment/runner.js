"use strict";
// Real Python (Skulpt), with a worker on HTTP and a bounded file:// fallback.
function runSprintPython(code,io={}) {
  let stop, done=false, worker, cancelInput, alarm, output="";
  const result=new Promise(resolve=>{
    const finish=(error=null)=>{
      if(done)return;
      done=true; clearTimeout(alarm); worker?.terminate(); cancelInput?.();
      resolve({stdout:output,error});
    };
    const arm=()=>{clearTimeout(alarm);alarm=setTimeout(()=>finish("Program timed out. Check the last line and run again."),5000);};
    const append=s=>{output+=s;if(output.length>10000){finish("Output limit reached.");throw Error("Output limit reached.");}io.output?.(s);};
    stop=()=>finish("Program stopped.");
    arm();
    if(location.protocol!=="file:" && typeof Worker!=="undefined"){
      try{
        worker=new Worker("python-worker.js");
        worker.onmessage=async ({data})=>{
          if(done)return;
          if(data.kind==="output"){try{append(data.text);}catch{} return;}
          if(data.kind==="done"){finish(data.error);return;}
          if(data.kind==="input"){
            clearTimeout(alarm);
            try{
              const v=await io.input?.(data.prompt);
              if(!done){worker.postMessage({kind:"input",value:String(v??"")});arm();}
            }catch(e){finish(e.message);}
          }
        };
        worker.onerror=()=>finish("Python could not load. Try reloading the lesson.");
        worker.postMessage({kind:"run",code});return;
      }catch{worker?.terminate();worker=undefined;}
    }
    if(typeof Sk==="undefined"){finish("Python could not load. Keep the vendor folder next to the lesson.");return;}
    const oldStop=stop;
    stop=()=>{Sk.execLimit=1;oldStop();};
    Sk.configure({__future__:Sk.python3,execLimit:1700,yieldLimit:25,
      output:append,read:n=>{const f=Sk.builtinFiles?.files[n];if(f==null)throw Error("Module unavailable: "+n);return f;},
      inputfunTakesPrompt:true,inputfun:prompt=>{
        const begin=Date.now();clearTimeout(alarm);
        return new Promise((res,rej)=>{
          cancelInput=()=>rej(Error("Stopped"));
          Promise.resolve(io.input?.(String(prompt))).then(value=>{
            if(done)return;
            cancelInput=undefined;Sk.execStart=Number(Sk.execStart)+Date.now()-begin;Sk.lastYield=Date.now();arm();res(String(value??""));
          },rej);
        });
      }
    });
    Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<student>",false,code,true)).then(()=>finish(),e=>finish(String(e)));
  });
  return {result,stop:()=>stop?.()};
}
