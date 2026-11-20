/* Original motion illustrations for the two Cover Studio worlds. */
(() => {
  const live = new WeakMap();
  const tau = Math.PI * 2;
  function painter(g) {
    function path(d,fill,stroke,line=1){
      const p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p)}
      if(stroke){g.strokeStyle=stroke;g.lineWidth=line;g.stroke(p)}
    }
    function ellipse(x,y,rx,ry,color,tilt=0){
      g.beginPath();g.ellipse(x,y,rx,ry,tilt,0,tau);g.fillStyle=color;g.fill();
    }
    function ring(x,y,rx,ry,tilt,color,line,from=0,to=tau){
      g.beginPath();g.ellipse(x,y,rx,ry,tilt,from,to);g.strokeStyle=color;g.lineWidth=line;g.stroke();
    }
    function gradient(x,y,xx,yy,stops){
      const value=g.createLinearGradient(x,y,xx,yy);
      stops.forEach(([i,c])=>value.addColorStop(i,c));return value;
    }
    function spot(x,y,r,inner,outer){
      const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,inner);gr.addColorStop(1,outer);
      ellipse(x,y,r,r,gr);
    }
    function sparkle(x,y,r,color){
      g.save();g.translate(x,y);g.scale(r/10,r/10);
      path('M0 -11 Q1 -2 10 0 Q1 1 0 11 Q-1 1 -10 0 Q-1 -2 0 -11Z',color);g.restore();
    }
    function star(x,y,r,color,rot=0){
      g.save();g.translate(x,y);g.rotate(rot);g.scale(r/10,r/10);
      path('M0 -10 Q1 -10 3 -4 L9 -3 Q11 -2 9 0 L5 4 L6 9 Q6 11 4 10 L0 7 L-5 10 Q-7 10 -6 8 L-5 3 L-10 -1 Q-11 -3 -8 -3 L-3 -4Z',color);
      g.restore();
    }
    return {path,ellipse,ring,gradient,spot,sparkle,star};
  }
  function roller(g,w,t,p,active,complete) {
    const {path,ellipse,ring,gradient,spot,sparkle,star}=painter(g);
    const hot='#ff835f', cream='#fff3dc';
    g.fillStyle=gradient(0,0,w,240,[[0,'#311676'],[.45,'#7539b8'],[.8,'#c25eac'],[1,'#ff9b82']]);g.fillRect(0,0,w,240);
    spot(.83*w,39,154,'#ffc09a77','#ffc09a00');spot(.18*w,211,164,'#fc729e88','#fc729e00');
    // A sweeping track behind the ticket and a layered roller floor in front.
    path(`M-40 98 C${w*.17} 9 ${w*.39} 91 ${w*.49} 30 S${w*.75} -40 ${w+40} -15`,null,'#ccb2ff32',18);
    path(`M-40 94 C${w*.17} 5 ${w*.39} 87 ${w*.49} 26 S${w*.75} -44 ${w+40} -19`,null,'#f1d4ff65',2);
    for(let i=0;i<6;i++){
      const x=(.055+i*.163)*w,y=30+(i*29)%87;
      sparkle(x,y,3.5+Math.sin(t+i),i%2?'#ffe0cf':'#c4a3ff');
    }
    path(`M-15 184 Q${w*.30} 108 ${w*.55} 157 T${w+15} 130 L${w+15} 247 H-15Z`,gradient(0,128,0,240,[[0,'#7450bb'],[1,'#381f73']]));
    const tracks=[
      [`M-22 164 C${w*.23} 145 ${w*.36} 224 ${w*.6} 180 S${w*.85} 116 ${w+25} 146`, '#ed9aba',12,'#ffd2bd'],
      [`M-24 209 C${w*.23} 173 ${w*.42} 268 ${w*.68} 205 S${w*.93} 155 ${w+42} 172`, '#f58288',20,'#ffb691'],
      [`M-34 233 C${w*.27} 196 ${w*.39} 294 ${w*.74} 225 S${w*.95} 199 ${w+22} 195`, '#44306c',5,'#a27ac4']
    ];
    for(const [d,c,line,light] of tracks){path(d,null,'#563268',line+4);path(d,null,c,line);path(d,null,light,2);}
    const hoop=(x,y,r)=>{
      ring(x+3,y+4,r*.47,r,.28,'#592969',8);
      ring(x,y,r*.47,r,.28,gradient(x-r,y-r,x+r,y+r,[[0,'#fff1c7'],[.37,'#ffc88f'],[.65,'#fb83ae'],[1,'#d381fe']]),7);
      ring(x-1,y-1,r*.47,r,.28,'#fff4de',1.4,3.3,5.6);
    };
    const finish=w*.85;
    hoop(w*.26,134,28);hoop(w*.6,148,32);hoop(finish,121,43);
    const frac=complete?1:active?p:.42+.021*Math.sin(t*.6);
    const x=w*(.075+.775*frac),y=127+11*Math.sin(frac*5.6)-Math.sin(t*2.6)*2;
    ellipse(x+3,169+5*Math.sin(frac*5.6),35,4,'#39206259');
    g.save();g.translate(x,y);g.rotate(-.13+.035*Math.sin(t*2.6));
    // Soft speed trails, ticket-paper face, perforation and skate wheels.
    path('M-31 -2 Q-48 0 -61 -5',null,'#e3bbff',2);
    path('M-31 5 Q-50 12 -73 3',null,'#ffb7c755',3);
    path('M-24 12 Q-17 26 -5 24 L20 20 Q26 19 28 15',null,'#322051',5);
    ellipse(-11,24,4.7,4.7,'#874da4');ellipse(16,20,4.7,4.7,'#874da4');
    ellipse(-11,24,2,2,'#ffe2aa');ellipse(16,20,2,2,'#ffe2aa');
    const ticket='M-28 -22 Q-28 -27 -23 -27 L22 -27 Q27 -27 27 -22 L27 -11 C17 -10 17 0 27 1 L27 10 Q27 15 22 16 L-23 20 Q-28 20 -28 15 L-28 6 C-18 4 -18 -6 -28 -6Z';
    g.save();g.translate(2,3);path(ticket,'#844575');g.restore();
    path(ticket,gradient(-27,-27,24,20,[[0,'#fff7cf'],[.55,'#ffdba7'],[1,hot]]),'#613265',1.4);
    g.save();g.setLineDash([1.5,3]);path('M15 -23 L15 12',null,'#bd717d',1.3);g.restore();
    path('M-13 -6 Q-10 -10 -7 -6 M-1 -7 Q2 -11 5 -7',null,'#513057',2.5);
    path('M-7 -1 Q-3 4 1 -2',null,'#513057',1.7);
    ellipse(-15,-1,3,1.7,'#f59890');ellipse(7,-3,3,1.7,'#f59890');
    star(20,-16,3.3,'#b55d79');g.restore();
    if(complete){for(let i=0;i<6;i++)sparkle(finish+Math.cos(i)*32,108+Math.sin(i)*32,4+Math.sin(t*2+i),cream);}
  }
  function orbit(g,w,t,p,active,complete){
    const {path,ellipse,ring,gradient,spot,sparkle,star}=painter(g);
    g.fillStyle=gradient(0,0,w,220,[[0,'#161d70'],[.46,'#294aaf'],[1,'#78a9ed']]);g.fillRect(0,0,w,240);
    spot(.74*w,46,150,'#91bcff63','#91bcff00');spot(w*.08,220,130,'#3d51d965','#3d51d900');
    for(let i=0;i<24;i++){const x=(i*.6180339887%1)*w, y=10+(i*37)%145;
      if(i%5===0)sparkle(x,y,3+Math.sin(t*1.2+i),'#d8eaff');else ellipse(x,y,(i%3+1)*.53,(i%3+1)*.53,'#d0e4ff');}
    const px=w*.73,py=76;
    // Deep-space arcs pass behind a warm, banded gas planet.
    ring(px,py,w*.40,37,-.18,'#afcfff4f',1);ring(px,py,w*.43,47,-.18,'#a4c4ff22',1);
    g.save();g.translate(px,py);g.rotate(-.22);
    ring(0,0,70,16,-.06,'#efb9a8',6);
    const ball=g.createRadialGradient(-10,-15,2,4,6,43);ball.addColorStop(0,'#ffe6af');ball.addColorStop(.54,'#ffac7a');ball.addColorStop(1,'#dc6c8b');
    ellipse(0,0,34,34,ball);g.save();g.beginPath();g.arc(0,0,34,0,tau);g.clip();
    path('M-38 -12 Q-20 -18 1 -11 T40 -11',null,'#ffddb171',5);path('M-39 14 Q-18 10 -2 16 T39 16',null,'#e981858c',4);
    g.restore();ring(0,0,70,16,-.06,'#ffd3a1',6,0,Math.PI);ring(0,-1,70,16,-.06,'#fff1bf',1.2,0,Math.PI);g.restore();
    function shore(y,c,s){
      path(`M-10 ${y+12} Q${w*.10} ${y-17*s} ${w*.17} ${y+3} Q${w*.23} ${y-13*s} ${w*.34} ${y+9} Q${w*.45} ${y-11*s} ${w*.56} ${y+4} Q${w*.67} ${y-19*s} ${w*.75} ${y+5} Q${w*.84} ${y-14*s} ${w*.92} ${y+2} Q${w} ${y-12*s} ${w+12} ${y} V250 H-10Z`,c);
    }
    shore(183,'#6482ce',1);shore(198,'#465eb6',1);shore(213,'#34459a',1.1);
    path(`M-26 202 Q${w*.19} 161 ${w*.40} 192 T${w*.84} 177 Q${w*.97} 157 ${w+25} 163`,null,'#99beed74',2);
    const yAt=q=>146-18*Math.sin(q*Math.PI*1.5);
    for(let i=1;i<=6;i++){const q=i/6,x=w*(.1+.79*q);if(complete || (active&&p>=q))continue;
      star(x,yAt(q),i===6?13:6,'#ffce82',Math.sin(t+i)*.11);
      if(i===6)sparkle(x+14,yAt(q)-11,3,'#fff0c3');
    }
    const fraction=complete?1:active?p:.32+.035*Math.sin(t*.6),x=w*(.1+.79*fraction), y=yAt(fraction)+2*Math.sin(t*2.6);
    g.save();g.translate(x,y);g.rotate(-.19-.08*Math.cos(fraction*Math.PI*1.5));
    path('M-24 -6 Q-53 -6 -71 0 Q-51 3 -35 8 Q-43 4 -51 4 Q-29 14 -18 5Z',gradient(-65,0,-18,0,[[0,'#bab4ff00'],[.4,'#ff9a99'],[1,'#ffce71']]));
    const burn=2*Math.sin(t*5.8);
    path(`M-21 -8 Q-36 -10 ${-48+burn} -2 Q-41 0 -44 4 Q-32 4 -21 10Z`,'#ff9662');
    path('M-21 -4 Q-33 -4 -39 0 Q-30 4 -21 4Z','#ffedb3');
    path('M-12 -8 Q-7 -23 7 -26 Q12 -26 8 -20 L5 -11Z','#ffad8d','#713f85',1);
    path('M-13 7 Q-13 17 -6 23 Q-3 25 0 19 L5 10Z','#ef7e86','#713f85',1);
    path('M-22 -10 Q-9 -19 4 -16 Q22 -13 32 -2 Q36 1 30 5 Q16 15 -2 14 Q-14 14 -23 8Z',gradient(0,-17,0,15,[[0,'#fdf5e4'],[.55,'#f8d5cd'],[1,'#b7afd3']]),'#493c86',1.5);
    path('M17 -10 Q27 -6 32 -2 Q35 2 30 5 L19 10 Q24 2 17 -10Z','#ff825c');
    path('M-24 -9 L-18 -10 Q-15 0 -18 10 L-24 8Z','#7065b1');
    ellipse(-1,-2,9,9,'#6a62ac');ellipse(-1,-2,6.6,6.6,'#81b9ff');
    path('M-5 -3 Q-5 -7 0 -7',null,'#e7efff',1.5);g.restore();
    if(complete)for(let i=0;i<7;i++)sparkle(x+Math.cos(i)*40,y+Math.sin(i)*27,4+Math.sin(t*2+i),'#ffe0a0');
  }
  window.drawCoverArcade=function(canvas,day,progress=0,{active=false,complete=false}={}){
    if(!canvas || !canvas.getContext)return ()=>{};
    live.get(canvas)?.();
    const g=canvas.getContext('2d');if(!g)return ()=>{};
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let closed=false,id=0,last=-1,stale=true;
    const fraction=Math.min(1,Math.max(0,Number(progress)||0));
    const scene=Number(day)===1?roller:orbit;
    function frame(now){
      if(closed)return;
      if(!canvas.isConnected){cleanup();return;}
      const box=canvas.getBoundingClientRect(),cw=box.width||360,ch=box.height||165;
      const ratio=Math.min(window.devicePixelRatio||1,2,1900/cw,720/ch);
      const width=Math.max(1,Math.round(cw*ratio)),height=Math.max(1,Math.round(ch*ratio));
      if(stale||now-last>=33){
        if(canvas.width!==width)canvas.width=width;if(canvas.height!==height)canvas.height=height;
        g.setTransform(height/240,0,0,height/240,0,0);g.lineCap='round';g.lineJoin='round';
        scene(g,width*240/height,motion.matches?0:now/1000,fraction,active,complete);
        last=now;stale=false;
      }
      if(!motion.matches&&!document.hidden)id=requestAnimationFrame(frame);
    }
    function refresh(){cancelAnimationFrame(id);stale=true;frame(performance.now());}
    function cleanup(){
      closed=true;cancelAnimationFrame(id);ro?.disconnect();
      motion.removeEventListener('change',refresh);document.removeEventListener('visibilitychange',refresh);
      if(live.get(canvas)===cleanup)live.delete(canvas);
    }
    const ro=typeof ResizeObserver==='function'?new ResizeObserver(refresh):null;
    ro?.observe(canvas);motion.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
    canvas.style.imageRendering='auto';live.set(canvas,cleanup);refresh();return cleanup;
  };
})();
