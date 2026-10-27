/* Checks use real Python state/output plus changed data, not exact solution text. */
const GameChecks=(()=>{
 const lines=s=>String(s||'').trim().split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const canonical=s=>String(s).replace(/"/g,"'").replace(/\s+/g,'');
 const listLine=(out,list)=>lines(out).some(x=>canonical(x)===canonical(JSON.stringify(list)));
 const only=(r,want)=>equal(lines(r.stdout),want.map(String));
 const source=code=>code.split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 function replaceList(code,name,values){
  const re=new RegExp('^'+name+'\\s*=\\s*\\[','m'),m=re.exec(code);if(!m)return null;
  let i=m.index+m[0].length,depth=1,q=null,escape=false;
  for(;i<code.length;i++){const c=code[i];if(q){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===q)q=null;}else if(c==='"'||c==="'")q=c;else if(c==='[')depth++;else if(c===']'&&!--depth)return code.slice(0,m.index)+name+' = '+JSON.stringify(values)+code.slice(i+1);}
  return null;
 }
 const hasLoop=c=>/^\s*while\s+.+:/m.test(source(c));
 const hasAppend=c=>/\bplayers\s*\.\s*append\s*\(/.test(source(c));
 const chooses=c=>/\b(?:random\s*\.\s*)?choice\s*\(/.test(source(c));
 const rosterOnce=c=>(source(c).match(/^players\s*=/gm)||[]).length===1;
 function primary(kind,code,r){
  if(r.error)return {ok:false,message:'Python stopped: '+r.error+' Read the line number, make one change, and run again. Your draft is saved.'};
  const p=r.vars.players,ready=['Nova','Luna','Pixel','Orbit'],original=['Nova','Echo','Pixel'];let ok=false,msg='';
  switch(kind){
   case 'append':ok=equal(p,[...original,'Orbit'])&&hasAppend(code)&&rosterOnce(code)&&listLine(r.stdout,p);msg='Keep Nova, Echo and Pixel; append Orbit once, then print the whole players list.';break;
   case 'roster':ok=equal(p,ready)&&rosterOnce(code)&&hasAppend(code)&&/\blen\s*\(\s*players\s*\)/.test(source(code))&&listLine(r.stdout,p)&&lines(r.stdout).at(-1)==='4';msg='Use the original list. Replace Echo with Luna, append Orbit, print the whole list and then len(players).';break;
   case 'longer':ok=equal(p,['Nova','Echo','Pixel','Ash','Luna','Orbit'])&&hasAppend(code)&&rosterOnce(code)&&listLine(r.stdout,p);msg='Replace only index 3 with Ash, append Orbit, and print the resulting list.';break;
   case 'adapt':ok=equal(p,['Ash','Orbit','Comet'])&&hasAppend(code)&&rosterOnce(code)&&only(r,['3'])&&/\blen\s*\(/.test(source(code));msg='Replace the first existing value, append Comet and print the calculated count.';break;
   case 'last':ok=equal(p,ready)&&only(r,['Orbit']);msg='Print just the last player, using a size-safe index such as len(players) - 1.';break;
   case 'loop':ok=equal(p,ready)&&hasLoop(code)&&only(r,ready);msg='Print each player once, in order, using while. Check the starting counter, < len(players), indentation and increment.';break;
   case 'loopcount':ok=Array.isArray(p)&&p.length===5&&hasLoop(code)&&only(r,[...p,'5']);msg='Print all five players with while, then print len(players) outside the loop.';break;
   case 'captain':ok=equal(p,ready)&&chooses(code)&&p.includes(r.vars.captain)&&only(r,['Captain: '+r.vars.captain]);msg='Choose from players into captain and print the label Captain: followed by that chosen value.';break;
   case 'combine':ok=equal(p,ready)&&hasLoop(code)&&chooses(code)&&p.includes(r.vars.captain)&&only(r,['Players ready: 4',...p,'Captain: '+r.vars.captain]);msg='Check the order: labelled count, names using while, then labelled random captain.';break;
   case 'rounds':case 'fiverounds':{const n=kind==='rounds'?3:5;ok=equal(p,ready)&&hasLoop(code)&&chooses(code)&&lines(r.stdout).length===n&&lines(r.stdout).every(x=>p.includes(x))&&(kind!=='fiverounds'||r.vars.rounds===5);msg='Use while to print exactly '+n+' captain names, one per line. Repeated choices are allowed.';break;}
   case 'firstlast':ok=equal(p,ready)&&only(r,['Nova','Orbit']);msg='Print the first name, then the current final name. Do not print the whole list.';break;
   case 'arrival':ok=equal(p,[...ready,'Comet'])&&hasAppend(code)&&rosterOnce(code)&&only(r,['Players ready: 5']);msg='Append Comet once, then print Players ready: and len(players).';break;
   case 'reverse':ok=equal(p,ready)&&hasLoop(code)&&only(r,[...ready].reverse());msg='Start at the last valid index, print and decrease the counter. Stop after index 0.';break;
   case 'availableprint':ok=equal(p,['Nova','Echo','Pixel','Orbit'])&&hasLoop(code)&&only(r,['Nova','Pixel','Orbit']);msg='Keep players unchanged. Inside while, skip Echo and print the other names in order.';break;
   case 'availablelist':ok=equal(p,['Nova','Echo','Pixel','Orbit'])&&hasLoop(code)&&equal(r.vars.available,['Nova','Pixel','Orbit'])&&listLine(r.stdout,r.vars.available);msg='Build available from the loop, excluding Echo, then print available. Leave players unchanged.';break;
   case 'empty':ok=equal(p,[])&&only(r,['Add a player first']);msg='For an empty players list, print exactly Add a player first without calling random.choice.';break;
   case 'safechoice':ok=equal(p,['Nova','Echo','Pixel'])&&equal(r.vars.available,['Nova','Pixel'])&&r.vars.available.includes(r.vars.captain)&&only(r,[r.vars.captain])&&hasLoop(code)&&chooses(code);msg='Build available without Echo; check before choosing; save in captain and print its name.';break;
   case 'turns':ok=equal(r.vars.waiting,[])&&hasLoop(code)&&chooses(code)&&equal(lines(r.stdout).sort(),[...ready].sort());msg='Choose from waiting, print the chosen name, remove it, and stop when waiting is empty. No repeated turns.';break;
  }
  return {ok,message:ok?'Your original roster test works. Now checking changed data…':msg};
 }
 async function check(card,code,result,run){
  const first=primary(card.check,code,result),tests=[{label:'Your starting data',...result,ok:first.ok}];if(!first.ok)return {...first,tests};
  const variantKinds=['append','roster','longer','adapt','arrival','last','loop','loopcount','captain','combine','firstlast','reverse','availableprint','availablelist','empty','safechoice','turns'];
  if(variantKinds.includes(card.check)){
   const cases=['append','roster'].includes(card.check)?[['Ash','Echo','Bee']]:card.check==='longer'?[['Bee','Dot','Fin','Comet','Ash']]:card.check==='adapt'?[['Luna','Bee']]:card.check==='arrival'?[['Ash']]:card.check==='turns'?[['Ash'],['Ash','Bee','Comet']]:card.check==='safechoice'?[['Echo'],['Ash','Echo','Bee']]:card.check==='empty'?[['Ash'],['Ash','Bee']]:card.check.startsWith('available')?[['Ash','Echo','Bee'],['Echo']]:[['Ash'],['Ash','Bee','Comet','Dot','Fin']];
   for(const roster of cases){
    const changed=replaceList(code,card.check==='turns'?'waiting':'players',roster);
    if(changed===null)return {ok:false,message:'Keep the starting list assignment on its own line so we can test a different roster. Your run is saved.',tests};
    const r=await run(changed);let ok=!r.error,expected;
    if(ok)switch(card.check){
     case 'append':expected=[...roster,'Orbit'];ok=equal(r.vars.players,expected)&&listLine(r.stdout,expected);break;
     case 'roster':expected=[roster[0],'Luna',roster[2],'Orbit'];ok=equal(r.vars.players,expected)&&listLine(r.stdout,expected)&&lines(r.stdout).at(-1)==='4';break;
     case 'longer':expected=[...roster];expected[3]='Ash';expected.push('Orbit');ok=equal(r.vars.players,expected)&&listLine(r.stdout,expected);break;
     case 'adapt':ok=equal(r.vars.players,['Ash',roster[1],'Comet'])&&only(r,['3']);break;
     case 'arrival':ok=equal(r.vars.players,[...roster,'Comet'])&&only(r,['Players ready: '+(roster.length+1)]);break;
     case 'last':ok=only(r,[roster.at(-1)]);break;
     case 'firstlast':ok=only(r,[roster[0],roster.at(-1)]);break;
     case 'reverse':ok=only(r,[...roster].reverse());break;
     case 'loop':ok=only(r,roster);break;
     case 'loopcount':ok=only(r,[...roster,String(roster.length)]);break;
     case 'captain':ok=roster.includes(r.vars.captain)&&only(r,['Captain: '+r.vars.captain]);break;
     case 'combine':ok=roster.includes(r.vars.captain)&&only(r,['Players ready: '+roster.length,...roster,'Captain: '+r.vars.captain]);break;
     case 'availableprint':ok=equal(r.vars.players,roster)&&only(r,roster.filter(x=>x!=='Echo'));break;
     case 'availablelist':expected=roster.filter(x=>x!=='Echo');ok=equal(r.vars.players,roster)&&equal(r.vars.available,expected)&&listLine(r.stdout,expected);break;
     case 'empty':ok=lines(r.stdout).length===1&&roster.includes(lines(r.stdout)[0])&&chooses(code);break;
     case 'safechoice':expected=roster.filter(x=>x!=='Echo');ok=equal(r.vars.available,expected)&&equal(r.vars.players,roster)&&(expected.length?expected.includes(r.vars.captain)&&only(r,[r.vars.captain]):only(r,['Nobody is ready']));break;
     case 'turns':ok=equal(r.vars.waiting,[])&&equal(lines(r.stdout).sort(),[...roster].sort());break;
    }
    tests.push({label:'Changed roster',input:roster,...r,ok});
    if(!ok)return {ok:false,message:'Your starting data works, but this roster needs attention: '+JSON.stringify(roster)+'. '+(r.error||'Use the current length/data, not fixed player names or indexes.'),tests};
   }
  }
  if(card.check==='fiverounds'){
   const changed=code.replace(/^rounds\s*=\s*5\b/m,'rounds = 2'),r=await run(changed),ok=!r.error&&lines(r.stdout).length===2&&lines(r.stdout).every(x=>r.vars.players?.includes(x));tests.push({label:'rounds = 2',...r,ok});if(!ok)return {ok:false,message:'Use rounds in the loop condition so changing it to 2 produces exactly two names.',tests};
  }
  return {ok:true,message:'✓ It works. '+(tests.length>1?'Your program also passed changed-data tests. ':'The result matches this task. ')+'Keep experimenting; your attempts are saved.',tests};
 }
 return {check,primary,replaceList,lines};
})();
if(typeof module!=='undefined')module.exports=GameChecks;
