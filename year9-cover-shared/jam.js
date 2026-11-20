window.coverJam = function({day,state,save,esc,pair,main,zh,button,localLink}) {
  const visuals=window.coverJamGuides(pair,zh);
    const research = [
      ['Scratch','Boat Race','Steer a boat to the island. Watch what happens when it hits an obstacle.','把船开到岛上，观察撞到障碍物时会发生什么。','Could a player guide a new pupil safely through a school map?','能否用这种操作，让玩家带新同学走过校园地图？','https://projects.raspberrypi.org/en/projects/boat-race'],
      ['MIT App Inventor','PaintPot','Choose a colour, then drag across the canvas. The app draws where your finger moves.','选颜色，再在画布上拖动。线条会随着手指移动。','Could a visitor mark a meeting spot on a map?','能否让访客在地图上标出集合点？','https://appinventor.mit.edu/explore/ai2/paintpot-part1'],
      ['MakeCode / micro:bit','Step counter','A shake adds one to a counter and shows the new number. The tutorial includes a simulator option.','摇动一次，计数加一并显示新数字。教程也提供模拟器选项。','Could a team track activity breaks using the same counter?','能否用相同的计数功能记录活动休息次数？','https://microbit.org/projects/make-it-code-it/step-counter/'],
      ['HTML / JavaScript','Dynamic shopping list','Type an item and add it. Look for the new row and the button that removes it.','输入物品并添加，看看新出现的一行和删除按钮。','Could a teacher build a kit list and remove each item as it is packed?','老师能否制作器材清单，每装好一件就移除一项？','https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting#creating_a_dynamic_shopping_list']
    ];
  const exampleCards=()=>research.map(([tool,name,en,cn,idea,ideaZh,url],i)=>'<article class="jam-example"><span class="kicker">'+esc(tool)+'</span><h3>'+esc(name)+'</h3>'+visuals.research(i)+'<p>'+pair(en,cn)+'</p><p>'+pair(idea,ideaZh)+'</p>'+external(url,zh?'研究项目 / Explore':'Explore project')+'</article>').join('');

  const template='https://canva.link/x9kt12ms14w77us';
  let prior;
  if(day===2){try{prior=JSON.parse(localStorage.getItem('y9-cover-arcade-v1-day1')||'null')}catch{}}
  const planned=prior?.jamTool==='Another school-approved platform'?prior.jamOtherTool:prior?.jamTool;
  const plannedGuide=planned==='MIT App Inventor'?'MIT':planned==='Scratch'?'Scratch':'Other';
  const platform=state.jamGuideChosen ? state.platform : planned ? plannedGuide : state.platform||'Scratch';
  const external=(url,label)=>'<a class="btn primary" target="_blank" rel="noopener" href="'+url+'">'+label+' ↗</a>';
  const file=(url,label)=>'<a class="btn" href="'+url+'" download>'+label+'</a>';
  const title=day===1?'Pitch your app':'Build your first prototype';
  const intro=day===1?['Make one shared slide deck with your partner. Choose a real school or community problem. Your proposal is due Wednesday 25 November.','和同伴共用一份幻灯片。选一个学校或社区中的真实问题。提案请于 11 月 25 日星期三前提交。']:['Bring slides 1, 3 and 4 of your Day 1 proposal. Use your chosen platform and concept. Build one action a user can try. Your partner should be able to reset it and try again.','打开第一天提案的第 1、3、4 页，使用已选的平台和设计。做出用户能试用的一个操作，让同伴能重置并再试一次。'];
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
  const viewpoints = {
    student: {
      name:['Student','学生'],
      moment:['A new pupil finds the art club on a poster, walks to the room, then discovers it has moved. What information did they need before they set off?','新同学在海报上找到美术社，走到教室才发现地点换了。出发前，他们需要知道什么？'],
      check:['Give a partner a poster and a sample update. Can they find the correct room? Then try your prototype. Check the room they choose and whether they need a hint.','给同伴一张海报和一条示例更新，请对方找出正确教室；再用原型试一次。记录选择的教室及是否需要提示。']
    },
    teacher: {
      name:['Teacher','老师'],
      moment:['A teacher setting up a practical finds an empty equipment tray. They check three cupboards while the class waits. What would help them decide what to do next?','老师准备实践课时发现器材盘空了。全班等着，老师要查看三个柜子。什么信息能帮助老师决定下一步？'],
      check:['Give a partner a sample kit list with one item missing. Can they spot what to replace before the lesson? Try the same job in your prototype. Who would keep that list up to date?','给同伴一份缺少一件器材的清单，看能否在上课前找出缺什么。再用原型完成相同任务。谁负责更新清单？']
    },
    parent: {
      name:['Parent or carer','家长或照护者'],
      moment:['A parent has two messages about a trip. One gives the original pickup time. The other changes the gate. Which details could they easily mix up?','家长收到两条校外活动通知：一条写原定接送时间，另一条更改校门。哪些信息容易混淆？'],
      check:['Make two fictional notices. Ask a partner to tell you when and where to collect a child. Try again with the prototype. Did they get both details right?','编两条虚构通知，让同伴说出接送时间和地点。用原型再试一次。两项都答对了吗？']
    },
    other: {
      name:['Someone else','其他人'],
      moment:['Think of a person you have seen asking for help. What were they trying to finish? At which step did they stop?','想想你见过的一位求助者。对方想完成什么事？卡在哪一步？'],
      check:['Give your partner the same goal before and after. What observable action would show that your idea helped?','请同伴用原方法和原型分别完成同一目标。哪一个看得见的动作能说明设计有帮助？']
    }
  };
  const need = {...(day===2 ? prior?.jamNeed : {}), ...state.jamNeed};
  const benefit = state.jamBenefit || {};
  function noteField(group,key,en,cn,value){
    return '<label class="jam-note">'+pair(en,cn)+'<textarea rows="2" maxlength="750" data-group="'+group+'" data-note="'+key+'">'+esc(value||'')+'</textarea></label>';
  }
  function example(role){
    const v=viewpoints[role];
    if(!v)return '';
    return '<strong>'+pair('One possible situation','一个可参考的情境')+'</strong><p>'+pair(...v.moment)+'</p><strong>'+pair('One way to check','一种测试方法')+'</strong><p>'+pair(...v.check)+'</p>';
  }
  function teamPlan(){
    const options=Object.entries(viewpoints).map(([key,v])=>'<option value="'+key+'" '+(key===need.role?'selected':'')+'>'+esc(zh?v.name.join(' / '):v.name[0])+'</option>').join('');
    return '<label class="jam-note">'+pair('Who will you design for?','你们想帮助谁？')+'<select id="jam-user"><option value="">'+(zh?'请选择 / Choose':'Choose a user')+'</option>'+options+'</select></label>'+
      '<div id="jam-user-example" class="jam-user-example" '+(viewpoints[need.role]?'':'hidden')+'>'+example(need.role)+'</div>'+
      noteField('need','today','What do they do today? Describe the moment and where it gets difficult.','他们现在怎样做？写出具体情境，以及卡在哪一步。',need.today)+
      noteField('need','change','Which one action in your app would help? What will they see or be able to do next?','应用里的哪个操作能帮忙？之后他们会看到什么，或能做什么？',need.change)+
      noteField('need','proof','What will you watch for? Choose one sign: a correct answer, fewer steps, or finishing without a hint.','要观察什么？选一个迹象：答对、步骤变少，或不靠提示完成。',need.proof);
  }
  function briefSummary(){
    const rows=[['Today','现状',need.today],['Our change','设计的改变',need.change],['Watch for','观察什么',need.proof]];
    if(viewpoints[need.role])rows.unshift(['User','用户',zh?viewpoints[need.role].name.join(' / '):viewpoints[need.role].name[0]]);
    const items=rows.filter(row=>row[2]).map(([en,cn,value])=>'<dt>'+pair(en,cn)+'</dt><dd>'+esc(value)+'</dd>').join('');
    return items?'<dl class="jam-brief-summary">'+items+'</dl>':'';
  }
  function connectNotes(){
    const select=main.querySelector('#jam-user');
    function refreshSummary(){const summary=main.querySelector('#jam-need-summary');if(summary)summary.innerHTML=briefSummary()}
    select.onchange=()=>{
      need.role=select.value;state.jamNeed={...state.jamNeed,role:need.role};save();
      const panel=main.querySelector('#jam-user-example');
      panel.innerHTML=example(need.role);panel.hidden=!viewpoints[need.role];refreshSummary();
    };
    main.querySelectorAll('[data-note]').forEach(input=>{
      input.oninput=()=>{
        const key=input.dataset.note;
        if(input.dataset.group==='need'){need[key]=input.value;state.jamNeed={...state.jamNeed,[key]:input.value};refreshSummary()}
        else{benefit[key]=input.value;state.jamBenefit=benefit}
        save();
      };
    });
  }
  const schedule=day===1?'5 min brief and user · 12 min research · 8 min choose a platform · 12 min concept · 8 min team skills · 10 min build plan · 5 min review and save':'5 min reopen the proposal · 10 min try a starter · 25 min build one action · 15 min partner test and improve · 5 min save';
  const scheduleZh=day===1?'5 分钟读题和选用户 · 12 分钟研究 · 8 分钟选平台 · 12 分钟设计 · 8 分钟技能盘点 · 10 分钟计划 · 5 分钟检查保存':'5 分钟看提案 · 10 分钟试模板 · 25 分钟制作 · 15 分钟测试改进 · 5 分钟保存';
  main.innerHTML='<div class="toolbar">'+localLink('#home','Lesson home')+'</div><section class="panel"><p class="kicker">Day '+day+' / Coding Jam</p><h1>'+title+'</h1><p>'+pair(...intro)+'</p><details><summary>60-minute plan</summary>'+pair(schedule,scheduleZh)+'</details></section>';
  if(day===1){
    const paragraph = (en, cn) => '<p>'+pair(en,cn)+'</p>';
    const task = (n, title, titleZh, body) => wrap(pair('Slide '+n+' · '+title,'第 '+n+' 页 · '+titleZh),body);
    main.innerHTML+=wrap(pair('What happens at the Coding Jam?','Coding Jam 当天要做什么？'),
      '<ul class="jam-brief"><li>'+pair('Work in a team of 2–3. Build a digital solution that helps people at school or in the community. Choose a school-approved platform.','每组 2–3 人，用学校认可的平台制作能帮助学校或社区的数字作品。')+'</li><li>'+pair('On the day, the organisers give you a problem, a constraint and a time limit. Later they announce a plot twist. Be ready to change one part of your idea.','活动当天才公布问题、限制和时限。之后还会公布新变化，要能调整设计。')+'</li><li>'+pair('At the science-fair-style judging, let someone see the prototype work. Explain who it helps, what the user does and what happens.','在展览式评审中演示原型，说明它帮助谁、用户怎样操作，以及结果是什么。')+'</li></ul>'+
      '<p class="sub">'+pair('Find the school briefing in Teams → Year 9E → General → “AIMS Coding Jam 2026” (13 November). The organiser will confirm event-day AI guidance and judging details.','学校说明在 Teams → Year 9E → General → “AIMS Coding Jam 2026”（11 月 13 日）。活动当天的 AI 规则和评审细节以主办方通知为准。')+'</p>');
    main.innerHTML+=wrap(pair('Open one shared proposal','打开一份团队共用的提案'),
      paragraph('One partner opens the template, signs in, makes a copy and shares it with the team. Write straight into the six slides. Already started? Keep your deck and add the missing decisions below.','一位同伴打开模板、登录、创建副本并共享。直接把答案填在六页幻灯片中。若已开始，可保留原稿并补充下方要点。')+
      '<div class="actions">'+external(template,'Use the Canva template')+file('Year9_App_Proposal_Template.pptx','Download editable slides')+'</div>');
    main.innerHTML+=task(1,'Whose day could you make easier?','你能让谁的一天轻松一点？',
      paragraph('Tell your partner about the last time someone got stuck at school or at home. What did they try first? What happened because it was difficult? Use a real observation if you have one. If you are guessing, say what you would ask that person.', '和同伴聊一聊最近有人在学校或家里遇到的困难。对方先试了什么？这个困难造成了什么影响？有真实观察就用它；如果只是猜测，说说你会向当事人问什么。')+
      visuals.scenes()+teamPlan()+visuals.prompt('idea')+
      '<details><summary>'+pair('Would our idea really help?','我们的想法真的有用吗？')+'</summary>'+paragraph('Would a sign, a checklist or one clearer message already solve it? What does your app add? Who would have to enter or update the information? If it creates extra work for someone else, change one part of the idea.', '一张标牌、一份清单或一条更清楚的通知能解决吗？应用能多帮什么忙？谁负责输入或更新资料？如果给别人增加了负担，就改一处设计。')+'</details>'+
      paragraph('Add your before-and-after idea to slide 1. Put the action on slide 4 and the sign you will check on slide 6. These notes stay in this browser.', '把改善前后的想法写在第 1 页，操作画在第 4 页，可观察的成功标志放在第 6 页。这里的笔记保存在本浏览器。'));
    main.innerHTML+=task(2,'Compare two real projects','比较两个真实项目',
      paragraph('Choose two examples below. Open each project and look for one action and its result. On slide 2, record both links, one feature from each and which feature would help your user more.','从下方选两个项目。打开项目，找出一个操作及其结果。在第 2 页记录两个链接、各自的一个功能，再解释哪一个更适合你们的用户。')+
      '<div class="jam-research">'+exampleCards()+'</div>');
    const platforms=['Scratch','MIT App Inventor','MakeCode / micro:bit','Python','HTML / CSS / JavaScript','Another school-approved platform'];
    main.innerHTML+=task(3,'Commit to one platform','确定一个制作平台',
      paragraph('On slide 3, name your platform, the feature it lets you build and the device or simulator you can test on. Pick one action you can finish. Name one extra you can drop.','在第 3 页写出平台、能用它制作的功能，以及可供测试的设备或模拟器。选一个能完成的操作，并写出时间不足时可删去的额外功能。')+
      '<label for="jam-tool">'+pair('Remember our platform on this device for Day 2','在这台设备上记住平台，供第二天使用')+'</label><div class="jam-choice"><select id="jam-tool"><option value="">'+(zh?'选择平台 / Choose a platform':'Choose a platform')+'</option>'+platforms.map(p=>'<option>'+esc(p)+'</option>').join('')+'</select><label id="other-tool-label" hidden>'+pair('Platform name','平台名称')+'<input id="other-tool" type="text" maxlength="70"></label></div>');
    main.innerHTML+=task(4,'Show what happens after one action','展示一个操作会带来什么结果',
      paragraph('Sketch on paper and photograph it, draw digitally, or ask a school-approved AI tool to help you explain or picture the idea. Put the start, result and reset on slide 4. Label the control. Explain one thing your team chose or changed and why.','可在纸上画并拍照、用电子设备绘图，或用学校认可的 AI 工具帮助解释或构思画面。在第 4 页展示初始状态、操作结果和重置；标出控件，并用自己的话解释团队的一项选择或改动。')+
      visuals.storyboard()+visuals.prompt('mock')+
      '<p class="sub">'+pair('AI is optional for this classroom proposal. Check the organiser’s guidance before using it at the event.','本次课堂提案可自愿使用 AI。活动当天请先查看主办方的 AI 指引。')+'</p>');
    main.innerHTML+=task(5,'What can each person actually build?','每个人现在能做什么？',
      paragraph('Each teammate gives one piece of evidence from class, takes one job and names one skill to practise. How will your partner tell you are ready?','每位组员举一个课堂实例，认领一项任务，并写出一项需要练习的技能。同伴怎样判断你已经会了？')+
      '<div class="sample">'+pair('“I made a button change a label last week. I can build the result screen. I still need to learn Reset. I’ll practise restoring the first message, then ask my partner to tap, reset and tap again.”','“我上周做过点击按钮改变文字。我能制作结果界面，但还要学会重置。我会练习恢复第一条提示，再请同伴点击、重置、再点一次。”')+'</div>');
    const checkpoints=[
      ['0–10','Read the brief. Agree who needs help and what counts as success.','读题，确定用户和成功条件。'],
      ['10–25','Sketch the action and result. Try opening your tool on the test device.','画操作前后界面，在测试设备打开平台。'],
      ['25–65','Build the smallest working feature. By minute 65, a partner should be able to try it.','制作最小可用功能。第 65 分钟前，让同伴能够试用。'],
      ['65–85','Test the action, reset and repeat. Fix the first thing that stops the user.','测试操作、重置、再试，先修复妨碍使用的问题。'],
      ['85–105','Practise a twist: what if sound is unavailable? Adapt one part and retest.','模拟要求变化：若不能播放声音怎么办？修改一处并重测。'],
      ['105–120','Save a working copy. Rehearse a short demo showing the user, action and benefit.','保存可用副本，演练简短展示，说明用户、操作和好处。']
    ];
    main.innerHTML+=task(6,'What will be working after two hours?','两小时后要展示什么？',
      paragraph('Use 120 minutes as your practice budget. On slide 6, give each stage an owner and something another person can see or try. Change the split to suit your idea, but keep the total at 120. Use the organiser’s actual timings on event day.','以下是 120 分钟练习预算。第 6 页每个阶段写一位负责人和可见或可测试的成果。时间可调整，但总计 120 分钟。正式活动按主办方当天的安排。')+
      '<ol class="jam-timeline">'+checkpoints.map(([m,e,z])=>'<li><b>'+m+' min</b><span>'+pair(e,z)+'</span></li>').join('')+'</ol>'+
      '<div class="sample">'+pair('A checkable milestone: “By minute 65, Sam can tap Art Club and see Room 12. If we fall behind, we keep the room lookup and drop the animated map.” Write your own version.','可验证的例子：“到第 65 分钟，Sam 点美术社就能看见 12 号教室。如果落后，保留查询教室，删去地图动画。”请换成自己的计划。')+'</div>');
    main.innerHTML+=wrap(pair('Ready for Mr Dave?','准备好给老师查看了吗？'),
      checklist([
        ['We compared two linked projects and committed to one platform.','我们比较了两个有链接的项目，并确定了一个制作平台。'],
        ['Our concept shows one action, its result and how to try again.','我们的设计展示了一个操作、结果，以及如何再试。'],
        ['Each partner gives evidence of a skill and a next practice step.','每位组员都给出了技能证据及下一步练习。'],
        ['Our 120-minute plan names owners, a working demo and one feature to drop.','我们的 120 分钟计划写明负责人、可演示成果及可以删减的功能。']
      ],'pitchV2')+paragraph('Give your partner a 30-second pitch. Point to the concept and explain who uses it, what changes after one action, and which part you can have working in two hours. Swap speakers.','和同伴轮流做 30 秒介绍。指着概念图说明谁会用、操作后怎样变化，以及两小时内哪一部分能实际运行。')+paragraph('Check that Mr Dave can open your Canva link or PowerPoint. Submit one team proposal by Wednesday 25 November. For Day 2, bring slides 1, 3 and 4 so your team can test its idea.','确认老师能打开 Canva 链接或 PowerPoint。请在 11 月 25 日星期三前交一份团队提案。第二天带上第 1、3、4 页，供团队测试想法。'));
    const select=main.querySelector('#jam-tool'),other=main.querySelector('#other-tool'),otherLabel=main.querySelector('#other-tool-label');
    select.value=state.jamTool||'';other.value=state.jamOtherTool||'';
    function updateChoice(){otherLabel.hidden=select.value!==platforms[platforms.length-1];state.jamTool=select.value;state.jamOtherTool=other.value;save()}
    otherLabel.hidden=select.value!==platforms[platforms.length-1];
    select.onchange=updateChoice;other.oninput=updateChoice;
  }else{
    const hasNeed=Boolean(need.today||need.change||need.proof);
    main.innerHTML+=wrap(pair('Build for the person you chose','为你们选定的用户制作原型'),
      '<p>'+pair('Read your team’s idea aloud. Give your partner one job to do as that person. Build the smallest feature that could make that job easier.', '大声读出团队的想法。请同伴扮演那位用户，给对方一个具体任务。制作能让这个任务变容易的最小功能。')+'</p>'+
      '<div id="jam-need-summary">'+briefSummary()+'</div>'+
      '<details id="jam-need-editor" '+(hasNeed?'':'open')+'><summary>'+pair(hasNeed?'Edit your team’s idea':'Bring in your idea from slide 1, or start here','查看或填写团队想法')+'</summary>'+teamPlan()+'</details>');
    main.innerHTML+='<details class="panel"><summary>'+pair('Revisit the four project examples','回顾四个项目示例')+'</summary><div class="jam-research">'+exampleCards()+'</div></details>';
    main.innerHTML+=wrap(pair('Try one action','试用一个操作'),'<p>'+pair('This starter helps a visitor find water. Try its button. For your own prototype, replace the action and result with the ones on your sketch.','这个示例帮助访客找饮水处。试试按钮，再把操作和结果换成自己草图里的设计。')+'</p><div class="phone"><div class="drop" aria-hidden="true">💧</div><strong>Refill Finder</strong><p id="demoResult" aria-live="polite">'+pair('Tap Find a refill.','点击 Find a refill。')+'</p><button id="demoTap" class="primary">Find a refill</button><button id="demoReset">Reset</button></div>');
    main.innerHTML+=wrap(pair('Choose your platform','选择平台'),(planned?'<p class="sample">'+pair('Your Day 1 platform on this device: '+planned,'这台设备记住的第一天平台：'+planned)+'</p>':'')+'<p>'+pair('Choose one. The guide below changes to match your tool. If you missed Day 1, name one user, one button and one result before you start.','选一个平台，下方说明会随之更换。若错过第一天，先决定用户、一个按钮和一个结果。')+'</p><div class="pills">'+['Scratch','MIT','Other'].map(p=>'<button data-platform="'+p+'" aria-pressed="'+(p===platform)+'" class="'+(p===platform?'primary':'')+'">'+({Scratch:'Scratch',MIT:'MIT App Inventor',Other:'Another platform'})[p]+'</button>').join('')+'</div><div class="actions">'+(platform==='Scratch'?file('RefillFinder.sb3','Download Scratch starter')+external('https://scratch.mit.edu/projects/editor/','Open Scratch'):platform==='MIT'?file('RefillFinder.aia','Download MIT starter')+external('https://ai2.appinventor.mit.edu/','Open MIT App Inventor'):'')+'</div>');
    main.innerHTML+=wrap(pair('Build and check your prototype','制作并检查原型'),'<div class="checks">'+steps[platform].map(([a,b,e,z],i)=>'<div class="jg-build-step"><label><input type="checkbox" data-check="'+platform+i+'" '+(state.jamChecks[platform+i]?'checked':'')+'><span><strong>'+pair((i+1)+'. '+a,b)+'</strong>'+pair(e,z)+'</span></label>'+visuals.guide(platform,i)+'</div>').join('')+'</div>');
    main.innerHTML+=visuals.prompt('build');
    main.innerHTML+=wrap(pair('Did it make the job easier?','做这件事真的更容易了吗？'),
      '<p>'+pair('During partner testing, use the same everyday task twice. First let your partner try the usual way, using a simple example such as a notice or list. Then reset the prototype and hand it over. Give the goal only and let them find their own way.', '同伴测试时，用两种方法做同一件日常小事。先请同伴用原来的方法，例如查看一条通知或清单；再重置原型交给对方。只说明目标，让对方自己找方法。')+'</p>'+
      visuals.testStrip()+noteField('benefit','result','What actually happened each time? Compare the sign you chose on Day 1.','两次实际发生了什么？比较第一天选定的成功标志。',benefit.result)+
      noteField('benefit','revision','Where did your partner hesitate? Change one thing and try again. What happened?','同伴在哪里犹豫了？改一处再试，结果怎样？',benefit.revision)+
      '<p>'+pair('If you could only test one version today, say which one you tried and what still needs checking.','如果今天只能测试一种方法，写清试了哪一种、还需要验证什么。')+'</p>');
    main.innerHTML+=wrap(pair('Show your result','展示你的成果'),'<p>'+pair('In your demo, show the user’s task and the working action. Finish with one honest observation: “Our tester could … We still need to check … with a real user.” Add this evidence to slide 6. Save the editable prototype with the proposal for Mr Dave.', '展示用户任务和可运行的操作。最后说出真实观察：“测试同伴能……我们还要请真实用户验证……”把证据加在第 6 页。把可编辑原型和提案一起保存给老师。')+'</p>');
    document.querySelector('#demoTap').onclick=()=>document.querySelector('#demoResult').textContent=zh?'Try the refill station beside the hall. · 试试礼堂旁的饮水点。':'Try the refill station beside the hall.';
    document.querySelector('#demoReset').onclick=()=>document.querySelector('#demoResult').textContent=zh?'Tap Find a refill. · 点击 Find a refill。':'Tap Find a refill.';
    main.querySelectorAll('[data-platform]').forEach(b=>b.onclick=()=>{state.platform=b.dataset.platform;state.jamGuideChosen=true;save();window.coverJam({day,state,save,esc,pair,main,zh,button,localLink});});
  }
  visuals.bind(main);
  connectNotes();
  main.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{state.jamChecks[b.dataset.check]=b.checked;save()});
};
