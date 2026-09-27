const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('/tmp/year9-live-test/node_modules/jsdom');
const root=path.join(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,name),'utf8');
function setup(url='https://example.test/index.html'){
 const html=source('index.html').replace(/<script[\s\S]*?<\/script>/g,'');
 const dom=new JSDOM(html,{url,runScripts:'dangerously',pretendToBeVisual:true});
 const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.alert=()=>{};w.CSS.escape=w.CSS.escape||function(v){return String(v).replace(/"/g,'\\"')};
 for(const file of ['lesson.js','app.js','teacher-presentation.js','live-demo.js','session-plan.js','lesson-clock.js']){const script=w.document.createElement('script');script.textContent=source(file);w.document.body.append(script)}
 return dom;
}
{
 const dom=setup(),w=dom.window,d=w.document;
 d.getElementById('name').value='Test Student';d.getElementById('class').value='11T';d.getElementById('login').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 assert.equal(w.LessonClassroom.info().entry,false);w.LessonClassroom.navigate('page-3');assert.equal(w.LessonClassroom.info().page,'page-3');
 w.LessonClassroom.captureOwn();w.LessonClassroom.move('page-5');assert.equal(w.LessonClassroom.info().page,'page-5');w.LessonClassroom.returnOwn();assert.equal(w.LessonClassroom.info().page,'page-3');
 w.LessonClassroom.move('slide-fact-where');assert.equal(w.LessonClassroom.info().page,'slide-fact-where');assert.ok(d.querySelector('[data-key="factWhere"]'));
 w.LiveClassDemo.apply({open:true,program:'update-email',title:'UPDATE safely',code:'UPDATE Student\nSET Email = 1\nWHERE StudentID = 2;',output:'1 row would change',line:2,seq:1});
 assert.match(d.querySelector('#live-demo .current').textContent,/SET Email/);assert.match(d.querySelector('#live-demo').textContent,/1 row would change/);
 assert.match(d.getElementById('lesson-clock').textContent,/2:00–3:00 p.m./);dom.window.close();
}
{
 const dom=setup('https://example.test/index.html?teacher=1'),w=dom.window,d=w.document;
 assert.equal(w.LessonClassroom.info().teacher,true);assert.equal(w.LessonClassroom.info().entry,false);
 w.LessonClassroom.openTeacherPage('slide-fact-keys');assert.equal(w.LessonClassroom.info().page,'slide-fact-keys');
 assert.equal(w.LessonClassroom.startDemo('update-returned'),true);assert.ok(d.getElementById('sql-demo-teacher'));d.getElementById('sql-demo-run').click();assert.match(d.getElementById('sql-demo-output').textContent,/1 row would change/);
 const state=w.LessonClassroom.demoState();assert.equal(state.program,'update-returned');assert.match(state.code,/WHERE LoanID/);dom.window.close();
}
console.log('UI bridge, slides, own-place restore, live SQL and clock: passed');
