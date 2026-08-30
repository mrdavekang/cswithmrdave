(function () {
  "use strict";
  function esc(value) {
    return String(value == null ? "" : value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function row(label, value) { return "<tr><th>" + esc(label) + "</th><td>" + esc(value || "—") + "</td></tr>"; }
  function answerTable(state, keys) {
    let html = "<table>";
    keys.forEach(function (key) {
      const a = state.answers[key];
      if (a) html += row(a.question || key, a.answer || a.value || "—");
    });
    return html + "</table>";
  }
  function date(value) {
    return new Date(value || Date.now()).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
  }
  function build(state, deps) {
    const cfg = deps.CFG || {};
    const page = document.createElement("article");
    page.className = "report-page";
    const langNames = { en:"English", ms:"Bahasa Melayu", zh:"简体中文" };
    const stageChecks = [
      state.completed.indexOf("starter") >= 0,
      state.completed.indexOf("learningTypes") >= 0,
      state.completed.indexOf("main1") >= 0 && state.completed.indexOf("main2") >= 0,
      state.completed.indexOf("pitstop") >= 0,
      state.completed.indexOf("plenary") >= 0,
      state.completed.indexOf("reflection") >= 0
    ];
    const core = stageChecks.filter(Boolean).length;
    const learningNames = { knowledge:"Knowledge — remember", skills:"Skills — practise", understanding:"Understanding — explain and apply" };
    const strategyNames = { example:"Use a worked example", practise:"Practise the steps", explain:"Explain my thinking", "smaller-step":"Ask for a smaller step", help:"Smaller step or help" };
    const phaseNames = { new:"Learning something new", consolidating:"Consolidating and gaining confidence", challenge:"Ready for more challenge", help:"Needs help now" };
    const needNames = { folders:"Folders and filenames", scratch:"Finding or joining Scratch blocks", coordinates:"x, y and directions", saving:"Saving or adding evidence" };
    const extRows = (state.extensionDone || []).filter(function(id){return id.charAt(0)==="p";}).map(function (id) {
      const a = state.answers["extension_" + id];
      return row("Level " + id.toUpperCase(), a ? a.answer : "Completed");
    }).join("");

    page.innerHTML =
      "<h1>Year 6 Computing Launch — Learning Report</h1>" +
      "<table>" + row("Student", state.student.name) + row("Class", state.student.className) + row("Date", date(state.finishedAt)) +
      (cfg.SCHOOL_NAME ? row("School", cfg.SCHOOL_NAME) : "") +
      row("Language support", langNames[state.profile.language] || "English") +
      row("Answer support", state.profile.responseMode === "guided" ? "Visual choices and sentence frames" : "Independent explanations") +
      row("Learning stages", core + " of 6 completed") + row("Extension levels", String((state.extensionDone || []).filter(function(id){return id.charAt(0)==="p";}).length)) + "</table>" +
      "<h2>Do Now: Start–Work–Finish</h2>" + answerTable(state,["starter_q1","starter_q2","starter_q3"]) +
      "<h2>How I Learn</h2><table>" + row("Types used in the Do Now",(state.learningTypes||[]).map(function(x){return learningNames[x]||x;}).join(", ")) + row("Strategy chosen for the Main Task",strategyNames[state.learningStrategy]||state.learningStrategy) + "</table>" +
      "<h2>Main Task Part A: Organise digital work</h2>" + answerTable(state,["main1_folder","main1_filename","main1_own_filename","main1_check"]) +
      "<p><strong>Folder evidence:</strong> " + (state.evidence.folder ? "Screenshot attached below." : state.evidence.folderSkipped ? "Teacher will check directly." : "Not recorded.") + "</p>" +
      "<div id='folderShot'></div>" +
      "<h2>Main Task Part B: Predict, build, test and modify</h2>" + answerTable(state,["main2_stage","main2_palette","main2_prediction","main2_input","main2_output","main2_test","main2_change","main2_explain"]) +
      "<p><strong>Scratch evidence:</strong> " + (state.evidence.scratch ? "Screenshot attached below." : state.evidence.scratchSkipped ? "Teacher will check directly." : "Not recorded.") + "</p>" +
      "<div id='scratchShot'></div>" +
      "<h2>Learning Pitstop</h2><table>" + row("Current phase",phaseNames[state.pitstopPhase]||state.pitstopPhase) + row("Support requested",needNames[state.pitstopNeed]||state.pitstopNeed||"Not requested") + "</table>" +
      ((state.extensionDone || []).some(function(id){return id.charAt(0)==="p";}) ? "<h2>Main Task Challenges</h2><table>" + extRows + "</table>" : "") +
      "<h2>Plenary</h2>" + answerTable(state,["plenary_q1","plenary_q2","plenary_q3"]) +
      "<h2>Exit Reflection</h2><table>" + row("Learning that helped most",learningNames[state.exitLearningType]||state.exitLearningType) + row("Strategy that helped most",strategyNames[state.exitStrategy]||state.exitStrategy) + "</table>" + answerTable(state,["exit_can","exit_next"]) +
      "<p><em>This report was created locally in the browser. Student data was not uploaded by this app.</em></p>";

    function attach(key, slot, alt, wanted) {
      if (!wanted) return Promise.resolve();
      return deps.getScreenshot(key).then(function (blob) {
        if (!blob) return;
        const img = document.createElement("img");
        img.className = "report-shot"; img.alt = alt; img.src = URL.createObjectURL(blob);
        page.querySelector(slot).appendChild(img);
      }).catch(function () {});
    }
    return Promise.all([
      attach("folder", "#folderShot", "Student folder evidence", state.evidence.folder),
      attach("main", "#scratchShot", "Student Scratch evidence", state.evidence.scratch)
    ]).then(function () { return page; });
  }
  window.LabReport = { build: build };
})();
