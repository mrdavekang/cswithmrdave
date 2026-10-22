/* Pure notebook and evidence rules; also used by the local test suite. */
(() => {
  'use strict';
  const L=window.LISTS_LESSON;
  const page=id=>L.pages.find(p=>p.id===id);
  const core=L.pages.filter(p=>!p.optional);
  const now=()=>new Date().toISOString();
  const clone=v=>JSON.parse(JSON.stringify(v));
  const cleanText=(v,max=1500)=>String(v??'').slice(0,max);
  const safeName=v=>String(v||'Student').normalize('NFKD').replace(/[^a-z0-9_-]+/gi,'_').replace(/^_+|_+$/g,'').slice(0,50)||'Student';
  function fresh(name,className,role='student'){
    return {schema:1,lesson:L.id,version:L.version,contentRevision:L.contentRevision,name:cleanText(name,60),className:cleanText(className,30),role,stage:'ready',createdAt:now(),updatedAt:now(),pages:{},workspaces:{},feedback:[],images:[],submittedAt:null};
  }
  function response(n,id){if(!n.pages[id])n.pages[id]={answer:'',status:'unvisited',attempts:[],visitedAt:null,updatedAt:null};return n.pages[id];}
  function validOptionOrder(p,order){
    return Array.isArray(order)&&order.length===p.options?.length&&new Set(order).size===order.length&&order.every(id=>p.options.some(o=>o.id===id));
  }
  function orderedOptions(n,id,random=Math.random){
    const p=page(id);if(!p?.options)return [];
    // Reflection scales have an intentional progression; shuffle scored MCQs only.
    if(p.kind!=='choice'||!p.correct)return p.options;
    const r=response(n,id);
    if(!validOptionOrder(p,r.optionOrder)){
      const ids=p.options.map(o=>o.id);
      for(let i=ids.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
      r.optionOrder=ids;
    }
    return r.optionOrder.map(id=>p.options.find(o=>o.id===id));
  }
  function workspace(n,id,initial=''){
    if(!n.workspaces[id])n.workspaces[id]={code:initial,shell:'',runs:[],updatedAt:now()};
    return n.workspaces[id];
  }
  function visit(n,id){const r=response(n,id);r.visitedAt??=now();if(r.status==='unvisited')r.status='visited';n.stage=id;return r;}
  function evaluate(p,answer){
    if(p.kind==='number')return {marked:true,correct:String(answer).trim()===p.answer};
    if(p.correct)return {marked:true,correct:answer===p.correct};
    return {marked:false,correct:null};
  }
  function submit(n,id){
    const p=page(id),r=response(n,id),a=r.answer;
    if(!p||!String(a??'').trim())return {empty:true};
    const result=evaluate(p,a);r.attempts.push({answer:cleanText(a),at:now(),correct:result.correct,marked:result.marked});
    r.status=result.marked?(result.correct?'correct':'retry'):'submitted';r.updatedAt=now();r.submittedAnswer=a;return result;
  }
  function evidenceRuns(n,id){const p=page(id);return p?.workspace?n.workspaces[p.workspace]?.runs?.filter(r=>r.pageId===id)||[]:[];}
  function testRun(spec,run,currentCode){
    if(!run)return {ok:false,message:'No completed run on this test page yet. Run the program and enter the specified values in the Shell.'};
    if(run.code!==currentCode)return {ok:false,message:'Your code changed after this run. Run the current version again so the test evidence matches it.'};
    if(!run.ok||run.stopped)return {ok:false,message:'This attempt did not finish successfully. Read the recorded error, fix one issue, then repeat the same test.'};
    if(JSON.stringify(run.inputs)!==JSON.stringify(spec.inputs))return {ok:false,message:'The recorded inputs were '+JSON.stringify(run.inputs)+'. This test requires '+spec.inputs.join(', ')+' in that order. Run again with those inputs.'};
    let out=String(run.stdout||run.output||'').replace(/\r/g,'');
    // The real Shell records each prompt and its typed input. Remove those
    // exact pairs, in order, before comparing the program's printed lines.
    let start=0;
    for(const input of spec.inputs){
      const candidates=(spec.prompts||[]).map(prompt=>({prompt,index:out.indexOf(prompt,start)})).filter(x=>x.index>=0).sort((a,b)=>a.index-b.index);
      const found=candidates[0],pair=found?.prompt+input+'\n';
      if(!found||!out.startsWith(pair,found.index))return {ok:false,message:'The recorded prompt/input sequence differs from this test. Keep the supplied menu prompts and enter the stated values in order.'};
      out=out.slice(0,found.index)+out.slice(found.index+pair.length);start=found.index;
    }
    const lines=out.replace(/\n$/,'').split('\n').map(s=>s.trimEnd());
    if(JSON.stringify(lines)!==JSON.stringify(spec.lines))return {ok:false,message:'The printed lines differ. Expected '+spec.lines.join(' → ')+'. Recorded '+lines.join(' → ')+'. Check the selected index, indentation and where the list is created.'};
    return {ok:true,message:'The recorded inputs and printed lines match this example. This is evidence for this test case, not proof of every possible case or of the required code structure; your teacher can review the saved source.'};
  }
  function checkTest(n,id){
    const p=page(id),r=response(n,id),w=n.workspaces[p.workspace],run=evidenceRuns(n,id).filter(r=>r.kind!=='repl').at(-1),result=testRun(p.test,run,w?.code);
    r.test={...result,at:now(),runId:run?.id||null};r.status=result.ok?'test-passed':'test-review';r.updatedAt=now();return result;
  }
  function statistics(n){
    const objective=L.pages.filter(p=>p.correct||p.kind==='number');
    const tested=L.pages.filter(p=>p.test&&!p.optional).map(p=>p.id);
    return {visited:core.filter(p=>n.pages[p.id]?.visitedAt).length,total:core.length,answered:core.filter(p=>['submitted','correct','retry','test-passed','test-review','attempted','review-later'].includes(n.pages[p.id]?.status)).length,
      checks:objective.filter(p=>n.pages[p.id]?.status==='correct').length,checkTotal:objective.length,
      tests:tested.filter(id=>{const p=page(id),r=n.pages[id],run=evidenceRuns(n,id).find(x=>x.id===r?.test?.runId);return r?.test?.ok&&testRun(p.test,run,run?.code).ok;}).length,testTotal:tested.length};
  }
  function validateNotebook(raw){
    if(!raw||raw.schema!==1||raw.lesson!==L.id||raw.version!==L.version||typeof raw.name!=='string'||typeof raw.pages!=='object'||typeof raw.workspaces!=='object')throw Error('This is not a matching Lists/Menu backup. Your current notebook has not been replaced.');
    if(JSON.stringify(raw).length>30000000)throw Error('This backup is too large to restore safely.');
    const n=fresh(raw.name,raw.className,raw.role==='preview'?'preview':'student');
    n.stage=page(raw.stage)?raw.stage:'ready';n.createdAt=cleanText(raw.createdAt,50)||now();n.submittedAt=raw.submittedAt?cleanText(raw.submittedAt,50):null;
    if(/^[0-9a-f-]{36}$/i.test(raw.trackingId||''))n.trackingId=raw.trackingId;
    for(const p of L.pages){const v=raw.pages[p.id];if(!v||typeof v!=='object')continue;
      const r=response(n,p.id);r.answer=cleanText(v.answer);r.status=['unvisited','visited','draft','submitted','correct','retry','test-passed','test-review','attempted','review-later'].includes(v.status)?v.status:'draft';
      r.visitedAt=v.visitedAt?cleanText(v.visitedAt,50):null;r.updatedAt=v.updatedAt?cleanText(v.updatedAt,50):null;r.submittedAnswer=cleanText(v.submittedAnswer);
      r.attempts=Array.isArray(v.attempts)?v.attempts.filter(x=>x&&typeof x==='object').map(x=>({answer:cleanText(x.answer),at:cleanText(x.at,50),correct:typeof x.correct==='boolean'?x.correct:null,marked:x.marked===true})):[];
      r.evidence=cleanText(v.evidence,700);r.help=cleanText(v.help,400);r.hintUsed=v.hintUsed===true;
      r.supportLevel=['independent','hint','model'].includes(v.supportLevel)?v.supportLevel:'';
      if(p.kind==='choice'&&r.answer&&!p.options.some(o=>o.id===r.answer))r.status='draft';
      if(p.kind==='choice'&&p.correct&&validOptionOrder(p,v.optionOrder))r.optionOrder=[...v.optionOrder];
      if(v.test&&typeof v.test==='object')r.test={ok:v.test.ok===true,message:cleanText(v.test.message,1000),at:cleanText(v.test.at,50),runId:cleanText(v.test.runId,80)};
      if(v.snapshot&&typeof v.snapshot==='object')r.snapshot={code:cleanText(v.snapshot.code,20000),shell:cleanText(v.snapshot.shell,40000)};
    }
    const ids=new Set(L.pages.map(p=>p.workspace).filter(Boolean));
    for(const id of ids){const w=raw.workspaces[id];if(!w||typeof w!=='object')continue;const dst=workspace(n,id);
      dst.code=cleanText(w.code,20000);dst.shell=cleanText(w.shell,40000);dst.updatedAt=cleanText(w.updatedAt,50);
      dst.runs=Array.isArray(w.runs)?w.runs.filter(r=>r&&typeof r==='object'&&typeof r.code==='string'&&Array.isArray(r.inputs)).map(r=>({id:cleanText(r.id,80),pageId:page(r.pageId)?r.pageId:'m2-build',kind:['module','repl','cancel'].includes(r.kind)?r.kind:'module',code:cleanText(r.code,20000),inputs:r.inputs.map(v=>cleanText(v,1000)),stdout:cleanText(r.stdout,12000),stderr:cleanText(r.stderr,12000),output:cleanText(r.output,12000),error:cleanText(r.error,8000),ok:r.ok===true,stopped:r.stopped===true,line:Number.isSafeInteger(r.line)?r.line:null,at:cleanText(r.at,50),durationMs:Math.max(0,Math.min(9999999,Number(r.durationMs)||0))})):[];
    }
    for(const p of L.pages.filter(p=>p.test)){const r=n.pages[p.id];if(!r?.test?.ok)continue;const run=evidenceRuns(n,p.id).find(x=>x.id===r.test.runId);if(!testRun(p.test,run,run?.code).ok){r.test.ok=false;r.test.message='Your earlier run is kept, but does not match this page’s current requirements. Read the stated inputs and outputs, then run and check again.';r.status='test-review';}}
    n.feedback=Array.isArray(raw.feedback)?raw.feedback.filter(v=>v&&typeof v.text==='string').map(v=>({text:cleanText(v.text,3000),at:cleanText(v.at,50)})):[];
    n.images=Array.isArray(raw.images)?raw.images.filter(v=>v&&page(v.pageId)&&/^data:image\/(png|jpeg|webp);base64,/.test(v.data||'')&&v.data.length<5000000).map(v=>({id:cleanText(v.id,36),pageId:v.pageId,name:cleanText(v.name,100),data:v.data,at:cleanText(v.at,50)})):[];
    return n;
  }
  function cloudPayload(n,id){
    const p=page(id),r=response(n,id),w=p.workspace?n.workspaces[p.workspace]:null,snap=r.snapshot||{};
    return {stage:id,answers:{_lesson:L.version,_contentRevision:L.contentRevision,_class:n.className,_page:p.title,_status:r.status,_shell:String(w?.shell||snap.shell||'').slice(-3000),answer:cleanText(r.answer),evidence:cleanText(r.evidence,700),hintUsed:!!r.hintUsed,supportLevel:r.supportLevel||'',attempts:r.attempts.slice(-3),test:r.test||null,...(validOptionOrder(p,r.optionOrder)?{optionOrder:[...r.optionOrder]}:{})},
      code:String(w?.code||snap.code||'').slice(0,20000),runs:(w?.runs||[]).filter(x=>x.pageId===id).slice(-8).map(x=>({code:x.code.slice(0,20000),inputs:x.inputs.map(v=>String(v).slice(0,1000)).slice(0,100),stdout:String(x.stdout||'').slice(0,8000),stderr:String(x.stderr||'').slice(0,8000),output:String(x.output||'').slice(0,8000),error:String(x.error||'').slice(0,8000),ok:!!x.ok,line:x.line??null,at:x.at,durationMs:Math.max(0,Math.min(9999999,Math.round(x.durationMs||0)))})),
      ...(id==='finish'&&n.submittedAt?{submitted:true}:{})};
  }
  window.ListsCore=Object.freeze({page,core,now,clone,safeName,fresh,response,workspace,visit,evaluate,submit,testRun,checkTest,statistics,validateNotebook,cloudPayload,evidenceRuns,orderedOptions});
})();
