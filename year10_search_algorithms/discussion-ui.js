(function(root){
 'use strict';
 // Stable identities, not save timestamps. New joiners append without moving existing cards.
 class Roster {
  constructor(){this.round=null;this.ids=[];}
  order(round,people,responses){
   if(this.round!==round){this.round=round;this.ids=[];}
   const rows=new Map(people.map(p=>[p.id,{session_id:p.id,name:p.name,className:p.className}]));
   for(const r of responses)rows.set(r.session_id,{...rows.get(r.session_id),...r});
   const newcomers=[...rows.values()].filter(r=>!this.ids.includes(r.session_id)).sort((a,b)=>(a.name||'').localeCompare(b.name||'')||a.session_id.localeCompare(b.session_id));
   this.ids.push(...newcomers.map(r=>r.session_id));
   return this.ids.filter(id=>rows.has(id)).map(id=>rows.get(id));
  }
 }
 function setText(el,value){if(el.textContent!==value)el.textContent=value;}
 function board(grid,rows,{filter='all',question,review=false}={}){
  const existing=new Map([...grid.children].map(el=>[el.dataset.student,el]));
  for(const r of rows){
   let card=existing.get(r.session_id);
   if(!card){card=document.createElement('article');card.className='response-card stable-response-card';card.dataset.student=r.session_id;
    card.innerHTML='<header><h3></h3><small class="response-class"></small></header><div class="eyebrow response-state"></div><div class="response-text" tabindex="0" aria-label="Student answer"></div><footer><button data-response>Read / feedback</button><button data-project>Discuss on projector</button><button class="house-point-button" data-award></button></footer>';grid.append(card);}
   setText(card.querySelector('h3'),r.name||'Student');setText(card.querySelector('.response-class'),r.className||'');
   const submitted=!!r.submitted_at,attempting=!!(r.draft&&!submitted);
   setText(card.querySelector('.response-state'),submitted?'Submitted':attempting?'Draft · not submitted':'Waiting for an answer');
   const answer=submitted?r.answer:r.draft;
   setText(card.querySelector('.response-text'),question?.options?.find(o=>o.id===answer)?.text||answer||'No answer received yet.');
   card.hidden=filter==='submitted'&&!submitted||filter==='attempting'&&!attempting;
   const detail=card.querySelector('[data-response]');detail.dataset.response=r.session_id;detail.disabled=!submitted&&!attempting;
   const project=card.querySelector('[data-project]');project.dataset.project=r.session_id;project.hidden=!review;project.disabled=!submitted;
   const award=card.querySelector('[data-award]');award.dataset.award=r.session_id;award.disabled=!!r.point||!submitted;award.classList.toggle('is-awarded',!!r.point);
   setText(award,r.point?'★ House point awarded':'☆ Award house point');award.setAttribute('aria-label',(r.point?'House point awarded to ':'Award house point to ')+(r.name||'student'));
   existing.delete(r.session_id);
  }
  for(const card of existing.values())card.remove();
 }
 const api={Roster,board};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SearchDiscussion=api;
})(typeof window!=='undefined'?window:globalThis);
