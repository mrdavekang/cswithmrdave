window.FitnessRehearsal = (() => {
  'use strict';
  const L = LESSON, E = FitnessUI.esc;
  const title = 'Week 12 Session 2 · Final Paper 1 rehearsal';
  const ead = 'resources/Year11_Week12_Session2_Paper1_Rehearsal_EAD.docx';
  const practice = 'resources/Year11_Week12_Session2_Python_Practice.zip';
  const route = [
    ['s4home', 'Set up and Do Now', '0–5 min'],
    ['s4model', 'Teacher model and types of learning', '5–10 min'],
    ['s4trace', 'Section A · Read and trace', '10–18 min'],
    ['s4modify', 'Section B · Modify a subroutine', '18–32 min'],
    ['s4make', 'Section C · Write a function', '32–47 min'],
    ['s4pit', 'Learning Pitstop', '47–51 min'],
    ['s4finish', 'Check, save and pack up', '51–55 min']
  ].map(([id, label, time]) => ({id, label, time}));
  const brand = {
    topic: 'Final Paper 1 rehearsal: reading, modifying and testing code',
    wagba: 'Read code accurately, make the requested change and prove it works in your EAD.',
    keywords: [['record','记录'], ['attribute','属性'], ['validation','验证'], ['return value','返回值'], ['boundary test','边界测试']],
    challenge: 'Explain which test would expose an early return and why.'
  };
  const labels = {
    s4Focus:'Final rehearsal: type of learning',
    s4Phase:'Final rehearsal: learning phase',
    s4Evidence:'Final rehearsal: evidence from my work',
    s4Next:'Final rehearsal: what I will check in the test'
  };
  const hasStage = id => route.some(stage => stage.id === id);
  const resume = state => hasStage(state.stage) ? state.stage :
    hasStage(state.slides?.s4Resume) ? state.slides.s4Resume : 's4home';
  L.stages.push(...route);
  L.eads.s4finish = {title:'Week 12 Session 2 Paper 1 Rehearsal EAD', file:ead, save:'YourName_Paper1_Rehearsal_EAD.docx'};

  const downloads = () => `<div class="resource-list"><a href="${ead}" download data-ead-download="s4finish"><strong>Download the Word EAD</strong><small>One document for Sections A, B and C</small></a><a href="${practice}" download><strong>Download the Python practice ZIP</strong><small>Two independent practice copies with test runners</small></a></div>`;
  const hint = (label, text) => `<details><summary>${E(label)}</summary><p>${E(text)}</p></details>`;
  const runner = (part, scope) => `<div class="callout"><strong>Run the test, not the fitness menu</strong><p>Save <code>fitness_practice_${part}.py</code>. Then open <code>run_section_${part}.py</code> in IDLE and choose <strong>Run → Run Module</strong> (F5). ${scope}</p></div>`;
  const phases = [
    ['New learning', 'I can now follow a step that was new to me.'],
    ['Consolidating', 'I can explain my result and repeat the steps.'],
    ['Treading water', 'This is too familiar; I need a harder check.'],
    ['Drowning', 'I need help with one particular step.']
  ];
  function page(id, {head, field, done, state}) {
    switch (id) {
      case 's4home':
        return head(title, 'You have 55 minutes. Work in the EAD and your Python IDE; keep this page open for instructions.', '先下载答题文档和练习文件。在 Word 里写答案，在 IDLE 里测试 Python。') + downloads() +
          `<ol class="steps"><li>Save the EAD as <code>YourName_Paper1_Rehearsal_EAD.docx</code>.</li><li>Extract the entire ZIP. Keep <strong>Section B</strong> and <strong>Section C</strong> separate, with the files in each folder kept together.</li><li>In the EAD, answer the Do Now before running anything. Which line creates the activity record, and which fills in its day number?</li></ol><pre class="mini-code">Activity = Exercise()
Activity.DayNo = EnterDayNumber()</pre>` + done('I opened the EAD, extracted the practice ZIP and attempted the Do Now.');
      case 's4model':
        return head('Follow one value into one record', 'Watch one record change before you start your own trace.', '观察一个值怎样填入记录，再开始跟踪排序。') +
          `<div class="reading"><p>Picture the activity as one row in a table. The class defines its fields. Creating the object makes one row with starting values; assigning to one attribute changes only that field.</p><p><strong>Class question:</strong> If two activities swap only their distances, what stays in the wrong place? Use the teacher’s example, not the EAD records.</p></div><section class="definition"><h2>Our definition of learning</h2><blockquote>“${E(L.definition)}”</blockquote></section><p><strong>Knowledge:</strong> name a class, object or attribute. <strong>Skills:</strong> trace the value or follow a loop. <strong>Understanding:</strong> explain why the code behaves as it does.</p><label for="s4Focus">Which will you work on first?</label><select id="s4Focus" data-answer="s4Focus"><option value="">Choose your focus</option>${['Knowledge','Skills','Understanding'].map(focus => `<option${state.answers.s4Focus===focus?' selected':''}>${focus}</option>`).join('')}</select>` + done('I can explain the difference between creating the row and filling in one field.');
      case 's4trace':
        return head('Section A · Read and trace', 'Work in the Word EAD. Leave the skeleton unchanged for this section.', '只读程序，不修改代码。只跟踪排序的第一轮。') +
          `<ol class="steps"><li>Find <code>SortByDistance</code> in <code>fitness_practice_b.py</code>.</li><li>For <strong>A1</strong>, start with the four records in the EAD. Complete one row per comparison for the <strong>first pass only</strong>. Use the new order when you start the next row.</li><li>For <strong>A2</strong>, explain why swapping just the distances would make the records incorrect. Use an example from your trace.</li></ol>` +
          hint('I’m stuck on the first pass', 'A pass is one trip through the inner loop. After each comparison, write the record order even if nothing moved. Stop after three comparisons.') + done('I completed the three trace rows and used an example in A2.');
      case 's4modify':
        return head('Section B · Modify one subroutine', 'Accept only whole-number durations from 1 to 180 minutes inclusive.', '只修改 EnterDuration。每次输入超出范围都要提示并重新输入。') +
          `<ol class="steps"><li>In the <strong>Section B</strong> folder, edit only <code>EnterDuration()</code>. For each out-of-range value, show an error and ask again. Return the valid integer.</li><li>Predict all five outcomes in the EAD before you run. Pay attention to <strong>181, 182, then 180</strong> and <strong>0, then 1</strong>.</li><li>Paste the full amended subroutine and capture both retry tests. Show the rejected entries, error messages and returned values.</li></ol>` + runner('b','The runner supplies the inputs automatically.') +
          hint('I only get one retry', 'Compare a decision that runs once with a loop that repeats a check. Where should the next input be read?') + done('I recorded the actual outcomes and pasted the code and console evidence.');
      case 's4make':
        return head('Section C · Write and test a function', 'Switch to the separate Section C folder, even if Section B is unfinished.', '即使 B 部分尚未完成，也要切换到独立的 C 文件夹。') +
          `<ol class="steps"><li>In <code>fitness_practice_c.py</code>, complete <code>LongestActivityDuration(ActivityLog)</code>. Use a loop to inspect the <code>Duration</code> of each record.</li><li>Return the greatest duration, or <code>0</code> for an empty log. Do not print from the function or change the menu or data file.</li><li>Predict the outcomes in your EAD. Paste the whole function and a console capture with expected and actual results for all three tests.</li></ol>` + runner('c','The runner makes its own records and displays what your function returns.') +
          hint('My function stops after one record', 'Trace the longest value so far after each record. Check whether your return statement lets the loop reach the next item.') + done('I tested the function and added the source code and console evidence.');
      case 's4pit':
        return head('Learning Pitstop', 'Choose a phase and point to one piece of work that shows why.', '选择学习阶段，并用一项实际证据解释。') +
          `<div class="phase-grid">${phases.map(([name, text]) => `<label><input type="radio" name="s4Phase" data-answer="s4Phase" value="${E(name)}"${state.answers.s4Phase===name?' checked':''}><strong>${E(name)}</strong><span>${E(text)}</span></label>`).join('')}</div>` +
          field('s4Evidence','What shows your progress?','Use one trace row, test result or line you corrected.',2) +
          `<p>Use your evidence to fix one thing before you save.</p>` + done('I showed a piece of evidence and acted on it.');
      case 's4finish': {
        const submission = state.submissions.s4finish || {};
        return head('Check, save and pack up', 'Use the last four minutes to check the evidence, not to start a new task.', '检查证据并保存答题文档和两个 Python 文件。') +
          `<ol class="steps"><li>Check A: your trace stops after the first pass.</li><li>Check B and C: the complete functions and readable evidence of actual runs are in the EAD.</li><li>Save the Word EAD and both edited Python files. If your teacher opens a <strong>Week 12 Session 2</strong> assignment, attach all three files and select <strong>Turn in</strong>.</li></ol>` +
          field('s4Next','What will you check before moving on in the test?','Name one specific check you will make.',2) +
          `<details${submission.confirmed?' open':''}><summary>Record a Teams submission if you have turned it in</summary><p>This is only a reminder in your notebook. The app does not submit to Teams.</p><label for="s4-ead-filename">Name of the EAD you submitted</label><input id="s4-ead-filename" data-submission-name="s4finish" maxlength="160" value="${E(submission.filename||'')}"><label class="check-label"><input type="checkbox" data-confirm="s4finish"${submission.confirmed?' checked':''}>I turned in my rehearsal EAD and both Python files in Teams.</label></details>`;
      }
      default: return '';
    }
  }
  return {title, route, brand, labels, hasStage, resume, page};
})();
