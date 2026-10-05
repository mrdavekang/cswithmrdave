(() => {
  'use strict';
  const C=window.ReviewCommon,cfg=window.REVIEW_CONFIG;
  const client=C.client(),esc=C.escape;
  let binding=null,latest=null,active=false,inflight=false,connecting=false,timer,poller,lastSent=0,feedback=[],versions={},statuses={},synced={},conflicts={},pendingStatuses={},contextKey='';
  const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const params=new URLSearchParams(location.hash.slice(1));
  const invitation={room:params.get('room'),join:params.get('join'),notebook:params.get('notebook')};
  // The class invitation never goes to question/PDF links or referrer headers.
  if(params.has('join'))history.replaceState(null,'',location.pathname+location.search);
  const root=document.createElement('section');root.id='live-student';root.className='live-strip';root.hidden=true;
  document.querySelector('#lesson').prepend(root);
  function say(text){let el=root.querySelector('[data-live-status]');if(el)el.textContent=text;}
  function store(){try{localStorage.setItem(contextKey,JSON.stringify({binding,versions,synced,feedback,statuses}));return true;}catch{say('Device saving failed. Download a backup; keep this tab open.');return false;}}
  function loadContext(s){const key=(cfg.notebookId||cfg.lessonId)+':live:'+JSON.stringify([s.name,s.className]);if(key===contextKey)return;active=false;clearInterval(poller);clearTimeout(timer);contextKey=key;binding=null;versions={};synced={};feedback=[];statuses={};conflicts={};pendingStatuses={};try{const x=JSON.parse(localStorage.getItem(key)||'null');if(x){({binding,versions={},synced={},feedback=[],statuses={}}=x);}}catch{} }
  function responseFields(){return [...Object.entries(latest?.fields||{}).filter(([id,v])=>!id.startsWith('reveal-')&&v!==undefined&&id.length<=120),['_progress',latest?.stageTitle||'']];}
  function attach(s){latest=s;if(s.teacher){root.hidden=true;return;}loadContext(s);root.hidden=false;
    root.innerHTML=`<div><strong>Feedback from me</strong><span data-live-status role="status">${active?'Connected to your class':'Not connected · your notebook still saves on this device'}</span></div><div>${active?'<button data-live="save">Send latest work</button><button data-live="pause">Pause sharing</button>':`<button data-live="connect">${binding?'Resume sharing':'Connect to my class'}</button>`}</div><p class="small">When connected, I can see your typed answers, revision scores and reflections. Photos stay on this device: show me your paper or submit your PDF to Teams.</p>`;
    root.querySelector('[data-live="connect"]')?.addEventListener('click',connect);
    root.querySelector('[data-live="pause"]')?.addEventListener('click',()=>{active=false;clearInterval(poller);clearTimeout(timer);attach(latest);});
    root.querySelector('[data-live="save"]')?.addEventListener('click',()=>flush());
    renderFeedback();
  }
  async function connect(){
    if(!latest?.name||latest.teacher||connecting)return;
    if(binding&&uuid.test(invitation.room||'')&&binding.room!==invitation.room){say('This device notebook is connected to a different class session. Open its original class link, or ask me before starting a new notebook. Your saved work has not been moved.');return;}
    if(!binding){
      let room=invitation.room,join=invitation.join,notebook=invitation.notebook;
      if(!uuid.test(room||'')||(join!==null&&!(/^[0-9a-f]{64}$/).test(join||''))||notebook!==cfg.notebookId){
        const answer=prompt('Paste the permanent class link or invitation I have shared with you.');if(!answer)return;
        try{const u=new URL(answer.trim());const p=new URLSearchParams(u.hash.slice(1));room=p.get('room');join=p.get('join');notebook=p.get('notebook');}catch{say('Paste the complete class invitation link.');return;}
      }
      if(notebook!==cfg.notebookId){say('This is not the systems-revision class link. Ask me for the link from this lesson’s dashboard.');return;}
      if(!uuid.test(room||'')||(join!==null&&!(/^[0-9a-f]{64}$/).test(join||''))){say('This class link is incomplete. Ask me for the complete link.');return;}
      if(!confirm(`Connect ${latest.name} (${latest.className})? Your name, typed work and confidence entries in this notebook will be shared privately with me through Supabase. Photos are not shared.`))return;
      binding={room,join,permalink:join===null,learner:crypto.randomUUID(),key:C.token(),registered:false};
      if(!store()){binding=null;return;}
    }
    const ctx=contextKey,target=binding;connecting=true;say('Connecting…');
    try{
      const args={p_room:target.room,p_lesson:cfg.lessonId,p_learner:target.learner,p_key:target.key,p_name:latest.name,p_class:latest.className};
      if(target.permalink&&!target.registered)await C.rpc(client,'review_join_permalink',args);
      else await C.rpc(client,'review_join',{...args,p_join_token:target.join||null});
      if(ctx!==contextKey)return;
      binding.registered=true;delete binding.join;store();
      const data=await C.rpc(client,'review_student_load',{p_learner:binding.learner,p_key:binding.key});
      if(ctx!==contextKey)return;
      feedback=data.feedback||[];
      for(const a of data.answers||[]){versions[a.field_id]=a.revision;statuses[a.field_id]=a.status;if(a.field_id==='_progress')continue;const local=latest.fields[a.field_id];if(local===undefined){window.ReviewNotebook.restoreField(a.field_id,a.value);synced[a.field_id]=JSON.stringify(a.value);}else if(JSON.stringify(local)===JSON.stringify(a.value)){synced[a.field_id]=JSON.stringify(local);}else if(synced[a.field_id]!==undefined&&synced[a.field_id]!==JSON.stringify(a.value)){conflicts[a.field_id]=a;} }
      active=true;store();attach(window.ReviewNotebook.info());flush();
      clearInterval(poller);poller=setInterval(()=>{if(!document.hidden)pollFeedback();},cfg.feedbackInterval);pollFeedback();
    }catch(e){if(ctx===contextKey)say('Could not connect: '+e.message+'. Your work remains on this device.');}finally{connecting=false;}
  }
  function changed(s){latest=s;if(!active||s.teacher)return;clearTimeout(timer);timer=setTimeout(flush,Math.max(100,cfg.saveInterval-(Date.now()-lastSent)));}
  async function flush(){
    if(!active||inflight||!binding||!latest||latest.teacher)return;
    const changes=responseFields().filter(([id,v])=>!conflicts[id]&&(synced[id]!==JSON.stringify(v)||pendingStatuses[id])).slice(0,40).map(([id,value])=>({field_id:id,label:String(id==='_progress'?'Current lesson page':latest.labels[id]||id).slice(0,240),value,revision:versions[id]||0,stage:latest.stageTitle||'',...(pendingStatuses[id]?{status:pendingStatuses[id]}:{})}));
    if(!changes.length){say(Object.keys(conflicts).length?'A response changed on another device. Choose which copy to keep below.':'Latest work shared · '+new Date(lastSent||Date.now()).toLocaleTimeString());return;}
    const ctx=contextKey;inflight=true;lastSent=Date.now();say('Sharing latest changes…');
    try{
      const result=await C.rpc(client,'review_save',{p_learner:binding.learner,p_key:binding.key,p_changes:changes});
      if(ctx!==contextKey)return;
      for(const a of result){const sent=changes.find(x=>x.field_id===a.field_id);if(a.conflict){conflicts[a.field_id]=a;continue;}versions[a.field_id]=a.revision;statuses[a.field_id]=a.status;synced[a.field_id]=JSON.stringify(sent.value);if(pendingStatuses[a.field_id]===sent.status)delete pendingStatuses[a.field_id];}
      store();say('Latest changes shared · '+new Date().toLocaleTimeString());renderFeedback();
    }catch(e){if(ctx===contextKey)say('Not shared yet: '+e.message+'. Your local work is safe; I will retry.');}
    finally{inflight=false;if(active){clearTimeout(timer);timer=setTimeout(flush,cfg.saveInterval);}}
  }
  async function pollFeedback(){if(!active||!navigator.onLine)return;const ctx=contextKey;try{const data=await C.rpc(client,'review_student_feedback',{p_learner:binding.learner,p_key:binding.key,p_known:feedback.map(f=>f.id).slice(-1000)});if(ctx!==contextKey)return;const all=new Map(feedback.map(f=>[f.id,f]));for(const f of data.feedback||[])all.set(f.id,f);feedback=[...all.values()].sort((a,b)=>a.created_at.localeCompare(b.created_at));for(const a of data.statuses||[])if(!pendingStatuses[a.field_id])statuses[a.field_id]=a.status;store();renderFeedback();}catch{if(ctx===contextKey)say('Feedback connection interrupted. Your notebook still saves locally.');}}
  function renderFeedback(){
    document.querySelectorAll('.live-field-tools').forEach(e=>e.remove());
    if(!active)return;
    const seen=new Set();
    document.querySelectorAll('#content [data-field],#content [data-add-row]').forEach(el=>{
      const id=el.dataset.field||el.dataset.addRow;if(seen.has(id)||id.startsWith('reveal-')||!(el.tagName==='TEXTAREA'||el.dataset.addRow||feedback.some(f=>f.field_id===id)||conflicts[id]))return;seen.add(id);
      const box=document.createElement('div');box.className='live-field-tools';box.dataset.forField=id;
      const rows=feedback.filter(f=>f.field_id===id);const last=rows[rows.length-1];
      box.innerHTML=`<div class="live-tools"><button data-request="help">I need help here</button><button data-request="review">Ready for your check</button><span>${esc(({help:'Help requested',review:'Waiting for my check',revised:'Revised after feedback',confirmed:'Checked by me'})[statuses[id]]||'')}</span></div>${last?`<div class="live-comment"><strong>${last.verdict==='confirmed'?'Checked by me':'My feedback'}</strong><p>${esc(last.comment)}</p><small>${new Date(last.created_at).toLocaleString()} · answer version ${last.answer_revision}</small><details><summary>Answer I reviewed</summary><pre>${esc(C.value(last.answer_snapshot))}</pre></details>${versions[id]>last.answer_revision?'<p>You have changed this answer since my feedback. Ask me to check the improved version.</p>':''}</div>`:''}${conflicts[id]?`<div class="live-conflict"><strong>Another copy has changed</strong><pre>${esc(C.value(conflicts[id].value))}</pre><button data-conflict="remote">Use this cloud copy</button><button data-conflict="local">Keep my current answer</button></div>`:''}`;
      el.insertAdjacentElement('afterend',box);
      box.querySelectorAll('[data-request]').forEach(b=>b.onclick=()=>{if(latest.fields[id]===undefined)window.ReviewNotebook.restoreField(id,'');pendingStatuses[id]=b.dataset.request;statuses[id]=b.dataset.request;renderFeedback();flush();});
      box.querySelectorAll('[data-conflict]').forEach(b=>b.onclick=()=>{const a=conflicts[id];versions[id]=a.revision;synced[id]=JSON.stringify(a.value);if(b.dataset.conflict==='remote')window.ReviewNotebook.restoreField(id,a.value);delete conflicts[id];store();window.ReviewNotebook.refresh();flush();});
    });
  }
  window.LiveReview={attach,changed,feedback:()=>feedback.slice(),exportFeedback:()=>feedback.map(f=>({label:latest?.labels[f.field_id]||f.field_id,...f}))};
  window.addEventListener('online',()=>{if(active){flush();pollFeedback();}});
  window.addEventListener('visibilitychange',()=>{if(!document.hidden&&active){flush();pollFeedback();}});
  // No unload upload: the locally saved notebook is retried on the next connection.
})();
