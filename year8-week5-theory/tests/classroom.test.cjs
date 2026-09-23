const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function fixture(search=''){
 const elements=new Map(),events={};const el=id=>{if(!elements.has(id))elements.set(id,{value:'',innerHTML:'',textContent:'',files:[],classList:{add(){},remove(){},toggle(){}},addEventListener(){},focus(){},close(){},click(){}});return elements.get(id)};
 const context={URLSearchParams,Event,Date,console,setTimeout:()=>1,clearTimeout(){},confirm:()=>true,location:{search},localStorage:{getItem:()=>null,setItem(){}},document:{querySelector:el,querySelectorAll:()=>[],addEventListener:(t,f,c)=>{if(c)(events[t]??=[]).push(f)},body:{classList:{add(){},remove(){}}}},window:{addEventListener(){},dispatchEvent(){}},PythonRunner:{stop(){}}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'lesson.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),context);
 return {context,el,events,bridge:context.window.LessonClassroom};
}
const f=fixture('?classId=arbitrary-teams-id');let locked=false;f.context.window.ClassroomMode={locked:()=>locked};
assert.equal(f.bridge.info().teacher,false);assert.equal(f.bridge.info().entry,true);
f.bridge.move('code2');assert.equal(f.bridge.info().entry,true);
f.el('#entryName').value='Test Student';f.el('#entryClass').value='8T';f.el('#entryLanguage').value='ko';
f.el('#entryForm').onsubmit({preventDefault(){}});
assert.equal(f.bridge.info().page,'code2');assert.equal(f.bridge.info().lang,'ko');
assert.deepEqual(Object.keys(f.bridge.info()).sort(),['entry','lang','page','teacher']);
assert(!JSON.stringify(f.bridge.info()).includes('Test Student'));
locked=true;f.el('#next').onclick();assert.equal(f.bridge.info().page,'code2');
f.bridge.move('starter1');assert.equal(f.bridge.info().page,'starter1');
f.bridge.move('invalid');assert.equal(f.bridge.info().page,'starter1');
let blocked=false;for(const fn of f.events.click)fn({target:{closest:()=>true},preventDefault(){blocked=true},stopImmediatePropagation(){}});assert(blocked);
locked=false;f.el('#next').onclick();assert.notEqual(f.bridge.info().page,'starter1');
const t=fixture('?teacher=1');assert.equal(t.bridge.info().teacher,true);t.bridge.move('code2');assert.equal(t.bridge.info().page,'mission');
const fake=fixture();fake.el('#entryName').value='teacher';fake.el('#entryLanguage').value='en';fake.el('#entryForm').onsubmit({preventDefault(){}});assert.equal(fake.bridge.info().teacher,false);
const ended=fixture();ended.bridge.move('code2');ended.bridge.clearTarget();ended.el('#entryName').value='Example';ended.el('#entryClass').value='8T';ended.el('#entryLanguage').value='en';ended.el('#entryForm').onsubmit({preventDefault(){}});assert.equal(ended.bridge.info().page,'mission');
console.log('PASS: private bridge, pending entry, end clears target, exact-card movement, student lock/unlock, teacher preview guard.');
