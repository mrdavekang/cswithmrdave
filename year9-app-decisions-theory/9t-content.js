(function(root){'use strict';
const D={
 edition:'y9t-design-studio-20261030',
 paper:'assets/studio/Year9T_App_Research_and_Drawing_Pack_EN_ZH_Updated.pdf',
 paperEnglish:'assets/studio/Year9T_App_Research_and_Drawing_Pack_English.pdf',
 wagollBilingual:'assets/studio/Year9T_WAGOLL_Design_Choices_EN_ZH.pdf',
 wagollEnglish:'assets/studio/Year9T_WAGOLL_Design_Choices_English.pdf',
 pages:[
  {id:'mission',en:'Read first & Do now',zh:'先看一看与课前练习',minutes:5},
  {id:'focus',en:'Types of Learning',zh:'我的学习重点',minutes:2},
  {id:'gallery',en:'Main Task 1 · Research',zh:'主任务 1 · 研究与讨论',minutes:20},
  {id:'break-1',en:'Quick quiz break',zh:'轻松小测',minutes:3},
  {id:'idea',en:'Main Task 2 · Draw',zh:'主任务 2 · 绘图与设计',minutes:25},
  {id:'pit-summary',en:'Learning Pit Stop',zh:'学习加油站',minutes:3},
  {id:'finish',en:'Save & hand in',zh:'保存与提交',minutes:2}
 ],
 goals:{
  W:['Research useful app features, then draw one improvement to your existing app.','研究有用的应用功能，再为已有的应用画出一项改进。'],
  K:['Recognise an app’s purpose, audience, controls and feedback.','认识应用的用途、用户、控件及反馈。'],
  S:['Compare two designs and draw a labelled interaction.','比较两个设计，画出并标注一次交互。'],
  U:['Explain how a design choice helps the user.','说明一个设计选择如何帮助用户。']
 },
 checks:[
  {id:'k1',area:'K',en:'I can say who an app is for and what it helps them do.',zh:'我能说出应用给谁用、有什么用途。'},
  {id:'k2',area:'K',en:'I can recognise a control and the feedback after a tap.',zh:'我能认出控件及点击后的反馈。'},
  {id:'s1',area:'S',en:'I can compare useful features in two apps.',zh:'我能比较两个应用中有用的功能。'},
  {id:'s2',area:'S',en:'I can draw what changes after a tap and label it.',zh:'我能画出点击后的变化，并加上标注。'},
  {id:'u1',area:'U',en:'I can explain why a label, picture or response helps a user.',zh:'我能说明标签、图片或响应怎样帮助用户。'},
  {id:'u2',area:'U',en:'I can use an idea from research to improve my own app.',zh:'我能用研究中的想法改进自己的应用。'}
 ],
 phases:[
  {id:'new',en:'New learning',zh:'正在学新内容',desc:['This is new. It takes effort, but I am making progress.','这是新内容。虽然要努力，但我正在进步。']},
  {id:'consolidating',en:'Consolidating',zh:'巩固学习',desc:['I have done this before and I am getting better at it.','以前做过，现在做得更好了。']},
  {id:'water',en:'Treading water',zh:'需要更大挑战',desc:['This is already easy. I am ready for a useful challenge.','这些已经很容易，我可以尝试更有用的挑战。']},
  {id:'drowning',en:'Drowning',zh:'需要帮助',desc:['I am stuck and need an explanation or an example.','我遇到困难，需要解释或示例。']}
 ],
 apps:[
  {id:'paint',title:'PaintPot1',file:'paintpot.png',gallery:'5486798015823872',author:'Remake of an MIT tutorial',desc:['An app for drawing on a picture.','在图片上绘画的应用。'],look:['Are the drawing controls easy to recognise?','绘画控件容易辨认吗？']},
  {id:'sound',title:'IHaveADream',file:'soundboard.png',gallery:'6405201777917952',author:'Gallery soundboard; based on an App Inventor tutorial',desc:['A soundboard with buttons for recorded speeches.','用按钮播放演讲录音的应用。'],look:['Would a new user know what each button plays?','新用户能知道每个按钮播放什么吗？']},
  {id:'dots',title:'ColoredDots_with_background',file:'colored-dots.png',gallery:'5560927104532480',author:'Gallery adaptation of the Colored Dots tutorial',desc:['A drawing app with a background picture.','带有背景图片的绘画应用。'],look:['How could the drawing controls be clearer or easier to tap?','怎样让绘画控件更清楚、更容易点击？']}
 ],
 quiz:{
  'now-input':{q:['Which button makes the next action clearest in a fashion app?','穿搭应用中，哪个按钮最能说明下一步操作？'],options:[['a','Show an outfit','显示穿搭'],['b','Go','开始'],['c','Button 1','按钮 1']],correct:'a',why:['Show an outfit tells the user what the button will do.','“显示穿搭”能告诉用户按钮的作用。']},
  'now-event':{q:['Someone taps Save. What useful feedback could appear?','用户点击保存后，什么反馈最有用？'],options:[['a','Nothing changes','没有任何变化'],['b','Saved, with a visible tick','显示“已保存”和一个勾'],['c','The app closes without a message','应用关闭，没有提示']],correct:'b',why:['A clear confirmation helps the user know the action happened. Permanent saving would also need a working storage feature.','清楚的确认让用户知道操作已发生；永久保存还需要真正的存储功能。']},
  'now-output':{q:['A friend cannot tell what happens after a tap in your sketch. What should you add?','朋友看不出草图中点击后会发生什么，你应该加什么？'],options:[['a','More decorations','更多装饰'],['b','Another app name','另一个应用名称'],['c','An arrow and a short label showing the result','用箭头和短语标明结果']],correct:'c',why:['An arrow and label explain the interaction. Drawing skill is not the aim.','箭头和标注能说明交互过程，重点不是绘画技巧。']}
 }
};
if(typeof module==='object'&&module.exports)module.exports=D;else root.StudioContent=D;
})(typeof window!=='undefined'?window:globalThis);
