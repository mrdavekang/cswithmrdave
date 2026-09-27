/* Teacher-led presentation pages. They do not appear in the student lesson navigation. */
(()=>{'use strict';
const base=window.LessonClassroom;
if(!base)return;
const meta={topic:'Relational databases and SQL data manipulation',wagba:'Explain linked tables and change precisely the intended records.',keywords:'primary key · foreign key · relationship · redundancy · INSERT INTO · UPDATE · DELETE FROM · WHERE',challenge:'Predict exactly which rows change and justify the prediction.'};
const lessonSlides=LESSON_PAGES.map(([title,time],i)=>({id:`slide-lesson-${i}`,title:`${String(i).padStart(2,'0')} · ${title}`,tag:time,body:`<h2>Student instructions</h2><ol>${instruction(i).map(x=>`<li>${x}</li>`).join('')}</ol>`}));
const facts=[
 {id:'slide-fact-keys',title:'Fact 1 · Keys create reliable links',tag:'DISCUSS',body:`<div class="fact-big">A foreign key stores the primary-key value of a related record.</div><div class="relation-visual"><div><b>Student</b><code>StudentID: S014</code></div><span>1 → many</span><div><b>Loan</b><code>StudentID: S014</code><code>StudentID: S014</code></div></div>${question('factKeys','Why is StudentID suitable for the link, but the student name is less reliable?')}`},
 {id:'slide-fact-where',title:'Fact 2 · WHERE controls the affected rows',tag:'PREDICT',body:`<div class="fact-big">UPDATE says what changes. WHERE says which record changes.</div><pre class="slide-code">UPDATE Loan\nSET Returned = TRUE\nWHERE LoanID = 'L102';</pre>${question('factWhere','Which row changes, which rows stay unchanged, and how do you know?')}`},
 {id:'slide-fact-safety',title:'Fact 3 · Preview destructive changes',tag:'EXPLAIN',body:`<div class="fact-big">A valid query can still change the wrong data.</div><div class="safety-steps"><span>1 · Read the WHERE condition</span><span>2 · Predict the matching rows</span><span>3 · Preview or test safely</span><span>4 · Run only when the result is correct</span></div>${question('factSafety','What is the danger of DELETE FROM Loan without a WHERE condition?')}`}
];
const slides=[...lessonSlides,...facts];let selected=null,pending=null;
function instruction(i){return [
 ['Read the library scenario and trace Loan L102 through both foreign keys.','Write the student and book, then explain each link.','Keep the three database tables visible while you work.'],
 ['Answer all four retrieval questions from memory first.','Check each answer against the visible records.','Correct one weak explanation in a full sentence.'],
 ['Use your starter evidence to identify knowledge, skill and understanding.','Choose the area that needs most improvement.','State the exact action that will help you improve today.'],
 ['Identify every primary and foreign key.','Explain both one-to-many relationships.','Explain one redundancy or inconsistency the design avoids.'],
 ['Read each SQL command line by line.','Point to the table, field, value and WHERE condition.','Explain why UPDATE and DELETE need a precise WHERE.'],
 ['Write and preview all four SQL changes.','For each query, state what changes and what stays unchanged.','Correct the first syntax or selection error you find.'],
 ['Choose the learning phase that matches your actual work.','Quote evidence from a relationship or SQL task.','Name one precise next action.'],
 ['Explain how Loan links Student and Book.','Write a safe DELETE statement.','Name the specific point you still need to practise.'],
 ['Complete the printed database and SQL exam questions.','Work independently for the first attempt.','Mark and correct in a different colour.'],
 ['Record your score and one mark you reclaimed.','Compare your answer with the mark-scheme requirement.','Write the corrected answer clearly.'],
 ['Complete the retrieval paper from earlier topics.','Check every answer after the first attempt.','Record one improvement.'],
 ['Read through your answers and correction.','Save and open the PDF to check it.','Submit the PDF in Teams.']
 ][i];}
function question(key,label){return `<section class="slide-question"><h2>Class question</h2><label>${label}<textarea rows="3" data-key="${key}">${esc(appState.answers[key]||'')}</textarea></label><p>Your answer stays only in this browser and is included in your PDF.</p></section>`}
function lookup(id){return slides.find(s=>s.id===id)}
function renderSlide(){
 let root=$('teacher-presentation');if(!selected){root?.remove();document.body.classList.remove('presentation-open');return}
 const slide=lookup(selected);if(!slide)return;
 if(!root){root=document.createElement('section');root.id='teacher-presentation';document.body.append(root)}
 document.body.classList.add('presentation-open');
 root.innerHTML=`<aside><p class="eyebrow">YEAR 11 · RELATIONAL SQL</p><h3>Topic</h3><p>${meta.topic}</p><h3>WAGBA</h3><p>${meta.wagba}</p><h3>Keywords</h3><p>${meta.keywords}</p><h3>Challenge</h3><p>${meta.challenge}</p></aside><main><header><span>${slide.tag}</span><h1>${slide.title}</h1></header><article>${slide.body}</article><footer><button type="button" id="presentation-close">Return to lesson</button><span>Teacher-led slide · answers save locally</span></footer></main>`;
 $('presentation-close').onclick=()=>{if(!teacherMode&&window.ClassroomMode?.locked?.())return;selected=null;renderSlide();window.dispatchEvent(new Event('lesson:render'))};
}
function open(id){if(!lookup(id))return;if(!$('landing').hidden){pending=id;return}selected=id;renderSlide();window.scrollTo(0,0);window.dispatchEvent(new Event('lesson:render'))}
window.addEventListener('lesson:render',()=>{if(pending&&$('landing').hidden){const id=pending;pending=null;open(id)}});
window.LessonClassroom=Object.freeze({
 info:()=>({...base.info(),page:selected||base.info().page}),pages:()=>[...base.pages(),...slides.map(s=>s.id)],destinations:base.destinations,
 label:()=>selected?lookup(selected).title:base.label(),teacherPages:()=>slides.map(s=>({id:s.id,title:s.title})),openTeacherPage:id=>{if(teacherMode)open(id)},
 navigate:id=>{if(lookup(id))open(id);else{selected=null;renderSlide();base.navigate(id)}},
 move:id=>{if(teacherMode)return;base.captureOwn();if(lookup(id))open(id);else{pending=null;selected=null;renderSlide();base.move(id)}},
 captureOwn:base.captureOwn,returnOwn:()=>{selected=null;pending=null;renderSlide();base.returnOwn()},setSession:base.setSession,clearTarget:()=>{pending=null;base.clearTarget()},
 demoPrograms:base.demoPrograms,startDemo:base.startDemo,stopDemo:base.stopDemo,demoState:base.demoState
});
})();
