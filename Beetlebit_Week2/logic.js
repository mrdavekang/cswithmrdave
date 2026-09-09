export const MAX_GROUP=255;
export const validGroup=v=>Number.isInteger(Number(v))&&String(v).trim()!==''&&Number(v)>=0&&Number(v)<=MAX_GROUP;
export function receive(message,senderGroup,receiverGroup,previous='S',decode=false){
  if(!validGroup(senderGroup)||!validGroup(receiverGroup))return {delivered:false,display:previous,reason:'invalid'};
  if(Number(senderGroup)!==Number(receiverGroup))return {delivered:false,display:previous,reason:'group'};
  return {delivered:true,display:decode?(message==='L'?'←':message==='R'?'→':'■'):message,reason:'received'};
}
export function docking(position,command,target=4,left=-1,right=1,guard=true){
  if(!Number.isInteger(position)||!Number.isInteger(target))throw new Error('Use whole positions');
  const before=position;
  if(command==='L')position+=left;
  if(command==='R')position+=right;
  if(guard)position=Math.max(0,Math.min(4,position));
  const docked=command==='S'&&before===target;
  return {position,docked,outside:position<0||position>4};
}
export const traceOrder=['press','send','group','receive','display'];
export const traceLabels={press:'Press A on the controller.',send:'The controller sends the string “L”.',group:'A receiver in the same radio group receives the message.',receive:'Its received-string event runs with “L”.',display:'Its program displays the message.'};
export const evidenceText=v=>typeof v==='string'&&v.trim().length>=12;
export const passed=v=>v==='pass'||v==='fixed';
export const completionChecks={
  briefing:s=>!!s.fields.briefReady,
  recall:s=>s.fields.recall==='left',
  mission:s=>validGroup(s.fields.group)&&!!s.fields.boardsReady&&!!s.fields.rolesReady,
  learning:s=>s.fields.learningK==='remember'&&s.fields.learningS==='practise'&&s.fields.learningU==='explain',
  predict:s=>s.fields.prediction==='receiver',
  trace:s=>!!s.fields.traceChecked,
  radio:s=>s.fields.labDelivered&&s.fields.labBlocked,
  sender:s=>s.fields.senderGroup&&s.fields.senderEvents,
  echo:s=>s.fields.echoGroup&&s.fields.echoEvent&&s.fields.echoVariable&&s.fields.echoTest,
  pitstop:s=>!!s.fields.pitstop&&evidenceText(s.fields.pitEvidence),
  decode:s=>s.fields.decodeL&&s.fields.decodeR&&s.fields.decodeStop,
  transfer:s=>s.fields.loadedSender&&s.fields.loadedReceiver&&s.fields.poweredBoth,
  hardware:s=>['testStart','testL','testR','testS'].every(k=>passed(s.fields[k])),
  debug:s=>s.fields.groupFault==='different'&&s.fields.wordFault==='mismatch'&&evidenceText(s.fields.debugEvidence),
  debrief:s=>s.fields.peerTest&&s.fields.savedProjects&&evidenceText(s.fields.debrief),
  dock:s=>s.fields.extensionRoute==='consolidate'?evidenceText(s.fields.extensionEvidence):!!s.fields.dockSuccess,
  plenary:s=>evidenceText(s.fields.exitExplanation)&&s.fields.exitFault==='noEvent'&&!!s.fields.confidence,
};
export function ready(id,state){return !!completionChecks[id]?.(state)}
