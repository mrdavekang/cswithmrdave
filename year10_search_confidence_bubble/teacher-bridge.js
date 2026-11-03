(()=>{'use strict';const params=new URLSearchParams(location.search);if(!params.has('teacherPreview'))return;
if(params.has('embed'))document.body.classList.add('embedded-lesson');
start(true);
function state(){const p=PAGES[page];return {page,step,revealed,id:p.id,title:p.title,stage:p.stage,paper:p.paper,digital:DIGITAL_IDS.has(p.id),canReveal:!!p.answer||p.kind==='search'||p.kind==='bubble',canStep:['search','bubble','swap'].includes(p.kind)}}
window.BubbleBridgeNotify=()=>{if(window.parent!==window)window.parent.postMessage({type:'bubble-preview-state',state:state()},location.origin==='null'?'*':location.origin)};
window.TeacherLessonBridge={pages:PAGES.map(p=>({id:p.id,title:p.title,stage:p.stage,paper:p.paper})),state,
 go:(index,newStep=0,show=false)=>{go(index);step=Math.max(0,Math.min(2,newStep));revealed=!!show;render()},
 reveal:visible=>{revealed=visible!==false;render()},reset,
 nextStep:()=>{step=Math.min(2,step+1);revealed=false;render()},previousStep:()=>{step=Math.max(0,step-1);revealed=false;render()}};
window.addEventListener('message',e=>{if(e.source!==window.parent||e.origin!==location.origin||e.data?.type!=='bubble-preview-go')return;window.TeacherLessonBridge.go(e.data.page,e.data.step,e.data.reveal)});
window.BubbleBridgeNotify();})();
