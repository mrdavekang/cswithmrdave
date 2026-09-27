'use strict';
window.SESSION_PLAN=Object.freeze({
  zone:'Asia/Kuala_Lumpur',
  start:780,
  end:840,
  topic:'Selection, comparisons and Boolean decisions',
  wagba:'Trace and build Python selection that uses comparison operators to choose the correct output.',
  keywords:'selection · condition · comparison · Boolean · True · False · branch · indentation · trace',
  challenge:'Find a boundary value that reveals a weak comparison, repair the rule and prove both paths work.',
  stages:[
    {id:'mission',title:'Read first',start:780,end:784,steps:['Read today’s problem and WAGBA.','Identify input, condition and output.','Use the worked example before answering.']},
    {id:'starter1',title:'Do Now',start:784,end:790,steps:['Complete the five retrieval questions.','Use the code, not a guess, as evidence.','Correct one answer before moving on.']},
    {id:'before',title:'Types of Learning',start:790,end:794,steps:['Check the six knowledge, skill and understanding statements.','Count only what your starter work demonstrates.','Choose the area you need to improve most.']},
    {id:'six',title:'Main Task 1 · Comparisons',start:794,end:798,steps:['Study the operator table and examples.','Say each comparison in words.','Notice which expressions become True or False.']},
    {id:'match',title:'Main Task 1 · Predict and trace',start:798,end:807,steps:['Match operators to meanings.','Trace the conditions using the supplied values.','Explain why one branch runs.']},
    {id:'syntax-read',title:'Main Task 2 · Read selection',start:807,end:811,steps:['Follow if, condition and colon.','Check indentation inside each branch.','Predict the output before running code.']},
    {id:'mp1',title:'Main Task 2 · Build and test',start:811,end:824,steps:['Arrange and repair the selection programs.','Build two clear decision paths.','Run boundary tests and record what changed.']},
    {id:'ext1',title:'Further challenge',start:824,end:829,steps:['Choose a programming challenge.','Modify the comparison or output.','Run values from both sides of the boundary.']},
    {id:'after',title:'Learning Pit Stop',start:829,end:833,steps:['Return to the same six checks.','Use evidence from your trace and program.','Choose a learning phase and a precise next step.']},
    {id:'exit-operators',title:'Plenary',start:833,end:838,steps:['Recall the comparison operators.','Explain True and False conditions.','Distinguish assignment from comparison.']},
    {id:'review',title:'Save and submit',start:838,end:840,steps:['Check your name, class and evidence.','Save the lesson as a PDF.','Submit the PDF in Teams.']}
  ]
});
window.LessonClock=Object.freeze({
  at(seconds){const p=window.SESSION_PLAN,stage=p.stages.find(s=>seconds>=s.start*60&&seconds<s.end*60);return seconds<p.start*60?{phase:'before',stage:p.stages[0],remaining:p.start*60-seconds}:seconds>=p.end*60?{phase:'after',stage:p.stages.at(-1),remaining:0}:{phase:'active',stage,remaining:stage.end*60-seconds};},
  seconds(date=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:window.SESSION_PLAN.zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return +parts.hour*3600 + +parts.minute*60 + +parts.second;},
  time(minutes){return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;}
});
