(() => {
  'use strict';

  const SECTION_ORDER = ['overview', 'starter', 'main1', 'main2', 'extension', 'plenary', 'export'];
  const CORE_SECTIONS = ['overview', 'starter', 'main1', 'main2', 'plenary'];
  const SECTION_LABELS = {
    overview: 'Welcome', starter: 'Starter', main1: 'Main Task 1', main2: 'Main Task 2',
    extension: 'Extension', plenary: 'Plenary', export: 'Review & Export'
  };
  const LANGUAGE_NAMES = { ms: 'Bahasa Melayu', 'zh-CN': '简体中文', ko: '한국어', ar: 'العربية' };

  const STARTER_ITEMS = [
    { id: 'game', title: 'Writing instructions for a game character', image: 'assets/starter_game_instructions.png', answer: 'Computer Science', explanation: 'It uses an algorithm and commands to control a character.' },
    { id: 'presentation', title: 'Creating a presentation', image: 'assets/starter_presentation.png', answer: 'Digital creativity', explanation: 'It mainly communicates information using digital media.' },
    { id: 'python', title: 'Finding an error in Python code', image: 'assets/starter_python_error.png', answer: 'Computer Science', explanation: 'It involves reading, testing and debugging a program.' },
    { id: 'traffic', title: 'Designing a traffic-light system', image: 'assets/starter_traffic_light.png', answer: 'Both', explanation: 'It combines computational thinking with designing a real-world solution.' }
  ];
  const SEQUENCE_ITEMS = [
    { id: 'wash', text: 'Wash and dry your hands.' },
    { id: 'bread', text: 'Place two slices of bread on a clean plate.' },
    { id: 'filling', text: 'Add the filling to one slice.' },
    { id: 'close', text: 'Put the second slice on top.' },
    { id: 'cut', text: 'Cut the sandwich in half.' }
  ];
  const EXTENSION_ITEMS = [
    { id: 'leave', text: 'Leave the house.' },
    { id: 'uniform', text: 'Put on your school uniform.' },
    { id: 'wake', text: 'Wake up.' },
    { id: 'travel', text: 'Travel to school.' },
    { id: 'pack', text: 'Pack your school bag.' }
  ];
  const COMMANDS = [
    { code: 'F', label: 'Move forward', symbol: '↑' },
    { code: 'L', label: 'Turn left', symbol: '↶' },
    { code: 'R', label: 'Turn right', symbol: '↷' },
    { code: 'P', label: 'Pick up object', symbol: '◆' },
    { code: 'S', label: 'Stop', symbol: '■' }
  ];

  const EXTENSION_MISSIONS = [
    { id: 'two-stars', title: 'Mission 1 — Two Stars', description: 'Start at the bottom-left facing right. Collect both stars. The blocked square stops you continuing straight after the first star.', rows: 5, cols: 5, start: { row: 4, col: 0, direction: 1 }, stars: [{ row: 4, col: 2 }, { row: 1, col: 2 }], blocks: [{ row: 4, col: 3 }] },
    { id: 'three-stars', title: 'Mission 2 — Three Stars', description: 'Start at the bottom-left facing right. Decompose the route into three smaller journeys and collect all three stars.', rows: 6, cols: 6, start: { row: 5, col: 0, direction: 1 }, stars: [{ row: 5, col: 2 }, { row: 3, col: 2 }, { row: 3, col: 5 }], blocks: [{ row: 5, col: 3 }, { row: 4, col: 4 }, { row: 2, col: 2 }] },
    { id: 'blocked-route', title: 'Mission 3 — Blocked Route', description: 'Start at the bottom-left facing up. A blocked corridor means you cannot take the most direct turn after the second star.', rows: 6, cols: 6, start: { row: 5, col: 0, direction: 0 }, stars: [{ row: 3, col: 0 }, { row: 3, col: 3 }, { row: 0, col: 5 }], blocks: [{ row: 2, col: 0 }, { row: 2, col: 3 }, { row: 4, col: 2 }, { row: 1, col: 4 }] }
  ];

  const EXTENSION_QUIZ = [
    { id: 'q1', question: 'What is an algorithm?', options: ['An ordered set of precise instructions', 'A computer screen', 'A type of password', 'An image file'], answer: 'An ordered set of precise instructions', explanation: 'An algorithm is an ordered set of precise instructions for completing a task.' },
    { id: 'q2', question: 'What does sequence mean in Computer Science?', options: ['The colour of the code', 'The order of instructions', 'The speed of the internet', 'The size of a file'], answer: 'The order of instructions', explanation: 'Sequence is the order in which instructions are followed.' },
    { id: 'q3', question: 'Which instruction is the most precise?', options: ['Go over there', 'Move forward three squares', 'Do it quickly', 'Turn a bit'], answer: 'Move forward three squares', explanation: 'A precise command gives an exact action and amount.' },
    { id: 'q4', question: 'What is a command?', options: ['One instruction a computer or robot can carry out', 'A finished computer game', 'A folder name', 'A safety warning'], answer: 'One instruction a computer or robot can carry out', explanation: 'A command is one executable instruction.' },
    { id: 'q5', question: 'Why can changing the sequence change the output?', options: ['Computers follow steps in the given order', 'Computers choose a random order', 'Every command means the same thing', 'The monitor becomes brighter'], answer: 'Computers follow steps in the given order', explanation: 'A computer follows the written order exactly, so a changed order can produce a different result.' },
    { id: 'q6', question: 'What is an input?', options: ['Information or an action entering a system', 'The final result', 'A mistake in code', 'A saved folder'], answer: 'Information or an action entering a system', explanation: 'An input is information or an action that enters a system.' },
    { id: 'q7', question: 'What is a process?', options: ['What the system does with the input', 'A printed result', 'A keyboard key', 'A filename'], answer: 'What the system does with the input', explanation: 'The process is the work performed on the input.' },
    { id: 'q8', question: 'What is an output?', options: ['The result produced by a system', 'The first instruction', 'A secret password', 'A mouse click'], answer: 'The result produced by a system', explanation: 'An output is the result produced by a system.' },
    { id: 'q9', question: 'For a camera, pressing the shutter button is usually the…', options: ['Input', 'Process', 'Output', 'Debug'], answer: 'Input', explanation: 'Pressing the button is the action entering the camera system.' },
    { id: 'q10', question: 'For a camera, saving the captured light as an image is the…', options: ['Input', 'Process', 'Output', 'Password'], answer: 'Process', explanation: 'The camera processes the captured information to create an image.' },
    { id: 'q11', question: 'For a camera, the photograph shown on screen is the…', options: ['Input', 'Process', 'Output', 'Command'], answer: 'Output', explanation: 'The photograph is the result produced by the camera.' },
    { id: 'q12', question: 'What does testing mean?', options: ['Checking whether instructions work as intended', 'Deleting every command', 'Copying another answer', 'Changing a filename'], answer: 'Checking whether instructions work as intended', explanation: 'Testing compares the actual result with the intended result.' },
    { id: 'q13', question: 'What does debugging mean?', options: ['Finding and correcting a problem', 'Making the screen darker', 'Opening an unrelated website', 'Printing the first version'], answer: 'Finding and correcting a problem', explanation: 'Debugging means locating and correcting errors or unexpected results.' },
    { id: 'q14', question: 'In Scratch, what usually starts a program?', options: ['Clicking the green flag', 'Closing the browser', 'Turning off the computer', 'Deleting the sprite'], answer: 'Clicking the green flag', explanation: 'The green flag is commonly used as the input that starts a Scratch program.' },
    { id: 'q15', question: 'What does a repeat 4 block do?', options: ['Runs the blocks inside four times', 'Moves four pixels once', 'Stops after one command', 'Creates four files'], answer: 'Runs the blocks inside four times', explanation: 'A repeat block repeats the instructions contained inside it.' },
    { id: 'q16', question: 'An unknown person asks for your home address. What should you do?', options: ['Do not reply; block or report them and tell a trusted adult', 'Send the address', 'Ask for their address first', 'Post the message publicly'], answer: 'Do not reply; block or report them and tell a trusted adult', explanation: 'Personal information should not be shared with unknown people.' },
    { id: 'q17', question: 'You see another student’s file in a shared folder. What is responsible?', options: ['Leave it unchanged and tell the teacher if needed', 'Edit it for fun', 'Delete it', 'Rename it'], answer: 'Leave it unchanged and tell the teacher if needed', explanation: 'Access does not give permission to alter another person’s work.' },
    { id: 'q18', question: 'Which filename is the most useful?', options: ['7T_Aisha_Algorithm_v1', 'work', 'new file', 'aaa'], answer: '7T_Aisha_Algorithm_v1', explanation: 'A meaningful filename identifies the learner, task and version.' },
    { id: 'q19', question: 'Why should you read the whole task before asking for help?', options: ['The instructions may already explain the next step', 'It makes the computer faster', 'It removes every error', 'It changes the output automatically'], answer: 'The instructions may already explain the next step', explanation: 'Reading first helps you identify what is known and the exact point where support is needed.' },
    { id: 'q20', question: 'Which statement shows good Computer Science learning?', options: ['Plan, predict, test and improve', 'Copy without reading', 'Give up after one error', 'Change many things without testing'], answer: 'Plan, predict, test and improve', explanation: 'Successful problem solving uses planning, prediction, testing and improvement.' }
  ];

  const EMPTY_EXTENSION_MISSIONS = Object.fromEntries(EXTENSION_MISSIONS.map(mission => [mission.id, { algorithm: [], runs: 0, successes: 0, completed: false, bestLength: null, lastResult: '', lastPath: [], lastRobot: null, collected: [], reflection: '' }]));

  const SUPPORT_COPY = {
    ms: {
      overview: 'Hari ini anda akan belajar cara komputer mengikut arahan yang tepat. Jawapan anda, ujian algoritma dan refleksi akan disimpan sebagai bukti.',
      starter: 'Sains Komputer melibatkan penyelesaian masalah, algoritma dan program. Kreativiti digital menggunakan alat digital untuk menyampaikan atau mencipta idea.',
      sequence: 'Urutan ialah susunan langkah. Jika urutan berubah, hasil juga boleh berubah.',
      algorithm: 'Algoritma ialah satu set arahan yang tepat dan tersusun. Arahan ialah satu langkah yang boleh dilaksanakan.',
      workedExample: 'Mulakan pada petak START. Ikut satu arahan pada satu masa. Membelok menukar arah tetapi tidak menggerakkan robot.',
      robotTask: 'Bina arahan untuk sampai ke bintang, mengambilnya dan berhenti. Uji arahan anda sebelum meneruskan.',
      debugging: 'Pengujian memeriksa sama ada arahan berfungsi. Penyahpepijatan mencari dan membetulkan masalah.',
      scratch: 'Bendera hijau memulakan program. Blok ulang menjalankan arahan di dalamnya sebanyak empat kali.',
      ipo: 'Input memasuki sistem. Proses ialah apa yang dilakukan oleh sistem. Output ialah hasilnya.',
      safety: 'Jangan kongsi maklumat peribadi dengan orang yang tidak dikenali. Jangan ubah fail orang lain tanpa kebenaran.',
      extension: 'Susun langkah mengikut urutan yang betul. Gunakan IF dan THEN untuk menambah keputusan.',
      plenary: 'Jawab dengan perkataan anda sendiri supaya guru dapat melihat perkara yang anda fahami.'
    },
    'zh-CN': {
      overview: '今天你将学习电脑如何按照准确的指令工作。你的答案、算法测试和反思将被保存为学习证据。',
      starter: '计算机科学包括解决问题、设计算法和研究程序。数字创意使用数字工具表达或创作内容。',
      sequence: '顺序是步骤执行的先后次序。顺序改变时，结果也可能改变。',
      algorithm: '算法是一组准确且有顺序的指令。命令是电脑或机器人能够执行的一个步骤。',
      workedExample: '从 START 方格开始，一次执行一条命令。转向只改变方向，不会移动机器人。',
      robotTask: '编写命令让机器人到达星星、拿起星星并停止。继续之前先测试算法。',
      debugging: '测试是检查指令是否有效。调试是查找并改正问题。',
      scratch: '绿旗启动程序。重复模块会把里面的指令运行四次。',
      ipo: '输入进入系统。处理是系统所做的工作。输出是系统产生的结果。',
      safety: '不要向陌生人提供个人信息。未经允许，不要修改他人的文件。',
      extension: '把步骤按正确顺序排列。使用 IF 和 THEN 加入一个判断。',
      plenary: '请用自己的话回答，让老师了解你真正理解了什么。'
    },
    ko: {
      overview: '오늘은 컴퓨터가 정확한 지시를 어떻게 따르는지 배웁니다. 답, 알고리즘 테스트와 성찰이 학습 증거로 저장됩니다.',
      starter: '컴퓨터 과학은 문제 해결, 알고리즘과 프로그램을 다룹니다. 디지털 창작은 디지털 도구로 아이디어를 표현하거나 만듭니다.',
      sequence: '순서는 단계가 실행되는 차례입니다. 순서가 바뀌면 결과도 달라질 수 있습니다.',
      algorithm: '알고리즘은 정확하고 순서가 있는 지시의 모음입니다. 명령은 컴퓨터나 로봇이 실행할 수 있는 한 단계입니다.',
      workedExample: 'START 칸에서 시작하여 한 번에 한 명령씩 따르세요. 회전은 방향만 바꾸고 로봇을 이동시키지 않습니다.',
      robotTask: '별에 도착하고, 별을 집고, 멈추는 명령을 만드세요. 계속하기 전에 알고리즘을 테스트하세요.',
      debugging: '테스트는 지시가 작동하는지 확인하는 것입니다. 디버깅은 문제를 찾아 고치는 것입니다.',
      scratch: '초록 깃발이 프로그램을 시작합니다. 반복 블록 안의 명령은 네 번 실행됩니다.',
      ipo: '입력은 시스템에 들어갑니다. 처리는 시스템이 하는 일입니다. 출력은 만들어진 결과입니다.',
      safety: '모르는 사람에게 개인정보를 주지 마세요. 허락 없이 다른 사람의 파일을 바꾸지 마세요.',
      extension: '단계를 올바른 순서로 배열하세요. IF와 THEN을 사용해 결정을 추가하세요.',
      plenary: '교사가 이해 정도를 알 수 있도록 자신의 말로 답하세요.'
    },
    ar: {
      overview: 'ستتعلم اليوم كيف يتبع الحاسوب تعليمات دقيقة. ستُحفظ إجاباتك واختبارات الخوارزمية وتأملاتك كدليل على التعلم.',
      starter: 'يتضمن علم الحاسوب حل المشكلات والخوارزميات والبرامج. يستخدم الإبداع الرقمي الأدوات الرقمية للتواصل أو إنشاء المحتوى.',
      sequence: 'التسلسل هو ترتيب تنفيذ الخطوات. إذا تغير الترتيب فقد تتغير النتيجة.',
      algorithm: 'الخوارزمية مجموعة من التعليمات الدقيقة والمرتبة. الأمر خطوة واحدة يستطيع الحاسوب أو الروبوت تنفيذها.',
      workedExample: 'ابدأ من مربع START واتبع أمراً واحداً في كل مرة. الدوران يغير الاتجاه لكنه لا يحرك الروبوت.',
      robotTask: 'أنشئ أوامر للوصول إلى النجمة والتقاطها ثم التوقف. اختبر الخوارزمية قبل المتابعة.',
      debugging: 'الاختبار يتحقق من عمل التعليمات. تصحيح الأخطاء يعني العثور على المشكلة وإصلاحها.',
      scratch: 'العلم الأخضر يبدأ البرنامج. كتلة التكرار تنفذ الأوامر داخلها أربع مرات.',
      ipo: 'الإدخال يدخل إلى النظام. المعالجة هي ما يفعله النظام. الإخراج هو النتيجة.',
      safety: 'لا تشارك معلوماتك الخاصة مع شخص مجهول. لا تعدل ملف شخص آخر من دون إذن.',
      extension: 'رتب الخطوات بالترتيب الصحيح. استخدم IF و THEN لإضافة قرار.',
      plenary: 'أجب بكلماتك الخاصة حتى يستطيع المعلم معرفة ما فهمته.'
    }
  };

  const VOCABULARY = [
    { key: 'algorithm', term: 'Algorithm', definition: 'An ordered set of precise instructions for completing a task.', ms: ['Algoritma', 'Satu set arahan yang tepat dan tersusun untuk menyelesaikan tugas.'], 'zh-CN': ['算法', '为完成任务而按顺序排列的一组明确指令。'], ko: ['알고리즘', '과제를 완료하기 위해 순서대로 배열한 정확한 지시.'], ar: ['الخوارزمية', 'مجموعة تعليمات دقيقة ومرتبة لإكمال مهمة.'] },
    { key: 'sequence', term: 'Sequence', definition: 'The order in which instructions are followed.', ms: ['Urutan', 'Susunan arahan yang diikuti.'], 'zh-CN': ['顺序', '执行指令的先后次序。'], ko: ['순서', '지시가 실행되는 차례.'], ar: ['التسلسل', 'ترتيب تنفيذ التعليمات.'] },
    { key: 'command', term: 'Command', definition: 'One instruction that a computer or robot can carry out.', ms: ['Arahan', 'Satu langkah yang boleh dilaksanakan oleh komputer atau robot.'], 'zh-CN': ['命令', '电脑或机器人可以执行的一条指令。'], ko: ['명령', '컴퓨터나 로봇이 실행할 수 있는 한 가지 지시.'], ar: ['أمر', 'تعليمة واحدة يستطيع الحاسوب أو الروبوت تنفيذها.'] },
    { key: 'program', term: 'Program', definition: 'Instructions written in a form a computer can execute.', ms: ['Atur cara', 'Arahan yang ditulis dalam bentuk yang boleh dilaksanakan oleh komputer.'], 'zh-CN': ['程序', '以电脑能够执行的形式编写的指令。'], ko: ['프로그램', '컴퓨터가 실행할 수 있는 형태로 작성된 지시.'], ar: ['برنامج', 'تعليمات مكتوبة بصيغة يستطيع الحاسوب تنفيذها.'] },
    { key: 'input', term: 'Input', definition: 'Information or an action that enters a system.', ms: ['Input / Masukan', 'Maklumat atau tindakan yang masuk ke dalam sistem.'], 'zh-CN': ['输入', '进入系统的信息或操作。'], ko: ['입력', '시스템에 들어가는 정보나 동작.'], ar: ['إدخال', 'معلومات أو إجراء يدخل إلى النظام.'] },
    { key: 'process', term: 'Process', definition: 'What a system does with its input.', ms: ['Proses', 'Apa yang dilakukan oleh sistem terhadap input.'], 'zh-CN': ['处理', '系统对输入所做的工作。'], ko: ['처리', '시스템이 입력으로 하는 일.'], ar: ['معالجة', 'ما يفعله النظام بالمدخلات.'] },
    { key: 'output', term: 'Output', definition: 'The result produced by a system.', ms: ['Output / Keluaran', 'Hasil yang dihasilkan oleh sistem.'], 'zh-CN': ['输出', '系统产生的结果。'], ko: ['출력', '시스템이 만들어 내는 결과.'], ar: ['إخراج', 'النتيجة التي ينتجها النظام.'] },
    { key: 'testing', term: 'Testing', definition: 'Running or tracing a solution to check whether it works.', ms: ['Pengujian', 'Menjalankan atau menjejak penyelesaian untuk memeriksa sama ada ia berfungsi.'], 'zh-CN': ['测试', '运行或跟踪解决方案，检查它是否有效。'], ko: ['테스트', '해결 방법을 실행하거나 따라가며 작동하는지 확인하는 것.'], ar: ['اختبار', 'تشغيل الحل أو تتبعه للتحقق من عمله.'] },
    { key: 'debugging', term: 'Debugging', definition: 'Finding and correcting errors or unexpected results.', ms: ['Penyahpepijatan', 'Mencari dan membetulkan ralat atau hasil yang tidak dijangka.'], 'zh-CN': ['调试', '查找并改正错误或意外结果。'], ko: ['디버깅', '오류나 예상하지 못한 결과를 찾아 고치는 것.'], ar: ['تصحيح الأخطاء', 'العثور على الأخطاء أو النتائج غير المتوقعة وإصلاحها.'] }
  ];

  const DEFAULT_STATE = {
    profile: { name: '', className: '', teacherMode: false, supportMode: 'english', supportLanguage: 'ms' },
    activeSection: 'overview', decks: { starter: 0, main1: 0, main2: 0 }, unlockedAll: false,
    overview: { acknowledged: false },
    starter: { answers: {}, checked: false, score: null, challenge: '' },
    main1: { algorithm: [], tested: false, testResult: '', success: false, reflection: '', runs: 0, lastPath: [], lastRobot: null },
    main2: {
      sequence: {}, sequenceSwap: '', scratchShape: '', scratchInput: '', scratchOutput: '', scratchRepeat: '', scratchImprovement: '', scratchChecked: false, scratchScore: null,
      ipoPress: '', ipoCapture: '', ipoPhoto: '', ipoExample: '', ipoChecked: false, ipoScore: null,
      safety1: '', safety2: '', safetyReason: '', safetyChecked: false, safetyScore: null, challenge: ''
    },
    extension: {
      order: {}, missing: '', decision: '', sequenceAttempts: 0, sequenceCompleted: false,
      selected: { sequence: false, robot: false, flashcards: false, quiz: false },
      opens: { sequence: 0, robot: 0, flashcards: 0, quiz: 0 },
      robot: { activeMission: 'two-stars', missions: EMPTY_EXTENSION_MISSIONS },
      flashcards: { terms: [], requestedPaper: false, partnerPractice: false, reflection: '', attempts: 0, completed: false },
      quiz: { answers: {}, current: 0, checked: false, latestScore: null, bestScore: null, attempts: [] }
    },
    plenary: { algorithm: '', sequence: '', expectation: '', improve: '', confidence: '', challenge: '' },
    submission: { nameChecked: false, downloadedChecked: false, uploadedChecked: false, exportedAt: '' },
    interactionLog: []
  };

  let state = cloneDefault();
  let currentStorageKey = '';
  let saveTimer = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function cloneDefault() { return JSON.parse(JSON.stringify(DEFAULT_STATE)); }
  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    Object.entries(source).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) target[key] = deepMerge(target[key] || {}, value);
      else target[key] = value;
    });
    return target;
  }
  function safeId(value) { return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'student'; }
  function storageKey(profile) { return profile.teacherMode ? 'y7-w1-theory-redesign:teacher' : `y7-w1-theory-redesign:${safeId(profile.className)}:${safeId(profile.name)}`; }
  function escapeHtml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function cssEscape(value) { return window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/["\\]/g, '\\$&'); }
  function timestamp() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

  function logInteraction(action, detail = '') {
    state.interactionLog.push({ time: new Date().toISOString(), action, detail });
    if (state.interactionLog.length > 160) state.interactionLog = state.interactionLog.slice(-160);
  }
  function saveState(action = '', detail = '') {
    if (!currentStorageKey) return;
    if (action) logInteraction(action, detail);
    localStorage.setItem(currentStorageKey, JSON.stringify(state));
    $('#saveStatus').textContent = `Saved ${timestamp()}`;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { if ($('#saveStatus')) $('#saveStatus').textContent = 'All work saved'; }, 1400);
    refreshUI();
  }
  function loadState(profile) {
    currentStorageKey = storageKey(profile);
    const saved = localStorage.getItem(currentStorageKey);
    state = cloneDefault();
    if (saved) {
      try { state = deepMerge(state, JSON.parse(saved)); } catch (error) { console.warn('Saved work could not be read.', error); }
    }
    state.profile = profile;
    if (profile.teacherMode) state.unlockedAll = true;
  }

  function setProfile(profile) {
    loadState(profile);
    $('#profileOverlay').classList.add('hidden');
    renderAllSupport();
    restoreValues();
    showSection(state.activeSection || 'overview', true);
    logInteraction('Lesson opened', profile.teacherMode ? 'Teacher review' : 'Student session');
    saveState();
  }

  function supportEnabled() { return state.profile.supportMode === 'supported'; }
  function renderAllSupport() {
    const language = state.profile.supportLanguage || 'ms';
    $$('.language-help').forEach(box => {
      const text = SUPPORT_COPY[language]?.[box.dataset.supportKey] || '';
      box.innerHTML = text ? `<strong>${escapeHtml(LANGUAGE_NAMES[language])} support</strong><span>${escapeHtml(text)}</span>` : '';
      box.classList.toggle('visible', supportEnabled() && Boolean(text));
      box.dir = language === 'ar' ? 'rtl' : 'ltr';
      box.lang = language;
    });
    $('#languageBtn').textContent = supportEnabled() ? `Support: ${LANGUAGE_NAMES[language]}` : 'Language help';
    renderGlossary();
  }

  function renderGlossary() {
    const language = state.profile.supportLanguage || 'ms';
    $('#glossaryLanguageNote').textContent = supportEnabled()
      ? `English definitions with optional ${LANGUAGE_NAMES[language]} support.`
      : 'English definitions. You can turn on another support language at any time.';
    $('#glossaryContent').innerHTML = VOCABULARY.map(item => {
      const translation = item[language];
      return `<article class="glossary-item" id="glossary-${item.key}"><h3>${escapeHtml(item.term)}</h3><p>${escapeHtml(item.definition)}</p>${supportEnabled() && translation ? `<p class="glossary-translation" lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}"><strong>${escapeHtml(translation[0])}</strong><br>${escapeHtml(translation[1])}</p>` : ''}</article>`;
    }).join('');
  }

  function openDialog(dialog) { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', ''); }
  function closeDialog(dialog) { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); }

  function renderKeywordButtons() {
    $('#keywordButtons').innerHTML = VOCABULARY.map(item => `<button class="keyword-button" type="button" data-keyword="${item.key}">${escapeHtml(item.term)}</button>`).join('');
    $$('.keyword-button').forEach(button => button.addEventListener('click', () => {
      renderGlossary(); openDialog($('#glossaryDialog'));
      setTimeout(() => $(`#glossary-${button.dataset.keyword}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    }));
  }

  function renderStarterCards() {
    $('#starterCards').innerHTML = STARTER_ITEMS.map((item, index) => `
      <article class="classification-card">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
        <div class="card-body"><h4>${index + 1}. ${escapeHtml(item.title)}</h4>
          <div class="choice-row" role="radiogroup" aria-label="Classify ${escapeHtml(item.title)}">
            ${['Computer Science', 'Digital creativity', 'Both'].map(choice => `<label><input type="radio" name="starter-${item.id}" value="${choice}"> ${choice}</label>`).join('')}
          </div><div id="result-${item.id}" class="card-result" aria-live="polite"></div>
        </div>
      </article>`).join('');
    STARTER_ITEMS.forEach(item => $$(`input[name="starter-${item.id}"]`).forEach(input => input.addEventListener('change', () => {
      state.starter.answers[item.id] = input.value; state.starter.checked = false; state.starter.score = null;
      saveState('Starter choice', item.title);
    })));
  }

  function renderOrderTask(containerId, items, target) {
    const container = $(`#${containerId}`);
    container.innerHTML = items.map(item => `<div class="order-row"><select data-order-id="${item.id}" aria-label="Position for ${escapeHtml(item.text)}"><option value="">Order</option>${items.map((_, index) => `<option value="${index + 1}">${index + 1}</option>`).join('')}</select><span>${escapeHtml(item.text)}</span></div>`).join('');
    $$('select[data-order-id]', container).forEach(select => select.addEventListener('change', () => {
      const object = target === 'main2' ? state.main2.sequence : state.extension.order;
      object[select.dataset.orderId] = select.value;
      if (target === 'extension') state.extension.sequenceCompleted = false;
      saveState(target === 'main2' ? 'Sequence position changed' : 'Extension position changed', select.dataset.orderId);
    }));
  }

  function renderCommands() {
    $('#commandButtons').innerHTML = COMMANDS.map(command => `<button type="button" class="command-btn" data-command="${command.code}"><span class="symbol">${command.symbol}</span><small>${command.label}</small></button>`).join('');
    $$('.command-btn').forEach(button => button.addEventListener('click', () => {
      state.main1.algorithm.push(button.dataset.command); state.main1.tested = false; state.main1.success = false; state.main1.testResult = ''; state.main1.lastPath = []; state.main1.lastRobot = null;
      saveState('Robot command added', button.dataset.command); renderAlgorithmList(); renderRobotGrid(); updateRobotFeedback();
    }));
  }

  function renderAlgorithmList() {
    const list = $('#algorithmList');
    list.innerHTML = state.main1.algorithm.length ? state.main1.algorithm.map(code => { const command = COMMANDS.find(item => item.code === code); return `<li>${command.symbol} ${escapeHtml(command.label)}</li>`; }).join('') : '<li class="muted">No commands added yet.</li>';
  }

  function testAlgorithm() {
    const start = { row: 4, col: 0, direction: 0 };
    const goal = { row: 0, col: 4 };
    const directions = [{ dr: -1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }];
    let robot = { ...start }; let pickedUp = false; let stopped = false; let error = ''; const path = [{ row: robot.row, col: robot.col }];
    for (let index = 0; index < state.main1.algorithm.length; index += 1) {
      const code = state.main1.algorithm[index];
      if (stopped) break;
      if (code === 'L') robot.direction = (robot.direction + 3) % 4;
      if (code === 'R') robot.direction = (robot.direction + 1) % 4;
      if (code === 'F') {
        const nextRow = robot.row + directions[robot.direction].dr; const nextCol = robot.col + directions[robot.direction].dc;
        if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4) { error = `Command ${index + 1} moves outside the grid.`; break; }
        robot.row = nextRow; robot.col = nextCol; path.push({ row: robot.row, col: robot.col });
      }
      if (code === 'P') {
        if (robot.row === goal.row && robot.col === goal.col) pickedUp = true;
        else { error = `Command ${index + 1} tries to pick up the object before reaching the star.`; break; }
      }
      if (code === 'S') stopped = true;
    }
    const success = !error && robot.row === goal.row && robot.col === goal.col && pickedUp && stopped;
    let message = '';
    if (success) message = `Success. The robot reached the star, picked it up and stopped using ${state.main1.algorithm.length} commands.`;
    else if (error) message = `Debug needed: ${error}`;
    else if (robot.row !== goal.row || robot.col !== goal.col) message = 'Debug needed: the robot did not finish on the star.';
    else if (!pickedUp) message = 'Almost there: the robot reached the star but did not use Pick up object.';
    else message = 'Almost there: add Stop after picking up the object.';
    state.main1.tested = true; state.main1.success = success; state.main1.testResult = message; state.main1.lastPath = path; state.main1.lastRobot = robot; state.main1.runs += 1;
    saveState('Algorithm tested', success ? 'Successful route' : 'Debug needed'); renderRobotGrid(); updateRobotFeedback();
  }

  function renderRobotGrid() {
    const grid = $('#robotGrid'); const goal = { row: 0, col: 4 }; const start = { row: 4, col: 0 };
    const path = state.main1.lastPath || []; const robot = state.main1.lastRobot || { ...start, direction: 0 }; const symbols = ['⬆', '➡', '⬇', '⬅']; let html = '';
    for (let row = 0; row < 5; row += 1) for (let col = 0; col < 5; col += 1) {
      const classes = ['grid-cell']; if (row === start.row && col === start.col) classes.push('start'); if (row === goal.row && col === goal.col) classes.push('goal'); if (path.some(point => point.row === row && point.col === col)) classes.push('path'); if (row === robot.row && col === robot.col) classes.push('robot');
      const label = row === start.row && col === start.col ? 'START' : row === goal.row && col === goal.col ? 'STAR' : '';
      const robotSymbol = row === robot.row && col === robot.col ? symbols[robot.direction ?? 0] : '';
      html += `<div class="${classes.join(' ')}" data-robot="${robotSymbol}">${row === goal.row && col === goal.col ? '⭐' : ''}<span class="cell-label">${label}</span></div>`;
    }
    grid.innerHTML = html;
  }
  function updateRobotFeedback() { const panel = $('#robotFeedback'); panel.textContent = state.main1.testResult || 'Add commands, then test your algorithm.'; panel.classList.remove('success', 'fail'); if (state.main1.tested) panel.classList.add(state.main1.success ? 'success' : 'fail'); }

  function extensionCompletionCount() {
    return Number(Boolean(state.extension.sequenceCompleted))
      + Number(EXTENSION_MISSIONS.some(mission => state.extension.robot.missions[mission.id]?.completed))
      + Number(Boolean(state.extension.flashcards.completed))
      + Number((state.extension.quiz.attempts || []).length > 0);
  }

  function extensionAttemptCount() {
    const robotRuns = EXTENSION_MISSIONS.reduce((total, mission) => total + Number(state.extension.robot.missions[mission.id]?.runs || 0), 0);
    return Number(state.extension.sequenceAttempts || 0) + robotRuns + Number(state.extension.flashcards.attempts || 0) + Number((state.extension.quiz.attempts || []).length);
  }

  function renderExtensionChoiceBoard() {
    const visitText = name => state.extension.opens[name] ? `${state.extension.opens[name]} visit${state.extension.opens[name] === 1 ? '' : 's'} · no submitted attempt` : 'Not opened';
    const summaries = {
      sequence: state.extension.sequenceAttempts ? `${state.extension.sequenceAttempts} attempt${state.extension.sequenceAttempts === 1 ? '' : 's'}${state.extension.sequenceCompleted ? ' · completed' : ''}` : visitText('sequence'),
      robot: (() => { const runs = EXTENSION_MISSIONS.reduce((total, mission) => total + Number(state.extension.robot.missions[mission.id]?.runs || 0), 0); const complete = EXTENSION_MISSIONS.filter(mission => state.extension.robot.missions[mission.id]?.completed).length; return runs ? `${runs} test${runs === 1 ? '' : 's'} · ${complete}/3 missions completed` : visitText('robot'); })(),
      flashcards: state.extension.flashcards.attempts ? `${state.extension.flashcards.attempts} practice round${state.extension.flashcards.attempts === 1 ? '' : 's'}${state.extension.flashcards.completed ? ' · completed' : ''}` : visitText('flashcards'),
      quiz: state.extension.quiz.attempts.length ? `${state.extension.quiz.attempts.length} attempt${state.extension.quiz.attempts.length === 1 ? '' : 's'} · best ${state.extension.quiz.bestScore}/20` : visitText('quiz')
    };
    Object.entries(summaries).forEach(([key, value]) => { const element = $(`[data-extension-summary="${key}"]`); if (element) element.textContent = value; });
    $$('.extension-open').forEach(button => { button.textContent = state.extension.opens[button.dataset.extensionChoice] ? 'Reopen / improve' : 'Open activity'; });
  }

  function openExtensionActivity(name) {
    if (!state.extension.selected[name]) state.extension.selected[name] = true;
    state.extension.opens[name] = Number(state.extension.opens[name] || 0) + 1;
    $('#extensionChoiceBoard').classList.add('hidden');
    $$('[data-extension-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.extensionPanel !== name));
    logInteraction('Extension opened', `${name} visit ${state.extension.opens[name]}`);
    saveState();
    if (name === 'robot') renderExtensionRobotLab();
    if (name === 'flashcards') renderFlashcards();
    if (name === 'quiz') renderExtensionQuiz();
    renderExtensionChoiceBoard();
  }

  function showExtensionChoiceBoard() {
    $$('[data-extension-panel]').forEach(panel => panel.classList.add('hidden'));
    $('#extensionChoiceBoard').classList.remove('hidden');
    renderExtensionChoiceBoard();
  }

  function checkExtensionSequence() {
    state.extension.sequenceAttempts = Number(state.extension.sequenceAttempts || 0) + 1;
    const expected = { wake: 1, uniform: 2, pack: 3, leave: 4, travel: 5 };
    const orderCorrect = Object.entries(expected).every(([key, value]) => Number(state.extension.order[key]) === value);
    const missingReady = state.extension.missing.trim().length >= 3;
    const decision = state.extension.decision.trim();
    const decisionReady = /\bif\b/i.test(decision) && /\bthen\b/i.test(decision);
    state.extension.sequenceCompleted = orderCorrect && missingReady && decisionReady;
    $('#extensionSequenceFeedback').textContent = state.extension.sequenceCompleted
      ? `Completed in ${state.extension.sequenceAttempts} attempt${state.extension.sequenceAttempts === 1 ? '' : 's'}. The sequence and decision are testable.`
      : `Attempt ${state.extension.sequenceAttempts}: check that Wake up is first, Travel to school is last, and your decision uses both IF and THEN.`;
    saveState('Extension sequencing checked', state.extension.sequenceCompleted ? 'Completed' : 'Needs revision');
    renderExtensionChoiceBoard();
  }

  function activeMissionDefinition() { return EXTENSION_MISSIONS.find(mission => mission.id === state.extension.robot.activeMission) || EXTENSION_MISSIONS[0]; }
  function activeMissionState() { const mission = activeMissionDefinition(); return state.extension.robot.missions[mission.id]; }

  function renderExtensionMissionTabs() {
    $('#missionTabs').innerHTML = EXTENSION_MISSIONS.map(mission => {
      const progress = state.extension.robot.missions[mission.id];
      return `<button type="button" role="tab" class="mission-tab ${mission.id === state.extension.robot.activeMission ? 'active' : ''} ${progress.completed ? 'complete' : ''}" data-mission="${mission.id}" aria-selected="${mission.id === state.extension.robot.activeMission}">${progress.completed ? '✓ ' : ''}${escapeHtml(mission.title.replace(/Mission \d+ — /, ''))}</button>`;
    }).join('');
    $$('.mission-tab').forEach(button => button.addEventListener('click', () => {
      state.extension.robot.activeMission = button.dataset.mission;
      saveState('Robot mission selected', button.dataset.mission);
      renderExtensionRobotLab();
    }));
  }

  function renderExtensionCommandButtons() {
    $('#extensionCommandButtons').innerHTML = COMMANDS.map(command => `<button type="button" class="command-btn extension-command" data-command="${command.code}"><span class="symbol">${command.symbol}</span><small>${command.label}</small></button>`).join('');
    $$('.extension-command').forEach(button => button.addEventListener('click', () => {
      const progress = activeMissionState();
      progress.algorithm.push(button.dataset.command); progress.lastResult = ''; progress.lastPath = []; progress.lastRobot = null; progress.collected = [];
      saveState('Extension robot command added', `${activeMissionDefinition().id}: ${button.dataset.command}`);
      renderExtensionRobotLab();
    }));
  }

  function renderExtensionAlgorithmList() {
    const progress = activeMissionState();
    $('#extensionAlgorithmList').innerHTML = progress.algorithm.length ? progress.algorithm.map(code => { const command = COMMANDS.find(item => item.code === code); return `<li>${command.symbol} ${escapeHtml(command.label)}</li>`; }).join('') : '<li class="muted">No commands added yet.</li>';
  }

  function positionKey(position) { return `${position.row},${position.col}`; }

  function testExtensionAlgorithm() {
    const mission = activeMissionDefinition(); const progress = activeMissionState();
    const directions = [{ dr: -1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }];
    const blocks = new Set(mission.blocks.map(positionKey)); const collected = new Set(); let robot = { ...mission.start }; let stopped = false; let error = ''; const path = [{ row: robot.row, col: robot.col }];
    for (let index = 0; index < progress.algorithm.length; index += 1) {
      const code = progress.algorithm[index]; if (stopped) break;
      if (code === 'L') robot.direction = (robot.direction + 3) % 4;
      if (code === 'R') robot.direction = (robot.direction + 1) % 4;
      if (code === 'F') {
        const next = { row: robot.row + directions[robot.direction].dr, col: robot.col + directions[robot.direction].dc };
        if (next.row < 0 || next.row >= mission.rows || next.col < 0 || next.col >= mission.cols) { error = `Command ${index + 1} moves outside the grid.`; break; }
        if (blocks.has(positionKey(next))) { error = `Command ${index + 1} moves into a blocked square.`; break; }
        robot = { ...robot, row: next.row, col: next.col }; path.push({ row: robot.row, col: robot.col });
      }
      if (code === 'P') {
        const star = mission.stars.find(item => item.row === robot.row && item.col === robot.col);
        if (!star) { error = `Command ${index + 1} uses Pick up where there is no star.`; break; }
        if (collected.has(positionKey(star))) { error = `Command ${index + 1} tries to collect the same star twice.`; break; }
        collected.add(positionKey(star));
      }
      if (code === 'S') stopped = true;
    }
    const success = !error && collected.size === mission.stars.length && stopped;
    let message = '';
    if (success) message = `Success: all ${mission.stars.length} stars were collected and the robot stopped.`;
    else if (error) message = `Debug needed: ${error}`;
    else if (collected.size < mission.stars.length) message = `Keep debugging: ${collected.size}/${mission.stars.length} stars collected.`;
    else message = 'Almost there: all stars were collected, but the algorithm needs Stop.';
    progress.runs += 1; progress.lastResult = message; progress.lastPath = path; progress.lastRobot = robot; progress.collected = [...collected];
    if (success) { progress.successes += 1; progress.completed = true; progress.bestLength = progress.bestLength === null ? progress.algorithm.length : Math.min(progress.bestLength, progress.algorithm.length); }
    saveState('Extension robot mission tested', `${mission.id}: ${success ? 'success' : 'debug'} attempt ${progress.runs}`);
    renderExtensionRobotLab(); renderExtensionChoiceBoard();
  }

  function renderExtensionRobotGrid() {
    const mission = activeMissionDefinition(); const progress = activeMissionState(); const grid = $('#extensionRobotGrid');
    grid.style.gridTemplateColumns = `repeat(${mission.cols}, 1fr)`; grid.style.gridTemplateRows = `repeat(${mission.rows}, 1fr)`;
    const path = progress.lastPath || []; const robot = progress.lastRobot || mission.start; const collected = new Set(progress.collected || []); const blocks = new Set(mission.blocks.map(positionKey)); const stars = new Set(mission.stars.map(positionKey)); const symbols = ['⬆', '➡', '⬇', '⬅']; let html = '';
    for (let row = 0; row < mission.rows; row += 1) for (let col = 0; col < mission.cols; col += 1) {
      const key = `${row},${col}`; const classes = ['grid-cell']; if (row === mission.start.row && col === mission.start.col) classes.push('start'); if (stars.has(key)) classes.push('goal'); if (blocks.has(key)) classes.push('blocked'); if (path.some(point => point.row === row && point.col === col)) classes.push('path'); if (row === robot.row && col === robot.col) classes.push('robot');
      const label = row === mission.start.row && col === mission.start.col ? 'START' : blocks.has(key) ? 'BLOCK' : '';
      const robotSymbol = row === robot.row && col === robot.col ? symbols[robot.direction ?? mission.start.direction] : '';
      html += `<div class="${classes.join(' ')}" data-robot="${robotSymbol}">${stars.has(key) && !collected.has(key) ? '⭐' : stars.has(key) ? '✓' : ''}<span class="cell-label">${label}</span></div>`;
    }
    grid.innerHTML = html;
  }

  function renderExtensionRobotLab() {
    const mission = activeMissionDefinition(); const progress = activeMissionState();
    renderExtensionMissionTabs(); renderExtensionCommandButtons(); renderExtensionAlgorithmList(); renderExtensionRobotGrid();
    $('#missionTitle').textContent = mission.title; $('#missionDescription').textContent = mission.description;
    $('#missionStats').textContent = `${progress.runs} test${progress.runs === 1 ? '' : 's'} · ${progress.successes} success${progress.successes === 1 ? '' : 'es'}${progress.bestLength ? ` · best ${progress.bestLength} commands` : ''}`;
    $('#extensionRobotFeedback').textContent = progress.lastResult || 'Add commands, then test the mission.';
    $('#extensionRobotFeedback').classList.remove('success', 'fail'); if (progress.lastResult) $('#extensionRobotFeedback').classList.add(progress.completed && progress.lastResult.startsWith('Success') ? 'success' : 'fail');
    $('#extensionRobotReflection').value = progress.reflection || '';
  }

  function renderFlashcards() {
    const selected = new Set(state.extension.flashcards.terms || []);
    $('#flashcardTerms').innerHTML = VOCABULARY.map(item => `<label class="check-row"><input type="checkbox" class="flashcard-term" value="${item.key}" ${selected.has(item.key) ? 'checked' : ''}><span><strong>${escapeHtml(item.term)}</strong> — ${escapeHtml(item.definition)}</span></label>`).join('');
    $$('.flashcard-term').forEach(input => input.addEventListener('change', () => {
      const terms = new Set(state.extension.flashcards.terms || []); input.checked ? terms.add(input.value) : terms.delete(input.value); state.extension.flashcards.terms = [...terms]; state.extension.flashcards.completed = false; saveState('Flashcard term changed', input.value);
    }));
    $('#flashcardPaper').checked = Boolean(state.extension.flashcards.requestedPaper); $('#flashcardPartner').checked = Boolean(state.extension.flashcards.partnerPractice); $('#flashcardReflection').value = state.extension.flashcards.reflection || '';
    $('#flashcardFeedback').textContent = state.extension.flashcards.attempts ? `${state.extension.flashcards.attempts} practice round${state.extension.flashcards.attempts === 1 ? '' : 's'} saved${state.extension.flashcards.completed ? ' · activity completed' : ''}.` : '';
  }

  function saveFlashcardAttempt() {
    const flashcards = state.extension.flashcards; flashcards.attempts += 1;
    flashcards.completed = flashcards.terms.length >= 4 && flashcards.requestedPaper && flashcards.partnerPractice && flashcards.reflection.trim().length >= 5;
    $('#flashcardFeedback').textContent = flashcards.completed ? `Practice round ${flashcards.attempts} saved. You selected ${flashcards.terms.length} words and completed the partner explanation.` : `Practice round ${flashcards.attempts} saved. To complete this activity, select at least four words, confirm the paper and partner steps, and write a reflection.`;
    saveState('Flashcard practice saved', flashcards.completed ? 'Completed' : 'In progress'); renderExtensionChoiceBoard();
  }

  function renderExtensionQuiz() {
    const quiz = state.extension.quiz; const index = Math.max(0, Math.min(Number(quiz.current || 0), EXTENSION_QUIZ.length - 1)); quiz.current = index; const item = EXTENSION_QUIZ[index]; const selected = quiz.answers[item.id] || '';
    $('#extensionQuizQuestion').innerHTML = `<p class="quiz-number">Question ${index + 1}</p><h4>${escapeHtml(item.question)}</h4><div class="quiz-options">${item.options.map(option => `<label class="radio-row"><input type="radio" name="extensionQuizAnswer" value="${escapeHtml(option)}" ${selected === option ? 'checked' : ''}><span>${escapeHtml(option)}</span></label>`).join('')}</div>${quiz.checked ? `<div class="quiz-feedback ${selected === item.answer ? 'correct' : 'incorrect'}"><strong>${selected === item.answer ? 'Correct' : 'Review this idea'}</strong><span>${escapeHtml(item.explanation)}</span></div>` : ''}`;
    $$('input[name="extensionQuizAnswer"]').forEach(input => input.addEventListener('change', () => { quiz.answers[item.id] = input.value; quiz.checked = false; saveState('Extension quiz answer changed', item.id); renderExtensionQuiz(); }));
    $('#quizPreviousBtn').disabled = index === 0; $('#quizNextBtn').disabled = index === EXTENSION_QUIZ.length - 1;
    $('#extensionQuizProgress').textContent = `Question ${index + 1} of ${EXTENSION_QUIZ.length} · ${Object.keys(quiz.answers).length} answered`;
    $('#extensionQuizBar').style.width = `${Math.round((index + 1) / EXTENSION_QUIZ.length * 100)}%`;
    renderQuizAttemptHistory();
  }

  function submitExtensionQuiz() {
    const quiz = state.extension.quiz; const answered = EXTENSION_QUIZ.filter(item => quiz.answers[item.id]).length;
    if (answered < EXTENSION_QUIZ.length) { $('#extensionQuizFeedback').textContent = `Answer all 20 questions before submitting. ${answered}/20 are answered.`; return; }
    const score = EXTENSION_QUIZ.filter(item => quiz.answers[item.id] === item.answer).length; quiz.checked = true; quiz.latestScore = score; quiz.bestScore = quiz.bestScore === null ? score : Math.max(quiz.bestScore, score); quiz.attempts.push({ time: new Date().toISOString(), score });
    $('#extensionQuizFeedback').textContent = `Attempt ${quiz.attempts.length}: ${score}/20. Review any incorrect questions, revise your choices and submit again if you have time.`;
    saveState('Extension quiz submitted', `${score}/20`); renderExtensionQuiz(); renderExtensionChoiceBoard();
  }

  function renderQuizAttemptHistory() {
    const attempts = state.extension.quiz.attempts || []; $('#quizAttemptHistory').innerHTML = attempts.length ? `<h4>Attempt history</h4><ol>${attempts.map((attempt, index) => `<li>Attempt ${index + 1}: <strong>${attempt.score}/20</strong> · ${new Date(attempt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>`).join('')}</ol>` : '<p class="muted">No submitted attempts yet.</p>';
  }

  function checkStarter() {
    let score = 0; let answered = 0;
    STARTER_ITEMS.forEach(item => {
      const result = $(`#result-${item.id}`); const value = state.starter.answers[item.id]; result.className = 'card-result';
      if (!value) { result.textContent = 'Choose one option.'; result.classList.add('incorrect'); return; }
      answered += 1;
      if (value === item.answer) { score += 1; result.textContent = `Correct. ${item.explanation}`; result.classList.add('correct'); }
      else { result.textContent = `Review this idea: ${item.explanation}`; result.classList.add('incorrect'); }
    });
    state.starter.checked = answered === STARTER_ITEMS.length; state.starter.score = score;
    $('#starterFeedback').textContent = state.starter.checked ? `Score: ${score}/4. You may change an answer and check again.` : 'Choose an answer for all four images.';
    saveState('Starter checked', `${score}/4`);
    if (!state.starter.checked) focusFirstIssue('starter');
    else showCompletionNotice('Your four classifications are checked. Use Next card, then write your explanation.', true);
  }
  function checkScratch() {
    const answers = { scratchShape: 'A square', scratchInput: 'Clicking the green flag', scratchOutput: 'A shape is drawn on the stage', scratchRepeat: 'repeat 4' };
    const completed = Object.keys(answers).every(key => state.main2[key]);
    if (!completed) { $('#scratchFeedback').textContent = 'Answer questions 1–4 first.'; focusFirstIssue('main2', 1); return; }
    const score = Object.entries(answers).filter(([key, value]) => state.main2[key] === value).length;
    state.main2.scratchChecked = true; state.main2.scratchScore = score;
    $('#scratchFeedback').textContent = score === 4 ? '4/4. Your prediction and code reading are accurate.' : `${score}/4. Re-read each block, revise an answer, then check again.`;
    saveState('Scratch check', `${score}/4`);
    showCompletionNotice('Questions 1–4 are checked. Now complete question 5 before moving on.', true);
  }
  function checkIpo() {
    const answers = { ipoPress: 'Input', ipoCapture: 'Process', ipoPhoto: 'Output' };
    const completed = Object.keys(answers).every(key => state.main2[key]);
    if (!completed) { $('#ipoFeedback').textContent = 'Choose a label for all three camera steps.'; focusFirstIssue('main2', 2); return; }
    const score = Object.entries(answers).filter(([key, value]) => state.main2[key] === value).length;
    state.main2.ipoChecked = true; state.main2.ipoScore = score;
    $('#ipoFeedback').textContent = score === 3 ? '3/3. You applied the IPO model accurately.' : `${score}/3. Compare the camera with the printer worked example and try again.`;
    saveState('IPO check', `${score}/3`);
    showCompletionNotice('The three camera labels are checked. Now write your own IPO example.', true);
  }
  function checkSafety() {
    if (!state.main2.safety1 || !state.main2.safety2) { $('#safetyFeedback').textContent = 'Choose one response for each situation.'; focusFirstIssue('main2', 3); return; }
    const score = Number(state.main2.safety1 === 'Block or report the account and tell a trusted adult') + Number(state.main2.safety2 === 'Leave it unchanged and tell the teacher');
    state.main2.safetyChecked = true; state.main2.safetyScore = score;
    $('#safetyFeedback').textContent = score === 2 ? '2/2. These choices protect personal information and other people’s work.' : `${score}/2. Re-read what private information and permission mean, then revise your choice.`;
    saveState('Safety check', `${score}/2`);
    showCompletionNotice('Both safety choices are checked. Now explain why one choice is safe or responsible.', true);
  }

  function hasResponse(value, minimum = 1) { return String(value || '').trim().length >= minimum; }

  function getSectionIssues(section) {
    const issues = [];
    const add = (message, card = null, selector = '') => issues.push({ message, card, selector });
    if (section === 'overview') {
      if (!state.overview.acknowledged) add('Tick “I have read the WAGBA…” before beginning the Starter.', null, '#overviewAcknowledge');
      return issues;
    }
    if (section === 'starter') {
      const missingStarter = STARTER_ITEMS.find(item => !state.starter.answers[item.id]);
      if (missingStarter) add(`Choose a classification for “${missingStarter.title}”.`, 1, `input[name="starter-${missingStarter.id}"]`);
      else if (!state.starter.checked) add('Press “Check my classifications” after choosing all four answers.', 1, '#checkStarterBtn');
      if (!hasResponse(state.starter.challenge, 5)) add('Write your explanation about how sequence can change the output.', 2, '#starterChallenge');
      return issues;
    }
    if (section === 'main1') {
      if (!state.main1.tested) add('Build an algorithm and press “Test algorithm”.', 3, '#testAlgorithmBtn');
      else if (!state.main1.success) add('Debug and test again until the robot reaches the star, picks it up and stops.', 3, '#robotFeedback');
      if (!hasResponse(state.main1.reflection, 5)) add('Explain what happened when you tested and what you changed.', 4, '#main1Reflection');
      return issues;
    }
    if (section === 'main2') {
      const missingSequence = SEQUENCE_ITEMS.find(item => !state.main2.sequence[item.id]);
      const sequenceValues = Object.values(state.main2.sequence).filter(Boolean);
      if (missingSequence) add(`Choose a position for “${missingSequence.text}”.`, 0, `#sequenceOrderTask select[data-order-id="${missingSequence.id}"]`);
      else if (new Set(sequenceValues).size !== SEQUENCE_ITEMS.length) add('Use each sequence number once. One or more numbers are repeated.', 0, '#sequenceOrderTask');
      if (!hasResponse(state.main2.sequenceSwap, 4)) add('Explain why cutting the sandwich too early causes a problem.', 0, '#sequenceSwapAnswer');

      const scratchFields = [
        ['scratchShape', '#scratchShape', 'Choose the shape the Scratch program draws.'],
        ['scratchInput', '#scratchInput', 'Choose the input that starts the Scratch program.'],
        ['scratchOutput', '#scratchOutput', 'Choose the output produced by the Scratch program.'],
        ['scratchRepeat', '#scratchRepeat', 'Choose the block that repeats the movement.']
      ];
      const missingScratch = scratchFields.find(([key]) => !hasResponse(state.main2[key]));
      if (missingScratch) add(missingScratch[2], 1, missingScratch[1]);
      else if (!state.main2.scratchChecked) add('Press “Check questions 1–4” after choosing all four Scratch answers.', 1, '#checkScratchBtn');
      if (!hasResponse(state.main2.scratchImprovement)) add('Suggest one Scratch change and predict its effect.', 1, '#scratchImprovement');

      const ipoFields = [
        ['ipoPress', '#ipoPress', 'Choose the IPO label for pressing the shutter button.'],
        ['ipoCapture', '#ipoCapture', 'Choose the IPO label for capturing and saving the image.'],
        ['ipoPhoto', '#ipoPhoto', 'Choose the IPO label for the photograph on screen.']
      ];
      const missingIpo = ipoFields.find(([key]) => !hasResponse(state.main2[key]));
      if (missingIpo) add(missingIpo[2], 2, missingIpo[1]);
      else if (!state.main2.ipoChecked) add('Press “Check camera labels” after choosing all three labels.', 2, '#checkIpoBtn');
      if (!hasResponse(state.main2.ipoExample)) add('Write one different digital-system IPO example.', 2, '#ipoExample');

      if (!state.main2.safety1) add('Choose a response for digital-safety situation 1.', 3, 'input[name="safety1"]');
      if (!state.main2.safety2) add('Choose a response for digital-safety situation 2.', 3, 'input[name="safety2"]');
      if (state.main2.safety1 && state.main2.safety2 && !state.main2.safetyChecked) add('Press “Check my choices” after answering both safety situations.', 3, '#checkSafetyBtn');
      if (!hasResponse(state.main2.safetyReason, 4)) add('Explain why one of your safety choices is responsible.', 3, '#safetyReason');
      if (!hasResponse(state.main2.challenge, 4)) add('Complete the final diagnostic reflection.', 4, '#main2Challenge');
      return issues;
    }
    if (section === 'plenary') {
      const fields = [
        ['algorithm', '#plenaryAlgorithm', 'Answer question 1: What is an algorithm?'],
        ['sequence', '#plenarySequence', 'Answer question 2: Why does sequence matter?'],
        ['expectation', '#plenaryExpectation', 'Answer question 3 about a classroom expectation.'],
        ['improve', '#plenaryImprove', 'Answer question 4 about what you will improve.'],
        ['confidence', '#plenaryConfidence', 'Choose your confidence rating for question 5.']
      ];
      fields.forEach(([key, selector, message]) => { if (!hasResponse(state.plenary[key])) add(message, null, selector); });
      return issues;
    }
    return issues;
  }

  function cardIssues(deckName, cardIndex) { return getSectionIssues(deckName).filter(issue => issue.card === cardIndex); }

  function clearAttention() {
    $$('.needs-attention').forEach(element => element.classList.remove('needs-attention'));
    $$('.card-needs-attention').forEach(element => element.classList.remove('card-needs-attention'));
  }

  function showCompletionNotice(message, success = false) {
    const notice = $('#completionNotice');
    notice.textContent = message;
    notice.classList.toggle('success', success);
    notice.hidden = false;
    clearTimeout(showCompletionNotice.timer);
    showCompletionNotice.timer = setTimeout(() => { notice.hidden = true; }, 5200);
  }

  function focusIssue(section, issue) {
    if (!issue) return;
    clearAttention();
    if (state.activeSection !== section) showSection(section, true);
    if (issue.card !== null && issue.card !== undefined) setDeck(section, issue.card, false);
    requestAnimationFrame(() => {
      const sectionElement = $(`#section-${section}`);
      const target = issue.selector ? $(issue.selector, sectionElement) : sectionElement;
      const highlight = target?.matches('input[type="radio"], input[type="checkbox"]') ? (target.closest('label') || target) : target;
      highlight?.classList.add('needs-attention');
      target?.closest('.lesson-card')?.classList.add('card-needs-attention');
      (highlight || sectionElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (target && typeof target.focus === 'function') target.focus({ preventScroll: true });
    });
    showCompletionNotice(`Before you continue: ${issue.message}`);
    renderCompletionGuide(section);
  }

  function focusFirstIssue(section, card = null) {
    const issues = getSectionIssues(section);
    const issue = card === null ? issues[0] : (issues.find(item => item.card === card) || issues[0]);
    focusIssue(section, issue);
  }

  function renderCompletionGuide(section) {
    const sectionElement = $(`#section-${section}`);
    if (!sectionElement || section === 'extension' || section === 'export') return;
    let guide = $('.completion-guide', sectionElement);
    if (!guide) {
      guide = document.createElement('div');
      guide.className = 'completion-guide';
      guide.setAttribute('aria-live', 'polite');
      sectionElement.appendChild(guide);
    }
    const issues = getSectionIssues(section);
    guide.classList.toggle('complete', issues.length === 0);
    if (!issues.length) {
      guide.innerHTML = '<strong>✓ This section is complete.</strong><span>You are ready to use the Continue button.</span>';
      return;
    }
    guide.innerHTML = `<strong>${issues.length} item${issues.length === 1 ? '' : 's'} still to complete</strong><span>First: ${escapeHtml(issues[0].message)}</span><button class="ghost review-missing" type="button">Show me what I missed</button>`;
    $('.review-missing', guide).addEventListener('click', () => focusIssue(section, getSectionIssues(section)[0]));
  }

  function updateContinueButtons() {
    $$('.next-section').forEach(button => {
      const section = button.closest('.lesson-section')?.dataset.section;
      const ready = section && getSectionIssues(section).length === 0;
      button.classList.toggle('ready-to-continue', Boolean(ready));
      if (section === 'overview') {
        button.textContent = ready ? 'Ready — Begin the Starter →' : 'Begin the Starter';
        $('#overviewReadyMessage').textContent = ready ? '✓ Ready. Select the highlighted Starter button.' : 'Tick the box when you are ready. The Starter button will then be highlighted.';
        $('#overviewReadyMessage').classList.toggle('ready', Boolean(ready));
      }
    });
  }

  function sectionComplete(section) {
    if (['overview', 'starter', 'main1', 'main2', 'plenary'].includes(section)) return getSectionIssues(section).length === 0;
    if (section === 'extension') return extensionAttempted();
    if (section === 'export') return coreComplete();
    return false;
  }
  function extensionAttempted() {
    return Object.values(state.extension.selected || {}).some(Boolean)
      || Object.values(state.extension.order).some(Boolean)
      || state.extension.missing.trim()
      || state.extension.decision.trim()
      || extensionAttemptCount() > 0;
  }
  function coreComplete() { return CORE_SECTIONS.every(sectionComplete); }
  function isUnlocked(section) {
    if (state.unlockedAll || state.profile.teacherMode) return true;
    if (section === 'overview') return true;
    if (section === 'extension' || section === 'plenary') return sectionComplete('main2');
    if (section === 'export') return sectionComplete('plenary');
    const index = SECTION_ORDER.indexOf(section); return index <= 0 || sectionComplete(SECTION_ORDER[index - 1]);
  }

  function showSection(section, force = false) {
    if (!force && !isUnlocked(section)) {
      const targetIndex = SECTION_ORDER.indexOf(section);
      const prerequisite = [...CORE_SECTIONS].reverse().find(item => SECTION_ORDER.indexOf(item) < targetIndex && !sectionComplete(item));
      const redirect = prerequisite || state.activeSection;
      showSection(redirect, true);
      focusFirstIssue(redirect);
      return;
    }
    state.activeSection = section;
    $$('.lesson-section').forEach(element => element.classList.toggle('active', element.dataset.section === section));
    renderNavigation();
    if (currentStorageKey) localStorage.setItem(currentStorageKey, JSON.stringify(state));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (section === 'export') renderExportSection();
    else renderCompletionGuide(section);
  }
  function renderNavigation() {
    $('#lessonNav').innerHTML = SECTION_ORDER.map(section => `<button type="button" class="nav-btn ${sectionComplete(section) ? 'complete' : ''} ${!isUnlocked(section) ? 'locked' : ''} ${state.activeSection === section ? 'active' : ''}" data-section="${section}" ${!isUnlocked(section) ? 'aria-disabled="true"' : ''}>${SECTION_LABELS[section]}</button>`).join('');
    $$('.nav-btn', $('#lessonNav')).forEach(button => button.addEventListener('click', () => showSection(button.dataset.section)));
  }
  function updateProgress() { const completed = CORE_SECTIONS.filter(sectionComplete).length; const percent = Math.round(completed / CORE_SECTIONS.length * 100); $('#progressBar').style.width = `${percent}%`; $('#progressText').textContent = `${percent}% core lesson complete`; }
  function updateStatuses() {
    SECTION_ORDER.forEach(section => {
      const pill = $(`[data-status-for="${section}"]`); if (!pill) return;
      if (section === 'extension') { const count = extensionCompletionCount(); pill.textContent = extensionAttempted() ? `${count} completed · ${extensionAttemptCount()} attempts` : 'Optional'; pill.classList.toggle('done', count > 0); }
      else { const complete = sectionComplete(section); const left = getSectionIssues(section).length; pill.textContent = complete ? 'Complete' : `${left} item${left === 1 ? '' : 's'} left`; pill.classList.toggle('done', complete); }
    });
  }
  function refreshUI() {
    $('#learnerName').textContent = state.profile.name || 'Not signed in'; $('#learnerClass').textContent = state.profile.teacherMode ? 'Teacher review' : state.profile.className || 'Class';
    renderNavigation(); updateProgress(); updateStatuses(); renderExportSection(); renderExtensionChoiceBoard(); renderCompletionGuide(state.activeSection); updateContinueButtons();
    Object.keys(state.decks).forEach(renderDeckControls);
  }

  function setDeck(deckName, index, log = true) {
    const deck = $(`[data-deck="${deckName}"]`); if (!deck) return;
    const cards = $$('.deck-card', deck); const nextIndex = Math.max(0, Math.min(index, cards.length - 1)); state.decks[deckName] = nextIndex;
    cards.forEach((card, cardIndex) => { card.hidden = cardIndex !== nextIndex; });
    renderDeckControls(deckName);
    if (log) saveState('Lesson card opened', `${deckName} ${nextIndex + 1}`);
  }
  function renderDeckControls(deckName) {
    const deck = $(`[data-deck="${deckName}"]`); const controls = $(`[data-controls-for="${deckName}"]`); if (!deck || !controls) return;
    const cards = $$('.deck-card', deck); const index = Number(state.decks[deckName] || 0);
    controls.innerHTML = `<button class="ghost deck-prev" type="button" ${index === 0 ? 'disabled' : ''}>← Previous card</button><div><span class="deck-progress">Card ${index + 1} of ${cards.length}</span><div class="deck-dots">${cards.map((_, dot) => { const issues = cardIssues(deckName, dot); const complete = issues.length === 0; return `<button class="deck-dot ${dot === index ? 'active' : ''} ${complete ? 'complete' : ''} ${issues.length && dot < index ? 'attention' : ''}" type="button" data-dot="${dot}" aria-label="Open card ${dot + 1}${complete ? ', complete' : `, ${issues.length} items left`}"></button>`; }).join('')}</div></div><button class="primary deck-next" type="button" ${index === cards.length - 1 ? 'disabled' : ''}>Next card →</button>`;
    $('.deck-prev', controls)?.addEventListener('click', () => setDeck(deckName, index - 1));
    $('.deck-next', controls)?.addEventListener('click', () => setDeck(deckName, index + 1));
    $$('.deck-dot', controls).forEach(button => button.addEventListener('click', () => setDeck(deckName, Number(button.dataset.dot))));
  }

  function bindPersistentFields() {
    const bindings = [
      ['#starterChallenge', 'starter', 'challenge'], ['#main1Reflection', 'main1', 'reflection'], ['#sequenceSwapAnswer', 'main2', 'sequenceSwap'],
      ['#scratchShape', 'main2', 'scratchShape'], ['#scratchInput', 'main2', 'scratchInput'], ['#scratchOutput', 'main2', 'scratchOutput'], ['#scratchRepeat', 'main2', 'scratchRepeat'], ['#scratchImprovement', 'main2', 'scratchImprovement'],
      ['#ipoPress', 'main2', 'ipoPress'], ['#ipoCapture', 'main2', 'ipoCapture'], ['#ipoPhoto', 'main2', 'ipoPhoto'], ['#ipoExample', 'main2', 'ipoExample'],
      ['#safetyReason', 'main2', 'safetyReason'], ['#main2Challenge', 'main2', 'challenge'], ['#extensionMissing', 'extension', 'missing'], ['#extensionDecision', 'extension', 'decision'],
      ['#plenaryAlgorithm', 'plenary', 'algorithm'], ['#plenarySequence', 'plenary', 'sequence'], ['#plenaryExpectation', 'plenary', 'expectation'], ['#plenaryImprove', 'plenary', 'improve'], ['#plenaryConfidence', 'plenary', 'confidence'], ['#plenaryChallenge', 'plenary', 'challenge']
    ];
    bindings.forEach(([selector, section, key]) => {
      const element = $(selector); const event = element.tagName === 'SELECT' ? 'change' : 'input';
      element.addEventListener(event, () => {
        state[section][key] = element.value;
        if (section === 'main2' && ['scratchShape', 'scratchInput', 'scratchOutput', 'scratchRepeat'].includes(key)) state.main2.scratchChecked = false;
        if (section === 'main2' && ['ipoPress', 'ipoCapture', 'ipoPhoto'].includes(key)) state.main2.ipoChecked = false;
        if (section === 'extension') state.extension.sequenceCompleted = false;
        element.classList.remove('needs-attention');
        element.closest('.lesson-card')?.classList.remove('card-needs-attention');
        saveState();
      });
      if (event === 'input') element.addEventListener('change', () => saveState('Written response updated', `${section}.${key}`));
    });
    $$('input[name="safety1"]').forEach(input => input.addEventListener('change', () => { state.main2.safety1 = input.value; state.main2.safetyChecked = false; saveState('Safety choice changed', 'Situation 1'); }));
    $$('input[name="safety2"]').forEach(input => input.addEventListener('change', () => { state.main2.safety2 = input.value; state.main2.safetyChecked = false; saveState('Safety choice changed', 'Situation 2'); }));
    $('#overviewAcknowledge').addEventListener('change', () => {
      state.overview.acknowledged = $('#overviewAcknowledge').checked;
      $('#overviewAcknowledge').closest('label')?.classList.remove('needs-attention');
      saveState('Welcome acknowledgement', state.overview.acknowledged ? 'Checked' : 'Unchecked');
      if (state.overview.acknowledged) {
        showCompletionNotice('Welcome complete. Select the highlighted “Begin the Starter” button.', true);
        $('.next-section', $('#section-overview'))?.focus();
      }
    });
    $('#flashcardPaper').addEventListener('change', () => { state.extension.flashcards.requestedPaper = $('#flashcardPaper').checked; state.extension.flashcards.completed = false; saveState('Flashcard paper confirmation', $('#flashcardPaper').checked ? 'Checked' : 'Unchecked'); });
    $('#flashcardPartner').addEventListener('change', () => { state.extension.flashcards.partnerPractice = $('#flashcardPartner').checked; state.extension.flashcards.completed = false; saveState('Flashcard partner confirmation', $('#flashcardPartner').checked ? 'Checked' : 'Unchecked'); });
    $('#flashcardReflection').addEventListener('input', () => { state.extension.flashcards.reflection = $('#flashcardReflection').value; state.extension.flashcards.completed = false; saveState(); });
    $('#flashcardReflection').addEventListener('change', () => saveState('Flashcard reflection updated'));
    $('#extensionRobotReflection').addEventListener('input', () => { activeMissionState().reflection = $('#extensionRobotReflection').value; saveState(); });
    $('#extensionRobotReflection').addEventListener('change', () => saveState('Extension robot reflection updated', activeMissionDefinition().id));
    [['#checkNamePdf', 'nameChecked'], ['#checkDownloaded', 'downloadedChecked'], ['#checkUploaded', 'uploadedChecked']].forEach(([selector, key]) => $(selector).addEventListener('change', () => { state.submission[key] = $(selector).checked; saveState('Submission checklist', key); }));
  }

  function restoreValues() {
    $('#overviewAcknowledge').checked = Boolean(state.overview.acknowledged);
    STARTER_ITEMS.forEach(item => { const value = state.starter.answers[item.id]; if (value) { const input = $(`input[name="starter-${item.id}"][value="${cssEscape(value)}"]`); if (input) input.checked = true; } });
    $('#starterChallenge').value = state.starter.challenge || ''; $('#main1Reflection').value = state.main1.reflection || '';
    renderAlgorithmList(); renderRobotGrid(); updateRobotFeedback();
    SEQUENCE_ITEMS.forEach(item => { const select = $(`#sequenceOrderTask select[data-order-id="${item.id}"]`); if (select) select.value = state.main2.sequence[item.id] || ''; });
    EXTENSION_ITEMS.forEach(item => { const select = $(`#extensionOrderTask select[data-order-id="${item.id}"]`); if (select) select.value = state.extension.order[item.id] || ''; });
    const values = {
      sequenceSwapAnswer: state.main2.sequenceSwap, scratchShape: state.main2.scratchShape, scratchInput: state.main2.scratchInput, scratchOutput: state.main2.scratchOutput, scratchRepeat: state.main2.scratchRepeat, scratchImprovement: state.main2.scratchImprovement,
      ipoPress: state.main2.ipoPress, ipoCapture: state.main2.ipoCapture, ipoPhoto: state.main2.ipoPhoto, ipoExample: state.main2.ipoExample, safetyReason: state.main2.safetyReason, main2Challenge: state.main2.challenge,
      extensionMissing: state.extension.missing, extensionDecision: state.extension.decision, plenaryAlgorithm: state.plenary.algorithm, plenarySequence: state.plenary.sequence, plenaryExpectation: state.plenary.expectation, plenaryImprove: state.plenary.improve, plenaryConfidence: state.plenary.confidence, plenaryChallenge: state.plenary.challenge
    };
    Object.entries(values).forEach(([id, value]) => { if ($(`#${id}`)) $(`#${id}`).value = value || ''; });
    ['safety1', 'safety2'].forEach(name => { const value = state.main2[name]; if (value) { const input = $(`input[name="${name}"][value="${cssEscape(value)}"]`); if (input) input.checked = true; } });
    $('#checkNamePdf').checked = Boolean(state.submission.nameChecked); $('#checkDownloaded').checked = Boolean(state.submission.downloadedChecked); $('#checkUploaded').checked = Boolean(state.submission.uploadedChecked);
    if (state.starter.checked) checkStarter();
    if (state.main2.scratchChecked) $('#scratchFeedback').textContent = `Last checked score: ${state.main2.scratchScore}/4.`;
    if (state.main2.ipoChecked) $('#ipoFeedback').textContent = `Last checked score: ${state.main2.ipoScore}/3.`;
    if (state.main2.safetyChecked) $('#safetyFeedback').textContent = `Last checked score: ${state.main2.safetyScore}/2.`;
    if (state.extension.sequenceAttempts) $('#extensionSequenceFeedback').textContent = state.extension.sequenceCompleted ? `Completed in ${state.extension.sequenceAttempts} attempt${state.extension.sequenceAttempts === 1 ? '' : 's'}.` : `${state.extension.sequenceAttempts} attempt${state.extension.sequenceAttempts === 1 ? '' : 's'} saved · continue debugging.`;
    renderExtensionRobotLab(); renderFlashcards(); renderExtensionQuiz(); showExtensionChoiceBoard();
    Object.keys(state.decks).forEach(deck => setDeck(deck, Number(state.decks[deck] || 0), false));
  }

  function renderExportSection() {
    const checklist = $('#completionChecklist'); if (!checklist) return;
    const items = [['Welcome', sectionComplete('overview')], ['Starter', sectionComplete('starter')], ['Main Task 1', sectionComplete('main1')], ['Main Task 2', sectionComplete('main2')], ['Extension', extensionAttempted(), true], ['Plenary', sectionComplete('plenary')]];
    checklist.innerHTML = items.map(([label, done, optional]) => `<div class="completion-item ${done ? 'done' : 'pending'}"><strong>${done ? '✓' : optional ? '○' : '•'} ${label}</strong><span>${done ? (optional ? 'Attempted' : 'Complete') : optional ? 'Optional — not attempted' : 'Still needs completion'}</span></div>`).join('');
    const ready = coreComplete() || state.profile.teacherMode; $('#exportPdfBtn').disabled = !ready; $('#exportReadyPill').textContent = ready ? 'Ready to export' : 'Not ready'; $('#exportReadyPill').classList.toggle('done', ready);
  }

  function orderToText(items, orderObject) {
    const ordered = items.map(item => ({ text: item.text, order: Number(orderObject[item.id]) })).filter(item => item.order > 0).sort((a, b) => a.order - b.order);
    return ordered.length ? ordered.map((item, index) => `${index + 1}. ${item.text}`).join(' ') : 'Not answered';
  }
  function algorithmText() { return state.main1.algorithm.map(code => COMMANDS.find(item => item.code === code)?.label || code).join(' → ') || 'No commands entered'; }
  function reportData() {
    const sections = [
      { title: 'Welcome and expectations', answers: [{ label: 'Acknowledged learning and evidence', value: state.overview.acknowledged ? 'Yes' : 'No' }] },
      { title: 'Starter — What is Computer Science?', answers: [...STARTER_ITEMS.map((item, index) => ({ label: `${index + 1}. ${item.title}`, value: state.starter.answers[item.id] || 'Not answered' })), { label: 'Checked score', value: state.starter.score === null ? 'Not checked' : `${state.starter.score}/4` }, { label: 'Sequence explanation', value: state.starter.challenge || 'Not answered' }] },
      { title: 'Main Task 1 — Human Robot', answers: [{ label: 'Final algorithm', value: algorithmText() }, { label: 'Number of tests', value: String(state.main1.runs || 0) }, { label: 'Latest result', value: state.main1.testResult || 'Not tested' }, { label: 'Debugging reflection', value: state.main1.reflection || 'Not answered' }] },
      { title: 'Main Task 2 — Starting-point check', answers: [
        { label: 'Sandwich algorithm', value: orderToText(SEQUENCE_ITEMS, state.main2.sequence) }, { label: 'Sequencing explanation', value: state.main2.sequenceSwap || 'Not answered' },
        { label: 'Scratch shape', value: state.main2.scratchShape || 'Not answered' }, { label: 'Scratch input', value: state.main2.scratchInput || 'Not answered' }, { label: 'Scratch output', value: state.main2.scratchOutput || 'Not answered' }, { label: 'Scratch repeat block', value: state.main2.scratchRepeat || 'Not answered' }, { label: 'Scratch change and prediction', value: state.main2.scratchImprovement || 'Not answered' }, { label: 'Scratch score', value: state.main2.scratchScore === null ? 'Not checked' : `${state.main2.scratchScore}/4` },
        { label: 'Camera step 1', value: state.main2.ipoPress || 'Not answered' }, { label: 'Camera step 2', value: state.main2.ipoCapture || 'Not answered' }, { label: 'Camera step 3', value: state.main2.ipoPhoto || 'Not answered' }, { label: 'Different IPO example', value: state.main2.ipoExample || 'Not answered' }, { label: 'IPO score', value: state.main2.ipoScore === null ? 'Not checked' : `${state.main2.ipoScore}/3` },
        { label: 'Safety situation 1', value: state.main2.safety1 || 'Not answered' }, { label: 'Safety situation 2', value: state.main2.safety2 || 'Not answered' }, { label: 'Safety explanation', value: state.main2.safetyReason || 'Not answered' }, { label: 'Safety score', value: state.main2.safetyScore === null ? 'Not checked' : `${state.main2.safetyScore}/2` }, { label: 'Diagnostic reflection', value: state.main2.challenge || 'Not answered' }
      ] }
    ];
    if (extensionAttempted()) {
      const extensionAnswers = [
        { label: 'Extension choices opened', value: Object.entries(state.extension.selected).filter(([, selected]) => selected).map(([name]) => `${name} (${state.extension.opens[name] || 0} visits)`).join(', ') || 'None' },
        { label: 'Total extension attempts', value: String(extensionAttemptCount()) },
        { label: 'Completed extension choices', value: `${extensionCompletionCount()}/4` }
      ];
      if (state.extension.selected.sequence || state.extension.sequenceAttempts) {
        extensionAnswers.push(
          { label: 'Everyday algorithm attempts', value: String(state.extension.sequenceAttempts || 0) },
          { label: 'Everyday algorithm completed', value: state.extension.sequenceCompleted ? 'Yes' : 'Not yet' },
          { label: 'Corrected morning order', value: orderToText(EXTENSION_ITEMS, state.extension.order) },
          { label: 'Missing step', value: state.extension.missing || 'Not answered' },
          { label: 'IF/THEN decision', value: state.extension.decision || 'Not answered' }
        );
      }
      if (state.extension.selected.robot || EXTENSION_MISSIONS.some(mission => state.extension.robot.missions[mission.id]?.runs)) {
        EXTENSION_MISSIONS.forEach(mission => { const progress = state.extension.robot.missions[mission.id]; extensionAnswers.push(
          { label: `${mission.title} — tests`, value: String(progress.runs || 0) },
          { label: `${mission.title} — successes`, value: String(progress.successes || 0) },
          { label: `${mission.title} — best length`, value: progress.bestLength ? `${progress.bestLength} commands` : 'Not completed' },
          { label: `${mission.title} — latest algorithm`, value: progress.algorithm.map(code => COMMANDS.find(command => command.code === code)?.label || code).join(' → ') || 'No commands entered' },
          { label: `${mission.title} — reflection`, value: progress.reflection || 'Not answered' }
        ); });
      }
      if (state.extension.selected.flashcards || state.extension.flashcards.attempts) {
        extensionAnswers.push(
          { label: 'Flashcard practice rounds', value: String(state.extension.flashcards.attempts || 0) },
          { label: 'Flashcard words selected', value: state.extension.flashcards.terms.map(key => VOCABULARY.find(item => item.key === key)?.term || key).join(', ') || 'None' },
          { label: 'Paper requested', value: state.extension.flashcards.requestedPaper ? 'Yes' : 'No' },
          { label: 'Partner practice confirmed', value: state.extension.flashcards.partnerPractice ? 'Yes' : 'No' },
          { label: 'Flashcard reflection', value: state.extension.flashcards.reflection || 'Not answered' }
        );
      }
      if (state.extension.selected.quiz || state.extension.quiz.attempts.length) {
        extensionAnswers.push(
          { label: 'Knowledge quiz attempts', value: state.extension.quiz.attempts.length ? state.extension.quiz.attempts.map((attempt, index) => `Attempt ${index + 1}: ${attempt.score}/20`).join(' · ') : 'No submitted attempt' },
          { label: 'Knowledge quiz best score', value: state.extension.quiz.bestScore === null ? 'Not submitted' : `${state.extension.quiz.bestScore}/20` }
        );
        EXTENSION_QUIZ.forEach((item, index) => extensionAnswers.push({ label: `Quiz ${index + 1}. ${item.question}`, value: state.extension.quiz.answers[item.id] ? `${state.extension.quiz.answers[item.id]} — ${state.extension.quiz.answers[item.id] === item.answer ? 'correct' : 'needs review'}` : 'Not answered' }));
      }
      sections.push({ title: 'Optional Extension Choice Board', answers: extensionAnswers });
    }
    sections.push({ title: 'Plenary — Exit ticket', answers: [{ label: 'What is an algorithm?', value: state.plenary.algorithm || 'Not answered' }, { label: 'Why does sequence matter?', value: state.plenary.sequence || 'Not answered' }, { label: 'Classroom expectation', value: state.plenary.expectation || 'Not answered' }, { label: 'Improvement for next lesson', value: state.plenary.improve || 'Not answered' }, { label: 'Confidence', value: state.plenary.confidence || 'Not answered' }, { label: 'Challenge', value: state.plenary.challenge || 'Not attempted' }] });
    return { title: 'Year 7 Week 1 Theory — Thinking Like a Computer Scientist', learner: state.profile.name, className: state.profile.className, date: new Date().toLocaleString(), support: supportEnabled() ? `English + ${LANGUAGE_NAMES[state.profile.supportLanguage]} support` : 'English', sections };
  }
  function renderReportPreview() {
    const data = reportData(); const container = $('#reportPreview');
    container.innerHTML = `<h2>${escapeHtml(data.title)}</h2><p><strong>Name:</strong> ${escapeHtml(data.learner)} · <strong>Class:</strong> ${escapeHtml(data.className)}<br><strong>Created:</strong> ${escapeHtml(data.date)} · <strong>Reading support:</strong> ${escapeHtml(data.support)}</p><h3>WAGBA</h3><p>Explain how precise instructions form an algorithm and demonstrate safe, organised and independent KS3 Computer Science routines.</p>${data.sections.map(section => `<h3>${escapeHtml(section.title)}</h3><dl>${section.answers.map(answer => `<dt>${escapeHtml(answer.label)}</dt><dd>${escapeHtml(answer.value)}</dd>`).join('')}</dl>`).join('')}<h3>Learning interaction summary</h3><p>${state.interactionLog.length} saved interactions · ${state.main1.runs || 0} algorithm tests · Starter ${state.starter.score ?? 'not checked'}/4 · Scratch ${state.main2.scratchScore ?? 'not checked'}/4 · IPO ${state.main2.ipoScore ?? 'not checked'}/3 · Safety ${state.main2.safetyScore ?? 'not checked'}/2</p><h3>Submission instruction</h3><p>Upload this PDF to the Microsoft Teams Assignment named <strong>Week 1 Theory</strong>.</p>`;
    container.classList.remove('hidden');
  }
  function buildPdfLines() {
    const data = reportData(); const lines = [data.title, '', `Name: ${data.learner}`, `Class: ${data.className}`, `Date: ${data.date}`, `Reading support: ${data.support}`, '', 'WAGBA', 'Explain how precise instructions form an algorithm and demonstrate safe, organised and independent KS3 Computer Science routines.', ''];
    data.sections.forEach(section => { lines.push(section.title.toUpperCase()); section.answers.forEach(answer => { lines.push(`${answer.label}:`); lines.push(answer.value); lines.push(''); }); });
    lines.push('LEARNING INTERACTION SUMMARY', `${state.interactionLog.length} saved interactions`, `${state.main1.runs || 0} algorithm tests`, '');
    state.interactionLog.slice(-20).forEach(item => lines.push(`${new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${item.action}${item.detail ? `: ${item.detail}` : ''}`));
    lines.push('', 'MICROSOFT TEAMS', 'Upload this PDF to the assignment named Week 1 Theory. Upload the PDF file, not screenshots.'); return lines;
  }
  function exportPdf() {
    if (!coreComplete() && !state.profile.teacherMode) { $('#exportMessage').textContent = 'Complete every core section before exporting.'; return; }
    try {
      logInteraction('PDF exported', 'Week 1 Theory'); state.submission.exportedAt = new Date().toISOString();
      const filename = `Year7_${sanitizeFilename(state.profile.className)}_${sanitizeFilename(state.profile.name)}_Week1_Theory.pdf`;
      const blob = createSimplePdf(buildPdfLines()); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
      saveState(); $('#exportMessage').textContent = `Downloaded ${filename}. Open it, then upload it to Teams: Week 1 Theory.`;
    } catch (error) { console.error(error); $('#exportMessage').textContent = 'The PDF could not be generated. Use Print / Save as PDF or ask your teacher for help.'; }
  }
  function createSimplePdf(rawLines) {
    const pageWidth = 595, pageHeight = 842, left = 45, top = 797, lineHeight = 14, maxChars = 90, maxLines = 52; const wrapped = [];
    rawLines.forEach(line => { const cleaned = toPdfAscii(String(line)); if (!cleaned) wrapped.push(''); else wrapText(cleaned, maxChars).forEach(part => wrapped.push(part)); });
    const pages = []; for (let index = 0; index < wrapped.length; index += maxLines) pages.push(wrapped.slice(index, index + maxLines)); if (!pages.length) pages.push(['No responses recorded.']);
    const objects = []; objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'; objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'; const kids = [];
    pages.forEach((pageLines, pageIndex) => { const pageObject = 4 + pageIndex * 2, contentObject = pageObject + 1; kids.push(`${pageObject} 0 R`); objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObject} 0 R >>`; const content = ['BT', '/F1 9 Tf', `${left} ${top} Td`]; pageLines.forEach((line, index) => { if (index > 0) content.push(`0 -${lineHeight} Td`); content.push(`(${escapePdfText(line)}) Tj`); }); content.push('ET'); const stream = content.join('\n'); objects[contentObject] = `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`; });
    objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`; let pdf = '%PDF-1.4\n%PDFGEN\n'; const offsets = [0];
    for (let index = 1; index < objects.length; index += 1) { offsets[index] = byteLength(pdf); pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`; }
    const xrefOffset = byteLength(pdf); pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`; for (let index = 1; index < objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`; pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new Blob([new TextEncoder().encode(pdf)], { type: 'application/pdf' });
  }
  function wrapText(text, maxChars) { const words = text.split(/\s+/); const lines = []; let current = ''; words.forEach(word => { if (!current) current = word; else if (`${current} ${word}`.length <= maxChars) current += ` ${word}`; else { lines.push(current); current = word; } }); if (current) lines.push(current); return lines.length ? lines : ['']; }
  function toPdfAscii(text) { return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x20-\x7E]/g, '?'); }
  function escapePdfText(text) { return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
  function byteLength(text) { return new TextEncoder().encode(text).length; }
  function sanitizeFilename(value) { return String(value || 'Student').trim().replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'Student'; }

  function bindGlobalControls() {
    $('#profileForm').addEventListener('submit', event => {
      event.preventDefault(); const name = $('#studentName').value.trim(); const teacherMode = name.toLowerCase() === 'teacher' || new URLSearchParams(location.search).get('teacher') === '1'; const className = teacherMode ? ($('#studentClass').value.trim() || 'TEST') : $('#studentClass').value.trim();
      if (!name || !className) { alert('Enter your full name and class.'); return; }
      const mode = teacherMode ? 'english' : ($('input[name="supportMode"]:checked')?.value || 'english');
      setProfile({ name: teacherMode ? 'Teacher' : name, className, teacherMode, supportMode: mode, supportLanguage: $('#supportLanguage').value || 'ms' });
    });
    $('#studentName').addEventListener('input', () => { const teacher = $('#studentName').value.trim().toLowerCase() === 'teacher'; $('#studentClass').required = !teacher; if (teacher && !$('#studentClass').value.trim()) $('#studentClass').placeholder = 'Optional for teacher'; });
    $$('input[name="supportMode"]').forEach(input => input.addEventListener('change', () => { const enabled = input.value === 'supported' && input.checked; $('#supportLanguageWrap').classList.toggle('hidden', !enabled); $('#supportLanguage').disabled = !enabled; }));
    $('#changeLearnerBtn').addEventListener('click', () => { $('#studentName').value = state.profile.teacherMode ? 'teacher' : state.profile.name || ''; $('#studentClass').value = state.profile.teacherMode ? '' : state.profile.className || ''; const mode = state.profile.supportMode || 'english'; $(`input[name="supportMode"][value="${mode}"]`).checked = true; $('#supportLanguage').value = state.profile.supportLanguage || 'ms'; $('#supportLanguageWrap').classList.toggle('hidden', mode !== 'supported'); $('#supportLanguage').disabled = mode !== 'supported'; $('#profileOverlay').classList.remove('hidden'); });
    $('#resetProgressBtn').addEventListener('click', () => { if (!currentStorageKey || !confirm('Delete all saved work for this learner and restart?')) return; localStorage.removeItem(currentStorageKey); location.reload(); });
    $('#learningPanelToggle').addEventListener('click', () => { const panel = $('.learning-panel'); panel.classList.toggle('collapsed'); const open = !panel.classList.contains('collapsed'); $('#learningPanelToggle').setAttribute('aria-expanded', String(open)); $('#learningPanelToggle span').textContent = open ? '−' : '+'; });
    $('#glossaryBtn').addEventListener('click', () => { renderGlossary(); openDialog($('#glossaryDialog')); });
    $('#languageBtn').addEventListener('click', () => { $('#settingsSupportMode').value = state.profile.supportMode || 'english'; $('#settingsSupportLanguage').value = state.profile.supportLanguage || 'ms'; openDialog($('#languageDialog')); });
    $('#saveLanguageSettings').addEventListener('click', () => { state.profile.supportMode = $('#settingsSupportMode').value; state.profile.supportLanguage = $('#settingsSupportLanguage').value; renderAllSupport(); saveState('Language settings changed', state.profile.supportMode); closeDialog($('#languageDialog')); });
    $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog($(`#${button.dataset.closeDialog}`))));
    $$('.image-zoom').forEach(button => button.addEventListener('click', () => { $('#dialogImage').src = button.dataset.image; $('#dialogImage').alt = button.dataset.alt || ''; openDialog($('#imageDialog')); }));
    $$('img').forEach(image => image.addEventListener('error', () => { const fallback = document.createElement('div'); fallback.className = 'missing-image'; fallback.textContent = `Image unavailable: ${image.alt || 'lesson visual'}`; image.replaceWith(fallback); }));
    $$('.read-aloud').forEach(button => button.addEventListener('click', () => { if (!('speechSynthesis' in window)) { alert('Read-aloud is not available in this browser.'); return; } speechSynthesis.cancel(); const card = button.closest('.lesson-card').cloneNode(true); $$('button, input, textarea, select, .language-help', card).forEach(element => element.remove()); const utterance = new SpeechSynthesisUtterance(card.textContent.replace(/\s+/g, ' ').trim()); utterance.lang = 'en-GB'; utterance.rate = .92; speechSynthesis.speak(utterance); }));
    $$('.next-section').forEach(button => button.addEventListener('click', () => {
      const current = button.closest('.lesson-section').dataset.section;
      const issues = getSectionIssues(current);
      if (issues.length && !state.profile.teacherMode && !state.unlockedAll) { focusIssue(current, issues[0]); return; }
      showCompletionNotice(`${SECTION_LABELS[current]} complete. Moving to ${SECTION_LABELS[button.dataset.next]}.`, true);
      showSection(button.dataset.next, true);
    }));
    document.addEventListener('input', event => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      target.classList.remove('needs-attention');
      target.closest('.lesson-card')?.classList.remove('card-needs-attention');
    });
    document.addEventListener('change', event => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      target.classList.remove('needs-attention');
      target.closest('label')?.classList.remove('needs-attention');
      target.closest('.lesson-card')?.classList.remove('card-needs-attention');
    });
  }

  function bindActivityControls() {
    $('#checkStarterBtn').addEventListener('click', checkStarter); $('#checkScratchBtn').addEventListener('click', checkScratch); $('#checkIpoBtn').addEventListener('click', checkIpo); $('#checkSafetyBtn').addEventListener('click', checkSafety); $('#testAlgorithmBtn').addEventListener('click', testAlgorithm);
    $('#undoCommandBtn').addEventListener('click', () => { state.main1.algorithm.pop(); state.main1.tested = false; state.main1.success = false; state.main1.testResult = ''; state.main1.lastPath = []; state.main1.lastRobot = null; saveState('Robot command removed'); renderAlgorithmList(); renderRobotGrid(); updateRobotFeedback(); });
    $('#clearCommandsBtn').addEventListener('click', () => { state.main1.algorithm = []; state.main1.tested = false; state.main1.success = false; state.main1.testResult = ''; state.main1.lastPath = []; state.main1.lastRobot = null; saveState('Robot algorithm cleared'); renderAlgorithmList(); renderRobotGrid(); updateRobotFeedback(); });
    $$('.extension-open').forEach(button => button.addEventListener('click', () => openExtensionActivity(button.dataset.extensionChoice)));
    $$('.extension-back').forEach(button => button.addEventListener('click', showExtensionChoiceBoard));
    $('#checkExtensionSequenceBtn').addEventListener('click', checkExtensionSequence);
    $('#extensionUndoCommandBtn').addEventListener('click', () => { const progress = activeMissionState(); progress.algorithm.pop(); progress.lastResult = ''; progress.lastPath = []; progress.lastRobot = null; progress.collected = []; saveState('Extension robot command removed', activeMissionDefinition().id); renderExtensionRobotLab(); });
    $('#extensionClearCommandsBtn').addEventListener('click', () => { const progress = activeMissionState(); progress.algorithm = []; progress.lastResult = ''; progress.lastPath = []; progress.lastRobot = null; progress.collected = []; saveState('Extension robot algorithm cleared', activeMissionDefinition().id); renderExtensionRobotLab(); });
    $('#testExtensionAlgorithmBtn').addEventListener('click', testExtensionAlgorithm);
    $('#saveFlashcardAttemptBtn').addEventListener('click', saveFlashcardAttempt);
    $('#quizPreviousBtn').addEventListener('click', () => { state.extension.quiz.current = Math.max(0, state.extension.quiz.current - 1); saveState('Extension quiz question opened', String(state.extension.quiz.current + 1)); renderExtensionQuiz(); });
    $('#quizNextBtn').addEventListener('click', () => { state.extension.quiz.current = Math.min(EXTENSION_QUIZ.length - 1, state.extension.quiz.current + 1); saveState('Extension quiz question opened', String(state.extension.quiz.current + 1)); renderExtensionQuiz(); });
    $('#submitExtensionQuizBtn').addEventListener('click', submitExtensionQuiz);
    $('#previewReportBtn').addEventListener('click', renderReportPreview); $('#exportPdfBtn').addEventListener('click', exportPdf); $('#printReportBtn').addEventListener('click', () => { renderReportPreview(); logInteraction('Print fallback opened'); saveState(); window.print(); });
  }

  function init() {
    renderKeywordButtons(); renderStarterCards(); renderOrderTask('sequenceOrderTask', SEQUENCE_ITEMS, 'main2'); renderOrderTask('extensionOrderTask', EXTENSION_ITEMS, 'extension'); renderCommands(); renderAlgorithmList(); renderRobotGrid();
    Object.keys(DEFAULT_STATE.decks).forEach(deck => setDeck(deck, 0, false)); bindPersistentFields(); bindGlobalControls(); bindActivityControls(); renderAllSupport(); refreshUI();
    const params = new URLSearchParams(location.search); if (params.get('teacher') === '1') { $('#studentName').value = 'teacher'; $('#studentClass').value = 'TEST'; $('#studentClass').required = false; }
  }

  init();
})();
