(function(root){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slides=()=>root.SearchTeaching.slides;
function current(s){return s?.phase==='work'?slides().find(x=>x.id===s.teaching_visual)||null:null;}
function array(values,{focus=-1,low=0,high=values.length-1}={}){return '<div class="pi-array" role="group" aria-label="Indexes and stored values"><strong>Index</strong>'+values.map((_,i)=>'<span class="pi-index">'+i+'</span>').join('')+'<strong>Value</strong>'+values.map((v,i)=>'<span class="pi-value '+(i===focus?'pi-focus ':'')+(i<low||i>high?'pi-excluded':'')+'">'+v+'</span>').join('')+'</div>';}
function render(s){const x=current(s);if(!x)return '';const show=!!s.teaching_answer,v=[4,8,12,19,27,35,46],i=x.number,target=i===8?30:35;let diagram='';
if(i===1)diagram=array(v,{focus:2})+'<p class="pi-line">Index = position · Value = stored data · Target = value to find</p><pre>items[2]</pre>';
if(i===2)diagram='<p class="pi-line">First check: index 0 stores 4. 4 = 35 is False.</p>'+array(v,{focus:show?1:0})+'<pre>position ← position + 1</pre>';
if(i===3)diagram='<p class="pi-line">Checked in order: 4, 8, 12, 19, 27, 35. The target matches.</p>'+array(v,{focus:5})+'<pre>'+(show?'found ← True':'found was False before the match')+'\nOUTPUT found</pre>';
if(i===4)diagram='<div class="pi-two"><p>A. Sorted</p>'+array(v,{focus:3})+'<p>B. Not sorted</p>'+array([35,8,12,19,27,4,46],{focus:3})+'</div><p class="pi-line">In both lists: target 35 &gt; midpoint value 19.</p>';
if(i===5)diagram='<p class="pi-line">Boundary indexes: low = 0 · high = 6</p>'+array(v,{focus:3})+'<pre>mid ← (low + high) DIV 2\nCalculation: (0 + 6) DIV 2 = 3</pre>';
if(i===6)diagram='<p class="pi-line">Before: low = 0 · mid = 3 · high = 6 (indexes)</p>'+array(v,{focus:3,low:show?4:0})+'<pre>35 &gt; 19        low ← mid + 1</pre>';
if(i===7)diagram='<p class="pi-line">Remaining boundary indexes: low = 4 · high = 6</p>'+array(v,{focus:show?5:-1,low:4})+'<pre>mid ← (low + high) DIV 2\nCalculation: (4 + 6) DIV 2'+(show?' = 5':'')+'</pre>';
if(i===8)diagram='<p class="pi-line">Values checked: 19, then 35, then 27</p>'+array(v,{low:show?5:0,high:show?4:6})+'<pre>low = 5; high = 4   (indexes)\nWHILE low ≤ high AND found = False</pre>';
return '<section class="projector-image" aria-label="Image '+i+' · '+(show?'answer':'question')+'"><div class="pi-heading"><h2>'+esc(x.title)+'</h2><span>Target: '+target+'</span></div>'+diagram+'<section class="pi-question"><strong>Question</strong><p>'+esc(x.prompt)+'</p></section>'+(show?'<section class="pi-answer"><strong>Answer</strong><p>'+esc(x.answer)+'</p><p class="pi-reason">'+esc(x.reason)+'</p></section>':'<p class="pi-think">Think first. Explain your decision to the class.</p>')+'</section>';}
function create({context,command}){const $=id=>document.getElementById(id);let initialise=false,lastVisual='';
function renderControls(){const d=context();if(!d?.state)return;const s=d.state,x=current(s),active=!!x,locked=['question','review'].includes(s.phase),busy=!!d.busy,chosen=$('image-choice');if(!initialise){chosen.innerHTML=[1,2].map(task=>'<optgroup label="Before Main Task '+task+'">'+slides().filter(v=>(v.number<=3?1:2)===task).map(v=>'<option value="'+v.id+'">'+v.number+'. '+esc(v.title)+'</option>').join('')+'</optgroup>').join('');initialise=true;}
if(s.teaching_visual!==lastVisual){if(x)chosen.value=x.id;lastVisual=s.teaching_visual||'';}
const selected=slides().find(v=>v.id===chosen.value);$('image-choice-title').textContent=selected?.prompt||'';$('image-status').textContent=x?'On projector: image '+x.number+' · '+(s.teaching_answer?'answer shown':'question only'):'No image on the projector.';
$('image-effect').textContent=locked?'A response discussion is active. Return class to independent work before showing an image.':'Show question pauses the lesson timer and asks students to look at the board. It brings students to this image and locks lesson navigation until you release them. Their work is kept.';
$('image-show').disabled=busy||locked;$('image-show').textContent='Show selected question on projector';
$('image-reveal').disabled=busy||!active||chosen.value!==x.id;$('image-reveal').textContent=s.teaching_answer?'Hide answer on projector':'Reveal answer on projector';$('image-reveal').classList.toggle('primary',active&&!s.teaching_answer);
$('image-prev').disabled=busy||!active||chosen.value!==x.id||x.number===1;$('image-next').disabled=busy||!active||chosen.value!==x.id||x.number===slides().length;
$('image-end').disabled=busy||!active;$('image-note').textContent=active&&chosen.value!==x.id?'This choice is not on the projector yet. Select Show selected question first.':active?'Previous / Next shows the question first. Students stay on your slide until you select Release students.':'';
}
chosenListener();function chosenListener(){$('image-choice').onchange=renderControls;}
$('image-show').onclick=()=>command('teaching_show',{visual:$('image-choice').value});
$('image-reveal').onclick=()=>{const s=context()?.state;if(current(s))command('teaching_answer',{show:!s.teaching_answer});};
for(const [id,step] of [['image-prev',-1],['image-next',1]])$(id).onclick=()=>{const x=current(context()?.state),next=x&&slides()[x.number-1+step];if(next)command('teaching_show',{visual:next.id});};
$('image-end').textContent='Release students · return to their work';$('image-end').onclick=()=>command('return_task');
return {render:renderControls,reset:()=>{initialise=false;lastVisual='';$('image-choice').replaceChildren();}};
}
function result(action){return ({teaching_show:'Question shown on the projector. Answer hidden; lesson timer paused. Students follow this slide until released; their unfinished work is kept.',teaching_answer:'Projector answer updated. Student attempts and progress are unchanged.',teaching_end:'Board instructions restored. Timer remains paused; return class to independent work when ready.'})[action];}
const api={current,render,create,result,array};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SearchProjectorImages=api;
})(typeof window!=='undefined'?window:globalThis);
