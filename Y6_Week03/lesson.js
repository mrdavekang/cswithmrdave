/* Pure lesson and progress rules, also used by regression tests. */
(function(root){
 'use strict';
 const steps=[
 ['mission','Do Now','The mission','任务','web'],['x','Do Now','Read x','读取 x','web'],['xy','Do Now','Read the coordinate pair','读取坐标对','web'],['event','Do Now','Start the script','启动脚本','web'],
 ['focus','Learning focus','Choose your learning goal','选择学习目标','web'],['worked','Main 1','Watch a worked example','学习示例','web'],['predict1','Main 1','Predict one change','预测一次变化','web'],['predict2','Main 1','Track two changes','追踪两次变化','web'],['predict3','Main 1','Position or direction?','位置还是方向？','web'],
 ['launch','Main 2','Now open Scratch','现在打开 Scratch','scratch'],['run-example','Main 2','Run START to A','运行从起点到 A','scratch'],['build-b','Main 2','Build A to B','编写 A 到 B','scratch'],['build-route','Main 2','Finish the route','完成路线','scratch'],['test','Main 2','Test and save your project','测试并保存项目','scratch'],['checkpoint','Main 2','Show your working program','展示运行的程序','scratch'],
 ['pitstop','Pitstop','Pause and choose your next step','停下来选择下一步','web'],['extension','Extension','Try a new challenge','尝试新挑战','scratch'],['plenary','Plenary','Show what you understand','展示你的理解','web'],['report','Finish','Your learning record','你的学习记录','web']
 ].map(([id,stage,title,zh,place])=>({id,stage,title,zh,place}));
 const predictions=[
 {start:[-160,-100],ops:[['x',120]],answer:[-40,-100],event:'when green flag clicked'},
 {start:[60,-80],ops:[['y',130],['x',-100]],answer:[-40,50],event:'when space key pressed'},
 {start:[-120,40],ops:[['x',200],['turn',90],['y',-90]],answer:[80,-50],event:'when this sprite clicked'}
 ];
 const goals=[['coordinates','Knowledge: read x and y','知识：读取 x 和 y'],['build','Skills: build and test a route','技能：编写并测试路线'],['explain','Understanding: explain why a change works','理解：解释修改的作用']];
 const phases=[['new','New learning — I am working it out.','新学习——我正在理解。'],['practice','Consolidating — practice is helping.','巩固——练习帮助我进步。'],['stretch','Treading water — I need a challenge.','需要挑战——这对我太容易了。'],['help','Drowning — I need help with a step.','需要帮助——我在一步卡住了。'],['untried','I have not tried this yet.','我还没有试过。']];
 const challenges=[
 ['Reach the portal safely','安全到达出口','The direct glide from KEY to PORTAL crosses a wall. Add the five waypoints below, one glide at a time. Watch the whole route, not just the finish.','从钥匙直接滑行到出口会穿墙。按下面的五个坐标逐步添加滑行积木，检查整条路线。','(205, 95) → (205, −20) → (70, −20) → (70, −140) → (195, −140)'],
 ['Return home','返回起点','After reaching the portal, add a glide to START (−200, −135) along the bottom corridor. Add a “Mission complete!” message. Test from the green flag.','到达出口后，沿底部通道滑行到起点 (−200, −135)，添加完成提示，再从绿旗测试。','PORTAL → START → say “Mission complete!”'],
 ['A new event','新的事件','Save a new version first. Keep the green-flag script ending at KEY. Move the portal-route blocks into a new “when space key pressed” script. Run the flag, wait at KEY, then press space.','先另存一个版本。绿旗脚本停在钥匙。把出口路线放到新的空格键事件下。先运行绿旗，到钥匙后再按空格键。','Green flag → KEY. Then space → PORTAL.'],
 ['Move the destination','移动目的地','Save another version. Move the portal to an empty space. Read its x and y in Scratch. Plan safe waypoints and change the route to reach it. Check that the whole explorer fits between walls.','再保存一个版本。把出口移到空处，读取它的坐标，规划安全的路径并修改代码。确保整个角色不会碰墙。','Choose → read coordinates → plan → test'],
 ['Design a new mission','设计新任务','Add two new checkpoints in clear spaces. Record their coordinates. Ask your partner to predict the route, then test a sequence visiting the original and new checkpoints before KEY and PORTAL.','在空处增加两个检查点并记录坐标。请同伴预测，再测试经过新旧检查点、钥匙和出口的路线。','Two new checkpoints · a prediction · a tested route']
 ];
 const normal=s=>String(s||'').normalize('NFKC').trim().toLowerCase();
 const key=(name,cls,partner)=>JSON.stringify([normal(name),normal(cls),normal(partner)]);
 const fresh=(name,cls,partner='')=>({version:3,id:key(name,cls,partner),name,className:cls,partner,at:0,furthest:0,done:{},answers:{},predictions:predictions.map(()=>({x:'',y:'',history:[],trace:0})),learners:[{},{}],practical:{checks:{},tests:[],status:'not-started'},extensions:challenges.map(()=>({note:'',done:false})),level:0,updated:Date.now()});
 function ready(p,id){
  if(id==='checkpoint')return p.practical.status==='teacher-checked'||!!p.practical.wrap;
  if(id==='focus')return p.learners.slice(0,p.partner?2:1).every(l=>l.goal);
  if(id==='pitstop')return p.learners.slice(0,p.partner?2:1).every(l=>l.phase);
  if(id==='plenary')return p.learners.slice(0,p.partner?2:1).every(l=>l.exitRecorded);
  if(id==='extension')return true;
  return !!p.done[id];
 }
 function position(n,count){const p=predictions[n];let [x,y]=p.start;let dir=90;for(const [axis,v] of p.ops.slice(0,count)){if(axis==='x')x+=v;else if(axis==='y')y+=v;else dir=(dir+v)%360;}return {x,y,dir};}
 function status(p){return p.practical.status==='teacher-checked'?'Teacher checked the working route':p.practical.wrap?'Practical unfinished — teacher moved class to reflection':p.practical.status==='awaiting-check'?'Pupil reports ready — awaiting teacher check':'Practical not yet demonstrated';}
 const api={steps,predictions,goals,phases,challenges,key,fresh,ready,position,status};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CQ=api;
})(typeof window!=='undefined'?window:globalThis);
