(()=>{'use strict';const plan=window.SESSION_PLAN,clock=window.LessonClock;
const root=document.createElement('details');root.id='lesson-clock';root.innerHTML=`<summary title="Drag to move; click to open lesson clock"><span id="clock-time"></span><b id="clock-short"></b><span id="clock-bubble-stage"></span></summary><div class="clock-panel"><h2>1:00–2:00 p.m.</h2><p class="clock-note">Malaysia time · uses your device clock</p><label><input id="clock-follow" type="checkbox" checked> Follow lesson clock</label><p class="clock-note">This suggests an activity. It never moves you automatically.</p><div id="clock-guidance"><h3 id="clock-stage"></h3><strong id="clock-countdown"></strong><p id="clock-current"></p><p id="clock-next"></p><button id="clock-open">Open suggested page</button></div><fieldset class="clock-corners"><legend>Move clock to a corner</legend><button type="button" data-corner="tl">↖ Top left</button><button type="button" data-corner="tr">↗ Top right</button><button type="button" data-corner="bl">↙ Bottom left</button><button type="button" data-corner="br">↘ Bottom right</button></fieldset><h3>Today's plan</h3><ol>${plan.stages.map(s=>`<li><b>${clock.time(s.start)}–${clock.time(s.end)}</b> ${s.title} <small>(${s.end-s.start} min)</small></li>`).join('')}</ol><p class="clock-note">Extra-time drawing and poster challenges fit within task time when your teacher directs you. Keep working at your own pace when needed.</p></div>`;document.body.append(root);
let following=true;try{following=localStorage.getItem('y7w5-follow-clock')!=='off';}catch{}const check=document.getElementById('clock-follow');check.checked=following;
check.onchange=()=>{following=check.checked;try{localStorage.setItem('y7w5-follow-clock',following?'on':'off');}catch{}update();};
const show=(id,text)=>document.getElementById(id).textContent=text;
function update(){const now=clock.at(clock.seconds()),info=window.LessonClassroom?.info(),left=Math.max(0,Math.ceil(now.remaining)),display=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
 show('clock-time',clock.time(Math.floor(clock.seconds()/60)));show('clock-bubble-stage',following?(now.phase==='before'?'Starts 13:00':now.phase==='after'?'Save & submit':now.stage.title):'Clock only');
 show('clock-short',following?(now.phase==='after'?'Finished':display):'Not following');document.getElementById('clock-guidance').hidden=!following;
 show('clock-stage',now.phase==='before'?'Before the lesson':now.phase==='after'?'Lesson time has ended':now.stage.title);
 show('clock-countdown',now.phase==='before'?display+' until 13:00':now.phase==='after'?'Save any remaining work':display+' remaining');
 const current=window.LESSON.stages.find(s=>s[0]===info?.page);show('clock-current',info?.entry?'Enter your name and class to open the lesson.':'Your page: '+(current?.[1]||'Lesson'));
 const next=plan.stages[plan.stages.indexOf(now.stage)+1];show('clock-next',now.phase==='after'?'You can continue studying independently.':next?'Next: '+next.title+' at '+clock.time(next.start):'Finish: save your PDF and submit to Teams.');
 const button=document.getElementById('clock-open');button.disabled=!!info?.entry||!!window.ClassroomMode?.locked();button.textContent=window.ClassroomMode?.locked()?'Teacher has paused page changes':'Open '+now.stage.title;
}
document.getElementById('clock-open').onclick=()=>{if(!following)return;window.LessonClassroom?.navigate(clock.at(clock.seconds()).stage.id);};
// Drag the compact summary; snap to the nearest corner after releasing it.
let corner='br';try{const saved=localStorage.getItem('y7w5-clock-corner');if(['tl','tr','bl','br'].includes(saved))corner=saved;}catch{}
function place(value){corner=value;root.dataset.corner=value;root.style.left='';root.style.top='';root.style.right='';root.style.bottom='';try{localStorage.setItem('y7w5-clock-corner',value);}catch{}}
place(corner);
root.querySelectorAll('[data-corner]').forEach(b=>b.onclick=()=>place(b.dataset.corner));
const handle=root.querySelector('summary');let drag=null,suppressClick=false;
handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=root.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top,moved:false};handle.setPointerCapture(e.pointerId);});
handle.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>6)drag.moved=true;if(!drag.moved)return;root.open=false;root.style.right='auto';root.style.bottom='auto';root.style.left=Math.max(8,Math.min(innerWidth-120,drag.left+dx))+'px';root.style.top=Math.max(8,Math.min(innerHeight-120,drag.top+dy))+'px';});
function drop(e){if(!drag)return;if(drag.moved){suppressClick=true;place((e.clientY<innerHeight/2?'t':'b')+(e.clientX<innerWidth/2?'l':'r'));}drag=null;}
handle.addEventListener('pointerup',drop);handle.addEventListener('pointercancel',()=>{drag=null;place(corner);});
handle.addEventListener('click',e=>{if(suppressClick){e.preventDefault();suppressClick=false;}});
setInterval(update,1000);window.addEventListener('lesson:render',update);document.addEventListener('visibilitychange',update);update();
})();
