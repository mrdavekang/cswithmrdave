// Sandboxed fallback for browsers that cannot load a Worker from file://.
window.addEventListener('message',function(e){if(e.source!==parent||!e.data||e.data.type!=='run')return;executePython(e.data.code,function(r){parent.postMessage(r,'*');});});
parent.postMessage({type:'ready'},'*');
