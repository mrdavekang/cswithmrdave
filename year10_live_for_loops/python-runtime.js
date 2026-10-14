/* Interactive CPython in a worker. Pupil source is never rewritten. */
(() => {
  'use strict';
  const workerURL=new URL('python-worker.js?v=books-v2',document.currentScript.src).href;
  class PythonRunner {
    constructor(options={}){Object.assign(this,options);this.state='idle';this.sequence=0;this.pending=null;this.worker=null;this.ready=null;}
    status(state,message){this.state=state;this.onStatus?.({state,message});}
    async init(){
      if(this.ready)return this.ready;
      if(window.PythonIsolation)await window.PythonIsolation;
      if(!crossOriginIsolated||typeof SharedArrayBuffer==='undefined')throw Error('Interactive Python needs an isolated HTTPS page. Open this lesson directly in an up-to-date browser, then refresh. Your written work is kept.');
      this.control=new Int32Array(new SharedArrayBuffer(16));this.bytes=new Uint8Array(new SharedArrayBuffer(4096));this.signal=new Uint8Array(new SharedArrayBuffer(1));
      this.status('loading','Loading Python on this device…');
      this.ready=new Promise((resolve,reject)=>{
        this.initReject=reject;this.worker=new Worker(workerURL,{type:'module'});
        this.loadTimer=setTimeout(()=>this.failure('Python could not finish loading. Check the connection and reload.'),45000);
        this.worker.onerror=e=>{e.preventDefault();this.failure(e.message||'Python could not start.');};
        this.worker.onmessage=({data:d})=>{
          if(d.type==='ready'){clearTimeout(this.loadTimer);this.version=d.version;this.initReject=null;this.status('ready','Python '+d.version+' ready');resolve(this);return;}
          if(d.type==='init-error'){this.failure(d.error);return;}
          const p=this.pending;if(!p||d.id!==p.id)return;
          if(d.type==='output'){p[d.stream]+=d.text;p.output+=d.text;this.onOutput?.(d.text,d.stream);}
          if(d.type==='input-request'){this.request=d.request;this.pauseBudget();this.status('waiting','Python is waiting. Type your answer in the Shell and press Enter.');this.onInput?.();}
          if(d.type==='input-used'){p.inputs.push(d.value);this.request=null;this.resumeBudget();this.status('running','Running Python…');}
          if(d.type==='done')this.finish(d.result);
        };
        this.worker.postMessage({type:'init',control:this.control.buffer,bytes:this.bytes.buffer,signal:this.signal.buffer});
      });return this.ready;
    }
    failure(message){const reject=this.initReject;this.initReject=null;this.destroy();reject?.(Error(message));this.finish({ok:false,error:message});this.status('error',message);}
    destroy(){clearTimeout(this.loadTimer);clearTimeout(this.budgetTimer);clearTimeout(this.stopTimer);this.worker?.terminate();this.worker=null;this.ready=null;}
    pauseBudget(){const p=this.pending;if(!p)return;clearTimeout(this.budgetTimer);if(p.tick){p.remaining-=performance.now()-p.tick;p.tick=0;}}
    resumeBudget(){const p=this.pending;if(!p)return;clearTimeout(this.budgetTimer);p.tick=performance.now();this.budgetTimer=setTimeout(()=>{if(this.control&&Atomics.load(this.control,0)===0){this.pauseBudget();return;}this.stop('Execution limit reached. Check whether your loop finishes. Your code is kept.',{timedOut:true});},Math.max(1,p.remaining));}
    execute(code,kind='module',options={}){
      if(this.pending)return Promise.reject(Error('Stop the current program before running another.'));
      if(String(code).length>20000)return Promise.reject(Error('Keep this lesson program below 20,000 characters.'));
      const id=++this.sequence;
      const result=new Promise(resolve=>{this.pending={id,resolve,code:String(code),kind,stdout:'',stderr:'',output:'',inputs:[],started:performance.now(),remaining:options.timeoutMs||10000,tick:0};});
      (async()=>{try{await this.init();if(this.pending?.id!==id)return;this.signal[0]=0;Atomics.store(this.control,0,4);this.request=null;this.status('running','Running Python…');this.resumeBudget();this.worker.postMessage({type:'run',id,code:String(code),kind});}catch(e){if(this.pending?.id===id)this.finish({ok:false,error:e.message});}})();return result;
    }
    run(code,unused=[],options={}){return this.execute(code,'module',options);}
    repl(line){return this.execute(line,'repl');}
    provideInput(value){
      if(!this.pending||this.state!=='waiting'||!this.request||Atomics.load(this.control,0)!==0)return false;
      const text=String(value),data=new TextEncoder().encode(text);
      if(text.length>1000||data.length>4096)throw Error('Keep each Shell input below 1,000 characters.');
      if(new TextEncoder().encode(JSON.stringify([...this.pending.inputs,text])).length>7500)throw Error('This run has reached the saved-input limit. Stop and start a shorter test; your source is kept.');
      this.bytes.set(data);Atomics.store(this.control,1,data.length);Atomics.store(this.control,2,this.pending.id);Atomics.store(this.control,3,this.request);Atomics.store(this.control,0,1);Atomics.notify(this.control,0);this.request=null;return true;
    }
    finish(result={}){
      const p=this.pending;if(!p)return;this.pauseBudget();clearTimeout(this.stopTimer);this.pending=null;this.request=null;
      const r={...result,ok:result.ok===true,code:p.code,kind:p.kind,stdout:p.stdout,stderr:p.stderr,output:p.output,inputs:p.inputs,durationMs:Math.round(performance.now()-p.started)};
      if(p.stopReason){r.stopped=true;r.ok=false;r.error=p.stopReason+(result.reset?' The interpreter restarted; Shell variables were cleared.':'');Object.assign(r,p.stopExtra);}
      this.status(r.ok?'ready':r.stopped?'stopped':'error',r.ok?(r.more?'Continue your Python block in the Shell.':'Execution finished. Compare with the expected result.'):r.error||'Python reported an error.');p.resolve(r);
    }
    stop(message='Interrupted. Your code is kept.',extra={}){
      const p=this.pending;if(!p)return false;p.stopReason=message;p.stopExtra=extra;
      if(this.signal){this.signal[0]=2;Atomics.notify(this.control,0);}
      this.stopTimer=setTimeout(()=>{const reject=this.initReject;this.initReject=null;this.destroy();reject?.(Error(message));this.finish({ok:false,stopped:true,reset:true,error:message+' The interpreter was restarted.'});},1500);return true;
    }
    close(){this.stop();this.destroy();this.finish({ok:false,stopped:true,error:'Shell closed. Code kept.'});}
  }
  window.PythonRunner=PythonRunner;
})();
