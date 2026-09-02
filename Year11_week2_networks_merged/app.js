(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const CORE_SECTIONS = ["starter", "checkpoint", "main1", "main2", "pitstop", "plenary"];
  const PAGE_ORDER = ["overview", "starter", "checkpoint", "main1", "main2", "pitstop", "extension", "plenary", "finish"];
  const NEXT_PAGE = { overview: "starter", starter: "checkpoint", checkpoint: "main1", main1: "main2", main2: "pitstop", pitstop: "extension", extension: "plenary", plenary: "finish" };
  const PREREQUISITES = { checkpoint: "starter", main1: "checkpoint", main2: "main1", pitstop: "main2", extension: "pitstop", plenary: "pitstop", finish: "plenary" };
  const SECTION_NAMES = { starter: "Paper starter", checkpoint: "Types of learning", main1: "Network classification", main2: "Paper network design", pitstop: "Learning pit stop", plenary: "Exit ticket" };
  const STORAGE_PREFIX = "year11-networks-week2-merged";
  let storageKey = "";
  let currentPage = "overview";
  let toastTimer;
  let state = blankState();

  function blankState() {
    return {
      version: 1,
      profile: { name: "", className: "", role: "student" },
      responses: {},
      choices: {},
      uploads: {},
      completed: [],
      updatedAt: ""
    };
  }

  function slug(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
  }

  function makeStorageKey(profile) {
    return `${STORAGE_PREFIX}:${slug(profile.name)}:${slug(profile.className)}`;
  }

  function saveState() {
    if (!storageKey || state.profile.role === "teacher") return;
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      localStorage.setItem(`${STORAGE_PREFIX}:last-profile`, JSON.stringify(state.profile));
    } catch (error) {
      showToast("This browser could not save all image evidence. Download your PDF before leaving.");
    }
  }

  function loadState(profile) {
    if (profile.role === "teacher") return { ...blankState(), profile };
    storageKey = makeStorageKey(profile);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored && stored.profile) {
        return {
          ...blankState(),
          ...stored,
          profile,
          responses: stored.responses || {},
          choices: stored.choices || {},
          uploads: stored.uploads || {},
          completed: Array.isArray(stored.completed) ? stored.completed : []
        };
      }
    } catch (error) {
      showToast("A previous learning record could not be loaded. A new record has started.");
    }
    return { ...blankState(), profile };
  }

  function startLesson(profile) {
    state = loadState(profile);
    document.body.classList.toggle("teacher-mode", profile.role === "teacher");
    $("#landing").hidden = true;
    $("#app").hidden = false;
    $("#profile-name").textContent = profile.name;
    $("#profile-class").textContent = profile.className || "All classes";
    $("#profile-role").textContent = profile.role === "teacher" ? "Teacher review · all pages open" : "Student record";
    $("#return-home").textContent = profile.role === "teacher" ? "← Exit teacher review" : "← Leave lesson";
    hydrateResponses();
    updateInterface();
    showPage("overview", true);
  }

  function hydrateResponses() {
    $$('[data-save]').forEach((field) => {
      const key = field.dataset.save;
      const value = state.responses[key];
      if (field.type === "checkbox") field.checked = value === true;
      else field.value = value ?? "";
    });
    $$('[data-choice-group]').forEach((group) => {
      const key = group.dataset.choiceGroup;
      $$('[data-choice]', group).forEach((button) => button.classList.toggle("selected", state.choices[key] === button.dataset.choice));
    });
    $$('[data-mcq]').forEach((group) => {
      const key = group.dataset.mcq;
      const selected = state.choices[key];
      if (!selected) return;
      const button = $(`[data-answer="${selected}"]`, group);
      if (button) evaluateMcq(group, button, false);
    });
    Object.keys(state.uploads).forEach(updateUploadPreview);
  }

  function isUnlocked(page) {
    if (state.profile.role === "teacher" || page === "overview" || page === "starter") return true;
    const prerequisite = PREREQUISITES[page];
    return !prerequisite || state.completed.includes(prerequisite);
  }

  function showPage(page, force = false) {
    if (!force && !isUnlocked(page)) {
      showToast("Complete the previous core section first.");
      return;
    }
    currentPage = page;
    $$('[data-page]').forEach((section) => section.classList.toggle("active", section.dataset.page === page));
    $$('[data-nav]').forEach((button) => button.classList.toggle("active", button.dataset.nav === page));
    $(".sidebar").classList.remove("open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
    updateInterface();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completionPercent() {
    const done = CORE_SECTIONS.filter((name) => state.completed.includes(name)).length;
    return Math.round((done / CORE_SECTIONS.length) * 100);
  }

  function updateInterface() {
    const teacher = state.profile.role === "teacher";
    const percent = teacher ? 100 : completionPercent();
    $("#progress-percent").textContent = teacher ? "ALL" : `${percent}%`;
    $("#mobile-progress").textContent = teacher ? "ALL" : `${percent}%`;
    $("#progress-bar").style.width = `${percent}%`;
    $("#finish-percent").textContent = teacher ? "ALL" : `${percent}%`;
    $("#finish-message").textContent = percent === 100 ? "Your core learning evidence is ready to export." : "Complete each core section to build your report.";
    $$('[data-nav]').forEach((button) => {
      const page = button.dataset.nav;
      button.classList.toggle("complete", state.completed.includes(page));
      const locked = !isUnlocked(page);
      button.classList.toggle("locked", locked);
      button.disabled = locked;
    });
    renderCompletionList();
  }

  function renderCompletionList() {
    const container = $("#completion-list");
    container.innerHTML = CORE_SECTIONS.map((section) => {
      const done = state.profile.role === "teacher" || state.completed.includes(section);
      return `<article class="completion-item ${done ? "done" : ""}"><span>${done ? "✓" : "·"}</span><strong>${SECTION_NAMES[section]}</strong></article>`;
    }).join("");
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function fieldHasValue(field) {
    if (field.type === "checkbox") return field.checked;
    return String(field.value || "").trim().length > 0;
  }

  function validatePage(pageName) {
    if (state.profile.role === "teacher") return true;
    const page = $(`[data-page="${pageName}"]`);
    let valid = true;
    $$('[data-required]', page).forEach((field) => {
      const okay = fieldHasValue(field);
      field.classList.toggle("invalid", !okay);
      if (!okay) valid = false;
    });
    $$('[data-choice-group]', page).forEach((group) => {
      const okay = Boolean(state.choices[group.dataset.choiceGroup]);
      group.classList.toggle("invalid", !okay);
      if (!okay) valid = false;
    });
    if (pageName === "main1") {
      const hingeCorrect = state.choices.hinge_network === "b";
      const classificationsCorrect = $$('[data-correct]', page).filter((field) => field.matches("select")).every((field) => field.value === field.dataset.correct);
      if (!hingeCorrect || !classificationsCorrect) {
        valid = false;
        showToast("Correct the hinge question and both classifications before moving on.");
      }
    }
    if (pageName === "main2" && !state.uploads.paper_1) {
      valid = false;
      $("#upload-feedback").textContent = "Upload one clear photograph of your completed paper task.";
      $("#upload-feedback").className = "feedback-line error";
    }
    if (!valid) {
      const firstInvalid = $(".invalid", page);
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Complete the highlighted evidence before moving on.");
    }
    return valid;
  }

  function completeSection(section) {
    if (section !== "extension" && !validatePage(section)) return;
    if (!state.completed.includes(section)) state.completed.push(section);
    saveState();
    updateInterface();
    showToast(section === "extension" ? "Extension evidence saved." : `${SECTION_NAMES[section]} completed.`);
    showPage(NEXT_PAGE[section] || "finish", true);
  }

  function evaluateMcq(group, button, announce = true) {
    const key = group.dataset.mcq;
    $$('[data-answer]', group).forEach((option) => option.classList.remove("selected", "correct", "incorrect"));
    button.classList.add("selected", button.dataset.correct === "true" ? "correct" : "incorrect");
    state.choices[key] = button.dataset.answer;
    const feedback = $(`[data-feedback="${key}"]`);
    const correct = button.dataset.correct === "true";
    feedback.textContent = correct ? "Correct. LAN/WAN describes scale; wired/wireless describes transmission method." : "Not yet. Ask which word describes geographical scale and which describes how data travels.";
    feedback.className = `feedback-line ${correct ? "success" : "error"}`;
    saveState();
    if (announce) showToast(correct ? "Hinge question correct." : "Use the reading to reconsider the two independent decisions.");
  }

  function checkClassifications() {
    const rows = $$('[data-scenario]');
    let allCorrect = true;
    rows.forEach((row) => {
      const correct = $$('select[data-correct]', row).every((field) => field.value === field.dataset.correct);
      row.classList.toggle("correct", correct);
      row.classList.toggle("incorrect", !correct);
      if (!correct) allCorrect = false;
    });
    const feedback = $("#classification-feedback");
    feedback.textContent = allCorrect ? "Both classifications are correct. Now check that each evidence statement quotes only what the scenario tells you." : "Review the rows marked in red. Remember: geographical scale and transmission method are separate decisions, and missing information must not be invented.";
    feedback.className = `feedback-line ${allCorrect ? "success" : "error"}`;
    saveState();
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const maxSide = 1800;
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function updateUploadPreview(key) {
    const preview = $(`[data-upload-preview="${key}"]`);
    if (!preview) return;
    const data = state.uploads[key];
    preview.hidden = !data;
    preview.src = data || "";
    preview.closest(".upload-zone").classList.toggle("has-image", Boolean(data));
  }

  async function handleUpload(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const key = input.dataset.upload;
    const feedback = key.startsWith("paper") ? $("#upload-feedback") : null;
    try {
      if (feedback) {
        feedback.textContent = "Preparing photograph…";
        feedback.className = "feedback-line";
      }
      state.uploads[key] = await compressImage(file);
      updateUploadPreview(key);
      saveState();
      if (feedback) {
        feedback.textContent = "Photograph saved in this browser. Check that the preview is readable.";
        feedback.className = "feedback-line success";
      }
      showToast("Photograph added to your learning record.");
    } catch (error) {
      if (feedback) {
        feedback.textContent = "This photograph could not be processed. Try a JPG, PNG or a new camera photo.";
        feedback.className = "feedback-line error";
      }
    }
  }

  function pdfSafe(value) {
    return String(value ?? "").replace(/[–—]/g, "-").replace(/→/g, "->").replace(/…/g, "...");
  }

  function exportPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showToast("The PDF tool is unavailable. Reload the page and try again.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 16;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    const newPageIfNeeded = (needed = 18) => {
      if (y + needed > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }
    };
    const heading = (text, level = 1) => {
      const size = level === 1 ? 19 : level === 2 ? 13 : 10;
      newPageIfNeeded(level === 1 ? 18 : 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(16, 17, 20);
      doc.text(pdfSafe(text), margin, y);
      y += level === 1 ? 10 : 7;
    };
    const paragraph = (text, options = {}) => {
      if (!text) return;
      doc.setFont("helvetica", options.bold ? "bold" : "normal");
      doc.setFontSize(options.size || 9.5);
      doc.setTextColor(options.muted ? 95 : 30);
      const lines = doc.splitTextToSize(pdfSafe(text), contentWidth);
      newPageIfNeeded(lines.length * 4.6 + 3);
      doc.text(lines, margin, y);
      y += lines.length * 4.6 + 3;
    };
    const response = (label, value) => {
      if (!value) return;
      paragraph(label, { bold: true, size: 8.5 });
      paragraph(value);
    };
    const addEvidenceImage = (label, dataUrl) => {
      if (!dataUrl) return;
      doc.addPage();
      y = 16;
      heading(label, 2);
      try {
        const properties = doc.getImageProperties(dataUrl);
        const maxWidth = contentWidth;
        const maxHeight = pageHeight - y - 18;
        const ratio = Math.min(maxWidth / properties.width, maxHeight / properties.height);
        const width = properties.width * ratio;
        const height = properties.height * ratio;
        doc.addImage(dataUrl, "JPEG", margin + (contentWidth - width) / 2, y, width, height, undefined, "FAST");
        y += height + 5;
      } catch (error) {
        paragraph("The uploaded image could not be embedded in this PDF.");
      }
    };

    doc.setFillColor(16, 17, 20);
    doc.rect(0, 0, pageWidth, 54, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("YEAR 11 COMPUTER SCIENCE | TERM 1 | WEEK 2", margin, 18);
    doc.setFontSize(24);
    doc.text("Computer Networks", margin, 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Merged learning record", margin, 44);
    y = 68;
    response("Student", state.profile.name);
    response("Class", state.profile.className);
    response("Generated", new Date().toLocaleString());
    response("Core evidence completed", `${completionPercent()}%`);
    y += 3;
    heading("Completion record", 2);
    CORE_SECTIONS.forEach((section) => paragraph(`${state.completed.includes(section) ? "[Complete]" : "[Not complete]"} ${SECTION_NAMES[section]}`, { size: 9 }));
    paragraph("Completion records submitted evidence, not automatic mastery. Accuracy and quality require teacher assessment.", { muted: true, size: 8.5 });

    heading("Learning checkpoint", 1);
    response("Type of learning selected", state.choices.learning_type);
    response("Starter evidence", state.responses.checkpoint_evidence);
    response("Planned improvement action", state.responses.checkpoint_action);
    heading("Main Task 1 - classification", 1);
    response("Home network", `${state.responses.home_scale || ""} / ${state.responses.home_method || ""}`);
    response("Decisive evidence", state.responses.home_evidence);
    response("International company network", `${state.responses.company_scale || ""} / ${state.responses.company_method || ""}`);
    response("Decisive evidence", state.responses.company_evidence);
    heading("Learning pit stop", 1);
    response("Current phase", state.choices.learning_phase);
    response("Evidence", state.responses.pitstop_evidence);
    response("Next action", state.responses.pitstop_action);
    heading("Plenary", 1);
    response("Why school Wi-Fi can be a LAN", state.responses.plenary_lan);
    response("Why fibre suits the media link", state.responses.plenary_fibre);
    response("Network risk and consequence", state.responses.plenary_risk);
    if (state.responses.extension_reclaim) {
      heading("Extension reflection", 1);
      response("One mark to reclaim", state.responses.extension_reclaim);
    }
    addEvidenceImage("Paper evidence - photograph 1", state.uploads.paper_1);
    addEvidenceImage("Paper evidence - photograph 2", state.uploads.paper_2);
    addEvidenceImage("Extension evidence", state.uploads.extension);

    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100);
      doc.text(`Year 11 Computer Networks | ${state.profile.name} | Page ${page} of ${totalPages}`, margin, 291);
    }
    doc.save(`Year11_Week2_Networks_${slug(state.profile.name)}.pdf`);
    showToast("PDF downloaded. Open it once before submitting to Teams.");
  }

  $("#entry-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#student-name").value.trim();
    const className = $("#student-class").value.trim();
    const teacher = name.toLowerCase() === "teacher";
    if (!name || (!className && !teacher)) {
      $("#entry-error").hidden = false;
      return;
    }
    $("#entry-error").hidden = true;
    startLesson({ name: teacher ? "Teacher" : name, className: teacher ? "All pages open" : className, role: teacher ? "teacher" : "student" });
  });

  document.addEventListener("input", (event) => {
    const field = event.target.closest('[data-save]');
    if (!field) return;
    const value = field.type === "checkbox" ? field.checked : field.value;
    state.responses[field.dataset.save] = value;
    field.classList.remove("invalid");
    saveState();
  });

  document.addEventListener("change", (event) => {
    const upload = event.target.closest('[data-upload]');
    if (upload) handleUpload(upload);
    const field = event.target.closest('[data-save]');
    if (field) {
      state.responses[field.dataset.save] = field.type === "checkbox" ? field.checked : field.value;
      field.classList.remove("invalid");
      saveState();
    }
  });

  document.addEventListener("click", (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) showPage(nav.dataset.nav);
    const next = event.target.closest('[data-next]');
    if (next) showPage(next.dataset.next, true);
    const complete = event.target.closest('[data-complete]');
    if (complete) completeSection(complete.dataset.complete);
    const reveal = event.target.closest('[data-reveal]');
    if (reveal) {
      const target = document.getElementById(reveal.dataset.reveal);
      target.hidden = false;
      reveal.disabled = true;
      reveal.textContent = "Checking points revealed";
    }
    const choice = event.target.closest('[data-choice]');
    if (choice) {
      const group = choice.closest('[data-choice-group]');
      $$('[data-choice]', group).forEach((button) => button.classList.toggle("selected", button === choice));
      state.choices[group.dataset.choiceGroup] = choice.dataset.choice;
      group.classList.remove("invalid");
      saveState();
    }
    const answer = event.target.closest('[data-answer]');
    if (answer) evaluateMcq(answer.closest('[data-mcq]'), answer);
  });

  $("#check-classifications").addEventListener("click", checkClassifications);
  $("#export-pdf").addEventListener("click", exportPdf);
  $("#return-home").addEventListener("click", () => {
    $("#app").hidden = true;
    $("#landing").hidden = false;
    document.body.classList.remove("teacher-mode");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("#menu-toggle").addEventListener("click", () => {
    const sidebar = $(".sidebar");
    const open = sidebar.classList.toggle("open");
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
  });

  try {
    const last = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}:last-profile`));
    if (last && last.role !== "teacher") {
      $("#student-name").value = last.name || "";
      $("#student-class").value = last.className || "";
    }
  } catch (error) {
    // A missing or malformed previous profile should not prevent a new start.
  }

  const teacherReviewRequested = new URLSearchParams(window.location.search).get("mode") === "teacher-review";
  if (teacherReviewRequested) startLesson({ name: "Teacher", className: "All pages open", role: "teacher" });
})();
