window.TEACHER_ROUTE = (()=>{
  const stage=(id,label)=>({id,stage:id,label,time:LESSON.stages.find(s=>s.id===id).time});
  const slides=set=>LESSON.slides.filter(s=>s.set===set).map((s,i)=>({id:s.id,slide:s.id,set,index:i,label:'Teaching '+(i+1)+': '+s.title,time:LESSON.stages.find(s=>s.id==='teach'+set).time}));
  const steps=[...FitnessRehearsal.route.map(s=>stage(s.id,s.id==='s4home'?'Week 12 Session 2 · Final rehearsal':s.label)),...FitnessSession3.mainRoute.map(s=>stage(s.id,s.label)),stage('s3extension','Session 3 · Extension (optional)'),...FitnessSession2.stages.map(s=>stage(s.id,s.label)),stage('setup','Start here: files'),stage('starter','Do Now'),stage('learning','Types of learning'),stage('teach1','Four visual steps before Main Task 1'),stage('task1','Main Task 1'),stage('teach2','Read before Main Task 2'),...slides(2),stage('task2','Main Task 2'),stage('pitstop','Learning Pitstop'),stage('extension','Extension (optional)'),stage('finish','Plenary + submission')];
  const url=(step,zh)=>step.slide?`slides.html?embedded=1&set=${step.set}&slide=${step.index}&zh=${zh?1:0}`:`index.html?preview=1&embed=1&stage=${step.stage}&zh=${zh?1:0}`;
  return {steps,url};
})();
