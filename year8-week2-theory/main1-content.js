/* Lesson content only: one Smart Badge scenario, five focused practice cards. */
(() => {
  const choice = (key, prompt, options, correct, feedback) => ({ key, prompt, type: "choice", options, correct, feedback });
  const writing = (key, prompt, frame, feedback) => ({ key, prompt, type: "writing", frame, feedback });
  const jobs = [["welcome", "Welcome display"], ["input", "Button input"], ["response", "Personal response"]];
  const shapes = [["oval", "Oval"], ["parallelogram", "Parallelogram"], ["rectangle", "Rectangle"]];
  const symbol = (label, drawing, purpose, example) => `<article class="m1-symbol"><svg viewBox="0 0 200 76" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><g fill="white" stroke="#141414" stroke-width="3">${drawing}</g></svg><h4>${label}</h4><p>${purpose}</p><p class="field-help">${example}</p></article>`;
  const symbolGuide = `<div class="m1-symbol-grid">${
    symbol("Oval", '<ellipse cx="100" cy="38" rx="90" ry="32"/>', "Marks the start or end of the algorithm.", "Example: START") +
    symbol("Parallelogram", '<polygon points="28,6 194,6 172,70 6,70"/>', "Shows information entering or leaving the system: input or output.", "Example: DISPLAY initials") +
    symbol("Rectangle", '<rect x="14" y="6" width="172" height="64"/>', "Shows a processing action, such as a calculation or setting a value.", "For recognition: our simple badge needs no separate calculation box.") +
    symbol("Arrow", '<path d="M15 38 H176"/><path d="M162 27 L180 38 L162 49" fill="none"/>', "Shows which instruction to follow next and in which direction.", "It is not decoration or a physical wire.")
  }</div>`;
  const cards = [
    {
      part: "MAIN TASK 1A · ALGORITHMS", title: "What makes a useful algorithm?", minutes: "3 min",
      reading: "An algorithm is a precise, ordered set of instructions for solving a problem. Precise means the reader does not need to guess what to do. Order matters too: our badge must wait for Button A before displaying initials. An algorithm is a plan; a program implements instructions in a language the computer can execute.",
      example: '<h3>Worked example: plan one welcome interaction</h3><ol><li>Start the badge.</li><li>Display a heart icon on the LED matrix.</li><li>Wait until Button A is pressed.</li><li>Display the initials “JP” on the LED matrix.</li></ol><p>This tells us the exact output and the event that comes before it. It is not Python code.</p>',
      questions: [
        choice("m1_kind", "A student writes these ordered steps on paper but has not written code. What have they created?", [["program", "A program already running on the micro:bit"], ["algorithm", "An algorithm that can later be implemented as a program"], ["device", "A new input device"]], "algorithm", "An algorithm is the plan. It can be written in words or represented as a flowchart before it becomes executable code."),
        choice("m1_precise_choice", "Which instruction tells another person exactly what to do?", [["nice", "When the badge starts, show something nice."], ["later", "Show the picture later."], ["exact", "When the badge starts, display a heart icon on the LED matrix."]], "exact", "The precise instruction gives the event, the exact icon and the display location. “Nice” and “later” leave the reader guessing."),
      ],
    },
    {
      part: "MAIN TASK 1A · DECOMPOSITION", title: "Split the problem into useful jobs", minutes: "4 min",
      reading: "Decomposition means breaking a larger problem into smaller, manageable parts. “Make a Smart Badge” is too broad to tackle all at once. Give each part a clear job, plan and test it, then bring the parts together. Decomposition identifies the jobs; the algorithm specifies the instructions and their order. They work together, but they are not the same thing.",
      example: '<h3>Whole problem: welcome a new student with a Smart Badge</h3><dl class="m1-jobs"><div><dt>Welcome display</dt><dd>Choose and show an icon when the badge starts.</dd></div><div><dt>Button input</dt><dd>Wait for the student to press Button A.</dd></div><div><dt>Personal response</dt><dd>Choose and display the student’s initials after that input.</dd></div></dl><p><strong>A useful part has a clear responsibility.</strong> “Do some code” is not a useful job description.</p>',
      questions: [
        choice("m1_job_wait", "Your partner is planning how the badge waits for Button A. Which job are they working on?", jobs, "input", "Waiting for Button A belongs to the button-input job. It is different from choosing what the LEDs display."),
        choice("m1_job_initials", "The icon works, but the badge shows the wrong initials after Button A. Which job should you inspect first?", jobs, "response", "Inspect the personal-response job first: that part determines the initials displayed. You do not need to discard the working welcome display."),
        writing("m1_decomp_reason", "Why is splitting the badge into these jobs useful when something goes wrong? Write one sentence.", "I can check the ___ part first instead of ___ because…", "Compare your explanation: separate jobs let you locate and test the part responsible for the problem while keeping working parts. Your teacher will review your reasoning; no exact wording is required."),
      ],
    },
    {
      part: "MAIN TASK 1B · FLOWCHART SYMBOLS", title: "Read the shape as well as the words", minutes: "4 min",
      reading: "A flowchart is a diagram representing an algorithm with standard symbols and arrows. The words say what the instruction does; the shape tells us what type of step it is. An arrow shows where to go next. Input and output share one shape, so read the label too. Study the four shapes, then try the checks below.",
      example: symbolGuide + '<p><strong>For today:</strong> use ovals, input/output parallelograms and arrows. Decision diamonds and selection are for a later lesson.</p>',
      questions: [
        choice("m1_flow_purpose", "Why use a flowchart to plan the badge?", [["diagram", "To show the algorithm’s steps and their connections visually"], ["download", "To download code directly to the micro:bit"], ["decorate", "To choose the colour of the physical badge"]], "diagram", "A flowchart makes the algorithm’s structure and sequence visible. The drawing itself is not a downloadable program."),
        choice("symbol_start", "Which shape should contain START? Look at the outlines in the guide.", shapes, "oval", "START and END use an oval. A rounded-looking outline is not an input/output parallelogram: notice the slanted sides of that shape."),
        choice("symbol_output", "Which shape should contain DISPLAY initials?", shapes, "parallelogram", "DISPLAY initials is an output instruction, so it uses the input/output parallelogram. It is not a calculation rectangle."),
        choice("m1_arrow", "What does an arrow connecting two symbols tell the reader?", [["direction", "Which instruction to follow next"], ["cable", "Where to plug in the USB cable"], ["size", "How large the letters should be"]], "direction", "The arrow’s direction tells you which instruction to follow next. Flowchart arrows represent sequence, not wiring."),
      ],
    },
    {
      part: "MAIN TASK 1B · TRACE AND REPAIR", title: "Follow the badge’s instructions", minutes: "3 min",
      reading: "Trace means follow the instructions one step at a time. Start at the oval and follow each arrow. Read the input step as “wait until Button A is pressed”. Only then follow the arrow to the initials output. This diagram describes one welcome interaction; END does not mean the physical device is switched off.",
      example: '<figure class="lesson-figure m1-flowchart"><button class="image-button" type="button" data-image="assets/images/smart_badge_clear_flowchart.svg" data-alt="Large Smart Badge flowchart: Start, display welcome icon, wait for Button A, display initials, End."><img src="assets/images/smart_badge_clear_flowchart.svg" alt="Large labelled Smart Badge flowchart with ovals for start and end, slanted parallelograms for input and output, and arrows pointing down."></button><figcaption>Select to enlarge. Each input/output shape states its role as well as its instruction.</figcaption></figure>',
      questions: [
        choice("m1_before_press", "The badge has started, but nobody has pressed Button A. What should the LED matrix show?", [["initials", "The student’s initials already"], ["welcome", "The welcome icon while the badge waits for input"], ["nothing", "Nothing, because all displays happen after Button A"]], "welcome", "The welcome output comes before the wait-for-input step. The initials must not appear until Button A is pressed."),
        choice("m1_fix_arrow", "A trainee draws an arrow straight from DISPLAY welcome icon to DISPLAY initials, skipping the input. Which repair matches our brief?", [["end", "Remove the START and END symbols"], ["colour", "Colour the initials box differently"], ["wait", "Route the arrows through WAIT FOR Button A before DISPLAY initials"]], "wait", "The badge must wait for the student’s input. Route the flow through that input step; changing a colour cannot repair the sequence."),
      ],
    },
    {
      part: "MAIN TASK 1B · APPLY AND TEST", title: "Write instructions someone can follow", minutes: "4 min",
      reading: "Now apply what you have learned. Use the same badge brief: an icon at startup, then initials after Button A. A precise label states the action and exact content. The arrows and surrounding steps establish the sequence. Finish by proposing a test, so your plan can be checked against what the badge should actually do.",
      example: '<p class="m1-writing-hint"><strong>Writing prompts:</strong> When does it happen? What exactly appears? Where is it displayed?<br><strong>Test prompts:</strong> What will you do? What should you observe?</p>',
      questions: [
        { ...writing("precise_output", "The trainee wrote “Display something nice”. Complete this startup instruction with an exact icon: When the Smart Badge starts, display ___ on the LED matrix.", "Name an exact icon…", "Your chosen output is saved. Check that it names one identifiable icon, rather than “something nice”. Your teacher will review it."), short: true },
        writing("m1_button_instruction", "The trainee wrote “Wait, then display the name”. Rewrite it to match the brief: Button A should reveal the student’s initials, not their full name.", "When ___, display ___ on the ___.", "Check for Button A, specific initials and the LED matrix. Waiting for a fixed time is not the same as waiting for a button press. This writing is saved for teacher review, not keyword-marked."),
        writing("m1_test", "Suggest one test that would reveal initials appearing too early. Include your action and the expected display.", "I will ___ without pressing ___. I should see ___, not ___.", "One useful test is to start the badge without pressing Button A: the welcome icon should appear, not the initials. Compare your proposed test with that requirement; your teacher will review it."),
      ],
      stretch: '<details class="m1-stretch"><summary>Further challenges · optional, 3–5 minutes each</summary><p>Finish the core questions first. Try either challenge, then the other if you have time. These do not block Main Task 2.</p><label><strong>Challenge 1 — review a partner’s design</strong><span>A partner puts DISPLAY initials in an oval and skips the Button A step. Explain two separate corrections and why each is needed.</span><textarea data-track="m1_stretch_repair" rows="3" maxlength="600" placeholder="Change the shape because… Change the sequence because…"></textarea></label><label><strong>Challenge 2 — adapt for a new user</strong><span>For a visitor who cannot read the initials, propose a different Button A output. Keep the welcome icon. Explain how the two displays would be distinguishable, then state a test.</span><textarea data-track="m1_stretch_access" rows="3" maxlength="600" placeholder="I would change… A visitor could distinguish them because… I would test…"></textarea></label></details>',
    },
  ];
  const language = {
    zh: [
      "算法是准确、有顺序的解题指令。程序是用计算机能执行的语言实现这些指令。例子：启动徽章→显示爱心→等待 Button A→显示 JP。问题一：纸上的步骤是运行中的程序、算法，还是输入设备？问题二：比较三个指令，哪个明确说明了什么时候、显示什么、在哪里显示？",
      "分解是把大问题拆成有明确职责的小部分。本例有欢迎显示、按钮输入、个人回应三个部分。分解决定有哪些工作；算法决定具体指令和顺序。把“等待 Button A”和“按键后姓名首字母显示错误”分别对应到合适的部分。最后解释：出错时分成这些部分为什么有帮助？句式：我可以先检查___部分，而不用___，因为___。",
      "流程图用标准图形和箭头表示算法。椭圆：开始/结束；平行四边形：输入/输出；长方形：处理或计算；箭头：接下来执行哪一步。输入和输出形状相同，要读标签区分。依次回答：为什么用流程图？START 用什么形状？DISPLAY initials 用什么形状？箭头告诉读者什么？今天不需要判断菱形。",
      "按箭头逐步读图：开始→输出欢迎图标→等待 Button A 输入→输出姓名首字母→结束。这里的结束表示一次欢迎互动结束，不是设备关机。预测：还没有按按钮时，应显示什么？修复：如果箭头跳过输入，直接显示姓名首字母，怎样改才符合要求？",
      "写明确的指令：什么时候、具体显示什么、在哪里。先填一个明确的图标，再把“等一下，然后显示名字”改为按 Button A 后显示姓名首字母。最后设计一个测试：不按按钮启动徽章，应看到什么、不应看到什么？需要帮助可勾选求助。选做：修正错误形状和跳过输入的两个问题；或为无法读首字母的访客设计可区分的图标并说明测试。",
    ],
    ko: [
      "알고리즘은 문제를 해결하기 위한 정확하고 순서가 있는 지시입니다. 프로그램은 컴퓨터가 실행할 수 있는 언어로 지시를 구현한 것입니다. 예: 시작→하트 표시→Button A 기다리기→JP 표시. 첫 질문은 종이에 적힌 단계가 실행 중인 프로그램, 알고리즘, 입력 장치 중 무엇인지 묻습니다. 두 번째는 언제, 무엇을, 어디에 표시하는지 명확한 지시를 고르는 것입니다.",
      "분해는 큰 문제를 명확한 역할이 있는 작은 부분으로 나누는 것입니다. 배지의 역할은 환영 표시, 버튼 입력, 개인 응답입니다. 분해는 필요한 일을, 알고리즘은 구체적 지시와 순서를 정합니다. Button A를 기다리는 일과 잘못된 이니셜을 점검하는 일을 역할에 연결하세요. 마지막으로 문제가 생겼을 때 이렇게 나누면 왜 도움이 되는지 한 문장으로 설명하세요.",
      "순서도는 표준 기호와 화살표로 알고리즘을 표현합니다. 타원은 시작/끝, 평행사변형은 입력/출력, 직사각형은 처리나 계산, 화살표는 다음 지시를 뜻합니다. 입력과 출력은 모양이 같으므로 글도 읽으세요. 순서도를 쓰는 목적, START의 모양, DISPLAY initials의 모양, 화살표의 의미를 차례로 답하세요. 오늘은 판단 마름모가 필요하지 않습니다.",
      "화살표를 따라 한 단계씩 읽으세요: 시작→환영 아이콘 출력→Button A 입력 기다리기→이니셜 출력→끝. 끝은 한 번의 환영 상호작용이 끝난다는 뜻이지 전원이 꺼진다는 뜻은 아닙니다. 버튼을 누르기 전 무엇이 보여야 하나요? 입력을 건너뛰고 바로 이니셜을 표시하는 잘못된 화살표를 어떻게 고칠까요?",
      "언제, 무엇을, 어디에 표시하는지 정확하게 쓰세요. 구체적인 아이콘을 적고, ‘기다렸다가 이름을 표시한다’를 Button A를 누른 후 이니셜을 표시하도록 고치세요. 너무 일찍 이니셜이 표시되는지 확인할 테스트도 쓰세요: 버튼을 누르지 않고 시작하면 무엇이 보여야 할까요? 도움이 필요하면 도움 확인란을 선택하세요. 선택 도전: 잘못된 모양과 입력 생략을 각각 고치거나, 이니셜을 읽지 못하는 방문객을 위한 구별 가능한 출력과 테스트를 설계하세요.",
    ],
    ms: [
      "Algoritma ialah arahan tepat dan tersusun untuk menyelesaikan masalah. Program melaksanakannya dalam bahasa yang boleh dijalankan komputer. Contoh: mula→papar hati→tunggu Button A→papar JP. Tentukan sama ada langkah di atas kertas ialah program berjalan, algoritma atau peranti input. Kemudian pilih arahan yang menyatakan bila, apa dan di mana dengan tepat.",
      "Penguraian membahagikan masalah besar kepada bahagian dengan tanggungjawab yang jelas: paparan alu-aluan, input butang dan respons peribadi. Penguraian mengenal pasti kerja; algoritma menentukan arahan dan urutan. Padankan tugas menunggu Button A dan menyemak inisial yang salah dengan bahagian yang sesuai. Terangkan bagaimana pembahagian ini membantu apabila berlaku masalah.",
      "Carta alir menunjukkan algoritma dengan simbol dan anak panah. Bujur: mula/tamat. Segi empat selari: input/output. Segi empat tepat: proses atau pengiraan. Anak panah: arahan seterusnya. Input dan output berkongsi bentuk, jadi baca labelnya. Jawab tujuan carta alir, bentuk START, bentuk DISPLAY initials dan maksud anak panah. Bentuk keputusan belum diperlukan hari ini.",
      "Ikut anak panah: mula→ikon alu-aluan→tunggu input Button A→papar inisial→tamat. Tamat bermaksud satu interaksi selesai, bukan peranti dimatikan. Ramalkan paparan sebelum butang ditekan. Baiki anak panah yang melangkau input dan terus memaparkan inisial.",
      "Nyatakan bila, apa dan di mana. Namakan satu ikon yang tepat, kemudian ubah ‘Tunggu, kemudian paparkan nama’ supaya Button A mendedahkan inisial. Cadangkan tindakan ujian dan paparan yang dijangka untuk mengesan inisial muncul terlalu awal. Tandakan bantuan jika perlu. Cabaran pilihan: baiki bentuk salah serta input yang dilangkau; atau cadangkan output berbeza untuk pelawat yang tidak dapat membaca inisial dan cara mengujinya.",
    ],
  };
  window.Main1Practice = { cards, language };
})();
