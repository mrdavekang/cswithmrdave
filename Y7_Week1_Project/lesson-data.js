/* =============================================================
   lesson-data.js
   Year 7 Computer Science — Term 1, Week 1 project lesson.
   All lesson content lives here so that it can be edited without
   touching application logic.
   ============================================================= */

/* -------------------------------------------------------------
   CONFIGURATION
   Edit these values to adapt the lesson for your school.
   ------------------------------------------------------------- */
const CONFIG = {
  /* The official Scratch editor is opened in a new browser tab.
     Replace this URL if your school uses a hosted/offline Scratch. */
  SCRATCH_EDITOR_URL: 'https://scratch.mit.edu/projects/editor/',

  /* Microsoft Teams assignment name shown to students. */
  TEAMS_ASSIGNMENT_NAME: 'Week 1 Project',

  /* Lesson identifier used for progress keys. Change per lesson. */
  LESSON_ID: 'y7-t1-w1-turtle',

  /* Year group used in exported filenames. */
  YEAR_GROUP: 'Year7',

  /* Minimum characters required for a written answer to count. */
  MIN_ANSWER_LENGTH: 15,

  /* Maximum seconds a Python program may run before being stopped. */
  PYTHON_EXEC_LIMIT_SECONDS: 20
};

/* -------------------------------------------------------------
   LESSON HEADER + LEARNING INFORMATION (sticky panel)
   ------------------------------------------------------------- */
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
    'Run and compare short Scratch and Python Turtle programs, organise project files ' +
    'correctly, and create a simple wayfinding tile using a precise sequence of commands.',

  knowledge: [
    'a program consists of instructions executed in a sequence',
    'Scratch represents instructions using blocks',
    'Python represents instructions using text',
    'Python Turtle uses movement and turning commands',
    'the order and values of commands affect the output',
    'project files should be stored using meaningful folders and filenames'
  ],

  skills: [
    'predict the output of a short program',
    'run and modify a Scratch program',
    'run and modify Python Turtle code',
    'identify matching instructions across two programming languages',
    'create a simple Turtle drawing',
    'test and improve a program',
    'capture evidence',
    'save and export project files correctly'
  ],

  understanding: [
    'computers follow commands exactly',
    'changing the order of commands changes the output',
    'the same algorithm can be represented in different programming languages',
    'errors and unexpected outputs are part of programming',
    'testing, debugging and file organisation are essential project habits'
  ],

  keywords: [
    'algorithm', 'sequence', 'program', 'command', 'block-based', 'text-based',
    'output', 'Turtle', 'distance', 'angle', 'test', 'debug', 'file', 'folder', 'version'
  ],

  challenge:
    'Create a recognisable directional symbol and explain which commands produce each part of it.',

  projectDescription:
    'In this project you will compare a Scratch program with a Python Turtle program, ' +
    'organise your project files, then design and build your own wayfinding tile — a simple ' +
    'directional symbol that could help a new student find their way around school. ' +
    'You will test your program, improve it, and export an evidence report.',

  submissionFiles: [
    'Your exported PDF evidence report',
    'Your completed Scratch project file (.sb3)',
    'Your completed Python file (.py)'
  ],

  folderStructure:
    'Computing\n' +
    '└── Year 7\n' +
    '    └── Term 1\n' +
    '        └── T1.1 Computational Thinking and Turtle'
};

/* -------------------------------------------------------------
   SECTIONS — order, timing and unlocking behaviour
   ------------------------------------------------------------- */
const SECTIONS = [
  { id: 'welcome',   title: 'Welcome and setup',      short: 'Welcome',    minutes: 3,  optional: false },
  { id: 'starter',   title: 'Starter',                short: 'Starter',    minutes: 7,  optional: false },
  { id: 'main1',     title: 'Main Activity 1',        short: 'Main 1',     minutes: 20, optional: false },
  { id: 'main2',     title: 'Main Activity 2',        short: 'Main 2',     minutes: 25, optional: false },
  { id: 'extension', title: 'Extension (optional)',   short: 'Extension',  minutes: 8,  optional: true  },
  { id: 'plenary',   title: 'Plenary',                short: 'Plenary',    minutes: 8,  optional: false },
  { id: 'review',    title: 'Evidence review',        short: 'Review',     minutes: 3,  optional: false },
  { id: 'export',    title: 'Export and submission',  short: 'Export',     minutes: 3,  optional: false }
];

const SECTION_SUBTITLES = {
  welcome:   'Set up your project folder and filenames',
  starter:   'Same route, different language',
  main1:     'One drawing, two programming languages',
  main2:     'Create a wayfinding tile',
  extension: 'Choose one challenge',
  plenary:   'Test, save and explain',
  review:    'Check everything before you export',
  export:    'Create your PDF and submit to Microsoft Teams'
};

/* -------------------------------------------------------------
   WELCOME — project setup checklist
   ------------------------------------------------------------- */
const SETUP_CHECKLIST = [
  { id: 'setup_folder',    label: 'I created the correct folder.' },
  { id: 'setup_where',     label: 'I understand where my files will be saved.' },
  { id: 'setup_downloads', label: 'I will not work directly from the Downloads folder.' },
  { id: 'setup_names',     label: 'I will use meaningful filenames.' },
  { id: 'setup_versions',  label: 'I will save different versions when I make major changes.' }
];

/* -------------------------------------------------------------
   STARTER — side by side programs
   ------------------------------------------------------------- */
const STARTER_SCRATCH_BLOCKS = [
  { text: 'when green flag clicked',  category: 'events' },
  { text: 'move 80 steps',            category: 'motion' },
  { text: 'turn ↻ 90 degrees',        category: 'motion' },
  { text: 'move 50 steps',            category: 'motion' }
];

const STARTER_PYTHON_CODE =
  't.forward(80)\n' +
  't.right(90)\n' +
  't.forward(50)';

const STARTER_QUESTIONS = [
  {
    id: 'starter_route',
    type: 'choice',
    prompt: 'What route will each program produce?',
    options: [
      'A straight line 130 steps long.',
      'A long line, a right turn, then a shorter line — an L-shaped route.',
      'A complete square.',
      'A circle.'
    ],
    answer: 1,
    feedback:
      'Both programs move forward 80, turn 90° clockwise, then move forward 50. That produces ' +
      'an L-shaped (corner) route, not a closed shape.'
  },
  {
    id: 'starter_match_forward',
    type: 'choice',
    prompt: 'Which Scratch block matches t.forward(80)?',
    options: [
      'when green flag clicked',
      'move 80 steps',
      'turn ↻ 90 degrees',
      'move 50 steps'
    ],
    answer: 1,
    feedback: 't.forward(80) moves the Turtle forward 80 units — the same instruction as move 80 steps.'
  },
  {
    id: 'starter_match_right',
    type: 'choice',
    prompt: 'Which Scratch block matches t.right(90)?',
    options: [
      'move 80 steps',
      'turn ↻ 90 degrees',
      'when green flag clicked',
      'move 50 steps'
    ],
    answer: 1,
    feedback: 't.right(90) turns the Turtle 90 degrees clockwise — the same instruction as turn ↻ 90 degrees.'
  },
  {
    id: 'starter_angle45',
    type: 'choice',
    prompt: 'What might happen if 90 is changed to 45?',
    options: [
      'Nothing changes — only distances matter.',
      'The turn becomes shallower, so the corner opens out into a wider angle.',
      'The program stops working.',
      'The Turtle turns anticlockwise instead.'
    ],
    answer: 1,
    feedback:
      'The angle controls how far the Turtle rotates. A 45° turn is half of a 90° turn, so the ' +
      'route bends less sharply and the shape of the corner changes.'
  },
  {
    id: 'starter_order',
    type: 'written',
    prompt: 'Why does the order of the instructions matter?',
    hint: 'Think about what happens if the turn is carried out before the first move.'
  }
];

/* -------------------------------------------------------------
   MAIN ACTIVITY 1
   ------------------------------------------------------------- */
const MAIN1_SETUP_CHECKLIST = [
  { id: 'm1_chk_folder',   label: 'My T1.1 folder exists in the correct place.' },
  { id: 'm1_chk_filename', label: 'I have chosen suitable filenames for this lesson.' },
  { id: 'm1_chk_save',     label: 'I know I must save my work into that folder, not Downloads.' },
  { id: 'm1_chk_version',  label: 'I understand what v01 and v02 mean in a filename.' }
];

const SCRATCH_SQUARE_BLOCKS = [
  { text: 'when green flag clicked',   category: 'events' },
  { text: 'erase all',                 category: 'pen' },
  { text: 'go to x: 0 y: 0',           category: 'motion' },
  { text: 'point in direction 90',     category: 'motion' },
  { text: 'set pen size to 4',         category: 'pen' },
  { text: 'pen down',                  category: 'pen' },
  { text: 'move 100 steps',            category: 'motion' },
  { text: 'turn ↻ 90 degrees',         category: 'motion' },
  { text: 'move 100 steps',            category: 'motion' },
  { text: 'turn ↻ 90 degrees',         category: 'motion' },
  { text: 'move 100 steps',            category: 'motion' },
  { text: 'turn ↻ 90 degrees',         category: 'motion' },
  { text: 'move 100 steps',            category: 'motion' },
  { text: 'turn ↻ 90 degrees',         category: 'motion' },
  { text: 'pen up',                    category: 'pen' }
];

const SCRATCH_PREDICTIONS = [
  {
    id: 'm1_pred_shape',
    type: 'choice',
    prompt: 'What shape will be drawn?',
    options: ['A triangle', 'A square', 'A straight line', 'A circle'],
    answer: 1,
    feedback: 'Four equal moves separated by four 90° turns draw a square.'
  },
  {
    id: 'm1_pred_moves',
    type: 'choice',
    prompt: 'How many movement commands are used?',
    options: ['2', '3', '4', '8'],
    answer: 2,
    feedback: 'There are four move 100 steps blocks — one for each side of the square.'
  },
  {
    id: 'm1_pred_turns',
    type: 'choice',
    prompt: 'How many turns are used?',
    options: ['2', '3', '4', '6'],
    answer: 2,
    feedback: 'There are four turn ↻ 90 degrees blocks. The final turn returns the sprite to its starting direction.'
  },
  {
    id: 'm1_pred_finish',
    type: 'choice',
    prompt: 'Where will the sprite finish?',
    options: [
      'In the top right corner of the stage',
      'Back at x: 0 y: 0, facing direction 90',
      'Off the edge of the stage',
      'It is impossible to predict'
    ],
    answer: 1,
    feedback: 'A closed square returns the sprite to its starting position, and the fourth turn restores its starting direction.'
  },
  {
    id: 'm1_pred_angles',
    type: 'written',
    prompt: 'Why are all four turn angles the same?',
    hint: 'Think about the four corners of a square and how much of a full turn each corner uses.'
  }
];

const SCRATCH_TASK_STEPS = [
  'Open Scratch using the button below.',
  'Add the Pen extension (bottom-left button, then choose Pen).',
  'Create exactly the program shown above. Do not use a repeat loop.',
  'Run the program by clicking the green flag.',
  'Compare the result with your prediction.',
  'Change all four movement values from 100 to 60.',
  'Run the program again.',
  'Explain what changed.',
  'Download the project: File ▸ Save to your computer (this creates the .sb3 file).'
];

const SCRATCH_REFLECTION = [
  { id: 'm1_ref_prediction', type: 'choice', prompt: 'Was your prediction correct?',
    options: ['Yes, completely', 'Partly', 'No'], answer: null },
  { id: 'm1_ref_changed',  type: 'written', prompt: 'What did you change?', hint: 'Name the blocks and the values you edited.' },
  { id: 'm1_ref_happened', type: 'written', prompt: 'What happened after the change?', hint: 'Describe the new drawing on the stage.' },
  { id: 'm1_ref_why',      type: 'written', prompt: 'Why did the output change?', hint: 'Link your answer to the value inside the move block.' }
];

const PYTHON_SQUARE_CODE =
  'import turtle as t\n' +
  '\n' +
  't.shape("turtle")\n' +
  't.speed(3)\n' +
  't.pensize(4)\n' +
  '\n' +
  't.forward(100)\n' +
  't.right(90)\n' +
  't.forward(100)\n' +
  't.right(90)\n' +
  't.forward(100)\n' +
  't.right(90)\n' +
  't.forward(100)\n' +
  't.right(90)\n' +
  '\n' +
  't.done()\n';

const PYTHON_PREDICTIONS = [
  {
    id: 'm1_py_shape', type: 'choice',
    prompt: 'What will the Turtle draw?',
    options: ['A square with sides of 100', 'A triangle', 'Four separate lines', 'Nothing at all'],
    answer: 0,
    feedback: 'Four forward(100) commands and four right(90) turns draw a square with sides of 100.'
  },
  {
    id: 'm1_py_side', type: 'choice',
    prompt: 'Which number controls the side length?',
    options: ['The 3 in t.speed(3)', 'The 90 in t.right(90)', 'The 100 in t.forward(100)', 'The 4 in t.pensize(4)'],
    answer: 2,
    feedback: 'forward() takes a distance, so the 100 controls how long each side is.'
  },
  {
    id: 'm1_py_angle', type: 'choice',
    prompt: 'Which number controls the turn angle?',
    options: ['The 100 in t.forward(100)', 'The 90 in t.right(90)', 'The 4 in t.pensize(4)', 'The 3 in t.speed(3)'],
    answer: 1,
    feedback: 'right() takes an angle in degrees, so the 90 controls the size of each turn.'
  },
  {
    id: 'm1_py_speed', type: 'choice',
    prompt: 'What does t.speed(3) affect?',
    options: [
      'How large the drawing is',
      'How quickly the Turtle animates as it draws',
      'How thick the line is',
      'How many sides are drawn'
    ],
    answer: 1,
    feedback: 'speed() only changes the animation speed. The finished drawing is identical at any speed.'
  },
  {
    id: 'm1_py_finish', type: 'choice',
    prompt: 'Will the Turtle finish where it started?',
    options: ['Yes — the square closes and the fourth turn restores the starting direction',
              'No — it finishes one side away', 'No — it finishes in the centre', 'It depends on the speed'],
    answer: 0,
    feedback: 'The fourth side returns the Turtle to the start, and the fourth turn restores the starting heading.'
  }
];

const PYTHON_TASK_STEPS = [
  'Run the code using the Run button (or Ctrl + Enter).',
  'Watch the Turtle canvas carefully.',
  'Compare the output with your prediction.',
  'Change all four distances from 100 to 60.',
  'Run the code again and explain how the output changed.',
  'Restore or improve the program.',
  'Capture your Python evidence.',
  'Download your .py file using the suggested filename.'
];

const COMPARISON_ROWS = [
  { scratch: 'move 100 steps',              python: 't.forward(100)' },
  { scratch: 'turn ↻ 90 degrees',           python: 't.right(90)' },
  { scratch: 'green flag starts the program', python: 'Run starts the Python program' },
  { scratch: 'Pen draws on the Scratch stage', python: 'Turtle draws on the canvas' }
];

/* -------------------------------------------------------------
   MAIN ACTIVITY 2 — wayfinding tile
   ------------------------------------------------------------- */
const PROJECT_BRIEF =
  'Design a simple wayfinding tile that could help a new student follow a route around the ' +
  'school. Your design must contain a recognisable directional symbol created using Python ' +
  'Turtle commands.';

const DESIGN_IDEAS = [
  'directional arrow',
  'turning arrow',
  'destination flag',
  'doorway symbol',
  'route corner',
  'another recognisable navigation symbol'
];

const PLANNING_QUESTIONS = [
  { id: 'm2_plan_symbol',   type: 'written', prompt: 'What symbol will you create?', hint: 'For example: an arrow pointing right towards the library.' },
  { id: 'm2_plan_user',     type: 'written', prompt: 'Who is the intended user?', hint: 'Who needs this sign, and where would it be placed?' },
  { id: 'm2_plan_commands', type: 'written', prompt: 'Which commands do you expect to use?', hint: 'For example: t.forward(), t.right(), t.left(), t.penup().' },
  { id: 'm2_plan_values',   type: 'written', prompt: 'What distances and angles might be suitable?', hint: 'Estimate sensible numbers, for example 120 steps and 135 degrees.' }
];

const WAYFINDING_STARTER_CODE =
  'import turtle as t\n' +
  '\n' +
  't.shape("turtle")\n' +
  't.speed(4)\n' +
  't.pensize(4)\n' +
  '\n' +
  '# Add your sequence below\n' +
  '\n' +
  '\n' +
  't.done()\n';

/* A complete, runnable example shown after planning so that students can see
   how a symbol is built. Students must change it to match their own plan. */
const WORKED_EXAMPLE = {
  title: 'A simple arrow pointing right',
  note:
    'Here is one finished example so you can see how the commands fit together. ' +
    'It is a starting point, not your answer: your tile must match the symbol you planned. ' +
    'Change the direction, the sizes and the angles so the tile is yours.',
  changeIdeas: [
    'Make it point left, up or down instead.',
    'Change the shaft length and the arrow head length.',
    'Change 135 to a different angle and see how the head changes.',
    'Move the whole symbol to a different part of the canvas.',
    'Add a second part, such as a doorway, a flag or a border.'
  ],
  code:
    'import turtle as t\n' +
    '\n' +
    't.shape("turtle")\n' +
    't.speed(4)\n' +
    't.pensize(6)\n' +
    '\n' +
    '# Move to the left of the canvas without drawing\n' +
    't.penup()\n' +
    't.goto(-120, 0)\n' +
    't.pendown()\n' +
    '\n' +
    '# The shaft of the arrow\n' +
    't.forward(180)\n' +
    '\n' +
    '# Top half of the arrow head\n' +
    't.left(135)\n' +
    't.forward(60)\n' +
    '\n' +
    '# Go back to the tip\n' +
    't.backward(60)\n' +
    '\n' +
    '# Bottom half of the arrow head\n' +
    't.right(270)\n' +
    't.forward(60)\n' +
    '\n' +
    't.done()\n'
};

/* Small building blocks students can copy or insert at the cursor. */
const CODE_HELPERS = [
  {
    id: 'help_start',
    title: 'Start in the middle, facing right',
    desc: 'Sets a known starting point so your symbol always appears in the same place.',
    code: 't.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()'
  },
  {
    id: 'help_move',
    title: 'Move without drawing',
    desc: 'Lift the pen, move, then put the pen back down.',
    code: 't.penup()\nt.goto(-100, 50)\nt.pendown()'
  },
  {
    id: 'help_line',
    title: 'Draw a straight line',
    desc: 'The number is the distance in steps.',
    code: 't.forward(120)'
  },
  {
    id: 'help_corner',
    title: 'Turn a corner',
    desc: 'right() turns clockwise, left() turns anticlockwise. The number is the angle in degrees.',
    code: 't.right(90)\nt.forward(60)'
  },
  {
    id: 'help_back',
    title: 'Go back over a line',
    desc: 'Useful for arrow heads: draw one barb, reverse to the tip, then draw the other.',
    code: 't.backward(60)'
  },
  {
    id: 'help_barb',
    title: 'One side of an arrow head',
    desc: 'Turn sharply, draw a short line, then reverse back to where you started.',
    code: 't.left(135)\nt.forward(50)\nt.backward(50)'
  },
  {
    id: 'help_thick',
    title: 'Make the line thicker',
    desc: 'A thicker line is easier to read on a sign. Put this near the top of your program.',
    code: 't.pensize(8)'
  }
];

const SUCCESS_CRITERIA = [
  { id: 'sc_six',       label: 'Uses at least six movement or turn commands' },
  { id: 'sc_turns',     label: 'Includes at least two turns' },
  { id: 'sc_symbol',    label: 'Creates a recognisable directional symbol' },
  { id: 'sc_noerrors',  label: 'Runs without unresolved errors' },
  { id: 'sc_tested',    label: 'Has been tested more than once' },
  { id: 'sc_improved',  label: 'Includes one improvement made after testing' },
  { id: 'sc_filename',  label: 'Has been downloaded using the correct filename' }
];

const EXPLANATION_QUESTIONS = [
  { id: 'm2_exp_direction', type: 'written', prompt: 'Which commands create the main direction?', hint: 'Name the commands that draw the part of the symbol showing which way to go.' },
  { id: 'm2_exp_angle',     type: 'written', prompt: 'Which angle was most important?', hint: 'Give the number of degrees and explain what it does.' },
  { id: 'm2_exp_improved',  type: 'written', prompt: 'What did you improve after testing?', hint: 'Describe the change and why you made it.' },
  { id: 'm2_exp_user',      type: 'written', prompt: 'How does the final symbol help a new student?', hint: 'Explain how someone would read your sign.' }
];

/* -------------------------------------------------------------
   EXTENSION
   ------------------------------------------------------------- */
const EXTENSION_OPTIONS = [
  'Create a second route tile',
  'Create a turning arrow',
  'Create a rectangle using side lengths 150, 70, 150, 70',
  'Improve the proportions of the original design',
  'Reposition the design',
  'Add a simple border',
  'Create a second saved version'
];

const EXTENSION_STARTER_CODE =
  'import turtle as t\n' +
  '\n' +
  't.shape("turtle")\n' +
  't.speed(5)\n' +
  't.pensize(4)\n' +
  '\n' +
  '# Extension: version 2 of your wayfinding tile\n' +
  '# Do not use loops in this lesson.\n' +
  '\n' +
  '\n' +
  't.done()\n';

/* -------------------------------------------------------------
   PLENARY
   ------------------------------------------------------------- */
const SELF_CHECK = [
  { id: 'pl_recognisable', label: 'My symbol is recognisable.' },
  { id: 'pl_runs',         label: 'My program runs.' },
  { id: 'pl_filename',     label: 'I used a meaningful filename.' },
  { id: 'pl_tested',       label: 'I tested the program more than once.' },
  { id: 'pl_improved',     label: 'I made at least one improvement.' },
  { id: 'pl_explain',      label: 'I can explain two commands.' },
  { id: 'pl_scratchfile',  label: 'I downloaded my Scratch file.' },
  { id: 'pl_pythonfile',   label: 'I downloaded my Python file.' }
];

const EXIT_TICKET = [
  { id: 'exit_sequence',   prompt: 'A sequence is…', hint: 'Write one clear sentence.' },
  { id: 'exit_match',      prompt: 'One Scratch block that matched a Python command was…', hint: 'Name the block and the Python command.' },
  { id: 'exit_change',     prompt: 'When I changed ________, the output changed by…', hint: 'Name what you changed and what happened.' },
  { id: 'exit_error',      prompt: 'One error or unexpected result I corrected was…', hint: 'Describe the problem and your fix.' },
  { id: 'exit_routine',    prompt: 'One project routine I followed correctly was…', hint: 'For example: saving with a meaningful filename.' },
  { id: 'exit_support',    prompt: 'Next lesson, I need more support with…', hint: 'Be honest — this helps your teacher plan.' }
];

/* -------------------------------------------------------------
   SUBMISSION
   ------------------------------------------------------------- */
const SUBMISSION_CHECKLIST = [
  { id: 'sub_pdf',     label: 'I have exported and saved my PDF evidence report.' },
  { id: 'sub_sb3',     label: 'I have my Scratch .sb3 file saved in my T1.1 folder.' },
  { id: 'sub_py',      label: 'I have my Python .py file saved in my T1.1 folder.' },
  { id: 'sub_uploaded',label: 'I have uploaded all three files to the Microsoft Teams assignment.' }
];

const SUBMISSION_REMINDERS = [
  'Check that your name and class appear in the PDF.',
  'Check that the PDF contains your Scratch and Python evidence.',
  'Upload the files, not screenshots of the files.',
  'Keep a copy until the assignment has been submitted successfully.'
];

/* Expose to the app (also usable as an ES module import if needed). */
window.CONFIG = CONFIG;
window.LESSON = LESSON;
window.LESSON_DATA = {
  CONFIG, LESSON, SECTIONS, SECTION_SUBTITLES, SETUP_CHECKLIST,
  STARTER_SCRATCH_BLOCKS, STARTER_PYTHON_CODE, STARTER_QUESTIONS,
  MAIN1_SETUP_CHECKLIST, SCRATCH_SQUARE_BLOCKS, SCRATCH_PREDICTIONS,
  SCRATCH_TASK_STEPS, SCRATCH_REFLECTION, PYTHON_SQUARE_CODE,
  PYTHON_PREDICTIONS, PYTHON_TASK_STEPS, COMPARISON_ROWS,
  PROJECT_BRIEF, DESIGN_IDEAS, PLANNING_QUESTIONS, WAYFINDING_STARTER_CODE,
  WORKED_EXAMPLE, CODE_HELPERS,
  SUCCESS_CRITERIA, EXPLANATION_QUESTIONS, EXTENSION_OPTIONS,
  EXTENSION_STARTER_CODE, SELF_CHECK, EXIT_TICKET,
  SUBMISSION_CHECKLIST, SUBMISSION_REMINDERS
};
