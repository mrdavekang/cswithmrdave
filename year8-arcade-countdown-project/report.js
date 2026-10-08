/* Unicode-safe, locally generated A4 evidence report. No student data is sent. */
window.CrewReport = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const answer = (f,v) => {
    if(v === undefined || v === '' || v === null) return 'Not answered';
    if(f.type === 'check') return v ? 'Checked by student' : 'Not checked';
    if(f.type === 'choice') return f.options[Number(v)] ?? 'Not answered';
    return String(v);
  };
  function cardStatus(card,s,images) {
    if(card.externalQuiz)return s.answers['opened-link-'+card.link]?'Link opened - results held in Gimkit':'Not opened - no score required to continue';
    if(card.game)return (s.reactorRounds||[]).some(r=>r.status==='complete')?'Played - not graded':s.visited[card.id]?'Visited - play not required':'Not played - play not required';
    if(!s.visited[card.id]) return 'Not completed';
    const complete = card.fields.filter(f=>f.required).every(f=>f.id==='stop-explain'&&s.answers['spoken-proof']===true ? true : f.type==='check' ? s.answers[f.id]===true : s.answers[f.id]!==undefined && String(s.answers[f.id]).trim()!=='');
    const evidence = !card.evidence || images[card.evidence] || s.answers['teacher-evidence']===true;
    const explain = card.id!=='prove' || String(s.answers['stop-explain']||'').trim() || s.answers['spoken-proof']===true;
    if(!card.fields.length && !card.review) return 'Reviewed';
    return complete && evidence && explain ? 'Responses recorded - teacher review needed' : 'Not completed - some work recorded';
  }
  function blocks(s,images) {
    const L=window.LESSON,out=[];
    const add=(text,kind='text')=>out.push({text:String(text),kind});
    add('CS with Mr Dave | Year 8 Computing','small');add(L.title,'title');
    add('Project session | MakeCode Arcade while loops','heading');
    add('Name: '+s.student.name+'    Class: '+s.student.className);
    add('Date: '+new Date().toLocaleDateString('en-GB')+'    Exported: '+new Date().toLocaleString('en-GB'),'small');
    add('Coding route: '+(s.editor==='python'?'Arcade Python':'MakeCode Blocks')+' | Language support: '+({en:'English',zh:'Mandarin',ko:'Korean',ms:'Bahasa Melayu'}[s.language]||'English'));
    if(s.mode==='teacher') add('TEACHER TEST REPORT - not a student assessment','small');
    add('Learning information','heading');add('Topic: '+L.topic);add('WAGBA: '+L.wagba);
    ['Knowledge','Skills','Understanding'].forEach((label,i)=>add(label+': '+L.ksu[i]));
    add('Keywords: counter, condition, while, pause, iteration, test, debug');add('Challenge: '+L.challenge);
    add('Progress summary','heading');
    L.stages.forEach((name,i)=>{
      const cc=L.cards.filter(c=>c.stage===i&&!c.review);
      if(cc[0]?.game||cc[0]?.externalQuiz){add(name+': '+cardStatus(cc[0],s,images),'small');return;}
      const completed=cc.filter(c=>cardStatus(c,s,images).startsWith('Responses recorded')).length;
      add(name+': '+completed+' / '+cc.length+' cards with required responses recorded','small');
    });
    add('Completion ticks and test outcomes are student reports, not automatic checks of code or proof of mastery. MakeCode code is stored separately.','small');
    L.cards.filter(c=>!c.review).forEach(card=>{
      add(L.stages[card.stage]+' - '+card.title,'subheading');
      add(cardStatus(card,s,images),'small');
      if(card.externalQuiz){
        add('Student assignment: '+L.links[card.link],'small');
        add(card.expected,'small');
        const opened=s.answers['opened-link-'+card.link];
        if(opened)add('Link opened: '+opened,'small');
        add('Game responses, scores and completion are recorded separately in Gimkit. Opening this link is not proof of completion. No Gimkit score is required to submit this lesson report.','small');
      }
      if(card.game){
        add('Reactor Rush is a practice break. CPS measures presses per second, not computing attainment. Charging presses are input events, not loop repetitions.','small');
        const rounds=window.CrewReactor.safeRounds(s.reactorRounds);
        if(!rounds.length)add('No rounds played. Playing is not required to continue.','small');
        rounds.forEach((r,i)=>{
          const cps=r.elapsed>0?r.presses/r.elapsed:0;
          add('Play '+(i+1)+': '+(r.type==='normal'?'Round 1':'Round 2')+' | pause '+r.pause+' ms | '+r.iterations+' / 5 repetitions finished | '+r.presses+' presses | '+r.elapsed.toFixed(2)+' s | '+(r.status==='complete'?cps.toFixed(1)+' CPS (not graded)':'Incomplete round; CPS not reported'),'small');
        });
      }
      if(!s.visited[card.id]&&!card.fields.some(f=>s.answers[f.id]!==undefined)) return;
      card.fields.forEach(f=>{
        const v=s.answers[f.id];
        if(card.id==='prove'&&f.id==='stop-explain'&&!v&&s.answers['spoken-proof']) add(f.label+': Student reports a spoken explanation to teacher.');
        else add(f.label+': '+answer(f,v));
        const attempts=s.attempts[f.id]||[];
        if(attempts.length){
          add('Checked attempts: '+attempts.map((a,i)=>(i+1)+'. '+answer(f,a.value)+' ['+(a.correct?'correct':'revisit')+']').join(' | '),'small');
          add('Feedback: '+f.explanation,'small');
        }
      });
      if(card.evidence){
        if(images[card.evidence]){
          add('Screenshot evidence','small');
          out.push({kind:'image',data:images[card.evidence].data,caption:s.answers['evidence-caption']||'Countdown code screenshot'});
          add('Caption: '+(s.answers['evidence-caption']||'Not provided'),'small');
        }else add('Screenshot: '+(s.answers['teacher-evidence']?'Student requested a teacher check instead (not automatically verified).':'Not uploaded'),'small');
      }
    });
    if(s.exportedAt) add('Previous PDF export: '+new Date(s.exportedAt).toLocaleString('en-GB'),'small');
    add('Teams submission: '+(s.teamsSubmitted?'Student reports attaching the PDF and selecting Turn in.':'Not confirmed by student. No automatic Teams verification.'),'small');
    add('Submit your PDF','heading');add('Microsoft Teams > your class > Classwork > the Arcade countdown project assignment. Attach this PDF and select Turn in. Follow the assignment title given by your teacher.');
    return out;
  }
  async function pdf(s,images) {
    if(!window.jspdf?.jsPDF) throw new Error('The local PDF library is unavailable. Use Print / save as PDF instead.');
    await document.fonts.ready;
    const W=1190,H=1684,M=83,BOTTOM=1578,pages=[];
    let ctx,y;
    function page(){
      const c=document.createElement('canvas');c.width=W;c.height=H;ctx=c.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,W,H);
      ctx.font='22px Raleway, Arial, sans-serif';ctx.fillStyle='#506863';ctx.fillText('Year 8 Computing | Countdown Crew',M,48);
      ctx.strokeStyle='#c6d1c8';ctx.beginPath();ctx.moveTo(M,65);ctx.lineTo(W-M,65);ctx.stroke();y=110;pages.push(c);
    }
    function room(h){if(y+h>BOTTOM)page();}
    function wrap(text,width){
      const lines=[];
      for(const row of String(text).split('\n')){
        if(!row){lines.push('');continue;}
        let line='';
        for(const ch of Array.from(row)){
          if(line&&ctx.measureText(line+ch).width>width){
            const cut=line.lastIndexOf(' ');
            if(cut>0){lines.push(line.slice(0,cut));line=line.slice(cut+1)+ch;}else{lines.push(line);line=ch;}
          }else line+=ch;
        }
        lines.push(line);
      }
      return lines;
    }
    page();
    for(const b of blocks(s,images)){
      if(b.kind==='image'){
        const img=new Image();img.src=b.data;await img.decode();
        const h=Math.min(600,(W-2*M)*img.height/img.width),w=h*img.width/img.height;
        room(h+55);ctx.drawImage(img,M,y,w,h);y+=h+23;continue;
      }
      const style={title:[43,800,57],heading:[31,800,45],subheading:[28,750,40],small:[22,450,32],text:[25,450,36]}[b.kind]||[25,450,36];
      const font=()=>{ctx.font=style[1]+' '+style[0]+'px Raleway, Arial, "PingFang SC", "Apple SD Gothic Neo", sans-serif';ctx.fillStyle='#172e30';};
      font();const lines=wrap(b.text,W-2*M);
      // Keep ordinary answers together when they fit on one page.
      const keepTogether=!['title','heading','subheading'].includes(b.kind)&&lines.length*style[2]+25<BOTTOM-110;
      if(keepTogether){room(lines.length*style[2]+25);font();}
      if(['title','heading','subheading'].includes(b.kind)){room(Math.min(lines.length,4)*style[2]+165);y+=13;}
      for(const line of lines){if(!keepTogether)room(style[2]+10);font();ctx.fillText(line,M,y);y+=style[2];}
      y+=b.kind==='small'?8:13;
    }
    const doc=new window.jspdf.jsPDF({unit:'pt',format:'a4',compress:true});
    pages.forEach((c,i)=>{
      const cx=c.getContext('2d');cx.font='21px Raleway, Arial, sans-serif';cx.fillStyle='#506863';cx.fillText('Lesson evidence | '+s.student.className,M,H-48);cx.textAlign='right';cx.fillText('Page '+(i+1)+' of '+pages.length,W-M,H-48);cx.textAlign='left';
      if(i)doc.addPage();doc.addImage(c.toDataURL('image/jpeg',.94),'JPEG',0,0,595.28,841.89,undefined,'FAST');
    });
    doc.setProperties({title:'Countdown Crew - '+s.student.name,subject:'Year 8 Arcade project evidence',author:'CS with Mr Dave'});
    return doc.output('blob');
  }
  function html(s,images){return blocks(s,images).map(b=>b.kind==='image'?'<img src="'+b.data+'" alt="Student screenshot evidence">':b.kind==='title'?'<h1>'+esc(b.text)+'</h1>':['heading','subheading'].includes(b.kind)?'<'+(b.kind==='heading'?'h2':'h3')+'>'+esc(b.text)+'</'+(b.kind==='heading'?'h2':'h3')+'>':'<p class="report-response">'+esc(b.text)+'</p>').join('');}
  const filename=s=>'Year8_'+[s.student.className,s.student.name,'Arcade_Countdown_Project'].map(v=>String(v).normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu,'_').replace(/^_+|_+$/g,'').slice(0,70)||'Student').join('_')+'.pdf';
  return {pdf,html,blocks,answer,cardStatus,filename};
})();
