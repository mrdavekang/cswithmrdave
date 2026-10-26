(function(root){
  'use strict';
  const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
  const copy=v=>JSON.parse(JSON.stringify(v));
  const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  const key=v=>typeof v==='string'&&/^[0-9a-f]{64}$/.test(v);
  function payload(s,lesson){
    const out={role:'student'};
    for(const k of ['lesson','version','identity','lang','theme','rainbow','p','records','done','practice','modelStep','created','updated'])if(s[k]!==undefined)out[k]=copy(s[k]);
    out.currentId=lesson.cards[s.p]?.id;
    if(!out.currentId||out.lesson!==lesson.id)throw Error('The lesson save does not match this page.');
    if(new TextEncoder().encode(JSON.stringify(out)).length>250000)throw Error('This lesson backup is large. Keep a JSON backup and tell your teacher.');
    return out;
  }
  function signature(p){const out={...p};delete out.updated;return JSON.stringify(out);}
  function metrics(s,lesson){
    const score=lesson.cards.filter(c=>!['extra','break','games'].includes(c.stage)&&['choice','number','build'].includes(c.kind));
    const out={answered:0,correct:0,wrong:0,unchecked:0,hints:0,firstCorrect:0,improved:0,progress:0,phase:'',startingSupport:0};
    for(const c of score){const r=s.records?.[c.id];if(!object(r))continue;if(String(r.answer??'').trim())out.answered++;if(r.checked===true){if(r.correct===true)out.correct++;else if(r.correct===false)out.wrong++;}else if(String(r.answer??'').trim())out.unchecked++;if(r.hint===true)out.hints++;if(r.attempts?.[0]?.correct===true)out.firstCorrect++;if(r.attempts?.[0]?.correct===false&&r.checked===true&&r.correct===true)out.improved++;}
    out.progress=lesson.cards.filter(c=>!['extra','break','games'].includes(c.stage)&&s.done?.[c.id]===true).length;
    out.phase=s.records?.['learning-phase']?.answer||'';
    out.startingSupport=['knowledge-start','skills-start','understanding-start'].filter(id=>['help','explain'].includes(s.records?.[id]?.answer)).length;
    return out;
  }
  function needsReview(m){return !!(m&&(m.wrong>0||m.phase==='drowning'||m.startingSupport>0));}
  const api={object,copy,uuid,key,payload,signature,metrics,needsReview};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.BinaryTrackingCore=api;
})(typeof window!=='undefined'?window:globalThis);
