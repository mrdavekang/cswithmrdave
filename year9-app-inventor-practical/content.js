(function(root){
'use strict';
const pair=(en,zh)=>({en,zh});
const wagba=pair('Turn your homepage idea into a personal app with a working button. Save it and open it again.','把首页想法变成一个有按钮功能的应用，保存后重新打开。');
const areas={K:pair('Knowledge','知识'),S:pair('Skills','技能'),U:pair('Understanding','理解')};
const targets={
 K:pair('Know what labels, images, buttons, click events and responses do.','认识标签、图片、按钮、点击事件和响应的作用。'),
 S:pair('Change a homepage and its button message. Run, save and reopen the project.','修改首页和按钮信息，运行、保存并重新打开项目。'),
 U:pair('Explain how a button’s words and its response work together for the user.','说明按钮文字与点击后的响应怎样配合，帮助用户。')
};
const topics=[
 {id:'fashion',name:pair('Fashion & style','时尚与风格'),title:'Studio Fit',intro:'Outfit ideas for friends.',button:'Show an outfit',response:'Try a red T-shirt with dark jeans.',zhResponse:'试试红色 T 恤搭配深色牛仔裤。',colour:'#FBEBDD'},
 {id:'gaming',name:pair('Gaming accessories','游戏配件'),title:'Gear Room',intro:'Gaming gear ideas for friends.',button:'View controller details',response:'Wireless controller with two rear buttons.',zhResponse:'带两个背部按钮的无线手柄。',colour:'#EEEBFF'},
 {id:'camera',name:pair('Cameras & photography','相机与摄影'),title:'Focus Club',intro:'Camera ideas for new photographers.',button:'Show a photo tip',response:'Keep the camera steady for a sharper photo.',zhResponse:'保持相机稳定，照片会更清晰。',colour:'#FFF2CF'},
 {id:'weather',name:pair('Weather & travel','天气与旅行'),title:'Sky Notes',intro:'Weather tips for days out.',button:'Show a weather tip',response:'Example: take a raincoat on a rainy day.',zhResponse:'示例：下雨天可以带雨衣。',colour:'#E5F3FC'},
 {id:'booking',name:pair('Events & bookings','活动与预约'),title:'Backstage',intro:'Event ideas for music fans.',button:'Show an event',response:'Example: music club meets on Tuesday at 3 pm.',zhResponse:'示例：音乐社星期二下午三点见面。',colour:'#FCE6ED'},
 {id:'planner',name:pair('Timetables & routines','课表与日常'),title:'My Next',intro:'A simple guide to my school day.',button:'Show my next activity',response:'Example: art club starts at 3 pm.',zhResponse:'示例：美术社下午三点开始。',colour:'#EAF2DE'}
];
const checks=[
 {id:'k1',area:'K',q:pair('I know what a Label, Image and Button do.','我知道 Label、Image 和 Button 分别有什么作用。'),hint:pair('A Label displays words. An Image displays a picture. A Button can respond to a tap.','Label 显示文字，Image 显示图片，Button 可以响应点击。')},
 {id:'k2',area:'K',q:pair('I know what an event and a response are.','我知道什么是事件和响应。'),hint:pair('Tapping a button is an event. A new message appearing is a response.','点击按钮是事件，出现新信息是响应。')},
 {id:'s1',area:'S',q:pair('I can change an item’s Text or Picture in Designer.','我能在 Designer 中修改组件的 Text 或 Picture。'),hint:pair('For example, choose TitleLabel and change the words in its Text field.','例如，选中 TitleLabel，再修改 Text 输入框中的文字。')},
 {id:'s2',area:'S',q:pair('I can edit a message inside a connected Blocks program.','我能在已连接的积木程序中修改信息。'),hint:pair('You will keep the starter blocks joined and change the words in the pink block.','你会保留起始积木的连接，只修改粉色积木里的文字。')},
 {id:'u1',area:'U',q:pair('I can explain how a button click changes a label.','我能说明点击按钮怎样改变标签文字。'),hint:pair('The click starts the event handler. Its instruction sets the label’s new text.','点击会触发事件处理程序，里面的指令会设置标签的新文字。')},
 {id:'u2',area:'U',q:pair('I can explain why the button label should match its message.','我能说明按钮文字为什么要与显示的信息相符。'),hint:pair('“View camera details” should show camera information, so the user gets what they expect.','“查看相机介绍”应该显示相机信息，让用户得到预期的结果。')}
];
const starting=[
 {id:'secure',...pair('I understand this','我明白这个')},
 {id:'new',...pair('This is new to me','这是我第一次学')},
 {id:'help',...pair('I need help understanding this','我需要帮助来理解')},
 {id:'untried',...pair('I have not tried this yet','我还没有尝试过')}
];
const phases=[
 {id:'new',name:pair('New learning','新学习'),desc:pair('This is new. It is hard, but I am making progress.','这是新内容。虽然有难度，但我在进步。'),next:pair('Keep the example beside you. Try one small change at a time.','把示例放在旁边，每次尝试一个小改动。')},
 {id:'consolidating',name:pair('Consolidating','巩固中'),desc:pair('I have done this before. Practice is making me better at it.','我做过类似的事，练习让我做得更好。'),next:pair('Repeat your change with fewer reminders, then reopen your saved app.','减少提示再做一次修改，然后重新打开已保存的应用。')},
 {id:'easy',name:pair('Treading water','需要更多挑战'),desc:pair('I can do this easily. I am ready for more challenge.','我能轻松完成，准备尝试更多挑战。'),next:pair('Use your own image or personalise the Reset message. Test that change.','换上自己的图片，或修改重置信息，再测试这个改动。')},
 {id:'stuck',name:pair('Drowning','需要帮助'),desc:pair('I am stuck. I need someone to show or explain this again.','我卡住了，需要有人再示范或解释一次。'),next:pair('Show the exact component or block you are working on and ask for a demonstration.','指出你正在修改的组件或积木，请老师再示范一次。')}
];
const quiz={
 'do-component':{q:pair('Which component should display your app’s title?','应该用哪种组件显示应用的标题？'),options:[{id:'button',...pair('Button','按钮 Button')},{id:'label',...pair('Label','标签 Label')},{id:'image',...pair('Image','图片 Image')}],correct:'label',explain:pair('A Label displays text. The starter uses TitleLabel for the heading. A Button is for the user to tap.','Label 用来显示文字。起始项目用 TitleLabel 显示标题，Button 则让用户点击。')},
 'do-event':{q:pair('A user taps “Show an outfit”. Which is the app’s response?','用户点击“查看穿搭”，哪一个是应用的响应？'),options:[{id:'tap',...pair('The user touches the button.','用户触碰按钮。')},{id:'select',...pair('The developer selects a component in Designer.','开发者在 Designer 中选中组件。')},{id:'message',...pair('An outfit suggestion appears below the button.','按钮下方出现穿搭建议。')}],correct:'message',explain:pair('The tap is the event. The suggestion appearing is the response. You will change this response in Blocks.','点击是事件，出现建议是响应。你会在 Blocks 中修改这个响应。')},
 'plenary':{q:pair('Your button says “Show a photo tip”. Which response fits its purpose?','你的按钮写着“显示摄影小技巧”，哪个响应符合它的用途？'),options:[{id:'tip',...pair('“Keep the camera steady for a sharper photo.”','“保持相机稳定，照片会更清晰。”')},{id:'name',...pair('“The app is called Focus Club.”','“应用名叫 Focus Club。”')},{id:'done',...pair('“Button clicked.”','“按钮已点击。”')}],correct:'tip',explain:pair('A useful response delivers what the button promises. A photo tip helps the user do something; merely confirming a tap does not provide that tip.','有用的响应应实现按钮承诺的功能。摄影技巧能帮助用户；只确认点击，并没有提供技巧。')}
};
const groups=[
 {id:'read',...pair('Read first','先读一读'),minutes:3},
 {id:'starter',...pair('Do now','课前练习'),minutes:3},
 {id:'learning',...pair('Types of Learning','学习重点'),minutes:3},
 {id:'idea',...pair('Your starting idea','你的起始创意'),minutes:3},
 {id:'setup',...pair('MIT setup','MIT 准备'),minutes:8},
 {id:'main1',...pair('Main Task 1 · My homepage','主要任务 1 · 我的首页'),minutes:17},
 {id:'main2',...pair('Main Task 2 · My button','主要任务 2 · 我的按钮'),minutes:13},
 {id:'save',...pair('Save & reopen','保存与重新打开'),minutes:5},
 {id:'challenge',...pair('Keep creating','继续创作'),minutes:2},
 {id:'pitstop',...pair('Learning Pit Stop','学习加油站'),minutes:2},
 {id:'finish',...pair('Showcase & save PDF','展示与保存 PDF'),minutes:1}
];
const page=(id,group,type,en,zh,extra={})=>({id,group,type,title:pair(en,zh),...extra});
const pages=[
 page('mission','read','mission','Make your first app work','让你的第一个应用运行起来'),
 page('read-components','read','components','Meet the pieces of your homepage','认识首页中的组件'),
 page('tap-demo','read','demo','One tap. One visible response.','一次点击，看见一个响应'),
 page('do-component','starter','quiz','Which component?','选择哪种组件？'),
 page('do-event','starter','quiz','Event or response?','事件还是响应？'),
 ...checks.map(x=>page('learn-'+x.id,'learning','learning',x.q.en,x.q.zh,{check:x.id})),
 page('learning-focus','learning','focus','What will you get better at?','今天你要在哪些方面进步？'),
 page('idea-route','idea','route','Do you have your sketch from the previous theory lesson?','你有上一节理论课的首页草图吗？'),
 page('idea-topic','idea','topics','What would you like your app to be about?','你希望应用介绍什么？'),
 page('idea-name','idea','name','Give your app a name','给你的应用起个名字'),
 page('device','setup','device','What equipment do you have in school?','你在学校使用什么设备？'),
 page('mit-signin','setup','signin','Open your MIT workspace','打开你的 MIT 工作区',{guide:'03'}),
 page('starter-download','setup','download','Download the working starter','下载能运行的起始项目'),
 page('mit-import','setup','guide','Import the starter into MIT','把起始项目导入 MIT',{guide:'04',instruction:pair('In MIT, open Projects. Choose “Import project (.aia) from my computer …”.','在 MIT 打开 Projects，选择“从本机导入 .aia 项目”。'),checkpoint:pair('You can see MIT’s Import Project window.','你能看到 MIT 的 Import Project 窗口。'),help:'import'}),
 page('mit-file','setup','guide','Choose the file, then import it','选择文件，再导入',{guide:'05',instruction:pair('Select Choose File. Find MyApp_W9.aia in Downloads, select it, then choose Open. Back in MIT, check the filename and select the green OK button.','点 Choose File，在 Downloads 中选中 MyApp_W9.aia，然后点 Open。回到 MIT 后确认文件名，再点绿色 OK。'),checkpoint:pair('MyApp_W9 opens with a title, picture, introduction, main button, response label and Reset.','MyApp_W9 打开后包含标题、图片、简介、主按钮、响应标签和 Reset。'),help:'files'}),
 page('find-parts','main1','guide','Find the item, then its settings','先选组件，再找它的属性',{guide:'06',instruction:pair('Choose Designer at the top right. Point out the phone preview, the Components list and the Properties panel before changing anything.','先点右上角 Designer，找到手机预览、Components 组件列表和 Properties 属性面板。'),checkpoint:pair('Components chooses an item. Properties changes that selected item.','Components 用来选组件，Properties 用来改选中组件的属性。'),help:'designer'}),
 page('edit-title','main1','edit','Put your app’s name on the homepage','把你的应用名称放到首页上',{guide:'07',word:'title',component:'TitleLabel',instruction:pair('In MIT, select TitleLabel in Components. Scroll inside Properties to Text. Replace the words with your app’s name, then click or tap outside the field.','在 MIT 的组件列表选 TitleLabel，在右侧属性面板内滚动，找到 Text，改成你的应用名称，再点框外。'),checkpoint:pair('Your app name appears at the top of the phone preview.','手机预览顶部出现你的应用名称。'),help:'text'}),
 page('edit-intro','main1','edit','Tell the user what your app is about','告诉用户你的应用介绍什么',{guide:'08',word:'intro',component:'IntroLabel',instruction:pair('Select IntroLabel. Find its Text property. Write a short introduction to your own topic, then click or tap outside.','选中 IntroLabel，找到 Text，输入自己主题的简短介绍，再点框外。'),checkpoint:pair('The introduction tells the user what they can find in your app.','简介能让用户知道在你的应用中可以找到什么。'),help:'text'}),
 page('edit-image','main1','guide','Choose a picture that fits your topic','选择符合主题的图片',{guide:'09',instruction:pair('Select AppImage. In Properties, open Picture. Select a supplied .png file that fits your idea, then select OK.','选中 AppImage，在属性中打开 Picture，选择符合主题的 .png 图片，再点 OK。'),checkpoint:pair('The new picture appears in the phone preview. Keep the component name AppImage.','新图片出现在手机预览中，组件名称仍保留 AppImage。'),help:'image'}),
 page('edit-button','main1','edit','Make the button’s words useful','让按钮文字清楚有用',{guide:'10',word:'button',component:'ActionButton',instruction:pair('Select ActionButton. Change its Text property to an action that tells the user what they will get. Keep the component name ActionButton.','选中 ActionButton，把 Text 改成一个清楚的动作，让用户知道会得到什么。组件名称保留 ActionButton。'),checkpoint:pair('The main button displays your action, such as “Show an outfit”.','主按钮显示你的动作文字，例如“查看穿搭”。'),help:'text'}),
 page('read-blocks','main2','blocks','Read what makes the button work','读懂按钮怎样运行',{guide:'11'}),
 page('edit-response','main2','edit','Make the response your own','让按钮显示你自己的信息',{guide:'12',word:'response',component:'ActionButton.Click',instruction:pair('In Blocks, find the top program: when ActionButton.Click. Double-click the words inside its pink text block (double-tap on iPad). Replace that message, then press Enter or tap outside. Keep every block connected.','在 Blocks 找到上方的 when ActionButton.Click，双击粉色积木里的文字（iPad 双点），改成自己的信息，按 Enter 或点框外。积木要保持连接。'),checkpoint:pair('The message matches what your button promises. Keep the lower ResetButton program unchanged.','信息符合按钮承诺的用途，下方 ResetButton 程序先保持不变。'),help:'blocks'}),
 page('connect','main2','connect','Get Companion ready, then connect','先准备 Companion，再连接',{guide:'13'}),
 page('connection-code','main2','guide','Use the current code on YOUR screen','使用你自己屏幕上的当前连接码',{guide:'14',instruction:pair('In Companion, enter the six-letter code shown in your MIT editor. Tap “connect with code”. Wait for your own app to appear.','在 Companion 输入你自己 MIT 编辑器显示的六位字母码，再点 connect with code，等待自己的应用出现。'),checkpoint:pair('Your app is running in Companion. A code in an old screenshot will not connect your project.','你的应用正在 Companion 中运行。旧截图中的连接码不能连接你的项目。'),help:'connection'}),
 page('try-button','main2','test','Try your own main button','试试你自己的主按钮',{test:'main',instruction:pair('In Companion, tap the main button once. Read the message beneath it. Does it show the message you put in the pink text block?','在 Companion 点击主按钮一次，阅读下方的信息，看看是否与粉色积木中的文字相同。')}),
 page('try-reset','main2','test','Reset the response','重置响应信息',{test:'reset',instruction:pair('In Companion, tap Reset. The response should return to “Your response will appear here.” Tap the main button again if you want to show your own message once more.','在 Companion 点 Reset，响应应恢复为 Your response will appear here.。想再次展示自己的信息，可以再点主按钮。')}),
 page('save-project','save','guide','Save your project in MIT','把项目保存到 MIT',{guide:'16',instruction:pair('Open Projects and select Save project. Wait for MIT’s saved message. Your Designer changes and Blocks belong to this same project.','打开 Projects，选择 Save project，等待保存提示。Designer 的修改与积木程序属于同一个项目。'),checkpoint:pair('MIT has shown its saved message.','MIT 已显示保存成功的提示。'),help:'save'}),
 page('export-project','save','guide','Keep your own .aia backup','保留你自己的 .aia 备份',{guide:'17',instruction:pair('Open Projects. Select “Export selected project (.aia) to my computer”. Find the new download and keep the newest exported copy of your work.','打开 Projects，选择导出 .aia 到本机，找到新下载的文件，保留这份最新的作品备份。'),checkpoint:pair('You have the edited .aia file. The original starter and your export may have the same filename.','你已经有修改后的 .aia 文件。它可能与原始起始文件同名。'),help:'files'}),
 page('reopen-project','save','guide','Open the same app again','重新打开同一个应用',{guide:'18',instruction:pair('Use the left arrow beside the project name to open My Projects. Select your project NAME in the list. Check that your title, image and button program are still there.','点击项目名称旁的左箭头返回 My Projects，再点击列表中的项目名称，检查标题、图片和按钮程序是否还在。'),checkpoint:pair('The saved project reopens. Choose Designer if it first opens in Blocks.','保存的项目已重新打开。若先显示积木区，就点 Designer。'),help:'save'}),
 page('keep-creating','challenge','challenge','Have extra time? Make it more yours.','如果还有时间，继续做出自己的风格'),
 ...['K','S','U'].map(a=>page('pit-'+a,'pitstop','pit',(a==='S'?'How are your skills now?':'How is your '+areas[a].en.toLowerCase()+' now?'),'你现在的'+areas[a].zh+'学习状态怎样？',{area:a})),
 page('pit-summary','pitstop','phase-summary','Your learning phase today','你今天的学习状态'),
 page('plenary','finish','quiz','Does the response serve the user?','响应能帮助用户吗？'),
 page('finish','finish','finish','Show your app. Keep your work.','展示应用，保留作品')
];
const help={
 reset:{title:pair('Personalise the Reset message','修改重置信息'),guides:['11'],steps:[pair('Reset uses the LOWER handler: ResetButton.Click. The guide shows its original message.','Reset 使用下方的 ResetButton.Click，指南展示的是原始信息。'),pair('For the core app, Reset restores “Your response will appear here.” If you personalise it, put the same new words in ResponseLabel.Text in Designer and the pink block in ResetButton.Click.','主要任务中的 Reset 恢复原始提示。若修改为自己的信息，Designer 的 ResponseLabel 的 Text 与 ResetButton.Click 内的粉色文字必须完全相同。'),pair('Tap your main button, then Reset. Your new starting message should return. Save the project again.','先点主按钮，再点 Reset，新的起始信息应该恢复。然后再次保存项目。')]},
 access:{title:pair('Sign-in help','登录帮助'),guides:['A1','A2'],steps:[pair('Use the school-email login, not the Google-only sign-in screen. Select Create an Account only if you have not registered before.','使用学校邮箱登录入口。如果还没注册，才选择 Create an Account。'),pair('Open your school Outlook inbox in another tab for MIT’s code. Keep your password private.','在另一个标签页打开学校 Outlook 查收 MIT 验证码，密码要保密。'),pair('No email after 3 minutes? Check Junk once, then record “Access help” below. You can prepare your app’s words while your teacher helps with access.','三分钟后仍没收到邮件？检查一次垃圾邮件，然后记录需要登录帮助。等待时可准备应用文字。')]},
 import:{title:pair('Importing the starter','导入起始项目'),guides:['04','05'],steps:[pair('Download MyApp_W9.aia first. Import it inside MIT through Projects, rather than opening the file as a document.','先下载 MyApp_W9.aia，再在 MIT 的 Projects 菜单导入。'),pair('Already have a project with this name? Open My Projects and select MyApp_W9 to continue it.','已有同名项目？在 My Projects 点 MyApp_W9，继续原项目。')]},
 files:{title:pair('Find the project file','查找项目文件'),guides:['05','I1'],steps:[pair('On a computer, look in Downloads. In MIT’s file picker, choose the .aia and Open, then OK in MIT.','电脑用户在 Downloads 查找 .aia，选择 Open，回 MIT 后点 OK。'),pair('On iPad, download in a full browser. In the file picker, browse Files > Downloads (iCloud Drive or On My iPad). Tap the .aia file.','iPad 用户用完整浏览器下载，在文件窗口查找 Files 里的 Downloads，点选 .aia。'),pair('If your browser adds (1) to a download, choose the newest .aia. If MIT asks for a project name, use MyApp_W9, or an unused name such as MyApp_W9_Start.','浏览器可能在下载名后加 (1)。请选择最新 .aia。若 MIT 要求项目名，可用 MyApp_W9，或未用过的 MyApp_W9_Start。'),pair('A new export can share the starter’s name. Keep the newest download after you export your own work.','导出的文件可能与起始文件同名，请保留刚导出的最新版本。')]},
 designer:{title:pair('Find your way in Designer','认识 Designer'),guides:['06','07'],steps:[pair('Select Designer at the top right. Choose the item in Components, then look in the far-right Properties panel.','先点右上角 Designer，再从 Components 选组件，到最右边 Properties 看属性。'),pair('Scroll within Properties to find Text. Scrolling the whole page may not move that panel.','在 Properties 面板内滚动，查找 Text；只滚动整个网页可能不会移动这个面板。')]},
 text:{title:pair('Change the words, keep the component name','改显示文字，保留组件名称'),guides:['07','10','I2'],steps:[pair('Choose the named component first. Edit its Text property in Properties. Click or tap outside the field to apply your change.','先选中指定组件，再改属性里的 Text，点框外应用修改。'),pair('Rename changes the component’s internal name. Today use Text to change what the user reads.','Rename 会改内部组件名称。今天用 Text 修改用户看到的文字。'),pair('You can borrow the starting phrase, use a short phrase, or use Mandarin to express your idea.','你可以借用起始句、使用短语，或用中文表达想法。')]},
 image:{title:pair('Choose the picture','选择图片'),guides:['09'],steps:[pair('Choose AppImage, then Picture. Select the image filename before pressing OK. The starter already includes six topic images.','先选 AppImage，再开 Picture，先选图片文件名，再点 OK。起始项目已有六种主题图片。')]},
 blocks:{title:pair('Edit the pink text block','修改粉色文字积木'),guides:['11','12','I2'],steps:[pair('Use the program starting when ActionButton.Click. Edit the words inside its pink text block, not the component dropdown.','使用 when ActionButton.Click 这组程序，改粉色积木内的文字，不是组件下拉菜单。'),pair('Keep the text block plugged into set ResponseLabel.Text. If a block moves, place it back into the matching socket.','文字积木要连接到 set ResponseLabel.Text。如果拖开了，就放回对应接口。'),pair('Zero warnings/errors is a useful check of the blocks. Try the button in Companion to check what it actually does.','积木零警告、零错误是一个检查；还要在 Companion 点击按钮，查看实际响应。')]},
 connection:{title:pair('Connect or reconnect Companion','连接或重新连接 Companion'),guides:['13','14','I3'],steps:[pair('In school, use an approved iPad for Companion, either on its own or with a computer editor. Open Companion first. Use the same Wi-Fi as the editor, then choose Connect > AI Companion in MIT.','在校用获老师允许的 iPad 运行 Companion，可单台使用，也可配合电脑编辑器。先打开 Companion，使用与编辑器相同的 Wi-Fi，再在 MIT 选择 Connect > AI Companion。'),pair('If the code expired or Companion disconnected, choose Connect > Reset Connection in MIT, then AI Companion for a fresh code.','如果码过期或连接中断，先在 MIT 的 Connect 中重置连接，再选 AI Companion 获取新码。'),pair('On one iPad, keep browser and Companion open side by side if supported. Type the six-letter code. You cannot scan a QR shown on the same device.','只用一台 iPad 时，如支持可并排打开浏览器与 Companion，手动输入六位码，不能扫描同一设备上的二维码。'),pair('If Companion is unavailable in school, keep building and save the project. Mark live checks Not tried yet. Phones are only an extra testing option at home, with access and permission.','在校没有 Companion 时，继续制作并保存，把运行测试标为尚未尝试。手机只是在家有设备且获允许时的额外测试选择。')]},
 save:{title:pair('Save, export and reopen','保存、导出与重新打开'),guides:['16','17','18'],steps:[pair('Save project keeps work in your current MIT account. Export downloads an editable .aia backup. A PDF from this lesson is a learning record.','Save project 保存到 MIT 账户；Export 下载可编辑的 .aia 备份；本课 PDF 是学习记录。'),pair('In My Projects, select the project NAME to open it. The checkbox selects the row for other actions.','在 My Projects 点击项目名称打开作品；勾选框只是选择该行。')]}
};
const teacherNotes={
 mission:pair('Two practical outcomes: personal homepage and one useful tap-to-message response. The Reset handler is supplied. Students keep the same imported project throughout.','两个实践成果：个性化首页，以及点击后显示有用信息的按钮。Reset 已提供，全程修改同一个导入项目。'),
 'idea-route':pair('Ask pupils to find their paper sketch, saved design PDF or theory work submitted in Teams before choosing. Pupils who missed theory or cannot find their sketch take the short topic route. They do not need to repeat the entire theory lesson. A short app name and one useful message are sufficient to begin.','先请学生查找纸上草图、保存的设计 PDF，或已在 Teams 提交的理论课作品，再选择路线。没上理论课或找不到草图的学生走简短主题路线，不必重做整节理论课。先有应用名称和一个有用的信息即可开始。'),
 'mit-signin':pair('The verified school-email route supports Microsoft school email. New account creation can exceed the setup allocation. The access-help route preserves progress and marks MIT actions as awaiting access.','已验证的学校邮箱入口支持 Microsoft 学校邮箱。新账户设置可能较久。登录帮助路线会保留进度，并标记 MIT 操作仍待完成。'),
 connect:pair('No phones in school. Use an approved iPad, or build and save without Companion and leave live checks untried. Home phone testing is an extra option only. Desktop editing, save/export/reopen/restore and Android compilation were checked. The teacher confirmed the personalised app and both buttons ran in iPad Companion connected to the computer editor. One-iPad import/touch-editing remains a device-pilot item.','在校不使用手机，可用获老师允许的 iPad，或先制作保存，把运行测试保留为尚未尝试。在家手机测试只是额外选择。电脑端编辑、保存导出、重开恢复及 Android 编译已检查。老师确认 iPad 连接电脑后应用和两按钮可运行。仅用一台 iPad 的导入和触控编辑仍需实机试用。'),
 'pit-summary':pair('The largest count describes the most selected confidence phase, not a score-derived diagnosis. Keep any K/S/U area marked Drowning visible even if the overall majority is different.','最大计数表示选择最多的信心状态，不是由分数诊断的状态。即使整体多数不同，也要注意被标为需要帮助的 K/S/U 领域。')
};
const api={pair,wagba,areas,targets,topics,checks,starting,phases,quiz,groups,pages,help,teacherNotes};
if(typeof module==='object'&&module.exports)module.exports=api;else root.PracticalContent=api;
})(typeof window==='undefined'?globalThis:window);
