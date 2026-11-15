"use strict";

const stateKey = "csmd-year9-week13-vault-v1";
const main = document.querySelector("#workspace");
const language = document.querySelector("#language");
const mobileStage = document.querySelector("#mobile-stage");
const practiceFile = "assets/projects/Library_Helper_Practice.aia";
const vaultFile = "assets/projects/Circuit_Vault.aia";
const vaultWebFile = "assets/projects/Circuit_Vault_Web.aia";
const vaultAsset = "assets/projects/circuit-vault.html";
const mergeFile = "assets/projects/Merge_256.aia";
const mergeWebFile = "assets/projects/Merge_256_Web.aia";
const mergeAsset = "assets/projects/merge-256.html";
const playgroundLink = "playground/index.html#choose";
const foodProjects = {
  cafe: {
    name: words("Café Rush", "食堂冲刺"), file: "cafe-rush.html", starter: "Cafe_Rush",
    media: [
      ["cafe-guests.png", "Guest sprites (.png)", "顾客角色图（.png）"],
      ["cafe-props.png", "Furniture and food sprites (.png)", "家具和食物图（.png）"],
    ],
    description: words("Seat guests, take orders and keep the kitchen moving.", "安排顾客入座、点单，并让厨房忙起来。"),
    target: words("Serve six guests in a shift. Start with Table 1 and cook exactly what its guest orders.", "在一班内为六位顾客上菜。先从 1 号桌开始，按顾客点单烹饪。"),
    extend: words("Try a wrong dish once. Explain why the order stays on the table and the guest loses patience.", "故意选错一次。解释为什么订单留在桌上，而顾客的耐心会减少。"),
  },
  menu: {
    name: words("Kantin Koala", "考拉食堂"), file: "kantin-koala.html", starter: "Kantin_Koala",
    media: [["menu-catalog.jpg", "Download menu photos", "下载菜单照片"]],
    description: words("Browse a café menu, build a basket and track a practice order.", "浏览食堂菜单、添加餐点到购物篮，并追踪模拟订单。"),
    target: words("Add two items. Change a quantity, compare pickup with delivery and track one practice order.", "添加两件餐点。修改数量，比较自取与配送，再追踪一次模拟订单。"),
    extend: words("Start a second order and choose the other collection method. Explain what changes in the total and the tracker.", "再下一单，选另一种取餐方式。解释总价和订单进度如何变化。"),
  },
  voxel: {
    name: words("Escape the Voxel Vault · 3D", "逃出方块密室 · 3D"), file: "vault-3d.html", starter: "Voxel_Vault_3D",
    media: [],
    description: words("Explore a first-person vault, unlock the star door and flip the exit switch.", "用第一人称探索密室，解锁星星门并打开出口开关。"),
    target: words("Collect the keycard and reach the exit switch.", "收集钥匙卡，到达并打开出口开关。"),
    extend: words("Try the star door before you collect the keycard. What has to change before it will open?", "拿到钥匙卡前先试星星门。需要改变什么它才会打开？"),
  },
};

let state = { language: "en", stage: "start", route: "", focus: "", phase: "", checked: {}, active: {}, tests: {}, prediction: "" };
try {
  const stored = JSON.parse(localStorage.getItem(stateKey));
  if (stored && typeof stored === "object") state = { ...state, ...stored };
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

function helpPanel(item) {
  return '<details class="help-panel"><summary>' + t("Show me how", "看步骤示范") +
    '</summary><div class="help-body"><p class="help-tip">' + tr(item.help) +
    "</p>" + gallery(item.shots) + "</div></details>";
}

function screenshotDemo(key, title) {
  const path = "assets/guides/" + key;
  return '<figure class="screenshot-demo"><img src="' + path + '-still.webp" width="600" height="480" loading="lazy" alt="' +
    esc(title[0]) + '"><figcaption><span>' + tr(title) + '</span>' +
    btn("Play screenshot demo", "播放截图演示", 'data-demo="' + key + '" aria-pressed="false"') + '</figcaption></figure>';
}

function featureGuide(key, title = words("Follow the steps", "跟着步骤做")) {
  return '<section class="paper-card visual-guide"><div><h2>' + tr(title) + '</h2><ol class="actions-list">' +
    featureGuides[key].map(item => '<li>' + tr(item) + '</li>').join("") +
    '</ol></div>' + screenshotDemo(key, words("Steps in order", "按顺序展示步骤")) + '</section>';
}

function starterGuide(webFile, companionFile) {
  return '<section class="starter-guide"><h3>' + t("Test in MIT App Inventor", "在 MIT App Inventor 中测试") + '</h3>' +
    '<ol class="actions-list"><li>' + t("Download the starter for your device. In MIT choose Projects → Import project (.aia) from my computer. Pick the downloaded file and click OK.", "下载适合设备的起始项目。在 MIT 中选 Projects → Import project (.aia) from my computer，选择文件并点 OK。") +
    '</li><li>' + t("Laptop in Chrome or Edge. Import the browser starter and choose Connect → Test in Web. If you see 127.0.0.1 or localhost refused to connect, reopen the project ending in _Web and test that one.", "用电脑的 Chrome 或 Edge。导入浏览器版，再选 Connect → Test in Web。如果看到 127.0.0.1 或 localhost 拒绝连接，请打开名称以 _Web 结尾的项目再测试。") +
    '</li><li>' + t("Phone or iPad. Import the Companion starter, choose Connect → App Inventor Companion and enter the fresh six-character code in the Companion app.", "用手机或 iPad。导入 Companion 版，选 Connect → App Inventor Companion，然后在 Companion 应用输入新生成的六位连接码。") +
    '</li></ol><div class="actions">' + link(webFile, "Browser starter (.aia)", "浏览器版（.aia）", { primary: true, file: true }) +
    link(companionFile, "Companion starter (.aia)", "Companion 版（.aia）", { file: true }) + mit() + '</div>' +
    '<details class="help-panel"><summary>' + t("See the import and Connect menus", "查看导入和连接菜单") + '</summary><div class="help-body">' +
    screenshotDemo("mit", words("Import, then choose where to test", "导入并选择测试方式")) + '</div></details></section>';
}

function game() {
  const lang = state.language === "bi" ? "&amp;lang=bi" : "";
  return '<section class="play-area" aria-label="Playable Circuit Vault example"><iframe class="vault-preview" title="' +
    esc(label(words("Play Circuit Vault", "试玩电路密室"))) + '" src="' + vaultAsset + "?embed=1" + lang +
    '"></iframe><a class="vault-fullscreen" href="' + vaultAsset + (lang ? "?lang=bi" : "") +
    '" target="_blank" rel="noopener noreferrer">' + t("Play in a larger window ↗", "在大窗口玩 ↗") + "</a></section>";
}

const questions = [
  ["choice", words("The door opens when you fire the first pulse.", "发射第一次脉冲后，门就会打开。")],
  ["response", words("The door opens when every robot in the room is cleared.", "房间里的所有机器人被清除后，门才会打开。")],
  ["both", words("The door opens as soon as you roll toward it.", "只要向门翻滚，门就会打开。")],
];

function predictionFeedback() {
  if (state.prediction === "response") return t("Exactly. The program checks the robots left. When that reaches zero, it opens the door.", "正确。程序检查剩余机器人数量。数量为零时，门才会打开。");
  if (state.prediction) return t("Look at the door after the first robot goes down. Check it again after the last robot goes down.", "击败第一个机器人后观察门，再击败最后一个机器人后重新观察。");
  return "";
}

function start() {
  return '<section class="hero"><div class="hero-copy"><p class="eyebrow">' + t("Read First & Do Now", "先看示例与热身") +
    '</p><h1>' + t("Play Circuit Vault.", "试玩电路密室") +
    '</h1><p class="hero-lead">' + t("Clear three arcade rooms, dodge incoming shots and reach the extraction gate.", "清空三个街机房间，躲避飞弹，到达撤离门。") +
    '</p><div class="hero-actions">' + link("#do-now", "Answer the Do Now ↓", "回答热身题 ↓", { primary: true }) +
    '<span class="hero-note">' + t("Your first goal is to clear the Relay Room.", "第一个目标是清空继电器房。") +
    '</span></div><div class="guide-line"><img src="assets/art/guide.png" alt="" width="80" height="80"><p>' +
    t("Move with the arrows. Hold Pulse to aim automatically. Use Dodge when you see an attack warning.", "用方向键移动。按住 Pulse 自动瞄准。看到攻击预警时用 Dodge 翻滚。") + "</p></div></div>" + game() +
    '</section><section class="paper-card do-now" id="do-now"><p class="eyebrow">' + t("Do Now", "课堂热身") +
    '</p><h2>' + t("What makes the room door unlock?", "什么条件会让房门解锁？") +
    '</h2><form id="prediction"><fieldset><legend class="sr-only">Select one answer</legend>' +
    questions.map(([key, text]) => '<label class="radio-card"><input type="radio" name="prediction" value="' + key + '"' +
      (state.prediction === key ? " checked" : "") + '><span>' + tr(text) + "</span></label>").join("") +
    '</fieldset><button class="button" type="submit">' + t("Check my answer", "检查答案") +
    '</button><p id="prediction-result" class="feedback" role="status">' + predictionFeedback() + "</p></form></section>" +
    nextStage("types", "Types of Learning", "学习类型");
}

const focusChoices = [
  ["knowledge", "K", words("Knowledge", "知识"), words("Find the choice, the Click event and the Label that shows the result.", "找出选项、Click 事件和展示结果的 Label。"), words("I want to find the right component or block.", "我想找到正确的组件或积木。")],
  ["skills", "S", words("Skills", "技能"), words("Connect the button and check both outcomes.", "连接按钮积木并检查两个结果。"), words("I want to practise connecting and checking both results.", "我想练习连接并检查两个结果。")],
  ["understanding", "U", words("Understanding", "理解"), words("Explain why the same button can show two different messages.", "解释同一个按钮为什么能显示两种不同消息。"), words("I want to explain why the result changes.", "我想解释结果为什么变化。")],
];

function types() {
  return head("Types of Learning", "学习类型", "Choose a focus", "选一个学习重点",
    "Think about what triggered the door opening. Pick one skill or idea to work on as you build.", "想想是什么触发了开门，选一个制作时想练习的重点。") +
    '<fieldset class="focus-options"><legend class="sr-only">Choose a learning focus</legend>' +
    focusChoices.map(([key, code, title, intro, description]) =>
      '<label class="focus-card"><input type="radio" name="focus" value="' + key + '"' + (state.focus === key ? " checked" : "") +
      '><span class="focus-letter" aria-hidden="true">' + code + '</span><span><strong>' + tr(title) + "</strong>" +
      '<span class="focus-intro">' + tr(intro) + '</span><span class="focus-intro">' + tr(description) + "</span></span></label>").join("") +
    "</fieldset>" + nextStage("main-1", "Main Task 1", "主任务一");
}

const features = [
  ["screen", "Open a new screen", "打开新页面"],
  ["drawing", "Drawing pad", "画板"],
  ["gallery", "Three-column gallery", "三列图片"],
  ["arcade", "Tap the target", "点击目标"],
];

function routes() {
  return '<fieldset class="routes"><legend class="sr-only">Choose your route</legend>' +
    [["playground", "Continue last week’s feature", "继续上周的功能", "Finish your build, or catch up with Club Finder.", "完成原来的功能，或者从 Club Finder 补起。"],
      ["vault", "Add Circuit Vault", "添加电路密室", "Dodge shots, clear the rooms and beat the Core Keeper.", "躲避飞弹、清空房间并击败核心守卫。"],
      ["merge", "Add Merge 256", "添加合成 256", "Swipe to combine tiles and try to reach 256.", "滑动合并数字方块，试着合成 256。"],
      ...Object.entries(foodProjects).map(([id, project]) => [id, ...project.name, ...project.description])].map(([id, en, zh, text, textZH]) =>
    '<label class="route-card"><input type="radio" name="route" value="' + id + '"' + (state.route === id ? " checked" : "") +
    '><span><strong>' + t(en, zh) + '</strong><span class="route-copy">' + t(text, textZH) + "</span></span></label>").join("") + "</fieldset>";
}

function playground() {
  const recovery = {
    help: words("If you missed last week, download the example .aia, import it in MIT, and open the Club Finder example. In the original guide, select Open a new screen. Change the button words and the heading it opens, then show someone the result.", "如果上周缺课，下载并导入示例 .aia，然后打开 Club Finder。回到原指南选择“打开新页面”。改按钮文字和打开后页面的标题，再把结果展示给同伴。"),
    shots: [mitImages.importMenu, mitImages.importDialog, mitImages.designer, mitImages.button, mitImages.label],
  };
  return '<section class="paper-card"><h2>' + t("Continue in the original Playground", "在原来的 Playground 继续") +
    "</h2><p>" + t("Reopen the project you used last week. Follow the first unfinished step in its guide. If the Playground asks for your name and class, enter them and choose Main Task 1.", "重新打开上周使用的项目，按原指南找到第一个未完成的步骤。如果 Playground 要求姓名和班级，请填写，再选 Main Task 1。") +
    '</p><div class="playground-demos">' + features.map(([key, en, zh]) => screenshotDemo(key, words(en, zh))).join("") +
    '</div><div class="actions">' + link(playgroundLink, "Open last week’s Playground ↗", "打开上周 Playground ↗", { primary: true, external: true }) +
    link("playground/assets/Year9_WAGOLL_Studio.aia", "Download the four examples (.aia)", "下载四个例子（.aia）", { file: true }) + "</div>" +
    helpPanel(recovery) + '<label class="tick"><input type="checkbox" data-check="catchup"' + (state.checked.catchup ? " checked" : "") +
    "><span>" + t("I showed one working result in the project.", "我展示了项目中一个能运行的结果。") + "</span></label></section>";
}

function mergeWorkspace() {
  const lang = state.language === "bi" ? "&amp;lang=bi" : "";
  const guide = {
    help: words("Designer shows a globe where the WebViewer sits. Run the app in Companion to try the game.", "Designer 用地球图标标记 WebViewer 的位置。请在 Companion 运行应用来试玩。"),
    shots: [mitImages.upload, mitImages.liveViewerPalette, mitImages.mergeViewer],
  };
  return '<div class="merge-workspace"><section class="paper-card merge-preview"><h2>' +
    t("Try Merge 256", "试玩合成 256") + '</h2><p>' +
    t("Start with a left or right move. Watch two 2s become a 4. When you can explain what made them merge, try for 256.", "先向左或向右移动，观察两个 2 合成 4。能解释它们为什么合并后，再挑战 256。") +
    '</p><iframe class="merge-frame" title="' + esc(label(words("Play Merge 256", "试玩合成 256"))) + '" src="' +
    mergeAsset + '?embed=1' + lang + '"></iframe><div class="actions">' +
    link(mergeAsset + (lang ? "?lang=bi" : ""), "Open the game separately ↗", "在新窗口打开游戏 ↗", { external: true }) +
    '</div></section><section class="paper-card"><h2>' + t("Put it in your MIT app", "把游戏加入你的 MIT 应用") + '</h2>' +
    '<ol class="actions-list"><li>' +
    t("Open your existing project. Choose a game screen or add one called MergeGame. In Designer → Media, upload merge-256.html.", "打开已有项目，选一个游戏页面，或新建名为 MergeGame 的页面。在 Designer → Media 上传 merge-256.html。") +
    '</li><li>' + t("Drag WebViewer from User Interface onto the screen. Set Width and Height to Fill parent. In HomeUrl, enter the address below.", "从 User Interface 拖入 WebViewer，将 Width 和 Height 设为 Fill parent。在 HomeUrl 输入下方地址。") +
    '<p><code>http://localhost/merge-256.html</code></p></li><li>' +
    t("Run the game screen in Companion. Move left and check that 2 + 2 makes 4. Tap New game and check that the score returns to 0.", "用 Companion 运行游戏页面。先向左移动，检查两个 2 是否合成 4。再点 New game，检查分数是否归零。") +
    '</li></ol><div class="actions">' + link(mergeAsset, "Download merge-256.html", "下载 merge-256.html", { primary: true, file: true }) +
    mit() + '</div>' + helpPanel(guide) +
    starterGuide(mergeWebFile, mergeFile) + '<label class="tick"><input type="checkbox" data-check="merge"' + (state.checked.merge ? " checked" : "") +
    '><span>' + t("I showed a merge and restarted the game.", "我演示了一次合并，并重新开始了游戏。") + '</span></label></section></div>';
}

function diagram(complete) {
  return '<figure class="diagram"><figcaption>' + t("Block layout for your project", "本项目的积木结构") +
    '</figcaption><div class="event"><span>when ActionButton.Click</span><div class="event-body">' +
    '<div class="condition">if <span class="getter">ChoiceSpinner.Selection</span> = <code>Read</code>' +
    '<div class="branch"><strong>then</strong><div class="setter">set ResponseLabel.Text to <code>Fiction shelves</code></div></div>' +
    (complete === "first" ? "" : '<div class="branch"><strong>else</strong><div class="setter">set ResponseLabel.Text to <code>Quiet study tables</code></div></div>') +
    "</div></div></div></figure>";
}

function tests(group) {
  const cases = group === "vault" ? [words("Robots still in the room", "房间里仍有机器人"), words("Last robot cleared", "清除最后一个机器人"), words("Extraction gate", "撤离门")] :
    [words("Read", "阅读"), words("Study", "自习")];
  const results = group === "vault" ? [words("The top door stays closed.", "上方的门保持关闭。"), words("The door glows and becomes passable.", "门亮起，可以通过。"), words("After the boss, crossing the gate plays the victory animation.", "击败守卫后，穿过门会播放胜利动画。")] :
    [words("Fiction shelves", "小说书架"), words("Quiet study tables", "安静自习桌")];
  const choices = [["", "Choose what you saw", "选择观察结果"], ["matches", "Matches the brief", "符合任务要求"],
    ["different", "Something different appeared", "显示了其他内容"], ["pending", "Tester unavailable", "测试器不可用"]];
  return '<section class="test-sheet"><h3>' + t("What did you see in MIT?", "你在 MIT 里看到了什么？") + "</h3>" +
    cases.map((text, i) => {
      const key = (group === "vault" ? "vault-arcade" : group) + "-" + i;
      const value = state.tests[key] || "";
      return '<div class="test-row"><div><strong>' + tr(text) + '</strong><span class="expect">' + t("Expected", "预期") + " · " +
        tr(results[i]) + '</span></div><div><label class="sr-only" for="' + key + '">' + t("Actual result for ", "实际结果：") +
        tr(text) + '</label><select id="' + key + '" data-test="' + key + '">' + choices.map(([id, en, zh]) =>
        '<option value="' + id + '"' + (value === id ? " selected" : "") + ">" + esc(label(words(en, zh))) + "</option>").join("") +
        '</select><p class="test-feedback" id="' + key + '-feedback" role="status">' + testFeedback(value, group) + "</p></div></div>";
    }).join("") + "</section>";
}

function testFeedback(value, group) {
  if (value === "matches") return t("This choice is checked.", "此选项已检查。");
  if (group === "vault" && value === "different") return t("Check for a robot hiding behind cover. Once the gate glows, walk straight up through the opening.", "检查箱子后面是否还有机器人。门发光后，向上直走穿过门口。");
  if (group === "vault" && value === "pending") return t("MIT run pending. Try the controls in the browser example while you wait for help.", "MIT 待测试。等待帮助时，先在浏览器示例里试试操作。");
  if (value === "different") return t("Look inside this branch. Check the Spinner spelling and the message in the Label setter.", "查看这条分支。检查 Spinner 的拼写和 Label 设置积木中的文字。");
  if (value === "pending") return t("Run pending. Show your teacher which branch would run and what it should display.", "待测试。告诉老师会运行哪条分支、应显示什么。");
  return "";
}

function walk(group, items) {
  const active = Math.min(Math.max(Number(state.active[group]) || 0, 0), items.length - 1);
  const stepItem = items[active];
  const current = group + "-" + active;
  const isVault = group === "vault";
  let extra = "";
  if (isVault && active === 0) extra = '<div class="actions">' + link(vaultAsset, "Download circuit-vault.html", "下载 circuit-vault.html", { primary: true, file: true }) + "</div>";
  if ((!isVault && active === 4) || (isVault && active === items.length - 1)) extra = tests(group);
  if (!isVault && active === 0) extra = '<div class="actions">' + link(practiceFile, "Download the Library Helper starter", "下载 Library Helper 起始项目", { primary: true, file: true }) + mit() + "</div>";
  if (!isVault && (active === 2 || active === 3)) {
    const complete = active === 2 ? "first" : "two";
    extra = '<details class="model-panel"><summary>' + (active === 2 ? t("See the worked Read branch", "看 Read 分支示例") :
      t("Compare your Study branch with the model", "对照 Study 分支示例")) + "</summary>" + diagram(complete) + "</details>";
  }
  const advance = active < items.length - 1 ?
    btn("Next step →", "下一步 →", 'data-step="' + group + ":" + (active + 1) + '"', "primary") :
    link(isVault ? "#main-2" : "#extension", isVault ? "Main Task 2 →" : "Extension →", isVault ? "主任务二 →" : "拓展挑战 →", { primary: true });
  return '<div class="workspace-grid"><section class="paper-card step-card" id="current-step" tabindex="-1">' +
    '<p class="eyebrow">' + t("Step " + (active + 1) + " of " + items.length, "第 " + (active + 1) + " 步，共 " + items.length + " 步") +
    '</p><h2>' + tr(stepItem.title) + '</h2><p class="step-goal">' + tr(stepItem.goal) + '</p><ol class="actions-list">' +
    stepItem.actions.map((action) => "<li>" + tr(action) + "</li>").join("") + "</ol>" +
    '<p class="success"><strong>' + t("It works when", "成功标准") + "</strong>" + tr(stepItem.done) + "</p>" +
    helpPanel(stepItem) + extra + '<label class="tick"><input type="checkbox" data-check="' + current + '"' +
    (state.checked[current] ? " checked" : "") + '><span>' + t("I’ve done this step", "我已完成这一步") + "</span></label>" +
    '<div class="actions step-actions">' + (active > 0 ? btn("← Previous step", "← 上一步", 'data-step="' + group + ":" + (active - 1) + '"') : "") +
    advance + '</div></section><aside class="step-list"><h3>' + t("Your build", "制作步骤") +
    '</h3><ol>' + items.map(({ title }, i) => '<li><button type="button" data-step="' + group + ":" + i + '"' +
    (i === active ? ' aria-current="step"' : "") + '><span class="step-no" aria-hidden="true">' +
    (state.checked[group + "-" + i] ? "✓" : number(i + 1)) + '</span><span>' + tr(title) + "</span></button></li>").join("") +
    "</ol></aside></div>";
}

function foodWorkspace(route) {
  const { name, file, starter, target, extend, media } = foodProjects[route];
  const directory = "assets/projects/";
  const lang = state.language === "bi" ? "&amp;lang=bi" : "";
  const source = directory + file;
  const help = {
    help: words("Use the screenshots to find Media and WebViewer. If Test in Web opens a blank screen after switching projects, refresh the MIT editor tab and try again.", "用截图找出 Media 和 WebViewer。如果切换项目后 Test in Web 打开空白页，请刷新 MIT 编辑器标签页再试。"),
    shots: [mitImages.upload, mitImages.liveViewerPalette, mitImages.liveTest],
  };
  return '<div class="merge-workspace"><section class="paper-card merge-preview"><h2>' + tr(name) + '</h2><p>' + tr(target) +
    '</p><iframe class="merge-frame food-frame" title="' + esc(label(name)) + '" src="' + source + '?embed=1' + lang + '"></iframe>' +
    link(source + (lang ? "?lang=bi" : ""), "Open in a larger window ↗", "在大窗口打开 ↗", { external: true }) +
    '</section><section class="paper-card">' + starterGuide(directory + starter + "_Web.aia", directory + starter + ".aia") +
    '<details class="help-panel"><summary>' + t("Add it to your own app", "添加到自己的应用") + '</summary><div class="help-body"><ol class="actions-list"><li>' +
    t("Download every file listed below. Keep the filenames and upload all the files in Designer → Media.", "下载下方列出的每个文件。保留原文件名，并在 Designer → Media 上传全部文件。") +
    '</li><li>' + t("Add a WebViewer and set Width and Height to Fill parent. Use this HomeUrl when testing on Companion.", "添加 WebViewer，将 Width 和 Height 设为 Fill parent。在 Companion 测试时使用这个 HomeUrl。") +
    '<p><code>http://localhost/' + file + '</code></p></li></ol><div class="actions">' + link(source, file, "", { file: true }) +
    media.map(([asset, en, zh]) => link(directory + asset, en, zh, { file: true })).join("") + '</div>' +
    helpPanel(help) + '</div></details><h3>' + t("Try a second case", "再试一种情况") + '</h3><p>' + tr(extend) + '</p></section></div>';
}

function mainOne() {
  return head("Main Task 1", "主任务一", "Build in your own app", "在自己的应用中制作",
    "Continue last week’s work or add one feature. Show a partner a working interaction before you move on.", "继续上周的项目，或添加一个功能。进入下一任务前，向同伴展示一个可用的互动。") +
    routes() + (Object.hasOwn(featureGuides, state.route) ? featureGuide(state.route) : "") +
    (state.route === "playground" ? playground() : "") +
    (state.route === "merge" ? mergeWorkspace() : "") +
    (Object.hasOwn(foodProjects, state.route) ? foodWorkspace(state.route) : "") +
    (state.route === "vault" ? '<div class="paper-card workspace-tools"><div class="actions">' +
      link(vaultAsset + (state.language === "bi" ? "?lang=bi" : ""), "Play Circuit Vault ↗", "试玩电路密室 ↗", { external: true }) +
      '</div>' + starterGuide(vaultWebFile, vaultFile) + '</div>' +
      walk("vault", V) : nextStage("main-2", "Main Task 2", "主任务二"));
}

function mainTwo() {
  return head("Main Task 2", "主任务二", "Build a Library Helper", "制作图书馆小助手",
    "Use the practice starter to rehearse Wednesday’s workflow. Make one screen, build two results, then check and export the project.", "用起始项目演练周三的操作。制作一个界面，完成两种结果，然后检查并导出。") +
    '<div class="brief"><div><h2>' + t("The brief", "任务要求") + '</h2><p>' + t("Help a user choose where to go in the library. They choose an activity and tap Show location.", "帮用户决定去图书馆的哪里。选活动，然后点击 Show location。") +
    '</p></div><div class="results-key"><p><strong>Read</strong><span aria-hidden="true">→</span>' + t("Fiction shelves", "小说书架") +
    '</p><p><strong>Study</strong><span aria-hidden="true">→</span>' + t("Quiet study tables", "安静自习桌") + "</p></div></div>" +
    '<div class="actions workspace-tools">' + mit() + link(practiceFile, "Library_Helper_Practice.aia ↓", "下载练习项目", { file: true }) + "</div>" +
    featureGuide("library", words("What both tests should show", "两个测试应显示什么")) + walk("library", L);
}

function extension() {
  const steps = {
    help: words("In Blocks, place call VaultView.GoHome inside when PlayAgainButton.Click. GoHome reloads the arcade game and returns to the start screen.", "在 Blocks 中，把 call VaultView.GoHome 接到 when PlayAgainButton.Click 里。GoHome 重新加载街机游戏并回到开始画面。"),
    shots: [mitImages.addButton, mitImages.button, mitImages.liveViewer],
  };
  return head("Extension", "拓展挑战", "Make the Vault better", "改进方块密室",
    "When your Library Helper is checked and saved, improve the Vault and try the change with a partner.", "检查并保存图书馆小助手后，改进方块密室，请同伴试试你的改动。") +
    '<div class="extension-grid"><section class="paper-card"><h2>' + t("Write a better clue", "写更清楚的线索") + '</h2><p>' +
    t("In Designer, add a Label above VaultView. In Text, write a short hint that explains when to dodge. Ask a partner to play the first room using your hint.", "在 Designer 中，在 VaultView 上方添加 Label。在 Text 写一句提示何时翻滚的话，请同伴用它挑战第一个房间。") +
    '</p></section><section class="paper-card"><h2>' + t("Add Play again", "添加再玩一次") + "</h2><p>" +
    t("Add a native MIT Button called PlayAgainButton above VaultView. Inside its Click event, call VaultView.GoHome. Try it after completing the first room.", "在 VaultView 上方添加 MIT 按钮 PlayAgainButton。把 call VaultView.GoHome 放进它的 Click 事件。完成第一个房间后试试按钮。") +
    "</p>" + helpPanel(steps) + "</section></div>" + featureGuide("replay", words("Check the restart", "检查重新开始功能")) +
    '<p class="subtle">' + t("Worked on a different feature last week? Use the finished example as a separate practice copy for this challenge.", "上周做了别的功能？可导入完成版示例，单独练习这个挑战。") + "</p>" +
    '<div class="actions">' + link(vaultWebFile, "Browser tester starter (.aia)", "浏览器测试版（.aia）", { file: true }) +
    link(vaultFile, "Companion starter (.aia)", "Companion 版（.aia）", { file: true }) + "</div>" +
    nextStage("pitstop", "Learning Pit Stop", "学习停靠站");
}

const phases = [
  ["new", words("New learning", "新学习"), words("This was new. I’m starting to make it work.", "这是新内容。我开始做得出来了。")],
  ["consolidating", words("Consolidating", "巩固学习"), words("I knew the idea and got better at using it.", "我知道这个思路，今天用得更熟练了。")],
  ["treading", words("Treading water", "需要更多挑战"), words("This felt easy. I’m ready for a bigger challenge.", "这对我很容易，可以试更难的挑战。")],
  ["drowning", words("Drowning", "需要帮助"), words("I’m still stuck and need someone to help me get started.", "我仍然卡住，需要有人帮我开始。")],
];

function pitstop() {
  return head("Learning Pit Stop", "学习停靠站", "How did the two results feel?", "做出两个结果时感觉如何？",
    "Think about making one button show the right result for each choice. Pick the phase that fits your confidence now.", "想想怎样让一个按钮根据选项显示不同结果。选一个最符合你目前信心的阶段。") +
    '<fieldset class="phase-options"><legend class="sr-only">Choose a learning phase</legend>' +
    phases.map(([id, title, intro]) => '<label class="radio-card"><input type="radio" name="phase" value="' + id + '"' +
      (state.phase === id ? " checked" : "") + "><span><strong>" + tr(title) + '</strong><span class="option-copy">' +
      tr(intro) + "</span></span></label>").join("") + "</fieldset>" + nextStage("plenary", "Plenary", "课堂总结");
}

function plenary() {
  return head("Plenary", "课堂总结", "Ready for Wednesday", "为周三做好准备",
    "Tell a partner how you’ll start, check and hand in your app. Use the practice project to show them if that helps.", "告诉同伴你会如何开始、检查和提交应用。需要时可用练习项目演示。") +
    '<section class="paper-card exit-card"><div><ol class="actions-list"><li>' +
    t("Where will you start in Designer when you open the starter?", "打开起始项目后，你会先到 Designer 的哪里？") + "</li><li>" +
    t("What will you check after you tap the button for each choice?", "每种选项都点按钮后，你会检查什么？") + "</li><li>" +
    t("Which file will you hand in, and where can you find it?", "你会提交哪个文件？在哪里找？") + '</li></ol><details class="help-panel"><summary>' +
    t("Check your plan", "核对你的计划") + '</summary><div class="help-body"><p>' +
    t("Open Designer and find the first edit in the brief. Run both choices and compare both messages with the brief. Export the editable .aia and find it in Downloads or Files.", "打开 Designer，找到任务要求的第一处改动。试两个选项，把结果和要求比较。导出 .aia，并在 Downloads 或 Files 中找到。") +
    '</p></div></details></div><img class="exit-guide" src="assets/art/success.png" alt="" loading="lazy"></section>' +
    '<div class="stage-footer">' + link("#main-2", "Review Main Task 2", "复习主任务二") + "</div>";
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
  if (control.name === "route") {
    state.route = control.value;
    render("main-1");
    main.querySelector('[name="route"]:checked')?.focus({ preventScroll: true });
    return;
  }
  if (control.name === "focus" || control.name === "phase") state[control.name] = control.value;
  if (control.dataset.check) {
    const key = control.dataset.check;
    state.checked[key] = control.checked;
    const stepButton = main.querySelector('.step-list [data-step="' + key.replace(/-(\d+)$/, ":$1") + '"] .step-no');
    if (stepButton) stepButton.textContent = control.checked ? "✓" : number(Number(key.split("-")[1]) + 1);
  }
  if (control.dataset.test) {
    const key = control.dataset.test;
    state.tests[key] = control.value;
    document.getElementById(key + "-feedback").innerHTML = testFeedback(control.value, key.split("-")[0]);
  }
  save();
});

main.addEventListener("click", (event) => {
  const demo = event.target.closest("[data-demo]");
  if (demo) {
    const playing = demo.getAttribute("aria-pressed") === "true";
    const path = "assets/guides/" + demo.dataset.demo;
    demo.closest("figure").querySelector("img").src = path + (playing ? "-still.webp" : ".webp");
    demo.setAttribute("aria-pressed", String(!playing));
    demo.innerHTML = playing ? t("Play screenshot demo", "播放截图演示") : t("Stop demo", "停止演示");
    return;
  }
  const stepButton = event.target.closest("[data-step]");
  if (stepButton) {
    const [group, index] = stepButton.dataset.step.split(":");
    state.active[group] = Number(index);
    render(state.stage);
    const stepCard = document.querySelector("#current-step");
    stepCard.focus({ preventScroll: true });
    stepCard.scrollIntoView({ block: "start" });
  }
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

const initial = stageFromUrl() || (location.hash === "#do-now" ? "start" : state.stage);
render(Object.hasOwn(views, initial) ? initial : "start");
