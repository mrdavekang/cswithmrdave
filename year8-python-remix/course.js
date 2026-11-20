'use strict';
const Remix=(()=>{
const T=(en,zh,ko)=>({en,zh,ko});
const list=()=>[["Starter studio","studio"],["List studio","roster"],["Decision studio","gate"],["Test studio","lab"]].map(([name,route])=>({name,route,lang:"en"}));
const L={
 say:T('Put the message between quotation marks, inside print( ).','把文字放在引号内，再放进 print() 的括号里。','문자열을 따옴표로 감싸고 print() 괄호 안에 넣으세요.'),
 ask:T('Read an answer with input(). Store it on the left of =. Print the variable without quotes.','用 input() 读取回答。等号左边的变量保存回答。输出变量时不要加引号。','input()으로 답을 받고 = 왼쪽 변수에 저장하세요. 변수를 출력할 때는 따옴표를 쓰지 마세요.'),
 items:T('Count positions from 0. Replace with list[index] = value. Print after each change.','位置从 0 开始。用 列表[索引] = 新值 替换元素。每次修改后输出。','위치는 0부터 셉니다. 목록[인덱스] = 값으로 바꾸고 변경할 때마다 출력하세요.'),
 add:T('append() adds one item at the end. len() counts the items.','append() 在末尾添加一个元素。len() 计算元素个数。','append()는 끝에 항목 하나를 추가하고 len()은 항목 수를 셉니다.'),
 number:T('input() reads text. int() turns whole-number text into a number before you add or compare.','input() 读入文本；先用 int() 转成整数，再进行加法或比较。','input()은 글자를 읽습니다. 더하거나 비교하기 전에 int()로 정수로 바꾸세요.'),
 rule:T('Read the rule. Put : after if and else. Indent each message by four spaces.','阅读条件。if 和 else 行末要加冒号，每条输出语句前留四个空格。','조건을 읽으세요. if와 else 줄 끝에 :를 쓰고 출력 줄은 네 칸 들여쓰세요.'),
 copy:T('Type the model in YOUR CODE, then run it.','在“你的代码”中照着输入完整示例，然后运行。','내 코드에 예시를 입력한 다음 실행하세요.'),
 repair:T('Find one mistake in YOUR CODE. Fix it and run.','找出“你的代码”中的一个错误，修正并运行。','내 코드에서 오류 하나를 찾아 고치고 실행하세요.'),
 change:T('Edit YOUR CODE to meet the target. Run to check.','修改你的代码，使结果符合目标，然后运行检查。','목표에 맞게 내 코드를 수정하고 실행하세요.'),
 lead:T('Read the model, then choose the sentence that fits.','先看示例，再选择意思正确的句子。','예시를 읽고 알맞은 설명을 고르세요.'),
 };
const choose=(title,prompt,opts,key,why,example='')=>({kind:'choice',title,prompt,opts,key,why,example});
const poll=(title,prompt,opts)=>({kind:'poll',title,prompt,opts});
const short=(title,prompt,stem,words,sample,answers)=>({kind:'short',title,prompt,stem,words,sample,answers});
const test=(inputs,output)=>({inputs,output});
const run=(title,action,model,starter,tests,guide,extra={})=>({kind:'run',title,prompt:L[action],model,starter,tests,guide,...extra});
const goal=(en,zh,ko)=>T(en,zh,ko);
const quote=x=>JSON.stringify(x);
const pyList=xs=>'['+xs.map(x=>"'"+x+"'").join(', ')+']';
const select=(en,zh,ko)=>T(en,zh,ko);
const stdInputs=['Luna','Orbit'];
function course(route,day,name=''){
 if(route==='waiting')return [];
 const second=day===2,stage=second?'Sound check':'Arcade open',greet=second?'Encore!':'Ready!',buddy=second?'Echo':'Pixel',other=second?'Beat':'Nova',v=second?'artist':'name',prompt=second?'Artist? ':'Name? ',tag=second?'Headliner':'Player',lim=second?12:10, pass=second?'Play':'Open',fail=second?'Wait':'Hold';
 const msg=x=>'print('+quote(x)+')', show=msg(greet), echo=x=>v+' = input('+quote(prompt)+')\nprint('+x+')', echoModel=echo(v);
 const sayRun=(title,txt,action='copy',starter='',extra={})=>run(title,action,msg(txt),starter,[test([],txt)],L.say,extra);
 const echoes=(prefix='')=>stdInputs.map(n=>test([n],prefix+n));
 const crew=second?'band':'crew', init=second?['Bass','Keys','Flute']:['Nova','Echo','Pixel'], newOne=second?'Drum':'Luna', last=second?'Bell':'Orbit';
 const orig=crew+' = '+JSON.stringify(init), pr='print('+crew+')', ix=crew+'[1] = '+quote(newOne), ap=crew+'.append('+quote(last)+')', count='print(len('+crew+'))', swapped=[init[0],newOne,init[2]],final=[...swapped,last];
 const points=second?'beats':'tokens',read=points+' = int(input())', cmp=(op='>=',cut=lim)=>read+'\nif '+points+' '+op+' '+cut+':\n    '+msg(pass)+'\nelse:\n    '+msg(fail),gtests=(cut=lim)=>[cut-1,cut,cut+1].map(n=>test([String(n)],n>=cut?pass:fail));
 const c=[],C=(...cs)=>c.push(...cs); const askMC=choose;
 const meaning=(title,example,opts,key,why)=>choose(title,L.lead,opts,key,why,example);
 const optShow=T('It shows the words on the screen.','它在屏幕上显示文字。','화면에 글자를 보여 줍니다.'),optWait=T('It waits for me to type an answer.','它等待我输入回答。','내가 답을 입력할 때까지 기다립니다.'),optPick=T('Python chooses a name for me.','Python 帮我选名字。','파이썬이 이름을 골라 줍니다.');
 const shown=T('The message appeared without you typing an answer.','你不必输入回答，消息就出现了。','답을 입력하지 않아도 메시지가 나타났습니다.');
 const card3=(code,txt)=>run('First remix','change',msg(greet),code,[test([],txt)],L.say,{goal:goal('Make the screen say '+txt,'让屏幕显示 '+txt,txt+' 문구를 출력하세요.')});
 C(sayRun(stage,greet,'change',show,{goal:T('Press Run. Watch the console.','按运行，观察输出区。','실행을 누르고 출력을 보세요.')}),meaning('What did print do?',show,[optShow,optWait],0,shown),card3(show,second?'Mic on!':'Game on!'));
 let project,projectStart,projectTests,projectGuide,projectGoal,upgrade,upgradeTests,bug,why,extensionPrompt;
 if(route==='studio'){
 const script=msg(tag)+'\n'+echoModel, labelled='print('+quote(tag+':')+', '+v+')', improved=msg(tag)+'\n'+v+' = input('+quote(prompt)+')\n'+labelled;
 C(sayRun('Type a message',greet),sayRun('Punctuation inside the message',second?'One, two!':'3, 2, 1!'),sayRun('Change one word',buddy,'change',msg(other)),
 sayRun('Repair the missing quote',stage,'repair','print("'+stage+')'),
 run('Your own message','change',show,'',[test([],'')],L.say,{free:true,goal:T('Write a message of your own. Make it appear on one line.','自己写一句话，让它单独显示在一行。','나만의 메시지를 한 줄로 출력하세요.')}),
 run('Ask one question','copy',v+' = input('+quote(prompt)+')','',[test(['Luna'],'')],L.ask,{mustAsk:true,goal:T('When Python asks, type Luna in the console. Nothing is printed yet.','看到提示时在输入区输入 Luna。此时还没有输出回答。','질문이 뜨면 콘솔에 Luna를 입력하세요. 아직 답은 출력되지 않습니다.')}),
 meaning('What did input do?',v+' = input('+quote(prompt)+')',[optPick,optWait],1,T('Your program paused until you answered.','程序等你输入后才继续。','답을 입력할 때까지 프로그램이 멈췄습니다.')),
 run('Show the answer','change',echoModel,v+' = input('+quote(prompt)+')\n',echoes(),L.ask),
 run('Repair the printed word','repair',echoModel,echo(quote(v)),echoes(),L.ask),
 meaning('Where did the answer go?',v+' = input('+quote(prompt)+')',[T('The variable stores my answer.','变量保存了我的回答。','변수에 내 답이 저장됩니다.'),T('I must type the variable name.','我必须输入变量名。','꼭 변수 이름을 입력해야 합니다.')],0,T('The name on the left holds the text you typed.','等号左边的变量保存你输入的文字。','왼쪽 변수에 입력한 글자가 저장됩니다.')));
 C(meaning('Read a variable','Input: Luna\n'+echoModel,[T('It prints the variable’s name.','它输出变量的名字。','변수 이름을 출력합니다.'),'Luna',optWait],1,T('Without quotes, Python reads the value.','没有引号时，Python 读取变量的值。','따옴표가 없으면 변수의 값을 읽습니다.')),
 short('One word is enough',T('Finish: print() ___ a message.','填空：print() ___ 一条消息。','빈칸: print()는 메시지를 ___.'),'print() …',['shows','waits','显示','보여 준다'],'input() waits for my answer.',['shows','show','displays','prints','outputs','显示','输出','보여 준다','출력한다']),
 meaning('Now read the quotes',msg(v),[T('It prints the letters inside the quotes.','它输出引号里的文字。','따옴표 속 글자를 출력합니다.'),T('It prints the stored answer.','它输出保存的回答。','저장한 답을 출력합니다.')],0,T('Quoted text is printed exactly as written.','引号里的文字会原样输出。','따옴표 안 글자가 그대로 출력됩니다.')));
 project=script;projectStart=msg(tag)+'\n';projectTests=stdInputs.map(n=>test([n],tag+'\n'+n));projectGuide=L.ask;projectGoal=T('Print the title, ask for a name, then show that name.','先显示标题，再询问名字并输出名字。','제목을 출력하고 이름을 물은 뒤 그 이름을 출력하세요.');
 upgrade=improved;upgradeTests=stdInputs.map(n=>test([n],tag+'\n'+tag+': '+n));bug=improved.replace(', '+v+')',', '+quote(v)+')');
 why=meaning('Explain the whole program',script,[optPick,T('I type a name. Python stores it, then shows it.','我输入名字，Python 保存后再输出。','내가 입력한 이름을 저장한 뒤 출력합니다.'),T('It always prints Luna.','它总是输出 Luna。','항상 Luna만 출력합니다.')],1,L.ask);
 extensionPrompt=T('Why did the second name appear?','为什么显示了第二个名字？','두 번째 이름이 왜 나타났나요?');
 }else{
 const isR=route==='roster', isG=route==='gate';
 const addOne=read+'\nprint('+points+' + 1)',same=orig+'\n'+ix+'\n'+pr, grow=orig+'\n'+ap+'\n'+pr+'\n'+count;
 const target=(x)=>[test([],x)], indices=orig+'\nprint('+crew+'[1])', calc=[test(['5'],'6'),test(['9'],'10')];
 const pred=(title,source,opts,k,guide)=>choose(title,T('Predict the output. Pick one.','预测输出。选一个答案。','출력을 예상하고 하나를 고르세요.'),opts,k,guide,source);
 if(isR){
 C(run('Type a list and read it','copy',indices,'',target(init[1]),L.items),
 run('Read the third item','change',indices,indices,target(init[2]),L.items),
 run('Replace one item','copy',same,'',target(pyList(swapped)),L.items),
 run('Repair the index','repair',same,same.replace('[1]','[0]'),target(pyList(swapped)),L.items),
 pred('Count after replacement',same+'\n'+count,['2','3','4'],1,L.items),
 run('Type an append','copy',grow,'',target(pyList([...init,last])+'\n4'),L.add),
 run('Print before and after','change',orig+'\n'+pr+'\n'+ap+'\n'+pr,orig+'\n'+ap+'\n'+pr,target(pyList(init)+'\n'+pyList([...init,last])),L.add),
 run('Count the current list','copy',orig+'\n'+count,'',target('3'),L.add),
 run('Repair the count','repair',grow,grow.replace('len('+crew+')','len('+crew+'[0])'),target(pyList([...init,last])+'\n4'),L.add),
 pred('Find the new final item',grow+'\nprint('+crew+'[3])',[last,newOne,init[2]],0,L.add));
 }else if(isG){
 C(run('Type a numeric input','copy',addOne,'',calc,L.number),pred('Input is 9. What prints?',addOne,['91','10','9'],1,L.number),
 run('Add two instead','change',addOne,addOne,[test(['5'],'7'),test(['9'],'11')],L.number),
 run('Repair text plus number','repair',addOne,addOne.replace('int(input())','input()'),calc,L.number),
 run('Display double','change',addOne,read+'\n',[test(['4'],'8'),test(['7'],'14')],L.number),
 run('Type both branches','copy',cmp(),'',gtests(),L.rule),
 pred('At the cut-off: '+lim,cmp(),[fail,pass],1,L.rule),
 run('Repair the boundary','repair',cmp(),cmp('>'),gtests(),L.rule),
 run('Repair the else message','repair',cmp(),cmp().replace(msg(fail),msg(pass)),gtests(),L.rule),
 run('Move the cut-off up one','change',cmp(),cmp(),gtests(lim+1),L.rule,{goal:T('Raise the cut-off to '+(lim+1),'将门槛提高到 '+(lim+1),'기준값을 '+(lim+1)+'로 올리세요.')}));
 }else{
 C(pred('Read the index',indices,[init[0],init[1],init[2]],1,L.items),run('Type the line that retrieves','change',indices,orig+'\n',target(init[1]),L.items),
 pred('Which final length?',grow,['3','4','5'],1,L.add),run('Trace then repair','repair',same,same.replace('[1]','[2]'),target(pyList(swapped)),L.items),
 run('Show two snapshots','change',same,orig+'\n',target(pyList(init)+'\n'+pyList(swapped)),L.items),
 run('Type to test a rule','copy',cmp(),'',gtests(),L.rule),
 pred('What if the input is '+lim+'?',cmp('>'),[pass,fail],1,L.rule),
 run('Find the off-by-one','repair',cmp(),cmp('>',lim),gtests(),L.rule),
 run('Change a numeric result','change',addOne,addOne,[test(['4'],'12'),test(['2'],'6')],L.number,{goal:T('Print three times the input.','输出输入值的三倍。','입력값의 세 배를 출력하세요.')}),
 pred('Trace a new input: '+(lim-1),cmp(),[fail,pass],0,L.rule));
 }
 C(isR?pred('Pit stop: what stays the same?',same+'\n'+count,['3','4'],0,L.items):pred('Pit stop: input is '+(lim+1),cmp(),[fail,pass],1,L.rule),
 isR?meaning('Pick the line that adds a slot',grow,[ix,ap,pr],1,L.add):meaning('Pick the line that converts text',cmp(),[msg(pass),read,'else:'],1,L.number),
 poll('Choose your support',T('What would you like on your next build?','下一步你想要哪种帮助？','다음 활동에서 어떤 도움이 필요할까요?'),['Show the model first','Let me try first']));
 if(isR||(!isG&&second)){
 project=orig+'\n'+ix+'\n'+pr+'\n'+ap+'\n'+pr;projectStart=orig+'\n';projectTests=target(pyList(swapped)+'\n'+pyList(final));projectGuide=L.items;
 projectGoal=T('Replace the second item and print. Append the late arrival and print again.','替换第二项并输出。再把新成员加到末尾并再次输出。','두 번째 항목을 바꾸고 출력하세요. 새 항목을 끝에 추가하고 다시 출력하세요.');
 upgrade=project+'\n'+count;upgradeTests=target(projectTests[0].output+'\n4');bug=upgrade.replace('[1]','[0]');why=meaning('Which line makes the list longer?',upgrade,[ix,ap,count],1,L.add);extensionPrompt=T('Which line changed the length? How can you tell?','哪一行改变了长度？你从哪里看出来？','어느 줄이 길이를 바꾸었나요? 어떻게 알 수 있나요?');
 }else{
 project=cmp();projectStart=read+'\n';projectTests=gtests();projectGuide=L.rule;projectGoal=T('Print '+pass+' at '+lim+' or more. Otherwise print '+fail+'.','达到 '+lim+' 时输出 '+pass+'，否则输出 '+fail+'。',lim+' 이상이면 '+pass+', 아니면 '+fail+'를 출력하세요.');
 upgrade=cmp('>=',lim+2);upgradeTests=gtests(lim+2);bug=cmp('>',lim+2);why=pred('Test the new cut-off: '+(lim+2),upgrade,[fail,pass],1,L.rule);extensionPrompt=T('Why does the exact cut-off matter?','为什么要测试刚好等于门槛的数？','기준값 자체를 확인해야 하는 이유는 무엇인가요?');
 }
 }
 if(second && route==='studio'){
  project='artist = input("Artist? ")\nsong = input("Song? ")\nprint(artist)\nprint(song)';
  projectStart='artist = input("Artist? ")\n';projectTests=[test(['Echo','Moon'],'Echo\nMoon'),test(['Nova','Rain'],'Nova\nRain')];
  projectGoal=T('Ask twice: first for an artist, then for a song. Print each answer on its own line.','先问歌手，再问歌名，用两个变量保存。每行输出一个答案。','가수와 노래를 차례로 물어 두 변수에 저장하고 한 줄씩 출력하세요.');
  upgrade=project.replace('print(artist)\nprint(song)','print(artist, "plays", song)');upgradeTests=[test(['Echo','Moon'],'Echo plays Moon'),test(['Nova','Rain'],'Nova plays Rain')];bug=upgrade.replace('"plays", song','"plays", "song"');
  why=meaning('Explain the announcement',project,[T('It asks twice and shows both answers.','它问两次，然后输出两个回答。','두 번 묻고 두 답을 출력합니다.'),optPick],0,L.ask);
 }
 if(second && route==='gate'){
  project=read+'\ntotal = beats + 2\nif total >= 12:\n    print("Play")\nelse:\n    print("Wait")';
  projectStart=read+'\n';projectTests=[test(['9'],'Wait'),test(['10'],'Play'),test(['11'],'Play')];
  projectGoal=T('Add two bonus beats before testing the 12-beat limit.','先加两个奖励节拍，再检查是否达到 12。','보너스 박자 2를 더한 뒤 12 이상인지 확인하세요.');
  upgrade=project.replace('+ 2','+ 3');upgradeTests=[test(['8'],'Wait'),test(['9'],'Play'),test(['10'],'Play')];bug=upgrade.replace('>=','>');
  why=meaning('Which value is checked?',project,['The input before the bonus','The total after the bonus'],1,L.rule);
 }
 const txt=(en,zh,ko)=>T(en,zh,ko);
 C(choose('Plan the first line',projectGoal,[project.split('\n')[0],project.split('\n').at(-1)],0,projectGuide),
 run('Build your starting version','change',project,projectStart,projectTests,projectGuide,{goal:projectGoal,build:true}),
 why,
 short('Look at your output',T('Name one thing your program showed. A word or short phrase is enough.','写出程序显示的一项内容。一个词或短语就可以。','프로그램이 출력한 것 하나를 단어나 짧은 구로 적으세요.'),'It showed …',route==='studio'?['Luna','Orbit','Player','Artist']:['first list','new item','message','cut-off'],route==='studio'?'“the name I typed”':'“the changed list”'),
 run('Upgrade your program','change',upgrade,project,upgradeTests,projectGuide,{from:17,goal:route==='studio'?txt('Keep the title. Label the answer as in the target.','保留标题，按目标格式给回答加上标签。','제목은 그대로 두고 목표처럼 답 앞에 이름표를 붙이세요.'):upgrade.includes('.append')?txt('Add a final line showing the length.','最后再输出列表长度。','마지막에 목록 길이를 출력하세요.'):txt('Raise the cut-off to '+(lim+2),'把门槛改到 '+(lim+2),'기준값을 '+(lim+2)+'로 바꾸세요.')}),
 run('Debug a fresh copy','repair',upgrade,bug,upgradeTests,projectGuide),
 choose('Which test would catch the mistake?',T('Compare the bug with the working example. Choose a useful check.','比较错误和正确示例，选择有效的测试。','오류와 올바른 예시를 비교하고 유용한 검사를 고르세요.'),route==='studio'?['Count the code lines','Enter a different name and check what prints']:upgrade.includes('.append')?['Check only the length','Check the second item, not just the length']:['Test exactly '+(lim+2),'Only test 100'],route==='studio'||upgrade.includes('.append')?1:0,projectGuide,bug),
 run('Test your repair again','change',upgrade,upgrade,upgradeTests,projectGuide,{from:21,goal:txt('Run the repaired code. Compare every output with its target.','运行修正后的代码。逐行比较输出和目标。','고친 코드를 실행하고 출력을 목표와 비교하세요.')}),
 run('Make a personal remix','change',upgrade,upgrade,[],projectGuide,{from:20,remix:upgrade,free:true,goal:txt('Change a name, message, or rule. Run your own version successfully.','修改名字、信息或规则，再运行自己的版本。','이름, 메시지 또는 규칙을 바꾸고 나만의 버전을 실행하세요.')}),
 poll('Peer test',txt('Show your remix to a partner or test it yourself. What happened?','请同伴试用，或自己再测一次。结果如何？','짝에게 보여 주거나 직접 다시 시험하세요. 어떻게 되었나요?'),['It matched the prediction','I fixed it and tested again','I found something to ask about']),
 short('Explain one change',extensionPrompt,'It showed … because …',['typed','stored','printed','changed','index','limit'],route==='studio'?'“It showed Mochi because my friend typed Mochi.”':'“The result changed because I changed the rule.”'),
 poll('What helped you?',txt('Choose what helped you work independently today.','今天哪一种方法最能帮你独立完成？','오늘 혼자 해결하는 데 무엇이 도움이 되었나요?'),['Seeing the output change','Typing the example','Fixing a mistake','Testing with a partner','It has not clicked yet']),
 poll('What should Mr Dave do next?',txt('Choose one kind of support for next lesson.','为下节课选一种你想要的帮助。','다음 시간에 원하는 도움 한 가지를 고르세요.'),['Show one slowly first','Leave the full example visible','Let me try before showing an example','Give me a harder bug','Check in with me']),
 {kind:'finish',title:'Review and submit',prompt:txt('Check your work and feedback before exporting your learning record.','导出学习记录前，请检查作品和反馈。','학습 기록을 내보내기 전에 코드와 의견을 확인하세요.')});
 if(c.length!==30)throw Error('Course length '+c.length);
 if(route==='studio'){
  // The question appears after a successful run on these two sprint cards.
  const waitQ=c[9],storeQ=c[12];
  c[9]=run('Type it, then explain input','copy',echoModel,'',echoes(),L.ask,{after:waitQ});
  const ownVar=second?'show':'game',ownQ=second?'Show? ':'Game? ';
  c[12]=run('Make a tiny interview','change',echoModel,'',echoes(),L.ask,{after:storeQ,mustAsk:true,goal:T('Ask about a '+ownVar+', store the reply, then print it. Try a different answer.','询问'+(second?'演出':'游戏')+'，保存并输出回答，再换一个答案测试。',(second?'공연':'게임')+'을 묻고 답을 저장한 뒤 출력하세요. 다른 답도 시험하세요.')});
 }
 if(second && route==='studio')c[20].goal=T('Keep both answers. Display them together as Artist plays Song.','保留两个回答，按“歌手 plays 歌名”的格式输出。','두 답을 가수 plays 노래 형식으로 함께 출력하세요.');
 if(second && route==='gate'){c[20].goal=T('Change the bonus from two beats to three. Keep the cut-off at 12.','奖励从 2 改为 3，门槛仍然是 12。','보너스를 2에서 3으로 바꾸고 기준 12는 유지하세요.');c[22].opts=['Test input 9: total is exactly 12','Only test 100'];}
 return c;}
return {list,course,T,L};
})();if(typeof module!=='undefined')module.exports=Remix;
