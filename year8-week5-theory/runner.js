/* Skulpt implements a classroom Python 3 subset. No server or CDN. */
window.PythonRunner=(()=>{
 let active=null;
 function stop(){if(active)active.cancel();}
 function run(code,io){
  stop();
  return new Promise((resolve,reject)=>{
   let worker=null,watch=null,finished=false,inputReject=null;
   const finish=(error)=>{if(finished)return;finished=true;clearTimeout(watch);worker?.terminate();if(inputReject)inputReject(Error('Stopped'));inputReject=null;if(active===session)active=null;error?reject(error):resolve();};
   const session={cancel:()=>finish(Error('Run stopped. Your code is kept.'))};active=session;
   const arm=()=>{clearTimeout(watch);watch=setTimeout(()=>finish(Error('Time limit reached. Check for a loop, then try again.')),6000);};
   const ask=async prompt=>{clearTimeout(watch);if(finished)throw Error('Stopped');const value=await new Promise((res,rej)=>{inputReject=rej;Promise.resolve().then(()=>io.input(prompt)).then(res,rej);});inputReject=null;if(finished)throw Error('Stopped');arm();return value;};
   if(location.protocol!=='file:'&&typeof Worker!=='undefined'){
    try{worker=new Worker('python-worker.js');worker.onerror=()=>finish(Error('Python could not start. Check that the vendor and worker files were included.'));worker.onmessage=async({data})=>{if(finished)return;if(data.type==='output')io.output(data.text);if(data.type==='input'){try{const value=await ask(data.prompt);if(!finished)worker.postMessage({type:'input',value});}catch(e){finish(e);}}if(data.type==='done')finish();if(data.type==='error')finish(Error(data.error));};arm();worker.postMessage({type:'run',code});}catch(e){finish(e);}return;
   }
   // Local-file fallback: execution limit keeps runaway classroom code bounded.
   if(!window.Sk){finish(Error('Python library missing. Extract the complete ZIP.'));return;}
   let size=0;
   Sk.configure({__future__:Sk.python3,execLimit:3500,
    output:s=>{if(finished)throw Error('Stopped');size+=s.length;if(size>16000)throw Error('Too much output.');io.output(s);},
    read:n=>{if(Sk.builtinFiles.files[n]===undefined)throw Error('Module not available: '+n);return Sk.builtinFiles.files[n];},
    inputfun:async p=>{const started=Date.now();const value=await ask(String(p));Sk.execStart+=Date.now()-started;return value;},inputfunTakesPrompt:true});
   arm();Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,code,true)).then(()=>finish(),finish);
  });
 }
 return{run,stop};
})();
