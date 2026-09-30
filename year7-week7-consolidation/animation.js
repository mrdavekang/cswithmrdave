/* Playback of real Python-produced Turtle segments. Execution limits are separate. */
window.TurtlePlayback = {
  start(draws, {speed, paint, done}) {
    let frame=0, cancelled=false, last=null, index=0, elapsed=0;
    const shown=[];
    // Prepared setup positions Turtle before the student's drawing starts.
    if(draws[0]&&!draws[0].pen&&!draws[0].clear){shown.push(draws[0]);index=1;}
    const snapshot=()=>shown.slice();
    let current=snapshot();
    function tick(now){
      if(cancelled)return;
      const mode=speed();
      if(mode==='instant'){current=draws.slice();paint(current);done();return;}
      const rate=mode==='slow'?65:120;
      let budget=last===null?0:Math.min(80,now-last);last=now;
      while(index<draws.length){
        const d=draws[index];
        if(d.clear||!d.to||!d.from){shown.push(d);index++;elapsed=0;continue;}
        const distance=Math.hypot(d.to[0]-d.from[0],d.to[1]-d.from[1]);
        const duration=distance/(d.pen?rate:rate*2)*1000;
        if(duration===0){shown.push(d);index++;elapsed=0;continue;}
        const used=Math.min(budget,duration-elapsed);elapsed+=used;budget-=used;
        const f=Math.min(1,elapsed/duration);
        current=[...shown,{...d,to:[d.from[0]+(d.to[0]-d.from[0])*f,d.from[1]+(d.to[1]-d.from[1])*f]}];
        if(f<1){paint(current);frame=requestAnimationFrame(tick);return;}
        shown.push(d);index++;elapsed=0;
        if(budget<=0)break;
      }
      current=snapshot();paint(current);
      if(index===draws.length){done();return;}
      frame=requestAnimationFrame(tick);
    }
    paint(current);frame=requestAnimationFrame(tick);
    return {cancel(){cancelled=true;cancelAnimationFrame(frame);},current(){return current.slice();}};
  }
};
