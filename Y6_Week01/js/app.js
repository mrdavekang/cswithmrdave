(function () {
  "use strict";
  const CFG = window.LAB_CONFIG || {};
  const S = window.LabStore;

  function showStartupFailure() {
    function show() {
      const main = document.getElementById("main");
      if (!main) return;
      main.innerHTML = "<section class='screen welcome'><div class='welcome-hero'><div><p class='eyebrow'>Year 6 Computing</p><h1>We could not open the lesson</h1><p>Your work is safe. Refresh the page once, or ask your teacher to open the published GitHub Pages link.</p></div><div class='hero-symbol' aria-hidden='true'>!</div></div><div class='welcome-form'><h2>Teacher check</h2><p>This browser may be blocking scripts or storage on a file opened directly from the computer.</p><button class='btn' type='button' onclick='location.reload()'>Try again</button></div></section>";
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show, { once:true });
    else show();
  }

  function sessionGet(key) { try { return window.sessionStorage.getItem(key); } catch (e) { return null; } }
  function sessionSet(key, value) { try { window.sessionStorage.setItem(key, value); } catch (e) {} }
  function sessionRemove(key) { try { window.sessionStorage.removeItem(key); } catch (e) {} }

  if (!S || typeof S.load !== "function") { showStartupFailure(); return; }

  let state;
  try { state = S.load(); } catch (e) { showStartupFailure(); return; }
  let teacherMode = sessionGet("y6_teacher") === "1";
  let speech = null;

  const CORE = ["starter","learningTypes","main1","main2","pitstop","plenary","reflection"];
  const PATH = [
    { id:"starter", label:"Do Now" },
    { id:"learningTypes", label:"How I Learn" },
    { id:"main1", label:"Main Task" },
    { id:"pitstop", label:"Pitstop" },
    { id:"plenary", label:"Plenary" },
    { id:"reflection", label:"Reflection" }
  ];
  const STEP_COUNTS = { starter:3, learningTypes:2, main1:3, main2:6, extension:8, plenary:1, reflection:1 };
  const IMG = "assets/learning/";

  const SUPPORT = {
    ms: {
      label:"Bahasa Melayu",
      locale:"ms-MY",
      overview:"Hari ini kita akan menyusun kerja digital dan menerangkan bagaimana input menghasilkan output.",
      starter:"Lihat gambar. Pilih jawapan yang menunjukkan rutin Mula–Kerja–Tamat yang betul.",
      learningTypes:"Fikir tentang cara anda belajar: mengingat pengetahuan, mempraktikkan kemahiran dan menerangkan pemahaman.",
      main1:"Ikut setiap langkah untuk membina struktur folder dan nama fail yang mudah dicari.",
      main2:"Ramalkan dahulu, bina kod, uji, kemudian ubah satu perkara dan terangkan kesannya.",
      pitstop:"Berhenti seketika. Pilih keadaan pembelajaran anda dengan jujur supaya langkah seterusnya sesuai.",
      plenary:"Gunakan apa yang anda pelajari untuk menjawab soalan akhir.",
      reflection:"Fikir tentang cara anda bertambah baik dan pilih satu langkah untuk pelajaran seterusnya.",
      words:"algoritma = algorithm · input = input · output = output · fail = file · folder = folder · uji = test · nyahpepijat = debug"
    },
    zh: {
      label:"简体中文",
      locale:"zh-CN",
      overview:"今天我们要整理电子作品，并解释输入如何让程序产生输出。",
      starter:"观察图片。选择能正确表示“开始—工作—结束”流程的答案。",
      learningTypes:"思考你的学习方式：记忆知识、练习技能，以及解释自己的理解。",
      main1:"按步骤建立容易寻找的文件夹结构和文件名。",
      main2:"先预测，再搭建代码并测试；然后修改一个地方并解释结果。",
      pitstop:"暂停一下。诚实选择你现在的学习状态，以便获得合适的下一步。",
      plenary:"运用今天所学完成最后的问题。",
      reflection:"思考你是怎样进步的，并为下一节课选择一个行动。",
      words:"算法 = algorithm · 输入 = input · 输出 = output · 文件 = file · 文件夹 = folder · 测试 = test · 调试 = debug"
    }
  };
  const TASK_SUPPORT = {
    starter1:{ms:"Baca tiga bahagian pelajaran Aisha. Perhatikan apa yang dia lakukan dan mengapa setiap tindakan penting.",zh:"阅读 Aisha 课堂中的三个阶段。注意她做了什么，以及每个行动为什么重要。"},
    starter2:{ms:"Baca situasi. Gunakan tujuan tindakan untuk memilih Mula, Kerja atau Tamat.",zh:"阅读情境。根据行动的目的选择“开始、工作或结束”。"},
    starter3:{ms:"Pilih urutan penutup yang melindungi kerja, akaun dan murid seterusnya.",zh:"选择能保护作品、账户和下一位同学的结束顺序。"},
    learning1:{ms:"Pilih semua jenis pembelajaran yang anda gunakan dalam aktiviti awal. Anda boleh memilih lebih daripada satu.",zh:"选择你在开始活动中使用的所有学习类型。你可以选择多项。"},
    learning2:{ms:"Pilih satu strategi yang akan membantu anda dalam tugasan utama hari ini.",zh:"选择一种能帮助你完成今天主要任务的学习策略。"},
    main1_1:{ms:"Baca masalah Aisha. Tentukan bila dia perlu bertindak dan terangkan sebabnya.",zh:"阅读 Aisha 遇到的问题。判断她何时应该行动，并解释原因。"},
    main1_2:{ms:"Pelajari perbezaan antara fail dan folder, kemudian pilih laluan yang paling mudah dicari.",zh:"先学习文件与文件夹的区别，再选择最容易寻找的路径。"},
    main1_3:{ms:"Cipta laluan tiga folder pada komputer sekolah. Tambah tangkap layar atau minta guru menyemaknya.",zh:"在学校电脑上建立三级文件夹路径。添加截图，或请老师直接检查。"},
    main1_4:{ms:"Bandingkan nama fail dan pilih nama yang masih jelas pada minggu hadapan.",zh:"比较文件名，选择下周仍然清楚易懂的名称。"},
    main1_5:{ms:"Gunakan semakan ini untuk menerangkan bagaimana folder dan nama fail bekerja bersama.",zh:"完成检查，并说明文件夹和文件名如何共同帮助我们整理作品。"},
    main2_1:{ms:"Bantu Aisha mencari tempat memilih blok, membina kod dan melihat output.",zh:"帮助 Aisha 找到选择积木、搭建代码和观察输出的位置。"},
    main2_2:{ms:"Baca blok dari atas ke bawah. Ramalkan input dan kedua-dua output sebelum membuka Scratch.",zh:"从上到下阅读积木。在打开 Scratch 前预测输入和两个输出。"},
    main2_3:{ms:"Buka Scratch dalam tab baharu, bina skrip tiga blok dengan tepat, kemudian simpan menggunakan nama yang dipersetujui.",zh:"在新标签页打开 Scratch，准确搭建三块积木脚本，再用约定的文件名保存。"},
    main2_4:{ms:"Tekan anak panah kanan tiga kali. Bandingkan hasil dengan ramalan dan periksa satu blok pada satu masa.",zh:"按右方向键三次。把结果与预测比较，并一次检查一块积木。"},
    main2_5:{ms:"Tambah skrip anak panah kiri. Pastikan kekunci, nilai x dan mesej semuanya sepadan.",zh:"添加左方向键脚本。确保按键、x 数值和信息互相一致。"},
    main2_6:{ms:"Tambah bukti yang menunjukkan kedua-dua skrip, kemudian terangkan bagaimana satu input menghasilkan output.",zh:"添加能清楚显示两个脚本的证据，再解释一个输入如何产生输出。"},
    pitstop:{ms:"Pilih keadaan pembelajaran anda sekarang. Pilihan anda akan menunjukkan langkah bantuan atau cabaran yang sesuai.",zh:"选择你现在的学习状态。你的选择会显示合适的帮助或挑战。"},
    ext_o1:{ms:"Selesaikan tiga masalah rutin makmal dan gunakan tujuan tindakan untuk memilih jawapan.",zh:"解决三个电脑室常规问题，并根据行动目的选择答案。"},
    ext_o2:{ms:"Gunakan hierarki untuk menentukan lokasi fail dan folder yang betul.",zh:"运用层级结构判断文件和文件夹的正确位置。"},
    ext_o3:{ms:"Baiki nama fail yang kabur dan terangkan satu peraturan penamaan yang berguna.",zh:"改进含糊的文件名，并解释一条有用的命名规则。"},
    ext_p1:{ms:"Bina dan uji kawalan kiri dan kanan menggunakan nilai x yang bertentangan.",zh:"使用相反的 x 数值搭建并测试左右控制。"},
    ext_p2:{ms:"Tambah kawalan atas dan bawah menggunakan paksi y dan tanda yang betul.",zh:"使用 y 轴和正确的正负号添加上下控制。"},
    ext_p3:{ms:"Cari laluan terpendek dari (0, 0) ke (80, 40) dan jelaskan mengapa ia berfungsi.",zh:"找出从 (0, 0) 到 (80, 40) 的最短路线，并解释原因。"},
    ext_p4:{ms:"Gunakan output yang salah sebagai bukti untuk mencari dan membaiki pepijat.",zh:"把错误输出当作证据，找出并修复程序错误。"},
    ext_p5:{ms:"Cipta sasaran yang boleh dicapai, tulis laluan terpendek dan terangkan cara menyemaknya.",zh:"设计一个可到达的目标，写出最短路线，并说明检查方法。"},
    plenary1:{ms:"Gunakan apa yang anda pelajari untuk menjawab dua soalan dan menerangkan satu hubungan input-output.",zh:"运用今天所学回答两个问题，并解释一个输入—输出关系。"},
    reflection:{ms:"Pilih jenis pembelajaran dan strategi yang paling membantu, kemudian tulis satu langkah seterusnya.",zh:"选择最有帮助的学习类型和策略，然后写下一个下一步。"}
  };
  const GLOSSARY = {
    algorithm:"A precise set of ordered steps.", sequence:"The order in which instructions happen.",
    input:"An action or signal the computer receives, such as a key press.",
    output:"What the computer does, such as movement, sound or a message.",
    coordinate:"A pair of numbers that describes a position: (x, y).",
    test:"Run a program to check what happens.", debug:"Find and fix a problem in an algorithm or program.",
    file:"A saved piece of work.", folder:"A container used to organise files and other folders."
  };

  function $(q, root) { return (root || document).querySelector(q); }
  function esc(v) { return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function el(tag, attrs, children) {
    const n = document.createElement(tag); attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "checked") n.checked = attrs[k];
      else if (k === "value") n.value = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (typeof c === "string") n.appendChild(document.createTextNode(c)); else if (c) n.appendChild(c); });
    return n;
  }
  function save() { S.save(); updateChrome(); }
  function answered(key) { return !!state.answers[key]; }
  function correct(key) { return answered(key) && state.answers[key].correct !== false; }
  function complete(id) { if (state.completed.indexOf(id) < 0) state.completed.push(id); save(); }
  function unlocked(id) {
    if (teacherMode || id === "welcome" || id === "support" || id === "overview") return true;
    if (id === "starter") return state.completed.indexOf("overview") >= 0;
    if (id === "learningTypes") return state.completed.indexOf("starter") >= 0;
    if (id === "main1") return state.completed.indexOf("learningTypes") >= 0;
    if (id === "main2") return state.completed.indexOf("main1") >= 0;
    if (id === "extension") return state.completed.indexOf("main2") >= 0;
    if (id === "pitstop") return state.completed.indexOf("main2") >= 0;
    if (id === "plenary") return state.completed.indexOf("pitstop") >= 0;
    if (id === "reflection") return state.completed.indexOf("plenary") >= 0;
    if (id === "report") return state.completed.indexOf("reflection") >= 0;
    return false;
  }
  function toast(message) {
    const root = $("#toastRoot"); root.innerHTML = "";
    const t = el("div", { class:"toast", text:message }); root.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 3200);
  }
  function clearMain() { stopSpeech(); const m = $("#main"); m.innerHTML = ""; return m; }
  function go(id, preserve) {
    if (!unlocked(id)) { toast("Finish the activity before this one first."); return; }
    state.current = id; save();
    const y = window.scrollY;
    const routes = { welcome:renderWelcome, support:renderSupport, overview:renderOverview, starter:renderStarter, learningTypes:renderLearningTypes, main1:renderMain1, main2:renderMain2, extension:renderExtension, pitstop:renderPitstop, plenary:renderPlenary, reflection:renderReflection, report:renderReport };
    (routes[id] || renderWelcome)(); updateChrome();
    requestAnimationFrame(function () { if (preserve) window.scrollTo(0,y); else { window.scrollTo(0,0); $("#main").focus({preventScroll:true}); } });
  }
  function setStep(section, value) {
    state.steps[section] = value; save(); go(section, true);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      const card = document.querySelector(".lesson-card");
      if (card) window.scrollTo({ top:Math.max(0, card.offsetTop - 135), behavior:"auto" });
    }); });
  }

  function stopSpeech() { if (window.speechSynthesis) window.speechSynthesis.cancel(); speech = null; }
  function speak(text) {
    if (!window.speechSynthesis || state.settings.muted || !state.profile.readAloud) return;
    stopSpeech(); speech = new SpeechSynthesisUtterance(text);
    speech.lang = SUPPORT[state.profile.language] ? SUPPORT[state.profile.language].locale : "en-GB";
    speech.rate = .92; window.speechSynthesis.speak(speech);
  }
  function instruction(text, section, supportKey) {
    const box = el("div", { class:"do-this" });
    box.appendChild(el("strong", { text:"Do this: " })); box.appendChild(document.createTextNode(text));
    const language = state.profile.language;
    const specific = supportKey && TASK_SUPPORT[supportKey] ? TASK_SUPPORT[supportKey][language] : "";
    const t = SUPPORT[language];
    const translated = specific || (t && t[section]) || "";
    if (CFG.ENABLE_READ_ALOUD && state.profile.readAloud) {
      const b = el("button", { type:"button", class:"icon-button", style:"margin-left:.6rem", text:"Read aloud" });
      b.addEventListener("click", function () { speak(translated || text); }); box.appendChild(b);
    }
    if (translated) box.appendChild(el("div", { class:"support-line", lang:language, text:translated }));
    return box;
  }
  function supportText(section) {
    const t = SUPPORT[state.profile.language];
    return t && t[section] ? el("div", { class:"support-line", lang:state.profile.language, text:t[section] }) : null;
  }
  function visual(file, alt, caption) {
    const fig = el("figure", { class:"learning-visual" });
    const btn = el("button", { type:"button", "aria-label":"Enlarge image: " + alt });
    const img = el("img", { src:IMG + file, alt:alt, loading:"lazy" }); btn.appendChild(img);
    btn.addEventListener("click", function () { openImage(IMG + file, alt); });
    btn.setAttribute("title","Open a larger view");
    fig.appendChild(btn); fig.appendChild(el("figcaption", { text:caption })); return fig;
  }
  function openImage(src, alt) {
    const root = $("#modalRoot"); root.innerHTML = "";
    const bg = el("div", { class:"image-dialog", role:"dialog", "aria-modal":"true", "aria-label":alt });
    const inner = el("div", { class:"image-dialog-inner" }); inner.appendChild(el("img", { src:src, alt:alt }));
    const close = el("button", { type:"button", class:"btn", text:"Close image" }); close.addEventListener("click", function () { root.innerHTML = ""; });
    inner.appendChild(close); bg.appendChild(inner); root.appendChild(bg); close.focus();
  }
  function modal(title, build) {
    const root = $("#modalRoot"); root.innerHTML = "";
    const bg = el("div", { class:"modal-backdrop" }); const box = el("div", { class:"modal", role:"dialog", "aria-modal":"true" });
    box.appendChild(el("h2", { text:title })); build(box, function () { root.innerHTML = ""; }); bg.appendChild(box); root.appendChild(bg);
  }

  function updateChrome() {
    const header = $("#appHeader"), progress = $("#progressWrap");
    const visible = state.current !== "welcome" && !!state.student.name;
    header.hidden = !visible; progress.hidden = !visible;
    if (!visible) return;
    $("#headerStudent").textContent = (teacherMode ? "Teacher preview" : state.student.name + " · " + state.student.className);
    const nav = $("#lessonPath"); nav.innerHTML = "";
    PATH.forEach(function (p) {
      const isMain = p.id === "main1";
      const isCurrent = isMain ? (state.current === "main1" || state.current === "main2" || state.current === "extension") : state.current === p.id;
      const isDone = isMain ? (state.completed.indexOf("main1") >= 0 && state.completed.indexOf("main2") >= 0) : state.completed.indexOf(p.id) >= 0;
      const b = el("button", { type:"button", class:"path-item" + (isCurrent ? " current" : "") + (isDone ? " done" : "") + (teacherMode ? " teacher" : ""), text:p.label });
      b.disabled = !teacherMode; if (teacherMode) b.addEventListener("click", function () { go(p.id); }); nav.appendChild(b);
    });
    const done = ["starter","learningTypes","main1","main2","pitstop","plenary","reflection"].filter(function (x) { return state.completed.indexOf(x) >= 0; }).length;
    const pct = Math.round(done / 7 * 100); $("#progressFill").style.width = pct + "%"; $("#progressBar").setAttribute("aria-valuenow", String(pct));
    $("#btnSound").textContent = state.settings.muted ? "Sound off" : "Sound on"; $("#btnSound").setAttribute("aria-pressed", String(state.settings.muted));
  }

  function renderWelcome() {
    const main = clearMain(); const screen = el("section", { class:"screen welcome" });
    const hero = el("div", { class:"welcome-hero" });
    const copy = el("div"); copy.appendChild(el("p", { class:"eyebrow", text:"Year 6 · Computing · 60 minutes" }));
    copy.appendChild(el("h1", { text:"Ready, organise, program." }));
    copy.appendChild(el("p", { text:"A clear, step-by-step lesson about digital organisation and Scratch inputs, outputs and coordinates." }));
    hero.appendChild(copy); hero.appendChild(el("div", { class:"hero-art", html:"<span>→</span>" })); screen.appendChild(hero);

    const form = el("form", { class:"welcome-form", novalidate:"" }); form.appendChild(el("h2", { text:"Start your lesson" }));
    form.appendChild(el("p", { text:"Your work stays on this computer until you export the final PDF." }));
    const grid = el("div", { class:"form-grid" });
    const nf = el("div", { class:"field" }); nf.appendChild(el("label", { for:"studentName", text:"Your name" }));
    const name = el("input", { id:"studentName", type:"text", autocomplete:"off", maxlength:"60", value:state.student.name, placeholder:"Type your name" }); nf.appendChild(name); grid.appendChild(nf);
    const cf = el("div", { class:"field" }); cf.appendChild(el("label", { for:"studentClass", text:"Your class" }));
    const cls = el("input", { id:"studentClass", type:"text", autocomplete:"off", maxlength:"30", value:state.student.className, placeholder:"Type your class" }); cf.appendChild(cls); grid.appendChild(cf); form.appendChild(grid);

    const lf = el("fieldset", { class:"field" }); lf.appendChild(el("legend", { text:"Language support" })); const langs = el("div", { class:"choice-row" });
    [["en","English"],["ms","Bahasa Melayu"],["zh","简体中文"]].forEach(function (o) {
      const lab = el("label", { class:"choice-card" }); const radio = el("input", { type:"radio", name:"language", value:o[0], checked:state.profile.language === o[0] }); lab.appendChild(radio); lab.appendChild(document.createTextNode(o[1])); langs.appendChild(lab);
    }); lf.appendChild(langs); form.appendChild(lf);
    const rf = el("fieldset", { class:"field" }); rf.appendChild(el("legend", { text:"How would you like to answer?" })); const modes = el("div", { class:"choice-row" });
    [["guided","Visual choices + sentence frames"],["independent","Independent full explanations"]].forEach(function (o) {
      const lab = el("label", { class:"choice-card" }); const radio = el("input", { type:"radio", name:"mode", value:o[0], checked:state.profile.responseMode === o[0] }); lab.appendChild(radio); lab.appendChild(document.createTextNode(o[1])); modes.appendChild(lab);
    }); rf.appendChild(modes); form.appendChild(rf);
    const err = el("div", { class:"field-error", "aria-live":"polite" }); form.appendChild(err);
    const start = el("button", { type:"submit", class:"btn", text:"Start lesson →" }); form.appendChild(el("div", { class:"button-row end" }, [start]));
    form.addEventListener("submit", function (e) {
      e.preventDefault(); const n = name.value.trim(); const c = cls.value.trim();
      if (n.toLowerCase() === String(CFG.TEACHER_WORD || "teacher").toLowerCase()) {
        teacherMode = true; sessionSet("y6_teacher","1"); state.student = { name:"Teacher", className:"Preview" }; state.startedAt = state.startedAt || new Date().toISOString(); save(); go("overview"); return;
      }
      if (n.length < 2 || !c) { err.textContent = "Please type your name and class before you continue."; return; }
      state.student = { name:n, className:c };
      state.profile.language = form.querySelector("input[name=language]:checked").value;
      state.profile.responseMode = form.querySelector("input[name=mode]:checked").value;
      state.startedAt = state.startedAt || new Date().toISOString(); save(); go("overview");
    });
    screen.appendChild(form);
    if (state.student.name && !teacherMode) {
      const resume = el("button", { type:"button", class:"btn secondary", text:"Resume saved lesson" }); resume.addEventListener("click", function () { go(state.current || "overview"); });
      screen.appendChild(el("div", { class:"button-row end" }, [resume]));
    }
    main.appendChild(screen);
  }

  function renderSupport() {
    const main = clearMain(); const screen = el("section", { class:"screen activity-shell" });
    screen.appendChild(el("p", { class:"eyebrow", text:"Support choices" })); screen.appendChild(el("h1", { text:"Choose what helps you learn" }));
    screen.appendChild(el("p", { text:"These choices change the support, not the learning goal. You can change them at any time." }));
    const card = el("div", { class:"card" });
    const lang = el("select", { "aria-label":"Language support" }); [["en","English"],["ms","Bahasa Melayu"],["zh","简体中文"]].forEach(function (o) { const x=el("option",{value:o[0],text:o[1]}); if(state.profile.language===o[0])x.selected=true; lang.appendChild(x); });
    const mode = el("select", { "aria-label":"Answer support" }); [["guided","Visual choices and sentence frames"],["independent","Independent full explanations"]].forEach(function(o){const x=el("option",{value:o[0],text:o[1]});if(state.profile.responseMode===o[0])x.selected=true;mode.appendChild(x);});
    const read = el("input", { type:"checkbox", checked:state.profile.readAloud });
    card.appendChild(el("div", { class:"field" }, [el("label", { text:"Language" }), lang])); card.appendChild(el("div", { class:"field" }, [el("label", { text:"Answer support" }), mode]));
    card.appendChild(el("label", { class:"choice-card" }, [read, document.createTextNode(" Show read-aloud buttons")]));
    const back = el("button", { type:"button", class:"btn", text:"Save and return" }); back.addEventListener("click", function () { state.profile.language=lang.value; state.profile.responseMode=mode.value; state.profile.readAloud=read.checked; save(); go(state.returnTo || "overview"); });
    card.appendChild(el("div", { class:"button-row end" }, [back])); screen.appendChild(card); main.appendChild(screen);
  }

  function teacherPanel() {
    const panel = el("div", { class:"teacher-panel" }); panel.appendChild(el("h2", { text:"Teacher preview" })); panel.appendChild(el("p", { text:"Open any section to review it. Student sequencing remains locked." }));
    const grid = el("div", { class:"teacher-grid" }); PATH.forEach(function (p) { const b=el("button",{type:"button",class:"btn secondary",text:p.label}); b.addEventListener("click",function(){go(p.id);});grid.appendChild(b); });
    const report = el("button", { type:"button", class:"btn secondary", text:"Finish / PDF" }); report.addEventListener("click",function(){go("report");}); grid.appendChild(report);
    const reset = el("button", { type:"button", class:"btn danger", text:"Reset student data" }); reset.addEventListener("click",function(){ if(confirm("Clear this browser's saved lesson and screenshots?")) S.resetAll().then(function(){sessionRemove("y6_teacher");location.reload();}); }); grid.appendChild(reset); panel.appendChild(grid); return panel;
  }

  function renderOverview() {
    const main = clearMain(); const screen = el("section", { class:"screen" }); if (teacherMode) screen.appendChild(teacherPanel());
    screen.appendChild(el("p", { class:"eyebrow", text:"Lesson briefing · before the timer starts" })); screen.appendChild(el("h1", { html:"Your <span class='title-rule'>learning journey</span>" }));
    screen.appendChild(el("p", { class:"screen-lead", text:"You will remember a routine, notice how you learn, organise your work, program in Scratch and reflect on your progress." }));
    if (supportText("overview")) screen.appendChild(supportText("overview"));
    const grid = el("div", { class:"overview-grid" });
    [["1","Do Now","Remember Start–Work–Finish."],["2","How I Learn","Choose strategies that help you improve."],["3","Main Task","Organise, predict, build, test and modify."],["4","Pitstop","Pause and choose the support or challenge you need."],["5","Plenary","Show what you now understand."],["6","Reflection","Explain how you improved and what comes next."]].forEach(function (x) { grid.appendChild(el("article", { class:"overview-card" }, [el("span",{class:"number",text:x[0]}),el("h3",{text:x[1]}),el("p",{text:x[2]})])); }); screen.appendChild(grid);
    const wagba = el("div", { class:"card" }); wagba.appendChild(el("h2", { text:"WAGBA" })); wagba.appendChild(el("p", { text:"We are getting better at organising digital work and explaining how an input makes a program produce an output." }));
    wagba.appendChild(el("p", { html:"<strong>Knowledge:</strong> programs follow ordered instructions; x changes left/right and y changes down/up." }));
    wagba.appendChild(el("p", { html:"<strong>Skills:</strong> organise, predict, build, test, debug and explain." }));
    wagba.appendChild(el("p", { html:"<strong>Understanding:</strong> clear organisation protects work; testing reveals whether our prediction was accurate." })); screen.appendChild(wagba);
    const vocab = el("div", { class:"vocab-strip", "aria-label":"Keyword glossary" }); Object.keys(GLOSSARY).forEach(function (word) { const b=el("button",{type:"button",text:word}); b.addEventListener("click",function(){toast(word+": "+GLOSSARY[word]);});vocab.appendChild(b); }); screen.appendChild(vocab);
    const t = SUPPORT[state.profile.language]; if (t) screen.appendChild(el("p", { class:"support-line", lang:state.profile.language, text:t.words }));
    const begin = el("button", { type:"button", class:"btn", text:"Begin Do Now →" }); begin.addEventListener("click",function(){complete("overview");go("starter");}); screen.appendChild(el("div",{class:"button-row end"},[begin])); main.appendChild(screen);
  }

  function mcq(key, question, options, right, explanation) {
    const block = el("fieldset", { class:"question" }); block.appendChild(el("legend", { text:question }));
    const list = el("div", { class:"options" }); const feedback = el("div", { "aria-live":"polite" });
    options.forEach(function (option, index) {
      const b = el("button", { type:"button", class:"option", "aria-pressed":"false" });
      b.appendChild(el("span", { class:"option-letter", text:String.fromCharCode(65 + index) })); b.appendChild(el("span", { text:option }));
      if (state.answers[key] && state.answers[key].value === index) {
        b.classList.add("selected", index === right ? "correct" : "wrong"); b.setAttribute("aria-pressed","true");
      }
      b.addEventListener("click", function () {
        state.answers[key] = { question:question, answer:option, value:index, correct:index === right }; save();
        list.querySelectorAll(".option").forEach(function (x) { x.classList.remove("selected","correct","wrong"); x.setAttribute("aria-pressed","false"); });
        b.classList.add("selected", index === right ? "correct" : "wrong"); b.setAttribute("aria-pressed","true");
        feedback.innerHTML = ""; feedback.appendChild(el("div", { class:"feedback " + (index === right ? "good" : "try"), text:index === right ? "Correct. " + explanation : "Not yet. Re-read what happened, identify the purpose of the action or block, and compare it with each option." }));
      }); list.appendChild(b);
    }); block.appendChild(list);
    if (state.answers[key]) feedback.appendChild(el("div", { class:"feedback " + (state.answers[key].correct ? "good" : "try"), text:state.answers[key].correct ? "Correct. " + explanation : "Not yet. Re-read what happened, identify the purpose of the action or block, and compare it with each option." }));
    block.appendChild(feedback); return block;
  }
  function textAnswer(key, question, opts) {
    opts = opts || {}; const field = el("div", { class:"field question" }); field.appendChild(el("label", { for:key, text:question }));
    if (state.profile.responseMode === "guided" && opts.frame) field.appendChild(el("p", { class:"sentence-frame", text:"Sentence frame: " + opts.frame }));
    const input = opts.rows ? el("textarea", { id:key, rows:String(opts.rows), maxlength:String(opts.max || 350) }) : el("input", { id:key, type:"text", maxlength:String(opts.max || 220) });
    if (state.answers[key]) input.value = state.answers[key].answer || "";
    if (opts.placeholder) input.placeholder = opts.placeholder;
    input.addEventListener("input", function () { state.answers[key] = { question:question, answer:input.value.trim(), correct:input.value.trim().length >= (opts.min || 3) }; save(); });
    field.appendChild(input);
    if (opts.words && state.profile.responseMode === "guided") {
      const bank = el("div", { class:"word-bank" }); opts.words.forEach(function (w) { const b=el("button",{type:"button",text:w});b.addEventListener("click",function(){input.value+=(input.value?" ":"")+w;input.dispatchEvent(new Event("input"));input.focus();});bank.appendChild(b); }); field.appendChild(bank);
    }
    return field;
  }
  function checkList(prefix, items) {
    const list = el("ul", { class:"check-list" }); items.forEach(function (text, i) {
      const key = prefix + i; const cb = el("input", { type:"checkbox", checked:!!state.checks[key] });
      cb.addEventListener("change",function(){state.checks[key]=cb.checked;save();}); list.appendChild(el("li",{},[el("label",{},[cb,el("span",{text:text})])]));
    }); return list;
  }
  function allChecked(prefix, count) { for (let i=0;i<count;i++) if(!state.checks[prefix+i]) return false; return true; }
  function requireKeys(keys) { return keys.every(function (k) { return correct(k); }); }
  function taskColumns(leftItems, rightItems) {
    const grid=el("div",{class:"task-columns"});
    const left=el("div",{class:"task-column"}); const right=el("div",{class:"task-column"});
    (leftItems||[]).forEach(function(item){if(item)left.appendChild(item);});
    (rightItems||[]).forEach(function(item){if(item)right.appendChild(item);});
    grid.appendChild(left); grid.appendChild(right); return grid;
  }
  function selectionCards(field, label, options, multi, onChange) {
    const group=el("div",{class:"metacog-grid",role:"group","aria-label":label});
    options.forEach(function(option){
      const selected=multi ? (state[field]||[]).indexOf(option.value)>=0 : state[field]===option.value;
      const b=el("button",{type:"button",class:"metacog-card "+(option.tone||"")+(selected?" selected":""),"aria-pressed":String(selected)});
      if(option.kicker)b.appendChild(el("span",{class:"metacog-kicker",text:option.kicker}));
      b.appendChild(el("h3",{text:option.title})); b.appendChild(el("p",{text:option.text}));
      if(option.help)b.appendChild(el("strong",{class:"metacog-help",text:option.help}));
      b.addEventListener("click",function(){
        if(multi){
          const values=state[field]||[]; const at=values.indexOf(option.value); if(at>=0)values.splice(at,1);else values.push(option.value); state[field]=values;
        }else state[field]=option.value;
        save();
        if(onChange){onChange(option.value);return;}
        const now=multi?(state[field]||[]).indexOf(option.value)>=0:state[field]===option.value;
        b.classList.toggle("selected",now);b.setAttribute("aria-pressed",String(now));
        if(!multi)group.querySelectorAll(".metacog-card").forEach(function(x){if(x!==b){x.classList.remove("selected");x.setAttribute("aria-pressed","false");}});
      }); group.appendChild(b);
    }); return group;
  }
  function cardTop(card, number, heading, instructionText, section, supportKey) {
    card.appendChild(el("span", { class:"card-number", text:"Step " + number })); card.appendChild(el("h2", { text:heading })); card.appendChild(instruction(instructionText, section, supportKey));
  }
  function renderStepper(section, title, eyebrow, steps, nextSection) {
    const main = clearMain(); const screen = el("section", { class:"screen activity-shell" }); if (teacherMode) screen.appendChild(teacherPanel());
    const head = el("div", { class:"activity-heading" }); const left = el("div"); left.appendChild(el("p", { class:"eyebrow", text:eyebrow })); left.appendChild(el("h1", { text:title })); head.appendChild(left); head.appendChild(el("span", { class:"time-chip", text:(state.steps[section]+1)+" of "+steps.length })); screen.appendChild(head);
    const dots = el("div", { class:"step-dots", "aria-label":"Activity steps" }); steps.forEach(function(_,i){dots.appendChild(el("span",{class:"step-dot "+(i===state.steps[section]?"active":i<state.steps[section]?"done":"")}));}); screen.appendChild(dots);
    const card = el("article", { class:"lesson-card" }); const validator = steps[state.steps[section]](card) || function(){return true;};
    const error = el("div", { class:"field-error", "aria-live":"polite" }); card.appendChild(error);
    const buttons = el("div", { class:"button-row" });
    const back = el("button", { type:"button", class:"btn secondary", text:"← Back" }); back.disabled=state.steps[section]===0; back.addEventListener("click",function(){setStep(section,state.steps[section]-1);}); buttons.appendChild(back);
    const isLast = state.steps[section] === steps.length-1; const next = el("button", { type:"button", class:"btn", text:isLast ? "Complete activity →" : "Next step →" });
    next.addEventListener("click",function(){ const result=teacherMode ? true : validator(); if(result!==true){error.textContent=typeof result==="string"?result:"Complete the task before you continue.";return;} error.textContent=""; if(isLast){complete(section);go(nextSection);}else setStep(section,state.steps[section]+1); }); buttons.appendChild(next); card.appendChild(buttons); screen.appendChild(card); main.appendChild(screen);
  }

  function screenshotWidget(key, evidenceKey, label) {
    const wrap = el("div", { class:"drop-area", tabindex:"0" }); const status = el("div", { "aria-live":"polite" });
    wrap.appendChild(el("p", { html:"<strong>"+esc(label)+"</strong>" })); wrap.appendChild(el("p", { text:"Paste a screenshot here, drag it here, or choose an image file." }));
    wrap.appendChild(el("details",{html:"<summary><strong>How do I take a screenshot?</strong></summary><p><strong>Windows:</strong> Win + Shift + S · <strong>Chromebook:</strong> Ctrl + Show windows · <strong>Mac:</strong> Command + Shift + 4. Capture only the folder or Scratch area your teacher needs.</p>"}));
    const input = el("input", { type:"file", accept:"image/png,image/jpeg,image/webp", "aria-label":label }); wrap.appendChild(input); wrap.appendChild(status);
    const preview = el("div"); wrap.appendChild(preview);
    const skipLabel = el("label", { class:"choice-card" }); const skip = el("input", { type:"checkbox", checked:!!state.evidence[evidenceKey+"Skipped"] }); skipLabel.appendChild(skip); skipLabel.appendChild(document.createTextNode(" My teacher will check this directly instead.")); wrap.appendChild(skipLabel);
    function showBlob(blob) { preview.innerHTML=""; const img=el("img",{class:"upload-preview",alt:label});img.src=URL.createObjectURL(blob);preview.appendChild(img); }
    function accept(file) {
      if (!file || !/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 10*1024*1024) { status.innerHTML="<div class='feedback try'>Choose a PNG, JPG or WEBP image under 10 MB.</div>"; return; }
      S.putScreenshot(key,file).then(function(){state.evidence[evidenceKey]=true;state.evidence[evidenceKey+"Skipped"]=false;skip.checked=false;save();showBlob(file);status.innerHTML="<div class='feedback good'>Screenshot saved locally.</div>";}).catch(function(){status.innerHTML="<div class='feedback try'>This browser could not store the image. Ask your teacher to check it directly.</div>";});
    }
    input.addEventListener("change",function(){accept(input.files[0]);});
    wrap.addEventListener("paste",function(e){const items=e.clipboardData&&e.clipboardData.items; if(!items)return; for(let i=0;i<items.length;i++)if(items[i].type.indexOf("image/")===0){accept(items[i].getAsFile());e.preventDefault();break;}});
    wrap.addEventListener("dragover",function(e){e.preventDefault();wrap.classList.add("drag");}); wrap.addEventListener("dragleave",function(){wrap.classList.remove("drag");}); wrap.addEventListener("drop",function(e){e.preventDefault();wrap.classList.remove("drag");accept(e.dataTransfer.files[0]);});
    skip.addEventListener("change",function(){state.evidence[evidenceKey+"Skipped"]=skip.checked;if(skip.checked)state.evidence[evidenceKey]=false;save();});
    S.getScreenshot(key).then(function(blob){if(blob)showBlob(blob);}).catch(function(){});
    wrap.appendChild(el("p", { class:"privacy-note", text:"Privacy: crop out email addresses, other pupils’ names and personal tabs before adding the image." })); return wrap;
  }

  const STARTER_STEPS = [
    function (card) {
      cardTop(card,"1 of 3","A Computing lesson from start to finish","Read the three moments from Aisha’s lesson. Notice what she does and why each action matters; you will use these ideas in the next step.","starter","starter1");
      card.appendChild(el("div",{class:"story-intro",html:"<strong>Imagine this:</strong> Aisha has arrived for her first Year 6 Computing lesson. Follow her from the moment she sits down until she leaves the room."}));
      const storyLayout=el("div",{class:"starter-story-layout"});
      storyLayout.appendChild(visual("image-01-start-work-finish.png","A three-panel Start, Work and Finish computing routine","The picture gives an overview of the three moments in Aisha’s lesson."));
      storyLayout.appendChild(el("div",{class:"story-grid"},[
        el("article",{class:"story-phase",html:"<h3><span>1</span> Start — get ready safely</h3><p>Before logging in, Aisha checks that the computer and cables look safe. She then logs in and waits for the task.</p><p class='why'><strong>Why:</strong> She is safe and ready to learn.</p>"}),
        el("article",{class:"story-phase",html:"<h3><span>2</span> Work — protect your progress</h3><p>Aisha follows one step at a time, saves regularly and tells the teacher when something is not working.</p><p class='why'><strong>Why:</strong> Her progress is protected and problems can be solved.</p>"}),
        el("article",{class:"story-phase",html:"<h3><span>3</span> Finish — leave securely</h3><p>At the signal, Aisha saves and checks her file. She closes her work, signs out when told and leaves the computer ready.</p><p class='why'><strong>Why:</strong> Her work and account are protected.</p>"})
      ])); card.appendChild(storyLayout); return function(){return true;};
    },
    function (card) {
      cardTop(card,"2 of 3","Use Aisha’s routine","Read each situation. Think about the purpose of the action, then choose Start, Work or Finish.","starter","starter2");
      card.appendChild(mcq("starter_q1","You have just sat down. What is the safest first action?",["Open a game while you wait","Check the equipment, log in and wait for instructions","Move another pupil’s files"],1,"This belongs in Start because it prepares you to work safely."));
      card.appendChild(mcq("starter_q2","You press Ctrl+S while creating a Scratch project. Which phase is this?",["Start","Work","Finish only"],1,"Saving regularly is part of Work, not something to leave until the very end."));
      return function(){return requireKeys(["starter_q1","starter_q2"]) || "Answer both questions correctly. You may try again.";};
    },
    function (card) {
      cardTop(card,"3 of 3","Finish in the right order","Aisha has two minutes left. Choose the sequence that first protects her work, then her account, and finally the shared space.","starter","starter3");
      card.appendChild(mcq("starter_q3","The teacher says there are two minutes left. Which sequence is best?",[
        "Switch off immediately → walk away → remember the filename later",
        "Save → check filename/location → close → sign out when told → tidy",
        "Sign out → continue editing → save to Downloads"
      ],1,"The sequence first protects the work, then the account, then the shared space."));
      card.appendChild(el("div",{class:"mini-definition"},[el("strong",{text:"Sequence"}),el("span",{text:"the order in which instructions happen. Changing the order can change the result."})]));
      return function(){return correct("starter_q3") || "Choose the correct finishing sequence before continuing.";};
    }
  ];
  function renderStarter() { renderStepper("starter","Do Now: Start–Work–Finish","Stage 1 · about 6 minutes",STARTER_STEPS,"learningTypes"); }

  const LEARNING_STEPS = [
    function(card){
      cardTop(card,"1 of 2","How were you learning?","Think back to the Do Now. Choose every type of learning you used. It is normal to use more than one.","learningTypes","learning1");
      card.appendChild(selectionCards("learningTypes","Types of learning used in the Do Now",[
        {value:"knowledge",title:"Knowledge — remember",text:"I remembered facts, words or routines.",help:"Get better: recall it without looking, then check.",tone:"knowledge",kicker:"REMEMBER"},
        {value:"skills",title:"Skills — practise",text:"I practised how to do something in the right order.",help:"Get better: practise, use feedback and try again.",tone:"skills",kicker:"PRACTISE"},
        {value:"understanding",title:"Understanding — explain and apply",text:"I explained why an action mattered or used it in a situation.",help:"Get better: connect ideas, explain why and apply them.",tone:"understanding",kicker:"EXPLAIN + APPLY"}
      ],true));
      card.appendChild(el("div",{class:"feedback info",text:"The Do Now used knowledge to remember the routine and understanding to explain why the order matters. You may also have practised the sequencing skill."}));
      return function(){return state.learningTypes.length>0||"Choose at least one type of learning you used.";};
    },
    function(card){
      cardTop(card,"2 of 2","Choose a strategy for the Main Task","Choose one action that will help you keep learning when the work becomes difficult.","learningTypes","learning2");
      card.appendChild(selectionCards("learningStrategy","Learning strategy for the Main Task",[
        {value:"example",title:"Use a worked example",text:"Look carefully at the model, then copy one accurate step at a time.",tone:"knowledge"},
        {value:"practise",title:"Practise the steps",text:"Repeat the important action and check whether it becomes easier.",tone:"skills"},
        {value:"explain",title:"Explain my thinking",text:"Say or write what each step does and why it is needed.",tone:"understanding"},
        {value:"smaller-step",title:"Ask for a smaller step",text:"Show where you are stuck and ask for one manageable next action.",tone:"support"}
      ],false));
      card.appendChild(el("div",{class:"strategy-banner",html:"<strong>Your strategy is not a test answer.</strong> It is a tool you can use during the Main Task."}));
      return function(){return !!state.learningStrategy||"Choose one strategy to use during the Main Task.";};
    }
  ];
  function renderLearningTypes(){renderStepper("learningTypes","How am I learning?","Stage 2 · about 4 minutes",LEARNING_STEPS,"main1");}

  const MAIN1_STEPS = [
    function (card) {
      cardTop(card,"1 of 3","File, folder and path","Learn the difference between a file and a folder. Then help Aisha choose a path she can still understand next week.","main1","main1_2");
      const fileDef=el("div",{class:"mini-definition"},[el("strong",{text:"File"}),el("span",{text:"A saved piece of work, such as a Scratch project, image or document."})]);
      const folderDef=el("div",{class:"mini-definition"},[el("strong",{text:"Folder"}),el("span",{text:"A container that organises files and can contain more folders."})]);
      const folderQ=mcq("main1_folder","Which path makes the project easiest to find next week?",[
        "Downloads › stuff › new folder",
        "Year 6 Computing › Term 1 - Digital Independence › " + (state.student.name || "Your Name"),
        "Desktop › Untitled"
      ],1,"The path gives the subject, term/topic and owner in a clear hierarchy.");
      card.appendChild(taskColumns([visual("image-02-folder-hierarchy.png","Folder hierarchy showing Year 6 Computing, Term 1 and a student folder","A hierarchy moves from a broad folder to a more specific folder.")],[fileDef,folderDef,folderQ]));
      return function(){return correct("main1_folder") || "Choose the folder path that would still make sense next week.";};
    },
    function (card) {
      cardTop(card,"2 of 3","Build it for real","Create the three-folder path on your school computer. Check each folder is inside the previous one, then add evidence or choose teacher checking.","main1","main1_3");
      card.appendChild(el("div",{class:"folder-path"},[
        el("span",{text:"Year 6 Computing"}),document.createTextNode("›"),el("span",{text:"Term 1 - Digital Independence"}),document.createTextNode("›"),el("span",{text:state.student.name || "Your Name"})
      ]));
      card.appendChild(el("ol",{html:"<li>Open your school file area.</li><li>Create <strong>Year 6 Computing</strong>.</li><li>Inside it, create <strong>Term 1 - Digital Independence</strong>.</li><li>Inside that, create a folder with your own name.</li><li>Check the spelling and nesting.</li>"}));
      card.appendChild(screenshotWidget("folder","folder","Folder evidence"));
      return function(){return state.evidence.folder || state.evidence.folderSkipped || "Add a folder screenshot, or tick that your teacher will check it directly.";};
    },
    function (card) {
      cardTop(card,"3 of 3","Choose and explain a useful filename","Imagine Aisha returns next week and sees several Scratch files. Choose the clearest name, then explain how folders and filenames solve different parts of the same problem.","main1","main1_4");
      const filenameStory=el("div",{class:"story-intro",html:"<strong>The problem:</strong> Names such as <em>project</em> and <em>final FINAL 2</em> may make sense today, but they are difficult to recognise later."});
      const filenameKey=el("div",{class:"filename-key",html:"<span><strong>Y6</strong> year group</span><span><strong>T1W01</strong> term and week</span><span><strong>ScratchBaseline</strong> task</span><span><strong>v1</strong> version</span>"});
      const filenameQ=mcq("main1_filename","Which filename is most useful?",["final FINAL 2.sb3","project.sb3","Y6_T1W01_ScratchBaseline_v1.sb3"],2,"It identifies year group, term/week, task and version without vague words.");
      const filenameText=textAnswer("main1_own_filename","Type the agreed filename without the .sb3 ending.",{placeholder:"Y6_T1W01_ScratchBaseline_v1",min:10});
      const organisationQ=mcq("main1_check","Why do folders and filenames both matter?",[
        "Folders group related work; filenames identify the exact file",
        "They make the computer run faster",
        "A filename replaces the need for folders"
      ],0,"Folder structure and filenames solve different parts of the same finding problem.");
      card.appendChild(taskColumns([filenameStory,visual("image-03-filename-comparison.png","Comparison of weak and useful Scratch project filenames","The useful name records the class context, lesson, task and version."),filenameKey],[filenameQ,filenameText,organisationQ]));
      return function(){return correct("main1_filename")&&correct("main1_check")&&state.answers.main1_own_filename&&/^Y6_T1W01_ScratchBaseline_v1$/i.test(state.answers.main1_own_filename.answer)||"Choose both correct answers and type Y6_T1W01_ScratchBaseline_v1 exactly.";};
    }
  ];
  function renderMain1() { renderStepper("main1","Main Task: Part A — Organise your work","Stage 3 · Part A · about 10 minutes",MAIN1_STEPS,"main2"); }

  const MAIN2_STEPS = [
    function (card) {
      cardTop(card,"1 of 6","Help Aisha find her way around Scratch","Aisha needs to choose commands, join them into a program and watch the result. Use the labelled visual to find each place.","main2","main2_1");
      const interfaceDefs=el("div",{class:"concept-pair"},[
        el("div",{class:"mini-definition"},[el("strong",{text:"Block palette"}),el("span",{text:"Where Aisha chooses commands such as Motion, Looks and Events."})]),
        el("div",{class:"mini-definition"},[el("strong",{text:"Stage"}),el("span",{text:"Where Aisha watches the sprite carry out the program."})])
      ]);
      const stageQ=mcq("main2_stage","Where do you watch the sprite’s movement and message?",["Block palette","Stage","Sprite name box"],1,"The stage displays the program’s visible output.");
      const paletteQ=mcq("main2_palette","Where do you choose Motion, Looks and Events blocks?",["Block palette","Stage","Menu bar"],0,"The block palette groups commands by category.");
      card.appendChild(taskColumns([visual("image-04-annotated-scratch-interface-v3.png","Annotated Scratch 3 interface with block palette, code area, stage, sprite list and green flag","The block palette supplies commands, the code area holds the program, and the stage shows the output.")],[interfaceDefs,stageQ,paletteQ]));
      return function(){return requireKeys(["main2_stage","main2_palette"]) || "Use the labels on the visual to answer both questions correctly.";};
    },
    function (card) {
      cardTop(card,"2 of 6","Predict before you run","Do not open Scratch yet. Read the three blocks from top to bottom: identify what starts the script, then predict both things the sprite will do.","main2","main2_2");
      const predictionVisuals=el("div",{class:"visual-pair"});
      predictionVisuals.appendChild(visual("image-05-prediction-code-v2.png","Scratch blocks: when right arrow key pressed, change x by 40, say Moving right for one second","The event is a right-arrow key press. The commands change x and display a message."));
      predictionVisuals.appendChild(visual("image-06-three-possible-outcomes.png","Three possible outcomes: move up, move right, or stay still","Compare the sign and axis in the code with the direction in each outcome."));
      const predictionQ=mcq("main2_prediction","What will happen when the right arrow key is pressed?",[
        "The sprite moves up and says ‘Moving right!’",
        "The sprite moves right by 40 and says ‘Moving right!’",
        "Nothing happens because the green flag was not clicked"
      ],1,"Positive x moves a sprite to the right. The key event can start the script without the green flag.");
      const inputQ=mcq("main2_input","What is the input?",["The right-arrow key press","The sprite moving","The words ‘Moving right!’"],0,"An input is what the computer receives—in this case, a key press.");
      const outputQ=mcq("main2_output","Which answer includes both outputs?",["The right-arrow key and x","Movement and a message","The block palette and stage"],1,"The program changes the sprite’s position and shows a message.");
      card.appendChild(taskColumns([predictionVisuals],[predictionQ,inputQ,outputQ]));
      return function(){return requireKeys(["main2_prediction","main2_input","main2_output"]) || "Make and check all three predictions before opening Scratch.";};
    },
    function (card) {
      cardTop(card,"3 of 6","Build the exact script","Open Scratch in a new tab, keep this lesson tab open, and build the three connected blocks exactly as shown. Save using the agreed filename.","main2","main2_3");
      const open = el("a", { class:"btn scratch", href:CFG.SCRATCH_PROJECT_URL || "https://scratch.mit.edu/projects/editor/", target:"_blank", rel:"noopener", text:"Open a new Scratch project ↗" });
      const buildChecks=checkList("build_",[
        "I added ‘when right arrow key pressed’.",
        "I connected ‘change x by 40’.",
        "I connected ‘say Moving right! for 1 seconds’.",
        "I saved or downloaded the project as Y6_T1W01_ScratchBaseline_v1 and placed it in my lesson folder."
      ]);
      const saveNote=el("p",{class:"teacher-note",html:"<strong>Saving:</strong> Follow your school’s usual Scratch sign-in method, or choose <strong>File → Save to your computer</strong> and move the downloaded .sb3 file into your lesson folder. Do not create a personal account during the lesson."});
      card.appendChild(taskColumns([visual("image-05-prediction-code-v2.png","Scratch reference script for moving right","Keep this visual open while you build."),open],[buildChecks,saveNote]));
      return function(){return allChecked("build_",4) || "Build and check all four items before continuing.";};
    },
    function (card) {
      cardTop(card,"4 of 6","Test like a programmer","Press the right arrow three times and watch both outputs. Compare the result with your prediction; if something differs, inspect one relevant block at a time.","main2","main2_4");
      const testDefs=el("div",{class:"concept-pair"},[
        el("div",{class:"mini-definition"},[el("strong",{text:"Test"}),el("span",{text:"Run the program and compare the result with what you expected."})]),
        el("div",{class:"mini-definition"},[el("strong",{text:"Debug"}),el("span",{text:"Use evidence from an unexpected result to find and fix its cause."})])
      ]);
      const testChecks=checkList("test_",["I pressed the right arrow at least three times.","I watched both the movement and the message.","I compared the real output with my prediction."]);
      const testQ=mcq("main2_test","The sprite says the message but does not move. What should you inspect first?",[
        "The change x block is connected and has 40 in it",
        "The browser wallpaper",
        "The project filename"
      ],0,"The missing output is movement, so inspect the Motion block that produces it.");
      card.appendChild(taskColumns([visual("image-08-testing-debugging-cycle-v2.png","A clean prediction, run, compare, debug, test-again cycle","Testing is a cycle: a first result gives you information for the next improvement."),testDefs],[testChecks,testQ]));
      return function(){return allChecked("test_",3) && correct("main2_test") || "Complete the three tests and solve the debugging question.";};
    },
    function (card) {
      cardTop(card,"5 of 6","Make one purposeful change","Create a second script for the left arrow. Change the input, x value and message so that all three describe the same left-moving action.","main2","main2_5");
      const purposeDef=el("div",{class:"mini-definition"},[el("strong",{text:"Purposeful change"}),el("span",{text:"A planned change made for a clear reason. Here, every edited block must help produce left movement."})]);
      const axes=el("div",{class:"axis-grid"},[
        el("div",{class:"axis-card",html:"<strong>+x</strong><br>moves right"}),el("div",{class:"axis-card",html:"<strong>−x</strong><br>moves left"}),
        el("div",{class:"axis-card",html:"<strong>+y</strong><br>moves up"}),el("div",{class:"axis-card",html:"<strong>−y</strong><br>moves down"})
      ]);
      const modifyChecks=checkList("modify_",["I duplicated or rebuilt the script.","I changed the event to the left arrow.","I changed x to −40.","I changed the message to ‘Moving left!’.","I tested both directions and saved."]);
      const changeText=textAnswer("main2_change","How did your changes make the new input produce the correct output?",{rows:2,frame:"I changed the input to… and the x value to… so the sprite…",words:["left arrow","change x","−40","moves left","matching message"],min:18});
      card.appendChild(taskColumns([visual("image-07-before-after-modification.png","Before and after Scratch scripts changing right-arrow positive x to left-arrow negative x","A purposeful change updates the key, direction and message so the program still makes sense."),purposeDef,axes],[modifyChecks,changeText]));
      return function(){return allChecked("modify_",5) && state.answers.main2_change && state.answers.main2_change.answer.length>=18 || "Complete and test the left-arrow script, then connect your input, code and output in the explanation.";};
    },
    function (card) {
      cardTop(card,"6 of 6","Capture useful evidence","Add one screenshot that clearly shows both scripts without private information. Then explain one complete input–code–output relationship.","main2","main2_6");
      const evidenceWidget=screenshotWidget("main","scratch","Scratch code evidence");
      const evidenceText=textAnswer("main2_explain","Explain how one input causes an output in your program.",{rows:2,frame:"When I press…, the program…, so the sprite…",words:["when","right arrow","left arrow","change x","moves","says"],min:15});
      card.appendChild(taskColumns([visual("image-09-model-evidence-screenshot.png","Model Scratch evidence showing code and stage clearly","Strong evidence shows the relevant code, the stage and no private information.")],[evidenceWidget,evidenceText]));
      return function(){return (state.evidence.scratch || state.evidence.scratchSkipped) && state.answers.main2_explain && state.answers.main2_explain.answer.length>=15 || "Add evidence (or choose teacher check) and explain one input–output relationship.";};
    }
  ];
  function renderMain2() { renderStepper("main2","Main Task: Part B — Predict, build, test, modify","Stage 3 · Part B · about 25 minutes",MAIN2_STEPS,"pitstop"); }

  function renderPitstop(){
    const main=clearMain(); const screen=el("section",{class:"screen activity-shell"}); if(teacherMode)screen.appendChild(teacherPanel());
    screen.appendChild(el("p",{class:"eyebrow",text:"Stage 4 · about 4 minutes"}));
    screen.appendChild(el("h1",{html:"Learning <span class='title-rule'>Pitstop</span>"}));
    screen.appendChild(instruction("Pause and check what you can do now. Then choose the statement that best describes your learning—not your ability.","pitstop","pitstop"));
    const check=el("div",{class:"pitstop-check"}); check.appendChild(el("h2",{text:"What can you do now?"})); check.appendChild(el("p",{text:"Tick what is true. Leave anything else unticked so your teacher knows what to revisit."}));
    check.appendChild(checkList("pitstop_",[
      "I can create and recognise a useful folder path and filename.",
      "I can identify an input and the outputs in a short Scratch script.",
      "I can make, test and explain one purposeful change."
    ])); screen.appendChild(check);
    screen.appendChild(el("h2",{text:"Where are you in your learning?"}));
    screen.appendChild(selectionCards("pitstopPhase","Current phase of learning",[
      {value:"new",kicker:"NEW LEARNING",title:"I am learning something new",text:"Some struggle is normal. I can keep going with the model and one step at a time.",tone:"phase-new"},
      {value:"consolidating",kicker:"CONSOLIDATING",title:"I am getting more confident",text:"I can use what I know and explain more of it without the model.",tone:"phase-consolidating"},
      {value:"challenge",kicker:"TREADING WATER",title:"I am ready for more challenge",text:"The core task feels too easy. I need something that stretches my thinking.",tone:"phase-challenge"},
      {value:"help",kicker:"I NEED SUPPORT NOW",title:"I am stuck and need help",text:"I need an example, a smaller step or help from my teacher to move forward.",tone:"phase-help"}
    ],false,function(value){if(value!=="help")state.pitstopNeed="";save();go("pitstop",true);}));
    if(state.pitstopPhase){
      const advice=el("div",{class:"pitstop-advice"});
      if(state.pitstopPhase==="new")advice.innerHTML="<h2>Your next action</h2><p>Keep the worked example visible. Point to the event, the Motion block and the message before you change anything.</p>";
      if(state.pitstopPhase==="consolidating")advice.innerHTML="<h2>Your next action</h2><p>Cover the model and explain one complete input → code → output relationship from memory.</p>";
      if(state.pitstopPhase==="challenge"){
        advice.innerHTML="<h2>Your next action</h2><p>Move into the challenge hub. Start with Two-Way Controls and complete at least three progressively harder levels.</p>";
        const challenge=el("button",{type:"button",class:"btn",text:"Open challenge hub →"}); challenge.addEventListener("click",function(){complete("pitstop");go("extension");}); advice.appendChild(challenge);
      }
      if(state.pitstopPhase==="help"){
        advice.appendChild(el("h2",{text:"What do you need help with?"}));
        advice.appendChild(selectionCards("pitstopNeed","Area where help is needed",[
          {value:"folders",title:"Folders and filenames",text:"Show me the correct path and naming pattern."},
          {value:"scratch",title:"Finding or joining blocks",text:"Show me the event, Motion and Looks blocks."},
          {value:"coordinates",title:"x, y and directions",text:"Show me which axis and sign to use."},
          {value:"saving",title:"Saving or adding evidence",text:"Show me the saving and screenshot steps."}
        ],false,function(){go("pitstop",true);}));
        if(state.pitstopNeed){
          const helpText={
            folders:"Open Main Task Part A. Copy the three-folder path first, then check one folder is inside the previous folder.",
            scratch:"Build only three blocks: the key event, change x, and say. Join them before testing.",
            coordinates:"Remember: x is left/right and y is down/up. A minus sign moves left or down.",
            saving:"Choose File → Save to your computer, use the agreed filename, then place the .sb3 file in your lesson folder."
          };
          advice.appendChild(el("div",{class:"help-now",html:"<strong>Try this smaller step:</strong> "+helpText[state.pitstopNeed]+"<br><strong>If you are still stuck, show this card to your teacher.</strong>"}));
        }
      }
      screen.appendChild(advice);
    }
    const err=el("div",{class:"field-error","aria-live":"polite"}); screen.appendChild(err);
    const back=el("button",{type:"button",class:"btn secondary",text:"← Review Main Task"}); back.addEventListener("click",function(){go("main2");});
    const next=el("button",{type:"button",class:"btn",text:"Continue to plenary →"}); next.addEventListener("click",function(){
      if(!state.pitstopPhase){err.textContent="Choose the statement that best describes your learning.";return;}
      if(state.pitstopPhase==="help"&&!state.pitstopNeed){err.textContent="Choose what you need help with so the app can show a smaller step.";return;}
      if(state.pitstopPhase==="challenge"&&(state.extensionDone||[]).filter(function(id){return id.charAt(0)==="p";}).length<3){err.textContent="Open the challenge hub and complete at least three levels before continuing.";return;}
      complete("pitstop");go("plenary");
    }); screen.appendChild(el("div",{class:"button-row"},[back,next])); main.appendChild(screen);
  }

  const EXTENSIONS = [
    {
      id:"o1", title:"Routine Rescue", strand:"Organisation", level:"1",
      render:function(card){
        cardTop(card,"O1","Routine Rescue","Read three classroom problems. For each one, choose the action that solves the problem and matches the purpose of the routine.","main1","ext_o1");
        card.appendChild(mcq("ext_o1a","A pupil opens YouTube before the teacher gives the task. Which correction is best?",["Log out immediately","Close it and wait for instructions","Hide the tab"],1,"Waiting for instructions belongs in Start."));
        card.appendChild(mcq("ext_o1b","A warning says the project may not be saved. What should happen first?",["Ignore it","Save and check the location","Sign out"],1,"Protect the work before closing or signing out."));
        card.appendChild(mcq("ext_o1c","Why sign out at the end?",["To protect the account","To delete the project","To make Scratch move faster"],0,"Signing out prevents the next user accessing the account."));
      }, validate:function(){return requireKeys(["ext_o1a","ext_o1b","ext_o1c"]);}, summary:"Solved three Start–Work–Finish routine problems."
    },
    {
      id:"o2", title:"Folder Detective", strand:"Organisation", level:"2",
      render:function(card){
        cardTop(card,"O2","Folder Detective","Use the hierarchy to decide where Aisha’s file belongs and what could sit beside a Term 1 folder.","main1","ext_o2");
        const o2a=mcq("ext_o2a","Where should the student’s Scratch file be saved?",["Beside Year 6 Computing","Inside the student-name folder","Inside the Recycle Bin"],1,"The most specific pupil folder contains that pupil’s file.");
        const o2b=mcq("ext_o2b","Which folder would best sit beside ‘Term 1 - Digital Independence’?",["Term 2 - Programming","random","final.sb3"],0,"Folders at the same level should use a consistent structure; a .sb3 item is a file.");
        card.appendChild(taskColumns([visual("image-02-folder-hierarchy.png","Folder hierarchy for Year 6 Computing","Read from the broad subject folder to the pupil folder.")],[o2a,o2b]));
      }, validate:function(){return requireKeys(["ext_o2a","ext_o2b"]);}, summary:"Used a folder hierarchy to locate and classify digital work."
    },
    {
      id:"o3", title:"Filename Editor", strand:"Organisation", level:"3",
      render:function(card){
        cardTop(card,"O3","Filename Editor","Help Aisha replace vague filenames with names that communicate the task and version without becoming needlessly long.","main1","ext_o3");
        const o3a=mcq("ext_o3a","Which is the best name for a second improved version?",["finalfinal.sb3","Y6_T1W01_ScratchBaseline_v2.sb3","new one copy.sb3"],1,"v2 clearly follows v1 and keeps the agreed pattern.");
        const o3b=mcq("ext_o3b","What does v2 communicate?",["The file has two sprites","It is version 2","It belongs to Year 2"],1,"Version numbers make development history clear.");
        const o3text=textAnswer("ext_o3text","Write one rule for a useful filename.",{frame:"A useful filename should…",words:["describe the work","use an agreed pattern","include a version","avoid vague words"],min:8});
        card.appendChild(taskColumns([visual("image-03-filename-comparison.png","Weak and useful filename comparison","A strong filename identifies the work and version.")],[o3a,o3b,o3text]));
      }, validate:function(){return requireKeys(["ext_o3a","ext_o3b"]) && state.answers.ext_o3text && state.answers.ext_o3text.answer.length>=8;}, summary:"Edited filenames and explained a naming rule."
    },
    {
      id:"p1", title:"Two-Way Controls", strand:"Programming", level:"1",
      render:function(card){
        cardTop(card,"P1","Two-Way Controls","Build and test two scripts. Make the arrow key, sign of x and message agree with the direction of movement.","main2","ext_p1");
        const p1q=mcq("ext_p1a","Which pair correctly makes two-way movement?",["right:+40 and left:−40","right:+40 and left:+40","right changes y and left changes x"],0,"Opposite horizontal directions use opposite signs on the x axis.");
        const p1checks=checkList("ext_p1_",["Both scripts are connected.","Both directions work more than once.","Both messages match the movement."]);
        card.appendChild(taskColumns([visual("image-10-extension-two-way-controls-v2.png","Two Scratch scripts for left and right movement","Right uses positive x; left uses negative x. Each message matches its direction.")],[p1q,p1checks]));
      }, validate:function(){return correct("ext_p1a") && allChecked("ext_p1_",3);}, summary:"Built and tested two-way horizontal controls."
    },
    {
      id:"p2", title:"Four-Way Controls", strand:"Programming", level:"2",
      render:function(card){
        cardTop(card,"P2","Four-Way Controls","Add up and down controls. Use y—not x—and choose the correct sign for each vertical direction.","main2","ext_p2");
        const p2a=mcq("ext_p2a","Which block should the up arrow run?",["change x by 40","change y by 40","change y by −40"],1,"Positive y moves the sprite up.");
        const p2b=mcq("ext_p2b","Which block should the down arrow run?",["change y by −40","change x by −40","change y by 40"],0,"Negative y moves the sprite down.");
        const p2checks=checkList("ext_p2_",["I added up and down scripts.","I tested all four arrow keys.","I fixed any axis or sign mistake and saved."]);
        card.appendChild(taskColumns([visual("image-11-extension-four-way-controls.png","Four Scratch arrow-key scripts using positive and negative x and y","Horizontal movement changes x; vertical movement changes y.")],[p2a,p2b,p2checks]));
      }, validate:function(){return requireKeys(["ext_p2a","ext_p2b"]) && allChecked("ext_p2_",3);}, summary:"Built and tested four-way coordinate controls."
    },
    {
      id:"p3", title:"Coordinate Mission", strand:"Programming", level:"3",
      render:function(card){
        cardTop(card,"P3","Coordinate Mission","Start at (0, 0). Find a shortest route to (80, 40) when every key press changes only one coordinate by 40, then compare two valid routes.","main2","ext_p3");
        const p3a=mcq("ext_p3a","Which is a shortest route?",["right, right, up","right, up, left, right, right","up, up, right"],0,"Two right presses make x = 80 and one up press makes y = 40: three presses.");
        const p3b=mcq("ext_p3b","Could ‘up, right, right’ also work?",["Yes; the order changes the route but not the final coordinate","No; up must happen last","No; x must change before y"],0,"Both algorithms add the same coordinate changes in a different order.");
        card.appendChild(taskColumns([visual("image-12-extension-coordinate-mission.png","Coordinate grid from start zero zero to target eighty forty","Each right press adds 40 to x. Each up press adds 40 to y.")],[p3a,p3b]));
      }, validate:function(){return requireKeys(["ext_p3a","ext_p3b"]);}, summary:"Found and justified a shortest coordinate route."
    },
    {
      id:"p4", title:"Debug Detective", strand:"Programming", level:"4",
      render:function(card){
        cardTop(card,"P4","Debug Detective","Treat each incorrect movement as evidence. Identify the most likely faulty block, then choose the smallest change that tests your diagnosis.","main2","ext_p4");
        const p4a=mcq("ext_p4a","The up arrow moves the sprite right. What is the likely bug?",["The script changes x instead of y","The sprite is too small","The project needs a longer filename"],0,"Moving right is evidence that x changed.");
        const p4b=mcq("ext_p4b","The left arrow moves right. What is the likely fix?",["Change +40 to −40","Change x to y","Delete the event block"],0,"The axis is correct but the sign is wrong.");
        const p4c=mcq("ext_p4c","Why test after changing one block?",["To check whether that change fixed the cause","To earn a random result","To avoid saving"],0,"One change at a time helps connect cause and effect.");
        card.appendChild(taskColumns([visual("image-08-testing-debugging-cycle-v2.png","Testing and debugging cycle","Use evidence from the output; do not change several blocks at once.")],[p4a,p4b,p4c]));
      }, validate:function(){return requireKeys(["ext_p4a","ext_p4b","ext_p4c"]);}, summary:"Diagnosed axis, sign and testing bugs from evidence."
    },
    {
      id:"p5", title:"Design a Mission", strand:"Programming", level:"5",
      render:function(card){
        cardTop(card,"P5","Design a Coordinate Mission","Choose a reachable target, write a route that actually reaches it in the fewest key presses, and explain how another pupil can verify it.","main2","ext_p5");
        card.appendChild(el("p",{class:"code-fact",text:"Rule: choose x and y values between −120 and 120. Each must be a multiple of 40."}));
        card.appendChild(textAnswer("ext_p5target","Write your target coordinate as (x, y).",{placeholder:"for example (−80, 120)",min:5}));
        card.appendChild(textAnswer("ext_p5route","Write a shortest arrow-key route to your target.",{rows:2,frame:"My route is… because…",words:["left","right","up","down","presses","x","y"],min:12}));
        card.appendChild(textAnswer("ext_p5check","Explain how another pupil could check your route without guessing.",{rows:2,frame:"They could check by…",words:["start at (0, 0)","add 40","subtract 40","track x and y","compare the target"],min:15}));
      }, validate:function(){
        const rawTarget=state.answers.ext_p5target&&state.answers.ext_p5target.answer;
        const target=rawTarget&&rawTarget.replace(/[−–—]/g,"-");
        const match=target&&target.match(/^\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?$/);
        if(!match)return "Write the target as a coordinate pair, for example (−80, 120).";
        const x=+match[1],y=+match[2];
        if(Math.abs(x)>120||Math.abs(y)>120||x%40!==0||y%40!==0)return "Choose x and y between −120 and 120, using multiples of 40.";
        const routeText=state.answers.ext_p5route&&state.answers.ext_p5route.answer.toLowerCase();
        const moves=routeText&&routeText.match(/left|right|up|down/g);
        if(!moves||!moves.length)return "Write the route using the words left, right, up and down.";
        let routeX=0,routeY=0;moves.forEach(function(move){if(move==="left")routeX-=40;if(move==="right")routeX+=40;if(move==="up")routeY+=40;if(move==="down")routeY-=40;});
        if(routeX!==x||routeY!==y)return "That route finishes at ("+routeX+", "+routeY+"), not ("+x+", "+y+"). Revise the directions.";
        const shortest=Math.abs(x/40)+Math.abs(y/40);
        if(moves.length!==shortest)return "Your route reaches the target in "+moves.length+" presses, but a shortest route needs "+shortest+". Remove unnecessary moves.";
        if(!state.answers.ext_p5check||state.answers.ext_p5check.answer.length<15)return "Explain how another pupil can track x and y to check your route.";
        return true;
      }, summary:function(){return "Designed target "+state.answers.ext_p5target.answer+" and explained a shortest route.";}
    }
  ];

  function renderExtension() {
    const main=clearMain(); const screen=el("section",{class:"screen activity-shell"}); if(teacherMode)screen.appendChild(teacherPanel());
    const challengeLevels=EXTENSIONS.map(function(level,index){return {level:level,index:index};}).filter(function(item){return item.level.id.charAt(0)==="p";});
    const challengeDone=(state.extensionDone||[]).filter(function(id){return id.charAt(0)==="p";});
    if(state.steps.extension<3)state.steps.extension=3;
    screen.appendChild(el("p",{class:"eyebrow",text:"Main Task · progressive challenge path"})); screen.appendChild(el("h1",{html:"Stretch your <span class='title-rule'>Scratch thinking</span>"}));
    screen.appendChild(el("div",{class:"extension-summary"},[
      el("div",{html:"<strong>Challenge target: complete at least 3 of the 5 levels.</strong><br><span>Begin with Two-Way Controls and move towards designing your own mission.</span>"}),
      el("strong",{text:challengeDone.length+" / 3"})
    ]));
    const remaining=Math.max(0,3-challengeDone.length);
    const leave=el("button",{type:"button",class:"btn",text:remaining?"Complete "+remaining+" more level"+(remaining===1?"":"s")+" to continue":"Go to compulsory plenary →"}); leave.disabled=!teacherMode&&remaining>0; leave.addEventListener("click",function(){go("plenary");}); screen.appendChild(el("div",{class:"button-row end"},[leave]));
    const grid=el("div",{class:"level-grid five-levels"}); challengeLevels.forEach(function(item){
      const level=item.level; const i=item.index; const done=state.extensionDone.indexOf(level.id)>=0; const b=el("button",{type:"button",class:"level-card "+(done?"done ":"")+(state.steps.extension===i?"active":"")});
      b.appendChild(el("span",{class:"level-badge",text:level.strand+" · L"+level.level})); b.appendChild(el("h3",{text:(done?"✓ ":"")+level.title})); b.appendChild(el("small",{text:done?"Completed — you can revisit it.":"Open challenge"})); b.addEventListener("click",function(){setStep("extension",i);});grid.appendChild(b);
    }); screen.appendChild(grid);
    const level=EXTENSIONS[state.steps.extension]||EXTENSIONS[3]; const task=el("article",{class:"lesson-card extension-task"}); level.render(task); const err=el("div",{class:"field-error","aria-live":"polite"});task.appendChild(err);
    const saveBtn=el("button",{type:"button",class:"btn",text:state.extensionDone.indexOf(level.id)>=0?"Update this level":"Complete this level"});
    saveBtn.addEventListener("click",function(){const result=level.validate();if(result!==true){err.textContent=typeof result==="string"?result:"Complete every part correctly before saving this level.";return;}err.textContent="";if(state.extensionDone.indexOf(level.id)<0)state.extensionDone.push(level.id);const completedProgramming=state.extensionDone.filter(function(id){return id.charAt(0)==="p";}).length;if(completedProgramming>=3)complete("extension");const summary=typeof level.summary==="function"?level.summary():level.summary;state.answers["extension_"+level.id]={question:level.title,answer:summary,correct:true};save();toast("Level completed. Choose the next challenge or continue to the plenary.");go("extension",true);});
    task.appendChild(el("div",{class:"button-row end"},[saveBtn])); screen.appendChild(task); main.appendChild(screen);
  }

  const PLENARY_STEPS = [
    function(card){
      cardTop(card,"1 of 1","Show what you now understand","Use today’s learning to answer two short questions, then explain one input–code–output relationship from your own program.","plenary","plenary1");
      const plenaryOne=mcq("plenary_q1","Which statement best explains why digital organisation matters?",[
        "It helps work remain findable, understandable and ready to continue",
        "It changes the Scratch sprite’s costume",
        "It means we never need to save"
      ],0,"Organisation supports independence and protects progress.");
      const plenaryTwo=mcq("plenary_q2","A sprite changes y by −40. What output should you predict?",["Move right","Move down","Move up"],1,"Negative y moves down.");
      const plenaryExplain=textAnswer("plenary_q3","Explain one input and its output from your Scratch project.",{rows:2,frame:"When I press…, the program…, so…",words:["right arrow","left arrow","input","change x","output","moves","message"],min:15});
      card.appendChild(taskColumns([plenaryOne,plenaryTwo],[plenaryExplain]));
      return function(){return requireKeys(["plenary_q1","plenary_q2"])&&state.answers.plenary_q3&&state.answers.plenary_q3.answer.length>=15||"Answer both questions correctly and explain one input–output relationship.";};
    }
  ];
  function renderPlenary(){renderStepper("plenary","Plenary: Show what you learned","Stage 5 · about 7 minutes",PLENARY_STEPS,"reflection");}

  const REFLECTION_STEPS = [
    function(card){
      cardTop(card,"1 of 1","Exit reflection","Think about how you improved today. Choose the learning and strategy that helped most, then record one success and one next step.","reflection","reflection");
      card.appendChild(el("h2",{class:"section-question",text:"Which type of learning helped you most?"}));
      card.appendChild(selectionCards("exitLearningType","Type of learning that helped most",[
        {value:"knowledge",title:"Knowledge",text:"Remembering facts, words and routines.",tone:"knowledge"},
        {value:"skills",title:"Skills",text:"Practising until an action became more accurate.",tone:"skills"},
        {value:"understanding",title:"Understanding",text:"Explaining why and applying the idea.",tone:"understanding"}
      ],false));
      card.appendChild(el("h2",{class:"section-question",text:"Which strategy helped you improve?"}));
      card.appendChild(selectionCards("exitStrategy","Strategy that helped most",[
        {value:"example",title:"Worked example",text:"I used the model carefully."},
        {value:"practise",title:"Practice",text:"I repeated and checked the steps."},
        {value:"explain",title:"Explain",text:"I said or wrote why it worked."},
        {value:"help",title:"Smaller step or help",text:"I asked for the support I needed."}
      ],false));
      card.appendChild(taskColumns([
        textAnswer("exit_can","What can you now do independently?",{rows:2,frame:"I can now…",words:["organise my files","choose a useful filename","identify an input","predict an output","test and debug","change x and y"],min:10})
      ],[
        textAnswer("exit_next","What is one useful next step?",{rows:2,frame:"Next lesson, I will…",words:["save regularly","check my folder path","predict before testing","debug one block at a time","explain using because"],min:10})
      ]));
      card.appendChild(el("div",{class:"feedback info",text:"An honest reflection is useful evidence. It helps your teacher prepare the right support and challenge for the next lesson."}));
      return function(){return state.exitLearningType&&state.exitStrategy&&state.answers.exit_can&&state.answers.exit_can.answer.length>=10&&state.answers.exit_next&&state.answers.exit_next.answer.length>=10||"Choose both cards and complete your success and next step.";};
    }
  ];
  function renderReflection(){renderStepper("reflection","Exit Reflection","Stage 6 · about 4 minutes",REFLECTION_STEPS,"report");}

  function renderReport(){
    const main=clearMain(); const screen=el("section",{class:"screen"}); if(teacherMode)screen.appendChild(teacherPanel());
    if(!teacherMode&&!unlocked("report")){go("reflection");return;}
    if(state.completed.indexOf("reflection")>=0&&!state.finishedAt){state.finishedAt=new Date().toISOString();save();}
    screen.appendChild(el("p",{class:"eyebrow",text:"Lesson complete"})); screen.appendChild(el("h1",{html:"Export your <span class='title-rule'>learning evidence</span>"}));
    screen.appendChild(el("p",{class:"screen-lead",text:"Your report includes your answers, extension progress and any screenshots you chose to attach."}));
    const steps=el("div",{class:"teams-steps"}); steps.appendChild(el("h2",{text:"Save and submit"})); steps.appendChild(el("ol",{html:"<li>Select <strong>Print / Save as PDF</strong>.</li><li>Choose <strong>Save as PDF</strong> as the printer.</li><li>Name it <strong>"+esc((state.student.name||"Name").replace(/\s+/g,"_"))+"_Y6_Computing_Week1.pdf</strong>.</li><li>Open the correct assignment in <strong>Microsoft Teams</strong>.</li><li>Attach the PDF, wait for it to finish uploading, then select <strong>Turn in</strong>.</li></ol>"})); screen.appendChild(steps);
    const print=el("button",{type:"button",class:"btn",text:"Print / Save as PDF"});print.addEventListener("click",function(){window.print();});
    const back=el("button",{type:"button",class:"btn secondary",text:"Review my reflection"});back.addEventListener("click",function(){go("reflection");});screen.appendChild(el("div",{class:"button-row"},[back,print]));
    const holder=el("div");screen.appendChild(holder);main.appendChild(screen);
    window.LabReport.build(state,{CFG:CFG,getScreenshot:S.getScreenshot}).then(function(node){holder.appendChild(node);return window.LabReport.build(state,{CFG:CFG,getScreenshot:S.getScreenshot});}).then(function(printNode){const root=$("#reportRoot");root.innerHTML="";root.appendChild(printNode);});
  }

  function wire(){
    $("#btnLearning").addEventListener("click",function(){const p=$("#learningPanel");p.hidden=!p.hidden;this.setAttribute("aria-expanded",String(!p.hidden));});
    $("#closeLearning").addEventListener("click",function(){$("#learningPanel").hidden=true;$("#btnLearning").setAttribute("aria-expanded","false");$("#btnLearning").focus();});
    $("#btnSupport").addEventListener("click",function(){state.returnTo=state.current;save();go("support");});
    $("#btnSound").addEventListener("click",function(){state.settings.muted=!state.settings.muted;save();toast(state.settings.muted?"Sound is off.":"Sound is on.");});
  }
  function boot(){
    try {
      wire();
      if(teacherMode&&!state.student.name){state.student={name:"Teacher",className:"Preview"};save();}
      if(!state.student.name){go("welcome");return;}
      go(state.current&&state.current!=="welcome"?state.current:"overview");
    } catch (e) {
      showStartupFailure();
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
