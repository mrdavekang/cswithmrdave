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
focus.addEventListener('change',()=>{Array.from(tbody.rows).forEach((row,index)=>row.classList.toggle('focused',String(index)===focus.value));document.querySelector('#view-status').textContent=focus.value===''?'':`Highlighted: ${sessions[Number(focus.value)][0]}`});
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-panel]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));document.querySelectorAll('main > section').forEach(section=>section.hidden=section.id!==button.dataset.panel);document.querySelector('#view-status').textContent=''}));
const fullscreen=document.querySelector('#fullscreen'); fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen()}else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen()}else{throw new Error('unsupported')}}catch{document.querySelector('#view-status').textContent='Fullscreen unavailable. Use your browser’s fullscreen option.'}});
document.addEventListener('fullscreenchange',()=>{fullscreen.querySelector('span').textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';fullscreen.setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen')});
document.querySelector('#copy').addEventListener('click',async()=>{const prompt=document.querySelector('#prompt');const status=document.querySelector('#copy-status');try{if(!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(prompt.value);status.textContent='Copied. Choose your level and add your challenge and attempt.'}catch{prompt.focus();prompt.select();status.textContent='Copy unavailable. The prompt is selected—press Ctrl+C or ⌘C, or use your device’s Copy command.'}});
