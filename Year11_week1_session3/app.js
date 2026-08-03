(() => {
  "use strict";

  const pageOrder = ["overview", "resources", "starter", "skill1", "main1", "skill2", "main2", "extension", "plenary", "finish"];
  const coreSections = ["starter", "skill1", "main1", "skill2", "main2", "plenary"];
  const trackedSections = ["starter", "skill1", "main1", "skill2", "main2", "extension", "plenary"];
  const sectionNames = {
    starter: "Starter",
    skill1: "Skill Clinic 1",
    main1: "Main Activity 1",
    skill2: "Skill Clinic 2",
    main2: "Main Activity 2",
    extension: "Extension (optional)",
    plenary: "Plenary",
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const landing = $("#landing");
  const lessonApp = $("#lesson-app");
  const toast = $("#toast");
  let storageKey = "";
  let saveTimer;
  let state = blankState();

  function blankTraceRows(count = 10) {
    return Array.from({ length: count }, () => ["", "", "", "", ""]);
  }

  function blankState() {
    return {
      profile: { name: "", className: "", role: "student" },
      answers: {},
      uploads: {},
      traceRows: blankTraceRows(),
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
    return `year11-paper1-nov24:${safePart(profile.name)}:${safePart(profile.className)}`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function saveState() {
    if (!storageKey || state.profile.role === "teacher") return;
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      localStorage.setItem("year11-paper1-nov24-last-profile", JSON.stringify(state.profile));
      $("#autosave-status").textContent = "Saved";
    } catch (_) {
      $("#autosave-status").textContent = "Storage full";
      showToast("Browser storage is full. Export your PDF before adding more images.");
    }
  }

  function scheduleSave() {
    if (state.profile.role === "teacher") return;
    $("#autosave-status").textContent = "Saving…";
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveState, 300);
  }

  function readStored(profile) {
    storageKey = makeStorageKey(profile);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored?.profile) {
        return {
          ...blankState(),
          ...stored,
          profile,
          answers: stored.answers || {},
          uploads: stored.uploads || {},
          traceRows: Array.isArray(stored.traceRows) && stored.traceRows.length ? stored.traceRows : blankTraceRows(),
        };
      }
    } catch (_) {
      // Start a clean record if local data is unavailable.
    }
    return { ...blankState(), profile };
  }

  function setFieldValue(key, source) {
    if (source.type === "checkbox") state.answers[key] = source.checked ? source.value : "";
    else state.answers[key] = source.value;
    scheduleSave();
  }

  function hydrateFields() {
    $$('[data-save]').forEach((field) => {
      const value = state.answers[field.dataset.save];
      if (field.type === "checkbox") field.checked = value === field.value;
      else field.value = value == null ? "" : value;
    });
    $$(".feedback-card").forEach((card) => (card.hidden = !state.revealed?.[card.id]));
    renderTraceRows();
    renderAllUploads();
  }

  function startLesson(profile) {
    const teacher = profile.role === "teacher";
    state = teacher
      ? { ...blankState(), profile: { name: "Teacher", className: "All sections open", role: "teacher" } }
      : readStored(profile);
    storageKey = makeStorageKey(state.profile);
    landing.hidden = true;
    lessonApp.hidden = false;
    document.body.classList.toggle("teacher-mode", teacher);
    $("#profile-role").textContent = teacher ? "Teacher review" : "Student";
    $("#profile-name").textContent = state.profile.name;
    $("#profile-class").textContent = state.profile.className;
    hydrateFields();
    updateProgress();
    if (teacher) {
      $("#return-home").textContent = "← Exit teacher review";
      $$(".lesson-page").forEach((page) => (page.hidden = false));
      $$(".teacher-note, .feedback-card").forEach((item) => (item.hidden = false));
      $$("#lesson-nav button").forEach((button) => (button.disabled = false));
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
    if (state.profile.role === "teacher" || ["overview", "starter", "resources", "finish"].includes(page)) return true;
    if (page === "skill1") return Boolean(state.completed.starter);
    if (page === "main1") return Boolean(state.completed.skill1);
    if (page === "skill2") return Boolean(state.completed.main1);
    if (page === "main2") return Boolean(state.completed.skill2);
    if (page === "extension" || page === "plenary") return Boolean(state.completed.main2);
    return false;
  }

  function showPage(page, persist = true) {
    if (state.profile.role === "teacher") {
      $(`[data-page="${page}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!isUnlocked(page)) {
      showToast("Complete the previous core activity first.");
      return;
    }
    $$(".lesson-page").forEach((item) => (item.hidden = item.dataset.page !== page));
    $$("#lesson-nav button").forEach((button) => button.classList.toggle("active", button.dataset.nav === page));
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
    const teacher = state.profile.role === "teacher";
    const percent = teacher ? 100 : completionPercent();
    $("#progress-percent").textContent = teacher ? "ALL" : `${percent}%`;
    $("#progress-bar").style.width = `${percent}%`;
    $$("#lesson-nav button").forEach((button) => {
      const page = button.dataset.nav;
      button.disabled = !isUnlocked(page);
      button.classList.toggle("completed", Boolean(state.completed[page]));
    });
    updateFinishPage();
  }

  function firstIncompleteRequired(page) {
    for (const field of $$('[data-required]', page)) {
      if (!String(field.value || "").trim()) return field;
    }
    const uploadRequirement = $("[data-upload-required]", page);
    if (uploadRequirement && !state.uploads[uploadRequirement.dataset.uploadRequired]) return uploadRequirement;
    if ($("[data-trace-required]", page)) {
      const filledCells = state.traceRows.flat().filter((value) => String(value).trim()).length;
      if (filledCells < 5) return $("[data-trace-required]", page);
    }
    return null;
  }

  function completeSection(section) {
    const page = $(`[data-page="${section}"]`);
    if (section === "extension" && (!String(state.answers.q04_code || "").trim() || !state.uploads.q04_image1)) {
      showToast("To save the optional extension, add the complete code and at least one evidence image.");
      return;
    }
    const incomplete = firstIncompleteRequired(page);
    if (incomplete) {
      incomplete.scrollIntoView({ behavior: "smooth", block: "center" });
      incomplete.focus?.({ preventScroll: true });
      showToast(incomplete.dataset?.uploadRequired ? "Add the required evidence image." : incomplete.dataset?.traceRequired !== undefined ? "Add your trace values before continuing." : "Complete every required response before moving on.");
      return;
    }
    state.completed[section] = true;
    saveState();
    updateProgress();
    showToast(`${sectionNames[section]} saved as complete.`);
    const next = { starter: "skill1", skill1: "main1", main1: "skill2", skill2: "main2", main2: "extension", extension: "plenary", plenary: "finish" }[section];
    if (next) window.setTimeout(() => showPage(next), 260);
  }

  function revealGuide(button) {
    const target = document.getElementById(button.dataset.reveal);
    const keys = (button.dataset.preserve || "").split(",").filter(Boolean);
    const unanswered = keys.find((key) => !String(state.answers[key] ?? "").trim());
    if (unanswered && state.profile.role !== "teacher") {
      showToast("Attempt every part of the small practice before checking it.");
      $$(`[data-save="${CSS.escape(unanswered)}"]`)[0]?.focus();
      return;
    }
    target.hidden = false;
    state.revealed[target.id] = true;
    saveState();
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderTraceRows() {
    const body = $("#trace-body");
    if (!body) return;
    body.innerHTML = "";
    state.traceRows.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      row.forEach((value, colIndex) => {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = value ?? "";
        input.setAttribute("aria-label", `Trace row ${rowIndex + 1}, ${["current", "count", "position", "item", "output"][colIndex]}`);
        input.dataset.traceRow = String(rowIndex);
        input.dataset.traceCol = String(colIndex);
        td.appendChild(input);
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function addTraceRow() {
    if (state.traceRows.length >= 25) { showToast("The trace table already has 25 rows."); return; }
    state.traceRows.push(["", "", "", "", ""]);
    renderTraceRows();
    scheduleSave();
  }

  function removeTraceRow() {
    if (state.traceRows.length <= 1) return;
    state.traceRows.pop();
    renderTraceRows();
    scheduleSave();
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      if (!file?.type?.startsWith("image/")) { reject(new Error("Please select an image file.")); return; }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The image could not be read."));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("The image could not be opened."));
        img.onload = () => {
          const scale = Math.min(1, 1500 / img.width, 1100 / img.height);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function storeUpload(key, file) {
    try {
      state.uploads[key] = await compressImage(file);
      renderUploadSlot(key);
      saveState();
      showToast("Evidence image added.");
    } catch (error) {
      showToast(error.message || "The image could not be added.");
    }
  }

  function renderUploadSlot(key) {
    const slot = $(`[data-upload-slot="${key}"]`);
    if (!slot) return;
    const img = $("img", slot);
    const remove = $(".remove-upload", slot);
    const input = $('input[type="file"]', slot);
    const data = state.uploads[key];
    img.hidden = !data;
    remove.hidden = !data;
    input.hidden = Boolean(data);
    if (data) img.src = data;
    else img.removeAttribute("src");
  }

  function renderAllUploads() {
    $$('[data-upload-slot]').forEach((slot) => renderUploadSlot(slot.dataset.uploadSlot));
  }

  function setupUploadSlots() {
    $$('[data-upload-slot]').forEach((slot) => {
      const key = slot.dataset.uploadSlot;
      const input = $('input[type="file"]', slot);
      input.addEventListener("change", () => input.files?.[0] && storeUpload(key, input.files[0]));
      slot.addEventListener("dragover", (event) => { event.preventDefault(); slot.classList.add("dragover"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
      slot.addEventListener("drop", (event) => { event.preventDefault(); slot.classList.remove("dragover"); if (event.dataTransfer?.files?.[0]) storeUpload(key, event.dataTransfer.files[0]); });
      slot.addEventListener("paste", (event) => {
        const fileFromItems = [...(event.clipboardData?.items || [])].find((item) => item.type.startsWith("image/"))?.getAsFile();
        const file = fileFromItems || [...(event.clipboardData?.files || [])].find((item) => item.type.startsWith("image/"));
        if (file) { event.preventDefault(); storeUpload(key, file); }
      });
      $(".remove-upload", slot).addEventListener("click", () => {
        delete state.uploads[key];
        input.value = "";
        renderUploadSlot(key);
        saveState();
      });
    });
  }

  function updateFinishPage() {
    const percent = completionPercent();
    if (!$("#finish-percent")) return;
    $("#finish-percent").textContent = `${percent}%`;
    $("#finish-message").textContent = percent === 100 ? "Your core learning record is complete." : "Complete each core activity to build your full report.";
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
      exportButton.textContent = percent === 100 ? "Download completed PDF ↓" : "Download progress PDF ↓";
    }
  }

  function exportPdf() {
    if (!window.jspdf?.jsPDF) { showToast("PDF support did not load. Refresh and try again."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 22;

    const value = (key) => {
      const answer = state.answers[key];
      return answer == null || String(answer).trim() === "" ? "Not answered" : String(answer).trim();
    };
    const pageHeader = (label = "YEAR 11 COMPUTER SCIENCE · PAPER 1 SKILLS LAB") => {
      doc.setTextColor(0);
      doc.setDrawColor(0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(label, margin, 11);
      doc.line(margin, 14, pageWidth - margin, 14);
      y = 22;
    };
    const newPage = (label) => { doc.addPage(); pageHeader(label); };
    const ensure = (needed, label = "LEARNING RECORD · CONTINUED") => { if (y + needed > pageHeight - 18) newPage(label); };
    const write = (text, size = 9, style = "normal", indent = 0) => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text), contentWidth - indent);
      const lineHeight = size * 0.43;
      ensure(lines.length * lineHeight + 3);
      doc.text(lines, margin + indent, y);
      y += lines.length * lineHeight + 3;
    };
    const heading = (text) => {
      ensure(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(text, margin, y);
      y += 10;
    };
    const response = (label, key) => {
      write(label.toUpperCase(), 7.3, "bold");
      write(value(key), 9.2, "normal", 2);
      y += 1;
    };
    const codeBlock = (label, key) => {
      heading(label);
      const code = value(key);
      doc.setFont("courier", "normal");
      doc.setFontSize(7.6);
      const sourceLines = code.split(/\r?\n/);
      sourceLines.forEach((sourceLine) => {
        const wrapped = doc.splitTextToSize(sourceLine || " ", contentWidth - 4);
        wrapped.forEach((line) => {
          ensure(4.2, `${label.toUpperCase()} · CONTINUED`);
          doc.text(line, margin + 2, y);
          y += 3.7;
        });
      });
      y += 4;
    };
    const imageBlock = (label, key) => {
      heading(label);
      const data = state.uploads[key];
      if (!data) { write("Not provided", 9); return; }
      const props = doc.getImageProperties(data);
      let drawWidth = contentWidth;
      let drawHeight = drawWidth * props.height / props.width;
      if (drawHeight > 225) { drawHeight = 225; drawWidth = drawHeight * props.width / props.height; }
      ensure(drawHeight + 5, label.toUpperCase());
      doc.addImage(data, "JPEG", margin, y, drawWidth, drawHeight, undefined, "FAST");
      y += drawHeight + 6;
    };

    pageHeader();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(25);
    doc.text("November 2024 Paper 1", margin, 36);
    doc.setFontSize(16);
    doc.text("Student learning and evidence record", margin, 46);
    doc.setLineWidth(0.6);
    doc.line(margin, 53, pageWidth - margin, 53);
    y = 66;
    write(`Student: ${state.profile.name}`, 10, "bold");
    write(`Class: ${state.profile.className}`, 10, "bold");
    write(`Generated: ${new Date().toLocaleString()}`, 9);
    write(`Core progress: ${completionPercent()}%`, 9);
    y += 5;
    heading("WAGBA");
    write("Turning written requirements into correct, tested and evidenced changes to an existing program.", 10);
    heading("Completion summary");
    trackedSections.forEach((key) => write(`${state.completed[key] ? "COMPLETE" : "NOT COMPLETE"} · ${sectionNames[key]}`, 8.5));

    newPage("STARTER · QUESTIONS 01.1–01.3");
    heading("Starter · Find it fast");
    response("01.1 Answer", "q01_1");
    response("01.1 Evidence line", "q01_1_line");
    response("01.2 Answer", "q01_2");
    response("01.2 Evidence line", "q01_2_line");
    response("01.3 Answer", "q01_3");

    newPage("SKILL CLINIC 1 · TRACE WITHOUT GUESSING");
    heading("Small practice responses");
    ["skill1_before1", "skill1_calc1", "skill1_after1", "skill1_before2", "skill1_calc2", "skill1_after2", "skill1_final", "skill1_explain"].forEach((key) => response(key.replaceAll("_", " "), key));

    newPage("MAIN ACTIVITY 1 · SECTION A RESPONSES");
    heading("Question 01");
    response("01.4 Answer", "q01_4");
    response("01.5 Answer", "q01_5");
    heading("Question 02");
    response("02.1 Answer", "q02_1");
    response("02.2 Answer", "q02_2");
    response("02.3 Answer", "q02_3");
    response("02.4 Answer", "q02_4");
    heading("Question 03.1 · Trace table");
    const headers = ["current", "count", "position", "item", "OUTPUT"];
    const widths = [30, 27, 30, 27, 66];
    const drawTraceRow = (row, bold = false) => {
      ensure(10, "QUESTION 03.1 · TRACE TABLE CONTINUED");
      let x = margin;
      row.forEach((cell, index) => {
        doc.rect(x, y, widths[index], 8);
        doc.setFont("courier", bold ? "bold" : "normal");
        doc.setFontSize(7.2);
        doc.text(String(cell ?? "").slice(0, 35), x + 2, y + 5.2);
        x += widths[index];
      });
      y += 8;
    };
    drawTraceRow(headers, true);
    state.traceRows.forEach((row) => drawTraceRow(row));
    y += 6;
    response("03.2 Answer", "q03_2");

    newPage("SKILL CLINIC 2 · ACCUMULATOR LOGIC");
    ["skill2_runs", "skill2_pairs", "skill2_bytes", "skill2_missed", "skill2_where"].forEach((key) => response(key.replaceAll("_", " "), key));

    newPage("MAIN ACTIVITY 2 · QUESTION 08");
    codeBlock("08.1 Complete amended rleImage source code", "q08_code");
    imageBlock("08.2 Evidence image 1", "q08_image1");
    if (state.uploads.q08_image2) imageBlock("08.2 Evidence image 2", "q08_image2");

    if (String(state.answers.q04_code || "").trim() || state.uploads.q04_image1) {
      newPage("OPTIONAL EXTENSION · QUESTION 04");
      codeBlock("04.1 Complete amended rleImage source code", "q04_code");
      imageBlock("04.2 Evidence image 1", "q04_image1");
      if (state.uploads.q04_image2) imageBlock("04.2 Evidence image 2", "q04_image2");
    }

    newPage("PLENARY · EMBEDDED SYSTEMS BRIDGE");
    heading("Security camera and laptop comparison [4 marks]");
    response("Student answer", "plenary_answer");

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(160);
      doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.4);
      doc.setTextColor(70);
      doc.text(`${state.profile.name} · ${state.profile.className}`, margin, pageHeight - 8);
      doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    }
    doc.save(`${safePart(state.profile.name)}_${safePart(state.profile.className)}_nov24-paper1-learning-record.pdf`);
    showToast("PDF downloaded. Check it, then upload it to Teams.");
  }

  $("#student-entry").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#student-name").value.trim();
    const className = $("#student-class").value.trim();
    if (!name) { showToast("Enter your name to continue."); return; }
    if (name.toLowerCase() === "teacher") {
      startLesson({ name: "Teacher", className: "All sections open", role: "teacher" });
      return;
    }
    if (!className) { showToast("Enter your class to continue."); return; }
    startLesson({ name, className, role: "student" });
  });

  document.addEventListener("input", (event) => {
    const field = event.target.closest?.('[data-save]');
    if (field) setFieldValue(field.dataset.save, field);
    const trace = event.target.closest?.('[data-trace-row]');
    if (trace) {
      state.traceRows[Number(trace.dataset.traceRow)][Number(trace.dataset.traceCol)] = trace.value;
      scheduleSave();
    }
  });
  document.addEventListener("change", (event) => {
    const field = event.target.closest?.('[data-save]');
    if (field) setFieldValue(field.dataset.save, field);
  });

  $$("#lesson-nav button").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.nav)));
  $$('[data-next]').forEach((button) => button.addEventListener("click", () => showPage(button.dataset.next)));
  $$('[data-complete]').forEach((button) => button.addEventListener("click", () => completeSection(button.dataset.complete)));
  $$('[data-reveal]').forEach((button) => button.addEventListener("click", () => revealGuide(button)));
  $("#add-trace-row").addEventListener("click", addTraceRow);
  $("#remove-trace-row").addEventListener("click", removeTraceRow);
  setupUploadSlots();

  $("#mobile-menu").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
  $("#return-home").addEventListener("click", () => {
    saveState();
    lessonApp.hidden = true;
    landing.hidden = false;
    document.body.classList.remove("teacher-mode");
    $(".sidebar").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("#export-pdf").addEventListener("click", exportPdf);
  $("#clear-work").addEventListener("click", () => {
    if (!window.confirm("Clear every saved answer, trace-table value and uploaded evidence image for this student? This cannot be undone.")) return;
    localStorage.removeItem(storageKey);
    const profile = { ...state.profile };
    state = { ...blankState(), profile };
    hydrateFields();
    updateProgress();
    showPage("overview");
    showToast("Saved work cleared.");
  });

  try {
    const last = JSON.parse(localStorage.getItem("year11-paper1-nov24-last-profile"));
    if (last?.role === "student") {
      $("#student-name").value = last.name || "";
      $("#student-class").value = last.className || "";
    }
  } catch (_) {
    // Ignore unavailable profile history.
  }
})();
