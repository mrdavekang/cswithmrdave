"use strict";

const stateKey = "csmd-year9-feature-playground-v1";
const mitUrl = "https://ai2.appinventor.mit.edu/";
const starter = "assets/Year9_WAGOLL_Studio.aia";
const main = document.querySelector("#main-content");
const sidebar = document.querySelector("#sidebar");
const language = document.querySelector("#language");
const opening = new Set(["start", "do-now", "types"]);
const jumps = new Set(["build-steps", "try", "save"]);
const stageIds = new Set(lesson.stages.map(([id]) => id));
const lessonMinutes = 60 * 60 * 1000;
const secondFeatureMinutes = 30 * 60 * 1000;
const nextFeatureRoute = "choose-next";
document.querySelector(".language").insertAdjacentHTML("beforebegin",
  '<div id="lesson-clock" class="lesson-clock" role="timer" aria-label="Time left" hidden>' +
  '<span id="clock-label">Time left</span><strong id="clock-time">60:00</strong></div>');
const clock = document.querySelector("#lesson-clock");
const editorSizes = {
  "add-button-en.png": [1320, 1046], "canvas-palette-en.png": [1320, 1021],
  "draw-blocks.webp": [676, 195], "draw-clear-block.webp": [275, 74], "draw-designer.webp": [619, 289],
  "export-menu.webp": [332, 301], "gallery-picture.webp": [361, 270], "gallery-tree.webp": [219, 463],
  "game-designer.webp": [616, 271], "game-hit.webp": [501, 209], "game-reset.webp": [451, 107],
  "screen-add.webp": [264, 45], "screen-back.webp": [238, 86], "screen-blocks.webp": [432, 86],
  "sketch-sheet.webp": [840, 704], "test-menu.webp": [269, 106],
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(stateKey) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

const stored = loadState();
const savedStudent = stored.student;
const state = {
  student: savedStudent && typeof savedStudent.name === "string" && savedStudent.name.trim() &&
    typeof savedStudent.form === "string" && savedStudent.form.trim() &&
    Number.isFinite(savedStudent.startedAt) && savedStudent.startedAt > 0 ? savedStudent : null,
  secondRound: stored.secondRound === true,
  nextFeature: lesson.features.some(({ id }) => id === stored.nextFeature) ? stored.nextFeature : "",
  language: stored.language === "bi" ? "bi" : "en",
  feature: lesson.features.some(({ id }) => id === stored.feature) ? stored.feature : "",
  sketch: stored.sketch === true,
  focus: stored.focus || "",
  phase: stored.phase || "",
  results: { ...stored.results },
  positions: { ...stored.positions },
};
let route = "";
let group = "";
let scrollTimer;

function storeState() {
  try {
    localStorage.setItem(stateKey, JSON.stringify(state));
  } catch {
    // The lesson still works when browser storage is unavailable.
  }
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[ch]);

function bilingual(en, zh) {
  return escapeHtml(en) + (state.language === "bi" && zh
    ? '<span class="translation" lang="zh-Hans">' + escapeHtml(zh) + "</span>" : "");
}

function text(pair) {
  return bilingual(...pair);
}

function rich([en, zh]) {
  // Lesson HTML comes from the authored content file. Student responses are never inserted as HTML.
  return en + (state.language === "bi" ? '<span class="translation" lang="zh-Hans">' + zh + "</span>" : "");
}

const stage = (id) => lesson.stages.find((item) => item[0] === id);
const feature = () => lesson.features.find((item) => item.id === state.feature);
const stageOf = (id) => id === nextFeatureRoute ? "choose" : jumps.has(id) ? "build" : id;
const workspaceOf = (id) => opening.has(id) ? "opening" : jumps.has(id) ? "build" : id;
const isLessonRoute = (id) => stageIds.has(id) || jumps.has(id) || id === nextFeatureRoute;

function remainingTime(now = Date.now()) {
  return state.student ? Math.max(0, Math.min(lessonMinutes, state.student.startedAt + lessonMinutes - now)) : 0;
}

function completedFeatures() {
  return lesson.features.filter(({ id }) => state.results[id] === "works").length;
}

function canBuildAnother(time = remainingTime()) {
  return time >= secondFeatureMinutes && state.results[state.feature] === "works" && completedFeatures() === 1;
}

function updateClock() {
  clock.hidden = !state.student;
  if (!state.student) return;
  const time = remainingTime();
  const seconds = Math.ceil(time / 1000);
  const digits = [Math.floor(seconds / 60), seconds % 60].map((n) => String(n).padStart(2, "0")).join(":");
  const label = time ? (state.language === "bi" ? "Time left · 剩余时间" : "Time left")
    : (state.language === "bi" ? "Time’s up · 时间到" : "Time’s up");
  const clockLabel = clock.querySelector("#clock-label");
  const clockTime = clock.querySelector("#clock-time");
  if (clockLabel.textContent !== label) clockLabel.textContent = label;
  if (clockTime.textContent !== digits) clockTime.textContent = digits;
  clock.classList.toggle("clock-ended", !time);
  const eligible = canBuildAnother(time);
  for (const element of main.querySelectorAll("[data-second-feature]")) element.hidden = !eligible;
}

function button(href, en, zh, primary = false, external = false) {
  return '<a class="btn' + (primary ? " primary" : "") + '" href="' + href + '"' +
    (external ? ' target="_blank" rel="noopener noreferrer"' : "") + '><span>' +
    bilingual(en, zh) + "</span></a>";
}

function stepsNav(active) {
  return '<ol class="stage-list">' + lesson.stages.map(([id, label, short], i) => {
    const content = '<span class="stage-index" aria-hidden="true">' + (i + 1) + '</span><span>' +
      bilingual(label[0] + (short ? " · " + short[0] : ""), label[1] + (short ? " · " + short[1] : "")) + "</span>";
    if (!state.student && id !== "start") return '<li><span class="stage-label">' + content + "</span></li>";
    return '<li><a href="#' + id + '"' + (id === active ? ' aria-current="step"' : "") + '>' + content + '</a></li>';
  }).join("") + "</ol>";
}

function showNav() {
  const active = stageOf(route);
  const label = stage(active)[1];
  const list = stepsNav(active);
  sidebar.innerHTML = '<div class="desktop-nav"><nav aria-label="Lesson steps"><p class="nav-title">' +
    bilingual("Lesson steps", "课堂步骤") + "</p>" + list + '</nav><div class="side-goal"><p class="eyebrow">WAGBA</p><p>' +
    text(lesson.wagba) + '</p></div></div><details class="mobile-nav"><summary>' +
    bilingual("You are here · " + label[0], "当前步骤 · " + label[1]) +
    '</summary><nav aria-label="Lesson steps">' + list + "</nav></details>";
}

function asset(image, eager = false) {
  const [width, height] = editorSizes[image.file] || [374, 624];
  return '<img src="assets/' + image.file + '" alt="' + escapeHtml(image.alt[0]) + '"' +
    ' width="' + width + '" height="' + height + '"' +
    (eager ? "" : ' loading="lazy"') + ' decoding="async">';
}

function editorShot(image) {
  if (!image) return "";
  return '<figure class="editor-shot">' + asset(image) + "<figcaption>" + text(image.alt) + "</figcaption></figure>";
}

function model(item, hero = false) {
  return '<div class="model-panel tone-' + item.tone + '"><div class="model-heading"><p class="eyebrow">' +
    bilingual("What a good one looks like", "优秀示例") + "</p><h3>" + text(item.model) +
    '</h3></div><div class="phones">' + item.frames.map((frame) =>
      '<figure class="phone">' + asset(frame, hero) + "<figcaption>" + text(frame.caption) +
      (frame.illustrated ? '<span class="image-note">' + bilingual("Illustrated result", "效果示意") + "</span>" : "") +
      "</figcaption></figure>").join("") + '</div><p class="why">' +
    rich(["<strong>Why it works</strong> " + escapeHtml(item.why[0]),
      "<strong>设计亮点</strong> " + escapeHtml(item.why[1])]) + "</p></div>";
}

function tiles(interactive = false, second = false) {
  return '<div class="feature-grid">' + lesson.features.filter(({ id }) => !second || state.results[id] !== "works").map((item) => {
    const preview = item.frames[item.frames.length === 3 ? 1 : item.frames.length - 1];
    const chosen = (second ? state.nextFeature : state.feature) === item.id;
    const contents = '<span class="thumbnail">' + asset(preview) + '</span><span class="feature-model">' +
      text(item.model) + '</span><span class="feature-title">' + text(item.title) +
      '</span><span class="finish">' + text(item.finish) + '</span>' +
      (interactive ? '<span class="select-label">' + (chosen ? bilingual("Selected", "已选择") : bilingual("Choose", "选择")) + "</span>" : "");
    return interactive
      ? '<button class="feature-tile tone-' + item.tone + '" type="button" data-feature="' + item.id + '" aria-pressed="' + chosen + '">' + contents + "</button>"
      : '<article class="feature-tile tone-' + item.tone + '">' + contents + "</article>";
  }).join("") + "</div>";
}

function choices(group, items, isPhase = false) {
  return '<div class="choice-grid' + (isPhase ? " phase" : "") + '" data-choice-group="' + group + '">' +
    items.map(([id, label, detail]) =>
      '<button class="choice" type="button" data-choice="' + id + '" aria-pressed="' +
      (state[group] === id) + '"><span class="choice-head">' + text(label) +
      '</span><span class="choice-copy">' + text(detail) + "</span></button>").join("") + "</div>";
}

function landingControls() {
  if (!state.student) {
    return '<form class="student-form" id="student-form"><div class="student-fields"><label for="student-name">' +
      bilingual("Name", "姓名") + '<input id="student-name" name="name" autocomplete="name" maxlength="80" required></label>' +
      '<label for="student-class">' + bilingual("Class", "班级") +
      '<input id="student-class" name="form" placeholder="9E" maxlength="20" required></label></div>' +
      '<p id="start-note">' + bilingual("The 60-minute timer starts when you select Start lesson. Your details stay in this browser.", "点击开始课堂后，60 分钟倒计时开始。你的资料只保存在此浏览器。") +
      '</p><p id="student-error" class="form-error" role="alert" hidden>' + bilingual("Enter your name and class to begin.", "请输入姓名和班级后再开始。") +
      '</p><button class="btn primary" type="submit" aria-describedby="start-note"><span>' + bilingual("Start lesson", "开始课堂") + '</span></button></form>';
  }
  return '<div class="student-session"><p><strong>' + escapeHtml(state.student.name) + '</strong> · ' + escapeHtml(state.student.form) + '</p>' +
    button("#do-now", "Go to the Do Now", "前往课堂热身", true) +
    '<details class="help"><summary>' + bilingual("New student?", "换同学了？") + '</summary><p>' +
    bilingual("Start a fresh session for a different student. This clears the name, class, timer and lesson choices in this browser.", "为另一位同学开始新课堂。此操作会清除此浏览器中的姓名、班级、倒计时和课堂选择。") +
    '</p><button id="restart-session" class="btn" type="button"><span>' + bilingual("Start a new student session", "开始新同学的课堂") + '</span></button></details></div>';
}

function intro() {
  return '<section class="hero" id="start" aria-labelledby="intro-heading"><div class="hero-copy">' +
    '<p class="eyebrow">' + bilingual("Year 9 Practical · 60 minutes", "九年级实践课 · 60 分钟") + '</p>' +
    '<h1 id="intro-heading" tabindex="-1">' + text(lesson.name) + '</h1><p class="lead">' + text(lesson.goal) +
    '</p><div class="goal-note"><p class="eyebrow">WAGBA · ' + bilingual("What we are getting better at", "今天提升的能力") +
    '</p><p>' + text(lesson.wagba) + "</p></div>" +
    landingControls() +
    '</div>' + model(lesson.features[0], true) + '</section>' +
    '<section class="section" aria-labelledby="models-heading"><div class="section-top"><h2 id="models-heading">' +
    bilingual("Four ideas you can adapt", "四个可以改用的功能") + '</h2><p>' +
    bilingual("Look at the finished phone screens. In Main Task 1 you’ll choose one feature for your own topic.", "先看完成后的手机画面。在主任务一，为自己的主题选一个功能。") +
    "</p></div>" + tiles() + '</section>' + (!state.student ? "" :
    '<section class="activity-card" id="do-now"><div class="do-now-demo"><div><p class="eyebrow">' + bilingual("Read First and Do Now · first 7 minutes", "先看示例和课堂热身 · 前 7 分钟") +
    '</p><h2 tabindex="-1">' + bilingual("Do Now · Spot the action", "现在做 · 找出用户操作") + '</h2><p>' +
    bilingual("Look at the Club Finder screens here. Point to what the user taps and tell a partner what changes. You can say it in English or Mandarin.", "看这里的社团查询画面。指出用户点击哪里，和同伴说说点击后有什么变化。可以用英语或中文。") +
    '</p><p class="prompt">' + bilingual("Then get your sketch ready below.", "然后准备好草图，步骤见下方。") + '</p></div>' +
    model(lesson.features[0]) + '</div><div class="sketch-grid"><div class="card"><h3>' + bilingual("Have your sketch?", "有上节课的草图吗？") +
    '</h3><p>' + bilingual("Put it beside you. Point to one feature you could make today.", "把草图放在旁边，指出今天想做的一个功能。") +
    '</p></div><div class="card"><h3>' + bilingual("Need a sketch sheet?", "需要草图纸吗？") +
    '</h3><p>' + bilingual("Collect Section B from your teacher. Sketch just one feature in the first two boxes. Show what the user sees before and after the action.", "向老师领取 B 部分的草图纸。只画一个功能，用前两个框画出用户操作前后的画面。") +
    '</p>' + asset(picture("sketch-sheet.webp", "Blank Section B planning sheet with before and after phone boxes", "B 部分空白草图纸，有操作前后的手机框")) +
    '</div></div><label class="readiness"><input type="checkbox" id="sketch-ready"' + (state.sketch ? " checked" : "") +
    '><span>' + bilingual("I have my sketch beside me", "我已把草图放在旁边") + '</span></label>' +
    '<div class="actions">' + button("#types", "Go to Types of Learning", "前往学习类型", true) + '</div></section>' +
    '<section class="activity-card" id="types"><p class="eyebrow">WAGBA</p><h2 tabindex="-1">' +
    bilingual("Types of Learning", "学习类型") + '</h2><p>' +
    bilingual("Which would help you most with today’s feature? Pick one if it helps you get started.", "今天制作功能时，你最需要哪一种帮助？可以选一项。") +
    '</p>' + choices("focus", lesson.ksu) +
    '<div class="actions">' + button("#choose", "Choose my feature", "选择我的功能", true) + "</div></section>");
}

function stageHead(label, labelZh, title, titleZh, en, zh) {
  return '<header class="stage-head"><p class="eyebrow">' + bilingual(label, labelZh) +
    '</p><h1 tabindex="-1">' + bilingual(title, titleZh) + '</h1><p class="lead">' + bilingual(en, zh) + "</p></header>";
}

function stageFooter(back, backEn, backZh, next, nextEn, nextZh) {
  return '<div class="stage-footer">' + button(back, backEn, backZh) + button(next, nextEn, nextZh, true) + "</div>";
}

function selection(second = false) {
  const item = second ? lesson.features.find(({ id }) => id === state.nextFeature) : feature();
  if (!item || (second && state.results[item.id] === "works")) {
    return '<div class="card"><p>' + bilingual("Pick one card above to see your first action.", "选择上方的一张卡片，就能看到第一步。") + "</p></div>";
  }
  return '<div class="card choice-panel"><p class="eyebrow">' + bilingual("My feature", "我的功能") +
    '</p><h2>' + text(item.title) + '</h2><p>' + text(item.intro) + '</p><p><strong>' + bilingual("First action", "第一步") +
    '</strong></p><p>' + text(item.first) + '</p><div class="actions">' +
    button("#build", "Build my feature", "制作我的功能", true) + "</div></div>";
}

function choose(second = false) {
  const heading = second ? stageHead("Main Task 1 · Second feature", "主任务一 · 第二个功能", "Choose a second feature", "选择第二个功能",
    "Keep the first feature in your app. Pick a different one below and add it to the same MIT project.", "保留应用里的第一个功能，再从下方选择另一个功能，加入同一个 MIT 项目。")
    : stageHead("Main Task 1 · 13 minutes", "主任务一 · 13 分钟", "Choose one feature", "选择一个功能",
      "Look at your sketch and pick one feature below. Keep your own app’s topic, pictures and words.", "看你的草图，从下方选一个功能。保留你自己的主题、图片和文字。");
  return heading + '<section class="section" aria-label="Choose one feature">' + tiles(true, second) +
    '</section><div id="my-choice" tabindex="-1" aria-live="polite">' + selection(second) +
    '</div><div class="stage-footer">' + (second ? button("#save", "Back to my guide", "返回我的指南")
      : button("#types", "Back to Types of Learning", "返回学习类型")) + "</div>";
}

function chooseFirst() {
  return '<section class="card section"><h2>' + bilingual("Choose your feature first", "先选择你的功能") +
    '</h2><p>' + bilingual("Main Task 1 shows four examples. Choose one and we’ll open the matching guide.", "主任务一有四个示例。选一个，就会打开对应指南。") +
    '</p><div class="actions">' + button("#choose", "Go to Main Task 1", "前往主任务一", true) + "</div></section>";
}

function projectHelp() {
  return '<details class="help"><summary>' + bilingual("Need to open a project?", "需要打开项目吗？") +
    '</summary><p>' + bilingual("Use the same MIT App Inventor account or workspace you used in class. Open your app from the project list.", "用上课时的 MIT App Inventor 账号或工作区，在项目列表里打开自己的应用。") +
    '</p><p>' + bilingual("Have an .aia file? Choose Projects > Import project (.aia) from my computer and select your file. Starting from scratch? Choose Projects > Start new project and give it a short name, such as MyApp.", "有 .aia 文件？选择 Projects > Import project (.aia) from my computer，再选文件。需要新建？选择 Projects > Start new project，取个短名字，例如 MyApp。") +
    '</p><p>' + bilingual("The example file opens as a separate project. It contains all four models if you want to look at their blocks.", "示例文件会作为单独的项目打开。里面有四个示例，可以查看它们的积木。") +
    '</p><div class="actions"><a class="btn" href="' + starter + '" download><span>' +
    bilingual("Download the four MIT examples (.aia)", "下载四个 MIT 示例（.aia）") + "</span></a></div></details>";
}

function instruction(item, i) {
  return '<li class="instruction" id="build-step-' + (i + 1) + '"><span class="step-count" aria-hidden="true">' + (i + 1) +
    '</span><div><h3><span class="sr-only">Step ' + (i + 1) + '. </span>' + text(item.title) +
    '</h3><p>' + rich(item.body) + '</p>' + editorShot(item.visual) + "</div></li>";
}

function results(item) {
  const options = [
    ["works", item.id === "gallery" ? ["Fits in Designer", "在 Designer 中显示正常"] : ["It worked", "成功了"]],
    ["fix", ["I need to fix it", "需要修正"]],
    ...(item.id === "gallery" ? [] : [["unavailable", ["Tester unavailable", "测试器无法使用"]]]),
  ];
  return '<div class="result-choices" data-choice-group="result">' + options.map(([id, label]) =>
    '<button class="choice" type="button" data-choice="' + id + '" aria-pressed="' +
    (state.results[item.id] === id) + '"><span>' + text(label) + "</span></button>").join("") + "</div>";
}

function tryFeature(item) {
  const isGallery = item.id === "gallery";
  const how = isGallery
    ? bilingual("Use the Designer phone preview for this layout check.", "这个布局检查用 Designer 的手机预览即可。")
    : bilingual("In Chrome, choose Connect > Test in Web (Beta) in MIT App Inventor. Use the new window to try your feature.", "用 Chrome 打开 MIT App Inventor，选择 Connect > Test in Web (Beta)，在新窗口测试功能。");
  const fallback = isGallery ? "" : '<div class="notice"><strong>' + bilingual("Blank test window?", "测试窗口空白？") +
    '</strong><p>' + bilingual("Close it and retry once. If it stays blank, save your work and select Tester unavailable below. You can still compare your Designer preview and blocks with the guide.", "关闭后再试一次。如果仍为空白，保存作品并选择下方的 Tester unavailable。你仍可以把 Designer 的预览和积木与指南对照。") +
    '</p></div>';
  return '<section class="activity-card" id="try"><h2 tabindex="-1">' + bilingual("Try it · One finish check", "试一试 · 一项完成检查") +
    '</h2><p>' + how + '</p><p class="prompt">' + text(item.check) + '</p>' +
    (isGallery ? "" : editorShot(picture("test-menu.webp", "Connect menu with Test in Web highlighted", "Connect 菜单中的 Test in Web 已标出"))) +
    fallback + '<details class="help"><summary>' + bilingual("The feature didn’t do what I expected", "功能没有按预期运行") +
    '</summary><p>' + text(item.fix) + '</p></details>' + results(item) +
    '<div class="notice" data-second-feature hidden><p>' + bilingual("You have at least 30 minutes left. Save this feature, then choose another one to add to the same app.", "你还剩至少 30 分钟。保存这个功能，再为同一个应用选择另一个功能。") +
    '</p><div class="actions">' + button("#save", "Go to save steps", "前往保存步骤", true) + '</div></div></section>';
}

function saveSection() {
  return '<section class="activity-card" id="save"><h2 tabindex="-1">' + bilingual("Save your app", "保存你的应用") +
    '</h2><ol class="plain-list"><li>' + bilingual("In MIT App Inventor, choose Projects > Save project.", "在 MIT App Inventor 中，选择 Projects > Save project。") +
    '</li><li>' + bilingual("Choose Projects > Export selected project (.aia) to my computer. Find the .aia file in Downloads and keep it for the next lesson.", "选择 Projects > Export selected project (.aia) to my computer。在 Downloads 找到 .aia 文件，留到下一课使用。") +
    '</li></ol><div class="notice" data-second-feature hidden><h3>' + bilingual("Build a second feature", "制作第二个功能") +
    '</h3><p>' + bilingual("Once you’ve saved, choose a different feature and add it to the same MIT project.", "保存后，选择另一个功能，并添加到同一个 MIT 项目。") +
    '</p><div class="actions">' + button("#" + nextFeatureRoute, "Choose a second feature", "选择第二个功能", true) + '</div></div>' +
    editorShot(picture("export-menu.webp", "Projects menu with Export selected project (.aia) marked", "Projects 菜单中标出了导出 .aia 的选项")) + '</section>';
}

function build() {
  const item = feature();
  const heading = stageHead("Main Task 2 · 30 minutes", "主任务二 · 30 分钟", "Build it in your app", "在自己的应用里制作",
    item ? "Keep your existing app and follow the guide for your chosen feature." : "Open a guide for one feature.", "在自己原来的应用里，跟着所选功能的指南制作。");
  if (!item) return heading + chooseFirst();
  return heading +
    '<div class="build-top"><section class="card first-action"><p class="eyebrow">' + bilingual("Your feature", "你的功能") +
    '</p><h2>' + text(item.title) + '</h2><p><strong>' + bilingual("First action", "第一步") +
    '</strong></p><p>' + text(item.first) + '</p><p>' +
    bilingual("Open MIT in Chrome. Pick your existing project and return to this tab for the guide.", "用 Chrome 打开 MIT，选择自己的已有项目，再返回此标签页看指南。") +
    '</p><div class="actions">' + button(mitUrl, "Open MIT App Inventor ↗", "打开 MIT App Inventor ↗", true, true) +
    '</div>' + projectHelp() + '</section>' + model(item) + '</div>' +
    '<nav class="jump-links" aria-label="Jump within the build guide">' +
    '<a href="#build-steps"><span>' + bilingual("Build steps", "制作步骤") + '</span></a>' +
    '<a href="#try"><span>' + bilingual("Try it", "试一试") + '</span></a>' +
    '<a href="#save"><span>' + bilingual("Save", "保存") + '</span></a></nav>' +
    '<section class="section" id="build-steps"><h2 tabindex="-1">' + bilingual("Build steps", "制作步骤") +
    '</h2><ol class="steps">' + item.steps.map(instruction).join("") + '</ol></section>' +
    tryFeature(item) + saveSection() +
    '<div class="stage-footer">' + button("#choose", "Change my feature", "更换我的功能") +
    '<div class="actions">' + button("#extension", "I have extra time", "我还有时间") +
    button("#pitstop", "Go to Learning Pit Stop", "前往学习停靠站", true) + "</div></div>";
}

function galleryExtension() {
  const projects = [
    {
      id: "a97c4135-4078-4e2b-a683-8532e33df233", name: ["Mole Mash", "打地鼠"],
      status: ["Played in Chrome", "已在 Chrome 中试玩"],
      task: ["Tap the mole once. Watch it move and check the score.", "点击地鼠一次。看看它移动到哪里，并查看分数。"],
      idea: ["Move your own target after a hit.", "点中目标后，让你的目标移动。"],
    },
    {
      id: "8e9cbf6b-f559-46e6-a443-59ee046ebfdf", name: ["Drawing App", "图片画板"],
      status: ["Pictures and dots tested", "已测试换图和点画"],
      task: ["Choose Next to see the duck. Click on the picture to add dots. Dragging and clearing were unreliable in the Chrome test.", "点击 Next 查看鸭子的图片。点击图片可以画点。在 Chrome 的测试中，拖动画线和清除不稳定。"],
      idea: ["Use a picture as the background for a drawing pad.", "用一张图片作为画板背景。"],
    },
    {
      id: "556bcee4-ce8f-44a3-8c5b-32834dcfe152", name: ["Memory Game", "记忆配对游戏"],
      status: ["Preview only in this Chrome test", "本次 Chrome 测试仅能预览"],
      task: ["The tile grid opened, but tapping the tiles did not reveal a pair. Explore how the app arranges its tiles.", "可以看到卡片网格，但点击后没有翻开配对图案。观察应用怎样排列卡片。"],
      idea: ["Make a picture in your gallery reveal a detail when tapped.", "点击你展示区里的一张图片，显示更多信息。"],
      previewOnly: true,
    },
  ];
  return '<section class="activity-card" aria-labelledby="gallery-heading"><h2 id="gallery-heading">' +
    bilingual("Try one Gallery app", "试一个作品库应用") + '</h2><p>' +
    bilingual("Pick a card. Try one action and see what changes. Which idea could you use in your own app?", "选一张卡片，试一个操作，看看发生了什么变化。哪一个想法可以用到你自己的应用里？") +
    '</p><details class="help" open><summary>' + bilingual("How to play in Chrome without an account", "怎样在 Chrome 中免账号试玩") +
    '</summary><ol class="plain-list"><li>' + bilingual("First time? Open the account-free editor and choose Continue Without An Account if asked. Then return here.", "第一次使用？打开免账号编辑器，如果出现提示，选择 Continue Without An Account。然后回到此页。") +
    '</li><li>' + bilingual("Open one example in MIT. Choose Connect > Test in Web (Beta). Give the new window time to load.", "在 MIT 中打开一个示例。选择 Connect > Test in Web (Beta)，等待新窗口载入。") +
    '</li><li>' + bilingual("If the tester stays blank, use the public Gallery listing to explore the idea.", "如果测试窗口一直空白，可以看公开的作品库页面了解这个想法。") +
    '</li></ol><div class="actions">' + button("https://code.appinventor.mit.edu/", "Open account-free editor ↗", "打开免账号编辑器 ↗", false, true) +
    '</div></details><div class="gallery-grid">' + projects.map((project) => {
      const open = button("https://code2.appinventor.mit.edu/?ng=" + project.id,
        project.previewOnly ? "Preview in MIT ↗" : "Open in MIT ↗", project.previewOnly ? "在 MIT 中预览 ↗" : "在 MIT 中打开 ↗",
        !project.previewOnly, true);
      const listing = button("https://gallery.appinventor.mit.edu/?galleryid=" + project.id,
        "View Gallery listing ↗", "查看作品库页面 ↗", project.previewOnly, true);
      return '<article class="card gallery-card"><p class="eyebrow">' + text(project.status) + '</p><h3>' + text(project.name) +
        '</h3><p>' + text(project.task) + '</p><p><strong>' + bilingual("Idea to borrow", "可以借鉴的想法") + '</strong> ' + text(project.idea) +
        '</p><div class="actions">' + (project.previewOnly ? listing + open : open + listing) + '</div></article>';
    }).join("") + '</div></section>';
}

function extension() {
  const item = feature();
  return stageHead("Extension · If you have time", "拓展挑战 · 有时间再做", "Explore or improve", "探索或改进",
    "Try one Gallery example or make one useful improvement to the feature you built.", "试一个作品库示例，或对自己做的功能进行一项有用的改进。") +
    galleryExtension() +
    (item ? '<section class="activity-card"><h2>' + bilingual("Improve my feature", "改进我的功能") + '</h2><h3>' + text(item.title) + '</h3><p>' + rich(item.extra) +
      '</p>' + editorShot(item.extraVisual) + '</section>' : "") +
    stageFooter("#build", "Back to my guide", "返回我的指南", "#pitstop", "Go to Learning Pit Stop", "前往学习停靠站");
}

function pitstop() {
  const item = feature();
  return stageHead("Learning Pit Stop", "学习停靠站", "How did the build feel?", "制作时感觉怎样？",
    "Choose the description that fits the feature you worked on.", "选一句最符合你制作这个功能时的感受的话。") +
    '<section class="activity-card"><h2>' + (item ? text(item.title) : bilingual("My feature", "我的功能")) +
    '</h2>' + choices("phase", lesson.phases, true) + '</section>' +
    stageFooter("#build", "Back to my guide", "返回我的指南", "#plenary", "Go to Plenary", "前往总结");
}

function plenary() {
  return stageHead("Plenary", "总结", "Show what changed", "展示你的改动",
    "Show a partner your feature or point to the part you built. Use one short sentence.", "把功能展示给同伴，或指出你制作的部分。用一句简短的话说明。") +
    '<section class="activity-card"><h2>' + bilingual("One sentence is enough", "一句话就够了") +
    '</h2><p class="prompt">' + bilingual("I added ___ so the user can ___.", "我添加了 ___，所以用户可以 ___。") +
    '</p><p>' + bilingual("Before you close MIT App Inventor, check that you saved your project and kept the .aia file.", "关闭 MIT App Inventor 前，确认已保存项目，并保留 .aia 文件。") +
    '</p><div class="actions">' + button("#save", "Go to the save steps", "查看保存步骤", true) + "</div></section>";
}

const views = { opening: intro, choose, [nextFeatureRoute]: () => choose(true), build, extension, pitstop, plenary };

function requestedRoute() {
  const id = location.hash.slice(1);
  if (!state.student) return "start";
  if (id === nextFeatureRoute) {
    if (completedFeatures() !== 1 || (!state.secondRound && !canBuildAnother())) return "save";
    if (!state.secondRound) {
      state.secondRound = true;
      storeState();
    }
  }
  return isLessonRoute(id) ? id : "start";
}

function positionKey(id) {
  return workspaceOf(id) === "build" ? id + ":" + state.feature : id;
}

function rememberPosition() {
  if (route) {
    state.positions[positionKey(route)] = window.scrollY;
    storeState();
  }
}

function readingPoint() {
  const top = Math.max(document.querySelector(".topbar").getBoundingClientRect().bottom,
    document.querySelector(".mobile-nav").getBoundingClientRect().bottom) + 38;
  const items = main.querySelectorAll("section[id], li.instruction[id]");
  let point;
  for (const item of items) {
    const y = item.getBoundingClientRect().top;
    if (y <= top) point = { id: item.id, y };
  }
  return point;
}

function show({ restore = false, force = false, keepPosition = false } = {}) {
  const previousGroup = group;
  route = requestedRoute();
  group = workspaceOf(route);
  const position = window.scrollY;
  const point = keepPosition ? readingPoint() : null;
  language.value = state.language;
  document.querySelector("#skip").textContent = state.language === "bi" ? "Skip to lesson / 跳到课堂内容" : "Skip to lesson";
  showNav();
  if (force || previousGroup !== group) main.innerHTML = views[group]();
  updateClock();

  const target = document.getElementById(route);
  if (keepPosition) {
    const marker = point && document.getElementById(point.id);
    window.scrollTo(0, marker ? window.scrollY + marker.getBoundingClientRect().top - point.y : position);
    return;
  }
  if (restore && Number.isFinite(state.positions[positionKey(route)])) {
    window.scrollTo(0, state.positions[positionKey(route)]);
    return;
  }
  if (target && route !== "start") target.scrollIntoView({ block: "start" });
  else window.scrollTo(0, 0);

  if (!restore) {
    const heading = (target || main).querySelector("h1, h2");
    heading?.focus({ preventScroll: true });
  }
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#restart-session")) {
    clearTimeout(scrollTimer);
    Object.assign(state, { student: null, feature: "", secondRound: false, nextFeature: "", sketch: false, focus: "", phase: "", results: {}, positions: {} });
    storeState();
    history.replaceState(null, "", "#start");
    show({ force: true });
    document.querySelector("#student-name").focus({ preventScroll: true });
    return;
  }
  const link = event.target.closest('a[href^="#"]');
  if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const id = link.getAttribute("href").slice(1);
    if (isLessonRoute(id)) {
      event.preventDefault();
      rememberPosition();
      const next = state.student ? id : "start";
      if (route === nextFeatureRoute && next === "build" && state.nextFeature && state.results[state.nextFeature] !== "works") {
        state.feature = state.nextFeature;
        storeState();
      }
      if (location.hash !== "#" + next) history.pushState(null, "", "#" + next);
      show();
      return;
    }
  }

  const pick = event.target.closest("[data-feature]");
  if (pick) {
    const second = route === nextFeatureRoute;
    const selected = pick.dataset.feature;
    state[second ? "nextFeature" : "feature"] = selected;
    storeState();
    for (const card of main.querySelectorAll("[data-feature]")) {
      const isSelected = card.dataset.feature === selected;
      card.setAttribute("aria-pressed", String(isSelected));
      card.querySelector(".select-label").innerHTML = isSelected
        ? bilingual("Selected", "已选择") : bilingual("Choose", "选择");
    }
    const panel = document.querySelector("#my-choice");
    panel.innerHTML = selection(second);
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({ block: "nearest" });
    return;
  }

  const choice = event.target.closest("[data-choice]");
  if (choice) {
    const container = choice.closest("[data-choice-group]");
    const field = container.dataset.choiceGroup;
    if (field === "result") state.results[state.feature] = choice.dataset.choice;
    else state[field] = choice.dataset.choice;
    for (const sibling of container.querySelectorAll("[data-choice]")) {
      sibling.setAttribute("aria-pressed", String(sibling === choice));
    }
    storeState();
    if (field === "result") updateClock();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "student-form") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const name = String(form.get("name")).trim();
  const formName = String(form.get("form")).trim();
  if (!name || !formName) {
    document.querySelector("#student-error").hidden = false;
    document.querySelector(name ? "#student-class" : "#student-name").focus();
    return;
  }
  state.student = { name, form: formName, startedAt: Date.now() };
  storeState();
  history.replaceState(null, "", "#do-now");
  show({ force: true });
});

document.addEventListener("change", (event) => {
  if (event.target === language) {
    state.language = language.value;
    storeState();
    show({ force: true, keepPosition: true });
  } else if (event.target.id === "sketch-ready") {
    state.sketch = event.target.checked;
    storeState();
  }
});

window.addEventListener("hashchange", () => {
  clearTimeout(scrollTimer);
  show({ restore: true });
});
window.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(rememberPosition, 110);
}, { passive: true });
window.addEventListener("pagehide", rememberPosition);
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
show({ restore: true });
window.setInterval(updateClock, 1000);
