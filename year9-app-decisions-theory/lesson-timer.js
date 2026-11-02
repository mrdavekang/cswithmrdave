/* Synchronised stage timer for the dashboard and its safe classroom screen. */
(()=>{'use strict';const C=DesignLessonTiming,F=DesignLessonFlow,key='y9t-stage-timer-v1',listeners=new Set();let state,channel;
function read(){try{const value=localStorage.getItem(key);return value?C.normalise(JSON.parse(value)):state||C.fresh(F.get().id);}catch{return state||C.fresh(F.get().id);}}
state=read();if(state.id!==F.get().id)state=C.action(state,'move',F.get().id,Date.now());
function updateViews(){for(const f of listeners)f();}
function receive(value){state=C.normalise(value);updateViews();}
function command(type){const current=read();state=C.action(current,'move',F.get().id,Date.now());state=C.action(state,type,F.get().id,Date.now());try{localStorage.setItem(key,JSON.stringify(state));}catch{}try{channel?.postMessage(state);}catch{}updateViews();}
function move(s){const current=read();if(current.id===s.id){state=current;updateViews();return;}state=C.action(current,'move',s.id,Date.now());try{localStorage.setItem(key,JSON.stringify(state));}catch{}try{channel?.postMessage(state);}catch{}updateViews();}
try{channel=new BroadcastChannel(key);channel.onmessage=e=>receive(e.data);}catch{}
addEventListener('storage',e=>{if(e.key===key){try{receive(JSON.parse(e.newValue||'null'));}catch{}}});F.on(move);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mounts=[];
function mount(el,{controls=false}={}){
 el.className='lesson-stage-timer '+(controls?'timer-controls':'timer-projector');el.setAttribute('aria-label','60-minute lesson timing');
 el.innerHTML='<div class="timer-current"><span data-timer-label>Stage time left</span><strong data-timer-value aria-live="off">'+C.time(C.plan[0].seconds)+'</strong><span data-timer-state>Ready</span></div><div class="timer-context"><p data-timer-budget></p><p data-timer-plan></p></div><div class="timer-lesson"><span data-timer-lesson-label>60-minute lesson · time left</span><strong data-timer-lesson aria-live="off">60:00</strong></div>'+(controls?'<div class="timer-actions"><button type="button" data-timer-toggle>Start timer</button><button type="button" data-timer-reset>Reset stage</button></div><details class="timer-details"><summary>60-minute plan & restart</summary><p>Start once. The timer follows Previous and Next. Returning keeps the time already used. Reveals do not restart it.</p><p>Pause for an interruption. Time running out never changes the slide or ends a live discussion.</p><table><thead><tr><th>Lesson minutes</th><th>Stage</th><th>Time</th></tr></thead><tbody>'+C.plan.map(p=>{const step=F.steps.find(s=>s.id===p.id);return '<tr data-timer-row="'+p.id+'"><td>'+C.time(p.start)+'–'+C.time(p.end)+'</td><td>'+esc(step.title[0])+'</td><td>'+C.time(p.seconds)+'</td></tr>';}).join('')+'</tbody></table><button type="button" data-timer-new>Restart the 60-minute lesson</button><p>The projector follows in the same browser. Live discussion response time is separate.</p></details>':'');
 const q=sel=>el.querySelector(sel),view={el,q,controls};mounts.push(view);
 if(controls){q('[data-timer-toggle]').onclick=()=>command('toggle');q('[data-timer-reset]').onclick=()=>command('reset-stage');q('[data-timer-new]').onclick=()=>command('new');}
 function paint(){const s=C.snapshot(state,Date.now()),bi=F.get().lang==='bi',t=(en,zh)=>bi?en+' · '+zh:en,slot=s.slot,stageOver=s.stageLeft<=0,lessonOver=s.lessonLeft<=0;el.dataset.running=String(s.running);el.dataset.overtime=String(stageOver);el.dataset.urgent=String(s.running&&s.stageLeft>0&&s.stageLeft<=30);
 q('[data-timer-label]').textContent=stageOver?t('Stage overtime','本阶段超时'):t('Stage time left','本阶段剩余时间');q('[data-timer-value]').textContent=(stageOver?'+':'')+C.time(Math.abs(s.stageLeft));
 q('[data-timer-state]').textContent=stageOver?t('Time is up — finish this stage','时间到，请完成本阶段'):s.running?t('Running','计时中'):s.elapsed>0?t('Paused','已暂停'):t('Ready — start from the teacher dashboard','准备好后由老师开始计时');
 q('[data-timer-budget]').textContent=t('This slide: '+C.time(slot.seconds),'本页用时 '+C.time(slot.seconds));q('[data-timer-plan]').textContent=t('Planned lesson time: '+C.time(slot.start)+'–'+C.time(slot.end),'计划课堂时间 '+C.time(slot.start)+'–'+C.time(slot.end));
 q('[data-timer-lesson-label]').textContent=lessonOver?t('60-minute lesson · overtime','60 分钟课堂：超时'):t('60-minute lesson · time left','60 分钟课堂：剩余时间');q('[data-timer-lesson]').textContent=(lessonOver?'+':'')+C.time(Math.abs(s.lessonLeft));
 if(controls){q('[data-timer-toggle]').textContent=s.running?'Pause timer':s.elapsed>0?'Resume timer':'Start timer';q('[data-timer-toggle]').setAttribute('aria-pressed',String(s.running));for(const row of el.querySelectorAll('[data-timer-row]')){if(row.dataset.timerRow===s.id)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');}}
 }
 listeners.add(paint);paint();return {paint};
}
setInterval(updateViews,250);addEventListener('visibilitychange',updateViews);
window.DesignLessonTimer={mount,command,get:()=>C.snapshot(state,Date.now())};
})();
