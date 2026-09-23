(()=>{'use strict';const plan=window.SESSION_PLAN,clock=window.LessonClock;
const root=document.createElement('details');root.id='lesson-clock';root.innerHTML=`<summary><span>Lesson clock</span> <b id="clock-short"></b></summary><div class="clock-panel"><h2>11:20 a.m.–12:20 p.m.</h2><p class="clock-note">Malaysia time · uses your device clock</p><label><input id="clock-follow" type="checkbox" checked> Follow lesson clock</label><p class="clock-note">This suggests an activity. It never moves you automatically.</p><div id="clock-guidance"><h3 id="clock-stage"></h3><strong id="clock-countdown"></strong><p id="clock-current"></p><p id="clock-next"></p><button id="clock-open">Open suggested page</button></div><h3>Today's plan</h3><ol>${plan.stages.map(s=>`<li><b>${clock.time(s.start)}–${clock.time(s.end)}</b> ${s.title} <small>(${s.end-s.start} min)</small></li>`).join('')}</ol><p class="clock-note">Extension and review fit within task time when your teacher directs you. Keep working at your own pace when needed.</p></div>`;document.body.append(root);
let following=true;try{following=localStorage.getItem('y11w5s3-follow-clock')!=='off';}catch{}const check=document.getElementById('clock-follow');check.checked=following;
check.onchange=()=>{following=check.checked;try{localStorage.setItem('y11w5s3-follow-clock',following?'on':'off');}catch{}update();};
const show=(id,text)=>document.getElementById(id).textContent=text;
function update(){const now=clock.at(clock.seconds()),info=window.LessonClassroom?.info(),left=Math.max(0,Math.ceil(now.remaining)),display=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
 show('clock-short',following?(now.phase==='after'?'Finished':display):'Not following');document.getElementById('clock-guidance').hidden=!following;
 show('clock-stage',now.phase==='before'?'Before the lesson':now.phase==='after'?'Lesson time has ended':now.stage.title);
 show('clock-countdown',now.phase==='before'?display+' until 11:20':now.phase==='after'?'Save any remaining work':display+' remaining');
 const current=window.LESSON.stages.find(s=>s[0]===info?.page);show('clock-current',info?.entry?'Enter your name and class to open the lesson.':'Your page: '+(current?.[1]||'Lesson'));
 const next=plan.stages[plan.stages.indexOf(now.stage)+1];show('clock-next',now.phase==='after'?'You can continue studying independently.':next?'Next: '+next.title+' at '+clock.time(next.start):'Finish: save your PDF and submit to Teams.');
 const button=document.getElementById('clock-open');button.disabled=!!info?.entry||!!window.ClassroomMode?.locked();button.textContent=window.ClassroomMode?.locked()?'Teacher has paused page changes':'Open '+now.stage.title;
}
document.getElementById('clock-open').onclick=()=>{if(!following)return;window.LessonClassroom?.navigate(clock.at(clock.seconds()).stage.id);};
setInterval(update,1000);window.addEventListener('lesson:render',update);document.addEventListener('visibilitychange',update);update();
})();
