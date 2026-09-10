/* Topic-specific, student-reported reflection. No scoring or learner labels. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const beforeChoices = [
    'I could already do or explain this before today',
    'I can do or explain this with the recap or a prompt',
    'This is new to me',
    'I am not sure; I need help checking'
  ];
  const phases = [
    'New learning — a good struggle, and I am making progress',
    'Consolidating — practising and becoming more secure',
    'Treading water — easy for me; I need more challenge',
    'Drowning — I am stuck and need help',
    'Not attempted yet'
  ];
  const beforeLabels = ['Already knew / could do this', 'With a recap or prompt', 'New to me', 'Unsure / need help'];
  const phaseLabels = ['New learning', 'Consolidating', 'Treading water', 'Drowning — need help', 'Not attempted yet'];
  const topics = [
    {id: 'variable', group: 'Knowledge', title: 'Variables, identifiers and values',
      statement: 'I can explain what a variable is and tell its identifier apart from its stored value.',
      before: 'Use starter question 5: can you say what stayed the same when score changed from 5 to 8? Explaining this already is prior knowledge you can build on.',
      after: 'Use player_name, lives_remaining or current_score in your code. Can you name the identifier and its value separately?',
      start: 'In Main Activity 1, read “named storage”. Point to the name and value in player_score = 12 and explain the difference.',
      actions: ['Use one assignment from your code. Say the identifier and its value aloud, then try a second example.', 'Without the recap, explain what a variable is using your own line of code. Check the definition afterwards.', 'Try extension 1 with your own player name. Explain why a variable is still a variable even if this short program never reassigns it.', 'Ask your teacher to point to player_name = "Aisha" with you. Identify just the name first, then the text value.']},
    {id: 'constant', group: 'Knowledge', title: 'Constants and Python conventions',
      statement: 'I can explain what a constant is and what an uppercase name means in Python.',
      before: 'The starter did not test constants. If the word constant or the uppercase convention is unfamiliar, choose “This is new to me”. That is a knowledge target.',
      after: 'Use MAX_LIVES. Can you explain “intended to stay fixed” and say whether Python actually prevents reassignment?',
      start: 'Read the constant paragraph in Main Activity 1. Then use tutor line 2 and Part C question 4 to distinguish our convention from what Python enforces.',
      actions: ['Revisit the constant paragraph. Explain MAX_LIVES in one sentence, including why its name is uppercase.', 'Explain, without a prompt, why uppercase communicates an intention rather than preventing a change in Python.', 'Try extension 8: repair the accidental change to MAX_PLAYERS and explain why Python accepted the original code.', 'Ask your teacher to compare MAX_LIVES = 3 with lives_remaining = 3. Start with which name represents a fixed rule.']},
    {id: 'names', group: 'Skills', title: 'Choosing and repairing names',
      statement: 'I can choose valid, meaningful identifiers and repair invalid or unclear names.',
      before: 'Use starter questions 2 and 3. Could you choose a meaningful name and check letters, digits and underscores yourself, or did you need the recap?',
      after: 'Use your Main Activity 1 identifier repairs or your new Part B names. Can you check the rules and improve an unclear name such as s for a score?',
      start: 'In Main Activity 1, use the Identifier check. Check whether a name is valid first, then whether it clearly describes the stored data.',
      actions: ['Repair one invalid name from the Identifier check. Check one naming rule at a time.', 'Choose a new meaningful name without looking at the model. Explain which data it stores, then check its spelling and rules.', 'Try extension 5. Repair the names and explain each repair; also distinguish a valid name from a useful, meaningful one.', 'Show your teacher one name you are unsure about. Check its first character, spaces and punctuation together before checking its meaning.']},
    {id: 'assignment', group: 'Skills', title: 'Assigning, reassigning and tracing values',
      statement: 'I can assign and reassign values, predict the latest value and check the output in my IDE.',
      before: 'Starter questions 4 and 5 give some evidence of tracing. They do not prove you can write and run the code yet: choose the response that best describes what you can currently do.',
      after: 'Use your Part B edits. Did the final output show the values you chose? Can you follow the assignments in order?',
      start: 'Use the line tutor in Main Activity 2, then the Part B guide. Predict a value, make one edit, run it in your IDE and compare the actual output.',
      actions: ['Use tutor lines 6 and 15. Follow lives_remaining from 3 to 2, then make one small change in your own IDE and check it.', 'Predict the result of a fresh reassignment before running it. Use the tutor only after making your prediction.', 'Try extension 4: trace several assignments to current_level. Explain why only the latest value is printed at the end.', 'Pause on the exact line that is confusing. Ask your teacher to trace just that assignment with you before running more code.']},
    {id: 'purpose', group: 'Understanding', title: 'Choosing a role from its purpose',
      statement: 'I can explain why a name should be a variable or a constant in a particular program.',
      before: 'This goes beyond remembering a definition. Can you explain why a fixed maximum and a changing count have different roles even if both start at 3? It is fine if this is new.',
      after: 'Use MAX_LIVES and lives_remaining. Explain their different purposes, not just their capital letters or their current numbers.',
      start: 'Use Main Activity 1’s decision model and paired examples. Ask “Is this a fixed rule or changing information?” and justify your choice.',
      actions: ['Compare one pair in Main Activity 1. Complete: “This is a fixed rule because…; this describes changing information because…”.', 'Explain why two identifiers can both hold 3 but have different roles. Then apply the same reasoning to classroom capacity.', 'Try extension 7, Ticket machine. Explain why ticket price is fixed for this program but availability changes; do not rely on the values alone.', 'Ask your teacher to describe a room’s capacity and the number of students present. Decide which could change during the lesson, then connect that to the code.']},
    {id: 'maintainability', group: 'Understanding', title: 'Clear names and maintainability',
      statement: 'I can explain how meaningful names and named constants make a program easier to understand, check and update.',
      before: 'Maintainability means how easy code is to understand, fix and update. Choosing a good name is a skill; explaining how it helps a future reader shows understanding.',
      after: 'Use a name you improved or a fixed setting in your code. Explain a specific benefit for someone who has to check or change the program later.',
      start: 'When choosing your Part B names, explain what another programmer could understand from them. Connect the fixed settings to the program’s rules.',
      actions: ['Compare s with current_score. Explain one thing a new reader can understand more easily from the clearer name.', 'Use one of your own names and explain how it makes an error or a setting easier to find. Give a specific example, not just “it is better”.', 'Try extension 9, Refactor unclear code. Justify the new names and give two specific maintainability benefits.', 'Show your teacher one unclear name. Rename it together, then complete: “A reader can now tell that this stores…”.']}
  ];
  function option(select, text) {
    const node = document.createElement('option'); node.value = text; node.textContent = text; select.append(node);
  }
  const fieldValue = id => document.getElementById(id)?.value || '';
  function paragraph(parent, text, className = '') {
    const p = document.createElement('p'); p.textContent = text; p.className = className; parent.append(p); return p;
  }
  function buildRows(container, prefix, after) {
    topics.forEach((topic, index) => {
      const row = document.createElement('div'); row.className = 'reflection-item';
      paragraph(row, `${index + 1} of ${topics.length} · ${topic.group}`, 'reflection-kicker');
      const label = document.createElement('label');
      label.className = 'question-label'; label.htmlFor = `${prefix}_${topic.id}`; label.textContent = topic.statement;
      row.append(label);
      const hint = paragraph(row, after ? topic.after : topic.before, 'reflection-hint'); hint.id = `${prefix}_${topic.id}_help`;
      if (after) { const prior = paragraph(row, '', 'reflection-prior'); prior.id = `prior_${topic.id}`; }
      const select = document.createElement('select');
      select.id = `${prefix}_${topic.id}`; select.dataset.field = select.id;
      select.dataset.label = `${after ? 'Learning pit stop' : 'Types of learning'} — ${topic.group}: ${topic.statement}`;
      select.setAttribute('aria-describedby', hint.id);
      option(select, after ? 'Choose your current stage' : 'Choose your starting point'); select.options[0].value = '';
      (after ? phases : beforeChoices).forEach((text, i) => { option(select, text); select.options[i + 1].textContent = (after ? phaseLabels : beforeLabels)[i]; });
      row.append(select);
      if (after) { const feedback = paragraph(row, '', 'reflection-feedback'); feedback.id = `action_${topic.id}`; }
      container.append(row);
    });
  }
  function startingSuggestion(topic) {
    const value = fieldValue(`lt_${topic.id}`);
    if (value === beforeChoices[0]) return 'prior';
    if (value === beforeChoices[1]) return 'practice';
    if (value === beforeChoices[2] || value === beforeChoices[3]) return 'learn';
    return '';
  }
  function nextAction(topic) {
    const index = phases.indexOf(fieldValue(`lp_${topic.id}`));
    if (index < 0) return '';
    if (index === 4) return `Not yet attempted is not a judgement of your ability. Your next opportunity: ${topic.start}`;
    return topic.actions[index];
  }
  function render() {
    const suggestions = $('#learningSuggestions'); suggestions.replaceChildren();
    const answered = topics.filter(t => startingSuggestion(t)).length;
    paragraph(suggestions, `${answered} of 6 starting-point checks recorded. These are self-reports, not marks.`);
    for (const group of ['Knowledge', 'Skills', 'Understanding']) {
      const targets = topics.filter(t => t.group === group && ['learn', 'practice'].includes(startingSuggestion(t)));
      if (targets.length) paragraph(suggestions, `${group} focus: ${targets.map(t => t.title.toLowerCase() + (startingSuggestion(t) === 'practice' ? ' (practise with less prompting)' : ' (learn or clarify)')).join('; ')}.`);
    }
    const prior = topics.filter(t => startingSuggestion(t) === 'prior');
    if (prior.length) paragraph(suggestions, `You report prior learning in: ${prior.map(t => t.title.toLowerCase()).join('; ')}. Build on this; you do not need to relearn the same definition as your main target.`);
    if (answered === 6 && prior.length === 6) paragraph(suggestions, 'If these are all secure, choose a target to apply in a new scenario or explain more deeply. Confirm that with your teacher using an example.');
    if (answered < 6) paragraph(suggestions, 'Unanswered statements are not treated as gaps. Complete them when you can, or discuss them with your teacher.');
    const chosen = topics.find(t => `${t.group}: ${t.title}` === fieldValue('lt_focus'));
    $('#learningFocusAction').textContent = chosen ? `I am getting better at ${chosen.title.toLowerCase()}. Next: ${chosen.start}` : 'Choose your own focus using the suggestions and your starter evidence. You may work on more than one kind of learning today.';
    $('#pitStopStartingFocus').textContent = chosen ? `Your focus after the starter was ${chosen.group.toLowerCase()}: ${chosen.title.toLowerCase()}. Has your work helped you move forward?` : 'You have not recorded a starting focus yet. You can still reflect on what you have practised today.';
    for (const topic of topics) {
      $(`#prior_${topic.id}`).textContent = `After the starter: ${fieldValue(`lt_${topic.id}`) || 'No starting point recorded'}.`;
      $(`#action_${topic.id}`).textContent = nextAction(topic);
    }
    const summary = $('#pitStopSuggestions'); summary.replaceChildren();
    const help = topics.filter(t => fieldValue(`lp_${t.id}`) === phases[3]);
    const stretch = topics.filter(t => fieldValue(`lp_${t.id}`) === phases[2]);
    const progress = topics.filter(t => [phases[0], phases[1]].includes(fieldValue(`lp_${t.id}`)));
    if (!topics.some(t => phases.includes(fieldValue(`lp_${t.id}`)))) paragraph(summary, 'Choose the stage that fits each part of your learning. There is no single overall stage to pass or fail.');
    if (help.length) paragraph(summary, `Ask for support with ${help.map(t => `${t.group.toLowerCase()}: ${t.title.toLowerCase()}`).join('; ')}. Show your teacher one of those statements. You can pause now; you do not need to finish the other checks first.`);
    if (progress.length) paragraph(summary, `You report progress or consolidation in ${progress.map(t => t.title.toLowerCase()).join('; ')}. Choose one example from your work to explain what you can now do.`);
    if (stretch.length) paragraph(summary, `You report needing more challenge in ${stretch.map(t => t.title.toLowerCase()).join('; ')}. Use the topic-specific extension suggested above when your teacher agrees you are ready.`);
    if (topics.some(t => fieldValue(`lp_${t.id}`) === phases[4])) paragraph(summary, 'For anything not attempted yet, plan a first supported attempt rather than treating it as a failure.');
    const next = topics.find(t => `${t.group}: ${t.title}` === fieldValue('lp_priority'));
    $('#pitStopChosenAction').textContent = next ? (nextAction(next) || `First choose your stage for ${next.title.toLowerCase()} above, or tell your teacher where you are unsure.`) : 'Choose a specific topic for your next action. If you feel stuck, it is okay to choose asking for help.';
  }
  function init() {
    buildRows($('#learningBeforeRows'), 'lt', false);
    buildRows($('#learningAfterRows'), 'lp', true);
    for (const topic of topics) {
      option($('#lt_focus'), `${topic.group}: ${topic.title}`);
      option($('#lp_priority'), `${topic.group}: ${topic.title}`);
    }
    render();
  }
  function appendReport(section, key, entry) {
    if (key === 'starter') {
      section.append(entry('Types of learning — suggested next focus (based on self-report)', $('#learningSuggestions').innerText + '\n' + $('#learningFocusAction').textContent));
    }
    if (key === 'main2') {
      const comparison = topics.map(t => `${t.group}: ${t.title}\nAfter starter: ${fieldValue(`lt_${t.id}`) || 'Not recorded'}\nAfter Main Activity 2: ${fieldValue(`lp_${t.id}`) || 'Not recorded'}\n${nextAction(t) || 'Next action not selected.'}`).join('\n\n');
      section.append(entry('Learning pit stop — starting points, current stages and suggested actions', comparison));
      section.append(entry('Learning pit stop — next focus and support', $('#pitStopSuggestions').innerText + '\n' + $('#pitStopChosenAction').textContent + '\nThese reflections are student self-reports, not automatically verified attainment. Saving a help request does not send an alert to the teacher.'));
    }
  }
  window.LessonReflection = {init, render, appendReport};
})();
