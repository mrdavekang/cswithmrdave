window.coverJamGuides = function (pair, zh) {
  const media = '../year9-cover-shared/jam-media/';
  const p = (en, cn) => '<p>' + pair(en, cn) + '</p>';
  const situations = [
    ['club','The club has moved','社团换了教室','The poster says Room 12. The door points to Room 18. When would a pupil need the update?','海报上写着 12 室，门上的箭头指向 18 室。学生什么时候最需要知道这个变化？'],
    ['equipment','One tool is missing','器材少了一件','A tray has an empty space. What would help a teacher find the missing tool before class starts?','器材盘里有一个空位。什么能帮助老师在上课前找到缺少的工具？'],
    ['pickup','Two pickup notices','两条接送通知','Both notices say 3:30. One says Gate A and the newer one says Gate B. How could a parent tell which to use?','两条通知都写着 3:30。旧通知写 A 门，新通知写 B 门。家长怎样才能知道该去哪儿？']
  ];
  function scenes() {
    return '<div class="jg-scenes">' + situations.map(([img,en,cn,q,z]) =>
      '<figure><img loading="lazy" src="'+media+img+'.webp" alt=""><figcaption><strong>'+pair(en,cn)+'</strong>'+p(q,z)+'</figcaption></figure>').join('')+'</div>';
  }
  const prompts = {
    idea:['Find a problem worth solving','找出值得解决的问题',
      'We are Year 9 designers. Our user is __. We saw them struggle when __. Ask us two questions, one at a time, about what they do now. After we answer, suggest two small app ideas. For each idea, name one action and what changes on screen. Let us choose.',
      '我们是九年级设计小组，用户是__。我们观察到他们在__时遇到困难。请逐个问我们两个问题，了解他们现在怎么做。等我们回答后，再给出两个小点子，每个只写一个操作和屏幕上的变化，让我们自己选择。'],
    mock:['Picture one tap','把一次点击画出来',
      'Our user needs __. We can already build __ in __. Draft three phone frames for our idea: before the tap, after the tap, and after Reset. Use the button words “__” and the result “__”. Keep labels short. Give a layout we could also sketch on paper. Ask which design choice we would change.',
      '我们的用户需要__。我们已经会用__功能，制作平台是__。请为我们的想法画三个手机画面：点击前、点击后、重置后。按钮写“__”，结果写“__”。标签简短，布局也要方便用纸笔画。最后问我们想改哪项设计。'],
    build:['Make the build fit','缩小制作范围',
      'Our user is __. Our sketch promises __. We use __ and can already __. For a two-hour jam rehearsal, suggest the smallest feature we could demonstrate by minute 65 and one extra we could drop. Give our partner one realistic job to try. Leave the test result blank for us to observe.',
      '我们的用户是__，草图承诺实现__。我们用__，已经会__。请为两小时的模拟创作活动建议一个能在第 65 分钟前演示的最小功能，并指出一项可以删掉的额外功能。给同伴一个真实的试用任务，把测试结果留空，让我们自己观察。']
  };
  function prompt(key) {
    const [name,cn,en,z]=prompts[key];
    const box=(txt,lang)=>'<div class="jg-copy"><p lang="'+lang+'">'+txt+'</p><button type="button" data-copy-prompt>'+ (lang==='en'?'Copy English prompt':'复制中文提示词')+'</button><span role="status"></span></div>';
    return '<details class="jg-prompt"><summary>'+pair('Optional AI · '+name,'可选 AI · '+cn)+'</summary>'+box(en,'en')+(zh?box(z,'zh-Hans'):'')+'</details>';
  }
  const frames=[
    ['Before the tap','点击前','Trip pickup','校外活动接送','See latest gate','查看最新校门','Circle the control the parent will tap.','圈出家长要点击的按钮。'],
    ['After the tap','点击后','3:30 · Gate B','3:30 · B 门','Updated 2:45','2:45 更新','Keep the time. Show the new gate and when it changed.','保留接送时间，显示新校门和更新时间。'],
    ['After Reset','重置后','Trip pickup','校外活动接送','See latest gate','查看最新校门','Return to the first view so another parent can try.','回到初始画面，让下一位家长也能试用。']
  ];
  function storyboard(){
    return '<div class="jg-model"><h3>'+pair('Pickup update · one worked example','接送通知 · 一个示例')+'</h3>'+p('The trip leader updates the gate. A parent wants the latest place and time. Pick a view to see the same plan on paper or on screen.','带队老师更新校门。家长需要确认最新地点和时间。选择纸笔版或屏幕版，比较同一设计。')+
      '<div class="pills">'+[['paper','Paper sketch','纸笔草图'],['digital','Digital mock-up','电子原型']].map(([id,en,cn],i)=>'<button type="button" data-medium="'+id+'" aria-pressed="'+(!i)+'">'+pair(en,cn)+'</button>').join('')+'</div>'+
      '<div class="jg-frames" data-style="paper">'+frames.map(([en,z,title,tz,word,wz,note,nz],i)=>'<figure><b>'+pair(en,z)+'</b><div class="jg-screen"><span aria-hidden="true" class="jg-speaker"></span><strong>'+pair(title,tz)+'</strong><span class="jg-screen-label">'+pair(word,wz)+'</span>'+(i===1?'<small>'+pair('↶ Reset','↶ 重置')+'</small>':'')+'</div><figcaption>'+pair(note,nz)+'</figcaption></figure>').join('')+'</div>'+
      p('Your turn on slide 4. Use your own user and labels. A photo of three pencil boxes with arrows works just as well as a digital mock-up.','轮到你了。在第 4 页使用自己的用户和标签。纸上画三个方框，加箭头后拍照，就能清楚展示设计，也可以使用电子原型。')+'</div>';
  }
  const researchParts=[
    ['⛵','Steer','驾驶','Reach the island','抵达小岛'],
    ['🖌️','Drag','拖动','Draw a line','画出线条'],
    ['▦','Shake','摇动','7 → 8','7 → 8'],
    ['☷','Add an item','添加物品','List gains a row','清单多一行']
  ];
  function research(i){
    const [icon,a,b,c,d]=researchParts[i];
    const label=(en,cn)=>zh?en+' / '+cn:en;
    const previews=[
      '<div class="jg-course"><span data-boat>⛵</span><span>🏝️</span></div><button type="button" data-steer>'+pair('Steer towards island','向小岛行驶')+'</button>',
      '<canvas class="jg-pad" width="440" height="104" aria-label="'+label('Try drawing a line','试着画线')+'"></canvas><button type="button" data-stroke>'+pair('Try a stroke','试画一笔')+'</button> <button type="button" data-wipe>'+pair('Wipe','擦除')+'</button>',
      '<output class="jg-led">7</output><button type="button" data-shake>'+pair('Simulate a shake','模拟摇动')+'</button>',
      '<div class="jg-list"><input type="text" maxlength="30" aria-label="'+label('Item to add','要添加的物品')+'" value="'+label('Cable','线缆')+'"><button type="button" data-add>'+pair('Add','添加')+'</button></div><ul data-items></ul>'
    ];
    return '<div class="jg-research r'+i+'"><span aria-hidden="true">'+icon+'</span><b>'+pair(a,b)+'</b><i aria-hidden="true">→</i><strong>'+pair(c,d)+'</strong></div><div class="jg-preview"><small>'+pair('Try the idea here','在这里试试这个功能')+'</small>'+previews[i]+'<span role="status" class="jg-status"></span></div>';
  }
  function photo(img,en,cn){return '<figure class="jg-photo"><a target="_blank" rel="noopener" href="'+media+img+'.webp"><img loading="lazy" src="'+media+img+'.webp" alt="'+(zh?cn:en)+'"></a><figcaption>'+pair(en,cn)+'</figcaption></figure>';}
  function guide(platform,step){
    if(platform==='Scratch'){
      if(step===0)return photo('scratch-file','① Open File and choose Load from your computer. When you finish, return here and choose Save to your computer.','① 打开 File，选择 Load from your computer。完成后回到这里，选择 Save to your computer。');
      if(step===4)return photo('scratch-try','Left, the flag shows the starting instruction. Right, clicking the droplet gives the location. Click the flag to return to the left view.','左图：点绿旗显示开始提示。右图：点水滴显示地点。再点绿旗，回到左图状态。');
      if(step===1)return photo('scratch-workspace','① Start with the flag. ② Click the droplet on the stage. ③ Select Helper below the stage to find its code.','① 点绿旗开始。② 点击舞台上的水滴。③ 在舞台下方选中 Helper，找到它的代码。');
      if(step===2)return photo('scratch-code','① Type the starting instruction in the top white field. ② Put your result in the lower white field. Keep both purple say blocks attached.','① 在上方白框输入开始提示。② 在下方白框写点击后的结果。两块紫色 say 积木都要保持连接。');
    }
    if(platform==='MIT'){
      if(step===0)return photo('mit-menu','① Under Projects select Import project (.aia) from my computer. Choose RefillFinder.aia from Downloads.','① 打开 Projects，点 Import project (.aia) from my computer，从下载文件夹选择 RefillFinder.aia。');
      if(step===1)return photo('mit-designer','① Select ActionButton in Components. ② Change its Text in Properties. ③ Check the new words on the phone.','① 在 Components 选 ActionButton。② 在 Properties 修改 Text。③ 在手机预览查看新按钮文字。');
      if(step===2)return photo('mit-blocks','① Find ActionButton.Click. ② Edit the pink text beside ResponseLabel.Text. Your button will show these words.','① 找到 ActionButton.Click。② 修改 ResponseLabel.Text 旁的粉色文字。点击按钮时会显示这句话。');
      if(step===3)return p('Copy the starting instruction from Designer into the pink text in ResetButton.Click. Look at the lower stack in the picture above.','从 Designer 复制初始提示，填进 ResetButton.Click 的粉色文字框。它在上图的下一组积木中。');
    }
    if(platform==='Other'&&step===2)return storyboard();
    return '';
  }
  function testStrip(){return '<div class="jg-test">'+[['①','Give a goal','给出任务','“Show me where to collect the pupil.” Hand over the device.','“请找出接学生的地点。”把设备交给同伴。'],['②','Watch the first try','观察第一次尝试','Which gate did they choose? Did they ask for a hint? Write what happened.','对方选了哪个门？需要提示吗？记录实际情况。'],['③','Change and retry','修改后再试','Change one label. Reset. Ask the same question and record the second result.','改一个标签，重置，再问同一个问题，记录第二次的结果。']].map(([n,en,z,q,qz])=>'<div><b>'+n+' '+pair(en,z)+'</b>'+p(q,qz)+'</div>').join('')+'</div>';}
  function bind(main){
    const boat=main.querySelector('[data-steer]');
    if(boat){let sailed=false;boat.onclick=()=>{sailed=!sailed;boat.parentElement.querySelector('[data-boat]').classList.toggle('at-island',sailed);boat.textContent=sailed?(zh?'Try again / 再试':'Try again'):(zh?'Steer towards island / 向小岛行驶':'Steer towards island');boat.parentElement.querySelector('[role=status]').textContent=sailed?(zh?'At the island · 已到达小岛':'At the island'):'';};}
    const pad=main.querySelector('.jg-pad');
    if(pad){
      const ctx=pad.getContext('2d');ctx.lineWidth=5;ctx.strokeStyle='#a32660';ctx.lineCap='round';
      const coords=e=>{const r=pad.getBoundingClientRect();return [(e.clientX-r.left)*pad.width/r.width,(e.clientY-r.top)*pad.height/r.height];};
      pad.onpointerdown=e=>{pad.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(...coords(e));};
      pad.onpointermove=e=>{if(pad.hasPointerCapture(e.pointerId)){ctx.lineTo(...coords(e));ctx.stroke();}};
      main.querySelector('[data-stroke]').onclick=()=>{ctx.beginPath();ctx.moveTo(25,82);ctx.bezierCurveTo(125,-70,210,160,360,28);ctx.stroke();};
      main.querySelector('[data-wipe]').onclick=()=>ctx.clearRect(0,0,pad.width,pad.height);
    }
    const shake=main.querySelector('[data-shake]');
    if(shake)shake.onclick=()=>{const out=shake.previousElementSibling;out.value=String(Number(out.value)+1);};
    const add=main.querySelector('[data-add]');
    if(add){const input=add.previousElementSibling;add.onclick=()=>{if(!input.value.trim())return;const ul=add.parentElement.nextElementSibling,li=document.createElement('li'),del=document.createElement('button');li.textContent=input.value.trim()+' ';del.type='button';del.textContent=zh?'Remove / 移除':'Remove';del.onclick=()=>li.remove();li.append(del);ul.append(li);input.value='';input.focus();};input.onkeydown=e=>{if(e.key==='Enter')add.click();};}
    const frames=main.querySelector('.jg-frames');
    main.querySelectorAll('[data-medium]').forEach(b=>b.onclick=()=>{
      frames.dataset.style=b.dataset.medium;main.querySelectorAll('[data-medium]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    });
    main.querySelectorAll('[data-copy-prompt]').forEach(b=>b.onclick=async()=>{
      const para=b.previousElementSibling, status=b.nextElementSibling;
      try {await navigator.clipboard.writeText(para.textContent);status.textContent=zh?'Copied · 已复制':'Copied';}
      catch{const range=document.createRange();range.selectNodeContents(para);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);status.textContent=zh?'Text selected. Choose Copy. · 已选中文字，请复制。':'Text selected. Choose Copy.';}
    });
  }
  return { scenes, prompt, storyboard, research, guide, testStrip, bind };
};
