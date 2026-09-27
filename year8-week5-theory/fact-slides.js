'use strict';
(()=>{
 const facts=[
  {id:'fact-comparison',number:'01',title:'A comparison is a question',statement:'A comparison checks a relationship and produces one Boolean value: True or False. It does not change the stored score.',code:'score = 5\nprint(score >= 5)\nprint(score == 5)',visual:[['score = 5','assignment: store five'],['score >= 5','comparison: True'],['score == 5','comparison: True']],questions:[['meaning','Why does = have a different job from ==?'],['result','What two Boolean values will this program print?']],challenge:'Change score to 4. Predict both Boolean results and explain each one.'},
  {id:'fact-boundary',number:'02',title:'The boundary can change the answer',statement:'The exact limit is where similar-looking operators behave differently. Testing the boundary exposes mistakes that an easy value can miss.',code:'score = 5\nif score >= 5:\n    print("READY")\nelse:\n    print("KEEP GOING")',visual:[['4','False → KEEP GOING'],['5','True → READY'],['6','True → READY']],questions:[['five','Why must a “five or more” rule use >= instead of >?'],['tests','Why should the programmer test 4, 5 and 6 rather than only 6?']],challenge:'Write a different three-value boundary test for a rule that needs at least eight points.'},
  {id:'fact-branch',number:'03',title:'Selection runs one branch',statement:'Python checks the condition once, runs the matching indented branch and skips the other branch. An unindented line after the structure runs afterwards.',code:'score = 3\nif score >= 5:\n    print("READY")\nelse:\n    print("KEEP GOING")\nprint("THANK YOU")',visual:[['Condition','3 >= 5 is False'],['Chosen branch','else'],['Output','KEEP GOING, then THANK YOU']],questions:[['route','Which lines run for score = 3, and which line is skipped?'],['outside','Why does THANK YOU print after either branch?']],challenge:'Change score to 5. Trace the condition, chosen branch and complete output.'}
 ];
 const storageKey='y8-w5-selection-v1.fact-answers';
 function read(){try{const value=JSON.parse(localStorage.getItem(storageKey)||'{}');return value&&typeof value==='object'?value:{};}catch{return{};}}
 function write(values){try{localStorage.setItem(storageKey,JSON.stringify(values));}catch{}}
 function set(id,value){const values=read();values[id]=String(value).slice(0,3000);write(values);}
 function get(id){return String(read()[id]||'');}
 function reportBlocks(){const blocks=[];for(const fact of facts){const answered=[...fact.questions.map(([key,label])=>[key,label]),['challenge',fact.challenge]].filter(([key])=>get(fact.id+'_'+key).trim());if(!answered.length)continue;blocks.push({h:2,text:'Teacher-led fact slide · '+fact.title});for(const [key,label] of answered){blocks.push({h:3,text:label},{text:get(fact.id+'_'+key)});}}return blocks;}
 window.Year8FactSlides=Object.freeze({facts,get,set,reportBlocks});
})();
