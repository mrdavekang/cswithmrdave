'use strict';
const LessonData=(()=>{
const practice="MINUTES_PER_PAGE = 2\npage_count = 3\nprinting_minutes = page_count * MINUTES_PER_PAGE\nprint(printing_minutes)",starter="MINUTES_PER_PERSON = 4\nprint(\"Helpdesk adviser\")\n\n# INPUT QUESTIONS\n\n# TOTAL VISIT TIME\n\n# ADVICE\n";
const stages=[
  {
    "task": "practice",
    "title": [
      "01.1 · Predict",
      "01.1 · Predict 预测",
      "01.1 · Predict Ramal"
    ],
    "action": [
      "Read the given program",
      "读给定程序",
      "Baca program diberi"
    ],
    "where": [
      "All four lines in practice_printing.py",
      "practice_printing.py中的四行",
      "Empat baris dalam practice_printing.py"
    ],
    "goal": [
      "Predict the printed number before pressing Run.",
      "按Run前预测显示的数字。",
      "Ramal nombor sebelum menekan Run."
    ],
    "steps": [
      [
        "The four-line printing calculator is already in the editor. It uses 3 pages and 2 minutes per page.",
        "四行打印计算器已在编辑器里。3页，每页2分钟。",
        "Kalkulator empat baris sudah dalam editor. 3 halaman, 2 minit setiap halaman."
      ],
      [
        "On paper page 2, tick your prediction: 3, 6 or 8. Do not change the code yet.",
        "第2页勾选预测：3、6或8。暂时不要改代码。",
        "Halaman 2: tandakan ramalan 3, 6 atau 8. Jangan ubah kod lagi."
      ]
    ],
    "check": [
      "You chose a prediction. Practice has no marks.",
      "已选预测。练习不计分。",
      "Ramalan dipilih. Latihan tiada markah."
    ],
    "target": "",
    "ref": "",
    "kind": "read"
  },
  {
    "task": "practice",
    "title": [
      "01.2 · Run",
      "01.2 · Run 运行",
      "01.2 · Run Jalankan"
    ],
    "action": [
      "Run this given program",
      "运行这个给定程序",
      "Jalankan program diberi"
    ],
    "where": [
      "Run button → Console",
      "Run按钮 → Console控制台",
      "Butang Run → Konsol"
    ],
    "goal": [
      "Compare the console number with your prediction.",
      "把控制台数字与预测比较。",
      "Bandingkan nombor konsol dengan ramalan."
    ],
    "steps": [
      [
        "Press Run in the editor toolbar. It runs practice_printing.py, the file shown above the code.",
        "按编辑器工具栏的Run。运行代码上方标出的practice_printing.py。",
        "Tekan Run pada bar alat. Ia menjalankan practice_printing.py, fail di atas kod."
      ],
      [
        "Write only the actual printed number on paper page 2. Discuss if it differs from your prediction.",
        "第2页只写实际数字。若与预测不同，讨论原因。",
        "Tulis nombor sebenar sahaja pada halaman 2. Bincang jika berbeza."
      ]
    ],
    "check": [
      "You found the number in the console. A wrong prediction does not lose marks.",
      "找到实际数字。预测错不扣分。",
      "Nombor ditemui. Ramalan salah tidak menolak markah."
    ],
    "target": "",
    "ref": "",
    "kind": "read"
  },
  {
    "task": "practice",
    "title": [
      "01.3 · Investigate",
      "01.3 · Investigate 探究",
      "01.3 · Investigate Siasat"
    ],
    "action": [
      "Follow one line at a time",
      "逐行理解",
      "Ikut satu baris pada satu masa"
    ],
    "where": [
      "Highlighted line in the editor",
      "编辑器高亮行",
      "Baris diserlahkan dalam editor"
    ],
    "goal": [
      "Understand how the given calculator works before changing it.",
      "修改前理解给定计算器怎样运行。",
      "Fahami kalkulator sebelum mengubahnya."
    ],
    "steps": [
      [
        "Use Next explanation to follow the four lines. The highlighted line is the one being explained.",
        "用Next explanation逐行查看。高亮行就是正在解释的行。",
        "Guna Penjelasan seterusnya. Baris diserlahkan sedang diterangkan."
      ],
      [
        "Point to the line that gives page_count its value. This is the line you will replace in 01.4. Nothing to write here.",
        "指出给page_count赋值的行。01.4将替换它。本步骤不用写答案。",
        "Tunjuk baris yang memberi nilai page_count. Anda menggantikannya dalam 01.4. Tiada jawapan bertulis di sini."
      ]
    ],
    "check": [
      "You know which line will become an input question.",
      "知道哪行将改成输入问题。",
      "Anda tahu baris yang menjadi soalan input."
    ],
    "target": "tutor",
    "ref": "",
    "kind": "tutor"
  },
  {
    "task": "practice",
    "title": [
      "01.4 · Modify the page count",
      "01.4 · Modify 修改页数",
      "01.4 · Modify bilangan halaman"
    ],
    "action": [
      "REPLACE one line",
      "替换一行",
      "GANTI satu baris"
    ],
    "where": [
      "The assignment beginning page_count =",
      "以page_count =开头的赋值行",
      "Tugasan bermula page_count ="
    ],
    "goal": [
      "Ask the user how many pages to print. Store the answer as an integer in page_count.",
      "询问打印几页，将整数存入page_count。",
      "Tanya bilangan halaman. Simpan jawapan integer dalam page_count."
    ],
    "steps": [
      [
        "Press Find editing place. Replace the selected page_count assignment. Keep the constant, calculation and print lines.",
        "按Find editing place，替换选中的page_count赋值。保留常量、计算与print。",
        "Tekan Cari tempat sunting. Ganti tugasan page_count dipilih. Kekalkan pemalar, pengiraan dan print."
      ],
      [
        "Use the input reference if needed. Press Run; enter 2 at the console question, then Enter or Send.",
        "需要时用输入示例。按Run，在控制台输入2，再Enter或Send。",
        "Guna contoh input jika perlu. Run; masukkan 2 pada soalan konsol, kemudian Enter atau Hantar."
      ]
    ],
    "check": [
      "With 2 minutes per page and input 2, the printed number is 4. Keep this same practice file.",
      "每页2分钟，输入2，结果4。继续使用同一练习文件。",
      "2 minit setiap halaman dan input 2 menghasilkan 4. Kekalkan fail latihan ini."
    ],
    "target": "page_count",
    "ref": "page_count = int(input(\"Pages to print: \"))",
    "kind": "edit"
  },
  {
    "task": "practice",
    "title": [
      "01.5 · Modify the constant",
      "01.5 · Modify 修改常量",
      "01.5 · Modify pemalar"
    ],
    "action": [
      "CHANGE one value",
      "改变一个值",
      "UBAH satu nilai"
    ],
    "where": [
      "MINUTES_PER_PAGE = 2",
      "MINUTES_PER_PAGE = 2",
      "MINUTES_PER_PAGE = 2"
    ],
    "goal": [
      "Printing now takes 3 minutes per page. Change the constant value to 3.",
      "现在每页需3分钟，把常量值改为3。",
      "Kini setiap halaman mengambil 3 minit. Ubah nilai pemalar kepada 3."
    ],
    "steps": [
      [
        "Find the MINUTES_PER_PAGE assignment. Change only 2 to 3; keep its name and the rest of the program.",
        "找到MINUTES_PER_PAGE赋值，只把2改成3，保留名称和其余代码。",
        "Cari tugasan MINUTES_PER_PAGE. Ubah 2 kepada 3 sahaja; kekalkan nama dan kod lain."
      ],
      [
        "Run the same practice file and enter 2 again.",
        "运行同一练习文件，再输入2。",
        "Jalankan fail latihan yang sama dan masukkan 2 lagi."
      ]
    ],
    "check": [
      "Two pages × three minutes = 6. The input and calculation still work.",
      "2页 × 3分钟 = 6，输入和计算仍有效。",
      "2 halaman × 3 minit = 6. Input dan pengiraan masih berfungsi."
    ],
    "target": "MINUTES_PER_PAGE",
    "ref": "",
    "kind": "edit"
  },
  {
    "task": "practice",
    "title": [
      "01.6 · Modify the output",
      "01.6 · Modify 修改输出",
      "01.6 · Modify output"
    ],
    "action": [
      "REPLACE the print line",
      "替换print行",
      "GANTI baris print"
    ],
    "where": [
      "The print line at the bottom of practice_printing.py",
      "practice_printing.py底部print行",
      "Baris print di bawah practice_printing.py"
    ],
    "goal": [
      "Display the calculated printing time with a clear label and the unit minutes.",
      "显示计算出的打印时间，附清楚标签和分钟单位。",
      "Papar masa dikira dengan label jelas dan unit minit."
    ],
    "steps": [
      [
        "Replace the existing print, rather than adding another one. Keep printing_minutes outside quotation marks.",
        "替换已有print，不另加一行。printing_minutes保留在引号外。",
        "Ganti print sedia ada, bukan tambah satu lagi. Kekalkan printing_minutes di luar tanda petikan."
      ],
      [
        "Run; enter 2. Look for the calculated number 6 and minutes. Task 1 is now finished. Select Main Task 2 to open a DIFFERENT program.",
        "运行输入2，查看数字6和minutes。任务一完成。选择Main Task 2打开另一个程序。",
        "Run; masukkan 2. Cari 6 dan minit. Tugasan 1 selesai. Pilih Tugasan 2 untuk program BERBEZA."
      ]
    ],
    "check": [
      "Your practice file is saved. It will remain available when you create the helpdesk adviser.",
      "练习文件已保存。创建服务台工具时仍可查看。",
      "Fail latihan disimpan dan boleh dirujuk semasa mencipta penasihat."
    ],
    "target": "practice_print",
    "ref": "print(\"Printing time:\", printing_minutes, \"minutes.\")",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "02.1 · Make: ask for people ahead",
      "02.1 · Make 创建：询问前面人数",
      "02.1 · Make: tanya orang di hadapan"
    ],
    "action": [
      "CREATE a new input in my_helpdesk.py",
      "在my_helpdesk.py创建新输入",
      "CIPTA input baharu dalam my_helpdesk.py"
    ],
    "where": [
      "Below # INPUT QUESTIONS",
      "在# INPUT QUESTIONS下面",
      "Di bawah # INPUT QUESTIONS"
    ],
    "goal": [
      "Ask how many people are ahead. Store an integer in people_ahead.",
      "询问前面人数，将整数存入people_ahead。",
      "Tanya bilangan di hadapan. Simpan integer dalam people_ahead."
    ],
    "steps": [
      [
        "This is a NEW program. The printing calculator is saved in its own file. The starter only contains a constant, title and section comments.",
        "这是新程序，打印计算器另存。起始代码只有常量、标题和区段注释。",
        "Ini program BAHARU. Kalkulator cetakan disimpan berasingan. Starter hanya ada pemalar, tajuk dan komen bahagian."
      ],
      [
        "Find # INPUT QUESTIONS. Put a new line below it. Use the input pattern, changing page_count to people_ahead and the question to people ahead.",
        "找到# INPUT QUESTIONS，在下面写新行。参考输入结构，把page_count改成people_ahead，问题改成人数。",
        "Cari # INPUT QUESTIONS. Tulis baris baharu di bawahnya. Tukar page_count kepada people_ahead dan soalan kepada orang di hadapan."
      ],
      [
        "Run this file; enter 2. It should ask and accept a number. There is no total or advice yet. Paper page 5.",
        "运行输入2，程序应提问并接受数字。暂时没有总时间或建议。试卷第5页。",
        "Run; masukkan 2. Program meminta dan menerima nombor. Belum ada jumlah atau nasihat. Halaman 5."
      ]
    ],
    "check": [
      "The new helpdesk program asks for people ahead. Do not paste the whole printing program.",
      "新服务台程序会询问人数。不要贴入整个打印程序。",
      "Program baharu meminta bilangan orang. Jangan tampal seluruh program cetakan."
    ],
    "target": "people_ahead",
    "ref": "page_count = int(input(\"Pages to print: \"))",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "02.2 · Make: ask for available minutes",
      "02.2 · Make 创建：询问可用分钟",
      "02.2 · Make: tanya minit tersedia"
    ],
    "action": [
      "ADD a second input",
      "添加第二个输入",
      "TAMBAH input kedua"
    ],
    "where": [
      "Below your people_ahead input, in INPUT QUESTIONS",
      "在INPUT QUESTIONS内，人数输入下面",
      "Di bawah input people_ahead dalam INPUT QUESTIONS"
    ],
    "goal": [
      "Ask how many minutes are available. Store an integer in minutes_available.",
      "询问可用分钟，将整数存入minutes_available。",
      "Tanya minit tersedia. Simpan integer dalam minutes_available."
    ],
    "steps": [
      [
        "Keep the people_ahead input. Add a separate input question below it, using minutes_available as the variable name.",
        "保留people_ahead输入，在下面添加另一个问题，变量名minutes_available。",
        "Kekalkan input people_ahead. Tambah soalan berasingan di bawahnya dengan nama minutes_available."
      ],
      [
        "Run: answer 2 for people ahead and 15 for available minutes, using digits only. Both questions should appear. Paper page 6.",
        "运行：人数2、分钟15，只输入数字。应出现两个问题。试卷第6页。",
        "Run: 2 orang, 15 minit; digit sahaja. Kedua-dua soalan muncul. Halaman 6."
      ]
    ],
    "check": [
      "Your helpdesk program asks TWO different number questions.",
      "服务台程序会问两个不同数字问题。",
      "Program meminta DUA nombor berbeza."
    ],
    "target": "minutes_available",
    "ref": "page_count = int(input(\"Pages to print: \"))",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "02.3 · Make: calculate the visit time",
      "02.3 · Make 创建：计算总时间",
      "02.3 · Make: kira masa lawatan"
    ],
    "action": [
      "ADD one calculation",
      "添加一条计算",
      "TAMBAH satu pengiraan"
    ],
    "where": [
      "Below # TOTAL VISIT TIME",
      "在# TOTAL VISIT TIME下面",
      "Di bawah # TOTAL VISIT TIME"
    ],
    "goal": [
      "Store (people ahead + 1) × minutes per person in total_minutes. + 1 includes the visitor.",
      "把(前面人数+1)×每人分钟存入total_minutes。+1包括来访者。",
      "Simpan (orang di hadapan + 1) × minit setiap orang dalam total_minutes. +1 memasukkan pelawat."
    ],
    "steps": [
      [
        "The helpdesk takes 4 minutes per person. Use MINUTES_PER_PERSON, not the printing constant. Include the visitor as well as the people ahead.",
        "服务台每人4分钟。使用MINUTES_PER_PERSON，不用打印常量。人数要包括来访者。",
        "Meja bantuan mengambil 4 minit setiap orang. Guna MINUTES_PER_PERSON, bukan pemalar cetakan. Masukkan pelawat juga."
      ],
      [
        "Write the calculation below the marked comment. It stores the total but does not display it yet. Next, 02.4 will add the print line. Paper page 6.",
        "在标记注释下面写计算。它存入总时间，暂时不显示。下一步02.4添加print。第6页。",
        "Tulis pengiraan di bawah komen. Ia menyimpan jumlah tetapi belum memaparkannya. Seterusnya 02.4 menambah print. Halaman 6."
      ]
    ],
    "check": [
      "2 ahead + visitor = 3 people. 3 × 4 = 12 minutes. Use a calculated value, not a fixed 12.",
      "前面2人加来访者，共3人。3×4=12分钟，使用计算值，不固定写12。",
      "2 orang + pelawat = 3. 3 × 4 = 12 minit. Guna nilai dikira, bukan 12 tetap."
    ],
    "target": "total_minutes",
    "ref": "printing_minutes = page_count * MINUTES_PER_PAGE",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "02.4 · Make: display the total",
      "02.4 · Make 创建：显示总时间",
      "02.4 · Make: papar jumlah"
    ],
    "action": [
      "ADD a print statement",
      "添加一条print",
      "TAMBAH satu print"
    ],
    "where": [
      "Below your calculation, before # ADVICE",
      "在计算下面、# ADVICE之前",
      "Di bawah pengiraan, sebelum # ADVICE"
    ],
    "goal": [
      "Display the calculated total with a visit-time label and minutes.",
      "显示计算总时间、服务时间标签和分钟单位。",
      "Papar jumlah dikira dengan label masa lawatan dan unit minit."
    ],
    "steps": [
      [
        "Use total_minutes outside quotation marks. The printing output pattern is a reference; change its variable and label for the helpdesk.",
        "total_minutes在引号外。打印输出仅供参考，为服务台更换变量与标签。",
        "Guna total_minutes di luar tanda petikan. Pola cetakan ialah rujukan; tukar pemboleh ubah dan label."
      ],
      [
        "Run with 2 people and 15 available minutes. Look for Total visit time: 12 minutes, or equivalent clear wording. Paper page 6.",
        "输入人数2、分钟15运行，应显示总时间12分钟或同等清楚信息。第6页。",
        "Run dengan 2 orang dan 15 minit. Cari jumlah 12 minit dengan label jelas. Halaman 6."
      ]
    ],
    "check": [
      "The program displays the time until the visitor finishes receiving help.",
      "程序显示来访者完成服务的总时间。",
      "Program memaparkan masa sehingga pelawat selesai mendapat bantuan."
    ],
    "target": "total_print",
    "ref": "print(\"Printing time:\", printing_minutes, \"minutes.\")",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "02.5 · Make: give two advice paths",
      "02.5 · Make 创建：两条建议分支",
      "02.5 · Make: beri dua laluan nasihat"
    ],
    "action": [
      "ADD an if/else decision",
      "添加if/else判断",
      "TAMBAH keputusan if/else"
    ],
    "where": [
      "Below # ADVICE",
      "在# ADVICE下面",
      "Di bawah # ADVICE"
    ],
    "goal": [
      "Advise joining if total time is less than or equal to available time; otherwise advise another time.",
      "总时间小于或等于可用时间时建议排队，否则另约时间。",
      "Nasihat beratur jika jumlah kurang daripada atau sama dengan masa tersedia; selain itu atur masa lain."
    ],
    "steps": [
      [
        "Use total_minutes and minutes_available in your comparison. The reference shows a printing decision: change both names and both actions for your helpdesk.",
        "比较使用total_minutes和minutes_available。示例是打印判断，换成服务台的两个变量和两条行动建议。",
        "Bandingkan total_minutes dengan minutes_available. Contoh keputusan cetakan perlu ditukar nama dan tindakannya."
      ],
      [
        "if and else align at the left. Each print inside them has four spaces. Enter after : indents; after the first print, Enter then Dedent once before else:.",
        "if和else左对齐，内部print前4个空格。冒号后Enter自动缩进；第一条print后Enter，再Dedent一次，再写else:。",
        "if dan else sejajar di kiri. print mempunyai empat ruang. Enter selepas : berinden; selepas print pertama, Enter lalu Dedent sekali sebelum else:."
      ],
      [
        "Paper page 7: run people 2, minutes 15; then people 4, minutes 15. Tick the actual action. Also check people 2, minutes 12 allows joining.",
        "第7页：人数2、分钟15，再人数4、分钟15，勾选实际行动。也检查人数2、分钟12允许排队。",
        "Halaman 7: Run 2 orang/15 minit, kemudian 4 orang/15 minit. Tandakan tindakan sebenar. Semak 2 orang/12 minit boleh beratur."
      ]
    ],
    "check": [
      "Each advice message gives an action and a short reason or next step. Your NEW adviser asks, calculates and advises.",
      "每条建议包括行动及简短原因或下一步。新程序会提问、计算与建议。",
      "Setiap nasihat memberi tindakan serta sebab ringkas atau langkah seterusnya. Penasihat BAHARU meminta input, mengira dan menasihati."
    ],
    "target": "advice",
    "ref": "if printing_minutes <= deadline_minutes:\n    print(\"Print now.\")\nelse:\n    print(\"Print later.\")",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "03 · Your own turn",
      "03 · 个人操作",
      "03 · Giliran sendiri"
    ],
    "action": [
      "CHANGE the existing constant",
      "修改现有常量",
      "UBAH pemalar sedia ada"
    ],
    "where": [
      "MINUTES_PER_PERSON at the top of my_helpdesk.py",
      "my_helpdesk.py顶部的MINUTES_PER_PERSON",
      "MINUTES_PER_PERSON di atas my_helpdesk.py"
    ],
    "goal": [
      "Demonstrate your own change in the SAME adviser. 12 individual marks on paper page 8.",
      "在同一服务台程序展示个人修改。第8页，12分。",
      "Tunjukkan perubahan sendiri dalam penasihat SAMA. Halaman 8, 12 markah individu."
    ],
    "steps": [
      [
        "Your partner pauses. Press Find editing place; change only the constant from 4 to 3. Keep every other line.",
        "同伴暂停帮助。按Find editing place，只把常量4改为3，保留其他行。",
        "Rakan berhenti membantu. Cari tempat sunting; ubah pemalar 4 kepada 3 sahaja. Kekalkan baris lain."
      ],
      [
        "Run with people ahead 1 and available minutes 7. On page 8, record your changed line, actual total and advice. Complete the short calculation and decision frames.",
        "输入人数1、分钟7运行。在第8页记录修改行、实际总时间和建议，完成计算与判断填空。",
        "Run dengan 1 orang dan 7 minit. Halaman 8: catat baris, jumlah dan nasihat sebenar; lengkapkan rangka pengiraan dan keputusan."
      ],
      [
        "Restore the constant to 4 before the next student’s turn. When everyone has finished, select Next step to save this same adviser.",
        "下一位操作前把常量恢复4。每人完成后按Next step保存同一程序。",
        "Pulihkan pemalar kepada 4 sebelum giliran seterusnya. Selepas semua selesai, pilih langkah seterusnya untuk menyimpan penasihat yang sama."
      ]
    ],
    "check": [
      "You changed and explained your adviser. You did not start another program.",
      "已修改并解释同一程序，不是另建程序。",
      "Anda mengubah dan menerangkan penasihat yang sama, tanpa memulakan program lain."
    ],
    "target": "MINUTES_PER_PERSON",
    "ref": "",
    "kind": "edit"
  },
  {
    "task": "create",
    "title": [
      "Save and submit · same adviser",
      "保存并提交 · 同一程序",
      "Simpan dan hantar · penasihat sama"
    ],
    "action": [
      "SAVE the final helpdesk file",
      "保存最终服务台文件",
      "SIMPAN fail meja bantuan akhir"
    ],
    "where": [
      "Download name and Download .py above the editor",
      "编辑器上方Download name及Download .py",
      "Nama muat turun dan Muat turun .py di atas editor"
    ],
    "goal": [
      "Submit your finished adviser and your own named paper. See paper page 9.",
      "提交完成的服务台程序和自己的具名试卷。看第9页。",
      "Hantar penasihat lengkap dan kertas sendiri bernama. Lihat halaman 9."
    ],
    "steps": [
      [
        "Check MINUTES_PER_PERSON is restored to 4. Change Download name to include your class and group names. Press Download .py while my_helpdesk.py is shown.",
        "确认常量恢复4。Download name加入班级与小组姓名，显示my_helpdesk.py时按Download .py。",
        "Pastikan pemalar dipulihkan kepada 4. Masukkan kelas dan nama ahli pada nama muat turun. Tekan Muat turun .py semasa my_helpdesk.py ditunjukkan."
      ],
      [
        "Attach the saved helpdesk .py in Teams and submit. Shared device: one person submits the team file with all names; partners confirm with the teacher.",
        "将服务台.py附到Teams并提交。共享设备由一人提交含全部姓名的文件，其他人向老师确认。",
        "Lampirkan .py meja bantuan dalam Teams dan hantar. Peranti dikongsi: seorang menghantar fail dengan semua nama; ahli lain mengesahkan dengan guru."
      ],
      [
        "Everyone hands in their own named paper. Printing practice does not need to be submitted. iPad: find the file in Files / Downloads and attach from Files in Teams.",
        "每人交自己的具名试卷。打印练习不用提交。iPad在Files / Downloads找到文件，再从Teams附上。",
        "Setiap pelajar menghantar kertas sendiri bernama. Latihan cetakan tidak perlu dihantar. iPad: cari fail di Files / Downloads dan lampirkan melalui Files dalam Teams."
      ]
    ],
    "check": [
      "Your adviser and individual paper are ready for submission.",
      "服务台程序与个人试卷已准备好提交。",
      "Penasihat dan kertas individu sedia dihantar."
    ],
    "target": "",
    "ref": "",
    "kind": "read"
  }
];
const tutors=[
  {
    "target": "MINUTES_PER_PAGE",
    "text": [
      "This named constant stores the minutes needed for one page.",
      "这个常量存每页需要的分钟数。",
      "Pemalar ini menyimpan minit bagi satu halaman."
    ]
  },
  {
    "target": "page_count",
    "text": [
      "This line gives page_count its value: the number of pages. You will replace the fixed value with input.",
      "这一行给page_count赋值：页数。之后用输入替换固定值。",
      "Baris ini memberi nilai page_count: bilangan halaman. Anda mengganti nilai tetap dengan input."
    ]
  },
  {
    "target": "printing_minutes",
    "text": [
      "Python multiplies pages by minutes per page, then stores the answer in printing_minutes.",
      "Python把页数乘每页分钟，再把结果存入printing_minutes。",
      "Python mendarab halaman dengan minit setiap halaman dan menyimpan jawapan dalam printing_minutes."
    ]
  },
  {
    "target": "practice_print",
    "text": [
      "print displays the calculated number in the console.",
      "print在控制台显示计算数字。",
      "print memaparkan nombor dikira dalam konsol."
    ]
  }
];
function defaults(){return {tab:'practice',language:'en',stages:{practice:0,create:6},tutor:0,files:{practice:{code:practice,name:'practice_printing'},create:{code:starter,name:'my_helpdesk'}}};}
function migrate(old){const out=defaults(),a=old?.files?.create,b=old?.files?.practice,f=typeof a?.code==='string'&&a.code.trim()?a:b;out.language=['en','zh','ms'].includes(old?.language)?old.language:'en';if(typeof f?.code==='string'&&f.code.trim()&&f.code.length<=20000){out.legacyWork={code:f.code,name:typeof f.name==='string'?f.name:'earlier_helpdesk'};}return out;}
function target(stage,code,tutor=0){const lines=code.split('\n');let key=stage.target;if(key==='tutor')key=tutors[tutor].target;const assignment=name=>lines.findIndex(l=>new RegExp('^\\s*'+name+'\\s*=').test(l));let n=-1,kind='replace';if(['page_count','MINUTES_PER_PAGE','MINUTES_PER_PERSON','printing_minutes'].includes(key))n=assignment(key);else if(key==='practice_print')n=lines.findIndex(l=>/^\s*print\(/.test(l)&&l.includes('printing_minutes'));else if(['people_ahead','minutes_available','total_minutes'].includes(key)){n=assignment(key);if(n<0){kind='insert';const marker=key==='total_minutes'?'# TOTAL VISIT TIME':'# INPUT QUESTIONS';n=lines.findIndex(l=>l.trim()===marker);if(key==='minutes_available'){const first=assignment('people_ahead');if(first>=0)n=first;}}}else if(key==='total_print'){n=lines.findIndex(l=>/^\s*print\(/.test(l)&&l.includes('total_minutes'));if(n<0){kind='insert';n=assignment('total_minutes');if(n<0)n=lines.findIndex(l=>l.trim()==='# TOTAL VISIT TIME');}}else if(key==='advice'){n=lines.findIndex(l=>/^\s*if\s/.test(l));if(n<0){kind='insert';n=lines.findIndex(l=>l.trim()==='# ADVICE');}}return {line:n+1,kind,start:n<0?-1:lines.slice(0,n).reduce((v,l)=>v+l.length+1,0),end:n<0?-1:lines.slice(0,n).reduce((v,l)=>v+l.length+1,0)+lines[n].length};}
return {practice,starter,stages,tutors,defaults,migrate,target,index:lang=>({en:0,zh:1,ms:2})[lang]??0};
})();
if(typeof module!=='undefined')module.exports=LessonData;
