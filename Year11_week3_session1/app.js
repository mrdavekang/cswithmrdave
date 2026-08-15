(() => {
  'use strict';

  const STORAGE_KEY = 'y11-w3s1-network-topologies-v1';
  const STAGES = ['overview', 'starter', 'learn', 'main1', 'main2', 'extension', 'plenary', 'report'];
  const CORE_STAGES = ['overview', 'starter', 'learn', 'main1', 'main2', 'plenary'];
  const defaultState = {
    student: { name: '', className: '' },
    fields: {},
    selfMarks: {},
    completed: {},
    scores: {},
    flags: {},
    canvases: { star: [], bus: [] }
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
    selfMarks: { ...(saved.selfMarks || {}) },
    completed: { ...(saved.completed || {}) },
    scores: { ...(saved.scores || {}) },
    flags: { ...(saved.flags || {}) },
    canvases: { ...defaultState.canvases, ...(saved.canvases || {}) }
  };

  let teacherMode = false;
  let currentStage = 'overview';
  let saveTimer;
  const pads = {};

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const value = key => state.fields[key] ?? '';
  const isFilled = key => String(value(key)).trim().length > 0;

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const status = $('#saveStatus');
    if (status) status.textContent = 'Saved locally';
  }

  function scheduleSave() {
    const status = $('#saveStatus');
    if (status) status.textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 250);
  }

  function toast(message) {
    const box = $('#toast');
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(box._timer);
    box._timer = setTimeout(() => box.classList.remove('show'), 2800);
  }

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function fieldValue(element) {
    if (element.type === 'checkbox') return element.checked;
    if (element.type === 'radio') return element.checked ? element.value : state.fields[element.dataset.save];
    return element.value;
  }

  function restoreFields() {
    $$('[data-save]').forEach(element => {
      const stored = state.fields[element.dataset.save];
      if (stored === undefined) return;
      if (element.type === 'checkbox') element.checked = Boolean(stored);
      else if (element.type === 'radio') element.checked = stored === element.value;
      else element.value = stored;
    });
    $$('[data-selfmark]').forEach(button => {
      const stored = state.selfMarks[button.dataset.selfmark];
      button.classList.toggle('selected', String(stored) === button.dataset.value);
    });
  }

  function bindAutosave() {
    $$('[data-save]').forEach(element => {
      const eventName = element.tagName === 'SELECT' || ['checkbox', 'radio'].includes(element.type) ? 'change' : 'input';
      element.addEventListener(eventName, () => {
        if (element.type === 'radio' && !element.checked) return;
        state.fields[element.dataset.save] = fieldValue(element);
        scheduleSave();
      });
    });
  }

  function canOpen(stage) {
    if (teacherMode || stage === 'overview') return true;
    if (stage === 'starter') return Boolean(state.completed.overview);
    if (stage === 'learn') return Boolean(state.completed.starter);
    if (stage === 'main1') return Boolean(state.completed.learn);
    if (stage === 'main2') return Boolean(state.completed.main1);
    if (stage === 'extension' || stage === 'plenary') return Boolean(state.completed.main2);
    if (stage === 'report') return Boolean(state.completed.plenary);
    return false;
  }

  function updateNavigation() {
    $$('[data-nav]').forEach(button => {
      const stage = button.dataset.nav;
      button.classList.toggle('active', stage === currentStage);
      button.classList.toggle('locked', !canOpen(stage));
      button.classList.toggle('complete', Boolean(state.completed[stage]));
      button.setAttribute('aria-current', stage === currentStage ? 'page' : 'false');
      button.setAttribute('aria-disabled', canOpen(stage) ? 'false' : 'true');
    });
    const completed = CORE_STAGES.filter(stage => state.completed[stage]).length;
    const percentage = Math.round((completed / CORE_STAGES.length) * 100);
    $('#progressBar').style.width = `${percentage}%`;
    $('#progressLabel').textContent = `${percentage}% complete`;
  }

  function goTo(stage) {
    if (!STAGES.includes(stage)) return;
    if (!canOpen(stage)) {
      toast('Complete the earlier section before opening this page.');
      return;
    }
    currentStage = stage;
    $$('.lesson-stage').forEach(section => {
      const active = section.dataset.stage === stage;
      section.hidden = !active;
      section.classList.toggle('active', active);
    });
    updateNavigation();
    history.replaceState(null, '', `#${stage}`);
    const target = $(`#${stage}`);
    target.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (stage === 'report') buildReport();
  }

  function complete(stage, next) {
    state.completed[stage] = true;
    persist();
    updateNavigation();
    if (next) goTo(next);
  }

  function startApp(name, className) {
    teacherMode = name.trim().toLowerCase() === 'teacher';
    state.student.name = name.trim();
    state.student.className = teacherMode ? (className.trim() || 'Teacher review') : className.trim();
    document.body.classList.toggle('teacher-mode', teacherMode);
    $('#landing').hidden = true;
    $('#navStudentName').textContent = teacherMode ? 'Teacher review' : state.student.name;
    $('#navStudentClass').textContent = state.student.className;
    if (teacherMode) {
      $('#teacherConsole').hidden = false;
      $$('.answer-panel,.self-mark').forEach(element => element.hidden = false);
      ['#scenarioReview', '#extensionMarking', '#diagramCheck'].forEach(selector => {
        const element = $(selector); if (element) element.hidden = false;
      });
    }
    persist();
    updateNavigation();
    goTo('overview');
  }

  function requireFields(keys, message = 'Complete every response before continuing.') {
    const missing = keys.some(key => !isFilled(key));
    if (missing && !teacherMode) { toast(message); return false; }
    return true;
  }

  function revealQuestionGroup(prefix) {
    $$(`[data-question^="${prefix}"]`).forEach(card => {
      $('.answer-panel', card).hidden = false;
      $('.self-mark', card).hidden = false;
    });
  }

  function selfMarkScore(prefix) {
    const ids = Object.keys(state.selfMarks).filter(key => key.startsWith(prefix));
    return ids.reduce((sum, key) => sum + Number(state.selfMarks[key] || 0), 0);
  }

  function updateStarterScore() {
    const marked = ['starter1','starter2','starter3','starter4','starter5'].filter(key => state.selfMarks[key] !== undefined).length;
    const score = selfMarkScore('starter');
    state.scores.starter = score;
    $('#starterScore').textContent = marked ? `${score} / 5` : 'Not marked';
    $('#starterCorrection').hidden = !marked || score === 5;
    $('#finishStarter').hidden = marked < 5;
  }

  function updatePlenaryScore() {
    const marked = ['plenary1','plenary2','plenary3'].filter(key => state.selfMarks[key] !== undefined).length;
    const score = selfMarkScore('plenary');
    state.scores.plenary = score;
    $('#plenaryScore').textContent = marked ? `${score} / 3` : 'Not marked';
    $('#plenaryCorrection').hidden = !marked || score === 3;
    $('#finishPlenary').hidden = marked < 3;
  }

  function setupSelfMarking() {
    $$('[data-selfmark]').forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.selfmark;
      state.selfMarks[id] = Number(button.dataset.value);
      $$(`[data-selfmark="${id}"]`).forEach(item => item.classList.toggle('selected', item === button));
      if (id.startsWith('starter')) updateStarterScore();
      if (id.startsWith('plenary')) updatePlenaryScore();
      scheduleSave();
    }));
  }

  function setupStarter() {
    $('#checkStarter').addEventListener('click', () => {
      if (!requireFields(['starter.q1','starter.q2','starter.q3','starter.q4','starter.q5'])) return;
      state.flags.starterRevealed = true;
      revealQuestionGroup('starter');
      $('#checkStarter').hidden = true;
      updateStarterScore();
      persist();
    });
    $('#finishStarter').addEventListener('click', () => {
      const allMarked = ['starter1','starter2','starter3','starter4','starter5'].every(key => state.selfMarks[key] !== undefined);
      if (!allMarked && !teacherMode) return toast('Self-mark all five questions first.');
      if (selfMarkScore('starter') < 5 && !isFilled('starter.correction') && !teacherMode) return toast('Repair one missing mark before continuing.');
      complete('starter', 'learn');
    });
  }

  function setupLearn() {
    $('#checkLearn').addEventListener('click', () => {
      const selects = $$('[data-answer]', $('#learnCheck'));
      if (selects.some(select => !select.value) && !teacherMode) return toast('Answer all three checkpoint questions first.');
      let score = 0;
      selects.forEach(select => {
        const correct = select.value === select.dataset.answer;
        if (correct) score += 1;
        select.closest('label').classList.toggle('correct', correct);
        select.closest('label').classList.toggle('incorrect', !correct);
      });
      state.scores.learn = score;
      state.flags.learnChecked = true;
      const feedback = $('#learnFeedback');
      feedback.hidden = false;
      feedback.className = `feedback-box ${score === 3 ? 'good' : 'warn'}`;
      feedback.innerHTML = score === 3
        ? '<strong>3 / 3</strong><p>Your structural knowledge is ready for comparison.</p>'
        : `<strong>${score} / 3</strong><p>Review the highlighted item. Remember: star depends on a central switch; bus terminators absorb signals and prevent reflections.</p>`;
      $('#finishLearn').hidden = false;
      persist();
    });
    $('#finishLearn').addEventListener('click', () => complete('learn', 'main1'));
  }

  function setupClassification() {
    $('#checkClassification').addEventListener('click', () => {
      const selects = $$('[data-classify]');
      if (selects.some(select => !select.value) && !teacherMode) return toast('Classify all six statements first.');
      let score = 0;
      selects.forEach(select => {
        const correct = select.value === select.dataset.answer;
        if (correct) score += 1;
        select.closest('label').classList.toggle('correct', correct);
        select.closest('label').classList.toggle('incorrect', !correct);
      });
      state.scores.main1Class = score;
      state.flags.classificationChecked = true;
      $('#classificationScore').textContent = `${score} / 6`;
      const feedback = $('#classificationFeedback');
      feedback.hidden = false;
      feedback.className = `feedback-box ${score === 6 ? 'good' : 'warn'}`;
      feedback.innerHTML = score === 6
        ? '<strong>All six correct.</strong><p>You are distinguishing structure from consequences accurately.</p>'
        : `<strong>${score} / 6</strong><p>Correct the orange item(s), then use the fault-causing component as your clue.</p>`;
      persist();
    });
    $('#revealDiagramCheck').addEventListener('click', () => {
      state.flags.diagramCheckShown = true;
      $('#diagramCheck').hidden = false;
      $('#revealDiagramCheck').hidden = true;
      persist();
    });
    $('#finishMain1').addEventListener('click', () => {
      if (!state.flags.classificationChecked && !teacherMode) return toast('Check the six comparison statements first.');
      const starEvidence = (state.canvases.star || []).length || isFilled('main1.starDescription');
      const busEvidence = (state.canvases.bus || []).length || isFilled('main1.busDescription');
      if ((!starEvidence || !busEvidence) && !teacherMode) return toast('Draw or describe both topologies before continuing.');
      const checked = ['main1.d1','main1.d2','main1.d3','main1.d4'].every(key => value(key) === true);
      if (!checked && !teacherMode) return toast('Use the four-point diagram checklist before continuing.');
      complete('main1', 'main2');
    });
  }

  function drawGrid(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e7e7e7'; ctx.lineWidth = 1;
    for (let x = 30; x < canvas.width; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
    for (let y = 30; y < canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
  }

  function redrawPad(name) {
    const pad = pads[name];
    drawGrid(pad.ctx, pad.canvas);
    pad.ctx.strokeStyle = '#111'; pad.ctx.lineWidth = 4; pad.ctx.lineCap = 'round'; pad.ctx.lineJoin = 'round';
    pad.strokes.forEach(stroke => {
      if (!stroke.length) return;
      pad.ctx.beginPath(); pad.ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach(point => pad.ctx.lineTo(point.x, point.y));
      pad.ctx.stroke();
    });
  }

  function setupPad(name, canvasId) {
    const canvas = $(`#${canvasId}`);
    const pad = { canvas, ctx: canvas.getContext('2d'), strokes: state.canvases[name] || [], current: null };
    pads[name] = pad;
    const point = event => {
      const rect = canvas.getBoundingClientRect();
      return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
    };
    canvas.addEventListener('pointerdown', event => {
      canvas.setPointerCapture(event.pointerId);
      pad.current = [point(event)]; pad.strokes.push(pad.current); redrawPad(name);
    });
    canvas.addEventListener('pointermove', event => {
      if (!pad.current) return;
      pad.current.push(point(event)); redrawPad(name);
    });
    const finish = () => {
      if (!pad.current) return;
      pad.current = null; state.canvases[name] = pad.strokes; scheduleSave();
    };
    canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);
    redrawPad(name);
  }

  function setupDrawing() {
    setupPad('star', 'starCanvas'); setupPad('bus', 'busCanvas');
    $$('[data-undo]').forEach(button => button.addEventListener('click', () => {
      const name = button.dataset.undo; pads[name].strokes.pop(); state.canvases[name] = pads[name].strokes; redrawPad(name); scheduleSave();
    }));
    $$('[data-clear]').forEach(button => button.addEventListener('click', () => {
      const name = button.dataset.clear; pads[name].strokes = []; state.canvases[name] = []; redrawPad(name); scheduleSave();
    }));
  }

  function setupMain2() {
    const responseKeys = ['main2.choice','main2.requirement','main2.property','main2.consequence','main2.decision','main2.tradeoff'];
    $('#commitScenario').addEventListener('click', () => {
      if (!requireFields(responseKeys, 'Complete all six parts of the scenario response first.')) return;
      state.flags.scenarioCommitted = true;
      $('#scenarioReview').hidden = false;
      $('#scenarioReview').scrollIntoView({ behavior: 'smooth', block: 'start' });
      persist();
    });
    $('#finishMain2').addEventListener('click', () => {
      if (!state.flags.scenarioCommitted && !teacherMode) return toast('Commit your scenario response and self-check it first.');
      if (value('main2.reviewed') !== true && !teacherMode) return toast('Confirm that you reviewed and improved your response.');
      const checks = ['main2.r1','main2.r2','main2.r3','main2.r4','main2.r5'].filter(key => value(key) === true).length;
      if (checks < 5 && !isFilled('main2.reclaim') && !teacherMode) return toast('Use the reclaim box to strengthen one missing feature.');
      state.scores.main2 = checks;
      complete('main2', 'plenary');
      toast('Main Activity 2 saved. The optional extension is now unlocked.');
    });
  }

  function setupExtension() {
    $('#markExtension').addEventListener('click', () => {
      if (!isFilled('extension.response') && !teacherMode) return toast('Write your independent response before viewing the guidance.');
      state.flags.extensionMarked = true;
      $('#extensionMarking').hidden = false;
      persist();
    });
    $('#finishExtension').addEventListener('click', () => {
      state.scores.extension = ['extension.m1','extension.m2','extension.m3','extension.m4','extension.m5','extension.m6'].filter(key => value(key) === true).length;
      state.completed.extension = true;
      persist(); updateNavigation(); toast('Extension evidence saved.');
    });
  }

  function setupPlenary() {
    $('#checkPlenary').addEventListener('click', () => {
      if (!requireFields(['plenary.q1','plenary.q2','plenary.q3','plenary.wagba'])) return;
      state.flags.plenaryRevealed = true;
      revealQuestionGroup('plenary');
      $('#checkPlenary').hidden = true;
      updatePlenaryScore();
      persist();
    });
    $('#finishPlenary').addEventListener('click', () => {
      const allMarked = ['plenary1','plenary2','plenary3'].every(key => state.selfMarks[key] !== undefined);
      if (!allMarked && !teacherMode) return toast('Self-mark all three plenary questions first.');
      if (selfMarkScore('plenary') < 3 && !isFilled('plenary.correction') && !teacherMode) return toast('Complete the final repair before exporting.');
      complete('plenary', 'report');
      buildReport();
    });
  }

  function reportResponse(label, key) {
    const text = value(key) || 'No response recorded.';
    return `<div class="report-response"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(text)}</p></div>`;
  }

  function buildReport() {
    if (!pads.star || !pads.bus) return;
    const starImage = pads.star.canvas.toDataURL('image/png');
    const busImage = pads.bus.canvas.toDataURL('image/png');
    const extensionIncluded = isFilled('extension.response');
    const main2Checks = ['main2.r1','main2.r2','main2.r3','main2.r4','main2.r5'].filter(key => value(key) === true).length;
    const extensionScore = ['extension.m1','extension.m2','extension.m3','extension.m4','extension.m5','extension.m6'].filter(key => value(key) === true).length;
    const report = $('#reportDocument');
    report.innerHTML = `
      <header>
        <p class="kicker">YEAR 11 COMPUTER SCIENCE · TERM 1 WEEK 3 SESSION 1</p>
        <h1>Network Topologies Evidence Report</h1>
        <p>WAGBA: Explaining and comparing star and bus topologies, then applying their trade-offs to a network scenario.</p>
      </header>
      <div class="report-meta">
        <div><strong>Name</strong><br>${escapeHtml(state.student.name)}</div>
        <div><strong>Class</strong><br>${escapeHtml(state.student.className)}</div>
        <div><strong>Date</strong><br>${new Date().toLocaleDateString('en-GB')}</div>
      </div>
      <div class="report-scores">
        <div><strong>Starter</strong><br>${state.scores.starter ?? 0} / 5</div>
        <div><strong>Knowledge check</strong><br>${state.scores.learn ?? 0} / 3</div>
        <div><strong>Comparison</strong><br>${state.scores.main1Class ?? 0} / 6</div>
        <div><strong>Scenario features</strong><br>${main2Checks} / 5</div>
        <div><strong>Extension</strong><br>${extensionIncluded ? `${extensionScore} / 6` : 'Not attempted'}</div>
        <div><strong>Plenary</strong><br>${state.scores.plenary ?? 0} / 3</div>
      </div>
      <p><em>These scores record guided practice and self-marking; they are not a final assessment grade.</em></p>
      <h2>1. Prerequisite retrieval and repair</h2>
      ${reportResponse('LAN meaning', 'starter.q1')}${reportResponse('LAN characteristics', 'starter.q2')}${reportResponse('LAN device', 'starter.q3')}${reportResponse('Fibre signal', 'starter.q4')}${reportResponse('Fibre over distance', 'starter.q5')}${reportResponse('Starter correction', 'starter.correction')}
      <h2>2. Topology diagram evidence</h2>
      <div class="report-drawings"><div><strong>Star topology</strong><img src="${starImage}" alt="Student star topology drawing"></div><div><strong>Bus topology</strong><img src="${busImage}" alt="Student bus topology drawing"></div></div>
      ${reportResponse('Star diagram description', 'main1.starDescription')}${reportResponse('Bus diagram description', 'main1.busDescription')}
      <h2>3. Science exhibition application</h2>
      ${reportResponse('Chosen topology', 'main2.choice')}${reportResponse('Important requirement', 'main2.requirement')}${reportResponse('Relevant property', 'main2.property')}${reportResponse('Consequence', 'main2.consequence')}${reportResponse('Decision', 'main2.decision')}${reportResponse('Trade-off', 'main2.tradeoff')}${reportResponse('Reclaimed or strengthened mark', 'main2.reclaim')}
      ${extensionIncluded ? `<h2>4. Extension: e-sports championship</h2>${reportResponse('Independent response', 'extension.response')}${reportResponse('Reclaimed mark', 'extension.reclaim')}` : ''}
      <h2>${extensionIncluded ? '5' : '4'}. Exit evidence</h2>
      ${reportResponse('Defining connection difference', 'plenary.q1')}${reportResponse('Purpose of terminators', 'plenary.q2')}${reportResponse('Switch failure', 'plenary.q3')}${reportResponse('WAGBA evidence', 'plenary.wagba')}${reportResponse('Final correction', 'plenary.correction')}
    `;
  }

  function setupReport() {
    $('#buildReport').addEventListener('click', () => { buildReport(); toast('Evidence report refreshed.'); });
    $('#printReport').addEventListener('click', () => {
      buildReport();
      const previousTitle = document.title;
      const safeName = (state.student.name || 'Student').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
      document.title = `W3S1_Topologies_${safeName}`;
      window.addEventListener('afterprint', () => { document.title = previousTitle; }, { once: true });
      window.print();
    });
    $('#topExport').addEventListener('click', () => {
      if (!canOpen('report')) return toast('Complete the plenary before building your evidence report.');
      goTo('report');
    });
    $('#resetProgress').addEventListener('click', () => {
      if (!confirm('Reset every response, score and drawing saved in this browser?')) return;
      localStorage.removeItem(STORAGE_KEY); location.reload();
    });
  }

  function restoreReveals() {
    if (state.flags.starterRevealed || teacherMode) { revealQuestionGroup('starter'); $('#checkStarter').hidden = true; }
    if (state.flags.learnChecked) { $('#finishLearn').hidden = false; }
    if (state.flags.diagramCheckShown || teacherMode) { $('#diagramCheck').hidden = false; $('#revealDiagramCheck').hidden = true; }
    if (state.flags.scenarioCommitted || teacherMode) $('#scenarioReview').hidden = false;
    if (state.flags.extensionMarked || teacherMode) $('#extensionMarking').hidden = false;
    if (state.flags.plenaryRevealed || teacherMode) { revealQuestionGroup('plenary'); $('#checkPlenary').hidden = true; }
    if (state.scores.main1Class !== undefined) $('#classificationScore').textContent = `${state.scores.main1Class} / 6`;
    updateStarterScore(); updatePlenaryScore();
  }

  function setupNavigation() {
    $$('[data-nav],[data-go]').forEach(element => element.addEventListener('click', event => {
      event.preventDefault(); goTo(element.dataset.nav || element.dataset.go);
    }));
    $$('[data-complete]').forEach(button => button.addEventListener('click', () => complete(button.dataset.complete, button.dataset.next)));
    $('#changeStudent').addEventListener('click', () => {
      $('#studentName').value = state.student.name;
      $('#studentClass').value = teacherMode ? '' : state.student.className;
      $('#landing').hidden = false;
      $('#studentName').focus();
    });
  }

  function init() {
    $('#studentName').value = state.student.name;
    $('#studentClass').value = state.student.className;
    $('#entryForm').noValidate = true;
    $('#entryForm').addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#studentName').value.trim();
      const className = $('#studentClass').value.trim();
      if (!name) return toast('Enter your name to begin.');
      if (name.toLowerCase() !== 'teacher' && !className) return toast('Enter your class to begin.');
      startApp(name, className);
    });
    restoreFields(); bindAutosave(); setupNavigation(); setupSelfMarking(); setupStarter(); setupLearn(); setupClassification(); setupDrawing(); setupMain2(); setupExtension(); setupPlenary(); setupReport();
    if (state.student.name) {
      $('#studentName').value = state.student.name;
      $('#studentClass').value = state.student.className;
    }
    restoreReveals(); updateNavigation();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
