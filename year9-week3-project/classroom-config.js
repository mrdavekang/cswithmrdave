// Public browser connection details. Never put a secret/service-role key here.
window.CLASSROOM_CONFIG = Object.freeze({
  classId: 'c429701c-21c3-4e99-b84d-c2faadca7afb',
  url: 'https://qejimegoysblonawsoza.supabase.co',
  publishableKey: 'sb_publishable_bWHlzeJJdgepYefUsc16zQ_93_TEYes',
});

// The website owns classroom routing. Teams query parameters are not room IDs.
// Retain explicit old session links/notebooks for compatibility only.
(() => {
  const query=new URLSearchParams(location.search);
  const session=new URLSearchParams(location.hash.slice(1)).get('classroom')||'';
  const legacySession=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session);
  const legacyNotebook=query.get('anonymous')==='1'&&!query.has('classId');
  window.CLASSROOM_ROUTE=Object.freeze({
    permanent:query.get('teacher')==='1'||!(legacySession||legacyNotebook),
    classId:window.CLASSROOM_CONFIG.classId
  });
})();
