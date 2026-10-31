window.PythonIsolation=(async()=>{
  // Embedded teacher preview must not claim/reload the private dashboard mid-load.
  if(window.parent!==window&&new URLSearchParams(location.search).get('teacherPreview')==='1')return false;
  if(!isSecureContext||!('serviceWorker' in navigator))return false;
  try{
    const registration=await navigator.serviceWorker.register(new URL('python-isolation-sw.js',document.currentScript.src),{scope:'./',updateViaCache:'none'});
    if(registration.installing)await new Promise(resolve=>{const installing=registration.installing;installing.addEventListener('statechange',()=>{if(['activated','redundant'].includes(installing.state))resolve();});setTimeout(resolve,5000);});
    if(crossOriginIsolated)return true;
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller)await new Promise(resolve=>{navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(resolve,5000);});
    const key='search-sort-python-isolation-reload';
    if(navigator.serviceWorker.controller&&!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');location.reload();await new Promise(()=>{});}
    return false;
  }catch(e){console.warn('Interactive Python isolation unavailable',e);return false;}
})();
