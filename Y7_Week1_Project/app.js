/* =============================================================
   app.js — Year 7 Week 1 project lesson
   State, storage, navigation and all lesson sections.
   Static app: everything is stored in the student's own browser.
   ============================================================= */

(function () {
  'use strict';

  const D = window.LESSON_DATA;
  const CFG = D.CONFIG;
  const L = D.LESSON;

  /* =========================================================
     0. Small DOM helpers
     ========================================================= */
  function h(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k === 'html') n.innerHTML = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else if (v === true) n.setAttribute(k, '');
        else n.setAttribute(k, v);
      });
    }
    (Array.isArray(children) ? children : (children ? [children] : [])).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  const $ = function (sel) { return document.querySelector(sel); };

  function debounce(fn, ms) {
    let t = null;
    return function () {
      const a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms);
    };
  }

  function slug(s) {
    return String(s || '').trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
  }
  function nameToken(s) {
    const first = String(s || 'Student').trim().split(/\s+/)[0];
    return first.replace(/[^A-Za-z0-9]/g, '') || 'Student';
  }
  function classToken(s) {
    return String(s || 'Class').trim().replace(/[^A-Za-z0-9]/g, '') || 'Class';
  }
  function announce(msg) {
    const lr = $('#live-region');
    if (lr) { lr.textContent = ''; setTimeout(function () { lr.textContent = msg; }, 40); }
  }
  function todayString() {
    const d = new Date();
    return String(d.getDate()).padStart(2, '0') + '/' +
           String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  }

  /* =========================================================
     1. Storage — localStorage (answers) + IndexedDB (images)
     ========================================================= */
  const INDEX_KEY = 'y7w1:index';

  const Store = {
    available: (function () {
      try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; }
      catch (e) { return false; }
    })(),
    read: function (key) {
      if (!this.available) return null;
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
      catch (e) { return null; }
    },
    write: function (key, value) {
      if (!this.available) return false;
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    remove: function (key) { if (this.available) localStorage.removeItem(key); },
    index: function () { return this.read(INDEX_KEY) || []; },
    addToIndex: function (entry) {
      const list = this.index().filter(function (e) { return e.key !== entry.key; });
      list.push(entry);
      this.write(INDEX_KEY, list);
    }
  };

  const EvidenceDB = {
    db: null,
    open: function () {
      const self = this;
      if (self.db) return Promise.resolve(self.db);
      return new Promise(function (resolve) {
        if (!('indexedDB' in window)) { resolve(null); return; }
        let req;
        try { req = indexedDB.open('y7w1-evidence', 1); }
        catch (e) { resolve(null); return; }
        req.onupgradeneeded = function () {
          const db = req.result;
          if (!db.objectStoreNames.contains('images')) db.createObjectStore('images', { keyPath: 'id' });
        };
        req.onsuccess = function () { self.db = req.result; resolve(self.db); };
        req.onerror = function () { resolve(null); };
      });
    },
    put: function (id, dataUrl) {
      return this.open().then(function (db) {
        if (!db) { try { sessionStorage.setItem('img:' + id, dataUrl); } catch (e) {} return false; }
        return new Promise(function (resolve) {
          const tx = db.transaction('images', 'readwrite');
          tx.objectStore('images').put({ id: id, data: dataUrl, saved: Date.now() });
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { resolve(false); };
        });
      });
    },
    get: function (id) {
      return this.open().then(function (db) {
        if (!db) { try { return sessionStorage.getItem('img:' + id); } catch (e) { return null; } }
        return new Promise(function (resolve) {
          const tx = db.transaction('images', 'readonly');
          const r = tx.objectStore('images').get(id);
          r.onsuccess = function () { resolve(r.result ? r.result.data : null); };
          r.onerror = function () { resolve(null); };
        });
      });
    },
    del: function (id) {
      return this.open().then(function (db) {
        if (!db) { try { sessionStorage.removeItem('img:' + id); } catch (e) {} return true; }
        return new Promise(function (resolve) {
          const tx = db.transaction('images', 'readwrite');
          tx.objectStore('images').delete(id);
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { resolve(false); };
        });
      });
    },
    all: function (prefix) {
      return this.open().then(function (db) {
        if (!db) return {};
        return new Promise(function (resolve) {
          const out = {};
          const tx = db.transaction('images', 'readonly');
          const cur = tx.objectStore('images').openCursor();
          cur.onsuccess = function (e) {
            const c = e.target.result;
            if (c) {
              if (String(c.value.id).indexOf(prefix) === 0) out[String(c.value.id).slice(prefix.length)] = c.value.data;
              c.continue();
            } else resolve(out);
          };
          cur.onerror = function () { resolve(out); };
        });
      });
    }
  };

  /* =========================================================
     2. Application state
     ========================================================= */
  const state = {
    key: null,
    student: { name: '', className: '', isTeacher: false },
    responses: {},
    ide: {},
    completionCache: {},
    current: 'welcome',
    images: {},          /* slotId -> dataURL (loaded from IndexedDB) */
    started: null
  };

  const ides = {};       /* id -> PythonIDE instance */
  const sketchPads = {};

  function recordKey(name, className, isTeacher) {
    if (isTeacher) return 'y7w1:' + CFG.LESSON_ID + ':__teacher__';
    return 'y7w1:' + CFG.LESSON_ID + ':' + slug(className) + '::' + slug(name);
  }

  const saveNow = function () {
    if (!state.key) return;
    const payload = {
      student: state.student,
      responses: state.responses,
      ide: state.ide,
      current: state.current,
      started: state.started,
      updatedAt: Date.now(),
      lessonId: CFG.LESSON_ID
    };
    const ok = Store.write(state.key, payload);
    Store.addToIndex({
      key: state.key, name: state.student.name, className: state.student.className,
      isTeacher: state.student.isTeacher, updatedAt: Date.now()
    });
    setSaveStatus(ok ? 'saved' : 'error');
  };
  const saveSoon = debounce(function () { saveNow(); }, 500);

  function setSaveStatus(kind) {
    const s = $('#save-status');
    if (!s) return;
    if (kind === 'saving') { s.textContent = 'Saving…'; s.className = 'save-status saving'; }
    else if (kind === 'error') { s.textContent = 'Not saved — storage blocked'; s.className = 'save-status'; }
    else {
      const t = new Date();
      s.textContent = 'Saved ' + String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
      s.className = 'save-status saved';
    }
  }

  function setResponse(id, value) {
    state.responses[id] = value;
    setSaveStatus('saving');
    saveSoon();
    refreshCompletion();
  }
  function resp(id, dflt) {
    return state.responses[id] === undefined ? (dflt === undefined ? '' : dflt) : state.responses[id];
  }

  function imageKey(slot) { return state.key + '::' + slot; }

  function setImage(slot, dataUrl) {
    state.images[slot] = dataUrl;
    EvidenceDB.put(imageKey(slot), dataUrl).then(function () { setSaveStatus('saved'); });
    refreshCompletion();
  }
  function clearImage(slot) {
    delete state.images[slot];
    EvidenceDB.del(imageKey(slot));
    refreshCompletion();
  }
  function hasImage(slot) { return !!state.images[slot]; }

  /* =========================================================
     3. Filenames
     ========================================================= */
  function fileBase() {
    return classToken(state.student.className || 'Class') + '_' + nameToken(state.student.name) + '_W1_';
  }
  const FILENAMES = {
    scratch: function () { return fileBase() + 'ScratchSquare_v01.sb3'; },
    turtle: function () { return fileBase() + 'TurtleSquare_v01.py'; },
    tile: function () { return fileBase() + 'WayfindingTile_v01.py'; },
    tileV2: function () { return fileBase() + 'WayfindingTile_v02.py'; },
    pdf: function () {
      return CFG.YEAR_GROUP + '_' + classToken(state.student.className || 'Class') + '_' +
             nameToken(state.student.name) + '_Week1_Project.pdf';
    }
  };

  /* =========================================================
     4. Answer helpers (shared field builders)
     ========================================================= */
  const MIN = CFG.MIN_ANSWER_LENGTH;

  function answered(id) { return String(resp(id) || '').trim().length >= MIN; }
  function shortAnswered(id, min) { return String(resp(id) || '').trim().length >= (min || 4); }
  function submitted(id) { return resp(id + '__sub') === true; }
  function ticked(id) { return resp(id) === true; }

  /* Written answer */
  function fieldWritten(q) {
    const id = q.id;
    const wrap = h('div', { class: 'q' });
    const lab = h('label', { class: 'q-prompt', for: 'f-' + id, text: q.prompt });
    wrap.appendChild(lab);
    if (q.hint) wrap.appendChild(h('p', { class: 'q-hint', id: 'hint-' + id, text: q.hint }));
    const ta = h('textarea', {
      id: 'f-' + id,
      'aria-describedby': (q.hint ? 'hint-' + id + ' ' : '') + 'st-' + id,
      rows: q.rows || 3
    });
    ta.value = resp(id);
    const status = h('p', { class: 'answer-status', id: 'st-' + id });
    function upd() {
      const len = String(ta.value || '').trim().length;
      status.textContent = len === 0 ? 'Not answered yet.'
        : (len < MIN ? 'Add a little more detail (' + len + ' of ' + MIN + ' characters).' : 'Answer saved.');
      status.style.color = len >= MIN ? 'var(--ok)' : 'var(--grey-mid)';
    }
    ta.addEventListener('input', function () { setResponse(id, ta.value); upd(); });
    upd();
    wrap.appendChild(ta);
    wrap.appendChild(status);
    return wrap;
  }

  /* Short text input (used in tables) */
  function fieldText(id, placeholder, label) {
    const inp = h('input', { type: 'text', placeholder: placeholder || '', 'aria-label': label || placeholder || id });
    inp.value = resp(id);
    inp.addEventListener('input', function () { setResponse(id, inp.value); });
    return inp;
  }

  /* Multiple choice, optionally graded. Feedback only after submitting. */
  function fieldChoice(q) {
    const id = q.id;
    const wrap = h('div', { class: 'q' });
    const fs = h('fieldset', { style: 'border:0;padding:0;margin:0;' });
    fs.appendChild(h('legend', { class: 'q-prompt', text: q.prompt }));
    const opts = h('div', { class: 'options' });
    const inputs = [];

    q.options.forEach(function (text, i) {
      const optId = 'o-' + id + '-' + i;
      const inp = h('input', { type: 'radio', name: 'r-' + id, id: optId, value: String(i) });
      if (resp(id) === i) inp.checked = true;
      inp.addEventListener('change', function () {
        setResponse(id, i);
        clearMarks();
        fb.hidden = true;
        btn.textContent = q.answer === null || q.answer === undefined ? 'Save answer' : 'Check my answer';
      });
      const lab = h('label', { class: 'option', for: optId }, [inp, h('span', { text: text })]);
      inputs.push({ inp: inp, lab: lab, i: i });
      opts.appendChild(lab);
    });
    fs.appendChild(opts);

    const fb = h('p', { class: 'feedback', hidden: true });
    fb.setAttribute('role', 'status');
    const btn = h('button', {
      type: 'button', class: 'btn btn-small',
      text: (q.answer === null || q.answer === undefined) ? 'Save answer' : 'Check my answer'
    });

    function clearMarks() { inputs.forEach(function (o) { o.lab.classList.remove('correct', 'incorrect'); }); }

    function showFeedback() {
      const chosen = resp(id);
      if (chosen === '' || chosen === undefined) {
        fb.hidden = false;
        fb.className = 'feedback err';
        fb.textContent = 'Choose an answer first.';
        return;
      }
      setResponse(id + '__sub', true);
      clearMarks();
      fb.hidden = false;
      if (q.answer === null || q.answer === undefined) {
        fb.className = 'feedback ok';
        fb.textContent = 'Answer saved. Thank you — this is recorded in your report.';
        return;
      }
      const correct = chosen === q.answer;
      inputs[chosen].lab.classList.add(correct ? 'correct' : 'incorrect');
      if (!correct) inputs[q.answer].lab.classList.add('correct');
      fb.className = 'feedback ' + (correct ? 'ok' : 'err');
      fb.textContent = (correct ? 'Correct. ' : 'Not quite. ') + (q.feedback || '');
      setResponse(id + '__correct', correct);
      announce(correct ? 'Correct answer' : 'Not quite — feedback shown');
    }

    btn.addEventListener('click', showFeedback);
    wrap.appendChild(fs);
    wrap.appendChild(btn);
    wrap.appendChild(fb);
    if (submitted(id)) showFeedback();
    return wrap;
  }

  /* Checkbox list */
  function fieldChecklist(items, opts) {
    opts = opts || {};
    const ul = h('ul', { class: 'check-list' });
    items.forEach(function (item) {
      const cid = 'c-' + item.id;
      const inp = h('input', { type: 'checkbox', id: cid });
      inp.checked = ticked(item.id);
      const lab = h('label', { class: 'check' + (inp.checked ? ' done' : ''), for: cid },
        [inp, h('span', { text: item.label })]);
      inp.addEventListener('change', function () {
        setResponse(item.id, inp.checked);
        lab.classList.toggle('done', inp.checked);
        if (opts.onChange) opts.onChange();
      });
      ul.appendChild(h('li', null, lab));
    });
    return ul;
  }

  function singleCheck(id, label) {
    const cid = 'c-' + id;
    const inp = h('input', { type: 'checkbox', id: cid });
    inp.checked = ticked(id);
    const lab = h('label', { class: 'check' + (inp.checked ? ' done' : ''), for: cid },
      [inp, h('span', { text: label })]);
    inp.addEventListener('change', function () {
      setResponse(id, inp.checked);
      lab.classList.toggle('done', inp.checked);
    });
    return lab;
  }

  /* Scratch-style blocks */
  function blockList(blocks) {
    const box = h('div', { class: 'blocks' });
    box.setAttribute('role', 'list');
    box.setAttribute('aria-label', 'Scratch block sequence');
    blocks.forEach(function (b) {
      const parts = String(b.text).split(/(\d+)/);
      const blk = h('div', { class: 'blk blk-' + b.category });
      blk.setAttribute('role', 'listitem');
      parts.forEach(function (p) {
        if (/^\d+$/.test(p)) blk.appendChild(h('span', { class: 'blk-num', text: p }));
        else blk.appendChild(document.createTextNode(p));
      });
      box.appendChild(blk);
    });
    return box;
  }

  function codePanel(code, label) {
    const pre = h('pre', { class: 'code-panel', tabindex: '0' });
    pre.setAttribute('aria-label', label || 'Python code');
    pre.textContent = code;
    return pre;
  }

  /* Evidence slot: upload / paste / preview / replace / delete */
  function evidenceSlot(slot, opts) {
    opts = opts || {};
    const wrap = h('div', { class: 'card card-quiet' });
    wrap.appendChild(h('h4', { text: opts.title || 'Evidence' }));
    if (opts.help) wrap.appendChild(h('p', { class: 'q-hint', text: opts.help }));

    const inputId = 'up-' + slot;
    const input = h('input', {
      type: 'file', accept: 'image/*', id: inputId, class: 'visually-hidden',
      'aria-label': 'Choose an image file for ' + (opts.title || 'evidence')
    });
    const drop = h('div', { class: 'evidence-drop', tabindex: '0', 'aria-label': (opts.title || 'Evidence') + ' upload area' });
    const dropText = h('p', { text: 'Upload a screenshot, drag one here, or click this area and press Ctrl + V to paste.' });
    const btnPick = h('button', { type: 'button', class: 'btn btn-small', text: 'Choose image' });
    drop.appendChild(dropText);
    drop.appendChild(btnPick);

    const preview = h('div', { class: 'evidence-preview' });
    const actions = h('div', { class: 'btn-row' });
    const btnReplace = h('button', { type: 'button', class: 'btn btn-small', text: 'Replace image' });
    const btnDelete = h('button', { type: 'button', class: 'btn btn-small', text: 'Delete image' });
    actions.appendChild(btnReplace); actions.appendChild(btnDelete);

    function render() {
      preview.innerHTML = '';
      if (hasImage(slot)) {
        const img = h('img', { src: state.images[slot], alt: opts.alt || 'Saved evidence image' });
        preview.appendChild(img);
        drop.hidden = true; actions.hidden = false;
      } else {
        preview.appendChild(h('p', { class: 'q-hint', text: 'No image saved yet.' }));
        drop.hidden = false; actions.hidden = true;
      }
    }

    function handleFile(file) {
      if (!file || !/^image\//.test(file.type)) {
        announce('That file is not an image.');
        preview.appendChild(h('p', { class: 'feedback err', text: 'Please choose an image file (PNG or JPG).' }));
        return;
      }
      const r = new FileReader();
      r.onload = function () { setImage(slot, String(r.result)); render(); announce('Evidence image saved.'); };
      r.readAsDataURL(file);
    }

    btnPick.addEventListener('click', function () { input.click(); });
    btnReplace.addEventListener('click', function () { input.click(); });
    btnDelete.addEventListener('click', function () {
      confirmDialog('Delete this image?', 'The image will be removed from your evidence and your PDF.', function () {
        clearImage(slot); render();
      });
    });
    input.addEventListener('change', function (e) { handleFile(e.target.files && e.target.files[0]); e.target.value = ''; });
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('dragover'); });
    drop.addEventListener('drop', function (e) {
      e.preventDefault(); drop.classList.remove('dragover');
      handleFile(e.dataTransfer.files && e.dataTransfer.files[0]);
    });
    drop.addEventListener('paste', function (e) {
      const items = (e.clipboardData && e.clipboardData.items) || [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') === 0) { handleFile(items[i].getAsFile()); e.preventDefault(); return; }
      }
    });

    wrap.appendChild(input);
    wrap.appendChild(drop);
    wrap.appendChild(preview);
    wrap.appendChild(actions);
    render();
    return wrap;
  }

  /* Sketch pad with undo / clear / save + accessible written alternative */
  function sketchPad(slot, textId) {
    const wrap = h('div', { class: 'card card-quiet' });
    wrap.appendChild(h('h4', { text: 'Planning sketch' }));
    wrap.appendChild(h('p', { class: 'q-hint', text: 'Sketch the symbol you plan to draw. Black and white only — this is a plan, not the finished tile.' }));

    const c = h('canvas', { class: 'sketch', width: '600', height: '380' });
    c.setAttribute('aria-label', 'Sketch pad. If you prefer, use the written description box below instead.');
    c.tabIndex = 0;
    const ctx = c.getContext('2d');
    let strokes = [];
    let drawing = false;
    let cur = null;

    function redraw() {
      if (!ctx) return;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      strokes.forEach(function (s) {
        ctx.beginPath();
        s.forEach(function (p, i) { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
        if (s.length === 1) { ctx.arc(s[0].x, s[0].y, 1.5, 0, Math.PI * 2); }
        ctx.stroke();
      });
    }
    function pos(e) {
      const r = c.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: (p.clientX - r.left) * (c.width / r.width), y: (p.clientY - r.top) * (c.height / r.height) };
    }
    function start(e) { e.preventDefault(); drawing = true; cur = [pos(e)]; strokes.push(cur); redraw(); }
    function move(e) { if (!drawing) return; e.preventDefault(); cur.push(pos(e)); redraw(); }
    function end() { if (!drawing) return; drawing = false; cur = null; }

    c.addEventListener('pointerdown', start);
    c.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);

    const row = h('div', { class: 'btn-row' });
    const bUndo = h('button', { type: 'button', class: 'btn btn-small', text: 'Undo' });
    const bClear = h('button', { type: 'button', class: 'btn btn-small', text: 'Clear' });
    const bSave = h('button', { type: 'button', class: 'btn btn-small btn-primary', text: 'Save sketch' });
    const status = h('span', { class: 'answer-status', text: hasImage(slot) ? 'Sketch saved.' : 'Not saved yet.' });
    bUndo.addEventListener('click', function () { strokes.pop(); redraw(); status.textContent = 'Undone — remember to save.'; });
    bClear.addEventListener('click', function () { strokes = []; redraw(); status.textContent = 'Cleared — remember to save.'; });
    bSave.addEventListener('click', function () {
      if (!strokes.length) { status.textContent = 'Draw something first, or use the written description below.'; return; }
      try { setImage(slot, c.toDataURL('image/png')); status.textContent = 'Sketch saved. It will appear in your PDF.'; }
      catch (e) { status.textContent = 'This browser blocked saving the sketch. Use the written description instead.'; }
    });
    row.appendChild(bUndo); row.appendChild(bClear); row.appendChild(bSave); row.appendChild(status);

    /* Restore an earlier sketch as a background if one exists. */
    redraw();
    if (hasImage(slot)) {
      const im = new Image();
      im.onload = function () { if (ctx) ctx.drawImage(im, 0, 0, c.width, c.height); };
      im.src = state.images[slot];
    }

    const holder = h('div', { class: 'sketch-wrap' }, [c, row]);
    wrap.appendChild(holder);
    wrap.appendChild(h('hr', { class: 'divider' }));
    wrap.appendChild(h('p', { class: 'q-hint', text: 'Accessible alternative: if you cannot draw with a mouse or touch screen, describe your planned symbol in words instead. Either the sketch or the description counts as your plan.' }));
    wrap.appendChild(fieldWritten({ id: textId, prompt: 'Written description of your planned symbol', hint: 'For example: a long line to the right, then two short lines back at 135 degrees to make an arrow head.' }));
    sketchPads[slot] = { redraw: redraw };
    return wrap;
  }

  /* =========================================================
     5. Python IDE mounting
     ========================================================= */
  function mountIDE(cfg) {
    const holder = h('div');
    const saved = state.ide[cfg.id] || {};
    const ide = new window.PythonIDE({
      id: cfg.id,
      mount: holder,
      label: cfg.label,
      starterCode: cfg.starterCode,
      initialCode: saved.code !== undefined ? saved.code : cfg.starterCode,
      filename: cfg.filename,
      width: 420, height: 340,
      student: { name: state.student.name, className: state.student.className },
      onCodeChange: function (code) {
        const s = state.ide[cfg.id] || (state.ide[cfg.id] = {});
        if (s.initialCode === undefined) s.initialCode = cfg.starterCode;
        s.code = code;
        setSaveStatus('saving');
        saveSoon();
      },
      onRunResult: function (r) {
        const s = state.ide[cfg.id] || (state.ide[cfg.id] = {});
        s.runs = (s.runs || 0) + 1;
        s.lastOk = r.ok;
        s.lastMessage = r.message;
        s.code = r.code;
        s.hasOutput = !!r.image;
        if (r.image) setImage(cfg.id + '_canvas', r.image);
        saveNow();
        refreshCompletion();
      },
      onEvidence: function (dataUrl) {
        setImage(cfg.evidenceSlot, dataUrl);
        const s = state.ide[cfg.id] || (state.ide[cfg.id] = {});
        s.evidenceAt = Date.now();
        saveNow();
        refreshCompletion();
        showEvidencePreview(cfg.evidenceSlot, dataUrl);
      },
      onDownload: function (fn) {
        const s = state.ide[cfg.id] || (state.ide[cfg.id] = {});
        s.downloaded = fn;
        setResponse(cfg.id + '_downloaded', fn);
      }
    });
    /* restore run counter for display */
    if (saved.runs) { ide.runs = saved.runs; ide.runCountEl.textContent = 'Runs: ' + saved.runs; }
    if (state.images[cfg.id + '_canvas']) ide.lastImage = state.images[cfg.id + '_canvas'];
    ides[cfg.id] = ide;
    setTimeout(function () { ide.refresh(); }, 50);
    return holder;
  }

  function showEvidencePreview(slot, dataUrl) {
    openModal('Evidence captured', function (body, foot) {
      body.appendChild(h('p', { text: 'This image will be included in your PDF report. If it is not clear, close this window, fix your program and capture it again.' }));
      body.appendChild(h('img', { src: dataUrl, alt: 'Captured Python evidence', style: 'max-width:100%;border:1px solid #000;' }));
      const keep = h('button', { type: 'button', class: 'btn btn-primary', text: 'Keep this evidence' });
      const retake = h('button', { type: 'button', class: 'btn', text: 'Delete and retake' });
      keep.addEventListener('click', closeModal);
      retake.addEventListener('click', function () { clearImage(slot); closeModal(); refreshCompletion(); });
      foot.appendChild(retake); foot.appendChild(keep);
    });
  }

  /* =========================================================
     6. Modal helpers
     ========================================================= */
  let lastFocus = null;
  function openModal(title, builder) {
    lastFocus = document.activeElement;
    $('#modal-title').textContent = title;
    const body = $('#modal-body'), foot = $('#modal-foot');
    body.innerHTML = ''; foot.innerHTML = '';
    builder(body, foot);
    $('#modal').hidden = false;
    $('#modal-close').focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    $('#modal').hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function confirmDialog(title, message, onYes) {
    openModal(title, function (body, foot) {
      body.appendChild(h('p', { text: message }));
      const no = h('button', { type: 'button', class: 'btn', text: 'Cancel' });
      const yes = h('button', { type: 'button', class: 'btn btn-primary', text: 'Yes, continue' });
      no.addEventListener('click', closeModal);
      yes.addEventListener('click', function () { closeModal(); onYes(); });
      foot.appendChild(no); foot.appendChild(yes);
    });
  }

  /* =========================================================
     7. Completion rules
     ========================================================= */
  function ideRan(id) { const s = state.ide[id]; return !!(s && s.runs > 0); }
  function ideOutput(id) { return hasImage(id + '_canvas'); }
  function allTicked(list) { return list.every(function (i) { return ticked(i.id); }); }
  function allSubmitted(list) {
    return list.every(function (q) { return q.type === 'written' ? answered(q.id) : submitted(q.id); });
  }

  const RULES = {
    welcome: function () {
      return ticked('welcome_folders_created') && allTicked(D.SETUP_CHECKLIST);
    },
    starter: function () {
      return allSubmitted(D.STARTER_QUESTIONS);
    },
    main1: function () {
      return allTicked(D.MAIN1_SETUP_CHECKLIST) &&
        allSubmitted(D.SCRATCH_PREDICTIONS) &&
        hasImage('ev_scratch') &&
        submitted('m1_ref_prediction') &&
        answered('m1_ref_changed') && answered('m1_ref_happened') && answered('m1_ref_why') &&
        ticked('m1_sb3_downloaded') &&
        allSubmitted(D.PYTHON_PREDICTIONS) &&
        ideRan('m1py') && ideOutput('m1py') &&
        answered('m1_py_explain') &&
        hasImage('ev_python') &&
        answered('m1_compare');
    },
    main2: function () {
      const plan = D.PLANNING_QUESTIONS.every(function (q) { return answered(q.id); });
      const sketch = hasImage('ev_sketch') || answered('m2_plan_describe');
      const tests = ['1', '2'].every(function (n) {
        return shortAnswered('m2_test' + n + '_expected') &&
               shortAnswered('m2_test' + n + '_happened') &&
               shortAnswered('m2_test' + n + '_change');
      });
      const expl = D.EXPLANATION_QUESTIONS.every(function (q) { return answered(q.id); });
      return plan && sketch && tests && expl &&
        ideRan('m2') && ideOutput('m2') && hasImage('ev_wayfinding') &&
        allTicked(D.SUCCESS_CRITERIA);
    },
    extension: function () {
      return !!resp('ext_choice') && ideRan('ext');
    },
    plenary: function () {
      return D.EXIT_TICKET.every(function (q) { return answered(q.id); });
    },
    review: function () { return ticked('review_confirmed'); },
    export: function () { return allTicked(D.SUBMISSION_CHECKLIST); }
  };

  function isComplete(id) {
    try { return !!RULES[id](); } catch (e) { return false; }
  }

  function isUnlocked(id) {
    if (state.student.isTeacher) return true;
    const idx = D.SECTIONS.findIndex(function (s) { return s.id === id; });
    if (idx <= 0) return true;
    for (let i = 0; i < idx; i++) {
      const s = D.SECTIONS[i];
      if (s.optional) continue;
      if (!isComplete(s.id)) return false;
    }
    return true;
  }

  /* Human-readable list of what is still missing in a section. */
  function missingItems(id) {
    const out = [];
    const need = function (cond, text) { if (!cond) out.push(text); };
    if (id === 'welcome') {
      need(ticked('welcome_folders_created'), 'Confirm that you created the project folder.');
      need(allTicked(D.SETUP_CHECKLIST), 'Tick every item on the project routine checklist.');
    }
    if (id === 'starter') {
      D.STARTER_QUESTIONS.forEach(function (q) {
        need(q.type === 'written' ? answered(q.id) : submitted(q.id),
          q.type === 'written' ? 'Write an answer to: ' + q.prompt : 'Submit an answer to: ' + q.prompt);
      });
    }
    if (id === 'main1') {
      need(allTicked(D.MAIN1_SETUP_CHECKLIST), 'Complete the Step 1 file setup checklist.');
      need(allSubmitted(D.SCRATCH_PREDICTIONS), 'Submit all five Scratch predictions.');
      need(hasImage('ev_scratch'), 'Add your Scratch screenshot.');
      need(submitted('m1_ref_prediction') && answered('m1_ref_changed') && answered('m1_ref_happened') && answered('m1_ref_why'),
        'Answer the four Scratch reflection questions.');
      need(ticked('m1_sb3_downloaded'), 'Confirm that you downloaded your .sb3 file.');
      need(allSubmitted(D.PYTHON_PREDICTIONS), 'Submit all five Python predictions.');
      need(ideRan('m1py') && ideOutput('m1py'), 'Run the Python Turtle square so that a drawing appears.');
      need(answered('m1_py_explain'), 'Explain how the Python output changed after your edit.');
      need(hasImage('ev_python'), 'Capture your Python evidence.');
      need(answered('m1_compare'), 'Answer the language comparison question.');
    }
    if (id === 'main2') {
      D.PLANNING_QUESTIONS.forEach(function (q) { need(answered(q.id), 'Answer the planning question: ' + q.prompt); });
      need(hasImage('ev_sketch') || answered('m2_plan_describe'), 'Save a planning sketch or write a description of your symbol.');
      need(ideRan('m2'), 'Run your wayfinding tile program.');
      need(ideOutput('m2'), 'Make sure your program produces a Turtle drawing.');
      need(hasImage('ev_wayfinding'), 'Capture your Python evidence for the tile.');
      D.EXPLANATION_QUESTIONS.forEach(function (q) { need(answered(q.id), 'Answer: ' + q.prompt); });
      need(['1', '2'].every(function (n) {
        return shortAnswered('m2_test' + n + '_expected') && shortAnswered('m2_test' + n + '_happened') &&
               shortAnswered('m2_test' + n + '_change');
      }), 'Complete both rows of the testing record.');
      need(allTicked(D.SUCCESS_CRITERIA), 'Tick every success criterion once it is true.');
    }
    if (id === 'extension') {
      need(!!resp('ext_choice'), 'Choose an extension challenge (optional).');
      need(ideRan('ext'), 'Run your extension program (optional).');
    }
    if (id === 'plenary') {
      D.EXIT_TICKET.forEach(function (q) { need(answered(q.id), 'Complete the exit ticket: ' + q.prompt); });
    }
    if (id === 'review') need(ticked('review_confirmed'), 'Confirm that you have checked your evidence.');
    if (id === 'export') need(allTicked(D.SUBMISSION_CHECKLIST), 'Tick all four submission confirmations.');
    return out;
  }

  /* =========================================================
     8. Navigation and progress
     ========================================================= */
  function buildNav() {
    const nav = $('#section-nav');
    nav.innerHTML = '';
    D.SECTIONS.forEach(function (s) {
      const done = isComplete(s.id);
      const unlocked = isUnlocked(s.id);
      const btn = h('button', {
        type: 'button', class: 'nav-btn', 'data-id': s.id,
        'aria-current': state.current === s.id ? 'true' : 'false'
      });
      btn.appendChild(h('span', { class: 'nav-state', 'aria-hidden': 'true', text: done ? '✔' : (unlocked ? '○' : '🔒') }));
      btn.appendChild(h('span', { text: s.short }));
      btn.appendChild(h('span', { class: 'nav-time', text: s.minutes + 'm' }));
      btn.setAttribute('aria-label', s.title + ', ' + s.minutes + ' minutes, ' +
        (done ? 'complete' : (unlocked ? 'not complete' : 'locked')));
      if (!unlocked) btn.disabled = true;
      btn.addEventListener('click', function () { gotoSection(s.id); });
      nav.appendChild(btn);
    });
  }

  function updateProgress() {
    const core = D.SECTIONS.filter(function (s) { return !s.optional; });
    const done = core.filter(function (s) { return isComplete(s.id); }).length;
    const pct = Math.round((done / core.length) * 100);
    $('#progress-fill').style.width = pct + '%';
    const bar = $('#progress-bar');
    bar.setAttribute('aria-valuenow', String(pct));
    const extDone = isComplete('extension');
    $('#progress-label').textContent = done + ' of ' + core.length + ' core sections complete (' + pct + '%)' +
      (extDone ? ' · extension attempted' : '');
  }

  function refreshCompletion() {
    buildNav();
    updateProgress();
    updateFooter();
  }

  function updateFooter() {
    const idx = D.SECTIONS.findIndex(function (s) { return s.id === state.current; });
    const sec = D.SECTIONS[idx];
    $('#btn-back').disabled = idx <= 0;
    const isLast = idx === D.SECTIONS.length - 1;
    $('#btn-next').textContent = isLast ? 'Finish' : 'Next →';
    const missing = missingItems(state.current);
    const st = $('#footer-status');
    if (isComplete(state.current)) {
      st.textContent = 'Section complete ✔';
      st.style.color = 'var(--ok)';
    } else if (sec && sec.optional) {
      st.textContent = 'Optional section — you may continue at any time.';
      st.style.color = 'var(--grey-mid)';
    } else {
      st.textContent = missing.length ? (missing.length + ' task' + (missing.length > 1 ? 's' : '') + ' still to do') : '';
      st.style.color = 'var(--warn)';
    }
  }

  function gotoSection(id, force) {
    if (!force && !isUnlocked(id)) {
      openModal('Section locked', function (body, foot) {
        body.appendChild(h('p', { text: 'Finish the earlier sections first. This keeps your project in order.' }));
        const ok = h('button', { type: 'button', class: 'btn btn-primary', text: 'Back to my work' });
        ok.addEventListener('click', closeModal);
        foot.appendChild(ok);
      });
      return;
    }
    state.current = id;
    saveSoon();
    renderSection(id);
    buildNav();
    updateProgress();
    updateFooter();
    window.scrollTo({ top: 0, behavior: 'auto' });
    $('#main-content').focus();
    announce('Opened section: ' + D.SECTIONS.find(function (s) { return s.id === id; }).title);
  }

  function nextSection() {
    const idx = D.SECTIONS.findIndex(function (s) { return s.id === state.current; });
    const sec = D.SECTIONS[idx];
    const missing = missingItems(state.current);
    const proceed = function () {
      if (idx < D.SECTIONS.length - 1) gotoSection(D.SECTIONS[idx + 1].id, true);
      else gotoSection('export', true);
    };
    if (state.student.isTeacher || isComplete(state.current) || (sec && sec.optional) || !missing.length) {
      proceed();
      return;
    }
    openModal('Some tasks are not finished', function (body, foot) {
      body.appendChild(h('p', { text: 'You can move on, but these tasks are still incomplete. Incomplete work will be missing from your PDF report:' }));
      const ul = h('ul');
      missing.forEach(function (m) { ul.appendChild(h('li', { text: m })); });
      body.appendChild(ul);
      const stay = h('button', { type: 'button', class: 'btn btn-primary', text: 'Stay and finish' });
      const go = h('button', { type: 'button', class: 'btn', text: 'Continue anyway' });
      stay.addEventListener('click', closeModal);
      go.addEventListener('click', function () { closeModal(); proceed(); });
      foot.appendChild(go); foot.appendChild(stay);
    });
  }

  /* =========================================================
     9. Learning panel
     ========================================================= */
  function buildLearningPanel() {
    const c = $('#lp-content');
    c.innerHTML = '';
    const block = function (title, node) {
      const b = h('div', { class: 'lp-block' });
      b.appendChild(h('h3', { text: title }));
      b.appendChild(node);
      c.appendChild(b);
    };
    const ul = function (items) {
      const u = h('ul');
      items.forEach(function (i) { u.appendChild(h('li', { text: i })); });
      return u;
    };
    block('Key topic', h('p', { text: L.keyTopic, style: 'margin:0;font-weight:600;' }));
    block('WAGBA', h('p', { text: L.wagba, style: 'margin:0;' }));
    block('Knowledge — students will know that', ul(L.knowledge));
    block('Skills — students will be able to', ul(L.skills));
    block('Understanding — students will understand that', ul(L.understanding));
    const kw = h('div', { class: 'keyword-list' });
    L.keywords.forEach(function (k) { kw.appendChild(h('span', { class: 'keyword', text: k })); });
    block('Keywords', kw);
    block('Challenge', h('p', { text: L.challenge, style: 'margin:0;' }));
  }

  /* =========================================================
     10. Section renderers
     ========================================================= */
  function sectionHead(sec) {
    const head = h('div', { class: 'section-head' });
    head.appendChild(h('p', { class: 'eyebrow', text: L.weekLabel + ' · ' + L.unit }));
    head.appendChild(h('h2', { text: sec.title + (D.SECTION_SUBTITLES[sec.id] ? ' — ' + D.SECTION_SUBTITLES[sec.id] : '') }));
    head.appendChild(h('p', { class: 'meta', text: 'Recommended time: ' + sec.minutes + ' minutes' + (sec.optional ? ' · optional — it does not block the plenary' : '') }));
    return head;
  }

  function teamsCallout() {
    const c = h('div', { class: 'callout' });
    c.appendChild(h('h4', { text: 'Microsoft Teams: ' + CFG.TEAMS_ASSIGNMENT_NAME }));
    c.appendChild(h('p', { text: 'You must upload these three files to the Microsoft Teams assignment named "' + CFG.TEAMS_ASSIGNMENT_NAME + '":' }));
    const ul = h('ul');
    L.submissionFiles.forEach(function (f) { ul.appendChild(h('li', { text: f })); });
    c.appendChild(ul);
    return c;
  }

  const RENDER = {};

  /* ---------- Welcome ---------- */
  RENDER.welcome = function (root) {
    const c1 = h('div', { class: 'card' });
    c1.appendChild(h('h3', { text: 'Your project journey' }));
    c1.appendChild(h('p', { text: L.projectDescription }));
    c1.appendChild(h('p', { html: '<strong>Predict → Build → Run → Observe → Modify → Create → Test → Explain → Export</strong>' }));
    root.appendChild(c1);

    const c2 = h('div', { class: 'card' });
    c2.appendChild(h('h3', { text: 'Step 1 — Create your project folder' }));
    c2.appendChild(h('p', { text: 'Before you write any code, create this folder structure in your school documents area:' }));
    c2.appendChild(h('pre', { class: 'folder-tree', tabindex: '0', 'aria-label': 'Required folder structure', text: L.folderStructure }));
    c2.appendChild(singleCheck('welcome_folders_created', 'I have created the folder T1.1 Computational Thinking and Turtle inside Computing ▸ Year 7 ▸ Term 1.'));
    root.appendChild(c2);

    const c3 = h('div', { class: 'card' });
    c3.appendChild(h('h3', { text: 'Step 2 — Your filenames for this lesson' }));
    c3.appendChild(h('p', { text: 'Use these filenames when you save your work. They include your class and name so your teacher can find them.' }));
    const list = h('ul', { class: 'filename-list' });
    [
      { f: FILENAMES.scratch(), d: 'Scratch project' },
      { f: FILENAMES.turtle(), d: 'Python Turtle square' },
      { f: FILENAMES.tile(), d: 'Wayfinding tile' },
      { f: FILENAMES.tileV2(), d: 'Improved version (extension)' }
    ].forEach(function (x) {
      const li = h('li', null, [h('span', { text: x.f }), h('span', { class: 'q-hint', text: x.d })]);
      list.appendChild(li);
    });
    c3.appendChild(list);
    c3.appendChild(h('p', { class: 'q-hint', text: 'v01 means version 1. When you make a big change, save a new version such as v02 instead of overwriting your work.' }));
    root.appendChild(c3);

    const c4 = h('div', { class: 'card' });
    c4.appendChild(h('h3', { text: 'Step 3 — Project routine checklist' }));
    c4.appendChild(h('p', { class: 'q-hint', text: 'Tick each statement once it is true. These answers are saved as evidence.' }));
    c4.appendChild(fieldChecklist(D.SETUP_CHECKLIST));
    root.appendChild(c4);

    const c5 = h('div', { class: 'card' });
    c5.appendChild(teamsCallout());
    root.appendChild(c5);
  };

  /* ---------- Starter ---------- */
  RENDER.starter = function (root) {
    const intro = h('div', { class: 'card' });
    intro.appendChild(h('h3', { text: 'Same route, different language' }));
    intro.appendChild(h('p', { text: 'These two programs are written in different languages. Read both carefully before you answer. Do not guess quickly — predicting is a real programming skill.' }));
    const grid = h('div', { class: 'two-col' });

    const left = h('div');
    left.appendChild(h('h4', { text: 'Scratch (block-based)' }));
    left.appendChild(blockList(D.STARTER_SCRATCH_BLOCKS));
    const right = h('div');
    right.appendChild(h('h4', { text: 'Python Turtle (text-based)' }));
    right.appendChild(codePanel(D.STARTER_PYTHON_CODE, 'Python Turtle sequence'));
    right.appendChild(h('p', { class: 'q-hint', text: 'In Python, t is a short name for the turtle module: import turtle as t.' }));
    grid.appendChild(left); grid.appendChild(right);
    intro.appendChild(grid);
    root.appendChild(intro);

    const q = h('div', { class: 'card' });
    q.appendChild(h('h3', { text: 'Predict, then check' }));
    q.appendChild(h('p', { class: 'q-hint', text: 'Answers are only shown after you submit an attempt. You can change your answer and check again.' }));
    D.STARTER_QUESTIONS.forEach(function (item) {
      q.appendChild(item.type === 'written' ? fieldWritten(item) : fieldChoice(item));
    });
    root.appendChild(q);
  };

  /* ---------- Main Activity 1 ---------- */
  RENDER.main1 = function (root) {
    /* Step 1 */
    const s1 = h('div', { class: 'card' });
    s1.appendChild(h('span', { class: 'step-label', text: 'Step 1 — File setup' }));
    s1.appendChild(h('h3', { text: 'Check your project files' }));
    s1.appendChild(h('pre', { class: 'folder-tree', tabindex: '0', 'aria-label': 'Required folder structure', text: L.folderStructure }));
    const fl = h('ul', { class: 'filename-list' });
    [FILENAMES.scratch(), FILENAMES.turtle(), FILENAMES.tile()].forEach(function (f) {
      fl.appendChild(h('li', null, h('span', { text: f })));
    });
    s1.appendChild(fl);
    s1.appendChild(fieldChecklist(D.MAIN1_SETUP_CHECKLIST));
    root.appendChild(s1);

    /* Step 2 — Scratch */
    const s2 = h('div', { class: 'card' });
    s2.appendChild(h('span', { class: 'step-label', text: 'Step 2 — Scratch square route' }));
    s2.appendChild(h('h3', { text: 'Build this program in Scratch' }));
    s2.appendChild(h('p', { text: 'You must add the Pen extension first. Do not use a repeat block — we have not learned repetition yet, so every command is written out.' }));
    s2.appendChild(blockList(D.SCRATCH_SQUARE_BLOCKS));

    s2.appendChild(h('h4', { text: 'Predict before you open Scratch' }));
    D.SCRATCH_PREDICTIONS.forEach(function (item) {
      s2.appendChild(item.type === 'written' ? fieldWritten(item) : fieldChoice(item));
    });

    s2.appendChild(h('hr', { class: 'divider' }));
    s2.appendChild(h('h4', { text: 'Your Scratch task' }));
    const ol = h('ol');
    D.SCRATCH_TASK_STEPS.forEach(function (t) { ol.appendChild(h('li', { text: t })); });
    s2.appendChild(ol);

    const openBtn = h('a', {
      class: 'btn btn-primary', href: CFG.SCRATCH_EDITOR_URL, target: '_blank', rel: 'noopener noreferrer',
      text: 'Open Scratch Editor ↗'
    });
    s2.appendChild(h('div', { class: 'btn-row' }, [openBtn,
      h('span', { class: 'q-hint', text: 'Opens in a new tab. Come back to this tab afterwards — your work here is saved.' })]));

    const exampleShot = h('details', { class: 'card card-quiet' });
    exampleShot.appendChild(h('summary', { text: 'What should my screenshot show?' }));
    exampleShot.appendChild(h('img', {
      src: 'assets/evidence-placeholders/scratch-screenshot-example.svg',
      alt: 'Example layout of a good Scratch screenshot: the block script on the left and the stage showing the drawn square on the right.',
      style: 'max-width:100%;border:1px solid var(--grey-line);margin-top:.5rem;'
    }));
    s2.appendChild(exampleShot);

    s2.appendChild(evidenceSlot('ev_scratch', {
      title: 'Scratch screenshot',
      help: 'Upload or paste one screenshot that shows BOTH your completed blocks AND the square on the Scratch stage. Use the Print Screen key, or Windows key + Shift + S.',
      alt: 'Screenshot of the student\'s Scratch blocks and stage'
    }));

    s2.appendChild(h('h4', { text: 'Record what happened' }));
    D.SCRATCH_REFLECTION.forEach(function (item) {
      s2.appendChild(item.type === 'written' ? fieldWritten(item) : fieldChoice(item));
    });

    const warn = h('div', { class: 'callout warn' });
    warn.appendChild(h('p', { html: '<strong>Download your Scratch project as an .sb3 file.</strong> You will submit it with your PDF and Python file. In Scratch: File ▸ Save to your computer. Save it as <code>' + FILENAMES.scratch() + '</code> inside your T1.1 folder.' }));
    warn.appendChild(h('p', { class: 'q-hint', text: 'This website cannot check your download for you, so please confirm below.' }));
    warn.appendChild(singleCheck('m1_sb3_downloaded', 'I have downloaded my Scratch .sb3 file and saved it in my T1.1 folder.'));
    s2.appendChild(warn);
    root.appendChild(s2);

    /* Step 3 — Python */
    const s3 = h('div', { class: 'card' });
    s3.appendChild(h('span', { class: 'step-label', text: 'Step 3 — Python Turtle square route' }));
    s3.appendChild(h('h3', { text: 'The same square, written in Python' }));
    s3.appendChild(h('p', { text: 'This step happens entirely inside this website. Read the code, predict what it will do, then run it.' }));

    s3.appendChild(h('h4', { text: 'Predict before you run' }));
    D.PYTHON_PREDICTIONS.forEach(function (item) { s3.appendChild(fieldChoice(item)); });

    s3.appendChild(h('h4', { text: 'Python editor' }));
    s3.appendChild(mountIDE({
      id: 'm1py', label: 'Python Turtle square',
      starterCode: D.PYTHON_SQUARE_CODE,
      filename: FILENAMES.turtle(),
      evidenceSlot: 'ev_python'
    }));

    const taskOl = h('ol');
    D.PYTHON_TASK_STEPS.forEach(function (t) { taskOl.appendChild(h('li', { text: t })); });
    s3.appendChild(h('h4', { text: 'Your Python task' }));
    s3.appendChild(taskOl);

    s3.appendChild(fieldWritten({
      id: 'm1_py_explain',
      prompt: 'How did the output change when you changed 100 to 60?',
      hint: 'Describe the size of the square before and after, and say which number caused the change.'
    }));

    s3.appendChild(h('hr', { class: 'divider' }));
    s3.appendChild(h('h4', { text: 'Comparison task' }));
    const tbl = h('table', { class: 'tbl' });
    const thead = h('thead', null, h('tr', null, [h('th', { text: 'Scratch' }), h('th', { text: 'Python Turtle' })]));
    const tb = h('tbody');
    D.COMPARISON_ROWS.forEach(function (r) {
      tb.appendChild(h('tr', null, [h('td', { class: 'mono', text: r.scratch }), h('td', { class: 'mono', text: r.python })]));
    });
    tbl.appendChild(thead); tbl.appendChild(tb);
    s3.appendChild(tbl);
    s3.appendChild(fieldWritten({
      id: 'm1_compare',
      prompt: 'What stayed the same even though the programming language changed?',
      hint: 'Think about the algorithm: the order of the instructions, the distances and the angles.'
    }));
    root.appendChild(s3);
  };

  /* Copy text to the clipboard with a fallback for older browsers. */
  function copyText(text, onDone) {
    const done = onDone || function () { announce('Copied to the clipboard.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done); });
    } else { legacyCopy(text, done); }
  }
  function legacyCopy(text, done) {
    const ta = h('textarea', { style: 'position:fixed;left:-9999px;top:0;' });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { announce('Copy failed — select the code and press Ctrl and C.'); }
    document.body.removeChild(ta);
  }

  /* Worked example + reusable snippets, shown between planning and building. */
  function codeHelpersCard() {
    const W = D.WORKED_EXAMPLE;
    const card = h('div', { class: 'card' });
    card.appendChild(h('span', { class: 'step-label', text: 'From sketch to code' }));
    card.appendChild(h('h3', { text: 'Sample code to get you started' }));
    card.appendChild(h('p', { text: W.note }));

    const status = h('p', { class: 'answer-status', role: 'status' });

    /* ---- worked example ---- */
    const det = h('details', { class: 'card card-quiet' });
    det.appendChild(h('summary', { text: 'Show the worked example: ' + W.title }));
    det.appendChild(codePanel(W.code, 'Worked example Python code'));

    const exRow = h('div', { class: 'btn-row' });
    const copyEx = h('button', { type: 'button', class: 'btn btn-small', text: 'Copy example' });
    const loadEx = h('button', { type: 'button', class: 'btn btn-small', text: 'Load into the editor' });
    copyEx.addEventListener('click', function () {
      copyText(W.code, function () { status.textContent = 'Example copied. Paste it into the editor with Ctrl and V.'; });
    });
    loadEx.addEventListener('click', function () {
      const ide = ides.m2;
      if (!ide) { status.textContent = 'Scroll down to the editor first.'; return; }
      const current = ide.getCode().trim();
      const untouched = current === D.WAYFINDING_STARTER_CODE.trim() || current === '';
      const go = function () {
        ide.loadCode(W.code, 'Worked example loaded. Now change it so it matches your own plan.');
        status.textContent = 'Loaded. Remember: change the direction, sizes and angles so the tile is yours.';
        ide.root.scrollIntoView({ block: 'start' });
      };
      if (untouched) go();
      else confirmDialog('Replace your code?',
        'This will replace everything currently in the editor with the worked example. Your own code will be lost.', go);
    });
    exRow.appendChild(copyEx); exRow.appendChild(loadEx);
    det.appendChild(exRow);

    const ideas = h('div', { class: 'callout warn' });
    ideas.appendChild(h('p', { html: '<strong>Do not hand in the example unchanged.</strong> Ways to make it your own:' }));
    const ul = h('ul');
    W.changeIdeas.forEach(function (i) { ul.appendChild(h('li', { text: i })); });
    ideas.appendChild(ul);
    det.appendChild(ideas);
    card.appendChild(det);

    /* ---- snippets ---- */
    card.appendChild(h('h4', { text: 'Code helpers' }));
    card.appendChild(h('p', { class: 'q-hint', text: 'Small pieces of code you can use in any design. Insert adds the code where your cursor is in the editor. Always change the numbers to fit your own sketch.' }));

    const grid = h('div', { class: 'two-col' });
    D.CODE_HELPERS.forEach(function (s) {
      const box = h('div', { class: 'card card-quiet' });
      box.appendChild(h('h4', { text: s.title, style: 'margin-bottom:.2rem;' }));
      box.appendChild(h('p', { class: 'q-hint', text: s.desc }));
      box.appendChild(codePanel(s.code, s.title + ' code'));
      const row = h('div', { class: 'btn-row' });
      const bCopy = h('button', { type: 'button', class: 'btn btn-small', text: 'Copy' });
      const bIns = h('button', { type: 'button', class: 'btn btn-small', text: 'Insert into editor' });
      bCopy.setAttribute('aria-label', 'Copy the code for ' + s.title);
      bIns.setAttribute('aria-label', 'Insert the code for ' + s.title + ' into the editor');
      bCopy.addEventListener('click', function () {
        copyText(s.code, function () { status.textContent = s.title + ' copied.'; });
      });
      bIns.addEventListener('click', function () {
        const ide = ides.m2;
        if (!ide) { status.textContent = 'Scroll down to the editor first.'; return; }
        ide.insertSnippet(s.code);
        status.textContent = s.title + ' added at your cursor. Change the numbers to fit your design.';
      });
      row.appendChild(bCopy); row.appendChild(bIns);
      box.appendChild(row);
      grid.appendChild(box);
    });
    card.appendChild(grid);
    card.appendChild(status);
    return card;
  }

  /* ---------- Main Activity 2 ---------- */
  RENDER.main2 = function (root) {
    const brief = h('div', { class: 'card' });
    brief.appendChild(h('h3', { text: 'Project brief' }));
    brief.appendChild(h('p', { text: D.PROJECT_BRIEF }));
    brief.appendChild(h('p', { class: 'q-hint', text: 'Possible designs:' }));
    const ul = h('ul');
    D.DESIGN_IDEAS.forEach(function (i) { ul.appendChild(h('li', { text: i })); });
    brief.appendChild(ul);
    brief.appendChild(h('img', {
      src: 'assets/images/wayfinding-examples.svg',
      alt: 'Four example wayfinding symbols: a straight arrow, a turning arrow, a doorway symbol and a destination flag. These are ideas only, not solutions.',
      style: 'max-width:100%;border:1px solid var(--grey-line);border-radius:6px;margin:.4rem 0 .8rem;'
    }));
    brief.appendChild(h('p', { class: 'q-hint', text: 'These are ideas, not solutions. You must work out the commands, distances and angles yourself.' }));
    brief.appendChild(h('p', { html: '<strong>Challenge:</strong> ' + L.challenge }));
    root.appendChild(brief);

    const plan = h('div', { class: 'card' });
    plan.appendChild(h('span', { class: 'step-label', text: 'Plan' }));
    plan.appendChild(h('h3', { text: 'Plan your tile before you code' }));
    plan.appendChild(sketchPad('ev_sketch', 'm2_plan_describe'));
    D.PLANNING_QUESTIONS.forEach(function (q) { plan.appendChild(fieldWritten(q)); });
    root.appendChild(plan);

    root.appendChild(codeHelpersCard());

    const build = h('div', { class: 'card' });
    build.appendChild(h('span', { class: 'step-label', text: 'Build and test' }));
    build.appendChild(h('h3', { text: 'Create your wayfinding tile' }));
    const cols = h('div', { style: 'display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:1.2rem;align-items:start;' });
    const ideCol = h('div');
    ideCol.appendChild(mountIDE({
      id: 'm2', label: 'Wayfinding tile',
      starterCode: D.WAYFINDING_STARTER_CODE,
      filename: FILENAMES.tile(),
      evidenceSlot: 'ev_wayfinding'
    }));
    const critCol = h('div', { class: 'card card-quiet' });
    critCol.appendChild(h('h4', { text: 'Success criteria' }));
    critCol.appendChild(h('p', { class: 'q-hint', text: 'Tick each one when it is true. Your section is only complete when you have run your code, produced a drawing, captured evidence and written your explanation.' }));
    critCol.appendChild(fieldChecklist(D.SUCCESS_CRITERIA));
    cols.appendChild(ideCol); cols.appendChild(critCol);
    build.appendChild(cols);
    root.appendChild(build);

    const test = h('div', { class: 'card' });
    test.appendChild(h('span', { class: 'step-label', text: 'Test' }));
    test.appendChild(h('h3', { text: 'Testing record' }));
    test.appendChild(h('p', { text: 'Record at least two tests. A test is a run where you checked something specific.' }));
    const tt = h('table', { class: 'tbl' });
    tt.appendChild(h('thead', null, h('tr', null, [
      h('th', { text: 'Test', scope: 'col' }), h('th', { text: 'What I expected', scope: 'col' }),
      h('th', { text: 'What happened', scope: 'col' }), h('th', { text: 'Change made', scope: 'col' })
    ])));
    const tbody = h('tbody');
    ['1', '2'].forEach(function (n) {
      tbody.appendChild(h('tr', null, [
        h('th', { scope: 'row', text: n }),
        h('td', null, fieldText('m2_test' + n + '_expected', 'I expected…', 'Test ' + n + ': what I expected')),
        h('td', null, fieldText('m2_test' + n + '_happened', 'What happened…', 'Test ' + n + ': what happened')),
        h('td', null, fieldText('m2_test' + n + '_change', 'I changed…', 'Test ' + n + ': change made'))
      ]));
    });
    tt.appendChild(tbody);
    test.appendChild(tt);
    root.appendChild(test);

    const exp = h('div', { class: 'card' });
    exp.appendChild(h('span', { class: 'step-label', text: 'Explain' }));
    exp.appendChild(h('h3', { text: 'Explain your design' }));
    D.EXPLANATION_QUESTIONS.forEach(function (q) { exp.appendChild(fieldWritten(q)); });
    root.appendChild(exp);
  };

  /* ---------- Extension ---------- */
  RENDER.extension = function (root) {
    const c = h('div', { class: 'card' });
    c.appendChild(h('h3', { text: 'Optional extension' }));
    c.appendChild(h('p', { text: 'This section is optional. You can go straight to the plenary at any time. Choose one challenge below. Do not use loops — write each command out.' }));
    c.appendChild(fieldChoice({
      id: 'ext_choice',
      prompt: 'Which challenge did you choose?',
      options: D.EXTENSION_OPTIONS,
      answer: null
    }));
    c.appendChild(h('p', { html: 'Save your extension work as <code>' + FILENAMES.tileV2() + '</code>.' }));
    c.appendChild(mountIDE({
      id: 'ext', label: 'Extension — version 2',
      starterCode: D.EXTENSION_STARTER_CODE,
      filename: FILENAMES.tileV2(),
      evidenceSlot: 'ev_ext'
    }));
    c.appendChild(fieldWritten({
      id: 'ext_explain',
      prompt: 'What did you change in your second version, and why?',
      hint: 'Only needed if you attempted the extension.'
    }));
    root.appendChild(c);
  };

  /* ---------- Plenary ---------- */
  RENDER.plenary = function (root) {
    const c1 = h('div', { class: 'card' });
    c1.appendChild(h('h3', { text: 'Self-check or partner-check' }));
    c1.appendChild(h('p', { class: 'q-hint', text: 'Tick only the statements that are true. Being honest here helps your teacher support you.' }));
    c1.appendChild(fieldChecklist(D.SELF_CHECK));
    root.appendChild(c1);

    const c2 = h('div', { class: 'card' });
    c2.appendChild(h('h3', { text: 'Exit ticket' }));
    D.EXIT_TICKET.forEach(function (q) { c2.appendChild(fieldWritten({ id: q.id, prompt: q.prompt, hint: q.hint, rows: 2 })); });
    root.appendChild(c2);
  };

  /* ---------- Evidence review ---------- */
  function reviewItem(question, answer, opts) {
    opts = opts || {};
    const d = h('div', { class: 'review-item' });
    d.appendChild(h('p', { class: 'review-q', text: question }));
    const missing = !answer || (typeof answer === 'string' && !answer.trim());
    if (opts.image) {
      if (missing) d.appendChild(h('p', { class: 'review-a missing', text: 'Not added yet.' }));
      else d.appendChild(h('img', { class: 'review-img', src: answer, alt: opts.alt || question }));
    } else {
      d.appendChild(h('p', {
        class: 'review-a' + (missing ? ' missing' : '') + (opts.mono ? ' mono' : ''),
        text: missing ? 'Not answered yet.' : String(answer)
      }));
    }
    return d;
  }

  function choiceText(q) {
    const v = resp(q.id);
    if (v === '' || v === undefined || v === null) return '';
    return q.options[v];
  }

  function collectReview() {
    const R = [];
    const sec = function (title, items) { R.push({ title: title, items: items }); };

    sec('Student', [
      { q: 'Name', a: state.student.name },
      { q: 'Class', a: state.student.className },
      { q: 'Lesson', a: L.title },
      { q: 'Week', a: L.weekLabel },
      { q: 'Date', a: todayString() }
    ]);

    sec('Learning information', [
      { q: 'WAGBA', a: L.wagba },
      { q: 'Knowledge', a: L.knowledge.map(function (k) { return '• ' + k; }).join('\n') },
      { q: 'Skills', a: L.skills.map(function (k) { return '• ' + k; }).join('\n') },
      { q: 'Understanding', a: L.understanding.map(function (k) { return '• ' + k; }).join('\n') },
      { q: 'Keywords', a: L.keywords.join(', ') }
    ]);

    sec('Project setup', [
      { q: 'Folder created', a: ticked('welcome_folders_created') ? 'Yes' : 'Not confirmed' }
    ].concat(D.SETUP_CHECKLIST.map(function (i) {
      return { q: i.label, a: ticked(i.id) ? 'Yes' : 'Not ticked' };
    })).concat([
      { q: 'Suggested filenames', a: [FILENAMES.scratch(), FILENAMES.turtle(), FILENAMES.tile()].join('\n'), mono: true }
    ]));

    sec('Starter — same route, different language', D.STARTER_QUESTIONS.map(function (q) {
      return { q: q.prompt, a: q.type === 'written' ? resp(q.id) : choiceText(q) };
    }));

    sec('Main Activity 1 — Scratch predictions', D.SCRATCH_PREDICTIONS.map(function (q) {
      return { q: q.prompt, a: q.type === 'written' ? resp(q.id) : choiceText(q) };
    }));

    sec('Main Activity 1 — Scratch modification', [
      { q: 'Was your prediction correct?', a: choiceText(D.SCRATCH_REFLECTION[0]) },
      { q: 'What did you change?', a: resp('m1_ref_changed') },
      { q: 'What happened after the change?', a: resp('m1_ref_happened') },
      { q: 'Why did the output change?', a: resp('m1_ref_why') },
      { q: 'Scratch .sb3 downloaded', a: ticked('m1_sb3_downloaded') ? 'Yes' : 'Not confirmed' },
      { q: 'Scratch screenshot', a: state.images.ev_scratch, image: true, alt: 'Scratch blocks and stage' }
    ]);

    sec('Main Activity 1 — Python Turtle', D.PYTHON_PREDICTIONS.map(function (q) {
      return { q: q.prompt, a: choiceText(q) };
    }).concat([
      { q: 'Starting Python code', a: (state.ide.m1py && state.ide.m1py.initialCode) || D.PYTHON_SQUARE_CODE, mono: true },
      { q: 'Final Python code', a: (state.ide.m1py && state.ide.m1py.code) || '', mono: true },
      { q: 'Number of runs', a: String((state.ide.m1py && state.ide.m1py.runs) || 0) },
      { q: 'How the output changed', a: resp('m1_py_explain') },
      { q: 'Python Turtle output', a: state.images.m1py_canvas, image: true, alt: 'Turtle square drawing' },
      { q: 'Python evidence', a: state.images.ev_python, image: true, alt: 'Captured Python evidence' },
      { q: 'What stayed the same across both languages?', a: resp('m1_compare') }
    ]));

    sec('Main Activity 2 — Wayfinding tile', D.PLANNING_QUESTIONS.map(function (q) {
      return { q: q.prompt, a: resp(q.id) };
    }).concat([
      { q: 'Written description of the plan', a: resp('m2_plan_describe') },
      { q: 'Planning sketch', a: state.images.ev_sketch, image: true, alt: 'Planning sketch' },
      { q: 'Final Python code', a: (state.ide.m2 && state.ide.m2.code) || '', mono: true },
      { q: 'Number of runs', a: String((state.ide.m2 && state.ide.m2.runs) || 0) },
      { q: 'Final Turtle output', a: state.images.m2_canvas, image: true, alt: 'Final wayfinding tile drawing' },
      { q: 'Python evidence', a: state.images.ev_wayfinding, image: true, alt: 'Captured wayfinding evidence' },
      { q: 'Downloaded file', a: resp('m2_downloaded') || 'Not downloaded from this page yet' }
    ]));

    sec('Main Activity 2 — Testing record', ['1', '2'].map(function (n) {
      return {
        q: 'Test ' + n,
        a: 'Expected: ' + (resp('m2_test' + n + '_expected') || '—') +
           '\nHappened: ' + (resp('m2_test' + n + '_happened') || '—') +
           '\nChange made: ' + (resp('m2_test' + n + '_change') || '—')
      };
    }));

    sec('Main Activity 2 — Explanation', D.EXPLANATION_QUESTIONS.map(function (q) {
      return { q: q.prompt, a: resp(q.id) };
    }).concat([
      { q: 'Success criteria met', a: D.SUCCESS_CRITERIA.filter(function (c) { return ticked(c.id); }).length + ' of ' + D.SUCCESS_CRITERIA.length }
    ]));

    if (resp('ext_choice') !== '' && resp('ext_choice') !== undefined) {
      sec('Extension (attempted)', [
        { q: 'Challenge chosen', a: D.EXTENSION_OPTIONS[resp('ext_choice')] },
        { q: 'Extension code', a: (state.ide.ext && state.ide.ext.code) || '', mono: true },
        { q: 'Extension output', a: state.images.ext_canvas, image: true, alt: 'Extension Turtle drawing' },
        { q: 'What changed and why', a: resp('ext_explain') }
      ]);
    }

    sec('Plenary', D.SELF_CHECK.map(function (i) {
      return { q: i.label, a: ticked(i.id) ? 'Yes' : 'Not ticked' };
    }).concat(D.EXIT_TICKET.map(function (q) {
      return { q: q.prompt, a: resp(q.id) };
    })));

    sec('Submission checklist', D.SUBMISSION_CHECKLIST.map(function (i) {
      return { q: i.label, a: ticked(i.id) ? 'Yes' : 'Not ticked' };
    }).concat([
      { q: 'Microsoft Teams assignment', a: CFG.TEAMS_ASSIGNMENT_NAME },
      { q: 'Files to upload', a: L.submissionFiles.map(function (f) { return '• ' + f; }).join('\n') }
    ]));

    return R;
  }

  RENDER.review = function (root) {
    const head = h('div', { class: 'card' });
    head.appendChild(h('h3', { text: 'Check your evidence before exporting' }));
    head.appendChild(h('p', { text: 'Everything below will appear in your PDF report. Anything marked "Not answered yet" will be missing — go back and complete it if you can.' }));
    const statusRow = h('div', { class: 'btn-row' });
    D.SECTIONS.filter(function (s) { return ['welcome', 'starter', 'main1', 'main2', 'extension', 'plenary'].indexOf(s.id) >= 0; })
      .forEach(function (s) {
        const done = isComplete(s.id);
        const b = h('button', {
          type: 'button', class: 'btn btn-small',
          text: s.short + (done ? ' ✔' : (s.optional ? ' (optional)' : ' — return'))
        });
        b.appendChild(h('span', { class: 'visually-hidden', text: done ? ' complete' : ' incomplete, go to section' }));
        b.addEventListener('click', function () { gotoSection(s.id, true); });
        statusRow.appendChild(b);
      });
    head.appendChild(statusRow);
    head.appendChild(teamsCallout());
    root.appendChild(head);

    collectReview().forEach(function (group) {
      const c = h('div', { class: 'card' });
      c.appendChild(h('h3', { text: group.title }));
      group.items.forEach(function (it) {
        c.appendChild(reviewItem(it.q, it.a, { image: it.image, mono: it.mono, alt: it.alt }));
      });
      root.appendChild(c);
    });

    const conf = h('div', { class: 'card' });
    conf.appendChild(h('h3', { text: 'Ready to export?' }));
    conf.appendChild(singleCheck('review_confirmed', 'I have checked my evidence above and I am ready to export my report.'));
    root.appendChild(conf);
  };

  /* ---------- Export ---------- */
  RENDER.export = function (root) {
    const c = h('div', { class: 'card' });
    c.appendChild(h('h3', { text: 'Export your PDF evidence report' }));
    c.appendChild(h('p', { html: 'Your report will be saved as <code>' + FILENAMES.pdf() + '</code>.' }));
    const row = h('div', { class: 'btn-row' });
    const preview = h('button', { type: 'button', class: 'btn', text: 'Preview report' });
    const download = h('button', { type: 'button', class: 'btn btn-primary', text: 'Download PDF' });
    const printBtn = h('button', { type: 'button', class: 'btn', text: 'Print / Save as PDF (fallback)' });
    row.appendChild(preview); row.appendChild(download); row.appendChild(printBtn);
    c.appendChild(row);
    const status = h('p', { class: 'answer-status', id: 'pdf-status', text: resp('pdf_exported') ? 'Report exported earlier in this lesson.' : 'Report not exported yet.' });
    c.appendChild(status);

    const busy = function (msg) { status.textContent = msg; };

    preview.addEventListener('click', function () {
      busy('Building preview…');
      window.LessonReport.build(reportPayload()).then(function (doc) {
        const url = doc.output('bloburl');
        openModal('Report preview', function (body, foot) {
          body.appendChild(h('iframe', { src: url, title: 'PDF preview of your evidence report' }));
          const dl = h('button', { type: 'button', class: 'btn btn-primary', text: 'Download this PDF' });
          dl.addEventListener('click', function () { doc.save(FILENAMES.pdf()); markExported(); });
          const cl = h('button', { type: 'button', class: 'btn', text: 'Close' });
          cl.addEventListener('click', closeModal);
          foot.appendChild(cl); foot.appendChild(dl);
        });
        busy('Preview ready.');
      }).catch(function (e) {
        busy('The preview could not be created (' + e.message + '). Use the print fallback instead.');
      });
    });

    download.addEventListener('click', function () {
      busy('Building your PDF…');
      window.LessonReport.build(reportPayload()).then(function (doc) {
        doc.save(FILENAMES.pdf());
        markExported();
        busy('PDF downloaded. Check your Downloads folder, then move it into your T1.1 folder.');
      }).catch(function (e) {
        busy('The PDF could not be created (' + e.message + '). Use the print fallback instead.');
      });
    });

    printBtn.addEventListener('click', function () {
      window.LessonReport.buildPrintable(reportPayload(), $('#print-report'));
      markExported();
      setTimeout(function () { window.print(); }, 200);
    });

    function markExported() {
      setResponse('pdf_exported', true);
      after.hidden = false;
    }
    root.appendChild(c);

    /* After export instructions */
    const after = h('div', { class: 'card' });
    after.hidden = !resp('pdf_exported');
    after.appendChild(h('h3', { text: 'Now submit your work' }));
    const big = h('div', { class: 'callout ok' });
    big.appendChild(h('p', { html: '<strong>Upload your PDF, Scratch .sb3 file and Python .py file to the Microsoft Teams Assignment named "' + CFG.TEAMS_ASSIGNMENT_NAME + '".</strong>' }));
    after.appendChild(big);
    const ul = h('ul');
    D.SUBMISSION_REMINDERS.forEach(function (r) { ul.appendChild(h('li', { text: r })); });
    after.appendChild(ul);
    root.appendChild(after);

    const chk = h('div', { class: 'card' });
    chk.appendChild(h('h3', { text: 'Final submission checklist' }));
    chk.appendChild(teamsCallout());
    chk.appendChild(fieldChecklist(D.SUBMISSION_CHECKLIST));
    chk.appendChild(h('hr', { class: 'divider' }));
    const dlRow = h('div', { class: 'btn-row' });
    const dlPy = h('button', { type: 'button', class: 'btn btn-small', text: 'Download my wayfinding tile .py again' });
    dlPy.addEventListener('click', function () {
      const code = (state.ide.m2 && state.ide.m2.code) || D.WAYFINDING_STARTER_CODE;
      const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
      const a = h('a', { href: URL.createObjectURL(blob), download: FILENAMES.tile() });
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 400);
    });
    dlRow.appendChild(dlPy);
    chk.appendChild(dlRow);
    root.appendChild(chk);

    const done = h('div', { class: 'card' });
    done.appendChild(h('h3', { text: 'Finished' }));
    done.appendChild(h('p', { text: 'Your answers stay saved in this browser on this device. If you use a different computer next lesson, your work will not follow you — that is why the PDF and your project files are the evidence that counts.' }));
    root.appendChild(done);
  };

  function reportPayload() {
    return {
      lesson: L,
      config: CFG,
      student: state.student,
      date: todayString(),
      groups: collectReview(),
      filename: FILENAMES.pdf()
    };
  }

  /* =========================================================
     11. Section rendering entry point
     ========================================================= */
  function renderSection(id) {
    Object.keys(ides).forEach(function (k) { delete ides[k]; });
    const cont = $('#section-container');
    cont.innerHTML = '';
    const sec = D.SECTIONS.find(function (s) { return s.id === id; });
    cont.appendChild(sectionHead(sec));
    const body = h('div');
    cont.appendChild(body);
    RENDER[id](body);
  }

  /* =========================================================
     12. Landing page and start-up
     ========================================================= */
  function fillLanding() {
    $('#landing-eyebrow').textContent = L.subject + ' · ' + L.weekLabel;
    $('#landing-title').textContent = L.title;
    $('#landing-time').textContent = 'Estimated time: ' + L.estimatedMinutes + ' minutes';
    $('#landing-unit').textContent = 'Unit: ' + L.unit;
    $('#landing-desc').textContent = L.projectDescription;
    const ul = $('#landing-files');
    ul.innerHTML = '';
    L.submissionFiles.forEach(function (f) { ul.appendChild(h('li', { text: f })); });
    $('#landing-teams').textContent = 'These are uploaded to the Microsoft Teams assignment named "' +
      CFG.TEAMS_ASSIGNMENT_NAME + '".';
    $('#app-eyebrow').textContent = L.subject + ' · ' + L.weekLabel + ' · Teams: ' + CFG.TEAMS_ASSIGNMENT_NAME;
    $('#app-title').textContent = L.title;
    document.title = L.subject + ' — ' + L.title;
  }

  function findSaved(name, className, isTeacher) {
    const key = recordKey(name, className, isTeacher);
    return Store.read(key);
  }

  function updateResumeButton() {
    const nameEl = $('#student-name'), classEl = $('#student-class');
    const name = nameEl.value.trim();
    const isTeacher = name.toLowerCase() === 'teacher';
    const saved = name ? findSaved(name, classEl.value.trim(), isTeacher) : null;
    const btn = $('#btn-resume');
    const hint = $('#resume-hint');
    if (saved) {
      btn.hidden = false;
      hint.hidden = false;
      const d = new Date(saved.updatedAt || Date.now());
      hint.textContent = 'Saved work found on this computer for ' + (saved.student.name || name) +
        ' (last saved ' + d.toLocaleDateString() + ' ' + String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ').';
    } else {
      btn.hidden = true; hint.hidden = true;
    }
  }

  function startSession(name, className, resume) {
    const isTeacher = name.trim().toLowerCase() === 'teacher';
    state.student = {
      name: isTeacher ? 'Teacher' : name.trim(),
      className: isTeacher ? (className.trim() || 'Staff') : className.trim(),
      isTeacher: isTeacher
    };
    state.key = recordKey(state.student.name, state.student.className, isTeacher);

    const saved = Store.read(state.key);
    if (resume && saved) {
      state.responses = saved.responses || {};
      state.ide = saved.ide || {};
      state.current = saved.current || 'welcome';
      state.started = saved.started || Date.now();
    } else {
      state.responses = {};
      state.ide = {};
      state.current = 'welcome';
      state.started = Date.now();
    }

    EvidenceDB.all(state.key + '::').then(function (imgs) {
      state.images = resume ? (imgs || {}) : {};
      if (!resume) {
        Object.keys(imgs || {}).forEach(function (slot) { EvidenceDB.del(state.key + '::' + slot); });
      }
      launchApp();
    });
  }

  function launchApp() {
    $('#landing').hidden = true;
    $('#app').hidden = false;
    $('#hdr-name').textContent = state.student.name;
    $('#hdr-class').textContent = state.student.isTeacher ? 'Staff view' : 'Class ' + state.student.className;
    buildLearningPanel();
    buildNav();
    updateProgress();
    gotoSection(state.current, true);
    saveNow();
  }

  /* =========================================================
     13. Wiring
     ========================================================= */
  function wire() {
    fillLanding();

    const form = $('#start-form');
    const nameEl = $('#student-name');
    const classEl = $('#student-class');

    nameEl.addEventListener('input', function () {
      const isTeacher = nameEl.value.trim().toLowerCase() === 'teacher';
      classEl.required = !isTeacher;
      updateResumeButton();
    });
    classEl.addEventListener('input', updateResumeButton);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = nameEl.value.trim();
      const className = classEl.value.trim();
      const isTeacher = name.toLowerCase() === 'teacher';
      let ok = true;
      $('#student-name-err').hidden = !!name;
      if (!name) { ok = false; nameEl.focus(); }
      $('#student-class-err').hidden = isTeacher || !!className;
      if (!isTeacher && !className) { ok = false; if (name) classEl.focus(); }
      if (!ok) { announce('Please complete the required fields.'); return; }

      const saved = findSaved(name, className, isTeacher);
      if (saved) {
        confirmDialog('Saved work found',
          'There is saved work on this computer for ' + (saved.student.name || name) +
          '. Choose "Yes, continue" to start again from the beginning, or close this window and use Resume Previous Work.',
          function () { startSession(name, className, false); });
        return;
      }
      startSession(name, className, false);
    });

    $('#btn-resume').addEventListener('click', function () {
      const name = nameEl.value.trim();
      const className = classEl.value.trim();
      if (!name) { $('#student-name-err').hidden = false; nameEl.focus(); return; }
      startSession(name, className, true);
    });

    $('#btn-back').addEventListener('click', function () {
      const idx = D.SECTIONS.findIndex(function (s) { return s.id === state.current; });
      if (idx > 0) gotoSection(D.SECTIONS[idx - 1].id, true);
    });
    $('#btn-next').addEventListener('click', nextSection);

    $('#btn-exit').addEventListener('click', function () {
      confirmDialog('Change student?',
        'Your work is saved on this computer. You can come back by entering the same name and class and choosing Resume Previous Work.',
        function () {
          saveNow();
          $('#app').hidden = true;
          $('#landing').hidden = false;
          $('#student-name').focus();
          updateResumeButton();
        });
    });

    $('#lp-toggle').addEventListener('click', function () {
      const c = $('#lp-content');
      const open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', open ? 'false' : 'true');
      c.hidden = open;
    });

    $('#modal-close').addEventListener('click', closeModal);
    $('#modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
    });

    window.addEventListener('beforeunload', function () { if (state.key) saveNow(); });

    /* Collapse the learning panel by default on small screens */
    if (window.matchMedia('(max-width: 1024px)').matches) {
      $('#lp-toggle').setAttribute('aria-expanded', 'false');
      $('#lp-content').hidden = true;
    }

    updateResumeButton();
    if (!Store.available) {
      const w = h('div', { class: 'callout warn' },
        h('p', { text: 'This browser is blocking local storage, so your work cannot be saved automatically. Ask your teacher for help, and export your PDF before you close the tab.' }));
      $('.landing-card').appendChild(w);
    }
  }

  /* Expose a small API for testing and for the report module. */
  window.LessonApp = {
    state: state, RULES: RULES, isComplete: isComplete, isUnlocked: isUnlocked,
    FILENAMES: FILENAMES, collectReview: collectReview, gotoSection: gotoSection,
    setResponse: setResponse, startSession: startSession, recordKey: recordKey,
    setImage: setImage, clearImage: clearImage, saveNow: saveNow,
    missingItems: missingItems, ides: ides, reportPayload: reportPayload
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();

})();
