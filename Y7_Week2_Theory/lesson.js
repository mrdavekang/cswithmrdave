(function (root) {
  'use strict';
  const stages = ['Get ready', 'Starter', 'Plan', 'Write', 'Test & reflect', 'Submit'];
  const cards = [
    ['mission', 0, 'Your job today', '3 min'],
    ['starter', 1, 'Remember: instructions and order', '4 min'],
    ['strategy', 1, 'Learning pitstop: how will I improve?', '2 min'],
    ['split', 2, 'Split the journey into smaller jobs', '4 min'],
    ['abstract', 2, 'Keep the useful map details', '4 min'],
    ['ipo', 2, 'What would a directions program do?', '4 min'],
    ['model', 3, 'Read a pseudocode example', '3 min'],
    ['write1', 3, 'Your instructions: Reception to Library', '5 min'],
    ['write2', 3, 'Your instructions: Library to C1', '5 min'],
    ['flow', 3, 'The same instructions as a flowchart', '5 min'],
    ['test', 4, 'Ask a partner to test your instructions', '7 min'],
    ['extension', 4, 'Extra challenge, if you have time', 'Optional'],
    ['reflect', 4, 'Learning pitstop: where am I now?', '1 min'],
    ['plenary', 4, 'Show what you understand', '3 min'],
    ['review', 5, 'Check your lesson evidence', '2 min'],
    ['submit', 5, 'Save your PDF and turn it in', '8 min']
  ].map(([id, stage, title, time]) => ({id, stage, title, time}));
  const goals = {
    topic: 'From problems to precise plans',
    wagba: 'Split a school journey into smaller parts, keep useful information, and write and test clear instructions using pseudocode and a simple flowchart.',
    knowledge: 'Know what decomposition, abstraction, input, process, output and pseudocode mean.',
    skills: 'Plan a route, write ordered instructions and trace a flowchart with a partner.',
    understanding: 'Explain why clear steps and useful details help someone follow a plan without guessing.',
    challenge: 'Adapt your instructions when a corridor closes, or compare two possible instructions.'
  };
  const terms = [
    ['algorithm', 'A clear set of instructions in order.', '算法', 'algoritma'],
    ['program', 'Instructions written in a language a computer can run.', '程序', 'atur cara'],
    ['sequence', 'The order of the steps.', '顺序', 'urutan'],
    ['decomposition', 'Split a big job into smaller jobs that can be checked separately.', '分解', 'leraian'],
    ['abstraction', 'Keep the details needed for the task; leave out distractions.', '抽象化', 'peniskalaan'],
    ['input', 'Information a program receives.', '输入', 'input'],
    ['process', 'What a program does with the input.', '处理', 'proses'],
    ['output', 'The result a program produces.', '输出', 'output'],
    ['pseudocode', 'A clear written plan for a program. It does not run by itself.', '伪代码', 'pseudokod'],
    ['flowchart', 'A diagram of the steps, joined by arrows.', '流程图', 'carta alir'],
    ['trace', 'Follow the instructions one at a time to check what happens.', '逐步检查', 'surih'],
    ['landmark', 'A place you can recognise, such as Reception or the Library.', '容易辨认的地点', 'tanda tempat']
  ];
  const questions = {
    order: {title: 'A robot turns right before walking. We swap these steps. What could happen?', choices: ['It could finish in a different place.', 'It will correct our instructions for us.', 'It must finish in the same place.'], correct: 0, hint: 'Imagine facing the front of the room. Walking first and turning first can take you to different places.', why: 'The order of instructions can change the result.'},
    code: {title: 'Which is a Python command, when used in a prepared Turtle program?', choices: ['Go somewhere near the computer room.', 't.forward(40)', 'A drawing of the school.'], correct: 1, hint: 'Look for the instruction written using Python spelling and brackets.', why: 't.forward(40) is a Python command. Pseudocode is a plan; a program is executable code.'},
    keep: {title: 'Which detail must remain on our map?', choices: ['The colour of a poster.', 'The staff-only access rule.', 'The colour of somebody’s bag.'], correct: 1, hint: 'Which detail changes where the new student is allowed to go?', why: 'Removing an access rule could make the directions unsafe.'},
    remove: {title: 'Which detail can we leave out of these directions?', choices: ['The Library label.', 'The starting place.', 'A decorative poster.'], correct: 2, hint: 'The student needs to find places. They do not need to describe how a room is decorated.', why: 'The poster does not help the student complete this journey.'},
    input: {title: 'The program receives “Main Entrance; Reception; Library; C1”. This is…', choices: ['Input', 'Process', 'Output'], correct: 0, hint: 'These are the starting place and stops given to the program.', why: 'The places supplied to the program are input information.'},
    process: {title: 'The program uses the map to put a permitted route in order. This is…', choices: ['Input', 'Process', 'Output'], correct: 1, hint: 'Think about the work done with the information.', why: 'Selecting and ordering a route is processing.'},
    output: {title: 'The screen displays the route instructions. These are…', choices: ['Input', 'Process', 'Output'], correct: 2, hint: 'This is the result the user receives.', why: 'The displayed directions are the output.'},
    precise: {title: 'Which instruction tells the student exactly where to stop?', choices: ['WALK along the Main Corridor until you reach the Library.', 'GO over there.', 'WALK for a while.'], correct: 0, hint: 'Find the instruction with both a named corridor and a named stopping place.', why: 'A clear stopping place means the student does not need to guess.'},
    oval: {title: 'Which flowchart shape should contain START and END?', choices: ['Oval', 'Rectangle'], correct: 0, hint: 'An oval marks the beginning or end. A rectangle contains an action.', why: 'START and END belong in ovals.'},
    box: {title: 'Which shape should contain “RETURN the book at the Library”?', choices: ['Oval', 'Rectangle'], correct: 1, hint: 'Returning a book is an action in the journey.', why: 'An action belongs in a rectangle. The connecting arrows show the order.'},
    transfer: {title: 'The Library changes its poster, but its door stays in the same place. Must our route instructions change?', choices: ['No: the poster is not needed for our route.', 'Yes: every change in decoration changes the route.'], correct: 0, hint: 'Think about the useful details you kept when simplifying the map.', why: 'Abstraction lets us leave out details that do not affect the route.'}
  };
  const labels = {
    strategyType: 'Learning pitstop: my focus', strategyAction: 'Learning pitstop: my next action',
    leg1: 'Journey 1: after Main Entrance, stop at', leg2: 'Journey 2: after Reception, stop at', leg3: 'Journey 3: after Library, finish at',
    abstractionReason: 'Why I kept or removed that detail',
    step3: 'Step 3: leave Reception', step4: 'Step 4: reach the Library', step5: 'Step 5: complete the Library job',
    step6: 'Step 6: leave the Library', step7: 'Step 7: change direction at the junction', step8: 'Step 8: finish at C1',
    flowAction: 'Flowchart: first action after reaching the Library',
    testStep: 'Step selected for testing', testResult: 'Result of the peer/self test', testRewrite: 'Improved instruction', testReason: 'Explanation of the check or improvement',
    phase: 'Learning pitstop: my current phase', nextAction: 'Learning pitstop: what I will do next',
    finalReason: 'Why my instructions are easier to follow than “Go to C1”',
    extensionRoute: 'Extension: alternative route instructions', extensionCompare: 'Extension: comparison and improvement'
  };
  const required = {
    mission: [], starter: ['q:order','q:code'], strategy: ['strategyType','strategyAction'],
    split: ['leg1','leg2','leg3'], abstract: ['q:keep','q:remove','abstractionReason'],
    ipo: ['q:input','q:process','q:output'], model: ['q:precise'],
    write1: ['step3','step4','step5'], write2: ['step6','step7','step8'],
    flow: ['q:oval','q:box','flowAction'], test: ['testStep','testResult','testReason'],
    extension: [], reflect: ['phase','nextAction'], plenary: ['q:transfer','finalReason'], review: [], submit: []
  };
  const model = ['WALK straight from the Main Entrance to Reception.', 'COLLECT your timetable at Reception.'];
  const text = value => typeof value === 'string' && value.trim().length > 0;
  function missing(state, cardId) {
    const fields = (required[cardId] || []).slice();
    if (cardId === 'test' && state.answers.testResult === 'Needs a clearer instruction') fields.push('testRewrite');
    return fields.filter(key => key.startsWith('q:') ? !state.quizzes[key.slice(2)]?.accepted : !text(state.answers[key]));
  }
  function makeState(name, className) {
    return {version:4, lesson:'y7-w2-theory', name, className, teacher:name.trim().toLowerCase()==='teacher', created:new Date().toISOString(), current:0, unlocked:0, completed:[], answers:{}, quizzes:{}, events:[], revisions:[], extensionVisits:[], help:'plain', device:'auto', evidenceIds:[], submission:{}, legacy:null};
  }
  function storageKey(name, className) {
    if (name.trim().toLowerCase() === 'teacher') return 'y7-w2-theory-v4:teacher';
    return 'y7-w2-theory-v4:' + encodeURIComponent(className.normalize('NFC').trim().toLowerCase()) + ':' + encodeURIComponent(name.normalize('NFC').trim().toLowerCase());
  }
  function answerLabel(id) { return id.startsWith('q:') ? questions[id.slice(2)]?.title : labels[id] || id; }
  function filename(state, ext='pdf') {
    const safe = str => str.normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f]/g,'').trim().replace(/\s+/g,'_').slice(0,70) || 'Student';
    return `Year7_${safe(state.className)}_${safe(state.name)}_Week2_Theory.${ext}`;
  }
  function route(state) {return model.concat(['step3','step4','step5','step6','step7','step8'].map(k=>state.answers[k] || '(not yet written)'));}
  function check(state, id, choice) {
    const old=state.quizzes[id] || {attempts:[]};
    const correct=choice===questions[id].correct;
    return {...old, choice, checked:choice, accepted:correct, supported:false, correct, attempts:[...old.attempts,{choice,correct,time:new Date().toISOString()}]};
  }
  function select(state,id,choice) {return {...(state.quizzes[id]||{attempts:[]}), choice, checked:null, accepted:false, correct:false, supported:false};}
  const api={stages,cards,goals,terms,questions,labels,required,model,missing,makeState,storageKey,answerLabel,filename,route,check,select};
  root.Lesson=api;
  if(typeof module!=='undefined') module.exports=api;
})(typeof window==='undefined'?globalThis:window);
