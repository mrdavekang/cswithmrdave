(() => {
  "use strict";

  const card = document.getElementById("card");
  const footer = document.getElementById("footer-note");
  if (!card || !footer) return;
  const curated = window.CHECKPOINT_CURATED_PRACTICE === true ? window.LESSON : null;

  function el(tag, text, className, attrs = {}) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }

  function button(text, handler, className = "btn") {
    const node = el("button", text, className, {type: "button"});
    node.addEventListener("click", handler);
    return node;
  }

  function show(step, title, description, focus = false) {
    const h = el("h1", title, "", {id: "card-title", tabindex: "-1"});
    const label = curated ? curated.profile.name + " · YEAR 8T" : "YEAR 8T";
    card.replaceChildren(el("p", label + " · " + step, "eyebrow"), h, el("p", description, "card-copy"));
    footer.textContent = "This page has practice examples only. Your assessment feedback stays in Teams.";
    if (focus) h.focus();
  }

  function readFeedback(focus = false) {
    show(curated ? "BEFORE YOU START" : "STEP 1 OF 2", "Read your feedback in Teams first",
      "Keep this page open. Check your own scores and comments before answering the first reflection.", focus);
    const steps = el("ol", "", "feedback-steps");
    for (const instruction of [
      "In Teams, open Year 8T Computer Science and go to your own private channel.",
      "Open your checkpoint feedback. Read your scores and your teacher’s comments.",
      "Pick one skill you want to practise based on a comment. If you can’t see your feedback, ask Mr Dave before starting."
    ]) steps.append(el("li", instruction));
    const support = el("details", "", "");
    support.append(el("summary", "中文提示 · Mandarin support"), el("p", "先在 Teams 中打开 Year 8T Computer Science，再进入你自己的私人频道。阅读你的测验分数和老师的评语。选一个想练习的技能，再回来开始。如果找不到反馈，请先问老师。", "", {lang: "zh-Hans"}));
    const label = el("label", "", "feedback-confirm", {for: "feedback-read"});
    const confirm = el("input", "", "", {type: "checkbox", id: "feedback-read"});
    label.append(confirm, el("span", "I’ve read my scores and comments, and I have one skill in mind."));
    const actions = el("div", "", "card-actions");
    actions.append(el("a", "Open Teams ↗", "btn", {href: "https://teams.cloud.microsoft/", target: "_blank", rel: "noopener noreferrer"}));
    const next = button(curated ? "Start my reflection" : "Continue to practice", () => {
      if (!confirm.checked) return;
      if (curated) startLesson(curated);
      else choosePractice();
    }, "btn primary");
    next.disabled = true;
    confirm.addEventListener("change", () => { next.disabled = !confirm.checked; });
    actions.append(next);
    card.append(steps, el("p", "Use your feedback to pick a skill. Don’t copy your scores, report or submitted code into this app.", "helper-copy"), support, label, actions);
  }

  function startLesson(lesson) {
    window.startCheckpointLesson(lesson, {initialClass: "8T", hosted: true, beginDirect: true, selfSelected: true});
  }

  function choosePractice() {
    show("STEP 2 OF 2", "Choose what to practise", "Type your first name, then choose the practice that fits the feedback you read.", true);
    const name = el("input", "", "", {type: "text", id: "first-name", autocomplete: "off", maxlength: "32", placeholder: "Your first name only", "aria-describedby": "practice-note"});
    const status = el("p", "", "status", {id: "practice-status", role: "status"});
    const named = el("div", "", "name-fields");
    named.append(el("label", "First name", "form-label", {for: "first-name"}), name,
      el("p", "Your name stays on this device unless you hand in your own summary.", "helper-copy", {id: "practice-note"}));
    const choices = el("div", "", "class-choices");
    for (const [path, label, help] of [
      ["A", "Print and input", "Type and run short programs, one line at a time."],
      ["B", "Lists and decisions", "Practise list changes, test conditions and fix bugs."]
    ]) {
      const tile = button(null, () => openPractice(path), "class-tile");
      tile.append(el("strong", label), el("span", help));
      choices.append(tile);
    }
    const actions = el("div", "", "card-actions");
    actions.append(button("Back to Teams instructions", () => readFeedback(true)));
    card.append(named, choices, status, actions);

    function openPractice(path) {
      const firstName = name.value.normalize("NFC").trim().replace(/\s+/g, " ");
      if (!/^[\p{L}][\p{L}\p{M} ’'\-]{0,31}$/u.test(firstName)) {
        status.textContent = "Enter your first name using letters, then choose your practice.";
        name.setAttribute("aria-invalid", "true");
        name.focus();
        return;
      }
      const id = "practice-" + (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
      const lesson = window.makePublicPracticeLesson("8T", {id, name: firstName, path});
      startLesson(lesson);
    }
    name.addEventListener("input", () => { status.textContent = ""; name.removeAttribute("aria-invalid"); });
  }

  readFeedback();
})();
