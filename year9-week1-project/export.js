(function (global) {
  "use strict";

  function clean(value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return String(value == null || value === "" ? "Not answered" : value)
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/→/g, "->");
  }

  function buildPdf(opts) {
    var Ctor = global.jspdf && global.jspdf.jsPDF;
    if (!Ctor) return Promise.reject(new Error("jsPDF unavailable"));
    var state = opts.state, r = state.responses || {}, labels = opts.labels || {}, groups = opts.groups || [], images = opts.imagesById || {};
    var doc = new Ctor({ unit: "mm", format: "a4", compress: true });
    var W = 210, H = 297, M = 15, BW = W - M * 2, y = M, bottom = H - 18;

    function ensure(h) { if (y + h > bottom) { doc.addPage(); y = M; } }
    function lines(value, width) { return doc.splitTextToSize(clean(value), width || BW); }
    function heading(value, main) {
      var ls = lines(value); ensure(ls.length * 6 + 8); doc.setFont("helvetica", "bold"); doc.setFontSize(main ? 18 : 13); doc.setTextColor(15); doc.text(ls, M, y + 5); y += ls.length * (main ? 7 : 5.5) + 2; doc.setDrawColor(20); doc.setLineWidth(main ? .7 : .35); doc.line(M, y, W - M, y); y += 5;
    }
    function pair(label, value) {
      var ll = lines(label), vl = lines(value); var h = ll.length * 4 + vl.length * 4.7 + 4; ensure(h);
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(85); doc.text(ll, M, y + 3); y += ll.length * 4 + .5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10.2); doc.setTextColor(0); doc.text(vl, M, y + 3.4); y += vl.length * 4.7 + 3;
    }
    function paragraph(value) { var ls = lines(value); ensure(ls.length * 4.8 + 3); doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(0); doc.text(ls, M, y + 3.4); y += ls.length * 4.8 + 3; }
    function addImage(slot, caption) {
      var meta = (state.images || []).find(function (m) { return m.slot === slot; }); if (!meta || !images[meta.id] || !images[meta.id].dataUrl) return;
      var data = images[meta.id].dataUrl, props;
      try { props = doc.getImageProperties(data); } catch (e) { return; }
      var maxW = BW, maxH = 92, ratio = Math.min(maxW / props.width, maxH / props.height), iw = props.width * ratio, ih = props.height * ratio; ensure(ih + 14);
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(clean(caption), M, y + 3); y += 5;
      try { doc.addImage(data, "JPEG", M, y, iw, ih, undefined, "FAST"); y += ih + 6; } catch (e2) { paragraph("Image evidence could not be embedded."); }
    }

    doc.setFillColor(247, 201, 72); doc.rect(0, 0, W, 13, "F"); y = 20;
    heading("Classroom Help Button", true);
    pair("Student", state.student.name); pair("Class", state.student.class); pair("Date", new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    pair("WAGBA", "Create, test and improve a micro:bit help button using Python.");
    pair("Knowledge", "Inputs, conditions and outputs."); pair("Skills", "Edit, run, test, debug and record evidence."); pair("Understanding", "Explain how evidence leads to an improvement.");

    groups.forEach(function (group) {
      var title = group[0], keys = group[1]; heading(title, false);
      keys.forEach(function (key) {
        if (key.indexOf("ext_") === 0 && !String(r.ext_level || "").trim()) return;
        if (key === "m1_debug_action" && !String(r.m1_debug_action || "").trim()) return;
        pair(labels[key] || key, r[key]);
      });
      if (title === "Main Task 1") addImage("m1_screenshot", "Optional Main Task 1 evidence");
      if (title === "Main Task 2") addImage("m2_screenshot", "Optional Main Task 2 evidence");
    });

    heading("Completion snapshot", false);
    (opts.completion || []).forEach(function (item) { pair(item.label, item.complete ? "Expected evidence recorded" : "Some evidence still needs attention"); });
    paragraph("A 'not yet' or support-needed outcome is valid project evidence. It shows the student's current test result rather than claiming that every program was successful.");

    var pages = doc.getNumberOfPages();
    for (var p = 1; p <= pages; p++) { doc.setPage(p); doc.setDrawColor(130); doc.line(M, H - 12, W - M, H - 12); doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(90); doc.text(clean(state.student.name + " - Year 9 Computing Week 1 Project"), M, H - 8); doc.text("Page " + p + " of " + pages, W - M, H - 8, { align: "right" }); }
    doc.save(opts.filename);
    return Promise.resolve(opts.filename);
  }

  global.LessonExport = { buildPdf: buildPdf };
})(window);
