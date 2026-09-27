/* Read-only student mirror for the teacher's temporary SQL demonstration. */
(()=>{'use strict';
let latest={open:false},lastSequence=-1;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ids=['insert-student','update-email','update-returned','delete-loan'];
function valid(p){return p&&typeof p==='object'&&typeof p.open==='boolean'&&(!p.open||(ids.includes(p.program)&&typeof p.code==='string'&&p.code.length<=20000&&typeof p.output==='string'&&p.output.length<=24000))}
function lines(code,line){return code.split('\n').map((text,i)=>`<span class="live-code-line ${i+1===line?'current':''}"><i>${i+1}</i><code>${esc(text)||' '}</code></span>`).join('')}
function render(){let panel=document.getElementById('live-demo');if(!latest.open){panel?.remove();document.body.classList.remove('live-demo-open');return}if(!panel){panel=document.createElement('section');panel.id='live-demo';panel.setAttribute('aria-label','Live teacher SQL demonstration');document.body.append(panel)}document.body.classList.add('live-demo-open');panel.innerHTML=`<header><div><span class="live-pill">LIVE TEACHER SQL</span><h1>${esc(latest.title||'SQL demonstration')}</h1></div><div class="live-state"><span class="live-dot"></span>Watch the highlighted line</div></header><main><section class="live-code" aria-label="Read-only SQL query">${lines(latest.code,Math.max(1,Number(latest.line)||1))}</section><section class="live-output"><h2>Preview output</h2><pre>${esc(latest.output||'Your teacher will preview the query here.')}</pre></section></main><footer>Read and predict with your teacher. This demonstration does not change your own saved work.</footer>`;panel.querySelector('.current')?.scrollIntoView({block:'center'})}
function apply(payload){if(!valid(payload))return false;const seq=Number(payload.seq??payload.demo_revision??0);if(Number.isFinite(seq)&&seq<lastSequence)return false;if(Number.isFinite(seq))lastSequence=seq;latest={...payload};render();return true}
function close(){latest={open:false};lastSequence=-1;render()}
window.LiveClassDemo=Object.freeze({apply,close,current:()=>({...latest})});
})();
