(function(root){
'use strict';
const T=(en,zh='',ko='')=>({en,zh,ko});
const goals={
 wagba:T('Read and trace short Python Turtle programs to predict and explain their output.','阅读并逐行追踪简短的 Python Turtle 程序，预测并解释输出。','짧은 Python Turtle 프로그램을 읽고 한 줄씩 따라가며 결과를 예측하고 설명한다.'),
 knowledge:T('I know what movement commands, coordinates, angles and comments mean.','我知道移动指令、坐标、角度和注释的含义。','이동 명령, 좌표, 각도, 주석의 뜻을 안다.'),
 skills:T('I can follow code one line at a time and record what happens.','我能逐行追踪代码，并记录每一步的变化。','코드를 한 줄씩 따라가며 변화를 기록할 수 있다.'),
 understanding:T('I can explain how command order, direction and pen state affect the drawing.','我能解释指令顺序、方向和画笔状态如何影响图形。','명령 순서, 방향, 펜 상태가 그림에 미치는 영향을 설명할 수 있다.'),
 challenge:T('Compare two programs and explain why their drawings are the same or different.','比较两个程序，解释为什么图形相同或不同。','두 프로그램의 그림이 같거나 다른 이유를 설명한다.')
};
const terms=[
 ['syntax','语法','문법','The rules for writing code correctly.'],['command','指令','명령','An instruction that tells the Turtle what to do.'],['coordinate','坐标','좌표','A position described by an x-value and a y-value.'],['angle','角度','각도','The size of a turn, measured here in degrees.'],['parameter','参数','매개변수','An input a command accepts. The number supplied is its argument (value).'],['comment','注释','주석','A note for people reading the code; it begins with #.'],['predict','预测','예측','Work out what should happen before checking.']
];
function q(id,stem,options,correct,why,hint){return {id,stem,options:options.map(o=>typeof o==='string'?T(o):o),correct,why,hint};}
const questions={
 ready:q('ready',T('Before tracing, what should you check?','追踪代码前应该检查什么？','코드를 따라가기 전에 무엇을 확인해야 할까요?'),[T('Starting position, facing direction and pen state','起始位置、朝向和画笔状态','시작 위치, 바라보는 방향, 펜 상태'),T('Only the pen colour','只看画笔颜色','펜 색깔만'),T('Only the final line of code','只看最后一行代码','마지막 코드 줄만')],0,T('Track three things: position, facing direction and whether the pen is down.','追踪三个信息：位置、朝向、画笔是否放下。','위치, 방향, 펜 상태 세 가지를 확인하세요.')),
 retrieval1:q('retrieval1',T('What destination does t.goto(60, 20) specify?','t.goto(60, 20) 指定哪个位置？','t.goto(60, 20)이 지정하는 위치는 어디인가요?'),['x = 20, y = 60','x = 60, y = 20','60° clockwise'],1,T('Coordinates are written (x, y): across first, then up or down.','坐标是 (x, y)：先看左右位置，再看上下位置。','좌표는 (x, y)입니다. 가로 위치를 먼저, 세로 위치를 다음에 읽으세요.')),
 retrieval2:q('retrieval2',T('Turtle is already at (60, 20). It runs t.goto(60, 20) again. What happens?','Turtle 已经在 (60, 20)。再次执行 t.goto(60, 20) 会怎样？','이미 (60, 20)에 있습니다. t.goto(60, 20)을 다시 실행하면 어떻게 될까요?'),[T('It moves to (120, 40)','移动到 (120, 40)','(120, 40)으로 이동한다'),T('It returns to (0, 0)','回到 (0, 0)','(0, 0)으로 돌아간다'),T('It stays at (60, 20)','留在 (60, 20)','(60, 20)에 그대로 있다')],2,T('goto gives a destination, not an extra distance.','goto 指定目的地，不是额外移动的距离。','goto는 더 이동할 거리가 아니라 도착 위치를 지정합니다.')),
 retrieval3:q('retrieval3',T('Which command prepares Turtle to move without drawing?','哪条指令让 Turtle 移动时不画线？','어떤 명령이 선을 그리지 않고 이동하게 하나요?'),['t.pendown()','t.penup()','t.right(90)'],1,T('Pen up stops the line, not the movement.','提笔只是不画线，并不会停止移动。','펜을 올리면 선이 생기지 않지만 이동은 계속됩니다.')),
 syntax:q('syntax',T('Which line fixes the missing punctuation in t.goto(80 40)?','哪一行修正了 t.goto(80 40) 缺少的标点？','t.goto(80 40)의 빠진 문장부호를 바르게 고친 것은?'),['t.goto(80.40)','t.goto(80, 40)','t.goto 80, 40'],1,T('Use a comma between x and y, inside the brackets.','在括号里用逗号分隔 x 和 y。','괄호 안에서 x와 y 사이에 쉼표를 넣습니다.')),
 move:q('move',T('Start at (20, 0), facing right. Where does t.forward(40) finish?','从 (20, 0) 开始，朝右。t.forward(40) 后在哪里？','(20, 0)에서 오른쪽을 보고 있습니다. t.forward(40) 뒤의 위치는?'),['(40, 0)','(20, 40)','(60, 0)'],2,T('forward moves from the current position: 20 + 40 = 60.','forward 从当前位置移动：20 + 40 = 60。','forward는 현재 위치에서 이동합니다. 20 + 40 = 60입니다.')),
 turn:q('turn',T('Start facing right. After t.left(90), which way does Turtle face?','开始朝右。t.left(90) 后朝向哪里？','처음에 오른쪽을 보고 있습니다. t.left(90) 후에는 어디를 볼까요?'),[T('Up ↑','上 ↑','위 ↑'),T('Down ↓','下 ↓','아래 ↓'),T('Left ←','左 ←','왼쪽 ←')],0,T('left(90) is a quarter-turn anticlockwise. The position does not change.','left(90) 是逆时针转四分之一圈，位置不变。','left(90)은 반시계 방향으로 4분의 1바퀴 회전합니다. 위치는 변하지 않습니다.')),
 pen:q('pen',T('Which part leaves a visible line?','哪一段会画出看得见的线？','어느 구간에 선이 생길까요?'),['(0, 0) → (80, 0)','(80, 0) → (80, 40)',T('Both parts','两段都会','두 구간 모두')],1,T('The pen is up for the first movement and down for the second.','第一段移动时提笔，第二段移动时落笔。','첫 이동은 펜을 올린 상태이고, 두 번째는 내린 상태입니다.')),
 comment:q('comment',T('Choose the more useful comment for the code above.','为上方代码选择更有用的注释。','위 코드를 더 잘 설명하는 주석을 고르세요.'),['# My code','# Move to the starting point without drawing','# Turn right'],1,T('A meaningful comment explains the purpose of this section. It does not run as a movement command.','有意义的注释解释这一段代码的目的。它不会作为移动指令执行。','좋은 주석은 이 부분의 목적을 설명합니다. 이동 명령으로 실행되지 않습니다.')),
 hinge:q('hinge',T('At (40, 0), facing right, Turtle runs t.right(90). Where is it now?','在 (40, 0)，朝右。执行 t.right(90) 后是什么状态？','(40, 0)에서 오른쪽을 보며 t.right(90)을 실행합니다. 결과는?'),[T('(130, 0), facing right','(130, 0)，朝右','(130, 0), 오른쪽'),T('(40, 0), facing down','(40, 0)，朝下','(40, 0), 아래쪽'),T('(40, -90), facing down','(40, -90)，朝下','(40, -90), 아래쪽')],1,T('Turn on the spot. A turn changes heading, not distance or position.','原地转向。转向改变朝向，不改变距离或位置。','제자리에서 회전합니다. 방향만 바뀌고 위치는 변하지 않습니다.')),
 compareA:q('compareA',T('Program A: predict the final position.','程序 A：预测最终位置。','프로그램 A: 마지막 위치를 예측하세요.'),['(80, 40)','(0, -120)','(80, -40)'],2,T('Move 80 right, turn down, then move 40 down.','先向右 80，转向下，再向下 40。','오른쪽으로 80 이동하고 아래로 회전한 뒤 40 이동합니다.')),
 compareB:q('compareB',T('Program B: predict the final position.','程序 B：预测最终位置。','프로그램 B: 마지막 위치를 예측하세요.'),['(0, -120)','(80, -40)','(0, 120)'],0,T('Turn first. Both movements are now downwards: 80 + 40.','先转向。两次移动都向下：80 + 40。','먼저 회전합니다. 두 이동 모두 아래쪽으로 80 + 40입니다.')),
 exit:q('exit',T('Turtle faces up, turns right 90°, then moves forward 30. Which direction does it travel?','Turtle 朝上，右转 90° 后前进 30。它朝哪个方向移动？','위를 보다가 오른쪽으로 90° 회전하고 30만큼 전진합니다. 어느 방향으로 이동할까요?'),[T('Up ↑','上 ↑','위 ↑'),T('Left ←','左 ←','왼쪽 ←'),T('Right →','右 →','오른쪽 →'),T('Down ↓','下 ↓','아래 ↓')],2,T('A clockwise quarter-turn from up faces right. Then forward follows that direction.','从朝上顺时针转四分之一圈后朝右，再沿该方向前进。','위에서 시계 방향으로 4분의 1바퀴 돌면 오른쪽입니다. 그 방향으로 전진합니다.'))
};
const examples={
 move:{code:'t.forward(40)',start:{x:20,y:0,h:0,pen:true}},
 turn:{code:'t.left(90)',start:{x:0,y:0,h:0,pen:true}},
 pen:{code:'t.penup()\nt.goto(80, 0)\nt.pendown()\nt.goto(80, 40)',start:{x:0,y:0,h:0,pen:true}},
 comment:{code:'# Move to the starting point without drawing\nt.penup()\nt.goto(-80, 0)\nt.pendown()',start:{x:0,y:0,h:0,pen:true}},
 route:{code:'t.goto(0, -100)\nt.goto(0, 100)\nt.goto(200, 100)',start:{x:0,y:-200,h:0,pen:true},bounds:{minX:-100,maxX:300,minY:-250,maxY:150,step:100}},
 compareA:{code:'t.forward(80)\nt.right(90)\nt.forward(40)',start:{x:0,y:0,h:0,pen:true}},
 compareB:{code:'t.right(90)\nt.forward(80)\nt.forward(40)',start:{x:0,y:0,h:0,pen:true}},
 checkpoint:{code:'t.penup()\nt.goto(-40, 20)\nt.pendown()\nt.forward(80)\nt.right(90)\nt.forward(40)',start:{x:0,y:0,h:0,pen:true}}
};
const stages=[
 {id:'read',name:T('Read now','开始阅读','먼저 읽기'),time:'0–3',title:T('Can you predict the route?','你能预测路线吗？','경로를 예측할 수 있나요?')},
 {id:'do',name:T('Do now','现在行动','시작 활동'),time:'3–7',title:T('Bring back last week’s learning','回顾上周的学习','지난 시간의 학습 떠올리기')},
 {id:'types',name:T('Types of learning','学习目标','학습 목표'),time:'7–10',title:T('Choose your focus','选择你的重点','오늘의 집중 영역 고르기')},
 {id:'main1',name:T('Main task 1','主要任务 1','주요 활동 1'),time:'10–25',title:T('Read the commands','读懂指令','명령 읽기')},
 {id:'main2',name:T('Main task 2','主要任务 2','주요 활동 2'),time:'25–45',title:T('Be the computer','像计算机一样追踪','컴퓨터처럼 따라가기')},
 {id:'extension',name:T('Extension','拓展','심화 활동'),time:'Optional',title:T('Go one step further','再进一步','한 걸음 더')},
 {id:'pitstop',name:T('Learning pitstop','学习加油站','학습 점검'),time:'45–48',title:T('What has changed?','你有什么进步？','무엇이 달라졌나요?')},
 {id:'plenary',name:T('Plenary','总结','마무리'),time:'48–50',title:T('One final prediction','最后一次预测','마지막 예측')},
 {id:'submit',name:T('Submit','提交','제출'),time:'50–60',title:T('Save. Find. Attach. Turn in.','保存、找到、附加、提交。','저장. 찾기. 첨부. 제출.')},
 {id:'challenge',name:T('Turtle challenge','Turtle 挑战','Turtle 도전'),time:'After submission',title:T('Turtle Trace Challenge','Turtle 追踪挑战','Turtle 코드 추적 도전')}
];
const before=[T('This is new','这是新知识','처음 배우는 내용'),T('I can do some of this','我能做到一部分','일부는 할 수 있음'),T('I can do this independently','我能独立完成','혼자 할 수 있음'),T('Not sure yet','还不确定','아직 잘 모르겠음')];
const after=[T('New learning','新学习','새로 배움'),T('Consolidating','正在巩固','연습하며 익히는 중'),T('Treading water','原地踏步','아직 제자리인 느낌'),T('Drowning — I need help','遇到困难，需要帮助','어려워서 도움이 필요함'),T('Not attempted yet','尚未尝试','아직 시도하지 않음')];
root.Lesson={T,goals,terms,questions,examples,stages,before,after};
})(window);
