(() => {
  "use strict";

  const LESSON = {
    school: "Tenby International School Tropicana Aman",
    year: "Year 8",
    week: 1,
    assignment: "Week 1 Theory",
    title: "Computer Science Foundations",
    learning: {
      topic: "Computer Science foundations: algorithms, programs, IPO and productive learning habits",
      wagba: "We are getting better at explaining how we learn in Computer Science and showing what we already know about algorithms and Python.",
      knowledge: "Know what algorithms, programs, input, process and output mean, and know the expectations for learning Computer Science.",
      skills: "Sequence instructions, read and predict simple Python, classify IPO and improve unclear instructions.",
      understanding: "Understand that algorithms must be clear, ordered and precise, and that testing, feedback and debugging help us improve.",
      keywords: "algorithm · program · sequence · input · process · output · variable · predict · debug · evidence",
      challenge: "Improve an unclear algorithm and justify why your version is easier for a computer or another student to follow."
    }
  };

  const SECTIONS = [
    { id: "starter", title: "Starter: What Do You Remember?", short: "Starter", core: true },
    { id: "main1", title: "Main Task 1: Learn and Practise", short: "Main Task 1", core: true },
    { id: "main2", title: "Main Task 2: Algorithm Rescue", short: "Main Task 2", core: true },
    { id: "extension", title: "Extension Challenge Ladder", short: "Extension", core: false, optional: true },
    { id: "plenary", title: "Plenary: Show What You Understand", short: "Plenary", core: true },
    { id: "review", title: "Review and PDF Export", short: "Review", core: true }
  ];

  const STARTER_ORDER = ["Wake up", "Get out of bed", "Put on shoes", "Leave home for school"];
  const BADGE_ORDER = ["Start", "Ask the user for their name", "Store the name", "Create a greeting using the name", "Display the greeting", "End"];

  const GLOSSARY = [
    { term: "Algorithm", en: "A finite, ordered and precise set of steps for solving a problem.", ms: "Algoritma — satu set langkah yang teratur dan tepat untuk menyelesaikan masalah.", zh: "算法——为解决问题而设计的一组有序、明确的步骤。" },
    { term: "Program", en: "An algorithm written in a language that a computer can execute.", ms: "Atur cara — algoritma yang ditulis dalam bahasa yang boleh dilaksanakan oleh komputer.", zh: "程序——用计算机可以执行的语言写成的算法。" },
    { term: "Sequence", en: "The order in which instructions happen.", ms: "Urutan — susunan arahan dilaksanakan.", zh: "顺序——指令执行的先后次序。" },
    { term: "Input", en: "Data that enters a system.", ms: "Input / masukan — data yang masuk ke dalam sistem.", zh: "输入——进入系统的数据。" },
    { term: "Process", en: "What the system does to the input data.", ms: "Proses — apa yang sistem lakukan terhadap data input.", zh: "处理——系统对输入数据所做的操作。" },
    { term: "Output", en: "Information produced by a system.", ms: "Output / keluaran — maklumat yang dihasilkan oleh sistem.", zh: "输出——系统产生的信息。" },
    { term: "Variable", en: "A named place used to store a value in a program.", ms: "Pemboleh ubah — tempat bernama untuk menyimpan nilai dalam atur cara.", zh: "变量——程序中用名称保存数值或信息的位置。" },
    { term: "Debug", en: "Find, understand and correct a problem.", ms: "Nyahpepijat — mencari, memahami dan membetulkan masalah.", zh: "调试——查找、理解并修正问题。" },
    { term: "Evidence", en: "Work that shows what you attempted, understood or improved.", ms: "Bukti — kerja yang menunjukkan percubaan, pemahaman atau penambahbaikan.", zh: "证据——展示你尝试、理解或改进内容的学习成果。" }
  ];

  const LEVEL1_SYSTEMS = {
    locker: {
      title: "Smart locker",
      brief: "A student scans an ID card. The system checks whether the ID is authorised. The locker unlocks and shows a green light.",
      statements: ["The student scans their ID card.", "The system checks whether the ID is authorised.", "The locker unlocks and shows a green light."]
    },
    canteen: {
      title: "Canteen checkout",
      brief: "A student selects a meal. The system calculates the total price. The checkout screen displays the total.",
      statements: ["The student selects a meal.", "The system calculates the total price.", "The checkout screen displays the total."]
    },
    weather: {
      title: "Weather station",
      brief: "A sensor collects a temperature reading. The system records the reading. A display shows the temperature.",
      statements: ["The sensor collects a temperature reading.", "The system records the reading.", "The display shows the temperature."]
    }
  };

  const LEVEL3_SYSTEMS = {
    visitor: {
      title: "Visitor badge",
      brief: "Collect the visitor’s name and reason for visiting. Create a suitable badge message. Display the visitor’s name and where they should go."
    },
    club: {
      title: "Club sign-in",
      brief: "Collect the student’s name and chosen club. Record the selection. Display a confirmation message."
    },
    homework: {
      title: "Homework reminder",
      brief: "Collect a subject and deadline. Create a useful reminder. Display the subject and due date clearly."
    }
  };

  const DEFAULT_STATE = {
    version: 3,
    student: { fullName: "", className: "" },
    currentSection: 0,
    startedAt: "",
    updatedAt: "",
    supportLanguage: "en",
    attemptLog: [],
    starter: {
      order: ["Wake up", "Put on shoes", "Get out of bed", "Leave home for school"], orderChecked: false, orderAttempts: 0,
      algorithm: "", algorithmChecked: false, algorithmAttempts: 0,
      output: "", outputChecked: false, outputAttempts: 0,
      input: "", inputChecked: false, inputAttempts: 0,
      confidence: "", confidenceReason: ""
    },
    main1: {
      readAlgorithm: false, readIpo: false,
      programChoice: "", programChecked: false, programAttempts: 0,
      lunch: { input: "", process: "", output: "" }, lunchChecked: { input: false, process: false, output: false },
      habits: { error: "", copy: "", test: "" }, habitChecked: { error: false, copy: false, test: false },
      commitment: "", commitmentReason: "", commitmentSubmitted: false
    },
    main2: {
      ipo: { input: "", process: "", output: "" }, ipoChecked: { input: false, process: false, output: false },
      order: ["Display the greeting", "Ask the user for their name", "Create a greeting using the name", "Start", "Store the name", "End"], orderChecked: false, orderAttempts: 0,
      inputLine: "", inputLineChecked: false, inputLineAttempts: 0,
      variables: "", variablesChecked: false, variablesAttempts: 0,
      output: "", outputChecked: false, outputAttempts: 0,
      meaningfulName: "", meaningfulNameSubmitted: false,
      improvedAlgorithm: "", algorithmChecks: { clear: false, ordered: false, ipo: false }, algorithmSubmitted: false
    },
    extension: {
      level1: { system: "", roles: ["", "", ""], checked: false, attempts: 0, explanation: "", complete: false },
      level2: { choice: "", answer1: "", answer2: "", answer3: "", answer4: "", checks: { clear: false, ordered: false, precise: false }, submitted: false, complete: false, feedback: "" },
      level3: { system: "", purpose: "", input: "", process: "", output: "", algorithm: "", test: "", improvement: "", evidenceData: "", evidenceName: "", evidenceCaption: "", submitted: false, complete: false }
    },
    plenary: {
      difference: "", differenceChecked: false,
      doorRoles: ["", "", ""], doorChecked: false,
      improvedInstruction: "", improvementSubmitted: false,
      confidence: "", nextStep: "", submitted: false
    },
    pdfGeneratedAt: ""
  };

  let teacherMode = new URLSearchParams(location.search).get("teacher") === "1";
  let storageKey = teacherMode ? "tta_y8_w1_theory_redesign_teacher_v3" : "tta_y8_w1_theory_redesign_student_v3";
  let state = loadState();
  let saveTimer = null;
  let toastTimer = null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  function cloneDefault() { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }

  function mergeDeep(target, source) {
    Object.keys(source || {}).forEach(key => {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) target[key] = mergeDeep(target[key] || {}, source[key]);
      else target[key] = source[key];
    });
    return target;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(storageKey);
      const loaded = raw ? mergeDeep(cloneDefault(), JSON.parse(raw)) : cloneDefault();
      if (teacherMode && !loaded.student.fullName) loaded.student = { fullName: "Test Student", className: "8T" };
      return loaded;
    } catch {
      return cloneDefault();
    }
  }

  function saveState(immediate = false) {
    state.updatedAt = new Date().toISOString();
    const status = $("#saveStatus");
    if (status) status.textContent = "Saving…";
    clearTimeout(saveTimer);
    const commit = () => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        if (status) status.textContent = `Saved ${new Date(state.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      } catch {
        if (status) status.textContent = "Save failed — export your progress";
        showToast("Browser storage is full. Export your PDF before continuing.");
      }
    };
    if (immediate) commit(); else saveTimer = setTimeout(commit, 220);
  }

  function getPath(path) {
    return path.split(".").reduce((value, key) => value?.[key], state);
  }

  function setPath(path, value) {
    const parts = path.split(".");
    let target = state;
    parts.slice(0, -1).forEach(key => target = target[key]);
    target[parts.at(-1)] = value;
  }

  function recordAttempt(question, answer, outcome) {
    state.attemptLog.push({ question, answer: String(answer || "Not answered"), outcome, time: new Date().toISOString() });
    state.attemptLog = state.attemptLog.slice(-80);
  }

  function normalise(value) { return String(value || "").trim().toLowerCase().replace(/\s+/g, " "); }
  function arraysEqual(a, b) { return a.length === b.length && a.every((item, index) => item === b[index]); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }
  function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
  function safeFilename(value) { return String(value || "Student").trim().replace(/\s+/g, "_").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 48) || "Student"; }
  function formatDate(value) { return value ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Not recorded"; }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function init() {
    const accidentalQuery = new URLSearchParams(location.search);
    if (accidentalQuery.has("fullName") || accidentalQuery.has("className")) {
      accidentalQuery.delete("fullName");
      accidentalQuery.delete("className");
      const remaining = accidentalQuery.toString();
      window.history?.replaceState?.({}, "", `${location.pathname}${remaining ? `?${remaining}` : ""}`);
    }
    populateLearning();
    bindGlobalEvents();
    renderGlossary();
    if (teacherMode && !state.startedAt) {
      state.startedAt = new Date().toISOString();
      saveState(true);
    }
    const saved = Boolean(state.student.fullName && state.startedAt);
    $("#resumePanel").classList.toggle("hidden", !saved || teacherMode);
    if (saved) $("#resumeText").textContent = `${state.student.fullName} · ${state.student.className} · ${formatDate(state.updatedAt || state.startedAt)}`;
    if (teacherMode) showApp();
  }

  function populateLearning() {
    const l = LESSON.learning;
    $("#learningTopic").textContent = l.topic;
    $("#learningWagba").textContent = l.wagba;
    $("#learningKnowledge").textContent = l.knowledge;
    $("#learningSkills").textContent = l.skills;
    $("#learningUnderstanding").textContent = l.understanding;
    $("#learningKeywords").textContent = l.keywords;
    $("#learningChallenge").textContent = l.challenge;
  }

  function bindGlobalEvents() {
    $("#entryForm").addEventListener("submit", startLesson);
    $("#resumeButton").addEventListener("click", showApp);
    $("#startDifferentButton").addEventListener("click", () => {
      $("#resumePanel").classList.add("hidden");
      $("#fullName").focus();
    });
    $("#backButton").addEventListener("click", () => navigate(state.currentSection - 1));
    $("#nextButton").addEventListener("click", nextSection);
    $("#openJourneyButton").addEventListener("click", () => {
      const nav = $("#journeyNav");
      nav.classList.toggle("hidden");
      $("#openJourneyButton").setAttribute("aria-expanded", String(!nav.classList.contains("hidden")));
    });
    $("#journeyNav").addEventListener("click", event => {
      const button = event.target.closest("[data-section-index]");
      if (button && !button.disabled) navigate(Number(button.dataset.sectionIndex));
    });
    $("#sectionContainer").addEventListener("input", handleFieldInput);
    $("#sectionContainer").addEventListener("change", handleFieldInput);
    $("#sectionContainer").addEventListener("click", handleAction);
    $("#learningToggle").addEventListener("click", () => toggleLearning(true));
    $("#closeLearning").addEventListener("click", () => toggleLearning(false));
    $("#languageButton").addEventListener("click", () => $("#languageDialog").showModal());
    $("#closeLanguageDialog").addEventListener("click", () => $("#languageDialog").close());
    $("#supportLanguage").addEventListener("change", event => { state.supportLanguage = event.target.value; saveState(); renderGlossary(); });
    $("#exportHeaderButton").addEventListener("click", exportPdf);
    $("#closeImageDialog").addEventListener("click", () => $("#imageDialog").close());
    $("#imageDialog").addEventListener("click", event => { if (event.target === $("#imageDialog")) $("#imageDialog").close(); });
  }

  function startLesson(event) {
    event.preventDefault();
    const fullName = $("#fullName").value.trim();
    const className = $("#className").value.trim();
    $("#nameError").textContent = "";
    $("#classError").textContent = "";

    if (normalise(fullName) === "teacher") {
      teacherMode = true;
      storageKey = "tta_y8_w1_theory_redesign_teacher_v3";
      state = loadState();
      state.student = { fullName: "Test Student", className: className || "8T" };
      state.startedAt ||= new Date().toISOString();
      saveState(true);
      showApp();
      return;
    }

    let valid = true;
    if (fullName.length < 2 || !fullName.includes(" ")) { $("#nameError").textContent = "Enter your full name, including your family name."; valid = false; }
    if (className.length < 2) { $("#classError").textContent = "Enter your class, for example 8T."; valid = false; }
    if (!valid) return;
    state.student = { fullName, className };
    state.startedAt ||= new Date().toISOString();
    saveState(true);
    showApp();
  }

  function showApp() {
    $("#entryScreen").classList.add("hidden");
    $("#appShell").classList.remove("hidden");
    $("#studentChip").textContent = `${state.student.fullName} · ${state.student.className}`;
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function toggleLearning(open) {
    $("#learningPanel").classList.toggle("open", open);
    $("#learningToggle").setAttribute("aria-expanded", String(open));
  }

  function renderGlossary() {
    const lang = state.supportLanguage || "en";
    $("#supportLanguage").value = lang;
    $("#glossaryList").innerHTML = GLOSSARY.map(item => `<article class="glossary-item"><strong>${item.term}</strong><p>${escapeHtml(item[lang])}</p></article>`).join("");
  }

  function sectionCompletion(id) {
    if (id === "starter") {
      const s = state.starter;
      return s.orderChecked && s.algorithmChecked && s.outputChecked && s.inputChecked && s.confidence && s.confidenceReason.trim().length >= 10;
    }
    if (id === "main1") {
      const m = state.main1;
      return m.readAlgorithm && m.readIpo && m.programChecked && Object.values(m.lunchChecked).every(Boolean) && Object.values(m.habitChecked).every(Boolean) && m.commitmentSubmitted;
    }
    if (id === "main2") {
      const m = state.main2;
      return Object.values(m.ipoChecked).every(Boolean) && m.orderChecked && m.inputLineChecked && m.variablesChecked && m.outputChecked && m.meaningfulNameSubmitted && m.algorithmSubmitted;
    }
    if (id === "extension") return state.extension.level1.complete || state.extension.level2.complete || state.extension.level3.complete;
    if (id === "plenary") return state.plenary.submitted;
    if (id === "review") return state.plenary.submitted;
    return false;
  }

  function hasAttempt(id) {
    if (id === "starter") return state.starter.orderChecked || state.starter.algorithm || state.starter.output || state.starter.input || state.starter.confidence;
    if (id === "main1") return state.main1.readAlgorithm || state.main1.readIpo || state.main1.programChoice || state.main1.commitment;
    if (id === "main2") return state.main2.orderChecked || state.main2.inputLine || state.main2.variables || state.main2.improvedAlgorithm;
    if (id === "extension") return state.extension.level1.system || state.extension.level2.choice || state.extension.level3.system;
    if (id === "plenary") return state.plenary.difference || state.plenary.confidence;
    return false;
  }

  function sectionScore(id) {
    if (id === "starter") {
      const s = state.starter;
      return [arraysEqual(s.order, STARTER_ORDER), s.algorithm === "algorithm", normalise(s.output) === "aisha", /age|user|typed|entered/.test(normalise(s.input))].filter(Boolean).length;
    }
    if (id === "main1") {
      const m = state.main1;
      return [m.programChoice === "program", m.lunch.input === "Input", m.lunch.process === "Process", m.lunch.output === "Output", m.habits.error === "helps", m.habits.copy === "stops", m.habits.test === "helps"].filter(Boolean).length;
    }
    if (id === "main2") {
      const m = state.main2;
      let score = [m.ipo.input === "Input", m.ipo.process === "Process", m.ipo.output === "Output", m.inputLine === "1", variablesCorrect(), outputCorrect()].filter(Boolean).length;
      if (arraysEqual(m.order, BADGE_ORDER)) score += 2;
      return score;
    }
    return 0;
  }

  function sectionStatus(id) {
    if (!hasAttempt(id) && !sectionCompletion(id)) return { label: "Not started", cls: "not-started" };
    if (!sectionCompletion(id)) return { label: "In progress", cls: "attempted" };
    if (id === "starter") return sectionScore(id) === 4 ? { label: "Secure", cls: "secure" } : { label: "Developing", cls: "developing" };
    if (id === "main1") return sectionScore(id) >= 6 ? { label: "Secure", cls: "secure" } : { label: "Developing", cls: "developing" };
    if (id === "main2") return { label: sectionScore(id) >= 7 ? "Teacher review" : "Developing", cls: sectionScore(id) >= 7 ? "teacher-review" : "developing" };
    if (id === "extension") return { label: extensionProgressLabel(), cls: "teacher-review" };
    if (id === "plenary") return { label: "Teacher review", cls: "teacher-review" };
    return { label: "Ready", cls: "secure" };
  }

  function extensionProgressLabel() {
    const e = state.extension;
    if (e.level3.complete) return "Level 3 submitted";
    if (e.level2.complete) return "Level 2 complete";
    if (e.level1.complete) return "Level 1 complete";
    return "In progress";
  }

  function canAccess(index) {
    if (teacherMode) return true;
    const id = SECTIONS[index]?.id;
    if (id === "starter") return true;
    if (id === "main1") return sectionCompletion("starter");
    if (id === "main2") return sectionCompletion("main1");
    if (id === "extension" || id === "plenary") return sectionCompletion("main2");
    if (id === "review") return sectionCompletion("plenary");
    return false;
  }

  function render() {
    renderJourney();
    renderSection();
    renderNavigation();
  }

  function renderJourney() {
    const current = SECTIONS[state.currentSection];
    $("#currentSectionLabel").textContent = `Section ${state.currentSection + 1} of ${SECTIONS.length}`;
    $("#currentSectionTitle").textContent = current.title;
    const status = sectionStatus(current.id);
    $("#sectionStatusBadge").textContent = status.label;
    $("#sectionStatusBadge").className = `status-badge ${status.cls}`;
    const core = SECTIONS.filter(section => section.core && section.id !== "review");
    const completed = core.filter(section => sectionCompletion(section.id)).length;
    $("#progressBar").style.width = `${Math.round((completed / core.length) * 100)}%`;
    $("#progressText").textContent = `${completed} of ${core.length} core lesson sections completed · extension is optional`;
    $("#journeyNav").innerHTML = SECTIONS.map((section, index) => {
      const accessible = canAccess(index);
      const st = sectionStatus(section.id);
      return `<button class="journey-link ${index === state.currentSection ? "current" : ""} ${!accessible ? "locked" : ""}" data-section-index="${index}" type="button" ${!accessible ? "disabled" : ""}><span>${escapeHtml(section.short)}${section.optional ? " · optional" : ""}</span><span class="journey-status">${escapeHtml(accessible ? st.label : "Locked")}</span></button>`;
    }).join("");
  }

  function renderNavigation() {
    $("#backButton").disabled = state.currentSection === 0;
    const current = SECTIONS[state.currentSection];
    const next = state.currentSection + 1;
    $("#nextButton").textContent = current.id === "extension" ? "Continue to plenary" : current.id === "review" ? "Lesson complete" : "Next section";
    $("#nextButton").disabled = current.id === "review" || (!teacherMode && !sectionCompletion(current.id) && !current.optional);
    if (current.id === "extension") $("#nextButton").disabled = false;
    if (next < SECTIONS.length && !canAccess(next) && current.optional) $("#nextButton").disabled = false;
  }

  function navigate(index) {
    if (index < 0 || index >= SECTIONS.length || !canAccess(index)) return;
    state.currentSection = index;
    saveState(true);
    render();
    $(".journey-card").scrollIntoView({ behavior: "auto", block: "start" });
    $("#mainContent").focus({ preventScroll: true });
  }

  function nextSection() {
    const current = SECTIONS[state.currentSection];
    if (!teacherMode && !current.optional && !sectionCompletion(current.id)) {
      showToast("Complete the required checks in this section before continuing.");
      return;
    }
    navigate(state.currentSection + 1);
  }

  function renderSection() {
    const renderers = { starter: renderStarter, main1: renderMain1, main2: renderMain2, extension: renderExtension, plenary: renderPlenary, review: renderReview };
    $("#sectionContainer").innerHTML = renderers[SECTIONS[state.currentSection].id]();
    activateImageFallbacks();
  }

  function shell(kicker, title, intro, body) {
    return `<div class="section-hero"><span class="section-label">${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p></div><div class="section-body">${body}</div>`;
  }

  function imageSupport(src, alt, caption, small = false) {
    return `<div class="visual-support"><details><summary>Open visual support</summary><div class="visual-support-inner"><button type="button" class="image-button" data-image-src="${src}" data-image-alt="${escapeAttr(alt)}" data-image-caption="${escapeAttr(caption)}"><img class="lesson-image ${small ? "small" : ""}" src="${src}" alt="${escapeAttr(alt)}"></button><p class="image-caption">${escapeHtml(caption)} · Select to enlarge.</p></div></details></div>`;
  }

  function activateImageFallbacks() {
    $$(".lesson-image").forEach(img => img.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.textContent = "Visual support is unavailable. Continue using the written instructions below.";
      img.closest(".image-button")?.replaceWith(fallback);
    }, { once: true }));
  }

  function feedback(checked, correct, success, retry, hint = "") {
    if (!checked) return "";
    return `<div class="feedback ${correct ? "success" : "warning"}"><strong>${correct ? "Correct." : "Not secure yet."}</strong> ${escapeHtml(correct ? success : retry)}</div>${!correct && hint ? `<div class="hint"><strong>Hint:</strong> ${escapeHtml(hint)}</div>` : ""}`;
  }

  function renderOrder(items, path) {
    return `<ol class="order-list">${items.map((item, index) => `<li class="order-item"><span class="order-number">${index + 1}</span><span>${escapeHtml(item)}</span><span class="order-controls"><button type="button" data-action="move-order" data-path="${path}" data-index="${index}" data-direction="up" ${index === 0 ? "disabled" : ""} aria-label="Move ${escapeAttr(item)} up">↑</button><button type="button" data-action="move-order" data-path="${path}" data-index="${index}" data-direction="down" ${index === items.length - 1 ? "disabled" : ""} aria-label="Move ${escapeAttr(item)} down">↓</button></span></li>`).join("")}</ol>`;
  }

  function radio(name, path, value, label, selected) {
    return `<label class="choice"><input type="radio" name="${name}" data-bind="${path}" value="${escapeAttr(value)}" ${selected === value ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
  }

  function selectOptions(selected) {
    return `<option value="">Choose a role</option>${["Input","Process","Output"].map(value => `<option value="${value}" ${selected === value ? "selected" : ""}>${value}</option>`).join("")}`;
  }

  function confidence(name, path, selected) {
    return `<div class="confidence-row">${[1,2,3,4,5].map(value => `<label class="confidence-option"><input type="radio" name="${name}" data-bind="${path}" value="${value}" ${String(selected) === String(value) ? "checked" : ""}><span>${value}</span></label>`).join("")}</div>`;
  }

  function renderStarter() {
    const s = state.starter;
    const orderCorrect = arraysEqual(s.order, STARTER_ORDER);
    const algorithmCorrect = s.algorithm === "algorithm";
    const outputCorrectNow = normalise(s.output) === "aisha";
    const inputCorrectNow = /age|user|typed|entered/.test(normalise(s.input));
    return shell("Starter · about 8 minutes", "What do you remember?", "This is a diagnostic, not a grade. Try each question independently so your teacher can see what you already understand.", `
      <div class="section-intro"><strong>How this works:</strong> read the scenario, answer one question, then use the Check button directly underneath it. If it is not secure yet, use the feedback and try again.</div>
      ${imageSupport("assets/images/starter-baseline-overview.png", "Overview of sequencing, algorithms, simple Python and confidence prompts", "A visual preview of the types of thinking in this starter. Follow the interactive questions below for the exact instructions.")}
      <div class="question-list">
        <article class="question-card ${s.orderChecked ? orderCorrect ? "checked-correct" : "checked-wrong" : ""}">
          <h3>Task 1 — Sam’s morning routine</h3>
          <p>Sam wants another student to follow a routine from waking up to leaving home for school. Move the four instructions into a sensible order.</p>
          ${renderOrder(s.order, "starter.order")}
          <div class="inline-actions"><button class="button primary compact" data-action="check-starter-order" type="button">Check this sequence</button></div>
          ${feedback(s.orderChecked, orderCorrect, "The sequence starts with waking up and finishes by leaving home.", "One event happens before Sam is ready for it.", "Ask yourself whether Sam can put on shoes before getting out of bed.")}
        </article>
        <article class="question-card ${s.algorithmChecked ? algorithmCorrect ? "checked-correct" : "checked-wrong" : ""}">
          <h3>Task 2 — Recognise an algorithm</h3>
          <p>Which description could another person follow to complete a task?</p>
          <div class="choice-list">${radio("starterAlgorithm","starter.algorithm","algorithm","A clear, ordered set of instructions",s.algorithm)}${radio("starterAlgorithm","starter.algorithm","guess","A random guess with no steps",s.algorithm)}${radio("starterAlgorithm","starter.algorithm","screen","The screen used to display a program",s.algorithm)}</div>
          <div class="inline-actions"><button class="button primary compact" data-action="check-starter-algorithm" type="button">Check this answer</button></div>
          ${feedback(s.algorithmChecked, algorithmCorrect, "An algorithm gives ordered instructions for solving a problem or completing a task.", "That option does not describe a set of steps.", "Look for the option that explains what someone should do and in what order.")}
        </article>
        <article class="question-card ${s.outputChecked ? outputCorrectNow ? "checked-correct" : "checked-wrong" : ""}">
          <h3>Task 3 — Predict Python output</h3>
          <p>Read both lines. Type exactly what the program displays.</p>
          <pre class="code-block">student_name = "Aisha"\nprint(student_name)</pre>
          <label class="form-label" for="starterOutput">Displayed output</label><input id="starterOutput" data-bind="starter.output" value="${escapeAttr(s.output)}">
          <div class="inline-actions"><button class="button primary compact" data-action="check-starter-output" type="button">Check this prediction</button></div>
          ${feedback(s.outputChecked, outputCorrectNow, "print() displays the value stored in student_name.", "Read what is stored after the equals sign.", "The variable contains one name inside quotation marks.")}
        </article>
        <article class="question-card ${s.inputChecked ? inputCorrectNow ? "checked-correct" : "checked-wrong" : ""}">
          <h3>Task 4 — Identify the input</h3>
          <p>A program asks a student for their age and then displays it. What data enters the program?</p>
          <pre class="code-block">age = input("Enter your age: ")\nprint(age)</pre>
          <label class="form-label" for="starterInput">The input is…</label><input id="starterInput" data-bind="starter.input" value="${escapeAttr(s.input)}">
          <div class="inline-actions"><button class="button primary compact" data-action="check-starter-input" type="button">Check this answer</button></div>
          ${feedback(s.inputChecked, inputCorrectNow, "The age typed by the user enters the program.", "You have not identified the data supplied by the user yet.", "Find the line containing input(). What does the user type?")}
        </article>
        <article class="question-card">
          <h3>Confidence check</h3><p>Rate your current Python confidence. This helps your teacher compare confidence with understanding.</p>
          ${confidence("starterConfidence","starter.confidence",s.confidence)}
          <label class="form-label" for="starterReason">Explain your rating in one sentence.</label><textarea id="starterReason" data-bind="starter.confidenceReason">${escapeHtml(s.confidenceReason)}</textarea>
        </article>
      </div>
      <div class="section-actions"><span class="completion-note">The starter becomes Attempted when every check is used. Incorrect answers remain visible as Developing evidence.</span><button class="button primary" data-action="finish-starter" type="button">Save starter and continue</button></div>
    `);
  }

  function renderMain1() {
    const m = state.main1;
    const programCorrect = m.programChoice === "program";
    const lunchStatements = {
      input: ["The meal selected by the student", "Input"],
      process: ["Calculate the total price", "Process"],
      output: ["The total shown on the checkout screen", "Output"]
    };
    const habits = [
      ["error", "Read the error message before asking for help.", "helps", "The message often identifies the type or location of a problem."],
      ["copy", "Copy a friend’s code without reading or testing it.", "stops", "Copying removes the opportunity to understand and explain the solution."],
      ["test", "Make one small change, then test again.", "helps", "Small tests make cause and effect easier to identify."]
    ];
    return shell("Main Task 1 · about 17 minutes", "Learn, model and practise", "Read two short explanations, study a worked example and check your understanding before the independent Algorithm Rescue.", `
      <div class="content-grid">
        <article class="card micro-reading ${m.readAlgorithm ? "opened" : ""}"><p class="eyebrow">Reading 1</p><h3>Algorithm and program</h3><p>An <strong>algorithm</strong> is a finite, ordered and precise set of instructions for solving a problem. A <strong>program</strong> is an algorithm written in a language that a computer can execute.</p><p><strong>Example:</strong> “Ask for a name, store it, then display it” is an algorithm. Python code carrying out those steps is a program.</p><button class="button secondary compact read-confirm" data-action="mark-read" data-path="main1.readAlgorithm" type="button">I have read this explanation</button></article>
        <article class="card micro-reading ${m.readIpo ? "opened" : ""}"><p class="eyebrow">Reading 2</p><h3>Input, Process and Output</h3><p><strong>Input</strong> is data entering a system. <strong>Process</strong> is what the system does with the data. <strong>Output</strong> is information the system produces.</p><p>Use the question: <em>What goes in? What happens? What comes out?</em></p><button class="button secondary compact read-confirm" data-action="mark-read" data-path="main1.readIpo" type="button">I have read this explanation</button></article>
      </div>
      <div class="scenario"><h3>Worked example — School lunch checkout</h3><p>A student selects pasta. The checkout finds its price and shows £3.50.</p><ul><li><strong>Input:</strong> the pasta selection</li><li><strong>Process:</strong> find and calculate the price</li><li><strong>Output:</strong> £3.50 displayed on the screen</li></ul></div>
      <div class="task-block"><h3>Guided practice</h3><p class="task-prompt">Complete each small check. Feedback appears beside the question so you can improve immediately.</p>
        <div class="question-list">
          <article class="question-card ${m.programChecked ? programCorrect ? "checked-correct" : "checked-wrong" : ""}"><h4>1. Which option is a program?</h4><div class="choice-list">${radio("programChoice","main1.programChoice","algorithm","Ask for a name, store it, display it",m.programChoice)}${radio("programChoice","main1.programChoice","program","name = input(\"Name: \") then print(name)",m.programChoice)}${radio("programChoice","main1.programChoice","output","A name shown on a screen",m.programChoice)}</div><div class="inline-actions"><button class="button primary compact" data-action="check-main1-program" type="button">Check this answer</button></div>${feedback(m.programChecked, programCorrect, "It is written in instructions that a computer can execute.", "That is not executable code.", "A program is an algorithm expressed in a programming language.")}</article>
          ${Object.entries(lunchStatements).map(([key,[statement,answer]]) => `<article class="question-card ${m.lunchChecked[key] ? m.lunch[key] === answer ? "checked-correct" : "checked-wrong" : ""}"><h4>${key === "input" ? "2" : key === "process" ? "3" : "4"}. Classify this part of the lunch system</h4><p>${statement}</p><select data-bind="main1.lunch.${key}">${selectOptions(m.lunch[key])}</select><div class="inline-actions"><button class="button primary compact" data-action="check-main1-lunch" data-key="${key}" type="button">Check this classification</button></div>${feedback(m.lunchChecked[key],m.lunch[key]===answer,`This is the ${answer.toLowerCase()} in the system.`,`Reconsider whether this enters, is changed by, or leaves the system.`,"Ask: does it go in, happen inside, or come out?")}</article>`).join("")}
        </div>
      </div>
      ${imageSupport("assets/images/computer-science-learning-habits.png", "Students reading errors, testing small changes, collaborating and saving organised work", "Use this visual as an observation prompt. The three checkable situations below contain the exact instructions.")}
      <div class="task-block"><h3>Productive Computer Science habits</h3><p class="task-prompt">For each situation, decide whether it helps or stops learning. Then check it immediately.</p>
        <div class="question-list">${habits.map(([key,text,answer,why],index) => `<article class="question-card ${m.habitChecked[key] ? m.habits[key]===answer ? "checked-correct" : "checked-wrong" : ""}"><h4>${index+1}. ${text}</h4><div class="segmented">${radio(`habit_${key}`,`main1.habits.${key}`,"helps","Helps learning",m.habits[key])}${radio(`habit_${key}`,`main1.habits.${key}`,"stops","Stops learning",m.habits[key])}</div><div class="inline-actions"><button class="button primary compact" data-action="check-main1-habit" data-key="${key}" type="button">Check this habit</button></div>${feedback(m.habitChecked[key],m.habits[key]===answer,why,"Think about whether the student still has to read, reason and test.",why)}</article>`).join("")}</div>
        <article class="question-card"><h4>My first-lesson commitment</h4><label class="form-label" for="commitment">Choose one habit you will use</label><select id="commitment" data-bind="main1.commitment"><option value="">Choose one</option><option value="Read error messages" ${m.commitment==="Read error messages"?"selected":""}>Read error messages before asking</option><option value="Test small changes" ${m.commitment==="Test small changes"?"selected":""}>Test one small change at a time</option><option value="Explain my thinking" ${m.commitment==="Explain my thinking"?"selected":""}>Explain my thinking rather than copy</option></select><label class="form-label" for="commitmentReason">How will this help you learn?</label><textarea id="commitmentReason" data-bind="main1.commitmentReason">${escapeHtml(m.commitmentReason)}</textarea><div class="inline-actions"><button class="button primary compact" data-action="submit-commitment" type="button">Save my commitment</button></div>${m.commitmentSubmitted?'<div class="feedback info"><strong>Saved for teacher review.</strong> Your explanation is evidence of how you plan to learn.</div>':""}</article>
      </div>
    `);
  }

  function variablesCorrect() {
    const value = normalise(state.main2.variables);
    return value.includes("student_name") && value.includes("greeting");
  }
  function outputCorrect() { return normalise(state.main2.output).replace(/[!,.]/g, "").includes("hello daniel"); }

  function renderMain2() {
    const m = state.main2;
    const ipoData = {
      input: ["The name typed by the student", "Input"],
      process: ["Store the name and create a greeting", "Process"],
      output: ["The greeting and symbol shown on the badge", "Output"]
    };
    const orderCorrect = arraysEqual(m.order, BADGE_ORDER);
    const lineCorrect = m.inputLine === "1";
    const varsCorrect = variablesCorrect();
    const outCorrect = outputCorrect();
    return shell("Main Task 2 · about 23 minutes", "Algorithm Rescue", "Apply the new vocabulary to a digital name badge, read its Python program and improve an unclear algorithm.", `
      <div class="scenario"><h3>Mission scenario</h3><p>The Year 8 welcome desk needs a digital badge. It must ask for a student’s name, store the name, create a greeting and display the greeting with a symbol.</p><p><strong>Your evidence:</strong> an IPO model, an ordered algorithm, Python predictions and a rewritten algorithm that is clear, ordered and precise.</p></div>
      <figure class="visual-support"><button type="button" class="image-button" data-image-src="assets/images/algorithm-rescue-ipo-scenario.png" data-image-alt="A student enters a name, a computer processes it, and a digital badge displays a greeting and star" data-image-caption="Visual model of the name-badge scenario"><img class="lesson-image" src="assets/images/algorithm-rescue-ipo-scenario.png" alt="A student enters a name, a computer processes it, and a digital badge displays a greeting and star"></button><figcaption class="image-caption">A visual model using a different example. Use the written scenario for your exact task.</figcaption></figure>
      <div class="task-block"><h3>Part A — Build the IPO model</h3><p class="task-prompt">Classify each statement. Check each one before continuing.</p><div class="ipo-grid">${Object.entries(ipoData).map(([key,[statement,answer]]) => `<article class="ipo-card ${m.ipoChecked[key] ? m.ipo[key]===answer ? "checked-correct" : "checked-wrong" : ""}"><strong>${statement}</strong><select data-bind="main2.ipo.${key}">${selectOptions(m.ipo[key])}</select><div class="inline-actions"><button class="button primary compact" data-action="check-main2-ipo" data-key="${key}" type="button">Check</button></div>${feedback(m.ipoChecked[key],m.ipo[key]===answer,`Correct: ${answer}.`,`This role is not correct yet.`,"Ask what goes in, what happens, and what comes out.")}</article>`).join("")}</div></div>
      <div class="task-block"><h3>Part B — Order the algorithm</h3><p class="task-prompt">The steps are mixed up. Move them into a sequence that begins before data is collected and ends after the greeting is shown.</p>${renderOrder(m.order,"main2.order")}<div class="inline-actions"><button class="button primary compact" data-action="check-main2-order" type="button">Check the algorithm</button></div>${feedback(m.orderChecked,orderCorrect,"The algorithm collects, stores, processes and displays the name in a logical order.","At least one step happens too early or too late.","The greeting cannot be created until the name has been collected and stored.")}</div>
      <div class="task-block"><h3>Part C — Read the Python</h3><p class="task-prompt">Study the program. Answer and check one question at a time.</p><pre class="code-block">1  student_name = input("What is your name? ")\n2  greeting = "Hello " + student_name\n3  print(greeting)</pre>
        <div class="question-list">
          <article class="question-card ${m.inputLineChecked ? lineCorrect ? "checked-correct" : "checked-wrong" : ""}"><h4>1. Which line collects input?</h4><div class="segmented">${[1,2,3].map(n=>radio("inputLine","main2.inputLine",String(n),`Line ${n}`,m.inputLine)).join("")}</div><div class="inline-actions"><button class="button primary compact" data-action="check-main2-line" type="button">Check</button></div>${feedback(m.inputLineChecked,lineCorrect,"Line 1 uses input(), so it collects data.","That line does not collect data from the user.","Look for input().")}</article>
          <article class="question-card ${m.variablesChecked ? varsCorrect ? "checked-correct" : "checked-wrong" : ""}"><h4>2. Name both variables.</h4><input data-bind="main2.variables" value="${escapeAttr(m.variables)}" placeholder="Write both names"><div class="inline-actions"><button class="button primary compact" data-action="check-main2-variables" type="button">Check</button></div>${feedback(m.variablesChecked,varsCorrect,"student_name and greeting are both variables.","One or both variable names are missing.","Look to the left of each equals sign.")}</article>
          <article class="question-card ${m.outputChecked ? outCorrect ? "checked-correct" : "checked-wrong" : ""}"><h4>3. What is displayed if the student enters Daniel?</h4><input data-bind="main2.output" value="${escapeAttr(m.output)}"><div class="inline-actions"><button class="button primary compact" data-action="check-main2-output" type="button">Check</button></div>${feedback(m.outputChecked,outCorrect,"The program combines Hello with Daniel.","Trace the value of student_name into greeting.","Replace student_name with Daniel on line 2.")}</article>
          <article class="question-card"><h4>4. Why is student_name more useful than x?</h4><p>Explain how the name helps someone read, test or debug the program.</p><textarea data-bind="main2.meaningfulName">${escapeHtml(m.meaningfulName)}</textarea><div class="inline-actions"><button class="button primary compact" data-action="submit-main2-name" type="button">Submit explanation</button></div>${m.meaningfulNameSubmitted?'<div class="feedback info"><strong>Submitted for teacher review.</strong> Length alone is not treated as correctness.</div>':""}</article>
        </div>
      </div>
      <div class="task-block"><h3>Part D — Rescue the unclear algorithm</h3><p class="task-prompt">A student wrote: <strong>“Get a name. Do something with it. Show it.”</strong> Rewrite it so another student could follow it without asking questions.</p><textarea data-bind="main2.improvedAlgorithm" placeholder="Use numbered, ordered and precise instructions.">${escapeHtml(m.improvedAlgorithm)}</textarea><div class="self-check"><label class="choice"><input type="checkbox" data-bind="main2.algorithmChecks.clear" ${m.algorithmChecks.clear?"checked":""}><span>I used clear actions instead of “do something”.</span></label><label class="choice"><input type="checkbox" data-bind="main2.algorithmChecks.ordered" ${m.algorithmChecks.ordered?"checked":""}><span>My steps are in a logical order.</span></label><label class="choice"><input type="checkbox" data-bind="main2.algorithmChecks.ipo" ${m.algorithmChecks.ipo?"checked":""}><span>My algorithm collects input, processes it and produces output.</span></label></div><div class="inline-actions"><button class="button primary" data-action="submit-main2-algorithm" type="button">Submit rescued algorithm</button></div>${m.algorithmSubmitted?'<div class="feedback info"><strong>Submitted for teacher review.</strong> Your teacher can use the clear–ordered–precise rubric in the final report.</div>':""}</div>
    `);
  }

  function renderExtension() {
    const e = state.extension;
    const l1Unlocked = true;
    const l2Unlocked = teacherMode || e.level1.complete;
    const l3Unlocked = teacherMode || e.level2.complete;
    return shell("Optional extension · continue while time remains", "Extension Challenge Ladder", "Choose one scenario at each level. When you finish a level, continue to the next until your teacher asks you to begin the plenary.", `
      <span class="optional-badge">Optional — it never blocks the plenary</span>
      <div class="section-intro"><strong>Important:</strong> completing one choice does not finish the whole ladder. Level 1 applies IPO, Level 2 analyses an algorithm, and Level 3 creates and evaluates a system. Your work saves if plenary time begins.</div>
      <div class="extension-map">
        ${levelMapCard(1,"Apply","IPO Investigator",l1Unlocked,e.level1.complete)}
        ${levelMapCard(2,"Analyse","Algorithm Detective",l2Unlocked,e.level2.complete)}
        ${levelMapCard(3,"Create and evaluate","A4 System Designer",l3Unlocked,e.level3.complete)}
      </div>
      ${renderExtensionLevel1()}
      ${l2Unlocked ? renderExtensionLevel2() : lockedLevel(2,"Complete Level 1 correctly to unlock Algorithm Detective.")}
      ${l3Unlocked ? renderExtensionLevel3() : lockedLevel(3,"Complete Level 2 to unlock the A4 System Designer.")}
      <div class="section-actions"><span class="completion-note">At plenary time, stop at the end of your current sentence. Everything is saved.</span><button class="button secondary" data-action="go-plenary" type="button">Pause extension and go to plenary</button></div>
    `);
  }

  function levelMapCard(number, verb, title, unlocked, complete) {
    return `<article class="level-card ${complete ? "secure" : unlocked ? "active" : "locked"}"><p class="eyebrow">Level ${number} · ${verb}</p><h3>${title}</h3><p>${complete ? "Completed — continue to the next level." : unlocked ? "Choose one route and complete its evidence." : "Locked until the previous level is complete."}</p></article>`;
  }

  function lockedLevel(number, message) { return `<section class="level-section locked"><h3>Level ${number} is locked</h3><p>${escapeHtml(message)}</p></section>`; }

  function renderExtensionLevel1() {
    const l = state.extension.level1;
    const system = LEVEL1_SYSTEMS[l.system];
    const correct = l.roles[0] === "Input" && l.roles[1] === "Process" && l.roles[2] === "Output";
    return `<section class="level-section"><p class="eyebrow">Level 1 · 5–7 minutes</p><h3>IPO Investigator</h3><p>Choose one system. Read the whole brief before classifying its three parts.</p><div class="system-choice-grid">${Object.entries(LEVEL1_SYSTEMS).map(([key,value])=>systemChoice("level1System","extension.level1.system",key,value.title,value.brief,l.system)).join("")}</div>${system ? `<div class="scenario"><h3>Your chosen system: ${system.title}</h3><p>${system.brief}</p></div><div class="ipo-grid">${system.statements.map((statement,index)=>`<article class="ipo-card"><strong>${statement}</strong><select data-bind="extension.level1.roles.${index}">${selectOptions(l.roles[index])}</select></article>`).join("")}</div><label class="form-label" for="level1Explain">Explain the complete model using Input, Process and Output.</label><textarea id="level1Explain" data-bind="extension.level1.explanation">${escapeHtml(l.explanation)}</textarea><div class="inline-actions"><button class="button primary" data-action="check-extension-level1" type="button">Check Level 1</button></div>${l.checked ? feedback(true,correct && l.explanation.trim().length>=35,"Your IPO classifications are correct. Level 2 is now available.",correct?"Your classifications are correct, but your explanation needs more detail.":"At least one IPO role is incorrect.","Ask what enters the system, what the system does, and what information or action comes out.") : ""}` : '<div class="feedback info">Choose one system to reveal its task.</div>'}</section>`;
  }

  function renderExtensionLevel2() {
    const l = state.extension.level2;
    return `<section class="level-section"><p class="eyebrow">Level 2 · 7–10 minutes</p><h3>Algorithm Detective</h3><p>Choose one type of thinking. You only need to complete one route before continuing to Level 3.</p><div class="system-choice-grid">${systemChoice("level2Choice","extension.level2.choice","repair","Repair","Find problems and rewrite a vague algorithm.",l.choice)}${systemChoice("level2Choice","extension.level2.choice","compare","Compare","Choose the better of two algorithms and justify it.",l.choice)}${systemChoice("level2Choice","extension.level2.choice","trace","Trace","Read Python and connect it to IPO.",l.choice)}</div>${l.choice ? renderLevel2Route(l) : '<div class="feedback info">Choose Repair, Compare or Trace to reveal the instructions.</div>'}${l.feedback ? `<div class="feedback ${l.complete ? "success" : "warning"}">${escapeHtml(l.feedback)}</div>` : ""}</section>`;
  }

  function renderLevel2Route(l) {
    if (l.choice === "repair") return `<div class="task-block"><h3>Repair route</h3><p><strong>Faulty algorithm:</strong> “Show something. Get the details. Make the result.”</p><label class="form-label">Identify at least two problems</label><textarea data-bind="extension.level2.answer1">${escapeHtml(l.answer1)}</textarea><label class="form-label">Rewrite it as a clear, ordered algorithm</label><textarea data-bind="extension.level2.answer2">${escapeHtml(l.answer2)}</textarea>${level2Checks(l)}<button class="button primary" data-action="submit-extension-level2" type="button">Submit Repair route</button></div>`;
    if (l.choice === "compare") return `<div class="task-block"><h3>Compare route</h3><p><strong>Algorithm A:</strong> Get the name. Do the greeting. Show it.</p><p><strong>Algorithm B:</strong> 1. Ask the user for a name. 2. Store the name. 3. Join “Hello” with the stored name. 4. Display the greeting.</p><label class="form-label">Which algorithm is more suitable?</label><select data-bind="extension.level2.answer1"><option value="">Choose</option><option value="A" ${l.answer1==="A"?"selected":""}>Algorithm A</option><option value="B" ${l.answer1==="B"?"selected":""}>Algorithm B</option></select><label class="form-label">Justify using clear, ordered and precise</label><textarea data-bind="extension.level2.answer2">${escapeHtml(l.answer2)}</textarea><button class="button primary" data-action="submit-extension-level2" type="button">Check Compare route</button></div>`;
    return `<div class="task-block"><h3>Trace route</h3><pre class="code-block">student_name = input("Enter your name: ")\ngreeting = "Welcome " + student_name\nprint(greeting)</pre><label class="form-label">What is the input?</label><input data-bind="extension.level2.answer1" value="${escapeAttr(l.answer1)}"><label class="form-label">Name both variables</label><input data-bind="extension.level2.answer2" value="${escapeAttr(l.answer2)}"><label class="form-label">What is displayed if the student enters Maya?</label><input data-bind="extension.level2.answer3" value="${escapeAttr(l.answer3)}"><label class="form-label">Explain how this program follows IPO</label><textarea data-bind="extension.level2.answer4">${escapeHtml(l.answer4)}</textarea><button class="button primary" data-action="submit-extension-level2" type="button">Check Trace route</button></div>`;
  }

  function level2Checks(l) {
    return `<div class="self-check"><label class="choice"><input type="checkbox" data-bind="extension.level2.checks.clear" ${l.checks.clear?"checked":""}><span>My instructions use clear actions.</span></label><label class="choice"><input type="checkbox" data-bind="extension.level2.checks.ordered" ${l.checks.ordered?"checked":""}><span>My steps are in a logical order.</span></label><label class="choice"><input type="checkbox" data-bind="extension.level2.checks.precise" ${l.checks.precise?"checked":""}><span>Another student would not need to guess.</span></label></div>`;
  }

  function renderExtensionLevel3() {
    const l = state.extension.level3;
    const chosen = LEVEL3_SYSTEMS[l.system];
    return `<section class="level-section"><p class="eyebrow">Level 3 · 12–15 minutes</p><h3>A4 System Designer</h3><p>Collect <strong>one sheet of A4 paper</strong> from your teacher. Choose one of the three systems and design a complete model.</p><div class="system-choice-grid">${Object.entries(LEVEL3_SYSTEMS).map(([key,value])=>systemChoice("level3System","extension.level3.system",key,value.title,value.brief,l.system)).join("")}</div>${chosen ? `<div class="scenario"><h3>Your design brief: ${chosen.title}</h3><p>${chosen.brief}</p></div><div class="paper-instructions"><h3>Exactly what to do on your A4 paper</h3><ol><li>Write your <strong>full name, class and “Week 1 System Designer”</strong> at the top.</li><li>Turn the paper to <strong>landscape</strong>.</li><li>Divide it into the six labelled boxes shown below.</li><li>Complete every box for <strong>${chosen.title}</strong>. Use arrows or numbering to make the journey clear.</li><li>Your algorithm must contain precise, ordered steps. Do not write “do something” or “show it”.</li><li>Add one test using sample data and the expected result.</li><li>Add one limitation or improvement.</li><li>Photograph the whole page from directly above in good light. Check that every word is readable.</li><li>Upload the photograph or paste it from your clipboard below.</li></ol><div class="paper-layout"><div>1. USER AND PURPOSE</div><div>2. INPUT</div><div>3. PROCESS</div><div>4. OUTPUT</div><div>5. ALGORITHM</div><div>6. TEST AND IMPROVEMENT</div></div></div><div class="task-block"><h3>Record a readable summary</h3><p>This summary makes your PDF understandable even if part of the photograph is difficult to read.</p>${textField("Purpose and intended user","extension.level3.purpose",l.purpose,true)}${textField("Input","extension.level3.input",l.input)}${textField("Process","extension.level3.process",l.process)}${textField("Output","extension.level3.output",l.output)}${textField("Numbered algorithm","extension.level3.algorithm",l.algorithm,true)}${textField("Test data and expected result","extension.level3.test",l.test,true)}${textField("Limitation or improvement","extension.level3.improvement",l.improvement,true)}</div>${renderUpload(l)}<div class="inline-actions"><button class="button primary" data-action="submit-extension-level3" type="button">Submit Level 3 design</button></div>${l.submitted?`<div class="feedback ${l.complete?"success":"warning"}"><strong>${l.complete?"Level 3 submitted for teacher review.":"Level 3 is not complete yet."}</strong> ${l.complete?"Your A4 evidence and summary will appear in the PDF.":"Complete every summary field and add a readable A4 photograph."}</div>`:""}` : '<div class="feedback info">Choose one system to reveal the A4 instructions.</div>'}</section>`;
  }

  function systemChoice(name,path,value,title,brief,selected) {
    return `<label class="system-choice"><input type="radio" name="${name}" data-bind="${path}" value="${value}" ${selected===value?"checked":""}><span><strong>${escapeHtml(title)}</strong>${escapeHtml(brief)}</span></label>`;
  }

  function textField(label,path,value,multiline=false) {
    return `<label class="form-label">${escapeHtml(label)}</label>${multiline?`<textarea data-bind="${path}">${escapeHtml(value)}</textarea>`:`<input data-bind="${path}" value="${escapeAttr(value)}">`}`;
  }

  function renderUpload(l) {
    return `<div id="uploadZone" class="upload-zone" tabindex="0"><h3>A4 paper evidence</h3><p>Choose a JPG or PNG photograph, drag it here, or copy a screenshot/photo and paste it.</p><div class="button-row"><label class="button secondary" for="evidenceFile">Choose image</label><input id="evidenceFile" class="hidden" type="file" accept="image/png,image/jpeg,image/webp"><button class="button secondary" data-action="paste-evidence" type="button">Paste from clipboard</button></div>${l.evidenceData?`<div class="evidence-preview"><img src="${l.evidenceData}" alt="Uploaded A4 system design evidence"><div><p><strong>Saved image:</strong> ${escapeHtml(l.evidenceName||"Pasted evidence")}</p><label class="form-label">Evidence caption</label><textarea data-bind="extension.level3.evidenceCaption">${escapeHtml(l.evidenceCaption)}</textarea><button class="button danger compact" data-action="delete-evidence" type="button">Delete image</button></div></div>`:'<p class="completion-note">No A4 photograph saved yet.</p>'}</div>`;
  }

  function renderPlenary() {
    const p = state.plenary;
    const differenceCorrect = p.difference === "difference";
    const doorCorrect = p.doorRoles[0] === "Input" && p.doorRoles[1] === "Process" && p.doorRoles[2] === "Output";
    return shell("Plenary · about 7 minutes", "Show what you understand", "Complete three independent concept checks and one reflection so your teacher can plan the next lesson.", `
      ${imageSupport("assets/images/plenary-reflection.png", "Students reflecting on learning, debugging habits and confidence", "Reflection inspiration only. Follow the four interactive questions below for the exact plenary.", true)}
      <div class="question-list">
        <article class="question-card ${p.differenceChecked ? differenceCorrect ? "checked-correct" : "checked-wrong" : ""}"><h3>1. Algorithm or program?</h3><p>Which statement explains the difference most accurately?</p><div class="choice-list">${radio("plenaryDifference","plenary.difference","same","They are two words for exactly the same thing.",p.difference)}${radio("plenaryDifference","plenary.difference","difference","An algorithm describes steps; a program expresses steps in executable code.",p.difference)}${radio("plenaryDifference","plenary.difference","screen","An algorithm is an output and a program is a screen.",p.difference)}</div><button class="button primary compact" data-action="check-plenary-difference" type="button">Check</button>${feedback(p.differenceChecked,differenceCorrect,"You have distinguished a plan from its executable implementation.","That statement does not accurately compare the two terms.","Revisit Reading 1 in Main Task 1.")}</article>
        <article class="question-card"><h3>2. New IPO scenario</h3><p>A student places a finger on a smart door sensor. The system checks the fingerprint. The door displays “Access granted” and unlocks.</p><div class="ipo-grid">${["The fingerprint scan","The system checks the fingerprint","The access message and unlocked door"].map((text,index)=>`<div class="ipo-card"><strong>${text}</strong><select data-bind="plenary.doorRoles.${index}">${selectOptions(p.doorRoles[index])}</select></div>`).join("")}</div><button class="button primary compact" data-action="check-plenary-door" type="button">Check IPO</button>${feedback(p.doorChecked,doorCorrect,"You transferred IPO to a new situation.","At least one system role needs another attempt.","What enters, what happens inside, and what is produced?")}</article>
        <article class="question-card"><h3>3. Improve an instruction</h3><p>Rewrite <strong>“Put it in the right place”</strong> so another person would not need to guess what “it” or “right place” means.</p><textarea data-bind="plenary.improvedInstruction">${escapeHtml(p.improvedInstruction)}</textarea><button class="button primary compact" data-action="submit-plenary-improvement" type="button">Submit for teacher review</button>${p.improvementSubmitted?'<div class="feedback info"><strong>Submitted.</strong> Your teacher will review whether the instruction is clear and precise.</div>':""}</article>
        <article class="question-card"><h3>4. Confidence and next step</h3>${confidence("plenaryConfidence","plenary.confidence",p.confidence)}<label class="form-label">What will help you improve next lesson?</label><textarea data-bind="plenary.nextStep">${escapeHtml(p.nextStep)}</textarea></article>
      </div><div class="section-actions"><span class="completion-note">Your reflection is compared with your checked answers; it is not graded by confidence.</span><button class="button primary" data-action="submit-plenary" type="button">Submit plenary and review evidence</button></div>
    `);
  }

  function renderReview() {
    const e = state.extension;
    const statuses = SECTIONS.slice(0,5).map(section => `<span>${section.short}: ${sectionStatus(section.id).label}</span>`).join("");
    return shell("Final review", "Review your evidence", "Check what has been saved, return to anything incomplete, then export a professional PDF for Microsoft Teams.", `
      <div class="review-grid">
        <article class="review-card"><h3>Student details and lesson status</h3><p><strong>${escapeHtml(state.student.fullName)}</strong> · ${escapeHtml(state.student.className)}<br>Started: ${formatDate(state.startedAt)}<br>Last saved: ${formatDate(state.updatedAt)}</p><div class="review-meta">${statuses}</div></article>
        <article class="review-card"><h3>Diagnostic summary</h3><p>Starter: ${sectionScore("starter")}/4 · Main Task 1: ${sectionScore("main1")}/7 · Main Task 2 automatically checked: ${sectionScore("main2")}/8</p><p>Checked attempts recorded: ${state.attemptLog.length}. Open explanations and algorithms remain marked for teacher review rather than being judged by character count.</p></article>
        <article class="review-card"><h3>Main Task 2 evidence</h3><div class="review-answer">IPO: ${valueOrMissing(state.main2.ipo.input)} / ${valueOrMissing(state.main2.ipo.process)} / ${valueOrMissing(state.main2.ipo.output)}\nAlgorithm: ${state.main2.order.join(" → ")}\nVariables: ${valueOrMissing(state.main2.variables)}\nPredicted output: ${valueOrMissing(state.main2.output)}\nMeaningful identifiers: ${valueOrMissing(state.main2.meaningfulName)}\nRescued algorithm:\n${valueOrMissing(state.main2.improvedAlgorithm)}</div></article>
        <article class="review-card"><h3>Extension evidence</h3><p>${e.level1.complete?"Level 1 completed.":"Level 1 not completed."} ${e.level2.complete?"Level 2 completed.":""} ${e.level3.complete?"Level 3 submitted for teacher review.":""}</p>${e.level3.evidenceData?`<img class="lesson-image small" src="${e.level3.evidenceData}" alt="Student A4 system design">`:""}</article>
        <article class="review-card"><h3>Plenary evidence</h3><div class="review-answer">Algorithm/program answer: ${valueOrMissing(state.plenary.difference)}\nIPO roles: ${state.plenary.doorRoles.map(valueOrMissing).join(" / ")}\nImproved instruction: ${valueOrMissing(state.plenary.improvedInstruction)}\nConfidence: ${valueOrMissing(state.plenary.confidence)}/5\nNext step: ${valueOrMissing(state.plenary.nextStep)}</div></article>
      </div>
      <div class="section-actions"><div class="button-row"><button class="button primary" data-action="export-pdf" type="button">Download lesson PDF</button><button class="button secondary" data-action="print-report" type="button">Print-friendly fallback</button><button class="button danger" data-action="reset-progress" type="button">Reset progress</button></div></div>
      <div id="teamsInstruction" class="teams-callout ${state.pdfGeneratedAt?"":"hidden"}"><h3>Submit your evidence</h3><p>Upload your completed PDF to the Microsoft Teams Assignment named <strong>Week 1 Theory</strong>.</p><p>Check that your name and class are visible, all required lesson sections are included, the PDF downloaded successfully, and you are uploading the PDF rather than a screenshot.</p></div>
    `);
  }

  function valueOrMissing(value) { return String(value || "").trim() || "Not completed"; }

  function handleFieldInput(event) {
    const target = event.target;
    const path = target.dataset.bind;
    if (!path) return;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setPath(path, value);
    const resetChecks = {
      "starter.algorithm": "starter.algorithmChecked",
      "starter.output": "starter.outputChecked",
      "starter.input": "starter.inputChecked",
      "main1.programChoice": "main1.programChecked",
      "main1.lunch.input": "main1.lunchChecked.input",
      "main1.lunch.process": "main1.lunchChecked.process",
      "main1.lunch.output": "main1.lunchChecked.output",
      "main1.habits.error": "main1.habitChecked.error",
      "main1.habits.copy": "main1.habitChecked.copy",
      "main1.habits.test": "main1.habitChecked.test",
      "main2.ipo.input": "main2.ipoChecked.input",
      "main2.ipo.process": "main2.ipoChecked.process",
      "main2.ipo.output": "main2.ipoChecked.output",
      "main2.inputLine": "main2.inputLineChecked",
      "main2.variables": "main2.variablesChecked",
      "main2.output": "main2.outputChecked",
      "plenary.difference": "plenary.differenceChecked"
    };
    if (resetChecks[path]) {
      setPath(resetChecks[path], false);
      const card = target.closest(".question-card, .ipo-card");
      card?.classList.remove("checked-correct", "checked-wrong");
      card?.querySelectorAll(".feedback, .hint").forEach(item => item.remove());
    }
    if (path.startsWith("plenary.doorRoles.")) {
      state.plenary.doorChecked = false;
      target.closest(".question-card")?.querySelectorAll(".feedback, .hint").forEach(item => item.remove());
    }
    if (path === "extension.level1.system") {
      state.extension.level1.roles = ["","",""];
      state.extension.level1.checked = false;
      state.extension.level1.complete = false;
    }
    if (path === "extension.level2.choice") {
      Object.assign(state.extension.level2, { answer1:"",answer2:"",answer3:"",answer4:"",checks:{clear:false,ordered:false,precise:false},submitted:false,complete:false,feedback:"" });
    }
    if (path === "extension.level3.system") state.extension.level3.submitted = false;
    saveState();
    if (["extension.level1.system","extension.level2.choice","extension.level3.system"].includes(path)) render();
  }

  async function handleAction(event) {
    const button = event.target.closest("[data-action], [data-image-src]");
    if (!button) return;
    if (button.dataset.imageSrc) { openImage(button); return; }
    const action = button.dataset.action;
    if (action === "move-order") { moveOrder(button); return; }
    if (action === "mark-read") { setPath(button.dataset.path, true); saveState(true); render(); return; }
    const actions = {
      "check-starter-order": () => checkFlag("starter.orderChecked","starter.orderAttempts"),
      "check-starter-algorithm": () => checkFlag("starter.algorithmChecked","starter.algorithmAttempts",Boolean(state.starter.algorithm),"Choose an answer first."),
      "check-starter-output": () => checkFlag("starter.outputChecked","starter.outputAttempts",Boolean(state.starter.output.trim()),"Type your prediction first."),
      "check-starter-input": () => checkFlag("starter.inputChecked","starter.inputAttempts",Boolean(state.starter.input.trim()),"Write what enters the program first."),
      "finish-starter": finishStarter,
      "check-main1-program": () => checkFlag("main1.programChecked","main1.programAttempts",Boolean(state.main1.programChoice),"Choose an answer first."),
      "check-main1-lunch": () => checkMain1Lunch(button.dataset.key),
      "check-main1-habit": () => checkMain1Habit(button.dataset.key),
      "submit-commitment": submitCommitment,
      "check-main2-ipo": () => checkMain2Ipo(button.dataset.key),
      "check-main2-order": () => checkFlag("main2.orderChecked","main2.orderAttempts"),
      "check-main2-line": () => checkFlag("main2.inputLineChecked","main2.inputLineAttempts",Boolean(state.main2.inputLine),"Choose a line first."),
      "check-main2-variables": () => checkFlag("main2.variablesChecked","main2.variablesAttempts",Boolean(state.main2.variables.trim()),"Name the variables first."),
      "check-main2-output": () => checkFlag("main2.outputChecked","main2.outputAttempts",Boolean(state.main2.output.trim()),"Predict the output first."),
      "submit-main2-name": submitMeaningfulName,
      "submit-main2-algorithm": submitImprovedAlgorithm,
      "check-extension-level1": checkExtensionLevel1,
      "submit-extension-level2": submitExtensionLevel2,
      "submit-extension-level3": submitExtensionLevel3,
      "paste-evidence": pasteEvidence,
      "delete-evidence": deleteEvidence,
      "go-plenary": () => navigate(4),
      "check-plenary-difference": checkPlenaryDifference,
      "check-plenary-door": checkPlenaryDoor,
      "submit-plenary-improvement": submitPlenaryImprovement,
      "submit-plenary": submitPlenary,
      "export-pdf": exportPdf,
      "print-report": printReport,
      "reset-progress": resetProgress
    };
    if (actions[action]) await actions[action]();
    if (action === "paste-evidence") return;
    if (button.id === "evidenceFile") return;
  }

  function checkFlag(flagPath, attemptsPath, valid = true, message = "Answer this question first.") {
    if (!valid && !teacherMode) { showToast(message); return; }
    setPath(flagPath, true);
    if (attemptsPath) setPath(attemptsPath, Number(getPath(attemptsPath) || 0) + 1);
    const snapshots = {
      "starter.orderChecked": ["Starter sequence", state.starter.order.join(" -> "), arraysEqual(state.starter.order, STARTER_ORDER)],
      "starter.algorithmChecked": ["Starter algorithm definition", state.starter.algorithm, state.starter.algorithm === "algorithm"],
      "starter.outputChecked": ["Starter Python prediction", state.starter.output, normalise(state.starter.output) === "aisha"],
      "starter.inputChecked": ["Starter input identification", state.starter.input, /age|user|typed|entered/.test(normalise(state.starter.input))],
      "main1.programChecked": ["Algorithm or program", state.main1.programChoice, state.main1.programChoice === "program"],
      "main2.orderChecked": ["Name badge algorithm order", state.main2.order.join(" -> "), arraysEqual(state.main2.order, BADGE_ORDER)],
      "main2.inputLineChecked": ["Python input line", state.main2.inputLine, state.main2.inputLine === "1"],
      "main2.variablesChecked": ["Python variables", state.main2.variables, variablesCorrect()],
      "main2.outputChecked": ["Python output prediction", state.main2.output, outputCorrect()]
    };
    const snapshot = snapshots[flagPath];
    if (snapshot) recordAttempt(snapshot[0], snapshot[1], snapshot[2] ? "Correct" : "Improve");
    saveState(true); render();
  }

  function finishStarter() {
    const s = state.starter;
    if (!teacherMode && !(s.orderChecked && s.algorithmChecked && s.outputChecked && s.inputChecked)) { showToast("Use every Check button before saving the starter."); return; }
    if (!teacherMode && (!s.confidence || s.confidenceReason.trim().length < 10)) { showToast("Choose a confidence rating and explain it."); return; }
    saveState(true); render(); showToast("Starter saved. Incorrect answers remain visible for improvement.");
  }

  function checkMain1Lunch(key) {
    if (!state.main1.lunch[key] && !teacherMode) { showToast("Choose an IPO role first."); return; }
    state.main1.lunchChecked[key] = true;
    const correct = { input:"Input",process:"Process",output:"Output" }[key];
    recordAttempt(`Lunch IPO: ${key}`,state.main1.lunch[key],state.main1.lunch[key]===correct?"Correct":"Improve");
    saveState(true); render();
  }
  function checkMain1Habit(key) {
    if (!state.main1.habits[key] && !teacherMode) { showToast("Choose helps or stops first."); return; }
    state.main1.habitChecked[key] = true;
    const correct = { error:"helps",copy:"stops",test:"helps" }[key];
    recordAttempt(`Learning habit: ${key}`,state.main1.habits[key],state.main1.habits[key]===correct?"Correct":"Improve");
    saveState(true); render();
  }
  function submitCommitment() {
    const m = state.main1;
    if (!teacherMode && (!m.commitment || m.commitmentReason.trim().length < 20)) { showToast("Choose a habit and explain how it will help in at least one clear sentence."); return; }
    m.commitmentSubmitted = true; saveState(true); render();
  }
  function checkMain2Ipo(key) {
    if (!state.main2.ipo[key] && !teacherMode) { showToast("Choose an IPO role first."); return; }
    state.main2.ipoChecked[key] = true;
    const correct = { input:"Input",process:"Process",output:"Output" }[key];
    recordAttempt(`Name badge IPO: ${key}`,state.main2.ipo[key],state.main2.ipo[key]===correct?"Correct":"Improve");
    saveState(true); render();
  }
  function submitMeaningfulName() {
    if (!teacherMode && state.main2.meaningfulName.trim().length < 25) { showToast("Explain how the variable name supports reading, testing or debugging."); return; }
    state.main2.meaningfulNameSubmitted = true;
    recordAttempt("Meaningful variable explanation",state.main2.meaningfulName,"Teacher review");
    saveState(true); render();
  }
  function submitImprovedAlgorithm() {
    const m = state.main2;
    if (!teacherMode && m.improvedAlgorithm.trim().length < 70) { showToast("Write a complete, numbered algorithm with enough detail for another student."); return; }
    if (!teacherMode && !Object.values(m.algorithmChecks).every(Boolean)) { showToast("Use all three self-check statements before submitting."); return; }
    m.algorithmSubmitted = true;
    recordAttempt("Rescued algorithm",m.improvedAlgorithm,"Teacher review");
    saveState(true); render();
  }
  function moveOrder(button) {
    const array = getPath(button.dataset.path);
    const index = Number(button.dataset.index);
    const target = button.dataset.direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= array.length) return;
    [array[index],array[target]] = [array[target],array[index]];
    if (button.dataset.path === "starter.order") state.starter.orderChecked = false;
    if (button.dataset.path === "main2.order") state.main2.orderChecked = false;
    saveState(); render();
  }

  function checkExtensionLevel1() {
    const l = state.extension.level1;
    if (!teacherMode && (!l.system || l.roles.some(role=>!role) || l.explanation.trim().length < 35)) { showToast("Choose a system, classify all three parts and explain the complete IPO model."); return; }
    l.checked = true; l.attempts += 1;
    l.complete = teacherMode || (l.roles[0] === "Input" && l.roles[1] === "Process" && l.roles[2] === "Output" && l.explanation.trim().length >= 35);
    recordAttempt("Extension Level 1 IPO",`${l.roles.join(" / ")} — ${l.explanation}`,l.complete?"Correct":"Improve");
    saveState(true); render();
  }

  function submitExtensionLevel2() {
    const l = state.extension.level2;
    let complete = false;
    if (l.choice === "repair") complete = l.answer1.trim().length >= 30 && l.answer2.trim().length >= 70 && Object.values(l.checks).every(Boolean);
    if (l.choice === "compare") complete = l.answer1 === "B" && l.answer2.trim().length >= 40 && /clear|order|precis/.test(normalise(l.answer2));
    if (l.choice === "trace") {
      const a = normalise(l.answer1), b = normalise(l.answer2), c = normalise(l.answer3).replace(/[!,.]/g,"");
      complete = /name|user|typed/.test(a) && b.includes("student_name") && b.includes("greeting") && c.includes("welcome maya") && l.answer4.trim().length >= 40;
    }
    if (!teacherMode && !l.choice) { showToast("Choose one Level 2 route first."); return; }
    l.submitted = true; l.complete = teacherMode || complete;
    l.feedback = l.complete ? "Level 2 complete. Continue to Level 3 and collect one A4 sheet." : "This route is not secure yet. Read the exact requirements, improve the missing evidence and submit again.";
    recordAttempt(`Extension Level 2: ${l.choice}`,`${l.answer1} | ${l.answer2} | ${l.answer3} | ${l.answer4}`,l.complete?"Complete":"Improve");
    saveState(true); render();
  }

  function submitExtensionLevel3() {
    const l = state.extension.level3;
    const complete = l.system && l.purpose.trim().length >= 20 && l.input.trim().length >= 5 && l.process.trim().length >= 10 && l.output.trim().length >= 5 && l.algorithm.trim().length >= 70 && l.test.trim().length >= 20 && l.improvement.trim().length >= 20 && l.evidenceData;
    l.submitted = true; l.complete = teacherMode || Boolean(complete);
    recordAttempt("Extension Level 3 A4 design",`${l.system} — ${l.purpose}`,l.complete?"Teacher review":"Incomplete");
    saveState(true); render();
  }

  function checkPlenaryDifference() {
    if (!teacherMode && !state.plenary.difference) { showToast("Choose an answer first."); return; }
    state.plenary.differenceChecked = true;
    recordAttempt("Plenary algorithm/program",state.plenary.difference,state.plenary.difference==="difference"?"Correct":"Improve");
    saveState(true); render();
  }
  function checkPlenaryDoor() {
    if (!teacherMode && state.plenary.doorRoles.some(role=>!role)) { showToast("Classify all three parts first."); return; }
    state.plenary.doorChecked = true;
    const correct=state.plenary.doorRoles[0]==="Input"&&state.plenary.doorRoles[1]==="Process"&&state.plenary.doorRoles[2]==="Output";
    recordAttempt("Plenary smart door IPO",state.plenary.doorRoles.join(" / "),correct?"Correct":"Improve");
    saveState(true); render();
  }
  function submitPlenaryImprovement() {
    if (!teacherMode && state.plenary.improvedInstruction.trim().length < 30) { showToast("Replace both vague parts with precise details."); return; }
    state.plenary.improvementSubmitted = true;
    recordAttempt("Plenary precise instruction",state.plenary.improvedInstruction,"Teacher review");
    saveState(true); render();
  }
  function submitPlenary() {
    const p = state.plenary;
    if (!teacherMode && !(p.differenceChecked && p.doorChecked && p.improvementSubmitted && p.confidence && p.nextStep.trim().length >= 15)) { showToast("Complete all four plenary questions before submitting."); return; }
    p.submitted = true; saveState(true); render(); showToast("Plenary saved. Your final review is unlocked.");
  }

  async function pasteEvidence() {
    try {
      const items = await navigator.clipboard.read();
      const item = items.find(entry => entry.types.some(type => type.startsWith("image/")));
      if (!item) throw new Error("No image");
      const type = item.types.find(value => value.startsWith("image/"));
      await processEvidence(await item.getType(type), "Pasted A4 evidence");
    } catch {
      showToast("No image could be read from the clipboard. Use Choose image instead.");
    }
  }

  async function processEvidence(file, name) {
    if (!file || !String(file.type).startsWith("image/")) { showToast("Choose a JPG, PNG or WebP image."); return; }
    if (file.size > 15 * 1024 * 1024) { showToast("The image is too large. Choose one smaller than 15 MB."); return; }
    try {
      const data = await compressImage(file, 1400, .75);
      state.extension.level3.evidenceData = data;
      state.extension.level3.evidenceName = name || file.name || "A4 evidence";
      saveState(true); render(); showToast("A4 evidence saved in this browser.");
    } catch { showToast("The image could not be processed. Try a JPG or PNG file."); }
  }

  function compressImage(file, maxDimension, quality) {
    return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const scale = Math.min(1,maxDimension/Math.max(img.width,img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width*scale); canvas.height = Math.round(img.height*scale);
          canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
          resolve(canvas.toDataURL("image/jpeg",quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function deleteEvidence() {
    if (!confirm("Delete the saved A4 evidence image?")) return;
    Object.assign(state.extension.level3,{ evidenceData:"",evidenceName:"",evidenceCaption:"",complete:false,submitted:false });
    saveState(true); render();
  }

  function openImage(button) {
    $("#dialogImage").src = button.dataset.imageSrc;
    $("#dialogImage").alt = button.dataset.imageAlt || "Enlarged lesson visual";
    $("#dialogCaption").textContent = button.dataset.imageCaption || "Lesson visual";
    $("#imageDialog").showModal();
  }

  function resetProgress() {
    if (!confirm("Permanently delete all saved answers and evidence for this lesson?")) return;
    localStorage.removeItem(storageKey);
    location.href = location.pathname + (teacherMode ? "?teacher=1" : "");
  }

  async function exportPdf() {
    if (!window.PDFLib) { showToast("Direct PDF support is unavailable. Use the print-friendly fallback."); return; }
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pageSize = [595.28,841.89], margin=44, maxWidth=507;
      let page = pdf.addPage(pageSize), y=793, pageNumber=1;

      const newPage = () => { page = pdf.addPage(pageSize); y=793; pageNumber += 1; };
      const ensure = height => { if (y-height < 48) newPage(); };
      const wrap = (text,size,font,max=maxWidth) => {
        const result=[];
        String(text ?? "").split("\n").forEach(paragraph => {
          if (!paragraph) { result.push(""); return; }
          let line="";
          paragraph.split(/\s+/).forEach(word => {
            const trial=line?`${line} ${word}`:word;
            if (font.widthOfTextAtSize(trial,size)<=max) line=trial;
            else { if(line)result.push(line); line=word; }
          });
          if(line)result.push(line);
        });
        return result;
      };
      const drawText = (text,{size=9.5,font=regular,color=rgb(.12,.14,.18),gap=3}={}) => {
        const lines=wrap(text,size,font);
        const leading=size+gap;
        lines.forEach(line => { ensure(leading); if(line) page.drawText(line,{x:margin,y,size,font,color}); y-=leading; });
      };
      const heading = text => { ensure(36); y-=8; drawText(text,{size:14,font:bold,color:rgb(.18,.12,.42),gap:4}); page.drawLine({start:{x:margin,y:y+2},end:{x:551,y:y+2},thickness:.7,color:rgb(.72,.72,.75)}); y-=5; };
      const sub = text => { ensure(25); drawText(text,{size:10.5,font:bold}); };

      drawText(LESSON.school,{size:10,font:bold,color:rgb(.18,.12,.42)});
      drawText(`${LESSON.year} Computer Science · Week ${LESSON.week} Theory`,{size:13,font:bold});
      drawText(LESSON.title,{size:22,font:bold,color:rgb(.09,.11,.16),gap:7});
      drawText(`Date: ${new Date().toLocaleDateString()}    Student: ${state.student.fullName}    Class: ${state.student.className}`);
      drawText(`Started: ${formatDate(state.startedAt)}    Last saved: ${formatDate(state.updatedAt)}`);

      heading("Learning information");
      drawText(`Key Topic: ${LESSON.learning.topic}\nWAGBA: ${LESSON.learning.wagba}\nKnowledge: ${LESSON.learning.knowledge}\nSkills: ${LESSON.learning.skills}\nUnderstanding: ${LESSON.learning.understanding}\nKeywords: ${LESSON.learning.keywords}\nChallenge: ${LESSON.learning.challenge}`);

      heading("Starter diagnostic");
      drawText(`Status: ${sectionStatus("starter").label} · Score: ${sectionScore("starter")}/4\nSequence: ${state.starter.order.join(" -> ")}\nAlgorithm answer: ${valueOrMissing(state.starter.algorithm)}\nPython prediction: ${valueOrMissing(state.starter.output)}\nIdentified input: ${valueOrMissing(state.starter.input)}\nConfidence: ${valueOrMissing(state.starter.confidence)}/5\nConfidence explanation: ${valueOrMissing(state.starter.confidenceReason)}`);

      heading("Main Task 1: Learn and practise");
      drawText(`Status: ${sectionStatus("main1").label} · Score: ${sectionScore("main1")}/7\nReading opened: Algorithm/program = ${state.main1.readAlgorithm?"Yes":"No"}; IPO = ${state.main1.readIpo?"Yes":"No"}\nProgram answer: ${valueOrMissing(state.main1.programChoice)}\nLunch IPO: ${Object.values(state.main1.lunch).map(valueOrMissing).join(" / ")}\nLearning habits: ${Object.entries(state.main1.habits).map(([key,value])=>`${key}=${valueOrMissing(value)}`).join("; ")}\nCommitment: ${valueOrMissing(state.main1.commitment)}\nExplanation: ${valueOrMissing(state.main1.commitmentReason)}`);

      heading("Main Task 2: Algorithm Rescue");
      drawText(`Status: ${sectionStatus("main2").label} · Automatically checked: ${sectionScore("main2")}/8\nIPO: ${Object.values(state.main2.ipo).map(valueOrMissing).join(" / ")}\nAlgorithm order: ${state.main2.order.join(" -> ")}\nInput line: ${valueOrMissing(state.main2.inputLine)}\nVariables: ${valueOrMissing(state.main2.variables)}\nPredicted output: ${valueOrMissing(state.main2.output)}`);
      sub("Open responses — teacher review required");
      drawText(`Why meaningful names help: ${valueOrMissing(state.main2.meaningfulName)}\nRescued algorithm:\n${valueOrMissing(state.main2.improvedAlgorithm)}\nStudent self-check: clear=${state.main2.algorithmChecks.clear?"Yes":"No"}; ordered=${state.main2.algorithmChecks.ordered?"Yes":"No"}; IPO=${state.main2.algorithmChecks.ipo?"Yes":"No"}`);

      heading("Optional extension challenge ladder");
      drawText(`Level 1: ${state.extension.level1.complete?"Completed":"Not completed"}\nChosen system: ${valueOrMissing(LEVEL1_SYSTEMS[state.extension.level1.system]?.title)}\nIPO roles: ${state.extension.level1.roles.map(valueOrMissing).join(" / ")}\nExplanation: ${valueOrMissing(state.extension.level1.explanation)}\n\nLevel 2: ${state.extension.level2.complete?"Completed":"Not completed"}\nChosen route: ${valueOrMissing(state.extension.level2.choice)}\nResponse 1: ${valueOrMissing(state.extension.level2.answer1)}\nResponse 2: ${valueOrMissing(state.extension.level2.answer2)}\nResponse 3: ${valueOrMissing(state.extension.level2.answer3)}\nIPO explanation: ${valueOrMissing(state.extension.level2.answer4)}\n\nLevel 3: ${state.extension.level3.complete?"Submitted for teacher review":"Not completed"}\nSystem: ${valueOrMissing(LEVEL3_SYSTEMS[state.extension.level3.system]?.title)}\nPurpose: ${valueOrMissing(state.extension.level3.purpose)}\nInput: ${valueOrMissing(state.extension.level3.input)}\nProcess: ${valueOrMissing(state.extension.level3.process)}\nOutput: ${valueOrMissing(state.extension.level3.output)}\nAlgorithm: ${valueOrMissing(state.extension.level3.algorithm)}\nTest: ${valueOrMissing(state.extension.level3.test)}\nImprovement: ${valueOrMissing(state.extension.level3.improvement)}\nEvidence caption: ${valueOrMissing(state.extension.level3.evidenceCaption)}`);

      if (state.extension.level3.evidenceData) {
        newPage();
        drawText("A4 System Designer evidence",{size:16,font:bold,color:rgb(.18,.12,.42)});
        try {
          const bytes = dataUrlBytes(state.extension.level3.evidenceData);
          const image = await pdf.embedJpg(bytes);
          const availableH = y-70;
          const scale = Math.min(maxWidth/image.width,availableH/image.height);
          const width=image.width*scale,height=image.height*scale;
          page.drawImage(image,{x:margin+(maxWidth-width)/2,y:y-height,width,height});
          y-=height+12;
          drawText(valueOrMissing(state.extension.level3.evidenceCaption));
        } catch { drawText("The saved A4 image could not be embedded. The written summary is included above."); }
      }

      heading("Plenary");
      drawText(`Status: ${sectionStatus("plenary").label}\nAlgorithm/program answer: ${valueOrMissing(state.plenary.difference)}\nSmart door IPO: ${state.plenary.doorRoles.map(valueOrMissing).join(" / ")}\nImproved instruction: ${valueOrMissing(state.plenary.improvedInstruction)}\nConfidence: ${valueOrMissing(state.plenary.confidence)}/5\nNext step: ${valueOrMissing(state.plenary.nextStep)}`);
      heading("Attempts and corrections");
      if (state.attemptLog.length) drawText(state.attemptLog.map((item,index)=>`${index+1}. ${item.question}: ${item.outcome} — ${item.answer}`).join("\n"));
      else drawText("No checked attempts recorded.");
      heading("Completion summary");
      drawText(SECTIONS.slice(0,5).map(section=>`${section.short}: ${sectionStatus(section.id).label}`).join("\n"));
      drawText(`\nSubmit this PDF to the Microsoft Teams Assignment named ${LESSON.assignment}.`,{font:bold});

      const pages = pdf.getPages();
      pages.forEach((pdfPage,index)=>pdfPage.drawText(`Page ${index+1} of ${pages.length}`,{x:270,y:24,size:8,font:regular,color:rgb(.4,.4,.43)}));
      const bytes = await pdf.save();
      downloadBlob(new Blob([bytes],{type:"application/pdf"}),pdfFilename());
      state.pdfGeneratedAt = new Date().toISOString(); saveState(true); render(); showToast("PDF downloaded. Read the Microsoft Teams instructions.");
    } catch (error) {
      console.error(error); showToast("Direct PDF export was blocked. Use the print-friendly fallback.");
    }
  }

  function dataUrlBytes(dataUrl) {
    const binary = atob(dataUrl.split(",")[1]);
    return Uint8Array.from(binary,char=>char.charCodeAt(0));
  }
  function pdfFilename() { return `Year8_${safeFilename(state.student.className)}_${safeFilename(state.student.fullName)}_Week1_Theory.pdf`; }
  function downloadBlob(blob,filename) { const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1200); }

  function buildPrintReport() {
    const e=state.extension;
    $("#printReport").innerHTML = `<h1>${LESSON.school}</h1><p><strong>${LESSON.year} Computer Science · Week 1 Theory</strong><br>${LESSON.title}<br>${escapeHtml(state.student.fullName)} · ${escapeHtml(state.student.className)} · ${new Date().toLocaleDateString()}</p><h2>Learning information</h2><p><strong>WAGBA:</strong> ${escapeHtml(LESSON.learning.wagba)}<br><strong>Knowledge:</strong> ${escapeHtml(LESSON.learning.knowledge)}<br><strong>Skills:</strong> ${escapeHtml(LESSON.learning.skills)}<br><strong>Understanding:</strong> ${escapeHtml(LESSON.learning.understanding)}<br><strong>Keywords:</strong> ${escapeHtml(LESSON.learning.keywords)}</p><h2>Starter</h2><p>${escapeHtml(state.starter.order.join(" → "))}<br>Algorithm: ${escapeHtml(valueOrMissing(state.starter.algorithm))}<br>Output: ${escapeHtml(valueOrMissing(state.starter.output))}<br>Input: ${escapeHtml(valueOrMissing(state.starter.input))}</p><h2>Main Task 1</h2><p>Score: ${sectionScore("main1")}/7<br>Commitment: ${escapeHtml(valueOrMissing(state.main1.commitmentReason))}</p><h2>Main Task 2</h2><p>IPO: ${escapeHtml(Object.values(state.main2.ipo).join(" / "))}<br>Algorithm: ${escapeHtml(state.main2.order.join(" → "))}<br>Variables: ${escapeHtml(valueOrMissing(state.main2.variables))}<br>Output: ${escapeHtml(valueOrMissing(state.main2.output))}</p><h3>Teacher-reviewed responses</h3><p>${escapeHtml(valueOrMissing(state.main2.meaningfulName))}</p><p>${escapeHtml(valueOrMissing(state.main2.improvedAlgorithm))}</p><h2>Extension</h2><p>Level 1: ${e.level1.complete?"Completed":"Not completed"}<br>Level 2: ${e.level2.complete?"Completed":"Not completed"}<br>Level 3: ${e.level3.complete?"Submitted":"Not completed"}</p>${e.level3.evidenceData?`<img src="${e.level3.evidenceData}" alt="A4 system design evidence">`:""}<h2>Plenary</h2><p>${escapeHtml(valueOrMissing(state.plenary.improvedInstruction))}<br>Confidence: ${escapeHtml(valueOrMissing(state.plenary.confidence))}/5<br>Next step: ${escapeHtml(valueOrMissing(state.plenary.nextStep))}</p><h2>Attempts and corrections</h2><ol>${state.attemptLog.map(item=>`<li><strong>${escapeHtml(item.question)}:</strong> ${escapeHtml(item.outcome)} — ${escapeHtml(item.answer)}</li>`).join("")||"<li>No checked attempts recorded.</li>"}</ol><h2>Submission</h2><p>Upload the saved PDF to Microsoft Teams Assignment: <strong>${LESSON.assignment}</strong>.</p>`;
  }
  function printReport() { buildPrintReport(); window.print(); }

  document.addEventListener("change", event => {
    if (event.target.id === "evidenceFile") processEvidence(event.target.files[0],event.target.files[0]?.name);
  });
  document.addEventListener("paste", event => {
    if (!$("#uploadZone") || SECTIONS[state.currentSection]?.id !== "extension") return;
    const file = Array.from(event.clipboardData?.files || []).find(item=>item.type.startsWith("image/"));
    if (file) { event.preventDefault(); processEvidence(file,"Pasted A4 evidence"); }
  });
  document.addEventListener("dragover", event => { if (event.target.closest("#uploadZone")) { event.preventDefault(); $("#uploadZone").classList.add("dragover"); } });
  document.addEventListener("dragleave", event => { if (event.target.closest("#uploadZone")) $("#uploadZone").classList.remove("dragover"); });
  document.addEventListener("drop", event => { const zone=event.target.closest("#uploadZone"); if (!zone) return; event.preventDefault(); zone.classList.remove("dragover"); const file=Array.from(event.dataTransfer.files).find(item=>item.type.startsWith("image/")); if(file)processEvidence(file,file.name); });

  init();
})();
