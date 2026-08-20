(() => {
  'use strict';

  const STORAGE_KEY = 'y10-w3s1-algorithms-v1';
  const STAGES = ['overview', 'starter', 'main1', 'main2', 'extension', 'plenary', 'report'];
  const CORE_STAGES = ['overview', 'starter', 'main1', 'main2', 'plenary'];
  const STAGE_LABELS = {
    overview: 'Overview', starter: 'Starter', main1: 'Main Activity 1', main2: 'Main Activity 2',
    extension: 'Extension', plenary: 'Plenary', report: 'Evidence report'
  };
  const defaultState = {
    student: { name: '', className: '' },
    fields: {},
    completed: {},
    flags: {},
    scores: {},
    evidence: [],
    current: 'overview'
  };

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  })();
  const state = {
    ...defaultState,
    ...saved,
    student: { ...defaultState.student, ...(saved.student || {}) },
    fields: { ...(saved.fields || {}) },
    completed: { ...(saved.completed || {}) },
    flags: { ...(saved.flags || {}) },
    scores: { ...(saved.scores || {}) },
    evidence: Array.isArray(saved.evidence) ? saved.evidence : []
  };

  let teacherMode = false;
  let currentStage = STAGES.includes(state.current) ? state.current : 'overview';
  let saveTimer;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const value = key => state.fields[key] ?? '';
  const filled = key => String(value(key)).trim().length > 0;

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast('Browser storage is full. Export your report, then remove an older screenshot.');
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 220);
  }

  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(element._timer);
    element._timer = setTimeout(() => element.classList.remove('show'), 3000);
  }

  function restoreFields() {
    $$('[data-save]').forEach(element => {
      const stored = state.fields[element.dataset.save];
      if (stored === undefined) return;
      if (element.type === 'checkbox') element.checked = Boolean(stored);
      else element.value = stored;
    });
  }

  function bindAutosave() {
    $$('[data-save]').forEach(element => {
      const eventName = ['SELECT', 'INPUT'].includes(element.tagName) && element.type !== 'text' ? 'change' : 'input';
      element.addEventListener(eventName, () => {
        state.fields[element.dataset.save] = element.type === 'checkbox' ? element.checked : element.value;
        scheduleSave();
      });
      if (eventName !== 'change') {
        element.addEventListener('change', () => {
          state.fields[element.dataset.save] = element.type === 'checkbox' ? element.checked : element.value;
          scheduleSave();
        });
      }
    });
  }

  function isAllowed(stage) {
    if (teacherMode || stage === 'overview' || stage === 'report') return true;
    if (stage === 'starter') return Boolean(state.completed.overview);
    if (stage === 'main1') return Boolean(state.completed.starter);
    if (stage === 'main2') return Boolean(state.completed.main1);
    if (stage === 'extension' || stage === 'plenary') return Boolean(state.completed.main2);
    return false;
  }

  function updateRoute() {
    $$('[data-nav]').forEach(button => {
      const stage = button.dataset.nav;
      const allowed = isAllowed(stage);
      button.classList.toggle('locked', !allowed);
      button.classList.toggle('active', stage === currentStage);
      button.classList.toggle('complete', Boolean(state.completed[stage]));
      button.toggleAttribute('aria-current', stage === currentStage);
      button.disabled = !allowed && !teacherMode;
    });
  }

  function updateProgress() {
    const done = CORE_STAGES.filter(stage => state.completed[stage]).length;
    const percent = Math.round(done / CORE_STAGES.length * 100);
    $('#progressLabel').textContent = `${percent}% complete`;
    $('#progressBar').style.width = `${percent}%`;
  }

  function closeRoute() {
    $('#routePanel').hidden = true;
    $('#routeToggle').setAttribute('aria-expanded', 'false');
  }

  function go(stage, force = false) {
    if (!STAGES.includes(stage)) return;
    if (!force && !isAllowed(stage)) return toast('Complete the previous core activity first.');
    currentStage = stage;
    state.current = stage;
    $$('.stage').forEach(section => {
      const active = section.dataset.stage === stage;
      section.hidden = !active;
      section.classList.toggle('active', active);
    });
    $('#currentStageLabel').textContent = STAGE_LABELS[stage];
    if (stage === 'report') buildReport();
    updateRoute();
    closeRoute();
    persist();
    const target = $(`#${stage}`);
    target.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function complete(stage, next) {
    state.completed[stage] = true;
    persist();
    updateProgress();
    updateRoute();
    go(next, true);
  }

  function requireFields(keys, message) {
    const missing = keys.some(key => !filled(key));
    if (missing && !teacherMode) {
      toast(message);
      return false;
    }
    return true;
  }

  function applyIdentity() {
    teacherMode = state.student.name.trim().toLowerCase() === 'teacher';
    document.body.classList.toggle('teacher-mode', teacherMode);
    $('#routeName').textContent = teacherMode ? 'Teacher review' : (state.student.name || 'Student');
    $('#routeClass').textContent = teacherMode ? 'All sections unlocked' : (state.student.className || 'Class not entered');
    $('#teacherNotice').hidden = !teacherMode;
    if (teacherMode) {
      $$('.teacher-key').forEach(element => element.hidden = false);
      $('#starterFeedback').hidden = false;
      $('#plenaryFeedback').hidden = false;
    }
    updateRoute();
  }

  function setupEntry() {
    $('#studentName').value = state.student.name;
    $('#studentClass').value = teacherMode ? '' : state.student.className;
    $('#entryForm').addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#studentName').value.trim();
      const className = $('#studentClass').value.trim();
      if (!name) return toast('Enter your name to begin.');
      if (name.toLowerCase() !== 'teacher' && !className) return toast('Enter your class to begin.');
      state.student.name = name;
      state.student.className = name.toLowerCase() === 'teacher' ? 'Teacher review' : className;
      $('#landing').hidden = true;
      applyIdentity();
      persist();
      go(teacherMode ? 'overview' : currentStage, true);
    });
    $('#changeStudent').addEventListener('click', () => {
      closeRoute();
      $('#studentName').value = teacherMode ? '' : state.student.name;
      $('#studentClass').value = teacherMode ? '' : state.student.className;
      $('#landing').hidden = false;
      $('#studentName').focus();
    });
  }

  function setupNavigation() {
    $('#routeToggle').addEventListener('click', () => {
      const panel = $('#routePanel');
      panel.hidden = !panel.hidden;
      $('#routeToggle').setAttribute('aria-expanded', String(!panel.hidden));
    });
    $$('[data-nav]').forEach(button => button.addEventListener('click', () => go(button.dataset.nav)));
    $$('[data-go]').forEach(button => button.addEventListener('click', () => go(button.dataset.go)));
    $$('[data-complete]').forEach(button => button.addEventListener('click', () => complete(button.dataset.complete, button.dataset.next)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeRoute(); });
    $('#topExport').addEventListener('click', () => go('report', true));
  }

  async function copyText(id) {
    const text = $(`#${id}`).innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const helper = document.createElement('textarea');
      helper.value = text;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    toast('Code copied. Paste it into your own Python IDE.');
  }

  function setupCopyButtons() {
    $$('[data-copy]').forEach(button => button.addEventListener('click', () => copyText(button.dataset.copy)));
  }

  function setupStarter() {
    $('#checkStarter').addEventListener('click', () => {
      const required = ['starter.prediction', 'starter.roleInput', 'starter.roleProcessing', 'starter.roleOutput', 'starter.swap', 'starter.priceReason'];
      if (!requireFields(required, 'Answer all four starter questions before checking.')) return;
      state.flags.starterChecked = true;
      $('#starterFeedback').hidden = false;
      persist();
      $('#starterFeedback').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#finishStarter').addEventListener('click', () => {
      if (!state.flags.starterChecked && !teacherMode) return toast('Check your starter answers first.');
      const checks = ['starter.check1', 'starter.check2', 'starter.check3'].every(key => value(key) === true);
      if (!checks && !teacherMode) return toast('Use the worked feedback and confirm all three corrections.');
      complete('starter', 'main1');
    });
  }

  const main1Facts = {
    'main1.factName': 'input', 'main1.factLaps': 'input', 'main1.factRate': 'input',
    'main1.factShoes': 'not-needed', 'main1.factWeather': 'not-needed', 'main1.factSubject': 'not-needed',
    'main1.factTotal': 'output'
  };
  const main1Sequence = {
    'main1.seqDisplay': '5', 'main1.seqLaps': '2', 'main1.seqCalculate': '4', 'main1.seqName': '1', 'main1.seqRate': '3'
  };

  function markChoice(key, correct) {
    const element = $(`[data-save="${key}"]`);
    element.classList.toggle('correct-choice', correct);
    element.classList.toggle('incorrect-choice', !correct);
  }

  function setupMain1() {
    $('#checkMain1').addEventListener('click', () => {
      const keys = [...Object.keys(main1Facts), ...Object.keys(main1Sequence), 'main1.abstractionReason', 'main1.decomposeInput', 'main1.decomposeProcess', 'main1.decomposeOutput'];
      if (!requireFields(keys, 'Complete every part of the algorithm clinic before checking.')) return;
      let score = 0;
      Object.entries(main1Facts).forEach(([key, answer]) => {
        const correct = value(key) === answer;
        if (correct) score += 1;
        markChoice(key, correct);
      });
      Object.entries(main1Sequence).forEach(([key, answer]) => {
        const correct = value(key) === answer;
        if (correct) score += 1;
        markChoice(key, correct);
      });
      state.scores.main1 = score;
      state.flags.main1Checked = true;
      const feedback = $('#main1Feedback');
      feedback.hidden = false;
      feedback.classList.toggle('warn', score < 12);
      feedback.innerHTML = score === 12
        ? '<strong>12 / 12 structural decisions correct.</strong><p>Your abstraction and sequence are ready to implement.</p>'
        : `<strong>${score} / 12 structural decisions correct.</strong><p>Review the amber choices. The required order is name → laps → rate → calculate → display.</p>`;
      persist();
    });
    $('#finishMain1').addEventListener('click', () => {
      if (!state.flags.main1Checked && !teacherMode) return toast('Check your analysis before continuing.');
      if (!requireFields(['main1.abstractionReason', 'main1.decomposeInput', 'main1.decomposeProcess', 'main1.decomposeOutput'], 'Complete your abstraction and decomposition explanations.')) return;
      complete('main1', 'main2');
    });
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxEdge = 1400;
          const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          const context = canvas.getContext('2d');
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve({ name: file.name, dataUrl: canvas.toDataURL('image/jpeg', .82) });
        };
        image.onerror = reject;
        image.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderEvidence() {
    const container = $('#evidencePreview');
    container.innerHTML = '';
    state.evidence.forEach((item, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'evidence-item';
      wrapper.innerHTML = `<img src="${item.dataUrl}" alt="Uploaded IDE evidence ${index + 1}"><div><span>${escapeHtml(item.name)}</span><button type="button" data-remove-evidence="${index}">Remove</button></div>`;
      container.appendChild(wrapper);
    });
    $$('[data-remove-evidence]', container).forEach(button => button.addEventListener('click', () => {
      state.evidence.splice(Number(button.dataset.removeEvidence), 1);
      renderEvidence();
      persist();
    }));
  }

  function setupEvidence() {
    $('#evidenceUpload').addEventListener('change', async event => {
      const remaining = 6 - state.evidence.length;
      const files = [...event.target.files].slice(0, Math.max(0, remaining));
      if (!files.length) return toast('You can attach up to six evidence images.');
      toast('Preparing your evidence images…');
      for (const file of files) {
        try { state.evidence.push(await readImage(file)); }
        catch { toast(`Could not read ${file.name}. Try a PNG or JPEG screenshot.`); }
      }
      event.target.value = '';
      renderEvidence();
      persist();
      toast('Evidence saved locally.');
    });
  }

  function setupMain2() {
    $('#finishMain2').addEventListener('click', () => {
      const plan = ['main2.planInput', 'main2.planProcess', 'main2.planOutput', 'main2.reflection'];
      const tests = [
        'main2.test1Expected', 'main2.test1Actual', 'main2.test1Result',
        'main2.test2Expected', 'main2.test2Actual', 'main2.test2Result',
        'main2.test3Expected', 'main2.test3Actual', 'main2.test3Result'
      ];
      if (!requireFields([...plan, ...tests], 'Complete your plan, test table and reflection before continuing.')) return;
      if (!filled('main2.code') && state.evidence.length === 0 && !teacherMode) return toast('Paste your code or attach at least one IDE screenshot.');
      if ((value('main2.confirmRun') !== true || value('main2.confirmTests') !== true) && !teacherMode) return toast('Confirm that you ran and tested the program in your own IDE.');
      complete('main2', 'extension');
    });
  }

  function setupExtension() {
    $('#skipExtension').addEventListener('click', () => {
      state.flags.extensionSkipped = true;
      persist();
      go('plenary', true);
    });
    $('#finishExtension').addEventListener('click', () => {
      const challenge1 = ['extension.structure', 'extension.variables', 'extension.code', 'extension.deliveryCode', 'extension.feeReason'];
      const challenge2 = ['extension.readingPlan', 'extension.readingCode', 'extension.readingTest'];
      const challenge3 = ['extension.recyclingAbstract', 'extension.recyclingPlan', 'extension.recyclingCode', 'extension.recyclingTest'];
      const completedChallenge = [challenge1, challenge2, challenge3].some(group => group.every(filled));
      if (!completedChallenge && !teacherMode) return toast('Complete every step in at least one extension challenge, or choose Skip for now.');
      state.flags.extensionSkipped = false;
      complete('extension', 'plenary');
    });
  }

  function setupPlenary() {
    $('#checkPlenary').addEventListener('click', () => {
      if (!requireFields(['plenary.q1', 'plenary.q2', 'plenary.q3'], 'Answer all three exit-ticket questions first.')) return;
      state.flags.plenaryChecked = true;
      $('#plenaryFeedback').hidden = false;
      persist();
      $('#plenaryFeedback').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#finishPlenary').addEventListener('click', () => {
      if (!state.flags.plenaryChecked && !teacherMode) return toast('Reveal and use the marking guidance first.');
      const marked = ['plenary.mark1', 'plenary.mark2', 'plenary.mark3'].every(key => value(key) === true);
      if (!marked && !teacherMode) return toast('Self-mark all three exit-ticket responses.');
      if (!filled('plenary.confidence') && !teacherMode) return toast('Complete your WAGBA confidence reflection.');
      complete('plenary', 'report');
    });
  }

  function response(label, key, options = {}) {
    const raw = value(key);
    const display = raw === true ? 'Confirmed' : raw === false ? 'Not confirmed' : (String(raw).trim() || 'No response recorded');
    const content = options.code
      ? `<pre>${escapeHtml(display)}</pre>`
      : `<p>${escapeHtml(display)}</p>`;
    return `<div class="report-response"><strong>${escapeHtml(label)}</strong>${content}</div>`;
  }

  function status(stage) {
    return state.completed[stage]
      ? '<span class="report-status">Completed</span>'
      : '<span class="report-status incomplete">Not yet completed</span>';
  }

  function buildReport() {
    const name = teacherMode ? 'Teacher review' : (state.student.name || 'Student');
    const className = teacherMode ? 'Teacher review' : (state.student.className || 'Not entered');
    const safeName = name.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
    const safeClass = className.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
    const filename = `Y10_W3S1_${safeName || 'Student'}_${safeClass || 'Class'}.pdf`;
    $('#suggestedFilename').textContent = filename;

    const factSummary = [
      `Participant name: ${value('main1.factName') || 'No response'}`,
      `Laps: ${value('main1.factLaps') || 'No response'}`,
      `Rate: ${value('main1.factRate') || 'No response'}`,
      `Shoes: ${value('main1.factShoes') || 'No response'}`,
      `Weather: ${value('main1.factWeather') || 'No response'}`,
      `Favourite subject: ${value('main1.factSubject') || 'No response'}`,
      `Total: ${value('main1.factTotal') || 'No response'}`
    ].join('\n');
    const sequenceSummary = [
      `Display=${value('main1.seqDisplay') || '–'}`,
      `Ask laps=${value('main1.seqLaps') || '–'}`,
      `Calculate=${value('main1.seqCalculate') || '–'}`,
      `Ask name=${value('main1.seqName') || '–'}`,
      `Ask rate=${value('main1.seqRate') || '–'}`
    ].join(' · ');
    const testSummary = [
      `Aisha, 5, 2.00 | Expected: ${value('main2.test1Expected') || '–'} | Actual: ${value('main2.test1Actual') || '–'} | ${value('main2.test1Result') || '–'}`,
      `Daniel, 0, 3.50 | Expected: ${value('main2.test2Expected') || '–'} | Actual: ${value('main2.test2Actual') || '–'} | ${value('main2.test2Result') || '–'}`,
      `Mei, 12, 1.25 | Expected: ${value('main2.test3Expected') || '–'} | Actual: ${value('main2.test3Actual') || '–'} | ${value('main2.test3Result') || '–'}`
    ].join('\n');
    const evidence = state.evidence.length
      ? `<div class="report-evidence">${state.evidence.map((item, index) => `<figure><img src="${item.dataUrl}" alt="IDE evidence ${index + 1}"><figcaption>Evidence ${index + 1}: ${escapeHtml(item.name)}</figcaption></figure>`).join('')}</div>`
      : '<p>No screenshot evidence attached.</p>';
    const extensionKeys = [
      'extension.structure', 'extension.variables', 'extension.code', 'extension.deliveryCode', 'extension.feeReason',
      'extension.readingPlan', 'extension.readingCode', 'extension.readingTest',
      'extension.recyclingAbstract', 'extension.recyclingPlan', 'extension.recyclingCode', 'extension.recyclingTest'
    ];
    const extensionAttempted = extensionKeys.some(filled);

    $('#reportPrint').innerHTML = `
      <h1>Year 10 Computer Science Evidence</h1>
      <p><strong>Week 3 Session 1:</strong> Sequence, decomposition and abstraction</p>
      <div class="report-meta">
        <p><strong>Student:</strong> ${escapeHtml(name)}</p>
        <p><strong>Class:</strong> ${escapeHtml(className)}</p>
        <p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
        <p><strong>WAGBA:</strong> Turning a problem into a precise, ordered and manageable solution.</p>
      </div>

      <h2>Starter ${status('starter')}</h2>
      ${response('Predicted output', 'starter.prediction')}
      ${response('Role of input line', 'starter.roleInput')}
      ${response('Role of multiplication', 'starter.roleProcessing')}
      ${response('Role of print line', 'starter.roleOutput')}
      ${response('Effect of swapping the final lines', 'starter.swap')}
      ${response('Why PRICE must be assigned first', 'starter.priceReason')}

      <h2>Main Activity 1 ${status('main1')}</h2>
      <div class="report-response"><strong>Information decisions</strong><pre>${escapeHtml(factSummary)}</pre></div>
      ${response('Abstraction justification', 'main1.abstractionReason')}
      ${response('Decomposed input task', 'main1.decomposeInput')}
      ${response('Decomposed processing task', 'main1.decomposeProcess')}
      ${response('Decomposed output task', 'main1.decomposeOutput')}
      <div class="report-response"><strong>Chosen sequence</strong><p>${escapeHtml(sequenceSummary)}</p></div>
      <p><strong>Structural decision score:</strong> ${escapeHtml(state.scores.main1 ?? 'Not checked')} / 12</p>

      <h2>Main Activity 2 ${status('main2')}</h2>
      ${response('Plan: input', 'main2.planInput')}
      ${response('Plan: processing', 'main2.planProcess')}
      ${response('Plan: output', 'main2.planOutput')}
      ${response('Completed Python code', 'main2.code', { code: true })}
      <div class="report-response"><strong>Test evidence</strong><pre>${escapeHtml(testSummary)}</pre></div>
      ${response('How decomposition helped', 'main2.reflection')}
      ${response('Program run confirmation', 'main2.confirmRun')}
      ${response('Testing confirmation', 'main2.confirmTests')}
      <h3>Uploaded IDE evidence</h3>
      ${evidence}

      <h2>Extension ${extensionAttempted ? status('extension') : '<span class="report-status incomplete">Optional — not attempted</span>'}</h2>
      <h3>Challenge 1: School-shop preorder</h3>
      ${response('Shared underlying structure', 'extension.structure')}
      ${response('Changed variables', 'extension.variables')}
      ${response('School-shop code', 'extension.code', { code: true })}
      ${response('DELIVERY_FEE modification', 'extension.deliveryCode', { code: true })}
      ${response('Position of the fee calculation', 'extension.feeReason')}
      <h3>Challenge 2: Library reading marathon</h3>
      ${response('Input, processing and output plan', 'extension.readingPlan')}
      ${response('Reading-marathon code', 'extension.readingCode', { code: true })}
      ${response('Hana test evidence', 'extension.readingTest')}
      <h3>Challenge 3: Community recycling points</h3>
      ${response('Abstraction justification', 'extension.recyclingAbstract')}
      ${response('Input, processing and output plan', 'extension.recyclingPlan')}
      ${response('Recycling-points code', 'extension.recyclingCode', { code: true })}
      ${response('Cedar House test evidence', 'extension.recyclingTest')}

      <h2>Plenary ${status('plenary')}</h2>
      ${response('AO1: decomposition', 'plenary.q1')}
      ${response('AO2: abstraction', 'plenary.q2')}
      ${response('AO3: reordered algorithm', 'plenary.q3', { code: true })}
      ${response('WAGBA confidence', 'plenary.confidence')}
      ${response('Support still needed', 'plenary.support')}

      <h2>Submission reminder</h2>
      <p>Save this report as <strong>${escapeHtml(filename)}</strong>, attach it to the correct Microsoft Teams assignment, and select <strong>Turn in</strong>.</p>
    `;
  }

  function setupReport() {
    $('#refreshReport').addEventListener('click', () => { buildReport(); toast('Report refreshed.'); });
    $('#printReport').addEventListener('click', () => {
      buildReport();
      const oldTitle = document.title;
      document.title = $('#suggestedFilename').textContent.replace(/\.pdf$/i, '');
      let restored = false;
      const restoreTitle = () => {
        if (restored) return;
        restored = true;
        document.title = oldTitle;
        window.removeEventListener('afterprint', restoreTitle);
      };
      window.addEventListener('afterprint', restoreTitle);
      window.print();
      setTimeout(restoreTitle, 5000);
    });
    $('#clearWork').addEventListener('click', () => {
      if (!window.confirm('Clear all locally saved responses and screenshots for this lesson? This cannot be undone.')) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }

  function restoreReveals() {
    if (state.flags.starterChecked || teacherMode) $('#starterFeedback').hidden = false;
    if (state.flags.main1Checked || teacherMode) {
      $('#main1Feedback').hidden = false;
      const score = state.scores.main1 ?? 0;
      $('#main1Feedback').classList.toggle('warn', score < 12);
      $('#main1Feedback').innerHTML = score === 12
        ? '<strong>12 / 12 structural decisions correct.</strong><p>Your abstraction and sequence are ready to implement.</p>'
        : `<strong>${score} / 12 structural decisions correct.</strong><p>Review the amber choices. The required order is name → laps → rate → calculate → display.</p>`;
    }
    if (state.flags.plenaryChecked || teacherMode) $('#plenaryFeedback').hidden = false;
  }

  function init() {
    restoreFields();
    bindAutosave();
    setupEntry();
    setupNavigation();
    setupCopyButtons();
    setupStarter();
    setupMain1();
    setupEvidence();
    setupMain2();
    setupExtension();
    setupPlenary();
    setupReport();
    renderEvidence();
    applyIdentity();
    restoreReveals();
    updateProgress();
    updateRoute();
    go('overview', true);
    $('#landing').hidden = false;
    $('#studentName').focus();
  }

  init();
})();
