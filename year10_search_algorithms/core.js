/* Pure lesson rules, shared by the lesson, projector and tests. */
(function(root){'use strict';
 const ITEMS=[5,9,13,18,24,31,42];
 function linear(items,target){const steps=[];for(let i=0;i<items.length;i++){const found=items[i]===target;steps.push({index:i,value:items[i],found,next:found?'Found: stop.':'Check the next index.'});if(found)return {steps,index:i,found:true};}return {steps,index:-1,found:false};}
 function binary(items,target){let low=0,high=items.length-1;const steps=[];while(low<=high){const mid=Math.floor((low+high)/2),value=items[mid],found=value===target;const nextLow=value<target?mid+1:low,nextHigh=value>target?mid-1:high;steps.push({low,high,mid,value,found,nextLow,nextHigh});if(found)return {steps,index:mid,found:true,low,high};low=nextLow;high=nextHigh;}return {steps,index:-1,found:false,low,high};}
 const LINEAR=['position ← 0','found ← False','WHILE position < LEN(items) AND found = False','    IF items[position] = target THEN','        found ← True','    ELSE','        position ← position + 1','    ENDIF','ENDWHILE','OUTPUT found'];
 const BINARY=['low ← 0','high ← LEN(items) - 1','found ← False','WHILE low ≤ high AND found = False','    mid ← (low + high) DIV 2','    IF items[mid] = target THEN','        found ← True','    ELSE','        IF items[mid] < target THEN','            low ← mid + 1','        ELSE','            high ← mid - 1','        ENDIF','    ENDIF','ENDWHILE','OUTPUT found'];
 const VIDEOS=[{id:'linear-video',youtube:'0HXBo--PaAw',title:'Linear search',author:"Craig ’n’ Dave",start:0,end:null},{id:'binary-video',youtube:'Sa-4CObj8Ag',title:'Binary search',author:"Craig ’n’ Dave",start:0,end:null}];
 const QUESTIONS={
  linear:{id:'linear',title:'Linear search: decide the next step',type:'mcq',target:24,prompt:'The algorithm has just checked index 1, containing 9. The target is 24. What should it do next?',options:[{id:'next',text:'Check index 2, containing 13.'},{id:'absent',text:'Report that 24 is not in the list.'},{id:'jump',text:'Jump directly to index 4 because we can see 24.'},{id:'restart',text:'Restart at index 0.'}],answer:'next',model:'Check index 2, containing 13. The current value 9 does not match target 24, so this linear search advances by one index. One failed comparison does not prove the target is absent.',ksu:'Skills and Understanding'},
  binary:{id:'binary',title:'Binary search: choose the new last index',type:'text',target:13,indexes:{low:0,high:6,mid:3},prompt:'We are searching for value 13 in this sorted list. We have checked index 3, which stores 18. What should the new last index of the search area (high) be? Give an index, not a stored value, and explain your choice.',scaffold:'The target value __ is smaller than the checked value __. Because the list is sorted, we can exclude indexes __ to __. The remaining search area is indexes __ to __, so the new last index (high) is __.',model:'high = 2 (index 2). The target value 13 is smaller than 18. Because the list is sorted, exclude indexes 3–6, including the checked midpoint. Keep indexes 0–2. Set high = mid - 1 = 3 - 1 = 2.',ksu:'Understanding'}
 };
 Object.assign(QUESTIONS.linear,{answerText:'Check index 2, containing 13.',explanation:'The value 9 at index 1 is not the target, 24. Linear search moves to the next index, which is 2. One non-match does not mean the target is absent.'});
 Object.assign(QUESTIONS.binary,{answerText:'high = 2 (index 2)',explanation:'The target value 13 is smaller than 18. Because the list is sorted, exclude indexes 3–6, including the checked midpoint. The remaining search area is indexes 0–2. Set high = mid - 1 = 3 - 1 = 2.',shortReason:'13 is smaller than 18. Sorted order rules out indexes 3–6. Keep indexes 0–2, so high = mid - 1 = 2.'});
 function shuffle(a,seed){let n=seed>>>0;const r=a.slice();for(let i=r.length-1;i>0;i--){n=(n*1664525+1013904223)>>>0;const j=n%(i+1);[r[i],r[j]]=[r[j],r[i]];}return r;}
 function videoGate(state,sample){const s={frontier:0,done:false,...state}, {time,wall,playing,visible,rate,duration,ended=false}=sample;let seek=null,complete=false;
  if(!Number.isFinite(time)||time<0)return {state:s,seek,complete};
  const elapsed=s.lastWall==null?0:Math.max(0,(wall-s.lastWall)/1000);
  if(time>s.frontier+1.1){seek=s.frontier;}else if((playing||ended)&&visible&&rate<=1.05&&elapsed<=2&&s.lastTime!=null&&time>=s.lastTime-.15&&time-s.lastTime<=elapsed+0.65){s.frontier=Math.max(s.frontier,time);}
  s.lastTime=seek===null?time:seek;s.lastWall=wall;
  if(ended&&duration>1&&s.frontier>=duration-.1&&time>=duration-.1){complete=true;s.done=true;}
  return {state:s,seek,complete};
 }
 function entryCheck(name,className){const n=String(name||'').trim(),c=String(className||'').trim().toUpperCase();return {name:n,className:c,nameValid:n.length>=2&&n.length<=60&&n.toLowerCase()!=='teacher',classValid:/^10[A-Z0-9 -]{0,28}$/.test(c)};}
 const api={ITEMS,LINEAR,BINARY,VIDEOS,QUESTIONS,linear,binary,shuffle,videoGate,entryCheck};root.SearchCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
