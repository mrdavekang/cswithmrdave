const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const L=require('./lesson.js');
let checks=0;const ok=(condition,message)=>{assert.ok(condition,message);checks++;};
// Parse every shipped script, including diagrams and libraries. A missing map
// must fail this test rather than being hidden behind a mocked map function.
const entry=fs.readFileSync('index.html','utf8');
for(const match of entry.matchAll(/<script[^>]+src="([^"?]+)(?:\?[^"]*)?"/g)){
  new vm.Script(fs.readFileSync(match[1],'utf8'),{filename:match[1]});
  ok(true,'Script syntax: '+match[1]);
}
const mapContext={window:{}};
vm.runInNewContext(fs.readFileSync('map.js','utf8'),mapContext);
for(const [detail,alternative] of [[false,false],[true,false],[false,true]]){
  const svg=mapContext.window.schoolMap(detail,alternative);
  ok(svg.includes('<svg')&&svg.includes('CS Room C1'),'Actual school map renders');
}
const s=L.makeState('李 明','7T');
ok(L.storageKey('李 明','7T')!==L.storageKey('王 明','7T'),'Different non-Latin names retain different profiles');
ok(L.storageKey('Teacher','')===L.storageKey('teacher','Review'),'Teacher storage is separate and stable');
ok(L.storageKey(' Aisha ','7T')===L.storageKey('aisha','7t'),'Name/class whitespace and case resume same profile');
ok(!/[<>:"/\\|?*]/.test(L.filename(s)),'Filename is safe');
ok(L.filename(s).includes('李_明'),'Filename preserves the student name');
for(const card of L.cards){
  const t=L.makeState('Test Student','7T');
  const required=L.required[card.id];
  for(const id of required){
    if(id.startsWith('q:')){const q=id.slice(2);t.quizzes[q]=L.check(t,q,L.questions[q].correct);}
    else t.answers[id]='My own wording — 我的答案';
  }
  ok(L.missing(t,card.id).length===0,card.id+' accepts all meaningful attempts');
  for(const id of required){const u=structuredClone(t);if(id.startsWith('q:'))delete u.quizzes[id.slice(2)];else u.answers[id]='  ';ok(L.missing(u,card.id).includes(id),'Missing field identified: '+id);}
}
let q=L.check(s,'order',0);ok(q.accepted,'Correct quiz is completed');s.quizzes.order=q;
q=L.select(s,'order',1);ok(!q.accepted&&q.checked===null,'Changing a selection clears old correct state');s.quizzes.order=q;
q=L.check(s,'order',1);ok(!q.accepted&&q.attempts.length===2,'Wrong check retains prior attempts');
s.quizzes.order={...q,accepted:true,supported:true};s.quizzes.code=L.check(s,'code',1);
ok(L.missing(s,'starter').length===0,'Reviewed support can unlock without correct guess');
const peer=L.makeState('Test','7T');Object.assign(peer.answers,{testStep:'3',testResult:'Works as written',testReason:'The student reaches the Library without guessing.'});
ok(L.missing(peer,'test').length===0,'No-error peer test allowed');peer.answers.testResult='Needs a clearer instruction';
ok(L.missing(peer,'test').includes('testRewrite'),'Improvement required only when an issue is reported');
peer.answers.testRewrite='Turn towards the Main Corridor.';ok(!L.missing(peer,'test').length,'Improved response accepted without keywords');
ok(L.missing(L.makeState('Test','7T'),'extension').length===0,'Extension never gates progress');
ok(!L.hasResponse('TURN ___ into the ___.'),'Unfinished sentence frame is not a completed answer');
ok(L.hasResponse('右转。'),'Short non-English responses are accepted');
ok(L.hasResponse('Turn right.'),'A short answer does not need an exact sentence');

// Unit-render the React components and exercise their handlers, without a browser.
let app, currentState=null, overrides={},hook=0,pending;
const ref={current:null};
const React={Component:class {},Fragment:'fragment',createElement:(type,props,...children)=>({type,props:{...props,children:children.flat(Infinity)}}),useState:initial=>{const index=hook++;let value=index===0?currentState:Object.hasOwn(overrides,index)?overrides[index]:typeof initial==='function'?initial():initial;return [value,next=>{if(index===0){pending=typeof next==='function'?next(currentState):next;}else overrides[index]=typeof next==='function'?next(value):next;}];},useRef:value=>({current:value}),useEffect:()=>{}};
const sandbox={React,Lesson:L,ReactDOM:{createRoot:()=>({render:e=>{app=e.props.children[0].type;}})},document:{getElementById:()=>({}),querySelector:()=>null},window:{scrollTo:()=>{}},console,setTimeout:()=>{},clearTimeout:()=>{},schoolMap:mapContext.window.schoolMap,Evidence:{load:async()=>[],save:async()=>{}},Report:{},confirm:()=>false,localStorage:{setItem(){},getItem(){return null}},URL,Blob,File:globalThis.File};
sandbox.window.window=sandbox.window;
vm.runInNewContext(fs.readFileSync('app.js','utf8'),sandbox);
function render(state,extra={}){currentState=state;hook=0;overrides=extra;pending=null;return app();}
function expand(node){if(!node||typeof node!=='object')return node;if(typeof node.type==='function')return expand(node.type(node.props));return {...node,props:{...node.props,children:(node.props?.children||[]).map(expand)}};}
function all(node){if(!node||typeof node!=='object')return [];return [node,...(node.props?.children||[]).flatMap(all)];}
function text(node){return typeof node==='string'?node:node?.props?.children?.map(text).join('')||'';}
for(let i=0;i<L.cards.length;i++){
  const t=L.makeState('Student','7T');t.current=i;t.unlocked=i;
  const tree=expand(render(t)),nodes=all(tree);
  ok(nodes.some(n=>n.props?.id==='card-title'),L.cards[i].id+' renders title');
  for(const id of L.required[L.cards[i].id]){
    const target=/^step[3-8]$/.test(id)?all(expand(render(t,{16:id}))):nodes;
    ok(target.some(n=>n.props?.id==='field-'+id),'Required control is reachable: '+id);
  }
  ok(nodes.some(n=>n.type==='button'&&text(n)==='Back'),'Back navigation exists');
}
const landing=expand(render(null));ok(all(landing).some(n=>n.props.id==='student-name'),'Landing name field');ok(all(landing).some(n=>n.props.id==='student-class'),'Landing class field');
const teach=L.makeState('teacher','Review');const teachTree=expand(render(teach));const jumps=all(teachTree).filter(n=>n.type==='button'&&text(n)===L.cards.at(-1).title);ok(jumps.some(n=>n.props.disabled===false),'Teacher can open last card');
const finish=L.makeState('Student','7T');finish.current=15;finish.unlocked=15;const finishTree=expand(render(finish));const checkbox=all(finishTree).find(n=>n.props?.type==='checkbox');checkbox.props.onChange({target:{checked:true}});ok(pending.submission.saved===true,'Checkbox stores checked value');
const empty=L.makeState('Student','7T');empty.current=1;empty.unlocked=1;const tree=expand(render(empty));const next=all(tree).find(n=>n.type==='button'&&text(n)==='Continue');ok(next&&!next.props.disabled,'Continue stays actionable for missing-answer guidance');next.props.onClick();ok(overrides[5]?.length===2,'Continue identifies both missing starter checks');

const runtime={window:{},console, setTimeout,clearTimeout};vm.runInNewContext(fs.readFileSync('libraries/react-runtime.js','utf8'),runtime);ok(runtime.window.React.version.startsWith('18.'),'Original React runtime loads');ok(typeof runtime.window.ReactDOM.createRoot==='function','Original root renderer retained');
const revised=L.makeState('Student','7T');revised.current=10;revised.unlocked=10;Object.assign(revised.answers,{step3:'Turn left.',testStep:'3',testResult:'Needs a clearer instruction',testReason:'The Main Corridor is on the right.',testRewrite:'Turn right into the Main Corridor.'});const revisedTree=expand(render(revised));all(revisedTree).find(n=>n.type==='button'&&text(n)==='Continue').props.onClick();ok(pending.answers.step3===revised.answers.testRewrite,'Continuing automatically applies a tested correction');ok(pending.revisions.length===1,'Original and improved instruction retained');ok(pending.current===12,'Optional extension skipped on core route');
const html=fs.readFileSync('index.html','utf8');for(const match of html.matchAll(/(?:src|href)="([^"?]+)(?:\?[^"]*)?"/g))if(!match[1].startsWith('#'))ok(fs.existsSync(match[1]),'Local asset exists: '+match[1]);
ok(!html.includes('type="module"'),'Entry can load from static hosting and local files');
const css=fs.readFileSync('styles.css','utf8');ok(!css.includes('body>*'),'Print does not hide report parent');ok(css.includes('body>#report-root'),'Print report has an explicit visible root');
console.log('Passed '+checks+' checks: lesson rules, missing-answer guidance, all cards, teacher access, checkbox state, Unicode profiles, runtime and local assets.');
