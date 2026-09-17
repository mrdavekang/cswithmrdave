/* Year 10 OxfordAQA 9210 combined lesson. Static app: no network requests, analytics or in-browser Python execution. */
(() => {
  'use strict';

  const KEY = 'y10-w3-combined-s2s3-v1';
  const TEACHER_KEY = KEY + '-teacher';
  const DB_NAME = 'y10-w3-combined-evidence-v1';
  const DB_STORE = 'images';

  const stages = [
    {id:'read', label:'Read First', time:'4 min', clock:'00-04'},
    {id:'doNow', label:'Do Now', time:'4 min', clock:'04-08'},
    {id:'types', label:'Types of Learning', time:'3 min', clock:'08-11'},
    {id:'main1', label:'Main Task 1', time:'16 min', clock:'11-27'},
    {id:'main2', label:'Main Task 2', time:'22 min', clock:'27-49'},
    {id:'extension', label:'Extension', time:'3 min', clock:'49-52'},
    {id:'pitstop', label:'Learning Pit Stop', time:'3 min', clock:'52-55'},
    {id:'plenary', label:'Plenary', time:'5 min', clock:'55-60'}
  ];

  const startChoices = [
    ['independent','Independent'],
    ['prompt','With a prompt'],
    ['new','New to me'],
    ['unsure','Not sure yet']
  ];
  const phaseChoices = [
    ['new','New learning: a good struggle'],
    ['consolidating','Consolidating'],
    ['easy','Treading water: I need more challenge'],
    ['help','Drowning: I need help'],
    ['not-attempted','Not attempted yet']
  ];
  const learningTargets = [
    {id:'kSymbols', group:'Knowledge', title:'Flowchart and pseudocode notation', statement:'I know what the required flowchart symbols mean and what USERINPUT, assignment and OUTPUT do.'},
    {id:'kTrace', group:'Knowledge', title:'Trace-table vocabulary', statement:'I can explain trace table, dry run and reassignment.'},
    {id:'sRepresent', group:'Skills', title:'Represent an algorithm', statement:'I can represent a short sequence using a flowchart and pseudocode.'},
    {id:'sImplement', group:'Skills', title:'Trace and implement', statement:'I can trace a short algorithm, translate it into Python and check the result.'},
    {id:'uOrder', group:'Understanding', title:'Sequence and dependency', statement:'I can explain why some instructions must happen before others.'},
    {id:'uReassign', group:'Understanding', title:'Stored values and reassignment', statement:'I can explain how reassignment changes the value stored in a variable.'}
  ];

  const flowSteps = {
    start:{label:'START', shape:'terminator', kind:'Start / end'},
    inputName:{label:'INPUT name', shape:'io', kind:'Input / output'},
    inputLaps:{label:'INPUT laps', shape:'io', kind:'Input / output'},
    inputRate:{label:'INPUT rate', shape:'io', kind:'Input / output'},
    calcBase:{label:'total = laps × rate', shape:'process', kind:'Processing / assignment'},
    addBonus:{label:'total = total + 5', shape:'process', kind:'Processing / reassignment'},
    output:{label:'OUTPUT name and final total', shape:'io', kind:'Input / output'},
    end:{label:'END', shape:'terminator', kind:'Start / end'}
  };
  const defaultFlowOrder = ['calcBase','inputName','start','inputRate','output','addBonus','end','inputLaps'];

  const commonPseudo = `name ← USERINPUT\nlaps ← USERINPUT\nrate ← USERINPUT\ntotal ← laps * rate\ntotal ← total + 5\nOUTPUT name, "raised RM", total`;
  const pythonReference = `name = input("Participant name: ")\nlaps = int(input("Completed laps: "))\nrate = float(input("Sponsorship per lap (RM): "))\ntotal = laps * rate\ntotal = total + 5\nprint(name, "raised RM", total)`;
  const doNowCode = `laps = 5\nrate = 2.0\ntotal = laps * rate\nprint(total)`;
  const extensionPseudo = `Number ← USERINPUT\nNumber ← Number + 50\nNumber ← Number + 49\nNumber ← Number + 1`;

  const traceModel = [
    {line:1, code:'name ← USERINPUT', name:'Aisha', laps:'', rate:'', total:'', output:''},
    {line:2, code:'laps ← USERINPUT', name:'Aisha', laps:'5', rate:'', total:'', output:''},
    {line:3, code:'rate ← USERINPUT', name:'Aisha', laps:'5', rate:'2.0', total:'', output:''},
    {line:4, code:'total ← laps * rate', name:'Aisha', laps:'5', rate:'2.0', total:'10.0', output:''},
    {line:5, code:'total ← total + 5', name:'Aisha', laps:'5', rate:'2.0', total:'15.0', output:''},
    {line:6, code:'OUTPUT name, "raised RM", total', name:'Aisha', laps:'5', rate:'2.0', total:'15.0', output:'Aisha raised RM 15.0'}
  ];

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const strip = value => String(value ?? '').trim();
  let state = null;
  let teacher = false;
  let activeKey = KEY;
  let db = null;
  let traceModelIndex = 0;
  let toastTimer = null;
  let imageQueue = Promise.resolve();
  const evidenceCache = new Map();

  function defaultState(name='', className='') {
    return {
      version:1,
      student:{name, className},
      current:'read',
      reviewed:{},
      fields:{},
      checks:{},
      firstAttempts:{},
      flowOrder:[...defaultFlowOrder],
      evidence:[],
      createdAt:new Date().toISOString(),
      updatedAt:new Date().toISOString()
    };
  }

  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  }

  function persist() {
    if (!state) return;
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(activeKey, JSON.stringify(state));
      $('saveStatus').textContent = 'Saved on this device';
      $('storageWarning').hidden = true;
    } catch (err) {
      $('saveStatus').textContent = 'Save problem';
      $('storageWarning').hidden = false;
      $('storageWarning').textContent = 'Browser storage is unavailable or full. Export your evidence PDF before closing this tab.';
    }
  }

  function v(key, fallback='') { return state?.fields?.[key] ?? fallback; }
  function setField(key, value) { state.fields[key] = value; persist(); }

  function snapshot(name, payload) {
    if (!state.firstAttempts[name]) {
      state.firstAttempts[name] = {at:new Date().toISOString(), data:JSON.parse(JSON.stringify(payload))};
      persist();
    }
  }

  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3600);
  }

  function stageShell(stage, title, lead, body) {
    const idx = stages.findIndex(s => s.id === stage.id);
    const prev = stages[idx - 1];
    const next = stages[idx + 1];
    return `<section class="stage" id="stage-${stage.id}" data-stage="${stage.id}" ${state.current===stage.id?'':'hidden'}>
      <div class="stage-head"><p class="eyebrow">${esc(stage.label)} · ${esc(stage.clock)}</p><span class="time-badge">${esc(stage.time)}</span></div>
      <h1>${title}</h1>
      <p class="lead">${lead}</p>
      ${body}
      <label class="review-check"><input type="checkbox" data-reviewed="${stage.id}" ${state.reviewed[stage.id]?'checked':''}> <span>I have reviewed this stage. This records progress, not whether every answer is correct.</span></label>
      <div class="stage-actions">${prev?`<button type="button" data-go="${prev.id}">Back</button>`:'<span></span>'}${next?`<button class="primary" type="button" data-go="${next.id}">Continue: ${esc(next.label)}</button>`:`<button class="primary" id="openReportFinal" type="button">Review / export evidence</button>`}</div>
    </section>`;
  }

  function questionText(key, label, hint='', rows=3, cls='') {
    return `<div class="question"><label for="${esc(key)}">${label}</label>${hint?`<p class="hint">${hint}</p>`:''}<textarea id="${esc(key)}" class="${cls}" rows="${rows}" data-field="${esc(key)}">${esc(v(key))}</textarea></div>`;
  }

  function selectField(key, label, choices, hint='') {
    return `<div class="question"><label for="${esc(key)}">${label}</label>${hint?`<p class="hint">${hint}</p>`:''}<select id="${esc(key)}" data-field="${esc(key)}"><option value="">Choose when ready</option>${choices.map(([val,text])=>`<option value="${esc(val)}" ${v(key)===val?'selected':''}>${esc(text)}</option>`).join('')}</select></div>`;
  }

  function radioField(key, label, choices) {
    return `<fieldset class="question"><legend>${label}</legend><div class="choice-grid">${choices.map(([val,text])=>`<label><input type="radio" name="${esc(key)}" data-field="${esc(key)}" value="${esc(val)}" ${v(key)===val?'checked':''}><span>${text}</span></label>`).join('')}</div></fieldset>`;
  }

  function codeBox(id, title, source) {
    return `<div class="code-box"><div class="code-top"><span>${esc(title)}</span><button type="button" data-copy="${id}">Copy</button></div><pre id="${id}"><code>${esc(source)}</code></pre></div>`;
  }

  function model(title, html, open=false) {
    return `<details class="model" ${open||teacher?'open':''}><summary>${title}</summary><div>${html}</div></details>`;
  }

  function sourceNote(text) {
    return `<p class="source">Source focus: ${text}. The explanation here is teacher-written and restricted to the stated Year 10 scope.</p>`;
  }

  function readFirstHTML() {
    const s = stages[0];
    return stageShell(s,'Read the representations before you use them.','You will follow one algorithm from a visual plan to pseudocode, a dry run and Python.',`
      <article class="reading-card">
        <h2>Read first</h2>
        <p>An <strong>algorithm</strong> is a sequence of steps for completing a task. A <strong>flowchart</strong> shows those steps with shapes and arrows. <strong>Pseudocode</strong> writes the algorithm as readable instructions. Pseudocode is a plan, not a program that you run.</p>
        <p>In today’s pseudocode, <code>USERINPUT</code> receives a value, <code>←</code> assigns a value to a variable, and <code>OUTPUT</code> displays information. When an assignment contains a calculation, evaluate the expression on the right and store the result in the variable on the left.</p>
        <p>A <strong>dry run</strong> follows an algorithm manually using chosen input values. A <strong>trace table</strong> records the values held by variables as you move through the algorithm. If a later assignment uses the same variable name, the stored value is replaced by the new value.</p>
        ${sourceNote('OxfordAQA 9210 specification 3.1.1 and 3.2.2; Student Book printed pp.10-13 and 104-105')}
      </article>
      <h2>Four symbols you need today</h2>
      <div class="symbol-grid">
        <div class="symbol-card"><div class="shape terminator">START / END</div><strong>Terminator</strong><p class="small">Start or end of a flowchart.</p></div>
        <div class="symbol-card"><div class="shape io"><span>INPUT / OUTPUT</span></div><strong>Parallelogram</strong><p class="small">Data enters or leaves the algorithm.</p></div>
        <div class="symbol-card"><div class="shape process">assignment</div><strong>Rectangle</strong><p class="small">Processing or assigning a value.</p></div>
        <div class="symbol-card"><div class="arrow-demo">↓</div><strong>Connecting arrow</strong><p class="small">Shows the direction of sequence.</p></div>
      </div>
      <div class="callout"><strong>Not needed today:</strong> a decision diamond. Selection is not part of this combined sequence lesson.</div>
      ${radioField('read.q1','1. Which pseudocode feature stores or replaces a value in a variable?',[['assignment','Assignment using ←'],['output','OUTPUT'],['arrow','A flowchart connecting arrow']])}
      ${radioField('read.q2','2. Which method lets you predict values before running Python?',[['trace','Dry run with a trace table'],['compile','Compile the pseudocode'],['style','Change the flowchart colours']])}
      <div class="inline-actions"><button class="secondary" type="button" data-check="read">Check reading</button></div><div id="readResult" class="result" aria-live="polite"></div>
    `);
  }

  function doNowHTML() {
    const s = stages[1];
    return stageShell(s,'Predict before you run.','Use a familiar four-line Python sequence to check the foundations needed for today.',`
      ${codeBox('doNowCode','Do Now · read only',doNowCode)}
      ${questionText('do.q1','1. What is displayed by the final line?','Write only the displayed numeric value.',1)}
      ${radioField('do.q2','2. Which line performs the calculation?',[['1','Line 1'],['2','Line 2'],['3','Line 3'],['4','Line 4']])}
      ${questionText('do.q3','3. Why must the final line come after the calculation?','Name the value that must already exist before it can be displayed.',2)}
      <div class="card"><h3>4. Choose the conversion that suits each value if both were received using input().</h3>
        ${selectField('do.lapsType','Completed laps', [['int','int()'],['float','float()'],['none','No conversion']])}
        ${selectField('do.rateType','Sponsorship rate per lap', [['int','int()'],['float','float()'],['none','No conversion']])}
      </div>
      <div class="inline-actions"><button class="primary" type="button" data-check="doNow">Check Do Now</button></div><div id="doNowResult" class="result" aria-live="polite"></div>
      ${model('Model explanation',`<p>The output is <code>10.0</code>. Line 3 calculates <code>laps * rate</code> and assigns that result to <code>total</code>. The print instruction comes later because <code>total</code> must already hold a value.</p><p>If the values came from <code>input()</code>, completed laps suits <code>int()</code> because it is a whole number. A sponsorship rate may include a decimal, so <code>float()</code> is appropriate.</p>`, false)}
      ${sourceNote('Student Book printed p.8 for input and sequence, and pp.18-19 for conversion')}
    `);
  }

  function typesHTML() {
    const rows = learningTargets.map(t => `<div class="ksu-row"><div><span class="ksu-group">${esc(t.group)}</span><div class="ksu-title">${esc(t.title)}</div><p>${esc(t.statement)}</p></div><select data-field="before.${t.id}" aria-label="${esc(t.group+': '+t.title)}"><option value="">Choose</option>${startChoices.map(([val,text])=>`<option value="${val}" ${v('before.'+t.id)===val?'selected':''}>${text}</option>`).join('')}</select></div>`).join('');
    const s = stages[2];
    return stageShell(s,'Choose a starting point, not a label.','Use your Do Now and previous work as evidence. These are self-reports, not marks.',`
      <p><strong>Knowledge</strong> is what you can recall. <strong>Skills</strong> are what you can perform. <strong>Understanding</strong> is what you can explain and apply.</p>
      <div class="ksu-grid">${rows}</div>
      <div id="typesSummary" class="reflection-summary"></div>
      ${selectField('types.priority','Choose one priority for today',learningTargets.map(t=>[t.id,`${t.group}: ${t.title}`]))}
      ${questionText('types.evidence','What evidence supports that choice?','One short sentence is enough. For example, identify something you did independently or needed a prompt for.',2)}
    `);
  }

  function flowBuilderHTML() {
    return `<div id="flowBuilder" class="flow-builder">${state.flowOrder.map((id,index)=>{
      const item=flowSteps[id];
      return `<div class="flow-row" data-flow-id="${id}"><div class="flow-index">${index+1}</div><div class="flow-step"><strong>${esc(item.label)}</strong><span class="shape-tag">${esc(item.kind)}</span></div><div class="flow-controls"><button type="button" data-flow="up" data-id="${id}" aria-label="Move ${esc(item.label)} up" ${index===0?'disabled':''}>↑</button><button type="button" data-flow="down" data-id="${id}" aria-label="Move ${esc(item.label)} down" ${index===state.flowOrder.length-1?'disabled':''}>↓</button></div></div>`;
    }).join('')}</div>`;
  }

  function main1HTML() {
    const s = stages[3];
    return stageShell(s,'Represent the charity-run algorithm.','Build a valid flowchart sequence, then express the same solution as clear pseudocode.',`
      <article class="scenario"><p class="eyebrow">Riverside School Charity Run</p><h2>An updated total</h2><p>Riverside School needs a program to calculate how much each participant raises. The program receives the participant’s <strong>name</strong>, the <strong>number of completed laps</strong>, and the <strong>sponsorship rate per lap</strong>. It calculates the sponsorship total.</p><p>A sponsor now adds an extra <strong>RM5 for every participant</strong>, including a participant who completes zero laps. The program must display the participant’s name and final total.</p><p><strong>Assume:</strong> laps is a whole number. The rate may contain a decimal. The numerical entries are valid.</p></article>
      ${model('Quick worked model: one calculation in three representations',`<table><thead><tr><th>Flowchart process</th><th>Pseudocode</th><th>Python</th></tr></thead><tbody><tr><td><code>total = PRICE × quantity</code></td><td><code>total ← PRICE * quantity</code></td><td><code>total = PRICE * quantity</code></td></tr></tbody></table><p>The calculation stores a result. It does not display anything until a separate output instruction runs.</p>`, true)}
      <h2>A. Build the flowchart sequence</h2>
      <p>Move the eight cards into one valid order. The three input cards may be in different orders, but a calculation cannot use a value that has not been received yet.</p>
      ${flowBuilderHTML()}
      <div class="inline-actions"><button class="primary" type="button" data-check="flow">Check dependencies</button><span class="status-chip">8 shapes including START and END</span></div><div id="flowResult" class="result" aria-live="polite"></div>

      <h2>B. Write the pseudocode</h2>
      <p>Write approximately six instructions for the same algorithm. Keep it clear and unambiguous.</p>
      ${questionText('main1.pseudo','Your pseudocode','Use USERINPUT, assignment ← and OUTPUT. Do not add selection or loops.',8,'code-answer')}
      ${model('Need a scaffold?',`<pre>name ← ______\nlaps ← ______\nrate ← ______\ntotal ← ______ * ______\ntotal ← ______ + 5\nOUTPUT ______</pre><p>This is support, not the only acceptable layout.</p>`, false)}
      <div class="inline-actions"><button class="secondary" type="button" data-check="pseudo">Run pseudocode self-check</button><button class="ghost" type="button" id="showCommonPseudo">Show the common reference algorithm</button></div>
      <div id="pseudoResult" class="result" aria-live="polite"></div>
      <div id="commonPseudoPanel" class="card" ${teacher?'':'hidden'}><h3>Common reference algorithm for Main Task 2</h3>${codeBox('commonPseudoCode','Reference pseudocode',commonPseudo)}<p class="hint">Use this common version for tracing so everyone tests the same instructions. Keep your own first attempt above.</p></div>

      <h2>C. Hinge question</h2>
      ${radioField('main1.hinge','Where should total ← total + 5 appear in a flowchart?',[['process','A process rectangle, because it calculates and assigns a new value'],['io','An input/output parallelogram, because it shows a number'],['term','A terminator, because it finishes the total']])}
      <div class="inline-actions"><button class="secondary" type="button" data-check="hinge">Check hinge question</button></div><div id="hingeResult" class="result" aria-live="polite"></div>
      ${sourceNote('OxfordAQA 9210 specification 3.1.1; Student Book printed pp.10-13 and pp.24-25 for input, processing and output')}
    `);
  }

  function traceModelHTML() {
    const current = traceModel[traceModelIndex];
    return `<div class="code-box"><div class="code-top"><span>Common algorithm · model input: Aisha, 5, 2.0</span><span>Step ${traceModelIndex+1} of 6</span></div><div class="line-code">${traceModel.map((r,i)=>`<div class="code-line ${i===traceModelIndex?'active':''}"><span class="line-no">${r.line}</span><span>${esc(r.code)}</span></div>`).join('')}</div></div>
      <div class="trace-wrap"><table class="trace-table"><thead><tr><th>Line</th><th>name</th><th>laps</th><th>rate</th><th>total</th><th>Output</th></tr></thead><tbody>${traceModel.map((r,i)=>`<tr class="trace-model-row ${i<=traceModelIndex?'active':''}"><td>${r.line}</td><td>${i<=traceModelIndex?esc(r.name):''}</td><td>${i<=traceModelIndex?esc(r.laps):''}</td><td>${i<=traceModelIndex?esc(r.rate):''}</td><td>${i<=traceModelIndex?esc(r.total):''}</td><td>${i<=traceModelIndex?esc(r.output):''}</td></tr>`).join('')}</tbody></table></div>
      <p class="callout"><strong>At this step:</strong> ${traceExplanation(traceModelIndex)}</p>
      <div class="inline-actions"><button type="button" id="traceBack" ${traceModelIndex===0?'disabled':''}>Previous line</button><button class="primary" type="button" id="traceNext" ${traceModelIndex===5?'disabled':''}>Next line</button><button type="button" id="traceReset">Reset model</button></div>`;
  }

  function traceExplanation(i) {
    return [
      'The first input is stored in name. The numerical variables do not have values yet.',
      'The second input stores the whole-number lap count in laps.',
      'The third input stores the sponsorship rate in rate.',
      'The multiplication is evaluated, then 10.0 is assigned to total.',
      'The same variable is assigned again. total changes from 10.0 to 15.0.',
      'OUTPUT displays the name together with the final stored value of total.'
    ][i];
  }

  function traceInput(row, col) {
    const key=`trace.r${row}.${col}`;
    return `<input type="text" data-field="${key}" value="${esc(v(key))}" aria-label="Trace row ${row} ${col}">`;
  }

  function main2HTML() {
    const s = stages[4];
    return stageShell(s,'Trace it, then make it run.','Predict the variable states first. After that, translate the same algorithm into Python and compare predicted with actual results.',`
      <h2>A. Model one dry run</h2>
      <p>Use the buttons to move through the common algorithm one line at a time. A blank cell means that value has not been assigned yet or no output occurs on that line.</p>
      <div id="traceModelMount">${traceModelHTML()}</div>

      <h2>B. Independent trace checkpoint</h2>
      <div class="scenario"><strong>Test data:</strong> name = Mei · laps = 12 · rate = 1.25</div>
      <p>Complete the table before running the Python solution. You may repeat a stored value down a column or leave unchanged cells blank. The app checks only the key cells where a value is first assigned, changes, or is output.</p>
      <div class="trace-wrap"><table class="trace-table"><thead><tr><th>Line</th><th>name</th><th>laps</th><th>rate</th><th>total</th><th>Output</th></tr></thead><tbody>
        ${[1,2,3,4,5,6].map(r=>`<tr><td>${r}</td><td>${traceInput(r,'name')}</td><td>${traceInput(r,'laps')}</td><td>${traceInput(r,'rate')}</td><td>${traceInput(r,'total')}</td><td>${traceInput(r,'output')}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="inline-actions"><button class="primary" type="button" data-check="trace">Check key trace cells</button><span class="status-chip">Checkpoint: original attempt is retained</span></div><div id="traceResult" class="result" aria-live="polite"></div>
      ${questionText('trace.correction','My correction or question after checking','Keep your first attempt. Record what you changed or what you need help with.',2)}

      <h2>C. Translate into Python</h2>
      <div class="card"><h3>Translation reminders</h3><table><thead><tr><th>Pseudocode</th><th>Python</th></tr></thead><tbody><tr><td>assignment <code>←</code></td><td>assignment <code>=</code></td></tr><tr><td>numerical <code>USERINPUT</code></td><td><code>input()</code> with an appropriate conversion</td></tr><tr><td><code>OUTPUT</code></td><td><code>print()</code></td></tr><tr><td>multiply <code>*</code></td><td>multiply <code>*</code></td></tr></tbody></table></div>
      <ol><li>Write the six-line solution in your own Python IDE.</li><li>Run the Mei test first. Compare the actual result with your trace.</li><li>Run the Daniel boundary-style test with zero laps.</li><li>Correct your program if a result differs.</li></ol>
      ${model('Need the Python reference after your attempt?',`${codeBox('pythonReferenceCode','Teacher reference',pythonReference)}<p class="hint">Do not worry about currency formatting today. The focus is the correct stored value and labelled output.</p>`, false)}
      ${questionText('main2.code','Paste your final Python code here','This does not run inside the website. Run and test the code in your own IDE.',8,'code-answer')}

      <h3>Record two tests</h3>
      <div class="trace-wrap"><table class="test-table"><thead><tr><th>Test</th><th>Inputs</th><th>Expected final total</th><th>Your actual output</th></tr></thead><tbody>
        <tr><td>1</td><td>Mei · 12 · 1.25</td><td>RM20.00</td><td><input type="text" data-field="main2.test1" value="${esc(v('main2.test1'))}" placeholder="Paste or type output"></td></tr>
        <tr><td>2</td><td>Daniel · 0 · 3.50</td><td>RM5.00</td><td><input type="text" data-field="main2.test2" value="${esc(v('main2.test2'))}" placeholder="Paste or type output"></td></tr>
      </tbody></table></div>
      <div class="inline-actions"><button class="secondary" type="button" data-check="pythonTests">Check recorded outputs</button></div><div id="pythonTestResult" class="result" aria-live="polite"></div>

      <div class="evidence-zone" id="evidenceZone" tabindex="0"><strong>Add one clear IDE screenshot</strong><p>Paste, drag or choose a PNG, JPEG or WebP showing your final code and at least one successful run. A second screenshot is optional.</p><label class="secondary" for="evidenceInput">Choose screenshot</label><input id="evidenceInput" type="file" accept="image/png,image/jpeg,image/webp" multiple><div id="evidenceList" class="evidence-list"></div></div>
      ${questionText('main2.compare','What did you compare between the trace and the Python run?','Name one predicted value and the matching actual result.',2)}
      ${questionText('main2.purpose','Describe the overall purpose of this algorithm in one sentence.','Explain what it calculates and displays. Do not describe each line separately.',2)}
      ${sourceNote('OxfordAQA 9210 specification 3.1.1, 3.2.2, 3.2.7 and 3.2.8; Student Book printed pp.104-105 for trace tables')}
    `);
  }

  function extensionHTML() {
    const s = stages[5];
    return stageShell(s,'Optional exam-style reassignment challenge.','Use the same tracing skill on a compact algorithm. If your core evidence is unfinished, use these three minutes to complete or correct it instead.',`
      <p class="callout">This is an adapted exam-style practice task based on the kind of reassignment and algorithm inspection found in the supplied OxfordAQA Paper 2 materials. It does not introduce loops.</p>
      ${codeBox('extensionCode','Pseudocode',extensionPseudo)}
      <div class="scenario"><strong>Use input:</strong> 10</div>
      ${questionText('ext.q1','1. Record the value of Number after each instruction.','Write four values in order, separated by commas.',1)}
      ${questionText('ext.q2','2. Does this algorithm display a result? Explain.','Look for an output instruction.',2)}
      ${questionText('ext.q3','3. Replace the three additions with one equivalent assignment.','Your replacement should change Number by the same total amount.',2,'code-answer')}
      <div class="inline-actions"><button class="primary" type="button" data-check="extension">Check extension</button></div><div id="extensionResult" class="result" aria-live="polite"></div>
      ${model('Answer guidance',`<p>The values are <strong>10, 60, 109, 110</strong>. Nothing is displayed because there is no <code>OUTPUT</code> instruction. One equivalent assignment is <code>Number ← Number + 100</code>.</p>`, false)}
    `);
  }

  function pitstopHTML() {
    const rows = learningTargets.map(t => `<div class="ksu-row"><div><span class="ksu-group">${esc(t.group)}</span><div class="ksu-title">${esc(t.title)}</div><p>${esc(t.statement)}</p></div><select data-field="after.${t.id}" aria-label="Current stage for ${esc(t.title)}"><option value="">Choose</option>${phaseChoices.map(([val,text])=>`<option value="${val}" ${v('after.'+t.id)===val?'selected':''}>${text}</option>`).join('')}</select></div>`).join('');
    const s = stages[6];
    return stageShell(s,'Where are you in the learning pit?','Use what you actually produced today. Different statements can be at different stages.',`
      <dl class="card"><dt><strong>New learning: a good struggle</strong></dt><dd>It takes effort, but examples or a little support are helping.</dd><dt><strong>Consolidating</strong></dt><dd>I can do it with growing consistency and explain some of my decisions.</dd><dt><strong>Treading water: I need more challenge</strong></dt><dd>The current task is secure and I need a harder application.</dd><dt><strong>Drowning: I need help</strong></dt><dd>I cannot yet make progress without direct support.</dd><dt><strong>Not attempted yet</strong></dt><dd>I do not have evidence for this statement yet.</dd></dl>
      <div class="ksu-grid">${rows}</div>
      <div id="pitstopSummary" class="reflection-summary"></div>
      ${selectField('pit.priority','Choose one topic to practise, extend or discuss next',learningTargets.map(t=>[t.id,`${t.group}: ${t.title}`]))}
      ${questionText('pit.evidence','Give one piece of evidence for your current stage.','For example: “My trace predicted 20 and my Python output matched.” Or explain the exact line where you still need help.',2)}
      <p class="hint"><strong>Need help now?</strong> Show your selected statement and your evidence to your teacher. Saving this page does not send an alert.</p>
    `);
  }

  function plenaryHTML() {
    const s = stages[7];
    return stageShell(s,'Explain the difference between processing and output.','Finish with one concise explanation, then check your evidence and export it if required.',`
      ${questionText('plenary.q1','Exit question: Why is calculating a value not the same as outputting it?','Use the words store or variable and display or output in your explanation.',3)}
      <div class="inline-actions"><button class="secondary" type="button" data-check="plenary">Check explanation guide</button></div><div id="plenaryResult" class="result" aria-live="polite"></div>
      ${model('Model explanation',`<p>A calculation produces a value and can assign or store that value in a variable. An output instruction displays information. A value can therefore be calculated and stored without being displayed.</p>`, false)}
      <h2>Evidence check</h2>
      <div class="checklist">
        ${[['ev.flow','Flowchart sequence checked'],['ev.pseudo','Pseudocode attempt kept'],['ev.trace','Independent trace checkpoint completed'],['ev.python','Python code tested with both cases'],['ev.image','IDE screenshot added if required'],['ev.reflect','Learning pit evidence written']].map(([key,text])=>`<label><input type="checkbox" data-field="${key}" ${v(key)===true?'checked':''}><span>${text}</span></label>`).join('')}
      </div>
      <div class="card"><h2>Save and submit</h2><ol><li>Select <strong>Review / export evidence</strong>.</li><li>Check that your responses and screenshot are visible.</li><li>Select <strong>Export complete PDF</strong>.</li><li>In the print window choose <strong>Save as PDF</strong>.</li><li>Open the saved PDF and check the pages before uploading it to the correct Microsoft Teams assignment.</li></ol><button id="openReportCard" class="primary" type="button">Review / export evidence</button></div>
    `);
  }

  function renderLesson() {
    $('lesson').innerHTML = [readFirstHTML(),doNowHTML(),typesHTML(),main1HTML(),main2HTML(),extensionHTML(),pitstopHTML(),plenaryHTML()].join('');
    renderRoute();
    restoreCheckFeedback();
    renderReflections();
    renderEvidence();
    if (teacher) {
      document.querySelectorAll('.model').forEach(d => d.open = true);
      $('commonPseudoPanel').hidden = false;
    }
  }

  function renderRoute() {
    const currentIndex=stages.findIndex(s=>s.id===state.current);
    $('route').innerHTML=`<h2>60-minute route</h2>${stages.map((s,i)=>`<button type="button" class="route-item" data-go="${s.id}" ${s.id===state.current?'aria-current="step"':''}><span class="route-num">${i+1}</span><span><strong>${esc(s.label)}</strong><br><small>${esc(s.clock)}</small></span><span class="route-time">${state.reviewed[s.id]?'✓ ':''}${esc(s.time)}</span></button>`).join('')}<div class="route-actions"><button type="button" id="routeExport">Review / export PDF</button><button type="button" id="changeIdentity">Change name / class</button></div>`;
    $('currentLabel').textContent = stages[currentIndex]?.label || 'Lesson';
  }

  function go(id) {
    if (!stages.some(s=>s.id===id)) return;
    state.current=id; persist();
    document.querySelectorAll('[data-stage]').forEach(el=>{el.hidden=el.dataset.stage!==id;});
    renderRoute();
    $('route').hidden=true;
    $('menuButton').setAttribute('aria-expanded','false');
    $('lesson').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderReflections() {
    const counts = Object.fromEntries(startChoices.map(([v])=>[v,0]));
    learningTargets.forEach(t=>{const value=v('before.'+t.id);if(value)counts[value]++;});
    const types=$('typesSummary');
    if(types) types.innerHTML=`<strong>Starting-point overview</strong><br>Independent: ${counts.independent} · With a prompt: ${counts.prompt} · New to me: ${counts.new} · Not sure yet: ${counts.unsure}. <span class="hint">These are self-reports, not attainment scores.</span>`;
    const afterCounts=Object.fromEntries(phaseChoices.map(([v])=>[v,0]));
    learningTargets.forEach(t=>{const value=v('after.'+t.id);if(value)afterCounts[value]++;});
    const pit=$('pitstopSummary');
    if(pit) pit.innerHTML=`<strong>Current-stage overview</strong><br>Good struggle: ${afterCounts.new} · Consolidating: ${afterCounts.consolidating} · Need more challenge: ${afterCounts.easy} · Need help: ${afterCounts.help} · Not attempted: ${afterCounts['not-attempted']}.`;
  }

  function setResult(id, html, kind='') {
    const el=$(id); if(!el)return;
    el.className='result'+(kind?' '+kind:''); el.innerHTML=html;
  }

  function checkRead(record=true) {
    const a=v('read.q1'), b=v('read.q2');
    if(record) snapshot('Read First check',{q1:a,q2:b});
    const items=[];
    items.push(a==='assignment'?'✓ Assignment stores or replaces a value.':'• Revisit assignment: ← stores a value in a variable.');
    items.push(b==='trace'?'✓ A dry run and trace table predict variable states.':'• Revisit dry runs: they let you predict values without running code.');
    const ok=a==='assignment'&&b==='trace';
    state.checks.read={ok,at:new Date().toISOString()};persist();
    setResult('readResult',`<strong>${ok?'Ready to continue.':'Check the two ideas again.'}</strong><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul>`,ok?'':'retry');
  }

  function normNum(value) {
    const n=Number(String(value).trim());
    return Number.isFinite(n)?n:null;
  }

  function checkDoNow(record=true) {
    const payload={q1:v('do.q1'),q2:v('do.q2'),q3:v('do.q3'),lapsType:v('do.lapsType'),rateType:v('do.rateType')};
    if(record) snapshot('Do Now check',payload);
    const q1=normNum(payload.q1)===10;
    const q2=payload.q2==='3';
    const q3=/total/i.test(payload.q3)&&/(assign|value|exist|calcul|before|store)/i.test(payload.q3);
    const q4=payload.lapsType==='int'&&payload.rateType==='float';
    const total=[q1,q2,q3,q4].filter(Boolean).length;
    state.checks.doNow={total,at:new Date().toISOString()};persist();
    setResult('doNowResult',`<strong>${total}/4 checks currently match the intended reasoning.</strong><ul><li>${q1?'✓':'○'} Final numeric value: 10.0.</li><li>${q2?'✓':'○'} The calculation is line 3.</li><li>${q3?'✓':'○'} Your explanation should say that total must already have a calculated value before print uses it.</li><li>${q4?'✓':'○'} laps: int(); rate: float().</li></ul><p class="hint">The written explanation is checked only for key ideas, not grammar or exact wording.</p>`,total===4?'':'retry');
  }

  function flowValidity(order=state.flowOrder) {
    const pos=id=>order.indexOf(id);
    const messages=[];
    if(pos('start')!==0)messages.push('START needs to be first.');
    if(pos('end')!==order.length-1)messages.push('END needs to be last.');
    if(pos('calcBase')<pos('inputLaps')||pos('calcBase')<pos('inputRate'))messages.push('The multiplication must come after both laps and rate have been received.');
    if(pos('addBonus')<pos('calcBase'))messages.push('The RM5 reassignment must come after the sponsorship total is calculated.');
    if(pos('output')<pos('addBonus'))messages.push('The final output must come after the RM5 has been added.');
    if(pos('output')<pos('inputName'))messages.push('The participant name must be available before the personalised output.');
    return {valid:messages.length===0,messages};
  }

  function renderFlowBuilderOnly() {
    const mount=$('flowBuilder');
    if(!mount)return;
    mount.outerHTML=flowBuilderHTML();
  }

  function checkFlow(record=true) {
    if(record) snapshot('Flowchart first check',{order:[...state.flowOrder]});
    const result=flowValidity();state.checks.flow={valid:result.valid,at:new Date().toISOString()};persist();
    setResult('flowResult',result.valid?'<strong>Valid sequence.</strong><p>The three inputs can be arranged differently, provided every needed value exists before it is used.</p>':`<strong>One or more dependencies need attention.</strong><ul>${result.messages.map(m=>`<li>${esc(m)}</li>`).join('')}</ul>` ,result.valid?'':'retry');
  }

  function checkPseudo(record=true) {
    const text=v('main1.pseudo');
    if(record) snapshot('Pseudocode self-check',{text});
    const lower=text.toLowerCase();
    const checks=[
      [(text.match(/userinput/gi)||[]).length>=3,'three USERINPUT assignments'],
      [/\*/.test(text)&&/total/i.test(text)&&/laps/i.test(text)&&/rate/i.test(text),'a multiplication stored in total'],
      [/total/i.test(text)&&/\+\s*5|5\s*\+/.test(text),'a reassignment that adds 5'],
      [/output/i.test(text)&&/name/i.test(text)&&/total/i.test(text),'an output containing name and final total']
    ];
    const passed=checks.filter(c=>c[0]).length;state.checks.pseudo={passed,at:new Date().toISOString()};persist();
    setResult('pseudoResult',`<strong>${passed}/4 guide checks found.</strong><ul>${checks.map(([ok,label])=>`<li>${ok?'✓':'○'} ${esc(label)}</li>`).join('')}</ul><p class="hint">This is a self-check, not an exam mark. OxfordAQA allows student-written pseudocode in any form when the meaning is clear and unambiguous.</p>`,passed===4?'':'retry');
  }

  function checkHinge(record=true) {
    const answer=v('main1.hinge');if(record)snapshot('Hinge check',{answer});
    const ok=answer==='process';state.checks.hinge={ok,at:new Date().toISOString()};persist();
    setResult('hingeResult',ok?'<strong>Correct.</strong><p>It is processing because the instruction calculates a new value and assigns it to total.</p>':'<strong>Revisit processing.</strong><p>The instruction does not display a value. It calculates and assigns one.</p>',ok?'':'retry');
  }

  function traceKeyChecks() {
    const out=v('trace.r6.output').toLowerCase();
    return [
      ['trace.r1.name',v('trace.r1.name').trim().toLowerCase()==='mei','Line 1 name = Mei'],
      ['trace.r2.laps',normNum(v('trace.r2.laps'))===12,'Line 2 laps = 12'],
      ['trace.r3.rate',normNum(v('trace.r3.rate'))===1.25,'Line 3 rate = 1.25'],
      ['trace.r4.total',normNum(v('trace.r4.total'))===15,'Line 4 total = 15.0'],
      ['trace.r5.total',normNum(v('trace.r5.total'))===20,'Line 5 total = 20.0'],
      ['trace.r6.output',/mei/.test(out)&&/(^|\D)20(?:\.0+)?(\D|$)/.test(out),'Line 6 output identifies Mei and 20']
    ];
  }

  function markTraceCells(checks) {
    document.querySelectorAll('.trace-table input').forEach(el=>el.classList.remove('key-correct','key-wrong'));
    checks.forEach(([key,ok])=>{const el=[...document.querySelectorAll('[data-field]')].find(node=>node.dataset.field===key);if(el)el.classList.add(ok?'key-correct':'key-wrong');});
  }

  function checkTrace(record=true) {
    const payload={};document.querySelectorAll('[data-field^="trace.r"]').forEach(el=>payload[el.dataset.field]=el.value);
    if(record)snapshot('Trace checkpoint first check',payload);
    const checks=traceKeyChecks();const passed=checks.filter(c=>c[1]).length;markTraceCells(checks);
    state.checks.trace={passed,at:new Date().toISOString()};persist();
    setResult('traceResult',`<strong>${passed}/6 key trace cells match.</strong><ul>${checks.map(([,ok,label])=>`<li>${ok?'✓':'○'} ${esc(label)}</li>`).join('')}</ul><p class="hint">Only the key state changes and final output are checked. Repeated values and blank unchanged cells are not penalised here.</p>`,passed===6?'':'retry');
  }

  function checkPythonTests(record=true) {
    const a=v('main2.test1').toLowerCase(), b=v('main2.test2').toLowerCase();
    if(record)snapshot('Python test record check',{test1:v('main2.test1'),test2:v('main2.test2')});
    const c1=/mei/.test(a)&&/(^|\D)20(?:\.0+)?(\D|$)/.test(a);
    const c2=/daniel/.test(b)&&/(^|\D)5(?:\.0+)?(\D|$)/.test(b);
    state.checks.pythonTests={passed:[c1,c2].filter(Boolean).length,at:new Date().toISOString()};persist();
    setResult('pythonTestResult',`<strong>${[c1,c2].filter(Boolean).length}/2 recorded outputs contain the expected name and total.</strong><ul><li>${c1?'✓':'○'} Mei: final total 20.</li><li>${c2?'✓':'○'} Daniel: final total 5 even when laps = 0.</li></ul><p class="hint">This checks the text you recorded, not whether Python was actually executed. Keep your IDE screenshot as practical evidence.</p>`,c1&&c2?'':'retry');
  }

  function checkExtension(record=true) {
    const q1=v('ext.q1'),q2=v('ext.q2'),q3=v('ext.q3');if(record)snapshot('Extension check',{q1,q2,q3});
    const nums=(q1.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    const c1=nums.length>=4&&[10,60,109,110].every((n,i)=>nums[i]===n);
    const c2=/(no|not|nothing)/i.test(q2)&&/output/i.test(q2);
    const c3=/number/i.test(q3)&&/100/.test(q3)&&(/←|=/.test(q3));
    state.checks.extension={passed:[c1,c2,c3].filter(Boolean).length,at:new Date().toISOString()};persist();
    setResult('extensionResult',`<strong>${[c1,c2,c3].filter(Boolean).length}/3 checks currently match.</strong><ul><li>${c1?'✓':'○'} Values: 10, 60, 109, 110.</li><li>${c2?'✓':'○'} No display occurs because there is no OUTPUT instruction.</li><li>${c3?'✓':'○'} One equivalent reassignment changes Number by 100.</li></ul>`,c1&&c2&&c3?'':'retry');
  }

  function checkPlenary(record=true) {
    const text=v('plenary.q1');if(record)snapshot('Plenary check',{text});
    const store=/(store|assign|variable|memory|hold)/i.test(text), display=/(display|output|show|print)/i.test(text);
    state.checks.plenary={ok:store&&display,at:new Date().toISOString()};persist();
    setResult('plenaryResult',store&&display?'<strong>Your explanation includes both ideas.</strong><p>A calculation can create and store a value; output displays information.</p>':'<strong>Add both parts of the distinction.</strong><p>Explain what happens to the calculated value, then explain what an output instruction does.</p>',store&&display?'':'retry');
  }

  function restoreCheckFeedback() {
    if(state.checks.read)checkRead(false);
    if(state.checks.doNow)checkDoNow(false);
    if(state.checks.flow)checkFlow(false);
    if(state.checks.pseudo)checkPseudo(false);
    if(state.checks.hinge)checkHinge(false);
    if(state.checks.trace)checkTrace(false);
    if(state.checks.pythonTests)checkPythonTests(false);
    if(state.checks.extension)checkExtension(false);
    if(state.checks.plenary)checkPlenary(false);
  }

  function moveFlow(id,dir) {
    const i=state.flowOrder.indexOf(id);if(i<0)return;
    const j=dir==='up'?i-1:i+1;if(j<0||j>=state.flowOrder.length)return;
    [state.flowOrder[i],state.flowOrder[j]]=[state.flowOrder[j],state.flowOrder[i]];persist();
    const old=$('flowBuilder');if(old)old.outerHTML=flowBuilderHTML();
    if(state.checks.flow)setResult('flowResult','<strong>Sequence changed.</strong><p>Select Check dependencies again.</p>','retry');
  }

  function updateTraceModel() {
    const mount=$('traceModelMount');if(mount)mount.innerHTML=traceModelHTML();
  }

  async function copyCode(id) {
    const el=$(id);if(!el)return;
    const text=el.textContent;
    try {await navigator.clipboard.writeText(text);toast('Copied.');}
    catch {
      const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Copied.');}catch{toast('Copy is unavailable. Select the code manually.');}ta.remove();
    }
  }

  function openDB() {
    return new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)){resolve(null);return;}
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(DB_STORE))d.createObjectStore(DB_STORE,{keyPath:'id'});};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
  }

  function dbPut(record) {
    if(!db)return Promise.resolve();
    return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(record);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
  }
  function dbGet(id) {
    if(!db)return Promise.resolve(null);
    return new Promise((resolve,reject)=>{const req=db.transaction(DB_STORE).objectStore(DB_STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});
  }
  function dbDelete(id) {
    if(!db)return Promise.resolve();
    return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
  }
  function readFile(file) {return new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(fr.error);fr.readAsDataURL(file);});}

  async function addEvidence(files) {
    for(const file of files) {
      if(state.evidence.length>=3){toast('Three screenshot slots are already used. Remove one before adding another.');break;}
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)){toast('Use PNG, JPEG or WebP images.');continue;}
      if(file.size>8*1024*1024){toast('This screenshot is over 8 MB. Crop it to the relevant code and output first.');continue;}
      try {
        const dataUrl=await readFile(file);const img=new Image();img.src=dataUrl;await img.decode();
        const id=crypto.randomUUID();const record={id,dataUrl,name:file.name||'Pasted screenshot',width:img.naturalWidth,height:img.naturalHeight};
        evidenceCache.set(id,record);state.evidence.push({id,name:record.name,width:record.width,height:record.height});persist();
        try{await dbPut(record);}catch{showStorageWarning('The screenshot is available in this tab but could not be stored for the next visit. Export before closing the tab.');}
      } catch {toast('That screenshot could not be read. Try saving it as PNG and adding it again.');}
    }
    renderEvidence();
  }

  function showStorageWarning(text) {$('storageWarning').hidden=false;$('storageWarning').textContent=text;}

  async function restoreEvidence() {
    for(const item of state.evidence) {
      if(evidenceCache.has(item.id))continue;
      try{const record=await dbGet(item.id);if(record)evidenceCache.set(item.id,record);}catch{}
    }
    renderEvidence();
  }

  function renderEvidence() {
    const list=$('evidenceList');if(!list)return;
    list.innerHTML=state.evidence.map(item=>{const record=evidenceCache.get(item.id);return `<div class="evidence-item">${record?.dataUrl?`<img src="${record.dataUrl}" alt="IDE evidence screenshot">`:'<div class="warning small">Image will load if it is still stored on this device.</div>'}<p>${esc(item.name)}</p><button type="button" data-remove-evidence="${esc(item.id)}">Remove</button></div>`;}).join('');
  }

  async function removeEvidence(id) {
    state.evidence=state.evidence.filter(x=>x.id!==id);evidenceCache.delete(id);persist();try{await dbDelete(id);}catch{}renderEvidence();
  }

  function evidenceZoneBind() {
    const zone=$('evidenceZone'),input=$('evidenceInput');if(!zone||!input)return;
    input.addEventListener('change',()=>{const files=[...input.files];imageQueue=imageQueue.then(()=>addEvidence(files));input.value='';});
    ['dragenter','dragover'].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.add('dragover');}));
    ['dragleave','drop'].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.remove('dragover');}));
    zone.addEventListener('drop',e=>{const files=[...e.dataTransfer.files];imageQueue=imageQueue.then(()=>addEvidence(files));});
    zone.addEventListener('paste',e=>{const files=[...(e.clipboardData?.items||[])].filter(i=>i.kind==='file'&&i.type.startsWith('image/')).map(i=>i.getAsFile());if(files.length){e.preventDefault();imageQueue=imageQueue.then(()=>addEvidence(files));}});
  }

  function readableStart(value) {return Object.fromEntries(startChoices)[value]||'Not answered';}
  function readablePhase(value) {return Object.fromEntries(phaseChoices)[value]||'Not answered';}
  function filename() {return `9210_T1W3_Combined_${state.student.name}_${state.student.className}`.replace(/[^\p{L}\p{N}_-]/gu,'_')+'.pdf';}
  function reportEntry(title,value,code=false) {return `<div class="report-entry"><h3>${esc(title)}</h3>${code?`<pre>${esc(value||'Not answered')}</pre>`:`<p>${esc(value||'Not answered')}</p>`}</div>`;}

  async function buildReport() {
    await imageQueue;
    await restoreEvidence();
    let html=`<h1>Represent, Trace &amp; Implement</h1><p>Year 10 · OxfordAQA International GCSE Computer Science (9210) · Term 1 Week 3 · Combined Sessions 2 and 3</p><p><strong>${esc(state.student.name)} · ${esc(state.student.className)}</strong><br>Prepared: ${esc(new Date().toLocaleString())}${teacher?'<br><strong>TEACHER PREVIEW - NOT STUDENT EVIDENCE</strong>':''}</p><p><strong>WAGBA:</strong> Showing how an algorithm works and turning it into accurate Python.</p>`;
    html+=`<h2>Read First and Do Now</h2>${reportEntry('Read First: assignment check',v('read.q1'))}${reportEntry('Read First: dry-run check',v('read.q2'))}${reportEntry('Do Now: displayed value',v('do.q1'))}${reportEntry('Do Now: calculation line',v('do.q2'))}${reportEntry('Do Now: why output comes later',v('do.q3'))}${reportEntry('Do Now: laps conversion',v('do.lapsType'))}${reportEntry('Do Now: rate conversion',v('do.rateType'))}`;
    html+='<h2>Types of Learning: starting points</h2>'+learningTargets.map(t=>reportEntry(`${t.group}: ${t.title}`,readableStart(v('before.'+t.id)))).join('')+reportEntry('Chosen priority',learningTargets.find(t=>t.id===v('types.priority'))?.title||'Not answered')+reportEntry('Evidence for priority',v('types.evidence'));
    html+='<h2>Main Task 1: represent</h2>'+reportEntry('Flowchart order',state.flowOrder.map((id,i)=>`${i+1}. ${flowSteps[id].label}`).join('\n'))+reportEntry('Flowchart dependency check',flowValidity().valid?'Valid sequence':'Needs correction: '+flowValidity().messages.join(' '))+reportEntry('Student pseudocode',v('main1.pseudo'),true)+reportEntry('Hinge question',v('main1.hinge'));
    html+='<h2>Main Task 2: trace, implement and test</h2>';
    const traceLines=[1,2,3,4,5,6].map(r=>`Line ${r}: name=${v(`trace.r${r}.name`)||'·'} | laps=${v(`trace.r${r}.laps`)||'·'} | rate=${v(`trace.r${r}.rate`)||'·'} | total=${v(`trace.r${r}.total`)||'·'} | output=${v(`trace.r${r}.output`)||'·'}`).join('\n');
    html+=reportEntry('Independent trace checkpoint: Mei, 12, 1.25',traceLines,true)+reportEntry('Trace correction or question',v('trace.correction'))+reportEntry('Final Python code',v('main2.code'),true)+reportEntry('Test 1 actual output: Mei, 12, 1.25',v('main2.test1'))+reportEntry('Test 2 actual output: Daniel, 0, 3.50',v('main2.test2'))+reportEntry('Trace versus Python comparison',v('main2.compare'))+reportEntry('Purpose of algorithm',v('main2.purpose'));
    html+='<h3>IDE screenshot evidence</h3><div class="report-images">';
    if(!state.evidence.length)html+='<p>No screenshot attached.</p>';
    for(const item of state.evidence){const record=evidenceCache.get(item.id);html+=`<figure class="report-image">${record?.dataUrl?`<img src="${record.dataUrl}" alt="IDE evidence">`:'<p>Screenshot unavailable on this device.</p>'}<figcaption>${esc(item.name)}</figcaption></figure>`;}
    html+='</div>';
    html+='<h2>Extension</h2>'+reportEntry('Values after each instruction',v('ext.q1'))+reportEntry('Does it display a result?',v('ext.q2'))+reportEntry('Equivalent assignment',v('ext.q3'),true);
    html+='<h2>Learning Pit Stop</h2>'+learningTargets.map(t=>reportEntry(`${t.group}: ${t.title}`,`Before: ${readableStart(v('before.'+t.id))}\nNow: ${readablePhase(v('after.'+t.id))}`)).join('')+reportEntry('Chosen next priority',learningTargets.find(t=>t.id===v('pit.priority'))?.title||'Not answered')+reportEntry('Evidence for current stage',v('pit.evidence'));
    html+='<h2>Plenary</h2>'+reportEntry('Why calculation is not the same as output',v('plenary.q1'));
    html+='<h2>Progress and first attempts</h2>'+reportEntry('Stages reviewed',stages.map(s=>`${s.label}: ${state.reviewed[s.id]?'reviewed':'not confirmed'}`).join('\n'));
    if(Object.keys(state.firstAttempts).length){html+='<p>The snapshots below preserve what was present at the first check. Later corrections remain in the current responses above.</p>';for(const [name,obj] of Object.entries(state.firstAttempts)){html+=reportEntry(`${name} · ${new Date(obj.at).toLocaleString()}`,JSON.stringify(obj.data,null,2),true);}}
    html+='<h2>Source focus</h2><p>OxfordAQA International GCSE Computer Science (9210): 3.1.1 Representing algorithms; 3.2.2 Programming concepts; 3.2.7 Input/output; 3.2.8 string-to-number conversion. Student Book focus: flowcharts and pseudocode on printed pp.10-13, conversion recap on pp.18-19, and trace tables on printed pp.104-105.</p><p>This report records student responses and self-reports. Automatic checks are guidance only and do not replace teacher assessment.</p>';
    $('reportPrint').innerHTML=html;$('reportFilename').textContent=filename();
  }

  async function openReport() {
    await buildReport();$('reportOverlay').hidden=false;document.body.style.overflow='hidden';$('reportPrint').scrollIntoView({block:'start'});
  }
  function closeReport() {$('reportOverlay').hidden=true;document.body.style.overflow='';}
  async function printReport() {
    await buildReport();
    const reportImages=[...$('reportPrint').querySelectorAll('img')];
    await Promise.all(reportImages.map(img=>img.decode().catch(()=>{})));
    const old=document.title;document.title=filename().replace(/\.pdf$/,'');
    const restore=()=>{document.title=old;window.removeEventListener('afterprint',restore);};window.addEventListener('afterprint',restore);window.print();setTimeout(restore,1600);
  }

  function handleInput(el) {
    const key=el.dataset.field;if(!key)return;
    let value=el.type==='checkbox'?el.checked:el.value;
    state.fields[key]=value;persist();
    if(key.startsWith('before.')||key.startsWith('after.'))renderReflections();
    if(key.startsWith('trace.r')&&state.checks.trace)setResult('traceResult','<strong>Trace changed.</strong><p>Select Check key trace cells again.</p>','retry');
  }

  function bindGlobal() {
    $('entryForm').addEventListener('submit', async e=>{
      e.preventDefault();
      const name=$('studentName').value.trim(), className=$('studentClass').value.trim();
      const isTeacher=name.toLowerCase()==='teacher';
      if(!name||(!isTeacher&&!className)){$('entryMessage').textContent='Enter your name and class to continue. Teacher preview only needs the name teacher.';return;}
      teacher=isTeacher;activeKey=teacher?TEACHER_KEY:KEY;
      const saved=readStore(activeKey);
      if(saved&&!teacher&&(saved.student?.name?.toLowerCase()!==name.toLowerCase()||saved.student?.className?.toLowerCase()!==className.toLowerCase())){
        if(!confirm('This browser contains work for a different student. Continue to archive it locally and start a new record?'))return;
        try{localStorage.setItem(KEY+'-archive-'+Date.now(),JSON.stringify(saved));}catch{}
        state=defaultState(name,className);
      } else state=saved||defaultState(name,isTeacher?'Teacher preview':className);
      state.student={name,className:isTeacher?'Teacher preview':className};
      if(!Array.isArray(state.flowOrder)||state.flowOrder.length!==8)state.flowOrder=[...defaultFlowOrder];
      $('identity').textContent=`${state.student.name} · ${state.student.className}`;$('teacherNotice').hidden=!teacher;
      $('landing').hidden=true;$('app').hidden=false;$('entryMessage').textContent='';
      try{db=await openDB();}catch{db=null;showStorageWarning('Screenshot storage is unavailable. Text responses can still be saved; export screenshots before closing the tab.');}
      renderLesson();evidenceZoneBind();await restoreEvidence();go(state.current||'read');persist();
    });

    $('menuButton').addEventListener('click',()=>{const nav=$('route');nav.hidden=!nav.hidden;$('menuButton').setAttribute('aria-expanded',String(!nav.hidden));});
    $('exportTop').addEventListener('click',()=>void openReport());
    $('closeReport').addEventListener('click',closeReport);
    $('printReportButton').addEventListener('click',()=>void printReport());
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('reportOverlay').hidden)closeReport();else{$('route').hidden=true;$('menuButton').setAttribute('aria-expanded','false');}}});

    document.addEventListener('input',e=>handleInput(e.target));
    document.addEventListener('change',e=>{
      const el=e.target;
      if(el.dataset.field)handleInput(el);
      if(el.dataset.reviewed){state.reviewed[el.dataset.reviewed]=el.checked;persist();renderRoute();}
    });

    document.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b||!state)return;
      if(b.dataset.go){go(b.dataset.go);return;}
      if(b.dataset.copy){void copyCode(b.dataset.copy);return;}
      if(b.dataset.flow){moveFlow(b.dataset.id,b.dataset.flow);return;}
      if(b.dataset.removeEvidence){void removeEvidence(b.dataset.removeEvidence);return;}
      if(b.dataset.check){
        const c=b.dataset.check;
        if(c==='read')checkRead();if(c==='doNow')checkDoNow();if(c==='flow')checkFlow();if(c==='pseudo')checkPseudo();if(c==='hinge')checkHinge();if(c==='trace')checkTrace();if(c==='pythonTests')checkPythonTests();if(c==='extension')checkExtension();if(c==='plenary')checkPlenary();return;
      }
      switch(b.id){
        case 'routeExport':void openReport();break;
        case 'changeIdentity':$('app').hidden=true;$('landing').hidden=false;$('studentName').focus();break;
        case 'showCommonPseudo':$('commonPseudoPanel').hidden=false;toast('Common reference algorithm shown. Keep your own first attempt above.');break;
        case 'traceBack':traceModelIndex=Math.max(0,traceModelIndex-1);updateTraceModel();break;
        case 'traceNext':traceModelIndex=Math.min(5,traceModelIndex+1);updateTraceModel();break;
        case 'traceReset':traceModelIndex=0;updateTraceModel();break;
        case 'openReportCard':case 'openReportFinal':void openReport();break;
      }
    });

    const prior=readStore(KEY);if(prior?.student){$('studentName').value=prior.student.name||'';$('studentClass').value=prior.student.className||'';}
  }

  bindGlobal();
})();
