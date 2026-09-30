/* Student requests never use the teacher's Supabase Auth session. */
window.StudentWorkCloud = (() => {
  'use strict';
  const cfg = window.STUDENT_WORK_CONFIG;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const tokenPattern = /^[0-9a-f]{64}$/;
  let state = null, hooks = {}, timer = null, busy = false, generation = 0;
  let retry = 0, conflict = null, connecting = null, label = 'Saved on this device';
  const launch = (() => {
    const p = new URLSearchParams(location.hash.slice(1));
    const value = {classId:p.get('class'), lessonId:p.get('lesson'), joinToken:p.get('join'), entryToken:p.get('entry'), label:p.get('label') || ''};
    return uuidPattern.test(value.classId || '') && value.lessonId === cfg.lessonId ? value : null;
  })();
  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = [...b].map(v=>v.toString(16).padStart(2,'0')).join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  }
  function privateKey() { return [...crypto.getRandomValues(new Uint8Array(32))].map(v=>v.toString(16).padStart(2,'0')).join(''); }
  function emit(text, kind='pending') {
    label = text;
    if (state?.cloud) state.cloud.status = kind;
    hooks.persist?.();
    hooks.status?.(text, kind);
  }
  async function rpc(name, params) {
    if (!['student_work_register','student_work_load','student_work_save'].includes(name)) throw Error('Unsupported student connection.');
    const controller = new AbortController(), timeout = setTimeout(()=>controller.abort(),20000);
    try {
      const response = await fetch(cfg.url+'/rest/v1/rpc/'+name, {
        method:'POST', headers:{apikey:cfg.publishableKey,'Content-Type':'application/json'},
        body:JSON.stringify(params), signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer'
      });
      const result = await response.json();
      if (!response.ok) throw Object.assign(Error(result.message || 'Class saving is unavailable.'),{code:result.code,httpStatus:response.status});
      return result;
    } finally { clearTimeout(timeout); }
  }
  const fields = ['schemaVersion','lessonId','lessonVersion','language','device','current','frontier','answers',
    'answerHistory','completed','checks','orders','codes','runs','drawingStyles','drawingStyleDefault',
    'events','eventCounts','hints','quiz','previousQuiz','finished','finishedAt','startedAt','updatedAt','speed','teamsConfirmed'];
  function payload(source) {
    const out = {};
    for (const k of fields) if (source[k] !== undefined) out[k] = JSON.parse(JSON.stringify(source[k]));
    // Keep the first and latest run. Round coordinates, not code/answers, to reduce size.
    for (const [id,runs] of Object.entries(out.runs || {})) {
      const kept = runs.length>1 ? [runs[0],runs[runs.length-1]] : runs;
      out.runs[id] = kept.map(r=>({...r,draws:(r.draws||[]).map(d=>({...d,
        ...(d.from ? {from:d.from.map(n=>Math.round(n*100)/100)} : {}),
        ...(d.to ? {to:d.to.map(n=>Math.round(n*100)/100)} : {})}))}));
    }
    const bytes = new TextEncoder().encode(JSON.stringify(out,null,1)).length;
    if (bytes>cfg.maxPayloadBytes) throw Object.assign(Error('Your drawing evidence is too large for class saving. Download a backup and tell your teacher. Your lesson is still available.'),{code:'LOCAL_SIZE'});
    return out;
  }
  function validCloud(c) {
    return c && !c.disabled && c.lessonId===cfg.lessonId && uuidPattern.test(c.classId || '') && tokenPattern.test(c.resumeToken || '') &&
      (!c.attemptId || uuidPattern.test(c.attemptId));
  }
  function attached(s) { return state === s; }
  function queue(delay=cfg.debounceMs) {
    clearTimeout(timer);
    if (!state || state.teacher || !validCloud(state.cloud) || conflict) return;
    timer = setTimeout(()=>flush().catch(()=>{}),delay);
  }
  function changed(s) {
    if (!attached(s) || s.teacher || !validCloud(s.cloud)) return;
    s.cloud.dirty = true;
    // An older acknowledgement cannot describe a newer draft as submitted.
    emit(navigator.onLine===false?'Saved on device · waiting for internet':'Saved on device · waiting to sync','pending');
    queue();
  }
  function acceptMeta(c,r) {
    c.attemptId = r.attempt_id; c.revision = Number(r.revision);
    c.syncedAt = r.updated_at; c.submittedAt = r.submitted_at;
  }
  async function attach(s, handlers) {
    const g = ++generation;
    clearTimeout(timer); state=s; hooks=handlers; conflict=null; retry=0; busy=false; connecting=null;
    if (s.teacher) { emit('Teacher preview · no pupil work sent','local'); return; }
    if (!validCloud(s.cloud) && launch && (tokenPattern.test(launch.entryToken || '') || tokenPattern.test(launch.joinToken || ''))) {
      try {
        if (!uuidPattern.test(s.student.id)) s.student.id=uuid();
        s.cloud = {classId:launch.classId,lessonId:cfg.lessonId,resumeToken:privateKey(),revision:0,dirty:true,status:'pending'};
        // Persist the identity and capability BEFORE registration so retries are safe.
        if (hooks.persist?.() === false) { s.cloud.disabled=true; throw Error('Device storage is unavailable. Keep a backup; class saving cannot safely start.'); }
      } catch (err) { emit(err.message,'error'); return; }
    }
    if (!validCloud(s.cloud)) { emit('Saved on this device · use your teacher’s class link for online saving','local'); return; }
    if (launch && launch.classId!==s.cloud.classId) { emit('This backup belongs to another class. Keep it separate and open the correct class link.','error'); return; }
    emit('Saved on device · connecting to class','pending');
    connecting = (async()=>{
      try {
        const c=s.cloud;
        // Retry an unfinished write with its original ID before loading. Its response
        // may have been lost even though the server committed it before a refresh.
        if (c.attemptId && c.pendingWrite) {
          const write=c.pendingWrite;
          try {
            const acknowledgement=await rpc('student_work_save',{p_attempt_id:c.attemptId,p_resume_token:c.resumeToken,
              p_payload:write.payload,p_expected_revision:write.revision,p_write_id:write.id,p_finish:write.finish});
            if(g!==generation)return;
            acceptMeta(c,acknowledgement);c.pendingWrite=null;
            c.dirty=JSON.stringify(payload(s))!==JSON.stringify(write.payload);
          }catch(err){
            if(err.code==='40001'){
              const newer=await rpc('student_work_load',{p_attempt_id:c.attemptId,p_resume_token:c.resumeToken});
              if(g!==generation)return;conflict=newer;emit('A newer class copy exists · choose which work to keep','conflict');return;
            }
            throw err;
          }
        }
        const remote = c.attemptId ? await rpc('student_work_load',{p_attempt_id:c.attemptId,p_resume_token:c.resumeToken}) :
          await rpc('student_work_register',{p_class_id:c.classId,p_lesson_id:cfg.lessonId,
            p_join_token:tokenPattern.test(launch?.entryToken || '')?launch.entryToken:launch?.joinToken || null,
            p_local_learner_id:s.student.id,p_learner_name:s.student.name,p_resume_token:c.resumeToken});
        if (g!==generation) return;
        const previousRevision = Number(c.revision || 0);
        if (c.attemptId && Number(remote.revision)!==previousRevision && (c.dirty || c.pendingWrite)) {
          conflict=remote; emit('A newer class copy exists · choose which work to keep','conflict'); return;
        }
        acceptMeta(c,remote);
        if (!c.dirty && !c.pendingWrite && remote.payload?.lessonId===cfg.lessonId) hooks.remote?.(remote);
        if (launch?.joinToken) {
          const p=new URLSearchParams(location.hash.slice(1)); p.delete('join');
          history.replaceState(null,'',location.pathname+location.search+'#'+p.toString());
          // Legacy, temporary invites are removed. A permanent entry link remains
          // bookmarkable; it is NOT a key to any pupil's saved work.
        }
        emit(c.dirty || c.pendingWrite?'Saved on device · waiting to sync':c.submittedAt?'Submitted to teacher':'Saved to class',c.dirty || c.pendingWrite?'pending':'saved');
        if (c.dirty || c.pendingWrite) queue(0);
      } catch (err) {
        if (g!==generation) return;
        handleError(err); if (!['42501','22023','LOCAL_SIZE'].includes(err.code)) queue(Math.min(60000,5000*2**retry++));
      } finally { if (g===generation) connecting=null; }
    })();
    await connecting;
  }
  function handleError(err) {
    if (err.code==='42501') {
      const text=state?.cloud?.attemptId
        ? 'Class saving is closed or your private save key is unavailable. Your device copy is safe; tell your teacher.'
        : tokenPattern.test(launch?.entryToken || '')
          ? 'New class entry is closed or this link was replaced. Keep working on this device. Ask your teacher to open entry, then tap Try saving again.'
          : 'Class saving is closed or this temporary link has expired. Your device copy is safe; ask your teacher for the current class link.';
      emit(text,'error');
    }
    else if (err.code==='22023') emit('This lesson cannot sync with the class setup. Keep working, download a backup and tell your teacher.','error');
    else if (err.code==='54000' || err.code==='LOCAL_SIZE') emit(err.code==='LOCAL_SIZE'?err.message:'Class storage limit reached. Download a backup and tell your teacher.','error');
    else emit('Saved on device · waiting for connection. Your work will retry automatically.','pending');
  }
  async function flush() {
    clearTimeout(timer);
    const s=state, g=generation;
    if (!s || s.teacher || !validCloud(s.cloud)) return false;
    if (connecting) await connecting;
    if (g!==generation || conflict) return false;
    const c=s.cloud;
    if (!c.attemptId) { await attach(s,hooks); return false; }
    if (busy) { queue(1000); return false; }
    if (!c.dirty && !c.pendingWrite) return !!c.syncedAt;
    busy=true;
    try {
      if (!c.pendingWrite) {
        const snapshot=payload(s);
        c.pendingWrite={id:uuid(),revision:c.revision,payload:snapshot,finish:!!s.finished};
        if (hooks.persist?.()===false) throw Error('Device storage is unavailable.');
      }
      const write=c.pendingWrite;
      emit('Saved on device · saving to class','pending');
      const result=await rpc('student_work_save',{p_attempt_id:c.attemptId,p_resume_token:c.resumeToken,
        p_payload:write.payload,p_expected_revision:write.revision,p_write_id:write.id,p_finish:write.finish});
      if (g!==generation) return false;
      acceptMeta(c,result); c.pendingWrite=null; retry=0;
      const stillDifferent=JSON.stringify(payload(s))!==JSON.stringify(write.payload);
      c.dirty=stillDifferent;
      emit(stillDifferent?'Saved on device · newer changes waiting':c.submittedAt?'Submitted to teacher':'Saved to class',stillDifferent?'pending':'saved');
      if (stillDifferent) queue();
      return !stillDifferent;
    } catch (err) {
      if (g!==generation) return false;
      if (err.code==='40001') {
        try { conflict=await rpc('student_work_load',{p_attempt_id:c.attemptId,p_resume_token:c.resumeToken});
          if (g===generation) emit('A newer class copy exists · choose which work to keep','conflict');
        } catch (loadError) { handleError(loadError); queue(10000); }
      } else {
        handleError(err);
        if (!['42501','22023','54000','LOCAL_SIZE'].includes(err.code)) queue(err.code==='P0001'?2000:Math.min(60000,5000*2**retry++));
      }
      return false;
    } finally { if (g===generation) busy=false; }
  }
  function resolve(useClassCopy) {
    if (!conflict || !state) return;
    const remote=conflict, c=state.cloud; conflict=null; c.pendingWrite=null; acceptMeta(c,remote);
    if (useClassCopy) { c.dirty=false; hooks.remote?.(remote); emit(c.submittedAt?'Submitted to teacher':'Saved to class','saved'); }
    else { c.dirty=true; emit('Your device copy chosen · waiting to sync','pending'); queue(0); }
  }
  function status() { return {text:label,kind:state?.cloud?.status || 'local',conflict:!!conflict}; }
  function submitted(s) { return !!(s?.finished && s.cloud?.submittedAt && !s.cloud?.dirty && !s.cloud?.pendingWrite && s.cloud?.status==='saved'); }
  window.addEventListener('online',()=>queue(0));
  window.addEventListener('offline',()=>{if(state?.cloud)emit('Saved on device · waiting for internet','pending');});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush().catch(()=>{});});
  function detach() { ++generation; clearTimeout(timer); state=null; hooks={}; timer=null; conflict=null; connecting=null; busy=false; label='Saved on this device'; }
  return {attach,detach,changed,flush,resolve,status,submitted,payload,launch,uuid,validCloud};
})();
