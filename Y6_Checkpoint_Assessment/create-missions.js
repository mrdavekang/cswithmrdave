/* Shared scene data for the pupil templates and their website instructions. */
(() => {
  const missions={
    comet:{title:'Comet Courier',zh:'彗星快递',ko:'혜성 배달',sprite:'Nova',
      start:[-160,-80],waypoint:[0,80],finish:[160,-40],
      checkpoint:'Fuel dock',checkpointZh:'燃料站',checkpointKo:'연료 정거장',
      goal:'Launch pad',goalZh:'发射台',goalKo:'발사대',
      walls:[[-80,-80],[-80,-40],[80,40],[80,0]],
      file:'Year6_Comet_Courier_Create.sb3',guide:'comet-template-scratch.jpg',preview:'comet-stage-scratch.jpg'},
    garden:{title:'Moon Garden',zh:'月球花园',ko:'달 정원',sprite:'Pip',
      start:[-160,-80],waypoint:[-40,40],finish:[160,-80],
      checkpoint:'Star seed',checkpointZh:'星星种子',checkpointKo:'별 씨앗',
      goal:'Moon flower',goalZh:'月球花朵',goalKo:'달 꽃',
      walls:[[-80,-80],[-80,-40],[-80,0],[80,0],[80,-40]],
      file:'Year6_Moon_Garden_Create.sb3',guide:'garden-template-scratch.jpg',preview:'garden-stage-scratch.jpg'}
  };
  for(const mission of Object.values(missions))mission.step=40;
  window.CheckpointCreateMissions=missions;
})();
