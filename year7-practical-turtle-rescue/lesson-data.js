// Only workspace labels and starter code. All assessment questions are on paper.
window.RescueLesson={id:'y7-turtle-rescue-workspace-v2',title:'Turtle Rescue',
  wagba:'Predict, run, fix and extend Turtle code to reach a target safely.',
  k:'x is left/right; y is up/down. A turn changes direction.',
  s:'Change a command, run the program and check its drawing.',
  u:'The numbers and order of commands change the route.',
  keywords:['sequence','coordinate','move','turn','debug','test'],
  missions:[
    {id:'task1',label:'Task 1',title:'Collect A, then B',paper:'Questions 01.1–01.5',stops:[['START',-120,-80],['A',-120,20],['B',40,20]],starter:'import turtle as t\n\nt.penup()\nt.goto(-120, -80)\nt.pendown()\n\nt.goto(-120, -20)\n\nt.done()'},
    {id:'task2',label:'Task 2',title:'Find the safe exit',paper:'Questions 02.1–02.5',stops:[['B',40,20],['1',120,20],['2',120,100],['EXIT',40,100]],starter:'import turtle as t\n\nt.penup()\nt.goto(40, 20)\nt.pendown()\n\nt.forward(80)\nt.right(90)\nt.forward(80)\n\nt.done()'},
    {id:'rectangle',label:'Rectangle',title:'Rectangle builder',paper:'Extra challenge 1',extra:true,starter:'import turtle as t\nt.penup()\nt.goto(-140, -60)\nt.pendown()\nt.forward(60)\nt.right(90)\nt.forward(60)\nt.right(90)\nt.forward(60)\nt.right(90)\nt.forward(60)\nt.right(90)\nt.done()'},
    {id:'triangle',label:'Triangle',title:'Triangle explorer',paper:'Extra challenge 2',extra:true,starter:'import turtle as t\nt.penup()\nt.goto(-120, 0)\nt.pendown()\nt.forward(60)\nt.left(120)\nt.forward(60)\nt.left(120)\nt.forward(60)\nt.left(120)\nt.done()'},
    {id:'design',label:'My drawing',title:'My own drawing',paper:'Extra challenge 3',extra:true,starter:'import turtle as t\nt.penup()\nt.goto(-100, -40)\nt.pendown()\nt.goto(-100, 40)\nt.goto(-20, 40)\nt.done()'}
  ]};
