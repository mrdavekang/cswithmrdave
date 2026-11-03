(()=>{
  const $=s=>document.querySelector(s),E=FitnessUI.esc,books=new Map(),nonce=location.hash.slice(1),origin=location.origin==='null'?'*':location.origin;
  let unlocked=false,epoch=0;
  const labels={starterRead:'Do Now: read mode',starterAppend:'Do Now: append mode',learningFocus:'Learning focus',learningPlan:'How I will improve',read1Check:'Reading before Main Task 1',read2Check:'Reading before Main Task 2',phase:'Current learning phase',phaseEvidence:'Evidence for the learning phase',phaseAction:'Next action',exitExplain:'Plenary: data journey',exitEvidence:'Plenary: evidence of improvement',exitNext:'Plenary: next practice target'};
<<<<<<< Updated upstream
=======
  Object.assign(labels,window.FITNESS_FIELD_LABELS||{});
>>>>>>> Stashed changes
  function open(){unlocked=true;$('#response-login').hidden=true;$('#response-main').hidden=false;$('#response-lock').hidden=false;$('#response-error').textContent='';$('#response-pass').value='';}
  function lock(){epoch++;unlocked=false;books.clear();$('#response-work').innerHTML='';$('#response-main').hidden=true;$('#response-login').hidden=false;$('#response-lock').hidden=true;$('#response-input').value='';$('#response-message').textContent='';$('#response-student').innerHTML='<option value="">No notebooks imported</option>';}
  $('#response-login').onsubmit=async e=>{e.preventDefault();try{await FitnessTeacherAuth.unlock($('#response-pass').value);open();}catch{$('#response-error').textContent='The teacher passcode did not unlock this window.';}};
  window.addEventListener('message',async e=>{if(e.source!==window.opener||e.origin!==location.origin)return;if(e.data?.type==='fitness-response-unlock'&&e.data.nonce===nonce){const start=epoch;try{await FitnessTeacherAuth.read(e.data.key);if(epoch===start)open();}catch{$('#response-error').textContent='Unlock this window using your teacher passcode.';}}if(e.data?.type==='fitness-response-lock')lock();});
  if(window.opener&&nonce)window.opener.postMessage({type:'fitness-response-ready',nonce},origin);
  window.addEventListener('storage',e=>{if(e.key==='fitness-teacher-locked')lock();});
  function render(){const b=books.get($('#response-student').value);if(!b){$('#response-work').innerHTML='';return;}let html=`<h2>${E(b.name)} · ${E(b.className)}</h2><p class="small">Saved in their backup: ${E(b.updated||'Not recorded')}</p><table class="evidence-summary"><tr><th>EAD</th><th>Student’s submission confirmation</th></tr>${Object.entries(LESSON.eads).map(([id,t])=>`<tr><td>${E(t.title)}</td><td>${b.submissions?.[id]?.confirmed===true?'Confirmed by the student':'Not confirmed'}<br>${E(b.submissions?.[id]?.filename||'')}</td></tr>`).join('')}</table>`;
    const entries=Object.entries(b.answers||{}).filter(([,v])=>typeof v==='string'&&v.trim());html+='<h2>App responses</h2>'+(entries.length?entries.map(([k,v])=>`<section class="response-entry"><h3>${E(labels[k]||k)}</h3><p>${E(v.slice(0,20000))}</p></section>`).join(''):'<p>No app responses in this backup.</p>');
    for(const [id,l]of Object.entries(b.labs||{})){if(!LESSON.labs[id]||!l||typeof l!=='object')continue;html+=`<details class="response-entry"><summary>${E(LESSON.labs[id].title)}</summary><h3>Prediction</h3><p>${E(String(l.prediction||'').slice(0,20000))}</p><pre>${E(String(l.code||'').slice(0,30000))}</pre><h3>Output</h3><pre>${E(String(l.output||'').slice(0,20000))}</pre></details>`;}
    html+='<h2>Locally attached EADs</h2><p class="small">These are the files attached to this saved backup, not a check of the latest Teams submission.</p>';
    for(const [id,a]of Object.entries(b.attachments||{})){if(!LESSON.eads[id]||!a||typeof a.text!=='string')continue;html+=`<details class="response-entry"><summary>${E(LESSON.eads[id].title)}</summary><p>${E(String(a.name||'Completed EAD'))}</p><button data-original="${id}">Download attached Word EAD</button><pre>${E(a.text.slice(0,80000))}</pre></details>`;}
    $('#response-work').innerHTML=html;
    document.querySelectorAll('[data-original]').forEach(button=>button.onclick=()=>{const a=b.attachments[button.dataset.original];if(typeof a.data==='string'&&/^data:application\/[A-Za-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(a.data)&&a.data.length<12000000)FitnessUI.dataDownload(a.data,String(a.name||'Completed_EAD.docx').replace(/[\\/]/g,'_'));else $('#response-message').textContent='This backup does not contain a usable original Word file.';});
  }
  $('#response-input').onchange=async e=>{
    if(!unlocked)return;const start=epoch,errors=[];let count=0;
    for(const file of [...e.target.files].slice(0,30)){
      try{
        if(file.size>40*1024*1024)throw Error('File too large');
        const raw=JSON.parse(await file.text());if(!unlocked||epoch!==start)return;
        if(raw.kind!==LESSON.id||raw.version!==1||typeof raw.name!=='string'||typeof raw.className!=='string')throw Error('Not a backup from this lesson');
        const b={name:raw.name.slice(0,80),className:raw.className.slice(0,40),updated:typeof raw.updated==='string'?raw.updated.slice(0,100):'',answers:{},labs:{},submissions:{},attachments:{}};
        for(const id of Object.keys(labels))if(typeof raw.answers?.[id]==='string')b.answers[id]=raw.answers[id].slice(0,20000);
        for(const id of Object.keys(LESSON.labs)){const lab=raw.labs?.[id];if(lab&&typeof lab==='object'){b.labs[id]={};for(const field of ['prediction','code','output'])if(typeof lab[field]==='string')b.labs[id][field]=lab[field].slice(0,30000);}}
        for(const id of Object.keys(LESSON.eads)){
          const s=raw.submissions?.[id];if(s&&typeof s==='object')b.submissions[id]={confirmed:s.confirmed===true,filename:typeof s.filename==='string'?s.filename.slice(0,160):''};
          const a=raw.attachments?.[id];if(a&&typeof a.text==='string')b.attachments[id]={name:typeof a.name==='string'?a.name.slice(0,160):'Completed_EAD.docx',text:a.text.slice(0,80000),data:typeof a.data==='string'&&a.data.length<12000000?a.data:''};
        }
        books.set(JSON.stringify([b.name,b.className]),b);count++;
      }catch{errors.push(file.name);}
    }
    if(!unlocked||epoch!==start)return;
    $('#response-student').innerHTML=[...books].map(([id,b])=>`<option value="${E(id)}">${E(b.name)} · ${E(b.className)}</option>`).join('')||'<option value="">No notebooks imported</option>';
    $('#response-message').textContent=`Imported ${count} notebook${count===1?'':'s'}.`+(errors.length?' Could not read: '+errors.join(', '):'');e.target.value='';render();
  };
  $('#response-student').onchange=render;$('#response-clear').onclick=()=>{books.clear();$('#response-student').innerHTML='<option value="">No notebooks imported</option>';$('#response-work').innerHTML='';$('#response-message').textContent='Imported notebooks cleared from this window.';};$('#response-lock').onclick=lock;
})();
