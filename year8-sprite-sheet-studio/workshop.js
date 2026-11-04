/* Route templates and practical checks, shared by pupil and teacher preview. */
const workshopOrder=['intro','before','learn','types','history','model1','practice','draw','model2','code'];
const routeTail=['reflect','extend','plenary','finish','review'];
const desktopGuide='assets/Sprite_Sheet_Studio_Python_Tkinter_Guide.pdf';
let pythonWorker=null,pythonTimer=null,animationTimer=null,animationRequest=0;

function setupWorkshop(){
 const add=(id,html)=>{const t=document.createElement('template');t.id=id;t.innerHTML=html;document.body.append(t);};
 const history=`<article class="card"><span class="kicker">ARCADE ARCHIVE · READ AND CHECK</span><h1>How did a few squares become a character?</h1>
 <p>A screen image is a grid of coloured <b>pixels</b>. In 1973, <b>Richard Shoup</b> and colleagues at Xerox PARC made <b>SuperPaint</b>, an early system for painting and storing digital pictures. Alvy Ray Smith worked on it, too. A <b>frame buffer</b> holds the pixel values for a picture in memory so they can be displayed or changed.</p>
 <p>In 1980, Namco's <b>Pac-Man</b> team, including designer Toru Iwatani and programmer Shigeo Funaki, made a character easy to spot with a strong outline and a changing mouth. Try our original arcade-style practice character below. Only its expression changes.</p>
 <div class="archive-people">
 <figure><img src="assets/toru-iwatani-gdc.jpg" alt="Toru Iwatani speaking at the 2011 Game Developers Conference" width="511" height="640"><figcaption><h2>Toru Iwatani</h2><p>Game planning and design</p><small><a href="https://commons.wikimedia.org/wiki/File:Toru_Iwatani,_creator_of_Pac-Man,_at_GDC_2011_(cropped_to_upper_body).jpg">Official GDC / V. Diamante, 2011</a> · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a> · cropped and resized.</small></figcaption></figure>
 <figure><div class="arcade-diagram"><svg viewBox="0 0 280 180" role="img" aria-label="Illustration: one game character heads for the player, while another heads for a square ahead of the player.">
 <defs><pattern id="arcadeGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#423361" stroke-width="1"/></pattern><marker id="arcadeArrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="#fff"/></marker></defs>
 <rect width="280" height="180" fill="#211637"/><rect x="10" y="10" width="260" height="160" fill="url(#arcadeGrid)"/>
 <path d="M60 57h81v44" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#arcadeArrow)"/><path d="M67 139h139v-15" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#arcadeArrow)"/>
 <rect x="36" y="45" width="24" height="24" rx="4" fill="#ff9baf"/><rect x="43" y="127" width="24" height="24" rx="4" fill="#7cdbd2"/>
 <rect x="131" y="103" width="20" height="20" rx="3" fill="#ffd166"/><rect x="196" y="103" width="20" height="20" rx="3" fill="none" stroke="#ffd166" stroke-width="2"/>
 <text x="126" y="90" fill="#fff" font-size="12" font-family="system-ui,sans-serif">Player</text><text x="186" y="90" fill="#fff" font-size="12" font-family="system-ui,sans-serif">Ahead</text></svg></div>
 <figcaption><h2>Shigeo Funaki</h2><p>Programmed the game. Iwatani credits him with creating the ghosts’ different movement rules.</p><small>Illustration of his work, not a portrait or game screenshot. <a href="https://openers.jp/en/design/design_features/4CoXi">Iwatani interview</a>.</small></figcaption></figure>
 </div>
 <div id="historyFrames"></div><p class="zh" lang="zh-Hans">像素是图像中的小色块。SuperPaint 是早期电脑绘画系统。一个画格（frame）是在一个时刻显示的一张完整图像。</p>
 <p class="sources"><a href="https://computerhistory.org/events/recollections-early-paint-systems/" target="_blank" rel="noopener">Computer History Museum</a> · <a href="https://www.pacman.com/en/history/" target="_blank" rel="noopener">Official Pac-Man history</a></p>
 <div id="historyChoice"></div><form id="frameWord"><label>One-word check: What do we call one complete picture in an animation?<input name="word" maxlength="25" autocomplete="off"></label> <button type="submit">Check word</button><p role="status" id="wordFeedback"></p></form>
 <button class="primary next" data-go="model1">See the frame model →</button></article>`;
 add('history',history);
 add('practice',`<article class="card"><span class="kicker">MAIN TASK 1A · GUIDED SAMPLE</span><h1>Make a practice animation with Garden Guide</h1>
 <p><b>1.</b> Use <b>Duplicate frame</b> in the Animation boards strip. It copies the entire drawing. <b>2.</b> Select <b>Face</b>, the layer that sits above the body. <b>3.</b> Click or tap two of the marked mouth squares to change them, then play. Your own frames are untouched.</p>
 <p class="zh" lang="zh-Hans">复制画格 → 选择 Face（脸）图层 → 点击两个嘴部像素 → 播放。这里的练习不会修改你的作品。</p>
 <div class="practice-grid"><div><div class="sample-strip" id="practiceFrames"></div><div class="actions"><button id="practiceDuplicate">1 · Duplicate frame</button><button id="practiceFace">2 · Select Face layer</button><button id="practicePlay">4 · Play practice</button><button id="practiceReset">Reset practice</button></div></div>
 <div><div class="practice-canvas" id="practiceCanvas"></div><div class="actions" id="practicePixels" aria-label="Mouth pixels"></div></div></div><p id="practiceStatus" role="status"></p>
 <button class="primary next" data-go="draw">Main Task 1B: draw my own sprite →</button></article>`);
 const model=document.querySelector('#model1').content.querySelector('[data-go]');
 model.dataset.go='practice';model.textContent='Main Task 1A: animate the practice sprite →';
 const types=document.querySelector('#types').content.querySelector('[data-go]');
 types.dataset.go='history';types.textContent='Open the arcade archive →';
 const lm=document.querySelector('#model2').content.querySelector('[data-go]');
 lm.textContent='Choose how to animate →';
 lm.insertAdjacentHTML('beforebegin',`<p id="speedStatus" role="status"></p><div class="concept"><b>Why it looks like movement:</b> the screen shows one complete still image at a time. A loop returns to the first frame after the last. Shorter waits make the same sequence play faster. Keeping the same body position makes the change look like an expression, not a jump.<br><b>File check:</b> the sheet stores the frames side by side; individual PNGs are costumes; the JSON is your editable backup.</div>`);
 const pythonModel=document.querySelector('#model2').content.querySelector('.routes section:nth-child(2)');
 pythonModel.innerHTML='<h2>Browser Python model</h2><pre><code>order = [0, 1, 2]\ndelay = 0.4\nfor index in order:\n    show(index, delay)</code></pre><p>Each number is a frame index. The delay is measured in seconds. The preview repeats the cycle you wrote.</p>';
 document.querySelector('#draw').content.querySelector('.next').insertAdjacentHTML('beforebegin',`<p class="concept"><b>Checkpoint:</b> make at least three visibly different frames, then click <b>Play preview</b> and watch one full cycle. Use <b>Move earlier/later</b> to fix the order and keep your body aligned.</p>`);
 document.querySelector('#code').innerHTML=`<article class="card"><span class="kicker">MAIN TASK 2 · CHOOSE ONE ROUTE</span><h1>How will you animate your character?</h1><p>Both routes use your three expressions. In either route, run one version, then change the timing or order and test again.</p>
 <div id="sheetPreview"></div><div class="actions"><button id="sheet">Download sprite sheet PNG</button><button id="backup">Download editable backup</button></div>
 <div class="routes"><section><h2>Scratch</h2><p>Upload your individual PNGs as costumes on one sprite. Follow annotated steps and build five blocks.</p><button class="primary" data-go="scratch">Choose Scratch →</button></section><section><h2>Python in this browser</h2><p>Use your Studio frames directly. Edit the Python, run it and compare the animation. No installation needed.</p><button class="primary" data-go="pythonRoute">Choose browser Python →</button></section></div>
 <p class="zh" lang="zh-Hans">任选一条路线：Scratch 上传各个造型；浏览器 Python 直接使用你的画格，无需安装。</p>
 <details><summary>Optional: run desktop Python with Tkinter</summary><p>For a computer you are allowed to install software on. Keep the sheet and script in the same folder. The desktop version is not required for class.</p><div class="actions"><a class="button" href="${desktopGuide}" target="_blank" rel="noopener">Open the illustrated Python / Tkinter guide (PDF)</a><button id="python">Download desktop animate.py</button></div></details></article>`;
 const figure=(name,alt)=>`<figure class="scratch-figure"><a href="assets/${name}-annotated.jpg" target="_blank" rel="noopener"><img src="assets/${name}-annotated.jpg" alt="${alt}" loading="lazy"></a><figcaption>Real Scratch editor · tap to enlarge</figcaption></figure>`;
 add('scratch',`<article class="card"><span class="kicker">MAIN TASK 2 · SCRATCH</span><h1>Give one sprite three costumes</h1><p class="zh" lang="zh-Hans">一个角色，三个造型。先下载各张 PNG，再在 Costumes（造型）中上传。运行两次，记录改动和结果。</p>
 <ol class="scratch-steps">
 <li><h2>Save the individual frame PNGs</h2><p>Make a folder called <b>SpriteSheetStudio</b>. Download each frame below and move the numbered files from Downloads into that folder. Do not upload the combined sheet as a costume.</p><div class="actions" id="costumes"></div><p><a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noopener" class="button primary">Open Scratch editor ↗</a> <a href="assets/Garden_Guide_Scratch_Demo.sb3" download>Download the working demo (.sb3)</a></p></li>
 <li><h2>Upload costumes, not sprites</h2><p>Select the cat sprite. Click <b>Costumes</b>. Open the purple costume menu at the bottom left and choose the <b>up-arrow Upload Costume</b>. Select your numbered PNGs. If your device imports them in a different order, drag their thumbnails into order.</p>${figure('01-costumes','Costumes tab and Upload Costume highlighted; the selected sprite remains on the right.')}</li>
 <li><h2>Check the costume list</h2><p>After importing, delete both old cat costumes from the list using the trash icon on each cat thumbnail. Do <b>not</b> delete the sprite. You should see your own three or more frames in order, under one sprite.</p>${figure('02-three-frames','Three Garden Guide costume thumbnails in order on the left; one sprite selected on the right.')}</li>
 <li><h2>Build, run and change one thing</h2><p>Open <b>Code</b>. From <b>Events</b>, drag the green-flag block. From <b>Looks</b>, add <b>switch costume to</b> and choose your first frame. From <b>Control</b>, add <b>forever</b>. Put <b>wait 0.4 seconds</b> (Control) and <b>next costume</b> (Looks) inside it. Click the flag and watch two loops. Change the wait to 0.8 seconds and run again.</p>${figure('03-running','The working Scratch stack has wait and next costume nested inside forever; green flag highlighted.')}</li>
 <li><h2>Save and show your evidence</h2><p>Choose <b>File → Save to your computer</b>. Put the <b>.sb3</b> in your project folder. Choose it below so this lesson can check the file type and contents on this device. It is not sent to Teams automatically.</p>${figure('04-save','Scratch File menu open, with Save to your computer highlighted.')}
 <label>Choose your saved Scratch project <input id="scratchProject" type="file" accept=".sb3"></label><p id="scratchStatus" role="status"></p><label>After I changed the wait from 0.4 to 0.8 seconds, what did I see?<textarea id="scratchObservation" maxlength="500" placeholder="The frames played ___; their order ___."></textarea></label></li></ol>
 <div class="route-help"></div><button class="primary next" data-go="reflect">Learning Pit Stop →</button></article>`);
 add('pythonRoute',`<article class="card"><span class="kicker">MAIN TASK 2 · PYTHON IN THIS BROWSER</span><h1>Program the order and the pause</h1><p>Your frames are loaded below in their board order. Python starts counting at <b>0</b>. <code>show(index, delay)</code> tells this page which frame to display and for how long. Write <b>one cycle</b>; the preview repeats it for you.</p>
 <p class="zh" lang="zh-Hans">画格从 0 开始编号。先运行一次，再改等待时间并重试。预览会重复播放，不需要安装 Python 或 Tkinter。</p>
 <div class="concept"><b>1.</b> Run the starter and watch two cycles. <b>2.</b> Change <code>delay = 0.4</code> to <code>delay = 0.8</code> (or change the order). <b>3.</b> Run again and compare. Keep all your frames in the sequence.</div>
 <div id="pythonFrames" class="sample-strip"></div><div class="routes"><section><label for="browserCode"><b>Your Python code</b></label><textarea id="browserCode" class="code-editor" rows="10" maxlength="4000" spellcheck="false" autocapitalize="off"></textarea>
 <div class="actions"><button id="runPython" class="primary">Run Python</button><button id="stopPython">Stop</button><button id="restorePython">Restore starter</button><button id="savePython">Download browser .py</button></div></section>
 <section><h2>Animation preview</h2><div id="browserPreview"></div><p id="pythonStatus" role="status"></p><pre id="pythonOutput" hidden></pre></section></div>
 <label>What changed after your second run?<textarea id="pythonObservation" maxlength="500" placeholder="I changed ___ from ___ to ___. I saw ___."></textarea></label>
 <p class="sources">The browser .py uses this lesson's <code>show()</code> helper. For a standalone desktop program use the separate Tkinter route.</p>
 <div class="route-help"></div><button class="primary next" data-go="reflect">Learning Pit Stop →</button></article>`);
 document.querySelector('#finish').content.querySelector('#evidence').insertAdjacentHTML('afterend',' <button id="finalBrowserPy" hidden>Download my browser Python</button>');
}

function journey(){return [...workshopOrder,...(state.route?[state.route]:[]),...routeTail];}
function pictureKey(d){return E.composite(d).map(p=>p?p.colour+':'+p.alpha:'-').join(',');}
function frameStamp(){
 const s=JSON.stringify(state.frames.map(f=>[f.name,pictureKey(f.design)]));let hash=2166136261;
 for(let i=0;i<s.length;i++)hash=Math.imul(hash^s.charCodeAt(i),16777619);
 return (hash>>>0).toString(36);
}
function distinctFrames(){return new Set(state.frames.map(f=>pictureKey(f.design)).filter(s=>s.includes('#'))).size;}
function meaningful(value){return (String(value||'').match(/[\p{L}\p{N}]/gu)||[]).length>=2;}
function currentRouteEvidence(){
 if(state.notes.assisted?.route===state.route&&state.notes.assisted.stamp===frameStamp())return true;
 if(state.route==='scratch')return state.notes.scratchStamp===frameStamp()&&meaningful(state.notes.scratchObservation);
 if(state.route==='pythonRoute')return pythonTrials().length>=2&&meaningful(state.notes.pythonObservation);
 return false;
}
function checkpoint(id){
 const n=state.notes;
 if(id==='learn'&&doNowScore()!==doNow.length)return 'Finish all four Do Now checks. Use the feedback to correct any missed answers.';
 if(id==='types'&&!currentStrategy())return 'Choose a starting strategy based on your Do Now evidence.';
 if(id==='history'&&(n.archive0!==1||!n.frameWordOK))return 'Check the archive multiple-choice answer and the one-word answer.';
 if(id==='model1'&&n.discuss0!==0)return 'Answer the alignment question using the frame model.';
 if(id==='practice'&&!n.practiceDone)return 'Duplicate the practice board, change two mouth pixels on Face, and play it.';
 if(id==='draw'&&(distinctFrames()<3||n.previewStamp!==frameStamp()))return 'Make at least three different frames, then play the preview through one full cycle.';
 if(id==='model2'&&(n.predict0!==1||!n.modelSlow||!n.modelFast))return 'Make a prediction and try both preview speeds.';
 if(id==='code'&&!state.route)return 'Choose a route: Scratch or browser Python.';
 if(id===state.route&&!currentRouteEvidence())return id==='scratch'?'Choose a saved Scratch project that passes the file check, then record what changed.':'Run two different timelines that show every frame, then record what changed.';
 if(id==='reflect'&&(!pitComparisonSaved()||!n.phase||!meaningful(n.reflectNote)))return 'Compare your evidence, then choose a learning phase and write a short reason.';
 if(id==='plenary'&&!n.exitNote?.trim())return 'Write a short exit answer.';
 return '';
}
function firstBlock(id){
 if(previewMode||id==='intro'||!state.name)return '';
 const order=journey(), i=order.indexOf(id);
 for(const step of order.slice(0,i<0?workshopOrder.length:i)){
  const why=checkpoint(step);if(why)return why;
 }
 return '';
}
function progress(){
 const nav=$('#steps');
 for(const b of nav.querySelectorAll('[data-stage]')){
  const id=b.dataset.stage,why=firstBlock(id),done=Boolean(state.name)&&!why&&!checkpoint(id)&&['learn','types','history','model1','practice','draw','model2','scratch','pythonRoute','reflect','plenary'].includes(id);
  b.setAttribute('aria-disabled',String(Boolean(why)||(!state.name&&id!=='intro')));
  const assisted=done&&id===state.route&&state.notes.assisted?.route===id&&state.notes.assisted.stamp===frameStamp();
  b.title=why||(assisted?'Supported attempt, not a verified animation test':'');b.querySelector('span').textContent=assisted?' · supported':done?' ✓':'';
 }
 const card=$('#main article'), box=card?.querySelector('.progress-hint');
 if(box){const route=state.stage,why=checkpoint(route);box.textContent=why;box.hidden=!why;}
}
function bindArchive(){
 examples($('#historyFrames'));
 checks($('#historyChoice'),[['Read and choose','Why did early paint systems use a frame buffer?','帧缓冲区有什么作用？',['To play music','To hold a picture’s pixel values','To replace the mouse'],1,'A frame buffer stores pixel values. Find that phrase in the first paragraph.']],'archive');
 const f=$('#frameWord'); f.elements.word.value=state.notes.frameWord||'';
 const show=()=>{$('#wordFeedback').textContent=state.notes.frameWordOK?'Correct. One complete picture is a frame.':state.notes.frameWord?'Try again. Look for the word that comes before “buffer” in the first paragraph.':'';};
 f.onsubmit=e=>{e.preventDefault();state.notes.frameWord=f.elements.word.value.trim();state.notes.frameWordOK=/^(?:frame|a frame|画格|帧|一帧)[.!。]?$/.test(state.notes.frameWord.toLowerCase());show();save();};show();
}
function bindPractice(){
 let duplicate=null,face=false,pixels=new Set(), playing=false;
 const base=example(),mouth=[[6,11],[7,11],[8,11],[9,11]];
 const status=s=>$('#practiceStatus').textContent=s;
 function picture(d){$('#practiceCanvas').replaceChildren(art(d,9));}
 function draw(){const row=$('#practiceFrames');row.replaceChildren();for(const [name,d] of [['1 · Calm',base],...(duplicate?[['2 · Practice copy',duplicate]]:[])]){const f=document.createElement('figure'),p=document.createElement('figcaption');p.textContent=name;f.append(art(d,4),p);row.append(f);}picture(duplicate||base);
  $('#practiceFace').disabled=!duplicate;$('#practicePlay').disabled=pixels.size<2;
  $('#practicePixels').querySelectorAll('button').forEach((b,i)=>{b.disabled=!face;b.setAttribute('aria-pressed',String(pixels.has(i)));});
 }
 mouth.forEach(([x,y],i)=>{const b=document.createElement('button');b.textContent='Pixel '+(i+1);b.onclick=()=>{if(playing){halt();playing=false;$('#practicePlay').textContent='4 · Play practice';}pixels.add(i);duplicate.layers[1].pixels[y*16+x]='#d64472';draw();status(pixels.size+' of at least 2 mouth pixels changed.');};$('#practicePixels').append(b);});
 $('#practiceDuplicate').onclick=()=>{if(duplicate)return status('The practice copy is ready. Select Face.');duplicate=clean(base);draw();status('Two boards. Select the Face layer on the copy.');};
 $('#practiceFace').onclick=()=>{face=true;draw();status('Face selected. Click two different mouth pixel buttons.');};
 $('#practicePlay').onclick=()=>{halt();if(playing){playing=false;picture(duplicate);$('#practicePlay').textContent='4 · Play practice';return;}playing=true;let i=0;picture(base);clock=setInterval(()=>picture(++i%2?duplicate:base),400);state.notes.practiceDone=true;save();$('#practicePlay').textContent='Stop practice';status('Practice complete. The mouth changes; the body stays put.');};
 $('#practiceReset').onclick=()=>{halt();duplicate=null;face=false;pixels.clear();playing=false;$('#practicePlay').textContent='4 · Play practice';draw();status('Practice reset. Your own design is unchanged.');};
 draw();if(state.notes.practiceDone)status('Practice completed earlier. You can repeat it or continue.');
}
function bindRouteChoice(){
 $('#sheet').onclick=exportSheet;$('#backup').onclick=exportBackup;$('#python').onclick=()=>file(py(),'animate.py','text/x-python');
 const c=sheet(),p=document.createElement('p');c.style.width=(c.width*6)+'px';p.textContent=state.frames.length+' frames · '+c.width+' × 16 pixels';$('#sheetPreview').append(c,p);
}
function buildCostumes(){
 state.frames.forEach((f,i)=>{const b=document.createElement('button');b.textContent='↓ '+(i+1)+'. '+f.name;b.onclick=()=>download(art(f.design,8).toDataURL(),String(i+1).padStart(2,'0')+'-'+(f.name.replace(/[^a-z0-9_-]/gi,'-')||'frame')+'.png');$('#costumes').append(b);});
}
function scratchTarget(project,zip,count){
 return project.targets?.find(t=>{
  if(t.isStage||!t.costumes||t.costumes.length!==count||!t.costumes.every(c=>c.dataFormat==='png'&&zip.file(c.md5ext||c.assetId+'.png')))return false;
  const blocks=t.blocks||{},op=id=>blocks[id]?.opcode, chain=(id)=>{const seen=new Set(),out=[];while(id&&blocks[id]&&!seen.has(id)){seen.add(id);out.push(blocks[id]);id=blocks[id].next;}return out;};
  return Object.values(blocks).some(b=>{if(b.opcode!=='event_whenflagclicked')return false;const run=chain(b.next),loop=run.find(x=>x.opcode==='control_forever');if(!loop||!run.slice(0,run.indexOf(loop)).some(x=>x.opcode==='looks_switchcostumeto'))return false;
   const inside=chain(loop.inputs?.SUBSTACK?.[1]).map(x=>x.opcode);return inside.includes('control_wait')&&inside.includes('looks_nextcostume');});
 });
}
function bindScratch(){
 buildCostumes();notes('scratchObservation');bindRouteHelp();
 const p=$('#scratchStatus'), input=$('#scratchProject');
 if(state.notes.scratchStamp===frameStamp())p.textContent='File check passed earlier: '+state.notes.scratchFile+'.';
 input.onchange=async()=>{const f=input.files[0];if(!f)return;const stamp=frameStamp();delete state.notes.scratchStamp;save();p.textContent='Checking the file on this device…';
  try{
   if(!/\.sb3$/i.test(f.name)||f.size>12e6)throw Error('Choose a Scratch .sb3 under 12 MB.');
   if(!window.JSZip)throw Error('The file checker could not load. Reopen the lesson over HTTPS and try again.');
   const zip=await JSZip.loadAsync(await f.arrayBuffer()), entry=zip.file('project.json');
   if(!entry)throw Error('This is not a Scratch project saved from the File menu.');
   const data=await entry.async('string');
   const target=data.length<=1e6&&scratchTarget(JSON.parse(data),zip,state.frames.length);
   if(!target)throw Error('Keep your numbered PNGs on one sprite. Check the green flag, starting costume and the wait and next costume inside forever.');
   await checkCostumePictures(target,zip);
   if(stamp!==frameStamp()||state.stage!=='scratch')return;
   state.notes.scratchStamp=stamp;state.notes.scratchFile=f.name;p.textContent='File check passed. This checks the saved block stack, not what you observed. Record what changed below.';save();
  }catch(e){p.textContent=e.message||'Could not read that Scratch project.';}
 };
}
async function checkCostumePictures(target,zip){
 const small=document.createElement('canvas');small.width=small.height=16;
 const ctx=small.getContext('2d',{willReadFrequently:true});ctx.imageSmoothingEnabled=false;
 for(const [i,costume] of target.costumes.entries()){
  const png=zip.file(costume.md5ext||costume.assetId+'.png');
  const bytes=await png.async('uint8array');
  if(bytes.length>250000||bytes.length<24)throw Error('Use the individual frame PNGs exported by this lesson.');
  const header=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const width=header.getUint32(16),height=header.getUint32(20);
  // Scratch can store the same 128 px import as a 256 px bitmap at 2× resolution.
  if(header.getUint32(0)!==0x89504e47||![128,256].includes(width)||width!==height)throw Error('Use the individual frame PNGs from this route.');
  const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));
  ctx.clearRect(0,0,16,16);ctx.drawImage(bitmap,0,0,16,16);bitmap.close();
  const actual=ctx.getImageData(0,0,16,16).data, expected=art(state.frames[i].design).getContext('2d').getImageData(0,0,16,16).data;
  if(actual.some((v,j)=>Math.abs(v-expected[j])>4))throw Error('Costume '+(i+1)+' does not match your frame in the studio. Check that you imported your own PNGs in the board order.');
 }
}
function bindRouteHelp(){
 const el=$('.route-help');
 el.innerHTML='<details><summary>Device problem? Show this step to your teacher</summary><p>Only use this after showing your teacher the problem and agreeing what to do next. This records a supported attempt, not a passed animation test.</p><form><label>What stopped the test, and what did your teacher ask you to do next?<input name="help" required minlength="12" maxlength="240"></label> <button>Record supported attempt</button></form><p role="status"></p></details>';
 el.querySelector('form').onsubmit=e=>{e.preventDefault();const value=e.currentTarget.elements.help.value.trim();if(value.length<12)return;state.notes.assisted={route:state.route,stamp:frameStamp(),value};el.querySelector('[role=status]').textContent='Supported attempt recorded. The test remains marked as unverified in your evidence.';save();};
 if(state.notes.assisted?.route===state.route&&state.notes.assisted.stamp===frameStamp())el.querySelector('[role=status]').textContent='A supported attempt has already been recorded.';
}
function pythonTrials(){const p=state.notes.pythonTrials;return p?.stamp===frameStamp()?p.trials:[];}
function pythonStarter(){return 'order = ['+state.frames.map((_,i)=>i).join(', ')+']\ndelay = 0.4  # seconds per frame\n\nfor index in order:\n    show(index, delay)\n';}
function stopPython(){clearTimeout(pythonTimer);clearTimeout(animationTimer);animationRequest++;pythonWorker?.terminate();pythonWorker=null;}
function bindPython(){
 bindRouteHelp();
 const code=$('#browserCode'), view=$('#browserPreview'), status=$('#pythonStatus'), output=$('#pythonOutput'), run=$('#runPython');
 function show(i){const f=state.frames[i],p=document.createElement('p');p.textContent='Index '+i+' · '+f.name;view.replaceChildren(art(f.design,8),p);}
 for(const [i,f] of state.frames.entries()){const card=document.createElement('figure'),label=document.createElement('figcaption');label.textContent=i+' · '+f.name;card.append(art(f.design,4),label);$('#pythonFrames').append(card);}
 const trials=()=>{const n=pythonTrials().length;status.textContent=n>=2?'Two different full sequences tested. Record what changed below.':n+' / 2 different full sequences tested. Try changing the delay or order.';};
 code.value=state.notes.browserCode??pythonStarter();
 code.oninput=()=>{state.notes.browserCode=code.value;save();};notes('pythonObservation');show(0);trials();
 $('#restorePython').onclick=()=>{stopPython();run.disabled=false;code.value=pythonStarter();code.oninput();show(0);trials();};
 $('#savePython').onclick=()=>file(code.value,'sprite_animation_browser.py','text/x-python');
 $('#stopPython').onclick=()=>{stopPython();run.disabled=false;status.textContent='Stopped. '+pythonTrials().length+' / 2 different full sequences tested.';};
 run.onclick=()=>{
  if(location.protocol==='file:'){status.textContent='Open the lesson from the GitHub Pages link to run browser Python.';return;}
  stopPython();const request=animationRequest;run.disabled=true;output.hidden=true;status.textContent='Loading Python…';
  function fail(message){stopPython();run.disabled=false;status.textContent=message;}
  try{pythonWorker=new Worker('animation-worker.mjs?v=build3',{type:'module'});}catch{fail('Python could not start. Try again or choose Scratch.');return;}
  pythonTimer=setTimeout(()=>fail('Python did not finish loading. Try again or choose Scratch.'),50000);
  pythonWorker.onerror=()=>fail('Python could not load. Try again or choose Scratch.');
  const stamp=frameStamp(),source=code.value;
  pythonWorker.onmessage=({data})=>{
   if(request!==animationRequest)return;
   if(data.type==='ready'){clearTimeout(pythonTimer);pythonTimer=setTimeout(()=>fail('This run took too long. Write one cycle, not a forever loop.'),4500);status.textContent='Running Python…';return;}
   clearTimeout(pythonTimer);pythonWorker.terminate();pythonWorker=null;run.disabled=false;
   if(data.type==='error'){status.textContent=data.message;return;}
   const {timeline,output:printed}=data.result;
   output.textContent=printed;output.hidden=!printed;
   if(!timeline.length){status.textContent='Nothing to play yet. Call show(index, delay) inside the loop.';return;}
   if(new Set(timeline.map(([i])=>i)).size===state.frames.length){
    const trialsBefore=pythonTrials(), key=JSON.stringify(timeline);
    if(!trialsBefore.some(t=>JSON.stringify(t.timeline)===key)){state.notes.pythonTrials={stamp,trials:[...trialsBefore.slice(-4),{timeline,source}]};save();}
    trials();
   }else status.textContent='Preview running. Include every frame at least once for the test.';
   let i=0;function play(){if(request!==animationRequest)return;const [frame,wait]=timeline[i];show(frame);i=(i+1)%timeline.length;animationTimer=setTimeout(play,wait*1000);}play();
  };
  pythonWorker.postMessage({code:source,count:state.frames.length});
 };
}
