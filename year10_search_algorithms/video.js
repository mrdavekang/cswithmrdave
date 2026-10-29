/* YouTube playback guard. It observes playback, not attention. No player overlays. */
window.SearchVideo=(()=>{'use strict';let player=null,poll=null,callbacks=null,lastSave=0,gen=0;
 let apiPromise;function api(){if(window.YT?.Player)return Promise.resolve();if(!apiPromise)apiPromise=new Promise((resolve,reject)=>{window.onYouTubeIframeAPIReady=resolve;const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>reject(Error('YouTube is blocked or unavailable. Ask your teacher for an access adjustment.'));document.head.append(s);setTimeout(()=>{if(!window.YT?.Player)reject(Error('YouTube did not load. Check the connection or ask your teacher.'));},18000);});return apiPromise;}
 function destroy(){gen++;clearInterval(poll);poll=null;try{player?.destroy();}catch{}player=null;callbacks=null;}
 async function mount(video,state,cb,preview){destroy();const mine=gen;callbacks=cb;let progress={frontier:0,done:false,...state};cb.status(progress.done?'Previously completed. You can replay.':'Watch from the beginning. Pause and rewind are available.');
 try{await api();if(mine!==gen)return;player=new YT.Player('youtube-player',{host:'https://www.youtube-nocookie.com',videoId:video.youtube,playerVars:{playsinline:1,controls:1,rel:0,enablejsapi:1,origin:location.origin,cc_load_policy:1,fs:1},events:{
 onReady:()=>{if(mine!==gen)return;const start=progress.done?0:Math.max(0,progress.frontier-1);if(start)player.seekTo(start,true);cb.ready?.();poll=setInterval(sample,250);},
 onStateChange:e=>{if(e.data===0){sample(true);if(!progress.done&&!preview){cb.status('Playback ended before continuous viewing was verified. Resume from your saved point.');player.seekTo(progress.frontier,true);}}},
 onError:e=>cb.error('This video could not play (YouTube code '+e.data+'). Ask your teacher to verify an alternative; the lesson will not silently count this as watched.'),
 onPlaybackRateChange:e=>{if(!preview&&e.data>1.05){player.setPlaybackRate(1);cb.status('Normal playback speed is required. You can pause or rewind.');}}
 }});
 function sample(ended=false){if(mine!==gen||!player?.getCurrentTime)return;try{const loaded=player.getVideoData?.().video_id;if(loaded&&loaded!==video.youtube){cb.status('Return to the assigned video to complete this step.');player.loadVideoById({videoId:video.youtube,startSeconds:Math.max(0,progress.frontier-1)});return;}const time=player.getCurrentTime(),duration=player.getDuration(),playing=player.getPlayerState()===1;
 if(!preview&&!progress.done&&document.hidden&&playing){player.pauseVideo();cb.status('Paused while this page is in the background.');}
 if(preview||progress.done){cb.progress(progress.frontier,duration,progress.done);return;}
 const r=SearchCore.videoGate(progress,{time,wall:performance.now(),playing,visible:!document.hidden,rate:player.getPlaybackRate(),duration,ended:ended===true});progress=r.state;
 if(r.seek!==null){player.seekTo(r.seek,true);cb.status('Forward seeking is not counted. Resume from the last continuously watched point.');}
 cb.progress(progress.frontier,duration,progress.done);
 if(Date.now()-lastSave>1500||r.complete){lastSave=Date.now();cb.save({frontier:progress.frontier,done:progress.done,duration});}
 if(r.complete){cb.status('Full video completed. Continue is now available.');cb.complete();}
 }catch(e){cb.error('Video progress could not be checked. Keep this page open or ask your teacher.');}}
 }catch(e){cb.error(e.message);}}
 function pause(){try{player?.pauseVideo();}catch{}}
 return {mount,destroy,pause};
})();
