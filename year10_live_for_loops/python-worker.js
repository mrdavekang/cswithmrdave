/* Local CPython/Pyodide execution, always off the page's main thread. */
import { loadPyodide } from './vendor/python/pyodide.mjs';

const OUTPUT_LIMIT = 12000;
const CODE_LIMIT = 32000;
const OUTPUT_LIMIT_MESSAGE = 'Output stopped after 12,000 characters. Check for a print statement that repeats too often.';
let python = null;
let current = null;
let queuedInputs = [];
let consumedInputs = [];
let inputIndex = 0;
let totalOutput = 0;
let outputLimited = false;
let echoInputs = true;
let streamBuffers = { stdout: '', stderr: '' };
let decoders = { stdout: new TextDecoder(), stderr: new TextDecoder() };

function flush(stream) {
  const text = streamBuffers[stream];
  if (text && current !== null) postMessage({ type: 'output', id: current, stream, text });
  streamBuffers[stream] = '';
}

function flushAll() {
  flush('stdout');
  flush('stderr');
}

function capture(stream, text, stopOnLimit = true) {
  if (current === null || !text) return;
  const remaining = Math.max(0, OUTPUT_LIMIT - totalOutput);
  const accepted = text.slice(0, remaining);
  totalOutput += accepted.length;
  streamBuffers[stream] += accepted;
  if (streamBuffers[stream].includes('\n') || streamBuffers[stream].length >= 512) flush(stream);
  if (text.length > remaining) {
    outputLimited = true;
    flushAll();
    if (stopOnLimit) {
      postMessage({ type: 'output-limit', id: current, error: OUTPUT_LIMIT_MESSAGE });
      throw new Error(OUTPUT_LIMIT_MESSAGE);
    }
  }
}

function writeStream(stream, bytes) {
  capture(stream, decoders[stream].decode(bytes, { stream: true }));
  return bytes.length;
}

// Returning one queued line to CPython preserves the actual built-in input(),
// including use inside functions. No source rewriting or simulated output.
function readInput() {
  flushAll();
  if (inputIndex >= queuedInputs.length) return null;
  const value = queuedInputs[inputIndex++];
  consumedInputs.push(value);
  postMessage({ type: 'input-used', id: current, value });
  if (echoInputs) capture('stdout', value + '\n');
  return value;
}

const setup = String.raw`
import builtins as _runner_builtins
import json as _runner_json
import linecache as _runner_linecache
import sys as _runner_sys
import traceback as _runner_traceback

_runner_standard_streams = (_runner_sys.stdin, _runner_sys.stdout, _runner_sys.stderr)

def _runner_execute(source):
    namespace = {'__name__': '__main__', '__builtins__': dict(vars(_runner_builtins))}
    filename = 'student.py'
    _runner_linecache.cache[filename] = (len(source), None, source.splitlines(True), filename)
    _runner_sys.stdin, _runner_sys.stdout, _runner_sys.stderr = _runner_standard_streams
    try:
        compiled = compile(source, filename, 'exec')
        exec(compiled, namespace)
        return {'ok': True}
    except BaseException as error:
        name = type(error).__name__
        line = getattr(error, 'lineno', None)
        if line is None:
            frames = _runner_traceback.extract_tb(error.__traceback__)
            student_frames = [frame for frame in frames if frame.filename == filename]
            if student_frames:
                line = student_frames[-1].lineno
        message = str(error)
        if isinstance(error, EOFError):
            explanation = 'The queued input lines ran out. Add one line for every input() call, then run again.'
        elif isinstance(error, SyntaxError):
            explanation = getattr(error, 'msg', message)
        else:
            explanation = message or name
        prefix = ('Line ' + str(line) + ': ') if line else ''
        full_traceback = ''.join(_runner_traceback.format_exception(type(error), error, error.__traceback__))
        return {'ok': False, 'error': prefix + name + ' — ' + explanation,
                'line': line, 'errorType': name, 'traceback': full_traceback[:12000]}
    finally:
        # A final print(..., end='') may still be buffered by CPython. Flush
        # before the worker sends its result, including after an exception.
        for stream in _runner_standard_streams[1:]:
            try:
                stream.flush()
            except Exception:
                pass
        _runner_sys.stdin, _runner_sys.stdout, _runner_sys.stderr = _runner_standard_streams
`;

async function initialise() {
  try {
    python = await loadPyodide({ indexURL: new URL('./vendor/python/', import.meta.url).href });
    python.setStdout({ write: bytes => writeStream('stdout', bytes) });
    python.setStderr({ write: bytes => writeStream('stderr', bytes) });
    python.setStdin({ stdin: readInput, autoEOF: true });
    python.runPython(setup);
    postMessage({ type: 'ready', version: python.runPython('_runner_sys.version.split()[0]'), engineVersion: python.version });
  } catch (error) {
    postMessage({ type: 'init-error', error: String(error?.message || error) });
  }
}

self.onmessage = ({ data }) => {
  if (data?.type !== 'run' || !python || current !== null) return;
  const code = String(data.code || '');
  if (code.length > CODE_LIMIT) {
    postMessage({ type: 'done', id: data.id, result: { ok: false, error: 'This editor supports programs up to 32,000 characters.', inputs: [] } });
    return;
  }
  current = data.id;
  queuedInputs = Array.isArray(data.inputs) ? data.inputs.map(String) : [];
  consumedInputs = [];
  inputIndex = 0;
  totalOutput = 0;
  outputLimited = false;
  echoInputs = data.echoInputs !== false;
  streamBuffers = { stdout: '', stderr: '' };
  decoders = { stdout: new TextDecoder(), stderr: new TextDecoder() };
  const started = performance.now();
  try {
    // Reset the input stream as well as the namespace: no buffered entries leak
    // into the next independent classroom run.
    python.setStdin({ stdin: readInput, autoEOF: true });
    python.globals.set('_runner_source', code);
    const result = JSON.parse(python.runPython('_runner_json.dumps(_runner_execute(_runner_source), ensure_ascii=False)'));
    if (result.traceback) {
      capture('stderr', result.traceback, false);
      delete result.traceback;
    }
    flushAll();
    postMessage({ type: 'done', id: current, result: { ...result, inputs: consumedInputs.slice(), outputLimited, durationMs: Math.round(performance.now() - started) } });
  } catch (error) {
    flushAll();
    postMessage({ type: 'done', id: current, result: { ok: false, error: String(error?.message || error), inputs: consumedInputs.slice(), outputLimited, durationMs: Math.round(performance.now() - started) } });
  } finally {
    python.globals.delete('_runner_source');
    current = null;
    queuedInputs = [];
    consumedInputs = [];
  }
};

initialise();
