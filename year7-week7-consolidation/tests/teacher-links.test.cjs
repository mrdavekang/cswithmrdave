// Unit test of teacher-page state/events. DOM, Auth and network are mocked;
// this does not claim a real browser or signed-in Supabase test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../teacher.js','utf8');
const lesson='y7-t1-w7-consolidation-v1',a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
const pause=()=>new Promise(resolve=>setImmediate(resolve));
async function fixture(){
  const nodes=new Map(),calls=[],states=new Map([
    [a,{class_id:a,lesson_id:lesson,label:'7T',entry_token:'a'.repeat(64),expires_at:null,entry_open:false,accept_saves:false}],
    [b,{class_id:b,lesson_id:lesson,label:'7B',entry_token:'b'.repeat(64),expires_at:null,entry_open:false,accept_saves:false}]
  ]);
  let confirmation=true,missing=false,late=null;
  class Element{
    constructor(id){this.id=id;this.value='';this.textContent='';this.disabled=false;this.content='';}
    set innerHTML(value){this.content=value;for(const match of value.matchAll(/id="([^"]+)"/g))nodes.set(match[1],new Element(match[1]));}
    get innerHTML(){return this.content;}
    querySelectorAll(){return [];}
    select(){this.selected=true;}
  }
  nodes.set('teacher-main',new Element('teacher-main'));
  const client={auth:{getSession:async()=>({data:{session:{user:{id:'test-approved-teacher'}}}}),signOut:async()=>({})},
    rpc:async(name,args)=>{
      calls.push({name,args});
      if(name==='student_work_teacher_classes')return {data:[{class_id:a,label:'7T'},{class_id:b,label:'7B'}],error:null};
      if(name==='student_work_teacher_list')return {data:[],error:null};
      const s=states.get(args.p_class_id);
      if(!s)return {data:null,error:{code:'42501',message:'Not your class'}};
      if(name==='student_work_teacher_class_link'){
        if(missing)return {data:null,error:{code:'PGRST202',message:'Function not installed'}};
        if(late && late.classId===args.p_class_id){const pending=late;late=null;await pending.promise;}
        return {data:{...s},error:null};
      }
      if(name==='student_work_teacher_open'){s.entry_open=true;s.accept_saves=true;s.expires_at=new Date(Date.now()+7200000).toISOString();return {data:{join_token:'legacy-ignored'},error:null};}
      if(name==='student_work_teacher_close'){s.entry_open=false;return {data:{closed:true},error:null};}
      if(name==='student_work_teacher_replace_class_link'){s.entry_token='c'.repeat(64);return {data:{...s},error:null};}
      throw Error('Unexpected RPC '+name);
    }};
  const context={STUDENT_WORK_CONFIG:{url:'https://test.supabase.co',publishableKey:'test-public',lessonId:lesson,lessonVersion:2},
    ConsolidationLesson:{title:'Test lesson',cards:[]},ConsolidationReport:{escape:x=>String(x),html:()=>''},
    supabase:{createClient:()=>client},sessionStorage:{},URL,URLSearchParams,Date,Promise,
    location:{href:'https://school.example/year7/teacher.html'},
    navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>confirmation,
    document:{querySelector:selector=>nodes.get(selector.slice(1)) || null,querySelectorAll:()=>[]},
    clearInterval(){},setInterval(){return 1;}};
  vm.createContext(context);vm.runInContext(source,context);await pause();await pause();
  return {nodes,calls,states,setConfirmation:v=>confirmation=v,setMissing:v=>missing=v,
    delayLink:classId=>{let resolve;const promise=new Promise(r=>resolve=r);late={classId,promise};return resolve;}};
}
async function test(){
  const f=await fixture(),node=id=>f.nodes.get(id),click=async id=>{await node(id).onclick({currentTarget:node(id)});await pause();};
  assert.ok(node('class-launch-url'),JSON.stringify({calls:f.calls,html:node('teacher-main').innerHTML,message:node('teacher-message')?.textContent}));
  const original=node('class-launch-url').value;
  assert.match(original,/entry=a{64}/);assert.ok(!original.includes('join='));
  assert.match(node('class-entry-status').textContent,/closed/,'Closed link is available before opening entry');
  await click('open-class');assert.equal(node('class-launch-url').value,original);assert.match(node('class-entry-status').textContent,/open until/);
  await click('close-class');assert.equal(node('class-launch-url').value,original);assert.match(node('class-entry-status').textContent,/closed/);
  assert.equal(f.calls.find(x=>x.name==='student_work_teacher_close').args.p_close_saves,false,'Close only blocks new entry');
  await click('open-class');assert.equal(node('class-launch-url').value,original,'Reopening does not change link');
  f.states.get(a).expires_at=new Date(Date.now()-1000).toISOString();await click('refresh-class');assert.match(node('class-entry-status').textContent,/closed/);
  f.setConfirmation(false);let count=f.calls.length;await click('replace-class-link');assert.equal(f.calls.length,count,'Cancelling replacement does not send a request');
  f.setConfirmation(true);await click('replace-class-link');assert.match(node('class-launch-url').value,/entry=c{64}/);assert.match(node('teacher-message').textContent,/update this class/);
  // A slow class-A response must not render A's private link after choosing B.
  const release=f.delayLink(a),refreshing=node('refresh-class').onclick();
  await node('teacher-class').onchange({target:{value:b}});release();await refreshing;await pause();
  assert.match(node('class-launch-url').value,/entry=b{64}/);assert.ok(node('class-launch-url').value.includes(b));
  f.setMissing(true);await click('refresh-class');assert.match(node('launch-link').textContent,/database update/);assert.match(node('teacher-message').textContent,/could not connect/);
  await click('teacher-signout');assert.match(node('teacher-main').innerHTML,/Sign in to your classes/);
  console.log('PASS: teacher link retrieval while closed, stable URL across open/close/reopen, automatic expiry display, safe close, replacement confirmation, class-switch race, missing migration notice and sign-out. DOM/Auth/network are mocked.');
}
test().catch(err=>{console.error(err);process.exitCode=1;});
