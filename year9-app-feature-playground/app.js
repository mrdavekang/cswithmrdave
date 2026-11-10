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
const state = {
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
const stageOf = (id) => jumps.has(id) ? "build" : id;
const workspaceOf = (id) => opening.has(id) ? "opening" : stageOf(id);

function button(href, en, zh, primary = false, external = false) {
  return '<a class="btn' + (primary ? " primary" : "") + '" href="' + href + '"' +
    (external ? ' target="_blank" rel="noopener noreferrer"' : "") + '><span>' +
    bilingual(en, zh) + "</span></a>";
}

function stepsNav(active) {
  return '<ol class="stage-list">' + lesson.stages.map(([id, label, short], i) =>
    '<li><a href="#' + id + '"' + (id === active ? ' aria-current="step"' : "") +
    '><span class="stage-index" aria-hidden="true">' + (i + 1) + '</span><span>' +
    bilingual(label[0] + (short ? " · " + short[0] : ""), label[1] + (short ? " · " + short[1] : "")) +
    "</span></a></li>").join("") + "</ol>";
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

function tiles(interactive = false) {
  return '<div class="feature-grid">' + lesson.features.map((item) => {
    const preview = item.frames[item.frames.length === 3 ? 1 : item.frames.length - 1];
    const chosen = state.feature === item.id;
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

function intro() {
  return '<section class="hero" id="start" aria-labelledby="intro-heading"><div class="hero-copy">' +
    '<p class="eyebrow">' + bilingual("Year 9 Practical · 60 minutes", "九年级实践课 · 60 分钟") + '</p>' +
    '<h1 id="intro-heading" tabindex="-1">' + text(lesson.name) + '</h1><p class="lead">' + text(lesson.goal) +
    '</p><div class="goal-note"><p class="eyebrow">WAGBA · ' + bilingual("What we are getting better at", "今天提升的能力") +
    '</p><p>' + text(lesson.wagba) + "</p></div>" +
    button("#do-now", "Start the Do Now", "开始课堂热身", true) +
    '</div>' + model(lesson.features[0], true) + '</section>' +
    '<section class="section" aria-labelledby="models-heading"><div class="section-top"><h2 id="models-heading">' +
    bilingual("Four ideas you can adapt", "四个可以改用的功能") + '</h2><p>' +
    bilingual("Look at the finished phone screens. In Main Task 1 you’ll choose one feature for your own topic.", "先看完成后的手机画面。在主任务一，为自己的主题选一个功能。") +
    "</p></div>" + tiles() + '</section>' +
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
    '<div class="actions">' + button("#choose", "Choose my feature", "选择我的功能", true) + "</div></section>";
}

function stageHead(label, labelZh, title, titleZh, en, zh) {
  return '<header class="stage-head"><p class="eyebrow">' + bilingual(label, labelZh) +
    '</p><h1 tabindex="-1">' + bilingual(title, titleZh) + '</h1><p class="lead">' + bilingual(en, zh) + "</p></header>";
}

function stageFooter(back, backEn, backZh, next, nextEn, nextZh) {
  return '<div class="stage-footer">' + button(back, backEn, backZh) + button(next, nextEn, nextZh, true) + "</div>";
}

function selection() {
  const item = feature();
  if (!item) {
    return '<div class="card"><p>' + bilingual("Pick one card above to see your first action.", "选择上方的一张卡片，就能看到第一步。") + "</p></div>";
  }
  return '<div class="card choice-panel"><p class="eyebrow">' + bilingual("My feature", "我的功能") +
    '</p><h2>' + text(item.title) + '</h2><p>' + text(item.intro) + '</p><p><strong>' + bilingual("First action", "第一步") +
    '</strong></p><p>' + text(item.first) + '</p><div class="actions">' +
    button("#build", "Build my feature", "制作我的功能", true) + "</div></div>";
}

function choose() {
  return stageHead("Main Task 1 · 13 minutes", "主任务一 · 13 分钟", "Choose one feature", "选择一个功能",
    "Look at your sketch and pick one feature below. Keep your own app’s topic, pictures and words.", "看你的草图，从下方选一个功能。保留你自己的主题、图片和文字。") +
    '<section class="section" aria-label="Choose one feature">' + tiles(true) +
    '</section><div id="my-choice" tabindex="-1" aria-live="polite">' + selection() +
    '</div><div class="stage-footer">' + button("#types", "Back to Types of Learning", "返回学习类型") + "</div>";
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
    '</summary><p>' + text(item.fix) + '</p></details>' + results(item) + "</section>";
}

function saveSection() {
  return '<section class="activity-card" id="save"><h2 tabindex="-1">' + bilingual("Save your app", "保存你的应用") +
    '</h2><ol class="plain-list"><li>' + bilingual("In MIT App Inventor, choose Projects > Save project.", "在 MIT App Inventor 中，选择 Projects > Save project。") +
    '</li><li>' + bilingual("Choose Projects > Export selected project (.aia) to my computer. Find the .aia file in Downloads and keep it for the next lesson.", "选择 Projects > Export selected project (.aia) to my computer。在 Downloads 找到 .aia 文件，留到下一课使用。") +
    '</li></ol>' + editorShot(picture("export-menu.webp", "Projects menu with Export selected project (.aia) marked", "Projects 菜单中标出了导出 .aia 的选项")) + "</section>";
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

function extension() {
  const item = feature();
  return stageHead("Extension · If you have time", "拓展挑战 · 有时间再做", "Improve your feature", "改进你的功能",
    "Keep the same project and make one useful improvement.", "在同一个项目中做一项有用的改进。") +
    (item ? '<section class="activity-card"><h2>' + text(item.title) + '</h2><p>' + rich(item.extra) +
      '</p>' + editorShot(item.extraVisual) + '</section>' : chooseFirst()) +
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

const views = { opening: intro, choose, build, extension, pitstop, plenary };

function requestedRoute() {
  const id = location.hash.slice(1);
  return stageIds.has(id) || jumps.has(id) ? id : "start";
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
  const link = event.target.closest('a[href^="#"]');
  if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const id = link.getAttribute("href").slice(1);
    if (stageIds.has(id) || jumps.has(id)) {
      event.preventDefault();
      rememberPosition();
      if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
      show();
      return;
    }
  }

  const pick = event.target.closest("[data-feature]");
  if (pick) {
    state.feature = pick.dataset.feature;
    storeState();
    for (const card of main.querySelectorAll("[data-feature]")) {
      const isSelected = card.dataset.feature === state.feature;
      card.setAttribute("aria-pressed", String(isSelected));
      card.querySelector(".select-label").innerHTML = isSelected
        ? bilingual("Selected", "已选择") : bilingual("Choose", "选择");
    }
    const panel = document.querySelector("#my-choice");
    panel.innerHTML = selection();
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
  }
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
