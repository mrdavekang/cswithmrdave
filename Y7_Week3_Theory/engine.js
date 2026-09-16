/* A bounded teaching visualiser, NOT a Python interpreter.
   Implements only numeric Turtle commands used in this lesson; no eval. */
(function (root) {
  'use strict';
  const num = '-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
  const rule = new RegExp('^t\\.(goto|forward|left|right|penup|pendown)\\(\\s*('+num+')?\\s*(?:,\\s*('+num+')\\s*)?\\)$');
  const clean = n => Math.abs(n) < 1e-9 ? 0 : Math.round(n * 1e8) / 1e8;
  function trace(code, start = {x:0, y:0, h:0, pen:true}) {
    const lines=String(code).split('\n');
    if(lines.length>30) throw Error('Use at most 30 lines in this lesson visualiser.');
    let s={x:start.x??0,y:start.y??0,h:start.h??0,pen:start.pen!==false};
    const states=[{...s, line:0, cmd:'Start', segments:[]}], segs=[];
    lines.forEach((raw,i)=>{
      const text=raw.split('#')[0].trim();
      if(!text){states.push({...s,line:i+1,cmd:raw||'(blank line)',segments:segs.map(x=>({...x}))});return;}
      const m=text.match(rule);
      if(!m) throw Error('Line '+(i+1)+': use t.goto(x, y), t.forward(distance), t.left(angle), t.right(angle), t.penup() or t.pendown(). Check brackets and commas.');
      const cmd=m[1], a=m[2]===undefined?null:Number(m[2]), b=m[3]===undefined?null:Number(m[3]);
      const count=(a!==null?1:0)+(b!==null?1:0), need=cmd==='goto'?2:['penup','pendown'].includes(cmd)?0:1;
      if(count!==need)throw Error('Line '+(i+1)+': '+cmd+' needs '+need+' numeric value'+(need===1?'':'s')+'.');
      if([a,b].some(x=>x!==null&&(!Number.isFinite(x)||Math.abs(x)>1000)))throw Error('Keep each value between -1000 and 1000.');
      const from={x:s.x,y:s.y};
      if(cmd==='goto'){s.x=a;s.y=b;}
      if(cmd==='forward'){s.x=clean(s.x+a*Math.cos(s.h*Math.PI/180));s.y=clean(s.y+a*Math.sin(s.h*Math.PI/180));}
      if(cmd==='right')s.h=clean(((s.h-a)%360+360)%360);
      if(cmd==='left')s.h=clean(((s.h+a)%360+360)%360);
      if(cmd==='penup')s.pen=false;
      if(cmd==='pendown')s.pen=true;
      if(cmd==='goto'||cmd==='forward')segs.push({x1:from.x,y1:from.y,x2:s.x,y2:s.y,draw:s.pen,line:i+1});
      states.push({...s,line:i+1,cmd:raw,segments:segs.map(x=>({...x}))});
    });
    return states;
  }
  function heading(h){h=((h%360)+360)%360;return ({0:'Right →',90:'Up ↑',180:'Left ←',270:'Down ↓'})[h]||h+'° anticlockwise from right';}
  function svg(s, options={}){
    const minX=options.minX??-120,maxX=options.maxX??120,minY=options.minY??-120,maxY=options.maxY??120;
    const W=480,H=400,p=40,scale=Math.min((W-p*2)/(maxX-minX),(H-p*2)/(maxY-minY));
    const ox=(W-(maxX-minX)*scale)/2,oy=(H-(maxY-minY)*scale)/2;
    const x=n=>ox+(n-minX)*scale,y=n=>oy+(maxY-n)*scale;
    let v=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Coordinate grid. Turtle at ${s.x}, ${s.y}. ${heading(s.h)}. Pen ${s.pen?'down':'up'}."><rect width="480" height="400" fill="white"/>`;
    const step=options.step??20;
    for(let n=Math.ceil(minX/step)*step;n<=maxX;n+=step)v+=`<line x1="${x(n)}" y1="${y(minY)}" x2="${x(n)}" y2="${y(maxY)}" stroke="${n===0?'#819499':'#e1e9e7'}"/><text x="${x(n)}" y="${H-12}" text-anchor="middle" font-size="11" fill="#4c6669">${n}</text>`;
    for(let n=Math.ceil(minY/step)*step;n<=maxY;n+=step)v+=`<line x1="${x(minX)}" y1="${y(n)}" x2="${x(maxX)}" y2="${y(n)}" stroke="${n===0?'#819499':'#e1e9e7'}"/><text x="22" y="${y(n)+4}" text-anchor="end" font-size="11" fill="#4c6669">${n}</text>`;
    v+=`<text x="454" y="389" font-size="13" fill="#35565a">x</text><text x="13" y="20" font-size="13" fill="#35565a">y</text>`;
    for(const q of (s.segments||[])){if(!q.draw&&!options.ghost)continue;v+=`<line x1="${x(q.x1)}" y1="${y(q.y1)}" x2="${x(q.x2)}" y2="${y(q.y2)}" stroke="${q.draw?'#087e83':'#a5adb1'}" stroke-width="${q.draw?4:2}" ${q.draw?'':'stroke-dasharray="5 5"'} stroke-linecap="round"/>`;}
    v+=`<g transform="translate(${x(s.x)},${y(s.y)}) rotate(${-s.h})"><path d="M12 0 L-9 -8 L-5 0 L-9 8 Z" fill="${s.pen?'#102f32':'white'}" stroke="#102f32" stroke-width="2"/></g></svg>`;
    return v;
  }
  root.TurtleModel={trace,heading,svg};
  if(typeof module!=='undefined')module.exports=root.TurtleModel;
})(typeof window!=='undefined'?window:globalThis);
