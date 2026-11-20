// Python cover activities for Day 2.
window.COVER_CARDS = {
  "2": [
    {
      "type": "typing",
      "title": "Back at the arcade",
      "prompt": "Type the line that reads a whole-number coin count.",
      "zh": "输入这行代码，读取整数金币数。",
      "hint": "Check the two closing brackets.",
      "hintZh": "注意行末的两个右括号。",
      "code": "coins = int(input(\"Coins: \"))"
    },
    {
      "type": "typing",
      "title": "Power three lights",
      "prompt": "Type the loop header for three repeats.",
      "zh": "输入让动作重复三次的循环头。",
      "hint": "The header starts with for and ends with a colon.",
      "hintZh": "循环头以 for 开始，以冒号结束。",
      "code": "for light in range(3):"
    },
    {
      "type": "typing",
      "title": "Level numbers",
      "prompt": "Type the header that counts levels 1, 2 and 3.",
      "zh": "输入依次产生关卡号 1、2、3 的循环头。",
      "hint": "The stop value comes after the last number you need.",
      "hintZh": "结束值比所需的最后一个编号大一。",
      "code": "for level in range(1, 4):"
    },
    {
      "type": "typing",
      "title": "Level sign",
      "prompt": "Type both lines that show each level.",
      "zh": "输入这两行，为每一关显示编号。",
      "hint": "Indent print by four spaces.",
      "hintZh": "print 之前缩进四个空格。",
      "code": "for level in range(1, 4):\n    print(\"Level\", level)"
    },
    {
      "type": "typing",
      "title": "Ready gate",
      "prompt": "Type the gate from your first arcade pass.",
      "zh": "输入第一天通行证中的闸门判断。",
      "hint": "Use the same coin limit as Day 1.",
      "hintZh": "使用和第一天相同的金币门槛。",
      "code": "if coins >= 5:\n    print(\"Pass unlocked\")"
    },
    {
      "type": "typing",
      "title": "Five-stage upgrade",
      "prompt": "Type the header that reaches level 5.",
      "zh": "输入能计数到第 5 关的循环头。",
      "hint": "The first value is 1; the stop is 6.",
      "hintZh": "起始值是 1，结束值是 6。",
      "code": "for level in range(1, 6):"
    },
    {
      "type": "typing",
      "title": "Name each round",
      "prompt": "Type the line that displays the game and current level.",
      "zh": "输入显示游戏名及当前关卡的代码行。",
      "hint": "The hyphen and Level are text. game and level are variables.",
      "hintZh": "连字符和 Level 是文字，game 和 level 是变量。",
      "code": "print(game, \"- Level\", level)"
    },
    {
      "type": "typing",
      "title": "Inside the gate",
      "prompt": "Type this nested loop. Line two uses four spaces; line three uses eight.",
      "zh": "输入这个嵌套循环。第二行缩进四个空格，第三行缩进八个。",
      "hint": "The loop is inside if. The print is inside the loop.",
      "hintZh": "循环位于 if 内，print 位于循环内。",
      "code": "if coins >= 5:\n    for level in range(1, 4):\n        print(\"Level\", level)"
    },
    {
      "type": "mcq",
      "title": "Flash count",
      "prompt": "How many times will Flash appear?",
      "zh": "Flash 会出现几次？",
      "hint": "Count the values 0, 1 and 2.",
      "hintZh": "数一数 0、1、2 共有几个值。",
      "code": "for lamp in range(3):\n    print(\"Flash\")",
      "options": [
        "2",
        "3",
        "4",
        "1"
      ],
      "correct": 1
    },
    {
      "type": "mcq",
      "title": "First level",
      "prompt": "Which number appears first?",
      "zh": "首先显示哪个数字？",
      "hint": "The first argument is the start.",
      "hintZh": "第一个参数是起始值。",
      "code": "for level in range(1, 4):\n    print(level)",
      "options": [
        "4",
        "0",
        "3",
        "1"
      ],
      "correct": 3
    },
    {
      "type": "mcq",
      "title": "Final level",
      "prompt": "Which number appears last?",
      "zh": "最后显示哪个数字？",
      "hint": "Stop just before the second argument.",
      "hintZh": "到第二个参数之前就停止。",
      "code": "for level in range(2, 5):\n    print(level)",
      "options": [
        "4",
        "5",
        "2",
        "6"
      ],
      "correct": 0
    },
    {
      "type": "mcq",
      "title": "New player, old gate",
      "prompt": "The player types 4. Which output appears?",
      "zh": "玩家输入 4。会显示什么？",
      "hint": "Decide whether to enter the if branch first.",
      "hintZh": "先判断是否会执行 if 分支。",
      "code": "coins = int(input())\nif coins >= 5:\n    for level in range(1, 3):\n        print(level)\nelse:\n    print(\"Wait\")",
      "options": [
        "1 then 2",
        "4",
        "Wait",
        "1 then 2 then Wait"
      ],
      "correct": 2
    },
    {
      "type": "mcq",
      "title": "Once after the race",
      "prompt": "How many times does Finish appear?",
      "zh": "Finish 会显示几次？",
      "hint": "Look at the indentation of the final line.",
      "hintZh": "留意最后一行的缩进。",
      "code": "for lap in range(3):\n    print(\"Go\")\nprint(\"Finish\")",
      "options": [
        "3",
        "1",
        "0",
        "4"
      ],
      "correct": 1
    },
    {
      "type": "mcq",
      "title": "Five playable levels",
      "prompt": "Which range gives precisely 1, 2, 3, 4, 5?",
      "zh": "哪个 range 恰好产生 1、2、3、4、5？",
      "hint": "The last value must be one less than the stop.",
      "hintZh": "最后一个值应比结束值小一。",
      "code": "",
      "options": [
        "range(5)",
        "range(1, 5)",
        "range(2, 6)",
        "range(1, 6)"
      ],
      "correct": 3
    },
    {
      "type": "mcq",
      "title": "Player sets the rounds",
      "prompt": "A player types 3. Which line gives the loop an integer repeat count?",
      "zh": "玩家输入 3。哪一行能给循环提供整数重复次数？",
      "hint": "range needs a whole number.",
      "hintZh": "range 需要整数。",
      "code": "",
      "options": [
        "rounds = int(input())",
        "rounds = input()",
        "rounds = \"3\"",
        "rounds = 3.0"
      ],
      "correct": 0
    },
    {
      "type": "mcq",
      "title": "A different ticket",
      "prompt": "What appears for the second level?",
      "zh": "第二关会显示什么？",
      "hint": "Replace each variable with its current value.",
      "hintZh": "用每个变量当前的值代入。",
      "code": "game = \"Drift\"\nfor n in range(1, 4):\n    print(game, n)",
      "options": [
        "game 2",
        "Drift n",
        "Drift 2",
        "2 Drift"
      ],
      "correct": 2
    },
    {
      "type": "blank",
      "title": "Start a loop",
      "prompt": "Choose the keyword that starts this loop.",
      "zh": "选择开始循环的关键词。",
      "hint": "This instruction repeats once for each value.",
      "hintZh": "这条指令会为每一个值重复执行。",
      "code": "___ lamp in range(3):\n    print(\"Blink\")",
      "options": [
        "if",
        "for",
        "else",
        "int"
      ],
      "correct": 1
    },
    {
      "type": "blank",
      "title": "Join the range",
      "prompt": "Which word belongs between the loop variable and its range?",
      "zh": "循环变量和 range 之间应写哪个单词？",
      "hint": "Read the header as “for level ... range”.",
      "hintZh": "循环头的读法是“for level ... range”。",
      "code": "for level ___ range(1, 4):\n    print(level)",
      "options": [
        "if",
        "as",
        "at",
        "in"
      ],
      "correct": 3
    },
    {
      "type": "blank",
      "title": "Finish at three",
      "prompt": "Choose the stop value for levels 1, 2 and 3.",
      "zh": "选择结束值，使关卡号为 1、2、3。",
      "hint": "The stop itself is left out.",
      "hintZh": "结束值本身不包括在内。",
      "code": "for level in range(1, ___):\n    print(level)",
      "options": [
        "4",
        "2",
        "3",
        "5"
      ],
      "correct": 0
    },
    {
      "type": "blank",
      "title": "Announce each round",
      "prompt": "Fill the gap to show the current round number, not the same number each time.",
      "zh": "填空，让每次都显示当前的回合数。",
      "hint": "Use the variable from the loop header.",
      "hintZh": "使用循环头中的变量。",
      "code": "for round_no in range(1, 4):\n    print(\"Round\", ___)",
      "options": [
        "3",
        "\"round_no\"",
        "round_no",
        "1"
      ],
      "correct": 2
    },
    {
      "type": "blank",
      "title": "A fresh count",
      "prompt": "Read an integer so the player can choose how many times Go appears.",
      "zh": "读取一个整数，由玩家决定 Go 的重复次数。",
      "hint": "Use the same whole-number conversion as the coin reader.",
      "hintZh": "使用读取金币数时的整数转换方法。",
      "code": "rounds = ___(input())\nfor n in range(rounds):\n    print(\"Go\")",
      "options": [
        "str",
        "int",
        "float",
        "print"
      ],
      "correct": 1
    },
    {
      "type": "blank",
      "title": "End on the chosen number",
      "prompt": "The player chooses rounds. Include the last round when numbering from 1.",
      "zh": "玩家选择回合数 rounds。从 1 开始编号，最后一回合也应包括在内。",
      "hint": "The stop must be just past the last round.",
      "hintZh": "结束值应比最后一回合的编号大一。",
      "code": "for n in range(1, ___):\n    print(n)",
      "options": [
        "rounds - 1",
        "1",
        "rounds",
        "rounds + 1"
      ],
      "correct": 3
    },
    {
      "type": "blank",
      "title": "Only unlocked players",
      "prompt": "Choose the check that lets a player with 5 or more coins enter the loop.",
      "zh": "选择让有 5 枚或更多金币的玩家进入循环的条件。",
      "hint": "Try both 4 and 5 in your head.",
      "hintZh": "在心里分别代入 4 和 5。",
      "code": "if ___:\n    for level in range(1, 4):\n        print(level)",
      "options": [
        "coins >= 5",
        "coins > 5",
        "coins <= 5",
        "coins == 4"
      ],
      "correct": 0
    },
    {
      "type": "blank",
      "title": "Personalise a level",
      "prompt": "Choose the name that makes the output start with the game the player typed.",
      "zh": "选择变量，使每行输出以玩家输入的游戏名开头。",
      "hint": "The player’s answer is stored without quotation marks around the variable name.",
      "hintZh": "玩家的回答保存在变量中，使用变量时变量名不加引号。",
      "code": "game = input()\nfor level in range(1, 3):\n    print(___, \"- Level\", level)",
      "options": [
        "\"game\"",
        "level",
        "game",
        "\"level\""
      ],
      "correct": 2
    },
    {
      "type": "parsons",
      "title": "Signal sequence",
      "prompt": "Show Ready, then repeat Go three times.",
      "zh": "先显示 Ready，然后把 Go 显示三次。",
      "hint": "The introduction comes before the loop.",
      "hintZh": "开场提示放在循环前。",
      "lines": [
        "print(\"Ready\")",
        "for lamp in range(3):",
        "    print(\"Go\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Choose your game",
      "prompt": "Ask for the game first. For each level from 1 to 3, display its game and number.",
      "zh": "先问游戏名，再逐一显示第 1 至第 3 关的游戏名和关卡号。",
      "hint": "The output needs both game and level.",
      "hintZh": "输出时需要 game 和 level 两个值。",
      "lines": [
        "game = input(\"Game: \")",
        "for level in range(1, 4):",
        "    print(game, level)"
      ]
    },
    {
      "type": "parsons",
      "title": "A final bell",
      "prompt": "Print Round 1 and Round 2. After both rounds, print Bell once.",
      "zh": "显示 Round 1、Round 2。两轮结束后，只显示一次 Bell。",
      "hint": "The unindented print belongs after the loop.",
      "hintZh": "没有缩进的 print 放在循环之后。",
      "lines": [
        "for n in range(1, 3):",
        "    print(\"Round\", n)",
        "print(\"Bell\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Player sets the limit",
      "prompt": "Read an integer, build a range from 1 through that number, and print each level.",
      "zh": "读取一个整数，从 1 数到此数，逐一显示关卡号。",
      "hint": "count must exist before range can use it.",
      "hintZh": "range 使用 count 前，必须先读入 count。",
      "lines": [
        "count = int(input())",
        "for n in range(1, count + 1):",
        "    print(\"Level\", n)"
      ]
    },
    {
      "type": "parsons",
      "title": "Unlock the loop",
      "prompt": "Read the coins and show levels 1 to 3 only for a player with at least 5.",
      "zh": "读取金币数。只有金币至少为 5 时才显示第 1 至第 3 关。",
      "hint": "Look for the line with two levels of indentation.",
      "hintZh": "留意哪一行需要两层缩进。",
      "lines": [
        "coins = int(input())",
        "if coins >= 5:",
        "    for level in range(1, 4):",
        "        print(\"Level\", level)"
      ]
    },
    {
      "type": "parsons",
      "title": "The other entrance",
      "prompt": "With enough coins, say Open then show two levels. Otherwise say Wait.",
      "zh": "金币足够时先显示 Open，再显示两关；否则显示 Wait。",
      "hint": "else lines up with if.",
      "hintZh": "else 与 if 对齐。",
      "lines": [
        "coins = int(input())",
        "if coins >= 5:",
        "    print(\"Open\")",
        "    for n in range(1, 3):",
        "        print(n)",
        "else:",
        "    print(\"Wait\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Ticket printer",
      "prompt": "Print Start once. For each of two levels, print Level and its number followed by a separate Go line.",
      "zh": "先显示一次 Start。每一关先显示 Level 和编号，再另起一行显示 Go，共两关。",
      "hint": "Both indented print lines repeat in the order requested.",
      "hintZh": "两条缩进的 print 都要按题目指定的顺序重复。",
      "lines": [
        "print(\"Start\")",
        "for n in range(1, 3):",
        "    print(\"Level\", n)",
        "    print(\"Go\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Spend a coin",
      "prompt": "Start with 3 coins. At each of two gates, subtract one coin before printing the remaining count.",
      "zh": "起始有 3 枚金币。经过两个闸门时，每次先扣一枚，再显示余额。",
      "hint": "Subtract first so the screen shows the new balance.",
      "hintZh": "先减去金币，显示的才是新余额。",
      "lines": [
        "coins = 3",
        "for gate in range(2):",
        "    coins = coins - 1",
        "    print(\"Left:\", coins)"
      ]
    },
    {
      "type": "debug",
      "title": "Missing last level",
      "prompt": "Show Level 1, Level 2 and Level 3 on separate lines. The last level is missing.",
      "zh": "分三行显示 Level 1、Level 2、Level 3。修复缺少最后一关的问题。",
      "hint": "Increase the stop by one.",
      "hintZh": "把结束值加一。",
      "starter": "for n in range(1, 3):\n    print(\"Level\", n)",
      "solution": "for n in range(1, 4):\n    print(\"Level\", n)",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "Level 1",
            "Level 2",
            "Level 3"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "A level zero?",
      "prompt": "Show only the numbers 1, 2 and 3 on separate lines. Remove the unwanted zero.",
      "zh": "分三行只显示 1、2、3，去掉多余的 0。",
      "hint": "Check the first argument of range.",
      "hintZh": "检查 range 的第一个参数。",
      "starter": "for n in range(0, 4):\n    print(n)",
      "solution": "for n in range(1, 4):\n    print(n)",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "1",
            "2",
            "3"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "The same level again",
      "prompt": "The code prints Level 1 every time. Show Level 1 then Level 2 then Level 3.",
      "zh": "代码总是显示 Level 1。让它按顺序显示 Level 1、Level 2、Level 3。",
      "hint": "The loop variable changes each turn.",
      "hintZh": "每次循环时，循环变量的值都会改变。",
      "starter": "for level in range(1, 4):\n    print(\"Level\", 1)",
      "solution": "for level in range(1, 4):\n    print(\"Level\", level)",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "Level 1",
            "Level 2",
            "Level 3"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Bell rings too often",
      "prompt": "Print Go twice and then Finish just once. Repair the indentation.",
      "zh": "显示两次 Go，然后只显示一次 Finish。调整缩进。",
      "hint": "Move the line that should run once outside the loop.",
      "hintZh": "应只执行一次的那一行要移出循环。",
      "starter": "for n in range(2):\n    print(\"Go\")\n    print(\"Finish\")",
      "solution": "for n in range(2):\n    print(\"Go\")\nprint(\"Finish\")",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "Go",
            "Go",
            "Finish"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Rounds crash",
      "prompt": "Read a whole number and print Play that many times. The code crashes after the player types a number.",
      "zh": "读取整数，按该次数显示 Play。修复输入数字后发生的错误。",
      "hint": "range needs an integer; input returns text.",
      "hintZh": "range 需要整数，input 返回文字。",
      "starter": "rounds = input()\nfor n in range(rounds):\n    print(\"Play\")",
      "solution": "rounds = int(input())\nfor n in range(rounds):\n    print(\"Play\")",
      "tests": [
        {
          "inputs": [
            "2"
          ],
          "expected": [
            "Play",
            "Play"
          ]
        },
        {
          "inputs": [
            "3"
          ],
          "expected": [
            "Play",
            "Play",
            "Play"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "No free levels",
      "prompt": "For 5 or more coins, print Open then 1 and 2 on separate lines. For fewer coins, print Wait only.",
      "zh": "达到 5 枚金币时分行显示 Open、1、2；不足时只显示 Wait。",
      "hint": "Move the loop into the unlocked branch. Indent its body one level further.",
      "hintZh": "把循环放进解锁分支，再把循环体多缩进一层。",
      "starter": "coins = int(input())\nif coins >= 5:\n    print(\"Open\")\nelse:\n    print(\"Wait\")\nfor n in range(1, 3):\n    print(n)",
      "solution": "coins = int(input())\nif coins >= 5:\n    print(\"Open\")\n    for n in range(1, 3):\n        print(n)\nelse:\n    print(\"Wait\")",
      "tests": [
        {
          "inputs": [
            "4"
          ],
          "expected": [
            "Wait"
          ]
        },
        {
          "inputs": [
            "5"
          ],
          "expected": [
            "Open",
            "1",
            "2"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Missing final round",
      "prompt": "If a player enters 1, show Round 1. If they enter 3, show Round 1 through Round 3.",
      "zh": "输入 1 时显示 Round 1。输入 3 时应依次显示 Round 1 至 Round 3。",
      "hint": "The stop value itself never appears.",
      "hintZh": "结束值本身不会出现。",
      "starter": "rounds = int(input())\nfor n in range(1, rounds):\n    print(\"Round\", n)",
      "solution": "rounds = int(input())\nfor n in range(1, rounds + 1):\n    print(\"Round\", n)",
      "tests": [
        {
          "inputs": [
            "1"
          ],
          "expected": [
            "Round 1"
          ]
        },
        {
          "inputs": [
            "3"
          ],
          "expected": [
            "Round 1",
            "Round 2",
            "Round 3"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Wrong game tag",
      "prompt": "Read a game title, then print its real title and levels 1 and 2, like Maze - Level 1.",
      "zh": "读取游戏名，然后显示实际游戏名和第 1、第 2 关，例如 Maze - Level 1。",
      "hint": "Print the variable, not the text spelling its name.",
      "hintZh": "应显示变量的值，注意变量名两边是否有引号。",
      "starter": "game = input()\nfor level in range(1, 3):\n    print(\"game\", \"- Level\", level)",
      "solution": "game = input()\nfor level in range(1, 3):\n    print(game, \"- Level\", level)",
      "tests": [
        {
          "inputs": [
            "Maze"
          ],
          "expected": [
            "Maze - Level 1",
            "Maze - Level 2"
          ]
        },
        {
          "inputs": [
            "Orbit"
          ],
          "expected": [
            "Orbit - Level 1",
            "Orbit - Level 2"
          ]
        }
      ]
    },
    {
      "type": "explain",
      "title": "Why use a loop?",
      "prompt": "What single edit would make this print ten flashes instead of three? Why?",
      "zh": "只改一处，怎样让 Flash 由三次变成十次？为什么？",
      "hint": "Say which number changes and how it affects the repeat count.",
      "hintZh": "指出要改的数字，以及它如何影响重复次数。",
      "code": "for n in range(3):\n    print(\"Flash\")",
      "sample": "Change 3 to 10. range(10) gives ten values, so the body runs ten times.",
      "sampleZh": "把 3 改成 10。range(10) 产生十个值，因此循环体运行十次。"
    },
    {
      "type": "explain",
      "title": "Where is four?",
      "prompt": "Why does the output end at Level 3?",
      "zh": "为什么输出到 Level 3 就结束？",
      "hint": "List the values that level takes.",
      "hintZh": "列出 level 依次得到的值。",
      "code": "for level in range(1, 4):\n    print(\"Level\", level)",
      "sample": "range starts at 1 and stops before 4. Its last value is 3.",
      "sampleZh": "range 从 1 开始，在 4 之前停止，所以最后一个值是 3。"
    },
    {
      "type": "explain",
      "title": "Changing label",
      "prompt": "Why does the printed level number change even though the print line stays the same?",
      "zh": "为什么 print 这一行没有改变，显示的关卡号却会变化？",
      "hint": "Mention the loop variable.",
      "hintZh": "说明循环变量如何变化。",
      "code": "for level in range(1, 4):\n    print(\"Level\", level)",
      "sample": "On each turn Python assigns the next range value to level. print reads its current value.",
      "sampleZh": "每轮循环会把 range 中的下一个值赋给 level。print 读取它当前的值。"
    },
    {
      "type": "explain",
      "title": "Last message",
      "prompt": "Why is Bye printed once after the two Go messages?",
      "zh": "为什么两次 Go 之后只显示一次 Bye？",
      "hint": "Compare how far both print lines are indented.",
      "hintZh": "比较两条 print 的缩进。",
      "code": "for lap in range(2):\n    print(\"Go\")\nprint(\"Bye\")",
      "sample": "Bye is outside the indented loop body. Python reaches it once after the loop finishes.",
      "sampleZh": "Bye 不在缩进的循环体内。循环结束后，才执行它一次。"
    },
    {
      "type": "explain",
      "title": "Locked route",
      "prompt": "A player enters 4. Why are no level numbers printed?",
      "zh": "玩家输入 4。为什么不显示关卡号？",
      "hint": "Mention the condition and where the loop sits.",
      "hintZh": "说明条件和循环所在的位置。",
      "code": "coins = int(input())\nif coins >= 5:\n    for n in range(1, 4):\n        print(n)\nelse:\n    print(\"Wait\")",
      "sample": "Four does not pass the five-coin check. The loop is inside if, so only Wait appears.",
      "sampleZh": "4 未达到 5。循环在 if 分支里面，因此只显示 Wait。"
    },
    {
      "type": "explain",
      "title": "Choose the round count",
      "prompt": "Why does count use int(input()) here?",
      "zh": "这里为什么用 int(input()) 来读取 count？",
      "hint": "Name the type that range accepts.",
      "hintZh": "指出 range 接受什么类型。",
      "code": "count = int(input())\nfor lap in range(count):\n    print(\"Race\")",
      "sample": "input gives text. int converts it to a whole number that range can use.",
      "sampleZh": "input 返回文字。int 把它转换为 range 能使用的整数。"
    },
    {
      "type": "explain",
      "title": "Level five upgrade",
      "prompt": "The player wants levels 1 through 5. Explain which number must change and why.",
      "zh": "玩家需要第 1 到第 5 关。解释该改哪个数字，以及原因。",
      "hint": "Describe the start and stop separately.",
      "hintZh": "分别说明起始值和结束值。",
      "code": "for level in range(1, 4):\n    print(level)",
      "sample": "Keep start 1 and change stop 4 to 6. Stopping before 6 includes level 5.",
      "sampleZh": "保留起始值 1，把结束值 4 改成 6。在 6 之前停止就会包括第 5 关。"
    },
    {
      "type": "explain",
      "title": "A fair gate test",
      "prompt": "Which two neighbouring coin inputs would check that only unlocked players see levels? What should each show?",
      "zh": "选哪两个相邻的金币数，能检查只有解锁的玩家才看到关卡？各应显示什么？",
      "hint": "Choose the largest locked count and the smallest unlocked count.",
      "hintZh": "选择最大的锁定值和最小的解锁值。",
      "code": "if coins >= 5:\n    for level in range(1, 3):\n        print(level)\nelse:\n    print(\"Wait\")",
      "sample": "At 4, show only Wait. At 5, show 1 and 2. This checks both sides of the gate.",
      "sampleZh": "输入 4，只显示 Wait。输入 5，显示 1 和 2。这能检查门槛两侧的情况。"
    },
    {
      "type": "challenge",
      "title": "Blink twice",
      "prompt": "Use a for loop that prints Blink twice on separate lines.",
      "zh": "使用 for 循环，分两行显示 Blink。",
      "hint": "Start with for lamp in range(2): and indent the print.",
      "hintZh": "以 for lamp in range(2): 开头，并缩进 print。",
      "starter": "# Write a for loop here",
      "solution": "for lamp in range(2):\n    print(\"Blink\")",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "Blink",
            "Blink"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Three numbered rounds",
      "prompt": "Use a for loop to print Round 1, Round 2 and Round 3 on separate lines.",
      "zh": "使用 for 循环，分行显示 Round 1、Round 2、Round 3。",
      "hint": "Count from 1 and stop just before 4.",
      "hintZh": "从 1 开始，在 4 之前停止。",
      "starter": "# Choose the range and print the round number",
      "solution": "for n in range(1, 4):\n    print(\"Round\", n)",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "Round 1",
            "Round 2",
            "Round 3"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Let the player choose",
      "prompt": "Read a whole-number round count. Use a loop to print Go once per round.",
      "zh": "读取整数回合数，用循环为每一轮显示一次 Go。",
      "hint": "Use the player’s number in range.",
      "hintZh": "把玩家输入的数字放进 range。",
      "starter": "rounds = int(input())\n# Print Go once per round",
      "solution": "rounds = int(input())\nfor lap in range(rounds):\n    print(\"Go\")",
      "tests": [
        {
          "inputs": [
            "1"
          ],
          "expected": [
            "Go"
          ]
        },
        {
          "inputs": [
            "3"
          ],
          "expected": [
            "Go",
            "Go",
            "Go"
          ]
        },
        {
          "inputs": [
            "0"
          ],
          "expected": []
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Personalise two levels",
      "prompt": "Read a game title. Use a loop to show its two levels, like Maze - Level 1 and Maze - Level 2.",
      "zh": "读取游戏名，用循环显示它的两关，例如 Maze - Level 1 和 Maze - Level 2。",
      "hint": "Print three values: game, \"- Level\", and the current number.",
      "hintZh": "输出三项：game、\"- Level\" 以及当前的编号。",
      "starter": "game = input()\n# Print the two game levels",
      "solution": "game = input()\nfor level in range(1, 3):\n    print(game, \"- Level\", level)",
      "tests": [
        {
          "inputs": [
            "Maze"
          ],
          "expected": [
            "Maze - Level 1",
            "Maze - Level 2"
          ]
        },
        {
          "inputs": [
            "Drift"
          ],
          "expected": [
            "Drift - Level 1",
            "Drift - Level 2"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Keep the bell outside",
      "prompt": "Print Start, then Level 1 and Level 2 using a loop, then Finish once. Each message goes on a separate line.",
      "zh": "先显示 Start，再用循环显示 Level 1 和 Level 2，最后显示一次 Finish。每条信息独占一行。",
      "hint": "Line up the final print with the first one.",
      "hintZh": "让最后一条 print 和第一条左对齐。",
      "starter": "print(\"Start\")\n# Add the loop and the final message",
      "solution": "print(\"Start\")\nfor n in range(1, 3):\n    print(\"Level\", n)\nprint(\"Finish\")",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "Start",
            "Level 1",
            "Level 2",
            "Finish"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Add levels to your pass",
      "prompt": "This is the Day 1 gate. Under Pass unlocked, use a loop to print Level 1, Level 2 and Level 3. Keep the locked message.",
      "zh": "这是一开始的通行证闸门。在 Pass unlocked 下方用循环显示 Level 1、Level 2、Level 3。保留未解锁信息。",
      "hint": "Indent for as far as the unlocked message. Indent its print one step further.",
      "hintZh": "for 与解锁信息对齐。循环中的 print 再多缩进一层。",
      "starter": "coins = int(input())\nif coins >= 5:\n    print(\"Pass unlocked\")\n    # Add the level loop here\nelse:\n    print(\"You need 5 coins\")",
      "solution": "coins = int(input())\nif coins >= 5:\n    print(\"Pass unlocked\")\n    for level in range(1, 4):\n        print(\"Level\", level)\nelse:\n    print(\"You need 5 coins\")",
      "tests": [
        {
          "inputs": [
            "4"
          ],
          "expected": [
            "You need 5 coins"
          ]
        },
        {
          "inputs": [
            "5"
          ],
          "expected": [
            "Pass unlocked",
            "Level 1",
            "Level 2",
            "Level 3"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Five-level upgrade",
      "prompt": "Your Arcade Pass now shows three levels. Change one number so unlocked players see Level 1 through Level 5. Keep the ticket and the locked route.",
      "zh": "通行证目前显示三关。改一个数字，使解锁的玩家看到 Level 1 至 Level 5。保留票券和未解锁分支。",
      "hint": "The loop begins at 1. Which stop value includes 5?",
      "hintZh": "循环从 1 开始。哪个结束值能让 5 包含在内？",
      "starter": "print(\"ARCADE PASS\")\nname = input(\"Player name: \")\ngame = input(\"Choose a game: \")\ncoins = int(input(\"Coins: \"))\nprint(\"Welcome\", name)\nprint(\"Game:\", game)\nif coins >= 5:\n    print(\"Pass unlocked\")\n    for level in range(1, 4):\n        print(\"Level\", level)\nelse:\n    print(\"You need 5 coins\")",
      "solution": "print(\"ARCADE PASS\")\nname = input(\"Player name: \")\ngame = input(\"Choose a game: \")\ncoins = int(input(\"Coins: \"))\nprint(\"Welcome\", name)\nprint(\"Game:\", game)\nif coins >= 5:\n    print(\"Pass unlocked\")\n    for level in range(1, 6):\n        print(\"Level\", level)\nelse:\n    print(\"You need 5 coins\")",
      "tests": [
        {
          "inputs": [
            "Mei",
            "Maze",
            "5"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Mei",
            "Game: Maze",
            "Pass unlocked",
            "Level 1",
            "Level 2",
            "Level 3",
            "Level 4",
            "Level 5"
          ]
        },
        {
          "inputs": [
            "Ari",
            "Drift",
            "3"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Ari",
            "Game: Drift",
            "You need 5 coins"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Your finished Arcade Pass",
      "prompt": "Keep your five-level Arcade Pass. Change the loop’s output so every unlocked level starts with the chosen game, like Maze - Level 1. Keep the locked route and the ticket. Save your finished program.",
      "zh": "保留你的五关通行证。修改循环中的输出，让每一关以所选游戏名开头，例如 Maze - Level 1。保留未解锁分支和票券。保存完成的程序。",
      "hint": "Change the print inside for. Use game, the text \"- Level\", and the level number.",
      "hintZh": "修改 for 内的 print。使用 game、文字 \"- Level\" 以及关卡号。",
      "starter": "print(\"ARCADE PASS\")\nname = input(\"Player name: \")\ngame = input(\"Choose a game: \")\ncoins = int(input(\"Coins: \"))\nprint(\"Welcome\", name)\nprint(\"Game:\", game)\nif coins >= 5:\n    print(\"Pass unlocked\")\n    for level in range(1, 6):\n        print(\"Level\", level)\nelse:\n    print(\"You need 5 coins\")",
      "solution": "print(\"ARCADE PASS\")\nname = input(\"Player name: \")\ngame = input(\"Choose a game: \")\ncoins = int(input(\"Coins: \"))\nprint(\"Welcome\", name)\nprint(\"Game:\", game)\nif coins >= 5:\n    print(\"Pass unlocked\")\n    for level in range(1, 6):\n        print(game, \"- Level\", level)\nelse:\n    print(\"You need 5 coins\")",
      "tests": [
        {
          "inputs": [
            "Mei",
            "Maze",
            "5"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Mei",
            "Game: Maze",
            "Pass unlocked",
            "Maze - Level 1",
            "Maze - Level 2",
            "Maze - Level 3",
            "Maze - Level 4",
            "Maze - Level 5"
          ]
        },
        {
          "inputs": [
            "Ari",
            "Drift",
            "3"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Ari",
            "Game: Drift",
            "You need 5 coins"
          ]
        },
        {
          "inputs": [
            "Bo",
            "Orbit",
            "8"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Bo",
            "Game: Orbit",
            "Pass unlocked",
            "Orbit - Level 1",
            "Orbit - Level 2",
            "Orbit - Level 3",
            "Orbit - Level 4",
            "Orbit - Level 5"
          ]
        }
      ]
    }
  ]
};
