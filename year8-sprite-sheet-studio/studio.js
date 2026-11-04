'use strict';
const $=s=>document.querySelector(s), E=window.PixelEngine, S=window.PixelSprites;
const stages=['Mission','Do Now','Main Task 1','Main Task 2','Pit Stop & Go Further','Plenary & submit','Review'];
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
function fresh(){return {name:'',group:'8T',zh:false,stage:0,frames:[make('Calm',E.create())],index:0,delay:.4,score:0,quizQueue:[],quizSeen:0,notes:{}};}
const normDelay=v=>Number.isFinite(+v)&&+v>=.1&&+v<=2?+v:.4;
function clean(d){const v=E.validate(E.clone(d));v.versions=[];return v;}
function validFrames(list){
 if(!Array.isArray(list)||list.length<1||list.length>5)throw Error('A project must contain 1–5 frames.');
 return list.map(f=>{if(typeof f.name!=='string'||!f.name.trim()||f.name.length>30)throw Error('Invalid frame name.');return make(f.name,clean(f.design));});
}
let state=fresh(), editor=null, clock=null, quizAnswer=false, iPreview=0;
if(!previewMode)try{const v=JSON.parse(localStorage.getItem(key));if(v?.name){state={...fresh(),...v,frames:validFrames(v.frames)};state.stage=Math.max(0,Math.min(6,state.stage|0));state.index=Math.max(0,Math.min(state.frames.length-1,state.index|0));state.delay=normDelay(state.delay);}}catch{}
if(previewMode){state.name='Teacher example';state.frames=['Calm','Surprised','Happy'].map((n,i)=>make(n,example(i)));state.stage=2;}
function save(){if(previewMode){$('#saveStatus').textContent='Teacher preview · not saved';return;}try{localStorage.setItem(key,JSON.stringify(state));$('#saveStatus').textContent='Saved on this device';}catch{$('#saveStatus').textContent='Not saved · download a backup';}}
function flag(){document.body.classList.toggle('bilingual',state.zh);$('#zh').checked=state.zh;}
$('#zh').onchange=e=>{state.zh=e.target.checked;flag();save();};
function halt(){clearInterval(clock);clock=null;}
function go(n){if(!state.name&&n>0)return;halt();state.stage=n;render();save();window.scrollTo(0,0);$('h1')?.setAttribute('tabindex','-1');$('h1')?.focus({preventScroll:true});}
function art(d,k=1){return S.canvas(E.composite(d),k);}
function examples(where,first=false){
 const strip=document.createElement('div');strip.className='sample-strip';
 ['Calm','Surprised','Happy'].forEach((name,i)=>{const f=document.createElement('figure'),label=document.createElement('figcaption');label.textContent=(first?'':'Frame '+(i+1)+' · ')+name;f.append(art(example(i),6),label);strip.append(f);});where.append(strip);
}
function render(){
 editor?.destroy();editor=null;quizAnswer=false;
 const nav=$('#steps');nav.replaceChildren();stages.forEach((title,i)=>{const b=document.createElement('button');b.textContent=(i+1)+' · '+title;b.disabled=!state.name&&i>0;if(i===state.stage)b.setAttribute('aria-current','step');b.onclick=()=>go(i);nav.append(b);});
 const t=['intro','learn','draw','code','reflect','finish','review'][state.stage];
 $('#main').replaceChildren($('#'+t).content.cloneNode(true));
 flag();
 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(+b.dataset.go));
 if(t==='intro'){examples($('#opening'),true);const f=$('#entry');f.elements.pupil.value=state.name;f.elements.group.value=state.group;f.onsubmit=e=>{e.preventDefault();const name=f.elements.pupil.value.trim(),group=f.elements.group.value.trim();if(!name||!group)return;state.name=name;state.group=group;go(1);};}
 if(t==='learn'){examples($('#explainer'));document.querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>{state.notes.check=b.dataset.check;$('#feedback').textContent=b.dataset.check==='yes'?'Yes: the Face layer is one part of one frame.':'Look at the Face layer, not the whole sheet.';save();});}
 if(t==='draw') bindDraw();
 if(t==='code'){sheetTools();notes('testNote');}
 if(t==='reflect'){notes('phase');notes('reflectNote');}
 if(t==='finish'){notes('exitNote');$('#finalSheet').onclick=exportSheet;$('#finalBackup').onclick=exportBackup;$('#evidence').onclick=evidence;}
 if(t==='review') quiz();
}
function notes(id){const input=$('#'+id);input.value=state.notes[id]||'';input.oninput=()=>{state.notes[id]=input.value;save();};}
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
 $('#play').onclick=()=>{if(clock){halt();showPreview(state.index);$('#play').textContent='▶ Play preview';return;}if(state.frames.length<2)return message('Duplicate a frame first so the preview has two pictures.');iPreview=0;showPreview(0);$('#play').textContent='■ Stop preview';clock=setInterval(()=>{iPreview=(iPreview+1)%state.frames.length;showPreview(iPreview);},state.delay*1000);};
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
function sheetTools(){
 $('#sheet').onclick=exportSheet;$('#backup').onclick=exportBackup;$('#python').onclick=()=>file(py(),'animate.py','text/x-python');
 const c=sheet();c.style.width=(c.width*6)+'px';
 const p=document.createElement('p');p.textContent=state.frames.length+' frames · native sheet '+c.width+' × 16 pixels';$('#sheetPreview').append(c,p);
 state.frames.forEach((f,i)=>{const b=document.createElement('button');b.textContent='↓ '+(i+1)+'. '+f.name;b.onclick=()=>download(art(f.design,8).toDataURL(),String(i+1).padStart(2,'0')+'-'+(f.name.replace(/[^a-z0-9_-]/gi,'-')||'frame')+'.png');$('#costumes').append(b);});
}
function evidence(){file(['SPRITE SHEET STUDIO · YEAR 8','Name: '+state.name+' | Class: '+state.group,'Frames: '+state.frames.map(f=>f.name).join(' → '),'Preview delay: '+state.delay+' seconds','Test: '+(state.notes.testNote||'Not recorded'),'Pit stop: '+(state.notes.phase||'Not recorded'),'Reflection: '+(state.notes.reflectNote||'Not recorded'),'Exit answer: '+(state.notes.exitNote||'Not recorded'),'Review: '+state.score+' / 30 correct'].join('\n\n'),'sprite_evidence.txt');}
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
render();save();
