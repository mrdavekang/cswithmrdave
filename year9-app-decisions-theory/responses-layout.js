/* Independent teacher authentication in this private responses window. */
(()=>{'use strict';const $=id=>document.getElementById(id),session=new URLSearchParams(location.search).get('session');
document.title='Year 9T · Private student responses';document.querySelector('.gc-dash-header h1').textContent='Student responses';document.querySelector('.gc-private').textContent='PRIVATE · keep off the classroom screen';const back=document.querySelector('.gc-dash-header a');back.href='teacher.html';back.textContent='Lesson dashboard ↗';back.target='_blank';
$('tab-live').textContent='Live responses';$('tab-records').textContent='All saved lesson work';$('tab-teaching').hidden=true;
const cue=$('cue-title').closest('.gc-panel'),discussion=$('round-title').closest('.gc-panel');for(const el of [cue,discussion,$('teacher-demo-panel'),$('gc-live-nav')])el.classList.add('responses-omit');
$('end-class').hidden=true;$('projector-link').hidden=true;
let selected=false;const roomSelect=$('room-select');if(roomSelect)new MutationObserver(()=>{if(selected||!session||![...$('room-select').options].some(o=>o.value===session))return;selected=true;$('room-select').value=session;$('room-select').dispatchEvent(new Event('change'));}).observe(roomSelect,{childList:true});
})();
