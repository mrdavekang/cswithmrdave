window.ConsolidationLesson=(()=>{
 const lesson={
  "id": "y7-t1-w7-consolidation-v1",
  "version": 2,
  "title": "Plan, draw and improve a Turtle graphics collection",
  "topic": "Sequence, decomposition, flowcharts, loops, debugging and sources",
  "wagba": "Plan a drawing, use loops to create different shapes, debug one change at a time and credit a source.",
  "k": "Know how sequence, flowchart symbols, loops and source credits help a program.",
  "s": "Plan, predict, run, compare a target, modify and retest a Turtle drawing.",
  "u": "Explain how a repeated group makes a design, and why a correction improves it.",
  "definition": "Learning means getting better at what you know, can do and can explain through practice, feedback and useful challenge.",
  "keywords": {
    "Sequence": [
      "The order of instructions.",
      "指令的顺序。"
    ],
    "Decomposition": [
      "Split a larger task into smaller parts.",
      "把大任务拆成小任务。"
    ],
    "Flowchart": [
      "A diagram of an algorithm, using symbols and arrows.",
      "用图形和箭头表示算法。"
    ],
    "Loop": [
      "Repeats a group of instructions.",
      "重复一组指令。"
    ],
    "Indentation": [
      "Spaces that show which commands belong inside the loop.",
      "用空格表示循环内的命令。"
    ],
    "Debugging": [
      "Find a problem, make a controlled change and retest.",
      "找问题，一次改一处，再测试。"
    ],
    "Source": [
      "Where an example, image or code came from.",
      "示例、图片或代码的来源。"
    ],
    "Attribution": [
      "Say whose work you used.",
      "说明用了谁的作品。"
    ]
  },
  "cards": [
    {
      "id": "welcome",
      "kind": "welcome",
      "title": "Your Turtle graphics collection",
      "goal": "Find out what you will practise and how to use this lesson.",
      "read": "The school computing club needs small graphics for a digital noticeboard. You will plan a triangle badge, then use Python Turtle to make a triangle, a hexagon tile and a zigzag divider. You are practising and testing the drawings, not building a whole website. Each coding practice shows a target picture: this is what the finished drawing should look like.",
      "zh": "学校计算机社团需要电子公告板的小图案。你将规划三角形徽章，然后用 Python Turtle 画三角形、六边形和锯齿分隔线。这是练习和测试图形，不是制作整个网站。每个编程练习都有目标图。",
      "visual": "gallery",
      "section": "read-start",
      "stage": "Read first · Before Do Now"
    },
    {
      "id": "starter",
      "kind": "questions",
      "title": "Do Now · follow three instructions",
      "goal": "Read the code, then choose the drawing it would make.",
      "read": "Turtle is a drawing cursor. It starts at (0, 0), facing right. forward moves in its current direction and draws a line. right(90) turns clockwise by a quarter turn. Read the three lines from top to bottom. The orange dot marks the start in each picture.",
      "zh": "海龟是画图光标，从 (0, 0) 面向右开始。forward 向当前方向移动并画线。right(90) 顺时针转四分之一圈。先从上到下读三行代码。橙色点表示起点。",
      "code": "t.forward(60)\nt.right(90)\nt.forward(30)",
      "visual": "routes",
      "questions": [
        {
          "id": "route",
          "label": "Which picture matches the code?",
          "options": [
            "A · right 60, then down 30",
            "B · right 60, then up 30",
            "C · down 60, then right 30"
          ],
          "answer": 0,
          "why": "forward(60) first draws right. right(90) makes Turtle face down. The final line draws 30 down.",
          "zh": "哪张图与代码相同？"
        }
      ],
      "section": "do-now",
      "stage": "Do Now · Starter"
    },
    {
      "id": "types",
      "kind": "ratings",
      "title": "Types of Learning · your starting point",
      "goal": "Think about what you remember, can do and can explain.",
      "read": "Learning means getting better at what you know, can do and can explain through practice, feedback and useful challenge. Choose honestly for each learning statement. “With an example” is a useful starting point, not a wrong answer.",
      "zh": "学习是通过练习、反馈和适当挑战，提高知识、技能和理解。请诚实选择。“需要例子”是有用的起点，不是错误答案。",
      "section": "types",
      "stage": "Types of Learning · Your starting point"
    },
    {
      "id": "plan-read",
      "kind": "read",
      "title": "Read first · plan the collection",
      "goal": "Understand decomposition and sequence before Main task 1.",
      "read": "A graphics collection is a large task. Decomposition means splitting it into smaller jobs: make the triangle badge, make the hexagon tile and make the zigzag divider. You can test each drawing separately. For the triangle badge, today you plan only the outline. It needs three equal sides of 100 Turtle units. Sequence means the order: move, then turn, before drawing the next side.",
      "zh": "图形集是大任务。分解就是拆成小任务：三角徽章、六边形、锯齿线。每个图形可以分别测试。主任务一先规划三角形轮廓，三条边都是 100 单位。顺序是先前进，再转弯，再画下一条边。",
      "visual": "parts",
      "target": "triangle",
      "targetNotes": "Triangle outline: 3 equal sides, 100 units each. Start at (0, 0), facing right. Turn right 120° after each side.",
      "section": "read-plan",
      "stage": "Read first · Before Main task 1"
    },
    {
      "id": "flow-read",
      "kind": "read",
      "title": "Read first · the four flowchart symbols",
      "goal": "Know the symbols you will use for your triangle plan.",
      "read": "A flowchart is a picture of an algorithm. An oval shows START or END. A rectangle shows an action, such as moving or adding one to a count. A diamond asks a question with Yes and No paths. Arrows show which step to follow next. Our plan counts the drawn sides so it knows when three are finished.",
      "zh": "流程图用图形表示算法。椭圆表示开始或结束；长方形表示动作；菱形表示有 Yes / No 分支的问题；箭头表示下一步。本任务数已画的边，三条边完成后结束。",
      "visual": "symbols",
      "section": "read-plan",
      "stage": "Read first · Before Main task 1"
    },
    {
      "id": "gallery-parts",
      "kind": "multi",
      "title": "Main task 1 · split the collection into jobs",
      "goal": "Choose the three smaller drawing jobs that belong to this collection.",
      "read": "Look at the collection you are helping to make. Select its three drawing jobs. Ignore jobs that would change the classroom or create an entire website. Then tap Check my choices to compare your thinking.",
      "zh": "选择图形集的三个小任务。不需要改变教室，也不需要制作整个网站。然后检查答案。",
      "visual": "gallery",
      "options": [
        "Make the triangle badge",
        "Make the hexagon tile",
        "Make the zigzag divider",
        "Move all classroom furniture",
        "Build a complete school website"
      ],
      "answers": [
        0,
        1,
        2
      ],
      "why": "Triangle badge, hexagon tile and zigzag divider are separate parts of this collection. Furniture and a complete website are outside today’s task.",
      "section": "main1",
      "stage": "Main task 1 · Plan the drawing"
    },
    {
      "id": "triangle-order",
      "kind": "parsons",
      "title": "Main task 1 · order the triangle algorithm",
      "goal": "Use Up and Down to order the five strips, then check your attempt.",
      "read": "Plan the triangle outline shown in the target. The Repeat strip keeps two actions together: move forward 100, then turn right 120 degrees. A move draws a straight side. A turn changes where Turtle faces; it does not draw another side. Start with the setup and finish at the starting point.",
      "zh": "用上移、下移排列三角形算法。Repeat 里面的两步要保持一起：前进 100，再右转 120 度。前进画边，转弯只改变方向。",
      "target": "triangle",
      "targetNotes": "Plan this outline. The turn is 120°; you do not need to work out the angle.",
      "strips": [
        "START",
        "Put Turtle at (0, 0), facing right.",
        "Repeat three times:\n    Move forward 100 units.\n    Turn right 120 degrees.",
        "Finish at the starting point.",
        "END"
      ],
      "section": "main1",
      "stage": "Main task 1 · Plan the drawing"
    },
    {
      "id": "triangle-flow",
      "kind": "flow",
      "title": "Main task 1 · complete the triangle flowchart",
      "goal": "Choose the move, the turn and where the No path returns.",
      "read": "Begin with zero sides drawn. Draw one side, turn, then add one to the side count. If three sides are finished, end. Otherwise, draw the next side. Choose the missing actions below. This is the same triangle plan, shown with symbols.",
      "zh": "从已画零条边开始。画一条边、转弯、边数加一。三条边完成就结束，否则再画下一条边。",
      "target": "triangle",
      "targetNotes": "The target is a closed triangle with three 100-unit sides.",
      "flow": {
        "distance": 100,
        "angle": 120,
        "count": 3
      },
      "section": "main1",
      "stage": "Main task 1 · Plan the drawing"
    },
    {
      "id": "loop-read",
      "kind": "read",
      "title": "Read first · what repeats in Python?",
      "goal": "Read the loop heading and identify the move–turn group.",
      "read": "A move is a command such as t.forward(100): it draws a straight line. A turn is t.right(120): it changes the direction. This pair means these two commands together. For the triangle, repeat the pair three times. for starts the loop; i is the counter name; in introduces the values; range(3) supplies 0, 1 and 2. The colon and four-space indentation put both commands inside the loop.",
      "zh": "前进命令如 t.forward(100) 会画直线；转弯命令如 t.right(120) 改变方向。这里的“一组”指这两条命令一起。三角形重复三次。for 开始循环，i 是计数变量，range(3) 提供 0、1、2。冒号和四个空格表示循环内的命令。",
      "visual": "anatomy",
      "section": "read-code",
      "stage": "Read first · Before Main task 2"
    },
    {
      "id": "debug-read",
      "kind": "read",
      "title": "Read first · check, change, run again",
      "goal": "Know how to test a drawing and use a starter responsibly.",
      "read": "A target picture tells you what you are trying to achieve. After a run, compare the output with the target. Change one thing, run again and see whether it helped. A missing colon is a syntax error. t.forwad is valid-looking text but the method does not exist: that fails at runtime. Code that runs but draws the wrong shape has a logic error. The starter code here is supplied for use and adaptation in this lesson; acknowledge it when explaining your change.",
      "zh": "运行后将图形与目标图比较，一次改一处，再运行检查。缺少冒号是语法错误；t.forwad 方法不存在，会产生运行错误；能运行但图形不符合目标是逻辑错误。这里的示例可用于本课并修改，解释修改时注明来源。",
      "visual": "debug-summary",
      "section": "read-code",
      "stage": "Read first · Before Main task 2"
    },
    {
      "id": "triangle-build",
      "kind": "editor",
      "title": "Practice 1 · finish a triangle badge",
      "goal": "Change range(2) to range(3), then draw three 100-unit sides.",
      "read": "The starter draws only two sides. First predict and run it. Then find range(2), change 2 to 3 and run again. Keep forward(100) and right(120) inside the loop. Compare with the target: three sides, closed at the starting point.",
      "zh": "示例只画两条边。先预测并运行，再把 range(2) 改为 range(3)，重新运行。前进和转弯都要在循环内。检查三条边是否闭合。",
      "steps": [
        "Choose your prediction, then tap Run to see the starter.",
        "Change only range(2) to range(3). Keep the two commands indented.",
        "Tap Run again. Compare your drawing with the target, then choose your observation."
      ],
      "target": "triangle",
      "targetNotes": "3 sides · 100 units per side · turn right 120° · finish at the start.",
      "camera": {
        "x": 50,
        "y": -43.3,
        "width": 210,
        "height": 157.5
      },
      "initial": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(2):\n    t.forward(100)\n    t.right(120)\n\nt.done()",
      "model": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(3):\n    t.forward(100)\n    t.right(120)\n\nt.done()",
      "questions": [
        {
          "id": "prediction",
          "label": "Before running the starter, how many sides will it draw?",
          "options": [
            "2 sides",
            "3 sides",
            "100 sides"
          ],
          "answer": 0,
          "why": "The starter says range(2), so its forward command runs twice.",
          "zh": "示例会画几条边？"
        },
        {
          "id": "observed",
          "label": "Compare your actual output with the target picture.",
          "options": [
            "My drawing matches the target",
            "Some parts match; I can improve it",
            "My drawing does not match yet"
          ],
          "answer": null,
          "why": "Your observation is saved, not automatically graded. Compare the shape, number of parts and instructions.",
          "zh": "将你的图形与目标图比较。",
          "selfAssess": true
        }
      ],
      "hint": "Find the loop heading for i in range(2):. Replace 2 with 3, not the distance or turn. Both commands need four spaces.",
      "hintZH": "找到 for i in range(2):，只把 2 改为 3，不改距离或角度。",
      "section": "main2",
      "stage": "Main task 2 · Three drawing practices"
    },
    {
      "id": "hexagon-build",
      "kind": "editor",
      "title": "Practice 2 · make a six-sided tile",
      "goal": "Change right(120) to right(60) to make a hexagon.",
      "read": "A hexagon has six sides. This starter already repeats six times, but its turn is wrong for the target. Run the starter and notice the overlapping triangle. Change the turn from 120 to 60 degrees. Keep all six movements at 80 units and run again.",
      "zh": "六边形有六条边。示例已经重复六次，但转弯角度不对。运行会看到重复的三角形。把右转 120 改为右转 60，保持前进 80，重新运行。",
      "steps": [
        "Choose what value controls the turn, then Run the starter.",
        "Replace t.right(120) with t.right(60). Do not change range(6) or forward(80).",
        "Run again. Compare six equal sides with the target and record your observation."
      ],
      "target": "hexagon",
      "targetNotes": "6 sides · 80 units per side · turn right 60° · finish at the start.",
      "camera": {
        "x": 40,
        "y": -69.3,
        "width": 280,
        "height": 210
      },
      "initial": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(6):\n    t.forward(80)\n    t.right(120)\n\nt.done()",
      "model": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(6):\n    t.forward(80)\n    t.right(60)\n\nt.done()",
      "questions": [
        {
          "id": "prediction",
          "label": "Which value will you change to control the turn?",
          "options": [
            "The number inside right(...)",
            "The number inside forward(...)",
            "The number inside range(...)"
          ],
          "answer": 0,
          "why": "right controls a clockwise turn. The distance and repeat count already match this task.",
          "zh": "哪个数字控制转弯？"
        },
        {
          "id": "observed",
          "label": "Compare your actual output with the target picture.",
          "options": [
            "My drawing matches the target",
            "Some parts match; I can improve it",
            "My drawing does not match yet"
          ],
          "answer": null,
          "why": "Your observation is saved, not automatically graded. Compare the shape, number of parts and instructions.",
          "zh": "将你的图形与目标图比较。",
          "selfAssess": true
        }
      ],
      "hint": "Change only t.right(120) to t.right(60). The 60° turn is given to you; you do not need to calculate it.",
      "hintZH": "只把 t.right(120) 改为 t.right(60)。不需要计算这个角度。",
      "section": "main2",
      "stage": "Main task 2 · Three drawing practices"
    },
    {
      "id": "zigzag-build",
      "kind": "editor",
      "title": "Practice 3 · repair a zigzag divider",
      "goal": "Put the final left turn inside the loop to draw four peaks.",
      "read": "The setup makes Turtle start on the left and face diagonally upwards. One repeated group draws up, turns right, draws down, then turns left ready for the next peak. The final left turn in the starter is outside the loop. Add four spaces before that line, matching the three lines above it, then retest.",
      "zh": "准备代码让海龟从左边开始，斜向上。一次循环：向上画、右转、向下画、左转准备下一组。示例的最后左转在循环外。给它加四个空格，与上面三行对齐，再测试。",
      "steps": [
        "Read the target and choose which command is outside the loop. Run the starter.",
        "Add four spaces before the final t.left(90). Keep t.done() at the left edge.",
        "Run again. Look for four equal peaks continuing across the screen."
      ],
      "target": "zigzag",
      "targetNotes": "4 peaks · two 60-unit moves per peak · right 90°, then left 90° · the line stays open.",
      "camera": {
        "x": 0,
        "y": 21,
        "width": 440,
        "height": 330
      },
      "initial": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nt.penup()\nt.goto(-170, 0)\nt.setheading(45)\nt.pendown()\n\nfor i in range(4):\n    t.forward(60)\n    t.right(90)\n    t.forward(60)\nt.left(90)\n\nt.done()",
      "model": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nt.penup()\nt.goto(-170, 0)\nt.setheading(45)\nt.pendown()\n\nfor i in range(4):\n    t.forward(60)\n    t.right(90)\n    t.forward(60)\n    t.left(90)\n\nt.done()",
      "questions": [
        {
          "id": "prediction",
          "label": "Which line needs to move inside the loop?",
          "options": [
            "The final t.left(90)",
            "t.done()",
            "import turtle as t"
          ],
          "answer": 0,
          "why": "The final left turn prepares the next upward line, so it must happen on every repeat.",
          "zh": "哪行需要放进循环？"
        },
        {
          "id": "observed",
          "label": "Compare your actual output with the target picture.",
          "options": [
            "My drawing matches the target",
            "Some parts match; I can improve it",
            "My drawing does not match yet"
          ],
          "answer": null,
          "why": "Your observation is saved, not automatically graded. Compare the shape, number of parts and instructions.",
          "zh": "将你的图形与目标图比较。",
          "selfAssess": true
        }
      ],
      "hint": "Put the cursor before the t in the last t.left(90). Add four spaces. Line it up with both forward commands and right(90).",
      "hintZH": "把光标放在最后 t.left(90) 的 t 前，加四个空格，与循环内其他命令对齐。",
      "section": "main2",
      "stage": "Main task 2 · Three drawing practices"
    },
    {
      "id": "credit",
      "kind": "questions",
      "title": "Main task 2 · name the source and your change",
      "goal": "Choose a responsible source action and explain one change you made.",
      "read": "The three starters came from this lesson resource. You may use and adapt them for this classwork. A simple credit is “Adapted from this lesson’s starter code.” If you use a different image or program, check permission first. Giving credit is important, but credit alone does not give permission.",
      "zh": "三个示例来自本课资料，可用于本课并修改。可以注明：“根据本课示例代码修改。”使用其他图片或程序前，先检查许可。注明来源本身并不等于获得许可。",
      "questions": [
        {
          "id": "source",
          "label": "You find an image online with no reuse information. What should you do?",
          "options": [
            "Check permission or ask the teacher",
            "Use it because it is online",
            "Only add your own name",
            "Assume a credit always gives permission"
          ],
          "answer": 0,
          "why": "Check permission before using it. A source credit does not itself give permission."
        }
      ],
      "text": {
        "id": "change",
        "label": "Explain one change",
        "prompt": "Adapted from this lesson’s starter code. I changed ___ in the ___ drawing. It helped because ___. A short phrase is enough."
      },
      "section": "main2",
      "stage": "Main task 2 · Three drawing practices"
    },
    {
      "id": "pitstop",
      "kind": "pitstop",
      "title": "Learning Pitstop · where are you now?",
      "goal": "Choose your learning phase and one useful next action.",
      "read": "Think about the work you actually did: ordering the triangle plan, reading its flowchart, changing a repeat count or angle, and putting a command inside a loop. Choose your phase of learning. Then choose whether practice, explanation, a new challenge or a teacher demonstration would help.",
      "zh": "想想今天实际做的事：排列算法、读流程图、改次数或角度、把命令放进循环。选择学习阶段，再选择有帮助的下一步。",
      "section": "pit",
      "stage": "Learning Pitstop · Reflect on your progress"
    },
    {
      "id": "extras",
      "kind": "extras",
      "title": "Extension · choose a new design",
      "goal": "Choose a drawing challenge, or go to the plenary when your teacher asks.",
      "read": "These are extra designs, not another square or staircase. Use a target picture, run and compare. You may try one or more, return to this page, or continue to the plenary. Your attempted code and drawings save automatically.",
      "zh": "这些是新的图案，不是再次画方形或台阶。看目标图，运行并比较。可以做一个或多个，也可以按老师要求进入总结。",
      "section": "extension",
      "stage": "Extension · Extra designs"
    },
    {
      "id": "exit",
      "kind": "exit",
      "title": "Plenary · check what you can explain",
      "goal": "Answer five short questions, one at a time.",
      "questions": [
        {
          "id": "decomposition",
          "label": "You need a triangle badge, hexagon tile and zigzag divider. What is useful decomposition?",
          "options": [
            "Plan and test each drawing separately",
            "Randomly change every number at once",
            "Build the whole school website"
          ],
          "answer": 0,
          "why": "Each drawing is a smaller job you can plan and test separately."
        },
        {
          "id": "decision",
          "label": "Which symbol shows a question with Yes and No paths?",
          "options": [
            "Diamond",
            "Rectangle",
            "Oval",
            "A title"
          ],
          "answer": 0,
          "why": "A diamond shows a decision."
        },
        {
          "id": "loop",
          "label": "for i in range(5): repeats t.forward(20). How many movements happen?",
          "options": [
            "5",
            "4",
            "20"
          ],
          "answer": 0,
          "why": "range(5) gives five values, so the indented move repeats five times."
        },
        {
          "id": "logic",
          "label": "A program runs but draws three sides instead of four. What is the problem?",
          "options": [
            "Logic error",
            "Always a syntax error",
            "A correct square",
            "File storage"
          ],
          "answer": 0,
          "why": "The program runs, but the instructions do not achieve the intended result."
        },
        {
          "id": "source",
          "label": "You find an image online with no reuse information. What should you do?",
          "options": [
            "Check permission or ask the teacher",
            "Use it because it is online",
            "Only add your own name",
            "Assume a credit always gives permission"
          ],
          "answer": 0,
          "why": "Check permission before using it. A source credit does not itself give permission."
        }
      ],
      "text": {
        "id": "reflection",
        "label": "One improvement you tested",
        "prompt": "I changed ___ in the ___ drawing. The result was ___."
      },
      "section": "plenary",
      "stage": "Plenary · Five short questions"
    },
    {
      "id": "finish",
      "kind": "finish",
      "title": "Finish · review and save your evidence",
      "goal": "Review your answers and drawings, then finish this lesson.",
      "section": "finish",
      "stage": "Finish · PDF / backup"
    }
  ],
  "extras": [
    {
      "id": "extra-pentagon",
      "kind": "editor",
      "title": "Extension 1 · a five-sided badge",
      "goal": "Change this triangle into a five-sided badge with 70-unit sides.",
      "read": "The target is a pentagon. Change three values: repeat five times, move 70 units, turn right 72 degrees. Keep both commands inside the loop. Run after a change and compare with the target.",
      "zh": "目标是五边形。改三处：重复五次、前进 70、右转 72 度。保持两个命令在循环内，再运行比较。",
      "steps": [
        "Change range(3) to range(5).",
        "Change forward(100) to forward(70), and right(120) to right(72).",
        "Run. Compare five equal sides with the target."
      ],
      "target": "pentagon",
      "targetNotes": "5 sides · 70 units per side · right turn 72°.",
      "camera": {
        "x": 35,
        "y": -48.2,
        "width": 220,
        "height": 165
      },
      "initial": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(3):\n    t.forward(100)\n    t.right(120)\n\nt.done()",
      "model": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(5):\n    t.forward(70)\n    t.right(72)\n\nt.done()",
      "questions": [
        {
          "id": "observed",
          "label": "Compare your actual output with the target picture.",
          "options": [
            "My drawing matches the target",
            "Some parts match; I can improve it",
            "My drawing does not match yet"
          ],
          "answer": null,
          "why": "Your observation is saved, not automatically graded. Compare the shape, number of parts and instructions.",
          "zh": "将你的图形与目标图比较。",
          "selfAssess": true
        }
      ],
      "hint": "The target gives the numbers. Use range(5), forward(70) and right(72); keep move and turn indented.",
      "section": "extension",
      "stage": "Extension · Extension 1"
    },
    {
      "id": "extra-star",
      "kind": "editor",
      "title": "Extension 2 · draw a star",
      "goal": "Create five crossing lines with a 144° turn to make a star.",
      "read": "A star uses a larger turn, so the lines cross. Start with five repeats and 140-unit movements. Change the supplied turn from 72 to 144 degrees. Do not try to close it with extra random commands; compare the repeated pattern with the target.",
      "zh": "星形用较大的转弯，线会交叉。重复五次，前进 140。把右转 72 改为 144 度，再比较目标图。",
      "steps": [
        "Keep range(5) and forward(140).",
        "Change only t.right(72) to t.right(144).",
        "Run, then compare the five crossing lines and star points."
      ],
      "target": "star",
      "targetNotes": "5 crossing lines · 140 units per move · right turn 144°.",
      "camera": {
        "x": 70,
        "y": -23,
        "width": 250,
        "height": 187.5
      },
      "initial": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(5):\n    t.forward(140)\n    t.right(72)\n\nt.done()",
      "model": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(5):\n    t.forward(140)\n    t.right(144)\n\nt.done()",
      "questions": [
        {
          "id": "observed",
          "label": "Compare your actual output with the target picture.",
          "options": [
            "My drawing matches the target",
            "Some parts match; I can improve it",
            "My drawing does not match yet"
          ],
          "answer": null,
          "why": "Your observation is saved, not automatically graded. Compare the shape, number of parts and instructions.",
          "zh": "将你的图形与目标图比较。",
          "selfAssess": true
        }
      ],
      "hint": "Use t.right(144). A star deliberately has crossing lines; crossing is not always a bug.",
      "section": "extension",
      "stage": "Extension · Extension 2"
    },
    {
      "id": "extra-fan",
      "kind": "editor",
      "title": "Extension 3 · six rays from one centre",
      "goal": "Make a fan with six 100-unit rays, returning to the centre each time.",
      "read": "Unlike a polygon, this design returns to the same centre after each ray. One group is forward 100, backward 100, left 30. The line back retraces the same ray. Change range(3) to range(6), then run. The new command backward moves in the opposite direction while Turtle keeps the same heading.",
      "zh": "这个图案每条射线后回到中心。一组是前进 100、后退 100、左转 30。后退沿原线返回。把三次改为六次，再运行。",
      "steps": [
        "Read the forward–backward–turn group.",
        "Change range(3) to range(6), leaving both distances at 100 and the turn at 30°.",
        "Run and count six rays from the same centre."
      ],
      "target": "fan",
      "targetNotes": "6 rays · 100 units per ray · left 30° between rays.",
      "camera": {
        "x": 7,
        "y": 50,
        "width": 260,
        "height": 195
      },
      "initial": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(3):\n    t.forward(100)\n    t.backward(100)\n    t.left(30)\n\nt.done()",
      "model": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(6):\n    t.forward(100)\n    t.backward(100)\n    t.left(30)\n\nt.done()",
      "questions": [
        {
          "id": "observed",
          "label": "Compare your actual output with the target picture.",
          "options": [
            "My drawing matches the target",
            "Some parts match; I can improve it",
            "My drawing does not match yet"
          ],
          "answer": null,
          "why": "Your observation is saved, not automatically graded. Compare the shape, number of parts and instructions.",
          "zh": "将你的图形与目标图比较。",
          "selfAssess": true
        }
      ],
      "hint": "Use range(6). Keep forward, backward and left inside the loop. Returning on an existing line is intentional.",
      "section": "extension",
      "stage": "Extension · Extension 3"
    }
  ],
  "quiz": [
    {
      "id": "sequence",
      "label": "What does sequence mean?",
      "options": [
        "The order of instructions",
        "A picture file",
        "The speed of a computer",
        "The colour of a line"
      ],
      "answer": 0,
      "why": "Sequence is the order in which instructions happen."
    },
    {
      "id": "order",
      "label": "Turtle faces right. It moves 40, turns right 90°, then moves 20. Where does it go?",
      "options": [
        "Right, then down",
        "Up, then right",
        "Left, then up",
        "Only right"
      ],
      "answer": 0,
      "why": "The right turn changes its direction from right to down."
    },
    {
      "id": "decompose",
      "label": "Which is useful decomposition for a graphics collection?",
      "options": [
        "Triangle badge, hexagon tile and zigzag divider",
        "Buy a laptop, open games, change the desk",
        "Only think about the finished collection",
        "Change the whole school"
      ],
      "answer": 0,
      "why": "Each drawing is a smaller job that can be planned and tested separately."
    },
    {
      "id": "start",
      "label": "Which flowchart symbol usually shows Start or End?",
      "options": [
        "Oval",
        "Rectangle",
        "Diamond",
        "Arrow"
      ],
      "answer": 0,
      "why": "An oval is used for Start and End."
    },
    {
      "id": "action",
      "label": "Which symbol shows an action such as Move forward?",
      "options": [
        "Rectangle",
        "Diamond",
        "Oval",
        "A photograph"
      ],
      "answer": 0,
      "why": "A rectangle shows a process or action."
    },
    {
      "id": "decision",
      "label": "Which symbol shows a question with Yes and No paths?",
      "options": [
        "Diamond",
        "Rectangle",
        "Oval",
        "A title"
      ],
      "answer": 0,
      "why": "A diamond shows a decision."
    },
    {
      "id": "arrows",
      "label": "What do flowchart arrows show?",
      "options": [
        "Which step to follow next",
        "How fast Python runs",
        "Only the starting point",
        "The file size"
      ],
      "answer": 0,
      "why": "Arrows connect steps and show the direction to follow."
    },
    {
      "id": "range",
      "label": "How many repeats does range(4) give in this loop?",
      "options": [
        "4",
        "3",
        "5",
        "Forever"
      ],
      "answer": 0,
      "why": "range(4) provides four values: 0, 1, 2 and 3."
    },
    {
      "id": "counter",
      "label": "What is i in for i in range(4)?",
      "options": [
        "A counter variable",
        "The number of degrees",
        "The Turtle colour",
        "The End command"
      ],
      "answer": 0,
      "why": "Python gives i the next counter value on each repeat."
    },
    {
      "id": "indent",
      "label": "Why are both forward and right indented for a square?",
      "options": [
        "Both need to repeat",
        "Spaces make drawing faster",
        "Only right will repeat",
        "Indentation is decoration"
      ],
      "answer": 0,
      "why": "Indented commands belong to the loop body."
    },
    {
      "id": "syntax",
      "label": "The colon is missing after for i in range(4). What kind of error is this?",
      "options": [
        "Syntax error",
        "Logic error",
        "A source credit",
        "No error"
      ],
      "answer": 0,
      "why": "Python cannot read that loop heading correctly without its colon."
    },
    {
      "id": "runtime",
      "label": "A program calls t.forwad(60), a method that does not exist. What happens?",
      "options": [
        "A runtime error when that call is reached",
        "A correct square",
        "It repeats forever",
        "Only the colour changes"
      ],
      "answer": 0,
      "why": "The spelling is valid Python syntax, but that Turtle method does not exist."
    },
    {
      "id": "logic",
      "label": "A program runs but draws two triangle sides instead of three. What is the problem?",
      "options": [
        "Logic error",
        "Always a syntax error",
        "A correct triangle",
        "File storage"
      ],
      "answer": 0,
      "why": "The program runs, but the instructions do not achieve the intended result."
    },
    {
      "id": "testing",
      "label": "What is a useful debugging step?",
      "options": [
        "Make one change, run again and compare",
        "Change all numbers randomly",
        "Run once and assume success",
        "Delete the whole project"
      ],
      "answer": 0,
      "why": "A controlled change helps you see what caused the improvement."
    },
    {
      "id": "source",
      "label": "You find an image online with no reuse information. What should you do?",
      "options": [
        "Check permission or ask the teacher",
        "Use it because it is online",
        "Only add your own name",
        "Assume a credit always gives permission"
      ],
      "answer": 0,
      "why": "Check permission before using it. A source credit does not itself give permission."
    }
  ],
  "setup": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\n",
  "sample": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(2):\n    t.forward(100)\n    t.right(120)\n\nt.done()",
  "corrected": "import turtle as t\n\nt.pensize(4)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(3):\n    t.forward(100)\n    t.right(120)\n\nt.done()",
  "sections": [
    {
      "id": "read-start",
      "label": "Read first",
      "detail": "Before Do Now",
      "cards": [
        "welcome"
      ]
    },
    {
      "id": "do-now",
      "label": "Do Now",
      "detail": "Starter",
      "cards": [
        "starter"
      ]
    },
    {
      "id": "types",
      "label": "Types of Learning",
      "detail": "Your starting point",
      "cards": [
        "types"
      ]
    },
    {
      "id": "read-plan",
      "label": "Read first",
      "detail": "Before Main task 1",
      "cards": [
        "plan-read",
        "flow-read"
      ]
    },
    {
      "id": "main1",
      "label": "Main task 1",
      "detail": "Plan the drawing",
      "cards": [
        "gallery-parts",
        "triangle-order",
        "triangle-flow"
      ]
    },
    {
      "id": "read-code",
      "label": "Read first",
      "detail": "Before Main task 2",
      "cards": [
        "loop-read",
        "debug-read"
      ]
    },
    {
      "id": "main2",
      "label": "Main task 2",
      "detail": "Three drawing practices",
      "cards": [
        "triangle-build",
        "hexagon-build",
        "zigzag-build",
        "credit"
      ]
    },
    {
      "id": "pit",
      "label": "Learning Pitstop",
      "detail": "Reflect on your progress",
      "cards": [
        "pitstop"
      ]
    },
    {
      "id": "extension",
      "label": "Extension",
      "detail": "Extra designs",
      "cards": [
        "extras"
      ]
    },
    {
      "id": "plenary",
      "label": "Plenary",
      "detail": "Five short questions",
      "cards": [
        "exit"
      ]
    },
    {
      "id": "finish",
      "label": "Finish",
      "detail": "PDF / backup",
      "cards": [
        "finish"
      ]
    }
  ]
};
 // Additive colour challenges: existing answers, quiz and lesson progress remain compatible.
 lesson.extras.push(...[
  {
    "id": "extra-rainbow",
    "kind": "editor",
    "title": "Extension 4 · make a rainbow arc",
    "goal": "Make seven coloured half-circles, then experiment with your rainbow colours.",
    "read": "This ready-made art example uses circle(radius, angle). The radius sets the size; the angle sets how much of the circle is drawn. A half-circle needs 180 degrees. The colour list is prepared for you. Focus on changing 120 to 180, running, and comparing the arcs. You are not being tested on lists today.",
    "zh": "circle 的第一个数决定大小，第二个数决定画多少角度。半圆是 180 度。颜色列表已准备好，把 120 改为 180，再运行比较。今天不考列表。",
    "steps": [
      "Find t.circle(radius, 120). Change only 120 to 180.",
      "Tap Run. Look for seven nested half-circles, all ending on the same horizontal line.",
      "Make it yours: edit one colour in the prepared list, or try Colour studio. The seven-arc goal stays the same."
    ],
    "target": "rainbow",
    "targetNotes": "7 half-circle arcs · outer radius 110, inner radius 50 · circle angle 180°.",
    "camera": {
      "x": 0,
      "y": 50,
      "width": 300,
      "height": 225
    },
    "initial": "import turtle as t\n\ncolours = [\n    \"#d83d4b\", \"#df6c16\", \"#b9830a\",\n    \"#18805a\", \"#2874d0\", \"#6252c9\",\n    \"#a047bb\",\n]\n\nt.pensize(8)\n\nfor i in range(7):\n    radius = 110 - i * 10\n    t.pencolor(colours[i])\n    t.penup()\n    t.goto(radius, 0)\n    t.setheading(90)\n    t.pendown()\n    t.circle(radius, 120)\n\nt.done()",
    "model": "import turtle as t\n\ncolours = [\n    \"#d83d4b\", \"#df6c16\", \"#b9830a\",\n    \"#18805a\", \"#2874d0\", \"#6252c9\",\n    \"#a047bb\",\n]\n\nt.pensize(8)\n\nfor i in range(7):\n    radius = 110 - i * 10\n    t.pencolor(colours[i])\n    t.penup()\n    t.goto(radius, 0)\n    t.setheading(90)\n    t.pendown()\n    t.circle(radius, 180)\n\nt.done()",
    "questions": [
      {
        "id": "observed",
        "label": "Compare your actual output with the target picture.",
        "options": [
          "My drawing matches the target",
          "Some parts match; I can improve it",
          "My drawing does not match yet"
        ],
        "answer": null,
        "why": "Your observation is saved, not automatically graded. Compare the pattern and number of parts; you may choose different colours.",
        "zh": "比较图案和各部分的数量。颜色可以不同。",
        "selfAssess": true
      }
    ],
    "hint": "Use t.circle(radius, 180). Keep the size calculation and movement instructions unchanged until you see seven half-circles.",
    "section": "extension",
    "stage": "Extension · Extension 4"
  },
  {
    "id": "extra-sparkle",
    "kind": "editor",
    "title": "Extension 5 · draw a rainbow sparkle",
    "goal": "Draw eight coloured rays that all return to one centre.",
    "read": "A sparkle can be made from short rays. One repeat draws outwards, returns along the same ray, then turns 45 degrees. Eight repeats turn through a full 360 degrees. The colour line is prepared for you; concentrate on the repeated movement group. Nothing flashes: the sparkle is your own drawing.",
    "zh": "每次重复先前进画一条射线，再沿原路后退，最后左转 45 度。八次转满 360 度。颜色代码已准备好，重点看循环中的移动。图案不会闪烁。",
    "steps": [
      "Change range(4) to range(8). Keep forward(55), backward(55) and left(45).",
      "Tap Run. Count eight rays from one centre and compare with the target.",
      "Make it yours: use Colour studio, or change both 55 values to 40 for a smaller sparkle. Explain why the forward and backward distances must match."
    ],
    "target": "sparkle",
    "targetNotes": "8 rays around one centre · forward 55, backward 55 · left turn 45°.",
    "camera": {
      "x": 0,
      "y": 0,
      "width": 180,
      "height": 135
    },
    "initial": "import turtle as t\n\ncolours = [\n    \"#d83d4b\", \"#df6c16\", \"#b9830a\",\n    \"#18805a\", \"#2874d0\", \"#6252c9\",\n    \"#a047bb\",\n]\n\nt.pensize(5)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(4):\n    t.pencolor(colours[i % len(colours)])\n    t.forward(55)\n    t.backward(55)\n    t.left(45)\n\nt.done()",
    "model": "import turtle as t\n\ncolours = [\n    \"#d83d4b\", \"#df6c16\", \"#b9830a\",\n    \"#18805a\", \"#2874d0\", \"#6252c9\",\n    \"#a047bb\",\n]\n\nt.pensize(5)\nt.penup()\nt.goto(0, 0)\nt.setheading(0)\nt.pendown()\n\nfor i in range(8):\n    t.pencolor(colours[i % len(colours)])\n    t.forward(55)\n    t.backward(55)\n    t.left(45)\n\nt.done()",
    "questions": [
      {
        "id": "observed",
        "label": "Compare your actual output with the target picture.",
        "options": [
          "My drawing matches the target",
          "Some parts match; I can improve it",
          "My drawing does not match yet"
        ],
        "answer": null,
        "why": "Your observation is saved, not automatically graded. Compare the pattern and number of parts; you may choose different colours.",
        "zh": "比较图案和各部分的数量。颜色可以不同。",
        "selfAssess": true
      }
    ],
    "hint": "Eight groups × 45° = one full turn. Keep forward and backward equal so Turtle returns to the centre after every ray.",
    "section": "extension",
    "stage": "Extension · Extension 5"
  }
]);
 const extraHub=lesson.cards.find(c=>c.id==="extras");
 extraHub.goal="Choose another design: pentagon, star, ray fan, rainbow or sparkle.";
 extraHub.read="Choose a design that interests you. Each has its own goal, target and ready-made starter. Finish one, return here, and try another if you have time. Extra designs do not block the plenary.";
 extraHub.zh="选择你感兴趣的图案。每个都有目标图和示例代码。完成一个后可以返回再选另一个。额外挑战不会阻止你进入总结。";
 lesson.program=body=>lesson.setup+body+"\n\nt.done()";
 return lesson;
})();
