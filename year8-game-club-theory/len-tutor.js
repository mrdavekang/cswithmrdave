/* A supplied runnable model followed by a small, saved, guided explanation. */
window.GameLenTutor=(()=>{
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=v=>String(v??'').toLowerCase().trim().replace(/[.!。！]/g,'');
 function assess(a={},ran=false){
  const action=['count','counts','counting','计数','计算','统计','数','세다','센다','셉니다','계산한다'].includes(norm(a.action));
  const things=['elements','element','items','item','values','value','players','player','names','元素','项目','值','名字','玩家','원소','항목','값','이름','플레이어'].includes(norm(a.elements));
  const before=['3','three','三','셋'].includes(norm(a.before)),after=['4','four','四','넷'].includes(norm(a.after));
  return {ok:action&&things&&before&&after&&ran,meaningOK:action&&things,changeOK:before&&after,action,things,before,after,ran};
 }
 const T=(lang,en,zh,ko)=>en+(lang==='zh'?' · '+zh:lang==='ko'?' · '+ko:'');
 function render(c,r,lang){
  const t=(...x)=>T(lang,...x),a=r.answer||{};
  const blank=(key,label,bank,numeric=false)=>`<span class="len-blank"><span class="len-wordbank">${esc(bank)}</span><input id="len-${key}" data-len-field="${key}" aria-label="${esc(label)}" value="${esc(a[key]||'')}" maxlength="40" ${numeric?'inputmode="numeric"':''} autocomplete="off" spellcheck="false"></span>`;
  return `<div class="len-tutor"><div class="len-demo"><section><h3>${t('1 · Read and run this supplied example','1 · 阅读并运行给定示例','1 · 주어진 예시를 읽고 실행하기')}</h3><pre class="len-model"><code>${esc(c.model)}</code></pre><div class="action-row"><button id="len-run" class="primary">▶ ${t('Run the example','运行示例','예시 실행')}</button><button id="len-stop" disabled>■ Stop</button></div><p class="small">${t('No typing needed for this demonstration. It runs real Python; each Run starts with the same three-player list.','这个示范不用输入代码，会运行真正的 Python；每次运行都从相同的三人名单开始。','이 시범은 코드 입력 없이 실제 Python을 실행합니다. 실행할 때마다 같은 세 명의 리스트로 시작합니다.')}</p></section><section><h3>${t('What the program prints','程序显示什么','프로그램 출력')}</h3><pre id="len-output" class="console">${esc(r.stdout||t('Run the example to see the counts.','运行示例以查看数量。','예시를 실행하여 개수를 보세요.'))}</pre><p id="len-run-feedback" role="status">${r.exampleRun?t('✓ Example run saved. Compare Before and After.','✓ 已保存运行结果。比较 Before 和 After。','✓ 실행 결과 저장됨. Before와 After를 비교하세요.'):t('Look at the number, not an index. append changes the list; len counts its elements.','看数量，不是索引。append 修改列表；len 计算元素个数。','인덱스가 아닌 개수를 보세요. append가 리스트를 바꾸고 len은 원소 수를 셉니다.')}</p></section></div><section class="len-explain"><h3>${t('2 · Explain what len does','2 · 解释 len 的作用','2 · len의 역할 설명하기')}</h3><p>${t('Use the small word banks beside the blanks. Complete both sentences. Short words or your home language are welcome.','使用空格旁的小词库，完成两个句子。可以使用简短词语或母语。','빈칸 옆의 낱말 도움을 사용하여 두 문장을 완성하세요. 짧은 단어나 모국어를 사용해도 됩니다.')}</p><div class="len-frame"><div class="len-sentence"><code>len(players)</code> ${blank('action','What len does',t('counts / changes','计数 / 改变','센다 / 바꾼다'))} the number of ${blank('elements','What len counts',t('elements / indexes','元素 / 索引','원소 / 인덱스'))} in the list.</div>${lang==='zh'?'<p class="translation">句子意思：len(players) ______ 列表中 ______ 的数量。</p>':lang==='ko'?'<p class="translation">문장 뜻: len(players)는 리스트의 ______ 수를 ______.</p>':''}<p id="len-meaning-feedback" class="len-inline-feedback" role="status"></p></div><div class="len-frame"><div class="len-sentence">After <code>append</code>, the length changes from ${blank('before','Length before append','3 / 4',true)} to ${blank('after','Length after append','3 / 4',true)}.</div>${lang==='zh'?'<p class="translation">句子意思：append 后，列表长度从 ______ 变为 ______。</p>':lang==='ko'?'<p class="translation">문장 뜻: append 후 리스트 길이는 ______에서 ______로 바뀝니다.</p>':''}<p id="len-change-feedback" class="len-inline-feedback" role="status"></p></div><button id="len-check" class="primary">${t('Check my explanation','检查我的解释','내 설명 확인')}</button><p id="len-feedback" class="feedback" role="status">${esc(r.feedback?.message||'')}</p><button id="len-help">${t('I need help · save and keep going','我需要帮助 · 保存并继续','도움이 필요해요 · 저장하고 계속')}</button></section></div>`;
 }
 function bind(c,r,api){
  const lang=api.language,t=(...x)=>T(lang,...x),el=id=>document.getElementById(id);
  const show=(id,text,ok)=>{el(id).textContent=text;el(id).classList.toggle('ok',ok);};
  function feedback(result){
   show('len-meaning-feedback',result.meaningOK?t('✓ Your sentence explains that len counts elements.','✓ 你的句子解释了 len 计算元素数量。','✓ len이 원소 수를 센다는 뜻을 설명했습니다.'):!result.action?t('Choose a counting word. len does not change the list. Try counts from the nearby bank.','选择表示计数的词。len 不会修改列表，可以参考旁边词库中的 counts。','수를 세는 낱말을 고르세요. len은 리스트를 바꾸지 않습니다. 옆의 counts를 참고하세요.'):t('What is being counted? Use elements (items or values also work), not indexes.','数的是什么？使用 elements（元素），不是 indexes（索引）。','무엇의 수를 셀까요? indexes가 아닌 elements(원소)를 사용하세요.'),result.meaningOK);
   show('len-change-feedback',result.changeOK?t('✓ The list grows from 3 elements to 4 after one append.','✓ 添加一个元素后，列表长度从 3 变为 4。','✓ append 한 번으로 원소 수가 3에서 4로 늘었습니다.'):t('Compare the two printed counts: Before is the starting length; After includes Orbit.','比较两个输出数字：Before 是起始长度，After 包含 Orbit。','출력된 두 수를 비교하세요. Before는 처음 길이이고 After에는 Orbit가 포함됩니다.'),result.changeOK);
  }
  for(const input of document.querySelectorAll('[data-len-field]'))input.oninput=()=>{
   const a={...(r.answer||{}),[input.dataset.lenField]:input.value};r.explanation=`len(players) ${a.action||'___'} the number of ${a.elements||'___'} in the list. After append, the length changes from ${a.before||'___'} to ${a.after||'___'}.`;r.explanationChecked=false;api.update('answer',a);el('len-meaning-feedback').textContent='';el('len-change-feedback').textContent='';el('len-feedback').textContent='';api.refresh();
  };
  el('len-stop').onclick=()=>PythonRunner.stop();
  el('len-run').onclick=async()=>{
   if(PythonRunner.busy())return;api.busy(true);el('len-run').disabled=true;el('len-stop').disabled=false;el('len-check').disabled=true;const output=el('len-output');output.textContent='';
   try{const result=await PythonRunner.run(c.model,s=>output.append(document.createTextNode(s))),ok=!result.error&&result.stdout.trim()===c.expected;
    r.exampleRun=ok;r.stdout=result.stdout;r.error=result.error;r.attempts.push({at:new Date().toISOString(),kind:'len-example-run',code:c.model,suppliedModel:true,...result,ok});api.record('attempt',r.attempts.at(-1));
    el('len-run-feedback').textContent=ok?t('✓ Example run saved. Compare Before and After, then complete the sentences.','✓ 已保存运行结果。比较 Before 和 After，再完成句子。','✓ 실행 결과 저장됨. Before와 After를 비교하고 문장을 완성하세요.'):result.error||t('Try Run again. Your written answers are kept.','请再运行一次，你填写的答案已保留。','다시 실행해 보세요. 입력한 답은 보관됩니다.');
    if(result.error)output.textContent=result.stdout+'\n'+result.error;
   }catch(e){el('len-run-feedback').textContent=t('Could not run yet. Your answers are kept. Try again.','暂时无法运行，答案已保留。请重试。','실행하지 못했습니다. 답은 보관됩니다. 다시 시도하세요.');}
   finally{api.busy(false);el('len-run').disabled=false;el('len-stop').disabled=true;el('len-check').disabled=false;api.save();api.refresh();}
  };
  el('len-check').onclick=()=>{
   const result=assess(r.answer,!!r.exampleRun);r.explanationChecked=true;r.status=result.ok?'correct':'revise';
   r.feedback={message:result.ok?t('✓ Explanation saved. Next, apply the difference between length and index.','✓ 解释已保存。接下来应用长度与索引的区别。','✓ 설명이 저장되었습니다. 다음으로 길이와 인덱스의 차이를 적용하세요.'):!result.ran?t('Your writing is saved. Run the example to observe the counts, then check again. You can still continue and return.','答案已保存。运行示例观察数量，再检查。你仍可以继续，之后再回来。','답이 저장되었습니다. 예시를 실행해 수를 확인하고 다시 검사하세요. 계속한 뒤 돌아와도 됩니다.'):t('Your draft is saved. Use the feedback beside each sentence, then try again.','草稿已保存。参考每个句子旁的反馈，再试一次。','초안이 저장되었습니다. 각 문장 옆 피드백을 보고 다시 시도하세요.')};
   feedback(result);el('len-feedback').textContent=r.feedback.message;r.attempts.push({at:new Date().toISOString(),kind:'len-explanation',answer:{...r.answer},explanation:r.explanation,ok:result.ok,feedback:r.feedback.message});api.record('attempt',r.attempts.at(-1));api.save();api.refresh();
  };
  el('len-help').onclick=()=>{r.status='needs-help';r.helpRequested=true;api.record('action',{action:'len-help'});api.save();api.next();};
  if(r.explanationChecked)feedback(assess(r.answer,!!r.exampleRun));
 }
 return {render,bind,assess};
})();
