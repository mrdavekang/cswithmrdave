/* Integrated predict -> Python -> compare workspaces. No external editor service. */
(function(root){
'use strict';
const $=(q,n=document)=>n.querySelector(q), E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=n=>Math.abs(Number(n))<1e-8?0:Math.round(Number(n)*100)/100;
let worker=null,workerURL=null,watchdog=null,active=null,raf=null;
const views=new Map();
const initial={x:0,y:0,h:0,pen:true};
const prompts={
 syntax:['Fix the missing comma, then run again.','补上逗号，然后重新运行。','빠진 쉼표를 넣고 다시 실행하세요.'],
 move:['Run the original first. Then change 40 to 60. What changes?','先运行原代码，再把 40 改成 60。有什么变化？','먼저 원래 코드를 실행하세요. 40을 60으로 바꾸면 무엇이 달라지나요?'],
 turn:['Compare left(90) with right(90). Does the position change?','比较 left(90) 与 right(90)。位置改变了吗？','left(90)과 right(90)을 비교하세요. 위치도 바뀌나요?'],
 pen:['Try removing penup(). Which extra line appears?','尝试删去 penup()。会多出哪条线？','penup()을 지우면 어떤 선이 더 생기나요?'],
 comment:['Change only the comment. Is the drawing different?','只修改注释。图形会不同吗？','주석만 바꾸면 그림도 달라지나요?'],
 hinge:['Run the turn. Add forward(40) afterwards and compare.','运行转向指令，再添加 forward(40) 并比较。','회전을 실행한 뒤 forward(40)을 추가하고 비교하세요.'],
 route:['Trace the original route. Change one destination and compare.','追踪原路线。修改一个目的地并比较。','원래 경로를 추적한 뒤 도착 위치 하나를 바꾸어 비교하세요.'],
 compareA:['Test A, then test B below. Track when the turn happens.','测试 A，再测试下方的 B。注意转向的时机。','A를 실행한 뒤 아래의 B를 실행하세요. 회전하는 순서를 확인하세요.'],
 compareB:['Can you reorder B to draw the same path as A?','你能调整 B 的顺序，让它画出与 A 相同的路线吗？','B의 순서를 바꾸어 A와 같은 경로를 그릴 수 있나요?'],
 checkpoint:['Your first checkpoint is frozen. Test and record any correction separately.','第一次检查已保留。现在可测试，修改需另行记录。','첫 점검은 보관되어 있습니다. 테스트한 뒤 수정은 따로 기록하세요.'],
 extension:['Try a variable, a repeated pattern, or your own route.','尝试变量、重复图案或自己的路线。','변수, 반복 무늬, 나만의 경로를 시도하세요.']};
function tr(a){const lang=root.App?.state?.lang||'en';return E(a[0])+(lang!=='en'?'<span class="sub">'+E(a[lang==='zh'?1:2]||a[0])+'</span>':'');}
function spec(id){
 const ex=root.Lesson.examples[id];
 if(ex)return {...ex,title:({move:'Movement',turn:'Turns',pen:'Pen control',comment:'Comments',route:'Route trace',compareA:'Program A',compareB:'Program B',checkpoint:'Checkpoint • after first submission'})[id]};
 if(id==='syntax')return {title:'Syntax laboratory',code:'t.goto(80 40)',start:{...initial}};
 if(id==='hinge')return {title:'Turn on the spot',code:'t.right(90)',start:{x:40,y:0,h:0,pen:true}};
 return {title:'Free Turtle workspace',code:'t.goto(80, 0)\nt.goto(80, -40)',start:{...initial}};
}
function entry(id){const s=root.App.state;s.pythonLabs=s.pythonLabs||{};return s.pythonLabs[id]||(s.pythonLabs[id]={code:id==='extension'?(s.extensionCode||spec(id).code):spec(id).code,runs:[],observation:'',grid:true,ghost:false,speed:'normal'});}
function hasRun(id){return !!root.App?.state?.pythonLabs?.[id]?.runs?.length;}
function allow(id){const s=root.App?.state;if(!s)return false;if(s.teacher)return true;if(id==='extension')return true;if(id==='checkpoint')return !!s.checkpoint;if(id==='route')return !!s.traceAttempts.length;return !!s.q[id]?.history?.length;}
function reason(id){return id==='checkpoint'?'Save your first checkpoint above before testing.':id==='route'?'Complete the trace table and save your prediction above first.':'Choose an answer and save your prediction above first.';}
function setup(id){const st=spec(id).start;return 'import turtle\n\nt = turtle.Turtle()\nt.penup()\nt.goto('+st.x+', '+st.y+')\nt.setheading('+st.h+')\nt.'+(st.pen?'pendown':'penup')+'()';}
function html(id){
 const d=entry(id),p=spec(id),open=allow(id),saved=!!d.kept;
 return `<section class="python-lab ${open?'':'python-locked'}" data-lab="${id}" aria-label="Python editor: ${E(p.title)}">
 <header class="python-head"><div><span class="eyebrow">Predict → run → compare</span><h2>${tr(['Python Turtle lab','Python Turtle 实验室','Python Turtle 실험실'])} <span class="python-name">${E(p.title)}</span></h2></div><button class="small" type="button" data-screen-action="open">Aa Display</button><button class="small" type="button" data-ide="expand">Expand editor</button></header>
 <p class="python-prompt">${tr(prompts[id]||prompts.extension)}</p>
 <div class="python-start"><span><b>Start</b> (${p.start.x}, ${p.start.y})</span><span><b>Facing</b> ${E(root.TurtleModel.heading(p.start.h))}</span><span><b>Pen</b> ${p.start.pen?'down':'up'}</span><span><code>t</code> is ready</span></div>
 ${!open?`<div class="python-lock-note" role="note">${tr([reason(id),'先在上方保存预测，再运行代码。','먼저 위에서 예측을 저장한 뒤 코드를 실행하세요.'])}</div>`:''}
 <div class="python-toolbar"><button class="primary" data-ide="run" ${open?'':'disabled'}>▶ ${tr(['Run Python','运行 Python','Python 실행'])}</button><button data-ide="step" ${open?'':'disabled'}>▸ Step</button><button data-ide="stop" disabled>■ Stop</button><button data-ide="reset">↺ Reset code</button><button class="python-jump" data-ide="view-output">View drawing ↓</button><label class="python-speed">Playback <select data-ide-setting="speed" aria-label="Playback speed">${['slow','normal','fast','instant'].map(v=>`<option value="${v}" ${d.speed===v?'selected':''}>${v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select></label></div>
 <div class="python-split"><div class="python-code-side"><label class="python-caption" for="python-code-${id}">Edit the question’s code <span>Ctrl / ⌘ + Enter to run</span></label><div class="python-editor"><pre class="python-lines" aria-hidden="true"></pre><textarea id="python-code-${id}" data-ide-code rows="9" maxlength="12000" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" aria-label="Editable Python code for ${E(p.title)}">${E(d.code)}</textarea></div>
 <details class="python-tools"><summary>Touch keyboard · add a command</summary><div class="python-chips">${['t.goto(80, 40)','t.forward(40)','t.left(90)','t.right(90)','t.penup()','t.pendown()','print(t.position())'].map(x=>`<button class="small" data-ide="insert" data-code="${E(x)}">${E(x)}</button>`).join('')}</div><div class="python-chips">${['(',')',',','-','#'].map(x=>`<button class="small" data-ide="symbol" data-code="${E(x)}">${E(x)}</button>`).join('')}<button class="small" data-ide="indent">Indent</button><button class="small" data-ide="punctuation">Fix smart punctuation</button></div></details>
 <details class="python-setup"><summary>Starting code supplied for you</summary><p>Each run starts fresh. The setup below creates <code>t</code> in the state above, without drawing a setup line. You only need to edit the question’s commands.</p><pre>${E(setup(id))}</pre><p>Using <code>t = turtle.Turtle()</code> yourself creates a new Turtle at (0, 0), facing right.</p></details>
 <div class="python-console" role="log" aria-label="Python output"><div class="python-console-heading">Python console</div><pre data-ide-console>${E(d.last?.output||'print() output will appear here.')}</pre></div><div data-ide-error class="python-error" role="alert" ${d.last?.error?'':'hidden'}>${E(d.last?.error||'')}</div>
 </div><div class="python-output-side"><div class="python-caption">Live drawing <span class="python-cursor-readout"></span><button class="small python-jump" data-ide="view-code">Back to code ↑</button></div><canvas width="960" height="800" class="python-canvas" aria-label="Python Turtle drawing with coordinate grid"></canvas><div class="python-stats"><div><small>Position (x, y)</small><strong data-ide-position>(${p.start.x}, ${p.start.y})</strong></div><div><small>Facing</small><strong data-ide-heading>${E(root.TurtleModel.heading(p.start.h))}</strong></div><div><small>Pen</small><strong data-ide-pen>${p.start.pen?'Down':'Up'}</strong></div></div>
 <div class="python-view-options"><label><input type="checkbox" data-ide-setting="grid" ${d.grid!==false?'checked':''}> Grid</label><label><input type="checkbox" data-ide-setting="ghost" ${d.ghost?'checked':''}> Show undrawn travel</label></div><p class="hint python-legend">The grid, Turtle icon and dashed travel are teaching aids. Dashed travel is not a drawn line.</p><div class="python-playback"><button class="small" data-ide="rewind" ${d.last?'':'disabled'}>↶ Replay from start</button><span data-ide-progress>Not run yet</span><button class="small" data-ide="finish" ${d.last?'':'disabled'}>Show end</button></div><p class="python-status" data-ide-status role="status">${d.last?'Last run restored. Press Run for a fresh test.':open?'Ready. Run the original, then change one thing.':reason(id)}</p><p class="python-active-line" data-ide-line></p>
 </div></div>
 <div class="python-observation"><label for="python-note-${id}">${tr(['What did the test show? What changed when you edited the code?','测试说明了什么？修改代码后发生了什么变化？','테스트로 무엇을 알게 되었나요? 코드를 바꾸면 무엇이 달라졌나요?'])}</label><textarea id="python-note-${id}" data-ide-note maxlength="350" rows="2" placeholder="I predicted… The program actually… When I changed…">${E(d.observation)}</textarea><div class="python-evidence-row"><button class="small" data-ide="keep" ${d.last?.ok?'':'disabled'}>${saved?'Update kept test':'Keep this test in my PDF'}</button><button class="small" data-ide="download">Save .py (optional)</button>${saved?'<button class="small quiet" data-ide="unkeep">Remove kept test</button>':''}<span class="hint" data-ide-kept>${saved?'This test is in your PDF evidence.':'Keep up to 3 useful tests; no extra Teams upload.'}</span></div></div>
 <details class="python-help"><summary>Python and Turtle commands available here</summary><p>This is a browser Python interpreter (Skulpt), with a classroom Turtle adapter. Variables, calculations, <code>print()</code>, conditions, loops and functions run as Python. No Python installation or account is needed.</p><p>Use <code>goto</code>, <code>forward</code>, <code>backward</code>, <code>left</code>, <code>right</code>, <code>setheading</code>, <code>penup</code>, <code>pendown</code>, <code>position</code>, <code>heading</code>, <code>color</code>, <code>pensize</code>, <code>circle</code>, <code>dot</code>, <code>write</code>, <code>begin_fill</code>, <code>end_fill</code>, <code>clear</code>, <code>reset</code>, <code>home</code> and built-in shapes. <code>import turtle</code> and <code>turtle.Turtle()</code> also work.</p><p>Standard Turtle coordinates; turns are in degrees. Playback speed is set above. Screen size is responsive. Keyboard/mouse event programs, image backgrounds, <code>input()</code>, package installation and desktop Tkinter are not provided. The workspace limits runs to 200 lines, 800 drawing actions and a short time limit. Step replays Turtle actions from a completed Python run; it is not a full Python debugger.</p></details></section>`;
}
function mark(core=true){root.App.touch(core);}
function buildScene(id,index,preview=null){
 const d=entry(id),p=spec(id),events=d.last?.events||[];
 const turtles={0:{id:0,...p.start,color:'black',fill:'black',width:1,visible:true,shape:'classic'}};
 let shapes=[],bg='white',last=turtles[0];
 for(const e of events.slice(0,index)){
  const s=e.state||{},a=e.data||{};
  if(e.kind==='background'){bg=a.color;continue;}
  if(s.id!==undefined){turtles[s.id]={...s};last=turtles[s.id];}
  if(e.kind==='move')shapes.push({type:'line',id:s.id,...s,...a});
  if(['dot','write','fill'].includes(e.kind))shapes.push({type:e.kind,id:s.id,...s,...a});
  if(e.kind==='clear')shapes=shapes.filter(x=>x.id!==s.id);
 }
 if(preview){const e=events[index],s=e?.state||{},a=e?.data||{};
  if(e?.kind==='move'){
   const to=[a.from[0]+(a.to[0]-a.from[0])*preview.f,a.from[1]+(a.to[1]-a.from[1])*preview.f];
   const interp={...s,x:to[0],y:to[1]};shapes.push({type:'line',id:s.id,...s,...a,to});turtles[s.id]=interp;last=interp;
  }else if(e?.kind==='turn'){
   const prev=turtles[s.id]||s;let delta=Number.isFinite(a.angle)?a.angle:((s.h-prev.h+540)%360)-180;
   const interp={...s,h:((prev.h+delta*preview.f)%360+360)%360};turtles[s.id]=interp;last=interp;
  }
 }
 return {shapes,bg,turtles,last};
}
function safeColor(ctx,s,fallback='black'){ctx.fillStyle=fallback;try{ctx.fillStyle=String(s||fallback);}catch(e){}return ctx.fillStyle;}
function world(id){
 const d=entry(id),p=spec(id),pts=[[p.start.x,p.start.y]];
 for(const e of d.last?.events||[]){if(e.state?.x!==undefined)pts.push([e.state.x,e.state.y]);if(e.data?.from)pts.push(e.data.from);if(e.data?.points)pts.push(...e.data.points);}
 let minX=Math.min(p.bounds?.minX??-120,...pts.map(x=>x[0]-25)),maxX=Math.max(p.bounds?.maxX??120,...pts.map(x=>x[0]+25));
 let minY=Math.min(p.bounds?.minY??-120,...pts.map(x=>x[1]-25)),maxY=Math.max(p.bounds?.maxY??120,...pts.map(x=>x[1]+25));
 let unit=Math.pow(10,Math.floor(Math.log10(Math.max(maxX-minX,maxY-minY)/8))),n=Math.max(maxX-minX,maxY-minY)/8/unit;
 let step=(n<=1?1:n<=2?2:n<=5?5:10)*unit;
 minX=Math.floor(minX/step)*step;maxX=Math.ceil(maxX/step)*step;minY=Math.floor(minY/step)*step;maxY=Math.ceil(maxY/step)*step;
 const scale=Math.min(398/(maxX-minX),316/(maxY-minY)),left=(480-(maxX-minX)*scale)/2,top=(400-(maxY-minY)*scale)/2;
 return {minX,maxX,minY,maxY,step,scale,x:n=>left+(n-minX)*scale,y:n=>top+(maxY-n)*scale,invX:n=>(n-left)/scale+minX,invY:n=>maxY-(n-top)/scale};
}
function draw(id,preview=null){
 const el=$(`[data-lab="${id}"]`);if(!el)return;
 const v=views.get(id)||{index:0},d=entry(id),cv=$('canvas',el),ctx=cv.getContext('2d'),w=world(id),scene=buildScene(id,v.index,preview);
 ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,480,400);ctx.fillStyle=safeColor(ctx,scene.bg,'white');ctx.fillRect(0,0,480,400);
 if(d.grid!==false){
  ctx.font='11px Arial';ctx.lineWidth=1;ctx.textAlign='center';
  for(let n=w.minX;n<=w.maxX+w.step*.1;n+=w.step){ctx.strokeStyle=Math.abs(n)<1e-7?'#849ca0':'#e2eae9';ctx.beginPath();ctx.moveTo(w.x(n),w.y(w.minY));ctx.lineTo(w.x(n),w.y(w.maxY));ctx.stroke();ctx.fillStyle='#405e62';ctx.fillText(String(clean(n)),w.x(n),388);}
  ctx.textAlign='right';for(let n=w.minY;n<=w.maxY+w.step*.1;n+=w.step){ctx.strokeStyle=Math.abs(n)<1e-7?'#849ca0':'#e2eae9';ctx.beginPath();ctx.moveTo(w.x(w.minX),w.y(n));ctx.lineTo(w.x(w.maxX),w.y(n));ctx.stroke();ctx.fillStyle='#405e62';ctx.fillText(String(clean(n)),32,w.y(n)+4);}
  ctx.fillStyle='#405e62';ctx.fillText('x',469,388);ctx.fillText('y',22,20);
 }
 for(const s of scene.shapes){
  if(s.type==='line'){
   if(!s.pen&&!d.ghost)continue;ctx.beginPath();ctx.moveTo(w.x(s.from[0]),w.y(s.from[1]));ctx.lineTo(w.x(s.to[0]),w.y(s.to[1]));ctx.strokeStyle=s.pen?safeColor(ctx,s.color):'#89989e';ctx.lineWidth=s.pen?Math.max(1.4,s.width*w.scale):1.4;ctx.setLineDash(s.pen?[]:[5,5]);ctx.stroke();ctx.setLineDash([]);
  }else if(s.type==='fill'&&s.points?.length){ctx.beginPath();s.points.forEach((p,i)=>i?ctx.lineTo(w.x(p[0]),w.y(p[1])):ctx.moveTo(w.x(p[0]),w.y(p[1])));ctx.closePath();ctx.fillStyle=safeColor(ctx,s.fill);ctx.fill();ctx.strokeStyle=safeColor(ctx,s.color);ctx.lineWidth=Math.max(1.4,s.width*w.scale);ctx.stroke();
  }else if(s.type==='dot'){ctx.beginPath();ctx.arc(w.x(s.x),w.y(s.y),s.size*w.scale/2,0,2*Math.PI);ctx.fillStyle=safeColor(ctx,s.color);ctx.fill();
  }else if(s.type==='write'){const f=s.font||['Arial',10,'normal'];ctx.font=(String(f[2]).includes('bold')?'bold ':'')+Math.max(6,Math.min(70,Number(f[1])*w.scale))+'px Arial';ctx.textAlign=s.align||'left';ctx.fillStyle=safeColor(ctx,s.color);ctx.fillText(s.text,w.x(s.x),w.y(s.y));}
 }
 for(const s of Object.values(scene.turtles)){
  if(!s.visible||s.shape==='blank')continue;ctx.save();ctx.translate(w.x(s.x),w.y(s.y));ctx.rotate(-s.h*Math.PI/180);ctx.strokeStyle='#102f32';ctx.fillStyle=s.pen?safeColor(ctx,s.color):'white';ctx.lineWidth=1.4;ctx.beginPath();
  if(s.shape==='circle')ctx.arc(0,0,7,0,2*Math.PI);
  else if(s.shape==='square')ctx.rect(-7,-7,14,14);
  else if(s.shape==='turtle'){ctx.ellipse(0,0,8,6,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(10,0,3,0,Math.PI*2);}
  else{ctx.moveTo(12,0);ctx.lineTo(-8,-7);ctx.lineTo(-4,0);ctx.lineTo(-8,7);ctx.closePath();}ctx.fill();ctx.stroke();ctx.restore();
 }
 const state=scene.last;
 $('[data-ide-position]',el).textContent='('+clean(state.x)+', '+clean(state.y)+')';
 $('[data-ide-heading]',el).textContent=root.TurtleModel.heading(clean(state.h));
 $('[data-ide-pen]',el).textContent=state.pen?'Down':'Up';
 cv.setAttribute('aria-label',`Turtle drawing. Position ${clean(state.x)}, ${clean(state.y)}. Facing ${root.TurtleModel.heading(clean(state.h))}. Pen ${state.pen?'down':'up'}.`);
 const total=d.last?.events?.length||0,e=d.last?.events?.[Math.max(0,(preview?v.index+1:v.index)-1)];
 $('[data-ide-progress]',el).textContent=d.last?`${v.index} / ${total} Turtle actions`:'Not run yet';
 const line=v.index||preview?e?.line:null;
 $('[data-ide-line]',el).textContent=line?`Editor line ${line}: ${(d.lastCode||d.code).split('\n')[line-1]||''}`:'';
 if(v.line!==line){v.line=line;lineNumbers(el,line);}
 v.world=w;
}
function lineNumbers(el,current){
 const area=$('[data-ide-code]',el),n=area.value.split('\n').length;
 $('.python-lines',el).innerHTML=Array.from({length:n},(_,i)=>`<span class="${i+1===current?'python-line-active':''}">${i+1}</span>`).join('');
 $('.python-lines',el).scrollTop=area.scrollTop;
}
function status(id,text){const e=$(`[data-lab="${id}"] [data-ide-status]`);if(e)e.textContent=text;}
function buttons(id){const el=$(`[data-lab="${id}"]`);if(!el)return;const d=entry(id),v=views.get(id)||{},running=active?.id===id,done=d.last?.ok;
 $('[data-ide=run]',el).disabled=!allow(id);$('[data-ide=step]',el).disabled=!allow(id)||running&&active?.phase==='computing';
 $('[data-ide=stop]',el).disabled=!running&&!v.playing;
 $('[data-ide=rewind]',el).disabled=!d.last;$('[data-ide=finish]',el).disabled=!d.last;
 $('[data-ide=keep]',el).disabled=!done||running;
}
function endWorker(){if(worker){worker.terminate();worker=null;}if(workerURL){URL.revokeObjectURL(workerURL);workerURL=null;}clearTimeout(watchdog);watchdog=null;}
function stop(message=true){
 const id=active?.id;if(raf){cancelAnimationFrame(raf);raf=null;}endWorker();
 if(id){const v=views.get(id);if(v)v.playing=false;active=null;if(message)status(id,'Stopped. Your code is kept. Press Run to start again.');buttons(id);draw(id);}
}
function record(id,code,result){
 const d=entry(id);d.last=result;d.lastCode=code;
 const final=[...result.events].reverse().find(e=>e.state?.x!==undefined)?.state||spec(id).start;
 d.runCount=(d.runCount||0)+1;const item={at:new Date().toISOString(),ok:result.ok,line:result.line,error:result.error,final:{x:final.x,y:final.y,h:final.h,pen:final.pen},codeChanged:code!==spec(id).code,actions:result.events.length};
 d.runs.push(item);if(d.runs.length>20)d.runs.shift();if(!d.firstRun)d.firstRun={...item,code};
 mark();root.App.refreshQuestion?.(id);
}
function runtimeErrorHelp(text){
 if(/SyntaxError|ParseError/.test(text))return 'Check commas, brackets, quotes and spelling. The original prediction is still saved.';
 if(/IndentationError/.test(text))return 'Use four spaces inside a loop or if statement. Tab inserts four spaces here.';
 if(/NameError/.test(text))return 'Check the variable name and capital letters. The supplied Turtle is named t.';
 if(/AttributeError/.test(text))return 'Check the command spelling. Open the supported-command guide below.';
 if(/TimeLimit|limit|timed out/i.test(text))return 'Try fewer repetitions. Stop and Run will always start a fresh program.';
 return 'Read the Python message, change one thing, and run again.';
}
async function run(id,mode='play'){
 if(!allow(id)){root.App.toast(reason(id));return;}
 stop(false);const el=$(`[data-lab="${id}"]`),d=entry(id),code=$('[data-ide-code]',el).value;
 d.code=code;saveDraft(id);if(!root.TurtlePythonBundle){status(id,'Python runtime is missing. Extract the complete app folder and reload.');return;}
 views.set(id,{index:0,playing:false,line:null});active={id,phase:'computing'};status(id,'Running your Python in an isolated workspace…');buttons(id);
 $('[data-ide-error]',el).hidden=true;$('[data-ide-console]',el).textContent='';
 try{
  workerURL=URL.createObjectURL(new Blob([root.TurtlePythonBundle],{type:'text/javascript'}));worker=new Worker(workerURL);
  watchdog=setTimeout(()=>fail('Execution timed out. Use a smaller program or fewer repetitions.'),5500);
  worker.onmessage=e=>{if(!active||active.id!==id||e.data?.type!=='result')return;const result=e.data;endWorker();active=null;record(id,code,result);
   const box=$(`[data-lab="${id}"]`);if(!box)return;
   $('[data-ide-console]',box).textContent=result.output||'(No print output. Look at the drawing.)';
   const err=$('[data-ide-error]',box);err.hidden=result.ok;err.textContent=result.ok?'':result.error+'\n'+runtimeErrorHelp(result.error||'');
   views.set(id,{index:0,playing:false,line:null});draw(id);buttons(id);
   if(!result.ok){views.get(id).index=result.events.length;draw(id);status(id,`Python stopped${result.line?' at editor line '+result.line:''}. Fix the code and try again.`);return;}
   if(!result.events.length){status(id,'Python finished. This program made no Turtle drawing changes.');return;}
   if(mode==='step'){step(id);status(id,'Paused. Press Step to see the next Turtle action.');}
   else play(id);
  };
  worker.onerror=e=>{e.preventDefault();fail('Python could not start. '+(e.message||'The browser may block Web Workers. Try the hosted lesson in a full browser tab.'));};
  worker.postMessage({type:'run',code,start:spec(id).start});
 }catch(e){fail('Python could not start: '+e.message+'. Open the hosted lesson in a full browser tab.');}
 function fail(message){endWorker();active=null;const result={ok:false,events:[],output:'',error:message,line:null};record(id,code,result);const box=$(`[data-lab="${id}"]`);if(box){$('[data-ide-error]',box).textContent=message;$('[data-ide-error]',box).hidden=false;}status(id,message);buttons(id);}
}
function play(id){
 const d=entry(id),v=views.get(id),events=d.last?.events||[];if(!v||!events.length)return;
 if(v.index>=events.length)v.index=0;
 stop(false);active={id,phase:'playback'};v.playing=true;buttons(id);
 const duration=()=>({slow:850,normal:420,fast:110,instant:0})[entry(id).speed]??420;
 let then=performance.now();
 function frame(now){if(!active||active.id!==id)return;const e=events[v.index],dur=duration();
  if(!e){finish();return;}
  const f=dur===0?1:Math.min(1,(now-then)/dur);
  if(f<1){draw(id,{f});raf=requestAnimationFrame(frame);return;}
  v.index++;draw(id);then=now;
  if(dur===0){v.index=events.length;draw(id);finish();return;}
  if(v.index>=events.length){finish();return;}
  raf=requestAnimationFrame(frame);
 }
 function finish(){v.playing=false;active=null;raf=null;status(id,'Run complete. Compare the drawing with your prediction. Then change one thing and test again.');buttons(id);}
 status(id,'Playing your program. Position and facing direction update as it runs.');raf=requestAnimationFrame(frame);
}
function step(id){
 const d=entry(id),v=views.get(id),area=$(`[data-lab="${id}"] [data-ide-code]`);
 if(!allow(id))return;
 if(!d.last||d.lastCode!==area.value||!d.last.ok){run(id,'step');return;}
 stop(false);if(v.index>=d.last.events.length)v.index=0;v.index=Math.min(v.index+1,d.last.events.length);draw(id);status(id,v.index>=d.last.events.length?'Last action reached. Compare this result with your prediction.':'Paused. Press Step for the next Turtle action.');buttons(id);
}
function saveDraft(id){const d=entry(id);if(id==='extension')root.App.state.extensionCode=d.code;mark();}
function downloadPython(id){const d=entry(id),blob=new Blob([setup(id)+'\n\n# Question code\n'+d.code+'\n\nturtle.done()\n'],{type:'text/x-python;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Y7_W3_'+id+'.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
function insert(el,text,command=false){const area=$('[data-ide-code]',el),a=area.selectionStart,b=area.selectionEnd;
 const before=area.value.slice(0,a),after=area.value.slice(b),prefix=command&&before&&!before.endsWith('\n')?'\n':'',suffix=command?'\n':'';
 area.setRangeText(prefix+text+suffix,a,b,'end');area.dispatchEvent(new Event('input',{bubbles:true}));area.focus();}
function keep(id){
 const d=entry(id),all=root.App.state.pythonLabs||{},last=d.last;if(!last?.ok)return;
 if(d.code!==d.lastCode){root.App.toast('Run your edited code first so the code and picture match.');return;}
 if(!d.kept&&Object.values(all).filter(x=>x.kept).length>=3){root.App.toast('Keep up to three useful tests. Remove an earlier kept test before adding another.');return;}
 if(d.lastCode.split('\n').length>35||d.lastCode.length>2000||d.lastCode.split('\n').some(line=>line.length>140)){root.App.toast('For the PDF, use a focused test: up to 35 short lines / 2000 characters. Save longer programs as .py files.');return;}
 stop(false);views.get(id).index=last.events.length;draw(id);
 const cv=$(`[data-lab="${id}"] canvas`),final=[...last.events].reverse().find(e=>e.state?.x!==undefined)?.state||spec(id).start;
 d.kept={at:new Date().toISOString(),title:spec(id).title,start:spec(id).start,code:d.lastCode,output:last.output.slice(0,1200),final:{x:final.x,y:final.y,h:final.h,pen:final.pen},image:cv.toDataURL('image/jpeg',.8),observation:d.observation,afterCheckpoint:id==='checkpoint'};
 const panel=$(`[data-lab="${id}"]`);if(!$('[data-ide=unkeep]',panel))$('[data-ide=download]',panel).insertAdjacentHTML('afterend','<button class="small quiet" data-ide="unkeep">Remove kept test</button>');
 mark();$(`[data-lab="${id}"] [data-ide-kept]`).textContent='Kept in your PDF: code, actual output and your observation.';$(`[data-lab="${id}"] [data-ide=keep]`).textContent='Update kept test';root.App.toast('Test evidence kept. It will be included in your single lesson PDF.');
}
function mount(){
 views.clear();document.querySelectorAll('[data-lab]').forEach(el=>{
  const id=el.dataset.lab,d=entry(id);views.set(id,{index:d.last?.events?.length||0,playing:false,line:null});lineNumbers(el);draw(id);buttons(id);
  const area=$('[data-ide-code]',el);area.addEventListener('scroll',()=>{$('.python-lines',el).scrollTop=area.scrollTop;});
  area.addEventListener('input',()=>{if(active?.id===id)stop();d.code=area.value;saveDraft(id);lineNumbers(el);if(d.lastCode!==d.code)status(id,'Code changed. The picture is from your last run. Press Run to test this version.');});
  area.addEventListener('keydown',e=>{
   if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run(id);return;}
   if(e.key==='Tab'){e.preventDefault();if(!e.shiftKey){insert(el,'    ');}else{const pos=area.selectionStart,ls=area.value.lastIndexOf('\n',pos-1)+1;if(area.value.slice(ls,ls+4)==='    '){area.setRangeText('',ls,ls+4,'preserve');area.dispatchEvent(new Event('input',{bubbles:true}));}}}
   if(e.key==='Enter'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();const current=area.value.slice(0,area.selectionStart).split('\n').at(-1),indent=(current.match(/^\s*/)||[''])[0]+(current.trimEnd().endsWith(':')?'    ':'');insert(el,'\n'+indent);}
  });
  $('[data-ide-note]',el).addEventListener('input',e=>{d.observation=e.target.value;if(d.kept)d.kept.observation=d.observation;mark();});
  el.querySelectorAll('[data-ide-setting]').forEach(input=>input.addEventListener('change',()=>{d[input.dataset.ideSetting]=input.type==='checkbox'?input.checked:input.value;mark(false);draw(id);}));
  el.addEventListener('click',e=>{const b=e.target.closest('[data-ide]');if(!b)return;const action=b.dataset.ide;
   if(action==='view-output'||action==='view-code')$(action==='view-output'?'.python-output-side':'.python-code-side',el).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
   if(action==='run')run(id);
   if(action==='step')step(id);
   if(action==='stop')stop();
   if(action==='reset'){if(d.code!==spec(id).code&&!confirm('Restore this question’s original code? Your predictions and kept evidence will remain.'))return;stop(false);d.code=spec(id).code;area.value=d.code;d.last=null;d.lastCode=null;saveDraft(id);views.set(id,{index:0,line:null});lineNumbers(el);draw(id);buttons(id);$('[data-ide-error]',el).hidden=true;$('[data-ide-console]',el).textContent='';status(id,'Original code restored. Ready for a fresh run.');}
   if(action==='rewind'){stop(false);views.get(id).index=0;draw(id);status(id,'Back at the starting state. Press Step, or Run to execute again.');buttons(id);}
   if(action==='finish'){stop(false);views.get(id).index=d.last?.events.length||0;draw(id);status(id,'Showing the end of your last run.');buttons(id);}
   if(action==='insert')insert(el,b.dataset.code,true);
   if(action==='symbol')insert(el,b.dataset.code);
   if(action==='indent')insert(el,'    ');
   if(action==='punctuation'){area.value=area.value.replace(/[（），＃：；]/g,c=>({'（':'(','）':')','，':',','＃':'#','：':':','；':';'}[c])).replace(/[“”]/g,'"').replace(/[‘’]/g,"'");area.dispatchEvent(new Event('input',{bubbles:true}));root.App.toast('Smart punctuation converted. Check the code, then run again.');}
   if(action==='download')downloadPython(id);
   if(action==='keep')keep(id);
   if(action==='unkeep'){delete d.kept;mark();b.remove();$('[data-ide-kept]',el).textContent='Test removed from PDF evidence.';$('[data-ide=keep]',el).textContent='Keep this test in my PDF';}
   if(action==='expand'){const on=el.classList.toggle('python-expanded');document.body.classList.toggle('python-expanded-open',on);b.textContent=on?'Close expanded editor':'Expand editor';b.setAttribute('aria-expanded',String(on));root.ScreenFit?.refresh();}
  });
  $('canvas',el).addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect(),w=views.get(id)?.world;if(w)$('.python-cursor-readout',el).textContent='Pointer ('+clean(w.invX((e.clientX-r.left)/r.width*480))+', '+clean(w.invY((e.clientY-r.top)/r.height*400))+')';});
  $('canvas',el).addEventListener('pointerleave',()=>$('.python-cursor-readout',el).textContent='');
 });
}
function beforeRender(){stop(false);document.body.classList.remove('python-expanded-open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const el=$('.python-expanded');if(el){el.classList.remove('python-expanded');document.body.classList.remove('python-expanded-open');$('[data-ide=expand]',el).textContent='Expand editor';$('[data-ide=expand]',el).focus();}}});
window.addEventListener('pagehide',()=>stop(false));
root.TurtleIDE={html,mount,beforeRender,spec,hasRun,allow,run,stop,draw,entry};
})(window);
