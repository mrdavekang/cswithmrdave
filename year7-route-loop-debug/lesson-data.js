window.LESSON = {
  id: 'y7-route-loop-debug-2026',
  title: 'Improve and test your Turtle route',
  assignment: 'Year 7 Project checkpoint',
  wagba: 'Use a loop for instructions that truly repeat, test a Turtle route in sections, and explain how two bugs were fixed.',
  knowledge: 'A for loop repeats indented commands. A bug can stop a program or make its drawing differ from the plan.',
  skills: 'Find repetition; predict and run code; test sections; change one command; record before and after evidence.',
  understanding: 'A shorter program helps only when it still draws the intended route. Testing smaller sections makes mistakes easier to locate.',
  keywords: ['loop', 'repetition', 'for', 'range', 'indentation', 'predict', 'test', 'bug', 'debug', 'output', 'version'],
  stages: [
    {id:'starter', title:'Starter · Spot the repeat', time:'5 min', group:'Starter'},
    {id:'types', title:'Types of learning', time:'2 min', group:'Starter'},
    {id:'read-loop', title:'Read · What does a loop do?', time:'4 min', group:'Main task 1'},
    {id:'loop-practice', title:'Try · Replace the repeat', time:'8 min', group:'Main task 1'},
    {id:'own-route', title:'Your route · Save version 2', time:'7 min', group:'Main task 1'},
    {id:'sections', title:'Test your route in sections', time:'6 min', group:'Main task 2'},
    {id:'bug1', title:'Bug 1 · Wrong turn', time:'5 min', group:'Main task 2'},
    {id:'bug2', title:'Bug 2 · Wrong distance', time:'5 min', group:'Main task 2'},
    {id:'feedback', title:'Partner feedback · Improve', time:'6 min', group:'Main task 2'},
    {id:'extension', title:'Extension · Choose one', time:'Optional', group:'Extension'},
    {id:'pitstop', title:'Learning pitstop', time:'3 min', group:'Reflection'},
    {id:'plenary', title:'Plenary · Show and explain', time:'5 min', group:'Plenary'},
    {id:'export', title:'Review and export', time:'4 min', group:'Submit'}
  ],
  repeatedCode: `import turtle as t
t.penup()
t.goto(-80, 80)
t.pendown()

# These two instructions appear four times.
t.forward(80)
t.right(90)
t.forward(80)
t.right(90)
t.forward(80)
t.right(90)
t.forward(80)
t.right(90)

t.done()`,
  routeCode: `import turtle as t
t.pensize(4)
t.penup()
t.goto(0, -200)  # Main Entrance
t.pendown()

# This is a short example route to Reception.
t.goto(0, -100)  # along the corridor
t.goto(-200, -100)  # Reception

t.done()`,
  bug1Code: `import turtle as t
t.pensize(4)
t.penup()
t.goto(0, -200)  # Main Entrance
t.pendown()
t.setheading(90)  # face up
t.forward(100)
t.right(90)  # BUG: should face Reception
t.forward(200)
t.done()`,
  bug2Code: `import turtle as t
t.pensize(4)
t.penup()
t.goto(0, -200)  # Main Entrance
t.pendown()
t.goto(0, -100)  # corridor corner
t.goto(-150, -100)  # BUG: stops too soon
t.done()`,
  extensionCode: `import turtle as t
t.penup()
t.goto(-100, 80)
t.pendown()

# Try a repeated pattern here.
for i in range(3):
    t.forward(60)
    t.right(90)

t.done()`
};
