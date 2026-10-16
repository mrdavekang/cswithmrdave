window.PythonRunner = (() => {
  let running=null;
  function run(code, output=()=>{}, input=()=>Promise.resolve('')) {
    if(running) return Promise.resolve({stdout:'',vars:{},error:'A program is already running. Stop it first.'});
    return new Promise(resolve=>{
      let stdout='',timer,worker;
      const finish=result=>{clearTimeout(timer);if(worker)worker.terminate();running=null;resolve(result);};
      const stop=()=>finish({stdout,vars:{},error:'Program stopped. Check that a while loop changes its counter.'});
      running={stop};
      timer=setTimeout(stop,15000);
      if(location.protocol!=='file:' && typeof Worker!=='undefined'){
        try{
          worker=new Worker('python-worker.js');
          worker.onmessage=async({data})=>{
            if(data.type==='output'){stdout+=data.text;output(data.text);}
            else if(data.type==='input'){clearTimeout(timer);const value=await input(data.prompt);if(running){worker.postMessage({type:'input',value});timer=setTimeout(stop,15000);}}
            else if(data.type==='done')finish(data);
          };
          worker.onerror=()=>finish({stdout,vars:{},error:'Python worker could not start. Use a local web server or the teacher’s hosted link.'});
          worker.postMessage({type:'run',code});return;
        }catch{if(worker)worker.terminate();}
      }
      // Direct-file fallback: same real interpreter, with its own execution limit.
      Sk.configure({output:s=>{stdout+=s;if(stdout.length>16000)throw new Error('Output limit reached.');output(s);},read:n=>{if(!Sk.builtinFiles?.files[n])throw new Error('Unavailable module: '+n);return Sk.builtinFiles.files[n];},__future__:Sk.python3,execLimit:1800,yieldLimit:30,inputfun:p=>input(String(p)),inputfunTakesPrompt:true});
      running.stop=()=>{Sk.execLimit=1;};
      Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,code,true)).then(module=>{
        const vars={};for(const[n,v]of Object.entries(module.$d))if(!n.startsWith('_'))try{const value=Sk.ffi.remapToJs(v);if(value===null||['string','number','boolean'].includes(typeof value)||Array.isArray(value))vars[n]=value;}catch{}
        finish({stdout,vars,error:null});
      }).catch(error=>finish({stdout,vars:{},error:String(error)}));
    });
  }
  return {run,stop:()=>running?.stop(),busy:()=>!!running};
})();
