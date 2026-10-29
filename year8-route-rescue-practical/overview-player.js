/* Persistent projector media: never rebuilt by the one-second classroom poll. */
window.RouteOverview=(()=>{
 'use strict';
 const $=id=>document.getElementById(id);let video,room=null,opened=false,priming=false,autoPaused=false,clockWasRunning=false,focusBefore;
 const seen=new Set();
 const key=r=>'route-rescue-overview-v1:'+r.id;
 function wasSeen(r){try{return seen.has(r.id)||sessionStorage.getItem(key(r))==='1';}catch{return seen.has(r.id);}}
 function remember(r){seen.add(r.id);try{sessionStorage.setItem(key(r),'1');}catch{}}
 function note(t){$('overview-status').textContent=t;}
 function hide(){video.pause();opened=false;autoPaused=false;$('overview-dialog').hidden=true;document.body.classList.remove('overview-open');focusBefore?.focus?.();}
 async function play(){
  if(!video)return;focusBefore=document.activeElement;opened=true;$('overview-dialog').hidden=false;document.body.classList.add('overview-open');
  $('overview-close').focus();
  try{await video.play();$('overview-resume').hidden=true;note('Overview playing · English and Mandarin subtitles are included.');}
  catch{$('overview-resume').hidden=false;note('Your browser needs a click. Choose Play video below.');}
 }
 function setup(){
  video=$('overview-video');if(!video)return;
  $('overview-arm').onclick=async()=>{
   // A real click unlocks this media element. Its first 650 ms contain no speech.
   priming=true;video.muted=false;
   try{await video.play();video.pause();video.currentTime=0;$('overview-arm').textContent='Automatic intro ready ✓';note('Ready: the video starts after 3 minutes on the lesson clock.');}
   catch{note('Automatic playback is unavailable. Use Play overview at the 3-minute cue.');}
   finally{priming=false;}
  };
  $('overview-play').onclick=()=>{if(room)remember(room);video.currentTime=0;play();};
  $('overview-resume').onclick=()=>play();$('overview-close').onclick=hide;
  video.onended=()=>{hide();note('Overview complete. Continue with the TTA classroom cue.');};
  video.onerror=()=>{note('Video could not load. Continue using the classroom cue, or retry Play overview.');$('overview-resume').hidden=false;};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)hide();
   if(e.key==='Tab'&&opened){const controls=Array.from($('overview-dialog').querySelectorAll('button:not([hidden]),video')).filter(x=>!x.disabled),first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
 }
 function observe(r){
  room=r;if(!video||priming)return;const clockStopped=clockWasRunning&&!r.clockRunning;clockWasRunning=!!r.clockRunning;
  if(opened&&(!r.connected||r.ended||r.phase!=='work')){hide();note('Video paused so the live classroom can take priority.');return;}
  if(opened){
   if(clockStopped&&!video.paused){video.pause();autoPaused=true;note('Lesson clock paused · video paused too.');}
   else if(r.clockRunning&&autoPaused){autoPaused=false;play();}
  }
  const automatic=!r.boardStage||r.boardStage==='auto';
  if(r.connected&&!r.ended&&r.phase==='work'&&automatic&&r.clockRunning&&r.clockSeconds>=180&&r.clockSeconds<420&&!wasSeen(r)){
   remember(r);video.currentTime=0;play();
  }
 }
 return {setup,observe,playing:()=>opened&&!video?.paused};
})();
