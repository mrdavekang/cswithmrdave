const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const source=fs.readFileSync(__dirname+'/../cloud.js','utf8');
const lesson='y7-t1-w7-consolidation-v1',classId=webcrypto.randomUUID(),invite='e'.repeat(64),permanent='f'.repeat(64);
const records=new Map();let offline=false,loseAfterCommit=false,entryOpen=true,calls=[];
const clone=x=>JSON.parse(JSON.stringify(x));
function response(status,data){return {ok:status===200,status,json:async()=>clone(data)};}
function failure(code,message){return response(400,{code,message});}
async function fakeFetch(url,options){
  calls.push({url,options:clone({...options,signal:undefined})});if(offline)throw Error('Offline');
  const name=url.split('/').at(-1),p=JSON.parse(options.body);let r;
  if(name==='student_work_register'){
    r=[...records.values()].find(x=>x.local_learner_id===p.p_local_learner_id && x.class_id===p.p_class_id);
    if(r && r.key!==p.p_resume_token)return failure('42501','Wrong key');
    if(!r){if(!entryOpen || ![invite,permanent].includes(p.p_join_token))return failure('42501','Closed or wrong link');r={attempt_id:webcrypto.randomUUID(),class_id:p.p_class_id,
      lesson_id:p.p_lesson_id,local_learner_id:p.p_local_learner_id,learner_name:p.p_learner_name,key:p.p_resume_token,payload:{},revision:0,updated_at:'initial',submitted_at:null};records.set(r.attempt_id,r);}
  }else{
    r=records.get(p.p_attempt_id);if(!r || r.key!==p.p_resume_token)return failure('42501','Wrong key');
    if(name==='student_work_save'){
      if(r.last!==p.p_write_id){
        if(r.revision!==p.p_expected_revision)return failure('40001','Newer revision');
        r.payload=clone(p.p_payload);r.revision++;r.last=p.p_write_id;r.updated_at='save-'+r.revision;r.submitted_at=p.p_finish?'submitted-'+r.revision:null;
      }
      if(loseAfterCommit){loseAfterCommit=false;throw Error('Response lost after server commit');}
      return response(200,{attempt_id:r.attempt_id,revision:r.revision,updated_at:r.updated_at,submitted_at:r.submitted_at});
    }
  }
  const {key,last,...safe}=r;return response(200,safe);
}
function client(hash='',onReplace=()=>{}){
  const c={STUDENT_WORK_CONFIG:{url:'https://example.supabase.co',publishableKey:'sb_publishable_test',lessonId:lesson,lessonVersion:2,debounceMs:5,maxPayloadBytes:450000},
    location:{hash,pathname:'/index.html',search:''},navigator:{onLine:true},history:{replaceState:(_state,_title,url)=>onReplace(url)},crypto:webcrypto,TextEncoder,URLSearchParams,AbortController,
    setTimeout:()=>1,clearTimeout(){},fetch:fakeFetch,addEventListener(){},document:{addEventListener(){},visibilityState:'visible'}};
  c.window=c;vm.createContext(c);vm.runInContext(source,c);return c.StudentWorkCloud;
}
function state(name='Test learner') {return {schemaVersion:1,lessonId:lesson,lessonVersion:2,student:{id:webcrypto.randomUUID(),name,class:'7T'},teacher:false,
  current:'starter',answers:{starter:{answer:'sequence'}},answerHistory:{},codes:{},runs:{},events:[],eventCounts:{},completed:{},checks:{},orders:{},hints:{},quiz:{attempts:[],active:null},updatedAt:'local-1',finished:false};}
const link='#'+new URLSearchParams({class:classId,lesson,join:invite,label:'7T'});
const hooks={persist:()=>true,status(){},remote(){}};
async function test(){
  const a=state(),A=client(link);await A.attach(a,hooks);assert.match(a.cloud.resumeToken,/^[0-9a-f]{64}$/);assert.ok(a.cloud.attemptId);assert.equal(await A.flush(),true);assert.equal(a.cloud.revision,1);assert.equal(a.cloud.dirty,false);
  const b=state(),B=client(link);await B.attach(b,hooks);await B.flush();assert.notEqual(a.cloud.attemptId,b.cloud.attemptId,'Same names have distinct attempts');
  const sent=JSON.parse(calls.find(x=>x.url.endsWith('student_work_save')).options.body);
  assert.equal(sent.p_payload.student,undefined);assert.equal(sent.p_payload.cloud,undefined);assert.equal(sent.p_payload.teacher,undefined);
  assert.ok(calls.every(x=>!('Authorization' in x.options.headers)),'Student calls never carry a teacher JWT');
  const denied=await fakeFetch('https://example/rpc/student_work_load',{body:JSON.stringify({p_attempt_id:a.cloud.attemptId,p_resume_token:b.cloud.resumeToken})});assert.equal(denied.ok,false);
  offline=true;a.answers.starter.answer='offline edit';a.updatedAt='local-2';A.changed(a);assert.equal(await A.flush(),false);const pendingId=a.cloud.pendingWrite.id;assert.equal(a.cloud.dirty,true);
  offline=false;assert.equal(await A.flush(),true);assert.equal(records.get(a.cloud.attemptId).last,pendingId,'Retries keep their write ID');assert.equal(records.get(a.cloud.attemptId).payload.answers.starter.answer,'offline edit');
  a.answers.starter.answer='response lost edit';a.updatedAt='local-3';A.changed(a);loseAfterCommit=true;assert.equal(await A.flush(),false);
  const afterRefresh=clone(a),A2=client();await A2.attach(afterRefresh,hooks);assert.equal(A2.status().conflict,false,'Lost acknowledgement is retried before loading');assert.equal(afterRefresh.cloud.pendingWrite,null);assert.equal(afterRefresh.cloud.revision,3);
  afterRefresh.answers.starter.answer='another draft';afterRefresh.updatedAt='local-4';A2.changed(afterRefresh);
  const server=records.get(a.cloud.attemptId);server.revision++;server.last='other-device';server.payload.answers.starter.answer='other device edit';
  assert.equal(await A2.flush(),false);assert.equal(A2.status().conflict,true);assert.equal(afterRefresh.answers.starter.answer,'another draft','Conflict never overwrites a local draft');
  A2.resolve(false);assert.equal(await A2.flush(),true);assert.equal(server.payload.answers.starter.answer,'another draft');
  afterRefresh.finished=true;A2.changed(afterRefresh);assert.equal(A2.submitted(afterRefresh),false);await A2.flush();assert.equal(A2.submitted(afterRefresh),true,'Submission is only confirmed after acknowledgement');
  afterRefresh.finished=false;A2.changed(afterRefresh);assert.equal(A2.submitted(afterRefresh),false);await A2.flush();assert.equal(server.submitted_at,null);
  const clean=clone(afterRefresh);clean.cloud.dirty=false;server.revision++;server.payload.answers.starter.answer='remote restored';let restored;
  await client().attach(clean,{...hooks,remote:r=>restored=r});assert.equal(restored.payload.answers.starter.answer,'remote restored');
  const teacher=state('teacher');teacher.teacher=true;const before=calls.length;await client(link).attach(teacher,hooks);assert.equal(calls.length,before,'Preview teacher does not contact pupil APIs');
  const local=state();await client().attach(local,hooks);assert.equal(local.cloud,undefined,'No invitation means explicit local-only mode');
  const big=state();big.answers.large='x'.repeat(500000);assert.throws(()=>A.payload(big),/too large/);
  const specimen=state();specimen.runs.test=[{draws:[{from:[1.12345,0],to:[2.98765,1],pen:true}]},{draws:[]},{draws:[]}];const compact=A.payload(specimen);assert.equal(compact.runs.test.length,2);assert.equal(compact.runs.test[0].draws[0].from[0],1.12);
  const blocked=state();await client(link).attach(blocked,{...hooks,persist:()=>false});assert.equal(blocked.cloud.disabled,true);
  const permanentLink='#'+new URLSearchParams({class:classId,lesson,entry:permanent,label:'7T'});
  let replaced=null;const p=state('Permanent-link learner'),P=client(permanentLink,url=>replaced=url);
  await P.attach(p,hooks);assert.ok(p.cloud.attemptId);assert.equal(P.launch.entryToken,permanent);await P.flush();
  assert.equal(replaced,null,'Permanent class URL stays bookmarkable after joining');
  assert.equal(JSON.parse(calls.find(x=>x.url.endsWith('student_work_register') && JSON.parse(x.options.body).p_local_learner_id===p.student.id).options.body).p_join_token,permanent);
  entryOpen=false;const n=state('Waiting learner'),N=client(permanentLink);await N.attach(n,hooks);
  const waitingKey=n.cloud.resumeToken,waitingId=n.student.id;
  assert.equal(n.cloud.attemptId,undefined);assert.match(N.status().text,/entry is closed/);assert.match(N.status().text,/Try saving again/);
  const existing=clone(p),E=client(permanentLink);await E.attach(existing,hooks);
  existing.answers.starter.answer='closed entry edit';E.changed(existing);assert.equal(await E.flush(),true,'Existing pupils can save with intake closed');
  entryOpen=true;await N.flush();await N.flush();assert.ok(n.cloud.attemptId);assert.equal(n.cloud.resumeToken,waitingKey);assert.equal(n.student.id,waitingId,'Reopening retries the same pupil identity');
  assert.equal([...records.values()].filter(r=>r.local_learner_id===waitingId).length,1,'No duplicate attempt on entry retry');
  let legacyURL;await client(link,url=>legacyURL=url).attach(state('Legacy learner'),hooks);assert.ok(legacyURL && !legacyURL.includes('join='),'Temporary invite is removed after registration');
  const malformed=state('Malformed link');await client('#'+new URLSearchParams({class:classId,lesson,entry:'not-a-token'})).attach(malformed,hooks);assert.equal(malformed.cloud,undefined);
  const both=state('Both token fields');await client(permanentLink+'&join='+invite).attach(both,hooks);
  assert.equal(JSON.parse(calls.filter(x=>x.url.endsWith('student_work_register') && JSON.parse(x.options.body).p_local_learner_id===both.student.id).at(-1).options.body).p_join_token,permanent,'Permanent token takes precedence');
  console.log('PASS: original cloud regressions plus permanent/legacy launch URLs, closed/reopened entry, private key retention, own-work saving with intake closed, no duplicate attempts and invalid-token fallback. Networking is mocked.');
}
test().catch(err=>{console.error(err);process.exitCode=1;});
