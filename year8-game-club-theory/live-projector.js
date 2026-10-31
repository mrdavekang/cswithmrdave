(() => {
  'use strict';
  const G=GameLive,E=G.esc,$=id=>document.getElementById(id),key=new URLSearchParams(location.search).get('key');
  let room=null,received=0,offset=0,busy=false,signature='',sound=false,audio=null,previousStage='',sounds=new Set();
  const celebration=GameCelebrations.create(true);
  const instructions={
    'Starting drill':['Click the large typing area. Type the words and symbols; correct mistakes with Backspace.','Type and run the supplied Python model. Compare its original and appended lists.','Try the small change. Accuracy matters more than speed.'],
    'Briefing':['Read Welcome to Game Club, then compare the original roster with the finished target.','Notice replacement, append, the list length and one possible captain.','You will build the features in small steps, not all at once.'],
    'Do Now':['Open Do Now. Read the code before each question.','Run the new len() example. Use the word banks to explain the two counts.','Compare length with the final index. Use feedback before moving on.'],
    'Types of Learning':['Try the Knowledge, Skills and Understanding checks.','Use your answer as evidence: do you need the worked example, guided practice or changed data?','This is a starting point, not a grade.'],
    'Main Task 1':['Read the starting list and expected output before typing.','In YOUR CODE, replace the requested value or append the new player.','Run and check. Compare before and after; complete the next numbered activity.'],
    'Loop typing reset':['Type the supplied while loop, including the indented lines.','Run it. Check every name appears once.','Make the small change and run again before Main Task 2.'],
    'Main Task 2':['Read the loop condition, list length and counter update.','Type and run the program. Compare each output line with the current roster.','Test the captain selector. A random choice may repeat and must belong to the list.'],
    'Extension':['If you have time, try the next numbered challenge.','Study its starting data, reference code and expected output.','Finish one, then continue to a deeper challenge. Use changed data to test your idea.'],
    'Learning Pit Stop':['Compare your Knowledge, Skills and Understanding evidence.','Explain how today’s learning felt, using an example from your own code.','Choose one specific practice and say how you will check it.'],
    'Plenary':['Answer the three exit questions independently.','Read the complete code before predicting.','Explain append, length or the loop stopping condition using today’s examples.'],
    'Save & submit':['Export your progress PDF. Find the downloaded file.','Open this lesson’s assignment in Teams Classwork. Attach the PDF.','Choose Turn in. Downloading the report is not submitting it.']
  };
  function ping(type='stage'){
    if(!sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();const frequencies=type==='end'?[660,440]:type==='urgent'?[523,659]:[660,880];
      frequencies.forEach((freq,i)=>{const o=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime+i*.18;o.type='sine';o.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(Number($('board-volume').value),t+.02);gain.gain.exponentialRampToValueAtTime(.001,t+.23);o.connect(gain);gain.connect(audio.destination);o.start(t);o.stop(t+.25);});
    }catch{sound=false;$('board-sound').textContent='Enable gentle timing sounds';}
  }
  function current(){const r=G.effective(room,Date.now()+offset);if(r&&Date.now()-received>18000){r.connected=false;r.phase='work';}return r;}
  function stage(r){if(r.connected&&r.phase!=='work')return 'Live discussion '+r.round;return r.boardStage||G.cue(G.elapsed(r,received))[2];}
  function render(){
    const r=current();if(!r)return;const name=stage(r),live=r.connected&&r.phase!=='work',c=G.rounds[r.round],lang=$('board-language').value;
    const sig=name+':'+r.phase+':'+r.revealed+':'+JSON.stringify(r.demo)+':'+lang;
    if(sig!==signature){signature=sig;
      const content=live?'<p class="tta-live-prompt">'+E(c.prompt)+'</p>'+(lang!=='en'?'<p class="tta-eal">'+E(c[lang])+'</p>':'')+'<div class="tta-code-grid"><section><h2>'+(r.revealed?'Teacher example · LIVE':'Starting code · try it yourself')+'</h2><pre>'+E(r.demo?.code||c.starter)+'</pre></section><section><h2>'+(r.revealed?'Teacher’s output':'Expected output')+'</h2><pre>'+E(r.demo?.output||c.output)+'</pre></section></div><p class="tta-reminder">'+E(r.phase==='discuss'?'Eyes to the board. Compare the ideas.':r.phase==='follow'||r.phase==='retry'?'Follow the live demonstration; improve your separate code on your device.':'Join the live question at the bottom of your lesson. Run → Compare → Send.')+'</p>':'<ol class="tta-instructions">'+(instructions[name]||instructions['Main Task 1']).map(x=>'<li>'+E(x)+'</li>').join('')+'</ol>';
      $('board-content').innerHTML='<nav class="tta-progress" aria-label="Current lesson stage">'+G.cues.map(x=>'<span '+(name===x[2]?'aria-current="step"':'')+'>'+E(x[2])+'</span>').join('')+'</nav><article class="tta-slide"><section class="tta-box tta-topic"><h2>Topic</h2><p>Python lists, loops & random choices</p></section><section class="tta-box tta-wagba"><h2>WAGBA</h2><p>'+E(LESSON.wagba)+'</p></section><section class="tta-box tta-keywords"><h2>Keywords</h2><p>'+E(LESSON.keywords)+'</p><div class="tta-ksu">'+['K','S','U'].map((g,i)=>'<p><b>'+['Knowledge','Skills','Understanding'][i]+'</b><br>'+E(LESSON.goals[g].en)+'</p>').join('')+'</div></section><h1 class="tta-title">'+E(name)+'</h1><p class="tta-state">'+E(live?'Checkpoint '+r.round+' · '+r.phase:'Work in your lesson app')+'</p><div class="tta-timer"><strong id="tta-time"></strong><small id="tta-time-label"></small></div><div class="tta-content '+(live?'tta-live':'')+'">'+content+'</div><section class="tta-box tta-challenge"><h2>Challenge Task</h2><p>'+E(LESSON.challenge)+'</p></section><div class="tta-school">TENBY SCHOOLS<br><small>COMPUTER SCIENCE · YEAR 8</small></div></article>';
    }
    const timed=live&&['response','retry'].includes(r.phase),left=G.remaining(r,Date.now()+offset),elapsed=G.elapsed(r,received),cue=G.cue(elapsed);
    $('tta-time').textContent=timed?G.time(left):live?(r.phase==='invite'?'Ready':r.phase==='discuss'?'Discuss':'Try it'):G.time(Math.max(0,(r.boardStage?3600:cue[1]*60)-elapsed));
    $('tta-time-label').textContent=timed?(r.pausedSeconds!=null?'Paused':left<r.responseDuration/2?'Respond now':'Response time'):'Lesson elapsed '+G.time(elapsed);
    document.querySelector('.tta-timer').classList.toggle('urgent',timed&&r.pausedSeconds==null&&left>0&&left<r.responseDuration/2);
    $('board-status').textContent=r.ended?'Session ended · return to independent work':!r.connected?'Teacher connection paused · work independently':'Class '+r.className+' · '+G.time(Math.max(0,3600-elapsed))+' lesson time left';
    if(previousStage&&name!==previousStage)ping();previousStage=name;
    if(timed&&r.pausedSeconds==null){const k=r.id+':'+r.round+':'+r.responseEpoch;for(const n of [60,30,0])if(left<=n&&!sounds.has(k+':'+n)){sounds.add(k+':'+n);if(left>=n-2)ping(n===0?'end':'urgent');}}
  }
  async function poll(){if(busy||!key)return;busy=true;try{const next=await G.rpc('board',{p_key:key});if(room&&next.revision<room.revision)return;room=next;received=Date.now();offset=Date.parse(next.serverNow)-Date.now();celebration.observe(next,next.celebrations||[],'projector');render();}catch(e){$('board-status').textContent='Connection paused · '+e.message;}finally{busy=false;}}
  $('board-language').onchange=render;$('board-sound').onclick=async()=>{sound=!sound;if(sound){audio ||= new (window.AudioContext||window.webkitAudioContext)();await audio.resume();ping();}$('board-sound').textContent=sound?'Mute timing sounds':'Enable gentle timing sounds';};
  $('board-fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();};
  if(key){poll();setInterval(poll,2000);setInterval(render,1000);}else $('board-status').textContent='Open from the teacher dashboard · no private information shown';
})();
