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
C.STARTERS={linear:C.LINEAR_PY.replace('position = position + 1','position = position + 2  # Repair: advance one position.').replace('"Linear: found at index", position','"Linear: found at index", items[position]'),binary:C.BINARY_PY.replace('"Binary: found at index", mid','"Binary: found at index", items[mid]')};
C.BUBBLE=['Swapped ← True','WHILE Swapped = True','    Swapped ← False','    FOR Position ← 0 TO LEN(Items) - 2','        IF Items[Position] > Items[Position + 1] THEN','            Temp ← Items[Position]','            Items[Position] ← Items[Position + 1]','            Items[Position + 1] ← Temp','            Swapped ← True','        ENDIF','    ENDFOR','ENDWHILE'];
C.bubble=function(items){const a=items.slice(),steps=[],passes=[];let flag=true,pass=0;while(flag){if(++pass>items.length+1)throw Error('Trace did not terminate');flag=false;let swaps=0;for(let position=0;position<a.length-1;position++){const before=a.slice(),left=a[position],right=a[position+1],swapped=left>right,flagBefore=flag;if(swapped){[a[position],a[position+1]]=[right,left];flag=true;swaps++;}steps.push({pass,position,left,right,before,after:a.slice(),swapped,flagBefore,flagAfter:flag});}passes.push({pass,list:a.slice(),swaps,flag});}return {steps,passes,result:a};};
C.QUESTIONS={
search:{id:'search',title:'Search result: report the location',type:'mcq',ksu:'Skills and Understanding',target:31,prompt:'The search finds target value 31 in this list. The librarian needs its location. Which output is correct?',options:[{id:'index5',text:'Found at index 5.'},{id:'value31',text:'Found at index 31.'},{id:'index6',text:'Found at index 6.'},{id:'notfound',text:'Not found.'}],answer:'index5',answerText:'Found at index 5.',model:'31 is the matching value, stored at index 5. Print the index variable (position or mid), not items[position] or items[mid].',explanation:'An index identifies a location. Indexes start at zero. The sixth item is at index 5.'},
bubble:{id:'bubble',title:'Bubble sort: why make another pass?',type:'text',ksu:'Understanding',items:[5,9,13,18],prompt:'Pass 2 ends with this sorted list, but Swapped is True because 13 and 9 were exchanged. Should the outer WHILE run another pass, and what must that pass confirm?',requirements:['Say whether another pass runs, referring to Swapped.','Explain what the next complete pass must check and what flag value allows sorting to stop.'],scaffold:'The WHILE repeats because __. The next pass must __. If no __ occur, Swapped stays __ and __.',answerText:'Yes. It must confirm a complete pass with no swaps.',model:'Swapped is True, so the outer WHILE repeats. The next pass checks every adjacent pair. If no swaps occur, Swapped remains False and the loop stops.',explanation:'Looking sorted is not the loop condition. The swap flag records whether any swap occurred during the complete pass.'}
};
C.evidence=function(n,k,starter=false){const ps=root.SEARCH_LESSON.pages.filter(p=>p.ksu===k&&(!starter||p.activity==='Starter')),answers=ps.filter(p=>n.pages[p.id]?.answer||n.pages[p.id]?.attempts?.length),mcqs=ps.filter(p=>p.answer),checked=mcqs.filter(p=>n.pages[p.id]?.attempts?.length),first=checked.filter(p=>n.pages[p.id].attempts[0].correct),latest=checked.filter(p=>n.pages[p.id].attempts.at(-1).correct),tests=ps.filter(p=>p.kind==='code'),passed=tests.filter(p=>n.pages[p.id]?.attempts?.some(a=>a.type==='test'&&a.matched));return {answered:answers.length,checks:checked.length,first:first.length,latest:latest.length,total:mcqs.length,tests:tests.length,passed:passed.length};};
C.runMatches=function(p,r){const text=String(r.output||'').replace(/\r/g,'');return r.ok===true&&r.kind==='module'&&JSON.stringify(r.inputs)===JSON.stringify(p.inputs)&&p.expected.split('\n').every(line=>text.split('\n').some(actual=>actual.trim()===line));};
})(window);
