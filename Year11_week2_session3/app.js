(() => {
  "use strict";

  const pages = ["overview", "resources", "starter", "main1", "main2", "extension", "plenary", "finish"];
  const core = ["starter", "main1", "main2", "plenary"];
  const tracked = ["starter", "main1", "main2", "extension", "plenary"];
  const names = { starter: "Starter", main1: "Main Activity 1", main2: "Main Activity 2", extension: "Extension", plenary: "Plenary" };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let state = blankState();
  let storageKey = "";
  let saveTimer;

  function blankState() {
    return {
      profile: { name: "", className: "", role: "student" },
      answers: {}, uploads: {}, completed: { overview: true, resources: true },
      activePage: "overview", updatedAt: ""
    };
  }

  function safe(value) {
    return String(value || "student").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
  }

  function keyFor(profile) {
    return `year11-nov24-w2s3:${safe(profile.name)}:${safe(profile.className)}`;
  }

  function toast(message) {
    const box = $("#toast");
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(box._timer);
    box._timer = setTimeout(() => box.classList.remove("show"), 2800);
  }

  function saveNow() {
    if (!storageKey || state.profile.role === "teacher") return;
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      $("#save-status").textContent = "Saved";
    } catch (_) {
      $("#save-status").textContent = "Storage full";
      toast("Browser storage is full. Export your PDF before adding more evidence.");
    }
  }

  function scheduleSave() {
    if (state.profile.role === "teacher") return;
    $("#save-status").textContent = "Saving…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 300);
  }

  function loadState(profile) {
    storageKey = keyFor(profile);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (stored?.profile) {
        return {
          ...blankState(), ...stored, profile,
          answers: stored.answers || {}, uploads: stored.uploads || {},
          completed: stored.completed || { overview: true, resources: true }
        };
      }
    } catch (_) { /* begin with a clean record */ }
    return { ...blankState(), profile };
  }

  function start(profile) {
    const teacher = profile.role === "teacher";
    state = teacher
      ? { ...blankState(), profile: { name: "Teacher", className: "All sections open", role: "teacher" } }
      : loadState(profile);
    storageKey = keyFor(state.profile);
    $("#landing").hidden = true;
    $("#lesson-app").hidden = false;
    document.body.classList.toggle("teacher-mode", teacher);
    $("#profile-role").textContent = teacher ? "Teacher review" : "Student";
    $("#profile-name").textContent = state.profile.name;
    $("#profile-class").textContent = state.profile.className;
    $("#return-home").textContent = teacher ? "← Exit teacher review" : "← Return to sign-in";
    hydrate();
    updateProgress();
    if (teacher) {
      $$(".lesson-page").forEach(page => page.hidden = false);
      $$(".teacher-note").forEach(note => note.hidden = false);
      $$("#lesson-nav button").forEach(button => button.disabled = false);
      $("#save-status").textContent = "Review mode";
      $("#progress-percent").textContent = "ALL";
      $("#progress-bar").style.width = "100%";
    } else {
      showPage(state.activePage || "overview", false);
      saveNow();
    }
    window.scrollTo({ top: 0 });
  }

  function hydrate() {
    $$('[data-save]').forEach(field => {
      const value = state.answers[field.dataset.save];
      if (field.type === "checkbox") field.checked = value === field.value;
      else field.value = value == null ? "" : value;
    });
    renderUploads();
  }

  function unlocked(page) {
    if (state.profile.role === "teacher" || ["overview", "resources", "starter"].includes(page)) return true;
    if (page === "main1") return Boolean(state.completed.starter);
    if (page === "main2") return Boolean(state.completed.main1);
    if (["extension", "plenary"].includes(page)) return Boolean(state.completed.main2);
    if (page === "finish") return Boolean(state.completed.plenary);
    return false;
  }

  function showPage(page, persist = true) {
    if (state.profile.role === "teacher") {
      $(`[data-page="${page}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!unlocked(page)) { toast("Complete the previous core activity first."); return; }
    $$(".lesson-page").forEach(item => item.hidden = item.dataset.page !== page);
    $$("#lesson-nav button").forEach(button => button.classList.toggle("active", button.dataset.nav === page));
    state.activePage = page;
    if (persist) saveNow();
    document.querySelector(".workspace")?.scrollIntoView({ block: "start" });
    $(".sidebar").classList.remove("open");
    if (page === "finish") updateFinish();
  }

  function percent() {
    return Math.round(core.filter(section => state.completed[section]).length / core.length * 100);
  }

  function updateProgress() {
    const teacher = state.profile.role === "teacher";
    const value = teacher ? 100 : percent();
    $("#progress-percent").textContent = teacher ? "ALL" : `${value}%`;
    $("#progress-bar").style.width = `${value}%`;
    $$("#lesson-nav button").forEach(button => {
      button.disabled = !unlocked(button.dataset.nav);
      button.classList.toggle("completed", Boolean(state.completed[button.dataset.nav]));
    });
    updateFinish();
  }

  function incomplete(page) {
    for (const field of $$('[data-required]', page)) {
      if (!String(field.value || "").trim()) return field;
    }
    const upload = $("[data-upload-required]", page);
    if (upload && !state.uploads[upload.dataset.uploadRequired]) return upload;
    return null;
  }

  function complete(section) {
    const page = $(`[data-page="${section}"]`);
    const missing = incomplete(page);
    if (missing) {
      missing.scrollIntoView({ behavior: "smooth", block: "center" });
      missing.focus?.({ preventScroll: true });
      toast(missing.dataset?.uploadRequired ? "Add the required evidence screenshot." : "Complete every required response before continuing.");
      return;
    }
    state.completed[section] = true;
    saveNow();
    updateProgress();
    toast(`${names[section]} saved as complete.`);
    const next = { starter: "main1", main1: "main2", main2: "extension", plenary: "finish" }[section];
    if (next) setTimeout(() => showPage(next), 240);
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      if (!file?.type?.startsWith("image/")) { reject(new Error("Choose an image file.")); return; }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The image could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("The image could not be opened."));
        image.onload = () => {
          const scale = Math.min(1, 1300 / image.width, 900 / image.height);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", .72));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function storeUpload(key, file) {
    try {
      state.uploads[key] = await compressImage(file);
      renderUpload(key);
      saveNow();
      toast("Evidence image added.");
    } catch (error) { toast(error.message || "The image could not be added."); }
  }

  function renderUpload(key) {
    const slot = $(`[data-upload-slot="${key}"]`);
    if (!slot) return;
    const data = state.uploads[key];
    const image = $("img", slot);
    const input = $('input[type="file"]', slot);
    const remove = $(".remove-upload", slot);
    image.hidden = !data;
    input.hidden = Boolean(data);
    remove.hidden = !data;
    if (data) image.src = data; else image.removeAttribute("src");
  }

  function renderUploads() {
    $$('[data-upload-slot]').forEach(slot => renderUpload(slot.dataset.uploadSlot));
  }

  function setupUploads() {
    $$('[data-upload-slot]').forEach(slot => {
      const key = slot.dataset.uploadSlot;
      const input = $('input[type="file"]', slot);
      input.addEventListener("change", () => input.files?.[0] && storeUpload(key, input.files[0]));
      slot.addEventListener("dragover", event => { event.preventDefault(); slot.classList.add("dragover"); });
      slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
      slot.addEventListener("drop", event => {
        event.preventDefault(); slot.classList.remove("dragover");
        if (event.dataTransfer?.files?.[0]) storeUpload(key, event.dataTransfer.files[0]);
      });
      slot.addEventListener("paste", event => {
        const item = [...(event.clipboardData?.items || [])].find(entry => entry.type.startsWith("image/"));
        const file = item?.getAsFile();
        if (file) { event.preventDefault(); storeUpload(key, file); }
      });
      $(".remove-upload", slot).addEventListener("click", event => {
        event.stopPropagation(); delete state.uploads[key]; input.value = ""; renderUpload(key); saveNow();
      });
    });
  }

  function updateFinish() {
    if (!$("#finish-percent")) return;
    const value = percent();
    $("#finish-percent").textContent = `${value}%`;
    $("#finish-message").textContent = value === 100 ? "Your core learning record is complete." : "Complete the core activities before final submission.";
    $("#completion-list").innerHTML = tracked.map(section => {
      const done = Boolean(state.completed[section]);
      return `<div class="${done ? "done" : ""}"><span>${section === "extension" ? "Optional" : "Core"}</span><strong>${names[section]} · ${done ? "Complete" : "Not complete"}</strong></div>`;
    }).join("");
    const button = $("#export-pdf");
    button.disabled = state.profile.role === "teacher";
    button.textContent = value === 100 ? "Download completed PDF ↓" : "Download progress PDF ↓";
  }

  async function exportPdf() {
    if (!window.jspdf?.jsPDF) { toast("PDF support did not load. Refresh and try again."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
    const margin = 15, width = 180, pageHeight = 297;
    let y = 22;
    const answer = key => String(state.answers[key] || "Not answered").trim();
    const header = label => {
      doc.setTextColor(0); doc.setDrawColor(0); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
      doc.text(label || "YEAR 11 COMPUTER SCIENCE · NOVEMBER 2024 PAPER 1", margin, 11);
      doc.line(margin, 14, 195, 14); y = 22;
    };
    const newPage = label => { doc.addPage(); header(label); };
    const ensure = needed => { if (y + needed > pageHeight - 18) newPage("PROGRAMMING LEARNING RECORD · CONTINUED"); };
    const write = (text, size = 9, style = "normal", indent = 0) => {
      doc.setFont("helvetica", style); doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(text || " "), width - indent);
      const height = Math.max(4, lines.length * size * .42 + 2);
      ensure(height); doc.text(lines, margin + indent, y); y += height;
    };
    const heading = text => { ensure(14); doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.text(text, margin, y); y += 9; };
    const response = (label, key) => { write(label.toUpperCase(), 7, "bold"); write(answer(key), 9, "normal", 2); y += 1; };
    const code = (label, key) => {
      heading(label); doc.setFont("courier", "normal"); doc.setFontSize(7.2);
      String(state.answers[key] || "Not submitted").split(/\r?\n/).forEach(line => {
        const wrapped = doc.splitTextToSize(line || " ", width - 4);
        wrapped.forEach(part => { ensure(4); doc.text(part, margin + 2, y); y += 3.5; });
      }); y += 3;
    };
    const evidence = (label, key) => {
      const data = state.uploads[key];
      if (!data) return;
      const props = doc.getImageProperties(data);
      const maxW = width, maxH = 105;
      const ratio = Math.min(maxW / props.width, maxH / props.height);
      const w = props.width * ratio, h = props.height * ratio;
      ensure(h + 12); write(label.toUpperCase(), 7, "bold");
      doc.addImage(data, "JPEG", margin, y, w, h, undefined, "FAST"); y += h + 5;
    };

    header();
    doc.setFont("helvetica", "bold"); doc.setFontSize(23); doc.text("Programming learning record", margin, 30); y = 40;
    write(`Student: ${state.profile.name}`, 11, "bold");
    write(`Class: ${state.profile.className}`, 10);
    write(`Generated: ${new Date().toLocaleString()}`, 9);
    write(`Core completion: ${percent()}%`, 10, "bold");
    y += 3;
    write("WAGBA", 7, "bold");
    write("Interpreting requirements, modifying an existing program and presenting valid test evidence.", 10);

    newPage("STARTER · Q01.1–Q01.3"); heading("Starter responses");
    response("01.1", "q01_1"); response("01.2", "q01_2"); response("01.3", "q01_3");

    newPage("MAIN ACTIVITY 1 · Q05"); heading("Skill check");
    response("Values returned", "q5_count"); response("Receiving variables", "q5_vars"); response("Insertion point", "q5_location"); response("Data types", "q5_types");
    code("05.1 Complete amended main", "q05_code");
    evidence("05.2 Evidence 1", "q05_image1"); evidence("05.2 Evidence 2", "q05_image2");

    newPage("MAIN ACTIVITY 2 · Q06"); heading("Skill check");
    response("factor data type", "q6_type"); response("Conversion", "q6_conversion"); response("Iteration type", "q6_iteration"); response("Invalid condition", "q6_condition");
    code("06.1 Complete amended stretchImage", "q06_code");
    evidence("06.2 Evidence 1", "q06_image1"); evidence("06.2 Evidence 2", "q06_image2");

    if (state.answers.q07_code || state.uploads.q07_image1 || state.uploads.q07_image2) {
      newPage("OPTIONAL EXTENSION · Q07");
      code("07.1 Complete amended loadImage", "q07_code");
      evidence("07.2 Evidence 1", "q07_image1"); evidence("07.2 Evidence 2", "q07_image2");
    }

    newPage("PLENARY · MARK RECOVERY"); heading("Q06 self-assessment");
    response("Indefinite iteration", "mark_loop"); response("Tests factor", "mark_factor"); response("Boundary", "mark_boundary"); response("Message placement", "mark_message"); response("Requests another value", "mark_reinput");
    response("First mark to recover", "recover_mark"); response("Exact code change", "recover_change");
    heading("Exit ticket"); response("Why the loop may not terminate", "exit_reason"); response("Required statement", "exit_statement");

    doc.save(`${safe(state.profile.name)}_${safe(state.profile.className)}_Nov2024_Paper1_W2S3.pdf`);
    toast("PDF downloaded. Open it and check the evidence before submitting to Teams.");
  }

  $("#entry-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#student-name").value.trim();
    const className = $("#student-class").value.trim();
    const teacher = name.toLowerCase() === "teacher" || className.toLowerCase() === "teacher";
    if (!teacher && (!name || !className)) { toast("Enter both your full name and class."); return; }
    start({ name, className, role: teacher ? "teacher" : "student" });
  });

  document.addEventListener("input", event => {
    const field = event.target.closest("[data-save]");
    if (!field) return;
    state.answers[field.dataset.save] = field.type === "checkbox" ? (field.checked ? field.value : "") : field.value;
    scheduleSave();
  });
  document.addEventListener("change", event => {
    const field = event.target.closest("[data-save]");
    if (!field) return;
    state.answers[field.dataset.save] = field.type === "checkbox" ? (field.checked ? field.value : "") : field.value;
    scheduleSave();
  });
  document.addEventListener("click", event => {
    const nav = event.target.closest("[data-nav]"); if (nav) showPage(nav.dataset.nav);
    const next = event.target.closest("[data-next]"); if (next) showPage(next.dataset.next);
    const done = event.target.closest("[data-complete]"); if (done) complete(done.dataset.complete);
  });

  $("#save-extension").addEventListener("click", () => {
    if (!String(state.answers.q07_code || "").trim() || !state.uploads.q07_image1) {
      toast("Add the complete Q07 code and at least one test screenshot, or skip the extension."); return;
    }
    state.completed.extension = true; saveNow(); updateProgress(); toast("Extension saved as complete."); setTimeout(() => showPage("plenary"), 240);
  });
  $("#export-pdf").addEventListener("click", exportPdf);
  $("#mobile-menu").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
  $("#return-home").addEventListener("click", () => window.location.reload());
  $("#clear-work").addEventListener("click", () => {
    if (state.profile.role === "teacher") return;
    if (!confirm("Clear every saved answer and evidence image for this student? This cannot be undone.")) return;
    localStorage.removeItem(storageKey); window.location.reload();
  });

  $$('[data-zoom]').forEach(image => image.addEventListener("click", () => {
    $("#modal-image").src = image.src; $("#image-modal").hidden = false; document.body.style.overflow = "hidden";
  }));
  function closeModal() { $("#image-modal").hidden = true; $("#modal-image").removeAttribute("src"); document.body.style.overflow = ""; }
  $("#close-modal").addEventListener("click", closeModal);
  $("#image-modal").addEventListener("click", event => { if (event.target === $("#image-modal")) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("#image-modal").hidden) closeModal(); });

  setupUploads();
  pages.forEach(page => { const element = $(`[data-page="${page}"]`); if (element) element.hidden = page !== "overview"; });
})();
