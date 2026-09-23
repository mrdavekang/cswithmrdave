const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const base=require('node:path').resolve(__dirname,'..')+'/';
function fixture(teacher=false){
 const nodes=new Map(),events={};const el=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',hidden:false,dataset:{},addEventListener(t,f){this[t]=f},querySelector(){return {focus(){}}},focus(){}});return nodes.get(id)};
 const c={window:{addEventListener(){},dispatchEvent(){}},document:{getElementById:el,addEventListener(t,f,cap){(events[t]??=[]).push({f,cap})},body:{classList:{toggle(){},remove(){}}}},location:{search:teacher?'?teacher=1':''},URLSearchParams,Event,crypto:{randomUUID:()=> 'id'},structuredClone,console,indexedDB:{open(){throw Error('test storage')}},scrollTo(){},setTimeout(){},confirm:()=>true};vm.createContext(c);
 for(const f of ['lesson.js','fact-pages.js','app.js'])vm.runInContext(fs.readFileSync(base+f,'utf8'),c);return {c,el,events,bridge:c.window.LessonClassroom};
}
(async()=>{
 const s=fixture();let locked=false;s.c.window.ClassroomMode={locked:()=>locked};
 assert.equal(s.bridge.info().entry,true);s.bridge.move('fact1');assert.equal(s.bridge.info().entry,true);
 s.el('name').value='Test';s.el('class').value='11T';await s.el('login').submit({preventDefault(){}});
 assert.equal(s.bridge.info().page,'fact1');assert(!s.el('nav').innerHTML.includes('fact1'));assert(s.el('content').innerHTML.includes('fact1_records'));
 assert(!JSON.stringify(s.bridge.info()).includes('Test'));
 const click=async id=>{const e={target:{closest:()=>({id,dataset:{}})}};for(const {f,cap} of s.events.click)if(!cap)await f(e)};
 locked=true;await click('next');assert.equal(s.bridge.info().page,'fact1');
 s.bridge.move('fact3');assert.equal(s.bridge.info().page,'fact3');assert(s.el('content').innerHTML.includes('fact3_length'));
 await s.bridge.openTeacherPage('fact2');assert.equal(s.bridge.info().page,'fact3');
 locked=false;await click('next');assert.equal(s.bridge.info().page,'intro');
 s.bridge.move('not-real');assert.equal(s.bridge.info().page,'intro');
 await click('next');assert.equal(s.bridge.info().page,'start');
 const t=fixture(true);await t.bridge.openTeacherPage('fact2');assert.equal(t.bridge.info().page,'fact2');assert(t.el('content').innerHTML.includes('00124'));
 for(const f of t.c.window.LESSON_FACTS){await t.bridge.openTeacherPage(f.id);assert(t.el('content').innerHTML.includes(f.title) && t.el('content').innerHTML.includes('data-answer'));}
 const pdfText=[];s.c.PDF_FONTS={regular:'',bold:''};s.c.window.jspdf={jsPDF:function(){return {addFileToVFS(){},addFont(){},addPage(){},setFont(){},setFontSize(){},splitTextToSize:t=>[t],text:t=>pdfText.push(t),getNumberOfPages:()=>1,setPage(){},setDrawColor(){},line(){},save(){}}}};
 for(const {f} of s.events.input)f({target:{dataset:{answer:'fact1_records'},value:'Two records'}});
 await click('exportTop');assert(pdfText.includes('Two records'));assert(pdfText.includes('Fact 1: Table structure'));assert(!pdfText.includes('Fact 2: Suitable data types'));
 console.log('PASS: PDF includes completed fact answers only; hidden navigation, student cannot open facts, pending entry, remote facts, lock and return, teacher facts, local answers.');
})();
