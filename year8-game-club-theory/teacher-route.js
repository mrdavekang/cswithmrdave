/* One complete visible sequence: all pupil activities, eight models and two discussions. */
window.GameTeacherRoute = (() => {
  const route=[],seen=new Set();
  for(const card of LESSON.cards){
    if(!seen.has(card.stage)){
      if(card.stage==='Loop typing reset')route.push({id:'discussion-1',kind:'discussion',round:1,stage:'Main Task 1',title:'Live discussion 1 · Add a late player'});
      if(card.stage==='Extension')route.push({id:'discussion-2',kind:'discussion',round:2,stage:'Main Task 2',title:'Live discussion 2 · Give everyone a turn'});
      if(card.stage==='Main Task 1'||card.stage==='Main Task 2'){
        const group=card.stage==='Main Task 1'?1:2;
        for(const slide of GameTeaching.slides.filter(s=>s.group===group))route.push({id:'teach-'+slide.id,kind:'teaching',stage:card.stage,title:slide.title,slide});
      }
      seen.add(card.stage);
    }
    route.push({id:card.id,kind:'activity',stage:card.stage,title:card.title,card});
  }
  return route;
})();
