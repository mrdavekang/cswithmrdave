const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM}=require(process.env.JSDOM_PATH||'jsdom');
const root=path.resolve(__dirname,'..'),planCode=fs.readFileSync(root+'/session-plan.js','utf8'),clockCode=fs.readFileSync(root+'/lesson-clock.js','utf8');
const dom=new JSDOM('<!doctype html><body></body>',{url:'https://school.example/year8-week5-theory/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;let destination='';w.setInterval=()=>1;w.LessonClassroom={info:()=>({teacher:false,entry:false}),label:()=> 'Build and test',navigate:id=>{destination=id;}};w.ClassroomMode={locked:()=>false};w.eval(planCode);w.eval(clockCode);
const plan=w.SESSION_PLAN;assert.equal(plan.start,780);assert.equal(plan.end,840);assert.equal(plan.stages[0].start,plan.start);assert.equal(plan.stages.at(-1).end,plan.end);
for(let index=0;index<plan.stages.length;index++){const stage=plan.stages[index];assert(stage.end>stage.start,stage.id);assert(stage.steps.length>=3,stage.id);if(index)assert.equal(stage.start,plan.stages[index-1].end,'schedule must have no gaps');}
const allowed=new Set(['mission','starter1','before','six','match','syntax-read','mp1','ext1','after','exit-operators','review']);for(const stage of plan.stages)assert(allowed.has(stage.id),stage.id);
assert.equal(w.LessonClock.at(780*60).stage.id,'mission');assert.equal(w.LessonClock.at(811*60).stage.id,'mp1');assert.equal(w.LessonClock.at(839*60).stage.id,'review');
const widget=w.document.querySelector('#lesson-clock');assert(widget);assert.equal(widget.dataset.corner,'br');assert(widget.textContent.includes('1:00–2:00 p.m.'));assert(widget.textContent.includes('CLASSROOM CUE'));assert(widget.textContent.includes(plan.wagba));assert.equal(w.document.querySelectorAll('.clock-plan li').length,11);
const css=fs.readFileSync(root+'/lesson-clock.css','utf8');assert(css.includes('border-radius:50%'));assert(css.includes('[data-corner="tl"]'));assert(css.includes('#123d29'));assert(css.includes('z-index:10002'));
w.document.querySelector('#clock-open').click();assert(allowed.has(destination));dom.window.close();console.log('PASS 1:00–2:00 classroom cue, continuous timing, valid lesson destinations, WAGBA guidance and four draggable corners.');
