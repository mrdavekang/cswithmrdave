/* 15 unique, explicitly taught questions. Repetition goal: 50 correct answers. */
window.GAME_REVIEW={goal:50,assignmentUrl:'https://play.blooket.com/play?hwId=6ae434e780592497bc3178ba',setUrl:'https://dashboard.blooket.com/set/6ae433ef06e5602dbefe6b9a',due:'2026-11-13T14:09:00+08:00',questions:[
 {q:'Which brackets make a Python list?',zh:'哪种括号用于创建 Python 列表？',ko:'Python 리스트를 만드는 괄호는?',options:['[ ]','( )','{ }','< >'],answer:0,why:'Square brackets enclose the list elements.'},
 {q:'Which line stores the name Nova as text?',zh:'哪行把 Nova 存为文本？',ko:'Nova를 문자열로 저장하는 줄은?',options:['name = "Nova"','name = Nova','name == "Nova"','name = [Nova]'],answer:0,why:'Text needs quotation marks. = assigns the value.'},
 {q:'What ends a while condition line in Python?',zh:'Python 的 while 条件行以什么结束？',ko:'Python while 조건 줄 끝에 오는 기호는?',options:[':',';',',','.'],answer:0,why:'A colon starts the indented loop body.'},
 {q:'Which instructions repeat inside a while loop?',zh:'哪些指令在 while 循环中重复？',ko:'while 안에서 반복되는 명령은?',options:['The indented instructions below its condition','Every instruction above it','Only the final line of the program','Only instructions containing quotation marks'],answer:0,why:'Indentation identifies the loop body.'},
 {q:'players = ["Nova", "Echo", "Pixel"]. What is players[0]?',zh:'players[0] 是什么？',ko:'players[0]의 값은?',options:['Nova','Echo','Pixel','0'],answer:0,why:'Index 0 selects the first element.'},
 {q:'players = ["Nova", "Echo", "Pixel"]. Which expression reads Pixel?',zh:'哪个表达式读取 Pixel？',ko:'Pixel을 읽는 표현은?',options:['players[2]','players[3]','players[1]','players["Pixel"]'],answer:0,why:'The third element has index 2, because indexing starts at 0.'},
 {q:'A list has four elements. What is its last valid index?',zh:'四个元素的列表，最后一个有效索引是多少？',ko:'원소가 네 개면 마지막 인덱스는?',options:['3','4','5','0'],answer:0,why:'The valid indexes are 0, 1, 2 and 3.'},
 {q:'players = ["Nova", "Echo"]. Then players[1] = "Luna". What is stored?',zh:'执行替换后，列表是什么？',ko:'대입 후 저장된 리스트는?',options:['["Nova", "Luna"]','["Nova", "Echo", "Luna"]','["Luna", "Echo"]','["Nova"]'],answer:0,why:'Replacement changes Echo to Luna without adding an element.'},
 {q:'players = ["Nova", "Echo"]. Then players.append("Orbit"). What is stored?',zh:'执行 append 后，列表是什么？',ko:'append 후 리스트는?',options:['["Nova", "Echo", "Orbit"]','["Orbit", "Nova", "Echo"]','["Nova", "Orbit"]','["Orbit"]'],answer:0,why:'append adds a new element at the end and preserves existing elements.'},
 {q:'players = ["Nova", "Echo", "Pixel"]. What does len(players) return?',zh:'len(players) 返回什么？',ko:'len(players)가 반환하는 값은?',options:['3','2','Pixel','0'],answer:0,why:'len counts elements. It is not the final index.'},
 {q:'position = 0. Which line moves this counter to the next index?',zh:'哪行把计数器移到下一个索引？',ko:'카운터를 다음 인덱스로 옮기는 줄은?',options:['position = position + 1','position = 0','print(position)','players.append(position)'],answer:0,why:'Adding 1 changes 0 to 1, then 1 to 2, and so on.'},
 {q:'There are three players. Why does while position < len(players) stop when position becomes 3?',zh:'position 变为 3 时为何停止？',ko:'position이 3이면 왜 멈추나요?',options:['3 < 3 is false','Index 3 contains a stop message','print always stops a loop','The list automatically becomes empty'],answer:0,why:'The condition becomes false before the program tries to read index 3.'},
 {q:'A list-reading loop keeps printing the first player. Its counter never changes. What should be added inside the loop?',zh:'总显示第一位，计数器不变，循环内应加什么？',ko:'첫 이름만 반복됩니다. 반복문 안에 무엇을 더해야 하나요?',options:['position = position + 1','players = []','position = 0','Another print(players[0])'],answer:0,why:'The counter must move towards the stopping condition.'},
 {q:'players = ["Nova", "Echo"]\nprint(len(players))\nplayers.append("Orbit")\nprint(len(players))\nWhat two numbers appear?',zh:'依次显示哪两个数字？',ko:'차례로 출력되는 두 숫자는?',options:['2 then 3','3 then 3','2 then 2','1 then 2'],answer:0,why:'The first print happens before the addition; the second happens after it.'},
 {q:'players = ["Nova", "Echo"]\nposition = 0\nwhile position < len(players):\n    print(players[position])\n    position = position + 1\nWhat is printed?',zh:'这个程序显示什么？',ko:'이 프로그램의 출력은?',options:['Nova then Echo, each on its own line','Echo then Nova','Nova forever','0 then 1'],answer:0,why:'The loop reads index 0, then index 1, and stops when position reaches 2.'}
]};
const REVIEW_WHY=[
 ['方括号包含列表元素。','대괄호 안에 리스트 원소를 넣습니다.'],
 ['文本需要引号。= 用于赋值。','문자열에는 따옴표가 필요합니다. =는 값을 저장합니다.'],
 ['冒号后开始缩进的循环体。','콜론 뒤에 들여쓴 반복문 본문이 시작됩니다.'],
 ['缩进标明循环中重复执行的指令。','들여쓰기는 반복 실행할 명령을 구분합니다.'],
 ['索引 0 读取第一个元素。','인덱스 0은 첫 원소를 읽습니다.'],
 ['第三个元素的索引是 2，因为索引从 0 开始。','인덱스는 0부터 시작하므로 세 번째 원소는 2입니다.'],
 ['有效索引为 0、1、2、3。','유효한 인덱스는 0, 1, 2, 3입니다.'],
 ['Echo 被 Luna 替换，没有添加元素。','Echo를 Luna로 바꾸며 원소는 추가하지 않습니다.'],
 ['append 在末尾添加，原来的元素保持不变。','append는 끝에 추가하고 기존 원소는 유지합니다.'],
 ['len 计算元素数量，不是最后的索引。','len은 원소 수이며 마지막 인덱스가 아닙니다.'],
 ['每次加 1：0 变为 1，再变为 2。','1을 더하면 0에서 1, 다시 2가 됩니다.'],
 ['读取不存在的索引 3 之前，条件已经变为假。','없는 인덱스 3을 읽기 전에 조건이 거짓이 됩니다.'],
 ['计数器必须逐步接近停止条件。','카운터가 종료 조건에 가까워져야 합니다.'],
 ['第一次在添加前输出，第二次在添加后输出。','처음은 추가 전, 다음은 추가 후의 인원수입니다.'],
 ['循环读取索引 0 和 1，计数器达到 2 时停止。','인덱스 0과 1을 읽고 카운터가 2일 때 끝납니다.']
];
GAME_REVIEW.questions.forEach((q,i)=>{q.whyZh=REVIEW_WHY[i][0];q.whyKo=REVIEW_WHY[i][1];});
