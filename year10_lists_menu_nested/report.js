/* Paginated evidence export. Nothing is uploaded to Teams by this file. */
(() => {
  'use strict';
  const L=window.LISTS_LESSON,C=window.ListsCore;
  const printable=s=>String(s??'').replace(/←/g,'<-').replace(/≠/g,'!=').replace(/≥/g,'>=').replace(/≤/g,'<=').replace(/[–—]/g,' - ').replace(/…/g,'...').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/→/g,' -> ');
  const statusLabels={'unvisited':'Not visited','visited':'Visited; no submitted response','draft':'Draft; not submitted','submitted':'Saved; teacher review needed','correct':'Latest checked answer correct','retry':'Checked answer needs another look','test-passed':'Recorded test matched','test-review':'Test needs review','attempted':'Attempt recorded; not automatically marked','review-later':'Help / return later requested'};
  function readable(p,value){
    if(!value)return '(No response saved.)';
    return p.options?.find(o=>o.id===value)?.label||value;
  }
  async function exportEvidence(notebook,{pendingRun=null,onStatus=()=>{}}={}){
    const n=C.clone(notebook);if(pendingRun){const w=n.workspaces[pendingRun.workspace];if(w)w.runs.push(pendingRun.run);}
    const {jsPDF}=window.jspdf||{};if(!jsPDF)throw Error('The PDF library did not load. Download a notebook backup and refresh.');
    onStatus('Preparing complete evidence…');
    const doc=new jsPDF({unit:'mm',format:'a4',compress:true});
    let bodyFont='helvetica';
    try{
      for(const [style,file] of [['normal','Raleway-Regular.ttf'],['bold','Raleway-Bold.ttf']]){
        const response=await fetch('assets/'+file);if(!response.ok)throw Error('Font unavailable');
        const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
        doc.addFileToVFS(file,btoa(binary));doc.addFont(file,'Raleway',style);
      }bodyFont='Raleway';
    }catch{ /* Built-in font keeps export available if a local font fails. */ }
    const margin=16,width=178,bottom=278;let y=20;
    function newPage(){doc.addPage();y=20;}
    function ensure(h){if(y+h>bottom)newPage();}
    function text(value,{size=10.5,bold=false,mono=false,gap=3,color=[31,43,35]}={}){
      doc.setFont(mono?'courier':bodyFont,bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);
      const lineHeight=size*.3528*1.48;
      const paragraphs=printable(value).split('\n');
      for(const paragraph of paragraphs){
        const lines=paragraph===''?['']:doc.splitTextToSize(paragraph,width);
        for(const line of lines){ensure(lineHeight);doc.text(line,margin,y);y+=lineHeight;}
      }y+=gap;
    }
    function heading(label){ensure(18);y+=4;text(label,{size:15,bold:true,color:[0,92,63],gap:4});}
    function rule(){ensure(5);doc.setDrawColor(203,216,207);doc.line(margin,y,194,y);y+=7;}
    text('TENBY · YEAR 10 COMPUTER SCIENCE',{size:10,bold:true,color:[0,92,63]});
    text('Lists, traversal and nested menus',{size:21,bold:true,gap:6});
    text(n.name+' | '+n.className,{size:14,bold:true});
    text('Exported: '+new Date().toLocaleString('en-GB',{timeZone:'Asia/Kuala_Lumpur'})+' (Malaysia)',{size:9});
    text('This is a record of saved work, not a predicted grade. Unchecked responses, errors and unfinished attempts are included.',{size:10});
    rule();
    const stat=C.statistics(n);
    text('Evidence summary',{size:14,bold:true});
    text('Core pages visited: '+stat.visited+'/'+stat.total+'. Latest objective checks correct: '+stat.checks+'/'+stat.checkTotal+'. Recorded core test cases matched: '+stat.tests+'/'+stat.testTotal+'.');
    text('WAGBA: '+L.wagba);
    for(const k of L.ksu)text(k.name+': '+k.can,{size:10});
    heading('Submit this PDF in Microsoft Teams');
    text('1. Save the PDF, then open it and check your name, code, outputs and images.\n2. Open Year 10 Computer Science > Assignments > the Lists and Menu assignment.\n3. Choose Add work / Attach, upload this PDF, then select Turn in.\n4. If the assignment is not available, keep this PDF and ask your teacher where to submit it.');
    text('Exporting or recording completion in this app does not upload or turn in a Teams assignment.',{bold:true,size:10});
    newPage();
    let group=null;
    for(const p of L.pages){
      const r=n.pages[p.id];if(p.optional&&!r)continue;
      if(group!==p.group){if(y>35)newPage();group=p.group;heading(L.groups.find(g=>g.id===p.group)?.name||p.group);}
      ensure(25);text(p.title,{size:12,bold:true,gap:2});
      text('KSU: '+p.ksu+' | Specification: '+p.syllabus.join(', ')+' | '+(statusLabels[r?.status]||'Not visited'),{size:8.5,color:[88,101,93],gap:3});
      if(p.prompt)text('Task: '+p.prompt,{size:10,bold:true});
      if(r?.visitedAt&&p.context)text('Context: '+p.context,{size:9.5});
      if(r?.visitedAt&&p.code){text('Question code',{size:9.5,bold:true});text(p.code,{mono:true,size:9.5});}
      if(r?.visitedAt&&p.image)text('Visual reference: '+p.image.alt,{size:9.5});
      if(p.kind==='info'){text(r?.visitedAt?'Reading page visited. Visiting is not proof of understanding.':'Reading page not visited.',{size:9.5});if(p.reading)text(p.reading,{size:9});}
      else if(p.kind==='finish')text(n.submittedAt?'Notebook completion recorded: '+n.submittedAt:'Notebook completion not recorded.',{size:9.5});
      else if(p.kind==='extensions')text('Optional bank: only attempted challenges are included below.',{size:9.5});
      else if(!r)text('No response or attempt saved.',{size:10});
      else {
        if(r.answer)text('Current response: '+readable(p,r.answer));
        else if(!['code','test'].includes(p.kind))text('No response saved.');
        if(r.submittedAnswer&&r.answer!==r.submittedAnswer)text('The current response was edited after its last check; it is an unchecked draft.',{size:9.5});
        if(r.evidence)text('Student evidence / note: '+r.evidence);
        if(r.hintUsed)text('Written hint or scaffold used. This is support, not a deduction.',{size:9});
        if(r.help)text('Help request: '+r.help,{size:9.5});
        if(r.attempts?.length){text('Submitted attempts (in order)',{bold:true,size:9.5});for(let i=0;i<r.attempts.length;i++){const a=r.attempts[i];text((i+1)+'. '+readable(p,a.answer)+' ['+(a.marked?(a.correct?'checked correct':'checked; revise'):'not automatically marked')+']',{size:9.5});}}
        if(r.test){const run=C.evidenceRuns(n,p.id).find(x=>x.id===r.test.runId),valid=run&&C.testRun(p.test,run,n.workspaces[p.workspace]?.code).ok;text('Test comparison: '+r.test.message,{size:9.5});if(r.test.ok&&!valid)text('This earlier pass does not establish the current code: the program changed or its matching run is not present. Retest the current version.',{bold:true,size:9.5});}
      }
      if(r?.snapshot?.code&&!p.workspace){text('Program used as reference on this page',{size:9.5,bold:true});text(r.snapshot.code,{mono:true,size:9.5});}
      const runs=C.evidenceRuns(n,p.id);
      if(p.workspace){const w=n.workspaces[p.workspace];text('Workspace: '+p.workspace+' | '+runs.length+' run(s) recorded on this page.',{size:9.5});if(r?.snapshot?.code){text('Saved page snapshot',{size:9.5,bold:true});text(r.snapshot.code,{mono:true,size:9.5});}else if(!w)text('No program started.');}
      for(let i=0;i<runs.length;i++){
        const run=runs[i];heading('Run '+(i+1)+' · '+(run.kind==='repl'?'Shell command':'program')+' · '+(run.ok?'finished':run.stopped?'stopped':'error / unfinished'));
        text('Recorded at '+run.at,{size:8.5});
        text('Actual source for this run',{bold:true,size:10});text(run.code,{mono:true,size:9.5});
        text('Actual inputs: '+JSON.stringify(run.inputs),{size:9.5});
        text('Actual output',{bold:true,size:10});text(run.stdout||run.output||'(No printed output.)',{mono:true,size:9.5});
        if(run.stderr)text('Diagnostics:\n'+run.stderr,{mono:true,size:9.5});
        if(run.error)text('Run note: '+run.error,{size:9.5});
      }
      for(const image of n.images.filter(i=>i.pageId===p.id)){
        newPage();text('Screenshot evidence · '+p.title,{size:12,bold:true});text(image.name,{size:9});
        const props=doc.getImageProperties(image.data);const maxH=bottom-y-5,scale=Math.min(width/props.width,maxH/props.height);
        const iw=props.width*scale,ih=props.height*scale;doc.addImage(image.data,props.fileType||'PNG',margin,y,iw,ih,undefined,'FAST');y+=ih+5;
        text('Complete image fitted proportionally; no cropping.',{size:8});
      }
      rule();
    }
    for(const [id,w] of Object.entries(n.workspaces)){
      if(!w.code&&!w.shell)continue;newPage();heading('Latest workspace · '+id);
      text('This latest draft can differ from earlier run sources. Every run above retains the source actually executed.',{size:9.5});
      text(w.code,{mono:true,size:9.5});
      if(w.shell){heading('Latest Shell transcript');text(w.shell,{mono:true,size:9.5});}
    }
    if(n.feedback.length){newPage();heading('Private teacher feedback');for(const f of n.feedback)text(f.text+'\n'+f.at,{size:10});}
    heading('Study references');
    for(const source of L.sources){text(source.title,{size:9.5,bold:true});if(source.note)text(source.note,{size:9});if(source.url){ensure(8);doc.setFont(bodyFont,'normal');doc.setFontSize(9);doc.setTextColor(0,92,63);doc.textWithLink('Open reference',margin,y,{url:source.url});y+=8;}}
    const pages=doc.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFont(bodyFont,'normal');doc.setFontSize(8);doc.setTextColor(100,110,103);doc.text('Lists and menus · '+n.name+' · '+i+' / '+pages,margin,289);}
    const filename='Y10_LISTS_'+C.safeName(n.name)+'_'+C.safeName(n.className)+'_'+new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kuala_Lumpur'})+'.pdf';
    doc.save(filename);onStatus('PDF saved. Open it, then attach and Turn in separately in Teams.');return {filename,pages};
  }
  window.ListsReport=Object.freeze({exportEvidence,readable,statusLabels});
})();
