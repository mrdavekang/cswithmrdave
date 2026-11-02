/* Student lesson content. Discussion answers live in an encrypted teacher bundle. */
window.LESSON = {
  id: 'year11-fitness-preparation-v1',
  title: 'Understanding the fitness program',
  topic: 'Paper 1: records, files and subroutines',
  wagba: 'Read unfamiliar Python and explain how the fitness program moves data between records, lists and a text file.',
  keywords: [['record','记录'],['attribute','属性'],['subroutine','子程序'],['parameter','参数'],['return value','返回值'],['append','追加']],
  challenge: 'Explain why loading the same unchanged file twice does not double the number of records in ActivityLog.',
  definition: 'Amazing Learning happens when we practice, try hard and use good struggle to get better.',
  stages: [
    {id:'setup',label:'Start here',time:'0–5 min'},
    {id:'starter',label:'Do Now',time:'0–5 min'},
    {id:'learning',label:'Types of learning',time:'5–7 min'},
    {id:'teach1',label:'Reading + teaching 1',time:'7–14 min'},
    {id:'task1',label:'Main Task 1',time:'14–27 min'},
    {id:'teach2',label:'Reading + teaching 2',time:'27–34 min'},
    {id:'task2',label:'Main Task 2',time:'34–52 min'},
    {id:'pitstop',label:'Learning Pitstop',time:'52–56 min'},
    {id:'extension',label:'Extension',time:'If ready'},
    {id:'finish',label:'Plenary + submit',time:'56–60 min'}
  ],
  readings: {
    teach1: {
      title:'Reading the unfamiliar syntax',
      paragraphs:[
        'The fitness program stores a person’s details and their exercise activities. A record keeps related fields about one item together. In this Python program, the Exercise class provides a way to organise an activity record. An object created from that class holds its own attribute values, including Type, Duration and Distance. An attribute is a named value belonging to an object. Activity.Duration refers to the Duration attribute of the object named Activity.',
        'Activity = Exercise() creates a new object. Python calls __init__ to give its attributes starting values. Inside that routine, self refers to the object being initialised. For example, self.Duration = 0 gives this object a starting duration of zero. A later assignment such as Activity.Duration = 12 replaces that attribute’s value. Reading this code does not require you to design a new object-oriented system. Today you need to recognise the structure and follow the values.',
        'A format string controls the appearance of output. In "{:.2f}".format(Distance), .2f requests two decimal places. The result is a string, so a stored number such as 6.247 can appear as 6.25 without changing Distance itself. In the skeleton, >10 also right-aligns a value in a field at least ten characters wide. Indentation, quotation marks and capital letters matter in Python. Predict a small example’s output, run it, then explain any difference. Keep these experiments in skills_practice.py, separate from the skeleton.'
      ],
      zh:'先把一个对象看成一条记录。属性保存这条记录的各项数据。self 指当前对象，__init__ 设置初始值。格式化改变显示方式，但不会自动改变原来的数值。',
      check:'As you read, find the sentence that explains Activity.Duration. Then point to the assignment that creates an object.',
      reference:'OxfordAQA 9210: 3.2.6 data structures and 3.2.8 string-handling operations.'
    },
    teach2: {
      title:'Following the program and its data',
      paragraphs:[
        'A subroutine is a named section of code that performs a particular task. A call transfers control to that subroutine. Parameters receive values supplied by the caller, and a return statement sends a result back. Main coordinates the fitness program. It creates the default person, starts ActivityLog as an empty list and repeatedly shows a menu. DisplayMenu prints the options. GetChoice returns the user’s choice. Main then checks that choice and calls the selected subroutine.',
        'LoadActivity opens activity.txt in read mode, "r". Each line represents one activity. readline() obtains a line of text, and split(",") separates its fields into a list indexed from zero. At this point the fields are strings. The program uses int(...) and float(...) to convert selected fields into numbers. It stores the values in a new Exercise object and checks whether Activity.PersonID matches Individual.ID. Only matching records enter this person’s ActivityLog. A record for another person can be valid even though this load excludes it.',
        'AddActivity follows a different route. Input subroutines return values for a new activity’s attributes. The program then appends the object to ActivityLog and calls AppendActivityToFile to save a text record. A list in memory and a saved file serve different purposes. The running list is lost when the application closes, whereas the text file remains available. File mode "a" appends without replacing existing contents. Today you will run only the viewing and loading route. Study the adding route in the code without selecting option 3, so the shared practice data stays unchanged.'
      ],
      zh:'Main 根据菜单选择调用子程序。文件中的一行先拆分成字符串，再把指定字段转换成数字。程序只把当前用户的记录加入 ActivityLog。内存中的列表与保存在文件中的记录不同。',
      check:'Explain to a partner why a record with a different person ID is excluded. Is it necessarily invalid?',
      reference:'OxfordAQA 9210: 3.2.6 data structures, 3.2.7 file handling and 3.2.10 subroutines.'
    }
  },
  slides: [
    {id:'records',set:1,title:'One activity record',asset:'assets/01_activity_record.png',alt:'Complete Exercise class example beside the resulting activity attributes',
      focus:'A class organises the fields. An object holds one activity’s values.',
      zh:'类说明记录的结构；对象保存一条具体记录的属性值。',
      question:'Which value would change if we ran Activity.Duration = 20? Which values would stay the same?',
      questionZh:'如果执行 Activity.Duration = 20，哪个值会改变？哪些值保持不变？'},
    {id:'initialise',set:1,title:'Creating and updating an object',
      focus:'Exercise() creates the object. __init__ gives its attributes starting values.',
      zh:'创建对象时，__init__ 设置初始值；self 指当前正在初始化的对象。',
      code:'class Exercise:\n    def __init__(self):\n        self.Type = ""\n        self.Duration = 0\n\nActivity = Exercise()\nActivity.Type = "Cycling"\nActivity.Duration = 12',
      question:'Immediately after line 6, before lines 7 and 8, what do Activity.Type and Activity.Duration contain?',
      questionZh:'执行第 6 行后、执行第 7 和第 8 行之前，这两个属性分别保存什么？'},
    {id:'format',set:1,title:'Stored value and displayed output',asset:'assets/02_value_and_display.png',alt:'Formatting 6.247 to the string 6.25 while the stored number remains unchanged',
      focus:'The formatted result is a string. The original numeric value remains available.',
      zh:'格式化的结果是字符串；原变量中的数字保持不变。',
      question:'Why do the two print statements show different values even though neither line reassigns Distance?',
      questionZh:'为什么两次输出不同，而 Distance 的值没有被重新赋值？'},
    {id:'menu',set:2,title:'Following a menu choice',asset:'assets/03_menu_dispatch.png',alt:'Main displays the menu, gets a choice, then calls the relevant subroutine',
      focus:'Main selects the subroutine. DisplayMenu only prints the options.',
      zh:'Main 判断菜单选择并调用子程序；DisplayMenu 只显示选项。',
      question:'Which subroutine reads and returns the choice? What does Main call when the returned value is "2"?',
      questionZh:'哪个子程序读取并返回选择？返回值是 "2" 时，Main 调用什么？'},
    {id:'load',set:2,title:'Reading, converting and selecting records',asset:'assets/04_file_to_record.png',alt:'One actual text file line is split, converted, checked against a string person ID and appended if matching',
      focus:'Splitting produces strings. Conversion gives selected fields numeric types.',
      zh:'拆分后的字段是字符串。int 和 float 把指定字段转换成数字。',
      question:'Which conversion does Distance need? Why would a record with PersonID "1002" be excluded for Individual.ID "1001"?',
      questionZh:'Distance 需要哪一种转换？为什么当前用户为 "1001" 时，不加入 "1002" 的记录？'},
    {id:'storage',set:2,title:'The running list and the saved file',asset:'assets/05_memory_and_file.png',alt:'ActivityLog appends an object in memory while AppendActivityToFile saves a text record that persists',
      focus:'Adding to a list and writing to a file are separate operations.',
      zh:'加入内存列表和写入文件是两个不同的操作。',
      question:'If an activity entered only ActivityLog and was never written to activity.txt, would it be available after closing and restarting? Explain.',
      questionZh:'如果记录只加入 ActivityLog，没有写入文件，关闭并重启程序后还能找到它吗？请解释。'}
  ],
  labs: {
    record:{title:'A small record example',file:'record_practice.py',prediction:'Predict the two printed lines before you run this example.',
      code:'class Exercise:\n    def __init__(self):\n        self.Type = ""\n        self.Duration = 0\n\nActivity = Exercise()\nActivity.Type = "Cycling"\nActivity.Duration = 12\nprint(Activity.Type)\nprint(Activity.Duration)',
      lines:[
        ['Defines a class named Exercise. We use its objects as activity records.','定义 Exercise 类，用来表示活动记录。'],
        ['Defines the initialisation routine. self refers to the new object.','定义初始化方法，self 指新创建的对象。'],
        ['Sets this object’s Type attribute to an empty string.','把 Type 属性的初始值设为空字符串。'],
        ['Sets this object’s Duration attribute to integer zero.','把 Duration 属性的初始值设为整数 0。'],
        ['A blank line separates the definition from the statements that use it.','空行用于分隔代码，方便阅读。'],
        ['Creates an Exercise object and refers to it using Activity. Python calls __init__.','创建对象，用 Activity 引用它，并自动调用 __init__。'],
        ['Stores Cycling in this object’s Type attribute.','把 Cycling 存入这个对象的 Type 属性。'],
        ['Replaces this object’s Duration value with 12.','把这个对象的 Duration 值改为 12。'],
        ['Prints the Type attribute.','输出 Type 属性。'],
        ['Prints the Duration attribute.','输出 Duration 属性。']
      ]},
    format:{title:'Formatting without replacing the number',file:'format_practice.py',prediction:'Predict both output lines. Notice which variable each print uses.',
      code:'Distance = 6.247\nDisplayDistance = "{:.2f}".format(Distance)\nprint(DisplayDistance)\nprint(Distance)',
      lines:[
        ['Stores the floating-point number 6.247 in Distance.','把浮点数 6.247 存入 Distance。'],
        ['Formats the number to two decimal places and stores the resulting string in DisplayDistance.','格式化为两位小数，把字符串结果存入 DisplayDistance。'],
        ['Prints the formatted string.','输出格式化后的字符串。'],
        ['Prints the unchanged original number.','输出保持不变的原始数值。']
      ]},
    fields:{title:'Separating a line of text',file:'fields_practice.py',prediction:'Predict the time and distance printed by this independent example.',
      code:'DataLine = "1001,21,1,3,08:30,Running,60,10.0,148,70.1"\nActivityData = DataLine.split(",")\nTime = ActivityData[4]\nDistance = float(ActivityData[7])\nprint(Time)\nprint(Distance)',
      lines:[
        ['Stores a sample line as a string. This example does not open or change activity.txt.','把一行示例保存为字符串；不会打开或更改 activity.txt。'],
        ['Splits at commas to create a list of strings. Indexing starts at zero.','按逗号拆分成字符串列表，下标从 0 开始。'],
        ['Reads field 4, the fifth field, as the time string.','读取下标 4，即第 5 个字段，作为时间字符串。'],
        ['Converts field 7 from a string into a float.','把下标 7 的字段从字符串转换为浮点数。'],
        ['Prints the time.','输出时间。'],
        ['Prints the numeric distance.','输出数值类型的距离。']
      ]}
  },
  eads:{
    task1:{title:'Main Task 1: reading Python syntax',file:'resources/Year11_Paper1_Main_Task_1_EAD.docx',save:'YourName_Main_Task_1.docx',
      groups:[
        ['A. Classes and attributes','Complete 01.1–01.2. In your IDE, create skills_practice.py. Predict the output in the EAD first. Type the complete example from the EAD, save and run it. Compare the actual output with your prediction. Then make only the change requested in 01.2.'],
        ['B. Formatting','Complete 01.3–01.4. Replace the contents of skills_practice.py with the EAD’s four-line formatting example. Predict both outputs before running. Keep track of which value is a number and which is a string.'],
        ['C. Unfamiliar syntax','Complete 01.5. Open fitness_working.py. Find PersonData, Exercise or DisplayActivity. Copy up to two unfamiliar pieces of syntax into the table. Write a precise question, or explain a part that is clearer now.']
      ],
      before:'The visuals use Cycling and 6.247 as teaching examples. Your EAD uses different values. Answer each EAD question using the code printed in that EAD.',
      finish:'Save your completed Main Task 1 EAD, upload it to the Main Task 1 assignment in your class Teams, and select Turn in. Then confirm below.'},
    task2:{title:'Main Task 2: understanding the program',file:'resources/Year11_Paper1_Main_Task_2_EAD.docx',save:'YourName_Main_Task_2.docx',
      groups:[
        ['A. Follow the start-up','Complete 02.1–02.3. Use Find in your IDE to locate def Main(): and class PersonData. Predict the default details first. Then run the whole fitness_working.py. In the Shell / Console enter D, then choose 1. Compare the displayed details with your predictions. Leave the program at its menu.'],
        ['B. Follow the file into the list','Complete 02.4–02.6. Open activity.txt in a separate text-editor or IDE tab. Do not run or edit the text file. Trace records 1, 2 and 14 using the EAD table. In the running program choose 2, then 4, then enter Running. Read the first activity row, not the headings. Enter Q when the menu returns.'],
        ['C. Follow an activity into storage','Complete 02.7–02.9 by reading AddActivity, DisplayNewActivity and AppendActivityToFile. Do not select menu option 3. Follow two input subroutine return values, then compare the in-memory list with the saved text file.']
      ],
      before:'Use the unchanged skeleton and data file. You are studying the program, not modifying it. The trace table is already in your EAD. You may ask for a printed copy and attach a clear photograph in your Word document instead.',
      finish:'Save your completed Main Task 2 EAD, upload it to the Main Task 2 assignment in your class Teams, and select Turn in. Then confirm below.'},
    extension:{title:'Section A style extension',file:'resources/Year11_Paper1_Extension_EAD.docx',save:'YourName_Extension.docx',
      groups:[['15 marks, six independent questions','Use the unchanged fitness_working.py and activity.txt. Explain the program using exact names and values. Answer the six questions in the EAD. You do not need to change the program or include screenshots.'],['Check the input assumption','Question 01.5 explicitly assumes integer inputs. Test the range condition using the supplied values. You do not need try/except, isdecimal or additional input routines.']],
      before:'Start this only after both main EADs are submitted. If time is short, complete the plenary first and continue the extension when I ask you to.',
      finish:'Save and submit the Extension EAD to Teams if you attempt it. Mark it with the answer copy only when I release it.'}
  }
};
