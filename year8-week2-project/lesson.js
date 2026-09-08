(function (root) {
  'use strict';
  const ID = 'Year8-T1-W2-SmartBadge';
  const VERSION = 3;
  const LINKS = {
    makecode: 'https://makecode.microbit.org/',
    micropython: 'https://python.microbit.org/v/3',
    ipad: 'https://microbit.org/get-started/user-guide/mobile/',
    transfer: 'https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/'
  };
  const OBJECTIVES = {
    'Key topic': 'Smart Badge: sequence, button input and LED output',
    WAGBA: 'We are getting better at creating, testing and explaining a Smart Badge that responds to a button input.',
    Knowledge: 'I know that Button A is an input, the LED matrix is an output, and an event makes code run when something happens.',
    Skills: 'I can build a startup display and a button response, test both behaviours, and save evidence.',
    Understanding: 'I can explain why startup code and button-response code run at different times, and use a test to improve my badge.',
    Keywords: 'sequence, input, output, event, simulator, transfer, test, debug',
    Challenge: 'Improve the badge for its user while keeping the startup display and Button A response working.'
  };
  const CARDS = [
    ['starter', 'Do Now', 'What happens when you press A?'],
    ['learning', 'Types of learning · How to get better', 'Choose a useful learning move'],
    ['setup', 'Main Task 1 · Get ready', 'Choose your device and editor'],
    ['try', 'Main Task 1 · Try a model', 'Make the welcome icon appear'],
    ['design', 'Main Task 1 · Make two choices', 'Make it your badge'],
    ['button', 'Main Task 2 · Build', 'Give Button A a job'],
    ['test', 'Main Task 2 · Test', 'Does your badge do both jobs?'],
    ['transfer', 'Main Task 2 · Connect', 'Try it on a real micro:bit'],
    ['evidence', 'Main Task 2 · Capture', 'Keep evidence of what you made'],
    ['pitstop', 'Learning Pitstop', 'Where are you in your learning?'],
    ['plenary', 'Plenary', 'Explain your button response'],
    ['review', 'Review & submit', 'Your learning report'],
    ['extend1', 'Optional extension · Level 1', 'Give Button B a different job', true],
    ['extend2', 'Optional extension · Level 2', 'Rescue a badge with a bug', true],
    ['extend3', 'Optional extension · Level 3', 'Test your badge with a real user', true]
  ].map(([id, stage, title, optional]) => ({ id, stage, title, optional: !!optional }));
  const CORE = CARDS.filter(c => !c.optional);
  const FIELDS = {
    prediction: ['starter', 'Prediction for pressing Button A'],
    strategy: ['learning', 'Chosen learning move'],
    device: ['setup', 'Device'], editor: ['setup', 'Editor'], deviceNumber: ['setup', 'Micro:bit number (if available)'],
    firstRun: ['try', 'First simulator run'], icon: ['design', 'Chosen welcome icon'], message: ['design', 'Chosen initials or welcome word'],
    buttonBuild: ['button', 'Button response build status'],
    startTest: ['test', 'Restart test result'], startActual: ['test', 'Restart: unexpected output'],
    pressTest: ['test', 'Button A test result'], pressActual: ['test', 'Button A: unexpected output'], improvement: ['test', 'One change or successful check'],
    physical: ['transfer', 'Physical-device test status'], physicalNote: ['transfer', 'Physical output or connection problem'],
    evidenceAlternative: ['evidence', 'Evidence method when an upload is unavailable'],
    phase: ['pitstop', 'Current learning phase'], nextMove: ['pitstop', 'Evidence and next learning move'],
    explain: ['plenary', 'Explanation of the Button A response'], eventCheck: ['plenary', 'Prediction when the message is moved to startup'],
    extend1Result: ['extend1', 'Button B purpose, change and test'], extend2Result: ['extend2', 'Bug explanation and correction'],
    extend3Result: ['extend3', 'User feedback, improvement and retest']
  };
  const VALUES = {
    prediction: { icon: 'The welcome icon stays; no button response was added.', name: 'AB appears because A has its own instructions.', blank: 'The display must turn off.' },
    strategy: { knowledge: 'Knowledge: recall what input and output mean.', skill: 'Skill: practise one small step and test it.', understanding: 'Understanding: predict, then explain why the result happened.' },
    device: { ipad: 'iPad', laptop: 'Laptop / desktop' },
    editor: { blocks: 'MakeCode Blocks', makepython: 'MakeCode Python', micropython: 'micro:bit Python (MicroPython)' },
    firstRun: { yes: 'I saw the model icon in the simulator.', help: 'I tried; I need help to run the model.' },
    icon: { HEART: 'Heart', HAPPY: 'Happy face', DIAMOND: 'Diamond', YES: 'Tick' },
    buttonBuild: { done: 'I added the Button A response.', help: 'I tried; I need help with the code or blocks.' },
    startTest: { match: 'Matched the chosen welcome icon.', retry: 'Did not match / not running yet.' },
    pressTest: { match: 'Matched the chosen initials or word.', retry: 'Did not match / not running yet.' },
    physical: { worked: 'Transferred and observed on the physical device.', waiting: 'Simulator tested; physical transfer needs help.', unavailable: 'No physical device available today.', notyet: 'Neither physical transfer nor simulator success demonstrated yet.' },
    phase: { new: 'New learning: a useful challenge with some support.', consolidate: 'Consolidating: practising and becoming more independent.', tread: 'Treading water: I am ready for more challenge.', drown: 'Drowning: I need a smaller step or help now.' },
    eventCheck: { startup: 'The message runs on restart, not specifically when A is pressed.', same: 'It still waits for Button A automatically.', never: 'It can never display text.' }
  };
  const REQUIRED = {
    starter: ['prediction'], learning: ['strategy'], setup: ['device', 'editor'], try: ['firstRun'], design: ['icon', 'message'],
    button: ['buttonBuild'], test: ['startTest', 'pressTest', 'improvement'], transfer: ['physical', 'physicalNote'],
    evidence: [], pitstop: ['phase', 'nextMove'], plenary: ['explain', 'eventCheck'], review: [],
    extend1: ['extend1Result'], extend2: ['extend2Result'], extend3: ['extend3Result']
  };
  const GLOSSARY = [
    ['input', 'Information or a signal sent into a system—for example, pressing Button A.', '输入', '입력', 'input / masukan'],
    ['output', 'Information a system produces—for example, a symbol on the LEDs.', '输出', '출력', 'output / keluaran'],
    ['event', 'Something that happens and can trigger a response, such as a button press.', '事件', '이벤트', 'peristiwa'],
    ['sequence', 'The order in which instructions run.', '顺序', '순서', 'urutan'],
    ['simulator', 'An on-screen model used to try your program.', '模拟器', '시뮬레이터', 'simulator'],
    ['transfer', 'Send your program to the physical micro:bit.', '传输', '전송', 'pindahkan'],
    ['test', 'Try a program and compare its actual result with what you expected.', '测试', '테스트', 'uji'],
    ['debug', 'Find and correct a problem, then test again.', '调试', '디버깅', 'nyahpepijat']
  ];
  const FEEDBACK_SUPPORT={
    zh:{prediction:'启动指令显示图标。Button A 事件中的指令在按 A 时显示 AB。代码放在哪里，会影响它什么时候运行。',eventCheck:'把文字指令放到启动代码中，文字会在重新启动时出现。要让它回应 A，就要把指令放进 A 的事件中。'},
    ko:{prediction:'시작 명령은 아이콘을 보여 줍니다. Button A 이벤트 안의 명령은 A를 누르면 AB를 보여 줍니다. 코드의 위치에 따라 실행되는 때가 달라집니다.',eventCheck:'글자 명령을 시작 코드에 넣으면 다시 시작할 때 글자가 나옵니다. A에 반응하게 하려면 A 이벤트 안에 넣어야 합니다.'},
    bm:{prediction:'Arahan permulaan menunjukkan ikon. Arahan dalam peristiwa Button A memaparkan AB apabila A ditekan. Kedudukan kod menentukan bila kod berjalan.',eventCheck:'Jika arahan teks berada pada permulaan, teks muncul apabila program dimulakan semula. Letakkannya dalam peristiwa A untuk bertindak balas kepada A.'}
  };
  // Task support is deliberately bilingual. Editor names and executable code stay unchanged.
  const SUPPORT = {
    zh: {
      label: '中文支持', starter: '阅读示例：启动时显示心形，按 A 时显示 AB。选择你预测的结果。先尝试，再查看解释。',
      learning: '知识：记住输入和输出的意思。技能：练习一个小步骤并测试。理解：预测结果并解释原因。选择今天最有帮助的一种学习方法。',
      setup: '先选择你的设备，再选择编辑器。iPad 使用 MakeCode；不要把 MicroPython 代码粘贴到 MakeCode。点击链接，在编辑器中编程，然后返回本课。',
      try: '在编辑器中运行给出的心形示例。Blocks：把 show icon 放进 on start。Python：在正确的 Python 编辑器中替换测试项目的代码。先确认模拟器可以运行。',
      design: '你是学校迎新日的学生助手。选择一个欢迎图标和简短的姓名首字母或欢迎词。接下来把这两个选择用到你的徽章中。',
      button: '启动图标保留不变。为 Button A 添加显示文字的指令。请在编辑器中操作，不是在本网页输入代码。按钮事件内的指令只在按下按钮时运行。',
      test: '做两次测试：重新启动，看欢迎图标；按 A，看你选择的文字。比较实际结果和你的选择。如有问题，一次改一处再测试。写一句你改了什么或怎样确认成功。',
      transfer: '按照你所选设备的说明传输程序。iPad 使用 micro:bit 应用和蓝牙；电脑可使用 USB。观察实体设备。不成功时如实选择需要帮助，不必勾选成功。',
      evidence: '保存代码截图和设备输出照片。可以上传文件或粘贴截图。不要拍摄脸部或私人信息。无法上传时，写明可以向老师展示什么证据。',
      pitstop: '这是当前状态，不是能力标签。New learning（新学习）：正在挑战新内容。Consolidating（巩固）：练习已学内容。Treading water（原地踏步）：需要更有挑战的任务。Drowning（感到不知所措）：需要帮助。选择状态，用刚才的测试作证据，再决定下一步。',
      plenary: '用自己的程序解释：按 A 后出现什么？为什么？使用提示句，不需要长篇回答。然后预测把文字移到启动代码会发生什么。',
      review: '检查姓名、班级和报告。未完成部分会标明需要复查。打印时选择保存为 PDF，然后上传到 Teams 的 Week 2 Project 作业。备份文件可用于换设备继续。',
      extend1: '为 B 设计一个与 A 不同、对使用者有用的功能。保留启动和 A 的原有功能。测试三个行为，并记录结果。',
      extend2: '错误示例在启动时显示文字，而 A 只显示心形。解释为什么，指出应把哪条指令移到哪里，再测试你的修正。',
      extend3: '请同伴在没有你解释的情况下试用徽章。观察一个困惑点，改进一个细节，然后再测试。记录观察和改变。'
    },
    ko: {
      label: '한국어 도움', starter: '예시를 읽으세요. 시작할 때 하트가 나오고 A를 누르면 AB가 나옵니다. 예상 결과를 고르세요. 먼저 시도한 뒤 설명을 확인하세요.',
      learning: '지식: 입력과 출력의 뜻을 기억하기. 기능: 작은 단계 하나를 연습하고 테스트하기. 이해: 결과를 예상하고 이유 설명하기. 오늘 도움이 될 학습 방법을 고르세요.',
      setup: '기기를 먼저 선택하고 편집기를 고르세요. iPad에서는 MakeCode를 사용합니다. MicroPython 코드를 MakeCode에 붙여 넣지 마세요. 링크로 편집기를 열어 작업한 뒤 수업으로 돌아오세요.',
      try: '편집기에서 하트 예시를 실행하세요. Blocks에서는 show icon을 on start 안에 넣습니다. Python에서는 선택한 편집기의 테스트 프로젝트 코드를 바꿉니다. 먼저 시뮬레이터에서 실행되는지 확인하세요.',
      design: '여러분은 학교 환영 행사 도우미입니다. 환영 아이콘 하나와 짧은 이름 이니셜 또는 인사말을 고르세요. 다음 단계에서 두 선택을 배지에 적용합니다.',
      button: '시작 아이콘은 유지하세요. Button A에 글자를 보여 주는 명령을 추가하세요. 코드는 이 수업 페이지가 아니라 편집기에 넣습니다. 버튼 이벤트 안의 명령은 버튼을 눌렀을 때 실행됩니다.',
      test: '두 번 테스트하세요. 다시 시작하여 아이콘을 보고, A를 눌러 선택한 글자를 확인합니다. 예상과 실제 결과를 비교하세요. 문제가 있으면 한 번에 하나씩 수정하세요. 수정 내용이나 성공을 확인한 방법을 한 문장으로 쓰세요.',
      transfer: '선택한 기기에 맞는 전송 안내를 따르세요. iPad는 micro:bit 앱과 Bluetooth를 사용하고 컴퓨터는 USB를 사용할 수 있습니다. 실제 기기를 관찰하세요. 안 되면 성공으로 표시하지 말고 도움이 필요하다고 선택하세요.',
      evidence: '코드 화면과 기기 출력 사진을 저장하세요. 파일을 올리거나 스크린샷을 붙여 넣을 수 있습니다. 얼굴이나 개인정보는 넣지 마세요. 업로드가 안 되면 선생님께 보여 줄 수 있는 증거를 적으세요.',
      pitstop: '현재 상태이지 능력 등급이 아닙니다. New learning(새로운 학습): 새로운 내용에 도전합니다. Consolidating(다지기): 배운 내용을 연습합니다. Treading water(제자리): 더 어려운 도전이 필요합니다. Drowning(버거움): 도움이 필요합니다. 테스트를 근거로 상태와 다음 행동을 정하세요.',
      plenary: '자신의 프로그램을 설명하세요. A를 누르면 무엇이 나타나고 왜 그런가요? 문장 틀을 사용해 짧게 쓰세요. 글자 명령을 시작 코드로 옮기면 어떻게 될지도 예상하세요.',
      review: '이름, 반, 보고서를 확인하세요. 미완료 부분은 검토 필요로 표시됩니다. 인쇄에서 PDF로 저장한 뒤 Teams의 Week 2 Project 과제에 올리세요. 다른 기기에서 계속하려면 백업 파일을 저장하세요.',
      extend1: 'A와 다르면서 사용자에게 도움이 되는 B 기능을 만드세요. 시작과 A 기능은 유지하세요. 세 가지 동작을 모두 테스트하고 결과를 기록하세요.',
      extend2: '잘못된 예시는 시작할 때 글자를 보여 주고 A를 누르면 하트만 보여 줍니다. 이유를 설명하고 어떤 명령을 어디로 옮겨야 하는지 정하세요. 수정 후 테스트하세요.',
      extend3: '설명하지 않고 친구에게 배지를 사용하게 하세요. 혼란스러운 점 하나를 관찰하고 하나를 개선한 뒤 다시 테스트하세요. 관찰과 변경 사항을 기록하세요.'
    },
    bm: {
      label: 'Bantuan Bahasa Melayu', starter: 'Baca contoh: ikon hati muncul pada permulaan; AB muncul apabila A ditekan. Pilih ramalan anda. Cuba dahulu, kemudian baca penerangan.',
      learning: 'Pengetahuan: ingat maksud input dan output. Kemahiran: latih satu langkah kecil dan uji. Pemahaman: ramal hasil dan jelaskan sebabnya. Pilih strategi yang membantu anda hari ini.',
      setup: 'Pilih peranti dahulu, kemudian editor. Gunakan MakeCode pada iPad. Jangan tampal kod MicroPython ke dalam MakeCode. Buka editor melalui pautan, bina program di sana, kemudian kembali ke pelajaran ini.',
      try: 'Jalankan contoh ikon hati dalam editor. Blocks: letakkan show icon di dalam on start. Python: gantikan kod projek percubaan dalam editor yang betul. Pastikan simulator berfungsi dahulu.',
      design: 'Anda ialah pembantu pada hari sambutan sekolah. Pilih satu ikon sambutan dan huruf awal nama atau perkataan ringkas. Gunakan kedua-dua pilihan dalam lencana anda nanti.',
      button: 'Kekalkan ikon permulaan. Tambahkan arahan memaparkan teks untuk Button A. Letakkan kod dalam editor, bukan pada halaman pelajaran ini. Arahan dalam peristiwa butang berjalan apabila butang ditekan.',
      test: 'Buat dua ujian: mulakan semula untuk melihat ikon; tekan A untuk melihat teks pilihan anda. Bandingkan hasil sebenar dengan jangkaan. Ubah satu perkara pada satu masa. Tulis satu ayat tentang perubahan atau bukti kejayaan.',
      transfer: 'Ikut arahan untuk peranti anda. iPad menggunakan aplikasi micro:bit dan Bluetooth; komputer boleh menggunakan USB. Perhatikan peranti sebenar. Jika belum berjaya, pilih perlukan bantuan dengan jujur.',
      evidence: 'Simpan tangkap layar kod dan foto output peranti. Muat naik fail atau tampal tangkap layar. Jangan sertakan wajah atau maklumat peribadi. Jika tidak boleh memuat naik, nyatakan bukti yang boleh ditunjukkan kepada guru.',
      pitstop: 'Ini keadaan sekarang, bukan label kebolehan. New learning: mencuba perkara baharu. Consolidating: mengukuhkan perkara yang dipelajari. Treading water: memerlukan cabaran lebih tinggi. Drowning: berasa terlalu sukar dan memerlukan bantuan. Gunakan ujian anda sebagai bukti dan pilih tindakan seterusnya.',
      plenary: 'Jelaskan program anda: apakah yang muncul apabila A ditekan, dan mengapa? Gunakan rangka ayat secara ringkas. Kemudian ramalkan hasil jika arahan teks dipindahkan ke bahagian permulaan.',
      review: 'Semak nama, kelas dan laporan. Bahagian belum siap ditandakan untuk semakan. Pilih simpan sebagai PDF semasa mencetak, kemudian muat naik ke tugasan Teams Week 2 Project. Simpan sandaran untuk bertukar peranti.',
      extend1: 'Berikan B tugas yang berbeza daripada A dan berguna kepada pengguna. Kekalkan fungsi permulaan dan A. Uji ketiga-tiganya dan rekod hasil.',
      extend2: 'Contoh bermasalah memaparkan teks pada permulaan, tetapi A hanya menunjukkan hati. Jelaskan sebabnya dan arahan yang perlu dipindahkan. Uji pembetulan anda.',
      extend3: 'Minta rakan menggunakan lencana tanpa penerangan anda. Perhatikan satu kekeliruan, baiki satu perkara dan uji semula. Rekod pemerhatian dan perubahan.'
    }
  };
  function blank(name, className, language = 'en') {
    const now = new Date().toISOString();
    return { lessonId: ID, version: VERSION, sessionId: 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8), student: { name, className }, language,
      current: 'starter', reached: 0, responses: {}, cards: {}, checks: {}, evidence: {}, history: [], created: now, updated: now };
  }
  function label(key, value) { return VALUES[key]?.[value] || String(value ?? ''); }
  function missing(s, id) {
    const r = s.responses;
    const out = (REQUIRED[id] || []).filter(k => !String(r[k] || '').trim()).map(k => FIELDS[k][1]);
    if (id === 'setup' && r.device === 'ipad' && r.editor === 'micropython') out.push('Choose MakeCode for this iPad lesson; MicroPython is a separate laptop route.');
    if (id === 'test') {
      if (r.startTest === 'retry' && !r.startActual?.trim()) out.push('What happened on restart?');
      if (r.pressTest === 'retry' && !r.pressActual?.trim()) out.push('What happened when you pressed A?');
    }
    if (id === 'evidence' && (!s.evidence.code || !s.evidence.device) && !r.evidenceAlternative?.trim()) out.push('Code and device images, or a short explanation of the evidence you can show your teacher.');
    return out;
  }
  function grade(key, answer) {
    if (key === 'prediction') return { correct: answer === 'name', message: answer === 'name' ? 'Yes. A has its own event instructions, so pressing A displays AB.' : 'Look at the instructions attached to Button A. Startup shows the icon; the A event displays AB. These happen at different times.' };
    if (key === 'eventCheck') return { correct: answer === 'startup', message: answer === 'startup' ? 'Yes. Location matters: startup code runs on restart. It does not wait for Button A.' : 'An instruction does not know that it is meant for A. Place it in the part of the program that responds to A, rather than in startup.' };
    return null;
  }
  function reviewReasons(s, id) {
    const r = s.responses, out = missing(s, id);
    if (id === 'starter' && grade('prediction', r.prediction)?.correct === false) out.push('Revisit the button-event prediction.');
    if (id === 'plenary' && grade('eventCheck', r.eventCheck)?.correct === false) out.push('Revisit startup versus button-event code.');
    if ((id === 'try' && r.firstRun === 'help') || (id === 'button' && r.buttonBuild === 'help')) out.push('Practical support requested.');
    if (id === 'test' && (r.startTest === 'retry' || r.pressTest === 'retry')) out.push('A simulator test is not successful yet.');
    if (id === 'transfer' && r.physical !== 'worked') out.push('Physical-device success is not demonstrated yet.');
    if (id === 'evidence' && (!s.evidence.code || !s.evidence.device)) out.push('Alternative evidence needs teacher review.');
    if (id === 'evidence' && s.evidenceUnavailable) out.push('Some saved images are unavailable in this browser session.');
    return out;
  }
  function sample(editor, icon = 'HEART', message = 'AB', withButton = true, withB = false) {
    if (!VALUES.icon[icon]) icon = 'HEART';
    const msg = JSON.stringify(String(message || 'AB'));
    if (editor === 'micropython') return `from microbit import *\n\ndisplay.show(Image.${icon})` + (withButton ? `\n\nwhile True:\n    if button_a.was_pressed():\n        display.scroll(${msg})` + (withB ? '\n    if button_b.was_pressed():\n        display.show(Image.YES)' : '') + '\n    sleep(20)' : '');
    return `basic.show_icon(IconNames.${icon})` + (withButton ? `\n\ndef on_button_pressed_a():\n    basic.show_string(${msg})\ninput.on_button_pressed(Button.A, on_button_pressed_a)` + (withB ? '\n\ndef on_button_pressed_b():\n    basic.show_icon(IconNames.YES)\ninput.on_button_pressed(Button.B, on_button_pressed_b)' : '') : '');
  }
  function filename(s, suffix = 'Project', ext = 'pdf') {
    const clean = v => String(v).normalize('NFKC').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '').trim().replace(/\s+/g, '_').slice(0, 80) || 'Student';
    return `Year8_${clean(s.student.className)}_${clean(s.student.name)}_T1W2_${suffix}.${ext}`;
  }
  function validateBackup(obj) {
    if (!obj || obj.lessonId !== ID || obj.version !== VERSION || !obj.state) throw new Error('This is not a Week 2 Smart Badge version 3 backup.');
    const x = obj.state;
    if (!x.student || typeof x.student.name !== 'string' || !x.student.name.trim() || typeof x.student.className !== 'string' || !x.student.className.trim()) throw new Error('The backup is missing a name or class.');
    const s = blank(x.student.name.slice(0,100), x.student.className.slice(0,40), ['en','zh','ko','bm'].includes(x.language) ? x.language : 'en');
    s.current = CARDS.some(c => c.id === x.current) ? x.current : 'starter';
    s.reached = Math.min(CORE.length - 1, Math.max(0, Number(x.reached) || 0));
    for (const key of Object.keys(FIELDS)) if (typeof x.responses?.[key] === 'string') {
      const value = x.responses[key].slice(0, 12000);
      if (!VALUES[key] || Object.hasOwn(VALUES[key], value)) s.responses[key] = value;
    }
    for (const c of CARDS) if (['done','review','started'].includes(x.cards?.[c.id]?.status)) s.cards[c.id] = { status: x.cards[c.id].status, at: String(x.cards[c.id].at || '').slice(0,40) };
    // History is evidence, never executable markup or state to be merged into the app.
    s.history = Array.isArray(x.history) ? x.history.slice(-600).map(h => ({ at: String(h.at || '').slice(0,40), card: String(h.card || '').slice(0,40), type: String(h.type || '').slice(0,60), data: JSON.parse(JSON.stringify(h.data ?? {}).slice(0,100000)) })) : [];
    if (x.legacy && typeof x.legacy === 'object') s.legacy = JSON.parse(JSON.stringify(x.legacy));
    const images = {};
    for (const slot of ['code','device']) {
      const im = obj.images?.[slot];
      if (!im) continue;
      if (typeof im.data !== 'string' || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(im.data) || im.data.length > 7000000) throw new Error('An evidence image is invalid or too large.');
      images[slot] = { data: im.data, caption: String(im.caption || '').slice(0,2000), at: String(im.at || '').slice(0,40) };
      s.evidence[slot] = { caption: images[slot].caption, at: images[slot].at };
    }
    for (const c of CARDS) if (s.cards[c.id]?.status === 'done' && reviewReasons(s,c.id).length) s.cards[c.id].status = 'review';
    s.created = typeof x.created === 'string' ? x.created.slice(0,40) : s.created;
    return { state: s, images };
  }
  const api = { ID, VERSION, LINKS, OBJECTIVES, CARDS, CORE, FIELDS, VALUES, REQUIRED, GLOSSARY, SUPPORT, FEEDBACK_SUPPORT, blank, label, missing, grade, reviewReasons, sample, filename, validateBackup };
  root.Lesson = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
