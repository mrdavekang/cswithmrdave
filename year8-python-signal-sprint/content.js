const L=(en,zh,ko)=>({en,zh,ko});
const Q=(title,prompt,source,options,answer,hint,why,visual)=>({kind:"question",title,prompt,source,options,answer,hint,why,visual});
const C=(title,prompt,starter,tests,hint,reference)=>({kind:"code",title,prompt,starter,tests,hint,reference});
const t=(input,output)=>({input,output});
const yes=L("Yes","是","예"),no=L("No","否","아니요"),text=L("Text","文本","문자열"),num=L("Whole number","整数","정수");
const signs=[yes,no],types=[text,num];
const studio='if code == "music":\n    print("Open")\nelse:\n    print("Wait")';
const warm1=[
 Q(L("Text or number?","文本还是整数？","문자열일까요, 정수일까요?"),L('What type is "7"?','"7" 是什么类型？','"7"은 어떤 자료형인가요?'),null,types,0,L("Look at the two quote marks.","看看两个引号。","양옆의 따옴표를 보세요."),L("Quotes make it text.","引号表示文本。","따옴표로 감싸면 문자열이에요."),{kind:"syntax",value:'"7"',art:true}),
 Q(L("Fill the storage box","填写存储框","저장 상자 채우기"),L("What value is stored in sheets?","sheets 存了哪个值？","sheets에 어떤 값이 저장되나요?"),"sheets = 4",null,"4",L("Read the right side of =.","看等号右边。","등호 오른쪽을 보세요."),L("The value 4 is stored under the name sheets.","值 4 存在 sheets 中。","sheets라는 이름에 4를 저장해요."),{kind:"store",before:"sheets",after:"4"}),
 Q(L("Change a value","更新一个值","값 바꾸기"),L("What is the new value of batteries?","batteries 的新值是什么？","batteries의 새 값은 무엇인가요?"),"batteries = batteries - 2",null,"7",L("Start with 9, then subtract 2.","从 9 开始，减去 2。","9에서 2를 빼세요."),L("Python calculates 9 − 2, then stores 7.","Python 先算 9 − 2，再存入 7。","9 − 2를 계산한 뒤 7을 저장해요."),{kind:"store",before:"9",after:"7"}),
 Q(L("Read the console","读取输出","출력 창 읽기"),L("What does print(zone) display?","print(zone) 显示什么？","print(zone)은 무엇을 출력하나요?"),'zone = "Studio"\nprint(zone)',["zone","Studio","print"],1,L("Look at the value stored under zone.","看看 zone 存的值。","zone에 저장된 값을 보세요."),L("The value is Studio. The variable is named zone.","变量名是 zone，值是 Studio。","변수 이름은 zone이고 값은 Studio예요."),{kind:"output",value:"Studio"}),
 Q(L("Find the variable name","找出变量名","변수 이름 찾기"),L("Which part is the variable name?","哪部分是变量名？","어느 부분이 변수 이름인가요?"),"trays = 6",["trays","6"],0,L("The name is to the left of =.","变量名在等号左边。","이름은 등호 왼쪽에 있어요."),L("trays is the name; 6 is the value.","trays 是名字，6 是值。","trays는 이름, 6은 값이에요."),{kind:"syntax",value:"trays = 6"}),
 Q(L("Ask the user","向用户提问","사용자에게 묻기"),L("Which instruction waits for you to type?","哪个指令等待你输入？","어떤 명령이 입력을 기다리나요?"),null,["print()","input()"],1,L("Think of the keyboard, not the screen.","想想键盘，不是屏幕。","화면이 아니라 키보드를 생각해 보세요."),L("input() receives what you type.","input() 接收你输入的内容。","input()은 입력한 내용을 받아요."),{kind:"receive"}),
 Q(L("What comes in?","收到的是什么？","어떤 자료형으로 입력될까요?"),L("The user types 5. What type does input() return?","用户输入 5。input() 返回什么类型？","5를 입력하면 input()은 어떤 자료형을 반환하나요?"),'entry = input("Sheets? ")',types,0,L("Nothing has converted the input yet.","还没有把输入转换成数字。","아직 입력값을 변환하지 않았어요."),L("input() returns text, even for digits.","即使输入数字，input() 也返回文本。","숫자를 입력해도 input()은 문자열을 반환해요."),{kind:"receive"}),
 Q(L("Turn text into a number","把文本转换成数字","문자열을 숫자로 바꾸기"),L('Which operation turns "5" into 5?','哪个操作把 "5" 变成 5？','어떤 동작이 "5"를 숫자 5로 바꾸나요?'),null,["print()","int()"],1,L("One operation converts; the other only displays.","一个转换，另一个只显示。","하나는 변환하고, 다른 하나는 출력만 해요."),L("int() converts whole-number text to an integer.","int() 把整数文本变成整数。","int()는 정수 형태의 문자열을 정수로 바꿔요."),{kind:"convert"}),
 Q(L("Repeat the text","重复文本","문자열 반복하기"),L("What appears in the console?","输出窗口会显示什么？","출력 창에는 무엇이 표시되나요?"),'print("4" * 2)',["8","44","6"],1,L("The 4 is in quotes.","4 带着引号。","4가 따옴표 안에 있어요."),L("Multiplying text by 2 repeats it twice.","文本乘以 2 会重复两次。","문자열에 2를 곱하면 두 번 반복돼요."),{kind:"output",value:"44"}),
 Q(L("Which runs first?","哪步先执行？","어느 단계가 먼저 실행되나요?"),L("Which action happens first?","哪个动作最先发生？","어떤 동작이 먼저 일어나나요?"),"clips = 3\nprint(clips)",[L("Store the value","存储值","값 저장"),L("Display the value","显示值","값 출력")],0,L("Read from line 1 down.","从第 1 行往下读。","1번째 줄부터 아래로 읽으세요."),L("Python stores 3 before it prints it.","Python 先存 3，再显示它。","Python은 3을 저장한 뒤 출력해요.")),
];
const W=(title,prompt,src,options,key,hint,why,visual)=>Q(title,prompt,src,options,key,hint,why,visual);
const matchHint=L("Compare the entered and expected values.","比较实际输入和要求输入。","입력값과 기대값을 비교하세요.");
const indentHint=L("Look at the line below the condition.","看条件下面的那一行。","조건 아래 줄을 보세요.");
const warm2=[
 W(L("Do they match?","匹配吗？","일치하나요?"),L("Does music match music?","music 和 music 匹配吗？","music과 music은 같나요?"),'code == "music"',signs,0,matchHint,L("Both values are music.","两个值都是 music。","두 값이 모두 music이에요."),{kind:"branch",input:"music",test:true}),
 W(L("Pick the path","选择路径","경로 선택"),L("The input is art. Which path runs?","输入 art。执行哪条路径？","입력값은 art예요. 어느 경로가 실행되나요?"),'code == "music"',["if","else"],1,matchHint,L("art does not match music, so else runs.","art 和 music 不同，执行 else。","art와 music이 달라서 else가 실행돼요."),{kind:"branch",input:"art"}),
 W(L("Which message?","哪条消息？","어떤 메시지일까요?"),L("The input is art. What is printed?","输入 art。输出什么？","art를 입력하면 무엇이 출력되나요?"),studio,["Open","Wait"],1,matchHint,L("else runs and prints Wait.","执行 else 并输出 Wait。","else가 실행되어 Wait를 출력해요."),{kind:"branch",input:"art",value:"Wait"}),
 W(L("Try the other input","换一个输入","다른 입력값으로"),L("The input is music. What is printed?","输入 music。输出什么？","music을 입력하면 무엇이 출력되나요?"),studio,["Wait","Open"],1,matchHint,L("The values match, so if runs and prints Open.","值匹配，所以执行 if 并输出 Open。","두 값이 같아 if가 실행되고 Open을 출력해요."),{kind:"branch",input:"music",value:"Open"}),
 W(L("Which symbol checks?","哪个符号检查相等？","같은지 확인하는 기호는?"),L("Choose the symbol that checks if the values match.","选择检查两个值是否相等的符号。","두 값이 같은지 비교하는 기호를 고르세요."),'code □ "music"',["=","=="],1,L("One sign stores; two compare.","一个等号赋值，两个等号比较。","등호 하나는 저장, 두 개는 비교예요."),L("== compares for equality.","== 比较是否相等。","==는 같은지 비교해요."),{kind:"syntax",value:"=     =="}),
 W(L("Complete the line","补全这一行","줄 끝 채우기"),L("What goes in the blank?","空格里应填什么？","빈칸에 무엇이 들어가나요?"),'if code == "music" □',[":",",","."],0,L("Look for the punctuation that opens an indented block.","哪个标点后面接缩进代码？","들여쓰기 블록을 여는 기호를 찾으세요."),L("A colon ends the if header.","if 行末要用冒号。","if 줄 끝에는 콜론이 필요해요.")),
 W(L("Move one line right","把一行向右缩进","한 줄 들여쓰기"),L("Which line needs indentation?","哪一行需要缩进？","어느 줄을 들여써야 하나요?"),'1  if code == "music":\n2  print("Open")',["1","2"],1,indentHint,L("Indent the print line to put it inside if.","缩进 print 行，把它放进 if。","print 줄을 들여써야 if 안에 들어가요."),{kind:"indent",fix:true}),
 W(L("Does the limit count?","包含边界值吗？","경계값도 포함될까요?"),L("seats is 6. Is the rule true?","seats 是 6。条件为真吗？","seats가 6일 때 조건이 참인가요?"),"seats <= 6",signs,0,L("Look for the equals part of the sign.","看符号是否含等号。","기호에 등호가 있는지 보세요."),L("<= includes 6 itself.","<= 包含 6。","<=는 6도 포함해요."),{kind:"boundary",inclusive:true}),
 W(L("Change one symbol","改一个符号","기호 하나 바꾸기"),L("seats is still 6. Is this rule true?","seats 仍是 6。这个条件为真吗？","seats는 여전히 6이에요. 이 조건이 참인가요?"),"seats < 6",signs,1,L("This sign does not include equality.","这个符号不包含等于。","이 기호는 같은 값은 포함하지 않아요."),L("6 is not less than 6.","6 不小于 6。","6은 6보다 작지 않아요."),{kind:"boundary",inclusive:false}),
 W(L("What always prints?","什么总会输出？","항상 무엇이 출력될까요?"),L("Which message prints whichever branch runs?","不管走哪个分支，哪条消息都会输出？","어느 분기든 항상 출력되는 메시지는 무엇인가요?"),studio+'\nprint("Done")',["Open","Wait","Done"],2,L("Look for the print line back at the left edge.","找回到左侧、没有缩进的 print 行。","왼쪽 끝에 있는 print 줄을 찾으세요."),L("Done is outside both branches.","Done 在两个分支之外。","Done은 두 분기 밖에 있어요."),{kind:"indent",fix:false,value:"Done"}),
];
const follow=L("Read the lines from top to bottom. Check the current value before the next line.","从上到下读代码。读下一行前先检查当前值。","위에서 아래로 읽으세요. 다음 줄로 가기 전에 현재 값을 확인하세요.");
const cond=L("Work out whether the condition is true. Then follow only its branch.","先判断条件真假，再走相应分支。","조건이 참인지 판단한 뒤 해당 분기만 따라가세요.");
const stored=L("Look for the value without quotes around its variable name.","输出变量的值时，变量名不要加引号。","변수의 값을 출력할 때 변수 이름에 따옴표를 붙이지 마세요.");
const io=L("Read the input, calculate with its number, then print the answer.","先读取输入，再用它计算，最后输出答案。","먼저 입력을 받고 숫자로 계산한 뒤 결과를 출력하세요.");
const m=(name,zh,ko,src,opts,key,h=follow)=>Q(null,L(name,zh,ko),src,opts,key,h);
const typing=L("Copy the example exactly. Press Enter to start a new line.","照着范例输入。按回车换行。","예시를 그대로 입력하세요. Enter로 줄을 바꾸세요.");
const task1=[
 C(L("Show the kit count","输出套装数量","키트 개수 출력"),L("Add one line that displays the stored number. Press Run Python.","加一行，显示变量存储的数字。按运行 Python。","저장된 숫자를 출력하는 한 줄을 추가하세요. Python 실행을 누르세요."),"kits = 3\n", [t([],["3"])],stored,'badges = 2\nprint(badges)'),
 m("What is stored after the update?","更新后存了哪个值？","값을 바꾼 뒤 무엇이 저장되나요?","charge = 12\ncharge = charge - 5",["12","5","7"],2),
 m("Which line displays the stored name, not the word room?","哪行显示存储的名字，而不是 room 这个词？","room이라는 글자 대신 저장된 이름을 출력하는 줄은?",'room = "Workshop"',['print("room")','print(room)','input(room)'],1,stored),
 C(L("Repair the tray calculator","修理托盘计算器","트레이 계산기 고치기"),L("Make the program multiply the number of trays by 4. Input 3 should display 12.","修改程序：托盘数乘以 4。输入 3 应输出 12。","트레이 개수에 4를 곱하도록 고치세요. 3을 입력하면 12가 나와야 해요."),'trays = input("Trays? ")\nprint(trays * 4)',[t(["3"],["12"]),t(["5"],["20"])],io,'bags = int(input("Bags? "))\nprint(bags * 2)'),
 C(L("Power up the controllers","给控制器配电池","컨트롤러에 배터리 공급"),L("Read a whole number of controllers. Each needs 2 batteries. Display the total batteries.","输入控制器数量（整数）。每台需要 2 节电池。输出电池总数。","컨트롤러 개수를 정수로 입력받으세요. 한 대에 배터리 2개가 필요해요. 총개수를 출력하세요."),'# Write your code below\n',[t(["4"],["8"]),t(["7"],["14"])],io,'sheets = int(input("Sheets? "))\nprint(sheets * 3)'),
 m("What does the second print display?","第二次 print 显示什么？","두 번째 print는 무엇을 출력하나요?",'print("6" * 2)\nprint(6 * 2)',["66","62","12"],2),
 m("Give the value of cups at the end.","填写 cups 最后的值。","마지막 cups의 값을 쓰세요.","cups = 5\ncups = cups + 4\ncups = cups - 2",null,"7"),
 m("Which two values are printed, in order?","按顺序输出哪两个值？","어떤 값 두 개가 순서대로 출력되나요?","passes = 3\nprint(passes)\npasses = passes + 5\nprint(passes)",["3 → 8","8 → 3","3 → 5"],0),
 C(L("Find the spelling bug","找出拼写错误","이름 오타 찾기"),L("Fix the name so the console displays 5.","修正名字，使输出为 5。","이름을 고쳐 5가 출력되게 하세요."),"tickets = 5\nprint(ticket)",[t([],["5"])],L("The same name must be used in both lines.","两行要使用同一个名字。","두 줄에 같은 이름을 써야 해요.")),
 m("Put the lines in the order Python needs.","选择正确的代码行顺序。","필요한 실행 순서를 고르세요.",'A  print(total)\nB  pages = int(input("Pages? "))\nC  total = pages * 3\nD  total = total + 2',["B → C → D → A","C → B → A → D","B → D → C → A"],0,io),
 C(L("Test two inputs","测试两个输入","입력 두 가지 테스트"),L("Run with input 2, then 6. Use Check work after trying both.","先输入 2 运行，再输入 6 运行。之后按检查。","2로 실행한 뒤 6으로 실행하세요. 둘 다 확인한 뒤 검사하세요."),'stands = int(input("Stands? "))\nprint(stands * 3)',[t(["2"],["6"]),t(["6"],["18"])],io),
 C(L("Print after the change","更新后再输出","바꾼 뒤 출력하기"),L("Move one line so the program prints the updated stock, not the original stock.","移动一行，让程序输出更新后的库存。","한 줄을 옮겨 처음 재고가 아니라 바뀐 재고를 출력하세요."),"stock = 14\nprint(stock)\nstock = stock - 3",[t([],["11"])],follow),
 m("The trace says 3 → 9 → 8. At which line does it first go wrong?","跟踪结果写成 3 → 9 → 8。哪行最先出错？","추적값이 3 → 9 → 8이라고 적혀 있어요. 몇 번째 줄에서 처음 틀렸나요?","1  count = 3\n2  count = count * 2\n3  count = count - 1",["1","2","3"],1),
 C(L("Pack supplies plus spares","准备物品与备用件","준비물과 여분 챙기기"),L("Read the number of tables. Each needs 3 clips. Add 2 spare clips, then display the total.","输入桌数。每张桌子需 3 个夹子，再加 2 个备用。输出总数。","책상 개수를 입력받으세요. 한 책상에 클립 3개와 전체 여분 2개를 더해 총수를 출력하세요."),'tables = int(input("Tables? "))\n',[t(["2"],["8"]),t(["5"],["17"])],io),
 C(L("Show both totals","输出两个总数","두 합계 출력하기"),L("Read the number of stands. Each needs 4 clips. Print the required clips, then print the total with 3 spares on a second line.","输入支架数。每个需 4 个夹子。先输出所需数量，再另起一行输出加 3 个备用件的总数。","받침대 개수를 입력받으세요. 한 개에 클립 4개가 필요해요. 필요한 개수를 출력한 뒤 여분 3개를 더한 합계를 다음 줄에 출력하세요."),'stands = int(input("Stands? "))\n',[t(["2"],["8","11"]),t(["4"],["16","19"])],io),
];
const task2=[
 C(L("Run both studio paths","运行两个工作室分支","스튜디오의 두 분기 실행"),L("Run once with music, then once with art. Look for the different messages.","先输入 music，再输入 art，分别运行。比较两条消息。","music을 입력해 실행한 뒤 art로 다시 실행하세요. 서로 다른 메시지를 보세요."),'code = input("Studio code? ")\n'+studio,[t(["music"],["Open"]),t(["art"],["Wait"])],cond),
 m("The user enters green. What prints?","用户输入 green。输出什么？","green을 입력하면 무엇이 출력되나요?",'colour = input("Colour? ")\nif colour == "green":\n    print("Go")\nelse:\n    print("Pause")',["Pause","Go"],1,cond),
 C(L("Repair the signal","修复信号","신호 코드 고치기"),L("Fix the if line and the next line so typing on displays Lit, otherwise Dark.","修正 if 行和下一行。输入 on 输出 Lit，否则输出 Dark。","if 줄과 다음 줄을 고치세요. on을 입력하면 Lit, 아니면 Dark가 나와야 해요."),'switch = input("Switch? ")\nif switch == "on"\nprint("Lit")\nelse:\n    print("Dark")',[t(["on"],["Lit"]),t(["off"],["Dark"])],indentHint,'if key == "A":\n    print("Open")'),
 C(L("Build the library kiosk","编写图书馆终端","도서관 키오스크 만들기"),L("Ask for a word. If it is return, display Use slot. Otherwise display Ask staff. Run both paths.","输入一个词。若为 return，输出 Use slot；否则输出 Ask staff。测试两个分支。","단어를 입력받으세요. return이면 Use slot, 아니면 Ask staff를 출력하세요. 두 분기를 모두 실행하세요."),'word = input("Word? ")\n',[t(["return"],["Use slot"]),t(["help"],["Ask staff"])],cond,'if colour == "green":\n    print("Go")\nelse:\n    print("Pause")'),
 m("Which line compares without storing a new value?","哪行进行比较而不存储新值？","새 값을 저장하지 않고 비교하는 줄은?",'mode = "quiet"',['mode = "quiet"','mode == "quiet"','print(mode)'],1),
 m("For seats = 5, 6 and 7, which pass?","seats 为 5、6、7 时，哪些符合条件？","seats가 5, 6, 7일 때 어떤 값이 조건을 만족하나요?","seats <= 6",["5 and 6","6 and 7","5 and 7"],0,cond),
 m("Which value makes the two rules behave differently?","哪个值让这两个条件的结果不同？","어떤 값에서 두 조건의 결과가 달라지나요?","space < 4\nspace <= 4",["3","4","5"],1,cond),
 m("With key B, which messages appear, in order?","输入 B，按什么顺序输出？","B를 입력하면 어떤 메시지가 순서대로 출력되나요?",'key = "B"\nif key == "A":\n    print("Left")\nelse:\n    print("Right")\nprint("Ready")',["Ready → Right","Right → Ready","Left → Ready"],1,cond),
 C(L("Move the bonus message","移动奖励消息","보너스 메시지 옮기기"),L("Move the Bonus line so it prints only after Pass, not after Retry.","移动 Bonus 行，使它只在 Pass 后输出，不在 Retry 后输出。","Bonus 줄을 옮겨 Pass 뒤에만 출력되고 Retry 뒤에는 나오지 않게 하세요."),'answer = input("Letter? ")\nif answer == "C":\n    print("Pass")\nelse:\n    print("Retry")\nprint("Bonus")',[t(["C"],["Pass","Bonus"]),t(["D"],["Retry"])],indentHint),
 C(L("Fix a reversed rule","修复反向规则","뒤바뀐 규칙 고치기"),L("A lift can take 4 people or fewer. Correct the rule. Test 4 and 5.","电梯最多容纳 4 人。修正规则并测试 4 和 5。","승강기는 4명 이하만 탈 수 있어요. 규칙을 고치고 4와 5를 테스트하세요."),'people = int(input("People? "))\nif people > 4:\n    print("Enter")\nelse:\n    print("Wait")',[t(["4"],["Enter"]),t(["5"],["Wait"]),t(["2"],["Enter"])],cond),
];
const extensions=[
 m("With key B, which version prints Done?","key 为 B 时，哪个版本会输出 Done？","key가 B일 때 어느 버전이 Done을 출력하나요?",'A                     B\nif key == "A":        if key == "A":\n    print("Open")         print("Open")\n    print("Done")     print("Done")',["A","B","Both"],1,cond),
 m("Which input proves the rule is wrong? The tray should hold 8 items or fewer.","托盘最多放 8 件。哪个输入能证明规则错误？","트레이는 8개 이하를 담을 수 있어요. 어떤 입력이 규칙의 오류를 보여 주나요?","items < 8",["7","8","9"],1,cond),
 C(L("Repair the kiosk input","修理终端输入","키오스크 입력 고치기"),L("Fix the input so the comparison works. Test a number on either side of 5.","修正输入，让比较能运行。测试一个小于 5 的数和一个大于 5 的数。","비교가 되도록 입력을 고치세요. 5보다 작은 수와 큰 수를 각각 테스트하세요."),'slots = input("Slots? ")\nif slots < 5:\n    print("Space")\nelse:\n    print("Full")',[t(["3"],["Space"]),t(["7"],["Full"]),t(["5"],["Full"])],io),
 C(L("Reverse the condition","反转条件","조건 뒤집기"),L("Use != instead of == and swap the messages. Keep the same outputs for both inputs.","用 != 替换 ==，再交换两条消息。两种输入的输出应保持不变。","== 대신 !=를 쓰고 두 메시지의 위치를 바꾸세요. 각 입력의 결과는 그대로여야 해요."),'command = input("Command? ")\nif command == "help":\n    print("Ask me")\nelse:\n    print("Keep going")',[t(["help"],["Ask me"]),t(["start"],["Keep going"])],cond),
 C(L("Design a help desk","设计服务台","안내 데스크 만들기"),L("Make a desk that sends people to Lab for the word code and to Office for any other word. Ask a partner to predict both results.","输入 code 时输出 Lab，输入其他词时输出 Office。请同伴预测两种结果。","code를 입력하면 Lab, 다른 단어면 Office를 출력하세요. 짝에게 두 결과를 예상해 달라고 하세요."),'request = input("Request? ")\n',[t(["code"],["Lab"]),t(["art"],["Office"])],cond),
];
const starter=[
 m('What type is "12"?','"12" 是什么类型？','"12"는 어떤 자료형인가요?',null,types,0,L("Look at the quote marks.","看看引号。","따옴표를 보세요.")),
 m("What appears on screen?","屏幕上显示什么？","화면에 무엇이 출력되나요?","stars = 9\nstars = stars - 1\nprint(stars)",["9","8","1"],1),
 m("What does index 1 retrieve?","索引 1 取出什么？","인덱스 1에서 무엇을 읽나요?",'icons = ["sun", "moon", "star"]',["sun","moon","star"],1,L("Index 0 is the first position.","索引 0 是第一个位置。","첫 번째 위치는 인덱스 0이에요.")),
];
const plenary=[
 m("What is displayed at the end?","最后输出什么？","마지막에 무엇을 출력하나요?","minutes = 11\nminutes = minutes + 4\nprint(minutes)",["11","15","7"],1),
 m("What prints if the entered word is blue?","输入 blue 时输出什么？","blue를 입력하면 무엇이 출력되나요?",'if word == "red":\n    print("Stop")\nelse:\n    print("Go")',["Stop","Go"],1,cond),
 m("Which test value exposes the difference?","哪个测试值能显示差异？","어느 테스트 값에서 차이가 드러나나요?","weight < 20\nweight <= 20",["19","20","21"],1,cond),
];
const review=[
 ["After batteries = 12 and batteries = batteries - 4, what is stored?",["12","8","16","4"],1],
 ['What does print("3" * 2) display?',['6','32','33','5'],2],
 ['After entry = input("Code: "), the user types 25. What type is entry?',['String','Integer','Boolean','List'],0],
 ['What does int("15") - 2 evaluate to?',['152','17','15','13'],3],
 ['If zone = "Studio", what does print("zone") display?',['Studio','zone','"Studio"','Nothing'],1],
 ["Which line displays the value stored in ticket?",['print("ticket")','input(ticket)','print(ticket)','ticket = "print"'],2],
 ['Which comparison is true when mode holds "quiet"?',['mode != "loud"','mode == "loud"','mode != "quiet"','mode == "Quiet"'],0],
 ["A bag can hold fewer than 9 items. Which condition matches?",['items <= 9','items > 9','items == 9','items < 9'],3],
 ['If signal == "blue" is false, which part runs in a simple if/else?',['Both branches','The else branch','The if branch','Neither branch'],1],
 ['Which value makes level <= 5 true but level < 5 false?',['4','6','5','0'],2],
 ['A print() line sits after both branches with no indentation. When does it run?',['Only when true','Only when false','Never','After either branch'],3],
 ['A program runs but adds one ticket when it should subtract one. What kind of error is this?',['Runtime','Logic','Syntax','No error'],1],
 ['Which fix does if colour == "green" need before its indented body?',['Add a comma','Remove the quotes','Add a colon','Replace == with ='],2],
 ['A program defines total but later runs print(totals). What should you check first?',['The input value','The variable spelling','The comparison operator','The output colour'],1],
 ['Which pair tests both paths of if key == "A"?',['A and A','B and C','A and B','C and C'],2],
];
const reviewLocal=[
 L("", "batteries 先存 12，再减 4。现在存多少？","batteries에 12를 저장하고 4를 빼면 얼마인가요?"),
 L("",'print("3" * 2) 输出什么？','print("3" * 2)는 무엇을 출력하나요?'),
 L("",'用户在 input() 输入 25。entry 是什么类型？','input()에서 25를 입력하면 entry는 어떤 자료형인가요?'),
 L("",'int("15") - 2 的结果是什么？','int("15") - 2의 결과는 무엇인가요?'),
 L("",'zone = "Studio" 时，print("zone") 输出什么？','zone = "Studio"일 때 print("zone")은 무엇을 출력하나요?'),
 L("","哪行输出 ticket 存储的值？","어느 줄이 ticket에 저장된 값을 출력하나요?"),
 L("",'mode 为 "quiet" 时，哪个比较为真？','mode가 "quiet"이면 어느 비교가 참인가요?'),
 L("","袋子只能装少于 9 件物品。哪个条件符合？","가방에 물건을 9개 미만으로 담을 수 있어요. 맞는 조건은?"),
 L("",'signal == "blue" 为假时，哪个分支执行？','signal == "blue"가 거짓이면 어느 분기가 실행되나요?'),
 L("","哪个值让 level <= 5 为真、level < 5 为假？","level <= 5는 참이고 level < 5는 거짓이 되는 값은?"),
 L("","不缩进的 print() 在两个分支之后。什么时候执行？","두 분기 뒤의 들여쓰기 없는 print()는 언제 실행되나요?"),
 L("","程序能运行，却加了一张票而不是减去。这是什么错误？","프로그램은 실행되지만 표 한 장을 빼는 대신 더해요. 어떤 오류인가요?"),
 L("",'if colour == "green" 的行末要补什么？','if colour == "green" 줄 끝에 무엇이 필요한가요?'),
 L("","定义了 total，却执行 print(totals)。先检查什么？","total을 만들었는데 print(totals)를 실행해요. 무엇부터 확인하나요?"),
 L("",'哪一对输入能测试 if key == "A" 的两个分支？','어느 입력값 쌍이 if key == "A"의 두 분기를 테스트하나요?'),
];
const reviewChoices={
 2:[L("String","字符串","문자열"),L("Integer","整数","정수"),L("Boolean","布尔值","불리언"),L("List","列表","리스트")],
 8:[L("Both branches","两个分支","두 분기 모두"),L("The else branch","else 分支","else 분기"),L("The if branch","if 分支","if 분기"),L("Neither branch","都不执行","어느 쪽도 아님")],
 10:[L("Only when true","仅为真时","참일 때만"),L("Only when false","仅为假时","거짓일 때만"),L("Never","从不","실행 안 함"),L("After either branch","任一分支之后","어느 분기 뒤에나")],
 11:[L("Runtime","运行时","실행 중"),L("Logic","逻辑","논리"),L("Syntax","语法","문법"),L("No error","没有错误","오류 없음")],
 12:[L("Add a comma","加逗号","쉼표 추가"),L("Remove the quotes","去掉引号","따옴표 제거"),L("Add a colon","加冒号","콜론 추가"),L("Replace == with =","把 == 改成 =","==를 =로 변경")],
 13:[L("The input value","输入值","입력값"),L("The variable spelling","变量拼写","변수 이름의 철자"),L("The comparison operator","比较符号","비교 기호"),L("The output colour","输出颜色","출력 색")],
};
const drills=[
 {title:L("Words","单词","단어"),src:"signal ready studio"},
 {title:L("Store + print","赋值与输出","저장과 출력"),src:'station = "Lab"\nprint(station)'},
 {title:L("Input + update","输入与更新","입력과 값 바꾸기"),src:'pages = int(input("Pages? "))\npages = pages - 1\nprint(pages)'},
 {title:L("Comparisons","比较符号","비교 기호"),src:'code == "A"\ncode != "B"\nseats < 6\nseats <= 6\nseats > 2\nseats >= 2'},
 {title:L("if / else","if / else 分支","if / else 분기"),src:'if code == "A":\n    print("Open")\nelse:\n    print("Wait")',indent:true},
];
const demos=[
 {kind:"demo",title:L("Type and run: follow a value","输入并运行：跟踪一个值","입력하고 실행: 값 따라가기"),prompt:L("Predict the output for 3 sheets. Run with 3, then run again with 5.","先预测 3 张纸的输出。输入 3 运行，再输入 5 运行。","종이 3장의 결과를 예상하세요. 3으로 실행한 뒤 5로 다시 실행하세요."),starter:'sheets = int(input("How many sheets? "))\nstickers = sheets * 4\nstickers = stickers - 1\nprint(stickers)',tests:[t(["3"],["11"])],reference:L("Read line by line: 3 → 12 → 11. With 5, you should get 19.","逐行读取：3 → 12 → 11。输入 5 时结果是 19。","한 줄씩 읽으세요: 3 → 12 → 11. 5를 입력하면 19가 나와요."),visual:{kind:"store",before:"12",after:"11"}},
 {kind:"demo",title:L("Type and run: follow the branch","输入并运行：跟踪一个分支","입력하고 실행: 분기 따라가기"),prompt:L("Predict both messages, then run with camera and tripod. Find the line that ran each time.","先预测两条消息，再分别输入 camera 和 tripod 运行。找出每次执行的行。","두 메시지를 예상한 뒤 camera와 tripod로 각각 실행하세요. 매번 실행된 줄을 찾으세요."),starter:'request = input("What do you need? ")\nif request == "camera":\n    print("Collect from shelf A")\nelse:\n    print("Ask at the desk")',tests:[t(["camera"],["Collect from shelf A"])],reference:L("One branch runs for each input. tripod should display Ask at the desk.","每次输入只执行一个分支。输入 tripod 应显示 Ask at the desk。","입력할 때마다 분기 하나만 실행돼요. tripod를 입력하면 Ask at the desk가 나와요.")},
];
