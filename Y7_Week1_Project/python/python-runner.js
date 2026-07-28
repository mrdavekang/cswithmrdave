/* =============================================================
   python-runner.js
   A genuine browser-based Python environment for the lesson.

   Python execution : Skulpt (python/skulpt/skulpt.min.js)
   Standard library : python/skulpt-turtle/skulpt-stdlib.js (contains turtle)
   Editor           : CodeMirror 5 (python/codemirror/)

   Everything runs locally in the browser. No server, no CDN.
   ============================================================= */

(function (global) {
  'use strict';

  /* Only one Python program may run at a time (Skulpt is a single global VM). */
  let VM_BUSY = false;
  let RUN_TOKEN = 0;

  function builtinRead(x) {
    if (typeof Sk.builtinFiles === 'undefined' || Sk.builtinFiles['files'][x] === undefined) {
      throw new Error("File not found: '" + x + "'");
    }
    return Sk.builtinFiles['files'][x];
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function two(n) { return n < 10 ? '0' + n : '' + n; }

  function stamp(d) {
    d = d || new Date();
    return two(d.getDate()) + '/' + two(d.getMonth() + 1) + '/' + d.getFullYear() +
           ' ' + two(d.getHours()) + ':' + two(d.getMinutes());
  }

  /* ---------------------------------------------------------
     Turn a Skulpt error into a readable, line-referenced message
     --------------------------------------------------------- */
  function describeError(err) {
    let name = 'Error';
    let message = '';
    let line = null;

    try {
      if (err && err.tp$name) { name = err.tp$name; }
      else if (err && err.constructor && err.constructor.name) { name = err.constructor.name; }

      if (err && err.args && err.args.v && err.args.v.length) {
        message = err.args.v.map(function (a) { return a && a.v !== undefined ? a.v : String(a); }).join(' ');
      } else if (err && err.message) {
        message = err.message;
      } else {
        message = String(err);
      }

      if (err && err.traceback && err.traceback.length && err.traceback[0].lineno) {
        line = err.traceback[0].lineno;
      } else if (err && err.lineno) {
        line = err.lineno;
      }
    } catch (e) {
      message = String(err);
    }

    /* Friendlier wording for the errors Year 7 students meet most often. */
    const friendly = {
      SyntaxError: 'Python could not understand this line. Check brackets, quotes and spelling.',
      IndentationError: 'Check the spaces at the start of the line.',
      NameError: 'Python does not recognise that name. Check the spelling, or check that you imported turtle as t.',
      AttributeError: 'That command does not exist for turtle. Check the spelling of the command.',
      TypeError: 'The value inside the brackets is not the right kind of value.',
      TimeLimitError: 'The program ran for too long and was stopped. Check for a loop that never ends, or use a faster speed.'
    };

    return {
      name: name,
      line: line,
      message: message,
      advice: friendly[name] || '',
      text: (line ? 'Line ' + line + ': ' : '') + name + ': ' + message
    };
  }

  /* ---------------------------------------------------------
     Combine every canvas inside the turtle target into one image
     --------------------------------------------------------- */
  function snapshotTurtle(targetEl) {
    const canvases = targetEl.querySelectorAll('canvas');
    if (!canvases.length) return null;
    const w = canvases[0].width || 400;
    const h = canvases[0].height || 400;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const ctx = out.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < canvases.length; i++) {
      try { ctx.drawImage(canvases[i], 0, 0, w, h); } catch (e) { /* ignore */ }
    }
    try { return out.toDataURL('image/png'); } catch (e) { return null; }
  }

  /* =========================================================
     PythonIDE
     ========================================================= */
  class PythonIDE {
    /**
     * options:
     *   id            unique id (used for DOM ids and storage keys)
     *   mount         element to render into
     *   starterCode   code loaded when the IDE is first opened / reset
     *   initialCode   previously saved code (optional)
     *   filename      suggested download filename
     *   label         name shown on captured evidence
     *   student       { name, className }
     *   onCodeChange  fn(code)
     *   onRunResult   fn({ok, runs, image, message})
     *   onEvidence    fn(dataUrl)
     *   width/height  turtle canvas size
     */
    constructor(options) {
      this.o = Object.assign({
        starterCode: '', initialCode: null, filename: 'program.py',
        label: 'Python Turtle', width: 420, height: 340,
        student: { name: '', className: '' }
      }, options);

      this.runs = 0;
      this.lastImage = null;
      this.lastMessage = '';
      this.lastOk = null;
      this.initialCodeSnapshot = this.o.initialCode || this.o.starterCode;
      this.stopped = false;
      this.build();
    }

    /* ---------- DOM ---------- */
    build() {
      const o = this.o;
      const root = el('div', 'ide');
      root.id = 'ide-' + o.id;
      this.root = root;

      /* Toolbar */
      const tb = el('div', 'ide-toolbar');
      tb.setAttribute('role', 'toolbar');
      tb.setAttribute('aria-label', 'Python editor controls');

      this.btnRun = this.mkBtn(tb, 'Run', 'btn btn-primary btn-small', 'Run the Python program (Ctrl + Enter)');
      this.btnStop = this.mkBtn(tb, 'Stop', 'btn btn-small', 'Stop the running program');
      this.btnReset = this.mkBtn(tb, 'Reset Code', 'btn btn-small', 'Put the starting code back');
      this.btnClear = this.mkBtn(tb, 'Clear Output', 'btn btn-small', 'Clear the console and the Turtle canvas');
      this.btnCopy = this.mkBtn(tb, 'Copy Code', 'btn btn-small', 'Copy the code to the clipboard');
      this.btnDownload = this.mkBtn(tb, 'Download .py', 'btn btn-small', 'Save this program as a .py file');
      this.btnUpload = this.mkBtn(tb, 'Open .py', 'btn btn-small', 'Open a .py file from your computer');
      this.btnFull = this.mkBtn(tb, 'Full screen', 'btn btn-small', 'Make the editor full screen');
      this.btnEvidence = this.mkBtn(tb, 'Capture Evidence', 'btn btn-small', 'Create an evidence image of your code and drawing');

      const sp = el('span', 'spacer'); tb.appendChild(sp);
      this.fileLabel = el('span', 'ide-filename', o.filename);
      tb.appendChild(this.fileLabel);

      this.fileInput = el('input');
      this.fileInput.type = 'file';
      this.fileInput.accept = '.py,text/x-python,text/plain';
      this.fileInput.className = 'visually-hidden';
      this.fileInput.id = 'file-' + o.id;
      this.fileInput.setAttribute('aria-label', 'Open a Python file');
      tb.appendChild(this.fileInput);

      root.appendChild(tb);

      /* Body */
      const grid = el('div', 'ide-grid');

      const editorPane = el('div', 'ide-editor-pane');
      const eh = el('p', 'ide-pane-title', 'Python code');
      editorPane.appendChild(eh);
      this.textarea = el('textarea');
      this.textarea.id = 'ta-' + o.id;
      this.textarea.setAttribute('aria-label', 'Python code editor for ' + o.label);
      this.textarea.value = o.initialCode !== null && o.initialCode !== undefined ? o.initialCode : o.starterCode;
      editorPane.appendChild(this.textarea);
      grid.appendChild(editorPane);

      const side = el('div', 'ide-side');
      const th = el('p', 'ide-pane-title', 'Turtle canvas');
      side.appendChild(th);
      const holder = el('div', 'turtle-holder');
      this.turtleTarget = el('div', 'turtle-target');
      this.turtleTarget.id = 'turtle-' + o.id;
      this.turtleTarget.style.width = o.width + 'px';
      this.turtleTarget.style.height = o.height + 'px';
      this.turtleTarget.setAttribute('role', 'img');
      this.turtleTarget.setAttribute('aria-label',
        'Turtle drawing area. The drawing appears here after you press Run.');
      this.emptyMsg = el('p', 'turtle-empty', 'Press Run to see the Turtle draw.');
      this.turtleTarget.appendChild(this.emptyMsg);
      holder.appendChild(this.turtleTarget);
      side.appendChild(holder);

      const ch = el('p', 'ide-pane-title', 'Python console');
      side.appendChild(ch);
      this.console = el('div', 'ide-console');
      this.console.id = 'console-' + o.id;
      this.console.setAttribute('role', 'log');
      this.console.setAttribute('aria-live', 'polite');
      this.console.setAttribute('aria-label', 'Python console output');
      this.console.tabIndex = 0;
      side.appendChild(this.console);
      grid.appendChild(side);

      root.appendChild(grid);

      /* Status strip */
      const st = el('div', 'ide-status');
      this.badge = el('span', 'badge', 'Ready');
      this.runCountEl = el('span', '', 'Runs: 0');
      this.savedEl = el('span', '', 'Code saved automatically');
      st.appendChild(this.badge);
      st.appendChild(this.runCountEl);
      st.appendChild(this.savedEl);
      root.appendChild(st);

      o.mount.appendChild(root);

      /* CodeMirror */
      this.cm = CodeMirror.fromTextArea(this.textarea, {
        mode: 'python',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        smartIndent: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true,
        lineWrapping: true,
        viewportMargin: 20,
        extraKeys: {
          'Ctrl-Enter': () => this.run(),
          'Cmd-Enter': () => this.run(),
          Tab: (cm) => {
            if (cm.somethingSelected()) cm.indentSelection('add');
            else cm.replaceSelection('    ', 'end');
          },
          'Shift-Tab': (cm) => cm.indentSelection('subtract'),
          Esc: () => { if (this.isFull) this.toggleFull(); }
        }
      });
      this.cm.getWrapperElement().setAttribute('aria-label', 'Python code editor');
      try {
        const input = this.cm.getInputField();
        input.setAttribute('aria-label', 'Python code editor for ' + o.label);
        input.setAttribute('id', 'cm-input-' + o.id);
      } catch (e) { /* ignore */ }

      this.cm.on('change', () => {
        if (this.o.onCodeChange) this.o.onCodeChange(this.getCode());
      });

      /* Events */
      this.btnRun.addEventListener('click', () => this.run());
      this.btnStop.addEventListener('click', () => this.stop());
      this.btnReset.addEventListener('click', () => this.resetCode());
      this.btnClear.addEventListener('click', () => this.clearOutput());
      this.btnCopy.addEventListener('click', () => this.copyCode());
      this.btnDownload.addEventListener('click', () => this.download());
      this.btnUpload.addEventListener('click', () => this.fileInput.click());
      this.btnFull.addEventListener('click', () => this.toggleFull());
      this.btnEvidence.addEventListener('click', () => this.captureEvidence());
      this.fileInput.addEventListener('change', (e) => this.openFile(e));

      this.setBadge('Ready', '');
      this.btnStop.disabled = true;
      this.log('Python ready. Press Run (or Ctrl + Enter) to run your program.', 'info');
    }

    mkBtn(parent, label, cls, title) {
      const b = el('button', cls, label);
      b.type = 'button';
      b.title = title;
      parent.appendChild(b);
      return b;
    }

    /* ---------- helpers ---------- */
    getCode() { return this.cm ? this.cm.getValue() : this.textarea.value; }

    setCode(code) {
      if (this.cm) this.cm.setValue(code);
      else this.textarea.value = code;
    }

    /* Insert a snippet at the cursor (used by the Main Activity 2 code helpers). */
    insertSnippet(text) {
      const snippet = String(text || '').replace(/\s+$/, '');
      if (!this.cm) { this.textarea.value += '\n' + snippet + '\n'; return; }

      let cur = this.cm.getCursor();
      /* If the student has not placed the cursor yet, choose a safe spot:
         after the "add your sequence" comment, or just before t.done(). */
      const untouchedCursor = !this.cm.hasFocus() && cur.line === 0 && cur.ch === 0;
      if (untouchedCursor) {
        const lines = this.getCode().split('\n');
        let target = -1;
        for (let i = 0; i < lines.length; i++) {
          if (/add your sequence/i.test(lines[i])) { target = i + 1; break; }
        }
        if (target === -1) {
          for (let i = lines.length - 1; i >= 0; i--) {
            if (/\bdone\s*\(/.test(lines[i])) { target = i; break; }
          }
        }
        if (target === -1) target = lines.length;
        cur = { line: target, ch: 0 };
        this.cm.setCursor(cur);
      }

      const line = this.cm.getLine(cur.line) || '';
      const prefix = (line.slice(0, cur.ch).trim() === '') ? '' : '\n';
      this.cm.replaceRange(prefix + snippet + '\n', cur);
      this.cm.focus();
      this.log('Snippet added at the cursor. Change the numbers to fit your own design.', 'ok');
    }

    /* Replace everything in the editor (used by "Load into the editor"). */
    loadCode(code, message) {
      this.setCode(code);
      this.cm && this.cm.focus();
      this.log(message || 'Code loaded into the editor.', 'ok');
      if (this.o.onCodeChange) this.o.onCodeChange(this.getCode());
    }

    setFilename(name) {
      this.o.filename = name;
      this.fileLabel.textContent = name;
    }

    setBadge(text, kind) {
      this.badge.textContent = text;
      this.badge.className = 'badge' + (kind ? ' ' + kind : '');
    }

    log(text, kind) {
      const line = el('div', kind ? 'line-' + kind : '', text);
      this.console.appendChild(line);
      this.console.scrollTop = this.console.scrollHeight;
    }

    clearOutput() {
      this.console.innerHTML = '';
      while (this.turtleTarget.firstChild) this.turtleTarget.removeChild(this.turtleTarget.firstChild);
      this.turtleTarget.appendChild(this.emptyMsg);
      delete this.turtleTarget.turtleInstance;
      this.log('Output cleared.', 'info');
    }

    resetCode() {
      this.setCode(this.o.starterCode);
      this.log('Starting code restored.', 'info');
      if (this.o.onCodeChange) this.o.onCodeChange(this.getCode());
    }

    copyCode() {
      const code = this.getCode();
      const done = () => this.log('Code copied to the clipboard.', 'ok');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, () => this.fallbackCopy(code, done));
      } else {
        this.fallbackCopy(code, done);
      }
    }

    fallbackCopy(code, done) {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { this.log('Copy failed. Select the code and press Ctrl + C.', 'err'); }
      document.body.removeChild(ta);
    }

    download() {
      const blob = new Blob([this.getCode()], { type: 'text/x-python;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = this.o.filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 500);
      this.log('Downloaded ' + this.o.filename + '. Move it into your T1.1 folder.', 'ok');
      if (this.o.onDownload) this.o.onDownload(this.o.filename);
    }

    openFile(e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        this.setCode(String(r.result));
        this.log('Opened ' + f.name, 'ok');
        if (this.o.onCodeChange) this.o.onCodeChange(this.getCode());
      };
      r.onerror = () => this.log('That file could not be opened.', 'err');
      r.readAsText(f);
      e.target.value = '';
    }

    toggleFull() {
      this.isFull = !this.isFull;
      this.root.classList.toggle('fullscreen', this.isFull);
      this.btnFull.textContent = this.isFull ? 'Exit full screen' : 'Full screen';
      document.body.style.overflow = this.isFull ? 'hidden' : '';
      if (this.cm) setTimeout(() => this.cm.refresh(), 30);
      if (this.isFull) this.cm.focus();
    }

    /* ---------- running Python ---------- */
    run() {
      if (VM_BUSY) {
        this.log('Another program is still running. Press Stop first.', 'err');
        return Promise.resolve(false);
      }
      if (typeof Sk === 'undefined') {
        this.log('The Python engine did not load. Check that the python/skulpt files are present ' +
                 'and that the page is served from a web server rather than opened directly.', 'err');
        return Promise.resolve(false);
      }

      const code = this.getCode();
      const token = ++RUN_TOKEN;
      VM_BUSY = true;
      this.stopped = false;
      this.btnRun.disabled = true;
      this.btnStop.disabled = false;
      this.setBadge('Running…', 'run');
      this.console.innerHTML = '';
      this.log('▶ Running…', 'info');

      /* Fresh turtle target for every run. */
      while (this.turtleTarget.firstChild) this.turtleTarget.removeChild(this.turtleTarget.firstChild);
      delete this.turtleTarget.turtleInstance;

      const self = this;
      const outputs = [];

      Sk.configure({
        output: function (t) { outputs.push(t); if (t !== '\n') self.log(t.replace(/\n$/, ''), ''); },
        read: builtinRead,
        __future__: Sk.python3,
        execLimit: (global.CONFIG ? global.CONFIG.PYTHON_EXEC_LIMIT_SECONDS : 20) * 1000,
        /* killableWhile/killableFor are deliberately OFF: they rely on
           setImmediate, which browsers do not provide. Runaway loops are
           stopped by execLimit instead (checked inside every loop). */
        killableWhile: false,
        killableFor: false,
        inputfunTakesPrompt: true,
        retainGlobals: false
      });
      Sk.execStart = Date.now();
      Sk.dateSet = false;

      Sk.TurtleGraphics = Sk.TurtleGraphics || {};
      Sk.TurtleGraphics.target = this.turtleTarget;
      Sk.TurtleGraphics.width = this.o.width;
      Sk.TurtleGraphics.height = this.o.height;
      Sk.TurtleGraphics.animate = true;
      Sk.TurtleGraphics.bufferSize = 0;
      Sk.TurtleGraphics.allowUndo = true;

      /* The returned promise always settles, even if the student presses Stop
         while the Turtle is still animating. */
      const settled = new Promise(function (resolve) { self._finishResolve = resolve; });

      Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody('<stdin>', false, code, true);
      }, {
        /* Runs at every suspension (each animated Turtle step), so the
           Stop button takes effect immediately. Returning nothing lets
           Skulpt handle the suspension normally. */
        '*': function () {
          if (self.stopped) throw new Sk.builtin.ExternalError('Program stopped by you.');
          return null;
        }
      }).then(function () {
        if (token !== RUN_TOKEN) return false;
        self.finishRun(true, 'Program finished without errors.', outputs.join(''));
        return true;
      }, function (err) {
        if (token !== RUN_TOKEN) return false;
        const info = describeError(err);
        if (self.stopped) {
          self.finishRun(false, 'Program stopped by you.', outputs.join(''), null);
        } else {
          self.finishRun(false, info.text, outputs.join(''), info);
        }
        return false;
      });

      return settled;
    }

    finishRun(ok, message, stdout, errInfo) {
      VM_BUSY = false;
      this.btnRun.disabled = false;
      this.btnStop.disabled = true;
      this.runs += 1;
      this.runCountEl.textContent = 'Runs: ' + this.runs;
      this.lastOk = ok;
      this.lastMessage = message;

      if (ok) {
        this.setBadge('Finished', 'ok');
        this.log('✔ ' + message, 'ok');
      } else {
        this.setBadge(this.stopped ? 'Stopped' : 'Error', 'err');
        this.log('✖ ' + message, 'err');
        if (errInfo && errInfo.advice) this.log('Hint: ' + errInfo.advice, 'info');
        if (errInfo && errInfo.line && this.cm) {
          try {
            this.cm.setCursor({ line: errInfo.line - 1, ch: 0 });
            this.cm.focus();
          } catch (e) { /* ignore */ }
        }
      }

      const img = snapshotTurtle(this.turtleTarget);
      if (img) this.lastImage = img;

      if (this._finishResolve) { const r = this._finishResolve; this._finishResolve = null; r(ok); }

      if (this.o.onRunResult) {
        this.o.onRunResult({
          ok: ok, runs: this.runs, image: this.lastImage,
          message: message, code: this.getCode(), stdout: stdout || ''
        });
      }
    }

    stop() {
      if (!VM_BUSY) return;
      this.stopped = true;
      /* Force the next execution-limit check to fire. */
      try {
        Sk.execStart = Date.now() - ((Sk.execLimit || 20000) + 5000);
      } catch (e) { /* ignore */ }
      /* Cancel any queued turtle animation frames. */
      try { if (Sk.TurtleGraphics && Sk.TurtleGraphics.stop) Sk.TurtleGraphics.stop(); } catch (e) { /* ignore */ }
      RUN_TOKEN += 1;                 /* ignore any late resolution */
      this.finishRun(false, 'Program stopped by you.', '', null);
      this.log('The program was interrupted. Press Run to try again.', 'info');
    }

    /* ---------- evidence ---------- */
    buildEvidenceCanvas() {
      const code = this.getCode();
      const lines = code.replace(/\t/g, '    ').split('\n');
      const student = this.o.student || {};
      const pad = 24;
      const lineH = 17;
      const codeW = 520;
      const imgW = 420;
      const headerH = 88;
      const footerH = 56;
      const bodyH = Math.max(lines.length * lineH + 30, this.o.height + 30, 260);
      const W = pad * 2 + codeW + 24 + imgW;
      const H = headerH + bodyH + footerH;

      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const x = c.getContext('2d');
      if (!x) return null;

      x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
      x.strokeStyle = '#000000'; x.lineWidth = 2; x.strokeRect(1, 1, W - 2, H - 2);

      /* Header */
      x.fillStyle = '#000000';
      x.font = 'bold 18px Arial, sans-serif';
      x.fillText(this.o.label + ' — evidence', pad, 32);
      x.font = '13px Arial, sans-serif';
      x.fillText((student.name || 'Student') + '  ·  Class ' + (student.className || '—') +
                 '  ·  ' + stamp(new Date()), pad, 54);
      x.fillText('File: ' + this.o.filename + '   ·   Runs: ' + this.runs, pad, 72);
      x.beginPath(); x.moveTo(pad, headerH - 8); x.lineTo(W - pad, headerH - 8); x.stroke();

      /* Code */
      x.font = 'bold 12px Arial, sans-serif';
      x.fillText('Code', pad, headerH + 14);
      x.font = '13px "Courier New", Courier, monospace';
      let y = headerH + 34;
      const maxLines = Math.floor((bodyH - 40) / lineH);
      lines.slice(0, maxLines).forEach(function (ln, i) {
        x.fillStyle = '#666666';
        x.fillText(String(i + 1).padStart(2, ' '), pad, y);
        x.fillStyle = '#000000';
        x.fillText(ln.length > 58 ? ln.slice(0, 57) + '…' : ln, pad + 26, y);
        y += lineH;
      });
      if (lines.length > maxLines) {
        x.fillStyle = '#666666';
        x.fillText('… ' + (lines.length - maxLines) + ' more lines', pad + 26, y);
      }

      /* Turtle image */
      const ix = pad + codeW + 24;
      x.fillStyle = '#000000';
      x.font = 'bold 12px Arial, sans-serif';
      x.fillText('Turtle output', ix, headerH + 14);
      x.strokeStyle = '#000000'; x.lineWidth = 1;
      x.strokeRect(ix, headerH + 24, imgW, this.o.height);

      const finish = () => {
        /* Footer message */
        x.fillStyle = '#000000';
        x.font = 'bold 12px Arial, sans-serif';
        x.fillText('Result', pad, H - footerH + 18);
        x.font = '13px Arial, sans-serif';
        const msg = (this.lastOk === null ? 'Not run yet.' : (this.lastOk ? '✔ ' : '✖ ') + this.lastMessage);
        x.fillText(msg.length > 120 ? msg.slice(0, 119) + '…' : msg, pad, H - footerH + 38);
        return c.toDataURL('image/png');
      };

      const snap = snapshotTurtle(this.turtleTarget) || this.lastImage;
      if (!snap) {
        x.fillStyle = '#666666';
        x.font = '13px Arial, sans-serif';
        x.fillText('No Turtle output yet — press Run first.', ix + 12, headerH + 24 + 30);
        return Promise.resolve(finish());
      }

      return new Promise((resolve) => {
        const im = new Image();
        im.onload = () => {
          const scale = Math.min(imgW / im.width, this.o.height / im.height);
          const w = im.width * scale, h = im.height * scale;
          x.drawImage(im, ix + (imgW - w) / 2, headerH + 24 + (this.o.height - h) / 2, w, h);
          resolve(finish());
        };
        im.onerror = () => resolve(finish());
        im.src = snap;
      });
    }

    captureEvidence() {
      const p = this.buildEvidenceCanvas();
      if (!p) { this.log('Evidence could not be created in this browser.', 'err'); return; }
      return Promise.resolve(p).then((dataUrl) => {
        if (!dataUrl) { this.log('Evidence could not be created.', 'err'); return null; }
        this.log('Evidence captured. It will appear in your PDF report.', 'ok');
        if (this.o.onEvidence) this.o.onEvidence(dataUrl);
        return dataUrl;
      });
    }

    refresh() { if (this.cm) this.cm.refresh(); }

    destroy() {
      try { if (this.cm) this.cm.toTextArea(); } catch (e) { /* ignore */ }
      if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    }
  }

  global.PythonIDE = PythonIDE;
  global.PythonRunnerUtils = { snapshotTurtle: snapshotTurtle, describeError: describeError, stamp: stamp };

})(window);
