'use strict';
window.MissionReport=(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={read:'Read acknowledgement',choice:'Prediction',first:'First printed number',second:'Second printed number',third:'Third printed number',readyK:'Knowledge starting point',readyS:'Skills starting point',readyU:'Understanding starting point',pitK:'Knowledge demonstrated',pitS:'Skills demonstrated',pitU:'Understanding demonstrated',phase:'Learning experience',evidence:'Reflection evidence',explanation:'Stopping-rule explanation',difference:'How while differs from if',stop:'What changes so my loop stops',missing:'Prediction without an update'};
function answerText(c,k,v){if(k==='choice')return c.options?.[Number(v)]??String(v);if(typeof v==='boolean')return v?'Yes':'No';return String(v??'');}
function blocks(s,L,images){
 const out=[];const add=(text,kind='text')=>out.push({text:String(text),kind});
 add('Tenby International School Tropicana Aman','small');add('Year 8 · Week 7 Theory','heading');add(L.title,'title');
 add('Student: '+s.student.name+'    Class: '+s.student.className);add('Date: '+new Date().toLocaleDateString('en-GB'));add('Report exported: '+new Date().toLocaleString('en-GB'));
 add('Learning information','heading');add('Key Topic: '+L.topic);add('WAGBA: '+L.wagba);
 for(const [name,arr] of [['Knowledge',L.knowledge],['Skills',L.skills],['Understanding',L.understanding]]){add(name,'subheading');arr.forEach(x=>add('• '+x));}
 add('Keywords: '+L.keywords);add('Challenge: '+L.challenge);
 add('Completion summary','heading');
 L.stages.filter(([id])=>!['break','review'].includes(id)).forEach(([stage,title])=>{const cards=L.cards.filter(c=>c.stage===stage&&(c.core!==false||s.records[c.id]?.attempted));if(cards.length)add(`${title}: ${cards.filter(c=>s.records[c.id]?.done).length}/${cards.length} attempts submitted`);});
 add('An attempt submitted is not a mark or proof of mastery. Code-test results and teacher review provide evidence.','small');
 for(const [stage,title] of L.stages){if(['break','review'].includes(stage))continue;const cards=L.cards.filter(c=>c.stage===stage&&(c.core!==false||s.records[c.id]?.attempted));if(!cards.length)continue;if(!cards.some(c=>s.records[c.id]?.attempted)){add(title+': Not completed','subheading');cards.forEach(c=>add(c.title+': Not completed','small'));continue;}add(title,'section');
  for(const c of cards){const r=s.records[c.id];add(c.title,'subheading');add(!r?.attempted?'Not completed':r.done?'Attempt submitted':'In progress');
   if(!r?.attempted)continue;
   if(c.body)add(c.body,'small');if(c.question)add(c.question);if(c.code)add(c.code,'code');
   if(r?.answers){for(const [k,v] of Object.entries(r.answers))add((labels[k]||k)+': '+(answerText(c,k,v)||'Not answered'));}
   if(r?.feedback)add('Checked feedback: '+r.feedback.text);
   if(r?.history?.length>1){add('Submitted answers / revisions','subheading');r.history.forEach((h,i)=>{add('Submission '+(i+1)+' · '+new Date(h.at).toLocaleTimeString('en-GB'),'small');Object.entries(h.answers||{}).forEach(([k,v])=>add((labels[k]||k)+': '+answerText(c,k,v)));});}
   if(c.type==='code'&&r?.attempted){add('Current code','subheading');add(r.code||'No code saved','code');
    for(const [i,run] of (r.runs||[]).entries()){add(`Run ${i+1} · ${run.kind||'run'} · ${new Date(run.at).toLocaleTimeString('en-GB')}`,'subheading');if(run.code===r.code)add('Code: current version shown above.','small');else add(run.code||'','code');add('Console transcript','small');add(run.transcript||'(No console output)','code');if(run.result?.error&&!run.transcript?.includes(run.result.error))add('Execution feedback: '+run.result.error,'code');}
    for(const [i,test] of (r.tests||[]).entries()){add('Test attempt '+(i+1)+(test.code!==r.code?' — earlier version of code':''),'subheading');if(test.code===r.code)add('Code: current version shown above.','small');else add(test.code,'code');for(const t of test.results){add((t.pass?'PASSED: ':'NEEDS IMPROVEMENT: ')+t.name);add('Supplied entries: '+(t.inputs?.join(' → ')||'None'),'small');if(t.override)add('Boundary start used by test: '+JSON.stringify(t.override),'small');add('Expected printed output:\n'+t.expect,'code');add('Actual printed output:\n'+(t.output||'(none)'),'code');if(t.error)add(t.error,'code');}}
   }
  }
 }
 if(images.length){add('Image evidence','section');images.forEach(img=>{add(img.caption||img.name,'subheading');out.push({kind:'image',...img});});}
 add('Submission reminder','heading');add('Upload this PDF to the Microsoft Teams assignment named Week 7 Theory, or the equivalent module title set by your teacher. Attach the PDF and select Turn in.');
 add(s.teamsSubmitted?'Student previously confirmed submission in Teams. This website cannot independently verify that submission.':'Teams submission not yet confirmed in this website.','small');
 return out;
}
async function pdf(s,L,images=[]){
 if(!window.jspdf?.jsPDF)throw Error('Local PDF library is missing.');await document.fonts.ready;
 const W=1190,H=1684,M=76,BOTTOM=H-105,pages=[];let canvas,ctx,y;
 function newPage(){canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,W,H);ctx.fillStyle='#52666d';ctx.font='20px Raleway, Arial, sans-serif';ctx.fillText('Year 8 Computing · Mission Loop',M,42);ctx.strokeStyle='#b6c4c9';ctx.beginPath();ctx.moveTo(M,55);ctx.lineTo(W-M,55);ctx.stroke();y=98;pages.push(canvas);}
 function room(h){if(y+h>BOTTOM)newPage();}
 function wrap(text,maxWidth){const result=[];for(const line of String(text).split('\n')){if(!line){result.push('');continue;}let current='';for(const char of Array.from(line)){if(ctx.measureText(current+char).width>maxWidth&&current){const cut=current.lastIndexOf(' ');if(cut>current.search(/\S/)){result.push(current.slice(0,cut));current=current.slice(cut+1)+char;}else{result.push(current);current=char;}}else current+=char;}result.push(current);}return result;}
 newPage();
 const sequence=blocks(s,L,images);
 for(const [index,b] of sequence.entries()){
  if(b.kind==='section'){room(200);ctx.strokeStyle='#b6c4c9';ctx.beginPath();ctx.moveTo(M,y);ctx.lineTo(W-M,y);ctx.stroke();y+=20;}
  if(b.kind==='image'){const img=new Image();img.src=b.data;await img.decode();const width=Math.min(W-2*M,img.width),height=Math.min(600,width*img.height/img.width);const w=height*img.width/img.height;room(height+20);ctx.drawImage(img,M,y,w,height);y+=height+24;continue;}
  const style={title:[42,800,57],heading:[31,800,44],section:[34,800,48],subheading:[27,750,39],small:[22,400,32],code:[23,400,34],text:[24,400,35]}[b.kind]||[24,400,35];
  if(['title','heading','subheading','section'].includes(b.kind))y+=12;
  const setFont=()=>{ctx.font=`${style[1]} ${style[0]}px ${b.kind==='code'?'ui-monospace, Menlo, Consolas, monospace':'Raleway, Arial, "PingFang SC", "Apple SD Gothic Neo", sans-serif'}`;ctx.fillStyle='#15252b';};setFont();const lines=wrap(b.text,W-2*M-18);
  let following=0;const next=sequence[index+1];
  if(b.kind==='subheading'&&next?.kind==='code'){ctx.font='400 23px ui-monospace, Menlo, Consolas, monospace';const n=wrap(next.text,W-2*M-18).length;following=(n<18?n:3)*34+12;setFont();}
  room((b.kind==='code'&&lines.length<18?lines.length:Math.min(lines.length,3))*style[2]+12+following);setFont();
  for(const line of lines){room(style[2]+8);setFont();if(b.kind==='code'){ctx.fillStyle='#f1f4f5';ctx.fillRect(M-8,y-style[0]-2,W-2*M+16,style[2]);ctx.fillStyle='#15252b';}ctx.fillText(line,M,y);y+=style[2];}y+=10;
 }
 const doc=new jspdf.jsPDF({unit:'pt',format:'a4',compress:true});pages.forEach((page,i)=>{const c=page.getContext('2d');c.fillStyle='#52666d';c.font='20px Raleway, Arial, sans-serif';c.fillText('Lesson evidence · '+s.student.className,M,H-53);c.textAlign='right';c.fillText(`Page ${i+1} of ${pages.length}`,W-M,H-53);c.textAlign='left';if(i)doc.addPage();doc.addImage(page.toDataURL('image/jpeg',.94),'JPEG',0,0,595.28,841.89,undefined,'FAST');});
 doc.setProperties({title:L.title+' — '+s.student.name,subject:'Year 8 Week 7 Theory evidence',author:'Tenby International School Tropicana Aman'});return doc.output('blob');
}
function html(s,L,images=[]){return blocks(s,L,images).map(b=>{if(b.kind==='image')return `<img src="${b.data}" alt="${esc(b.caption||b.name)}">`;if(b.kind==='code')return `<pre>${esc(b.text)}</pre>`;if(b.kind==='title')return `<h1>${esc(b.text)}</h1>`;if(['heading','section'].includes(b.kind))return `<h2 class="${b.kind==='section'?'print-section':''}">${esc(b.text)}</h2>`;if(b.kind==='subheading')return `<h3>${esc(b.text)}</h3>`;return `<p>${esc(b.text)}</p>`;}).join('');}
return {pdf,html,blocks};
})();
