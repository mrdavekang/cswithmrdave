const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {webcrypto}=require('node:crypto');
const deps=process.env.CQ_TEST_MODULES;
const {JSDOM,VirtualConsole}=require(deps?path.join(deps,'jsdom'):'jsdom');
const JSZip=require(deps?path.join(deps,'jszip'):'jszip');
const root=path.join(__dirname,'..');
const L=require('../lesson.js');
const source=name=>fs.readFileSync(path.join(root,name),'utf8');
const windows=[];
function mount(seed,extra={}){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('navigation'))errors.push(e);});
 const dom=new JSDOM(source('index.html'),{url:'https://lesson.example/',runScripts:'outside-only',virtualConsole:vc});
 const w=dom.window;windows.push(w);w.TextEncoder=TextEncoder;Object.defineProperty(w,'crypto',{value:webcrypto});
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};w.print=()=>{w.printed=true;};
 if(seed)w.localStorage.setItem('coordinateQuestProfilesV3',JSON.stringify({[seed.id]:seed}));
 for(const [k,v] of Object.entries(extra))w.localStorage.setItem(k,JSON.stringify(v));
 w.eval(source('lesson.js'));w.eval(source('app.js'));
 const q=s=>w.document.querySelector(s);
 const input=(s,value)=>{const el=q(s);assert.ok(el,'Missing field '+s);if(el.type==='checkbox'||el.type==='radio')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));el.dispatchEvent(new w.Event('change',{bubbles:true}));};
 const click=s=>{const el=q(s);assert.ok(el,'Missing button '+s);assert.equal(el.disabled,false,'Disabled '+s);el.click();};
 const action=a=>click('[data-action="'+a+'"]');
 const field=(key,v)=>input('[data-field="'+key+'"]',v);
 const enter=(name='Amina',cls='6 Cedar',partner='')=>{input('#name',name);input('#class',cls);if(partner){input('#mode','pair');input('#partner',partner);}q('#entry').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));};
 const record=()=>JSON.parse(w.localStorage.getItem('coordinateQuestProfilesV3'))[L.key(seed?.name||'Amina',seed?.className||'6 Cedar',seed?.partner||'')];
 return {w,q,input,click,action,field,enter,record,errors};
}
function seeded(at,partner='') {const p=L.fresh('Amina','6 Cedar',partner);p.at=p.furthest=at;if(at>14)p.practical.status='teacher-checked';return p;}
async function submitTeacher(t,pass='test-only-pass'){
 t.input('#teacherName','Test Teacher');t.input('#passcode',pass);if(t.q('#passcodeAgain'))t.input('#passcodeAgain',pass);
 for(const el of t.w.document.querySelectorAll('#teacherForm input[type=checkbox]'))el.checked=true;
 t.q('#teacherForm button[type=submit]').click();await new Promise(resolve=>setTimeout(resolve,30));
}
test('positions are accurate and turns do not alter x/y',()=>{
 for(let i=0;i<3;i++){const result=L.position(i,L.predictions[i].ops.length);assert.deepEqual([result.x,result.y],L.predictions[i].answer);}
 assert.deepEqual(L.position(2,2),{x:80,y:40,dir:180});
});
test('names in different writing systems keep separate profile identities',()=>{assert.notEqual(L.key('李明','六班',''),L.key('王明','六班',''));assert.equal(L.key(' AMINA ','6 Cedar',''),L.key('amina','6 cedar',''));});
test('full student path requires Scratch handover, testing and teacher check',async()=>{
 const t=mount();t.enter();assert.equal(t.q('#stepTitle').textContent,'The mission');assert.equal(t.q('[data-action=next]').disabled,true);assert.equal(t.q('[data-page]'),null);
 t.action('read');t.action('next');t.input('input[value=left]',true);t.action('check-x');t.action('next');t.field('pair.x','−120');t.field('pair.y','-135');t.action('check-pair');t.action('next');t.input('input[value=flag]',true);t.action('check-event');t.action('next');t.field('learner.goal','build');t.action('next');t.action('worked');t.action('next');
 for(let n=0;n<3;n++){t.field('prediction.x','0');t.field('prediction.y','0');t.action('predict');for(const op of L.predictions[n].ops)t.action('trace');t.input('input[value=correct]',true);t.action('compare');t.action('next');}
 assert.equal(t.q('#stepTitle').textContent,'Now open Scratch');assert.equal(t.q('[data-action=next]').disabled,true);assert.ok(t.q('a[download]'));assert.ok(t.q('a[target=_blank]'));
 t.action('confirm-open');t.action('next');t.input('input[value=A]',true);t.action('check-example');t.action('next');t.input('input[value=x]',true);t.field('answers.bRan',true);t.action('check-b');t.action('next');t.field('answers.routeRan',true);t.action('check-route');t.action('next');
 t.field('answers.testResult','worked');t.field('answers.testNote','I checked each checkpoint.');t.action('log-test');t.field('answers.fileSaved',true);t.field('answers.filename','Amina_CoordinateQuest_v1.sb3');t.action('ready-check');t.action('next');
 assert.equal(t.q('[data-action=next]').disabled,true);assert.equal(t.record().practical.status,'awaiting-check');
 t.action('approve');await submitTeacher(t);assert.equal(t.record().practical.status,'teacher-checked');assert.equal(t.q('[data-action=next]').disabled,false);t.action('next');t.field('learner.phase','practice');t.action('next');
 assert.equal(t.record().extensions.filter(r=>r.done).length,0);t.action('next');t.field('exit.x','40');t.field('exit.y','40');t.input('input[value=no-y]',true);t.action('check-exit');t.action('next');assert.equal(t.q('#stepTitle').textContent,'Your learning record');assert.equal(t.q('input[type=file]'),null);assert.equal(t.errors.length,0);
});
test('reload from waiting challenge returns to unfinished teacher checkpoint',()=>{const s=seeded(14);s.at=16;s.practical.status='awaiting-check';const t=mount(s);t.enter();assert.equal(t.record().at,14);assert.equal(t.q('[data-action=next]').disabled,true);t.action('waiting-extension');t.action('next');assert.equal(t.q('#stepTitle').textContent,'Show your working program');});
test('teacher can release unfinished practical work without marking it checked',async()=>{const t=mount();t.enter();t.action('wrap');await submitTeacher(t);assert.equal(t.record().at,15);assert.ok(t.record().practical.wrap);assert.notEqual(t.record().practical.status,'teacher-checked');assert.match(L.status(t.record()),/unfinished/);});
test('incorrect teacher passcode cannot approve work',async()=>{const digest=Buffer.from(await webcrypto.subtle.digest('SHA-256',new TextEncoder().encode('real-test-pass'))).toString('hex');const s=seeded(14);s.done.test=true;const t=mount(s,{coordinateQuestTeacherV3:{hash:digest}});t.enter();t.action('approve');await submitTeacher(t,'wrong-test-pass');assert.match(t.q('#teacherError').textContent,/did not match/);assert.notEqual(t.record().practical.status,'teacher-checked');});
test('partner learning choices remain separate and both get a turn',()=>{const s=seeded(4,'Ben');const t=mount(s);t.enter('Amina','6 Cedar','Ben');t.field('learner.goal','build');assert.equal(t.q('[data-action=next]').disabled,true);t.click('[data-person="1"]');t.field('learner.goal','coordinates');assert.equal(t.q('[data-action=next]').disabled,false);assert.equal(t.record().learners[0].goal,'build');assert.equal(t.record().learners[1].goal,'coordinates');});
test('prediction draft survives previous / next and saved prediction remains fixed',()=>{const s=seeded(6);s.done.worked=true;const t=mount(s);t.enter();t.field('prediction.x','-40');t.field('prediction.y','-100');t.action('back');t.action('next');assert.equal(t.q('[data-field="prediction.x"]').value,'-40');t.action('predict');assert.equal(t.q('[data-field="prediction.x"]'),null);});
test('help in plenary is recorded honestly and does not block export',()=>{const t=mount(seeded(17));t.enter();t.action('unsure-exit');assert.equal(t.q('[data-action=next]').disabled,false);assert.equal(t.record().learners[0].exitChecked,false);assert.match(t.record().learners[0].exitFeedback,/not yet demonstrated/);});
test('five extension attempts advance and allow direct revisiting',()=>{const t=mount(seeded(16));t.enter();for(let i=0;i<5;i++){t.field('extension.note','I tested this version.');t.field('answers.extensionTested',true);t.action('save-extension');assert.equal(t.record().level,Math.min(i+1,4));}t.click('[data-level="0"]');assert.equal(t.record().level,0);assert.equal(t.record().extensions.filter(x=>x.done).length,5);});
test('legacy answers and images are not rewritten or treated as new practical proof',()=>{const old={a:{id:'a',name:'Amina',className:'6 Cedar',answers:{x:'old'},screenshots:{main2:[{data:'original'}]},completed:{main2:true}}};const t=mount(null,{coordinateQuestProfilesV2:old});t.enter();assert.deepEqual(JSON.parse(t.w.localStorage.getItem('coordinateQuestProfilesV2')),old);assert.equal(t.record().legacyId,'a');assert.equal(t.record().at,0);assert.equal(t.record().practical.status,'not-started');});
test('Mandarin names print using browser fonts rather than a broken PDF font',()=>{const s=seeded(18);s.name='李明';s.id=L.key(s.name,s.className,'');const t=mount(s);t.enter('李明');t.action('pdf');assert.equal(t.w.printed,true);assert.match(t.q('#printReport').textContent,/李明/);});
test('English report generates a valid PDF with explicit teacher status',()=>{
 const s=seeded(18);s.practical.teacher={name:'Test Teacher',at:'2026-09-20T10:00:00Z'};
 const t=mount(s);t.enter();t.w.eval(source('vendor/jspdf.umd.min.js'));
 let bytes;t.w.jspdf.jsPDF.API.save=function(){bytes=this.output('arraybuffer');};
 t.action('pdf');assert.ok(bytes,'PDF was not generated');const raw=Buffer.from(bytes).toString('latin1');assert.ok(raw.startsWith('%PDF'));assert.match(raw,/Teacher checked the working route/);assert.match(raw,/Test Teacher/);assert.ok(bytes.byteLength>5000);
});
test('all linked local assets exist and the old misleading prediction images are unused',()=>{
 for(const f of ['styles.css','app.js','lesson.js','vendor/jspdf.umd.min.js','assets/images/route-map.svg','assets/images/learning-pitstop.png','assets/scratch/Year6_T1W3_Guided_Template.sb3'])assert.ok(fs.existsSync(path.join(root,f)));
 assert.doesNotMatch(source('app.js'),/prediction-level-[123]\.png/);
});
test('all 19 cards render in both languages without script errors or upload fields',()=>{for(const language of ['en','zh'])for(let i=0;i<L.steps.length;i++){const s=seeded(i);const t=mount(s,{coordinateQuestLanguageV3:language});t.enter();assert.equal(t.q('#stepTitle').textContent.includes(L.steps[i].title),true);assert.equal(t.q('input[type=file]'),null);assert.deepEqual(t.errors,[]);t.w.close();}});
test('blocked storage reports a persistent warning, not a false saved message',()=>{const t=mount();t.w.Storage.prototype.setItem=function(){throw Error('quota');};t.enter();assert.match(t.q('#saveStatus').textContent,/could not save/);t.action('read');assert.match(t.q('#saveStatus').textContent,/could not save/);});
test('new Scratch file keeps the starter, removes screenshot demands and fits the safe portal path',async()=>{
 const zip=await JSZip.loadAsync(fs.readFileSync(path.join(root,'assets/scratch/Year6_T1W3_Guided_Template.sb3')));const project=JSON.parse(await zip.file('project.json').async('string'));const e=project.targets.find(t=>t.name==='Explorer');assert.equal(e.blocks.example_move_a.opcode,'motion_glidesecstoxy');assert.equal(e.size,55);assert.doesNotMatch(e.comments.evidence.text,/Screenshot shows/);
 const svg=await zip.file(project.targets[0].costumes[0].md5ext).async('string');const walls=[...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"\/>/g)].map(m=>m.slice(1).map(Number));assert.equal(walls.length,12);
 const route=[[170,95],[205,95],[205,-20],[70,-20],[70,-140],[195,-140]];const radius=35*.55;
 for(let i=1;i<route.length;i++)for(let t=0;t<=100;t++){const x=240+route[i-1][0]+(route[i][0]-route[i-1][0])*t/100;const y=180-route[i-1][1]-(route[i][1]-route[i-1][1])*t/100;for(const [rx,ry,rw,rh] of walls)assert.ok(!(x+radius>rx&&x-radius<rx+rw&&y+radius>ry&&y-radius<ry+rh),'Sprite overlaps wall on segment '+i);}
});
test('all eight code examples use local Scratch screenshots with matching text',async()=>{
 const zip=await JSZip.loadAsync(fs.readFileSync(path.join(root,'assets/scratch/Year6_T1W3_Example_Blocks.sb3')));
 const project=JSON.parse(await zip.file('project.json').async('string'));
 function script(target){
  const blocks=target.blocks,lines=[];let b=Object.values(blocks).find(b=>b.topLevel);
  while(b){const value=k=>b.inputs[k][1][1];
   const labels={event_whenflagclicked:()=> 'when green flag clicked',event_whenkeypressed:()=> 'when '+b.fields.KEY_OPTION[0]+' key pressed',event_whenthisspriteclicked:()=> 'when this sprite clicked',motion_gotoxy:()=> 'go to x: '+value('X')+' y: '+value('Y'),motion_changexby:()=> 'change x by '+value('DX'),motion_changeyby:()=> 'change y by '+value('DY'),motion_turnright:()=> 'turn clockwise '+value('DEGREES')+' degrees',motion_glidesecstoxy:()=> 'glide '+value('SECS')+' secs to x: '+value('X')+' y: '+value('Y'),looks_sayforsecs:()=> 'say "'+value('MESSAGE')+'" for '+value('SECS')+' seconds'};
   lines.push(labels[b.opcode]());b=blocks[b.next];
  }return lines;
 }
 for(const id of ['event','worked','predict1','predict2','predict3','run-example','build-b','plenary']){
  const t=mount(seeded(L.steps.findIndex(s=>s.id===id)));t.enter();
  const image=t.q('.scratch-block-image');assert.ok(image,id);
  assert.equal(image.getAttribute('src'),'assets/images/scratch-blocks/'+id+'.png');
  const png=fs.readFileSync(path.join(root,image.getAttribute('src')));
  assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),Number(image.getAttribute('width')));assert.equal(png.readUInt32BE(20),Number(image.getAttribute('height')));
  const transcript=[...t.w.document.querySelectorAll('.code-transcript li')].map(li=>li.textContent.replaceAll('−','-'));
  assert.deepEqual(transcript,script(project.targets.find(s=>s.name===id)),id+' screenshot source differs from lesson');
  assert.equal(image.alt.replaceAll('−','-'),'Scratch blocks, top to bottom: '+transcript.join('; '));assert.equal(t.q('.code-list'),null);
  const before=t.record().at;t.click('[data-code-image]');assert.equal(t.q('#codeImageDialog').open,true);assert.equal(t.q('#codeImageLarge').alt,image.alt);t.click('#closeCodeImage');assert.equal(t.q('#codeImageDialog').open,false);assert.equal(t.record().at,before);t.w.close();
 }
 const guided=await JSZip.loadAsync(fs.readFileSync(path.join(root,'assets/scratch/Year6_T1W3_Guided_Template.sb3')));
 const guidedProject=JSON.parse(await guided.file('project.json').async('string'));
 assert.deepEqual(script(project.targets.find(s=>s.name==='run-example')),script(guidedProject.targets.find(s=>s.name==='Explorer')));
});
test('step-through still identifies the matching screenshot block',()=>{
 const t=mount(seeded(8));t.enter();t.field('prediction.x','80');t.field('prediction.y','-50');t.action('predict');assert.match(t.q('.trace-block').textContent,/Current block 2 of 5/);
 t.action('trace');t.action('trace');assert.match(t.q('.trace-block').textContent,/Current block 4 of 5/);assert.match(t.q('.trace-block strong').textContent,/turn clockwise 90 degrees/);assert.equal(t.q('.scratch-block-image').getAttribute('src'),'assets/images/scratch-blocks/predict3.png');
});
test.after(()=>{for(const w of windows)w.close();});
