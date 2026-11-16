(()=>{
'use strict';
const L=window.GateLesson,{tr}=L,cards=L.cards,$=(id)=>document.getElementById(id);
const KEY='cswithmrdave-gate-glitch-v1', editor='https://makecode.microbit.org/#editor';
const escape=(s)=>String(s??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fresh=()=>({lesson:'gate-glitch',version:1,name:'',className:'',partner:'',lang:'en',step:0,answers:{},seed:Math.random()});
const keys=['predict','why','focus','opened','before','after','repair','paths','decision','pattern','loop','six','seven','eight','reset','pit','route','extension','plenary','handover','saved'];
function clean(d){
 if(!d||d.lesson!=='gate-glitch'||d.version!==1)throw Error('Wrong file type');
 const n=fresh();for(const k of ['name','className','partner'])if(typeof d[k]==='string')n[k]=d[k].trim().slice(0,60);
 n.lang=['en','zh','ko'].includes(d.lang)?d.lang:'en';n.step=Math.min(cards.length-1,Math.max(0,Number.isInteger(d.step)?d.step:0));
 n.seed=typeof d.seed==='number'&&Number.isFinite(d.seed)?d.seed:n.seed;
 for(const k of keys){const v=d.answers?.[k];if(typeof v==='string')n.answers[k]=v.slice(0,300);}
 return n;
}
let state;try{state=clean(JSON.parse(localStorage.getItem(KEY)));}catch{state=fresh();}
let active=Boolean(state.name&&state.className);
const t=(v)=>typeof v==='string'?escape(v):escape(v.en)+(state.lang!=='en'&&v[state.lang]?'<span class="support" lang="'+(state.lang==='zh'?'zh-Hans':'ko')+'">'+escape(v[state.lang])+'</span>':'');
const a=(k)=>state.answers[k]??'';
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{$('notice').textContent='Device storage is unavailable. Download a backup before closing this tab.';}}
function message(msg){$('notice').innerHTML=t(msg);}
const img=(id)=>{const [file,alt]=L.visuals[id];return '<figure class="visual"><img src="assets/'+file+'.webp" alt="'+escape(alt)+'" width="1600" height="900"></figure>';};
const p=(v)=>'<p>'+t(v)+'</p>';
const h=(v)=>'<h2>'+t(v)+'</h2>';
const stepList=(...v)=>'<ol class="steps">'+v.map(x=>'<li>'+t(x)+'</li>').join('')+'</ol>';
const task=(v)=>'<div class="taskbar">'+t(v)+'</div>';
const hint=(v)=>'<div class="hint">'+t(v)+'</div>';
const btn=(text,action,primary=false)=>'<button type="button" '+(primary?'class="primary" ':'')+'data-action="'+action+'">'+t(text)+'</button>';
const link=(v,href,download=false)=>'<a class="btn primary" href="'+escape(href)+'" '+(download?'download':'target="_blank" rel="noopener noreferrer"')+'>'+t(v)+'</a>';
const openEditor=()=>link(tr('Open MakeCode ↗','打开 MakeCode ↗','MakeCode 열기 ↗'),editor);
const help=tr('I tried and need help','我试过了，需要帮助','시도했고 도움이 필요해요');
const options={
 predict:[['four',tr('It shows 4.','显示 4。','4를 보여 줘요.')],['five',tr('It only shows the number 5.','只显示数字 5。','숫자 5만 보여 줘요.')],['warning',tr('It flashes a warning, then shows 5.','闪警告，再显示 5。','경고가 깜빡인 뒤 5를 보여 줘요.')]],
 focus:[['spot',tr('Spot it · I can name the input, rule and output.','找一找 · 我能指出输入、规则和输出。','찾기 · 입력, 규칙, 출력을 말할 수 있어요.')],['fix',tr('Fix it · I can change a block and try it.','修一修 · 我能改一个积木并试一试。','고치기 · 블록을 바꾸고 시험할 수 있어요.')],['prove',tr('Prove it · I can choose a test that finds a bug.','验一验 · 我能选一个能发现错误的测试。','확인하기 · 오류를 찾는 시험을 고를 수 있어요.')]],
 opened:[['tried',tr('My starter is open in MakeCode','我已在 MakeCode 打开项目','MakeCode에서 시작 파일을 열었어요')],['help',help]],
 repair:[['tried',tr('I changed B and tested it','我改了 B 并测试过','B를 바꾸고 시험했어요')],['help',help]],
 paths:[['number',tr('It shows the number 3.','显示数字 3。','숫자 3을 보여 줘요.')],['star',tr('It shows the star.','显示星星。','별을 보여 줘요.')],['blank',tr('It shows nothing.','什么都不显示。','아무것도 보여 주지 않아요.')]],
 decision:[['tried',tr('I tried the rule at 6 and 7','我测试了人数为 6 和 7 的情况','6명과 7명일 때 규칙을 시험했어요')],['help',help]],
 pattern:[['tried',tr('I tried one flash','我试过闪一次','한 번 깜빡이게 시험했어요')],['help',help]],
 loop:[['tried',tr('I added and tried the repeat','我加了循环并试过了','반복을 넣고 시험했어요')],['help',help]],
 pit:[['new',tr('New Learning · I am working it out.','新学习 · 我正在弄明白。','새로운 배움 · 알아 가는 중이에요.')],['consolidate',tr('Consolidating · I can do it and explain it.','巩固学习 · 我能做，也能解释。','다져 가는 배움 · 할 수 있고 설명할 수 있어요.')],['water',tr('Treading Water · I am ready for a challenge.','需要挑战 · 我准备好接受挑战了。','더 도전할 준비 · 도전할 준비가 됐어요.')],['help',tr('Drowning / I need help · I am stuck on one step.','我需要帮助 · 我卡在一步了。','도움이 필요해요 · 한 단계에서 막혔어요.')]],
 route:[['retry',tr('Retry one check on my own counter','重新检查自己的计数器','내 계수기 다시 시험하기')],['mystery',tr('Try the mystery glitch','找出神秘故障','숨은 오류 찾기')]],
 plenary:[['a',tr('Press A once and check for 1.','按一次 A，检查是否显示 1。','A를 한 번 눌러 1이 보이는지 확인해요.')],['b',tr('Press B again and check for 0.','再按 B，检查是否显示 0。','B를 다시 눌러 0이 보이는지 확인해요.')],['no',tr('No extra press. Seeing 0 is enough.','不用再按。看到 0 就够了。','더 누를 필요 없이 0이면 충분해요.')]],
 saved:[['yes',tr('I have saved my MakeCode project','我已保存 MakeCode 项目','MakeCode 프로젝트를 저장했어요')],['help',tr('I need help saving','我需要保存方面的帮助','저장하는 데 도움이 필요해요')]]
};
const phaseNext={
 new:tr('Test 6 and 7 again. Read the rule out loud before each test.','再测试 6 和 7。每次测试前读出规则。','6명과 7명을 다시 시험하세요. 시험 전에 규칙을 소리 내어 읽어 보세요.'),
 consolidate:tr('Show a partner why the warning still happens at 8.','向同伴说明为什么 8 也会出现警告。','8명일 때도 왜 경고가 나오는지 짝에게 보여 주세요.'),
 water:tr('Choose the mystery glitch on the next card.','下一张卡选“神秘故障”。','다음 카드에서 숨은 오류를 선택하세요.'),
 help:tr('Point to the first step where you got stuck. Ask for help with just that step.','指出第一处卡住的步骤。只请别人帮你看那一步。','처음 막힌 단계를 가리키고 그 단계만 도와 달라고 하세요.')
};
const results={
 six:[tr('6 visitors','6 位访客','방문객 6명'),tr('Show 6. No warning.','显示 6。不警告。','6 표시. 경고 없음.')],
 seven:[tr('7 visitors','7 位访客','방문객 7명'),tr('Flash three times, then show 7.','闪三次，再显示 7。','세 번 깜빡인 뒤 7 표시.')],
 eight:[tr('8 visitors','8 位访客','방문객 8명'),tr('Flash three times, then show 8.','闪三次，再显示 8。','세 번 깜빡인 뒤 8 표시.')],
 reset:[tr('B, then A once','按 B，再按一次 A','B를 누른 뒤 A 한 번'),tr('B shows 0. The next A shows 1.','B 显示 0。再按 A 显示 1。','B는 0, 다음 A는 1을 표시해요.')]
};
const resultOptions=[['',tr('Choose what you saw','选择你看到的结果','본 결과를 고르세요')],['pass',tr('It matched','符合预期','예상과 같았어요')],['different',tr('Something different happened','出现了不同结果','다른 결과가 나왔어요')],['untested',tr('Not tested yet','还没测','아직 시험하지 않았어요')]];
function choose(k){
 const list=options[k];const rotate=['predict','paths','plenary'].includes(k)?Math.floor(state.seed*17+k.length)%list.length:0;
 return '<div class="choice-grid">'+[...list.slice(rotate),...list.slice(0,rotate)].map(([v,label])=>'<button type="button" data-choice="'+k+'" data-value="'+v+'" aria-pressed="'+(a(k)===v)+'">'+t(label)+'</button>').join('')+'</div>';
}
function noteField(k,label,max=130){
 return '<label class="field">'+t(label)+'<textarea data-answer="'+k+'" maxlength="'+max+'">'+escape(a(k))+'</textarea></label>';
}
function countField(k,label){
 return '<label class="field">'+t(label)+'<input data-answer="'+k+'" maxlength="8" inputmode="numeric" autocomplete="off" value="'+escape(a(k))+'"></label>';
}
const feedback=(k,correct,yes,no)=>a(k)?hint(a(k)===correct?yes:no):'';
function resultFields(){return Object.entries(results).map(([k,[n,expected]])=>'<label class="result-row"><strong>'+t(n)+'</strong><span>'+t(expected)+'</span><select aria-label="'+escape(n.en)+'" data-answer="'+k+'">'+resultOptions.map(([id,label])=>'<option value="'+id+'" '+(a(k)===id?'selected':'')+'>'+escape(label.en+(state.lang==='en'?'':' · '+label[state.lang]))+'</option>').join('')+'</select></label>').join('');}
function checks(){return [[a('reset')==='pass',tr('Reset works','重置正常','초기화 성공')],[a('six')==='pass'&&a('seven')==='pass',tr('Warning starts at 7','警告从 7 开始','7명부터 경고')],[a('eight')==='pass',tr('Warning still works at 8','人数为 8 时仍然警告','8명일 때도 경고')]].map(([ok,label])=>'<span class="'+(ok?'checked':'pending')+'"><b aria-label="'+(ok?'Matched':'Not yet matched')+'">'+(ok?'✓':'○')+'</b> '+t(label)+'</span>').join('');}
function body(c){
 switch(c.id){
 case 'predict':return choose('predict')+feedback('predict','warning',tr('That matches the rule. A makes the count 5, so the warning runs before 5 appears.','符合规则。A 让人数变成 5，所以先警告再显示 5。','규칙과 같아요. A로 5가 되어 경고 뒤 5가 보여요.'),tr('Trace it again: add one first, then check the NEW count.','再读一遍：先加一，再检查新人数。','다시 읽으세요. 먼저 1을 더한 뒤 새 수를 확인해요.'))+noteField('why',tr('Optional: “First A…, then the program checks…”','可选：“A 先……，然后程序检查……”','선택: “먼저 A는 …, 그다음 프로그램은 …을 확인해요.”'));
 case 'learning':return choose('focus')+hint(tr('Say the move you picked to a partner, or think it quietly.','和同伴说说你的选择，也可以自己想一想。','짝에게 고른 것을 말하거나 조용히 생각해 보세요.'));
 case 'setup':return '<div class="buttons">'+link(tr('1 · Download the faulty starter','1 · 下载有故障的起始文件','1 · 고장 난 시작 파일 다운로드'),'assets/Gate-Glitch-Starter.hex',true)+openEditor()+'</div>'+stepList(tr('In MakeCode, go to Home. Choose Import → Import File.','在 MakeCode 首页选择 Import → Import File。','MakeCode 홈에서 Import → Import File을 고르세요.'),tr('Choose Gate-Glitch-Starter.hex in Downloads. Open it in Blocks.','从下载文件夹选择 Gate-Glitch-Starter.hex，用 Blocks 打开。','다운로드에서 Gate-Glitch-Starter.hex를 고르고 Blocks로 여세요.'))+choose('opened');
 case 'fault':return task(tr('A → A → A → B → A','A → A → A → B → A','A → A → A → B → A'))+countField('before',tr('What number did the LAST A show?','最后一次按 A 显示了几？','마지막 A는 몇을 보여 줬나요?'))+(a('before')?hint(tr('Keep that result. You’ll compare it with the repaired counter.','保留结果。接下来和修好的计数器比较。','이 결과를 기억하세요. 고친 계수기와 비교할 거예요.')):'');
 case 'repair':return stepList(tr('Use Variables to change the stored value to zero.','用 Variables 把储存的值改成 0。','Variables로 저장된 수를 0으로 바꾸세요.'),tr('Use the stored value in show number. Start the simulator again and rerun the exact same test.','让 show number 显示储存值。重启模拟器，再做同样的测试。','show number에 저장된 수를 넣으세요. 시뮬레이터를 다시 시작하고 같은 시험을 하세요.'))+countField('after',tr('After the fix, what did the last A show?','修好后，最后按 A 显示了几？','고친 뒤 마지막 A는 몇을 보여 줬나요?'))+choose('repair');
 case 'model-decision':return h(tr('A is pressed and the NEW total is 3. What appears?','按 A 后，新分数是 3。会显示什么？','A를 누른 뒤 새 점수가 3이에요. 무엇이 보일까요?'))+choose('paths')+feedback('paths','star',tr('Yes. The number 3 is included in “3 or more”.','对，“3 或更多”包括 3。','맞아요. “3 이상”에는 3도 들어가요.'),tr('Read the comparison. Is 3 included in “3 or more”?','读比较条件：“3 或更多”包括 3 吗？','비교를 읽어 보세요. “3 이상”에 3이 포함되나요?'));
 case 'build-decision':return task(tr('Below 7 → show the count. At 7 or more → show your icon.','少于 7 → 显示人数。7 或更多 → 显示图案。','7명 미만 → 숫자. 7명 이상 → 경고 그림.'))+p(tr('Keep one A script. Move the old number block to the quiet path. Keep B as your reset.','保留一个 A 脚本，把原来的数字积木移到安静分支。B 仍然重置。','A 스크립트는 하나만 두세요. 원래 숫자 블록을 조용한 갈래로 옮기세요. B는 초기화로 두세요.'))+choose('decision');
 case 'flash':return stepList(tr('Show the warning icon. Pause for a moment.','显示警告图案，等一下。','경고 그림을 보여 주고 잠깐 기다리세요.'),tr('Clear the LEDs. Pause again so you can see the blank screen.','清空 LED，再等一下，观察黑屏。','LED를 끄고 빈 화면을 볼 수 있도록 다시 기다리세요.'))+choose('pattern');
 case 'repeat':return task(tr('Inside repeat: icon → pause → clear → pause. Outside repeat: show the total.','循环内：图案 → 等待 → 清空 → 等待。循环后：显示人数。','반복 안: 그림 → 기다리기 → 끄기 → 기다리기. 반복 바깥: 인원 표시.'))+choose('loop');
 case 'test':return '<div class="proof-checks" id="proof-checks" aria-live="polite">'+checks()+'</div>'+h(tr('Expected → What I saw','预期 → 我看到的结果','예상 → 실제 결과'))+resultFields()+hint(tr('A result that doesn’t match is a clue, not a failure. Fix one thing and test again.','结果不符是线索，不是失败。改一处，再试。','결과가 다르면 오류를 찾을 단서예요. 한 곳을 고치고 다시 시험하세요.'));
 case 'pitstop':return choose('pit')+(a('pit')?task(phaseNext[a('pit')]):'');
 case 'challenge':return choose('route')+(a('route')==='retry'?task(tr('Choose one check that was different or not tested. Rerun it after changing one thing in MakeCode.','选一个结果不同或没测的项目。在 MakeCode 改一处后重试。','결과가 다르거나 아직 시험하지 않은 것을 고르세요. MakeCode에서 한 곳을 고치고 다시 시험하세요.')):a('route')==='mystery'?'<div class="support-stack">'+img('rival')+noteField('extension',tr('What count would catch this bug? Why?','哪个人数能找出错误？为什么？','몇 명일 때 오류가 드러날까요? 왜 그런가요?'))+'</div>':'');
 case 'plenary':return choose('plenary')+feedback('plenary','a',tr('Exactly: the next A proves the stored count started again at 0.','没错：下一次按 A 能证明储存人数从 0 重新开始。','맞아요. 다음 A로 저장된 수가 0에서 다시 시작했는지 확인해요.'),tr('Seeing a zero is not enough. Choose a test that makes the counter use its stored value.','看到 0 不够。选一个会用到储存人数的测试。','0을 보는 것만으론 부족해요. 저장된 수를 사용하는 시험을 고르세요.'));
 case 'exit':return stepList(tr('Give your MakeCode project a clear name and press Download to keep the HEX file.','给 MakeCode 项目起个清楚的名字，按 Download 保存 HEX 文件。','MakeCode 프로젝트 이름을 정하고 Download로 HEX 파일을 저장하세요.'),tr('Keep the HEX. If your teacher asks for it, you can also save a PDF practice record below.','保留 HEX。如果老师需要，也可以在下方保存 PDF 练习记录。','HEX 파일을 보관하세요. 선생님이 요청하면 아래에서 연습 기록 PDF도 저장할 수 있어요.'))+choose('saved')+noteField('handover',tr('Optional: “Try ___. You should see ___.”','可选：“试试___，你应该看到___。”','선택: “___ 해 보세요. ___이(가) 보여야 해요.”'))+'<div class="buttons">'+btn(tr('Save practice record as PDF','保存练习记录 PDF','연습 기록 PDF 저장'),'print')+btn(tr('Download JSON backup','下载 JSON 备份','JSON 백업 다운로드'),'backup')+'</div>';
 default:return '';
 }
}
function support(c){
 const refs={fault:['buttons'], 'build-decision':['comparison'],repeat:['loops']};
 return (refs[c.id]||[]).map(x=>'<div class="support-stack">'+img(x)+'</div>').join('');
}
function welcome(){
 return '<section class="hero"><div class="hero-main"><div class="kicker">'+t(tr('Robot Expo · Repair crew','机器人展 · 修理队','로봇 전시회 · 수리팀'))+'</div><h1>Gate Glitch</h1><p class="tagline">'+t(tr('Save the Robot Expo','拯救机器人展','로봇 전시회를 구하세요'))+'</p><p class="intro">'+t(tr('The visitor counter has a sneaky bug. Catch it, fix it, then prove the booth is ready to open.','访客计数器有个隐藏故障。找出它、修好它，再证明展位可以开放。','방문객 계수기에 숨은 오류가 있어요. 찾아 고친 뒤 부스를 열어도 되는지 확인하세요.'))+'</p><div class="mission-list"><span>01 · '+t(tr('Catch the bug','找故障','오류 찾기'))+'</span><span>02 · '+t(tr('Fix the code','修代码','코드 고치기'))+'</span><span>03 · '+t(tr('Prove it works','验证结果','동작 확인하기'))+'</span></div></div><form id="welcome" class="welcome-form"><div class="kicker">'+t(tr('60-minute practice','60 分钟练习','60분 연습'))+'</div><h2>'+t(tr('Join the repair crew','加入修理队','수리팀에 합류하기'))+'</h2>'+[['name',tr('Your name','你的名字','이름')],['className',tr('Your class','你的班级','반')],['partner',tr('Partner name (optional)','同伴名字（可选）','짝 이름 (선택)')]].map(([k,l])=>'<label class="field">'+t(l)+'<input name="'+k+'" autocomplete="off" maxlength="60" '+(k==='partner'?'':'required')+' value="'+escape(state[k])+'"></label>').join('')+'<div class="welcome-actions"><button class="primary" type="submit">'+t(tr(state.name?'Continue my practice':'Start the mission',state.name?'继续练习':'开始任务',state.name?'연습 계속하기':'미션 시작하기'))+'</button></div><p class="privacy">'+t(tr('Your practice stays in this browser. The MakeCode project is saved separately.','练习保存在此浏览器。MakeCode 项目需另行保存。','연습 기록은 이 브라우저에 남아요. MakeCode 프로젝트는 따로 저장하세요.'))+'</p></form></section>';
}
function render(focus=false){
 $('language').value=state.lang;$('notice').textContent='';
 $('tools').innerHTML=(active?btn(tr('Back to welcome','回到欢迎页','첫 화면으로'),'welcome')+btn(tr('Download backup','下载备份','백업 다운로드'),'backup'):'')+btn(tr('Load a JSON backup','载入 JSON 备份','JSON 백업 불러오기'),'restore')+'<input id="restore-file" type="file" accept=".json,application/json" hidden>';
 if(!active){$('status-bar').replaceChildren();$('card').innerHTML=welcome();$('pager').hidden=true;return;}
 const c=cards[state.step],done=state.step+1;
 $('status-bar').innerHTML='<div class="progress-meta"><span>'+t(L.stage[c.stage])+'</span><span>'+done+' / '+cards.length+'</span></div><progress class="meter" aria-label="Lesson progress" max="'+cards.length+'" value="'+done+'"></progress>';
 const actions='<div id="actions" class="actions">'+body(c)+'</div>';
 const single=['learning','pitstop','test','challenge','exit'].includes(c.id);
 $('card').innerHTML='<article class="lesson-card"><div class="head"><div class="kicker">'+t(L.stage[c.stage])+'</div><h1 tabindex="-1" id="card-title">'+t(c.title)+'</h1></div><div class="body"><p class="lead">'+t(c.lead)+'</p>'+(c.visual?(single?img(c.visual)+actions:'<div class="panel-grid">'+img(c.visual)+actions+'</div>'):actions)+support(c)+'</div></article>';
 $('pager').hidden=false;$('pager').innerHTML='<span>'+ (state.step?btn(tr('← Back','← 上一步','← 이전'),'prev'):'') +'</span><span class="pager-count">'+t(tr('One step at a time','一次一步','한 번에 한 단계'))+'</span>'+ (state.step<cards.length-1?btn(tr('Next →','下一步 →','다음 →'),'next',true):btn(tr('Finish mission','完成任务','미션 마치기'),'finish',true));
 if(focus){const title=$('card-title');title.focus({preventScroll:true});if(title.getBoundingClientRect().top<0||title.getBoundingClientRect().bottom>innerHeight)title.scrollIntoView({block:'start'});}
}
const gates={setup:'opened',repair:'repair','build-decision':'decision',flash:'pattern',repeat:'loop'};
function move(by){const c=cards[state.step];if(by>0&&gates[c.id]&&!a(gates[c.id])){message(tr('Try this in MakeCode first. Then choose what happened, including “I tried and need help” if you’re stuck.','先在 MakeCode 里尝试。然后选择结果，卡住了可以选“我试过了，需要帮助”。','먼저 MakeCode에서 시도하세요. 결과를 고르고, 막히면 “시도했고 도움이 필요해요”를 선택하세요.'));$('actions').querySelector('button[data-choice]')?.focus();return;}const next=state.step+by;if(next<0||next>=cards.length)return;state.step=next;save();render(true);}
function download(){
 const u=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),el=document.createElement('a');el.href=u;el.download='Gate-Glitch-backup.json';el.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
}
function print(){
 const labels={why:'Starter explanation',before:'Faulty reset: last A',after:'Repaired reset: last A',extension:'Mystery glitch',handover:'Handover'};
 const rows=keys.filter(k=>a(k)).map(k=>{const value=options[k]?.find(x=>x[0]===a(k))?.[1].en|| (results[k]&&resultOptions.find(x=>x[0]===a(k))?.[1].en)||a(k);return '<dt>'+escape(labels[k]||results[k]?.[0].en||({predict:'Starter prediction',focus:'Learning focus',opened:'Starter opened',repair:'Repair attempt',paths:'Decision example',decision:'Decision attempt',pattern:'Single-flash attempt',loop:'Repeat attempt',pit:'Learning Pitstop',route:'Retry or extension',plenary:'Plenary response',saved:'Save status'})[k]||k)+'</dt><dd>'+escape(value)+'</dd>';}).join('');
 $('report').innerHTML='<h1>Gate Glitch · Practice record</h1><p>'+escape(state.name)+' · '+escape(state.className)+(state.partner?' · Partner: '+escape(state.partner):'')+'</p><p>Self-reported practice evidence. The actual program is a separate MakeCode HEX file.</p><h2>My evidence</h2>'+(rows?'<dl>'+rows+'</dl>':'<p>No answers recorded yet.</p>');$('report').hidden=false;window.addEventListener('afterprint',()=>$('report').hidden=true,{once:true});window.print();
}
document.addEventListener('submit',e=>{if(e.target.id!=='welcome')return;e.preventDefault();const data=new FormData(e.target);const profile=Object.fromEntries(['name','className','partner'].map(k=>[k,String(data.get(k)||'').trim().slice(0,60)]));if(!profile.name||!profile.className){message(tr('Enter your name and class.','请输入名字和班级。','이름과 반을 입력하세요.'));return;}if(state.name&&(profile.name!==state.name||profile.className!==state.className)){if(!window.confirm(tr('Start a new practice for this pupil? Download the previous backup first if needed.','开始新的练习？如有需要，请先下载之前的备份。','이 학생의 새 연습을 시작할까요? 필요하면 이전 백업을 먼저 다운로드하세요.')[state.lang]))return;state={...fresh(),lang:state.lang};}Object.assign(state,profile);active=true;save();render(true);});
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.choice){const {choice:k,value:v}=b.dataset;if(!options[k]?.some(o=>o[0]===v))return;state.answers[k]=v;save();const c=cards[state.step];$('actions').innerHTML=body(c);$('actions').querySelector('[data-choice="'+k+'"][data-value="'+v+'"]')?.focus({preventScroll:true});message('');return;}
 switch(b.dataset.action){case'prev':move(-1);break;case'next':move(1);break;case'welcome':active=false;render();break;case'backup':download();break;case'restore':$('restore-file').click();break;case'print':print();break;case'finish':message(tr('Mission complete. Keep your MakeCode file for next time.','任务完成。保留 MakeCode 文件，下次继续用。','미션 완료! 다음을 위해 MakeCode 파일을 보관하세요.'));break;}
});
function capture(e){const k=e.target.dataset.answer;if(keys.includes(k)){const v=e.target.value.slice(0,300);if(a(k)===v)return;state.answers[k]=v;save();if(results[k]&&$('proof-checks'))$('proof-checks').innerHTML=checks();}}
document.addEventListener('input',capture);
document.addEventListener('change',async(e)=>{
 if(e.target.id==='language'){const form=$('welcome');const draft=form&&Object.fromEntries(new FormData(form));state.lang=e.target.value;save();render();if(draft)for(const [k,v] of Object.entries(draft))$('welcome').elements.namedItem(k).value=v;}
 else if(e.target.id==='restore-file'){
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>50000)throw Error('Large file');const next=clean(JSON.parse(await file.text()));if(active&&!window.confirm('Replace the practice on this device with the selected backup?')){e.target.value='';return;}state=next;active=Boolean(state.name&&state.className);save();render(active);message(tr('Backup loaded. Open your HEX in MakeCode separately.','备份已载入。在 MakeCode 另行打开 HEX。','백업을 불러왔어요. MakeCode에서 HEX를 따로 여세요.'));}
  catch{message(tr('That file is not a Gate Glitch JSON backup. Your work has not changed.','这不是 Gate Glitch 的 JSON 备份。现有练习没有改变。','Gate Glitch JSON 백업이 아니에요. 현재 기록은 그대로예요.'));}
 }else capture(e);
});
render();
})();
