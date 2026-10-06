'use strict';
(() => {
  const clean=s=>String(s??'').replace(/←/g,'<-').replace(/→/g,'->').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/≥/g,'>=').replace(/…/g,'...');
  function base(){if(!window.jspdf?.jsPDF)throw Error('The offline PDF library is unavailable. Save a backup and tell your teacher.');const d=new window.jspdf.jsPDF({unit:'pt',format:'a4',compress:true});d.addFileToVFS('Raleway.ttf',window.PDF_FONTS.regular);d.addFont('Raleway.ttf','Raleway','normal');d.setFont('Raleway','normal');d.setProperties({title:'Year 10 - Checkpoint review and definite iteration',author:'Computer Science'});return d;}
  function notebook(state){
    const L=window.Lesson,d=base(),W=d.internal.pageSize.getWidth(),H=d.internal.pageSize.getHeight(),m=43,w=W-2*m;let y=48,page=1;
    const footer=()=>{d.setFont('Raleway','normal');d.setTextColor(95);d.setFontSize(8);d.text('Year 10 - Review, explain, repeat',m,H-25);d.text(String(page),W-m,H-25,{align:'right'});d.setTextColor(25);};
    const next=()=>{footer();d.addPage();page++;y=48;};
    const room=h=>{if(y+h>H-50)next();};
    function text(s,size=11,gap=8,mono=false){d.setFont(mono?'courier':'Raleway','normal');d.setFontSize(size);for(const p of clean(s).replace(/\t/g,'    ').split('\n')){const lines=d.splitTextToSize(p||' ',w);if(lines.length*size*1.5<H-110)room(lines.length*size*1.5+gap);for(const line of lines){room(size*1.5);d.setFont(mono?'courier':'Raleway','normal');d.setFontSize(size);d.text(line,m,y);y+=size*1.5;}}y+=gap;d.setFont('Raleway','normal');}
    const heading=s=>{room(100);y+=6;d.setDrawColor(190);d.setLineWidth(.4);d.line(m,y,W-m,y);y+=25;d.setTextColor(0,105,48);text(s,15,10);d.setTextColor(25);};
    function photos(group){for(const p of state.photos[group]||[]){const prop=d.getImageProperties(p.data);next();text('Evidence image: '+p.filename,11,8);if(p.caption)text('Caption: '+p.caption,10,8);const scale=Math.min(w/prop.width,(H-y-65)/prop.height);d.addImage(p.data,p.data.startsWith('data:image/png')?'PNG':'JPEG',m,y,prop.width*scale,prop.height*scale);y+=prop.height*scale+12;}}
    text('YEAR 10 COMPUTER SCIENCE',16,9);text('Review, explain, repeat',23,16);text('OxfordAQA 9210 - Checkpoint review and definite iteration',11,14);text('Name: '+state.name,12);text('Class: '+(state.className||'Teacher preview'),12);text('Exported: '+new Date().toLocaleString(),10,17);heading('WAGBA and learning intent');text('WAGBA: use evidence and feedback to improve explanations, and control how many times instructions repeat.');text('Knowledge: marking points, definite iteration, counter and bounds.');text('Skills: improve a written response; trace, modify and test a FOR loop.');text('Understanding: explain a correction, loop bounds and indentation.');heading('Evidence boundaries');text('Checkpoint correction and reflection stay on the one-page paper sheet: Find - Fix - Check - Target. Only the chosen question and self-reported explanation status are recorded in the app. Optional complete photos of the sheet may be attached.');text('Responses, evidence levels and checklist confirmations are self-reported. This is not an automatically marked assessment or a record of verified Teams submission. Python is run in the student’s own IDE. Unanswered core items are labelled. Earlier route fields are retained below only if an existing notebook contains them.');next();
    const display=q=>{const v=state.answers[q.id];if(q.kind==='checkbox')return v==='yes'?'Confirmed by student':'Not confirmed';if(!v?.trim())return 'Not answered';return q.options?.find(([k])=>k===v)?.[1]||v;};
    const sections=[...new Set(L.questions.map(q=>q.section))];
    for(const section of sections){const qs=L.questions.filter(q=>q.section===section);if(section.startsWith('Extension ')&&!qs.some(q=>state.answers[q.id]?.trim())&&!(state.photos['ext-'+(Number(section.match(/^Extension (\d+)/)[1])-1)]||[]).length)continue;heading(section);
      if(section==='Main Task 1: paper review')text('Find the missing detail; fix one answer; check a similar example; set one action and success criterion for next lesson. Detailed responses and the teacher check are on paper. The app status does not verify accuracy.',10);
      if(section.startsWith('Extension ')){const i=Number(section.match(/^Extension (\d+)/)[1])-1;text('Task: '+L.extensions[i].task,10);text('Test: '+L.extensions[i].test,10);}
      for(const q of qs){room(70);text(q.label,10,3);text(display(q),q.code?10:11,11,!!q.code);}
      if(section==='Main Task 2: modify and test')photos('program');if(section==='Save and submit')photos('paper');if(section.startsWith('Extension '))photos('ext-'+(Number(section.match(/^Extension (\d+)/)[1])-1));
      if(section==='Learning Pit Stop'){const count=prefix=>{const v=L.targets.map(([id])=>state.answers[prefix+id]);return `${v.filter(x=>x==='independent').length}/6 independent; ${v.filter(x=>x==='support').length}/6 with support; ${v.filter(x=>x==='not-yet').length}/6 not yet; ${v.filter(x=>!x).length}/6 unanswered.`;};text('Starting profile (optional baseline): '+count('before-'),10);text('Final self-reported evidence profile: '+count('after-'),10);text('Learning phase and demonstrated evidence are separate. Neither is an exam grade.',10);}
    }
    const archived=L.legacyQuestions.filter(q=>state.answers[q.id]?.trim());if(archived.length){heading('Archived review record - earlier version');text('These saved fields are retained for continuity. They are not required by the simplified review and do not count toward its progress.',10);for(const q of archived){text(q.label,10,3);text(display(q),11,9);}}
    heading('Optional extension record');L.extensions.forEach((e,i)=>text(`${i+1}. ${e.title}: ${['code','output','explain','status'].some(k=>state.answers['ext-'+i+'-'+k]?.trim())||(state.photos['ext-'+i]||[]).length?'evidence included above':'not attempted / no recorded evidence'}.`,10,5));
    heading('Self-check feedback');if(!state.checkHistory.length)text('No self-checks recorded.');for(const c of state.checkHistory){const q=L.questions.find(q=>q.id===c.id),label=q?.label||({trace:'Counter trace and confirmation count',program:'Compare my program with the model',plenary:'Plenary response comparison'}[c.id]||c.id),answer=q?.options?.find(([k])=>k===c.answer)?.[1]||c.answer;room(90);text(label,10,3);text('Checked: '+new Date(c.time).toLocaleString(),9,3);text('Response at this check: '+answer,10,4,c.id==='program');text(c.message,10,9);}
    heading('Support and walkthrough record');text('Fixed walkthrough steps opened: '+(state.tutorSeen.length?state.tutorSeen.map(i=>i+1).join(', '):'none'),10);if(!state.supportLog.length)text('No support-card requests recorded.',10);for(const s of state.supportLog)text(s.request+' - '+s.page+(s.note?' - '+s.note:''),10,6);
    text('Pages visited: '+state.visited.map(id=>L.pages.find(p=>p.id===id)?.label||id).join('; '),10);room(230);heading('Submit in Microsoft Teams');text('Open this PDF and check all evidence. In the correct Year 10 Computer Science assignment, attach it using Add work / upload and select Turn in. Check the status in Teams. Hand in the paper review sheet as your teacher directs. This website does not upload or confirm submission.');footer();return d;
  }
  // One A4 sheet for everyone. Support changes; the reflection structure does not.
  function reviewSheets(){
    const d=base(),W=595.28,m=42,w=W-2*m;
    function write(s,y,size=10.5){d.setFont('Raleway','normal');d.setFontSize(size);d.setTextColor(25);const lines=d.splitTextToSize(clean(s),w);d.text(lines,m,y,{lineHeightFactor:1.35});}
    function title(s,y){d.setFontSize(13);d.setTextColor(0,105,48);d.text(s,m,y);}
    function line(y){d.setDrawColor(190);d.setLineWidth(.35);d.line(m,y,W-m,y);}
    d.setProperties({title:'Year 10 - One-page checkpoint review and reflection'});
    title('Year 10 - Learning Checkpoint 1',38);
    title('Find - Fix - Check - Target',62);
    write('Name: _______________________  Class: ______  Date: __________',88,11);
    write('Topic: learning checkpoint review and reflection',111);
    write('WAGBA: use feedback to improve one answer and set one useful target.',130);
    write('Knowledge: recall the rule. Skills: correct and check an answer.',149);
    write('Understanding: explain why the correction works.',167);
    write('Keywords: feedback, marking point, correction, evidence, target.',185,10);
    write('Challenge: show the idea works in one similar example.',202,10);
    line(214);
    write('Question: __________   Marks for this question (optional): ____ / ____',235,11);
    title('1. FIND - What needs improving?',258);
    write('Underline it on your marked paper. Copy only the important part here.',277);
    write('I missed / misunderstood...',296,11);line(320);line(342);
    title('2. FIX - Write a better answer or corrected code',365);
    write('Use this question\'s marking points. Keep the meaning in your own words.',384);
    line(410);line(432);line(454);
    write('This works because...',477,11);line(501);
    title('3. CHECK - Show that you understand',525);
    write('Highlight the marking point you now meet. Try one similar value, example',544);
    write('or trace. Record your check and what it shows.',559);
    line(584);line(606);
    title('4. TARGET - One action for next lesson',630);
    write('Circle the focus: Knowledge (recall) / Skills (apply) / Understanding (explain)',649,10);
    write('Next lesson, I will practise...',672,11);line(697);
    write('I will know I am improving when...',722,11);line(747);
    line(764);
    write('Teacher check: not yet / with support / independently. This is not a grade.',783,9.5);
    write('Write, point to or read your explanation. Teacher: revisit this target next lesson.',800,9);
    write('Full marks? Ask for one similar example; explain and apply the credited idea.',817,9);
    return d;
  }
  window.LessonPDF={notebook,reviewSheets};
})();
