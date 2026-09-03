(() => {
  "use strict";

  const LESSON_ID = "year8-t1-week2-theory-smart-badge-flowchart";
  const SCHEMA_VERSION = 3;
  const SAVE_DELAY = 250;
  const LAST_PROFILE_KEY = `${LESSON_ID}:last-profile`;
  const CORRECT_SEQUENCE = [
    "The badge starts.",
    "Display a welcome icon.",
    "Wait for Button A to be pressed.",
    "Display the student’s initials.",
  ];
  const START_SEQUENCE = [
    "Display the student’s initials.",
    "Wait for Button A to be pressed.",
    "The badge starts.",
    "Display a welcome icon.",
  ];

  const SECTIONS = [
    { id: "doNow", label: "Do Now", core: true },
    { id: "types", label: "Types of Learning", core: true },
    { id: "main1", label: "Main Task 1", core: true },
    { id: "main2", label: "Main Task 2", core: true },
    { id: "extension", label: "Extension", optional: true },
    { id: "pitstop", label: "Learning Pitstop", core: true },
    { id: "plenary", label: "Plenary", core: true },
    { id: "review", label: "Review & PDF" },
  ];
  const CORE_IDS = SECTIONS.filter((section) => section.core).map((section) => section.id);

  const RESPONSE_LABELS = {
    do_input: "Do Now — Smart Badge input",
    do_output: "Do Now — final output",
    learning_type: "Types of Learning — personal focus",
    learning_strategy: "Types of Learning — improvement strategy",
    symbol_start: "Main Task 1 — START symbol",
    symbol_output: "Main Task 1 — output symbol",
    precise_output: "Main Task 1 — precise displayed content",
    evidence_teacher_checked: "Main Task 2 — teacher checked paper instead of upload",
    flowchart_explanation: "Main Task 2 — flowchart explanation",
    extension_1: "Extension Level 1 — precise Button B instruction",
    extension_2: "Extension Level 2 — flowchart adaptation",
    extension_3: "Extension Level 3 — reasoning",
    pitstop_stage: "Learning Pitstop — current stage",
    pitstop_action: "Learning Pitstop — next action",
    plenary_decomposition: "Plenary — decomposition",
    plenary_input: "Plenary — why Button A is an input",
    plenary_flowchart: "Plenary — how the flowchart helped",
    plenary_readiness: "Plenary — project readiness",
  };

  const SUPPORT_LABELS = { en: "", zh: "中文", ms: "Bahasa Melayu", ko: "한국어" };
  const LANGUAGE_SUPPORT = {
    zh: {
      doNow: "任务：阅读同一个智能徽章情境。把四个步骤按顺序排列，然后找出输入（Button A）和最终输出（学生姓名首字母）。关键词：input 输入；output 输出。",
      types: "选择你今天最需要加强的学习类型：Knowledge 知识、Skills 技能或 Understanding 理解。然后选择一种进步方法。",
      main1: "Algorithm（算法）是准确、有顺序的指令。Decomposition（分解）是把大问题拆成小部分。Flowchart（流程图）用标准图形和箭头表示算法。",
      main2: "在 A4 纸上画智能徽章流程图。使用椭圆表示开始/结束，平行四边形表示输入/输出，并用箭头连接。完成后上传或粘贴照片。",
      pitstop: "选择你现在的学习状态，并选择下一步行动。Drowning 表示你需要帮助，不代表失败。",
      plenary: "回答三个简短问题：分解有什么帮助？为什么 Button A 是输入？流程图怎样帮助你规划？",
    },
    ms: {
      doNow: "Tugas: Baca satu senario Lencana Pintar. Susun empat langkah, kemudian kenal pasti input (Button A) dan output terakhir (inisial murid).",
      types: "Pilih fokus utama anda hari ini: Knowledge (pengetahuan), Skills (kemahiran) atau Understanding (pemahaman). Kemudian pilih satu strategi untuk bertambah baik.",
      main1: "Algorithm ialah arahan tepat yang tersusun. Decomposition memecahkan masalah besar kepada bahagian kecil. Flowchart menggunakan simbol piawai dan anak panah untuk menunjukkan algoritma.",
      main2: "Lukis carta alir Lencana Pintar pada kertas A4. Gunakan bujur untuk mula/tamat, segi empat selari untuk input/output, dan sambungkan dengan anak panah. Kemudian muat naik atau tampal foto.",
      pitstop: "Pilih tahap pembelajaran anda sekarang dan satu tindakan seterusnya. Drowning bermaksud anda memerlukan bantuan; ia bukan kegagalan.",
      plenary: "Jawab tiga soalan ringkas: Bagaimanakah decomposition membantu? Mengapa Button A ialah input? Bagaimanakah flowchart membantu perancangan?",
    },
    ko: {
      doNow: "과제: 하나의 스마트 배지 상황을 읽으세요. 네 단계를 순서대로 배열한 뒤 입력(Button A)과 마지막 출력(학생 이니셜)을 찾으세요.",
      types: "오늘 가장 집중할 학습 유형을 선택하세요: Knowledge(지식), Skills(기능), Understanding(이해). 그리고 향상 방법 하나를 선택하세요.",
      main1: "Algorithm(알고리즘)은 정확하고 순서가 있는 지시입니다. Decomposition(분해)은 큰 문제를 작은 부분으로 나누는 것입니다. Flowchart(순서도)는 표준 기호와 화살표로 알고리즘을 나타냅니다.",
      main2: "A4 용지에 스마트 배지 순서도를 그리세요. 시작/끝은 타원, 입력/출력은 평행사변형을 사용하고 화살표로 연결하세요. 그 후 사진을 업로드하거나 붙여넣으세요.",
      pitstop: "현재 학습 상태와 다음 행동을 선택하세요. Drowning은 도움이 필요하다는 뜻이며 실패가 아닙니다.",
      plenary: "세 가지 짧은 질문에 답하세요: 분해는 어떻게 도움이 되었나요? 왜 Button A가 입력인가요? 순서도가 계획에 어떻게 도움이 되었나요?",
    },
  };

  const PITSTOP_ADVICE = {
    new: ["New learning", "Use the word bank and keep the worked example open while you explain each symbol."],
    consolidating: ["Consolidating", "Cover the example and explain your own flowchart aloud from START to END."],
    treading: ["Treading water", "Move to the Button B extension so you must adapt the algorithm rather than copy it."],
    drowning: ["Drowning", "Return to the labelled example. Ask your teacher to check just one symbol or arrow at a time."],
  };

  let state = null;
  let stateKey = "";
  let saveTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function makeDefaultState(student, teacherMode = false) {
    return {
      lessonId: LESSON_ID,
      schemaVersion: SCHEMA_VERSION,
      student,
      teacherMode,
      currentSection: "doNow",
      supportLanguage: student.supportLanguage || "en",
      sequence: [...START_SEQUENCE],
      responses: {},
      checks: {},
      completed: {},
      evidence: null,
      extensionLevel: 1,
      timestamps: { started: new Date().toISOString(), lastSaved: null, completed: {} },
    };
  }

  function normalizeState(saved, student, teacherMode) {
    const fresh = makeDefaultState(student, teacherMode);
    if (!saved || saved.lessonId !== LESSON_ID) return fresh;
    return {
      ...fresh,
      ...saved,
      schemaVersion: SCHEMA_VERSION,
      student,
      teacherMode,
      supportLanguage: student.supportLanguage || saved.supportLanguage || "en",
      sequence: Array.isArray(saved.sequence) && saved.sequence.length === 4 ? saved.sequence : fresh.sequence,
      responses: { ...(saved.responses || {}) },
      checks: { ...(saved.checks || {}) },
      completed: { ...(saved.completed || {}) },
      timestamps: { ...fresh.timestamps, ...(saved.timestamps || {}), completed: { ...(saved.timestamps?.completed || {}) } },
    };
  }

  function slug(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
  }

  function buildStateKey(student, teacherMode) {
    return teacherMode ? `${LESSON_ID}:teacher-review` : `${LESSON_ID}:${slug(student.className)}:${slug(student.name)}`;
  }

  function loadState(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  }

  function scheduleSave() {
    if (!state) return;
    setSaveStatus("Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, SAVE_DELAY);
  }

  function saveState() {
    if (!state) return;
    state.timestamps.lastSaved = new Date().toISOString();
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
      localStorage.setItem(LAST_PROFILE_KEY, JSON.stringify(state.student));
      setSaveStatus("Saved");
    } catch (error) {
      setSaveStatus("Save failed");
      showFeedback("exportFeedback", "error", "Browser storage is full", ["Download a backup now. The uploaded image may be too large."]);
    }
  }

  function setSaveStatus(text) { const element = $("#saveStatus"); if (element) element.textContent = text; }

  function getResponse(key) { return state?.responses?.[key] ?? ""; }
  function setResponse(key, value) { state.responses[key] = value; scheduleSave(); }

  function captureInput(target) {
    const key = target.dataset.track;
    if (!key || !state) return;
    if (target.type === "radio") {
      if (target.checked) setResponse(key, target.value);
    } else if (target.type === "checkbox") {
      setResponse(key, target.checked);
    } else {
      setResponse(key, target.value);
    }
    if (key === "pitstop_stage") renderPitstopAdvice();
  }

  function hydrateInputs() {
    $$('[data-track]').forEach((element) => {
      const value = getResponse(element.dataset.track);
      if (element.type === "radio") element.checked = value === element.value;
      else if (element.type === "checkbox") element.checked = value === true;
      else element.value = value || "";
    });
  }

  function markComplete(sectionId) {
    state.completed[sectionId] = true;
    state.timestamps.completed[sectionId] = state.timestamps.completed[sectionId] || new Date().toISOString();
    scheduleSave();
    renderNavigation();
    updateProgress();
  }

  function isUnlocked(sectionId) {
    if (state?.teacherMode) return true;
    const rules = {
      doNow: true,
      types: state?.completed?.doNow,
      main1: state?.completed?.types,
      main2: state?.completed?.main1,
      extension: state?.completed?.main2,
      pitstop: state?.completed?.main2,
      plenary: state?.completed?.pitstop,
      review: state?.completed?.plenary,
    };
    return Boolean(rules[sectionId]);
  }

  function renderNavigation() {
    const html = SECTIONS.map((section, index) => {
      const completed = Boolean(state.completed[section.id]);
      const active = state.currentSection === section.id;
      const optional = section.optional ? " · optional" : "";
      return `<button class="journey-button${completed ? " completed" : ""}${active ? " active" : ""}" data-go="${section.id}" type="button" ${isUnlocked(section.id) ? "" : "disabled"}><span>${completed ? "✓" : index + 1}</span><span>${section.label}${optional}</span></button>`;
    }).join("");
    $("#journeyButtons").innerHTML = html;
    $("#mobileJourney").innerHTML = `<div class="mobile-journey-list">${html}</div>`;
  }

  function updateProgress() {
    const completed = CORE_IDS.filter((id) => state.completed[id]).length;
    const percent = Math.round((completed / CORE_IDS.length) * 100);
    $("#progressText").textContent = `${percent}%`;
    $("#progressBar").style.width = `${percent}%`;
    const coreIndex = CORE_IDS.indexOf(state.currentSection);
    const label = SECTIONS.find((section) => section.id === state.currentSection)?.label || "Lesson";
    $("#stageCounter").textContent = coreIndex >= 0 ? `${label} · ${coreIndex + 1} of ${CORE_IDS.length}` : label;
  }

  function goTo(sectionId) {
    if (!isUnlocked(sectionId)) return;
    state.currentSection = sectionId;
    $$(".lesson-section").forEach((section) => section.classList.toggle("active", section.dataset.section === sectionId));
    renderNavigation();
    updateProgress();
    if (sectionId === "review") renderReview();
    scheduleSave();
    $("#lessonContent").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobilePanels();
  }

  function showFeedback(id, type, title, messages) {
    const box = document.getElementById(id);
    if (!box) return;
    box.hidden = false;
    box.className = `feedback ${type}`;
    box.innerHTML = `<h3>${escapeHtml(title)}</h3>${messages.length ? `<ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>` : ""}`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function renderSequence() {
    $("#sequenceList").innerHTML = state.sequence.map((step, index) => `
      <li class="sequence-item">
        <span class="sequence-number">${index + 1}</span>
        <span>${escapeHtml(step)}</span>
        <span class="sequence-controls">
          <button type="button" data-move="up" data-index="${index}" aria-label="Move step ${index + 1} up" ${index === 0 ? "disabled" : ""}>↑</button>
          <button type="button" data-move="down" data-index="${index}" aria-label="Move step ${index + 1} down" ${index === state.sequence.length - 1 ? "disabled" : ""}>↓</button>
        </span>
      </li>`).join("");
  }

  function moveSequence(index, direction) {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= state.sequence.length) return;
    [state.sequence[index], state.sequence[nextIndex]] = [state.sequence[nextIndex], state.sequence[index]];
    renderSequence();
    scheduleSave();
  }

  function checkDoNow() {
    const input = getResponse("do_input");
    const output = getResponse("do_output");
    if (!input || !output) {
      return showFeedback("doNowFeedback", "warning", "Make one choice in each box", ["Choose the event entering the system and the final visible output. Then check again."]);
    }
    const sequenceCorrect = state.sequence.every((step, index) => step === CORRECT_SEQUENCE[index]);
    const messages = [
      sequenceCorrect ? "Your four steps are in a logical order." : "Review the order: the badge must start before it displays anything, and the initials appear after Button A.",
      input === "button" ? "Correct: pressing Button A is the input event." : "Look again: the input is the event the visitor performs.",
      output === "initials" ? "Correct: the initials are the final visible output." : "Look for what the LED matrix displays at the end.",
    ];
    state.checks.doNow = { attempted: true, sequenceCorrect, inputCorrect: input === "button", outputCorrect: output === "initials" };
    markComplete("doNow");
    showFeedback("doNowFeedback", sequenceCorrect && input === "button" && output === "initials" ? "success" : "warning", "Do Now checked — you may continue", messages);
    $('[data-next="types"]', $('[data-section="doNow"]')).hidden = false;
  }

  function completeTypes() {
    if (!getResponse("learning_type") || !getResponse("learning_strategy")) {
      return showFeedback("typesFeedback", "warning", "Choose your focus and strategy", ["There is no wrong learning type. Choose honestly, then select how you will get better."]);
    }
    markComplete("types");
    goTo("main1");
  }

  function checkMain1() {
    const start = getResponse("symbol_start");
    const output = getResponse("symbol_output");
    const precise = String(getResponse("precise_output")).trim();
    if (!start || !output || !precise) {
      return showFeedback("main1Feedback", "warning", "Complete the three small gaps", ["Choose both symbols and name exactly what the badge should display."]);
    }
    const messages = [
      start === "oval" ? "Correct: START uses an oval." : "START and END use ovals. Use the symbol guide if you need it.",
      output === "parallelogram" ? "Correct: a displayed result uses an input/output parallelogram." : "DISPLAY is an output, so use the input/output parallelogram.",
      `Your precise instruction now states: “When the Smart Badge starts, display ${precise} on the LED matrix.”`,
    ];
    state.checks.main1 = { attempted: true, startCorrect: start === "oval", outputCorrect: output === "parallelogram" };
    markComplete("main1");
    showFeedback("main1Feedback", start === "oval" && output === "parallelogram" ? "success" : "warning", "Main Task 1 checked — you may continue", messages);
    $('[data-next="main2"]', $('[data-section="main1"]')).hidden = false;
  }

  async function processEvidenceFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      return showFeedback("main2Feedback", "error", "That is not an image", ["Choose or paste a PNG, JPEG or other browser-supported image."]);
    }
    try {
      const compressed = await compressImage(file, 1400, .78);
      state.evidence = { dataUrl: compressed, name: file.name || "pasted-flowchart.png", type: compressed.slice(5, compressed.indexOf(";")), savedAt: new Date().toISOString() };
      scheduleSave();
      renderEvidence();
      showFeedback("main2Feedback", "success", "Evidence added", ["Check that the photograph is clear enough for your teacher to read."]);
    } catch {
      showFeedback("main2Feedback", "error", "The image could not be prepared", ["Try a smaller screenshot or photograph."]);
    }
  }

  function compressImage(file, maxDimension, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderEvidence() {
    const preview = $("#evidencePreview");
    const remove = $("#removeEvidence");
    if (!state.evidence?.dataUrl) {
      preview.hidden = true;
      preview.innerHTML = "";
      remove.hidden = true;
      return;
    }
    preview.hidden = false;
    preview.innerHTML = `<img src="${state.evidence.dataUrl}" alt="Uploaded Smart Badge flowchart evidence"><p>${escapeHtml(state.evidence.name)}</p>`;
    remove.hidden = false;
  }

  function completeMain2() {
    const explanation = String(getResponse("flowchart_explanation")).trim();
    const alternative = getResponse("evidence_teacher_checked") === true;
    if (!state.evidence && !alternative) {
      return showFeedback("main2Feedback", "warning", "Add your A4 evidence", ["Upload or paste a photograph. If uploading is not possible, ask your teacher to check the paper and tick the teacher-check option."]);
    }
    if (explanation.length < 10) {
      return showFeedback("main2Feedback", "warning", "Explain the flowchart", ["Use the frame: My flowchart begins by… The input is… After this input, the micro:bit…"]);
    }
    markComplete("main2");
    showFeedback("main2Feedback", "success", "Main Task submitted", [state.evidence ? "Your flowchart image and explanation are saved." : "Your teacher-check record and explanation are saved.", "Choose the extension if you have time, or continue to the Learning Pitstop."]);
    $("#main2Routes").hidden = false;
  }

  function saveExtensionLevel(level) {
    const key = `extension_${level}`;
    const response = String(getResponse(key)).trim();
    if (response.length < 5) return showFeedback("extensionFeedback", "warning", `Finish Level ${level}`, ["Write one clear sentence before moving on."]);
    state.extensionLevel = Math.max(state.extensionLevel, level + 1);
    if (level < 3) $(`.level-card[data-level="${level + 1}"]`).hidden = false;
    if (level === 3) markComplete("extension");
    scheduleSave();
    showFeedback("extensionFeedback", "success", `Level ${level} saved`, [level < 3 ? `Continue to Level ${level + 1} if time allows.` : "You completed all three extension levels."]);
  }

  function renderExtensionLevels() {
    $$(".level-card").forEach((card) => { card.hidden = Number(card.dataset.level) > state.extensionLevel; });
  }

  function renderPitstopAdvice() {
    const selected = getResponse("pitstop_stage");
    const box = $("#pitstopAdvice");
    if (!selected || !PITSTOP_ADVICE[selected]) { box.hidden = true; return; }
    const [title, advice] = PITSTOP_ADVICE[selected];
    box.hidden = false;
    box.innerHTML = `<strong>${escapeHtml(title)} — recommended next step</strong><p>${escapeHtml(advice)}</p>`;
  }

  function completePitstop() {
    if (!getResponse("pitstop_stage") || !getResponse("pitstop_action")) {
      return showFeedback("pitstopFeedback", "warning", "Choose your stage and next action", ["This is not a grade. Choose the description that is most useful to you."]);
    }
    markComplete("pitstop");
    goTo("plenary");
  }

  function completePlenary() {
    const required = ["plenary_decomposition", "plenary_input", "plenary_flowchart", "plenary_readiness"];
    const missing = required.filter((key) => !String(getResponse(key)).trim());
    if (missing.length) return showFeedback("plenaryFeedback", "warning", "Complete the four short responses", ["Use the sentence starters. Your teacher will review the two explanations."]);
    const correct = getResponse("plenary_decomposition") === "split";
    const inputText = String(getResponse("plenary_input")).toLowerCase();
    const mentionsEvent = /press|button|signal|event|system|micro:bit|program/.test(inputText);
    const messages = [
      correct ? "Correct: decomposition breaks a larger problem into manageable parts." : "Review: decomposition means breaking a larger problem into manageable parts.",
      mentionsEvent ? "Your Button A explanation identifies how an event enters the system." : "Before submitting, consider adding that pressing Button A sends an event or signal into the micro:bit.",
      "Your flowchart explanation and readiness choice are saved for your teacher.",
    ];
    state.checks.plenary = { decompositionCorrect: correct, inputExplanationSupported: mentionsEvent };
    markComplete("plenary");
    showFeedback("plenaryFeedback", correct ? "success" : "warning", "Plenary complete", messages);
    $('[data-next="review"]', $('[data-section="plenary"]')).hidden = false;
  }

  function formatResponse(key) {
    const value = getResponse(key);
    if (value === true) return "Yes";
    if (value === false || value === "") return "Not completed";
    const labels = {
      do_input: { start: "The badge starts", button: "Button A is pressed", initials: "Initials appear" },
      do_output: { button: "Button A", initials: "The student’s initials", code: "Stored instructions" },
      learning_type: { knowledge: "Knowledge", skills: "Skills", understanding: "Understanding" },
      symbol_start: { oval: "Oval", parallelogram: "Parallelogram", rectangle: "Rectangle" },
      symbol_output: { oval: "Oval", parallelogram: "Parallelogram", rectangle: "Rectangle" },
      pitstop_stage: { new: "New learning", consolidating: "Consolidating", treading: "Treading water", drowning: "Drowning" },
      plenary_decomposition: { remove: "Remove every difficult part", split: "Break a large problem into manageable parts", code: "Write code without planning" },
    };
    return labels[key]?.[value] || String(value);
  }

  function renderReview() {
    const groups = [
      ["Do Now", ["do_input", "do_output"]],
      ["Types of Learning", ["learning_type", "learning_strategy"]],
      ["Main Task 1", ["symbol_start", "symbol_output", "precise_output"]],
      ["Main Task 2", ["flowchart_explanation", "evidence_teacher_checked"]],
      ["Optional Extension", ["extension_1", "extension_2", "extension_3"]],
      ["Learning Pitstop", ["pitstop_stage", "pitstop_action"]],
      ["Plenary", ["plenary_decomposition", "plenary_input", "plenary_flowchart", "plenary_readiness"]],
    ];
    const completedCount = CORE_IDS.filter((id) => state.completed[id]).length;
    let html = `<div class="review-header"><div><strong>${escapeHtml(state.student.name)}</strong><br>${escapeHtml(state.student.className)} · Year 8 Week 2 Theory</div><span class="status-pill ${completedCount === CORE_IDS.length ? "complete" : "incomplete"}">${completedCount}/${CORE_IDS.length} core stages complete</span></div>`;
    html += `<div class="review-group"><h3>Learning spine</h3><p>Smart Badge problem → decomposition → algorithm → flowchart</p><p><strong>WAGBA:</strong> We are getting better at decomposing a Smart Badge problem and representing its algorithm using a clear flowchart.</p><p><strong>Do Now sequence:</strong> ${state.sequence.map(escapeHtml).join(" → ")}</p></div>`;
    groups.forEach(([title, keys]) => {
      const attempted = keys.some((key) => String(getResponse(key)).trim() && getResponse(key) !== false);
      html += `<div class="review-group"><h3>${escapeHtml(title)} <span class="status-pill ${attempted ? "complete" : "incomplete"}">${attempted ? "Attempted" : "Not completed"}</span></h3>`;
      keys.forEach((key) => { html += `<div class="review-row"><strong>${escapeHtml(RESPONSE_LABELS[key] || key)}</strong><span>${escapeHtml(formatResponse(key))}</span></div>`; });
      html += `</div>`;
    });
    if (state.evidence?.dataUrl) html += `<div class="review-group"><h3>Main Task evidence</h3><img class="review-image" src="${state.evidence.dataUrl}" alt="Uploaded Smart Badge flowchart"></div>`;
    $("#reviewSummary").innerHTML = html;
  }

  function sanitizeFilename(value) { return String(value).replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "_"); }

  async function exportPdf() {
    if (!window.PDFLib) {
      return showFeedback("exportFeedback", "error", "Direct PDF export is unavailable", ["Use Print / Save as PDF instead."]);
    }
    setSaveStatus("Creating PDF…");
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pageSize = [595.28, 841.89];
      const margin = 48;
      let page;
      let y;
      let pageNumber = 0;

      const newPage = () => {
        page = pdf.addPage(pageSize);
        pageNumber += 1;
        y = pageSize[1] - margin;
        page.drawText("YEAR 8 · TERM 1 · WEEK 2 THEORY", { x: margin, y, size: 9, font: bold, color: rgb(.39, .22, .71) });
        page.drawText(`Page ${pageNumber}`, { x: pageSize[0] - margin - 40, y, size: 8, font: regular, color: rgb(.35, .35, .35) });
        y -= 24;
      };
      const pdfSafe = (text) => String(text ?? "")
        .replace(/→/g, "->")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[–—]/g, "-")
        .replace(/·/g, "|")
        .normalize("NFKD")
        .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
      const wrap = (text, font, size, width) => {
        const words = pdfSafe(text || "Not completed").replace(/\s+/g, " ").split(" ");
        const lines = [];
        let line = "";
        words.forEach((word) => {
          const candidate = line ? `${line} ${word}` : word;
          if (font.widthOfTextAtSize(candidate, size) <= width) line = candidate;
          else { if (line) lines.push(line); line = word; }
        });
        if (line) lines.push(line);
        return lines.length ? lines : [""];
      };
      const addText = (text, options = {}) => {
        const font = options.bold ? bold : regular;
        const size = options.size || 10;
        const lineHeight = options.lineHeight || size * 1.38;
        const lines = wrap(text, font, size, pageSize[0] - margin * 2);
        if (y - lines.length * lineHeight < margin + 25) newPage();
        lines.forEach((line) => { page.drawText(line, { x: margin, y, size, font, color: options.color || rgb(.08, .08, .08) }); y -= lineHeight; });
        y -= options.after ?? 4;
      };
      const addHeading = (text) => { if (y < 120) newPage(); y -= 4; addText(text, { bold: true, size: 14, after: 7 }); };
      const addResponse = (key) => { addText(`${RESPONSE_LABELS[key] || key}:`, { bold: true, size: 9, after: 1 }); addText(formatResponse(key), { size: 10, after: 7 }); };

      newPage();
      addText("Smart Badge Algorithm and Flowchart", { bold: true, size: 21, after: 8 });
      addText(`Student: ${state.student.name}     Class: ${state.student.className}`, { bold: true, size: 11 });
      addText(`Generated: ${new Date().toLocaleString()}     Completion: ${CORE_IDS.filter((id) => state.completed[id]).length}/${CORE_IDS.length} core stages`, { size: 9, color: rgb(.3, .3, .3), after: 10 });
      addText("WAGBA: We are getting better at decomposing a Smart Badge problem and representing its algorithm using a clear flowchart.", { bold: true, size: 10, after: 8 });
      addText("Learning spine: Smart Badge problem → decomposition → algorithm → flowchart", { size: 10, after: 12 });

      addHeading("Do Now");
      addText(`Sequence: ${state.sequence.join(" → ")}`);
      addResponse("do_input"); addResponse("do_output");
      addHeading("Types of Learning");
      addResponse("learning_type"); addResponse("learning_strategy");
      addHeading("Main Task 1 — Learn and See");
      addResponse("symbol_start"); addResponse("symbol_output");
      addText("Precise instruction:", { bold: true, size: 9, after: 1 });
      addText(getResponse("precise_output") ? `When the Smart Badge starts, display ${getResponse("precise_output")} on the LED matrix.` : "Not completed", { after: 8 });
      addHeading("Main Task 2 — Smart Badge Blueprint");
      addResponse("flowchart_explanation"); addResponse("evidence_teacher_checked");

      if (state.evidence?.dataUrl) {
        const bytes = Uint8Array.from(atob(state.evidence.dataUrl.split(",")[1]), (character) => character.charCodeAt(0));
        const embedded = await pdf.embedJpg(bytes);
        const availableWidth = pageSize[0] - margin * 2;
        const scale = Math.min(availableWidth / embedded.width, 360 / embedded.height, 1);
        const width = embedded.width * scale;
        const height = embedded.height * scale;
        if (y - height < margin + 25) newPage();
        page.drawImage(embedded, { x: margin, y: y - height, width, height });
        y -= height + 12;
      } else addText("Flowchart image: Not uploaded", { after: 8 });

      addHeading("Optional Extension");
      ["extension_1", "extension_2", "extension_3"].forEach(addResponse);
      addHeading("Learning Pitstop");
      addResponse("pitstop_stage"); addResponse("pitstop_action");
      addHeading("Plenary");
      ["plenary_decomposition", "plenary_input", "plenary_flowchart", "plenary_readiness"].forEach(addResponse);
      addHeading("Submission reminder");
      addText("Upload this PDF to the Microsoft Teams Assignment named Week 2 Theory. Upload the PDF, not a screenshot.", { bold: true, size: 10 });

      const bytes = await pdf.save();
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), `Year8_${sanitizeFilename(state.student.className)}_${sanitizeFilename(state.student.name)}_Week2_Theory.pdf`);
      setSaveStatus("Saved");
      showFeedback("exportFeedback", "success", "PDF downloaded", ["Upload it to Microsoft Teams: Week 2 Theory.", "Check that you are uploading the PDF rather than a screenshot."]);
    } catch (error) {
      setSaveStatus("Saved");
      showFeedback("exportFeedback", "error", "PDF export was blocked", ["Use Print / Save as PDF instead.", error.message || "Unknown error"]);
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportBackup() {
    const payload = { ...state, exportedAt: new Date().toISOString() };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `Year8_${sanitizeFilename(state.student.className)}_${sanitizeFilename(state.student.name)}_Week2_Theory_Backup.json`);
  }

  async function importBackup(file) {
    try {
      const imported = JSON.parse(await file.text());
      if (imported.lessonId !== LESSON_ID) throw new Error("This backup belongs to a different lesson.");
      if (!confirm("Replace the current work with this backup?")) return;
      const student = state.teacherMode ? state.student : imported.student;
      state = normalizeState(imported, student, state.teacherMode);
      stateKey = buildStateKey(student, state.teacherMode);
      hydrateApp();
      saveState();
      showFeedback("exportFeedback", "success", "Backup restored", ["Responses, completion and flowchart evidence were restored."]);
    } catch (error) {
      showFeedback("exportFeedback", "error", "Backup could not be imported", [error.message || "The file may be damaged."]);
    }
  }

  function renderLanguageSupport() {
    const language = state.supportLanguage || "en";
    $("#languageChip").hidden = language === "en";
    $("#languageChip").textContent = SUPPORT_LABELS[language] || "";
    $$(".language-help").forEach((details) => {
      const content = LANGUAGE_SUPPORT[language]?.[details.dataset.support];
      details.hidden = !content;
      const container = $("div", details);
      if (container) container.innerHTML = content ? `<p>${escapeHtml(content)}</p>` : "";
    });
  }

  function renderLearningPanels() {
    const content = $("#learningPanelTemplate").innerHTML;
    $("#desktopLearningPanel").innerHTML = content;
    $("#mobileLearningPanel").innerHTML = content;
  }

  function closeMobilePanels() {
    ["mobileJourney", "mobileLearningPanel"].forEach((id) => { const panel = document.getElementById(id); panel.hidden = true; panel.classList.remove("open"); });
    $("#mobileMenuButton").setAttribute("aria-expanded", "false");
    $("#learningDrawerButton").setAttribute("aria-expanded", "false");
  }

  function toggleMobilePanel(panelId, buttonId) {
    const panel = document.getElementById(panelId);
    const opening = panel.hidden;
    closeMobilePanels();
    panel.hidden = !opening;
    panel.classList.toggle("open", opening);
    document.getElementById(buttonId).setAttribute("aria-expanded", String(opening));
  }

  function openImage(button) {
    const dialog = $("#imageDialog");
    const image = $("#dialogImage");
    image.src = button.dataset.image;
    image.alt = button.dataset.alt || "Enlarged lesson image";
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function installImageFallbacks() {
    $$("img").forEach((image) => image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "feedback warning";
      fallback.textContent = "The support image could not be loaded. Continue using the written instructions.";
      image.replaceWith(fallback);
    }, { once: true }));
  }

  function hydrateApp() {
    $("#headerStudentName").textContent = state.teacherMode ? "Teacher review" : state.student.name;
    $("#headerStudentClass").textContent = state.student.className;
    hydrateInputs();
    renderSequence();
    renderNavigation();
    renderLearningPanels();
    renderLanguageSupport();
    renderEvidence();
    renderExtensionLevels();
    renderPitstopAdvice();
    updateProgress();
    if (state.completed.doNow) $('[data-next="types"]', $('[data-section="doNow"]')).hidden = false;
    if (state.completed.main1) $('[data-next="main2"]', $('[data-section="main1"]')).hidden = false;
    if (state.completed.main2) $("#main2Routes").hidden = false;
    if (state.completed.plenary) $('[data-next="review"]', $('[data-section="plenary"]')).hidden = false;
    goTo(isUnlocked(state.currentSection) ? state.currentSection : "doNow");
  }

  async function enterLesson(event) {
    event.preventDefault();
    const name = $("#studentName").value.trim();
    const className = $("#studentClass").value.trim();
    const teacherMode = name.toLowerCase() === "teacher";
    if (!name || (!className && !teacherMode)) {
      $("#entryError").textContent = "Enter your full name and class before starting.";
      return;
    }
    const student = { name: teacherMode ? "Teacher review" : name, className: teacherMode ? (className || "Review") : className, supportLanguage: $("#supportLanguage").value };
    stateKey = buildStateKey(student, teacherMode);
    state = normalizeState(loadState(stateKey), student, teacherMode);
    $("#landingPage").hidden = true;
    $("#lessonApp").hidden = false;
    hydrateApp();
    saveState();
  }

  function init() {
    renderLearningPanels();
    try {
      const last = JSON.parse(localStorage.getItem(LAST_PROFILE_KEY) || "null");
      if (last?.name && last.name !== "Teacher review") {
        $("#studentName").value = last.name;
        $("#studentClass").value = last.className || "";
        $("#supportLanguage").value = last.supportLanguage || "en";
        $("#resumeNotice").hidden = false;
      }
    } catch { /* Keep blank entry form. */ }

    $("#entryForm").addEventListener("submit", enterLesson);
    document.addEventListener("input", (event) => { if (event.target.matches("[data-track]")) captureInput(event.target); });
    document.addEventListener("change", (event) => { if (event.target.matches("[data-track]")) captureInput(event.target); });
    document.addEventListener("click", (event) => {
      const move = event.target.closest("[data-move]");
      if (move) return moveSequence(Number(move.dataset.index), move.dataset.move);
      const navigation = event.target.closest("[data-go], [data-next], [data-back]");
      if (navigation) return goTo(navigation.dataset.go || navigation.dataset.next || navigation.dataset.back);
      const imageButton = event.target.closest(".image-button");
      if (imageButton) return openImage(imageButton);
      const levelButton = event.target.closest("[data-level-save]");
      if (levelButton) return saveExtensionLevel(Number(levelButton.dataset.levelSave));
    });

    $("#checkDoNow").addEventListener("click", checkDoNow);
    $("#completeTypes").addEventListener("click", completeTypes);
    $("#checkMain1").addEventListener("click", checkMain1);
    $("#completeMain2").addEventListener("click", completeMain2);
    $("#completePitstop").addEventListener("click", completePitstop);
    $("#completePlenary").addEventListener("click", completePlenary);
    $("#evidenceFile").addEventListener("change", (event) => processEvidenceFile(event.target.files?.[0]));
    $("#pasteZone").addEventListener("paste", (event) => {
      const file = [...(event.clipboardData?.items || [])].find((item) => item.type.startsWith("image/"))?.getAsFile();
      if (file) { event.preventDefault(); processEvidenceFile(file); }
    });
    $("#removeEvidence").addEventListener("click", () => { if (confirm("Remove the uploaded flowchart image?")) { state.evidence = null; renderEvidence(); scheduleSave(); } });
    $("#headerExportButton").addEventListener("click", exportPdf);
    $("#finalExportButton").addEventListener("click", exportPdf);
    $("#printButton").addEventListener("click", () => { renderReview(); window.print(); });
    $("#backupButton").addEventListener("click", exportBackup);
    $("#backupInput").addEventListener("change", (event) => { if (event.target.files?.[0]) importBackup(event.target.files[0]); });
    $("#resetButton").addEventListener("click", () => {
      if (!confirm("Delete all saved Week 2 Theory work for this student on this browser?")) return;
      localStorage.removeItem(stateKey);
      location.reload();
    });
    $("#mobileMenuButton").addEventListener("click", () => toggleMobilePanel("mobileJourney", "mobileMenuButton"));
    $("#learningDrawerButton").addEventListener("click", () => toggleMobilePanel("mobileLearningPanel", "learningDrawerButton"));
    $("#closeImageDialog").addEventListener("click", () => $("#imageDialog").close());
    $("#imageDialog").addEventListener("click", (event) => { if (event.target === $("#imageDialog")) $("#imageDialog").close(); });
    installImageFallbacks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
