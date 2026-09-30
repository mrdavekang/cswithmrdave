(() => {
  'use strict';
  const cfg=STUDENT_WORK_CONFIG, L=ConsolidationLesson, e=ConsolidationReport.escape;
  const host=document.querySelector('#teacher-main');
  const client=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storage:sessionStorage,
    storageKey:'y7-student-work-teacher',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  let classes=[],selectedClass='',selectedAttempt='',rows=[],invite=null,poll=null,loading=false;
  const time=v=>v?new Date(v).toLocaleString(): 'Not yet';
  function message(text,bad=false){const box=document.querySelector('#teacher-message');if(box){box.textContent=text;box.className='teacher-message'+(bad?' error':'');}}
  async function rpc(name,args={}){const {data,error}=await client.rpc('student_work_'+name,args);if(error)throw error;return data;}
  function login(reason=''){
    clearInterval(poll);classes=[];rows=[];selectedAttempt='';invite=null;
    host.innerHTML='<header class="teacher-header"><h1>Teacher work review</h1><a class="button" href="index.html" rel="noopener">Back to lesson preview</a></header><form id="teacher-login" class="panel teacher-login"><h2>Sign in to your classes</h2><p>Use your existing <strong>classroom teacher account</strong>. Typing “teacher” on the lesson page is only a preview.</p><label for="teacher-email">Teacher email</label><input id="teacher-email" type="email" autocomplete="username" required><label for="teacher-password">Password</label><input id="teacher-password" type="password" autocomplete="current-password" required><button class="primary" type="submit" style="margin-top:20px">Sign in</button><p id="teacher-message" class="teacher-message '+(reason?'error':'')+'" role="status">'+e(reason || 'Teacher sign-in is separate from your Supabase dashboard login.')+'</p><p class="small">On a shared computer, sign out before leaving. The session is kept in this tab, not in pupil lesson saving.</p></form>';
    document.querySelector('#teacher-login').onsubmit=async ev=>{
      ev.preventDefault(); const b=ev.submitter; b.disabled=true;message('Signing in…');
      try {const {error}=await client.auth.signInWithPassword({email:document.querySelector('#teacher-email').value.trim(),password:document.querySelector('#teacher-password').value});
        document.querySelector('#teacher-password').value='';if(error)throw error;await openDashboard();
      }catch(err){message(err.message || 'Sign-in did not finish.',true);b.disabled=false;}
    };
  }
  async function openDashboard(){
    try {
      classes=await rpc('teacher_classes');
      if(!classes.some(c=>c.class_id===selectedClass))selectedClass=classes[0]?.class_id || '';
      draw();await refresh();clearInterval(poll);poll=setInterval(()=>refresh().catch(()=>{}),15000);
    }catch(err){if(err.code==='42501'){await client.auth.signOut();login('This account is not approved for student-work review. Use your existing approved teacher account.');}else login('Class review could not connect. Check the connection and try signing in again.');}
  }
  function draw(){
    host.innerHTML='<header class="teacher-header"><div><span class="eyebrow">Year 7 · Week 7</span><h1>Teacher work review</h1><p>'+e(L.title)+'</p></div><div class="tools"><a class="button" href="index.html" target="_blank" rel="noopener noreferrer">Lesson preview ↗</a><button id="teacher-signout">Sign out</button></div></header><div id="teacher-message" class="teacher-message" role="status">Choose a class, then open its lesson link. Pupil names are labels, not verified school identities.</div><div class="teacher-columns"><aside class="panel"><label for="teacher-class"><strong>Your class</strong></label><select id="teacher-class">'+classes.map(c=>'<option value="'+e(c.class_id)+'" '+(c.class_id===selectedClass?'selected':'')+'>'+e(c.label)+'</option>').join('')+'</select><details style="margin-top:15px"><summary>Add another class</summary><form id="add-class"><label for="new-class">Class label</label><input id="new-class" maxlength="30" placeholder="Enter the actual class label" required><button type="submit" style="margin-top:10px">Add class</button></form></details><div class="tools"><button id="open-class" class="primary" '+(!selectedClass?'disabled':'')+'>Open lesson · 2 hours</button><button id="close-class" '+(!selectedClass?'disabled':'')+'>Stop new entries</button></div><p class="small" style="margin-top:12px">Opening creates a fresh private class link. Existing pupils keep their saved work. Stopping new entries does not stop their saving.</p><div id="launch-link" class="launch-panel"></div><hr style="border:0;border-top:1px solid #cfdbd4;margin:22px 0"><h2>Pupil work</h2><button id="refresh-class">Refresh list</button><div id="teacher-summary" class="teacher-summary"></div><div id="teacher-roster" class="teacher-roster"></div></aside><section class="panel teacher-report"><div class="tools"><button id="refresh-work" '+(!selectedAttempt?'disabled':'')+'>Refresh selected work</button></div><div id="teacher-evidence" class="report"><h2>Choose a pupil</h2><p>Open a name on the left to see answers, code, drawings, learning reflections and quiz attempts. Attempts and progress are not automatic grades.</p></div></section></div>';
    document.querySelector('#teacher-signout').onclick=async()=>{clearInterval(poll);await client.auth.signOut();login('Signed out.');};
    document.querySelector('#teacher-class').onchange=async ev=>{selectedClass=ev.target.value;selectedAttempt='';invite=null;draw();await refresh();};
    document.querySelector('#refresh-class').onclick=()=>refresh();
    document.querySelector('#refresh-work').onclick=()=>review(selectedAttempt);
    document.querySelector('#add-class').onsubmit=async ev=>{ev.preventDefault();try{const r=await rpc('teacher_create_class',{p_label:document.querySelector('#new-class').value.trim()});selectedClass=r.class_id;await openDashboard();message('Class added. Open its lesson to create the pupil link.');}catch(err){message(err.message,true);}};
    document.querySelector('#open-class').onclick=async ev=>{
      ev.currentTarget.disabled=true;
      try {invite=await rpc('teacher_open',{p_class_id:selectedClass,p_lesson_id:cfg.lessonId,p_minutes:120});showLink();message('Class entry is open for 2 hours. Share the private link only with this class.');}
      catch(err){message(err.message,true);}finally{document.querySelector('#open-class').disabled=false;}
    };
    document.querySelector('#close-class').onclick=async()=>{try{await rpc('teacher_close',{p_class_id:selectedClass,p_lesson_id:cfg.lessonId,p_close_saves:false});invite=null;showLink();message('New entries are stopped. Pupils already working can still save.');}catch(err){message(err.message,true);}};
  }
  function showLink(){
    const box=document.querySelector('#launch-link');if(!invite){box.innerHTML='';return;}
    const url=new URL('index.html',location.href);
    url.hash=new URLSearchParams({class:invite.class_id,lesson:cfg.lessonId,label:classes.find(c=>c.class_id===invite.class_id)?.label || '',join:invite.join_token}).toString();
    box.innerHTML='<label for="class-launch-url"><strong>Private pupil link</strong></label><textarea id="class-launch-url" rows="4" readonly></textarea><div class="tools"><button id="copy-class-link">Copy link</button><a class="button" id="test-class-link" target="_blank" rel="noopener noreferrer">Open pupil link ↗</a></div><p class="small">New pupil entry expires '+e(time(invite.expires_at))+'. Put this link in the class’s private Teams resource, not a public website.</p>';
    document.querySelector('#class-launch-url').value=url.href;document.querySelector('#test-class-link').href=url.href;
    document.querySelector('#copy-class-link').onclick=async()=>{try{await navigator.clipboard.writeText(url.href);message('Class link copied. Paste it into this class’s Teams resource.');}catch{document.querySelector('#class-launch-url').select();message('Select and copy the link above. Clipboard access was unavailable.');}};
  }
  async function refresh(){
    if(loading || !selectedClass)return;loading=true;const classId=selectedClass;
    try {const list=await rpc('teacher_list',{p_class_id:classId,p_lesson_id:cfg.lessonId});if(classId!==selectedClass)return;rows=list;
      const active=rows.filter(r=>!r.revoked),submitted=active.filter(r=>r.submitted_at).length;
      document.querySelector('#teacher-summary').innerHTML='<span>'+active.length+' attempts</span><span>'+submitted+' submitted</span>';
      const box=document.querySelector('#teacher-roster');box.innerHTML=active.length?active.map(r=>'<button data-attempt="'+e(r.attempt_id)+'" aria-pressed="'+(r.attempt_id===selectedAttempt)+'"><strong>'+e(r.learner_name)+'</strong><small>'+(r.submitted_at?'Submitted':'In progress / partial')+' · save '+r.revision+'</small><small>'+e(time(r.updated_at))+'</small><small>'+e(L.cards.find(c=>c.id===r.current_card)?.title || r.current_card || 'Just joined')+'</small></button>').join(''):'<p>No pupil attempts yet. Open and share the class link first.</p>';
      box.querySelectorAll('[data-attempt]').forEach(b=>b.onclick=()=>review(b.dataset.attempt));
    }catch(err){message('Review could not refresh. '+err.message,true);}finally{loading=false;}
  }
  async function review(id){
    selectedAttempt=id;const c=selectedClass;
    try {const r=await rpc('teacher_load',{p_attempt_id:id});if(c!==selectedClass || selectedAttempt!==id)return;
      const p=r.payload || {}, student={id:r.local_learner_id,name:r.learner_name,class:classes.find(c=>c.class_id===r.class_id)?.label || ''};
      const state={schemaVersion:1,lessonId:cfg.lessonId,lessonVersion:cfg.lessonVersion,student,answers:{},answerHistory:{},completed:{},checks:{},orders:{},codes:{},runs:{},drawingStyles:{},eventCounts:{},hints:{},events:[],quiz:{attempts:[],active:null},...p,teacher:false};
      state.student=student;state.cloud={revision:r.revision,syncedAt:r.updated_at,submittedAt:r.submitted_at,status:'saved',dirty:false};
      document.querySelector('#teacher-evidence').innerHTML='<h2>'+e(student.name)+' · '+e(student.class)+'</h2><p><strong>'+(r.submitted_at?'Submitted to teacher':'In progress / partial')+'</strong> · latest class save '+e(time(r.updated_at))+'</p><p class="small">Review the actual answers and drawings. “Submitted” does not mean correct or fully complete.</p>'+ConsolidationReport.html(state);
      document.querySelector('#refresh-work').disabled=false;document.querySelectorAll('[data-attempt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.attempt===id)));
    }catch(err){message(err.message,true);}
  }
  client.auth.getSession().then(({data:{session}})=>session?openDashboard():login()).catch(()=>login('Sign in to continue.'));
})();
