/* Static lesson: no Python execution, network requests or remote student tracking. */
(() => {
  'use strict';
  const KEY = 'y10-w3s1-algorithms-v2';
  const OLD_KEY = 'y10-w3s1-algorithms-v1';
  const TEACHER_KEY = KEY + '-teacher';
  const stages = [
    ['overview','Before you begin','3 minutes'], ['starter','Do Now','7 minutes'],
    ['learningTypes','Types of learning','4 minutes'], ['main1','Main Activity 1','16 minutes'],
    ['main2','Main Activity 2','20 minutes, including optional extension'],
    ['extension','Paper extension','Optional, within practice time'],
    ['pitstop','Learning pit stop','3 minutes'], ['plenary','Plenary','7 minutes'],
    ['report','Evidence report','Export at any time']
  ];
  const beforeOptions = [['independent','Already knew / could do independently'],['prompt','With a reading or prompt'],['new','New to me'],['unsure','Not sure / not checked yet']];
  const phaseOptions = [['new','New learning — a good struggle'],['consolidating','Consolidating'],['easy','Treading water — I need more challenge'],['help','Drowning — I need help'],['not-attempted','Not attempted yet']];
  const targets = [
    {id:'terms',group:'Knowledge',title:'Algorithm and sequence',statement:'I can say what an algorithm is and what sequence means.',before:'The starter checks instruction order. Knowing why the last line comes last is evidence about sequence; it does not automatically show that you can define algorithm.',evidence:'Use the starter and your ordered run plan. Explain “algorithm” and “sequence” without reading the definitions.',start:'Read the short definitions in Main Activity 1. Cover them and explain each term using the notebook program.',actions:['Explain one term using the notebook example, then check the reading.','Recall both terms without the model; give an example of each.','Ask for the paper extension and distinguish an algorithm from its Python implementation.','Ask your teacher to show just two steps: calculate a total, then display it. Say which must happen first.']},
    {id:'concepts',group:'Knowledge',title:'Decomposition and abstraction',statement:'I can distinguish breaking a problem into tasks from removing unnecessary detail.',before:'The starter did not directly test these two definitions. If you have not met them before, choose “New to me”; do not assume they are already secure.',evidence:'Use Main Activity 1: splitting the charity application into jobs is decomposition; leaving out shoe colour is abstraction.',start:'Read the decomposition and abstraction examples in Main Activity 1, then describe how their jobs differ.',actions:['Match each term to one action in the charity plan.','Explain both terms without the model and check you have not swapped them.','On the paper extension, make each definition precise and distinct.','Ask your teacher to compare “split the jobs” with “leave out a detail”, one example at a time.']},
    {id:'planning',group:'Skills',title:'Selecting information and planning tasks',statement:'I can choose the needed information and write smaller, specific tasks in a valid order.',before:'The starter checks identifying input, processing and output. It does not yet show that you can plan a whole new problem independently.',evidence:'Use your seven classifications, three task descriptions and sequence check in Main Activity 1. A tick on a choice does not check your written explanation.',start:'Use the notebook model, then identify the charity inputs and write a specific calculation and output task.',actions:['Improve one task so another programmer knows exactly which values to use.','Review your plan without the model and check every value is available when needed.','Find a second valid ordering of the same five steps and explain why it still works.','Show your teacher one unclear task. Together, name its input and expected result.']},
    {id:'implementation',group:'Skills',title:'Implementing and checking familiar Python',statement:'I can translate my plan into familiar Python and compare expected with actual results.',before:'Use the starter run and your earlier lessons as evidence. Predicting a result alone does not prove that you can write and test the charity program.',evidence:'Use your pasted code, screenshots and three test records. Say which parts you completed independently or with a prompt.',start:'Follow the numbered notebook tutor in Main Activity 2, then translate your own charity plan in your IDE.',actions:['Complete and run one small part before adding the next.','Test your program with all three supplied cases and explain any difference.','Try a different valid instruction order in your own IDE and predict whether the same inputs give the same result.','Show your teacher the first confusing line and the exact output or error. Ask to work on just that line.']},
    {id:'order',group:'Understanding',title:'Explaining why order matters',statement:'I can explain which steps depend on earlier values and which steps may change order.',before:'Use starter questions 3 and 4. “The order is wrong” is not enough: can you identify the value being used too early?',evidence:'Use the starter swap explanation and Main Activity 1 sequence feedback. Explain why laps and rate must exist before total is calculated.',start:'Look for every value used in a calculation or print statement. Find where it receives its value.',actions:['Complete: “This line must come later because it uses ___, which is created by ___.”','Explain why the three input lines need not have one fixed order.','Explain why asking for the name after the calculation can still be valid, provided it comes before the final output.','Ask your teacher to compare total = laps * rate with print(total). Point to where total first exists.']},
    {id:'purpose',group:'Understanding',title:'Explaining purpose and manageable tasks',statement:'I can justify which details matter for this purpose and explain how smaller tasks help me build or check the solution.',before:'This was not fully checked in the starter. Use a specific example if you already know it; otherwise choose a supported or new starting point.',evidence:'Use your abstraction explanation and Main Activity 2 reflection. Explain why the name matters for a personalised message, even though it is not multiplied.',start:'Read the charity brief. Ask “What must this version do?” before choosing details or describing its smaller jobs.',actions:['Explain one kept detail and one removed detail using the charity application’s purpose.','Explain how checking the input, calculation and output separately helped you.','Explain how the relevance of a name would change if the brief required only an anonymous total.','Ask your teacher to restate the application’s purpose, then decide together whether one detail helps meet it.']}
  ];
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const registry = new Map();
  let section = '', state, teacher = false, activeKey = KEY, db, imageWrite = Promise.resolve(), imageBusy = 0;
  let tutorIndex = 0, toastTimer;
  const defaultState = () => ({version:2,student:{name:'',className:''},fields:{},reviewed:{},firstChecks:{},flags:{},evidence:[],current:'overview'});
  const read = key => {try {return JSON.parse(localStorage.getItem(key)||'null');} catch {return null;}};
  const field = (key,label,type='text',options={}) => {
    const id = 'f-'+key.replace(/[^a-zA-Z0-9_-]/g,'-');
    registry.set(key,{label,type,section,options:options.choices});
    let control;
    if(type==='select') control=`<select id="${id}" data-key="${key}"><option value="">Choose when ready</option>${options.choices.map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>`;
    else if(type==='checkbox') control=`<label class="check-label" for="${id}"><input type="checkbox" id="${id}" data-key="${key}">${label}</label>`;
    else control=`<textarea id="${id}" data-key="${key}" rows="${options.rows||3}" ${type==='code'?'class="code-answer" spellcheck="false"':''}></textarea>`;
    return type==='checkbox'?control:`<div class="question"><label for="${id}">${label}</label>${options.hint?`<p class="hint" id="${id}-hint">${options.hint}</p>`:''}${control}</div>`;
  };
  const select = (key,label,choices,hint='') => field(key,label,'select',{choices,hint});
  const model = (title,html) => `<details class="model" data-model><summary>${title}</summary><div>${html}</div></details>`;
  const code = (id,title,source) => `<div class="code-box"><div class="code-top"><span>${title}</span><button data-copy="${id}">Copy code</button></div><pre id="${id}"><code>${esc(source)}</code></pre></div>`;
  const source = text => `<p class="source">Textbook reference: ${text}. Short teacher-written explanation based on these sections; not a verbatim extract.</p>`;
  const figure = (file,alt,caption='') => `<figure class="lesson-image"><img src="assets/images/${file}" alt="${esc(alt)}" loading="lazy">${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
  function stage(id,title,lead,body) {
    const index=stages.findIndex(s=>s[0]===id);
    return `<section class="stage" id="${id}" aria-labelledby="${id}-title" ${id==='overview'?'':'hidden'}><p class="eyebrow">${esc(stages[index][1])} · ${stages[index][2]}</p><h1 id="${id}-title">${title}</h1><p class="lead">${lead}</p>${body}${id!=='report'?`<label class="check-label"><input type="checkbox" data-reviewed="${id}">I have reviewed this stage. This is not a claim that every answer is correct.</label><div class="stage-actions">${index?`<button data-go="${stages[index-1][0]}">Back</button>`:'<span></span>'}<button class="primary" data-go="${stages[index+1][0]}">${id==='main2'?'Next: optional paper extension':'Continue'}</button></div>`:''}</section>`;
  }
  const starterSource = 'PRICE = 3.50\nquantity = int(input("How many notebooks? "))\ntotal = PRICE * quantity\nprint("Total cost:", total)';
  const runScaffold = 'name = input("Participant name: ")\nlaps = int(input("Completed laps: "))\nrate = float(input("Sponsorship per lap (RM): "))\n# Add the calculation here.\n# Add a labelled output here.';
  const roleChoices=[['input','Input'],['processing','Processing'],['output','Output']];
  const factChoices=[['input','Needed as input'],['not-needed','Unnecessary for this purpose'],['output','Calculated result to output']];
  const facts=[['factName','Participant name','input'],['factLaps','Completed laps','input'],['factRate','Sponsorship rate per lap','input'],['factShoes','Shoe colour','not-needed'],['factWeather','Weather','not-needed'],['factSubject','Favourite subject','not-needed'],['factTotal','Total raised','output']];
  const seq=[['seqDisplay','Display the participant’s name and total raised.'],['seqLaps','Ask for the number of completed laps.'],['seqCalculate','Calculate total = laps × rate.'],['seqName','Ask for the participant’s name.'],['seqRate','Ask for the sponsorship rate per lap.']];
  function lessonHTML() {
    registry.clear(); let html=''; section='overview';
    html+=stage(section,'Think before you code.','Today you will help a school charity team plan a small application, then build it using Python you have already met.',`
      <div class="note"><strong>Objective</strong><p>Use sequence, decomposition and abstraction to turn a short problem scenario into a clear plan and a small working program.</p><p><strong>Today’s scope:</strong> no new loops, selection, subroutines, formal flowchart tasks or trace-table exercises.</p></div>
      <h2>A quick recap before Do Now</h2>
      <p>A program can receive <strong>input</strong>, process stored values and produce <strong>output</strong>. A variable name identifies a stored value. In <code>total = PRICE * quantity</code>, Python calculates the right-hand expression, then assigns the result to <code>total</code>.</p>
      <p><code>input()</code> returns text. Use <code>int()</code> for a whole-number quantity and <code>float()</code> when a numeric entry may include a decimal. In Python, <code>*</code> means multiply. <code>print()</code> displays output.</p>
      <p><strong>Sequence</strong> means the order in which instructions are carried out. A value must be assigned before a later calculation or output can use it.</p>
      ${source('printed p. 8, “Input”, “Save the value” and “Sequence”; pp. 18–19 for number conversion')}
      <h2>How this lesson works</h2><ol><li>Do Now → identify your starting knowledge, skills and understanding.</li><li>Main Activity 1 → read, study a model and plan the charity application.</li><li>Main Activity 2 → follow a short code tutor, build in your own IDE and record tests.</li><li>If ready early, request the paper extension. Everyone finishes with a learning pit stop and plenary.</li></ol>
      <p>You may revisit any section, leave an answer unfinished or ask for help. There is no countdown and no requirement to get everything right before moving on.</p>
      <p><strong>Paper 1 connection:</strong> apply a plan when creating or modifying code. <strong>Paper 2 connection:</strong> explain and apply algorithmic concepts. Today’s practice is not a whole examination paper.</p>
      ${figure('image-1-problem-to-program.png','A real-world problem is considered using decomposition, abstraction and sequence, then developed into a plan and a Python program.','Use this as an overview. You can revisit a decision as your solution develops; planning is not always a one-way process.')}`);
    section='starter';
    html+=stage(section,'What happens first?','Read the school-shop scenario, predict the result, then use the feedback to check your thinking.',`
      <article class="coach"><h2>A notebook order</h2><p>The school shop charges <strong>RM3.50 for each notebook</strong>. A cashier enters the quantity bought by one customer. The program must calculate the total and display it. This customer buys <strong>4 notebooks</strong>.</p><p>You are checking an existing solution, not writing a new one yet. Read the four lines from top to bottom. Make your prediction before running the code in your own IDE.</p></article>
      ${code('starterCode','Notebook example · Python',starterSource)}
      ${field('starter.prediction','1. What does the final print line display when the customer enters 4?','text',{hint:'Write the label and the number displayed by the final line. You do not need to copy the input prompt.'})}
      <fieldset class="question"><legend>2. Match each instruction to its job.</legend>${['Input','Processing','Output'].map((r,i)=>select('starter.role'+r,esc(['quantity = int(input("How many notebooks? "))','total = PRICE * quantity','print("Total cost:", total)'][i]),roleChoices)).join('')}</fieldset>
      ${field('starter.swap','3. Imagine the final two lines are swapped in a fresh run. What would go wrong?','text',{hint:'Name the value that the program would try to use before it has been assigned.'})}
      ${field('starter.priceReason','4. Why must PRICE receive a value before the multiplication line?','text',{hint:'Explain what that calculation needs. PRICE does not have to be before the quantity input; it does have to be before it is used.'})}
      <button class="primary" data-check="starter">Check the three role choices</button><div id="starterResult" class="result" aria-live="polite"></div>
      ${model('Study the explanation, then improve your answer',`<p>The final line displays <code>Total cost: 14.0</code>. The numeric value is fourteen; this code does not format it as <code>14.00</code>.</p><p>The three jobs are input, processing and output. If the last two lines are swapped, a fresh run tries to print <code>total</code> before assigning it, causing a <code>NameError</code>.</p><p>The calculation needs both <code>PRICE</code> and <code>quantity</code> to have values. The order of those first two assignments can change; both must happen before multiplication.</p>`)}
      ${field('starter.correction','My correction or question for my teacher (optional)','text',{hint:'You may write “I need help with line … because …”. Your original checked attempt is retained in the evidence report.'})}`);
    section='learningTypes';
    html+=stage(section,'What am I getting better at?','Use your starter answers as evidence. Knowing a fact, performing a task and explaining a reason are related, but they are not the same.',`
      <p><strong>Knowledge:</strong> facts and meanings you can recall. <strong>Skills:</strong> actions you can practise and perform. <strong>Understanding:</strong> reasons and connections you can explain and apply.</p><p>You can develop all three today. These are types of learning, not fixed types of learner. Do not select “new” just because a lesson has started, or “independent” just because you read the answer.</p>
      ${reflectionRows(false)}<div id="beforeSummary" class="reflection-summary" aria-live="polite"></div>
      ${select('learning.focus','Choose one priority for today',targets.map(t=>[t.id,`${t.group}: ${t.title}`]))}<p id="focusAction" class="coach"></p>
      ${field('learning.evidence','What in your starter or earlier work supports this choice?','text',{hint:'One short example is enough: “I predicted 14.0, but needed the model to explain why total must exist.” If it was not checked, say so.'})}`);
    section='main1';
    html+=stage(section,'Turn the scenario into a plan.','First study the meanings and the notebook example. Then make four design decisions for the same charity application.',`
      <article class="reading"><h2>Read: three decisions before coding</h2><p>An <strong>algorithm</strong> sets out steps to complete a task. A program is an implementation of an algorithm in a programming language.</p><p><strong>Sequence:</strong> put instructions in an order that works. If a step needs a value, another step must supply that value first.</p><p><strong>Decomposition:</strong> break a problem into smaller subproblems, each with an identifiable task. Those tasks can sometimes be broken down further.</p><p><strong>Abstraction:</strong> remove details that are unnecessary for the problem’s purpose. Something irrelevant to one application may be important to another.</p>
      ${source('p. 8, “Sequence”; p. 88, “Decomposition” and “Further subdivision”; pp. 98–99, “Algorithms and programs”; pp. 100–101, “Abstraction” and “What are ‘unnecessary’ details?”')}
      <p class="hint">Read only these relevant sections. The textbook also discusses subroutines, loops and other representations nearby; those are not new tasks for today.</p></article>
      ${model('Worked example: plan the notebook checkout',`<p><strong>Purpose:</strong> calculate and display the cost of the customer’s notebooks.</p><p><strong>Keep:</strong> the notebook price and quantity. <strong>Remove:</strong> the shop wall colour, because it does not affect that cost.</p><ol><li>Receive the customer’s whole-number quantity.</li><li>Calculate the price multiplied by the quantity.</li><li>Display the total cost to the cashier.</li></ol><p>These are identifiable jobs, not just the labels “input”, “processing” and “output”. Those labels help organise this example; they are not the definition of decomposition.</p><p>Both price and quantity must exist before the calculation, and the result must exist before output.</p>`)}
      <article class="coach"><h2>Your client: Riverside School Charity Run</h2><p>Riverside School is raising money for a local children’s library. Before the run, participants ask family, friends or local businesses to promise money for each lap they complete. A promise of RM2 per lap means five completed laps raises RM10.</p><p>A marshal records completed laps at the finish desk. The charity team needs an application to work out each runner’s total and show whose total it is.</p><p><strong>This first version must:</strong> ask for the participant’s name, their whole-number completed laps and one combined sponsorship rate per lap; calculate laps multiplied by rate; display the name and total raised.</p><p>The charity team has already combined any sponsors’ rates into one rate. Do not add sponsor lists, payment tracking or input-validation routines. Assume the numerical entries are valid.</p><p><strong>Example:</strong> Aisha completes 5 laps at RM2 per lap. Her total is RM10. Her name is needed for the personalised result, even though her name is not part of the multiplication.</p></article>
      ${figure('image-4-sponsored-run-scenario.png','Aisha has completed five laps at RM2 per lap. Other details include blue shoes, sunny weather and Art as a favourite subject.','Study the details in this scenario. Your task below is to decide which help this particular application meet its purpose.')}
      <h2>Decision 1: choose the useful information</h2><p>For each detail, choose whether it is entered as input, removed for this purpose, or calculated as the result. The final output message also repeats the input name.</p>
      ${facts.map(([key,label])=>`<div class="choice-row">${select('main1.'+key,label,factChoices)}<p id="feedback-${key}" class="choice-feedback"></p></div>`).join('')}
      <button data-check="facts">Check these seven decisions</button><div id="factsResult" class="result" aria-live="polite"></div>
      <h2>Decision 2: explain your abstraction</h2>${field('main1.abstractionReason','Choose two unnecessary details. For each, explain why removing it does not stop this version doing its job.','text',{rows:4,hint:'Try: “We can leave out ___ because the program needs to ___, and ___ does not affect that.”'})}
      ${model('Compare the reasoning, not just the chosen detail','<p>“Shoe colour can be left out because the application calculates money from laps and rate. Shoe colour changes neither the calculation nor the required name-and-total message.”</p><p>Use the same reasoning for your second detail. “It is useless” alone does not explain why it is unnecessary for this purpose.</p>')}
      <h2>Decision 3: break the job into smaller tasks</h2><p>Write instructions another programmer could follow without guessing. Use input–process–output as an organiser for this application.</p>
      ${field('main1.decomposeInput','Input task: which values must the application receive?')}${field('main1.decomposeProcess','Processing task: what exact calculation must it carry out?')}${field('main1.decomposeOutput','Output task: what must the message tell the charity team?')}
      ${model('Check whether your tasks are specific enough','<p><strong>Input:</strong> ask for the name, completed laps and combined rate per lap. <strong>Process:</strong> multiply completed laps by that rate and store the total. <strong>Output:</strong> display the participant’s name and the total raised in RM.</p><p>These descriptions can support building and checking one part at a time. Your wording may differ while still describing the same identifiable tasks.</p>')}
      <h2>Decision 4: put the tasks in a valid sequence</h2><p>Give each step a different position from 1 to 5. There is more than one valid answer. Check what each step needs, rather than copying one memorised order.</p>
      ${seq.map(([key,label])=>`<div class="sequence-row">${select('main1.'+key,label,[1,2,3,4,5].map(n=>[String(n),'Position '+n]))}</div>`).join('')}
      <button class="primary" data-check="sequence">Check whether my order works</button><div id="sequenceResult" class="result" aria-live="polite"></div>
      ${field('main1.orderReason','Explain one dependency in your sequence.','text',{hint:'Example sentence pattern: “___ must happen before ___ because the later step needs ___.”'})}
      <p class="note">The automatic checks assess the seven classifications and whether the ordering dependencies work. Your written reasoning still needs comparison with the model or teacher review; filling a text box is not a mark.</p>`);
    section='main2';
    html+=stage(section,'Turn your plan into familiar Python.','You have decided what the application should do. Now implement those same smaller jobs, one at a time, in your own IDE.',`
      <article class="reading"><h2>Read: the plan stays the same</h2><p>The algorithm describes the steps. Python expresses those steps as a program that you can run. You are not starting a different problem or learning a new programming structure.</p><p>The name stays text. Completed laps need <code>int()</code>. The rate may have a decimal part, so use <code>float()</code>. Python multiplies with <code>*</code>, not the mathematical symbol ×. Use comma-separated items in <code>print()</code> to display text and numbers together.</p>${source('pp. 98–99, “Implementing an algorithm” and “Programming languages”; p. 8 for input, assignment and sequence')}</article>
      <h2>Study: a four-line tutor</h2><p>This is a guided explanation of the notebook example, <strong>not a Python runner</strong>. Select Next line to move the pointer. For this example the user types <code>4</code>. No timer moves it for you.</p>
      <div class="code-box"><div class="code-top"><span>Notebook example · numbered reading guide</span><button data-copy="starterCode">Copy clean code</button></div><div class="line-view" id="tutorCode">${starterSource.split('\n').map((line,i)=>`<div class="code-line" data-line="${i}"><span class="line-number" aria-hidden="true">${i+1}</span><code>${esc(line)}</code></div>`).join('')}</div></div>
      <div class="tutor-controls"><button id="tutorBack">Previous line</button><button id="tutorNext">Next line</button><button id="tutorReset">Start again</button></div><div id="tutorExplanation" class="tutor-explanation" aria-live="polite"></div>
      <h2>Reuse your plan</h2><p>Your three task descriptions from Main Activity 1 appear here. Do not copy them into another set of boxes. If a task is unclear, return and improve it.</p><div id="reusedPlan" class="plan-reuse"></div><button data-go="main1">Review my plan</button>
      <h2>Build: your sponsored-run application</h2><p>Create <code>sponsored_run.py</code> in your own IDE. Use your plan independently, or copy the scaffold. The scaffold runs the inputs but has no calculation or final output yet: the two comment lines tell you what to add.</p>
      ${code('mainCode','Optional input scaffold · replace the two comments',runScaffold)}
      <ol class="step-list"><li>Run the three input lines. Enter <strong>Aisha</strong>, <strong>5</strong> and <strong>2</strong>. Reaching the end with no error is expected; you have not added output yet.</li><li>Add a line that assigns laps multiplied by rate to <code>total</code>.</li><li>Add a <code>print()</code> line containing the participant’s name, a clear label, the total and the unit RM. Run the whole program again.</li><li>Compare the result with your plan. It should identify Aisha and show a total with the numeric value 10.</li></ol>
      ${model('Need a pointer for the calculation or output?',`<p>For the notebook example, <code>total = PRICE * quantity</code> stores a product. Replace the two multiplied values with the charity application’s values.</p><p>For output, the pattern is <code>print(name, "raised RM", total)</code>. Quotes surround fixed text; the variable names outside quotes supply their stored values. Commas let <code>print()</code> handle both text and numbers. Do not write <code>"raised" + total</code>: that tries to add a string to a number.</p><p>A numeric output of <code>10.0</code> is correct for these inputs. Two-decimal currency formatting is not required today.</p>`)}
      <h3>My build-and-check pointer</h3><p>These are your own confirmations, not automatic code checks. Tick one step at a time after doing it in your IDE.</p>
      ${field('main2.inputsDone','I entered the three values in my own IDE.','checkbox')}${field('main2.calculationDone','I checked that the calculation uses laps and rate after they have values.','checkbox')}${field('main2.outputDone','I checked that the final output includes the name, total and a clear label.','checkbox')}
      ${field('main2.code','Paste your current Python code from your IDE','code',{rows:8,hint:'An unfinished attempt is useful evidence too. This box records code; it does not run or automatically mark it.'})}
      <h2>Test: expected versus actual</h2><p><strong>Expected</strong> means the total you work out before running. <strong>Actual</strong> means the output your own program really displays. Compare them; do not select Pass just because the program opened.</p>
      ${[[1,'Aisha',5,'2.00'],[2,'Daniel',0,'3.50'],[3,'Mei',12,'1.25']].map(([n,name,laps,rate])=>`<article class="test-case"><h3>Test ${n}: ${name}</h3><p>Enter name <strong>${name}</strong>, completed laps <strong>${laps}</strong> and rate <strong>${rate}</strong>.</p>${field('main2.test'+n+'Expected','Test '+n+' — expected total (RM)','text',{rows:2})}${field('main2.test'+n+'Actual','Test '+n+' — actual output from my IDE','text',{rows:2})}${select('main2.test'+n+'Result','Test '+n+' — my comparison',[['Pass','Pass — result agrees and identifies the participant'],['Fail','Fail — result differs or an error appears'],['Not run yet','Not run yet']])}</article>`).join('')}
      ${model('Check the expected totals after predicting them','<p>Aisha: 5 × 2 = <strong>10</strong>. Daniel: 0 × 3.50 = <strong>0</strong>. Mei: 12 × 1.25 = <strong>15</strong>.</p><p>Zero laps checks that the calculation handles a runner who completes no laps. The decimal rate checks that you have not treated every rate as a whole number. Python may display 10.0, 0.0 and 15.0; those are the expected numeric values.</p><p>If the result is wrong, compare the inputs first, then the multiplication, then the output. You can record Fail and ask for help; do not change it to Pass without rerunning.</p>')}
      ${field('main2.reflection','How did breaking the application into smaller tasks help you build or check it?','text',{hint:'Refer to something you actually did: for example, checking the input section before adding the calculation.'})}
      <h2>Evidence from your IDE</h2><p>Add screenshots showing your code and output. Use a clear crop with readable text. Screenshots keep their original resolution. You can also paste an image from your clipboard into the area below.</p>
      <label for="evidenceUpload">Choose screenshots (PNG, JPEG or WebP, up to 8 MB each; six images)</label><input id="evidenceUpload" type="file" accept="image/png,image/jpeg,image/webp" multiple>
      <div id="pasteArea" class="note" tabindex="0" role="group" aria-label="Paste screenshot area">To paste a screenshot: click here, then press Ctrl+V or Command+V.</div><div id="imageStatus" role="status"></div><div id="evidencePreview"></div>
      <p>Ready early? Continue to request a paper extension. If practice has taken the available time, move straight to the learning pit stop.</p><button data-go="pitstop">Go to learning pit stop</button>`);
    section='extension';
    html+=stage(section,'Ready to write on paper?','This extension is a short past-paper task. You will write your answers on the paper your teacher gives you, not in this app.',`
      <p>When you have a workable charity plan and have checked your program—or your teacher says you are ready—raise your hand and ask for the question sheet.</p>
      <div class="coach"><h2>Your paper task</h2><p><strong>OxfordAQA 9210/2 · June 2023 · Question 02.1–02.3 · 5 marks</strong></p><p>These questions check the meanings of algorithm, decomposition and abstraction. They stay within today’s content. They assess knowledge (AO1), not every skill involved in creating your program.</p></div>
      <ol><li>Select “I am ready for my paper”, then physically raise your hand.</li><li>Write your name and class on the sheet. Read the command words and marks before answering.</li><li>Answer all three selected parts on paper. Use the full meaning of each term; do not replace it with an unrelated example.</li><li>Hand the sheet to your teacher as directed. Return for the learning pit stop and plenary when asked.</li></ol>
      <button class="primary" id="requestPaper">I am ready for my paper</button><div id="paperSignal" class="paper-signal" hidden><strong>Ready for my paper</strong><p id="paperStudent"></p><small>Please raise your hand. This screen does not send a notification to your teacher.</small></div>
      <p id="paperStatus" role="status"></p><div class="toolbar"><button id="paperReceived">I have received the paper</button><button id="paperHanded">I have handed in my paper</button><button id="paperReset">Correct / clear my paper status</button></div>
      <p class="hint">These buttons record handover only. They do not award marks or prove that the paper was completed. There are deliberately no answer boxes or model exam answers here.</p>
      <details class="model" id="teacherPaper" hidden><summary>Teacher: print preparation and assessment boundary</summary><p>Prepare June 2023 Paper 2, printed page 3, Q02.1–02.3 only. Use the official mark scheme (2 + 2 + 1 marks). Do not assign neighbouring questions that require untaught content. Keep marking on the paper or your assessment tracker; the app records no exam score.</p><p>Optional alternative for a student needing recognition support: November 2023 Q01.1 (2 marks). Do not add it as a compulsory second paper. Review whether the student can then explain the terms without choices.</p></details>`);
    section='pitstop';
    html+=stage(section,'Where am I now?','Revisit the same six targets using your actual work. A phase describes your experience with that target today; it is not a grade.',`
      <p><strong>New learning:</strong> this is new and I can move forward with a manageable challenge. <strong>Consolidating:</strong> I am strengthening something I already know. <strong>Treading water:</strong> this is easy and I need an appropriate next challenge. <strong>Drowning:</strong> this feels too hard and I need help to move forward.</p><p>“Drowning” is the school’s learning-phase label, not a label for you as a person. You may choose “Not attempted yet”. Ask for help privately at any point; you do not have to finish this page first.</p><p id="startingFocus" class="note"></p>
      ${reflectionRows(true)}<div id="afterSummary" class="reflection-summary" aria-live="polite"></div>
      ${select('pitstop.priority','Choose one next-step priority',targets.map(t=>[t.id,`${t.group}: ${t.title}`]))}<p id="priorityAction" class="coach"></p>
      ${field('pitstop.evidence','Point to one piece of work that shows where you are now.','text',{hint:'For example: “My three tests agree, but I used the tutor to understand the print line.” Say if something is unfinished rather than guessing.'})}`);
    section='plenary';
    html+=stage(section,'Show what is now clearer.','Try these short questions without looking back first. Then use the guidance to improve one answer. It is fine to record where you still need help.',`
      ${field('plenary.q1','1. Define decomposition.','text',{hint:'Explain what happens to the original problem and what each smaller part represents.'})}
      ${field('plenary.q2','2. A library-fine program calculates the fine from overdue days and a daily charge. Explain why the library wall colour can be left out.','text',{hint:'Link your explanation to this program’s purpose.'})}
      <h2>3. Repair the sequence</h2><p>The daily charge is already assigned on the first line. Keep it there. Put the remaining three lines in a working order, then explain why you moved one line.</p>
      ${code('exitCode','Lines to reorder · not a runnable model','charge = 0.50\nprint("Fine RM:", total)\ntotal = days * charge\ndays = int(input("Days overdue: "))')}
      ${field('plenary.q3','Write the corrected four lines and explain one change.','code',{rows:6})}
      <button id="plenaryReveal" class="primary">Save my first attempt and show guidance</button><div id="exitGuidance" hidden><h2>Compare and improve</h2><p><strong>1.</strong> Decomposition breaks a problem into smaller subproblems, each with an identifiable task. <strong>2.</strong> Wall colour does not affect the overdue-days × daily-charge calculation, so it is unnecessary for this purpose.</p>${code('exitModel','One corrected sequence','charge = 0.50\ndays = int(input("Days overdue: "))\ntotal = days * charge\nprint("Fine RM:", total)')}<p><strong>3.</strong> The value of days is received before the multiplication. The total is calculated before it is printed. Naming that dependency explains the change.</p></div>
      ${field('plenary.improvement','One improvement to my answer, or one precise question for my teacher','text',{hint:'Your first revealed attempt and your current responses will both appear in the report. These written answers are not automatically marked.'})}
      <p class="note">Return to a learning target if this exit ticket changes your view. The pit stop is a reflection, not a permanent score.</p><button data-go="pitstop">Update my learning pit stop</button>`);
    section='report';
    html+=stage(section,'Save and submit your evidence.','Export at any point, including unfinished work. The report includes recorded answers, first checked attempts, code, tests, reflections and your uploaded screenshots.',`
      <div class="screen-only"><div class="note"><h2>Submit to Microsoft Teams</h2><ol><li>Select <strong>Save / print PDF</strong>, then choose <strong>Save as PDF</strong> in your browser’s print window.</li><li>Use the filename below. Preview all pages and confirm your screenshots and text are visible.</li><li>Open the correct Year 10 Computer Science assignment in Teams. Attach your saved PDF and select <strong>Turn in</strong>.</li><li>If your teacher is collecting work through a different named location, follow that instruction. Exporting here does not upload or submit anything automatically.</li></ol><p>Suggested filename: <strong id="filename"></strong></p><p id="exportStatus" role="status"></p></div><div class="toolbar"><button class="primary" id="printReport">Save / print PDF</button><button id="downloadBackup">Download work backup</button><button id="refreshReport">Refresh preview</button></div><p class="small">The backup is a JSON copy of your saved work and images. Keep the PDF as the readable submission. Save before clearing browser data or changing devices.</p></div>
      <article id="reportPrint" class="report-document" aria-label="Student evidence report"></article>`);
    return html;
  }
  function reflectionRows(after) {
    return targets.map((t,i)=>`<article class="reflection-item"><p class="eyebrow">${i+1} of 6 · ${t.group}</p><h2>${t.title}</h2><p>${after?t.evidence:t.before}</p>${after?`<p id="prior-${t.id}" class="hint"></p>`:''}${select((after?'after.':'before.')+t.id,t.statement,after?phaseOptions:beforeOptions)}${after?`<p class="coach" id="action-${t.id}"></p>`:''}</article>`).join('');
  }
  const v = key => state.fields[key] ?? '';
  const readable = (key,value) => {
    const meta=registry.get(key);
    if(meta?.type==='checkbox') return value===true?'Confirmed by student':'Not confirmed';
    return meta?.options?.find(o=>o[0]===value)?.[1] ?? (String(value??'').trim()||'Not answered');
  };
  const strip = html => {const d=document.createElement('div');d.innerHTML=html.replace(/<\/(p|h[1-6]|li|div)>/gi,'$&\n');return d.textContent.trim();};
  function showWarning(message) { $('saveWarning').hidden=false;$('saveWarning').textContent=message; }
  function toast(message) {$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,5500);}
  function persist() {
    const stored={...state,evidence:state.evidence.map(({dataUrl,...meta})=>meta)};
    try {
      localStorage.setItem(activeKey,JSON.stringify(stored));
      const count=Object.values(state.fields).filter(x=>x===true||(typeof x==='string'&&x.trim())).length;
      $('saveStatus').textContent=`${count} responses saved locally`;
      return true;
    } catch {
      $('saveStatus').textContent='Not saved — export now';
      showWarning('This browser could not save your latest work. Keep this tab open and export your PDF or download a backup now.');
      return false;
    }
  }
  function validImage(data) {return typeof data==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(data);}
  function openImages() {
    return new Promise(resolve=>{
      try {
        const request=indexedDB.open('y10-w3s1-evidence-v2',1);
        request.onupgradeneeded=()=>request.result.createObjectStore('images',{keyPath:'id'});
        request.onsuccess=()=>{db=request.result;resolve(true);};
        request.onerror=()=>resolve(false);
        request.onblocked=()=>resolve(false);
      } catch {resolve(false);}
    });
  }
  function imageRecord(mode,item) {
    return new Promise((resolve,reject)=>{
      if(!db) return reject(new Error('Image storage unavailable'));
      try {
        const tx=db.transaction('images',mode==='get'?'readonly':'readwrite');
        const store=tx.objectStore('images');
        const request=mode==='get'?store.get(item):store.put(item);
        let result;
        request.onsuccess=()=>{result=request.result;};
        request.onerror=()=>reject(request.error);
        tx.oncomplete=()=>resolve(result);
        tx.onerror=()=>reject(tx.error);
        tx.onabort=()=>reject(tx.error);
      } catch(error){reject(error);}
    });
  }
  async function restoreImages() {
    for(const item of state.evidence) {
      item.id ||= crypto.randomUUID();
      if(validImage(item.dataUrl)) {
        item.id ||= crypto.randomUUID();
        try {await imageRecord('put',item);} catch {showWarning('Some earlier screenshots are available only in this tab. Export now to keep them.');}
      } else {
        try {const stored=await imageRecord('get',item.id);if(validImage(stored?.dataUrl))item.dataUrl=stored.dataUrl;else item.missing=true;}
        catch {item.missing=true;}
      }
    }
    if(state.evidence.some(e=>e.missing))showWarning('An earlier screenshot could not be restored. Add it again before exporting. The report will identify any missing image.');
    renderEvidence();
  }
  function migrate(saved) {
    const result={...defaultState(),...saved,fields:{...(saved.fields||{})},reviewed:{...(saved.reviewed||{})},firstChecks:{...(saved.firstChecks||{})},flags:{...(saved.flags||{})},evidence:Array.isArray(saved.evidence)?saved.evidence:[]};
    if(saved.version!==2) {result.legacy=true;result.version=2;result.legacyScores=saved.scores||{};result.current='overview';}
    if(!stages.some(s=>s[0]===result.current))result.current='overview';
    return result;
  }
  function restoreControls() {
    document.querySelectorAll('[data-key]').forEach(el=>{
      const value=v(el.dataset.key);
      if(el.type==='checkbox')el.checked=value===true;else el.value=value;
      const hint=$(el.id+'-hint');if(hint)el.setAttribute('aria-describedby',hint.id);
    });
    document.querySelectorAll('[data-reviewed]').forEach(el=>el.checked=state.reviewed[el.dataset.reviewed]===true);
  }
  function routeHTML() {
    return stages.map((s,i)=>`<button data-go="${s[0]}" ${state.current===s[0]?'aria-current="step"':''}>${i+1}. ${s[1]}${state.reviewed[s[0]]?' · reviewed':''}</button>`).join('')+'<div class="identity-action"><button id="changeIdentity">Change name / student</button><p class="small">Export before changing devices. Teacher preview is separate from student work.</p></div>';
  }
  function updateRoute() {$('route').innerHTML=routeHTML();}
  function go(id) {
    if(!stages.some(s=>s[0]===id))return;
    state.current=id;
    document.querySelectorAll('.stage').forEach(el=>el.hidden=el.id!==id);
    $('currentLabel').textContent=stages.find(s=>s[0]===id)[1];
    $('route').hidden=true;$('menuButton').setAttribute('aria-expanded','false');
    updateRoute();renderReflections();reusePlan();
    if(id==='main2')renderTutor();
    if(id==='report')buildReport();
    persist();$('lesson').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  }
  function snapshot(name,keys) {
    if(!state.firstChecks[name])state.firstChecks[name]={at:new Date().toISOString(),answers:Object.fromEntries(keys.map(k=>[k,v(k)]))};
  }
  function checkStarter(record=true) {
    const keys=['starter.roleInput','starter.roleProcessing','starter.roleOutput'];
    if(record) {snapshot('Starter', ['starter.prediction',...keys,'starter.swap','starter.priceReason']);state.flags.starterChecked=true;}
    const expected=['input','processing','output'];let correct=0,attempted=0;
    const lines=keys.map((key,i)=>{
      if(!v(key))return `<li>Role ${i+1}: not answered yet.</li>`;
      attempted++;const right=v(key)===expected[i];if(right)correct++;
      return `<li>Role ${i+1}: ${right?'Correct.':'Review this choice.'} This instruction ${['receives a quantity from the user (input)','multiplies two values (processing)','displays the result (output)'][i]}.</li>`;
    });
    $('starterResult').innerHTML=`<strong>${correct} of 3 role choices correct; ${attempted} attempted.</strong><ul>${lines.join('')}</ul><p>This is not a mark for your written predictions or explanations. Use the guidance to review those.</p>`;
    if(record)persist();
  }
  function checkFacts(record=true) {
    if(record){snapshot('Information choices',facts.map(f=>'main1.'+f[0]));state.flags.factsChecked=true;}
    let correct=0,attempted=0;
    const reason={factName:'Needed as input to identify whose total is displayed; it is not multiplied.',factLaps:'Needed as numeric input for the multiplication.',factRate:'Needed as numeric input for the multiplication.',factShoes:'Shoe colour affects neither this calculation nor the required output.',factWeather:'This version uses confirmed completed laps, not a prediction based on weather.',factSubject:'Favourite subject is not used in the calculation or the personalised message.',factTotal:'The total is calculated from laps and rate, then included in the output.'};
    facts.forEach(([key,,answer])=>{
      const response=v('main1.'+key),el=$('feedback-'+key);el.classList.remove('retry');
      if(!response){el.textContent='Not answered yet.';return;}
      attempted++;const right=response===answer;if(right)correct++;
      el.textContent=(right?'Correct. ':'Review. ')+reason[key];el.classList.toggle('retry',!right);
    });
    $('factsResult').innerHTML=`<strong>${correct} of 7 information choices correct; ${attempted} attempted.</strong><p>These are checked choices, not a score for the written abstraction or decomposition explanations.</p>`;
    if(record)persist();
  }
  function sequenceResult(fields) {
    const positions=Object.fromEntries(seq.map(([key])=>[key,Number(fields['main1.'+key]||0)]));
    if(Object.values(positions).some(n=>n<1||n>5||!Number.isInteger(n)))return {valid:false,ready:false,messages:['Give each of the five steps a position from 1 to 5. Unanswered steps are not marked wrong.']};
    if(new Set(Object.values(positions)).size!==5)return {valid:false,ready:false,messages:['Use each position once. Two steps currently share a position, so the order is not yet clear.']};
    const rules=[['seqLaps','seqCalculate','Completed laps must be entered before the multiplication.'],['seqRate','seqCalculate','The sponsorship rate must be entered before the multiplication.'],['seqCalculate','seqDisplay','The total must be calculated before it is displayed.'],['seqName','seqDisplay','The name must be entered before the personalised output.']];
    const messages=rules.filter(([a,b])=>positions[a]>=positions[b]).map(r=>r[2]);
    return {valid:!messages.length,ready:true,messages};
  }
  function checkSequence(record=true) {
    if(record){snapshot('Sequence',seq.map(s=>'main1.'+s[0]));state.flags.sequenceChecked=true;}
    const result=sequenceResult(state.fields);
    $('sequenceResult').innerHTML=result.valid?'<strong>This is a valid sequence.</strong><p>Laps and rate exist before the calculation, and name and total exist before output. The inputs can have different orders. Asking for the name after calculating the total also works if the name is entered before output.</p><p>Now explain one dependency in your own words. That written explanation is not automatically marked.</p>':`<strong>${result.ready?'This order needs a change.':'Finish specifying the order when ready.'}</strong><ul>${result.messages.map(m=>`<li>${m}</li>`).join('')}</ul><p>Change one position at a time, then check again. You can ask your teacher for help or continue with an unfinished attempt.</p>`;
    if(record)persist();
  }
  const tutor=[
    ['Line 1: store the known price','Python assigns the decimal number 3.50 to PRICE. Uppercase is our convention for a named constant; Python does not prevent it from being reassigned.','PRICE = 3.5 (float). quantity and total have not been assigned.'],
    ['Line 2: receive and convert input','The quoted words are a prompt for the user. In this example the user types 4. input() returns the string "4"; int() converts it to the integer 4. The result is assigned to quantity. The inner parentheses belong to input; the outer pair belongs to int.','PRICE = 3.5; quantity = 4 (int). total has not been assigned.'],
    ['Line 3: calculate, then assign','Python reads the two stored values. The * operator multiplies 3.5 by 4. The = assigns that result to total. Both values must exist before this line.','PRICE = 3.5; quantity = 4; total = 14.0 (float).'],
    ['Line 4: display the result','The quoted text is a fixed label. total is outside quotation marks, so its value is displayed. The comma separates the label from the value; print adds a space between them. This line does not change total.','Output: Total cost: 14.0. Stored values are unchanged.']
  ];
  function renderTutor() {
    // Rebuild the tiny view after returning from print: some browsers cache an
    // empty paint layer for horizontally scrolling content hidden in print CSS.
    $('tutorCode').innerHTML=starterSource.split('\n').map((line,i)=>`<div class="code-line" data-line="${i}"><span class="line-number" aria-hidden="true">${i+1}</span><code>${esc(line)}</code></div>`).join('');
    document.querySelectorAll('[data-line]').forEach(el=>{const active=Number(el.dataset.line)===tutorIndex;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    $('tutorBack').disabled=tutorIndex===0;$('tutorNext').disabled=tutorIndex===3;
    const [title,explain,values]=tutor[tutorIndex];
    $('tutorExplanation').innerHTML=`<h3>${title}</h3><p>${esc(explain)}</p><p class="tutor-values">${esc(values)}</p>`;
  }
  function reusePlan() {
    $('reusedPlan').innerHTML=[['Input','main1.decomposeInput'],['Processing','main1.decomposeProcess'],['Output','main1.decomposeOutput']].map(([label,key])=>`<p><strong>${label}:</strong> ${esc(v(key)||'Not recorded yet. Revisit Main Activity 1 or ask for help with this task.')}</p>`).join('');
  }
  function nextAction(t) {
    const index=['new','consolidating','easy','help'].indexOf(v('after.'+t.id));
    if(index>=0)return t.actions[index];
    if(v('after.'+t.id)==='not-attempted')return 'Not attempted is not a failure. First step: '+t.start;
    return 'Choose a phase when ready, or discuss this target with your teacher.';
  }
  function summaryHTML(after) {
    const prefix=after?'after.':'before.',choices=after?phaseOptions:beforeOptions;
    let text='<h3>Your reflection counts</h3><p>These are counts of your self-reports, not verified attainment marks. No score decides your learning phase.</p>';
    for(const group of ['Knowledge','Skills','Understanding']) {
      const set=targets.filter(t=>t.group===group);
      text+=`<p><strong>${group} · 2 checks:</strong> ${choices.map(([key,label])=>`${set.filter(t=>v(prefix+t.id)===key).length} ${esc(label.toLowerCase())}`).join('; ')}; ${set.filter(t=>!v(prefix+t.id)).length} unanswered.</p>`;
      if(!after){const focus=set.filter(t=>['prompt','new','unsure'].includes(v(prefix+t.id)));if(focus.length)text+=`<p>Possible focus: ${focus.map(t=>t.title).join('; ')}.</p>`;}
    }
    return text;
  }
  function renderReflections() {
    $('beforeSummary').innerHTML=summaryHTML(false);$('afterSummary').innerHTML=summaryHTML(true);
    const chosen=targets.find(t=>t.id===v('learning.focus'));
    $('focusAction').textContent=chosen?chosen.start:'Choose a focus using your evidence. A fact you already know does not automatically need to be your main target.';
    $('startingFocus').textContent=chosen?`Your starting focus: ${chosen.group} — ${chosen.title}. What can your work now show?`:'No starting focus recorded. You can still reflect on your work now.';
    targets.forEach(t=>{$('prior-'+t.id).textContent='After Do Now: '+readable('before.'+t.id,v('before.'+t.id));$('action-'+t.id).textContent=nextAction(t);});
    const priority=targets.find(t=>t.id===v('pitstop.priority'));
    $('priorityAction').textContent=priority?nextAction(priority):'Choose one next step. If you need help, show the relevant line or answer to your teacher; the app does not send an alert.';
  }
  function renderPaper() {
    const paper=state.paper||{};
    $('paperSignal').hidden=!paper.requested||!!paper.received;
    $('paperStudent').textContent=`${state.student.name} · ${state.student.className}`;
    $('paperStatus').textContent=paper.handed?'You recorded that you handed in the sheet. The teacher will mark the paper.':paper.received?'You recorded that you received the sheet. Write your answers on that paper.':paper.requested?'Request recorded on this device only. Please raise your hand.':'No paper requested. The extension is optional.';
    $('paperReceived').disabled=!paper.requested||!!paper.received;
    $('paperHanded').disabled=!paper.received||!!paper.handed;
    $('requestPaper').disabled=!!paper.requested;
  }
  function renderEvidence() {
    $('evidencePreview').innerHTML=state.evidence.map((item,i)=>`<figure class="evidence-item">${validImage(item.dataUrl)?`<img src="${item.dataUrl}" alt="Student IDE evidence ${i+1}: ${esc(item.name)}">`:'<p class="warning">Image not available. Please add this screenshot again before export.</p>'}<figcaption>${i+1}. ${esc(item.name)}</figcaption><button data-remove="${esc(item.id)}">Remove this screenshot</button></figure>`).join('');
    $('imageStatus').textContent=imageBusy?'Saving screenshot(s)…':`${state.evidence.length} of 6 screenshot slots used.`;
  }
  function readFile(file) {return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});}
  async function addImages(files) {
    imageBusy++;renderEvidence();
    for(const file of files) {
      if(state.evidence.length>=6){toast('Six screenshots are already attached. Remove one if you need to replace it.');break;}
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)){toast('Use a PNG, JPEG or WebP screenshot.');continue;}
      if(file.size>8*1024*1024){toast('This image is larger than 8 MB. Crop it to the relevant code or output, then add it again.');continue;}
      try {
        const dataUrl=await readFile(file);if(!validImage(dataUrl))throw new Error('Invalid image');
        const probe=new Image();probe.src=dataUrl;await probe.decode();
        const item={id:crypto.randomUUID(),name:file.name||'Pasted screenshot.png',dataUrl,width:probe.naturalWidth,height:probe.naturalHeight};
        state.evidence.push(item);
        try {await imageRecord('put',item);} catch {showWarning('Screenshot storage is unavailable or full. The image is visible in this tab, but may be lost after closing it. Export your PDF or download a backup now.');}
        persist();
      } catch {toast('This screenshot could not be read. Try saving it as a PNG and adding it again.');}
    }
    imageBusy--;renderEvidence();
  }
  function paperDescription() {
    const p=state.paper||{};
    return `June 2023 · 9210/2 · Q02.1–02.3 · 5 marks\nRequested: ${p.requested?new Date(p.requested).toLocaleString():'No'}\nReceived: ${p.received?new Date(p.received).toLocaleString():'Not confirmed'}\nHanded in: ${p.handed?new Date(p.handed).toLocaleString():'Not confirmed'}\nHandover is self-reported. No exam answers or marks are recorded in this app. The paper is separate evidence.`;
  }
  function reportEntry(title,value,isCode=false) {return `<div class="report-entry"><h3>${esc(strip(title))}</h3>${isCode?`<pre>${esc(value)}</pre>`:`<p>${esc(value)}</p>`}</div>`;}
  function imageReport() {
    return state.evidence.length?state.evidence.map((item,i)=>`<figure class="report-image">${validImage(item.dataUrl)?`<img src="${item.dataUrl}" alt="IDE evidence ${i+1}">`:'<p>SCREENSHOT MISSING: please attach again before submitting.</p>'}<figcaption>${i+1}. ${esc(item.name)}</figcaption></figure>`).join(''):'<p>No screenshot evidence attached.</p>';
  }
  function assessmentSummary() {
    const roles=['Input','Processing','Output'];
    const correctRoles=roles.filter(r=>v('starter.role'+r)===r.toLowerCase()).length;
    const attemptedRoles=roles.filter(r=>v('starter.role'+r)).length;
    const correctFacts=facts.filter(([key,,answer])=>v('main1.'+key)===answer).length;
    const attemptedFacts=facts.filter(([key])=>v('main1.'+key)).length;
    const order=sequenceResult(state.fields);
    return `Current responses only: starter roles ${correctRoles}/3 correct (${attemptedRoles} attempted); information choices ${correctFacts}/7 correct (${attemptedFacts} attempted).\nSequence: ${order.valid?'valid ordering':order.ready?'needs a dependency correction':'not yet fully specified'}.\nWritten explanations, Python correctness and test outcomes are not automatically verified. Reflections, test comparisons and reviewed-stage ticks are self-reported. Unanswered is not the same as wrong.`;
  }
  function filename() {return `9210_W3S1_${state.student.name}_${state.student.className}`.replace(/[^\p{L}\p{N}_-]/gu,'_')+'.pdf';}
  function buildReport() {
    let html=`<h1>From Problems to Algorithms</h1><p>Year 10 · Week 3 Session 1 · OxfordAQA 9210</p><p><strong>${esc(state.student.name)} · ${esc(state.student.className)}</strong><br>Report prepared: ${esc(new Date().toLocaleString())}${teacher?'<br>TEACHER PREVIEW — NOT STUDENT EVIDENCE':''}</p><p><strong>WAGBA:</strong> Turning a problem into a precise, ordered and manageable solution.</p><p><strong>K:</strong> define the four concepts. <strong>S:</strong> select information, organise tasks and implement familiar Python. <strong>U:</strong> explain why order and purpose matter.</p>`;
    html+='<h2>Evidence summary</h2>'+reportEntry('What has been checked?',assessmentSummary());
    html+=reportEntry('Stages reviewed — student confirmation, not marks',stages.filter(s=>s[0]!=='report').map(([id,label])=>`${label}: ${state.reviewed[id]?'review confirmed':'review not confirmed'}`).join('\n'));
    for(const [id,label] of stages.filter(s=>s[0]!=='report'&&s[0]!=='overview')) {
      html+=`<h2>${esc(label)}</h2>`;
      for(const [key,meta] of registry)if(meta.section===id)html+=reportEntry(meta.label,readable(key,v(key)),meta.type==='code');
      if(id==='main1')html+=reportEntry('Current sequence check',sequenceResult(state.fields).valid?'Valid ordering; reasoning still requires review.':sequenceResult(state.fields).messages.join('\n'));
      if(id==='main2')html+='<h3>Uploaded IDE screenshots</h3>'+imageReport();
      if(id==='learningTypes')html+=reportEntry('Starting counts — self-report',strip(summaryHTML(false)))+reportEntry('Suggested focus action',$('focusAction').textContent);
      if(id==='pitstop')html+=reportEntry('Phase counts — self-report',strip(summaryHTML(true)))+reportEntry('Before-and-after comparison',targets.map(t=>`${t.group}: ${t.title}\nBefore: ${readable('before.'+t.id,v('before.'+t.id))}\nNow: ${readable('after.'+t.id,v('after.'+t.id))}\nSuggested action: ${nextAction(t)}`).join('\n\n'))+reportEntry('Chosen next action',$('priorityAction').textContent);
      if(id==='extension')html+=reportEntry('Paper handover record',paperDescription());
    }
    html+='<h2>First checked / revealed attempts</h2><p>These snapshots retain the original responses at the first check. Current responses appear above; seeing a model is not independent assessment.</p>';
    if(!Object.keys(state.firstChecks).length)html+='<p>No first-check snapshot recorded.</p>';
    for(const [name,check] of Object.entries(state.firstChecks)) {
      html+=`<h3>${esc(name)} · ${esc(new Date(check.at).toLocaleString())}</h3>`;
      for(const [key,value] of Object.entries(check.answers||{}))html+=reportEntry(registry.get(key)?.label||key,readable(key,value),registry.get(key)?.type==='code');
    }
    const extra=Object.entries(state.fields).filter(([key])=>!registry.has(key));
    if(extra.length){html+='<h2>Earlier-version responses retained</h2><p>These came from an earlier version of this lesson. They have not been regraded or silently removed.</p>';for(const [key,value] of extra)html+=reportEntry(key,typeof value==='object'?JSON.stringify(value):String(value));}
    if(state.legacyScores&&Object.keys(state.legacyScores).length)html+=reportEntry('Earlier-version automatic scores — not revalidated',JSON.stringify(state.legacyScores));
    html+='<h2>Reading references and submission</h2><p>Textbook printed p. 8: input, assignment and sequence; pp. 18–19: conversion recap; p. 88: decomposition; pp. 98–99: algorithms and implementation; pp. 100–101: abstraction. Read only the sections named in the lesson.</p><p>Save this report as '+esc(filename())+'. Preview all pages, attach it to the correct Microsoft Teams assignment and select Turn in. Exporting does not submit the work. The paper extension is handed in separately as directed.</p>';
    $('reportPrint').innerHTML=html;$('filename').textContent=filename();
  }
  async function printReport() {
    const button=$('printReport');button.disabled=true;$('exportStatus').textContent='Preparing every response and screenshot…';
    try {
      await imageWrite;buildReport();
      const imgs=[...$('reportPrint').querySelectorAll('img')];
      await Promise.all(imgs.map(img=>img.decode()));
      if(document.fonts?.ready)await document.fonts.ready;
      if(state.evidence.some(e=>!validImage(e.dataUrl))){$('exportStatus').textContent='A screenshot is missing. Add it again, or export with the missing-image notice.';if(!confirm('A screenshot is missing. Export the available work with a missing-image notice?'))return;}
      const oldTitle=document.title;document.title=filename().replace(/\.pdf$/,'');
      const restore=()=>{document.title=oldTitle;window.removeEventListener('afterprint',restore);};window.addEventListener('afterprint',restore);
      window.print();setTimeout(restore,1500);
      $('exportStatus').textContent='Choose Save as PDF in the print window. The app cannot confirm that you saved or submitted the file.';
    } catch {$('exportStatus').textContent='A screenshot could not be prepared. Review it or download a backup before trying again.';}
    finally {button.disabled=false;}
  }
  function downloadBackup() {
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=filename().replace(/\.pdf$/,'.json');a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Backup download requested. Check that it was saved to your device.');
  }
  async function copyCode(id) {
    const text=$(id).textContent;
    try {await navigator.clipboard.writeText(text);toast('Code copied without line numbers. Paste it into your own IDE.');}
    catch {
      const helper=document.createElement('textarea');helper.value=text;helper.readOnly=true;helper.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(helper);helper.select();
      let copied=false;try{copied=document.execCommand('copy');}catch{}helper.remove();
      if(copied)toast('Code copied without line numbers. Paste it into your own IDE.');
      else {const area=document.createElement('div');area.className='note';area.innerHTML='<label>Copy this clean code manually (Ctrl+C or Command+C)<textarea readonly class="code-answer"></textarea></label>';area.querySelector('textarea').value=text;$(state.current).prepend(area);area.querySelector('textarea').focus();area.querySelector('textarea').select();toast('Automatic copying is unavailable. Clean code is selected in the manual copy box.');}
    }
  }
  function updateFeedbackFor(key) {
    if(key.startsWith('starter.')&&state.flags.starterChecked)$('starterResult').innerHTML='<p>Your answer changed. Select Check again to refresh the feedback.</p>';
    if(key.startsWith('main1.fact')&&state.flags.factsChecked){$('factsResult').innerHTML='<p>Your choice changed. Select Check again to refresh the feedback.</p>';const el=$('feedback-'+key.split('.')[1]);if(el)el.textContent='Changed — check again.';}
    if(key.startsWith('main1.seq')&&state.flags.sequenceChecked)$('sequenceResult').innerHTML='<p>Your sequence changed. Select Check again to refresh the feedback.</p>';
  }
  function bindLesson() {
    $('lesson').addEventListener('input',event=>{
      const el=event.target;if(!el.dataset.key)return;
      state.fields[el.dataset.key]=el.type==='checkbox'?el.checked:el.value;
      updateFeedbackFor(el.dataset.key);persist();
      if(/^(before|after|learning|pitstop)\./.test(el.dataset.key))renderReflections();
    });
    $('lesson').addEventListener('change',event=>{
      const el=event.target;
      if(el.dataset.reviewed){state.reviewed[el.dataset.reviewed]=el.checked;persist();updateRoute();}
      if(el.dataset.key){state.fields[el.dataset.key]=el.type==='checkbox'?el.checked:el.value;persist();renderReflections();}
      if(el.id==='evidenceUpload'){const files=[...el.files];imageWrite=imageWrite.then(()=>addImages(files));el.value='';}
    });
    $('lesson').addEventListener('paste',event=>{
      if(!event.target.closest('#pasteArea'))return;
      const images=[...(event.clipboardData?.items||[])].filter(i=>i.kind==='file'&&i.type.startsWith('image/')).map(i=>i.getAsFile());
      if(images.length){event.preventDefault();imageWrite=imageWrite.then(()=>addImages(images));}
    });
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!state)return;
    if(button.dataset.go)return go(button.dataset.go);
    if(button.dataset.copy)return void copyCode(button.dataset.copy);
    if(button.dataset.check){if(button.dataset.check==='starter')checkStarter();if(button.dataset.check==='facts')checkFacts();if(button.dataset.check==='sequence')checkSequence();return;}
    if(button.dataset.remove){if(!confirm('Remove this screenshot from the current evidence report?'))return;state.evidence=state.evidence.filter(e=>e.id!==button.dataset.remove);persist();renderEvidence();return;}
    switch(button.id){
      case 'menuButton':$('route').hidden=!$('route').hidden;button.setAttribute('aria-expanded',String(!$('route').hidden));break;
      case 'exportTop':go('report');break;
      case 'changeIdentity':$('app').hidden=true;$('landing').hidden=false;$('studentName').value=teacher?'':state.student.name;$('studentClass').value=teacher?'':state.student.className;$('studentName').focus();break;
      case 'tutorBack':tutorIndex=Math.max(0,tutorIndex-1);renderTutor();break;
      case 'tutorNext':tutorIndex=Math.min(3,tutorIndex+1);renderTutor();break;
      case 'tutorReset':tutorIndex=0;renderTutor();break;
      case 'requestPaper':state.paper={requested:new Date().toISOString()};persist();renderPaper();break;
      case 'paperReceived':if(state.paper?.requested){state.paper.received=new Date().toISOString();persist();renderPaper();}break;
      case 'paperHanded':if(state.paper?.received){state.paper.handed=new Date().toISOString();persist();renderPaper();}break;
      case 'paperReset':if(confirm('Clear the paper handover status? This does not withdraw or mark any physical paper.')){state.paper={};persist();renderPaper();}break;
      case 'plenaryReveal':snapshot('Plenary',['plenary.q1','plenary.q2','plenary.q3']);state.flags.plenaryRevealed=true;$('exitGuidance').hidden=false;persist();break;
      case 'refreshReport':buildReport();toast('Preview refreshed with your current work.');break;
      case 'printReport':void printReport();break;
      case 'downloadBackup':void imageWrite.then(downloadBackup);break;
    }
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('route').hidden=true;$('menuButton').setAttribute('aria-expanded','false');}});
  $('entryForm').addEventListener('submit',async event=>{
    event.preventDefault();await imageWrite;const name=$('studentName').value.trim(),className=$('studentClass').value.trim();
    const isTeacher=name.toLowerCase()==='teacher';
    if(!name||(!isTeacher&&!className)){$('entryMessage').textContent='Enter your name and class to continue. Teacher preview only needs the name teacher.';return;}
    const key=isTeacher?TEACHER_KEY:KEY;
    let saved=read(key)||(!isTeacher?read(OLD_KEY):null);
    if(saved&&!isTeacher&&(saved.student?.name?.toLowerCase()!==name.toLowerCase()||saved.student?.className?.toLowerCase()!==className.toLowerCase())) {
      if(!confirm('This browser has work for a different name or class. Cancel to export that work first. Continue to archive it locally and start a fresh record?'))return;
      try {localStorage.setItem(KEY+'-archive-'+Date.now(),JSON.stringify(saved));}catch{$('entryMessage').textContent='The earlier work could not be archived. Open it and export before starting another student.';return;}
      saved=null;
    }
    activeKey=key;teacher=isTeacher;state=saved?migrate(saved):defaultState();state.student={name,className:isTeacher?'Teacher preview':className};
    $('lesson').innerHTML=lessonHTML();restoreControls();$('app').hidden=false;$('landing').hidden=true;$('entryMessage').textContent='';
    $('identity').textContent=`${name} · ${state.student.className}`;$('teacherNotice').hidden=!teacher;
    $('teacherPaper').hidden=!teacher;document.querySelectorAll('[data-model]').forEach(el=>el.open=teacher);
    // Keep the first worked planning example open for a predictable read–model–apply sequence.
    $('main1').querySelector('[data-model]').open=true;
    $('exitGuidance').hidden=!(teacher||state.flags.plenaryRevealed);
    if(state.flags.starterChecked)checkStarter(false);if(state.flags.factsChecked)checkFacts(false);if(state.flags.sequenceChecked)checkSequence(false);
    tutorIndex=0;renderTutor();renderReflections();renderPaper();reusePlan();
    if(!db)await openImages();
    imageWrite=restoreImages();await imageWrite;
    if(state.legacy)toast('Earlier work has been retained. Newly added reflection questions have not been answered for you.');
    go(state.current);
  });
  bindLesson();
  if(window.ResizeObserver)new ResizeObserver(entries=>document.documentElement.style.setProperty('--header-height',entries[0].target.getBoundingClientRect().height+'px')).observe(document.querySelector('.topbar'));
  const prior=read(KEY)||read(OLD_KEY);if(prior?.student){$('studentName').value=prior.student.name||'';$('studentClass').value=prior.student.className||'';}
  // Expose only the pure dependency checker for automated tests; no student data API.
  window.LessonChecks=Object.freeze({sequenceResult});
})();
