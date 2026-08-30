(() => {
  "use strict";

  const queryTeacher = new URLSearchParams(location.search).get("teacher") === "1";
  let teacherMode = queryTeacher;
  const STUDENT_KEY = "tta_y9_w1_learning_student_v3";
  const TEACHER_KEY = "tta_y9_w1_learning_teacher_v3";
  const sectionOrder = ["starter", "concepts", "trace", "debug", "extension", "plenary", "review"];
  const sectionTitles = {
    starter: "Do Now",
    concepts: "Plan to Program",
    trace: "Code Tracing",
    debug: "Systematic Debugging",
    extension: "Extension Lab",
    plenary: "Plenary",
    review: "Evidence Report",
  };
  const coreSections = ["starter", "concepts", "trace", "debug", "plenary"];
  const starterPython = `# Python Studio starter
# Make one small change, run it, then use the result as your next clue.

name = input("What is your name? ")
print("Welcome", name)

# Continue your idea below.
`;
  const extensionQuiz = [
    ["Which description best matches an algorithm?", ["A finished Python file", "An ordered plan for solving a problem", "Any output on screen", "A list of errors"], 1, "An algorithm is the ordered plan. It can be written without using a programming language."],
    ["What is source code?", ["Instructions written in a programming language", "A trace table", "Only the final output", "A computer component"], 0, "Source code expresses instructions using a language such as Python."],
    ["What is program behaviour?", ["The filename", "What happens when the computer executes the code", "The planning notes", "The keyboard layout"], 1, "Behaviour is what the running program does with particular inputs."],
    ["What does a variable do?", ["Stores a named value", "Fixes every error", "Draws a flowchart", "Turns off input"], 0, "A variable is a named storage location whose value may change."],
    ["What does assignment do?", ["Compares two files", "Gives or replaces a variable's value", "Prints every variable", "Deletes a program"], 1, "Assignment sets a variable to a value, such as score = 5."],
    ["Which is an input?", ["A name typed by the user", "A welcome message displayed", "A calculation result", "A syntax rule"], 0, "Input is data received by a program."],
    ["Which is an output?", ["A button press", "A number entered", "A message displayed", "A variable name"], 2, "Output is information produced or displayed by a program."],
    ["What does tracing mean?", ["Guessing the output", "Following code line by line and recording values", "Copying the program", "Changing every line"], 1, "A trace follows the computer's steps and uses each newest value."],
    ["score starts at 4, then score = score + 3. What is score now?", ["3", "4", "7", "43"], 2, "The current value 4 is increased by 3, giving 7."],
    ["name = 'Ari'; print('Hi', name). What is displayed?", ["name", "Hi Ari", "Ari Hi", "Nothing"], 1, "print outputs the text Hi followed by the value stored in name."],
    ["Which problem is a syntax error?", ["A missing colon after if", "A wrong discount formula", "A user enters zero", "A message is unpopular"], 0, "A missing colon breaks Python's grammar rules."],
    ["Which problem is a runtime error?", ["A misspelled plan", "Division by zero while the program runs", "A wrong total that still displays", "An unclear variable name"], 1, "A runtime error happens during execution, such as dividing by zero."],
    ["Which problem is a logic error?", ["Python cannot read the code", "The program runs but calculates the wrong total", "The laptop is off", "The file is not saved"], 1, "A logic error allows the program to run but produces unintended behaviour."],
    ["A program fails. What is the most useful first move?", ["Delete everything", "Read the error message or compare expected and actual behaviour", "Change five lines", "Copy someone else's code"], 1, "Start by gathering evidence about where and why the behaviour differs."],
    ["Why change one thing at a time when debugging?", ["It makes code longer", "It links a change to its result", "It hides the error", "It guarantees full marks"], 1, "One focused change lets you judge whether that exact change helped."],
    ["Which item is an algorithm rather than source code?", ["print(total)", "Ask for two prices, add them, then display the total", "The screen displays 14", "SyntaxError line 2"], 1, "An algorithm is an ordered plan and does not require programming-language syntax."],
    ["Why record an intermediate value while tracing?", ["It shows where a value first changes unexpectedly", "It makes the code run faster", "It removes the need to read later lines", "It changes the program"], 0, "Intermediate values reveal the exact line where expected and actual behaviour begin to differ."],
    ["Expected output is 25 and actual output is 15. Which improvement-cycle stage directly compares them?", ["Understand", "Plan", "Check", "Output"], 2, "The check stage compares expected and actual results before a focused improvement."],
    ["Which test is useful for a program checking age >= 13?", ["Only age 20", "Ages 12, 13 and 14", "No inputs", "Only names"], 1, "Testing just below, at and just above the boundary checks the condition carefully."],
    ["If AI suggests code, what should a responsible student do?", ["Submit it without reading", "Test it, explain it and check that it is allowed", "Hide where it came from", "Assume it is correct"], 1, "Understanding, testing and following classroom rules remain the student's responsibility."],
  ].map(([question, options, answer, explanation], index) => ({ id: index, question, options, answer, explanation }));

  const supportNames = {
    none: "English only",
    plain: "Plain English",
    ms: "Bahasa Melayu",
    zh: "简体中文",
    ko: "한국어",
  };

  const supportContent = {
    plain: {
      preview: "You will see shorter explanations, important words and sentence starters.",
      starter: ["Plain-English task guide", "First read the worked syntax example. Then answer only the eco-points and online-code cases. A useful choice must tell you something new.", "1) Choose a first move in both cases. 2) Pick one case to explain. 3) Name a clue, an action and what it would reveal.", "I would inspect ___. Then I would ___. This would show whether ___."],
      concepts: ["Plain-English task guide", "An algorithm is the plan. Source code writes the plan in a programming language. Behaviour is what happens when the code runs.", "1) Classify the three mixed examples. 2) Follow the charity-points cycle. 3) Compare expected 25 with actual 15. 4) Correct one line and explain the check stage.", "The check stage helped because expected ___ but actual ___, so I inspected ___."],
      trace: ["Plain-English task guide", "Trace means act like the computer: read one line, update the value, record it, then continue. Do not jump to the output.", "1) Study the worked lives example. 2) Complete the guided table. 3) Record every intermediate value in Levels 1–3. 4) Explain whether the condition is true.", "After line ___, ___ changes from ___ to ___. The condition is ___, so ___."],
      debug: ["Plain-English task guide", "A syntax error breaks grammar. A runtime error happens while code runs. A logic error runs but gives the wrong result.", "1) Study the correct if structure. 2) Classify each clue. 3) Correct the focused line. 4) Compare the two test records and justify the controlled test.", "Only ___ changed; ___ stayed the same. The result ___ supports the conclusion that ___."],
      extension: ["Plain-English support", "Choose a level: Quiz is a quick check, Flashcards can be typed or made on paper, Algorithm is a written plan and Python is a program.", "Choose one route. Read its example before starting.", "I chose ___ because ___. My evidence shows ___."],
      plenary: ["Plain-English task guide", "Retrieve the three main ideas, rate your confidence honestly, then choose one skill to practise next.", "Correct any highlighted retrieval answer. Your target action must say what you will do and when or how you will do it.", "Next lesson, when I ___, I will ___ so that ___."],
    },
    ms: {
      preview: "Penerangan dwibahasa, terjemahan soalan dan rangka ayat akan ditunjukkan.",
      starter: ["Sokongan Bahasa Melayu", "Langkah pertama yang baik membantu anda mendapatkan maklumat baharu. Baca mesej, periksa apa yang berlaku dan elakkan perubahan secara rawak.", "Pilih tindakan yang memberikan bukti berguna.", "Saya akan ___ dahulu kerana tindakan ini akan menunjukkan ___."],
      concepts: ["Panduan tugasan Bahasa Melayu", "Algoritma ialah rancangan; kod sumber ialah rancangan dalam bahasa pengaturcaraan; tingkah laku ialah apa yang berlaku apabila kod dijalankan.", "1) Kelaskan tiga contoh. 2) Ikuti kitaran mata amal. 3) Bandingkan jangkaan 25 dengan sebenar 15. 4) Betulkan satu baris dan jelaskan peringkat semak.", "Peringkat semak membantu kerana jangkaan ___ tetapi sebenar ___, jadi saya memeriksa ___."],
      trace: ["Sokongan Bahasa Melayu", "Menjejak kod bermaksud mengikuti satu baris pada satu masa. Sentiasa gunakan nilai yang paling baharu.", "Lengkapkan satu baris sebelum bergerak ke baris seterusnya.", "Selepas baris ini, nilai ___ menjadi ___."],
      debug: ["Sokongan Bahasa Melayu", "Ralat ialah petunjuk. Baca mesej, cari baris, ubah satu perkara, kemudian jalankan dan semak semula.", "Gunakan bukti untuk memilih jenis ralat dan tindakan seterusnya.", "Mengubah satu perkara membantu kerana ___."],
      extension: ["Sokongan Bahasa Melayu", "Pilih tahap: Kuiz ialah semakan pantas, Kad Imbas boleh ditaip atau dibuat di atas kertas, Algoritma ialah rancangan bertulis dan Python ialah program.", "Pilih satu laluan dan baca contoh sebelum bermula.", "Saya memilih ___ kerana ___. Bukti saya menunjukkan ___."],
      plenary: ["Panduan tugasan Bahasa Melayu", "Ingat semula tiga idea utama, nilai keyakinan dengan jujur dan pilih satu kemahiran untuk latihan seterusnya.", "Betulkan jawapan yang diserlahkan. Tindakan sasaran mesti menyatakan apa dan bila atau bagaimana anda akan melakukannya.", "Dalam pelajaran seterusnya, apabila saya ___, saya akan ___ supaya ___."],
    },
    zh: {
      preview: "系统将显示双语解释、题目翻译和句型提示。",
      starter: ["中文学习支持", "好的第一步应该帮助你获得新信息。先阅读信息，检查发生了什么，不要随意修改。", "选择能够提供有用证据的行动。", "我会先___，因为这能让我知道___。"],
      concepts: ["中文任务指南", "算法是计划；源代码是用编程语言写出的计划；程序行为是代码运行时发生的事情。", "1）判断三个例子。2）完成慈善积分改进循环。3）比较预期25和实际15。4）修正一行并解释检查阶段。", "检查阶段有帮助，因为预期是___，实际是___，所以我检查了___。"],
      trace: ["中文学习支持", "代码跟踪是逐行执行并记录变化。每一步都要使用变量的最新值。", "完成一行后再看下一行。", "执行这一行后，___的值变为___。"],
      debug: ["中文学习支持", "错误信息是线索。先阅读信息，找到对应行，只修改一处，然后重新运行并检查。", "根据证据选择错误类型和下一步行动。", "一次只修改一处很重要，因为___。"],
      extension: ["中文学习支持", "选择难度：测验用于快速复习；闪卡可以打字或在纸上制作；算法是书面计划；Python 是编程挑战。", "选择一个路线，开始前先阅读示例。", "我选择___，因为___。我的证据表明___。"],
      plenary: ["中文任务指南", "回忆三个核心概念，诚实评价信心，然后选择下一项练习技能。", "修正高亮答案。目标行动必须说明做什么，以及何时或怎样做。", "下节课，当我___时，我会___，这样可以___。"],
    },
    ko: {
      preview: "이중 언어 설명, 질문 번역, 문장 틀이 표시됩니다.",
      starter: ["한국어 학습 지원", "좋은 첫 단계는 새로운 정보를 얻도록 도와줍니다. 메시지를 읽고 실제 결과를 확인하세요. 무작위로 코드를 바꾸지 마세요.", "유용한 증거를 주는 행동을 고르세요.", "먼저 ___하겠습니다. 그러면 ___을 알 수 있기 때문입니다."],
      concepts: ["한국어 과제 안내", "알고리즘은 계획, 소스 코드는 프로그래밍 언어로 쓴 계획, 프로그램 동작은 코드가 실행될 때 일어나는 일입니다.", "1) 세 예를 분류하세요. 2) 자선 포인트 개선 순환을 따르세요. 3) 예상 25와 실제 15를 비교하세요. 4) 한 줄을 고치고 확인 단계를 설명하세요.", "확인 단계가 도움이 된 이유는 예상값은 ___, 실제값은 ___여서 ___을 확인했기 때문입니다."],
      trace: ["한국어 학습 지원", "코드 추적은 한 줄씩 따라가며 값의 변화를 기록하는 것입니다. 항상 가장 최근 값을 사용하세요.", "한 행을 끝낸 뒤 다음 행으로 이동하세요.", "이 줄 뒤에 ___의 값은 ___이 됩니다."],
      debug: ["한국어 학습 지원", "오류 메시지는 단서입니다. 메시지를 읽고 줄을 찾은 뒤 한 가지만 바꾸고 다시 실행하여 확인하세요.", "증거를 사용하여 오류 종류와 다음 행동을 고르세요.", "한 번에 한 가지만 바꾸면 ___을 알 수 있습니다."],
      extension: ["한국어 학습 지원", "난이도를 고르세요. 퀴즈는 빠른 복습, 플래시카드는 타이핑 또는 종이 작업, 알고리즘은 글로 쓴 계획, Python은 프로그래밍 도전입니다.", "한 경로를 고르고 시작하기 전에 예시를 읽으세요.", "나는 ___을 골랐습니다. 이유는 ___입니다. 내 증거는 ___을 보여 줍니다."],
      plenary: ["한국어 과제 안내", "세 가지 핵심 내용을 떠올리고 자신감을 솔직히 평가한 뒤 다음에 연습할 기술을 고르세요.", "강조된 답을 고치세요. 목표 행동에는 무엇을, 언제 또는 어떻게 할지 써야 합니다.", "다음 수업에서 ___할 때, ___해서 ___하겠습니다."],
    },
  };

  const glossary = [
    ["Algorithm", "An ordered sequence of steps for solving a problem.", { plain: "A step-by-step plan.", ms: "Urutan langkah untuk menyelesaikan masalah.", zh: "解决问题的一系列有序步骤。", ko: "문제를 해결하기 위한 순서 있는 단계입니다." }],
    ["Source code", "Instructions written in a programming language.", { plain: "The program text a person writes.", ms: "Arahan yang ditulis dalam bahasa pengaturcaraan.", zh: "用编程语言写出的指令。", ko: "프로그래밍 언어로 작성한 명령입니다." }],
    ["Program", "Source code prepared so a computer can execute it.", { plain: "Instructions the computer can run.", ms: "Arahan yang boleh dilaksanakan oleh komputer.", zh: "计算机能够执行的指令。", ko: "컴퓨터가 실행할 수 있는 명령입니다." }],
    ["Variable", "A named location that stores a value.", { plain: "A labelled box for a value.", ms: "Tempat bernama yang menyimpan nilai.", zh: "用于存储数值的命名位置。", ko: "값을 저장하는 이름이 있는 공간입니다." }],
    ["Assignment", "Giving or replacing the value stored in a variable.", { plain: "Set a variable to a value.", ms: "Memberi atau menggantikan nilai pemboleh ubah.", zh: "给变量设置或更新一个值。", ko: "변수의 값을 지정하거나 바꾸는 것입니다." }],
    ["Trace", "Follow code line by line and record changing values.", { plain: "Act like the computer, one line at a time.", ms: "Ikuti kod baris demi baris dan catat perubahan nilai.", zh: "逐行执行代码并记录数值变化。", ko: "코드를 한 줄씩 따라가며 값의 변화를 기록합니다." }],
    ["Debug", "Find, understand and correct a problem in a program.", { plain: "Use clues to fix a program.", ms: "Mencari, memahami dan membetulkan masalah program.", zh: "查找、理解并修正程序问题。", ko: "프로그램의 문제를 찾고 이해하여 고치는 것입니다." }],
    ["Syntax error", "Code that breaks the grammar rules of the language.", { plain: "Python cannot read the instruction correctly.", ms: "Kod melanggar peraturan tatabahasa bahasa.", zh: "代码不符合编程语言的语法规则。", ko: "코드가 언어의 문법 규칙을 어긴 오류입니다." }],
    ["Runtime error", "A problem that occurs while the program is executing.", { plain: "The program starts, then an operation fails.", ms: "Masalah berlaku semasa program sedang berjalan.", zh: "程序运行过程中发生的问题。", ko: "프로그램이 실행되는 동안 발생하는 오류입니다." }],
    ["Logic error", "The program runs but produces unintended behaviour.", { plain: "It runs, but the result is wrong.", ms: "Program berjalan tetapi hasilnya tidak seperti yang dimaksudkan.", zh: "程序能够运行，但结果不符合预期。", ko: "프로그램은 실행되지만 결과가 의도와 다릅니다." }],
    ["Input", "Data received by a program.", { plain: "Data going into the program.", ms: "Data yang diterima oleh program.", zh: "程序接收的数据。", ko: "프로그램이 받는 데이터입니다." }],
    ["Output", "Information produced or displayed by a program.", { plain: "Information coming out.", ms: "Maklumat yang dihasilkan oleh program.", zh: "程序产生或显示的信息。", ko: "프로그램이 만들어 내거나 표시하는 정보입니다." }],
  ];

  const responseLabels = {
    "scenario-2": "Starter: eco-points first move", "scenario-4": "Starter: online-code first move",
    "starter-reflection-scenario": "Starter scenario chosen for explanation", "starter-evidence": "Starter evidence inspected", "starter-steps": "Starter exact steps", "starter-learning": "Starter expected learning",
    "representation-1": "Representation check 1", "representation-2": "Representation check 2", "representation-3": "Representation check 3",
    "cycle-understand-rule": "Cycle: understood rule", "cycle-plan-order": "Cycle: planned order", "cycle-predict": "Cycle: predicted output", "cycle-run-actual": "Cycle: recorded actual output", "cycle-check": "Cycle: located disagreement", "cycle-improve-line": "Cycle: improved line", "cycle-stage": "Improvement-cycle stage selected", "cycle-evidence": "Improvement-cycle evidence", "cycle-reflection": "Improvement-cycle reflection",
    "guided-trace-1": "Guided trace line 1", "guided-trace-2": "Guided trace line 2", "guided-trace-3": "Guided trace line 3", "guided-trace-4": "Guided trace output",
    "trace-p1-start": "Trace Level 1 starting energy", "trace-p1-updated": "Trace Level 1 updated energy", "trace-p1-output": "Trace Level 1 output", "trace-p2-tickets": "Trace Level 2 tickets", "trace-p2-price": "Trace Level 2 price", "trace-p2-total": "Trace Level 2 calculated total", "trace-p2-output": "Trace Level 2 output", "trace-final-score": "Trace Level 3 final score", "trace-condition": "Trace Level 3 condition result", "trace-final-output": "Trace Level 3 message", "trace-explanation": "Trace Level 3 explanation", "trace-p4-output": "Trace Level 4 output", "trace-p4-path": "Trace Level 4 value path", "trace-p5-score": "Trace Level 5 score", "trace-p5-output": "Trace Level 5 output", "trace-p5-explanation": "Trace Level 5 explanation",
    "error-check-1": "Error type example 1", "error-check-2": "Error type example 2", "error-check-3": "Error type example 3",
    "debug-type": "Guided debug error type", "debug-line": "Guided debug line", "debug-action": "Guided debug next action", "debug-logic-line": "Logic case line", "debug-logic-fix": "Logic case correction", "debug-strategy-choice": "Debugging strategy choice", "debug-test-evidence": "Debugging test evidence", "debug-explanation": "Debugging strategy explanation",
    "studio-choice": "Python Studio choice", "python-goal": "Python goal", "python-change": "Python change", "python-test": "Python test",
    "flash-mode": "Flashcard format", "ext-flash-1-front": "Flashcard 1 front", "ext-flash-1-back": "Flashcard 1 back", "ext-flash-2-front": "Flashcard 2 front", "ext-flash-2-back": "Flashcard 2 back", "ext-flash-3-front": "Flashcard 3 front", "ext-flash-3-back": "Flashcard 3 back", "ext-flash-4-front": "Flashcard 4 front", "ext-flash-4-back": "Flashcard 4 back", "ext-paper-summary": "Paper flashcard summary",
    "ext-algorithm-inputs": "Algorithm inputs", "ext-algorithm-outputs": "Algorithm outputs", "ext-algorithm-plan": "Algorithm / pseudocode", "ext-algorithm-test1": "Algorithm test 1", "ext-algorithm-test2": "Algorithm test 2", "ext-algorithm-improvement": "Algorithm improvement",
    "plenary-q1": "Plenary algorithm check", "plenary-q2": "Plenary tracing check", "plenary-q3": "Plenary debugging check",
    "algorithm-program": "Algorithm, source code and program explanation", "confidence-concepts": "Confidence: concepts", "confidence-trace": "Confidence: tracing",
    "confidence-debug": "Confidence: debugging", "next-target": "Next target", "target-action": "Target action",
  };

  const responseDisplayMaps = {
    "scenario-2": { trace: "Trace values and compare them with the ‘triple’ rule", "rerun-only": "Run the same input again and record only the final output", "fix-first": "Change the operator and run before recording expected and actual values" },
    "scenario-4": { test: "Identify input/output, test safely and explain each retained line", "one-run": "Run once with a name and keep it if a greeting appears", "output-only": "Read only the print line" },
    "starter-reflection-scenario": { "2": "Eco-points output mismatch", "4": "Unfamiliar online greeting code" },
    "representation-1": { behaviour: "Running-program behaviour", algorithm: "Algorithm", source: "Source code" },
    "representation-2": { behaviour: "Running-program behaviour", algorithm: "Algorithm", source: "Source code" },
    "representation-3": { behaviour: "Running-program behaviour", algorithm: "Algorithm", source: "Source code" },
    "cycle-understand-rule": { add: "Add 5 to points", subtract: "Subtract 5 from points", double: "Double the points" },
    "cycle-plan-order": { "input-calculate-output": "Input → calculate total → output", "output-first": "Output → input → calculate", "calculate-only": "Calculate without input or output" },
    "cycle-check": { operator: "The operator in the total calculation", input: "The starting points value", print: "The word print" },
    "cycle-stage": { understand: "Understand the requirement", predict: "Predict 25", check: "Check expected 25 against actual 15", improve: "Improve the calculation" },
    "trace-condition": { true: "True", false: "False" },
    "error-check-1": { syntax: "Syntax error", runtime: "Runtime error", logic: "Logic error" },
    "error-check-2": { syntax: "Syntax error", runtime: "Runtime error", logic: "Logic error" },
    "error-check-3": { syntax: "Syntax error", runtime: "Runtime error", logic: "Logic error" },
    "debug-type": { syntax: "Syntax error", runtime: "Runtime error", logic: "Logic error" },
    "debug-action": { colon: "Add the missing colon to line 5", rewrite: "Rewrite the whole program", rename: "Rename the variable" },
    "debug-strategy-choice": { a: "Attempt A", b: "Attempt B" },
    "plenary-q1": { plan: "An ordered plan for solving a problem", code: "Only Python source code", output: "The displayed output" },
    "plenary-q2": { follow: "Follow code line by line and record values", guess: "Guess the output", run: "Run until it works" },
    "plenary-q3": { read: "Read the error or compare expected and actual behaviour", delete: "Delete the whole program", many: "Change several lines together" },
  };

  function blankState() {
    return {
      version: 3,
      meta: {
        name: "", className: "", language: "none", currentSection: "starter",
        dateStarted: new Date().toISOString(), lastSaved: null, teacher: false,
      },
      completed: { starter: false, concepts: false, trace: false, debug: false, extension: false, plenary: false, review: false },
      responses: {},
      scores: {},
      attempts: {},
      diagnostics: {},
      timestamps: {},
      python: { code: starterPython, output: "", runCount: 0, submitted: false },
      evidence: { imageData: "", imageName: "" },
      extension: { selected: [], submitted: [], quiz: { current: 0, answers: {}, checked: {} }, paperImageData: "", paperImageName: "" },
    };
  }

  function mergeState(saved) {
    const base = blankState();
    if (!saved || typeof saved !== "object") return base;
    return {
      ...base, ...saved,
      meta: { ...base.meta, ...(saved.meta || {}) },
      completed: { ...base.completed, ...(saved.completed || {}) },
      responses: { ...base.responses, ...(saved.responses || {}) },
      scores: { ...base.scores, ...(saved.scores || {}) },
      attempts: { ...base.attempts, ...(saved.attempts || {}) },
      diagnostics: { ...base.diagnostics, ...(saved.diagnostics || {}) },
      timestamps: { ...base.timestamps, ...(saved.timestamps || {}) },
      python: { ...base.python, ...(saved.python || {}) },
      evidence: { ...base.evidence, ...(saved.evidence || {}) },
      extension: {
        ...base.extension, ...(saved.extension || {}),
        quiz: { ...base.extension.quiz, ...((saved.extension || {}).quiz || {}), answers: { ...base.extension.quiz.answers, ...(((saved.extension || {}).quiz || {}).answers || {}) }, checked: { ...base.extension.quiz.checked, ...(((saved.extension || {}).quiz || {}).checked || {}) } },
      },
    };
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const normalise = (value) => String(value ?? "").trim().toLowerCase();
  const hasText = (value, length = 1) => String(value ?? "").trim().length >= length;
  const hasMeaningfulResponse = (value, { minWords = 4, minChars = 14 } = {}) => {
    const text = String(value ?? "").trim().replace(/\s+/g, " ");
    if (text.length < minChars) return false;
    const tokens = text.match(/[\p{L}\p{M}\p{N}]+/gu) || [];
    const usesUnspacedScript = /[\u3400-\u9fff\u3040-\u30ff]/u.test(text);
    if (usesUnspacedScript) {
      const meaningfulCharacters = (text.match(/[\p{L}\p{N}]/gu) || []).length;
      return meaningfulCharacters >= Math.max(8, minWords * 2);
    }
    return tokens.length >= minWords;
  };
  const safeFilePart = (value) => String(value || "Unknown").trim().replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "") || "Unknown";
  const storageKey = () => teacherMode ? TEACHER_KEY : STUDENT_KEY;

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(storageKey())); } catch (_) { saved = null; }
  let state = mergeState(saved);
  let saveTimer = null;
  let editor = null;
  let pythonWorker = null;
  let pythonReady = false;
  let activeRun = null;
  let runCounter = 0;
  let errorMarker = null;
  const runContexts = new Map();

  function setFeedback(element, message, type = "info") {
    if (!element) return;
    element.textContent = message;
    element.className = `feedback ${type}`;
  }

  function clearFieldChecks(sectionKey) {
    const section = $(`#section-${sectionKey}`);
    if (!section) return;
    $$(".answer-correct, .answer-review", section).forEach((node) => node.classList.remove("answer-correct", "answer-review"));
    $$(".field-feedback", section).forEach((node) => node.remove());
  }

  function markField(id, correct, message, acceptedMessage = "Correct — keep this evidence.") {
    const control = $(`#${id}`) || $(`[name="${id}"]`);
    if (!control) return correct;
    const holder = control.closest("label, fieldset, .two-column-fields, .structured-response-grid") || control.parentElement;
    holder.classList.add(correct ? "answer-correct" : "answer-review");
    const note = document.createElement("small");
    note.className = `field-feedback ${correct ? "correct" : "review"}`;
    note.textContent = correct ? acceptedMessage : message;
    holder.appendChild(note);
    return correct;
  }

  function checkFields(sectionKey, checks) {
    clearFieldChecks(sectionKey);
    state.diagnostics ||= {};
    state.diagnostics[sectionKey] ||= {};
    return checks.map(({ id, correct, hint, acceptedMessage }) => {
      if (!correct) state.diagnostics[sectionKey][id] = (state.diagnostics[sectionKey][id] || 0) + 1;
      return markField(id, Boolean(correct), hint, acceptedMessage);
    });
  }

  function scheduleSave() {
    const status = $("#save-status");
    if (status) status.textContent = "Saving…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveState, 220);
  }

  function saveState() {
    state.meta.lastSaved = new Date().toISOString();
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state));
      const status = $("#save-status");
      if (status) status.textContent = `Saved ${new Date(state.meta.lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch (error) {
      const status = $("#save-status");
      if (status) status.textContent = "Could not save";
    }
  }

  function recordAttempt(section, score, maximum) {
    state.attempts[section] = (state.attempts[section] || 0) + 1;
    state.scores[section] = { score, maximum, updated: new Date().toISOString() };
    state.timestamps[`${section}Attempt`] = new Date().toISOString();
  }

  function getUnlocked() {
    if (teacherMode) return new Set(sectionOrder);
    const unlocked = new Set(["starter"]);
    if (state.completed.starter) unlocked.add("concepts");
    if (state.completed.concepts) unlocked.add("trace");
    if (state.completed.trace) unlocked.add("debug");
    if (state.completed.debug) { unlocked.add("extension"); unlocked.add("plenary"); }
    if (state.completed.plenary) unlocked.add("review");
    return unlocked;
  }

  function completionPercent() {
    const done = coreSections.filter((key) => state.completed[key]).length;
    return Math.round(done / coreSections.length * 100);
  }

  function updateJourney() {
    const unlocked = getUnlocked();
    const percent = completionPercent();
    $("#progress-bar").style.width = `${percent}%`;
    $("#progress-text").textContent = `${percent}% learned`;
    $$(".journey-step").forEach((button) => {
      const key = button.dataset.section;
      const available = unlocked.has(key);
      button.disabled = !available;
      button.classList.toggle("locked", !available);
      button.classList.toggle("complete", Boolean(state.completed[key]));
      const chip = $(`#chip-${key}`);
      if (chip && key !== "extension" && key !== "review") {
        chip.textContent = state.completed[key] ? "Completed" : "Learning";
        chip.classList.toggle("complete", Boolean(state.completed[key]));
      }
      if (chip && key === "extension") {
        const count = getExtensionEvidence().length;
        chip.textContent = count ? `${count} route${count === 1 ? "" : "s"} saved` : "No route saved";
      }
    });
    updateBottomNavigation();
  }

  function updateBottomNavigation() {
    const current = state.meta.currentSection;
    const index = sectionOrder.indexOf(current);
    const unlocked = getUnlocked();
    $("#current-section-label").textContent = sectionTitles[current];
    $("#back-button").disabled = index <= 0;
    let next = sectionOrder[index + 1];
    if (current === "debug" && !state.completed.debug) next = "extension";
    if (current === "extension") next = "plenary";
    $("#next-button").disabled = !next || !unlocked.has(next);
    $("#next-button").dataset.target = next || "";
  }

  function showSection(key, focus = true) {
    if (!getUnlocked().has(key)) return;
    state.meta.currentSection = key;
    $$(".lesson-section").forEach((section) => {
      const active = section.dataset.section === key;
      section.hidden = !active;
      section.classList.toggle("active", active);
    });
    $$(".journey-step").forEach((button) => button.classList.toggle("active", button.dataset.section === key));
    if (key === "extension") updateExtensionPanels();
    if (key === "review") buildReview();
    updateBottomNavigation();
    renderSupport();
    scheduleSave();
    if (focus) {
      $("#lesson-main").focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function markComplete(section) {
    state.completed[section] = true;
    state.timestamps[section] = new Date().toISOString();
    updateJourney();
    scheduleSave();
  }

  function response(id) { return state.responses[id] ?? ""; }

  function displayResponse(id) {
    const value = response(id);
    return responseDisplayMaps[id]?.[value] || value;
  }

  function buildDiagnosticFlags() {
    const flags = [];
    const missed = (section, ids) => ids.some((id) => Number(state.diagnostics?.[section]?.[id] || 0) > 0);
    if (missed("concepts", ["representation-1", "representation-2", "representation-3"])) flags.push("Initially confused at least one of algorithm, source code or running-program behaviour; revisit with one new example.");
    if (missed("trace", ["guided-trace-1", "guided-trace-2", "guided-trace-3", "guided-trace-4", "trace-p1-start", "trace-p1-updated", "trace-p2-total"])) flags.push("Needed correction while updating or recording variable values; begin Week 2 with a short trace table.");
    if (missed("trace", ["trace-condition", "trace-final-output", "trace-explanation"])) flags.push("Needed support linking a Boolean condition to the selected if/else branch.");
    if (missed("debug", ["error-check-1", "error-check-2", "error-check-3"])) flags.push("Needed correction distinguishing syntax, runtime and logic evidence.");
    if (missed("debug", ["debug-strategy-choice", "debug-test-evidence", "debug-explanation"])) flags.push("Needed support explaining controlled debugging: one change, same input, observed result.");
    if (Number(response("confidence-trace") || 3) <= 2) flags.push("Student reports low confidence in tracing; prioritise a worked table in Week 2.");
    if (Number(response("confidence-debug") || 3) <= 2) flags.push("Student reports low confidence using error evidence; provide paired debugging rehearsal.");
    return flags.length ? flags : ["No immediate diagnostic flag: continue to verify understanding through observation and Week 2 retrieval."];
  }

  function bindResponses() {
    $$("[data-save]").forEach((element) => {
      const eventName = element.type === "range" || element.tagName === "SELECT" ? "change" : "input";
      element.addEventListener(eventName, () => {
        state.responses[element.id] = element.value;
        if (element.type === "range") {
          const output = $(`output[for="${element.id}"]`);
          if (output) output.textContent = element.value;
        }
        if (element.id === "cycle-stage") updateCycleStageReminder();
        scheduleSave();
      });
    });
    $$('input[type="radio"]:not([name="entry-language"])').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        state.responses[radio.name] = radio.value;
        if (radio.name === "studio-choice") updateStudioTip();
        if (radio.name === "flash-mode") updateFlashModePanels();
        if (radio.name === "starter-reflection-scenario" || /^scenario-[1-4]$/.test(radio.name)) updateStarterReflectionPrompt();
        scheduleSave();
      });
    });
  }

  function hydrateResponses() {
    $$("[data-save]").forEach((element) => {
      if (Object.prototype.hasOwnProperty.call(state.responses, element.id)) element.value = state.responses[element.id];
      if (element.type === "range") {
        const output = $(`output[for="${element.id}"]`);
        if (output) output.textContent = element.value;
      }
    });
    $$('input[type="radio"]:not([name="entry-language"])').forEach((radio) => {
      if (radio.disabled && !response(radio.name)) return;
      radio.checked = response(radio.name) === radio.value;
    });
    updateStudioTip();
    updateStarterReflectionPrompt();
    updateCycleStageReminder();
    updateFlashModePanels();
    updateEvidencePreview();
    hydrateExtension();
  }

  function feedbackSuffix() {
    const language = state.meta.language;
    if (language === "plain") return " You can change an answer and check again.";
    if (language === "ms") return " Anda boleh membetulkan jawapan dan menyemak semula.";
    if (language === "zh") return " 你可以修改答案后再次检查。";
    if (language === "ko") return " 답을 고친 뒤 다시 확인할 수 있습니다.";
    return " You can correct and check again.";
  }

  function updateStarterReflectionPrompt() {
    const reminder = $("#starter-choice-reminder");
    if (!reminder) return;
    const scenario = response("starter-reflection-scenario");
    if (!scenario) {
      reminder.textContent = "Select the eco-points or online-code scenario to explain your independent choice.";
      return;
    }
    const titles = { "1": "Club-access syntax error", "2": "Eco-points output mismatch", "3": "Classmate is stuck on line 2", "4": "Unfamiliar online greeting code" };
    const moveLabels = {
      "1": { read: "read the error and locate the named line", rerun: "run the unchanged program several times", delete: "delete the program and begin again" },
      "2": { "rerun-only": "rerun the same input and record only the final output", trace: "trace the values line by line", "fix-first": "change the operator before recording evidence" },
      "3": { answer: "type the answer for the classmate", question: "ask what they expected and what happened", ignore: "tell them to skip the task" },
      "4": { "one-run": "run the code once and keep it if a greeting appears", test: "read, test and explain the code before deciding", "output-only": "read only the print line" },
    };
    const selectedMove = response(`scenario-${scenario}`);
    if (!selectedMove) {
      reminder.textContent = `You selected Scenario ${scenario}: ${titles[scenario]}. Return to that card and choose your first move before explaining it.`;
      return;
    }
    reminder.textContent = `You are explaining ${titles[scenario]}. Your first move was to ${moveLabels[scenario][selectedMove]}. Use a specific expected/actual result, input/output or code line as evidence.`;
  }

  function updateFlashModePanels() {
    const mode = response("flash-mode");
    const typed = $("#flash-typed-panel");
    const paper = $("#flash-paper-panel");
    if (typed) typed.hidden = mode !== "typed";
    if (paper) paper.hidden = mode !== "paper";
  }

  function updateCycleStageReminder() {
    const reminder = $("#cycle-stage-reminder");
    if (!reminder) return;
    const stage = response("cycle-stage");
    const guidance = {
      understand: "Understand means identifying the required inputs, outputs and rules before planning a solution.",
      plan: "Plan means writing the ordered steps or algorithm before translating them into code.",
      predict: "Predict means recording the result you expect before running, so you have something exact to compare.",
      run: "Run means executing the code with a chosen test and observing its actual behaviour.",
      check: "Check means comparing expected and actual results and locating where they first differ.",
      improve: "Improve means making one evidence-based change, explaining why, and testing again.",
    };
    reminder.textContent = stage ? `${guidance[stage]} Use expected 25, actual 15 and the calculation operator as evidence.` : "Complete the charity-points investigation, then choose the stage that locates the fault.";
  }

  function submitStarter() {
    const scenario = response("starter-reflection-scenario");
    const evidence = response("starter-evidence");
    const steps = response("starter-steps");
    const evidenceSpecific = hasMeaningfulResponse(evidence, { minWords: 3, minChars: 10 });
    const stepsUseful = hasMeaningfulResponse(steps, { minWords: 5, minChars: 18 });
    const writingAccepted = "Response recorded — your own wording is accepted for teacher review.";
    const checks = [
      { id: "scenario-2", correct: response("scenario-2") === "trace", hint: "Choose the move that compares the rule, expected result and changing values." },
      { id: "scenario-4", correct: response("scenario-4") === "test", hint: "Choose the move that helps you understand the input, output and each line before use." },
      { id: "starter-reflection-scenario", correct: scenario === "2" || scenario === "4", hint: "Choose one of the two independent scenarios to explain." },
      { id: "starter-evidence", correct: evidenceSpecific, hint: "Write a short but complete idea about the evidence you would inspect. Use your own words; no exact keyword is required.", acceptedMessage: writingAccepted },
      { id: "starter-steps", correct: stepsUseful, hint: "Explain what you would do and what you hope to learn from it. Use your own words; no exact keyword is required.", acceptedMessage: writingAccepted },
    ];
    const results = checkFields("starter", checks);
    const score = results.filter(Boolean).length;
    recordAttempt("starter", score, checks.length);
    if (score !== checks.length) {
      scheduleSave();
      return setFeedback($("#starter-feedback"), `You have ${score}/${checks.length} secure checks. Correct the highlighted part, then check again. The hint explains what evidence is missing.`, "warning");
    }
    markComplete("starter");
    setFeedback($("#starter-feedback"), "Secure: both first moves collect evidence, and your explanation connects a specific clue to a useful next action.", "success");
  }

  function submitConcepts() {
    const answers = {
      "representation-1": "behaviour", "representation-2": "algorithm", "representation-3": "source",
      "cycle-understand-rule": "add", "cycle-plan-order": "input-calculate-output", "cycle-predict": "25", "cycle-run-actual": "15", "cycle-check": "operator",
    };
    const hints = {
      "representation-1": "This describes what appears when the program runs.", "representation-2": "This is an ordered plan written in words.", "representation-3": "This uses programming-language syntax.",
      "cycle-understand-rule": "The brief says the participation bonus is added.", "cycle-plan-order": "Data must be received before it can be calculated and displayed.", "cycle-predict": "Use the requirement: 20 points plus 5 bonus.", "cycle-run-actual": "Record what the current subtraction program actually produces.", "cycle-check": "Find the first code feature that makes 25 become 15.",
    };
    const checks = Object.entries(answers).map(([id, answer]) => ({ id, correct: response(id) === answer, hint: hints[id] }));
    checks.push({ id: "cycle-improve-line", correct: normalise(response("cycle-improve-line")).replace(/\s+/g, "") === "total=points+bonus", hint: "Change only the calculation so it adds the named variables." });
    checks.push({ id: "cycle-stage", correct: response("cycle-stage") === "check", hint: "Which stage compares expected 25 with actual 15 and then locates the difference?" });
    const cycleEvidence = response("cycle-evidence");
    checks.push({ id: "cycle-evidence", correct: hasMeaningfulResponse(cycleEvidence, { minWords: 5, minChars: 18 }), hint: "Explain why your chosen stage helped to find the fault. Use your own words; no exact keyword is required.", acceptedMessage: "Explanation recorded — your teacher can review your reasoning." });
    const results = checkFields("concepts", checks);
    const score = results.filter(Boolean).length;
    recordAttempt("concepts", score, checks.length);
    if (score !== checks.length) {
      scheduleSave();
      return setFeedback($("#concepts-feedback"), `${score}/${checks.length} checks are secure. Use the highlighted clues to correct only the uncertain parts, then check again.`, "warning");
    }
    markComplete("concepts");
    setFeedback($("#concepts-feedback"), "Secure: you distinguished plan, source code and behaviour, then used expected and actual evidence to improve one calculation.", "success");
  }

  function submitTrace() {
    const guided = { "guided-trace-1": "3", "guided-trace-2": "5", "guided-trace-3": "10", "guided-trace-4": "10" };
    const coreAnswers = {
      ...guided, "trace-p1-start": "8", "trace-p1-updated": "5", "trace-p1-output": "5",
      "trace-p2-tickets": "4", "trace-p2-price": "3", "trace-p2-total": "12", "trace-p2-output": "12",
      "trace-final-score": "9", "trace-condition": "true",
    };
    const checks = Object.entries(coreAnswers).map(([id, answer]) => ({ id, correct: normalise(response(id)) === answer, hint: `Re-read the named line and record the newest value before moving on.` }));
    checks.push({ id: "trace-final-output", correct: /level up/i.test(response("trace-final-output")), hint: "Use the message assigned inside the true branch." });
    checks.push({ id: "trace-explanation", correct: hasMeaningfulResponse(response("trace-explanation"), { minWords: 5, minChars: 18 }), hint: "Explain in a complete thought why the program follows that branch. Use your own words; the score and condition are checked separately above.", acceptedMessage: "Explanation recorded — your own wording is accepted for teacher review." });
    const results = checkFields("trace", checks);
    let score = results.filter(Boolean).length;
    let maximum = checks.length;
    const p4Attempted = hasText(response("trace-p4-output")) || hasText(response("trace-p4-path"));
    if (p4Attempted) {
      maximum += 2;
      if (response("trace-p4-output") === "10") score++;
      if (/2\D+6\D+10/.test(response("trace-p4-path"))) score++;
    }
    const p5Attempted = hasText(response("trace-p5-score")) || hasText(response("trace-p5-output")) || hasText(response("trace-p5-explanation"));
    if (p5Attempted) {
      maximum += 3;
      if (normalise(response("trace-p5-score")) === "9") score++;
      if (/challenge unlocked/i.test(response("trace-p5-output"))) score++;
      if (/(9|nine)/i.test(response("trace-p5-explanation")) && /(true|greater|equal|>=)/i.test(response("trace-p5-explanation"))) score++;
    }
    recordAttempt("trace", score, maximum);
    const coreSecure = results.every(Boolean);
    if (!coreSecure) {
      scheduleSave();
      return setFeedback($("#trace-feedback"), `${results.filter(Boolean).length}/${checks.length} core trace checks are secure. Correct each highlighted row before continuing; later values depend on earlier ones.`, "warning");
    }
    markComplete("trace");
    setFeedback($("#trace-feedback"), `Core trace secure: ${checks.length}/${checks.length}. You recorded intermediate values and justified the selected branch${maximum > checks.length ? `; stretch score ${score - checks.length}/${maximum - checks.length}` : ""}.`, "success");
  }

  function submitDebug() {
    const answers = {
      "error-check-1": "syntax", "error-check-2": "runtime", "error-check-3": "logic",
      "debug-type": "syntax", "debug-line": "5", "debug-action": "colon",
      "debug-logic-line": "3", "debug-strategy-choice": "b",
    };
    const hints = {
      "error-check-1": "Python reports a grammar problem before the program can run.", "error-check-2": "The code begins, but division by zero fails during execution.", "error-check-3": "The code runs; compare expected £15 with actual £25.",
      "debug-type": "The message explicitly says SyntaxError.", "debug-line": "Use the line number named by Python.", "debug-action": "Make the smallest change that matches ‘expected colon’.", "debug-logic-line": "Locate the line where subtraction should happen.", "debug-strategy-choice": "Choose the attempt that changes one factor while keeping the input and other lines the same.",
    };
    const checks = Object.entries(answers).map(([id, answer]) => ({ id, correct: response(id) === answer, hint: hints[id] }));
    checks.push({ id: "debug-logic-fix", correct: normalise(response("debug-logic-fix")).replace(/\s+/g, "") === "final=price-discount", hint: "Write the full assignment using subtraction: final = …" });
    const evidence = response("debug-test-evidence");
    checks.push({ id: "debug-test-evidence", correct: hasMeaningfulResponse(evidence, { minWords: 6, minChars: 22 }), hint: "Describe what changed, what stayed the same and what happened. Use your own words; no exact keyword is required.", acceptedMessage: "Test record accepted — your teacher can review the detail in your report." });
    const explanation = response("debug-explanation");
    checks.push({ id: "debug-explanation", correct: hasMeaningfulResponse(explanation, { minWords: 5, minChars: 18 }), hint: "Write a complete conclusion about what the test result suggests. Use your own words; no exact keyword is required.", acceptedMessage: "Conclusion recorded — your own wording is accepted for teacher review." });
    const results = checkFields("debug", checks);
    const score = results.filter(Boolean).length;
    recordAttempt("debug", score, checks.length);
    if (score !== checks.length) {
      scheduleSave();
      return setFeedback($("#debug-feedback"), `${score}/${checks.length} debugging checks are secure. Correct the highlighted diagnosis or evidence statement, then check again.`, "warning");
    }
    markComplete("debug");
    setFeedback($("#debug-feedback"), "Secure: you classified three forms of evidence, corrected focused lines and justified a controlled one-change test.", "success");
  }

  function selectedExtensionRoutes() {
    return [...new Set(state.extension.selected || [])];
  }

  function getExtensionEvidence() {
    const selected = new Set(selectedExtensionRoutes());
    const evidence = [];
    const checked = Object.keys(state.extension.quiz.checked || {}).filter((key) => state.extension.quiz.checked[key]);
    if (selected.has("quiz") && checked.length) {
      const correct = checked.filter((key) => Number(state.extension.quiz.answers[key]) === extensionQuiz[Number(key)].answer).length;
      evidence.push({ id: "quiz", title: "Quiz Quest", detail: `${correct}/${checked.length} correct from ${checked.length} checked (${extensionQuiz.length} available)`, checked: checked.length, correct });
    }
    const pairs = [1, 2, 3, 4].filter((n) => hasText(response(`ext-flash-${n}-front`), 4) && hasText(response(`ext-flash-${n}-back`), 8));
    const paper = response("flash-mode") === "paper" && (hasText(response("ext-paper-summary"), 35) || Boolean(state.extension.paperImageData));
    const typed = response("flash-mode") === "typed" && pairs.length === 4;
    if (selected.has("flash") && (typed || paper)) evidence.push({ id: "flash", title: "Flashcard Forge", detail: paper ? "Paper evidence recorded" : `${pairs.length} complete digital cards`, pairs, paper });
    const algorithmReady = hasText(response("ext-algorithm-plan"), 35) && (hasText(response("ext-algorithm-test1"), 8) || hasText(response("ext-algorithm-test2"), 8));
    if (selected.has("algorithm") && algorithmReady) evidence.push({ id: "algorithm", title: "Algorithm Architect", detail: `${[response("ext-algorithm-test1"), response("ext-algorithm-test2")].filter((v) => hasText(v, 8)).length} test case(s) recorded` });
    const codeChanged = String(state.python.code || "").trim() !== starterPython.trim();
    const pythonReadyForReport = codeChanged && state.python.runCount > 0 && hasText(response("python-goal"), 5) && hasText(response("python-change"), 5) && hasText(response("python-test"), 5);
    if (selected.has("python") && pythonReadyForReport) evidence.push({ id: "python", title: "Python Builder", detail: `${state.python.runCount} run(s), code and reflection recorded` });
    return evidence;
  }

  function updateExtensionPanels() {
    const selected = new Set(selectedExtensionRoutes());
    $$('[data-extension-route]').forEach((input) => { input.checked = selected.has(input.dataset.extensionRoute); });
    $$('[data-route-panel]').forEach((panel) => { panel.hidden = !selected.has(panel.dataset.routePanel); });
    if (selected.has("python")) ensureEditor();
    const count = getExtensionEvidence().length;
    const chip = $("#chip-extension");
    if (chip) chip.textContent = count ? `${count} route${count === 1 ? "" : "s"} saved` : "No route saved";
  }

  function hydrateExtension() {
    updateExtensionPanels();
    renderQuizQuestion();
    updateExtensionImagePreview();
  }

  function renderQuizQuestion() {
    const card = $("#quiz-question-card");
    if (!card) return;
    const index = Math.max(0, Math.min(extensionQuiz.length - 1, Number(state.extension.quiz.current) || 0));
    state.extension.quiz.current = index;
    const item = extensionQuiz[index];
    const chosen = state.extension.quiz.answers[index];
    const checked = Boolean(state.extension.quiz.checked[index]);
    card.innerHTML = `<h4>${index + 1}. ${escapeHtml(item.question)}</h4>${item.options.map((option, optionIndex) => `<label class="quiz-option ${checked && optionIndex === item.answer ? "correct" : ""} ${checked && Number(chosen) === optionIndex && optionIndex !== item.answer ? "incorrect" : ""}"><input type="radio" name="extension-quiz-answer" value="${optionIndex}" ${Number(chosen) === optionIndex ? "checked" : ""}> ${escapeHtml(option)}</label>`).join("")}`;
    $$('input[name="extension-quiz-answer"]', card).forEach((radio) => radio.addEventListener("change", () => {
      state.extension.quiz.answers[index] = Number(radio.value);
      delete state.extension.quiz.checked[index];
      setFeedback($("#quiz-feedback"), "Answer selected. Press Check answer to reveal the explanation and record this checkpoint.", "info");
      scheduleSave();
    }));
    const checkedKeys = Object.keys(state.extension.quiz.checked).filter((key) => state.extension.quiz.checked[key]);
    const correct = checkedKeys.filter((key) => Number(state.extension.quiz.answers[key]) === extensionQuiz[Number(key)].answer).length;
    $("#quiz-progress-text").textContent = `Question ${index + 1} of ${extensionQuiz.length}`;
    $("#quiz-score").textContent = `${checkedKeys.length} checked · ${correct} correct`;
    $("#quiz-progress-bar").style.width = `${checkedKeys.length / extensionQuiz.length * 100}%`;
    $("#quiz-previous").disabled = index === 0;
    $("#quiz-next").disabled = index === extensionQuiz.length - 1;
    if (checked) setFeedback($("#quiz-feedback"), `${Number(chosen) === item.answer ? "Correct. " : `Not yet. The best answer is “${item.options[item.answer]}”. `}${item.explanation}`, Number(chosen) === item.answer ? "success" : "info");
    else setFeedback($("#quiz-feedback"), "Choose one answer, then check it.", "info");
  }

  function checkQuizAnswer() {
    const index = state.extension.quiz.current;
    if (!Object.prototype.hasOwnProperty.call(state.extension.quiz.answers, index)) return setFeedback($("#quiz-feedback"), "Choose an answer before checking.", "warning");
    state.extension.quiz.checked[index] = true;
    renderQuizQuestion();
    scheduleSave();
  }

  function submitExtensionEvidence() {
    const selected = selectedExtensionRoutes();
    if (!selected.length) return setFeedback($("#extension-feedback"), "Choose at least one extension route, or continue to the plenary without one.", "warning");
    const evidence = getExtensionEvidence();
    if (!evidence.length) return setFeedback($("#extension-feedback"), "Your chosen route does not yet contain enough evidence. Quiz: check one answer. Flashcards: complete all four typed cards, or record a detailed paper summary/photo. Algorithm: write a plan and one test. Python: change and run the starter, then complete all three reflections.", "warning");
    state.extension.submitted = evidence.map((item) => item.id);
    state.completed.extension = true;
    updateJourney();
    scheduleSave();
    setFeedback($("#extension-feedback"), `Saved: ${evidence.map((item) => item.title).join(", ")}. Only these attempted routes will appear in the review and report.`, "success");
  }

  function submitPythonEvidence() {
    if (editor) state.python.code = editor.getValue();
    const complete = hasText(response("python-goal"), 5) && hasText(response("python-change"), 5) && hasText(response("python-test"), 5);
    if (!complete) return setFeedback($("#python-feedback"), "Record your goal, one change and one test before saving the optional evidence.", "warning");
    if (String(state.python.code || "").trim() === starterPython.trim()) return setFeedback($("#python-feedback"), "Change the starter code before saving. Untouched starter code is not evidence of your work.", "warning");
    if (state.python.runCount < 1) return setFeedback($("#python-feedback"), "Run your changed program at least once so your report shows that you tested it.", "warning");
    state.python.submitted = true;
    scheduleSave();
    updateExtensionPanels();
    setFeedback($("#python-feedback"), "Python work is ready. Use “Save chosen extension evidence” below to add this route to your report.", "success");
  }

  function submitPlenary() {
    const answers = { "plenary-q1": "plan", "plenary-q2": "follow", "plenary-q3": "read" };
    const hints = {
      "plenary-q1": "An algorithm is the plan; source code is one implementation of it.",
      "plenary-q2": "Tracing records the computer’s steps and newest values.",
      "plenary-q3": "Begin with evidence before editing code.",
    };
    const checks = Object.entries(answers).map(([id, answer]) => ({ id, correct: response(id) === answer, hint: hints[id] }));
    checks.push({ id: "next-target", correct: hasText(response("next-target")), hint: "Choose the skill that most needs your next practice." });
    const action = response("target-action");
    checks.push({ id: "target-action", correct: hasMeaningfulResponse(action, { minWords: 4, minChars: 14 }), hint: "Write one complete action you could realistically try next lesson. Use your own words; no exact keyword is required.", acceptedMessage: "Personal target recorded — your teacher can review it in the report." });
    const results = checkFields("plenary", checks);
    const score = results.filter(Boolean).length;
    recordAttempt("plenary", score, checks.length);
    if (score !== checks.length) {
      scheduleSave();
      return setFeedback($("#plenary-feedback"), `${score}/${checks.length} exit checks are secure. Correct the highlighted retrieval answer or make your target action more specific.`, "warning");
    }
    markComplete("plenary");
    setFeedback($("#plenary-feedback"), "Plenary complete: your retrieval answers, confidence and a specific next action are ready for your teacher.", "success");
  }

  function renderSupport() {
    const language = state.meta.language || "none";
    $("#support-language").value = language;
    $$(".language-support").forEach((box) => {
      const data = supportContent[language]?.[box.dataset.supportKey];
      if (!data) { box.hidden = true; box.innerHTML = ""; return; }
      box.hidden = false;
      box.setAttribute("lang", language === "ms" ? "ms" : language === "zh" ? "zh-CN" : language === "ko" ? "ko" : "en");
      box.innerHTML = `<h3>${escapeHtml(data[0])}</h3><p>${escapeHtml(data[1])}</p><p><strong>Task steps:</strong> ${escapeHtml(data[2])}</p><p class="support-frame"><strong>Sentence frame:</strong> ${escapeHtml(data[3])}</p>`;
    });
    populateGlossary();
  }

  function populateGlossary() {
    const language = state.meta.language || "none";
    $("#glossary-intro").textContent = language === "none"
      ? "Use the English definitions to check technical vocabulary."
      : `English terms stay visible. Additional support: ${supportNames[language]}.`;
    $("#glossary-list").innerHTML = glossary.map(([term, definition, translations]) => {
      const extra = translations[language];
      return `<article class="glossary-item"><strong>${escapeHtml(term)}</strong><span>${escapeHtml(definition)}</span>${extra ? `<small lang="${language}">${escapeHtml(extra)}</small>` : ""}</article>`;
    }).join("");
  }

  function updateEntryPreview() {
    const language = $('input[name="entry-language"]:checked')?.value || "none";
    const box = $("#entry-support-preview");
    const preview = supportContent[language]?.preview;
    box.hidden = !preview;
    box.textContent = preview || "";
  }

  function updateStudioTip() {
    const tips = {
      greeting: "Small tip: add one new input, store it in a meaningful variable, then include it in an output.",
      decision: "Small tip: decide the exact condition before writing the if statement.",
      quiz: "Small tip: store the user's answer, then compare it with one expected answer.",
      own: "Small tip: write your goal in one sentence before adding code.",
    };
    $("#studio-tip").textContent = tips[response("studio-choice")] || "Choose an idea to reveal one small starting tip.";
  }

  function updateHeader() {
    $("#header-student").textContent = state.meta.name || "Student";
    $("#header-class").textContent = state.meta.className || "Class";
    $("#teacher-badge").hidden = !teacherMode;
    document.body.classList.toggle("teacher-mode", teacherMode);
  }

  function initEntry() {
    const overlay = $("#entry-overlay");
    const resume = $("#resume-button");
    if (queryTeacher) {
      teacherMode = true;
      state.meta.teacher = true;
      state.meta.name ||= "Teacher Preview";
      state.meta.className ||= "Preview";
      overlay.hidden = true;
      updateHeader();
      return;
    }
    if (state.meta.name && !state.meta.teacher) {
      $("#student-name").value = state.meta.name;
      $("#student-class").value = state.meta.className;
      const selected = $(`input[name="entry-language"][value="${state.meta.language || "none"}"]`);
      if (selected) selected.checked = true;
      resume.classList.remove("hidden");
    }
    $$('input[name="entry-language"]').forEach((radio) => radio.addEventListener("change", updateEntryPreview));
    updateEntryPreview();
    $("#entry-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#student-name").value.trim();
      const className = $("#student-class").value.trim();
      const isTeacherEntry = normalise(name) === "teacher";
      $("#name-error").textContent = name ? "" : "Enter your name.";
      $("#class-error").textContent = className || isTeacherEntry ? "" : "Enter your class.";
      if (!name || (!className && !isTeacherEntry)) return;
      const selectedLanguage = $('input[name="entry-language"]:checked')?.value || "none";
      if (isTeacherEntry) {
        teacherMode = true;
        const teacherSaved = (() => { try { return JSON.parse(localStorage.getItem(TEACHER_KEY)); } catch (_) { return null; } })();
        state = mergeState(teacherSaved);
        state.meta.teacher = true;
        state.meta.name = "Teacher Preview";
        state.meta.className = className || "Preview";
        state.meta.language = selectedLanguage;
      } else {
        state.meta.name = name;
        state.meta.className = className;
        state.meta.language = selectedLanguage;
        state.meta.teacher = false;
      }
      overlay.hidden = true;
      updateHeader();
      hydrateResponses();
      renderSupport();
      updateJourney();
      showSection(teacherMode ? "starter" : (state.meta.currentSection || "starter"));
      saveState();
    });
    resume.addEventListener("click", () => {
      overlay.hidden = true;
      updateHeader();
      renderSupport();
      updateJourney();
      showSection(state.meta.currentSection || "starter");
    });
  }

  function updateEvidencePreview() {
    const preview = $("#evidence-preview");
    const remove = $("#remove-evidence-image");
    if (state.evidence.imageData) {
      preview.src = state.evidence.imageData;
      preview.hidden = false;
      remove.hidden = false;
    } else {
      preview.removeAttribute("src");
      preview.hidden = true;
      remove.hidden = true;
    }
  }

  function handleEvidenceImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return setFeedback($("#image-feedback"), "Choose an image smaller than 10 MB.", "warning");
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 1200;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        state.evidence.imageData = canvas.toDataURL("image/jpeg", .72);
        state.evidence.imageName = file.name;
        updateEvidencePreview();
        scheduleSave();
        setFeedback($("#image-feedback"), "Evidence image saved and compressed for the report.", "success");
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function updateExtensionImagePreview() {
    const preview = $("#extension-image-preview");
    const remove = $("#remove-extension-image");
    if (!preview || !remove) return;
    if (state.extension.paperImageData) {
      preview.src = state.extension.paperImageData;
      preview.hidden = false;
      remove.hidden = false;
    } else {
      preview.removeAttribute("src");
      preview.hidden = true;
      remove.hidden = true;
    }
  }

  function handleExtensionImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return setFeedback($("#extension-image-feedback"), "Choose an image smaller than 10 MB.", "warning");
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        state.extension.paperImageData = canvas.toDataURL("image/jpeg", .72);
        state.extension.paperImageName = file.name;
        updateExtensionImagePreview();
        scheduleSave();
        setFeedback($("#extension-image-feedback"), "Paper evidence saved and compressed for the report.", "success");
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function skillStatus(section, threshold = .7) {
    const result = state.scores[section];
    if (!result) return ["Not yet checked", "developing"];
    const ratio = result.maximum ? result.score / result.maximum : 0;
    return ratio >= threshold ? [`${result.score}/${result.maximum} secure`, "secure"] : [`${result.score}/${result.maximum} developing`, "developing"];
  }

  function buildReview() {
    const definitions = [
      ["Decision-making habits", "starter", "Chooses evidence-seeking first moves"],
      ["Algorithm → program concepts", "concepts", "Distinguishes plan, code and behaviour"],
      ["Tracing", "trace", "Updates and records values line by line"],
      ["Debugging", "debug", "Uses error evidence and one focused change"],
      ["Retrieval", "plenary", "Recalls the lesson’s central ideas"],
    ];
    const coreCards = definitions.map(([title, section, description]) => {
      const [status, statusClass] = skillStatus(section);
      const attempts = state.attempts[section] || 0;
      return `<article class="review-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span><small>Attempts: ${attempts}</small><span class="status ${statusClass}">${escapeHtml(status)}</span></article>`;
    }).join("") + `<article class="review-card"><strong>Language support</strong><span>${escapeHtml(supportNames[state.meta.language] || "English only")}</span><small>Same learning objectives retained</small><span class="status secure">Recorded</span></article>`;
    const extensionCards = getExtensionEvidence().map((item) => `<article class="review-card"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span><small>Optional extension selected and attempted</small><span class="status secure">Included</span></article>`).join("");
    const diagnosticCards = `<article class="review-card diagnostic-card"><strong>Teacher diagnostic flags</strong><span>${buildDiagnosticFlags().map((flag) => `• ${escapeHtml(flag)}`).join("<br>")}</span><small>Generated from checked responses and self-reported confidence</small><span class="status developing">Planning note</span></article>`;
    $("#review-summary").innerHTML = coreCards + extensionCards + diagnosticCards;
    const missing = coreSections.filter((section) => !state.completed[section]);
    $("#incomplete-warnings").innerHTML = missing.length
      ? `<div class="feedback warning"><strong>Incomplete core sections:</strong> ${missing.map((key) => escapeHtml(sectionTitles[key])).join(", ")}. The report can still show attempts, but complete these before submitting.</div>`
      : '<div class="feedback success">All core learning sections are complete. Review your evidence and download the report.</div>';
  }

  class CanvasReport {
    constructor() {
      const { jsPDF } = window.jspdf;
      this.doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
      this.pages = [];
      this.canvas = document.createElement("canvas");
      this.canvas.width = 1240;
      this.canvas.height = 1754;
      this.ctx = this.canvas.getContext("2d");
      this.margin = 78;
      this.y = this.margin;
      this.pageNumber = 1;
      this.resetPage();
    }
    resetPage() {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#111111";
      this.ctx.textBaseline = "top";
      this.y = this.margin;
    }
    font(size = 28, weight = 400, mono = false) {
      this.ctx.font = `${weight} ${size}px ${mono ? "monospace" : "Arial, sans-serif"}`;
    }
    wrap(text, maxWidth) {
      const lines = [];
      String(text ?? "—").split("\n").forEach((paragraph) => {
        if (!paragraph) { lines.push(""); return; }
        const words = /\s/.test(paragraph) ? paragraph.split(/\s+/) : Array.from(paragraph);
        let line = "";
        words.forEach((word) => {
          const separator = /\s/.test(paragraph) && line ? " " : "";
          const test = line + separator + word;
          if (line && this.ctx.measureText(test).width > maxWidth) { lines.push(line); line = word; }
          else line = test;
        });
        lines.push(line);
      });
      return lines;
    }
    ensure(height) {
      if (this.y + height > this.canvas.height - this.margin) this.commitPage();
    }
    text(text, options = {}) {
      const size = options.size || 28;
      const weight = options.weight || 400;
      const color = options.color || "#111111";
      const mono = Boolean(options.mono);
      const indent = options.indent || 0;
      const gap = options.gap ?? 10;
      this.font(size, weight, mono);
      const lines = this.wrap(text, this.canvas.width - this.margin * 2 - indent);
      const height = lines.length * (size * 1.32) + gap;
      this.ensure(height);
      this.ctx.fillStyle = color;
      lines.forEach((line, index) => this.ctx.fillText(line, this.margin + indent, this.y + index * size * 1.32));
      this.y += height;
    }
    heading(text, level = 1) {
      const settings = level === 1 ? [52, 800, "#111111", 20] : level === 2 ? [36, 800, "#087f78", 14] : [29, 800, "#2457a6", 10];
      this.text(text, { size: settings[0], weight: settings[1], color: settings[2], gap: settings[3] });
    }
    rule() {
      this.ensure(24);
      this.ctx.fillStyle = "#111111";
      this.ctx.fillRect(this.margin, this.y, this.canvas.width - this.margin * 2, 4);
      this.y += 24;
    }
    code(text) {
      const size = 23;
      this.font(size, 400, true);
      const lines = this.wrap(text || "# No Python Studio code submitted", this.canvas.width - this.margin * 2 - 32);
      const height = lines.length * (size * 1.35) + 34;
      this.ensure(height);
      this.ctx.fillStyle = "#eef1f4";
      this.ctx.fillRect(this.margin, this.y, this.canvas.width - this.margin * 2, height);
      this.ctx.fillStyle = "#111820";
      lines.forEach((line, i) => this.ctx.fillText(line, this.margin + 16, this.y + 15 + i * size * 1.35));
      this.y += height + 12;
    }
    commitPage() {
      this.pages.push(this.canvas.toDataURL("image/jpeg", .9));
      this.pageNumber++;
      this.resetPage();
    }
    async image(dataUrl, caption) {
      const image = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = dataUrl; });
      const maxWidth = this.canvas.width - this.margin * 2;
      const width = Math.min(maxWidth, image.width);
      const height = Math.min(650, image.height * width / image.width);
      this.ensure(height + 70);
      this.ctx.drawImage(image, this.margin, this.y, width, height);
      this.y += height + 8;
      this.text(caption, { size: 20, color: "#5f6368" });
    }
    finish() {
      this.commitPage();
      this.pages.forEach((page, index) => {
        if (index > 0) this.doc.addPage();
        this.doc.addImage(page, "JPEG", 0, 0, 210, 297, undefined, "FAST");
      });
      return this.doc;
    }
  }

  async function makePdf() {
    if (!window.jspdf?.jsPDF) throw new Error("The PDF library did not load.");
    const report = new CanvasReport();
    report.heading("Year 9 Code Quest", 1);
    report.text("Week 1 Theory — Learning Evidence Report", { size: 31, weight: 700 });
    report.rule();
    report.text(`Student: ${state.meta.name}\nClass: ${state.meta.className}\nLanguage support: ${supportNames[state.meta.language] || "English only"}\nStarted: ${new Date(state.meta.dateStarted).toLocaleString()}\nExported: ${new Date().toLocaleString()}`, { size: 25 });
    report.heading("Learning focus", 2);
    report.text("WAGBA: Explain how an algorithm becomes a program, then trace and debug short Python examples using a systematic approach.");
    report.text("Knowledge: algorithm, source code, program, variable, assignment, tracing, and syntax/runtime/logic errors.");
    report.text("Skills: compare representations, trace values, use error evidence and explain a sensible next step.");
    report.heading("Skill overview", 2);
    ["starter", "concepts", "trace", "debug", "plenary"].forEach((section) => {
      const result = state.scores[section];
      report.text(`${sectionTitles[section]}: ${result ? `${result.score}/${result.maximum}` : "not checked"} · attempts ${state.attempts[section] || 0} · ${state.completed[section] ? "completed" : "incomplete"}`, { size: 25 });
    });
    report.heading("Student responses", 2);
    const extensionResponseIds = new Set(["studio-choice", "python-goal", "python-change", "python-test", "flash-mode", "ext-paper-summary", "ext-algorithm-inputs", "ext-algorithm-outputs", "ext-algorithm-plan", "ext-algorithm-test1", "ext-algorithm-test2", "ext-algorithm-improvement", ...[1,2,3,4].flatMap((n) => [`ext-flash-${n}-front`, `ext-flash-${n}-back`])]);
    Object.keys(responseLabels).forEach((id) => {
      if (extensionResponseIds.has(id)) return;
      if (!hasText(response(id))) return;
      report.heading(responseLabels[id], 3);
      report.text(displayResponse(id), { size: 24 });
    });
    const extensionEvidence = getExtensionEvidence();
    if (extensionEvidence.length) {
      report.heading("Selected extension work", 2);
      for (const item of extensionEvidence) {
        report.heading(`${item.title} — ${item.detail}`, 3);
        if (item.id === "quiz") {
          const checkedKeys = Object.keys(state.extension.quiz.checked).filter((key) => state.extension.quiz.checked[key]).sort((a,b) => Number(a) - Number(b));
          checkedKeys.forEach((key) => {
            const q = extensionQuiz[Number(key)];
            const chosen = q.options[Number(state.extension.quiz.answers[key])] || "No answer";
            report.text(`${Number(key) + 1}. ${q.question}\nStudent answer: ${chosen}`, { size: 22 });
          });
        }
        if (item.id === "flash") {
          if (response("flash-mode") === "typed") [1,2,3,4].forEach((n) => {
            if (hasText(response(`ext-flash-${n}-front`)) && hasText(response(`ext-flash-${n}-back`))) report.text(`Card ${n}: ${response(`ext-flash-${n}-front`)}\nBack: ${response(`ext-flash-${n}-back`)}`, { size: 22 });
          });
          if (response("flash-mode") === "paper" && hasText(response("ext-paper-summary"))) report.text(`Paper summary: ${response("ext-paper-summary")}`, { size: 22 });
          if (response("flash-mode") === "paper" && state.extension.paperImageData) await report.image(state.extension.paperImageData, `Flashcard/paper evidence: ${state.extension.paperImageName || "student evidence"}`);
        }
        if (item.id === "algorithm") {
          [["Inputs", "ext-algorithm-inputs"], ["Outputs", "ext-algorithm-outputs"], ["Algorithm / pseudocode", "ext-algorithm-plan"], ["Test 1", "ext-algorithm-test1"], ["Test 2", "ext-algorithm-test2"], ["Improvement", "ext-algorithm-improvement"]].forEach(([label, id]) => { if (hasText(response(id))) report.text(`${label}:\n${response(id)}`, { size: 22, mono: id === "ext-algorithm-plan" }); });
        }
        if (item.id === "python") {
          report.text(`Chosen idea: ${response("studio-choice") || "Own idea"}\nRuns: ${state.python.runCount}\nGoal: ${response("python-goal")}\nChange: ${response("python-change")}\nTest: ${response("python-test")}\nLatest output: ${state.python.output || "—"}`, { size: 22 });
          report.code(state.python.code);
        }
      }
    }
    if (state.evidence.imageData) await report.image(state.evidence.imageData, `Optional evidence image: ${state.evidence.imageName || "student evidence"}`);
    report.heading("Teacher planning information", 2);
    report.text(`Confidence — concepts: ${response("confidence-concepts") || 3}/5; tracing: ${response("confidence-trace") || 3}/5; debugging: ${response("confidence-debug") || 3}/5.`);
    report.text(`Next target: ${response("next-target") || "—"}\nNext action: ${response("target-action") || "—"}`);
    report.heading("Diagnostic flags for Week 2", 3);
    buildDiagnosticFlags().forEach((flag) => report.text(`• ${flag}`, { size: 23 }));
    report.text("This Week 1 evidence is diagnostic and should be interpreted alongside observation and future work.", { size: 21, color: "#5f6368" });
    return report.finish();
  }

  async function downloadPdf() {
    const status = $("#export-status");
    try {
      setFeedback(status, "Building your report…", "info");
      const doc = await makePdf();
      const filename = `Year9_${safeFilePart(state.meta.className)}_${safeFilePart(state.meta.name)}_Week1_Theory.pdf`;
      doc.save(filename);
      setFeedback(status, "Summary PDF downloaded. Open it once before uploading to Microsoft Teams.", "success");
    } catch (error) {
      setFeedback(status, `PDF export failed: ${error.message}. Use the print-friendly fallback.`, "error");
    }
  }

  async function downloadBundle() {
    const status = $("#export-status");
    if (!window.JSZip) return setFeedback(status, "The ZIP library did not load.", "error");
    try {
      setFeedback(status, "Building the evidence ZIP…", "info");
      const doc = await makePdf();
      const base = `Year9_${safeFilePart(state.meta.className)}_${safeFilePart(state.meta.name)}_Week1_Theory`;
      const zip = new JSZip();
      zip.file(`${base}.pdf`, doc.output("blob"));
      if (getExtensionEvidence().some((item) => item.id === "python")) zip.file("python_studio.py", state.python.code);
      zip.file("learning_evidence.json", JSON.stringify(state, null, 2));
      if (state.evidence.imageData) {
        const blob = await (await fetch(state.evidence.imageData)).blob();
        zip.file("optional_evidence.jpg", blob);
      }
      if (getExtensionEvidence().some((item) => item.id === "flash") && state.extension.paperImageData) {
        const extensionBlob = await (await fetch(state.extension.paperImageData)).blob();
        zip.file("extension_paper_evidence.jpg", extensionBlob);
      }
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${base}_Evidence.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1200);
      setFeedback(status, "Evidence ZIP downloaded.", "success");
    } catch (error) {
      setFeedback(status, `ZIP export failed: ${error.message}`, "error");
    }
  }

  function initialiseEditor() {
    if (editor || !window.ace) return;
    ace.config.set("basePath", "libraries/ace");
    editor = ace.edit("python-editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.session.setUseWorker(false);
    editor.setOptions({ fontSize: "15px", showPrintMargin: false, tabSize: 4, useSoftTabs: true, wrap: true, highlightActiveLine: true, behavioursEnabled: true });
    editor.setValue(state.python.code || starterPython, -1);
    editor.commands.addCommand({ name: "runCode", bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" }, exec: runActiveCode });
    editor.session.on("change", () => { state.python.code = editor.getValue(); scheduleSave(); });
    editor.selection.on("changeCursor", () => { const pos = editor.getCursorPosition(); $("#cursor-position").textContent = `Ln ${pos.row + 1}, Col ${pos.column + 1}`; });
    requestAnimationFrame(() => editor.resize());
    startPythonWorker();
  }

  function ensureEditor() {
    if (!editor) initialiseEditor();
    else requestAnimationFrame(() => editor.resize());
  }

  function setRuntimeStatus(message, type = "") {
    const element = $("#python-status");
    if (!element) return;
    element.textContent = message;
    element.className = `runtime-status ${type}`.trim();
  }

  function setRunButtons(running) {
    $("#run-code").disabled = running || !pythonReady;
    $("#stop-code").disabled = !running && !pythonWorker;
  }

  function appendConsole(text, kind = "output") {
    const consoleElement = $("#python-console");
    const span = document.createElement("span");
    span.className = `console-${kind}`;
    span.textContent = String(text);
    consoleElement.appendChild(span);
    if (!String(text).endsWith("\n")) consoleElement.appendChild(document.createTextNode("\n"));
    consoleElement.scrollTop = consoleElement.scrollHeight;
  }

  function startPythonWorker() {
    if (pythonWorker) pythonWorker.terminate();
    pythonReady = false;
    setRuntimeStatus("Loading local Python…");
    setRunButtons(false);
    try {
      pythonWorker = new Worker("python/worker.js?v=20260822-1", { type: "module" });
    } catch (error) {
      setRuntimeStatus("Static hosting required", "error");
      appendConsole("Open this app through GitHub Pages or another static web server, not file://.", "error");
      return;
    }
    pythonWorker.onmessage = handleWorkerMessage;
    pythonWorker.onerror = (event) => {
      pythonReady = false;
      setRuntimeStatus("Python failed to load", "error");
      appendConsole(event.message || "The local Python worker could not start.", "error");
      appendConsole("Check that the complete python/runtime folder is uploaded.", "system");
      setRunButtons(false);
    };
  }

  function handleWorkerMessage(event) {
    const data = event.data || {};
    if (data.type === "ready") {
      pythonReady = true;
      setRuntimeStatus("Python 3 ready", "ready");
      setRunButtons(false);
      appendConsole("Python 3 loaded locally. Your code stays in this browser.", "system");
      return;
    }
    if (data.type === "initError") {
      pythonReady = false;
      setRuntimeStatus("Python failed to load", "error");
      appendConsole(data.message, "error");
      return;
    }
    const context = runContexts.get(data.runId);
    if (!context && data.runId) return;
    if (data.type === "runStart") { setRuntimeStatus("Program running…", "busy"); return; }
    if (data.type === "stdout" || data.type === "stderr") {
      const kind = data.type === "stderr" ? "error" : "output";
      context.capture += `${data.text}\n`;
      appendConsole(data.text, kind);
      return;
    }
    if (data.type === "queuedInput") {
      context.capture += `${data.prompt || ""}${data.value}\n`;
      appendConsole(`> ${data.prompt || ""}${data.value}`, "input");
      return;
    }
    if (data.type === "inputRequest") {
      context.capture += data.prompt || "";
      $("#console-prompt").textContent = data.prompt || "Input required";
      $("#console-input-form").hidden = false;
      $("#console-input").value = "";
      $("#console-input").focus();
      if (data.prompt) appendConsole(data.prompt, "input");
      return;
    }
    if (data.type === "runComplete") {
      $("#console-input-form").hidden = true;
      activeRun = null;
      setRunButtons(false);
      setRuntimeStatus("Python 3 ready", "ready");
      if (!data.ok) {
        context.capture += `${data.error}\n`;
        appendConsole(cleanPythonError(data.error), "error");
        if (data.line) markEditorError(data.line, cleanPythonError(data.error));
      } else appendConsole("[Program finished]", "system");
      runContexts.delete(data.runId);
      context.resolve({ ok: Boolean(data.ok), output: context.capture.trim(), error: data.error || "" });
    }
  }

  function cleanPythonError(text) {
    return String(text || "Python error").replace(/File "<exec>", line (\d+)/g, (_, n) => `Student code, line ${Math.max(1, Number(n) - 5)}`).replace(/at [^\n]+pyodide[^\n]*/gi, "").trim();
  }

  function clearEditorError() {
    if (!editor) return;
    editor.session.clearAnnotations();
    if (errorMarker !== null) editor.session.removeMarker(errorMarker);
    errorMarker = null;
  }

  function markEditorError(line, message) {
    if (!editor || !line) return;
    clearEditorError();
    const row = Math.max(0, Number(line) - 1);
    editor.session.setAnnotations([{ row, column: 0, text: message.split("\n")[0], type: "error" }]);
    const Range = ace.require("ace/range").Range;
    errorMarker = editor.session.addMarker(new Range(row, 0, row, 1), "ace_error-line", "fullLine");
    editor.gotoLine(row + 1, 0, true);
  }

  function executePython(code) {
    if (!pythonReady || !pythonWorker) return Promise.resolve({ ok: false, output: "", error: "Python is not ready." });
    if (activeRun) return Promise.resolve({ ok: false, output: "", error: "Another program is running." });
    clearEditorError();
    const runId = `run-${Date.now()}-${++runCounter}`;
    activeRun = runId;
    setRunButtons(true);
    return new Promise((resolve) => {
      runContexts.set(runId, { resolve, capture: "" });
      pythonWorker.postMessage({ type: "run", runId, code, inputs: [] });
    });
  }

  async function runActiveCode() {
    if (!editor || !pythonReady || activeRun) return;
    state.python.code = editor.getValue();
    state.python.runCount++;
    $("#run-count").textContent = `Runs: ${state.python.runCount}`;
    $("#python-console").innerHTML = "";
    const result = await executePython(state.python.code);
    state.python.output = result.output;
    scheduleSave();
  }

  function stopPython() {
    if (pythonWorker) pythonWorker.terminate();
    runContexts.forEach((context) => context.resolve({ ok: false, output: context.capture, error: "Interrupted." }));
    runContexts.clear();
    activeRun = null;
    appendConsole("[Program stopped. Restarting Python…]", "system");
    startPythonWorker();
  }

  function wireEvents() {
    bindResponses();
    $$(".journey-step").forEach((button) => button.addEventListener("click", () => showSection(button.dataset.section)));
    $("#back-button").addEventListener("click", () => {
      const index = sectionOrder.indexOf(state.meta.currentSection);
      if (index > 0) showSection(sectionOrder[index - 1]);
    });
    $("#next-button").addEventListener("click", () => { const target = $("#next-button").dataset.target; if (target) showSection(target); });
    $("#submit-starter").addEventListener("click", submitStarter);
    $("#submit-concepts").addEventListener("click", submitConcepts);
    $("#submit-trace").addEventListener("click", submitTrace);
    $("#submit-debug").addEventListener("click", submitDebug);
    $("#save-python-evidence").addEventListener("click", submitPythonEvidence);
    $$('[data-extension-route]').forEach((input) => input.addEventListener("change", () => {
      const selected = new Set(selectedExtensionRoutes());
      if (input.checked) selected.add(input.dataset.extensionRoute); else selected.delete(input.dataset.extensionRoute);
      state.extension.selected = [...selected];
      updateExtensionPanels();
      scheduleSave();
    }));
    $("#quiz-check").addEventListener("click", checkQuizAnswer);
    $("#quiz-previous").addEventListener("click", () => { state.extension.quiz.current = Math.max(0, state.extension.quiz.current - 1); renderQuizQuestion(); scheduleSave(); });
    $("#quiz-next").addEventListener("click", () => { state.extension.quiz.current = Math.min(extensionQuiz.length - 1, state.extension.quiz.current + 1); renderQuizQuestion(); scheduleSave(); });
    $("#save-extension-evidence").addEventListener("click", submitExtensionEvidence);
    $("#skip-extension").addEventListener("click", () => showSection("plenary"));
    $("#submit-plenary").addEventListener("click", submitPlenary);
    $("#support-language").addEventListener("change", (event) => { state.meta.language = event.target.value; renderSupport(); scheduleSave(); });
    $$(".hint-button").forEach((button) => button.addEventListener("click", () => {
      const panel = $(`#${button.dataset.hint}`);
      panel.hidden = !panel.hidden;
      button.setAttribute("aria-expanded", String(!panel.hidden));
    }));
    $("#learning-toggle").addEventListener("click", () => {
      const panel = $("#learning-panel");
      panel.classList.toggle("open");
      $("#learning-toggle").setAttribute("aria-expanded", String(panel.classList.contains("open")));
    });
    $("#learning-close").addEventListener("click", () => $("#learning-panel").classList.remove("open"));
    $("#glossary-button").addEventListener("click", () => {
      const drawer = $("#glossary-drawer");
      drawer.hidden = !drawer.hidden;
      $("#glossary-button").setAttribute("aria-expanded", String(!drawer.hidden));
    });
    $("#glossary-close").addEventListener("click", () => { $("#glossary-drawer").hidden = true; $("#glossary-button").setAttribute("aria-expanded", "false"); });
    $("#read-page-button").addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const current = $(`#section-${state.meta.currentSection}`);
      const reading = [$("h2", current)?.innerText || "", ...$$('.reading-card, .worked-example, .cycle-reading, .syntax-anatomy, .pseudocode-primer', current).map((node) => node.innerText)].join(". ");
      const support = $(".language-support:not([hidden])", current)?.innerText || "";
      const utterance = new SpeechSynthesisUtterance(`${reading} ${support}`);
      utterance.lang = state.meta.language === "ms" ? "ms-MY" : state.meta.language === "zh" ? "zh-CN" : state.meta.language === "ko" ? "ko-KR" : "en-GB";
      speechSynthesis.speak(utterance);
    });
    $$(".image-button").forEach((button) => button.addEventListener("click", () => {
      $("#image-modal-img").src = button.dataset.image || $("img", button).src;
      $("#image-modal-img").alt = $("img", button).alt;
      $("#image-modal").hidden = false;
    }));
    $("#image-modal-close").addEventListener("click", () => $("#image-modal").hidden = true);
    $("#image-modal").addEventListener("click", (event) => { if (event.target === $("#image-modal")) $("#image-modal").hidden = true; });
    $("#evidence-image").addEventListener("change", (event) => handleEvidenceImage(event.target.files?.[0]));
    $("#extension-paper-image").addEventListener("change", (event) => handleExtensionImage(event.target.files?.[0]));
    $("#remove-extension-image").addEventListener("click", () => {
      state.extension.paperImageData = "";
      state.extension.paperImageName = "";
      updateExtensionImagePreview();
      scheduleSave();
      setFeedback($("#extension-image-feedback"), "Paper evidence removed.", "info");
    });
    $("#remove-evidence-image").addEventListener("click", () => {
      state.evidence = { imageData: "", imageName: "" };
      updateEvidencePreview();
      scheduleSave();
      setFeedback($("#image-feedback"), "Evidence image removed.", "info");
    });
    $("#run-code").addEventListener("click", runActiveCode);
    $("#stop-code").addEventListener("click", stopPython);
    $("#reset-code").addEventListener("click", () => {
      if (!editor || !confirm("Reset the Python Studio code to the starter?")) return;
      editor.setValue(starterPython, -1);
      state.python.code = starterPython;
      state.python.output = "";
      scheduleSave();
    });
    $("#clear-output").addEventListener("click", () => { $("#python-console").innerHTML = '<span class="console-system">Output cleared. Your code is unchanged.</span>'; });
    $("#download-code").addEventListener("click", () => {
      const code = editor ? editor.getValue() : state.python.code;
      const blob = new Blob([code], { type: "text/x-python" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${safeFilePart(state.meta.className)}_${safeFilePart(state.meta.name)}_Python_Studio.py`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
    $("#fullscreen-editor").addEventListener("click", async () => {
      const card = $(".python-card");
      if (!document.fullscreenElement) await card.requestFullscreen?.();
      else await document.exitFullscreen?.();
      setTimeout(() => editor?.resize(), 120);
    });
    $("#console-input-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!activeRun || !pythonWorker) return;
      const value = $("#console-input").value;
      appendConsole(`> ${value}`, "input");
      pythonWorker.postMessage({ type: "inputResponse", runId: activeRun, value });
      $("#console-input-form").hidden = true;
    });
    $("#download-pdf").addEventListener("click", downloadPdf);
    $("#download-bundle").addEventListener("click", downloadBundle);
    $("#print-fallback").addEventListener("click", () => { buildReview(); window.print(); });
    $("#reset-progress").addEventListener("click", () => {
      if (!confirm("Delete all saved responses for this lesson on this device?")) return;
      localStorage.removeItem(storageKey());
      location.reload();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        $("#image-modal").hidden = true;
        $("#glossary-drawer").hidden = true;
        $("#learning-panel").classList.remove("open");
      }
    });
    window.addEventListener("beforeunload", saveState);
  }

  function initialise() {
    initEntry();
    wireEvents();
    hydrateResponses();
    updateHeader();
    renderSupport();
    updateJourney();
    showSection(state.meta.currentSection || "starter", false);
    if (queryTeacher) $("#entry-overlay").hidden = true;
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
