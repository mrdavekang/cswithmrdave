window.coverJam = function({day,state,save,esc,pair,main,zh,button,localLink}) {
  const template='https://canva.link/52rfbx2ym420wo9';
  const platform=state.platform||'Scratch';
  const external=(url,label)=>'<a class="btn primary" target="_blank" rel="noopener" href="'+url+'">'+label+' ↗</a>';
  const file=(url,label)=>'<a class="btn" href="'+url+'" download>'+label+'</a>';
  const title=day===1?'Pitch your app':'Build your first prototype';
  const intro=day===1?['Make one shared slide deck with your partner. Choose a real school or community problem. Your proposal is due Wednesday 25 November.','和同伴共用一份幻灯片。选一个学校或社区中的真实问题。提案请于 11 月 25 日星期三前提交。']:['Open your Day 1 proposal at slide 4. Build one action a user can try. Your partner should be able to reset it and try again.','打开第一天提案的第 4 页。做出用户能试用的一个操作，让同伴能重置并再试一次。'];
  const slideSteps=[
    ['Name your app and the people it helps.','写出应用名称和它能帮助的人。'],
    ['Describe one tricky moment for your user. What takes too long or is hard to find?','写出用户遇到困难的一个时刻。什么事太费时或难找到？'],
    ['Choose one action. Finish “When the user …, the app shows …”.','选一个操作，补全“当用户……时，应用显示……”。'],
    ['Sketch the starting screen, the result and the reset. Label the button your user taps.','画出初始界面、操作结果和重置后的界面。标出用户要点的按钮。'],
    ['Choose your tool, divide the jobs and give two checks with the results you expect.','选工具、分工，写出两项测试和预期结果。'],
    ['Imagine a new constraint. Say how you could adapt and which part you would keep.','设想一种新限制。说明如何调整，以及要保留哪个功能。']];
  const steps={
    Scratch:[
      ['Import your copy','导入自己的副本','Download RefillFinder.sb3. Open the Scratch editor. Choose File → Load from your computer. Select the downloaded file.','下载 RefillFinder.sb3。打开 Scratch 编辑器，点 File（文件）→ Load from your computer（从电脑中上传），选刚下载的文件。'],
      ['Try the starter','试用模板','Click the green flag. Click the blue droplet to see a refill location. Click the flag again to reset.','点绿旗，再点蓝色水滴，看到饮水点位置。再点绿旗即可重置。'],
      ['Build your action','制作你的操作','Select the Helper sprite below the stage. In Code, edit the purple say block below the green flag to tell the user what to click. Change the say block below “when this sprite clicked” to your planned result.','选舞台下方的 Helper 角色。在 Code（代码）中修改绿旗下的紫色 say（说）积木，告诉用户点哪里。把“当角色被点击”下面的 say 改成设计的结果。'],
      ['Make it yours','改成自己的设计','Select Title → Costumes. Use the T text tool to change the title to your app name. Edit the Helper costume if your button needs a different picture.','选 Title → Costumes（造型），用 T 文字工具换上应用名。需要的话也可修改 Helper 的图案。'],
      ['Swap and save','交换测试并保存','Ask your partner to try green flag → tap → green flag → tap. Check the result appears twice. Choose File → Save to your computer and keep the .sb3.','让同伴试“绿旗 → 点击 → 绿旗 → 再点”。结果应出现两次。点 File → Save to your computer，保存 .sb3 文件。']],
    MIT:[
      ['Import your copy','导入自己的副本','Download RefillFinder.aia. Sign in with your usual MIT account. In Projects, choose Import project (.aia) from my computer and select the file.','下载 RefillFinder.aia。用平时的 MIT 账号登录。在 Projects 选 Import project (.aia) from my computer，导入文件。'],
      ['Set up the screen','设置界面','In Designer, select TitleLabel in Components. Change Properties → Text to your app name. Change IntroLabel to your audience, ActionButton to your action and ResponseLabel to your starting message.','在 Designer 右边的 Components 选 TitleLabel，在 Properties → Text 填应用名。再改 IntroLabel（用户）、ActionButton（操作）和 ResponseLabel（初始提示）。'],
      ['Make the tap work','设置点击效果','Open Blocks. In when ActionButton.Click, edit the pink text connected to set ResponseLabel.Text. This is the result your partner should see.','打开 Blocks。在 when ActionButton.Click 里，修改连到 set ResponseLabel.Text 的粉色文字。这里写同伴点击后应看到的结果。'],
      ['Make Reset work','设置重置','In when ResetButton.Click, change the pink text to match the starting message on your Designer screen.','在 when ResetButton.Click 中，把粉色文字改成与 Designer 的初始提示一致。'],
      ['Test and export','测试并导出','In Chrome or Edge try Connect → Test in Web. Tap your action → Reset → action again. If the tester will not open, use a classroom iPad with AI Companion if available. Otherwise save the project and record that the live test is pending. Use Projects → Export selected project (.aia) to my computer.','在 Chrome 或 Edge 试 Connect → Test in Web。点操作 → Reset → 再点操作。若打不开，可用课堂 iPad 的 AI Companion。如果两者都不可用，先保存并注明“待实测”。在 Projects 导出所选 .aia 项目。']],
    Other:[
      ['Choose a tool','选择平台','Open a platform your team already knows and create a project with your app name. Keep its editable file or project link.','在团队熟悉的平台中新建项目，用应用名命名。保留可编辑文件或项目链接。'],
      ['Build the starting view','制作初始界面','Use your sketch. Add a title, one control with a clear label, and a place for the result.','照着草图加上标题、一个有清楚标签的控件，以及显示结果的位置。'],
      ['Connect one action','连接一个操作','Make a click, tap or key press show the result from your proposal. Add a way back to the starting view.','让一次点击、轻触或按键显示提案中的结果，再加一个返回初始状态的方法。'],
      ['Hand it to your partner','请同伴试用','Let them try action → reset → action again. Save the editable project and one screenshot of the result.','让同伴试“操作 → 重置 → 再操作”。保存可编辑项目及一张结果截图。']]
  };
  function wrap(title,body){return '<section class="panel"><h2>'+title+'</h2>'+body+'</section>'}
  function checklist(items,key){return '<div class="checks">'+items.map(([en,cn],i)=>'<label><input type="checkbox" data-check="'+key+i+'" '+(state.jamChecks[key+i]?'checked':'')+'><span>'+pair(en,cn)+'</span></label>').join('')+'</div>'}
  const schedule=day===1?'5 min choose a user · 15 min agree on one feature · 25 min sketch and complete slides · 10 min partner review · 5 min save':'5 min reopen the proposal · 10 min try a starter · 25 min build one action · 15 min partner test and improve · 5 min save';
  const scheduleZh=day===1?'5 分钟选用户 · 15 分钟商定功能 · 25 分钟画草图并完成幻灯片 · 10 分钟同伴检查 · 5 分钟保存':'5 分钟看提案 · 10 分钟试模板 · 25 分钟制作 · 15 分钟测试改进 · 5 分钟保存';
  main.innerHTML='<div class="toolbar">'+localLink('#home','Lesson home')+'</div><section class="panel"><p class="kicker">Day '+day+' / Coding Jam</p><h1>'+title+'</h1><p>'+pair(...intro)+'</p><details><summary>60-minute plan</summary>'+pair(schedule,scheduleZh)+'</details></section>';
  if(day===1){
    main.innerHTML+=wrap('Open your team’s template','<p>'+pair('One partner opens the Canva template and signs in. Choose to use the template, rename your copy with your team’s app name, then share that copy with your partner.','一位同伴打开 Canva 模板并登录，选择使用模板，用应用名重命名自己的副本，再共享给同伴。')+'</p><div class="actions">'+external(template,'Use the Canva template')+' '+file('Year9_App_Proposal_Template.pptx','Download editable slides')+'</div><p class="sub">'+pair('If Canva sign-in is unavailable, download the slides and open them in PowerPoint.','若无法登录 Canva，下载幻灯片并用 PowerPoint 打开。')+'</p>');
    main.innerHTML+=wrap('Complete your six slides',checklist(slideSteps.map(([e,z],i)=>['Slide '+(i+1)+' · '+e,'第 '+(i+1)+' 页 · '+z]),'slide'));
    main.innerHTML+=wrap('Ready for Mr Dave?', '<p>'+pair('Swap with your partner. Ask them to point to the user, the button and what changes. Save one shared deck. Give Mr Dave your viewable copy or the PowerPoint file in your class’s cover hand-in. Keep slide 4 for Day 2.','请同伴指出用户、按钮和点击后的变化。保存一份团队提案，在班级代课提交处给老师可查看的链接或 PowerPoint 文件。保留第 4 页供第二天使用。')+'</p>');
  }else{
    main.innerHTML+=wrap('Try one action','<p>'+pair('This starter helps a visitor find water. Try its button. For your own prototype, replace the action and result with the ones on your sketch.','这个示例帮助访客找饮水处。试试按钮，再把操作和结果换成自己草图里的设计。')+'</p><div class="phone"><div class="drop" aria-hidden="true">💧</div><strong>Refill Finder</strong><p id="demoResult" aria-live="polite">Where can I fill my bottle?</p><button id="demoTap" class="primary">Find water</button><button id="demoReset">Reset</button></div>');
    main.innerHTML+=wrap('Choose your platform','<p>'+pair('Choose one. The guide below changes to match your tool. If you missed Day 1, name one user, one button and one result before you start.','选一个平台，下方说明会随之更换。若错过第一天，先决定用户、一个按钮和一个结果。')+'</p><div class="pills">'+['Scratch','MIT','Other'].map(p=>'<button data-platform="'+p+'" aria-pressed="'+(p===platform)+'" class="'+(p===platform?'primary':'')+'">'+({Scratch:'Scratch',MIT:'MIT App Inventor',Other:'Another platform'})[p]+'</button>').join('')+'</div><div class="actions">'+(platform==='Scratch'?file('RefillFinder.sb3','Download Scratch starter')+external('https://scratch.mit.edu/projects/editor/','Open Scratch'):platform==='MIT'?file('RefillFinder.aia','Download MIT starter')+external('https://ai2.appinventor.mit.edu/','Open MIT App Inventor'):'')+'</div>');
    main.innerHTML+=wrap('Build and check your prototype','<div class="checks">'+steps[platform].map(([a,b,e,z],i)=>'<label><input type="checkbox" data-check="'+platform+i+'" '+(state.jamChecks[platform+i]?'checked':'')+'><span><strong>'+pair((i+1)+'. '+a,b)+'</strong>'+pair(e,z)+'</span></label>').join('')+'</div>');
    main.innerHTML+=wrap('Show your result','<p>'+pair('Give your partner the controls. Can they find the button and get the result twice? Keep your editable project or link beside the proposal for Mr Dave. If the class hand-in is available, attach your file or share the link there.','让同伴自己操作。能找到按钮并两次得到结果吗？把可编辑项目或链接与提案一起保存给老师。如果班级提交处已开放，就在那里提交。')+'</p>');
    document.querySelector('#demoTap').onclick=()=>document.querySelector('#demoResult').textContent=zh?'Library entrance · 图书馆入口':'Library entrance';
    document.querySelector('#demoReset').onclick=()=>document.querySelector('#demoResult').textContent='Where can I fill my bottle?';
    main.querySelectorAll('[data-platform]').forEach(b=>b.onclick=()=>{state.platform=b.dataset.platform;save();window.coverJam({day,state,save,esc,pair,main,zh,button,localLink});});
  }
  main.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{state.jamChecks[b.dataset.check]=b.checked;save()});
};
