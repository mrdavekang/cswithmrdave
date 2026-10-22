/* Formative checks: real values/output plus published changed-data cases. Not grades. */
window.ListsChecks=(()=>{
 const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),L=LESSON.L;
 function clean(source){let out='',quote='',escape=false,comment=false;for(const ch of source){if(ch==='\n'){comment=false;out+=ch;continue;}if(comment)continue;if(quote){out+=ch;if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch===quote)quote='';}else if(ch==='"'||ch==="'"){quote=ch;out+=ch;}else if(ch==='#')comment=true;else out+=ch;}return out;}
 function parseList(text){
  let i=0;const s=String(text).trim(),values=[];if(s[i++]!=='[')return undefined;
  const space=()=>{while(/\s/.test(s[i]||'')&&i<s.length)i++;};space();
  while(i<s.length&&s[i]!==']'){
   let value;if(s[i]==='"'||s[i]==="'"){const q=s[i++];let v='',closed=false;while(i<s.length){let c=s[i++];if(c===q){closed=true;break;}if(c==='\\'){const n=s[i++];c=({n:'\n',t:'\t',r:'\r'})[n]??n;}v+=c;}if(!closed)return undefined;value=v;}
   else{const n=s.slice(i).match(/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);if(!n)return undefined;value=Number(n[0]);i+=n[0].length;}
   values.push(value);space();if(s[i]===','){i++;space();if(s[i]===']')break;}else if(s[i]!==']')return undefined;
  }
  if(s[i++]!==']')return undefined;space();return i===s.length?values:undefined;
 }
 const listLine=(line,expected)=>same(parseList(line),expected);
 function definition(source,name){
  const c=clean(source),re=new RegExp('\\b'+name+'\\s*=\\s*\\[','g'),m=re.exec(c);if(!m)return null;
  const start=m.index+m[0].lastIndexOf('[');let depth=0,q='',esc=false,end=-1;
  for(let i=start;i<c.length;i++){const ch=c[i];if(q){if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch===q)q='';}else if(ch==='"'||ch==="'")q=ch;else if(ch==='[')depth++;else if(ch===']'&&--depth===0){end=i+1;break;}}
  if(end<0)return null;return {start,end,value:parseList(c.slice(start,end)),count:[...c.matchAll(new RegExp('\\b'+name+'\\s*=\\s*\\[','g'))].length,source:c};
 }
 const result=(ok,en,zh,ko,details={})=>({ok,message:en,support:L(en,zh,ko),...details});
 function runtime(error){
  if(/IndexError/.test(error))return result(false,'That position does not exist. Count the tiles from 0 and change the index, not the whole list.','这个位置不存在。从 0 数图块，修改索引，不要重写整个列表。','그 위치는 없습니다. 타일을 0부터 세고 리스트 전체가 아니라 인덱스를 고치세요.');
  if(/NameError/.test(error))return result(false,'Python cannot find a name. Check that the list name matches exactly, including underscores.','Python 找不到名称。检查列表名是否完全相同，包括下划线。','Python이 이름을 찾지 못했습니다. 밑줄까지 포함해 리스트 이름이 같은지 확인하세요.');
  if(/SyntaxError|ParseError|IndentationError/.test(error))return result(false,'Check the error line: paired quotes, brackets, commas and indentation. Change one thing, then run again.','检查报错行的引号、括号、逗号和缩进。一次改一处，再运行。','오류 줄의 따옴표, 괄호, 쉼표와 들여쓰기를 확인하세요. 한 곳을 바꾸고 다시 실행하세요.');
  if(/limit|stopped|TimeLimit|too much/i.test(error))return result(false,'The program stopped safely. A loop must change its counter and eventually stop. Use Stop before trying another fix.','程序已安全停止。循环必须改变计数器，并最终停止。再次修改前可点击 Stop。','프로그램을 안전하게 멈췄습니다. 반복문은 카운터를 바꾸고 결국 멈춰야 합니다. 수정 전에 Stop을 사용할 수 있습니다.');
  return result(false,'Python reported an error. Read the last console line, compare the reference and try one small change. Your attempt is saved.','Python 报错了。阅读控制台最后一行，对照示例，一次修改一处。尝试已保存。','Python 오류가 났습니다. 콘솔 마지막 줄과 예시를 비교하고 한 곳을 수정하세요. 시도는 저장됩니다.');
 }
 function evaluate(id,source,r,override){
  const p=override||ListsPractice.get(id);if(!p)return result(false,'This task has no check. Show your teacher.','本题缺少检查规则，请告诉老师。','검사 규칙이 없습니다. 선생님께 알려 주세요.');
  const c=clean(source),v=p.variable,initial=p.initial,final=p.final||initial;
  if(c.includes('___'))return result(false,'Replace every ___ gap with your own value or code. The gaps are not Python answers. Compare the index tiles and the example.','把每个 ___ 换成你的值或代码。空格不是 Python 答案。比较索引图块和示例。','___를 자신의 값이나 코드로 바꾸세요. 빈칸 표시는 Python 정답이 아닙니다. 인덱스 타일과 예시를 비교하세요.');
  if(r.error)return runtime(r.error);
  const d=definition(c,v);
  if(!d||!same(d.value,initial))return result(false,`Keep the starting list ${v} exactly as shown. Add your reading or updates underneath it.`,`保留题目给出的起始列表 ${v}，在下方添加读取或更新。`,`시작 리스트 ${v}를 문제와 같게 유지하고 그 아래에 읽기나 갱신 코드를 넣으세요.`);
  if(d.count!==1)return result(false,'Do not rebuild the list to match the answer. Keep one starting definition and change individual elements by index.','不要重新定义列表来凑答案。保留一次起始定义，用索引改变元素。','정답을 맞추려고 리스트를 다시 만들지 마세요. 시작 정의 하나를 유지하고 인덱스로 요소를 바꾸세요.');
  if(p.while&&[...c.matchAll(/\bwhile\b/g)].length!==1)return result(false,'Use one while loop for the repeated prints. The reference shows a counter, a condition and a counter change.','重复输出应使用一个 while 循环。示例包含计数器、条件和计数器变化。','반복 출력에는 while 반복문 하나를 사용하세요. 예시에 카운터, 조건, 카운터 변경이 있습니다.');
  if(p.indexVariable&&!new RegExp('\\b'+v+'\\s*\\[\\s*'+p.indexVariable+'\\s*\\]').test(c))return result(false,`Use ${p.indexVariable} inside the square brackets, so changing it selects a different item.`,`在方括号内使用 ${p.indexVariable}，这样改变变量就能选择不同物品。`,`대괄호 안에 ${p.indexVariable}를 써서 변수에 따라 다른 물건을 고르게 하세요.`);
  if(p.read&&!new RegExp('\\b'+v+'\\s*\\[[^\\]\\n]+\\](?!\\s*=(?!=))').test(c))return result(false,'Read the value from the list using an index. Printing a typed copy of the answer does not read the stored data.','用索引从列表读取值。直接输入答案单词来输出，并没有读取已存数据。','인덱스로 리스트의 값을 읽으세요. 정답을 직접 입력해 출력하는 것은 저장된 값을 읽는 것이 아닙니다.');
  if(p.update&&!new RegExp('\\b'+v+'\\s*\\[[^\\]\\n]+\\]\\s*[+\\-*/]?=(?!=)').test(c))return result(false,'Use an indexed assignment to replace the selected value. Keep the original list above it.','用索引赋值替换选中的值，保留上方原列表。','인덱스 대입으로 선택한 값을 바꾸세요. 위의 원래 리스트는 유지하세요.');
  if(!same(r.vars?.[v],final))return result(false,p.update?'The stored list is not right yet. Compare each slot with the target: change only the requested values and keep the others.':'The stored list changed. This task only reads it; remove the changes and keep its original order.',p.update?'已存列表还不正确。逐项比较目标，只改变要求的值，其余保持不变。':'已存列表改变了。本题只读取，请保持原顺序。',p.update?'저장된 리스트가 아직 다릅니다. 목표와 슬롯을 비교하고 필요한 값만 바꾸세요.':'저장된 리스트가 바뀌었습니다. 읽기 과제이므로 원래 순서를 유지하세요.');
  const out=String(r.stdout||'').trim().split('\n').map(x=>x.trim()).filter(Boolean);
  if(out.length!==p.expected.length)return result(false,`Your program ran and produced ${out.length} output line(s). The target has ${p.expected.length}. Add or move print instructions; do not print the labels above the target.`,`程序已运行，输出 ${out.length} 行；目标是 ${p.expected.length} 行。添加或移动 print，不要输出目标上方的说明文字。`,`프로그램이 ${out.length}줄을 출력했습니다. 목표는 ${p.expected.length}줄입니다. print를 추가하거나 옮기고 목표 위의 설명은 출력하지 마세요.`,{actual:out.join('\n'),expected:p.expected.map(x=>Array.isArray(x)?py(x):String(x)).join('\n')});
  for(let i=0;i<out.length;i++){const want=p.expected[i];if(!(Array.isArray(want)?listLine(out[i],want):out[i]===String(want)))return result(false,`Output ${i+1} is different. Check the selected index and whether print runs before or after an update.`,`第 ${i+1} 行输出不同。检查索引，以及 print 是在更新前还是更新后执行。`,`출력 ${i+1}이 다릅니다. 인덱스와 print가 갱신 전후 중 언제 실행되는지 확인하세요.`,{actual:out[i],expected:Array.isArray(want)?py(want):String(want)});}
  if(p.update)return result(true,'The required updates and output match. Notice which slots changed and which stayed the same.','更新和输出符合目标。注意哪些位置改变了，哪些保持不变。','갱신과 출력이 목표와 같습니다. 바뀐 슬롯과 그대로인 슬롯을 확인하세요.');
  if(p.while)return result(true,'Every item is read once in the required order. The counter and stopping condition work together.','每个元素按要求顺序读取一次。计数器与停止条件共同起作用。','각 요소를 필요한 순서로 한 번씩 읽었습니다. 카운터와 종료 조건이 함께 작동합니다.');
  if(id==='create')return result(true,'Your bag stores the three items and prints them together. The square brackets keep the values in one list.','装备包保存三件物品，并一起输出。方括号把值组成一个列表。','가방에 물건 세 개를 저장하고 함께 출력했습니다. 대괄호로 값들을 리스트 하나에 묶었습니다.');
  return result(true,'Your indexed reading/output matches. Reading a value leaves the stored list unchanged.','索引读取与输出符合目标。读取值不会改变已存列表。','인덱스로 읽은 값과 출력이 맞습니다. 읽기는 저장된 리스트를 바꾸지 않습니다.');
 }
 const py=v=>LESSON.pythonLiteral(v);
 function variantSource(source,replacements){
  let output=clean(source);
  for(const [name,value]of Object.entries(replacements)){
   if(Array.isArray(value)){const d=definition(output,name);if(!d)throw new Error('Starting list not found');output=output.slice(0,d.start)+py(value)+output.slice(d.end);}
   else{const re=new RegExp('(^|\\n)([ \\t]*'+name+'\\s*=\\s*)-?\\d+(?=\\s*(?:\\n|$))');if(!re.test(output))throw new Error('Starting index not found');output=output.replace(re,(_,a,b)=>a+b+py(value));}
  }
  return output;
 }
 async function testCases(id,source,run){
  const p=ListsPractice.get(id),outcomes=[];
  for(const [i,t]of (p.tests||[]).entries()){
   let trial,check;
   try{trial=await run(variantSource(source,t.replace));const initial=t.replace[p.variable]||p.initial;check=evaluate(id,variantSource(source,t.replace),trial,{...p,initial,final:t.final||initial,expected:t.expected});}
   catch{check=result(false,'Keep the starting list and index variable visible in your editor. The changed-data test needs to find them.','请在编辑器中保留起始列表和索引变量，改变数据的测试需要找到它们。','편집기에 시작 리스트와 인덱스 변수를 유지하세요. 데이터 변경 테스트에서 필요합니다.');}
   outcomes.push({test:i+2,input:Object.entries(t.replace).map(([n,v])=>n+' = '+py(v)).join('\n'),expected:t.expected.map(x=>Array.isArray(x)?py(x):String(x)).join('\n'),actual:trial?.stdout||'',error:trial?.error||null,ok:check.ok});
   if(!check.ok)return {...result(false,`The first case worked, but test ${i+2} did not. Read the current list values instead of typing a fixed answer. Compare this test’s output below.`,`第一组成功，但测试 ${i+2} 未通过。请读取当前列表值，不要写死答案。比较下方本组测试的输出。`,`첫 경우는 맞지만 테스트 ${i+2}는 다릅니다. 고정 정답 대신 현재 리스트 값을 읽으세요. 아래 테스트 출력을 비교하세요.`),actual:trial?.stdout||trial?.error||check.message,expected:outcomes.at(-1).expected,tests:outcomes};
  }
  return {...result(true,`Your code passed all ${1+outcomes.length} published data cases. It follows the stored values, not one memorised answer.`,`代码通过全部 ${1+outcomes.length} 组公开数据测试。它读取已存值，而不是记住一个答案。`,`공개 데이터 ${1+outcomes.length}가지를 모두 통과했습니다. 외운 정답이 아니라 저장된 값을 사용합니다.`),tests:outcomes};
 }
 return {clean,same,listLine,parseList,definition,evaluate,testCases,variantSource};
})();
