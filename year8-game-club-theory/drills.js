/* Keyboard practice and review use the existing lesson save/trace callbacks. */
window.GameActivities=(()=>{
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const translated=(en,zh,ko,lang)=>en+(lang==='zh'?' · '+zh:lang==='ko'?' · '+ko:'');
 const words=(v,lang)=>esc(v.en||v)+(v[lang]&&lang!=='en'?'<p class="translation">'+esc(v[lang])+'</p>':'');
 const canonical=s=>String(s||'').trim().replace(/"/g,"'").replace(/\r/g,'');
 function render(c,r,lang){
  if(c.type==='len-tutor')return GameLenTutor.render(c,r,lang);
  if(c.type==='review-game')return quizHTML(r,lang);
  const typeRun=c.type==='type-run',phase=r.drillPhase||0,target=typeRun&&phase?c.target.replace('"'+c.original+'"','"'+c.changed+'"'):c.target;
  return `<section class="typing-studio"><div class="typing-summary"><span id="typing-accuracy">Accuracy —</span><span id="typing-speed">No speed target</span><span id="typing-position">Ready to type</span></div>${typeRun?'<p class="drill-steps">1 · Type the model → 2 · Run → 3 · Change one name → 4 · Run again</p>':''}<p>${typeRun?'MODEL · Type this complete program':'TYPE THE TEXT · Click the large area below'}</p><pre id="typing-target" class="typing-target study-target" aria-label="Typing model">${esc(target)}</pre>${typeRun?`<p class="callout">${phase?words(c.change,lang):translated('First type and run the model. Then try the small change.','先输入并运行示范，再做一个小改动。','먼저 예시를 입력하고 실행한 뒤 작은 변경을 해 보세요.',lang)}</p><label for="drill-code">${translated('YOUR CODE · type here','你的代码 · 在这里输入','내 코드 · 여기에 입력',lang)}</label><textarea id="drill-code" class="drill-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="drill-key-help">${esc(r.code||'')}</textarea><div class="action-row"><button id="drill-run" class="primary">▶ ${translated('Run my program','运行我的程序','내 프로그램 실행',lang)}</button><button id="drill-stop" disabled>■ Stop</button><button id="drill-change" ${r.modelRun?'':'disabled'}>Try the small change →</button></div><div class="drill-results"><section><h3>Expected output · ${phase?'changed version':'model'}</h3><pre>${esc(phase?c.modifiedExpected:c.expected)}</pre></section><section><h3>YOUR OUTPUT · after Run</h3><pre id="drill-output" class="console">${esc(r.stdout||'Run your program to see the result here.')}</pre></section></div>`:`<label for="typing-input">${translated('Click here and type the text above','点击此处，输入上面的文字','여기를 누르고 위 문장을 입력하세요',lang)}</label><textarea id="typing-input" class="typing-input" rows="2" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${esc(r.typed||'')}</textarea><p>${words(c.purpose,lang)}</p><button id="typing-retry">Try again · keep my earlier result</button>`}<p id="drill-key-help" class="small">${translated('Backspace corrects. In code, Tab inserts four spaces; Enter starts a new line. English input mode is recommended. Keyboard layouts vary.','退格键改错；代码中 Tab 输入四个空格，Enter 换行。建议使用英文输入模式。键盘布局可能不同。','Backspace로 고치세요. 코드에서 Tab은 네 칸, Enter는 새 줄입니다. 영어 입력 모드를 권장합니다. 키보드 배열은 다를 수 있습니다.',lang)}</p><div id="drill-feedback" class="feedback" role="status">${esc(r.feedback?.message||'Accuracy first. You can ask for help and return later.')}</div><button id="drill-help">${translated('I need help · keep going','我需要帮助 · 继续','도움이 필요해요 · 계속',lang)}</button></section>`;
 }
 function bind(c,r,api){
  if(c.type==='len-tutor')return GameLenTutor.bind(c,r,api);
  if(c.type==='review-game')return bindQuiz(r,api);
  const typeRun=c.type==='type-run',el=document.getElementById(typeRun?'drill-code':'typing-input'),status=document.getElementById('drill-feedback');
  if(c.beforeList&&r.appendOutputVersion!==2){
   r.appendOutputVersion=2;
   if(r.code&&canonical(r.stdout)!==canonical(r.drillPhase?c.modifiedExpected:c.expected)){
    r.status='draft';r.modelRun=false;r.changedRun=false;
    r.feedback={message:translated('Your earlier code is kept. This example now shows BEFORE and AFTER: add print(players) before append, keep the print after it, then Run again.','之前的代码已保留。现在需要显示修改前后：在 append 前加上 print(players)，保留后面的 print，再运行。','이전 코드는 보관했습니다. 이제 전후를 보여 주세요. append 앞에 print(players)를 추가하고 뒤의 print도 유지한 뒤 다시 실행하세요.',api.language)};
    status.textContent=r.feedback.message;
   }
   api.save();api.refresh();
  }
  if(typeRun){
   const targetEl=document.getElementById('typing-target'),heading=targetEl.previousElementSibling,change=targetEl.nextElementSibling,label=document.querySelector('label[for="drill-code"]'),actions=el.nextElementSibling,grid=document.createElement('div'),model=document.createElement('section'),own=document.createElement('section');
   grid.className='type-run-grid';heading.before(grid);model.className='type-model';own.className='type-own';model.append(heading,targetEl,change);own.append(label,el,actions);grid.append(model,own);
   if(c.beforeList){
    const added=r.drillPhase?c.changed:c.original,comparison=document.createElement('section'),lang=api.language;
    comparison.className='append-comparison';comparison.setAttribute('aria-label',translated('Before and after append','添加前后对比','append 전후 비교',lang));
    const panel=(title,values,after)=>`<section><h3>${esc(title)}</h3><div class="append-elements">${values.map((name,i)=>`<span class="append-element ${after&&i===values.length-1?'new-element':''}"><small>index ${i}</small><b>${esc(name)}</b>${after&&i===values.length-1?'<em>'+esc(translated('NEW','新增','새 원소',lang))+'</em>':''}</span>`).join('')}</div></section>`;
    comparison.innerHTML=panel(translated('Line 1 · Before append · 2 players','第 1 行 · 添加前 · 2 位玩家','1행 · 추가 전 · 2명',lang),c.beforeList,false)+panel(translated('Line 2 · After append · 3 players','第 2 行 · 添加后 · 3 位玩家','2행 · 추가 후 · 3명',lang),[...c.beforeList,added],true)+`<p>${esc(translated('The original players stay in the same order. append adds ONE new element at the end. The two print instructions let you compare before and after.','原来的玩家顺序不变。append 在末尾添加一个新元素。两个 print 让你对比修改前后。','기존 원소의 순서는 그대로입니다. append는 끝에 원소 하나를 추가합니다. print 두 줄로 전후를 비교하세요.',lang))}</p>`;
    document.querySelector('.drill-results').before(comparison);
   }
  }
  r.typing||={inserted:0,pasted:false};delete r.typing.errors;
  if(!typeRun&&!r.typing.finishedAt&&r.status==='correct'){
   const finish=[...(r.attempts||[])].reverse().find(a=>a.kind==='typing');
   if(finish?.at)r.typing.finishedAt=finish.at;
  }
  const stats=TypingStats.mount(document.querySelector('.typing-summary'),{typeRun,language:api.language,calm:!!r.calmStats,onCalm:value=>{r.calmStats=value;api.record('action',{action:'calm-typing-effects',value});api.save();}});
  let firstPaint=true;
  const target=()=>typeRun&&r.drillPhase?c.target.replace('"'+c.original+'"','"'+c.changed+'"'):c.target;
  const paint=()=>{
   const value=el.value,t=target(),matches=Array.from(value).filter((ch,i)=>ch===t[i]).length;
   document.getElementById('typing-target').innerHTML=Array.from(t).map((ch,i)=>`<span class="${i<value.length?(value[i]===ch?'typed-right':'typed-wrong'):i===value.length?'typing-caret':''}">${ch==='\n'?'\n':esc(ch)}</span>`).join('');
   const seconds=r.typing.startedAt?Math.max(1,((Date.parse(r.typing.finishedAt)||Date.now())-Date.parse(r.typing.startedAt))/1000):0;
   stats.update({matches,total:t.length,accuracy:Math.round(100*matches/Math.max(value.length,1)),wpm:seconds?Math.round(matches/5/(seconds/60)):0,pasted:r.typing.pasted,hasText:!!value.length},firstPaint);firstPaint=false;
  };
  el.addEventListener('paste',()=>{r.typing.pasted=true;status.textContent='Pasted text is not scored for typing speed. You can still edit and run your program.';});
  el.oninput=e=>{
   r.typing.startedAt||=new Date().toISOString();r.typing.inserted+=Math.max(0,el.value.length-(r.lastTypingLength||0));r.lastTypingLength=el.value.length;
   if(!typeRun&&el.value===c.target)r.typing.finishedAt=new Date().toISOString();else delete r.typing.finishedAt;
   api.update(typeRun?'code':'typed',el.value);paint();
   if(!typeRun&&el.value===c.target){r.status='correct';r.feedback={message:'✓ Text matched. Your typing practice is saved. Next leads to the next activity.'};status.textContent=r.feedback.message;r.attempts.push({at:new Date().toISOString(),kind:'typing',typed:el.value,...r.typing});api.record('attempt',r.attempts.at(-1));api.save();api.refresh();}
  };
  el.onkeydown=e=>{if(typeRun&&e.key==='Tab'){e.preventDefault();el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input'));}if(typeRun&&((e.key==='Enter'&&(e.ctrlKey||e.metaKey))||e.key==='F5')){e.preventDefault();document.getElementById('drill-run').click();}};
  document.getElementById('typing-target').oncopy=e=>e.preventDefault();
  document.getElementById('drill-help').onclick=()=>{r.status='needs-help';api.record('action',{action:'drill-help'});api.save();api.next();};
  if(!typeRun){document.getElementById('typing-retry').onclick=()=>{r.typing={inserted:0,pasted:false};r.typed='';r.status='draft';el.value='';api.record('action',{action:'typing-retry'});api.save();api.refresh();paint();el.focus();};paint();return;}
  document.getElementById('drill-change').onclick=()=>{r.drillPhase=1;r.status='draft';api.record('action',{action:'drill-small-change'});api.save();api.render();};
  document.getElementById('drill-stop').onclick=()=>PythonRunner.stop();
  document.getElementById('drill-run').onclick=async()=>{
   if(PythonRunner.busy())return;api.busy(true);el.readOnly=true;const code=el.value,phase=r.drillPhase||0,out=document.getElementById('drill-output');out.textContent='';document.getElementById('drill-run').disabled=true;document.getElementById('drill-stop').disabled=false;document.getElementById('drill-change').disabled=true;
   try{const result=await PythonRunner.run(code,s=>out.append(document.createTextNode(s))),expected=phase?c.modifiedExpected:c.expected;
    const valid=canonical(result.stdout)===canonical(expected)&&!result.error&&Array.isArray(result.vars?.players)&&(c.id==='typing-loop-run'?/\bwhile\s/.test(code):/\.append\s*\(/.test(code));
    r.code=code;r.stdout=result.stdout;r.error=result.error;if(valid){if(phase)r.changedRun=true;else r.modelRun=true;stats.celebrate(!!phase);}
   r.status=valid&&phase?'correct':valid?'draft':'revise';r.feedback={message:valid?phase?'✓ Your changed program works. You typed, ran and modified it.':c.beforeList?'✓ Both lists printed: 2 players before append, then 3 after. Now choose Try the small change.':'✓ The model ran. Now choose Try the small change.':'Keep your draft. '+(result.error||(c.beforeList?'You need TWO output lines. Put print(players) before append AND after append. Compare both lines, then Run again.':'Compare your program with the model and the expected output. Make one correction and Run again.'))};
    r.attempts.push({at:new Date().toISOString(),kind:'type-run',phase,code,...result,ok:valid});api.record('attempt',r.attempts.at(-1));status.textContent=r.feedback.message;if(result.error)out.textContent=result.stdout+'\n'+result.error;
   }catch(e){status.textContent='Your draft is kept. '+e.message;}finally{el.readOnly=false;api.busy(false);api.save();api.refresh();document.getElementById('drill-run').disabled=false;document.getElementById('drill-stop').disabled=true;document.getElementById('drill-change').disabled=!r.modelRun;}
  };paint();
 }
 function quizHTML(r,lang){
  const bank=GAME_REVIEW.questions,i=Math.max(0,Math.min(14,r.quizIndex||0)),q=bank[i],count=r.quizCorrect||0,unique=new Set((r.attempts||[]).filter(a=>a.kind==='quiz'&&a.ok).map(a=>a.question)).size;
  return `<div class="review-game"><div class="quiz-progress"><strong>${count} / ${GAME_REVIEW.goal} correct answers</strong><span>${unique} / 15 different questions answered correctly</span></div><p>Questions repeat. Wrong answers do not remove earned correct answers. This is practice, not proof of independent programming.</p>${GAME_REVIEW.assignmentUrl?`<a id="blooket-open" class="primary external-game" target="_blank" rel="noopener noreferrer" href="${esc(GAME_REVIEW.assignmentUrl)}">▶ Open Blooket assignment · goal 50 correct ↗</a><p>Blooket records that assignment separately. Opening it does not mark it complete here. The practice below saves in your lesson report.</p>`:'<p class="callout">The built-in practice is ready now. An external assignment link will be added after it is created and verified.</p>'}<div class="question-map" aria-label="All 15 review questions">${bank.map((_,j)=>`<button data-quiz-index="${j}" ${i===j?'aria-current="step"':''}>${j+1}</button>`).join('')}</div><h3>Question ${i+1} of 15 · round ${Math.floor((r.quizTurns||0)/15)+1}</h3><pre class="quiz-question">${esc(q.q)}</pre>${lang!=='en'?'<p class="translation">'+esc(q[lang]||'')+'</p>':''}<fieldset class="choices"><legend>Choose one answer</legend>${(r.quizOrder||[0,1,2,3]).map(k=>`<label class="choice"><input name="quiz-answer" type="radio" value="${k}" ${r.quizAnswer===k?'checked':''} ${r.quizChecked?'disabled':''}>${esc(q.options[k])}</label>`).join('')}</fieldset><div class="action-row"><button id="quiz-check" class="primary" ${r.quizChecked?'disabled':''}>Check this answer</button><button id="quiz-next">Next review question →</button></div><div id="quiz-feedback" class="feedback" role="status">${esc(r.quizChecked?r.feedback?.message||'':'')}</div>${count>=50?'<p class="callout">✓ You reached 50 correct answers in the built-in practice. You may keep practising.</p>':''}</div>`;
 }
 function bindQuiz(r,api){
  const change=i=>{r.quizIndex=i;r.quizAnswer=undefined;r.quizChecked=false;r.quizOrder=[0,1,2,3].sort(()=>Math.random()-.5);api.save();api.render();};
  for(const b of document.querySelectorAll('[data-quiz-index]'))b.onclick=()=>change(Number(b.dataset.quizIndex));
  for(const e of document.querySelectorAll('[name=quiz-answer]'))e.onchange=()=>{r.quizAnswer=Number(e.value);api.record('field',{field:'quiz-answer',question:r.quizIndex||0,value:r.quizAnswer},'quiz-answer');api.save();};
  document.getElementById('quiz-check').onclick=()=>{if(r.quizAnswer===undefined)return;const i=r.quizIndex||0,q=GAME_REVIEW.questions[i],ok=r.quizAnswer===q.answer;r.quizChecked=true;r.quizCorrect=(r.quizCorrect||0)+(ok?1:0);r.status=r.quizCorrect>=50?'correct':'draft';r.feedback={message:(ok?'✓ Correct. ':'Not yet. ')+q.why+(api.language==='zh'?' · '+q.whyZh:api.language==='ko'?' · '+q.whyKo:'')};r.attempts.push({at:new Date().toISOString(),kind:'quiz',question:i,answer:r.quizAnswer,ok,totalCorrect:r.quizCorrect});api.record('attempt',r.attempts.at(-1));api.save();api.render();};
  document.getElementById('quiz-next').onclick=()=>{r.quizTurns=(r.quizTurns||0)+1;change(((r.quizIndex||0)+1)%15);};
  const external=document.getElementById('blooket-open');if(external)external.onclick=()=>{r.externalOpenedAt=new Date().toISOString();api.record('action',{action:'open-blooket',completionVerified:false});api.save();};
 }
 return {render,bind};
})();
