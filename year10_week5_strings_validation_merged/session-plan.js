'use strict';
window.SESSION_PLAN=Object.freeze({
 zone:'Asia/Kuala_Lumpur',start:470,end:530,
 topic:'String operations and validation using selection',
 wagba:'Examine text and test validation decisions accurately.',
 keywords:'concatenation · length · index · substring · validation · normal · boundary · erroneous',
 challenge:'Prove that the checker behaves correctly at both limits.',
 stages:[
  {id:'page-0',title:'Prepare',start:470,end:474,steps:['Read the username scenario.','Identify the two jobs.','Note today’s validation boundary.']},
  {id:'page-1',title:'Do Now',start:474,end:479,steps:['Answer from memory.','Predict before running len().','Correct one answer if needed.']},
  {id:'page-2',title:'Types of Learning',start:479,end:482,steps:['Use starter evidence.','Rate all six KSU targets.','Choose one improvement action.']},
  {id:'page-3',title:'Read string operations',start:482,end:487,steps:['Follow positions 0–4.','Compare indexing and slicing.','Explain the excluded stop index.']},
  {id:'page-4',title:'Main Activity 1',start:487,end:498,steps:['Use the line pointer.','Predict and run the example.','Adapt it for Amir28.']},
  {id:'page-5',title:'Read validation',start:498,end:503,steps:['Read the 5–8 rule.','Identify both rejection tests.','Explain the else branch.']},
  {id:'page-6',title:'Main Activity 2',start:503,end:517,steps:['Trace one input.','Build the checker in your IDE.','Record code and output.']},
  {id:'page-7',title:'Test data',start:517,end:523,steps:['Run all six tests.','Record actual results.','Explain any mismatch.']},
  {id:'page-9',title:'Learning Pit Stop',start:523,end:526,steps:['Revisit all six KSU targets.','Choose a learning phase for each.','State one next action.']},
  {id:'page-10',title:'Plenary',start:526,end:528,steps:['Apply the six-character rule.','Name the boundary lengths.','Explain why one test is insufficient.']},
  {id:'page-11',title:'Save and submit',start:528,end:530,steps:['Save and open the PDF.','Check evidence and name.','Submit it in Teams.']}
 ]
});
window.LessonClock=Object.freeze({at(seconds){const p=SESSION_PLAN,s=p.stages.find(x=>seconds>=x.start*60&&seconds<x.end*60);return seconds<p.start*60?{phase:'before',stage:p.stages[0],remaining:p.start*60-seconds}:seconds>=p.end*60?{phase:'after',stage:p.stages.at(-1),remaining:0}:{phase:'active',stage:s,remaining:s.end*60-seconds}},seconds(date=new Date()){const x=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:SESSION_PLAN.zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));return +x.hour*3600 + +x.minute*60 + +x.second},time(minutes){return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`}});
