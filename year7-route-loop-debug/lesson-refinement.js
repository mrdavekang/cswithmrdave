/* Lesson refinement: guided practice followed by independent transfer. */
(() => {
 const L=window.LOOP_LESSON;
 L.wagba='Replace repeated commands with a loop, test its output and explain how we fixed two bugs.';
 L.k='I know that the repeat count controls how many times the indented commands run.';
 L.s='I can identify repeated commands, write a loop and test one change at a time.';
 L.u='I can explain why changing the count or indentation changes the drawing.';
 const square=L.challenges.find(c=>c.id==='square');
 square.prediction={q:'After TWO repeats, where is Turtle compared with its start, and which way does it face?',options:['80 right and 80 down; facing left','80 right and 80 down; facing down','Back at the start; facing right'],answer:0,why:'Each repeat moves then turns. Two repeats draw the top and right sides. Turtle is 80 units right and 80 down from its start, facing left.'};
 square.investigate={q:'Which commands run four times?',options:['Only t.forward(80)','Both t.forward(80) and t.right(90)','Every line, including t.done()'],answer:1,why:'The two indented commands belong to the loop body. t.done() is outside the loop and runs once afterwards.'};
 square.modify='Make every side 120 units long. Keep the same number of sides. Before typing, tell your partner which value you expect to change. Run your version and compare it with the original.';
 square.modifyZH='让每条边变成 120，边数保持不变。先说出你打算修改哪个数，再运行比较。';
 square.modified=L.code('for i in range(4):\n    t.forward(120)\n    t.right(90)');
 square.make='Draw a square with sides of 60 units using ONE loop. Your starting position is already set. Replace the repeated commands in the editor with a loop. Say which two commands repeat before typing.';
 square.makeZH='起点已设置。把编辑器里重复的指令改成一个循环，画边长 60 的正方形。先说出重复的两条指令。';
 square.starter=L.code(Array(4).fill('t.forward(60)\nt.right(90)').join('\n'),80,100);
 square.solution=L.code('for i in range(4):\n    t.forward(60)\n    t.right(90)',80,100);
 square.criteria=['One loop replaces the repeated commands','Both move and turn are indented','Four sides of 60 units; drawing closes'];
 square.target=[[80,100],[140,100],[140,40],[80,40],[80,100]];
 square.note='My loop repeats ___ and ___, a total of ___ times.';
 const count=L.challenges.find(c=>c.id==='countbug');
 count.title='Code detective · Case A';count.zh='代码侦探 · 案例 A';
 count.scenario='Sam wants a closed square with four sides of 80 units. The starting position is already set. Read the program and predict its output before you run it. Your job is to find what does not match, then test one repair.';
 count.scenarioZH='Sam 想画四条边长 80 的完整正方形。先预测，再运行，找出不符合目标的地方并测试一个修改。';
 count.concept='The target is a closed square with four equal sides. Follow the loop one repeat at a time. Count the lines it will draw. A program can run without an error message and still give the wrong result.';
 count.modify='Repair the program so it draws the intended closed square. Change ONE thing, run again and compare Before with After. If you are unsure, use a hint.';
 count.modifyZH='只修改一处，让图形变成完整正方形。再运行，比较修改前后。需要时查看提示。';
 const indent=L.challenges.find(c=>c.id==='indentbug');
 indent.title='Code detective · Case B';indent.zh='代码侦探 · 案例 B';
 indent.scenario='Alex wants a closed square with four sides of 60 units. Read this new program carefully. Predict the drawing, then run it. Use the output to decide what you should inspect.';
 indent.scenarioZH='Alex 想画四条边长 60 的完整正方形。阅读新程序，先预测再运行，用结果决定检查哪里。';
 indent.concept='Read the spaces at the start of each line. Which commands belong to the repeated group? Trace one repeat, then a second. Do not assume that a running program produces the intended drawing.';
 indent.modify='Repair this program without changing any numbers. Run again and compare the drawings. Check whether a turn happens after every move. Use a hint if you need help finding the edit.';
 indent.modifyZH='不改数字，修复程序。再运行比较，检查每次前进后是否都转弯。需要时查看提示。';
 L.exitQuestions=[
 {id:'exit1',title:'Count the movements',code:'for i in range(3):\n    t.forward(20)\n    t.forward(10)',q:'How many forward commands execute altogether?',options:['3','6','30'],answer:1,why:'Two forward commands run in each of three repeats: 2 × 3 = 6.',zh:'三次循环，每次执行两条 forward，一共执行几次？'},
 {id:'exit2',title:'Find the outside command',code:'for i in range(5):\n    t.forward(15)\nt.left(72)',q:'Which command runs once after the loop?',options:['t.forward(15)','t.left(72)','Both commands run five times'],answer:1,why:'The left turn starts at the left edge, outside the loop. It runs once after all five forward movements.',zh:'哪条指令在循环结束后只执行一次？'},
 {id:'exit3',title:'Choose one repair',code:'for i in range(4):\n    t.forward(45)\n    t.right(60)',q:'The target is a square. Keep four repeats and sides of 45. Which single edit fixes this program?',options:['Change range(4) to range(3)','Change forward(45) to forward(90)','Change right(60) to right(90)'],answer:2,why:'A square needs a 90° turn after each side. The count and distance already match the brief.',zh:'目标是正方形，保留四次重复和边长 45。哪一个修改能修复程序？'}
 ];
})();
