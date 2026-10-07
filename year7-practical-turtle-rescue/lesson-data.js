window.RescueLesson = (() => {
  const code = (...lines) => lines.join('\n');
  const step = (label, paper, title, instruction, zh, options) => ({label, paper, title, instruction, zh, options});
  const missions = [
    {id:'task1', title:'Collect A, then B', tag:'Mission 1', pages:'Paper pages 2–3', colour:'#7c3aed',
      goal:'Draw one continuous route: START → A → B.', goalZh:'画一条连续路线：起点 → A → B。',
      stops:[['START',-120,-80],['A',-120,20],['B',40,20]],
      starter:code('import turtle as t','','t.penup()','t.goto(-120, -80)','t.pendown()','','t.goto(-120, -20)','','t.done()'),
      steps:[
        step('Predict','01.1','Where will it stop?','Read line 7. Choose where the Turtle will stop BEFORE you press Run.','先读第 7 行。运行前，选出海龟会停在哪个坐标。',['(-120, -20)','(-120, 20)','(40, 20)']),
        step('Run','01.2','Watch the first line','Press Run. Look at the end of the line. Did it reach power cell A?','按 Run（运行）。看线的终点：它到达能量电池 A 了吗？',['Yes','Not yet']),
        step('Investigate','01.3','Which number needs changing?','Compare line 7 with A = (-120, 20). Choose which coordinate number must change.','把第 7 行与 A 的坐标 (-120, 20) 比较。需要改的是哪个坐标？',['The x number','The y number']),
        step('Modify','01.4','Fix the line to A','In line 7, change only the SECOND number so the line reaches A = (-120, 20). Keep x at -120. Then press Run.','只改第 7 行的第二个数字，使路线到达 A = (-120, 20)。x 保持 -120，再运行。'),
        step('Make','01.5','Add the journey to B','Keep your working command for A. Add ONE t.goto command for B = (40, 20), before t.done(). Run, then copy your two route commands onto page 3.','保留到达 A 的指令。在 t.done() 前加一条 t.goto 指令，到达 B = (40, 20)。运行后，把两条路线指令写在试卷第 3 页。')
      ], hints:[
        'In t.goto(x, y), read the first number as x and the second as y.',
        'The drawn line shows what the code actually did. Your first guess can be different.',
        'Look at the second number in each coordinate pair. A is above the starter’s endpoint.',
        'A is above START. A larger y number moves the endpoint up. Keep the minus sign on x.',
        'The new command goes after the command for A, but before t.done(). Leave the pen down.'
      ]},
    {id:'task2', title:'Find the safe exit', tag:'Mission 2', pages:'Paper pages 4–5', colour:'#e87918',
      goal:'B → corner 1 → corner 2 → EXIT. Stay outside the blocked room.', goalZh:'B → 拐点 1 → 拐点 2 → 出口。路线不能穿过封闭房间。',
      stops:[['B',40,20],['1',120,20],['2',120,100],['EXIT',40,100]],
      starter:code('import turtle as t','','t.penup()','t.goto(40, 20)','t.pendown()','','t.forward(80)','t.right(90)','t.forward(80)','','t.done()'),
      steps:[
        step('Predict','02.1','Which way after the turn?','A fresh Turtle faces RIGHT. Read t.right(90). Will the next line go up or down? Choose before running.','新海龟朝右。读 t.right(90)：下一条线向上还是向下？先预测，再运行。',['Up','Down']),
        step('Run','02.2','Watch the wrong turn','Run the starter. Watch its second line. Which way did it go?','运行起始代码，观察第二条线。它朝哪个方向走？',['Up','Down']),
        step('Investigate','02.3','Find the turning command','Which command changes the direction the Turtle faces? Choose the command, not the movement.','哪条指令改变海龟朝向？选转向指令，不是移动指令。',['t.forward(80)','t.right(90)','t.pendown()']),
        step('Modify','02.4','Turn UP to corner 2','Replace the wrong turn so the second line goes UP to (120, 100). Keep both forward distances at 80. Press Run to check.','改正转向，让第二条线向上到达 (120, 100)。两个前进距离都保持 80，然后运行检查。'),
        step('Make','02.5','Finish LEFT at EXIT','Continue from corner 2 LEFT to EXIT = (40, 100). Add t.goto OR a turn and forward command before t.done(). Run, then copy your route commands onto page 5.','从拐点 2 向左走到 EXIT = (40, 100)。在 t.done() 前加 t.goto，或转向加前进指令。运行后，把路线指令写在第 5 页。')
      ], hints:[
        'Imagine facing right, then making a clockwise quarter-turn. Which way would you face?',
        'Run the original starter here. Your edited route is kept safely in Modify and Make.',
        'forward moves. left and right turn the Turtle without moving it.',
        'Choose a turn that faces up before the second forward. Do not change the distance.',
        'At corner 2, the Turtle faces up. To use forward next, first turn to face left; or use the EXIT coordinates.'
      ]},
    {id:'rectangle', title:'Rectangle builder', tag:'Shape Studio 1', pages:'Paper page 6', colour:'#7c3aed', extra:true,
      goal:'Make an 80 × 40 rectangle. Move its start to (20, -60).', goalZh:'画一个宽 80、高 40 的长方形，起点改为 (20, -60)。',
      starter:code('import turtle as t','t.penup()','t.goto(-140, -60)','t.pendown()','t.forward(60)','t.right(90)','t.forward(60)','t.right(90)','t.forward(60)','t.right(90)','t.forward(60)','t.right(90)','t.done()'),
      steps:[
        step('Predict','','What shape is the sample?','Read the code. Tell a partner what shape it will draw. Tap when you have made your prediction.','读代码，告诉同伴它会画什么。预测后点击确认。'),
        step('Run','','Try the sample','Press Run. Watch the four equal sides join.','运行代码，观察四条等长的边连起来。'),
        step('Investigate','','Find width and height','Find the four forward commands. The 1st and 3rd draw the width; the 2nd and 4th draw the height. Point them out to a partner.','找出四条 forward 指令。第一、三条画宽度；第二、四条画高度。指给同伴看。'),
        step('Modify','','Make the rectangle','Change the four distances to 80, 40, 80, 40. Keep the turns at 90. Run again.','把四个距离改成 80、40、80、40。转角保持 90，再运行。'),
        step('Make','','Move it to the right','Change the starting position to (20, -60). Run, then copy the eight movement/turn commands onto page 6.','把起点改成 (20, -60)。运行后，在第 6 页写下八条移动和转向指令。')
      ], hints:['Count the forward commands and look at the turn size.','Your drawing does not have to match your first prediction.','Opposite sides should have matching distances.','Change distance values, not turn angles.','The start is the goto between penup and pendown.']},
    {id:'triangle', title:'Triangle explorer', tag:'Shape Studio 2', pages:'Paper page 7', colour:'#db2777', extra:true,
      goal:'Make three 90-unit sides. Move the start to (40, 0).', goalZh:'画三条长度为 90 的边，起点改为 (40, 0)。',
      starter:code('import turtle as t','t.penup()','t.goto(-120, 0)','t.pendown()','t.forward(60)','t.left(120)','t.forward(60)','t.left(120)','t.forward(60)','t.left(120)','t.done()'),
      steps:[
        step('Predict','','How many sides?','Read the sample. Tell a partner how many sides it will draw, then record that you predicted.','读代码，告诉同伴会画几条边，再点击记录。'),
        step('Run','','Try the triangle','Run the sample. Check that the three sides join.','运行代码，检查三条边是否连起来。'),
        step('Investigate','','Moves and turns','Point to the three moves and three turns. 120 is how far the Turtle turns, NOT the triangle’s inside angle.','指出三条移动和三条转向指令。120 是海龟转过的角度，不是三角形内角。'),
        step('Modify','','Make it larger','Change ALL three forward distances from 60 to 90. Keep each turn at 120. Run again.','把三个 forward 距离都从 60 改成 90。每个转角保持 120，再运行。'),
        step('Make','','Place it on the right','Change the start to (40, 0). Run, then copy the six movement/turn commands onto page 7.','把起点改成 (40, 0)。运行后，在第 7 页写下六条移动和转向指令。')
      ], hints:['Count forward commands.','Watch the line finish at its start.','A move draws a side. The turn changes the next direction.','Change every 60 used in forward, not every number in the program.','Change the goto between penup and pendown.']},
    {id:'design', title:'My own drawing', tag:'Shape Studio 3', pages:'Paper page 8', colour:'#0284c7', extra:true,
      goal:'Create a house or robot face with at least six drawing commands.', goalZh:'用至少六条绘图指令画一座房子或机器人脸。',
      starter:code('import turtle as t','t.penup()','t.goto(-100, -40)','t.pendown()','t.goto(-100, 40)','t.goto(-20, 40)','t.done()'),
      steps:[
        step('Predict','','Imagine the two lines','Read the sample. Say where its two lines will go, then record your prediction.','读代码，说说两条线会画在哪里，再点击记录。'),
        step('Run','','See the corner','Run to see an upside-down L on the left of the centre.','运行，观察中心左边倒过来的 L 形。'),
        step('Investigate','','Find the x numbers','Point to the start and two destinations. The FIRST number in each pair is x.','指出起点和两个终点。每对坐标的第一个数字是 x。'),
        step('Modify','','Reflect it to the right','Change the x values -100 and -20 to 100 and 20. Keep y values the same. Run again.','把 x 的 -100 和 -20 改为 100 和 20。y 不变，再运行。'),
        step('Make','','Create your own design','Sketch a house or robot face on page 8. Start a fresh drawing below. Use at least six drawing commands and two direction changes. Run, improve and copy your code to paper.','在第 8 页先画草图，再编程。使用至少六条绘图指令和两次方向变化。运行、改进，并把代码写在纸上。')
      ], hints:['Read each goto destination in order.','Only the lines need to appear, not the whole map.','x tells you left/right.','Positive x numbers place the drawing right of the centre.','Use penup and pendown if you need to move to another part without drawing.']}
  ];
  return {id:'y7-turtle-rescue-practical-v1', title:'Turtle Rescue', wagba:'Predict, run, fix and extend Turtle code to reach a target safely.',
    k:'x is left/right; y is up/down. A turn changes direction.', s:'Change a command, run the program and check its drawing.',
    u:'The numbers and order of commands change the route.', keywords:['sequence','coordinate','move','turn','debug','test'],
    missions, steps:['Predict','Run','Investigate','Modify','Make']};
})();
