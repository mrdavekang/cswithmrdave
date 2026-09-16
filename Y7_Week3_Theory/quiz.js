window.TurtleQuiz = [
  {
    "id": "g1",
    "stem": {
      "en": "Which line correctly moves the Turtle to (60, 20)?",
      "zh": "哪一行能正确地将海龟移到 (60, 20)？",
      "ko": "(60, 20)으로 이동하는 올바른 명령은?"
    },
    "options": [
      {
        "en": "t.goto(60 20)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "t.goto(60, 20)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "t.goto(60, 20",
        "zh": "",
        "ko": ""
      },
      {
        "en": "t.goto 60, 20",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 1,
    "why": {
      "en": "Use brackets around the values and a comma between x and y.",
      "zh": "用括号括起数值，并在 x 和 y 之间加逗号。",
      "ko": "값을 괄호로 묶고 x와 y 사이에 쉼표를 넣으세요."
    },
    "code": ""
  },
  {
    "id": "g2",
    "stem": {
      "en": "Which position does t.goto(-30, 50) specify?",
      "zh": "t.goto(-30, 50) 指定哪个位置？",
      "ko": "t.goto(-30, 50)은 어떤 위치를 뜻하나요?"
    },
    "options": [
      {
        "en": "(50, -30)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(30, 50)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(-30, 50)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(-30, -50)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 2,
    "why": {
      "en": "The first value is x. The second is y. Keep the negative sign.",
      "zh": "第一个数是 x，第二个数是 y。注意负号。",
      "ko": "첫 값은 x, 두 번째 값은 y입니다. 음수 부호를 확인하세요."
    },
    "code": ""
  },
  {
    "id": "g3",
    "stem": {
      "en": "What does 40 mean in t.forward(40)?",
      "zh": "t.forward(40) 中的 40 是什么意思？",
      "ko": "t.forward(40)의 40은 무엇을 뜻하나요?"
    },
    "options": [
      {
        "en": "The pen colour",
        "zh": "画笔颜色",
        "ko": "펜 색"
      },
      {
        "en": "Degrees to turn",
        "zh": "转动角度",
        "ko": "회전 각도"
      },
      {
        "en": "An x-coordinate to reach",
        "zh": "目标 x 坐标",
        "ko": "목표 x 좌표"
      },
      {
        "en": "The distance to move forwards",
        "zh": "向前移动的距离",
        "ko": "앞으로 이동할 거리"
      }
    ],
    "correct": 3,
    "why": {
      "en": "forward() accepts a distance, not a turning angle or absolute position.",
      "zh": "forward() 接受距离，不是转动角度或绝对位置。",
      "ko": "forward()의 값은 거리이며 회전 각도나 절대 위치가 아닙니다."
    },
    "code": ""
  },
  {
    "id": "g4",
    "stem": {
      "en": "What does t.penup() allow the Turtle to do?",
      "zh": "t.penup() 让海龟做什么？",
      "ko": "t.penup()을 실행하면 어떻게 되나요?"
    },
    "options": [
      {
        "en": "Move without drawing a line",
        "zh": "移动时不画线",
        "ko": "선을 그리지 않고 이동한다"
      },
      {
        "en": "Stop moving completely",
        "zh": "完全停止移动",
        "ko": "이동을 완전히 멈춘다"
      },
      {
        "en": "Delete every existing line",
        "zh": "删除已有线条",
        "ko": "기존 선을 모두 지운다"
      },
      {
        "en": "Return to (0, 0)",
        "zh": "返回 (0, 0)",
        "ko": "(0, 0)으로 돌아간다"
      }
    ],
    "correct": 0,
    "why": {
      "en": "Pen up stops drawing, not movement.",
      "zh": "抬笔停止画线，不停止移动。",
      "ko": "펜을 올려도 이동할 수 있습니다. 선만 그려지지 않습니다."
    },
    "code": ""
  },
  {
    "id": "g5",
    "stem": {
      "en": "What is the purpose of this line?",
      "zh": "这一行有什么作用？",
      "ko": "이 줄의 목적은 무엇인가요?"
    },
    "options": [
      {
        "en": "Display these words on the drawing",
        "zh": "在图上显示这句话",
        "ko": "그림에 이 문장을 표시한다"
      },
      {
        "en": "Leave a note for someone reading the code",
        "zh": "给阅读代码的人留下注释",
        "ko": "코드를 읽는 사람에게 설명을 남긴다"
      },
      {
        "en": "Automatically move to the classroom",
        "zh": "自动移到教室",
        "ko": "교실로 자동 이동한다"
      },
      {
        "en": "Repeat the next instruction",
        "zh": "重复下一条指令",
        "ko": "다음 명령을 반복한다"
      }
    ],
    "correct": 1,
    "why": {
      "en": "A Python comment explains code to people. It is not executed as a Turtle command.",
      "zh": "Python 注释解释代码，不作为海龟指令执行。",
      "ko": "Python 주석은 사람에게 코드를 설명하며 Turtle 명령으로 실행되지 않습니다."
    },
    "code": "# Draw the route to the classroom"
  },
  {
    "id": "g6",
    "stem": {
      "en": "The Turtle is at (20, 10), facing up. It runs t.right(90). Which statement is correct?",
      "zh": "海龟位于 (20, 10)，朝上。执行 t.right(90) 后，哪项正确？",
      "ko": "거북이가 (20, 10)에서 위를 보고 있습니다. t.right(90) 후 올바른 상태는?"
    },
    "options": [
      {
        "en": "At (110, 10), facing up",
        "zh": "位于 (110, 10)，朝上",
        "ko": "(110, 10), 위"
      },
      {
        "en": "At (20, -80), facing right",
        "zh": "位于 (20, -80)，朝右",
        "ko": "(20, -80), 오른쪽"
      },
      {
        "en": "At (20, 10), facing right",
        "zh": "位于 (20, 10)，朝右",
        "ko": "(20, 10), 오른쪽"
      },
      {
        "en": "At (20, 10), facing left",
        "zh": "位于 (20, 10)，朝左",
        "ko": "(20, 10), 왼쪽"
      }
    ],
    "correct": 2,
    "why": {
      "en": "The Turtle turns on the spot. Turning changes its heading, not its position.",
      "zh": "海龟原地转动。转动改变朝向，不改变位置。",
      "ko": "제자리에서 회전합니다. 위치는 바뀌지 않고 방향만 바뀝니다."
    },
    "code": ""
  },
  {
    "id": "g7",
    "stem": {
      "en": "The Turtle faces right. It runs t.left(90). Which way does it face now?",
      "zh": "海龟朝右，执行 t.left(90) 后朝向哪里？",
      "ko": "오른쪽을 보다가 t.left(90)을 실행하면 어느 방향을 보나요?"
    },
    "options": [
      {
        "en": "Right",
        "zh": "右",
        "ko": "오른쪽"
      },
      {
        "en": "Down",
        "zh": "下",
        "ko": "아래"
      },
      {
        "en": "Left",
        "zh": "左",
        "ko": "왼쪽"
      },
      {
        "en": "Up",
        "zh": "上",
        "ko": "위"
      }
    ],
    "correct": 3,
    "why": {
      "en": "A 90-degree left turn from right is a quarter-turn anticlockwise towards up.",
      "zh": "从朝右向左转 90 度，是逆时针转四分之一圈，最终朝上。",
      "ko": "오른쪽에서 왼쪽으로 90도 돌면 위를 봅니다."
    },
    "code": ""
  },
  {
    "id": "g8",
    "stem": {
      "en": "Start at (10, 20), facing right. After t.forward(30), where does the Turtle finish?",
      "zh": "从 (10, 20) 朝右开始。执行 t.forward(30) 后在哪里？",
      "ko": "(10, 20)에서 오른쪽을 봅니다. t.forward(30) 후 위치는?"
    },
    "options": [
      {
        "en": "(40, 20)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(30, 20)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(10, 50)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(40, 50)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 0,
    "why": {
      "en": "Add 30 to x: 10 + 30 = 40. The y-coordinate stays 20.",
      "zh": "x 加 30：10 + 30 = 40。y 保持为 20。",
      "ko": "x에 30을 더하면 40입니다. y는 20 그대로입니다."
    },
    "code": ""
  },
  {
    "id": "g9",
    "stem": {
      "en": "The Turtle is already at (-20, 30). It runs t.goto(-20, 30) again. Where does it finish?",
      "zh": "海龟已位于 (-20, 30)。再次执行 t.goto(-20, 30) 后在哪里？",
      "ko": "이미 (-20, 30)에 있습니다. t.goto(-20, 30)을 다시 실행하면 위치는?"
    },
    "options": [
      {
        "en": "(0, 0)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(-40, 60)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(20, 30)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(-20, 30)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 3,
    "why": {
      "en": "goto() names a destination. The Turtle is already at that destination, so it does not move.",
      "zh": "goto() 指定目标位置，海龟已经在那里，因此不移动。",
      "ko": "goto()는 목적지를 지정합니다. 이미 그 위치에 있으므로 움직이지 않습니다."
    },
    "code": ""
  },
  {
    "id": "g10",
    "stem": {
      "en": "Which comment best explains this code?",
      "zh": "哪条注释最准确地解释这段代码？",
      "ko": "이 코드를 가장 잘 설명하는 주석은?"
    },
    "options": [
      {
        "en": "# Start the program",
        "zh": "",
        "ko": ""
      },
      {
        "en": "# Move without drawing, then lower the pen",
        "zh": "",
        "ko": ""
      },
      {
        "en": "# Turn the Turtle to face left",
        "zh": "",
        "ko": ""
      },
      {
        "en": "# Draw a line to (-60, 0)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 1,
    "why": {
      "en": "The pen is raised for the move, then lowered ready for the next drawing instruction.",
      "zh": "移动前抬笔，之后落笔，准备执行下一条画线指令。",
      "ko": "이동할 때는 펜을 올리고, 다음 그림을 위해 다시 내립니다."
    },
    "code": "t.penup()\nt.goto(-60, 0)\nt.pendown()"
  },
  {
    "id": "g11",
    "stem": {
      "en": "Start at (0, 0), facing right, pen down. Where does this program finish?",
      "zh": "从 (0, 0) 朝右开始，画笔落下。程序最终在哪里？",
      "ko": "(0, 0)에서 오른쪽을 보고 펜을 내립니다. 마지막 위치는?"
    },
    "options": [
      {
        "en": "(60, 20)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(0, -80)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(60, -20)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(20, -60)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 2,
    "why": {
      "en": "Move right 60, turn down, then move down 20. The endpoint is (60, -20).",
      "zh": "向右 60，转向下，再向下 20，终点为 (60, -20)。",
      "ko": "오른쪽으로 60 이동하고 아래를 향해 돌아 20 이동합니다. 끝점은 (60, -20)입니다."
    },
    "code": "t.forward(60)\nt.right(90)\nt.forward(20)"
  },
  {
    "id": "g12",
    "stem": {
      "en": "Start at (0, 0), facing right, pen down. Where does this program finish?",
      "zh": "从 (0, 0) 朝右开始，画笔落下。程序最终在哪里？",
      "ko": "(0, 0)에서 오른쪽을 보고 펜을 내립니다. 마지막 위치는?"
    },
    "options": [
      {
        "en": "(20, 40)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(0, 60)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(20, 0)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "(40, 20)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 0,
    "why": {
      "en": "goto() changes position without changing heading. The Turtle still faces right, so forward(20) adds 20 to x.",
      "zh": "goto() 改变位置而不改变朝向。海龟仍朝右，所以 forward(20) 让 x 增加 20。",
      "ko": "goto()는 방향을 바꾸지 않습니다. 여전히 오른쪽을 보므로 forward(20)은 x를 20 증가시킵니다."
    },
    "code": "t.goto(0, 40)\nt.forward(20)"
  },
  {
    "id": "g13",
    "stem": {
      "en": "Start at (0, 0) on a blank drawing. Which line does this code draw?",
      "zh": "从空白图上的 (0, 0) 开始。这段代码画哪条线？",
      "ko": "빈 화면의 (0, 0)에서 시작합니다. 이 코드는 어떤 선을 그리나요?"
    },
    "options": [
      {
        "en": "Only (0, 0) to (40, 0)",
        "zh": "只有 (0, 0) 到 (40, 0)",
        "ko": "(0, 0)에서 (40, 0)까지만"
      },
      {
        "en": "Only (40, 0) to (40, 30)",
        "zh": "只有 (40, 0) 到 (40, 30)",
        "ko": "(40, 0)에서 (40, 30)까지만"
      },
      {
        "en": "No line at all",
        "zh": "完全不画线",
        "ko": "아무 선도 그리지 않음"
      },
      {
        "en": "A diagonal from (0, 0) to (40, 30)",
        "zh": "从 (0, 0) 到 (40, 30) 的斜线",
        "ko": "(0, 0)에서 (40, 30)까지의 대각선"
      }
    ],
    "correct": 1,
    "why": {
      "en": "The first move is pen up. Only the move after pendown() leaves a line.",
      "zh": "第一次移动时画笔抬起。只有 pendown() 之后的移动会留下线。",
      "ko": "첫 이동은 펜을 올린 상태입니다. pendown() 이후 이동만 선을 남깁니다."
    },
    "code": "t.penup()\nt.goto(40, 0)\nt.pendown()\nt.goto(40, 30)"
  },
  {
    "id": "g14",
    "stem": {
      "en": "Both start at (0, 0), facing right, pen down. Which statement is correct?",
      "zh": "两段程序都从 (0, 0) 朝右开始，画笔落下。哪项正确？",
      "ko": "두 프로그램 모두 (0, 0)에서 오른쪽을 보고 펜을 내립니다. 맞는 설명은?"
    },
    "options": [
      {
        "en": "Same final position, same final direction",
        "zh": "最终位置相同，朝向相同",
        "ko": "끝 위치와 방향이 같다"
      },
      {
        "en": "Same final position, different final directions",
        "zh": "最终位置相同，朝向不同",
        "ko": "끝 위치는 같고 방향은 다르다"
      },
      {
        "en": "Different final positions, same final direction",
        "zh": "最终位置不同，朝向相同",
        "ko": "끝 위치는 다르고 방향은 같다"
      },
      {
        "en": "Neither program draws a line",
        "zh": "两段程序都不画线",
        "ko": "둘 다 선을 그리지 않는다"
      }
    ],
    "correct": 2,
    "why": {
      "en": "A ends at (40, 0), and B at (0, -40). Both finish facing down. The order changes the route.",
      "zh": "A 终点为 (40, 0)，B 终点为 (0, -40)，两者最后都朝下。顺序改变路线。",
      "ko": "A는 (40, 0), B는 (0, -40)에서 끝납니다. 둘 다 아래를 봅니다. 순서가 경로를 바꿉니다."
    },
    "code": "# Program A\nt.forward(40)\nt.right(90)\n\n# Program B\nt.right(90)\nt.forward(40)"
  },
  {
    "id": "g15",
    "stem": {
      "en": "Start at (0, 0), facing right, pen down. The target is (0, 30). Which single change makes this code reach it?",
      "zh": "从 (0, 0) 朝右开始，画笔落下，目标为 (0, 30)。只改哪一处能到达目标？",
      "ko": "(0, 0)에서 오른쪽을 보고 펜을 내립니다. 목표는 (0, 30)입니다. 한 곳만 어떻게 바꾸면 될까요?"
    },
    "options": [
      {
        "en": "Replace t.right(90) with t.left(90)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "Replace t.forward(30) with t.forward(60)",
        "zh": "",
        "ko": ""
      },
      {
        "en": "Add t.penup() before both instructions",
        "zh": "",
        "ko": ""
      },
      {
        "en": "Replace t.right(90) with t.right(0)",
        "zh": "",
        "ko": ""
      }
    ],
    "correct": 0,
    "why": {
      "en": "The route must go up. Turning left 90 degrees from right faces up, then forward(30) reaches (0, 30).",
      "zh": "路线需要朝上。从右向左转 90 度后朝上，前进 30 到达 (0, 30)。",
      "ko": "위로 가야 합니다. 오른쪽에서 왼쪽으로 90도 돌고 30 이동하면 (0, 30)에 도착합니다."
    },
    "code": "t.right(90)\nt.forward(30)"
  }
];
