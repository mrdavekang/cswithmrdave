(function () {
  'use strict';

  const BASE_STORAGE_KEY = 'beetlebit-week1-mission-control-v3';
  const PROFILE_KEY = 'beetlebit-week1-session-profile-v1';

  function loadParticipant() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(PROFILE_KEY) || 'null');
      return parsed && typeof parsed.name === 'string' ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function profileHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  const participant = loadParticipant();
  let teacherMode = Boolean(participant && participant.name.trim().toLowerCase() === 'teacher');
  const STORAGE_KEY = participant
    ? `${BASE_STORAGE_KEY}-${profileHash(`${participant.name.toLowerCase()}|${(participant.className || '').toLowerCase()}`)}`
    : `${BASE_STORAGE_KEY}-pending`;

  const cards = [
    { id: 'mission', title: 'Mission briefing', group: 'Start', minutes: 3 },
    { id: 'starter', title: 'Precise instructions', group: 'Starter', minutes: 8 },
    { id: 'learning', title: 'Knowledge · Skills · Understanding', group: 'Types of learning', minutes: 4 },
    { id: 'what', title: 'What is a micro:bit?', group: 'Main Task 1', minutes: 8 },
    { id: 'anatomy', title: 'Official board tour', group: 'Main Task 1', minutes: 10 },
    { id: 'ipo', title: 'Trace the system', group: 'Main Task 1', minutes: 8 },
    { id: 'predict', title: 'Predict the events', group: 'Main Task 2', minutes: 8 },
    { id: 'build', title: 'Build in MakeCode', group: 'Main Task 2', minutes: 18 },
    { id: 'test', title: 'Test and debug', group: 'Main Task 2', minutes: 8 },
    { id: 'pitstop', title: 'Choose your learning phase', group: 'Learning Pit Stop', minutes: 7 },
    { id: 'extension', title: 'Matched next step', group: 'Personalised route', minutes: 5 },
    { id: 'plenary', title: 'Explain the control story', group: 'Plenary', minutes: 3 },
    { id: 'finish', title: 'Mission debrief', group: 'Complete', minutes: 0 },
    { id: 'dice', title: 'Shake Dice', group: 'Extension Game 1', minutes: 0 },
    { id: 'rps', title: 'Rock · Paper · Scissors', group: 'Extension Game 2', minutes: 0 },
    { id: 'reaction', title: 'Reaction Racer', group: 'Extension Game 3', minutes: 0 },
  ];

  const CORE_CARD_COUNT = 12;
  const DEBRIEF_INDEX = cards.findIndex((card) => card.id === 'finish');
  const EXTENSION_START_INDEX = cards.findIndex((card) => card.id === 'dice');

  const emptyState = {
    current: 0,
    responses: {},
    checks: {},
    anatomyCorrect: false,
    ipoCorrect: false,
    predictCorrect: false,
  };

  let state = loadState();

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return parsed && typeof parsed === 'object'
        ? { ...emptyState, ...parsed, responses: parsed.responses || {}, checks: parsed.checks || {} }
        : structuredClone(emptyState);
    } catch (_) {
      return structuredClone(emptyState);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const cardElements = [...document.querySelectorAll('.lesson-card')];
  const cardNav = document.getElementById('cardNav');
  const progressFill = document.getElementById('progressFill');
  const phaseLabel = document.getElementById('phaseLabel');
  const timeLabel = document.getElementById('timeLabel');
  const stepCounter = document.getElementById('stepCounter');
  const groupLabel = document.getElementById('groupLabel');
  const previousButton = document.getElementById('previousCard');
  const nextButton = document.getElementById('nextCard');
  const completionHint = document.getElementById('completionHint');
  const landingScreen = document.getElementById('landingScreen');
  const landingForm = document.getElementById('landingForm');
  const landingError = document.getElementById('landingError');
  const studentName = document.getElementById('studentName');
  const studentClass = document.getElementById('studentClass');
  const participantLabel = document.getElementById('participantLabel');
  const teacherReviewBar = document.getElementById('teacherReviewBar');
  const teacherCardSelect = document.getElementById('teacherCardSelect');

  function response(id) {
    return state.responses[id] || '';
  }

  function checked(id) {
    return Boolean(state.checks[id]);
  }

  function allBuildChecks() {
    return ['start', 'a', 'b', 'ab', 'usb', 'loaded'].every((id) => checked(`build-${id}`));
  }

  function allTestsComplete() {
    return ['restart', 'a', 'b', 'ab'].every((id) => Boolean(response(`test-${id}`)));
  }

  function isComplete(id) {
    switch (id) {
      case 'mission': return checked('missionReady');
      case 'starter': return response('starterChoice') === 'precise' && response('starterImprove').trim().length >= 20;
      case 'learning': return checked('learningReady');
      case 'what': return response('microbitDefinition') === 'computer';
      case 'anatomy': return state.anatomyCorrect;
      case 'ipo': return state.ipoCorrect;
      case 'predict': return state.predictCorrect;
      case 'build': return allBuildChecks();
      case 'test': return allTestsComplete() && response('debugNote').trim().length >= 10;
      case 'pitstop': return Boolean(response('pitstop')) && response('pitstopEvidence').trim().length >= 15;
      case 'extension': return response('extensionNote').trim().length >= 10;
      case 'plenary': return response('plenaryExplain').trim().length >= 40 && Boolean(response('confidence'));
      case 'finish': return true;
      case 'dice': return ['dice-build', 'dice-play'].every((id) => checked(`challenge-${id}`));
      case 'rps': return ['rps-build', 'rps-play'].every((id) => checked(`challenge-${id}`));
      case 'reaction': return ['reaction-build', 'reaction-play'].every((id) => checked(`challenge-${id}`));
      default: return false;
    }
  }

  function missingMessage(id) {
    const messages = {
      mission: 'Tick the mission statement when you understand today’s constraint.',
      starter: 'Choose the precise instruction and improve the vague instruction using at least 20 characters.',
      learning: 'Tick the statement after comparing Knowledge, Skills and Understanding.',
      what: 'Choose the most complete definition of a micro:bit.',
      anatomy: 'Match all four mission jobs to the correct parts, then check your answers.',
      ipo: 'Complete and check the input–process–output chain.',
      predict: 'Predict and check all four program events.',
      build: 'Complete the simulator, USB and physical download checks.',
      test: 'Record all four physical micro:bit tests and one useful observation or fix.',
      pitstop: 'Choose one learning phase and give evidence from your work.',
      extension: 'Record the next step you completed or the help you requested.',
      plenary: 'Write a full IPO explanation and choose your WAGBA level.',
      finish: '',
      dice: 'Build, load and play the Shake Dice game, then tick both evidence checks.',
      rps: 'Build, load and play Rock · Paper · Scissors, then tick both evidence checks.',
      reaction: 'Build, load and race Reaction Racer, then tick both evidence checks.',
    };
    return messages[id] || 'Complete the required task on this card.';
  }

  function firstIncompleteIndex() {
    const found = cards.findIndex((card) => !isComplete(card.id));
    return found === -1 ? cards.length - 1 : found;
  }

  function renderNav() {
    cardNav.innerHTML = '';
    const unlocked = teacherMode ? cards.length - 1 : firstIncompleteIndex();
    cards.forEach((card, index) => {
      const visuallyComplete = isComplete(card.id) && (card.id !== 'finish' || teacherMode || unlocked >= DEBRIEF_INDEX);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `nav-entry${index === state.current ? ' active' : ''}${visuallyComplete ? ' complete' : ''}`;
      button.disabled = index > unlocked;
      button.setAttribute('aria-current', index === state.current ? 'step' : 'false');
      button.innerHTML = `<span class="nav-number">${visuallyComplete ? '✓' : index + 1}</span><span class="nav-copy">${card.title}</span><span class="nav-minutes">${card.minutes ? `${card.minutes}m` : ''}</span>`;
      button.addEventListener('click', () => showCard(index));
      cardNav.appendChild(button);
    });
  }

  function showCard(index) {
    const unlocked = teacherMode ? cards.length - 1 : firstIncompleteIndex();
    state.current = Math.max(0, Math.min(index, unlocked, cards.length - 1));
    saveState();
    cardElements.forEach((element) => {
      const active = element.dataset.card === cards[state.current].id;
      element.classList.toggle('active', active);
      element.setAttribute('aria-hidden', String(!active));
      if (active) element.scrollTop = 0;
    });
    const card = cards[state.current];
    const extensionNumber = state.current - EXTENSION_START_INDEX + 1;
    stepCounter.textContent = state.current < CORE_CARD_COUNT
      ? `Card ${state.current + 1} of ${CORE_CARD_COUNT}`
      : state.current === DEBRIEF_INDEX ? 'Mission complete' : `Extension game ${extensionNumber} of 3`;
    groupLabel.textContent = card.group;
    phaseLabel.textContent = card.title;
    timeLabel.textContent = card.minutes ? `${card.minutes} min` : state.current >= EXTENSION_START_INDEX ? 'Optional' : 'Done';
    progressFill.style.width = `${Math.round((Math.min(state.current, CORE_CARD_COUNT) / CORE_CARD_COUNT) * 100)}%`;
    previousButton.disabled = state.current === 0;
    nextButton.hidden = state.current === cards.length - 1;
    nextButton.disabled = !teacherMode && !isComplete(card.id);
    nextButton.textContent = card.id === 'plenary'
      ? 'Complete mission →'
      : card.id === 'finish' ? 'Open extension lab →'
        : state.current >= EXTENSION_START_INDEX ? 'Next game →' : 'Next card →';
    completionHint.textContent = teacherMode
      ? 'Teacher review — completion checks are bypassed.'
      : isComplete(card.id)
        ? state.current >= EXTENSION_START_INDEX ? 'Game complete — continue if lesson time remains.' : 'Card complete — you are ready to continue.'
        : missingMessage(card.id);
    if (teacherMode) teacherCardSelect.value = String(state.current);
    renderNav();
  }

  function updateJourney() {
    saveState();
    showCard(state.current);
  }

  function setField(field, value) {
    state.responses[field] = value;
    document.querySelectorAll(`[data-field="${field}"]`).forEach((button) => {
      button.classList.toggle('selected', button.dataset.value === value);
      button.setAttribute('aria-pressed', String(button.dataset.value === value));
    });
    if (field === 'starterChoice') updateStarterFeedback();
    if (field === 'microbitDefinition') updateDefinitionFeedback();
    if (field === 'pitstop') updatePitstopRoute();
    updateJourney();
  }

  document.querySelectorAll('[data-field]').forEach((button) => {
    button.addEventListener('click', () => setField(button.dataset.field, button.dataset.value));
  });

  function updateStarterFeedback() {
    const box = document.getElementById('starterFeedback');
    const value = response('starterChoice');
    box.className = 'feedback';
    if (value === 'precise') {
      box.classList.add('success');
      box.textContent = 'Correct. It states a distance, direction, order and stopping point, so another engineer can test the same instruction.';
    } else if (value) {
      box.classList.add('try-again');
      box.textContent = 'A robot cannot safely guess missing distances, directions or stopping conditions. Improve the instruction below.';
    } else {
      box.textContent = 'Choose one instruction, then explain why.';
    }
  }

  function updateDefinitionFeedback() {
    const box = document.getElementById('definitionFeedback');
    const value = response('microbitDefinition');
    box.className = 'feedback';
    if (value === 'computer') {
      box.classList.add('success');
      box.textContent = 'Correct. A micro:bit is a tiny programmable computer. Its display, buttons and sensors are parts of that computer—not the whole definition.';
    } else if (value) {
      box.classList.add('try-again');
      box.textContent = 'That describes one feature or a different component. Choose the description that explains what the micro:bit is able to do.';
    } else {
      box.textContent = 'Select the most complete description.';
    }
  }

  function bindText(id) {
    const element = document.getElementById(id);
    element.value = response(id);
    element.addEventListener('input', () => {
      state.responses[id] = element.value;
      updateJourney();
    });
  }

  ['starterImprove', 'debugNote', 'pitstopEvidence', 'extensionNote', 'plenaryExplain'].forEach(bindText);

  function bindCheck(id, stateId = id) {
    const element = document.getElementById(id);
    element.checked = checked(stateId);
    element.addEventListener('change', () => {
      state.checks[stateId] = element.checked;
      updateJourney();
    });
  }

  bindCheck('missionReady');
  bindCheck('learningReady');

  document.querySelectorAll('[data-build]').forEach((input) => {
    const key = `build-${input.dataset.build}`;
    input.checked = checked(key);
    input.addEventListener('change', () => {
      state.checks[key] = input.checked;
      updateJourney();
    });
  });

  document.querySelectorAll('[data-challenge]').forEach((input) => {
    const key = `challenge-${input.dataset.challenge}`;
    input.checked = checked(key);
    input.addEventListener('change', () => {
      state.checks[key] = input.checked;
      updateJourney();
    });
  });

  const anatomyExpected = {
    matchInput: 'Buttons A and B',
    matchProcess: 'Processor',
    matchOutput: '5×5 LED display',
    matchPins: 'Edge connector pins',
  };

  Object.keys(anatomyExpected).forEach((id) => {
    const select = document.getElementById(id);
    select.value = response(id);
    select.addEventListener('change', () => {
      state.responses[id] = select.value;
      state.anatomyCorrect = false;
      updateJourney();
    });
  });

  document.getElementById('checkAnatomy').addEventListener('click', () => {
    const correct = Object.entries(anatomyExpected).every(([id, expected]) => document.getElementById(id).value === expected);
    state.anatomyCorrect = correct;
    const box = document.getElementById('anatomyFeedback');
    box.className = `feedback ${correct ? 'success' : 'try-again'}`;
    box.textContent = correct
      ? 'All four jobs match. Notice that the edge connector is how the micro:bit communicates with add-on robot electronics.'
      : 'Not yet. Use this rule: buttons send data in, the processor runs instructions, LEDs show information, and pins connect extra electronics.';
    updateJourney();
  });

  const diagram = document.getElementById('microbitDiagram');
  const diagramCaption = diagram.nextElementSibling;
  document.querySelectorAll('[data-diagram]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const front = tab.dataset.diagram === 'front';
      diagram.src = front ? 'assets/microbit-v2-front.png' : 'assets/microbit-v2-back.png';
      diagram.alt = front ? 'Official labelled diagram of the front of a BBC micro:bit V2' : 'Official labelled diagram of the back of a BBC micro:bit V2';
      diagramCaption.textContent = `Official BBC micro:bit V2 diagram · ${front ? 'front' : 'back'} shown`;
      document.querySelectorAll('[data-diagram]').forEach((other) => {
        const active = other === tab;
        other.classList.toggle('active', active);
        other.setAttribute('aria-selected', String(active));
      });
    });
  });

  ['ipoInput', 'ipoProcess', 'ipoOutput'].forEach((id) => {
    const select = document.getElementById(id);
    select.value = response(id);
    select.addEventListener('change', () => {
      state.responses[id] = select.value;
      state.ipoCorrect = false;
      updateJourney();
    });
  });

  document.getElementById('checkIpo').addEventListener('click', () => {
    const correct = response('ipoInput') === 'a' && response('ipoProcess') === 'program' && response('ipoOutput') === 'led';
    state.ipoCorrect = correct;
    const box = document.getElementById('ipoFeedback');
    box.className = `feedback ${correct ? 'success' : 'try-again'}`;
    box.textContent = correct
      ? 'Correct: Button A press → processor runs the event code → left arrow appears on the LEDs.'
      : 'Trace time order: what happens first, what interprets it, and what can the operator see last?';
    updateJourney();
  });

  document.querySelectorAll('[data-predict]').forEach((select, index) => {
    const key = `predict-${index}`;
    select.value = response(key);
    select.addEventListener('change', () => {
      state.responses[key] = select.value;
      state.predictCorrect = false;
      updateJourney();
    });
  });

  document.getElementById('checkPredict').addEventListener('click', () => {
    const selects = [...document.querySelectorAll('[data-predict]')];
    const answered = selects.every((select) => select.value);
    const correct = answered && selects.every((select) => select.value === select.dataset.predict);
    state.predictCorrect = correct;
    const box = document.getElementById('predictFeedback');
    box.className = `feedback ${correct ? 'success' : 'try-again'}`;
    box.textContent = correct
      ? 'All predictions match the event blocks. You are ready to build, simulate, download and verify them on the physical board.'
      : answered ? 'One or more predictions do not match the event heading. Read each “on…” block from left to right.' : 'Make all four predictions before checking.';
    updateJourney();
  });

  document.querySelectorAll('[data-test]').forEach((select) => {
    const key = `test-${select.dataset.test}`;
    select.value = response(key);
    select.addEventListener('change', () => {
      state.responses[key] = select.value;
      updateJourney();
    });
  });

  document.querySelectorAll('input[name="confidence"]').forEach((input) => {
    input.checked = response('confidence') === input.value;
    input.addEventListener('change', () => {
      if (input.checked) state.responses.confidence = input.value;
      updateJourney();
    });
  });

  const routeCopy = {
    new: { icon: '🌱', title: 'New Learning → Guided repair', text: 'Stay in the good struggle. Explain one event with your partner, repair one mismatch and retest.' },
    consolidating: { icon: '🔁', title: 'Consolidating → Countdown protocol', text: 'Use what you know to add a short READY, 3–2–1, STOP sequence.' },
    water: { icon: '🚀', title: 'Treading Water → Five-command state machine', text: 'Increase the thinking demand with a variable, command cycle and confirm button.' },
    drowning: { icon: '🛟', title: 'Drowning → Worked-example support', text: 'Reduce the task to on start and Button A. Get those secure, then request the next block.' },
  };

  function updatePitstopRoute() {
    const chosen = response('pitstop');
    const route = routeCopy[chosen];
    const box = document.getElementById('pitstopRoute');
    box.textContent = route ? `${route.title}. ${route.text}` : 'Choose a phase to receive the right next step.';
    const recommended = document.getElementById('recommendedRoute');
    if (route) recommended.innerHTML = `<span class="route-icon" aria-hidden="true">${route.icon}</span><div><b>${route.title}</b><p>${route.text}</p></div>`;
    document.querySelectorAll('[data-route-card]').forEach((card) => card.classList.toggle('recommended', card.dataset.routeCard === chosen));
  }

  previousButton.addEventListener('click', () => showCard(state.current - 1));
  nextButton.addEventListener('click', () => {
    const id = cards[state.current].id;
    if (!teacherMode && !isComplete(id)) {
      completionHint.textContent = missingMessage(id);
      return;
    }
    showCard(state.current + 1);
  });

  const helpPanel = document.getElementById('helpPanel');
  const helpButton = document.getElementById('helpButton');
  const helpBackdrop = document.getElementById('helpBackdrop');
  const closeHelp = document.getElementById('closeHelp');

  function setHelp(open, returnFocus = true) {
    helpPanel.classList.toggle('open', open);
    helpPanel.setAttribute('aria-hidden', String(!open));
    helpButton.setAttribute('aria-expanded', String(open));
    helpBackdrop.hidden = !open;
    if (open) closeHelp.focus(); else if (returnFocus) helpButton.focus();
  }

  helpButton.addEventListener('click', () => setHelp(true));
  closeHelp.addEventListener('click', () => setHelp(false));
  helpBackdrop.addEventListener('click', () => setHelp(false));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (helpPanel.classList.contains('open')) setHelp(false);
  });

  document.getElementById('resetLesson').addEventListener('click', () => {
    if (!window.confirm('Reset all locally saved responses for this Week 1 lesson?')) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  function restoreButtons() {
    ['starterChoice', 'microbitDefinition', 'pitstop'].forEach((field) => {
      document.querySelectorAll(`[data-field="${field}"]`).forEach((button) => {
        const selected = button.dataset.value === response(field);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    });
  }

  teacherCardSelect.innerHTML = cards.map((card, index) => `<option value="${index}">${index + 1}. ${card.group} — ${card.title}</option>`).join('');
  teacherCardSelect.addEventListener('change', () => showCard(Number(teacherCardSelect.value)));

  landingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = studentName.value.trim().replace(/\s+/g, ' ');
    const className = studentClass.value.trim().replace(/\s+/g, ' ');
    const enteringAsTeacher = name.toLowerCase() === 'teacher';

    if (!name) {
      landingError.textContent = 'Enter your name to continue.';
      studentName.focus();
      return;
    }
    if (!enteringAsTeacher && !className) {
      landingError.textContent = 'Enter your class to continue.';
      studentClass.focus();
      return;
    }

    sessionStorage.setItem(PROFILE_KEY, JSON.stringify({ name, className: className || 'Staff' }));
    window.location.reload();
  });

  restoreButtons();
  updateStarterFeedback();
  updateDefinitionFeedback();
  updatePitstopRoute();
  if (participant) {
    landingScreen.hidden = true;
    document.body.classList.remove('entry-pending');
    document.body.classList.toggle('teacher-mode', teacherMode);
    participantLabel.textContent = teacherMode ? 'Teacher · Review' : `${participant.name} · ${participant.className || ''}`;
    teacherReviewBar.hidden = !teacherMode;
    showCard(Number.isInteger(state.current) ? state.current : 0);
  } else {
    landingScreen.hidden = false;
    window.requestAnimationFrame(() => studentName.focus());
  }
})();
