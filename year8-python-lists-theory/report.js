window.ListsReport = (() => {
  const label=status=>({'correct':'Checks met','reflected':'Reflection saved','needs-help':'Needs help','needs-review':'Attempted — review needed','in-progress':'In progress','not-completed':'Not completed'})[status]||'Not completed';
  const english=v=>typeof v==='object'&&v!==null?v.en:v;
  let currentBody,root,pages;
  function newPage(){const page=document.createElement('section');page.className='report-page';currentBody=document.createElement('div');currentBody.className='report-body';page.append(currentBody);root.append(page);pages.push(page);}
  function add(tag,text){if(/^h[123]$/.test(tag)&&currentBody.scrollHeight>800)newPage();const el=document.createElement(tag);el.textContent=text;currentBody.append(el);if(currentBody.scrollHeight>900&&currentBody.children.length>1){el.remove();newPage();currentBody.append(el);}return el;}
  function chunks(tag,text,size=850){
    const source=String(text??'');if(!source){add(tag,'(none)');return;}
    // Split long text and code so imported/pasted work never exceeds one page.
    const lines=source.split('\n');let block='';
    for(let line of lines){while(line.length>size){if(block){add(tag,block);block='';}add(tag,line.slice(0,size));line=line.slice(size);}if(block.length+line.length>size||block.split('\n').length>=18){add(tag,block);block='';}block+=(block?'\n':'')+line;}
    if(block)add(tag,block);
  }
  async function build(state,evidence){
    root=document.getElementById('report-root');root.replaceChildren();pages=[];newPage();await document.fonts.ready;
    add('h1','Year 8 · Python Lists — Rescue Kit');
    add('p',`Name: ${state.name}     Class: ${state.className}\nReport generated: ${new Date().toLocaleString()}\nStarted: ${new Date(state.started).toLocaleString()}\nReading support: ${({en:'English',zh:'English + Mandarin',ko:'English + Korean'})[state.language]}${state.teacher?'\nTEACHER PREVIEW — NOT STUDENT ASSESSMENT':''}`);
    add('h2','Learning goals');
    add('p','WAGBA: We are getting better at using Python lists to store, display and update related values.');
    add('p','Knowledge: lists store related values; elements have indexes.\nSkills: create, print, read and update a list.\nUnderstanding: indexes start at 0; an update replaces rather than adds an element.\nKeywords: list, element, index, string, assignment, update.\nChallenge: repair a list update and explain the correct element.');
    add('p','This report records attempts and support, not an automatically awarded grade. Open reflections and explanations require teacher judgement.');
    add('h2','Completion summary');
    for(const [id,title]of LESSON.stages){const group=LESSON.cards.filter(c=>c.stage===id&&c.type!=='review');if(!group.length)continue;const attempted=group.filter(c=>state.responses[c.id]?.checkedAt).length;add('p',`${title}: ${attempted}/${group.length} cards attempted${group.every(c=>!state.responses[c.id]?.checkedAt)?' — Not completed':''}`);}
    add('p','Teams submission: '+(state.teamsSubmitted?'Student confirmed Turn in at '+new Date(state.teamsSubmittedAt).toLocaleString():'Not yet confirmed by the student. The app cannot verify Teams.'));
    for(const card of LESSON.cards){
      if(card.type==='review')continue;const r=state.responses[card.id]||{};
      // Keep a question heading with its task and response, rather than stranding
      // a heading or a single status line at a page boundary.
      if(currentBody.scrollHeight>650)newPage();
      add('h2',card.title);add('p','Status: '+label(r.status));chunks('p','Task: '+english(card.question));
      if(state.language!=='en'&&card.question?.[state.language])chunks('p',card.question[state.language]);
      if(card.code&&card.type!=='coding'){add('h3','Given code');chunks('pre',card.code,950);}
      if(card.prefix)chunks('pre','Supplied starting data:\n'+card.prefix,950);
      if(card.type==='choice')chunks('p','Choices:\n'+card.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${english(o)}`).join('\n'));
      if(card.type==='coding'){
        add('h3','Latest code');chunks('pre',r.code||'Not completed',950);add('h3','Latest console output');chunks('pre',r.stdout||'(no output recorded)',950);if(r.error)chunks('p','Python error: '+r.error);
      }else{
        let answer='Not completed';if(r.answer!==undefined){if(card.type==='choice')answer=english(card.options[r.answer])||'Not completed';else if(card.type==='checklist')answer=(r.answer||[]).map(i=>english(card.options[i])).join('\n')+(r.stillLearning?'\nStill needs help with these goals.':'');else answer=String(r.answer);}
        chunks('p','Response: '+(answer||'No goals selected'));
      }
      if(r.feedback)chunks('p','Feedback: '+r.feedback.message);
      if(r.hintShown||r.helpRequested)add('p',(r.hintShown?'Hint opened: Yes. ':'')+(r.helpRequested?'Help requested: '+new Date(r.helpRequested).toLocaleString():''));
      const attempts=r.attempts||[];if(attempts.length){add('h3',`Attempt history (${attempts.length})`);for(const [index,a]of attempts.entries()){
        add('p',`Attempt ${index+1} · ${new Date(a.time).toLocaleString()} · ${a.ok?'Check met':'Review needed'}`);
        if(a.code)chunks('pre',a.code,950);if(a.stdout)chunks('pre','Output:\n'+a.stdout,950);if(a.error)chunks('p','Error: '+a.error);
        if(a.answer!==undefined){let answer=a.answer;if(card.type==='choice')answer=english(card.options[a.answer]);else if(Array.isArray(a.answer))answer=a.answer.map(i=>english(card.options?.[i])||i).join('; ');chunks('p','Answer: '+String(answer));}
        if(a.message)chunks('p',a.message);
      }}
      if(card.evidence&&evidence){add('h3','Uploaded evidence');const img=document.createElement('img');img.alt=evidence.caption||'Student screenshot';await new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;img.src=evidence.data;});currentBody.append(img);if(currentBody.scrollHeight>900){img.remove();newPage();currentBody.append(img);}chunks('p','Caption: '+(evidence.caption||'(no caption)'));}
    }
    pages.forEach((p,i)=>{const footer=document.createElement('div');footer.className='report-footer';footer.textContent=`${state.name} · ${state.className} · Python Lists     |     Page ${i+1} of ${pages.length}`;p.append(footer);});
    return pages;
  }
  async function exportPDF(state,evidence,filename){
    const pages=await build(state,evidence);const pdf=new jspdf.jsPDF({unit:'mm',format:'a4',compress:true});
    for(let i=0;i<pages.length;i++){
      const canvas=await html2canvas(pages[i],{scale:1.4,backgroundColor:'#ffffff',logging:false});
      if(i)pdf.addPage();const h=190*canvas.height/canvas.width;pdf.addImage(canvas.toDataURL('image/jpeg',0.86),'JPEG',10,9,190,Math.min(279,h),undefined,'FAST');
      canvas.width=canvas.height=0;
    }
    pdf.save(filename);
  }
  return {build,exportPDF};
})();
