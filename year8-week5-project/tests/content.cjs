const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'lesson.js'),'utf8'),context);
const L=context.window.PROJECT;
assert.equal(new Set(L.cards.map(c=>c.id)).size,L.cards.length);
assert(L.cards.findIndex(c=>c.id==='extension')<L.cards.findIndex(c=>c.id==='pitstop'));
assert.equal(L.cards.at(-1).id,'review');
for(const c of L.cards){assert(c.title&&c.body);for(const q of c.questions||[])assert(q.answer>=0&&q.answer<q.options.length);}
for(const points of [4,5,6])for(const sound of [false,true]){
 const events={},outputs=[],tones=[];
 vm.runInNewContext(L.js(points,'>=',sound),{Button:{A:'A',B:'B'},IconNames:{Heart:'heart'},BeatFraction:{Quarter:1},basic:{showIcon:x=>outputs.push(x),showString:x=>outputs.push(x)},input:{onButtonPressed:(b,f)=>events[b]=f},music:{playTone:(x)=>tones.push(x),beat:x=>x}});
 assert.equal(outputs[0],'heart');events.A();assert.equal(outputs.at(-1),'AB');events.B();assert.equal(outputs.at(-1),points>=5?'READY':'CHECK');
 assert.equal(tones.length,sound?1:0);
 if(sound)assert.equal(tones[0],points>=5?523:262);
}
const events={},out=[];vm.runInNewContext(L.js(5,'>'),{Button:{A:'A',B:'B'},IconNames:{Heart:'heart'},basic:{showIcon:()=>{},showString:x=>out.push(x)},input:{onButtonPressed:(b,f)=>events[b]=f}});events.B();assert.equal(out.at(-1),'CHECK');
for(const language of ['zh','ko','ms'])for(const [stage] of L.stages)assert(L.languages[language][stage]);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
for(const match of app.matchAll(/picture\('([^']+)'/g))assert(fs.existsSync(path.join(root,'assets/images',match[1])),match[1]);
for(const name of ['index.html','styles.css','vendor/jspdf.umd.min.js','assets/fonts/Raleway.ttf'])assert(fs.existsSync(path.join(root,name)));
console.log('PASS: lesson structure, quiz keys, language coverage, local assets, startup/A/B behaviour, 4/5/6 boundaries, deliberate > error and sound branches.');
const routeContext={state:{student:{device:'ipad',editor:'blocks'}},titleEditor:()=> 'MakeCode Blocks'};
vm.createContext(routeContext);
vm.runInContext(app.split('\n').filter(l=>l.startsWith('const MOBILE_APPS=')||l.startsWith('function editorURL()')||l.startsWith('function editorLink()')).join('\n'),routeContext);
let markup=vm.runInContext('editorLink()',routeContext);assert(markup.includes('apps.apple.com'));assert(!markup.includes('href="https://makecode.microbit.org/"'));
routeContext.state.student.device='android';markup=vm.runInContext('editorLink()',routeContext);assert(markup.includes('com.samsung.microbit'));assert(!markup.includes('href="https://makecode.microbit.org/"'));
routeContext.state.student.device='laptop';assert(vm.runInContext('editorLink()',routeContext).includes('href="https://makecode.microbit.org/"'));
assert(!app.split('\n').find(l=>l.startsWith("case 'setup':")).includes('makecode-editor-workspace.png'));
console.log('PASS: iPad/Android store routing, unchanged laptop editor link and removed setup image.');
