/* Classroom transport only. Lesson answers, code and identities never enter it. */
(() => {
  'use strict';
  const root = document.getElementById('classroom-root');
  const lesson = window.LessonClassroom;
  if (!root || !lesson) return;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const info = () => lesson.info();
  const words = (en, ms, zh) => ({en, ms, zh})[info().lang] || en;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pick = (en, ms, zh) => escape(words(en, ms, zh));
  const classId = window.CLASSROOM_ROUTE?.classId?.toLowerCase();
  const permanent = window.CLASSROOM_ROUTE?.permanent && uuid.test(classId || '');
  if (!permanent) return;
  const lessonId = 'year8-week5-project';
  const classArgs = () => ({p_class_id:classId,p_lesson:lessonId});
  let room = null, discovery, discovering = false;
  let client, sdkLoading, channel, roster, generation = 0, poll, expiryTimer;
  let current = null, deadline = Infinity, lastBring = -1, allowed = false;
  let open = info().teacher, busy = false, checking = false;
  let controlReady = false, presenceReady = false, count = null, message = '', bad = false;
  let refreshing = false, authSubscription;
  const locked = () => !info().teacher && Boolean(current?.locked);
  // This guard is for classroom pacing; the Supabase rules enforce privileges.
  window.ClassroomMode = Object.freeze({locked,sendSlide:async id=>{if(!allowed||!current||!window.TeacherPresentation?.ids().includes(id))return false;return action('bring',id);}});
  function say(en, ms, zh, error = false) {message = words(en, ms, zh); bad = error; render();}
  function button(cmd, label, disabled = false, primary = false) {
    return `<button type="button" data-cm="${cmd}" ${disabled?'disabled':''} class="${primary?'primary':''}">${label}</button>`;
  }
  function sessionLink() {
    const url = new URL(location.href);
    url.search = ''; url.hash = ''; // Share the plain lesson URL, never a Teams tracking ID.
    return url.href;
  }
  function teacherLink() {const url=new URL(sessionLink());url.searchParams.set('teacher','1');return url.href;}
  function linkField() {return `<label>${pick('Permanent student link','Pautan murid kekal','固定学生链接')}<input class="cm-link" readonly value="${escape(sessionLink())}" aria-label="${pick('Student classroom link','Pautan kelas murid','学生课堂链接')}"></label>`;}
  function guardNavigation() {
    document.querySelectorAll('[data-step],#prev,#next,#switch,#restore,#confirmRestore').forEach(el => {
      el.classList.toggle('cm-nav-locked', locked());
      if (locked()) {
        if (!el.hasAttribute('data-cm-disabled')) el.dataset.cmDisabled = String(Boolean(el.disabled));
        if ('disabled' in el) el.disabled = true;
        el.setAttribute('aria-disabled','true');
      } else if (el.hasAttribute('data-cm-disabled')) {
        if ('disabled' in el) el.disabled = el.dataset.cmDisabled === 'true';
        delete el.dataset.cmDisabled; el.removeAttribute('aria-disabled');
      }
    });
  }
  function render(force = false) {
    guardNavigation();
    // Presence changes must never erase a password or join link being typed.
    if (!force && root.contains(document.activeElement) && document.activeElement.matches('input')) return;
    const connected = controlReady && presenceReady;
    const status = current ? (connected ? (locked() || current.locked ? words('Navigation locked','Navigasi dikunci','页面切换已锁定') : words('Self-paced','Ikut kadar sendiri','自主学习')) : words('Reconnecting…','Menyambung semula…','正在重新连接…')) : words('Self-paced · waiting for teacher','Ikut kadar sendiri · menunggu guru','自主学习 · 等待老师');
    let body = '';
    if (open && info().teacher) {
      if (!allowed) body = `<form id="cm-login"><h2>${pick('Teacher sign-in','Log masuk guru','教师登录')}</h2><p>${pick('Use the teacher login you created in Supabase.','Gunakan log masuk guru yang dibuat dalam Supabase.','使用你在 Supabase 创建的教师账户。')}</p><label>${pick('Email','E-mel','电子邮箱')}<input type="email" name="email" autocomplete="username" required></label><label>${pick('Password','Kata laluan','密码')}<input type="password" name="password" autocomplete="current-password" required></label><button class="primary" ${busy?'disabled':''}>${pick('Sign in','Log masuk','登录')}</button></form>`;
      else if (!current) body = `<h2>${pick('Your classroom','Bilik darjah anda','你的课堂')}</h2><p>${pick('Share this permanent link before the lesson. Start classroom connects open student pages automatically, usually within 10 seconds. End classroom restores self-paced study. Sessions last up to two hours.','Kongsi pautan kekal ini sebelum pelajaran. Mulakan kelas menyambung halaman murid secara automatik, biasanya dalam 10 saat. Tamatkan kelas memulihkan pembelajaran kendiri. Sesi sehingga dua jam.','课前即可分享此固定链接。开始课堂后，已打开的学生页面通常在 10 秒内自动连接。结束课堂后恢复自主学习。每次课堂最长两小时。')}</p>${linkField()}<div class="cm-actions">${button('copy',pick('Copy link','Salin pautan','复制链接'))}${button('start',pick('Start classroom','Mulakan kelas','开始课堂'),busy,true)}${button('signout',pick('Sign out','Log keluar','退出登录'),busy)}</div>`;
      else body = `<h2>${pick('Live classroom','Kelas langsung','实时课堂')}</h2><p><strong class="cm-count">${presenceReady && count !== null ? count : '—'}</strong> ${pick('anonymous browsers connected','pelayar tanpa nama tersambung','个匿名浏览器已连接')}<span class="cm-small">${pick('A device estimate; multiple tabs in the same browser count once. You are excluded.','Anggaran peranti; beberapa tab pelayar sama dikira sekali. Guru tidak dikira.','同一浏览器的多个标签页计为一个，不包含教师。此数值是设备数量的估计。')}</span></p>${linkField()}<div class="cm-actions">${button('copy',pick('Copy link','Salin pautan','复制链接'))}${button('lock',pick('Lock navigation','Kunci navigasi','锁定页面切换'),busy||current.locked)}${button('bring',pick('Bring Everyone Here','Bawa Semua ke Sini','带所有人到此页'),busy,true)}${button('unlock',pick('Unlock / Self-Paced','Buka / Ikut kadar sendiri','解锁／自主学习'),busy||!current.locked)}${button('end',pick('End classroom','Tamatkan kelas','结束课堂'),busy)}</div><p class="cm-small">${pick('Bring Everyone Here moves students to:','Bawa Semua ke Sini mengalih murid ke:','“带所有人到此页”将移动到：')} <b>${escape(lesson.label())}</b></p><p class="cm-small">${pick('Lock pauses page changes. Students can still answer questions and answer questions and continue their badge work. Bring moves them once; Unlock restores navigation.','Kunci menghentikan pertukaran halaman. Murid masih boleh menjawab dan meneruskan kerja lencana. Bawa memindahkan sekali; Buka memulihkan navigasi.','锁定后仍可答题和继续完成徽章任务。“带到此页”只移动一次，“解锁”恢复自主切换。')}</p>`;
    } else if (open && current) {
      body = `<p>${locked()?pick('Your teacher has paused page navigation. Keep working here; you can still answer and run Python.','Guru mengunci navigasi. Teruskan menjawab dan menjalankan Python di sini.','老师已暂停页面切换。你仍可在本页答题和运行 Python。'):pick('Choose lesson pages yourself. Your teacher can bring everyone to a shared page.','Pilih halaman sendiri. Guru boleh membawa semua ke halaman yang sama.','可以自主选择课程页面。老师也可以带大家到同一页。')}</p><p class="cm-small">${pick('Only a temporary random connection ID is shared. Your name, answers and code are not sent to Supabase.','Hanya ID rawak sementara dikongsi. Nama, jawapan dan kod tidak dihantar ke Supabase.','仅分享临时随机连接编号，不向 Supabase 发送姓名、答案或代码。')}</p>`;
    } else if (open && !info().teacher) {
      body = `<p>${pick('Study at your own pace. This page will connect automatically when your teacher starts the classroom. Keep using the same link.','Belajar mengikut kadar sendiri. Halaman ini akan bersambung secara automatik apabila guru memulakan kelas. Gunakan pautan yang sama.','现在可以自主学习。老师开始课堂时，此页面会自动连接。继续使用同一个链接。')}</p><p class="cm-small">${pick('Your name and class stay in this browser for your PDF. They are not sent to Supabase.','Nama dan kelas disimpan dalam pelayar untuk PDF, bukan dihantar ke Supabase.','姓名和班级仅保存在此浏览器，用于 PDF，不发送到 Supabase。')}</p><a href="${escape(teacherLink())}">${pick('Teacher sign-in','Log masuk guru','教师登录')}</a>`;
    }
    if(open && info().teacher && allowed) body += `<div class="cm-presentation"><h3>Teacher presentation</h3><p class="cm-small">Preview TTA slides and three facts. Use Bring everyone to this slide to show one on student devices.</p>${button('presentation','Open teacher presentation')}</div>`;
    root.innerHTML = `<div class="cm-bar"><div><strong>${pick('Classroom','Bilik darjah','课堂')}</strong> <span class="cm-status ${current&&!connected?'pending':''}">${escape(status)}</span></div><div class="cm-actions">${!info().teacher?`<a href="${escape(teacherLink())}">${pick('Teacher sign-in','Log masuk guru','教师登录')}</a>`:''}${button('toggle',open?pick('Hide panel','Sembunyikan panel','收起面板'):pick('Open panel','Buka panel','打开面板'))}</div></div>${open?`<section class="cm-panel" aria-label="${pick('Classroom controls','Kawalan kelas','课堂控制')}">${body}</section>`:''}<p class="cm-message ${bad?'cm-error':''}" role="status" aria-live="polite">${escape(message)}</p>`;
  }
  async function loadSDK() {
    if (window.supabase?.createClient) return;
    if (!sdkLoading) sdkLoading = new Promise((resolve,reject) => {
      const tag = document.createElement('script');
      tag.src = 'vendor/supabase.js'; tag.onload = resolve;
      tag.onerror = () => {sdkLoading=null;tag.remove();reject(Error('SDK unavailable'));};
      document.head.append(tag);
    });
    await sdkLoading;
  }
  async function ensureClient() {
    if (client) return client;
    await loadSDK();
    const cfg = window.CLASSROOM_CONFIG;
    if (!cfg?.url?.startsWith('https://') || !cfg.publishableKey?.startsWith('sb_publishable_')) throw Error('Configuration missing');
    client = window.supabase.createClient(cfg.url,cfg.publishableKey,{
      auth:{persistSession:info().teacher,storage:info().teacher?sessionStorage:undefined,storageKey:'helpdesk-classroom-teacher',autoRefreshToken:info().teacher,detectSessionInUrl:false},
    });
    if (info().teacher) authSubscription=client.auth.onAuthStateChange(event => {
      if(event==='SIGNED_OUT') setTimeout(()=>{allowed=false;disconnect();render(true);},0);
    });
    return client;
  }
  async function rpc(name,args={}) {
    const api = await ensureClient();
    const {data,error} = await api.rpc(name,args).abortSignal(AbortSignal.timeout(12000));
    if (error) throw error;
    return data;
  }
  function valid(snapshot) {
    return snapshot && snapshot.version===1 && snapshot.lesson===lessonId && snapshot.class_id===classId && snapshot.session_id===room && lesson.pages().includes(snapshot.stage) && typeof snapshot.locked==='boolean' && typeof snapshot.ended==='boolean' && Number.isSafeInteger(snapshot.revision) && snapshot.revision>=0 && Number.isSafeInteger(snapshot.bring_revision) && snapshot.bring_revision>=0 && snapshot.bring_revision<=snapshot.revision && Number.isFinite(Date.parse(snapshot.expires_at)) && Number.isFinite(Date.parse(snapshot.server_now));
  }
  function rememberBring() {try{sessionStorage.setItem('cm-bring:'+room,String(lastBring));}catch{}}
  function accept(snapshot, authoritative=false) {
    if(!valid(snapshot) || (current && snapshot.revision<current.revision)) return;
    if(snapshot.ended){endLocally();return;}
    if(authoritative){
      const remaining=Math.min(7200000,Date.parse(snapshot.expires_at)-Date.parse(snapshot.server_now));
      deadline=Math.min(deadline,performance.now()+remaining);
      clearTimeout(expiryTimer);expiryTimer=setTimeout(endLocally,Math.max(0,deadline-performance.now()));
      if(remaining<=0){endLocally();return;}
    }
    current=snapshot;
    if(!info().teacher){
      if(snapshot.bring_revision>lastBring && snapshot.bring_revision>0) lesson.move(snapshot.stage);
      else if(snapshot.locked && info().entry) lesson.move(snapshot.stage);
      lastBring=Math.max(lastBring,snapshot.bring_revision);rememberBring();
    }
    render();
  }
  function clearTimers(){clearInterval(poll);clearTimeout(expiryTimer);poll=null;expiryTimer=null;}
  function disconnect() {
    generation++;clearTimers();
    const old=[channel,roster].filter(Boolean);channel=null;roster=null;
    if(client) for(const ch of old) client.removeChannel(ch).catch(()=>{});
    current=null;controlReady=false;presenceReady=false;count=null;deadline=Infinity;
    guardNavigation();
  }
  function endLocally() {
    const oldRoom=room;
    disconnect();room=null;lastBring=-1;lesson.clearTarget();
    try{sessionStorage.removeItem('cm-bring:'+oldRoom);localStorage.removeItem('cm-device:'+oldRoom);}catch{}
    // Keep the permanent URL and local notebook. Discovery remains active.
    say('Classroom ended. Continue at your own pace using this same link. Your name and work are still here.','Kelas tamat. Teruskan mengikut kadar sendiri dengan pautan sama. Nama dan kerja anda masih di sini.','课堂已结束，继续用此链接自主学习。你的姓名和作品仍保留在这里。');
  }
  function readDeviceKey() {
    let id=crypto.randomUUID();
    try {
      for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key?.startsWith('cm-device:')){let value;try{value=JSON.parse(localStorage.getItem(key));}catch{}if(!value||value.expires<=Date.now())localStorage.removeItem(key);}}
      const key='cm-device:'+room, saved=JSON.parse(localStorage.getItem(key)||'null');
      if(uuid.test(saved?.id||'') && saved.expires>Date.now()) id=saved.id;
      localStorage.setItem(key,JSON.stringify({id,expires:Date.now()+Math.max(0,deadline-performance.now())}));
    } catch {} // blocked storage falls back to one ephemeral ID per tab
    return id;
  }
  async function deviceKey() {
    // Coordinate simultaneous tabs where Web Locks are available.
    if(navigator.locks?.request)return navigator.locks.request('cm-device:'+room,readDeviceKey);
    return readDeviceKey();
  }
  async function refresh() {
    if(!room||!current||refreshing)return;
    const target=room,run=generation;refreshing=true;
    try {
      const snapshot=await rpc('classroom_class_snapshot',classArgs());
      if(run!==generation||room!==target)return;
      if(snapshot===null){endLocally();return;}
      if(snapshot.session_id!==room){await attach(snapshot);return;}
      accept(snapshot,true);
    } catch {
      if(run===generation) say('Connection interrupted. Retrying; your work stays in this browser.','Sambungan terganggu. Mencuba semula; kerja kekal dalam pelayar.','连接中断，正在重试。作品仍保存在此浏览器。',true);
    } finally {refreshing=false;}
  }
  async function discover() {
    if(info().teacher || discovering || current || document.hidden)return;
    discovering=true;
    try {
      const snapshot=await rpc('classroom_class_snapshot',classArgs());
      if(snapshot && !current){await attach(snapshot);message='';bad=false;render();}
      else if(!snapshot){message='';bad=false;render();}
    } catch {
      say('Live classroom is unavailable. Keep studying at your own pace; this page will retry automatically.','Kelas langsung tidak tersedia. Teruskan belajar sendiri; halaman akan mencuba semula.','实时课堂暂不可用。可以继续自主学习，此页会自动重试。',true);
    } finally {discovering=false;}
  }
  async function attach(snapshot) {
    const previousRoom=room;room=snapshot?.session_id;
    if(!valid(snapshot)){room=previousRoom;throw Error('Invalid session');}
    disconnect();room=snapshot.session_id;
    const run=generation;
    lastBring=-1;
    if(!info().teacher)try{const previous=sessionStorage.getItem('cm-bring:'+room);if(previous!==null&&/^\d+$/.test(previous))lastBring=Number(previous);}catch{}
    accept(snapshot,true);
    if(!current)return;
    const api=await ensureClient();
    if(run!==generation)return;
    channel=api.channel(`classroom:${room}:control`,{config:{private:true,broadcast:{ack:true}}});
    channel.on('broadcast',{event:'state'},({payload})=>{if(run===generation)accept(payload);});
    channel.subscribe(status=>{
      if(run!==generation)return;
      controlReady=status==='SUBSCRIBED';
      if(controlReady){message='';bad=false;void refresh();}
      render();
    });
    const presenceConfig=info().teacher?{}:{presence:{key:await deviceKey()}};
    if(run!==generation)return;
    roster=api.channel(`classroom:${room}:presence`,{config:{private:true,...presenceConfig}});
    const thisRoster=roster;
    if(info().teacher)roster.on('presence',{event:'sync'},()=>{
      if(run!==generation)return;
      count=Object.entries(thisRoster.presenceState()).filter(([key,items])=>uuid.test(key)&&Array.isArray(items)&&items.length>0).length;
      render();
    });
    roster.subscribe(async status=>{
      if(run!==generation)return;
      presenceReady=status==='SUBSCRIBED';
      if(presenceReady&&!info().teacher){
        let result;try{result=await thisRoster.track({v:1});}catch{result='error';}
        if(run!==generation)return;
        presenceReady=result==='ok';
      }
      if(!presenceReady)count=null;
      render();
    });
    poll=setInterval(()=>void refresh(),10000);
    render();
  }
  async function recoverTeacher() {
    if(checking)return;checking=true;
    try {
      const api=await ensureClient();
      const {data}=await api.auth.getSession();
      if(!data.session)return;
      allowed=(await rpc('classroom_is_teacher'))===true;
      if(!allowed){await api.auth.signOut({scope:'local'});throw Object.assign(Error('Not a teacher'),{code:'teacher_not_approved'});}
      const saved=await rpc('classroom_class_current',classArgs());
      if(saved){room=saved.session_id;if(!valid(saved))throw Error('Invalid session');await attach(saved);}
    } finally {checking=false;render(true);}
  }
  async function action(cmd,stage=null) {
    if(busy||!allowed)return false;
    busy=true;render();
    try {
      if(cmd==='start'){
        const snapshot=await rpc('classroom_class_start',{...classArgs(),p_stage:info().page});
        room=snapshot.session_id;if(!valid(snapshot))throw Error('Invalid session');
        await attach(snapshot);message='';
      } else if(cmd==='signout'){
        if(current)return;
        await client.auth.signOut({scope:'local'});allowed=false;disconnect();
      } else if(current && ['lock','bring','unlock','end'].includes(cmd)){
        const snapshot=await rpc('classroom_control',{p_session_id:room,p_action:cmd,p_expected_revision:current.revision,p_stage:cmd==='bring'?(stage||info().page):null});
        const outgoing=channel;
        // The RPC result is authoritative; a failed broadcast is recovered by polling.
        let sent=false;
        if(outgoing)try{sent=(await outgoing.send({type:'broadcast',event:'state',payload:snapshot}))==='ok';}catch{}
        accept(snapshot,true);
        if(!sent&&cmd!=='end')say('Saved. Some browsers may take up to 10 seconds to catch up.','Disimpan. Sesetengah pelayar mungkin mengambil sehingga 10 saat.','已保存。部分浏览器可能需要最多 10 秒同步。');
        else if(cmd!=='end'){message='';bad=false;}
      }
      return true;
    } catch(error) {
      await refresh();
      say(error.code==='40001'?'Another command arrived first. Check the current state, then try again.':'Could not complete the action. Check your connection and teacher sign-in.','Tindakan tidak selesai. Semak sambungan dan log masuk guru.','操作未完成。请检查网络及教师登录状态。',true);
      return false;
    } finally {busy=false;render(true);}
  }
  function signInFailure(error, phase) {
    const code=String(error?.code||'');
    const detail=code ? ` [${code.replace(/[^a-zA-Z0-9_]/g,'').slice(0,60)}]` : '';
    if(code==='invalid_credentials')
      say('Supabase rejected the email or password. Use your classroom teacher account, not your Supabase dashboard login.','Supabase menolak e-mel atau kata laluan. Gunakan akaun guru kelas, bukan log masuk papan pemuka Supabase.','邮箱或密码不正确。请使用课堂教师账户，而不是 Supabase 控制台账户。',true);
    else if(code==='teacher_not_approved')
      say('Your email and password worked, but this account is not approved as a classroom teacher.','E-mel dan kata laluan betul, tetapi akaun ini belum diluluskan sebagai guru kelas.','邮箱和密码正确，但此账户尚未获准担任课堂教师。',true);
    else if(phase==='permissions')
      say('Your email and password worked, but classroom permissions could not be checked. Share this error code with the person setting up Classroom Mode.'+detail,'Log masuk berjaya, tetapi kebenaran kelas tidak dapat disemak. Kongsi kod ralat ini dengan penyedia Mod Kelas.'+detail,'登录成功，但无法检查课堂权限。请将此错误代码告知课堂模式设置人员。'+detail,true);
    else
      say('Could not complete Supabase sign-in. Check your connection and try again. If it continues, share this error code.'+detail,'Log masuk Supabase tidak selesai. Semak sambungan dan cuba lagi. Jika berterusan, kongsi kod ralat ini.'+detail,'无法完成 Supabase 登录。请检查网络后重试。如仍失败，请提供此错误代码。'+detail,true);
  }
  root.addEventListener('submit',async event=>{
    event.preventDefault();
    if(event.target.id==='cm-login'&&!busy){
      const form=new FormData(event.target),email=String(form.get('email')).trim(),password=String(form.get('password'));
      event.target.elements.password.value='';busy=true;render(true);
      let phase='authentication';
      try {
        const api=await ensureClient();
        const {error}=await api.auth.signInWithPassword({email,password});
        if(error)throw error;
        phase='permissions';
        await recoverTeacher();
        say('Teacher sign-in confirmed.','Log masuk guru disahkan.','教师登录已验证。');
      } catch(error) {allowed=false;signInFailure(error,phase);}
      finally{busy=false;render(true);}
    }
  });
  root.addEventListener('click',async event=>{
    const el=event.target.closest('[data-cm]');if(!el||el.disabled)return;
    const cmd=el.dataset.cm;
    if(cmd==='presentation'&&allowed&&info().teacher){
      try{if(!window.TeacherPresentation)await new Promise((resolve,reject)=>{const tag=document.createElement('script');tag.src='teacher-presentation.js?v=2';tag.onload=resolve;tag.onerror=()=>{tag.remove();reject(Error('Presentation unavailable'));};document.head.append(tag);});window.TeacherPresentation.open();}catch{say('Could not load the presentation. Check your connection and try again.','Tidak dapat memuatkan pembentangan. Cuba lagi.','无法加载演示，请重试。',true);}return;
    }
    if(cmd==='toggle'){open=!open;render(true);}
    else if(cmd==='copy'){
      try{await navigator.clipboard.writeText(sessionLink());say('Link copied. Share it with this class.','Pautan disalin. Kongsi dengan kelas ini.','链接已复制，请分享给本班学生。');}
      catch{root.querySelector('.cm-link')?.select();say('Select and copy the classroom link above.','Pilih dan salin pautan di atas.','请选择并复制上方链接。');}
    }
    else await action(cmd);
  });
  document.addEventListener('click',event=>{
    if(locked()&&event.target.closest('[data-page],[data-action="home"],[data-home],[data-action="legacy"]')){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  document.addEventListener('change',event=>{
    if(locked()&&event.target.matches('[data-restore]')){event.preventDefault();event.stopImmediatePropagation();event.target.value='';say('Load a backup after your teacher unlocks navigation.','Muatkan sandaran selepas guru membuka navigasi.','请等老师解锁后再导入备份。');}
  },true);
  window.addEventListener('lesson:render',()=>render());
  window.addEventListener('online',()=>{void refresh();void discover();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){void refresh();void discover();}});
  window.addEventListener('pagehide',()=>{clearInterval(discovery);disconnect();});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
  render();
  if(info().teacher){
    recoverTeacher().catch(()=>{allowed=false;say('Sign in with the approved teacher for this class. If setup is not installed yet, run the permanent-classroom SQL first.','Log masuk sebagai guru kelas ini. Jika persediaan belum dipasang, jalankan SQL kelas kekal dahulu.','请用本班已授权教师账户登录。如尚未安装，请先运行固定课堂 SQL。',true);});
  } else {
    void discover();
    discovery=setInterval(()=>void discover(),10000);
  }
})();
