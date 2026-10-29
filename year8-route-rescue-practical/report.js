window.RouteReport=(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function lines(state,L){
    const out=['YEAR 8 · ROUTE RESCUE · PYTHON LISTS PRACTICAL',state.name+' | Class '+state.className,'Created: '+state.createdAt,'Latest save: '+state.updatedAt,'Language support: '+state.language+' | Practice route: '+state.route,'Storage: independent work on this device; joined live-round responses shared privately with teacher.','',
      'TOPIC: Creating, reading and updating Python lists.','WAGBA: We are getting better at using indexes to read and change values in a Python list.','KNOWLEDGE: Identify lists, elements and indexes.','SKILLS: Create, print, retrieve and update.','UNDERSTANDING: An indexed update replaces one element; the others stay unchanged.','KEYWORDS: list, element, index, retrieve, update, output.','CHALLENGE: Repair a route without rewriting the whole list.',''];
    for(const c of L.cards){const r=state.responses[c.id];out.push('────────────────────────────────────────',L.stages.find(s=>s[0]===c.stage)[1].toUpperCase()+' · '+c.title,c.type==='mission'&&r?.readingViewed?'Status: Viewed — reading comprehension not verified':r?.passed?'Status: Achieved / response recorded':'Status: Not completed');
      if(c.type==='coding'){
        out.push('Brief: '+c.task.en);if(c.task[state.language]&&state.language!=='en')out.push(c.task[state.language]);
        out.push('Prediction: '+(r?.prediction||'Not answered'),'Hints opened: '+(r?.hints||0),'Help requested: '+(r?.help?'Yes':'No'));
        if(r?.target)out.push('Chosen target: '+JSON.stringify(r.target));
        out.push('Current code:',r?.code||'Not started','Latest output:',r?.lastOutput||'No output recorded');
        if(r?.feedback)out.push('Latest feedback: '+r.feedback.message);
        out.push('CODE ATTEMPT HISTORY ('+(r?.runs?.length||0)+')');
        for(const [i,a]of(r?.runs||[]).entries()){out.push('Attempt '+(i+1)+' | '+a.at,'Prediction: '+(a.prediction||'Not answered'),'Code:',a.code,'Output:',a.output||'(No output)',a.error?'Python message: '+a.error:'Python completed.',a.feedback?.passed?'Task result: Target achieved':'Task result: Not yet achieved','Feedback: '+(a.feedback?.message||''));for(const input of a.inputs||[])out.push('Console input: '+input.prompt+' '+input.value);if(a.secondTest)out.push('Second test output: '+a.secondTest.output,'Second test error: '+(a.secondTest.error||'None'));}
      }else if(c.type==='choice'){out.push('Question: '+c.question.en,'Answer: '+(r?.choice!=null?c.options[r.choice]:'Not answered'),'Correct answer: '+c.options[c.answer]);}
      else if(c.type==='learning'){out.push(...RouteReflection.reportLines(state,L,'learning'));}
      else if(c.type==='pit'){out.push(...RouteReflection.reportLines(state,L,'pit'));}
      else if(c.type==='report')out.push('Student confirms Teams turn-in: '+(state.uploaded?'Yes — self-reported, not verified':'Not confirmed'));
      out.push('');
    }
    out.push('LIVE CODING RESPONSES','Original attempts and model-supported corrections are separate. Downloaded drafts may include work not yet sent to the classroom.');
    for(const r of Object.values(state.live||{})){out.push('Round '+r.round+' · '+r.kind,'Code:',r.code,'Output:',r.output||'(No output)',r.error||'','Classroom sync: '+(r.synced?'Saved':'Not confirmed'),'Student sent this version: '+(r.submitted?'Yes':'No'));for(const a of r.runs||[])out.push('Run '+a.at,a.code,a.output,a.error||'');}
    out.push('RESPONSE HISTORY','Draft edits are retained in the JSON backup. Other recorded input changes follow.');
    for(const e of state.events.filter(e=>!['code-edit','navigate','run'].includes(e.type)))out.push(e.at+' | '+e.card+' | '+e.type+' | '+JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k])=>!['at','card','type','previousCode'].includes(k)))));
    return out.flatMap(s=>String(s).split('\n'));
  }
  function pages(state,L){
    const wrapped=[];
    for(const line of lines(state,L)){const limit=/[^\u0000-\u024f]/.test(line)?45:87;let s=line;if(!s)wrapped.push('');while(s.length>limit){const space=s.lastIndexOf(' ',limit),cut=space>limit*.65?space:limit;wrapped.push(s.slice(0,cut));s=s.slice(cut+(cut===space?1:0));}if(s)wrapped.push(s);}
    const chunks=[];for(let i=0;i<wrapped.length;i+=49)chunks.push(wrapped.slice(i,i+49));
    return chunks.map((chunk,i)=>{const sheet=document.createElement('section');sheet.className='report-sheet';sheet.innerHTML='<h2>'+esc(state.name)+' · '+esc(state.className)+'</h2><pre style="font-size:12px;line-height:18px;background:transparent;padding:0;margin:0">'+esc(chunk.join('\n'))+'</pre><div class="page-footer">Route Rescue · '+esc(state.name)+' · '+esc(state.className)+'<span style="float:right">'+(i+1)+' / '+chunks.length+'</span></div>';return sheet;});
  }
  async function pdf(state,L){
    if(!window.jspdf||!window.html2canvas)throw new Error('A local PDF library could not load.');
    await document.fonts.ready;const container=document.createElement('div');container.className='report-render';const sheets=pages(state,L);document.body.append(container);
    try{const doc=new jspdf.jsPDF({unit:'mm',format:'a4',compress:true});for(let i=0;i<sheets.length;i++){container.replaceChildren(sheets[i]);if(i)doc.addPage();const canvas=await html2canvas(sheets[i],{scale:1.6,backgroundColor:'#fff',logging:false,scrollX:0,scrollY:0,windowWidth:1200,windowHeight:1300});doc.addImage(canvas.toDataURL('image/jpeg',.92),'JPEG',0,0,210,297);canvas.width=canvas.height=1;}const name=('Year8_'+state.className+'_'+state.name+'_Route_Rescue.pdf').replace(/[^\p{L}\p{N}_.-]/gu,'_');doc.save(name);}finally{container.remove();}
  }
  function print(state,L){document.querySelector('.print-report')?.remove();const div=document.createElement('div');div.className='print-report';div.hidden=true;pages(state,L).forEach(p=>div.append(p));document.body.append(div);window.print();}
  return {pdf,print,pages,lines};
})();
