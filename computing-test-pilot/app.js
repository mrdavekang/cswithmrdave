import { api, publishableKey } from "./connection.js";
import { test } from "./test.js";

const $ = (id) => document.getElementById(id);
const sittingId = new URLSearchParams(location.search).get("s");
const draftKey = `computing-test:${test.key}:${sittingId}`;
const requestHeaders = { apikey: publishableKey };
const timers = new Set();
let sitting;
let attempt;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(text, className) {
  const node = element("button", text, className);
  node.type = "button";
  return node;
}

function persist(value) {
  try {
    sessionStorage.setItem(draftKey, JSON.stringify(value));
  } catch {
    // The current attempt remains usable in memory when storage is disabled.
  }
}

function restore() {
  try {
    return JSON.parse(sessionStorage.getItem(draftKey));
  } catch {
    return null;
  }
}

function showStatus(message) {
  $("status").textContent = message;
}

function saveAnswer(id, value) {
  attempt.answers[id] = value;
  persist(attempt);
  showStatus("Ready to submit.");
}

function questionText(question) {
  const box = element("textarea");
  box.id = `answer-${question.id}`;
  box.setAttribute("aria-labelledby", `title-${question.id}`);
  box.maxLength = 2500;
  box.value = attempt.answers[question.id] ?? "";
  box.addEventListener("input", () => saveAnswer(question.id, box.value));
  return box;
}

function questionOrder(question) {
  const body = element("div");
  const help = element("p", "Drag a row or use its arrow buttons to move it.", "help");
  const order = attempt.answers[question.id] ?? question.items.map((item) => item.id);
  const list = element("ol", "", "row-list");
  list.setAttribute("aria-labelledby", `title-${question.id}`);
  let dragging = null;

  function move(from, to, direction) {
    if (from === to || from < 0 || to < 0 || to >= order.length) return;
    const [id] = order.splice(from, 1);
    order.splice(to, 0, id);
    saveAnswer(question.id, order);
    render();
    if (direction) {
      const row = list.children[to];
      const focusTarget = row.querySelector(`[data-direction="${direction}"]:not(:disabled)`)
        ?? row.querySelector("button:not(:disabled)");
      focusTarget?.focus();
    }
  }

  function render() {
    const rows = order.map((id, index) => {
      const item = question.items.find((entry) => entry.id === id);
      const row = element("li", "", "order-item");
      const handle = element("span", "⠿", "handle");
      handle.setAttribute("aria-hidden", "true");
      row.draggable = true;
      row.addEventListener("dragstart", (event) => {
        dragging = index;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      });
      row.addEventListener("dragover", (event) => {
        if (dragging === null || dragging === index) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        row.classList.add("target");
      });
      row.addEventListener("dragleave", () => row.classList.remove("target"));
      row.addEventListener("dragend", () => {
        dragging = null;
        for (const target of list.querySelectorAll(".target")) target.classList.remove("target");
      });
      row.addEventListener("drop", (event) => {
        event.preventDefault();
        row.classList.remove("target");
        if (dragging !== null) move(dragging, index);
        dragging = null;
      });
      const up = button("↑", "move");
      const down = button("↓", "move");
      up.dataset.direction = "up";
      down.dataset.direction = "down";
      up.disabled = index === 0;
      down.disabled = index === order.length - 1;
      up.setAttribute("aria-label", `Move up: ${item.label}`);
      down.setAttribute("aria-label", `Move down: ${item.label}`);
      up.addEventListener("click", () => move(index, index - 1, "up"));
      down.addEventListener("click", () => move(index, index + 1, "down"));
      row.append(handle, element("span", item.label), up, down);
      return row;
    });
    list.replaceChildren(...rows);
  }

  render();
  attempt.answers[question.id] = order;
  body.append(help, list);
  return body;
}

function questionPython(question) {
  const layout = element("div", "", "python");
  const right = element("div", "", "terminal");
  const code = questionText(question);
  const input = element("textarea");
  const sample = element("label", "Sample input");
  const output = element("pre");
  const actions = element("div", "", "actions");
  const run = button("Run Python");
  const stop = button("Stop");
  let worker;
  let timeout;

  code.className = "code";
  code.spellcheck = false;
  code.autocapitalize = "off";
  code.maxLength = 10000;
  code.value = attempt.answers[question.id] ?? question.starter ?? "";
  attempt.answers[question.id] = code.value;
  input.id = `input-${question.id}`;
  input.value = question.sampleInput ?? "";
  input.maxLength = 1000;
  sample.htmlFor = input.id;
  output.setAttribute("aria-label", "Python output");
  output.setAttribute("role", "status");
  output.textContent = "Output will appear here.";
  stop.disabled = true;

  function finish(message) {
    clearTimeout(timeout);
    worker?.terminate();
    worker = undefined;
    timers.delete(finish);
    output.textContent = message || "Program finished with no output.";
    run.disabled = false;
    stop.disabled = true;
  }

  run.addEventListener("click", () => {
    try {
      worker = new Worker(new URL("./python-worker.js", import.meta.url));
      timers.add(finish);
      worker.onmessage = ({ data }) => finish([data.output.trimEnd(), data.error].filter(Boolean).join("\n"));
      worker.onerror = () => finish("Python could not load. Try refreshing the page.");
      timeout = setTimeout(() => finish("Run timed out. Check for an infinite loop and try again."), 6500);
      output.textContent = "Running…";
      run.disabled = true;
      stop.disabled = false;
      worker.postMessage({ code: code.value, input: input.value });
    } catch {
      finish("Python could not start in this browser.");
    }
  });
  stop.addEventListener("click", () => finish("Run stopped."));
  actions.append(run, stop);
  right.append(sample, input, actions, output);
  layout.append(code, right);
  return layout;
}

function showAttempt() {
  const builders = { order: questionOrder, python: questionPython, text: questionText };
  const cards = test.questions.map((question) => {
    const card = element("section", "", "card");
    const heading = element("h2", question.title);
    heading.id = `title-${question.id}`;
    const body = element("div", "", "question-body");
    body.append(builders[question.type](question));
    card.append(heading, element("p", question.prompt), body);
    return card;
  });
  $("questions").replaceChildren(...cards);
  $("start").hidden = true;
  $("attempt").hidden = false;
  persist(attempt);
  showStatus("Ready to submit.");
  $("title").focus();
}

function showReceipt(id, className) {
  for (const finish of timers) finish("Test submitted.");
  $("start").hidden = true;
  $("attempt").hidden = true;
  $("receipt-context").textContent = `Your answers were saved for ${className}.`;
  $("receipt-id").textContent = id;
  $("receipt").hidden = false;
  $("receipt-title").focus();
}

async function openLink() {
  $("retry-link").hidden = true;
  $("loading").textContent = "Checking your test link…";
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(sittingId ?? "")) {
    $("loading").textContent = "Open the full test link shared by your teacher.";
    return;
  }
  const saved = restore();
  if (saved?.submitted) {
    showReceipt(saved.receipt, saved.className);
    return;
  }

  try {
    const url = new URL(`${api}/computing_test_sittings`);
    url.search = new URLSearchParams({
      select: "id,test_key,class_name",
      id: `eq.${sittingId}`,
      test_key: `eq.${test.key}`,
    });
    const response = await fetch(url, { headers: requestHeaders, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw Error("Cannot check test.");
    [sitting] = await response.json();
  } catch {
    $("loading").textContent = "Could not connect. Check your connection and try again.";
    $("retry-link").hidden = false;
    return;
  }

  if (!sitting) {
    $("loading").textContent = "This test is closed or the link does not match.";
    return;
  }
  $("class-label").textContent = sitting.class_name;
  $("class-label").hidden = false;
  if (saved?.receipt && saved?.answers && saved?.name) {
    attempt = saved;
    showAttempt();
    return;
  }
  $("loading").hidden = true;
  $("identity").hidden = false;
}

$("title").textContent = test.title;
$("description").textContent = test.description;
$("demo-label").hidden = !test.demo;

if (test.demo) {
  const choices = element("select");
  choices.id = "name";
  choices.required = true;
  for (const name of ["", ...test.demoNames]) {
    const option = element("option", name || "Select a sample name");
    option.value = name;
    choices.append(option);
  }
  $("name").replaceWith(choices);
  $("name-label").textContent = "Sample name";
}

$("retry-link").addEventListener("click", openLink);
$("identity").addEventListener("submit", (event) => {
  event.preventDefault();
  const field = $("name");
  const name = field.value.trim();
  if (name.length < 2) {
    field.setCustomValidity("Enter at least two characters.");
    field.reportValidity();
    return;
  }
  attempt = { name, receipt: crypto.randomUUID(), answers: {} };
  showAttempt();
});
$("name").addEventListener("input", (event) => event.target.setCustomValidity(""));

$("attempt").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("submit").disabled = true;
  $("questions").inert = true;
  showStatus("Sending answers…");
  try {
    const response = await fetch(`${api}/computing_test_responses`, {
      method: "POST",
      headers: { ...requestHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        receipt: attempt.receipt,
        sitting_id: sitting.id,
        student_name: attempt.name,
        answers: attempt.answers,
      }),
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => ({}));
      if (response.status !== 409 || problem.code !== "23505") {
        showStatus(problem.code === "42501"
          ? "This test is closed. Tell your teacher before closing this tab."
          : "Answers could not be saved. Try submitting again.");
        return;
      }
    }
    persist({ submitted: true, receipt: attempt.receipt, className: sitting.class_name });
    showReceipt(attempt.receipt, sitting.class_name);
    attempt = null;
  } catch {
    showStatus("Could not confirm submission. Check your connection and try again.");
  } finally {
    $("submit").disabled = false;
    $("questions").inert = false;
  }
});

openLink();
