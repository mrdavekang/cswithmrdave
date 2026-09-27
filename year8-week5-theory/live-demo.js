/* Read-only student mirror for a teacher's temporary Python demonstration. */
(()=>{
 'use strict';
 let latest={open:false},lastSequence=-1;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function valid(payload){
  return payload&&typeof payload==='object'&&typeof payload.open==='boolean'&&(!payload.open||(
   ['debug1','debug2','code1','code2','code3','ext1','ext2','ext3'].includes(payload.program)&&typeof payload.code==='string'&&payload.code.length<=20000&&typeof payload.output==='string'&&payload.output.length<=24000
  ));
 }
 function codeLines(code,line){return code.split('\n').map((text,index)=>`<span class="live-code-line ${index+1===line?'current':''}"><i>${index+1}</i><code>${esc(text)||' '}</code></span>`).join('');}
 function render(){
  let panel=document.getElementById('live-demo');
  if(!latest.open){panel?.remove();document.body.classList.remove('live-demo-open');return;}
  if(!panel){panel=document.createElement('section');panel.id='live-demo';panel.setAttribute('aria-label','Live teacher Python demonstration');document.body.append(panel);}
  document.body.classList.add('live-demo-open');
  panel.innerHTML=`<header><div><span class="live-pill">LIVE TEACHER CODE</span><h1>${esc(latest.title||'Python demonstration')}</h1></div><div class="live-state"><span class="live-dot"></span>${latest.running?'Program running':'Watch the highlighted line'}</div></header><main><section class="live-code" aria-label="Read-only Python code">${codeLines(latest.code,Math.max(1,Number(latest.line)||1))}</section><section class="live-output"><h2>Program output</h2><pre>${esc(latest.output||'Press Run on the teacher device to see the result here.')}</pre></section></main><footer>Watch your teacher’s explanation. This demonstration does not replace or change your own saved code.</footer>`;
  panel.querySelector('.current')?.scrollIntoView({block:'center'});
 }
 function apply(payload){
  if(!valid(payload))return false;
  const seq=Number(payload.seq??payload.demo_revision??0);if(Number.isFinite(seq)&&seq<lastSequence)return false;
  if(Number.isFinite(seq))lastSequence=seq;latest={...payload};render();return true;
 }
 function close(){latest={open:false};lastSequence=-1;render();}
 window.LiveClassDemo=Object.freeze({apply,close,current:()=>({...latest})});
})();
