(() => {
  const text=v=>String(v??'').trim();
  const display=r=>r?.error?'Formula error: '+r.error:(r?.value??'blank');
  function sections(student,state,sheets,engine,cards) {
    const lines=[{title:'Lesson overview',rows:[
      'Learning goal: Use spreadsheet formulas that update correctly when inputs change.',
      'Starter: '+(state.warm||'Not answered'),
      'Knowledge: '+(state.ksu0||'Not recorded'),
      'Skills: '+(state.ksu1||'Not recorded'),
      'Understanding: '+(state.ksu2||'Not recorded')
    ]}];
    for(const [page,title] of [[2,'Read First: formulas'],[18,'Read First: SUM and ranges']]){
      lines.push({title,rows:cards[page].map((c,i)=>{
        const a=state.reading?.[page]?.cards?.[i];
        return c.title+' | Choice: '+(c.choices[a?.mcq]||'Not answered')+' | Short answer: '+(text(a?.word)||'Not answered')+(a?.range?.length?' | Selected: '+a.range.join(', '):'');
      })});
    }
    const assigned=[['Main Task 1: arithmetic',0,15],['Main Task 2: SUM and arithmetic',15,20],['Extra Challenges',20,25]];
    for(const [title,start,end] of assigned){
      const rows=[];
      for(let i=start;i<end;i++){
        const s=sheets[i], b=state.sheets[i];
        const altered=s.inputs.some(cell=>text(b.cells[cell])!==text(s.cells[cell]));
        const filled=s.checks.some(q=>text(b.cells[q.cell])!==text(s.cells[q.cell])&&text(b.cells[q.cell]));
        const at=i<15?i+3:i+4;
        if(start===20&&!altered&&!filled&&!state.done[at])continue;
        rows.push({label:(i-start+1)+'. '+s.title+(state.done[at]?' (checked)':' (not yet checked)')});
        rows.push('Saved inputs: '+s.inputs.map(cell=>cell+' = '+(text(b.cells[cell])||'blank')).join('   |   '));
        for(const q of s.checks)rows.push(q.cell+': '+(text(b.cells[q.cell])||'Not entered')+'  ->  '+display(engine.evaluate(b.cells,q.cell)));
      }
      lines.push({title,rows:rows.length?rows:['No extra challenges recorded.']});
    }
    lines.push({title:'Learning Pit Stop and plenary',rows:[
      'My learning phase: '+(state.phase||'Not recorded'),
      'What I will practise next: '+(state.nextSkill||'Not recorded'),
      'Exit ticket: '+(text(state.reflection)||'Not answered'),
      'Formula Check (in this app): '+(state.quiz||0)+' / 30 correct'
    ]});
    return lines;
  }
  function create(student,state,sheets,engine,cards) {
    if(!window.jspdf?.jsPDF)throw new Error('The PDF library did not load. Reopen the lesson and try again.');
    const doc=new window.jspdf.jsPDF({unit:'pt',format:'a4',compress:true});
    doc.setProperties({title:'Eco-Budget Formula Lab - Student Evidence',subject:'Year 7 computing practical'});
    // Draw with browser fonts so Mandarin names and answers are preserved.
    const canvas=document.createElement('canvas');canvas.width=1240;canvas.height=1754;
    const g=canvas.getContext('2d'), font='Raleway, "PingFang SC", "Noto Sans CJK SC", sans-serif';
    const w=620,h=877,margin=42,limit=819,lineHeight=17;
    g.scale(2,2);
    let page=0,y=0;
    const write=(s,x,y,size=12,bold=false,color='#232323')=>{
      g.fillStyle=color;g.font=(bold?'700 ':'500 ')+size+'px '+font;g.fillText(s,x,y);
    };
    function wrap(value,size,bold){
      g.font=(bold?'700 ':'500 ')+size+'px '+font;
      const width=w-margin*2, out=[];
      for(const para of String(value).split(/\r?\n/)){
        let line='';
        for(const token of para.match(/\S+\s*|\s+/gu)||['']){
          if(line && g.measureText(line+token).width>width){out.push(line.trimEnd());line='';}
          if(g.measureText(token).width<=width){line+=token;continue;}
          for(const ch of token){
            if(line&&g.measureText(line+ch).width>width){out.push(line.trimEnd());line='';}
            line+=ch;
          }
        }
        out.push(line.trimEnd());
      }
      return out;
    }
    function begin(){
      page++;
      g.fillStyle='#fff';g.fillRect(0,0,w,h);
      write('YEAR 7 COMPUTING  /  PRACTICAL EVIDENCE',margin,43,10,true,'#3a4d5b');
      write('Eco-Budget Formula Lab',margin,72,22,true);
      let yy=96;
      for(const l of wrap(student.name+'  |  '+student.group,12,true)){write(l,margin,yy,12,true);yy+=lineHeight;}
      g.fillStyle='#dad6d1';g.fillRect(margin,yy-3,w-2*margin,1);y=yy+16;
    }
    function finish(){
      g.fillStyle='#dad6d1';g.fillRect(margin,836,w-2*margin,1);
      write('Year 7 Computing  |  Spreadsheet evidence',margin,855,9);
      write('Page '+page,w-90,855,9,true);
      if(page>1)doc.addPage();
      doc.addImage(canvas.toDataURL('image/jpeg',0.9),'JPEG',0,0,doc.internal.pageSize.width,doc.internal.pageSize.height,undefined,'FAST');
    }
    const ensure=n=>{if(y+n>limit){finish();begin();}};
    begin();
    for(const section of sections(student,state,sheets,engine,cards)){
      const reflection=section.title.startsWith('Learning Pit Stop');
      if(reflection){
        const lines=section.rows.flatMap(row=>wrap(row,12,false)).length;
        ensure(26+lines*lineHeight+section.rows.length*3);
      }else ensure(100);
      write(section.title,margin,y,15,true,'#3a4d5b');y+=22;
      for(const [i,row] of section.rows.entries()){
        const bold=typeof row==='object', body=bold?row.label:row, lines=wrap(body,12,bold);
        if(bold){
          let groupHeight=lines.length*lineHeight+2;
          for(let k=i+1;k<section.rows.length&&typeof section.rows[k]==='string';k++)groupHeight+=wrap(section.rows[k],12,false).length*lineHeight+3;
          if(groupHeight<640)ensure(groupHeight+2);
        }else if(lines.length*lineHeight<630)ensure(lines.length*lineHeight+3);
        for(const line of lines){ensure(20);write(line,margin,y,12,bold);y+=lineHeight;}
        y+=bold?2:3;
      }
      y+=9;
    }
    finish();
    const name=[student.group,student.name].map(v=>v.normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu,'_').slice(0,50)).join('_');
    return new File([doc.output('blob')],name+'_Eco_Budget_Evidence.pdf',{type:'application/pdf'});
  }
  window.FormulaEvidence={create};
})();
