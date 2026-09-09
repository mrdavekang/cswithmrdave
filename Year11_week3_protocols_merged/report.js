(() => {
'use strict';
function build(state,L,cardsOnly=false){const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4',compress:true});let font='helvetica';if(window.PDF_FONTS){doc.addFileToVFS('Raleway.ttf',window.PDF_FONTS.regular);doc.addFont('Raleway.ttf','Raleway','normal');doc.addFileToVFS('RalewayBold.ttf',window.PDF_FONTS.bold);doc.addFont('RalewayBold.ttf','Raleway','bold');font='Raleway';}doc.setFont(font);doc.setProperties({title:'Week 3 Protocols and TCP/IP - '+state.name,author:'Mr Dave',subject:cardsOnly?'Student-created protocol cards':'Lesson evidence'});let y=23;const width=174,bottom=274;
const clean=v=>String(v??'').replace(/\r\n/g,'\n').replace(/\t/g,'    ');
const page=()=>{doc.addPage();y=23;};
function text(value,size=11,bold=false){doc.setFont(font,bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(clean(value),width);for(const line of lines){if(y+size*.45>bottom)page();doc.text(line,18,y);y+=size*.49;}y+=2;}
function heading(t){if(y>240)page();y+=3;text(t,15,true);}
function answer(label,v){if(y>251)page();text(label,10,true);text(String(v??'').trim()?v:'Not recorded',11);}
function photo(p){const props=doc.getImageProperties(p.data),scale=Math.min(width/props.width,200/props.height),w=props.width*scale,h=props.height*scale;if(y+h+25>bottom)page();heading('Photograph');if(y+h>bottom)page();doc.addImage(p.data,props.fileType||'JPEG',18,y,w,h);y+=h+6;answer('Caption',p.caption||p.name||'Not recorded');}
function card(c,i){heading('Card '+(i+1)+' · '+(c.protocol||'Protocol not recorded'));answer('Front — question',c.prompt);answer('Back — protocol',c.protocol);answer('Back — purpose',c.purpose);answer('Back — layer',c.layer);answer('Follow-up question',c.follow);text('Checked against reading: '+(c.checked?'Yes':'Not recorded'),10);}
text('YEAR 11 COMPUTER SCIENCE',11,true);text(cardsOnly?'My protocol cards':'Protocols and TCP/IP',22,true);text('Term 1 · Week 3 · Sessions 2 & 3 combined',11);text(state.name+' · '+state.cls+' · '+state.date,11);text('WAGBA: Explaining how data travels between devices and why different protocols are needed.',11);
if(cardsOnly){state.cards.forEach((c,i)=>{if(i)page();card(c,i);});}
else{for(const s of L.stages.filter(s=>!['overview','resources','report'].includes(s.id))){
page();heading(s.title);
const hasWork=L.fields.some(f=>f.stage===s.id&&String(state.fields[f.key]??'').trim())||(state.photos[s.id]||[]).length>0||(s.id==='main1'&&(state.cards.some(c=>c.prompt.trim()||c.purpose.trim())||state.peers.some(r=>r.first.trim()||r.retry.trim())));
text(hasWork?'Work recorded':state.status[s.id]?'Recorded as attempted':'No work recorded',10);
if(s.optional)text('Optional practice · 13 marks. Not attempted is not a zero score.',10);
for(const f of L.fields.filter(f=>f.stage===s.id))answer(f.label,state.fields[f.key]);
if(s.id==='main1'){
state.cards.forEach(card);state.peers.forEach((r,i)=>{if(y>200)page();heading('Partner recall '+(i+1));answer('Protocol',r.protocol);answer('First answer without notes',r.first);answer('Correction after checking',r.correction);answer('Recall on a later attempt',r.retry);});}
for(const x of state.feedback[s.id]||[]){heading('Saved feedback and improvement');answer('Feedback',x.note);answer('Improved explanation',x.improvement);text('Responses kept when feedback was recorded',10,true);Object.entries(x.original||{}).forEach(([k,v])=>{if(String(v).trim())answer(k,v);});}
for(const p of state.photos[s.id]||[])photo(p);
}}
const count=doc.getNumberOfPages();for(let i=1;i<=count;i++){doc.setPage(i);doc.setDrawColor(100);doc.setLineWidth(.2);doc.line(18,283,192,283);doc.setFont(font,'normal');doc.setFontSize(8);doc.text('Week 3 · Protocols and TCP/IP',18,289);doc.text(i+' / '+count,192,289,{align:'right'});}return doc;}
window.REPORT={build};
})();
