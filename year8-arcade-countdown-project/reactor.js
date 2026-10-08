/* Local mini-game. Taps are input events, not while-loop iterations. */
window.CrewReactor = (() => {
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const routes={normal:{pause:1000,label:'Round 1'},fast:{pause:500,label:'Round 2'}};
  function safeRounds(value){
    if(!Array.isArray(value))return [];
    return value.slice(-40).filter(r=>r&&routes[r.type]&&typeof r.id==='string'&&Number.isFinite(r.presses)&&Number.isFinite(r.elapsed)).map(r=>({
      id:r.id.slice(0,100),type:r.type,pause:routes[r.type].pause,
      status:['complete','interrupted','in-progress'].includes(r.status)?r.status:'interrupted',
      presses:Math.max(0,Math.min(100000,Math.floor(r.presses))),
      iterations:Math.max(0,Math.min(5,Math.floor(Number(r.iterations)||0))),
      elapsed:Math.max(0,Math.min(3600,r.elapsed)),at:String(r.at||'').slice(0,50)
    }));
  }
  function html(){return `<section class="rush" id="reactor-rush" aria-label="Reactor Rush countdown game">
    <div class="rush-toolbar"><strong>5 repetitions · two different pauses</strong><button type="button" class="rush-sound" aria-pressed="false">Sound: off</button></div>
    <div class="rush-layout"><section>
      <div class="rush-bay"><span class="rush-status">REACTOR STANDBY</span><span class="rush-time" aria-label="Countdown display">5</span>
        <button type="button" class="rush-charge" disabled><svg class="rush-core" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><path d="M55 18 30 54h18l-4 28 28-39H53z"/></svg><span>⚡ Charge</span></button>
        <img class="rush-crew" src="assets/crew.svg" alt="Crew member beside the reactor"><img class="rush-ship" src="assets/ship.svg" alt="Launch pod">
        <div class="rush-meter" aria-hidden="true"><span></span></div>
      </div>
      <div class="rush-actions"><button type="button" class="rush-start" data-round="normal">▶ Round 1 · 5 s</button><button type="button" class="rush-start" data-round="fast">▶ Round 2 · 2.5 s</button></div>
      <p class="rush-count">Energy: <span class="rush-presses">0</span> presses</p>
      <p class="rush-notes">Tap, or focus Charge and press Space / Enter. No holding keys. The meter is visual only: there is no target to pass.</p>
    </section><section class="rush-trace" aria-label="Live while-loop trace">
      <h3>What controls the charging time?</h3>
      <pre><code><span data-line="start">countdown = 5</span>
<span data-line="condition">while countdown &gt; 0:</span>
<span data-line="display">    display(countdown)</span>
<span data-line="pause">    pause(<b class="rush-pause">1000</b> ms)</span>
<span data-line="change">    countdown -= 1</span>
<span data-line="launch">launch()</span></code></pre>
      <p class="rush-condition">First check: 5 &gt; 0 → True</p>
      <div class="rush-iterations">Repetitions finished: <span>0 / 5</span></div>
      <p>This is a plain-language loop model, not code to paste. Each <strong>Charge</strong> press is a separate input event. It does not change the countdown.</p>
    </section></div>
    <div class="rush-results" role="status" aria-live="polite"><p>Start Round 1. Charge while its countdown is running. Then make your prediction below and try Round 2.</p></div>
  </section><p class="rush-bridge">After the rounds, change the waiting time in your own MakeCode game. The starting counter—not the pause—sets the number of repetitions.</p>
  <p class="muted">Your CPS (presses per second) is just for fun, not a computing grade. No leaderboard. You can continue without playing.</p>`;}
  function mount({host,rounds=[],sound=false,onRound=()=>{},onSound=()=>{}}){
    const $=selector=>host.querySelector(selector),buttons=[...host.querySelectorAll('.rush-start')],charge=$('.rush-charge');
    let active=null,disposed=false,audio=null,soundOn=!!sound,frame=null,pulseTimer=null,lastTone=-Infinity;
    const history=safeRounds(rounds);
    const soundButton=$('.rush-sound');
    function highlight(name){host.querySelectorAll('[data-line]').forEach(el=>el.classList.toggle('trace-active',el.dataset.line===name));}
    function tone(frequency,duration=.045){
      if(!soundOn||disposed)return;
      try{
        if(!audio){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio=new Audio();}
        if(audio.state==='suspended')audio.resume().catch(()=>{});
        const oscillator=audio.createOscillator(),gain=audio.createGain(),time=audio.currentTime;
        oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,time);
        gain.gain.setValueAtTime(.035,time);gain.gain.exponentialRampToValueAtTime(.001,time+duration);
        oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(time);oscillator.stop(time+duration);
      }catch(e){/* Sound is decorative; the game remains usable without audio. */}
    }
    function soundLabel(){soundButton.textContent='Sound: '+(soundOn?'on':'off');soundButton.setAttribute('aria-pressed',String(soundOn));}
    function record(round,status=round.status){
      round.status=status;
      round.elapsed=(performance.now()-round.start)/1000;
      const data={id:round.id,type:round.type,pause:round.pause,status,presses:round.presses,iterations:round.iterations,elapsed:round.elapsed,at:round.at};
      const i=history.findIndex(r=>r.id===data.id);if(i<0)history.push(data);else history[i]=data;
      onRound(data);
    }
    function resultSummary(){
      const completed=history.filter(r=>r.status==='complete');
      if(!completed.length)return;
      const latest=completed.at(-1),cps=latest.elapsed>0?latest.presses/latest.elapsed:0;
      $('.rush-results').innerHTML=`<p><strong>${routes[latest.type].label}:</strong> ${latest.presses} presses · ${latest.elapsed.toFixed(2)} s · ${cps.toFixed(1)} CPS · ${latest.iterations} repetitions.</p><small>${latest.type==='normal'?'Now predict below, then try Round 2.':'Same 5 repetitions; a shorter pause gives less charging time. Continue to Main Task 2.'} Speed is not a grade.</small>`;
    }
    function wait(ms,signal){return new Promise(resolve=>{
      let timer;
      const finish=ok=>{clearTimeout(timer);signal.removeEventListener('abort',abort);resolve(ok);};
      const abort=()=>finish(false);
      if(signal.aborted){resolve(false);return;}
      signal.addEventListener('abort',abort,{once:true});timer=setTimeout(()=>finish(true),Math.max(0,ms));
    });}
    function stop(reason){
      if(!active)return;
      const round=active;active=null;round.controller.abort();cancelAnimationFrame(frame);frame=null;
      charge.disabled=true;buttons.forEach(b=>b.disabled=false);
      record(round,'interrupted');
      if(!disposed){$('.rush-status').textContent='ROUND PAUSED';$('.rush-results').innerHTML='<p>'+esc(reason)+'</p><small>No score is required. Restart either round or continue.</small>';}
    }
    function refreshTime(round){
      if(active!==round||disposed)return;
      // The deadline check also runs on every input, so delayed timers never accept late taps.
      if(performance.now()>=round.deadline)charge.disabled=true;
      frame=requestAnimationFrame(()=>refreshTime(round));
    }
    async function begin(type){
      if(active||disposed)return;
      const route=routes[type];if(!route)return;
      const start=performance.now(),round={id:Date.now()+'-'+Math.random().toString(36).slice(2),type,pause:route.pause,start,deadline:start+5*route.pause,presses:0,iterations:0,status:'in-progress',at:new Date().toISOString(),controller:new AbortController()};
      active=round;host.classList.remove('is-finished');buttons.forEach(b=>b.disabled=true);charge.disabled=false;
      $('.rush-presses').textContent='0';$('.rush-meter span').style.width='0%';$('.rush-iterations span').textContent='0 / 5';$('.rush-status').textContent='CHARGING OPEN';
      $('.rush-pause').textContent=String(route.pause);$('.rush-results').textContent=route.label+': charge while the counter is greater than 0. Each press adds one energy unit.';
      record(round);charge.focus({preventScroll:true});tone(400);refreshTime(round);
      let countdown=5;
      // This is an actual yielding while loop: 5 true condition checks, then a false check.
      while(countdown>0){
        $('.rush-time').textContent=String(countdown);$('.rush-condition').textContent=countdown+' > 0 → True';highlight('pause');
        const waiting=await wait(round.start+(round.iterations+1)*round.pause-performance.now(),round.controller.signal);
        if(!waiting||disposed||active!==round)return;
        countdown-=1;round.iterations++;
        $('.rush-iterations span').textContent=round.iterations+' / 5';record(round);
      }
      active=null;cancelAnimationFrame(frame);frame=null;charge.disabled=true;buttons.forEach(b=>b.disabled=false);
      $('.rush-time').textContent='GO!';$('.rush-status').textContent='LAUNCH READY';$('.rush-condition').textContent='0 > 0 → False → finished';highlight('launch');host.classList.add('is-finished');
      record(round,'complete');resultSummary();tone(660,.14);
    }
    function press(){
      const round=active;if(!round||disposed||performance.now()>=round.deadline)return;
      round.presses++;$('.rush-presses').textContent=String(round.presses);$('.rush-meter span').style.width=Math.min(100,round.presses*5)+'%';
      const core=$('.rush-core');core.classList.add('pulse');clearTimeout(pulseTimer);pulseTimer=setTimeout(()=>core.classList.remove('pulse'),90);
      if(performance.now()-lastTone>55){tone(350+Math.min(round.presses,20)*12);lastTone=performance.now();}
      record(round);
    }
    const click=event=>{const button=event.target.closest('button');if(!button||!host.contains(button))return;
      if(button.dataset.round)begin(button.dataset.round);
      if(button===charge)press();
      if(button===soundButton){soundOn=!soundOn;soundLabel();onSound(soundOn);if(soundOn)tone(500,.07);else if(audio)audio.suspend().catch(()=>{});}
    };
    const keydown=event=>{if(event.target===charge&&(event.key===' '||event.key==='Enter')){event.preventDefault();if(!event.repeat)press();}};
    const keyup=event=>{if(event.target===charge&&(event.key===' '||event.key==='Enter'))event.preventDefault();};
    const visibility=()=>{if(document.hidden)stop('The round paused when you left this tab. Return and restart when you are ready.');};
    host.addEventListener('click',click);host.addEventListener('keydown',keydown);host.addEventListener('keyup',keyup);document.addEventListener('visibilitychange',visibility);
    soundLabel();resultSummary();
    return {destroy(){if(disposed)return;stop('You left the game card.');disposed=true;cancelAnimationFrame(frame);clearTimeout(pulseTimer);host.removeEventListener('click',click);host.removeEventListener('keydown',keydown);host.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',visibility);if(audio)audio.close().catch(()=>{});}};
  }
  return {html,mount,safeRounds};
})();
