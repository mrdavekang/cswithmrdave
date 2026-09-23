const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path'),{Worker}=require('worker_threads');
const root=path.resolve(__dirname,'..');
const nodes=new Map(),events={};const node=()=>({innerHTML:'',textContent:'',querySelector(){return null},querySelectorAll(){return []},focus(){},classList:{toggle(){}},scrollIntoView(){}});
const context=vm.createContext({console,Event:class {},URLSearchParams,location:{search:''},document:{body:{classList:{toggle(){}}},documentElement:{},getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},querySelectorAll(){return []},querySelector(){return null},addEventListener(k,fn){events[k]=fn}},window:{addEventListener(){},dispatchEvent(){},scrollTo(){}},localStorage:{getItem(){return null},setItem(){}},setTimeout,clearTimeout,Date,Blob,URL,confirm(){return false}});
const source=fs.readFileSync(root+'/content.js','utf8').replace('const B=(en,ms,zh)=>({en,ms,zh});','const B=(en,ms,zh)=>{if([en,ms,zh].some(x=>typeof x!=="string"||!x.trim()))throw Error("Missing translation");return {en,ms,zh};};');
vm.runInContext(source+'\n'+fs.readFileSync(root+'/week5-content.js','utf8')+'\n'+fs.readFileSync(root+'/fact-slides.js','utf8')+'\n'+fs.readFileSync(root+'/app.js','utf8')+'\n'+fs.readFileSync(root+'/lesson.js','utf8')+'\n'+fs.readFileSync(root+'/fact-integration.js','utf8'),context);
const run=s=>vm.runInContext(s,context);
let views=0;
for(const guided of [false,true])for(const lang of ['en','ms','zh'])for(const compare of [false,true])for(const page of run('PAGES.map(p=>p[0])')){
 const html=run(`state=fresh();state.guided=${guided};state.lang='${lang}';state.compare=${compare};state.page='${page}';entry=false;render();document.getElementById('app').innerHTML`);assert(html.length>2000);assert(!html.includes('undefined'));assert(!html.includes('[object Object]'));const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`duplicate ${page}`);views++;
}
for(const n of ['Ng Jun Kai','NG JUN KAI','ng jun kai','Student: Ng Jun Kai (9A)','Ｎｇ Ｊｕｎ Ｋａｉ','Ng-Jun-Kai'])assert(run(`matchesSupport(${JSON.stringify(n)})`));
for(const n of ['Ng Jun Kaiden','Someone Else','Junkai Ng',''])assert(!run(`matchesSupport(${JSON.stringify(n)})`));
assert(!run("state=fresh();reflection(false)").includes('<textarea'));
run("state.answers.start_s1='support';state.answers.start_s2='need'");assert(run("focusSummary('start')").includes('Skills'));
run("state.answers.phase_k1='new';state.answers.phase_k2='new';state.answers.phase_s1='consolidating';state.answers.phase_s2='consolidating'");assert(run('phaseSummary()').includes('tied highest'));
run("state.answers.phase_u1='new'");assert(run('phaseSummary()').includes('majority phase'));
run("state.code.core='<script>alert(1)</script>';state.answers.s1='0';state.orders.do1=[0,1,2,3,4];state.orderChecked.do1=true;state=validate(state)");assert(run("ordered('do1')"));assert(!run('report()').includes('<script>'));assert(run('report()').includes('&lt;script&gt;'));
run("state.orders.do1=[0,0];state.answers.start_k1='invalid';state=validate(state)");assert(!run("ordered('do1')"));assert.equal(run("state.answers.start_k1"),undefined);
// Classroom moves wait for local identity entry; names remain in the PDF report.
run("state=fresh();entry=true;draft={name:'Sample Student',className:'9 Test'};window.LessonClassroom.move('program')");
assert(run('entry')); assert.equal(run('state.name'),'');
run('begin()');assert.equal(run('state.page'),'program');assert.equal(run('state.name'),'Sample Student');
assert(run('report()').includes('Sample Student'));assert(run('report()').includes('9 Test'));
assert.equal(run('JSON.stringify(window.LessonClassroom.info())').includes('Sample Student'),false);
run("window.ClassroomMode={locked:()=>true};go('read')");assert.equal(run('state.page'),'program');
run("window.LessonClassroom.move('debug')");assert.equal(run('state.page'),'debug');
run("entry=true;window.LessonClassroom.move('submit');window.LessonClassroom.clearTarget();begin()");assert.equal(run('state.page'),'read');
run("window.ClassroomMode={locked:()=>false}");
run("entry=false;window.LessonClassroom.move('fact-nested')");assert.equal(run('window.LessonClassroom.info().page'),'fact-nested');assert(!run('sidebar()').includes('fact-nested'));
run("state.answers['fact-nested_output']='Come back later';state=validate(state)");assert.equal(run("val('fact-nested_output')"),'Come back later');assert(run('report()').includes('Come back later'));
run("window.ClassroomMode={locked:()=>true};go('read')");assert.equal(run('window.LessonClassroom.info().page'),'fact-nested');
run("window.ClassroomMode={locked:()=>false};go('read')");assert.equal(run('window.LessonClassroom.info().page'),'read');
for(const lang of ['en','ms','zh'])for(const id of ['fact-nested','fact-validation','fact-boundary']){run(`state.lang='${lang}';window.LessonClassroom.move('${id}')`);assert(nodes.get('main').innerHTML.includes('data-answer'));assert(!nodes.get('main').innerHTML.includes('undefined'));}
run("go('read')");
const programs=JSON.parse(run('JSON.stringify(PROGRAMS)'));
const workerSource=`const{parentPort}=require('worker_threads');const fs=require('fs'),vm=require('vm');global.self=global;global.postMessage=x=>parentPort.postMessage(x);global.importScripts=(...files)=>files.forEach(f=>vm.runInThisContext(fs.readFileSync(${JSON.stringify(root)}+'/'+f,'utf8'),{filename:f}));vm.runInThisContext(fs.readFileSync(${JSON.stringify(root+'/python-worker.js')},'utf8'));parentPort.on('message',data=>self.onmessage({data}));`;
function python(code,inputs=[],delay=0){return new Promise((resolve,reject)=>{const w=new Worker(workerSource,{eval:true});let output='',n=0;const timer=setTimeout(()=>{w.terminate();reject(Error('Timeout'))},15000);w.on('error',reject);w.on('message',m=>{if(m.type==='output')output+=m.text;else if(m.type==='input'){if(n>=inputs.length){clearTimeout(timer);w.terminate();reject(Error('Unexpected input'));return;}const value=inputs[n++];setTimeout(()=>w.postMessage({type:'input',id:m.id,value}),delay);}else{clearTimeout(timer);w.terminate();resolve({...m,output,n});}});w.postMessage({type:'run',code});});}
(async()=>{let cases=0;for(const p of Object.values(programs))for(const [inputs,expected]of p.tests){const r=await python(p.solution,inputs);assert.equal(r.type,'done',JSON.stringify(r));assert.equal(r.output.trim(),expected.trim(),p.id);assert.equal(r.n,inputs.length);cases++;}
const multiline=await python('name = input("Name: ")\nprint("Hello", name)\nage = int(input("Age: "))\nprint(age + 1)',['Sam','12'],2300);assert.equal(multiline.output,'Hello Sam\n13\n');
const blank=await python('print("[" + input("Value: ") + "]")',['']);assert.equal(blank.output,'[]\n');
console.log(`PASS ${views} page/route/language/view combinations, ${cases} program test cases, delayed sequential input, blank input, zero, invalid input, name routing, backup validation, reflection summaries and report escaping.`);
})().catch(e=>{console.error(e);process.exitCode=1});