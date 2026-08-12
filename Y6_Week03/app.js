(function () {
  "use strict";

  const STORAGE_KEY = "coordinateQuestProfilesV2";
  const SESSION_KEY = "coordinateQuestActiveV2";
  const PAGES = ["starter", "main1", "main2", "extension", "plenary", "report"];
  const PAGE_LABELS = {
    starter: "Starter: decode coordinates",
    main1: "Main Activity 1: predict the code",
    main2: "Main Activity 2: program the route",
    extension: "Extension: complete three levels",
    plenary: "Plenary: explain and reflect",
    report: "Evidence report: download and upload"
  };
  const predictions = [
    { title: "One coordinate changes", prompt: "Where will the sprite finish?", image: "assets/images/prediction-level-1.png", x: "-40", y: "-100" },
    { title: "Track both coordinates", prompt: "Work out the final x and y.", image: "assets/images/prediction-level-2.png", x: "-40", y: "50" },
    { title: "Ignore the distractor", prompt: "Which final coordinate is correct?", image: "assets/images/prediction-level-3.png", x: "80", y: "-50" }
  ];
  const extensions = [
    { heading: "Reach the portal", type: "COORDINATE CHALLENGE", difficulty: "●○○○○", description: "After reaching the key, add one more glide block to the portal at (195, −140).", success: "The explorer visits all checkpoints, collects the key and finishes inside the portal.", visual: ["KEY", "PORTAL"] },
    { heading: "Return to the start", type: "SEQUENCE CHALLENGE", difficulty: "●●○○○", description: "After the portal, glide back to START at (−200, −135) and say ‘Mission complete!’. Find a route that does not skip any required checkpoint.", success: "One connected script completes the full route, portal and return journey.", visual: ["PORTAL", "START"] },
    { heading: "Add a keyboard event", type: "EVENT CHALLENGE", difficulty: "●●●○○", description: "Keep the green flag for Version 1. Create a second event so pressing the space key sends the explorer from the key to the portal.", success: "The green flag runs the core route; the space key controls the extra portal movement.", visual: ["SPACE", "PORTAL"] },
    { heading: "Choose a portal location", type: "DESIGN CHALLENGE", difficulty: "●●●●○", description: "Move the portal to a valid empty part of the map. Record its exact x and y, then update the final glide block to match.", success: "The portal is not on a wall and the code ends at its new exact coordinate.", visual: ["CHOOSE", "CODE"] },
    { heading: "Create a custom mission", type: "CREATOR CHALLENGE", difficulty: "●●●●●", description: "Add two new checkpoints in safe spaces. Design an algorithm that visits every old and new checkpoint, then reaches the key and portal.", success: "Your map is playable, every coordinate is recorded and another student can follow your sequence.", visual: ["+2", "PORTAL"] }
  ];

  let profiles = readProfiles();
  let activeId = sessionStorage.getItem(SESSION_KEY) || "";
  let profile = activeId ? profiles[activeId] : null;
  let isTeacher = false;
  let currentPage = "starter";
  let predictionIndex = 0;
  let extensionIndex = 0;
  let saveTimer = null;
  let pendingDialogAction = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const landingView = $("#landingView");
  const appView = $("#appView");

  function readProfiles() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (error) { return {}; }
  }

  function blankProfile(name, studentClass) {
    return {
      id: makeId(name, studentClass), name, className: studentClass, created: Date.now(), updated: Date.now(),
      currentPage: "starter", furthestPage: 0, answers: {}, predictions: [{}, {}, {}], extensionComplete: [false, false, false, false, false],
      screenshots: { main1: [], main2: [], extension: [] }, completed: {}, teamsSubmitted: false
    };
  }

  function makeId(name, studentClass) {
    return (name + "__" + studentClass).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function saveProfile(immediate) {
    if (!profile || isTeacher) return;
    clearTimeout(saveTimer);
    const commit = () => {
      profile.updated = Date.now();
      profile.currentPage = currentPage;
      profiles[profile.id] = profile;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); }
      catch (error) { toast("Storage is full. Remove an old screenshot, then try again."); }
      updateProgress();
      updateReport();
    };
    if (immediate) commit(); else saveTimer = setTimeout(commit, 250);
  }

  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(el.toastTimer); el.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function setFeedback(id, message, good) {
    const el = $(id); el.textContent = message; el.className = "feedback " + (good ? "good" : "bad");
  }

  function showLanding() {
    appView.hidden = true; landingView.hidden = false; $("#entryError").textContent = "";
    const last = Object.values(profiles).sort((a, b) => b.updated - a.updated)[0];
    const resume = $("#resumeButton");
    if (last) { resume.hidden = false; resume.textContent = `Resume ${last.name} · ${last.className}`; resume.dataset.id = last.id; }
    else resume.hidden = true;
  }

  function enterLesson(name, studentClass, teacherMode) {
    isTeacher = teacherMode;
    if (teacherMode) {
      profile = { id: "teacher", name: "Teacher", className: "All classes", answers: {}, predictions: [{}, {}, {}], extensionComplete: [false, false, false, false, false], screenshots: { main1: [], main2: [], extension: [] }, completed: {} };
      currentPage = "teacher";
    } else {
      const id = makeId(name, studentClass);
      profile = profiles[id] || blankProfile(name, studentClass);
      activeId = id; sessionStorage.setItem(SESSION_KEY, id);
      if (!Number.isInteger(profile.furthestPage)) profile.furthestPage = Math.max(0, PAGES.indexOf(profile.currentPage || "starter"));
      currentPage = profile.currentPage || "starter";
      if (!isPageReachable(currentPage)) currentPage = PAGES[Math.min(profile.furthestPage, firstIncompleteIndex())] || "starter";
    }
    landingView.hidden = true; appView.hidden = false;
    document.body.classList.toggle("teacher-mode", teacherMode);
    $$(".teacher-only").forEach(el => el.hidden = !teacherMode);
    $("#sequenceBanner").hidden = teacherMode;
    $("#profileMode").textContent = teacherMode ? "TEACHER" : "STUDENT";
    $("#profileName").textContent = profile.name;
    $("#profileClass").textContent = profile.className;
    hydrateForms(); renderScreenshots(); renderRecords(); showPage(currentPage, false); updateProgress(); updateReport();
  }

  function showPage(page, scrollTop = true) {
    if (page === "teacher" && !isTeacher) page = "starter";
    if (!isTeacher && !isPageReachable(page)) {
      const step = PAGES[Math.min(profile.furthestPage, PAGES.length - 1)] || "starter";
      toast(`Complete ${PAGE_LABELS[step]} first.`);
      return;
    }
    currentPage = page;
    $$("[data-page-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.pagePanel === page));
    $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.page === page));
    $("#sidebar").classList.remove("open"); $("#menuButton").setAttribute("aria-expanded", "false");
    updateSequenceBanner();
    if (scrollTop) $("#workspace").scrollIntoView({ block: "start" });
    updateProgress();
    if (!isTeacher) saveProfile();
  }

  function pageComplete(page) {
    if (!profile) return false;
    if (page === "starter") return !!profile.completed.starter;
    if (page === "main1") return profile.predictions.filter(p => p.saved).length === 3;
    if (page === "main2") return !!profile.completed.main2 && profile.screenshots.main2.length > 0;
    if (page === "extension") return profile.extensionComplete.filter(Boolean).length >= 3 && !!(profile.answers.extensionNotes || "").trim();
    if (page === "plenary") return !!profile.completed.plenary;
    if (page === "report") return !!profile.teamsSubmitted;
    return true;
  }

  function firstIncompleteIndex() {
    const index = PAGES.findIndex(page => !pageComplete(page));
    return index < 0 ? PAGES.length - 1 : index;
  }

  function isPageReachable(page) {
    if (isTeacher || page === "teacher") return true;
    const index = PAGES.indexOf(page);
    if (index < 0 || index > (profile.furthestPage || 0)) return false;
    return PAGES.slice(0, index).every(pageComplete);
  }

  function updateSequenceBanner() {
    if (isTeacher || !profile) return;
    const index = Math.max(0, PAGES.indexOf(currentPage));
    const done = pageComplete(currentPage);
    const next = PAGES[index + 1];
    $("#sequenceNumber").textContent = `STEP ${index + 1} OF ${PAGES.length}`;
    if (done && next) {
      $("#sequenceTitle").textContent = `Step complete. Continue to ${PAGE_LABELS[next]}.`;
      $("#sequenceHelp").textContent = "Use the yellow Continue button at the bottom of this page.";
    } else if (done) {
      $("#sequenceTitle").textContent = "Lesson complete.";
      $("#sequenceHelp").textContent = "Check your PDF and follow the Teams submission instructions.";
    } else {
      $("#sequenceTitle").textContent = `Do this now: ${PAGE_LABELS[currentPage]}.`;
      $("#sequenceHelp").textContent = "Finish this highlighted step. The Continue button will then turn yellow.";
    }
  }

  function updateProgress() {
    if (!profile) return;
    const completed = PAGES.filter(pageComplete).length;
    const percent = Math.round(completed / PAGES.length * 100);
    $("#progressFill").style.width = percent + "%"; $("#progressText").textContent = percent + "% complete";
    $$(".nav-item[data-page]").forEach(button => {
      const page = button.dataset.page;
      if (page === "teacher") return;
      const done = pageComplete(page); const reachable = isPageReachable(page); const active = page === currentPage;
      button.disabled = !reachable; button.classList.toggle("complete", done); button.classList.toggle("next-unlocked", reachable && !done && !active);
      const status = $(".nav-status", button);
      if (status) status.textContent = done ? "✓" : active ? "NOW" : reachable ? "OPEN" : "LOCKED";
    });
    $$(".continue-button").forEach(button => {
      const ready = isTeacher || pageComplete(button.dataset.current);
      button.disabled = !ready; button.classList.toggle("ready", ready);
    });
    updateSequenceBanner();
  }

  function collectForm(form) {
    const data = new FormData(form); const result = {};
    for (const [key, value] of data.entries()) result[key] = value;
    return result;
  }

  function hydrateForms() {
    if (!profile || isTeacher) return;
    const a = profile.answers || {};
    if (a.starterPointA && (!a.starterPointAX || !a.starterPointAY)) {
      const oldPair = String(a.starterPointA).replace(/−/g, "-").match(/-?\d+/g) || [];
      if (oldPair.length >= 2) { a.starterPointAX = oldPair[0]; a.starterPointAY = oldPair[1]; }
    }
    setFormValues($("#starterForm"), a);
    setFormValues($("#main2Form"), a);
    setFormValues($("#plenaryForm"), a);
    $("#extensionNotes").value = a.extensionNotes || "";
    $("#teamsSubmitted").checked = !!profile.teamsSubmitted;
    predictionIndex = Math.max(0, profile.predictions.findIndex(p => !p.saved)); if (predictionIndex < 0) predictionIndex = 2;
    renderPrediction(); extensionIndex = 0; renderExtension();
  }

  function setFormValues(form, values) {
    if (!form) return;
    $$('input, textarea', form).forEach(input => {
      if (!input.name && !input.id) return; const key = input.name || input.id; const value = values[key];
      if (input.type === "radio" || input.type === "checkbox") input.checked = value === input.value || value === true;
      else if (value !== undefined) input.value = value;
    });
  }

  function renderPrediction() {
    const item = predictions[predictionIndex]; const saved = profile && profile.predictions[predictionIndex] || {};
    $("#predictionCounter").textContent = `LEVEL ${predictionIndex + 1} / 3`;
    $("#predictionHeading").textContent = item.title; $("#predictionPrompt").textContent = item.prompt;
    $("#predictionImage").src = item.image; $("#predictionImage").alt = `Prediction level ${predictionIndex + 1}: ${item.title}`;
    $("#predictionX").value = saved.x || ""; $("#predictionY").value = saved.y || ""; $("#predictionExplain").value = saved.explain || "";
    $("#predictionFeedback").textContent = saved.saved ? "Saved." : ""; $("#predictionFeedback").className = saved.saved ? "feedback good" : "feedback";
    $("#predictionPrev").disabled = predictionIndex === 0; $("#predictionNext").disabled = predictionIndex === predictions.length - 1;
    const dots = $("#predictionDots"); dots.innerHTML = "";
    predictions.forEach((_, index) => { const button = document.createElement("button"); button.type = "button"; button.className = index === predictionIndex ? "active" : ""; button.setAttribute("aria-label", `Prediction ${index + 1}`); button.addEventListener("click", () => { predictionIndex = index; renderPrediction(); }); dots.append(button); });
  }

  function renderExtension() {
    const item = extensions[extensionIndex];
    $("#extensionLevel").textContent = `LEVEL ${extensionIndex + 1}`; $("#extensionDifficulty").textContent = item.difficulty;
    $("#extensionType").textContent = item.type; $("#extensionHeading").textContent = item.heading; $("#extensionDescription").textContent = item.description; $("#extensionSuccess").textContent = item.success;
    const visual = $("#extensionVisual"); visual.innerHTML = `<span>${item.visual[0]}</span><i>→</i><span class="portal">${item.visual[1]}</span>`;
    $("#extensionComplete").checked = !!profile.extensionComplete[extensionIndex]; $("#extensionPrev").disabled = extensionIndex === 0; $("#extensionNext").disabled = extensionIndex === extensions.length - 1;
    const count = profile.extensionComplete.filter(Boolean).length; $("#extensionCount").textContent = count;
    const dots = $("#extensionDots"); dots.innerHTML = "";
    extensions.forEach((_, index) => { const button = document.createElement("button"); button.type = "button"; button.className = index === extensionIndex ? "active" : ""; button.setAttribute("aria-label", `Extension level ${index + 1}`); button.addEventListener("click", () => { extensionIndex = index; renderExtension(); }); dots.append(button); });
  }

  function handleUpload(event) {
    if (isTeacher || !profile) return;
    const area = event.target.dataset.upload; const files = Array.from(event.target.files || []); if (!files.length) return;
    const max = area === "main2" ? 3 : 2;
    files.slice(0, Math.max(0, max - profile.screenshots[area].length)).forEach(file => compressImage(file).then(data => { profile.screenshots[area].push({ name: file.name, data }); saveProfile(true); renderScreenshots(); toast(area === "main2" && pageComplete("main2") ? "Main Activity 2 complete. Use the yellow Continue button." : "Screenshot saved to this profile."); }).catch(() => toast("That image could not be added.")));
    event.target.value = "";
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onerror = reject; reader.onload = () => {
        const image = new Image(); image.onerror = reject; image.onload = () => {
          const maxWidth = 1200, scale = Math.min(1, maxWidth / image.width); const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL("image/jpeg", .78));
        }; image.src = reader.result;
      }; reader.readAsDataURL(file);
    });
  }

  function renderScreenshots() {
    if (!profile) return;
    $$('[data-thumbs]').forEach(container => {
      const area = container.dataset.thumbs; container.innerHTML = "";
      (profile.screenshots[area] || []).forEach((shot, index) => {
        const wrap = document.createElement("div"); wrap.className = "thumb"; const img = document.createElement("img"); img.src = shot.data; img.alt = `${area} evidence ${index + 1}`;
        const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "×"; remove.setAttribute("aria-label", `Remove evidence ${index + 1}`); remove.addEventListener("click", () => { profile.screenshots[area].splice(index, 1); saveProfile(true); renderScreenshots(); });
        wrap.append(img, remove); container.append(wrap);
      });
    });
  }

  function renderRecords() {
    const body = $("#recordsBody"); body.innerHTML = ""; const records = Object.values(readProfiles()).sort((a, b) => b.updated - a.updated);
    if (!records.length) { body.innerHTML = '<tr><td class="empty-row" colspan="5">No student profiles have been saved on this device yet.</td></tr>'; return; }
    records.forEach(record => {
      const done = PAGES.filter(page => pageCompleteFor(record, page)).length; const row = document.createElement("tr");
      row.innerHTML = `<td><strong>${escapeHtml(record.name)}</strong></td><td>${escapeHtml(record.className)}</td><td>${Math.round(done / PAGES.length * 100)}%</td><td>${new Date(record.updated).toLocaleString()}</td><td><button class="button outline small" data-open-record="${record.id}">Open</button></td>`; body.append(row);
    });
    $$('[data-open-record]', body).forEach(button => button.addEventListener("click", () => { const record = profiles[button.dataset.openRecord]; if (record) { isTeacher = false; enterLesson(record.name, record.className, false); } }));
  }

  function pageCompleteFor(record, page) {
    const previous = profile; profile = record; const value = pageComplete(page); profile = previous; return value;
  }

  function updateReport() {
    if (!profile) return;
    $("#reportStudentName").textContent = profile.name; $("#reportStudentClass").textContent = profile.className; $("#previewStudentName").textContent = profile.name;
    $("#reportStarterStatus").textContent = profile.completed.starter ? "Complete" : "Not complete";
    $("#reportPredictionStatus").textContent = `${profile.predictions.filter(p => p.saved).length} / 3`;
    const shots = Object.values(profile.screenshots).flat().length; $("#reportScreenshotStatus").textContent = `${shots} added`;
    $("#reportExtensionStatus").textContent = `${profile.extensionComplete.filter(Boolean).length} / 5`; $("#reportPlenaryStatus").textContent = profile.completed.plenary ? "Complete" : "Not complete";
    const filename = safeFilename(`${profile.name}_${profile.className}_CoordinateQuest.pdf`); $("#teamsFilename").textContent = filename;
  }

  function safeFilename(value) { return value.replace(/[^a-z0-9_.-]+/gi, "_").replace(/_+/g, "_"); }
  function escapeHtml(value) { return String(value || "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }

  function continueTo(current, next) {
    if (!isTeacher && !pageComplete(current)) { toast("Finish the required work on this page first."); return; }
    if (!isTeacher) {
      profile.furthestPage = Math.max(profile.furthestPage || 0, PAGES.indexOf(next));
      saveProfile(true);
    }
    showPage(next); toast(`Now complete ${PAGE_LABELS[next]}.`);
  }

  function askConfirm(title, message, action) {
    pendingDialogAction = action; $("#dialogTitle").textContent = title; $("#dialogMessage").textContent = message; $("#confirmDialog").showModal();
  }

  function exportPDF() {
    if (!window.jspdf || !profile) { setFeedback("#pdfFeedback", "The PDF tool did not load. Refresh the page and try again.", false); return; }
    const { jsPDF } = window.jspdf; const doc = new jsPDF({ unit: "mm", format: "a4" }); const margin = 16, width = 178; let y = 18; let pageNo = 1;
    const addHeader = (title) => { doc.setFillColor(16, 16, 16); doc.rect(0, 0, 210, 18, "F"); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.text("COORDINATE QUEST · YEAR 6 COMPUTING", margin, 11); doc.setTextColor(16,16,16); doc.setFontSize(19); doc.text(title, margin, 30); y = 39; };
    const addFooter = () => { doc.setFontSize(8); doc.setTextColor(100); doc.text(`Generated ${new Date().toLocaleString()} · Page ${pageNo}`, margin, 290); };
    const newPage = title => { addFooter(); doc.addPage(); pageNo += 1; addHeader(title); };
    const ensure = amount => { if (y + amount > 280) newPage("Evidence continued"); };
    const section = (title, colour) => { ensure(14); doc.setFillColor(...colour); doc.rect(margin, y, width, 9, "F"); doc.setTextColor(colour[0]+colour[1]+colour[2] > 450 ? 16 : 255); doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.text(title, margin + 3, y + 6); doc.setTextColor(16); y += 13; };
    const line = (label, value) => { const text = String(value || "Not answered"); const wrapped = doc.splitTextToSize(text, 126); ensure(7 + wrapped.length * 5); doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.text(label, margin, y); doc.setFont("helvetica","normal"); doc.text(wrapped, margin + 48, y); y += Math.max(7, wrapped.length * 5 + 2); };
    addHeader("Student Evidence Report");
    doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.text(profile.name, margin, y); doc.setFont("helvetica","normal"); doc.text(`Class: ${profile.className}`, margin + 85, y); y += 11;
    section("WAGBA: KNOWLEDGE · SKILLS · UNDERSTANDING", [255,211,53]);
    line("Knowledge", "Coordinates contain an x value and a y value."); line("Skills", "Build, test and debug an accurate Scratch block sequence."); line("Understanding", "Changing a coordinate or block order changes the program outcome.");
    section("STARTER", [255,211,53]);
    line("X direction", profile.answers.starterXDirection); line("First coordinate", profile.answers.starterFirstCoordinate); line("Point A", `(${profile.answers.starterPointAX || "?"}, ${profile.answers.starterPointAY || "?"})`); line("Starting event", profile.answers.starterEvent);
    section("MAIN ACTIVITY 1 · PREDICTIONS", [76,151,255]);
    profile.predictions.forEach((answer, index) => { line(`Level ${index + 1}`, answer.saved ? `Final position (${answer.x}, ${answer.y})` : "Not completed"); line("Explanation", answer.explain); });
    section("MAIN ACTIVITY 2 · BUILD NOTES", [153,102,255]);
    line("Predicted finish", profile.answers.main2Prediction); line("Debugging", profile.answers.main2Debug); line("Scratch filename", profile.answers.main2Filename);
    section("EXTENSION", [56,173,114]);
    line("Levels completed", profile.extensionComplete.map((done, index) => done ? index + 1 : null).filter(Boolean).join(", ") || "None"); line("Improvement notes", profile.answers.extensionNotes);
    section("PLENARY", [232,103,162]);
    line("What is a coordinate?", profile.answers.plenaryCoordinate); line("Why order matters", profile.answers.plenarySequence); line("How I debugged", profile.answers.plenaryDebug); line("Confidence", profile.answers.confidence ? `${profile.answers.confidence} / 5` : "Not selected");
    const allShots = [];
    Object.keys(profile.screenshots).forEach(area => profile.screenshots[area].forEach((shot, index) => allShots.push({ ...shot, label: `${area.toUpperCase()} EVIDENCE ${index + 1}` })));
    allShots.forEach(shot => { newPage(shot.label); try { const props = doc.getImageProperties(shot.data); const ratio = props.width / props.height; let imageWidth = width, imageHeight = imageWidth / ratio; if (imageHeight > 220) { imageHeight = 220; imageWidth = imageHeight * ratio; } doc.addImage(shot.data, "JPEG", margin + (width - imageWidth) / 2, y, imageWidth, imageHeight, undefined, "FAST"); y += imageHeight + 8; doc.setFontSize(9); doc.text(shot.name || "Student screenshot", margin, y); } catch (error) { line("Image", "This screenshot could not be placed into the PDF."); } });
    newPage("Submission checklist"); section("MICROSOFT TEAMS", [98,100,167]); line("1", "Open the correct Computing assignment in Teams."); line("2", "Choose Add work or Attach."); line("3", `Upload ${safeFilename(`${profile.name}_${profile.className}_CoordinateQuest.pdf`)}.`); line("4", "Wait for the upload, check the attachment, then select Turn in.");
    addFooter(); const filename = safeFilename(`${profile.name}_${profile.className}_CoordinateQuest.pdf`); doc.save(filename); profile.completed.report = true; saveProfile(true); setFeedback("#pdfFeedback", `Downloaded ${filename}. Open it and check your evidence before uploading to Teams.`, true); toast("PDF downloaded.");
  }

  $("#entryForm").addEventListener("submit", event => {
    event.preventDefault(); const name = $("#studentName").value.trim(); const studentClass = $("#studentClass").value.trim();
    if (name.toLowerCase() === "teacher") { enterLesson("Teacher", "All classes", true); return; }
    if (!name || !studentClass) { $("#entryError").textContent = "Please type both your name and your class."; return; }
    enterLesson(name, studentClass, false);
  });
  $("#resumeButton").addEventListener("click", event => { const saved = profiles[event.currentTarget.dataset.id]; if (saved) enterLesson(saved.name, saved.className, false); });
  $("#switchUserButton").addEventListener("click", () => { if (!isTeacher) saveProfile(true); sessionStorage.removeItem(SESSION_KEY); profile = null; showLanding(); });
  $("#menuButton").addEventListener("click", () => { const open = $("#sidebar").classList.toggle("open"); $("#menuButton").setAttribute("aria-expanded", String(open)); });
  $$(".nav-item").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
  $$(".jump-button").forEach(button => button.addEventListener("click", () => showPage(button.dataset.jump)));
  $$(".continue-button").forEach(button => button.addEventListener("click", () => continueTo(button.dataset.current, button.dataset.next)));
  $("#resetWorkButton").addEventListener("click", () => { if (isTeacher) return; askConfirm("Reset this profile?", "This will permanently remove all saved answers and screenshots for this name and class from this device.", () => { delete profiles[profile.id]; localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles)); sessionStorage.removeItem(SESSION_KEY); profile = null; showLanding(); }); });
  $("#dialogConfirm").addEventListener("click", () => { if (pendingDialogAction) pendingDialogAction(); pendingDialogAction = null; });
  $("#refreshRecordsButton").addEventListener("click", renderRecords);
  $$(".concept-tabs button").forEach(button => button.addEventListener("click", () => {
    $$(".concept-tabs button").forEach(item => item.classList.remove("active")); button.classList.add("active");
    const content = { x: ["X", "Across first", "The x coordinate moves a sprite left or right. Negative x is left; positive x is right.", "walk along the corridor before climbing the stairs.", "blue"], y: ["Y", "Then up or down", "The y coordinate moves a sprite up or down. Negative y is down; positive y is up.", "climb the stairs only after moving across.", "purple"], event: ["⚑", "What starts the code?", "An event tells Scratch when to begin a script. The green flag and a key press are both events.", "look for the hat-shaped block at the top.", "yellow"] }[button.dataset.concept];
    $("#conceptPanel").innerHTML = `<div class="big-letter ${content[4]}">${content[0]}</div><div><h2>${content[1]}</h2><p>${content[2]}</p><p class="memory-tip"><strong>Memory tip:</strong> ${content[3]}</p></div>`;
  }));
  $("#referenceToggle").addEventListener("click", event => { const image = $("#referenceImage"); image.hidden = !image.hidden; event.currentTarget.textContent = image.hidden ? "Show the full coordinate reference ↓" : "Hide coordinate reference ↑"; });
  $("#starterForm").addEventListener("submit", event => {
    event.preventDefault(); const values = collectForm(event.currentTarget); Object.assign(profile.answers, values);
    const pointX = String(values.starterPointAX || "").trim().replace("−", "-");
    const pointY = String(values.starterPointAY || "").trim().replace("−", "-");
    const correct = values.starterXDirection === "left-right" && values.starterFirstCoordinate === "x" && pointX === "-120" && pointY === "-135" && values.starterEvent === "flag";
    profile.completed.starter = correct; saveProfile(true);
    setFeedback("#starterFeedback", correct ? "Starter complete. Main Activity 1 is ready—use the yellow Continue button below." : "Try again. Read x across first, then read y up or down. Include the negative signs for Point A.", correct);
  });
  $("#predictionPrev").addEventListener("click", () => { predictionIndex = Math.max(0, predictionIndex - 1); renderPrediction(); });
  $("#predictionNext").addEventListener("click", () => { predictionIndex = Math.min(2, predictionIndex + 1); renderPrediction(); });
  $("#predictionForm").addEventListener("submit", event => {
    event.preventDefault(); const x = $("#predictionX").value.trim(), y = $("#predictionY").value.trim(), explain = $("#predictionExplain").value.trim();
    if (!x || !y || explain.length < 8) { setFeedback("#predictionFeedback", "Enter both coordinates and explain your thinking.", false); return; }
    const correct = x.replace("−", "-") === predictions[predictionIndex].x && y.replace("−", "-") === predictions[predictionIndex].y;
    profile.predictions[predictionIndex] = { x, y, explain, saved: true, correct }; saveProfile(true);
    const allSaved = profile.predictions.filter(answer => answer.saved).length === 3;
    setFeedback("#predictionFeedback", allSaved ? "All three predictions are saved. Use the yellow Continue button below." : correct ? "Prediction saved—and the final coordinate is correct." : "Prediction saved. Recheck the x and y changes before running the code.", allSaved || correct);
    if (correct && predictionIndex < 2) setTimeout(() => { predictionIndex += 1; renderPrediction(); }, 700);
  });
  $("#main2Form").addEventListener("submit", event => { event.preventDefault(); const values = collectForm(event.currentTarget); Object.assign(profile.answers, values); const complete = (values.main2Prediction || "").trim() && (values.main2Debug || "").trim().length >= 10 && (values.main2Filename || "").trim(); profile.completed.main2 = !!complete; saveProfile(true); const ready = pageComplete("main2"); setFeedback("#main2Feedback", ready ? "Main Activity 2 complete. Use the yellow Continue button below." : complete ? "Build notes saved. Add the required Scratch screenshot to finish this step." : "Complete all three build-note fields.", ready); });
  $$('[data-upload]').forEach(input => input.addEventListener("change", handleUpload));
  $("#extensionPrev").addEventListener("click", () => { extensionIndex = Math.max(0, extensionIndex - 1); renderExtension(); });
  $("#extensionNext").addEventListener("click", () => { extensionIndex = Math.min(4, extensionIndex + 1); renderExtension(); });
  $("#extensionComplete").addEventListener("change", event => { profile.extensionComplete[extensionIndex] = event.target.checked; saveProfile(true); renderExtension(); toast(event.target.checked ? "Extension level marked complete." : "Extension level reopened."); });
  $("#extensionNotes").addEventListener("input", event => { profile.answers.extensionNotes = event.target.value; saveProfile(); });
  $("#extensionNotes").addEventListener("blur", () => { if (pageComplete("extension")) toast("Extension complete. Use the yellow Continue button."); });
  $("#plenaryForm").addEventListener("submit", event => { event.preventDefault(); const values = collectForm(event.currentTarget); Object.assign(profile.answers, values); const complete = [values.plenaryCoordinate, values.plenarySequence, values.plenaryDebug].every(value => (value || "").trim().length >= 10) && values.confidence; profile.completed.plenary = !!complete; saveProfile(true); setFeedback("#plenaryFeedback", complete ? "Exit ticket saved. Your report is ready to build." : "Write a complete response for all three questions and choose a confidence level.", complete); });
  $("#teamsSubmitted").addEventListener("change", event => { profile.teamsSubmitted = event.target.checked; saveProfile(true); updateProgress(); });
  $("#exportPdfButton").addEventListener("click", exportPDF);
  document.addEventListener("visibilitychange", () => { if (document.hidden) saveProfile(true); }); window.addEventListener("beforeunload", () => saveProfile(true));

  if (profile) enterLesson(profile.name, profile.className, false); else showLanding();
})();
