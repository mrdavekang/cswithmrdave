window.RescueMap = (() => {
  const palette = {START:'#0f766e',A:'#7c3aed',B:'#e87918','1':'#64748b','2':'#64748b',EXIT:'#059669'};
  function view(m, draws=[]) {
    if (m?.id==='task1') return {xmin:-180,xmax:140,ymin:-120,ymax:100};
    if (m?.id==='task2') return {xmin:-40,xmax:200,ymin:-100,ymax:160};
    const positions=draws.flatMap(d=>d.to?[d.to]:[]);
    const xs=positions.map(p=>p[0]),ys=positions.map(p=>p[1]);
    return {xmin:Math.min(-200,...xs.map(x=>x-40)),xmax:Math.max(200,...xs.map(x=>x+40)),ymin:Math.min(-140,...ys.map(y=>y-40)),ymax:Math.max(140,...ys.map(y=>y+40))};
  }
  function transform(v,w=760,h=460) {
    const scale=Math.min((w-100)/(v.xmax-v.xmin),(h-85)/(v.ymax-v.ymin));
    const left=(w-(v.xmax-v.xmin)*scale)/2,top=(h-(v.ymax-v.ymin)*scale)/2;
    return {scale,point:(x,y)=>[left+(x-v.xmin)*scale,top+(v.ymax-y)*scale],inverse:(x,y)=>[v.xmin+(x-left)/scale,v.ymax-(y-top)/scale]};
  }
  function visible(draws) {const i=draws.map(d=>!!d.clear).lastIndexOf(true);return draws.slice(i+1);}
  function distanceToSegment(p,a,b) {const dx=b[0]-a[0],dy=b[1]-a[1],n=dx*dx+dy*dy;const u=n?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/n)):0;return Math.hypot(p[0]-a[0]-u*dx,p[1]-a[1]-u*dy);}
  function crossedRoom(a,b) {
    let t0=0,t1=1;const dx=b[0]-a[0],dy=b[1]-a[1];
    for(const [p,q] of [[-dx,a[0]-20],[dx,100-a[0]],[-dy,a[1]-40],[dy,80-a[1]]]){
      if(Math.abs(p)<1e-8){if(q<0)return false;}else{const r=q/p;if(p<0)t0=Math.max(t0,r);else t1=Math.min(t1,r);if(t0>t1)return false;}
    }return true;
  }
  function inspect(m,draws) {
    const lines=visible(draws).filter(d=>d.pen&&d.from&&d.to&&Math.hypot(d.to[0]-d.from[0],d.to[1]-d.from[1])>.001);
    const reached=(m.stops||[]).filter(([name,x,y])=>lines.some(d=>distanceToSegment([x,y],d.from,d.to)<.5)).map(p=>p[0]);
    const last=visible(draws).filter(d=>d.to).at(-1);
    return {reached,endpoint:last?.to||[0,0],crossed:m.id==='task2'&&lines.some(d=>crossedRoom(d.from,d.to)),lines:lines.length};
  }
  function paint(canvas,draws=[],m=null,robot=true) {
    canvas.width=760;canvas.height=460;
    const ctx=canvas.getContext('2d'),v=view(m,draws),tr=transform(v),point=tr.point;
    ctx.fillStyle='#fff';ctx.fillRect(0,0,760,460);
    const line=(a,b,color,width=1)=>{ctx.beginPath();ctx.moveTo(...point(...a));ctx.lineTo(...point(...b));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
    const tick=(v.xmax-v.xmin>600||v.ymax-v.ymin>500)?100:20;
    for(let x=Math.ceil(v.xmin/tick)*tick;x<=v.xmax;x+=tick)line([x,v.ymin],[x,v.ymax],'#e5ebf2');
    for(let y=Math.ceil(v.ymin/tick)*tick;y<=v.ymax;y+=tick)line([v.xmin,y],[v.xmax,y],'#e5ebf2');
    line([v.xmin,0],[v.xmax,0],'#8998ac',2);line([0,v.ymin],[0,v.ymax],'#8998ac',2);
    ctx.font='19px Arial';ctx.fillStyle='#4b5c73';ctx.textAlign='center';
    for(let x=Math.ceil(v.xmin/(tick*2))*tick*2;x<=v.xmax;x+=tick*2){if(!x)continue;const p=point(x,0);ctx.fillText(String(x),p[0],p[1]+25);}
    ctx.textAlign='right';for(let y=Math.ceil(v.ymin/(tick*2))*tick*2;y<=v.ymax;y+=tick*2){if(!y)continue;const p=point(0,y);ctx.fillText(String(y),p[0]-9,p[1]+6);}
    const zero=point(0,0);ctx.textAlign='left';ctx.fillText('0',zero[0]+8,zero[1]+25);
    const xt=point(v.xmax,0),yt=point(0,v.ymax);ctx.font='bold 23px Arial';ctx.fillText('x',xt[0]-5,xt[1]-12);ctx.fillText('y',yt[0]+10,yt[1]-8);
    if(m?.id==='task2'){
      const p=point(20,80),q=point(100,40);ctx.fillStyle='#fff0ed';ctx.fillRect(p[0],p[1],q[0]-p[0],q[1]-p[1]);ctx.strokeStyle='#c44c40';ctx.lineWidth=2;ctx.strokeRect(p[0],p[1],q[0]-p[0],q[1]-p[1]);
      ctx.fillStyle='#a83c31';ctx.textAlign='center';ctx.font='bold 20px Arial';ctx.fillText('BLOCKED',(p[0]+q[0])/2,(p[1]+q[1])/2-4);ctx.fillText('ROOM',(p[0]+q[0])/2,(p[1]+q[1])/2+20);
    }
    const vs=visible(draws),check=inspect(m||{},draws);
    for(const [name,x,y] of m?.stops||[]){
      const p=point(x,y),col=palette[name];ctx.beginPath();ctx.arc(...p,13,0,2*Math.PI);ctx.fillStyle=check.reached.includes(name)?col:'#fff';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();
      ctx.fillStyle=col;ctx.font='bold 23px Arial';ctx.textAlign='left';ctx.fillText(name,p[0]+17,p[1]-13);
      if(name==='A'||name==='B'){ctx.fillStyle=check.reached.includes(name)?'#fff':col;ctx.textAlign='center';ctx.font='bold 19px Arial';ctx.fillText('⚡',p[0],p[1]+7);}
    }
    let pos=[0,0],heading=0;
    for(const d of vs){if(d.from&&d.to){if(d.pen)line(d.from,d.to,d.color||'#176bba',Math.min(12,d.width||4)+1);if(Math.hypot(d.to[0]-d.from[0],d.to[1]-d.from[1])>.001)heading=Math.atan2(d.to[1]-d.from[1],d.to[0]-d.from[0]);pos=d.to;}}
    if(!vs.length&&m?.stops?.length)pos=m.stops[0].slice(1);
    if(robot){const p=point(...pos);ctx.save();ctx.translate(...p);ctx.rotate(-heading);ctx.fillStyle='#0f766e';[[0,-12],[0,12],[-14,-10],[-14,10]].forEach(([x,y])=>{ctx.beginPath();ctx.ellipse(x,y,5,4,0,0,Math.PI*2);ctx.fill();});ctx.beginPath();ctx.ellipse(-5,0,17,13,0,0,Math.PI*2);ctx.fillStyle='#34d399';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#065f46';ctx.stroke();ctx.beginPath();ctx.arc(16,0,7,0,Math.PI*2);ctx.fillStyle='#0f766e';ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(18,-2,2,0,Math.PI*2);ctx.fill();ctx.restore();}
    canvas._rescueTransform=tr;
    return check;
  }
  return {paint,inspect,view,visible};
})();
