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
    const core = ["starter","main1","main2","plenary"].filter(function (x) { return state.completed.indexOf(x) >= 0; });
    const extRows = (state.extensionDone || []).map(function (id) {
      const a = state.answers["extension_" + id];
      return row("Level " + id.toUpperCase(), a ? a.answer : "Completed");
    }).join("");

    page.innerHTML =
      "<h1>Year 6 Computing Launch — Learning Report</h1>" +
      "<table>" + row("Student", state.student.name) + row("Class", state.student.className) + row("Date", date(state.finishedAt)) +
      (cfg.SCHOOL_NAME ? row("School", cfg.SCHOOL_NAME) : "") +
      row("Language support", langNames[state.profile.language] || "English") +
      row("Answer support", state.profile.responseMode === "guided" ? "Visual choices and sentence frames" : "Independent explanations") +
      row("Core lesson sections", core.length + " of 4 completed") + row("Extension levels", String((state.extensionDone || []).length)) + "</table>" +
      "<h2>Do Now: Start–Work–Finish</h2>" + answerTable(state,["starter_q1","starter_q2","starter_q3"]) +
      "<h2>Main Activity 1: Organise digital work</h2>" + answerTable(state,["main1_routine","main1_folder","main1_filename","main1_own_filename","main1_explain"]) +
      "<p><strong>Folder evidence:</strong> " + (state.evidence.folder ? "Screenshot attached below." : state.evidence.folderSkipped ? "Teacher will check directly." : "Not recorded.") + "</p>" +
      "<div id='folderShot'></div>" +
      "<h2>Main Activity 2: Predict, build, test and modify</h2>" + answerTable(state,["main2_stage","main2_palette","main2_prediction","main2_input","main2_output","main2_test","main2_change","main2_explain"]) +
      "<p><strong>Scratch evidence:</strong> " + (state.evidence.scratch ? "Screenshot attached below." : state.evidence.scratchSkipped ? "Teacher will check directly." : "Not recorded.") + "</p>" +
      "<div id='scratchShot'></div>" +
      ((state.extensionDone || []).length ? "<h2>Fast Finisher Challenges</h2><table>" + extRows + "</table>" : "") +
      "<h2>Plenary</h2>" + answerTable(state,["plenary_q1","plenary_q2","plenary_q3","plenary_next"]) +
      "<p><strong>Confidence:</strong> " + esc(state.confidence || "—") + "</p>" +
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
