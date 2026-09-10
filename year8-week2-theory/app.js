(() => {
  "use strict";

  const LESSON_ID = "year8-t1-week2-theory-smart-badge-flowchart";
  const SCHEMA_VERSION = 8;
  const MAIN1_CARDS = window.Main1Practice?.cards || [];
  const SAVE_DELAY = 250;
  const LAST_PROFILE_KEY = `${LESSON_ID}:last-profile`;
  const CORRECT_SEQUENCE = [
    "The badge starts.",
    "Display a welcome icon.",
    "Wait for Button A to be pressed.",
    "Display the student’s initials.",
  ];
  const START_SEQUENCE = [
    "Display the student’s initials.",
    "Wait for Button A to be pressed.",
    "The badge starts.",
    "Display a welcome icon.",
  ];

  const SECTIONS = [
    { id: "mission", label: "Our mission", core: true },
    { id: "doNow", label: "Do Now", core: true },
    { id: "types", label: "Types of Learning", core: true },
    { id: "main1", label: "Main Task 1A / 1B", core: true },
    { id: "main2", label: "Main Task 2", core: true },
    { id: "extension", label: "Extension", optional: true },
    { id: "pitstop", label: "Learning Pitstop", core: true },
    { id: "plenary", label: "Plenary", core: true },
    { id: "review", label: "Review & PDF" },
    { id: "finisher", label: "Flowchart Gimkit", optional: true },
  ];
  const CORE_IDS = SECTIONS.filter((section) => section.core).map((section) => section.id);

  const MISSION_QUESTIONS = [
    {
      key: "mission_purpose", question: "Why are we planning this Smart Badge?",
      options: [["attendance", "To record attendance automatically."], ["introduce", "To help new students introduce themselves using their initials."], ["score", "To keep a score during a game."]],
      correct: "introduce",
      explanation: "This badge is for welcoming new students. It shows their initials to help them introduce themselves; it does not record attendance or scores.",
    },
    {
      key: "mission_trigger", question: "When should the student's initials appear?",
      options: [["start", "As soon as the badge starts, instead of the welcome icon."], ["delay", "After a short delay, without anyone pressing a button."], ["button", "After someone presses Button A."]],
      correct: "button",
      explanation: "The welcome icon appears first. The badge waits for Button A before showing the initials, so the student controls when to show them.",
    },
    {
      key: "mission_outcome", question: "What will you create in today's theory lesson?",
      options: [["plan", "An ordered plan and a flowchart showing the badge's steps."], ["program", "A finished program downloaded to the micro:bit."], ["poster", "A poster showing only the badge's colours and decoration."]],
      correct: "plan",
      explanation: "Today you will break the problem into parts, order the instructions and draw a flowchart. You are planning the behaviour before writing the program.",
    },
  ];

  // Same question and option order in every language; support never hides distractors.
  const MISSION_QUIZ_SUPPORT = {
    zh: [
      ["我们为什么要规划这个智能徽章？", ["自动记录出勤。", "帮助新同学用姓名首字母介绍自己。", "记录游戏得分。"], "这个徽章用于欢迎新同学。它显示姓名首字母来帮助同学介绍自己，不记录出勤或得分。"],
      ["学生的姓名首字母应该在什么时候显示？", ["徽章启动时立刻显示，代替欢迎图标。", "稍等片刻就显示，不需要按按钮。", "有人按下 Button A 之后。"], "先显示欢迎图标，再等待 Button A 被按下，然后显示姓名首字母。学生可以决定何时显示。"],
      ["今天的理论课中，你要制作什么？", ["有顺序的计划，以及显示徽章步骤的流程图。", "已经下载到 micro:bit 的完整程序。", "只展示徽章颜色和装饰的海报。"], "今天先把问题拆成小部分、排列指令并画流程图。我们先规划行为，还不编写程序。"],
    ],
    ms: [
      ["Mengapakah kita merancang Lencana Pintar ini?", ["Untuk merekod kehadiran secara automatik.", "Untuk membantu murid baharu memperkenalkan diri menggunakan huruf awal nama mereka.", "Untuk menyimpan skor permainan."], "Lencana ini menyambut murid baharu. Ia memaparkan huruf awal nama untuk membantu mereka memperkenalkan diri, bukan merekod kehadiran atau skor."],
      ["Bilakah huruf awal nama murid patut dipaparkan?", ["Sebaik sahaja lencana bermula, menggantikan ikon alu-aluan.", "Selepas menunggu sebentar, tanpa menekan butang.", "Selepas seseorang menekan Button A."], "Ikon alu-aluan muncul dahulu. Lencana menunggu Button A ditekan sebelum memaparkan huruf awal nama, supaya murid menentukan bila ia dipaparkan."],
      ["Apakah yang akan anda hasilkan dalam pelajaran teori hari ini?", ["Pelan tersusun dan carta alir yang menunjukkan langkah lencana.", "Program lengkap yang telah dimuat turun ke micro:bit.", "Poster yang hanya menunjukkan warna dan hiasan lencana."], "Hari ini anda memecahkan masalah kepada bahagian kecil, menyusun arahan dan melukis carta alir. Anda merancang tingkah laku sebelum menulis program."],
    ],
    ko: [
      ["이 스마트 배지를 왜 계획하나요?", ["출석을 자동으로 기록하기 위해서입니다.", "새 학생들이 이름의 이니셜로 자신을 소개하도록 돕기 위해서입니다.", "게임 점수를 기록하기 위해서입니다."], "이 배지는 새 학생들을 환영하기 위한 것입니다. 이니셜을 보여 주어 자기소개를 돕고, 출석이나 점수를 기록하지는 않습니다."],
      ["학생의 이니셜은 언제 표시되어야 하나요?", ["배지가 시작되자마자 환영 아이콘 대신 표시됩니다.", "아무도 버튼을 누르지 않아도 잠시 후 표시됩니다.", "누군가 Button A를 누른 후 표시됩니다."], "환영 아이콘이 먼저 나타납니다. 배지는 Button A를 누를 때까지 기다린 뒤 이니셜을 표시합니다. 학생이 표시 시점을 정할 수 있습니다."],
      ["오늘 이론 수업에서 무엇을 만드나요?", ["배지의 단계를 보여 주는 순서 있는 계획과 순서도입니다.", "micro:bit에 내려받은 완성된 프로그램입니다.", "배지의 색과 장식만 보여 주는 포스터입니다."], "오늘은 문제를 작은 부분으로 나누고, 지시의 순서를 정하고, 순서도를 그립니다. 프로그램을 작성하기 전에 동작을 계획하는 것입니다."],
    ],
  };

  const RESPONSE_LABELS = {
    mission_read: "Our mission — reading finished",
    mission_purpose: "Mission Q1 — purpose of the Smart Badge",
    mission_trigger: "Mission Q2 — when the initials appear",
    mission_outcome: "Mission Q3 — today's theory outcome",
    do_input: "Do Now — Smart Badge input",
    do_output: "Do Now — final output",
    learning_type: "Previous version — selected learning focus",
    learning_strategy: "Previous version — selected strategy",
    ksu_k_confidence: "Knowledge — could I explain both words before checking?",
    ksu_k_algorithm: "Knowledge — my explanation of algorithm",
    ksu_k_decomposition: "Knowledge — my explanation of decomposition",
    ksu_k_help: "Knowledge — requested explanation help",
    ksu_k_read: "Knowledge — read the guide and tried recall",
    ksu_s_instruction: "Skills — my precise Button A instruction",
    ksu_s_help: "Skills — requested a writing prompt",
    ksu_s_ready: "Skills — my sentence includes when, what and where (self-check)",
    ksu_u_meaning: "Understanding — my interpretation of the arrow",
    ksu_plan: "My evidence-based practice plan",
    symbol_start: "Main Task 1 — START symbol",
    symbol_output: "Main Task 1 — output symbol",
    precise_output: "Main Task 1 — precise displayed content",
    evidence_teacher_checked: "Main Task 2 — student reports teacher checked paper",
    evidence_teacher_pending: "Main Task 2 — paper ready, teacher review pending",
    flowchart_home_draft: "Main Task 2 — optional own-language draft",
    flowchart_explanation: "Main Task 2 — flowchart explanation",
    extension_1: "Extension Level 1 — Button B event, output and purpose",
    extension_2: "Extension Level 2 — side-by-side A and B paper flowcharts",
    extension_3: "Extension Level 3 — keep/change explanation and paper test",
    pitstop_stage: "Learning Pitstop — current stage",
    pitstop_action: "Learning Pitstop — next action",
    pit_q_algorithm: "Pitstop Knowledge — algorithm and sequence",
    pit_q_decomposition: "Pitstop Knowledge — decomposition",
    pit_q_precision: "Pitstop Skills — precise instruction example",
    pit_q_input: "Pitstop Understanding — input step",
    pit_q_process: "Pitstop Understanding — processing step",
    pit_q_output: "Pitstop Understanding — output step",
    pit_instruction: "Pitstop Skills — own instruction (teacher review)",
    pit_ready_k: "Pitstop Knowledge — student reports independent explanation",
    pit_ready_s: "Pitstop Skills — student reports precise ordered instructions",
    pit_ready_u: "Pitstop Understanding — student reports confident tracing",
    pit_difficulty: "Pitstop — perceived challenge",
    pit_familiarity: "Pitstop — learning compared with lesson start",
    pit_suggested: "Pitstop — app suggestion, not a diagnosis",
    pit_reason: "Pitstop — feeling, evidence and reason for chosen stage",
    pit_plan_k: "Pitstop — my vocabulary recall practice",
    pit_plan_s: "Pitstop — my precise-instruction practice",
    pit_plan_u: "Pitstop — my flowchart-reading practice",
    plenary_decomposition: "Plenary — decomposition",
    plenary_input: "Plenary — why Button A is an input",
    plenary_flowchart: "Plenary — how the flowchart helped",
    plenary_readiness: "Plenary — project readiness",
    finish_answer: "Optional after-submission puzzle — selected answer",
  };

  const SUPPORT_LABELS = { en: "", zh: "中文", ms: "Bahasa Melayu", ko: "한국어" };
  MAIN1_CARDS.forEach((card, index) => {
    card.questions.forEach((question) => { RESPONSE_LABELS[question.key] = `${card.part.replace("MAIN TASK", "Main Task")} — ${question.prompt}`; });
    RESPONSE_LABELS[`m1_help_${index}`] = `Main Task 1 card ${index + 1} — help requested`;
  });
  RESPONSE_LABELS.m1_stretch_repair = "Main Task 1 challenge — repair shape and sequence";
  RESPONSE_LABELS.m1_stretch_access = "Main Task 1 challenge — adapt output for a new user and test it";
  const LANGUAGE_SUPPORT = {
    zh: {
      mission: "想象学校正在欢迎新同学。你设计的智能徽章会显示姓名首字母，帮助他们介绍自己。徽章启动时先显示欢迎图标，然后等待 Button A 被按下，才显示学生的姓名首字母。今天，你会把问题拆成小部分，把清楚的指令排列好，并画出流程图（显示步骤的图）。今天先规划徽章的行为，还不编写代码。读完后，勾选下方的方框，再回答三个小问题。",
      doNow: "任务：阅读同一个智能徽章情境。把四个步骤按顺序排列，然后找出输入（Button A）和最终输出（学生姓名首字母）。关键词：input 输入；output 输出。",
      types: "选择你今天最需要加强的学习类型：Knowledge 知识、Skills 技能或 Understanding 理解。然后选择一种进步方法。",
      main1: "Algorithm（算法）是准确、有顺序的指令。Decomposition（分解）是把大问题拆成小部分。Flowchart（流程图）用标准图形和箭头表示算法。",
      main2: "在 A4 纸上画自己的智能徽章流程图，并解释图标、按钮 A 和姓名首字母的顺序。让老师查看纸上的流程图；照片是可选的。",
      extension1: "事件是程序会响应的事情。按下并松开按钮 B 是输入，显示图像或文字是输出。保留按钮 A 显示姓名首字母的功能，为 B 选择不同的用途，例如显示 HI、勾号或指路箭头。句式：当按钮 B 被按下时，显示___。这能帮助___，因为___。可以先用中文写，再参考英文提示表达自己的想法。",
      extension2: "在 A4 纸上并排画两列：左边是按钮 A，右边是按钮 B。每列用椭圆表示开始和结束，用平行四边形表示按钮输入和显示输出，用箭头连接本列的步骤。不要把 A 的结尾连接到 B 的开头；欢迎图像显示后，可以先按任意一个按钮。句式：A 仍然显示___，B 改为显示___。照片不是必需的。",
      extension3: "用手指沿着纸上的流程图测试：启动后先按 B，再按 A，最后再按 B。每次应该显示什么？保留原来的欢迎图像和 A 的功能。句式：我保留了___，添加了___，因为___。先按 B 时应该显示___。A 仍然显示___。我改进了___。",
      pitstop: "选择你现在的学习状态，并选择下一步行动。Drowning 表示你需要帮助，不代表失败。",
      plenary: "回答三个简短问题：分解有什么帮助？为什么 Button A 是输入？流程图怎样帮助你规划？",
    },
    ms: {
      mission: "Bayangkan sekolah kita menyambut murid baharu. Lencana Pintar anda membantu mereka memperkenalkan diri menggunakan huruf awal nama mereka. Apabila bermula, ikon alu-aluan muncul. Lencana kemudian menunggu Button A ditekan sebelum memaparkan huruf awal nama murid. Hari ini, anda akan memecahkan masalah kepada bahagian kecil, menyusun arahan yang jelas dan melukis carta alir: gambar rajah yang menunjukkan langkah. Anda merancang tindakan lencana, belum menulis kod. Selepas membaca, tandakan kotak di bawah dan jawab tiga soalan ringkas.",
      doNow: "Tugas: Baca satu senario Lencana Pintar. Susun empat langkah, kemudian kenal pasti input (Button A) dan output terakhir (inisial murid).",
      types: "Pilih fokus utama anda hari ini: Knowledge (pengetahuan), Skills (kemahiran) atau Understanding (pemahaman). Kemudian pilih satu strategi untuk bertambah baik.",
      main1: "Algorithm ialah arahan tepat yang tersusun. Decomposition memecahkan masalah besar kepada bahagian kecil. Flowchart menggunakan simbol piawai dan anak panah untuk menunjukkan algoritma.",
      main2: "Lukis carta alir Lencana Pintar sendiri pada kertas A4 dan terangkan urutan ikon, Butang A dan huruf awal nama. Tunjukkan kertas kepada guru; foto adalah pilihan.",
      extension1: "Peristiwa ialah sesuatu yang menyebabkan program bertindak balas. Menekan dan melepaskan Butang B ialah input; imej atau teks ialah output. Kekalkan huruf awal nama pada A. Pilih tujuan lain untuk B, seperti HI, tanda semak atau anak panah arah. Rangka ayat: Apabila Butang B ditekan, paparkan ___. Ini membantu ___ kerana ___. Kamu boleh menulis dalam bahasa sendiri dahulu sebelum mencuba rangka bahasa Inggeris.",
      extension2: "Pada kertas A4, lukis dua lajur bersebelahan: A di kiri dan B di kanan. Gunakan bujur untuk mula/tamat, segi empat selari untuk input/output, dan anak panah dalam setiap lajur. Jangan sambungkan hujung A ke permulaan B. Selepas imej alu-aluan, mana-mana butang boleh ditekan dahulu. Rangka ayat: A masih memaparkan ___; B memaparkan ___. Foto tidak diperlukan.",
      extension3: "Jejak carta alir dengan jari: mulakan lencana, tekan B dahulu, kemudian A, kemudian B sekali lagi. Apakah output setiap kali? Rangka ayat: Saya mengekalkan ___ dan menambah ___ supaya ___. Apabila B diuji dahulu, outputnya ___. A masih memaparkan ___. Saya membaiki ___.",
      pitstop: "Pilih tahap pembelajaran anda sekarang dan satu tindakan seterusnya. Drowning bermaksud anda memerlukan bantuan; ia bukan kegagalan.",
      plenary: "Jawab tiga soalan ringkas: Bagaimanakah decomposition membantu? Mengapa Button A ialah input? Bagaimanakah flowchart membantu perancangan?",
    },
    ko: {
      mission: "우리 학교가 새 학생들을 환영한다고 상상해 보세요. 여러분의 스마트 배지는 학생들이 이름의 이니셜로 자신을 소개하도록 돕습니다. 배지가 시작되면 환영 아이콘이 나타납니다. 그런 다음 Button A를 누를 때까지 기다렸다가 학생의 이니셜을 표시합니다. 오늘은 문제를 작은 부분으로 나누고, 명확한 지시를 순서대로 정리하고, 단계를 보여 주는 그림인 순서도를 그립니다. 오늘은 배지의 동작을 계획하며, 아직 코드를 작성하지 않습니다. 다 읽으면 아래 확인란을 선택하고 간단한 질문 세 개에 답하세요.",
      doNow: "과제: 하나의 스마트 배지 상황을 읽으세요. 네 단계를 순서대로 배열한 뒤 입력(Button A)과 마지막 출력(학생 이니셜)을 찾으세요.",
      types: "오늘 가장 집중할 학습 유형을 선택하세요: Knowledge(지식), Skills(기능), Understanding(이해). 그리고 향상 방법 하나를 선택하세요.",
      main1: "Algorithm(알고리즘)은 정확하고 순서가 있는 지시입니다. Decomposition(분해)은 큰 문제를 작은 부분으로 나누는 것입니다. Flowchart(순서도)는 표준 기호와 화살표로 알고리즘을 나타냅니다.",
      main2: "A4 용지에 자신만의 스마트 배지 순서도를 그리고 아이콘, 버튼 A, 이름 이니셜의 순서를 설명하세요. 종이를 선생님께 보여 주세요. 사진은 선택 사항입니다.",
      extension1: "이벤트는 프로그램이 반응하는 일입니다. 버튼 B를 눌렀다 놓는 것은 입력이고, 그림이나 글자를 표시하는 것은 출력입니다. A의 이름 이니셜 기능은 그대로 두고 B에 다른 목적을 정하세요. 예: HI, 확인 표시, 길 안내 화살표. 문장 틀: 버튼 B를 누르면 ___을/를 표시합니다. 이것은 ___에게 도움이 됩니다. 왜냐하면 ___이기 때문입니다. 한국어로 먼저 쓴 뒤 영어 문장 틀을 참고해도 됩니다.",
      extension2: "A4 종이에 A는 왼쪽, B는 오른쪽에 나란히 그리세요. 시작과 끝은 타원, 입력과 출력은 평행사변형을 사용하고 각 열 안에서 화살표로 연결하세요. A의 끝을 B의 시작에 연결하지 마세요. 환영 이미지가 표시된 뒤에는 어느 버튼이든 먼저 누를 수 있습니다. 문장 틀: A는 여전히 ___을/를 표시하고, B는 ___을/를 표시합니다. 사진은 필요하지 않습니다.",
      extension3: "손가락으로 종이 순서도를 따라가며 테스트하세요. 시작 후 B를 먼저 누르고, A를 누른 다음 B를 다시 누릅니다. 매번 무엇이 표시되어야 하나요? 문장 틀: 저는 ___을/를 유지하고 ___을/를 추가했습니다. 목적은 ___입니다. B를 먼저 누르면 ___이/가 표시됩니다. A는 여전히 ___을/를 표시합니다. 저는 ___을/를 개선했습니다.",
      pitstop: "현재 학습 상태와 다음 행동을 선택하세요. Drowning은 도움이 필요하다는 뜻이며 실패가 아닙니다.",
      plenary: "세 가지 짧은 질문에 답하세요: 분해는 어떻게 도움이 되었나요? 왜 Button A가 입력인가요? 순서도가 계획에 어떻게 도움이 되었나요?",
    },
  };

  const PITSTOP_ADVICE = {
    new: ["New learning", "Use the word bank and keep the worked example open while you explain each symbol."],
    consolidating: ["Consolidating", "Cover the example and explain your own flowchart aloud from START to END."],
    treading: ["Treading water", "Move to the Button B extension so you must adapt the algorithm rather than copy it."],
    drowning: ["Drowning", "Return to the labelled example. Ask your teacher to check just one symbol or arrow at a time."],
  };

  const PIT_QUESTIONS = [
    {card:0,key:'pit_q_algorithm',prompt:'Which explanation of an algorithm is best?',answer:'ordered',options:[['picture','A picture of a computer'],['ordered','Precise instructions in a logical order (a sequence)'],['parts','A list of hardware parts'],['help','Not sure yet — show me the explanation']],feedback:'An algorithm is a set of precise instructions in a logical order. Sequence means the order of those instructions.'},
    {card:0,key:'pit_q_decomposition',prompt:'How would decomposition help with the Smart Badge?',answer:'parts',options:[['short','Make every instruction shorter, even if details are lost'],['parts','Break the problem into welcome display, button input and initials output'],['remove','Remove the button because it is difficult'],['help','Not sure yet — show me the explanation']],feedback:'Decomposition splits a problem into manageable parts. Each part still needs clear instructions; it does not mean deleting difficult requirements.'},
    {card:1,key:'pit_q_precision',prompt:'Which instruction gives the computer a clear trigger, output and place?',answer:'precise',options:[['nice','When something happens, show something nice'],['precise','When Button A is pressed, display JT on the LED matrix'],['wait','Wait for a while and do the badge'],['help','Not sure yet — show me the explanation']],feedback:'Use WHEN (Button A is pressed), WHAT (the exact initials JT), and WHERE (the LED matrix). These details remove guessing. Your own sentence is not automatically marked.'},
    {card:2,key:'pit_q_input',prompt:'Which numbered step receives input from the person?',answer:'1',options:[['1','1 — Wait for Button A'],['2','2 — Make the greeting'],['3','3 — Display the greeting'],['help','Not sure yet — help me trace it']],feedback:'Step 1 receives the button input. Its parallelogram describes information entering the system.'},
    {card:2,key:'pit_q_process',prompt:'Which step processes information inside the program?',answer:'2',options:[['1','1 — Wait for Button A'],['2','2 — Make the greeting'],['3','3 — Display the greeting'],['help','Not sure yet — help me trace it']],feedback:'Step 2 is processing: joining HELLO and JT creates HELLO JT inside the program. The rectangle is a process. The text is not displayed yet.'},
    {card:2,key:'pit_q_output',prompt:'Which step sends the result to the LEDs?',answer:'3',options:[['1','1 — Wait for Button A'],['2','2 — Make the greeting'],['3','3 — Display the greeting'],['help','Not sure yet — help me trace it']],feedback:'Step 3 displays the greeting as output. Input and output share the parallelogram shape: read the action to distinguish them. Follow arrows, not just shapes.'},
  ];
  const PIT_READY = ['pit_ready_k','pit_ready_s','pit_ready_u'];
  const PIT_REPORT_KEYS = [...PIT_QUESTIONS.map(q=>q.key),'pit_instruction',...PIT_READY,'pit_difficulty','pit_familiarity','pit_suggested','pitstop_stage','pit_reason','pit_plan_k','pit_plan_s','pit_plan_u'];

  const KSU_STEPS = ["Knowledge", "Skills", "Understanding"];
  const KSU_FIELDS = [
    ["ksu_k_confidence", "ksu_k_algorithm", "ksu_k_decomposition", "ksu_k_help", "ksu_k_read"],
    ["ksu_s_instruction", "ksu_s_help"],
    ["ksu_u_meaning"],
  ];
  const KSU_REPORT_KEYS = [...KSU_FIELDS[0], ...KSU_FIELDS[1], "ksu_s_ready", ...KSU_FIELDS[2], "ksu_plan"];
  const KSU_LANGUAGE = {
    zh: [
      "知识：你能解释 algorithm（算法）和 decomposition（分解）吗？选“是”后，用自己的话简短解释。选“还不会”或勾选需要帮助，就阅读本页指南。算法是准确、有顺序的指令；分解是把大问题拆成小部分。流程图中，椭圆表示开始/结束，平行四边形表示输入/输出，长方形表示处理，箭头表示顺序。读完后遮住解释，尝试回忆一个意思，再勾选确认。不会也可以请求帮助，不需要完美答案。",
      "技能：把“显示一些东西”改得更明确。写清楚什么时候、显示什么、在哪里显示。句式：当___被按下时，在___上显示___。可用词：Button A、我的姓名首字母、LED matrix（LED点阵）。需要提示时勾选帮助。检查后，再选择你的句子是否包含这三点；还不会就选“Not yet”，这会成为今天的练习目标。老师会看你的句子，系统不会按关键词给写作评分。",
      "理解：找到流程图中的 Button A，沿箭头走向 DISPLAY initials（显示姓名首字母）。选择你对这部分的理解：A 按键输入后，micro:bit执行指令并输出姓名首字母；B 姓名首字母先出现，使按钮自己按下；C 箭头只是装饰，顺序随意；D 还看不懂，需要讲解。答错不会阻止继续。请求帮助后，沿箭头再读一遍，并向同伴解释。",
      "这是根据你刚才的解释、尝试和求助形成的练习计划，不是给你贴学习类型标签。你可以同时加强知识、技能和理解。把这些具体目标带到主任务一和你自己的流程图中。",
    ],
    ko: [
      "지식: algorithm(알고리즘)과 decomposition(분해)을 설명할 수 있나요? ‘예’를 고르면 자신의 말로 짧게 설명하세요. ‘아직 아니요’ 또는 도움 요청을 고르면 이 페이지의 안내를 읽으세요. 알고리즘은 정확하고 순서가 있는 지시이며, 분해는 큰 문제를 작은 부분으로 나누는 것입니다. 순서도에서 타원은 시작/끝, 평행사변형은 입력/출력, 직사각형은 처리, 화살표는 순서를 뜻합니다. 설명을 가리고 뜻 하나를 떠올려 본 뒤 확인란을 선택하세요. 완벽한 답은 필요하지 않습니다.",
      "기능: ‘무언가를 보여 줘’를 더 정확하게 고쳐 쓰세요. 언제, 무엇을, 어디에 표시하는지 쓰세요. 문장 틀: ___을 누르면 ___에 ___을 표시한다. 사용할 말: Button A, 내 이니셜, LED matrix(LED 표시판). 필요하면 도움 확인란을 선택하세요. 피드백을 읽고 세 가지가 모두 있는지 스스로 확인하세요. 아직 어렵다면 ‘Not yet’을 선택하세요. 이것이 오늘의 연습 목표가 됩니다. 글은 교사가 검토하며, 시스템은 특정 단어만으로 채점하지 않습니다.",
      "이해: 순서도에서 Button A를 찾고 화살표를 따라 DISPLAY initials(이니셜 표시)로 가세요. A 버튼 입력 후 micro:bit가 지시를 실행하여 이니셜을 출력한다. B 이니셜이 먼저 나타나 버튼을 저절로 누르게 한다. C 화살표는 장식이므로 순서는 상관없다. D 아직 읽기 어려워 설명이 필요하다. 맞는 해석을 선택하세요. 틀려도 계속할 수 있습니다. 도움이 필요하면 설명을 읽고 화살표를 다시 따라가며 친구에게 설명해 보세요.",
      "방금 쓴 설명, 시도, 도움 요청을 바탕으로 만든 연습 계획입니다. 여러분을 특정 학습 유형으로 분류하는 것이 아닙니다. 지식, 기능, 이해를 동시에 발전시킬 수 있습니다. 이 목표를 주 과제와 자신의 순서도에 적용하세요.",
    ],
    ms: [
      "Pengetahuan: Bolehkah anda menerangkan algorithm (algoritma) dan decomposition (penguraian)? Jika Ya, terangkan dengan kata-kata sendiri. Jika Belum atau perlukan bantuan, baca panduan di sini. Algoritma ialah arahan tepat yang tersusun; penguraian memecahkan masalah besar kepada bahagian kecil. Dalam carta alir, bujur ialah mula/tamat, segi empat selari ialah input/output, segi empat tepat ialah proses, dan anak panah menunjukkan urutan. Tutup penerangan dan cuba ingat satu maksud, kemudian tandakan pengesahan. Jawapan sempurna tidak diperlukan.",
      "Kemahiran: Jadikan ‘Paparkan sesuatu’ lebih tepat. Nyatakan bila, apa dan di mana. Rangka ayat: Apabila ___ ditekan, paparkan ___ pada ___. Gunakan Button A, huruf awal nama saya dan LED matrix. Tandakan bantuan jika perlu. Selepas maklum balas, semak sama ada ayat mempunyai ketiga-tiga butiran. Pilih Not yet jika belum; ini menjadi sasaran latihan. Guru menyemak penulisan, bukan pemarkahan berdasarkan kata kunci.",
      "Pemahaman: Cari Button A dalam carta alir, kemudian ikut anak panah ke DISPLAY initials. Pilih maksudnya: A Tekanan butang ialah input; micro:bit mengikut arahan dan memaparkan huruf awal nama sebagai output. B Huruf nama muncul dahulu lalu menekan butang sendiri. C Anak panah hanya hiasan dan urutan tidak penting. D Saya belum dapat mengikutinya dan perlukan penerangan. Jawapan salah tidak menghalang anda. Ikut anak panah sekali lagi dan terangkan kepada rakan selepas membaca bantuan.",
      "Pelan ini berdasarkan penerangan, percubaan dan bantuan yang anda perlukan, bukan label jenis pelajar. Anda boleh memperbaiki lebih daripada satu bidang. Gunakan langkah khusus ini dalam tugasan utama dan carta alir anda.",
    ],
  };

  let state = null;
  let stateKey = "";
  let saveTimer = null;
  let lastPdfBlob = null;
  let pdfPreviewUrl = '';
  let submissionReturnFocus = null;
  const GIMKIT_ASSIGNMENT_URL = 'https://www.gimkit.com/join/6aa32a67027821ed7517095b';
  const GIMKIT_DEADLINE = '2026-09-18T17:00:00+08:00';
  const FINISHERS = [
    {title:'Rescue the early initials',prompt:'A badge shows its initials before anyone presses Button A. Which repair matches our brief?',options:['Put WAIT for Button A before DISPLAY initials.','Remove the welcome image.','Change the initials to a full name.'],answer:'0',explain:'The badge must wait for its input before displaying the initials. The welcome image still comes first.'},
    {title:'Make the helper precise',prompt:'Your badge should point visitors to a desk on the left when B is pressed. Which instruction is clearest?',options:['Show something helpful.','When Button B is pressed, display a left arrow on the LED matrix.','Display a nice shape later.'],answer:'1',explain:'The instruction states when (B), what (left arrow) and where (LED matrix). It also has a useful purpose.'},
    {title:'Spot the processing',prompt:'The badge joins HELLO and JT to make HELLO JT, then shows it. Which action is processing?',options:['Pressing Button A.','Displaying HELLO JT on the LEDs.','Joining the two pieces of text inside the program.'],answer:'2',explain:'Making the greeting is processing. Showing it is output; pressing the button supplies input.'},
  ];

  function isAppleMobile() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Mac/.test(navigator.platform || '') && navigator.maxTouchPoints > 1); }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function makeDefaultState(student, teacherMode = false) {
    return {
      lessonId: LESSON_ID,
      schemaVersion: SCHEMA_VERSION,
      student,
      teacherMode,
      currentSection: "mission",
      missionView: "reading",
      missionQuestion: 0,
      legacyMissionAccess: false,
      typesStep: 0,
      main1Card: 0,
      main1View: "study",
      paperView: "draw",
      pitCard: 0,
      submission: {device:isAppleMobile()?'ios':'laptop',step:0,requestedAt:null,confirmedAt:null,filename:'',method:'',history:[]},
      finisherId: null,
      supportLanguage: student.supportLanguage || "en",
      sequence: [...START_SEQUENCE],
      responses: {},
      checks: {},
      completed: {},
      evidence: null,
      extensionLevel: 1,
      extensionCard: 1,
      timestamps: { started: new Date().toISOString(), lastSaved: null, completed: {} },
    };
  }

  function normalizeState(saved, student, teacherMode) {
    const fresh = makeDefaultState(student, teacherMode);
    if (!saved || saved.lessonId !== LESSON_ID) return fresh;
    // Keep earlier students' work and access; do not claim they read the new introduction.
    const hasEarlierWork = Object.keys(saved.responses || {}).length > 0 || Object.values(saved.completed || {}).some(Boolean)
      || (Array.isArray(saved.sequence) && saved.sequence.some((step, index) => step !== START_SEQUENCE[index]));
    const legacyMissionAccess = Boolean(saved.legacyMissionAccess || ((saved.schemaVersion || 0) < 4 && hasEarlierWork));
    return {
      ...fresh,
      ...saved,
      schemaVersion: SCHEMA_VERSION,
      student,
      teacherMode,
      currentSection: (saved.schemaVersion || 0) < 4 && !hasEarlierWork ? "mission" : saved.currentSection || "mission",
      missionView: saved.missionView === "quiz" && (saved.responses?.mission_read || teacherMode) ? "quiz" : "reading",
      missionQuestion: Number.isInteger(saved.missionQuestion) ? Math.max(0, Math.min(2, saved.missionQuestion)) : 0,
      legacyMissionAccess,
      typesStep: Number.isInteger(saved.typesStep) ? Math.max(0, Math.min(3, saved.typesStep)) : 0,
      main1Card: Number.isInteger(saved.main1Card) ? Math.max(0, Math.min(MAIN1_CARDS.length - 1, saved.main1Card)) : 0,
      main1View: saved.main1View === "practice" ? "practice" : "study",
      paperView: saved.paperView === "explain" ? "explain" : "draw",
      pitCard: Number.isInteger(saved.pitCard) ? Math.max(0, Math.min(4, saved.pitCard)) : 0,
      submission: {...fresh.submission,...(saved.submission || {}),device:saved.submission?.device==='ios'?'ios':saved.submission?.device==='laptop'?'laptop':fresh.submission.device,step:Math.max(0,Math.min(2,Number(saved.submission?.step)||0))},
      finisherId: Number.isInteger(saved.finisherId) && saved.finisherId>=0 && saved.finisherId<FINISHERS.length ? saved.finisherId : null,
      extensionCard: Number.isInteger(saved.extensionCard) ? Math.max(1, Math.min(3, saved.extensionCard)) : Math.min(3, Math.max(1, Number(saved.extensionLevel) || 1)),
      supportLanguage: student.supportLanguage || saved.supportLanguage || "en",
      sequence: Array.isArray(saved.sequence) && saved.sequence.length === 4 ? saved.sequence : fresh.sequence,
      responses: { ...(saved.responses || {}) },
      checks: { ...(saved.checks || {}) },
      completed: { ...(saved.completed || {}) },
      timestamps: { ...fresh.timestamps, ...(saved.timestamps || {}), completed: { ...(saved.timestamps?.completed || {}) } },
    };
  }

  function slug(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "student";
  }

  function buildStateKey(student, teacherMode) {
    return teacherMode ? `${LESSON_ID}:teacher-review` : `${LESSON_ID}:${slug(student.className)}:${slug(student.name)}`;
  }

  function loadState(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  }

  function scheduleSave() {
    if (!state) return;
    setSaveStatus("Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, SAVE_DELAY);
  }

  function saveState() {
    if (!state) return;
    state.timestamps.lastSaved = new Date().toISOString();
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
      localStorage.setItem(LAST_PROFILE_KEY, JSON.stringify(state.student));
      setSaveStatus("Saved");
    } catch (error) {
      setSaveStatus("Save failed");
      showFeedback("exportFeedback", "error", "Browser storage is full", ["Download a backup now. The uploaded image may be too large."]);
    }
  }

  function setSaveStatus(text) { const element = $("#saveStatus"); if (element) element.textContent = text; }

  function getResponse(key) { return state?.responses?.[key] ?? ""; }
  function setResponse(key, value) { state.responses[key] = value; scheduleSave(); }

  function captureInput(target) {
    const key = target.dataset.track;
    if (!key || !state) return;
    if (target.type === "radio") {
      if (target.checked) setResponse(key, target.value);
    } else if (target.type === "checkbox") {
      setResponse(key, target.checked);
    } else {
      setResponse(key, target.value);
    }
    if (key.startsWith('pit_') || key === 'pitstop_stage') renderPitstop();
    if (target.checked && ["evidence_teacher_checked", "evidence_teacher_pending"].includes(key)) {
      const other = key === "evidence_teacher_checked" ? "evidence_teacher_pending" : "evidence_teacher_checked";
      setResponse(other, false);
      $(`[data-track="${other}"]`).checked = false;
    }
    if (MISSION_QUESTIONS.some((question) => question.key === key)) renderMissionFeedback();
    if (key === "ksu_s_instruction" || key === "ksu_s_help") setResponse("ksu_s_ready", "");
    if (key.startsWith("ksu_")) renderKsu();
    if (MAIN1_CARDS.some((card) => card.questions.some((question) => question.key === key)) || key.startsWith("m1_help_")) refreshMain1Feedback();
  }

  function hydrateInputs() {
    $$('[data-track]').forEach((element) => {
      const value = getResponse(element.dataset.track);
      if (element.type === "radio") element.checked = value === element.value;
      else if (element.type === "checkbox") element.checked = value === true;
      else element.value = value || "";
    });
  }

  function markComplete(sectionId) {
    state.completed[sectionId] = true;
    state.timestamps.completed[sectionId] = state.timestamps.completed[sectionId] || new Date().toISOString();
    scheduleSave();
    renderNavigation();
    updateProgress();
  }

  function isUnlocked(sectionId) {
    if (sectionId==='finisher') return !!state?.submission?.confirmedAt;
    if (state?.teacherMode) return true;
    const rules = {
      mission: true,
      doNow: state?.completed?.mission || state?.legacyMissionAccess,
      types: state?.completed?.doNow,
      main1: state?.completed?.types,
      main2: state?.completed?.main1,
      extension: state?.completed?.main2,
      pitstop: state?.completed?.main2,
      plenary: state?.completed?.pitstop,
      review: state?.completed?.plenary,
    };
    return Boolean(rules[sectionId]);
  }

  function renderNavigation() {
    const html = SECTIONS.filter(section=>section.id!=='finisher' || state.submission?.confirmedAt).map((section, index) => {
      const completed = Boolean(state.completed[section.id]);
      const active = state.currentSection === section.id;
      const optional = section.optional ? " · optional" : "";
      return `<button class="journey-button${completed ? " completed" : ""}${active ? " active" : ""}" data-go="${section.id}" type="button" ${isUnlocked(section.id) ? "" : "disabled"}><span>${completed ? "✓" : index + 1}</span><span>${section.label}${optional}</span></button>`;
    }).join("");
    $("#journeyButtons").innerHTML = html;
    $("#mobileJourney").innerHTML = `<div class="mobile-journey-list">${html}</div>`;
  }

  function updateProgress() {
    const completed = CORE_IDS.filter((id) => state.completed[id]).length;
    const percent = Math.round((completed / CORE_IDS.length) * 100);
    $("#progressText").textContent = `${percent}%`;
    $("#progressBar").style.width = `${percent}%`;
    const coreIndex = CORE_IDS.indexOf(state.currentSection);
    const label = SECTIONS.find((section) => section.id === state.currentSection)?.label || "Lesson";
    $("#stageCounter").textContent = coreIndex >= 0 ? `${label} · ${coreIndex + 1} of ${CORE_IDS.length}` : label;
  }

  function goTo(sectionId) {
    if (!isUnlocked(sectionId)) return;
    state.currentSection = sectionId;
    $$(".lesson-section").forEach((section) => section.classList.toggle("active", section.dataset.section === sectionId));
    renderNavigation();
    updateProgress();
    if (sectionId === "review") renderReview();
    if (sectionId === "mission") renderMission();
    if (sectionId === "types") renderKsu();
    if (sectionId === "main1") renderMain1();
    if (sectionId === 'finisher') renderFinisher();
    scheduleSave();
    $("#lessonContent").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobilePanels();
  }

  function showFeedback(id, type, title, messages) {
    const box = document.getElementById(id);
    if (!box) return;
    box.hidden = false;
    box.className = `feedback ${type}`;
    box.innerHTML = `<h3>${escapeHtml(title)}</h3>${messages.length ? `<ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>` : ""}`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function reviewedMissionAnswer(question) {
    const check = state.checks.mission?.questions?.[question.key];
    return check?.answer === getResponse(question.key) ? check : null;
  }

  function renderMission() {
    const quizVisible = state.missionView === "quiz";
    $("#missionReadingCard").hidden = quizVisible;
    $("#missionQuizCard").hidden = !quizVisible;
    if (!quizVisible) return;
    const question = MISSION_QUESTIONS[state.missionQuestion];
    $("#missionQuizCounter").textContent = `Question ${state.missionQuestion + 1} of 3`;
    $("#missionQuestion").innerHTML = `<fieldset class="mission-question"><legend>${escapeHtml(question.question)}</legend>${question.options.map(([value, label], index) => `<label class="choice"><input type="radio" name="missionAnswer" data-track="${question.key}" value="${value}" ${getResponse(question.key) === value ? "checked" : ""}><span>${String.fromCharCode(65 + index)}. ${escapeHtml(label)}</span></label>`).join("")}</fieldset>`;
    const translated = MISSION_QUIZ_SUPPORT[state.supportLanguage]?.[state.missionQuestion];
    $("#missionQuizLanguage").hidden = !translated;
    $("#missionQuizLanguage div").innerHTML = translated ? `<p lang="${state.supportLanguage}">${escapeHtml(translated[0])}</p><ol type="A" lang="${state.supportLanguage}">${translated[1].map((option) => `<li>${escapeHtml(option)}</li>`).join("")}</ol>` : "";
    renderMissionFeedback();
  }

  function renderMissionFeedback() {
    const question = MISSION_QUESTIONS[state.missionQuestion];
    const checked = reviewedMissionAnswer(question);
    const button = $("#missionQuizAction");
    button.textContent = checked ? (state.missionQuestion < 2 ? "Next question" : "Continue to Do Now") : "Check answer";
    $("#missionQuizFeedback").hidden = !checked;
    if (!checked) return;
    const messages = [question.explanation];
    const translated = MISSION_QUIZ_SUPPORT[state.supportLanguage]?.[state.missionQuestion];
    if (translated) messages.push(translated[2]);
    if (!checked.correct) messages.push("You may continue, or change your answer and check it again.");
    showFeedback("missionQuizFeedback", checked.correct ? "success" : "warning", checked.correct ? "That's right" : "Let's revisit this idea", messages);
  }

  function startMissionQuiz() {
    if (getResponse("mission_read") !== true && !state.teacherMode) {
      return showFeedback("missionReadingFeedback", "warning", "Read the mission first", ["When you have finished, tick the reading box and continue. You do not need to memorise every word."]);
    }
    if (getResponse("mission_read") === true) state.timestamps.missionReadAt ||= new Date().toISOString();
    $("#missionReadingFeedback").hidden = true;
    state.missionView = "quiz";
    renderMission();
    scheduleSave();
    $("#lessonContent").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceMissionQuiz() {
    const question = MISSION_QUESTIONS[state.missionQuestion];
    const answer = getResponse(question.key);
    const validAnswer = question.options.some(([value]) => value === answer);
    if (!validAnswer && !state.teacherMode) {
      return showFeedback("missionQuizFeedback", "warning", "Choose one answer", ["Select A, B or C. If you are unsure, use “Read the mission again”. A wrong answer will not block you."]);
    }
    if (validAnswer && !reviewedMissionAnswer(question)) {
      const checkedAt = new Date().toISOString();
      const check = { answer, correct: answer === question.correct, checkedAt };
      state.checks.mission ||= { questions: {}, attempts: [] };
      state.checks.mission.questions ||= {};
      state.checks.mission.attempts ||= [];
      state.checks.mission.questions[question.key] = check;
      state.checks.mission.attempts.push({ questionKey: question.key, ...check });
      renderMissionFeedback();
      scheduleSave();
      return;
    }
    if (state.missionQuestion < 2) state.missionQuestion += 1;
    else {
      const remaining = MISSION_QUESTIONS.findIndex((item) => !reviewedMissionAnswer(item));
      if (remaining >= 0 && !state.teacherMode) state.missionQuestion = remaining;
      else { markComplete("mission"); goTo("doNow"); return; }
    }
    renderMission();
    scheduleSave();
    $("#missionQuestion input")?.focus({ preventScroll: true });
  }

  function missionResultLines() {
    const lines = MISSION_QUESTIONS.map((question, index) => {
      const checked = reviewedMissionAnswer(question);
      const result = checked ? (checked.correct ? "Correct" : "Feedback given — revisit this idea") : (getResponse(question.key) ? "Selected, not checked" : "Not completed");
      return `Question ${index + 1}: ${result}`;
    });
    const attempts = state.checks.mission?.attempts || [];
    attempts.forEach((attempt, index) => {
      const question = MISSION_QUESTIONS.find((item) => item.key === attempt.questionKey);
      if (!question) return;
      const answer = question.options.find(([value]) => value === attempt.answer)?.[1] || String(attempt.answer);
      lines.push(`Check ${index + 1} — Q${MISSION_QUESTIONS.indexOf(question) + 1} (${attempt.checkedAt}): ${answer} — ${attempt.correct ? "Correct" : "Feedback given"}`);
    });
    return lines;
  }

  function renderSequence() {
    $("#sequenceList").innerHTML = state.sequence.map((step, index) => `
      <li class="sequence-item">
        <span class="sequence-number">${index + 1}</span>
        <span>${escapeHtml(step)}</span>
        <span class="sequence-controls">
          <button type="button" data-move="up" data-index="${index}" aria-label="Move step ${index + 1} up" ${index === 0 ? "disabled" : ""}>↑</button>
          <button type="button" data-move="down" data-index="${index}" aria-label="Move step ${index + 1} down" ${index === state.sequence.length - 1 ? "disabled" : ""}>↓</button>
        </span>
      </li>`).join("");
  }

  function moveSequence(index, direction) {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= state.sequence.length) return;
    [state.sequence[index], state.sequence[nextIndex]] = [state.sequence[nextIndex], state.sequence[index]];
    renderSequence();
    scheduleSave();
  }

  function checkDoNow() {
    const input = getResponse("do_input");
    const output = getResponse("do_output");
    if (!input || !output) {
      return showFeedback("doNowFeedback", "warning", "Make one choice in each box", ["Choose the event entering the system and the final visible output. Then check again."]);
    }
    const sequenceCorrect = state.sequence.every((step, index) => step === CORRECT_SEQUENCE[index]);
    const messages = [
      sequenceCorrect ? "Your four steps are in a logical order." : "Review the order: the badge must start before it displays anything, and the initials appear after Button A.",
      input === "button" ? "Correct: pressing Button A is the input event." : "Look again: the input is the event the visitor performs.",
      output === "initials" ? "Correct: the initials are the final visible output." : "Look for what the LED matrix displays at the end.",
    ];
    state.checks.doNow = { attempted: true, sequenceCorrect, inputCorrect: input === "button", outputCorrect: output === "initials" };
    markComplete("doNow");
    showFeedback("doNowFeedback", sequenceCorrect && input === "button" && output === "initials" ? "success" : "warning", "Do Now checked — you may continue", messages);
    $('[data-next="types"]', $('[data-section="doNow"]')).hidden = false;
  }

  function ksuSnapshot(step) { return JSON.stringify(KSU_FIELDS[step].map((key) => getResponse(key))); }

  function ksuChecked(step) {
    const check = state.checks.ksu?.[KSU_STEPS[step]];
    return check?.snapshot === ksuSnapshot(step) ? check : null;
  }

  function ksuPlan() {
    const k = ksuChecked(0), s = ksuChecked(1), u = ksuChecked(2);
    return [
      !k ? "Knowledge: not checked yet." : getResponse("ksu_k_confidence") === "no" || getResponse("ksu_k_help") === true
        ? "Knowledge: read the algorithm and decomposition meanings, cover them and explain each to a partner. Use the symbol key to name each shape and arrow in Main Task 1."
        : "Knowledge: compare my explanations with the model meanings, then explain how the badge can be split into parts. Check the symbol key before drawing.",
      !s ? "Skills: not checked yet." : getResponse("ksu_s_help") === true || getResponse("ksu_s_ready") !== "yes"
        ? "Skills: use the When / display / on frame. Point to when, what and where in my sentence; ask a partner or teacher to check before I label my flowchart."
        : "Skills: apply when, what and where to my own flowchart labels. Ask someone to follow the arrows and instructions without guessing.",
      !u ? "Understanding: not checked yet." : getResponse("ksu_u_meaning") !== "response"
        ? "Understanding: trace Button A to DISPLAY initials with my finger. Explain the input, how the micro:bit follows its instructions, and the output to my teacher or partner."
        : "Understanding: explain why each arrow in my own flowchart leads to the next instruction, and how the input produces the output.",
    ];
  }

  function renderKsu() {
    const step = state.typesStep;
    $$('[data-ksu-card]').forEach((card) => { card.hidden = Number(card.dataset.ksuCard) !== step; });
    $("#ksuStepCounter").textContent = step < 3 ? `${step + 1} of 3 · ${KSU_STEPS[step]}` : "My next steps";
    const kHelp = getResponse("ksu_k_confidence") === "no" || getResponse("ksu_k_help") === true;
    $("#ksuKnowledgeExplain").hidden = getResponse("ksu_k_confidence") !== "yes";
    $("#ksuKnowledgeGuide").hidden = !kHelp;
    $("#ksuSkillsGuide").hidden = getResponse("ksu_s_help") !== true;
    $("#ksuSkillReflection").hidden = step !== 1 || !ksuChecked(1);
    $$('[data-track="ksu_s_ready"]').forEach((input) => { input.checked = input.value === getResponse("ksu_s_ready"); });
    const checked = step < 3 ? ksuChecked(step) : null;
    $("#ksuUnderstandingGuide").hidden = getResponse("ksu_u_meaning") !== "help" && !(ksuChecked(2) && getResponse("ksu_u_meaning") !== "response");
    $("#typesFeedback").hidden = !checked;
    if (checked) showFeedback("typesFeedback", step === 2 && !checked.correct ? "warning" : "info", checked.title, checked.messages);
    $("#completeTypes").textContent = step === 3 ? "Use my plan in Main Task 1" : checked ? (step === 2 ? "See my practice plan" : `Continue: ${KSU_STEPS[step + 1]}`) : `Check ${KSU_STEPS[step]}`;
    if (step === 3) $("#ksuPracticePlan").innerHTML = ksuPlan().map((line) => `<p class="ksu-plan-item">${escapeHtml(line)}</p>`).join("");
    $$('[data-ksu-reminder]').forEach((details) => {
      details.hidden = !state.checks.ksu?.attempts?.length;
      $("div", details).innerHTML = ksuPlan().map((line) => `<p>${escapeHtml(line)}</p>`).join("");
    });
    const help = KSU_LANGUAGE[state.supportLanguage]?.[step];
    $("#ksuLanguageHelp").hidden = !help;
    $("#ksuLanguageHelp div").textContent = help || "";
    $("#ksuLanguageHelp div").lang = state.supportLanguage || "en";
  }

  function completeTypes() {
    const step = state.typesStep;
    if (step === 3) {
      const missing = [0, 1, 2].find((index) => !ksuChecked(index));
      if (missing !== undefined && !state.teacherMode) { state.typesStep = missing; renderKsu(); scheduleSave(); return; }
      setResponse("ksu_plan", ksuPlan().join("\n"));
      markComplete("types"); goTo("main1"); return;
    }
    if (ksuChecked(step) || state.teacherMode) {
      if (step === 1 && !getResponse("ksu_s_ready") && !state.teacherMode) return showFeedback("typesFeedback", "warning", "Make your self-check", ["Does your sentence include when, what and where? Choose Yes or Not yet. Either choice lets you continue."]);
      if (step === 1 && getResponse("ksu_s_ready")) {
        state.checks.ksu ||= { attempts: [] };
        state.checks.ksu.attempts ||= [];
        state.checks.ksu.attempts.push({ step: "Skills self-check", checkedAt: new Date().toISOString(), responses: { ksu_s_instruction: getResponse("ksu_s_instruction"), ksu_s_ready: getResponse("ksu_s_ready") } });
      }
      state.typesStep += 1;
      if (state.typesStep === 3) setResponse("ksu_plan", ksuPlan().join("\n"));
      renderKsu(); scheduleSave(); $("#lessonContent").focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: "smooth" }); return;
    }
    const feedback = { title: "Your evidence is saved", messages: [] };
    if (step === 0) {
      const confidence = getResponse("ksu_k_confidence");
      const support = confidence === "no" || getResponse("ksu_k_help") === true;
      if (!confidence) return showFeedback("typesFeedback", "warning", "Can you explain the two words?", ["Choose Yes to try explaining them, or Not yet to open the guide."]);
      if (support && getResponse("ksu_k_read") !== true) return showFeedback("typesFeedback", "warning", "Use the short guide", ["Read the meanings, cover them and try recalling one. Tick the confirmation when you have tried; it does not have to be perfect."]);
      if (!support && (!String(getResponse("ksu_k_algorithm")).trim() || !String(getResponse("ksu_k_decomposition")).trim())) return showFeedback("typesFeedback", "warning", "Try both meanings, or ask for help", ["Write a short explanation in each box. If you are stuck, tick “I need help” to read the guide instead."]);
      feedback.title = support ? "Knowledge practice identified" : "Compare your explanations — teacher review follows";
      feedback.messages = support ? ["Your plan will include recalling the two meanings and using the flowchart symbol key. You can continue after this attempt."] : ["Algorithm: precise, ordered instructions for solving a problem. Decomposition: splitting a larger problem into smaller parts.", "Compare these with your explanations. Add any missing idea if you can. Your writing has been saved, not automatically graded."];
    } else if (step === 1) {
      if (!String(getResponse("ksu_s_instruction")).trim() && getResponse("ksu_s_help") !== true) return showFeedback("typesFeedback", "warning", "Try one sentence, or request a prompt", ["Name the event, the exact display and where it appears. Tick the help option if you do not know how to begin."]);
      feedback.title = "Check your sentence against the brief";
      feedback.messages = ["WHEN: Button A is pressed. WHAT: your initials (not “something”). WHERE: the LED matrix.", "Point to each detail in your sentence. In the self-check below, choose Yes if all three are there, or Not yet if you need practice. The app has not graded your wording."];
    } else {
      const answer = getResponse("ksu_u_meaning");
      if (!answer) return showFeedback("typesFeedback", "warning", "Try reading the arrow", ["Choose an interpretation, or select “I cannot follow it yet” for help."]);
      feedback.correct = answer === "response";
      feedback.title = feedback.correct ? "That interpretation matches the flowchart" : "Understanding practice identified — you can continue";
      feedback.messages = ["Button A provides the input. The micro:bit follows its stored instructions, and the LED matrix shows initials as the output. The arrow tells you which step follows the input.", feedback.correct ? "Apply this reasoning to the arrows in your own flowchart." : "Use the guided explanation on this card. Trace that arrow again; this will become a next step in your practice plan."];
    }
    const record = { ...feedback, snapshot: ksuSnapshot(step), checkedAt: new Date().toISOString() };
    state.checks.ksu ||= { attempts: [] };
    state.checks.ksu[KSU_STEPS[step]] = record;
    state.checks.ksu.attempts ||= [];
    state.checks.ksu.attempts.push({ step: KSU_STEPS[step], checkedAt: record.checkedAt, responses: Object.fromEntries(KSU_FIELDS[step].map((key) => [key, getResponse(key)])) });
    renderKsu(); scheduleSave();
  }

  function main1Fields(index) { return [...MAIN1_CARDS[index].questions.map((question) => question.key), `m1_help_${index}`]; }
  function main1Snapshot(index) { return JSON.stringify(main1Fields(index).map(getResponse)); }
  function main1Checked(index) {
    const record = state.checks.main1Practice?.records?.[index];
    return record?.snapshot === main1Snapshot(index) ? record : null;
  }

  function renderMain1() {
    const card = MAIN1_CARDS[state.main1Card];
    if (!card) {
      $("#main1Study").textContent = "The practice cards could not load. Refresh the page with all app files available, or ask your teacher for the paper task. Your saved work has not been deleted.";
      $("#checkMain1").disabled = true;
      return;
    }
    $("#main1Part").textContent = card.part;
    $("#main1Heading").textContent = card.title;
    $("#main1Time").textContent = card.minutes;
    $("#main1Counter").textContent = `Card ${state.main1Card + 1} of ${MAIN1_CARDS.length} · ${state.main1View === "study" ? "Read and see" : "Try and improve"}`;
    $("#main1Study").hidden = state.main1View !== "study";
    $("#main1Practice").hidden = state.main1View !== "practice";
    $$('[data-m1-view]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.m1View === state.main1View)));
    $("#main1Study").innerHTML = `<p class="m1-reading">${escapeHtml(card.reading)}</p><div class="m1-example">${card.example}</div>`;
    $("#main1Practice").innerHTML = `<p class="field-help">Try these ${card.questions.length} questions, then check this card once. You can reopen the example at any time. Wrong answers will not block you.</p>${card.questions.map((question, index) => {
      const shortOptions = question.options?.every(([, label]) => label.length < 28);
      const control = question.type === "choice" ? shortOptions
        ? `<select id="field_${question.key}" data-track="${question.key}" aria-labelledby="prompt_${question.key}"><option value="">Choose an answer…</option>${question.options.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("")}</select>`
        : `<div role="radiogroup" aria-labelledby="prompt_${question.key}">${question.options.map(([value, label]) => `<label class="choice"><input type="radio" name="${question.key}" data-track="${question.key}" value="${escapeHtml(value)}">${escapeHtml(label)}</label>`).join("")}</div>`
        : question.short ? `<input id="field_${question.key}" data-track="${question.key}" maxlength="100" aria-labelledby="prompt_${question.key}" placeholder="${escapeHtml(question.frame)}">` : `<p class="field-help">Sentence starter: ${escapeHtml(question.frame)}</p><textarea id="field_${question.key}" data-track="${question.key}" rows="2" maxlength="500" aria-labelledby="prompt_${question.key}" placeholder="${escapeHtml(question.frame)}"></textarea>`;
      return `<div class="m1-question"><p id="prompt_${question.key}"><strong>${index + 1}. ${escapeHtml(question.prompt)}</strong></p>${control}<div id="feedback_${question.key}" class="feedback" hidden></div></div>`;
    }).join("")}<label class="choice"><input type="checkbox" data-track="m1_help_${state.main1Card}"> I am stuck on part of this card and need guided help.</label><p class="field-help">If you cannot answer a question yet, request help and check the card to read its explanation. Your teacher will see which answers need support.</p>${card.stretch || ""}`;
    const help = window.Main1Practice?.language?.[state.supportLanguage]?.[state.main1Card];
    $("#main1Language").hidden = !help;
    $("#main1Language div").textContent = help || "";
    $("#main1Language div").lang = state.supportLanguage || "en";
    hydrateInputs();
    installImageFallbacks($("#main1Study"));
    refreshMain1Feedback();
  }

  function refreshMain1Feedback() {
    const card = MAIN1_CARDS[state.main1Card];
    if (!card) return;
    const record = main1Checked(state.main1Card);
    $("#main1Feedback").hidden = true;
    card.questions.forEach((question) => {
      const box = document.getElementById(`feedback_${question.key}`);
      if (!box) return;
      box.hidden = !record;
      if (!record) return;
      const value = String(getResponse(question.key)).trim();
      const correct = question.type === "choice" && value === question.correct;
      showFeedback(box.id, correct ? "success" : question.type === "writing" && value ? "info" : "warning", !value ? "Help requested — read and try again if you can" : question.type === "writing" ? "Saved for teacher review" : correct ? "Correct" : "Review this idea — you may continue", [question.feedback]);
    });
    $("#checkMain1").textContent = state.main1View === "study" ? "Try the questions" : record ? (state.main1Card === MAIN1_CARDS.length - 1 ? "Finish Main Task 1: create my flowchart" : `Continue to card ${state.main1Card + 2}`) : "Check this card";
  }

  function checkMain1() {
    const index = state.main1Card;
    const card = MAIN1_CARDS[index];
    if (!card) return;
    if (state.main1View === "study") { state.main1View = "practice"; renderMain1(); scheduleSave(); return; }
    if (main1Checked(index) || state.teacherMode) {
      if (index < MAIN1_CARDS.length - 1) { state.main1Card += 1; state.main1View = "study"; renderMain1(); scheduleSave(); }
      else {
        const missing = MAIN1_CARDS.findIndex((_, position) => !main1Checked(position));
        if (missing >= 0 && !state.teacherMode) { state.main1Card = missing; renderMain1(); scheduleSave(); return; }
        markComplete("main1");
        $('[data-next="main2"]', $('[data-section="main1"]')).hidden = false;
        goTo("main2");
      }
      $("#lessonContent").focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: "smooth" }); return;
    }
    const missing = card.questions.filter((question) => question.type === "choice" ? !question.options.some(([value]) => value === getResponse(question.key)) : !String(getResponse(question.key)).trim());
    if (missing.length && getResponse(`m1_help_${index}`) !== true) return showFeedback("main1Feedback", "warning", "Try the remaining questions, or ask for guided help", [`Still to attempt: ${missing.map((question) => card.questions.indexOf(question) + 1).join(", ")}. Short explanations are enough. There is no minimum score or required keyword.`]);
    state.checks.main1Practice ||= { records: {}, attempts: [] };
    state.checks.main1Practice.records ||= {};
    state.checks.main1Practice.attempts ||= [];
    const record = { card: index, checkedAt: new Date().toISOString(), snapshot: main1Snapshot(index), responses: Object.fromEntries(main1Fields(index).map((key) => [key, getResponse(key)])) };
    state.checks.main1Practice.records[index] = record;
    state.checks.main1Practice.attempts.push(record);
    refreshMain1Feedback(); scheduleSave();
    document.getElementById(`feedback_${card.questions[0].key}`)?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }

  async function processEvidenceFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      return showFeedback("main2Feedback", "error", "That is not an image", ["Choose or paste a PNG, JPEG or other browser-supported image."]);
    }
    try {
      const compressed = await compressImage(file, 1400, .78);
      state.evidence = { dataUrl: compressed, name: file.name || "pasted-flowchart.png", type: compressed.slice(5, compressed.indexOf(";")), savedAt: new Date().toISOString() };
      scheduleSave();
      renderEvidence();
      showFeedback("main2Feedback", "success", "Evidence added", ["Check that the photograph is clear enough for your teacher to read."]);
    } catch {
      showFeedback("main2Feedback", "error", "The image could not be prepared", ["Try a smaller screenshot or photograph."]);
    }
  }

  function compressImage(file, maxDimension, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderEvidence() {
    const preview = $("#evidencePreview");
    const remove = $("#removeEvidence");
    if (!state.evidence?.dataUrl) {
      preview.hidden = true;
      preview.innerHTML = "";
      remove.hidden = true;
      return;
    }
    preview.hidden = false;
    preview.innerHTML = `<img src="${state.evidence.dataUrl}" alt="Uploaded Smart Badge flowchart evidence"><p>${escapeHtml(state.evidence.name)}</p>`;
    remove.hidden = false;
  }

  function renderPaperCard() {
    $$('[data-paper-card]').forEach((card) => { card.hidden = card.dataset.paperCard !== state.paperView; });
    $$('.paper-card-nav [data-paper-view]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.paperView === state.paperView)));
    $('#completeMain2').hidden = state.paperView !== 'explain';
  }

  function completeMain2() {
    const explanation = String(getResponse("flowchart_explanation")).trim();
    const alternative = getResponse("evidence_teacher_checked") === true;
    const pending = getResponse("evidence_teacher_pending") === true;
    if (!state.teacherMode && !state.evidence && !alternative && !pending) {
      return showFeedback("main2Feedback", "warning", "Tell us where your paper is", ["Choose ‘My teacher has checked my paper’ or ‘My paper is ready, but I am waiting’. A photograph is optional."]);
    }
    if (!state.teacherMode && !explanation) {
      return showFeedback("main2Feedback", "warning", "Add your explanation", ["Start with: First, my badge displays ___. It waits until ___. Then ___. You may use your own language if you need support. Your teacher will review the explanation; there is no exact wording to pass."]);
    }
    markComplete("main2");
    showFeedback("main2Feedback", "success", "Your work is saved", [pending ? "Teacher review pending. Keep your A4 paper ready; you can continue now." : alternative ? "Your explanation and teacher-check record are saved. No photograph is required." : "Your explanation and optional image are saved for teacher review.", "This records your work, not an automatically awarded mark. Choose the extension if you have time, or continue to the Learning Pitstop."]);
    $("#main2Routes").hidden = false;
  }

  function saveExtensionLevel(level) {
    const key = `extension_${level}`;
    const response = String(getResponse(key)).trim();
    if (!response && !state.teacherMode) return showFeedback("extensionFeedback", "warning", "Use the sentence starter", ["Add your own idea or a brief note about where you need help. You may write in your own language. There is no exact wording to pass; you can also leave the optional extension at any time."]);
    state.extensionLevel = Math.max(state.extensionLevel, level + 1);
    state.extensionCard = Math.min(3, level + 1);
    if ([1, 2, 3].every((n) => String(getResponse(`extension_${n}`)).trim()) || state.teacherMode) markComplete("extension");
    renderExtensionLevels();
    scheduleSave();
    showFeedback("extensionFeedback", "success", `Level ${level} saved for teacher review`, [level < 3 ? `Continue with Level ${level + 1} below, or move to the Learning Pitstop if time is up.` : "Your explanation is saved. Revisit any unfinished card if you have time; the Learning Pitstop is always available."]);
    $('.extension-card-nav').scrollIntoView?.({ block: 'start' });
    const heading = $('.level-card:not([hidden]) h3');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }

  function renderExtensionLevels() {
    $$(".level-card").forEach((card) => { card.hidden = Number(card.dataset.level) !== state.extensionCard; });
    $$('[data-extension-card]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.extensionCard) === state.extensionCard)));
  }

  function renderPitstopAdvice() {
    const selected = getResponse("pitstop_stage");
    const box = $("#pitstopAdvice");
    if (!selected || !PITSTOP_ADVICE[selected]) { box.hidden = true; return; }
    const [title, advice] = PITSTOP_ADVICE[selected];
    box.hidden = false;
    box.innerHTML = `<strong>${escapeHtml(title)} — recommended next step</strong><p>${escapeHtml(advice)}</p>`;
  }

  function buildPitstopQuestions() {
    [0,1,2].forEach(card => {
      $(`#pitQuestions${card}`).innerHTML = PIT_QUESTIONS.filter(q=>q.card===card).map(q=>`<label class="pit-question"><span>${escapeHtml(q.prompt)}</span><select data-track="${q.key}"><option value="">Choose an answer…</option>${q.options.map(([v,t])=>`<option value="${v}">${escapeHtml(t)}</option>`).join('')}</select><div id="${q.key}_feedback" class="pit-question-feedback" hidden></div></label>`).join('');
    });
  }

  function pitKeys(card) {
    return [...PIT_QUESTIONS.filter(q=>q.card===card).map(q=>q.key), ...(card===1 ? ['pit_instruction'] : [])];
  }

  function pitChecked(card) {
    const saved = state.checks.pitstop?.cards?.[card];
    return !!saved && pitKeys(card).every(key => saved.responses[key] === getResponse(key));
  }

  function pitEvidence() {
    const checked = PIT_QUESTIONS.filter(q=>pitChecked(q.card));
    return { correct: checked.filter(q=>getResponse(q.key)===q.answer).length, checked: checked.length, ready: PIT_READY.filter(key=>getResponse(key)===true).length,
      groups: [0,1,2].map(card=>({name:['Knowledge','Skills','Understanding'][card],correct:checked.filter(q=>q.card===card && getResponse(q.key)===q.answer).length,total:PIT_QUESTIONS.filter(q=>q.card===card).length,current:pitChecked(card)})) };
  }

  function pitSuggestion() {
    const difficulty = getResponse('pit_difficulty'), familiarity = getResponse('pit_familiarity');
    const e = pitEvidence();
    if (!difficulty || !familiarity) return null;
    if (difficulty==='hard') return ['drowning','You said the work feels too hard and you are stuck. Ask for one small piece of help now, whatever your score.'];
    if (difficulty==='easy' && e.checked===6 && e.correct===6 && e.ready===3) return ['treading','You reported no stretch, checked all three confidence statements and answered all six checks correctly. Try an unfamiliar adaptation, then explain why it works.'];
    if (familiarity==='new') return ['new','You said much of this was new. Working through an unfamiliar idea with support can be a good struggle; it does not require getting every check right.'];
    return ['consolidating',difficulty==='easy' && (e.correct<6 || e.ready<3) ? 'It felt easy, but your checks or confidence statements still show something to revisit. Explain that difference with your teacher before choosing a harder task.' : 'You are practising or becoming more confident with ideas you have met before. Explain what you can do now that you could not do as well earlier.'];
  }

  function pitReportKeys() { return [...PIT_REPORT_KEYS, ...(getResponse('pitstop_action') ? ['pitstop_action'] : [])]; }

  function pitReportLines() {
    const e = pitEvidence();
    return [`Current checked answers: ${e.correct}/6 correct; ${e.checked}/6 checked and current. Self-reported confidence: ${e.ready}/3. These are separate measures, not a grade.`,
      ...e.groups.map(g=>`${g.name} recognition checks: ${g.current ? g.correct+'/'+g.total : 'Not checked / answers changed'}.`),
      ...(state.checks.pitstop?.attempts || []).flatMap((a,i)=>[`Check ${i+1}: ${['Knowledge','Skills','Understanding'][a.card]} | ${a.correct}/${a.total} | ${a.at} | support ${a.language}`, ...Object.entries(a.responses).map(([k,v])=>`${RESPONSE_LABELS[k] || k}: ${PIT_QUESTIONS.find(q=>q.key===k)?.options.find(([id])=>id===v)?.[1] || v || 'Not answered'}`)])];
  }

  function renderPitstop() {
    [0,1,2].forEach(card=>{ if (!pitChecked(card)) $(`#pitCheck${card}`).hidden=true; });
    $$('[data-pit-panel]').forEach(panel=>{ panel.hidden=Number(panel.dataset.pitPanel)!==state.pitCard; });
    $$('[data-pit-card]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pitCard)===state.pitCard)));
    $('#completePitstop').hidden=state.pitCard!==4;
    PIT_QUESTIONS.forEach(q=>{
      const feedback=$(`#${q.key}_feedback`);
      feedback.hidden=!pitChecked(q.card);
      feedback.textContent=pitChecked(q.card) ? `${getResponse(q.key)===q.answer ? 'Correct. ' : 'Review this idea. '}${q.feedback}` : '';
    });
    const e=pitEvidence();
    $('#pitEvidenceSummary').innerHTML=`<h4>Your evidence, not a grade</h4><p><strong>${e.correct}/6 checked answers correct</strong> · ${e.checked}/6 checked and current</p><p><strong>${e.ready}/3 confidence statements ticked</strong> by you. Unticked means “not confident yet”, not “failed”.</p><p>Written explanations and your paper need teacher review. Using help is allowed. Six recognition questions cannot prove full understanding.</p>`;
    $('#pitEvidenceSummary').innerHTML += `<div class="pit-score-grid">${e.groups.map(g=>`<p><strong>${g.name}</strong><br>${g.current ? g.correct+'/'+g.total+' correct' : 'Check or recheck this card'}</p>`).join('')}</div>`;
    const suggestion=pitSuggestion();
    state.responses.pit_suggested=suggestion ? PITSTOP_ADVICE[suggestion[0]][0] : '';
    $('#pitSuggestion').innerHTML=suggestion ? `<strong>Suggested stage: ${escapeHtml(PITSTOP_ADVICE[suggestion[0]][0])}</strong><p>${escapeHtml(suggestion[1])}</p><p>This is a discussion prompt, not a diagnosis. Choose a different stage below if it fits better and explain why.</p>` : '<p>Choose the challenge level and what changed since the start to see a suggestion.</p>';
    renderPitstopAdvice();
    const selected=getResponse('pitstop_stage');
    $('#pitPlanAdvice').textContent=selected && PITSTOP_ADVICE[selected] ? `${PITSTOP_ADVICE[selected][0]}: ${PITSTOP_ADVICE[selected][1]} Make that action specific in your sentences below.` : 'Use the check feedback to identify one detail you want to practise.';
    const translations={
      zh:[
        '知识：先尝试回忆，再检查。Algorithm 是准确、有顺序的指令；sequence 是顺序；decomposition 是把大问题分成可处理的小部分。如果不确定，选择 Not sure yet。勾选框表示你自己的信心，不是分数。',
        '技能：把“显示好看的东西”改成准确指令。想清楚什么时候（when）、显示什么（what）、在哪里（where）。句式：当按钮 A 被按下时，在 LED 显示屏上显示我的姓名首字母___。如果需要帮助，可以说明难在哪里。老师会评阅你的句子。',
        '理解：跟着箭头读流程图。第 1 步等待按钮 A；第 2 步把 HELLO 和 JT 组合成问候语；第 3 步显示问候语。选择哪一步是输入、处理、输出。注意：两个平行四边形用途可能不同，要读里面的动作。',
        '反思：正确数和信心勾选数不是同一回事。选择难度（太容易／适中／有挑战但在进步／太难需要帮助），再说明这些内容是新的、进步了还是早已会了。系统只提供建议，你可以不同意。句式：我在___时感到___。以前我___，现在我能___，所以我选择这个阶段。',
        '下一步：每项写一个短句，不要只选策略。知识：我会遮住___，凭记忆解释___，再核对___。技能：我会用“什么时候、什么、哪里”改写___，请___检查。理解：我会沿箭头读___，通过动作区分输入、处理和输出。可以用中文写；目标是有帮助的进步，不是一直感到困难。'
      ],
      ko:[
        '지식: 먼저 기억해 보고 확인하세요. 알고리즘은 정확하고 순서가 있는 지시, sequence는 순서, decomposition은 큰 문제를 작은 부분으로 나누는 것입니다. 모르겠으면 Not sure yet를 선택하세요. 체크 표시는 점수가 아니라 자신의 자신감입니다.',
        '기능: “멋진 것을 보여 줘”를 정확하게 바꿔 보세요. 언제(when), 무엇을(what), 어디에(where) 표시하는지 생각하세요. 문장 틀: 버튼 A를 누르면 LED 화면에 제 이름 이니셜 ___을/를 표시합니다. 도움이 필요한 부분을 써도 됩니다. 직접 쓴 문장은 선생님이 검토합니다.',
        '이해: 화살표를 따라 읽으세요. 1단계는 버튼 A를 기다리고, 2단계는 HELLO와 JT를 합쳐 인사말을 만들고, 3단계는 인사말을 표시합니다. 입력, 처리, 출력에 해당하는 단계를 고르세요. 입력과 출력은 같은 모양을 쓸 수 있으므로 안의 동작을 읽어야 합니다.',
        '성찰: 정답 수와 자신감 체크 수는 다릅니다. 난이도(너무 쉬움/적당한 연습/도전적이지만 발전함/너무 어려워 도움 필요)와 수업 전후의 변화를 고르세요. 앱의 제안에 동의하지 않아도 됩니다. 문장 틀: ___할 때 ___을/를 느꼈습니다. 전에는 ___했지만 지금은 ___할 수 있어서 이 단계를 골랐습니다.',
        '계획: 각 영역에 짧은 문장을 하나씩 쓰세요. 지식: ___을/를 가리고 기억으로 ___을/를 설명한 뒤 확인하겠습니다. 기능: 언제/무엇/어디를 넣어 ___을/를 고치고 ___에게 확인받겠습니다. 이해: 화살표를 따라 동작을 읽으며 입력/처리/출력을 구별하겠습니다. 한국어로 써도 됩니다. 목표는 계속 힘들어하는 것이 아니라 도움을 받아 발전하는 것입니다.'
      ],
      ms:[
        'Pengetahuan: cuba ingat dahulu, kemudian semak. Algoritma ialah arahan tepat yang tersusun; sequence ialah urutan; decomposition memecahkan masalah kepada bahagian kecil. Pilih Not sure yet jika perlu. Tanda semak menunjukkan keyakinan sendiri, bukan markah.',
        'Kemahiran: jadikan “paparkan sesuatu yang cantik” lebih tepat. Nyatakan bila (when), apa (what) dan di mana (where). Rangka: Apabila Butang A ditekan, paparkan huruf awal nama saya ___ pada matriks LED. Kamu boleh menulis bahagian yang memerlukan bantuan. Guru menyemak ayat sendiri.',
        'Pemahaman: ikut anak panah. Langkah 1 menunggu Butang A; langkah 2 menggabungkan HELLO dan JT untuk membina ucapan; langkah 3 memaparkan ucapan. Kenal pasti input, proses dan output. Input dan output boleh menggunakan bentuk yang sama; baca tindakannya.',
        'Refleksi: bilangan jawapan betul berbeza daripada tanda keyakinan. Pilih tahap cabaran dan perubahan sejak awal pelajaran. Cadangan aplikasi boleh ditolak jika tidak sesuai. Rangka: Saya berasa ___ apabila ___. Dahulu saya ___; sekarang saya boleh ___. Oleh itu saya memilih tahap ini.',
        'Pelan: tulis satu ayat pendek bagi setiap bidang. Pengetahuan: saya akan tutup ___, terangkan ___ dari ingatan, kemudian semak ___. Kemahiran: saya akan baiki ___ menggunakan bila/apa/di mana dan minta ___ menyemaknya. Pemahaman: saya akan ikut anak panah dan baca tindakan untuk membezakan input, proses dan output. Kamu boleh menulis dalam bahasa sendiri. Matlamatnya kemajuan yang berguna, bukan sentiasa berasa susah.'
      ]
    };
    const language=state.supportLanguage || 'en', support=translations[language]?.[state.pitCard];
    $('#pitLanguageSupport').hidden=!support;
    $('#pitLanguageSupport').textContent=support || '';
    $('#pitLanguageSupport').lang=language==='zh'?'zh-Hans':language;
  }

  function checkPitstop(card) {
    const questions=PIT_QUESTIONS.filter(q=>q.card===card);
    if (!state.teacherMode && questions.some(q=>!getResponse(q.key))) {
      return showFeedback(`pitCheck${card}`,'warning','Choose an answer or “Not sure yet”',['An unsure answer opens help and lets you continue. You do not need a correct answer to move on.']);
    }
    if (card===1 && !state.teacherMode && !String(getResponse('pit_instruction')).trim()) return showFeedback('pitCheck1','warning','Try the sentence frame or say where you need help',['When ___, display ___ on ___. Your own language is welcome; there is no keyword test.']);
    const snapshot={card,at:new Date().toISOString(),language:state.supportLanguage,correct:questions.filter(q=>getResponse(q.key)===q.answer).length,total:questions.length,responses:Object.fromEntries(pitKeys(card).map(key=>[key,getResponse(key)]))};
    state.checks.pitstop ||= {cards:{},attempts:[]};
    state.checks.pitstop.cards ||= {}; state.checks.pitstop.attempts ||= [];
    state.checks.pitstop.cards[card]=snapshot; state.checks.pitstop.attempts.push(snapshot);
    renderPitstop(); scheduleSave();
    showFeedback(`pitCheck${card}`,'success','Check saved — read the feedback beside each question',[`${snapshot.correct}/${snapshot.total} recognition answers correct. ${card===1 ? 'Your own sentence still needs teacher review. ' : ''}You may improve your answers or continue. Confidence boxes are your own judgement.`]);
  }

  function movePitstop(card) {
    state.pitCard=Math.max(0,Math.min(4,card)); renderPitstop(); scheduleSave();
    $('#pitstopFeedback').hidden=true;
    $('.pit-card-nav').scrollIntoView?.({block:'start'});
    const heading=$(`[data-pit-panel="${state.pitCard}"] h3`); heading.tabIndex=-1; heading.focus({preventScroll:true});
  }

  function completePitstop() {
    if (!state.teacherMode) {
      const unchecked=[0,1,2].find(card=>!pitChecked(card));
      if (unchecked!==undefined) { movePitstop(unchecked); return showFeedback('pitstopFeedback','warning','Check this card before finishing',['Choose “Not sure yet” for help. Wrong answers and unticked confidence boxes do not block progress.']); }
      const reflection=['pit_difficulty','pit_familiarity','pitstop_stage','pit_reason'];
      if (reflection.some(key=>!String(getResponse(key)).trim())) { movePitstop(3); return showFeedback('pitstopFeedback','warning','Tell us how the learning felt',['Choose the challenge, what changed, your stage, and add one short reason using an example from your work.']); }
      if (['pit_plan_k','pit_plan_s','pit_plan_u'].some(key=>!String(getResponse(key)).trim())) return showFeedback('pitstopFeedback','warning','Make your next practice specific',['Add a short sentence for Knowledge, Skills and Understanding. You may write the help you need, in your own language.']);
    }
    markComplete("pitstop");
    goTo("plenary");
  }

  function completePlenary() {
    const required = ["plenary_decomposition", "plenary_input", "plenary_flowchart", "plenary_readiness"];
    const missing = required.filter((key) => !String(getResponse(key)).trim());
    if (missing.length) return showFeedback("plenaryFeedback", "warning", "Complete the four short responses", ["Use the sentence starters. Your teacher will review the two explanations."]);
    const correct = getResponse("plenary_decomposition") === "split";
    const inputText = String(getResponse("plenary_input")).toLowerCase();
    const mentionsEvent = /press|button|signal|event|system|micro:bit|program/.test(inputText);
    const messages = [
      correct ? "Correct: decomposition breaks a larger problem into manageable parts." : "Review: decomposition means breaking a larger problem into manageable parts.",
      mentionsEvent ? "Your Button A explanation identifies how an event enters the system." : "Before submitting, consider adding that pressing Button A sends an event or signal into the micro:bit.",
      "Your flowchart explanation and readiness choice are saved for your teacher.",
    ];
    state.checks.plenary = { decompositionCorrect: correct, inputExplanationSupported: mentionsEvent };
    markComplete("plenary");
    showFeedback("plenaryFeedback", correct ? "success" : "warning", "Plenary complete", messages);
    $('[data-next="review"]', $('[data-section="plenary"]')).hidden = false;
  }

  function formatResponse(key) {
    if (key === 'finish_answer') return FINISHERS[state.finisherId]?.options[getResponse(key)] || 'Not answered';
    if (key === "ksu_plan") return ksuPlan().join("\n");
    const value = getResponse(key);
    const pitQuestion=PIT_QUESTIONS.find(q=>q.key===key);
    if (pitQuestion) return pitQuestion.options.find(([v])=>v===value)?.[1] || 'Not answered';
    if (PIT_READY.includes(key)) return value===true ? 'Confident — student self-report' : 'Not confident yet / not ticked — student self-report';
    if (key.startsWith("ksu_")) return formatKsuValue(key, value);
    if (key.startsWith("m1_help_") && value === false) return "No";
    if (["evidence_teacher_checked", "evidence_teacher_pending"].includes(key) && value === false) return "No";
    const practiceQuestion = MAIN1_CARDS.flatMap((card) => card.questions).find((question) => question.key === key);
    if (practiceQuestion?.options) return practiceQuestion.options.find(([option]) => option === value)?.[1] || String(value || "Not completed");
    if (value === true) return "Yes";
    if (value === false || value === "") return "Not completed";
    const missionQuestion = MISSION_QUESTIONS.find((question) => question.key === key);
    if (missionQuestion) return missionQuestion.options.find(([option]) => option === value)?.[1] || String(value);
    const labels = {
      pit_difficulty: {easy:'Easy — no stretch',medium:'Medium — useful practice',challenge:'Challenging — making progress',hard:'Too hard — stuck and needs support'},
      pit_familiarity: {new:'Much of this was new',improving:'More confident than at the start',familiar:'Could already do this before today'},
      do_input: { start: "The badge starts", button: "Button A is pressed", initials: "Initials appear" },
      do_output: { button: "Button A", initials: "The student’s initials", code: "Stored instructions" },
      learning_type: { knowledge: "Knowledge", skills: "Skills", understanding: "Understanding" },
      symbol_start: { oval: "Oval", parallelogram: "Parallelogram", rectangle: "Rectangle" },
      symbol_output: { oval: "Oval", parallelogram: "Parallelogram", rectangle: "Rectangle" },
      pitstop_stage: { new: "New learning", consolidating: "Consolidating", treading: "Treading water", drowning: "Drowning" },
      plenary_decomposition: { remove: "Remove every difficult part", split: "Break a large problem into manageable parts", code: "Write code without planning" },
    };
    return labels[key]?.[value] || String(value);
  }

  function renderReview() {
    const groups = [
      ["Our mission — before Do Now", ["mission_read", "mission_purpose", "mission_trigger", "mission_outcome"]],
      ["Do Now", ["do_input", "do_output"]],
      ["Types of Learning — evidence and next steps", ksuReportKeys()],
      ["Main Task 1A / 1B — learning and practice", main1ReportKeys()],
      ["Main Task 2", ["flowchart_explanation", "flowchart_home_draft", "evidence_teacher_checked", "evidence_teacher_pending"]],
      ["Optional Extension", ["extension_1", "extension_2", "extension_3"]],
      ["Learning Pitstop", pitReportKeys()],
      ["Plenary", ["plenary_decomposition", "plenary_input", "plenary_flowchart", "plenary_readiness"]],
    ];
    const completedCount = CORE_IDS.filter((id) => state.completed[id]).length;
    let html = `<div class="review-header"><div><strong>${escapeHtml(state.student.name)}</strong><br>${escapeHtml(state.student.className)} · Year 8 Week 2 Theory</div><span class="status-pill ${completedCount === CORE_IDS.length ? "complete" : "incomplete"}">${completedCount}/${CORE_IDS.length} core stages complete</span></div>`;
    html += `<div class="review-group"><h3>Learning spine</h3><p>Smart Badge problem → decomposition → algorithm → flowchart</p><p><strong>WAGBA:</strong> We are getting better at decomposing a Smart Badge problem and representing its algorithm using a clear flowchart.</p><p><strong>Do Now sequence:</strong> ${state.sequence.map(escapeHtml).join(" → ")}</p></div>`;
    groups.forEach(([title, keys]) => {
      const attempted = keys.some((key) => String(getResponse(key)).trim() && getResponse(key) !== false);
      html += `<div class="review-group"><h3>${escapeHtml(title)} <span class="status-pill ${attempted ? "complete" : "incomplete"}">${attempted ? "Attempted" : "Not completed"}</span></h3>`;
      keys.forEach((key) => { html += `<div class="review-row"><strong>${escapeHtml(RESPONSE_LABELS[key] || key)}</strong><span>${escapeHtml(formatResponse(key))}</span></div>`; });
      if (keys.includes("mission_read")) {
        html += `<p><strong>Quiz results and checked attempts</strong></p><ul>${missionResultLines().map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
      }
      if (keys.includes("ksu_plan")) html += `<details open><summary>KSU checked attempts and revisions</summary><ul>${ksuAttemptLines().map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></details>`;
      if (keys.includes("m1_kind")) html += `<details><summary>Main Task 1 checks and revisions</summary><ul>${main1AttemptLines().map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></details>`;
      if (keys.includes('pit_reason')) html += `<details open><summary>Pitstop evidence and checked attempts</summary><ul>${pitReportLines().map(line=>`<li>${escapeHtml(line)}</li>`).join('')}</ul></details>`;
      html += `</div>`;
    });
    if (state.evidence?.dataUrl) html += `<div class="review-group"><h3>Main Task evidence</h3><img class="review-image" src="${state.evidence.dataUrl}" alt="Uploaded Smart Badge flowchart"></div>`;
    $("#reviewSummary").innerHTML = html;
    if (state.submission.requestedAt) $('#reviewSummary').insertAdjacentHTML('beforeend', `<div class="review-group"><h3>Submission record — student self-report</h3><p>PDF requested: ${escapeHtml(state.submission.requestedAt)}. ${state.submission.confirmedAt ? `Student confirmed Turn in at ${escapeHtml(state.submission.confirmedAt)}.` : 'Not yet confirmed.'} This app cannot verify Teams submission.</p></div>`);
    if (getResponse('finish_answer') !== '') $('#reviewSummary').insertAdjacentHTML('beforeend', `<div class="review-group"><h3>Optional final badge puzzle</h3><p>${escapeHtml(FINISHERS[state.finisherId]?.prompt || '')}</p><p>${escapeHtml(formatResponse('finish_answer'))}</p><p>${state.checks.finisher ? (state.checks.finisher.correct ? 'Last checked answer: correct.' : 'Last checked answer: feedback given.') : 'Not checked yet.'}</p></div>`);
  }

  function sanitizeFilename(value) { return String(value).replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "_"); }

  function main1ReportKeys() {
    return [...MAIN1_CARDS.flatMap((_, index) => main1Fields(index)), ...["m1_stretch_repair", "m1_stretch_access"].filter((key) => String(getResponse(key)).trim())];
  }

  function main1AttemptLines() {
    const attempts = state.checks.main1Practice?.attempts || [];
    if (!attempts.length) return ["No checks submitted for the expanded Main Task 1 yet. Earlier saved answers are retained above."];
    return attempts.flatMap((attempt, index) => [
      `Check ${index + 1}: card ${attempt.card + 1} (${attempt.checkedAt})${attempt.responses[`m1_help_${attempt.card}`] === true ? " — guided help requested" : ""}`,
      ...MAIN1_CARDS[attempt.card].questions.map((question, questionIndex) => {
        const value = attempt.responses[question.key];
        const answer = question.options?.find(([option]) => option === value)?.[1] || value || "No answer — help requested";
        const result = !value ? "Needs support" : question.type === "writing" ? "Teacher review" : value === question.correct ? "Correct" : "Feedback given";
        return `Q${questionIndex + 1}: ${answer} (${result})`;
      }),
    ]);
  }

  function formatKsuValue(key, value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    const labels = {
      ksu_k_confidence: { yes: "Yes — I will explain both words", no: "Not yet — I need to learn or recall the meanings" },
      ksu_s_ready: { yes: "Yes — all three details (student self-check, not an automatic grade)", notyet: "Not yet — precise instructions need practice" },
      ksu_u_meaning: { response: "Button A input leads to following the instructions and displaying initials as output", reverse: "Initials appear first and make Button A press itself", decoration: "The arrow is decoration; either event can happen first", help: "I cannot follow the flowchart yet — guided explanation requested" },
    };
    return labels[key]?.[value] || String(value || "Not completed");
  }

  function ksuReportKeys() {
    return [...KSU_REPORT_KEYS, ...["learning_type", "learning_strategy"].filter((key) => getResponse(key))];
  }

  function ksuAttemptLines() {
    const attempts = state.checks.ksu?.attempts || [];
    if (!attempts.length) return ["No KSU checks submitted yet."];
    return attempts.flatMap((attempt, index) => [
      `Attempt ${index + 1}: ${attempt.step} (${attempt.checkedAt})`,
      ...Object.entries(attempt.responses).map(([key, value]) => `${RESPONSE_LABELS[key] || key}: ${formatKsuValue(key, value)}`),
    ]);
  }

  async function exportPdf() {
    if (!window.PDFLib) {
      return showFeedback("exportFeedback", "error", "Direct PDF export is unavailable", ["Use Print / Save as PDF instead."]);
    }
    setSaveStatus("Creating PDF…");
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pageSize = [595.28, 841.89];
      const margin = 48;
      let page;
      let y;
      let pageNumber = 0;
      const textImages = [];

      const newPage = () => {
        page = pdf.addPage(pageSize);
        pageNumber += 1;
        y = pageSize[1] - margin;
        page.drawText("YEAR 8 · TERM 1 · WEEK 2 THEORY", { x: margin, y, size: 9, font: bold, color: rgb(.39, .22, .71) });
        page.drawText(`Page ${pageNumber}`, { x: pageSize[0] - margin - 40, y, size: 8, font: regular, color: rgb(.35, .35, .35) });
        y -= 24;
      };
      const pdfSafe = (text) => String(text ?? "")
        .replace(/→/g, "->")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[–—]/g, "-")
        .replace(/·/g, "|")
        .normalize("NFKD")
        .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
      const wrap = (text, font, size, width) => {
        const words = pdfSafe(text || "Not completed").replace(/\s+/g, " ").split(" ");
        const lines = [];
        let line = "";
        words.forEach((word) => {
          const candidate = line ? `${line} ${word}` : word;
          if (font.widthOfTextAtSize(candidate, size) <= width) line = candidate;
          else { if (line) lines.push(line); line = word; }
        });
        if (line) lines.push(line);
        return lines.length ? lines : [""];
      };
      const addText = (text, options = {}) => {
        const font = options.bold ? bold : regular;
        const size = options.size || 10;
        const lineHeight = options.lineHeight || size * 1.38;
        // Standard PDF fonts cannot encode Chinese/Korean. Render such paragraphs
        // locally at 3x resolution; keep original Unicode text in review and backup.
        if (/[^\x00-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2192]/u.test(String(text))) {
          const width = pageSize[0] - margin * 2;
          const height = Math.max(lineHeight, size * 1.65);
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(width * 3);
          canvas.height = Math.ceil(height * 3);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Use Print / Save as PDF to preserve your home-language writing.");
          ctx.font = `${options.bold ? "bold " : ""}${size * 3}px "Arial Unicode MS", "PingFang SC", "Apple SD Gothic Neo", "Malgun Gothic", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Sans CJK KR", Arial, sans-serif`;
          const lines = [];
          let current = "";
          for (const character of String(text)) {
            if (character === "\n") { lines.push(current); current = ""; continue; }
            if (current && ctx.measureText(current + character).width > canvas.width - 3) {
              lines.push(current); current = character;
            } else current += character;
          }
          if (current) lines.push(current);
          lines.forEach((line) => {
            if (y - height < margin + 25) newPage();
            ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#141414"; ctx.textBaseline = "top";
            ctx.fillText(line, 0, 1);
            const targetPage = page, targetY = y - height + size;
            textImages.push(pdf.embedPng(canvas.toDataURL("image/png")).then((image) => {
              targetPage.drawImage(image, { x: margin, y: targetY, width, height });
            }));
            y -= height;
          });
          y -= options.after ?? 4;
          return;
        }
        const lines = wrap(text, font, size, pageSize[0] - margin * 2);
        lines.forEach((line) => { if (y - lineHeight < margin + 25) newPage(); page.drawText(line, { x: margin, y, size, font, color: options.color || rgb(.08, .08, .08) }); y -= lineHeight; });
        y -= options.after ?? 4;
      };
      const addHeading = (text) => { if (y < 120) newPage(); y -= 4; addText(text, { bold: true, size: 14, after: 7 }); };
      const addResponse = (key) => { addText(`${RESPONSE_LABELS[key] || key}:`, { bold: true, size: 9, after: 1 }); addText(formatResponse(key), { size: 10, after: 7 }); };

      newPage();
      addText("Smart Badge Algorithm and Flowchart", { bold: true, size: 21, after: 8 });
      addText(`Student: ${state.student.name}     Class: ${state.student.className}`, { bold: true, size: 11 });
      addText(`Generated: ${new Date().toLocaleString()}     Completion: ${CORE_IDS.filter((id) => state.completed[id]).length}/${CORE_IDS.length} core stages`, { size: 9, color: rgb(.3, .3, .3), after: 10 });
      addText("WAGBA: We are getting better at decomposing a Smart Badge problem and representing its algorithm using a clear flowchart.", { bold: true, size: 10, after: 8 });
      addText("Learning spine: Smart Badge problem → decomposition → algorithm → flowchart", { size: 10, after: 12 });

      addHeading("Our mission — before Do Now");
      ["mission_read", "mission_purpose", "mission_trigger", "mission_outcome"].forEach(addResponse);
      addText("Quiz results and checked attempts", { bold: true, size: 10 });
      missionResultLines().forEach((line) => addText(line, { size: 9, after: 5 }));

      addHeading("Do Now");
      addText(`Sequence: ${state.sequence.join(" → ")}`);
      addResponse("do_input"); addResponse("do_output");
      addHeading("Types of Learning");
      ksuReportKeys().forEach(addResponse);
      addText("KSU checked attempts and revisions (written responses require teacher review)", { bold: true, size: 10 });
      ksuAttemptLines().forEach((line) => addText(line, { size: 9, after: 4 }));
      addHeading("Main Task 1A / 1B — learning and practice");
      main1ReportKeys().forEach(addResponse);
      addText("Checked attempts and revisions", { bold: true, size: 10 });
      main1AttemptLines().forEach((line) => addText(line, { size: 9, after: 4 }));
      addHeading("Main Task 2 — Smart Badge Blueprint");
      ["flowchart_explanation", "flowchart_home_draft", "evidence_teacher_checked", "evidence_teacher_pending"].forEach(addResponse);

      if (state.evidence?.dataUrl) {
        const bytes = Uint8Array.from(atob(state.evidence.dataUrl.split(",")[1]), (character) => character.charCodeAt(0));
        const embedded = await pdf.embedJpg(bytes);
        const availableWidth = pageSize[0] - margin * 2;
        const scale = Math.min(availableWidth / embedded.width, 360 / embedded.height, 1);
        const width = embedded.width * scale;
        const height = embedded.height * scale;
        if (y - height < margin + 25) newPage();
        page.drawImage(embedded, { x: margin, y: y - height, width, height });
        y -= height + 12;
      } else addText("Optional flowchart photograph: not supplied. Refer to the paper review status above; a photo is not required.", { after: 8 });

      addHeading("Optional Extension");
      ["extension_1", "extension_2", "extension_3"].forEach(addResponse);
      addHeading("Learning Pitstop");
      pitReportKeys().forEach(addResponse);
      pitReportLines().forEach(line=>addText(line,{size:9,after:4}));
      addHeading("Plenary");
      ["plenary_decomposition", "plenary_input", "plenary_flowchart", "plenary_readiness"].forEach(addResponse);
      addHeading("Submission reminder");
      addText("Upload this PDF to the Microsoft Teams Assignment named Week 2 Theory. Upload the PDF, not a screenshot.", { bold: true, size: 10 });
      if (getResponse('finish_answer') !== '') {
        addHeading('Optional final badge puzzle');
        addText(FINISHERS[state.finisherId]?.prompt || '');
        addResponse('finish_answer');
        addText(state.checks.finisher ? (state.checks.finisher.correct ? 'Last checked answer: correct.' : 'Last checked answer: feedback given.') : 'Not checked yet.');
      }

      await Promise.all(textImages);
      const bytes = await pdf.save();
      lastPdfBlob = new Blob([bytes], { type: 'application/pdf' });
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      pdfPreviewUrl = '';
      downloadBlob(lastPdfBlob, lessonPdfFilename());
      recordPdfRequest('download');
      setSaveStatus("Saved");
      showFeedback("exportFeedback", "success", "PDF prepared — check that it saved", ["Follow the pop-up guide to find your file and turn it in to Microsoft Teams: Week 2 Theory."]);
      openSubmissionGuide();
    } catch (error) {
      setSaveStatus("Saved");
      showFeedback("exportFeedback", "error", "PDF export was blocked", ["Use Print / Save as PDF instead.", error.message || "Unknown error"]);
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function lessonPdfFilename() { return `Year8_${sanitizeFilename(state.student.className)}_${sanitizeFilename(state.student.name)}_Week2_Theory.pdf`; }

  function recordPdfRequest(method) {
    const history=Array.isArray(state.submission.history)?state.submission.history:[];
    if (state.submission.confirmedAt) history.push({filename:state.submission.filename,requestedAt:state.submission.requestedAt,confirmedAt:state.submission.confirmedAt,verification:'Student self-report only'});
    state.submission={...state.submission,step:0,requestedAt:new Date().toISOString(),confirmedAt:null,filename:lessonPdfFilename(),reportComplete:CORE_IDS.every(id=>state.completed[id]),method,history};
    $('#teamsUploadConfirmed').checked=false;
    renderNavigation(); scheduleSave();
    if(state.currentSection==='finisher') goTo(isUnlocked('review')?'review':'mission');
  }

  function clearPdfSession() {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    pdfPreviewUrl = '';
    lastPdfBlob = null;
    $('#teamsUploadConfirmed').checked = false;
    if ($('#submissionDialog').open) closeSubmissionGuide();
  }

  function openSubmissionGuide() {
    if(!state) return;
    const dialog=$('#submissionDialog');
    if(!dialog.open) submissionReturnFocus=document.activeElement;
    renderSubmissionGuide();
    if(!dialog.open) {
      if(typeof dialog.showModal==='function') dialog.showModal();
      else {dialog.setAttribute('open',''); dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true'); $('#lessonApp').inert=true;}
    }
    $('#closeSubmission').focus();
  }

  function closeSubmissionGuide() {
    const dialog=$('#submissionDialog');
    if(typeof dialog.close==='function') dialog.close(); else dialog.removeAttribute('open');
    $('#lessonApp').inert=false;
    submissionReturnFocus?.focus?.({preventScroll:true});
  }

  function renderSubmissionGuide() {
    const sub=state.submission, step=sub.step;
    $('#submissionDialog').dataset.device=sub.device;
    $$('[data-sub-panel]').forEach(panel=>{panel.hidden=Number(panel.dataset.subPanel)!==step;});
    $$('[data-sub-route]').forEach(route=>{route.hidden=route.dataset.subRoute!==sub.device;});
    $$('[data-sub-device]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.subDevice===sub.device)));
    $$('[data-sub-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.subStep)===step)));
    $('#downloadPointer').hidden=sub.device!=='laptop' || step!==0;
    $('#submissionFile').textContent=`Your report filename: ${sub.filename || lessonPdfFilename()}`;
    $('#submissionClass').textContent=`your Computing class (${state.student.className})`;
    const incomplete=sub.reportComplete===false || (sub.reportComplete===undefined && CORE_IDS.some(id=>!state.completed[id]));
    $('#submissionReportWarning').hidden=!!sub.requestedAt && !incomplete;
    $('#submissionReportWarning').textContent=!sub.requestedAt ? 'No PDF has been generated in this saved session yet. Close this guide and download your report first.' : incomplete ? 'This is partial progress. Finish the required lesson stages before your final submission, unless your teacher asked for a progress report.' : '';
    $('#shareLessonPdf').disabled=!lastPdfBlob;
    const preview=$('#previewLessonPdf'); preview.hidden=!lastPdfBlob;
    if(lastPdfBlob) {if(!pdfPreviewUrl) pdfPreviewUrl=URL.createObjectURL(lastPdfBlob);preview.href=pdfPreviewUrl;}
    $('#sharePdfStatus').textContent=lastPdfBlob ? 'Use this button to open your device’s sharing options. Select Save to Files, not a Teams chat.' : 'The PDF is not held in memory after a refresh. Find your saved copy in Files, or close this guide and download a fresh report.';
    $('#confirmTeamsSubmission').disabled=!sub.requestedAt || !$('#teamsUploadConfirmed').checked;
    $('#submissionConfirmStatus').textContent=sub.confirmedAt ? 'You already confirmed a submission. This is your record, not verification from Teams.' : 'Only confirm after Teams shows that your assignment was submitted.';
    const lang={
      zh:['电脑：下载按钮通常在浏览器右上方，网页上方。iPad/iPhone：打开 PDF → 分享 → 存储到“文件” → 选择位置 → 存储。保留文件名，再到“文件”中打开检查。浏览器位置可能不同。','用学校账号打开 Teams，进入你的计算机班级 → Classwork（课堂作业）→ Week 2 Theory 的提交作业。也可从 Assignments 找到它。选择 Add work 或 Attach，找到 PDF，等上传完成，再按 Turn in。只发送到聊天不算提交作业。','在 Teams 确认已提交后，才勾选大方框。网页不会替你上传，也无法验证 Teams 状态。勾选并确认后，最后的小活动才会解锁。'],
      ko:['컴퓨터: 다운로드 버튼은 보통 웹페이지 위 브라우저 오른쪽 위에 있습니다. iPad/iPhone: PDF 열기 → 공유 → 파일에 저장 → 위치 선택 → 저장. 파일 이름을 유지하고 파일 앱에서 열어 확인하세요. 기기에 따라 위치가 다릅니다.','학교 계정으로 Teams를 열고 컴퓨팅 수업 → Classwork → Week 2 Theory 제출 과제로 이동하세요. Assignments에서도 찾을 수 있습니다. Add work 또는 Attach로 PDF를 첨부하고 업로드를 기다린 뒤 Turn in을 누르세요. 채팅으로 보내는 것은 과제 제출이 아닙니다.','Teams에서 제출 완료 상태를 확인한 뒤 큰 확인란을 선택하세요. 이 웹사이트는 대신 업로드하거나 Teams 상태를 확인하지 않습니다. 확인 후 마지막 활동이 열립니다.'],
      ms:['Komputer: butang Downloads biasanya di kanan atas pelayar, di atas halaman. iPad/iPhone: buka PDF → Share → Save to Files → pilih lokasi → Save. Kekalkan nama fail dan semak dalam aplikasi Files. Kedudukan butang mungkin berbeza.','Buka Teams dengan akaun sekolah → kelas Computing → Classwork → tugasan Week 2 Theory. Jika tiada, gunakan Assignments. Pilih Add work atau Attach, pilih PDF, tunggu muat naik selesai, kemudian tekan Turn in. Menghantar dalam chat bukan penyerahan tugasan.','Semak status diserahkan dalam Teams sebelum menanda kotak besar. Laman ini tidak memuat naik atau mengesahkan penyerahan untuk kamu. Selepas pengesahan sendiri, aktiviti terakhir akan dibuka.']
    }[state.supportLanguage];
    $('#submissionLanguage').hidden=!lang;
    $('#submissionLanguage').lang=({zh:'zh-Hans',ko:'ko',ms:'ms'})[state.supportLanguage] || 'en';
    $('#submissionLanguage').textContent=lang?.[step] || '';
  }

  async function shareLessonPdf() {
    if(!lastPdfBlob) return;
    try {
      const file=new File([lastPdfBlob],lessonPdfFilename(),{type:'application/pdf'});
      if(navigator.canShare?.({files:[file]}) && navigator.share) {
        await navigator.share({files:[file],title:'Week 2 Theory report'});
        $('#sharePdfStatus').textContent='Check Files to confirm the PDF saved. Sharing does not mean it was submitted to the Teams assignment.';
      } else {
        $('#sharePdfStatus').textContent='File sharing is not available here. Tap Open PDF preview, then use Share → Save to Files. Return to this lesson afterwards.';
      }
    } catch(error) { $('#sharePdfStatus').textContent=error.name==='AbortError' ? 'Sharing was cancelled. Try again or open the PDF preview.' : 'Sharing was unavailable. Open the PDF preview and use its Share menu, or find the downloaded copy in Files.'; }
  }

  function confirmTeamsSubmission() {
    if(!state.submission.requestedAt || !$('#teamsUploadConfirmed').checked) return;
    state.submission.confirmedAt=new Date().toISOString();
    state.submission.verification='Student self-report only; not checked with Teams';
    if(state.finisherId===null) state.finisherId=Math.floor(Math.random()*FINISHERS.length);
    saveState(); closeSubmissionGuide(); goTo('finisher');
  }

  function renderFinisher() {
    if(!state.submission.confirmedAt) return;
    const expired = Date.now() > Date.parse(GIMKIT_DEADLINE);
    const link = $('#gimkitAssignmentLink');
    link.hidden = expired;
    if (expired) link.removeAttribute('href'); else link.href = GIMKIT_ASSIGNMENT_URL;
    $('#gimkitAvailability').textContent = expired ? 'This Gimkit assignment has reached its deadline. Ask your teacher for a new assignment, or try the offline puzzle below.' : 'Ready when you are. Open the game and work at your own pace.';
    const support = {
      zh: '点击按钮，在新标签页打开 Gimkit，然后选择 Start Assignment。使用老师认识的名字。目标是答对 10 题；练习时题目可能重复。无需再上传 PDF。没有网络时，可打开下面的小练习。',
      ko: '버튼을 눌러 새 탭에서 Gimkit을 열고 Start Assignment를 선택하세요. 선생님이 알아볼 수 있는 이름을 사용하세요. 10문제를 맞히는 것이 목표이며 연습 중 문제가 반복될 수 있습니다. PDF를 다시 제출할 필요는 없습니다. 인터넷이 없으면 아래 짧은 문제를 풀어 보세요.',
      ms: 'Buka Gimkit dalam tab baharu dan pilih Start Assignment. Gunakan nama yang guru kenali. Sasarkan 10 jawapan betul; soalan mungkin berulang semasa latihan. Tidak perlu menghantar PDF lagi. Jika tiada internet, cuba teka-teki ringkas di bawah.'
    }[state.supportLanguage];
    $('#gimkitLanguage').hidden = !support;
    $('#gimkitLanguage').textContent = support || '';
    $('#gimkitLanguage').lang = ({zh:'zh-Hans',ko:'ko',ms:'ms'})[state.supportLanguage] || 'en';
    if(state.finisherId===null) state.finisherId=Math.floor(Math.random()*FINISHERS.length);
    const task=FINISHERS[state.finisherId];
    $('#finisherActivity').innerHTML=`<h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.prompt)}</p><fieldset><legend>Choose the best answer</legend>${task.options.map((label,i)=>`<label class="choice"><input type="radio" name="finishAnswer" data-track="finish_answer" value="${i}" ${String(getResponse('finish_answer'))===String(i)?'checked':''}>${escapeHtml(label)}</label>`).join('')}</fieldset>`;
    $('#finisherFeedback').hidden=true;
    if(state.checks.finisher) showFeedback('finisherFeedback',state.checks.finisher.correct?'success':'warning','Your last checked attempt is saved',[state.checks.finisher.correct?'That answer was correct.': 'Use the explanation to improve your answer.',task.explain]);
  }

  function checkFinisher() {
    if(!state.submission.confirmedAt) return;
    const answer=getResponse('finish_answer');
    if(answer==='') return showFeedback('finisherFeedback','warning','Choose an answer',['Try your best idea; this is a short extra activity, not another submission.']);
    const task=FINISHERS[state.finisherId], correct=answer===task.answer;
    state.checks.finisher={answer,correct,at:new Date().toISOString()};
    if(correct) markComplete('finisher');
    scheduleSave();
    showFeedback('finisherFeedback',correct?'success':'warning',correct?'Good thinking — puzzle complete':'Have another look',[task.explain]);
  }

  function printWithSubmissionGuide() {
    clearPdfSession();
    renderReview();
    recordPdfRequest('print requested — save not verified');
    const previousTitle=document.title;
    document.title=lessonPdfFilename().replace(/\.pdf$/,'');
    window.print();
    document.title=previousTitle;
    openSubmissionGuide();
  }

  function exportBackup() {
    const payload = { ...state, exportedAt: new Date().toISOString() };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `Year8_${sanitizeFilename(state.student.className)}_${sanitizeFilename(state.student.name)}_Week2_Theory_Backup.json`);
  }

  async function importBackup(file) {
    try {
      const imported = JSON.parse(await file.text());
      if (imported.lessonId !== LESSON_ID) throw new Error("This backup belongs to a different lesson.");
      if (!confirm("Replace the current work with this backup?")) return;
      clearPdfSession();
      const student = state.teacherMode ? state.student : imported.student;
      state = normalizeState(imported, student, state.teacherMode);
      stateKey = buildStateKey(student, state.teacherMode);
      hydrateApp();
      saveState();
      showFeedback("exportFeedback", "success", "Backup restored", ["Responses, completion and flowchart evidence were restored."]);
    } catch (error) {
      showFeedback("exportFeedback", "error", "Backup could not be imported", [error.message || "The file may be damaged."]);
    }
  }

  function renderLanguageSupport() {
    const language = state.supportLanguage || "en";
    $("#languageChip").hidden = language === "en";
    $("#languageChip").textContent = SUPPORT_LABELS[language] || "";
    $$(".language-help").forEach((details) => {
      const content = LANGUAGE_SUPPORT[language]?.[details.dataset.support];
      details.hidden = !content;
      const container = $("div", details);
      if (container) container.innerHTML = content ? `<p>${escapeHtml(content)}</p>` : "";
    });
    const paperSupport = {
      zh: ["zh-Hans", "中文写作支持", "先在 A4 纸上画自己的图标和姓名首字母，不要照抄范例。照片是可选的。让老师查看纸上的流程图；如果还在等老师，可以先继续。", "首先，我的徽章显示___。它等待___。然后，它显示___。箭头表示___。", "英文范例的意思：首先，我的徽章显示一颗爱心来欢迎访客。它等待按钮 A 被按下，然后滚动显示 JP。箭头表示从欢迎图像到姓名首字母的顺序。"],
      ko: ["ko", "한국어 쓰기 도움", "A4 종이에 자신만의 아이콘과 이름 이니셜을 넣어 그리세요. 예시를 그대로 베끼지 마세요. 사진은 선택 사항입니다. 선생님께 종이 순서도를 보여 주세요. 확인을 기다리는 동안에는 다음 활동으로 넘어가도 됩니다.", "먼저, 제 배지는 ___을/를 표시합니다. ___까지 기다립니다. 그다음 ___을/를 표시합니다. 화살표는 ___을/를 나타냅니다.", "영어 예시의 뜻: 먼저, 제 배지는 방문객을 환영하는 하트를 표시합니다. 버튼 A를 누를 때까지 기다린 다음 JP를 스크롤하여 표시합니다. 화살표는 환영 이미지에서 이름 이니셜로 이어지는 순서를 나타냅니다."],
      ms: ["ms", "Sokongan penulisan Bahasa Melayu", "Lukis ikon dan huruf awal nama kamu sendiri pada kertas A4; jangan salin contoh bulat-bulat. Foto adalah pilihan. Tunjukkan carta alir kepada guru. Kamu boleh teruskan aktiviti sementara menunggu semakan guru.", "Mula-mula, lencana saya memaparkan ___. Ia menunggu sehingga ___. Kemudian, ia memaparkan ___. Anak panah menunjukkan ___.", "Maksud contoh bahasa Inggeris: Mula-mula, lencana saya memaparkan ikon hati untuk mengalu-alukan pengunjung. Ia menunggu sehingga Butang A ditekan, kemudian memaparkan JP secara tatal. Anak panah menunjukkan urutan daripada imej alu-aluan kepada huruf awal nama."]
    }[language];
    const paperPanel = $("#paperLanguageSupport");
    paperPanel.hidden = !paperSupport;
    paperPanel.innerHTML = paperSupport ? `<div lang="${paperSupport[0]}"><h4>${escapeHtml(paperSupport[1])}</h4><p>${escapeHtml(paperSupport[2])}</p><p><strong>${escapeHtml(paperSupport[3])}</strong></p><p>${escapeHtml(paperSupport[4])}</p></div><p>Use the English example above to help translate your own ideas, not to replace them.</p>` : "";
  }

  function renderLearningPanels() {
    const content = $("#learningPanelTemplate").innerHTML;
    $("#desktopLearningPanel").innerHTML = content;
    $("#mobileLearningPanel").innerHTML = content;
  }

  function closeMobilePanels() {
    ["mobileJourney", "mobileLearningPanel"].forEach((id) => { const panel = document.getElementById(id); panel.hidden = true; panel.classList.remove("open"); });
    $("#mobileMenuButton").setAttribute("aria-expanded", "false");
    $("#learningDrawerButton").setAttribute("aria-expanded", "false");
  }

  function toggleMobilePanel(panelId, buttonId) {
    const panel = document.getElementById(panelId);
    const opening = panel.hidden;
    closeMobilePanels();
    panel.hidden = !opening;
    panel.classList.toggle("open", opening);
    document.getElementById(buttonId).setAttribute("aria-expanded", String(opening));
  }

  function openImage(button) {
    const dialog = $("#imageDialog");
    const image = $("#dialogImage");
    image.src = button.dataset.image;
    image.alt = button.dataset.alt || "Enlarged lesson image";
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function installImageFallbacks(root = document) {
    $$("img", root).forEach((image) => image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "feedback warning";
      fallback.textContent = "The support image could not be loaded. Continue using the written instructions.";
      image.replaceWith(fallback);
    }, { once: true }));
  }

  function hydrateApp() {
    $("#headerStudentName").textContent = state.teacherMode ? "Teacher review" : state.student.name;
    $("#headerStudentClass").textContent = state.student.className;
    hydrateInputs();
    renderSequence();
    renderNavigation();
    renderLearningPanels();
    renderLanguageSupport();
    renderEvidence();
    renderPaperCard();
    renderExtensionLevels();
    renderPitstop();
    renderMission();
    renderKsu();
    renderMain1();
    updateProgress();
    if (state.completed.doNow) $('[data-next="types"]', $('[data-section="doNow"]')).hidden = false;
    if (state.completed.main1) $('[data-next="main2"]', $('[data-section="main1"]')).hidden = false;
    if (state.completed.main2) $("#main2Routes").hidden = false;
    if (state.completed.plenary) $('[data-next="review"]', $('[data-section="plenary"]')).hidden = false;
    goTo(isUnlocked(state.currentSection) ? state.currentSection : "mission");
  }

  async function enterLesson(event) {
    event.preventDefault();
    const name = $("#studentName").value.trim();
    const className = $("#studentClass").value.trim();
    const teacherMode = name.toLowerCase() === "teacher";
    if (!name || (!className && !teacherMode)) {
      $("#entryError").textContent = "Enter your full name and class before starting.";
      return;
    }
    const student = { name: teacherMode ? "Teacher review" : name, className: teacherMode ? (className || "Review") : className, supportLanguage: $("#supportLanguage").value };
    clearPdfSession();
    stateKey = buildStateKey(student, teacherMode);
    state = normalizeState(loadState(stateKey), student, teacherMode);
    $("#landingPage").hidden = true;
    $("#lessonApp").hidden = false;
    hydrateApp();
    saveState();
  }

  function init() {
    renderLearningPanels();
    buildPitstopQuestions();
    try {
      const last = JSON.parse(localStorage.getItem(LAST_PROFILE_KEY) || "null");
      if (last?.name && last.name !== "Teacher review") {
        $("#studentName").value = last.name;
        $("#studentClass").value = last.className || "";
        $("#supportLanguage").value = last.supportLanguage || "en";
        $("#resumeNotice").hidden = false;
      }
    } catch { /* Keep blank entry form. */ }

    $("#entryForm").addEventListener("submit", enterLesson);
    document.addEventListener("input", (event) => { if (event.target.matches("[data-track]")) captureInput(event.target); });
    document.addEventListener("change", (event) => { if (event.target.matches("[data-track]")) captureInput(event.target); });
    document.addEventListener("click", (event) => {
      if (event.target.closest('[data-open-submission]')) return openSubmissionGuide();
      const subDevice = event.target.closest('[data-sub-device]');
      if (subDevice) { state.submission.device = subDevice.dataset.subDevice; renderSubmissionGuide(); scheduleSave(); return; }
      const subStep = event.target.closest('[data-sub-step]');
      if (subStep) {
        state.submission.step = Number(subStep.dataset.subStep);
        renderSubmissionGuide(); scheduleSave();
        $('#submissionDialog').scrollTop = 0;
        const heading = $(`[data-sub-panel="${state.submission.step}"] h3`);
        heading.tabIndex = -1; heading.focus({preventScroll:true});
        return;
      }
      if (event.target.closest('#finishReturn')) return goTo(isUnlocked('review') ? 'review' : 'mission');
      const pitCheck=event.target.closest('[data-pit-check]');
      if (pitCheck) return checkPitstop(Number(pitCheck.dataset.pitCheck));
      const pitCard=event.target.closest('[data-pit-card], [data-pit-next]');
      if (pitCard) return movePitstop(Number(pitCard.dataset.pitCard ?? pitCard.dataset.pitNext));
      const move = event.target.closest("[data-move]");
      if (move) return moveSequence(Number(move.dataset.index), move.dataset.move);
      const main1View = event.target.closest("[data-m1-view]");
      if (main1View) { state.main1View = main1View.dataset.m1View; renderMain1(); scheduleSave(); return; }
      const extensionCard = event.target.closest('[data-extension-card]');
      if (extensionCard) {
        state.extensionCard = Number(extensionCard.dataset.extensionCard);
        renderExtensionLevels(); scheduleSave();
        $('#extensionFeedback').hidden = true;
        return;
      }
      const paperView = event.target.closest("[data-paper-view]");
      if (paperView) {
        state.paperView = paperView.dataset.paperView === 'explain' ? 'explain' : 'draw';
        renderPaperCard(); scheduleSave();
        $('.paper-card-nav').scrollIntoView?.({ block: 'start' });
        $(`.paper-card-nav [data-paper-view="${state.paperView}"]`).focus({ preventScroll: true });
        return;
      }
      const navigation = event.target.closest("[data-go], [data-next], [data-back]");
      if (navigation) return goTo(navigation.dataset.go || navigation.dataset.next || navigation.dataset.back);
      const imageButton = event.target.closest(".image-button");
      if (imageButton) return openImage(imageButton);
      const levelButton = event.target.closest("[data-level-save]");
      if (levelButton) return saveExtensionLevel(Number(levelButton.dataset.levelSave));
    });

    $("#startMissionQuiz").addEventListener("click", startMissionQuiz);
    $("#missionQuizAction").addEventListener("click", advanceMissionQuiz);
    $("#rereadMission").addEventListener("click", () => { state.missionView = "reading"; renderMission(); scheduleSave(); $("#startMissionQuiz").focus({ preventScroll: true }); });
    $("#missionQuizBack").addEventListener("click", () => {
      if (state.missionQuestion > 0) state.missionQuestion -= 1;
      else state.missionView = "reading";
      renderMission(); scheduleSave();
      (state.missionView === "reading" ? $("#startMissionQuiz") : $("#missionQuestion input"))?.focus({ preventScroll: true });
    });
    $("#checkDoNow").addEventListener("click", checkDoNow);
    $("#completeTypes").addEventListener("click", completeTypes);
    $("#ksuBack").addEventListener("click", () => {
      if (state.typesStep === 0) return goTo("doNow");
      state.typesStep -= 1; renderKsu(); scheduleSave(); $("#lessonContent").focus({ preventScroll: true });
    });
    $("#checkMain1").addEventListener("click", checkMain1);
    $("#main1Back").addEventListener("click", () => {
      if (state.main1View === "practice") state.main1View = "study";
      else if (state.main1Card > 0) { state.main1Card -= 1; state.main1View = "practice"; }
      else return goTo("types");
      renderMain1(); scheduleSave(); $("#lessonContent").focus({ preventScroll: true });
    });
    $("#completeMain2").addEventListener("click", completeMain2);
    $("#completePitstop").addEventListener("click", completePitstop);
    $("#completePlenary").addEventListener("click", completePlenary);
    $("#evidenceFile").addEventListener("change", (event) => processEvidenceFile(event.target.files?.[0]));
    $("#pasteZone").addEventListener("paste", (event) => {
      const file = [...(event.clipboardData?.items || [])].find((item) => item.type.startsWith("image/"))?.getAsFile();
      if (file) { event.preventDefault(); processEvidenceFile(file); }
    });
    $("#removeEvidence").addEventListener("click", () => { if (confirm("Remove the uploaded flowchart image?")) { state.evidence = null; renderEvidence(); scheduleSave(); } });
    $("#headerExportButton").addEventListener("click", exportPdf);
    $("#finalExportButton").addEventListener("click", exportPdf);
    $("#printButton").addEventListener("click", printWithSubmissionGuide);
    $('#closeSubmission').addEventListener('click', closeSubmissionGuide);
    $('#submissionDialog').addEventListener('cancel', event => { event.preventDefault(); closeSubmissionGuide(); });
    $('#submissionDialog').addEventListener('keydown', event => {
      if (event.key !== 'Tab' || typeof $('#submissionDialog').showModal === 'function') return;
      const controls = [...$('#submissionDialog').querySelectorAll('button:not(:disabled), a[href], input:not(:disabled)')].filter(node => !node.closest('[hidden]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    $('#teamsUploadConfirmed').addEventListener('change', renderSubmissionGuide);
    $('#shareLessonPdf').addEventListener('click', shareLessonPdf);
    $('#confirmTeamsSubmission').addEventListener('click', confirmTeamsSubmission);
    $('#checkFinisher').addEventListener('click', checkFinisher);
    $("#backupButton").addEventListener("click", exportBackup);
    $("#backupInput").addEventListener("change", (event) => { if (event.target.files?.[0]) importBackup(event.target.files[0]); });
    $("#resetButton").addEventListener("click", () => {
      if (!confirm("Delete all saved Week 2 Theory work for this student on this browser?")) return;
      localStorage.removeItem(stateKey);
      location.reload();
    });
    $("#mobileMenuButton").addEventListener("click", () => toggleMobilePanel("mobileJourney", "mobileMenuButton"));
    $("#learningDrawerButton").addEventListener("click", () => toggleMobilePanel("mobileLearningPanel", "learningDrawerButton"));
    $("#closeImageDialog").addEventListener("click", () => $("#imageDialog").close());
    $("#imageDialog").addEventListener("click", (event) => { if (event.target === $("#imageDialog")) $("#imageDialog").close(); });
    installImageFallbacks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
