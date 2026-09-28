/* Exact 800 × 600 Turtle coordinates. The illustrated map is inspiration,
   not a stretched coordinate background. World (0,0) is canvas (400,300). */
window.RouteMap = (() => {
  const W=800,H=600,point=(x,y)=>[400+x,300-y];
  function line(c,x1,y1,x2,y2,color='#31454f',width=3){c.beginPath();c.moveTo(...point(x1,y1));c.lineTo(...point(x2,y2));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  function box(c,x,y,w,h,fill,stroke='#344650'){const [px,py]=point(x,y);c.fillStyle=fill;c.fillRect(px,py,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=4;c.strokeRect(px,py,w,h);}}
  function text(c,label,x,y,size=16,color='#20343e',align='center'){c.font=`${size>=17?'bold ':''}${size}px Arial`;c.textAlign=align;c.fillStyle=color;c.fillText(label,...point(x,y));}
  function dot(c,x,y,color,label){c.beginPath();c.arc(...point(x,y),7,0,Math.PI*2);c.fillStyle=color;c.fill();c.lineWidth=2;c.strokeStyle='#fff';c.stroke();if(label)text(c,label,x,y-20,13);}
  function paint(canvas,draws=[],opts={}){
    const c=canvas.getContext('2d');canvas.width=W;canvas.height=H;c.fillStyle='#fff';c.fillRect(0,0,W,H);
    if(opts.map!==false){
      box(c,-315,225,630,460,'#f3f4f4',null);
      // Walkable corridor union; openings connect rooms without crossing a wall.
      const poly=[[-30,-230],[30,-230],[30,70],[140,70],[140,130],[30,130],[30,170],[-30,170],[-30,130],[-140,130],[-140,70],[-30,70],[-30,-70],[-140,-70],[-140,-130],[-30,-130]];
      c.beginPath();poly.forEach((p,i)=>i?c.lineTo(...point(...p)):c.moveTo(...point(...p)));c.closePath();c.fillStyle='#edf7fc';c.fill();c.strokeStyle='#344650';c.lineWidth=4;c.stroke();
      box(c,-300,-45,160,120,'#fff5df');box(c,-300,210,160,155,'#edf5e7');box(c,140,210,160,155,'#e9f3fc');box(c,30,40,105,70,'#f5eeee');
      line(c,-140,-78,-140,-122,'#edf7fc',6);line(c,-140,78,-140,122,'#edf7fc',6);line(c,140,78,140,122,'#edf7fc',6);
      line(c,30,10,30,-10,'#f5eeee',6);line(c,-17,-230,17,-230,'#edf7fc',6);
      // Small recognisable furniture, never covering a destination or corridor.
      box(c,-288,-129,84,22,'#e5cfab',null);text(c,'Desk',-246,-144,11);
      for(let n=0;n<3;n++)box(c,-290+n*22,187,14,40,'#bed3ad',null);
      for(let n=0;n<3;n++){box(c,160+n*42,188,28,18,'#bfd8e7','#7c97a5');line(c,174+n*42,169,174+n*42,162,'#607786',2);}
    }
    // Grid uses uniform 50-unit spacing, same scale on both axes.
    for(let x=-350;x<=350;x+=50)line(c,x,-250,x,250,'#bdcbd755',1);
    for(let y=-250;y<=250;y+=50)line(c,-350,y,350,y,'#bdcbd755',1);
    line(c,-350,0,350,0,'#607d9480',1);line(c,0,-250,0,250,'#607d9480',1);
    for(let x=-300;x<=300;x+=100)text(c,String(x),x,-276,13,'#426078');
    for(let y=-200;y<=200;y+=100)text(c,String(y),-367,y-4,13,'#426078');
    text(c,'x',370,-276,16);text(c,'y',-367,265,16);text(c,'(0, 0)',43,-17,12,'#526c7d');
    if(opts.map!==false){
      text(c,'Reception',-220,-67,19);text(c,'(-200, -100)',-220,-86,13);dot(c,-200,-100,'#c97a18');
      text(c,'Library',-205,148,19);text(c,'(-200, 100)',-217,124,13);dot(c,-200,100,'#8153a5');
      text(c,'Computer Room C1',220,144,15);text(c,'(200, 100)',220,122,13);dot(c,200,100,'#167ab1');
      text(c,'Staff only',82,17,15);text(c,'No entry',82,-4,12,'#a84137');
      text(c,'Main Entrance',0,-250,16);dot(c,0,-200,'#238552');text(c,'START (0, -200)',97,-216,13);
      text(c,'Corridor',-82,-94,12);text(c,'Corridor',-80,95,12);
    }
    let end=opts.map!==false?[0,-200]:[0,0];
    for(const d of draws){if(d.clear){return paint(canvas,draws.slice(draws.indexOf(d)+1),opts);}if(!d.to)continue;if(d.pen&&d.from){c.save();c.lineCap='round';line(c,...d.from,...d.to,d.color||'#154f9e',Math.min(12,d.width||4));c.restore();}end=d.to;}
    if(draws.length){c.beginPath();c.arc(...point(...end),5,0,Math.PI*2);c.fillStyle='#163d7a';c.fill();}
    if(opts.picked){const [px,py]=point(...opts.picked);c.strokeStyle='#b3422a';c.lineWidth=2;c.strokeRect(px-8,py-8,16,16);}
    return canvas;
  }
  function contains(x,y){return (Math.abs(x)<=30&&y>=-230&&y<=170)||(x>=-300&&x<=-140&&y>=-165&&y<=-45)||(x>=-140&&x<=0&&y>=-130&&y<=-70)||(x>=-300&&x<=-140&&y>=55&&y<=210)||(x>=140&&x<=300&&y>=55&&y<=210)||(x>=-140&&x<=140&&y>=70&&y<=130);}
  function check(draws){const seg=draws.filter(d=>d.pen&&d.from&&d.to&&Math.hypot(d.to[0]-d.from[0],d.to[1]-d.from[1])>.01);let safe=seg.length>0,continuous=true;seg.forEach((d,i)=>{const n=Math.ceil(Math.hypot(d.to[0]-d.from[0],d.to[1]-d.from[1])/3);for(let k=0;k<=n;k++)if(!contains(d.from[0]+(d.to[0]-d.from[0])*k/n,d.from[1]+(d.to[1]-d.from[1])*k/n))safe=false;if(i&&Math.hypot(d.from[0]-seg[i-1].to[0],d.from[1]-seg[i-1].to[1])>1)continuous=false;});return {start:!!seg.length&&Math.hypot(seg[0].from[0],seg[0].from[1]+200)<2,finish:!!seg.length&&Math.hypot(seg.at(-1).to[0]+200,seg.at(-1).to[1]+100)<2,safe,continuous};}
  function pythonBackground(){return `# Prepared practice map. You only edit YOUR ROUTE at the bottom.\nimport turtle as t\n\nscreen = t.Screen()\nscreen.setup(840, 660)\nscreen.title("Year 7 - My first working route")\nscreen.tracer(0)\np = t.Turtle(visible=False)\np.speed(0)\n\ndef line(x1, y1, x2, y2, colour="#344650", width=3):\n    p.penup()\n    p.goto(x1, y1)\n    p.pencolor(colour)\n    p.pensize(width)\n    p.pendown()\n    p.goto(x2, y2)\n    p.penup()\n\ndef polygon(points, fill):\n    p.penup()\n    p.goto(points[0])\n    p.color("#344650", fill)\n    p.pensize(3)\n    p.pendown()\n    p.begin_fill()\n    for point in points[1:] + [points[0]]:\n        p.goto(point)\n    p.end_fill()\n    p.penup()\n\ndef rectangle(x, y, width, height, fill):\n    polygon([(x,y),(x+width,y),(x+width,y-height),(x,y-height)], fill)\n\ndef label(text, x, y, size=12):\n    p.penup()\n    p.goto(x,y)\n    p.pencolor("#20343e")\n    p.write(text, align="center", font=("Arial", size, "normal"))\n\npolygon([(-30,-230),(30,-230),(30,70),(140,70),(140,130),(30,130),(30,170),(-30,170),(-30,130),(-140,130),(-140,70),(-30,70),(-30,-70),(-140,-70),(-140,-130),(-30,-130)], "#edf7fc")\nrectangle(-300,-45,160,120,"#fff5df")\nrectangle(-300,210,160,155,"#edf5e7")\nrectangle(140,210,160,155,"#e9f3fc")\nrectangle(30,40,105,70,"#f5eeee")\nline(-140,-78,-140,-122,"#edf7fc",6)\nline(-140,78,-140,122,"#edf7fc",6)\nline(140,78,140,122,"#edf7fc",6)\nline(30,10,30,-10,"#f5eeee",6)\nline(-17,-230,17,-230,"#edf7fc",6)\nfor x in range(-350,351,50):\n    line(x,-250,x,250,"#dce5eb",1)\nfor y in range(-250,251,50):\n    line(-350,y,350,y,"#dce5eb",1)\nfor x in range(-300,301,100):\n    label(str(x),x,-280,10)\nfor y in range(-200,201,100):\n    label(str(y),-372,y-5,10)\nlabel("x",370,-280)\nlabel("y",-372,260)\nlabel("Main Entrance",0,-250)\nlabel("Reception",-220,-67)\nlabel("(-200, -100)",-220,-86,10)\nlabel("Library",-220,148)\nlabel("(-200, 100)",-220,125,10)\nlabel("Computer Room C1",220,145)\nlabel("(200, 100)",220,122,10)\nlabel("Staff only",82,12,10)\nfor x,y,colour in [(0,-200,"green"),(-200,-100,"orange"),(-200,100,"purple"),(200,100,"blue")]:\n    p.goto(x,y)\n    p.dot(12,colour)\nscreen.update()\nscreen.tracer(1)\n\n# YOUR ROUTE - your saved student code follows.\n`;}
  return {paint,point,contains,check,pythonBackground};
})();
