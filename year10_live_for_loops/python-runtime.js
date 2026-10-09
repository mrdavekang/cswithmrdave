(function () {
  'use strict';
  const scriptURL = document.currentScript?.src || document.baseURI;
  const defaultWorkerURL = new URL('python-worker.js', scriptURL).href;
  const CODE_LIMIT = 32000;
  const INPUT_LIMIT = 100;
  const INPUT_CHARACTER_LIMIT = 16000;
  const OUTPUT_LIMIT = 12000;
  const DEFAULT_TIMEOUT = 8000;

  function normalizeInputs(inputs) {
    if (inputs === undefined || inputs === null || inputs === '') return [];
    if (typeof inputs === 'string') {
      const lines = inputs.replace(/\r\n?/g, '\n').split('\n');
      // A trailing line ending finishes the last entry; it is not another input.
      if (lines[lines.length - 1] === '') lines.pop();
      return lines;
    }
    if (!Array.isArray(inputs)) throw new Error('Enter input values as one line per input() call.');
    const values = inputs.map(value => String(value));
    if (values.some(value => /[\r\n]/.test(value))) throw new Error('Each queued input must contain a single line.');
    return values;
  }

  class PythonRunner {
    constructor(options = {}) {
      if (typeof options === 'function') options = { onStatus: options };
      this.onStatus = options.onStatus || null;
      this.onOutput = options.onOutput || null;
      this.echoInputs = options.echoInputs !== false;
      this.workerURL = options.workerURL || defaultWorkerURL;
      this.timeoutMs = Number.isFinite(options.timeoutMs) ? Math.max(100, Math.min(30000, options.timeoutMs)) : DEFAULT_TIMEOUT;
      this.version = '';
      this.state = 'idle';
      this._worker = null;
      this._initialising = null;
      this._initResolve = null;
      this._initReject = null;
      this._loadTimer = null;
      this._runTimer = null;
      this._pending = null;
      this._nextId = 0;
      this._closed = false;
    }

    _status(state, message) {
      this.state = state;
      try { this.onStatus?.({ state, message, version: this.version }); } catch (error) { console.warn('Python status display failed.', error); }
    }

    init() {
      if (this._closed) return Promise.reject(new Error('This Python runner has been closed.'));
      if (this._initialising) return this._initialising;
      if (location.protocol === 'file:') return Promise.reject(new Error('Real Python needs an HTTP or HTTPS page. Upload the complete lesson folder to GitHub Pages, or open it through a local web server.'));
      this._status('loading', 'Loading real Python…');
      this._initialising = new Promise((resolve, reject) => {
        this._initResolve = resolve;
        this._initReject = reject;
      });
      const initialising = this._initialising;
      try {
        const worker = new Worker(this.workerURL, { type: 'module' });
        this._worker = worker;
        worker.onmessage = event => {
          if (this._worker !== worker) return;
          this._handleMessage(event.data);
        };
        worker.onerror = event => {
          if (this._worker !== worker) return;
          event.preventDefault?.();
          const message = event.message || 'The Python worker could not start. Check that every vendor/python file was uploaded.';
          this._failWorker(message);
        };
        this._loadTimer = setTimeout(() => this._failWorker('Python did not finish loading. Check the local runtime files and the browser’s WebAssembly support.'), 30000);
      } catch (error) {
        this._failWorker(String(error?.message || error));
      }
      return initialising;
    }

    _handleMessage(data) {
      if (!data || typeof data.type !== 'string') return;
      if (data.type === 'ready') {
        clearTimeout(this._loadTimer);
        this._loadTimer = null;
        this.version = String(data.version || '3');
        const resolve = this._initResolve;
        this._initResolve = null;
        this._initReject = null;
        this._status('ready', 'Python ' + this.version + ' ready.');
        resolve?.(this);
        return;
      }
      if (data.type === 'init-error') {
        this._failWorker('Python could not load: ' + String(data.error || 'unknown error'));
        return;
      }
      const pending = this._pending;
      if (!pending || data.id !== pending.id) return;
      if (data.type === 'output') {
        const stream = data.stream === 'stderr' ? 'stderr' : 'stdout';
        const room = OUTPUT_LIMIT - pending.stdout.length - pending.stderr.length;
        const text = String(data.text || '').slice(0, Math.max(0, room));
        pending[stream] += text;
        if (text) {
          try { this.onOutput?.(text, stream); } catch (error) { console.warn('Python output display failed.', error); }
        }
      } else if (data.type === 'input-used') {
        if (pending.inputs.length < INPUT_LIMIT) pending.inputs.push(String(data.value || ''));
      } else if (data.type === 'output-limit') {
        this.stop(String(data.error || 'The output limit was reached.'), { outputLimited: true });
      } else if (data.type === 'done') {
        const result = data.result || { ok: false, error: 'Python returned no result.' };
        this._finish(result);
      }
    }

    _terminate() {
      clearTimeout(this._loadTimer);
      clearTimeout(this._runTimer);
      this._loadTimer = null;
      this._runTimer = null;
      this._worker?.terminate();
      this._worker = null;
      this._initialising = null;
      this._initResolve = null;
    }

    _failWorker(message) {
      const reject = this._initReject;
      this._initReject = null;
      this._terminate();
      reject?.(new Error(message));
      if (this._pending) this._finish({ ok: false, error: message });
      this._status('error', message);
    }

    _finish(result) {
      clearTimeout(this._runTimer);
      this._runTimer = null;
      const pending = this._pending;
      this._pending = null;
      if (!pending) return;
      const finished = {
        ...result,
        ok: result.ok === true,
        stdout: pending.stdout,
        stderr: pending.stderr,
        inputs: Array.isArray(result.inputs) ? result.inputs.slice(0, INPUT_LIMIT).map(String) : pending.inputs,
        durationMs: Number.isFinite(result.durationMs) ? result.durationMs : Math.round(performance.now() - pending.startedAt),
        code: pending.code
      };
      if (finished.ok) this._status('ready', 'Run complete.');
      else if (!finished.stopped) this._status('error', String(finished.error || 'Python encountered an error.'));
      pending.resolve(finished);
    }

    run(source, inputs = [], options = {}) {
      const code = String(source ?? '');
      if (this._pending) return Promise.reject(new Error('A program is already running. Stop it before starting another run.'));
      let queued;
      let error;
      try {
        queued = normalizeInputs(inputs);
        if (this._closed) throw new Error('This Python runner has been closed.');
        if (code.length > CODE_LIMIT) throw new Error('This editor supports programs up to 32,000 characters.');
        if (queued.length > INPUT_LIMIT) throw new Error('Use no more than 100 queued input lines.');
        if (queued.reduce((size, value) => size + value.length, 0) > INPUT_CHARACTER_LIMIT) throw new Error('Queued inputs are too long. Keep the combined input below 16,000 characters.');
      } catch (failure) { error = String(failure?.message || failure); }
      if (error) {
        this._status('error', error);
        return Promise.resolve({ ok: false, stdout: '', stderr: '', error, inputs: [], durationMs: 0, code });
      }
      const id = ++this._nextId;
      const promise = new Promise(resolve => {
        this._pending = { id, resolve, code, stdout: '', stderr: '', inputs: [], startedAt: performance.now() };
      });
      (async () => {
        try {
          await this.init();
          if (!this._pending || this._pending.id !== id) return;
          const timeoutMs = Number.isFinite(options.timeoutMs) ? Math.max(100, Math.min(30000, options.timeoutMs)) : this.timeoutMs;
          this._pending.startedAt = performance.now();
          this._status('running', 'Running Python…');
          this._runTimer = setTimeout(() => this.stop('Run stopped after ' + (timeoutMs / 1000) + ' seconds. Check that the loop finishes. Your code is kept.', { timedOut: true }), timeoutMs);
          this._worker.postMessage({ type: 'run', id, code, inputs: queued, echoInputs: options.echoInputs ?? this.echoInputs });
        } catch (failure) {
          if (this._pending?.id === id) this._finish({ ok: false, error: String(failure?.message || failure) });
        }
      })();
      return promise;
    }

    stop(message = 'Program stopped. Your code is kept. Run again when you are ready.', extra = {}) {
      const wasActive = Boolean(this._worker || this._pending);
      const reject = this._initReject;
      this._initReject = null;
      this._terminate();
      reject?.(new Error(message));
      if (this._pending) this._finish({ ok: false, stopped: true, error: message, ...extra });
      if (!this._closed) this._status('stopped', message);
      return wasActive;
    }

    close() {
      this._closed = true;
      this.stop('Python runner closed. Your code is kept.');
      this._status('closed', 'Python runner closed.');
    }
  }

  window.PythonRunner = PythonRunner;
})();
