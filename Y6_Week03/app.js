(function () {
'use strict';
const L=window.CQ, $=s=>document.querySelector(s);
const KEY='coordinateQuestProfilesV3', OLD='coordinateQuestProfilesV2';
let storageIssue='', profiles=read(KEY,{}), p=null, preview=false, person=0, language=read('coordinateQuestLanguageV3','en'), waitingExtension=false;
let workedTrace=0, noticeTimer;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const B=(en,zh)=>esc(en)+(language==='zh'&&zh?'<span class="zh" lang="zh-Hans">'+esc(zh)+'</span>':'');
const btn=(action,en,zh,cls='',attrs='')=>'<button type="button" class="'+cls+'" data-action="'+action+'" '+attrs+'>'+B(en,zh)+'</button>';
const para=(en,zh,cls='')=>'<p class="'+cls+'">'+B(en,zh)+'</p>';
const hint=(en,zh)=>'<details class="hint"><summary>'+B('Need a clue?','需要提示？')+'</summary>'+para(en,zh)+'</details>';
function read(key,fallback){try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback;}catch(e){if(key===KEY)storageIssue='Saved data could not be read. New work is kept in memory; download a backup before closing.';return fallback;}}
function save(){if(!p||preview)return;p.updated=Date.now();profiles[p.id]=p;if(!storageIssue)try{localStorage.setItem(KEY,JSON.stringify(profiles));}catch(e){storageIssue='This browser could not save your work. Keep this page open and download a backup.';}saveLabel();}
function saveLabel(){$('#saveStatus').textContent=storageIssue|| (preview?'Teacher preview — changes here are not student work.':p?'Saved on this device · '+new Date(p.updated).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'Your work stays on this device.');$('#saveStatus').classList.toggle('warning',!!storageIssue);}
function notify(en,zh){$('#notice').innerHTML=B(en,zh);$('#notice').className='visible';clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#notice').className='',4500);}
function textField(path,label,zh,value='',multiline=false){return '<label for="'+esc(path)+'">'+B(label,zh)+'</label>'+(multiline?'<textarea rows="3" maxlength="500"':'<input maxlength="120"')+' id="'+esc(path)+'" data-field="'+esc(path)+'" '+(multiline?'>'+esc(value)+'</textarea>':'value="'+esc(value)+'">');}
function options(path,label,zh,items,value){return '<label for="'+path+'">'+B(label,zh)+'</label><select id="'+path+'" data-field="'+path+'"><option value="">'+(language==='zh'?'Choose / 请选择':'Choose one')+'</option>'+items.map(([v,en,cn])=>'<option value="'+v+'" '+(value===v?'selected':'')+'>'+esc(en)+(language==='zh'?' / '+esc(cn):'')+'</option>').join('')+'</select>';}
function radio(name,question,zh,items,value){return '<fieldset><legend>'+B(question,zh)+'</legend>'+items.map(([v,en,cn])=>'<label class="check"><input type="radio" name="'+name+'" data-field="answers.'+name+'" value="'+v+'" '+(value===v?'checked':'')+'><span>'+B(en,cn)+'</span></label>').join('')+'</fieldset>';}
function feedback(en,zh,kind=''){return '<div role="status" class="feedback '+kind+'">'+B(en,zh)+'</div>';}
function grid(x,y,dir=90,path=[]){
 const px=280+x,py=220-y;let lines='';
 for(let v=-240;v<=240;v+=40)lines+='<line x1="'+(280+v)+'" y1="40" x2="'+(280+v)+'" y2="400" stroke="#e3e4e6"/>';
 for(let v=-180;v<=180;v+=40)lines+='<line x1="40" y1="'+(220-v)+'" x2="520" y2="'+(220-v)+'" stroke="#e3e4e6"/>';
 const pts=path.map(([a,b])=>(280+a)+','+(220-b)).join(' ');
 return '<div class="diagram-wrap"><svg class="grid" viewBox="0 0 560 440" role="img" aria-label="'+esc('Coordinate grid. Current position ('+x+', '+y+'). Direction '+dir+' degrees.')+'"><rect x="40" y="40" width="480" height="360" fill="white" stroke="#888"/>'+lines+
 '<path d="M40 220H520M280 40V400" stroke="#111" stroke-width="2"/><g font-size="14" font-family="Arial" fill="#333"><text x="40" y="425">−240</text><text x="502" y="425">240</text><text x="290" y="34">180</text><text x="285" y="418">−180</text><text x="288" y="237">(0, 0)</text><text x="533" y="224">x</text><text x="264" y="27">y</text></g>'+
 (pts?'<polyline points="'+pts+'" fill="none" stroke="#236ad0" stroke-width="3"/>':'')+
 '<path d="M280 '+py+'H'+px+'V220" fill="none" stroke="#236ad0" stroke-dasharray="5 5"/><circle cx="'+px+'" cy="'+py+'" r="10" fill="#236ad0" stroke="white" stroke-width="2"/><line x1="'+px+'" y1="'+py+'" x2="'+(px+20*Math.sin(dir*Math.PI/180))+'" y2="'+(py-20*Math.cos(dir*Math.PI/180))+'" stroke="#111" stroke-width="3"/></svg></div>';
}
function map(){return '<details class="hint"><summary>'+B('See the route map','查看路线图')+'</summary><img class="route-map" src="assets/images/route-map.svg" alt="Scratch maze: START, A, B, C, D, key and portal."></details>';}
// These are cropped screenshots from Scratch 3 Desktop, not recreated blocks.
const codeImages={event:[319,191],worked:[288,253],predict1:[319,253],predict2:[350,316],predict3:[300,378],'run-example':[555,232],'build-b':[453,110],plenary:[288,253]};
function code(lines,active=-1){
 const id=L.steps[p.at].id,[width,height]=codeImages[id],src='assets/images/scratch-blocks/'+id+'.png';
 return '<figure class="scratch-code"><button type="button" class="code-image-button" data-code-image="'+id+'" aria-label="'+esc(language==='zh'?'Enlarge Scratch blocks / 放大 Scratch 积木':'Enlarge Scratch blocks')+'"><img class="scratch-block-image" src="'+src+'" width="'+width+'" height="'+height+'" style="--code-width:'+Math.round(width*(id==='run-example'?1.4:1))+'px" alt="'+esc('Scratch blocks, top to bottom: '+lines.join('; '))+ '"><span class="code-image-caption">'+B('Scratch blocks · select to enlarge','Scratch 积木 · 点击放大')+'</span></button></figure>'+
 (active>=0?'<p class="trace-block" role="status">'+B('Current block '+(active+1)+' of '+lines.length,'当前积木：第 '+(active+1)+' / '+lines.length+' 块')+'<strong>'+esc(lines[active])+'</strong></p>':'')+
 '<details class="code-transcript"><summary>'+B('Read the blocks as text','阅读积木文字')+'</summary><ol>'+lines.map((line,i)=>'<li '+(i===active?'aria-current="step"':'')+'>'+esc(line)+'</li>').join('')+'</ol></details>';
}

function fileGuide(){
 const cards=[
 ['PDF','Learning report','学习报告','Upload to Teams','上传到 Teams','Your answers and reflections. Read this file; it cannot restore the lesson.','答案和反思。可阅读，但不能恢复课程进度。'],
 ['SB3','Scratch project','Scratch 项目','Upload to Teams + open in Scratch','上传到 Teams；在 Scratch 打开','Your working code and maze. In Scratch: File → Load from your computer.','包含代码和迷宫。在 Scratch 中选择 File → Load from your computer。'],
 ['JSON','Lesson backup','课程备份','Load on this welcome page','在欢迎页载入','Your saved answers and progress. Keep it for home; it does not contain your Scratch project.','保存的答案和进度。留作在家继续学习；不包含 Scratch 项目。']
 ];
 return '<section class="file-guide" aria-label="File guide"><h2>'+B('Which file do I need?','我需要哪一种文件？')+'</h2><div class="file-cards">'+cards.map(([type,title,zh,action,az,desc,dz])=>'<article><svg viewBox="0 0 140 110" role="img" aria-label="'+type+' file" class="file-picture"><path d="M30 5h55l25 25v75H30z" fill="white" stroke="currentColor" stroke-width="3"/><path d="M85 5v25h25" fill="none" stroke="currentColor" stroke-width="3"/><rect x="17" y="48" width="106" height="39" rx="5" fill="currentColor"/><text x="70" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">.'+type.toLowerCase()+'</text></svg><h3>'+B(title,zh)+'</h3><strong>'+B(action,az)+'</strong>'+para(desc,dz)+'</article>').join('')+'</div>'+para('Going home? Download your JSON backup here AND save your .sb3 file in Scratch. At home, load the JSON here and the .sb3 in Scratch. Submit only the PDF and .sb3 to Teams unless your teacher asks for the backup.','回家继续？在这里下载 JSON 备份，并在 Scratch 保存 .sb3 文件。在家把 JSON 载入本网站，把 .sb3 载入 Scratch。提交到 Teams 的是 PDF 和 .sb3，除非老师另行要求备份。')+'</section>';
}
async function restoreBackup(input){
 const error=$('#restoreError'),file=input.files[0];if(!file)return;
 try{
  if(!file.name.toLowerCase().endsWith('.json'))throw Error('Choose the .json backup, not a PDF or Scratch file. / 请选择 .json 备份。');
  if(file.size>20*1024*1024)throw Error('This backup is too large (maximum 20 MB). / 备份不能超过 20 MB。');
  const data=JSON.parse(await file.text()),restored=L.restore(data);
  if(profiles[restored.id]&&!confirm('There is already work for '+restored.name+' on this device. Replace it with this backup? Cancel keeps the current work. / 此设备已有记录。是否替换？取消可保留原记录。')){input.value='';return;}
  p=restored;preview=false;person=0;waitingExtension=false;
  if(data.language==='en'||data.language==='zh')language=data.language;
  if(data.previous)p.previousBackup=data.previous;
  save();render();notify('Backup loaded. Open your saved .sb3 separately in Scratch.','备份已载入。请另外在 Scratch 打开 .sb3 文件。');
 }catch(e){error.textContent='Could not load this backup. '+(e instanceof SyntaxError?'The JSON file is damaged or incomplete.':e.message);input.value='';}
}


function soloChoice(){
 $('#teacherDialog').innerHTML='<h2 id="dialogTitle">'+B('Who is continuing at home?','谁要在家继续学习？')+'</h2>'+para('Choose your name. We will keep the pair’s work and make your own copy. You will only answer for yourself.','选择你的姓名。我们会保留合作记录，为你建立个人副本。你只需填写自己的答案。')+studentNames().map((n,i)=>btn('solo-'+i,n,'','primary')).join(' ')+btn('close-dialog','Stay together','继续合作','quiet');
 $('#teacherDialog').showModal();
}
function makeSolo(i){
 if(!p.partner)return;
 save();const name=studentNames()[i],id=L.key(name,p.className,'');
 if(profiles[id]){
  if(!confirm('You already have your own saved lesson. Open it? Your pair work will stay safe. / 已有个人记录，是否打开？合作记录不会改变。'))return;
  p=profiles[id];
 }else{
  const copy=JSON.parse(JSON.stringify(p));copy.name=name;copy.partner='';copy.id=id;
  copy.learners=[copy.learners[i],{}];copy.fromPair=studentNames().join(' + ');
  p=copy;
 }
 person=0;preview=false;waitingExtension=false;$('#teacherDialog').close();save();render();
 notify('This is now your own copy. Your partner’s saved work has not changed.','现在是你的个人副本。同伴的记录没有改变。');
}
function reviewSkipped(){
 const ids=Object.keys(p.skipped||{}).filter(k=>p.skipped[k]);
 return ids.length?'<section class="support-panel"><h2>'+B('Come back to a skipped step','回到跳过的步骤')+'</h2>'+para('These are saved as skipped, not wrong or correct. Select a step if you want another try.','这些步骤记录为跳过，不是答错或答对。想再试时，选择一个步骤。')+ids.map(k=>btn('revisit-'+L.steps.findIndex(s=>s.id===k),L.steps.find(s=>s.id===k).title,L.steps.find(s=>s.id===k).zh,'small')).join(' ')+'</section>':'';
}
function supportPanel(id){
 const skipped=Object.keys(p.skipped||{}).filter(k=>p.skipped[k]);
 return '<section class="support-panel">'+para('A short answer is enough. Try the check for a helpful explanation, or skip and come back. Skipping does not mark work correct.','简短回答就可以。检查按钮会提供解释，也可以先跳过再回来。跳过不会标记为答对。')+btn('skip','Skip for now — I will come back','先跳过——稍后再回来','quiet')+(skipped.length?'<details><summary>'+B('My skipped steps ('+skipped.length+')','跳过的步骤（'+skipped.length+'）')+'</summary>'+skipped.map(k=>btn('revisit-'+L.steps.findIndex(s=>s.id===k),L.steps.find(s=>s.id===k).title,L.steps.find(s=>s.id===k).zh,'small')).join(' ')+'</details>':'')+'</section>';
}
const purposes={
 mission:['Today you will help the explorer reach the key. First learn here, then build in Scratch.','今天帮助探险者找到钥匙。先在这里学习，再去 Scratch 编程。'],
 x:['Read x to find the right starting place for your explorer.','读懂 x，找到探险者的起始位置。'],
 xy:['A coordinate is an address on the stage. Use x first, then y, to tell Scratch where to go.','坐标就像舞台上的地址。先写 x，再写 y，告诉 Scratch 去哪里。'],
 event:['Before your route can run, it needs a start signal. Look for the first block.','路线需要一个开始信号。观察第一个积木。'],
 focus:['Choose one thing you want to practise. This helps you decide what to focus on in Scratch.','选择想练习的一项，帮助你明确 Scratch 任务的重点。'],
 worked:['Watch one example before you try. Notice which number changes and which stays the same.','先看示例再尝试。注意哪个数改变，哪个数不变。'],
 predict1:['Before running the code, make a guess about where it ends. Then test your guess.','运行前猜一猜终点在哪里，再测试你的想法。'],
 predict2:['Follow one block at a time. Keep track of x and y separately.','一次看一个积木，分别记录 x 和 y。'],
 predict3:['Will turning change the place or just the direction? Read the blocks and try your idea.','转向会改变位置还是只改变方向？阅读积木，试试你的想法。'],
 launch:['Now leave this page open and work in Scratch. If it will not open, you may skip and return later.','保留本页，现在去 Scratch 操作。如果无法打开，可以先跳过，稍后再试。'],
 'run-example':['Run the starter code in Scratch. Tell us what you actually see, even if it does not work yet.','在 Scratch 运行示例。如实记录看到的结果，即使还没成功。'],
 'build-b':['Make one small part of the route, then test it. This makes mistakes easier to find.','先完成一小段路线再测试，这样更容易找到错误。'],
 'build-route':['Add one stop at a time so the explorer follows the corridor to the key.','一次添加一个停靠点，让探险者沿通道到达钥匙。'],
 test:['Testing helps you spot what to fix. A few words such as “hit wall” or “reached key” are enough.','测试帮助你找到需要修改的地方。写“碰墙”或“到钥匙”等几个字即可。'],
 checkpoint:['Run the route and say what one block does. At home you can explain it aloud to yourself.','运行路线，说说一个积木的作用。在家可以对自己讲解。'],
 pitstop:['Think about one thing you tried. Was it new, getting easier, too easy, or did you need help?','回想尝试过的一件事：是新知识、越来越容易、太简单，还是需要帮助？'],
 extension:['Choose a new route challenge only if you want more practice. You can go straight to Plenary.','想多练习时再选路线挑战，也可以直接进入小结。'],
 plenary:['Try this last example to see what you understand now. It is okay to ask for help or skip.','用最后一个例子看看自己学会了什么。可以求助，也可以先跳过。']
};
function toolbar(){
 $('#toolbar').innerHTML=btn('language',language==='zh'?'English only':'English + 中文','', 'small quiet')+(p?btn('backup','Save backup (.json)','保存备份（.json）','small quiet')+btn('exit','Save & leave','保存并退出','small quiet'):'');
 saveLabel();
}
function landing(){
 p=null;preview=false;waitingExtension=false;toolbar();
 $('#content').innerHTML='<div class="landing"><section><span class="pill web">'+B('ONE STEP AT A TIME','一步一步来')+'</span><h1>'+B('Plan a route.\nMake it move.','规划路线，让角色移动。')+'</h1>'+para('Learn here. Build in Scratch. Show your working program.','在这里学习，在 Scratch 编程，展示运行的程序。','lead')+'<ol><li>'+B('Read and predict short code.','阅读并预测简短代码。')+'</li><li>'+B('Open Scratch and test your own route.','打开 Scratch，测试自己的路线。')+'</li><li>'+B('Check your work, then reflect.','检查作品，然后回顾学习。')+'</li></ol>'+para('Answering the website questions is not the whole task. You will also make a Scratch project.','回答网站问题不是全部任务。你还需要制作一个 Scratch 项目。')+'</section><form id="entry" class="card"><h2>'+B('Let’s get ready','准备开始')+'</h2><label for="name">'+B('Your name','你的姓名')+'</label><input id="name" name="name" required maxlength="80" autocomplete="name"><label for="class">'+B('Your class','你的班级')+'</label><input id="class" name="class" maxlength="50"><label for="mode">'+B('How are you working?','你怎样完成任务？')+'</label><select id="mode" name="mode"><option value="solo">'+(language==='zh'?'On my own / 独立完成':'On my own')+'</option><option value="pair">'+(language==='zh'?'With a partner / 与同伴合作':'With a partner')+'</option></select><div id="partnerField" hidden><label for="partner">'+B('Partner’s name','同伴姓名')+'</label><input id="partner" name="partner" maxlength="80"></div><p class="muted">'+B('Returning? Use the same names and class to resume. Teacher preview: enter teacher as your name.','再次进入？使用相同姓名和班级继续。教师预览：姓名输入 teacher。')+'</p><button class="primary" type="submit">'+B('Start / resume my lesson →','开始／继续课程 →')+'</button><div id="entryError" role="alert"></div></form></div>';
 $('#entry').insertAdjacentHTML('beforebegin','<section class="card backup-entry"><h2>'+B('Continue with my backup','载入备份继续学习')+'</h2>'+para('On a different computer? Choose your CoordinateQuest_backup.json file. Your answers and place in the lesson will return.','换了电脑？选择 CoordinateQuest_backup.json 文件，恢复答案和学习进度。')+'<label for="restoreBackup">'+B('Load my backup (.json)','载入我的备份（.json）')+'</label><input id="restoreBackup" type="file" accept=".json,application/json"><p id="restoreError" role="alert"></p>'+para('Your Scratch project is separate. Open your saved .sb3 file inside Scratch.','Scratch 项目是单独的文件。请在 Scratch 中打开保存的 .sb3 文件。')+'</section>');
 $('#content').insertAdjacentHTML('beforeend',fileGuide());
}
function enter(name,cls,partner=''){
 const id=L.key(name,cls,partner);p=profiles[id]||L.fresh(name,cls,partner);
 if(!profiles[id]){
  const old=Object.values(read(OLD,{})).find(r=>L.key(r.name,r.className,'')===L.key(name,cls,''));
  if(old){p.legacyId=old.id;p.answers.legacyNote='Previous version found. Its answers remain saved; the new practical checkpoints start fresh.';}
 }
 p.at=Math.min(p.at,p.furthest);if(p.at>14&&!L.ready(p,'checkpoint')){p.at=14;p.furthest=Math.min(p.furthest,14);}
 person=0;preview=false;save();render();
}
function studentNames(){return p.partner?[p.name,p.partner]:[p.name];}
function personalTabs(){return (p.partner?para('Take turns. Each person chooses their own answer.','轮流回答，每个人选择自己的答案。'):'')+'<div class="person-tabs">'+studentNames().map((name,i)=>'<button type="button" data-person="'+i+'" aria-pressed="'+(i===person)+'">'+esc(name)+'</button>').join('')+'</div>';}
function render(){
 if(!p)return landing();toolbar();const s=L.steps[p.at];
 const stages=[...new Set(L.steps.map(x=>x.stage))],current=stages.indexOf(s.stage);
 let heading='<ol class="trail" aria-label="Lesson journey">'+stages.map((stage,i)=>'<li class="'+(i===current?'current':i<current?'past':'')+'" '+(i===current?'aria-current="step"':'')+'>'+esc(stage)+'</li>').join('')+'</ol>';
 if(preview)heading+='<div class="teacher-preview"><strong>Teacher preview · no pupil work is saved</strong><label for="previewStep">Review any card</label><select id="previewStep">'+L.steps.map((x,i)=>'<option value="'+i+'" '+(i===p.at?'selected':'')+'>'+esc(x.stage+' — '+x.title)+'</option>').join('')+'</select>'+btn('teacher-home','Teacher controls','教师控制','small')+'</div>';
 heading+='<div class="journey-meta"><span class="eyebrow">'+B('CARD '+(p.at+1)+' OF '+L.steps.length,'第 '+(p.at+1)+' / '+L.steps.length+' 张卡片')+'</span><span class="pill '+s.place+'">'+(s.place==='scratch'?B('WORK IN SCRATCH','在 SCRATCH 中操作'):B('WORK ON THIS WEBSITE','在本网站学习'))+'</span></div>';
 if(p.partner&&!preview)heading+='<div class="partner-support">'+para('Partner not with you? Continue in your own copy without waiting for their answers.','同伴不在身边？可以建立个人副本继续，不必等待同伴作答。')+btn('solo-choice','I am working on my own now','我现在独立学习','yellow')+'</div>';
 if(p.partner&&s.place==='scratch'){const builder=(p.at>=12?1:0);heading+='<p class="roles">'+B('Builder: ','操作员：')+esc(studentNames()[builder])+ ' · '+B('Checker: ','检查员：')+esc(studentNames()[1-builder])+'. '+B('The checker reads the next step. Both explain the result.','检查员读下一步，两人都要能解释结果。')+'</p>';}
 $('#content').innerHTML=heading+'<article class="card"><div class="card-title"><h1 id="stepTitle" tabindex="-1">'+B(s.title,s.zh)+'</h1></div>'+(purposes[s.id]?para(...purposes[s.id],'instruction'):'')+body(s.id)+'</article>'+
 (s.id!=='report'?'<div class="step-footer">'+btn('back','← Previous','← 上一步','quiet',p.at===0?'disabled':'')+btn('next',s.id==='checkpoint'?'Continue to reflection →':s.id==='extension'?'Go to Plenary →':'Continue →',s.id==='checkpoint'?'进入反思 →':s.id==='extension'?'进入课堂小结 →':'继续 →','primary',preview||L.ready(p,s.id)?'':'disabled')+'</div>':'')+
 (s.id!=='report'&&!preview?supportPanel(s.id):'')+
 (s.id!=='report'&&!preview?'<details class="teacher-tools"><summary>'+B('For your teacher: end-of-lesson control','教师：课程结束控制')+'</summary>'+para('If lesson time has ended, your teacher can open the reflection pages. Unfinished work stays marked unfinished.','课程时间结束时，老师可以打开反思页面，未完成的作品仍标记为未完成。')+btn('wrap','Teacher: move to reflection','教师：进入反思','small')+'</details>':'');
 if(waitingExtension)$('#content').insertAdjacentHTML('afterbegin','<div class="status-box">'+B('You are trying a challenge while waiting. Your core route still needs a teacher check.','你正在等待检查时尝试挑战。核心路线仍需要教师检查。')+btn('return-check','Return to teacher checkpoint','返回教师检查','small')+'</div>');
}
function body(id){
 const a=p.answers, me=p.learners[person]||{};
 if(id==='mission')return para('Our explorer needs to reach the key. Guide it through START → A → B → C → D → KEY.','探险者需要到达钥匙。请引导它经过起点、A、B、C、D，最后到达钥匙。','lead')+'<div class="instruction">'+para('First we will read coordinates here. Later, you must open Scratch and build the route.','先在这里学习坐标，之后必须打开 Scratch 编写路线。')+'</div>'+map()+'<ul class="checks"><li>'+B('Know: a position has an x value and a y value.','知识：位置由 x 和 y 两个数表示。')+'</li><li>'+B('Do: build, run and test a sequence.','技能：编写、运行并测试顺序。')+'</li><li>'+B('Explain: why changing a number or block order changes the route.','理解：解释为什么数字或积木顺序会改变路线。')+'</li></ul>'+btn('read','I know what I will make','我知道要制作什么','yellow');
 if(id==='x')return '<div class="two"><div>'+para('The centre is (0, 0). x tells us how far left or right of the centre a sprite is.','中心是 (0, 0)。x 表示角色在中心左边或右边多远。')+para('Negative x is left of centre. Positive x is right of centre. This tells us a position, not which way it is moving.','负 x 在中心左边，正 x 在右边。这表示位置，而不是移动方向。')+radio('x','The dot has x = −120. Where is it?','圆点的 x = −120。它在哪里？',[['left','Left of the centre','中心左边'],['right','Right of the centre','中心右边']],a.x)+btn('check-x','Check my idea','检查答案','yellow')+'</div><div>'+grid(-120,0)+'</div></div>'+savedFeedback(id);
 if(id==='xy')return '<div class="two"><div>'+para('y tells us how far above or below the centre a sprite is. Positive y is up; negative y is down. Write x first, then y: (x, y).','y 表示角色在中心上方或下方多远。正 y 在上方，负 y 在下方。先写 x，再写 y：(x, y)。')+para('Worked example: x = 100 and y = −50 is (100, −50). It is right of and below the centre.','示例：x = 100，y = −50，写作 (100, −50)，位于中心右下方。')+'<div class="instruction">'+B('Your turn: the dot is x = −120, y = −135. Build its pair.','轮到你：圆点 x = −120，y = −135。写出坐标对。')+'</div>'+pairInputs('pair',a.pairX,a.pairY)+btn('check-pair','Check my pair','检查坐标对','yellow')+'</div><div>'+grid(-120,-135)+'</div></div>'+savedFeedback(id);
 if(id==='event')return para('An event tells a script when to start. The green-flag event runs the blocks below it when you click the flag.','事件告诉脚本何时开始。点击绿旗后，绿旗事件会运行下面的积木。')+code(['when green flag clicked','go to x: −200 y: −135'])+radio('event','Which action starts this script?','什么操作启动这个脚本？',[['flag','Click the green flag','点击绿旗'],['space','Press the space key','按空格键']],a.event)+btn('check-event','Check','检查','yellow')+savedFeedback(id);
 if(id==='focus')return para('These are different kinds of learning, not different kinds of pupils. Choose one thing you want to improve today.','这些是不同的学习内容，不是不同的学生类型。选择今天想进步的一项。')+'<ul class="checks"><li>'+B('Knowledge: what I know and remember.','知识：我知道并记住的内容。')+'</li><li>'+B('Skills: what I can do with practice.','技能：我通过练习能做的事。')+'</li><li>'+B('Understanding: what I can explain with an example.','理解：我能举例解释的道理。')+'</li></ul>'+personalTabs()+options('learner.goal','My goal','我的目标',L.goals,me.goal)+options('learner.before','My starting point','我的起点',[['new','This is new to me','这是新知识'],['example','An example helps me','例子能帮助我'],['ready','I can try without an example','我能不看例子尝试']],me.before)+para('Your choice is not a mark. You will come back to it after coding.','这不是分数，编程后会再次回顾。','muted');
 if(id==='worked'){
 const x=-80+40*workedTrace;
 return para('“Go to” sets a position. “Change x by” adds to the x value already there. Start at (−80, 20), then add 40 to x.','“go to” 设置位置。“change x by” 在现有 x 上加一个数。从 (−80, 20) 开始，x 加 40。')+'<div class="two"><div>'+code(['when green flag clicked','go to x: −80 y: 20','change x by 40'],workedTrace?2:1)+para('−80 + 40 = −40. The sprite moves right, but is still left of the centre. y stays 20.','−80 + 40 = −40。角色向右移动，但仍在中心左侧。y 仍是 20。')+btn('worked','Run this example','运行示例','yellow')+'</div><div>'+grid(x,20,90,workedTrace?[[-80,20],[-40,20]]:[])+para('Position: ('+x+', 20)','位置：('+x+', 20)')+'</div></div>'+para('These are real Scratch blocks. The grid shows what they do. You will build your own script in Scratch in Main Task 2.','这是真正的 Scratch 积木截图，网格展示它们的作用。主任务二将在 Scratch 中编写自己的脚本。','muted');
 }
 if(id.startsWith('predict'))return prediction(Number(id.slice(-1))-1);
 if(id==='launch')return '<p class="lead">'+B('Stop answering for a moment. Your next job is in Scratch.','先停下答题。接下来的任务在 Scratch 中完成。')+'</p><div class="actions"><a class="button yellow" href="assets/scratch/Year6_T1W3_Guided_Template.sb3" download data-link="download">'+B('1. Download the project','1. 下载项目')+'</a><a class="button primary" href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noopener" data-link="scratch">'+B('2. Open Scratch ↗','2. 打开 Scratch ↗')+'</a></div><div class="instruction"><h2>'+B('3. Load the project','3. 加载项目')+'</h2>'+para('In Scratch, choose File → Load from your computer. Choose Year6_T1W3_Guided_Template.sb3 from Downloads.','在 Scratch 中选择 File → Load from your computer（从电脑上传），在下载文件夹中选择 Year6_T1W3_Guided_Template.sb3。')+para('Already using Scratch Desktop? Load the same file there. Keep this lesson open and come back after each check.','使用 Scratch 桌面版？在那里加载同一文件。保留本课页面，每次检查后返回。')+'</div>'+map()+para('Ready looks like: a maze on the stage, plus Explorer, Key and Portal sprites. A blank cat project is not ready.','准备完成的样子：舞台有迷宫，还有 Explorer、Key、Portal 三个角色。只有小猫的空项目还没准备好。')+btn('confirm-open','I can see the maze and explorer in Scratch','我在 Scratch 看到了迷宫和探险者','yellow')+hint('If the file did not open, click File inside Scratch—not your browser menu. Ask your teacher if downloading is blocked.','如果文件没打开，点击 Scratch 内部的 File，不是浏览器菜单。下载被阻止时请老师帮忙。')+savedFeedback(id);
 if(id==='run-example')return para('In Scratch, select Explorer. Click the green flag. Watch the supplied code reset the explorer, show a message, then glide from START to A.','在 Scratch 选择 Explorer，点击绿旗，观察示例代码重置角色、显示提示，然后从起点滑行到 A。')+code(['when green flag clicked','go to x: −200 y: −135','say "Example: START to A. Then complete the route!" for 2 seconds','glide 0.8 secs to x: −120 y: −135'])+radio('example','After running the example in Scratch, where did it stop?','在 Scratch 运行后，它停在哪里？',[['A','At A (−120, −135)','A 点 (−120, −135)'],['start','It stayed at START','仍在起点'],['other','Somewhere else / it did not run','其他位置／没运行']],a.example)+btn('check-example','Record what I saw','记录观察','yellow')+hint('Select Explorer, not Key or Portal. The glide must be connected below the green-flag script.','选择 Explorer，而不是 Key 或 Portal。滑行积木必须连接在绿旗脚本下面。')+savedFeedback(id);
 if(id==='build-b')return para('Your turn in Scratch: make the explorer move from A to B. A is (−120, −135). B is directly above it at (−120, −35).','在 Scratch 尝试从 A 移到 B。A 是 (−120, −135)，B 在它正上方，坐标为 (−120, −35)。')+radio('same','Which coordinate stays the same?','哪个坐标不变？',[['x','x stays −120','x 保持 −120'],['y','y stays −135','y 保持 −135']],a.same)+'<div class="instruction">'+para('Add one glide block below the example. Set its destination to B. Click the green flag to test the whole script again.','在示例下面添加一个滑行积木，目的地设为 B。点击绿旗重新测试整个脚本。')+'</div>'+code(['glide 0.8 secs to x: −120 y: −35'])+check('bRan','I ran it in Scratch and the explorer reached B.','我在 Scratch 运行了程序，角色到达 B。',a.bRan)+btn('check-b','Save this checkpoint','保存检查点','yellow')+hint('Check the minus sign. −35 is above −135. Use “glide to x: y:”, not “change y by −35”.','检查负号。−35 在 −135 上方。使用 glide to x: y:，而不是 change y by −35。')+savedFeedback(id);
 if(id==='build-route')return para('Now work in Scratch. Add the route from B → C → D → KEY. Read each destination on the map. Add one glide, then run and check before adding the next.','现在在 Scratch 中编写 B → C → D → KEY。读取地图坐标，每加一个滑行积木就运行检查。')+'<img class="route-map" src="assets/images/route-map.svg" alt="Route map with checkpoint coordinates">'+hint('C = (10, −35), D = (10, 95), KEY = (170, 95). Finish with a short say block.','C = (10, −35)，D = (10, 95)，KEY = (170, 95)。最后加一个简短的 say 积木。')+
 para('Watch the explorer as it moves. It must stay inside the paths. This project will not stop it crossing a wall for you. Reaching KEY means arriving there; this template does not hide or collect the key automatically.','墙壁是视觉边界，Scratch 不会自动阻止碰墙。检查角色经过的每一段。到达 KEY 表示抵达位置，模板不会自动隐藏或收集钥匙。','muted')+check('routeRan','I tested START → A → B → C → D → KEY in Scratch.','我在 Scratch 测试了完整路线。',a.routeRan)+btn('check-route','I am ready to record my test','我准备记录测试','yellow')+savedFeedback(id);
 if(id==='test')return para('Run from the green flag. Watch the route before filling this in. It is okay if it worked first time.','从绿旗开始运行，先观察路线再记录。第一次成功也没关系。')+options('answers.testResult','What happened?','发生了什么？',[['worked','It reached the key through every checkpoint','经过所有检查点到达钥匙'],['wall','It crossed a wall','穿过了墙'],['wrong','It stopped in the wrong place','停错了位置'],['none','It did not start','没运行']],a.testResult)+textField('answers.testNote','What did you check or change?','你检查或修改了什么？',a.testNote,true)+hint('If it worked: “I checked the route, not just the final position.” If it did not: “I changed B’s y value, then ran again.”','成功时：“我检查了整条路线，不只是终点。”没成功时：“我修改了 B 的 y，然后重新运行。”')+btn('log-test','Save this test','保存这次测试','yellow')+(p.practical.tests.length?'<ol>'+p.practical.tests.map(t=>'<li>'+esc(t.result)+' — '+esc(t.note)+'</li>').join('')+'</ol>':'')+'<div class="instruction">'+para('Save your Scratch work: File → Save to your computer. Use a name you will recognise, such as Amina_CoordinateQuest_v1.sb3.','保存 Scratch 作品：File → Save to your computer。使用易辨认的文件名，如 Amina_CoordinateQuest_v1.sb3。')+'</div>'+check('fileSaved','I saved my Scratch project on this computer.','我已把 Scratch 项目保存在电脑上。',a.fileSaved)+textField('answers.filename','My project filename','项目文件名',a.filename)+btn('ready-check','My route is ready to show','我的路线准备好展示了','primary')+savedFeedback(id);
 if(id==='checkpoint')return '<div class="status-box">'+B(L.status(p),p.practical.status==='teacher-checked'?'教师已检查运行路线。':p.practical.status==='self-checked'?'学生已确认测试并保存，尚未由教师检查。':p.practical.wrap?'实践尚未完成，教师已允许进入反思。':'等待教师检查。')+'</div>'+para('At school, show Mr David your route in Scratch. At home, run it and explain one block aloud.','在学校向 Mr David 展示 Scratch 路线。在家运行路线，并说出一个积木的作用。','lead')+'<ol><li>'+B('Click the green flag and show the whole route.','点击绿旗，展示完整路线。')+'</li><li>'+B('Point to one glide block and explain its x and y.','指出一个滑行积木并解释 x 和 y。')+'</li><li>'+B('Show that your project is saved. Each partner explains a part.','展示项目已经保存，每位同伴解释一部分。')+'</li></ol>'+para('While you wait, explain the route to your partner or try a challenge. Clicking a button here does not prove that Scratch work is finished.','等待时向同伴解释路线或尝试挑战。点击本页按钮不代表 Scratch 作品已经完成。')+'<div class="instruction">'+para('Working at home? Run the full route, explain one block aloud and save your Scratch file. Then confirm below. This is your own check, not a teacher check.','在家学习？运行完整路线，说出一个积木的作用，并保存 Scratch 文件。然后确认。这是自我检查，不是教师检查。')+btn('home-complete','I tested and saved my work — continue','我已测试并保存作品——继续','primary')+'</div><div class="actions">'+btn('approve','Teacher: check this project','教师：检查作品','yellow')+btn('waiting-extension','Try a challenge while I wait','等待时尝试挑战','quiet')+'</div>';
 if(id==='pitstop')return personalTabs()+para('Think about the goal you chose before coding. Use what happened in your Scratch work—not how quickly you clicked through the website.','回想编程前的目标，根据 Scratch 中的表现选择，不要根据点击网页的速度。')+
 para('My first goal: '+(L.goals.find(g=>g[0]===me.goal)?.[1]||'Not recorded'),'最初的目标：'+(L.goals.find(g=>g[0]===me.goal)?.[2]||'未记录'))+
 '<details class="hint"><summary>'+B('See our school learning phases','查看学校学习阶段图')+'</summary><img class="original-visual" src="assets/images/learning-pitstop.png" alt="School learning phases: new learning, consolidating, treading water and drowning."></details>'+
 options('learner.phase','How does this task feel now?','现在这个任务感觉怎样？',L.phases,me.phase)+textField('learner.evidence','What happened when you tried? For example: “needed help with y” or “route worked”.','尝试时发生了什么？例如：“需要帮助理解 y”或“路线成功”。',me.evidence,true)+(me.phase?feedback(...phaseHelp(me.phase)):'')+para('These choices are not marks. If you need help, tell your teacher; saving does not send an alert.','这些选择不是分数。需要帮助请告诉老师，保存不会发送通知。','muted');
 if(id==='extension'){const n=p.level,item=L.challenges[n],r=p.extensions[n];return para('Work in Scratch. If you finish early, aim for three challenges. Stop when your teacher calls the plenary. These are optional, not a barrier to reflection.','在 Scratch 操作。提前完成的同学争取做三个挑战，老师开始小结时停下。挑战是选做，不阻挡反思。')+'<div class="levels">'+L.challenges.map((c,i)=>'<button type="button" data-level="'+i+'" aria-label="Challenge '+(i+1)+'" aria-current="'+(i===n)+'">'+(i+1)+(p.extensions[i].done?' ✓':'')+'</button>').join('')+'</div><h2>'+B((n+1)+'. '+item[0],item[1])+'</h2>'+para(item[2],item[3])+'<div class="instruction"><code>'+esc(item[4])+'</code></div>'+map()+textField('extension.note','What did your test show?','测试结果是什么？',r.note,true)+check('extensionTested','I tried this in Scratch and checked the result.','我已在 Scratch 尝试并检查结果。',a.extensionTested)+btn('save-extension',n<4?'Save my attempt & open challenge '+(n+2):'Save my last challenge',n<4?'保存并进入下一关':'保存最后一关','yellow')+para('Challenge ticks are your own reports, not teacher verification. Save your Scratch version before making a new change.','挑战勾选是自我记录，不是教师验证。修改前保存 Scratch 版本。','muted');}
 if(id==='plenary')return personalTabs()+para('Answer on your own. Your partner can read the question, but let you choose.','独立回答。同伴可以读题，但由你自己选择。')+code(['when green flag clicked','go to x: −60 y: 40','change x by 100'])+pairInputs('exit',me.exitX,me.exitY)+radioLearner('exitWhy','Why does y stay 40?','为什么 y 仍是 40？',[['no-y','No block changes y','没有积木改变 y'],['positive','y is always positive','y 总是正数'],['flag','The flag keeps y still','绿旗让 y 不动']],me.exitWhy)+btn('check-exit','Check my explanation','检查解释','yellow')+btn('unsure-exit','I need help with this question','这道题我需要帮助','quiet')+(me.exitFeedback?feedback(me.exitFeedback,me.exitFeedbackZh,me.exitChecked?'good':'warn'):'')+textField('learner.next','One thing I will check next time…','下次我要检查的一件事……',me.next,true);
 if(id==='report')return reviewSkipped()+'<div class="status-box">'+esc(L.status(p))+'</div>'+para('This record contains your answers, test notes and teacher-check status. It does not contain an automatic recording of Scratch.','记录包含答案、测试笔记和教师检查状态，不包含自动录制的 Scratch。')+btn('pdf','Download my learning PDF','下载学习 PDF','primary')+'<div class="instruction">'+para('With Mandarin text, a print window opens: choose Save as PDF. Check your names and practical-work status before submitting.','包含中文时会打开打印窗口，请选择“保存为 PDF”。提交前检查姓名和实践状态。')+'</div>'+fileGuide()+'<h2>'+B('Send your work to Teams','把作品提交到 Teams')+'</h2><ol><li>'+B('Open the Computing assignment your teacher set.','打开老师布置的 Computing 作业。')+'</li><li>'+B('Attach the PDF and your saved Scratch .sb3 project.','附上 PDF 和保存的 Scratch .sb3 项目。')+'</li><li>'+B('Wait for both files to upload. Check them, then select Turn in.','等待两个文件上传，检查后选择 Turn in。')+'</li></ol>'+check('submitted','I attached my work and selected Turn in.','我已附上作品并点击 Turn in。',a.submitted)+para('This is your submission report. The website cannot check Teams for you.','这是你的提交记录，网站不能替你检查 Teams。','muted')+(p.legacyId?para('Work from the previous website is still stored separately. Save a backup to include it.','旧版网站的作品仍单独保存。下载备份可以包含它。'):'');
 return '';
}
function savedFeedback(id){return p.answers['feedback-'+id]?feedback(p.answers['feedback-'+id],p.answers['feedbackZh-'+id],p.done[id]?'good':'warn'):'';}
function check(key,en,zh,value){return '<label class="check"><input type="checkbox" data-field="answers.'+key+'" '+(value?'checked':'')+'><span>'+B(en,zh)+'</span></label>';}
function pairInputs(prefix,x='',y=''){return '<div class="coordinate-pair">'+textField(prefix+'.x','Final x','最终 x',x)+textField(prefix+'.y','Final y','最终 y',y)+'</div>';}
function radioLearner(key,en,zh,items,value){return radio(key,en,zh,items,value).replaceAll('data-field="answers.','data-field="learner.');}
function phaseHelp(phase){return {new:['Trace one move slowly, then try it yourself.','慢慢追踪一步，再自己尝试。'],practice:['Try a similar route with less help.','少用提示尝试类似路线。'],stretch:['Try an extension and explain why your route works.','尝试挑战并解释路线为什么有效。'],help:['Show your teacher the first step you cannot explain.','向老师指出第一个不理解的步骤。'],untried:['Tell your teacher what stopped you starting. Plan one first step together.','告诉老师什么阻止了开始，一起计划第一步。']}[phase];}
function prediction(n){
 const d=L.predictions[n],r=p.predictions[n],pos=L.position(n,r.trace),started=!!r.submitted;
 const lines=[d.event,'go to x: '+d.start[0]+' y: '+d.start[1],...d.ops.map(([k,v])=>k==='turn'?'turn clockwise '+v+' degrees':'change '+k+' by '+v)];
 const path=[d.start,...d.ops.slice(0,r.trace).map((_,i)=>{const q=L.position(n,i+1);return [q.x,q.y];})];
 return (n===2?para('A turn changes which way a sprite faces, not its x or y. “Change x” and “change y” use the stage axes, even after a turn.','转向改变朝向，不改变 x 或 y。即使转向后，change x 和 change y 仍沿舞台坐标轴移动。'):'')+
 '<div class="two"><div>'+code(lines,started?r.trace+1:-1)+(started?para('My prediction: ('+r.x+', '+r.y+')','我的预测：('+r.x+', '+r.y+')'):pairInputs('prediction',r.x,r.y))+(!started?btn('predict','Save prediction, then test','保存预测，再测试','yellow'):'')+para('A prediction is an idea to test, not a mark. Changing your mind is part of learning.','预测是需要测试的想法，不是分数。改变想法也是学习。','muted')+'</div><div>'+grid(pos.x,pos.y,pos.dir,path)+para('Position now: ('+pos.x+', '+pos.y+')','当前位置：('+pos.x+', '+pos.y+')')+(started?btn('trace',r.trace<d.ops.length?'Run next block':'Replay from the start',r.trace<d.ops.length?'运行下一块':'重新运行','yellow'):'')+'</div></div>'+
 (r.ran?'<div class="instruction">'+B('The code finishes at ('+d.answer.join(', ')+'). Compare this with your prediction.','代码结束位置为 ('+d.answer.join(', ')+')。和预测比较。')+'</div>'+radio('compare'+n,'What explains the result?','怎样解释这个结果？',n===0?[['correct','Only x changed. y stayed −100.','只有 x 变化，y 保持 −100。'],['wrong','Both coordinates changed.','两个坐标都变化。']]:n===1?[['correct','y increased by 130; x decreased by 100.','y 加 130，x 减 100。'],['wrong','The sprite finishes where it started.','角色回到起点。']]:[['correct','The turn changed direction, not position.','转向改变朝向，不改变位置。'],['wrong','Turning also changed x by 90.','转向也让 x 加 90。']],p.answers['compare'+n])+btn('compare','Check my explanation','检查解释','yellow'):'')+savedFeedback('predict'+(n+1));
}
function setFeedback(id,ok,en,zh){p.attempted=p.attempted||{};p.attempted[id]=new Date().toISOString();p.done[id]=ok;p.answers['feedback-'+id]=en;p.answers['feedbackZh-'+id]=zh;save();render();}
function refreshContinue(){const el=$('[data-action="next"]');if(el)el.disabled=!preview&&!L.ready(p,L.steps[p.at].id);}
function setField(path,value){
 const id=L.steps[p.at].id,parts=path.split('.');
 if(parts[0]==='learner'){p.learners[person][parts[1]]=value;if(['exitX','exitY','exitWhy'].includes(parts[1])){p.learners[person].exitChecked=false;p.learners[person].exitRecorded=false;}}
 else if(parts[0]==='prediction'){p.predictions[Number(id.slice(-1))-1][parts[1]]=value;}
 else if(parts[0]==='pair'){p.answers['pair'+parts[1].toUpperCase()]=value;p.done.xy=false;}
 else if(parts[0]==='exit'){p.learners[person]['exit'+parts[1].toUpperCase()]=value;p.learners[person].exitChecked=false;p.learners[person].exitRecorded=false;}
 else if(parts[0]==='extension')p.extensions[p.level][parts[1]]=value;
 else {p.answers[parts[1]]=value;if(['x','event','run-example','build-b','build-route'].includes(id))p.done[id]=false;if(id.startsWith('predict'))p.done[id]=false;}
 save();refreshContinue();
}
function go(index){if(!preview&&index>p.furthest)return;waitingExtension=false;p.at=Math.max(0,Math.min(index,L.steps.length-1));person=0;save();render();$('#stepTitle')?.focus({preventScroll:true});}
function validNumber(v){return String(v??'').trim()!==''&&Number.isFinite(Number(String(v).replaceAll('−','-')));}
function number(v){return Number(String(v).replaceAll('−','-').trim());}
function teacherDialog(kind){
 if(kind==='preview'){preview=true;p=L.fresh('Teacher preview','—');teacherHome();return;}
 $('#teacherDialog').innerHTML='<form id="teacherForm"><h2 id="dialogTitle">'+(kind==='approve'?'Teacher practical check':'Finish lesson time')+'</h2><p>No password is needed. A teacher check is a recorded observation, not automatic verification.</p><label for="teacherName">Teacher name</label><input id="teacherName" required maxlength="60" autocomplete="off">'+
 (kind==='approve'?'<label class="check"><input name="route" type="checkbox" required><span>I saw the full route run in Scratch without crossing a wall.</span></label><label class="check"><input name="explain" type="checkbox" required><span>Each pupil explained a coordinate or block.</span></label><label class="check"><input name="saved" type="checkbox" required><span>I saw that the Scratch project was saved.</span></label>':kind==='wrap'?'<p>This opens reflection and export without claiming the practical is finished.</p>':'')+
 '<div id="teacherError" role="alert"></div><div class="actions"><button type="submit" class="primary">'+(kind==='approve'?'Record my check':kind==='wrap'?'Move to reflection':'Open teacher preview')+'</button>'+btn('close-dialog','Cancel','','quiet')+'</div></form>';
 $('#teacherDialog').showModal();
 $('#teacherForm').addEventListener('submit',async e=>{
 e.preventDefault();const button=e.submitter;button.disabled=true;
 try{
  const teacher=$('#teacherName').value.trim();if(!teacher)throw Error('Enter your name.');
  $('#teacherDialog').close();
  if(kind==='preview'){preview=true;p=L.fresh('Teacher preview','—');teacherHome();}
  else if(kind==='approve'){if(!p.done.test){notify('Record a successful test and save the project first.','先记录成功的测试并保存项目。');return;}p.practical.status='teacher-checked';p.practical.teacher={name:teacher,at:new Date().toISOString()};delete p.practical.wrap;save();render();}
  else {if(p.practical.status!=='teacher-checked')p.practical.wrap={name:teacher,at:new Date().toISOString()};p.at=15;p.furthest=Math.max(p.furthest,15);save();render();}
 }catch(error){$('#teacherError').textContent=error.message;button.disabled=false;}
 });
}
function teacherHome(){
 toolbar();$('#content').innerHTML='<article class="card"><span class="eyebrow">Teacher controls · this device only</span><h1>Guide the practical, not the clicks.</h1><p>60 minutes: setup 3 · Do Now 7 · learning focus 3 · Main 1 12 · Main 2 22 · pitstop 3 · plenary 5 · export 5. Extensions fit inside practical time.</p><p>The teacher checkpoint asks you to watch the route, hear each learner explain a block, and check their saved project. No password is required. Use the end-of-lesson control if work is unfinished.</p><p>Students cannot jump to future cards. They can revisit teaching. Pupils working at home can confirm their own tested, saved work and continue. Their report distinguishes self-confirmation from a teacher check.</p><label for="previewStep">Preview a card</label><select id="previewStep"><option value="">Choose…</option>'+L.steps.map((s,i)=>'<option value="'+i+'">'+esc(s.stage+' — '+s.title)+'</option>').join('')+'</select><h2>Saved records on this device</h2><div class="scroll-table"><table class="records"><thead><tr><th>Pupil(s)</th><th>Class</th><th>Practical status</th></tr></thead><tbody>'+Object.values(profiles).map(r=>'<tr><td>'+esc(r.name+(r.partner?' + '+r.partner:''))+'</td><td>'+esc(r.className)+'</td><td>'+esc(L.status(r))+'</td></tr>').join('')+'</tbody></table></div><p>No class-wide dashboard: other devices keep their own records. Original V2 work remains untouched.</p></article>';
}
function download(data,name,type='application/json'){const url=URL.createObjectURL(new Blob([data],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
function reportRows(){
 const rows=[['Student(s)',studentNames().join(' + ')],['Class',p.className],['Practical status',L.status(p)],['Teacher check',p.practical.teacher? p.practical.teacher.name+' · '+p.practical.teacher.at:'Not recorded'],['Teacher end-of-lesson release',p.practical.wrap?p.practical.wrap.name+' · '+p.practical.wrap.at:'Not used'],['Project filename',p.answers.filename||'Not recorded'],['WAGBA knowledge','Read x and y; identify an event.'],['WAGBA skills','Build, run and test a sequence.'],['WAGBA understanding','Explain how a coordinate or block order changes the route.']];
 ['x','pairX','pairY','event','example','same'].forEach(k=>rows.push(['Do Now / checkpoint: '+k,String(p.answers[k]??'Not recorded')]));
 p.predictions.forEach((r,i)=>{rows.push(['Prediction '+(i+1),r.history.map(h=>'('+h.x+', '+h.y+')').join(' → ')||(r.x||r.y?'Draft: ('+r.x+', '+r.y+') — not checked':'Not attempted')]);rows.push(['Prediction explanation '+(i+1),p.done['predict'+(i+1)]?'Checked after tracing':'Not checked']);});
 if(p.answers.testNote)rows.push(['Latest test note (pupil draft)',p.answers.testNote]);
 Object.entries(p.practical.checks).forEach(([k,v])=>rows.push(['Pupil-reported checkpoint: '+k,v]));
 p.practical.tests.forEach((t,i)=>rows.push(['Pupil test '+(i+1),t.result+': '+t.note+' · '+t.at]));
 studentNames().forEach((name,i)=>{const m=p.learners[i];rows.push([name+' — goal',L.goals.find(g=>g[0]===m.goal)?.[1]||'Not recorded'],['Starting point',m.before||'Not recorded'],['Learning phase',L.phases.find(g=>g[0]===m.phase)?.[1]||'Not recorded'],['Reflection evidence',m.evidence||'Not recorded'],['Independent exit answer','('+String(m.exitX??'?')+', '+String(m.exitY??'?')+'); reason: '+(m.exitWhy||'Not recorded')],['Exit feedback',m.exitFeedback||'Not checked'],['Next time',m.next||'Not recorded']);});
 p.extensions.forEach((r,i)=>rows.push(['Challenge '+(i+1)+' (self-report)',(r.done?'Pupil reports tested':'Not recorded')+(r.note?' — '+r.note:'')]));
 if(p.fromPair)rows.push(['Continued individually','Personal copy for '+p.name+'; earlier shared work with '+p.fromPair]);
 Object.entries(p.skipped||{}).forEach(([id,who])=>rows.push(['Skipped for now — not assessed',L.steps.find(s=>s.id===id)?.title+' · '+who]));
 rows.push(['Progress note','Continuing after a short answer does not mean it is correct. Feedback and practical status are recorded separately.']);
 rows.push(['Teams submission',p.answers.submitted?'Pupil reports submitted; not verified':'Not yet reported'],['Evidence note','This report records responses, pupil-reported tests and a local teacher check. It does not automatically inspect Scratch or Teams.']);
 return rows;
}
function exportPdf(){
 const rows=reportRows();$('#printReport').innerHTML='<h1>Coordinate Quest</h1><p>Year 6 · Term 1 Week 3 · '+esc(new Date().toLocaleDateString())+'</p>'+rows.map(([k,v])=>'<div class="report-section"><h3>'+esc(k)+'</h3><p>'+esc(v)+'</p></div>').join('');
 if(language==='zh'||/[^\u0000-\u00ff\u2013\u2014\u2018\u2019\u201c\u201d\u2022\u2192\u2212]/.test(JSON.stringify(rows))||!window.jspdf){notify('Choose Save as PDF in the print window.','在打印窗口选择保存为 PDF。');window.print();return;}
 try{
 const doc=new window.jspdf.jsPDF();let y=23;doc.setFontSize(20);doc.text('Coordinate Quest',16,y);y+=10;doc.setFontSize(10);doc.text('Year 6 · Term 1 Week 3',16,y);y+=10;
 for(const [k,v] of rows){doc.setFont('helvetica','bold');doc.setFontSize(11);const title=doc.splitTextToSize(k,175);if(y+title.length*5+10>280){doc.addPage();y=20;}doc.text(title,16,y);y+=title.length*5+2;doc.setFont('helvetica','normal');doc.setFontSize(10);const lines=doc.splitTextToSize(String(v).replaceAll('−','-').replaceAll('→',' > ').replaceAll('—','-'),175);for(const line of lines){if(y>280){doc.addPage();y=20;}doc.text(line,16,y);y+=5;}y+=5;}
 const n=doc.getNumberOfPages();for(let i=1;i<=n;i++){doc.setPage(i);doc.setFontSize(8);doc.text('Coordinate Quest · '+i+' / '+n,16,291);}
 doc.save((p.name+'_'+p.className+'_CoordinateQuest.pdf').replace(/[^a-z0-9_.-]/gi,'_'));notify('PDF created. Check it, then attach it and your Scratch project in Teams.','PDF 已生成。检查后，把它和 Scratch 项目附到 Teams。');
 }catch(e){notify('PDF download failed. Use the print window to save a PDF.','下载失败，请通过打印窗口保存 PDF。');window.print();}
}
function perform(action){
 if(action==='language'){language=language==='zh'?'en':'zh';try{localStorage.setItem('coordinateQuestLanguageV3',JSON.stringify(language));}catch(e){}if(p)render();else{const values=$('#entry')?Object.fromEntries(new FormData($('#entry'))):null;landing();if(values){for(const [k,v] of Object.entries(values)){const el=$('#entry [name="'+k+'"]');if(el)el.value=v;}$('#partnerField').hidden=values.mode!=='pair';}}return;}
 if(action==='exit'){save();landing();return;}
 if(action==='close-dialog')return $('#teacherDialog').close();
 if(action==='teacher-home')return teacherHome();
 if(!p)return;
 const id=L.steps[p.at].id,a=p.answers;
 if(action==='solo-choice')return soloChoice();
 if(action==='solo-0'||action==='solo-1')return makeSolo(Number(action.slice(-1)));
 if(action.startsWith('revisit-'))return go(Number(action.slice(8)));
 if(action==='skip'){
  p.skipped=p.skipped||{};p.skipped[id]=studentNames()[person]+' · '+new Date().toISOString();
  waitingExtension=false;p.furthest=Math.max(p.furthest,Math.min(p.at+1,L.steps.length-1));go(p.at+1);return;
 }
 if(action==='backup')return download(JSON.stringify({profile:p,previous:p.legacyId?read(OLD,{})[p.legacyId]:p.previousBackup,language},null,2),'CoordinateQuest_backup.json');
 if(action==='back'){if(waitingExtension){waitingExtension=false;p.at=14;render();return;}return go(p.at-1);}
 if(action==='next'){
  if(waitingExtension){waitingExtension=false;p.at=14;render();return;}
  if(!preview&&!L.ready(p,id))return;
  if(p.skipped&&L.ready({...p,skipped:{}},id))delete p.skipped[id];
  p.furthest=Math.max(p.furthest,Math.min(p.at+1,L.steps.length-1));go(p.at+1);return;
 }
 if(action==='read')return setFeedback(id,true,'Next, learn how x and y tell the explorer where to go.','接下来学习 x 和 y 如何告诉探险者去哪里。');
 if(action==='check-x')return setFeedback(id,a.x==='left',a.x==='left'?'Yes. −120 is left of the centre.':'Look at the centre line. A negative x is to its left.',a.x==='left'?'正确，−120 在中心左边。':'看中心线，负 x 在它左边。');
 if(action==='check-pair'){const ok=number(a.pairX)===-120&&number(a.pairY)===-135;return setFeedback(id,ok,ok?'Yes: (−120, −135). x first, then y.':'Keep x first and both minus signs: (−120, −135).',ok?'正确，先 x 后 y。':'先 x 后 y，保留两个负号。');}
 if(action==='check-event')return setFeedback(id,a.event==='flag',a.event==='flag'?'Yes. Clicking the flag starts this script.':'This script has a flag event, not a space-key event.',a.event==='flag'?'正确，点击绿旗启动。':'这是绿旗事件，不是空格键事件。');
 if(action==='worked'){workedTrace=1;p.done.worked=true;save();render();return;}
 if(action==='predict'){
 const r=p.predictions[Number(id.slice(-1))-1];if(!validNumber(r.x)||!validNumber(r.y)){notify('Enter two numbers first. A prediction can be wrong.','先输入两个数字，预测可以不正确。');return;}
 r.history.push({x:r.x,y:r.y,at:new Date().toISOString()});r.submitted=true;r.trace=0;r.ran=false;p.done[id]=false;save();render();return;
 }
 if(action==='trace'){const n=Number(id.slice(-1))-1,r=p.predictions[n];r.trace=r.trace<L.predictions[n].ops.length?r.trace+1:0;if(r.trace===L.predictions[n].ops.length)r.ran=true;save();render();return;}
 if(action==='compare'){const n=Number(id.slice(-1))-1;if(!p.predictions[n].ran)return;const ok=a['compare'+n]==='correct';return setFeedback(id,ok,ok?'You compared your idea with what the code did. Ready to continue.':'Trace the blocks again. Watch which value changes; a turn changes direction only.',ok?'你已比较预测和代码结果，可以继续。':'再追踪积木，注意哪个数改变。转向只改变朝向。');}
 if(action==='confirm-open'){p.practical.status='in-progress';p.practical.checks.opened='Pupil reports seeing maze and Explorer';return setFeedback(id,true,'Opening confirmed by you. Next, run the supplied example in Scratch.','你已确认打开。接下来在 Scratch 运行示例。');}
 if(action==='check-example'){if(a.example==='A')p.practical.checks.example='Pupil reports START to A';return setFeedback(id,a.example==='A',a.example==='A'?'Observation saved. Now build the next part yourself.':'Thanks for telling us. In Scratch, select Explorer and click the green flag. Try again, or continue and return later.',a.example==='A'?'观察已保存，接下来自己编写下一段。':'谢谢你如实记录。在 Scratch 选择 Explorer 并点击绿旗。可以再试，也可以先继续，稍后回来。');}
 if(action==='check-b'){const ok=a.same==='x'&&a.bRan;if(ok)p.practical.checks.B='Pupil reports testing A to B';return setFeedback(id,ok,ok?'B checkpoint recorded. Now finish the route in Scratch.':'x stays −120. Add the glide and test in Scratch, then confirm that it reached B.',ok?'B 检查点已记录，请在 Scratch 完成路线。':'x 保持 −120。添加滑行并在 Scratch 测试，再确认到达 B。');}
 if(action==='check-route'){if(a.routeRan)p.practical.checks.route='Pupil reports testing all checkpoints';return setFeedback(id,!!a.routeRan,a.routeRan?'Your report is saved. Record what your test showed next.':'Test the full route in Scratch before confirming.',a.routeRan?'自我记录已保存，接下来记录测试结果。':'确认前先在 Scratch 测试完整路线。');}
 if(action==='log-test'){if(!a.testResult||!a.testNote?.trim()){notify('Choose what happened and add a few words about what you checked.','选择结果，简短说明检查了什么。');return;}p.practical.tests.push({result:a.testResult,note:a.testNote.trim(),at:new Date().toISOString()});p.done.test=false;p.practical.status='in-progress';delete p.practical.teacher;save();render();return;}
 if(action==='ready-check'){const last=p.practical.tests.at(-1);const ok=last?.result==='worked'&&a.fileSaved&&a.filename?.trim();if(ok)p.practical.status='awaiting-check';return setFeedback(id,!!ok,ok?'Ready for a teacher check. Keep your working Scratch project open.':'Your route does not need to be perfect to continue. Save what happened, then choose Continue or Skip for now. Keep trying the route in Scratch when you can.',ok?'准备教师检查，请保留 Scratch 作品。':'路线还没成功也可以继续。记录结果，选择继续或先跳过，有时间再到 Scratch 尝试。');}
 if(action==='home-complete'){
  if(preview)return;
  if(!p.done.test||!p.answers.fileSaved||!p.answers.filename?.trim()||p.practical.tests.at(-1)?.result!=='worked'){notify('First record a successful test and save your Scratch project.','请先记录成功测试并保存 Scratch 项目。');return;}
  if(p.practical.status!=='teacher-checked'){p.practical.status='self-checked';p.practical.selfCheck={at:new Date().toISOString()};delete p.practical.wrap;}
  p.furthest=Math.max(p.furthest,15);p.at=15;waitingExtension=false;save();render();return;
 }
 if(action==='approve'||action==='wrap'){if(preview){notify('Preview only: no pupil check is recorded.','仅预览，不记录学生检查。');return;}return teacherDialog(action);}
 if(action==='waiting-extension'){waitingExtension=true;p.at=16;render();return;}
 if(action==='return-check'){waitingExtension=false;p.at=14;save();render();return;}
 if(action==='save-extension'){const r=p.extensions[p.level];if(!a.extensionTested||!r.note.trim()){notify('Try it in Scratch, then record what happened.','先在 Scratch 尝试，再记录结果。');return;}r.done=true;r.at=new Date().toISOString();a.extensionTested=false;if(p.level<4)p.level++;save();render();return;}
 if(action==='unsure-exit'){const me=p.learners[person];me.exitRecorded=true;me.exitChecked=false;me.exitFeedback='Pupil asked for help; understanding not yet demonstrated.';me.exitFeedbackZh='学生需要帮助，尚未展示理解。';save();render();return;}
 if(action==='check-exit'){const me=p.learners[person];if(!validNumber(me.exitX)||!validNumber(me.exitY)||!me.exitWhy){notify('Give your answer, or choose “I need help”.','回答问题，或选择“需要帮助”。');return;}me.exitRecorded=true;const ok=validNumber(me.exitX)&&validNumber(me.exitY)&&number(me.exitX)===40&&number(me.exitY)===40&&me.exitWhy==='no-y';me.exitAttempts=(me.exitAttempts||[]).concat({x:me.exitX,y:me.exitY,why:me.exitWhy,correct:ok});me.exitChecked=ok;me.exitFeedback=ok?'Yes: (40, 40). Only x changed.':'Trace again: −60 + 100 = 40. No block changes y, so y stays 40.';me.exitFeedbackZh=ok?'正确：(40, 40)，只有 x 改变。':'再追踪：−60 + 100 = 40。没有积木改变 y，所以 y 保持 40。';save();render();return;}
 if(action==='pdf')return exportPdf();
}
document.addEventListener('click',e=>{
 const imageButton=e.target.closest('[data-code-image]');
 if(imageButton){const source=imageButton.querySelector('img'),dialog=$('#codeImageDialog');$('#codeImageTitle').innerHTML=B('Look closely at the blocks','仔细观察积木');$('#closeCodeImage').innerHTML=B('Back to my lesson','返回课程');$('#codeImageLarge').src=source.getAttribute('src');$('#codeImageLarge').alt=source.alt;$('#codeImageLarge').style.width=Math.round(Number(source.width)*1.5)+'px';dialog.showModal();return;}
 if(e.target.closest('#closeCodeImage')){$('#codeImageDialog').close();return;}
 const action=e.target.closest('[data-action]');if(action){perform(action.dataset.action);return;}
 const tab=e.target.closest('[data-person]');if(tab){person=Number(tab.dataset.person);render();return;}
 const level=e.target.closest('[data-level]');if(level){p.level=Number(level.dataset.level);p.answers.extensionTested=false;save();render();}
});
document.addEventListener('input',e=>{if(p&&e.target.dataset.field)setField(e.target.dataset.field,e.target.type==='checkbox'?e.target.checked:e.target.value);});
document.addEventListener('change',e=>{
 if(e.target.id==='restoreBackup'){restoreBackup(e.target);return;}
 if(e.target.id==='mode')$('#partnerField').hidden=e.target.value!=='pair';
 if(e.target.id==='previewStep'&&preview&&e.target.value!==''){p.at=Number(e.target.value);render();}
 if(p&&e.target.dataset.field){setField(e.target.dataset.field,e.target.type==='checkbox'?e.target.checked:e.target.value);if(['learner.phase','learner.goal'].includes(e.target.dataset.field))render();}
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='entry')return;e.preventDefault();const f=new FormData(e.target),name=String(f.get('name')).trim(),cls=String(f.get('class')).trim(),partner=f.get('mode')==='pair'?String(f.get('partner')).trim():'';
 if(name.toLowerCase()==='teacher'){teacherDialog('preview');return;}
 if(!name||!cls||(f.get('mode')==='pair'&&!partner)){$('#entryError').textContent=language==='zh'?'请填写姓名、班级和同伴姓名。':'Enter your name, class and partner’s name if working together.';return;}
 enter(name,cls,partner);
});
window.addEventListener('beforeunload',save);
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
landing();
})();
