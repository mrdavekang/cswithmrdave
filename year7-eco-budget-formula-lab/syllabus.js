(() => {
  const e=window.SheetEngine;
  const rows=m=>Object.fromEntries(m.flatMap((r,i)=>r.flatMap((v,j)=>v==null?[]:[[String.fromCharCode(65+j)+(i+1),v]])));
  const widths=[155,125,125,145];
  const spec=(title,story,tip,m,qs,inputs,group)=>{
    const cells=rows(m);
    const model={...cells,...Object.fromEntries(qs.map(([cell,formula])=>[cell,formula]))};
    return {title,story,tip,cells,inputs,widths,group,checks:qs.map(([cell,formula,goal,hint])=>({
      cell,goal,hint,formula,answer:e.evaluate(model,cell).value,
      tests:inputs.map(a=>{
        const override={[a]:cells[a]+2};
        return {override,expected:e.evaluate(model,cell,override).value};
      }),sum:/SUM\(/.test(formula)
    }))};
  };
  const drills=[
    ['Cup delivery','Two boxes arrive at the quiz station.','Box one',18,'Box two',14,'+','cups ready'],
    ['Name tags','Some tags have been put aside for helpers.','Tags available',40,'Set aside',27,'-','tags left'],
    ['Poster order','Every poster costs the same amount.','Posters',3,'RM per poster',4,'*','total cost in RM'],
    ['Kit share','Split the cost of the kits equally.','Total RM',45,'Groups',6,'/','cost per group in RM'],
    ['Ticket count','The fair sold tickets in two sessions.','Morning',32,'Afternoon',27,'+','tickets sold'],
    ['Prize stock','Some prizes have already been handed out.','Starting stock',52,'Handed out',19,'-','prizes still available'],
    ['Refill station','Each crate holds the same number of bottles.','Crates',8,'Bottles per crate',12,'*','number of bottles'],
    ['Fair teams','Everyone should be in a team of the same size.','Pupils',36,'Teams',6,'/','pupils per team'],
    ['Craft paper','The workshop receives two deliveries.','First delivery',75,'Second delivery',48,'+','sheets received'],
    ['Budget change','The class has already paid for its materials.','Budget RM',90,'Paid RM',64,'-','money left in RM'],
    ['Plant labels','Each tray needs the same number of labels.','Trays',7,'Labels per tray',9,'*','labels needed'],
    ['Music club passes','Share the cost of the music club passes equally.','Total RM',126,'Pupils',28,'/','cost per pupil in RM'],
    ['Book swap','Two classes bring books to the swap.','Class 7T',37,'Class 7E',46,'+','books brought'],
    ['Water refill','Pupils have already used some water.','Start (L)',24,'Used (L)',8.5,'-','litres left'],
    ['Badge order','Each badge costs the same price.','Badges',36,'RM each',1.25,'*','total cost in RM'],
    ['Score tokens','Share the tokens equally across tables.','Tokens',84,'Tables',7,'/','tokens per table'],
    ['Stage seating','Combine the seating in both sections.','Section A',44,'Section B',38,'+','seats available'],
    ['Cake stall','The stall started with a full tray.','Pieces at start',60,'Pieces sold',38,'-','pieces still on the tray'],
    ['Welcome packs','Each pack needs the same number of stickers.','Packs',29,'Stickers each',4,'*','stickers required'],
    ['Snack share','Each pupil pays the same share of the bill.','Bill (RM)',135,'Pupils',30,'/','cost per pupil in RM'],
    ['Workshop money','Two groups contribute to one shared fund.','Group A (RM)',42.5,'Group B (RM)',31,'+','total money in RM'],
    ['Trip shortfall','Compare the trip cost with the money already collected.','Cost (RM)',180,'Collected (RM)',157,'-','money still needed in RM'],
    ['Recycled boxes','Every box holds the same number of paper rolls.','Boxes',16,'Rolls each',14,'*','number of rolls'],
    ['Station time','Share the event time equally across stations.','Minutes',90,'Stations',4,'/','minutes per station'],
    ['Snack stall plan','The stall buys snack packs from its budget.','Budget (RM)',96,'Number of packs',24,'mixed','money left in RM']
  ];
  const wording={'+':'Add the two inputs.', '-':'Subtract the second input from the first. Order matters.', '*':'Multiply the two inputs. Type * in a formula.', '/':'Divide the first input by the second. Type / in a formula.',mixed:'Multiply the number of packs by the price per pack first. Subtract that result from the budget.'};
  const arithmetic=[...drills.slice(0,10),...drills.slice(10,14),drills[24]].map(([title,story,a,x,b,y,op,goal],i)=>{
    const swap=i>=10&&i%3===0, aCell=swap?'B3':'B2', bCell=swap?'C3':'C2', target=swap?'D3':'D2';
    const m=[['Record',a,b,'Your result'],['Today',x,y]];
    if(swap){m[1]=['Example',x+5,y+3];m[2]=['Today',x,y];}
    if(op==='mixed')m[2]=['Price per pack',2.5];
    const formula=op==='mixed'?'=B2-(C2*B3)':'='+aCell+op+bCell;
    return spec(title,story,i<10?wording[op]:'Read the headings and choose the operation that matches this job.',m,
      [[target,formula,'Calculate the '+goal+'.',wording[op]+' Use '+aCell+' and '+bCell+(op==='mixed'?' and the price in B3.':'.')]],
      [aCell,bCell,...(op==='mixed'?['B3']:[])],i<10?'guided':'solo');
  });
  const budgets=[
    ['Celebration supplies','cups, cards and posters',[42,20,12],120,'left'],
    ['Workshop fee','paper, pens and tape',[24,18,12],6,'share'],
    ['Book swap budget','labels, bags and signs',[17,26,8],65,'left'],
    ['Fair delivery','seeds, pots and soil',[21,32,19],8,'delivery'],
    ['Trip places','museum places sold on three days',[12,8,14],40,'space'],
    ['Cinema club','three groups’ ticket costs',[36,24,30],15,'share'],
    ['Craft night','card, glue and decorations',[35,22,19],10,'delivery'],
    ['Eco market','three stalls’ supply costs',[58,47,39],130,'left'],
    ['Team kits','bands, cones and bibs',[12,22,16],4,'share'],
    ['Final event order','printing, supplies and prizes',[45,32,24],8,'double']
  ];
  const budget=(title,items,values,amount,mode,group='budget')=>{
    const rules={
      left:['Budget (RM)','Money left','=B6-B5','Calculate how much money is left. A negative result means over budget.','Subtract B5 from B6.'],
      share:['Groups','Cost per group','=B5/B6','Calculate the cost per group.','Divide B5 by B6.'],
      delivery:['Delivery (RM)','Cost with delivery','=B5+B6','Add delivery to the total cost.','Add the total in B5 to B6.'],
      space:['Capacity','Places left','=B6-B5','Find how many places are still available.','Subtract places sold from capacity.'],
      double:['Identical orders','Cost of all orders','=B5*B6','Find the combined cost of all the identical orders.','Multiply the cost of one order by the number of orders.']
    };
    const [label,result,formula,goal,hint]=rules[mode], itemList=items.split(', ').length===3?items.split(', '):items.match(/^([^,]+), (.+) and (.+)$/)?.slice(1);
    return spec(title,'The table lists '+items+'. First work out the subtotal, then use it to answer the second question.',
      'Use SUM with a colon between the first and last value cells. Then refer to the subtotal instead of retyping it.',
      [['Record','Value'],...values.map((v,i)=>[itemList?.[i]||'Entry '+(i+1),v]),['Subtotal'],[label,amount],[result]],
      [['B5','=SUM(B2:B4)','Use SUM to include all three entries.','The range starts at B2 and ends at B4.'],['B7',formula,goal,hint]],
      ['B2','B3','B4','B6'],group);
  };
  const extra=[
    budget('Spot the missing row','cup, banner and ticket costs',[25,40,18],100,'left','extra'),
    budget('Split a tricky bill','paper, paint and kit costs',[26,33,25],8,'share','extra'),
    budget('Order again','cord, pegs and tray costs',[24,15,33],3,'double','extra'),
    budget('A late delivery fee','book, sticker and bag costs',[45,23,17],11,'delivery','extra'),
    budget('Last places at the fair','places booked by three classes',[24,23,29],80,'space','extra')
  ];
  extra[0].cells.B5='=SUM(B2:B3)';
  extra[0].story='The budget looks fine, but the ticket cost was left out. Change the ticket value and watch the subtotal before you repair it.';
  extra[4].tip='Once the formulas work, set the result in bold, centre it and add a bottom border so the organiser can spot it.';
  window.FormulaLesson=[...arithmetic,...[0,1,3,7,9].map(i=>budget(...budgets[i])),...extra];
})();
