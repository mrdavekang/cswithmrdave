/* Lay out real pages before rendering. Expand histories, never paint collapsed details. */
window.FitnessPDF=(()=>{let busy=false;
 async function save(html,filename){if(busy)return;busy=true;const host=document.createElement('div');host.className='pdf-export-host';const source=document.createElement('div');source.innerHTML=html;const pages=[],blocks=[];let content;
  function page(){const p=document.createElement('div');p.className='pdf-page';const h=document.createElement('div');h.className='pdf-page-header';h.textContent='YEAR 11 COMPUTER SCIENCE · PAPER 1 PREPARATION';content=document.createElement('div');content.className='pdf-page-content';const f=document.createElement('div');f.className='pdf-page-footer';p.append(h,content,f);host.append(p);pages.push(p);}
  function flatten(node){if(node.nodeType!==1)return;if(node.classList.contains('new-page'))blocks.push(null);
   if(node.tagName==='SECTION'||node.tagName==='DETAILS'){for(const child of node.children){if(child.tagName==='SUMMARY'){const heading=document.createElement('h4');heading.textContent=child.textContent;blocks.push(heading);}else flatten(child);}return;}
   if(node.classList.contains('docx-text')){for(const line of node.textContent.split('\n')){const p=document.createElement('p');p.className='pdf-docx-line'+(line.trim()?'':' pdf-blank');p.textContent=line||' ';blocks.push(p);}return;}
   if(node.tagName==='PRE'){const lines=node.textContent.split('\n');for(let i=0;i<lines.length;i+=24){const p=node.cloneNode(false);p.textContent=lines.slice(i,i+24).join('\n');blocks.push(p);}return;}
   if(node.tagName==='P'&&node.textContent.length>650){const text=node.textContent;for(let start=0;start<text.length;){let end=Math.min(start+550,text.length);if(end<text.length){const space=text.lastIndexOf(' ',end);if(space>start+250)end=space+1;}const p=node.cloneNode(false);p.textContent=text.slice(start,end);blocks.push(p);start=end;}return;}blocks.push(node);
  }
  const heading=n=>n&&(/^H[1-6]$/.test(n.tagName)||n.classList.contains('report-label'));
  const overflow=()=>content.scrollHeight>content.clientHeight+1;
  function put(node){const clone=node.cloneNode(true);content.append(clone);if(overflow()){clone.remove();if(content.childNodes.length)page();content.append(clone);}
   if(overflow()&&clone.tagName==='TABLE'){clone.remove();const rows=[...clone.querySelectorAll('tbody tr')],thead=clone.querySelector('thead');let body;const table=()=>{const t=clone.cloneNode(false);if(thead)t.append(thead.cloneNode(true));body=document.createElement('tbody');t.append(body);content.append(t);};table();for(const row of rows){body.append(row);if(overflow()){row.remove();page();table();body.append(row);}}}
  }
  document.body.append(host);page();try{await document.fonts.ready;[...source.children].forEach(flatten);
   for(let i=0;i<blocks.length;i++){const n=blocks[i];if(!n){if(content.childNodes.length)page();continue;}
    if(heading(n)&&content.childNodes.length){const test=[];let j=i;while(j<blocks.length&&heading(blocks[j])){const c=blocks[j++].cloneNode(true);content.append(c);test.push(c);}if(blocks[j]){const c=blocks[j].cloneNode(true);content.append(c);test.push(c);}const tooFull=overflow();test.forEach(c=>c.remove());if(tooFull)page();}put(n);
   }
   if(pages.length>35)throw Error('This report is very long. Keep Full backup and submit the Word EADs separately.');
   pages.forEach((p,i)=>p.querySelector('.pdf-page-footer').textContent=filename.replace(/_/g,' ')+' · '+(i+1)+' / '+pages.length);
   const pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});pdf.setProperties({title:filename,subject:'Lesson responses and self-reported EAD submissions',author:'Year 11 Computer Science'});
   for(let i=0;i<pages.length;i++){const canvas=await html2canvas(pages[i],{scale:1.5,backgroundColor:'#ffffff',logging:false,useCORS:false});if(i)pdf.addPage();pdf.addImage(canvas.toDataURL('image/jpeg',.92),'JPEG',0,0,210,297,undefined,'FAST');canvas.width=0;canvas.height=0;}
   pdf.save(filename+'.pdf');return pages.length;
  }finally{host.remove();busy=false;}
 }
 return {save};
})();
