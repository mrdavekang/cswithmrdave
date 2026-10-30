(function(root){
'use strict';const C=root.SearchCore;
C.VIDEOS=[];
C.LINEAR_PY=`items = [5, 9, 13, 18, 24, 31, 42]
target = int(input("Book number: "))
position = 0
found = False
checks = 0
while position < len(items) and found == False:
    checks = checks + 1
    if items[position] == target:
        found = True
    else:
        position = position + 1
if found == True:
    print("Linear: found at index", position)
else:
    print("Linear: not found")
print("Item checks:", checks)`;
C.BINARY_PY=`items = [5, 9, 13, 18, 24, 31, 42]
target = int(input("Book number: "))
low = 0
high = len(items) - 1
found = False
checks = 0
while low <= high and found == False:
    mid = (low + high) // 2
    checks = checks + 1
    if items[mid] == target:
        found = True
    elif items[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
if found == True:
    print("Binary: found at index", mid)
else:
    print("Binary: not found")
print("Item checks:", checks)`;
C.STARTERS={linear:C.LINEAR_PY,binary:C.BINARY_PY,'review-linear':C.LINEAR_PY,'review-binary':C.BINARY_PY};
C.QUESTIONS={
search:{id:'search',title:'Search result: report the location',type:'mcq',ksu:'Skills and Understanding',target:31,prompt:'The search finds target value 31 in this list. The librarian needs its location. Which output is correct?',options:[{id:'index5',text:'Found at index 5.'},{id:'value31',text:'Found at index 31.'},{id:'index6',text:'Found at index 6.'},{id:'notfound',text:'Not found.'}],answer:'index5',answerText:'Found at index 5.',model:'31 is the matching value, stored at index 5. Print the index variable (position or mid), not items[position] or items[mid].',explanation:'An index identifies a location. Indexes start at zero. The sixth item is at index 5.'},
bubble:{id:'bubble',title:'Bubble sort: why make another pass?',type:'text',ksu:'Understanding',items:[5,9,13,18],prompt:'Pass 2 ends with this sorted list, but Swapped is True because 13 and 9 were exchanged. Should the outer WHILE run another pass, and what must that pass confirm?',requirements:['Say whether another pass runs, referring to Swapped.','Explain what the next complete pass must check and what flag value allows sorting to stop.'],scaffold:'The WHILE repeats because __. The next pass must __. If no __ occur, Swapped stays __ and __.',answerText:'Yes. It must confirm a complete pass with no swaps.',model:'Swapped is True, so the outer WHILE repeats. The next pass checks every adjacent pair. If no swaps occur, Swapped remains False and the loop stops.',explanation:'Looking sorted is not the loop condition. The swap flag records whether any swap occurred during the complete pass.'}
};
Object.assign(C.QUESTIONS.search,{title:'Locate the target: index or value?',prompt:'Target value 31 has been found. At which index is it stored? This asks for its location, not what OUTPUT found prints.',answerText:'Index 5.',model:'31 is the matching stored value. Its location is index 5; positions are numbered from zero.',explanation:'The sixth item has index 5. Value 31 is not an index. The paper pseudocode separately outputs the found flag.'});
C.QUESTIONS['binary-review']={id:'binary-review',title:'Binary search: choose the new last index',type:'text',ksu:'Understanding',target:13,indexes:{low:0,high:6,mid:3},prompt:'We are searching for value 13. The checked midpoint is index 3, which stores 18. What should the new last index, high, be? Give an index and explain which positions can be ruled out.',requirements:['State the new last index, high, not the value stored there.','Explain which indexes can be excluded using target 13, stored value 18 and the sorted order.'],scaffold:'13 is smaller than __. Sorted order rules out indexes __ to __. Keep indexes __ to __, so high becomes __.',answerText:'high = 2 (index 2).',model:'Target 13 is smaller than 18. Sorted order rules out indexes 3–6, including the checked midpoint. Keep indexes 0–2. Set high = mid - 1 = 2.',explanation:'low, high and mid are indexes. We exclude the checked midpoint because its value is already known not to match. The original list does not change.'};
C.evidence=function(n,k,starter=false){const ps=root.SEARCH_LESSON.pages.filter(p=>p.ksu===k&&(!starter||p.activity==='Starter')),checked=ps.filter(p=>p.answer&&n.pages[p.id]?.attempts?.some(a=>typeof a.correct==='boolean')),first=checked.filter(p=>n.pages[p.id].attempts.find(a=>typeof a.correct==='boolean').correct).length,latest=checked.filter(p=>[...n.pages[p.id].attempts].reverse().find(a=>typeof a.correct==='boolean').correct).length,traces=ps.filter(p=>p.kind==='searchTrace'),traceChecked=traces.filter(p=>n.pages[p.id]?.attempts?.some(a=>a.type==='search-trace')).length,paper=ps.filter(p=>n.pages[p.id]?.paperAttempted).length,written=ps.filter(p=>p.kind==='reason'&&n.pages[p.id]?.answer?.trim()).length;return {checks:checked.length,total:ps.filter(p=>p.answer).length,first,latest,traceChecked,paper,written};};
C.traceRows=function(p){return (p.algorithm==='binary'?C.binary:C.linear)(C.ITEMS,p.target).steps.map(s=>p.algorithm==='binary'?{low:String(s.low),high:String(s.high),mid:String(s.mid),value:String(s.value),action:s.found?'Set found to True':s.value<p.target?'Set low to '+s.nextLow:'Set high to '+s.nextHigh}:{index:String(s.index),value:String(s.value),match:s.found?'Yes':'No',action:s.found?'Set found to True':'Set position to '+(s.index+1)});};
C.checkTrace=function(p,rows){const expected=C.traceRows(p),keys=p.algorithm==='binary'?['low','high','mid','value']:['index','value','match'];return expected.map((e,i)=>keys.every(k=>k==='match'?String(rows[i]?.[k]??'').trim().toLowerCase()===e[k].toLowerCase():String(rows[i]?.[k]??'').trim()!==''&&Number(rows[i][k])===Number(e[k])));};
C.nextIndex=function(p,n,index){const pages=root.SEARCH_LESSON.pages,extension=pages.findIndex(x=>x.id==='sr-extension');if(p.kind==='practiceRoute'){const route=n.pages[p.id]?.choice;return !['boundary','absent','compare','python'].includes(route)?extension:pages.findIndex(x=>x.optionalRoute===route);}if(p.optionalRoute&&pages[index+1]?.optionalRoute!==p.optionalRoute)return extension;return Math.min(index+1,pages.length-1);};
C.runMatches=function(p,r){const text=String(r.output||'').replace(/\r/g,'');return r.ok===true&&r.kind==='module'&&JSON.stringify(r.inputs)===JSON.stringify(p.inputs)&&p.expected.split('\n').every(line=>text.split('\n').some(actual=>actual.trim()===line));};
})(window);
