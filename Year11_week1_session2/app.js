(() => {
  "use strict";

  const pageOrder = ["overview", "starter", "main1", "main2", "extension", "plenary", "finish"];
  const coreSections = ["starter", "main1", "main2", "plenary"];
  const trackedSections = ["starter", "main1", "main2", "extension", "plenary"];
  const sectionNames = {
    starter: "Starter",
    main1: "Main Activity 1",
    main2: "Main Activity 2",
    extension: "Extension (optional)",
    plenary: "Plenary",
  };

  const reportFields = [
    {
      title: "Starter · Observe and predict",
      completed: "starter",
      fields: [
        ["Four objects that may contain computer systems", "starter_objects"],
        ["What one computer may control", "starter_control"],
        ["General-purpose computer identified", "starter_general_purpose"],
        ["Initial washing-machine and laptop comparison", "starter_difference"],
      ],
    },
    {
      title: "Main Activity 1 · AO1 to AO2",
      completed: "main1",
      fields: [
        ["Revised starter comparison", "main1_starter_revisit"],
        ["Definition of an embedded system", "main1_definition"],
        ["Washing-machine inputs", "main1_inputs"],
        ["Controller processing", "main1_process"],
        ["Washing-machine outputs", "main1_outputs"],
        ["Selected characteristics", "main1_characteristics"],
        ["Central-heating explanation", "main1_heating"],
        ["Improved response", "main1_improvement"],
      ],
    },
    {
      title: "Main Activity 2 · AO2 to AO3",
      completed: "main2",
      fields: [
        ["Digital-camera classification", "main2_camera_class"],
        ["Digital-camera justification", "main2_camera_reason"],
        ["Laptop classification", "main2_laptop_class"],
        ["Laptop justification", "main2_laptop_reason"],
        ["Smart TV: evidence supporting the claim", "main2_smarttv_for"],
        ["Smart TV: evidence challenging the claim", "main2_smarttv_against"],
        ["Smart TV: justified conclusion", "main2_smarttv_conclusion"],
        ["Reclaimed-mark improvement", "main2_improvement"],
      ],
    },
    {
      title: "Past-paper extension · AO1 and AO2",
      completed: "extension",
      fields: [
        ["04.1 Original response", "ext_q1", true],
        ["04.1 Current response", "ext_q1"],
        ["04.2 Original response", "ext_q2", true],
        ["04.2 Current response", "ext_q2"],
        ["04.1 Self-mark", "mark_ext_q1"],
        ["04.2 Self-mark", "mark_ext_q2"],
        ["Improved answer", "extension_improvement"],
      ],
    },
    {
      title: "Plenary · AO2 to AO3",
      completed: "plenary",
      fields: [
        ["Original exit-ticket response", "plenary_response", true],
        ["Current exit-ticket response", "plenary_response"],
        ["Success points achieved", "mark_plenary"],
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
    return `year11-embedded-v2:${safePart(profile.role)}:${safePart(profile.name)}:${safePart(profile.className)}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function saveState() {
    if (!storageKey || state.profile.role === "teacher") return;
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem("year11-embedded-last-profile", JSON.stringify(state.profile));
    const status = $("#autosave-status");
    status.textContent = "Saved";
  }

  function scheduleSave() {
    if (state.profile.role === "teacher") return;
    $("#autosave-status").textContent = "Saving…";
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveState, 280);
  }

  function readStored(profile) {
    storageKey = makeStorageKey(profile);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored && stored.profile) return { ...blankState(), ...stored, profile };
    } catch (_) {
      // Start a clean record if local data is unreadable.
    }
    return { ...blankState(), profile };
  }

  function fieldValue(key) {
    const value = state.answers[key];
    if (Array.isArray(value)) return value.join(", ");
    return value == null || value === "" ? "Not answered" : String(value);
  }

  function refreshAnswerPreviews() {
    $$('[data-answer-preview]').forEach((preview) => {
      const value = state.answers[preview.dataset.answerPreview];
      preview.textContent = String(value || "").trim() || "No starter idea recorded yet.";
    });
  }

  function setFieldValue(key, source) {
    if (source.type === "checkbox") {
      const values = $$(`[data-save="${CSS.escape(key)}"]`)
        .filter((box) => box.checked)
        .map((box) => box.value);
      state.answers[key] = values;
    } else {
      state.answers[key] = source.value;
    }
    refreshAnswerPreviews();
    scheduleSave();
  }

  function hydrateFields() {
    $$('[data-save]').forEach((field) => {
      const key = field.dataset.save;
      const value = state.answers[key];
      if (field.type === "checkbox") field.checked = Array.isArray(value) && value.includes(field.value);
      else field.value = value == null ? "" : value;
    });
    refreshAnswerPreviews();
    $$('.mark-guide').forEach((guide) => (guide.hidden = true));
    Object.keys(state.revealed || {}).forEach((id) => {
      const guide = document.getElementById(id);
      if (guide && state.revealed[id]) guide.hidden = false;
    });
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
    if (page === "extension" || page === "plenary") return Boolean(state.completed.main2);
    return false;
  }

  function showPage(page, persist = true) {
    if (state.profile.role === "teacher") {
      const target = $(`[data-page="${page}"]`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!isUnlocked(page)) {
      showToast("Complete the previous activity first.");
      return;
    }
    $$('.lesson-page').forEach((item) => (item.hidden = item.dataset.page !== page));
    $$('#lesson-nav button').forEach((button) => button.classList.toggle("active", button.dataset.nav === page));
    state.activePage = page;
    if (persist) saveState();
    document.querySelector(".workspace")?.scrollIntoView({ block: "start" });
    $(".sidebar").classList.remove("open");
    if (page === "finish") updateFinishPage();
  }

  function completionPercent() {
    return Math.round((coreSections.filter((key) => state.completed[key]).length / coreSections.length) * 100);
  }

  function updateProgress() {
    const percent = state.profile.role === "teacher" ? 100 : completionPercent();
    $("#progress-percent").textContent = state.profile.role === "teacher" ? "ALL" : `${percent}%`;
    $("#progress-bar").style.width = `${percent}%`;
    $$('#lesson-nav button').forEach((button) => {
      const page = button.dataset.nav;
      button.disabled = !isUnlocked(page);
      button.classList.toggle("completed", Boolean(state.completed[page]));
    });
    updateFinishPage();
  }

  function firstIncompleteRequired(page) {
    const required = $$('[data-required]', page);
    for (const field of required) {
      if (field.disabled) continue;
      if (String(field.value || "").trim() === "") return field;
    }
    const groups = $$('[data-required-group]', page);
    for (const group of groups) {
      const checked = $$('input[type="checkbox"]', group).filter((box) => box.checked).length;
      const exact = Number(group.dataset.min || 1);
      if (checked !== exact) return group;
    }
    return null;
  }

  function completeSection(section) {
    const page = $(`[data-page="${section}"]`);
    const incomplete = firstIncompleteRequired(page);
    if (incomplete) {
      const hiddenGuide = incomplete.closest?.('.mark-guide[hidden]');
      if (hiddenGuide) {
        hiddenGuide.hidden = false;
        state.revealed[hiddenGuide.id] = true;
      }
      incomplete.scrollIntoView({ behavior: "smooth", block: "center" });
      if (incomplete.focus) incomplete.focus({ preventScroll: true });
      showToast(incomplete.dataset?.requiredGroup ? "Select exactly three characteristics." : "Complete every response and self-mark before moving on.");
      return;
    }
    state.completed[section] = true;
    saveState();
    updateProgress();
    showToast(`${sectionNames[section]} saved as complete.`);
    const next = section === "starter" ? "main1" : section === "main1" ? "main2" : section === "main2" ? "extension" : section === "extension" ? "plenary" : "finish";
    window.setTimeout(() => showPage(next), 260);
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
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateFinishPage() {
    const percent = completionPercent();
    $("#finish-percent").textContent = `${percent}%`;
    $("#finish-message").textContent = percent === 100
      ? "Your core learning record is complete."
      : "Complete each core activity to build your full report.";
    $("#completion-list").innerHTML = trackedSections.map((key) => {
      const done = Boolean(state.completed[key]);
      return `<div class="completion-item ${done ? "done" : ""}"><span>${key === "extension" ? "Optional" : "Core"}</span><strong>${sectionNames[key]} · ${done ? "Complete" : "Not complete"}</strong></div>`;
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

    const pageHeader = (label = "YEAR 11 COMPUTER SCIENCE · EMBEDDED SYSTEMS") => {
      doc.setDrawColor(0);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(label, margin, 12);
      doc.line(margin, 15, width - margin, 15);
      y = 23;
    };
    const newPage = (label) => { doc.addPage(); pageHeader(label); };
    const ensure = (needed, label) => { if (y + needed > height - 18) newPage(label); };
    const wrapped = (text, size = 9, style = "normal", indent = 0) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text), textWidth - indent);
      const lineHeight = size * 0.43;
      ensure(lines.length * lineHeight + 3, "LEARNING RECORD · CONTINUED");
      doc.text(lines, margin + indent, y);
      y += lines.length * lineHeight + 3;
    };
    const response = (label, value) => {
      ensure(16, "LEARNING RECORD · CONTINUED");
      wrapped(label.toUpperCase(), 7.2, "bold");
      wrapped(pdfText(value), 9.2, "normal", 2);
      y += 1;
    };

    pageHeader();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(26);
    doc.text("Embedded Systems", margin, 38);
    doc.setFontSize(17);
    doc.text("Student learning report", margin, 48);
    doc.setLineWidth(0.6);
    doc.line(margin, 55, width - margin, 55);
    y = 68;
    response("Student", state.profile.name);
    response("Class", state.profile.className);
    response("Generated", new Date().toLocaleString());
    response("WAGBA", "Identifying embedded systems and explaining how they differ from general-purpose computers.");
    response("Core lesson progress", `${completionPercent()}% complete`);
    wrapped("ASSESSMENT-OBJECTIVE JOURNEY", 8, "bold");
    wrapped("AO1: recall and describe definitions and characteristics. AO2: apply understanding to familiar and unfamiliar devices. AO3: analyse evidence, challenge a claim and reach a justified conclusion.", 9.2);
    y += 3;
    wrapped("Completion summary", 12, "bold");
    trackedSections.forEach((key) => wrapped(`${state.completed[key] ? "COMPLETE" : "NOT COMPLETE"}  ·  ${sectionNames[key]}`, 9));

    reportFields.forEach((section) => {
      newPage(section.title.toUpperCase());
      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.text(section.title, margin, y);
      y += 11;
      wrapped(`Status: ${state.completed[section.completed] ? "Complete" : "In progress / not completed"}`, 8.5, "bold");
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
      doc.text(`${state.profile.name} · ${state.profile.className}`, margin, height - 8);
      doc.text(`Page ${page} of ${pageCount}`, width - margin, height - 8, { align: "right" });
    }

    const filename = `${safePart(state.profile.name)}_${safePart(state.profile.className)}_embedded-systems-learning-report.pdf`;
    doc.save(filename);
    state.exportedAt = new Date().toISOString();
    saveState();
    showToast("PDF downloaded. Upload this file to your Teams assignment.");
  }

  $("#student-entry").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#student-name").value.trim();
    const className = $("#student-class").value.trim();
    if (!name || !className) return;
    startLesson({ name, className, role: "student" });
  });

  document.addEventListener("input", (event) => {
    const field = event.target.closest?.('[data-save]');
    if (field) setFieldValue(field.dataset.save, field);
  });
  document.addEventListener("change", (event) => {
    const field = event.target.closest?.('[data-save]');
    if (field) setFieldValue(field.dataset.save, field);
  });

  $$('#lesson-nav button').forEach((button) => button.addEventListener("click", () => showPage(button.dataset.nav)));
  $$('[data-next]').forEach((button) => button.addEventListener("click", () => showPage(button.dataset.next)));
  $$('[data-reveal]').forEach((button) => button.addEventListener("click", () => revealGuide(button)));
  $$('[data-complete]').forEach((button) => button.addEventListener("click", () => completeSection(button.dataset.complete)));

  $("#mobile-menu").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
  $("#return-home").addEventListener("click", () => {
    const leavingTeacher = state.profile.role === "teacher";
    saveState();
    lessonApp.hidden = true;
    landing.hidden = false;
    document.body.classList.remove("teacher-mode");
    $(".sidebar").classList.remove("open");
    if (leavingTeacher) window.history.replaceState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("#export-pdf").addEventListener("click", exportPdf);
  $("#clear-work").addEventListener("click", () => {
    if (!window.confirm("Clear all saved responses for this name and class? This cannot be undone.")) return;
    localStorage.removeItem(storageKey);
    const profile = { ...state.profile };
    state = { ...blankState(), profile };
    $$('[data-save]').forEach((field) => {
      if (field.type === "checkbox") field.checked = false;
      else field.value = "";
    });
    $$('.mark-guide').forEach((guide) => (guide.hidden = true));
    updateProgress();
    showPage("overview");
    showToast("Learning record cleared.");
  });

  try {
    const last = JSON.parse(localStorage.getItem("year11-embedded-last-profile"));
    if (last?.role === "student") {
      $("#student-name").value = last.name || "";
      $("#student-class").value = last.className || "";
    }
  } catch (_) {
    // Ignore unavailable profile history.
  }

  const teacherReviewRequested = new URLSearchParams(window.location.search).get("mode") === "teacher-review";
  if (teacherReviewRequested) {
    startLesson({ name: "Teacher", className: "All pages open", role: "teacher" });
  }
})();
