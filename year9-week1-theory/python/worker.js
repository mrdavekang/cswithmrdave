/* Local Pyodide module worker. Student code never leaves the browser. */
import { loadPyodide } from "./runtime/pyodide.mjs";
let pyodide = null;
let pendingInputResolve = null;
let queuedInputs = [];
let activeRunId = null;

self.pyInput = function pyInput(promptText = "") {
  const prompt = String(promptText ?? "");
  if (queuedInputs.length) {
    const value = String(queuedInputs.shift());
    postMessage({ type: "queuedInput", runId: activeRunId, prompt, value });
    return Promise.resolve(value);
  }
  return new Promise((resolve) => {
    pendingInputResolve = resolve;
    postMessage({ type: "inputRequest", runId: activeRunId, prompt });
  });
};

function transformStudentCode(source) {
  const original = String(source ?? "").replace(/\r\n/g, "\n");
  // Browser-friendly asynchronous input while retaining a genuine Python runtime.
  const withAsyncInput = original.replace(/\binput\s*\(/g, "await py_input(");
  const lines = withAsyncInput.split("\n");
  const indented = lines.map((line) => `    ${line}`).join("\n");
  return [
    "from js import pyInput",
    "async def py_input(prompt=''):",
    "    return await pyInput(str(prompt))",
    "",
    "async def __student_main__():",
    indented || "    pass",
    "",
    "await __student_main__()",
  ].join("\n");
}

function studentLineFromError(text) {
  const matches = [...String(text).matchAll(/line\s+(\d+)/gi)].map((m) => Number(m[1]));
  if (!matches.length) return null;
  // Student code starts on transformed line 6.
  const candidates = matches.map((n) => n - 5).filter((n) => n >= 1);
  return candidates.length ? candidates[candidates.length - 1] : null;
}

async function initialise() {
  try {
    const runtimeURL = new URL("./runtime/", import.meta.url).href;
    pyodide = await loadPyodide({ indexURL: runtimeURL });
    pyodide.setStdout({
      batched: (text) => postMessage({ type: "stdout", runId: activeRunId, text: String(text) }),
    });
    pyodide.setStderr({
      batched: (text) => postMessage({ type: "stderr", runId: activeRunId, text: String(text) }),
    });
    postMessage({ type: "ready", version: pyodide.version || "Python 3" });
  } catch (error) {
    postMessage({ type: "initError", message: String(error?.stack || error) });
  }
}

onmessage = async (event) => {
  const data = event.data || {};
  if (data.type === "inputResponse") {
    if (pendingInputResolve) {
      const resolve = pendingInputResolve;
      pendingInputResolve = null;
      resolve(String(data.value ?? ""));
    }
    return;
  }

  if (data.type !== "run" || !pyodide) return;

  activeRunId = data.runId;
  queuedInputs = Array.isArray(data.inputs) ? [...data.inputs] : [];
  pendingInputResolve = null;
  postMessage({ type: "runStart", runId: activeRunId });

  try {
    const transformed = transformStudentCode(data.code);
    await pyodide.runPythonAsync(transformed);
    postMessage({ type: "runComplete", runId: activeRunId, ok: true });
  } catch (error) {
    const message = String(error?.stack || error);
    postMessage({
      type: "runComplete",
      runId: activeRunId,
      ok: false,
      error: message,
      line: studentLineFromError(message),
    });
  } finally {
    pendingInputResolve = null;
    queuedInputs = [];
    activeRunId = null;
  }
};

initialise();
