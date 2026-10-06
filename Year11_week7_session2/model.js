(() => {
  'use strict';
  const L=window.DATA_LESSON;
  const groups=['terms','core','notebook','extension'];
  const known = {
    learningFocus:['Knowledge','Skills','Understanding','A combination'],
    target:['Key-term meanings','Bits and bytes','Minimum colour depth','Image file size','Sampling explanations','Sound file size','Following a Huffman tree','Compression saving','RLE pairs'],
    phase:Object.keys(L.phases),
    phaseSkill:L.skills,
    retry1:['Not yet checked','Successful without notes','Successful with support','Not yet successful'],
    retry2:['Not yet checked','Successful without notes','Successful with support','Not yet successful'],
    nextTopic:L.skills,
    support1:['Not recorded','None - independent','Reading / worked example','Partner prompt','Teacher prompt'],
    support2:['Not recorded','None - independent','Reading / worked example','Partner prompt','Teacher prompt'],
    supportExit:['Not recorded','None - independent','Reading / worked example','Partner prompt','Teacher prompt']
  };
  for(let i=0;i<L.skills.length;i++) known['rag'+i]=['Not checked','Red','Amber','Green'];
  const flags=['attemptedTerms','attemptedMain1','attemptedMain2','checkedCore','paperCorrection','explainedChange','completedExit'];
  function fresh(name='',className=''){return {version:1,lessonId:L.id,name,className,stage:0,fields:{},photos:Object.fromEntries(groups.map(k=>[k,[]])),history:[],updated:''};}
  function validField(key,v){
    if(key.startsWith('score-')){const q=L.scores.find(q=>'score-'+q[0]===key);return !!q&&(v===''||((typeof v==='number'||typeof v==='string'&&/^\d+$/.test(v))&&Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<=q[2]));}
    if(Object.prototype.hasOwnProperty.call(known,key))return v===''||known[key].includes(v);
    return flags.includes(key)&&typeof v==='boolean';
  }
  function validPhoto(p){return p&&typeof p.name==='string'&&p.name.length<=160&&typeof p.data==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.data)&&p.data.length<8*1024*1024&&Number.isFinite(p.width)&&p.width>0&&p.width<=2000&&Number.isFinite(p.height)&&p.height>0&&p.height<=2000;}
  function valid(x){return !!x&&x.version===1&&x.lessonId===L.id&&typeof x.name==='string'&&x.name.trim().length>0&&x.name.length<=80&&typeof x.className==='string'&&x.className.trim().length>0&&x.className.length<=40&&Number.isInteger(x.stage)&&x.stage>=0&&x.stage<L.stages.length&&x.fields&&typeof x.fields==='object'&&!Array.isArray(x.fields)&&Object.entries(x.fields).every(([k,v])=>validField(k,v))&&x.photos&&typeof x.photos==='object'&&!Array.isArray(x.photos)&&Object.keys(x.photos).every(k=>groups.includes(k))&&groups.every(k=>Array.isArray(x.photos[k])&&x.photos[k].length<=8&&x.photos[k].every(validPhoto))&&groups.reduce((n,k)=>n+x.photos[k].length,0)<=20&&Array.isArray(x.history)&&x.history.length<=150&&x.history.every(h=>typeof h.date==='string'&&typeof h.kind==='string'&&h.kind.length<100&&h.fields&&Object.entries(h.fields).every(([k,v])=>validField(k,v)));}
  function firstScore(s,key){for(const h of s.history){if(h.kind==='Recorded first-attempt scores'&&h.fields['score-'+key]!==''&&h.fields['score-'+key]!==undefined)return h.fields['score-'+key];}return s.fields['score-'+key]??'';}
  function snapshot(s,kind){const values={...s.fields};const last=s.history[s.history.length-1];if(last&&last.kind===kind&&JSON.stringify(last.fields)===JSON.stringify(values))return false;s.history.push({date:new Date().toISOString(),kind,fields:values});if(s.history.length>150)s.history.shift();return true;}
  function board(){return {version:1,teams:[{id:'pixels',name:'Team Pixels',rounds:[{method:false,check:false,retry:false},{method:false,check:false,retry:false}],badges:[]},{id:'signals',name:'Team Signals',rounds:[{method:false,check:false,retry:false},{method:false,check:false,retry:false}],badges:[]}],updated:''};}
  const badges=['Unit Inspector','Code Detective','Reasoning Partner'];
  function xp(t){return t.rounds.reduce((sum,r)=>sum+Number(r.method)+Number(r.check)+2*Number(r.retry),0);}
  function validBoard(b){return !!b&&b.version===1&&Array.isArray(b.teams)&&b.teams.length>=1&&b.teams.length<=8&&new Set(b.teams.map(t=>t.id)).size===b.teams.length&&b.teams.every(t=>typeof t.id==='string'&&/^[a-zA-Z0-9_-]{1,40}$/.test(t.id)&&typeof t.name==='string'&&t.name.trim().length>0&&t.name.length<=40&&Array.isArray(t.rounds)&&t.rounds.length===2&&t.rounds.every(r=>['method','check','retry'].every(k=>typeof r[k]==='boolean'))&&Array.isArray(t.badges)&&t.badges.length<=3&&new Set(t.badges).size===t.badges.length&&t.badges.every(v=>badges.includes(v)));}
  function rank(b){let place=0,last=-1;return [...b.teams].sort((a,b)=>xp(b)-xp(a)||a.name.localeCompare(b.name)).map((t,i)=>{const score=xp(t);if(score!==last)place=i+1;last=score;return {...t,score,place};});}
  window.DetectivesModel={fresh,valid,known,flags,groups,validPhoto,snapshot,firstScore,board,xp,validBoard,rank,badges};
})();
