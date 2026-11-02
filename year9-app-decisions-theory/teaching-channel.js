/* Only slide id, reveal step and language cross tabs. Never pupil data or notes. */
(()=>{'use strict';const key='y9t-design-teaching-v1',V=DesignTeachingView,listeners=new Set();let channel;try{channel=new BroadcastChannel(key);}catch{}
function read(){try{return V.normalise(JSON.parse(localStorage.getItem(key)||'{}'));}catch{return V.normalise();}}
let current=read();
function receive(v){current=V.normalise(v);for(const f of listeners)f(current);}
function set(v){const next=V.normalise({...current,...v});receive(next);try{localStorage.setItem(key,JSON.stringify(next));}catch{}try{channel?.postMessage(next);}catch{}return next;}
if(channel)channel.onmessage=e=>receive(e.data);
addEventListener('storage',e=>{if(e.key===key){try{receive(JSON.parse(e.newValue||'{}'));}catch{}}});
window.DesignTeachingChannel={get:()=>({...current}),set,on:f=>{listeners.add(f);return ()=>listeners.delete(f);}};
})();
