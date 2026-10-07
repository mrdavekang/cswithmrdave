window.RescueReport = (() => {
  function create(state){
    const {jsPDF}=window.jspdf, doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W=1240,H=1754,margin=96,bottom=H-100,pages=[];let canvas,ctx,y;
    function page(){if(canvas)pages.push(canvas);canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle='#172b42';ctx.font='600 19px Raleway, Arial';ctx.fillText('YEAR 7  /  TURTLE RESCUE  /  PRACTICAL CHECKPOINT',margin,57);ctx.strokeStyle='#aab7c4';ctx.beginPath();ctx.moveTo(margin,76);ctx.lineTo(W-margin,76);ctx.stroke();y=126;}
    function room(h){if(y+h>bottom)page();}
    function text(s,{size=24,bold=false,mono=false,gap=12,color='#172b42'}={}){
      const font=`${bold?'750':'500'} ${size}px ${mono?'monospace':'Raleway, Arial, sans-serif'}`;
      ctx.font=font;const lines=[];
      for(const raw of String(s??'').replace(/\t/g,'    ').split('\n')){
        if(mono){let rest=raw;while(ctx.measureText(rest).width>W-2*margin-24){let n=rest.length;while(n>1&&ctx.measureText(rest.slice(0,n)).width>W-2*margin-24)n--;lines.push(rest.slice(0,n));rest=rest.slice(n);}lines.push(rest);}
        else{const words=raw.split(/(\s+)/);let line='';for(const word of words){if(ctx.measureText(line+word).width>W-2*margin&&line){lines.push(line.trimEnd());line=word.trimStart();}else line+=word;}if(ctx.measureText(line).width>W-2*margin){let rest=line;while(rest){let n=rest.length;while(n>1&&ctx.measureText(rest.slice(0,n)).width>W-2*margin)n--;lines.push(rest.slice(0,n));rest=rest.slice(n);}}else lines.push(line);}
      }
      for(const line of lines){room(size*1.5);ctx.font=font;ctx.fillStyle=color;ctx.fillText(line,margin,y);y+=size*1.5;}y+=gap;
    }
    function code(source,heading){const h=String(source).split('\n').length*31.5+75;if(h<bottom-126)room(h);if(heading)text(heading,{size:22,bold:true});text(source,{size:21,mono:true,gap:15});}
    page();text('Turtle Rescue - my work',{size:36,bold:true});text(`${state.profile.name}  |  Class: ${state.profile.class||'Teacher preview'}`,{bold:true});text(`Saved: ${new Date(state.updated).toLocaleString()}`,{size:20});
    for(const [label,value] of [['WAGBA',RescueLesson.wagba],['Knowledge',RescueLesson.k],['Skills',RescueLesson.s],['Understanding',RescueLesson.u]])text(`${label}: ${value}`,{size:22});
    text('This is a backup of attempts, not an automatically marked test. Hand the completed question paper to your teacher.',{size:20,color:'#4b5c73'});
    for(const m of RescueLesson.missions){const d=state.missions[m.id];if(!d||(m.extra&&!Object.keys(d.runs||{}).length&&!Object.keys(d.confirmed||{}).length))continue;room(230);text(`${m.tag}: ${m.title}`,{size:30,bold:true});text(m.goal,{size:22});
      for(let i=0;i<3;i++){const s=m.steps[i],hist=d.answerHistory?.[i]||[],first=hist[0]?.answer,last=d.answers?.[i];text(`${s.paper||s.label} ${s.label}: ${last|| (d.confirmed?.[i]?'Discussed with partner':i===1&&d.runs?.[1]?'Run recorded':'Not recorded')}${first&&first!==last?' | First choice: '+first:''}`,{size:22});}
      for(const i of [1,3,4]){const r=d.runs?.[i];if(!r)continue;if(i>=3){const h=r.last.code.split('\n').length*31.5+130;if(h<bottom-126)room(h);}text(`${m.steps[i].paper||''} ${m.steps[i].label}: ${r.count} run${r.count===1?'':'s'}. Last result: ${r.last.ok?'Python ran':'Error - '+r.last.error}`,{size:21});if(i>=3){code(r.last.code,`${m.steps[i].label} - last code run`);const current=d.drafts?.[i];if(current!==undefined&&current!==r.last.code)code(current,'Current edited code (not yet run)');}}
      const r=d.runs?.[4]?.last||d.runs?.[3]?.last||d.runs?.[1]?.last;if(r){const map=document.createElement('canvas');RescueMap.paint(map,r.draws,m);const ih=(W-2*margin)*map.height/map.width;room(ih+100);text(`${m.title} - last recorded output`,{size:22,bold:true});ctx.drawImage(map,margin,y,W-2*margin,ih);y+=ih+20;}
      text('Final commands copied to paper: '+(d.paper?'confirmed':'not confirmed'),{size:21});y+=15;
    }
    pages.push(canvas);pages.forEach((p,i)=>{const c=p.getContext('2d');c.fillStyle='#4b5c73';c.font='18px Raleway, Arial';c.fillText(`${state.profile.name} - ${i+1} / ${pages.length}`,margin,H-48);if(i)doc.addPage();doc.addImage(p.toDataURL('image/jpeg',.94),'JPEG',0,0,210,297,undefined,'FAST');});
    const safe=x=>String(x).normalize('NFKC').replace(/[^\p{L}\p{N}_-]/gu,'_').slice(0,70);
    return {blob:doc.output('blob'),name:`Year7_${safe(state.profile.class||'Preview')}_${safe(state.profile.name)}_TurtleRescue_Backup.pdf`,pages:pages.length};
  }
  return {create};
})();
