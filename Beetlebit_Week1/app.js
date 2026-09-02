(function () {
  'use strict';

  const STORAGE_KEY = 'beetlebit-week1-mission-control-v2';
  const teacherMode = new URLSearchParams(window.location.search).get('teacher') === '1';

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
    { id: 'extension', title: 'Matched next step', group: 'Extension / support', minutes: 5 },
    { id: 'plenary', title: 'Explain the control story', group: 'Plenary', minutes: 3 },
    { id: 'finish', title: 'Mission debrief', group: 'Complete', minutes: 0 },
  ];

  const emptyState = {
    current: 0,
    responses: {},
    checks: {},
    gameAnswers: {},
    anatomyCorrect: false,
    ipoCorrect: false,
    predictCorrect: false,
  };

  let state = loadState();

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return parsed && typeof parsed === 'object'
        ? { ...emptyState, ...parsed, responses: parsed.responses || {}, checks: parsed.checks || {}, gameAnswers: parsed.gameAnswers || {} }
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
  const extensionButton = document.getElementById('extensionButton');

  function response(id) {
    return state.responses[id] || '';
  }

  function checked(id) {
    return Boolean(state.checks[id]);
  }

  function allBuildChecks() {
    return ['start', 'a', 'b', 'ab'].every((id) => checked(`build-${id}`));
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
      build: 'Tick the four build checks after the MakeCode simulator works.',
      test: 'Record all four test results and one useful observation or fix.',
      pitstop: 'Choose one learning phase and give evidence from your work.',
      extension: 'Record the next step you completed or the help you requested.',
      plenary: 'Write a full IPO explanation and choose your WAGBA level.',
      finish: '',
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
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `nav-entry${index === state.current ? ' active' : ''}${isComplete(card.id) ? ' complete' : ''}`;
      button.disabled = index > unlocked;
      button.setAttribute('aria-current', index === state.current ? 'step' : 'false');
      button.innerHTML = `<span class="nav-number">${isComplete(card.id) ? '✓' : index + 1}</span><span class="nav-copy">${card.title}</span><span class="nav-minutes">${card.minutes ? `${card.minutes}m` : ''}</span>`;
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
    const coreTotal = cards.length - 1;
    stepCounter.textContent = state.current === cards.length - 1 ? 'Mission complete' : `Card ${state.current + 1} of ${coreTotal}`;
    groupLabel.textContent = card.group;
    phaseLabel.textContent = card.title;
    timeLabel.textContent = card.minutes ? `${card.minutes} min` : 'Done';
    progressFill.style.width = `${Math.round((Math.min(state.current, coreTotal) / coreTotal) * 100)}%`;
    previousButton.disabled = state.current === 0;
    nextButton.hidden = state.current === cards.length - 1;
    nextButton.disabled = !isComplete(card.id);
    extensionButton.disabled = !teacherMode && !isComplete(card.id);
    extensionButton.title = extensionButton.disabled ? 'Complete this lesson card to unlock the optional games.' : 'Open three optional code games.';
    nextButton.textContent = state.current === cards.length - 2 ? 'Finish mission →' : 'Next card →';
    completionHint.textContent = isComplete(card.id) ? 'Card complete — you are ready to continue.' : missingMessage(card.id);
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
      ? 'All predictions match the event blocks. You are ready to build and then verify them in the simulator.'
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
    if (!isComplete(id)) {
      completionHint.textContent = missingMessage(id);
      return;
    }
    showCard(state.current + 1);
  });

  const helpPanel = document.getElementById('helpPanel');
  const helpButton = document.getElementById('helpButton');
  const helpBackdrop = document.getElementById('helpBackdrop');
  const closeHelp = document.getElementById('closeHelp');
  const extensionPanel = document.getElementById('extensionPanel');
  const extensionBackdrop = document.getElementById('extensionBackdrop');
  const closeExtension = document.getElementById('closeExtension');
  const previousGame = document.getElementById('previousGame');
  const nextGame = document.getElementById('nextGame');
  const gameCards = [...document.querySelectorAll('[data-game-card]')];
  let extensionGameIndex = 0;

  const gameCopy = {
    decoder: {
      success: 'Correct. A+B is the input event; the nested show-icon block is the output action.',
      retry: 'Read the outside event first: nothing happens until A+B is pressed. Then read the action nested inside it.',
    },
    bug: {
      success: 'Correct. Keep the correct Button B event and repair only the wrong LEFT output.',
      retry: 'Use the test rule B = RIGHT. Keep the input that already matches and change the smallest incorrect part.',
    },
    route: {
      success: 'Correct. Two squares up and two squares right avoids the centre hazard and finishes at the battery.',
      retry: 'Trace one command at a time. Check for either entering the centre hazard or stopping one square too early.',
    },
  };

  function updateExtensionGames() {
    gameCards.forEach((card, index) => {
      const active = index === extensionGameIndex;
      card.classList.toggle('active', active);
      card.setAttribute('aria-hidden', String(!active));
    });
    document.getElementById('gameStep').textContent = `Game ${extensionGameIndex + 1} of ${gameCards.length}`;
    const solved = Object.values(state.gameAnswers).filter((answer) => answer.correct).length;
    document.getElementById('gameScore').textContent = `${solved}/3 solved`;
    previousGame.disabled = extensionGameIndex === 0;
    nextGame.textContent = extensionGameIndex === gameCards.length - 1 ? 'Close arcade ✓' : 'Next game →';

    document.querySelectorAll('[data-game-choice]').forEach((button) => {
      const answer = state.gameAnswers[button.dataset.game];
      const selected = answer && answer.value === button.dataset.value;
      button.classList.toggle('selected', Boolean(selected));
      button.classList.toggle('reveal-correct', Boolean(answer) && button.dataset.correct === 'true');
      button.setAttribute('aria-pressed', String(Boolean(selected)));
    });

    Object.entries(gameCopy).forEach(([game, copy]) => {
      const answer = state.gameAnswers[game];
      const feedback = document.getElementById(`gameFeedback-${game}`);
      if (!answer) return;
      feedback.className = `game-feedback ${answer.correct ? 'success' : 'try-again'}`;
      feedback.textContent = answer.correct ? copy.success : copy.retry;
    });
  }

  function setHelp(open, returnFocus = true) {
    if (open && extensionPanel.classList.contains('open')) setExtension(false, false);
    helpPanel.classList.toggle('open', open);
    helpPanel.setAttribute('aria-hidden', String(!open));
    helpButton.setAttribute('aria-expanded', String(open));
    helpBackdrop.hidden = !open;
    if (open) closeHelp.focus(); else if (returnFocus) helpButton.focus();
  }

  function setExtension(open, returnFocus = true) {
    if (open && extensionButton.disabled) return;
    if (open && helpPanel.classList.contains('open')) setHelp(false, false);
    extensionPanel.classList.toggle('open', open);
    extensionPanel.setAttribute('aria-hidden', String(!open));
    extensionButton.setAttribute('aria-expanded', String(open));
    extensionBackdrop.hidden = !open;
    if (open) {
      updateExtensionGames();
      closeExtension.focus();
    } else if (returnFocus) {
      extensionButton.focus();
    }
  }

  document.querySelectorAll('[data-game-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      state.gameAnswers[button.dataset.game] = {
        value: button.dataset.value,
        correct: button.dataset.correct === 'true',
      };
      saveState();
      updateExtensionGames();
    });
  });

  previousGame.addEventListener('click', () => {
    extensionGameIndex = Math.max(0, extensionGameIndex - 1);
    updateExtensionGames();
  });
  nextGame.addEventListener('click', () => {
    if (extensionGameIndex === gameCards.length - 1) {
      setExtension(false);
      return;
    }
    extensionGameIndex += 1;
    updateExtensionGames();
  });

  helpButton.addEventListener('click', () => setHelp(true));
  closeHelp.addEventListener('click', () => setHelp(false));
  helpBackdrop.addEventListener('click', () => setHelp(false));
  extensionButton.addEventListener('click', () => setExtension(true));
  closeExtension.addEventListener('click', () => setExtension(false));
  extensionBackdrop.addEventListener('click', () => setExtension(false));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (extensionPanel.classList.contains('open')) setExtension(false);
    else if (helpPanel.classList.contains('open')) setHelp(false);
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

  restoreButtons();
  updateStarterFeedback();
  updateDefinitionFeedback();
  updatePitstopRoute();
  showCard(Number.isInteger(state.current) ? state.current : 0);
})();
