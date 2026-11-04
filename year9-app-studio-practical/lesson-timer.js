/* Synchronised stage timer for the dashboard and its safe classroom screen. */
(()=>{'use strict';const C=DesignLessonTiming,F=DesignLessonFlow,key='y9studio-stage-timer-v1',listeners=new Set(),changes=new Set();
const paired=document.body.classList.contains('lesson-screen')&&new URLSearchParams(location.search).has('board');
let state=C.fresh(F.get().id),channel,restoring=false,controller=false,extending=false;
if(!paired)try{state=C.normalise(JSON.parse(localStorage.getItem(key)||'null'));}catch{}
if(state.id!==F.get().id)state=C.action(state,'move',F.get().id,Date.now());
function updateViews(){for(const f of listeners)f();}
function receive(value){state=C.normalise(value);updateViews();}
function persist(){
 try{localStorage.setItem(key,JSON.stringify(state));}catch{}
 try{channel?.postMessage(state);}catch{}
 updateViews();
 for(const f of changes)f();
}
function command(type,seconds=0){
 const id=type==='new'?F.steps[0].id:F.get().id;
 if(type==='new'&&id!==F.get().id){state=C.action(state,'new',id,Date.now());F.set({id,reveal:0});}
 state=C.action(state,type,id,Date.now(),seconds);persist();
}
function move(s){
 if(restoring||state.id===s.id){updateViews();return;}
 const now=Date.now();
 state=C.action(state,'move',s.id,now);
 if(C.snapshot(state,now).stageLeft<=0&&state.running)state=C.action(state,'reset-stage',s.id,now);
 if(!paired&&controller)persist();else updateViews();
}
function restore(position,timer){
 restoring=true;
 state=C.normalise(timer);F.receive(position);
 restoring=false;updateViews();
}
function responseActive(id){
 const live=window.DesignTeacherSession?.snapshot();
 const step=F.steps.find(x=>x.id===id);
 return !!live&&live.round===step?.round&&['response','retry'].includes(live.phase);
}
function advance(){
 if(!controller||document.getElementById('teacher-app')?.hidden)return;
 const s=C.snapshot(state,Date.now());
 if(!s.running||s.stageLeft>0||extending||responseActive(s.id))return;
 const next=C.plan[C.plan.indexOf(s.slot)+1];
 if(next)F.set({id:next.id,reveal:0});
 else command('toggle');
}
async function extend(seconds){
 const id=state.id;if(extending||!id.startsWith('discussion-'))return;
 extending=true;updateViews();
 try{
  if(responseActive(id))await DesignTeacherSession.extendResponse(seconds);
  if(state.id===id)command('extend',seconds);
 }catch(e){document.getElementById('teacher-message').textContent=e.message;}
 finally{extending=false;updateViews();}
}
if(!paired){
 try{channel=new BroadcastChannel(key);channel.onmessage=e=>receive(e.data);}catch{}
 addEventListener('storage',e=>{if(e.key===key&&e.newValue){try{receive(JSON.parse(e.newValue));}catch{}}});
}
F.on(move);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(el,{controls=false}={}){
 el.className='lesson-stage-timer '+(controls?'timer-controls':'timer-projector');el.setAttribute('aria-label','60-minute lesson timing');
 el.innerHTML='<p class="timer-slide-name" data-timer-slide></p><div class="timer-current"><span data-timer-label>Slide time left</span><strong data-timer-value aria-live="off">'+C.time(C.plan[0].seconds)+'</strong><span data-timer-state>Ready</span></div><div class="timer-context"><p data-timer-budget></p><p data-timer-plan></p></div><div class="timer-lesson"><span data-timer-lesson-label>60-minute lesson · time left</span><strong data-timer-lesson aria-live="off">60:00</strong></div>'+(controls?'<p class="timer-help">Press Start once. At zero the next slide opens and starts automatically.</p><div class="timer-actions"><button type="button" data-timer-toggle>Start this slide</button><button type="button" data-timer-reset>Reset slide time</button><div class="timer-actions" data-discussion-extensions hidden><button type="button" data-discussion-add="30">+30 sec discussion</button><button type="button" data-discussion-add="60">+1 min discussion</button></div></div><details class="timer-details"><summary>60-minute plan & restart</summary><p>Start once. The timer follows Previous and Next. Returning keeps the time already used. Reveals do not restart it.</p><p>Pause to stay on a slide. If a student response timer is still active, this slide waits for it to finish.</p><table><thead><tr><th>Lesson minutes</th><th>Stage</th><th>Time</th></tr></thead><tbody>'+C.plan.map(p=>{const step=F.steps.find(s=>s.id===p.id);return '<tr data-timer-row="'+p.id+'"><td>'+C.time(p.start)+'–'+C.time(p.end)+'</td><td>'+esc(step.title[0])+'</td><td>'+C.time(p.seconds)+'</td></tr>';}).join('')+'</tbody></table><button type="button" data-timer-new>Restart the 60-minute lesson</button><p>To follow from another device, open the live class and copy its projector link.</p></details>':'');
 const q=sel=>el.querySelector(sel);if(controls)controller=true;if(controls)el.insertBefore(q('.timer-actions'),q('.timer-context'));
 if(controls){q('[data-timer-toggle]').onclick=()=>command('toggle');q('[data-timer-reset]').onclick=()=>command('reset-stage');q('[data-timer-new]').onclick=()=>command('new');for(const b of el.querySelectorAll('[data-discussion-add]'))b.onclick=()=>extend(Number(b.dataset.discussionAdd));}
 function paint(){const s=C.snapshot(state,Date.now()),bi=F.get().lang==='bi',t=(en,zh)=>bi?en+' · '+zh:en,slot=s.slot,step=F.steps.find(x=>x.id===s.id),slideIndex=F.steps.indexOf(step),used=s.spent[s.id]||0,stageOver=s.stageLeft<=0,lessonOver=s.lessonLeft<=0;el.dataset.running=String(s.running);el.dataset.overtime=String(stageOver);el.dataset.urgent=String(s.running&&s.stageLeft>0&&s.stageLeft<=30);
 q('[data-timer-slide]').textContent=t('Slide '+(slideIndex+1)+' of '+F.steps.length+' · '+step.title[0],'第 '+(slideIndex+1)+' 页 · '+step.title[1]);q('[data-timer-label]').textContent=t('Slide time left','本页剩余时间');q('[data-timer-value]').textContent=C.time(s.stageLeft);
 q('[data-timer-state]').textContent=stageOver?(s.id==='game'?t('Lesson complete','课程结束'):responseActive(s.id)?t('Waiting for responses','等待回答'):t('Time is up','时间到')):s.running?t('Running','计时中'):used>0?t('Paused on this slide','本页已暂停'):controls?t('Ready · press Start this slide','准备好后点击开始本页计时'):t('Waiting for the teacher to start','等待老师开始计时');
 q('[data-timer-budget]').textContent=t('This slide: '+C.time(slot.seconds+(s.extra[s.id]||0)),'本页用时 '+C.time(slot.seconds+(s.extra[s.id]||0)));q('[data-timer-plan]').textContent=t('Planned lesson time: '+C.time(slot.start)+'–'+C.time(slot.end),'计划课堂时间 '+C.time(slot.start)+'–'+C.time(slot.end));
 q('[data-timer-lesson-label]').textContent=lessonOver?t('60-minute lesson · overtime','60 分钟课堂：超时'):t('60-minute lesson · time left','60 分钟课堂：剩余时间');q('[data-timer-lesson]').textContent=(lessonOver?'+':'')+C.time(Math.abs(s.lessonLeft));
 if(controls){q('[data-discussion-extensions]').hidden=!s.id.startsWith('discussion-');for(const b of el.querySelectorAll('[data-discussion-add]'))b.disabled=extending;q('[data-timer-toggle]').textContent=s.running?'Pause timer':used>0?'Resume this slide':'Start this slide';q('[data-timer-toggle]').setAttribute('aria-pressed',String(s.running));for(const row of el.querySelectorAll('[data-timer-row]')){if(row.dataset.timerRow===s.id)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');}}
 }
 listeners.add(paint);paint();return {paint};
}
setInterval(()=>{advance();updateViews();},250);addEventListener('visibilitychange',updateViews);
window.DesignLessonTimer={mount,command,restore,onChange:f=>changes.add(f),get:()=>C.snapshot(state,Date.now())};
})();
