/* Six matched, topic-specific self-checks; never an attainment score. */
(() => {
  'use strict';
  const before = ['Already knew / could do independently', 'With the reading or a prompt', 'New to me', 'Not sure / not checked yet'];
  const phases = ['New learning — a good struggle', 'Consolidating', 'Treading water — I need more challenge', 'Drowning — I need help', 'Not attempted yet'];
  const topics = [
    {id:'input', group:'Knowledge', title:'Input and stored data',
      statement:'I can state that input() returns a string and identify the variable and its stored value.',
      before:'Use starter questions 1 and 2: after entering 15, could you distinguish the string "15" from the number 15?',
      evidence:'Point to one input line in your program and say the identifier, the entered value and its type before conversion.',
      start:'Revisit Read first: point to the name on the left of = and the value returned by input() on the right.',
      actions:['Trace one input line with the reading, then explain what is stored.', 'Recall the type before checking with print(type(age)).', 'In extension 10, explain why the event name stays text but the duration needs conversion.', 'Ask your teacher to trace age = input("Enter your age: ") using just the entry 15.']},
    {id:'operators', group:'Knowledge', title:'Division operator meanings',
      statement:'I can identify what /, // and % return, and match // to DIV and % to MOD.',
      before:'The starter did not check these operators. If you have not met them before, choose “New to me”.',
      evidence:'Use the operator check: for 19 and 4, can you name which operator gives 4.75, 4 and 3?',
      start:'In Main Activity 2, read the long-division example and the Python–pseudocode operator bridge.',
      actions:['Use 19 divided by 4 to match each operator to its result.', 'Recall the three results and the DIV/MOD names without the model; then check.', 'Use extension 5: predict both results for 24 days, and write the matching DIV and MOD expressions.', 'Show your teacher the long division. First point to the 4 above the bar, then the remainder 3 below.']},
    {id:'conversion', group:'Skills', title:'Converting input and producing output',
      statement:'I can write input, int() or float(), a calculation and a clearly labelled print() output in my IDE.',
      before:'Starter question 5 checks a conversion choice, not a whole working program. Consider what you have actually written and run.',
      evidence:'Use your Main Activity 1 program: did both 3.5 and 19.99 work as decimal entries?',
      start:'Follow Main Activity 1: inspect the model, convert the decimal entry with float(), then run one test in your own IDE.',
      actions:['Follow the model for one input and conversion line; run it before adding the calculation.', 'Write the conversion line without copying, then compare its output with your prediction.', 'Try extension 3: accept three decimal prices and print their total with a clear label.', 'Ask your teacher to help with one line: price = float(input("Price: ")). Identify the prompt before tracing the conversion.']},
    {id:'testing', group:'Skills', title:'Predicting, testing and debugging',
      statement:'I can predict an output, run a test, compare the result and locate a line that needs fixing.',
      before:'Starter questions 3 and 4 give evidence of spotting an error. Running and checking your own program will need practical evidence too.',
      evidence:'Use the 220, 60, 59 and 0 minute tests: compare expected and actual output, rather than only saying “it works”.',
      start:'In Main Activity 2 Part B, predict one test, run it and record the actual output. If it differs, check one line at a time.',
      actions:['Work through one test with the model and compare each output line.', 'Predict a new input such as 61 before running it; explain any mismatch.', 'Try extension 8: test the original conversion with 4.99, repair it and explain the cause.', 'Show your teacher one failing input and the exact error or output. Ask to trace only the first confusing line.']},
    {id:'choice', group:'Understanding', title:'Explaining a data-type choice',
      statement:'I can explain why a problem needs text, whole numbers or decimal numbers, and why a conversion is suitable.',
      before:'Use starter question 4: could you explain why the string age cannot be added directly to the integer 1?',
      evidence:'Compare a name, age in completed years and a price. Explain why their purposes lead to different choices.',
      start:'In Main Activity 1, explain why a decimal price needs float(); compare that with int() for a whole number of minutes.',
      actions:['Finish: “This price needs float() because the user may enter…”. Give a decimal example.', 'Explain why int() suits this minutes program but not the decimal-price program.', 'Use extension 10 to justify the data type of every input, including the event name.', 'Ask your teacher to compare "Aisha", 15 and 3.50. Decide what each value represents before choosing a conversion.']},
    {id:'remainder', group:'Understanding', title:'Explaining complete groups and leftovers',
      statement:'I can explain why a converter needs both // and %, using complete groups and the amount left over.',
      before:'This is not just naming an operator. Can you explain why hours and remaining minutes answer different questions? It is fine if this is new.',
      evidence:'Use 220 minutes: 3 × 60 + 40 = 220. Explain what 3 and 40 mean in this situation.',
      start:'Study Main Activity 2’s long division, then connect complete teams and leftover students to complete hours and leftover minutes.',
      actions:['Use 19 = 4 × 4 + 3 to explain the whole-number answer and remainder in words.', 'Explain why 59 minutes gives 0 complete hours and 59 remaining minutes.', 'Try extension 4: convert 145 seconds, then explain how the same idea transfers from hours to minutes.', 'Ask your teacher to work through 19 − 16 = 3 with you. First identify what is left, then connect that to %.']}
  ];
  const el = id => document.getElementById(id);
  const value = id => el(id).value;
  const text = (parent, content, cls='') => {const p=document.createElement('p');p.textContent=content;p.className=cls;parent.append(p);return p;};
  function option(select, label, val=label) {const o=document.createElement('option');o.textContent=label;o.value=val;select.append(o);}
  function action(t) {
    const i=phases.indexOf(value(`lp_${t.id}`));
    return i===4 ? `Not attempted is not a failure. Your first step: ${t.start}` : (t.actions[i] || '');
  }
  function buildRows(after) {
    const prefix=after?'lp':'lt', holder=el(after?'learningAfterRows':'learningBeforeRows');
    topics.forEach((t,i) => {
      const row=document.createElement('div');row.className='reflection-item';
      text(row, `${i+1} of 6 · ${t.group}`, 'reflection-kicker');
      const label=document.createElement('label');label.htmlFor=`${prefix}_${t.id}`;label.className='question-label';label.textContent=t.statement;row.append(label);
      const help=text(row,after?t.evidence:t.before,'reflection-hint');help.id=`${prefix}_${t.id}_help`;
      if(after) text(row,'','reflection-prior').id=`prior_${t.id}`;
      const select=document.createElement('select');select.id=`${prefix}_${t.id}`;select.dataset.field=select.id;
      select.dataset.label=`${t.group} — ${t.statement}`;select.setAttribute('aria-describedby',help.id);
      option(select,after?'Choose your current stage':'Choose your starting point','');
      (after?phases:before).forEach(s=>option(select,s));row.append(select);
      if(after) text(row,'','reflection-feedback').id=`action_${t.id}`;
      holder.append(row);
    });
  }
  function render() {
    const summary=el('learningSuggestions');summary.replaceChildren();
    text(summary,`${topics.filter(t=>value(`lt_${t.id}`)).length} of 6 starting points recorded. Counts describe your responses, not your attainment.`);
    for(const group of ['Knowledge','Skills','Understanding']) {
      const set=topics.filter(t=>t.group===group);
      const count=choice=>set.filter(t=>value(`lt_${t.id}`)===choice).length;
      text(summary,`${group} (2 checks): ${count(before[0])} independent; ${count(before[1])} with prompting; ${count(before[2])} new; ${count(before[3])} not sure; ${set.filter(t=>!value(`lt_${t.id}`)).length} unanswered.`);
      const targets=set.filter(t=>[before[1],before[2],before[3]].includes(value(`lt_${t.id}`)));
      if(targets.length) text(summary,`Possible ${group.toLowerCase()} focus: ${targets.map(t=>t.title.toLowerCase()).join('; ')}.`);
    }
    const chosen=topics.find(t=>value('lt_focus')===`${t.group}: ${t.title}`);
    el('learningFocusAction').textContent=chosen?chosen.start:'Choose your own focus. Build on what you already know; confirm your choice using an example with your teacher.';
    el('pitStopStartingFocus').textContent=chosen?`Your starting WAGBA focus: ${chosen.group} — ${chosen.title}. What evidence now shows your progress?`:'No starting focus recorded yet. You can still review today’s work.';
    const pit=el('pitStopSuggestions');pit.replaceChildren();
    text(pit,`${topics.filter(t=>value(`lp_${t.id}`)).length} of 6 current stages recorded. These stages are not ordered scores: needing challenge is different from needing help.`);
    for(const group of ['Knowledge','Skills','Understanding']) {
      const set=topics.filter(t=>t.group===group);
      text(pit,`${group} (2 checks): ${phases.map((p,i)=>`${['new learning','consolidating','treading water','need help','not attempted'][i]} ${set.filter(t=>value(`lp_${t.id}`)===p).length}`).join('; ')}; unanswered ${set.filter(t=>!value(`lp_${t.id}`)).length}.`);
    }
    topics.forEach(t=>{el(`prior_${t.id}`).textContent=`After Do Now: ${value(`lt_${t.id}`)||'Not recorded'}.`;el(`action_${t.id}`).textContent=action(t);});
    const help=topics.filter(t=>value(`lp_${t.id}`)===phases[3]);
    if(help.length) text(pit,`Pause and show your teacher: ${help.map(t=>t.title).join('; ')}. You do not need to finish the other checks before asking for help.`);
    const next=topics.find(t=>value('lp_priority')===`${t.group}: ${t.title}`);
    el('pitStopChosenAction').textContent=next?(action(next)||'Choose your stage for this statement above, or discuss your uncertainty with your teacher.'):'Choose one next focus using your work and the suggestions above.';
  }
  function init() {
    buildRows(false);buildRows(true);
    topics.forEach(t=>{option(el('lt_focus'),`${t.group}: ${t.title}`);option(el('lp_priority'),`${t.group}: ${t.title}`);});
    render();
  }
  function appendReport(section,key,entry) {
    if(key==='learningTypes') section.append(entry('Starting-point counts and suggested next step — self-report',el('learningSuggestions').textContent+'\n'+el('learningFocusAction').textContent));
    if(key==='learningPitStop') {
      section.append(entry('Before-and-after K/S/U comparison',topics.map(t=>`${t.group}: ${t.title}\nStarting point: ${value(`lt_${t.id}`)||'Not recorded'}\nCurrent stage: ${value(`lp_${t.id}`)||'Not recorded'}\nSuggested action: ${action(t)||'Not selected'}`).join('\n\n')));
      section.append(entry('Current stage counts and next step — self-report',el('pitStopSuggestions').textContent+'\n'+el('pitStopChosenAction').textContent+'\nThese are not automatically verified marks. Saving a request for help does not alert the teacher.'));
    }
  }
  window.LessonReflection={init,render,appendReport,keys:prefix=>topics.map(t=>`${prefix}_${t.id}`)};
})();
