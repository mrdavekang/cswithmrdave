/* =============================================================
   Year 7 Computer Science — Term 1, Week 1 project lesson
   Redesigned as a realistic 60-minute, scaffolded learning journey.
   ============================================================= */

const CONFIG = {
  SCRATCH_EDITOR_URL: 'https://scratch.mit.edu/projects/editor/',
  TEAMS_ASSIGNMENT_NAME: 'Week 1 Project',
  LESSON_ID: 'y7-t1-w1-turtle-redesign',
  YEAR_GROUP: 'Year7',
  MIN_ANSWER_LENGTH: 8,
  PYTHON_EXEC_LIMIT_SECONDS: 20
};

const LESSON = {
  unit: 'Computational Thinking and Python Turtle',
  term: 'Term 1',
  week: 'Week 1',
  weekLabel: 'Term 1, Week 1',
  title: 'From Blocks to Text: Create a Wayfinding Tile',
  subject: 'Year 7 Computer Science',
  estimatedMinutes: 60,
  teamsAssignment: 'Week 1 Project',
  keyTopic: 'From Blocks to Text: Scratch and Python Turtle',
  wagba:
    'Run and compare Scratch and Python Turtle programs, then adapt a guided program to create, test and explain a wayfinding symbol.',
  knowledge: [
    'a sequence is the order in which commands run',
    'Scratch uses blocks while Python uses text commands',
    'distance controls how far the Turtle moves',
    'angle controls how far the Turtle turns',
    'a meaningful filename helps people identify a saved file'
  ],
  skills: [
    'predict and run a short program',
    'change one value and observe its effect',
    'use Python Turtle movement and turn commands',
    'test, improve, save and explain a program'
  ],
  understanding: [
    'the same algorithm can be represented in different programming languages',
    'computers follow commands exactly and in order',
    'testing provides evidence for a purposeful improvement'
  ],
  keywords: [
    'algorithm', 'sequence', 'program', 'command', 'block-based', 'text-based',
    'output', 'Turtle', 'distance', 'angle', 'test', 'debug', 'version'
  ],
  challenge:
    'Adapt the guided code so that your symbol points in a different direction, and explain which angle made it work.',
  projectDescription:
    'You will compare one Scratch program with an equivalent Python Turtle program. You will then adapt guided Python code to make a clear wayfinding symbol for a new student, test it and explain one improvement.',
  submissionFiles: [
    'Your PDF evidence report',
    'Your Scratch project file (.sb3)',
    'Your final Python file (.py)'
  ],
  folderStructure:
    'Computing\n' +
    '└── Year 7\n' +
    '    └── Term 1\n' +
    '        └── T1.1 Computational Thinking and Turtle'
};

/* Core time = 4 + 6 + 3 + 25 + 14 + 3 + 3 + 2 = 60 minutes. */
const SECTIONS = [
  { id: 'welcome',   title: 'Welcome and setup',        short: 'Welcome',    minutes: 4,  optional: false },
  { id: 'starter',   title: 'Starter',                  short: 'Starter',    minutes: 6,  optional: false },
  { id: 'pit1',      title: 'Learning Pit Stop 1',      short: 'Pit Stop 1', minutes: 3,  optional: false },
  { id: 'main1',     title: 'Main Activity 1',          short: 'Main 1',     minutes: 25, optional: false },
  { id: 'main2',     title: 'Main Activity 2',          short: 'Main 2',     minutes: 14, optional: false },
  { id: 'extension', title: 'Optional extension',       short: 'Extension',  minutes: 8,  optional: true },
  { id: 'pit2',      title: 'Learning Pit Stop 2',      short: 'Pit Stop 2', minutes: 3,  optional: false },
  { id: 'plenary',   title: 'Plenary',                  short: 'Plenary',    minutes: 3,  optional: false },
  { id: 'export',    title: 'Review, export and submit', short: 'Export',     minutes: 2,  optional: false }
];

const SECTION_SUBTITLES = {
  welcome: 'Know the project, privacy rules and filenames',
  starter: 'Predict the same route in two languages',
  pit1: 'Identify Knowledge, Skills and Understanding',
  main1: 'Run and modify the square in Scratch and Python',
  main2: 'Adapt guided code into a wayfinding symbol',
  pit2: 'Decide where your learning is now',
  plenary: 'Explain the most important learning',
  export: 'Check the essential evidence and create your PDF',
  extension: 'Choose an extra challenge if time remains'
};

const LANGUAGE_NAMES = {
  'ms': 'Bahasa Melayu',
  'zh-CN': '简体中文',
  'ko': '한국어',
  'ar': 'العربية'
};

/* English stays visible. These short summaries support meaning rather than
   translating answers or removing the need to learn English CS vocabulary. */
const SUPPORT_COPY = {
  'ms': {
    overview: 'Bandingkan arahan Scratch dengan Python. Kemudian ubah kod berpandu untuk membuat simbol arah, uji dan terangkan penambahbaikan.',
    starter: 'Ramalkan laluan sebelum menjalankan program. Jarak menentukan sejauh mana bergerak; sudut menentukan sejauh mana berpusing.',
    pit1: 'Pengetahuan ialah fakta; kemahiran ialah apa yang anda lakukan; pemahaman ialah apabila anda boleh menerangkan sebabnya.',
    main1: 'Bina petak dalam Scratch, kemudian jalankan petak yang sama dalam Python. Ubah 100 kepada 60 dan bandingkan hasilnya.',
    main2: 'Pilih tahap sokongan, rancang simbol arah, jalankan kod sekurang-kurangnya dua kali dan buat satu penambahbaikan.',
    pit2: 'Pilih keadaan pembelajaran anda dengan jujur. Ini bukan markah; pilihan anda menentukan bantuan atau cabaran seterusnya.',
    plenary: 'Terangkan bagaimana satu perubahan pada jarak atau sudut mengubah output.'
  },
  'zh-CN': {
    overview: '比较 Scratch 与 Python 指令，然后修改引导代码，制作方向标志、测试并说明一次改进。',
    starter: '运行前先预测路线。距离决定前进多远，角度决定转动多少。',
    pit1: '知识是需要记住的事实；技能是你实际做的事情；理解是你能够解释原因。',
    main1: '先在 Scratch 画正方形，再在 Python 中运行相同图形。把 100 改为 60，并比较结果。',
    main2: '选择适合的支持程度，规划方向标志，至少运行两次并作出一次改进。',
    pit2: '诚实选择你现在的学习状态。这不是分数；你的选择会提供下一步帮助或挑战。',
    plenary: '解释改变距离或角度如何改变程序输出。'
  },
  'ko': {
    overview: 'Scratch 명령과 Python 명령을 비교한 뒤 안내 코드를 바꾸어 방향 표지를 만들고, 테스트하고, 개선점을 설명합니다.',
    starter: '실행하기 전에 경로를 예측하세요. 거리는 이동 길이이고 각도는 회전 크기입니다.',
    pit1: '지식은 기억할 사실, 기능은 직접 하는 것, 이해는 왜 그런지 설명할 수 있는 것입니다.',
    main1: 'Scratch에서 정사각형을 만들고 Python에서 같은 그림을 실행하세요. 100을 60으로 바꾸고 결과를 비교하세요.',
    main2: '도움 수준을 선택하고 방향 표지를 계획한 뒤 두 번 이상 실행하고 한 가지를 개선하세요.',
    pit2: '현재 학습 상태를 솔직하게 고르세요. 점수가 아니며 다음 도움이나 도전을 정하는 데 사용됩니다.',
    plenary: '거리나 각도를 바꾸면 출력이 어떻게 달라지는지 설명하세요.'
  },
  'ar': {
    overview: 'قارن أوامر Scratch بأوامر Python، ثم عدّل الكود الموجّه لإنشاء رمز اتجاه واختباره وشرح تحسين واحد.',
    starter: 'توقّع المسار قبل تشغيل البرنامج. المسافة تحدد مقدار الحركة، والزاوية تحدد مقدار الدوران.',
    pit1: 'المعرفة هي الحقائق، والمهارة هي ما تقوم به، والفهم هو قدرتك على شرح السبب.',
    main1: 'أنشئ مربعاً في Scratch ثم شغّل المربع نفسه في Python. غيّر 100 إلى 60 وقارن النتيجة.',
    main2: 'اختر مستوى الدعم، وخطّط رمز الاتجاه، وشغّل الكود مرتين على الأقل، ثم حسّن شيئاً واحداً.',
    pit2: 'اختر مرحلة تعلمك بصدق. هذا ليس تقديراً؛ بل يساعدك على اختيار الدعم أو التحدي التالي.',
    plenary: 'اشرح كيف غيّر تعديل المسافة أو الزاوية ناتج البرنامج.'
  }
};

const VOCABULARY = [
  { key: 'algorithm', term: 'Algorithm', definition: 'A precise set of ordered instructions for completing a task.',
    ms: ['Algoritma', 'Satu set arahan tepat yang disusun mengikut urutan.'],
    'zh-CN': ['算法', '为完成任务而排列的一组精确指令。'],
    ko: ['알고리즘', '작업을 완료하기 위한 정확하고 순서 있는 명령입니다.'],
    ar: ['خوارزمية', 'مجموعة تعليمات دقيقة ومرتبة لإكمال مهمة.'] },
  { key: 'sequence', term: 'Sequence', definition: 'The order in which instructions are carried out.',
    ms: ['Urutan', 'Susunan arahan yang dijalankan.'], 'zh-CN': ['顺序', '指令执行的先后次序。'],
    ko: ['순서', '명령이 실행되는 차례입니다.'], ar: ['تسلسل', 'الترتيب الذي تُنفّذ به التعليمات.'] },
  { key: 'command', term: 'Command', definition: 'One instruction that tells the computer what to do.',
    ms: ['Arahan', 'Satu arahan yang memberitahu komputer apa yang perlu dilakukan.'],
    'zh-CN': ['命令', '告诉计算机做什么的一条指令。'], ko: ['명령', '컴퓨터가 무엇을 할지 알려 주는 한 가지 지시입니다.'],
    ar: ['أمر', 'تعليمة واحدة تخبر الحاسوب بما يجب فعله.'] },
  { key: 'distance', term: 'Distance', definition: 'How far the Turtle moves.',
    ms: ['Jarak', 'Sejauh mana Turtle bergerak.'], 'zh-CN': ['距离', 'Turtle 前进的远近。'],
    ko: ['거리', 'Turtle이 이동하는 길이입니다.'], ar: ['المسافة', 'المقدار الذي تتحركه السلحفاة.'] },
  { key: 'angle', term: 'Angle', definition: 'How far the Turtle turns, measured in degrees.',
    ms: ['Sudut', 'Sejauh mana Turtle berpusing, diukur dalam darjah.'],
    'zh-CN': ['角度', 'Turtle 转动的大小，以度为单位。'], ko: ['각도', 'Turtle이 도는 크기이며 도 단위로 잽니다.'],
    ar: ['زاوية', 'مقدار دوران السلحفاة ويُقاس بالدرجات.'] },
  { key: 'output', term: 'Output', definition: 'What a program produces, such as a drawing on the screen.',
    ms: ['Output', 'Hasil yang dihasilkan oleh program, seperti lukisan pada skrin.'],
    'zh-CN': ['输出', '程序产生的结果，例如屏幕上的图形。'], ko: ['출력', '화면의 그림처럼 프로그램이 만들어 내는 결과입니다.'],
    ar: ['مخرَج', 'ما ينتجه البرنامج، مثل رسم على الشاشة.'] },
  { key: 'debug', term: 'Debug', definition: 'Find and correct the cause of an error or unexpected result.',
    ms: ['Nyahpepijat', 'Cari dan betulkan punca ralat atau hasil yang tidak dijangka.'],
    'zh-CN': ['调试', '找出并修正错误或意外结果的原因。'], ko: ['디버그', '오류나 예상과 다른 결과의 원인을 찾아 고치는 것입니다.'],
    ar: ['تنقيح', 'العثور على سبب الخطأ أو النتيجة غير المتوقعة وتصحيحه.'] }
];

const STARTER_SCRATCH_BLOCKS = [
  { text: 'when green flag clicked', category: 'events' },
  { text: 'move 80 steps', category: 'motion' },
  { text: 'turn ↻ 90 degrees', category: 'motion' },
  { text: 'move 50 steps', category: 'motion' }
];

const STARTER_PYTHON_CODE = 't.forward(80)\nt.right(90)\nt.forward(50)';

const STARTER_QUESTIONS = [
  { id: 'starter_route', type: 'choice', prompt: 'What route will both programs produce?',
    options: ['A straight line', 'An L-shaped route', 'A complete square', 'A circle'], answer: 1,
    feedback: 'Both programs move forward, make a right turn, then move forward again. This creates an L-shaped route.' },
  { id: 'starter_match_forward', type: 'choice', prompt: 'Which Scratch block matches t.forward(80)?',
    options: ['when green flag clicked', 'move 80 steps', 'turn 90 degrees', 'move 50 steps'], answer: 1,
    feedback: 'Both commands move forward by 80.' },
  { id: 'starter_angle45', type: 'choice', prompt: 'What changes if 90 is replaced with 45?',
    options: ['The route turns less sharply', 'The line becomes longer', 'The program stops', 'The Turtle turns left'], answer: 0,
    feedback: 'A 45-degree turn is smaller than a 90-degree turn, so the route bends less sharply.' },
  { id: 'starter_order', type: 'written', min: 6,
    prompt: 'Why does the order of the commands matter?',
    hint: 'Sentence frame: The order matters because the computer…' }
];

const LEARNING_TYPES = [
  { id: 'knowledge', title: 'Knowledge', summary: 'Facts, vocabulary and information I need to remember.',
    evidence: ['I matched a Scratch block with a Python command.', 'I identified distance and angle.', 'I remembered what sequence means.'],
    actions: ['Open the vocabulary guide.', 'Explain one keyword to a partner.', 'Find the distance and angle in another command.'] },
  { id: 'skills', title: 'Skills', summary: 'Something practical I perform and improve through practice.',
    evidence: ['I predicted a program output.', 'I traced the commands in order.', 'I checked an answer and improved it.'],
    actions: ['Use Predict → Run → Check.', 'Change one value at a time.', 'Practise the same skill with a new value.'] },
  { id: 'understanding', title: 'Understanding', summary: 'I can explain why something works and connect ideas.',
    evidence: ['I explained why order matters.', 'I connected Scratch blocks to Python text.', 'I explained how an angle changes a route.'],
    actions: ['Use “because” in an explanation.', 'Explain the route to a partner.', 'Predict a change before testing it.'] }
];

const SCRATCH_SQUARE_BLOCKS = [
  { text: 'when green flag clicked', category: 'events' },
  { text: 'erase all', category: 'pen' },
  { text: 'go to x: 0 y: 0', category: 'motion' },
  { text: 'point in direction 90', category: 'motion' },
  { text: 'set pen size to 4', category: 'pen' },
  { text: 'pen down', category: 'pen' },
  { text: 'move 100 steps', category: 'motion' },
  { text: 'turn ↻ 90 degrees', category: 'motion' },
  { text: 'move 100 steps', category: 'motion' },
  { text: 'turn ↻ 90 degrees', category: 'motion' },
  { text: 'move 100 steps', category: 'motion' },
  { text: 'turn ↻ 90 degrees', category: 'motion' },
  { text: 'move 100 steps', category: 'motion' },
  { text: 'turn ↻ 90 degrees', category: 'motion' },
  { text: 'pen up', category: 'pen' }
];

const SCRATCH_PREDICTIONS = [
  { id: 'm1_pred_shape', type: 'choice', prompt: 'What shape will the blocks draw?',
    options: ['Triangle', 'Square', 'Straight line', 'Circle'], answer: 1,
    feedback: 'Four equal moves and four 90-degree turns draw a square.' },
  { id: 'm1_pred_finish', type: 'choice', prompt: 'Where will the sprite finish?',
    options: ['At the starting point', 'At the top of the stage', 'Outside the stage', 'In the centre of the square'], answer: 0,
    feedback: 'The fourth side returns the sprite to the starting point.' }
];

const PYTHON_SQUARE_CODE =
  'import turtle as t\n\n' +
  't.shape("turtle")\n' +
  't.speed(3)\n' +
  't.pensize(4)\n\n' +
  't.forward(100)\nt.right(90)\n' +
  't.forward(100)\nt.right(90)\n' +
  't.forward(100)\nt.right(90)\n' +
  't.forward(100)\nt.right(90)\n\n' +
  't.done()\n';

const PYTHON_PREDICTIONS = [
  { id: 'm1_py_side', type: 'choice', prompt: 'Which number controls each side length?',
    options: ['3', '4', '90', '100'], answer: 3, feedback: 'The 100 inside forward(100) controls distance.' },
  { id: 'm1_py_angle', type: 'choice', prompt: 'Which number controls each turn?',
    options: ['3', '4', '90', '100'], answer: 2, feedback: 'The 90 inside right(90) controls the angle.' },
  { id: 'm1_py_same', type: 'choice', prompt: 'What stays the same across Scratch and Python?',
    options: ['Only the colour', 'The algorithm and output', 'The filenames', 'The buttons'], answer: 1,
    feedback: 'The commands look different, but the ordered algorithm and intended output stay the same.' }
];

const COMPARISON_ROWS = [
  { scratch: 'move 100 steps', python: 't.forward(100)' },
  { scratch: 'turn ↻ 90 degrees', python: 't.right(90)' },
  { scratch: 'green flag', python: 'Run button' },
  { scratch: 'Pen draws on the stage', python: 'Turtle draws on the canvas' }
];

const PATHWAYS = [
  {
    id: 'support', title: 'Guided pathway', label: 'Complete and adapt a working arrow',
    description: 'Best if Python Turtle is new. Run a complete arrow, then change at least two values or make it point another way.',
    code:
      'import turtle as t\n\n' +
      't.shape("turtle")\nt.speed(4)\nt.pensize(6)\n\n' +
      '# Move to the left without drawing\n' +
      't.penup()\nt.goto(-120, 0)\nt.pendown()\n\n' +
      '# Draw the arrow shaft\n' +
      't.forward(180)\n\n' +
      '# Draw the two sides of the arrow head\n' +
      't.left(135)\nt.forward(60)\nt.backward(60)\n' +
      't.right(270)\nt.forward(60)\n\n' +
      't.done()\n'
  },
  {
    id: 'core', title: 'Core pathway', label: 'Finish a partly built arrow',
    description: 'Best if you can already edit short programs. The shaft is ready; add the two sides of the arrow head.',
    code:
      'import turtle as t\n\n' +
      't.shape("turtle")\nt.speed(4)\nt.pensize(6)\n\n' +
      't.penup()\nt.goto(-120, 0)\nt.pendown()\n' +
      't.forward(180)\n\n' +
      '# Add the first side of the arrow head below\n' +
      '# Hint: turn 135, move 60, then go backward 60\n\n' +
      '# Add the second side of the arrow head below\n' +
      '# Hint: turn 270, then move 60\n\n' +
      't.done()\n'
  },
  {
    id: 'challenge', title: 'Independent pathway', label: 'Create your own clear directional symbol',
    description: 'Choose this only if you can confidently use forward(), backward(), left() and right().',
    code:
      'import turtle as t\n\n' +
      't.shape("turtle")\nt.speed(4)\nt.pensize(6)\n\n' +
      '# Plan, then add your sequence below\n\n\n' +
      't.done()\n'
  }
];

const PROJECT_BRIEF =
  'A new Year 7 student is standing in a school corridor. Create one simple sign that clearly shows which way to move next. Your program should draw an arrow or another familiar direction symbol—not a whole school map.';

const CODE_HELPERS = [
  { id: 'help_line', title: 'Draw a line', desc: 'The number is the distance.', code: 't.forward(120)' },
  { id: 'help_right', title: 'Turn right', desc: 'The number is an angle in degrees.', code: 't.right(90)' },
  { id: 'help_left', title: 'Turn left', desc: 'The number is an angle in degrees.', code: 't.left(90)' },
  { id: 'help_back', title: 'Move backward', desc: 'Useful for returning to the arrow tip.', code: 't.backward(60)' }
];

const LEARNING_PHASES = [
  { id: 'new', title: 'New Learning', summary: 'This was new. I was in a useful struggle and made progress.',
    evidence: ['I ran Python Turtle for the first time.', 'I learned what forward() and right() do.', 'I learned how distance or angle changes a drawing.'],
    actions: ['Repeat the working square.', 'Use the command guide.', 'Explain one successful change.'] },
  { id: 'consolidating', title: 'Consolidating', summary: 'I used something I knew and became more accurate or independent.',
    evidence: ['I connected Scratch with Python.', 'I corrected an error with less help.', 'I improved my symbol after testing.'],
    actions: ['Explain why the code works.', 'Improve the design.', 'Try a new distance or direction.'] },
  { id: 'treading', title: 'Treading Water', summary: 'The work felt easy or I mostly copied, so I need a stronger challenge.',
    evidence: ['I copied the example without changing it.', 'I already knew the commands.', 'I finished without needing to think carefully.'],
    actions: ['Make the arrow point another way.', 'Change the proportions.', 'Explain why the angles work.'] },
  { id: 'drowning', title: 'Drowning — I need help now', summary: 'I cannot move forward independently yet. This is a request for support, not a grade.',
    evidence: ['I cannot run the program.', 'I do not understand a command.', 'My output is unexpected.', 'I have an error message.', 'I understand the code but not the English instructions.'],
    actions: ['Return to the working square.', 'Load the guided pathway.', 'Open vocabulary or language help.', 'Show the first error to my teacher.'] }
];

const EXTENSION_OPTIONS = [
  'Make the arrow point in another direction',
  'Create a turning arrow',
  'Add a simple border',
  'Create a destination flag',
  'Create and save a second improved version'
];

const EXTENSION_STARTER_CODE = PATHWAYS[0].code;

const EXIT_TICKET = [
  { id: 'exit_learning', min: 8, prompt: 'What did changing a distance or angle do to your output?',
    hint: 'Sentence frame: When I changed ___ from ___ to ___, the output…' },
  { id: 'exit_understanding', min: 8, prompt: 'How can Scratch and Python follow the same algorithm?',
    hint: 'Sentence frame: They look different, but both…' }
];

const SUBMISSION_CHECKLIST = [
  { id: 'sub_pdf', label: 'My PDF has downloaded and shows my name and class.' },
  { id: 'sub_sb3', label: 'My Scratch .sb3 file is saved in my T1.1 folder.' },
  { id: 'sub_py', label: 'My Python .py file is saved in my T1.1 folder.' },
  { id: 'sub_uploaded', label: 'I uploaded all three files to the Week 1 Project assignment in Teams.' }
];

const SUBMISSION_REMINDERS = [
  'Check that your name and class appear in the PDF.',
  'Upload the PDF, .sb3 and .py files—not screenshots of the files.',
  'Keep your files until Teams shows that the submission is complete.'
];

window.CONFIG = CONFIG;
window.LESSON = LESSON;
window.LESSON_DATA = {
  CONFIG, LESSON, SECTIONS, SECTION_SUBTITLES,
  LANGUAGE_NAMES, SUPPORT_COPY, VOCABULARY,
  STARTER_SCRATCH_BLOCKS, STARTER_PYTHON_CODE, STARTER_QUESTIONS,
  LEARNING_TYPES, SCRATCH_SQUARE_BLOCKS, SCRATCH_PREDICTIONS,
  PYTHON_SQUARE_CODE, PYTHON_PREDICTIONS, COMPARISON_ROWS,
  PATHWAYS, PROJECT_BRIEF, CODE_HELPERS, LEARNING_PHASES,
  EXTENSION_OPTIONS, EXTENSION_STARTER_CODE, EXIT_TICKET,
  SUBMISSION_CHECKLIST, SUBMISSION_REMINDERS
};
