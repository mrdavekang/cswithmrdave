(() => {
  'use strict';

  const SECTION_ORDER = ['starter', 'main1', 'main2', 'extension', 'plenary', 'export'];
  const CORE_SECTIONS = ['starter', 'main1', 'main2', 'plenary'];
  const SECTION_LABELS = {
    starter: 'Starter',
    main1: 'Main Task 1',
    main2: 'Main Task 2',
    extension: 'Extension',
    plenary: 'Plenary',
    export: 'Export'
  };

  const TASK_CONTENT = {
    starter: [
      { id: 'game', title: 'Writing instructions for a game character', image: 'assets/starter_game_instructions.png', answer: 'Computer Science', explanation: 'It uses algorithms and commands to control a character.' },
      { id: 'presentation', title: 'Creating a presentation', image: 'assets/starter_presentation.png', answer: 'Digital creativity', explanation: 'It mainly communicates information using digital media.' },
      { id: 'python', title: 'Finding an error in Python code', image: 'assets/starter_python_error.png', answer: 'Computer Science', explanation: 'It involves reading, testing and debugging code.' },
      { id: 'traffic', title: 'Designing a traffic-light system', image: 'assets/starter_traffic_light.png', answer: 'Both', explanation: 'It combines computational thinking with designing a real-world solution.' }
    ],
    main1: [
      { image: 'assets/main1_human_robot.png', caption: 'Create precise instructions to reach a goal.' },
      { image: 'assets/main1_commands.png', caption: 'Use only the permitted commands.' },
      { image: 'assets/main1_test.png', caption: 'Test one instruction at a time.' },
      { image: 'assets/main1_debug.png', caption: 'Find unclear, missing or incorrectly ordered steps.' }
    ],
    singleImages: {
      main2_algorithms: { image: 'assets/main2_algorithms.png', alt: 'Algorithms and sequencing worksheet visual' },
      main2_scratch: { image: 'assets/main2_scratch.png', alt: 'Scratch programming diagnostic visual' },
      main2_ipo: { image: 'assets/main2_ipo.png', alt: 'Input process output camera system visual' },
      main2_safety: { image: 'assets/main2_safety.png', alt: 'Digital safety diagnostic scenarios' },
      extension: { image: 'assets/extension_debug.png', alt: 'Student debugging Python code' },
      plenary: { image: 'assets/plenary_exit_ticket.png', alt: 'First Computer Science exit ticket poster' }
    }
  };

  const SEQUENCE_ITEMS = [
    { id: 'bread', text: 'Get two slices of bread.' },
    { id: 'spread', text: 'Add any spreads, such as butter.' },
    { id: 'filling', text: 'Put the filling between the bread.' },
    { id: 'plate', text: 'Put the sandwich on a plate.' },
    { id: 'cut', text: 'Cut the sandwich if you want to.' }
  ];

  const EXTENSION_ITEMS = [
    { id: 'leave', text: 'Leave the house.' },
    { id: 'uniform', text: 'Put on your school uniform.' },
    { id: 'wake', text: 'Wake up.' },
    { id: 'travel', text: 'Travel to school.' },
    { id: 'pack', text: 'Pack your school bag.' }
  ];

  const COMMANDS = [
    { code: 'F', label: 'Move forward', symbol: '↑' },
    { code: 'L', label: 'Turn left', symbol: '↶' },
    { code: 'R', label: 'Turn right', symbol: '↷' },
    { code: 'P', label: 'Pick up object', symbol: '◆' },
    { code: 'S', label: 'Stop', symbol: '■' }
  ];

  const DEFAULT_STATE = {
    profile: { name: '', className: '', teacherMode: false },
    activeSection: 'starter',
    unlockedAll: false,
    starter: { answers: {}, checked: false, score: null, challenge: '' },
    main1: { algorithm: [], tested: false, testResult: '', success: false, reflection: '' },
    main2: {
      sequence: {}, sequenceSwap: '',
      scratchShape: '', scratchInput: '', scratchOutput: '', scratchRepeat: '', scratchImprovement: '',
      ipoPress: '', ipoCapture: '', ipoPhoto: '', ipoExample: '',
      safety1: '', safety2: '', challenge: ''
    },
    extension: { order: {}, missing: '', decision: '' },
    plenary: { algorithm: '', sequence: '', expectation: '', improve: '', challenge: '' }
  };

  let state = structuredClone(DEFAULT_STATE);
  let currentStorageKey = '';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function cloneDefault() {
    return structuredClone(DEFAULT_STATE);
  }

  function storageKey(profile) {
    if (profile.teacherMode) return 'y7-week1-theory:teacher-test';
    const safeName = profile.name.trim().toLowerCase().replace(/\s+/g, '-');
    const safeClass = profile.className.trim().toLowerCase().replace(/\s+/g, '-');
    return `y7-week1-theory:${safeClass}:${safeName}`;
  }

  function loadState(profile) {
    currentStorageKey = storageKey(profile);
    const saved = localStorage.getItem(currentStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state = deepMerge(cloneDefault(), parsed);
        state.profile = profile;
      } catch (error) {
        console.warn('Could not load saved state:', error);
        state = cloneDefault();
        state.profile = profile;
      }
    } else {
      state = cloneDefault();
      state.profile = profile;
    }
    if (profile.teacherMode) state.unlockedAll = true;
  }

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        target[key] = deepMerge(target[key] && typeof target[key] === 'object' ? target[key] : {}, value);
      } else {
        target[key] = value;
      }
    }
    return target;
  }

  function saveState() {
    if (!currentStorageKey) return;
    localStorage.setItem(currentStorageKey, JSON.stringify(state));
    refreshUI();
  }

  function setProfile(profile) {
    loadState(profile);
    $('#profileOverlay').classList.add('hidden');
    restoreFormValues();
    refreshUI();
    showSection(state.activeSection || 'starter', true);
  }

  function renderStarterCards() {
    const container = $('#starterCards');
    container.innerHTML = TASK_CONTENT.starter.map((item, index) => `
      <article class="classification-card">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
        <div class="card-body">
          <h3>${index + 1}. ${escapeHtml(item.title)}</h3>
          <div class="choice-row" role="radiogroup" aria-label="Classify ${escapeHtml(item.title)}">
            ${['Computer Science', 'Digital creativity', 'Both'].map(choice => `
              <label><input type="radio" name="starter-${item.id}" value="${choice}"> ${choice}</label>
            `).join('')}
          </div>
          <div id="result-${item.id}" class="card-result" aria-live="polite"></div>
        </div>
      </article>
    `).join('');

    TASK_CONTENT.starter.forEach(item => {
      $$(`input[name="starter-${item.id}"]`).forEach(input => {
        input.addEventListener('change', () => {
          state.starter.answers[item.id] = input.value;
          state.starter.checked = false;
          state.starter.score = null;
          saveState();
        });
      });
    });
  }

  function renderDynamicImages() {
    $$('[data-image-group]').forEach(container => {
      const key = container.dataset.imageGroup;
      const images = TASK_CONTENT[key] || [];
      container.innerHTML = images.map(item => `
        <figure class="image-card">
          <img src="${item.image}" alt="${escapeHtml(item.caption)}" loading="lazy">
          <figcaption>${escapeHtml(item.caption)}</figcaption>
        </figure>
      `).join('');
    });
    $$('[data-image-key]').forEach(container => {
      const item = TASK_CONTENT.singleImages[container.dataset.imageKey];
      if (!item) return;
      container.innerHTML = `<img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy">`;
    });
  }

  function renderOrderTask(containerId, items, statePath) {
    const container = $(`#${containerId}`);
    container.innerHTML = items.map(item => `
      <div class="order-row">
        <select data-order-id="${item.id}" aria-label="Position for ${escapeHtml(item.text)}">
          <option value="">Order</option>
          ${items.map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
        <span>${escapeHtml(item.text)}</span>
      </div>
    `).join('');

    $$('select[data-order-id]', container).forEach(select => {
      select.addEventListener('change', () => {
        const target = statePath === 'main2' ? state.main2.sequence : state.extension.order;
        target[select.dataset.orderId] = select.value;
        saveState();
      });
    });
  }

  function renderCommands() {
    $('#commandButtons').innerHTML = COMMANDS.map(command => `
      <button type="button" class="command-btn" data-command="${command.code}" title="${command.label}">${command.symbol}<br><small>${command.label}</small></button>
    `).join('');
    $$('.command-btn').forEach(button => {
      button.addEventListener('click', () => {
        state.main1.algorithm.push(button.dataset.command);
        state.main1.tested = false;
        state.main1.success = false;
        state.main1.testResult = '';
        saveState();
        renderAlgorithmList();
        renderRobotGrid();
      });
    });
  }

  function renderAlgorithmList() {
    const list = $('#algorithmList');
    if (!state.main1.algorithm.length) {
      list.innerHTML = '<li class="muted">No commands added yet.</li>';
      return;
    }
    list.innerHTML = state.main1.algorithm.map(code => {
      const command = COMMANDS.find(item => item.code === code);
      return `<li>${command ? `${command.symbol} ${command.label}` : code}</li>`;
    }).join('');
  }

  function testAlgorithm() {
    const start = { row: 4, col: 0, direction: 0 };
    const goal = { row: 0, col: 4 };
    const directions = [
      { dr: -1, dc: 0, symbol: '⬆' },
      { dr: 0, dc: 1, symbol: '➡' },
      { dr: 1, dc: 0, symbol: '⬇' },
      { dr: 0, dc: -1, symbol: '⬅' }
    ];
    let robot = { ...start };
    let pickedUp = false;
    let stopped = false;
    let error = '';
    const path = [{ row: robot.row, col: robot.col }];

    for (let i = 0; i < state.main1.algorithm.length; i += 1) {
      const code = state.main1.algorithm[i];
      if (stopped) break;
      if (code === 'L') robot.direction = (robot.direction + 3) % 4;
      if (code === 'R') robot.direction = (robot.direction + 1) % 4;
      if (code === 'F') {
        const nextRow = robot.row + directions[robot.direction].dr;
        const nextCol = robot.col + directions[robot.direction].dc;
        if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4) {
          error = `Command ${i + 1} moves the robot outside the grid.`;
          break;
        }
        robot.row = nextRow;
        robot.col = nextCol;
        path.push({ row: robot.row, col: robot.col });
      }
      if (code === 'P') {
        if (robot.row === goal.row && robot.col === goal.col) pickedUp = true;
        else {
          error = `Command ${i + 1} tries to pick up the object before reaching the star.`;
          break;
        }
      }
      if (code === 'S') stopped = true;
    }

    const success = !error && robot.row === goal.row && robot.col === goal.col && pickedUp && stopped;
    let message = '';
    if (success) {
      message = `Success. The robot reached the star, picked it up and stopped using ${state.main1.algorithm.length} commands.`;
    } else if (error) {
      message = `Debug needed: ${error}`;
    } else if (robot.row !== goal.row || robot.col !== goal.col) {
      message = 'Debug needed: the robot did not finish on the star.';
    } else if (!pickedUp) {
      message = 'Almost there: the robot reached the star but did not use Pick up object.';
    } else if (!stopped) {
      message = 'Almost there: add Stop after picking up the object.';
    }

    state.main1.tested = true;
    state.main1.success = success;
    state.main1.testResult = message;
    state.main1.lastPath = path;
    state.main1.lastRobot = robot;
    saveState();
    renderRobotGrid();
    updateRobotFeedback();
  }

  function renderRobotGrid() {
    const grid = $('#robotGrid');
    const goal = { row: 0, col: 4 };
    const start = { row: 4, col: 0 };
    const path = state.main1.lastPath || [];
    const robot = state.main1.lastRobot || start;
    const directionSymbols = ['⬆', '➡', '⬇', '⬅'];
    let html = '';
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const classes = ['grid-cell'];
        if (row === start.row && col === start.col) classes.push('start');
        if (row === goal.row && col === goal.col) classes.push('goal');
        if (path.some(point => point.row === row && point.col === col)) classes.push('path');
        if (row === robot.row && col === robot.col) classes.push('robot');
        const label = row === start.row && col === start.col ? 'START' : row === goal.row && col === goal.col ? 'STAR' : '';
        const content = row === goal.row && col === goal.col ? '⭐' : '';
        const robotSymbol = state.main1.tested && row === robot.row && col === robot.col
          ? directionSymbols[robot.direction ?? 0]
          : (!state.main1.tested && row === start.row && col === start.col ? '⬆' : '');
        html += `<div class="${classes.join(' ')}" data-robot="${robotSymbol}">${content}<span class="cell-label">${label}</span></div>`;
      }
    }
    grid.innerHTML = html;
  }

  function updateRobotFeedback() {
    const panel = $('#robotFeedback');
    panel.textContent = state.main1.testResult || 'Add commands, then test your algorithm.';
    panel.classList.remove('success', 'fail');
    if (state.main1.tested) panel.classList.add(state.main1.success ? 'success' : 'fail');
  }

  function checkStarter() {
    let answered = 0;
    let score = 0;
    TASK_CONTENT.starter.forEach(item => {
      const value = state.starter.answers[item.id];
      const result = $(`#result-${item.id}`);
      result.classList.remove('correct', 'incorrect');
      if (value) {
        answered += 1;
        if (value === item.answer) {
          score += 1;
          result.textContent = `Correct. ${item.explanation}`;
          result.classList.add('correct');
        } else {
          result.textContent = `Review: ${item.explanation}`;
          result.classList.add('incorrect');
        }
      } else {
        result.textContent = 'Choose one option.';
        result.classList.add('incorrect');
      }
    });
    state.starter.checked = answered === TASK_CONTENT.starter.length;
    state.starter.score = score;
    $('#starterFeedback').textContent = state.starter.checked ? `You answered ${answered} items and scored ${score}/4.` : `Complete all four classifications.`;
    saveState();
  }

  function sectionComplete(section) {
    if (section === 'starter') {
      return TASK_CONTENT.starter.every(item => Boolean(state.starter.answers[item.id]));
    }
    if (section === 'main1') {
      return state.main1.tested && state.main1.reflection.trim().length >= 5;
    }
    if (section === 'main2') {
      const sequenceComplete = SEQUENCE_ITEMS.every(item => state.main2.sequence[item.id]);
      const uniqueOrders = new Set(Object.values(state.main2.sequence).filter(Boolean)).size === SEQUENCE_ITEMS.length;
      const scratchComplete = ['scratchShape', 'scratchInput', 'scratchOutput', 'scratchRepeat', 'scratchImprovement'].every(key => state.main2[key].trim());
      const ipoComplete = ['ipoPress', 'ipoCapture', 'ipoPhoto', 'ipoExample'].every(key => state.main2[key].trim());
      const safetyComplete = Boolean(state.main2.safety1 && state.main2.safety2);
      return sequenceComplete && uniqueOrders && state.main2.sequenceSwap.trim() && scratchComplete && ipoComplete && safetyComplete;
    }
    if (section === 'extension') {
      return extensionAttempted();
    }
    if (section === 'plenary') {
      return ['algorithm', 'sequence', 'expectation', 'improve'].every(key => state.plenary[key].trim().length >= 3);
    }
    if (section === 'export') return coreComplete();
    return false;
  }

  function extensionAttempted() {
    return Object.values(state.extension.order).some(Boolean) || state.extension.missing.trim() || state.extension.decision.trim();
  }

  function coreComplete() {
    return CORE_SECTIONS.every(sectionComplete);
  }

  function isUnlocked(section) {
    if (state.unlockedAll || state.profile.teacherMode) return true;
    const index = SECTION_ORDER.indexOf(section);
    if (index <= 0) return true;
    if (section === 'extension') return sectionComplete('main2');
    if (section === 'plenary') return sectionComplete('main2');
    if (section === 'export') return sectionComplete('plenary');
    const previous = SECTION_ORDER[index - 1];
    return sectionComplete(previous);
  }

  function showSection(section, force = false) {
    if (!force && !isUnlocked(section)) {
      alert('Complete the previous core task before moving on.');
      return;
    }
    state.activeSection = section;
    $$('.lesson-section').forEach(element => element.classList.toggle('active', element.dataset.section === section));
    $$('.nav-btn').forEach(button => button.classList.toggle('active', button.dataset.section === section));
    saveStateSilently();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (section === 'export') renderExportSection();
  }

  function saveStateSilently() {
    if (!currentStorageKey) return;
    localStorage.setItem(currentStorageKey, JSON.stringify(state));
  }

  function renderNavigation() {
    const nav = $('#lessonNav');
    nav.innerHTML = SECTION_ORDER.map(section => {
      const complete = sectionComplete(section);
      const locked = !isUnlocked(section);
      return `<button type="button" class="nav-btn ${complete ? 'complete' : ''} ${locked ? 'locked' : ''} ${state.activeSection === section ? 'active' : ''}" data-section="${section}" ${locked ? 'aria-disabled="true"' : ''}>${SECTION_LABELS[section]}</button>`;
    }).join('');
    $$('.nav-btn', nav).forEach(button => button.addEventListener('click', () => showSection(button.dataset.section)));
  }

  function updateProgress() {
    const completed = CORE_SECTIONS.filter(sectionComplete).length;
    const percent = Math.round((completed / CORE_SECTIONS.length) * 100);
    $('#progressBar').style.width = `${percent}%`;
    $('#progressText').textContent = `${percent}% core lesson complete`;
  }

  function updateStatuses() {
    SECTION_ORDER.forEach(section => {
      const pill = $(`[data-status-for="${section}"]`);
      if (!pill) return;
      if (section === 'extension') {
        pill.textContent = extensionAttempted() ? 'Attempted' : 'Optional';
        pill.classList.toggle('done', Boolean(extensionAttempted()));
      } else {
        const done = sectionComplete(section);
        pill.textContent = done ? 'Complete' : 'Not complete';
        pill.classList.toggle('done', done);
      }
    });
  }

  function refreshUI() {
    $('#learnerName').textContent = state.profile.name || 'Not signed in';
    $('#learnerClass').textContent = state.profile.className || 'Class';
    // Teacher test mode is intentionally invisible in the student interface.
    $('#teacherPanelBtn').classList.add('hidden');
    $('#teacherPanelBtn').hidden = true;
    renderNavigation();
    updateProgress();
    updateStatuses();
    renderExportSection();
  }

  function restoreFormValues() {
    TASK_CONTENT.starter.forEach(item => {
      const value = state.starter.answers[item.id];
      if (value) {
        const input = $(`input[name="starter-${item.id}"][value="${cssEscape(value)}"]`);
        if (input) input.checked = true;
      }
    });
    $('#starterChallenge').value = state.starter.challenge || '';
    $('#main1Reflection').value = state.main1.reflection || '';
    renderAlgorithmList();
    renderRobotGrid();
    updateRobotFeedback();

    SEQUENCE_ITEMS.forEach(item => {
      const select = $(`#sequenceOrderTask select[data-order-id="${item.id}"]`);
      if (select) select.value = state.main2.sequence[item.id] || '';
    });
    $('#sequenceSwapAnswer').value = state.main2.sequenceSwap || '';
    $('#scratchShape').value = state.main2.scratchShape || '';
    $('#scratchInput').value = state.main2.scratchInput || '';
    $('#scratchOutput').value = state.main2.scratchOutput || '';
    $('#scratchRepeat').value = state.main2.scratchRepeat || '';
    $('#scratchImprovement').value = state.main2.scratchImprovement || '';
    $('#ipoPress').value = state.main2.ipoPress || '';
    $('#ipoCapture').value = state.main2.ipoCapture || '';
    $('#ipoPhoto').value = state.main2.ipoPhoto || '';
    $('#ipoExample').value = state.main2.ipoExample || '';
    if (state.main2.safety1) {
      const input = $(`input[name="safety1"][value="${cssEscape(state.main2.safety1)}"]`);
      if (input) input.checked = true;
    }
    if (state.main2.safety2) {
      const input = $(`input[name="safety2"][value="${cssEscape(state.main2.safety2)}"]`);
      if (input) input.checked = true;
    }
    $('#main2Challenge').value = state.main2.challenge || '';

    EXTENSION_ITEMS.forEach(item => {
      const select = $(`#extensionOrderTask select[data-order-id="${item.id}"]`);
      if (select) select.value = state.extension.order[item.id] || '';
    });
    $('#extensionMissing').value = state.extension.missing || '';
    $('#extensionDecision').value = state.extension.decision || '';

    $('#plenaryAlgorithm').value = state.plenary.algorithm || '';
    $('#plenarySequence').value = state.plenary.sequence || '';
    $('#plenaryExpectation').value = state.plenary.expectation || '';
    $('#plenaryImprove').value = state.plenary.improve || '';
    $('#plenaryChallenge').value = state.plenary.challenge || '';

    if (state.starter.checked) checkStarter();
  }

  function bindFormPersistence() {
    const bindings = [
      ['#starterChallenge', 'starter', 'challenge'],
      ['#main1Reflection', 'main1', 'reflection'],
      ['#sequenceSwapAnswer', 'main2', 'sequenceSwap'],
      ['#scratchShape', 'main2', 'scratchShape'],
      ['#scratchInput', 'main2', 'scratchInput'],
      ['#scratchOutput', 'main2', 'scratchOutput'],
      ['#scratchRepeat', 'main2', 'scratchRepeat'],
      ['#scratchImprovement', 'main2', 'scratchImprovement'],
      ['#ipoPress', 'main2', 'ipoPress'],
      ['#ipoCapture', 'main2', 'ipoCapture'],
      ['#ipoPhoto', 'main2', 'ipoPhoto'],
      ['#ipoExample', 'main2', 'ipoExample'],
      ['#main2Challenge', 'main2', 'challenge'],
      ['#extensionMissing', 'extension', 'missing'],
      ['#extensionDecision', 'extension', 'decision'],
      ['#plenaryAlgorithm', 'plenary', 'algorithm'],
      ['#plenarySequence', 'plenary', 'sequence'],
      ['#plenaryExpectation', 'plenary', 'expectation'],
      ['#plenaryImprove', 'plenary', 'improve'],
      ['#plenaryChallenge', 'plenary', 'challenge']
    ];

    bindings.forEach(([selector, section, key]) => {
      const element = $(selector);
      const eventName = element.tagName === 'SELECT' ? 'change' : 'input';
      element.addEventListener(eventName, () => {
        state[section][key] = element.value;
        saveState();
      });
    });

    $$('input[name="safety1"]').forEach(input => input.addEventListener('change', () => {
      state.main2.safety1 = input.value;
      saveState();
    }));
    $$('input[name="safety2"]').forEach(input => input.addEventListener('change', () => {
      state.main2.safety2 = input.value;
      saveState();
    }));
  }

  function validateBeforeNext(currentSection) {
    if (currentSection === 'starter' && !sectionComplete('starter')) return 'Choose an answer for all four starter images.';
    if (currentSection === 'main1' && !sectionComplete('main1')) return 'Test your algorithm and complete the debugging reflection.';
    if (currentSection === 'main2' && !sectionComplete('main2')) return 'Complete all four diagnostic parts. Each order number must be used once.';
    if (currentSection === 'plenary' && !sectionComplete('plenary')) return 'Answer all four exit-ticket questions.';
    return '';
  }

  function renderExportSection() {
    const checklist = $('#completionChecklist');
    if (!checklist) return;
    const items = [
      ['Starter', sectionComplete('starter')],
      ['Main Task 1', sectionComplete('main1')],
      ['Main Task 2', sectionComplete('main2')],
      ['Extension', extensionAttempted(), true],
      ['Plenary', sectionComplete('plenary')]
    ];
    checklist.innerHTML = items.map(([label, done, optional]) => `
      <div class="completion-item ${done ? 'done' : 'pending'}">
        <strong>${done ? '✓' : optional ? '○' : '•'} ${label}</strong>
        <span>${done ? (optional ? 'Attempted' : 'Complete') : optional ? 'Optional - not attempted' : 'Still needs completion'}</span>
      </div>
    `).join('');

    const ready = coreComplete() || state.profile.teacherMode;
    $('#exportPdfBtn').disabled = !ready;
    $('#exportReadyPill').textContent = ready ? 'Ready to export' : 'Not ready';
    $('#exportReadyPill').classList.toggle('done', ready);
  }

  function reportData() {
    const starterAnswers = TASK_CONTENT.starter.map((item, index) => ({
      label: `${index + 1}. ${item.title}`,
      value: state.starter.answers[item.id] || 'Not answered'
    }));
    const algorithmText = state.main1.algorithm.map(code => {
      const command = COMMANDS.find(item => item.code === code);
      return command ? command.label : code;
    }).join(' -> ') || 'No commands entered';
    const orderedSequence = orderToText(SEQUENCE_ITEMS, state.main2.sequence);
    const orderedExtension = orderToText(EXTENSION_ITEMS, state.extension.order);

    const sections = [
      {
        title: 'Starter - What is Computer Science?',
        answers: [
          ...starterAnswers,
          { label: 'Starter score after checking', value: state.starter.score === null ? 'Not checked' : `${state.starter.score}/4` },
          { label: 'Challenge explanation', value: state.starter.challenge || 'Not attempted' }
        ]
      },
      {
        title: 'Main Task 1 - Human Robot: Precise Algorithms',
        answers: [
          { label: 'Algorithm', value: algorithmText },
          { label: 'Test result', value: state.main1.testResult || 'Not tested' },
          { label: 'Debugging reflection', value: state.main1.reflection || 'Not answered' }
        ]
      },
      {
        title: 'Main Task 2 - KS2 to KS3 Diagnostic',
        answers: [
          { label: 'A. Sandwich algorithm order', value: orderedSequence },
          { label: 'A. What could go wrong?', value: state.main2.sequenceSwap || 'Not answered' },
          { label: 'B1. Shape drawn', value: state.main2.scratchShape || 'Not answered' },
          { label: 'B2. Input', value: state.main2.scratchInput || 'Not answered' },
          { label: 'B3. Output', value: state.main2.scratchOutput || 'Not answered' },
          { label: 'B4. Repeating block', value: state.main2.scratchRepeat || 'Not answered' },
          { label: 'B5. Improvement', value: state.main2.scratchImprovement || 'Not answered' },
          { label: 'C. Press shutter button', value: state.main2.ipoPress || 'Not answered' },
          { label: 'C. Capture and save image', value: state.main2.ipoCapture || 'Not answered' },
          { label: 'C. Photo appears on screen', value: state.main2.ipoPhoto || 'Not answered' },
          { label: 'C. Additional IPO example', value: state.main2.ipoExample || 'Not answered' },
          { label: 'D. Stranger asks for information', value: state.main2.safety1 || 'Not answered' },
          { label: 'D. Another student\'s file', value: state.main2.safety2 || 'Not answered' },
          { label: 'Challenge response', value: state.main2.challenge || 'Not attempted' }
        ]
      }
    ];

    if (extensionAttempted()) {
      sections.push({
        title: 'Extension - Debug the Morning Algorithm',
        answers: [
          { label: 'Corrected order', value: orderedExtension },
          { label: 'Added missing step', value: state.extension.missing || 'Not answered' },
          { label: 'IF/THEN decision', value: state.extension.decision || 'Not answered' }
        ]
      });
    }

    sections.push({
      title: 'Plenary - First CS Exit Ticket',
      answers: [
        { label: '1. What is an algorithm?', value: state.plenary.algorithm || 'Not answered' },
        { label: '2. Why does sequence matter?', value: state.plenary.sequence || 'Not answered' },
        { label: '3. Classroom expectation', value: state.plenary.expectation || 'Not answered' },
        { label: '4. Improvement for next lesson', value: state.plenary.improve || 'Not answered' },
        { label: 'Challenge definition', value: state.plenary.challenge || 'Not attempted' }
      ]
    });

    return {
      title: 'Year 7 Week 1 Theory - Thinking Like a Computer Scientist',
      learner: state.profile.name,
      className: state.profile.className,
      date: new Date().toLocaleString(),
      sections
    };
  }

  function orderToText(items, orderObject) {
    const entries = items
      .map(item => ({ text: item.text, order: Number(orderObject[item.id]) }))
      .filter(item => Number.isFinite(item.order) && item.order > 0)
      .sort((a, b) => a.order - b.order);
    if (!entries.length) return 'Not answered';
    return entries.map((item, index) => `${index + 1}. ${item.text}`).join(' ');
  }

  function renderReportPreview() {
    const data = reportData();
    const container = $('#reportPreview');
    container.innerHTML = `
      <h3>${escapeHtml(data.title)}</h3>
      <p><strong>Name:</strong> ${escapeHtml(data.learner)} · <strong>Class:</strong> ${escapeHtml(data.className)} · <strong>Exported:</strong> ${escapeHtml(data.date)}</p>
      ${data.sections.map(section => `
        <h3>${escapeHtml(section.title)}</h3>
        <dl>${section.answers.map(answer => `<dt>${escapeHtml(answer.label)}</dt><dd>${escapeHtml(answer.value)}</dd>`).join('')}</dl>
      `).join('')}
      <h3>Submission instruction</h3>
      <p>Upload this PDF into the Microsoft Teams Assignment named <strong>Week 1 Theory</strong>.</p>
    `;
    container.classList.remove('hidden');
  }

  function buildPdfLines() {
    const data = reportData();
    const lines = [];
    lines.push(data.title);
    lines.push('');
    lines.push(`Name: ${data.learner}`);
    lines.push(`Class: ${data.className}`);
    lines.push(`Exported: ${data.date}`);
    lines.push('');
    lines.push('WAGBA: Explain how precise instructions form an algorithm and demonstrate safe, organised and independent KS3 Computer Science routines.');
    lines.push('');
    data.sections.forEach(section => {
      lines.push(section.title.toUpperCase());
      section.answers.forEach(answer => {
        lines.push(`${answer.label}:`);
        lines.push(answer.value || 'Not answered');
        lines.push('');
      });
    });
    lines.push('SUBMISSION INSTRUCTION');
    lines.push('Upload this PDF into the Microsoft Teams Assignment named Week 1 Theory.');
    return lines;
  }

  function exportPdf() {
    if (!coreComplete() && !state.profile.teacherMode) {
      $('#exportMessage').textContent = 'Complete Starter, Main Task 1, Main Task 2 and Plenary before exporting.';
      return;
    }
    try {
      const lines = buildPdfLines();
      const filename = `${sanitizeFilename(state.profile.className)}_${sanitizeFilename(state.profile.name)}_Week_1_Theory.pdf`;
      const blob = createSimplePdf(lines);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      $('#exportMessage').textContent = `PDF downloaded as ${filename}. Upload it to Teams: Week 1 Theory.`;
    } catch (error) {
      console.error(error);
      $('#exportMessage').textContent = 'The PDF could not be generated. Ask your teacher for help.';
    }
  }

  function createSimplePdf(rawLines) {
    const pageWidth = 595;
    const pageHeight = 842;
    const left = 48;
    const top = 792;
    const lineHeight = 15;
    const maxChars = 88;
    const maxLines = 48;
    const wrapped = [];

    rawLines.forEach(line => {
      const cleaned = toPdfAscii(String(line));
      if (!cleaned) {
        wrapped.push('');
        return;
      }
      wrapText(cleaned, maxChars).forEach(part => wrapped.push(part));
    });

    const pages = [];
    for (let i = 0; i < wrapped.length; i += maxLines) pages.push(wrapped.slice(i, i + maxLines));
    if (!pages.length) pages.push(['No responses recorded.']);

    const objects = [];
    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

    const kids = [];
    pages.forEach((pageLines, pageIndex) => {
      const pageObj = 4 + pageIndex * 2;
      const contentObj = pageObj + 1;
      kids.push(`${pageObj} 0 R`);
      objects[pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObj} 0 R >>`;
      const content = [];
      content.push('BT');
      content.push('/F1 10 Tf');
      content.push(`${left} ${top} Td`);
      pageLines.forEach((line, index) => {
        if (index > 0) content.push(`0 -${lineHeight} Td`);
        content.push(`(${escapePdfText(line)}) Tj`);
      });
      content.push('ET');
      const stream = content.join('\n');
      objects[contentObj] = `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`;
    });
    objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;

    let pdf = '%PDF-1.4\n%PDFGEN\n';
    const offsets = [0];
    for (let i = 1; i < objects.length; i += 1) {
      offsets[i] = byteLength(pdf);
      pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
    }
    const xrefOffset = byteLength(pdf);
    pdf += `xref\n0 ${objects.length}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i < objects.length; i += 1) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new Blob([binaryStringToUint8Array(pdf)], { type: 'application/pdf' });
  }

  function wrapText(text, maxChars) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';
    words.forEach(word => {
      if (!current) current = word;
      else if (`${current} ${word}`.length <= maxChars) current += ` ${word}`;
      else {
        lines.push(current);
        current = word;
      }
    });
    if (current) lines.push(current);
    return lines.length ? lines : [''];
  }

  function toPdfAscii(text) {
    return text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[–—]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^\x20-\x7E]/g, '?');
  }

  function escapePdfText(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function byteLength(text) {
    return new TextEncoder().encode(text).length;
  }

  function binaryStringToUint8Array(text) {
    return new TextEncoder().encode(text);
  }

  function sanitizeFilename(value) {
    return String(value || 'Student').trim().replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'Student';
  }

  function fillSampleResponses() {
    state.starter.answers = { game: 'Computer Science', presentation: 'Digital creativity', python: 'Computer Science', traffic: 'Both' };
    state.starter.checked = true;
    state.starter.score = 4;
    state.starter.challenge = 'Changing the sequence can change the output because the computer follows each instruction exactly in the order given.';
    state.main1.algorithm = ['F','F','F','F','R','F','F','F','F','P','S'];
    state.main1.reflection = 'I tested each step and added Pick up object and Stop after reaching the star.';
    state.main2.sequence = { bread: '1', spread: '2', filling: '3', plate: '4', cut: '5' };
    state.main2.sequenceSwap = 'The sandwich could be cut before it is complete, making the remaining steps difficult.';
    state.main2.scratchShape = 'A square';
    state.main2.scratchInput = 'Clicking the green flag';
    state.main2.scratchOutput = 'The sprite moves and draws a square';
    state.main2.scratchRepeat = 'The repeat block';
    state.main2.scratchImprovement = 'Increase the move distance to make a larger square.';
    state.main2.ipoPress = 'Input';
    state.main2.ipoCapture = 'Process';
    state.main2.ipoPhoto = 'Output';
    state.main2.ipoExample = 'Keyboard key = input, program calculation = process, text on screen = output.';
    state.main2.safety1 = 'Block or report the account and tell a trusted adult';
    state.main2.safety2 = 'Leave it unchanged and tell the teacher';
    state.main2.challenge = 'Planning and testing helps us find the exact part that needs support.';
    state.plenary.algorithm = 'An algorithm is an ordered set of precise instructions used to complete a task or solve a problem.';
    state.plenary.sequence = 'Sequence matters because changing the order can change the result.';
    state.plenary.expectation = 'Read the instructions, test carefully and treat errors as evidence.';
    state.plenary.improve = 'I will explain my debugging changes more clearly.';
    state.plenary.challenge = 'An algorithm is a precise sequence of instructions that produces an output.';
    state.unlockedAll = true;
    saveState();
    restoreFormValues();
    testAlgorithm();
    $('#teacherDialog').close();
  }

  function resetCurrentSession() {
    if (!confirm('Reset all answers in this teacher test session?')) return;
    const profile = { ...state.profile };
    state = cloneDefault();
    state.profile = profile;
    state.unlockedAll = true;
    localStorage.removeItem(currentStorageKey);
    saveState();
    location.reload();
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function cssEscape(value) {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return String(value).replace(/["\\]/g, '\\$&');
  }

  function init() {
    renderStarterCards();
    renderDynamicImages();
    renderOrderTask('sequenceOrderTask', SEQUENCE_ITEMS, 'main2');
    renderOrderTask('extensionOrderTask', EXTENSION_ITEMS, 'extension');
    renderCommands();
    renderAlgorithmList();
    renderRobotGrid();
    bindFormPersistence();

    $('#teacherModeInput').addEventListener('change', () => {
      if ($('#teacherModeInput').checked) {
        if (!$('#studentName').value.trim()) $('#studentName').value = 'Teacher Test';
        if (!$('#studentClass').value.trim()) $('#studentClass').value = 'TEST';
      }
    });

    $('#profileForm').addEventListener('submit', event => {
      event.preventDefault();
      const teacherMode = $('#teacherModeInput').checked;
      const profile = {
        name: teacherMode && !$('#studentName').value.trim() ? 'Teacher Test' : $('#studentName').value.trim(),
        className: teacherMode && !$('#studentClass').value.trim() ? 'TEST' : $('#studentClass').value.trim(),
        teacherMode
      };
      if (!profile.name || !profile.className) return;
      setProfile(profile);
    });

    const params = new URLSearchParams(location.search);
    if (params.get('teacher') === '1') {
      $('#teacherModeInput').checked = true;
      $('#studentName').value = 'Teacher Test';
      $('#studentClass').value = 'TEST';
    }

    $('#changeLearnerBtn').addEventListener('click', () => {
      $('#studentName').value = state.profile.name || '';
      $('#studentClass').value = state.profile.className || '';
      $('#teacherModeInput').checked = Boolean(state.profile.teacherMode);
      $('#profileOverlay').classList.remove('hidden');
    });

    $('#checkStarterBtn').addEventListener('click', checkStarter);
    $('#undoCommandBtn').addEventListener('click', () => {
      state.main1.algorithm.pop();
      state.main1.tested = false;
      state.main1.testResult = '';
      state.main1.success = false;
      state.main1.lastPath = [];
      delete state.main1.lastRobot;
      saveState();
      renderAlgorithmList();
      renderRobotGrid();
      updateRobotFeedback();
    });
    $('#clearCommandsBtn').addEventListener('click', () => {
      state.main1.algorithm = [];
      state.main1.tested = false;
      state.main1.testResult = '';
      state.main1.success = false;
      state.main1.lastPath = [];
      delete state.main1.lastRobot;
      saveState();
      renderAlgorithmList();
      renderRobotGrid();
      updateRobotFeedback();
    });
    $('#testAlgorithmBtn').addEventListener('click', testAlgorithm);

    $$('.next-section').forEach(button => button.addEventListener('click', () => {
      const current = button.closest('.lesson-section').dataset.section;
      const message = validateBeforeNext(current);
      if (message && !state.profile.teacherMode && !state.unlockedAll) {
        alert(message);
        return;
      }
      showSection(button.dataset.next, true);
    }));

    $('#previewReportBtn').addEventListener('click', renderReportPreview);
    $('#exportPdfBtn').addEventListener('click', exportPdf);
    $('#teacherPanelBtn').addEventListener('click', () => $('#teacherDialog').showModal());
    $('#fillSampleBtn').addEventListener('click', fillSampleResponses);
    $('#unlockAllBtn').addEventListener('click', () => {
      state.unlockedAll = true;
      saveState();
      $('#teacherDialog').close();
    });
    $('#resetSessionBtn').addEventListener('click', resetCurrentSession);

    refreshUI();
  }

  init();
})();
