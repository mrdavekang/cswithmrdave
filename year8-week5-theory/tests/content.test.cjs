// Development checks only; the student app needs no Node installation.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({window:{},console});
vm.runInContext(fs.readFileSync(path.join(root,'lesson.js'),'utf8'),context);
const L = context.window.LESSON;
assert.equal(L.cards.length,48);
assert.equal(new Set(L.cards.map(c=>c.id)).size,48);
assert.equal(L.cards.filter(c=>c.core&&c.type!=='review').length,19);
assert.equal(L.cards.filter(c=>c.stage==='starter'&&c.type==='quiz').length,5);
assert.equal(L.cards.filter(c=>c.stage==='starter'&&c.type==='parsons').length,5);
assert.equal(L.cards.filter(c=>c.stage==='extension'&&c.type==='ide').length,3);
assert.ok(L.stages.findIndex(s=>s[0]==='extension')<L.stages.findIndex(s=>s[0]==='pit'));
for(const card of L.cards){
  assert.ok(L.stages.some(s=>s[0]===card.stage));
  for(const q of card.questions||[]){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.ok(q.why);}
  if(card.type==='ide'){assert.ok(card.starter);assert.ok(card.tests.length>=2);}
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
// Continue must not jump out of Do Now after its final core-marked card.
const movement=app.slice(app.indexOf('function move(dir)'),app.indexOf('function cardHTML'));
vm.runInContext('var navigationState={current:"sp1",route:"core"}; var visited=""; '+movement.replaceAll('state.','navigationState.').replaceAll('go(next.id)','visited=next.id').replaceAll('L.cards','window.LESSON.cards'),context);
for(const mode of ['core','all']){
 context.navigationState.route=mode;
 const sequence=L.cards.filter(c=>c.stage==='starter').map(c=>c.id).concat('before');
 for(let i=0;i<sequence.length-1;i++){
  context.navigationState.current=sequence[i];vm.runInContext('move(1)',context);assert.equal(context.visited,sequence[i+1]);
  context.navigationState.current=sequence[i+1];vm.runInContext('move(-1)',context);assert.equal(context.visited,sequence[i]);
 }
}
const validation=app.slice(app.indexOf('function validate(s)'),app.indexOf('function rec('));
vm.runInContext('const L=window.LESSON; const time=()=>new Date().toISOString();'+app.match(/const blank=.*?;\n/)[0]+validation,context);
const original={lesson:L.id,version:1,student:{name:'Example',cls:'8T',lang:'ko'},current:'code2',records:{code2:{values:{code:'print("hello")'},attempts:Array.from({length:105},(_,i)=>({at:String(i),kind:'text',data:'answer'})),runs:[],images:[]}}};
context.sample=original;
vm.runInContext('var restored=validate(sample)',context);
assert.equal(context.restored.records.code2.attempts.length,105);
assert.equal(context.restored.student.lang,'ko');
assert.throws(()=>vm.runInContext('validate({lesson:"wrong"})',context));
for(const f of ['index.html','styles.css','app.js','lesson.js','runner.js','python-worker.js','vendor/skulpt.min.js','vendor/skulpt-stdlib.js','vendor/jspdf.umd.min.js','assets/fonts/Raleway.ttf'])assert.ok(fs.existsSync(path.join(root,f)),f);
console.log('PASS: 48 cards, core route, question bank, extensions, backup validation/history and local dependencies.');
