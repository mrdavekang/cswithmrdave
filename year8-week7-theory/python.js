'use strict';
window.PythonEngine=class {
 constructor(events={}){this.events=events;this.worker=null;this.ready=null;this.pending=null;this.timer=null;this.loading=null;this.initReject=null;this.id=0;this.version='';}
 async start(){
  if(this.ready)return this.ready;
  if(location.protocol==='file:')throw Error('The lesson can open as a file, but real Python needs an HTTP/HTTPS page. Upload this complete folder to GitHub Pages or open it through a local web server.');
  this.ready=new Promise((resolve,reject)=>{
   this.worker=new Worker('python-worker.js',{type:'module'});
   this.initReject=reject;
   this.loading=setTimeout(()=>{reject(Error('Python could not finish loading. Check the runtime files and your browser’s WebAssembly settings.'));this.stop(false);},30000);
   this.worker.onerror=e=>{clearTimeout(this.loading);this.initReject=null;reject(Error(e.message||'Python could not start.'));this.finish({ok:false,error:'Python worker failed to start.',trace:[],values:{}});};
   this.worker.onmessage=({data})=>{
    if(data.type==='ready'){clearTimeout(this.loading);this.initReject=null;this.version=data.version;this.events.ready?.(data.version);resolve();}
    if(data.type==='init-error'){clearTimeout(this.loading);this.initReject=null;reject(Error(data.error));}
    if(data.type==='output')this.events.output?.(data.text,data.error);
    if(data.type==='auto-input')this.events.autoInput?.(data);
    if(data.type==='input'){clearTimeout(this.timer);this.events.input?.(data.prompt);}
    if(data.type==='done'){this.finish(data.result);}
   };
  });
  return this.ready;
 }
 arm(){clearTimeout(this.timer);this.timer=setTimeout(()=>this.stop(true,'Execution was stopped to keep the editor responsive. Check the loop’s condition and update.'),8000);}
 async execute(code,options={}){
  if(this.pending)throw Error('Stop the current run before starting another.');
  await this.start();
  return new Promise(resolve=>{this.pending=resolve;this.arm();this.worker.postMessage({type:'execute',id:++this.id,code,...options});});
 }
 sendInput(value){this.arm();this.worker?.postMessage({type:'input',value:String(value)});}
 finish(result){clearTimeout(this.timer);const resolve=this.pending;this.pending=null;resolve?.(result);}
 stop(notify=true,message='Program stopped. Your code is kept. The shell environment has been reset.'){
  clearTimeout(this.timer);clearTimeout(this.loading);this.initReject?.(Error('Python loading was stopped. Select Run to try again.'));this.initReject=null;this.worker?.terminate();this.worker=null;this.ready=null;
  if(this.pending)this.finish({ok:false,stopped:true,error:message,trace:[],values:{}});
  if(notify)this.events.stopped?.(message);
 }
};
