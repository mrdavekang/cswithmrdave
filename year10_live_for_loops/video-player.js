/* Public, unprivileged player document; contains no notebook or classroom keys. */
(() => {
  'use strict';
  const params=new URLSearchParams(location.search),id=params.get('video'),token=params.get('token');
  const v=CodingVideos.videos.find(v=>v.id===id),embedded=params.get('embedded')==='1';
  const status=document.querySelector('#player-status');
  if(!v||!token||!/^[0-9a-f-]{36}$/i.test(token)){status.textContent='Open this demonstration from the lesson page.';return;}
  if(embedded)document.body.classList.add('embedded');
  document.querySelector('#video-title').textContent='Video '+v.number+' · '+v.title;
  let player=null,ready=false,timer=null,lastStore=0,disposed=false;
  const send=data=>{
    const message={type:'y10-video-player-v1',token,videoId:id,...data};
    const target=embedded?window.parent:window.opener;
    try{target?.postMessage(message,location.origin);}catch{}
    // COOP can separate a popup's opener. Same-origin storage events provide a
    // bounded, token-specific fallback, without storing student identities.
    if(!embedded&&(Date.now()-lastStore>450||data.kind!=='sample'||data.state===0)){lastStore=Date.now();try{localStorage.setItem('y10-video-message:'+token,JSON.stringify(message));}catch{}}
  };
  function sample(){if(!ready||!player||disposed)return;send({kind:'sample',time:player.getCurrentTime(),duration:player.getDuration(),rate:player.getPlaybackRate(),state:player.getPlayerState(),visible:document.visibilityState==='visible'});}
  function error(code){status.textContent='The video could not load (YouTube '+code+'). Check your connection or ask your teacher to enable embedding. Watching elsewhere cannot be tracked here.';send({kind:'error',code:String(code)});}
  window.onYouTubeIframeAPIReady=()=>{
    player=new YT.Player('player',{width:'100%',height:'100%',videoId:id,host:'https://www.youtube-nocookie.com',playerVars:{origin:location.origin,playsinline:1,controls:1,rel:0},events:{
      onReady:()=>{ready=true;const iframe=player.getIframe();iframe.className='youtube-frame';iframe.setAttribute('title','Video '+v.number+' - '+v.title);status.textContent='Press Play. Pausing and scrubbing are allowed.';send({kind:'ready'});timer=setInterval(sample,500);sample();},
      onStateChange:()=>sample(),onPlaybackRateChange:()=>sample(),onError:event=>error(event.data)
    }});
  };
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>error('network');document.head.append(script);
  const timeout=setTimeout(()=>{if(!ready)error('loading timeout');},18000);
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.data?.token!==token||event.data?.type!=='y10-video-control-v1')return;
    const expected=embedded?window.parent:window.opener;if(expected&&event.source!==expected)return;
    if(event.data.action==='pause')player?.pauseVideo();
    if(event.data.action==='complete'){status.textContent='Required viewing completed. Return to the lesson to continue.';}
  });
  document.querySelector('#return-to-lesson').onclick=()=>{sample();try{window.opener?.focus();}catch{}window.close();};
  document.addEventListener('visibilitychange',()=>sample());
  window.addEventListener('pagehide',()=>{sample();disposed=true;clearInterval(timer);clearTimeout(timeout);});
})();
