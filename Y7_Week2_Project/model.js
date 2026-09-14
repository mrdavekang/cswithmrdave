(function(root){
 'use strict';
 const L=root.Lesson||(typeof require!=='undefined'?require('./lesson.js'):null);
 const R=root.LearningChecks||(typeof require!=='undefined'?require('./reflections.js'):null);
 const key=(n,c)=>n.trim().toLowerCase()==='teacher'?'y7-w2-code-first-v1:teacher':'y7-w2-code-first-v1:'+encodeURIComponent(c.trim().normalize('NFC').toLowerCase())+':'+encodeURIComponent(n.trim().normalize('NFC').toLowerCase());
 function fresh(name,klass,lang,device){return {version:1,name,klass,lang,device,teacher:name.trim().toLowerCase()==='teacher',created:new Date().toISOString(),current:0,unlocked:0,completed:{},answers:{},work:{},events:[],runs:[],support:{},extensionAttempts:[],destination:'c1',destinationChosen:false,picked:null,submission:{}};}
 function workspace(s,c){let id=c.workspace;if(!id)return null;if(!s.work[id])s.work[id]={code:c.initial||'',initial:c.initial||'',draws:[],ranCards:[],runs:0,ok:false,output:'',lastCode:null};return s.work[id];}
 function missing(s,c){if(s.teacher)return [];const needs=[];const answer=s.answers[c.id];if(c.question&&(!answer||!answer.checked))needs.push('answer');if(c.kind==='destination'&&!s.destinationChosen)needs.push('destination');if(c.pick&&!s.picked)needs.push('point');if(c.run){const w=workspace(s,c);if((w.lastCode!==w.code||!w.ranCards.includes(c.id))&&!s.support[c.id])needs.push('run');if(w.lastCode===w.code&&!w.ok&&!s.support[c.id])needs.push('correction');if(c.change&&!s.support[c.id]&&w.code.replace(/\s/g,'')===w.initial.replace(/\s/g,''))needs.push('change');}
 if((c.explain||c.kind==='peer')&&!s.answers[c.id+'Line'])needs.push('line');if(R.mode(c))needs.push(...R.missing(s,R.mode(c)).map(id=>'reflection:'+id));return needs;}
 function completed(s,c){return !!s.completed[c.id]&&(!R.mode(c)||R.missing(s,R.mode(c)).length===0);}
 function filename(s,suffix){const safe=t=>String(t).normalize('NFC').replace(/[<>:"/\\|?*\x00-\x1f]/g,'').trim().replace(/\s+/g,'_').slice(0,60)||'Student';return 'Year7_'+safe(s.klass||'Review')+'_'+safe(s.name)+'_Week2_Practical'+suffix;}
 const api={key,fresh,workspace,missing,completed,filename};root.Model=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
