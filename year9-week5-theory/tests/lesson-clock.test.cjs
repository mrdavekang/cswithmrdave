const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM}=require(process.env.JSDOM_PATH||'jsdom');
const root=path.resolve(__dirname,'..'),planCode=fs.readFileSync(root+'/session-plan.js','utf8'),clockCode=fs.readFileSync(root+'/lesson-clock.js','utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'https://school.example/year9-week5-theory/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;let destination='';w.setInterval=()=>1;w.LessonClassroom={info:()=>({teacher:false,entry:false}),label:()=> 'Program it',navigate:id=>{destination=id;}};w.ClassroomMode={locked:()=>false};w.eval(planCode);w.eval(clockCode);
const plan=w.SESSION_PLAN;assert.equal(plan.start,620);assert.equal(plan.end,680);assert.equal(plan.stages[0].start,plan.start);assert.equal(plan.stages.at(-1).end,plan.end);
for(let index=0;index<plan.stages.length;index++){const stage=plan.stages[index];assert(stage.end>stage.start,stage.id);assert(stage.steps.length>=3,stage.id);if(index)assert.equal(stage.start,plan.stages[index-1].end,'schedule must have no gaps');}
const allowed=new Set(['read','starter','types','nested-read','parsons','debug','program','validation-read','validation','pit','plenary','extension','submit']);for(const stage of plan.stages)assert(allowed.has(stage.id),stage.id);
assert.equal(w.LessonClock.at(620*60).stage.id,'read');assert.equal(w.LessonClock.at(649*60).stage.id,'program');assert.equal(w.LessonClock.at(679*60).stage.id,'submit');
const widget=w.document.querySelector('#lesson-clock');assert(widget);assert.equal(widget.dataset.corner,'br');assert(widget.textContent.includes('10:20–11:20 a.m.'));assert(widget.textContent.includes('The clock suggests where to work. It never moves your page automatically.'));assert.equal(w.document.querySelectorAll('.clock-plan li').length,13);
const css=fs.readFileSync(root+'/lesson-clock.css','utf8');assert(css.includes('border-radius:50%'));assert(css.includes('[data-corner="tl"]'));assert(css.includes('z-index:10002'));
w.document.querySelector('#clock-open').click();assert(allowed.has(destination));dom.window.close();console.log('PASS 10:20–11:20 lesson plan, continuous stage timing, valid destinations, collapsible clock and four draggable corner positions.');
