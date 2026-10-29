/* Quiet, opt-in projector sounds. No audio is played on pupil devices. */
window.RouteTimer=(()=>{
 'use strict';
 let audio,enabled=false,volume=.25,previous=null,lastTick='',running=false;
 const $=id=>document.getElementById(id);
 async function unlock(){const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error('Audio is unavailable');audio=audio||new C();if(audio.state==='suspended')await audio.resume();}
 function tone(freq,delay=0,length=.16,gain=.2){if(!enabled||!audio||audio.state!=='running')return;const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+delay;o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume*gain,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+length+.02);o.onended=()=>{o.disconnect();g.disconnect();};}
 function cue(type){if(type==='start'){tone(523);tone(659,.18,.25);}else if(type==='finish'){tone(659,0,.4);tone(523,.3,.65);}else if(type==='return'){tone(523,0,.25);tone(784,.2,.45);}else tone(659,0,.12,.12);}
 function observe(r){if(!r)return;const p=previous;previous={phase:r.phase,round:r.round,deadline:r.deadline,connected:r.connected,displayStage:r.displayStage};
  if(p&&r.connected&&p.connected){if(r.phase!==p.phase||r.round!==p.round){if(['response','retry'].includes(r.phase))cue('start');else if(r.phase==='discuss'&&['response','retry','follow'].includes(p.phase))cue('finish');else if(r.phase==='work'&&p.phase!=='work')cue('return');else if(r.phase==='invite'||r.phase==='follow')cue('notice');}}
  if(p&&p.phase==='work'&&r.phase==='work'&&p.displayStage&&r.displayStage!==p.displayStage&&r.connected)cue('notice');
  if(['response','retry'].includes(r.phase)&&r.pausedSeconds==null){const left=Math.max(0,Math.ceil((Date.parse(r.deadline)-Date.now())/1000)),k=r.round+':'+r.deadline+':'+left;if(left>0&&left<=5&&k!==lastTick){lastTick=k;tone(784,0,.08,.09);}}
 }
 function setup(){if(!$('timer-tools'))return;$('sound-toggle').onclick=async()=>{try{await unlock();enabled=!enabled;$('sound-toggle').textContent=enabled?'Sound on · mute':'Sound off · enable';$('sound-toggle').setAttribute('aria-pressed',String(enabled));if(enabled)cue('start');$('timer-feedback').textContent=enabled?'Projector cues enabled. Keep student devices quiet.':'Sound muted. Visual cues stay visible.';}catch(e){$('timer-feedback').textContent=e.message+' · use the visible timer.';}};
  $('sound-test').onclick=async()=>{try{await unlock();if(enabled)cue('finish');else $('timer-feedback').textContent='Enable sound first, then test.';}catch{$('timer-feedback').textContent='Sound unavailable; visible countdown still works.';}};
  $('sound-volume').oninput=e=>{volume=Number(e.target.value)/100;};$('timer-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('timer-feedback').textContent='Fullscreen unavailable. You can still maximise the browser.';}};
  $('timer-motion').onchange=e=>document.body.classList.toggle('timer-still',e.target.checked);
  let hideTimer;const active=()=>{document.body.classList.remove('timer-idle');clearTimeout(hideTimer);if(document.fullscreenElement)hideTimer=setTimeout(()=>document.body.classList.add('timer-idle'),3500);};
  document.addEventListener('pointermove',active);document.addEventListener('focusin',active);document.addEventListener('fullscreenchange',active);
 }
 return{observe,setup};
})();
