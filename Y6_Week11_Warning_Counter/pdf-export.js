/* Local-only PDF export. Canvas preserves the chosen CJK script without sending
   pupil text to a service. The HTML report remains available for text access. */
window.downloadWarningPDF=async function(report,filename){
 await document.fonts.ready;
 if(!window.jspdf?.jsPDF)throw Error('PDF library unavailable');
 const W=1240,H=1754,margin=72,bottom=H-95,line=34,pages=[];
 let canvas,ctx,y;
 const family='Raleway,"PingFang SC","Apple SD Gothic Neo",Arial,sans-serif';
 function page(){canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#1b6947';ctx.fillRect(0,0,W,15);ctx.font='700 20px '+family;ctx.fillText('YEAR 6 / WEEK 11 / LEARNING RECORD',margin,55);y=105;pages.push(canvas);}
 function text(el){return [...el.childNodes].map(n=>n.nodeType===3?n.textContent:n.nodeName==='BR'?'\n':n.classList?.contains('translation')?'\n'+text(n):text(n)).join('').trim();}
 function wrap(value,width){const result=[];for(const paragraph of value.split('\n')){if(!paragraph){result.push('');continue;}const tokens=paragraph.match(/\s+|[\u2E80-\u9FFF\uAC00-\uD7AF]|[^\s\u2E80-\u9FFF\uAC00-\uD7AF]+/gu)||[];let current='';for(const token of tokens){if(ctx.measureText(current+token).width<=width){current+=token;continue;}if(current.trim())result.push(current.trimEnd());current='';if(ctx.measureText(token).width<=width){current=token.trimStart();continue;}for(const ch of token){if(ctx.measureText(current+ch).width>width){result.push(current);current='';}current+=ch;}}if(current.trim())result.push(current.trimEnd());}return result;}
 function paragraph(value,size=24,bold=false){const lh=Math.round(size*1.4);ctx.font=(bold?'750 ':'500 ')+size+'px '+family;const lines=wrap(value,W-margin*2);if(bold&&y+lh*Math.min(lines.length,3)>bottom)page();for(const t of lines){if(y+lh>bottom)page();ctx.font=(bold?'750 ':'500 ')+size+'px '+family;ctx.fillStyle=bold?'#1b6947':'#192a20';ctx.fillText(t,margin,y);y+=lh;}y+=bold?13:16;}
 page();
 const elements=[...report.children];
 for(let ei=0;ei<elements.length;ei++){const el=elements[ei];
  if(/^H[123]$/.test(el.tagName)){
   let keep=0;
   for(let look=ei;look<Math.min(ei+4,elements.length);look++){
    const next=elements[look],heading=/^H[123]$/.test(next.tagName),lev=Number(next.tagName[1]),size=heading?(lev===1?38:lev===2?29:25):24;
    ctx.font=(heading?'750 ':'500 ')+size+'px '+family;
    if(next.tagName==='TABLE'){keep+=110;break;}
    const n=wrap(text(next),W-margin*2).length;
    keep+=(heading?n:Math.min(n,2))*Math.round(size*1.4)+(heading?27:16);
    if(!heading)break;
   }
   if(y+keep>bottom)page();
   const level=Number(el.tagName[1]);if(level===2)y+=14;paragraph(text(el),level===1?38:level===2?29:25,true);
  }
  else if(el.tagName==='P')paragraph(text(el));
  else if(el.tagName==='TABLE'){
   for(const row of el.querySelectorAll('tr')){const cells=[...row.children],head=cells[0]?.tagName==='TH',cw=(W-margin*2)/cells.length;ctx.font=(head?'750 ':'500 ')+'22px '+family;const columns=cells.map(c=>wrap(text(c),cw-28)),height=Math.max(...columns.map(c=>c.length))*30+24;if(y+height>bottom)page();ctx.fillStyle=head?'#edf4ed':'#fff';ctx.fillRect(margin,y-20,W-margin*2,height);ctx.strokeStyle='#ccd8cc';ctx.strokeRect(margin,y-20,W-margin*2,height);columns.forEach((lines,i)=>{ctx.font=(head?'750 ':'500 ')+'22px '+family;ctx.fillStyle='#192a20';lines.forEach((t,j)=>ctx.fillText(t,margin+i*cw+14,y+j*30));});y+=height;}y+=20;
  }
 }
 const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true});
 doc.setProperties({title:'Year 6 Week 11 Learning Report',subject:'Pupil answers and self-reported practical work',creator:'Week 11 Warning Counter lesson'});
 pages.forEach((p,i)=>{const c=p.getContext('2d');c.strokeStyle='#ccd8cc';c.beginPath();c.moveTo(margin,H-70);c.lineTo(W-margin,H-70);c.stroke();c.font='500 18px '+family;c.fillStyle='#53635a';c.fillText('Week 11 · Submit this PDF AND your MakeCode HEX.',margin,H-40);c.textAlign='right';c.fillText((i+1)+' / '+pages.length,W-margin,H-40);c.textAlign='left';if(i)doc.addPage();doc.addImage(p.toDataURL('image/jpeg',.94),'JPEG',0,0,210,297,undefined,'FAST');});
 doc.save(filename);
};
