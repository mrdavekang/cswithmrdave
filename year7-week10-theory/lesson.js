/* Teacher-authored, buildless lesson data. All numbers are unsigned whole numbers. */
window.ARCADE = (() => {
  const stages = [
    ['welcome','Welcome','0–2 min'], ['starter','Do now','2–7 min'],
    ['types','Types of learning','7–10 min'], ['read-one','Read first','10–16 min'],
    ['task-one','Main task 1','16–30 min'], ['read-two','Read first','30–32 min'],
    ['task-two','Main task 2','32–47 min'], ['extra','Extra challenges','47–51 min'],
    ['break','Practice break','51–53 min'], ['pitstop','Learning pitstop','53–56 min'],
    ['plenary','Plenary','56–60 min'], ['games','Keep practising','After plenary']
  ];
  const weights = [128,64,32,16,8,4,2,1];
  const art = {
    hero:['01-binary-arcade-mission.png','An arcade cabinet with eight blank score windows. No numbers or answers are shown.'],
    extend:['02-four-to-eight.png','The four places 8, 4, 2, 1 stay on the right. Four new places, 128, 64, 32, 16, extend to the left.'],
    byte:['03-bit-and-byte.png','One bit holds 0 or 1. Eight positions, including zeros, are grouped as one byte.'],
    model:['04-build-and-check-22.png','Teaching example: 16 + 4 + 2 = 22, represented by 00010110.'],
    repair:['05-repair-the-scoreboard.png','Target score 38. The stored eight-bit pattern is 00100100. No correction is shown.'],
    inspect:['06-inspect-challenge-cards.png','Card A: 00001111 labelled 15. Card B: 00010000 labelled 16. Card C: 00100001 labelled 35. One label is wrong.'],
    compare:['07-different-lengths.png','Display A has four digits: 1010. Display B has eight digits: 00001010. The rightmost columns are aligned.'],
    lab:['08-one-bit-change-lab.png','Starting pattern 00101001 represents 41. Change only the 16-column bit from 0 to 1. The after row is blank.']
  };
  const KSU = [
    ['Knowledge','Remember the eight place values and that eight bits make one byte.','记住八个位值，以及八位组成一个字节。'],
    ['Skills','Read a binary score, build an eight-bit score and check the total.','读出二进制分数，组成八位二进制数，并检查总数。'],
    ['Understanding','Explain why a bit’s position matters and why zeros still take up space.','解释为什么位的位置重要，以及为什么0仍然占一个位置。']
  ];
  const cards=[];
  const add=(stage,id,kind,title,read,prompt,other={})=>cards.push({stage,id,kind,title,read,prompt,...other});
  const choice=(stage,id,title,read,prompt,options,answer,explain,other={})=>add(stage,id,'choice',title,read,prompt,{options,answer,explain,...other});
  const num=(stage,id,title,read,prompt,answer,explain,other={})=>add(stage,id,'number',title,read,prompt,{answer:String(answer),explain,...other});
  const build=(stage,id,title,read,target,other={})=>add(stage,id,'build',title,read,`Make ${target} using eight bits.`,{
    target,answer:target.toString(2).padStart(8,'0'),initial:'00000000',
    zhPrompt:`用八位二进制数组成 ${target}。`,
    explain:`${target} = ${weights.filter(w=>(target&w)!==0).join(' + ')||'0'}. The eight-bit pattern is ${target.toString(2).padStart(8,'0')}.`,...other
  });
  add('welcome','mission','read','Your mission: fix the arcade scores',
    'You are checking a school arcade’s score display. Last lesson you used four bits: 8, 4, 2 and 1. Today, use eight bits to store bigger scores, read messages and repair mistakes. You will work in this app, on your own. You do not need Python or Excel.', '',{
      image:'hero',zhTitle:'你的任务：修好街机分数',zhRead:'你要检查学校街机的分数显示。上节课用了四位：8、4、2、1。今天用八位存储更大的分数、读出信息并改正错误。独立在这个应用内完成，不需要 Python 或 Excel。',overview:true
    });
  num('starter','retrieve-nine','Remember the four-bit cards',
    'The arcade shows a score using four digits. A 1 means include that column’s value; a 0 means leave it out. Read the row below, then add only the values under a 1. Type the ordinary number in the answer box.',
    'What score does 1001 represent?',9,'The 1s are in the 8 and 1 columns. 8 + 1 = 9.',{
      pattern:'1001',width:4,zhRead:'街机用四个数字显示分数。1表示计入这列的数值，0表示不计入。看下面的位值表，只把1所在列的数值相加。在答案框中输入普通数字。',zhPrompt:'1001 表示多少分？',hint:'Look at the first and last columns: 8 and 1.',zhHint:'看第一列和最后一列：8和1。'
    });
  choice('starter','retrieve-rule','What does the zero tell you?',
    'A column has a fixed value. The digit below it tells us whether to include that value. The arcade has 0 under its 8 column. Think about what you would add when you read this score.',
    'Do you include the value 8?', [['no','No — the digit below it is 0.','不计入，因为下面是0。'],['yes','Yes — the column is labelled 8.','计入，因为位值是8。']], 'no',
    'The column is still worth 8, but its digit is 0, so it contributes zero to this total.',{
      pattern:'0101',width:4,zhRead:'每列的位值固定。下面的数字告诉我们是否计入这列。街机8这一列下面是0。读出分数时，你会不会把8加进去？',zhPrompt:'要计入位值8吗？'
    });
  num('starter','retrieve-double','Extend the pattern',
    'The place values double as you move left. Read them starting on the right: 1, 2, 4, 8. Add one more column on the left. Doubling means adding a number to itself.',
    'What place value comes immediately to the left of 8?',16,'8 + 8 = 16. The next place value on the left is 16.',{
      visual:'doubling',zhRead:'从右往左看，位值每次加倍：1、2、4、8。现在在左边再加一列。“加倍”就是一个数加上它自己。',zhPrompt:'8的左边紧接着是什么位值？',hint:'Double 8: calculate 8 + 8.',zhHint:'把8加倍：计算8＋8。'
    });
  add('types','learning-definition','read','First: what does learning mean?',
    'Amazing Learning happens when we practice, try hard and use good struggle to get better.', '',{
      definition:true,zhRead:'精彩的学习发生在我们练习、努力，并通过有益的挑战不断进步的时候。',aside:'Today, getting better means choosing the right columns, checking a score and using a mistake to improve. This is not a speed race.',zhAside:'今天的进步包括选对位值、检查分数，并从错误中改进。这不是速度比赛。'
    });
  add('types','knowledge-start','reflect','Knowledge: what will I remember?',
    'Today’s facts: a bit holds 0 or 1; eight bits make one byte. Eight-bit place values are 128, 64, 32, 16, 8, 4, 2 and 1. These are the computing facts we will practise remembering.',
    'How familiar are these facts to you?',{
      zhRead:'今天的知识：一位只能是0或1；八位组成一个字节。八个位值是128、64、32、16、8、4、2、1。我们会练习记住这些计算机知识。',zhPrompt:'你对这些知识有多熟悉？',learningType:'Knowledge · remember',
      options:[['own','I can remember these facts without help.','我不需要帮助就能记住。'],['reminder','A reminder helps me remember them.','有提示我就能想起来。'],['explain','I need these facts explained again.','我需要再听一次解释。'],['new','These facts are new to me.','这些知识对我来说是新的。']]
    });
  add('types','skills-start','reflect','Skills: what will I practise?',
    'You will add the selected place values to read a score. You will also choose 0s and 1s to build a target score. The examples and hints are there to help you become more independent.',
    'How ready are you to read and build an eight-bit score?',{
      zhRead:'你会把选中的位值相加，读出分数；也会选择0和1，组成目标分数。示例和提示会帮助你逐步独立完成。',zhPrompt:'你现在能读出和组成八位二进制分数吗？',learningType:'Skills · practise',
      options:[['own','I can try both on my own.','我能独立尝试两种任务。'],['example','I can try with a place-value chart.','有位值表我能尝试。'],['help','I need someone to show one example.','我需要有人示范一个例子。'],['new','I have not used eight bits yet.','我还没有用过八位二进制。']]
    });
  add('types','understanding-start','reflect','Understanding: what will I explain?',
    'Two patterns can each contain one 1 but represent different scores. Understanding means explaining why the column matters, not just guessing an answer. You can explain using numbers, short phrases, English or Mandarin.',
    'How ready are you to explain why the position of a 1 matters?',{
      zhRead:'两个二进制数可能各只有一个1，却表示不同的分数。理解就是能解释为什么位值重要，而不是猜答案。你可以用数字、短语、英语或中文解释。',zhPrompt:'你能解释为什么1所在的位置重要吗？',learningType:'Understanding · explain',
      options:[['own','I can explain it using column values.','我能用位值解释。'],['example','I can explain it with an example beside me.','看着例子我能解释。'],['help','I need help connecting bits and values.','我需要帮助把位和位值联系起来。'],['new','I have not thought about this yet.','我还没有思考过这个问题。']]
    });
  choice('read-one','eight-places','Keep the familiar four places',
    'Four bits can store whole-number scores from 0 to 15. To store larger scores, we can use more bits. Keep 8, 4, 2 and 1 on the right. Add 16, 32, 64 and 128 on the left. Each new place is double the one to its right.',
    'Which list shows the four new places, from left to right?',
    [['a','128, 64, 32, 16'],['b','16, 32, 64, 128'],['c','1000, 100, 10, 1']], 'a',
    'The largest value is on the left: 128, 64, 32, 16. The familiar 8, 4, 2, 1 stay on the right.',{
      image:'extend',zhRead:'四位可以表示0到15的整数。要存储更大的分数，可以增加位数。把8、4、2、1保留在右边，在左边加入16、32、64和128。每个新位值都是右边的两倍。',zhPrompt:'从左到右，四个新位值的正确顺序是什么？'
    });
  choice('read-one','byte-fact','Count positions, not just the 1s',
    'A bit is one binary digit. Its value is 0 or 1. A byte contains eight bits. A zero still uses one position, so 00000001 has eight bits even though only one digit is 1. Here we use a whole byte for every score.',
    'How much space does 00000001 use?',
    [['eight','8 bits — one byte','8位，也就是一个字节。'],['one','1 bit — only count the 1','1位，只数数字1。'],['zero','0 bits — ignore the zeros','0位，忽略所有0。']], 'eight',
    'There are eight digit positions. Each is one bit, including each zero. Eight bits make one byte.',{
      image:'byte',zhRead:'一位是一个二进制数字，只能是0或1。一个字节包含八位。0仍占一个位置，所以00000001有八位，虽然只有一个数字是1。本课每个分数都用一个字节。',zhPrompt:'00000001 占多少空间？'
    });
  add('read-one','model-22','model','Watch a score being built: 22',
    'We want to store the ordinary number 22. We call ordinary base-ten numbers denary. Choose the largest place value that fits, then work out what is left. Use Next step to follow the example. At the end, add the selected values to check it.', '',{
      image:'model',zhRead:'我们要存储普通数字22。普通的十进制数叫denary。先选不超过目标的最大位值，再算还剩多少。点击“下一步”看示范，最后把选中的位值相加检查。'
    });
  num('task-one','decode-18','Round 1: read the player’s score',
    'The player has finished a round. The arcade sends 00010010, not the ordinary number 10010. The place-value row tells you what each digit is worth. Add the values under the 1s and type the denary score.',
    'What score does 00010010 represent?',18,'16 + 2 = 18. The player scored 18 points.',{
      pattern:'00010010',hint:'There are 1s in the 16 and 2 columns. Add those values.',zhRead:'玩家完成了一轮。街机发送00010010，它不是普通数字10010。位值表告诉你每一位值多少。把1所在列的位值相加，输入十进制分数。',zhPrompt:'00010010 表示多少分？',zhHint:'16和2这两列是1。把它们相加。'
    });
  build('task-one','build-19','Round 2: send a score of 19',
    'A player earns 19 points. Tap the digit tiles to turn columns on or off. A 1 includes that value. A 0 leaves it out. The running total is shown for this guided round. Choose values that add to 19, then check.',19,{
      live:true,hint:'Start with 16. You still need 3. Which two smaller columns add to 3?',zhRead:'玩家得到19分。点数字方框，把位值设为1或0。1表示计入，0表示不计入。这轮会显示实时总数。选出相加等于19的位值，再检查。',zhHint:'先选16，还差3。哪两个较小的位值相加等于3？'
    });
  num('task-one','decode-37','Round 3: decode the next message',
    'The next machine sends a different score. Use the same eight place values. You may say the selected values quietly to yourself or jot the addition on paper. Do not count how many 1s there are: add what their columns are worth.',
    'What score does 00100101 represent?',37,'32 + 4 + 1 = 37. Three selected columns do not mean a score of three.',{
      pattern:'00100101',hint:'Use the 32, 4 and 1 columns.',zhRead:'下一台机器发送了新的分数。继续用相同的八个位值。可以轻声读出选中的位值，或在纸上写算式。不是数有几个1，而是把它们所在列的位值相加。',zhPrompt:'00100101 表示多少分？',zhHint:'使用32、4和1这三列。'
    });
  build('task-one','build-45','Round 4: save 45 points',
    'The target is now 45 points. This time the running total stays hidden until you check. Start with the largest place value that fits 45. Think about how much is left after each choice. Keep all eight positions, including unused columns.',45,{
      hint:'Start with 32, leaving 13. Next try 8, then represent the remaining 5.',zhRead:'现在的目标是45分。检查前不显示实时总数。先选不超过45的最大位值，每选一次就想想还差多少。保留全部八个位置，不用的列写0。',zhHint:'先选32，还差13。再选8，最后组成剩下的5。'
    });
  num('task-one','decode-66','Round 5: use a new left-hand place',
    'Bigger scores can use columns to the left of 16. The right-hand 8, 4, 2 and 1 columns have not moved. Follow the labels above this pattern and add only the two selected values.',
    'What score does 01000010 represent?',66,'64 + 2 = 66. The leftmost 0 means do not include 128.',{
      pattern:'01000010',hint:'The selected columns are 64 and 2, not 128 and 4.',zhRead:'更大的分数会用到16左边的列。右边的8、4、2、1没有移动。看每列上方的位值，只把选中的两个数相加。',zhPrompt:'01000010 表示多少分？',zhHint:'选中的位值是64和2，不是128和4。'
    });
  build('task-one','build-90','Round 6: build a bigger score',
    'A player earns 90 points. It is smaller than 128, so that column must stay 0. Find a combination of the remaining values that totals 90. Use Show a hint if you need the first step; you can still record your own attempt.',90,{
      hint:'Choose 64 first. There are 26 left. Try 16, then 8, then 2.',zhRead:'玩家得到90分。90小于128，所以128这一列保持0。用其他位值组成90。需要第一步时可以看提示，仍然可以记录自己的尝试。',zhHint:'先选64，还差26。再试16、8和2。'
    });
  choice('task-one','cross-32','Which score is larger?',
    'Player A has 00011111. Player B has 00100000. A has more 1 digits, but B has a 1 in a different column. Read both totals using the place values before you choose.',
    'Which statement is correct?',
    [['b','B is larger: A has 31 and B has 32.','B更大：A是31，B是32。'],['a','A is larger because it has more 1s.','A更大，因为它有更多1。'],['same','They have the same value.','它们相等。']], 'b',
    'A = 16 + 8 + 4 + 2 + 1 = 31. B = 32. A higher-value column can be worth more than several smaller columns.',{
      comparePatterns:['00011111','00100000'],zhRead:'玩家A是00011111，玩家B是00100000。A的1更多，但B的1在不同的列。用位值表算出两个总数，再选择。',zhPrompt:'哪个说法正确？'
    });
  add('read-two','repair-method','read','Main task 2: investigate, then repair',
    'You are now the arcade’s score checker. First read what the machine stores. Next compare it with the target. Work out the difference, change the needed bit and check again. Fix the small mistake rather than guessing a whole new pattern.', '',{
      visual:'repair-steps',zhRead:'现在你是分数检查员。先读出机器存储的分数，再和目标比较。算出相差多少，改变需要改的位，然后再检查。找到小错误，不要重新乱猜整个二进制数。',aside:'Worked mini-example: 00001000 stores 8. To store 9, keep the 8 and switch on the 1 column → 00001001.',zhAside:'小示例：00001000表示8。要表示9，保留8，再把1这一列打开，得到00001001。'
    });
  num('task-two','stored-score','Investigation 1: what is stored now?',
    'The player earned 38 points, but the display stores 00100100. Do not repair it yet. First read the current pattern. Add the values under its 1s and type the score actually stored in the machine.',
    'What score is currently stored by 00100100?',36,'32 + 4 = 36. The machine stores 36, which is 2 below the target of 38.',{
      image:'repair',pattern:'00100100',hint:'The 1s are in the 32 and 4 columns.',zhRead:'玩家得到38分，但显示器存储的是00100100。先不要修改。先读出当前二进制数，把1所在列的位值相加，输入机器实际存储的分数。',zhPrompt:'00100100 当前存储多少分？',zhHint:'1在32和4这两列。'
    });
  build('task-two','repair-38','Investigation 1: repair one bit',
    'Keep the existing 32 and 4 columns selected. The machine stores 36 but needs 38: it is short by 2. Change one bit to add that missing value. Check the corrected pattern against the target.',38,{
      initial:'00100100',hint:'Find the 2 column. Switch its 0 to 1; keep every other digit the same.',zhRead:'保留32和4两列。机器存储36，目标是38，还差2。改变一位，加入这个缺少的数值，再检查修改后的二进制数。',zhHint:'找到2这一列，把0改为1，其他位保持不变。'
    });
  choice('task-two','inspect-card','Investigation 2: find the wrong label',
    'These three challenge cards have binary patterns and denary labels. Two labels match their patterns; one does not. Read all three patterns before selecting the card with the wrong label. The cards use the same style so colour does not reveal the answer.',
    'Which card has the wrong denary label?',
    [['a','Card A: 00001111 labelled 15'],['b','Card B: 00010000 labelled 16'],['c','Card C: 00100001 labelled 35']], 'c',
    'A is 8 + 4 + 2 + 1 = 15. B is 16. C is 32 + 1 = 33, not 35.',{
      image:'inspect',hint:'For each card, add the column values under the 1s. In Card C, the 1s are under 32 and 1.',zhRead:'三张挑战卡都有二进制数和十进制标签。两个标签正确，一个错误。先读出三张卡的数值，再选错误标签。卡片样式相同，颜色不会透露答案。',zhPrompt:'哪张卡的十进制标签错误？',zhHint:'逐张相加1所在列的位值。C卡的1在32和1下面。'
    });
  num('task-two','correct-label','Investigation 2: write the correct label',
    'Keep Card C’s binary pattern, 00100001, unchanged. Your job is to replace its incorrect denary label, 35. Use the place-value row below to work out the correct number for this label.',
    'What number should replace 35 on Card C?',33,'32 + 1 = 33. Only the label changes; the binary pattern stays 00100001.',{
      pattern:'00100001',zhRead:'保持C卡的二进制数00100001不变。把错误的十进制标签35换掉。用下面的位值表算出正确标签。',zhPrompt:'C卡的35应该改成多少？',hint:'Add 32 and 1.',zhHint:'把32和1相加。'
    });
  choice('task-two','leading-zero','Investigation 3: compare two displays',
    'Display A shows 1010 in four bits. Display B shows 00001010 in eight bits. The added zeros are on the left, so the original 8, 4, 2 and 1 columns stay aligned on the right. Read the values before comparing.',
    'How do the scores compare?',
    [['same','Both represent 10.','两个都表示10。'],['bigger','B is larger because it has more digits.','B位数更多，所以更大。'],['a','A is 1010 and B is 10.','A是普通数字1010，B是10。']], 'same',
    'Both count 8 + 2 = 10. Adding zeros on the left keeps the value the same; adding zeros on the right would move the selected columns.',{
      image:'compare',hint:'In each display, the 1s stay in the 8 and 2 columns.',zhRead:'A显示四位1010，B显示八位00001010。新加的0在左边，因此原来的8、4、2、1仍在右边对齐。先算出两个数值，再比较。',zhPrompt:'两个分数有什么关系？',zhHint:'两个显示器的1都在8和2这两列。'
    });
  choice('task-two','same-value-space','Same score — different number of bits',
    'The two displays both represent 10. Now count their digit positions instead of their values. A has four positions; B has eight positions. A byte is eight bits, even when some of those bits are 0.',
    'Which display uses one byte for its number?',
    [['b','Display B: 00001010','B显示器：00001010。'],['a','Display A: 1010','A显示器：1010。'],['both','Both displays use one byte.','两个都是一个字节。']], 'b',
    'Display B contains eight bits, so it uses one byte. Display A contains four bits. Equal number values do not mean equal bit lengths.',{
      image:'compare',zhRead:'两个显示器都表示10。现在数数字的位置，而不是计算数值。A有四个位置，B有八个。一个字节有八位，包括0。',zhPrompt:'哪个显示器用一个字节表示数字？'
    });
  choice('task-two','position-reason','Explain what makes a bit worth more',
    'The left pattern selects the 2 column. The right pattern selects the 64 column. Each contains only one 1. Use the column values to choose an explanation. A short, accurate reason matters more than a long sentence.',
    'Why do these patterns represent different scores?',
    [['place','The 1s are in columns with different place values.','1所在列的位值不同。'],['zeros','Zeros always make a number larger.','0总会让数字变大。'],['count','One pattern has more 1s.','其中一个有更多1。']], 'place',
    '00000010 = 2. 01000000 = 64. A bit contributes the value of its position, not just a count of one.',{
      comparePatterns:['00000010','01000000'],zhRead:'左边选中2这一列，右边选中64这一列。两个二进制数都只有一个1。根据位值选一个解释，准确的短解释比长句更重要。',zhPrompt:'为什么它们表示不同分数？'
    });
  build('extra','lab-57','Extra challenge 1: change only one bit',
    'The starting score is 41, stored as 00101001. Change only the 16-column bit from 0 to 1. Leave the other seven bits unchanged. Predict the new score, then set the tiles and check the pattern.',57,{
      image:'lab',initial:'00101001',prompt:'Change only the 16-column bit, then check.',zhPrompt:'只改变16这一列，再检查。',hint:'Changing 0 to 1 in the 16 column adds 16 to 41.',zhRead:'初始分数41存储为00101001。只把16这一列从0改为1，其他七位不变。先想新分数是多少，再设置方框并检查。',zhHint:'把16这一列从0改为1，就是给41加上16。'
    });
  num('extra','lab-score','Extra challenge 1: explain the new score',
    'The original score was 41. You changed the 16-column bit from 0 to 1 and kept every other digit the same. Think about how much was added. Type the new denary score; no long written explanation is needed.',
    'What is the new score after adding the 16 column?',57,'41 + 16 = 57. The after pattern is 00111001.',{
      pattern:'00111001',zhRead:'原分数是41。你把16这一列从0改为1，其他位不变。想想增加了多少，输入新的十进制分数，不需要写长句。',zhPrompt:'加上16这一列后，新分数是多少？',hint:'Calculate 41 + 16.',zhHint:'计算41＋16。'
    });
  num('extra','maximum','Extra challenge 2: the biggest eight-bit score',
    'The scoreboard has eight bits. Turn every column on: 11111111. Add all eight place values. This is the biggest whole-number score that these eight bits can represent when we use them only for non-negative numbers.',
    'What is the largest score?',255,'128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255. Zero to 255 gives 256 possible whole-number values.',{
      pattern:'11111111',zhRead:'计分板有八位。全部设为1：11111111。把八个位值相加。这是八位用于表示非负整数时能表示的最大分数。',zhPrompt:'最大分数是多少？',hint:'Add in pairs: 128 + 64 = 192, then add 32, 16, 8, 4, 2 and 1.',zhHint:'先算128＋64＝192，再加32、16、8、4、2、1。'
    });
  add('extra','practice-bank','practice','Extra challenge 3: choose your practice level',
    'Choose a level, then work on one question at a time. Decode a score, build a target or repair a signal. Feedback explains each answer. You can try another question as many times as you like. Stop when your teacher asks you to move to the pitstop.', '',{
      zhRead:'选择难度，每次做一道题。可以读出分数、组成目标或修复信息。反馈会解释答案。你可以继续练习，也可以在老师要求时进入学习反思。'
    });
  add('break','practice-break','break','Two-minute practice break',
    'If your teacher starts a short game break, open the Binary Game. Choose 8-bit and Flip the bits. Keep the 60-second timer off for your first try. Aim to make three target numbers, then return to this tab for your learning pitstop.', '',{
      zhRead:'如果老师安排短暂游戏练习，打开Binary Game，选择8-bit和Flip the bits。第一次先关闭60秒计时。尝试组成三个目标数字，再回到本页进行学习反思。'
    });
  add('pitstop','learning-phase','reflect','Learning pitstop: where are you now?',
    'Think about reading a score, building eight bits and checking an error. Choose the phase that fits your learning right now. This is not a label for your ability. Read the next-step suggestion after you choose.',
    'Which phase describes today’s binary learning?',{
      zhRead:'想想今天读分数、组成八位二进制数和检查错误的过程。选择此刻最符合你的学习状态，不是给能力贴标签。选择后阅读下一步建议。',zhPrompt:'哪种状态最符合你今天的二进制学习？',phase:true,
      options:[['new','New learning — I am making progress with something new.','新学习：我在学习新知识并进步。'],['consolidating','Consolidating — practice is making me more accurate.','巩固：练习让我更准确。'],['treading','Treading water — this feels easy; I need a stretch.','原地踏步：比较容易，我需要更有挑战的任务。'],['drowning','Drowning — I need an example and help with the next step.','需要帮助：我需要示例和下一步指导。']]
    });
  build('plenary','exit-70','Exit check: send a fresh score',
    'Use your own understanding to store 70 points. The chart is still available. Choose values that add to 70, leave unused columns at 0 and keep all eight digits. Check your answer when you are ready.',70,{
      hint:'70 is 64 + 6. How can you make the remaining 6?',zhRead:'用自己的理解存储70分。你仍然可以看位值表。选出相加等于70的位值，不用的列保持0，保留八个数字。准备好后检查。',zhHint:'70＝64＋6。剩下的6怎么组成？'
    });
  num('plenary','exit-decode','Exit check: read a fresh pattern',
    'A different arcade sends 10000001. Read the pattern using today’s eight place values. The first 1 and the last 1 have different values. Add those values and type the denary score.',
    'What score does 10000001 represent?',129,'128 + 1 = 129. Position determines the contribution of each 1.',{
      pattern:'10000001',zhRead:'另一台街机发送10000001。用今天的八个位值读出它。第一个1和最后一个1的位值不同。把它们的位值相加，输入十进制分数。',zhPrompt:'10000001 表示多少分？',hint:'The first column is 128; the last is 1.',zhHint:'第一列是128，最后一列是1。'
    });
  choice('plenary','exit-byte','Exit check: value and space are different',
    'A score is stored as 00000000. Every digit is 0, but each position is still one bit. Think separately about the score’s value and how many positions are used to store it.',
    'Which statement is correct?',
    [['eight','The score is 0 and it uses 8 bits.','分数是0，占8位。'],['zero','The score is 0 and it uses no bits.','分数是0，不占位。'],['one','The score is 8 and it uses 1 bit.','分数是8，占1位。']], 'eight',
    'The value is zero because no column contributes to the total. The length is eight bits, which is one byte.',{
      pattern:'00000000',zhRead:'一个分数存储为00000000。每个数字都是0，但每个位置仍是一位。分别想一想分数值是多少，以及用了多少个存储位置。',zhPrompt:'哪个说法正确？'
    });
  add('games','finish','finish','Your Binary Arcade debrief',
    'Review your progress below. An amber “Review” means you made an attempt but may need another try. You can return to any completed question. Your answers are saved on this device. Use Download backup before changing devices or clearing browser data.', '',{
      zhRead:'查看下面的进度。橙色“复习”表示你已经尝试，但可能需要再练习。可以回到任何已完成的题。答案保存在本设备中，换设备或清理浏览器前请下载备份。'
    });
  add('games','games-links','games','Choose your next binary game',
    'You have reached the games area after plenary. Pick one activity. Blooket and Gimkit use our 15 eight-bit questions and do not need a live host. The links have closing dates. Use the untimed Binary Game for practice after those assignments close.', '',{
      zhRead:'完成课堂总结后，选择一个活动。Blooket和Gimkit使用本课15道八位二进制题，不需要老师实时主持。作业链接有截止日期，之后仍可用无计时Binary Game继续练习。'
    });
  return {
    id:'y7-week10-eight-bit-binary-2026',version:1,stages,cards,weights,art,KSU,
    wagba:'Represent, read and check whole-number scores using eight-bit binary.',
    zhWagba:'用八位二进制数表示、读出和检查整数分数。',
    definition:'Amazing Learning happens when we practice, try hard and use good struggle to get better.',
    challenge:'Find a wrong bit, explain its effect, then solve a new score independently.',
    vocabulary:[
      ['binary','二进制','A number system using only the digits 0 and 1.','只使用0和1的数制。'],
      ['denary','十进制','The base-ten number system we usually use, such as 22.','平时使用的十进制数制，例如22。'],
      ['bit','位','One binary digit: 0 or 1.','一个二进制数字：0或1。'],
      ['byte','字节','A group of eight bits.','由八个位组成。'],
      ['place value','位值','What a column is worth: for example, 16.','一列代表的数值，例如16。'],
      ['convert','转换','Represent the same number in a different number system.','用另一种数制表示相同的数。'],
      ['leading zero','前导零','A zero added at the left; it does not change the number’s value.','加在左边的0，不改变数值。'],
      ['target','目标','The score you need the pattern to represent.','需要用二进制数表示的分数。']
    ],
    workedSteps:[
      ['Start with the target','Find the largest place value that fits into 22.','从目标开始：找不超过22的最大位值。'],
      ['Select 16','22 − 16 = 6 left. Keep 1 under 16.','选择16：22−16＝6。在16下面写1。'],
      ['Select 4','8 is too large for the remaining 6. Use 4; 2 remains.','还差6，8太大。选4，还差2。'],
      ['Select 2','16 + 4 + 2 = 22. Nothing remains.','选择2：16＋4＋2＝22，没有剩余。'],
      ['Fill the unused places','Use 0 in every unused column: 00010110.','不用的列写0，得到00010110。'],
      ['Check the total','Read it back: 16 + 4 + 2 = 22. It matches the target.','反向检查：16＋4＋2＝22，与目标相同。']
    ],
    links:{
      blooket:'https://play.blooket.com/play?hwId=6adee88207562e4a40801ef5',
      gimkit:'https://www.gimkit.com/join/6adee9d2e3d66465b02927fd',
      practice:'https://linguaholic.com/games/binary-game/'
    }
  };
})();
