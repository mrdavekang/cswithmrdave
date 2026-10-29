/* ISP/Tenby KSU: remember, practise, explain. Evidence and feelings stay separate. */
window.RouteReflection=(()=>{
  const text=(en,zh,ko)=>({en,zh,ko});
  const startingMethods=[
    ['remembered',text('I knew the index before checking.','我查看图之前就知道索引。','그림을 확인하기 전에 인덱스를 알았어요.')],
    ['diagram',text('I used the numbered diagram.','我借助了带编号的图。','번호가 있는 그림을 사용했어요.')],
    ['model',text('I still need someone to show me.','我还需要有人示范。','아직 누군가의 시범이 필요해요.')],
    ['not-yet',text('I have not worked this out yet.','我还没有弄明白。','아직 알아내지 못했어요.')]
  ];
  const phases=[
    ['New learning',text('New Learning','新学习','새로운 학습'),text('Using indexes was new and challenging, but I could make progress — on my own or with help.','使用索引是新的挑战，但我能独立或在帮助下取得进步。','인덱스 사용은 새롭고 어려웠지만 혼자 또는 도움을 받으며 발전할 수 있었어요.')],
    ['Consolidating',text('Consolidating','巩固中','다지는 중'),text('I am using something I have met before. I am becoming more accurate, confident or independent.','我在运用以前学过的内容，变得更准确、更自信或更独立。','전에 배운 것을 사용하며 더 정확해지고 자신감이 생기거나 더 독립적으로 하고 있어요.')],
    ['Treading water',text('Treading Water','需要更多挑战','더 많은 도전이 필요해요'),text('I could already do and explain this. It felt too easy to stretch me; I need a harder problem.','这些我本来就能做并解释，任务太容易，没有挑战到我；我需要更难的问题。','이미 할 수 있고 설명할 수 있었어요. 너무 쉬워서 도전이 되지 않았어요. 더 어려운 문제가 필요해요.')],
    ['Need help / drowning',text('Drowning — I need help','感到困难——我需要帮助','너무 어려워요 — 도움이 필요해요'),text('I am still stuck, even with the example. I need someone to model one step with me.','即使有例子，我仍然卡住了，需要有人带我做一步。','예시를 봐도 막혀 있어요. 누군가와 한 단계를 함께 해 봐야 해요.')]
  ];
  const byId=L=>Object.fromEntries(L.cards.map(c=>[c.id,c]));
  function normalise(s){
    if(!s.reflection||s.reflection.version!==2)s.reflection={version:2,start:null,understanding:null};
    if(!['evidence','phase'].includes(s.reflection.pitView))s.reflection.pitView='evidence';
    return s;
  }
  function starterEvidence(s,L){
    const cards=L.cards.filter(c=>c.stage==='starter');
    const c=cards.find(c=>c.id==='dn2'&&Number.isInteger(s.responses[c.id]?.choice))||cards.find(c=>Number.isInteger(s.responses[c.id]?.choice))||cards.find(c=>c.id==='dn2')||cards[0];
    const r=s.responses[c.id]||{},attempts=s.events.filter(e=>e?.type==='answer'&&e.card===c.id&&Number.isInteger(e.value));
    return {cardId:c.id,title:c.title,question:c.question.en,choice:Number.isInteger(r.choice)?r.choice:null,answer:Number.isInteger(r.choice)?c.options[r.choice]:null,correct:Number.isInteger(r.choice)?r.choice===c.answer:null,firstAnswer:attempts.length?c.options[attempts[0].value]:null,firstCorrect:attempts.length?attempts[0].value===c.answer:null,attempts:attempts.length,expected:c.options[c.answer],values:c.values||['LEFT','UP','RIGHT']};
  }
  function codeRuns(s,L){
    return L.cards.filter(c=>c.type==='coding').flatMap((c,order)=>(s.responses[c.id]?.runs||[]).map((a,i)=>({...a,cardId:c.id,title:c.title,order,attempt:i+1,currentDraftChanged:s.responses[c.id].code!==a.code}))).sort((a,b)=>String(a.at).localeCompare(String(b.at))||a.order-b.order||a.attempt-b.attempt);
  }
  function skillEvidence(s,L){
    const runs=codeRuns(s,L),a=runs.at(-1);
    if(!a)return {attempted:false};
    return {attempted:true,cardId:a.cardId,title:a.title,at:a.at,code:a.code,output:a.output,error:a.error||null,passed:!!a.feedback?.passed,currentDraftChanged:a.currentDraftChanged,attempt:a.attempt};
  }
  function parseList(output){
    for(const line of String(output||'').trim().split('\n').reverse())try{const value=JSON.parse(line.trim().replace(/'/g,'"'));if(Array.isArray(value)&&value.length===3&&value.every(x=>typeof x==='string'))return value;}catch{}
    return null;
  }
  function repairEvidence(s,L){
    for(const a of codeRuns(s,L).reverse()){
      const lists=a.analysis?.lists?.filter(x=>x.name==='route')||[],updates=a.analysis?.updates?.filter(x=>x.name==='route')||[];
      if(a.error||lists.length!==1||updates.length!==1||lists[0].elements.length!==3)continue;
      const before=lists[0].elements,after=Array.isArray(a.storedRoute)?a.storedRoute:a.feedback?.passed?parseList(a.output):null;
      if(!after||after.length!==3)continue;
      const different=before.map((v,i)=>v!==after[i]?i:-1).filter(i=>i>=0);
      if(different.length!==1)continue;
      return {source:'student',cardId:a.cardId,title:a.title,at:a.at,before:[...before],after:[...after],index:different[0],passed:!!a.feedback?.passed};
    }
    return {source:'example',cardId:null,title:'Worked example — not your code',before:['UP','RIGHT','DOWN'],after:['UP','LEFT','DOWN'],index:1};
  }
  function nextStep(s,L){
    const start=s.reflection?.start;if(!start)return {kind:'none',target:null,message:text('First look at your starter response. Then choose what actually helped you. Nothing here is a grade.','先看自己的热身答案，再选择真正帮助你的方法。这里不评分。','먼저 시작 문제의 답을 보고 실제로 도움이 된 것을 고르세요. 점수가 아닙니다.')};
    const source=start.source;
    if(source.choice==null)return {kind:'starter',target:source.cardId,message:text('There is no starter answer to reflect on yet. Try that question first; the numbered visual is there to help.','还没有热身答案可供回顾。先试那道题，可以使用编号图。','아직 돌아볼 시작 문제 답이 없어요. 번호 그림을 보며 먼저 그 문제를 해 보세요.')};
    if(source.correct===false)return {kind:'model',target:source.cardId,message:text('Your selected answer did not yet match that question. Count the positions from 0 with the diagram, then try the starter again.','你的答案暂时还不符合题目。借助图从 0 开始数位置，再试热身题。','선택한 답이 아직 문제와 맞지 않았어요. 그림에서 0부터 위치를 세고 시작 문제를 다시 해 보세요.')};
    if(start.method==='remembered')return {kind:'practice',target:'m1-1',message:text('Keep that knowledge active. Build the route, then try reading a different position before checking the diagram. One correct starter does not prove the coding skill yet.','保持这个知识。创建路线后，先尝试读取另一个位置，再核对图。热身答对一题不等于已掌握编程技能。','이 지식을 사용해 경로를 만들고 그림을 보기 전에 다른 위치를 읽어 보세요. 시작 문제 하나를 맞혔다고 코딩 기능까지 확인된 것은 아닙니다.')};
    if(start.method==='diagram')return {kind:'practice',target:'m1-1',message:text('Keep the index diagram visible for your first coding attempt. On the next attempt, say the index before checking it.','第一次编程时保留索引图。下一次先说出索引，再检查。','첫 코딩 시도에는 인덱스 그림을 보세요. 다음에는 먼저 인덱스를 말한 뒤 확인하세요.')};
    return {kind:'model',target:'m1-1',message:text('Use the short counting model below. Ask your teacher or buddy to explain one step, then make the next change yourself.','先看下面的简短示范。请老师或同伴解释一步，再自己做下一步。','아래의 짧은 시범을 보세요. 선생님이나 친구에게 한 단계를 설명해 달라고 하고 다음 변경은 직접 하세요.')};
  }
  function understandingOptions(e){return [text('It replaces the value at index '+e.index+'. The other positions keep their values.','它替换索引 '+e.index+' 的值，其他位置的值不变。','인덱스 '+e.index+'의 값만 바꾸고 다른 위치의 값은 유지합니다.'),text('It adds a fourth element to the list.','它增加了第四个元素。','리스트에 네 번째 요소를 추가합니다.'),text('It changes every element in the list.','它修改了列表中的所有元素。','리스트의 모든 요소를 바꿉니다.'),text('I am not sure yet — show me the comparison.','我还不确定——请带我比较。','아직 확실하지 않아요 — 함께 비교해 주세요.')];}
  function phaseAdvice(s){
    if(s.pit.phase==='Treading water')return text('Go Further: try Track every change. Predict all three routes before running, then explain any mismatch.','继续挑战 Track every change。运行前预测三条路线，再解释不同之处。','Track every change에 도전하세요. 실행 전에 세 경로를 예상하고 다른 결과가 있으면 설명하세요.');
    if(s.pit.phase==='Need help / drowning')return text('Raise your hand and show this page to your teacher. Ask to model one confusing index or update. Saving this reflection does not send an alert.','请举手并把本页给老师看，请老师示范一个不明白的索引或更新。保存反思不会自动通知老师。','손을 들고 이 페이지를 선생님께 보여 주세요. 헷갈리는 인덱스나 갱신 한 단계를 함께 해 보세요. 저장해도 알림은 전송되지 않습니다.');
    if(s.pit.phase==='Consolidating')return text('Try A new route to repair without its hint. Run it, then explain which two positions stayed unchanged.','不看提示尝试 A new route to repair。运行后解释哪两个位置不变。','힌트 없이 A new route to repair를 해 보세요. 실행 후 유지된 두 위치를 설명하세요.');
    if(s.pit.phase==='New learning')return text('Revisit one worked example. Make a different indexed change yourself, then show what changed.','重看一个示范，再自己做一次不同位置的修改，并展示变化。','시범 하나를 다시 보고 다른 인덱스를 직접 바꾼 뒤 달라진 것을 보여 주세요.');
    return text('Choose a sentence that fits your experience. Use your work and how the challenge felt; do not choose by speed alone.','选择符合实际经历的句子，结合代码和挑战感受，不只看速度。','작업과 도전의 느낌을 근거로 경험에 맞는 문장을 고르세요. 속도만으로 고르지 마세요.');
  }
  function learningHtml(s,L,ui){
    const {esc,support,listVisual}=ui,e=starterEvidence(s,L),chosen=s.reflection?.start?.method,step=nextStep(s,L);
    const say=v=>'<p>'+esc(v.en)+'</p>'+support(v);
    return '<div class="reflection-page"><p class="intro-text">Three kinds of learning. Everyone uses all three — they are not labels for different students.</p>'+support(text('','每个人都会用到三种学习，不是给学生贴标签。','모두 세 가지 학습을 사용합니다. 학생의 유형을 나누는 말이 아닙니다.'))+
      '<div class="learning-types"><section class="learning-type knowledge"><span class="type-letter">K</span><h2>Knowledge <small>Remember it</small></h2>'+say(text('Remember a fact: the first element has index 0.','记住事实：第一个元素的索引是 0。','사실을 기억해요: 첫 요소의 인덱스는 0입니다.'))+'<p class="how-better"><b>Get better:</b> recall the index before checking the visual.</p>'+support(text('','先回想索引，再看图核对。','그림을 보기 전에 인덱스를 떠올려 보세요.'))+'</section>'+
      '<section class="learning-type skills"><span class="type-letter">S</span><h2>Skills <small>Practise doing it</small></h2>'+say(text('Write, run and correct code that reads or changes an element.','编写、运行并修正读取或修改元素的代码。','요소를 읽거나 바꾸는 코드를 쓰고 실행하고 고쳐요.'))+'<code>colours[1] = "GOLD"</code><p class="how-better"><b>Get better:</b> make one change, run and compare.</p>'+support(text('','修改一处，运行，再比较结果。','한 곳을 바꾸고 실행해 결과를 비교하세요.'))+'</section>'+
      '<section class="learning-type understanding"><span class="type-letter">U</span><h2>Understanding <small>Explain why</small></h2>'+say(text('Explain why an indexed update changes one element, not every element.','解释为什么索引更新只改一个元素，而不是所有元素。','인덱스 갱신이 모든 요소가 아니라 하나만 바꾸는 이유를 설명해요.'))+'<p class="how-better"><b>Get better:</b> compare before and after; explain what stayed.</p>'+support(text('','比较前后结果，解释什么保持不变。','전후를 비교하고 유지된 것을 설명하세요.'))+'</section></div>'+
      '<section class="reflection-evidence"><div class="starter-detail"><span class="eyebrow">KNOWLEDGE · YOUR STARTER EVIDENCE</span><h2>What helped you find the index?</h2>'+support(text('','什么帮助你找到了索引？','인덱스를 찾는 데 무엇이 도움이 되었나요?'))+'<p>'+esc(e.question)+'</p>'+listVisual(e.values)+'<p class="evidence-answer">Your answer: <b>'+esc(e.answer??'Not answered yet')+'</b>'+(e.choice!=null?' · '+(e.correct?'Matches this question':'Needs another look'):'')+'</p>'+(e.firstAnswer!=null&&e.attempts>1?'<p class="subtle">First recorded answer: '+esc(e.firstAnswer)+'. Latest answer shown above. Changing an answer after feedback is useful practice.</p>':'')+'<p>This checks finding an index. It does not yet show that you can write an update.</p>'+support(text('','这只检查找索引，还不能证明你会编写更新代码。','이것은 인덱스 찾기를 확인한 것이며 갱신 코드를 쓸 수 있다는 증거는 아직 아닙니다.'))+'</div><div class="starter-methods" role="group" aria-label="What helped you answer?">'+startingMethods.map(([id,v])=>'<button class="choice reflection-choice '+(chosen===id?'selected':'')+'" data-start-method="'+id+'" aria-pressed="'+(chosen===id)+'">'+esc(v.en)+support(v)+'</button>').join('')+'</div></section>'+
      '<div class="reference next-learning"><h3>Your next action</h3>'+say(step.message)+(step.kind==='model'?'<div class="counting-model"><b>Count positions, not the direction words.</b>'+listVisual(e.values)+'<p>First → 0 &nbsp; Second → 1 &nbsp; Third → 2</p>'+support(text('','数位置，不是方向词。第一项是 0，第二项是 1，第三项是 2。','방향 단어가 아니라 위치를 세세요. 첫째는 0, 둘째는 1, 셋째는 2입니다.'))+'</div>':'')+(step.target?'<button class="button outline" data-go="'+step.target+'">'+(step.target?.startsWith('dn')?'Revisit the starter':'Try this next step')+' →</button>':'')+'</div>'+
      '<p class="not-yet-note"><b>Skills and Understanding: not checked by this starter.</b> We will revisit these after you have written and run your code. You do not have to rate something you have not tried.</p>'+support(text('','热身题还没检查技能和理解。完成编程和运行后再回顾，不必评价尚未尝试的事情。','시작 문제는 기능과 이해를 아직 확인하지 않았어요. 코드를 쓰고 실행한 뒤 돌아봅니다. 해 보지 않은 것을 평가할 필요는 없습니다.'))+'</div>';
  }
  function pitHtml(s,L,ui){
    const {esc,support,listVisual}=ui,k=starterEvidence(s,L),skill=skillEvidence(s,L),u=s.reflection?.understanding,e=u?.evidence||repairEvidence(s,L),opts=understandingOptions(e);
    const say=v=>'<p>'+esc(v.en)+'</p>'+support(v);
    const evidenceCards='<div class="pit-evidence-grid"><section class="pit-evidence knowledge"><h2><span class="type-letter">K</span> Knowledge <small>What can I remember?</small></h2>'+say(text('Point to an element and say its index.','指出一个元素，说出它的索引。','요소를 짚고 인덱스를 말해 보세요.')) +listVisual(k.values)+'<p>Starter: '+esc(k.question)+'</p><p>Your latest answer: <b>'+esc(k.answer??'Not attempted yet')+'</b></p>'+support(text('','没有尝试过就保留“尚未尝试”，不等于不会。','아직 해 보지 않았다면 그대로 두세요. 할 수 없다는 뜻은 아닙니다.'))+'<button class="text-button" data-go="'+k.cardId+'">Revisit this starter</button>'+goalCheck(0,s,L,ui)+'</section>'+
      '<section class="pit-evidence skills"><h2><span class="type-letter">S</span> Skills <small>What can I do?</small></h2>'+say(text('Use your code and output, not only a correct quiz answer.','看自己的代码和输出，不只看测验答案。','퀴즈 답만이 아니라 내 코드와 출력을 보세요.'))+(skill.attempted?'<span class="status-pill">YOUR RUN · '+esc(skill.title)+' · Attempt '+skill.attempt+'</span><pre class="evidence-code">'+esc(skill.code)+'</pre><b class="subtle">Recorded output</b><pre class="evidence-code">'+esc(skill.output||'(No output)')+'</pre>'+(skill.error?'<p class="feedback">'+esc(skill.error)+'</p>':'')+'<p class="subtle">'+(skill.passed?'This run met its task target. Independence still needs your explanation or teacher observation.':'This run did not yet meet its task target. A failed attempt is useful evidence too.')+'</p>'+(skill.currentDraftChanged?'<p class="not-yet-note">Your current draft differs from this recorded run. Run it again to check that version.</p>':''):'<p class="not-yet-note"><b>No code run recorded yet.</b> You do not have to judge this skill before trying it.</p>')+support(text('','代码运行结果能展示练习过程，但程序运行成功不自动证明是独立完成。','실행 결과는 연습의 증거이지만 실행 성공이 곧 독립 수행을 증명하지는 않습니다.'))+'<button class="text-button" data-go="'+(skill.cardId||'m1-1')+'">'+(skill.attempted?'Return to this code':'Try Main Task 1')+'</button>'+goalCheck(1,s,L,ui)+'</section></div>';
    const html='<div class="reflection-page"><p class="intro-text">Look at what you actually tried. Then describe how the challenge felt. Evidence and feelings are different — both matter.</p>'+support(text('','先看自己真正尝试过的任务，再描述挑战的感受。证据和感受不同，但都重要。','실제로 해 본 작업을 보고 도전이 어떻게 느껴졌는지 말하세요. 증거와 느낌은 다르며 둘 다 중요합니다.'))+evidenceCards+
      '<section class="pit-evidence understanding"><h2><span class="type-letter">U</span> Understanding <small>Can I explain why?</small></h2><span class="status-pill">'+(e.source==='student'?'YOUR RUN · '+esc(e.title):'WORKED EXAMPLE · NOT YOUR CODE')+'</span>'+(e.source==='example'?say(text('You have not recorded a usable single-element repair yet. This labelled example can help you compare; it is not evidence of your own coding.','还没有记录可比较的单项修复。下面是标明的示范，不是你自己的编程证据。','비교할 수 있는 한 요소 수정 기록이 아직 없어요. 아래는 표시된 예시이며 내 코딩의 증거는 아닙니다.')):!e.passed?'<p class="subtle">This run changed one stored value, but its task may still need a correction.</p>':'')+'<div class="before-after"><div><h3>Before</h3>'+listVisual(e.before,e.index)+'</div><div><h3>After</h3>'+listVisual(e.after,e.index)+'</div></div><h3>What explains this change?</h3>'+support(text('','哪句话解释了这个变化？','어떤 설명이 이 변화를 나타내나요?'))+'<div class="understanding-options">'+opts.map((v,i)=>'<button class="choice reflection-choice '+(u?.choice===i?'selected':'')+'" data-understanding="'+i+'" aria-pressed="'+(u?.choice===i)+'">'+esc(v.en)+support(v)+'</button>').join('')+'</div>'+(u?'<div class="feedback '+(u.choice===0?'success':'')+'" role="status">'+say(u.choice===0?text('Yes. Compare the highlighted position. The list still contains three elements. Explain or point to one value that stayed unchanged.','对。比较标出的位置，列表仍有三项。解释或指出一个保持不变的值。','맞아요. 강조된 위치를 비교하세요. 요소는 여전히 세 개입니다. 유지된 값 하나를 짚거나 설명하세요.'):text('Compare the highlighted pair first. One position changes from '+e.before[e.index]+' to '+e.after[e.index]+'. The other two positions stay unchanged. You can try again or explain by pointing.','先比较标出的一对值。一个位置从 '+e.before[e.index]+' 改成 '+e.after[e.index]+'，另外两项不变。可重试，也可指着图解释。','강조된 두 값을 먼저 비교하세요. 한 위치가 '+e.before[e.index]+'에서 '+e.after[e.index]+'로 바뀌고 나머지 두 위치는 그대로입니다. 다시 답하거나 그림을 짚어 설명해도 됩니다.'))+'</div>':'')+goalCheck(2,s,L,ui)+'</section>'+
      '<section class="phase-reflection"><h2>Learning Pitstop · how did this feel?</h2>'+say(text('These are temporary phases, not levels or scores. You can be secure with the facts but still need help writing the code. Choose the sentence that best describes your experience today.','这是暂时的学习阶段，不是等级或分数。你可能记得事实，却仍需编程帮助。选择最符合今天经历的句子。','이것은 잠시의 학습 단계이며 수준이나 점수가 아닙니다. 사실을 알아도 코딩에는 도움이 필요할 수 있어요. 오늘의 경험에 맞는 문장을 고르세요.'))+'<div class="phase-options">'+phases.map(([id,name,desc])=>'<button class="choice '+(s.pit.phase===id?'selected':'')+'" data-phase="'+id+'" aria-pressed="'+(s.pit.phase===id)+'"><strong>'+esc(name.en)+'</strong>'+support(name)+'<p>'+esc(desc.en)+'</p>'+support(desc)+'</button>').join('')+'</div><label for="pit-reason"><h3 style="margin-top:20px">One short example — speak, point or write</h3></label><p class="subtle">Before, I needed ___. Now I can ___. My next step is ___. You can say which K, S or U part still needs help.</p>'+support(text('','可以说、指图，或用自己的语言写：“之前我需要___，现在我能___，下一步是___。”也可写“已向老师口头解释”。','말하거나 그림을 짚거나 편한 언어로 쓰세요: “전에는 ___가 필요했어요. 이제 ___할 수 있어요. 다음은 ___예요.” “선생님께 말로 설명함”이라고 적어도 됩니다.'))+'<textarea id="pit-reason" class="reflection" maxlength="2000" placeholder="A short example or ‘explained to teacher’ is enough.">'+esc(s.pit.reason)+'</textarea><div class="reference '+(s.pit.phase==='Need help / drowning'?'help-now':'')+'"><h3>Your next action</h3>'+say(phaseAdvice(s))+'<button class="button outline" data-go="'+(s.pit.phase==='Treading water'?'e1':s.pit.phase==='Consolidating'?'m2-3':s.pit.phase==='Need help / drowning'&&!s.pit.checks.includes(0)?k.cardId:'m2-1')+'">'+(s.pit.phase==='Need help / drowning'?'Show the step I need help with':'Open the next practice')+' →</button></div></section></div>';

    const phaseView=s.reflection?.pitView==='phase';
    const nav='<div class="reflection-steps" aria-label="Reflection steps"><button class="button '+(!phaseView?'primary':'outline')+'" data-pit-view="evidence" aria-pressed="'+!phaseView+'">1 · Look at your work</button><button class="button '+(phaseView?'primary':'outline')+'" data-pit-view="phase" aria-pressed="'+phaseView+'">2 · How did this feel?</button></div>';
    const split=html.indexOf('<section class="phase-reflection">');
    if(phaseView)return '<div class="reflection-page">'+nav+html.slice(split);
    return html.slice(0,html.indexOf('>')+1)+nav+html.slice(html.indexOf('>')+1,split)+'</div>';
  }
  function goalCheck(i,s,L,{esc,support}){return '<label class="evidence-confirm"><input type="checkbox" data-pit="'+i+'" '+(s.pit.checks.includes(i)?'checked':'')+'><span>'+esc(['I can show this fact now.','I can demonstrate this in my code now.','I can explain this change now.'][i])+support([text('','我现在能展示这个知识。','지금 이 사실을 보여 줄 수 있어요.'),text('','我现在能用代码展示这项技能。','지금 코드로 이 기능을 보여 줄 수 있어요.'),text('','我现在能解释这个变化。','지금 이 변화를 설명할 수 있어요.')][i])+'</span></label>';}
  function reportLines(s,L,kind){
    normalise(s);
    if(kind==='learning'){
      const st=s.reflection.start,step=nextStep(s,L),out=['Types of Learning: Knowledge = remember; Skills = practise; Understanding = explain.'];
      if(st){out.push('Starter used: '+st.source.title,'Question: '+st.source.question,'Answer at reflection: '+(st.source.answer??'Not answered'),'First recorded answer: '+(st.source.firstAnswer??'Not available'),'What helped (student report): '+(startingMethods.find(x=>x[0]===st.method)?.[1].en||st.method),'Next action: '+step.message.en);}
      else out.push('Starter-based reflection: Not answered.');
      out.push('Skills and Understanding are not rated before coding.');
      if(Object.keys(s.confidence||{}).length){out.push('Legacy starting-point responses (preserved, not reinterpreted):');L.goals.forEach((g,i)=>out.push(g.en+': '+(s.confidence[i]||'Not answered')));}
      return out;
    }
    const k=starterEvidence(s,L),skill=skillEvidence(s,L),u=s.reflection.understanding,e=u?.evidence||repairEvidence(s,L);
    return ['K evidence: '+k.title+' | Latest answer: '+(k.answer??'Not attempted'),'S evidence: '+(skill.attempted?skill.title+' | Attempt '+skill.attempt+' | '+(skill.passed?'Task target met; independence not verified':'Target not yet met'):'No code run yet'),skill.attempted?'Recorded code:\n'+skill.code+'\nOutput:\n'+(skill.output||'(No output)'):'','U comparison source: '+(e.source==='student'?'Student run: '+e.title:'Worked example — not student work'),'Before: '+JSON.stringify(e.before),'After: '+JSON.stringify(e.after),'Understanding response: '+(u?understandingOptions(e)[u.choice]?.en:'Not answered'),'Understanding feedback: '+(u?(u.choice===0?'Matched explanation; self-report phase is separate':'Needs comparison / explanation; no navigation lock'):'Not yet checked'),...L.goals.map((g,i)=>g.en+': '+(s.pit.checks.includes(i)?'Student says they can demonstrate':'Not confirmed')),'Learning phase (self-report): '+(s.pit.phase||'Not selected'),'Evidence / explanation: '+(s.pit.reason||'Not answered'),'Suggested next action: '+phaseAdvice(s).en,'Saving a help response does not alert the teacher.'];
  }
  return {normalise,startingMethods,phases,starterEvidence,skillEvidence,repairEvidence,nextStep,phaseAdvice,understandingOptions,learningHtml,pitHtml,reportLines};
})();
