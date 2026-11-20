// Stable card identifiers keep work already saved on a pupil's device.
const series=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const routes=[[...series(1,9),...series(31,35),10,...series(11,13),...series(36,45),14,15],
              [...series(16,24),...series(46,50),25,26,27,...series(51,60),28,29,30]];
const ids=s=>routes[s],sess=id=>Number(routes[1].includes(id)),num=id=>routes[sess(id)].indexOf(id)+1;
const extra={};
function add(id,title,goal,hint,example,spec){
 cards[id-1]=[...title.split('|'),...goal.split('|'),...hint.split('|'),example];extra[id]=spec;
}
const bh='Read the headings above the ones. Leave out the zeros.|只加数字 1 上方的位值，跳过 0。';
const buildHint='Start with the largest place that fits. Work towards the right.|先选不超过目标的最大位值，再向右逐列判断。';
add(31,'Read a locker number|读出储物柜编号','The four-bit locker tag shows the pattern below. Enter its locker number in denary.|下方是四位储物柜标签。输入它的十进制编号。',bh,3,['read','1101',13]);
add(32,'Send a lane number|发送泳道编号','Lane 6 needs a four-bit tag. Switch on the places that make 6.|为第 6 泳道制作四位标签。打开能组成 6 的位。',buildHint,3,['build','0000',6]);
add(33,'Cross the 15 boundary|跨过 15','The counter reads 15. One more visitor arrives. Set the eight switches to the new total.|计数器原来是 15。又来了一位访客。用八个开关表示新的总数。','Four low places can hold at most 15. Which place comes next?|最低四位最多表示 15。再往左是哪一个位值？',4,['build','00001111',16]);
add(34,'Read the high bit|读取高位','This robot stores its ID in eight bits. What is the ID in denary?|机器人用八位保存编号。它的十进制编号是多少？',bh,4,['read','10000101',133]);
add(35,'Reset a warning light|关闭警示灯','The control panel starts at 76. Turn off only the 8 bit. Keep all other switches unchanged.|控制面板起始值为 76。只关闭位值为 8 的开关，其他位不变。','Find the column labelled 8. Switching off removes its value.|找到标有 8 的列。关闭这一位会减去它的位值。',4,['build','01001100',68]);
add(36,'Draw a striped flag|绘制条纹旗','Read the code from left to right and tap the squares to draw this flag row.|从左往右读编码，点方格绘制旗子的一行。','Compare one digit with one pixel directly below it.|将每一位与正下方的像素逐个比较。',2,['draw','10100110']);
add(37,'Send the lighthouse row|发送灯塔的一行','Look at the lighthouse pixels. Type the eight bits a partner would need to rebuild this row.|观察灯塔的像素，输入同伴重画这一行所需要的八位编码。','Keep the first and last white pixels in your code too.|行首和行尾的白色像素也要编码。',2,['encode','01100100']);
add(38,'Mirror a badge edge|镜像徽章边缘','The top row is the original. Draw its mirror image underneath: the last pixel becomes the first.|上面是原图。在下方画出水平镜像：最后一个像素变成第一个。','Copy the original from right to left into the new row.|将原图从右向左读，依次填入新行。',2,['mirror','110010']);
add(39,'Count every pixel|数出所有像素','This cinema icon is 5 pixels wide and 4 high. At 1 bit per pixel, how many bits store the picture alone?|影院图标宽 5 像素、高 4 像素，每个像素占 1 位。仅图像数据共需多少位？','Count all squares, not just the dark squares.|计算所有方格，包括白色方格。',5,['size',['10001','01010','00100','10001'],20,'Bits|位数']);
add(40,'Pack a ticket into bytes|将票券图存入字节','A ticket icon has 3 rows of 8 pixels, at 1 bit per pixel. Enter its size in bytes, ignoring headers.|票券图有 3 行，每行 8 像素，每像素占 1 位。不计文件头，输入所需的字节数。','First count bits. Every eight bits fill one byte.|先数位数。每八位组成一个字节。',5,['size',['10000001','01111110','10000001'],3,'Bytes|字节数']);
const lookup='Look up each whole eight-bit group. Keep the groups in message order.|按消息顺序查找，每八位查一次表。';
add(41,'Decode a gate sign|解读大门标牌','The sign sends two letters. Use the key to read both groups and type the word.|标牌发出两个字母。用字符表解读两组编码，输入单词。',lookup,6,['ascii','01000111 01001111','GO']);
add(42,'Encode the letter I|为字母 I 编码','A radio needs the letter I. Find it in the table and type all eight bits, including the first zero.|电台需要字母 I。在表中查找并输入完整八位，包括开头的零。',lookup,6,['ascii','I','01001001']);
add(43,'Find the changed letter|找出改变的字母','A label should say GO. The first letter is correct. Read the second group and type the letter it actually shows.|标签应显示 GO。第一个字母正确。查出第二组编码实际表示的字母。',lookup,6,['ascii','01000111 01001001','I']);
add(44,'Build a high score|拼出高分','Use the eight-bit board to send 170 points. Check every other column before you finish.|用八位开关表示 170 分。完成前检查相间的各列。',buildHint,4,['build','00000000',170]);
add(45,'Fix the reversed row|修复反向像素行','Someone read the row backwards. The code above is correct. Repair the pixels underneath it.|有人把这一行读反了。上方编码正确，请修复下方像素。','Match the first digit to the leftmost square, then move right.|第一位对应最左方格，然后向右检查。',2,['draw','11010000','00001011']);
// Each market challenge has its own editable worksheet and recalculation tests.
function market(id,title,goal,hint,ex,rows,k,formula,input,labels){
 let sheet={};rows.forEach((row,i)=>row.forEach((v,j)=>{if(v!=='')sheet['ABCD'[j]+(i+1)]=String(v)}));sheet[k]='';
 add(id,title,goal,hint,ex,['formula',sheet,k,formula,input,labels]);target[id]=k;sheetRows[id]=rows.map((_,i)=>i+1);
}
const plus='Use + to join the two input cells.|用加号连接两个输入单元格。',minus='Start with the amount you had, then subtract the amount used.|从原有数量中减去已用数量。',times='Multiply the quantity cell by the matching rate cell using *.|用星号将数量单元格与对应的单价或比率相乘。',divide='Divide the total by the number of equal groups using /.|用斜杠将总数除以组数。',total='A range includes both ends and every row in between.|区域包括起点、终点和中间各行。';
market(46,'Pool two floats|合并两笔备用金','In D2, add the two cash floats. Your formula should show RM35.|在 D2 将两笔备用金相加，公式应显示 35 令吉。',plus,8,[['Stall','First RM','Second RM','Total RM'],['Books',18,17,'']],'D2','=B2+C2',['B2','C2']);
market(47,'Count unsold tickets|计算剩余票数','In D2, subtract tickets sold from tickets printed. Expect 33 tickets left.|在 D2 用印好的票数减去已售票数，应剩 33 张。',minus,8,[['Tickets','Printed','Sold','Left'],['Concert',85,52,'']],'D2','=B2-C2',['B2','C2']);
market(48,'Price the notebooks|计算笔记本总价','In D2, calculate the cost of all notebook packs. Expect RM42.|在 D2 计算所有笔记本包的费用，应为 42 令吉。',times,8,[['Item','Packs','RM / pack','Cost RM'],['Notebooks',7,6,'']],'D2','=B2*C2',['B2','C2']);
market(49,'Share badge blanks|平分徽章坯料','In D2, share the badge blanks equally between tables. Expect 8 per table.|在 D2 把徽章坯料平均分给各桌，每桌应得 8 个。',divide,8,[['Item','Blanks','Tables','Per table'],['Badges',48,6,'']],'D2','=B2/C2',['B2','C2']);
market(50,'Total the ticket desk|汇总售票处收入','Use the three daily amounts to calculate total takings in B5. Expect RM76.|用三天的金额在 B5 计算总收入，应为 76 令吉。',total,10,[['Day','Takings RM'],['Mon',21],['Tue',24],['Wed',31],['Total','']],'B5','=SUM(B2:B4)',['B2','B3','B4']);
market(51,'Order with delivery|加上运费','In D4, work out the pack cost and add one delivery fee. Expect RM41.|在 D4 计算包裹总价，再加一次运费，应为 41 令吉。','Multiply first, then add the delivery fee once.|先乘数量和单价，再加一次运费。',11,[['Item','Quantity','RM / pack','Cost RM'],['Paint',6,6],['Delivery RM',5],['Payable','','','']],'D4','=B2*C2+B3',['B2','C2','B3']);
market(52,'Apply one voucher|使用一张优惠券','In D4, price all the packs and take off the voucher once. Expect RM25.|在 D4 计算全部商品的费用，再减去一张优惠券金额，应为 25 令吉。','The voucher applies to the order, not to each pack.|优惠券适用于整个订单，不是每一包。',11,[['Item','Packs','RM / pack','Cost RM'],['Pens',8,4],['Voucher RM',7],['Payable','','','']],'D4','=B2*C2-B3',['B2','C2','B3']);
market(53,'Pool before sharing|先合并再平分','Two boxes of counters are shared equally. In D4, find counters per team. Expect 10.|将两盒计数片合在一起平均分配。在 D4 求每队的数量，应为 10。','Use brackets around the combined number before dividing.|先用括号合并两盒数量，再做除法。',11,[['Supply','Box A','Box B'],['Counters',24,16],['Teams',4],['Per team','','','']],'D4','=(B2+C2)/B3',['B2','C2','B3']);
market(54,'Average stall takings|求平均收入','In B6, add the three stall amounts and divide by the number of stalls. Expect RM18 per stall.|在 B6 将三个摊位的收入相加，再除以摊位数，每个摊位平均 18 令吉。','Keep the stall count outside the range of money values.|摊位数量不能计入收入区域。',10,[['Stall','Takings RM'],['Art',12],['Sport',18],['Music',24],['Stall count',3],['Mean RM','']],'B6','=SUM(B2:B4)/B5',['B2','B3','B4','B5']);
market(55,'Save the change|计算找零','In B6, take all three purchases away from the cash given. Expect RM19 change.|在 B6 从付款金额中扣除三项购物费用，应找回 19 令吉。','Add the three purchases before taking them away from cash.|先加总三项费用，再从付款金额中减去总费用。',11,[['Receipt','RM'],['Flags',8],['Cards',9],['Tape',4],['Cash given',40],['Change','']],'B6','=B5-SUM(B2:B4)',['B2','B3','B4','B5']);
market(56,'Predict restocking cost|计算补货费用','In D4, work out the cost of replacing only the packs sold. Expect RM45.|在 D4 计算补回已售商品的费用，应为 45 令吉。','Find packs sold from the starting and remaining stock, then multiply by the price.|用起始库存减去余量，再乘单价。',11,[['Item','Start','Remaining'],['Ribbon',24,9],['RM / pack',3],['Restock RM','','','']],'D4','=(B2-C2)*B3',['B2','C2','B3']);
market(57,'Price a whole team order|计算队伍订单','Each team needs the same number of kits. In D4, find the cost for all teams. Expect RM72.|各队所需套装数相同。在 D4 计算所有队伍的费用，应为 72 令吉。','Three inputs matter: teams, kits per team and price per kit.|要用三个输入：队数、每队套装数和每套价格。',8,[['Order','Teams','Kits / team'],['Team kits',4,3],['RM / kit',6],['Cost RM','','','']],'D4','=B2*C2*B3',['B2','C2','B3']);
market(58,'Compare two stalls|比较两个摊位','In D4, find how much more stall B earned than stall A. Multiply each row separately before comparing. Expect RM6.|在 D4 计算乙摊比甲摊多收入多少。先分别计算两行收入，应相差 6 令吉。','Use the second stall’s takings minus the first stall’s takings.|用乙摊的收入减去甲摊的收入。',11,[['Stall','Sold','RM / item'],['A',6,4],['B',5,6],['Difference RM','','','']],'D4','=B3*C3-B2*C2',['B2','C2','B3','C3']);
market(59,'Split the delivery bill|平分运费和货款','In B6, share the two purchase costs and the delivery fee equally. Expect RM12 a team.|在 B6 将两笔购物费用和运费平分，每队应付 12 令吉。','Include the delivery fee in the money range. Divide the result by the team count.|把运费包含在费用区域，再用总费用除以队数。',11,[['Bill','Amount'],['Paper RM',15],['Ink RM',14],['Delivery RM',7],['Teams',3],['RM per team','']],'B6','=SUM(B2:B4)/B5',['B2','B3','B4','B5']);
market(60,'Leave a reserve|预留备用金','In B7, calculate what is available after all three bills and the emergency reserve. Expect RM27.|在 B7 计算付清三张账单并留出备用金后，可动用的余额，应为 27 令吉。','The reserve is money to keep aside, not extra income.|备用金要留起来，不是额外收入。',11,[['Plan','RM'],['Signs',9],['Cloth',12],['Lights',7],['Budget',65],['Reserve',10],['Available','']],'B7','=B5-SUM(B2:B4)-B6',['B2','B3','B4','B5','B6']);
Object.assign(labels,Object.fromEntries('Stall:摊位;First RM:第一笔（令吉）;Second RM:第二笔（令吉）;Total RM:总额（令吉）;Books:书籍;Tickets:票;Printed:已印;Sold:已售;Left:剩余;Concert:音乐会;Cost RM:费用（令吉）;Notebooks:笔记本;Blanks:坯料;Tables:桌数;Per table:每桌数量;Day:日期;Takings RM:收入（令吉）;Mon:周一;Tue:周二;Wed:周三;Total:总计;Quantity:数量;Paint:颜料;Delivery RM:运费（令吉）;Payable:应付;Pens:笔;Voucher RM:优惠金额;Supply:物资;Box A:甲盒;Box B:乙盒;Counters:计数片;Per team:每队;Art:美术;Sport:体育;Music:音乐;Stall count:摊位数;Mean RM:平均金额;Receipt:收据;Flags:旗子;Cards:卡片;Tape:胶带;Cash given:付款金额;Change:找零;Start:初始库存;Remaining:库存余量;Ribbon:丝带;Restock RM:补货费用;Order:订单;Kits / team:每队套数;Team kits:队伍套装;RM / kit:每套价格;RM / item:单价;Difference RM:差额;Bill:账单;Amount:数量或金额;Paper RM:纸张费用;Ink RM:墨水费用;RM per team:每队费用;Plan:计划;Signs:标牌;Cloth:布料;Lights:灯具;Budget:预算;Reserve:备用金;Available:可用余额'.split(';').map(x=>x.split(':'))));
function extraTask(id,a){let [type,x,y,label]=extra[id];switch(type){
 case 'formula':return sheetwork(id,a);
 case 'build':return board(signal(a,x),{edit:true});
 case 'read':return board(x)+field('score','Denary number|十进制数');
 case 'draw':return key()+'<div class="signal">'+x+'</div>'+pixels(signal(a,y||'0'.repeat(x.length)),true);
 case 'mirror':return key()+pixels(x)+pixels(signal(a,'0'.repeat(x.length)),true);
 case 'encode':return key()+pixels(x)+field('answer','Eight-bit row|八位像素编码','text');
 case 'size':return key()+'<div class="badgegrid">'+x.map(row=>pixels(row)).join('')+'</div>'+field('score',label);
 case 'ascii':return '<table class="sheet"><caption>'+L('Character key','字符表')+'</caption><tbody>'+['G:01000111','I:01001001','O:01001111'].map(row=>'<tr>'+row.split(':').map(t=>'<td>'+t+'</td>').join('')+'</tr>').join('')+'</tbody></table><div class="signal">'+x+'</div>'+field('answer',id===42?'Eight-bit code|八位编码':'Decoded text|解码后的文字','text');
 }}
function extraCorrect(id,a){let [t,x,y,f,refs]=extra[id];if(t==='formula'){
 const v=a.applied?.[y];if(!v||!String(v).startsWith('=')||(a.raw?.[y]??v)!==v)return false;
 return [null,...refs].every((k,i)=>{let c={...x};if(k)c[k]=String(+c[k]+i+2);return Math.abs(val({...c,[y]:v},y)-val({...c,[y]:f},y))<1e-8})}
 if(t==='build')return a.pattern===bin(y,x.length);if(t==='draw')return a.pattern===x;if(t==='mirror')return a.pattern===[...x].reverse().join('');
 if(t==='read'||t==='size')return String(a.score??'').trim()!==''&&Number(a.score)===y;return String(a.answer||'').replace(/\s/g,'').toUpperCase()===(t==='encode'?x:y);
}
