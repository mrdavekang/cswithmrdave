/* ==========================================================================
   export.js — client-side PDF export (jsPDF) and a print-friendly fallback.
   Nothing is uploaded: the file is built in the browser and downloaded.
   ========================================================================== */
(function (global) {
  "use strict";

  var LESSON_INFO = {
    keyTopic: "Python input, processing and output with a micro:bit",
    wagba: "Create, test and improve a micro:bit help button using Python.",
    knowledge: [
      "pressing a button provides an input",
      "the program checks which button was pressed",
      "the picture or message is the output",
      "code can be tested in a simulator before being sent to a micro:bit",
      "a Python file needs a clear and recognisable filename"
    ],
    skills: [
      "edit a short micro:bit Python program",
      "test buttons A and B in the simulator",
      "save a Python file correctly",
      "send working code to a physical micro:bit",
      "collect feedback from a partner",
      "improve the project after testing"
    ],
    understanding: [
      "input, processing and output work together",
      "a simulator helps find problems before using a physical device",
      "a message must make sense to the person using it",
      "testing and improving are normal parts of creating a project"
    ],
    keywords: "input, processing, output, Python, button, simulator, micro:bit, test, message, prototype, improve",
    challenge: "Make your help signals clearer, quicker or more useful for another student."
  };

  var CHANGE_LABELS = {
    words: "Changed the words",
    picture: "Changed the picture",
    speed: "Changed the speed",
    start: "Changed the starting screen",
    finish: "Added a finishing picture"
  };

  var SECTION_TITLES = {
    starter: "Starter",
    m1a: "Main Activity 1 - Part A (save your file)",
    m1b: "Main Activity 1 - Part B (first version)",
    m1c: "Main Activity 1 - Part C (make it yours)",
    m2a: "Main Activity 2 - Part A (real micro:bit)",
    m2b: "Main Activity 2 - Part B (partner test)",
    m2c: "Main Activity 2 - Part C (make it better)",
    ext: "Optional extension",
    plenary: "Plenary",
    "return": "Equipment returned",
    review: "Final review and export"
  };

  function t(v) {
    if (v === true) return "Yes";
    if (v === false || v == null || v === "") return "";
    if (Array.isArray(v)) return v.join(", ");
    return String(v).trim();
  }
  function answered(v) { return t(v) || "Not answered"; }
  function ticked(v) { return v === true ? "Yes" : "Not ticked"; }

  /** Replace characters the standard PDF fonts render badly. */
  function pdfSafe(str) {
    return String(str == null ? "" : str)
      .replace(/[‘’‛]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/[…]/g, "...")
      .replace(/[·•]/g, "-")
      .replace(/[→]/g, "->")
      .replace(/[✓✔]/g, "Y")
      .replace(/ /g, " ");
  }

  function niceDate() {
    return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function changeList(responses) {
    var chosen = Array.isArray(responses.m1c_changes) ? responses.m1c_changes : [];
    return chosen.map(function (c) { return CHANGE_LABELS[c] || c; });
  }

  /* =======================================================================
     PDF
     ======================================================================= */
  function buildPdf(opts) {
    var jsPDFctor = (global.jspdf && global.jspdf.jsPDF) || global.jsPDF;
    if (!jsPDFctor) return Promise.reject(new Error("jsPDF library not found"));

    var state = opts.state;
    var r = state.responses;
    var images = state.images || [];
    var byId = opts.imagesById || {};

    var doc = new jsPDFctor({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    var PAGE_W = 210, PAGE_H = 297;
    var M = 15;                       // margin
    var CW = PAGE_W - M * 2;          // content width
    var BOTTOM = PAGE_H - 18;
    var y = M;

    function space(h) {
      if (y + h > BOTTOM) { doc.addPage(); y = M; return true; }
      return false;
    }
    function rule() {
      doc.setDrawColor(20);
      doc.setLineWidth(0.4);
      doc.line(M, y, M + CW, y);
      y += 4;
    }
    function heading(text) {
      space(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.setTextColor(0);
      var lines = doc.splitTextToSize(pdfSafe(text), CW);
      doc.text(lines, M, y + 4);
      y += lines.length * 5.6 + 1.5;
      rule();
    }
    function subheading(text) {
      space(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(0);
      doc.text(pdfSafe(text), M, y + 3.6);
      y += 7;
    }
    function kv(label, value) {
      var val = pdfSafe(answered(value));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(70);
      var labelLines = doc.splitTextToSize(pdfSafe(label), CW);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(0);
      var valLines = doc.splitTextToSize(val, CW);
      var needed = labelLines.length * 4 + valLines.length * 4.8 + 3;
      space(needed);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(70);
      doc.text(labelLines, M, y + 3);
      y += labelLines.length * 4 + 0.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(0);
      doc.text(valLines, M, y + 3.4);
      y += valLines.length * 4.8 + 2.5;
    }
    function bullets(title, list) {
      subheading(title);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0);
      list.forEach(function (item) {
        var lines = doc.splitTextToSize("- " + pdfSafe(item), CW - 3);
        space(lines.length * 4.6 + 1);
        doc.text(lines, M + 2, y + 3.2);
        y += lines.length * 4.6 + 0.6;
      });
      y += 2;
    }
    function paragraph(text, size) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size || 10.5);
      doc.setTextColor(0);
      var lines = doc.splitTextToSize(pdfSafe(text), CW);
      space(lines.length * 4.8 + 2);
      doc.text(lines, M, y + 3.4);
      y += lines.length * 4.8 + 3;
    }
    function gap(h) { y += (h || 3); }

    function addImages(slot, fallbackNote) {
      var list = images.filter(function (m) { return m.slot === slot; });
      if (!list.length) {
        if (fallbackNote) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9.5);
          doc.setTextColor(90);
          space(6);
          doc.text(pdfSafe(fallbackNote), M, y + 3.2);
          y += 6;
          doc.setTextColor(0);
        }
        return;
      }
      list.forEach(function (meta) {
        var rec = byId[meta.id];
        if (!rec || !rec.dataUrl) return;
        var ratio = (meta.height || 3) / (meta.width || 4);
        var w = Math.min(CW, 150);
        var h = w * ratio;
        var maxH = 105;
        if (h > maxH) { h = maxH; w = h / ratio; }
        var caption = pdfSafe(meta.label || "Evidence");
        if (y + h + 9 > BOTTOM) { doc.addPage(); y = M; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(70);
        doc.text(caption, M, y + 3);
        y += 4.5;
        var fmt = /^data:image\/png/i.test(rec.dataUrl) ? "PNG" : "JPEG";
        try {
          doc.addImage(rec.dataUrl, fmt, M, y, w, h, undefined, "MEDIUM");
          doc.setDrawColor(30);
          doc.setLineWidth(0.3);
          doc.rect(M, y, w, h);
        } catch (e) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9.5);
          doc.text("[picture could not be added]", M, y + 5);
        }
        y += h + 5;
        doc.setTextColor(0);
      });
    }

    /* ---------------- cover / heading block ---------------- */
    doc.setFillColor(255, 196, 0);
    doc.rect(M, y, CW, 2.5, "F");
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text("YEAR 9 COMPUTING", M, y + 4);
    y += 7;
    doc.setFontSize(10.5);
    doc.setTextColor(60);
    doc.text("Term 1, Week 1", M, y + 3);
    y += 7;
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text("Classroom Help Button", M, y + 6);
    y += 13;
    doc.setDrawColor(20);
    doc.setLineWidth(0.7);
    doc.line(M, y, M + CW, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text(pdfSafe("Name: " + (state.student.name || "")), M, y + 3);
    doc.text(pdfSafe("Class: " + (state.student.class || "")), M + CW / 2, y + 3);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(pdfSafe("Date: " + niceDate()), M, y + 3);
    doc.text(pdfSafe("Python file: " + opts.pyFilename), M + CW / 2, y + 3);
    y += 9;
    doc.setTextColor(0);

    /* ---------------- lesson information ---------------- */
    heading("Lesson information");
    kv("Key topic", LESSON_INFO.keyTopic);
    kv("WAGBA (what a good one looks like)", LESSON_INFO.wagba);
    bullets("Knowledge - students will know", LESSON_INFO.knowledge);
    bullets("Skills - students will be able to", LESSON_INFO.skills);
    bullets("Understanding - students will understand", LESSON_INFO.understanding);
    kv("Keywords", LESSON_INFO.keywords);
    kv("Challenge", LESSON_INFO.challenge);

    /* ---------------- starter ---------------- */
    heading("Starter - How would you ask for help?");
    kv("1. You do not understand the task - my signal", r.starter_sig1_msg);
    kv("Picture or symbol idea", r.starter_sig1_pic);
    kv("2. You want your work checked - my signal", r.starter_sig2_msg);
    kv("Picture or symbol idea", r.starter_sig2_pic);
    kv("3. You want to speak privately - my signal", r.starter_sig3_msg);
    kv("Picture or symbol idea", r.starter_sig3_pic);
    subheading("Input, processing and output");
    kv("Input - what the student would do", r.starter_ipo_input);
    kv("Processing - what the program would check", r.starter_ipo_process);
    kv("Output - what the micro:bit would show", r.starter_ipo_output);

    /* ---------------- main 1 ---------------- */
    heading("Main Activity 1 - Build your help button");
    subheading("Part A - Folder and filename");
    kv("Filename used", opts.pyFilename);
    kv("Folder Year 9 Computer Science / Term 1 / Week 1 Help Button made", ticked(r.m1a_folder_made));
    kv("Python file saved in that folder", ticked(r.m1a_file_saved));
    kv("Filename matches the required format", ticked(r.m1a_name_matches));
    addImages("m1a_file_screenshot");

    subheading("Part B - Predictions before testing");
    kv("What will happen when button A is pressed?", r.m1b_predict_a);
    kv("What will happen when button B is pressed?", r.m1b_predict_b);
    kv("Which part of the code checks the button?", r.m1b_which_checks);
    kv("Which part creates the output?", r.m1b_which_output);
    subheading("Part B - Simulator results");
    kv("Button A worked in the simulator", ticked(r.m1b_a_worked));
    kv("Button B worked in the simulator", ticked(r.m1b_b_worked));
    kv("Both buttons gave different results", ticked(r.m1b_different));
    addImages("m1b_sim_screenshot");

    subheading("Part C - Changes I chose");
    kv("Changes selected", changeList(r).length ? changeList(r) : "None selected");
    kv("What I changed and why", r.m1c_explain);
    kv("Both buttons still work", ticked(r.m1c_both_work));
    addImages("m1c_sim_screenshot", "No simulator screenshot uploaded.");

    /* ---------------- main 2 ---------------- */
    heading("Main Activity 2 - Try it on a real micro:bit");
    subheading("Part A - Connect, send and test");
    kv("micro:bit number", r.m2a_number);
    kv("Button A worked on the real micro:bit", r.m2a_a_worked);
    kv("Button B worked on the real micro:bit", r.m2a_b_worked);
    kv("Did the real micro:bit match the simulator?", r.m2a_matched);
    kv("Swapped roles with my partner", ticked(r.m2a_swapped));
    addImages("m2a_device_photo");

    subheading("Part B - What my partner said");
    kv("Partner thought button A meant", r.m2b_a_meaning);
    kv("Partner thought button B meant", r.m2b_b_meaning);
    kv("Easiest message to understand", r.m2b_easiest);
    kv("Anything slow or confusing", r.m2b_slow);
    kv("I think you should change...", r.m2b_suggestion);

    subheading("Part C - The improvement I made");
    kv("Did my first choices work well on the real micro:bit?", r.m2c_worked_well);
    kv("I changed", r.m2c_from);
    kv("to", r.m2c_to);
    kv("because", r.m2c_because);
    kv("Sent the new code and tested both buttons again", ticked(r.m2c_retested));
    addImages("m2c_evidence", "No evidence of the improved version uploaded.");

    /* ---------------- extension ---------------- */
    if (opts.extensionAttempted) {
      heading("Optional extension - Add \"Can I talk?\"");
      kv("Tested button A only", ticked(r.ext_test_a));
      kv("Tested button B only", ticked(r.ext_test_b));
      kv("Tested buttons A and B together", ticked(r.ext_test_ab));
      kv("Extra ideas used", r.ext_choices);
      kv("What I added", r.ext_explain);
      addImages("ext_evidence");
    }

    /* ---------------- plenary ---------------- */
    heading("Plenary - What worked and what changed?");
    kv("Signal my partner understood most quickly", r.ple_quickest);
    kv("What I changed after my partner tried it", r.ple_changed);
    kv("Anything different on the real micro:bit", r.ple_real_vs_sim);
    subheading("Final learning check");
    kv("Input: the student presses", r.ple_ipo_input);
    kv("Processing: the program checks", r.ple_ipo_process);
    kv("Output: the micro:bit shows", r.ple_ipo_output);
    kv("The best improvement I made was", r.ple_best);
    kv("because", r.ple_best_because);
    kv("Another classroom problem a micro:bit button could help with", r.ple_exit);

    heading("Before finishing - equipment returned");
    kv("micro:bit returned", ticked(r.ret_microbit));
    kv("Cable returned", ticked(r.ret_cable));
    kv("Correct storage space used", ticked(r.ret_storage));

    /* ---------------- completion summary ---------------- */
    heading("Completion summary");
    var order = ["starter", "m1a", "m1b", "m1c", "m2a", "m2b", "m2c", "ext", "plenary", "return"];
    doc.setFontSize(10);
    order.forEach(function (id) {
      var sec = state.sections[id] || {};
      var label = SECTION_TITLES[id] || id;
      var status;
      if (id === "ext") status = opts.extensionAttempted ? "Completed" : "Optional - not attempted";
      else status = sec.complete ? "Finished" : "Not finished";
      var line = doc.splitTextToSize(pdfSafe(label + ": " + status), CW - 3);
      space(line.length * 4.6 + 1);
      doc.setFont("helvetica", sec.complete || (id === "ext" && opts.extensionAttempted) ? "bold" : "normal");
      doc.text(line, M + 2, y + 3.2);
      y += line.length * 4.6 + 0.8;
    });
    gap(3);
    var totalImages = images.length;
    doc.setFont("helvetica", "normal");
    paragraph("Pictures included in this document: " + totalImages + ".", 10);

    /* ---------------- footers ---------------- */
    var pages = doc.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setDrawColor(120);
      doc.setLineWidth(0.3);
      doc.line(M, PAGE_H - 12, PAGE_W - M, PAGE_H - 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(90);
      doc.text(pdfSafe(state.student.name + "  -  " + state.student.class + "  -  Year 9 Computing, Term 1 Week 1: Classroom Help Button"), M, PAGE_H - 8);
      doc.text("Page " + p + " of " + pages, PAGE_W - M, PAGE_H - 8, { align: "right" });
    }

    doc.save(opts.filename);
    return Promise.resolve(opts.filename);
  }

  /* =======================================================================
     PRINT-FRIENDLY FALLBACK
     ======================================================================= */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildPrintView(opts) {
    var state = opts.state;
    var r = state.responses;
    var byId = opts.imagesById || {};
    var view = document.getElementById("print-view");
    if (!view) return;

    function qa(q, a) {
      var val = t(a) || "Not answered";
      return '<div class="qa"><div style="font-size:9pt;color:#444"><strong>' + esc(q) + "</strong></div><div>" + esc(val) + "</div></div>";
    }
    function imgs(slot) {
      var list = (state.images || []).filter(function (m) { return m.slot === slot; });
      if (!list.length) return "";
      return list.map(function (m) {
        var rec = byId[m.id];
        if (!rec) return "";
        return '<figure style="margin:6pt 0"><img src="' + rec.dataUrl + '" alt="' + esc(m.label) +
          '"><figcaption style="font-size:9pt">' + esc(m.label || "Evidence") + "</figcaption></figure>";
      }).join("");
    }
    function list(title, arr) {
      return "<h3>" + esc(title) + "</h3><ul>" + arr.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
    }

    var html = "";
    html += "<h1>Year 9 Computing — Term 1, Week 1 — Classroom Help Button</h1>";
    html += '<div class="pv-meta"><strong>Name:</strong> ' + esc(state.student.name) +
      " &nbsp;&nbsp; <strong>Class:</strong> " + esc(state.student.class) +
      " &nbsp;&nbsp; <strong>Date:</strong> " + esc(niceDate()) +
      " &nbsp;&nbsp; <strong>Python file:</strong> " + esc(opts.pyFilename) + "</div>";

    html += "<h2>Lesson information</h2>";
    html += qa("Key topic", LESSON_INFO.keyTopic) + qa("WAGBA", LESSON_INFO.wagba);
    html += list("Knowledge", LESSON_INFO.knowledge) + list("Skills", LESSON_INFO.skills) + list("Understanding", LESSON_INFO.understanding);
    html += qa("Keywords", LESSON_INFO.keywords) + qa("Challenge", LESSON_INFO.challenge);

    html += "<h2>Starter</h2>" +
      qa("Signal 1 (do not understand the task)", r.starter_sig1_msg) + qa("Picture idea", r.starter_sig1_pic) +
      qa("Signal 2 (please check my work)", r.starter_sig2_msg) + qa("Picture idea", r.starter_sig2_pic) +
      qa("Signal 3 (speak privately)", r.starter_sig3_msg) + qa("Picture idea", r.starter_sig3_pic) +
      qa("Input", r.starter_ipo_input) + qa("Processing", r.starter_ipo_process) + qa("Output", r.starter_ipo_output);

    html += "<h2>Main Activity 1</h2>" +
      qa("Filename", opts.pyFilename) +
      qa("Folder made", ticked(r.m1a_folder_made)) + qa("File saved", ticked(r.m1a_file_saved)) +
      qa("Filename matches format", ticked(r.m1a_name_matches)) + imgs("m1a_file_screenshot") +
      qa("Prediction: button A", r.m1b_predict_a) + qa("Prediction: button B", r.m1b_predict_b) +
      qa("Part that checks the button", r.m1b_which_checks) + qa("Part that creates the output", r.m1b_which_output) +
      qa("Simulator: A worked", ticked(r.m1b_a_worked)) + qa("Simulator: B worked", ticked(r.m1b_b_worked)) +
      qa("Different results", ticked(r.m1b_different)) + imgs("m1b_sim_screenshot") +
      qa("Changes chosen", changeList(r).join(", ")) + qa("What I changed and why", r.m1c_explain) +
      qa("Both buttons still work", ticked(r.m1c_both_work)) + imgs("m1c_sim_screenshot");

    html += "<h2>Main Activity 2</h2>" +
      qa("micro:bit number", r.m2a_number) + qa("Button A worked", r.m2a_a_worked) +
      qa("Button B worked", r.m2a_b_worked) + qa("Matched the simulator", r.m2a_matched) +
      qa("Swapped roles", ticked(r.m2a_swapped)) + imgs("m2a_device_photo") +
      qa("Partner: button A means", r.m2b_a_meaning) + qa("Partner: button B means", r.m2b_b_meaning) +
      qa("Easiest message", r.m2b_easiest) + qa("Slow or confusing", r.m2b_slow) +
      qa("Partner's suggestion", r.m2b_suggestion) +
      qa("Did the first choices work well?", r.m2c_worked_well) +
      qa("I changed", r.m2c_from) + qa("to", r.m2c_to) + qa("because", r.m2c_because) +
      qa("Sent again and re-tested", ticked(r.m2c_retested)) + imgs("m2c_evidence");

    if (opts.extensionAttempted) {
      html += "<h2>Optional extension</h2>" +
        qa("Tested A only", ticked(r.ext_test_a)) + qa("Tested B only", ticked(r.ext_test_b)) +
        qa("Tested A and B together", ticked(r.ext_test_ab)) + qa("Extra ideas", r.ext_choices) +
        qa("What I added", r.ext_explain) + imgs("ext_evidence");
    }

    html += "<h2>Plenary</h2>" +
      qa("Signal understood most quickly", r.ple_quickest) + qa("Changed after partner test", r.ple_changed) +
      qa("Real micro:bit vs simulator", r.ple_real_vs_sim) +
      qa("Input: the student presses", r.ple_ipo_input) + qa("Processing: the program checks", r.ple_ipo_process) +
      qa("Output: the micro:bit shows", r.ple_ipo_output) +
      qa("Best improvement", r.ple_best) + qa("because", r.ple_best_because) + qa("Exit question", r.ple_exit);

    html += "<h2>Equipment returned</h2>" +
      qa("micro:bit returned", ticked(r.ret_microbit)) + qa("Cable returned", ticked(r.ret_cable)) +
      qa("Correct storage space", ticked(r.ret_storage));

    html += "<h2>Completion summary</h2><ul>";
    ["starter", "m1a", "m1b", "m1c", "m2a", "m2b", "m2c", "ext", "plenary", "return"].forEach(function (id) {
      var sec = state.sections[id] || {};
      var status = id === "ext"
        ? (opts.extensionAttempted ? "Completed" : "Optional — not attempted")
        : (sec.complete ? "Finished" : "Not finished");
      html += "<li>" + esc(SECTION_TITLES[id] || id) + ": " + esc(status) + "</li>";
    });
    html += "</ul>";

    view.innerHTML = html;
  }

  global.LessonExport = {
    buildPdf: buildPdf,
    buildPrintView: buildPrintView,
    lessonInfo: LESSON_INFO
  };
})(window);
