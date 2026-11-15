"use strict";

const stateKey = "csmd-year9-week13-vault-v1";
const main = document.querySelector("#workspace");
const language = document.querySelector("#language");
const mobileStage = document.querySelector("#mobile-stage");
const projectDir = "assets/projects/";
let state = { language: "en", stage: "start", route: "", focus: "", phase: "", checked: {}, prediction: "", extension: "vault" };
try {
  const stored = JSON.parse(localStorage.getItem(stateKey));
  if (stored && typeof stored === "object") {
    for (const key of ["language", "stage", "route", "focus", "phase", "prediction", "extension"]) {
      if (typeof stored[key] === "string") state[key] = stored[key];
    }
    if (stored.checked && typeof stored.checked === "object") state.checked = stored.checked;
  }
} catch {
  // The lesson works when storage is unavailable.
}

function save() {
  try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch {}
}

const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
const tr = ([en, zh]) => esc(en) + (zh ? '<span class="zh" lang="zh-Hans">' + esc(zh) + "</span>" : "");
const t = (en, zh) => tr(words(en, zh));
const label = (pair) => state.language === "bi" && pair[1] ? pair.join(" · ") : pair[0];
const number = (value) => String(value).padStart(2, "0");
const stageFromUrl = () => stageNames.find(([id]) => "#" + id === location.hash)?.[0];
const btn = (en, zh, attributes = "", colour = "") => '<button type="button" class="button ' + colour + '" ' + attributes + ">" + t(en, zh) + "</button>";
const link = (href, en, zh, { primary = false, file = false, external = false } = {}) =>
  '<a class="button' + (primary ? " primary" : "") + '" href="' + href + '"' + (file ? " download" : "") +
  (external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + t(en, zh) + "</a>";
const mit = () => link("https://ai2.appinventor.mit.edu/", "Open MIT App Inventor ↗", "打开 MIT App Inventor ↗", { external: true });
const head = (stage, stageZH, title, titleZH, intro, introZH) =>
  '<header class="stage-head"><p class="eyebrow">' + t(stage, stageZH) + '</p><h1>' + t(title, titleZH) +
  "</h1><p>" + t(intro, introZH) + "</p></header>";

function nextStage(id, caption, zh) {
  return '<div class="stage-footer">' + link("#" + id, caption + " →", zh + " →", { primary: true }) + "</div>";
}

function gallery(shots) {
  return '<div class="screenshot-list">' + shots.map(({ name, caption, bilingual, marks = [] }) => {
    const file = "assets/mit/" + name + (bilingual ? (state.language === "bi" ? "-bi.png" : "-en.png") : "");
    return '<figure><a href="' + file + '" target="_blank" rel="noopener" aria-label="' +
      esc(label(words("Open full screenshot. " + caption[0], "打开完整截图。" + caption[1]))) + '"><span class="photo-frame"><img loading="lazy" src="' + file +
      '" alt="' + esc(caption[0]) + '">' + marks.map(([left, top, width, height], i) =>
      '<span class="pin" aria-hidden="true" style="left:' + left + '%;top:' + top + '%;width:' + width + '%;height:' + height +
      '%"><b>' + (i + 1) + "</b></span>").join("") + '</span></a><figcaption>' + tr(caption) + "</figcaption></figure>";
  }).join("") + "</div>";
}

function screenshotDemo(key, title, { directory = "assets/guides/", poster = key + "-still", width = 600, height = 480 } = {}) {
  const still = directory + poster + ".webp";
  const animation = directory + key + ".webp";
  return `<figure class="screenshot-demo"><img src="${still}" width="${width}" height="${height}" loading="lazy" alt="${esc(title[0])}">
    <figcaption><span>${tr(title)}</span>
    ${btn("Play screenshot demo", "播放截图演示", `data-demo="${animation}" data-poster="${still}" aria-pressed="false"`)}</figcaption></figure>`;
}

function featureGuide(key, title = words("Follow the steps", "跟着步骤做")) {
  return '<section class="visual-guide"><div><h3>' + tr(title) + '</h3><ol class="actions-list">' +
    featureGuides[key].map(item => '<li>' + tr(item) + '</li>').join("") +
    '</ol></div>' + screenshotDemo(key, words("Steps in order", "按顺序展示步骤")) + '</section>';
}

function starterGuide(webFile, companionFile) {
  return '<section class="starter-guide"><h3>' + t("Test in MIT App Inventor", "在 MIT App Inventor 中测试") + '</h3>' +
    '<ol class="actions-list"><li>' + t("Download the starter for your device. In MIT choose Projects → Import project (.aia) from my computer. Pick the downloaded file and click OK.", "下载适合设备的起始项目。在 MIT 中选 Projects → Import project (.aia) from my computer，选择文件并点 OK。") +
    '</li><li>' + t("Laptop in Chrome or Edge. Import the browser starter and choose Connect → Test in Web. If you see 127.0.0.1 or localhost refused to connect, reopen the project ending in _Web and test that one.", "用电脑的 Chrome 或 Edge。导入浏览器版，再选 Connect → Test in Web。如果看到 127.0.0.1 或 localhost 拒绝连接，请打开名称以 _Web 结尾的项目再测试。") +
    '</li><li>' + t("Class iPad. Import the Companion starter, choose Connect → AI Companion and enter the current six-character code in the Companion app.", "课堂 iPad：导入 Companion 版，选 Connect → AI Companion，在 Companion 应用输入当前的六位配对码。") +
    '</li></ol><div class="actions">' + link(webFile, "Browser starter (.aia)", "浏览器版（.aia）", { primary: true, file: true }) +
    link(companionFile, "Companion starter (.aia)", "Companion 版（.aia）", { file: true }) + mit() + '</div>' +
    '<details class="help-panel"><summary>' + t("See the import and Connect menus", "查看导入和连接菜单") + '</summary><div class="help-body">' +
    screenshotDemo("mit", words("Import, then choose where to test", "导入并选择测试方式")) + '</div></details></section>';
}

const modelFile = projectDir + "Year9_Feature_Upgrade_Model.aia";
const week12Starter = "playground/assets/Year9_WAGOLL_Studio.aia";
const routes = Object.keys(upgradeRoutes);
const extensionOptions = {
  vault: ["Circuit Vault", "电路密室", "Circuit_Vault", "circuit-vault.html", [],
    words("Clear one room and check when the door opens.", "清空一个房间，观察门什么时候打开。")],
  voxel: ["3D Voxel Vault", "3D 方块密室", "Voxel_Vault_3D", "vault-3d.html", [],
    words("Collect the keycard, unlock the door and reach the exit switch.", "收集钥匙卡，解锁房门，再到达出口开关。")],
  merge: ["Merge 256", "合成 256", "Merge_256", "merge-256.html", [],
    words("Move left and see two 2s merge. Try New game to reset the board.", "向左移动，观察两个 2 合并。点击 New game 重置棋盘。")],
  cafe: ["Café Rush", "食堂冲刺", "Cafe_Rush", "cafe-rush.html", ["cafe-guests.png", "cafe-props.png"],
    words("Take one order, cook it and serve the correct dish.", "接一份订单，烹饪并送上正确的餐点。")],
  menu: ["Kantin Koala", "考拉食堂", "Kantin_Koala", "kantin-koala.html", ["menu-catalog.jpg"],
    words("Add a dish and check what changes when you switch from pickup to delivery.", "添加一道菜，从自取切换到配送，观察有什么变化。")],
};

const questions = [
  ["four", words("On the fourth tap.", "第四次点击。")],
  ["six", words("On the sixth tap.", "第六次点击。")],
  ["five", words("On the fifth tap.", "第五次点击。")],
];

function predictionFeedback() {
  if (state.prediction === "five") return t("Yes. At 4, the goal is still showing. At 5, it changes to “You win!”", "正确。4 分时仍显示目标，到 5 分时变成“You win!”。");
  if (questions.some(([key]) => key === state.prediction)) return t("Look at the message under the purple target. Which score changes it to “You win!”?", "看紫色目标下面的提示。分数达到多少时会变为“You win!”？");
  return "";
}

function screenshot(path, caption) {
  return `<figure><a href="${path}" target="_blank" rel="noopener" aria-label="${esc(label(words("Enlarge screenshot. " + caption[0], "放大截图。" + caption[1])))}"><img src="${path}" alt="${esc(caption[0])}" loading="lazy"></a><figcaption>${tr(caption)}</figcaption></figure>`;
}

function phoneStrip(frames) {
  return '<div class="phone-strip">' + frames.map(([file, en, zh]) =>
    screenshot(`assets/upgrade/${file}.webp`, words(en, zh))).join("") + '</div>';
}

function actionsList(items, tag = "ol") {
  return `<${tag} class="actions-list">${items.map(item => `<li>${tr(item)}</li>`).join("")}</${tag}>`;
}

function details(title, content, id = "") {
  return `<details ${id ? `id="${id}" ` : ""}class="help-panel"><summary>${tr(title)}</summary><div class="help-body">${content}</div></details>`;
}

function upgradeDemo(key) {
  return details(words("Watch the feature in the MIT tester", "观看 MIT 测试演示"),
    screenshotDemo(`${key}-play`, words("MIT App Inventor test replay", "MIT App Inventor 测试回放"), {
      directory: "assets/upgrade/",
      poster: upgradeRoutes[key].stills[0][0],
      width: 480,
      height: 618,
    }));
}

function start() {
  return `<section class="upgrade-intro">
    <div>${head("Read First & Do Now", "先看示例与热身", "Upgrade your app", "升级你的应用",
      "Add or improve one feature in your existing app, then show that it works.", "在已有的应用中添加或改进一个功能，并演示它能正常运行。")}
      <div class="actions">${link("#do-now", "Answer the Do Now ↓", "回答热身题 ↓", { primary: true })}</div>
    </div>
    <section class="paper-card wagoll">
      <h2>${t("What a good one looks like", "优秀示例")}</h2>
      <p>${t("Mini Arcade already counts taps. The new win message appears when the player reaches 5.", "Mini Arcade 原本就能计算点击次数。玩家达到 5 分时，会显示新的获胜提示。")}</p>
      ${phoneStrip(upgradeRoutes.arcade.stills)}
      ${upgradeDemo("arcade")}
      <div class="actions">${link(modelFile, "Download the finished reference (.aia)", "下载完成的参考项目（.aia）", { file: true })}</div>
      <p class="subtle">${t("Open the example as a separate project. Make today’s changes in your own app.", "请把示例作为单独的项目打开。今天的改动要做在自己的应用里。")}</p>
    </section>
  </section>
  <section class="paper-card do-now" id="do-now">
    <p class="eyebrow">${t("Do Now", "课堂热身")}</p>
    <h2>${t("When does the new message appear?", "新提示在什么时候出现？")}</h2>
    <form id="prediction"><fieldset><legend class="sr-only">${t("Select one answer", "选择一个答案")}</legend>
      ${questions.map(([key, text]) => `<label class="radio-card"><input type="radio" name="prediction" value="${key}" ${state.prediction === key ? "checked" : ""}><span>${tr(text)}</span></label>`).join("")}
    </fieldset><button class="button" type="submit">${t("Check my answer", "检查答案")}</button>
    <p id="prediction-result" class="feedback" role="status">${predictionFeedback()}</p></form>
  </section>${nextStage("types", "Types of Learning", "学习类型")}`;
}

const focusChoices = [
  ["knowledge", "K", words("Knowledge", "知识"), words("I want to recognise the part the user touches, the event block and the part that changes.", "我想认出用户点击的组件、事件积木和发生变化的部分。")],
  ["skills", "S", words("Skills", "技能"), words("I want to add a component, connect its blocks and test it.", "我想练习添加组件、连接积木并测试。")],
  ["understanding", "U", words("Understanding", "理解"), words("I want to explain why a tap or a choice changes what the app shows.", "我想解释为什么点击或选择会改变应用显示的内容。")],
];

function types() {
  return head("Types of Learning", "学习类型", "Pick one thing to practise", "选一项要练习的内容",
    "Think about Mini Arcade. Which part of making that change would you like to get better at?", "想想 Mini Arcade。做出那项改动时，你想在哪个方面做得更好？") +
    '<fieldset class="focus-options"><legend class="sr-only">' + t("Choose a learning focus", "选择学习重点") + '</legend>' +
    focusChoices.map(([key, code, title, description]) =>
      `<label class="focus-card"><input type="radio" name="focus" value="${key}" ${state.focus === key ? "checked" : ""}>
      <span class="focus-letter" aria-hidden="true">${code}</span><span><strong>${tr(title)}</strong><span class="focus-intro">${tr(description)}</span></span></label>`).join("") +
    "</fieldset>" + nextStage("main-1", "Main Task 1", "主任务一");
}

function routePicker() {
  return '<fieldset class="routes"><legend class="sr-only">' + t("Choose one feature", "选择一项功能") + '</legend>' +
    routes.map(key => {
      const route = upgradeRoutes[key];
      return `<label class="route-card"><input type="radio" name="route" value="${key}" ${state.route === key ? "checked" : ""}>
        <span><strong>${tr(route.name)}</strong><span class="route-copy">${tr(route.result)}</span></span></label>`;
    }).join("") + "</fieldset>";
}

function catchup(route) {
  const recap = route?.recap?.map(([image, en, zh]) =>
    screenshot(`assets/week12/${image}.webp`, words(en, zh))).join("") || "";
  return details(words("Week 12 catch-up · Find or fix your starting feature", "第 12 周补做：找到或修复起始功能"),
    `<p>${t("Open last week’s project in MIT. If you only have the saved .aia, import it from Projects. If you missed the lesson and have no copy, use the Week 12 practice project below. Open the example screen for your feature. For Help panel, start on Screen1 or another homepage.", "在 MIT 打开上周的项目。如果只有保存的 .aia 文件，就从 Projects 导入。如果上周缺课且没有项目，可以使用下方的第 12 周练习项目。打开对应功能的示例页面。选择帮助面板的话，从 Screen1 或另一个首页开始。")}</p>
    <div class="actions">${link("playground/index.html", "Open the Week 12 Playground ↗", "打开第 12 周 Playground ↗", { external: true })}
    ${link(week12Starter, "Download the Week 12 practice project (.aia)", "下载第 12 周练习项目（.aia）", { file: true })}</div>
    ${recap ? `<div class="screenshot-list recap-shots">${recap}</div>` : ""}
    ${details(words("See how to import a project", "查看如何导入项目"), gallery([mitImages.liveImport, mitImages.importDialog]))}`);
}

function testingGuide() {
  return details(words("How to test in MIT", "如何在 MIT 中测试"),
    actionsList([
      words("Laptop in Chrome or Edge. In MIT, select Connect → Test in Web (Beta). Allow MIT to open its test window. Reconnect if it still shows the old version.", "电脑用 Chrome 或 Edge。在 MIT 中选 Connect → Test in Web (Beta)，允许打开测试窗口。如果仍显示旧版本，请重新连接。"),
      words("Class iPad. In MIT, select Connect → AI Companion. In MIT AI2 Companion, enter the current six-character code and tap Connect with code. Use the same Wi-Fi.", "课堂 iPad：在 MIT 选择 Connect → AI Companion。在 MIT AI2 Companion 输当前的六位配对码，然后点 Connect with code。两台设备应使用同一个 Wi-Fi。"),
      words("If the connection fails, show your teacher where you are in Designer or Blocks. Tell them what you expected and what appeared.", "如果连接失败，给老师看你在 Designer 或 Blocks 中进行到哪里，说出预期结果和实际结果。"),
    ]) + gallery([mitImages.liveTest, mitImages.companion]), "testing");
}

function selectedRoute(route, stage) {
  const key = state.route;
  const taskOne = stage === 1;
  const checkpointKey = `${key}-${stage}`;
  const checkpointLabel = taskOne
    ? words("I checked the starting version and made the changes above.", "我检查了起始版本并完成了上面的改动。")
    : words("I ran my app and saw the results listed above.", "我运行了自己的应用，并看到了上面列出的结果。");
  const propertyShot = key === "gallery" && taskOne
    ? screenshot("assets/upgrade/gallery-properties.webp", words("2 Scroll to Behavior in Properties and enter your two names.", "2 在 Properties 滚动到 Behavior，输入两个名称。"))
    : "";
  return `<article class="paper-card upgrade-task">
    <p class="eyebrow">${tr(route.name)}</p>
    <h2>${tr(taskOne ? route.first : route.next)}</h2>
    <p class="subtle">${tr(route.model)}</p>
    ${!taskOne && !state.checked[`${key}-1`] ? `<p class="success">${t("If your starting version still needs work, finish Main Task 1 before editing these blocks.", "如果起始版本还没完成，先做完主要任务 1，再编辑这些积木。")}</p>` : ""}
    ${taskOne ? "" : phoneStrip(route.stills) + upgradeDemo(key)}
    ${actionsList(taskOne ? route.steps1 : route.steps2)}
    <div class="screenshot-list upgrade-shots">
      ${screenshot(`assets/upgrade/${key}-${taskOne ? "design" : "blocks"}.webp`, taskOne ? route.design : route.blocks)}
      ${propertyShot}
    </div>
    ${taskOne ? "" : `<section class="test-sheet"><h3>${t("What you should see when you test", "测试时应该看到的结果")}</h3>${actionsList(route.tests, "ul")}</section>`}
    ${testingGuide()}
    <label class="tick"><input type="checkbox" data-check="${checkpointKey}" ${state.checked[checkpointKey] ? "checked" : ""}><span>${tr(checkpointLabel)}</span></label>
  </article>`;
}

function mainOne() {
  const route = upgradeRoutes[state.route];
  return head("Main Task 1", "主要任务 1", "Get your feature ready", "准备你的功能",
    "Open your own project from last week. Choose one feature below and follow its guide. You’ll improve this same feature in Main Task 2.", "打开上周自己的项目。在下方选择一项功能，按指南操作。主要任务 2 将继续改进同一项功能。") +
    `<div class="actions workspace-tools">${mit()}</div>
    <p class="subtle">${t("Use Projects to open your app, then use Screens to select the page you want. If you only have a homepage, try Help panel.", "用 Projects 打开自己的应用，再从 Screens 选页面。如果应用现在只有首页，可以试试帮助面板。")}</p>
    ${routePicker()}<div class="route-support">${catchup(route)}
    ${details(words("Find Designer, Screens and Blocks", "找到 Designer、Screens 和 Blocks"),
      '<div class="screenshot-list">' +
      screenshot("assets/upgrade/choose-screen.webp", words("Use Screens to open the page you want to edit.", "用 Screens 打开要编辑的页面。")) +
      screenshot("assets/upgrade/designer-overview.webp", words("1 Palette. 2 Phone preview. 3 Components. 4 Properties. 5 Blocks.", "1 组件库。2 手机预览。3 组件。4 属性。5 积木。")) + "</div>")}
    </div>
    ${route ? selectedRoute(route, 1) + nextStage("main-2", "Continue with this feature in Main Task 2", "在主要任务 2 中继续此功能") : ""}`;
}

function mainTwo() {
  const route = upgradeRoutes[state.route];
  return head("Main Task 2", "主要任务 2", "Make your feature do more", "让你的功能再进一步",
    "Keep the same app, screen and feature from Main Task 1. Add the new behaviour and try the checks below.", "继续使用主要任务 1 中的同一个应用、页面和功能。加入新的行为，再完成下方检查。") +
    (route
      ? `<div class="actions workspace-tools">${mit()}${link("#main-1", "Back to your Main Task 1 steps", "返回你的主要任务 1 步骤")}</div>
        ${selectedRoute(route, 2)}${nextStage("extension", "Extension", "拓展挑战")}`
      : `<section class="paper-card"><h2>${t("Choose your feature in Main Task 1", "在主要任务 1 选择功能")}</h2>
        <p>${t("Once you pick it, this page will show its next steps and testing screenshots.", "选好后，这一页会显示该功能的下一步与测试截图。")}</p>
        <div class="actions">${link("#main-1", "Go to Main Task 1", "前往主要任务 1", { primary: true })}</div></section>`);
}

function extension() {
  const key = state.extension;
  const [en, zh, starter, file, extra, challenge] = extensionOptions[key];
  const browserFile = projectDir + file + (state.language === "bi" ? "?lang=bi" : "");
  return head("Extension", "拓展挑战", "Add a playable extra", "添加一个可玩的功能",
    "After you’ve tested and saved your feature, explore an extra that could fit your own app.", "测试并保存自己的功能后，探索一个适合加入自己应用的额外功能。") +
    `<label class="extension-select">${t("Choose an example", "选择一个示例")}<select name="extension">
      ${Object.entries(extensionOptions).map(([id, [title, titleZh]]) =>
        `<option value="${id}" ${id === key ? "selected" : ""}>${esc(label(words(title, titleZh)))}</option>`).join("")}</select></label>
    <section class="paper-card extension-example"><h2>${t(en, zh)}</h2><p>${tr(challenge)}</p>
      <div class="actions">${link(browserFile, "Play in a browser ↗", "在浏览器中试玩 ↗", { primary: true, external: true })}</div>
      ${featureGuide(key, words("Try it step by step", "按步骤试玩"))}
      ${starterGuide(projectDir + starter + "_Web.aia", projectDir + starter + ".aia")}
      ${details(words("Add this to your existing app", "把它添加到自己的应用"), `
        ${actionsList([
          words("On the screen you want to change, drag User Interface → WebViewer into the Viewer. Set Width to Fill parent and give it enough height for the game controls.", "在要改进的页面，从 User Interface 拖入 WebViewer。把 Width 设为 Fill parent，并给控件足够的高度。"),
          words("For laptop Web Test, import the Web Test example as a separate reference project. Select its WebViewer in Designer and copy the whole HomeUrl value. Paste it into your own project's WebViewer HomeUrl. Reopen your project to test it.", "用电脑网页测试时，把网页测试示例导入为单独的参考项目。在 Designer 中选中它的 WebViewer，复制整个 HomeUrl 值，再粘贴到自己项目的 WebViewer HomeUrl 中。重新打开自己的项目进行测试。"),
          words("For iPad Companion, upload every file below with Designer → Media → Upload File. Keep the filenames and enter the displayed Companion address in HomeUrl.", "用 iPad Companion 时，从 Designer → Media → Upload File 上传下方全部文件。保留原文件名，在 HomeUrl 中填入显示的 Companion 地址。"),
          words("Run your app. Try one action in the extra, then check your main feature still works.", "运行自己的应用。在新功能中试一个操作，再确认原来的主要功能仍正常。"),
        ])}
        <p><strong>${t("Companion HomeUrl", "Companion 地址")}</strong> <code>http://localhost/${file}</code></p>
        <div class="actions">${[file, ...extra].map(asset => link(projectDir + asset, asset, "", { file: true })).join("")}</div>
        ${details(words("See the WebViewer and Media screenshots", "查看 WebViewer 和 Media 截图"),
          gallery([mitImages.liveViewerPalette, mitImages.liveViewer, mitImages.upload]))}
      `)}
    </section>${nextStage("pitstop", "Learning Pit Stop", "学习停靠站")}`;
}

const phases = [
  ["new", words("New learning", "新学习"), words("This was new. I’m starting to make it work.", "这是新内容。我开始做得出来了。")],
  ["consolidating", words("Consolidating", "巩固学习"), words("I knew the idea and got better at using it.", "我知道这个思路，今天用得更熟练了。")],
  ["treading", words("Treading water", "需要更多挑战"), words("This felt easy. I’m ready for a bigger challenge.", "这对我很容易，可以试更难的挑战。")],
  ["drowning", words("Drowning", "需要帮助"), words("I’m still stuck and need someone to help me get started.", "我仍然卡住，需要有人帮我开始。")],
];

function pitstop() {
  return head("Learning Pit Stop", "学习停靠站", "How did your feature feel to build?", "制作这个功能时感觉如何？",
    "Think about the feature you worked on today. Pick the phase that fits your confidence now.", "想想今天做的功能，选一个最符合目前信心的阶段。") +
    '<fieldset class="phase-options"><legend class="sr-only">Choose a learning phase</legend>' +
    phases.map(([id, title, intro]) => '<label class="radio-card"><input type="radio" name="phase" value="' + id + '"' +
      (state.phase === id ? " checked" : "") + "><span><strong>" + tr(title) + '</strong><span class="option-copy">' +
      tr(intro) + "</span></span></label>").join("") + "</fieldset>" + nextStage("plenary", "Plenary", "课堂总结");
}

function plenary() {
  const route = upgradeRoutes[state.route];
  return head("Plenary", "课堂总结", "Show it, save it, submit it", "演示、保存并提交",
    route ? "Your feature is " + route.name[0] + ". Show a partner what it does now." : "Show a partner what your feature does before and after a tap or choice.",
    route ? "展示你对“" + route.name[1] + "”的改动，给同伴演示一次。" : "给同伴演示点击或选择前后，功能有什么变化。") +
    `<section class="paper-card">
      <h2>${t("Your final check", "最后检查")}</h2>
      ${actionsList([
        words("Show a partner what happens before and after the tap or choice. Say “When the user …, my app now …”", "给同伴演示点击或选择前后的变化。说：“当用户……时，我的应用现在会……”"),
        words("In your own MIT project, choose Projects → Save project, then Projects → Export selected project (.aia) to my computer.", "在自己的 MIT 项目中，选择 Projects → Save project，再选择 Projects → Export selected project (.aia) to my computer。"),
        words("Find your .aia in Downloads or Files. Attach it to your Week 13 assignment in Teams and select Turn in.", "到 Downloads 或 Files 找到 .aia 文件，上传到 Teams 的第 13 周作业，并选 Turn in。"),
      ])}
      <div class="screenshot-list upgrade-shots">${screenshot("assets/upgrade/export-project.webp", words("1 Open Projects. 2 Export the selected project.", "1 打开 Projects。2 导出选中的项目。"))}</div>
    </section><div class="stage-footer">${link("#main-2", "Review your feature", "复习你的功能")}</div>`;
}

const views = { start, types, "main-1": mainOne, "main-2": mainTwo, extension, pitstop, plenary };

function nav(stage) {
  const current = stageNames.findIndex(([id]) => id === stage);
  document.querySelector("#rail-progress").innerHTML = t("Stage " + (current + 1) + " of " + stageNames.length, "第 " + (current + 1) + " / " + stageNames.length + " 阶段");
  document.querySelector("#lesson-nav").innerHTML = '<ol>' + stageNames.map(([id, title], i) =>
    '<li><a href="#' + id + '"' + (id === stage ? ' aria-current="page"' : "") + '><span class="nav-no" aria-hidden="true">' +
    number(i + 1) + "</span><span>" + tr(title) + "</span></a></li>").join("") + "</ol>";
  mobileStage.replaceChildren(...stageNames.map(([id, title]) => new Option(label(title), id, false, id === stage)));
}

function render(stage, moveFocus = false) {
  state.stage = stage;
  save();
  document.body.classList.toggle("bilingual", state.language === "bi");
  language.value = state.language;
  nav(stage);
  main.innerHTML = views[stage]();
  if (moveFocus) {
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

language.addEventListener("change", () => {
  state.language = language.value;
  const open = [...main.querySelectorAll("details")].map((item) => item.open);
  render(state.stage);
  main.querySelectorAll("details").forEach((item, i) => { if (open[i]) item.open = true; });
});
mobileStage.addEventListener("change", () => { location.hash = mobileStage.value; });

window.addEventListener("hashchange", () => {
  const target = stageFromUrl();
  if (target) render(target, true);
  if (location.hash === "#do-now") document.querySelector("#do-now")?.scrollIntoView();
});

main.addEventListener("change", (event) => {
  const control = event.target;
  if (control.name === "route" || control.name === "extension") {
    state[control.name] = control.value;
    render(state.stage);
    const selector = control.name === "route" ? '[name="route"]:checked' : '[name="extension"]';
    main.querySelector(selector)?.focus({ preventScroll: true });
    return;
  }
  if (control.name === "focus" || control.name === "phase") state[control.name] = control.value;
  if (control.dataset.check) state.checked[control.dataset.check] = control.checked;
  save();
});

main.addEventListener("click", (event) => {
  const demo = event.target.closest("[data-demo]");
  if (!demo) return;
  const playing = demo.getAttribute("aria-pressed") === "true";
  demo.closest("figure").querySelector("img").src = playing ? demo.dataset.poster : demo.dataset.demo;
  demo.setAttribute("aria-pressed", String(!playing));
  demo.innerHTML = playing ? t("Play screenshot demo", "播放截图演示") : t("Stop demo", "停止演示");
});

main.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "prediction") {
    const answer = new FormData(event.target).get("prediction");
    const result = document.getElementById("prediction-result");
    if (!answer) {
      result.innerHTML = t("Choose an answer first.", "请先选择一个答案。");
      return;
    }
    state.prediction = answer;
    save();
    result.innerHTML = predictionFeedback();
  }
});

if (!routes.includes(state.route)) state.route = "";
if (!Object.hasOwn(extensionOptions, state.extension)) state.extension = "vault";
const initial = stageFromUrl() || (location.hash === "#do-now" ? "start" : state.stage);
render(Object.hasOwn(views, initial) ? initial : "start");
if (location.hash === "#do-now") document.querySelector("#do-now")?.scrollIntoView();
