(function(){
  'use strict';
  const h=React.createElement, L=Lesson;
  // React renders asynchronously: a try/catch around root.render cannot catch
  // errors inside a lesson card. Keep an actionable screen if a card fails.
  class LessonBoundary extends React.Component {
    constructor(props){super(props);this.state={error:null};}
    static getDerivedStateFromError(error){return {error};}
    componentDidCatch(error,info){console.error('Lesson display failed',error,info);}
    render(){
      if(!this.state.error)return this.props.children;
      return h('main',{className:'landing'},h('section',{className:'entry',role:'alert'},
        h('h1',null,'The lesson could not open'),
        h('p',null,'Your saved work has not been deleted. Reload this page, then enter the same name and class to resume.'),
        h('button',{type:'button',className:'primary',onClick:()=>window.location.reload()},'Reload lesson'),
        h('p',{className:'hint'},'If this happens again, show this message to your teacher. Do not clear your browser data.'),
        h('details',null,h('summary',null,'Error details for your teacher'),h('p',null,String(this.state.error.message||this.state.error)))));
    }
  }
  function Button({children,...props}){return h('button',{type:'button',...props},children);}
  function Reading({title='Read first',children}){return h('section',{className:'reading-panel'},h('h2',null,title),children);}
  function WritingSteps({ids,active,onActive,renderField,answers}){
    const selected=ids.includes(active)?active:ids[0],index=ids.indexOf(selected);
    return h('section',{className:'writing-steps'},
      h('h2',null,'Write one instruction at a time'),
      h('div',{className:'step-tabs','aria-label':'Choose an instruction'},ids.map(id=>h(Button,{key:id,'aria-pressed':id===selected,onClick:()=>onActive(id)},'Step '+id.slice(4)+(L.hasResponse(answers[id])?' ✓':'')))),
      h('p',{className:'hint'},'Instruction '+(index+1)+' of '+ids.length+' on this card. A tick means you added an answer, not that it has been marked correct.'),
      renderField(selected),
      h('div',{className:'button-row'},index>0&&h(Button,{className:'secondary',onClick:()=>onActive(ids[index-1])},'Previous instruction'),index<ids.length-1&&h(Button,{className:'primary',onClick:()=>onActive(ids[index+1])},'Next instruction')),
      h('p',{className:'hint'},'Finish all three instructions, then use Continue at the bottom. It will show any answer you missed.'));
  }
  function SupportChoices({id,help,device,onHelp,onDevice}){
    return h('fieldset',{className:'support-choices'},h('legend',null,'Language & device support'),
      h('div',{className:'support-inputs'},h('label',{htmlFor:id+'-language'},'Word meanings',h('select',{id:id+'-language',value:help,onChange:e=>onHelp(e.target.value)},h('option',{value:'plain'},'Plain English'),h('option',{value:'zh'},'English + 中文'),h('option',{value:'ms'},'English + Bahasa Melayu'))),
      h('label',{htmlFor:id+'-device'},'Your device',h('select',{id:id+'-device',value:device,onChange:e=>onDevice(e.target.value)},h('option',{value:'auto'},'Choose a saving guide later'),h('option',{value:'ipad'},'iPad / iPhone'),h('option',{value:'android'},'Android tablet'),h('option',{value:'computer'},'Mac / Windows / Chromebook')))),
      h('p',{className:'hint'},'Choose what helps you. Word help is not a full translation. You can change these choices at any time.'));
  }
  function Symbols(){return h('section',{className:'symbol-guide','aria-label':'Flowchart symbol guide'},h('h2',null,'Look: the shapes in a flowchart'),
    h('div',{className:'symbol-grid'},h('div',null,h('span',{className:'oval'},'START / END'),h('b',null,'Oval'),h('p',null,'Where this plan begins or finishes.')),
      h('div',null,h('span',{className:'flow-box'},'WALK to Reception'),h('b',null,'Rectangle'),h('p',null,'One action: what to do.')),
      h('div',null,h('span',{className:'symbol-arrow','aria-hidden':true},'↓'),h('b',null,'Arrow'),h('p',null,'The order: follow it to the next step.'))),
    h('p',{className:'hint'},'A flowchart is a picture of instructions. Today we use a sequence, so no decision diamond is needed.'));
  }
  function MapView({detail=false,alternative=false,focus=''}){
    return h('figure',{className:'map'},h('img',{src:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(schoolMap(detail,alternative,focus)),alt:alternative?'Alternative permitted route: Reception, Covered Courtyard, East Door, East Corner, C1. Main Corridor is closed after the Library.':'Practice map, one floor. Face Reception from the Main Entrance. At Reception turn right to the Library. Continue to the junction and turn left to C1. The branch above Reception is staff-only.'}),h('figcaption',null,'Practice map • one floor • the lines are corridors • stay in class to test it.'));
  }
  function Field({id,label,value,onChange,onStarter,hint,options,error,rows=2}){
    const guide=!options&&L.scaffolds[id],tip=guide?.hint||hint;
    return h('div',{id:'field-'+id,className:'field question-panel'+(error?' missing':''),tabIndex:-1},h('span',{className:'panel-label'},options?'Your turn · choose':'Your turn · answer'),h('label',{htmlFor:id},label),tip&&h('p',{id:id+'-hint',className:'hint'},tip),
      guide&&h('div',{className:'writing-guide'},h('p',null,h('b',null,'Sentence starter: '),h('span',null,guide.frame)),h('p',{className:'word-bank'},h('b',null,'Useful words: '),guide.words.join(' · ')),h(Button,{className:'starter-button secondary',disabled:!!String(value||'').trim(),onClick:()=>onStarter(id),title:String(value||'').trim()?'Your answer is kept. You can still use the frame above.':undefined},'Put the starter in my answer'),h('small',null,'Replace each ___ with your idea. Or write your own short answer.')),
      options?h('select',{id,value:value||'',onChange:e=>onChange(id,e.target.value),'aria-describedby':tip?id+'-hint':undefined,'aria-invalid':!!error},h('option',{value:''},'Choose…'),options.map(v=>h('option',{key:v,value:v},v))):h('textarea',{id,rows,value:value||'',onChange:e=>onChange(id,e.target.value),'aria-describedby':tip?id+'-hint':undefined,'aria-invalid':!!error,placeholder:'Write a short answer here. You may use the starter above.'}),
      error&&h('p',{className:'error'},/_{3,}/.test(value||'')?'Replace the ___ gaps with your ideas, or write your own answer.':'Add a short answer here. Your own words and language are welcome.'));
  }
  function RadioField({id,label,options,value,onChange,error}){
    return h('fieldset',{id:'field-'+id,className:'field'+(error?' missing':''),tabIndex:-1},h('legend',null,label),options.map(([v,explain])=>h('label',{className:'option',key:v},h('input',{type:'radio',name:id,value:v,checked:value===v,onChange:()=>onChange(id,v)}),h('span',null,h('strong',null,v),explain&&h('small',null,explain)))),error&&h('p',{className:'error'},'Choose the statement that fits you. There is no best answer.'));
  }
  function Quiz({id,result={},change,check,support,error}){
    const q=L.questions[id], selected=Number.isInteger(result.choice), checked=result.checked===result.choice && result.checked!==null && selected;
    return h('fieldset',{id:'field-q:'+id,tabIndex:-1,className:'quiz'+(error?' missing':'')},h('legend',null,q.title),q.choices.map((choice,i)=>h('label',{className:'option',key:choice},h('input',{type:'radio',name:'quiz-'+id,checked:result.choice===i,onChange:()=>change(id,i)}),h('span',null,choice))),
      h(Button,{className:'secondary',onClick:()=>check(id)},'Check my thinking'),
      !checked&&error&&h('p',{className:'error'},selected?'Tap “Check my thinking” to review your answer.':'Choose an answer, then check your thinking.'),
      checked&&h('div',{className:result.correct?'feedback good':'feedback help',role:'status'},result.correct?h('p',null,'Yes. '+q.why):h(React.Fragment,null,h('p',null,q.hint),h('p',null,'Try again. If you are still unsure, read the explanation below.'),h('details',null,h('summary',null,'Explain this to me'),h('p',null,q.why),h('p',null,'The suggested answer is: '+q.choices[q.correct]),h(Button,{onClick:()=>support(id),className:'secondary'},'I have reviewed this — continue with support')))),
      result.supported&&h('p',{className:'feedback help',role:'status'},'Recorded as completed with support. You may come back and try independently.')
    );
  }
  function Flow({steps,active}) {return h('div',{className:'flow', 'aria-label':'Your algorithm shown as a flowchart'},h('div',{className:'oval'},'START'),steps.map((s,i)=>h(React.Fragment,{key:i},h('div',{'aria-hidden':true,className:'arrow'},'↓'),h('div',{className:'flow-box'+(i===active?' selected':'')},h('b',null,(i+1)+'. '),s))),h('div',{'aria-hidden':true,className:'arrow'},'↓'),h('div',{className:'oval'},'END'))};
  function QuizGroup({ids,render}){return h('div',{className:'quiz-group'},ids.map((id,i)=>h('details',{key:id,open:i===0,onToggle:e=>{if(e.currentTarget.open)for(const other of e.currentTarget.parentElement.children)if(other!==e.currentTarget)other.open=false;}},h('summary',null,'Check '+(i+1)+' of '+ids.length),render(id),i<ids.length-1&&h(Button,{className:'secondary',onClick:e=>{const current=e.currentTarget.closest('details');current.open=false;current.nextElementSibling.open=true;current.nextElementSibling.querySelector('summary').focus();}},'Open the next check'))));}
  function App(){
    const [state,setState]=React.useState(null),[name,setName]=React.useState(''),[className,setClass]=React.useState(''),[support,setSupport]=React.useState('plain'),[device,setDevice]=React.useState('auto');
    const [errors,setErrors]=React.useState([]),[notice,setNotice]=React.useState(''),[save,setSave]=React.useState(''),[openHelp,setOpenHelp]=React.useState(false),[showMap,setShowMap]=React.useState(false),[detail,setDetail]=React.useState(true),[pdf,setPdf]=React.useState(null),[busy,setBusy]=React.useState(false),[photos,setPhotos]=React.useState([]),[photoHelp,setPhotoHelp]=React.useState(false),[ext,setExt]=React.useState('');
    const [writingStep,setWritingStep]=React.useState(null);
    const helpRef=React.useRef(null), mapRef=React.useRef(null), keyRef=React.useRef(''), stateRef=React.useRef(state), pdfUrl=React.useRef(''); stateRef.current=state;
    const helpChosen=React.useRef(false),deviceChosen=React.useRef(false);
    React.useEffect(()=>{if(openHelp)helpRef.current?.showModal();else helpRef.current?.close();},[openHelp]);
    React.useEffect(()=>{if(showMap)mapRef.current?.showModal();else mapRef.current?.close();},[showMap]);
    React.useEffect(()=>{if(!state)return;setSave('Saving…'); const timer=setTimeout(()=>{try{localStorage.setItem(keyRef.current,JSON.stringify(state));setSave('Saved on this browser');}catch{setSave('Not saved: browser storage unavailable. Keep this page open and export your report.');}},200);return()=>clearTimeout(timer);},[state]);
    React.useEffect(()=>{const persist=()=>{if(stateRef.current&&keyRef.current)try{localStorage.setItem(keyRef.current,JSON.stringify(stateRef.current));}catch{}};window.addEventListener('pagehide',persist);return()=>window.removeEventListener('pagehide',persist);},[]);
    React.useEffect(()=>{if(state){document.getElementById('card-title')?.focus();window.scrollTo(0,0);}},[state?.current]);
    React.useEffect(()=>{if(!state)return;const record=e=>{const control=e.target.closest?.('button,summary,input[type="checkbox"],input[type="radio"],select');if(!control)return;const label=control.getAttribute('aria-label')||control.textContent?.trim()||control.name||control.id||control.type;setState(s=>s?{...s,events:[...s.events,{time:new Date().toISOString(),card:L.cards[s.current].id,action:'Click: '+String(label).slice(0,180)}]}:s);};document.addEventListener('click',record);return()=>document.removeEventListener('click',record);},[!!state]);
    function update(fn,action){setState(s=>{const n=fn(s);return {...n,completed:n.completed.filter(id=>L.missing(n,id).length===0),updated:new Date().toISOString(),events:action?[...n.events,{time:new Date().toISOString(),card:L.cards[s.current].id,action}]:n.events};});}
    function answer(id,value){update(s=>({...s,answers:{...s.answers,[id]:value}}));if(id!=='deviceChoice')setPdf(null);}
    function addStarter(id){
      if(!L.scaffolds[id]||String(state.answers[id]||'').trim())return;
      const frame=L.scaffolds[id].frame;
      update(s=>({...s,answers:{...s.answers,[id]:frame},writingSupport:[...(s.writingSupport||[]),{field:id,frame,time:new Date().toISOString()}]}),'Used sentence starter: '+L.answerLabel(id));
      setPdf(null);setTimeout(()=>{const input=document.getElementById(id);input?.focus();const start=frame.indexOf('___');if(start>=0)input?.setSelectionRange(start,start+3);},0);
    }
    function start(e){
      e.preventDefault();const teacher=name.trim().toLowerCase()==='teacher';if(!name.trim()||(!teacher&&!className.trim())){setNotice('Enter your name and class to start.');return;}
      const cl=teacher?'Review':className.trim(), key=L.storageKey(name,cl);keyRef.current=key;
      let next=L.makeState(name.trim(),cl);
      try{const previous=localStorage.getItem(key);if(previous){const parsed=JSON.parse(previous);if(parsed.version===4&&parsed.lesson==='y7-w2-theory')next=parsed;}
        else {const slug=v=>v.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'student';const old=JSON.parse(localStorage.getItem(teacher?'y7-w2-theory-v3:teacher-review':`y7-w2-theory-v3:${slug(cl)}:${slug(name)}`)||'null');if(old&&old.name?.trim().toLowerCase()===name.trim().toLowerCase()){next.legacy={name:old.name,className:old.className,answers:old.answers,algorithmSteps:old.algorithmSteps};}}
      }catch{setSave('Browser saving is unavailable. Keep this page open until you export.');}
      next={...next,help:helpChosen.current?support:(next.help||support),device:deviceChosen.current?device:(next.device||device),teacher,events:[...next.events,{time:new Date().toISOString(),card:'mission',action:'Started or resumed lesson'}]};setState(next);setNotice('');Evidence.load(key).then(setPhotos).catch(()=>setNotice('Photo storage is unavailable. The core lesson does not need photos.'));
    }
    function focusMissing(id){
      const focus=()=>{const el=document.getElementById('field-'+id);if(el?.closest('details'))el.closest('details').open=true;el?.scrollIntoView({block:'start',behavior:'smooth'});(el?.querySelector('textarea,select,input')||el)?.focus({preventScroll:true});};
      if(/^step[3-8]$/.test(id)&&['write1','write2'].includes(L.cards[state.current].id)){setWritingStep(id);setTimeout(focus,0);}else focus();
    }
    function jump(i){if(!state.teacher&&i>state.unlocked)return;update(s=>({...s,current:i}),'Opened '+L.cards[i].title);setErrors([]);setNotice('');}
    function next(){const card=L.cards[state.current], miss=L.missing(state,card.id);if(miss.length&&!state.teacher){setErrors(miss);setNotice('A little more to do on this card. Choose an item below to go straight to it.');setTimeout(()=>focusMissing(miss[0]),20);return;}
      let target=Math.min(state.current+1,L.cards.length-1);if(L.cards[target].id==='extension')target++;
      update(s=>{let n=s;if(card.id==='test'&&s.answers.testResult==='Needs a clearer instruction'){const key='step'+s.answers.testStep,after=s.answers.testRewrite;if(/^step[3-8]$/.test(key)&&after?.trim()&&s.answers[key]!==after)n={...s,answers:{...s.answers,[key]:after},revisions:[...s.revisions,{step:key,before:s.answers[key],after,reason:s.answers.testReason,time:new Date().toISOString()}]};}return {...n,current:target,unlocked:Math.max(s.unlocked,target),completed:[...new Set([...s.completed,card.id])]};},'Completed '+card.title);if(card.id==='test')setPdf(null);setErrors([]);setNotice('');
    }
    function quizChange(id,value){update(s=>({...s,quizzes:{...s.quizzes,[id]:L.select(s,id,value)}}));setPdf(null);}
    function quizCheck(id){if(!Number.isInteger(state.quizzes[id]?.choice)){setErrors([...errors,'q:'+id]);focusMissing('q:'+id);return;}update(s=>({...s,quizzes:{...s.quizzes,[id]:L.check(s,id,s.quizzes[id].choice)}}),'Checked '+L.questions[id].title);setPdf(null);}
    function quizSupport(id){update(s=>({...s,quizzes:{...s.quizzes,[id]:{...s.quizzes[id],accepted:true,supported:true}}}),'Used explanation: '+L.questions[id].title);setPdf(null);}
    function speech(text){if(!('speechSynthesis'in window)){setNotice('Read-aloud is not supported here. Use your device’s spoken-content option or ask a partner to read with you.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.88;speechSynthesis.speak(u);}
    async function addPhoto(file){if(!file)return;if(photos.length>=2){setNotice('You already have two photos. Remove one before adding another.');return;}if(file.size>15000000){setNotice('This photo is too large. Choose a smaller image (under 15 MB).');return;}setNotice('Opening your photo…');try{const data=await Evidence.compress(file), item={id:Date.now()+'-'+Math.random().toString(36).slice(2),data,name:file.name};const all=[...photos,item];await Evidence.save(keyRef.current,all);setPhotos(all);setPdf(null);update(s=>({...s,evidenceIds:all.map(p=>p.id)}),'Added paper evidence');setNotice('Photo saved. It will be included in your PDF.');}catch{setNotice('This image could not be saved. Try a JPG or PNG. Keep your paper and show your teacher; you can still export the core lesson.');}}
    async function removePhoto(id){try{const all=photos.filter(p=>p.id!==id);await Evidence.save(keyRef.current,all);setPhotos(all);setPdf(null);update(s=>({...s,evidenceIds:all.map(p=>p.id)}),'Removed paper evidence');}catch{setNotice('Could not remove the photo. Please try again.');}}
    function backup(){const blob=new Blob([JSON.stringify({state,photos})],{type:'application/json'});Report.download(blob,L.filename(state,'json'));setNotice('Backup download requested. Keep it private: it contains your name and answers.');}
    async function restore(file){if(!file)return;try{if(file.size>20000000)throw Error();const data=JSON.parse(await file.text()), s=data.state;if(s?.version!==4||s?.lesson!=='y7-w2-theory'||typeof s.name!=='string'||typeof s.className!=='string'||!s.answers||!s.quizzes||!Array.isArray(s.events)||!Array.isArray(s.completed)||!Array.isArray(s.revisions)||!Array.isArray(s.extensionVisits)||!Number.isInteger(s.current)||s.current<0||s.current>=L.cards.length||!Number.isInteger(s.unlocked)||s.unlocked<0||s.unlocked>=L.cards.length)throw Error();if(!confirm('Open this backup for '+s.name+'? This replaces only that student’s current Week 2 lesson on this browser.'))return;const ps=(data.photos||[]).filter(p=>typeof p.data==='string'&&/^data:image\/(jpeg|png);base64,/.test(p.data)).slice(0,2);keyRef.current=L.storageKey(s.name,s.className);s.teacher=s.name.trim().toLowerCase()==='teacher';await Evidence.save(keyRef.current,ps);setPhotos(ps);setState(s);setNotice('Backup opened.');}catch{setNotice('That backup could not be opened. Choose a Week 2 Theory .json backup. Existing saved work has not been deleted.');}}
    async function makePDF(){setBusy(true);setNotice('Preparing your report. Keep this page open…');try{const file=await Report.make(state,photos);setPdf(file);setNotice('Your PDF is ready. Choose Download or Save / share below.');}catch(e){setNotice('PDF preparation did not finish. Your answers are still here. Try again, or use the print-friendly report.');}finally{setBusy(false);}}
    async function sharePDF(){if(!pdf)return;try{if(navigator.canShare?.({files:[pdf]})){await navigator.share({files:[pdf],title:'Week 2 Theory'});setNotice('Sharing window closed. Check Files to confirm you saved the PDF, then attach it to your Teams assignment.');}else{Report.download(pdf,pdf.name);setNotice('Download requested. If the PDF opens, tap Share → Save to Files. You can also use “Open PDF” below.');}}catch(e){setNotice(e.name==='AbortError'?'Save / share cancelled. Your PDF and answers are still here. Tap again when ready.':'Sharing is unavailable. Try Download, or Open PDF and use Share → Save to Files.');}}
    if(!state)return h('main',{className:'landing'},h('section',{className:'entry'},
      h('p',{className:'eyebrow'},'YEAR 7 · WEEK 2 · THEORY · 60 MINUTES'),h('h1',null,'Plan a school journey'),
      h('p',{className:'lead'},'Help a new student collect a timetable, return a book and find CS Room C1. Use a map, sentence starters and examples to make a directions guide.'),
      h('form',{onSubmit:start},h('label',{htmlFor:'student-name'},'Your full name'),h('input',{id:'student-name',autoComplete:'name',value:name,onChange:e=>setName(e.target.value)}),
        name.trim().toLowerCase()!=='teacher'&&h(React.Fragment,null,h('label',{htmlFor:'student-class'},'Your class'),h('input',{id:'student-class',value:className,onChange:e=>setClass(e.target.value),placeholder:'For example, 7T'})),
        h(SupportChoices,{id:'welcome',help:support,device,onHelp:value=>{helpChosen.current=true;setSupport(value);},onDevice:value=>{deviceChosen.current=true;setDevice(value);}}),
        notice&&h('p',{role:'alert',className:'error'},notice),h('button',{className:'primary',type:'submit'},'Start or resume lesson')),
      h('p',{className:'hint'},'Short answers are enough. Sentence starters are available to everyone. We are checking computing ideas, not perfect English.'),
      h('p',{className:'hint'},'Your work stays on this browser and device. Use the same name, class and browser to resume. No account is created.'),
      h('p',{className:'notice'},'At the end: save one PDF and turn it in to Teams → Week 2 Theory.'),
      h('label',{className:'file-label'},'Open a lesson backup',h('input',{type:'file',accept:'.json',onChange:e=>restore(e.target.files[0])}))));
    const card=L.cards[state.current], miss=L.missing(state,card.id), isError=id=>errors.includes(id)&&miss.includes(id);
    const field=(id,label,hint,options,rows)=>h(Field,{key:id,id,label:label||L.labels[id],hint,options,rows,value:state.answers[id],onChange:answer,onStarter:addStarter,error:isError(id)});
    const radio=(id,label,options)=>h(RadioField,{id,label,options,value:state.answers[id],onChange:answer,error:isError(id)});
    const quiz=id=>h(Quiz,{key:id,id,result:state.quizzes[id],change:quizChange,check:quizCheck,support:quizSupport,error:isError('q:'+id)});
    const quizGroup=ids=>h(QuizGroup,{key:card.id,ids,render:quiz});
    const route=L.route(state), core=L.cards.filter(c=>!['extension','submit'].includes(c.id)), done=core.filter(c=>state.completed.includes(c.id)).length;
    let content;
    switch(card.id){
      case 'mission':content=h(React.Fragment,null,
        h(Reading,{title:'Read the story: a new student needs your help'},
          h('p',null,'It is a new student’s first morning. They are standing at the Main Entrance, facing Reception. Before their computing lesson, they must collect a timetable at Reception, return a book at the Library, and then reach CS Room C1. They do not know the school yet.'),
          h('p',null,'The map is a practice school, not our real school. Its lines show corridors. All rooms are on one floor. The student must stay on the corridors and must not enter the staff-only route.')),
        h('section',{className:'outcome-panel'},h('h2',null,'What will I make?'),h('p',null,'A directions guide for this student: short instructions in order, with the same steps shown as a flowchart. You are not drawing a map or building a Python app today.'),
          h('ol',null,h('li',null,'Split the journey into three smaller jobs.'),h('li',null,'Use two example steps, then add six short instructions.'),h('li',null,'Test the directions with a partner. Save your guide and answers in one PDF.'))),
        h('p',{className:'hint'},'Blue panels explain an idea. Yellow panels ask you to do something. You can use sentence starters, word help or a short answer in a language you know. No screenshots are needed.'));break;
      case 'starter':content=h(React.Fragment,null,
        h(Reading,{title:'Read: why does the order matter?'},
          h('p',null,'Imagine giving directions to the new student on this map. “Walk, then turn” may take them to a different place from “Turn, then walk”. That is why the order of the steps matters. Last week, you practised following instructions in order.'),
          h('p',null,'An algorithm is a clear plan. A program writes that plan in a language a computer can run. Today you will plan directions first; you will not type Python.')),
        h('p',{className:'task-intro'},'Your turn: choose an answer, then tap Check my thinking. Try the two reminders below.'),quizGroup(['order','code']));break;
      case 'strategy':content=h(React.Fragment,null,h('p',{className:'read'},'Think about the starter. Knowledge is what you remember; skills are what you practise; understanding is what you can explain and use. Today can involve all three.'),radio('strategyType','What will you focus on next?',[['Knowledge','Remember the meanings of the computing words.'],['Skills','Practise putting instructions in a useful order.'],['Understanding','Explain why changing the order changes the result.']]),field('strategyAction','Choose one action to help you learn.',null,['Use the word help to check a meaning.','Point to each place on the map before writing.','Explain my idea to a partner, then write it.']));break;
      case 'split':content=h(React.Fragment,null,
        h(Reading,{title:'Read: one journey, three smaller jobs'},
          h('p',null,'“Get ready for the computing lesson” is a big job for someone who is new. Split it into three parts: get the timetable, return the book, and reach the lesson. In computing, splitting a problem into smaller jobs is called decomposition.'),
          h('p',null,'For example, the first part starts at the Main Entrance and finishes where the timetable is collected. Each part has a start and a finish, so you can check one part at a time.')),
        h('p',{className:'task-intro'},'Your turn: follow the map. Choose where each smaller journey finishes. You do not need to write full sentences.'),
        field('leg1',null,'Job: collect a timetable.',['Reception','Library','CS Room C1']),field('leg2',null,'Job: return a book.',['Reception','Library','CS Room C1']),field('leg3',null,'Job: arrive at the lesson.',['Reception','Library','CS Room C1']),
        h(Button,{className:'secondary',onClick:()=>setNotice('Check the three jobs: timetable at Reception; book at the Library; lesson at C1. Each journey should finish where its job can be done.')},'Check my journey sections'));break;
      case 'abstract':content=h(React.Fragment,null,
        h(Reading,{title:'Read: which details help us find the way?'},
          h('p',null,'A real school has posters, decorations, doors and many other details. Our guide does not need to describe everything. It needs the places to visit, the corridors and the rule about staff-only areas. Keeping the useful information and leaving out distractions is called abstraction.'),
          h('p',null,'Use the two map-view buttons to compare the same school. Notice that the route stays in the same place when the decoration is removed.')),
        h('p',{className:'task-intro'},'Your turn: answer two checks. Then give one short reason. Use the sentence starter if it helps.'),
        quizGroup(['keep','remove']),field('abstractionReason','Explain one of your choices.'));break;
      case 'ipo':content=h(React.Fragment,null,
        h(Reading,{title:'Read: imagine a directions program'},
          h('p',null,'Imagine the school later turns your guide into a directions program. The new student gives it a starting place and the stops they need. The program uses a map to arrange an allowed route. It shows instructions for the student to follow.'),
          h('p',null,'You are only planning this idea today, not building the program. These three parts help us describe what a program would do.')),
        h('div',{className:'ipo-strip','aria-label':'Input, process and output example'},
          h('div',null,h('b',null,'INPUT'),h('p',null,'Receive the start and stops.')),
          h('span',{'aria-hidden':true},'→'),h('div',null,h('b',null,'PROCESS'),h('p',null,'Use the map to order an allowed route.')),
          h('span',{'aria-hidden':true},'→'),h('div',null,h('b',null,'OUTPUT'),h('p',null,'Show the route instructions.'))),
        h('p',{className:'task-intro'},'Your turn: decide which part each example describes. You only need to choose and check.'),quizGroup(['input','process','output']));break;
      case 'model':content=h(React.Fragment,null,
        h(Reading,{title:'Read: how can I write my plan?'},
          h('p',null,'Pseudocode is a written plan for a program. Use short, clear instructions, one action at a time. It is not Python and does not run by itself. Start with an action word such as WALK or COLLECT. Name a place so the reader knows where to stop.'),
          h('p',null,'You can also show a plan as a flowchart. The shapes below will help you recognise it before you write your own steps.')),
        h('section',{className:'example'},h('h2',null,'Worked example: only the first small journey'),
          h('p',null,'Start at the Main Entrance. Finish this part at Reception.'),
          h('ol',null,L.model.map(s=>h('li',{key:s},s))),
          h('p',{className:'hint'},'WALK is the action. Reception is the stopping place. COLLECT is the next job. These two supplied steps begin your guide; you will write what happens next.')),
        h(Symbols,null),h('p',{className:'task-intro'},'Your turn: choose the instruction that gives a clear stopping place.'),quiz('precise'));break;
      case 'write1':content=h(React.Fragment,null,
        h(Reading,{title:'Read: the timetable is collected. What comes next?'},
          h('p',null,'The student is at Reception, facing up the map. They have collected their timetable. Their next job is to return a book at the Library. Your guide must tell them how to leave Reception, where to walk, and what to do at the Library.')),
        h('p',{className:'task-intro'},'Your turn: add three short instructions. Use the map and word banks. Tap “Put the starter in my answer” if you need help, then replace each ___ gap.'),
        h(WritingSteps,{ids:['step3','step4','step5'],active:writingStep,onActive:setWritingStep,renderField:field,answers:state.answers}));break;
      case 'write2':content=h(React.Fragment,null,
        h(Reading,{title:'Read: the book is returned. Finish the journey.'},
          h('p',null,'The student is now at the Library and still faces right along the Main Corridor. Their next job is to reach CS Room C1. First they must reach the junction, which is the corner where two corridors meet. Then they must turn into the Science Corridor and stop outside C1.')),
        h('p',{className:'task-intro'},'Your turn: write one instruction for each part. The map stays here while you work. You can use short sentences; perfect spelling is not needed.'),
        h(WritingSteps,{ids:['step6','step7','step8'],active:writingStep,onActive:setWritingStep,renderField:field,answers:state.answers}));break;
      case 'flow':content=h(React.Fragment,null,
        h(Reading,{title:'Read: the same plan, shown with shapes'},
          h('p',null,'Your written guide and your flowchart tell the same story. An oval marks the start or end. A rectangle holds one action. Arrows show the order. The app puts your own instructions into these shapes; you do not need to draw or screenshot them.')),
        h(Symbols,null),h('p',{className:'task-intro'},'Your turn: check two symbols, then choose the job to do at the Library. Below is your flowchart. Follow its arrows.'),
        quizGroup(['oval','box']),field('flowAction','At the Library, which job comes before continuing to the junction?',null,['Return the book.','Collect the timetable.','Walk into the staff-only corridor.']),
        h('section',{className:'example'},h('h2',null,'Your instructions → your flowchart'),h(Flow,{steps:route})));break;
      case 'test':content=h(React.Fragment,null,
        h(Reading,{title:'Read: be a route tester'},
          h('p',null,'Ask a partner to pretend they are the new student. Read one instruction aloud while your partner points to the place on the map. Ask: “Where are you now? Which way are you facing?” Then follow the next instruction. Stay in your seats.'),
          h('p',null,'If your partner must guess, choose that step and make it clearer. If the instructions work, choose one step and explain what made it clear. If no partner is available, point to the map and test the steps yourself.')),
        h('section',{className:'example'},h('h2',null,'Your guide: read one step at a time'),h('ol',{className:'route-list'},route.map((s,i)=>h('li',{key:i,className:String(i+1)===state.answers.testStep?'selected':''},s)))),
        h('p',{className:'task-intro'},'Your turn: record ONE step you checked. You do not need to explain every step.'),
        field('testStep','Choose one of your own steps to check.',null,['3','4','5','6','7','8']),
        radio('testResult','What happened when you checked it?',[['Needs a clearer instruction','My tester had to guess.'],['Works as written','My tester knew what to do and where to stop.']]),
        state.answers.testResult==='Needs a clearer instruction'&&field('testRewrite'),field('testReason'),
        h('p',{className:'hint'},'When you continue, a completed improved instruction replaces that step in your guide. The original and improved versions are both kept.'));break;
      case 'extension':content=h(React.Fragment,null,h('p',{className:'read'},'Choose a challenge if you have spare time. You can leave this card without doing either. Each visit and any response will be saved.'),h('div',{className:'button-row'},h(Button,{onClick:()=>{setExt('route');update(s=>({...s,extensionVisits:[...s.extensionVisits,{type:'route',time:new Date().toISOString()}]}),'Started alternative-route challenge');}},'A. A corridor closes'),h(Button,{onClick:()=>{setExt('compare');update(s=>({...s,extensionVisits:[...s.extensionVisits,{type:'compare',time:new Date().toISOString()}]}),'Started instruction-comparison challenge');}},'B. Compare instructions')),ext==='route'&&h(React.Fragment,null,h('p',null,'The Main Corridor closes after the Library. After collecting the timetable, the student now needs to go straight to C1; the book will be returned later. Use the green alternative path. Write directions via the Covered Courtyard, East Door and East Corner. Do not use the staff-only route.'),h(MapView,{alternative:true}),field('extensionRoute',null,'Start at Reception. Use the permitted path and finish at C1.',null,5)),ext==='compare'&&h(React.Fragment,null,h('p',null,'Compare A: “Walk until you see a nice poster.” and B: “Walk along the Main Corridor until you reach the Library.” Which would work tomorrow if the decorations changed? Explain, then improve A.'),field('extensionCompare',null,'Choose A or B, explain why, then write your improved instruction.',null,4)),h(Button,{className:'secondary',onClick:()=>jump(12)},'Return to reflection'));break;
      case 'reflect':content=h(React.Fragment,null,h('p',{className:'read'},'Think about writing and testing your route. These describe how this task feels now—not your ability forever. Choose honestly, then choose one useful next action.'),radio('phase','Where are you in your learning?',[['New learning','This is new and challenging, but I can take the next step.'],['Consolidating','I am practising ideas I already know and getting better.'],['Treading water','This feels easy; I am ready for a harder route.'],['Drowning','I feel stuck and need someone to show me a smaller step.']]),field('nextAction','What will you do next?',null,['Read one model step and try a similar step.','Ask my teacher or partner to explain a step.','Trace my route again to check it carefully.','Try the alternative route or comparison challenge.']),h(Button,{className:'secondary',onClick:()=>jump(11)},'Try an optional challenge'));break;
      case 'plenary':content=h(React.Fragment,null,
        h(Reading,{title:'Read: show what helped your new student'},
          h('p',null,'Today you split one journey into smaller jobs, kept useful map details and tested clear instructions. Now choose one example from your own guide to explain how it helps the new student. You do not need a long paragraph or a copied definition.')),
        h('p',{className:'task-intro'},'Your turn: answer the check, then finish one short explanation. You can use the sentence starter.'),
        quiz('transfer'),field('finalReason','Why are your instructions easier to follow than “Go to C1”?'));break;
      case 'review':content=h(React.Fragment,null,h('p',{className:'read'},'Your answers, instructions, flowchart and reflection are included automatically. Look through your report. If you want to change something, choose the matching lesson stage above.'),h('p',{className:'notice'},'No screenshot needed. One PDF is your submission for this theory lesson.'),h(Button,{className:'primary',onClick:()=>{Report.preview(state,photos);update(s=>s,'Reviewed report');}},'Review my report'),state.legacy&&h('p',{className:'hint'},'Work from the older version was found. It is preserved in browser storage and included separately in your report.'),h('details',null,h('summary',null,'I also have paper work (optional)'),h('p',null,'Only add a photo if you completed work on paper. Frame your work, not other students, messages or personal information.'),h(Button,{className:'secondary',onClick:()=>setPhotoHelp(!photoHelp)},'How do I add a photo?'),photoHelp&&h('ol',null,h('li',null,'Take a photo of your paper using your device’s camera.'),h('li',null,'Tap “Choose a photo” below. Select Photo Library, Photos or Files, depending on your device.'),h('li',null,'Choose the image. Wait until its preview appears here.'),h('li',null,'Check the text is readable. It will be added to the PDF.')),h('label',{className:'file-label'},'Choose a photo (JPG / PNG; up to two)',h('input',{type:'file',accept:'image/*',onChange:e=>{addPhoto(e.target.files[0]);e.target.value='';}})),h('div',{className:'photos'},photos.map(p=>h('figure',{key:p.id},h('img',{src:p.data,alt:'Your paper evidence'}),h(Button,{onClick:()=>removePhoto(p.id)},'Remove photo'))))));break;
      case 'submit':content=h(React.Fragment,null,h('p',{className:'read'},'First prepare your PDF. Then save it on your device and attach it to the Teams assignment. Your lesson stays open here.'),field('deviceChoice','Show saving instructions for…',null,['iPad / iPhone','Android tablet','Mac / Windows / Chromebook']),h(Button,{className:'primary',onClick:makePDF,disabled:busy},busy?'Preparing PDF…':'1. Prepare my PDF'),pdf&&h('div',{className:'download-panel'},h('p',null,'Ready: '+pdf.name),h('div',{className:'button-row'},h(Button,{className:'primary',onClick:()=>{Report.download(pdf,pdf.name);setNotice('Download requested. If a PDF opens instead, use Share → Save to Files. Check that you can find it before opening Teams.');}},'Download PDF'),h(Button,{className:'secondary',onClick:sharePDF},'Save / share PDF'),h(Button,{className:'secondary',onClick:()=>{if(pdfUrl.current)URL.revokeObjectURL(pdfUrl.current);pdfUrl.current=URL.createObjectURL(pdf);const a=document.createElement('a');a.href=pdfUrl.current;a.target='_blank';a.rel='noopener';a.click();setNotice('PDF opened in a separate tab. If blocked, use Download or Save / share.');}},'Open PDF (new tab)'))),h('section',{className:'instructions'},h('h2',null,'2. Save it where you can find it'),(state.answers.deviceChoice==='iPad / iPhone'||state.device==='ipad'||(!state.answers.deviceChoice&&state.device==='auto'))?h('ol',null,h('li',null,'Tap Save / share PDF. Choose Save to Files (you may need More).'),h('li',null,'Choose a folder you can recognise, such as Downloads, then tap Save.'),h('li',null,'If the PDF opens in Safari, tap its Share button and choose Save to Files. Viewing it alone does not save it.')):h('ol',null,h('li',null,'Tap Download PDF. Use the browser’s download notification or Files / Downloads to find it.'),h('li',null,'If it opens instead of downloading, use Save / share PDF or the PDF viewer’s download option.')),h('p',{className:'hint'},'If this is open inside Google search or another app and saving is unavailable, make a backup below before changing browsers. Progress does not move between browsers automatically.')),h('section',{className:'instructions'},h('h2',null,'3. Turn it in through Teams'),h('ol',null,h('li',null,'Open your class in Teams → Assignments → Week 2 Theory.'),h('li',null,'Choose Add work or Attach, then select the PDF from Files / your device.'),h('li',null,'Wait for the file to appear on the assignment. Tap Turn in.'),h('li',null,'Check Teams shows it as turned in. Attaching alone is not the final step.'))),h('label',{className:'option'},h('input',{type:'checkbox',checked:!!state.submission.saved,onChange:e=>update(s=>({...s,submission:{...s.submission,saved:e.target.checked}}))}),'I found my saved PDF and checked my name, class and work.'),h('label',{className:'option'},h('input',{type:'checkbox',checked:!!state.submission.turnedIn,onChange:e=>update(s=>({...s,submission:{...s.submission,turnedIn:e.target.checked}}))}),'I attached my PDF in Week 2 Theory and tapped Turn in.'),h('p',{className:'hint'},'These are your confirmations; the website cannot check Teams. You do not need to export again after ticking them.'),h('details',null,h('summary',null,'Saving did not work?'),h('p',null,'Keep this page open. You can retry PDF preparation without repeating the lesson.'),h(Button,{className:'secondary',onClick:()=>Report.print(state,photos)},'Open print-friendly report'),h(Button,{className:'secondary',onClick:backup},'Download a private lesson backup'),h('p',null,'On a computer, the print window usually offers Save as PDF. On an iPad, use the print preview’s sharing option to save to Files. If unavailable, show your teacher your saved answers before closing this page.')));break;
    }
    const stageIndices=L.stages.map((_,i)=>L.cards.findIndex(c=>c.stage===i));
    const routeCards=['mission','starter','split','abstract','ipo','model','write1','write2','flow','test','plenary'];
    const locations={
      mission:['entrance','Start at the Main Entrance. Face Reception ↑.'],
      starter:['entrance','Start at the Main Entrance. Face Reception ↑.'],
      model:['entrance','Worked example: Main Entrance → Reception.'],
      write1:['reception','You are at Reception, facing up ↑. Next job: return a book at the Library.'],
      write2:['library','You are at the Library, facing right →. Next: junction → CS Room C1.']
    };
    const instructionIds=card.id==='write1'?['step3','step4','step5']:card.id==='write2'?['step6','step7','step8']:[];
    const activeInstruction=instructionIds.includes(writingStep)?writingStep:instructionIds[0];
    const stepLocations={step3:['reception','Step 3 starts at Reception. Face up ↑, then choose your turn.'],step4:['reception','Step 4 starts after the turn at Reception. Follow the Main Corridor towards the Library →.'],step5:['library','Step 5: you have reached the Library. What must you do with the book?'],step6:['library','Step 6 starts at the Library, facing right →. Find the junction.'],step7:['junction','Step 7 starts at the junction, facing right →. Choose the turn towards C1.'],step8:['junction','Step 8 starts after your turn. Follow the Science Corridor up ↑ to C1.']};
    const location=stepLocations[activeInstruction]||locations[card.id]||['','Main Entrance → Reception → Library → CS Room C1.'];
    const mapBoard=routeCards.includes(card.id)&&h('aside',{className:'route-board','aria-label':'Map for this task'},
      h('h2',null,'Your map — use it as you answer'),h('p',{className:'route-location'},location[1]),
      card.id==='abstract'&&h('div',{className:'map-choices','aria-label':'Compare map detail'},
        h(Button,{'aria-pressed':detail,onClick:()=>{setDetail(true);update(s=>s,'Viewed detailed map');}},'With decoration'),
        h(Button,{'aria-pressed':!detail,onClick:()=>{setDetail(false);update(s=>s,'Viewed simplified map');}},'Only useful details')),
      h(MapView,{detail:card.id==='abstract'&&detail,focus:location[0]}),
      location[0]&&h('p',{className:'hint'},'The ring marks the starting place for this part.'),
      h('p',{className:'hint'},'Reception: get timetable · Library: return book · C1: computing lesson.'),
      h(Button,{className:'secondary',onClick:()=>setShowMap(true)},'Enlarge map (optional)'));
    const termsByCard={starter:['algorithm','program'],split:['decomposition'],abstract:['abstraction'],ipo:['input','process','output'],model:['pseudocode','flowchart'],write1:['sequence'],write2:['sequence'],flow:['flowchart'],test:['trace']};
    const cardWords=L.terms.filter(t=>(termsByCard[card.id]||[]).includes(t[0]));
    return h(React.Fragment,null,
      h('a',{href:'#card-title',className:'skip'},'Skip to the activity'),
      h('header',{className:'topbar'},h('div',null,h('b',null,'Year 7 · Week 2 Theory'),h('small',null,state.name+' · '+state.className)),
        h('div',{className:'header-actions'},h('span',{className:'saved','aria-live':'polite'},save),h(Button,{className:'secondary',onClick:()=>setOpenHelp(true)},'Words & help'))),
      h('div',{className:'lesson-layout'},
        h('aside',{className:'learning-panel'},h('h2',null,'Today’s learning'),h('b',null,'WAGBA'),h('p',null,L.goals.wagba),
          h('dl',null,['knowledge','skills','understanding'].map(k=>h('div',{key:k},h('dt',null,k[0].toUpperCase()+k.slice(1)),h('dd',null,L.goals[k]))))),
        h('main',{className:'workspace'},
          h('details',{className:'mobile-goals'},h('summary',null,'WAGBA · Knowledge · Skills · Understanding'),h('p',null,L.goals.wagba),['knowledge','skills','understanding'].map(k=>h('p',{key:k},h('b',null,k+': '),L.goals[k]))),
          h(SupportChoices,{id:'lesson',help:state.help,device:state.device,
            onHelp:value=>update(s=>({...s,help:value}),'Changed vocabulary support'),
            onDevice:value=>update(s=>({...s,device:value,answers:{...s.answers,deviceChoice:({ipad:'iPad / iPhone',android:'Android tablet',computer:'Mac / Windows / Chromebook'})[value]||''}}),'Changed device guide')}),
          h('nav',{'aria-label':'Lesson stages',className:'stages'},L.stages.map((s,i)=>h(Button,{key:s,className:i===card.stage?'active':'',onClick:()=>{if(state.teacher||stageIndices[i]<=state.unlocked)jump(stageIndices[i]);else setNotice('Finish the current card first. Continue will show anything still missing.');},'aria-current':i===card.stage?'step':undefined},(i+1)+'. '+s))),
          h('div',{className:'progress-label'},h('span',null,L.stages[card.stage]+' · '+card.time),h('span',null,done+' / '+core.length+' cards completed')),
          h('progress',{max:core.length,value:done,'aria-label':'Completed lesson cards'}),
          h('article',{className:'lesson-card'},
            h('div',{className:'card-top'},h('h1',{id:'card-title',tabIndex:-1},card.title),
              h(Button,{className:'secondary',onClick:()=>speech(Array.from(document.querySelectorAll('.lesson-card .reading-panel')).map(el=>el.textContent).join(' ')||document.querySelector('.lesson-card').textContent)},'Read aloud')),
            cardWords.length>0&&h('div',{className:'card-words'},h('b',null,'Words on this card'),cardWords.map(([word,meaning,zh,ms])=>h('p',{key:word},h('strong',null,word,state.help==='zh'?' · '+zh:state.help==='ms'?' · '+ms:''),': '+meaning))),
            h('div',{className:mapBoard?'task-workspace':'task-workspace no-map'},mapBoard,h('div',{className:'task-copy'},content))),
          notice&&h('div',{role:'status',className:'notice'},notice),
          errors.length>0&&miss.length>0&&h('div',{role:'alert',className:'error-summary'},h('b',null,'Still to do:'),h('ul',null,miss.map(id=>h('li',{key:id},h(Button,{className:'text-button',onClick:()=>focusMissing(id)},L.answerLabel(id)))))),
          h('footer',{className:'card-actions'},h(Button,{className:'secondary',onClick:()=>jump(Math.max(0,state.current-1)),disabled:state.current===0},'Back'),h('span',null,'Answers save automatically'),card.id!=='submit'&&h(Button,{className:'primary',onClick:next},card.id==='mission'?'Begin starter':card.id==='review'?'Continue to saving':'Continue')),
          h('details',{className:'jump-list'},h('summary',null,'Return to a completed card'),L.cards.map((c,i)=>h(Button,{key:c.id,onClick:()=>jump(i),disabled:!state.teacher&&i>state.unlocked},c.title))))),
      h('dialog',{ref:helpRef,onCancel:()=>setOpenHelp(false)},h(Button,{className:'close',onClick:()=>setOpenHelp(false),'aria-label':'Close word help'},'Close'),h('h2',null,'Words & help'),h('label',{htmlFor:'help-language'},'Vocabulary language'),h('select',{id:'help-language',value:state.help,onChange:e=>update(s=>({...s,help:e.target.value}),'Changed language support')},h('option',{value:'plain'},'Plain English'),h('option',{value:'zh'},'English + 中文'),h('option',{value:'ms'},'English + Bahasa Melayu')),h('p',{className:'hint'},'Key-word translations support the English meaning; they do not translate every task. For another language, select text and use your device’s translation option if available. Do not send personal answers to a translation website.'),h('dl',{className:'glossary'},L.terms.map(([word,meaning,zh,ms])=>h('div',{key:word},h('dt',null,word,state.help==='zh'?' · '+zh:state.help==='ms'?' · '+ms:''),h('dd',null,meaning)))),h(Button,{className:'secondary',onClick:()=>speech(L.terms.map(t=>t[0]+'. '+t[1]).join('. '))},'Read English word meanings'),h(Button,{className:'secondary',onClick:()=>window.speechSynthesis?.cancel()},'Stop reading'),h('h3',null,'Protect your work'),h('p',null,'Use the same browser, name and class to resume. On a shared device, do not open someone else’s profile. A name is not a password.'),h(Button,{className:'secondary',onClick:backup},'Download lesson backup'),h('label',{className:'file-label'},'Open a lesson backup',h('input',{type:'file',accept:'.json',onChange:e=>restore(e.target.files[0])})),h(Button,{className:'danger',onClick:()=>{if(confirm('Delete only this student’s redesigned Week 2 answers and photos on this browser? Export first if you need a copy.')){try{localStorage.removeItem(keyRef.current);}catch{}Evidence.save(keyRef.current,[]).catch(()=>{});setOpenHelp(false);setState(null);setPhotos([]);setPdf(null);setNotice('This profile’s redesigned lesson progress was cleared. Work in the older version is unchanged.');}}},'Reset this lesson (confirmation required)')),
      h('dialog',{ref:mapRef,onCancel:()=>setShowMap(false),className:'map-dialog'},h(Button,{className:'close',onClick:()=>setShowMap(false)},'Close map'),h('h2',null,'Your practice school map'),h(MapView,null),h('p',null,'Main Entrance → Reception (timetable) → Library (book) → junction → CS Room C1. The staff-only branch is not permitted.'))
    );
  }
  try{ReactDOM.createRoot(document.getElementById('root')).render(h(LessonBoundary,null,h(App)));}catch(e){document.getElementById('root').textContent='The lesson could not open. Reload this page or ask your teacher for help. Your saved work has not been deleted.';console.error(e);}
})();
