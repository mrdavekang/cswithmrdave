/* Private, RPC-only live-class transport. No pupil Auth accounts or Realtime. */
(() => {
  'use strict';
  const CLASS_ID = 'c429701c-21c3-4e99-b84d-c2faadca7afb';
  const STAGES = Object.freeze(['ready','starter','types','model','task1','task2','extension','pit','plenary','submit']);
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const TOKEN_KEY = 'y10-for-private-device-v1';
  const JOIN_KEY = 'y10-for-private-join-v1';
  let config, teacherClient, studentClient, sdkPromise;
  let teacherAllowed = false, teacherRoom = null, studentRoom = null;
  let teacherControlQueue = Promise.resolve();
  let token = null, initialized = false;
  const pollMs = 2500;

  function failure(message, code = 'live_unavailable', original) {
    const error = new Error(message);
    error.code = code;
    error.userMessage = message;
    if (original) error.cause = original;
    return error;
  }
  function normalizeError(error) {
    if (error?.userMessage) return error;
    const code = String(error?.code || error?.name || 'connection_error');
    const unavailable = ['PGRST202','PGRST205','42883','42P01'].includes(code);
    const message = unavailable
      ? 'Live classroom setup is not installed yet. Ask your teacher to run the supplied setup file.'
      : code === '40001'
        ? 'Another command arrived first. Refresh the live state, then try again.'
        : code === '42501'
          ? String(error?.message || 'This action is not allowed. Your local work has been preserved.')
          : code === 'P0002'
            ? String(error?.message || 'The classroom invite is unavailable. Ask your teacher for the current link.')
            : code === 'invalid_credentials'
              ? 'The teacher email or password was not accepted. Use the classroom teacher account.'
              : ['TypeError','AbortError','TimeoutError','connection_error'].includes(code)
                ? 'Connection interrupted. Your local work is safe; try again when connected.'
                : String(error?.message || 'The live classroom request could not be completed.');
    return failure(message, code, error);
  }
  async function loadSDK() {
    if (window.supabase?.createClient) return;
    if (!sdkPromise) sdkPromise = new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src = 'vendor/supabase.js';
      script.onload = () => window.supabase?.createClient ? resolve() : reject(failure('Classroom connection library is unavailable.'));
      script.onerror = () => { sdkPromise = null; script.remove(); reject(failure('Classroom connection library could not load.')); };
      document.head.append(script);
    });
    await sdkPromise;
  }
  function storageRead(key, storage) {
    try { return (storage || window.localStorage).getItem(key); } catch { return null; }
  }
  function storageWrite(key, value, storage) {
    try { (storage || window.localStorage).setItem(key, value); return true; } catch { return false; }
  }
  function storageRemove(key) {
    try { window.localStorage.removeItem(key); } catch { /* A private tab may block storage. */ }
  }
  function loadPrivateJoin() {
    const storedToken = storageRead(TOKEN_KEY);
    if (/^[0-9a-f]{64}$/.test(storedToken || '')) token = storedToken;
    try {
      const join = JSON.parse(storageRead(JOIN_KEY) || 'null');
      const invite = inviteRoom();
      if (token && join?.classId === CLASS_ID && UUID.test(join?.roomId || '') && (!invite || invite === join.roomId)) studentRoom = { id:join.roomId };
    } catch { /* Ignore damaged metadata, never overwrite lesson drafts. */ }
  }
  function inviteRoom() {
    try {
      const raw = new URL(window.location?.href || globalThis.location?.href).searchParams.get('room');
      return UUID.test(raw || '') ? raw.toLowerCase() : null;
    } catch { return null; }
  }
  function privateToken() {
    if (token) return token;
    if (!globalThis.crypto?.getRandomValues) throw failure('A secure browser connection is required to join. Open the HTTPS lesson link.','secure_context_required');
    const bytes = new Uint8Array(32);
    globalThis.crypto.getRandomValues(bytes);
    token = Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('');
    storageWrite(TOKEN_KEY, token);
    return token;
  }
  async function init(options = {}) {
    if (initialized) return { configured:true, canResume:Boolean(token && studentRoom), pollMs };
    if (options.classId && options.classId !== CLASS_ID) throw failure('This lesson is configured for a different class.','class_mismatch');
    config = options.config || window.CLASSROOM_CONFIG;
    if (!config?.url?.startsWith('https://') || !config?.publishableKey?.startsWith('sb_publishable_')) {
      throw failure('Live classroom configuration is missing. Your local lesson still works.','configuration_missing');
    }
    await loadSDK();
    // Separate clients are essential: pupil RPCs never inherit teacher JWTs.
    teacherClient = window.supabase.createClient(config.url, config.publishableKey, {
      auth:{persistSession:true,storage:sessionStorage,storageKey:'y10-for-teacher-v1',autoRefreshToken:true,detectSessionInUrl:false}
    });
    studentClient = window.supabase.createClient(config.url, config.publishableKey, {
      auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'y10-for-student-no-auth-v1'}
    });
    teacherClient.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') { teacherAllowed = false; teacherRoom = null; }
    });
    loadPrivateJoin();
    initialized = true;
    return { configured:true, canResume:Boolean(token && studentRoom), pollMs };
  }
  async function rpc(name, args = {}, teacher = false) {
    try {
      if (!initialized) await init();
      const request = (teacher ? teacherClient : studentClient).rpc(name,args);
      const timeout = globalThis.AbortSignal?.timeout?.(12000);
      const { data,error } = await (timeout && request.abortSignal ? request.abortSignal(timeout) : request);
      if (error) throw error;
      return data;
    } catch (error) { throw normalizeError(error); }
  }
  function acceptRoom(room, teacher) {
    if (room == null) return null;
    if (room.version !== 1 || room.lesson !== 'year10_live_for_loops' || room.class_id !== CLASS_ID ||
        !UUID.test(room.id || '') || !STAGES.includes(room.stage) || !['present','work','paused'].includes(room.mode) ||
        !Number.isSafeInteger(room.revision) || room.revision < 0 || !Array.isArray(room.released_stages) ||
        room.released_stages.some(s => !STAGES.includes(s)) || typeof room.ended !== 'boolean') {
      throw failure('The classroom returned an unexpected state. Please refresh.','invalid_snapshot');
    }
    const previous = teacher ? teacherRoom : studentRoom;
    if (previous?.id === room.id && previous.revision > room.revision) return previous;
    if (teacher) teacherRoom = room;
    else {
      studentRoom = room;
      storageWrite(JOIN_KEY,JSON.stringify({classId:CLASS_ID,roomId:room.id}));
    }
    return room;
  }
  async function isTeacher() {
    const allowed = await rpc('y10_for_is_teacher',{p_class_id:CLASS_ID},true);
    teacherAllowed = allowed === true;
    return teacherAllowed;
  }
  async function teacherLogin(email,password) {
    if (!initialized) await init();
    try {
      const { error } = await teacherClient.auth.signInWithPassword({email:String(email || '').trim(),password:String(password || '')});
      if (error) throw error;
      if (!await isTeacher()) {
        await teacherClient.auth.signOut({scope:'local'});
        throw failure('Sign-in worked, but this account is not the approved owner of this class.','teacher_not_approved');
      }
      return await teacherState();
    } catch (error) { teacherAllowed = false; throw normalizeError(error); }
  }
  async function teacherLogout() {
    if (!initialized) return;
    const { error } = await teacherClient.auth.signOut({scope:'local'});
    if (error) throw normalizeError(error);
    teacherAllowed = false;
    teacherRoom = null;
  }
  async function teacherState() {
    const state = await rpc('y10_for_teacher_state',{p_class_id:CLASS_ID},true);
    teacherAllowed = true;
    if (!state || !Array.isArray(state.students)) throw failure('Unexpected teacher board.','invalid_snapshot');
    state.room = acceptRoom(state.room,true);
    return state;
  }
  async function teacherStart(stage = 'ready') {
    if (stage && typeof stage === 'object') stage = stage.stage || 'ready';
    const state = await rpc('y10_for_teacher_start',{p_class_id:CLASS_ID,p_stage:stage},true);
    teacherAllowed = true;
    state.room = acceptRoom(state.room,true);
    return state;
  }
  function requireTeacherRoom() {
    if (!teacherRoom?.id || teacherRoom.ended) throw failure('Start the live classroom first.','room_required');
    return teacherRoom;
  }
  function teacherControl(patch) {
    // Preserve command order: a debounced demo edit cannot race a stage/mode
    // change and reuse its revision. Capture each patch at enqueue time.
    let captured;
    try { captured = JSON.parse(JSON.stringify(patch)); }
    catch { return Promise.reject(failure('Invalid classroom command.','invalid_control')); }
    const queued = teacherControlQueue.catch(() => {}).then(async () => {
      let room = requireTeacherRoom();
      const targetId = room.id;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await rpc('y10_for_teacher_control',{
            p_room_id:room.id,p_expected_revision:room.revision,p_patch:captured
          },true);
          return acceptRoom(result,true);
        } catch (error) {
          if (error.code !== '40001' || attempt !== 0) throw error;
          await teacherState();
          room = requireTeacherRoom();
          if (room.id !== targetId) throw failure('The classroom changed. Check the new session before sending this command.','room_changed');
        }
      }
    });
    // Keep the queue usable after a failed command, but return its rejection
    // to the caller so the UI never fabricates a successful update.
    teacherControlQueue = queued.catch(() => {});
    return queued;
  }
  async function teacherAdmit(studentId, admitted = true) {
    const room = requireTeacherRoom();
    return rpc('y10_for_teacher_admit',{p_room_id:room.id,p_student_id:studentId,p_admitted:Boolean(admitted)},true);
  }
  async function teacherFeedback(studentId, text) {
    // The backend allows review feedback on the latest ended room, too.
    if (!teacherRoom?.id) throw failure('No classroom work to review yet.','room_required');
    return rpc('y10_for_teacher_feedback',{p_room_id:teacherRoom.id,p_student_id:studentId,p_feedback:String(text ?? '')},true);
  }
  async function teacherUnlock(studentId, stage, unlocked = true) {
    const room = requireTeacherRoom();
    return rpc('y10_for_teacher_unlock',{p_room_id:room.id,p_student_id:studentId,p_stage:stage,p_unlocked:Boolean(unlocked)},true);
  }
  async function joinStudent(name, roomId) {
    if (!initialized) await init();
    const target = roomId || inviteRoom() || studentRoom?.id;
    if (!UUID.test(target || '')) throw failure('Use the current lesson invite shared by your teacher.','invite_required');
    const state = await rpc('y10_for_join',{p_class_id:CLASS_ID,p_room_id:target,p_name:String(name || '').trim(),p_token:privateToken()});
    state.room = acceptRoom(state.room,false);
    return state;
  }
  function requireStudentJoin() {
    if (!token || !studentRoom?.id) throw failure('Join with your name first.','join_required');
    return studentRoom.id;
  }
  async function studentPoll() {
    if (!initialized) await init();
    const state = await rpc('y10_for_student_poll',{p_room_id:requireStudentJoin(),p_token:token});
    state.room = acceptRoom(state.room,false);
    return state;
  }
  async function studentSave(payload) {
    // UI should debounce ~700ms and persist its draft BEFORE calling this.
    // A denial/connection failure deliberately does not clear local drafts.
    return rpc('y10_for_student_save',{p_room_id:requireStudentJoin(),p_token:token,p_payload:payload});
  }
  async function setHelp(help = true, note = '') {
    return rpc('y10_for_set_help',{p_room_id:requireStudentJoin(),p_token:token,p_help:Boolean(help),p_note:String(note || '')});
  }
  function forgetJoin() {
    // Removes this device's join credential only, never lesson draft storage.
    token = null; studentRoom = null;
    storageRemove(TOKEN_KEY); storageRemove(JOIN_KEY);
  }
  window.LiveCloud = Object.freeze({init,isTeacher,teacherLogin,teacherLogout,teacherStart,teacherState,
    teacherControl,teacherAdmit,teacherFeedback,teacherUnlock,joinStudent,studentPoll,studentSave,setHelp,forgetJoin,
    config:()=>({classId:CLASS_ID,pollMs,configured:initialized,canResume:Boolean(token && studentRoom),teacherAllowed})});
})();
