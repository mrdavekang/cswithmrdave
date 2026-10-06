(() => {
  'use strict';
  const L=window.DATA_LESSON,M=window.DetectivesModel;
  const clean=s=>String(s??'').replace(/[\u0000-\u001f]/g,' ').slice(0,300);
  const filename=s=>clean(s).replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,65)||'Student';
  function buildPDF(state) {
    if(!M.valid(state))throw new Error('The revision record is incomplete or invalid.');
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    if(window.PDF_FONTS){
      doc.addFileToVFS('Raleway-Regular.ttf',window.PDF_FONTS.regular);
      doc.addFont('Raleway-Regular.ttf','Raleway','normal');
      doc.addFileToVFS('Raleway-Bold.ttf',window.PDF_FONTS.bold);
      doc.addFont('Raleway-Bold.ttf','Raleway','bold');
    }
    const font=window.PDF_FONTS?'Raleway':'helvetica';
    doc.setProperties({title:'Year 11 Data Detectives - '+state.name,author:'Student revision record',subject:'Week 7 Session 2 paper-work evidence'});
    let y=20;
    function page(){doc.addPage();y=20;}
    function need(h){if(y+h>274)page();}
    function line(s,bold=false,size=10){
      doc.setFont(font,bold?'bold':'normal');doc.setFontSize(size);
      const ls=doc.splitTextToSize(clean(s),174);const h=ls.length*5.5;
      need(h+3);doc.text(ls,18,y);y+=h+3;
    }
    function heading(s){need(19);y+=3;line(s,true,13);}
    line('YEAR 11 | TERM 1 - WEEK 7 - SESSION 2',true,10);
    line('Data Detectives: images, sound and compression',true,17);
    line('Name: '+state.name+'     Class: '+state.className);
    line('Saved: '+new Date().toLocaleString());
    line('WAGBA: '+L.wagba);
    line('Written answers are on the attached paper photographs. Blank scores mean not recorded, not zero. Scores and checks are entered by the learner and should be verified against their paper.');
    heading('First-attempt marks');
    for(const [key,label,max] of L.scores){const v=M.firstScore(state,key);line(label+': '+(v===''?'Not recorded':v+' / '+max));}
    heading('Practice and feedback');
    for(const [label,key] of [['Key-term recall attempted','attemptedTerms'],['Main Task 1 attempted','attemptedMain1'],['Main Task 2 attempted','attemptedMain2'],['Core work checked','checkedCore'],['Correction visible on paper','paperCorrection'],['Reason for correction explained','explainedChange'],['Independent plenary attempted','completedExit']])line(label+': '+(state.fields[key]?'Yes':'Not confirmed'));
    for(const [label,key] of [['Main Task 1 support','support1'],['Main Task 2 support','support2'],['Plenary support','supportExit'],['Image retry','retry1'],['Code retry','retry2']])line(label+': '+(state.fields[key]||'Not recorded'));
    heading('Learning reflections');
    for(const [label,key] of [['Learning focus','learningFocus'],['Target','target'],['Learning phase','phase'],['Phase relates to','phaseSkill'],['Next revision topic','nextTopic']])line(label+': '+(state.fields[key]||'Not recorded'));
    L.skills.forEach((s,i)=>line(s+': '+(state.fields['rag'+i]||'Not checked')));
    line('The learner wrote examples and next steps on their revision notebook. Their RAG selections describe their own view, not a predicted grade.');
    if(state.history.length){heading('Recorded checkpoints');for(const h of state.history){line(new Date(h.date).toLocaleString()+' - '+h.kind,true);const scores=L.scores.filter(([k])=>h.fields['score-'+k]!==undefined&&h.fields['score-'+k]!=='').map(([k,label,max])=>label+': '+h.fields['score-'+k]+'/'+max);if(scores.length)line(scores.join('; '));if(h.fields.phase)line('Phase: '+h.fields.phase);}}
    heading('Textbook references');
    for(const [topic,pages,ref] of L.refs)line(topic+' - printed pages '+pages+'; specification '+ref);
    const names={terms:'Key-term recall',core:'Core question paper',notebook:'Revision notebook / plenary',extension:'Optional extension'};
    let count=0;
    for(const group of M.groups){for(const photo of state.photos[group]){
      page();line(names[group]+' - photograph '+(++count),true,13);line(photo.name,false,9);
      const width=174,height=Math.min(233,274-y),scale=Math.min(width/photo.width,height/photo.height);
      const w=photo.width*scale,h=photo.height*scale;
      doc.addImage(photo.data,'JPEG',18+(width-w)/2,y,w,h,undefined,'FAST');y+=h;
    }}
    if(!count)line('No photographs attached. This PDF does not contain evidence of the written answers. Add photographs of your paper work before submitting.');
    const total=doc.getNumberOfPages();
    for(let n=1;n<=total;n++){doc.setPage(n);doc.setDrawColor(100);doc.setLineWidth(.2);doc.line(18,280,192,280);doc.setFont(font,'normal');doc.setFontSize(8);doc.text('Year 11 - Data Detectives',18,286);doc.text(n+' / '+total,192,286,{align:'right'});}
    return doc;
  }
  function downloadJson(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  window.DetectivesPortfolio={buildPDF,filename,downloadJson};
})();
