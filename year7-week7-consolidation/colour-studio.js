/* Colour choices become real Python, not a visual filter over the evidence. */
window.TurtleColourStudio=(()=>{
 const palette=[['Red','#d83d4b'],['Orange','#df6c16'],['Gold','#b9830a'],['Green','#18805a'],['Blue','#2874d0'],['Indigo','#6252c9'],['Purple','#a047bb'],['Pink','#d34491']];
 const rainbow=palette.slice(0,7).map(x=>x[1]);
 function stripManaged(source){return source.replace(/^(?:\r?\n)?# Colour studio BEGIN\r?\n[\s\S]*?^# Colour studio END\r?\n?/gm,'').replace(/^[ \t]*t\.pencolor\([^\n]*\)[ \t]+# Colour studio line\r?\n?/gm,'');}
 function apply(source,style){
  if(!['solid','rainbow'].includes(style.mode))return {ok:false,message:'Choose a line colour or Rainbow.'};
  if(style.mode==='solid'&&!/^#[0-9a-f]{6}$/i.test(style.colour))return {ok:false,message:'Choose a colour using the colour picker.'};
  const clean=stripManaged(String(source)).replace(/\r\n/g,'\n'),lines=clean.split('\n'),importAt=lines.findIndex(x=>/^import\s+turtle\s+as\s+t\s*(?:#.*)?$/.test(x));
  if(importAt<0)return {ok:false,message:'This colour tool uses import turtle as t. Keep your code, or use the lesson starter before adding a colour.'};
  const loops=[];
  for(let i=0;i<lines.length;i++){
   const m=lines[i].match(/^(\s*)for\s+([A-Za-z_]\w*)\s+in\s+range\([^\n]*\)\s*:\s*(?:#.*)?$/);if(!m)continue;
   let bodyStart=-1,moveAt=-1,indent='';
   for(let j=i+1;j<lines.length;j++){
    if(!lines[j].trim()||lines[j].trim().startsWith('#'))continue;
    const spaces=(lines[j].match(/^\s*/)||[''])[0];if(spaces.length<=m[1].length)break;
    if(bodyStart<0){bodyStart=j;indent=spaces;}
    if(spaces===indent&&/^\s*t\.(?:forward|backward|goto|circle|fd|bk|setpos|setposition)\s*\(/.test(lines[j])){moveAt=j;break;}
   }
   if(bodyStart>=0)loops.push({at:moveAt>=0?moveAt:bodyStart,indent,counter:m[2]});
  }
  if(style.mode==='rainbow'&&!loops.length)return {ok:false,message:'Rainbow changes colour on each repeat. Use a multi-line for … in range(…) loop, or try the Rainbow arc challenge. You can still choose one line colour.'};
  for(const loop of loops.reverse())lines.splice(loop.at,0,loop.indent+(style.mode==='rainbow'?'t.pencolor(_studio_colours['+loop.counter+' % len(_studio_colours)])':'t.pencolor("'+style.colour.toLowerCase()+'")')+'  # Colour studio line');
  const setup=style.mode==='rainbow'?['_studio_colours = [',...Array.from({length:3},(_,row)=>'    '+rainbow.slice(row*3,row*3+3).map(x=>'"'+x+'"').join(', ')+','),']']:['t.pencolor("'+style.colour.toLowerCase()+'")'];
  lines.splice(importAt+1,0,'','# Colour studio BEGIN',...setup,'# Colour studio END');
  const ownColours=/\bt\.(?:pencolor|color)\s*\(/.test(clean);
  return {ok:true,code:lines.join('\n'),message:style.mode==='rainbow'?'Rainbow code added. Tap Run: each repeat uses a new colour. Your movements and turns stay the same.':ownColours?'Colour added before drawing. Your own later colour commands can change it again. Tap Run to see the result.':'Line colour added. Tap Run to see it. Your movements and turns stay the same.'};
 }
 return {palette,rainbow,apply};
})();
