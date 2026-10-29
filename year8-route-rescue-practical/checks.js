/* Evaluate actual interpreter output, final state and parsed Python operations.
   Comments and printed answers alone cannot substitute for list operations. */
window.RouteChecks=(()=>{
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const normal=s=>s.trim().replace(/'/g,'"').replace(/\s*,\s*/g,',');
  function evaluate(card,result,custom){
    if(result.error)return {passed:false,kind:'error',message:'Your program stopped before it could finish. Your code is safe. Read the Python message, then try one correction.',detail:result.error};
    const r=card.rule,a=result.analysis||{lists:[],prints:[],updates:[]};
    const lists=a.lists.filter(x=>x.name==='route'),updates=a.updates.filter(x=>x.name==='route');
    const expected=r.custom?[custom?.first,'RIGHT',custom?.third]:r.route;
    const miss=m=>({passed:false,kind:'improve',message:m});
    if(!Array.isArray(result.vars?.route))return miss('Create a list named route. Printing words without storing them in a list does not complete this task.');
    if(r.custom&&(!custom?.first||!custom?.third||custom.first==='UP'||custom.third==='DOWN'))return miss('Choose a new first direction (not UP) and a new third direction (not DOWN) in your target. Keep RIGHT in the middle.');
    if(expected&&!same(result.vars.route,expected))return miss('Compare the stored route with the target. Check the index you changed and keep the other elements in their original positions.');
    if(!lists.length)return miss('Keep a list-creation instruction for route. Use square brackets to store the values before reading or updating them.');
    if(r.start&&!same(lists[0].elements,r.start))return miss('Keep the supplied starting list. Make the repair with an indexed update underneath it, rather than starting with the final answer.');
    if(!r.backwards&&lists.length!==1)return miss('Create route once. Use route[index] = value to change elements; do not create the whole list again.');
    if(r.create&&!same(lists[0].elements,r.route))return miss('Check the three starting elements and their order. Each direction is a quoted string.');
    if(r.whole&&!a.prints.some(x=>x.args.some(v=>v.type==='whole'&&v.name==='route')))return miss('Print the whole stored list with print(route). Do not type a quoted copy of the expected answer.');
    if(r.noUpdate&&updates.length)return miss('For this reading task, leave the list unchanged. Change which index print reads, not the stored data.');
    const indices=a.prints.flatMap(p=>p.args.filter(v=>v.type==='index'&&v.name==='route').map(v=>v.index));
    if(r.indexedPrints&&!r.indexedPrints.every((v,i)=>indices.slice(i).includes(v)))return miss('Use indexed reads inside print. Check the position numbers in the visual; printing a fixed direction word is not a retrieval.');
    if(r.updates&&updates.length<r.updates)return miss('Use an indexed update: route[index] = replacement. Keep your original list above it.');
    if(r.exactUpdates!=null&&updates.length!==r.exactUpdates)return miss('This challenge needs exactly '+r.exactUpdates+' indexed update'+(r.exactUpdates===1?'':'s')+'. Check the assignments to route[index].');
    if(r.updateSequence&&!same(updates.map(u=>[u.index,u.value]),r.updateSequence))return miss('Keep the requested updates in order. Compare each destination index and replacement value before printing.');
    if(r.copy&&!(updates.length===1&&updates[0].index===0&&updates[0].source?.name==='route'&&updates[0].source.index===2))return miss('Read route’s third stored element on the right of = and update its first element on the left. Do not type a fixed replacement direction.');
    if(r.backwards){
      if(lists.length!==2||!lists.every(l=>l.elements.length===3&&l.elements[0]==='UP'&&l.elements[2]==='DOWN')||lists[0].elements[1]===lists[1].elements[1])return miss('Keep two different starting lists in the code. They must differ only in their original middle value; both start with UP and end with DOWN.');
      if(!same(updates.map(u=>[u.index,u.value]),[[1,'LEFT'],[1,'LEFT']]))return miss('Each example needs its own update of index 1 to LEFT, followed by a print.');
    }
    let target=r.custom?["['"+custom.first+"', 'RIGHT', '"+custom.third+"']"]:card.expected;
    if(!r.twoTests){
      const got=String(result.stdout).trim().split('\n').map(normal),want=target.map(normal),selected=card.last?got.slice(-want.length):got;
      if(!same(selected,want))return miss(card.last?'Check the final output line against the target. Put the new print after the relevant update. Earlier outputs may remain.':'Compare your output with the target, including its order. Print the stored list or indexed values, not a typed copy. Extra debug prints can be removed when you finish.');
    }
    return {passed:true,kind:'success',message:r.twoTests?'The first test passed. Running the same repair on another starting route…':'Matched: your stored data, Python operations and output meet this task. Can you point to the index that made it work?'};
  }
  return {evaluate,normal};
})();
