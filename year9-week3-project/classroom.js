/* Classroom transport only. Lesson answers, code and identities never enter it. */
(() => {
  'use strict';
  const root = document.getElementById('classroom-root');
  const lesson = window.LessonClassroom;
  if (!root || !lesson) return;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(new URLSearchParams(location.search).get('classId')||'')) return;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const info = () => lesson.info();
  const words = (en, ms, zh) => ({en, ms, zh})[info().lang] || en;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pick = (en, ms, zh) => escape(words(en, ms, zh));
  const requested = new URLSearchParams(location.hash.slice(1)).get('classroom');
  let room = !info().teacher && uuid.test(requested || '') ? requested.toLowerCase() : null;
  let client, sdkLoading, channel, roster, generation = 0, poll, expiryTimer;
  let current = null, deadline = Infinity, lastBring = -1, allowed = false;
  let open = Boolean(room || info().teacher), busy = false, checking = false;
  let controlReady = false, presenceReady = false, count = null, message = '', bad = false;
  let refreshing = false, authSubscription;
  const locked = () => !info().teacher && Boolean(current?.locked);
  // This guard is for classroom pacing; the Supabase rules enforce privileges.
  window.ClassroomMode = Object.freeze({locked});
  function say(en, ms, zh, error = false) {message = words(en, ms, zh); bad = error; render();}
  function button(cmd, label, disabled = false, primary = false) {
    return `<button type="button" data-cm="${cmd}" ${disabled?'disabled':''} class="${primary?'primary':''}">${label}</button>`;
  }
  function sessionLink() {
    const url = new URL(location.href);
    url.search = ''; url.hash = `classroom=${room}`;
    return url.href;
  }
  function teacherLink() {const url=new URL(location.href);url.search='?teacher=1';url.hash='';return url.href;}
  function guardNavigation() {
    document.querySelectorAll('[data-page],[data-action="home"],[data-home]').forEach(el => {
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
    const status = current ? (connected ? (locked() || current.locked ? words('Navigation locked','Navigasi dikunci','页面切换已锁定') : words('Self-paced','Ikut kadar sendiri','自主学习')) : words('Reconnecting…','Menyambung semula…','正在重新连接…')) : words('Classroom Mode','Mod Bilik Darjah','课堂模式');
    let body = '';
    if (open && info().teacher) {
      if (!allowed) body = `<form id="cm-login"><h2>${pick('Teacher sign-in','Log masuk guru','教师登录')}</h2><p>${pick('Use the teacher login you created in Supabase.','Gunakan log masuk guru yang dibuat dalam Supabase.','使用你在 Supabase 创建的教师账户。')}</p><label>${pick('Email','E-mel','电子邮箱')}<input type="email" name="email" autocomplete="username" required></label><label>${pick('Password','Kata laluan','密码')}<input type="password" name="password" autocomplete="current-password" required></label><button class="primary" ${busy?'disabled':''}>${pick('Sign in','Log masuk','登录')}</button></form>`;
      else if (!current) body = `<h2>${pick('Your classroom','Bilik darjah anda','你的课堂')}</h2><p>${pick('Start a session, then share its link with students. No student sign-in is needed. Sessions last up to two hours.','Mulakan sesi dan kongsi pautannya. Murid tidak perlu log masuk. Sesi berlangsung sehingga dua jam.','开始课堂后分享链接。学生无需登录，课堂最长持续两小时。')}</p><div class="cm-actions">${button('start',pick('Start classroom','Mulakan kelas','开始课堂'),busy,true)}${button('signout',pick('Sign out','Log keluar','退出登录'),busy)}</div>`;
      else body = `<h2>${pick('Live classroom','Kelas langsung','实时课堂')}</h2><p><strong class="cm-count">${presenceReady && count !== null ? count : '—'}</strong> ${pick('anonymous browsers connected','pelayar tanpa nama tersambung','个匿名浏览器已连接')}<span class="cm-small">${pick('A device estimate; multiple tabs in the same browser count once. You are excluded.','Anggaran peranti; beberapa tab pelayar sama dikira sekali. Guru tidak dikira.','同一浏览器的多个标签页计为一个，不包含教师。此数值是设备数量的估计。')}</span></p><label>${pick('Student classroom link','Pautan kelas murid','学生课堂链接')}<input class="cm-link" readonly value="${escape(sessionLink())}" aria-label="${pick('Student classroom link','Pautan kelas murid','学生课堂链接')}"></label><div class="cm-actions">${button('copy',pick('Copy link','Salin pautan','复制链接'))}${button('lock',pick('Lock navigation','Kunci navigasi','锁定页面切换'),busy||current.locked)}${button('bring',pick('Bring Everyone Here','Bawa Semua ke Sini','带所有人到此页'),busy,true)}${button('unlock',pick('Unlock / Self-Paced','Buka / Ikut kadar sendiri','解锁／自主学习'),busy||!current.locked)}${button('end',pick('End classroom','Tamatkan kelas','结束课堂'),busy)}</div><p class="cm-small">${pick('Bring Everyone Here moves students to:','Bawa Semua ke Sini mengalih murid ke:','“带所有人到此页”将移动到：')} <b>${escape(lesson.label())}</b></p><p class="cm-small">${pick('Lock pauses page changes. Students can still answer questions and run Python. Bring moves them once; Unlock restores navigation.','Kunci menghentikan pertukaran halaman. Murid masih boleh menjawab dan menjalankan Python. Bawa memindahkan sekali; Buka memulihkan navigasi.','锁定后仍可答题和运行 Python。“带到此页”只移动一次，“解锁”恢复自主切换。')}</p>`;
    } else if (open && current) {
      body = `<p>${locked()?pick('Your teacher has paused page navigation. Keep working here; you can still answer and run Python.','Guru mengunci navigasi. Teruskan menjawab dan menjalankan Python di sini.','老师已暂停页面切换。你仍可在本页答题和运行 Python。'):pick('Choose lesson pages yourself. Your teacher can bring everyone to a shared page.','Pilih halaman sendiri. Guru boleh membawa semua ke halaman yang sama.','可以自主选择课程页面。老师也可以带大家到同一页。')}</p><p class="cm-small">${pick('Only a temporary random connection ID is shared. Your name, answers and code are not sent to Supabase.','Hanya ID rawak sementara dikongsi. Nama, jawapan dan kod tidak dihantar ke Supabase.','仅分享临时随机连接编号，不向 Supabase 发送姓名、答案或代码。')}</p>`;
    } else if (open && !info().teacher) {
      body = `<form id="cm-join"><h2>${pick('Join your classroom','Sertai kelas anda','加入课堂')}</h2><label>${pick('Paste the link your teacher shared','Tampal pautan daripada guru','粘贴老师分享的链接')}<input type="url" name="link" required placeholder="https://…/#classroom=…"></label><button class="primary">${pick('Join without a name','Sertai tanpa nama','匿名加入')}</button></form><p class="cm-small"><a href="${escape(teacherLink())}">${pick('Teacher sign-in','Log masuk guru','教师登录')}</a></p>`;
    }
    root.innerHTML = `<div class="cm-bar"><div><strong>${pick('Classroom','Bilik darjah','课堂')}</strong> <span class="cm-status ${current&&!connected?'pending':''}">${escape(status)}</span></div>${button('toggle',open?pick('Hide panel','Sembunyikan panel','收起面板'):pick('Open panel','Buka panel','打开面板'))}</div>${open?`<section class="cm-panel" aria-label="${pick('Classroom controls','Kawalan kelas','课堂控制')}">${body}</section>`:''}<p class="cm-message ${bad?'cm-error':''}" role="status" aria-live="polite">${escape(message)}</p>`;
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
    return snapshot && snapshot.version===1 && snapshot.lesson==='year9-week3-project' && snapshot.session_id===room && lesson.pages().includes(snapshot.stage) && typeof snapshot.locked==='boolean' && typeof snapshot.ended==='boolean' && Number.isSafeInteger(snapshot.revision) && snapshot.revision>=0 && Number.isSafeInteger(snapshot.bring_revision) && snapshot.bring_revision>=0 && snapshot.bring_revision<=snapshot.revision && Number.isFinite(Date.parse(snapshot.expires_at)) && Number.isFinite(Date.parse(snapshot.server_now));
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
      else if(snapshot.locked && info().entry) lesson.openAnonymous();
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
  function endLocally(left = false) {
    const oldRoom=room;
    disconnect();room=null;lastBring=-1;
    try{sessionStorage.removeItem('cm-bring:'+oldRoom);if(!left)localStorage.removeItem('cm-device:'+oldRoom);}catch{}
    if(!info().teacher){
      const url=new URL(location.href);url.hash='';url.searchParams.set('anonymous','1');history.replaceState(null,'',url);
    }
    if(left)say('You left the classroom. Your work is still here.','Anda meninggalkan kelas. Kerja masih disimpan di sini.','你已离开课堂，作品仍保留在这里。');
    else say('Classroom ended. You can continue at your own pace. Save your work before closing this tab.','Kelas tamat. Teruskan mengikut kadar sendiri. Simpan kerja sebelum menutup tab.','课堂已结束，可继续自主学习。关闭标签页前请保存作品。');
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
      const snapshot=await rpc('classroom_snapshot',{p_session_id:target});
      if(run!==generation||room!==target)return;
      if(snapshot===null){endLocally();return;}
      accept(snapshot,true);
    } catch {
      if(run===generation) say('Connection interrupted. Retrying; your work stays in this browser.','Sambungan terganggu. Mencuba semula; kerja kekal dalam pelayar.','连接中断，正在重试。作品仍保存在此浏览器。',true);
    } finally {refreshing=false;}
  }
  async function attach(snapshot) {
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
      if(!allowed){await api.auth.signOut({scope:'local'});throw Error('Not a teacher');}
      const saved=await rpc('classroom_current_session');
      if(saved){room=saved.session_id;if(!valid(saved))throw Error('Invalid session');await attach(saved);}
    } finally {checking=false;render(true);}
  }
  async function action(cmd) {
    if(busy||!allowed)return;
    busy=true;render();
    try {
      if(cmd==='start'){
        const snapshot=await rpc('classroom_start',{p_stage:info().page});
        room=snapshot.session_id;if(!valid(snapshot))throw Error('Invalid session');
        await attach(snapshot);message='';
      } else if(cmd==='signout'){
        if(current)return;
        await client.auth.signOut({scope:'local'});allowed=false;disconnect();
      } else if(current && ['lock','bring','unlock','end'].includes(cmd)){
        if(cmd==='end'&&!confirm(words('End this classroom for everyone? Their work will stay in their browsers.','Tamatkan kelas untuk semua? Kerja kekal dalam pelayar masing-masing.','结束全班课堂吗？作品仍会保留在各自浏览器中。')))return;
        const snapshot=await rpc('classroom_control',{p_session_id:room,p_action:cmd,p_expected_revision:current.revision,p_stage:cmd==='bring'?info().page:null});
        const outgoing=channel;
        // The RPC result is authoritative; a failed broadcast is recovered by polling.
        let sent=false;
        if(outgoing)try{sent=(await outgoing.send({type:'broadcast',event:'state',payload:snapshot}))==='ok';}catch{}
        accept(snapshot,true);
        if(!sent&&cmd!=='end')say('Saved. Some browsers may take up to 10 seconds to catch up.','Disimpan. Sesetengah pelayar mungkin mengambil sehingga 10 saat.','已保存。部分浏览器可能需要最多 10 秒同步。');
        else if(cmd!=='end'){message='';bad=false;}
      }
    } catch(error) {
      await refresh();
      say(error.code==='40001'?'Another command arrived first. Check the current state, then try again.':'Could not complete the action. Check your connection and teacher sign-in.','Tindakan tidak selesai. Semak sambungan dan log masuk guru.','操作未完成。请检查网络及教师登录状态。',true);
    } finally {busy=false;render(true);}
  }
  root.addEventListener('submit',async event=>{
    event.preventDefault();
    if(event.target.id==='cm-join'){
      try {
        const link=new URL(new FormData(event.target).get('link'));
        const id=new URLSearchParams(link.hash.slice(1)).get('classroom');
        if(!uuid.test(id||''))throw Error('Missing room');
        const destination=new URL(location.href);destination.search='';destination.hash=`classroom=${id}`;location.assign(destination);location.reload();
      } catch {say('Paste the complete classroom link shared by your teacher.','Tampal pautan kelas penuh daripada guru.','请粘贴老师分享的完整课堂链接。',true);}
    } else if(event.target.id==='cm-login'&&!busy){
      const form=new FormData(event.target),email=String(form.get('email')).trim(),password=String(form.get('password'));
      event.target.elements.password.value='';busy=true;render(true);
      try {
        const api=await ensureClient();
        const {error}=await api.auth.signInWithPassword({email,password});
        if(error)throw error;
        await recoverTeacher();
        say('Teacher sign-in confirmed.','Log masuk guru disahkan.','教师登录已验证。');
      } catch {allowed=false;say('Sign-in failed. Check the email and password for your approved teacher account.','Log masuk gagal. Semak e-mel dan kata laluan akaun guru.','登录失败。请检查已授权教师账户的邮箱及密码。',true);}
      finally{busy=false;render(true);}
    }
  });
  root.addEventListener('click',async event=>{
    const el=event.target.closest('[data-cm]');if(!el||el.disabled)return;
    const cmd=el.dataset.cm;
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
  window.addEventListener('online',()=>void refresh());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refresh();});
  window.addEventListener('pagehide',()=>disconnect());
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
  render();
  if(room){
    busy=true;
    rpc('classroom_snapshot',{p_session_id:room}).then(async snapshot=>{
      if(!snapshot){endLocally();return;}
      if(!valid(snapshot))throw Error('Invalid session');
      await attach(snapshot);
    }).catch(()=>say('Could not join. Check your connection, then reload this page.','Tidak dapat menyertai. Semak sambungan dan muat semula.','无法加入。请检查网络，然后刷新页面。',true)).finally(()=>{busy=false;render(true);});
  } else if(info().teacher){
    recoverTeacher().catch(()=>say('Sign in to use classroom controls.','Log masuk untuk menggunakan kawalan kelas.','请登录以使用课堂控制。'));
  }
})();
