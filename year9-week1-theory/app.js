(() => {
  "use strict";

  const teacherMode = new URLSearchParams(location.search).get("teacher") === "1";
  const STORAGE_KEY = teacherMode ? "tta_y9_w1_theory_teacher_v1" : "tta_y9_w1_theory_student_v1";
  const sectionOrder = ["starter", "task1", "task2", "extension", "plenary", "review"];
  const sectionTitles = {
    starter: "Do Now",
    task1: "Main Task 1",
    task2: "Main Task 2",
    extension: "Extension",
    plenary: "Plenary",
    review: "Review and export",
  };

  const habits = [
    ["read-errors", "Reading an error message before changing the code", "productive"],
    ["plan-first", "Planning an algorithm before programming", "productive"],
    ["test-sections", "Testing one section of code at a time", "productive"],
    ["meaningful-names", "Using meaningful variable names", "productive"],
    ["explain-code", "Explaining why the program works", "productive"],
    ["save-files", "Saving work using an appropriate filename", "productive"],
    ["unchanged-run", "Repeatedly running unchanged code", "unproductive"],
    ["copy-unread", "Copying code without reading it", "unproductive"],
    ["delete-all", "Deleting the whole program after one error", "unproductive"],
    ["ask-answer", "Asking a friend for the answer without attempting the problem", "unproductive"],
    ["screenshots-only", "Submitting screenshots without the original code", "unproductive"],
    ["ai-untested", "Using AI-generated code without testing or understanding it", "unproductive"],
  ];

  const aoQuestions = [
    ["ao1", "What is a variable?", "AO1"],
    ["ao2", "Which data type should store a person’s age?", "AO2"],
    ["ao3", "Write and test a program that checks whether a user is old enough.", "AO3"],
  ];

  const agreements = [
    "Think before typing: identify the problem, inputs, processing and outputs.",
    "Read before asking: read the task, code and error message first.",
    "Debug systematically: change one thing, test it and record the result.",
    "Explain your solution: describe how and why the code works.",
    "Protect your evidence: save plans, source code, tests and evaluations.",
    "Use technology responsibly: AI and online examples must not replace understanding.",
    "Respect people and equipment: collaborate constructively and handle devices carefully.",
  ];

  const vocab = [
    ["algorithm", "Algorithm", "A sequence of steps to solve a problem."],
    ["program", "Program", "A complete set of instructions that a computer can run."],
    ["source", "Source code", "Instructions written in a programming language."],
    ["variable", "Variable", "Data stored in a named location."],
    ["selection", "Selection", "Choosing between options in a program."],
    ["iteration", "Iteration", "Repeating steps in a program."],
    ["input", "Input", "The data a program receives."],
    ["output", "Output", "Information displayed or produced."],
  ];

  const starterFiles = {
    debug: `name = input("Enter your name: ")\n\nif name == "":\n    print("You must enter a name")\nelse\n    print("Welcome", name)`,
    challenge: `# Ask the user for a number.\n# Display whether it is greater than, equal to, or less than 10.\n\nnumber = int(input("Enter a number: "))\n\n# Write your selection below.\n`,
    extension: `# Optional extension\n# Improve the number program so it repeats until the user enters 0.\n# Distinguish positive and negative numbers and add clear comments.\n`,
  };

  const filePrompts = {
    debug: "Find and correct the syntax error. Run the program with a name and with an empty input. Explain the purpose of the condition.",
    challenge: "Write a short program that asks for a number and displays whether it is greater than, equal to or less than 10. Test normal and boundary values.",
    extension: "Optional: build the extension in this file. Your code is saved even when the extension is not submitted.",
  };

  function blankState() {
    return {
      version: 1,
      meta: {
        name: "",
        className: "",
        dateStarted: new Date().toISOString(),
        lastSaved: null,
        currentSection: "starter",
      },
      completed: { starter: false, task1: false, task2: false, extension: false, plenary: false, review: false },
      starter: { classifications: {}, habitChoice: "", explanation: "", score: null, attempts: 0 },
      task1: { ao: {}, aoScore: null, agreements: [], personalCommitment: "", commitmentReason: "", filenameChoice: "", filenameCorrect: null, submitted: false },
      task2: {
        vocabulary: { answers: {}, score: null, submitted: false },
        ipo: { input: "", process: "", output: "", submitted: false, indicators: [] },
        trace: { score: "", output: "", line: "", explanation: "", resultScore: null, submitted: false },
        pythonSubmitted: false,
      },
      python: {
        currentFile: "debug",
        files: {
          debug: { initial: starterFiles.debug, code: starterFiles.debug, output: "", runCount: 0 },
          challenge: { initial: starterFiles.challenge, code: starterFiles.challenge, output: "", runCount: 0 },
          extension: { initial: starterFiles.extension, code: starterFiles.extension, output: "", runCount: 0 },
        },
        errorType: "",
        debugPurpose: "",
        debugNotes: "",
        programExplanation: "",
        debugTests: null,
        challengeTests: null,
        hiddenTests: null,
        testTable: [
          { input: "", type: "Normal", expected: "", actual: "" },
          { input: "", type: "Boundary", expected: "", actual: "" },
          { input: "", type: "Erroneous", expected: "", actual: "" },
        ],
        submittedAt: null,
      },
      extension: { choice: "", response: "", submitted: false },
      plenary: { confidence: 3, remember: "", revisit: "", expectation: "", algorithmProgram: "", submitted: false },
      timestamps: {},
    };
  }

  function mergeState(base, saved) {
    if (!saved || typeof saved !== "object") return base;
    const merged = { ...base, ...saved };
    merged.meta = { ...base.meta, ...(saved.meta || {}) };
    merged.completed = { ...base.completed, ...(saved.completed || {}) };
    merged.starter = { ...base.starter, ...(saved.starter || {}) };
    merged.task1 = { ...base.task1, ...(saved.task1 || {}) };
    merged.task2 = { ...base.task2, ...(saved.task2 || {}) };
    merged.task2.vocabulary = { ...base.task2.vocabulary, ...((saved.task2 || {}).vocabulary || {}) };
    merged.task2.ipo = { ...base.task2.ipo, ...((saved.task2 || {}).ipo || {}) };
    merged.task2.trace = { ...base.task2.trace, ...((saved.task2 || {}).trace || {}) };
    merged.python = { ...base.python, ...(saved.python || {}) };
    merged.python.files = { ...base.python.files, ...((saved.python || {}).files || {}) };
    for (const id of Object.keys(base.python.files)) merged.python.files[id] = { ...base.python.files[id], ...(merged.python.files[id] || {}) };
    merged.extension = { ...base.extension, ...(saved.extension || {}) };
    merged.plenary = { ...base.plenary, ...(saved.plenary || {}) };
    merged.timestamps = { ...base.timestamps, ...(saved.timestamps || {}) };
    return merged;
  }

  let savedRaw = null;
  try { savedRaw = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { savedRaw = null; }
  let state = mergeState(blankState(), savedRaw);
  let saveTimer = null;
  let editor = null;
  let pythonWorker = null;
  let pythonReady = false;
  let activeRun = null;
  let runCounter = 0;
  const runContexts = new Map();
  let errorMarker = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  }

  function normalise(value) { return String(value ?? "").trim().toLowerCase(); }
  function hasText(value, min = 1) { return String(value ?? "").trim().length >= min; }
  function safeFilePart(value) { return String(value || "Unknown").trim().replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, ""); }

  function setFeedback(element, message, type = "info") {
    element.textContent = message;
    element.className = `feedback ${type}`;
  }

  function clearFeedback(element) {
    element.textContent = "";
    element.className = "feedback";
  }

  function scheduleSave() {
    $("#save-status").textContent = "Saving…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 250);
  }

  function saveState() {
    state.meta.lastSaved = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      $("#save-status").textContent = `Saved ${new Date(state.meta.lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch (error) {
      $("#save-status").textContent = "Saving unavailable";
    }
  }

  function stamp(key) {
    state.timestamps[key] = new Date().toISOString();
  }

  function getUnlocked() {
    if (teacherMode) return new Set(sectionOrder);
    const unlocked = new Set(["starter"]);
    if (state.completed.starter) unlocked.add("task1");
    if (state.completed.task1) unlocked.add("task2");
    if (state.completed.task2) { unlocked.add("extension"); unlocked.add("plenary"); }
    if (state.completed.plenary) unlocked.add("review");
    return unlocked;
  }

  function completionPercent() {
    const core = ["starter", "task1", "task2", "plenary"];
    const done = core.filter((key) => state.completed[key]).length;
    return Math.round((done / core.length) * 100);
  }

  function updateJourney() {
    const unlocked = getUnlocked();
    const percent = completionPercent();
    $("#progress-bar").style.width = `${percent}%`;
    $("#progress-text").textContent = `${percent}% complete`;

    $$(".journey-step").forEach((button) => {
      const key = button.dataset.section;
      const isUnlocked = unlocked.has(key);
      button.disabled = !isUnlocked;
      button.classList.toggle("locked", !isUnlocked);
      button.classList.toggle("complete", Boolean(state.completed[key]));
      button.classList.toggle("active", state.meta.currentSection === key);
    });

    for (const key of ["starter", "task1", "task2", "plenary"]) {
      const chip = $(`#chip-${key}`);
      if (!chip) continue;
      chip.textContent = state.completed[key] ? "Completed" : "Not submitted";
      chip.classList.toggle("complete", Boolean(state.completed[key]));
    }
    $("#chip-extension").textContent = state.extension.submitted ? "Attempted" : "Optional";
    $("#chip-extension").classList.toggle("complete", state.extension.submitted);
    updateBottomNavigation();
  }

  function updateBottomNavigation() {
    const current = state.meta.currentSection;
    const index = sectionOrder.indexOf(current);
    const unlocked = getUnlocked();
    const back = $("#back-button");
    const next = $("#next-button");
    back.disabled = index <= 0;
    $("#current-section-label").textContent = sectionTitles[current];

    if (current === "review") {
      next.disabled = true;
      next.textContent = "Finished";
      return;
    }
    const nextKey = sectionOrder[index + 1];
    if (current === "task2" && state.completed.task2) {
      next.disabled = false;
      next.textContent = "Extension (optional)";
    } else if (current === "extension") {
      next.disabled = !unlocked.has("plenary");
      next.textContent = "Continue to plenary";
    } else {
      next.disabled = !(nextKey && unlocked.has(nextKey));
      next.textContent = "Next";
    }
  }

  function showSection(key) {
    const unlocked = getUnlocked();
    if (!unlocked.has(key)) return;
    state.meta.currentSection = key;
    $$(".lesson-section").forEach((section) => {
      const active = section.dataset.section === key;
      section.hidden = !active;
      section.classList.toggle("active", active);
    });
    $$(".journey-step").forEach((button) => button.classList.toggle("active", button.dataset.section === key));
    if (key === "review") buildReview();
    updateJourney();
    scheduleSave();
    $("#lesson-main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function markComplete(key) {
    state.completed[key] = true;
    stamp(`${key}Completed`);
    updateJourney();
    scheduleSave();
  }

  function buildHabitUI() {
    const grid = $("#habit-grid");
    const choice = $("#habit-choice");
    grid.innerHTML = "";
    habits.forEach(([id, label, correct]) => {
      const item = document.createElement("div");
      item.className = "classification-item";
      item.dataset.id = id;
      item.innerHTML = `<p>${escapeHtml(label)}</p><select aria-label="Classify: ${escapeHtml(label)}"><option value="">Choose…</option><option value="productive">Productive</option><option value="unproductive">Unproductive</option></select>`;
      const select = $("select", item);
      select.value = state.starter.classifications[id] || "";
      select.addEventListener("change", () => {
        state.starter.classifications[id] = select.value;
        item.classList.remove("correct", "incorrect");
        scheduleSave();
      });
      grid.appendChild(item);
      if (correct === "productive") choice.insertAdjacentHTML("beforeend", `<option value="${id}">${escapeHtml(label)}</option>`);
    });
    choice.value = state.starter.habitChoice || "";
    $("#habit-explanation").value = state.starter.explanation || "";
  }

  function buildTask1UI() {
    const aoGrid = $("#ao-grid");
    aoGrid.innerHTML = "";
    aoQuestions.forEach(([id, question]) => {
      const item = document.createElement("div");
      item.className = "ao-item";
      item.innerHTML = `<strong>${id.toUpperCase()}</strong><p>${escapeHtml(question)}</p><select aria-label="Assessment objective for ${escapeHtml(question)}"><option value="">Choose…</option><option>AO1</option><option>AO2</option><option>AO3</option></select>`;
      const select = $("select", item);
      select.value = state.task1.ao[id] || "";
      select.addEventListener("change", () => { state.task1.ao[id] = select.value; scheduleSave(); });
      aoGrid.appendChild(item);
    });

    const agGrid = $("#agreement-grid");
    const commitment = $("#personal-commitment");
    agGrid.innerHTML = "";
    commitment.innerHTML = '<option value="">Choose one…</option>';
    agreements.forEach((text, index) => {
      const id = `agreement-${index}`;
      const label = document.createElement("label");
      label.className = "agreement-item";
      label.innerHTML = `<input type="checkbox" value="${index}" ${state.task1.agreements.includes(index) ? "checked" : ""}><span>${escapeHtml(text)}</span>`;
      const checkbox = $("input", label);
      checkbox.addEventListener("change", () => {
        const n = Number(checkbox.value);
        state.task1.agreements = checkbox.checked ? [...new Set([...state.task1.agreements, n])] : state.task1.agreements.filter((x) => x !== n);
        scheduleSave();
      });
      agGrid.appendChild(label);
      commitment.insertAdjacentHTML("beforeend", `<option value="${index}">${escapeHtml(text.split(":")[0])}</option>`);
    });
    commitment.value = state.task1.personalCommitment;
    $("#commitment-reason").value = state.task1.commitmentReason;

    const namePart = safeFilePart(state.meta.name || "Student");
    const classPart = safeFilePart(state.meta.className || "9T");
    const correct = `${classPart}_${namePart}_W1_Baseline.py`;
    const options = ["baseline.py", correct, `${namePart} final FINAL.py`, `Week1Screenshot.png`];
    const container = $("#filename-options");
    container.innerHTML = "";
    options.forEach((value, index) => {
      const label = document.createElement("label");
      label.className = "choice-item";
      label.innerHTML = `<input type="radio" name="filename-choice" value="${escapeHtml(value)}" ${state.task1.filenameChoice === value ? "checked" : ""}><code>${escapeHtml(value)}</code>`;
      $("input", label).addEventListener("change", () => { state.task1.filenameChoice = value; scheduleSave(); });
      container.appendChild(label);
    });
    container.dataset.correct = correct;
  }

  function buildVocabularyUI() {
    const definitions = vocab.map(([, , definition]) => definition);
    const grid = $("#vocabulary-grid");
    grid.innerHTML = "";
    vocab.forEach(([id, term]) => {
      const row = document.createElement("div");
      row.className = "matching-row";
      row.innerHTML = `<strong>${escapeHtml(term)}</strong><select aria-label="Meaning of ${escapeHtml(term)}"><option value="">Choose a meaning…</option>${definitions.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("")}</select>`;
      const select = $("select", row);
      select.value = state.task2.vocabulary.answers[id] || "";
      select.addEventListener("change", () => { state.task2.vocabulary.answers[id] = select.value; scheduleSave(); });
      grid.appendChild(row);
    });
  }

  function buildTestTable() {
    const body = $("#test-table-body");
    body.innerHTML = "";
    state.python.testTable.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><input aria-label="Test ${index + 1} input" value="${escapeHtml(row.input)}"></td><td><select aria-label="Test ${index + 1} type"><option>Normal</option><option>Boundary</option><option>Erroneous</option></select></td><td><input aria-label="Test ${index + 1} expected result" value="${escapeHtml(row.expected)}"></td><td><input aria-label="Test ${index + 1} actual result" value="${escapeHtml(row.actual)}"></td>`;
      const [input, type, expected, actual] = $$("input,select", tr);
      type.value = row.type;
      input.addEventListener("input", () => { state.python.testTable[index].input = input.value; scheduleSave(); });
      type.addEventListener("change", () => { state.python.testTable[index].type = type.value; scheduleSave(); });
      expected.addEventListener("input", () => { state.python.testTable[index].expected = expected.value; scheduleSave(); });
      actual.addEventListener("input", () => { state.python.testTable[index].actual = actual.value; scheduleSave(); });
      body.appendChild(tr);
    });
  }

  function hydrateStaticFields() {
    $("#header-student").textContent = state.meta.name || "Student";
    $("#header-class").textContent = state.meta.className || "Class";
    $("#ipo-input").value = state.task2.ipo.input;
    $("#ipo-process").value = state.task2.ipo.process;
    $("#ipo-output").value = state.task2.ipo.output;
    $("#trace-score").value = state.task2.trace.score;
    $("#trace-output").value = state.task2.trace.output;
    $("#trace-line").value = state.task2.trace.line;
    $("#trace-explanation").value = state.task2.trace.explanation;
    $("#error-type").value = state.python.errorType;
    $("#debug-purpose").value = state.python.debugPurpose;
    $("#debug-notes").value = state.python.debugNotes;
    $("#program-explanation").value = state.python.programExplanation;
    $("#confidence").value = state.plenary.confidence;
    updateConfidenceLabel();
    $("#reflection-remember").value = state.plenary.remember;
    $("#reflection-revisit").value = state.plenary.revisit;
    $("#reflection-expectation").value = state.plenary.expectation;
    $("#algorithm-program").value = state.plenary.algorithmProgram;
    $("#extension-response").value = state.extension.response;
    if (state.extension.choice) {
      const radio = $(`input[name="extension-choice"][value="${state.extension.choice}"]`);
      if (radio) radio.checked = true;
      renderExtensionPrompt();
    }
  }

  function wireTextFields() {
    const bindings = [
      ["#habit-choice", (v) => state.starter.habitChoice = v, "change"],
      ["#habit-explanation", (v) => state.starter.explanation = v],
      ["#personal-commitment", (v) => state.task1.personalCommitment = v, "change"],
      ["#commitment-reason", (v) => state.task1.commitmentReason = v],
      ["#ipo-input", (v) => state.task2.ipo.input = v],
      ["#ipo-process", (v) => state.task2.ipo.process = v],
      ["#ipo-output", (v) => state.task2.ipo.output = v],
      ["#trace-score", (v) => state.task2.trace.score = v],
      ["#trace-output", (v) => state.task2.trace.output = v],
      ["#trace-line", (v) => state.task2.trace.line = v],
      ["#trace-explanation", (v) => state.task2.trace.explanation = v],
      ["#error-type", (v) => state.python.errorType = v, "change"],
      ["#debug-purpose", (v) => state.python.debugPurpose = v],
      ["#debug-notes", (v) => state.python.debugNotes = v],
      ["#program-explanation", (v) => state.python.programExplanation = v],
      ["#reflection-remember", (v) => state.plenary.remember = v],
      ["#reflection-revisit", (v) => state.plenary.revisit = v],
      ["#reflection-expectation", (v) => state.plenary.expectation = v],
      ["#algorithm-program", (v) => state.plenary.algorithmProgram = v],
      ["#extension-response", (v) => state.extension.response = v],
    ];
    bindings.forEach(([selector, setter, eventName = "input"]) => {
      $(selector).addEventListener(eventName, (event) => { setter(event.target.value); scheduleSave(); });
    });
  }

  function submitStarter() {
    const answered = habits.filter(([id]) => state.starter.classifications[id]).length;
    if (answered < habits.length || !state.starter.habitChoice || !hasText(state.starter.explanation, 20)) {
      setFeedback($("#starter-feedback"), "Classify every behaviour, choose one productive habit and explain it in at least one developed sentence.", "warning");
      return;
    }
    let score = 0;
    habits.forEach(([id, , correct]) => {
      const item = $(`.classification-item[data-id="${id}"]`);
      const isCorrect = state.starter.classifications[id] === correct;
      item.classList.toggle("correct", isCorrect);
      item.classList.toggle("incorrect", !isCorrect);
      if (isCorrect) score += 1;
    });
    state.starter.score = score;
    state.starter.attempts += 1;
    const message = score === habits.length
      ? "All classifications are accurate. Your explanation is saved."
      : `${score} of ${habits.length} classifications are accurate. Review the red cards and correct them after discussing why the habit helps or slows learning.`;
    setFeedback($("#starter-feedback"), message, score === habits.length ? "success" : "warning");
    markComplete("starter");
  }

  function checkAO() {
    const answered = aoQuestions.filter(([id]) => state.task1.ao[id]).length;
    if (answered < aoQuestions.length) return setFeedback($("#ao-feedback"), "Match all three questions first.", "warning");
    const score = aoQuestions.filter(([id, , answer]) => state.task1.ao[id] === answer).length;
    state.task1.aoScore = score;
    const detail = score === 3
      ? "Correct: AO1 recalls knowledge, AO2 applies knowledge, and AO3 analyses a problem to develop or test a solution."
      : `${score} of 3 correct. Recall = AO1, applying knowledge in context = AO2, and programming problem solving = AO3. Revise your selections.`;
    setFeedback($("#ao-feedback"), detail, score === 3 ? "success" : "warning");
    scheduleSave();
  }

  function submitTask1() {
    const aoAnswered = aoQuestions.every(([id]) => state.task1.ao[id]);
    const filenameCorrect = state.task1.filenameChoice === $("#filename-options").dataset.correct;
    state.task1.filenameCorrect = filenameCorrect;
    setFeedback($("#filename-feedback"), filenameCorrect
      ? "Correct. The filename identifies class, student, week, purpose and file type."
      : "Recheck the filename: it should identify class, student, week, purpose and use the .py extension.", filenameCorrect ? "success" : "warning");

    if (!aoAnswered || state.task1.agreements.length < 5 || !state.task1.personalCommitment || !hasText(state.task1.commitmentReason, 15) || !state.task1.filenameChoice) {
      setFeedback($("#ao-feedback"), "Complete the AO matches, select at least five working commitments, explain your personal commitment and choose a filename.", "warning");
      return;
    }
    state.task1.submitted = true;
    markComplete("task1");
    setFeedback($("#filename-feedback"), `${filenameCorrect ? "Filename routine secure." : "Filename correction noted."} Main Task 1 has been submitted.`, filenameCorrect ? "success" : "info");
  }

  function checkVocabulary() {
    const answered = vocab.filter(([id]) => state.task2.vocabulary.answers[id]).length;
    if (answered < vocab.length) return setFeedback($("#vocabulary-feedback"), "Match all eight terms before checking.", "warning");
    const score = vocab.filter(([id, , definition]) => state.task2.vocabulary.answers[id] === definition).length;
    state.task2.vocabulary.score = score;
    state.task2.vocabulary.submitted = true;
    setFeedback($("#vocabulary-feedback"), score === vocab.length
      ? "All eight terms are accurate."
      : `${score} of ${vocab.length} correct. Revise the mismatches: focus on the difference between a plan (algorithm), executable instructions (program) and written instructions (source code).`, score === vocab.length ? "success" : "warning");
    scheduleSave();
  }

  function checkIPO() {
    const input = normalise(state.task2.ipo.input);
    const process = normalise(state.task2.ipo.process);
    const output = normalise(state.task2.ipo.output);
    if (![input, process, output].every((v) => v.length >= 5)) return setFeedback($("#ipo-feedback"), "Describe the input, processing and output in all three boxes.", "warning");
    const indicators = [
      /price|three item|item cost/.test(input),
      /add|total|sum|calculate/.test(process) && /compare|threshold|free delivery|qualif/.test(process),
      /total|price/.test(output) && /delivery|qualif|message/.test(output),
    ];
    state.task2.ipo.indicators = indicators;
    state.task2.ipo.submitted = true;
    const score = indicators.filter(Boolean).length;
    setFeedback($("#ipo-feedback"), score === 3
      ? "Your IPO model identifies data entering the system, the calculation/decision, and the displayed results."
      : `${score} of 3 parts contain the expected detail. Improve the model by naming the three prices, adding and comparing the total, and displaying both the total and delivery decision.`, score === 3 ? "success" : "warning");
    scheduleSave();
  }

  function checkTrace() {
    const { score, output, line, explanation } = state.task2.trace;
    if (![score, output, line, explanation].every((v) => hasText(v, 1)) || !hasText(explanation, 12)) return setFeedback($("#trace-feedback"), "Answer all four trace questions and give a developed explanation.", "warning");
    let resultScore = 0;
    if (String(score).trim() === "9") resultScore++;
    if (/challenge unlocked/i.test(output)) resultScore++;
    if (/4|if score|score\s*>?=/.test(line.toLowerCase())) resultScore++;
    if (/9|greater|equal|>=|condition|true|8/.test(explanation.toLowerCase())) resultScore++;
    state.task2.trace.resultScore = resultScore;
    state.task2.trace.submitted = true;
    setFeedback($("#trace-feedback"), resultScore === 4
      ? "Trace complete: the value becomes 9, the condition is true and the challenge message is selected."
      : `${resultScore} of 4 indicators are secure. Trace assignments in order, then evaluate the condition using the final value.`, resultScore === 4 ? "success" : "warning");
    scheduleSave();
  }

  function initialiseEditor() {
    ace.config.set("basePath", "libraries/ace");
    editor = ace.edit("python-editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.session.setUseWorker(false);
    editor.setOptions({
      fontSize: "15px",
      showPrintMargin: false,
      tabSize: 4,
      useSoftTabs: true,
      wrap: true,
      enableBasicAutocompletion: false,
      highlightActiveLine: true,
      behavioursEnabled: true,
    });
    editor.commands.addCommand({ name: "runCode", bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" }, exec: () => runActiveCode() });
    editor.session.on("change", () => {
      if (!editor) return;
      state.python.files[state.python.currentFile].code = editor.getValue();
      scheduleSave();
    });
    editor.selection.on("changeCursor", () => {
      const pos = editor.getCursorPosition();
      $("#cursor-position").textContent = `Ln ${pos.row + 1}, Col ${pos.column + 1}`;
    });
    loadEditorFile(state.python.currentFile, false);
    startPythonWorker();
  }

  function loadEditorFile(fileId, saveCurrent = true) {
    if (editor && saveCurrent && state.python.currentFile) state.python.files[state.python.currentFile].code = editor.getValue();
    state.python.currentFile = fileId;
    if (editor) {
      editor.setValue(state.python.files[fileId].code, -1);
      editor.clearSelection();
      clearEditorError();
    }
    $$(".editor-tab").forEach((tab) => {
      const active = tab.dataset.file === fileId;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $("#file-task-prompt").textContent = filePrompts[fileId];
    $("#code-compare").hidden = true;
    $("#compare-code").textContent = "Compare starter";
    $("#run-count").textContent = `Runs: ${state.python.files[fileId].runCount || 0}`;
    showStoredOutput();
    scheduleSave();
  }

  function showStoredOutput() {
    const output = state.python.files[state.python.currentFile].output || "";
    const consoleEl = $("#python-console");
    consoleEl.innerHTML = output ? `<span class="console-output">${escapeHtml(output)}</span>` : `<span class="console-system">Ready. Run the active file when Python has loaded.</span>`;
  }

  function appendConsole(text, kind = "output") {
    const consoleEl = $("#python-console");
    const span = document.createElement("span");
    span.className = `console-${kind}`;
    span.textContent = String(text);
    consoleEl.appendChild(span);
    if (!String(text).endsWith("\n")) consoleEl.appendChild(document.createTextNode("\n"));
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function setRuntimeStatus(message, type = "") {
    const el = $("#python-status");
    el.textContent = message;
    el.className = `runtime-status ${type}`.trim();
  }

  function setRunButtons(running) {
    $("#run-code").disabled = running || !pythonReady;
    $("#stop-code").disabled = !running;
    $$("#test-debug, #test-challenge, #submit-python-evidence").forEach((button) => button.disabled = running || !pythonReady);
  }

  function startPythonWorker() {
    if (pythonWorker) pythonWorker.terminate();
    pythonReady = false;
    setRuntimeStatus("Loading local Python…");
    setRunButtons(false);
    try {
      pythonWorker = new Worker("python/worker.js");
    } catch (error) {
      setRuntimeStatus("Static hosting required", "error");
      appendConsole("The Python worker could not start. Open the extracted folder through a static web server rather than file://.", "error");
      return;
    }
    pythonWorker.onmessage = handleWorkerMessage;
    pythonWorker.onerror = (event) => {
      pythonReady = false;
      setRuntimeStatus("Python failed to load", "error");
      appendConsole(`Worker error: ${event.message}`, "error");
      setRunButtons(false);
    };
  }

  function handleWorkerMessage(event) {
    const data = event.data || {};
    if (data.type === "ready") {
      pythonReady = true;
      setRuntimeStatus("Python 3 ready", "ready");
      setRunButtons(false);
      appendConsole("Python 3 runtime loaded locally. Student code is executed in this browser.", "system");
      return;
    }
    if (data.type === "initError") {
      pythonReady = false;
      setRuntimeStatus("Python failed to load", "error");
      appendConsole(data.message, "error");
      return;
    }
    const context = runContexts.get(data.runId);
    if (!context && data.runId) return;

    if (data.type === "runStart") {
      setRuntimeStatus("Program running…", "busy");
      return;
    }
    if (data.type === "stdout" || data.type === "stderr") {
      const kind = data.type === "stderr" ? "error" : "output";
      context.capture += `${data.text}\n`;
      if (!context.silent) appendConsole(data.text, kind);
      return;
    }
    if (data.type === "queuedInput") {
      const transcript = `${data.prompt || ""}${data.value}`;
      context.capture += `${transcript}\n`;
      if (!context.silent) appendConsole(`> ${transcript}`, "input");
      return;
    }
    if (data.type === "inputRequest") {
      context.capture += `${data.prompt || ""}`;
      if (!context.silent) {
        $("#console-prompt").textContent = data.prompt || "Input required";
        $("#console-input-form").hidden = false;
        $("#console-input").value = "";
        $("#console-input").focus();
        if (data.prompt) appendConsole(data.prompt, "input");
      }
      return;
    }
    if (data.type === "runComplete") {
      $("#console-input-form").hidden = true;
      activeRun = null;
      setRunButtons(false);
      setRuntimeStatus("Python 3 ready", "ready");
      if (!data.ok) {
        context.capture += `${data.error}\n`;
        if (!context.silent) appendConsole(cleanPythonError(data.error), "error");
        if (!context.silent && data.line) markEditorError(data.line, cleanPythonError(data.error));
      } else if (!context.silent) {
        appendConsole("[Program finished]", "system");
      }
      runContexts.delete(data.runId);
      context.resolve({ ok: Boolean(data.ok), output: context.capture.trim(), error: data.error || "", line: data.line || null });
    }
  }

  function cleanPythonError(text) {
    return String(text || "Python error")
      .replace(/File "<exec>", line (\d+)/g, (_, n) => `Student code, line ${Math.max(1, Number(n) - 5)}`)
      .replace(/at [^\n]+pyodide[^\n]*/gi, "")
      .trim();
  }

  function clearEditorError() {
    if (!editor) return;
    editor.session.clearAnnotations();
    if (errorMarker !== null) editor.session.removeMarker(errorMarker);
    errorMarker = null;
  }

  function markEditorError(line, message) {
    if (!editor || !line) return;
    clearEditorError();
    const row = Math.max(0, Number(line) - 1);
    editor.session.setAnnotations([{ row, column: 0, text: message.split("\n")[0], type: "error" }]);
    const Range = ace.require("ace/range").Range;
    errorMarker = editor.session.addMarker(new Range(row, 0, row, 1), "ace_error-line", "fullLine");
    editor.gotoLine(row + 1, 0, true);
  }

  function executePython(code, inputs = [], { silent = false, fileId = null } = {}) {
    if (!pythonReady || !pythonWorker) return Promise.resolve({ ok: false, output: "", error: "Python runtime is not ready." });
    if (activeRun) return Promise.resolve({ ok: false, output: "", error: "Another program is already running." });
    clearEditorError();
    const runId = `run-${Date.now()}-${++runCounter}`;
    activeRun = runId;
    setRunButtons(true);
    return new Promise((resolve, reject) => {
      runContexts.set(runId, { resolve, reject, capture: "", silent, fileId });
      pythonWorker.postMessage({ type: "run", runId, code, inputs });
    });
  }

  async function runActiveCode() {
    if (!pythonReady || activeRun) return;
    const fileId = state.python.currentFile;
    const file = state.python.files[fileId];
    file.code = editor.getValue();
    file.runCount = (file.runCount || 0) + 1;
    $("#run-count").textContent = `Runs: ${file.runCount}`;
    $("#python-console").innerHTML = "";
    const result = await executePython(file.code, [], { silent: false, fileId });
    file.output = result.output;
    scheduleSave();
  }

  function stopPython() {
    if (pythonWorker) pythonWorker.terminate();
    runContexts.forEach((context) => context.resolve({ ok: false, output: context.capture.trim(), error: "Program interrupted by user." }));
    runContexts.clear();
    activeRun = null;
    appendConsole("[Program interrupted. Python runtime restarting…]", "system");
    startPythonWorker();
  }

  async function runDebugTests() {
    if (!pythonReady) return;
    loadEditorFile("debug");
    const code = editor.getValue();
    const cases = [
      { input: "David", expected: /welcome/i, label: "normal name" },
      { input: "", expected: /must enter|enter a name|name required/i, label: "empty name" },
    ];
    const results = [];
    for (const test of cases) {
      const result = await executePython(code, [test.input], { silent: true, fileId: "debug" });
      results.push({ ...test, ok: result.ok && test.expected.test(result.output), output: result.output, error: result.error });
    }
    state.python.files.debug.code = code;
    state.python.debugTests = results;
    const passed = results.filter((r) => r.ok).length;
    setFeedback($("#debug-test-feedback"), passed === cases.length
      ? "Both debug checks passed: the program handles a name and an empty input."
      : `${passed} of ${cases.length} checks passed. Read the Python error or compare the expected behaviour for the failed case.`, passed === cases.length ? "success" : "warning");
    scheduleSave();
  }

  function outputMatchesNumber(output, number) {
    const text = normalise(output);
    if (number < 10) return /less|below|smaller/.test(text);
    if (number === 10) return /equal|same|exactly/.test(text);
    return /greater|above|larger|more/.test(text);
  }

  async function runChallengeTests(hidden = false) {
    if (!pythonReady) return [];
    loadEditorFile("challenge");
    const code = editor.getValue();
    const numbers = hidden ? [7, 10, 17] : [5, 10, 12];
    const results = [];
    for (const number of numbers) {
      const result = await executePython(code, [String(number)], { silent: true, fileId: "challenge" });
      results.push({ input: number, ok: result.ok && outputMatchesNumber(result.output, number), output: result.output, error: result.error });
    }
    state.python.files.challenge.code = code;
    if (hidden) state.python.hiddenTests = results.map(({ input, ok }) => ({ input, ok }));
    else state.python.challengeTests = results;
    if (!hidden) {
      const passed = results.filter((r) => r.ok).length;
      setFeedback($("#challenge-test-feedback"), passed === results.length
        ? "All visible tests passed, including the boundary value 10."
        : `${passed} of ${results.length} visible tests passed. Check that every decision path produces a clear message.`, passed === results.length ? "success" : "warning");
    }
    scheduleSave();
    return results;
  }

  async function submitPythonEvidence() {
    if (!pythonReady) return setFeedback($("#python-submit-feedback"), "Wait for the local Python runtime to finish loading.", "warning");
    state.python.files[state.python.currentFile].code = editor.getValue();
    if (!state.python.debugTests) await runDebugTests();
    if (!state.python.challengeTests) await runChallengeTests(false);
    const hidden = await runChallengeTests(true);
    const debugPassed = (state.python.debugTests || []).filter((r) => r.ok).length >= 1;
    const challengePassed = hidden.filter((r) => r.ok).length >= 2;
    const tableUsed = state.python.testTable.filter((row) => hasText(row.input) && hasText(row.expected) && hasText(row.actual)).length >= 2;
    const evidenceComplete = state.python.errorType && hasText(state.python.debugPurpose, 12) && hasText(state.python.debugNotes, 12) && hasText(state.python.programExplanation, 12) && tableUsed;
    if (!evidenceComplete) {
      setFeedback($("#python-submit-feedback"), "Complete the error type, debugging explanation, programming explanation and at least two rows of the test table.", "warning");
      return;
    }
    state.task2.pythonSubmitted = true;
    state.python.submittedAt = new Date().toISOString();
    const message = `${debugPassed ? "Debug evidence recorded" : "Debug attempt recorded"}; ${challengePassed ? "behaviour checks passed" : "programming attempt saved for feedback"}. Hidden checks do not require one exact coding style.`;
    setFeedback($("#python-submit-feedback"), message, debugPassed && challengePassed ? "success" : "info");
    scheduleSave();
  }

  function submitTask2() {
    const missing = [];
    if (!state.task2.vocabulary.submitted) missing.push("vocabulary");
    if (!state.task2.ipo.submitted) missing.push("IPO");
    if (!state.task2.trace.submitted) missing.push("trace");
    if (!state.task2.pythonSubmitted) missing.push("Python evidence");
    if (missing.length) {
      setFeedback($("#task2-feedback"), `Complete and submit: ${missing.join(", ")}.`, "warning");
      return;
    }
    markComplete("task2");
    setFeedback($("#task2-feedback"), "Baseline evidence submitted. The extension is optional; the plenary is now available.", "success");
  }

  function renderExtensionPrompt() {
    const choice = state.extension.choice;
    const area = $("#extension-response-area");
    if (!choice) { area.hidden = true; return; }
    const prompts = {
      improve: "Use extension_task.py. Summarise how the loop stops, how positive and negative values are handled, and what comments improve readability.",
      tests: "Create a test plan using normal, boundary and erroneous data. For each test, state the input, expected result and reason for choosing it.",
      explain: "Explain why changing several lines at once is a poor debugging strategy. Use the words test, error, change, result and debugging.",
      gcse: "Analyse: if age >= 13 and permission == \"yes\": access is granted. Give three tests, then rewrite the condition so students aged 16+ gain access even without permission.",
    };
    $("#extension-prompt").innerHTML = `<h3>${escapeHtml(prompts[choice])}</h3>`;
    area.hidden = false;
  }

  function submitExtension() {
    if (!state.extension.choice || !hasText(state.extension.response, 25)) return setFeedback($("#extension-feedback"), "Select a challenge and provide enough evidence to show your thinking.", "warning");
    state.extension.submitted = true;
    state.completed.extension = true;
    stamp("extensionCompleted");
    setFeedback($("#extension-feedback"), "Extension evidence saved and will be included in the PDF.", "success");
    updateJourney();
    scheduleSave();
  }

  function updateConfidenceLabel() {
    const labels = ["", "1 — Not confident", "2 — A little confident", "3 — Somewhat confident", "4 — Confident", "5 — Very confident"];
    $("#confidence-label").textContent = labels[Number($("#confidence").value)];
  }

  function submitPlenary() {
    const p = state.plenary;
    if (![p.remember, p.revisit, p.expectation, p.algorithmProgram].every((v) => hasText(v, 12))) {
      setFeedback($("#plenary-feedback"), "Complete all four reflection prompts using specific details from today’s lesson.", "warning");
      return;
    }
    const answer = normalise(p.algorithmProgram);
    const accurate = /algorithm/.test(answer) && /program/.test(answer) && /(steps|plan|sequence)/.test(answer) && /(code|language|implement|computer)/.test(answer);
    p.submitted = true;
    setFeedback($("#plenary-feedback"), accurate
      ? "Reflection saved. Your exit answer distinguishes a problem-solving plan from its coded implementation."
      : "Reflection saved. Improve the exit answer by stating that an algorithm is a sequence of steps and a program is an implementation written in a programming language.", accurate ? "success" : "warning");
    markComplete("plenary");
  }

  function buildReview() {
    const summary = $("#review-summary");
    const selectedHabit = habits.find(([id]) => id === state.starter.habitChoice)?.[1] || "Not selected";
    const tests = state.python.testTable.map((row) => `${row.type}: ${row.input || "—"} → expected ${row.expected || "—"}; actual ${row.actual || "—"}`).join("\n");
    const cards = [
      ["Student details", `Name: ${state.meta.name}\nClass: ${state.meta.className}\nLesson: Year 9 Week 1 Theory`],
      ["Do Now", `Classification score: ${state.starter.score ?? "Not checked"}/12\nChosen habit: ${selectedHabit}\nExplanation: ${state.starter.explanation || "—"}`],
      ["Main Task 1", `AO matches: ${state.task1.aoScore ?? "Not checked"}/3\nCommitments selected: ${state.task1.agreements.length}\nPersonal commitment: ${agreements[Number(state.task1.personalCommitment)] || "—"}\nReason: ${state.task1.commitmentReason || "—"}\nFilename: ${state.task1.filenameChoice || "—"}`],
      ["Baseline knowledge", `Vocabulary: ${state.task2.vocabulary.score ?? "Not checked"}/8\nIPO: ${state.task2.ipo.input || "—"} | ${state.task2.ipo.process || "—"} | ${state.task2.ipo.output || "—"}\nTrace score: ${state.task2.trace.resultScore ?? "Not checked"}/4\nExplanation: ${state.task2.trace.explanation || "—"}`],
      ["Python evidence", `Debug runs: ${state.python.files.debug.runCount}\nChallenge runs: ${state.python.files.challenge.runCount}\nDebug notes: ${state.python.debugNotes || "—"}\nProgram explanation: ${state.python.programExplanation || "—"}\n${tests}`],
      ["Plenary", `Confidence: ${state.plenary.confidence}/5\nRemember: ${state.plenary.remember || "—"}\nRevisit: ${state.plenary.revisit || "—"}\nExpectation: ${state.plenary.expectation || "—"}\nExit answer: ${state.plenary.algorithmProgram || "—"}`],
    ];
    if (state.extension.submitted) cards.push(["Optional extension", `${state.extension.choice}\n${state.extension.response}`]);
    summary.innerHTML = cards.map(([title, text]) => `<article class="review-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text).replace(/\n/g, "<br>")}</p></article>`).join("");

    const missing = [];
    if (!state.completed.starter) missing.push("Do Now");
    if (!state.completed.task1) missing.push("Main Task 1");
    if (!state.completed.task2) missing.push("Main Task 2");
    if (!state.completed.plenary) missing.push("Plenary");
    const warning = $("#incomplete-warnings");
    if (missing.length) {
      warning.className = "warning-box has-warning";
      warning.innerHTML = `<strong>Incomplete core sections:</strong> ${escapeHtml(missing.join(", "))}. Return to these sections before exporting.`;
    } else {
      warning.className = "warning-box";
      warning.innerHTML = `<div class="feedback success">All core sections have been submitted. Review your details and download your evidence.</div>`;
    }
  }

  function makePdf() {
    if (!window.jspdf?.jsPDF) throw new Error("PDF library did not load.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    const margin = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usable = pageWidth - margin * 2;
    let y = margin;

    function newPage() { doc.addPage(); y = margin; }
    function ensure(height) { if (y + height > pageHeight - margin) newPage(); }
    function line(text, opts = {}) {
      const size = opts.size || 10;
      const font = opts.font || "helvetica";
      const style = opts.style || "normal";
      const indent = opts.indent || 0;
      doc.setFont(font, style);
      doc.setFontSize(size);
      doc.setTextColor(...(opts.color || [25, 38, 54]));
      const lines = doc.splitTextToSize(String(text ?? "—"), usable - indent);
      const height = lines.length * (size * .42 + 1.2);
      ensure(height + 2);
      doc.text(lines, margin + indent, y);
      y += height;
    }
    function heading(text, level = 1) {
      const sizes = { 1: 17, 2: 13, 3: 11 };
      ensure(level === 1 ? 16 : 11);
      doc.setFillColor(level === 1 ? 8 : 23, level === 1 ? 35 : 105, level === 1 ? 62 : 210);
      doc.roundedRect(margin, y - 5, usable, level === 1 ? 11 : 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(sizes[level]);
      doc.text(String(text), margin + 3, y + (level === 1 ? 2 : 0));
      y += level === 1 ? 12 : 9;
    }
    function labelValue(label, value) {
      doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(37, 74, 107);
      ensure(8); doc.text(`${label}:`, margin, y); y += 4;
      line(value || "—", { size: 9.5, indent: 3 }); y += 1;
    }
    function codeBlock(title, code) {
      heading(title, 3);
      doc.setFont("courier", "normal"); doc.setFontSize(8);
      const rawLines = String(code || "").split("\n");
      rawLines.forEach((raw) => {
        const wrapped = doc.splitTextToSize(raw || " ", usable - 6);
        wrapped.forEach((part) => {
          ensure(5);
          doc.setFillColor(244, 247, 250);
          doc.rect(margin, y - 3.5, usable, 4.7, "F");
          doc.setTextColor(22, 36, 49);
          doc.text(part, margin + 3, y);
          y += 4.4;
        });
      });
      y += 2;
    }

    doc.setFillColor(8, 35, 62);
    doc.rect(0, 0, pageWidth, 36, "F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(21);
    doc.text("Year 9 Computer Science", margin, 15);
    doc.setFontSize(14); doc.text("Week 1 Theory — Becoming a Year 9 Computer Scientist", margin, 25);
    y = 44;
    labelValue("Student", state.meta.name);
    labelValue("Class", state.meta.className);
    labelValue("Export date", new Date().toLocaleDateString());

    heading("Learning focus", 1);
    labelValue("Key Topic", "Year 9 Computer Science readiness");
    labelValue("WAGBA", "Demonstrate what we already know about algorithms and Python, and establish the routines needed to work successfully in Year 9 Computer Science.");
    labelValue("Knowledge", "Algorithm, program, source code, IPO, AO1–AO3, code/file/evidence expectations.");
    labelValue("Skills", "Trace, debug, use technical vocabulary, organise files and reflect.");
    labelValue("Understanding", "Successful programming involves planning, testing, debugging, explaining and improving.");
    labelValue("Keywords", "algorithm, program, source code, input, process, output, variable, selection, iteration, syntax error, logic error, AO1, AO2, AO3");

    heading("Do Now evidence", 1);
    labelValue("Classification score", `${state.starter.score ?? "Not checked"}/12`);
    labelValue("Chosen productive habit", habits.find(([id]) => id === state.starter.habitChoice)?.[1] || "—");
    labelValue("Explanation", state.starter.explanation);

    heading("Main Task 1 evidence", 1);
    labelValue("AO matches", aoQuestions.map(([id, question]) => `${question} → ${state.task1.ao[id] || "—"}`).join("\n"));
    labelValue("Working commitments", state.task1.agreements.map((i) => agreements[i]).join("\n"));
    labelValue("Personal commitment", agreements[Number(state.task1.personalCommitment)] || "—");
    labelValue("Reason", state.task1.commitmentReason);
    labelValue("Filename", state.task1.filenameChoice);

    heading("Main Task 2 — baseline", 1);
    labelValue("Vocabulary result", `${state.task2.vocabulary.score ?? "Not checked"}/8`);
    labelValue("Inputs", state.task2.ipo.input);
    labelValue("Processing", state.task2.ipo.process);
    labelValue("Outputs", state.task2.ipo.output);
    labelValue("Trace responses", `Final score: ${state.task2.trace.score}\nOutput: ${state.task2.trace.output}\nSelection: ${state.task2.trace.line}\nExplanation: ${state.task2.trace.explanation}`);

    heading("Programming evidence", 1);
    codeBlock("debug_task.py", state.python.files.debug.code);
    labelValue("Selected debug output", state.python.files.debug.output || state.python.debugTests?.map((t) => t.output).join("\n") || "—");
    labelValue("Error type", state.python.errorType);
    labelValue("Purpose of condition", state.python.debugPurpose);
    labelValue("Corrections and debugging notes", state.python.debugNotes);
    codeBlock("number_challenge.py", state.python.files.challenge.code);
    labelValue("Selected challenge output", state.python.files.challenge.output || state.python.challengeTests?.map((t) => `Input ${t.input}: ${t.output}`).join("\n") || "—");
    labelValue("Program explanation", state.python.programExplanation);
    labelValue("Test evidence", state.python.testTable.map((r) => `${r.type} | input: ${r.input || "—"} | expected: ${r.expected || "—"} | actual: ${r.actual || "—"}`).join("\n"));
    labelValue("Run counts", `debug_task.py: ${state.python.files.debug.runCount}; number_challenge.py: ${state.python.files.challenge.runCount}`);

    if (state.extension.submitted) {
      heading("Optional extension", 1);
      labelValue("Chosen extension", state.extension.choice);
      labelValue("Evidence", state.extension.response);
      if (state.python.files.extension.code !== starterFiles.extension) codeBlock("extension_task.py", state.python.files.extension.code);
    }

    heading("Plenary", 1);
    labelValue("Confidence", `${state.plenary.confidence}/5`);
    labelValue("One thing remembered confidently", state.plenary.remember);
    labelValue("Area to revisit", state.plenary.revisit);
    labelValue("Year 9 expectation", state.plenary.expectation);
    labelValue("Algorithm vs program", state.plenary.algorithmProgram);

    heading("Completion summary", 1);
    labelValue("Core sections", ["starter", "task1", "task2", "plenary"].map((key) => `${sectionTitles[key]}: ${state.completed[key] ? "Completed" : "Incomplete"}`).join("\n"));
    doc.setProperties({ title: "Year 9 Week 1 Theory Evidence", subject: "Computer Science", author: state.meta.name || "Student" });
    return doc;
  }

  async function downloadPdf() {
    const status = $("#export-status");
    try {
      setFeedback(status, "Generating PDF…", "info");
      const doc = makePdf();
      const filename = `Year9_${safeFilePart(state.meta.className)}_${safeFilePart(state.meta.name)}_Week1_Theory.pdf`;
      doc.save(filename);
      setFeedback(status, `Downloaded ${filename}`, "success");
    } catch (error) {
      setFeedback(status, `PDF export failed: ${error.message}. Use the print-friendly fallback.`, "error");
    }
  }

  async function downloadBundle() {
    const status = $("#export-status");
    if (!window.JSZip) return setFeedback(status, "ZIP library did not load.", "error");
    try {
      setFeedback(status, "Building submission bundle…", "info");
      const doc = makePdf();
      const pdfBlob = doc.output("blob");
      const base = `Year9_${safeFilePart(state.meta.className)}_${safeFilePart(state.meta.name)}_Week1_Theory`;
      const zip = new JSZip();
      zip.file(`${base}.pdf`, pdfBlob);
      zip.file(`${base}_debug_task.py`, state.python.files.debug.code);
      zip.file(`${base}_number_challenge.py`, state.python.files.challenge.code);
      if (state.extension.submitted || state.python.files.extension.code !== starterFiles.extension) zip.file(`${base}_extension_task.py`, state.python.files.extension.code);
      zip.file(`${base}_output_log.txt`, ["DEBUG TASK", state.python.files.debug.output, "", "NUMBER CHALLENGE", state.python.files.challenge.output].join("\n"));
      zip.file("metadata.json", JSON.stringify({
        student: state.meta.name,
        class: state.meta.className,
        lesson: "Year 9 Week 1 Theory — Becoming a Year 9 Computer Scientist",
        completionDate: new Date().toISOString(),
        completed: state.completed,
      }, null, 2));
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${base}_Submission.zip`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      setFeedback(status, "Submission ZIP downloaded. Check it contains the PDF and Python files.", "success");
    } catch (error) {
      setFeedback(status, `Bundle export failed: ${error.message}`, "error");
    }
  }

  function populateTeacherSample() {
    if (state.meta.name) return;
    state.meta.name = "Sample Student";
    state.meta.className = "9T";
    state.completed = { starter: true, task1: true, task2: true, extension: false, plenary: true, review: false };
    state.starter.classifications = Object.fromEntries(habits.map(([id, , answer]) => [id, answer]));
    state.starter.habitChoice = "read-errors";
    state.starter.explanation = "Reading the error first helps me identify the cause before making a controlled change and testing again.";
    state.starter.score = 12;
    state.task1.ao = { ao1: "AO1", ao2: "AO2", ao3: "AO3" };
    state.task1.aoScore = 3;
    state.task1.agreements = [0,1,2,3,4,5];
    state.task1.personalCommitment = "2";
    state.task1.commitmentReason = "Changing one thing at a time will let me connect each edit with the result.";
    state.task1.filenameChoice = "9T_Sample_Student_W1_Baseline.py";
    state.task1.submitted = true;
    state.task2.vocabulary.answers = Object.fromEntries(vocab.map(([id, , definition]) => [id, definition]));
    state.task2.vocabulary.score = 8; state.task2.vocabulary.submitted = true;
    state.task2.ipo = { input: "The prices of three items", process: "Add the prices and compare the total with the free-delivery threshold", output: "The total and a delivery message", submitted: true, indicators: [true,true,true] };
    state.task2.trace = { score: "9", output: "Challenge unlocked", line: "Line 4: if score >= 8", explanation: "The variable becomes 9, so the condition is true and the first message is selected.", resultScore: 4, submitted: true };
    state.task2.pythonSubmitted = true;
    state.python.files.debug.code = `name = input("Enter your name: ")\n\nif name == "":\n    print("You must enter a name")\nelse:\n    print("Welcome", name)`;
    state.python.files.challenge.code = `number = int(input("Enter a number: "))\nif number > 10:\n    print("Greater than 10")\nelif number == 10:\n    print("Equal to 10")\nelse:\n    print("Less than 10")`;
    state.python.errorType = "Syntax error";
    state.python.debugPurpose = "It checks whether the user entered an empty name.";
    state.python.debugNotes = "I added the missing colon after else and tested both decision paths.";
    state.python.programExplanation = "The if/elif/else selection compares the input with 10 and executes one matching branch.";
    state.python.testTable = [
      { input: "5", type: "Normal", expected: "Less than 10", actual: "Less than 10" },
      { input: "10", type: "Boundary", expected: "Equal to 10", actual: "Equal to 10" },
      { input: "word", type: "Erroneous", expected: "Runtime error or validation message", actual: "ValueError" },
    ];
    state.plenary = { confidence: 4, remember: "AO1, AO2 and AO3 require different kinds of thinking.", revisit: "I need more practice selecting robust test data.", expectation: "I will read errors and change one thing at a time.", algorithmProgram: "An algorithm is an ordered plan of steps. A program is the implementation of that algorithm in a programming language for a computer to execute.", submitted: true };
    state.meta.currentSection = "starter";
    saveState();
  }

  function initEntry() {
    const overlay = $("#entry-overlay");
    const resume = $("#resume-button");
    if (teacherMode) {
      populateTeacherSample();
      overlay.hidden = true;
      return;
    }
    if (state.meta.name && state.meta.className) {
      resume.classList.remove("hidden");
      $("#student-name").value = state.meta.name;
      $("#student-class").value = state.meta.className;
    }
    $("#entry-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#student-name").value.trim();
      const className = $("#student-class").value.trim();
      $("#name-error").textContent = name.length < 2 ? "Enter your full name." : "";
      $("#class-error").textContent = className.length < 1 ? "Enter your class." : "";
      if (name.length < 2 || className.length < 1) return;
      state.meta.name = name;
      state.meta.className = className;
      state.meta.dateStarted ||= new Date().toISOString();
      overlay.hidden = true;
      buildTask1UI();
      hydrateStaticFields();
      saveState();
    });
    resume.addEventListener("click", () => { overlay.hidden = true; hydrateStaticFields(); });
  }

  function wireEvents() {
    $$(".journey-step").forEach((button) => button.addEventListener("click", () => showSection(button.dataset.section)));
    $("#back-button").addEventListener("click", () => {
      const i = sectionOrder.indexOf(state.meta.currentSection);
      if (i > 0) showSection(sectionOrder[i - 1]);
    });
    $("#next-button").addEventListener("click", () => {
      const current = state.meta.currentSection;
      if (current === "task2" && state.completed.task2) return showSection("extension");
      if (current === "extension") return showSection("plenary");
      const i = sectionOrder.indexOf(current);
      if (i < sectionOrder.length - 1) showSection(sectionOrder[i + 1]);
    });
    $("#submit-starter").addEventListener("click", submitStarter);
    $("#check-ao").addEventListener("click", checkAO);
    $("#submit-task1").addEventListener("click", submitTask1);
    $("#check-vocabulary").addEventListener("click", checkVocabulary);
    $("#check-ipo").addEventListener("click", checkIPO);
    $("#check-trace").addEventListener("click", checkTrace);
    $("#submit-task2").addEventListener("click", submitTask2);
    $("#test-debug").addEventListener("click", runDebugTests);
    $("#test-challenge").addEventListener("click", () => runChallengeTests(false));
    $("#submit-python-evidence").addEventListener("click", submitPythonEvidence);
    $("#run-code").addEventListener("click", runActiveCode);
    $("#stop-code").addEventListener("click", stopPython);
    $("#reset-code").addEventListener("click", () => {
      const id = state.python.currentFile;
      if (!confirm(`Reset ${id}_task.py to its starter code?`)) return;
      state.python.files[id].code = state.python.files[id].initial;
      state.python.files[id].output = "";
      editor.setValue(state.python.files[id].code, -1);
      showStoredOutput();
      scheduleSave();
    });
    $("#clear-output").addEventListener("click", () => {
      state.python.files[state.python.currentFile].output = "";
      $("#python-console").innerHTML = `<span class="console-system">Output cleared.</span>`;
      scheduleSave();
    });
    $("#copy-code").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(editor.getValue()); appendConsole("Code copied to clipboard.", "system"); }
      catch (_) { appendConsole("Clipboard access is unavailable in this browser.", "error"); }
    });
    $("#compare-code").addEventListener("click", () => {
      const panel = $("#code-compare");
      const file = state.python.files[state.python.currentFile];
      panel.hidden = !panel.hidden;
      if (!panel.hidden) {
        $("#starter-code-view").textContent = file.initial;
        $("#current-code-view").textContent = editor.getValue();
      }
      $("#compare-code").textContent = panel.hidden ? "Compare starter" : "Close comparison";
    });
    $("#download-code").addEventListener("click", () => {
      const id = state.python.currentFile;
      const blob = new Blob([editor.getValue()], { type: "text/x-python" });
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${id === "challenge" ? "number_challenge" : `${id}_task`}.py`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
    $("#upload-code").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { editor.setValue(String(reader.result), -1); state.python.files[state.python.currentFile].code = editor.getValue(); scheduleSave(); };
      reader.readAsText(file); event.target.value = "";
    });
    $("#fullscreen-editor").addEventListener("click", () => {
      const card = $(".python-card");
      card.classList.toggle("editor-fullscreen");
      $("#fullscreen-editor").textContent = card.classList.contains("editor-fullscreen") ? "Exit full screen" : "Full screen";
      setTimeout(() => editor.resize(), 100);
    });
    $$(".editor-tab").forEach((tab) => tab.addEventListener("click", () => loadEditorFile(tab.dataset.file)));
    $("#console-input-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const value = $("#console-input").value;
      appendConsole(`> ${value}`, "input");
      $("#console-input-form").hidden = true;
      pythonWorker?.postMessage({ type: "inputResponse", value });
    });

    $$(".subtask-tab").forEach((tab) => tab.addEventListener("click", () => {
      const key = tab.dataset.subtask;
      $$(".subtask-tab").forEach((t) => { const active = t === tab; t.classList.toggle("active", active); t.setAttribute("aria-selected", String(active)); });
      $$(".subtask-panel").forEach((panel) => { panel.hidden = panel.id !== `subtask-${key}`; panel.classList.toggle("active", panel.id === `subtask-${key}`); });
      if (key === "python") setTimeout(() => editor?.resize(), 80);
    }));

    $$('input[name="extension-choice"]').forEach((radio) => radio.addEventListener("change", () => { state.extension.choice = radio.value; renderExtensionPrompt(); scheduleSave(); }));
    $("#submit-extension").addEventListener("click", submitExtension);
    $("#skip-extension").addEventListener("click", () => showSection("plenary"));
    $("#confidence").addEventListener("input", (event) => { state.plenary.confidence = Number(event.target.value); updateConfidenceLabel(); scheduleSave(); });
    $("#submit-plenary").addEventListener("click", submitPlenary);
    $("#download-pdf").addEventListener("click", downloadPdf);
    $("#download-bundle").addEventListener("click", downloadBundle);
    $("#print-fallback").addEventListener("click", () => { buildReview(); window.print(); });

    $("#reset-progress").addEventListener("click", () => {
      if (!confirm("Delete all saved answers and code for this lesson on this device?")) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    $("#learning-toggle").addEventListener("click", () => {
      const panel = $("#learning-panel");
      panel.classList.toggle("open");
      $("#learning-toggle").setAttribute("aria-expanded", String(panel.classList.contains("open")));
    });
    $("#learning-close").addEventListener("click", () => { $("#learning-panel").classList.remove("open"); $("#learning-toggle").setAttribute("aria-expanded", "false"); });

    $$(".image-button").forEach((button) => button.addEventListener("click", () => {
      const img = $("img", button);
      $("#image-modal-img").src = button.dataset.image;
      $("#image-modal-img").alt = img?.alt || "Enlarged lesson visual";
      $("#image-modal").hidden = false;
      $("#image-modal-close").focus();
    }));
    const closeModal = () => { $("#image-modal").hidden = true; };
    $("#image-modal-close").addEventListener("click", closeModal);
    $("#image-modal").addEventListener("click", (event) => { if (event.target === $("#image-modal")) closeModal(); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!$("#image-modal").hidden) closeModal();
        if ($(".python-card").classList.contains("editor-fullscreen")) $("#fullscreen-editor").click();
      }
    });
  }

  function initialise() {
    initEntry();
    buildHabitUI();
    buildTask1UI();
    buildVocabularyUI();
    buildTestTable();
    hydrateStaticFields();
    wireTextFields();
    wireEvents();
    initialiseEditor();
    updateJourney();
    showSection(getUnlocked().has(state.meta.currentSection) ? state.meta.currentSection : "starter");
    if (teacherMode) $("#entry-overlay").hidden = true;
    window.addEventListener("beforeunload", saveState);
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
