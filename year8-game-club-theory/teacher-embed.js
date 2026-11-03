/* Actual lesson renderer, isolated teacher-only rehearsal. No pupil identity or storage. */
(() => {
  const q=new URLSearchParams(location.search);
  if(q.get('teacherEmbed')!=='1'||q.get('teacher')!=='1'||!GameClubBridge.getState()?.teacher)return;
  document.body.classList.add('teacher-embedded');
  const origin=location.origin;let controlling=false;
  const reply=(requestId=null,ok=true)=>{const current=GameClubBridge.getState()?.current;parent.postMessage({type:'gameclub-preview-state',requestId,ok,current,busy:GameClubBridge.busy()},origin);};
  const initial=q.get('card');if(initial)GameClubBridge.previewNavigate(initial,q.get('language'));
  window.addEventListener('message',e=>{
    if(e.source!==parent||e.origin!==origin||e.data?.type!=='gameclub-preview-control')return;
    const d=e.data;if(d.action==='leave'){reply(d.requestId,!GameClubBridge.busy());return;}
    controlling=true;try{reply(d.requestId,GameClubBridge.previewNavigate(d.cardId,d.language));}finally{controlling=false;}
  });
  document.addEventListener('gameclub-preview-rendered',()=>{if(!controlling)reply();});
  reply();
})();
