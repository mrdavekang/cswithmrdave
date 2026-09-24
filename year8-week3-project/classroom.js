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
  const lessonId = 'year8-week3-project';
  const classArgs = () => ({p_class_id:classId,p_lesson:lessonId});
  let room = null, discovery, discovering = false;
  let client, sdkLoading, channel, roster, generation = 0, poll, expiryTimer;
  let current = null, deadline = Infinity, lastBring = -1, allowed = false;
  let open = info().teacher, busy = false, checking = false;
  let controlReady = false, presenceReady = false, count = null, message = '', bad = false;
  let refreshing = false, authSubscription, desired=null, followTimer, lastReturn=0, updated=0;
  const mode=()=>current?.mode||(current?.locked?'answer':'self');
  const locked = () => !info().teacher && Boolean(current?.locked);
  // This guard is for classroom pacing; the Supabase rules enforce privileges.
  window.ClassroomMode = Object.freeze({locked,mode,approved:()=>allowed,sendSlide:async id=>{if(!allowed||!current||!window.TeacherPresentation?.ids().includes(id))return false;return action('bring',id);}});
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
  const navSelector='[data-action="goto"],[data-action="stage"],[data-action="next"],[data-action="skip"],[data-action="back"],[data-action="home"],[data-action="reset"],[data-action="resume"],[data-action="restore"],[data-teacher="jump"]';
  function guardNavigation() {
    const readonly=!info().teacher&&current&&['view','attention'].includes(mode())&&!info().entry;
    document.querySelectorAll('#app button,#app input,#app textarea,#app select,#teacher-presentation textarea,#dialog input,#dialog button,#dialog textarea,#dialog select').forEach(el=>{
      const stop=readonly||(locked()&&el.matches(navSelector));
      if(stop){if(!el.hasAttribute('data-cm-disabled'))el.dataset.cmDisabled=String(el.disabled);el.disabled=true;}
      else if(el.hasAttribute('data-cm-disabled')){el.disabled=el.dataset.cmDisabled==='true';delete el.dataset.cmDisabled;}
    });
    let cover=document.getElementById('classroom-attention');
    if(!cover){cover=document.createElement('dialog');cover.id='classroom-attention';cover.innerHTML='<div><span>PAUSE</span><h1>Screens down</h1><p>Hands away from your device.<br>Look at your teacher and listen.</p><p lang="zh">双手离开设备，看老师，认真听。</p><p lang="ko">기기에서 손을 떼고 선생님을 보며 들어 주세요.</p></div>';cover.addEventListener('cancel',e=>e.preventDefault());document.body.append(cover);}
    const attention=!info().teacher&&current&&mode()==='attention';
    if(attention&&!cover.open)cover.showModal();else if(!attention&&cover.open)cover.close();
  }
  const labels={attention:'Screens down',view:'Show only',answer:'Let students answer',self:'Self-paced'};
  function render(force=false){
    guardNavigation();
    if(!force&&root.contains(document.activeElement)&&document.activeElement.matches('input,select'))return;
    root.classList.toggle('cm-teacher',info().teacher);
    document.body.classList.toggle('cm-has-dock',info().teacher);
    const status=current?`LIVE · ${labels[mode()]}${controlReady&&presenceReady?'':' · connecting…'}`:'Classroom not started · self-paced';
    let body='';
    if(info().teacher){
      if(!allowed)body= open?`<form id="cm-login"><label>Teacher email<input type="email" name="email" autocomplete="username" required></label><label>Password<input type="password" name="password" autocomplete="current-password" required></label><button ${busy?'disabled':''}>Sign in</button></form>`:'';
      else {
        const slides=window.TEACHING_SLIDES||[];
        body=`<div class="cm-actions">${current?['attention','view','answer','self'].map(c=>button(c,labels[c],busy,mode()===c)).join('')+button('return','Return to own work',busy):button('start','Start classroom',busy,true)}${current?button('bring','Bring here once',busy)+button('end','End classroom',busy):button('signout','Sign out',busy)}</div><div class="cm-actions"><label>Lesson page<select id="cm-page"><option value="">Choose a lesson page…</option>${lesson.destinations().map(d=>`<option value="${escape(d.id)}">${escape(d.group+' · '+d.title)}</option>`).join('')}</select></label><label>Teaching slide<select id="cm-slide"><option value="">Choose a slide…</option>${slides.map(d=>`<option value="slide-${escape(d.id)}">${escape(d.title)}</option>`).join('')}</select></label>${button('previous','← Slide')}${button('nextslide','Slide →')}${button('lesson','Back to lesson')}</div><small>${window.TeacherPresentation?.isPrivate()?'Teacher reference only — students remain on their current screen.':current?.locked?'Following automatically: '+escape(lesson.label()):'Self-paced: students choose their own page. Bring here once shares your current page.'}</small>`;
      }
    }else body=`<span>${current?mode()==='view'?'Read and scroll. Wait for your teacher before answering.':mode()==='answer'?'Answer on this page. Your teacher controls page changes.':'Choose your own lesson page.':'You can work normally. This page connects when your teacher starts.'}</span>${!locked()&&window.TeacherPresentation?.current()?button('mylesson','Return to my lesson'):''}<a href="${escape(teacherLink())}">Teacher sign-in</a>`;
    root.innerHTML=`<div class="cm-bar"><strong>${escape(status)}</strong>${info().teacher&&current?`<span>${count??'—'} devices connected · ${updated} received this update</span>`:''}${info().teacher&&!allowed?button('toggle',open?'Hide sign-in':'Teacher sign-in'):''}</div>${body}<p class="cm-message ${bad?'cm-error':''}" role="status">${escape(message)}</p>`;
  }
  function acknowledge(){if(!info().teacher&&presenceReady&&roster&&current)roster.track({v:2,revision:current.revision,mode:mode()}).catch(()=>{});}
  function queueFollow(){
    if(!allowed||!current?.locked||window.TeacherPresentation?.isPrivate())return;
    desired=info().page;clearTimeout(followTimer);followTimer=setTimeout(flushFollow,120);
  }
  async function flushFollow(){if(busy)return;if(!desired||!current?.locked)return;const target=desired;desired=null;if(target!==current.stage&&lesson.pages().includes(target))await action('bring',target);}
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
    if(current?.revision!==snapshot.revision)updated=0;
    current=snapshot;
    if(!info().teacher){
      if((snapshot.return_revision||0)>lastReturn){lastReturn=snapshot.return_revision;lesson.returnOwn();lastBring=snapshot.bring_revision;rememberBring();render();acknowledge();return;}
      if(snapshot.locked)lesson.captureOwn();
      if(snapshot.bring_revision>lastBring && snapshot.bring_revision>0) lesson.move(snapshot.stage);
      else if(snapshot.locked && info().entry) lesson.move(snapshot.stage);
      lastBring=Math.max(lastBring,snapshot.bring_revision);rememberBring();
    }
    render();acknowledge();
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
    disconnect();room=snapshot.session_id;lesson.setSession(room);
    const run=generation;
    lastBring=-1;lastReturn=snapshot.return_revision||0;
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
      const devices=Object.entries(thisRoster.presenceState()).filter(([key,items])=>uuid.test(key)&&Array.isArray(items)&&items.length>0);count=devices.length;updated=devices.filter(([,items])=>items.some(i=>i.revision>=current?.revision&&i.mode===mode())).length;
      render();
    });
    roster.subscribe(async status=>{
      if(run!==generation)return;
      presenceReady=status==='SUBSCRIBED';
      if(presenceReady&&!info().teacher){
        let result;try{result=await thisRoster.track({v:2,revision:current?.revision,mode:mode()});}catch{result='error';}
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
    busy=true;if(['self','return','end'].includes(cmd))desired=null;render();
    try {
      if(cmd==='start'){
        const snapshot=await rpc('classroom_class_start',{...classArgs(),p_stage:lesson.pages().includes(info().page)?info().page:'read'});
        room=snapshot.session_id;if(!valid(snapshot))throw Error('Invalid session');
        await attach(snapshot);message='';
      } else if(cmd==='signout'){
        if(current)return;
        await client.auth.signOut({scope:'local'});allowed=false;disconnect();
      } else if(current && ['attention','view','answer','self','return','bring','end'].includes(cmd)){
        const snapshot=await rpc('classroom_teach_control',{p_session_id:room,p_action:cmd,p_expected_revision:current.revision,p_stage:['bring','attention','view','answer'].includes(cmd)?(stage||(lesson.pages().includes(info().page)?info().page:current.stage)):null});
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
    } finally {busy=false;render(true);void flushFollow();}
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
    else if(cmd==='previous'||cmd==='nextslide')window.TeacherPresentation?.step(cmd==='previous'?-1:1);
    else if(cmd==='mylesson'&&!locked())lesson.returnOwn();
    else if(cmd==='lesson')window.TeacherPresentation?.close();
    else if(cmd==='end'){if(confirm('End this classroom and restore self-paced work?'))await action(cmd);}
    else await action(cmd);
  });
  document.addEventListener('click',event=>{
    if(locked()&&event.target.closest('[data-page],[data-action="home"],[data-home],[data-action="legacy"]')){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  document.addEventListener('change',event=>{
    if(locked()&&event.target.matches('[data-restore]')){event.preventDefault();event.stopImmediatePropagation();event.target.value='';say('Load a backup after your teacher unlocks navigation.','Muatkan sandaran selepas guru membuka navigasi.','请等老师解锁后再导入备份。');}
  },true);
  root.addEventListener('change',e=>{if(!allowed)return;if(e.target.id==='cm-page'&&e.target.value){window.TeacherPresentation?.close();lesson.navigate(e.target.value);}if(e.target.id==='cm-slide'&&e.target.value)window.TeacherPresentation?.open(e.target.value);});
  for(const type of ['click','beforeinput','input','change','keydown','paste','drop','submit'])document.addEventListener(type,e=>{
    if(info().teacher||!current||info().entry||!['view','attention'].includes(mode()))return;
    if(e.target.closest('#app,#teacher-presentation,#dialog')&&!(type==='keydown'&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Tab'].includes(e.key))){e.preventDefault();e.stopImmediatePropagation();}
  },true);
  window.addEventListener('lesson:render',()=>{render();queueFollow();});
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
