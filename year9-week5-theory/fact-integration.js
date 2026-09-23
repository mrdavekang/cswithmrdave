/* Fact pages are ephemeral teacher-led views, outside the student route. */
(()=>{
 const facts=window.WEEK5_FACTS;
 let selected=null,pending=null;
 const baseRender=render,baseGo=go,baseReport=report,bridge=window.LessonClassroom;
 const lookup=id=>facts.find(f=>f.id===id);
 const answer=(f,key,label)=>`<label class="fact-answer" for="${f.id}_${key}">${bi(label)}<textarea id="${f.id}_${key}" data-answer="${f.id}_${key}" rows="2">${esc(val(f.id+'_'+key))}</textarea></label>`;
 function body(f){return `<div class="fact-slide"><p class="fact-statement">${bi(f.statement)}</p>${f.code?codeBox(f.code):`<div class="fact-rule">${bi(f.rule)}</div>`}${f.example?`<div class="fact-example"><code>${f.example}</code><span>${bi(f.caption)}</span></div>`:''}${f.id==='fact-boundary'?`<div class="fact-boundaries"><span>9</span><span>10</span><span>11</span></div>`:''}<section class="fact-questions"><h2>${t('Class question','Soalan kelas','课堂问题')}</h2><p class="small">${t('Write while we discuss. Answers stay in your notebook and PDF.','Tulis semasa perbincangan. Jawapan kekal dalam buku nota dan PDF anda.','讨论时填写。答案保存在你的学习记录和 PDF 中。')}</p>${f.questions.map(([k,l])=>answer(f,k,l)).join('')}</section><section class="fact-challenge"><h2>${t('Challenge task','Tugasan cabaran','挑战任务')}</h2>${answer(f,'challenge',f.challenge)}</section></div>`;}
 render=function(){if(pending&&!entry){selected=pending;pending=null;}document.body.classList.toggle('fact-view',!!selected&&!entry);baseRender();if(!selected||entry)return;const f=lookup(selected);const side=document.querySelector('.sidebar');if(side)side.innerHTML+=`<section class="fact-keywords"><h3>${t('Keywords','Kata kunci','关键词')}</h3><p>${bi(B('Nested selection · condition · indentation · validation · normal data · boundary data · erroneous data','Pemilihan bersarang · syarat · inden · pengesahan · data normal · data sempadan · data salah','嵌套选择 · 条件 · 缩进 · 输入验证 · 正常数据 · 边界数据 · 错误数据'))}</p></section>`;document.getElementById('main').innerHTML=`<div class="page-heading"><h1 id="page-title" tabindex="-1">${bi(f.title)}</h1></div>${body(f)}<footer class="page-footer"><button data-page="${state.page}">${t('Return to lesson','Kembali ke pelajaran','返回课程')}</button></footer>`;document.querySelectorAll('[aria-current="page"]').forEach(el=>el.removeAttribute('aria-current'));window.dispatchEvent(new Event('lesson:render'));};
 go=function(page,remote=false){if(!remote&&window.ClassroomMode?.locked())return;if(!PAGES.some(p=>p[0]===page))return;selected=null;baseGo(page,remote);};
 function open(id){if(!lookup(id))return;if(entry){pending=id;return;}if(live)finish('stopped');selected=id;render();window.scrollTo(0,0);document.getElementById('page-title')?.focus();}
 window.LessonClassroom=Object.freeze({
  info:()=>({...bridge.info(),page:selected||bridge.info().page}),pages:()=>[...bridge.pages(),...facts.map(f=>f.id)],
  label:()=>selected?txt(lookup(selected).title):bridge.label(),teacherPages:()=>facts.map(f=>({id:f.id,title:txt(f.title)})),
  openTeacherPage:id=>{if(teacher)open(id);},
  move:id=>{if(teacher)return;if(lookup(id))open(id);else{pending=null;selected=null;bridge.move(id);}},
  clearTarget:()=>{pending=null;bridge.clearTarget();}
 });
 report=function(){let html=baseReport(),extra='';for(const f of facts){const qs=[...f.questions,['challenge',f.challenge]].filter(([k])=>val(f.id+'_'+k).trim());if(qs.length)extra+=`<section><h2>${bi(f.title)}</h2>${qs.map(([k,l])=>`<h3>${bi(l)}</h3><p>${esc(val(f.id+'_'+k))}</p>`).join('')}</section>`;}return html.replace('</article>',extra+'</article>');};
 document.addEventListener('click',e=>{if(!window.ClassroomMode?.locked()&&e.target.closest('[data-home],[data-action="home"]')){selected=null;pending=null;}},true);
 render();
})();
