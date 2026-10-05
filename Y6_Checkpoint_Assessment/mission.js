/* One shared coordinate model for the website and the downloadable Scratch stage. */
(() => {
  'use strict';
  const model = {start:[-160,-80],key:[-40,40],portal:[160,40],step:40,
    walls:[[-80,-80],[-80,-40],[-80,0]], bounds:[-200,200,-120,120]};
  const moves={N:[0,40],E:[40,0],S:[0,-40],W:[-40,0]};
  function trace(commands){
    let position=[...model.start],key=false;const trail=[[...position]];
    for(let i=0;i<commands.length;i++){
      if(!moves[commands[i]])return {outcome:'invalid',trail,position,key};
      const delta=moves[commands[i]],next=[position[0]+delta[0],position[1]+delta[1]];
      if(next[0]<-200||next[0]>200||next[1]<-120||next[1]>120)return {outcome:'edge',at:i+1,trail,position,key};
      if(model.walls.some(p=>p[0]===next[0]&&p[1]===next[1]))return {outcome:'wall',at:i+1,trail,position,key};
      position=next;trail.push([...position]);if(position[0]===model.key[0]&&position[1]===model.key[1])key=true;
    }
    return {outcome:position[0]===model.portal[0]&&position[1]===model.portal[1]&&key?'success':'unfinished',trail,position,key};
  }
  // Coordinates map exactly to Scratch's 480 x 360 stage: px=x+240, py=180-y.
  function mapSvg(language=false,trail=null){
    const labels=language==='ko'?{start:'START / 출발',key:'KEY / 열쇠',end:'FINISH / 도착'}:language===true||language==='bi'?{start:'START / 起点',key:'KEY / 钥匙',end:'FINISH / 终点'}:{start:'START',key:'KEY',end:'FINISH'};
    let grid='';for(let x=20;x<=460;x+=40)grid+=`<path d="M${x} 40V320"/>`;for(let y=40;y<=320;y+=40)grid+=`<path d="M20 ${y}H460"/>`;
    const walls=model.walls.map(([x,y])=>`<rect x="${x+220}" y="${160-y}" width="40" height="40" fill="url(#hatch)" stroke="#37453d"/>`).join('');
    const keyX=model.key[0]+240,keyY=180-model.key[1];
    const trailLine=trail?.length>1?`<polyline points="${trail.map(([x,y])=>`${x+240},${180-y}`).join(' ')}" fill="none" stroke="#2269bd" stroke-width="3" stroke-dasharray="5 4" opacity=".7"/>`:'';
    return `<svg class="mission-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img" aria-label="Explorer starts at negative 160, negative 80. Key at negative 40, 40. Portal at 160, 40. Three wall squares at x negative 80, y negative 80, negative 40 and zero. Each square is 40 Scratch steps."><defs><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#d5ded8"/><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#7f8e83" stroke-width="2"/></pattern></defs><rect width="480" height="360" rx="12" fill="#fff"/><g stroke="#dde6df" fill="none">${grid}</g><path d="M240 40V320M20 180H460" fill="none" stroke="#90a697" stroke-width="1.5"/>${walls}${trailLine}<g font-family="Arial,sans-serif" text-anchor="middle" fill="#18352b"><text x="240" y="20" font-size="12">↑ +y</text><text x="445" y="345" font-size="12">+x →</text><text x="45" y="345" font-size="12">← −x</text><text x="240" y="345" font-size="12">−y ↓</text></g><g transform="translate(80 260)"><circle r="15" fill="#4c97ff" stroke="#18352b" stroke-width="2"/><circle cx="-5" cy="-3" r="2" fill="white"/><circle cx="5" cy="-3" r="2" fill="white"/><path d="M-6 5Q0 10 6 5" fill="none" stroke="#18352b" stroke-width="2"/></g><g transform="translate(${keyX} ${keyY})" fill="none" stroke="#966600" stroke-width="4"><circle cx="-4" cy="-4" r="7" fill="#ffda67"/><path d="M2 2L13 13M9 9L13 5"/></g><g transform="translate(400 140)" stroke="#2269bd" fill="#e5efff"><ellipse rx="13" ry="18" stroke-width="3"/><ellipse rx="7" ry="12" fill="white" stroke-width="2"/></g><g font-family="Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#18352b"><text x="80" y="291">${labels.start}</text><text x="80" y="307">(−160, −80)</text><text x="200" y="103">${labels.key}</text><text x="200" y="119">(−40, 40)</text><text x="400" y="103">${labels.end}</text><text x="400" y="119">(160, 40)</text></g></svg>`;
  }
  window.CheckpointMission={model,moves,trace,mapSvg};
})();
