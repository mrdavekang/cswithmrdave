'use strict';
(() => {
const DURATION=10000, MAX_ROUNDS=3;
const copy={
 en:{instruction:'Tap the reactor to start. Keep tapping for 10 seconds!',tap:'TAP TO START',charging:'KEEP CHARGING',ready:'SHIP READY',off:'Sound off',on:'Sound on',unavailable:'Sound unavailable',practice:'Untimed practice',speed:'10-second challenge',return:'Return to mission →'},
 zh:{instruction:'点击反应堆开始。连续点击 10 秒！',tap:'点击开始',charging:'继续充能',ready:'飞船已就绪',off:'声音关闭',on:'声音开启',unavailable:'无法播放声音',practice:'不限时练习',speed:'10 秒挑战',return:'回到课程 →'},
 ko:{instruction:'반응로를 누르면 시작됩니다. 10초 동안 눌러 주세요!',tap:'눌러서 시작',charging:'계속 충전',ready:'우주선 준비 완료',off:'소리 꺼짐',on:'소리 켜짐',unavailable:'소리 사용 불가',practice:'시간 제한 없는 연습',speed:'10초 도전',return:'수업으로 돌아가기 →'}
};

function makeSound(win){
 let context=null, master=null, enabled=false, disposed=false, lastTap=-Infinity;
 const nodes=new Set();
 function clear(){for(const node of nodes){try{node.stop();}catch{}}nodes.clear();}
 function tone(freq,duration=.07,delay=0,type='sine',end=freq){
  if(!enabled||!context||context.state!=='running')return;
  const at=context.currentTime+delay, oscillator=context.createOscillator(), gain=context.createGain();
  oscillator.type=type;oscillator.frequency.setValueAtTime(freq,at);oscillator.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.15,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  oscillator.connect(gain);gain.connect(master);nodes.add(oscillator);
  oscillator.onended=()=>{nodes.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(at);oscillator.stop(at+duration+.01);
 }
 function whoosh(){
  if(!enabled||!context||context.state!=='running')return;
  const length=Math.floor(context.sampleRate*.65), buffer=context.createBuffer(1,length,context.sampleRate), data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=Math.random()*2-1;
  const source=context.createBufferSource(), filter=context.createBiquadFilter(), gain=context.createGain(), at=context.currentTime;
  source.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(250,at);filter.frequency.exponentialRampToValueAtTime(1900,at+.25);filter.frequency.exponentialRampToValueAtTime(150,at+.65);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.22,at+.12);gain.gain.exponentialRampToValueAtTime(.0001,at+.65);
  source.connect(filter);filter.connect(gain);gain.connect(master);nodes.add(source);source.onended=()=>{nodes.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start(at);source.stop(at+.66);
 }
 return {
  get enabled(){return enabled;},
  async toggle(){
   if(enabled){enabled=false;clear();return false;}
   try{
    const Audio=win.AudioContext||win.webkitAudioContext;if(!Audio)throw Error('Audio unsupported');
    context??=new Audio();if(!master){master=context.createGain();master.gain.value=.22;master.connect(context.destination);}
    await context.resume();if(disposed||context.state!=='running')throw Error('Audio unavailable');enabled=true;tone(540,.1);return true;
   }catch{enabled=false;clear();throw Error('Audio unavailable');}
  },
  tap(progress){const now=performance.now();if(now-lastTap<40)return;lastTap=now;tone(330+Math.min(progress,1)*330,.055,0,'triangle',460+Math.min(progress,1)*390);},
  countdown(){tone(220,.09);},
  finish(best){whoosh();const notes=best?[523,659,784,1047]:[440,660];notes.forEach((f,i)=>tone(f,.16,.12+i*.12));},
  stop(){clear();},
  dispose(){disposed=true;enabled=false;clear();if(context)context.close().catch(()=>{});}
 };
}

function mount(host,options={}){
 const win=host.ownerDocument.defaultView, doc=host.ownerDocument, text=copy[options.language]||copy.en;
 const find=selector=>host.querySelector(selector), sound=makeSound(win);
 const rawBest=Number(options.best?.clicks);let best=Number.isFinite(rawBest)&&rawBest>0?Math.floor(rawBest):0;
 let disposed=false, mode='speed', phase='ready', clicks=0, rounds=0, started=0, frame=0, held=false, lastBeep=4;
 host.innerHTML=`<section class="game overdrive" aria-label="Reactor Overdrive click-speed game">
  <div class="overdrive-toolbar"><span class="overdrive-badge">REACTOR OVERDRIVE</span><button type="button" data-sound aria-pressed="false">${text.off}</button></div>
  <div class="overdrive-layout"><div class="overdrive-play">
   <p data-instruction class="overdrive-instruction">${text.instruction}</p>
   <div class="overdrive-stats"><div><span>${options.language==='zh'?'Clicks · 点击':options.language==='ko'?'Clicks · 클릭':'Clicks'}</span><b data-clicks>0</b></div><div><span>${options.language==='zh'?'Seconds · 秒':options.language==='ko'?'Seconds · 초':'Seconds left'}</span><b data-time>10.0</b></div><div><span>Clicks / second</span><b data-cps>0.00</b></div></div>
   <button type="button" class="overdrive-reactor" data-reactor aria-label="Tap reactor to start a ten-second round">
    <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false"><circle class="reactor-shell" cx="120" cy="120" r="106"/><g class="reactor-assembly"><path class="reactor-cable" d="M42 55L73 73M198 55L167 73M42 185L73 167M198 185L167 167"/><circle class="reactor-track" cx="120" cy="120" r="86"/><circle class="reactor-ring" cx="120" cy="120" r="86" pathLength="100"/><circle class="reactor-core" cx="120" cy="120" r="65"/><path class="reactor-bolt" d="M131 72L88 127H116L108 170L153 111H124Z"/></g><g fill="currentColor"><circle cx="120" cy="18" r="5"/><circle cx="222" cy="120" r="5"/><circle cx="120" cy="222" r="5"/><circle cx="18" cy="120" r="5"/></g></svg>
    <span data-tap-label>${text.tap}</span>
   </button><p class="overdrive-key">Mouse / tap / Space / Enter · Hold does not count</p>
  </div><aside class="overdrive-crew"><div class="launch-window"><span class="window-star">✦</span><span class="window-star second">✧</span><div class="launch-ship"><img src="assets/ship.svg" alt="Your spaceship, ready to launch"><span class="engine-trail" aria-hidden="true"></span></div><span class="launch-caption" data-ship>Waiting for power</span></div><div class="crew-message"><img src="assets/crew.svg" alt="Your crew engineer"><p data-crew>Power up the engines, engineer!</p></div><div class="personal-best"><span>YOUR PERSONAL BEST</span><b data-best>${best?(best/10).toFixed(2)+' CPS':'First flight!'}</b><small data-round>Round 1 / ${MAX_ROUNDS}</small></div></aside></div>
  <p class="game-status" data-status role="status" aria-live="polite">Your first tap starts the clock. Sound is off unless you turn it on.</p>
  <div class="overdrive-result" data-result hidden><h3 data-result-title></h3><p data-result-copy></p><p class="small" data-formula></p><p class="overdrive-link" data-learning-link></p></div>
  <div class="game-controls"><button type="button" data-replay hidden>Try again</button><button type="button" data-mode>${text.practice}</button><button type="button" data-return class="primary">${text.return}</button></div>
 </section>`;
 const root=find('.overdrive'), reactor=find('[data-reactor]'), soundButton=find('[data-sound]'), replay=find('[data-replay]');
 function renderStats(remaining=DURATION){
  find('[data-clicks]').textContent=String(clicks);find('[data-time]').textContent=mode==='practice'?'—':(remaining/1000).toFixed(1);
  const elapsed=(DURATION-remaining)/1000;
  find('[data-cps]').textContent=mode==='practice'?'—':phase==='ready'?'0.00':phase==='playing'&&elapsed<.25?'…':(clicks/(phase==='done'?10:elapsed)).toFixed(2);
  const energy=mode==='practice'?Math.min(clicks/10,1):Math.min(clicks/40,1);
  root.style.setProperty('--reactor-charge',String(100-energy*100));
 }
 function stop(){win.cancelAnimationFrame(frame);frame=0;sound.stop();held=false;}
 function finish(){
  if(phase!=='playing'||disposed)return;stop();phase='done';reactor.disabled=true;root.classList.remove('running');root.classList.add('launched');
  let newBest=false;
  if(mode==='speed'){
   rounds++;newBest=clicks>best;if(newBest){best=clicks;options.onBest?.({clicks,cps:Number((clicks/10).toFixed(2)),at:new Date().toISOString()});}
   find('[data-result-title]').textContent=newBest?'New personal best!':'Launch complete!';
   find('[data-result-copy]').textContent=`${clicks} clicks in 10 seconds · ${(clicks/10).toFixed(2)} CPS.`;
   find('[data-best]').textContent=(best/10).toFixed(2)+' CPS';find('[data-round]').textContent=`${rounds} / ${MAX_ROUNDS} rounds finished`;
  }else{find('[data-result-title]').textContent='Reactor fully charged!';find('[data-result-copy]').textContent='Ten energy cells added. Your ship is ready—no speed score needed.';}
  renderStats(0);find('[data-tap-label]').textContent=text.ready;reactor.setAttribute('aria-label','Round complete. Reactor charged.');find('[data-ship]').textContent='ENGINES ONLINE';find('[data-crew]').textContent=newBest?'A new record! Great work, engineer!':'Systems online. Ready for the next mission!';
  find('[data-formula]').textContent=mode==='speed'?'CPS = clicks ÷ 10 seconds. Your game result is not a lesson grade.':'No timer or speed score. This practice is not a lesson grade.';
  find('[data-learning-link]').textContent=mode==='speed'?'A counter grows after each action; the timer decides when to stop. Next, make Python update its own counter.':'The counter grows after each tap. At ten, charging stops. Next, make Python update its own counter.';
  find('[data-result]').hidden=false;find('[data-status]').textContent=mode==='speed'&&rounds>=MAX_ROUNDS?'Three rounds finished. Take a breath and return to the mission.':'Ship launched! Replay if you have time, or return to the mission.';
  replay.hidden=mode==='speed'&&rounds>=MAX_ROUNDS;sound.finish(newBest);
 }
 function tick(){
  if(disposed||phase!=='playing'||mode!=='speed')return;
  const remaining=Math.max(0,DURATION-(win.performance.now()-started));
  if(remaining===0){finish();return;}renderStats(remaining);
  const seconds=Math.ceil(remaining/1000);if(seconds<=3&&seconds<lastBeep){lastBeep=seconds;sound.countdown();find('[data-status]').textContent=`${seconds} seconds left—keep charging!`;}
  frame=win.requestAnimationFrame(tick);
 }
 function charge(){
  if(disposed||phase==='done'||(mode==='speed'&&rounds>=MAX_ROUNDS))return;
  const now=win.performance.now();if(phase==='playing'&&mode==='speed'&&now-started>=DURATION){finish();return;}
  if(phase==='ready'){
   phase='playing';started=now;lastBeep=4;root.classList.add('running');find('[data-tap-label]').textContent=text.charging;reactor.setAttribute('aria-label','Charge reactor. Each click or individual key press adds one.');find('[data-status]').textContent=mode==='practice'?'Add ten energy cells at your own pace.':'Round started! Ten seconds to power your ship.';find('[data-ship]').textContent='POWER BUILDING';replay.hidden=true;
   if(mode==='speed')frame=win.requestAnimationFrame(tick);
  }
  clicks++;renderStats(mode==='speed'?Math.max(0,DURATION-(now-started)):DURATION);sound.tap(mode==='practice'?clicks/10:Math.min(clicks/40,1));
  find('[data-crew]').textContent=clicks<10?'Energy cells connected!':clicks<25?'Keep the power flowing!':'Engines charged—go, engineer!';
  if(mode==='practice'&&clicks>=10)finish();
 }
 function reset(message=''){
  stop();clicks=0;phase='ready';lastBeep=4;root.classList.remove('running','launched');find('[data-result]').hidden=true;reactor.disabled=mode==='speed'&&rounds>=MAX_ROUNDS;
  find('[data-tap-label]').textContent=reactor.disabled?'THREE ROUNDS DONE':text.tap;replay.hidden=true;
  find('[data-instruction]').textContent=mode==='practice'?'Add ten energy cells at your own pace. No timer.':text.instruction;
  reactor.setAttribute('aria-label',mode==='practice'?'Tap reactor to add an energy cell. Ten cells charge the ship.':'Tap reactor to start a ten-second round');
  find('[data-ship]').textContent='Waiting for power';find('[data-crew]').textContent='Power up the engines, engineer!';find('[data-round]').textContent=mode==='practice'?'Untimed · no speed score':rounds>=MAX_ROUNDS?'3 / 3 rounds finished':`Round ${rounds+1} / ${MAX_ROUNDS}`;
  find('[data-status]').textContent=message||(reactor.disabled?'Three rounds finished. Return to your mission, or try calm practice.':'Ready when you are. Your first tap starts this round.');renderStats();
 }
 reactor.onclick=charge;
 reactor.onkeydown=event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();if(!event.repeat&&!held){held=true;charge();}}};
 reactor.onkeyup=event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();held=false;}};reactor.onblur=()=>held=false;
 replay.onclick=()=>{reset();reactor.focus();};
 find('[data-mode]').onclick=()=>{const wasPlaying=phase==='playing';mode=mode==='speed'?'practice':'speed';find('[data-mode]').textContent=mode==='speed'?text.practice:text.speed;reset(wasPlaying?'Mode changed. The unfinished round was cancelled; no score was saved.':'');};
 find('[data-return]').onclick=()=>{stop();options.onReturn?.();};
 soundButton.onclick=async()=>{
  soundButton.disabled=true;try{const enabled=await sound.toggle();if(disposed)return;soundButton.textContent=enabled?text.on:text.off;soundButton.setAttribute('aria-pressed',String(enabled));}
  catch{if(!disposed){soundButton.textContent=text.unavailable;find('[data-status]').textContent='Sound is unavailable in this browser. You can still play silently.';}}
  finally{if(!disposed)soundButton.disabled=false;}
 };
 const visibility=()=>{if(doc.hidden){if(phase==='playing')reset('Round cancelled because you left the tab. Tap to start a fresh round; no score was saved.');else sound.stop();}};
 doc.addEventListener('visibilitychange',visibility);
 return ()=>{disposed=true;stop();sound.dispose();doc.removeEventListener('visibilitychange',visibility);};
}
window.ReactorGame={mount};
})();
