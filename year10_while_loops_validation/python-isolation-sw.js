/* Only this lesson folder; no cache and no cloud interception. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  event.respondWith((async()=>{const r=await fetch(event.request,{cache:'no-store'});if(r.status===0||r.type==='opaque')return r;const h=new Headers(r.headers);h.set('Cross-Origin-Opener-Policy','same-origin');
    // This one unprivileged document only hosts public YouTube videos. The main
    // lesson and its Python worker keep their existing isolation unchanged.
    if(event.request.destination==='document'&&url.pathname.endsWith('/video-player.html'))h.delete('Cross-Origin-Embedder-Policy');else h.set('Cross-Origin-Embedder-Policy','require-corp');
    return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});})());
});
