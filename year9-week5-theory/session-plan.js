'use strict';
window.SESSION_PLAN=Object.freeze({
  zone:'Asia/Kuala_Lumpur',
  start:620,
  end:680,
  topic:'Nested selection, validation and test data',
  wagba:'Use nested selection and choose suitable validation checks and test data.',
  keywords:'nested selection · validation · presence · type · range · length · format · normal · boundary · erroneous',
  challenge:'Explain which test exposes a weak validation rule, then improve the rule and test it again.',
  stages:[
    {id:'read',title:'Read first',start:620,end:624,steps:['Read how one decision can lead to another.','Trace the outer decision before the inner decision.','Complete the five reading checks.']},
    {id:'starter',title:'Do Now',start:624,end:628,steps:['Arrange both short nested programs.','Complete the six retrieval questions.','Use the feedback to correct one mistake.']},
    {id:'types',title:'Types of Learning',start:628,end:632,steps:['Use your starter evidence to check knowledge, skills and understanding.','Separate independent work from work completed with support.','Choose one precise improvement target.']},
    {id:'nested-read',title:'Read nested code',start:632,end:637,steps:['Follow the highlighted route line by line.','Match each else with the if at the same indentation.','Predict which inner decision will run.']},
    {id:'parsons',title:'Main Task 1 · Arrange',start:637,end:643,steps:['Arrange both scenario programs.','Check the outer and inner branches.','Run through each route using the supplied values.']},
    {id:'debug',title:'Main Task 1 · Repair',start:643,end:649,steps:['Repair the missing comparison.','Repair the missing colon.','Repair the indentation, then run each program.']},
    {id:'program',title:'Main Task 1 · Program',start:649,end:659,steps:['Build the laptop loan adviser.','Create all three decision paths.','Run every test and improve the code.']},
    {id:'validation-read',title:'Read validation',start:659,end:664,steps:['Compare presence, type, range, length and format checks.','Study the validation routine.','Identify what each check can and cannot prove.']},
    {id:'validation',title:'Main Task 2 · Apply',start:664,end:670,steps:['Match each rule to a suitable check.','Classify normal, boundary and erroneous data.','Explain why the boundary tests matter.']},
    {id:'pit',title:'Learning Pit Stop',start:670,end:674,steps:['Return to the same six learning checks.','Use evidence from your code and answers.','Choose the phase that best describes each area.']},
    {id:'plenary',title:'Plenary',start:674,end:677,steps:['Arrange the final nested decision.','Answer the validation and boundary questions.','Correct any answer that does not explain why.']},
    {id:'extension',title:'Further challenge',start:677,end:679,steps:['Improve the ticket desk program.','Handle blank, text, decimal and out-of-range input.','Test every route before claiming it works.']},
    {id:'submit',title:'Save and submit',start:679,end:680,steps:['Check your name, class and evidence.','Save the lesson as a PDF.','Submit the PDF in Teams.']}
  ]
});
window.LessonClock=Object.freeze({
  at(seconds){const p=window.SESSION_PLAN,stage=p.stages.find(s=>seconds>=s.start*60&&seconds<s.end*60);return seconds<p.start*60?{phase:'before',stage:p.stages[0],remaining:p.start*60-seconds}:seconds>=p.end*60?{phase:'after',stage:p.stages.at(-1),remaining:0}:{phase:'active',stage,remaining:stage.end*60-seconds};},
  seconds(date=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:window.SESSION_PLAN.zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return +parts.hour*3600 + +parts.minute*60 + +parts.second;},
  time(minutes){return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;}
});
