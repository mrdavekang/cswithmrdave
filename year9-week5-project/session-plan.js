'use strict';
window.SESSION_PLAN=Object.freeze({
  zone:'Asia/Kuala_Lumpur',start:530,end:590,
  topic:'Improve the helpdesk adviser',
  wagba:'Improve the helpdesk program so it handles unsuitable input, makes a nested decision and passes planned tests.',
  keywords:'input · validation · integer · variable · constant · nested selection · or · and · boundary · erroneous data · test evidence',
  challenge:'Explain why the program must reject unsuitable input before it calculates or gives advice.',
  stages:[
    {id:'read',title:'Read first',start:530,end:536,steps:['Read Sam’s helpdesk problem.','Follow the highlighted code one line at a time.','Notice why validation comes before advice.']},
    {id:'starter',title:'Do Now',start:536,end:542,steps:['Complete all six checks.','Use the feedback to correct mistakes.','Keep your first answers as starting evidence.']},
    {id:'types',title:'Types of Learning',start:542,end:546,steps:['Use the six checks to identify your main focus.','Read the explanation for the highest score.','Choose a precise next step.']},
    {id:'main1',title:'Main Task 1',start:546,end:566,steps:['Build and run the one-condition nested program.','Challenge 2: predict and run the separate OR model.','Compare OR with AND, then choose the rule for two inputs.']},
    {id:'main2',title:'Main Task 2',start:566,end:581,steps:['Arrange the validation Parsons puzzle.','Follow Predict, Run, Investigate and Modify on one input.','Make the full program, then predict, run and improve planned tests.']},
    {id:'challenge',title:'Further challenge',start:581,end:585,steps:['Copy your working program.','Extend it without breaking the original routes.','Run a relevant test after each change.']},
    {id:'pit',title:'Learning Pit Stop',start:585,end:588,steps:['Choose your confidence phase for knowledge.','Choose your confidence phase for skills and understanding.','Notice which phase you selected most often.']},
    {id:'plenary',title:'Plenary and PDF',start:588,end:590,steps:['Complete the three final checks.','Explain why input is checked before the time decision.','Save the PDF for Teams.']}
  ]
});
window.LessonClock=Object.freeze({
  at(seconds){const p=window.SESSION_PLAN,stage=p.stages.find(s=>seconds>=s.start*60&&seconds<s.end*60);return seconds<p.start*60?{phase:'before',stage:p.stages[0],remaining:p.start*60-seconds}:seconds>=p.end*60?{phase:'after',stage:p.stages.at(-1),remaining:0}:{phase:'active',stage,remaining:stage.end*60-seconds};},
  seconds(date=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:window.SESSION_PLAN.zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return +parts.hour*3600 + +parts.minute*60 + +parts.second;},
  time(minutes){return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;}
});
