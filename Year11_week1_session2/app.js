(() => {
  "use strict";

  const pageOrder = ["overview", "starter", "main1", "main2", "exam", "extension", "plenary", "finish"];
  const coreSections = ["starter", "main1", "main2", "exam", "plenary"];
  const trackedSections = ["starter", "main1", "main2", "exam", "extension", "plenary"];
  const sectionNames = {
    starter: "Starter",
    main1: "Main Activity 1",
    main2: "Main Activity 2",
    exam: "November 2024 exam practice",
    extension: "Paper 1 extension (optional)",
    plenary: "Plenary",
  };
  const guideForSection = {
    starter: "starter-guide",
    main1: "main1-guide",
    main2: "main2-guide",
    exam: "exam-guide",
    extension: "extension-guide",
    plenary: "plenary-guide",
  };
  const correctCharacteristics = [
    "Built into a larger device",
    "Dedicated or limited purpose",
    "Limited or fixed input and output devices",
  ];

  const reportFields = [
    {
      title: "Starter - Prior knowledge",
      completed: "starter",
      fields: [
        ["Embedded examples", "starter_embedded", true],
        ["General-purpose choice", "starter_general", true],
        ["Initial comparison", "starter_compare", true],
        ["Self-mark", "mark_starter"],
        ["Corrected answer", "starter_improvement"],
      ],
    },
    {
      title: "Main Activity 1 - AO1",
      completed: "main1",
      fields: [
        ["Original definition", "main1_definition", true],
        ["Input", "main1_input", true],
        ["Processing", "main1_process", true],
        ["Output", "main1_output", true],
        ["Characteristics selected", "main1_characteristics", true],
        ["Self-mark", "mark_main1"],
        ["Corrected response", "main1_improvement"],
      ],
    },
    {
      title: "Main Activity 2 - AO2",
      completed: "main2",
      fields: [
        ["Original classification", "main2_class", true],
        ["Original scenario evidence", "main2_evidence", true],
        ["Original paired comparisons", "main2_comparisons", true],
        ["Self-mark", "mark_main2"],
        ["Improved comparison", "main2_improvement"],
      ],
    },
    {
      title: "November 2024 Paper 2 Question 04 - AO1",
      completed: "exam",
      fields: [
        ["04.1 original answer", "exam_q1", true],
        ["04.2 original difference 1", "exam_diff1", true],
        ["04.2 original difference 2", "exam_diff2", true],
        ["04.2 original difference 3", "exam_diff3", true],
        ["04.1 self-mark", "mark_exam_q1"],
        ["04.2 self-mark", "mark_exam_q2"],
        ["Improved answer", "exam_improvement"],
      ],
    },
    {
      title: "Optional Paper 1 controller bridge - AO3",
      completed: "extension",
      fields: [
        ["Trace at 21 C", "ext_trace21", true],
        ["Trace at 22 C", "ext_trace22", true],
        ["Trace at 23 C", "ext_trace23", true],
        ["Corrected condition", "ext_fix", true],
        ["Boundary test explanation", "ext_test", true],
        ["Correction after feedback", "extension_improvement"],
      ],
    },
    {
      title: "Plenary - AO2 transfer",
      completed: "plenary",
      fields: [
        ["Original exit-ticket answer", "plenary_response", true],
        ["Self-mark", "mark_plenary"],
        ["Final improved response", "plenary_improvement"],
      ],
    },
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const landing = $("#landing");
  const lessonApp = $("#lesson-app");
  const toast = $("#toast");
  let storageKey = "";
  let saveTimer;
  let state = blankState();

  function blankState() {
    return {
      profile: { name: "", className: "", role: "student" },
      answers: {},
      original: {},
      completed: { overview: true },
      revealed: {},
      activePage: "overview",
      updatedAt: "",
    };
  }

  function safePart(value) {
    return String(value || "user").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "user";
  }

  function makeStorageKey(profile) {
    return `year11-embedded-redesign-v3:${safePart(profile.role)}:${safePart(profile.name)}:${safePart(profile.className)}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function saveState() {
    if (!storageKey || state.profile.role === "teacher") return;
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem("year11-embedded-redesign-last-profile", JSON.stringify(state.profile));
    $("#autosave-status").textContent = "Saved";
  }

  function scheduleSave() {
    if (state.profile.role === "teacher") return;
    $("#autosave-status").textContent = "Saving...";
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveState, 280);
  }

  function readStored(profile) {
    storageKey = makeStorageKey(profile);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored && stored.profile) return { ...blankState(), ...stored, profile };
    } catch (_) {
      // A damaged local record should not prevent the lesson from opening.
    }
    return { ...blankState(), profile };
  }

  function setFieldValue(key, source) {
    if (source.type === "checkbox") {
      state.answers[key] = $$(`[data-save="${CSS.escape(key)}"]`).filter((box) => box.checked).map((box) => box.value);
    } else {
      state.answers[key] = source.value;
    }
    scheduleSave();
    updateProgress();
  }

  function hydrateFields() {
    $$('[data-save]').forEach((field) => {
      const value = state.answers[field.dataset.save];
      if (field.type === "checkbox") field.checked = Array.isArray(value) && value.includes(field.value);
      else field.value = value == null ? "" : value;
    });
    $$('.mark-guide').forEach((guide) => (guide.hidden = !state.revealed?.[guide.id]));
  }

  function startLesson(profile) {
    state = profile.role === "teacher"
      ? { ...blankState(), profile: { name: "Teacher", className: "All pages open", role: "teacher" } }
      : readStored(profile);
    storageKey = makeStorageKey(state.profile);
    landing.hidden = true;
    lessonApp.hidden = false;
    document.body.classList.toggle("teacher-mode", profile.role === "teacher");
    $("#profile-role").textContent = profile.role === "teacher" ? "Teacher review" : "Student";
    $("#profile-name").textContent = state.profile.name;
    $("#profile-class").textContent = state.profile.className;
    hydrateFields();
    updateProgress();
    if (profile.role === "teacher") {
      $("#return-home").textContent = "← Exit teacher review";
      $$('.lesson-page').forEach((page) => (page.hidden = false));
      $$('.mark-guide').forEach((guide) => (guide.hidden = false));
      $$('#lesson-nav button').forEach((button) => (button.disabled = false));
      $("#progress-percent").textContent = "ALL";
      $("#progress-bar").style.width = "100%";
      $("#secure-count").textContent = "5";
      $("#autosave-status").textContent = "Review mode";
    } else {
      $("#return-home").textContent = "← Return to sign-in";
      showPage(state.activePage || "overview", false);
      saveState();
    }
    window.scrollTo({ top: 0 });
  }

  function isUnlocked(page) {
    if (state.profile.role === "teacher" || page === "overview" || page === "starter" || page === "finish") return true;
    if (page === "main1") return Boolean(state.completed.starter);
    if (page === "main2") return Boolean(state.completed.main1);
    if (page === "exam") return Boolean(state.completed.main2);
    if (page === "extension" || page === "plenary") return Boolean(state.completed.exam);
    return false;
  }

  function closeMobileMenu(returnFocus = false) {
    const sidebar = $(".sidebar");
    const menuButton = $("#mobile-menu");
    sidebar.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    $("#nav-overlay").hidden = true;
    if (returnFocus) menuButton.focus();
  }

  function showPage(page, persist = true) {
    if (state.profile.role === "teacher") {
      $(`[data-page="${page}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!isUnlocked(page)) {
      showToast("Complete and check the previous core stage first.");
      return;
    }
    $$('.lesson-page').forEach((item) => (item.hidden = item.dataset.page !== page));
    $$('#lesson-nav button').forEach((button) => button.classList.toggle("active", button.dataset.nav === page));
    state.activePage = page;
    if (persist) saveState();
    document.querySelector(".workspace")?.scrollIntoView({ block: "start" });
    closeMobileMenu(false);
    if (page === "finish") updateFinishPage();
  }

  function parseScore(value) {
    const match = String(value || "").match(/^(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  function sameSet(left, right) {
    const a = [...(left || [])].sort();
    const b = [...right].sort();
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }

  function isSecure(section) {
    if (!state.completed[section]) return false;
    if (section === "starter") return state.answers.starter_general === "Laptop" && parseScore(state.answers.mark_starter) >= 3;
    if (section === "main1") return sameSet(state.answers.main1_characteristics, correctCharacteristics) && parseScore(state.answers.mark_main1) >= 4;
    if (section === "main2") return state.answers.main2_class === "Embedded system" && parseScore(state.answers.mark_main2) >= 5;
    if (section === "exam") return parseScore(state.answers.mark_exam_q1) + parseScore(state.answers.mark_exam_q2) >= 3;
    if (section === "extension") {
      const traces = [state.answers.ext_trace21, state.answers.ext_trace22, state.answers.ext_trace23].map((value) => String(value || "").trim().toUpperCase());
      const fix = String(state.answers.ext_fix || "").replace(/\s+/g, " ").toLowerCase();
      return traces[0] === "TRUE" && traces[1] === "TRUE" && traces[2] === "FALSE" && fix.includes("temperature < target");
    }
    if (section === "plenary") return parseScore(state.answers.mark_plenary) >= 3;
    return false;
  }

  function hasStarted(section) {
    const page = $(`[data-page="${section}"]`);
    return $$('[data-save]', page).some((field) => {
      const value = state.answers[field.dataset.save];
      return Array.isArray(value) ? value.length > 0 : String(value || "").trim() !== "";
    });
  }

  function sectionStatus(section) {
    if (isSecure(section)) return "Secure";
    if (state.completed[section]) return "Checked";
    if (hasStarted(section)) return "Attempted";
    return "Not started";
  }

  function completionPercent() {
    return Math.round((coreSections.filter((key) => state.completed[key]).length / coreSections.length) * 100);
  }

  function secureCount() {
    return coreSections.filter(isSecure).length;
  }

  function updateProgress() {
    const percent = state.profile.role === "teacher" ? 100 : completionPercent();
    $("#progress-percent").textContent = state.profile.role === "teacher" ? "ALL" : `${percent}%`;
    $("#progress-bar").style.width = `${percent}%`;
    $("#secure-count").textContent = state.profile.role === "teacher" ? "5" : String(secureCount());
    $$('#lesson-nav button').forEach((button) => {
      const page = button.dataset.nav;
      button.disabled = !isUnlocked(page);
      button.classList.toggle("completed", Boolean(state.completed[page]));
      button.classList.toggle("secure", isSecure(page));
    });
    updateFinishPage();
  }

  function firstIncompleteRequired(page) {
    for (const field of $$('[data-required]', page)) {
      if (field.disabled) continue;
      if (String(field.value || "").trim() === "") return field;
    }
    for (const group of $$('[data-required-group]', page)) {
      const checked = $$('input[type="checkbox"]', group).filter((box) => box.checked).length;
      const exact = Number(group.dataset.count || 1);
      if (checked !== exact) return group;
    }
    return null;
  }

  function nextPageAfter(section) {
    if (section === "starter") return "main1";
    if (section === "main1") return "main2";
    if (section === "main2") return "exam";
    if (section === "exam" || section === "extension") return "plenary";
    return "finish";
  }

  function completeSection(section) {
    const page = $(`[data-page="${section}"]`);
    const guideId = guideForSection[section];
    if (guideId && !state.revealed[guideId] && state.profile.role !== "teacher") {
      showToast("Attempt the questions, then open the feedback before completing this stage.");
      $(`[data-reveal="${guideId}"]`)?.focus();
      return;
    }
    const incomplete = firstIncompleteRequired(page);
    if (incomplete) {
      incomplete.scrollIntoView({ behavior: "smooth", block: "center" });
      incomplete.focus?.({ preventScroll: true });
      showToast(incomplete.dataset?.requiredGroup ? "Select exactly three characteristics." : "Complete every response, self-mark and improvement first.");
      return;
    }
    state.completed[section] = true;
    saveState();
    updateProgress();
    showToast(`${sectionNames[section]} saved as ${isSecure(section) ? "self-marked secure" : "checked"}.`);
    window.setTimeout(() => showPage(nextPageAfter(section)), 260);
  }

  function preserveOriginal(keys) {
    keys.forEach((key) => {
      if (state.original[key] == null) {
        const value = state.answers[key];
        state.original[key] = Array.isArray(value) ? [...value] : value ?? "";
      }
    });
  }

  function revealGuide(button) {
    const target = document.getElementById(button.dataset.reveal);
    const keys = (button.dataset.preserve || "").split(",").filter(Boolean);
    const unanswered = keys.find((key) => {
      const value = state.answers[key];
      return Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();
    });
    if (unanswered && state.profile.role !== "teacher") {
      showToast("Attempt every question before revealing the guidance.");
      $$(`[data-save="${CSS.escape(unanswered)}"]`)[0]?.focus();
      return;
    }
    preserveOriginal(keys);
    target.hidden = false;
    state.revealed[target.id] = true;
    saveState();
    if (target.id === "starter-guide") showToast(state.answers.starter_general === "Laptop" ? "General-purpose choice correct. Now check the written comparison." : "Recheck the general-purpose choice using the guidance.");
    if (target.id === "main1-guide") showToast(sameSet(state.answers.main1_characteristics, correctCharacteristics) ? "Objective characteristics correct." : "At least one characteristic needs correction.");
    if (target.id === "main2-guide") showToast(state.answers.main2_class === "Embedded system" ? "Classification correct. Now mark the comparisons." : "Recheck the classification using the scenario evidence.");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateFinishPage() {
    if (!$("#finish-percent")) return;
    const percent = completionPercent();
    const secure = secureCount();
    $("#finish-percent").textContent = `${percent}%`;
    $("#finish-message").textContent = percent === 100 ? "Every core stage has been attempted and checked." : "Complete and check each core stage.";
    $("#finish-secure-message").textContent = `${secure} of 5 core stages are self-marked secure.`;
    $("#completion-list").innerHTML = trackedSections.map((key) => {
      const status = sectionStatus(key);
      const optional = key === "extension" ? "Optional" : "Core";
      return `<div class="completion-item status-${safePart(status)}"><span>${optional}</span><strong>${sectionNames[key]}</strong><em>${status}</em></div>`;
    }).join("");
    const exportButton = $("#export-pdf");
    if (state.profile.role === "teacher") {
      exportButton.disabled = true;
      exportButton.textContent = "Student PDF export";
    } else {
      exportButton.disabled = false;
      exportButton.textContent = percent === 100 ? "Download PDF report ↓" : "Download progress PDF ↓";
    }
  }

  function pdfText(value) {
    if (Array.isArray(value)) return value.length ? value.join(", ") : "Not answered";
    return value == null || String(value).trim() === "" ? "Not answered" : String(value).trim();
  }

  function exportPdf() {
    if (!window.jspdf?.jsPDF) {
      showToast("PDF support did not load. Refresh the page and try again.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    const width = 210;
    const height = 297;
    const margin = 16;
    const textWidth = width - margin * 2;
    let y = margin;

    const pageHeader = (label = "YEAR 11 COMPUTER SCIENCE - EMBEDDED SYSTEMS") => {
      doc.setDrawColor(0);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(label, margin, 12);
      doc.line(margin, 15, width - margin, 15);
      y = 23;
    };
    const newPage = (label) => { doc.addPage(); pageHeader(label); };
    const ensure = (needed, label = "LEARNING RECORD - CONTINUED") => { if (y + needed > height - 18) newPage(label); };
    const wrapped = (text, size = 9, style = "normal", indent = 0) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text), textWidth - indent);
      const lineHeight = size * 0.43;
      ensure(lines.length * lineHeight + 3);
      doc.text(lines, margin + indent, y);
      y += lines.length * lineHeight + 3;
    };
    const response = (label, value) => {
      ensure(16);
      wrapped(label.toUpperCase(), 7.2, "bold");
      wrapped(pdfText(value), 9.2, "normal", 2);
      y += 1;
    };

    pageHeader();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(25);
    doc.text("Embedded Systems", margin, 38);
    doc.setFontSize(15);
    doc.text("Paper 2 learning and examination report", margin, 48);
    doc.setLineWidth(0.6);
    doc.line(margin, 55, width - margin, 55);
    y = 68;
    response("Student", state.profile.name);
    response("Class", state.profile.className);
    response("Generated", new Date().toLocaleString());
    response("Specification", "OxfordAQA 9210 Paper 2 - 3.4.4 Embedded systems");
    response("WAGBA", "Explaining how embedded systems differ from non-embedded computers.");
    response("Core stages checked", `${completionPercent()}%`);
    response("Core stages self-marked secure", `${secureCount()} of 5`);
    wrapped("STATUS KEY", 8, "bold");
    wrapped("Attempted: a response was started. Checked: feedback was used and the stage was completed. Secure: objective checks and the stated self-mark threshold were met. Secure is a student self-assessment, not a teacher-awarded grade.", 9.2);
    y += 4;
    wrapped("ASSESSMENT FOCUS", 8, "bold");
    wrapped("Core lesson: Paper 2 AO1 and AO2. Optional programming bridge: Paper 1 AO3. November 2024 Question 04 is AO1 for all four marks.", 9.2);
    y += 4;
    trackedSections.forEach((key) => wrapped(`${sectionNames[key]} - ${sectionStatus(key)}`, 9, "bold"));

    reportFields.forEach((section) => {
      newPage(section.title.toUpperCase());
      doc.setFont("helvetica", "normal");
      doc.setFontSize(17);
      doc.text(section.title, margin, y);
      y += 10;
      wrapped(`Status: ${sectionStatus(section.completed)}`, 8.5, "bold");
      y += 2;
      section.fields.forEach(([label, key, original]) => {
        const value = original ? state.original[key] : state.answers[key];
        response(label, value);
      });
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(170);
      doc.line(margin, height - 13, width - margin, height - 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(80);
      doc.text(`${state.profile.name} - ${state.profile.className}`, margin, height - 8);
      doc.text(`Page ${page} of ${pageCount}`, width - margin, height - 8, { align: "right" });
    }
    const filename = `${safePart(state.profile.name)}_${safePart(state.profile.className)}_embedded-systems-learning-report.pdf`;
    doc.save(filename);
    showToast("PDF learning report downloaded.");
  }

  $("#student-entry").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#student-name").value.trim();
    const className = $("#student-class").value.trim();
    if (!name || !className) return;
    startLesson({ name, className, role: "student" });
  });

  $$('[data-save]').forEach((field) => {
    const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
    field.addEventListener(eventName, () => setFieldValue(field.dataset.save, field));
  });

  $$('[data-nav]').forEach((button) => button.addEventListener("click", () => showPage(button.dataset.nav)));
  $$('[data-next]').forEach((button) => button.addEventListener("click", () => showPage(button.dataset.next)));
  $$('[data-complete]').forEach((button) => button.addEventListener("click", () => completeSection(button.dataset.complete)));
  $$('[data-reveal]').forEach((button) => button.addEventListener("click", () => revealGuide(button)));

  $("#mobile-menu").addEventListener("click", () => {
    const sidebar = $(".sidebar");
    const opening = !sidebar.classList.contains("open");
    sidebar.classList.toggle("open", opening);
    $("#mobile-menu").setAttribute("aria-expanded", String(opening));
    $("#nav-overlay").hidden = !opening;
    if (opening) $$('#lesson-nav button:not([disabled])')[0]?.focus();
  });
  $("#nav-overlay").addEventListener("click", () => closeMobileMenu(true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $(".sidebar").classList.contains("open")) closeMobileMenu(true);
  });

  $("#return-home").addEventListener("click", () => {
    if (state.profile.role !== "teacher") saveState();
    lessonApp.hidden = true;
    landing.hidden = false;
    document.body.classList.remove("teacher-mode");
    closeMobileMenu(false);
    window.scrollTo({ top: 0 });
  });
  $("#export-pdf").addEventListener("click", exportPdf);
  $("#clear-work").addEventListener("click", () => {
    if (!window.confirm("Clear this saved learning record from this browser? Download the PDF first if you need to keep it.")) return;
    localStorage.removeItem(storageKey);
    localStorage.removeItem("year11-embedded-redesign-last-profile");
    state = { ...blankState(), profile: { ...state.profile } };
    hydrateFields();
    updateProgress();
    showPage("overview");
    showToast("Learning record cleared from this browser.");
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "teacher-review") startLesson({ name: "Teacher", className: "All pages open", role: "teacher" });
  else {
    try {
      const lastProfile = JSON.parse(localStorage.getItem("year11-embedded-redesign-last-profile"));
      if (lastProfile?.name) $("#student-name").value = lastProfile.name;
      if (lastProfile?.className) $("#student-class").value = lastProfile.className;
    } catch (_) {
      // Ignore damaged convenience data.
    }
  }
})();
