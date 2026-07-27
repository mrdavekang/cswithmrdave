/* ==========================================================================
   LAB LAUNCH — COMPLETION REPORT BUILDER
   Builds a clean, print-friendly report node from saved state.
   ========================================================================== */
(function () {
  "use strict";

  function row(esc, label, value) {
    return "<tr><th>" + esc(label) + "</th><td>" + esc(value || "—") + "</td></tr>";
  }

  function answerRows(esc, state, prefix, ids) {
    let html = "";
    ids.forEach(function (id) {
      const a = state.answers[prefix + id];
      if (a) {
        html += row(esc, a.question || a.label || id, a.answer + (a.correct === false ? " (compared with model answer)" : ""));
      }
    });
    return html;
  }

  function build(state, deps) {
    const esc = deps.esc;
    const BADGES = deps.BADGES;
    const CFG = deps.CFG;

    const profileText =
      (state.profile.lang === "support" ? "Shorter instructions with pictures and sentence starters" : "Detailed instructions") +
      " · " +
      (state.profile.typing === "support" ? "Choosing, matching and short answers" : "Typing complete sentences");

    const confMap = {
      green: { cls: "rc-green", label: "GREEN — I can work independently." },
      amber: { cls: "rc-amber", label: "AMBER — I remember some things but still need reminders." },
      red: { cls: "rc-red", label: "RED — I need help getting started." }
    };
    const conf = confMap[state.confidence] || null;

    const stagesDone = deps.STAGES
      .filter(function (s) { return state.completed.indexOf(s.id) !== -1 && s.id !== "landing"; })
      .map(function (s) { return s.name; }).join(", ") || "—";

    const badgesHtml = state.badges.map(function (k) {
      const b = BADGES[k];
      return b ? "<span>" + b.emoji + " " + esc(b.name) + "</span>" : "";
    }).join(" ") || "<em>No badges recorded.</em>";

    const routineResult = (function () {
      const total = 12;
      const placed = Object.keys(state.routineSort || {}).length;
      return placed + " of " + total + " routine cards sorted correctly into Start, Work and Finish zones.";
    })();

    const fileResult = state.fileSim && state.fileSim.done
      ? "Simulation completed: created “Year 6 Computing › Term 1 - Digital Independence › " + (state.student.name || "own name") + "”, saved Y6_T1W01_ScratchBaseline_v1, then located the file."
      : "Not completed.";

    const realFolderResult = state.fileSim && state.fileSim.realDone
      ? "Screenshot evidence provided (see below)."
      : (state.fileSim && state.fileSim.realSkipped
        ? "No screenshot — teacher agreed to check the folders directly."
        : "Not completed.");

    const checklistItems = [
      "I opened the correct Scratch project.", "I saved or remixed my own copy.",
      "I made one purposeful change.", "I ran the program.", "I checked what happened.",
      "I corrected a problem when needed.", "I saved the improved version.", "I can explain what I changed."
    ];
    let checklistHtml = "<ul>";
    checklistItems.forEach(function (t, i) {
      checklistHtml += "<li>" + (state.checklist["m" + i] ? "☑" : "☐") + " " + esc(t) + "</li>";
    });
    checklistHtml += "</ul>";

    let extHtml = "";
    if (state.extensionDone && state.extensionDone.length) {
      extHtml = "<h2>Extension Vault (optional)</h2><table>";
      ["ext1", "ext2", "ext3"].forEach(function (k) {
        const a = state.answers[k];
        if (a) { extHtml += row(esc, a.question, a.answer); }
      });
      extHtml += "</table>";
    }

    const dateStr = new Date(state.finishedAt || Date.now()).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    const outcome = state.answers.investigate_outcome;

    const page = document.createElement("div");
    page.className = "report-page";
    page.innerHTML =
      "<h1>Lab Launch — Year 6 Computing Quest · Completion Report</h1>" +
      "<table>" +
      row(esc, "Student name", state.student.name) +
      row(esc, "Class", state.student.className) +
      row(esc, "Date", dateStr) +
      (CFG.SCHOOL_NAME ? row(esc, "School", CFG.SCHOOL_NAME) : "") +
      (CFG.TEACHER_NAME ? row(esc, "Teacher", CFG.TEACHER_NAME) : "") +
      row(esc, "Support preferences", profileText) +
      row(esc, "Data Chips collected", String(state.chips)) +
      row(esc, "Stages completed", stagesDone) +
      "</table>" +
      "<h2>Badges earned</h2><p class='report-badges'>" + badgesHtml + "</p>" +
      "<h2>Starter — Safety Corridor responses</h2><table>" +
      answerRows(esc, state, "starter_", ["adam", "mei", "rohan", "hana"]) +
      "</table>" +
      "<h2>Lab routines</h2><table>" +
      row(esc, "Routine sorting", routineResult) +
      answerRows(esc, state, "routine_", ["rq1", "rq2", "rq3"]) +
      "</table>" +
      "<h2>File management</h2><table>" +
      row(esc, "Practice simulation", fileResult) +
      row(esc, "Real folders on school computer", realFolderResult) +
      "</table>" +
      "<div id='reportFolderShotSlot'></div>" +
      "<h2>Scratch investigation</h2><table>" +
      answerRows(esc, state, "investigate_", ["inv1", "inv2", "inv3", "inv4"]) +
      (outcome ? row(esc, outcome.question, outcome.answer + (outcome.reflection ? " — " + outcome.reflection : "")) : "") +
      "</table>" +
      "<h2>Modification self-checklist</h2>" + checklistHtml +
      "<h2>Evidence explanations</h2><table>" +
      answerRows(esc, state, "evidence_", ["ev1", "ev2", "ev3", "ev4", "ev5", "ev6"]) +
      "</table>" +
      "<div id='reportShotSlot'></div>" +
      extHtml +
      "<h2>Plenary — Exit Terminal</h2><table>" +
      answerRows(esc, state, "plenary_", ["p1", "p2", "p3", "p4", "p5", "p6"]) +
      "</table>" +
      "<h2>Confidence</h2>" +
      (conf ? "<p><span class='report-confidence " + conf.cls + "'>" + esc(conf.label) + "</span></p>" : "<p>—</p>") +
      "<p><em>All information in this report was stored only on this computer. Nothing was sent over the internet.</em></p>";

    function attachShot(key, slotId, heading, altText, wanted) {
      if (!wanted || !deps.getScreenshot) { return Promise.resolve(); }
      return deps.getScreenshot(key).then(function (blob) {
        if (blob) {
          const slot = page.querySelector(slotId);
          const h = document.createElement("h2");
          h.textContent = heading;
          const img = document.createElement("img");
          img.className = "report-shot";
          img.alt = altText;
          img.src = URL.createObjectURL(blob);
          slot.appendChild(h);
          slot.appendChild(img);
        }
      }).catch(function () {});
    }

    return Promise.all([
      attachShot("folder", "#reportFolderShotSlot", "Real folder evidence screenshot",
        "Student's screenshot of the folders created on the school computer",
        state.fileSim && state.fileSim.realDone),
      attachShot("main", "#reportShotSlot", "Evidence screenshot",
        "Student's Scratch project screenshot",
        state.evidence && state.evidence.hasImage)
    ]).then(function () { return page; });
  }

  window.LabReport = { build: build };
})();
