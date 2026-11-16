window.GateLesson=(()=>{
const tr=(en,zh,ko)=>({en,zh,ko});
const stage={
 now:tr('Do Now · 6 min','课前任务 · 6 分钟','시작 활동 · 6분'),
 goals:tr('Types of Learning · 4 min','学习类型 · 4 分钟','학습 유형 · 4분'),
 repair:tr('Main Task 1 · 12 min total','主要任务一 · 共 12 分钟','주요 활동 1 · 총 12분'),
 build:tr('Main Task 2 · 22 min total','主要任务二 · 共 22 分钟','주요 활동 2 · 총 22분'),
 pit:tr('Learning Pitstop · 4 min','学习小停站 · 4 分钟','학습 점검 · 4분'),
 challenge:tr('Retry or Extension · 5 min','重试或挑战 · 5 分钟','다시 도전 또는 확장 · 5분'),
 plenary:tr('Plenary · 5 min','全班总结 · 5 分钟','전체 정리 · 5분'),
 exit:tr('Exit Reflection · 2 min','离堂反思 · 2 分钟','마무리 생각 · 2분')
};
const visuals={
 recall:['01-surprise-visitor','Last week’s MakeCode A script: add to the count, then check the alert rule.'],
 goal:['02-types-of-learning','School posters for Knowledge, Skills and Understanding.'],
 open:['03-import-the-starter','MakeCode Home Import button and the Import File option.'],
 buttons:['04-simulator-buttons','Simulator: button A on the left, button B on the right, and the light grid in the middle.'],
 fault:['05-the-fake-reset','Faulty MakeCode starter: A adds one and shows visitors; B only shows a fixed zero.'],
 variables:['06-find-the-set-block','The Variables toolbox with the set block.'],
 logic:['07-find-the-decision','The Logic toolbox and the if–then–else block.'],
 comparison:['08-comparison-menu','The list of comparison signs in MakeCode.'],
 flash:['09-one-flash-pattern','A visible flash uses show icon, pause, clear screen, then pause.'],
 test:['10-visitor-stress-test','Simulator snapshots at six, during the warning at seven, and after the warning.'],
 pit:['11-learning-pitstop','School Learning Pitstop poster and four possible next actions.'],
 rival:['12-the-eighth-visitor','A rival booth checks whether the visitor count equals exactly seven.'],
 decision:['13-decision-worked-example','Points game: three or more shows a star; below three shows the points.'],
 repeat:['14-repeat-worked-example','Button B runs two flashes, then shows two once outside the loop.'],
 loops:['15-find-repeat','The Loops toolbox with the repeat block.']
};
const cards=[
{id:'predict',stage:'now',visual:'recall',title:tr('The surprise visitor','突然来了一位访客','깜짝 방문객'),
 lead:tr('Last week’s booth has 4 visitors. One more arrives. Before anyone presses A, read the blocks and predict what you will see.','上周的展位已有 4 位访客。又来了一位。在按 A 前，读积木，猜猜会显示什么。','지난주 부스에 방문객이 4명 있어요. 한 명이 더 왔어요. A를 누르기 전에 블록을 읽고 무엇이 보일지 예상하세요.')},
{id:'learning',stage:'goals',visual:'goal',title:tr('Pick your repair move','选一个修理行动','수리 방법 고르기'),
 lead:tr('WAGBA: We are getting better at making a counter follow a rule and proving it works. Choose one thing to focus on today.','今天要进步的是：让计数器按规则运行，并证明它正常工作。选一个今天的重点。','오늘의 목표: 규칙대로 움직이는 계수기를 만들고 제대로 작동하는지 확인해요. 오늘 집중할 한 가지를 고르세요.')},
{id:'setup',stage:'repair',visual:'open',title:tr('Open the faulty starter','打开有故障的项目','고장 난 시작 파일 열기'),
 lead:tr('The guide thinks the counter works. Open your own copy and find out. Keep this lesson and MakeCode open in separate tabs.','导览员觉得计数器没问题。打开你自己的副本来检查。保留本课和 MakeCode 两个标签页。','안내자는 계수기가 제대로 된다고 생각해요. 내 파일을 열어 확인하세요. 수업과 MakeCode를 서로 다른 탭에 열어 두세요.')},
{id:'fault',stage:'repair',visual:'fault',title:tr('Catch the fake reset','找出假重置','가짜 초기화 찾기'),
 lead:tr('Start from a fresh run. Press A three times, press B, then press A once more. Wait for the screen after each press.','从新的运行开始。按 A 三次，再按 B，最后再按一次 A。每次按完都等屏幕显示完。','시뮬레이터를 다시 시작하세요. A를 세 번, B를 한 번, 마지막으로 A를 한 번 누르세요. 매번 화면 표시가 끝날 때까지 기다리세요.')},
{id:'repair',stage:'repair',visual:'variables',title:tr('Fix B and run the same test','修好 B，再做同样的测试','B를 고치고 같은 시험 다시 하기'),
 lead:tr('Back in MakeCode, change B so it resets the stored count, then displays that count. Test the whole button sequence again.','回到 MakeCode，修改 B：先重置储存的人数，再显示这个人数。重新测试整组按键。','MakeCode에서 B가 저장된 수를 초기화한 뒤 그 수를 표시하도록 바꾸세요. 같은 버튼 순서로 다시 시험하세요.')},
{id:'model-decision',stage:'build',visual:'decision',title:tr('Follow the two paths','读懂两个分支','두 갈래 따라가기'),
 lead:tr('This is a different project. A adds one point. If the NEW total is 3 or more, it shows a star. Otherwise it shows the number.','这是另一个项目。A 加一分。如果新分数是 3 或更多，就显示星星，否则显示分数。','다른 프로젝트예요. A를 누르면 점수가 1 늘어요. 새 점수가 3 이상이면 별을, 아니면 점수를 보여 줘요.')},
{id:'build-decision',stage:'build',visual:'logic',title:tr('Give the booth its new rule','给展位加一条新规则','부스에 새 규칙 넣기'),
 lead:tr('Back in your counter, add a decision inside A, after adding one. For now, show your warning icon if the new total is 7 or more. Otherwise show the count.','回到你的计数器，在 A 的加一积木后面加判断。先让新人数达到 7 或更多时显示警告图案，否则显示人数。','내 계수기로 돌아가 A에서 1을 더한 뒤 판단 블록을 넣으세요. 우선 새 인원이 7명 이상이면 경고 그림을, 아니면 숫자를 보여 주세요.')},
{id:'flash',stage:'build',visual:'flash',title:tr('Make one visible flash','让图案闪一次','한 번 깜빡이게 만들기'),
 lead:tr('A flash needs time to be seen and time to be off. Read the four blue blocks, then try that pattern in your warning branch.','闪烁需要亮一会儿，再灭一会儿。读这四个蓝色积木，然后在你的警告分支中试试。','깜빡임은 켜진 시간과 꺼진 시간이 모두 필요해요. 파란 블록 네 개를 읽고 경고 갈래에서 이 순서를 시험하세요.')},
{id:'repeat',stage:'build',visual:'repeat',title:tr('Make the warning flash three times','让警告闪三次','경고를 세 번 깜빡이게 하기'),
 lead:tr('The sample uses B to flash twice. In YOUR counter, keep B as reset. Repeat the flash pattern THREE times on the warning path of A, then show visitors after the loop.','示例用 B 闪两次。你的计数器中，B 仍然负责重置。在 A 的警告分支中把闪烁重复三次，然后在循环后显示人数。','예시는 B로 두 번 깜빡여요. 내 계수기에서는 B를 초기화로 남겨 두세요. A의 경고 갈래에서 세 번 깜빡인 뒤 반복 바깥에서 인원을 보여 주세요.')},
{id:'test',stage:'build',visual:'test',title:tr('Can your booth pass the stress test?','你的展位能通过压力测试吗？','부스가 테스트를 통과할까요?'),
 lead:tr('Test 6, 7, 8, and B then A in MakeCode. Wait for each output. A partner can be the visitor while you watch, then swap. Record what you really saw.','在 MakeCode 测试 6、7、8，以及按 B 后再按 A。等每次显示结束。可以让同伴按键，你观察，然后交换。记录你实际看到的结果。','MakeCode에서 6, 7, 8과 B 다음 A를 시험하세요. 각 표시가 끝날 때까지 기다리세요. 짝이 버튼을 누르고 내가 본 뒤 역할을 바꿔도 돼요. 실제로 본 결과를 기록하세요.')},
{id:'pitstop',stage:'pit',visual:'pit',title:tr('What does your crew need?','你的修理队需要什么？','우리 수리팀에 무엇이 필요할까요?'),
 lead:tr('Pick how it feels right now. Then try the next step. Your choice is not a grade.','选一个符合你现在感受的阶段，然后试试下一步。这个选择不计分。','지금 내 상태를 고르고 다음 행동을 해 보세요. 선택은 점수가 아니에요.')},
{id:'challenge',stage:'challenge',title:tr('Retry or take the mystery glitch','重试，或找出神秘故障','다시 시험하거나 숨은 오류 찾기'),
 lead:tr('Choose one route. If you are still fixing your own counter, that is a useful next move.','选一条路线。如果你还在修自己的计数器，继续修也是很好的下一步。','한 가지 길을 고르세요. 아직 내 계수기를 고치는 중이라면 그 일을 계속해도 좋아요.')},
{id:'plenary',stage:'plenary',visual:'buttons',title:tr('Would you open the booth?','你会开放这个展位吗？','부스 문을 열어도 될까요?'),
 lead:tr('The guide presses B and sees 0. The guide says, “Ready!” What one extra press would prove the stored count really reset?','导览员按 B，看到 0，就说“准备好了！”再按哪个键可以证明储存的人数真的重置了？','안내자가 B를 눌러 0을 보고 “준비 끝!”이라고 해요. 저장된 수가 정말 초기화됐는지 어떤 버튼을 한 번 더 눌러 확인할까요?')},
{id:'exit',stage:'exit',title:tr('Hand over to the next guide','把展位交给下一位导览员','다음 안내자에게 넘겨주기'),
 lead:tr('Save your MakeCode project. Tell the next guide one useful test: “Try ___. You should see ___.” You can say it aloud.','保存你的 MakeCode 项目。告诉下一位导览员一个有用的测试：“试试___，你应该看到___。”可以口头说。','MakeCode 프로젝트를 저장하세요. 다음 안내자에게 유용한 시험을 하나 알려 주세요. “___ 해 보세요. ___ 이(가) 보여야 해요.” 말로 해도 돼요.')},
];
return {tr,stage,visuals,cards};
})();
