/* HTML counterpart of the supplied TTA 16:9 lesson template. */
window.RouteProjector=(()=>{
 'use strict';const E=RouteLive.esc;
 const stages=[
  ['mission','Mission overview',['Open Route Rescue from your Teams Classwork link.','Read the mission. You will create, read and repair a Python route.','Enter your name and class. Choose language support if you need it.']],
  ['overview','Overview video',['Watch the teacher overview together. Notice the code and its output.','Our goal: create, read and repair a list using indexes.','After the video, open Do Now. Keep the lesson tab ready.']],
  ['starter','Do Now',['Open Do Now in the lesson menu.','Answer the three questions. Use the index labels to check each position.','Read the feedback before you move to Types of Learning.']],
  ['learning','Types of Learning',['Look at your starter answer and the example on your screen.','Choose what helped you find the index. Notice your next practice step.','Knowledge: name the index. Skills: read or update. Understanding: explain what stays unchanged.']],
  ['main1','Main Task 1',['Type the requested route in Your code. Use the example to check punctuation.','Predict, then press Run. Compare your output with the target.','Complete the three essentials. Try the deeper reading tasks when ready.']],
  ['main2','Main Task 2',['Read the starting route and the target before editing.','Use the index to replace the requested element. Print the list.','Run and compare. Check that the other two values stayed unchanged.']],
  ['pit','Learning Pitstop',['Open Learning Pit Stop. Compare your starter and code evidence.','Check your understanding of a list update. Then choose how today’s learning felt.','Point, speak or write one example: Before I needed ___. Now I can ___.']],
  ['extension','Go Further',['Choose the next challenge in Go Further. Read its starting data and expected output.','Type and Run your own solution. Use a hint if needed.','Finish one challenge, then continue to the next while you have time.']],
  ['plenary','Plenary',['Open Plenary. Work on the two exit questions independently.','Read the short program from top to bottom. Predict before choosing.','Explain which element changes and which elements stay the same.']],
  ['report','Save and submit',['Choose Save report to download your PDF. Check your name and class.','Attach the PDF to the Teams assignment your teacher names.','Choose Turn in. Downloading alone does not submit your work.']]
 ];
 function automatic(r){return RouteLive.cue(r.clockSeconds)[5]||'mission';}
 function stage(r){return ['invite','response','discuss','retry','follow'].includes(r.phase)?(r.round===1?'main1':'main2'):(r.boardStage||automatic(r));}
 function render(r,language='en'){
  const id=stage(r),s=stages.find(x=>x[0]===id)||stages[0],live=r.connected&&r.phase!=='work',c=RouteLive.rounds[r.round],count=RouteLive.countdown(r),timed=count.timed,left=count.left,duration=count.duration;
  const activeCue=RouteLive.cue(r.clockSeconds),stageDuration=r.boardStage?(r.boardStageDuration||180):(activeCue[1]-activeCue[0])*60;
  const stageLeft=r.boardStage?Math.max(0,stageDuration-(r.clockSeconds-(r.boardStageAnchor||0))):Math.max(0,activeCue[1]*60-r.clockSeconds);
  const seconds=timed?left:stageLeft,percent=timed?Math.min(1,left/duration):Math.min(1,seconds/stageDuration);
  const label=!r.connected?'Teacher connection paused':r.phase==='invite'?'Open the live question when you are ready':r.phase==='response'?'Your first attempt':r.phase==='discuss'?'Eyes to the board':r.phase==='retry'?'Your correction':r.phase==='follow'?'Watch, edit and Run your own code':'Work in the lesson app';
  const clock=timed?r.pausedSeconds!=null?'Paused':RouteLive.time(left):r.phase==='invite'?'Ready':r.phase==='discuss'?'Discuss':r.phase==='follow'?'Try it':RouteLive.time(seconds);
  const translated=language==='zh'?c.zh:language==='ko'?c.ko:'';
  let content;
  if(live){
   const show=r.revealed&&r.demo,featured=r.featured;
   content='<p class="tta-live-prompt">'+E(c.prompt)+'</p>'+(translated?'<p class="tta-eal">'+E(translated)+'</p>':'')+
    '<section class="tta-code-area"><h2>'+(featured?'Anonymous class example':show?'Teacher example · live':'Starting code')+'</h2><pre class="tta-code">'+E(featured?featured.code:show?r.demo.code:c.starter)+'</pre>'+((featured||show)?'<div class="tta-output"><b>Output</b><pre>'+E(featured?featured.output+(featured.error?'\n'+featured.error:''):r.demo.output)+'</pre></div>':'<p class="tta-response-reminder">Choose Open live question at the bottom of your lesson. Type in Your Python code.</p>')+'</section>';
  }else content='<ol class="tta-instructions">'+s[2].map(t=>'<li>'+E(t)+'</li>').join('')+'</ol>';
  return '<nav class="tta-progress" aria-label="Current lesson stage">'+stages.map((x,i)=>'<span class="'+(id===x[0]?'active':'')+'" '+(id===x[0]?'aria-current="step"':'')+'>'+String(i+1).padStart(2,'0')+' '+E(x[1])+'</span>').join('')+'</nav>'+
   '<article class="tta-slide" aria-label="TTA lesson cue: '+E(s[1])+'">'+
   '<section class="tta-box tta-topic"><h2>Topic</h2><p>Python lists: create, read and update.</p></section>'+
   '<section class="tta-box tta-wagba"><h2>WAGBA (KSU)</h2><p>We are getting better at using indexes to read and change values in a Python list.</p></section>'+
   '<section class="tta-box tta-keywords"><h2>Keywords</h2><p>list · element · index · retrieve · update · output</p><div class="tta-ksu"><p><b>Knowledge</b><br>List, element and index.</p><p><b>Skills</b><br>Create, print, retrieve, update.</p><p><b>Understanding</b><br>An update replaces one element. The others stay unchanged.</p></div></section>'+
   '<h1 class="tta-title">'+E(s[1])+'</h1><p class="tta-state">'+E(live?'Live '+r.round+' · '+label:label)+'</p>'+
   '<div class="tta-timer '+(count.urgent?'warning':'')+'"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="55"/><circle class="tta-ring" cx="60" cy="60" r="55" pathLength="100" stroke-dasharray="100" stroke-dashoffset="'+(100-percent*100)+'"/></svg><div><strong>'+E(clock)+'</strong><small>'+E(timed?count.urgent?'Respond now':'Response time':r.phase==='work'?'This stage':label==='Eyes to the board'?'Look up':'Live coding')+'</small></div></div>'+
   '<div class="tta-content '+(live?'tta-live':'')+'">'+content+'</div>'+
   '<section class="tta-box tta-challenge"><h2>Challenge Task</h2><p>Repair the route without rewriting the list.</p></section>'+
   '<img class="tta-logo" src="assets/tenby-isp-logo.png" alt="Tenby Schools and International Schools Partnership">'+
   '</article>';
 }
 return {stages,stage,render};
})();
