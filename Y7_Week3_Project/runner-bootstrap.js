/* Included after Skulpt + the Turtle bridge in the bundled runner. */
if (typeof document === 'undefined') {
  self.onmessage = e => { if(e.data?.type === 'run') executePython(e.data.code,r => self.postMessage(r)); };
  self.postMessage({type:'ready'});
} else {
  window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='run')executePython(e.data.code,r=>parent.postMessage(r,'*'));});
  parent.postMessage({type:'ready'},'*');
}
