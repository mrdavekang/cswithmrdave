/* Visible control meanings. These labels do not alter database commands or permissions. */
window.GameControlDesign = (() => {
  'use strict';
  const phases={work:'Independent lesson work',invite:'Invitation sent · timer not started',response:'Pupils are answering',discuss:'Class discussion · pupil editing paused',follow:'Pupils can improve their code',retry:'Timed code improvements'};
  function model(r){
    if(r.ended)return {step:-1,state:'Session ended · records kept',next:null,others:[],note:'Choose an open session or open a new class. These saved answers remain available.'};
    if(!r.connected)return {step:-1,state:'Live connection paused',next:null,others:[],note:'Waiting for the teacher connection. Pupils can continue their saved lesson. Controls return after reconnection.'};
    const result={step:0,state:phases[r.phase]||phases.work,next:null,others:[],note:''};
    if(['response','retry'].includes(r.phase)&&r.pausedSeconds!=null)result.state='Answering timer paused · pupil editing paused';
    if(r.phase==='work'){result.note='Choose one of the checkpoint invitations to begin. This does not start the answering timer or move pupils away from their work.';return result;}
    if(r.phase==='invite'){result.step=1;result.next={action:'start',label:'Start 3-minute answering time',hint:'Starts the countdown on pupil devices and lets pupils type and send their answer.'};}
    if(r.phase==='response'||r.phase==='retry'){result.step=r.phase==='retry'?4:1;result.next={action:'discuss',label:r.phase==='retry'?'Finish improvements & discuss':'Stop answering & discuss together',hint:'Closes the answering window and asks pupils to look at the board. All drafts and sent answers are kept.'};}
    if(r.phase==='discuss'&&!r.revealed){result.step=2;result.next={action:'reveal',label:'Show worked answer to the class',hint:'Shows your example on the projector and pupil devices. Pupils cannot edit yet.'};}
    if(r.phase==='discuss'&&r.revealed){result.step=3;result.next={action:'follow',label:'Let pupils edit an improvement',hint:'Opens a separate improvement copy beside your live example. Their first-response history is kept.'};}
    if(r.phase==='follow'){result.step=4;result.next={action:'release',label:'Return class to lesson activities',hint:'Closes the live workspace and restores pupils’ lesson positions. You can invite them back without losing answers.'};}
    if(r.phase==='invite'||r.phase==='follow')result.others.push({action:'discuss',label:'Pause pupil editing for discussion',hint:'Shows the eyes-to-board cue. Keeps the current example visibility unchanged.'});
    if(r.revealed&&r.phase==='follow')result.others.push({action:'retry',label:'Give 1 minute for improvements',hint:'Starts a timed improvement window instead of untimed editing.'});
    if(result.next?.action!=='release')result.others.push({action:'release',label:'Return class to lesson activities',hint:'Returns pupils to their own lesson. Saved responses remain available to reopen.'});
    return result;
  }
  function render(r,escape){
    const m=model(r),e=escape;
    const steps=['Invite pupils','Collect answers','Discuss ideas','Show example','Improve code'];
    const button=(a,primary=false)=>'<div class="gc-action-explained"><button data-command="'+a.action+'" class="'+(primary?'gc-primary gc-next-action':'gc-secondary-action')+'" aria-describedby="gc-hint-'+a.action+'">'+e(a.label)+'</button><p id="gc-hint-'+a.action+'">'+e(a.hint)+'</p></div>';
    return '<ol class="gc-workflow" aria-label="Teaching sequence">'+steps.map((s,i)=>'<li '+(i===m.step?'aria-current="step"':'')+' class="'+(i<m.step?'done':'')+'"><b>'+String(i+1)+'</b><span>'+e(s)+'</span></li>').join('')+'</ol><div class="gc-phase-summary"><span class="gc-control-kicker">WHAT PUPILS SEE NOW</span><strong>'+e(m.state)+'</strong></div>'+
      (m.next?'<div class="gc-next-step"><h4>Your next action</h4>'+button(m.next,true)+'</div>':'<p class="gc-control-note">'+e(m.note)+'</p>')+
      (r.connected&&!r.ended&&['response','retry'].includes(r.phase)?'<section class="gc-answering-timer"><h4>Adjust the pupil answering timer</h4><p>This changes pupils’ deadline, not the lesson clock.</p><div class="gc-actions"><button data-command="timer">'+(r.pausedSeconds!=null?'Resume pupil answering timer':'Pause pupil answering timer')+'</button><button data-command="extend" data-seconds="30">Add 30 seconds</button><button data-command="extend" data-seconds="60">Add 1 minute</button></div></section>':'')+
      (m.others.length?'<section class="gc-other-actions"><h4>Other classroom actions</h4>'+m.others.map(a=>button(a)).join('')+'</section>':'');
  }
  const outcomes={invite:'Invitation sent. Pupils can open the question; their answering timer has not started.',start:'Answering time is open. Pupils can type, run and send their answer.',discuss:'Answering is closed. Pupils see the eyes-to-board cue; their work is kept.',reveal:'The worked answer is visible on pupil devices and the projector. Editing stays paused until you allow improvements.',follow:'Pupils can edit and run their improvement copy alongside your demonstration.',retry:'The 1-minute improvement timer has started. First-response history stays saved.',release:'Pupils are back in their lesson activities. You can reopen the checkpoint without clearing answers.',timer:'Pupil answering timer updated. The separate lesson clock is unchanged.',extend:'Extra answering time added on pupil devices.',stage:'Projector stage changed. Pupils stay at their own lesson position.',award:'House point recorded; celebration sent. This does not enter a point in iSAMS.',undoAward:'The classroom house-point award was reversed.',end:'Live session ended. All saved responses and house-point records are kept.',demo:'Your example has been shared with the class.',clock:'Lesson clock updated. This does not start or pause a pupil answering timer.'};
  return {model,render,outcomes};
})();
