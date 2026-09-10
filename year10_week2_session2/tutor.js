/* A prepared trace of the supplied example, not a Python interpreter or grader. */
(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const assignmentSyntax = 'Read the value on the right of =, then assign it to the name on the left. Here = means assignment, not a question asking whether two things are equal.';
  const textSyntax = 'The quotation marks mark the start and end of a string (text). Use a matching pair. The marks are not part of the stored text. The = symbol assigns the value on the right to the identifier on the left.';
  const printSyntax = 'print is the Python function that displays output. Its opening and closing brackets enclose what to display. The quotation marks surround a text label. The comma separates that label from the named value; print adds a space between them. The identifier has no quotation marks, so Python looks up its value.';
  const blank = () => ({code: '', meaning: 'This is a blank line. It separates groups of instructions to make them easier to read. It does not change any value or print anything.', syntax: 'There are no Python instructions on this line. You do not need to type a line number.'});
  const print = (code, name, label, meaning) => ({code, name, label, kind: 'print', meaning, syntax: printSyntax});
  const lines = [
    {code: 'GAME_TITLE = "Code Quest"', kind: 'assign', name: 'GAME_TITLE', value: 'Code Quest', meaning: 'Create the identifier GAME_TITLE and assign the text Code Quest to it. We intend the game title to stay fixed, so its name is uppercase. Uppercase is a convention: Python does not enforce it as a constant.', syntax: textSyntax},
    {code: 'MAX_LIVES = 3', kind: 'assign', name: 'MAX_LIVES', value: 3, meaning: 'Assign the integer 3 to MAX_LIVES. This is the game rule for the maximum number of lives, not the number currently remaining.', syntax: assignmentSyntax + ' No quotation marks are needed around the integer 3.'},
    {code: 'STARTING_SCORE = 0', kind: 'assign', name: 'STARTING_SCORE', value: 0, meaning: 'Assign the integer 0 to STARTING_SCORE. This fixed setting tells us the score at the start of the game.', syntax: assignmentSyntax},
    blank(),
    {code: 'player_name = "Aisha"', kind: 'assign', name: 'player_name', value: 'Aisha', meaning: 'Create the variable player_name and assign the string Aisha to it. It is a player detail, not a fixed game rule. It is still a variable even though this short original program does not change it again.', syntax: textSyntax},
    {code: 'lives_remaining = MAX_LIVES', kind: 'assign', name: 'lives_remaining', from: 'MAX_LIVES', meaning: 'Look up the current value of MAX_LIVES: 3. Assign that integer to lives_remaining. Both identifiers now have the value 3. Assigning a different integer to lives_remaining later will not reassign MAX_LIVES.', syntax: assignmentSyntax + ' MAX_LIVES has no quotation marks: look up its value rather than storing the text MAX_LIVES.'},
    {code: 'current_score = STARTING_SCORE', kind: 'assign', name: 'current_score', from: 'STARTING_SCORE', meaning: 'Look up STARTING_SCORE, which has the value 0. Assign that integer to the variable current_score. We can reassign current_score later while leaving the starting-score setting unchanged.', syntax: assignmentSyntax},
    blank(),
    print('print("Game:", GAME_TITLE)', 'GAME_TITLE', 'Game:', 'Display the label Game: followed by the value of GAME_TITLE. Printing lets us see a value; it does not change that value.'),
    print('print("Player:", player_name)', 'player_name', 'Player:', 'Display the label Player: followed by the text currently stored using player_name: Aisha.'),
    print('print("Maximum lives:", MAX_LIVES)', 'MAX_LIVES', 'Maximum lives:', 'Display the maximum-lives rule. MAX_LIVES is 3, so the printed value is 3.'),
    print('print("Lives remaining:", lives_remaining)', 'lives_remaining', 'Lives remaining:', 'Display the current remaining lives. At this point lives_remaining is still 3. Python has not reached the later reassignment yet.'),
    print('print("Current score:", current_score)', 'current_score', 'Current score:', 'Display the current score. At this point current_score is still 0. Later instructions do not change text that has already been printed.'),
    blank(),
    {code: 'lives_remaining = 2', kind: 'assign', name: 'lives_remaining', value: 2, meaning: 'Reassign lives_remaining: its value changes from 3 to 2. The fixed setting MAX_LIVES stays 3. This line changes a stored value; it does not display the new value yet.', syntax: assignmentSyntax + ' Using the same identifier again changes the value assigned to that name.'},
    {code: 'current_score = 20', kind: 'assign', name: 'current_score', value: 20, meaning: 'Reassign current_score: its value changes from 0 to 20. STARTING_SCORE stays 0. The earlier printed line Current score: 0 remains in the output.', syntax: assignmentSyntax},
    blank(),
    print('print("Updated lives:", lives_remaining)', 'lives_remaining', 'Updated lives:', 'Look up lives_remaining now, after its reassignment. Print Updated lives: 2 on a new output line. The earlier Lives remaining: 3 line is not erased.'),
    print('print("Updated score:", current_score)', 'current_score', 'Updated score:', 'Look up current_score now, after its reassignment. Print Updated score: 20. The program then finishes; the earlier output lines remain visible.')
  ];
  const names = lines.filter(line => line.kind === 'assign').map(line => line.name).filter((name, i, all) => all.indexOf(name) === i);
  const display = value => typeof value === 'string' ? JSON.stringify(value) : String(value);
  const snapshots = [];
  let values = {}, output = [];
  for (const line of lines) {
    const before = {...values};
    let added = '';
    if (line.kind === 'assign') values[line.name] = line.from ? values[line.from] : line.value;
    if (line.kind === 'print') { added = `${line.label} ${values[line.name]}`; output.push(added); }
    snapshots.push({before, values: {...values}, output: [...output], added});
  }
  const expectedOutput = snapshots.at(-1).output.join('\n');
  const steps = [
    {id: 'run-original', title: 'Copy, save and run the original', refs: [1, 2, 3], pointer: 'Find the beginning of the supplied program',
      action: 'Select Copy original Python below. Paste the complete program into a new file in your own IDE. Save it as w2s2_game.py, then use your IDE’s Run command.',
      check: 'Check that you copied the whole program, including the final two print lines. Run it and find the output area in your IDE. If you see an error message, use the help below or ask your teacher. Do not tick this step until it runs.'},
    {id: 'compare-original', title: 'Compare the original output', refs: [9, 10, 11, 12, 13, 18, 19], pointer: 'These seven lines display the output',
      action: 'Read the output in your IDE from top to bottom. Compare it with the seven lines below, then with your answers in Part A.',
      check: 'The starting lives and score are 3 and 0. The updated lives and score are 2 and 20. Record any correction to your prediction in the evidence box below this guide.', expected: expectedOutput},
    {id: 'change-name', title: 'Choose a player name', refs: [5], pointer: 'Edit original line 5 · player_name',
      action: 'Replace Aisha with a name of your choice. You can use a made-up name. Keep a matching pair of quotation marks. Save and run the program again.',
      example: 'player_name = "Maya"', exampleNote: 'Maya is an example, not a required answer. Keep the identifier player_name unchanged.',
      check: 'Find Player: in your actual output. It should show the name you chose. The other output lines should be unchanged.'},
    {id: 'change-lives', title: 'Change the remaining lives', refs: [15], pointer: 'Edit original line 15 · lives_remaining',
      action: 'Change the value 2 to another integer from 0 to 3, for example 1. Change this later assignment, not the starting assignment on line 6. Save and run again.',
      example: 'lives_remaining = 1', exampleNote: 'With this example, the final lives line should say Updated lives: 1. Your chosen value may be different.',
      check: 'Updated lives: should show your new value. Maximum lives: and the earlier Lives remaining: line should both still show 3. Do not edit MAX_LIVES.'},
    {id: 'change-score', title: 'Change the current score', refs: [16], pointer: 'Edit original line 16 · current_score',
      action: 'Replace 20 with a different non-negative integer, such as 35. Leave the starting assignment on line 7 unchanged. Save and run again.',
      example: 'current_score = 35', exampleNote: 'A non-negative integer is a whole number that is zero or greater. With this example, the final score should be 35.',
      check: 'Updated score: should show your chosen value. The earlier Current score: line should still show 0. Keep your changed player name and remaining lives too.'},
    {id: 'keep-settings', title: 'Check that the game settings stayed fixed', refs: [1, 2, 3], pointer: 'Compare original lines 1–3 · the three supplied constants',
      action: 'Compare the first three lines in your IDE with these supplied lines. Keep the same names and values. Restore them if you changed them by mistake.',
      check: 'GAME_TITLE should still be "Code Quest", MAX_LIVES should still be 3, and STARTING_SCORE should still be 0. Python allows reassignment to uppercase names, so you are responsible for keeping these intended constants unchanged.'},
    {id: 'add-names', title: 'Add one new setting and one new player detail', refs: [19], pointer: 'Find original line 19 · add your new lines underneath it',
      action: 'At the end of your program, create one new uppercase identifier for a setting intended to stay fixed and one new lowercase identifier for a player detail that could change. Assign a value to each. Use only assignment: no input, loops or arithmetic are needed.',
      example: 'MAX_BADGES = 4\nbadges_earned = 1', exampleNote: 'For example, the game can award at most four badges and the player has earned one. These would be new lines 20 and 21 if you have not added extra blank lines. You may choose your own sensible names and values instead.',
      check: 'You have two new, meaningful identifiers. The uppercase name represents a fixed setting. The lowercase name represents changing player information. These assignments alone do not print the new values.'},
    {id: 'print-new-values', title: 'Display both new values', refs: [19], pointer: 'Continue below your two new assignments at the end',
      action: 'Under the two assignments you just added, write one print instruction for each new identifier. Give each a clear text label. If you chose your own identifiers, use those exact names.',
      example: 'print("Maximum badges:", MAX_BADGES)\nprint("Badges earned:", badges_earned)', exampleNote: 'These would be lines 22 and 23 after the badge example. The labels go inside quotation marks; the identifiers go outside them. With the example values, the new output is Maximum badges: 4 and Badges earned: 1.',
      check: 'Each print line comes after the assignment it uses. Check matching brackets and quotation marks, and check the identifier’s spelling and capital letters.'},
    {id: 'test-adapted', title: 'Run and check your own version', refs: [5, 15, 16], pointer: 'Recheck your three edits, then your new lines at the end',
      action: 'Save your finished version and run it. Read the actual output one line at a time. Compare it with the values you chose—not necessarily with the optional examples.',
      check: 'Check your chosen player name, updated lives and updated score. Check that the starting values remain 3 and 0. Finally, check that your two new labels display the values from your new assignments. If something differs, check the assignment and print line for that identifier, make one correction and run again.'},
    {id: 'record-evidence', title: 'Record your code and evidence', refs: [], pointer: '',
      action: 'Use the evidence boxes just below this guide. Paste your actual output and one sentence about a check or a difficulty. Paste your complete adapted Python code. Add a clear IDE screenshot showing your work.',
      check: 'Read your pasted work and screenshot to make sure they are complete and legible. Keep any unfinished work and explain where you need help. Continue to Part C when ready. At the end of the lesson, export the complete PDF and submit it to Microsoft Teams.'}
  ];
  let host, openExplanation = null;
  const clamp = (value, max) => Number.isInteger(value) ? Math.max(0, Math.min(max, value)) : 0;
  function tutorState() {
    const state = host.getState();
    const old = state.tutor && typeof state.tutor === 'object' ? state.tutor : {};
    state.tutor = {
      cursor: clamp(old.cursor, lines.length - 1),
      revealed: Array.isArray(old.revealed) ? [...new Set(old.revealed.filter(n => Number.isInteger(n) && n >= 0 && n < lines.length))] : [],
      guideStep: clamp(old.guideStep, steps.length - 1),
      checks: Object.fromEntries(steps.map(step => [step.id, old.checks?.[step.id] === true]))
    };
    return state.tutor;
  }
  function numberedLine(number, code, button = false) {
    const row = document.createElement(button ? 'button' : 'div');
    row.className = 'tutor-code-line';
    if (button) { row.type = 'button'; row.setAttribute('aria-label', `Study line ${number}: ${code || 'blank line'}`); }
    const label = document.createElement('span');
    label.className = 'tutor-line-number';
    label.textContent = number;
    if (button) label.setAttribute('aria-hidden', 'true');
    const text = document.createElement('code');
    text.textContent = code || '(blank line)';
    row.append(label, text);
    return row;
  }
  function renderTrace() {
    const saved = tutorState(), index = saved.cursor, line = lines[index], snapshot = snapshots[index];
    const revealed = openExplanation === index;
    $('#tutorPosition').textContent = `Line ${index + 1} of ${lines.length}`;
    $('#tutorLineLabel').textContent = `Current line: ${index + 1}`;
    $('#tutorCurrentCode').textContent = line.code || '(blank line)';
    $('#tutorJump').value = String(index);
    $('#tutorPrevious').disabled = index === 0;
    $('#tutorNext').disabled = index === lines.length - 1;
    $('#tutorReveal').textContent = revealed ? 'Hide explanation and values' : 'Show explanation and values';
    $('#tutorReveal').setAttribute('aria-expanded', String(revealed));
    $('#tutorExplanation').hidden = !revealed;
    $('#tutorMeaning').textContent = line.meaning;
    $('#tutorSyntaxText').textContent = line.syntax;
    if (line.kind === 'assign') {
      const before = Object.hasOwn(snapshot.before, line.name) ? display(snapshot.before[line.name]) : 'not assigned yet';
      $('#tutorChange').textContent = `${line.name} — before: ${before}; after: ${display(snapshot.values[line.name])}. No new output on this line.`;
    } else if (line.kind === 'print') {
      $('#tutorChange').textContent = `New output line: ${snapshot.added}. No stored values change.`;
    } else $('#tutorChange').textContent = 'All stored values and existing output stay the same.';
    const list = $('#tutorValues'); list.replaceChildren();
    for (const name of names) {
      const term = document.createElement('dt'), value = document.createElement('dd');
      const code = document.createElement('code'); code.textContent = name; term.append(code);
      value.textContent = Object.hasOwn(snapshot.values, name) ? display(snapshot.values[name]) : 'Not assigned yet';
      if (line.kind === 'assign' && line.name === name) value.textContent += ' (assigned on this line)';
      list.append(term, value);
    }
    $('#tutorOutput').textContent = snapshot.output.join('\n') || 'No output yet.';
    for (const [i, button] of [...$('#tutorFullCode').children].entries()) {
      button.classList.toggle('is-current', i === index);
      if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    }
  }
  function renderGuide() {
    const saved = tutorState(), index = saved.guideStep, step = steps[index];
    $('#guidePosition').textContent = `Step ${index + 1} of ${steps.length}`;
    $('#guideTitle').textContent = step.title;
    $('#guideAction').textContent = step.action;
    $('#guideCheckText').textContent = step.check;
    $('#guideLineLabel').textContent = step.pointer;
    $('#guidePointer').hidden = !step.refs.length;
    $('#guideReferenceNote').hidden = !step.refs.length;
    $('#guideCode').replaceChildren(...step.refs.map(number => numberedLine(number, lines[number - 1].code)));
    $('#guideExamplePanel').hidden = !step.example;
    $('#guideExample').textContent = step.example || '';
    $('#guideExampleNote').textContent = step.exampleNote || '';
    $('#guideExpectedPanel').hidden = !step.expected;
    $('#guideExpected').textContent = step.expected || '';
    $('#guideCopy').hidden = index !== 0;
    $('#guidePrevious').disabled = index === 0;
    $('#guideNext').disabled = index === steps.length - 1;
    $('#guidePreviousBottom').disabled = index === 0;
    $('#guideNextBottom').disabled = index === steps.length - 1;
    $('#guideChecked').checked = saved.checks[step.id];
    $('#guideChecked').setAttribute('aria-label', `Step ${index + 1}: ${step.title}. I have done this step and checked it in my IDE.`);
    $('#guideCheckStatus').textContent = `${saved.checks[step.id] ? 'This step is checked.' : 'This step is not checked yet.'} ${Object.values(saved.checks).filter(Boolean).length} of ${steps.length} steps checked by you. This is not a mark.`;
    for (const [i, item] of [...$('#guideOverview').children].entries()) {
      const button = item.querySelector('button');
      button.textContent = `${steps[i].title} — ${saved.checks[steps[i].id] ? 'Checked' : 'Not checked'}`;
      button.classList.toggle('is-current', index === i);
      if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    }
  }
  function moveTrace(index) {
    tutorState().cursor = clamp(index, lines.length - 1);
    openExplanation = null;
    $('#tutorSyntax').open = false;
    renderTrace(); host.saveState();
  }
  function moveGuide(index) {
    tutorState().guideStep = clamp(index, steps.length - 1);
    renderGuide(); host.saveState();
  }
  function render() {
    if (!host) return;
    openExplanation = null;
    $('#tutorSyntax').open = false;
    $('#tutorSnapshot').open = false;
    renderTrace(); renderGuide();
  }
  function init(api) {
    host = api;
    if ($('#mainProgram').textContent !== lines.map(line => line.code).join('\n')) {
      throw new Error('The supplied Python and its prepared tutor trace must match.');
    }
    for (const [index, line] of lines.entries()) {
      const option = document.createElement('option');
      option.value = String(index); option.textContent = `Line ${index + 1}: ${line.code || '(blank line)'}`;
      $('#tutorJump').append(option);
      const row = numberedLine(index + 1, line.code, true);
      row.addEventListener('click', () => {
        moveTrace(index);
        $('#tutorFullCode').closest('details').open = false;
        $('#tutorReveal').focus();
      });
      $('#tutorFullCode').append(row);
    }
    for (const [index] of steps.entries()) {
      const item = document.createElement('li'), button = document.createElement('button');
      button.type = 'button';
      button.addEventListener('click', () => {
        moveGuide(index);
        $('#guideOverview').closest('details').open = false;
        $('#guideTitle').focus();
      });
      item.append(button); $('#guideOverview').append(item);
    }
    $('#guideTitle').tabIndex = -1;
    $('#tutorPrevious').addEventListener('click', () => moveTrace(tutorState().cursor - 1));
    $('#tutorNext').addEventListener('click', () => moveTrace(tutorState().cursor + 1));
    $('#tutorJump').addEventListener('change', event => moveTrace(Number(event.target.value)));
    $('#tutorReveal').addEventListener('click', () => {
      const saved = tutorState();
      // Revealed lines are a support-use record, not a measure of comprehension.
      // Hiding the panel should not erase that record.
      if (!$('#tutorExplanation').hidden) {
        openExplanation = null;
        $('#tutorExplanation').hidden = true;
        $('#tutorReveal').textContent = 'Show explanation and values';
        $('#tutorReveal').setAttribute('aria-expanded', 'false');
      } else {
        if (!saved.revealed.includes(saved.cursor)) saved.revealed.push(saved.cursor);
        openExplanation = saved.cursor;
        renderTrace(); host.saveState();
      }
    });
    $('#guidePrevious').addEventListener('click', () => moveGuide(tutorState().guideStep - 1));
    $('#guideNext').addEventListener('click', () => moveGuide(tutorState().guideStep + 1));
    $('#guidePreviousBottom').addEventListener('click', () => { moveGuide(tutorState().guideStep - 1); $('#guideTitle').focus(); });
    $('#guideNextBottom').addEventListener('click', () => { moveGuide(tutorState().guideStep + 1); $('#guideTitle').focus(); });
    $('#guideChecked').addEventListener('change', event => {
      const saved = tutorState();
      saved.checks[steps[saved.guideStep].id] = event.target.checked;
      renderGuide(); host.saveState();
    });
    render();
  }
  function appendReport(section, entry) {
    if (!host) return;
    const saved = tutorState();
    section.append(entry('Supplied Python program used for the guided trace', lines.map(line => line.code).join('\n'), 'code'));
    const opened = [...saved.revealed].sort((a, b) => a - b).map(n => n + 1);
    section.append(entry('Line tutor: saved position and support used', `Saved position: line ${saved.cursor + 1} of ${lines.length}.\nExplanations opened: ${opened.length ? opened.join(', ') : 'None'}.\nOpening an explanation is support use, not proof of understanding. The walkthrough covers only the supplied program; it does not run or assess the student’s code.`));
    section.append(entry('Part B: student-reported checking', `Saved guide position: step ${saved.guideStep + 1} of ${steps.length}.\n${Object.values(saved.checks).filter(Boolean).length} of ${steps.length} steps checked by the student. These are manual checks, not automatically verified marks. “Not checked” does not necessarily mean the work was not attempted.`));
    for (const [index, step] of steps.entries()) section.append(entry(`B${index + 1}: ${step.title}`, `${saved.checks[step.id] ? 'Yes — student checked this step.' : 'Not checked.'}\nCheck requested: ${step.check}`));
  }
  window.LessonTutor = {init, render, appendReport};
})();
