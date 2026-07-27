/* ==========================================================================
   LAB LAUNCH — MAIN APPLICATION
   All lesson logic, screens, differentiation, activities and teacher mode.
   No data ever leaves this device.
   ========================================================================== */
(function () {
  "use strict";

  const CFG = window.LAB_CONFIG || {};
  const S = window.LabStore;
  let state = S.load();
  let game = null;
  let teacherMode = false;
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem("labLaunch_teacherOverrides") || "{}"); } catch (e) { overrides = {}; }

  function scratchUrl() { return overrides.scratchUrl || CFG.SCRATCH_PROJECT_URL || "https://scratch.mit.edu/"; }
  function classOptions() { return overrides.classOptions || CFG.CLASS_OPTIONS || []; }
  function soundEnabled() { return (overrides.sound !== undefined ? overrides.sound : CFG.ENABLE_SOUND) && !state.settings.muted; }

  /* ======================= STAGES ======================= */

  const STAGES = [
    { id: "landing",     name: "Welcome Station",       icon: "🛰️" },
    { id: "support",     name: "Support Setup",         icon: "🎛️" },
    { id: "briefing",    name: "Mission Briefing",      icon: "📋" },
    { id: "starter",     name: "Safety Corridor",       icon: "🚦", time: "about 7 min" },
    { id: "routines",    name: "Lab Operating System",  icon: "⚙️", time: "about 10 min" },
    { id: "files",       name: "File Management Centre",icon: "📁", time: "about 7 min" },
    { id: "investigate", name: "Scratch Laboratory",    icon: "🔬", time: "about 6 min" },
    { id: "modify",      name: "Modification Mission",  icon: "🧩", time: "about 10 min" },
    { id: "evidence",    name: "Evidence Station",      icon: "📸", time: "about 7 min" },
    { id: "extension",   name: "Extension Vault",       icon: "🗝️", optional: true },
    { id: "plenary",     name: "Exit Terminal",         icon: "🖥️", time: "8–10 min" },
    { id: "report",      name: "Completion Report",     icon: "📄" }
  ];

  const BADGES = {
    safety:   { name: "Safety Scanner",   emoji: "🛡️" },
    routine:  { name: "Routine Ranger",   emoji: "🧭" },
    file:     { name: "File Finder",      emoji: "📂" },
    detective:{ name: "Scratch Detective",emoji: "🔍" },
    improver: { name: "Program Improver", emoji: "🔧" },
    evidence: { name: "Evidence Expert",  emoji: "🏅" },
    ready:    { name: "Year 6 Lab Ready", emoji: "🚀" }
  };

  function stageById(id) { return STAGES.find(function (s) { return s.id === id; }); }
  function isUnlocked(id) { return teacherMode || state.teacherUnlockedAll || state.unlocked.indexOf(id) !== -1; }
  function isDone(id) { return state.completed.indexOf(id) !== -1; }

  function unlock(id) {
    if (state.unlocked.indexOf(id) === -1) { state.unlocked.push(id); }
  }

  function completeStage(id) {
    if (state.completed.indexOf(id) === -1) { state.completed.push(id); }
    const idx = STAGES.findIndex(function (s) { return s.id === id; });
    if (id === "evidence") {
      unlock("extension");
      unlock("plenary");
    } else if (id === "extension") {
      unlock("plenary");
    } else if (idx >= 0 && idx + 1 < STAGES.length) {
      unlock(STAGES[idx + 1].id);
    }
    S.save();
    updateChrome();
  }

  /* ======================= DOM HELPERS ======================= */

  function $(sel, root) { return (root || document).querySelector(sel); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "html") { node.innerHTML = attrs[k]; }
        else if (k === "text") { node.textContent = attrs[k]; }
        else if (k === "onclick") { node.addEventListener("click", attrs[k]); }
        else if (k === "class") { node.className = attrs[k]; }
        else { node.setAttribute(k, attrs[k]); }
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === "string") { node.appendChild(document.createTextNode(c)); }
      else if (c) { node.appendChild(c); }
    });
    return node;
  }

  function clearMain() {
    if (game) { game.destroy(); game = null; }
    stopSpeech();
    const main = $("#main");
    main.innerHTML = "";
    return main;
  }

  function toast(msg, emoji) {
    const root = $("#toastRoot");
    const t = el("div", { class: "toast" }, [
      el("span", { class: "t-emoji", "aria-hidden": "true", text: emoji || "✨" }),
      el("span", { text: msg })
    ]);
    root.appendChild(t);
    setTimeout(function () { if (t.parentNode) { t.parentNode.removeChild(t); } }, 4200);
  }

  /* ======================= SOUND (original WebAudio blips) ======================= */

  let audioCtx = null;
  function beep(freqs, dur, type) {
    if (!soundEnabled()) { return; }
    try {
      if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      const now = audioCtx.currentTime;
      freqs.forEach(function (f, i) {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type || "sine";
        osc.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + i * dur);
        g.gain.exponentialRampToValueAtTime(0.12, now + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + (i + 1) * dur);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(now + i * dur);
        osc.stop(now + (i + 1) * dur + 0.05);
      });
    } catch (e) { /* audio unavailable — fine */ }
  }
  const sfx = {
    correct: function () { beep([523, 659, 784], 0.09); },
    wrong:   function () { beep([330, 262], 0.14, "triangle"); },
    chip:    function () { beep([880, 1175], 0.07); },
    badge:   function () { beep([523, 659, 784, 1047], 0.11); }
  };

  /* ======================= READ-ALOUD ======================= */

  function stopSpeech() {
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }

  function speakBtn(text) {
    if (!CFG.ENABLE_READ_ALOUD || !window.speechSynthesis) { return null; }
    const b = el("button", {
      type: "button", class: "btn-speak", "aria-label": "Read this aloud",
      "aria-pressed": "false", title: "Read aloud", text: "🔈"
    });
    b.addEventListener("click", function () {
      const speaking = b.getAttribute("aria-pressed") === "true";
      stopSpeech();
      document.querySelectorAll(".btn-speak[aria-pressed='true']").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      if (speaking) { return; }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-GB";
      u.rate = 0.95;
      u.onend = function () { b.setAttribute("aria-pressed", "false"); };
      b.setAttribute("aria-pressed", "true");
      window.speechSynthesis.speak(u);
    });
    return b;
  }

  function instructionRow(text, extraClass) {
    const row = el("div", { class: "instruction-row " + (extraClass || "") });
    const sb = speakBtn(text);
    if (sb) { row.appendChild(sb); }
    row.appendChild(el("p", { text: text }));
    return row;
  }

  /* ======================= MODAL with focus trap ======================= */

  let lastFocused = null;

  function openModal(build, opts) {
    opts = opts || {};
    closeModal();
    lastFocused = document.activeElement;
    const root = $("#modalRoot");
    const backdrop = el("div", { class: "modal-backdrop" });
    const modal = el("div", { class: "modal", role: "dialog", "aria-modal": "true" });
    backdrop.appendChild(modal);
    root.appendChild(backdrop);
    build(modal);
    const focusables = function () {
      return Array.prototype.filter.call(
        modal.querySelectorAll("button, input, textarea, select, a[href]"),
        function (n) { return !n.disabled && n.offsetParent !== null; }
      );
    };
    backdrop.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) { return; }
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      } else if (e.key === "Escape" && opts.dismissable) {
        closeModal();
        if (opts.onDismiss) { opts.onDismiss(); }
      }
    });
    const f = focusables();
    if (f.length) { f[0].focus(); } else { modal.setAttribute("tabindex", "-1"); modal.focus(); }
    return modal;
  }

  function closeModal() {
    const root = $("#modalRoot");
    root.innerHTML = "";
    stopSpeech();
    if (lastFocused && document.body.contains(lastFocused)) { try { lastFocused.focus(); } catch (e) {} }
    lastFocused = null;
  }

  /* ======================= CHROME (header / progress / panels) ======================= */

  function requiredStages() { return STAGES.filter(function (s) { return !s.optional && s.id !== "landing" && s.id !== "report"; }); }

  function updateChrome() {
    const header = $("#appHeader");
    const pw = $("#progressWrap");
    const started = !!state.student.name;
    header.hidden = !started;
    pw.hidden = !started;
    if (!started) { return; }
    $("#headerTitle").textContent = CFG.APP_TITLE || "Lab Launch";
    $("#headerStudent").textContent = state.student.name + " · " + state.student.className;
    $("#chipCount").textContent = String(state.chips);
    const req = requiredStages();
    const done = req.filter(function (s) { return isDone(s.id); }).length;
    const pct = Math.round((done / req.length) * 100);
    $("#progressFill").style.width = pct + "%";
    $("#progressBar").setAttribute("aria-valuenow", String(pct));
    $("#btnMute").textContent = state.settings.muted ? "🔇" : "🔊";
    $("#btnMute").setAttribute("aria-pressed", String(state.settings.muted));
  }

  function addChips(n) {
    state.chips += n;
    S.save();
    updateChrome();
    sfx.chip();
  }

  function awardBadge(key) {
    if (state.badges.indexOf(key) !== -1) { return; }
    state.badges.push(key);
    S.save();
    const b = BADGES[key];
    toast("Badge earned: " + b.name + "!", b.emoji);
    sfx.badge();
    addChips(3);
  }

  /* ======================= PROFILE HELPERS ======================= */

  function langSupport() { return state.profile.lang === "support"; }
  function typingSupport() { return state.profile.typing === "support"; }

  /* ======================= AVATARS (original SVG) ======================= */

  const AVATARS = [
    { id: "aqua",  name: "Aqua",  hue: 174 },
    { id: "amber", name: "Amber", hue: 36 },
    { id: "viola", name: "Viola", hue: 255 },
    { id: "lime",  name: "Lime",  hue: 110 }
  ];

  function avatarSVG(hue, size) {
    size = size || 72;
    return '<svg viewBox="0 0 60 74" width="' + size + '" height="' + Math.round(size * 74 / 60) + '" aria-hidden="true">' +
      '<rect x="12" y="26" width="36" height="34" rx="8" fill="hsl(' + hue + ',65%,55%)"/>' +
      '<rect x="14" y="4" width="32" height="24" rx="8" fill="hsl(' + hue + ',55%,70%)"/>' +
      '<rect x="20" y="10" width="20" height="10" rx="5" fill="#0d1836"/>' +
      '<rect x="24" y="12" width="5" height="6" rx="2" fill="#40e0d0"/>' +
      '<rect x="33" y="12" width="5" height="6" rx="2" fill="#40e0d0"/>' +
      '<line x1="30" y1="4" x2="30" y2="-2" stroke="hsl(' + hue + ',55%,70%)" stroke-width="2"/>' +
      '<circle cx="30" cy="0" r="3" fill="#ffb84d"/>' +
      '<rect x="16" y="60" width="10" height="12" rx="3" fill="hsl(' + hue + ',65%,40%)"/>' +
      '<rect x="34" y="60" width="10" height="12" rx="3" fill="hsl(' + hue + ',65%,40%)"/>' +
      '<circle cx="30" cy="42" r="6" fill="hsl(' + hue + ',50%,35%)"/>' +
      '<circle cx="30" cy="42" r="3" fill="#40e0d0"/>' +
      '</svg>';
  }

  function robotGuideSVG(size) {
    return '<svg viewBox="0 0 60 74" width="' + (size || 64) + '" height="' + Math.round((size || 64) * 74 / 60) + '" aria-hidden="true">' +
      '<rect x="10" y="28" width="40" height="32" rx="10" fill="#8f7dff"/>' +
      '<rect x="14" y="6" width="32" height="22" rx="10" fill="#b0a4ff"/>' +
      '<circle cx="24" cy="17" r="4" fill="#0d1836"/><circle cx="36" cy="17" r="4" fill="#0d1836"/>' +
      '<path d="M24 22 q6 5 12 0" stroke="#0d1836" stroke-width="2" fill="none"/>' +
      '<circle cx="30" cy="2" r="3" fill="#40e0d0"/>' +
      '<rect x="22" y="36" width="16" height="12" rx="3" fill="#0d1836"/>' +
      '<text x="30" y="46" font-size="9" fill="#40e0d0" text-anchor="middle" font-family="monospace">OK</text>' +
      '</svg>';
  }

  function currentAvatarHue() {
    const av = AVATARS.find(function (a) { return a.id === state.student.avatar; });
    return av ? av.hue : 174;
  }

  /* ======================= FLEXIBLE ANSWER CHECKING ======================= */

  function matchKeywordGroups(text, groups) {
    const t = " " + String(text).toLowerCase().replace(/[^a-z0-9\s]/g, " ") + " ";
    let matched = 0;
    groups.forEach(function (group) {
      const hit = group.some(function (word) { return t.indexOf(word.toLowerCase()) !== -1; });
      if (hit) { matched++; }
    });
    return matched;
  }

  /* ======================= QUESTION BUILDERS ======================= */

  function scenarioBlock(sc) {
    const wrap = el("div", { class: "scenario-card" });
    wrap.innerHTML = avatarSVG(sc.hue || 200, 56);
    const txt = langSupport() && sc.short ? sc.short : sc.text;
    const inner = el("div");
    const sb = speakBtn(txt);
    const row = el("div", { class: "instruction-row" });
    if (sb) { row.appendChild(sb); }
    row.appendChild(el("p", { class: "scenario-text", text: txt }));
    inner.appendChild(row);
    wrap.appendChild(inner);
    return wrap;
  }

  /* Multiple choice question inside a modal. */
  function askMCQ(cfg, onFinished) {
    let attempts = 0;
    openModal(function (m) {
      m.appendChild(el("h2", { text: cfg.title }));
      if (cfg.scenario) { m.appendChild(scenarioBlock(cfg.scenario)); }
      const qRow = el("div", { class: "instruction-row" });
      const sb = speakBtn(cfg.question);
      if (sb) { qRow.appendChild(sb); }
      qRow.appendChild(el("p", { html: "<strong>" + esc(cfg.question) + "</strong>" }));
      m.appendChild(qRow);
      const fb = el("div", { "aria-live": "polite" });
      const optWrap = el("div");
      const letters = ["A", "B", "C", "D", "E"];
      cfg.options.forEach(function (opt, i) {
        const b = el("button", { type: "button", class: "answer-option" }, [
          el("span", { class: "opt-letter", text: letters[i] }),
          el("span", { text: opt })
        ]);
        b.addEventListener("click", function () {
          if (b.disabled) { return; }
          attempts++;
          fb.innerHTML = "";
          if (i === cfg.correct) {
            sfx.correct();
            b.classList.add("opt-correct");
            optWrap.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
            fb.appendChild(el("div", { class: "feedback feedback-good", text: "✔ " + cfg.feedback }));
            const cont = el("button", { type: "button", class: "btn", text: "Continue" });
            cont.addEventListener("click", function () {
              closeModal();
              onFinished({ correct: true, attempts: attempts, chosen: cfg.options[i] });
            });
            fb.appendChild(el("div", { class: "modal-actions" }, [cont]));
            cont.focus();
          } else {
            sfx.wrong();
            b.classList.add("opt-wrong");
            b.disabled = true;
            if (attempts === 1) {
              fb.appendChild(el("div", { class: "feedback feedback-try", text: "Not quite — have another look and try again. Everyone learns from a second try!" }));
              if (cfg.hint) { fb.appendChild(el("div", { class: "hint-box", html: "<strong>Hint:</strong> " + esc(cfg.hint) })); }
            } else {
              fb.appendChild(el("div", { class: "feedback feedback-info", html: "<strong>Let's look at it together:</strong> " + esc(cfg.feedback) + " Now choose the best answer to carry on." }));
            }
          }
        });
        optWrap.appendChild(b);
      });
      m.appendChild(optWrap);
      m.appendChild(fb);
    });
  }

  /* Select-all-that-apply inside a modal. */
  function askSelectAll(cfg, onFinished) {
    let attempts = 0;
    openModal(function (m) {
      m.appendChild(el("h2", { text: cfg.title }));
      if (cfg.scenario) { m.appendChild(scenarioBlock(cfg.scenario)); }
      const qRow = el("div", { class: "instruction-row" });
      const sb = speakBtn(cfg.question);
      if (sb) { qRow.appendChild(sb); }
      qRow.appendChild(el("p", { html: "<strong>" + esc(cfg.question) + "</strong> <em>(choose every correct answer)</em>" }));
      m.appendChild(qRow);
      const fb = el("div", { "aria-live": "polite" });
      const boxes = [];
      const wrap = el("div");
      cfg.items.forEach(function (item) {
        const cb = el("input", { type: "checkbox" });
        const lab = el("label", { class: "check-option" }, [cb, el("span", { text: item.text })]);
        boxes.push({ cb: cb, lab: lab, item: item });
        wrap.appendChild(lab);
      });
      m.appendChild(wrap);
      const check = el("button", { type: "button", class: "btn", text: "Check my answer" });
      m.appendChild(el("div", { class: "modal-actions" }, [check]));
      m.appendChild(fb);
      check.addEventListener("click", function () {
        attempts++;
        fb.innerHTML = "";
        let allRight = true;
        boxes.forEach(function (b) {
          b.lab.classList.remove("opt-correct", "opt-wrong");
          if (b.cb.checked && b.item.correct) { b.lab.classList.add("opt-correct"); }
          else if (b.cb.checked && !b.item.correct) { b.lab.classList.add("opt-wrong"); allRight = false; }
          else if (!b.cb.checked && b.item.correct) { allRight = false; }
        });
        if (allRight) {
          sfx.correct();
          boxes.forEach(function (b) { b.cb.disabled = true; });
          check.disabled = true;
          fb.appendChild(el("div", { class: "feedback feedback-good", text: "✔ " + cfg.feedback }));
          const cont = el("button", { type: "button", class: "btn", text: "Continue" });
          cont.addEventListener("click", function () {
            closeModal();
            onFinished({ correct: true, attempts: attempts, chosen: "All correct routines selected" });
          });
          fb.appendChild(el("div", { class: "modal-actions" }, [cont]));
          cont.focus();
        } else {
          sfx.wrong();
          if (attempts === 1) {
            fb.appendChild(el("div", { class: "feedback feedback-try", text: "Almost — check the highlighted choices. Tick every correct routine and untick anything that is not part of a good finishing routine." }));
          } else {
            fb.appendChild(el("div", { class: "feedback feedback-info", html: "<strong>Remember:</strong> " + esc(cfg.hint) }));
          }
        }
      });
    });
  }

  /* Open typed response with flexible keyword checking. */
  function askOpen(cfg, onFinished) {
    let attempts = 0;
    openModal(function (m) {
      m.appendChild(el("h2", { text: cfg.title }));
      if (cfg.scenario) { m.appendChild(scenarioBlock(cfg.scenario)); }
      const qRow = el("div", { class: "instruction-row" });
      const sb = speakBtn(cfg.prompt);
      if (sb) { qRow.appendChild(sb); }
      qRow.appendChild(el("p", { html: "<strong>" + esc(cfg.prompt) + "</strong>" }));
      m.appendChild(qRow);

      const ta = el("textarea", { class: "plain-input", rows: "3", "aria-label": "Your answer" });
      if (langSupport() && cfg.starter) {
        m.appendChild(el("p", { class: "sentence-starter", text: "Sentence starter: " + cfg.starter }));
        ta.value = "";
        ta.placeholder = cfg.starter;
      }
      if (langSupport() && cfg.wordbank) {
        m.appendChild(el("p", { html: "<strong>Word bank</strong> — click a word to add it:" }));
        const wb = el("div", { class: "word-bank" });
        cfg.wordbank.forEach(function (w) {
          const wbtn = el("button", { type: "button", class: "wb-word", text: w });
          wbtn.addEventListener("click", function () {
            ta.value = (ta.value ? ta.value.replace(/\s+$/, "") + " " : "") + w;
            ta.focus();
          });
          wb.appendChild(wbtn);
        });
        m.appendChild(wb);
      }
      m.appendChild(ta);
      const fb = el("div", { "aria-live": "polite" });
      const submit = el("button", { type: "button", class: "btn", text: "Submit my answer" });
      m.appendChild(el("div", { class: "modal-actions" }, [submit]));
      m.appendChild(fb);

      function finishWith(text, ok) {
        const cont = el("button", { type: "button", class: "btn", text: "I have compared my answer — continue" });
        cont.addEventListener("click", function () {
          closeModal();
          onFinished({ correct: ok, attempts: attempts, chosen: text });
        });
        fb.appendChild(el("div", { class: "model-answer", html: "<strong>Model answer:</strong> " + esc(cfg.model) + "<br><em>Compare your answer with the model. Did you include similar ideas?</em>" }));
        fb.appendChild(el("div", { class: "modal-actions" }, [cont]));
        cont.focus();
      }

      submit.addEventListener("click", function () {
        const text = ta.value.trim();
        fb.innerHTML = "";
        if (text.length < (cfg.minLen || 15)) {
          fb.appendChild(el("div", { class: "feedback feedback-try", text: "Add a little more detail — try writing at least one full idea." }));
          return;
        }
        attempts++;
        const matched = matchKeywordGroups(text, cfg.keywords);
        const need = cfg.minGroups || 2;
        if (matched >= need) {
          sfx.correct();
          submit.disabled = true; ta.disabled = true;
          fb.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Great thinking — your answer includes the important ideas." }));
          finishWith(text, true);
        } else if (attempts === 1) {
          sfx.wrong();
          fb.appendChild(el("div", { class: "feedback feedback-try", text: "You are on the way — add a bit more about the key idea and try again." }));
          if (cfg.hint) { fb.appendChild(el("div", { class: "hint-box", html: "<strong>Hint:</strong> " + esc(cfg.hint) })); }
        } else {
          submit.disabled = true; ta.disabled = true;
          fb.appendChild(el("div", { class: "feedback feedback-info", text: "Thank you for your effort — here is a model answer to compare with yours. Your teacher can review your answer later." }));
          finishWith(text, false);
        }
      });
    });
  }

  /* ======================= STARTER SCENARIO DATA ======================= */

  const STARTER = [
    {
      id: "adam", label: "Room 1: Adam", hue: 20,
      scenario: {
        hue: 20,
        text: "Adam immediately logs in and opens a game while the teacher is giving instructions.",
        short: "Adam opens a game while the teacher is talking."
      },
      mcq: {
        question: "What should Adam do?",
        options: [
          "Keep playing until the teacher notices.",
          "Stop, listen and open only the application the teacher requests.",
          "Ask another student to join the game."
        ],
        correct: 1,
        feedback: "Adam should wait for instructions so that he knows the learning task and uses only the required application.",
        hint: "Think about what helps Adam know what the learning task is."
      },
      open: {
        prompt: "Explain why Adam is not ready and what he should do instead.",
        starter: "Adam should __________ because __________.",
        wordbank: ["stop", "close the game", "listen", "wait", "instructions", "teacher", "correct application", "focus"],
        keywords: [
          ["stop", "close", "quit", "exit", "pause"],
          ["listen", "wait", "instruction", "attention", "teacher", "pay attention"],
          ["correct app", "right app", "required app", "the application", "task", "focus", "learning"]
        ],
        minGroups: 2,
        model: "Adam should stop the game and listen to the teacher, because the instructions tell him what the learning task is. Then he should open only the application the teacher asks for."
      }
    },
    {
      id: "mei", label: "Room 2: Mei", hue: 300,
      scenario: {
        hue: 300,
        text: "Mei notices that a cable looks damaged. She does not touch it and informs the teacher.",
        short: "Mei sees a damaged cable. She does not touch it. She tells the teacher."
      },
      mcq: {
        question: "Why was Mei's decision responsible?",
        options: [
          "She avoided touching possibly unsafe equipment and reported it.",
          "She should have repaired the cable herself.",
          "She should have hidden the cable so nobody could see it."
        ],
        correct: 0,
        feedback: "Damaged equipment can be unsafe. Mei kept herself safe by not touching it and made sure an adult could deal with it.",
        hint: "Think about safety — who should deal with damaged equipment?"
      },
      open: {
        prompt: "Explain why Mei made a safe and responsible decision.",
        starter: "Mei was responsible because __________.",
        wordbank: ["did not touch", "damaged", "unsafe", "dangerous", "told the teacher", "reported", "adult"],
        keywords: [
          ["not touch", "didn't touch", "did not touch", "avoided", "left it", "stayed away"],
          ["unsafe", "danger", "hurt", "electric", "shock", "damaged", "broken"],
          ["teacher", "adult", "report", "told", "inform"]
        ],
        minGroups: 2,
        model: "Mei was responsible because she did not touch the damaged cable, which could be unsafe, and she reported it to the teacher so it could be fixed properly."
      }
    },
    {
      id: "rohan", label: "Room 3: Rohan", hue: 210,
      scenario: {
        hue: 210,
        text: "Rohan finishes his program and saves it as: “my work final new 2”.",
        short: "Rohan saves his file as “my work final new 2”."
      },
      mcq: {
        question: "Which filename would be easiest to understand and find later?",
        options: [
          "my work final new 2",
          "project",
          "Y6_T1W01_ScratchBaseline_v1"
        ],
        correct: 2,
        feedback: "Y6_T1W01_ScratchBaseline_v1 tells you the year group, term, week, project and version — so anyone can find the right file quickly.",
        hint: "A good filename tells you what the file is, when it was made and which version it is."
      },
      open: {
        prompt: "Explain the problem with Rohan's filename and suggest a better filename.",
        starter: "The problem is __________. A better filename would be __________.",
        wordbank: ["confusing", "hard to find", "which version", "clear", "Y6_T1W01_ScratchBaseline_v1", "meaningful", "organised"],
        keywords: [
          ["confus", "unclear", "hard to find", "doesn't say", "does not say", "which one", "which version", "messy", "vague", "meaning"],
          ["y6", "baseline", "scratchbaseline", "version", "date", "clear name", "better name", "v1", "t1w01", "week", "term"]
        ],
        minGroups: 2,
        model: "Rohan's filename is confusing because it does not say what the project is or which version is the newest. A better filename is Y6_T1W01_ScratchBaseline_v1, because it shows the year, term, week, project and version."
      }
    },
    {
      id: "hana", label: "Room 4: Hana", hue: 130,
      scenario: {
        hue: 130,
        text: "Hana saves her work, checks the filename, closes every application, signs out and leaves the workstation ready for the next class.",
        short: "Hana saves, checks the filename, closes everything, signs out and tidies her workstation."
      },
      selectAll: {
        question: "Which correct finishing routines did Hana demonstrate?",
        items: [
          { text: "Save and check the file.", correct: true },
          { text: "Leave her account logged in.", correct: false },
          { text: "Close applications.", correct: true },
          { text: "Disconnect the keyboard.", correct: false },
          { text: "Sign out.", correct: true },
          { text: "Open another website before leaving.", correct: false },
          { text: "Leave the workstation ready.", correct: true }
        ],
        feedback: "Hana saved and checked her file, closed her applications, signed out and left the workstation ready — the complete finishing routine.",
        hint: "The finishing routine is: save and check, close, sign out, leave the workstation ready."
      },
      open: {
        prompt: "Explain how Hana followed the correct finishing routine.",
        starter: "Hana followed the routine by __________.",
        wordbank: ["saved", "checked", "closed", "signed out", "tidied", "ready for the next class"],
        keywords: [
          ["save", "saved"],
          ["check", "filename"],
          ["close", "closed", "shut"],
          ["sign out", "signed out", "log out", "logged out", "logoff", "log off"],
          ["tidy", "tidied", "ready", "next class", "workstation", "chair"]
        ],
        minGroups: 3,
        model: "Hana saved her work and checked the filename, closed every application, signed out of her account and left the workstation tidy and ready for the next class."
      }
    }
  ];

  /* ======================= SCREENS ======================= */

  let currentScreen = "landing";

  function go(screenId) {
    currentScreen = screenId;
    state.lastScreen = screenId;
    S.save();
    const renderers = {
      landing: renderLanding, support: renderSupport, briefing: renderBriefing,
      map: renderMap, starter: renderStarter, routines: renderRoutines,
      files: renderFiles, investigate: renderInvestigate, modify: renderModify,
      evidence: renderEvidence, extension: renderExtension, plenary: renderPlenary,
      report: renderReport
    };
    (renderers[screenId] || renderMap)();
    updateChrome();
    window.scrollTo(0, 0);
    $("#main").focus({ preventScroll: true });
  }

  /* ---------- Landing ---------- */

  function heroSVG() {
    return '<svg viewBox="0 0 960 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A futuristic school computing lab with glowing screens">' +
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#1c2c58"/><stop offset="1" stop-color="#0e1630"/></linearGradient></defs>' +
      '<rect width="960" height="260" fill="url(#sky)"/>' +
      '<g stroke="#2c4176" stroke-width="2" fill="none" opacity="0.8">' +
      '<path d="M40 200 h120 M100 200 v-60 h60 M160 140 h40"/><circle cx="204" cy="140" r="5"/>' +
      '<path d="M760 210 h140 M830 210 v-80 h-50"/><circle cx="778" cy="130" r="5"/></g>' +
      '<g class="hero-glow">' +
      '<rect x="250" y="80" width="130" height="86" rx="8" fill="#22345c" stroke="#40e0d0" stroke-width="2"/>' +
      '<rect x="262" y="92" width="106" height="54" rx="4" fill="#0d1836"/>' +
      '<text x="315" y="125" font-family="monospace" font-size="15" fill="#40e0d0" text-anchor="middle">&gt; RESTORE_</text>' +
      '<rect x="295" y="166" width="40" height="26" fill="#1b2a4a"/>' +
      '<rect x="560" y="70" width="150" height="96" rx="8" fill="#22345c" stroke="#8f7dff" stroke-width="2"/>' +
      '<rect x="572" y="82" width="126" height="62" rx="4" fill="#0d1836"/>' +
      '<text x="635" y="110" font-family="monospace" font-size="13" fill="#8f7dff" text-anchor="middle">MISSION: Y6</text>' +
      '<text x="635" y="130" font-family="monospace" font-size="13" fill="#ffb84d" text-anchor="middle">LAB LAUNCH</text>' +
      '<rect x="612" y="166" width="46" height="28" fill="#1b2a4a"/></g>' +
      '<rect x="0" y="220" width="960" height="40" fill="#16244a"/>' +
      '<rect x="0" y="218" width="960" height="4" fill="#40e0d0" opacity="0.6"/>' +
      '<g transform="translate(430,150) scale(1.1)">' + '' +
      '<rect x="12" y="26" width="36" height="34" rx="8" fill="#2fbfae"/>' +
      '<rect x="14" y="4" width="32" height="24" rx="8" fill="#7de6d8"/>' +
      '<rect x="20" y="10" width="20" height="10" rx="5" fill="#0d1836"/>' +
      '<rect x="24" y="12" width="5" height="6" rx="2" fill="#40e0d0"/>' +
      '<rect x="33" y="12" width="5" height="6" rx="2" fill="#40e0d0"/>' +
      '<circle cx="30" cy="0" r="3" fill="#ffb84d"/>' +
      '<rect x="16" y="60" width="10" height="12" rx="3" fill="#1e8577"/>' +
      '<rect x="34" y="60" width="10" height="12" rx="3" fill="#1e8577"/></g>' +
      '<g fill="#40e0d0" opacity="0.9">' +
      '<rect x="130" y="60" width="10" height="10" rx="2" transform="rotate(45 135 65)"/>' +
      '<rect x="880" y="50" width="10" height="10" rx="2" transform="rotate(45 885 55)"/>' +
      '<rect x="480" y="40" width="10" height="10" rx="2" transform="rotate(45 485 45)"/></g>' +
      '</svg>';
  }

  function renderLanding() {
    const main = clearMain();
    const wrap = el("div", { class: "screen landing" });
    const hero = el("div", { class: "landing-hero", html: heroSVG() });
    wrap.appendChild(hero);
    wrap.appendChild(el("h1", { text: CFG.APP_TITLE || "Lab Launch: Year 6 Computing Quest" }));
    wrap.appendChild(el("p", { class: "subtitle", text: "Restore the Computing Lab, complete the missions and prove you are ready for Year 6." }));
    if (CFG.SCHOOL_NAME || CFG.TEACHER_NAME) {
      wrap.appendChild(el("p", { class: "school-line", text: [CFG.SCHOOL_NAME, CFG.TEACHER_NAME].filter(Boolean).join(" · ") }));
    }
    wrap.appendChild(instructionRow("Welcome back, Year 6! The lab's operating system has lost its routines. Enter your name and class, choose your avatar, and begin the mission to bring the lab back online."));

    wrap.appendChild(el("h2", { text: "Choose your avatar" }));
    const avRow = el("div", { class: "avatar-row", role: "group", "aria-label": "Choose your avatar" });
    AVATARS.forEach(function (a) {
      const b = el("button", {
        type: "button", class: "avatar-choice",
        "aria-pressed": String(state.student.avatar === a.id),
        "aria-label": "Avatar " + a.name
      });
      b.innerHTML = avatarSVG(a.hue) + '<span class="avatar-name">' + esc(a.name) + "</span>";
      b.addEventListener("click", function () {
        state.student.avatar = a.id;
        avRow.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        S.save();
      });
      avRow.appendChild(b);
    });
    wrap.appendChild(avRow);

    const form = el("div", { class: "form-grid" });
    const nameField = el("div", { class: "form-field" });
    nameField.appendChild(el("label", { for: "inpName", text: "Your full name" }));
    const inpName = el("input", { id: "inpName", type: "text", autocomplete: "off", maxlength: "60", value: state.student.name || "" });
    nameField.appendChild(inpName);
    const nameErr = el("div", { class: "field-error", "aria-live": "polite" });
    nameField.appendChild(nameErr);
    form.appendChild(nameField);

    const classField = el("div", { class: "form-field" });
    classField.appendChild(el("label", { for: "inpClass", text: "Your class" }));
    let classInput;
    const opts = classOptions();
    if (opts.length) {
      classInput = el("select", { id: "inpClass" });
      classInput.appendChild(el("option", { value: "", text: "— choose your class —" }));
      opts.forEach(function (c) {
        const o = el("option", { value: c, text: c });
        if (state.student.className === c) { o.selected = true; }
        classInput.appendChild(o);
      });
    } else {
      classInput = el("input", { id: "inpClass", type: "text", autocomplete: "off", maxlength: "20", value: state.student.className || "", placeholder: "for example 6B" });
    }
    classField.appendChild(classInput);
    const classErr = el("div", { class: "field-error", "aria-live": "polite" });
    classField.appendChild(classErr);
    form.appendChild(classField);

    const cont = el("button", { type: "button", class: "btn btn-big", text: "Continue ▶" });
    cont.addEventListener("click", function () {
      const name = inpName.value.trim();
      const cls = classInput.value.trim();
      nameErr.textContent = ""; classErr.textContent = "";
      let ok = true;
      if (name.length < 2) { nameErr.textContent = "Please enter your full name."; ok = false; }
      if (!cls) { classErr.textContent = "Please enter or choose your class."; ok = false; }
      if (!ok) { return; }
      state.student.name = name;
      state.student.className = cls;
      if (!state.student.avatar) { state.student.avatar = "aqua"; }
      if (!state.startedAt) { state.startedAt = new Date().toISOString(); }
      unlock("support");
      completeStage("landing");
      go("support");
    });
    form.appendChild(el("div", { style: "text-align:center; margin-top:0.5rem;" }, [cont]));
    wrap.appendChild(form);

    // resume notice
    if (state.completed.length > 1) {
      const res = el("div", { class: "card", style: "margin-top:1.2rem;" });
      res.appendChild(el("p", { html: "<strong>Welcome back!</strong> Your saved progress was found on this computer." }));
      const resumeBtn = el("button", { type: "button", class: "btn btn-secondary", text: "Resume my mission" });
      resumeBtn.addEventListener("click", function () { go("map"); });
      res.appendChild(resumeBtn);
      wrap.appendChild(res);
    }
    main.appendChild(wrap);
  }

  /* ---------- Support selection ---------- */

  function renderSupport() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("p", { class: "stage-eyebrow", text: "Before you begin" }));
    wrap.appendChild(el("h1", { text: "Choose what helps you learn best" }));
    wrap.appendChild(instructionRow("Everyone learns differently, and you can change these choices at any time using the Support button at the top of the screen. Nobody else can see what you choose."));

    function optionGroup(titleText, options, key) {
      const card = el("div", { class: "card" });
      card.appendChild(el("h2", { text: titleText }));
      const grp = el("div", { class: "support-options", role: "group", "aria-label": titleText });
      options.forEach(function (o) {
        const b = el("button", { type: "button", class: "support-option", "aria-pressed": String(state.profile[key] === o.value) }, [
          el("span", { class: "opt-emoji", "aria-hidden": "true", text: o.emoji }),
          el("span", { text: o.text })
        ]);
        b.addEventListener("click", function () {
          state.profile[key] = o.value;
          grp.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          S.save();
        });
        grp.appendChild(b);
      });
      card.appendChild(grp);
      return card;
    }

    wrap.appendChild(optionGroup("How would you like to read today's missions?", [
      { value: "support", emoji: "🖼️", text: "I would like shorter instructions, pictures and sentence starters." },
      { value: "full", emoji: "📖", text: "I am comfortable reading detailed instructions." }
    ], "lang"));
    wrap.appendChild(optionGroup("How would you like to answer?", [
      { value: "support", emoji: "🎯", text: "I would prefer choosing, matching or using short answers." },
      { value: "full", emoji: "⌨️", text: "I am comfortable typing complete sentences." }
    ], "typing"));

    const extra = el("div", { class: "card" });
    extra.appendChild(el("h2", { text: "Comfort settings" }));
    const rm = el("label", { class: "check-option" });
    const rmCb = el("input", { type: "checkbox" });
    rmCb.checked = state.settings.reducedMotion;
    rmCb.addEventListener("change", function () {
      state.settings.reducedMotion = rmCb.checked;
      document.body.classList.toggle("reduced-motion", rmCb.checked);
      S.save();
    });
    rm.appendChild(rmCb);
    rm.appendChild(el("span", { text: "Reduce movement and animation" }));
    extra.appendChild(rm);
    const gm = el("label", { class: "check-option" });
    const gmCb = el("input", { type: "checkbox" });
    gmCb.checked = state.settings.guidedMode;
    gmCb.addEventListener("change", function () { state.settings.guidedMode = gmCb.checked; S.save(); });
    gm.appendChild(gmCb);
    gm.appendChild(el("span", { text: "Guided Movement Mode — click where to go instead of using platform-game controls" }));
    extra.appendChild(gm);
    wrap.appendChild(extra);

    const err = el("div", { class: "field-error", "aria-live": "polite" });
    const cont = el("button", { type: "button", class: "btn btn-big", text: "Save my choices ▶" });
    cont.addEventListener("click", function () {
      if (!state.profile.lang || !state.profile.typing) {
        err.textContent = "Please choose one option from each question first.";
        return;
      }
      unlock("briefing");
      completeStage("support");
      go(isDone("briefing") ? "map" : "briefing");
    });
    wrap.appendChild(err);
    wrap.appendChild(el("div", { style: "text-align:center;" }, [cont]));
    main.appendChild(wrap);
  }

  /* ---------- Briefing ---------- */

  function renderBriefing() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("p", { class: "stage-eyebrow", text: "Mission briefing" }));
    wrap.appendChild(el("h1", { text: "The lab has lost its routines!" }));
    const card = el("div", { class: "card" });
    const guide = el("div", { class: "scenario-card" });
    guide.innerHTML = robotGuideSVG(70);
    const briefText = langSupport()
      ? "I am BYTE, your lab guide. The lab's operating system is broken. Doors are locked. Files are messy. The Scratch Laboratory is offline. Complete the missions to fix the lab!"
      : "Greetings — I am BYTE, the lab's guide robot. The Computing Lab's operating system has lost its routines: doors are locked, files are disorganised and the Scratch Laboratory is offline. Only a true Year 6 computer scientist can restore it.";
    const inner = el("div");
    const row = el("div", { class: "instruction-row" });
    const sb = speakBtn(briefText);
    if (sb) { row.appendChild(sb); }
    row.appendChild(el("p", { class: "scenario-text", text: briefText }));
    inner.appendChild(row);
    guide.appendChild(inner);
    card.appendChild(guide);
    card.appendChild(el("h2", { text: "Your mission" }));
    card.appendChild(el("p", { html:
      "Restore the lab by: recognising responsible choices → rebuilding the <strong>Start</strong>, <strong>Work</strong> and <strong>Finish</strong> routines → organising a project file → investigating a Scratch program → improving and testing it → collecting evidence → completing the Exit Terminal." }));
    card.appendChild(el("p", { html:
      "Collect <strong>Data Chips</strong> ⬡ by completing learning tasks — chips are for learning, not speed. Earn all seven badges to prove you are <strong>Year 6 Lab Ready</strong>." }));
    const badgeRow = el("div", { class: "badge-row" });
    Object.keys(BADGES).forEach(function (k) {
      badgeRow.appendChild(el("span", { class: "badge badge-locked" }, [
        el("span", { class: "badge-emoji", "aria-hidden": "true", text: BADGES[k].emoji }),
        el("span", { text: BADGES[k].name })
      ]));
    });
    card.appendChild(badgeRow);
    wrap.appendChild(card);
    const cont = el("button", { type: "button", class: "btn btn-big", text: "Open the Mission Map ▶" });
    cont.addEventListener("click", function () {
      unlock("starter");
      completeStage("briefing");
      go("map");
    });
    wrap.appendChild(el("div", { style: "text-align:center;" }, [cont]));
    main.appendChild(wrap);
  }

  /* ---------- Mission map ---------- */

  function renderMap() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    if (teacherMode) { wrap.appendChild(teacherBar()); }
    wrap.appendChild(el("p", { class: "stage-eyebrow", text: "Mission map" }));
    wrap.appendChild(el("h1", { text: "Choose your next mission" }));
    wrap.appendChild(instructionRow("Missions unlock in order. Finish the required missions to reach the Exit Terminal. The Extension Vault is optional."));
    const grid = el("div", { class: "mission-map" });
    STAGES.forEach(function (st) {
      if (st.id === "landing" || st.id === "support" || st.id === "briefing") { return; }
      const unlocked = isUnlocked(st.id);
      const done = isDone(st.id);
      const node = el("button", { type: "button", class: "map-node" + (done ? " is-done" : "") + (st.optional ? " is-optional" : "") });
      if (!done && unlocked && !(st.id === "report" && !isDone("plenary"))) { node.classList.add("is-current"); }
      node.appendChild(el("span", { class: "node-icon", "aria-hidden": "true", text: st.icon }));
      node.appendChild(el("span", { class: "node-name", text: st.name }));
      const status = done ? "Completed ✓" : unlocked ? (st.time ? st.time : "Ready") : "Locked";
      node.appendChild(el("span", { class: "node-status", text: status }));
      if (!unlocked) {
        node.disabled = true;
        node.appendChild(el("span", { class: "map-lock", "aria-hidden": "true", text: "🔒" }));
      } else {
        node.addEventListener("click", function () { go(st.id); });
      }
      grid.appendChild(node);
    });
    wrap.appendChild(grid);

    const bCard = el("div", { class: "card" });
    bCard.appendChild(el("h2", { text: "Your badges" }));
    const badgeRow = el("div", { class: "badge-row" });
    Object.keys(BADGES).forEach(function (k) {
      const has = state.badges.indexOf(k) !== -1;
      badgeRow.appendChild(el("span", { class: "badge" + (has ? "" : " badge-locked") }, [
        el("span", { class: "badge-emoji", "aria-hidden": "true", text: BADGES[k].emoji }),
        el("span", { text: BADGES[k].name })
      ]));
    });
    bCard.appendChild(badgeRow);
    wrap.appendChild(bCard);
    main.appendChild(wrap);
  }

  /* ---------- Game shell (shared by starter + routines) ---------- */

  function buildGameShell(container, stations, objective, callbacks) {
    const shell = el("div", { class: "game-shell" });
    const hintBar = el("div", { class: "game-hint-bar" }, [
      el("span", { class: "game-objective", text: objective }),
      el("span", { text: "Move: ← → or A D · Jump: ↑ / W / Space · Use terminal: E or Enter" })
    ]);
    shell.appendChild(hintBar);

    let usingGuided = state.settings.guidedMode;
    let gameFailed = false;

    const canvasWrap = el("div", { class: "game-canvas-wrap" });
    const canvas = el("canvas", { id: "gameCanvas", "aria-label": "Platform game. " + objective + " You can switch to Guided Movement Mode below.", role: "img" });
    canvasWrap.appendChild(canvas);
    shell.appendChild(canvasWrap);

    // touch controls
    const touch = el("div", { class: "touch-controls" });
    function tBtn(label, aria, name) {
      const b = el("button", { type: "button", class: "touch-btn", "aria-label": aria, text: label });
      ["pointerdown", "touchstart"].forEach(function (evt) {
        b.addEventListener(evt, function (e) { e.preventDefault(); if (game) { game.setInput(name, true); } });
      });
      ["pointerup", "pointerleave", "pointercancel", "touchend"].forEach(function (evt) {
        b.addEventListener(evt, function (e) { e.preventDefault(); if (game && name !== "interact") { game.setInput(name, false); } });
      });
      return b;
    }
    const leftGrp = el("div", { class: "touch-group" }, [tBtn("◀", "Move left", "left"), tBtn("▶", "Move right", "right")]);
    const rightGrp = el("div", { class: "touch-group" }, [tBtn("⚡", "Use terminal", "interact"), tBtn("▲", "Jump", "jump")]);
    touch.appendChild(leftGrp);
    touch.appendChild(rightGrp);
    shell.appendChild(touch);

    const guidedPanel = el("div", { class: "guided-panel" });
    shell.appendChild(guidedPanel);

    container.appendChild(shell);

    const toggleWrap = el("div", { style: "margin: 0.6rem 0 1rem;" });
    const toggle = el("button", { type: "button", class: "btn btn-secondary" });
    toggleWrap.appendChild(toggle);
    container.appendChild(toggleWrap);

    function renderGuidedButtons() {
      guidedPanel.innerHTML = "";
      guidedPanel.appendChild(el("p", { html: "<strong>Guided Movement Mode:</strong> click the next place you want to visit." }));
      let nextIndex = stations.findIndex(function (s) { return !callbacks.isStationDone(s.id); });
      stations.forEach(function (s, i) {
        const done = callbacks.isStationDone(s.id);
        const b = el("button", { type: "button", class: "guided-dest" + (done ? " gd-done" : "") }, [
          el("span", { class: "gd-icon", "aria-hidden": "true", text: done ? "✅" : (i === nextIndex ? "🚪" : "🔒") }),
          el("span", { text: s.label + (done ? " — completed" : "") })
        ]);
        b.disabled = done || i !== nextIndex;
        if (!done && i === nextIndex) {
          b.addEventListener("click", function () { callbacks.onTerminal(s.id); });
        }
        guidedPanel.appendChild(b);
      });
      if (nextIndex === -1) {
        const fin = el("button", { type: "button", class: "guided-dest" }, [
          el("span", { class: "gd-icon", "aria-hidden": "true", text: "🏁" }),
          el("span", { text: "Go to the exit door" })
        ]);
        fin.addEventListener("click", function () { callbacks.onLevelComplete(); });
        guidedPanel.appendChild(fin);
      }
    }

    function applyMode() {
      if (usingGuided || gameFailed) {
        if (game) { game.destroy(); game = null; }
        canvasWrap.hidden = true; touch.hidden = true; hintBar.hidden = true;
        guidedPanel.hidden = false;
        renderGuidedButtons();
        toggle.textContent = gameFailed ? "Platform game unavailable on this device" : "🎮 Switch to platform-game controls";
        toggle.disabled = gameFailed;
      } else {
        guidedPanel.hidden = true;
        canvasWrap.hidden = false; touch.hidden = false; hintBar.hidden = false;
        toggle.textContent = "🧭 Switch to Guided Movement Mode (click to move)";
        try {
          if (game) { game.destroy(); }
          game = new window.LabGame(canvas, {
            stations: stations.map(function (s) { return { id: s.id, label: s.shortLabel || s.label, icon: s.icon }; }),
            reducedMotion: state.settings.reducedMotion,
            avatarHue: currentAvatarHue(),
            onTerminal: callbacks.onTerminal,
            onChip: function () { addChips(1); },
            onLevelComplete: callbacks.onLevelComplete
          });
          stations.forEach(function (s) { if (callbacks.isStationDone(s.id)) { game.markTerminalDone(s.id); } });
        } catch (e) {
          gameFailed = true;
          usingGuided = true;
          applyMode();
        }
      }
    }

    toggle.addEventListener("click", function () {
      usingGuided = !usingGuided;
      state.settings.guidedMode = usingGuided;
      S.save();
      applyMode();
    });

    applyMode();

    return {
      refresh: function () {
        if (game) {
          stations.forEach(function (s) { if (callbacks.isStationDone(s.id)) { game.markTerminalDone(s.id); } });
          game.resume();
        }
        if (usingGuided || gameFailed) { renderGuidedButtons(); }
      }
    };
  }

  /* ---------- Starter: Safety Corridor ---------- */

  function renderStarter() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Starter mission" }),
      el("span", { class: "time-pill", text: "⏱ about 7 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "🚦 Safety Corridor" }));
    wrap.appendChild(instructionRow(langSupport()
      ? "Walk through the four rooms. At each terminal, answer the question to open the next door."
      : "Guide your avatar through the four rooms of the Safety Corridor. Each room holds a terminal with a scenario about lab behaviour. Answer thoughtfully to unlock the door to the next room."));

    const stations = STARTER.map(function (s) { return { id: s.id, label: s.label, shortLabel: s.label.split(": ")[1], icon: "🖥️" }; });

    function answered(id) {
      return !!state.answers["starter_" + id];
    }

    let shellApi = null;

    function handleTerminal(id) {
      const sc = STARTER.find(function (s) { return s.id === id; });
      function record(res) {
        state.answers["starter_" + id] = {
          label: sc.label,
          question: typingSupport() ? (sc.mcq ? sc.mcq.question : sc.selectAll.question) : sc.open.prompt,
          answer: res.chosen,
          correct: res.correct,
          attempts: res.attempts
        };
        addChips(2);
        S.save();
        if (game) { game.markTerminalDone(id); game.resume(); }
        if (shellApi) { shellApi.refresh(); }
        if (STARTER.every(function (s) { return answered(s.id); })) {
          finishStarter();
        }
      }
      if (typingSupport()) {
        if (sc.selectAll) {
          askSelectAll({ title: sc.label, scenario: sc.scenario, question: sc.selectAll.question, items: sc.selectAll.items, feedback: sc.selectAll.feedback, hint: sc.selectAll.hint }, record);
        } else {
          askMCQ({ title: sc.label, scenario: sc.scenario, question: sc.mcq.question, options: sc.mcq.options, correct: sc.mcq.correct, feedback: sc.mcq.feedback, hint: sc.mcq.hint }, record);
        }
      } else {
        askOpen({
          title: sc.label, scenario: sc.scenario, prompt: sc.open.prompt,
          starter: sc.open.starter, wordbank: sc.open.wordbank,
          keywords: sc.open.keywords, minGroups: sc.open.minGroups,
          hint: "Use ideas like: " + sc.open.wordbank.slice(0, 4).join(", ") + "…",
          model: sc.open.model
        }, record);
      }
    }

    function finishStarter() {
      if (!isDone("starter")) {
        awardBadge("safety");
        completeStage("starter");
      }
    }

    shellApi = buildGameShell(wrap, stations, "Visit all 4 terminals and answer each scenario.", {
      isStationDone: answered,
      onTerminal: handleTerminal,
      onLevelComplete: function () {
        finishStarter();
        toast("Safety Corridor restored!", "🚦");
        go("map");
      }
    });

    if (isDone("starter")) {
      const doneBar = el("div", { class: "card" }, [
        el("p", { html: "<strong>✔ Safety Corridor complete.</strong> You can replay for fun, or continue your mission." })
      ]);
      const nextB = el("button", { type: "button", class: "btn", text: "Continue to Lab Operating System ▶" });
      nextB.addEventListener("click", function () { go("routines"); });
      doneBar.appendChild(nextB);
      wrap.appendChild(doneBar);
    }
    main.appendChild(wrap);
  }

  /* ---------- Main 1: Routines (Lab Operating System) ---------- */

  const ROUTINE_CARDS = [
    { id: "s1", zone: "start", text: "Enter calmly and use the assigned workstation." },
    { id: "s2", zone: "start", text: "Check the workstation and report damage or missing equipment." },
    { id: "s3", zone: "start", text: "Wait for instructions before opening applications or websites." },
    { id: "w1", zone: "work", text: "Use only the required applications, files and browser tabs." },
    { id: "w2", zone: "work", text: "Keep passwords and personal information private." },
    { id: "w3", zone: "work", text: "Save work regularly using the agreed folders and filenames." },
    { id: "w4", zone: "work", text: "Work respectfully and take turns when collaborating." },
    { id: "w5", zone: "work", text: "Ask for help using the agreed classroom procedure." },
    { id: "f1", zone: "finish", text: "Save and check that the file can be found again." },
    { id: "f2", zone: "finish", text: "Close applications and browser tabs." },
    { id: "f3", zone: "finish", text: "Sign out of the school account." },
    { id: "f4", zone: "finish", text: "Leave the workstation and chair ready for the next class." }
  ];

  const ROUTINE_QUESTIONS = [
    {
      id: "rq1",
      q: "Why should damaged equipment be reported at the beginning?",
      mcq: {
        options: [
          "So problems can be fixed safely and nobody is blamed for damage they did not cause.",
          "So the student can move to a more comfortable seat.",
          "So the equipment can be hidden away before the lesson starts."
        ],
        correct: 0,
        feedback: "Reporting damage straight away keeps everyone safe, gets things repaired, and protects you from being blamed for damage that was already there.",
        hint: "Think about safety — and about who might be blamed later."
      },
      open: {
        starter: "Damaged equipment should be reported at the start because __________.",
        wordbank: ["safe", "unsafe", "fixed", "repaired", "blamed", "fault", "before the lesson"],
        keywords: [["safe", "unsafe", "danger", "hurt"], ["fix", "repair", "sorted", "replace"], ["blame", "fault", "already", "wasn't me", "was not me"]],
        minGroups: 1,
        model: "Damaged equipment should be reported at the beginning so it can be repaired safely, so nobody gets hurt, and so you are not blamed for damage that was already there."
      }
    },
    {
      id: "rq2",
      q: "Why is “I saved it somewhere” not enough?",
      mcq: {
        options: [
          "Because work must be saved in the agreed folder with a clear filename so it can be found again next lesson.",
          "Because saving work is not really important.",
          "Because you should always save every file twice."
        ],
        correct: 0,
        feedback: "If you don't know where a file is or what it is called, it is almost the same as losing it. Agreed folders and filenames mean you — and your teacher — can always find your work.",
        hint: "Imagine trying to find that file again next week. What would you need to know?"
      },
      open: {
        starter: "Saving “somewhere” is not enough because __________.",
        wordbank: ["find", "folder", "filename", "lost", "next lesson", "organised"],
        keywords: [["find", "lost", "lose", "where"], ["folder", "filename", "name", "organis", "agreed", "correct place"]],
        minGroups: 1,
        model: "Saving “somewhere” is not enough because you might never find the file again. Using the agreed folder and a clear filename means your work is safe and easy to find next lesson."
      }
    },
    {
      id: "rq3",
      q: "Why must students sign out at the end?",
      mcq: {
        options: [
          "To keep their account, work and personal information safe from other users.",
          "Because the computer needs to rest between lessons.",
          "So that the next class cannot use the computer at all."
        ],
        correct: 0,
        feedback: "If you stay signed in, the next person could see or change your files — or use your account. Signing out protects your work and your personal information.",
        hint: "Think about who uses the computer after you."
      },
      open: {
        starter: "Students must sign out because __________.",
        wordbank: ["account", "private", "safe", "other people", "personal information", "protect"],
        keywords: [["account", "log", "sign"], ["safe", "private", "protect", "personal", "secure"], ["other", "next", "someone", "somebody", "anyone"]],
        minGroups: 2,
        model: "Students must sign out so that nobody else can use their account, see their personal information, or change their work. It keeps everything safe for the next lesson."
      }
    }
  ];

  function renderRoutines() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Main mission 1" }),
      el("span", { class: "time-pill", text: "⏱ about 10 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "⚙️ Lab Operating System" }));
    wrap.appendChild(instructionRow(langSupport()
      ? "The routine cards are scattered! Put each card into the correct zone: Start, Work or Finish. Drag a card, or click a card and then click a zone."
      : "The lab's routines have been scattered into loose instruction cards. Rebuild the operating system by sorting every card into the correct zone: Start Zone, Work Zone or Finish Zone. You can drag cards, or click a card and then click its zone."));

    // --- sorting board ---
    const board = el("div", { class: "sort-layout" });
    const pool = el("div", { class: "sort-pool", "aria-label": "Unsorted routine cards" });
    pool.appendChild(el("h3", { text: "🗂 Scattered routine cards" }));
    const poolList = el("div");
    pool.appendChild(poolList);
    board.appendChild(pool);

    const zones = {};
    const fbArea = el("div", { "aria-live": "polite" });
    let selectedCard = null;

    [["start", "▶ Start Zone", "zone-start"], ["work", "⚙ Work Zone", "zone-work"], ["finish", "⏹ Finish Zone", "zone-finish"]].forEach(function (z) {
      const zEl = el("div", { class: "sort-zone " + z[2], "aria-label": z[1] + " drop area", role: "group" });
      zEl.appendChild(el("h3", { text: z[1] }));
      const list = el("div");
      zEl.appendChild(list);
      zones[z[0]] = { root: zEl, list: list };
      zEl.addEventListener("dragover", function (e) { e.preventDefault(); zEl.classList.add("zone-over"); });
      zEl.addEventListener("dragleave", function () { zEl.classList.remove("zone-over"); });
      zEl.addEventListener("drop", function (e) {
        e.preventDefault();
        zEl.classList.remove("zone-over");
        const id = e.dataTransfer.getData("text/plain");
        if (id) { placeCard(id, z[0]); }
      });
      zEl.addEventListener("click", function (e) {
        if (selectedCard && e.target.closest(".routine-card") === null) {
          placeCard(selectedCard, z[0]);
        }
      });
      board.appendChild(zEl);
    });

    function cardEl(card) {
      const b = el("button", { type: "button", class: "routine-card", draggable: "true", "data-id": card.id, "aria-pressed": "false" }, [
        el("span", { "aria-hidden": "true", text: "🪪" }),
        el("span", { text: card.text })
      ]);
      b.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", card.id); });
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (state.routineSort[card.id]) { return; }
        if (selectedCard === card.id) {
          selectedCard = null;
          b.setAttribute("aria-pressed", "false");
        } else {
          document.querySelectorAll(".routine-card[aria-pressed='true']").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          selectedCard = card.id;
          b.setAttribute("aria-pressed", "true");
          fbArea.innerHTML = "";
          fbArea.appendChild(el("div", { class: "feedback feedback-info", text: "Card selected. Now click the zone where it belongs." }));
        }
      });
      return b;
    }

    function renderBoard() {
      poolList.innerHTML = "";
      Object.keys(zones).forEach(function (z) { zones[z].list.innerHTML = ""; });
      ROUTINE_CARDS.forEach(function (card) {
        const placedZone = state.routineSort[card.id];
        const node = cardEl(card);
        if (placedZone) {
          node.classList.add("rc-correct");
          node.draggable = false;
          zones[placedZone].list.appendChild(node);
        } else {
          poolList.appendChild(node);
        }
      });
      const remaining = ROUTINE_CARDS.filter(function (c) { return !state.routineSort[c.id]; }).length;
      if (!remaining) {
        poolList.appendChild(el("p", { class: "sim-empty", text: "All cards sorted — the operating system is rebuilding!" }));
      }
    }

    function placeCard(id, zone) {
      const card = ROUTINE_CARDS.find(function (c) { return c.id === id; });
      if (!card || state.routineSort[id]) { return; }
      selectedCard = null;
      fbArea.innerHTML = "";
      if (card.zone === zone) {
        sfx.correct();
        state.routineSort[id] = zone;
        S.save();
        renderBoard();
        fbArea.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Correct — that routine belongs in the " + zone + " zone." }));
        const remaining = ROUTINE_CARDS.filter(function (c) { return !state.routineSort[c.id]; }).length;
        if (remaining === 0) { afterSorting(); }
      } else {
        sfx.wrong();
        renderBoard();
        const node = poolList.querySelector("[data-id='" + id + "']");
        if (node) { node.classList.add("rc-wrong"); }
        const hint = card.zone === "start" ? "Think: does this happen when you first arrive?" :
          card.zone === "work" ? "Think: is this something you do while working?" :
          "Think: does this happen when you are leaving?";
        fbArea.appendChild(el("div", { class: "feedback feedback-try", text: "Not that zone — try again. " + hint }));
      }
    }

    const qArea = el("div");

    function afterSorting() {
      toast("All routines sorted!", "⚙️");
      renderQuestions();
      qArea.scrollIntoView({ behavior: state.settings.reducedMotion ? "auto" : "smooth" });
    }

    function questionsAnswered() {
      return ROUTINE_QUESTIONS.every(function (q) { return !!state.answers["routine_" + q.id]; });
    }

    function renderQuestions() {
      qArea.innerHTML = "";
      const card = el("div", { class: "card" });
      card.appendChild(el("h2", { text: "Quick thinking — three questions" }));
      ROUTINE_QUESTIONS.forEach(function (q, i) {
        const doneAns = state.answers["routine_" + q.id];
        const row = el("div", { style: "margin-bottom:0.8rem;" });
        row.appendChild(el("p", { html: "<strong>" + (i + 1) + ". " + esc(q.q) + "</strong> " + (doneAns ? "✔" : "") }));
        if (!doneAns) {
          const b = el("button", { type: "button", class: "btn btn-secondary", text: "Answer this question" });
          b.addEventListener("click", function () {
            function record(res) {
              state.answers["routine_" + q.id] = { question: q.q, answer: res.chosen, correct: res.correct, attempts: res.attempts };
              addChips(1);
              S.save();
              renderQuestions();
              if (questionsAnswered()) { finishRoutines(); }
            }
            if (typingSupport()) {
              askMCQ({ title: "Lab Operating System", question: q.q, options: q.mcq.options, correct: q.mcq.correct, feedback: q.mcq.feedback, hint: q.mcq.hint }, record);
            } else {
              askOpen({ title: "Lab Operating System", prompt: q.q, starter: q.open.starter, wordbank: q.open.wordbank, keywords: q.open.keywords, minGroups: q.open.minGroups, hint: q.mcq.hint, model: q.open.model }, record);
            }
          });
          row.appendChild(b);
        } else {
          row.appendChild(el("p", { class: "sentence-starter", text: "Your answer: " + doneAns.answer }));
        }
        card.appendChild(row);
      });
      qArea.appendChild(card);
    }

    function finishRoutines() {
      if (!isDone("routines")) {
        awardBadge("routine");
        completeStage("routines");
      }
      const doneCard = el("div", { class: "card" });
      doneCard.appendChild(el("p", { html: "<strong>✔ The Lab Operating System is back online!</strong>" }));
      const nb = el("button", { type: "button", class: "btn", text: "Continue to the File Management Centre ▶" });
      nb.addEventListener("click", function () { go("files"); });
      doneCard.appendChild(nb);
      qArea.appendChild(doneCard);
    }

    wrap.appendChild(board);
    wrap.appendChild(fbArea);
    wrap.appendChild(qArea);
    main.appendChild(wrap);

    renderBoard();
    const sorted = ROUTINE_CARDS.every(function (c) { return !!state.routineSort[c.id]; });
    if (sorted) {
      renderQuestions();
      if (questionsAnswered()) { finishRoutines(); }
    }
  }

  /* ---------- Main 2A: File Management Simulator ---------- */

  const TARGET_FOLDER_1 = "Year 6 Computing";
  const TARGET_FOLDER_2 = "Term 1 - Digital Independence";
  const TARGET_FILENAME = "Y6_T1W01_ScratchBaseline_v1";

  function normName(s) {
    return String(s).trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ");
  }

  /* The third folder is the student's own name. Accept the full name or at
     least their first name (3+ letters) so nobody is blocked by spelling
     out middle names etc. */
  function matchesStudentName(input) {
    const full = normName(state.student.name || "");
    const typed = normName(input);
    if (!typed) { return false; }
    if (typed === full) { return true; }
    const first = full.split(" ")[0] || "";
    return first.length >= 3 && typed.indexOf(first) !== -1;
  }

  function folderSVG() {
    return '<svg viewBox="0 0 56 46" aria-hidden="true"><path d="M4 10 q0-4 4-4 h14 l5 6 h21 q4 0 4 4 v22 q0 4-4 4 H8 q-4 0-4-4 Z" fill="#f6c453" stroke="#d9a53a" stroke-width="2"/></svg>';
  }
  function fileSVG() {
    return '<svg viewBox="0 0 56 46" aria-hidden="true"><rect x="14" y="2" width="28" height="42" rx="4" fill="#eef3fa" stroke="#8fa8cf" stroke-width="2"/><path d="M20 12 h16 M20 19 h16 M20 26 h10" stroke="#5b7bb0" stroke-width="2"/><circle cx="36" cy="32" r="7" fill="#f5a623"/><circle cx="36" cy="32" r="3.4" fill="#fff"/></svg>';
  }

  function renderFiles() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Main mission 2A" }),
      el("span", { class: "time-pill", text: "⏱ about 7 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "📁 File Management Centre" }));
    wrap.appendChild(instructionRow(langSupport()
      ? "Pretend this is your school computer. Make the folder “Year 6 Computing”. Open it. Make the folder “Term 1 - Digital Independence”. Open it. Make a folder with YOUR name. Open it. Save your project as Y6_T1W01_ScratchBaseline_v1. Then find your saved file."
      : "You have completed a Scratch project. Organise and save it so that you can find it again next lesson — including a folder with your own name, so everyone's work stays separate. This is a practice desktop — it cannot touch the real files on this computer."));

    const goal = el("div", { class: "card" });
    goal.appendChild(el("h2", { text: "Your goal" }));
    goal.appendChild(el("pre", { style: "font-family: monospace; font-size: 1rem; background: #0d1836; padding: 0.8rem 1rem; border-radius: 10px; overflow:auto;", text:
      "Year 6 Computing\n└── Term 1 - Digital Independence\n        └── " + (state.student.name || "Your Name") + "\n                └── " + TARGET_FILENAME + ".sb3" }));
    wrap.appendChild(goal);

    // simulated FS state
    if (!state.fileSim.tree) {
      state.fileSim.tree = { name: "Documents", folders: [], files: [] };
    }
    let cwdPath = state.fileSim.cwdPath || [];

    function getNode(path) {
      let node = state.fileSim.tree;
      for (const p of path) {
        const next = node.folders.find(function (f) { return f.name === p; });
        if (!next) { return state.fileSim.tree; }
        node = next;
      }
      return node;
    }

    const desktop = el("div", { class: "sim-desktop" });
    const win = el("div", { class: "sim-window" });
    desktop.appendChild(win);
    wrap.appendChild(desktop);

    const statusMsg = el("div", { class: "sim-statusbar", "aria-live": "polite" });
    const hintArea = el("div", { "aria-live": "polite" });
    let hintLevel = 0;

    const HINTS = [
      "Hint 1: Use the “New Folder” button to create “Year 6 Computing” first.",
      "Hint 2: Click a folder to open it. Check the folder path bar to see where you are.",
      "Hint 3: Inside “Term 1 - Digital Independence”, create a folder with YOUR name (" + (state.student.name || "your name") + ") and open it.",
      "Hint 4: Inside your name folder, press “Save Project Here” and type the agreed filename exactly: " + TARGET_FILENAME,
      "Hint 5: The filename pattern is Year_TermWeek_Project_version → Y6_T1W01_ScratchBaseline_v1"
    ];

    function renderWindow() {
      state.fileSim.cwdPath = cwdPath;
      S.save();
      win.innerHTML = "";
      const title = el("div", { class: "sim-titlebar" }, [
        el("span", { class: "sim-dots" }, [el("span"), el("span"), el("span")]),
        el("span", { text: "School Files — practice explorer" })
      ]);
      win.appendChild(title);

      const toolbar = el("div", { class: "sim-toolbar" });
      const bNew = el("button", { type: "button", class: "btn btn-secondary", text: "＋ New Folder" });
      const bRename = el("button", { type: "button", class: "btn btn-secondary", text: "✏️ Rename" });
      const bSave = el("button", { type: "button", class: "btn", text: "💾 Save Project Here" });
      const bReset = el("button", { type: "button", class: "btn btn-ghost", text: "↺ Reset this task" });
      const bHint = el("button", { type: "button", class: "btn btn-ghost", text: "💡 Hint" });
      toolbar.appendChild(bNew); toolbar.appendChild(bRename); toolbar.appendChild(bSave); toolbar.appendChild(bHint); toolbar.appendChild(bReset);
      win.appendChild(toolbar);

      const crumb = el("div", { class: "sim-breadcrumb", "aria-label": "Folder path" });
      crumb.appendChild(el("span", { text: "📍" }));
      const rootBtn = el("button", { type: "button", text: "Documents" });
      rootBtn.addEventListener("click", function () { cwdPath = []; renderWindow(); });
      crumb.appendChild(rootBtn);
      cwdPath.forEach(function (p, i) {
        crumb.appendChild(el("span", { text: "›" }));
        const b = el("button", { type: "button", text: p });
        b.addEventListener("click", function () { cwdPath = cwdPath.slice(0, i + 1); renderWindow(); });
        crumb.appendChild(b);
      });
      win.appendChild(crumb);

      const node = getNode(cwdPath);
      const filesArea = el("div", { class: "sim-files" });
      let selected = null;
      if (!node.folders.length && !node.files.length) {
        filesArea.appendChild(el("p", { class: "sim-empty", text: "This folder is empty. Use “New Folder” to start organising." }));
      }
      node.folders.forEach(function (f) {
        const item = el("button", { type: "button", class: "sim-item" });
        item.innerHTML = folderSVG() + '<span class="sim-label">' + esc(f.name) + "</span>";
        item.addEventListener("click", function () {
          if (selected === f) { cwdPath = cwdPath.concat([f.name]); renderWindow(); }
          else {
            selected = f;
            filesArea.querySelectorAll(".sim-item").forEach(function (x) { x.style.background = ""; });
            item.style.background = "#dbe7fb";
            statusMsg.textContent = "Selected “" + f.name + "”. Click again to open, or press Rename.";
          }
        });
        item.addEventListener("dblclick", function () { cwdPath = cwdPath.concat([f.name]); renderWindow(); });
        filesArea.appendChild(item);
      });
      node.files.forEach(function (f) {
        const item = el("button", { type: "button", class: "sim-item" });
        item.innerHTML = fileSVG() + '<span class="sim-label">' + esc(f.name) + ".sb3</span>";
        item.addEventListener("click", function () {
          if (state.fileSim.saved && !state.fileSim.done) { confirmFound(); }
          else { statusMsg.textContent = "This is your saved project file."; }
        });
        filesArea.appendChild(item);
      });
      win.appendChild(filesArea);
      win.appendChild(statusMsg);

      bNew.addEventListener("click", function () {
        namePrompt("New folder", "Type a name for the new folder:", "", function (name, errEl) {
          const clean = name.trim();
          if (!clean) { errEl.textContent = "Please type a folder name."; return false; }
          if (node.folders.some(function (f) { return normName(f.name) === normName(clean); })) {
            errEl.textContent = "A folder with that name already exists here."; return false;
          }
          node.folders.push({ name: clean, folders: [], files: [] });
          S.save();
          checkFolderProgress(clean);
          renderWindow();
          return true;
        });
      });

      bRename.addEventListener("click", function () {
        if (!selected) { statusMsg.textContent = "First click a folder once to select it, then press Rename."; return; }
        namePrompt("Rename folder", "Type the new name:", selected.name, function (name, errEl) {
          const clean = name.trim();
          if (!clean) { errEl.textContent = "Please type a folder name."; return false; }
          selected.name = clean;
          S.save();
          checkFolderProgress(clean);
          renderWindow();
          return true;
        });
      });

      bSave.addEventListener("click", function () {
        const inTarget = cwdPath.length === 3 &&
          normName(cwdPath[0]) === normName(TARGET_FOLDER_1) &&
          normName(cwdPath[1]) === normName(TARGET_FOLDER_2) &&
          matchesStudentName(cwdPath[2]);
        if (!inTarget) {
          hintArea.innerHTML = "";
          hintArea.appendChild(el("div", { class: "feedback feedback-try", text: "You are not in the right folder yet. Check the folder path: it should read Documents › Year 6 Computing › Term 1 - Digital Independence › " + (state.student.name || "your name") + "." }));
          return;
        }
        namePrompt("Save project", "Type the agreed filename for your Scratch project:", "", function (name, errEl) {
          const clean = name.trim();
          if (!clean) { errEl.textContent = "Please type the filename."; return false; }
          if (normName(clean).replace(/ /g, "") !== normName(TARGET_FILENAME).replace(/ /g, "")) {
            errEl.textContent = "Not quite. Remember the agreed pattern: Year_TermWeek_Project_version. Try: " + TARGET_FILENAME;
            return false;
          }
          node.files.push({ name: TARGET_FILENAME });
          state.fileSim.saved = true;
          S.save();
          renderWindow();
          hintArea.innerHTML = "";
          hintArea.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Project saved with the agreed filename! Final step: click your saved file to prove you can find it again." }));
          return true;
        });
      });

      bReset.addEventListener("click", function () {
        confirmDialog("Reset this task? Your folders in the practice explorer and your folder screenshot will be cleared. Your other mission progress is safe.", function () {
          state.fileSim = { step: 0, done: false, tree: { name: "Documents", folders: [], files: [] }, saved: false };
          cwdPath = [];
          S.save();
          S.deleteScreenshot("folder");
          renderWindow();
          renderRealTask();
          hintArea.innerHTML = "";
        });
      });

      bHint.addEventListener("click", function () {
        hintArea.innerHTML = "";
        hintArea.appendChild(el("div", { class: "hint-box", text: HINTS[Math.min(hintLevel, HINTS.length - 1)] }));
        hintLevel++;
      });
    }

    function checkFolderProgress(name) {
      if (normName(name) === normName(TARGET_FOLDER_1)) {
        hintArea.innerHTML = "";
        hintArea.appendChild(el("div", { class: "feedback feedback-good", text: "✔ “Year 6 Computing” created. Now open it and create the term folder inside." }));
      } else if (normName(name) === normName(TARGET_FOLDER_2)) {
        hintArea.innerHTML = "";
        hintArea.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Term folder created. Open it, then create a folder with YOUR name inside it." }));
      } else if (matchesStudentName(name)) {
        hintArea.innerHTML = "";
        hintArea.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Your name folder is ready. Open it, then press “Save Project Here”." }));
      }
    }

    function confirmFound() {
      openModal(function (m) {
        m.appendChild(el("h2", { text: "You found your project!" }));
        m.appendChild(el("div", { class: "success-burst" }, [el("span", { class: "burst-emoji", text: "🎉" })]));
        m.appendChild(el("p", { text: "Your project is saved in the correct folders — including your own name folder — with the agreed filename, and you just proved you can find it again. That is exactly what good digital organisation looks like." }));
        m.appendChild(el("p", { html: "<strong>One more step:</strong> now do it for real on the school computer you are using, and upload a screenshot as evidence." }));
        const b = el("button", { type: "button", class: "btn", text: "Continue to the real-computer task ▶" });
        b.addEventListener("click", function () {
          state.fileSim.done = true;
          S.save();
          closeModal();
          go("files");
        });
        m.appendChild(el("div", { class: "modal-actions" }, [b]));
      });
    }

    function namePrompt(title, label, initial, onSubmit) {
      openModal(function (m) {
        m.appendChild(el("h2", { text: title }));
        m.appendChild(el("p", { text: label }));
        const dlg = el("div", { class: "sim-dialog" });
        const inp = el("input", { type: "text", value: initial, maxlength: "80", "aria-label": label });
        dlg.appendChild(inp);
        const err = el("div", { class: "sim-msg-error", "aria-live": "polite" });
        dlg.appendChild(err);
        m.appendChild(dlg);
        const okB = el("button", { type: "button", class: "btn", text: "OK" });
        const cancelB = el("button", { type: "button", class: "btn btn-secondary", text: "Cancel" });
        m.appendChild(el("div", { class: "modal-actions" }, [okB, cancelB]));
        function submit() { if (onSubmit(inp.value, err)) { closeModal(); } }
        okB.addEventListener("click", submit);
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { submit(); } });
        cancelB.addEventListener("click", closeModal);
        inp.focus();
      }, { dismissable: true });
    }

    wrap.appendChild(hintArea);

    /* ---- Phase 2: create the folders for real + evidence ---- */

    const realArea = el("div");
    wrap.appendChild(realArea);

    function finishFilesStage() {
      if (!isDone("files")) {
        awardBadge("file");
        addChips(2);
        completeStage("files");
      }
      toast("File Management Centre complete!", "📁");
      go("map");
    }

    function renderRealTask() {
      realArea.innerHTML = "";
      if (!state.fileSim.done) { return; }

      /* Students who finished this stage before the real-folder task existed
         still get to complete it — the stage stays complete either way. */
      const realTaskOutstanding = !state.fileSim.realDone && !state.fileSim.realSkipped;

      if (isDone("files") && !realTaskOutstanding) {
        const doneCard = el("div", { class: "card" });
        doneCard.appendChild(el("p", { html: "<strong>✔ File Management Centre complete.</strong>" }));
        const nb = el("button", { type: "button", class: "btn", text: "Continue to the Scratch Laboratory ▶" });
        nb.addEventListener("click", function () { go("investigate"); });
        doneCard.appendChild(nb);
        realArea.appendChild(doneCard);
        return;
      }

      const card = el("div", { class: "card" });
      card.appendChild(el("h2", { text: "🖥️ Now for real: build your folders on this school computer" }));
      card.appendChild(instructionRow(langSupport()
        ? "Do the same thing for real on the computer you are using. Then take a screenshot of your folders and upload it here."
        : "The practice run is complete — now create the same folder structure for real on the school computer you are using, so your Scratch work has a proper home this year."));
      const ol = el("ol");
      ["Open your Documents folder (or the location your teacher tells you).",
       "Create a folder called “" + TARGET_FOLDER_1 + "”.",
       "Inside it, create “" + TARGET_FOLDER_2 + "”.",
       "Inside that, create a folder with your name: “" + (state.student.name || "Your Name") + "”.",
       "Take a screenshot showing your folders (the open folder path is perfect evidence).",
       "Come back and upload the screenshot below."].forEach(function (s) { ol.appendChild(el("li", { text: s })); });
      card.appendChild(ol);
      card.appendChild(el("div", { class: "hint-box", html:
        "<strong>Screenshot shortcuts:</strong> Windows: <strong>Win + Shift + S</strong> · Chromebook: <strong>Ctrl + Show Windows</strong> · Mac: <strong>Cmd + Shift + 4</strong>. Only capture your folders — no personal information or other students' names." }));

      const drop = el("div", { class: "drop-area", tabindex: "0", role: "button", "aria-label": "Upload folder screenshot: click, drop an image here, or paste" });
      drop.appendChild(el("p", { html: "🖼️ <strong>Drag and drop</strong> your folder screenshot here,<br>paste it (Ctrl + V / Cmd + V), or" }));
      const fInput = el("input", { type: "file", accept: "image/png,image/jpeg,image/webp", class: "visually-hidden", "aria-hidden": "true", tabindex: "-1" });
      const pickB = el("button", { type: "button", class: "btn", text: "📤 Upload Screenshot" });
      pickB.addEventListener("click", function () { fInput.click(); });
      drop.appendChild(pickB);
      drop.appendChild(fInput);
      card.appendChild(drop);
      const upErr = el("div", { class: "field-error", "aria-live": "polite" });
      card.appendChild(upErr);
      const pv = el("div");
      card.appendChild(pv);

      function acceptRealFile(file) {
        upErr.textContent = "";
        if (!file) { return; }
        if (["image/png", "image/jpeg", "image/webp"].indexOf(file.type) === -1) {
          upErr.textContent = "That file type is not supported. Please use PNG, JPG, JPEG or WEBP.";
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          upErr.textContent = "That image is larger than 10 MB. Try capturing a smaller area of the screen.";
          return;
        }
        S.putScreenshot("folder", file).then(function () {
          state.fileSim.realDone = true;
          S.save();
          toast("Folder evidence saved on this computer.", "📁");
          renderRealTask();
        }).catch(function () {
          upErr.textContent = "This browser could not store the image. Show your folders to your teacher instead, then use the button below.";
        });
      }
      fInput.addEventListener("change", function () { acceptRealFile(fInput.files[0]); });
      ["dragover", "dragenter"].forEach(function (evt) {
        drop.addEventListener(evt, function (e) { e.preventDefault(); drop.classList.add("drag-over"); });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        drop.addEventListener(evt, function (e) { e.preventDefault(); drop.classList.remove("drag-over"); });
      });
      drop.addEventListener("drop", function (e) {
        if (e.dataTransfer.files && e.dataTransfer.files.length) { acceptRealFile(e.dataTransfer.files[0]); }
      });
      document.addEventListener("paste", function (e) {
        if (currentScreen !== "files" || isDone("files")) { return; }
        const items = (e.clipboardData || {}).items || [];
        for (const it of items) {
          if (it.type && it.type.indexOf("image/") === 0) {
            acceptRealFile(it.getAsFile());
            e.preventDefault();
            return;
          }
        }
      });

      function renderRealPreview() {
        pv.innerHTML = "";
        if (!state.fileSim.realDone) { return; }
        S.getScreenshot("folder").then(function (blob) {
          if (!blob) { return; }
          const url = URL.createObjectURL(blob);
          pv.appendChild(el("img", { class: "evidence-preview", alt: "Your real folder screenshot", src: url }));
          const tools = el("div", { class: "evidence-tools" });
          const rep = el("button", { type: "button", class: "btn btn-secondary", text: "🔁 Replace" });
          rep.addEventListener("click", function () { fInput.click(); });
          const delB = el("button", { type: "button", class: "btn btn-danger", text: "🗑 Delete" });
          delB.addEventListener("click", function () {
            confirmDialog("Delete this folder screenshot? You can upload a new one afterwards.", function () {
              S.deleteScreenshot("folder").then(function () {
                state.fileSim.realDone = false;
                S.save();
                renderRealTask();
              });
            });
          });
          tools.appendChild(rep); tools.appendChild(delB);
          pv.appendChild(tools);
        });
      }
      renderRealPreview();

      const finErr = el("div", { class: "field-error", "aria-live": "polite" });
      const finB = el("button", { type: "button", class: "btn", text: isDone("files") ? "Save my folder evidence ▶" : "Collect the File Finder badge ▶" });
      finB.addEventListener("click", function () {
        if (!state.fileSim.realDone && !state.fileSim.realSkipped) {
          finErr.textContent = "Upload your folder screenshot first — or ask your teacher if you cannot take one on this device.";
          return;
        }
        finishFilesStage();
      });
      const skipB = el("button", { type: "button", class: "btn btn-ghost", text: "My teacher says I can continue without a screenshot" });
      skipB.addEventListener("click", function () {
        state.fileSim.realSkipped = true;
        S.save();
        finErr.textContent = "";
        toast("Noted — your teacher will check your folders directly.", "🧑‍🏫");
        finishFilesStage();
      });
      card.appendChild(finErr);
      card.appendChild(el("div", { class: "modal-actions" }, [finB, skipB]));
      realArea.appendChild(card);
    }

    main.appendChild(wrap);
    renderWindow();
    renderRealTask();
  }

  function confirmDialog(msg, onYes) {
    openModal(function (m) {
      m.appendChild(el("h2", { text: "Are you sure?" }));
      m.appendChild(el("p", { text: msg }));
      const yes = el("button", { type: "button", class: "btn btn-danger", text: "Yes, do it" });
      const no = el("button", { type: "button", class: "btn btn-secondary", text: "Cancel" });
      yes.addEventListener("click", function () { closeModal(); onYes(); });
      no.addEventListener("click", closeModal);
      m.appendChild(el("div", { class: "modal-actions" }, [yes, no]));
    }, { dismissable: true });
  }

  /* ---------- Main 2B: Scratch Investigation ---------- */

  const INVESTIGATE_QS = [
    {
      id: "inv1", q: "What starts the program?",
      options: ["Clicking the green flag", "Turning the volume up", "Closing the browser tab"],
      correct: 0, frame: "The program starts when __________.",
      wordbank: ["green flag", "clicked", "key press", "event"]
    },
    {
      id: "inv2", q: "What do you predict the sprite will do?",
      options: null, frame: "I predict the sprite will __________.",
      wordbank: ["move", "speak", "make a sound", "change", "repeat", "when I press"]
    },
    {
      id: "inv3", q: "What is the input?",
      options: ["A key press, mouse click or the green flag", "The sprite's costume", "The stage background"],
      correct: 0, frame: "The input is __________.",
      wordbank: ["key press", "mouse click", "green flag", "keyboard", "input"]
    },
    {
      id: "inv4", q: "What output should the user see or hear?",
      options: ["Movement, a message or a sound", "A new computer", "Nothing at all"],
      correct: 0, frame: "The output is __________.",
      wordbank: ["movement", "message", "sound", "speech bubble", "output", "see", "hear"]
    }
  ];

  function renderInvestigate() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Main mission 2B" }),
      el("span", { class: "time-pill", text: "⏱ about 6 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "🔬 Scratch Laboratory" }));
    wrap.appendChild(instructionRow(langSupport()
      ? "First: predict. Answer the four questions below. Then open the Scratch project in a new tab and run it. Come back and say if your prediction was right."
      : "A good computer scientist predicts before testing. Answer the four prediction questions below, then open the Scratch project in a new tab, run it, and return here to compare the program's real behaviour with your prediction."));

    const btnRow = el("div", { class: "card", style: "display:flex; gap:0.8rem; flex-wrap:wrap; align-items:center;" });
    const openB = el("a", { class: "btn", href: scratchUrl(), target: "_blank", rel: "noopener noreferrer", text: "🚀 Open Scratch Project (new tab)" });
    btnRow.appendChild(openB);
    btnRow.appendChild(el("span", { text: "The Scratch project opens in a new tab — this mission stays open here." }));
    const backB = el("button", { type: "button", class: "btn btn-secondary", text: "↩ Return to Mission" });
    backB.addEventListener("click", function () { go("map"); });
    btnRow.appendChild(backB);
    wrap.appendChild(btnRow);
    wrap.appendChild(el("div", { class: "hint-box", html: "<strong>If Scratch will not load</strong> (no internet or the site is blocked): tell your teacher. You can still answer the prediction questions using the class demonstration, and continue the mission." }));

    const card = el("div", { class: "card" });
    card.appendChild(el("h2", { text: "Before you run it — predict!" }));
    const inputs = {};
    INVESTIGATE_QS.forEach(function (q, i) {
      const block = el("div", { class: "form-field" });
      const row = el("div", { class: "instruction-row" });
      const sb = speakBtn(q.q);
      if (sb) { row.appendChild(sb); }
      row.appendChild(el("p", { html: "<strong>" + (i + 1) + ". " + esc(q.q) + "</strong>" }));
      block.appendChild(row);
      const saved = state.answers["investigate_" + q.id];
      if (typingSupport() && q.options) {
        const sel = el("select", { "aria-label": q.q });
        sel.appendChild(el("option", { value: "", text: "— choose —" }));
        q.options.forEach(function (o) {
          const opt = el("option", { value: o, text: o });
          if (saved && saved.answer === o) { opt.selected = true; }
          sel.appendChild(opt);
        });
        block.appendChild(sel);
        inputs[q.id] = { get: function () { return sel.value; }, type: "choice", q: q };
      } else {
        if (langSupport()) {
          block.appendChild(el("p", { class: "sentence-starter", text: "Frame: " + q.frame }));
          const wb = el("div", { class: "word-bank" });
          q.wordbank.forEach(function (w) {
            const wbtn = el("button", { type: "button", class: "wb-word", text: w });
            wb.appendChild(wbtn);
          });
          block.appendChild(wb);
          setTimeout(function () {
            wb.querySelectorAll(".wb-word").forEach(function (wbtn) {
              wbtn.addEventListener("click", function () {
                ta.value = (ta.value ? ta.value.replace(/\s+$/, "") + " " : "") + wbtn.textContent;
                ta.focus();
              });
            });
          }, 0);
        }
        const ta = el("textarea", { class: "plain-input", rows: "2", "aria-label": q.q });
        if (saved) { ta.value = saved.answer; }
        block.appendChild(ta);
        inputs[q.id] = { get: function () { return ta.value.trim(); }, type: "text", q: q };
      }
      card.appendChild(block);
    });
    const err1 = el("div", { class: "field-error", "aria-live": "polite" });
    const savePred = el("button", { type: "button", class: "btn", text: "Save my predictions" });
    savePred.addEventListener("click", function () {
      let ok = true;
      INVESTIGATE_QS.forEach(function (q) {
        const v = inputs[q.id].get();
        if (!v || v.length < 2) { ok = false; }
      });
      if (!ok) { err1.textContent = "Please answer all four prediction questions first."; return; }
      err1.textContent = "";
      INVESTIGATE_QS.forEach(function (q) {
        state.answers["investigate_" + q.id] = { question: q.q, answer: inputs[q.id].get() };
      });
      state.answers.investigate_predictionsSaved = { question: "Predictions saved", answer: "yes" };
      addChips(2);
      S.save();
      toast("Predictions locked in — now run the program!", "🔬");
      renderAfterRun();
    });
    card.appendChild(err1);
    card.appendChild(el("div", { class: "modal-actions" }, [savePred]));
    wrap.appendChild(card);

    const afterArea = el("div");
    wrap.appendChild(afterArea);

    function renderAfterRun() {
      afterArea.innerHTML = "";
      const c2 = el("div", { class: "card" });
      c2.appendChild(el("h2", { text: "After you run the program" }));
      c2.appendChild(instructionRow("Did the program behave as you predicted?"));
      const opts = [
        { v: "match", t: "✅ Yes, it matched my prediction." },
        { v: "partly", t: "🟡 Partly, but something was different." },
        { v: "no", t: "🔄 No, I need to revise my prediction." }
      ];
      const saved = state.answers.investigate_outcome;
      let chosen = saved ? saved.value : null;
      const grp = el("div", { class: "support-options" });
      opts.forEach(function (o) {
        const b = el("button", { type: "button", class: "support-option", "aria-pressed": String(chosen === o.v) }, [el("span", { text: o.t })]);
        b.addEventListener("click", function () {
          chosen = o.v;
          grp.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
        });
        grp.appendChild(b);
      });
      c2.appendChild(grp);

      let refGet;
      if (typingSupport()) {
        c2.appendChild(el("p", { html: "<strong>What surprised you, or what did you notice?</strong> (choose one)" }));
        const sel = el("select", { "aria-label": "What did you notice?" });
        ["The sprite moved as expected", "The output was different from my prediction", "The input worked differently than I thought", "I noticed the order of the blocks matters"].forEach(function (o) {
          sel.appendChild(el("option", { value: o, text: o }));
        });
        c2.appendChild(sel);
        refGet = function () { return sel.value; };
      } else {
        c2.appendChild(el("p", { html: "<strong>Short reflection:</strong> what did you notice when the program ran?" }));
        const ta = el("textarea", { class: "plain-input", rows: "2", "aria-label": "Reflection" });
        c2.appendChild(ta);
        refGet = function () { return ta.value.trim(); };
      }
      const err2 = el("div", { class: "field-error", "aria-live": "polite" });
      const fin = el("button", { type: "button", class: "btn", text: "Finish the investigation ▶" });
      fin.addEventListener("click", function () {
        if (!chosen) { err2.textContent = "Please choose whether the program matched your prediction."; return; }
        const ref = refGet();
        if (!ref || ref.length < 2) { err2.textContent = "Please add your reflection."; return; }
        state.answers.investigate_outcome = { question: "Did the program behave as predicted?", value: chosen, answer: opts.find(function (o) { return o.v === chosen; }).t, reflection: ref };
        S.save();
        if (!isDone("investigate")) {
          addChips(2);
          completeStage("investigate");
        }
        toast("Investigation complete!", "🔬");
        go("modify");
      });
      c2.appendChild(err2);
      c2.appendChild(el("div", { class: "modal-actions" }, [fin]));
      afterArea.appendChild(c2);
    }

    if (state.answers.investigate_predictionsSaved) { renderAfterRun(); }
    main.appendChild(wrap);
  }

  /* ---------- Main 2C: Modification Mission ---------- */

  const MOD_CHECKLIST = [
    "I opened the correct Scratch project.",
    "I saved or remixed my own copy.",
    "I made one purposeful change.",
    "I ran the program.",
    "I checked what happened.",
    "I corrected a problem when needed.",
    "I saved the improved version.",
    "I can explain what I changed."
  ];

  function renderModify() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Main mission 2C" }),
      el("span", { class: "time-pill", text: "⏱ about 10 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "🧩 Scratch Modification Mission" }));
    wrap.appendChild(instructionRow(langSupport()
      ? "Go to your Scratch project. Make one purposeful change. Test it. Then tick the checklist below."
      : "Now improve the program — in Scratch itself, not here. Choose at least one purposeful modification, make it, test it, and debug it if something breaks. Then complete your self-checklist below."));

    const c1 = el("div", { class: "card" });
    c1.appendChild(el("h2", { text: "Choose at least one purposeful change" }));
    const ul = el("ul");
    ["Change the key or event that starts an action.",
     "Change how far or where the sprite moves.",
     "Change the message produced by an input.",
     "Add an appropriate sound output.",
     "Change the order of two blocks and describe the effect."].forEach(function (t) {
      ul.appendChild(el("li", { text: t }));
    });
    c1.appendChild(ul);
    c1.appendChild(el("div", { class: "hint-box", html: "<strong>Remember:</strong> changing only a sprite's colour, costume or background does <strong>not</strong> count as a purposeful change — unless it supports the program's purpose." }));
    const openB = el("a", { class: "btn", href: scratchUrl(), target: "_blank", rel: "noopener noreferrer", text: "🚀 Open Scratch Project (new tab)" });
    c1.appendChild(el("div", { class: "modal-actions" }, [openB]));
    wrap.appendChild(c1);

    const c2 = el("div", { class: "card" });
    c2.appendChild(el("h2", { text: "My self-checklist" }));
    c2.appendChild(el("p", { html: "<em>This is a self-check — the app cannot see inside Scratch. Tick each step honestly. Your teacher may look at your Scratch project or your screenshot to review your work.</em>" }));
    const list = el("ul", { class: "self-checklist" });
    const boxes = [];
    MOD_CHECKLIST.forEach(function (item, i) {
      const cb = el("input", { type: "checkbox" });
      cb.checked = !!state.checklist["m" + i];
      cb.addEventListener("change", function () {
        state.checklist["m" + i] = cb.checked;
        S.save();
        updateBtn();
      });
      boxes.push(cb);
      list.appendChild(el("li", {}, [el("label", {}, [cb, el("span", { text: item })])]));
    });
    c2.appendChild(list);
    c2.appendChild(el("p", { class: "sentence-starter", text: "Your ticks save automatically." }));
    const err = el("div", { class: "field-error", "aria-live": "polite" });
    const cont = el("button", { type: "button", class: "btn", text: "Continue to the Evidence Station ▶" });
    function updateBtn() {
      const done = boxes.filter(function (b) { return b.checked; }).length;
      cont.disabled = done < MOD_CHECKLIST.length;
      err.textContent = cont.disabled ? "Tick every step you have completed (" + done + " of " + MOD_CHECKLIST.length + ")." : "";
    }
    updateBtn();
    cont.addEventListener("click", function () {
      if (!isDone("modify")) {
        addChips(2);
        completeStage("modify");
      }
      go("evidence");
    });
    c2.appendChild(err);
    c2.appendChild(el("div", { class: "modal-actions" }, [cont]));
    wrap.appendChild(c2);
    main.appendChild(wrap);
  }

  /* ---------- Main 2D: Evidence Capture ---------- */

  const EVIDENCE_PROMPTS = [
    { id: "ev1", label: "The input in my program is…", frame: "The input is __________.", wordbank: ["the green flag", "pressing a key", "clicking the sprite", "the space key", "an arrow key"] },
    { id: "ev2", label: "The program processes the input by…", frame: "The program processes the input by __________.", wordbank: ["following the blocks in order", "checking which key was pressed", "running the sequence", "repeating the blocks"] },
    { id: "ev3", label: "The output is…", frame: "The output is __________.", wordbank: ["movement", "a message", "a sound", "a speech bubble"] },
    { id: "ev4", label: "I changed…", frame: "I changed __________.", wordbank: ["the key that starts the action", "how far the sprite moves", "the message", "the sound", "the order of two blocks"] },
    { id: "ev5", label: "I tested my change by…", frame: "I tested it by __________.", wordbank: ["running the program", "pressing the key", "clicking the green flag", "watching what happened"] },
    { id: "ev6", label: "One problem I fixed or improvement I made was…", frame: "One problem I fixed was __________.", wordbank: ["the wrong key", "the sprite moved too far", "the wrong order", "no sound played", "I made it clearer"] }
  ];

  const OS_INSTRUCTIONS = {
    windows: { name: "Windows", steps: [
      "Open the Scratch project.",
      "Press Windows + Shift + S.",
      "Drag around the code and stage you want to capture.",
      "Return to this page.",
      "Paste the image (Ctrl + V) or save and upload it."
    ]},
    chromebook: { name: "Chromebook", steps: [
      "Press Ctrl + Show Windows.",
      "Select the part of the screen to capture.",
      "Return to the Evidence Station.",
      "Upload the screenshot."
    ]},
    mac: { name: "Mac", steps: [
      "Press Command + Shift + 4.",
      "Drag around the Scratch code and stage.",
      "Return to the Evidence Station.",
      "Upload the screenshot."
    ]}
  };

  function renderEvidence() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Main mission 2D" }),
      el("span", { class: "time-pill", text: "⏱ about 7 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "📸 Evidence Station" }));
    wrap.appendChild(instructionRow(langSupport()
      ? "Take a screenshot of your Scratch project. Upload it here. Then answer the sentences below."
      : "Capture a screenshot showing your modified Scratch code and stage, upload it here, then explain your program's input, process and output. Your screenshot stays on this computer only."));

    // OS instructions
    const insCard = el("div", { class: "card" });
    insCard.appendChild(el("h2", { text: "How to take a screenshot" }));
    const tabs = el("div", { class: "os-tabs", role: "tablist" });
    const stepsArea = el("div");
    let currentOS = "windows";
    function renderSteps() {
      stepsArea.innerHTML = "";
      const ol = el("ol");
      OS_INSTRUCTIONS[currentOS].steps.forEach(function (s) { ol.appendChild(el("li", { text: s })); });
      stepsArea.appendChild(ol);
      tabs.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-selected", String(b.dataset.os === currentOS));
      });
    }
    Object.keys(OS_INSTRUCTIONS).forEach(function (k) {
      const b = el("button", { type: "button", class: "os-tab", role: "tab", "data-os": k, text: OS_INSTRUCTIONS[k].name });
      b.addEventListener("click", function () { currentOS = k; renderSteps(); });
      tabs.appendChild(b);
    });
    insCard.appendChild(tabs);
    insCard.appendChild(stepsArea);
    renderSteps();
    insCard.appendChild(el("div", { class: "hint-box", html:
      "<strong>A useful screenshot shows:</strong> the important Scratch blocks · the sprite or stage · enough to see your modification · <strong>no</strong> unnecessary personal information · <strong>no</strong> other students' names, messages or accounts." }));
    wrap.appendChild(insCard);

    // Upload area
    const upCard = el("div", { class: "card" });
    upCard.appendChild(el("h2", { text: "Upload your screenshot" }));
    upCard.appendChild(el("p", { text: "Accepted: PNG, JPG, JPEG or WEBP, up to about 10 MB. You can also paste a copied screenshot straight onto this page (Ctrl + V / Cmd + V). It is stored only in this browser on this computer." }));
    const drop = el("div", { class: "drop-area", tabindex: "0", role: "button", "aria-label": "Upload screenshot: click, drop an image here, or paste" });
    drop.appendChild(el("p", { html: "🖼️ <strong>Drag and drop</strong> your screenshot here,<br>paste it, or" }));
    const fileInput = el("input", { type: "file", accept: "image/png,image/jpeg,image/webp", class: "visually-hidden", "aria-hidden": "true", tabindex: "-1" });
    const pick = el("button", { type: "button", class: "btn", text: "📤 Upload Screenshot" });
    pick.addEventListener("click", function () { fileInput.click(); });
    drop.appendChild(pick);
    drop.appendChild(fileInput);
    upCard.appendChild(drop);
    const upErr = el("div", { class: "field-error", "aria-live": "polite" });
    upCard.appendChild(upErr);
    const previewArea = el("div");
    upCard.appendChild(previewArea);
    wrap.appendChild(upCard);

    function acceptFile(file) {
      upErr.textContent = "";
      if (!file) { return; }
      if (["image/png", "image/jpeg", "image/webp"].indexOf(file.type) === -1) {
        upErr.textContent = "That file type is not supported. Please use PNG, JPG, JPEG or WEBP.";
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        upErr.textContent = "That image is larger than 10 MB. Try capturing a smaller area of the screen.";
        return;
      }
      S.putScreenshot("main", file).then(function () {
        state.evidence.hasImage = true;
        state.evidence.rotation = 0;
        S.save();
        toast("Screenshot saved on this computer.", "📸");
        renderPreview();
        renderPromptsIfReady();
      }).catch(function () {
        upErr.textContent = "This browser could not store the image. You can still continue — your teacher can check your Scratch project directly.";
        state.evidence.hasImage = false;
        state.evidence.unavailable = true;
        S.save();
        renderPromptsIfReady();
      });
    }

    fileInput.addEventListener("change", function () { acceptFile(fileInput.files[0]); });
    ["dragover", "dragenter"].forEach(function (evt) {
      drop.addEventListener(evt, function (e) { e.preventDefault(); drop.classList.add("drag-over"); });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      drop.addEventListener(evt, function (e) { e.preventDefault(); drop.classList.remove("drag-over"); });
    });
    drop.addEventListener("drop", function (e) {
      if (e.dataTransfer.files && e.dataTransfer.files.length) { acceptFile(e.dataTransfer.files[0]); }
    });
    const pasteHandler = function (e) {
      if (currentScreen !== "evidence") { return; }
      const items = (e.clipboardData || {}).items || [];
      for (const it of items) {
        if (it.type && it.type.indexOf("image/") === 0) {
          acceptFile(it.getAsFile());
          e.preventDefault();
          return;
        }
      }
    };
    document.addEventListener("paste", pasteHandler);

    function rotateImage() {
      S.getScreenshot("main").then(function (blob) {
        if (!blob) { return; }
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = function () {
          const cv = document.createElement("canvas");
          cv.width = img.height; cv.height = img.width;
          const cx = cv.getContext("2d");
          cx.translate(cv.width / 2, cv.height / 2);
          cx.rotate(Math.PI / 2);
          cx.drawImage(img, -img.width / 2, -img.height / 2);
          URL.revokeObjectURL(url);
          cv.toBlob(function (out) {
            if (out) { S.putScreenshot("main", out).then(renderPreview); }
          }, "image/png");
        };
        img.src = url;
      });
    }

    function renderPreview() {
      previewArea.innerHTML = "";
      if (!state.evidence.hasImage) { return; }
      S.getScreenshot("main").then(function (blob) {
        if (!blob) { return; }
        const url = URL.createObjectURL(blob);
        const img = el("img", { class: "evidence-preview", alt: "Your uploaded Scratch screenshot", src: url });
        previewArea.appendChild(img);
        const tools = el("div", { class: "evidence-tools" });
        const rep = el("button", { type: "button", class: "btn btn-secondary", text: "🔁 Replace" });
        rep.addEventListener("click", function () { fileInput.click(); });
        const rot = el("button", { type: "button", class: "btn btn-secondary", text: "🔄 Rotate" });
        rot.addEventListener("click", rotateImage);
        const delB = el("button", { type: "button", class: "btn btn-danger", text: "🗑 Delete" });
        delB.addEventListener("click", function () {
          confirmDialog("Delete this screenshot? You can upload a new one afterwards.", function () {
            S.deleteScreenshot("main").then(function () {
              state.evidence.hasImage = false;
              S.save();
              renderPreview();
            });
          });
        });
        tools.appendChild(rep); tools.appendChild(rot); tools.appendChild(delB);
        previewArea.appendChild(tools);
      });
    }

    // Explanation prompts
    const promptsArea = el("div");
    wrap.appendChild(promptsArea);

    function renderPromptsIfReady() {
      promptsArea.innerHTML = "";
      const card = el("div", { class: "card" });
      card.appendChild(el("h2", { text: "Explain your program" }));
      if (!state.evidence.hasImage && !state.evidence.unavailable) {
        card.appendChild(el("p", { html: "<em>Upload your screenshot above first. If you cannot take a screenshot on this device, ask your teacher — then you can continue with the explanations below.</em>" }));
        const skipB = el("button", { type: "button", class: "btn btn-ghost", text: "My teacher says I can continue without a screenshot" });
        skipB.addEventListener("click", function () {
          state.evidence.unavailable = true;
          S.save();
          renderPromptsIfReady();
        });
        card.appendChild(skipB);
        promptsArea.appendChild(card);
        return;
      }
      const getters = {};
      EVIDENCE_PROMPTS.forEach(function (p, i) {
        const block = el("div", { class: "form-field" });
        block.appendChild(el("label", { text: (i + 1) + ". " + p.label }));
        if (langSupport() || typingSupport()) {
          block.appendChild(el("p", { class: "sentence-starter", text: "Frame: " + p.frame }));
          const wb = el("div", { class: "word-bank" });
          const inp = el("input", { type: "text", class: "plain-input", maxlength: "200", "aria-label": p.label });
          p.wordbank.forEach(function (w) {
            const wbtn = el("button", { type: "button", class: "wb-word", text: w });
            wbtn.addEventListener("click", function () {
              inp.value = (inp.value ? inp.value.replace(/\s+$/, "") + " " : "") + w;
              inp.focus();
            });
            wb.appendChild(wbtn);
          });
          block.appendChild(wb);
          const saved = state.answers["evidence_" + p.id];
          if (saved) { inp.value = saved.answer; }
          block.appendChild(inp);
          getters[p.id] = function () { return inp.value.trim(); };
        } else {
          const ta = el("textarea", { class: "plain-input", rows: "2", "aria-label": p.label });
          const saved = state.answers["evidence_" + p.id];
          if (saved) { ta.value = saved.answer; }
          block.appendChild(ta);
          getters[p.id] = function () { return ta.value.trim(); };
        }
        card.appendChild(block);
      });
      const err = el("div", { class: "field-error", "aria-live": "polite" });
      const fin = el("button", { type: "button", class: "btn", text: "Complete the Evidence Station ▶" });
      fin.addEventListener("click", function () {
        const minLen = (langSupport() || typingSupport()) ? 3 : 10;
        let ok = true;
        EVIDENCE_PROMPTS.forEach(function (p) {
          if (getters[p.id]().length < minLen) { ok = false; }
        });
        if (!ok) { err.textContent = "Please complete every sentence — short answers are fine, empty ones are not."; return; }
        EVIDENCE_PROMPTS.forEach(function (p) {
          state.answers["evidence_" + p.id] = { question: p.label, answer: getters[p.id]() };
        });
        S.save();
        if (!isDone("evidence")) {
          awardBadge("detective");
          awardBadge("improver");
          awardBadge("evidence");
          completeStage("evidence");
        }
        toast("Evidence secured!", "📸");
        go("map");
      });
      card.appendChild(err);
      card.appendChild(el("div", { class: "modal-actions" }, [fin]));
      promptsArea.appendChild(card);
    }

    if (state.evidence.hasImage) { renderPreview(); }
    renderPromptsIfReady();

    if (isDone("evidence")) {
      const doneCard = el("div", { class: "card" });
      doneCard.appendChild(el("p", { html: "<strong>✔ Evidence Station complete.</strong> Next: try the optional Extension Vault, or go straight to the Exit Terminal." }));
      const extB = el("button", { type: "button", class: "btn btn-secondary", text: "🗝️ Extension Vault (optional)" });
      extB.addEventListener("click", function () { go("extension"); });
      const plB = el("button", { type: "button", class: "btn", text: "🖥️ Exit Terminal (required) ▶" });
      plB.addEventListener("click", function () { go("plenary"); });
      doneCard.appendChild(el("div", { class: "modal-actions" }, [extB, plB]));
      wrap.appendChild(doneCard);
    }
    main.appendChild(wrap);
  }

  /* ---------- Extension Vault ---------- */

  function renderExtension() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("p", { class: "stage-eyebrow", text: "Optional missions" }));
    wrap.appendChild(el("h1", { text: "🗝️ Extension Vault" }));
    wrap.appendChild(instructionRow("These challenges are optional extras for explorers who have time. You can leave the vault and go to the Exit Terminal whenever you like."));

    const leaveTop = el("button", { type: "button", class: "btn", text: "🖥️ Continue to the Exit Terminal ▶" });
    leaveTop.addEventListener("click", function () { markExtDone(); go("plenary"); });
    wrap.appendChild(el("div", { class: "modal-actions" }, [leaveTop]));

    function markExtDone() {
      if (!isDone("extension") && state.extensionDone.length) {
        completeStage("extension");
      } else {
        unlock("plenary");
        S.save();
      }
    }

    /* Extension 1 */
    const e1 = el("div", { class: "card ext-card" });
    e1.appendChild(el("h2", { text: "Extension 1 · Another Input" }));
    e1.appendChild(el("p", { text: "Add a second input that creates a different output. Example: the right arrow moves the sprite right, and the left arrow moves it left." }));
    const e1cb = el("input", { type: "checkbox" });
    e1cb.checked = !!state.extChecklist.e1done;
    const e1lab = el("label", { class: "check-option" }, [e1cb, el("span", { text: "I added a second input with a different output in Scratch." })]);
    e1.appendChild(e1lab);
    e1.appendChild(el("p", { html: "<strong>One-sentence explanation:</strong>" }));
    const e1ta = el("input", { type: "text", class: "plain-input", maxlength: "220", "aria-label": "Extension 1 explanation", placeholder: "My second input is … and its output is …" });
    if (state.answers.ext1) { e1ta.value = state.answers.ext1.answer; }
    e1.appendChild(e1ta);
    e1.appendChild(el("p", { class: "sentence-starter", text: "Optional: add a second screenshot showing your new input at the Evidence Station (replace is fine — or show your teacher in Scratch)." }));
    const e1save = el("button", { type: "button", class: "btn btn-secondary", text: "Save Extension 1" });
    const e1fb = el("div", { "aria-live": "polite" });
    e1save.addEventListener("click", function () {
      if (!e1cb.checked || e1ta.value.trim().length < 5) {
        e1fb.innerHTML = "";
        e1fb.appendChild(el("div", { class: "feedback feedback-try", text: "Tick the checklist and write one sentence to save this extension." }));
        return;
      }
      state.extChecklist.e1done = true;
      state.answers.ext1 = { question: "Extension 1: second input explanation", answer: e1ta.value.trim() };
      if (state.extensionDone.indexOf("ext1") === -1) { state.extensionDone.push("ext1"); addChips(2); }
      S.save();
      e1fb.innerHTML = "";
      e1fb.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Extension 1 saved. Excellent extra input!" }));
    });
    e1.appendChild(e1fb);
    e1.appendChild(el("div", { class: "modal-actions" }, [e1save]));
    wrap.appendChild(e1);

    /* Extension 2 */
    const e2 = el("div", { class: "card ext-card" });
    e2.appendChild(el("h2", { text: "Extension 2 · Smarter Control" }));
    e2.appendChild(el("p", { text: "Add either a repeat block or an if condition to your program in Scratch." }));
    const e2cb = el("input", { type: "checkbox" });
    e2cb.checked = !!state.extChecklist.e2done;
    e2.appendChild(el("label", { class: "check-option" }, [e2cb, el("span", { text: "I added a repeat block or an if condition." })]));
    e2.appendChild(el("p", { html: "<strong>Why is this block useful in your program?</strong>" }));
    const e2ta = el("input", { type: "text", class: "plain-input", maxlength: "220", "aria-label": "Extension 2 explanation", placeholder: "This block is useful because …" });
    if (state.answers.ext2) { e2ta.value = state.answers.ext2.answer; }
    e2.appendChild(e2ta);
    const e2save = el("button", { type: "button", class: "btn btn-secondary", text: "Save Extension 2" });
    const e2fb = el("div", { "aria-live": "polite" });
    e2save.addEventListener("click", function () {
      if (!e2cb.checked || e2ta.value.trim().length < 5) {
        e2fb.innerHTML = "";
        e2fb.appendChild(el("div", { class: "feedback feedback-try", text: "Tick the checklist and answer the question to save this extension." }));
        return;
      }
      state.extChecklist.e2done = true;
      state.answers.ext2 = { question: "Extension 2: why is the repeat/if block useful?", answer: e2ta.value.trim() };
      if (state.extensionDone.indexOf("ext2") === -1) { state.extensionDone.push("ext2"); addChips(2); }
      S.save();
      e2fb.innerHTML = "";
      e2fb.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Extension 2 saved. Smarter control unlocked!" }));
    });
    e2.appendChild(e2fb);
    e2.appendChild(el("div", { class: "modal-actions" }, [e2save]));
    wrap.appendChild(e2);

    /* Extension 3 */
    const e3 = el("div", { class: "card ext-card" });
    e3.appendChild(el("h2", { text: "Extension 3 · Algorithm Translator" }));
    e3.appendChild(el("p", { text: "Write a five-step algorithm explaining how your program works, in order." }));
    const stepsList = el("ol", { class: "algo-steps" });
    const stepInputs = [];
    for (let i = 0; i < 5; i++) {
      const inp = el("input", { type: "text", maxlength: "160", "aria-label": "Algorithm step " + (i + 1) });
      if (state.answers.ext3 && state.answers.ext3.steps && state.answers.ext3.steps[i]) { inp.value = state.answers.ext3.steps[i]; }
      stepInputs.push(inp);
      stepsList.appendChild(el("li", {}, [inp]));
    }
    e3.appendChild(stepsList);
    e3.appendChild(el("p", { html: "<strong>Review checklist</strong> — check your own algorithm:" }));
    const revList = el("ul", { class: "self-checklist" });
    const revBoxes = [];
    ["Are the steps in the correct order?", "Is the input included?", "Is the processing described?", "Is the output included?", "Could another student follow the algorithm?"].forEach(function (t, i) {
      const cb = el("input", { type: "checkbox" });
      cb.checked = !!state.extChecklist["rev" + i];
      cb.addEventListener("change", function () { state.extChecklist["rev" + i] = cb.checked; S.save(); });
      revBoxes.push(cb);
      revList.appendChild(el("li", {}, [el("label", {}, [cb, el("span", { text: t })])]));
    });
    e3.appendChild(revList);
    const e3save = el("button", { type: "button", class: "btn btn-secondary", text: "Save Extension 3" });
    const e3fb = el("div", { "aria-live": "polite" });
    e3save.addEventListener("click", function () {
      const steps = stepInputs.map(function (inp) { return inp.value.trim(); });
      if (steps.some(function (s) { return s.length < 3; })) {
        e3fb.innerHTML = "";
        e3fb.appendChild(el("div", { class: "feedback feedback-try", text: "Fill in all five steps of your algorithm to save it." }));
        return;
      }
      state.answers.ext3 = { question: "Extension 3: five-step algorithm", steps: steps, answer: steps.map(function (s, i) { return (i + 1) + ". " + s; }).join(" ") };
      if (state.extensionDone.indexOf("ext3") === -1) { state.extensionDone.push("ext3"); addChips(2); }
      S.save();
      e3fb.innerHTML = "";
      e3fb.appendChild(el("div", { class: "feedback feedback-good", text: "✔ Algorithm saved. Now use the review checklist to double-check it." }));
    });
    e3.appendChild(e3fb);
    e3.appendChild(el("div", { class: "modal-actions" }, [e3save]));
    wrap.appendChild(e3);

    const leave = el("button", { type: "button", class: "btn btn-big", text: "🖥️ Leave the vault — go to the Exit Terminal ▶" });
    leave.addEventListener("click", function () { markExtDone(); go("plenary"); });
    wrap.appendChild(el("div", { style: "text-align:center; margin-top:0.5rem;" }, [leave]));
    main.appendChild(wrap);
  }

  /* ---------- Plenary: Exit Terminal ---------- */

  const PLENARY_QS = [
    { id: "p1", label: "One Computing Lab routine I must remember is…", frame: "One routine I must remember is __________.", wordbank: ["wait for instructions", "report damage", "save in the agreed folder", "use a clear filename", "sign out", "leave the workstation ready"] },
    { id: "p2", label: "This routine matters because…", frame: "This routine matters because __________.", wordbank: ["it keeps us safe", "it protects my work", "it helps the next class", "it keeps my account private"] },
    { id: "p3", label: "The input in my Scratch program was…", frame: "The input was __________.", wordbank: ["the green flag", "a key press", "a mouse click"] },
    { id: "p4", label: "The output was…", frame: "The output was __________.", wordbank: ["movement", "a message", "a sound"] },
    { id: "p5", label: "One change I made was…", frame: "One change I made was __________.", wordbank: ["the start key", "the distance moved", "the message", "a new sound", "the block order"] },
    { id: "p6", label: "One thing I would like help with this year is…", frame: "I would like help with __________.", wordbank: ["typing", "debugging", "saving my work", "Scratch blocks", "reading instructions", "nothing yet"] }
  ];

  function renderPlenary() {
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("div", { class: "stage-head" }, [
      el("span", { class: "stage-eyebrow", text: "Compulsory plenary" }),
      el("span", { class: "time-pill", text: "⏱ 8–10 minutes" })
    ]));
    wrap.appendChild(el("h1", { text: "🖥️ Exit Terminal" }));

    const chk = el("div", { class: "card" });
    chk.appendChild(el("h2", { text: "Real-life finishing checklist — do these at your real computer" }));
    const ol = el("ul", { class: "self-checklist" });
    ["Save your Scratch project.", "Check the filename.", "Close any unnecessary browser tabs.", "Sign out when the teacher instructs you.", "Leave the workstation ready for the next class."].forEach(function (t, i) {
      const cb = el("input", { type: "checkbox" });
      cb.checked = !!state.plenary["chk" + i];
      cb.addEventListener("change", function () { state.plenary["chk" + i] = cb.checked; S.save(); });
      ol.appendChild(el("li", {}, [el("label", {}, [cb, el("span", { text: t })])]));
    });
    chk.appendChild(ol);
    wrap.appendChild(chk);

    const card = el("div", { class: "card" });
    card.appendChild(el("h2", { text: "Exit questions" }));
    const getters = {};
    PLENARY_QS.forEach(function (p, i) {
      const block = el("div", { class: "form-field" });
      const row = el("div", { class: "instruction-row" });
      const sb = speakBtn(p.label);
      if (sb) { row.appendChild(sb); }
      row.appendChild(el("p", { html: "<strong>" + (i + 1) + ". " + esc(p.label) + "</strong>" }));
      block.appendChild(row);
      if (langSupport() || typingSupport()) {
        block.appendChild(el("p", { class: "sentence-starter", text: "Frame: " + p.frame }));
        const wb = el("div", { class: "word-bank" });
        const inp = el("input", { type: "text", class: "plain-input", maxlength: "220", "aria-label": p.label });
        p.wordbank.forEach(function (w) {
          const wbtn = el("button", { type: "button", class: "wb-word", text: w });
          wbtn.addEventListener("click", function () {
            inp.value = (inp.value ? inp.value.replace(/\s+$/, "") + " " : "") + w;
            inp.focus();
          });
          wb.appendChild(wbtn);
        });
        block.appendChild(wb);
        if (state.answers["plenary_" + p.id]) { inp.value = state.answers["plenary_" + p.id].answer; }
        block.appendChild(inp);
        getters[p.id] = function () { return inp.value.trim(); };
      } else {
        const ta = el("textarea", { class: "plain-input", rows: "2", "aria-label": p.label });
        if (state.answers["plenary_" + p.id]) { ta.value = state.answers["plenary_" + p.id].answer; }
        block.appendChild(ta);
        getters[p.id] = function () { return ta.value.trim(); };
      }
      card.appendChild(block);
    });
    wrap.appendChild(card);

    const conf = el("div", { class: "card" });
    conf.appendChild(el("h2", { text: "How confident do you feel after today's lesson?" }));
    conf.appendChild(el("p", { text: "Be honest — every answer is a good answer. It simply tells your teacher how best to help you this year." }));
    const confRow = el("div", { class: "confidence-row", role: "group", "aria-label": "Confidence choice" });
    const confOpts = [
      { v: "green", cls: "conf-green", emoji: "🟢", t: "Green — I can work independently." },
      { v: "amber", cls: "conf-amber", emoji: "🟠", t: "Amber — I remember some things but still need reminders." },
      { v: "red", cls: "conf-red", emoji: "🔴", t: "Red — I need help getting started. That's a great thing to know!" }
    ];
    confOpts.forEach(function (o) {
      const b = el("button", { type: "button", class: "confidence-opt " + o.cls, "aria-pressed": String(state.confidence === o.v) }, [
        el("span", { class: "c-emoji", "aria-hidden": "true", text: o.emoji }),
        el("span", { text: o.t })
      ]);
      b.addEventListener("click", function () {
        state.confidence = o.v;
        confRow.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        S.save();
      });
      confRow.appendChild(b);
    });
    conf.appendChild(confRow);
    wrap.appendChild(conf);

    const err = el("div", { class: "field-error", "aria-live": "polite" });
    const fin = el("button", { type: "button", class: "btn btn-big", text: "🚀 Complete the mission ▶" });
    fin.addEventListener("click", function () {
      const minLen = (langSupport() || typingSupport()) ? 3 : 8;
      let missing = 0;
      PLENARY_QS.forEach(function (p) { if (getters[p.id]().length < minLen) { missing++; } });
      if (missing > 0) { err.textContent = "Please answer all six exit questions (" + missing + " still to go)."; return; }
      if (!state.confidence) { err.textContent = "Please choose a confidence colour — every colour is a good answer."; return; }
      err.textContent = "";
      PLENARY_QS.forEach(function (p) {
        state.answers["plenary_" + p.id] = { question: p.label, answer: getters[p.id]() };
      });
      state.finishedAt = new Date().toISOString();
      S.save();
      if (!isDone("plenary")) {
        awardBadge("ready");
        addChips(2);
        completeStage("plenary");
      }
      go("report");
    });
    wrap.appendChild(err);
    wrap.appendChild(el("div", { style: "text-align:center;" }, [fin]));
    main.appendChild(wrap);
  }

  /* ---------- Report ---------- */

  function renderReport() {
    if (!isDone("plenary") && !teacherMode) {
      go("plenary");
      return;
    }
    const main = clearMain();
    const wrap = el("div", { class: "screen" });
    wrap.appendChild(el("p", { class: "stage-eyebrow", text: "Mission complete" }));
    wrap.appendChild(el("h1", { text: "📄 Your Completion Report" }));
    wrap.appendChild(instructionRow("Well done — the lab is fully restored! Here is your report. You can print it or save it as a PDF."));

    const actions = el("div", { class: "report-actions" });
    const printB = el("button", { type: "button", class: "btn btn-big", text: "🖨 Print / Save as PDF" });
    printB.addEventListener("click", function () { window.print(); });
    const mapB = el("button", { type: "button", class: "btn btn-secondary", text: "🗺️ Return to Mission Map" });
    mapB.addEventListener("click", function () { go("map"); });
    const restartB = el("button", { type: "button", class: "btn btn-ghost", text: "↺ Start Again (clears everything)" });
    restartB.addEventListener("click", function () {
      confirmDialog("Start the whole lesson again? This deletes ALL saved answers, badges and the screenshot on this computer.", function () {
        const p = S.resetAll();
        if (p && p.then) { p.then(function () { location.reload(); }); }
        else { location.reload(); }
      });
    });
    actions.appendChild(printB); actions.appendChild(mapB); actions.appendChild(restartB);
    wrap.appendChild(actions);

    const holder = el("div");
    wrap.appendChild(holder);
    main.appendChild(wrap);

    window.LabReport.build(state, { BADGES: BADGES, STAGES: STAGES, CFG: CFG, esc: esc, getScreenshot: S.getScreenshot }).then(function (node) {
      // on-screen preview
      holder.appendChild(node);
      // print copy
      window.LabReport.build(state, { BADGES: BADGES, STAGES: STAGES, CFG: CFG, esc: esc, getScreenshot: S.getScreenshot }).then(function (printNode) {
        const rr = $("#reportRoot");
        rr.innerHTML = "";
        rr.appendChild(printNode);
      });
    });
  }

  /* ---------- Teacher mode ---------- */

  function teacherBar() {
    const bar = el("div", { class: "teacher-bar" });
    bar.appendChild(el("h2", { text: "🧑‍🏫 Teacher mode (hidden from students)" }));
    const grid = el("div", { class: "teacher-grid" });

    function tb(label, fn) {
      const b = el("button", { type: "button", class: "btn btn-secondary", text: label });
      b.addEventListener("click", fn);
      grid.appendChild(b);
    }
    tb("🔓 Unlock all stages", function () {
      state.teacherUnlockedAll = true;
      STAGES.forEach(function (s) { unlock(s.id); });
      S.save();
      toast("All stages unlocked.", "🔓");
      go("map");
    });
    STAGES.forEach(function (s) {
      if (["landing", "support", "briefing"].indexOf(s.id) !== -1) { return; }
      tb("→ " + s.name, function () { unlock(s.id); go(s.id); });
    });
    tb("📖 View sample answers", function () {
      openModal(function (m) {
        m.appendChild(el("h2", { text: "Sample / model answers" }));
        STARTER.forEach(function (s) {
          m.appendChild(el("p", { html: "<strong>" + esc(s.label) + ":</strong> " + esc(s.open.model) }));
        });
        ROUTINE_QUESTIONS.forEach(function (q) {
          m.appendChild(el("p", { html: "<strong>" + esc(q.q) + "</strong> " + esc(q.open.model) }));
        });
        m.appendChild(el("p", { html: "<strong>Agreed filename:</strong> " + esc(TARGET_FILENAME) }));
        m.appendChild(el("p", { html: "<strong>Folder structure:</strong> Year 6 Computing › Term 1 - Digital Independence › (student's own name). Students then recreate this for real on their school computer and upload a screenshot as evidence." }));
        const c = el("button", { type: "button", class: "btn", text: "Close" });
        c.addEventListener("click", closeModal);
        m.appendChild(el("div", { class: "modal-actions" }, [c]));
      }, { dismissable: true });
    });
    tb("🔗 Change Scratch URL", function () {
      openModal(function (m) {
        m.appendChild(el("h2", { text: "Scratch project URL" }));
        m.appendChild(el("p", { text: "This overrides config.js on this computer only." }));
        const inp = el("input", { type: "text", class: "plain-input", value: scratchUrl() });
        m.appendChild(inp);
        const saveB = el("button", { type: "button", class: "btn", text: "Save" });
        saveB.addEventListener("click", function () {
          overrides.scratchUrl = inp.value.trim();
          localStorage.setItem("labLaunch_teacherOverrides", JSON.stringify(overrides));
          closeModal();
          toast("Scratch URL updated.", "🔗");
        });
        m.appendChild(el("div", { class: "modal-actions" }, [saveB]));
      }, { dismissable: true });
    });
    tb("🏷 Change class list", function () {
      openModal(function (m) {
        m.appendChild(el("h2", { text: "Class options" }));
        m.appendChild(el("p", { text: "One class per line. Leave empty for a free-text class field. Overrides config.js on this computer only." }));
        const ta = el("textarea", { class: "plain-input", rows: "4" });
        ta.value = classOptions().join("\n");
        m.appendChild(ta);
        const saveB = el("button", { type: "button", class: "btn", text: "Save" });
        saveB.addEventListener("click", function () {
          const list = ta.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
          overrides.classOptions = list.length ? list : undefined;
          localStorage.setItem("labLaunch_teacherOverrides", JSON.stringify(overrides));
          closeModal();
          toast("Class list updated.", "🏷");
        });
        m.appendChild(el("div", { class: "modal-actions" }, [saveB]));
      }, { dismissable: true });
    });
    tb((overrides.sound === false ? "🔊 Enable sounds" : "🔇 Disable sounds"), function () {
      overrides.sound = overrides.sound === false ? undefined : false;
      localStorage.setItem("labLaunch_teacherOverrides", JSON.stringify(overrides));
      go("map");
    });
    tb("🎬 Demonstration mode (fill sample data)", function () {
      confirmDialog("Fill the app with sample demonstration data? This overwrites current progress on this computer.", function () {
        fillDemoData();
        go("map");
      });
    });
    tb("♻ Reset current student", function () {
      confirmDialog("Reset this student's progress and answers?", function () {
        const p = S.resetAll();
        if (p && p.then) { p.then(function () { location.href = location.pathname + "?teacher=1"; }); }
        else { location.href = location.pathname + "?teacher=1"; }
      });
    });
    tb("🗑 Clear ALL local data", function () {
      confirmDialog("Clear all Lab Launch data stored in this browser, including teacher overrides?", function () {
        try { localStorage.removeItem("labLaunch_teacherOverrides"); } catch (e) {}
        const p = S.resetAll();
        if (p && p.then) { p.then(function () { location.href = location.pathname; }); }
        else { location.href = location.pathname; }
      });
    });
    bar.appendChild(grid);
    return bar;
  }

  function fillDemoData() {
    state.student = { name: "Sample Student", className: "6A", avatar: "aqua" };
    state.profile = { lang: "full", typing: "full" };
    state.startedAt = new Date().toISOString();
    STAGES.forEach(function (s) { unlock(s.id); if (s.id !== "report") { state.completed.push(s.id); } });
    state.completed = Array.from(new Set(state.completed));
    Object.keys(BADGES).forEach(function (k) { if (state.badges.indexOf(k) === -1) { state.badges.push(k); } });
    state.chips = 24;
    state.answers = {
      starter_adam: { label: "Room 1: Adam", question: STARTER[0].open.prompt, answer: "Adam should stop the game and listen so he knows the task.", correct: true, attempts: 1 },
      starter_mei: { label: "Room 2: Mei", question: STARTER[1].open.prompt, answer: "She did not touch the unsafe cable and told the teacher.", correct: true, attempts: 1 },
      starter_rohan: { label: "Room 3: Rohan", question: STARTER[2].open.prompt, answer: "The name is confusing; better: Y6_T1W01_ScratchBaseline_v1.", correct: true, attempts: 1 },
      starter_hana: { label: "Room 4: Hana", question: STARTER[3].open.prompt, answer: "She saved, checked, closed, signed out and tidied.", correct: true, attempts: 1 },
      routine_rq1: { question: ROUTINE_QUESTIONS[0].q, answer: "So it is fixed safely and nobody is wrongly blamed.", correct: true, attempts: 1 },
      routine_rq2: { question: ROUTINE_QUESTIONS[1].q, answer: "Because you need the agreed folder and filename to find it.", correct: true, attempts: 1 },
      routine_rq3: { question: ROUTINE_QUESTIONS[2].q, answer: "To keep the account and personal information safe.", correct: true, attempts: 1 },
      investigate_inv1: { question: INVESTIGATE_QS[0].q, answer: "Clicking the green flag" },
      investigate_inv2: { question: INVESTIGATE_QS[1].q, answer: "The sprite will move and say a message." },
      investigate_inv3: { question: INVESTIGATE_QS[2].q, answer: "A key press, mouse click or the green flag" },
      investigate_inv4: { question: INVESTIGATE_QS[3].q, answer: "Movement, a message or a sound" },
      investigate_predictionsSaved: { question: "Predictions saved", answer: "yes" },
      investigate_outcome: { question: "Did the program behave as predicted?", value: "match", answer: "✅ Yes, it matched my prediction.", reflection: "The sprite moved exactly as I predicted." },
      evidence_ev1: { question: EVIDENCE_PROMPTS[0].label, answer: "pressing the space key" },
      evidence_ev2: { question: EVIDENCE_PROMPTS[1].label, answer: "running the movement blocks in order" },
      evidence_ev3: { question: EVIDENCE_PROMPTS[2].label, answer: "the sprite moves and says Hello" },
      evidence_ev4: { question: EVIDENCE_PROMPTS[3].label, answer: "the key that starts the action" },
      evidence_ev5: { question: EVIDENCE_PROMPTS[4].label, answer: "running the program and pressing the key" },
      evidence_ev6: { question: EVIDENCE_PROMPTS[5].label, answer: "the sprite moved too far so I reduced the steps" },
      plenary_p1: { question: PLENARY_QS[0].label, answer: "Save in the agreed folder with a clear filename." },
      plenary_p2: { question: PLENARY_QS[1].label, answer: "It protects my work so I can find it next lesson." },
      plenary_p3: { question: PLENARY_QS[2].label, answer: "Pressing the space key." },
      plenary_p4: { question: PLENARY_QS[3].label, answer: "The sprite moved and said a message." },
      plenary_p5: { question: PLENARY_QS[4].label, answer: "I changed the key that starts the action." },
      plenary_p6: { question: PLENARY_QS[5].label, answer: "Debugging when something unexpected happens." }
    };
    ROUTINE_CARDS.forEach(function (c) { state.routineSort[c.id] = c.zone; });
    for (let i = 0; i < MOD_CHECKLIST.length; i++) { state.checklist["m" + i] = true; }
    state.fileSim = { step: 8, done: true, saved: true, realSkipped: true, tree: { name: "Documents", folders: [{ name: TARGET_FOLDER_1, files: [], folders: [{ name: TARGET_FOLDER_2, files: [], folders: [{ name: "Sample Student", folders: [], files: [{ name: TARGET_FILENAME }] }] }] }], files: [] } };
    state.confidence = "green";
    state.finishedAt = new Date().toISOString();
    S.save();
  }

  /* ======================= HEADER WIRING ======================= */

  function wireChrome() {
    $("#btnLearningPanel").addEventListener("click", function () {
      const p = $("#learningPanel");
      const open = !p.hidden;
      p.hidden = open;
      this.setAttribute("aria-expanded", String(!open));
      if (!open) { $("#closeLearningPanel").focus(); }
    });
    $("#closeLearningPanel").addEventListener("click", function () {
      $("#learningPanel").hidden = true;
      $("#btnLearningPanel").setAttribute("aria-expanded", "false");
      $("#btnLearningPanel").focus();
    });
    $("#btnMap").addEventListener("click", function () { go("map"); });
    $("#btnSupport").addEventListener("click", function () { go("support"); });
    $("#btnMute").addEventListener("click", function () {
      state.settings.muted = !state.settings.muted;
      S.save();
      updateChrome();
      toast(state.settings.muted ? "Sound off." : "Sound on.", state.settings.muted ? "🔇" : "🔊");
    });
  }

  /* ======================= BOOT ======================= */

  function boot() {
    document.body.classList.toggle("reduced-motion", !!state.settings.reducedMotion);
    wireChrome();

    // teacher mode entry
    const params = new URLSearchParams(location.search);
    if (params.get("teacher") === "1" && CFG.ENABLE_TEACHER_MODE) {
      if (sessionStorage.getItem("labLaunch_teacher") === "1") {
        teacherMode = true;
      } else {
        openModal(function (m) {
          m.appendChild(el("h2", { text: "Teacher access" }));
          m.appendChild(el("p", { text: "Enter the teacher passcode from config.js." }));
          const inp = el("input", { type: "password", class: "plain-input", "aria-label": "Teacher passcode" });
          m.appendChild(inp);
          const err = el("div", { class: "field-error", "aria-live": "polite" });
          m.appendChild(err);
          const okB = el("button", { type: "button", class: "btn", text: "Enter" });
          const cancelB = el("button", { type: "button", class: "btn btn-secondary", text: "Cancel" });
          function tryPass() {
            if (inp.value === (CFG.TEACHER_PASSCODE || "")) {
              sessionStorage.setItem("labLaunch_teacher", "1");
              teacherMode = true;
              closeModal();
              if (state.student.name) { go("map"); } else { state.student = { name: "Teacher Preview", className: "STAFF", avatar: "viola" }; state.profile = { lang: "full", typing: "full" }; S.save(); go("map"); }
            } else {
              err.textContent = "Incorrect passcode.";
            }
          }
          okB.addEventListener("click", tryPass);
          inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { tryPass(); } });
          cancelB.addEventListener("click", function () { closeModal(); startNormally(); });
          m.appendChild(el("div", { class: "modal-actions" }, [okB, cancelB]));
        });
        return;
      }
    }
    startNormally();
  }

  function startNormally() {
    if (teacherMode) { go("map"); return; }
    if (!state.student.name) { go("landing"); return; }
    if (!state.profile.lang || !state.profile.typing) { go("support"); return; }
    // recover after refresh: return to the mission map with progress intact
    go("map");
    if (state.completed.length > 2 && !isDone("plenary")) {
      toast("Welcome back, " + state.student.name.split(" ")[0] + " — your progress was saved.", "💾");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
