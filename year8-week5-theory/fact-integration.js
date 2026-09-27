'use strict';
(()=>{
 const api=window.Year8FactSlides,bridge=window.LessonClassroom;if(!api||!bridge)return;
 const facts=api.facts,lookup=id=>facts.find(f=>f.id===id);let selected=null,pending=null;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function answer(f,key,label){const id=f.id+'_'+key;return `<label class="fact-answer" for="${id}"><span>${esc(label)}</span><textarea id="${id}" data-fact-answer="${id}" rows="3">${esc(api.get(id))}</textarea></label>`;}
 function renderFact(){
  let panel=document.getElementById('fact-overlay');if(!selected){panel?.remove();document.body.classList.remove('fact-view');return;}
  const fact=lookup(selected);if(!fact)return;if(!panel){panel=document.createElement('section');panel.id='fact-overlay';panel.setAttribute('aria-label','Teacher-led fact slide');document.body.append(panel);}document.body.classList.add('fact-view');
  const locked=typeof window.ClassroomMode?.locked==='function'&&window.ClassroomMode.locked();
  panel.innerHTML=`<header><div><span class="fact-number">FACT ${fact.number}</span><h1>${esc(fact.title)}</h1></div>${bridge.info().teacher?'<button type="button" data-fact-close>Return to lesson</button>':''}</header><main><section class="fact-teach"><p class="fact-statement">${esc(fact.statement)}</p><pre><code>${esc(fact.code)}</code></pre><div class="fact-visual">${fact.visual.map(([a,b])=>`<article><strong>${esc(a)}</strong><span>${esc(b)}</span></article>`).join('')}</div></section><section class="fact-response"><h2>Class questions</h2><p>Write while the class discusses the example. Your answer stays on this browser and is added to your PDF.</p>${fact.questions.map(([key,label])=>answer(fact,key,label)).join('')}<div class="fact-challenge"><h2>Challenge</h2>${answer(fact,'challenge',fact.challenge)}</div></section></main><footer><b>WAGBA</b> ${esc(window.LESSON.goals.wagba)} <span>comparison · condition · Boolean · branch · boundary · indentation</span></footer>`;
  panel.querySelectorAll('[data-fact-answer]').forEach(el=>{el.disabled=locked&&['view','attention'].includes(window.ClassroomMode?.mode?.());el.addEventListener('input',()=>api.set(el.dataset.factAnswer,el.value));});
  panel.querySelector('[data-fact-close]')?.addEventListener('click',()=>{selected=null;renderFact();bridge.navigate(bridge.info().page);window.dispatchEvent(new Event('lesson:render'));});
 }
 function open(id){if(!lookup(id))return;if(bridge.info().entry){pending=id;return;}selected=id;renderFact();window.dispatchEvent(new Event('lesson:render'));}
 window.LessonClassroom=Object.freeze({
  info:()=>({...bridge.info(),page:selected||bridge.info().page}),pages:()=>[...bridge.pages(),...facts.map(f=>f.id)],destinations:bridge.destinations,
  label:()=>selected?lookup(selected).title:bridge.label(),teacherPages:()=>facts.map(f=>({id:f.id,title:`Fact ${f.number} · ${f.title}`})),openTeacherPage:id=>{if(bridge.info().teacher)open(id);},
  navigate:id=>{if(lookup(id))open(id);else{selected=null;renderFact();bridge.navigate(id);}},
  move:id=>{if(bridge.info().teacher)return;bridge.captureOwn?.();if(lookup(id))open(id);else{pending=null;selected=null;renderFact();bridge.move(id);}},
  captureOwn:bridge.captureOwn,returnOwn:()=>{pending=null;selected=null;renderFact();bridge.returnOwn?.();},setSession:bridge.setSession,
  clearTarget:()=>{pending=null;selected=null;renderFact();bridge.clearTarget();},demoPrograms:bridge.demoPrograms,startDemo:id=>{if(!bridge.info().teacher)return false;selected=null;renderFact();return bridge.startDemo(id);},stopDemo:bridge.stopDemo,demoState:bridge.demoState
 });
 window.addEventListener('lesson:render',()=>{if(pending&&!bridge.info().entry){selected=pending;pending=null;}if(selected)renderFact();});
})();
