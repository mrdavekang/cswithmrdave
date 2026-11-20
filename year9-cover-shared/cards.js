// Python cover activities, grouped by day and stage.
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
  ],
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
