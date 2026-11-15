"use strict";

const words = (en, zh) => [en, zh];
const image = (name, en, zh, bilingual = false) => ({ name, caption: words(en, zh), bilingual });
const capture = (name, en, zh, marks) => ({ name, caption: words(en, zh), marks });

const stageNames = [
  ["start", words("Read First & Do Now", "先看示例与热身")],
  ["types", words("Types of Learning", "学习类型")],
  ["main-1", words("Main Task 1", "主任务一")],
  ["main-2", words("Main Task 2", "主任务二")],
  ["extension", words("Extension", "拓展挑战")],
  ["pitstop", words("Learning Pit Stop", "学习停靠站")],
  ["plenary", words("Plenary", "课堂总结")],
];

const mitImages = {
  liveViewerPalette: capture("vault-live-palette.jpg",
    "1. Find WebViewer near the bottom of User Interface in the Palette. 2. Drag it into the phone preview. The globe is the Designer placeholder.",
    "1. 在 Palette 的 User Interface 列表底部找到 WebViewer。2. 将它拖入手机预览。地球图标是 Designer 的占位图。",
    [[.1,34.6,20.3,4.8],[29.4,17.9,27.1,78.3]]),
  liveViewer: capture("vault-live-webviewer.jpg",
    "1. Select VaultView in Components. 2. Set HomeUrl to http://localhost/circuit-vault.html. 3. Upload circuit-vault.html in Media. The screenshot shows the fields in an earlier Vault project.",
    "1. 在 Components 选中 VaultView。2. 把 HomeUrl 设为 http://localhost/circuit-vault.html。3. 在 Media 上传 circuit-vault.html。截图使用早期密室项目演示这些字段。",
    [[68,18.8,8.6,5],[83,49.4,9.8,7.5],[69,92,8.6,4.6]]),
  liveImport: capture("vault-import-menu.jpg",
    "1. Open Projects. 2. Select Import project (.aia) from my computer. If you are on the projects list, the folder icon opens the same import dialog.",
    "1. 打开 Projects。2. 选择 Import project (.aia) from my computer。项目列表里的文件夹图标也能打开同一个导入窗口。",
    [[36.5,1.1,8.9,4.4],[36.5,11,25,4]]),
  liveTest: capture("vault-connect.jpg",
    "1. Open Connect. 2. Select Test in Web if it is available. App Inventor Companion is the option just above it.",
    "1. 打开 Connect。2. 如果看到 Test in Web，就点击它。App Inventor Companion 选项在它正上方。",
    [[45.5,1.1,9.2,4.2],[45.6,10.8,11.45,4.35]]),
  importDialog: image("import-dialog.png", "Choose the downloaded .aia in Downloads or Files. Confirm the import to open the project.", "在 Downloads 或 Files 中选中下载的 .aia 文件，确认导入后打开项目。"),
  upload: image("upload", "In the Designer Media panel, select Upload File and choose your asset.", "在 Designer 的 Media（媒体）面板点击 Upload File，再选中要上传的资源。", true),
  companion: image("S15-connect-companion.png", "Use Connect → AI Companion on a class iPad if Companion is ready. Use the code shown by MIT.", "如果课堂 iPad 已安装 Companion，可选择 Connect → AI Companion，用 MIT 显示的连接码配对。"),
};
