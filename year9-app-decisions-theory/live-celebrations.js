window.DesignCelebrations = (() => {
  'use strict';
  function create(projector=false){
    const box=document.createElement('aside');box.className='gc-celebration';box.hidden=true;box.setAttribute('aria-label','House-point celebration');
    box.innerHTML='<div class="gc-confetti" aria-hidden="true">'+Array.from({length:28},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><b aria-hidden="true">★</b><div><strong></strong><p></p></div><button aria-label="Dismiss celebration">×</button><span class="sr-only" role="status"></span>';
    box.setAttribute('popover','manual');document.body.append(box);let seen=new Set(),room='',queue=[],active=null,timer;
    function next(){clearTimeout(timer);active=queue.shift();if(!active){try{box.hidePopover?.();}catch{}box.hidden=true;return;}box.hidden=false;
      box.querySelector('strong').textContent=projector?(active.firstName||'A learner')+' · +'+active.amount+' house point'+(active.amount===1?'':'s'):'You earned +'+active.amount+' house point'+(active.amount===1?'':'s')+'!';
      box.querySelector('p').textContent=projector?'Useful learning worth celebrating!':active.reason||'Your teacher recognised your learning.';
      box.querySelector('[role=status]').textContent=box.querySelector('strong').textContent;try{box.showPopover?.();}catch{}box.classList.remove('celebrate');void box.offsetWidth;box.classList.add('celebrate');timer=setTimeout(next,4500);
    }
    box.querySelector('button').onclick=next;
    function observe(r,awards,viewer='student'){
      if(!r)return;const storage='y9design-awards:'+viewer+':'+r.id;
      if(room!==r.id){room=r.id;queue=[];clearTimeout(timer);active=null;try{box.hidePopover?.();}catch{}box.hidden=true;try{seen=new Set(JSON.parse(sessionStorage.getItem(storage)||'[]'));}catch{seen=new Set();}}
      const valid=awards.filter(a=>!a.undone_at),ids=new Set(valid.map(a=>a.id));queue=queue.filter(a=>ids.has(a.id));if(active&&!ids.has(active.id))next();
      const now=Date.parse(r.serverNow)||Date.now();
      for(const a of valid.slice().sort((a,b)=>Date.parse(a.at)-Date.parse(b.at))){if(seen.has(a.id))continue;seen.add(a.id);if(r.connected&&now-Date.parse(a.at)<30000&&now>=Date.parse(a.at)-2000)queue.push(a);}
      try{sessionStorage.setItem(storage,JSON.stringify([...seen].slice(-200)));}catch{}if(!active)next();
    }
    return {observe};
  }
  return {create};
})();
