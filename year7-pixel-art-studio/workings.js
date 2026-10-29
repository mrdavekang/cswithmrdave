/* Working space supports thinking; it never grades answers or locks navigation. */
(() => {
 'use strict';
 const prompts={
  score:{title:'Starter · read a binary score',en:'Look at each 1. Write the place value above it. Add those values, then choose your answer below.',zh:'找出每个1，写下它上方的位值。把这些位值相加，再选择下方的答案。',hint:'___ + ___ + ___ = ___'},
  pixels:{title:'Pixel data · count pixels',en:'Write the number of rows × the number of pixels in each row. Then enter your total below.',zh:'写出行数×每行的像素数，再在下方填写总数。',hint:'___ rows × ___ pixels per row = ___ pixels'},
  bytes:{title:'Pixel data · count bytes',en:'Find the total pixels first. Each pixel uses 1 bit. Divide the total bits by 8 to find bytes.',zh:'先计算像素总数。每个像素使用1位，再把总位数除以8，得到字节数。',hint:'___ × ___ = ___ pixels\n___ pixels × 1 = ___ bits\n___ bits ÷ 8 = ___ bytes'},
  transfer:{title:'Pixel data · a new picture size',en:'Use the width and height in this question. Find the total pixels, then bits. Divide the bits by 8 to find bytes.',zh:'使用本题给出的宽度和高度，先算像素总数，再算位数。把位数除以8，得到字节数。',hint:'___ rows × ___ pixels per row = ___ pixels\n___ pixels × 1 = ___ bits\n___ bits ÷ 8 = ___ bytes'},
  resolution:{title:'Extra challenge · resolution',en:'Multiply the new width by the new height. Compare that pixel total with the original 8 × 8 picture.',zh:'用新的宽度乘以新的高度，再与原来8×8图片的像素总数比较。',hint:'New: ___ × ___ = ___ pixels\nOriginal: 8 × 8 = ___ pixels'}
 };
 let current=null,translate=null,record=null;
 const escape=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
 function clean(raw){const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;for(const id of Object.keys(prompts)){if(typeof raw[id]==='string')out[id]=raw[id].slice(0,1600);}return out;}
 function mount(state,t,log){
  current=state;translate=t;record=log;state.workings=clean(state.workings);
  let id='',anchor=null;
  if(state.stage===0&&document.querySelector('[data-action="starter-answer"][data-id="number"]')){id='score';anchor=document.querySelector('.question-card .options');}
  if(state.stage===5&&state.projects[state.design].step===5){id=['pixels','bytes','transfer'][state.dataIndex];anchor=document.querySelector('#picture-data')?.closest('label');}
  if(state.stage===6&&state.extra==='resolution'){id='resolution';anchor=document.querySelector('.activity .options');}
  if(!id||!anchor)return;
  const q=prompts[id],box=document.createElement('section');box.className='calculation-working';box.setAttribute('aria-labelledby','working-title');
  box.innerHTML=`<h3 id="working-title">${t('SHOW YOUR WORKING','写出计算过程')}</h3><p>${t(q.en,q.zh)}</p><label for="calculation-notes">${t('Type your calculation here','在这里输入计算过程')}</label><textarea id="calculation-notes" data-working-id="${id}" data-focus="calculation-notes" maxlength="1600" rows="4" spellcheck="false" placeholder="${escape(q.hint)}">${escape(state.workings[id]||'')}</textarea><div class="paper-working"><b>${t('Prefer to draw or write on paper?','想在纸上画图或计算？')}</b><p>${t('Use your exercise book or ask for paper. Copy the numbers you need, draw or write your calculation, then choose or enter your answer on this page. Keep your paper for your teacher.','使用练习本，或向老师要纸。抄下需要的数字，画图或写出计算过程，再在本页选择或填写答案。保留纸张给老师查看。')}</p></div><p class="working-save-note">${t('Typed working saves on this device and is included in your JSON and PDF backups. Paper working stays on paper. Neither option blocks Continue.','输入的过程保存在本机，并包含在JSON和PDF备份中；纸上过程保留在纸上。两种方式都不会阻止你继续。')}</p>`;
  anchor.before(box);
 }
 document.addEventListener('input',e=>{const id=e.target.dataset?.workingId;if(!current||!Object.hasOwn(prompts,id))return;current.workings[id]=e.target.value.slice(0,1600);record('calculation-working-edited',{question:id});});
 window.addEventListener('beforeprint',()=>{
  const report=document.querySelector('#print-report');if(!current||!report)return;
  report.querySelector('.working-evidence')?.remove();const entries=Object.entries(clean(current.workings)).filter(([,v])=>v.trim());if(!entries.length)return;
  const section=document.createElement('section');section.className='working-evidence';section.innerHTML=`<h2>${translate('My calculation working','我的计算过程')}</h2>${entries.map(([id,v])=>`<h3>${escape(prompts[id].title)}</h3><pre>${escape(v)}</pre>`).join('')}`;report.append(section);
 });
 globalThis.PixelWorkings={mount,clean};
})();
