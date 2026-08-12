(() => {
  "use strict";

  const LESSON_ID = "w02s03-input-arithmetic-conversion-v1";
  const DB_NAME = "OxfordAQA9210Evidence";
  const DB_STORE = "images";
  const stepNames = ["Starter", "Main Activity 1", "Main Activity 2", "Extension", "Plenary & export"];
  const extensionTasks = [
    {
      title: "Age next year",
      level: "Create · AO1/AO2",
      brief: "Ask the user for their age as a whole number. Calculate and display their age next year with a clear label.",
      sample: "Enter your age: 14\nAge next year: 15",
      hint: "Convert the result of input() using int() before adding 1.",
      explanation: "Why is int() more suitable than float() for this version of the task?"
    },
    {
      title: "Rectangle perimeter",
      level: "Apply · AO2",
      brief: "Ask for a rectangle's length and width as decimal values. Calculate and print the perimeter.",
      sample: "Length: 5.5\nWidth: 3\nPerimeter: 17.0",
      hint: "Use float() and the formula 2 * (length + width).",
      prediction: true
    },
    {
      title: "Three-item total",
      level: "Scenario · AO2",
      brief: "Ask for the prices of three items. Accept decimal prices and display their total with a clear label.",
      sample: "Item 1: 2.50\nItem 2: 3.25\nItem 3: 1.00\nTotal: 6.75",
      hint: "Convert each keyboard entry with float(), then add the three variables."
    },
    {
      title: "Seconds converter",
      level: "Apply · AO2/AO3",
      brief: "Ask for a whole number of seconds. Display the complete minutes and the remaining seconds.",
      sample: "Total seconds: 145\nComplete minutes: 2\nSeconds remaining: 25",
      hint: "Use // 60 for complete minutes and % 60 for remaining seconds.",
      explanation: "Explain the different jobs performed by // and %."
    },
    {
      title: "Days into weeks",
      level: "Apply · AO2",
      brief: "Ask for a whole number of days. Display complete weeks and remaining days.",
      sample: "Total days: 24\nComplete weeks: 3\nDays remaining: 3",
      hint: "A week contains 7 days. Consider creating DAYS_PER_WEEK = 7."
    },
    {
      title: "Share the sweets",
      level: "Scenario · AO2",
      brief: "Ask for the number of sweets and the number of students. Display how many sweets each student receives and how many remain.",
      sample: "Sweets: 53\nStudents: 8\nEach student: 6\nLeft over: 5",
      hint: "The divisor is the number of students. Use integer division and remainder.",
      prediction: true
    },
    {
      title: "Pence into pounds",
      level: "Scenario · AO2",
      brief: "Ask for a whole number of pence. Display complete pounds and remaining pence.",
      sample: "Total pence: 1267\nPounds: 12\nPence remaining: 67",
      hint: "Create PENCE_PER_POUND = 100, then use // and %."
    },
    {
      title: "Repair the decimal-price program",
      level: "Debug · AO3",
      brief: "Repair this idea: price = int(input(...)); total = price + 2.50. The user must be allowed to enter 4.99. Write and test the corrected program.",
      sample: "Price: 4.99\nTotal with charge: 7.49",
      hint: "The price may contain a decimal part. Choose the conversion that preserves it.",
      explanation: "Explain what would go wrong with int() for an entry such as 4.99."
    },
    {
      title: "Remove the magic number",
      level: "Refactor · AO3",
      brief: "Improve a time converter that uses // 60 and % 60 by creating and using a meaningful constant instead of repeating 60.",
      sample: "MINUTES_PER_HOUR = 60",
      hint: "Use the constant in both calculations.",
      explanation: "Give one maintainability benefit of the constant."
    },
    {
      title: "Mini-project: event duration",
      level: "Independent · AO2/AO3",
      brief: "Ask for an event name and its duration in total minutes. Convert the duration into complete hours and remaining minutes. Print a clearly labelled summary. Use a constant and meaningful identifiers, then test at least three values.",
      sample: "Event: Coding Workshop\nDuration: 185 minutes\nComplete hours: 3\nMinutes remaining: 5",
      hint: "Plan the input, conversion, constant, two calculations and four labelled output lines before coding.",
      prediction: true,
      explanation: "Describe your three tests and explain why each was useful."
    }
  ];

  const starterRequired = ["s_stored", "s_type", "s_error_line", "s_error_reason", "s_conversion"];
  const main1Required = ["m1_names", "m1_predict", "m1_type", "m1_mismatch", "m1_error", "m1_test35", "m1_test1999", "m1_paper2", "m1_code"];
  const main2Required = ["m2_operator_hours", "m2_operator_remaining", "m2_aqa_terms", "m2_operator_explain", "m2_constant", "m2_variables", "m2_predict220", "m2_int_reason", "m2_test220", "m2_test60", "m2_test59", "m2_test0", "m2_code", "m2_paper2"];
  const plenaryRequired = ["p_type_text", "p_type_number", "p_outputs", "p_groups_mean", "p_remainder_mean", "p_int_reason", "p_wagba", "p_papers", "p_support"];
  const coreRequired = [...starterRequired, ...main1Required, ...main2Required, ...plenaryRequired];
  const requiredByStep = {0: starterRequired, 1: main1Required, 2: main2Required, 3: [], 4: plenaryRequired};
  const sectionKeys = ["main1", "main2", "extension"];
  let state = {owner: "", profile: {name: "", className: "", teacher: false}, currentStep: 0, fields: {}};
  let dbPromise;
  let titleBeforePrint = document.title;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safe = value => value == null ? "" : String(value);
  const escapeHtml = value => safe(value).replace(/[&<>"]/g, character => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;"})[character]);
  const slug = value => safe(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
  const ownerFor = (name, className, teacher) => teacher ? "teacher-preview-w02s03" : `w02s03-${slug(name)}-${slug(className)}`;
  const stateKey = owner => `${LESSON_ID}:${owner}`;
  const suggestedFilename = () => `W02S03_${(state.profile.name.split(/\s+/)[0] || "Firstname").replace(/[^a-z0-9_-]/gi, "")}_${(state.profile.className || "Class").replace(/[^a-z0-9_-]/gi, "")}.pdf`;

  function renderExtensions() {
    const holder = $("#extensionChallenges");
    extensionTasks.forEach((task, index) => {
      const number = index + 1;
      const article = document.createElement("article");
      article.className = "challenge-card";
      article.innerHTML = `<header><span class="challenge-number">${number}</span><div><h2>${escapeHtml(task.title)}</h2><span class="challenge-level">${escapeHtml(task.level)}</span></div></header><p>${escapeHtml(task.brief)}</p><div class="sample">${escapeHtml(task.sample)}</div><details><summary>Show a hint</summary>${escapeHtml(task.hint)}</details>${task.prediction ? `<label class="question-label" for="e${number}_prediction">Prediction or plan before running</label><textarea id="e${number}_prediction" data-field="e${number}_prediction" data-label="Extension ${number} - prediction or plan"></textarea>` : ""}<label class="question-label" for="e${number}_code">Your final tested code</label><textarea id="e${number}_code" class="code-entry" data-field="e${number}_code" data-label="Extension ${number} - ${escapeHtml(task.title)} code" data-report-type="code" spellcheck="false"></textarea>${task.explanation ? `<label class="question-label" for="e${number}_explain">${escapeHtml(task.explanation)}</label><textarea id="e${number}_explain" data-field="e${number}_explain" data-label="Extension ${number} - explanation"></textarea>` : ""}`;
      holder.append(article);
    });
  }

  function saveState() {
    if (!state.owner) return;
    localStorage.setItem(stateKey(state.owner), JSON.stringify(state));
    $("#saveState").textContent = "Saved on this device";
    window.clearTimeout(saveState.timer);
    saveState.timer = window.setTimeout(() => { $("#saveState").textContent = "All changes saved"; }, 500);
  }

  function loadState(owner, profile) {
    try {
      const loaded = JSON.parse(localStorage.getItem(stateKey(owner)) || "null");
      if (loaded && loaded.fields) return {...loaded, owner, profile};
    } catch (error) {
      console.warn("Saved lesson state could not be read.", error);
    }
    return {owner, profile, currentStep: 0, fields: {}};
  }

  function applyState() {
    $$('[data-field]').forEach(element => { element.value = state.fields[element.dataset.field] ?? ""; });
    $("#profileLabel").textContent = state.profile.teacher ? "Teacher preview" : `${state.profile.name} · ${state.profile.className}`;
    $("#filenamePreview").textContent = suggestedFilename();
  }

  function startLesson(name, className) {
    const teacher = name.trim().toLowerCase() === "teacher";
    const profile = {name: teacher ? "Teacher Preview" : name, className: teacher ? "" : className, teacher};
    const owner = ownerFor(name, className, teacher);
    state = loadState(owner, profile);
    localStorage.setItem(`${LESSON_ID}:lastProfile`, JSON.stringify({name, className}));
    applyState();
    $("#landing").classList.add("hidden");
    $("#app").classList.remove("hidden");
    $("#reviewBanner").classList.toggle("hidden", !teacher);
    goToStep(state.currentStep || 0, false);
    refreshEvidenceLists();
    saveState();
  }

  function showSavedProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem(`${LESSON_ID}:lastProfile`) || "null");
      if (!profile || !profile.name) return;
      const box = $("#savedProfile");
      box.classList.remove("hidden");
      box.innerHTML = `Continue as <strong>${escapeHtml(profile.name)}</strong>${profile.className ? ` · ${escapeHtml(profile.className)}` : ""}<br>`;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Use saved profile";
      button.addEventListener("click", () => { $("#studentName").value = profile.name; $("#studentClass").value = profile.className || ""; });
      box.append(button);
    } catch (error) {
      console.warn("Saved profile could not be read.", error);
    }
  }

  function goToStep(value, scroll = true) {
    const next = Math.max(0, Math.min(stepNames.length - 1, Number(value) || 0));
    state.currentStep = next;
    $$('.activity-step').forEach(section => section.classList.toggle("active", Number(section.dataset.step) === next));
    $$('.step-button').forEach(button => button.classList.toggle("active", Number(button.dataset.step) === next));
    $("#stepIndicator").textContent = `${stepNames[next]} · Page ${next + 1} of ${stepNames.length}`;
    saveState();
    updateProgress();
    if (scroll) window.scrollTo({top: 0, behavior: "smooth"});
  }

  function updateProgress() {
    const completed = coreRequired.filter(key => safe(state.fields[key]).trim()).length;
    const percent = Math.round(completed / coreRequired.length * 100);
    $("#progressBar").style.width = `${percent}%`;
    $("#progressText").textContent = `${percent}% complete · ${coreRequired.length - completed} core answers left`;
    $$('.step-button').forEach((button, index) => {
      const keys = requiredByStep[index];
      const complete = index === 3
        ? Object.keys(state.fields).some(key => /^e\d+_code$/.test(key) && safe(state.fields[key]).trim())
        : keys.every(key => safe(state.fields[key]).trim());
      button.classList.toggle("done", complete);
      $(".step-number", button).textContent = complete ? "✓" : String(index + 1);
    });
  }

  function bindPersistence() {
    $$('[data-field]').forEach(element => {
      const save = () => {
        state.fields[element.dataset.field] = element.value;
        saveState();
        updateProgress();
      };
      element.addEventListener("input", save);
      element.addEventListener("change", save);
    });
  }

  async function copyCode(id, button) {
    const code = document.getElementById(id)?.innerText || "";
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      const helper = document.createElement("textarea");
      helper.value = code;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    const old = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => { button.textContent = old; }, 1100);
  }

  function openDatabase() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        const store = db.createObjectStore(DB_STORE, {keyPath: "id"});
        store.createIndex("owner", "owner", {unique: false});
        store.createIndex("ownerSection", ["owner", "section"], {unique: false});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function recordsFor(section) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).index("ownerSection").getAll([state.owner, section]);
      request.onsuccess = () => resolve(request.result.sort((a, b) => a.created - b.created));
      request.onerror = () => reject(request.error);
    });
  }

  async function putRecord(record) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      transaction.objectStore(DB_STORE).put(record);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function deleteRecord(id) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      transaction.objectStore(DB_STORE).delete(id);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function clearOwnerEvidence() {
    const db = await openDatabase();
    const records = await new Promise((resolve, reject) => {
      const request = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).index("owner").getAll(state.owner);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DB_STORE, "readwrite");
      records.forEach(record => transaction.objectStore(DB_STORE).delete(record.id));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  }

  function imageFromFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image could not be opened")); };
      image.src = url;
    });
  }

  async function compressImage(file) {
    const image = await imageFromFile(file);
    const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", .9);
  }

  async function addEvidence(section, files) {
    for (const file of [...files].filter(item => item && item.type.startsWith("image/"))) {
      await putRecord({
        id: `${state.owner}:${section}:${Date.now()}:${Math.random().toString(36).slice(2)}`,
        owner: state.owner,
        section,
        name: file.name || "Pasted screenshot",
        dataUrl: await compressImage(file),
        created: Date.now()
      });
    }
    await renderEvidence(section);
  }

  async function renderEvidence(section) {
    const list = $(`[data-evidence-list="${section}"]`);
    if (!list || !state.owner) return;
    list.innerHTML = "";
    for (const record of await recordsFor(section)) {
      const item = document.createElement("div");
      item.className = "evidence-item";
      const image = document.createElement("img");
      image.src = record.dataUrl;
      image.alt = `Evidence: ${record.name}`;
      const caption = document.createElement("div");
      caption.className = "evidence-caption";
      const name = document.createElement("span");
      name.textContent = record.name;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", async () => { await deleteRecord(record.id); await renderEvidence(section); });
      caption.append(name, remove);
      item.append(image, caption);
      list.append(item);
    }
  }

  async function refreshEvidenceLists() {
    if (!state.owner) return;
    for (const section of sectionKeys) await renderEvidence(section);
  }

  function bindEvidence() {
    $$('[data-evidence-input]').forEach(input => input.addEventListener("change", async () => {
      await addEvidence(input.dataset.evidenceInput, input.files);
      input.value = "";
    }));
    $$('[data-evidence-zone]').forEach(zone => {
      const section = zone.dataset.evidenceZone;
      ["dragenter", "dragover"].forEach(name => zone.addEventListener(name, event => { event.preventDefault(); zone.classList.add("dragging"); }));
      ["dragleave", "drop"].forEach(name => zone.addEventListener(name, event => { event.preventDefault(); zone.classList.remove("dragging"); }));
      zone.addEventListener("drop", event => addEvidence(section, event.dataTransfer.files));
      zone.addEventListener("paste", event => {
        const files = [...event.clipboardData.items].filter(item => item.kind === "file" && item.type.startsWith("image/")).map(item => item.getAsFile()).filter(Boolean);
        if (files.length) { event.preventDefault(); addEvidence(section, files); }
      });
    });
  }

  function reportEntry(label, value, type) {
    const wrapper = document.createElement("section");
    wrapper.className = "report-entry";
    const heading = document.createElement("h3");
    heading.textContent = label;
    const content = type === "code" ? document.createElement("pre") : document.createElement("p");
    if (type === "code") content.className = "report-code";
    content.textContent = safe(value).trim() || "Not completed";
    wrapper.append(heading, content);
    return wrapper;
  }

  async function buildReport() {
    saveState();
    const report = $("#printReport");
    report.innerHTML = "";
    const done = coreRequired.filter(key => safe(state.fields[key]).trim()).length;
    const header = document.createElement("header");
    header.className = "report-page-header";
    header.innerHTML = `<p>OxfordAQA International GCSE Computer Science 9210</p><h1>Week 2 Session 3 - Input, Arithmetic and Conversion</h1><div class="report-meta"><p><strong>Student:</strong> ${escapeHtml(state.profile.name)}</p><p><strong>Class:</strong> ${escapeHtml(state.profile.className)}</p><p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p><p><strong>Filename:</strong> ${escapeHtml(suggestedFilename())}</p></div><p class="report-progress">Core response completion: ${done} of ${coreRequired.length}</p><div class="report-ksu"><p><strong>Objective:</strong> Create, run and explain a Python program that accepts user input, converts it into a suitable data type, performs arithmetic and displays clearly labelled output.</p><p><strong>WAGBA:</strong> Converting user input into usable data and selecting the correct arithmetic operator to produce accurate output.</p><p><strong>Knowledge:</strong> input(), print(), int(), float(), real division, integer division and remainder.</p><p><strong>Skills:</strong> Predict, convert, calculate, write, run, test and debug.</p><p><strong>Understanding:</strong> The problem determines the data type and operator; quotient and remainder answer different questions.</p><p><strong>AOs:</strong> AO1 recall · AO2 application · AO3 programming, testing and explanation.</p></div>`;
    report.append(header);

    for (const section of $$('.activity-step')) {
      const printable = document.createElement("section");
      printable.className = "report-section";
      const title = document.createElement("h2");
      title.textContent = section.dataset.reportTitle;
      printable.append(title);
      for (const field of $$('[data-field]', section)) {
        printable.append(reportEntry(field.dataset.label || field.id, state.fields[field.dataset.field], field.dataset.reportType));
      }
      const evidenceSection = section.dataset.sectionKey;
      if (sectionKeys.includes(evidenceSection)) {
        const records = await recordsFor(evidenceSection);
        if (!records.length) printable.append(reportEntry("Evidence images", "No image submitted"));
        for (const [index, record] of records.entries()) {
          const figure = document.createElement("figure");
          figure.className = "report-evidence";
          const image = document.createElement("img");
          image.src = record.dataUrl;
          image.alt = `Evidence image ${index + 1}`;
          const caption = document.createElement("figcaption");
          caption.textContent = `${section.dataset.reportTitle} - ${record.name}`;
          figure.append(image, caption);
          printable.append(figure);
        }
      }
      report.append(printable);
    }

    const teams = document.createElement("section");
    teams.className = "teams-report";
    teams.innerHTML = `<h2>Microsoft Teams submission</h2><ol><li>In the print window choose <strong>Save as PDF</strong>.</li><li>Save this report as <strong>${escapeHtml(suggestedFilename())}</strong>.</li><li>Open the PDF and check that all answers, code and evidence images are visible.</li><li>Open the correct Microsoft Teams assignment.</li><li>Select <strong>Add work</strong>, then <strong>Upload from this device</strong>.</li><li>Select this PDF, check that it has attached, and select <strong>Turn in</strong>.</li></ol><p>If anything is missing, cancel, return to the relevant lesson page, and export again.</p>`;
    report.append(teams);
    await Promise.all($$("img", report).map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; })));
  }

  async function exportPdf() {
    const button = document.activeElement;
    if (button instanceof HTMLButtonElement) {
      button.disabled = true;
      button.dataset.old = button.textContent;
      button.textContent = "Preparing every section…";
    }
    try {
      await buildReport();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      titleBeforePrint = document.title;
      document.title = suggestedFilename().replace(/\.pdf$/i, "");
      window.print();
    } finally {
      if (button instanceof HTMLButtonElement) {
        button.disabled = false;
        button.textContent = button.dataset.old || "Export complete PDF";
      }
    }
  }

  function fillTeacherSamples() {
    $$('[data-field]').forEach(field => {
      const key = field.dataset.field;
      const sample = field.dataset.reportType === "code"
        ? "# Teacher preview sample\nMINUTES_PER_HOUR = 60\ntotal_minutes = int(input(\"Minutes: \"))\nprint(total_minutes // MINUTES_PER_HOUR)\nprint(total_minutes % MINUTES_PER_HOUR)"
        : `Teacher preview response for: ${field.dataset.label || field.id}`;
      field.value = sample;
      state.fields[key] = sample;
    });
    applyState();
    saveState();
    updateProgress();
  }

  async function clearCurrentProfile() {
    if (!window.confirm("Clear all saved responses and evidence for this profile?")) return;
    localStorage.removeItem(stateKey(state.owner));
    await clearOwnerEvidence();
    const profile = state.profile;
    const owner = state.owner;
    state = {owner, profile, currentStep: 0, fields: {}};
    $$('[data-field]').forEach(field => { field.value = ""; });
    await refreshEvidenceLists();
    goToStep(0);
    saveState();
  }

  function exitToLanding() {
    saveState();
    $("#app").classList.add("hidden");
    $("#landing").classList.remove("hidden");
    $("#studentName").value = state.profile.teacher ? "" : state.profile.name;
    $("#studentClass").value = state.profile.teacher ? "" : state.profile.className;
    showSavedProfile();
  }

  function openVisual(figure) {
    const image = $("img", figure);
    $("#modalImage").src = image.src;
    $("#modalImage").alt = image.alt;
    $("#imageModal").classList.remove("hidden");
    $("#closeModal").focus();
  }

  function closeVisual() {
    $("#imageModal").classList.add("hidden");
    $("#modalImage").src = "";
  }

  function bindEvents() {
    $("#entryForm").addEventListener("submit", event => {
      event.preventDefault();
      const name = $("#studentName").value.trim();
      const className = $("#studentClass").value.trim();
      const teacher = name.toLowerCase() === "teacher";
      if (!name || (!teacher && !className)) {
        $("#entryError").textContent = "Enter your name and class. Teacher preview only requires the name teacher.";
        return;
      }
      $("#entryError").textContent = "";
      startLesson(name, className);
    });
    $$('.step-button').forEach(button => button.addEventListener("click", () => goToStep(button.dataset.step)));
    $$('.next-step').forEach(button => button.addEventListener("click", () => goToStep(state.currentStep + 1)));
    $$('.previous-step').forEach(button => button.addEventListener("click", () => goToStep(state.currentStep - 1)));
    $$('.copy-button').forEach(button => button.addEventListener("click", () => copyCode(button.dataset.copyTarget, button)));
    $$('.lesson-visual').forEach(figure => {
      figure.addEventListener("click", () => openVisual(figure));
      figure.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openVisual(figure); } });
    });
    $("#closeModal").addEventListener("click", closeVisual);
    $("#imageModal").addEventListener("click", event => { if (event.target === $("#imageModal")) closeVisual(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeVisual(); });
    $("#returnToStarter").addEventListener("click", () => goToStep(0));
    $("#exitButton").addEventListener("click", exitToLanding);
    $("#quickExport").addEventListener("click", exportPdf);
    $("#finalExport").addEventListener("click", exportPdf);
    $("#fillSamples").addEventListener("click", fillTeacherSamples);
    $("#clearPreview").addEventListener("click", clearCurrentProfile);
    window.addEventListener("afterprint", () => { document.title = titleBeforePrint; });
  }

  renderExtensions();
  bindPersistence();
  bindEvidence();
  bindEvents();
  showSavedProfile();
  updateProgress();
  window.__lessonApp = {startLesson, goToStep, buildReport, getState: () => state, extensionTasks};
})();
