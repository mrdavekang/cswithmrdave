(() => {
  "use strict";

  const LESSON_ID = "year8-t1-week2-theory-smart-badge-algorithms";
  const SCHEMA_VERSION = 2;
  const DB_NAME = "Year8Week2TheoryDB";
  const STORE_NAME = "progress";
  const LAST_PROFILE_KEY = "year8_week2_theory_last_profile";
  const SAVE_DELAY = 350;

  const SECTION_CONFIG = [
    { id: "overview", label: "Overview", required: true },
    { id: "starter", label: "Starter", required: true },
    { id: "activity1", label: "Main Activity 1", required: true },
    { id: "activity2", label: "Main Activity 2", required: true },
    { id: "extension", label: "Extension", required: false },
    { id: "plenary", label: "Plenary", required: true },
    { id: "review", label: "Review & PDF", required: true },
  ];

  const CORE_PROGRESS = ["overview", "starter", "activity1", "activity2", "plenary"];
  const RESPONSE_CHECK_MAP = {
    starter_input: ["starterIpo", "starterIpoFeedback"],
    starter_outputs: ["starterIpo", "starterIpoFeedback"],
    starter_type: ["starterPrecision", "starterPrecisionFeedback"],
    starter_improvement: ["starterPrecision", "starterPrecisionFeedback"],
    a1_definition: ["a1q1", "a1q1Feedback"],
    a1_relationship: ["a1q2", "a1q2Feedback"],
    a1_why_vague: ["a1q3", "a1q3Feedback"],
    a1_precise_rewrite: ["a1q3", "a1q3Feedback"],
    a1_decomposition: ["a1q4", "a1q4Feedback"],
    a1_dryer_input: ["a1q5", "a1q5Feedback"],
    a1_dryer_process: ["a1q5", "a1q5Feedback"],
    a1_dryer_output: ["a1q5", "a1q5Feedback"],
    a2_symbol_start: ["a2q1", "a2q1Feedback"],
    a2_symbol_input: ["a2q2", "a2q2Feedback"],
    a2_arrow_purpose: ["a2q3", "a2q3Feedback"],
    a2_decision_labels: ["a2q4", "a2q4Feedback"],
    a2_executable: ["a2q5", "a2q5Feedback"],
    a2_executable_explain: ["a2q5", "a2q5Feedback"],
  };
  const CORRECT_SEQUENCE = [
    "Start the badge.",
    "Display a welcome icon.",
    "Wait for Button A to be pressed.",
    "Display the student’s initials.",
  ];
  const INITIAL_SEQUENCE = [
    "Display the student’s initials.",
    "Start the badge.",
    "Wait for Button A to be pressed.",
    "Display a welcome icon.",
  ];

  const RESPONSE_LABELS = {
    overview_ready: "Ready to begin",
    starter_input: "Starter — input event",
    starter_outputs: "Starter — outputs",
    starter_type: "Starter — algorithm or program",
    starter_improvement: "Improved vague instruction",
    a1_read_algorithms: "Reading opened — Algorithm and program",
    a1_read_decomposition: "Reading opened — Decomposition and IPO",
    a1_definition: "Definition of an algorithm",
    a1_relationship: "Relationship between an algorithm and a program",
    a1_why_vague: "Why the instruction is vague",
    a1_precise_rewrite: "Precise rewritten instruction",
    a1_decomposition: "Meaning of decomposition",
    a1_dryer_input: "Hand dryer input",
    a1_dryer_process: "Hand dryer processing",
    a1_dryer_output: "Hand dryer output",
    decomp_start: "Smart Badge — starting display subproblem",
    decomp_input: "Smart Badge — input subproblem",
    decomp_process: "Smart Badge — processing subproblem",
    decomp_output: "Smart Badge — output subproblem",
    decomp_testing: "Smart Badge — testing subproblem",
    decomp_why: "Why decomposition helps",
    a1_evidence_caption: "Activity 1 evidence caption",
    a2_read: "Activity 2 reading completed",
    a2_symbol_start: "Start/End symbol",
    a2_symbol_input: "Input/Output symbol",
    a2_arrow_purpose: "Purpose of arrows",
    a2_decision_labels: "Why decision paths need labels",
    a2_executable: "Can a flowchart be executed directly?",
    a2_executable_explain: "Flowchart execution explanation",
    badge_input: "Smart Badge IPO — Input",
    badge_process: "Smart Badge IPO — Process",
    badge_output: "Smart Badge IPO — Output",
    algorithm_step_1: "Algorithm step 1",
    algorithm_step_2: "Algorithm step 2",
    algorithm_step_3: "Algorithm step 3",
    algorithm_step_4: "Algorithm step 4",
    algorithm_step_5: "Algorithm step 5",
    algorithm_step_6: "Algorithm step 6",
    flow_start: "Flowchart checklist — Start oval",
    flow_io: "Flowchart checklist — Input/Output symbols",
    flow_process: "Flowchart checklist — Process rectangle",
    flow_arrows: "Flowchart checklist — Connected arrows",
    flow_matches: "Flowchart checklist — Matches algorithm",
    flowchart_caption: "Flowchart evidence caption",
    tester_name: "Tester",
    peer_feedback: "Peer/self-test finding",
    algorithm_improvement: "Correction or justified successful test",
    ext_steps_strength: "Extension — numbered instructions strength",
    ext_steps_limit: "Extension — numbered instructions limitation",
    ext_flow_strength: "Extension — flowchart strength",
    ext_flow_limit: "Extension — flowchart limitation",
    ext_pseudo_strength: "Extension — pseudocode strength",
    ext_pseudo_limit: "Extension — pseudocode limitation",
    ext_button_b: "Extension — Button B adaptation",
    plenary_algorithm: "Plenary — an algorithm is",
    plenary_difference: "Plenary — algorithm versus program",
    plenary_input: "Plenary — Smart Badge input",
    plenary_process: "Plenary — Smart Badge process",
    plenary_output: "Plenary — Smart Badge output",
    plenary_improve: "Plenary — improved instruction",
    plenary_decomposition: "Plenary — how decomposition helped",
    plenary_led: "Plenary — why the LED matrix is an output",
    plenary_readiness: "Plenary — readiness",
  };

  const VALUE_LABELS = {
    overview_ready: { true: "Confirmed — ready to begin" },
    starter_input: { microbit: "The micro:bit", button: "Button A is pressed", initials: "The initials appear" },
    starter_outputs: { icon: "The welcome icon", button: "Button A", initials: "The student’s initials", instructions: "The stored instructions" },
    starter_type: { algorithm: "An algorithm", program: "A finished program", output: "An output device" },
    a1_read_algorithms: { true: "Opened and studied" },
    a1_read_decomposition: { true: "Opened and studied" },
    a1_definition: { any: "Any instructions written by a programmer", precise: "A precise, ordered set of steps for solving a problem", errorfree: "A program containing no errors" },
    a1_relationship: { same: "An algorithm and a program are exactly the same thing", planImplementation: "An algorithm is the plan; a program is an implementation written in a programming language", hardware: "An algorithm is hardware; a program is an output device" },
    a1_decomposition: { remove: "Removing all difficult parts", python: "Turning an algorithm into Python", break: "Breaking a large problem into smaller subproblems" },
    a2_read: { true: "Reading and examples studied" },
    a2_symbol_start: { rectangle: "Rectangle", oval: "Oval", diamond: "Diamond", parallelogram: "Parallelogram" },
    a2_symbol_input: { rectangle: "Rectangle", oval: "Oval", diamond: "Diamond", parallelogram: "Parallelogram" },
    a2_executable: { true: "True", false: "False" },
    plenary_readiness: { ready: "Ready to program", nearly: "Nearly ready but needs one correction", notready: "Not ready because a step is still missing" },
  };

  const REVIEW_GROUPS = [
    {
      title: "Learning overview",
      section: "overview",
      keys: ["overview_ready"],
    },
    {
      title: "Starter",
      section: "starter",
      keys: ["starter_input", "starter_outputs", "starter_type", "starter_improvement"],
    },
    {
      title: "Main Activity 1 — Theory Check",
      section: "activity1",
      keys: ["a1_read_algorithms", "a1_read_decomposition", "a1_definition", "a1_relationship", "a1_why_vague", "a1_precise_rewrite", "a1_decomposition", "a1_dryer_input", "a1_dryer_process", "a1_dryer_output"],
    },
    {
      title: "Main Activity 1 — Smart Badge Decomposition",
      section: "activity1",
      keys: ["decomp_start", "decomp_input", "decomp_process", "decomp_output", "decomp_testing", "decomp_why", "a1_evidence_caption"],
    },
    {
      title: "Main Activity 2 — Flowchart Check",
      section: "activity2",
      keys: ["a2_read", "a2_symbol_start", "a2_symbol_input", "a2_arrow_purpose", "a2_decision_labels", "a2_executable", "a2_executable_explain"],
    },
    {
      title: "Main Activity 2 — Smart Badge IPO and Algorithm",
      section: "activity2",
      keys: ["badge_input", "badge_process", "badge_output", "algorithm_step_1", "algorithm_step_2", "algorithm_step_3", "algorithm_step_4", "algorithm_step_5", "algorithm_step_6"],
    },
    {
      title: "Main Activity 2 — Testing and Improvement",
      section: "activity2",
      keys: ["flow_start", "flow_io", "flow_process", "flow_arrows", "flow_matches", "flowchart_caption", "tester_name", "peer_feedback", "algorithm_improvement"],
    },
    {
      title: "Optional Extension",
      section: "extension",
      optional: true,
      keys: ["ext_steps_strength", "ext_steps_limit", "ext_flow_strength", "ext_flow_limit", "ext_pseudo_strength", "ext_pseudo_limit", "ext_button_b"],
    },
    {
      title: "Plenary",
      section: "plenary",
      keys: ["plenary_algorithm", "plenary_difference", "plenary_input", "plenary_process", "plenary_output", "plenary_improve", "plenary_decomposition", "plenary_led", "plenary_readiness"],
    },
  ];

  let state = null;
  let stateKey = "";
  let dbPromise = null;
  let saveTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function defaultState(student, teacherMode = false) {
    return {
      lessonId: LESSON_ID,
      schemaVersion: SCHEMA_VERSION,
      student,
      teacherMode,
      currentSection: "overview",
      sequence: [...INITIAL_SEQUENCE],
      responses: {},
      checks: {},
      completed: {},
      evidence: { activity1: null, flowchart: null },
      timestamps: {
        started: new Date().toISOString(),
        lastSaved: null,
        completed: {},
      },
    };
  }

  function normalizeState(saved, student, teacherMode) {
    const fresh = defaultState(student, teacherMode);
    if (!saved || saved.lessonId !== LESSON_ID || Number(saved.schemaVersion) !== SCHEMA_VERSION) return fresh;
    return {
      ...fresh,
      ...saved,
      lessonId: LESSON_ID,
      schemaVersion: SCHEMA_VERSION,
      student,
      teacherMode,
      sequence: Array.isArray(saved.sequence) && saved.sequence.length === 4 ? saved.sequence : fresh.sequence,
      responses: { ...fresh.responses, ...(saved.responses || {}) },
      checks: { ...fresh.checks, ...(saved.checks || {}) },
      completed: { ...fresh.completed, ...(saved.completed || {}) },
      evidence: { ...fresh.evidence, ...(saved.evidence || {}) },
      timestamps: {
        ...fresh.timestamps,
        ...(saved.timestamps || {}),
        completed: { ...fresh.timestamps.completed, ...(saved.timestamps?.completed || {}) },
      },
    };
  }

  function openDatabase() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("IndexedDB unavailable"));
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Unable to open browser storage"));
    });
    return dbPromise;
  }

  async function loadSavedState(key) {
    try {
      const db = await openDatabase();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(key);
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject(request.error);
      });
    } catch {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    }
  }

  async function persistState() {
    if (!state || !stateKey) return;
    state.timestamps.lastSaved = new Date().toISOString();
    setSaveStatus("Saving…");
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put({ key: stateKey, data: state });
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      localStorage.setItem(LAST_PROFILE_KEY, JSON.stringify(state.student));
      setSaveStatus("Saved");
    } catch {
      try {
        localStorage.setItem(stateKey, JSON.stringify(state));
        localStorage.setItem(LAST_PROFILE_KEY, JSON.stringify(state.student));
        setSaveStatus("Saved locally");
      } catch {
        setSaveStatus("Save failed");
      }
    }
  }

  async function deleteSavedState(key) {
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      localStorage.removeItem(key);
    }
  }

  function scheduleSave() {
    if (!state) return;
    setSaveStatus("Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => persistState(), SAVE_DELAY);
  }

  function setSaveStatus(message) {
    const target = $("#saveStatus");
    if (target) target.textContent = message;
  }

  function slug(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 60) || "Student";
  }

  function buildStateKey(name, className, teacherMode) {
    return teacherMode
      ? `${LESSON_ID}:teacher-review`
      : `${LESSON_ID}:student:${slug(className)}:${slug(name)}`;
  }

  function setResponse(key, value) {
    if (!state) return;
    state.responses[key] = value;
    const dependency = RESPONSE_CHECK_MAP[key];
    if (dependency) {
      delete state.checks[dependency[0]];
      const feedback = $(`#${dependency[1]}`);
      if (feedback) feedback.hidden = true;
    }
    scheduleSave();
  }

  function getResponse(key) {
    return state?.responses?.[key];
  }

  function responseText(key) {
    const value = getResponse(key);
    const labels = VALUE_LABELS[key] || {};
    if (Array.isArray(value)) return value.map((item) => labels[item] || item).join(", ");
    if (typeof value === "boolean") return labels[String(value)] || (value ? "Yes" : "No");
    if (labels[value]) return labels[value];
    return value == null || value === "" ? "Not answered" : String(value);
  }

  function textLongEnough(key, min = 8) {
    return String(getResponse(key) || "").trim().length >= min;
  }

  function getTrackedValue(key) {
    const elements = $$(`[data-track="${CSS.escape(key)}"]`);
    if (!elements.length) return undefined;
    const first = elements[0];
    if (first.type === "radio") return elements.find((el) => el.checked)?.value || "";
    if (first.type === "checkbox") {
      if (elements.length === 1) return first.checked;
      return elements.filter((el) => el.checked).map((el) => el.value);
    }
    return first.value;
  }

  function restoreTrackedInputs() {
    $$('[data-track]').forEach((element) => {
      const key = element.dataset.track;
      const value = state.responses[key];
      if (element.type === "radio") element.checked = value === element.value;
      else if (element.type === "checkbox") {
        const group = $$(`[data-track="${CSS.escape(key)}"]`);
        element.checked = group.length === 1 ? Boolean(value) : Array.isArray(value) && value.includes(element.value);
      } else if (value != null) element.value = value;
    });
  }

  function initialiseTracking() {
    $$('[data-track]').forEach((element) => {
      const handler = () => setResponse(element.dataset.track, getTrackedValue(element.dataset.track));
      element.addEventListener("input", handler);
      element.addEventListener("change", handler);
    });
  }

  function updateReadingButtons() {
    $$('[data-reading-key]').forEach((button) => {
      const studied = Boolean(getResponse(button.dataset.readingKey));
      button.classList.toggle("studied", studied);
      const marker = button.querySelector("span");
      if (marker) marker.textContent = studied ? "✓" : "○";
    });
  }

  function initialiseReadingButtons() {
    $$('[data-reading-key]').forEach((button) => {
      button.addEventListener("click", () => {
        const panel = $(`#${button.dataset.readingPanel}`);
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) {
          setResponse(button.dataset.readingKey, true);
          panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        updateReadingButtons();
      });
    });
  }

  function renderLearningPanels() {
    const template = $("#learningPanelTemplate");
    [$("#desktopLearningPanel"), $("#mobileLearningPanel")].forEach((target) => {
      target.innerHTML = "";
      target.append(template.content.cloneNode(true));
    });
  }

  function isUnlocked(id) {
    if (state?.teacherMode) return true;
    if (id === "overview") return true;
    if (id === "starter") return Boolean(state.completed.overview);
    if (id === "activity1") return Boolean(state.completed.starter);
    if (id === "activity2") return Boolean(state.completed.activity1);
    if (id === "extension" || id === "plenary") return Boolean(state.completed.activity2);
    if (id === "review") return Boolean(state.completed.plenary);
    return false;
  }

  function renderJourney() {
    const host = $("#journeyButtons");
    host.innerHTML = "";
    SECTION_CONFIG.forEach((section, index) => {
      const button = document.createElement("button");
      const complete = Boolean(state.completed[section.id]) || (section.id === "review" && Boolean(state.completed.plenary));
      const unlocked = isUnlocked(section.id);
      button.type = "button";
      button.className = `journey-button${complete ? " complete" : ""}${state.currentSection === section.id ? " active" : ""}`;
      button.disabled = !unlocked;
      button.setAttribute("aria-current", state.currentSection === section.id ? "step" : "false");
      button.innerHTML = `<span class="journey-index">${complete ? "✓" : index + 1}</span><span>${escapeHtml(section.label)}${section.required ? "" : " (optional)"}</span><span class="journey-state">${complete ? "Done" : unlocked ? "Open" : "Locked"}</span>`;
      button.addEventListener("click", () => showSection(section.id));
      host.append(button);
    });
    updateProgress();
  }

  function updateProgress() {
    const completed = CORE_PROGRESS.filter((id) => state.completed[id]).length;
    const percent = Math.round((completed / CORE_PROGRESS.length) * 100);
    $("#progressText").textContent = `${percent}%`;
    $("#progressBar").style.width = `${percent}%`;
  }

  function showSection(id, force = false) {
    if (!force && !isUnlocked(id)) return;
    state.currentSection = id;
    $$('.lesson-section').forEach((section) => section.classList.toggle("active", section.dataset.section === id));
    if (id === "review") renderReview();
    renderJourney();
    scheduleSave();
    $("#lessonContent").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeSection(id, nextId) {
    state.completed[id] = true;
    state.timestamps.completed[id] = new Date().toISOString();
    scheduleSave();
    renderJourney();
    if (nextId) showSection(nextId);
  }

  function renderSequence() {
    const list = $("#sequenceList");
    list.innerHTML = "";
    state.sequence.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "sequence-item";
      li.innerHTML = `<span class="sequence-position">${index + 1}</span><span>${escapeHtml(item)}</span><span class="sequence-controls"><button type="button" aria-label="Move instruction ${index + 1} up" data-move="up" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" aria-label="Move instruction ${index + 1} down" data-move="down" ${index === state.sequence.length - 1 ? "disabled" : ""}>↓</button></span>`;
      li.querySelector('[data-move="up"]')?.addEventListener("click", () => moveSequence(index, -1));
      li.querySelector('[data-move="down"]')?.addEventListener("click", () => moveSequence(index, 1));
      list.append(li);
    });
  }

  function moveSequence(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= state.sequence.length) return;
    [state.sequence[index], state.sequence[target]] = [state.sequence[target], state.sequence[index]];
    delete state.checks.starterSequence;
    $("#starterSequenceFeedback").hidden = true;
    renderSequence();
    scheduleSave();
  }

  function showFeedback(id, type, title, messages = []) {
    const box = $(`#${id}`);
    if (!box) return;
    box.hidden = false;
    box.className = `feedback ${type}`;
    box.innerHTML = `<h3>${escapeHtml(title)}</h3>${messages.length ? `<ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>` : ""}`;
  }

  function recordCheck(key, passed, feedbackId, successTitle, successMessages, improvementMessages) {
    state.checks[key] = { passed, checkedAt: new Date().toISOString() };
    showFeedback(feedbackId, passed ? "success" : "warning", passed ? successTitle : "Improve this answer", passed ? successMessages : improvementMessages);
    scheduleSave();
  }

  function checkStarterSequence() {
    const passed = state.sequence.every((value, index) => value === CORRECT_SEQUENCE[index]);
    recordCheck("starterSequence", passed, "starterSequenceFeedback", "Task 1 is secure", ["The sequence moves logically from startup to the final visible result."], ["Begin with the instruction that starts the system.", "The welcome output must happen before the system waits for Button A.", "The initials can only appear after the button event."]);
  }

  function checkStarterIpo() {
    const outputs = [...(getResponse("starter_outputs") || [])].sort();
    const passed = getResponse("starter_input") === "button" && JSON.stringify(outputs) === JSON.stringify(["icon", "initials"]);
    const messages = [];
    if (getResponse("starter_input") !== "button") messages.push("Choose the action performed by the user that enters the system—not the device itself or a result shown afterwards.");
    if (JSON.stringify(outputs) !== JSON.stringify(["icon", "initials"])) messages.push("Select exactly two results that the user can see on the LED display.");
    recordCheck("starterIpo", passed, "starterIpoFeedback", "Task 2 is secure", ["You distinguished the user’s input event from the two visible outputs."], messages);
  }

  function checkStarterPrecision() {
    // Read the visible controls at check time so a quick click cannot race the autosave state.
    const selectedType = String(getTrackedValue("starter_type") || "");
    const answer = String(getTrackedValue("starter_improvement") || "").trim();
    state.responses.starter_type = selectedType;
    state.responses.starter_improvement = answer;

    // This is a formative starter. Accept any genuine rewrite instead of requiring
    // a narrow list of keywords that may reject valid Year 8 responses.
    const meaningfulRewrite = answer.length >= 8 && !/^display\s+something\s+nice[.!]?$/i.test(answer);
    const typeCorrect = selectedType === "algorithm";

    if (!meaningfulRewrite) {
      return recordCheck(
        "starterPrecision",
        false,
        "starterPrecisionFeedback",
        "Add one precise instruction",
        [],
        ["Write at least one clear action that is different from “Display something nice”. For example, name what the LED matrix should show or when it should appear."]
      );
    }

    const feedback = ["Your rewritten instruction is clear enough to continue."];
    if (typeCorrect) {
      feedback.push("You also recognised that the ordered plan is an algorithm.");
    } else {
      feedback.push("Learning note: the ordered steps are an algorithm because they are still a plan, not an executable program.");
    }
    recordCheck(
      "starterPrecision",
      true,
      "starterPrecisionFeedback",
      typeCorrect ? "Task 3 is secure" : "Task 3 complete — review the learning note",
      feedback,
      []
    );
  }

  function completeStarter() {
    const required = ["starterSequence", "starterIpo", "starterPrecision"];
    const missing = required.filter((key) => !state.checks[key]?.passed);
    state.checks.starter = { passed: missing.length === 0, checkedAt: new Date().toISOString() };
    if (missing.length && !state.teacherMode) {
      const names = { starterSequence: "Task 1: sequence", starterIpo: "Task 2: input and outputs", starterPrecision: "Task 3: precision" };
      return showFeedback("starterCompletionFeedback", "warning", "Complete each starter check", missing.map((key) => `${names[key]} still needs a secure check. Return to its feedback directly above.`));
    }
    showFeedback("starterCompletionFeedback", "success", "Starter complete", ["All three task checks are secure. Continue to the theory reading and Smart Badge decomposition."]);
    completeSection("starter", "activity1");
  }

  function checkA1Q1() {
    const passed = getResponse("a1_definition") === "precise";
    recordCheck("a1q1", passed, "a1q1Feedback", "Question 1 is secure", ["An algorithm is a precise, ordered set of steps designed to solve a problem or complete a task."], ["Return to Reading 1. The definition must include precision, order and a purpose—not simply any instructions."]);
  }

  function checkA1Q2() {
    const passed = getResponse("a1_relationship") === "planImplementation";
    recordCheck("a1q2", passed, "a1q2Feedback", "Question 2 is secure", ["The algorithm is the plan; a program is an implementation that a computer can execute."], ["Think about what exists before code is written and what must be expressed in a programming language for the computer to run it."]);
  }

  function checkA1Q3() {
    // Use the visible responses immediately rather than waiting for autosave.
    const explanation = String(getTrackedValue("a1_why_vague") || "").trim();
    const rewrite = String(getTrackedValue("a1_precise_rewrite") || "").trim();
    state.responses.a1_why_vague = explanation;
    state.responses.a1_precise_rewrite = rewrite;

    // These are teacher-reviewed open responses. Require a genuine attempt in
    // both boxes, but do not reject valid ideas because they omit preset keywords.
    const explanationReady = explanation.length >= 6;
    const rewriteReady = rewrite.length >= 8 && !/^make\s+the\s+screen\s+look\s+better[.!]?$/i.test(rewrite);
    const messages = [];
    if (!explanationReady) messages.push("In the first box, briefly state one detail the computer has not been told.");
    if (!rewriteReady) messages.push("In the second box, write a new instruction of at least eight characters that is more specific than “Make the screen look better”.");
    recordCheck(
      "a1q3",
      explanationReady && rewriteReady,
      "a1q3Feedback",
      "Question 3 complete",
      ["Both responses are saved for your teacher to review. Continue to Question 4."],
      messages
    );
  }

  function checkA1Q4() {
    const passed = getResponse("a1_decomposition") === "break";
    recordCheck("a1q4", passed, "a1q4Feedback", "Question 4 is secure", ["Decomposition breaks a large problem into smaller subproblems that can be planned and tested separately."], ["Return to Reading 2. Decomposition changes how a problem is organised; it does not remove difficulty or automatically turn the solution into Python."]);
  }

  function checkA1Q5() {
    const input = String(getResponse("a1_dryer_input") || "");
    const process = String(getResponse("a1_dryer_process") || "");
    const output = String(getResponse("a1_dryer_output") || "");
    const inputReady = input.trim().length >= 8 && /hand|sensor|detect|near|movement|infrared/i.test(input);
    const processReady = process.trim().length >= 12 && /detect|check|decide|activate|switch|signal|motor/i.test(process);
    const outputReady = output.trim().length >= 8 && /air|blow|motor|warm|dry/i.test(output);
    const messages = [];
    if (!inputReady) messages.push("Input: identify what the sensor detects or what event enters the system.");
    if (!processReady) messages.push("Process: describe the internal detection, decision or activation—not the visible/physical result alone.");
    if (!outputReady) messages.push("Output: describe the physical result produced for the user.");
    recordCheck("a1q5", inputReady && processReady && outputReady, "a1q5Feedback", "Question 5 meets the IPO check", ["Your three responses distinguish the sensor event, internal processing and physical output. They are saved for teacher review."], messages);
  }

  function validateActivity1() {
    const issues = [];
    if (!getResponse("a1_read_algorithms")) issues.push("Open and study Reading 1: Algorithm and program.");
    if (!getResponse("a1_read_decomposition")) issues.push("Open and study Reading 2: Decomposition and IPO.");
    ["a1q1", "a1q2", "a1q3", "a1q4", "a1q5"].forEach((key, index) => {
      if (!state.checks[key]?.passed) issues.push(`Question ${index + 1} needs a secure check. Read its feedback directly underneath the question.`);
    });
    ["decomp_start", "decomp_input", "decomp_process", "decomp_output", "decomp_testing"].forEach((key) => {
      if (!textLongEnough(key, 12)) issues.push(`Add a meaningful response for ${RESPONSE_LABELS[key].replace("Smart Badge — ", "")}.`);
    });
    if (!textLongEnough("decomp_why", 20)) issues.push("Explain how decomposition makes the project easier to plan, build, test or debug.");
    return issues;
  }

  function completeActivity1() {
    const issues = validateActivity1();
    if (issues.length && !state.teacherMode) return showFeedback("activity1Feedback", "warning", "Main Activity 1 is not complete yet", issues);
    state.checks.activity1Theory = { passed: true, checkedAt: new Date().toISOString() };
    showFeedback("activity1Feedback", "success", "Main Activity 1 complete", ["Both readings, the five individual checks and your Smart Badge decomposition have been saved."]);
    completeSection("activity1", "activity2");
  }

  function checkA2Q1() {
    const passed = getResponse("a2_symbol_start") === "oval";
    recordCheck("a2q1", passed, "a2q1Feedback", "Question 1 is secure", ["Start and End are represented using an oval or terminator symbol."], ["Use the symbol guide to find the shape that marks where an algorithm begins or ends."]);
  }

  function checkA2Q2() {
    const passed = getResponse("a2_symbol_input") === "parallelogram";
    recordCheck("a2q2", passed, "a2q2Feedback", "Question 2 is secure", ["Entering a name is an input, represented using a parallelogram."], ["Entering a name supplies data to the system. Locate the Input/Output shape in the symbol guide."]);
  }

  function checkA2Q3() {
    const answer = String(getResponse("a2_arrow_purpose") || "");
    const passed = answer.trim().length >= 12 && /order|direction|next|flow|sequence|path/i.test(answer);
    recordCheck("a2q3", passed, "a2q3Feedback", "Question 3 meets the arrow check", ["You explained that arrows communicate order, direction or the next path through the algorithm."], ["Explain how a reader knows which symbol comes next and which direction to follow."]);
  }

  function checkA2Q4() {
    const answer = String(getResponse("a2_decision_labels") || "");
    const passed = answer.trim().length >= 12 && /yes|no|true|false|condition|path|result|choice/i.test(answer);
    recordCheck("a2q4", passed, "a2q4Feedback", "Question 4 meets the decision check", ["You linked each labelled path to the result of the condition."], ["Explain how labels such as Yes and No tell the reader which path matches the decision result."]);
  }

  function checkA2Q5() {
    const explanation = String(getResponse("a2_executable_explain") || "");
    const passed = getResponse("a2_executable") === "false" && explanation.trim().length >= 15 && /program|code|language|implement|convert|translate/i.test(explanation);
    const messages = [];
    if (getResponse("a2_executable") !== "false") messages.push("A flowchart is a visual plan rather than executable instructions.");
    if (!(explanation.trim().length >= 15 && /program|code|language|implement|convert|translate/i.test(explanation))) messages.push("Explain that the plan must be implemented or translated into code in a programming language.");
    recordCheck("a2q5", passed, "a2q5Feedback", "Question 5 is secure", ["You distinguished a visual algorithm from an executable program."], messages);
  }

  function validateActivity2() {
    const issues = [];
    if (!getResponse("a2_read")) issues.push("Confirm that you read the flowchart explanation and studied both examples.");
    ["a2q1", "a2q2", "a2q3", "a2q4", "a2q5"].forEach((key, index) => {
      if (!state.checks[key]?.passed) issues.push(`Flowchart Question ${index + 1} needs a secure check. Read its feedback directly underneath.`);
    });
    ["badge_input", "badge_process", "badge_output"].forEach((key) => {
      if (!textLongEnough(key, 12)) issues.push(`Complete ${RESPONSE_LABELS[key]}.`);
    });
    const stepCount = [1, 2, 3, 4, 5, 6].filter((number) => textLongEnough(`algorithm_step_${number}`, 8)).length;
    if (stepCount < 5) issues.push("Write at least five meaningful algorithm steps.");
    ["flow_start", "flow_io", "flow_process", "flow_arrows", "flow_matches"].forEach((key) => {
      if (!getResponse(key)) issues.push(`Confirm: ${RESPONSE_LABELS[key].replace("Flowchart checklist — ", "")}.`);
    });
    if (!state.evidence.flowchart?.dataUrl) issues.push("Upload or paste a readable screenshot or photograph of your completed flowchart.");
    if (!textLongEnough("flowchart_caption", 8)) issues.push("Add a short caption explaining what the flowchart image shows.");
    if (!textLongEnough("tester_name", 2)) issues.push("Enter the tester’s name or write “self-check”.");
    if (!textLongEnough("peer_feedback", 12)) issues.push("Record what the trace test identified.");
    if (!textLongEnough("algorithm_improvement", 15)) issues.push("Explain the correction you made or justify why no correction was required.");
    return issues;
  }

  function completeActivity2() {
    const issues = validateActivity2();
    if (issues.length && !state.teacherMode) return showFeedback("activity2Feedback", "warning", "Main Activity 2 is not complete yet", issues);
    state.checks.activity2Theory = { passed: true, checkedAt: new Date().toISOString() };
    showFeedback("activity2Feedback", "success", "Main Activity 2 complete", ["Your five flowchart checks, IPO model, numbered algorithm, flowchart evidence and trace-test reflection have been saved."]);
    completeSection("activity2", "extension");
  }

  function extensionAttempted() {
    return ["ext_steps_strength", "ext_steps_limit", "ext_flow_strength", "ext_flow_limit", "ext_pseudo_strength", "ext_pseudo_limit", "ext_button_b"].some((key) => textLongEnough(key, 2));
  }

  function continueFromExtension() {
    state.completed.extension = extensionAttempted();
    state.timestamps.completed.extension = state.completed.extension ? new Date().toISOString() : null;
    showFeedback("extensionFeedback", "success", extensionAttempted() ? "Extension saved" : "Extension skipped", ["The optional extension does not affect access to the plenary."]);
    scheduleSave();
    showSection("plenary");
  }

  function validatePlenary() {
    const issues = [];
    const requiredText = ["plenary_algorithm", "plenary_difference", "plenary_input", "plenary_process", "plenary_output", "plenary_improve", "plenary_decomposition", "plenary_led"];
    requiredText.forEach((key) => {
      if (!textLongEnough(key, 12)) issues.push(`Add a fuller response for “${RESPONSE_LABELS[key]}”.`);
    });
    if (!getResponse("plenary_readiness")) issues.push("Select your current readiness level.");
    return issues;
  }

  function completePlenary() {
    const issues = validatePlenary();
    if (issues.length && !state.teacherMode) return showFeedback("plenaryFeedback", "warning", "Finish the exit check", issues);
    const ledText = String(getResponse("plenary_led") || "");
    const ledHint = /display|show|visual|information|output/i.test(ledText)
      ? "Your LED-matrix explanation includes an appropriate output idea."
      : "Your teacher will review whether your LED-matrix explanation makes clear that it displays information produced by the program.";
    showFeedback("plenaryFeedback", "success", "Plenary complete", [ledHint, "Your final review and PDF export are now available."]);
    completeSection("plenary", "review");
  }

  async function compressImage(file) {
    if (!file.type.startsWith("image/")) throw new Error("Choose a PNG, JPEG or WebP image.");
    if (file.size > 10 * 1024 * 1024) throw new Error("The image is larger than 10 MB. Please choose a smaller file.");
    const dataUrl = await fileToDataUrl(file);
    const image = await loadImage(dataUrl);
    const maxDimension = 1400;
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return { dataUrl: canvas.toDataURL("image/jpeg", 0.82), width, height, originalName: file.name, savedAt: new Date().toISOString() };
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Unable to read the file"));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Unable to process the image"));
      image.src = src;
    });
  }

  async function handleEvidenceUpload(slot, input, feedbackId) {
    const file = input.files?.[0];
    if (!file) return;
    await saveEvidenceFile(slot, file, feedbackId);
    input.value = "";
  }

  async function saveEvidenceFile(slot, file, feedbackId) {
    try {
      setSaveStatus("Processing image…");
      state.evidence[slot] = await compressImage(file);
      renderEvidencePreviews();
      scheduleSave();
      if (feedbackId) showFeedback(feedbackId, "success", "Evidence added", ["The image was compressed and saved locally in this browser."]);
    } catch (error) {
      if (feedbackId) showFeedback(feedbackId, "error", "Unable to add evidence", [error.message]);
    }
  }

  async function saveClipboardBlob(slot, blob, feedbackId) {
    if (!blob?.type?.startsWith("image/")) {
      showFeedback(feedbackId, "warning", "No image found", ["Copy a screenshot first, then click the paste area and press Ctrl+V or Command+V."]);
      return;
    }
    const extension = blob.type.includes("png") ? "png" : blob.type.includes("webp") ? "webp" : "jpg";
    const file = new File([blob], `pasted-${slot}-${Date.now()}.${extension}`, { type: blob.type });
    await saveEvidenceFile(slot, file, feedbackId);
  }

  async function pasteFromClipboard(slot, feedbackId) {
    if (!navigator.clipboard?.read) {
      showFeedback(feedbackId, "warning", "Use the keyboard paste method", ["Your browser does not allow the paste button to read images. Click the dashed paste area, then press Ctrl+V or Command+V."]);
      return;
    }
    try {
      const items = await navigator.clipboard.read();
      const imageItem = items.find((item) => item.types.some((type) => type.startsWith("image/")));
      if (!imageItem) throw new Error("No copied image was found on the clipboard.");
      const imageType = imageItem.types.find((type) => type.startsWith("image/"));
      await saveClipboardBlob(slot, await imageItem.getType(imageType), feedbackId);
    } catch (error) {
      showFeedback(feedbackId, "warning", "Clipboard access was not available", [error.message || "The browser blocked clipboard access.", "Click the dashed paste area and press Ctrl+V or Command+V, or choose an image file instead."]);
    }
  }

  function initialisePasteZone(zoneId, slot, feedbackId) {
    const zone = $(`#${zoneId}`);
    zone.addEventListener("paste", async (event) => {
      const item = [...(event.clipboardData?.items || [])].find((entry) => entry.type.startsWith("image/"));
      if (!item) {
        showFeedback(feedbackId, "warning", "No image found in the pasted content", ["Copy a screenshot image—not a filename or a web address—then try again."]);
        return;
      }
      event.preventDefault();
      await saveClipboardBlob(slot, item.getAsFile(), feedbackId);
    });
    zone.addEventListener("click", () => zone.focus());
    zone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        zone.focus();
        showFeedback(feedbackId, "success", "Paste area ready", ["Now press Ctrl+V or Command+V to paste your copied screenshot."]);
      }
    });
  }

  function renderEvidencePreviews() {
    renderEvidencePreview("activity1", "activity1Preview", "Optional Activity 1 evidence");
    renderEvidencePreview("flowchart", "flowchartPreview", "Flowchart evidence");
  }

  function renderEvidencePreview(slot, targetId, label) {
    const target = $(`#${targetId}`);
    const evidence = state.evidence[slot];
    target.innerHTML = "";
    if (!evidence?.dataUrl) {
      target.innerHTML = `<span class="muted-text">No image uploaded.</span>`;
      return;
    }
    const image = document.createElement("img");
    image.src = evidence.dataUrl;
    image.alt = label;
    const actions = document.createElement("div");
    actions.className = "upload-actions";
    actions.innerHTML = `<strong>${escapeHtml(evidence.originalName || label)}</strong><span>${evidence.width} × ${evidence.height}</span><button class="button danger-outline" type="button">Remove image</button>`;
    actions.querySelector("button").addEventListener("click", () => {
      if (!confirm("Remove this uploaded evidence image?")) return;
      state.evidence[slot] = null;
      renderEvidencePreviews();
      scheduleSave();
    });
    target.append(image, actions);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getCheckEntries() {
    return [
      ["Starter Task 1 — sequence", state.checks.starterSequence],
      ["Starter Task 2 — input and outputs", state.checks.starterIpo],
      ["Starter Task 3 — precision", state.checks.starterPrecision],
      ["Activity 1 Question 1 — algorithm", state.checks.a1q1],
      ["Activity 1 Question 2 — algorithm and program", state.checks.a1q2],
      ["Activity 1 Question 3 — precision", state.checks.a1q3],
      ["Activity 1 Question 4 — decomposition", state.checks.a1q4],
      ["Activity 1 Question 5 — IPO", state.checks.a1q5],
      ["Activity 2 Question 1 — Start/End", state.checks.a2q1],
      ["Activity 2 Question 2 — Input/Output", state.checks.a2q2],
      ["Activity 2 Question 3 — arrows", state.checks.a2q3],
      ["Activity 2 Question 4 — decisions", state.checks.a2q4],
      ["Activity 2 Question 5 — flowchart or program", state.checks.a2q5],
    ];
  }

  function renderReview() {
    const host = $("#reviewSummary");
    const extensionUsed = extensionAttempted();
    let html = `
      <article class="review-card">
        <h3>Student details <span class="status-pill complete">Saved locally</span></h3>
        <div class="review-response"><strong>Name</strong>${escapeHtml(state.student.name)}</div>
        <div class="review-response"><strong>Class</strong>${escapeHtml(state.student.className)}</div>
        <div class="review-response"><strong>Lesson</strong>Year 8 Term 1 Week 2 Theory — Smart Badge Algorithms</div>
        <div class="review-response"><strong>Last saved</strong>${escapeHtml(formatDateTime(state.timestamps.lastSaved || state.timestamps.started))}</div>
      </article>`;

    html += `<article class="review-card"><h3>Starter sequence <span class="status-pill ${state.completed.starter ? "complete" : "incomplete"}">${state.completed.starter ? "Complete" : "Not completed"}</span></h3><div class="review-response"><strong>Student’s final order</strong>${state.sequence.map((step, index) => `${index + 1}. ${escapeHtml(step)}`).join("<br>")}</div></article>`;

    REVIEW_GROUPS.forEach((group) => {
      if (group.optional && !extensionUsed) return;
      const complete = group.optional ? extensionUsed : Boolean(state.completed[group.section]);
      html += `<article class="review-card"><h3>${escapeHtml(group.title)} <span class="status-pill ${complete ? "complete" : "incomplete"}">${complete ? "Complete" : "Not completed"}</span></h3>`;
      group.keys.forEach((key) => {
        html += `<div class="review-response"><strong>${escapeHtml(RESPONSE_LABELS[key] || key)}</strong>${escapeHtml(responseText(key))}</div>`;
      });
      html += `</article>`;
    });

    const checkEntries = getCheckEntries();
    html += `<article class="review-card"><h3>Automatically checked results</h3>${checkEntries.map(([label, check]) => `<div class="review-response"><strong>${escapeHtml(label)}</strong>${check ? check.passed ? "Secure when last checked" : "Needs improvement when last checked" : "Not checked"}</div>`).join("")}</article>`;

    if (state.evidence.activity1?.dataUrl || state.evidence.flowchart?.dataUrl) {
      html += `<article class="review-card"><h3>Uploaded evidence</h3>`;
      if (state.evidence.activity1?.dataUrl) html += `<p><strong>Activity 1 evidence</strong></p><img class="review-evidence" src="${state.evidence.activity1.dataUrl}" alt="Activity 1 evidence">`;
      if (state.evidence.flowchart?.dataUrl) html += `<p><strong>Flowchart evidence</strong></p><img class="review-evidence" src="${state.evidence.flowchart.dataUrl}" alt="Flowchart evidence">`;
      html += `</article>`;
    }
    host.innerHTML = html;
  }

  function formatDateTime(value) {
    if (!value) return "Not recorded";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }

  async function exportPdf() {
    if (!window.PDFLib) {
      showToast("Direct PDF generation is unavailable. Use Print / Save as PDF instead.", "error");
      return;
    }
    try {
      setSaveStatus("Creating PDF…");
      await persistState();
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pageSize = [595.28, 841.89];
      const margin = 42;
      const usableWidth = pageSize[0] - margin * 2;
      const purple = rgb(0.42, 0.18, 0.73);
      const black = rgb(0.06, 0.06, 0.06);
      const grey = rgb(0.35, 0.35, 0.35);
      let page;
      let y;

      const newPage = () => {
        page = pdf.addPage(pageSize);
        page.drawRectangle({ x: 0, y: pageSize[1] - 58, width: pageSize[0], height: 58, color: black });
        page.drawRectangle({ x: 0, y: pageSize[1] - 62, width: pageSize[0], height: 4, color: purple });
        page.drawText("YEAR 8 • TERM 1 • WEEK 2 THEORY", { x: margin, y: pageSize[1] - 35, size: 11, font: bold, color: rgb(1, 1, 1) });
        y = pageSize[1] - 88;
      };

      const ensure = (height) => {
        if (!page || y - height < 48) newPage();
      };

      const wrap = (text, font, size, width) => {
        const paragraphs = String(text ?? "").split(/\n/);
        const lines = [];
        paragraphs.forEach((paragraph, pIndex) => {
          const words = paragraph.split(/\s+/).filter(Boolean);
          if (!words.length) lines.push("");
          let line = "";
          words.forEach((word) => {
            const test = line ? `${line} ${word}` : word;
            if (font.widthOfTextAtSize(test, size) <= width) line = test;
            else {
              if (line) lines.push(line);
              line = word;
            }
          });
          if (line) lines.push(line);
          if (pIndex < paragraphs.length - 1) lines.push("");
        });
        return lines;
      };

      const drawText = (text, options = {}) => {
        const font = options.bold ? bold : regular;
        const size = options.size || 10;
        const color = options.color || black;
        const width = options.width || usableWidth;
        const lineHeight = options.lineHeight || size * 1.35;
        const lines = wrap(text || "Not answered", font, size, width);
        ensure(lines.length * lineHeight + (options.after ?? 6));
        lines.forEach((line) => {
          page.drawText(line, { x: options.x || margin, y, size, font, color });
          y -= lineHeight;
        });
        y -= options.after ?? 6;
      };

      const sectionHeading = (title, status) => {
        ensure(42);
        page.drawRectangle({ x: margin, y: y - 22, width: usableWidth, height: 29, color: rgb(0.95, 0.93, 0.98), borderColor: purple, borderWidth: 1 });
        page.drawText(title, { x: margin + 9, y: y - 13, size: 12, font: bold, color: black });
        const statusText = status ? "COMPLETE" : "NOT COMPLETED";
        const statusWidth = bold.widthOfTextAtSize(statusText, 8);
        page.drawText(statusText, { x: pageSize[0] - margin - statusWidth - 9, y: y - 11, size: 8, font: bold, color: status ? purple : grey });
        y -= 40;
      };

      const field = (label, value) => {
        drawText(label, { bold: true, size: 9, color: purple, after: 2 });
        drawText(value == null || value === "" ? "Not answered" : value, { size: 10, after: 8 });
      };

      const drawEvidence = async (title, evidence, caption) => {
        if (!evidence?.dataUrl) {
          field(title, "Not uploaded");
          return;
        }
        drawText(title, { bold: true, size: 10, color: purple, after: 4 });
        const bytes = dataUrlBytes(evidence.dataUrl);
        const embedded = evidence.dataUrl.startsWith("data:image/png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const natural = embedded.scale(1);
        const scale = Math.min(usableWidth / natural.width, 260 / natural.height, 1);
        const width = natural.width * scale;
        const height = natural.height * scale;
        ensure(height + 35);
        page.drawImage(embedded, { x: margin, y: y - height, width, height });
        y -= height + 7;
        drawText(caption || "No caption supplied", { size: 9, color: grey, after: 10 });
      };

      newPage();
      drawText("From Instructions to a Smart Badge Algorithm", { bold: true, size: 21, lineHeight: 25, after: 10 });
      drawText(`Student: ${state.student.name}    Class: ${state.student.className}`, { bold: true, size: 12, after: 5 });
      drawText(`Report created: ${new Date().toLocaleString()}`, { size: 9, color: grey, after: 14 });
      drawText("Key Topic", { bold: true, size: 10, color: purple, after: 2 });
      drawText("Algorithms, decomposition and input–process–output", { size: 11, after: 8 });
      drawText("WAGBA", { bold: true, size: 10, color: purple, after: 2 });
      drawText("We are getting better at representing a precise algorithm and applying input–process–output to a Smart Badge.", { size: 11, after: 8 });
      drawText("Knowledge", { bold: true, size: 10, color: purple, after: 2 });
      drawText("Algorithm and program; decomposition; input–process–output; flowchart symbols.", { size: 10, after: 8 });
      drawText("Skills", { bold: true, size: 10, color: purple, after: 2 });
      drawText("Decompose a problem; identify IPO; write precise instructions; represent and test an algorithm.", { size: 10, after: 8 });
      drawText("Understanding", { bold: true, size: 10, color: purple, after: 2 });
      drawText("A computer follows the implemented instructions, not the programmer’s intention. Precise planning and testing reveal missing or ambiguous steps.", { size: 10, after: 8 });
      drawText("Keywords", { bold: true, size: 10, color: purple, after: 2 });
      drawText("algorithm • program • sequence • decomposition • abstraction • input • process • output • flowchart • button • LED matrix", { size: 10, after: 8 });
      drawText("Challenge", { bold: true, size: 10, color: purple, after: 2 });
      drawText("Represent the same solution using numbered instructions, a flowchart and pseudocode, then compare their strengths.", { size: 10, after: 12 });

      sectionHeading("Starter", Boolean(state.completed.starter));
      field("Final sequence", state.sequence.map((step, index) => `${index + 1}. ${step}`).join("\n"));
      ["starter_input", "starter_outputs", "starter_type", "starter_improvement"].forEach((key) => field(RESPONSE_LABELS[key], responseText(key)));

      for (const group of REVIEW_GROUPS) {
        if (group.optional && !extensionAttempted()) continue;
        sectionHeading(group.title, group.optional ? extensionAttempted() : Boolean(state.completed[group.section]));
        group.keys.forEach((key) => field(RESPONSE_LABELS[key] || key, responseText(key)));
        if (group.title.includes("Decomposition")) await drawEvidence("Activity 1 uploaded evidence", state.evidence.activity1, getResponse("a1_evidence_caption"));
        if (group.title.includes("Testing and Improvement")) await drawEvidence("Flowchart uploaded evidence", state.evidence.flowchart, getResponse("flowchart_caption"));
      }

      const checkEntries = getCheckEntries();
      sectionHeading("Automatically checked results", checkEntries.every(([, check]) => check?.passed));
      checkEntries.forEach(([label, check]) => field(label, check ? check.passed ? "Secure when last checked" : "Needs improvement when last checked" : "Not checked"));

      sectionHeading("Completion summary", Boolean(state.completed.plenary));
      CORE_PROGRESS.forEach((id) => field(SECTION_CONFIG.find((section) => section.id === id)?.label || id, state.completed[id] ? `Completed ${formatDateTime(state.timestamps.completed[id])}` : "Not completed"));
      field("Optional extension", extensionAttempted() ? "Attempted and included" : "Not attempted");

      const pages = pdf.getPages();
      pages.forEach((pdfPage, index) => {
        const footer = `Year 8 Week 2 Theory • ${state.student.name} • Page ${index + 1} of ${pages.length}`;
        pdfPage.drawText(footer, { x: margin, y: 22, size: 8, font: regular, color: grey });
      });

      const bytes = await pdf.save();
      const filename = `Year8_${slug(state.student.className)}_${slug(state.student.name)}_Week2_Theory.pdf`;
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), filename);
      setSaveStatus("Saved");
      showFeedback("exportFeedback", "success", "PDF downloaded", ["Upload your completed PDF to the Microsoft Teams Assignment named Week 2 Theory.", "Check that you are uploading the PDF rather than a screenshot."]);
      showToast("PDF downloaded. Upload it to Microsoft Teams: Week 2 Theory.", "success");
    } catch (error) {
      console.error(error);
      setSaveStatus("Saved");
      showFeedback("exportFeedback", "error", "PDF export was blocked", ["Use the Print / Save as PDF fallback.", error.message || "Unknown export error"]);
      showToast("PDF export was blocked. Use Print / Save as PDF.", "error");
    }
  }

  function dataUrlBytes(dataUrl) {
    const base64 = dataUrl.split(",")[1] || "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportBackup() {
    const backup = { ...state, exportedAt: new Date().toISOString() };
    const filename = `Year8_${slug(state.student.className)}_${slug(state.student.name)}_Week2_Theory_Backup.json`;
    downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }), filename);
    showToast("Progress backup downloaded.", "success");
  }

  async function importBackup(file) {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (imported.lessonId !== LESSON_ID) throw new Error("This backup belongs to a different lesson.");
      if (Number(imported.schemaVersion) !== SCHEMA_VERSION) throw new Error("This backup uses an unsupported version.");
      if (!confirm("Replace the current lesson progress with this backup?")) return;
      const teacherMode = state.teacherMode;
      const student = teacherMode ? state.student : imported.student;
      state = normalizeState(imported, student, teacherMode);
      stateKey = buildStateKey(state.student.name, state.student.className, teacherMode);
      await persistState();
      restoreTrackedInputs();
      updateReadingButtons();
      renderSequence();
      renderEvidencePreviews();
      renderJourney();
      renderReview();
      showSection(state.currentSection && isUnlocked(state.currentSection) ? state.currentSection : "overview", true);
      showToast("Backup imported successfully.", "success");
    } catch (error) {
      showToast(error.message || "The backup could not be imported.", "error");
    }
  }

  function showToast(message, type = "success") {
    const existing = $(".export-toast");
    existing?.remove();
    const toast = document.createElement("div");
    toast.className = `export-toast ${type}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `<span>${escapeHtml(message)}</span><button type="button" aria-label="Close message">×</button>`;
    toast.querySelector("button").addEventListener("click", () => toast.remove());
    document.body.append(toast);
    setTimeout(() => toast.remove(), 10000);
  }

  function initialiseImageDialog() {
    const dialog = $("#imageDialog");
    const dialogImage = $("#dialogImage");
    $$('.image-button').forEach((button) => {
      button.addEventListener("click", () => {
        dialogImage.src = button.dataset.image;
        dialogImage.alt = button.dataset.alt || "Enlarged lesson image";
        dialog.showModal();
      });
    });
    $("#closeImageDialog").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    $$('img').forEach((image) => {
      image.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "callout";
        fallback.textContent = `Image unavailable: ${image.alt}`;
        image.replaceWith(fallback);
      }, { once: true });
    });
  }

  async function startLesson(name, className) {
    const teacherMode = name.trim().toLowerCase() === "teacher";
    const student = { name: teacherMode ? "teacher" : name.trim(), className: teacherMode ? (className.trim() || "Review") : className.trim() };
    stateKey = buildStateKey(student.name, student.className, teacherMode);
    const saved = await loadSavedState(stateKey);
    state = normalizeState(saved, student, teacherMode);
    $("#headerStudentName").textContent = state.student.name;
    $("#headerStudentClass").textContent = state.student.className;
    $("#landingPage").hidden = true;
    $("#lessonApp").hidden = false;
    renderLearningPanels();
    restoreTrackedInputs();
    updateReadingButtons();
    renderSequence();
    renderEvidencePreviews();
    renderJourney();
    const requestedSection = state.currentSection && isUnlocked(state.currentSection) ? state.currentSection : "overview";
    showSection(requestedSection, true);
    await persistState();
  }

  function initialiseEntry() {
    try {
      const lastProfile = JSON.parse(localStorage.getItem(LAST_PROFILE_KEY));
      if (lastProfile?.name && lastProfile.name !== "teacher") {
        $("#studentName").value = lastProfile.name;
        $("#studentClass").value = lastProfile.className || "";
        $("#resumeNotice").hidden = false;
      }
    } catch { /* no previous profile */ }

    $("#entryForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = $("#studentName").value.trim();
      const className = $("#studentClass").value.trim();
      const teacherMode = name.toLowerCase() === "teacher";
      if (!name || (!className && !teacherMode)) {
        $("#entryError").textContent = "Enter both your full name and class before starting.";
        return;
      }
      $("#entryError").textContent = "";
      await startLesson(name, className);
    });
  }

  function initialiseButtons() {
    $("#completeOverview").addEventListener("click", () => {
      if (!getResponse("overview_ready") && !state.teacherMode) return showFeedback("overviewFeedback", "warning", "Confirm that you are ready", ["Read the learning information and tick the confirmation box."]);
      completeSection("overview", "starter");
    });
    $("#checkStarterSequence").addEventListener("click", checkStarterSequence);
    $("#checkStarterIpo").addEventListener("click", checkStarterIpo);
    $("#checkStarterPrecision").addEventListener("click", checkStarterPrecision);
    $("#completeStarter").addEventListener("click", completeStarter);
    $("#checkA1Q1").addEventListener("click", checkA1Q1);
    $("#checkA1Q2").addEventListener("click", checkA1Q2);
    $("#checkA1Q3").addEventListener("click", checkA1Q3);
    $("#checkA1Q4").addEventListener("click", checkA1Q4);
    $("#checkA1Q5").addEventListener("click", checkA1Q5);
    $("#completeActivity1").addEventListener("click", completeActivity1);
    $("#checkA2Q1").addEventListener("click", checkA2Q1);
    $("#checkA2Q2").addEventListener("click", checkA2Q2);
    $("#checkA2Q3").addEventListener("click", checkA2Q3);
    $("#checkA2Q4").addEventListener("click", checkA2Q4);
    $("#checkA2Q5").addEventListener("click", checkA2Q5);
    $("#completeActivity2").addEventListener("click", completeActivity2);
    $("#continueFromExtension").addEventListener("click", continueFromExtension);
    $("#completePlenary").addEventListener("click", completePlenary);
    $$('[data-back]').forEach((button) => button.addEventListener("click", () => showSection(button.dataset.back, true)));
    $("#headerExportButton").addEventListener("click", exportPdf);
    $("#finalExportButton").addEventListener("click", exportPdf);
    $("#printButton").addEventListener("click", () => { renderReview(); window.print(); });
    $("#backupButton").addEventListener("click", exportBackup);
    $("#importBackup").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) importBackup(file);
      event.target.value = "";
    });
    $("#activity1Upload").addEventListener("change", (event) => handleEvidenceUpload("activity1", event.target, "activity1EvidenceFeedback"));
    $("#flowchartUpload").addEventListener("change", (event) => handleEvidenceUpload("flowchart", event.target, "flowchartEvidenceFeedback"));
    $("#pasteActivity1Button").addEventListener("click", () => pasteFromClipboard("activity1", "activity1EvidenceFeedback"));
    $("#pasteFlowchartButton").addEventListener("click", () => pasteFromClipboard("flowchart", "flowchartEvidenceFeedback"));
    initialisePasteZone("activity1PasteZone", "activity1", "activity1EvidenceFeedback");
    initialisePasteZone("flowchartPasteZone", "flowchart", "flowchartEvidenceFeedback");
    $("#resetButton").addEventListener("click", async () => {
      if (!confirm("Delete all saved answers and uploaded evidence for this lesson on this device?")) return;
      await deleteSavedState(stateKey);
      localStorage.removeItem(LAST_PROFILE_KEY);
      location.reload();
    });
    $("#learningDrawerButton").addEventListener("click", () => {
      const panel = $("#mobileLearningPanel");
      const open = panel.classList.toggle("open");
      panel.hidden = !open;
      $("#learningDrawerButton").setAttribute("aria-expanded", String(open));
    });
  }

  function initialise() {
    initialiseEntry();
    initialiseTracking();
    initialiseReadingButtons();
    initialiseButtons();
    initialiseImageDialog();
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
