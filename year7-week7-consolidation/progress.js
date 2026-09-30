window.ConsolidationProgress=(()=>{
 const L=ConsolidationLesson;
 const filled=v=>v!==undefined&&v!==null&&String(v).trim()!=='';
 function requirements(s,c){
  const a=s.answers[c.id]||{},r=[];
  const add=(id,label,ok)=>r.push({id,label,done:!!ok});
  if(c.kind==='ratings')for(const k of ['k','s','u'])add('rating-'+k,'Choose your starting point for '+({k:'Knowledge',s:'Skills',u:'Understanding'}[k])+'.',filled(a['rating-'+k]));
  if(c.kind==='multi')add('sections','Select your choices, then tap Check my choices.',Array.isArray(a.sections)&&a.sections.length>0&&s.checks[c.id]);
  if(c.kind==='parsons')add('order','Arrange the strips and press Check my order.',s.checks[c.id]);
  if(c.kind==='flow')for(const [id,label]of [['move','Choose the movement action.'],['turn','Choose the turn action.'],['no','Choose where the No arrow returns.']])add(id,label,filled(a[id]));
  if(c.kind==='editor')add('run','Tap Run above the code to record an attempt. An error is still an attempt.',s.runs[c.id]?.length);
  for(const q of c.questions||[])add(q.id,'Choose a response for: '+q.label,filled(a[q.id]));
  if(c.text)add(c.text.id,'Complete the sentence starter with a short phrase.',filled(a[c.text.id]));
  if(c.kind==='attribution'){add('origin','Choose whose example you used.',filled(a.origin));add('change','Write a short phrase saying what you changed.',filled(a.change));}
  if(c.kind==='errors')for(const id of ['syntax','runtime','logic'])add(id,'Choose the error type for example '+({syntax:'A',runtime:'B',logic:'C'}[id])+'.',filled(a[id]));
  if(c.kind==='pitstop'){add('phase','Choose your learning phase.',filled(a.phase));add('next','Choose a useful next step.',filled(a.next));}
  return r;
 }
 function complete(s,c){if(c.kind==='finish')return !!s.finished;if(c.kind==='extras')return !!s.completed[c.id];const r=requirements(s,c);return r.length?r.every(x=>x.done):!!s.completed[c.id];}
 const required=()=>L.cards.filter(c=>c.kind!=='extras'&&c.kind!=='finish');
 const status=(s,c)=>complete(s,c)?'recorded':Object.keys(s.answers[c.id]||{}).length||s.runs[c.id]?.length?'started':'pending';
 function allowed(s,id){return id==='quiz'?!!s.finished||s.teacher:L.cards.some(c=>c.id===id)||L.extras.some(c=>c.id===id);}
 return {requirements,status,allowed,filled,complete,required};
})();
