(function(root){
 'use strict';
 const checks={
  'import-open':['I can see the counter blocks in my own MakeCode project.','我能在自己的 MakeCode 项目中看到计数器积木。','내 MakeCode 작품에 계수기 블록이 보여요.'],
  'find-logic':['My if / else is inside A, below change visitors by 1.','我的 if / else 在 A 里面，在加一积木下方。','내 if / else는 A 안의 change visitors by 1 아래에 있어요.'],
  'set-condition':['My condition says visitors >= 5, not visitors = 5.','我的条件是 visitors >= 5，不是 visitors = 5。','내 조건은 visitors >= 5이고 visitors = 5가 아니에요.'],
  'decision-build':['My then path shows the cross. My else path shows visitors.','我的 then 路径显示叉号，else 路径显示人数。','then에는 X 표시가, else에는 visitors가 있어요.'],
  'flash-pattern':['Inside repeat 3, I have cross → pause 300 → clear screen → pause 300.','repeat 3 里面有：叉号 → 暂停 300 → 清屏 → 暂停 300。','repeat 3 안에 X → pause 300 → clear screen → pause 300이 있어요.'],
  'after-warning':['Show number visitors is below repeat, not inside it.','show number visitors 在 repeat 下方，不在循环里面。','show number visitors는 repeat 안이 아닌 아래에 있어요.'],
  'threshold-build':['I tried my changed limit: one below it does not warn; at the limit it warns.','我测试了新限制：少一人不提醒，达到限制会提醒。','바꾼 기준보다 하나 적으면 경고하지 않고 기준에 닿으면 경고해요.']
 };
 function rule(c){
  if(checks[c.id])return {text:checks[c.id],editor:true};
  if(c.type==='build')return {text:c.hardware&&/-2$/.test(c.id)?['With power off, my teacher checked our cable and socket before we switched on.','断电接线后，老师检查了线缆与接口，我们才通电。','전원을 끄고 연결한 뒤 선생님이 케이블과 소켓을 확인하고 켰어요.']:['I tried the pictured step in my own project and checked the result described above.','我在自己的项目中尝试了图示步骤，并检查了上面说明的结果。','내 작품에서 그림의 단계를 해 보고 위에 적힌 결과를 확인했어요.'],editor:!c.manufacturer};
  if(c.type==='test'||c.type==='save-code'||c.type==='open')return {editor:true};
  return null;
 }
 function checked(s,c){const v=s.values['checked-'+c.id];return v!==undefined?v==='yes':s.completed.includes(c.id)&&!s.skipped.includes(c.id);}
 function editor(s,c){return s.values.editorOpened==='yes'||s.values['editor-'+c.id]==='yes'||checked(s,c);}
 function actionPending(s,c){const r=rule(c);return !!r&&((r.editor&&!editor(s,c))||(r.text&&!checked(s,c)));}
 function quizChecklist(s){
  const done=id=>checked(s,{id});
  return [
   {id:['find-logic','set-condition','decision-build'].find(id=>!done(id))||'decision-build',ok:['find-logic','set-condition','decision-build'].every(done),text:['Build the two paths in Main Task 1.','完成任务一的两条路径。','활동 1의 두 갈래 만들기.']},
   {id:['flash-pattern','after-warning'].find(id=>!done(id))||'after-warning',ok:['flash-pattern','after-warning'].every(done),text:['Build the repeating warning in Main Task 2.','完成任务二的重复提醒。','활동 2의 반복 경고 만들기.']},
   {id:'try-warning',ok:s.values['try-warning']==='0'&&!s.skipped.includes('try-warning'),text:['Try 4, 5, 6 and B reset. Get help if one does not work yet.','测试 4、5、6 与 B 重置，有问题请先求助。','4, 5, 6과 B 초기화를 시험해요. 안 되면 도움받아요.']},
   {id:'plenary-explain',ok:!!s.values['plenary-explain']?.trim()||s.values['plenary-explain-oral']==='yes',text:['Finish your plenary explanation: write or explain aloud.','完成总结解释：写下或口头说明。','마무리를 글이나 말로 설명해요.']},
   {id:'save-program',ok:s.values['hex-saved']==='0',text:['Save your real MakeCode HEX file.','保存真正的 MakeCode HEX 文件。','실제 MakeCode HEX 파일 저장하기.']},
   {id:'submit',ok:s.values['pdf-found']==='yes',text:['Find your PDF and check your name and class.','找到 PDF，检查姓名和班级。','PDF에서 이름과 반 확인하기.']},
   {id:'submit',ok:s.values.submission==='0',text:['Upload PDF + HEX to Teams and select Turn in.','把 PDF + HEX 上传 Teams 并点 Turn in。','Teams에 PDF + HEX를 올리고 Turn in 누르기.']}
  ];
 }
 const quizzes=[
  {id:'blooket',name:'Blooket',url:'https://play.blooket.com/play?hwId=6ae963bb933aa5acff42cb9d',due:'2026-11-17T12:29:00+08:00',goal:['Answer 50 questions correctly. The 15 questions repeat. Choose a game mode.','答对 50 次。15 道题会重复，可选择游戏模式。','15문제가 반복돼요. 모드를 고르고 50번 맞혀요.'],notice:['Due 17 November, 12:29 pm (Malaysia).','截止：11月17日中午12:29（马来西亚）。','마감: 11월 17일 낮 12:29 (말레이시아).']},
  {id:'gimkit',name:'Gimkit · Don’t Look Down',url:'https://www.gimkit.com/join/6ae964946c360e633c1cdc4c',due:'2026-11-05T23:00:00+08:00',goal:['Answer 50 correctly OR reach The Very Top. Checkpoints are on. Choose one quiz, not both.','答对 50 次或到达 The Very Top，检查点已开启。只选一个测验。','50번 맞히거나 The Very Top에 도착해요. 체크포인트가 있어요. 퀴즈는 하나만 골라요.'],notice:['Available during the teacher’s trial, which ends 5 November; it may close earlier that day. If it will not open, choose Blooket.','教师试用于11月5日结束，当天可能提前关闭。打不开时请选择 Blooket。','선생님 체험은 11월 5일 끝나요. 그날 일찍 닫힐 수 있어요. 안 열리면 Blooket을 골라요.']}
 ];
 const active=(q,now=Date.now())=>Number(now)<Date.parse(q.due);
 const api={checks,rule,checked,editor,actionPending,quizChecklist,quizzes,active};root.WarningPathway=api;
 if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
