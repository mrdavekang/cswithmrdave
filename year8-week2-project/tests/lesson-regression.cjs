// Non-browser regression tests. No claim of real iPad, Bluetooth, print-layout or viewport QA.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const root = path.join(__dirname,'..');
const contentContext=vm.createContext({console});
vm.runInContext(fs.readFileSync(path.join(root,'lesson.js'),'utf8'),contentContext);
vm.runInContext(fs.readFileSync(path.join(root,'views.js'),'utf8'),contentContext);
const L=contentContext.Lesson, V=contentContext.Views;
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function balanced(html){
  const stack=[],ids=new Set(),voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  for(const m of html.matchAll(/<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g)){
    const token=m[0];if(token.startsWith('<!--'))continue;
    const tag=token.match(/^<\/?([A-Za-z0-9-]+)/)[1].toLowerCase();
    if(token.startsWith('</')){assert.equal(stack.pop(),tag,'Unbalanced '+token);continue;}
    const id=token.match(/\sid="([^"]+)"/);if(id){assert(!ids.has(id[1]),'Duplicate id '+id[1]);ids.add(id[1]);}
    if(!voids.has(tag)&&!token.endsWith('/>'))stack.push(tag);
  }
  assert.equal(stack.length,0,'Unclosed '+stack.join(','));
}
const pupil=L.blank('김민준 王同学','8A','ko');
Object.assign(pupil.responses,{device:'ipad',editor:'makepython',icon:'HAPPY',message:'MK'});
test('All core stages and three optional levels are present',()=>{
  assert.equal(L.CORE.length,12);assert.equal(L.CARDS.filter(c=>c.optional).length,3);
  for(const c of L.CARDS)assert(c.id in L.REQUIRED);
});
test('Each language supports every card, including the editor distinction',()=>{
  for(const lang of ['zh','ko','bm'])for(const c of L.CARDS)assert(L.SUPPORT[lang][c.id]?.length>25);
  for(const lang of ['zh','ko','bm'])assert(L.SUPPORT[lang].setup.includes('MicroPython'));
});
test('All card variants have balanced markup, unique IDs and no whole-lesson rendering',()=>{
  for(const language of ['en','zh','ko','bm'])for(const device of ['ipad','laptop'])for(const editor of ['blocks','makepython','micropython']){
    const s=JSON.parse(JSON.stringify(pupil));s.language=language;Object.assign(s.responses,{device,editor,startTest:'retry',pressTest:'retry'});
    for(const c of L.CARDS){const html=V.card(s,{},c.id);balanced(html);assert.equal((html.match(/<h1>/g)||[]).length,c.id==='review'?2:1);}
  }
});
test('Visible core student fields all have report labels and live bindings',()=>{
  const full=L.CARDS.map(c=>V.card(pupil,{},c.id)).join('');
  for(const m of full.matchAll(/data-field="([^"]+)"/g))assert(m[1] in L.FIELDS,m[1]);
  for(const m of full.matchAll(/<textarea[^>]*>/g))assert(/data-field|data-caption|readonly/.test(m[0]),m[0]);
});
test('iPad and laptop transfer routes differ without a cable-only iPad gate',()=>{
  assert(!V.transferGuide(pupil).includes('copy the <strong>.hex file to the MICROBIT drive'));
  assert(V.transferGuide(pupil).includes('Bluetooth'));
  const s=JSON.parse(JSON.stringify(pupil));s.responses.device='laptop';assert(V.transferGuide(s).includes('MICROBIT drive'));
  assert(!L.missing(pupil,'setup').some(x=>x.includes('cable')));
  s.responses.device='ipad';s.responses.editor='micropython';assert(L.missing(s,'setup').length>0);
});
test('Code routes are separate and use the student’s choices safely',()=>{
  assert(!L.sample('makepython').includes('from microbit'));
  assert(L.sample('micropython').includes('from microbit import *'));
  assert(L.sample('makepython','HAPPY','MK').includes('IconNames.HAPPY'));
  assert(L.sample('makepython','evil()','"\n<script>').includes('IconNames.HEART'));
  const html=V.card({...pupil,responses:{...pupil.responses,message:'</textarea><script>alert(1)</script>'}}, {}, 'button');
  assert(!html.includes('<script>'));
});
test('Short, non-English explanations are valid; no keyword password or minimum essay length',()=>{
  const s=JSON.parse(JSON.stringify(pupil));s.responses.explain='A를 누르면 이름이 나옵니다.';s.responses.eventCheck='startup';
  assert.equal(L.missing(s,'plenary').length,0);
  assert.equal(L.grade('explain',s.responses.explain),null);
});
test('Hardware difficulties and evidence alternatives remain honest',()=>{
  const s=JSON.parse(JSON.stringify(pupil));Object.assign(s.responses,{physical:'waiting',physicalNote:'Pairing failed',evidenceAlternative:'I can show my code to my teacher.'});
  assert.equal(L.missing(s,'transfer').length,0);assert(L.reviewReasons(s,'transfer').length>0);
  assert.equal(L.missing(s,'evidence').length,0);assert(L.reviewReasons(s,'evidence').length>0);
});
test('Partial reports show incomplete stages, not blank success records',()=>{
  const html=V.report(pupil);balanced(html);assert(html.includes('Not completed'));assert(html.includes('Not answered'));
  assert(html.includes('김민준 王同学'));assert(html.includes('8A'));assert(html.includes('MakeCode Python'));
  assert(!html.includes('Level 1'));assert(html.includes('WAGBA'));assert(html.includes('Knowledge'));
});
test('Reports include all entered fields, prior attempts, corrections and evidence captions',()=>{
  const s=JSON.parse(JSON.stringify(pupil));
  for(const k of Object.keys(L.FIELDS))s.responses[k]=L.VALUES[k]?Object.keys(L.VALUES[k])[0]:'Evidence for '+k;
  s.history=[{at:'2026-09-08',card:'starter',type:'Response changed',data:{before:'wrong',after:'right'}}];
  const im={code:{data:'data:image/jpeg;base64,AA==',caption:'My code',at:'today'},device:{data:'data:image/jpeg;base64,AA==',caption:'My output',at:'today'}};
  const html=V.report(s,im);balanced(html);
  for(const [,label]of Object.values(L.FIELDS))assert(html.includes(V.e(label)),label);
  assert(html.includes('before: wrong'));assert(html.includes('My code'));assert(html.includes('My output'));
});
test('Backup round trip restores Unicode, answers and images',()=>{
  const images={code:{data:'data:image/png;base64,AA==',caption:'代码 한국어',at:'today'}};
  const b=L.validateBackup(JSON.parse(JSON.stringify({lessonId:L.ID,version:3,state:pupil,images})));
  assert.equal(b.state.student.name,pupil.student.name);assert.equal(b.state.responses.editor,'makepython');assert.equal(b.images.code.caption,'代码 한국어');
  assert(b.state.sessionId!==pupil.sessionId,'Imports use a fresh evidence session to protect previous files.');
});
test('Invalid lessons, versions, image types and injected response keys are rejected/stripped',()=>{
  assert.throws(()=>L.validateBackup({lessonId:'other',version:3,state:pupil}));
  assert.throws(()=>L.validateBackup({lessonId:L.ID,version:2,state:pupil}));
  assert.throws(()=>L.validateBackup({lessonId:L.ID,version:3,state:pupil,images:{code:{data:'data:image/svg+xml;base64,AA=='}}}));
  const x=JSON.parse(JSON.stringify(pupil));x.responses.unknown='not allowed';const b=L.validateBackup({lessonId:L.ID,version:3,state:x});assert(!('unknown' in b.state.responses));
});
test('Filenames include real lesson context and safe student identifiers',()=>{
  const s=L.blank('Name / Bad:*?','8A');assert.equal(L.filename(s),'Year8_8A_Name_Bad_T1W2_Project.pdf');
  assert(L.filename(pupil).includes('김민준_王同学'));
});
test('Image references exist; misleading USB illustration is not displayed',()=>{
  const source=fs.readFileSync(path.join(root,'views.js'),'utf8');
  for(const file of ['1-smart-badge-scenario.png','6-build-test-simulator.png','types-of-learning.png','learning-pitstop.png'])assert(fs.existsSync(path.join(root,'assets/images',file)));
  assert(!source.includes('7-download-connect-wait-test.png'));
  assert(!source.includes('5-blocks-python-same-outcome.png'));
});
test('Static entry has no build/CDN requirement and uses local font',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');balanced(html);
  for(const m of html.matchAll(/(?:src|href)="([^"#][^"]+)"/g)){if(!m[1].startsWith('http'))assert(fs.existsSync(path.join(root,m[1].split('?')[0])),m[1]);}
  const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');assert(css.includes('@font-face'));assert(!css.includes('fonts.googleapis'));assert(css.includes('@media print'));assert(css.includes('prefers-reduced-motion'));
});

// Run the real application controller against lightweight DOM/storage doubles.
// This tests application state transitions, not a browser rendering engine.
const els=new Map(), listeners={}, storage=new Map(), imageStore=new Map();let storageFails=false, confirmValue=true, printed=0;
function element(){return {hidden:false,disabled:false,value:'',innerHTML:'',textContent:'',dataset:{},style:{},listeners:{},open:false,isConnected:true,
  classList:{toggle(){}},addEventListener(k,fn){this.listeners[k]=fn;},setAttribute(k,v){this[k]=v;},focus(){this.focused=true;},select(){this.selected=true;},scrollIntoView(){},reset(){},
  showModal(){this.open=true;},close(){this.open=false;},querySelectorAll(){return[];}};}
const get=id=>{if(!els.has(id))els.set(id,element());return els.get(id);};
const document={readyState:'complete',title:'Lesson',getElementById:get,querySelector:get,querySelectorAll(){return[];},addEventListener(k,fn){listeners[k]=fn;},activeElement:element()};
const sandbox={document,location:{search:''},navigator:{},console,URL,URLSearchParams,Blob,Date,Promise,Math,JSON,
  localStorage:{getItem:k=>storage.get(k)||null,setItem(k,v){if(storageFails)throw new Error('Quota');storage.set(k,v);},removeItem:k=>storage.delete(k)},
  setTimeout:()=>1,clearTimeout(){},addEventListener(){},removeEventListener(){},scrollTo(){},print(){printed++;},confirm:()=>confirmValue,alert(m){sandbox.lastAlert=m;}};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'lesson.js'),'utf8'),sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'views.js'),'utf8'),sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8').replace(/\}\)\(\);\s*$/,`
  window.test={enter,activate,continueCard,go,check,changed,save,importBackup,pdf,backup,reset,normalizeSaved,
    profileKey,getState:()=>state,getImages:()=>images,isTeacher:()=>teacher,
    setImages:x=>{images=x;},setOriginals:x=>{originals=x;},
    db:(read,write)=>{readImages=read;writeImages=write;},download:f=>{download=f;}};
})();`),sandbox);
const t=sandbox.test;
t.db(async id=>JSON.parse(JSON.stringify(imageStore.get(id)||{})),async(id,value)=>imageStore.set(id,JSON.parse(JSON.stringify(value))));
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function run(){
  test('Entry validates both name and class and prevents form navigation',()=>{
    let prevented=false;t.enter({preventDefault(){prevented=true;}});assert(prevented);assert(get('entryError').textContent.includes('full name'));
    get('fullName').value='New Student';t.enter({preventDefault(){}});assert(get('entryError').textContent.includes('class'));
  });
  get('className').value='8B';get('entryLanguage').value='ko';t.enter({preventDefault(){}});await tick();
  test('Start hides landing page and shows exactly the first lesson card',()=>{
    assert.equal(get('entry').hidden,true);assert.equal(get('app').hidden,false);assert.equal(t.getState().current,'starter');
    assert(get('card').innerHTML.includes('What happens when you press A?'));assert(!get('card').innerHTML.includes('Try it on a real micro:bit'));
  });
  test('Opening is not completion; empty responses get an explicit non-blocking route',()=>{
    assert.equal(Object.keys(t.getState().cards).length,0);t.continueCard();assert.equal(t.getState().current,'starter');
    assert(get('continueFeedback').innerHTML.includes('Continue — mark for review'));t.continueCard(true);assert.equal(t.getState().current,'learning');assert.equal(t.getState().cards.starter.status,'review');
  });
  test('All blank cards can advance with a review record; no checker dead end',()=>{
    for(let i=1;i<11;i++){t.continueCard(true);}assert.equal(t.getState().current,'review');assert.equal(get('entry').hidden,true);
  });
  test('Incorrect choice can be revised; stale feedback and completion are invalidated',()=>{
    t.go('starter');t.changed({dataset:{field:'prediction'},value:'icon'},true);t.check('prediction');assert.equal(t.getState().checks.prediction.correct,false);
    t.changed({dataset:{field:'prediction'},value:'name'},true);assert.equal(t.getState().checks.prediction,undefined);assert.equal(t.getState().cards.starter.status,'started');
    t.continueCard();assert.equal(t.getState().cards.starter.status,'done');assert.equal(t.getState().current,'learning');
  });
  test('Device/editor selections reroute instructions, preserve drafts, and invalidate practical status',()=>{
    t.go('setup');t.changed({dataset:{field:'device'},value:'laptop'},true);t.changed({dataset:{field:'editor'},value:'micropython'},true);
    t.changed({dataset:{field:'device'},value:'ipad'},true);assert.equal(t.getState().responses.editor,'');
    t.changed({dataset:{field:'editor'},value:'makepython'},true);assert(get('card').innerHTML.includes('iPad route'));
    t.go('button');assert(get('card').innerHTML.includes('basic.show_icon'));assert(!get('card').innerHTML.includes('from microbit import'));
  });
  test('Changing a badge choice preserves earlier tests but requests a genuine retest',()=>{
    Object.assign(t.getState().responses,{icon:'HEART',startTest:'match',pressTest:'match',physical:'worked'});
    t.getState().cards.test={status:'done'};
    t.changed({dataset:{field:'icon'},value:'HAPPY'},true);
    assert.equal(t.getState().responses.startTest,undefined);assert.equal(t.getState().responses.physical,undefined);
    assert.equal(t.getState().cards.test.status,'review');assert(t.getState().history.some(h=>h.type.includes('retest after change')));
  });
  test('Autosave and refresh restore the same student, language and current card',()=>{
    t.save(true);const s=t.getState(),key=t.profileKey(s.student.name,s.student.className,false);
    const saved=t.normalizeSaved(JSON.parse(storage.get(key)));assert.equal(saved.current,'button');assert.equal(saved.language,'ko');assert.equal(saved.responses.editor,'makepython');
  });
  const saved=JSON.parse(JSON.stringify(t.getState())),studentKey=t.profileKey(saved.student.name,saved.student.className,false);
  await t.activate(saved,studentKey,false);
  test('Refresh activation keeps the landing page hidden',()=>assert.equal(get('entry').hidden,true));
  test('Extensions are optional and do not block the pitstop/plenary',()=>{
    t.go('extend3');assert.equal(t.getState().current,'extend3');t.go('pitstop');assert.equal(t.getState().current,'pitstop');t.go('plenary');assert.equal(t.getState().current,'plenary');
  });
  test('Quota failure is visible, not a false Saved status',()=>{
    storageFails=true;t.save(true);assert(get('saveStatus').textContent.includes('Save incomplete'));storageFails=false;t.save(true);assert(get('saveStatus').textContent.includes('Saved'));
  });
  const studentSnapshot=storage.get(studentKey);
  get('fullName').value='teacher';get('className').value='';t.enter({preventDefault(){}});await tick();
  test('Teacher name works without a class and uses separate storage/navigation',()=>{
    assert(t.isTeacher());t.go('review');assert.equal(t.getState().current,'review');assert.equal(storage.get(studentKey),studentSnapshot);
    assert(!get('card').innerHTML.includes('teacher controls'));assert(storage.has(t.profileKey('teacher','8T',true)));
  });
  await t.activate(saved,studentKey,false);
  const images={code:{data:'data:image/png;base64,AA==',caption:'Original code',at:'today'},device:{data:'data:image/jpeg;base64,AA==',caption:'Device',at:'today'}};
  t.setImages(images);for(const slot of Object.keys(images))t.getState().evidence[slot]={caption:images[slot].caption,at:images[slot].at};
  let download;t.download((blob,filename)=>{download={blob,filename};});await t.backup();
  const backupText=await download.blob.text();
  test('Backup export contains actual evidence and correct filename',()=>{
    const b=JSON.parse(backupText);assert.equal(b.images.code.caption,'Original code');assert(download.filename.endsWith('_T1W2_Project_Backup.json'));
  });
  await t.importBackup({size:backupText.length,text:async()=>backupText});
  test('Import restores images through the persistence path, not just metadata',()=>{
    assert.equal(t.getImages().code.caption,'Original code');assert(imageStore.has(t.getState().sessionId));assert.equal(t.getState().student.name,saved.student.name);
  });
  const prior=JSON.stringify(t.getState());confirmValue=false;await t.importBackup({size:backupText.length,text:async()=>backupText});
  test('Cancel import preserves current work',()=>assert.equal(JSON.stringify(t.getState()),prior));
  confirmValue=true;await t.importBackup({size:4,text:async()=>'{bad'});
  test('Invalid backup leaves work intact and reports the error',()=>{assert.equal(JSON.stringify(t.getState()),prior);assert(sandbox.lastAlert.includes('Backup not restored'));});
  await t.pdf();
  test('Print export builds a full report and shows Teams Week 2 wording',()=>{
    assert.equal(printed,1);assert(get('printReport').innerHTML.includes('Original code'));assert(get('dialogBody').innerHTML.includes('Week 2 Project'));assert(get('dialogBody').innerHTML.includes('cannot confirm'));
    assert(document.title.includes('T1W2_Project'));
  });
  confirmValue=false;await t.reset();
  test('Reset cancellation preserves work',()=>assert(t.getState()));
  confirmValue=true;await t.reset();
  test('Confirmed reset removes only the active profile and returns to entry',()=>{assert.equal(t.getState(),null);assert.equal(get('entry').hidden,false);assert(storage.has(t.profileKey('teacher','8T',true)));});
  test('Image storage cannot leave a returning pupil stuck on the landing page',()=>{
    const s=L.blank('Returning Student','8A');s.evidence.code={caption:'saved',at:'today'};
    t.db(()=>new Promise(()=>{}),async()=>{});
    t.activate(s,t.profileKey(s.student.name,s.student.className,false),false);
    assert.equal(get('entry').hidden,true);assert.equal(get('app').hidden,false);assert(get('card').innerHTML.includes('What happens when'));
  });

  // Exact examples are parsed and exercised with API stubs, not a MakeCode compiler or hardware.
  const samples={};for(const editor of ['makepython','micropython'])for(const icon of Object.keys(L.VALUES.icon))for(const b of [false,true])samples[editor+'-'+icon+'-'+b]=L.sample(editor,icon,'MK',true,b);
  const python=process.env.PYTHON || '/Users/tenbywork/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
  const py=spawnSync(python,['-c',`
import ast,json,sys,types
samples=json.load(sys.stdin)
for key,code in samples.items():
    ast.parse(code)
    if not key.startswith('makepython'): continue
    events=[]; handlers={}
    basic=types.SimpleNamespace(show_icon=lambda x:events.append(('icon',x)),show_string=lambda x:events.append(('text',x)))
    env={'basic':basic,'input':types.SimpleNamespace(on_button_pressed=lambda b,f:handlers.update({b:f})),'IconNames':types.SimpleNamespace(**{k:k for k in ['HEART','HAPPY','DIAMOND','YES']}),'Button':types.SimpleNamespace(A='A',B='B')}
    exec(code,env)
    assert len(events)==1 and events[0][0]=='icon'
    handlers['A'](); assert events[-1]==('text','MK')
    if key.endswith('true'): handlers['B'](); assert events[-1]==('icon','YES')
print('16 code variants parsed; MakeCode startup and button handlers exercised with stubs.')
`],{input:JSON.stringify(samples),encoding:'utf8'});
  test('Python syntax and example event behaviour pass non-hardware checks',()=>assert.equal(py.status,0,py.stderr));
  console.log(py.stdout.trim());
  console.log(`TOTAL ${count} regression checks passed. Real browser layout, clipboard permissions, print pagination and iPad/Bluetooth remain manual checks.`);
}
run().catch(err=>{console.error(err);process.exitCode=1;});
