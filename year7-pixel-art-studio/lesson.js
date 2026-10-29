(() => {
 const B=(en,zh)=>({en,zh});
 globalThis.PixelLesson={
  wagba:B('Create, encode, test and improve a pixel picture using binary digits.','用二进制设计、编码、测试并改进一幅像素图片。'),
  definition:B('Amazing Learning happens when we practise, try hard and use good struggle to get better.','通过练习、努力和积极面对挑战，我们能够不断进步，获得更好的学习成果。'),
  stages:[B('Do now','开始任务'),B('Types of learning','学习类型'),B('Learn the key','学习规则'),B('Decode & repair','解码与修正'),B('Studio method','创作方法'),B('Create my icon','创作图标'),B('Extra challenges','额外挑战'),B('Learning pitstop','学习加油站'),B('Plenary','课堂回顾'),B('Save & finish','保存与完成')],
  words:[
   ['pixel','像素','One small picture element. Our pictures are made from a grid of pixels.','图片中的一个小元素。许多像素排列成网格，组成图片。'],
   ['binary','二进制','A way to represent data using only 0 and 1. Here, each bit tells us a pixel’s colour.','只使用0和1表示数据的方法。本课每一位决定一个像素的颜色。'],
   ['bit','位','One binary digit: 0 or 1. In our colour key, 0 is white and 1 is black.','一个二进制数字：0或1。在本课的规则中，0表示白色，1表示黑色。'],
   ['byte','字节','Eight bits together. An eight-pixel row in our one-bit-per-pixel picture uses eight bits.','八位组成一个字节。本课每个像素用一位，因此一行八个像素需要八位。'],
   ['encode','编码','Turn a picture into a code. Read each pixel and write its matching bit.','把图片变为编码。按顺序观察每个像素，写出对应的0或1。'],
   ['decode','解码','Use a code to rebuild a picture. Read each bit and fill its matching pixel.','根据编码重建图片。按顺序读取每一位，为对应像素填色。'],
   ['row','行','A line of squares going across. Read each row from left to right; start with the top row.','横向排列的一行方格。每行从左向右读，从最上面的一行开始。'],
   ['column','列','A line of squares going down. Column numbers show positions, not binary place values.','纵向排列的一列方格。列号表示位置，不是二进制位值。']
  ],
  ksu:[
   {id:'knowledge',title:B('Knowledge · what I will remember','知识：我要记住什么'),goal:B('A pixel is one picture element. Our key is 0 = white and 1 = black. Eight bits make one byte.','像素是图片中的一个小元素。本课0表示白色，1表示黑色。八位组成一个字节。'),prompt:B('How well do you know these facts?','你对这些知识掌握得怎样？'),choices:[B('I can recall these facts.','我能记住这些知识。'),B('I recognise them, but need a reminder.','我认识这些概念，但需要提示。'),B('These facts are new to me.','这些知识对我来说是新的。')]},
   {id:'skills',title:B('Skills · what I will practise','技能：我要练习什么'),goal:B('I will decode rows, draw an icon, write its binary, test the rebuilt picture and improve a second version.','我将解码、画图、写出二进制编码、测试重建的图片，再改进第二版。'),prompt:B('What is your starting point for decoding a row?','对于解码一行，你的起点是什么？'),choices:[B('I can decode a row on my own.','我能独立解码一行。'),B('I can follow a worked example.','我能跟着示例完成。'),B('I need someone to model the first row.','我需要先看别人示范第一行。')]},
   {id:'understanding',title:B('Understanding · what I will explain','理解：我要解释什么'),goal:B('I will explain how picture rules affect the result, and how the number of pixels relates to the bits and bytes needed.','我将解释图片规则如何影响结果，以及像素数量与所需位数、字节数的关系。'),prompt:B('Can you explain why the colour key matters?','你能解释颜色规则为什么重要吗？'),choices:[B('I can explain it using an example.','我能举例解释。'),B('I have an idea, but need a prompt.','我有一些想法，但需要提示。'),B('I am ready to investigate this.','我准备通过练习来理解。')]}
  ],
  starter:[
   {id:'byte',title:B('Warm up: bits and bytes','热身：位与字节'),read:B('Last lesson, we used eight-bit patterns to represent arcade scores. Keep that idea: every position counts, including the zeros.','上节课我们用八位二进制表示游戏分数。记住：每个位置都要算上，包括0。'),q:B('How many bits make one byte?','多少位组成一个字节？'),options:[B('1 bit','1位'),B('8 bits','8位'),B('10 bits','10位')],answer:1,why:B('A byte is a group of eight bits. Zero bits still occupy positions.','八位组成一个字节。0也占据一个位置。')},
   {id:'number',title:B('Warm up: read one score','热身：读出分数'),read:B('For this question only, the headings are binary place values. Add the values above the 1s.','仅在这一题中，上方数字表示二进制位值。把1上方的位值加起来。'),q:B('What score does 00010110 represent?','00010110表示多少分？'),options:[B('22','22'),B('16','16'),B('6','6')],answer:0,why:B('The 1s select 16, 4 and 2. 16 + 4 + 2 = 22.','1所在的位值是16、4和2。16＋4＋2＝22。')},
   {id:'pixels',title:B('A new job for the same bits','同样的二进制，不同的用途'),read:B('Now use the picture key: 0 = white, 1 = black. Each bit controls one pixel. Do not add place values in this picture task.','现在使用图片规则：0表示白色，1表示黑色。每一位控制一个像素。图片任务不需要把位值相加。'),q:B('Under our picture key, what does 0 tell you to draw?','根据本课的图片规则，0表示什么？'),options:[B('A white pixel','白色像素'),B('No pixel at all','没有像素'),B('A black pixel','黑色像素')],answer:0,why:B('Draw a white pixel. A 0 keeps a real position in the picture; it does not remove that square.','画一个白色像素。0仍占据图片中的一个位置，不代表删掉那个方格。')}
  ],
  learn:[
   {title:B('One square is one pixel','一个方格就是一个像素'),read:B('Zoom into a digital picture and you can see its individual pixels. In our studio, each pixel has one of two colours: black or white.','放大数字图片，就能看到一个个像素。本课每个像素只使用黑色或白色。'),image:2,action:B('Next: turn pixels into bits','下一步：把像素变成二进制')},
   {title:B('Encode: picture → bits','编码：图片 → 二进制'),read:B('Look at each pixel from left to right. Write 0 for white and 1 for black. Record all eight pixels, including the white ones.','从左向右观察每个像素。白色写0，黑色写1。八个像素都要记录，包括白色像素。'),image:3,action:B('Next: turn bits into pixels','下一步：把二进制变成像素')},
   {title:B('Decode: bits → picture','解码：二进制 → 图片'),read:B('Start at the first bit. Colour its matching square using our key. Continue left to right, then move to the next row down. The column numbers tell you positions, not place values.','从第一位开始，按颜色规则为对应方格填色。从左向右完成一行，再向下进入下一行。列号表示位置，不是位值。'),image:4,action:B('Start Mission A','开始任务A')}
  ],
  phases:[
   ['new',B('New learning','新学习'),B('This is new, and I am making progress by trying and checking.','这是新知识，我通过尝试和检查取得进步。')],
   ['consolidating',B('Consolidating','巩固'),B('I am getting more accurate at encoding and checking.','我在编码和检查时越来越准确。')],
   ['treading',B('Treading water','原地踏步'),B('This feels easy. I need a challenge that stretches me.','这些任务比较容易，我需要更有挑战的任务。')],
   ['drowning',B('Drowning','需要帮助'),B('This feels too hard. I need one row modelled with me.','这些任务太难，我需要别人和我一起示范一行。')]
  ],
  plenary:[
   {id:'pixel',q:B('What is a pixel?','什么是像素？'),options:[B('One small picture element','图片中的一个小元素'),B('A whole computer screen','整个电脑屏幕'),B('A group of eight pictures','八张图片组成的一组')],answer:0,why:B('Pictures in our studio are made from a grid of individual pixels.','本课的图片由许多单独的像素排列成网格组成。')},
   {id:'change',q:B('Under our key, a bit changes from 0 to 1. What happens to its pixel?','根据本课的规则，一位从0变为1，对应像素会怎样？'),options:[B('The pixel disappears','像素消失'),B('Black changes to white','从黑色变为白色'),B('White changes to black','从白色变为黑色')],answer:2,why:B('Our agreed key is 0 = white and 1 = black. The position stays the same.','本课规则是0表示白色，1表示黑色。像素位置不变。')},
   {id:'key',q:B('Why does another reader need our colour key and reading order?','为什么别人也需要知道颜色规则和读取顺序？'),options:[B('To make every picture bigger','为了把所有图片放大'),B('To rebuild the same picture','为了重建相同的图片'),B('To ignore the zeros','为了忽略0')],answer:1,why:B('Different rules can produce a different picture from exactly the same bits.','同样的二进制编码，在不同规则下可能产生不同图片。')}
  ],
  images:['01-your-arcade-mission.png','02-what-is-a-pixel.png','03-encode-picture-to-bits.png','04-decode-bits-to-picture.png','05-check-and-correct.png','06-draw-encode-rebuild-compare.png']
 };
})();
