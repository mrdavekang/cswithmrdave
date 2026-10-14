/* Player mount and progress UI. The main Python page stays cross-origin isolated. */
(() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.RequiredVideoGate={mount(root,video,value,{onProgress,onContinue,preview=false}){
    const token=crypto.randomUUID(),tracker=new CodingVideos.Tracker(value);let source=null,popup=null,frame=null,disposed=false,finished=false;
    const url=new URL('video-player.html',location.href);url.searchParams.set('video',video.id);url.searchParams.set('token',token);
    root.innerHTML=`<section class="required-video" aria-label="Required video ${video.number}"><p class="eyebrow">${preview?'TEACHER PREVIEW':'WATCH BEFORE YOU CODE'} · VIDEO ${video.number} OF 3</p><h3>${esc(video.title)}</h3><p>${esc(video.purpose)}</p><p class="video-rule">Pause, replay, change speed or scrub whenever you need. Skipped sections do not count as watched. Finish the playthrough before continuing.</p><div class="video-slot"></div><p class="video-progress-text" role="status"></p><progress class="video-progress" max="100" value="0" aria-label="Required viewing progress"></progress><p class="video-missing small"></p><p class="video-error small" role="status"></p><div class="video-actions"><button class="video-window quiet">Open tracked video window</button><button class="video-continue" ${preview?'':'disabled'}>${preview?'Preview the task without watching':'Watch the video to unlock this task'}</button></div><p class="small">Progress records playback, not attention or understanding. You will still explain and test your own program.</p></section>`;
    const q=s=>root.querySelector(s),slot=q('.video-slot');
    const draw=()=>{const value=tracker.value,done=CodingVideos.complete(value),watched=CodingVideos.watched(value),percent=value.duration?Math.min(100,Math.floor(watched/value.duration*100)):0;
      q('.video-progress').value=done?100:percent;
      q('.video-progress-text').textContent=preview?'Teacher preview is unrestricted. Student continuation requires the video.':done?'Required viewing completed. You can now open the task.':value.duration?`Played ${CodingVideos.stamp(watched)} of ${CodingVideos.stamp(value.duration)} (${percent}%).`:'Press Play to start recording your viewing progress.';
      const gaps=CodingVideos.gaps(value).filter(([a,b])=>b-a>1.5);q('.video-missing').textContent=!done&&value.ended&&gaps.length?'Return to the unwatched sections: '+gaps.slice(0,4).map(([a,b])=>CodingVideos.stamp(a)+'–'+CodingVideos.stamp(b)).join(', ')+(gaps.length>4?' and further sections.':'.'):!done&&value.ended?'Replay any missed moments and allow the video to finish.':'';
      q('.video-continue').disabled=!preview&&!done;q('.video-continue').textContent=preview?'Preview the task without watching':done?'Continue to the task':'Watch the video to unlock this task';
    };
    function receive(message){if(disposed||message?.type!=='y10-video-player-v1'||message.token!==token||message.videoId!==video.id)return;
      if(message.kind==='ready'){q('.video-error').textContent='';return;}
      if(message.kind==='error'){q('.video-error').textContent='The player could not load. Try Open tracked video window, check the connection, or request written help. The task has not been marked watched.';return;}
      if(message.kind!=='sample')return;
      const value=tracker.sample(message);draw();if(!preview)onProgress(value);
      if(!finished&&CodingVideos.complete(value)){finished=true;try{source?.postMessage({type:'y10-video-control-v1',token,action:'complete'},location.origin);}catch{}}
    }
    const listen=event=>{if(event.origin===location.origin&&(event.source===source||event.source===popup))receive(event.data);};
    const stored=event=>{if(event.key==='y10-video-message:'+token&&event.newValue)try{receive(JSON.parse(event.newValue));}catch{}};
    window.addEventListener('message',listen);window.addEventListener('storage',stored);
    q('.video-continue').onclick=()=>{if(preview||CodingVideos.complete(tracker.value))onContinue();};
    q('.video-window').onclick=()=>{try{source?.postMessage({type:'y10-video-control-v1',token,action:'pause'},location.origin);}catch{}popup=window.open(url.href,'y10-required-video-'+token,'width=1050,height=800');if(!popup){q('.video-error').textContent='The browser blocked the video window. Allow this window for the lesson, then try again.';return;}source=popup;tracker.last=null;q('.video-error').textContent='Keep this lesson page open. Return here after watching in the video window.';};
    draw();
    (async()=>{await window.PythonIsolation;if(disposed)return;if(!crossOriginIsolated||'credentialless' in HTMLIFrameElement.prototype){
      frame=document.createElement('iframe');frame.className='required-video-frame';frame.title='Video '+video.number+' - '+video.title;frame.allow='autoplay; fullscreen; encrypted-media; picture-in-picture';frame.setAttribute('allowfullscreen','');frame.referrerPolicy='strict-origin-when-cross-origin';if(crossOriginIsolated)frame.setAttribute('credentialless','');const embeddedURL=new URL(url);embeddedURL.searchParams.set('embedded','1');frame.src=embeddedURL.href;slot.append(frame);source=frame.contentWindow;
    }else slot.innerHTML='<p class="coach">Your browser needs the tracked video window to keep Python input working. Use the button below; your lesson remains open here.</p>';})();
    return {destroy(){disposed=true;try{source?.postMessage({type:'y10-video-control-v1',token,action:'pause'},location.origin);}catch{}window.removeEventListener('message',listen);window.removeEventListener('storage',stored);try{popup?.close();localStorage.removeItem('y10-video-message:'+token);}catch{}frame?.remove();},value:()=>CodingVideos.clean(tracker.value)};
  }};
})();
