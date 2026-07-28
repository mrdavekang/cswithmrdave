/* ==========================================================================
   app.js — Year 9 Computing, Term 1 Week 1: Classroom Help Button
   Lesson journey, saving, evidence uploads, validation and review.
   No server, no accounts, no build step.
   ========================================================================== */
(function (global) {
  "use strict";

  /* =======================================================================
     CONFIGURATION — change the editor address here and nowhere else.
     ======================================================================= */
  var CONFIG = {
    MICROBIT_EDITOR_URL: "https://python.microbit.org/v/3",
    LESSON_ID: "Y9-T1W1-HelpButton",
    LESSON_TITLE: "Classroom Help Button",
    LESSON_SUBTITLE: "Year 9 Computing · Term 1, Week 1",
    SCHEMA_VERSION: 1,
    IMAGE_MAX_SIDE: 1600,
    JPEG_QUALITY: 0.8,
    PNG_FALLBACK_BYTES: 1200000,   // if a resized PNG is bigger than this, save as JPEG instead
    LARGE_JSON_WARN_BYTES: 8000000 // warn students about very large progress files
  };

  /* =======================================================================
     LESSON MODEL
     ======================================================================= */
  var SECTIONS = [
    { id: "starter", num: 1, label: "Starter", short: "Starter", prereq: [], optional: false },
    { id: "m1a", num: 2, label: "Main 1 · A — Save your file", short: "Main 1 · A", prereq: ["starter"], optional: false },
    { id: "m1b", num: 3, label: "Main 1 · B — First version", short: "Main 1 · B", prereq: ["m1a"], optional: false },
    { id: "m1c", num: 4, label: "Main 1 · C — Make it yours", short: "Main 1 · C", prereq: ["m1b"], optional: false },
    { id: "m2a", num: 5, label: "Main 2 · A — Real micro:bit", short: "Main 2 · A", prereq: ["m1c"], optional: false },
    { id: "m2b", num: 6, label: "Main 2 · B — Partner test", short: "Main 2 · B", prereq: ["m2a"], optional: false },
    { id: "m2c", num: 7, label: "Main 2 · C — Make it better", short: "Main 2 · C", prereq: ["m2b"], optional: false },
    { id: "ext", num: 8, label: "Extension — Can I talk?", short: "Extension", prereq: ["m2c"], optional: true },
    { id: "plenary", num: 9, label: "Plenary", short: "Plenary", prereq: ["m2c"], optional: false },
    { id: "return", num: 10, label: "Return the equipment", short: "Equipment", prereq: ["plenary"], optional: false },
    { id: "review", num: 11, label: "Final review and export", short: "Review", prereq: ["return"], optional: false }
  ];

  var ORDER = SECTIONS.map(function (s) { return s.id; });

  function sectionById(id) {
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) return SECTIONS[i];
    return null;
  }

  /* =======================================================================
     STATE
     ======================================================================= */
  var state = null;
  var profileKey = "student";      // "student" or "teacher" — kept apart in storage
  var imageCache = {};             // id -> full image record (with dataUrl)
  var saveTimer = null;
  var lastPdfName = "";

  function newState(name, klass, isTeacher) {
    var sections = {};
    ORDER.forEach(function (id) { sections[id] = { visited: false, complete: false, completedAt: null }; });
    return {
      schemaVersion: CONFIG.SCHEMA_VERSION,
      lessonId: CONFIG.LESSON_ID,
      lessonTitle: CONFIG.LESSON_TITLE,
      student: {
        name: name,
        class: klass,
        isTeacherPreview: !!isTeacher,
        startedAt: new Date().toISOString()
      },
      currentSection: "starter",
      sections: sections,
      responses: {},
      images: [],          // metadata only; picture data lives in IndexedDB
      events: [],
      exports: { pdfCount: 0, lastPdfAt: null, jsonCount: 0, lastJsonAt: null },
      updatedAt: new Date().toISOString()
    };
  }

  /* =======================================================================
     SMALL HELPERS
     ======================================================================= */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function txt(v) { return (v == null ? "" : String(v)).trim(); }
  function len(v) { return txt(v).length; }
  function uid(prefix) {
    return (prefix || "id") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }
  function safePart(s, fallback) {
    var out = String(s == null ? "" : s)
      .normalize ? String(s).normalize("NFKD") : String(s);
    out = out.replace(/[^A-Za-z0-9]+/g, "");
    return out || (fallback || "");
  }
  function niceDate(iso) {
    var d = iso ? new Date(iso) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function toast(message, kind) {
    var area = $("#toastArea");
    if (!area) return;
    var el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = message;
    area.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, kind === "err" ? 7000 : 3800);
  }

  /** Open a <dialog>, falling back to a plain open attribute on older browsers. */
  function openDialog(dlg, modal) {
    try {
      if (modal && typeof dlg.showModal === "function") { dlg.showModal(); return; }
      if (typeof dlg.show === "function") { dlg.show(); return; }
    } catch (e) { /* fall through */ }
    dlg.setAttribute("open", "");
  }
  function closeDialog(dlg) {
    try { if (typeof dlg.close === "function") { dlg.close(); return; } } catch (e) { /* fall through */ }
    dlg.removeAttribute("open");
  }

  function confirmDialog(title, bodyHtml, yesLabel) {
    return new Promise(function (resolve) {
      var dlg = $("#confirmModal");
      $("#confirmTitle").textContent = title;
      $("#confirmBody").innerHTML = bodyHtml;
      $("#confirmYes").textContent = yesLabel || "Yes, do it";
      function cleanup(result) {
        $("#confirmYes").removeEventListener("click", onYes);
        $("#confirmNo").removeEventListener("click", onNo);
        dlg.removeEventListener("cancel", onNo);
        if (dlg.open) closeDialog(dlg);
        resolve(result);
      }
      function onYes() { cleanup(true); }
      function onNo(e) { if (e) e.preventDefault(); cleanup(false); }
      $("#confirmYes").addEventListener("click", onYes);
      $("#confirmNo").addEventListener("click", onNo);
      dlg.addEventListener("cancel", onNo);
      openDialog(dlg, true);
      setTimeout(function () { $("#confirmNo").focus(); }, 30);
    });
  }

  function setSaveState(text, kind) {
    var el = $("#saveState");
    if (!el) return;
    el.textContent = text;
    el.className = "save-state" + (kind ? " " + kind : "");
  }

  /* =======================================================================
     SAVING
     ======================================================================= */
  function saveNow() {
    if (!state) return Promise.resolve();
    state.updatedAt = new Date().toISOString();
    setSaveState("Saving…");
    return global.LessonStorage.saveRecord(profileKey, state).then(function () {
      setSaveState("Saved " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), "saved");
    }).catch(function (err) {
      setSaveState("Not saved", "error");
      toast("Your work could not be saved on this computer. Download a progress file as a backup.", "err");
      console.error(err);
    });
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    setSaveState("Saving…");
    saveTimer = setTimeout(function () { saveTimer = null; saveNow(); }, 600);
  }

  function logEvent(type, detail) {
    if (!state) return;
    state.events.push({ type: type, detail: detail || null, at: new Date().toISOString() });
    if (state.events.length > 400) state.events.splice(0, state.events.length - 400);
  }

  /* =======================================================================
     FILENAMES
     ======================================================================= */
  function pyFilename() {
    if (!state) return "Class_FullName_W1_HelpButton.py";
    var c = safePart(state.student.class, "Class");
    var n = safePart(state.student.name, "Student");
    return c + "_" + n + "_W1_HelpButton.py";
  }
  function baseExportName() {
    var c = safePart(state.student.class, "Class");
    var n = safePart(state.student.name, "Student");
    return "Year9_" + c + "_" + n + "_T1W1_HelpButton";
  }

  /* =======================================================================
     CODE PANELS — highlighting, copy, download
     ======================================================================= */
  var PY_RE = /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(from|import|while|if|elif|else|and|or|not|True|False|None|def|return|in|pass|break)\b|\b(\d+)\b|\b([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()/g;

  function highlightPython(src) {
    var escaped = String(src).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var marked = escaped.replace(PY_RE, function (m, com, str, kw, num, fn) {
      if (com) return '<span class="tok-com">' + com + "</span>";
      if (str) return '<span class="tok-str">' + str + "</span>";
      if (kw) return '<span class="tok-kw">' + kw + "</span>";
      if (num) return '<span class="tok-num">' + num + "</span>";
      if (fn) return '<span class="tok-fn">' + fn + "</span>";
      return m;
    });
    return marked.split("\n").map(function (line) {
      return '<span class="ln">' + (line.length ? line : "&#8203;") + "</span>";
    }).join("");
  }

  function codeSource(id) {
    var node = document.getElementById(id);
    return node ? node.textContent.replace(/\s+$/, "") + "\n" : "";
  }

  function renderCodePanels() {
    $$("[data-code-render]").forEach(function (pre) {
      var id = pre.getAttribute("data-code-render");
      pre.innerHTML = highlightPython(codeSource(id));
    });
  }

  function copyText(text) {
    if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); resolve(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  /* =======================================================================
     RESPONSE BINDING
     ======================================================================= */
  function setResponse(key, value) {
    if (!state) return;
    state.responses[key] = value;
    refreshDerived();
    scheduleSave();
  }

  function getResponse(key) {
    return state && Object.prototype.hasOwnProperty.call(state.responses, key) ? state.responses[key] : "";
  }

  function bindResponses() {
    $$("[data-response]").forEach(function (el) {
      var key = el.getAttribute("data-response");
      if (el.type === "checkbox") {
        el.addEventListener("change", function () {
          setResponse(key, el.checked);
          el.closest(".check") && el.closest(".check").classList.toggle("is-checked", el.checked);
        });
      } else {
        el.addEventListener("input", function () { setResponse(key, el.value); });
        el.addEventListener("change", function () { setResponse(key, el.value); });
      }
    });

    $$("[data-radio]").forEach(function (group) {
      var key = group.getAttribute("data-radio");
      $$("input[type=radio]", group).forEach(function (radio) {
        radio.addEventListener("change", function () {
          setResponse(key, radio.value);
          $$(".radio-pill", group).forEach(function (p) {
            p.classList.toggle("is-checked", !!$("input:checked", p));
          });
        });
      });
    });

    // choice cards (Main 1 Part C)
    $$("[data-choice-input]").forEach(function (input) {
      input.addEventListener("change", function () {
        var chosen = $$("[data-choice-input]").filter(function (i) { return i.checked; })
          .map(function (i) { return i.getAttribute("data-choice-input"); });
        setResponse("m1c_changes", chosen);
        syncChoiceCards();
      });
    });

    // chips
    $$(".chips[data-chip-target]").forEach(function (group) {
      var targetKey = group.getAttribute("data-chip-target");
      var mode = group.getAttribute("data-chip-mode") || "fill";
      $$(".chip", group).forEach(function (chip) {
        if (chip.tagName !== "BUTTON") return;
        chip.addEventListener("click", function () {
          var label = chip.textContent.trim();
          if (mode === "toggle") {
            var current = getResponse(targetKey);
            var list = Array.isArray(current) ? current.slice() : (current ? String(current).split(" | ") : []);
            var idx = list.indexOf(label);
            if (idx >= 0) list.splice(idx, 1); else list.push(label);
            chip.setAttribute("aria-pressed", idx >= 0 ? "false" : "true");
            setResponse(targetKey, list);
            return;
          }
          var field = document.getElementById(targetKey);
          if (!field) return;
          if (mode === "append") {
            var base = txt(field.value);
            field.value = base ? base.replace(/\s*$/, "") + " " + label : label;
          } else {
            field.value = label;
          }
          setResponse(targetKey, field.value);
          field.focus();
        });
      });
    });
  }

  function syncChoiceCards() {
    $$(".choice-card").forEach(function (card) {
      var input = $("[data-choice-input]", card);
      card.classList.toggle("is-selected", !!(input && input.checked));
    });
  }

  function applyResponsesToForm() {
    $$("[data-response]").forEach(function (el) {
      var key = el.getAttribute("data-response");
      var val = getResponse(key);
      if (el.type === "checkbox") {
        el.checked = val === true;
        var wrap = el.closest(".check");
        if (wrap) wrap.classList.toggle("is-checked", el.checked);
      } else if (el.type === "hidden") {
        el.value = Array.isArray(val) ? val.join(" | ") : (val || "");
      } else {
        el.value = Array.isArray(val) ? val.join(" | ") : (val == null ? "" : val);
      }
    });

    $$("[data-radio]").forEach(function (group) {
      var key = group.getAttribute("data-radio");
      var val = getResponse(key);
      $$("input[type=radio]", group).forEach(function (radio) { radio.checked = (radio.value === val); });
      $$(".radio-pill", group).forEach(function (p) { p.classList.toggle("is-checked", !!$("input:checked", p)); });
    });

    var chosen = getResponse("m1c_changes");
    if (!Array.isArray(chosen)) chosen = [];
    $$("[data-choice-input]").forEach(function (input) {
      input.checked = chosen.indexOf(input.getAttribute("data-choice-input")) >= 0;
    });
    syncChoiceCards();

    $$('.chips[data-chip-mode="toggle"]').forEach(function (group) {
      var key = group.getAttribute("data-chip-target");
      var list = getResponse(key);
      if (!Array.isArray(list)) list = list ? String(list).split(" | ") : [];
      $$(".chip", group).forEach(function (chip) {
        chip.setAttribute("aria-pressed", list.indexOf(chip.textContent.trim()) >= 0 ? "true" : "false");
      });
    });
  }

  /* =======================================================================
     EVIDENCE IMAGES
     ======================================================================= */
  function imagesForSlot(slot) {
    if (!state) return [];
    return state.images.filter(function (img) { return img.slot === slot; });
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = function () { reject(fr.error || new Error("read-failed")); };
      fr.readAsDataURL(file);
    });
  }

  function loadImageElement(dataUrl) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("decode-failed")); };
      img.src = dataUrl;
    });
  }

  /**
   * Resize (only if larger than the maximum side) and compress in the browser.
   * Screenshots stay as PNG so the text stays readable; photos become JPEG.
   */
  function processImage(file) {
    return readFileAsDataUrl(file).then(loadImageElement).then(function (img) {
      var w = img.naturalWidth || img.width;
      var h = img.naturalHeight || img.height;
      var longest = Math.max(w, h);
      var scale = longest > CONFIG.IMAGE_MAX_SIDE ? CONFIG.IMAGE_MAX_SIDE / longest : 1;
      var outW = Math.max(1, Math.round(w * scale));
      var outH = Math.max(1, Math.round(h * scale));

      var canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, outW, outH);

      var isPng = /png$/i.test(file.type) || /\.png$/i.test(file.name);
      var dataUrl;
      if (isPng) {
        dataUrl = canvas.toDataURL("image/png");
        if (dataUrl.length * 0.75 > CONFIG.PNG_FALLBACK_BYTES) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        }
      } else {
        dataUrl = canvas.toDataURL("image/jpeg", CONFIG.JPEG_QUALITY);
      }
      return { dataUrl: dataUrl, width: outW, height: outH, bytes: Math.round(dataUrl.length * 0.75) };
    });
  }

  function buildUploader(box) {
    var slot = box.getAttribute("data-slot");
    var max = parseInt(box.getAttribute("data-max") || "1", 10);
    var inputId = "file-" + slot;

    var controls = document.createElement("div");
    controls.className = "btn-row";
    controls.innerHTML =
      '<input type="file" id="' + inputId + '" accept="image/png,image/jpeg,.png,.jpg,.jpeg" multiple class="visually-hidden">' +
      '<label class="btn btn-small" for="' + inputId + '">Choose a picture</label>' +
      '<button type="button" class="btn btn-small btn-paste">Paste a screenshot</button>' +
      '<span class="hint" style="font-size:0.8rem;color:var(--ink-3)">or press <kbd>Ctrl</kbd> + <kbd>V</kbd> · up to ' +
      max + ' picture' + (max > 1 ? "s" : "") + '</span>';
    box.appendChild(controls);

    var status = document.createElement("p");
    status.className = "upload-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    box.appendChild(status);

    var thumbs = document.createElement("div");
    thumbs.className = "thumbs";
    box.appendChild(thumbs);

    var input = box.querySelector("input[type=file]");

    input.addEventListener("change", function () {
      var files = Array.prototype.slice.call(input.files || []);
      input.value = "";
      addPictures(box, files);
    });

    // clicking or focusing anywhere in the box makes it the target for Ctrl + V
    box.addEventListener("mousedown", function () { armUploader(box); });
    box.addEventListener("focusin", function () { armUploader(box); });
    $(".btn-paste", box).addEventListener("click", function () { pasteFromClipboard(box); });

    renderThumbs(box);
  }

  /* ---------------- pasting screenshots ---------------- */
  var armedUploader = null;

  function armUploader(box) {
    if (armedUploader === box) return;
    armedUploader = box;
    $$(".uploader").forEach(function (b) { b.classList.toggle("is-armed", b === box); });
  }

  /** Where should a pasted picture go? The armed box, or the only one on this page. */
  function pasteTarget() {
    var section = $(".section.is-active");
    if (!section) return null;
    var boxes = $$(".uploader", section);
    if (!boxes.length) return null;
    if (armedUploader && boxes.indexOf(armedUploader) >= 0) return armedUploader;
    if (boxes.length === 1) return boxes[0];
    // more than one on the page: use the first with room, and say which
    for (var i = 0; i < boxes.length; i++) {
      var slot = boxes[i].getAttribute("data-slot");
      var max = parseInt(boxes[i].getAttribute("data-max") || "1", 10);
      if (imagesForSlot(slot).length < max) return boxes[i];
    }
    return boxes[0];
  }

  function blobToFile(blob, name) {
    try { return new File([blob], name, { type: blob.type || "image/png" }); }
    catch (e) { blob.name = name; return blob; }   // older browsers without the File constructor
  }

  function handlePasteEvent(ev) {
    if (!state) return;
    var target = ev.target;
    // let students paste text into their answer boxes as normal
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
      var hasImage = ev.clipboardData && Array.prototype.some.call(ev.clipboardData.items || [], function (it) {
        return it.kind === "file" && /^image\//.test(it.type);
      });
      if (!hasImage) return;
    }
    var items = ev.clipboardData ? ev.clipboardData.items : null;
    if (!items) return;
    var files = [];
    Array.prototype.forEach.call(items, function (item) {
      if (item.kind === "file" && /^image\/(png|jpeg)$/i.test(item.type)) {
        var f = item.getAsFile();
        if (f) files.push(blobToFile(f, "pasted-screenshot." + (/png/i.test(item.type) ? "png" : "jpg")));
      }
    });
    if (!files.length) return;
    var box = pasteTarget();
    if (!box) {
      toast("There is nowhere to paste a picture on this page.", "err");
      return;
    }
    ev.preventDefault();
    box.scrollIntoView({ block: "center" });
    addPictures(box, files, true);
  }

  /** The "Paste screenshot" button — reads the clipboard directly where the browser allows it. */
  function pasteFromClipboard(box) {
    armUploader(box);
    var status = $(".upload-status", box);
    if (!(global.navigator && navigator.clipboard && navigator.clipboard.read)) {
      status.textContent = "Take your screenshot, then press Ctrl + V (⌘ + V on a Mac).";
      status.className = "upload-status";
      return;
    }
    status.textContent = "Checking your clipboard…";
    status.className = "upload-status";
    navigator.clipboard.read().then(function (items) {
      var jobs = [];
      items.forEach(function (item) {
        var type = item.types.filter(function (tp) { return /^image\/(png|jpeg)$/i.test(tp); })[0];
        if (type) jobs.push(item.getType(type).then(function (blob) {
          return blobToFile(blob, "pasted-screenshot." + (/png/i.test(type) ? "png" : "jpg"));
        }));
      });
      if (!jobs.length) {
        status.textContent = "There is no picture on your clipboard yet. Take a screenshot first.";
        status.className = "upload-status error";
        return;
      }
      return Promise.all(jobs).then(function (files) { addPictures(box, files, true); });
    }).catch(function () {
      status.textContent = "Press Ctrl + V (⌘ + V on a Mac) to paste your screenshot here.";
      status.className = "upload-status";
    });
  }

  /* ---------------- shared: add pictures to an uploader ---------------- */
  function addPictures(box, files, pasted) {
    var slot = box.getAttribute("data-slot");
    var max = parseInt(box.getAttribute("data-max") || "1", 10);
    var status = $(".upload-status", box);
    files = Array.prototype.slice.call(files || []);
    if (!files.length) return;

    var room = max - imagesForSlot(slot).length;
    if (room <= 0) {
      status.textContent = "You already have " + max + ". Remove one before adding another.";
      status.className = "upload-status error";
      return;
    }
    var accepted = [];
    files.forEach(function (f) {
      var okType = /^image\/(png|jpeg)$/i.test(f.type) || /\.(png|jpe?g)$/i.test(f.name || "");
      if (!okType) {
        status.textContent = "“" + (f.name || "That file") + "” is not a PNG, JPG or JPEG file.";
        status.className = "upload-status error";
        return;
      }
      if (accepted.length < room) accepted.push(f);
    });
    if (!accepted.length) return;

    status.textContent = pasted ? "Adding your pasted screenshot…" : "Adding your picture…";
    status.className = "upload-status";

    var chain = Promise.resolve();
    accepted.forEach(function (file) {
      chain = chain.then(function () {
        return processImage(file).then(function (out) {
          var record = {
            id: profileKey + ":" + uid("img"),
            slot: slot,
            section: box.closest(".section") ? box.closest(".section").getAttribute("data-section") : "",
            label: defaultLabelForSlot(slot),
            filename: file.name || "pasted-screenshot.png",
            pasted: !!pasted,
            width: out.width,
            height: out.height,
            bytes: out.bytes,
            addedAt: new Date().toISOString(),
            dataUrl: out.dataUrl
          };
          imageCache[record.id] = record;
          var meta = {};
          Object.keys(record).forEach(function (k) { if (k !== "dataUrl") meta[k] = record[k]; });
          state.images.push(meta);
          return global.LessonStorage.putImage(record);
        });
      });
    });

    return chain.then(function () {
      status.textContent = "Saved on this computer.";
      status.className = "upload-status ok";
      logEvent(pasted ? "paste" : "upload", slot);
      renderThumbs(box);
      refreshDerived();
      if (pasted) toast("Screenshot pasted into “" + $("h4", box).textContent.replace(/\.$/, "") + "”.", "ok");
      return saveNow();
    }).catch(function (err) {
      console.error(err);
      status.textContent = "That picture could not be saved. Try a smaller picture, or use Print / save as PDF instead.";
      status.className = "upload-status error";
    });
  }

  function defaultLabelForSlot(slot) {
    var map = {
      m1a_file_screenshot: "Saved Python file",
      m1b_sim_screenshot: "Simulator test",
      m1c_sim_screenshot: "Simulator after my changes",
      m2a_device_photo: "Real micro:bit working",
      m2c_evidence: "Improved version",
      ext_evidence: "Extension"
    };
    return map[slot] || "Evidence";
  }

  function renderThumbs(box) {
    var slot = box.getAttribute("data-slot");
    var thumbs = $(".thumbs", box);
    if (!thumbs) return;
    var list = imagesForSlot(slot);
    thumbs.innerHTML = "";
    list.forEach(function (meta) {
      var rec = imageCache[meta.id];
      var el = document.createElement("div");
      el.className = "thumb";
      el.innerHTML =
        '<img alt="' + esc(meta.label || "Evidence picture") + '" src="' + (rec ? rec.dataUrl : "") + '" data-lightbox="' + esc(meta.label || "Evidence") + '">' +
        '<div class="cap"><label class="visually-hidden" for="cap-' + meta.id + '">Label for this picture</label>' +
        '<input id="cap-' + meta.id + '" type="text" maxlength="60" value="' + esc(meta.label || "") + '" placeholder="Label this picture"></div>' +
        '<div class="meta">' + meta.width + "×" + meta.height + " · " + Math.round(meta.bytes / 1024) + " KB</div>" +
        '<div class="thumb-btns">' +
        '<button type="button" class="btn btn-small" data-replace="' + meta.id + '">Replace</button>' +
        '<button type="button" class="btn btn-small btn-danger" data-remove="' + meta.id + '">Remove</button>' +
        "</div>";
      thumbs.appendChild(el);

      $("input", $(".cap", el)).addEventListener("input", function (e) {
        meta.label = e.target.value;
        if (imageCache[meta.id]) imageCache[meta.id].label = e.target.value;
        global.LessonStorage.putImage(imageCache[meta.id]);
        scheduleSave();
      });

      $("[data-remove]", el).addEventListener("click", function () {
        confirmDialog("Remove this picture?", "<p>This picture will be deleted from your work on this computer.</p>", "Remove it")
          .then(function (yes) {
            if (!yes) return;
            state.images = state.images.filter(function (m) { return m.id !== meta.id; });
            delete imageCache[meta.id];
            return global.LessonStorage.deleteImage(meta.id).then(function () {
              renderThumbs(box);
              refreshDerived();
              saveNow();
              toast("Picture removed.");
            });
          });
      });

      $("[data-replace]", el).addEventListener("click", function () {
        var picker = document.createElement("input");
        picker.type = "file";
        picker.accept = "image/png,image/jpeg,.png,.jpg,.jpeg";
        picker.addEventListener("change", function () {
          var f = picker.files && picker.files[0];
          if (!f) return;
          processImage(f).then(function (out) {
            var rec2 = {
              id: meta.id, slot: meta.slot, section: meta.section, label: meta.label,
              filename: f.name, width: out.width, height: out.height, bytes: out.bytes,
              addedAt: new Date().toISOString(), dataUrl: out.dataUrl
            };
            imageCache[meta.id] = rec2;
            meta.filename = f.name; meta.width = out.width; meta.height = out.height; meta.bytes = out.bytes;
            return global.LessonStorage.putImage(rec2);
          }).then(function () {
            renderThumbs(box);
            saveNow();
            toast("Picture replaced.");
          }).catch(function (err) {
            console.error(err);
            toast("That picture could not be saved.", "err");
          });
        });
        picker.click();
      });
    });

    box.classList.toggle("required-missing",
      box.getAttribute("data-required") === "true" && list.length === 0 && !isTeacher());
  }

  function refreshAllThumbs() {
    $$(".uploader").forEach(renderThumbs);
  }

  /* =======================================================================
     VALIDATION — what counts as finished
     ======================================================================= */
  function bool(key) { return getResponse(key) === true; }

  var VALIDATORS = {
    starter: function () {
      var errs = [];
      if (len(getResponse("starter_sig1_msg")) < 2) errs.push("Write a signal for situation 1 (you do not understand the task).");
      if (len(getResponse("starter_sig2_msg")) < 2) errs.push("Write a signal for situation 2 (you want your work checked).");
      if (len(getResponse("starter_sig3_msg")) < 2) errs.push("Write a signal for situation 3 (you want to speak privately).");
      if (len(getResponse("starter_ipo_input")) < 4) errs.push("Input: write what the student would do.");
      if (len(getResponse("starter_ipo_process")) < 4) errs.push("Processing: write what the program would check.");
      if (len(getResponse("starter_ipo_output")) < 4) errs.push("Output: write what the micro:bit would show.");
      return errs;
    },
    m1a: function () {
      var errs = [];
      if (!bool("m1a_folder_made")) errs.push("Tick that you made the Week 1 Help Button folder.");
      if (!bool("m1a_file_saved")) errs.push("Tick that you saved your Python file in that folder.");
      if (!bool("m1a_name_matches")) errs.push("Tick that your filename matches the format.");
      return errs;
    },
    m1b: function () {
      var errs = [];
      if (len(getResponse("m1b_predict_a")) < 4) errs.push("Predict what button A will do.");
      if (len(getResponse("m1b_predict_b")) < 4) errs.push("Predict what button B will do.");
      if (len(getResponse("m1b_which_checks")) < 3) errs.push("Write which part of the code checks the button.");
      if (len(getResponse("m1b_which_output")) < 3) errs.push("Write which part creates the output.");
      if (!bool("m1b_a_worked")) errs.push("Tick that button A worked in the simulator.");
      if (!bool("m1b_b_worked")) errs.push("Tick that button B worked in the simulator.");
      if (!bool("m1b_different")) errs.push("Tick that both buttons gave different results.");
      return errs;
    },
    m1c: function () {
      var errs = [];
      var chosen = getResponse("m1c_changes");
      if (!Array.isArray(chosen) || chosen.length < 2) errs.push("Choose at least two changes.");
      if (len(getResponse("m1c_explain")) < 10) errs.push("Write a short explanation of what you changed.");
      if (!bool("m1c_both_work")) errs.push("Tick that both buttons still work.");
      if (imagesForSlot("m1c_sim_screenshot").length < 1) errs.push("Upload a new simulator screenshot.");
      return errs;
    },
    m2a: function () {
      var errs = [];
      if (len(getResponse("m2a_number")) < 1) errs.push("Write your micro:bit number.");
      if (!txt(getResponse("m2a_a_worked"))) errs.push("Say whether button A worked on the real micro:bit.");
      if (!txt(getResponse("m2a_b_worked"))) errs.push("Say whether button B worked on the real micro:bit.");
      if (!txt(getResponse("m2a_matched"))) errs.push("Say whether the real micro:bit matched the simulator.");
      return errs;
    },
    m2b: function () {
      var errs = [];
      if (len(getResponse("m2b_a_meaning")) < 2) errs.push("Write what your partner thought button A meant.");
      if (len(getResponse("m2b_b_meaning")) < 2) errs.push("Write what your partner thought button B meant.");
      if (len(getResponse("m2b_easiest")) < 2) errs.push("Write which message was easiest to understand.");
      if (len(getResponse("m2b_slow")) < 2) errs.push("Write whether anything was slow or confusing (“nothing” is a fine answer).");
      if (len(getResponse("m2b_suggestion")) < 4) errs.push("Write your partner's suggestion.");
      return errs;
    },
    m2c: function () {
      var errs = [];
      if (!txt(getResponse("m2c_worked_well"))) errs.push("Say whether your first choices worked well.");
      if (len(getResponse("m2c_from")) < 2) errs.push("Write what you changed.");
      if (len(getResponse("m2c_to")) < 2) errs.push("Write what you changed it to.");
      if (len(getResponse("m2c_because")) < 6) errs.push("Write why you changed it.");
      if (!bool("m2c_retested")) errs.push("Tick that you sent the new code and tested both buttons again.");
      if (imagesForSlot("m2c_evidence").length < 1) errs.push("Upload evidence of your improved version.");
      return errs;
    },
    ext: function () { return []; },
    plenary: function () {
      var errs = [];
      if (len(getResponse("ple_quickest")) < 2) errs.push("Write which signal your partner understood most quickly.");
      if (len(getResponse("ple_changed")) < 2) errs.push("Write what you changed after your partner tried it.");
      if (len(getResponse("ple_ipo_input")) < 3) errs.push("Finish the Input sentence.");
      if (len(getResponse("ple_ipo_process")) < 3) errs.push("Finish the Processing sentence.");
      if (len(getResponse("ple_ipo_output")) < 3) errs.push("Finish the Output sentence.");
      if (len(getResponse("ple_best")) < 3) errs.push("Write your best improvement.");
      if (len(getResponse("ple_best_because")) < 4) errs.push("Write why it was your best improvement.");
      if (len(getResponse("ple_exit")) < 4) errs.push("Answer the exit question.");
      return errs;
    },
    "return": function () {
      var errs = [];
      if (!bool("ret_microbit")) errs.push("Tick that the micro:bit was returned.");
      if (!bool("ret_cable")) errs.push("Tick that the cable was returned.");
      if (!bool("ret_storage")) errs.push("Tick that you used the correct storage space.");
      return errs;
    },
    review: function () { return []; }
  };

  function extensionAttempted() {
    return bool("ext_test_a") || bool("ext_test_b") || bool("ext_test_ab") ||
      len(getResponse("ext_explain")) > 2 ||
      (Array.isArray(getResponse("ext_choices")) && getResponse("ext_choices").length > 0) ||
      imagesForSlot("ext_evidence").length > 0;
  }

  function sectionComplete(id) {
    if (id === "ext") return extensionAttempted();
    if (id === "review") return state.exports.pdfCount > 0;
    var errs = VALIDATORS[id] ? VALIDATORS[id]() : [];
    return errs.length === 0;
  }

  function recomputeCompletion() {
    ORDER.forEach(function (id) {
      var was = state.sections[id].complete;
      var now = sectionComplete(id);
      state.sections[id].complete = now;
      if (now && !was) {
        state.sections[id].completedAt = new Date().toISOString();
        logEvent("section-complete", id);
      }
      if (!now) state.sections[id].completedAt = null;
    });
  }

  function isTeacher() { return !!(state && state.student.isTeacherPreview); }

  function canEnter(id) {
    if (isTeacher()) return true;
    var sec = sectionById(id);
    if (!sec) return false;
    return sec.prereq.every(function (p) { return state.sections[p] && state.sections[p].complete; });
  }

  /* =======================================================================
     NAVIGATION
     ======================================================================= */
  function buildStepNav() {
    var wrap = $("#stepNavInner");
    wrap.innerHTML = "";
    SECTIONS.forEach(function (sec) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "step-btn" + (sec.optional ? " is-optional" : "");
      btn.setAttribute("data-goto", sec.id);
      btn.innerHTML = '<span class="num">' + sec.num + "</span><span>" + esc(sec.short) + "</span>";
      btn.addEventListener("click", function () {
        if (btn.classList.contains("is-locked")) {
          toast("Finish the section you are on first.", "err");
          return;
        }
        goTo(sec.id);
      });
      wrap.appendChild(btn);
    });
  }

  function updateStepNav() {
    $$("#stepNavInner .step-btn").forEach(function (btn) {
      var id = btn.getAttribute("data-goto");
      var done = state.sections[id] && state.sections[id].complete;
      var locked = !canEnter(id);
      btn.classList.toggle("is-done", !!done);
      btn.classList.toggle("is-locked", locked);
      btn.setAttribute("aria-current", state.currentSection === id ? "true" : "false");
      btn.setAttribute("aria-disabled", locked ? "true" : "false");
      var sec = sectionById(id);
      btn.title = sec.label + (locked ? " — finish the earlier sections first" : (done ? " — finished" : ""));
    });
  }

  function updateProgress() {
    var required = SECTIONS.filter(function (s) { return !s.optional && s.id !== "review"; });
    var done = required.filter(function (s) { return state.sections[s.id].complete; }).length;
    var pct = Math.round((done / required.length) * 100);
    $("#progressFill").style.width = pct + "%";
    var bar = $("#progressBar");
    bar.setAttribute("aria-valuenow", String(pct));
    bar.setAttribute("aria-valuetext", done + " of " + required.length + " sections finished");
  }

  function goTo(id, opts) {
    opts = opts || {};
    if (!canEnter(id)) {
      toast("That section is not open yet. Finish the current section first.", "err");
      return false;
    }
    state.currentSection = id;
    state.sections[id].visited = true;   // visiting does not mean finished
    logEvent("open-section", id);

    $$(".section").forEach(function (sec) {
      sec.classList.toggle("is-active", sec.getAttribute("data-section") === id);
    });
    if (id === "review") renderReview();
    if (id === "m2c") renderM2CRecap();
    if (id === "return") renderReturnRecap();
    if (id === "m1a") $("#suggestedFilename").textContent = pyFilename();

    updateStepNav();
    refreshDerived();
    if (!opts.silent) {
      global.scrollTo({ top: 0, behavior: "auto" });
      var main = $("#main");
      if (main) main.focus({ preventScroll: true });
    }
    scheduleSave();
    return true;
  }

  function neighbour(id, dir) {
    var idx = ORDER.indexOf(id);
    var next = idx + dir;
    while (next >= 0 && next < ORDER.length) {
      var candidate = ORDER[next];
      if (canEnter(candidate) || isTeacher()) return candidate;
      next += dir;
    }
    return null;
  }

  function showErrors(id, errs) {
    var box = $("#err-" + id);
    if (!box) return;
    if (!errs.length) { box.hidden = true; box.innerHTML = ""; return; }
    box.hidden = false;
    box.innerHTML = "<strong>Before you move on:</strong><ul>" +
      errs.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>";
  }

  function handleNext(fromId) {
    recomputeCompletion();
    var errs = VALIDATORS[fromId] ? VALIDATORS[fromId]() : [];
    if (errs.length && !isTeacher() && fromId !== "ext") {
      showErrors(fromId, errs);
      var box = $("#err-" + fromId);
      if (box) box.scrollIntoView({ block: "center" });
      toast("A few things are still missing.", "err");
      return;
    }
    showErrors(fromId, []);
    var nextId = ORDER[ORDER.indexOf(fromId) + 1];
    if (!nextId) return;
    if (!canEnter(nextId) && !isTeacher()) {
      // e.g. the optional extension is next but not attempted — jump past it
      var alt = neighbour(fromId, 1);
      if (alt) nextId = alt;
    }
    goTo(nextId);
  }

  function bindNav() {
    $$('[data-nav="next"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sec = btn.closest(".section").getAttribute("data-section");
        handleNext(sec);
      });
    });
    $$('[data-nav="back"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sec = btn.closest(".section").getAttribute("data-section");
        var prev = neighbour(sec, -1);
        if (prev) goTo(prev);
      });
    });
    $$('[data-nav="goto"]').forEach(function (btn) {
      btn.addEventListener("click", function () { goTo(btn.getAttribute("data-target")); });
    });
  }

  /* =======================================================================
     DERIVED DISPLAYS (checkpoint, recaps, header)
     ======================================================================= */
  function refreshDerived() {
    if (!state) return;
    recomputeCompletion();
    updateStepNav();
    updateProgress();
    updateCheckpoint();
    updateHints();
    $$(".uploader[data-required=true]").forEach(function (box) {
      var slot = box.getAttribute("data-slot");
      box.classList.toggle("required-missing", imagesForSlot(slot).length === 0 && !isTeacher());
    });
  }

  function updateCheckpoint() {
    var cp = $("#m1Checkpoint");
    if (!cp) return;
    var chosen = getResponse("m1c_changes");
    var results = {
      a: bool("m1b_a_worked"),
      b: bool("m1b_b_worked"),
      diff: bool("m1b_different"),
      changes: Array.isArray(chosen) && chosen.length >= 2,
      file: bool("m1a_folder_made") && bool("m1a_file_saved") && bool("m1a_name_matches")
    };
    $$(".cp-item", cp).forEach(function (item) {
      var key = item.getAttribute("data-cp");
      var done = !!results[key];
      item.classList.toggle("done", done);
      item.classList.toggle("todo", !done);
      $(".cp-mark", item).textContent = done ? "✓" : "–";
    });
  }

  function updateHints() {
    $$("[data-hint]").forEach(function (el) {
      var id = el.getAttribute("data-hint");
      if (id === "ext") return;
      var errs = VALIDATORS[id] ? VALIDATORS[id]() : [];
      if (!errs.length) {
        el.textContent = "This section is finished — you can move on.";
        el.style.color = "var(--ok)";
        el.style.fontWeight = "700";
      } else {
        el.style.color = "";
        el.style.fontWeight = "";
      }
    });
  }

  function renderM2CRecap() {
    var labels = {
      words: "changed the words", picture: "changed the picture", speed: "changed the speed",
      start: "changed the starting screen", finish: "added a finishing picture"
    };
    var chosen = getResponse("m1c_changes");
    var box = $("#m2cPrevChoices");
    if (box) {
      if (Array.isArray(chosen) && chosen.length) {
        box.innerHTML = chosen.map(function (c) {
          return '<span class="chip" style="cursor:default">' + esc(labels[c] || c) + "</span>";
        }).join("");
      } else {
        box.innerHTML = '<span class="chip" style="cursor:default">No changes recorded yet</span>';
      }
    }
    var recap = $("#m2cPartnerRecap");
    if (recap) {
      var s = txt(getResponse("m2b_suggestion"));
      recap.innerHTML = '<span class="note-title">Your partner said</span>' +
        (s ? esc(s) : "Nothing recorded yet — go back to Part B if your partner has tried it.");
    }
  }

  function renderReturnRecap() {
    var el = $("#returnNumberRecap");
    if (!el) return;
    var n = txt(getResponse("m2a_number"));
    el.textContent = n ? "Your micro:bit number: " + n : "";
  }

  function updateHeader() {
    var chip = $("#headerStudent");
    if (!chip || !state) return;
    chip.innerHTML = esc(state.student.name) + ' <span class="sep">·</span> ' + esc(state.student.class);
  }

  /* =======================================================================
     REVIEW
     ======================================================================= */
  function qa(question, answer) {
    var a = Array.isArray(answer) ? answer.join(", ") : txt(answer);
    return '<div class="qa"><div class="q">' + esc(question) + '</div><div class="a' + (a ? "" : " empty") + '">' +
      (a ? esc(a) : "Not answered yet") + "</div></div>";
  }

  function imagesBlock(slot) {
    var list = imagesForSlot(slot);
    if (!list.length) return '<p style="font-size:0.85rem;color:var(--ink-3)">No picture uploaded.</p>';
    return '<div class="review-images">' + list.map(function (m) {
      var rec = imageCache[m.id];
      return "<figure><img src=\"" + (rec ? rec.dataUrl : "") + "\" alt=\"" + esc(m.label || "Evidence") +
        "\" data-lightbox=\"" + esc(m.label || "Evidence") + "\"><figcaption>" + esc(m.label || "Evidence") + "</figcaption></figure>";
    }).join("") + "</div>";
  }

  function blockHead(title, id, optional) {
    var done = state.sections[id] ? state.sections[id].complete : false;
    var badge = optional
      ? (done ? '<span class="badge done">Completed</span>' : '<span class="badge opt">Optional — not attempted</span>')
      : (done ? '<span class="badge done">Finished</span>' : '<span class="badge todo">Not finished</span>');
    var jump = '<button type="button" class="btn btn-small no-print" data-review-goto="' + id + '">Go to section</button>';
    return "<h3>" + esc(title) + '<span class="status">' + badge + " " + jump + "</span></h3>";
  }

  function renderReview() {
    recomputeCompletion();
    var r = state.responses;
    var html = "";

    var missing = SECTIONS.filter(function (s) {
      return !s.optional && s.id !== "review" && !state.sections[s.id].complete;
    });

    html += '<div class="card">' +
      "<h3>Your details</h3>" +
      qa("Name", state.student.name) +
      qa("Class", state.student.class) +
      qa("Date", niceDate(new Date().toISOString())) +
      qa("WAGBA", "Create, test and improve a micro:bit help button using Python.") +
      qa("Python filename", pyFilename()) +
      "</div>";

    if (missing.length) {
      html += '<div class="validation" style="display:block">' +
        "<strong>These sections are not finished yet:</strong><ul>" +
        missing.map(function (s) {
          return '<li>' + esc(s.label) + ' — <button type="button" class="btn btn-small no-print" data-review-goto="' + s.id + '">Go and finish it</button></li>';
        }).join("") + "</ul></div>";
    } else {
      html += '<div class="note good"><span class="note-title">Everything is finished</span>You can export your PDF and submit it in Teams.</div>';
    }

    html += '<div class="review-block">' + blockHead("Starter — your help signals", "starter") + '<div class="review-body">' +
      qa("1. You do not understand the task", r.starter_sig1_msg) +
      qa("Picture idea", r.starter_sig1_pic) +
      qa("2. You want your work checked", r.starter_sig2_msg) +
      qa("Picture idea", r.starter_sig2_pic) +
      qa("3. You want to speak privately", r.starter_sig3_msg) +
      qa("Picture idea", r.starter_sig3_pic) +
      qa("Input — the student would", r.starter_ipo_input) +
      qa("Processing — the program would check", r.starter_ipo_process) +
      qa("Output — the micro:bit would show", r.starter_ipo_output) +
      "</div></div>";

    html += '<div class="review-block">' + blockHead("Main 1 · A — Saving your file", "m1a") + '<div class="review-body">' +
      qa("Filename used", pyFilename()) +
      qa("Folder made", r.m1a_folder_made ? "Yes" : "Not ticked") +
      qa("File saved", r.m1a_file_saved ? "Yes" : "Not ticked") +
      qa("Filename matches the format", r.m1a_name_matches ? "Yes" : "Not ticked") +
      imagesBlock("m1a_file_screenshot") +
      "</div></div>";

    html += '<div class="review-block">' + blockHead("Main 1 · B — First version", "m1b") + '<div class="review-body">' +
      qa("Prediction: button A", r.m1b_predict_a) +
      qa("Prediction: button B", r.m1b_predict_b) +
      qa("The part that checks the button", r.m1b_which_checks) +
      qa("The part that creates the output", r.m1b_which_output) +
      qa("Simulator: button A worked", r.m1b_a_worked ? "Yes" : "Not ticked") +
      qa("Simulator: button B worked", r.m1b_b_worked ? "Yes" : "Not ticked") +
      qa("Both buttons gave different results", r.m1b_different ? "Yes" : "Not ticked") +
      imagesBlock("m1b_sim_screenshot") +
      "</div></div>";

    var labels = { words: "Changed the words", picture: "Changed the picture", speed: "Changed the speed", start: "Changed the starting screen", finish: "Added a finishing picture" };
    var chosenList = Array.isArray(r.m1c_changes) ? r.m1c_changes.map(function (c) { return labels[c] || c; }) : [];
    html += '<div class="review-block">' + blockHead("Main 1 · C — Your changes", "m1c") + '<div class="review-body">' +
      qa("Changes chosen", chosenList) +
      qa("What I changed and why", r.m1c_explain) +
      qa("Both buttons still work", r.m1c_both_work ? "Yes" : "Not ticked") +
      imagesBlock("m1c_sim_screenshot") +
      "</div></div>";

    html += '<div class="review-block">' + blockHead("Main 2 · A — Real micro:bit", "m2a") + '<div class="review-body">' +
      qa("micro:bit number", r.m2a_number) +
      qa("Button A worked", r.m2a_a_worked) +
      qa("Button B worked", r.m2a_b_worked) +
      qa("Matched the simulator", r.m2a_matched) +
      qa("Swapped roles", r.m2a_swapped ? "Yes" : "Not ticked") +
      imagesBlock("m2a_device_photo") +
      "</div></div>";

    html += '<div class="review-block">' + blockHead("Main 2 · B — Partner feedback", "m2b") + '<div class="review-body">' +
      qa("Partner thought button A meant", r.m2b_a_meaning) +
      qa("Partner thought button B meant", r.m2b_b_meaning) +
      qa("Easiest message to understand", r.m2b_easiest) +
      qa("Anything slow or confusing", r.m2b_slow) +
      qa("Partner's suggestion", r.m2b_suggestion) +
      "</div></div>";

    html += '<div class="review-block">' + blockHead("Main 2 · C — Improvement", "m2c") + '<div class="review-body">' +
      qa("Did the first choices work well?", r.m2c_worked_well) +
      qa("I changed", r.m2c_from) +
      qa("to", r.m2c_to) +
      qa("because", r.m2c_because) +
      qa("Sent again and re-tested", r.m2c_retested ? "Yes" : "Not ticked") +
      imagesBlock("m2c_evidence") +
      "</div></div>";

    if (extensionAttempted()) {
      html += '<div class="review-block">' + blockHead("Optional extension — Can I talk?", "ext", true) + '<div class="review-body">' +
        qa("Tested button A only", r.ext_test_a ? "Yes" : "No") +
        qa("Tested button B only", r.ext_test_b ? "Yes" : "No") +
        qa("Tested A and B together", r.ext_test_ab ? "Yes" : "No") +
        qa("Extra ideas used", r.ext_choices) +
        qa("What I added", r.ext_explain) +
        imagesBlock("ext_evidence") +
        "</div></div>";
    }

    html += '<div class="review-block">' + blockHead("Plenary", "plenary") + '<div class="review-body">' +
      qa("Signal understood most quickly", r.ple_quickest) +
      qa("Changed after the partner test", r.ple_changed) +
      qa("Real micro:bit vs simulator", r.ple_real_vs_sim) +
      qa("Input: the student presses", r.ple_ipo_input) +
      qa("Processing: the program checks", r.ple_ipo_process) +
      qa("Output: the micro:bit shows", r.ple_ipo_output) +
      qa("Best improvement", r.ple_best) +
      qa("because", r.ple_best_because) +
      qa("Another classroom problem a micro:bit could help with", r.ple_exit) +
      "</div></div>";

    html += '<div class="review-block">' + blockHead("Equipment returned", "return") + '<div class="review-body">' +
      qa("micro:bit returned", r.ret_microbit ? "Yes" : "Not ticked") +
      qa("Cable returned", r.ret_cable ? "Yes" : "Not ticked") +
      qa("Correct storage space used", r.ret_storage ? "Yes" : "Not ticked") +
      "</div></div>";

    $("#reviewContent").innerHTML = html;

    $$("[data-review-goto]").forEach(function (btn) {
      btn.addEventListener("click", function () { goTo(btn.getAttribute("data-review-goto")); });
    });
  }

  /* =======================================================================
     LIGHTBOX + IMAGE FALLBACK
     ======================================================================= */
  function bindLightbox() {
    document.addEventListener("click", function (ev) {
      var img = ev.target.closest ? ev.target.closest("[data-lightbox]") : null;
      if (!img || img.tagName !== "IMG") return;
      var dlg = $("#lightbox");
      $("#lightboxImg").src = img.currentSrc || img.src;
      $("#lightboxImg").alt = img.alt || "";
      $("#lightboxTitle").textContent = img.getAttribute("data-lightbox") || "Picture";
      openDialog(dlg, true);
    });
    $("#lightboxClose").addEventListener("click", function () { closeDialog($("#lightbox")); });
    $("#lightbox").addEventListener("click", function (ev) {
      if (ev.target === $("#lightbox")) closeDialog($("#lightbox"));
    });

    // make guide pictures reachable by keyboard
    $$("figure.guide img").forEach(function (img) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); img.click(); }
      });
      img.addEventListener("error", function () {
        var fig = img.closest("figure");
        var fallback = document.createElement("div");
        fallback.className = "img-fallback";
        fallback.innerHTML = "<strong>Picture did not load.</strong><br>" + esc(img.getAttribute("data-fallback") || img.alt);
        fig.replaceChild(fallback, img);
      });
    });
  }

  /* =======================================================================
     EXPORT / IMPORT
     ======================================================================= */
  function collectImagesForExport() {
    return global.LessonStorage.getImages(state.images.map(function (m) { return m.id; }))
      .then(function (records) {
        var byId = {};
        records.forEach(function (rec) { byId[rec.id] = rec; imageCache[rec.id] = rec; });
        return byId;
      });
  }

  function exportPdf() {
    setSaveState("Making your PDF…");
    return collectImagesForExport().then(function (byId) {
      var filename = baseExportName() + ".pdf";
      lastPdfName = filename;
      return global.LessonExport.buildPdf({
        state: state,
        imagesById: byId,
        pyFilename: pyFilename(),
        config: CONFIG,
        filename: filename,
        extensionAttempted: extensionAttempted()
      });
    }).then(function () {
      state.exports.pdfCount += 1;
      state.exports.lastPdfAt = new Date().toISOString();
      logEvent("pdf-export", lastPdfName);
      $("#teamsPanel").hidden = false;
      $("#teamsPanel").scrollIntoView({ block: "start" });
      toast("PDF saved to your downloads: " + lastPdfName, "ok");
      refreshDerived();
      return saveNow();
    }).catch(function (err) {
      console.error(err);
      toast("The PDF could not be made. Use the Print / save as PDF button instead.", "err");
      setSaveState("Saved", "saved");
    });
  }

  function exportJson() {
    return collectImagesForExport().then(function (byId) {
      var payload = {
        fileType: "y9-t1w1-helpbutton-progress",
        lessonId: CONFIG.LESSON_ID,
        schemaVersion: CONFIG.SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        student: state.student,
        currentSection: state.currentSection,
        sections: state.sections,
        responses: state.responses,
        images: state.images.map(function (m) {
          var rec = byId[m.id];
          var copy = {};
          Object.keys(m).forEach(function (k) { copy[k] = m[k]; });
          copy.dataUrl = rec ? rec.dataUrl : null;
          return copy;
        }),
        events: state.events,
        exports: state.exports
      };
      var text = JSON.stringify(payload);
      var blob = new Blob([text], { type: "application/json" });
      if (blob.size > CONFIG.LARGE_JSON_WARN_BYTES) {
        toast("This progress file is large (" + Math.round(blob.size / 1048576) + " MB) because it contains your pictures. It may take a moment to load again.", "err");
      }
      downloadBlob(blob, baseExportName() + "_Progress.json");
      state.exports.jsonCount += 1;
      state.exports.lastJsonAt = new Date().toISOString();
      logEvent("json-export", null);
      toast("Progress file downloaded.", "ok");
      return saveNow();
    }).catch(function (err) {
      console.error(err);
      toast("The progress file could not be made.", "err");
    });
  }

  function importJsonFile(file) {
    return file.text().then(function (text) {
      var data;
      try { data = JSON.parse(text); }
      catch (e) { throw new Error("This file is not a progress file. It could not be read."); }
      if (!data || data.fileType !== "y9-t1w1-helpbutton-progress" || data.lessonId !== CONFIG.LESSON_ID) {
        throw new Error("This is not a Week 1 Classroom Help Button progress file.");
      }
      if (!data.student || !data.responses || !data.sections) {
        throw new Error("This progress file is missing some information.");
      }
      var name = esc(data.student.name || "Unknown");
      var klass = esc(data.student.class || "Unknown");
      var when = data.exportedAt ? new Date(data.exportedAt).toLocaleString("en-GB") : "unknown date";
      var count = (data.images || []).length;
      return confirmDialog(
        "Load this progress file?",
        "<p><strong>Name:</strong> " + name + "<br><strong>Class:</strong> " + klass +
        "<br><strong>Saved:</strong> " + esc(when) + "<br><strong>Pictures:</strong> " + count + "</p>" +
        "<p>This will replace any work currently saved on this computer.</p>",
        "Load it"
      ).then(function (yes) {
        if (!yes) return false;
        return applyImported(data).then(function () { return true; });
      });
    });
  }

  function applyImported(data) {
    profileKey = /^teacher$/i.test(txt(data.student.name)) ? "teacher" : "student";
    var fresh = newState(data.student.name, data.student.class, !!data.student.isTeacherPreview);
    fresh.student = data.student;
    fresh.responses = data.responses || {};
    fresh.sections = Object.assign(fresh.sections, data.sections || {});
    fresh.currentSection = data.currentSection || "starter";
    fresh.events = data.events || [];
    fresh.exports = data.exports || fresh.exports;
    fresh.images = [];

    imageCache = {};
    var jobs = (data.images || []).map(function (img) {
      if (!img.dataUrl) return Promise.resolve();
      var rec = {};
      Object.keys(img).forEach(function (k) { rec[k] = img[k]; });
      rec.id = profileKey + ":" + String(img.id).split(":").pop();
      imageCache[rec.id] = rec;
      var meta = {};
      Object.keys(rec).forEach(function (k) { if (k !== "dataUrl") meta[k] = rec[k]; });
      fresh.images.push(meta);
      return global.LessonStorage.putImage(rec);
    });

    return Promise.all(jobs).then(function () {
      state = fresh;
      return saveNow();
    }).then(function () {
      startLesson(true);
      toast("Progress loaded. Carry on where you left off.", "ok");
    });
  }

  /* =======================================================================
     RESET
     ======================================================================= */
  function resetProgress() {
    confirmDialog(
      "Reset your progress?",
      "<p>Everything you have written and every picture you uploaded will be deleted from this computer. This cannot be undone.</p>" +
      "<p>If you want a copy first, cancel and use <strong>Download progress file</strong>.</p>",
      "Delete my work"
    ).then(function (yes) {
      if (!yes) return;
      global.LessonStorage.clearProfile(profileKey).then(function () {
        imageCache = {};
        state = null;
        global.location.reload();
      });
    });
  }

  /* =======================================================================
     ENTRY
     ======================================================================= */
  function validateEntry() {
    var nameEl = $("#entryName"), classEl = $("#entryClass");
    var name = txt(nameEl.value), klass = txt(classEl.value);
    var teacher = /^teacher$/i.test(name);
    var ok = true;

    if (name.length < 2) {
      $("#entryNameErr").hidden = false;
      $("#entryNameErr").textContent = "Please type your full name.";
      nameEl.classList.add("invalid");
      ok = false;
    } else {
      $("#entryNameErr").hidden = true;
      nameEl.classList.remove("invalid");
    }

    if (!teacher && klass.length < 1) {
      $("#entryClassErr").hidden = false;
      $("#entryClassErr").textContent = "Please type your class, for example 9T.";
      classEl.classList.add("invalid");
      ok = false;
    } else {
      $("#entryClassErr").hidden = true;
      classEl.classList.remove("invalid");
    }
    if (!ok) return null;
    return { name: name, klass: teacher ? (klass || "Teacher Preview") : klass, teacher: teacher };
  }

  function startLesson(fromImport) {
    $("#entryScreen").hidden = true;
    $("#appHeader").hidden = false;
    $("#stepNav").hidden = false;
    $("#lessonLayout").hidden = false;
    $("#appFooter").hidden = false;
    document.title = state.student.name + " — " + CONFIG.LESSON_TITLE;

    updateHeader();
    applyResponsesToForm();
    refreshAllThumbs();
    $("#suggestedFilename").textContent = pyFilename();
    $("#codeBarFilename").textContent = pyFilename();
    renderM2CRecap();
    renderReturnRecap();
    buildStepNav();
    var target = state.currentSection && canEnter(state.currentSection) ? state.currentSection : "starter";
    goTo(target, { silent: !fromImport });
    refreshDerived();
    if ($("#teamsPanel")) $("#teamsPanel").hidden = state.exports.pdfCount === 0;
  }

  function loadImagesIntoCache() {
    if (!state || !state.images.length) return Promise.resolve();
    return global.LessonStorage.getImages(state.images.map(function (m) { return m.id; }))
      .then(function (records) {
        records.forEach(function (rec) { imageCache[rec.id] = rec; });
        // drop any metadata whose picture went missing (e.g. storage cleared)
        state.images = state.images.filter(function (m) { return !!imageCache[m.id]; });
      });
  }

  function bindEntry() {
    $("#entryForm").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var details = validateEntry();
      if (!details) return;
      profileKey = details.teacher ? "teacher" : "student";
      global.LessonStorage.loadRecord(profileKey).then(function (saved) {
        if (saved && txt(saved.student.name).toLowerCase() === details.name.toLowerCase()) {
          state = saved;
          state.student.class = details.klass;
          return loadImagesIntoCache();
        }
        state = newState(details.name, details.klass, details.teacher);
        return null;
      }).then(function () {
        logEvent("lesson-start", null);
        return saveNow();
      }).then(function () { startLesson(false); });
    });

    $("#btnImportEntry").addEventListener("click", function () { $("#jsonFileInput").click(); });
    $("#jsonFileInput").addEventListener("change", function () {
      var f = $("#jsonFileInput").files && $("#jsonFileInput").files[0];
      $("#jsonFileInput").value = "";
      if (!f) return;
      importJsonFile(f).catch(function (err) {
        toast(err.message || "That file could not be loaded.", "err");
      });
    });
  }

  function offerResume() {
    return global.LessonStorage.loadRecord("student").then(function (saved) {
      if (!saved || !saved.student) return;
      var done = ORDER.filter(function (id) { return saved.sections[id] && saved.sections[id].complete; }).length;
      $("#resumeBox").hidden = false;
      $("#resumeText").textContent = saved.student.name + " (" + saved.student.class + ") — " +
        done + " section" + (done === 1 ? "" : "s") + " finished. Last saved " +
        new Date(saved.updatedAt).toLocaleString("en-GB") + ".";
      $("#btnResume").addEventListener("click", function () {
        profileKey = "student";
        state = saved;
        loadImagesIntoCache().then(function () { startLesson(false); });
      });
      $("#btnClearSaved").addEventListener("click", function () {
        confirmDialog("Start again?", "<p>The saved work on this computer will be deleted.</p>", "Delete it")
          .then(function (yes) {
            if (!yes) return;
            global.LessonStorage.clearProfile("student").then(function () { global.location.reload(); });
          });
      });
    });
  }

  /* =======================================================================
     MISC BINDINGS
     ======================================================================= */
  function bindButtons() {
    $$("[data-copy-code]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        copyText(codeSource(btn.getAttribute("data-copy-code")))
          .then(function () { toast("Code copied. Paste it into the editor.", "ok"); })
          .catch(function () { toast("Could not copy. Select the code and press Ctrl + C.", "err"); });
      });
    });

    $$("[data-download-code]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-download-code");
        var name = id === "code-ext"
          ? pyFilename().replace(/\.py$/, "_Extension.py")
          : pyFilename();
        downloadBlob(new Blob([codeSource(id)], { type: "text/x-python" }), name);
        toast("Downloaded " + name, "ok");
      });
    });

    var copyFile = $("#btnCopyFilename");
    if (copyFile) {
      copyFile.addEventListener("click", function () {
        copyText(pyFilename())
          .then(function () { toast("Filename copied.", "ok"); })
          .catch(function () { toast("Could not copy. Type it in by hand.", "err"); });
      });
    }

    [$("#editorLink"), $("#editorLink2")].forEach(function (a) {
      if (a) a.href = CONFIG.MICROBIT_EDITOR_URL;
    });

    $("#btnExportPdf").addEventListener("click", exportPdf);
    $("#btnExportJson").addEventListener("click", exportJson);
    $("#btnImportReview").addEventListener("click", function () { $("#jsonFileInput").click(); });
    $("#btnPrint").addEventListener("click", function () {
      collectImagesForExport().then(function (byId) {
        global.LessonExport.buildPrintView({
          state: state, imagesById: byId, pyFilename: pyFilename(),
          config: CONFIG, extensionAttempted: extensionAttempted()
        });
        setTimeout(function () { global.print(); }, 120);
      });
    });
    $("#btnResetTop").addEventListener("click", resetProgress);
    $("#btnResetBottom").addEventListener("click", resetProgress);

    global.addEventListener("beforeunload", function () {
      if (saveTimer) { clearTimeout(saveTimer); saveNow(); }
    });
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  function boot() {
    renderCodePanels();
    bindResponses();
    bindNav();
    bindLightbox();
    bindEntry();
    bindButtons();
    $$(".uploader").forEach(buildUploader);
    document.addEventListener("paste", handlePasteEvent);

    global.LessonStorage.init().then(function (idbOk) {
      if (!idbOk) {
        toast("This browser is limiting storage. Your writing is saved, but download a progress file before you finish.", "err");
      }
      return offerResume();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // exposed for the README's troubleshooting notes
  global.HelpButtonLesson = {
    config: CONFIG,
    getState: function () { return state; },
    goTo: function (id) { return goTo(id); }
  };
})(window);
