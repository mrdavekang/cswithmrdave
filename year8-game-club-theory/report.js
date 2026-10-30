/* Render local HTML page-by-page, so English, Mandarin and Korean use the
   device's readable fonts rather than silently losing CJK in a Latin PDF font. */
const GameReport=(()=>{
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pretty=v=>typeof v==='string'?v:JSON.stringify(v,null,2);
 const title=v=>typeof v==='string'?v:v?.en||'';
 function chunks(value,width=86,rows=25){const lines=[];for(const line of String(value??'').split('\n')){if(!line){lines.push('');continue;}for(let i=0;i<line.length;i+=width)lines.push(line.slice(i,i+width));}const out=[];for(let i=0;i<lines.length;i+=rows)out.push(lines.slice(i,i+rows).join('\n'));return out.length?out:[''];}
 function blocks(s){
  const out=[],push=(heading,text,code=false)=>{for(const [i,part]of chunks(text).entries())out.push(`<h3>${esc(heading)}${i?' · continued':''}</h3><${code?'pre':'div class="report-text"'}>${esc(part)}</${code?'pre':'div'}>`);};
  push('Learning report',`${LESSON.title}\nStudent: ${s.name} · Class: ${s.className}\nDate: ${new Date().toLocaleString()}\nReading support: ${s.language} · Guidance: ${s.guidance}\nStarted: ${s.startedAt}\nLatest local save: ${s.updatedAt}\nTeams: ${s.teamsSubmitted?'Student confirmed turn-in (not verified by Teams)':'Not confirmed'}\n\nWAGBA: ${LESSON.wagba}\n\nKnowledge: ${title(LESSON.goals.K)}\nSkills: ${title(LESSON.goals.S)}\nUnderstanding: ${title(LESSON.goals.U)}\n\nKeywords: ${LESSON.keywords}\nChallenge: ${LESSON.challenge}\n\nChecks are formative evidence, not exam grades. Names are self-entered.`);
  out.push('<h3>Completion summary</h3><table><thead><tr><th>Stage / task</th><th>Current evidence</th></tr></thead><tbody>'+LESSON.cards.map(c=>{const r=s.responses[c.id];return `<tr><td>${esc(c.stage+' · '+c.title)}</td><td>${esc(c.type==='report'?'Included in this export':r?.status==='correct'?'Check met':r?.status==='reflected'?'Reflection saved':r?.status==='viewed'?'Guide confirmed':r?.status==='needs-help'?'Needs help':r?.attempts?.length?'Attempted; needs review':c.stretch||c.level?'Not attempted':'Not completed')}</td></tr>`;}).join('')+'</tbody></table>');
  // Split summary into groups to keep tables within an A4 page.
  const summary=out.pop(),rows=summary.match(/<tr><td>.*?<\/tr>/g)||[];
  for(let i=0;i<rows.length;i+=14)out.push('<h3>Completion summary'+(i?' · continued':'')+'</h3><table><thead><tr><th>Stage / task</th><th>Evidence</th></tr></thead><tbody>'+rows.slice(i,i+14).join('')+'</tbody></table>');
  for(const c of LESSON.cards){const r=s.responses[c.id];if(!r||(!r.code&&!r.typed&&r.answer===undefined&&!r.attempts?.length&&!r.externalOpenedAt))continue;
   push(c.stage+' · '+c.title,`Status: ${r.status}\nTask: ${title(c.question)||title(c.read)}\nHints opened: ${r.hintCount||0}\nHelp requested: ${r.helpRequested?'Yes':'No'}`);
   if(r.answer!==undefined){const a=c.type==='choice'?title(c.options[r.answer])+' (choice '+(r.answer+1)+')':pretty(r.answer);push('Latest response',a);}
   if(r.typed!==undefined)push('Latest typing draft',r.typed,true);
   if(r.typing)push('Typing evidence (not programming mastery)',pretty(r.typing));
   if(c.type==='type-run')push('Type-and-run evidence',`Model run successfully: ${!!r.modelRun}\nChanged version run successfully: ${!!r.changedRun}`);
   if(c.type==='review-game')push('Review game evidence',`Built-in correct answers: ${r.quizCorrect||0} / 50\nExternal Blooket opened: ${r.externalOpenedAt||'Not opened'}\nExternal completion is recorded in Blooket, not verified here.`);
   if(r.code!==undefined){push('Latest code draft',r.code,true);push('Latest console',r.transcript||r.stdout||'(no output)',true);if(r.error)push('Latest Python error',r.error);}
   if(r.feedback)push('Latest feedback',r.feedback.message);
   for(const [i,a]of(r.attempts||[]).entries()){
    push('Attempt '+(i+1),`${a.at}\n${a.ok===undefined?'Recorded response':a.ok?'Check met':'Needs revision'}\n${a.feedback||''}`);
    if(a.answer!==undefined)push('Attempt response',c.type==='choice'?title(c.options[a.answer]):pretty(a.answer));
    if(a.goal)push('Diagnostic response',pretty(a));
    if(a.kind==='quiz')push('Review question '+(a.question+1),GAME_REVIEW.questions[a.question].q+'\nChosen: '+GAME_REVIEW.questions[a.question].options[a.answer]+'\n'+(a.ok?'Correct':'Needs review'));
    if(a.kind==='typing')push('Typed text',a.typed,true);
    if(a.code!==undefined){push('Code in this attempt',a.code,true);push('Console in this attempt',a.transcript||a.stdout||'(no output)',true);if(a.error)push('Error in this attempt',a.error);}
    if(a.tests)for(const t of a.tests)push('Test · '+t.label,`${t.input?'Changed data: '+pretty(t.input)+'\n':''}${t.ok?'Passed':'Not passed'}\n${t.stdout||'(no output)'}${t.error?'\n'+t.error:''}`,true);
   }
  }
  push('Support and navigation record','The teacher can view the full private input timeline in Teacher records. This PDF includes latest responses/drafts, code attempts, diagnostic choices, help requests, console inputs and meaningful draft revisions. It is not a record of other tabs.');
  for(const e of(s.activity||[])){if(['field','support','console_input'].includes(e.kind))push('Input record · '+e.card+' · '+e.at,pretty(e.data),e.data?.field==='code');}
  return out;
 }
 async function prepare(s){
  const host=document.querySelector('#report-render');host.replaceChildren();await document.fonts.ready;
  let page;const newPage=()=>{page=document.createElement('section');page.className='report-page';page.innerHTML='<p style="font-size:11px;border-bottom:1px solid #999;padding-bottom:7px">YEAR 8 · GAME CLUB · '+esc(s.name)+' · '+esc(s.className)+'</p>';host.append(page);};newPage();
  for(const html of blocks(s)){const block=document.createElement('div');block.innerHTML=html;page.append(block);if(page.scrollHeight>1123){block.remove();newPage();page.append(block);}if(page.scrollHeight>1123)throw Error('A report block is too tall to print safely. Download a JSON backup and tell your teacher.');}
  return [...host.children];
 }
 async function exportPDF(s){const pages=await prepare(s),pdf=new jspdf.jsPDF({unit:'pt',format:'a4',compress:true});for(const[i,page]of pages.entries()){window.dispatchEvent(new CustomEvent('gameclub-report-progress',{detail:{page:i+1,total:pages.length}}));if(i)pdf.addPage();const canvas=await html2canvas(page,{scale:1.6,backgroundColor:'#fff',logging:false});pdf.addImage(canvas.toDataURL('image/jpeg',.86),'JPEG',0,0,595.28,841.89);pdf.setFontSize(9);pdf.text(String(i+1)+' / '+pages.length,550,822,{align:'right'});}const filename=('Year8_'+s.className+'_'+s.name+'_GameClub_Theory.pdf').replace(/[^\p{L}\p{N}._-]/gu,'_');pdf.save(filename);return filename;}
 async function print(s){await prepare(s);window.print();}
 return {export:exportPDF,print,prepare};
})();
