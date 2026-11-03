/* Safe lesson presentation channel. Only named lesson pages/examples are accepted. */
(() => {
  'use strict';
  const params=new URLSearchParams(location.search),token=params.get('teaching');if(!token)return;
  let state={active:true,id:params.get('slide')||'m1-1',step:Number(params.get('step'))||0,view:params.get('view')||'slide',cardId:params.get('card'),round:Number(params.get('round'))||1,language:params.get('language')||'en'},signature='';
  const root=document.getElementById('board-content'),host=document.createElement('main');host.id='teaching-board';host.style.cssText='padding:10px;display:flex;justify-content:center';root.after(host);
  const language=document.getElementById('board-language'),originalLanguage=language.value,E=GameTeaching.esc;
  function valid(d){return d?.type==='gameclub-teaching'&&d.token===token&&(['activity','checkpoint'].includes(d.view)?d.view==='activity'?LESSON.cards.some(c=>c.id===d.cardId):[1,2].includes(Number(d.round)):GameTeaching.slides.some(s=>s.id===d.id));}
  function frame(title,label,content){host.innerHTML=GameTeaching.render('m1-1',0);const slide=host.querySelector('.tta-slide');slide.querySelector('.tta-title').textContent=title;slide.querySelector('.tta-title').style.fontSize=title.length>45?'2cqw':'2.5cqw';slide.querySelector('.tta-state').textContent=label;slide.querySelector('.teach-number').textContent='';slide.querySelector('.tta-content').innerHTML=content;return slide;}
  function paint(){root.hidden=state.active;host.hidden=!state.active;language.disabled=state.active;language.value=state.active?'zh':originalLanguage;if(!state.active)return;
    const sig=JSON.stringify(state);if(sig===signature)return;signature=sig;
    if(state.view==='activity'){
      const c=LESSON.cards.find(c=>c.id===state.cardId);if(!c)return;
      const src='index.html?teacher=1&teacherEmbed=1&card='+encodeURIComponent(c.id)+'&language='+encodeURIComponent(['en','zh','ko'].includes(state.language)?state.language:'en');
      frame(c.title,c.stage+' · Student task · 学生活动','<iframe class="teach-task-frame" title="Current student task · no pupil records" src="'+E(src)+'"></iframe>');
    }else if(state.view==='checkpoint'){
      const c=GameLive.rounds[state.round];if(!c)return;
      frame(c.title,'Live discussion '+state.round+' · Invite pupils when ready','<p class="tta-live-prompt">'+E(c.prompt)+'</p><p class="tta-eal" lang="zh-Hans">'+E(c.zh)+'</p><div class="tta-code-grid"><section><h2>STARTING CODE · 起始代码</h2><pre>'+E(c.starter)+'</pre></section><section><h2>EXPECTED OUTPUT · 预期输出</h2><pre>'+E(c.output)+'</pre></section></div>');
    }else{
      host.innerHTML=GameTeaching.render(state.id,state.step);
      if(state.demo){host.querySelector('.teach-visual').innerHTML='<div class="teach-two"><section><h3>TEACHER LIVE EXAMPLE · 老师演示</h3><pre class="teach-code"></pre></section><section class="teach-output"><h3>'+(state.demo.editing?'OUTPUT · Run to update · 运行后更新':'ACTUAL RUN · 实际运行结果')+'</h3><pre>'+E(state.demo.output)+'</pre></section></div>';GameCodeFocus.paint(host.querySelector('.teach-visual .teach-code'),state.demo.code,{key:'teaching-demo:'+token+':'+state.id,lines:state.demo.lines});}
    }
    document.getElementById('board-status').textContent='Lesson presentation · teacher notes and pupil responses are not projected';
  }
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==window.opener||!valid(e.data))return;state={...e.data};paint();});
  if(window.opener)window.opener.postMessage({type:'gameclub-teaching-ready',token},location.origin);paint();
})();
