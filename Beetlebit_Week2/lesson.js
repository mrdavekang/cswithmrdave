import {cards,esc,feedbackRules} from './cards.js';
import {ready,receive,docking,traceOrder,validGroup} from './logic.js';
import {mkcdContent} from './programs.js';

const BASE='microbit-inventors-week2-v1';
let state,profile,storageKey,timer,storageOK=true,toolsRegistered=false;
const fresh=()=>({index:0,unlocked:0,fields:{group:'',extensionRoute:'game'},feedback:{},trace:['display','send','press','receive','group'],lab:{sender:7,receiver:8,display:'S',log:'Send a message before changing the groups. Watch the receiver.'},game:{position:2,target:4,left:1,right:-1,guard:false,log:'The direction rules are wrong. Repair them, test the edges, then dock.'},done:false});
const validSaved=x=>x&&Number.isInteger(x.index)&&x.index>=0&&x.index<cards.length&&Number.isInteger(x.unlocked)&&x.unlocked>=x.index&&x.unlocked<cards.length&&x.fields&&x.feedback&&Array.isArray(x.trace)&&x.trace.length===5&&new Set(x.trace).size===5&&x.trace.every(k=>traceOrder.includes(k))&&x.lab&&x.game;

export async function startLesson(who){
  profile={name:String(who.name).slice(0,40),klass:String(who.klass||'').slice(0,30),teacher:!!who.teacher};
  state=fresh();
  if(!profile.teacher){
    try{
      const bytes=new TextEncoder().encode(profile.name.trim().toLowerCase()+'\n'+profile.klass.trim().toLowerCase());
      const digest=await crypto.subtle.digest('SHA-256',bytes);
      storageKey=BASE+'-'+Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,24);
      const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(validSaved(saved))state={...fresh(),...saved};
      sessionStorage.setItem(BASE+'-profile',JSON.stringify(profile));
    }catch{storageOK=false;}
  }
  document.querySelector('#app').innerHTML=`<header class="topbar"><div class="topbar-brand"><span class="brandmark">mi<span>↗</span></span><div><strong>MICROBIT INVENTORS</strong><small>WEEK 02 · SEND THE SIGNAL</small></div></div><div class="student-menu"><span>${esc(profile.teacher?'Teacher review':profile.name+' · '+profile.klass)}</span><button class="text-button" data-action="leave">Change learner</button></div></header><div id="save-warning" class="save-warning" role="status"${storageOK?' hidden':''}>This browser cannot save progress. Keep this page open and download your learning record before leaving.</div>${profile.teacher?'<div class="teacher-bar"><b>Teacher review</b><label for="teacher-card">Jump to</label><select id="teacher-card"></select><span>All cards unlocked. Review work is not saved as student evidence.</span></div>':''}<div class="shell"><aside class="focus-rail" aria-label="Our learning focus"><span class="week-pill">WEEK 02 / 90 MIN</span><dl class="focus-block topic"><dt>TOPIC</dt><dd>Radio control: send the signal</dd></dl><dl class="focus-block wagba"><dt>WAGBA</dt><dd>Build, download and test LEFT, RIGHT and STOP messages between two micro:bits.</dd></dl><dl class="focus-block ksu"><dt>KNOWLEDGE</dt><dd>Sender, receiver, group, message, event, condition.</dd></dl><dl class="focus-block ksu"><dt>SKILLS</dt><dd>Read → build → download → test → debug.</dd></dl><dl class="focus-block ksu"><dt>UNDERSTANDING</dt><dd>The receiver’s code gives a message its meaning.</dd></dl><dl class="focus-block keywords"><dt>KEYWORDS</dt><dd>Radio · string · selection · debug</dd></dl><dl class="focus-block challenge"><dt>CHALLENGE</dt><dd>Prove the link. Explain the fault. Program the game.</dd></dl><details class="journey-review"><summary>Review earlier cards</summary><nav id="review-nav" aria-label="Learning cards"></nav></details></aside><main class="lesson-main" id="main"><div class="journey"><strong id="stage"></strong><div class="progress-track" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="17"><span id="progress"></span></div><span id="card-number"></span></div><article class="lesson-card" aria-labelledby="card-title"></article><footer class="card-footer"><button class="secondary" id="back">← Back</button><div class="next-area"><span class="next-hint" id="next-hint" aria-live="polite"></span><button class="primary" id="next" aria-describedby="next-hint"></button></div></footer></main></div>`;
  bindEvents();render();registerTools();
}

function saveNow(){
  clearTimeout(timer);
  if(profile?.teacher||!storageKey)return;
  try{localStorage.setItem(storageKey,JSON.stringify(state));}
  catch{storageOK=false;const warning=document.querySelector('#save-warning');if(warning)warning.hidden=false;}
}
function save(){clearTimeout(timer);timer=setTimeout(saveNow,120);}
window.addEventListener('pagehide',saveNow);

function render(focus=true){
  if(state.done){renderComplete(focus);save();return;}
  const c=cards[state.index];
  document.querySelector('.lesson-card').innerHTML=`<div class="card-label"><span>${esc(c.stage)}</span><span>${c.minutes} minutes</span></div><h2 id="card-title" tabindex="-1">${esc(c.title)}</h2><p class="card-intro">${esc(c.intro)}</p><div class="card-content">${c.body(state)}</div>${profile.teacher?`<details class="hint-panel"><summary>Teacher notes</summary><p>${esc(c.teacher)}</p></details>`:''}`;
  document.querySelector('#stage').textContent=c.stage;
  document.querySelector('#card-number').textContent=`${state.index+1} / ${cards.length}`;
  document.querySelector('#progress').style.width=((state.index+1)/cards.length*100)+'%';
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',state.index+1);
  document.querySelector('.card-footer').hidden=false;
  document.querySelector('#back').disabled=state.index===0;
  document.querySelector('#review-nav').innerHTML=cards.map((x,i)=>`<button data-review="${i}"${!profile.teacher&&i>state.unlocked?' disabled':''}${i===state.index?' aria-current="step"':''}>${i+1}. ${esc(x.title)}</button>`).join('');
  if(profile.teacher)document.querySelector('#teacher-card').innerHTML=cards.map((x,i)=>`<option value="${i}"${i===state.index?' selected':''}>${i+1}. ${esc(x.stage)} — ${esc(x.title)}</option>`).join('');
  updateGate();save();
  if(focus){document.querySelector('#card-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function updateGate(){
  if(state.done)return;
  const c=cards[state.index],ok=profile.teacher||ready(c.id,state);
  document.querySelector('#next').disabled=!ok;
  document.querySelector('#next').textContent=c.next+' →';
  document.querySelector('#next-hint').textContent=ok?'Ready for your next step.':c.hint;
}
function go(index){
  if(!Number.isInteger(index)||index<0||index>=cards.length||(!profile.teacher&&index>state.unlocked))return false;
  state.index=index;state.done=false;render();return true;
}
function advance(){
  if(!profile.teacher&&!ready(cards[state.index].id,state))return;
  if(state.index===cards.length-1){
    const missing=cards.findIndex(c=>!ready(c.id,state));
    if(!profile.teacher&&missing!==-1){go(missing);return;}
    state.done=true;render();return;
  }
  state.unlocked=Math.max(state.unlocked,state.index+1);go(state.index+1);
}
function bindEvents(){
  document.querySelector('#next').addEventListener('click',advance);
  document.querySelector('#back').addEventListener('click',()=>go(state.index-1));
  document.querySelector('#app').addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.choice){
      const key=b.dataset.choice;state.fields[key]=b.dataset.value;
      const rule=feedbackRules[key];if(rule)state.feedback[key]=b.dataset.value===rule.correct?rule.good:rule.retry;
      render(false);document.querySelector(`[data-choice="${key}"][data-value="${b.dataset.value}"]`)?.focus({preventScroll:true});
    }
    if(b.dataset.review!==undefined)go(Number(b.dataset.review));
    if(b.dataset.move!==undefined){
      const i=Number(b.dataset.move),j=i+Number(b.dataset.direction);
      if(j>=0&&j<state.trace.length){[state.trace[i],state.trace[j]]=[state.trace[j],state.trace[i]];state.fields.traceChecked=false;state.feedback.trace='';render(false);document.querySelector(`[data-move="${j}"]:not(:disabled)`)?.focus({preventScroll:true});}
    }
    if(b.dataset.send){
      const r=receive(b.dataset.send,state.lab.sender,state.lab.receiver,state.lab.display);
      state.lab.display=r.display;
      if(r.delivered){state.fields.labDelivered=true;state.lab.log=`Message ${b.dataset.send} arrived. The matching group let the received-string event run.`;}
      else{state.fields.labBlocked=true;state.lab.log=`Message not received: the groups differ. The receiver keeps its previous display (${state.lab.display}).`;}
      render(false);
    }
    if(b.dataset.download)downloadProject(b.dataset.download);
    if(b.dataset.route){state.fields.extensionRoute=b.dataset.route;render(false);}
    if(b.dataset.dock){
      const g=state.game,r=docking(g.position,b.dataset.dock,g.target,g.left,g.right,g.guard);g.position=r.position;
      if(r.docked&&g.left===-1&&g.right===1&&g.guard){state.fields.dockSuccess=true;g.log='Docked! Your direction rules and boundary guard work. Try the other target, or load the micro:bit version.';}
      else if(r.docked){g.log='You reached the dock. Now repair both direction rules and switch on the boundary guard, then dock again.';}
      else if(r.outside){g.log='The dot left the screen! Reset it, then add the boundary guard.';}
      else if(b.dataset.dock==='S'){g.log=`Stopped at ${g.position}; the dock is at ${g.target}. Keep testing.`;}
      else{g.log=`${b.dataset.dock} moved the dot to ${g.position}. Does that match your intended direction?`;}
      render(false);
    }
    switch(b.dataset.action){
      case 'check-trace':state.fields.traceChecked=state.trace.every((x,i)=>x===traceOrder[i]);state.feedback.trace=state.fields.traceChecked?'You traced the whole journey: input → transmission → reception → event → output.':'Not yet. Start with the button press. A message must be received before the receiving event can display it.';render(false);break;
      case 'restart-game':state.game.position=2;state.game.log='Dot reset. Your current rules are unchanged.';render(false);break;
      case 'next-level':state.game.target=state.game.target===4?0:4;state.game.position=2;state.game.log=`New target: column ${state.game.target}. Can the same rules dock on the other side?`;render(false);break;
      case 'leave':saveNow();try{sessionStorage.removeItem(BASE+'-profile');}catch{}location.reload();break;
      case 'record':downloadRecord();break;
      case 'review-lesson':go(0);break;
    }
  });
  document.querySelector('#app').addEventListener('input',event=>{
    const el=event.target;if(!el.dataset.field||el.type==='checkbox'||el.tagName==='SELECT')return;
    state.fields[el.dataset.field]=el.value;updateGate();save();
  });
  document.querySelector('#app').addEventListener('change',event=>{
    const el=event.target;
    if(el.id==='teacher-card'&&profile.teacher)go(Number(el.value));
    if(el.dataset.field){
      state.fields[el.dataset.field]=el.type==='checkbox'?el.checked:el.value;
      if(el.dataset.field.startsWith('learning')){
        state.feedback.learning=ready('learning',state)?'Yes. Remember facts, practise skills, and explain connections.':'Knowledge is what you remember. Skills improve with practice. Understanding helps you explain why.';
        const box=document.querySelector('#feedback-learning');if(box){box.hidden=false;box.textContent=state.feedback.learning;}
      }
      updateGate();save();
    }
    if(el.dataset.labGroup){state.lab[el.dataset.labGroup]=Number(el.value);save();}
    if(el.dataset.gameRule){state.game[el.dataset.gameRule]=el.type==='checkbox'?el.checked:Number(el.value);state.fields.dockSuccess=false;state.game.position=2;state.game.log='Rule changed. Test your program again from column 2.';render(false);}
  });
}
function download(name,content,type='text/plain;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function downloadProject(key){
  const group=validGroup(state.fields.group)?Number(state.fields.group):7;
  try{download(`W2_${key}_group${group}.mkcd`,mkcdContent(key,group),'application/json');}catch(error){document.querySelector('#next-hint').textContent=error.message;}
}
function downloadRecord(){
  const f=state.fields;
  const rows=[`MICROBIT INVENTORS · WEEK 2: SEND THE SIGNAL`,`Name: ${profile.name}`,`Class: ${profile.klass}`,`Radio group: ${f.group||'Not entered'}`,`Status: ${profile.teacher?'Teacher review — not student evidence':state.done?'Lesson completed':'In progress'}`,'','Hardware results (reported by learner; not detected by this website)',...['testStart','testL','testR','testS'].map(k=>`${k.replace('test','')}: ${f[k]||'Not tested'}`),'',`Learning pit stop: ${f.pitstop||'Not answered'}`,f.pitEvidence||'No evidence entered.','',`Fault repair: ${f.debugEvidence||'Not recorded'}`,`Peer test: ${f.peerTest?'Confirmed by learner':'Not confirmed'}`,`Mission debrief: ${f.debrief||'Not recorded'}`,`Programming extension: ${f.extensionRoute==='consolidate'?(f.extensionEvidence||'Not recorded'):f.dockSuccess?'Docked with correct direction rules and boundary guard':'Not yet completed'}`,'',`My explanation: ${f.exitExplanation||'Not entered'}`,`Why an old arrow can remain: ${f.exitFault==='noEvent'?'No new receiving event runs.':f.exitFault?'Response needs revisiting.':'Not answered'}`,`Confidence: ${f.confidence||'Not chosen'}`];
  download('Microbit_Week2_Learning_Record.txt',rows.join('\n'));
}
function renderComplete(focus){
  document.querySelector('.card-footer').hidden=true;
  document.querySelector('#stage').textContent='Mission complete';
  document.querySelector('#card-number').textContent='17 / 17';
  document.querySelector('#progress').style.width='100%';
  document.querySelector('.lesson-card').innerHTML=`<span class="complete-mark" aria-hidden="true">✓</span><h2 id="card-title" tabindex="-1">${profile.teacher?'You have reviewed the whole mission.':'Signal sent. Learning connected.'}</h2><p class="card-intro">${profile.teacher?'Teacher preview does not certify any student’s work.':'You have recorded your tests and explained how two micro:bits communicate. Keep that evidence for your next BEETLE:BIT mission.'}</p><div class="evidence-row"><span>Read & trace</span><span>Build & test</span><span>Debug & explain</span></div><div class="panel"><h3>Keep your learning</h3><p>Download your record and save your two MakeCode projects. Your teacher can review the record when you share it.</p><div class="actions"><button class="primary" data-action="record">↓ Download my learning record</button><button class="secondary" data-action="review-lesson">Review my cards</button></div><p class="caption">${profile.teacher?'Review mode does not save student progress.':storageOK?'Your progress is saved in this browser on this device. On shared devices, choose Change learner when you finish.':'Browser saving is unavailable. Download your record now.'} The website does not upload your name, class or answers.</p></div><details class="hint-panel sources"><summary>Lesson sources & credits</summary><a href="https://makecode.microbit.org/reference/radio/on-received-string" target="_blank" rel="noopener">Microsoft MakeCode · Receive a radio string</a><a href="https://makecode.microbit.org/reference/radio/set-group" target="_blank" rel="noopener">Microsoft MakeCode · Radio groups</a><a href="https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/" target="_blank" rel="noopener">Micro:bit Educational Foundation · Transfer code</a><a href="https://beetlebit-hub.cytron.io/chapter-resources/bonus" target="_blank" rel="noopener">Cytron BEETLE:BIT Hub · Radio-control progression</a><a href="https://static.teachcomputing.org/pedagogy/Pedagogy-principles.pdf" target="_blank" rel="noopener">Teach Computing · Computing pedagogy principles</a><p class="caption">MakeCode block images: official Microsoft renderer. Robot image: Cytron, reused from the supplied Week 1 lesson. Types of Learning and Learning Pit Stop: supplied school resources. This independent classroom lesson is not an official Cytron or Microsoft product.</p></details>`;
  if(focus){document.querySelector('#card-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function registerTools(){
  const context=document.modelContext;
  if(toolsRegistered||!context?.registerTool)return;
  const lifecycle=new AbortController();
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  try{
    Promise.resolve(context.registerTool({name:'get_lesson_progress',description:'Read anonymous Week 2 card progress. Does not expose student identity or answers.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async(input)=>{if(input&&Object.keys(input).length)return{isError:true,content:[{type:'text',text:'No input fields are accepted.'}]};return {content:[{type:'text',text:JSON.stringify({cardId:cards[state.index].id,title:cards[state.index].title,unlocked:state.unlocked+1,total:cards.length,canContinue:profile.teacher||ready(cards[state.index].id,state),complete:state.done})}]};}},{signal:lifecycle.signal})).catch(()=>{});
    Promise.resolve(context.registerTool({name:'review_unlocked_learning_card',description:'Navigate to an already unlocked learning card, or any card in teacher review. Never records answers or hardware passes.',inputSchema:{type:'object',properties:{cardId:{type:'string',enum:cards.map(c=>c.id)}},required:['cardId'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input)=>{if(!input||Object.keys(input).length!==1||typeof input.cardId!=='string')return{isError:true,content:[{type:'text',text:'Provide one valid cardId.'}]};const {cardId}=input,i=cards.findIndex(c=>c.id===cardId);if(!go(i))return{content:[{type:'text',text:'That card is not available yet.'}],isError:true};return{content:[{type:'text',text:JSON.stringify({cardId,title:cards[i].title})}]};}},{signal:lifecycle.signal})).catch(()=>{});
    toolsRegistered=true;
  }catch{/* Normal browser interaction remains available without WebMCP. */}
}
export async function resumeLesson(){
  try{const who=JSON.parse(sessionStorage.getItem(BASE+'-profile')||'null');if(who&&typeof who.name==='string'&&typeof who.klass==='string'&&!who.teacher){await startLesson(who);return true;}}catch{}
  return false;
}
