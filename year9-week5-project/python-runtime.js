'use strict';
/* Keep Python in a terminable Worker, including when the lesson opens via file://. */
let offlinePythonSource;
function loadOfflinePython(){
 if(!offlinePythonSource)offlinePythonSource=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src='python-offline-bundle.js?v=1';
  script.onload=()=>typeof window.PYTHON_OFFLINE_WORKER_SOURCE==='string'?resolve(window.PYTHON_OFFLINE_WORKER_SOURCE):reject(new Error('Python bundle missing'));
  script.onerror=()=>reject(new Error('Python bundle could not load'));
  document.head.append(script);
 }).catch(error=>{offlinePythonSource=null;throw error;});
 return offlinePythonSource;
}
function createPythonWorker(){
 let worker=null,closed=false,blobURL=null;
 const waiting=[];
 const runner={
  onmessage:null,onerror:null,
  postMessage(data){if(closed)return;if(worker)worker.postMessage(data);else waiting.push(data);},
  terminate(){closed=true;waiting.length=0;worker?.terminate();if(blobURL){URL.revokeObjectURL(blobURL);blobURL=null;}}
 };
 // Defer construction so callers install error handlers before any startup failure.
 Promise.resolve().then(async()=>{
  let url='python-worker.js';
  if(location.protocol==='file:'){
   const source=await loadOfflinePython();
   if(closed)return;
   url=blobURL=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
  }
  if(closed)return;
  worker=new Worker(url);
  worker.onmessage=event=>{if(!closed)runner.onmessage?.(event);};
  worker.onerror=event=>{if(!closed)runner.onerror?.(event);};
  for(const data of waiting)worker.postMessage(data);
  waiting.length=0;
 }).catch(error=>{if(!closed)runner.onerror?.(error);});
 return runner;
}
