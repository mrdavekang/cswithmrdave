(function (global) {
  "use strict";

  var STAGES = [
    { id: "do-now", label: "Do Now" },
    { id: "learning", label: "Types of Learning" },
    { id: "main1", label: "Main Task 1" },
    { id: "main2", label: "Main Task 2" },
    { id: "pitstop", label: "Learning Pitstop" },
    { id: "plenary", label: "Plenary" },
    { id: "exit", label: "Exit Reflection" }
  ];
  var state = null;
  var profileKey = "student-redesign";
  var saveTimer = null;
  var imageCache = {};

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function text(v) { return String(v == null ? "" : v).trim(); }
  function safe(s) { return text(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function safeFile(s, fallback) { var out = text(s).replace(/[^A-Za-z0-9]+/g, ""); return out || fallback; }
  function uid() { return "img-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7); }

  function freshState(name, klass, support, teacher) {
    var stages = {};
    STAGES.forEach(function (s) { stages[s.id] = { visited: s.id === "do-now", complete: false }; });
    return {
      schemaVersion: 2,
      lessonId: "Y9-T1W1-HelpButton-Redesign",
      student: { name: name, class: klass, support: support || "standard", teacher: !!teacher, startedAt: new Date().toISOString() },
      currentStage: "do-now",
      responses: {}, stages: stages, images: [],
      exports: { pdf: 0, lastPdfAt: null },
      updatedAt: new Date().toISOString()
    };
  }

  function response(key) { return state && Object.prototype.hasOwnProperty.call(state.responses, key) ? state.responses[key] : ""; }
  function setResponse(key, value) { if (!state) return; state.responses[key] = value; refresh(); scheduleSave(); }
  function present(key) { var v = response(key); return v === true || (Array.isArray(v) ? v.length > 0 : text(v).length > 0); }

  function saveNow() {
    if (!state) return Promise.resolve();
    state.updatedAt = new Date().toISOString();
    $("#saveStatus").textContent = "Saving…";
    return global.LessonStorage.saveRecord(profileKey, state).then(function () {
      $("#saveStatus").textContent = "Saved " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    }).catch(function () { $("#saveStatus").textContent = "Save failed — download a backup"; });
  }
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 450); }

  var REQUIREMENTS = {
    "do-now": ["dn_signal_choice", "dn_reason", "dn_own_message", "dn_own_symbol", "dn_ipo_input", "dn_ipo_process", "dn_ipo_output"],
    learning: ["learn_type", "learn_evidence", "learn_strategy"],
    main1: ["m1_map_input", "m1_map_process", "m1_map_output", "m1_predict_a", "m1_predict_b", "m1_result_a", "m1_result_b", "m1_change_type", "m1_changed_to", "m1_change_reason", "m1_retest"],
    main2: ["m2_route", "m2_role", "m2_a_expected", "m2_a_actual", "m2_a_outcome", "m2_b_expected", "m2_b_actual", "m2_b_outcome", "m2_clearest", "m2_feedback", "m2_from", "m2_to", "m2_because", "m2_retest", "m2_retest_evidence"],
    pitstop: ["pit_phase", "pit_evidence"],
    plenary: ["ple_input", "ple_processing", "ple_retest", "ple_improvement", "ple_why"],
    exit: ["exit_confidence", "exit_phase", "exit_reflection", "exit_help"]
  };
  function missingFor(stage) { return (REQUIREMENTS[stage] || []).filter(function (k) { return !present(k); }); }
  function complete(stage) { return missingFor(stage).length === 0; }

  function refreshCompletion() {
    STAGES.forEach(function (s) { state.stages[s.id].complete = complete(s.id); });
    var count = STAGES.filter(function (s) { return state.stages[s.id].complete; }).length;
    $("#progressFill").style.width = Math.round(count / STAGES.length * 100) + "%";
    $$(".stage-button").forEach(function (b) { b.classList.toggle("complete", complete(b.dataset.go)); });
    $$("[data-completion-for]").forEach(function (el) {
      var stage = el.dataset.completionFor, missing = missingFor(stage);
      el.className = "completion-message " + (missing.length ? "incomplete" : "complete");
      el.textContent = missing.length ? missing.length + " response" + (missing.length === 1 ? "" : "s") + " still need attention. You may continue and return later." : "Stage evidence complete ✓";
    });
  }

  function refreshDerived() {
    var type = text(response("learn_type")), evidence = text(response("learn_evidence")), strategy = text(response("learn_strategy"));
    $("#personalGoal").innerHTML = type && evidence && strategy ? "<strong>Your Main Task goal:</strong> Build your " + safe(type.toLowerCase()) + " by " + safe(strategy) + ". Your evidence will be: “" + safe(evidence) + ".”" : "Choose the three boxes to create your Main Task goal.";
    var statuses = [response("m1_result_a"), response("m1_result_b")].join(" ");
    $("#debugCoach").hidden = !/(different|error|Not working)/i.test(statuses);
    var phase = text(response("pit_phase"));
    var moves = {
      "New Learning": ["Trace one button pathway", "Point to the input line, the condition and the output. Then predict one result before running it again."],
      "Consolidating": ["Explain without prompts", "Hide the worked explanation. Tell your partner how button A travels from input to output, then check the code."],
      "Treading Water": ["Increase the challenge", "Open the extension lab. Add A+B or transfer the design to a new user, then create a test that could expose a weakness."],
      "Drowning": ["Ask for targeted help", "Show your teacher: what you wanted to happen, what actually happened, the first error or problem, and one thing you already tried."]
    };
    if (moves[phase]) $("#pitNextStep").innerHTML = "<strong>" + safe(moves[phase][0]) + "</strong><p>" + safe(moves[phase][1]) + "</p>";
    else $("#pitNextStep").innerHTML = "<strong>Your next move will appear here.</strong><p>Select a learning phase above.</p>";
    var finished = STAGES.filter(function (s) { return complete(s.id); }).length;
    $("#reviewSummary").textContent = finished + " of " + STAGES.length + " lesson stages currently contain the expected evidence. Your PDF will still include honest partial outcomes and support needs.";
  }
  function refresh() { if (!state) return; refreshCompletion(); refreshDerived(); }

  function toast(message) { var el = document.createElement("div"); el.className = "toast"; el.textContent = message; $("#toastArea").appendChild(el); setTimeout(function () { el.remove(); }, 4000); }

  function buildNav() {
    var nav = $("#stageNav"); nav.innerHTML = "";
    STAGES.forEach(function (s, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "stage-button"; b.dataset.go = s.id; b.innerHTML = (i + 1) + " · " + s.label;
      b.addEventListener("click", function () { goTo(s.id); }); nav.appendChild(b);
    });
  }
  function goTo(id) {
    if (!state || !STAGES.some(function (s) { return s.id === id; })) return;
    $$(".lesson-stage").forEach(function (s) { s.hidden = s.dataset.stage !== id; });
    $$(".stage-button").forEach(function (b) { b.classList.toggle("current", b.dataset.go === id); });
    state.currentStage = id; state.stages[id].visited = true; scheduleSave(); refresh();
    window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(function () { $("#lessonMain").focus(); }, 80);
  }

  function restoreResponses() {
    $$("[data-response]").forEach(function (el) {
      var key = el.dataset.response, v = response(key);
      if (el.type === "checkbox") el.checked = v === true;
      else if (el.type !== "file") el.value = v == null ? "" : v;
    });
    $$("[data-radio-group]").forEach(function (group) {
      var name = $("input[type=radio]", group).name, value = response(name);
      $$("input[type=radio]", group).forEach(function (r) { r.checked = r.value === value; });
    });
    $("#supportToggle").checked = state.student.support === "supported";
    document.body.classList.toggle("support-on", $("#supportToggle").checked);
  }

  function bindResponses() {
    $$("[data-response]").forEach(function (el) {
      var eventName = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";
      el.addEventListener(eventName, function () { setResponse(el.dataset.response, el.type === "checkbox" ? el.checked : el.value); });
    });
    $$("[data-radio-group]").forEach(function (group) {
      $$("input[type=radio]", group).forEach(function (r) { r.addEventListener("change", function () { if (r.checked) setResponse(r.name, r.value); }); });
    });
  }

  function bindNavigation() {
    $$('[data-next]').forEach(function (b) { b.addEventListener("click", function () { var current = b.closest(".lesson-stage").dataset.stage; if (!complete(current)) toast("Your work is saved. Some responses still need attention; you can return to them before exporting."); goTo(b.dataset.next); }); });
    $$('[data-back]').forEach(function (b) { b.addEventListener("click", function () { goTo(b.dataset.back); }); });
  }

  function starterCode() { return $("#starterCode code").textContent.replace(/^\s+|\s+$/g, "") + "\n"; }
  function pyFilename() { return safeFile(state.student.class, "Class") + "_" + safeFile(state.student.name, "Student") + "_W1_HelpButton.py"; }
  function downloadBlob(content, type, filename) { var blob = content instanceof Blob ? content : new Blob([content], { type: type }); var url = URL.createObjectURL(blob); var a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }
  function bindCode() {
    $("#copyCode").addEventListener("click", function () { navigator.clipboard.writeText(starterCode()).then(function () { toast("Starter code copied."); }).catch(function () { toast("Copy was blocked. Select the code manually."); }); });
    $("#downloadCode").addEventListener("click", function () { downloadBlob(starterCode(), "text/x-python", pyFilename()); });
  }

  function resizeImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader(); reader.onerror = reject; reader.onload = function () {
        var img = new Image(); img.onerror = reject; img.onload = function () {
          var max = 1400, scale = Math.min(1, max / Math.max(img.width, img.height));
          var canvas = document.createElement("canvas"); canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", .8));
        }; img.src = reader.result;
      }; reader.readAsDataURL(file);
    });
  }
  function renderUpload(slot) {
    var wrap = $('[data-upload-preview="' + slot + '"]'); if (!wrap) return;
    var meta = state.images.find(function (m) { return m.slot === slot; }); wrap.innerHTML = "";
    if (!meta || !imageCache[meta.id]) return;
    var img = document.createElement("img"); img.src = imageCache[meta.id].dataUrl; img.alt = "Uploaded evidence preview"; wrap.appendChild(img);
    var rm = document.createElement("button"); rm.type = "button"; rm.className = "btn compact"; rm.textContent = "Remove image"; rm.addEventListener("click", function () { global.LessonStorage.deleteImage(meta.id); delete imageCache[meta.id]; state.images = state.images.filter(function (m) { return m.id !== meta.id; }); renderUpload(slot); scheduleSave(); }); wrap.appendChild(rm);
  }
  function bindUploads() {
    $$('[data-upload]').forEach(function (input) { input.addEventListener("change", function () { var file = input.files && input.files[0]; if (!file) return; var slot = input.dataset.upload; resizeImage(file).then(function (dataUrl) {
      var old = state.images.find(function (m) { return m.slot === slot; }); if (old) { global.LessonStorage.deleteImage(old.id); delete imageCache[old.id]; state.images = state.images.filter(function (m) { return m.slot !== slot; }); }
      var record = { id: profileKey + ":" + uid(), slot: slot, name: file.name, type: "image/jpeg", dataUrl: dataUrl, addedAt: new Date().toISOString() };
      imageCache[record.id] = record; state.images.push({ id: record.id, slot: slot, name: file.name, type: record.type, addedAt: record.addedAt });
      return global.LessonStorage.putImage(record).then(function () { renderUpload(slot); scheduleSave(); toast("Evidence image saved."); });
    }).catch(function () { toast("That image could not be saved. Try a smaller PNG or JPG."); }); }); });
  }
  function loadImages() { var ids = state.images.map(function (m) { return m.id; }); return global.LessonStorage.getImages(ids).then(function (list) { list.forEach(function (r) { imageCache[r.id] = r; }); state.images.forEach(function (m) { renderUpload(m.slot); }); }); }

  var WORDS = {
    input: ["Input", "Data or an action entering a system.", "Here, pressing button A or B is the input."],
    processing: ["Processing", "The work or decision carried out by the program.", "The program checks which button was pressed."],
    output: ["Output", "Information or an action produced by a system.", "The LED image and scrolling message are outputs."],
    condition: ["Condition", "A test that is either true or false.", "button_a.was_pressed() checks whether A was pressed."],
    prototype: ["Prototype", "An early working version used to learn what should improve.", "The first help button is a prototype, not a final product."],
    test: ["Test", "A planned check that compares an expected result with what actually happens.", "Press A, record the message, then compare it with the expected result."]
  };
  function bindWords() { $$('[data-word]').forEach(function (b) { b.addEventListener("click", function () { var w = WORDS[b.dataset.word]; $("#wordTitle").textContent = w[0]; $("#wordDefinition").textContent = w[1]; $("#wordExample").innerHTML = "<strong>In this project:</strong> " + safe(w[2]); $("#wordDialog").showModal(); }); }); $("#wordDialog .dialog-close").addEventListener("click", function () { $("#wordDialog").close(); }); }

  function bindGuideDialog() {
    var dialog = $("#guideDialog"), image = $("#guideDialogImage"), title = $("#guideDialogTitle");
    $$(".guide-open").forEach(function (button) {
      button.addEventListener("click", function () {
        image.src = button.dataset.guideSrc;
        image.alt = $("img", button).alt;
        title.textContent = button.dataset.guideTitle;
        dialog.showModal();
      });
    });
    $(".guide-dialog-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
  }

  var REVIEW_GROUPS = [
    ["Do Now", ["dn_signal_choice", "dn_reason", "dn_own_message", "dn_own_symbol", "dn_ipo_input", "dn_ipo_process", "dn_ipo_output"]],
    ["Types of Learning", ["learn_type", "learn_evidence", "learn_strategy"]],
    ["Main Task 1", ["m1_map_input", "m1_map_process", "m1_map_output", "m1_predict_a", "m1_predict_b", "m1_result_a", "m1_result_b", "m1_debug_action", "m1_change_type", "m1_changed_to", "m1_change_reason", "m1_retest"]],
    ["Main Task 2", ["m2_route", "m2_role", "m2_number", "m2_a_expected", "m2_a_actual", "m2_a_outcome", "m2_b_expected", "m2_b_actual", "m2_b_outcome", "m2_clearest", "m2_feedback", "m2_from", "m2_to", "m2_because", "m2_retest", "m2_retest_evidence", "ext_level", "ext_evidence"]],
    ["Learning Pitstop", ["pit_phase", "pit_evidence", "pit_action_taken", "pit_action_result"]],
    ["Plenary", ["ple_input", "ple_processing", "ple_retest", "ple_improvement", "ple_why"]],
    ["Exit Reflection", ["exit_confidence", "exit_phase", "exit_reflection", "exit_help", "exit_device_returned", "exit_cable_returned"]]
  ];
  var LABELS = {
    dn_signal_choice:"Chosen signal",dn_reason:"Reason",dn_own_message:"Own message",dn_own_symbol:"Own symbol",dn_ipo_input:"Input",dn_ipo_process:"Processing",dn_ipo_output:"Output",
    learn_type:"Strongest learning type",learn_evidence:"Evidence",learn_strategy:"Improvement strategy",m1_map_input:"Input line",m1_map_process:"Condition line",m1_map_output:"Output line",m1_predict_a:"Prediction A",m1_predict_b:"Prediction B",m1_result_a:"First test A",m1_result_b:"First test B",m1_debug_action:"Debug action",m1_change_type:"Change type",m1_changed_to:"Exact change",m1_change_reason:"Reason for change",m1_retest:"Retest result",
    m2_route:"Test route",m2_role:"Role",m2_number:"micro:bit number",m2_a_expected:"A expected",m2_a_actual:"A tester understood",m2_a_outcome:"A outcome",m2_b_expected:"B expected",m2_b_actual:"B tester understood",m2_b_outcome:"B outcome",m2_clearest:"Clearest signal",m2_feedback:"Tester comment",m2_from:"Changed from",m2_to:"Changed to",m2_because:"Improvement reason",m2_retest:"Retest result",m2_retest_evidence:"Retest evidence",ext_level:"Extension",ext_evidence:"Extension evidence",
    pit_phase:"Learning phase",pit_evidence:"Phase evidence",pit_action_taken:"Suggested action tried",pit_action_result:"Result of next move",ple_input:"Input check",ple_processing:"Processing check",ple_retest:"Retest check",ple_improvement:"Most useful improvement",ple_why:"Why it helped",exit_confidence:"WAGBA confidence",exit_phase:"Phase after action",exit_reflection:"Strategy/help reflection",exit_help:"Next lesson need",exit_device_returned:"Device returned",exit_cable_returned:"Cable returned"
  };
  function shownValue(v) { if (v === true) return "Yes"; if (v === false) return "No"; return text(v) || "Not answered"; }
  function renderReview() {
    var html = ""; REVIEW_GROUPS.forEach(function (g) { html += '<section class="answer-section"><h3>' + safe(g[0]) + "</h3><dl>"; g[1].forEach(function (k) { if (present(k) || (k.indexOf("ext_") !== 0 && k.indexOf("m1_debug") !== 0)) html += "<dt>" + safe(LABELS[k] || k) + "</dt><dd>" + safe(shownValue(response(k))) + "</dd>"; }); html += "</dl></section>"; }); $("#answerReview").innerHTML = html;
  }

  function bindExport() {
    $("#reviewAnswers").addEventListener("click", function () { renderReview(); $("#answerReview").hidden = !$("#answerReview").hidden; $("#reviewAnswers").textContent = $("#answerReview").hidden ? "Review my answers" : "Hide answer review"; });
    $("#downloadProgress").addEventListener("click", function () { downloadBlob(JSON.stringify(state, null, 2), "application/json", "Year9_" + safeFile(state.student.class,"Class") + "_" + safeFile(state.student.name,"Student") + "_Week1_Project_Backup.json"); });
    $("#exportPdf").addEventListener("click", function () {
      $("#exportStatus").textContent = "Building your report…"; renderReview();
      global.LessonExport.buildPdf({ state: state, imagesById: imageCache, filename: "Year9_" + safeFile(state.student.class,"Class") + "_" + safeFile(state.student.name,"Student") + "_Week1_Project.pdf", labels: LABELS, groups: REVIEW_GROUPS, completion: STAGES.map(function(s){return {label:s.label,complete:complete(s.id)};}) }).then(function (name) {
        state.exports.pdf += 1; state.exports.lastPdfAt = new Date().toISOString(); scheduleSave(); $("#exportStatus").textContent = name + " downloaded. Open it, then upload it to the Week 1 Project assignment in Teams.";
      }).catch(function () { $("#exportStatus").textContent = "PDF generation failed. Use your browser’s Print command and choose Save as PDF."; window.print(); });
    });
  }

  function enterLesson() {
    $("#landing").hidden = true; $("#app").hidden = false; $("#studentLabel").textContent = state.student.teacher ? "Teacher preview" : state.student.name + " · " + state.student.class; $("#teacherBanner").hidden = !state.student.teacher; $("#pythonFilename").textContent = pyFilename();
    restoreResponses(); loadImages(); refresh(); goTo(state.currentStage || "do-now");
  }

  function bindApp() {
    buildNav(); bindResponses(); bindNavigation(); bindCode(); bindUploads(); bindWords(); bindGuideDialog(); bindExport();
    $("#supportToggle").addEventListener("change", function () { document.body.classList.toggle("support-on", this.checked); state.student.support = this.checked ? "supported" : "standard"; scheduleSave(); });
    $("#resetButton").addEventListener("click", function () { if (!confirm("Reset all saved answers and images for this profile?")) return; global.LessonStorage.clearProfile(profileKey).then(function () { location.reload(); }); });
  }

  function startFromForm(ev) {
    ev.preventDefault(); var name = text($("#entryName").value), klass = text($("#entryClass").value), teacher = name.toLowerCase() === "teacher";
    $("#nameError").hidden = true; $("#classError").hidden = true;
    if (!name) { $("#nameError").textContent = "Enter your full name."; $("#nameError").hidden = false; return; }
    if (!klass && !teacher) { $("#classError").textContent = "Enter your class."; $("#classError").hidden = false; return; }
    profileKey = teacher ? "teacher-redesign" : "student-redesign";
    var support = $('input[name="entrySupport"]:checked').value; state = freshState(teacher ? "Teacher" : name, teacher ? "Preview" : klass, support, teacher); saveNow().then(enterLesson);
  }

  function init() {
    global.LessonStorage.init().then(function () { return global.LessonStorage.loadRecord("student-redesign"); }).then(function (saved) {
      if (saved && saved.schemaVersion === 2) { $("#resumeBox").hidden = false; $("#resumeText").textContent = saved.student.name + " · " + saved.student.class + " · last saved " + new Date(saved.updatedAt).toLocaleString("en-GB"); $("#resumeButton").onclick = function () { state = saved; profileKey = "student-redesign"; enterLesson(); }; $("#freshButton").onclick = function () { if (confirm("Clear the saved student work on this device?")) global.LessonStorage.clearProfile("student-redesign").then(function () { $("#resumeBox").hidden = true; }); }; }
    });
    $("#entryForm").addEventListener("submit", startFromForm); bindApp();
  }
  document.addEventListener("DOMContentLoaded", init);
})(window);
