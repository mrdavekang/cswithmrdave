(() => {
  const q = (id,topic,kind,en,zh,answer,feedback,extra={}) =>
    ({id,topic,kind,en,zh,answer,feedback,...extra});
  const pick = (id,topic,en,zh,options,answer,feedback) =>
    q(id,topic,'choice',en,zh,answer,feedback,{options});
  const num = (id,bits,en,zh,answer,feedback) =>
    q(id,'Binary place value','number',en,zh,String(answer),feedback,{bits});
  const build = (id,n,width,feedback) =>
    q(id,'Binary place value','build','Set the bits to make '+n+'.','设置各位二进制数字，使总值等于 '+n+'。',n.toString(2).padStart(width,'0'),feedback,{width});
  const pix = (id,kind,en,zh,pattern,feedback,extra={}) =>
    q(id,'Pixels',kind,en,zh,pattern,feedback,{width:4,...extra});
  const text = (id,kind,en,zh,answer,feedback,extra={}) =>
    q(id,'Character codes',kind,en,zh,answer,feedback,{lookup:true,...extra});
  const groups = (...letters) => letters.map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ');
  const main1 = [
    pick('n01','Data and information','A screen shows “18”. Which label makes it clear what was counted?','屏幕显示“18”。哪个标签能说明数的是什么？',['18','18 tickets sold before lunch / 午饭前售出18张票','18 18 18'],1,'The label tells us what was counted and when.'),
    pick('n02','Data and information','Which is data without any context?','哪一项是没有背景说明的数据？',['21','21 players on the pitch / 场上有21名球员','21 books returned today / 今天还了21本书'],0,'21 on its own does not tell us what was counted.'),
    pick('n03','Bits and bytes','Which can a single bit store?','一个比特（bit）可以存什么？',['0 or 1 / 0 或 1','Any digit from 0 to 9 / 0 到 9','Eight digits at once / 同时存八个数字'],0,'A bit is one binary digit: 0 or 1.'),
    q('n04','Bits and bytes','number','How many bits are in 2 bytes?','2 字节有多少比特？','16','Each byte has eight bits. Two groups of eight make 16.'),
    num('n05','0101','What number does 0101 represent?','0101 表示哪个十进制数？',5,'Add the 4 and 1 places.'),
    num('n06','1100','What number does 1100 represent?','1100 表示哪个十进制数？',12,'The 8 and 4 places are on. Add 8 + 4.'),
    build('n07',9,4,'Switch on 8 and 1; leave 4 and 2 off.'),
    build('n08',14,4,'14 is 8 + 4 + 2, so the final bit is 0.'),
    num('n09','00010110','A game saves a score as 00010110. What is the score?','游戏把分数存成 00010110。分数是多少？',22,'Add the places with a 1: 16 + 4 + 2.'),
    num('n10','01000011','What number does 01000011 represent?','01000011 表示哪个十进制数？',67,'Add 64 + 2 + 1. A zero in the 128 place adds nothing.'),
    build('n11',37,8,'37 is 32 + 4 + 1.'),
    build('n12',130,8,'Use 128 and 2; keep all the other places off.'),
    num('n13','00011000','If you switch the 2-place from 0 to 1, what is the new total?','如果把位值为 2 的位置从 0 改成 1，新总数是多少？',26,'00011000 is 24. Turning on the 2-place adds 2.'),
    pick('n14','Binary place value','Which is larger: 0111 or 1000?','0111 和 1000 哪个更大？',['0111','1000','They are equal / 一样大'],1,'1000 is 8. The three 1s in 0111 add to 4 + 2 + 1 = 7.'),
    q('n15','Binary place value','write','A friend says “1010 is 2 because there are two 1s.” Use a short calculation to show the mistake.','有同学说“1010 等于 2，因为有两个 1”。用一个简短算式说明错误。',null,'Example: the 1s are in the 8 and 2 places, so 8 + 2 = 10.',{stem:'The 1s are in the ___ and ___ places, so …',bits:'1010'})
  ];
  const main2 = [
    pix('r01','pixel','Tap the squares to draw row 1 (1010) and row 2 (0110).','点选方格画出第 1 行（1010）和第 2 行（0110）。','10100110','Work left to right on each row. A 1 is filled and a 0 stays white.',{rows:['1010','0110']}),
    pix('r02','binary','Write the four bits for this row. Read from left to right.','从左到右写出这一行的四位二进制数字。','1001','The first and last squares are filled. The middle squares are white.',{pattern:'1001'}),
    pix('r03','pixel','Draw row 1 (0100), row 2 (1110), and row 3 (0100).','画出第 1 行（0100）、第 2 行（1110）和第 3 行（0100）。','010011100100','Check one row at a time. Each row has exactly four bits.',{rows:['0100','1110','0100']}),
    pix('r04','binary','The picture below is row 2. Write its four bits to fix the incorrect code 0101.','下面是第 2 行的图。写出正确的四位编码，修正 0101。','0111','The third square is filled, so its bit should be 1, not 0.',{pattern:'0111'}),
    pick('r05','Pixels','A black-and-white icon has 4 columns and 3 rows. How many bits store its pixels if each pixel uses one bit?','黑白图标有 4 列、3 行。每个像素用 1 比特，共需要几比特？',['7 bits / 比特','12 bits / 比特','24 bits / 比特'],1,'There are 4 × 3 = 12 pixels, each using one bit.'),
    text('r06','short','Use the character table to decode this eight-bit group. Type one character.','用字符表解码这一组八位编码。输入一个字符。','H','Match the whole group in the table. This code is H.',{code:groups('H')}),
    text('r07','short','Decode the three groups. Type the three letters in order.','解码这三组编码。按顺序输入三个字母。','SUN','The three groups match S, U and N.',{code:groups('S','U','N')}),
    text('r08','binary','Encode the letter M. Type all eight bits, including the first 0.','给字母 M 编码。写出八位数字，包括开头的 0。',groups('M'),'Find M, then read its eight bits in order.'),
    text('r09','binary','Encode GO. Type two eight-bit groups, with a space between them.','给 GO 编码。输入两组八位编码，中间加一个空格。',groups('G','O'),'Look up G first, then O. Each group needs eight bits.'),
    text('r10','write','Why can 01000010 describe a letter in one program and a row of pixels in another?','为什么 01000010 在一个程序中可以表示字母，在另一个程序中可以表示一行像素？',null,'Example: one program looks up all eight bits as a character; the other uses each bit to set one pixel.',{code:'01000010',stem:'For text, the program … For a picture, it …'})
  ];
  const extra = [
    num('x01','01110101','A scoreboard shows 01110101. Decode the score.','记分板显示 01110101。解码这个分数。',117,'Add 64 + 32 + 16 + 4 + 1.'),
    build('x02',175,8,'175 is 128 + 32 + 8 + 4 + 2 + 1.'),
    pix('x03','pixel','Decode this 4 × 4 badge, one row at a time.','逐行解码这个 4 × 4 的徽章。','1001011001101001','Read every row from left to right, beginning at the top.',{rows:['1001','0110','0110','1001']}),
    text('x04','short','Decode this message. One group represents a space.','解码这条消息。其中一组代表空格。','GO UP','Look up each group. 00100000 is a space.',{code:groups('G','O',' ','U','P')}),
    q('x05','Representation','write','Two files have the same bits. What extra information do you need to decide how to read each file?','两个文件有相同的比特。你还需要知道什么才能正确读取它们？',null,'You need to know the format or rule: for example, whether to read the bits as text, pixels, or a number.',{stem:'I need to know … because …'})
  ];
  const plenary = [
    q('p01','Binary place value','number','Without opening a worked example, add the place values for 10010101.','不看示例，算出 10010101 的十进制值。','149','128 + 16 + 4 + 1 = 149.',{bits:'10010101'}),
    pick('p02','Representation','What decides whether eight bits are read as one character or eight pixels?','什么决定八位编码被读成一个字符还是八个像素？',['The order you typed it / 输入的顺序','The rule the program uses / 程序使用的规则','The number of 1s / 1 的数量'],1,'The program’s rule tells it whether to read the bits as text or as pixels.'),
    q('p03','Reflection','write','Choose one topic to revise again. Write what you will do next, not just its name.','选一个需要再复习的主题。写出下一步要做什么，不只写主题名。',null,'Next step saved.',{stem:'I will practise ___ by …'})
  ];
  const quiz = [
    ['Data and information','Which is information, rather than a number on its own?','哪项是带有背景说明的信息？',['25','25 points earned in round 1 / 第一轮得了25分','2525'],1,'Context explains what the number means.'],
    ['Bits and bytes','What is one binary digit called?','一个二进制数字叫什么？',['A bit / 比特','A byte / 字节','A pixel / 像素'],0,'One binary digit is a bit.'],
    ['Bits and bytes','How many bits make a byte?','多少比特等于一字节？',['4','8','16'],1,'One byte has eight bits.'],
    ['Bits and bytes','How many bits are in 3 bytes?','3 字节有多少比特？',['11','16','24'],2,'Three groups of eight bits make 24.'],
    ['Binary place value','Which place comes directly to the left of 4 in 8 · 4 · 2 · 1?','在 8 · 4 · 2 · 1 中，4 左边紧挨着的位值是几？',['2','1','8'],2,'Moving one place to the left doubles the value.'],
    ['Binary place value','What number is 0110?','0110 表示哪个十进制数？',['6','2','12'],0,'4 + 2 = 6.'],
    ['Binary place value','Which four-bit code makes 11?','哪个四位编码表示 11？',['1101','1011','0111'],1,'8 + 2 + 1 = 11.'],
    ['Binary place value','What is the largest number you can make with four bits?','四位二进制能表示的最大数是多少？',['4','16','15'],2,'All four places on: 8 + 4 + 2 + 1 = 15.'],
    ['Binary place value','What is 00100001 as a number?','00100001 表示哪个十进制数？',['33','17','3'],0,'32 + 1 = 33.'],
    ['Binary place value','You turn the 16-place from 0 to 1. What happens to the number?','把位值为 16 的位置从 0 改为 1，数值怎样变化？',['It doubles / 变成两倍','It increases by 1 / 增加1','It increases by 16 / 增加16'],2,'You add the value of the place that was turned on.'],
    ['Pixels','Our picture rule says 0 = white and 1 = filled. What does 1100 draw?','本课规则为 0 = 白色，1 = 填色。1100 画出什么？',['□□■■','■■□□','■□■□'],1,'Read left to right: filled, filled, white, white.'],
    ['Pixels','A 2 × 5 black-and-white picture uses one bit per pixel. How many bits does it need?','2 × 5 的黑白图片，每像素 1 比特，共需要几比特？',['10','7','20'],0,'2 × 5 = 10 pixels.'],
    ['Character codes','How do you decode one letter using the lesson’s character table?','如何用本课字符表解码一个字母？',['Add up the 1s / 把1加起来','Match only the last bit / 只找最后一位','Match all eight bits / 匹配全部八位'],2,'The entire eight-bit group identifies the character in this table.'],
    ['Character codes','Which is one character in a text message?','短信中哪项算作一个字符？',['Only letters / 只有字母','A space / 空格','Only capital letters / 只有大写字母'],1,'A space is a character too.'],
    ['Representation','Can the same bit pattern mean different things?','同一组比特能表示不同的内容吗？',['Yes, if different rules are used / 可以，取决于读取规则','No, it always means a number / 不，只能表示数字','Only if it has no zeros / 只有不含0时才可以'],0,'The reading rule gives the bits meaning.']
  ].map(([topic,en,zh,options,answer,feedback],i)=>pick('q'+String(i+1).padStart(2,'0'),topic,en,zh,options,answer,feedback));

  const starter = [
    pick('s01','Data and information','Your class display says “17”. Which extra detail makes it useful?','班级屏幕只显示“17”。哪项补充能让它更有用？',['The number is in bold / 数字加粗','17 reusable bottles sold this morning / 今天上午售出了17个可重复使用的水瓶','The screen is bigger / 屏幕更大'],1,'Now we know what the 17 counts and when it was counted.'),
    pick('s02','Bits and bytes','Which row is one byte long?','哪一行正好有一个字节？',['0101','01010010','010'],1,'The middle row has eight bits. A byte contains eight bits.')
  ];
  const feedbackZh = [
    ['现在知道数的是水瓶，也知道是什么时候售出的。','中间一行有八位。一个字节包含八位。'],
    ['标签说明数的是什么，以及是什么时候数的。','单独的 21 没有说明数的是什么。','一个比特就是一个二进制数字：0 或 1。','每字节 8 比特，两组 8 是 16。','把 4 和 1 相加。','位值 8 和 4 的位置都是 1，所以算 8 + 4。','把 8 和 1 的位置设为 1，其余设为 0。','14 = 8 + 4 + 2，所以最后一位是 0。','把 1 上方的位值相加：16 + 4 + 2。','64 + 2 + 1。128 的位置是 0，不计入。','37 = 32 + 4 + 1。','只把 128 和 2 的位置设为 1。','00011000 是 24。把位值 2 的位置设为 1，总数增加 2。','1000 是 8；0111 是 4 + 2 + 1 = 7。','示例：两个 1 的位值是 8 和 2，所以 8 + 2 = 10。'],
    ['每行从左到右读：1 填色，0 留白。','第一个和最后一个方格填色，中间留白。','逐行检查，每行正好四位。','第三个方格已填色，对应的数字应是 1。','4 × 3 = 12 个像素，每个占 1 比特。','用整组八位查表，这组对应 H。','三组编码分别对应 S、U、N。','先找到 M，再按顺序读出八位。','先查 G，再查 O。每组必须有八位。','示例：文字按整组编码查表；像素按每一位决定是否填色。'],
    ['把这些位值相加：64 + 32 + 16 + 4 + 1。','175 = 128 + 32 + 8 + 4 + 2 + 1。','从最上面一行开始，每行从左到右读。','逐组查表。00100000 表示空格。','先知道格式或读取规则，例如应该把比特读成文字、像素还是数字。'],
    ['128 + 16 + 4 + 1 = 149。','程序的读取规则决定这组编码是文字还是像素。','已保存下一步计划。'],
    ['背景说明告诉我们这个数字的意思。','一个二进制数字叫一个比特。','一个字节等于 8 比特。','三组 8 比特等于 24 比特。','向左移动一个位置，位值就翻倍。','4 + 2 = 6。','8 + 2 + 1 = 11。','每一位都设为 1：8 + 4 + 2 + 1 = 15。','32 + 1 = 33。','把某个位置设为 1，就加上该位置的位值。','从左到右：填色、填色、留白、留白。','2 × 5 = 10 个像素。','在本课的字符表中，八位要一起查。','空格也是字符。','读取规则赋予比特意义。']
  ];
  [starter,main1,main2,extra,plenary,quiz].forEach((list,i)=>list.forEach((item,j)=>{item.feedbackZh=feedbackZh[i][j];}));
  window.REVISION_LESSON = {starter, main1, main2, extra, plenary, quiz, all:[...starter,...main1,...main2,...extra,...plenary,...quiz]};
})();
