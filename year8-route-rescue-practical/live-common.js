/* Public configuration only. Teacher rights are checked inside Supabase, never by the name field. */
window.RouteLive = (() => {
  'use strict';
  const config={url:'https://qejimegoysblonawsoza.supabase.co',key:'sb_publishable_bWHlzeJJdgepYefUsc16zQ_93_TEYes'};
  const rounds={
    1:{title:'Read the radio clue',goal:'Read one element without changing the list.',
      prompt:'The rescue crew needs its radio. Add one instruction that displays only radio. Do not change the list.',
      zh:'救援队需要无线电。添加一条指令，只输出 radio。不要更改列表。',ko:'구조대에 무전기가 필요해요. radio만 출력하는 명령 한 줄을 추가하세요. 리스트는 바꾸지 마세요.',
      starter:'supplies = ["rope", "radio", "blanket"]\n',model:'supplies = ["rope", "radio", "blanket"]\nprint(supplies[1])',output:'radio',
      explain:'Index 1 reads the second element. print displays its value; the stored list stays the same.'},
    2:{title:'Repair the equipment list',goal:'Replace one element; keep the other two.',
      prompt:'The crew has a compass instead of a map. Replace map with compass in gear. Print the whole list. Keep torch and water unchanged.',
      zh:'救援队有指南针，不再使用地图。在 gear 中把 map 替换为 compass，再输出整个列表。torch 和 water 保持不变。',
      ko:'구조대가 지도 대신 나침반을 사용해요. gear의 map을 compass로 바꾸고 전체 리스트를 출력하세요. torch와 water는 그대로 두세요.',
      starter:'gear = ["torch", "map", "water"]\n',model:'gear = ["torch", "map", "water"]\ngear[1] = "compass"\nprint(gear)',output:"['torch', 'compass', 'water']",
      explain:'The assignment replaces index 1. It does not add an element. The first and third values stay unchanged.'}
  };
  const cues=[
    [0,3,'Setup','Open the safe projector. Enable automatic intro once; start the lesson clock.','Open Teams and prepare your lesson tab.','mission'],
    [3,7,'Overview video','Watch the 3:43 introduction together. Pause the lesson clock if playback needs longer.','Watch the model, goals and where to begin.','overview'],
    [7,11,'Do Now','Check indexes; notice who needs an example.','Answer the three short questions.','starter'],
    [11,13,'Types of Learning','Connect starter evidence to K, S and U.','Choose a useful starting strategy.','learning'],
    [13,20,'Main Task 1','Model where to type and Run.','Create and read your route.','main1'],
    [20,26,'Live coding 1','Invite → ready → 3 min response → discuss → follow along.','Join when ready; read one element.','main1'],
    [26,39,'Practical work','Circulate; support code rather than extra writing.','Finish essentials; begin list updates.','main2'],
    [39,45,'Live coding 2','Invite → 3 min response → compare → revise.','Replace one element; keep the rest.','main2'],
    [45,49,'Finish the repair','Check students can point to the changed index.','Run and compare your output.','main2'],
    [49,52,'Learning Pit Stop','Use evidence, not speed, to discuss learning.','Review what changed in your understanding.','pit'],
    [52,56,'Go Further','Use deeper tasks for ready learners.','Try the next repair challenge.','extension'],
    [56,58,'Plenary','Check read versus replace misconceptions.','Complete the two exit questions.','plenary'],
    [58,60,'Save and submit','Name the Teams assignment. Check Turn in.','Save report, attach in Teams, Turn in.','report']
  ];
  let client;
  function db(){if(client)return client;
    // Migrate only this app's earlier login to tab-scoped storage; never inspect other lessons' keys.
    if(location.pathname.endsWith('/teacher.html'))try{const old=localStorage.getItem('route-rescue-teacher-auth');if(old&&!sessionStorage.getItem('route-rescue-teacher-auth'))sessionStorage.setItem('route-rescue-teacher-auth',old);localStorage.removeItem('route-rescue-teacher-auth');}catch{}
    return client=supabase.createClient(config.url,config.key,{auth:{storage:sessionStorage,storageKey:'route-rescue-teacher-auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  }
  async function rpc(name,args){const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);try{const {data,error}=await db().rpc('y8_route_'+name,args).abortSignal(abort.signal);if(error)throw new Error(error.message||'Connection timed out. Your draft is kept.');return data;}finally{clearTimeout(timer);}}
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function effective(r,now=Date.now()){
    if(!r)return null;const x={...r};
    if(!x.connected||x.ended)x.phase='work';
    if(['response','retry'].includes(x.phase)&&x.deadline&&Date.parse(x.deadline)<=now)x.phase='discuss';
    return x;
  }
  const writable=r=>!!r?.connected&&(['follow'].includes(r.phase)||['response','retry'].includes(r.phase)&&r.pausedSeconds==null&&Date.parse(r.deadline)>Date.now());
  const kind=r=>r.responseKind||(['retry','follow'].includes(r.phase)?'revision':'initial');
  const time=n=>{n=Math.max(0,Math.floor(n||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
  const remaining=r=>r?.pausedSeconds??Math.max(0,Math.ceil((Date.parse(r?.deadline)-Date.now())/1000)||0);
  function countdown(r,now=Date.now()){
    const timed=!!r?.connected&&['response','retry'].includes(r.phase),paused=r?.pausedSeconds!=null;
    const duration=Math.max(1,Number(r?.responseDuration)||(r?.responseKind==='revision'?60:180));
    const left=paused?r.pausedSeconds:Math.max(0,Math.ceil((Date.parse(r?.deadline)-now)/1000)||0);
    return {timed,paused,duration,left,urgent:timed&&!paused&&left>0&&left<duration/2,percent:Math.min(100,Math.max(0,left/duration*100))};
  }
  function paintCountdown(el,r,now=Date.now()){
    if(!el)return;const c=countdown(r,now);el.hidden=!c.timed;if(!c.timed)return;
    const signature=r.id+':'+r.round+':'+kind(r),nudge=c.urgent&&el.dataset.nudged!==signature;
    if(nudge)el.dataset.nudged=signature;
    el.classList.toggle('is-urgent',c.urgent);el.classList.toggle('is-paused',c.paused);
    if(nudge){el.classList.remove('timer-nudge');void el.offsetWidth;el.classList.add('timer-nudge');}
    const label=c.paused?'Timer paused':c.urgent?'Respond now · less than half the time remains':'Live response time';
    if(!el.querySelector('.response-clock-value'))el.innerHTML='<div><b class="response-clock-label"></b><strong class="response-clock-value"></strong></div><div class="response-clock-track" aria-hidden="true"><span></span></div>';
    el.querySelector('.response-clock-label').textContent=label;
    el.querySelector('.response-clock-value').textContent=time(c.left);
    el.querySelector('.response-clock-track span').style.width=c.percent+'%';
    el.setAttribute('aria-label',label+' · '+time(c.left)+' remaining');
  }
  const cue=seconds=>cues.find(c=>seconds/60>=c[0]&&seconds/60<c[1])||cues[cues.length-1];
  const htmlCache=new WeakMap();
  function paint(el,html){if(htmlCache.get(el)===html)return;el.innerHTML=html;htmlCache.set(el,html);}
  function indent(el,e){if(e.key==='Tab'){e.preventDefault();el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input',{bubbles:true}));}}
  function download(value,name){const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);}
  return {config,rounds,cues,db,rpc,esc,effective,writable,kind,time,remaining,countdown,paintCountdown,cue,indent,download,paint,forget:el=>htmlCache.delete(el)};
})();
