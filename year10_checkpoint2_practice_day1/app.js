"use strict";

const { title, wagba, ksu, keywords, challenge, extracts, prompts, demos } = window.LESSON;
const esc = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const code = text => '<code>' + esc(text) + '</code>';
const codeBlock = text => {
  const tokens = text.split(/("(?:[^"\\]|\\.)*"|\b(?:elif|if|for|in|and)\b)/);
  return '<pre tabindex="0" aria-label="Python code"><code>' + tokens.map((t, i) => i % 2
    ? '<span class="' + (t.startsWith('"') ? 'code-string' : 'code-key') + '">' + esc(t) + '</span>'
    : esc(t)).join('') + '</code></pre>';
};
const section = (heading, content, klass = '') => '<section class="' + klass + '"><h2>' + esc(heading) + '</h2>' + content + '</section>';
const p = text => '<p>' + text + '</p>';
const numbered = (...steps) => '<ol>' + steps.map(step => '<li>' + step + '</li>').join('') + '</ol>';
const start = html => section('Start here', html, 'action');
const done = text => section('Done when', p(text), 'done');
const pause = text => section('Pause before you run', p(text), 'pause');
const ead = (key, support = true) => {
  const [label, question, hint, stem] = prompts[key];
  return section('Write in your EAD', '<h3>' + esc(label) + '</h3>' + p(esc(question)) +
    (support && hint ? p('<strong>If you’re stuck:</strong> ' + esc(hint)) : '') +
    (support && stem ? p('<strong>Start with:</strong> ' + esc(stem)) : ''));
};
const demo = (id) => {
  const item = demos[id];
  return '<section class="demo" data-demo="' + id + '"><span class="demo-tag">Worked example · on this page</span><h2>' +
    esc(item.title) + '</h2>' + codeBlock(item.source) +
    '<button type="button" data-run>Run worked example</button>' +
    '<p class="demo-status" role="status"></p><div class="demo-results" hidden><h3>Example output</h3>' +
    '<pre tabindex="0" aria-label="Example output"><samp></samp></pre>' + p(esc(item.note)) +
    '<p class="hint">Use your own IDLE run for the EAD task.</p></div></section>';
};
const steps = [
  {
    id: 'do-now', stage: 'Do Now', heading: title,
    intro: 'Open the files you’ll use today. Keep this guide open, and write every response in the same Word document.',
    body: () => start(numbered(
      'Download the <strong>Practice EAD</strong>. Open it in Word and save a named copy.',
      'Download the <strong>Python skeleton</strong>. In the IDLE Editor, use <strong>File → Open</strong> to open the file.',
      'Find the starting list, then answer <strong>Do Now</strong> in your saved EAD.'
    ) + '<div class="downloads">' +
      '<a class="button" href="resources/Day_1_Practice_EAD.docx" download>Download Practice EAD</a>' +
      '<a class="button secondary" href="resources/Book_Donation_Tracker.py" download>Download Python skeleton</a></div>' +
      p('<a href="resources/Preliminary_Material.pdf" download>Download Preliminary Material (PDF)</a>')) +
    section('Which window do I use?', '<div class="tool-list"><p><strong>Editor:</strong> read or change the Python file.</p><p><strong>Shell:</strong> enter choices and read what Python prints.</p><p><strong>Word EAD:</strong> type answers and paste evidence.</p></div>') +
    section('WAGBA · What are we getting better at?', p(esc(wagba)) +
      '<dl>' + ksu.map(([k, v]) => '<dt>' + k + '</dt><dd>' + esc(v) + '</dd>').join('') + '</dl>' +
      '<div class="reference">' + p('<strong>Topic:</strong> Reading a skeleton program') +
      p('<strong>Keywords:</strong> ' + esc(keywords) + '.') + p('<strong>Challenge:</strong> ' + esc(challenge)) + '</div>') +
    section('Code to read', codeBlock(extracts.list)) + ead('now') +
    done('Your named EAD is open, and you’ve recorded an index and a value.')
  },
  {
    id: 'types-of-learning', stage: 'Types of Learning', heading: 'Choose one focus',
    intro: 'Look at what you did in the Do Now. Pick one thing you’d like to get better at today.',
    body: () => start(p('Go to <strong>Types of Learning</strong> in Word. Choose one focus and use your Do Now to explain why.')) +
      section('What will you work on?', '<dl>' + ksu.map(([k, v]) => '<dt>' + k + '</dt><dd>' + esc(v) + '</dd>').join('') + '</dl>') +
      ead('types', false) + p('<strong>Start with:</strong> ' + esc(prompts.types[3])) +
      done('You’ve chosen one focus and given one reason.')
  },
  {
    id: 'predict', stage: 'Main Task 1', tag: 'Predict', heading: 'Predict one output line',
    intro: 'Work with the original skeleton. Read the extract first; leave the code unchanged.',
    body: () => start(p('Find option ' + code('3') + ' in the extract below. Read its indented ' + code('print') + ' line.')) +
      section('Code to read', codeBlock(extracts.list + '\n\n' + extracts.predict)) +
      pause('Write your prediction in 01.1 before you run the skeleton. It is fine to change your mind after checking.') +
      ead('prediction') + done('You’ve typed one predicted output line in 01.1.')
  },
  {
    id: 'run', stage: 'Main Task 1', tag: 'Run', heading: 'Check your prediction in IDLE',
    intro: 'Keep your first prediction visible in Word. This is your chance to compare it with a real run.',
    body: () => start(p('Open your original skeleton in the <strong>IDLE Editor</strong>. The worked example below is optional.')) +
      demo('display') +
      section('Your turn in IDLE', numbered('In the Editor, choose <strong>Run → Run Module</strong>.', 'In the Shell, type ' + code('3') + ' and press Enter. Read the output line.', 'Type ' + code('0') + ' to exit.')) +
      ead('check') + done('01.2 has your actual output and a short explanation. You don’t need a screenshot yet.')
  },
  {
    id: 'investigate-model', stage: 'Main Task 2', tag: 'Investigate · Example', heading: 'Follow one list update',
    intro: 'An index tells you which position to look at. The value is what that position stores.',
    body: () => start(p('Read the square brackets in the example. Before you run it, point to the position that will change.')) +
      demo('update') + done('You can point to the index in the assignment. There is nothing to record on this step.')
  },
  {
    id: 'investigate', stage: 'Main Task 2', tag: 'Investigate · Your turn', heading: 'Trace the change in donations',
    intro: 'Start a fresh run of the original skeleton so it uses the starting list again.',
    body: () => start(p('Look at the option ' + code('2') + ' extract. The first row in <strong>02.1 Trace</strong> shows what happened to index ' + code('0') + '.')) +
      section('Code to read', codeBlock(extracts.list + '\n\n' + extracts.investigate)) +
      pause('Predict what the second trace row will show before you enter the choices in the Shell.') +
      ead('trace') +
      section('Your turn in IDLE', numbered('Run the original module.', 'In the Shell, choose ' + code('2') + ', enter ' + code('7') + ', then choose ' + code('1') + '.', 'Check your trace against the output, then enter ' + code('0') + ' to exit.')) +
      ead('explain') + done('You’ve checked the trace and used the assignment line to explain why one value stayed the same.')
  },
  {
    id: 'modify', stage: 'Main Task 2', tag: 'Modify', heading: 'Change one output label',
    intro: 'Keep the original skeleton unchanged. Work in a separate copy.',
    body: () => start(numbered(
      'In the IDLE Editor, choose <strong>File → Save As</strong>. Save as <strong>Tracker_Practice_Day1.py</strong>.',
      'Find option ' + code('1') + '. Change only ' + code('"Books:"') + ' to ' + code('"Donated:"') + '.',
      'Save your edited copy.'
    )) +
    section('Code to read', codeBlock(extracts.display)) +
    pause('Before you run, write what you expect to change and what should stay the same in My prediction, just above 03.1 in your EAD.') +
    p('<strong>If you’re stuck:</strong> Find the word inside quotation marks in the ' + code('print') + ' line. Leave the commas, brackets and list expression alone.') +
    done('You’ve saved the edit in Tracker_Practice_Day1.py and kept the original unchanged.')
  },
  {
    id: 'evidence', stage: 'Main Task 2', tag: 'Modify · Evidence', heading: 'Collect your Paper 1 evidence',
    intro: 'Copy source code from the Editor. Capture the result from the Shell. Each goes under its own number in Word.',
    body: () => start(p('Keep your edited IDLE file and your named EAD open.')) +
      ead('source') + section('Your turn in IDLE', numbered(
        'Run <strong>Tracker_Practice_Day1.py</strong> from the Editor.',
        'In the Shell, type ' + code('1') + ' and press Enter.',
        'Use your screen-capture tool to crop the choice and output together. In Word, replace the placeholder under <strong>03.2 Screen capture</strong> with the image. Back in the Shell, type ' + code('0') + ' to exit.'
      )) +
      ead('capture') + ead('modifyReflection') +
      done('Word has your amended branch as text, one readable Shell capture and a short explanation. Save the EAD.')
  },
  {
    id: 'extension', stage: 'Extension', tag: 'Make · Optional', heading: 'Make a small shelf tracker',
    intro: 'Try this if you can explain your edit. If you need longer on Main Task 2, leave this page and come back if there’s time.',
    body: () => start(p('In the IDLE Editor, create a <strong>new file</strong>. Start with the list below.')) +
      section('Code to start with', codeBlock(extracts.stretch)) + ead('extension') +
      done('You’ve checked your own program with two list lengths, or chosen to skip this optional step.') +
      p('<a href="#learning-pit-stop">Skip to Learning Pit Stop</a>')
  },
  {
    id: 'learning-pit-stop', stage: 'Learning Pit Stop', heading: 'Where are you with your focus?',
    intro: 'Think about the task you chose to get better at. Use your work, not how quickly you finished.',
    body: () => start(p('Find one answer in your EAD that shows how you’re doing. Then turn to <strong>Learning Pit Stop</strong>.')) +
      section('Choose the phase that fits this task', '<dl><dt>New Learning</dt><dd>I’m working out a new idea.</dd><dt>Consolidating</dt><dd>I’m getting steadier with it.</dd><dt>Treading Water</dt><dd>I can do this comfortably and need a stretch.</dd><dt>Drowning</dt><dd>I’m stuck and need support.</dd></dl>') +
      ead('pit', false) + p('<strong>Start with:</strong> ' + esc(prompts.pit[3])) +
      done('You’ve named a phase, pointed to one answer and chosen one next step.')
  },
  {
    id: 'plenary', stage: 'Plenary', heading: 'Try one on your own',
    intro: 'Use this fresh example to check what you can explain without a model.',
    body: () => start(p('Look at the list below and answer the question in <strong>Plenary</strong> in Word.')) +
      section('Code to read', codeBlock(extracts.exit)) + ead('plenary') +
      section('Before you close', numbered('Save the same named EAD you’ve used today.', 'Check that your code is indented and your Shell capture is readable.')) +
      done('You’ve saved your EAD and can find your final explanation in it.')
  }
];

const nav = document.getElementById('stages');
const lesson = document.getElementById('lesson');
const pager = document.getElementById('pager');
const stages = steps.filter((s, i) => !i || s.stage !== steps[i - 1].stage);
function route(focus) {
  const id = location.hash.slice(1);
  const found = steps.findIndex(step => step.id === id);
  const index = found < 0 ? 0 : found;
  const step = steps[index];
  nav.innerHTML = stages.map(s => '<a href="#' + s.id + '"' + (s.stage === step.stage ? ' aria-current="step"' : '') + '>' + esc(s.stage) + '</a>').join('');
  lesson.innerHTML = '<div class="step-progress"><span>Step ' + (index + 1) + ' of ' + steps.length +
    '</span><progress aria-label="Lesson progress" value="' + (index + 1) + '" max="' + steps.length + '"></progress></div>' +
    '<p class="eyebrow">' + esc(step.stage + (step.tag ? ' · ' + step.tag : '')) + '</p>' +
    '<h1>' + esc(step.heading) + '</h1><p class="lede">' + esc(step.intro) + '</p>' +
    '<div class="flow">' + step.body() + '</div>';
  const prev = steps[index - 1];
  const next = steps[index + 1];
  pager.innerHTML = (prev ? '<a class="button secondary" href="#' + prev.id + '">Back</a>' : '') +
    (next ? '<a class="button next" href="#' + next.id + '">Next · ' + esc(next.tag || next.stage) + '</a>' : '<a class="button secondary next" href="#do-now">Return to Do Now</a>');
  document.title = step.heading + ' · Year 10 Practice';
  if (focus) {
    window.scrollTo(0, 0);
    lesson.focus({preventScroll: true});
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = resolve;
    el.onerror = () => { el.remove(); reject(new Error('Python example could not load.')); };
    document.head.appendChild(el);
  });
}
let runtime;
function readyPython() {
  if (!runtime) runtime = (async () => {
    if (!window.Sk) await loadScript('vendor/skulpt.min.js');
    if (!window.Sk.builtinFiles) await loadScript('vendor/skulpt-stdlib.js');
    return window.Sk;
  })().catch(error => { runtime = undefined; throw error; });
  return runtime;
}
let busy = false;
lesson.addEventListener('click', async event => {
  const button = event.target.closest('button[data-run]');
  if (!button || busy) return;
  const panel = button.closest('[data-demo]');
  const status = panel.querySelector('.demo-status');
  const results = panel.querySelector('.demo-results');
  const id = panel.dataset.demo;
  if (!Object.hasOwn(demos, id)) return;
  button.disabled = true;
  results.hidden = true;
  status.textContent = 'Running the example…';
  busy = true;
  try {
    const py = await readyPython();
    let output = '';
    py.configure({
      __future__: py.python3,
      execLimit: 2000,
      output: part => { output += part; },
      read: name => {
        if (Object.hasOwn(py.builtinFiles.files, name)) return py.builtinFiles.files[name];
        throw new Error('This example cannot open other files.');
      }
    });
    await py.misceval.asyncToPromise(() => py.importMainWithBody('<example>', false, demos[id].source, true));
    results.querySelector('samp').textContent = output;
    results.hidden = false;
    status.textContent = 'Example output is shown below.';
    button.textContent = 'Run worked example again';
  } catch {
    status.textContent = 'The example couldn’t run. You can try again or continue in IDLE.';
  } finally {
    busy = false;
    button.disabled = false;
  }
});
document.querySelector('.skip').addEventListener('click', event => { event.preventDefault(); lesson.focus(); });
window.addEventListener('hashchange', () => route(true));
route(false);
