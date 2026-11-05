/* Client-side acknowledgment only. This never reads answers or receipts from Forms. */
const surveyVersion='school-SX9gHRwz8X-20261105';
const shortClass=!new URLSearchParams(location.search).has('preview')&&new URLSearchParams(location.search).get('lesson')!=='full';
const classroomOrder=['intro','survey','learn','types','practice','draw','reflect','plenary','finish'];
function surveyIdentity(){return JSON.stringify([surveyVersion,state.name.trim().toLowerCase(),state.group.trim().toLowerCase()]);}
function surveyConfirmed(){return state.notes?.surveyReceipt===surveyIdentity();}
let surveyOpenedFor='';
function bindSurvey(){
 const open=$('#surveyOpen'),box=$('#surveyReceipt'),button=$('#surveyContinue'),status=$('#surveyStatus');
 const done=surveyConfirmed();
 function update(){box.disabled=!done&&surveyOpenedFor!==surveyIdentity();button.disabled=box.disabled||!box.checked;}
 if(done){box.checked=true;status.textContent='Submission already confirmed on this device.';}
 else{status.textContent='Open the survey first. Confirm only after you see the submission message.';}
 open.addEventListener('click',()=>{surveyOpenedFor=surveyIdentity();status.textContent='Return to this tab after Microsoft Forms confirms your submission.';update();});
 box.onchange=update;
 $('#surveyConfirm').onsubmit=e=>{
  e.preventDefault();
  if(!box.checked||(!surveyConfirmed()&&surveyOpenedFor!==surveyIdentity()))return;
  state.notes.surveyReceipt=surveyIdentity();go(shortClass?'learn':'before');
 };
 update();
}
function adaptClassroomStage(id){
 if(!shortClass)return;
 const card=$('#main article');
 function next(selector,dest,label){const b=card.querySelector(selector);if(b){b.dataset.go=dest;b.textContent=label;}}
 if(id==='types')next('.next','practice','Start Main Task 1A →');
 if(id==='draw')next('.next','reflect','Learning Pit Stop →');
 if(id==='reflect'){
  card.querySelector('.kicker').textContent='LEARNING PIT STOP · AFTER MAIN TASK 1';
  next('[data-go="extend"]','plenary','Plenary →');
 }
 if(id==='plenary'){
  card.querySelector('ol').innerHTML='<li>What changed between your frames?</li><li>What stayed in the same place, and why?</li>';
  const zh=document.createElement('p');zh.className='zh';zh.lang='zh-Hans';zh.textContent='两个画格之间，什么变了？什么保持原位？为什么？';card.querySelector('ol').after(zh);
 }
 if(id==='finish'){
  const zh=card.querySelector('.zh');
  zh.textContent='下载 PNG 精灵图表和可编辑的 JSON 备份，保存你的作品。Scratch 或 Python 项目以后再做。';
  const paragraphs=card.querySelectorAll('p');
  const old=[...paragraphs].find(p=>p.textContent.includes('Turn in'));
  if(old)old.textContent='Save your editable JSON backup and sprite sheet PNG. Follow your teacher’s instructions about submitting today’s work. The Scratch or Python project comes in the next lesson.';
  card.querySelector('[data-go="review"]')?.remove();
  const later=document.createElement('a');later.href='?lesson=full';later.textContent='Open the full workshop later';card.append(later);
 }
}
