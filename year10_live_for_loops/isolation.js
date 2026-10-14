window.PythonIsolation=(async()=>{
  if(crossOriginIsolated)return true;
  if(!isSecureContext||!('serviceWorker' in navigator))return false;
  try{
    await navigator.serviceWorker.register(new URL('python-isolation-sw.js',document.currentScript.src),{scope:'./',updateViaCache:'none'});
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller)await new Promise(resolve=>{navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(resolve,5000);});
    const key='books-python-isolation-reload';
    if(navigator.serviceWorker.controller&&!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');location.reload();await new Promise(()=>{});}
    return false;
  }catch(e){console.warn('Interactive Python isolation unavailable',e);return false;}
})();
