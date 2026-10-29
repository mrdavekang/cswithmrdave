/* Local teaching visuals. No student work is embedded in screenshots. */
window.RouteVisual = (() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const assets={
    anatomy:{file:'list-anatomy.svg',alt:'A list named colours, with RED at index 0, BLUE at index 1 and GREEN at index 2. Quotes enclose text; commas separate elements.'},
    create:{file:'editor-create.png',alt:'Actual lesson editor. The colours list and print instruction are typed in the white code area; Run executes them; the dark output area displays the complete list.'},
    read:{file:'editor-read.png',alt:'Actual lesson editor running colours RED BLUE GREEN followed by print(colours[1]). The console displays BLUE.'},
    update:{file:'editor-update.png',alt:'Actual lesson editor running colours RED BLUE GREEN, colours[1] equals GOLD, then print(colours). The console displays RED GOLD GREEN.'},
    trace:{file:'trace-example.svg',alt:'Print before an update displays RED BLUE GREEN. After colours[1] becomes GOLD, the next print displays RED GOLD GREEN. The earlier printed line stays unchanged.'},
    copy:{file:'copy-example.svg',alt:'In colours[0] = colours[2], read the source at index 2, then replace the destination at index 0. The source remains unchanged. The result is GREEN BLUE GREEN.'},
    teams:{file:'teams-mobile-turn-in.jpg',alt:'Microsoft sample Teams mobile assignment screen. Attach is below My work; Turn in is in the top-right. The example class and assignment are not this lesson.'},
    report:{file:'save-report.png',alt:'Actual lesson report controls: Download full PDF report, Backup progress and Download current Python file.'}
  };
  const arrow={UP:'M24 43V10M10 24L24 10L38 24',DOWN:'M24 5V38M10 24L24 38L38 24',LEFT:'M43 24H10M24 10L10 24L24 38',RIGHT:'M5 24H38M24 10L38 24L24 38'};
  const colours={RED:'#ad3543',BLUE:'#3266b1',GREEN:'#2c8060',GOLD:'#bb8d12'};
  function list(values,highlight){
    return '<div class="route-visual study-reference" data-no-copy role="list" aria-label="List elements and indexes">'+values.map((v,i)=>'<div role="listitem" class="route-cell '+(i===highlight?'highlight':'')+'"><small>INDEX <b>'+i+'</b></small>'+(arrow[v]?'<svg class="direction-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="'+arrow[v]+'"/></svg>':colours[v]?'<svg class="colour-icon" viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="12" fill="'+colours[v]+'"/></svg>':'<span class="unknown-value" aria-hidden="true">?</span>')+'<strong>'+esc(v)+'</strong><span class="position-name">'+['first','second','third'][i]+' element</span></div>').join('')+'</div>';
  }
  function translations(zh,ko,ui){return ui.support({zh,ko});}
  const guideLanguage={
    anatomy:['列表名是 colours。元素是 RED、BLUE、GREEN，索引依次为 0、1、2。引号包住文本，逗号分隔元素，方括号包住整个列表。','리스트 이름은 colours예요. RED, BLUE, GREEN의 인덱스는 0, 1, 2예요. 따옴표는 문자열을 감싸고, 쉼표는 요소를 나누고, 대괄호는 리스트를 감싸요.'],
    trace:['从上到下读代码。第一次 print 显示更新前的列表；第二次显示更新后的列表。后来的更新不会改变已经输出的第一行。','위에서 아래로 읽으세요. 첫 print는 갱신 전, 다음 print는 갱신 후 리스트를 보여 줘요. 나중에 바꿔도 이미 출력한 첫 줄은 바뀌지 않아요.'],
    copy:['先读取等号右边的索引 2，再把这个值存到左边的索引 0。来源位置不变，这叫复制，不是交换。','먼저 = 오른쪽 인덱스 2의 값을 읽고 왼쪽 인덱스 0에 넣어요. 읽은 원래 값은 유지돼요. 교환이 아니라 복사예요.'],
    report:['点击 Download full PDF report。下载后还需要在 Teams 作业中附加 PDF 并点击 Turn in。','Download full PDF report를 누르세요. 내려받은 뒤 Teams 과제에 PDF를 첨부하고 Turn in을 눌러야 해요.'],
    teams:['这是微软示例界面，不是本班作业。在自己的班级作业中，先点击 Attach 附加 PDF，再点击 Turn in 提交。','이 화면은 Microsoft 예시이며 내 반 과제가 아니에요. 내 과제에서 Attach로 PDF를 첨부하고 Turn in을 눌러 제출하세요.']
  };
  function marks(key){
    if(['create','read','update'].includes(key))return '<svg class="screenshot-outlines" viewBox="0 0 510 472" aria-hidden="true"><rect x="40" y="51" width="458" height="99" rx="5"/><rect x="5" y="275" width="78" height="44" rx="7"/><rect x="6" y="362" width="493" height="89" rx="6"/></svg><span class="screenshot-mark code-mark">1</span><span class="screenshot-mark run-mark">2</span><span class="screenshot-mark output-mark">3</span>';
    if(key==='teams')return '<svg class="screenshot-outlines teams-outlines" viewBox="0 0 522 1081" aria-hidden="true"><rect x="25" y="717" width="110" height="47" rx="8"/><rect x="415" y="31" width="94" height="46" rx="8"/></svg>';
    if(key==='report')return '<svg class="screenshot-outlines" viewBox="0 0 930 44" aria-hidden="true"><rect x="2" y="2" width="202" height="40" rx="8"/></svg>';
    return '';
  }
  function figure(key,title,caption,ui){
    const a=assets[key];if(!a)return '';
    return '<figure class="visual-guide study-reference" data-no-copy><figcaption><strong>'+esc(title)+'</strong><span>'+esc(caption)+'</span></figcaption><button type="button" class="visual-open" data-visual-zoom="'+key+'" aria-label="Enlarge '+esc(title)+'"><span class="screenshot-wrap"><img src="assets/visuals/'+a.file+'" alt="'+esc(a.alt)+'" loading="lazy" draggable="false">'+marks(key)+'</span><span class="enlarge-label">Enlarge guide ↗</span></button>'+(['create','read','update'].includes(key)?'<ol class="screen-legend"><li><b>1</b> Type in the white code area.</li><li><b>2</b> Press Run.</li><li><b>3</b> Read the dark output area.</li></ol>'+translations('1 在白色代码区输入；2 点击 Run；3 在深色区域读结果。图片只是示例，请在下方自己的编辑器输入。','1 흰색 코드 칸에 입력 → 2 Run → 3 어두운 출력 칸 확인. 이 사진은 예시이며 내 코드는 실제 편집기에 입력하세요.',ui):guideLanguage[key]?translations(...guideLanguage[key],ui):'')+'</figure>';
  }
  function parseList(line){try{const value=JSON.parse(line.replace(/^Test \d+:\s*/, '').replace(/'/g,'"'));return Array.isArray(value)&&value.length===3?value:null;}catch{return null;}}
  function targetValues(c,r){return c.rule.custom?[r.target?.first||'?', 'RIGHT', r.target?.third||'?']:parseList(c.expected.at(-1)||'')||c.rule.route||null;}
  function target(c,r,ui){
    const final=targetValues(c,r),creating=c.id==='m1-1',reading=c.stage==='main1'&&!creating||c.id==='e3',initial=c.rule.start||c.values;
    let body='<div><h4>'+(creating?'Route to create':c.id==='e2'?'Starting routes · choose different middle values':'Starting data')+'</h4>'+list(initial,c.highlight)+'</div>';
    if(final&&!reading&&!creating)body+='<div><h4>'+(c.id==='e2'?'Both examples must reach this target':c.id==='e5'?'Test 1 target · Test 2 is shown below':'Target stored list')+'</h4>'+list(final)+'</div>';
    else if(reading)body+='<p class="unchanged-note">READ ONLY · Keep the stored list unchanged.</p>'+translations('只读取，不修改列表。把输出顺序和存储顺序分开看。','읽기만 하세요. 저장 리스트는 바꾸지 않아요. 출력 순서와 저장 순서는 다를 수 있어요.',ui);
    if(c.id==='e2')body+='<p>Two different starting lists → one final target. Only the original middle values differ.</p>'+translations('两个不同的起始列表得到同一个目标。只有原来的中间值不同。','서로 다른 시작 리스트가 같은 목표에 도달해요. 원래 가운데 값만 서로 다르게 하세요.',ui);
    if(c.id==='e3')body+='<div class="signal-order"><b>Output order</b><span>third → first → third → second</span></div>';
    if(c.id==='e5')body+='<div><h4>Test 2 starting data</h4>'+list(['LEFT','DOWN','UP'])+'<h4>Test 2 target</h4>'+list(['UP','DOWN','UP'])+'</div>';
    if(c.id==='e1')body+='<div class="trace-slots"><span>1 · after first update</span><span>2 · after second update</span><span>3 · after third update</span></div>';
    return '<section class="task-picture study-reference" data-no-copy aria-label="Task starting data and target"><span class="eyebrow">LOOK AT YOUR TARGET</span>'+body+'</section>';
  }
  function screenshotFor(c){return c.id==='m1-1'?'create':c.id==='m1-2'?'read':c.id==='m2-1'?'update':null;}
  function smallPattern(c,ui){
    if(['m2-5','m2-6','e1'].includes(c.id))return figure('trace','Follow each instruction in order','Worked example with colours — adapt the idea to your route.',ui);
    if(['e4','e5'].includes(c.id))return figure('copy','Read the source; replace the destination','Worked example with colours — this is copying, not swapping.',ui);
    if(c.stage==='main2')return '<div class="update-model study-reference" data-no-copy><b>REFERENCE · DIFFERENT DATA</b><h4>Before</h4>'+list(['RED','BLUE','GREEN'],1)+'<code>colours[1] = "GOLD"</code><h4>After</h4>'+list(['RED','GOLD','GREEN'],1)+'<p>One replacement. Still three elements.</p>'+translations('只替换一项，仍然是三项。','하나만 바꾸고 요소는 여전히 세 개예요.',ui)+'</div>';
    return '';
  }
  function enhance(c,r,ui){
    const content=document.getElementById('content');
    content.querySelectorAll('.expected,.reference,.demo-grid,.learning-type code,.route-visual,#hint pre,#hint p').forEach(el=>{el.dataset.noCopy='';el.classList.add('study-reference');});
    if(c.type==='mission'){
      content.querySelector('.wide-reading').insertAdjacentHTML('afterbegin','<figure class="mission-art"><img src="assets/visuals/route-rescue-mission.png" alt="A friendly astronaut checks three direction tiles on a spaceship navigation console." draggable="false"><figcaption>Mission story · Your Python program prints instructions. It does not move this spaceship.</figcaption></figure>');
      content.querySelector('.instruction-list').insertAdjacentHTML('afterend',figure('create','Where you will type and run','Real editor screenshot · the colours program is an example, not your route task.',ui));
    }
    if(c.id==='dn1')content.querySelector('.wide-reading').insertAdjacentHTML('afterbegin',figure('anatomy','A list: name, elements and indexes','Read this example before finding the direction in the question.',ui));
    if(c.type==='coding'){
      const pane=content.querySelector('.instruction-pane'),old=pane.querySelector('.route-visual');if(old)old.remove();
      const taskHeading=pane.querySelector('h3');taskHeading.insertAdjacentHTML('beforebegin',target(c,r,ui));
      const expected=pane.querySelector('.expected');expected.classList.add('console-target');
      expected.insertAdjacentHTML('beforeend','<p class="type-reminder">Look here. Type Python in <b>Your code</b> — not in this target.</p>'+translations('这里是输出目标，不是要粘贴的代码。请在 Your code 里输入 Python。','여기는 출력 목표예요. 붙여 넣을 코드가 아니에요. Your code에 Python을 입력하세요.',ui));
      const ref=pane.querySelector('.reference'),shot=screenshotFor(c);
      if(shot)ref.insertAdjacentHTML('beforeend',figure(shot,'Real Python example · colours','Compare its code with its output. Use your own route values for the task.',ui));
      else ref.insertAdjacentHTML('afterend',smallPattern(c,ui));
      if(c.id==='m1-1')content.querySelector('.workspace-grid').insertAdjacentHTML('beforebegin',figure('anatomy','Build a list with three elements','Use the same punctuation pattern, with the directions in your task.',ui));
      content.querySelector('.editor-top>span').innerHTML='<span class="live-step">1</span> YOUR CODE · route.py';
      content.querySelector('#run').innerHTML='<span class="live-step">2</span> ▶ Run';
      content.querySelector('.console-head').innerHTML='<span class="live-step">3</span> YOUR OUTPUT · RUN STARTS AT LINE 1';
      pane.insertAdjacentHTML('beforeend','<p class="typing-note">Typing practice: examples and targets are view-only. Copy/paste still works inside your own editor.</p>'+translations('键盘练习：示例和目标不能直接复制；你自己的编辑器仍可复制和粘贴。','타자 연습: 예시와 목표는 보기 전용이에요. 내 편집기에서는 복사·붙여넣기를 쓸 수 있어요.',ui));
    }
    if(c.type==='report')content.querySelector('.save-guide').insertAdjacentHTML('beforeend',submission(ui));
    content.querySelectorAll('img').forEach(img=>img.draggable=false);
  }
  function refreshTarget(c,r,ui){const old=document.querySelector('.task-picture');if(old)old.outerHTML=target(c,r,ui);}
  function submission(ui){return '<div class="submission-visuals">'+figure('report','1 · Download your report','Actual lesson controls. A PDF download is not a Teams submission.',ui)+figure('teams','2 · Attach the PDF, then Turn in','Microsoft sample mobile screen — use your own class and teacher-named assignment. Laptop controls may be in different places.',ui)+translations('Teams 图片是微软示例，不是本班作业。在自己班级的正确作业中，先附加 PDF，再点击 Turn in。','Teams 사진은 Microsoft 예시예요. 내 반의 안내된 과제에서 PDF를 첨부한 뒤 Turn in을 누르세요.',ui)+'</div>';}
  function zoom(key,ui={support:()=>''}){const a=assets[key];if(!a)return '';return '<div class="zoomed-guide study-reference" data-no-copy><h2>Guide · not your editable workspace</h2><span class="screenshot-wrap"><img src="assets/visuals/'+a.file+'" alt="'+esc(a.alt)+'" draggable="false">'+marks(key)+'</span><p>'+esc(a.alt)+'</p>'+(guideLanguage[key]?translations(...guideLanguage[key],ui):['create','read','update'].includes(key)?translations('1 在白色代码区输入；2 点击 Run；3 在深色区域读结果。图片只是示例，请在自己的编辑器输入。','1 흰색 코드 칸에 입력 → 2 Run → 3 출력 칸 확인. 사진은 예시예요. 내 코드는 실제 편집기에 입력하세요.',ui):'')+'<p>Close this guide to return to your own work.</p></div>';}
  function installCopyGuard(doc,notify){
    const editable=el=>el?.closest?.('input,textarea,[contenteditable="true"]');
    const isProtected=e=>{
      if(editable(e.target)||editable(doc.activeElement))return false;
      if(e.target?.closest?.('[data-no-copy]'))return true;
      const s=doc.getSelection?.();if(!s?.rangeCount||s.isCollapsed)return false;
      for(let i=0;i<s.rangeCount;i++){const range=s.getRangeAt(i);for(const el of doc.querySelectorAll('[data-no-copy]')){try{if(range.intersectsNode(el))return true;}catch{}}}
      return false;
    };
    for(const type of ['copy','cut','dragstart'])doc.addEventListener(type,e=>{if(!isProtected(e))return;e.preventDefault();if(type==='copy'||type==='cut'){e.clipboardData?.setData('text/plain','');notify('Look at the example, then type your own Python. Copy/paste is available in your own editor.');}},true);
    doc.addEventListener('selectstart',e=>{if(!editable(e.target)&&e.target?.closest?.('[data-no-copy]'))e.preventDefault();},true);
  }
  return {assets,list,figure,parseList,targetValues,target,enhance,refreshTarget,submission,zoom,installCopyGuard};
})();
