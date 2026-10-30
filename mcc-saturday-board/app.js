'use strict';
const sessions=[
['10:00–10:30am','Set up, log in and set your goals','Setup & getting everyone ready'],
['10:30–10:45am','Code, test and ask focused questions','Coaching'],
['10:45–11:00am','Independent coding · try before asking','Place food order by 11am'],
['11:00–11:30am','Independent coding · keep investigating','Lunch administration'],
['11:30am–12:00pm','Code, test and ask focused questions','Coaching'],
['12:00–12:30pm','Lunch collection · follow instructions','Coordinating lunch orders'],
['12:30–1:00pm','Lunch & break · respect quiet time','Protected lunch break · safety only'],
['1:00–2:40pm','Challenge yourself · code, test, improve','Coaching'],
['2:40–3:00pm','Check submissions, reflect and pack up','Final coaching & wrap-up']
];
const tbody=document.querySelector('#schedule'); const focus=document.querySelector('#focus');
sessions.forEach((session,index)=>{const row=document.createElement('tr');if(index===6)row.classList.add('break');session.forEach(text=>{const cell=document.createElement('td');cell.textContent=text;row.append(cell)});tbody.append(row);const option=document.createElement('option');option.value=String(index);option.textContent=session[0];focus.append(option)});
const eventDate='2026-10-31';
const sessionBoundaries=[600,630,645,660,690,720,750,780,880,900];
const malaysiaClock=new Intl.DateTimeFormat('en-GB',{
  timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit',
  hour:'2-digit',minute:'2-digit',hourCycle:'h23'
});
function automaticSession(now){
  const parts=Object.fromEntries(malaysiaClock.formatToParts(now).map(part=>[part.type,part.value]));
  const date=`${parts.year}-${parts.month}-${parts.day}`;
  const minutes=Number(parts.hour)*60+Number(parts.minute);
  if(date<eventDate || (date===eventDate && minutes<600)){
    return {index:-1,message:'Auto · starts 31 October at 10:00am (Malaysia time). Manual preview available.'};
  }
  if(date>eventDate){
    return {index:-1,message:'Auto · event finished on 31 October at 3:00pm (Malaysia time).'};
  }
  if(minutes>=900){
    return {index:-1,message:'Auto · sessions finished. Parent collection: 3:00pm (Malaysia time).'};
  }
  const index=sessionBoundaries.findIndex((start,i)=>minutes>=start && minutes<sessionBoundaries[i+1]);
  return {index,message:`Auto · now: ${sessions[index][0]} (Malaysia time).`};
}
const focusMode=document.querySelector('#focus-mode');
const focusStatus=document.querySelector('#focus-status');
const autoFocus=document.querySelector('#auto-focus');
function updateFocus(now=new Date()){
  const automatic=focus.value==='auto';
  const state=automatic?automaticSession(now):{
    index:focus.value===''?-1:Number(focus.value),
    message:focus.value===''?'Manual · no highlight. Auto updates are paused.':`Manual preview · ${sessions[Number(focus.value)][0]}. Auto updates are paused.`
  };
  Array.from(tbody.rows).forEach((row,index)=>row.classList.toggle('focused',index===state.index));
  focusMode.textContent=automatic?'Auto':'Manual';
  autoFocus.hidden=automatic;
  if(focusStatus.textContent!==state.message)focusStatus.textContent=state.message;
}
focus.addEventListener('change',()=>updateFocus());
autoFocus.addEventListener('click',()=>{focus.value='auto';updateFocus()});
updateFocus();
setInterval(()=>updateFocus(),1000);
document.addEventListener('visibilitychange',()=>updateFocus());
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-panel]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));document.querySelectorAll('main > section').forEach(section=>section.hidden=section.id!==button.dataset.panel);document.querySelector('#view-status').textContent=''}));
const fullscreen=document.querySelector('#fullscreen'); fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen()}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen()}else{throw new Error('unsupported')}}catch{document.querySelector('#view-status').textContent='Fullscreen unavailable. Use your browser’s fullscreen option.'}});
document.addEventListener('fullscreenchange',()=>{fullscreen.querySelector('span').textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';fullscreen.setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen')});
document.querySelector('#copy').addEventListener('click',async()=>{const prompt=document.querySelector('#prompt');const status=document.querySelector('#copy-status');try{if(!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(prompt.value);status.textContent='Copied. Choose your level and add your challenge and attempt.'}catch{prompt.focus();prompt.select();status.textContent='Copy unavailable. The prompt is selected—press Ctrl+C or ⌘C, or use your device’s Copy command.'}});
