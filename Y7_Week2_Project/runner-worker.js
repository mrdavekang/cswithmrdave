importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js','runtime.js');
self.onmessage=function(e){executePython(e.data.code,function(result){self.postMessage(result);});};
