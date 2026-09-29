'use strict';
window.SESSION_PLAN=Object.freeze({
  zone:'Asia/Kuala_Lumpur',start:530,end:590,
  topic:'Improve the helpdesk adviser',
  wagba:'Check an answer, choose useful helpdesk advice, and test that it works.',
  keywords:'input · if / else · nested selection · validation · boundary · test',
  challenge:'Explain why the program must reject unsuitable input before it calculates or gives advice.',
  stages:[
  {
    "id": "read",
    "title": "Read first",
    "start": 530,
    "end": 535,
    "steps": [
      "Read the queue picture: two people plus Sam need 12 minutes.",
      "Compare 20, 11 and negative time."
    ]
  },
  {
    "id": "starter",
    "title": "Do Now",
    "start": 535,
    "end": 538,
    "steps": [
      "Answer three short checks.",
      "Read the feedback."
    ]
  },
  {
    "id": "types",
    "title": "Types of Learning",
    "start": 538,
    "end": 540,
    "steps": [
      "Choose a starting point for K, S and U.",
      "No written explanation needed."
    ]
  },
  {
    "id": "main1",
    "title": "Main Task 1",
    "start": 540,
    "end": 556,
    "steps": [
      "Arrange the code, then predict and run.",
      "Follow the branch. Change 20 to 11.",
      "Include exactly enough time with <=."
    ]
  },
  {
    "id": "pause",
    "title": "Pause and play",
    "start": 556,
    "end": 562,
    "steps": [
      "Rest your eyes and stretch.",
      "Play the short retrieval questions together.",
      "Stop when called; all 15 are not required."
    ]
  },
  {
    "id": "main2",
    "title": "Main Task 2",
    "start": 562,
    "end": 581,
    "steps": [
      "Arrange the negative-answer check.",
      "Predict, run and trace the skipped branch.",
      "Improve the message. Complete the inner condition.",
      "Run four tests; use extra time for further challenges."
    ]
  },
  {
    "id": "pit",
    "title": "Learning Pit Stop",
    "start": 581,
    "end": 584,
    "steps": [
      "Choose one confidence phase for each KSU area."
    ]
  },
  {
    "id": "plenary",
    "title": "Plenary and PDF",
    "start": 584,
    "end": 590,
    "steps": [
      "Answer three final checks.",
      "Save as PDF and submit to Teams."
    ]
  }
]
});
window.LessonClock=Object.freeze({
  at(seconds){const p=window.SESSION_PLAN,stage=p.stages.find(s=>seconds>=s.start*60&&seconds<s.end*60);return seconds<p.start*60?{phase:'before',stage:p.stages[0],remaining:p.start*60-seconds}:seconds>=p.end*60?{phase:'after',stage:p.stages.at(-1),remaining:0}:{phase:'active',stage,remaining:stage.end*60-seconds};},
  seconds(date=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:window.SESSION_PLAN.zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));return +parts.hour*3600 + +parts.minute*60 + +parts.second;},
  time(minutes){return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;}
});
