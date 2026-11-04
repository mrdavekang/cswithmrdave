(() => {
  const op = (title, goal, item, aLabel, a, bLabel, b, sign, value, steps, zh, question, choices, correct, word, answers, hint) =>
    ({title,goal,grid:[['Item',aLabel,bLabel,'Result'],[item,a,b,value]],cells:['B2','C2'],target:'D2',formula:'=B2'+sign+'C2',
      steps,zh,question,choices,correct,word,answers,hint});
  const cards = [
    {title:'Find a cell and enter a formula',goal:'Read the column letter first, then the row number.',
      grid:[['Supply','Quantity','RM each','Check'],['Stickers',16,2,''],['Badges',8,3,8]],
      cells:['B3'],target:'D3',formula:'=B3',steps:[
        'Follow column B down and row 3 across. They meet at B3, which holds 8.',
        'Select the empty result cell D3. In the formula bar, type =B3. The equals sign tells the spreadsheet to calculate or read a value.',
        'Tap Apply here, or press Enter in Excel. D3 shows 8. Select D3 again to see the formula rather than just the result.'
      ],zh:'先读列字母，再读行号。B3 是 B 列第 3 行，数值为 8。选 D3，在公式栏输入 =B3，然后点 Apply（应用）。',
      question:'Which cell holds the price of one badge?',choices:['B3','C3','D3'],correct:1,
      word:'Type the symbol that starts a formula.',answers:['=','equals','equal','equals sign','等号','＝'],hint:'Look at the first character in the formula bar.'},
    op('Add with +','Combine two amounts to find one total.','Paper flags','Box A',12,'Box B',7,'+',19,[
      'Both boxes contain flags. To find how many are ready, add both quantities.',
      'Select D2. Type =B2+C2 in the formula bar, then tap Apply. The + joins the two cell references.',
      'D2 shows 19. If Box B changes from 7 to 9, the result becomes 21 without typing a new formula.'
    ],'把两个盒子的数量相加。选 D2，输入 =B2+C2。修改 C2 时，总数会自动更新。',
    'If Box B changes from 7 to 9, what does D2 show?',['19','21','28'],1,'Type the symbol for addition.',['+','plus','add','addition','加','加号','＋'],'Add 12 to the new value, 9.'),
    op('Subtract with -','Find what is left after some items are used.','Stickers','Start',35,'Used',12,'-',23,[
      'Start with 35 stickers. Take away the 12 already used.',
      'Select D2. Type =B2-C2, then tap Apply. The starting amount goes before the minus sign.',
      'D2 shows 23. If you swap the references, the formula works out 12 minus 35 instead.'
    ],'先写原有数量，再减去已用数量。=B2-C2 表示 35 减 12，得到 23。顺序不能反过来。',
    'Which formula finds the number left?',['=C2-B2','=B2+C2','=B2-C2'],2,'Type the symbol for subtraction.',['-','minus','subtract','subtraction','减','减号','−','–','－'],'Start with the amount in B2 and take away C2.'),
    op('Multiply with *','Find the cost when every item has the same price.','Keyrings','Quantity',6,'RM each',4,'*',24,[
      'Six keyrings cost RM4 each. The total is six lots of four.',
      'Select D2. Type =B2*C2, then tap Apply. Use an asterisk (*) for multiplication in Excel.',
      'D2 shows 24. If you order one more keyring, the cost increases by RM4.'
    ],'每个钥匙扣 RM4，共 6 个。用 * 表示乘法。=B2*C2 得到 24。',
    'What happens to the total if you order one more keyring?',['It increases by RM4','It increases by RM6','It stays the same'],0,'Type the symbol Excel uses to multiply.',['*','asterisk','multiply','星号','乘','＊'],'Think about the cost of one extra item.'),
    op('Divide with /','Split a total into equal shares.','Art packs','Total RM',48,'Teams',8,'/',6,[
      'Eight teams share a bill of RM48. Each team pays the same amount.',
      'Select D2. Type =B2/C2, then tap Apply. The amount to share comes first; the number of teams comes second.',
      'D2 shows 6. Check the result: 8 teams × RM6 gives the original RM48.'
    ],'把 RM48 平分给 8 组。用 / 表示除法。=B2/C2 得到每组 RM6。',
    'Which formula finds the amount each team pays?',['=C2/B2','=B2*C2','=B2/C2'],2,'Type the symbol Excel uses to divide.',['/','slash','forward slash','divide','除','斜杠','／'],'Divide the total in B2 by the number of teams in C2.'),
    {title:'Combine operations in one formula',goal:'Group the steps in the order the story needs.',
      grid:[['Budget','Value','Calculation','Result'],['Budget RM',100,'Money left per team',22.5],['Teams',4],['Boxes',5],['RM per box',6],['Donation RM',20]],
      cells:['B2','B3','B4','B5','B6'],target:'D2',formula:'=(B2-(B4*B5)+B6)/B3',steps:[
        'Work out the purchase cost: 5 boxes × RM6 = RM30.',
        'Take RM30 away from the RM100 budget, then add the RM20 donation. That leaves RM90.',
        'Divide the amount left by 4 teams. The outer brackets tell the spreadsheet to finish the money calculation before dividing. The result is RM22.50.'
      ],zh:'先算盒子总价 5×6，再用预算减去成本并加上捐款。最后把剩余的钱除以 4。括号内先算。',
      question:'What is divided by the number of teams?',choices:['Only the donation','The whole amount left','Only the price per box'],correct:1,
      word:'What do we use to group calculations that must happen together?',answers:['brackets','bracket','parentheses','parenthesis','()','括号'],hint:'Look at the outer pair around the money calculation.'}
  ];
  const sum = [
    {title:'Use SUM to add a range',goal:'One SUM formula can include several cells.',
      grid:[['Supplies','Cost RM'],['Paint',12],['Brushes',8],['Paper',10],['Subtotal',30]],
      cells:['B2','B3','B4'],target:'B5',formula:'=SUM(B2:B4)',steps:[
        'Read the costs in B2, B3 and B4. These are three neighbouring cells in column B.',
        'Select B5, the blank cell under the costs. Type =SUM(B2:B4), then tap Apply. The colon means “through to”, including both ends.',
        'B5 shows RM30. Leave B5 out of the range: a total cannot refer to itself.'
      ],zh:'SUM 求总和。B2:B4 表示从 B2 到 B4（包括 B3）。在 B5 输入 =SUM(B2:B4)，不要把 B5 本身包括进去。',
      question:'Which cells are included in B2:B4?',choices:['B2 and B4 only','B2, B3 and B4','All cells in column B'],correct:1,
      word:'Name the symbol between B2 and B4.',answers:['colon',':','：','冒号'],hint:'Read the punctuation between the two cell references.'},
    {title:'Select a range with a drag or two taps',goal:'Include all the cells between the first and last address.',
      grid:[['Supply','Cost RM'],['Tape',9],['Card',14],['Pens',5],['Subtotal',null]],
      cells:['B2','B3','B4'],target:'B5',formula:'=SUM(B2:B4)',range:true,steps:[
        'In Excel, select the result cell B5 and start typing =SUM(. Start the range on B2, where the first cost sits.',
        'Drag down through B3 to B4. The outline covers all three costs. On a tablet, use the selection handles if shown, or type B2:B4.',
        'Close the bracket and confirm. Below, practise selecting the range by dragging or tapping the first and last cells.'
      ],zh:'先选 B2，再拖到 B4；也可以先点 B2，再点 B4。选区包括 B2、B3、B4。也可直接输入 B2:B4。',
      question:'Why does dragging from B2 to B4 also include B3?',choices:['B3 is between the endpoints','SUM ignores the endpoints','Excel always adds the whole column'],correct:0,
      word:'Type the range from B2 through B4.',answers:['B2:B4','B2：B4'],hint:'Type the first address, a colon, and the last address.'},
    {title:'Combine SUM and arithmetic',goal:'Use a subtotal inside a larger calculation.',
      grid:[['Expense','Cost RM','Budget RM','Money left'],['Labels',6,50,26],['Bags',10],['Signs',8]],
      cells:['B2','B3','B4','C2'],target:'D2',formula:'=C2-SUM(B2:B4)',steps:[
        'Find the cost of all items: SUM(B2:B4) adds RM6 + RM10 + RM8 to make RM24.',
        'The budget is RM50 in C2. Subtract the subtotal from the budget: =C2-SUM(B2:B4). The result in D2 is RM26.',
        'You can also put SUM in its own cell and refer to it in another formula. For example, if the subtotal is in D5, =C2-D5 gives the same money left.'
      ],zh:'SUM(B2:B4) 先算总支出 RM24。用 C2 的预算减去总支出，剩 RM26。也可先把总支出算在另一格，再引用那格。',
      question:'What happens if the cost in B4 increases by RM2?',choices:['Money left increases by RM2','Money left stays the same','Money left decreases by RM2'],correct:2,
      word:'Type the function name that adds all the values in a range.',answers:['SUM','求和'],hint:'Look at the word before the opening bracket in the formula.'}
  ];
  const zhChecks=[
    ['哪个单元格存放一个徽章的价格？','输入公式开头的符号。',null],
    ['如果第二盒的数量从 7 变为 9，D2 显示什么？','输入加法符号。',null],
    ['哪个公式能算出剩下的数量？','输入减法符号。',null],
    ['多订一个钥匙扣，总价会怎样变化？','输入 Excel 中的乘法符号。',['增加 RM4','增加 RM6','不变']],
    ['哪个公式能算出每组支付的金额？','输入 Excel 中的除法符号。',null],
    ['哪个数需要除以组数？','用什么把需要一起计算的部分括起来？',['只有捐款','全部剩余金额','只有每盒的价格']],
    ['B2:B4 包含哪些单元格？','写出 B2 和 B4 中间的符号名称。',['只有 B2 和 B4','B2、B3 和 B4','B 列所有单元格']],
    ['从 B2 拖到 B4 时，为什么也选中 B3？','输入从 B2 到 B4 的范围。',['B3 在两个端点中间','SUM 忽略端点','Excel 总是加整列']],
    ['如果 B4 的费用增加 RM2，剩余金额会怎样变化？','输入求总和的函数名称。',['增加 RM2','不变','减少 RM2']]
  ];
  [...cards,...sum].forEach((c,i)=>[c.zhQuestion,c.zhWord,c.zhChoices]=zhChecks[i]);
  window.FormulaReading={2:cards,18:sum};
})();
