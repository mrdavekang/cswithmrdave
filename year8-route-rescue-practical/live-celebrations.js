/* Short, non-blocking celebrations. Awarding is a private teacher RPC, never a pupil action. */
window.RouteCelebrations=(()=>{
 'use strict';
 function create(projector=false){
  let roomId='',seen=new Set(),queue=[],active=null,timer,storeKey='';
  const box=document.createElement('aside');box.className='house-celebration'+(projector?' projector-celebration':'');box.hidden=true;box.setAttribute('aria-label','House-point celebration');
  box.innerHTML='<div class="celebration-stars" aria-hidden="true">'+Array.from({length:9},(_,i)=>'<i style="--star:'+i+'">★</i>').join('')+'</div><span class="celebration-icon" aria-hidden="true">★</span><div><strong></strong><p></p></div><button type="button" aria-label="Dismiss celebration">×</button><span class="sr-only" role="status" aria-live="polite"></span>';
  document.body.append(box);
  const remember=()=>{try{sessionStorage.setItem(storeKey,JSON.stringify([...seen].slice(-150)));}catch{}};
  function next(){
   clearTimeout(timer);active=queue.shift()||null;
   if(!active){box.hidden=true;return;}
   box.querySelector('strong').textContent=projector?active.firstName+' · +'+active.amount+' house point'+(active.amount===1?'':'s'):'You earned +'+active.amount+' house point'+(active.amount===1?'':'s')+'!';
   box.querySelector('p').textContent=projector?'Learning worth celebrating!':active.reason||'Your teacher recognised your learning.';
   box.querySelector('[role=status]').textContent=box.querySelector('strong').textContent;
   box.hidden=false;box.classList.remove('celebrate');void box.offsetWidth;box.classList.add('celebrate');
   timer=setTimeout(next,4500);
  }
  box.querySelector('button').onclick=next;
  function observe(room,awards=[],viewer='student'){
   if(!room?.id)return;
   if(room.id!==roomId){roomId=room.id;storeKey='route-awards-seen:'+viewer+':'+roomId;queue=[];active=null;clearTimeout(timer);box.hidden=true;try{seen=new Set(JSON.parse(sessionStorage.getItem(storeKey)||'[]'));}catch{seen=new Set();}}
   const valid=awards.filter(a=>!a.undone&&!a.undone_at),ids=new Set(valid.map(a=>a.id));
   queue=queue.filter(a=>ids.has(a.id));if(active&&!ids.has(active.id))next();
   const now=Date.parse(room.serverNow)||Date.now();
   for(const a of valid.slice().sort((a,b)=>Date.parse(a.at)-Date.parse(b.at))){
    if(!a.id||seen.has(a.id))continue;seen.add(a.id);
    if(!room.connected||room.ended||now-Date.parse(a.at)>30000||now<Date.parse(a.at)-2000)continue;
    queue.push({...a,firstName:a.firstName||'A student'});
   }
   remember();if(!active)next();
  }
  return {observe};
 }
 return {create};
})();
