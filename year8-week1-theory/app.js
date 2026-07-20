(() => {
  "use strict";

  const LESSON = {
    school: "Tenby International School Tropicana Aman",
    year: "Year 8",
    week: 1,
    assignment: "Week 1 Theory",
    title: "Computer Science Foundations",
    subtitle: "Expectations, algorithms and Python baseline",
    learning: {
      topic: "Computer Science foundations: algorithms, Python and learning expectations",
      wagba: "We are getting better at explaining how we learn in Computer Science and showing what we already know about algorithms and Python.",
      knowledge: "Know what algorithms, programs, input, process and output mean, and know the expectations for learning Computer Science.",
      skills: "Sequence instructions, predict simple Python output, identify unclear instructions and explain your thinking.",
      understanding: "Understand that algorithms must be clear, ordered and precise, and that testing and debugging are normal parts of learning.",
      keywords: "algorithm · program · sequence · input · process · output · variable · predict · debug · evidence",
      challenge: "Improve an unclear algorithm and justify why your version is easier for a computer or another student to follow."
    }
  };

  const SECTIONS = [
    { id: "starter", title: "Starter: What Do You Remember?", short: "Starter", core: true },
    { id: "main1", title: "Main Task 1: How We Learn in CS", short: "Main Task 1", core: true },
    { id: "main2", title: "Main Task 2: Algorithm Rescue", short: "Main Task 2", core: true },
    { id: "extension", title: "Extension: Welcome Badge Upgrade", short: "Extension", core: false, optional: true },
    { id: "plenary", title: "Plenary: First Lesson Reflection", short: "Plenary", core: true },
    { id: "review", title: "Review and PDF Export", short: "Review", core: true }
  ];

  const starterOrderCorrect = ["Wake up", "Get out of bed", "Put on shoes", "Go to school"];
  const algorithmOrderCorrect = ["Start", "Ask the user for their name", "Store the name", "Create a greeting using the name", "Display the greeting", "End"];

  const learningHabits = [
    { id: "h1", text: "Read the error message before asking for help.", answer: "helps", feedback: "This helps because the error message often identifies the line or type of problem." },
    { id: "h2", text: "Copy code from a friend without reading or testing it.", answer: "stops", feedback: "Copying without understanding prevents you from explaining or improving the program." },
    { id: "h3", text: "Test one small change at a time.", answer: "helps", feedback: "Small tests make it easier to identify which change caused a new result or error." },
    { id: "h4", text: "Use AI to ask for an explanation, then test the suggestion yourself.", answer: "depends", feedback: "This can help when you read, question and test the suggestion. It stops learning if you simply copy." },
    { id: "h5", text: "Give a partner the complete answer immediately.", answer: "stops", feedback: "A complete answer removes the partner's opportunity to think. Give a hint or ask a useful question instead." },
    { id: "h6", text: "Help a partner understand what an error message means.", answer: "helps", feedback: "Explaining an error supports both students' understanding without taking over the task." },
    { id: "h7", text: "Change many lines before running the program again.", answer: "stops", feedback: "Changing many lines at once makes it difficult to know which change helped or caused a problem." },
    { id: "h8", text: "Use online examples as a reference and adapt them to your own problem.", answer: "depends", feedback: "References can support learning when you understand and adapt them, not when you submit them unchanged." }
  ];

  const DEFAULT_STATE = {
    version: 1,
    student: { fullName: "", className: "" },
    currentSection: 0,
    completed: {},
    startedAt: "",
    updatedAt: "",
    starter: {
      order: ["Wake up", "Put on shoes", "Get out of bed", "Go to school"],
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      confidence: "",
      confidenceReason: "",
      checked: false,
      feedback: {},
      score: 0
    },
    main1: {
      classifications: {},
      checked: false,
      score: 0,
      commitmentChoices: [],
      commitmentReason: "",
      feedback: {}
    },
    main2: {
      ipo: { input: "", process: "", output: "" },
      order: ["Display the greeting", "Ask the user for their name", "Create a greeting using the name", "Start", "Store the name", "End"],
      codeInputLine: "",
      codeVariables: "",
      codeOutput: "",
      meaningfulName: "",
      improvedAlgorithm: "",
      checked: false,
      score: 0,
      feedback: {}
    },
    extension: {
      feature: "",
      algorithm: "",
      sampleOutput: "",
      attempted: false
    },
    plenary: {
      learned: "",
      expectation: "",
      firstAction: "",
      confidence: "",
      confidenceReason: "",
      submitted: false
    },
    pdfGeneratedAt: ""
  };

  const teacherMode = new URLSearchParams(location.search).get("teacher") === "1";
  const STORAGE_KEY = teacherMode ? "tta_y8_w1_theory_teacher_v1" : "tta_y8_w1_theory_student_v1";
  let state = loadState();
  let saveTimer = null;
  let toastTimer = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function cloneDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fresh = cloneDefault();
        if (teacherMode) {
          fresh.student.fullName = "Test Student";
          fresh.student.className = "8T";
        }
        return fresh;
      }
      return mergeDeep(cloneDefault(), JSON.parse(raw));
    } catch {
      return cloneDefault();
    }
  }

  function mergeDeep(target, source) {
    Object.keys(source || {}).forEach((key) => {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        target[key] = mergeDeep(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  function saveState(immediate = false) {
    state.updatedAt = new Date().toISOString();
    $("#saveStatus").textContent = "Saving…";
    clearTimeout(saveTimer);
    const commit = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const time = new Date(state.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      $("#saveStatus").textContent = `Saved ${time}`;
    };
    if (immediate) commit();
    else saveTimer = setTimeout(commit, 250);
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function init() {
    populateLearningPanel();
    bindGlobalEvents();

    if (teacherMode && !state.startedAt) {
      state.startedAt = new Date().toISOString();
      state.currentSection = 0;
      saveState(true);
    }

    if (hasSavedStudentWork()) {
      $("#resumePanel").classList.remove("hidden");
      $("#resumeText").textContent = `${state.student.fullName} · ${state.student.className} · last saved ${formatDateTime(state.updatedAt || state.startedAt)}`;
    } else {
      $("#resumePanel").classList.add("hidden");
    }

    if (teacherMode) {
      $("#fullName").value = state.student.fullName || "Test Student";
      $("#className").value = state.student.className || "8T";
    }
  }

  function hasSavedStudentWork() {
    return Boolean(state.startedAt && state.student.fullName && state.student.className);
  }

  function populateLearningPanel() {
    $("#learningTopic").textContent = LESSON.learning.topic;
    $("#learningWagba").textContent = LESSON.learning.wagba;
    $("#learningKnowledge").textContent = LESSON.learning.knowledge;
    $("#learningSkills").textContent = LESSON.learning.skills;
    $("#learningUnderstanding").textContent = LESSON.learning.understanding;
    $("#learningKeywords").textContent = LESSON.learning.keywords;
    $("#learningChallenge").textContent = LESSON.learning.challenge;
  }

  function bindGlobalEvents() {
    $("#entryForm").addEventListener("submit", startLesson);
    $("#resumeButton").addEventListener("click", enterApp);
    $("#newStudentButton").addEventListener("click", resetForNewStudent);
    $("#backButton").addEventListener("click", previousSection);
    $("#nextButton").addEventListener("click", nextSection);
    $("#openJourneyButton").addEventListener("click", toggleJourney);
    $("#learningToggle").addEventListener("click", toggleLearningPanel);
    $("#learningClose").addEventListener("click", closeLearningPanel);
    $("#closeImageDialog").addEventListener("click", () => $("#imageDialog").close());
    $("#imageDialog").addEventListener("click", (event) => {
      if (event.target === $("#imageDialog")) $("#imageDialog").close();
    });
  }

  function validateEntry() {
    const fullName = $("#fullName").value.trim().replace(/\s+/g, " ");
    const className = $("#className").value.trim();
    let valid = true;

    $("#nameError").textContent = "";
    $("#classError").textContent = "";

    if (!teacherMode && (!fullName || !fullName.includes(" ") || fullName.length < 5)) {
      $("#nameError").textContent = "Enter your full name, including at least two name parts.";
      valid = false;
    }
    if (!teacherMode && !className) {
      $("#classError").textContent = "Enter your class.";
      valid = false;
    }
    return { valid, fullName: fullName || "Test Student", className: className || "8T" };
  }

  function startLesson(event) {
    event.preventDefault();
    const result = validateEntry();
    if (!result.valid) return;

    state = cloneDefault();
    state.student.fullName = result.fullName;
    state.student.className = result.className;
    state.startedAt = new Date().toISOString();

    if (teacherMode) {
      // Only for rapid hidden-route testing; no teacher controls are shown.
      state.starter.order = starterOrderCorrect.slice();
      state.starter.q2 = "algorithm";
      state.starter.q3 = "Aisha";
      state.starter.q4 = "The age typed by the user";
      state.starter.q5 = "The instruction does not explain the destination, direction or number of steps.";
      state.starter.confidence = "3";
      state.starter.confidenceReason = "I remember some Python and want to improve my explanations.";
    }

    saveState(true);
    enterApp();
  }

  function resetForNewStudent() {
    if (!confirm("Delete the saved progress on this device and start again?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = cloneDefault();
    $("#resumePanel").classList.add("hidden");
    $("#entryForm").reset();
    showToast("Saved progress removed.");
  }

  function enterApp() {
    $("#entryScreen").classList.add("hidden");
    $("#appShell").classList.remove("hidden");
    $("#headerStudentName").textContent = state.student.fullName;
    $("#headerStudentClass").textContent = state.student.className;
    state.currentSection = Math.min(Math.max(0, state.currentSection || 0), SECTIONS.length - 1);
    render();
    saveState(true);
    $("#mainContent").focus();
  }

  function render() {
    renderJourney();
    renderSection();
    renderNavigation();
    refreshHeaderProgress();
  }

  function renderJourney() {
    const nav = $("#journeyNav");
    nav.innerHTML = SECTIONS.map((section, index) => {
      const unlocked = isSectionUnlocked(index);
      const complete = Boolean(state.completed[section.id]);
      const current = index === state.currentSection;
      const status = complete ? "Completed" : unlocked ? (section.optional ? "Optional" : "Available") : "Locked";
      return `<button type="button" class="journey-link ${complete ? "complete" : ""} ${current ? "current" : ""} ${unlocked ? "" : "locked"}"
        data-section-index="${index}" ${unlocked ? "" : "disabled"} aria-current="${current ? "step" : "false"}">
        <span>${escapeHtml(section.short)}</span><span class="journey-status">${status}</span>
      </button>`;
    }).join("");

    nav.querySelectorAll("[data-section-index]").forEach((button) => {
      button.addEventListener("click", () => {
        goToSection(Number(button.dataset.sectionIndex));
        nav.classList.add("hidden");
        $("#openJourneyButton").setAttribute("aria-expanded", "false");
      });
    });
  }

  function refreshHeaderProgress() {
    const section = SECTIONS[state.currentSection];
    $("#currentSectionLabel").textContent = `Section ${state.currentSection + 1} of ${SECTIONS.length}`;
    $("#currentSectionTitle").textContent = section.title;
    const requiredSections = SECTIONS.filter(s => s.core && s.id !== "review");
    const completedCount = requiredSections.filter(s => state.completed[s.id]).length;
    const percent = Math.round((completedCount / requiredSections.length) * 100);
    $("#progressBar").style.width = `${percent}%`;
    $("#progressText").textContent = `${completedCount} of ${requiredSections.length} required sections completed · ${percent}%`;
  }

  function renderNavigation() {
    const index = state.currentSection;
    const section = SECTIONS[index];
    $("#backButton").disabled = index === 0;
    $("#backButton").textContent = "Back";

    if (section.id === "review") {
      $("#nextButton").classList.add("hidden");
      return;
    }
    $("#nextButton").classList.remove("hidden");

    if (section.optional) {
      $("#nextButton").textContent = state.extension.attempted ? "Continue to plenary" : "Skip extension and continue";
      $("#nextButton").disabled = false;
    } else {
      $("#nextButton").textContent = index === SECTIONS.length - 2 ? "Continue to review" : "Next section";
      $("#nextButton").disabled = !state.completed[section.id] && !teacherMode;
    }
  }

  function isSectionUnlocked(index) {
    if (teacherMode) return true;
    if (index === 0) return true;
    const target = SECTIONS[index];
    if (target.id === "extension") return Boolean(state.completed.main2);
    if (target.id === "plenary") return Boolean(state.completed.main2);
    if (target.id === "review") return Boolean(state.completed.plenary);
    const previousCore = SECTIONS.slice(0, index).filter(s => s.core && s.id !== "review").pop();
    return previousCore ? Boolean(state.completed[previousCore.id]) : true;
  }

  function goToSection(index) {
    if (!isSectionUnlocked(index)) {
      showToast("Complete the previous required section first.");
      return;
    }
    state.currentSection = index;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#mainContent").focus();
  }

  function previousSection() {
    if (state.currentSection > 0) goToSection(state.currentSection - 1);
  }

  function nextSection() {
    const current = SECTIONS[state.currentSection];
    if (current.optional) {
      goToSection(state.currentSection + 1);
      return;
    }
    if (!state.completed[current.id] && !teacherMode) {
      showToast("Complete the task before moving on.");
      return;
    }
    if (state.currentSection < SECTIONS.length - 1) goToSection(state.currentSection + 1);
  }

  function toggleJourney() {
    const nav = $("#journeyNav");
    const willOpen = nav.classList.contains("hidden");
    nav.classList.toggle("hidden");
    $("#openJourneyButton").setAttribute("aria-expanded", String(willOpen));
  }

  function toggleLearningPanel() {
    const panel = $("#learningPanel");
    const open = !panel.classList.contains("open");
    panel.classList.toggle("open", open);
    $("#learningToggle").setAttribute("aria-expanded", String(open));
  }

  function closeLearningPanel() {
    $("#learningPanel").classList.remove("open");
    $("#learningToggle").setAttribute("aria-expanded", "false");
  }

  function renderSection() {
    const id = SECTIONS[state.currentSection].id;
    const renderers = {
      starter: renderStarter,
      main1: renderMain1,
      main2: renderMain2,
      extension: renderExtension,
      plenary: renderPlenary,
      review: renderReview
    };
    $("#sectionContainer").innerHTML = renderers[id]();
    bindSectionEvents(id);
  }

  function sectionShell(label, title, lead, body) {
    return `<div class="section-hero"><span class="section-label">${escapeHtml(label)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(lead)}</p></div>
      <div class="section-body">${body}</div>`;
  }

  function imageBlock(src, alt, caption) {
    return `<figure>
      <button type="button" class="image-button" data-enlarge-src="${src}" data-enlarge-alt="${escapeAttr(alt)}" data-enlarge-caption="${escapeAttr(caption)}">
        <img class="lesson-image" src="${src}" alt="${escapeAttr(alt)}" onerror="handleImageError(this)">
      </button>
      <figcaption class="image-caption">${escapeHtml(caption)} · Select to enlarge</figcaption>
    </figure>`;
  }

  window.handleImageError = function(img) {
    const parent = img.closest("figure") || img.parentElement;
    if (!parent) return;
    parent.innerHTML = `<div class="image-fallback" role="img" aria-label="${escapeAttr(img.alt || "Lesson image unavailable")}">
      <strong>Lesson image unavailable</strong><br>The activity still works without this image.
    </div>`;
  };

  function renderStarter() {
    const s = state.starter;
    return sectionShell(
      "Do Now · 10 minutes",
      "What Do You Remember?",
      "Work independently. This is not a graded test; it helps your teacher understand what you already know.",
      `
      ${imageBlock("assets/images/starter-baseline-overview.png", "Visual overview of the Year 8 Computer Science starter questions", "Starter visual: sequencing, algorithms, Python output, input and confidence")}
      <div class="task-block">
        <h3>Complete all six baseline questions</h3>
        <p class="task-prompt">Try every question before checking. You can improve your answers after feedback.</p>
        <div class="question-list">
          <div class="question-card">
            <div class="question-title">1. Put the instructions into a sensible order</div>
            <ol id="starterOrder" class="order-list">${renderOrderItems(s.order, "starter")}</ol>
          </div>

          <fieldset class="question-card">
            <legend>2. Which statement best describes an algorithm?</legend>
            <div class="choice-list">
              ${radioChoice("starterQ2", "algorithm", "A clear, ordered set of instructions", s.q2)}
              ${radioChoice("starterQ2", "guess", "A random guess made by a computer", s.q2)}
              ${radioChoice("starterQ2", "screen", "The screen used to display a program", s.q2)}
            </div>
          </fieldset>

          <div class="question-card">
            <label class="question-title" for="starterQ3">3. What will this code display?</label>
            <pre class="code-block"><code><span class="code-line-number">1</span>student_name = "Aisha"
<span class="code-line-number">2</span>print(student_name)</code></pre>
            <input id="starterQ3" type="text" value="${escapeAttr(s.q3)}" placeholder="Type the output">
          </div>

          <div class="question-card">
            <label class="question-title" for="starterQ4">4. Identify the input</label>
            <pre class="code-block"><code><span class="code-line-number">1</span>age = input("Enter your age: ")
<span class="code-line-number">2</span>print(age)</code></pre>
            <input id="starterQ4" type="text" value="${escapeAttr(s.q4)}" placeholder="What data enters the program?">
          </div>

          <div class="question-card">
            <label class="question-title" for="starterQ5">5. Why is this instruction unclear?</label>
            <blockquote>“Make the character move to the correct place.”</blockquote>
            <textarea id="starterQ5" placeholder="Explain what information is missing">${escapeHtml(s.q5)}</textarea>
          </div>

          <fieldset class="question-card">
            <legend>6. Confidence check</legend>
            <p>Rate your current Python confidence from 1–5.</p>
            ${confidenceOptions("starterConfidence", s.confidence)}
            <label for="starterConfidenceReason">Explain your rating in one sentence.</label>
            <textarea id="starterConfidenceReason" placeholder="I chose this rating because…">${escapeHtml(s.confidenceReason)}</textarea>
          </fieldset>
        </div>

        <div id="starterFeedback">${starterFeedbackHtml()}</div>
        <div class="section-actions">
          <span class="completion-note">Completion requires all six questions and at least one check.</span>
          <button id="checkStarter" class="button primary" type="button">Check starter</button>
        </div>
      </div>`
    );
  }

  function starterFeedbackHtml() {
    const s = state.starter;
    if (!s.checked) return "";
    const cls = s.score >= 4 ? "success" : "warning";
    const items = Object.values(s.feedback || {}).filter(Boolean);
    return `<div class="feedback ${cls}">
      <strong>${s.score}/4 automatically checked answers currently correct.</strong>
      <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p>Your explanation and confidence response are saved as diagnostic evidence rather than fully auto-marked.</p>
    </div>`;
  }

  function renderMain1() {
    const m = state.main1;
    const classificationHtml = learningHabits.map((habit, index) => `
      <div class="classification-card">
        <div><strong>${index + 1}.</strong> ${escapeHtml(habit.text)}</div>
        <div class="segmented" role="radiogroup" aria-label="Classify: ${escapeAttr(habit.text)}">
          ${segmentedChoice(habit.id, "helps", "Helps learning", m.classifications[habit.id])}
          ${segmentedChoice(habit.id, "stops", "Stops learning", m.classifications[habit.id])}
          ${segmentedChoice(habit.id, "depends", "Depends", m.classifications[habit.id])}
        </div>
      </div>`).join("");

    return sectionShell(
      "Main Task 1 · 15 minutes",
      "How We Learn in Computer Science",
      "Judge different classroom habits, discuss what effective learning looks like and choose expectations you will apply.",
      `
      ${imageBlock("assets/images/computer-science-learning-habits.png", "Students demonstrating different Computer Science learning habits", "Use the situations to notice effective and ineffective CS learning habits")}
      <div class="task-block">
        <h3>Classify the learning habits</h3>
        <p class="task-prompt">Choose whether each behaviour helps learning, stops learning, or depends on how it is used.</p>
        <div class="classification-list">${classificationHtml}</div>
        <div id="main1Feedback">${main1FeedbackHtml()}</div>
        <div class="section-actions">
          <span class="completion-note">Aim for at least 6 of 8 classifications correct.</span>
          <button id="checkMain1" class="button primary" type="button">Check classifications</button>
        </div>
      </div>

      <div class="task-block">
        <h3>Your CS learning commitment</h3>
        <p class="task-prompt">Choose two expectations that will help you learn this year, then explain how you will apply them.</p>
        <div class="content-grid">
          ${commitmentCheckbox("Read the error message before asking for help", m.commitmentChoices)}
          ${commitmentCheckbox("Test one small change at a time", m.commitmentChoices)}
          ${commitmentCheckbox("Explain my own work even when I receive help", m.commitmentChoices)}
          ${commitmentCheckbox("Save and submit evidence using the correct name", m.commitmentChoices)}
        </div>
        <div class="field">
          <label for="commitmentReason">How will your chosen expectations help you?</label>
          <textarea id="commitmentReason" placeholder="These expectations will help me because…">${escapeHtml(m.commitmentReason)}</textarea>
        </div>
      </div>`
    );
  }

  function main1FeedbackHtml() {
    const m = state.main1;
    if (!m.checked) return "";
    const cls = m.score >= 6 ? "success" : "warning";
    const missed = learningHabits.filter(h => m.classifications[h.id] !== h.answer);
    return `<div class="feedback ${cls}">
      <strong>${m.score}/8 classifications correct.</strong>
      ${missed.length ? `<p>Review these ideas:</p><ul>${missed.map(h => `<li>${escapeHtml(h.feedback)}</li>`).join("")}</ul>` : `<p>You identified how each learning habit affects progress.</p>`}
    </div>`;
  }

  function renderMain2() {
    const m = state.main2;
    return sectionShell(
      "Main Task 2 · 25 minutes",
      "Algorithm Rescue",
      "Apply input–process–output, sequencing and Python reading to rescue an unclear digital name badge algorithm.",
      `
      ${imageBlock("assets/images/algorithm-rescue-name-badge.png", "Algorithm Rescue scenario featuring a digital student name badge", "Scenario visual: plan a simple digital name badge program")}
      <div class="card soft-purple">
        <h3>Scenario</h3>
        <p>A school wants a simple digital name badge. It should ask for a student’s name, store it, create a greeting and display the greeting with a symbol.</p>
      </div>

      <div class="task-block">
        <h3>Task A — Identify Input, Process and Output</h3>
        <p class="task-prompt">Select the role of each part of the name badge system.</p>
        <div class="ipo-grid">
          ${ipoSelect("input", "The student types their name", m.ipo.input)}
          ${ipoSelect("process", "The program stores the name and creates a greeting", m.ipo.process)}
          ${ipoSelect("output", "The greeting and symbol appear on screen", m.ipo.output)}
        </div>
      </div>

      <div class="task-block">
        <h3>Task B — Put the algorithm in order</h3>
        <ol id="algorithmOrder" class="order-list">${renderOrderItems(m.order, "algorithm")}</ol>
      </div>

      <div class="task-block">
        <h3>Task C — Read the Python</h3>
        <pre class="code-block"><code><span class="code-line-number">1</span>student_name = input("What is your name? ")
<span class="code-line-number">2</span>greeting = "Hello " + student_name
<span class="code-line-number">3</span>print(greeting)</code></pre>
        <div class="question-list">
          <div class="question-card">
            <label class="question-title" for="codeInputLine">Which line collects the input?</label>
            <select id="codeInputLine">
              <option value="">Choose a line</option>
              ${option("1", "Line 1", m.codeInputLine)}
              ${option("2", "Line 2", m.codeInputLine)}
              ${option("3", "Line 3", m.codeInputLine)}
            </select>
          </div>
          <div class="question-card">
            <label class="question-title" for="codeVariables">Which variables are used?</label>
            <input id="codeVariables" type="text" value="${escapeAttr(m.codeVariables)}" placeholder="Type both variable names">
          </div>
          <div class="question-card">
            <label class="question-title" for="codeOutput">What is the output if the student enters Daniel?</label>
            <input id="codeOutput" type="text" value="${escapeAttr(m.codeOutput)}" placeholder="Type the exact message">
          </div>
          <div class="question-card">
            <label class="question-title" for="meaningfulName">Why is student_name better than x?</label>
            <textarea id="meaningfulName" placeholder="Explain why meaningful names help a programmer">${escapeHtml(m.meaningfulName)}</textarea>
          </div>
        </div>
      </div>

      <div class="task-block">
        <h3>Task D — Solve and improve</h3>
        <p class="task-prompt">The algorithm below is too vague:</p>
        <pre class="code-block"><code>Get a name.
Do something with it.
Show it.</code></pre>
        <label class="question-title" for="improvedAlgorithm">Rewrite it as a clear, ordered and precise algorithm.</label>
        <textarea id="improvedAlgorithm" placeholder="1. Start&#10;2. Ask the user…">${escapeHtml(m.improvedAlgorithm)}</textarea>
      </div>

      <div id="main2Feedback">${main2FeedbackHtml()}</div>
      <div class="section-actions">
        <span class="completion-note">Automatic checks cover IPO, sequence and code reading. Written explanations are saved for teacher review.</span>
        <button id="checkMain2" class="button primary" type="button">Check Algorithm Rescue</button>
      </div>`
    );
  }

  function main2FeedbackHtml() {
    const m = state.main2;
    if (!m.checked) return "";
    const cls = m.score >= 7 ? "success" : "warning";
    const items = Object.values(m.feedback || {}).filter(Boolean);
    return `<div class="feedback ${cls}">
      <strong>${m.score}/9 automatically checked points currently correct.</strong>
      <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p>Revise any incorrect answer, then check again. Your improved algorithm is saved as open-ended evidence.</p>
    </div>`;
  }

  function renderExtension() {
    const e = state.extension;
    return sectionShell(
      "Optional extension · Early completers",
      "Welcome Badge Upgrade",
      "Apply the same ideas with less scaffolding by designing a more useful first-day name badge model.",
      `
      <span class="optional-badge">Optional — this does not block the plenary</span>
      <div class="content-grid" style="margin-top:16px">
        <div class="card soft-blue">
          <h3>New scenario</h3>
          <p>The Year 8 welcome desk wants a digital badge that shows a student’s name and one useful welcome feature.</p>
        </div>
        <div class="card soft-amber">
          <h3>Your design decision</h3>
          <p>Choose a feature, write a precise algorithm and show an example of the output for a test student.</p>
        </div>
      </div>

      <div class="task-block">
        <div class="field">
          <label for="extensionFeature">Choose or describe one useful feature</label>
          <select id="extensionFeature">
            <option value="">Choose a feature</option>
            ${option("house", "Display the student's school house", e.feature)}
            ${option("welcome", "Display a Year 8 welcome message", e.feature)}
            ${option("symbol", "Display a chosen symbol or icon", e.feature)}
            ${option("custom", "My own useful feature", e.feature)}
          </select>
        </div>
        <div class="field">
          <label for="extensionAlgorithm">Write the complete algorithm for your upgraded model</label>
          <textarea id="extensionAlgorithm" placeholder="Use numbered, ordered and precise steps">${escapeHtml(e.algorithm)}</textarea>
        </div>
        <div class="field">
          <label for="extensionOutput">Show one example output</label>
          <textarea id="extensionOutput" placeholder="Example for a test student…">${escapeHtml(e.sampleOutput)}</textarea>
        </div>
        <div class="section-actions">
          <span class="completion-note">Your extension is saved when you add meaningful work. You may continue without completing it.</span>
          <button id="saveExtension" class="button primary" type="button">Save extension work</button>
        </div>
      </div>`
    );
  }

  function renderPlenary() {
    const p = state.plenary;
    return sectionShell(
      "Plenary · 8 minutes",
      "Finish Strong, Reflect and Grow",
      "Review your first Year 8 Computer Science lesson and identify the learning habit you will use next time.",
      `
      ${imageBlock("assets/images/plenary-reflection.png", "Visual reflection prompts for the end of the first Computer Science lesson", "Plenary visual: reflect on learning, expectations, debugging and confidence")}
      <div class="task-block">
        <h3>Complete your exit reflection</h3>
        <div class="question-list">
          <div class="question-card">
            <label class="question-title" for="plenaryLearned">1. One new thing I learned today is…</label>
            <textarea id="plenaryLearned">${escapeHtml(p.learned)}</textarea>
          </div>
          <div class="question-card">
            <label class="question-title" for="plenaryExpectation">2. One CS expectation that will help me be successful is…</label>
            <textarea id="plenaryExpectation">${escapeHtml(p.expectation)}</textarea>
          </div>
          <div class="question-card">
            <label class="question-title" for="plenaryFirstAction">3. When my code does not work, my first action should be…</label>
            <textarea id="plenaryFirstAction">${escapeHtml(p.firstAction)}</textarea>
          </div>
          <fieldset class="question-card">
            <legend>4. My current confidence in Python is…</legend>
            ${confidenceOptions("plenaryConfidence", p.confidence)}
            <label for="plenaryConfidenceReason">Explain what would help you reach the next level.</label>
            <textarea id="plenaryConfidenceReason">${escapeHtml(p.confidenceReason)}</textarea>
          </fieldset>
        </div>
        <div id="plenaryFeedback">${p.submitted ? `<div class="feedback success"><strong>Plenary saved.</strong> Your review and PDF page are now available.</div>` : ""}</div>
        <div class="section-actions">
          <span class="completion-note">Write a meaningful response to every prompt.</span>
          <button id="submitPlenary" class="button primary" type="button">Submit plenary</button>
        </div>
      </div>`
    );
  }

  function renderReview() {
    const coreIncomplete = SECTIONS.filter(s => s.core && s.id !== "review" && !state.completed[s.id]);
    const extensionAttempted = state.extension.attempted;
    const generated = Boolean(state.pdfGeneratedAt);

    return sectionShell(
      "Final review",
      "Review Your Evidence",
      "Check your lesson evidence, return to anything incomplete, then export a professional PDF for Microsoft Teams.",
      `
      <div class="review-section">
        <div class="review-card">
          <h3>Student details</h3>
          <div class="review-meta">
            <span>${escapeHtml(state.student.fullName)}</span>
            <span>${escapeHtml(state.student.className)}</span>
            <span>Year 8</span><span>Week 1 Theory</span>
          </div>
        </div>

        <div class="review-card">
          <h3>Learning objectives</h3>
          ${reviewAnswer("Key Topic", LESSON.learning.topic)}
          ${reviewAnswer("WAGBA", LESSON.learning.wagba)}
          ${reviewAnswer("Knowledge", LESSON.learning.knowledge)}
          ${reviewAnswer("Skills", LESSON.learning.skills)}
          ${reviewAnswer("Understanding", LESSON.learning.understanding)}
          ${reviewAnswer("Keywords", LESSON.learning.keywords)}
          ${reviewAnswer("Challenge", LESSON.learning.challenge)}
        </div>

        <div class="review-card">
          <h3>Completion summary</h3>
          <div class="review-meta">${SECTIONS.slice(0,5).map(s => `<span>${state.completed[s.id] ? "✓" : s.optional ? "Optional" : "○"} ${escapeHtml(s.short)}</span>`).join("")}</div>
          ${coreIncomplete.length ? `<div class="feedback warning"><strong>Incomplete required sections:</strong> ${coreIncomplete.map(s => escapeHtml(s.short)).join(", ")}. Use the journey menu to return.</div>` : `<div class="feedback success"><strong>All required lesson sections are complete.</strong></div>`}
        </div>

        ${reviewStarter()}
        ${reviewMain1()}
        ${reviewMain2()}
        ${extensionAttempted ? reviewExtension() : ""}
        ${reviewPlenary()}

        <div class="review-card">
          <h3>Export and submit</h3>
          <p>Download the PDF, open it briefly to check your evidence, then submit it to Teams.</p>
          <div class="button-row">
            <button id="exportPdf" class="button primary" type="button" ${coreIncomplete.length && !teacherMode ? "disabled" : ""}>Export lesson PDF</button>
            <button id="printFallback" class="button secondary" type="button">Print-friendly fallback</button>
            <button id="resetProgress" class="button danger" type="button">Reset all progress</button>
          </div>
        </div>

        <div id="teamsInstruction" class="teams-callout ${generated ? "" : "hidden"}">
          <h3>Upload your completed PDF to the Microsoft Teams Assignment named Week 1 Theory.</h3>
          <p>Before uploading, check that your name and class are visible, the required lesson sections are included, the PDF downloaded successfully, and you are uploading the PDF rather than a screenshot.</p>
        </div>
      </div>`
    );
  }

  function reviewStarter() {
    const s = state.starter;
    return `<div class="review-card"><h3>Starter evidence</h3>
      ${reviewAnswer("Instruction order", s.order.join(" → "))}
      ${reviewAnswer("Algorithm definition", displayStarterQ2(s.q2))}
      ${reviewAnswer("Predicted Python output", s.q3)}
      ${reviewAnswer("Identified input", s.q4)}
      ${reviewAnswer("Why the instruction is unclear", s.q5)}
      ${reviewAnswer("Confidence", `${s.confidence || "Not answered"}/5 — ${s.confidenceReason}`)}
      ${reviewAnswer("Automatic check", `${s.score}/4 correct at latest check`)}
    </div>`;
  }

  function reviewMain1() {
    const m = state.main1;
    return `<div class="review-card"><h3>Main Task 1 evidence</h3>
      ${reviewAnswer("Learning-habit classifications", learningHabits.map(h => `${h.text} — ${labelClassification(m.classifications[h.id])}`).join("\n"))}
      ${reviewAnswer("Latest classification score", `${m.score}/8`)}
      ${reviewAnswer("Chosen expectations", m.commitmentChoices.join("; "))}
      ${reviewAnswer("How they will help", m.commitmentReason)}
    </div>`;
  }

  function reviewMain2() {
    const m = state.main2;
    return `<div class="review-card"><h3>Main Task 2 evidence</h3>
      ${reviewAnswer("IPO classifications", `Student name: ${m.ipo.input || "Not answered"}\nStore and create greeting: ${m.ipo.process || "Not answered"}\nGreeting and symbol: ${m.ipo.output || "Not answered"}`)}
      ${reviewAnswer("Algorithm order", m.order.join(" → "))}
      ${reviewAnswer("Input line", m.codeInputLine)}
      ${reviewAnswer("Variables", m.codeVariables)}
      ${reviewAnswer("Predicted output", m.codeOutput)}
      ${reviewAnswer("Meaningful variable names", m.meaningfulName)}
      ${reviewAnswer("Improved algorithm", m.improvedAlgorithm)}
      ${reviewAnswer("Automatic check", `${m.score}/9 correct at latest check`)}
    </div>`;
  }

  function reviewExtension() {
    const e = state.extension;
    return `<div class="review-card"><h3>Optional extension</h3>
      ${reviewAnswer("Selected feature", e.feature)}
      ${reviewAnswer("Upgraded algorithm", e.algorithm)}
      ${reviewAnswer("Example output", e.sampleOutput)}
    </div>`;
  }

  function reviewPlenary() {
    const p = state.plenary;
    return `<div class="review-card"><h3>Plenary responses</h3>
      ${reviewAnswer("New learning", p.learned)}
      ${reviewAnswer("Helpful expectation", p.expectation)}
      ${reviewAnswer("First debugging action", p.firstAction)}
      ${reviewAnswer("Confidence and next step", `${p.confidence || "Not answered"}/5 — ${p.confidenceReason}`)}
    </div>`;
  }

  function reviewAnswer(label, value) {
    return `<div><strong>${escapeHtml(label)}</strong><div class="review-answer">${escapeHtml(value || "Not attempted")}</div></div>`;
  }

  function bindSectionEvents(id) {
    bindImageButtons();

    if (id === "starter") bindStarterEvents();
    if (id === "main1") bindMain1Events();
    if (id === "main2") bindMain2Events();
    if (id === "extension") bindExtensionEvents();
    if (id === "plenary") bindPlenaryEvents();
    if (id === "review") bindReviewEvents();
  }

  function bindImageButtons() {
    $$("[data-enlarge-src]").forEach(button => {
      button.addEventListener("click", () => {
        $("#dialogImage").src = button.dataset.enlargeSrc;
        $("#dialogImage").alt = button.dataset.enlargeAlt || "";
        $("#dialogCaption").textContent = button.dataset.enlargeCaption || "";
        $("#imageDialog").showModal();
      });
    });
  }

  function bindStarterEvents() {
    bindOrderButtons("starterOrder", "starter");
    $$('input[name="starterQ2"]').forEach(el => el.addEventListener("change", () => { state.starter.q2 = el.value; saveState(); }));
    $("#starterQ3").addEventListener("input", e => { state.starter.q3 = e.target.value; saveState(); });
    $("#starterQ4").addEventListener("input", e => { state.starter.q4 = e.target.value; saveState(); });
    $("#starterQ5").addEventListener("input", e => { state.starter.q5 = e.target.value; saveState(); });
    $$('input[name="starterConfidence"]').forEach(el => el.addEventListener("change", () => { state.starter.confidence = el.value; saveState(); }));
    $("#starterConfidenceReason").addEventListener("input", e => { state.starter.confidenceReason = e.target.value; saveState(); });
    $("#checkStarter").addEventListener("click", checkStarter);
  }

  function checkStarter() {
    const s = state.starter;
    const missing = [];
    if (!s.q2) missing.push("Choose the algorithm definition.");
    if (!s.q3.trim()) missing.push("Predict the Python output.");
    if (!s.q4.trim()) missing.push("Identify the input.");
    if (s.q5.trim().length < 18) missing.push("Explain why the instruction is unclear.");
    if (!s.confidence) missing.push("Choose a confidence rating.");
    if (s.confidenceReason.trim().length < 10) missing.push("Explain your confidence rating.");

    if (missing.length && !teacherMode) {
      showToast(missing[0]);
      return;
    }

    let score = 0;
    const feedback = {};
    if (arraysEqual(normaliseStarterOrder(s.order), starterOrderCorrect)) score++;
    else feedback.order = "A sensible sequence should begin by getting out of bed and finish by starting the lesson.";

    if (s.q2 === "algorithm") score++;
    else feedback.q2 = "An algorithm is a clear, ordered set of instructions used to solve a problem or complete a task.";

    if (normalise(s.q3) === "aisha") score++;
    else feedback.q3 = "The print statement displays the value stored in student_name.";

    const q4 = normalise(s.q4);
    if (q4.includes("age") || q4.includes("user") || q4.includes("typed")) score++;
    else feedback.q4 = "The input is the age entered by the user, not the word printed by the program.";

    s.score = score;
    s.feedback = feedback;
    s.checked = true;
    state.completed.starter = true;
    saveState(true);
    render();
    showToast("Starter checked and saved.");
  }

  function normaliseStarterOrder(order) {
    return order.slice();
  }

  function bindMain1Events() {
    learningHabits.forEach(habit => {
      $$(`input[name="${habit.id}"]`).forEach(el => el.addEventListener("change", () => {
        state.main1.classifications[habit.id] = el.value;
        saveState();
      }));
    });
    $$('input[name="commitmentChoice"]').forEach(el => el.addEventListener("change", () => {
      state.main1.commitmentChoices = $$('input[name="commitmentChoice"]:checked').map(i => i.value);
      saveState();
    }));
    $("#commitmentReason").addEventListener("input", e => { state.main1.commitmentReason = e.target.value; saveState(); });
    $("#checkMain1").addEventListener("click", checkMain1);
  }

  function checkMain1() {
    const m = state.main1;
    const answered = learningHabits.filter(h => m.classifications[h.id]).length;
    if (answered < learningHabits.length && !teacherMode) {
      showToast("Classify every learning habit before checking.");
      return;
    }
    if (m.commitmentChoices.length < 2 && !teacherMode) {
      showToast("Choose two learning expectations.");
      return;
    }
    if (m.commitmentReason.trim().length < 20 && !teacherMode) {
      showToast("Explain how your chosen expectations will help.");
      return;
    }

    m.score = learningHabits.filter(h => m.classifications[h.id] === h.answer).length;
    m.checked = true;
    m.feedback = Object.fromEntries(learningHabits.filter(h => m.classifications[h.id] !== h.answer).map(h => [h.id, h.feedback]));
    if (m.score >= 6 || teacherMode) state.completed.main1 = true;
    else delete state.completed.main1;
    saveState(true);
    render();
    showToast(m.score >= 6 ? "Main Task 1 completed." : "Review the feedback and try again.");
  }

  function bindMain2Events() {
    ["input", "process", "output"].forEach(key => {
      $(`#ipo_${key}`).addEventListener("change", e => { state.main2.ipo[key] = e.target.value; saveState(); });
    });
    bindOrderButtons("algorithmOrder", "algorithm");
    $("#codeInputLine").addEventListener("change", e => { state.main2.codeInputLine = e.target.value; saveState(); });
    $("#codeVariables").addEventListener("input", e => { state.main2.codeVariables = e.target.value; saveState(); });
    $("#codeOutput").addEventListener("input", e => { state.main2.codeOutput = e.target.value; saveState(); });
    $("#meaningfulName").addEventListener("input", e => { state.main2.meaningfulName = e.target.value; saveState(); });
    $("#improvedAlgorithm").addEventListener("input", e => { state.main2.improvedAlgorithm = e.target.value; saveState(); });
    $("#checkMain2").addEventListener("click", checkMain2);
  }

  function checkMain2() {
    const m = state.main2;
    const missing = [];
    if (!m.ipo.input || !m.ipo.process || !m.ipo.output) missing.push("Complete all three IPO classifications.");
    if (!m.codeInputLine) missing.push("Choose the line that collects input.");
    if (!m.codeVariables.trim()) missing.push("Identify the variables.");
    if (!m.codeOutput.trim()) missing.push("Predict the output.");
    if (m.meaningfulName.trim().length < 18) missing.push("Explain why a meaningful variable name helps.");
    if (m.improvedAlgorithm.trim().length < 45) missing.push("Write a clearer and more precise algorithm.");
    if (missing.length && !teacherMode) {
      showToast(missing[0]);
      return;
    }

    let score = 0;
    const feedback = {};

    if (m.ipo.input === "Input") score++; else feedback.ipoInput = "The student’s typed name is the Input.";
    if (m.ipo.process === "Process") score++; else feedback.ipoProcess = "Storing the name and creating the greeting are the Process.";
    if (m.ipo.output === "Output") score++; else feedback.ipoOutput = "The displayed greeting and symbol are the Output.";

    if (arraysEqual(m.order, algorithmOrderCorrect)) score += 2;
    else feedback.order = "The algorithm should start, collect and store the name, create the greeting, display it, then end.";

    if (m.codeInputLine === "1") score++; else feedback.inputLine = "Line 1 uses input(), so it collects data from the user.";

    const vars = normalise(m.codeVariables);
    if (vars.includes("student_name") && vars.includes("greeting")) score++;
    else feedback.variables = "The two variables are student_name and greeting.";

    const output = normalise(m.codeOutput).replace(/[!,.]/g, "");
    if (output.includes("hello daniel")) score++;
    else feedback.output = "The greeting combines the word Hello with the name Daniel.";

    if (m.meaningfulName.trim().length >= 18) score++;

    m.score = score;
    m.feedback = feedback;
    m.checked = true;
    if (score >= 7 || teacherMode) state.completed.main2 = true;
    else delete state.completed.main2;
    saveState(true);
    render();
    showToast(score >= 7 ? "Algorithm Rescue completed." : "Use the feedback and check again.");
  }

  function bindExtensionEvents() {
    $("#extensionFeature").addEventListener("change", e => { state.extension.feature = e.target.value; updateExtensionAttempted(); });
    $("#extensionAlgorithm").addEventListener("input", e => { state.extension.algorithm = e.target.value; updateExtensionAttempted(); });
    $("#extensionOutput").addEventListener("input", e => { state.extension.sampleOutput = e.target.value; updateExtensionAttempted(); });
    $("#saveExtension").addEventListener("click", () => {
      updateExtensionAttempted(true);
      showToast(state.extension.attempted ? "Optional extension saved." : "Add more detail before saving the extension.");
      renderNavigation();
    });
  }

  function updateExtensionAttempted(force = false) {
    const e = state.extension;
    e.attempted = Boolean(e.feature || e.algorithm.trim().length >= 25 || e.sampleOutput.trim().length >= 10);
    if (e.attempted) state.completed.extension = true;
    else delete state.completed.extension;
    saveState(force);
  }

  function bindPlenaryEvents() {
    $("#plenaryLearned").addEventListener("input", e => { state.plenary.learned = e.target.value; saveState(); });
    $("#plenaryExpectation").addEventListener("input", e => { state.plenary.expectation = e.target.value; saveState(); });
    $("#plenaryFirstAction").addEventListener("input", e => { state.plenary.firstAction = e.target.value; saveState(); });
    $$('input[name="plenaryConfidence"]').forEach(el => el.addEventListener("change", () => { state.plenary.confidence = el.value; saveState(); }));
    $("#plenaryConfidenceReason").addEventListener("input", e => { state.plenary.confidenceReason = e.target.value; saveState(); });
    $("#submitPlenary").addEventListener("click", submitPlenary);
  }

  function submitPlenary() {
    const p = state.plenary;
    const fields = [
      [p.learned, 16, "Explain one new thing you learned."],
      [p.expectation, 16, "Explain one helpful CS expectation."],
      [p.firstAction, 16, "Explain your first action when code does not work."],
      [p.confidence, 1, "Choose a confidence rating."],
      [p.confidenceReason, 14, "Explain what will help you improve."]
    ];
    const missing = fields.find(([value, min]) => String(value || "").trim().length < min);
    if (missing && !teacherMode) {
      showToast(missing[2]);
      return;
    }
    p.submitted = true;
    state.completed.plenary = true;
    saveState(true);
    render();
    showToast("Plenary submitted. Review unlocked.");
  }

  function bindReviewEvents() {
    $("#exportPdf").addEventListener("click", exportPdf);
    $("#printFallback").addEventListener("click", printFallback);
    $("#resetProgress").addEventListener("click", () => {
      if (!confirm("Permanently delete all lesson progress for this student?")) return;
      localStorage.removeItem(STORAGE_KEY);
      location.href = location.pathname + (teacherMode ? "?teacher=1" : "");
    });
  }

  function bindOrderButtons(listId, type) {
    const list = $(`#${listId}`);
    list.querySelectorAll("[data-order-action]").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const direction = button.dataset.orderAction;
        const arr = type === "starter" ? state.starter.order : state.main2.order;
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= arr.length) return;
        [arr[index], arr[target]] = [arr[target], arr[index]];
        saveState();
        renderSection();
      });
    });
  }

  function renderOrderItems(items, type) {
    return items.map((item, index) => `<li class="order-item">
      <span class="order-number">${index + 1}</span>
      <span>${escapeHtml(item)}</span>
      <span class="order-controls">
        <button type="button" data-order-action="up" data-index="${index}" aria-label="Move ${escapeAttr(item)} up" ${index === 0 ? "disabled" : ""}>↑</button>
        <button type="button" data-order-action="down" data-index="${index}" aria-label="Move ${escapeAttr(item)} down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
      </span>
    </li>`).join("");
  }

  function radioChoice(name, value, label, selected) {
    return `<label class="choice"><input type="radio" name="${name}" value="${value}" ${selected === value ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
  }

  function segmentedChoice(name, value, label, selected) {
    return `<label><input type="radio" name="${name}" value="${value}" ${selected === value ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
  }

  function commitmentCheckbox(value, selected) {
    return `<label class="choice"><input type="checkbox" name="commitmentChoice" value="${escapeAttr(value)}" ${selected.includes(value) ? "checked" : ""}><span>${escapeHtml(value)}</span></label>`;
  }

  function confidenceOptions(name, selected) {
    return `<div class="confidence-row">${[1,2,3,4,5].map(n => `<label class="confidence-option"><input type="radio" name="${name}" value="${n}" ${String(selected) === String(n) ? "checked" : ""}><span>${n}</span></label>`).join("")}</div>`;
  }

  function ipoSelect(key, statement, selected) {
    return `<div class="ipo-card"><strong>${escapeHtml(statement)}</strong>
      <select id="ipo_${key}" aria-label="Classify ${escapeAttr(statement)}">
        <option value="">Choose IPO role</option>
        ${option("Input", "Input", selected)}
        ${option("Process", "Process", selected)}
        ${option("Output", "Output", selected)}
      </select>
    </div>`;
  }

  function option(value, label, selected) {
    return `<option value="${escapeAttr(value)}" ${String(value) === String(selected) ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }

  function displayStarterQ2(value) {
    return ({ algorithm: "A clear, ordered set of instructions", guess: "A random guess made by a computer", screen: "The screen used to display a program" })[value] || "Not answered";
  }

  function labelClassification(value) {
    return ({ helps: "Helps learning", stops: "Stops learning", depends: "Depends on how it is used" })[value] || "Not answered";
  }

  function normalise(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  function formatDateTime(value) {
    if (!value) return "unknown time";
    return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function safeFilenamePart(value) {
    return String(value || "").trim().replace(/\s+/g, "_").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 45) || "Student";
  }

  function pdfFilename() {
    return `Year8_${safeFilenamePart(state.student.className)}_${safeFilenamePart(state.student.fullName)}_Week1_Theory.pdf`;
  }

  function exportPdf() {
    try {
      const sections = buildPdfSections();
      const bytes = createSimplePdf(sections);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = pdfFilename();
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);

      state.pdfGeneratedAt = new Date().toISOString();
      saveState(true);
      $("#teamsInstruction").classList.remove("hidden");
      showToast("PDF generated. Check your Downloads folder.");
    } catch (error) {
      console.error(error);
      showToast("Direct PDF export was blocked. Use the print-friendly fallback.");
    }
  }

  function buildPdfSections() {
    const s = state.starter, m1 = state.main1, m2 = state.main2, e = state.extension, p = state.plenary;
    const sections = [
      { type: "title", text: `${LESSON.school}\n${LESSON.year} Computer Science | Week ${LESSON.week} Theory\n${LESSON.title}` },
      { type: "meta", text: `Date: ${new Date().toLocaleDateString()}\nStudent: ${state.student.fullName}\nClass: ${state.student.className}\nStarted: ${formatDateTime(state.startedAt)}` },
      { type: "heading", text: "Learning Information" },
      { type: "body", text:
        `Key Topic: ${LESSON.learning.topic}\nWAGBA: ${LESSON.learning.wagba}\nKnowledge: ${LESSON.learning.knowledge}\nSkills: ${LESSON.learning.skills}\nUnderstanding: ${LESSON.learning.understanding}\nKeywords: ${LESSON.learning.keywords}\nChallenge: ${LESSON.learning.challenge}` },

      { type: "heading", text: "Starter: What Do You Remember?" },
      { type: "body", text:
        `Instruction order: ${s.order.join(" -> ")}\nAlgorithm definition: ${displayStarterQ2(s.q2)}\nPredicted output: ${s.q3}\nIdentified input: ${s.q4}\nWhy the instruction is unclear: ${s.q5}\nConfidence: ${s.confidence}/5\nConfidence explanation: ${s.confidenceReason}\nLatest automatic score: ${s.score}/4` },

      { type: "heading", text: "Main Task 1: How We Learn in Computer Science" },
      { type: "body", text:
        `${learningHabits.map(h => `${h.text} — ${labelClassification(m1.classifications[h.id])}`).join("\n")}\n\nLatest classification score: ${m1.score}/8\nChosen expectations: ${m1.commitmentChoices.join("; ")}\nHow they will help: ${m1.commitmentReason}` },

      { type: "heading", text: "Main Task 2: Algorithm Rescue" },
      { type: "body", text:
        `IPO: typed name = ${m2.ipo.input}; create greeting = ${m2.ipo.process}; displayed greeting = ${m2.ipo.output}\nAlgorithm order: ${m2.order.join(" -> ")}\nInput line: ${m2.codeInputLine}\nVariables: ${m2.codeVariables}\nPredicted output: ${m2.codeOutput}\nWhy meaningful names help: ${m2.meaningfulName}\nImproved algorithm:\n${m2.improvedAlgorithm}\nLatest automatic score: ${m2.score}/9` }
    ];

    if (e.attempted) {
      sections.push(
        { type: "heading", text: "Optional Extension: Welcome Badge Upgrade" },
        { type: "body", text: `Feature: ${e.feature}\nAlgorithm:\n${e.algorithm}\nExample output:\n${e.sampleOutput}` }
      );
    }

    sections.push(
      { type: "heading", text: "Plenary Reflection" },
      { type: "body", text:
        `One new thing learned: ${p.learned}\nHelpful CS expectation: ${p.expectation}\nFirst action when code does not work: ${p.firstAction}\nConfidence: ${p.confidence}/5\nNext step: ${p.confidenceReason}` },
      { type: "heading", text: "Completion Summary" },
      { type: "body", text:
        `${SECTIONS.slice(0,5).map(sec => `${sec.short}: ${state.completed[sec.id] ? "Completed" : sec.optional ? "Not attempted (optional)" : "Incomplete"}`).join("\n")}\n\nTeams submission: Upload this PDF to the Microsoft Teams Assignment named Week 1 Theory.` }
    );
    return sections;
  }

  // Dependency-free, client-side PDF generator using standard PDF fonts.
  function createSimplePdf(sections) {
    const PAGE_W = 595.28, PAGE_H = 841.89;
    const marginX = 46, top = 790, bottom = 52;
    const pages = [];
    let commands = [];
    let y = top;

    function addPage() {
      if (commands.length) pages.push(commands);
      commands = [];
      y = top;
    }

    function addRule() {
      commands.push(`0.83 0.85 0.90 RG 0.7 w ${marginX} ${y - 4} m ${PAGE_W - marginX} ${y - 4} l S`);
      y -= 14;
    }

    function addText(text, font, size, leading, color = "0.10 0.14 0.22") {
      const maxWidth = PAGE_W - marginX * 2;
      const approxChars = Math.max(25, Math.floor(maxWidth / (size * 0.52)));
      const paragraphs = asciiText(text).split("\n");
      const lines = [];
      paragraphs.forEach((para) => {
        if (!para.trim()) { lines.push(""); return; }
        lines.push(...wrapWords(para, approxChars));
      });

      for (const line of lines) {
        if (y < bottom + leading) addPage();
        const safe = pdfEscape(line);
        commands.push(`BT ${color} rg /${font} ${size} Tf 1 0 0 1 ${marginX} ${y} Tm (${safe}) Tj ET`);
        y -= leading;
      }
    }

    sections.forEach((section, idx) => {
      if (section.type === "title") {
        addText(section.text, "F2", 18, 23, "0.18 0.10 0.43");
        addRule();
      } else if (section.type === "meta") {
        addText(section.text, "F1", 10, 14, "0.30 0.34 0.42");
        y -= 4;
      } else if (section.type === "heading") {
        if (y < 110) addPage();
        y -= idx ? 8 : 0;
        addText(section.text, "F2", 13, 18, "0.18 0.10 0.43");
        addRule();
      } else {
        addText(section.text, "F1", 10, 14);
        y -= 6;
      }
    });
    if (commands.length) pages.push(commands);

    const objects = [];
    const addObject = (content) => { objects.push(content); return objects.length; };

    const catalogId = addObject("");
    const pagesId = addObject("");
    const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

    const pageIds = [];
    pages.forEach((pageCommands, index) => {
      const footer = `BT 0.40 0.43 0.50 rg /F1 8 Tf 1 0 0 1 ${PAGE_W - 90} 28 Tm (Page ${index + 1} of ${pages.length}) Tj ET`;
      const stream = pageCommands.join("\n") + "\n" + footer;
      const streamId = addObject(`<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`);
      const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${streamId} 0 R >>`);
      pageIds.push(pageId);
    });

    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] >>`;

    let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const offsets = [0];
    objects.forEach((obj, index) => {
      offsets.push(byteLength(pdf));
      pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
    });
    const xrefOffset = byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new TextEncoder().encode(pdf);
  }

  function asciiText(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .replace(/[^\x20-\x7E\n]/g, char => ({
        "→": "->", "–": "-", "—": "-", "’": "'", "“": '"', "”": '"', "✓": "Completed", "○": "Incomplete"
      })[char] || "");
  }

  function wrapWords(text, maxChars) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach(word => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function pdfEscape(text) {
    return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  function byteLength(text) {
    return new TextEncoder().encode(text).length;
  }

  function printFallback() {
    let printDoc = $("#safePrintDocument");
    if (!printDoc) {
      printDoc = document.createElement("article");
      printDoc.id = "safePrintDocument";
      document.body.appendChild(printDoc);
    }
    printDoc.innerHTML = buildPrintDocument();
    setTimeout(() => window.print(), 120);
  }

  function buildPrintDocument() {
    return `<h1>${escapeHtml(LESSON.school)}</h1>
      <p><strong>${LESSON.year} Computer Science · Week ${LESSON.week} Theory</strong><br>${escapeHtml(LESSON.title)}<br>
      Student: ${escapeHtml(state.student.fullName)} · Class: ${escapeHtml(state.student.className)} · Date: ${escapeHtml(new Date().toLocaleDateString())}</p>
      ${buildPdfSections().filter(s => s.type !== "title" && s.type !== "meta").map(section => {
        if (section.type === "heading") return `<h2>${escapeHtml(section.text)}</h2>`;
        return `<div class="print-block"><div class="print-answer">${escapeHtml(section.text)}</div></div>`;
      }).join("")}`;
  }

  init();
})();
