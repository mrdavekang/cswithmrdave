window.RouteRunner=(()=>{
  let active;
  function run(code,onOutput,onInput){
    if(active)return Promise.resolve({error:'A program is already running. Use Stop first.',stdout:'',vars:{}});
    return new Promise(resolve=>{
      let worker,stdout='',timer,finished=false;
      const finish=r=>{if(finished)return;finished=true;clearTimeout(timer);worker?.terminate();active=null;resolve(r);};
      active={stop:()=>finish({error:'Stopped. Your code is still here. Change it and Run again.',stdout,vars:{}})};
      timer=setTimeout(()=>finish({error:'Stopped after 6 seconds. Check for a loop that does not finish.',stdout,vars:{}}),6000);
      if(location.protocol==='file:'){
        let cancelled=false;
        active.stop=()=>{cancelled=true;Sk.execLimit=1;};
        Sk.configure({output:s=>{if(cancelled)throw new Error('Program stopped.');stdout+=s;if(stdout.length>12000)throw new Error('Output limit reached.');onOutput?.(s);},read:n=>{if(!Sk.builtinFiles?.files[n])throw new Error('Unavailable module: '+n);return Sk.builtinFiles.files[n];},__future__:Sk.python3,execLimit:2000,yieldLimit:30,inputfun:p=>onInput(String(p)),inputfunTakesPrompt:true});
        let analysis;
        try{analysis=RouteAnalyse(code);}catch(e){finish({error:String(e),stdout,vars:{}});return;}
        Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,code,true)).then(module=>{
          const vars={};for(const[n,v]of Object.entries(module.$d))if(!n.startsWith('_'))try{const x=Sk.ffi.remapToJs(v);if(x===null||['string','number','boolean'].includes(typeof x)||Array.isArray(x))vars[n]=x;}catch{}
          finish({error:cancelled?'Stopped. Your code is still here.':null,stdout,vars,analysis});
        }).catch(e=>finish({error:String(e),stdout,vars:{},analysis}));return;
      }
      try{
        worker=new Worker('python-worker.js');
        worker.onmessage=async({data})=>{
          if(finished)return;
          if(data.type==='output'){stdout+=data.text;onOutput?.(data.text);}
          else if(data.type==='input'){clearTimeout(timer);const value=await onInput(data.prompt);if(!finished){worker.postMessage({type:'input',value});timer=setTimeout(()=>active?.stop(),6000);}}
          else if(data.type==='done')finish(data);
        };
        worker.onerror=()=>finish({error:'The Python runner could not load. Keep your code. Open this lesson through a local web server or your teacher’s GitHub Pages link, then try again.',stdout,vars:{}});
        worker.postMessage({type:'run',code});
      }catch(e){finish({error:'Python needs the local preview or hosted lesson link, rather than double-clicking the HTML file. Your code has not been removed.',stdout,vars:{}});}
    });
  }
  return {run,stop:()=>active?.stop(),busy:()=>!!active};
})();
