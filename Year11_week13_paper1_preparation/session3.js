window.FitnessSession3 = (() => {
  'use strict';
  const L = LESSON, U = FitnessUI, E = U.esc;
  const stages = [
    ['s3select','Choose a session','Navigation'], ['s3check','Check earlier EADs','First visit on this browser'],
    ['s3catchup','Finish earlier work','Only if needed'], ['s3home','Session 3 · Start here','0–4 min'],
    ['s3do','Do Now','4–9 min'], ['s3learning','Types of Learning','9–12 min'],
    ['s3predict','Predict','12–16 min'], ['s3run','Run','16–18 min'],
    ['s3investigate','Investigate','18–22 min'], ['s3modify','Modify','22–26 min'],
    ['s3read','Read before Make','26–31 min'], ['s3make','Make · Main Task 2','31–52 min'],
    ['s3pit','Learning Pitstop','52–55 min'], ['s3extension','Extension','If ready'],
    ['s3finish','Plenary and submit','55–60 min']
  ].map(([id,label,time]) => ({id,label,time}));
  const utility = new Set(['s3select','s3check','s3catchup']);
  const route = stages.filter(s => !utility.has(s.id));
  const mainRoute = route.filter(s => s.id !== 's3extension');
  L.stages.push(...stages);

  const prior = [
    ['task1','task1','Session 1 · Main Task 1: reading Python syntax'],
    ['task2','task2','Session 1 · Main Task 2: understanding the program'],
    ['extension','s2catchup','Session 1 · Section A practice (originally called Extension)'],
    ['s2task1','s2task1','Session 2 · Main Task 1: lists and menu selection'],
    ['s2task2','s2task2','Session 2 · Main Task 2: short fitness skeleton changes']
  ].map(([id,stage,title]) => ({id,stage,title,key:'s3Prior_'+id}));
  const options = {
    submitted:'Completed and turned in on Teams',
    finished:'Completed but not turned in',
    unfinished:'Not finished yet, or not sure'
  };
  const labels = Object.fromEntries(prior.map(p => [p.key,'Earlier EAD check: '+p.title]));
  Object.assign(labels, {
    s3Learning:'Session 3: type of learning', s3Strategy:'Session 3: practice strategy',
    s3Phase:'Session 3: learning phase', s3Evidence:'Session 3: evidence', s3Next:'Session 3: next step'
  });
  Object.assign(window.FITNESS_FIELD_LABELS, labels);
  const brand = {
    topic:'Paper 1: adding and testing a feature',
    wagba:'Turn a written requirement into a working feature and show it works with test evidence.',
    keywords:[['subroutine','子程序'],['parameter','参数'],['return value','返回值'],['running total','累计总数'],['test data','测试数据']],
    challenge:'Choose test data that exposes a program which stops after checking only one item.'
  };
  const code = `def CountInStock(StockLevels):
    Count = 0
    for Quantity in StockLevels:
        if Quantity > 0:
            Count = Count + 1
    return Count

StockLevels = [0, 4, 2]
Result = CountInStock(StockLevels)
print(Result)`;
  L.labs.s3stock = {
    title:'Count the products that are in stock', file:'stock_practice.py',
    prediction:'Write your prediction in part 2 of your EAD before you run the example.', code, inEad:true,
    lines:[
      ['Defines a function that receives one list of stock levels.','定义一个接收库存列表的函数。'],
      ['Starts the count at zero for this call.','每次调用时从零开始计数。'],
      ['Visits one quantity at a time in list order.','按顺序逐个读取数量。'],
      ['Checks whether the current product has any stock.','检查当前商品是否有库存。'],
      ['Adds one to the count, not the quantity in stock.','每种有库存的商品只加一。'],
      ['Sends the final count back to the caller after the loop. It does not print it.','循环结束后返回总数，不会在此处输出。'],
      ['Blank line to separate the function from the code that calls it.','空行用于分隔函数和调用代码。'],
      ['Provides the data for this run.','提供本次运行的数据。'],
      ['Calls the function and stores the returned number in Result.','调用函数并将返回值存入 Result。'],
      ['Displays the number held in Result.','输出 Result 的值。']
    ]
  };
  L.eads.s3finish = {title:'Session 3 Electronic Answer Document',file:'resources/Session3_Paper1_Revision_EAD.docx',save:'YourName_Session3_EAD.docx'};
  const confirmed = (p,s) => !!(s.submissions?.[p.id]?.confirmed || (p.id==='extension' && s.submissions?.s2catchup?.confirmed));
  const status = (p,s) => confirmed(p,s) ? 'submitted' : (['finished','unfinished'].includes(s.answers?.[p.key]) ? s.answers[p.key] : '');
  const missing = s => prior.filter(p => status(p,s) !== 'submitted');
  const nextEntry = s => !missing(s).length ? 's3home' : (missing(s).some(p => !status(p,s)) ? 's3check' : 's3catchup');
  function recordCheck(s, form) {
    const supplied = prior.map(p => confirmed(p,s) ? 'submitted' : form.get(p.key));
    if (supplied.some(v => !Object.hasOwn(options,v))) return false;
    prior.forEach((p,i) => {
      const v = supplied[i];
      s.answers[p.key] = v;
      if (v === 'submitted' && !confirmed(p,s)) {
        const id = p.id === 'extension' ? 's2catchup' : p.id;
        const existing = s.submissions[id] || {};
        s.submissions[id] = {...existing, filename:existing.filename || '', confirmed:true, at:new Date().toISOString()};
      }
    });
    return true;
  }
  const readinessLock = (id,s) => route.some(p => p.id===id) && nextEntry(s)!=='s3home';
  const ead = '<a class="button primary" href="resources/Session3_Paper1_Revision_EAD.docx" download>Download the Session 3 EAD</a>';
  const starter = '<a class="button" href="resources/loans_revision.py" download>Download loans_revision.py</a>';
  const stockDownload = '<a class="button quiet" href="resources/stock_practice.py" download>Download stock_practice.py for your IDE</a>';
  const q = text => `<p class="s3-question"><strong>Class question</strong> ${text}</p>`;

  function page(id,{head,field,lab,done,state}) {
    switch(id) {
      case 's3select': {
        const previous = L.stages.find(p => p.id === state.slides?.s3Return && !utility.has(p.id));
        return head('Choose a session','Go back to your saved stage or open today’s work.','返回上次的学习步骤，或打开今天的任务。')+
          `<div class="section-link-row">${previous?`<button data-go="${E(previous.id)}">Return to ${E(previous.label)}</button>`:''}<button class="primary" data-s3-begin>Open Session 3</button><button data-go="s2home">Open Session 2</button><button data-go="setup">Open Session 1</button></div>`;
      }
      case 's3check':
        return head('Where did you get to?','Check your earlier assignments in Teams. For each EAD, choose the status that matches your work.','在 Teams 查看之前的答题文档，再选择完成状态。')+
          `<form id="s3-readiness"><p>Choose <strong>Completed and turned in</strong> only if you can see the assignment was turned in, or you have already shown the submission to me. This check does not send anything to Teams.</p><div class="s3-checklist">${prior.map(p=>{
            const saved=status(p,state);
            return `<div><label for="${p.key}">${E(p.title)}</label>${confirmed(p,state)?'<p class="small">Already confirmed in your notebook.</p>':`<select id="${p.key}" name="${p.key}" required><option value="">Choose a status</option>${Object.entries(options).map(([v,t])=>`<option value="${v}" ${v===saved?'selected':''}>${E(t)}</option>`).join('')}</select>`}</div>`;
          }).join('')}</div><button class="primary" type="submit">Open my next stage</button><p class="small">If you have a full backup, use <strong>Restore</strong> above to recover your app work. Word and Python files saved outside the app are not recovered by this check.</p></form>`;
      case 's3catchup': {
        const rest=missing(state), first=rest[0];
        return head(first?'Continue your earlier work':'You’re ready for Session 3',first?'Start with the first EAD below. You don’t need to redo work you’ve already completed.':'Your earlier EADs are confirmed in this notebook.','继续完成或提交尚未确认的答题文档。')+
          (first?`<ol class="s3-pending">${rest.map((p,i)=>`<li><strong>${E(p.title)}</strong><p>${status(p,state)==='finished'?'Open your finished Word file. Turn it in on Teams, then confirm it in the app.':'Continue the Word file you already started. If you do not have it, the original download is on the task page.'}</p>${i===0?`<button class="primary" data-go="${p.stage}">${status(p,state)==='finished'?'Open submission instructions':'Open my next task'}</button>`:''}</li>`).join('')}</ol><button data-go="s3check">Update my answers</button>`:'<button class="primary" data-s3-begin>Start Session 3</button>');
      }
      case 's3home':
        return head('Add a feature to a working program','Today you will follow a short function, then write and test one of your own.','先跟踪一个函数，再编写并测试自己的功能。')+
          `<ol class="steps"><li>${ead} Open it in Word and save a copy as <code>YourName_Session3_EAD.docx</code>. Record your answers in that document.</li><li>${starter} Save a copy as <code>YourName_Loans.py</code>. Open it in your Python IDE. Do not edit it yet.</li><li>For the Do Now, open <code>fitness_working.py</code>. Keep <code>activity.txt</code> in the same folder. <a href="resources/Student_Preparation_Files.zip" download>Download both if you need a fresh copy.</a></li></ol>${done('My EAD and Python files are ready.')}`;
      case 's3do':
        return head('Do Now: follow a menu choice','Open the original fitness program. Leave the code and the data unchanged.','打开原来的健身程序，不修改代码或数据。')+
          `<pre class="mini-code">ActivityLog = LoadActivity(Individual, ActivityLog)</pre><ol class="steps"><li>Find this line in <code>Main</code>. Tell a partner what goes into the call and where its returned list is stored. Write your own answer in EAD part 1.</li><li>Run <code>fitness_working.py</code> in your IDE. At the prompts enter <strong>D → 1 → 2 → 4 → Running → Q</strong>, pressing Enter after each.</li><li>Option 2 loads the file without a confirmation message. Option 4 shows the matching Running rows so you can see that loading worked. In your EAD, explain what option 2 does that option 1 does not.</li></ol><p>Do not choose option 3. It writes to the data file.</p>${done('I checked both menu choices and answered part 1.')}`;
      case 's3learning':
        return head('Types of Learning','Choose one thing to get better at before you start the code.','选择今天最需要提高的一项。')+
          `<section class="definition"><h2>Our definition of learning</h2><blockquote>“${E(L.definition)}”</blockquote></section><div class="s3-cards"><section><h3>Knowledge</h3><p>Explain what a parameter and a return value are.</p></section><section><h3>Skills</h3><p>Trace a loop one item at a time and test your prediction.</p></section><section><h3>Understanding</h3><p>Explain why the function and the menu have different jobs.</p></section></div><label for="s3Learning">My focus today</label><select id="s3Learning" data-answer="s3Learning"><option value="">Choose one</option>${['Knowledge','Skills','Understanding'].map(x=>`<option ${state.answers.s3Learning===x?'selected':''}>${x}</option>`).join('')}</select>${field('s3Strategy','How will you practise it?','Name one thing you will do or check.',2)}`;
      case 's3predict':
        return head('Main Task 1 · Predict','Read the whole example before you run it. A stock level above zero means the product is in stock.','先阅读完整的程序，再预测输出。')+
          `<div class="s3-flow"><span><strong>Input to the call</strong><code>StockLevels</code></span><span aria-hidden="true">→</span><span><strong>Function</strong><code>CountInStock(...)</code></span><span aria-hidden="true">→</span><span><strong>Result in the caller</strong><code>Result</code></span></div>${U.codeLines(code)}<p><code>return</code> sends the value back to the caller. <code>print</code> displays it. The counter increases by one for a qualifying product; it does not add the quantity in stock.</p>${q('Which line displays the result?')}<p>In EAD part 2, write the exact output you predict and which quantities you expect to be counted. Then go to Run.</p>`;
      case 's3run':
        return head('Main Task 1 · Run','Run the original example, then record what Python actually printed.','运行原始代码，记录实际输出。')+`<p>If you came back after editing the code in Modify, open <strong>Edit / copy the complete example</strong> and select <strong>Reset example</strong> before checking the original.</p>`+lab('s3stock')+`<p>${stockDownload}</p><p>Write the actual output next to your first prediction in EAD part 2. Do not replace the prediction.</p>`;
      case 's3investigate':
        return head('Main Task 1 · Investigate','Use your trace table to explain the output.','用跟踪表解释程序输出。')+
          `<div class="s3-cards s3-numbers" aria-label="Quantities in the order Python visits them"><section><span>First</span><strong>0</strong></section><section><span>Second</span><strong>4</strong></section><section><span>Third</span><strong>2</strong></section></div><p>In EAD part 2, write whether <code>Quantity &gt; 0</code> is true for each item, and the value of <code>Count</code> after that item. Point to the line that returns the count and the line that prints it.</p>${q('Where is the returned value stored before it is printed?')}<details><summary>Check your trace after you finish it</summary><p>The conditions are False, True, True. The counts are 0, 1, 2. The call stores the returned value in <code>Result</code>.</p></details>`;
      case 's3modify':
        return head('Main Task 1 · Modify','Move only the return line. Predict what will happen before you run it.','只移动 return 这一行，先预测再运行。')+
          `<div class="s3-compare"><section><h3>Original position</h3><pre class="mini-code">    for Quantity in StockLevels:
        if Quantity &gt; 0:
            Count = Count + 1
    <mark>return Count</mark></pre></section><section><h3>Position to try</h3><pre class="mini-code">    for Quantity in StockLevels:
        if Quantity &gt; 0:
            Count = Count + 1
        <mark>return Count</mark></pre></section></div><ol class="steps"><li>Open <strong>Edit / copy the complete example</strong>. Move <code>return Count</code> so it lines up with <code>if</code>: eight leading spaces. Leave all the other lines alone.</li><li>Write your new prediction. Run it. Record the result and name the items it never checks.</li><li>Put the line back at four leading spaces and run again. Record the result after the fix.</li></ol>${lab('s3stock')}<p>${stockDownload}</p>${q('Does the faulty program have no stock, or did it stop looking? Point to the line that proves it.')}${done('I recorded the changed output and tested my fix.')}`;
      case 's3read':
        return head('Read before Make','Work out what the program should calculate before you write code.','先明确计算规则，再编写代码。')+
          `<p>The school loans equipment for seven days. Each value in <code>LoanDays</code> is the number of days an item was kept. Returning it on day 7 is on time. An item kept for 9 days contributes <strong>2 late days</strong>.</p><div class="s3-flow"><span><strong>Days kept</strong><b>9 days</b></span><span aria-hidden="true">−</span><span><strong>Days allowed</strong><b>7 days</b></span><span aria-hidden="true">=</span><span><strong>Late days</strong><b>2 days</b></span></div><p>Only add the days beyond the limit. Use the running total to add the contributions from every late item. The function sends the number back; the menu displays it.</p>${q('For [4, 7, 9, 12] with a seven-day limit, why is the answer 7 rather than 2?')}<p>In EAD part 3, write how many late days each loan contributes. Keep this plan beside you when you code.</p>`;
      case 's3make':
        return head('Main Task 2 · Make the late-return report','Build the calculation first. Connect it to the menu only once the calculation works.','先完成并测试计算，再把它接到菜单。')+
          `<p>${starter}</p><ol class="steps"><li><strong>Write the function.</strong> In <code>YourName_Loans.py</code>, replace the body of <code>TotalLateDays(LoanDays, DueDay)</code>. Return the total days overdue after checking the whole list. Use the given <code>DueDay</code>, not a fixed 7. Return zero for an empty list. Don’t change the list, print inside the function or ask the user for input there. The data already contains whole numbers.</li><li><strong>Test the function in your IDE.</strong> In the marked test area below the function, temporarily add <code>print(TotalLateDays([4, 7, 9, 12], 7))</code>. Run the file, read the result above the menu and enter <code>Q</code>. Repeat for the test rows in EAD part 3. Predict first. Include the eight-day limit test. Remove your temporary test lines afterwards.</li><li><strong>Connect the menu.</strong> Show <code>2. Show total late days</code>. In <code>Main</code>, add a branch for the string <code>"2"</code> inside the existing loop. Call your function and print <code>Total late days: 7</code> for the supplied data, using the returned number. Do not change what <code>1</code> or <code>Q</code> does.</li><li><strong>Check and save.</strong> Run the whole program and choose <code>1 → 2 → 2 → Q</code>. Paste your function and the changed menu code into your EAD. Add one cropped screenshot showing option <code>2</code>, the result and the menu returning.</li></ol><div class="callout"><strong>Pause before editing the menu</strong><p>Show me one expected result next to what Python actually returned. Choose a test that includes a late loan.</p></div><details><summary>If your total is wrong</summary><p>Draw three columns: days kept, late days for this item, running total. Start at zero. Trace <code>4, 7, 9, 12</code> in that order. Check which statement adds to the total and whether it adds the full duration or only the days beyond the limit.</p></details><details><summary>If the function works but the menu does not</summary><p>Check that the option is displayed and the matching branch is inside the loop, alongside the other branches. Check that you compare the input with the string <code>"2"</code> and use the value returned by your function.</p></details><p><button data-go="s3extension">Finished? Try the extension</button></p>${done('I tested the function and the menu and saved my evidence.')}`;
      case 's3pit':
        return head('Learning Pitstop','Choose your phase for this task. Use a trace, test or line of code to explain your choice.','用跟踪表、测试或代码说明你目前的学习阶段。')+
          `<div class="phase-grid">${[['New learning','I can now follow a step that was new to me.'],['Consolidating','I can explain my result and repeat the steps on my own.'],['Treading water','I can do this already and need the harder test.'],['Drowning','I need help with one specific step.']].map(([v,t])=>`<label><input type="radio" name="s3Phase" data-answer="s3Phase" value="${v}" ${state.answers.s3Phase===v?'checked':''}><strong>${v}</strong><span>${t}</span></label>`).join('')}</div>${field('s3Evidence','What in your work shows this?','Name one test, trace row or line.',2)}${field('s3Next','What will you try next?','Name the next step, not just the topic.',2)}`;
      case 's3extension':
        return head('Extension: choose a test that catches the bug','Use the same seven-day limit. Choose two loan durations.','选择两个借用时长，找出能区分三种结果的测试。')+
          `<p>Find a two-item list that gives three different results for the correct function, a function that returns after the first item, and a function that adds the full duration of each late loan. Work out all three results. Explain how you would know which fault you had found. Write it in EAD part 5.</p><p><button data-go="s3pit">Go to Learning Pitstop</button></p>`;
      case 's3finish': {
        const s=state.submissions.s3finish || {};
        return head('Plenary and submit','Use one piece of feedback to make a correction, then turn in your files.','根据反馈修改一处，再提交文件。')+
          `<ol class="steps"><li>In EAD part 4, note one correction you made. If unfinished, write the exact step you’ll pick up next.</li><li>Save <code>YourName_Session3_EAD.docx</code> and <code>YourName_Loans.py</code>. Add both to the Session 3 assignment your teacher shows you in Teams, then select <strong>Turn in</strong>.</li><li>Confirm below only after Teams shows the assignment was turned in. The app does not submit for you.</li></ol><label for="s3-filename">Name of the EAD you turned in</label><input id="s3-filename" data-submission-name="s3finish" value="${E(s.filename||'')}" placeholder="YourName_Session3_EAD.docx"><label class="check-label"><input type="checkbox" data-confirm="s3finish" ${s.confirmed?'checked':''}>I turned in my EAD and Python file in Teams.</label><p class="small">Save PDF and Full backup save app work only. Keep your Word and Python files separately.</p>`;
      }
      default:return '';
    }
  }
  return {stages,utility,route,mainRoute,prior,labels,brand,page,nextEntry,recordCheck,readinessLock};
})();
