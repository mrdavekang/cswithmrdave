'use strict';
window.SESSION_PLAN=Object.freeze({
 zone:'Asia/Kuala_Lumpur',start:840,end:900,
 topic:'Relational databases and SQL data manipulation',
 wagba:'Explain linked tables and change precisely the intended records.',
 keywords:'primary key · foreign key · one-to-many · redundancy · inconsistency · INSERT INTO · UPDATE · DELETE FROM · WHERE',
 challenge:'Predict exactly which records change and justify the prediction.',
 stages:[
  {id:'page-0',title:'Prepare',start:840,end:846,steps:['Read the library scenario.','Trace Loan L102 through StudentID and BookID.','Explain both links using the matching key values.']},
  {id:'page-1',title:'Do Now',start:846,end:851,steps:['Answer all four questions from memory.','Check the linked records in the tables.','Correct one incomplete explanation.']},
  {id:'page-2',title:'Types of Learning',start:851,end:854,steps:['Use evidence from the starter.','Separate knowledge, skill and understanding.','Choose one precise improvement action.']},
  {id:'page-3',title:'Main Task 1 · Relationships',start:854,end:868,steps:['Identify every primary and foreign key.','Explain both one-to-many relationships.','Explain the repeated data the design avoids.']},
  {id:'page-4',title:'Read SQL changes',start:868,end:875,steps:['Compare INSERT, UPDATE and DELETE.','Identify table, field, value and WHERE.','Explain the risk of missing WHERE.']},
  {id:'page-5',title:'Main Task 2 · SQL',start:875,end:891,steps:['Write and preview all four queries.','State what changes and stays unchanged.','Correct a syntax or row-selection error.']},
  {id:'page-6',title:'Learning Pit Stop',start:891,end:894,steps:['Choose a phase using actual work.','Quote evidence from one task.','Name your next action.']},
  {id:'page-7',title:'Plenary',start:894,end:898,steps:['Explain the relationships.','Write a safe DELETE query.','Identify one precise practice need.']},
  {id:'page-11',title:'Save and submit',start:898,end:900,steps:['Check your name and answers.','Save and open the PDF.','Submit it in Teams.']}
 ]
});
window.LessonClock=Object.freeze({
 at(seconds){const p=window.SESSION_PLAN,stage=p.stages.find(s=>seconds>=s.start*60&&seconds<s.end*60);return seconds<p.start*60?{phase:'before',stage:p.stages[0],remaining:p.start*60-seconds}:seconds>=p.end*60?{phase:'after',stage:p.stages.at(-1),remaining:0}:{phase:'active',stage,remaining:stage.end*60-seconds}},
 seconds(date=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:window.SESSION_PLAN.zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return +parts.hour*3600 + +parts.minute*60 + +parts.second},
 time(minutes){return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`}
});
