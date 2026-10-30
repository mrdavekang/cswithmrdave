/* Decorative, local feedback only. These meters never determine lesson access. */
window.TypingStats=(()=>{
 const labels={en:['Text match','Personal pace','Route charged','Matching characters','No speed target','Type → run → change','Ready for launch','Keep going — one key at a time','Halfway there!','Final stretch!','Text matched!','Model runs!','Upgrade complete!','Calm effects'],zh:['文字匹配','个人速度','路线充能','匹配的字符','没有速度目标','输入 → 运行 → 修改','准备出发','继续，一次输入一个字符','已经过半！','最后一段！','文字完全匹配！','示范运行成功！','修改成功！','减少动画'],ko:['문자 일치','나의 속도','경로 충전','일치하는 문자','속도 목표 없음','입력 → 실행 → 변경','출발 준비','한 글자씩 계속해 보세요','절반을 지났어요!','마지막 구간!','모두 일치해요!','예시 실행 성공!','변경 성공!','효과 줄이기']};
 function mount(host,options){
  const en=labels.en,local=labels[options.language]||en,L=i=>en[i]+(local!==en?' · '+local[i]:''),system=matchMedia('(prefers-reduced-motion: reduce)'),studio=host.closest('.typing-studio');
  let calm=options.calm||system.matches,lastPercent=0,lastMilestone=0,frame=0;
  host.className='typing-summary arcade-stats';
  host.innerHTML=`<section class="arcade-stat stat-precision"><span class="stat-icon" aria-hidden="true">✦</span><span class="stat-label">${L(0)}</span><strong><span id="typing-accuracy">0</span><small>%</small></strong><span class="stat-caption">${L(3)}</span><span class="stat-track" aria-hidden="true"><i id="accuracy-fill"></i></span></section><section class="arcade-stat stat-pace"><span class="stat-icon" aria-hidden="true">⚡</span><span class="stat-label">${L(1)}</span><strong><span id="typing-speed">—</span><small id="speed-unit">WPM</small></strong><span id="speed-caption" class="stat-caption">${L(4)}</span><span class="stat-decoration" aria-hidden="true">▂ ▄ ▆ █</span></section><section class="arcade-stat stat-charge"><span class="stat-icon" aria-hidden="true">★</span><span class="stat-label">${L(2)}</span><strong><span id="typing-charge">0</span><small>%</small></strong><span id="typing-position" class="stat-caption">0 characters</span><span class="stat-track" aria-hidden="true"><i id="charge-fill"></i></span></section><div class="stat-mission-line"><span id="stats-milestone" role="status">${L(6)}</span><button id="stats-calm" type="button" aria-pressed="${calm}">${L(13)}</button></div><div class="stat-particles" aria-hidden="true"></div>`;
  const get=id=>host.querySelector('#'+id),number=(id,value)=>{const node=get(id),old=Number(node.dataset.value)||0;node.dataset.value=value;if(calm||system.matches||!host.isConnected){node.textContent=value;return;}const start=performance.now();const tick=now=>{if(!host.isConnected)return;const t=Math.min(1,(now-start)/220);node.textContent=Math.round(old+(value-old)*(1-Math.pow(1-t,3)));if(t<1)node._statFrame=requestAnimationFrame(tick);};cancelAnimationFrame(node._statFrame);node._statFrame=requestAnimationFrame(tick);};
  const applyCalm=()=>{studio.classList.toggle('calm-stats',calm||system.matches);get('stats-calm').setAttribute('aria-pressed',String(calm||system.matches));};applyCalm();
  get('stats-calm').onclick=()=>{calm=!calm;applyCalm();options.onCalm?.(calm);};
  function burst(message,complete=false){
   get('stats-milestone').textContent=message;host.classList.toggle('stats-complete',complete);
   if(calm||system.matches)return;
   host.classList.remove('stats-impact');cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(host.isConnected)host.classList.add('stats-impact');});
   const particles=host.querySelector('.stat-particles');particles.replaceChildren();
   for(let i=0;i<(complete?24:10);i++){const piece=document.createElement('i');piece.style.cssText=`--x:${8+(i*37)%86}%;--drift:${(i%2?1:-1)*(25+i*3)}px;--delay:${i%5*35}ms;--hue:${i*47%360}`;particles.append(piece);}
   setTimeout(()=>{particles.replaceChildren();host.classList.remove('stats-impact');},1500);
  }
  function update({matches,total,accuracy,wpm,pasted,hasText},initial=false){
   // A paste/reset must not be overwritten by an earlier numeric animation.
   for(const id of ['typing-accuracy','typing-charge','typing-speed'])cancelAnimationFrame(get(id)._statFrame);
   const percent=Math.min(100,Math.round(100*matches/Math.max(total,1)));
   number('typing-accuracy',hasText?accuracy:0);number('typing-charge',percent);
   get('accuracy-fill').style.width=(hasText?accuracy:0)+'%';get('charge-fill').style.width=percent+'%';
   get('typing-position').textContent=matches+' / '+total+' · '+L(3);
   if(options.typeRun){get('typing-speed').textContent='CODE';get('speed-unit').textContent='';get('speed-caption').textContent=L(5);}
   else if(pasted){get('typing-speed').textContent='—';get('speed-unit').textContent='';get('speed-caption').textContent=local===en?'Pasted text · speed not scored':options.language==='zh'?'粘贴文字 · 不计算速度':'붙여넣기 · 속도 측정 안 함';}
   else{hasText?number('typing-speed',wpm):get('typing-speed').textContent='—';get('speed-unit').textContent='WPM';get('speed-caption').textContent=L(4);}
   if(percent<100&&lastPercent===100){host.classList.remove('stats-complete');get('stats-milestone').textContent=L(7);}
   const milestone=Math.floor(percent/25);if(initial){lastMilestone=milestone;get('stats-milestone').textContent=percent===100?L(10):L(6);}
   else if(milestone>lastMilestone&&percent>lastPercent){lastMilestone=milestone;burst(percent===100?(options.typeRun?L(10)+' · '+L(5):L(10)):percent>=75?L(9):percent>=50?L(8):L(7),percent===100&&!options.typeRun);}
   if(!hasText){lastMilestone=0;host.classList.remove('stats-complete');get('stats-milestone').textContent=L(6);}
   lastPercent=percent;
  }
  return {update,celebrate:changed=>burst(L(changed?12:11),true)};
 }
 return {mount};
})();
