'use strict';
const $=s=>document.querySelector(s), E=window.PixelEngine, S=window.PixelSprites;
const stages=[['intro','Mission'],['before','Learning goals'],['learn','Do Now'],['types','Types of Learning'],['history','Arcade archive'],['model1','Frame model'],['practice','Practice board'],['draw','Main Task 1'],['model2','Loop model'],['code','Main Task 2'],['scratch','Scratch route'],['pythonRoute','Python route'],['reflect','Learning Pit Stop'],['extend','Go Further'],['plenary','Plenary'],['finish','Save & submit'],['review','Review']];
const oldStages=['intro','learn','draw','code','reflect','finish','review'];
const key='sprite-sheet-studio-8t-v1', previewMode=new URLSearchParams(location.search).get('preview')==='1';
const faceColours=['#29233f','#ffffff','#d64472'];
const make=(name,design)=>({name,design});
function example(expression=0){
 const d=E.create();
 d.layers[0].pixels=S.pixels('seed');
 // Move the original eye/mouth area onto its own editable layer.
 for(let y=9;y<=11;y++)for(let x=5;x<=10;x++)d.layers[0].pixels[16*y+x]='#9a72db';
 const dots=[[[5,9,1],[10,9,1],[7,11,0],[8,11,0]],[[5,9,1],[10,9,1],[7,10,0],[8,10,0],[7,11,0],[8,11,0]],[[5,9,0],[10,9,0],[6,10,2],[9,10,2],[7,11,1],[8,11,1]]];
 dots[expression].forEach(([x,y,c])=>d.layers[1].pixels[y*16+x]=faceColours[c]);d.selected='face';
 return d;
}
function fresh(){return {name:'',group:'8T',zh:false,stage:'intro',frames:[make('Calm',E.create())],index:0,delay:.4,score:0,quizQueue:[],quizSeen:0,notes:{}};}
const normDelay=v=>Number.isFinite(+v)&&+v>=.1&&+v<=2?+v:.4;
function clean(d){const v=E.validate(E.clone(d));v.versions=[];return v;}
function validFrames(list){
 if(!Array.isArray(list)||list.length<1||list.length>5)throw Error('A project must contain 1–5 frames.');
 return list.map(f=>{if(typeof f.name!=='string'||!f.name.trim()||f.name.length>30)throw Error('Invalid frame name.');return make(f.name,clean(f.design));});
}
let state=fresh(), editor=null, clock=null, quizAnswer=false, iPreview=0;
if(!previewMode)try{const v=JSON.parse(localStorage.getItem(key));if(v?.name){state={...fresh(),...v,frames:validFrames(v.frames)};state.stage=(typeof v.stage==='number'?oldStages[v.stage]:stages.find(([id])=>id===v.stage)?.[0])||'intro';state.notes=v.notes||{};state.index=Math.max(0,Math.min(state.frames.length-1,state.index|0));state.delay=normDelay(state.delay);}}catch{}
if(previewMode){state.name='Teacher example';state.frames=['Calm','Surprised','Happy'].map((n,i)=>make(n,example(i)));state.stage=stages.find(([id])=>id===new URLSearchParams(location.search).get('stage'))?.[0]||'draw';}
function save(){progress();if(previewMode){$('#saveStatus').textContent='Teacher preview · not saved';return;}try{localStorage.setItem(key,JSON.stringify(state));$('#saveStatus').textContent='Saved on this device';}catch{$('#saveStatus').textContent='Not saved · download a backup';}}
function flag(){document.body.classList.toggle('bilingual',state.zh);$('#zh').checked=state.zh;}
$('#zh').onchange=e=>{state.zh=e.target.checked;flag();save();};
function halt(){clearInterval(clock);clock=null;}
function go(id){
 if(!stages.some(([stage])=>stage===id)||(!state.name&&id!=='intro'))return;
 if(id==='scratch'||id==='pythonRoute'){const why=firstBlock('code');if(why){blocked(why);return;}state.route=id;}
 const why=firstBlock(id);if(why){blocked(why);return;}
 halt();stopPython();state.stage=id;render();save();window.scrollTo(0,0);$('h1')?.setAttribute('tabindex','-1');$('h1')?.focus({preventScroll:true});
}
function blocked(why){const p=$('.navigation-alert');if(p){p.hidden=false;p.textContent='Before moving on: '+why;p.focus();}}
function art(d,k=1){return S.canvas(E.composite(d),k);}
function examples(where,first=false){
 const strip=document.createElement('div');strip.className='sample-strip';
 ['Calm','Surprised','Happy'].forEach((name,i)=>{const f=document.createElement('figure'),label=document.createElement('figcaption');label.textContent=(first?'':'Frame '+(i+1)+' · ')+name;f.append(art(example(i),6),label);strip.append(f);});where.append(strip);
}
function render(){
 editor?.destroy();editor=null;quizAnswer=false;
 const nav=$('#steps');nav.replaceChildren();stages.filter(([id])=>journey().includes(id)).forEach(([id,title],i)=>{const b=document.createElement('button');b.textContent=(i+1)+' · '+title;b.append(document.createElement('span'));b.dataset.stage=id;b.disabled=!state.name&&i>0;if(id===state.stage)b.setAttribute('aria-current','step');b.onclick=()=>go(id);nav.append(b);});
 const t=state.stage;
 $('#main').replaceChildren($('#'+t).content.cloneNode(true));
 flag();
 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 if(t!=='intro'){
  const b=document.createElement('button'),p=document.createElement('p'),g=document.createElement('p');b.className='lesson-back';b.textContent='← Back';b.onclick=()=>go(journey()[journey().indexOf(t)-1]||'code');p.className='progress-hint';g.className='navigation-alert';g.setAttribute('role','status');g.tabIndex=-1;g.hidden=true;
  const card=$('#main article');card.append(b);card.querySelector('h1').after(g);(card.querySelector('.next')||b).before(p);
 }
 if(t==='intro'){examples($('#opening'),true);const f=$('#entry');f.elements.pupil.value=state.name;f.elements.group.value=state.group;f.onsubmit=e=>{e.preventDefault();const name=f.elements.pupil.value.trim(),group=f.elements.group.value.trim();if(!name||!group)return;state.name=name;state.group=group;go('before');};}
 if(t==='learn'){examples($('#explainer'));const feedback=()=>{$('#feedback').textContent=state.notes.check==='yes'?'Yes: the Face layer is one part of one frame.':state.notes.check==='no'?'Look at the Face layer, not the whole sheet.':'';document.querySelectorAll('[data-check]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.check===state.notes.check)));};document.querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>{state.notes.check=b.dataset.check;feedback();save();});feedback();}
 if(t==='types'){ $('#starterEvidence').textContent=({yes:'In Do Now you identified the Face layer. Now try choosing the action and explaining why it works.',no:'In Do Now your answer was the whole sheet. Look again: the eye pixels are part of the Face layer in one frame.'})[state.notes.check]||'No Do Now answer recorded. You can go back to try it, or use the examples below.';checks($('#typeChecks'),learning,'start');}
 if(t==='history')bindArchive();
 if(t==='model1'){examples($('#modelFrames'));checks($('#frameDiscussion'),[discussion[0]],'discuss');}
 if(t==='practice')bindPractice();
 if(t==='model2'){examples($('#loopFrames'));checks($('#speedDiscussion'),[discussion[1]],'predict');bindLoopModel();}
 if(t==='draw') bindDraw();
 if(t==='code')bindRouteChoice();
 if(t==='scratch')bindScratch();
 if(t==='pythonRoute')bindPython();
 if(t==='reflect')bindPit();
 if(t==='extend')bindExtensions();
 if(t==='plenary')notes('exitNote');
 if(t==='finish'){$('#finalSheet').onclick=exportSheet;$('#finalBackup').onclick=exportBackup;$('#evidence').onclick=evidence;const b=$('#finalBrowserPy');b.hidden=state.route!=='pythonRoute';b.onclick=()=>{const trials=pythonTrials();file(trials.at(-1)?.source??pythonStarter(),'sprite_animation_browser.py','text/x-python');};}
 if(t==='review') quiz();
}
function notes(id){const input=$('#'+id);input.value=state.notes[id]||'';input.oninput=()=>{state.notes[id]=input.value;save();};}
const learning=[
 ['Knowledge · Remember','One picture shows Garden Guide looking surprised. What do we call that complete picture?','一张表现惊讶的完整图片叫什么？',['A layer','A frame','A sprite sheet'],1,'Point to a single frame, then recall what a sheet contains.'],
 ['Skills · Practise','You want a surprised version without losing Calm. Which action should you try first?','怎样保留平静表情，同时制作惊讶的版本？',['Duplicate the Calm frame','Erase the body','Draw a new character'],0,'In Main Task 1, duplicate first. Select Face and change one feature on the copy.'],
 ['Understanding · Explain','Why leave the body in the same position across frames?','为什么每一帧的身体位置应该保持不变？',['It adds more layers','It makes the file animate by itself','The expression changes without the body jumping'],2,'When you play your preview, watch the edge of the body to check it stays still.']
];
const discussion=[
 ['Talk it through','Point to one change and one thing that stays still. If the body jumps sideways, what would you fix?','指出一个变化和一个不变的地方。如果身体跳到一边，怎样修正？',['Line up the body with the original frame','Add a new colour to the mouth','Speed up the preview'],0,'Compare the silhouette on the same grid squares before you edit the face.'],
 ['Predict before you play','Talk to a partner: when the delay changes from 0.8 s to 0.4 s, what changes and what stays the same?','和同伴预测：停顿从 0.8 秒改为 0.4 秒时，什么变了？什么没变？',['The frame order reverses','The same frames play in the same order, faster','There are fewer frames'],1,'Run both buttons below. Count the same three frames and compare how long each stays visible.']
];
const pit=[
 ['Knowledge · Identify','The file you exported contains all your frames side by side. What is it?','哪种文件把所有画格并排放在一起？',['One costume','A sprite sheet','One layer'],1,'A sheet stores frames; it does not play them by itself.'],
 ['Skills · Check your work','Run your Scratch or Python project and watch two loops. Compare the frame order with your sheet. Which evidence can you show?','运行 Scratch 或 Python 项目，观察两轮。你能展示什么？',['My coded animation plays in the order I intended','I have a sheet or studio preview, but not a working coded loop yet','I need someone to model one step'],null,'A preview is useful. The skill here is running the animation you programmed.'],
 ['Understanding · Explain','What would you change to hold Surprise longer without changing the order?','要延长惊讶表情的显示时间，但不改变顺序，该改什么？',['Increase the wait for Surprise','Move Surprise to the first position','Duplicate the body layer'],0,'A wait changes how long a frame stays on screen, not its position.']
];
function checks(box,items,prefix,after=()=>{}){
 items.forEach(([title,prompt,zh,choices,correct,advice],i)=>{
  const id=prefix+i,f=document.createElement('fieldset'),legend=document.createElement('legend'),p=document.createElement('p'),help=document.createElement('p'),result=document.createElement('p');
  legend.textContent=title;p.textContent=prompt;help.className='zh';help.lang='zh-Hans';help.textContent=zh;result.className='check-feedback';result.setAttribute('role','status');f.append(legend,p,help);
  const show=()=>{const n=state.notes[id];result.textContent=Number.isInteger(n)?(correct===null?'Recorded. ':n===correct?'That fits. ':'Not quite. ')+advice:'';};
  choices.forEach((choice,n)=>{const l=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name=id;input.checked=state.notes[id]===n;l.append(input,document.createTextNode(choice));f.append(l);input.onchange=()=>{state.notes[id]=n;show();after();save();};});
  f.append(result);box.append(f);show();
 });
}
function bindLoopModel(){
 const frames=['Calm','Surprised','Happy'].map((name,i)=>[name,example(i)]);
 function show(i){const [name,d]=frames[i],p=document.createElement('p');p.textContent='Example · '+name;$('#loopPreview').replaceChildren(art(d,6),p);}
 const status=()=>$('#speedStatus').textContent=[state.notes.modelSlow?'0.8 s ✓':'0.8 s still to try',state.notes.modelFast?'0.4 s ✓':'0.4 s still to try'].join(' · ');
 function start(ms){halt();let i=0;const key=ms===800?'modelSlow':'modelFast';show(i);clock=setInterval(()=>{show(i=(i+1)%frames.length);if(!i&&!state.notes[key]){state.notes[key]=true;status();save();}},ms);}
 $('#slowModel').onclick=()=>start(800);$('#fastModel').onclick=()=>start(400);$('#stopModel').onclick=()=>{halt();show(0);};show(0);status();
}
const phases=[
 ['New learning','This was new and challenging, but I made progress.','新学习：虽然有挑战，但我取得了进步。','Replay the frame or loop model, then try one change without the model.'],
 ['Consolidating','I’ve met this before; I can now do it more accurately or independently.','巩固中：我以前学过，现在做得更准确或更独立。','Run another test and explain one difference without using the sentence starter.'],
 ['Treading water','I could already do and explain this; I need a harder challenge.','需要更多挑战：我已经会做，也能解释。','Try Timing Director or Trigger a Reaction in Go Further and compare the results.'],
 ['Drowning / need a demo','I’m still stuck after trying and need someone to show me one step.','需要帮助：我尝试过但仍卡住，需要有人示范一步。','Show this page to your teacher. Point to the step you need modelled. This page does not send a help alert.']
];
function bindPit(){
 const update=()=>{
  const attempted=pit.filter((_,i)=>Number.isInteger(state.notes['pit'+i])).length;
  const conceptMatches=[0,2].filter(i=>state.notes['pit'+i]===pit[i][4]).length;
  const skill=['Coded loop reported','Studio preview or sheet only','Needs a demonstration'][state.notes.pit1]||'Not recorded';
  const p=phases.find(([name])=>name===state.notes.phase);
  $('#nextAdvice').textContent=attempted+' / 3 checks tried · '+conceptMatches+' / 2 concept answers matched · Skill evidence: '+skill+'. '+(p?'Next step: '+p[3]:'Choose a phase based on your evidence and how the work felt.');
 };
 checks($('#pitChecks'),pit,'pit',update);
 phases.forEach(([name,meaning,zh])=>{const l=document.createElement('label'),r=document.createElement('input'),b=document.createElement('span'),extra=document.createElement('span');r.type='radio';r.name='phase';r.checked=state.notes.phase===name;b.textContent=name+' — '+meaning;extra.className='zh';extra.lang='zh-Hans';extra.textContent=zh;l.append(r,b,extra);$('#phaseOptions').append(l);r.onchange=()=>{state.notes.phase=name;update();save();};});
 notes('reflectNote');update();
}
const extensions=[
 ['1 · Timing Director','A player keeps missing the warning face. Make Surprised hold for 0.8 s and the other two for 0.4 s.','延长惊讶表情的显示时间；比较玩家是否更容易看到。','Delay means time on screen, not frame order.','Scratch: inside one loop, explicitly switch to each costume and add its own wait. Python: in tick(), choose the delay for the frame just shown before advancing the counter.','Play both versions. Which one makes the warning easier to spot, and why?'],
 ['2 · Make it readable in a cave','Your character moves into a dark level. Pick one face detail that disappears against a dark backdrop.','在深色背景上比较表情，把看不清的细节改清楚。','Contrast is the difference between neighbouring colours.','In Scratch, try a dark backdrop. In the studio, adjust only two or three pixels on Face, then re-export and compare at game size.','Name the detail, the pixels you changed, and why it is easier to see.'],
 ['3 · Trigger a Reaction','Make the face react when the player presses Space instead of surprising them every loop.','按空格键才显示惊讶表情，然后回到平静。','A key press is an event: it tells the program when to run a script.','Scratch: take the repeating loop out of the flag script. Start on Calm, then use when [space] key pressed → switch to Surprised → wait 0.8 seconds → switch to Calm. Python stretch: use a key binding, a one-shot window.after callback and no repeating tick for this version.','Test with no key press, then press Space. Why did you remove the second script that switches frames?']
];
function bindExtensions(){
 extensions.forEach(([title,brief,zh,k,s,u],i)=>{
  const d=document.createElement('details'),summary=document.createElement('summary');summary.textContent=title;d.append(summary);
  for(const [label,value] of [['Scenario',brief],['Knowledge · Remember',k],['Skills · Try',s],['Understanding · Compare',u]]){const p=document.createElement('p'),b=document.createElement('b');b.textContent=label+': ';p.append(b,value);d.append(p);}
  const help=document.createElement('p'),l=document.createElement('label'),a=document.createElement('textarea');help.className='zh';help.lang='zh-Hans';help.textContent=zh;
  a.id='extend'+i;a.maxLength=1000;a.placeholder='I changed ___. I saw ___. It worked better because ___.';l.htmlFor=a.id;l.textContent='Record one comparison (a few words is fine)';d.append(help,l,a);$('#extensions').append(d);notes(a.id);if(state.notes[a.id])d.open=true;
 });
}
function active(){return state.frames[state.index];}
function message(s){$('#drawStatus').textContent=s;}
function thumbs(){
 const list=$('#frames');list.replaceChildren();
 state.frames.forEach((f,i)=>{const b=document.createElement('button'),label=document.createElement('span');b.setAttribute('aria-pressed',String(i===state.index));label.textContent=(i+1)+'. '+f.name;b.append(art(f.design,4),label);b.onclick=()=>{state.index=i;drawEditor();};list.append(b);});
 $('#left').disabled=state.index===0;$('#right').disabled=state.index===state.frames.length-1;
 $('#dup').disabled=state.frames.length>=5;$('#remove').disabled=state.frames.length<=1;
}
function drawEditor(){
 halt();$('#play').textContent='▶ Play preview';
 editor?.destroy();
 const node=document.createElement('div');$('#editor').replaceChildren(node);
 editor=new PixelEditor(node,active().design,d=>{active().design=d;thumbs();if(!clock)showPreview(state.index);save();},{id:'sheet-frame'});
 $('#frameName').value=active().name;thumbs();showPreview(state.index);save();
}
function showPreview(i){
 const node=$('#preview');if(!node)return;
 const f=state.frames[i],label=document.createElement('p');label.textContent='Preview · '+f.name;
 node.replaceChildren(art(f.design,8),label);
}
function starting(d){if(state.frames.length>1||active().design.layers.some(l=>l.pixels.some(Boolean))){if(!confirm('Replace the current frames? Download a backup first if you want to keep them.'))return;}state.frames=[make('Calm',d)];state.index=0;drawEditor();message('Character ready. Duplicate to create another expression.');}
function bindDraw(){
 $('#delay').value=state.delay;
 $('#delay').onchange=e=>{state.delay=normDelay(e.target.value);e.target.value=state.delay;if(clock){halt();$('#play').textContent='▶ Play preview';showPreview(state.index);}save();};
 $('#frameName').oninput=e=>{active().name=e.target.value.trim()||'Frame '+(state.index+1);thumbs();save();};
 $('#frameName').onblur=e=>{e.target.value=active().name;};
 $('#sample').onclick=()=>starting(example());
 $('#dup').onclick=()=>{if(state.frames.length>=5)return;const f=make('Frame '+(state.frames.length+1),clean(active().design));state.frames.splice(++state.index,0,f);drawEditor();message('Copied all layers. Change only the expression, then rename this frame.');};
 for(const [id,delta] of [['left',-1],['right',1]])$('#'+id).onclick=()=>{const n=state.index+delta;if(n<0||n>=state.frames.length)return;[state.frames[n],state.frames[state.index]]=[state.frames[state.index],state.frames[n]];state.index=n;drawEditor();};
 $('#remove').onclick=()=>{if(state.frames.length>1&&confirm('Remove this frame? Other frames stay unchanged.')){state.frames.splice(state.index,1);state.index=Math.min(state.index,state.frames.length-1);drawEditor();}};
 $('#play').onclick=()=>{if(clock){halt();showPreview(state.index);$('#play').textContent='▶ Play preview';return;}if(state.frames.length<2)return message('Duplicate a frame first so the preview has two pictures.');iPreview=0;const stamp=frameStamp();let recorded=false;showPreview(0);$('#play').textContent='■ Stop preview';clock=setInterval(()=>{iPreview=(iPreview+1)%state.frames.length;showPreview(iPreview);if(!iPreview&&!recorded&&stamp===frameStamp()&&distinctFrames()>=3){recorded=true;state.notes.previewStamp=stamp;message('One full cycle previewed with three or more different frames.');save();}},state.delay*1000);};
 $('#json').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{if(f.size>3e6)throw Error('Choose a studio backup under 3 MB.');const j=JSON.parse(await f.text());if(j.format==='pixel-character-studio'&&j.version===1){starting(clean(j.state?.design));return;}if(j.format!=='sprite-sheet-studio'||j.version!==1)throw Error('This is not a supported studio backup.');const frames=validFrames(j.frames);if(!confirm('Replace the current frames with this backup?'))return;state.frames=frames;state.delay=normDelay(j.delay);state.index=0;$('#delay').value=state.delay;drawEditor();message('Animation frames restored.');}catch(err){message(err.message);}};
 $('#png').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;let url;try{if(f.size>3e6)throw Error('Choose a PNG under 3 MB.');url=URL.createObjectURL(f);const im=new Image();im.src=url;await im.decode();if(im.width!==16||im.height!==16)throw Error('Choose yesterday’s native 16 × 16 PNG, not the large preview.');const c=document.createElement('canvas');c.width=c.height=16;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const px=ctx.getImageData(0,0,16,16).data,d=E.create();d.layers[0].pixels=Array.from({length:256},(_,i)=>px[i*4+3]<128?null:'#'+[0,1,2].map(a=>px[i*4+a].toString(16).padStart(2,'0')).join(''));d.selected='face';starting(d);}catch(err){message(err.message);}finally{if(url)URL.revokeObjectURL(url);}};
 drawEditor();
}
function sheet(){
 const c=document.createElement('canvas');c.width=16*state.frames.length;c.height=16;
 const ctx=c.getContext('2d');state.frames.forEach((f,i)=>ctx.drawImage(art(f.design),i*16,0));return c;
}
function download(url,name){const a=document.createElement('a');a.href=url;a.download=name;a.click();}
function file(text,name,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));download(url,name);setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportSheet(){download(sheet().toDataURL(),'sprite_sheet.png');}
function exportBackup(){file(JSON.stringify({format:'sprite-sheet-studio',version:1,frames:state.frames,delay:state.delay},null,2),'sprite_animation.json','application/json');}
function py(){return `# Keep this file next to sprite_sheet.png.
# Try changing DELAY_MS and ORDER, then run again.
from pathlib import Path
import tkinter as tk

DELAY_MS = ${Math.round(state.delay*1000)}
ORDER = ${JSON.stringify(state.frames.map((_,i)=>i))}
SIZE = 16

window = tk.Tk()
window.title("Sprite Sheet Studio")
sheet_path = Path(__file__).with_name("sprite_sheet.png")
sheet = tk.PhotoImage(file=str(sheet_path))
count = sheet.width() // SIZE
if sheet.height() != SIZE or sheet.width() % SIZE:
    raise ValueError("Use the native sprite_sheet.png from the studio.")
if not ORDER or any(index not in range(count) for index in ORDER):
    raise ValueError("ORDER must contain valid frame indexes, starting at 0.")

frames = []
for index in range(count):
    picture = tk.PhotoImage(width=SIZE, height=SIZE)
    x = index * SIZE
    picture.tk.call(str(picture), "copy", str(sheet),
                    "-from", x, 0, x + SIZE, SIZE)
    frames.append(picture.zoom(12, 12))

label = tk.Label(window, bg="#eee3ff", image=frames[ORDER[0]])
label.pack(padx=24, pady=24)
frame = 0

def tick():
    global frame
    label.config(image=frames[ORDER[frame]])
    frame = (frame + 1) % len(ORDER)
    window.after(DELAY_MS, tick)

tick()
window.mainloop()
`;}
function evidence(){
 const answer=(items,prefix,i)=>items[i][3][state.notes[prefix+i]]??'Not answered';
 const results=(items,prefix)=>items.map(([title],i)=>title+': '+answer(items,prefix,i)).join('\n');
 file(['SPRITE SHEET STUDIO · YEAR 8','Name: '+state.name+' | Class: '+state.group,'Frames: '+state.frames.map(f=>f.name).join(' → '),'Preview delay: '+state.delay+' seconds',
 'Do Now: '+(({yes:'A layer within one frame',no:'The entire sprite sheet'})[state.notes.check]||'Not answered'),
 'Types of Learning\n'+results(learning,'start'),'Frame model discussion: '+answer([discussion[0]],'discuss',0),'Loop model prediction: '+answer([discussion[1]],'predict',0),'Test: '+(state.notes.testNote||'Not recorded'),
 'Archive checks: '+(state.notes.archive0===1?'MCQ correct':'MCQ not complete')+'; one word: '+(state.notes.frameWord||'Not answered'),'Practice board: '+(state.notes.practiceDone?'Completed':'Not completed'),'Studio preview: '+(state.notes.previewStamp===frameStamp()?'Complete cycle recorded':'Not recorded'),
 state.route==='scratch'?'Scratch evidence: '+(state.notes.scratchFile||'No file checked')+'\nObservation: '+(state.notes.scratchObservation||'Not recorded'):state.route==='pythonRoute'?'Python runs (frame index, seconds): '+JSON.stringify(pythonTrials().map(t=>t.timeline))+'\nObservation: '+(state.notes.pythonObservation||'Not recorded'):'Animation route not selected.',
 state.notes.assisted?'Supported attempt (student report, not a verified test): '+state.notes.assisted.value:'',
 'Pit Stop · Evidence\n'+results(pit,'pit'),'Learning phase (self-report): '+(state.notes.phase||'Not recorded'),'Reflection: '+(state.notes.reflectNote||'Not recorded'),
 'Go Further\n'+extensions.map(([title],i)=>title+': '+(state.notes['extend'+i]||'Not recorded')).join('\n'),
 'Exit answer: '+(state.notes.exitNote||'Not recorded'),'Review: '+state.score+' / 30 correct'].join('\n\n'),'sprite_evidence.txt');
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function quiz(){
 const box=$('#quiz');box.replaceChildren();
 const score=document.createElement('p');score.className='score';score.textContent=state.score+' / 30 correct';box.append(score);
 if(state.score>=30){box.append('Goal reached. Return to Plenary & submit to download your updated evidence note.');return;}
 if(!state.quizQueue.length){state.quizQueue=shuffle(spriteQuestions.map((_,i)=>i));save();}
 const [prompt,...v]=spriteQuestions[state.quizQueue[0]],q=document.createElement('h2'),fb=document.createElement('p'),next=document.createElement('button');
 q.textContent=prompt;fb.setAttribute('role','status');next.textContent='Next question →';next.hidden=true;
 box.append(q);
 const options=v.slice(0,4).map((s,i)=>{const b=document.createElement('button');b.textContent=s;b.onclick=()=>{if(quizAnswer)return;quizAnswer=true;const ok=i===v[4];if(ok)state.score++;state.quizQueue.shift();state.quizSeen++;save();score.textContent=state.score+' / 30 correct';options.forEach(x=>x.disabled=true);fb.textContent=(ok?'Correct. ':'Not quite. ')+v[5];next.hidden=false;next.focus();};box.append(b);return b;});
 next.onclick=()=>{quizAnswer=false;quiz();};box.append(fb,next);
}
setupWorkshop();
if(previewMode&&['scratch','pythonRoute'].includes(state.stage))state.route=state.stage;
if(!previewMode&&state.name&&firstBlock(state.stage)){
 const order=journey(),index=order.indexOf(state.stage);
 state.stage=order.slice(0,index<0?order.length:index).find(id=>checkpoint(id))||'code';
}
render();save();
