/* Evidence-led learning choices and Pit Stop. No score is assigned to learning phases. */
const learningStrategies=[
 ['revisit','Revisit the layer example','先回顾图层示例','Go back to Do Now. Point to one whole frame, then name the smaller part you would edit. Return here when you can explain the difference.','回到热身：先指出一整个画格，再说出要修改的图层。'],
 ['demo','Use a demonstration on the practice board','先看练习画板的示范','On the practice board, ask a partner or teacher to show Duplicate frame → Select Face. Then change two pixels and play the copy yourself.','请同伴或老师示范复制画格和选择 Face（脸）图层。然后自己改两个像素并播放。'],
 ['independent','Try the practice board independently','先独立尝试练习画板','On the practice board, try Duplicate frame → Select Face → change two pixels → Play without help first. If the body moves, revisit the frame model.','先自己复制画格、选择 Face（脸）图层、改两个像素并播放。身体移动了就回看示例。']
];
function refText(parent,tag,content,className){
 const el=document.createElement(tag);el.textContent=content;if(className)el.className=className;parent.append(el);return el;
}
function refChinese(parent,text,tag='p'){
 const p=refText(parent,tag,text,'zh');p.lang='zh-Hans';return p;
}
function currentStrategy(){return learningStrategies.find(item=>item[0]===state.notes.learningStrategy);}
function starterExample(){
 return {question:doNow[0][1],answer:doNow[0][3][doNowAnswer(0)]};
}
function bindLearning(){
 const starter=starterExample(),e=$('#starterEvidence'),options=$('#learningChoices'),next=$('#learningNext');
 refText(e,'h2','Your Do Now evidence');
 refText(e,'p',starter.question);refText(e,'p',starter.answer?'Your saved answer: '+starter.answer:'No starter answer saved in this preview.');
 if(state.notes.starterNote)refText(e,'p','Your discussion note: '+state.notes.starterNote);
 function update(){
  next.replaceChildren();const strategy=currentStrategy();
  refText(next,'h2','Your next action');
  if(!strategy){refText(next,'p','Choose a starting strategy. You can change your mind later.');refChinese(next,'选择一个起步方法，之后也可以修改。');return;}
  refText(next,'p',strategy[3]);refChinese(next,strategy[4]);
  if(strategy[0]==='revisit'){const b=refText(next,'button','Revisit the Do Now example');b.onclick=()=>go('learn');}
 }
 learningStrategies.forEach(([id,label,zh])=>{
  const row=document.createElement('label'),r=document.createElement('input');r.type='radio';r.name='strategy';r.value=id;r.checked=state.notes.learningStrategy===id;row.append(r);
  const words=refText(row,'span',label);refChinese(words,zh,'span');
  r.onchange=()=>{state.notes.learningStrategy=id;update();save();};options.append(row);
 });update();
}
function pitEvidence(){
 const n=state.notes,stamp=frameStamp(),trials=state.route==='pythonRoute'?pythonTrials():[];
 if(trials.length>=2)return {kind:'python',stamp,runs:[trials[0],trials.at(-1)],observation:n.pythonObservation||''};
 const checkedScratch=state.route==='scratch'&&n.scratchStamp===stamp;
 if(checkedScratch&&meaningful(n.scratchObservation))return {kind:'scratch',stamp,file:n.scratchFile||'Scratch project',observation:n.scratchObservation};
 if(n.assisted?.stamp===stamp&&n.assisted.route===state.route)return {kind:'supported',stamp,note:n.assisted.value,file:checkedScratch?n.scratchFile:undefined};
 return {kind:'example',stamp};
}
function pitEvidenceKey(e){
 return JSON.stringify([e.kind,e.stamp,e.runs?.map(r=>r.timeline),e.file,e.observation,e.note]);
}
function pitComparisonSaved(e){
 return meaningful(state.notes.pitCompare)&&state.notes.pitCompareKey===pitEvidenceKey(e||pitEvidence());
}
function timelineText(timeline){
 return timeline.map(([i,seconds])=>(state.frames[i]?.name??('Frame '+i))+' ('+seconds+' s)').join(' → ');
}
function renderPitEvidence(e,root){
 const starter=starterExample(),k=document.createElement('section');k.className='concept';
 refText(k,'h3','Knowledge · What did you recognise?');
 refText(k,'p',starter.answer?'Your Do Now answer: '+starter.answer:'No Do Now answer recorded. A layer is one editable part of a frame.');
 root.append(k);
 const skill=document.createElement('section');skill.className='concept';
 refText(skill,'h3','Skills · What did you build and test?');
 const hasFrames=distinctFrames()>0;
 if(hasFrames){
  refText(skill,'p',previewMode?'Frames in the teacher preview:':'Your current studio boards:');const strip=document.createElement('div');strip.className='sample-strip';
  state.frames.forEach((frame,i)=>{const f=document.createElement('figure');f.append(art(frame.design,5));refText(f,'figcaption',(i+1)+' · '+frame.name);strip.append(f);});skill.append(strip);
 }
 if(e.kind==='python'){
  refText(skill,'p','Two Python runs recorded for these boards. The sequence below shows the order and delay actually sent to the preview.');
  e.runs.forEach((run,i)=>{const details=document.createElement('details');details.className='pit-run';refText(details,'summary','Test '+(i+1)+' · View the Python code');refText(details,'pre',run.source||'Code not available.');refText(skill,'p','Test '+(i+1)+': '+timelineText(run.timeline),'pit-timeline');skill.append(details);});
 }else if(e.kind==='scratch'){
  refText(skill,'p','Saved project checked: '+e.file);
  refText(skill,'p','The file matched the studio frames and loop structure. The app did not watch the Scratch animation; the note below is what you reported.');
  refChinese(skill,'文件检查只核对画格和循环结构。下面的运行结果来自你的观察。');
 }else if(e.kind==='supported'){
  refText(skill,'p','Supported attempt — no verified animation test.');if(e.file)refText(skill,'p','Saved project checked: '+e.file+'; no test observation recorded.');refText(skill,'p',e.note);
 }else{
  refText(skill,'p','No comparable animation test recorded. Worked example only — not evidence of your own work.');
  refText(skill,'p','Example test 1: Calm → Surprised → Happy (0.4 s each). Example test 2: the same order (0.8 s each).');
  refChinese(skill,'下面是示范，不代表你的测试结果。两次顺序相同，第二次每个画格显示更久。');
 }
 if(e.observation)refText(skill,'p','Your test note: '+e.observation);
 root.append(skill);
}
function bindPit(){
 const e=pitEvidence(),compare=$('#pitCompare'),work=$('#pitWork'),feel=$('#pitFeel'),workButton=$('#pitShowWork'),phaseButton=$('#pitShowPhase'),hint=$('#pitWorkHint');
 renderPitEvidence(e,$('#pitEvidence'));
 if(e.kind==='supported'||e.kind==='example'){
  $('#pitPrompt').textContent='What can you show now, and what would you test next?';
  $('#pitStem').textContent='“I can show ___. Next I would test ___ by ___.” You can use the worked example for ideas, but label your own evidence.';
 }else{
  $('#pitStem').textContent='“Between test 1 and test 2, ___ changed. ___ stayed the same.” Use your frames, timing or test note as evidence.';
 }
 compare.value=pitComparisonSaved(e)?state.notes.pitCompare:'';
 compare.oninput=()=>{state.notes.pitCompare=compare.value;state.notes.pitCompareKey=pitEvidenceKey(e);hint.textContent='';save();};
 function showPhase(show){
  if(show&&!pitComparisonSaved(e)){hint.textContent='Add a short comparison or next test before choosing a phase.';compare.focus();return;}
  work.hidden=show;feel.hidden=!show;workButton.setAttribute('aria-pressed',String(!show));phaseButton.setAttribute('aria-pressed',String(show));
  const heading=(show?feel:work).querySelector('h2');heading.tabIndex=-1;heading.focus();
 }
 workButton.onclick=()=>showPhase(false);phaseButton.onclick=$('#pitContinue').onclick=()=>showPhase(true);
 function advice(){
  const target=$('#nextAdvice'),choice=phases.find(([phase])=>phase===state.notes.phase);
  target.replaceChildren();refText(target,'h3','Your next action');
  if(!choice){refText(target,'p','Choose the phase that fits this piece of work.');return;}
  refText(target,'p',choice[3]);const [label,dest,zh]=phaseActions[choice[0]];
  refChinese(target,zh);const b=refText(target,'button',label);b.onclick=()=>go(dest);
 }
 phases.forEach(([name,meaning,zh])=>{
  const row=document.createElement('label'),r=document.createElement('input');r.type='radio';r.name='phase';r.value=name;r.checked=state.notes.phase===name;row.append(r);refText(row,'span',name+' — '+meaning);refChinese(row,zh,'span');
  r.onchange=()=>{state.notes.phase=name;advice();save();};$('#phaseOptions').append(row);
 });
 notes('reflectNote');advice();
}
const phaseActions={
 'New learning':['Revisit the loop model','model2','回看循环示例，再独立改变一个设置。'],
 'Consolidating':['Revisit your animation route','code','再做一次测试，并解释其中一个变化。'],
 'Treading water':['Open Go Further','extend','挑战自己：比较不同停顿时间或用按键触发表情。'],
 'Drowning / need a demo':['Revisit the practice board','practice','请老师示范你卡住的一步。此页面不会自动通知老师。']
};
function reflectionReport(){
 const e=pitEvidence(),strategy=currentStrategy(),starter=starterExample();
 const oldLearning=[0,1,2].map(i=>state.notes['start'+i]);const oldPit=[0,1,2].map(i=>state.notes['pit'+i]);
 return [
  'Types of Learning\nDo Now evidence: '+(starter.answer||'Not answered')+'\nStarting strategy: '+(strategy?.[1]||'Not recorded')+'\nNext action: '+(strategy?.[3]||'Not recorded'),
  'Pit Stop · Evidence reviewed: '+({python:'Two recorded Python runs',scratch:'Scratch project file check and reported observation',supported:'Supported attempt, not verified',example:'Worked example, not student test evidence'})[e.kind],
  'Comparison / next test: '+(pitComparisonSaved(e)?state.notes.pitCompare:'Not recorded for this evidence'),
  'Learning phase (self-report): '+(state.notes.phase||'Not recorded')+'\nReason: '+(state.notes.reflectNote||'Not recorded'),
  ...(oldLearning.some(Number.isInteger)?['Earlier Types of Learning responses (option numbers, 1-based): '+oldLearning.map(i=>Number.isInteger(i)?i+1:'Not answered').join(', ')]:[]),
  ...(oldPit.some(Number.isInteger)?['Earlier Pit Stop checks (option numbers, 1-based): '+oldPit.map(i=>Number.isInteger(i)?i+1:'Not answered').join(', ')]:[])
 ];
}
