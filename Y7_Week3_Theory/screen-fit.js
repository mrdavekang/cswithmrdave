/* Automatic, capability-based screen fitting. Local display preferences only.
 * This module never re-renders the lesson or changes a student's answers.
 * Viewport measurements decide layout; a best-effort device suggestion is only
 * used on the new-lesson form for the separate PDF / Teams instructions.
 */
(function (root) {
  'use strict';
  const doc = document, html = doc.documentElement;
  const KEY = 'tta.y7.w3.screenfit.v1';
  const SCALES = [1, 1.15, 1.3, 1.5, 1.75, 2];
  let prefs = { scale: 1, reading: false };
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (stored) prefs = { scale: SCALES.includes(stored.scale) ? stored.scale : 1, reading: stored.reading === true };
  } catch (_) { /* Private / managed browsing: keep the in-memory defaults. */ }
  let frame = 0, mounted = [], returnFocus = null, snapshot = {}, focusTimer = 0;
  let lastWidth = 0, restingHeight = 0, wasKeyboard = false;
  const query = text => root.matchMedia ? root.matchMedia(text) : { matches: false };
  const touchQuery = query('(any-pointer: coarse)');
  const smallHeightQuery = query('(max-height: 520px)');
  const resizeObserver = root.ResizeObserver ? new ResizeObserver(schedule) : null;

  function label(en, zh, ko) {
    const lang = root.App?.state?.lang || doc.getElementById('entry-lang')?.value || 'en';
    return en + (lang === 'zh' && zh ? ' / ' + zh : lang === 'ko' && ko ? ' / ' + ko : '');
  }
  function store() {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (_) { /* No loss of lesson work. */ }
  }
  function css(name, value) { if (html.style.getPropertyValue(name) !== value) html.style.setProperty(name, value); }
  function text(id, value) { const el = doc.getElementById(id); if (el && el.textContent !== value) el.textContent = value; }
  function editable(el) {
    return !!el?.matches?.('textarea, input:not([type=button]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), [contenteditable=true]');
  }
  function guessDevice() {
    const ua = navigator.userAgent || '', platform = navigator.platform || '';
    // Modern iPadOS can identify as a Mac. This suggestion never sets layout.
    if (/iPad/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1)) return 'ipad';
    if (/Android/i.test(ua)) return 'android';
    if (/CrOS/i.test(ua)) return 'chromebook';
    if (/Windows/i.test(ua)) return 'windows';
    if (/Mac/i.test(ua + platform)) return 'mac';
    return '';
  }
  function guessBrowser() {
    const ua = navigator.userAgent || '';
    if (/Edg(?:e|A|iOS)?\//i.test(ua)) return 'Edge';
    if (/Chrome|CriOS/i.test(ua)) return 'Chrome';
    if (/Safari/i.test(ua) && !/FxiOS/i.test(ua)) return 'Safari';
    return 'Other';
  }
  function suggestSavingRoute() {
    const el = doc.getElementById('entry-device');
    if (!el || el.dataset.screenSuggested) return;
    el.dataset.screenSuggested = 'true';
    const guess = guessDevice();
    if (!el.value && guess) {
      el.value = guess;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      const browser = doc.getElementById('entry-browser'), value = guessBrowser();
      if (browser && Array.from(browser.options).some(o => o.value === value)) browser.value = value;
      text('device-suggestion', 'Suggested from this browser. Check or change it for the PDF saving guide. Screen fitting is automatic either way.');
    } else {
      text('device-suggestion', 'Choose the device for your PDF saving guide. Screen fitting works automatically, even before you choose.');
    }
  }
  function decorateTables() {
    doc.querySelectorAll('#main .table-wrap table').forEach(table => {
      if (table.dataset.fitCards) return;
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
      if (!headers.length) return;
      table.dataset.fitCards = 'true';
      table.setAttribute('role', 'table');
      table.querySelectorAll('thead,tbody').forEach(e => e.setAttribute('role', 'rowgroup'));
      table.querySelectorAll('tr').forEach(e => e.setAttribute('role', 'row'));
      table.querySelectorAll('th').forEach(e => e.setAttribute('role', 'columnheader'));
      table.querySelectorAll('tbody tr').forEach(row => Array.from(row.children).forEach((cell, i) => {
        cell.dataset.column = headers[i] || '';
        cell.setAttribute('role', 'cell');
      }));
    });
  }
  function stagePicker() {
    const nav = doc.querySelector('.stage-nav');
    if (!nav || doc.querySelector('.screen-stage-picker')) return;
    const container = doc.createElement('div');
    container.className = 'screen-stage-picker';
    const lab = doc.createElement('label');
    lab.htmlFor = 'screen-stage-select';
    lab.textContent = label('Lesson stage', '课程阶段', '학습 단계');
    const select = doc.createElement('select');
    select.id = 'screen-stage-select';
    nav.querySelectorAll('button').forEach(b => {
      const option = new Option(b.textContent, b.dataset.index);
      option.selected = b.getAttribute('aria-current') === 'step';
      select.add(option);
    });
    select.addEventListener('change', () => {
      const index = select.value;
      // Reuse the lesson's existing gating; do not create a bypass.
      nav.querySelector('button[data-index="' + index + '"]')?.click();
      const active = doc.querySelector('.stage-nav [aria-current=step]');
      if (select.isConnected && active) select.value = active.dataset.index;
    });
    container.append(lab, select);
    nav.before(container);
  }
  function fitLabs(font, height) {
    doc.querySelectorAll('.python-lab').forEach(lab => {
      const width = lab.getBoundingClientRect().width;
      // Check the workspace itself, not just the device. This also handles
      // comparison cards, expanded editors, browser zoom and larger text.
      lab.dataset.panes = !prefs.reading && width >= font * 52 ? 'side-by-side' : 'stacked';
      const lines = (lab.querySelector('[data-ide-code]')?.value || '').split('\n').length;
      const preferred = (Math.max(7, lines + 1) * 1.7 + 1.3) * font;
      const cap = Math.max(160, Math.min(font * 23, height * .42));
      lab.style.setProperty('--editor-fit-height', Math.round(Math.min(preferred, cap)) + 'px');
    });
    doc.querySelectorAll('#app .grid-two').forEach(grid => {
      const width = grid.getBoundingClientRect().width;
      const minimum = grid.closest('.landing-form') ? 24 : 44;
      grid.dataset.fitColumns = !prefs.reading && width >= font * minimum ? 'two' : 'one';
    });
  }
  function preparePreview(dialog) {
    const scroller = dialog?.querySelector('.report-preview-scroll');
    if (!scroller || scroller.dataset.fitReady) return;
    scroller.dataset.fitReady = 'true';
    scroller.dataset.preview = 'fit';
    const controls = doc.createElement('div');
    controls.className = 'screen-preview-controls';
    controls.innerHTML = '<span>Page view</span><button type="button" data-screen-preview="fit" aria-pressed="true">Fit width</button><button type="button" data-screen-preview="actual" aria-pressed="false">Actual size</button><small>Preview only. The saved PDF stays A4.</small>';
    scroller.before(controls);
    Array.from(scroller.querySelectorAll('.report-sheet')).forEach(page => {
      const frame = doc.createElement('div'); frame.className = 'screen-report-frame';
      page.before(frame); frame.append(page);
    });
    if (resizeObserver) { resizeObserver.observe(scroller); dialog.addEventListener('close', () => resizeObserver.unobserve(scroller), { once: true }); }
  }
  function fitPreviews() {
    doc.querySelectorAll('.report-preview-scroll[data-fit-ready]').forEach(scroller => {
      const scale = scroller.dataset.preview === 'actual' ? 1 : Math.min(1, scroller.clientWidth / 794);
      scroller.querySelectorAll('.screen-report-frame').forEach(frame => {
        frame.style.setProperty('--page-scale', String(scale));
        frame.style.width = (794 * scale) + 'px';
        frame.style.height = (1123 * scale) + 'px';
      });
    });
  }
  function measure() {
    frame = 0;
    css('--reading-scale', String(prefs.scale));
    const width = html.clientWidth || root.innerWidth;
    const layoutHeight = root.innerHeight || html.clientHeight;
    const vv = root.visualViewport;
    // Pinch zoom must remain genuine magnification, not trigger zoom-out reflow.
    const unzoomed = !vv || Math.abs(vv.scale - 1) < .08;
    const visibleHeight = vv && unzoomed ? Math.min(layoutHeight, vv.height) : layoutHeight;
    const visibleTop = vv && unzoomed ? Math.max(0, vv.offsetTop) : 0;
    const focus = doc.activeElement, editing = editable(focus);
    if (Math.abs(width - lastWidth) > 40) { restingHeight = layoutHeight; lastWidth = width; }
    if (!editing) restingHeight = Math.max(restingHeight, layoutHeight, visibleHeight);
    const viewportLoss = Math.max(layoutHeight - visibleHeight, restingHeight - visibleHeight);
    const touch = touchQuery.matches || navigator.maxTouchPoints > 0;
    const keyboard = touch && unzoomed && editing && viewportLoss > Math.max(130, restingHeight * .23);
    html.dataset.touch = touch ? 'true' : 'false';
    const font = parseFloat(getComputedStyle(html).fontSize) || 17;
    const compact = width < font * 38;
    const wide = !prefs.reading && !compact && width >= font * 74 && layoutHeight >= font * 29;
    const layout = compact ? 'compact' : wide ? 'wide' : 'medium';
    html.dataset.layout = layout;
    html.dataset.reading = prefs.reading ? 'true' : 'false';
    html.dataset.keyboard = keyboard ? 'true' : 'false';
    html.dataset.short = visibleHeight < Math.max(430, font * 27) ? 'true' : 'false';
    css('--visible-height', Math.round(visibleHeight) + 'px');
    css('--visible-top', Math.round(visibleTop) + 'px');
    css('--layout-height', Math.round(layoutHeight) + 'px');
    fitLabs(font, visibleHeight); fitPreviews();
    const names = { wide: 'Wide workspace', medium: 'Comfortable single-column layout', compact: 'Compact single-column layout' };
    const viewportLabel = width + ' × ' + Math.round(visibleHeight) + ' CSS px';
    snapshot = { layout, width, height: Math.round(visibleHeight), layoutHeight, touch, keyboard, scale: prefs.scale, fontSize: font, reading: prefs.reading, viewportLabel };
    text('screen-landing-status', 'Auto screen fit · ' + names[layout]);
    text('screen-current-layout', names[layout]);
    text('screen-current-size', viewportLabel + (touch ? ' · touch-friendly controls' : ''));
    text('screen-scale-value', Math.round(prefs.scale * 100) + '%');
    const minus = doc.querySelector('[data-screen-action="smaller"]'), plus = doc.querySelector('[data-screen-action="larger"]');
    if (minus) minus.disabled = prefs.scale === SCALES[0];
    if (plus) plus.disabled = prefs.scale === SCALES.at(-1);
    const reading = doc.getElementById('screen-reading');
    if (reading && reading.checked !== prefs.reading) reading.checked = prefs.reading;
    // Only help focus once the software keyboard actually reduces visible space.
    // A resize never replaces the editor or discards code, answers or playback.
    if (keyboard && !wasKeyboard && focus?.isConnected) {
      setTimeout(() => {
        if (doc.activeElement !== focus) return;
        const rect = focus.getBoundingClientRect();
        if (rect.top < visibleTop || rect.bottom > visibleTop + visibleHeight - 12) focus.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      }, 60);
    }
    wasKeyboard = keyboard;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
  function mount() {
    suggestSavingRoute(); stagePicker(); decorateTables();
    if (resizeObserver) {
      // Removed stages must not retain observers or editor nodes.
      mounted.filter(el => !el.isConnected).forEach(el => resizeObserver.unobserve(el));
      mounted = mounted.filter(el => el.isConnected);
      doc.querySelectorAll('.python-lab, #app .grid-two').forEach(el => {
        if (!mounted.includes(el)) { resizeObserver.observe(el); mounted.push(el); }
      });
    }
    measure();
  }
  function mountDialog(dialog) { preparePreview(dialog); schedule(); }
  function closeDisplay() { doc.getElementById('screen-display-dialog')?.close(); }
  function openDisplay(trigger) {
    if (doc.getElementById('screen-display-dialog')) return;
    returnFocus = trigger;
    const d = doc.createElement('dialog'); d.id = 'screen-display-dialog'; d.className = 'screen-display-dialog';
    d.setAttribute('aria-labelledby', 'screen-display-title');
    d.innerHTML = '<div class="modal-head"><h2 id="screen-display-title">' + label('Make it comfortable', '舒适阅读', '편하게 읽기') + '</h2><button type="button" data-screen-action="close" aria-label="Close display settings">Close ✕</button></div>' +
      '<p>' + label('The page already fits your window automatically. These optional settings stay on this browser.', '页面会自动适应窗口。以下可选设置保存在本浏览器。', '페이지는 창 크기에 자동으로 맞춰집니다. 아래 설정은 이 브라우저에 저장됩니다.') + '</p>' +
      '<div class="screen-status-card"><strong id="screen-current-layout"></strong><small id="screen-current-size"></small></div>' +
      '<section class="screen-text-settings"><h3>' + label('Text size', '文字大小', '글자 크기') + '</h3><div class="screen-size-buttons"><button type="button" data-screen-action="smaller" aria-label="Smaller text">A−</button><output id="screen-scale-value" aria-live="polite"></output><button type="button" data-screen-action="larger" aria-label="Larger text">A+</button></div><p class="hint">The smallest setting is the comfortable default. Browser zoom and pinch zoom remain available.</p></section>' +
      '<label class="checkrow"><input id="screen-reading" type="checkbox"><span>' + label('Keep a single-column reading layout', '保持单栏阅读布局', '한 열 읽기 화면 유지') + '<small class="sub">Optional: place code above the drawing, even on a wide screen.</small></span></label>' +
      '<div class="button-row"><button type="button" data-screen-action="reset">Reset display settings</button><button type="button" class="primary" data-screen-action="close">Done</button></div>' +
      '<p class="hint">These controls do not change your work, your PDF layout or your device’s Teams saving guide. No screen information is sent to a server.</p>';
    doc.body.append(d);
    d.addEventListener('close', () => { d.remove(); if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
    d.showModal(); measure();
  }
  doc.addEventListener('click', ev => {
    const b = ev.target.closest('[data-screen-action]');
    if (b) {
      const action = b.dataset.screenAction;
      if (action === 'open') openDisplay(b);
      if (action === 'close') closeDisplay();
      if (action === 'larger' || action === 'smaller') {
        const index = SCALES.indexOf(prefs.scale) + (action === 'larger' ? 1 : -1);
        prefs.scale = SCALES[Math.max(0, Math.min(SCALES.length - 1, index))]; store(); measure();
      }
      if (action === 'reset') { prefs = { scale: 1, reading: false }; store(); measure(); }
    }
    const preview = ev.target.closest('[data-screen-preview]');
    if (preview) {
      const scroller = preview.closest('dialog')?.querySelector('.report-preview-scroll');
      if (scroller) {
        scroller.dataset.preview = preview.dataset.screenPreview;
        preview.parentElement.querySelectorAll('button').forEach(btn => btn.setAttribute('aria-pressed', String(btn === preview)));
        fitPreviews();
      }
    }
  });
  doc.addEventListener('change', ev => {
    if (ev.target.id === 'screen-reading') { prefs.reading = ev.target.checked; store(); measure(); }
    if (ev.target.id === 'entry-lang') schedule();
  });
  doc.addEventListener('input', ev => { if (ev.target.matches('[data-ide-code]')) schedule(); });
  doc.addEventListener('focusin', () => { clearTimeout(focusTimer); schedule(); focusTimer = setTimeout(schedule, 400); });
  doc.addEventListener('focusout', () => { clearTimeout(focusTimer); focusTimer = setTimeout(schedule, 400); });
  root.addEventListener('resize', schedule, { passive: true });
  root.addEventListener('orientationchange', () => { restingHeight = 0; lastWidth = 0; schedule(); setTimeout(schedule, 300); }, { passive: true });
  root.addEventListener('pageshow', schedule);
  if (root.visualViewport) { root.visualViewport.addEventListener('resize', schedule, { passive: true }); root.visualViewport.addEventListener('scroll', schedule, { passive: true }); }
  [touchQuery, smallHeightQuery].forEach(q => { if (q.addEventListener) q.addEventListener('change', schedule); else if (q.addListener) q.addListener(schedule); });
  root.ScreenFit = { mount, mountDialog, refresh: schedule, get state() { return { ...snapshot }; } };
  html.style.setProperty('--reading-scale', String(prefs.scale));
})(window);
