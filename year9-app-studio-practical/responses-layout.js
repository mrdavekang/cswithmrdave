/* Independent teacher authentication in this private responses window. */
(()=>{'use strict';const $=id=>document.getElementById(id),session=new URLSearchParams(location.search).get('session');
document.title='Year 9 · Private student responses';document.querySelector('.gc-dash-header h1').textContent='Student responses';document.querySelector('.gc-private').textContent='PRIVATE · keep off the classroom screen';const back=document.querySelector('.gc-dash-header a');back.href='teacher.html?class='+encodeURIComponent(new URLSearchParams(location.search).get('class')==='9E'?'9E':'9T');back.textContent='Lesson dashboard ↗';back.target='_blank';
$('tab-live').textContent='Live responses';$('tab-records').textContent='All saved lesson work';$('tab-teaching').hidden=true;
const cue=$('cue-title').closest('.gc-panel'),discussion=$('round-title').closest('.gc-panel');for(const el of [cue,discussion,$('teacher-demo-panel'),$('gc-live-nav')])el.classList.add('responses-omit');
$('end-class').hidden=true;$('projector-link').hidden=true;
let shownRecords=false;function showRecords(){if(!shownRecords&&!$('teacher-app').hidden){shownRecords=true;$('tab-records').click();}}document.addEventListener('y9-teacher-auth',showRecords);document.addEventListener('DOMContentLoaded',showRecords);
let selected=false;const roomSelect=$('room-select');if(roomSelect)new MutationObserver(()=>{if(selected||!session||![...$('room-select').options].some(o=>o.value===session))return;selected=true;$('room-select').value=session;$('room-select').dispatchEvent(new Event('change'));}).observe(roomSelect,{childList:true});
})();
