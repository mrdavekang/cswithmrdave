"use strict";

const el = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g,
  (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const sitting = el("sitting");
const detail = el("attempt");
const timeFormat = new Intl.DateTimeFormat("en-MY", {
  hour: "numeric", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kuala_Lumpur",
});
const time = (value) => value ? timeFormat.format(new Date(value)) : "—";
let teacherKey = "";
let form = "A";
let snapshot;
let busy = false;
let polling = false;

function request(action, payload = {}) {
  return assessmentRequest({ ...payload, action: "teacher_" + action, teacherKey, form });
}

function announce(message, error = false) {
  const node = el("teacher-status");
  node.textContent = message;
  node.className = message ? "notice" + (error ? " error" : "") : "";
}

function studentLink(s) {
  const link = new URL("./", location.href);
  link.searchParams.set("class", s.className.toLowerCase());
  link.hash = s.classKey;
  return link.href;
}

function view(force = false) {
  if (!snapshot || !teacherKey) return;
  const s = snapshot[form];
  const key = JSON.stringify([form, s.status, s.end, s.seats]);
  if (!force && key === sitting.dataset.view) return;
  sitting.dataset.view = key;

  const stateLabels = { closed: "Ready to start", running: "Test running", finished: "Test ended" };
  const label = stateLabels[s.status];
  const submitted = s.seats.filter((seat) => seat.submitted).length;
  const link = escapeHtml(studentLink(s));

  let actions = "";
  if (s.status === "closed") actions = '<button class="primary" data-act="start">Start test</button>';
  if (s.status === "running") actions = '<button class="secondary" data-act="finish">End test now</button>';
  if (s.status === "finished") actions = '<button class="primary" data-act="export">Download records</button>';

  const duplicateNames = new Map();
  for (const seat of s.seats) {
    const name = seat.name.toLowerCase();
    duplicateNames.set(name, (duplicateNames.get(name) ?? 0) + 1);
  }
  const rows = s.seats.map((seat) => {
    const name = escapeHtml(seat.name);
    const duplicate = duplicateNames.get(seat.name.toLowerCase()) > 1;
    const status = seat.submitted ? "Submitted" : seat.lastSaved ? "Saved at " + time(seat.lastSaved) : "Joined";
    return '<tr><th scope="row">' + name + (duplicate ? ' <span class="pill">Same name</span>' : "") +
      '</th><td>' + seat.answered + '/20</td><td>' + status + '</td><td><button class="secondary" data-act="inspect" data-id="' +
      escapeHtml(seat.id) + '">View work</button></td></tr>';
  }).join("");

  sitting.innerHTML = '<section class="card"><p class="eyebrow">FORM ' + form + " · YEAR " + escapeHtml(s.className) +
    '</p><div class="between"><h2>' + label + '</h2><span class="pill">' + s.seats.length + " joined · " + submitted +
    ' submitted</span></div><p><strong>Class link</strong><br><a class="class-link" target="_blank" rel="noopener noreferrer" href="' +
    link + '">' + link + '</a></p><div class="toolbar"><button class="secondary" data-act="copy">Copy class link</button>' +
    actions + '</div>' +
    (s.status === "running" ? '<p>Ends at <strong>' + time(s.end) + '</strong> Malaysia time. The latest saved work is submitted at the deadline.</p>' : "") +
    (rows ? '<div class="table-wrap"><table><thead><tr><th scope="col">Student</th><th scope="col">Answered</th><th scope="col">Status</th><th scope="col">Work</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>' : "") + '</section>';
  if (busy) sitting.querySelectorAll("button").forEach((node) => { node.disabled = true; });
}

function select(newForm) {
  if (busy || !snapshot) return;
  form = newForm;
  detail.hidden = true;
  for (const [id, value] of [["a","A"], ["b","B"]]) {
    const node = el(id);
    node.className = value === form ? "primary" : "secondary";
    node.setAttribute("aria-pressed", String(value === form));
  }
  view(true);
}

async function update() {
  if (!teacherKey || busy || polling) return;
  const key = teacherKey;
  polling = true;
  try {
    const data = await request("status");
    if (teacherKey === key && !busy) { snapshot = data; view(); }
  } catch (error) {
    if (teacherKey === key) announce(error.message, true);
  } finally {
    polling = false;
  }
}

function lock() {
  teacherKey = "";
  snapshot = undefined;
  sitting.replaceChildren();
  detail.replaceChildren();
  detail.hidden = true;
  el("controls").hidden = true;
  el("access").hidden = false;
  el("access-status").textContent = "";
  el("teacher-key").focus();
}

el("unlock-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  el("unlock").disabled = true;
  teacherKey = el("teacher-key").value.trim();
  el("teacher-key").value = "";
  el("access-status").textContent = "Opening teacher desk…";
  try {
    snapshot = await request("status");
    el("access").hidden = true;
    el("controls").hidden = false;
    select("A");
    el("a").focus();
  } catch (error) {
    teacherKey = "";
    el("access-status").textContent = error.message;
  } finally {
    el("unlock").disabled = false;
  }
});

function download(records) {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Year8-" + records.className + "-assessment-records.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function inspect(data) {
  const saved = data.submitted ? "Submitted " + time(data.submitted.at) : "Last saved " + time(data.lastSaved);
  detail.innerHTML = '<div class="between"><h2>' + escapeHtml(data.name) +
    '</h2><button class="secondary" type="button" id="close-detail">Close</button></div><p>' + saved + '</p>' +
    Array.from({ length: 20 }, (_, index) => {
      const id = index + 1;
      const value = data.answers[id];
      const text = escapeHtml(Array.isArray(value) ? value.join(" → ") : value);
      return '<details class="grade-row"><summary>Question ' + id + (data.flags.includes(String(id)) ? " · Flagged" : "") +
        '</summary>' + (value == null ? '<p>Unanswered.</p>' : '<pre>' + text + '</pre>') + '</details>';
    }).join("");
  detail.hidden = false;
  el("close-detail").onclick = () => { detail.hidden = true; detail.replaceChildren(); };
  detail.scrollIntoView({ block: "nearest" });
}

sitting.addEventListener("click", async (event) => {
  const node = event.target.closest("[data-act]");
  if (!node || busy || !teacherKey) return;
  const { act, id } = node.dataset;
  const key = teacherKey;
  if (act === "copy") {
    try {
      await navigator.clipboard.writeText(studentLink(snapshot[form]));
      announce("Class link copied.");
    } catch {
      announce("Select the class link to copy it.", true);
    }
    return;
  }
  if (act === "start" && !await confirmAction("Start the shared 40-minute timer for this class?", "Start test")) return;
  if (act === "finish" && !await confirmAction("End this sitting now and lock all saved answers?", "End and lock")) return;
  if (busy || teacherKey !== key) return;
  busy = true;
  view(true);
  try {
    const data = await request(act === "inspect" ? "attempt" : act, { id });
    if (teacherKey !== key) return;
    if (act === "export") download(data);
    else if (act === "inspect") inspect(data);
    else snapshot = data;
    announce("");
  } catch (error) {
    if (teacherKey === key) announce(error.message, true);
  } finally {
    busy = false;
    view(true);
  }
});

el("a").onclick = () => select("A");
el("b").onclick = () => select("B");
el("refresh").onclick = () => void update();
el("lock").onclick = lock;
setInterval(() => void update(), 8000);
