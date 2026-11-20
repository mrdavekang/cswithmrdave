// Python cover activities for Day 1.
window.COVER_CARDS = {
  "1": [
    {
      "type": "typing",
      "title": "Switch on the arcade",
      "prompt": "Type the line that lights up the arcade sign.",
      "zh": "照着输入这一行，让街机招牌亮起来。",
      "hint": "Use straight quotation marks around the words.",
      "hintZh": "用英文半角双引号把文字括起来。",
      "code": "print(\"ARCADE PASS\")"
    },
    {
      "type": "typing",
      "title": "Name tag",
      "prompt": "Type the line that stores a player name.",
      "zh": "照着输入这一行，保存玩家名字。",
      "hint": "Leave one space on each side of the equals sign.",
      "hintZh": "等号两边各留一个空格。",
      "code": "name = \"Alex\""
    },
    {
      "type": "typing",
      "title": "Pick a game",
      "prompt": "Type the question the player will answer.",
      "zh": "输入这行代码，让玩家选择游戏。",
      "hint": "The space after the colon is inside the quotes.",
      "hintZh": "冒号后的空格在引号内。",
      "code": "game = input(\"Choose a game: \")"
    },
    {
      "type": "typing",
      "title": "Coin reader",
      "prompt": "Type the line that reads a whole number.",
      "zh": "输入这行代码，读取整数金币数。",
      "hint": "Close input first, then int. Look for two closing brackets.",
      "hintZh": "先结束 input，再结束 int，行末有两个右括号。",
      "code": "coins = int(input(\"Coins: \"))"
    },
    {
      "type": "typing",
      "title": "Ticket price",
      "prompt": "Type the decimal ticket price.",
      "zh": "输入含小数的票价。",
      "hint": "A decimal number uses a dot and no quotes here.",
      "hintZh": "小数使用英文句点，这里不用引号。",
      "code": "price = 2.5"
    },
    {
      "type": "typing",
      "title": "Ready light",
      "prompt": "Type the Boolean value that switches the ready light on.",
      "zh": "输入布尔值，点亮准备指示灯。",
      "hint": "Python writes True with a capital T.",
      "hintZh": "Python 中 True 的首字母 T 要大写。",
      "code": "ready = True"
    },
    {
      "type": "typing",
      "title": "Gate opens",
      "prompt": "Type the condition and the indented action.",
      "zh": "输入条件及下一行缩进的动作。",
      "hint": "Use four spaces before print on the second line.",
      "hintZh": "第二行的 print 前有四个空格。",
      "code": "if coins >= 5:\n    print(\"Pass unlocked\")"
    },
    {
      "type": "typing",
      "title": "Other path",
      "prompt": "Type the two lines for players below the coin limit.",
      "zh": "输入金币不足时执行的两行代码。",
      "hint": "A colon ends the first line.",
      "hintZh": "第一行末尾有冒号。",
      "code": "else:\n    print(\"You need 5 coins\")"
    },
    {
      "type": "mcq",
      "title": "Arcade sign",
      "prompt": "What appears on the screen?",
      "zh": "屏幕会显示什么？",
      "hint": "Quotes mark the start and end of text in code.",
      "hintZh": "引号在代码中标出文字的开始和结束。",
      "code": "print(\"Ready\")",
      "options": [
        "\"Ready\"",
        "Ready",
        "print",
        "Nothing"
      ],
      "correct": 1
    },
    {
      "type": "mcq",
      "title": "Listen to the player",
      "prompt": "Which instruction pauses for a player to type?",
      "zh": "哪条指令会等待玩家输入？",
      "hint": "Look for the function that reads from the keyboard.",
      "hintZh": "找出从键盘读取内容的函数。",
      "code": "",
      "options": [
        "print(\"Name\")",
        "name = \"Ari\"",
        "name = input(\"Name: \")",
        "int(4)"
      ],
      "correct": 2
    },
    {
      "type": "mcq",
      "title": "A number or a name?",
      "prompt": "The player types 7. Which type does input() return here?",
      "zh": "玩家输入 7。这里 input() 返回什么类型？",
      "hint": "The keyboard gives Python text until you convert it.",
      "hintZh": "键盘输入会先作为文字，除非你转换类型。",
      "code": "answer = input(\"Coins: \")",
      "options": [
        "int",
        "float",
        "bool",
        "str"
      ],
      "correct": 3
    },
    {
      "type": "mcq",
      "title": "Half a ticket",
      "prompt": "Which value has type float?",
      "zh": "哪个值的类型是 float（浮点数）？",
      "hint": "A float can represent a number with a fractional part.",
      "hintZh": "float 可以表示带小数部分的数字。",
      "code": "",
      "options": [
        "2.5",
        "\"2.5\"",
        "2",
        "True"
      ],
      "correct": 0
    },
    {
      "type": "mcq",
      "title": "Ready or waiting",
      "prompt": "Which value is a Boolean in Python?",
      "zh": "哪个值在 Python 中是布尔值？",
      "hint": "Check the capital letter and the quotation marks.",
      "hintZh": "留意大小写及是否使用引号。",
      "code": "",
      "options": [
        "\"True\"",
        "\"ready\"",
        "True",
        "1.5"
      ],
      "correct": 2
    },
    {
      "type": "mcq",
      "title": "Exactly enough",
      "prompt": "The player has 5 coins. Which message appears?",
      "zh": "玩家有 5 枚金币。会显示哪条信息？",
      "hint": "The equals sign includes the limit itself.",
      "hintZh": "等号表示边界值也符合条件。",
      "code": "coins = 5\nif coins >= 5:\n    print(\"Enter\")\nelse:\n    print(\"Wait\")",
      "options": [
        "Wait",
        "Enter",
        "Both messages",
        "No message"
      ],
      "correct": 1
    },
    {
      "type": "mcq",
      "title": "A useful label",
      "prompt": "What appears on a single line?",
      "zh": "一行中会显示什么？",
      "hint": "print separates two comma-separated values with a space.",
      "hintZh": "print 默认用一个空格分隔逗号隔开的两个值。",
      "code": "game = \"Drift\"\nprint(\"Game:\", game)",
      "options": [
        "Game: game",
        "Drift Game:",
        "Game:Drift",
        "Game: Drift"
      ],
      "correct": 3
    },
    {
      "type": "mcq",
      "title": "The locked gate",
      "prompt": "The player types 3. Which line runs next after the check?",
      "zh": "玩家输入 3。判断后会执行哪一行？",
      "hint": "Trace whether 3 is at least 5.",
      "hintZh": "判断 3 是否大于或等于 5。",
      "code": "coins = int(input())\nif coins >= 5:\n    print(\"Unlocked\")\nelse:\n    print(\"Collect more\")",
      "options": [
        "print(\"Collect more\")",
        "print(\"Unlocked\")",
        "Both print lines",
        "The input line repeats"
      ],
      "correct": 0
    },
    {
      "type": "blank",
      "title": "Light the sign",
      "prompt": "Choose the function that shows the exact words on screen.",
      "zh": "选择能在屏幕上显示文字的函数。",
      "hint": "The player should see a message without typing a reply.",
      "hintZh": "只显示文字，玩家不需要回答。",
      "code": "___(\"Insert coin\")",
      "options": [
        "input",
        "int",
        "print",
        "str"
      ],
      "correct": 2
    },
    {
      "type": "blank",
      "title": "Store the player",
      "prompt": "Choose the missing assignment symbol.",
      "zh": "选择用于赋值的符号。",
      "hint": "An assignment stores a value under a variable name.",
      "hintZh": "赋值把值存入变量。",
      "code": "name ___ \"Alex\"",
      "options": [
        "=",
        "==",
        ">=",
        "+"
      ],
      "correct": 0
    },
    {
      "type": "blank",
      "title": "Player input",
      "prompt": "Choose what reads the game title from the player.",
      "zh": "选择能读取玩家输入的游戏名的函数。",
      "hint": "The game title changes with each player.",
      "hintZh": "游戏名由各位玩家输入。",
      "code": "game = ___(\"Choose a game: \")",
      "options": [
        "print",
        "float",
        "bool",
        "input"
      ],
      "correct": 3
    },
    {
      "type": "blank",
      "title": "Count coins",
      "prompt": "Fill the gap so coins stores a whole number.",
      "zh": "填空，让 coins 保存整数。",
      "hint": "Which type holds a whole number?",
      "hintZh": "哪一种类型表示整数？",
      "code": "coins = ___(input(\"Coins: \"))",
      "options": [
        "str",
        "int",
        "print",
        "float"
      ],
      "correct": 1
    },
    {
      "type": "blank",
      "title": "Name on a ticket",
      "prompt": "Choose the variable so the ticket shows the actual player name.",
      "zh": "选择变量，让票上显示玩家实际输入的名字。",
      "hint": "Quotes would display the word itself.",
      "hintZh": "加引号会直接显示引号内的文字。",
      "code": "name = input()\nprint(\"Player:\", ___)",
      "options": [
        "\"name\"",
        "\"Player\"",
        "name",
        "input"
      ],
      "correct": 2
    },
    {
      "type": "blank",
      "title": "Five or more",
      "prompt": "Choose the comparison that includes 5 and every larger number.",
      "zh": "选择包括 5 以及所有更大数字的比较符。",
      "hint": "Read the comparison as “at least”.",
      "hintZh": "这里的意思是“至少”。",
      "code": "if coins ___ 5:\n    print(\"Open\")",
      "options": [
        ">",
        "==",
        "<=",
        ">="
      ],
      "correct": 3
    },
    {
      "type": "blank",
      "title": "Catch the other case",
      "prompt": "Which keyword opens the branch for every other coin count?",
      "zh": "哪个关键词开启其余金币数的分支？",
      "hint": "Only one of the two messages should appear.",
      "hintZh": "两条信息只会显示其中一条。",
      "code": "if coins >= 5:\n    print(\"Open\")\n___:\n    print(\"Wait\")",
      "options": [
        "else",
        "if",
        "int",
        "and"
      ],
      "correct": 0
    },
    {
      "type": "blank",
      "title": "Coins still needed",
      "prompt": "A pass costs 5 coins. When coins is 3 the answer should be 2. Fill the gap.",
      "zh": "通行证需 5 枚金币。有 3 枚时应显示还差 2 枚。选择算式。",
      "hint": "Subtract what the player owns from the price.",
      "hintZh": "用价格减去玩家已有的金币数。",
      "code": "if coins < 5:\n    print(\"Still needed:\", ___)",
      "options": [
        "coins + 5",
        "5 - coins",
        "coins - 5",
        "coins"
      ],
      "correct": 1
    },
    {
      "type": "parsons",
      "title": "Welcome ticket",
      "prompt": "Ask for the name, make a greeting, then print that greeting.",
      "zh": "先问名字，再组成问候语，最后显示问候语。",
      "hint": "Each line needs a value from the previous line.",
      "hintZh": "每行都需要使用上一行得到的值。",
      "lines": [
        "name = input(\"Name: \")",
        "greeting = \"Hello \" + name",
        "print(greeting)"
      ]
    },
    {
      "type": "parsons",
      "title": "Coin bonus",
      "prompt": "Read the coins as text, turn them into a number, add one and print the new total.",
      "zh": "先读取文字，再转成整数、加一，最后显示新的总数。",
      "hint": "The arithmetic needs a number.",
      "hintZh": "相加时需要数字。",
      "lines": [
        "answer = input(\"Coins: \")",
        "coins = int(answer)",
        "total = coins + 1",
        "print(total)"
      ]
    },
    {
      "type": "parsons",
      "title": "Ticket price",
      "prompt": "Set the price, double it for two tickets, then print the cost.",
      "zh": "设置票价，计算两张票的价格，再显示总价。",
      "hint": "Find the line that creates price first.",
      "hintZh": "先找出创建 price 的代码行。",
      "lines": [
        "price = 2.5",
        "cost = price * 2",
        "print(\"Cost:\", cost)"
      ]
    },
    {
      "type": "parsons",
      "title": "Enter with five",
      "prompt": "Read coins, check the limit, then show the unlocked message inside the decision.",
      "zh": "读取金币数，判断是否足够，再在条件成立时显示解锁信息。",
      "hint": "Indented lines belong under their condition.",
      "hintZh": "缩进行应放在条件下方。",
      "lines": [
        "coins = int(input(\"Coins: \"))",
        "if coins >= 5:",
        "    print(\"Pass unlocked\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Two routes",
      "prompt": "Read the code from top to bottom. Show Open for five coins or more, and Wait otherwise.",
      "zh": "从上到下排列。五枚或以上显示 Open，否则显示 Wait。",
      "hint": "The first message is inside if. The second is inside else.",
      "hintZh": "第一条信息属于 if，第二条属于 else。",
      "lines": [
        "coins = int(input())",
        "if coins >= 5:",
        "    print(\"Open\")",
        "else:",
        "    print(\"Wait\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Game badge",
      "prompt": "Ask for a game, build the badge text, then print the badge.",
      "zh": "询问游戏名，组成徽章文字，再显示徽章。",
      "hint": "badge needs game before it can be made.",
      "hintZh": "必须先获得 game 的值才能组成 badge。",
      "lines": [
        "game = input(\"Game: \")",
        "badge = \"Playing \" + game",
        "print(badge)"
      ]
    },
    {
      "type": "parsons",
      "title": "Ready check",
      "prompt": "Read coins, calculate the Boolean ready, then use ready to show Enter.",
      "zh": "读取金币数，计算布尔值 ready，再用 ready 决定是否显示 Enter。",
      "hint": "ready must exist before the if checks it.",
      "hintZh": "if 检查 ready 前，ready 必须已有值。",
      "lines": [
        "coins = int(input())",
        "ready = coins >= 5",
        "if ready:",
        "    print(\"Enter\")"
      ]
    },
    {
      "type": "parsons",
      "title": "Collect the difference",
      "prompt": "Read coins, work out the missing amount, then print it only if it is positive.",
      "zh": "读取金币数，算出还差多少，仅当差值大于零时显示。",
      "hint": "The condition uses the result of the subtraction.",
      "hintZh": "条件需要使用减法的结果。",
      "lines": [
        "coins = int(input())",
        "missing = 5 - coins",
        "if missing > 0:",
        "    print(\"Collect\", missing)"
      ]
    },
    {
      "type": "debug",
      "title": "Wrong sign",
      "prompt": "The sign should show ARCADE PASS in capitals. Repair the text.",
      "zh": "招牌应显示大写 ARCADE PASS。修正文字。",
      "hint": "Change the letters between the quotes.",
      "hintZh": "修改引号内的字母。",
      "starter": "print(\"Arcade Pass\")",
      "solution": "print(\"ARCADE PASS\")",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "ARCADE PASS"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Lost player",
      "prompt": "Type any name. The screen should show that name, not the word name.",
      "zh": "输入任意名字。屏幕应显示实际名字，而非单词 name。",
      "hint": "A variable name goes outside quotes.",
      "hintZh": "变量名不用引号。",
      "starter": "name = input()\nprint(\"name\")",
      "solution": "name = input()\nprint(name)",
      "tests": [
        {
          "inputs": [
            "Ari"
          ],
          "expected": [
            "Ari"
          ]
        },
        {
          "inputs": [
            "Mei"
          ],
          "expected": [
            "Mei"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Coin dispenser",
      "prompt": "Add one coin to any whole number the player enters. Input 4 should show 5.",
      "zh": "给输入的整数金币数加一。输入 4 应显示 5。",
      "hint": "Convert the keyboard text before adding.",
      "hintZh": "先把输入的文字转换为整数。",
      "starter": "coins = input()\nprint(coins + 1)",
      "solution": "coins = int(input())\nprint(coins + 1)",
      "tests": [
        {
          "inputs": [
            "4"
          ],
          "expected": [
            "5"
          ]
        },
        {
          "inputs": [
            "10"
          ],
          "expected": [
            "11"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Five should enter",
      "prompt": "Show Open for 5 or more coins. Show Wait for fewer than 5.",
      "zh": "金币数达到 5 时显示 Open，不足 5 时显示 Wait。",
      "hint": "Try the smallest accepted number.",
      "hintZh": "检查刚好达到要求的最小数字。",
      "starter": "coins = int(input())\nif coins > 5:\n    print(\"Open\")\nelse:\n    print(\"Wait\")",
      "solution": "coins = int(input())\nif coins >= 5:\n    print(\"Open\")\nelse:\n    print(\"Wait\")",
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
            "Open"
          ]
        },
        {
          "inputs": [
            "6"
          ],
          "expected": [
            "Open"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Messages switched",
      "prompt": "The gate currently welcomes the wrong players. Show Enter at 5 or above, otherwise Collect.",
      "zh": "闸门的信息反了。金币数达到 5 时显示 Enter，否则显示 Collect。",
      "hint": "Keep the condition. Check which message is under it.",
      "hintZh": "保留条件，检查它下面的信息。",
      "starter": "coins = int(input())\nif coins >= 5:\n    print(\"Collect\")\nelse:\n    print(\"Enter\")",
      "solution": "coins = int(input())\nif coins >= 5:\n    print(\"Enter\")\nelse:\n    print(\"Collect\")",
      "tests": [
        {
          "inputs": [
            "6"
          ],
          "expected": [
            "Enter"
          ]
        },
        {
          "inputs": [
            "2"
          ],
          "expected": [
            "Collect"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Decimal ticket",
      "prompt": "Read a decimal ticket price and show the price for two tickets. Input 2.5 should show 5.0.",
      "zh": "读取含小数的票价，显示两张票的总价。输入 2.5 应显示 5.0。",
      "hint": "Use the conversion that accepts a decimal point.",
      "hintZh": "使用能接受小数点的类型转换函数。",
      "starter": "price = int(input())\nprint(price * 2)",
      "solution": "price = float(input())\nprint(price * 2)",
      "tests": [
        {
          "inputs": [
            "2.5"
          ],
          "expected": [
            "5.0"
          ]
        },
        {
          "inputs": [
            "1.25"
          ],
          "expected": [
            "2.5"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Mixed-up badge",
      "prompt": "Input order is player name, then game. Print Game: followed by the game title.",
      "zh": "先输入玩家名字，再输入游戏名。显示 Game: 和游戏名。",
      "hint": "Check which variable is printed.",
      "hintZh": "检查最后显示的是哪个变量。",
      "starter": "name = input()\ngame = input()\nprint(\"Game:\", name)",
      "solution": "name = input()\ngame = input()\nprint(\"Game:\", game)",
      "tests": [
        {
          "inputs": [
            "Ari",
            "Orbit"
          ],
          "expected": [
            "Game: Orbit"
          ]
        },
        {
          "inputs": [
            "Li",
            "Drift"
          ],
          "expected": [
            "Game: Drift"
          ]
        }
      ]
    },
    {
      "type": "debug",
      "title": "Wrong change",
      "prompt": "The player has fewer than 5 coins. Print how many more they need as a positive number.",
      "zh": "玩家不足 5 枚金币。用正数显示还差几枚。",
      "hint": "Start with the price and take away the coins already held.",
      "hintZh": "从所需金币数减去已有金币数。",
      "starter": "coins = int(input())\nprint(\"Need\", coins - 5)",
      "solution": "coins = int(input())\nprint(\"Need\", 5 - coins)",
      "tests": [
        {
          "inputs": [
            "3"
          ],
          "expected": [
            "Need 2"
          ]
        },
        {
          "inputs": [
            "0"
          ],
          "expected": [
            "Need 5"
          ]
        }
      ]
    },
    {
      "type": "explain",
      "title": "Code or screen?",
      "prompt": "Why do the quotation marks disappear in the output?",
      "zh": "为什么输出中没有引号？",
      "hint": "Name what the quotes do in the code.",
      "hintZh": "说明引号在代码中的作用。",
      "code": "print(\"Arcade\")",
      "sample": "The quotes tell Python where the text starts and ends. The text shown is Arcade.",
      "sampleZh": "引号标出文字的起点和终点。屏幕显示的是 Arcade。"
    },
    {
      "type": "explain",
      "title": "A name that changes",
      "prompt": "How can two players see different greetings from the same code?",
      "zh": "为什么同一段代码能向两位玩家显示不同的问候语？",
      "hint": "Think about where name gets its value.",
      "hintZh": "想想 name 的值从哪里来。",
      "code": "name = input()\nprint(\"Hi\", name)",
      "sample": "input reads each player’s answer. print uses the value stored in name.",
      "sampleZh": "input 读取每位玩家的回答。print 使用 name 中存放的值。"
    },
    {
      "type": "explain",
      "title": "Text to coins",
      "prompt": "Why wrap input() in int() before adding 1?",
      "zh": "在加 1 之前，为什么用 int() 包住 input()？",
      "hint": "Mention the type before and after conversion.",
      "hintZh": "说出转换前后的数据类型。",
      "code": "coins = int(input())\nprint(coins + 1)",
      "sample": "input returns text. int converts a whole-number answer so Python can add 1.",
      "sampleZh": "input 返回文字。int 将表示整数的文字转成整数，才能加 1。"
    },
    {
      "type": "explain",
      "title": "Half prices",
      "prompt": "The arcade sells a ticket for 2.5 coins. Why use float for its price?",
      "zh": "票价是 2.5 枚金币。为什么用 float 保存票价？",
      "hint": "What part of 2.5 would a whole number miss?",
      "hintZh": "只用整数会丢失 2.5 的哪一部分？",
      "code": "price = 2.5",
      "sample": "The price includes half a coin. A float can store the fractional part.",
      "sampleZh": "票价含半枚金币。float 能保存小数部分。"
    },
    {
      "type": "explain",
      "title": "What is ready?",
      "prompt": "With coins set to 4, what value is stored in ready, and why?",
      "zh": "当 coins 为 4 时，ready 保存什么值？为什么？",
      "hint": "Give the Boolean value and compare 4 with 5.",
      "hintZh": "写出布尔值，并比较 4 和 5。",
      "code": "coins = 4\nready = coins >= 5",
      "sample": "False. Four is less than five, so the comparison does not pass.",
      "sampleZh": "False。4 小于 5，所以条件不成立。"
    },
    {
      "type": "explain",
      "title": "Boundary ticket",
      "prompt": "Explain why a player with exactly 5 coins gets in.",
      "zh": "解释为什么刚好有 5 枚金币的玩家可以进入。",
      "hint": "Explain the equals part of >=.",
      "hintZh": "解释 >= 中等号的含义。",
      "code": "if coins >= 5:\n    print(\"Enter\")",
      "sample": "The comparison means greater than or equal to 5. Equality makes the condition true at 5.",
      "sampleZh": "该比较表示大于或等于 5。等于 5 时条件也成立。"
    },
    {
      "type": "explain",
      "title": "One message only",
      "prompt": "Why does the player see just one of these two messages?",
      "zh": "为什么玩家只会看到两条信息中的一条？",
      "hint": "Describe what happens for true and for false.",
      "hintZh": "分别说明条件为真和为假时会发生什么。",
      "code": "if coins >= 5:\n    print(\"Play\")\nelse:\n    print(\"Wait\")",
      "sample": "Python runs the if branch when the condition is true. It runs the else branch when it is false.",
      "sampleZh": "条件成立时执行 if 分支；不成立时执行 else 分支。"
    },
    {
      "type": "explain",
      "title": "Two useful tests",
      "prompt": "Which two neighbouring coin counts would you try to see the gate switch from Wait to Open? Why?",
      "zh": "用哪两个相邻的金币数能检查闸门由 Wait 变为 Open？为什么？",
      "hint": "Look immediately below the limit and at the limit.",
      "hintZh": "选择刚好低于门槛的值和门槛值。",
      "code": "if coins >= 5:\n    print(\"Open\")\nelse:\n    print(\"Wait\")",
      "sample": "Use 4 and 5. Four is the last locked value and five is the first unlocked value.",
      "sampleZh": "用 4 和 5。4 是最后一个锁定值，5 是第一个解锁值。"
    },
    {
      "type": "challenge",
      "title": "Boot screen",
      "prompt": "Print ARCADE PASS on line 1 and Ready on line 2.",
      "zh": "第一行显示 ARCADE PASS，第二行显示 Ready。",
      "hint": "Each print starts a new line of output.",
      "hintZh": "每条 print 的输出默认另起一行。",
      "starter": "# Add two print lines here",
      "solution": "print(\"ARCADE PASS\")\nprint(\"Ready\")",
      "tests": [
        {
          "inputs": [],
          "expected": [
            "ARCADE PASS",
            "Ready"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Greet a player",
      "prompt": "Read one player name. Print Welcome followed by one space and their name.",
      "zh": "读取一个玩家名字，显示 Welcome、一个空格及玩家名字。",
      "hint": "Use a comma between the greeting and the variable.",
      "hintZh": "在问候语和变量之间写逗号。",
      "starter": "name = input()\n# Add the greeting",
      "solution": "name = input()\nprint(\"Welcome\", name)",
      "tests": [
        {
          "inputs": [
            "Alex"
          ],
          "expected": [
            "Welcome Alex"
          ]
        },
        {
          "inputs": [
            "Mei"
          ],
          "expected": [
            "Welcome Mei"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Name the game",
      "prompt": "Read a name then a game. Print Player: followed by the name, then Game: followed by the game on the next line.",
      "zh": "依次读取名字和游戏名。第一行显示 Player: 和名字，第二行显示 Game: 和游戏名。",
      "hint": "Match each label to its variable.",
      "hintZh": "让每个标签对应正确的变量。",
      "starter": "name = input()\ngame = input()\n# Print both lines",
      "solution": "name = input()\ngame = input()\nprint(\"Player:\", name)\nprint(\"Game:\", game)",
      "tests": [
        {
          "inputs": [
            "Bo",
            "Maze"
          ],
          "expected": [
            "Player: Bo",
            "Game: Maze"
          ]
        },
        {
          "inputs": [
            "Nia",
            "Orbit"
          ],
          "expected": [
            "Player: Nia",
            "Game: Orbit"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Bonus coin",
      "prompt": "Read a whole-number coin count. Add 1 and print Coins: followed by the new total.",
      "zh": "读取整数金币数，加 1，然后显示 Coins: 和新的总数。",
      "hint": "The total is coins + 1.",
      "hintZh": "新总数是 coins + 1。",
      "starter": "coins = int(input())\n# Add the bonus and print",
      "solution": "coins = int(input())\nprint(\"Coins:\", coins + 1)",
      "tests": [
        {
          "inputs": [
            "4"
          ],
          "expected": [
            "Coins: 5"
          ]
        },
        {
          "inputs": [
            "8"
          ],
          "expected": [
            "Coins: 9"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Token price",
      "prompt": "Read the price of one token as a decimal. Multiply it by 2 and print the number only.",
      "zh": "读取一个代币的单价（小数），乘以 2，只显示结果数字。",
      "hint": "float(input()) accepts a decimal answer.",
      "hintZh": "float(input()) 能读取小数。",
      "starter": "# Read the price then print the cost of two tokens",
      "solution": "price = float(input())\nprint(price * 2)",
      "tests": [
        {
          "inputs": [
            "1.5"
          ],
          "expected": [
            "3.0"
          ]
        },
        {
          "inputs": [
            "2.25"
          ],
          "expected": [
            "4.5"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Ready signal",
      "prompt": "Read coins as an integer. Print True when the player has at least 5, otherwise False.",
      "zh": "读取整数金币数。至少有 5 枚时显示 True，否则显示 False。",
      "hint": "A comparison already produces a Boolean.",
      "hintZh": "比较的结果本身就是布尔值。",
      "starter": "coins = int(input())\n# Print the result of a comparison",
      "solution": "coins = int(input())\nprint(coins >= 5)",
      "tests": [
        {
          "inputs": [
            "4"
          ],
          "expected": [
            "False"
          ]
        },
        {
          "inputs": [
            "5"
          ],
          "expected": [
            "True"
          ]
        },
        {
          "inputs": [
            "7"
          ],
          "expected": [
            "True"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Build the gate",
      "prompt": "Read coins. Show Pass unlocked for 5 or more, or You need 5 coins for fewer.",
      "zh": "读取金币数。达到 5 时显示 Pass unlocked，不足 5 时显示 You need 5 coins。",
      "hint": "Indent one print under if and one under else.",
      "hintZh": "if 和 else 下方各缩进一条 print。",
      "starter": "coins = int(input())\n# Add the if and else branches",
      "solution": "coins = int(input())\nif coins >= 5:\n    print(\"Pass unlocked\")\nelse:\n    print(\"You need 5 coins\")",
      "tests": [
        {
          "inputs": [
            "5"
          ],
          "expected": [
            "Pass unlocked"
          ]
        },
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
            "8"
          ],
          "expected": [
            "Pass unlocked"
          ]
        }
      ]
    },
    {
      "type": "challenge",
      "title": "Finish your Arcade Pass",
      "prompt": "Keep the heading, inputs and player ticket. Add the gate underneath. At 5 or more coins show Pass unlocked. Otherwise show You need 5 coins. Save this program for Day 2.",
      "zh": "保留标题、输入和玩家票券，在下方加上闸门。达到 5 枚时显示 Pass unlocked，否则显示 You need 5 coins。保存程序，第二天继续使用。",
      "hint": "Reuse your if/else from Build the gate. The coin count is already stored.",
      "hintZh": "可以沿用上一题的 if/else。金币数已经保存在 coins 中。",
      "starter": "print(\"ARCADE PASS\")\nname = input(\"Player name: \")\ngame = input(\"Choose a game: \")\ncoins = int(input(\"Coins: \"))\nprint(\"Welcome\", name)\nprint(\"Game:\", game)\n# Add your gate here",
      "solution": "print(\"ARCADE PASS\")\nname = input(\"Player name: \")\ngame = input(\"Choose a game: \")\ncoins = int(input(\"Coins: \"))\nprint(\"Welcome\", name)\nprint(\"Game:\", game)\nif coins >= 5:\n    print(\"Pass unlocked\")\nelse:\n    print(\"You need 5 coins\")",
      "tests": [
        {
          "inputs": [
            "Alex",
            "Maze",
            "5"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Alex",
            "Game: Maze",
            "Pass unlocked"
          ]
        },
        {
          "inputs": [
            "Nia",
            "Orbit",
            "4"
          ],
          "expected": [
            "ARCADE PASS",
            "Welcome Nia",
            "Game: Orbit",
            "You need 5 coins"
          ]
        }
      ]
    }
  ]
};
