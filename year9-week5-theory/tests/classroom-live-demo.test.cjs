const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM}=require(process.env.JSDOM_PATH||'jsdom');
const root=path.resolve(__dirname,'..');
const lessonId='year9-week5-theory',classId='c429701c-21c3-4e99-b84d-c2faadca7afb';
async function boot(isTeacher=false){
 const dom=new JSDOM(fs.readFileSync(root+'/index.html','utf8'),{url:`https://school.example/year9-week5-theory/${isTeacher?'?teacher=1':''}`,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};w.confirm=()=>true;w.AbortSignal=AbortSignal;
 let timerId=0;const timers=new Map();w.setTimeout=(fn,delay=0)=>{const id=++timerId;timers.set(id,{fn,delay});return id;};w.clearTimeout=id=>timers.delete(id);w.setInterval=()=>++timerId;w.clearInterval=()=>{};w.requestAnimationFrame=fn=>w.setTimeout(fn,0);
 let server={version:1,lesson:lessonId,class_id:classId,session_id:'00000000-0000-4000-8000-000000000002',stage:'read',locked:false,mode:'self',revision:0,bring_revision:0,return_revision:0,demo:{open:false,demo_revision:0},expires_at:new Date(Date.now()+3600000).toISOString(),server_now:new Date().toISOString(),ended:false};
 const channels=[],sent=[],tracked=[];
 const client={auth:{getSession:async()=>({data:{session:isTeacher?{}:null}}),onAuthStateChange:()=>({}),signOut:async()=>{},signInWithPassword:async()=>({})},rpc:(name,args)=>({abortSignal:async()=>{
   if(name==='classroom_is_teacher')return{data:true};
   if(name==='classroom_class_current'||name==='classroom_class_snapshot')return{data:{...server}};
   if(name==='classroom_class_start')return{data:{...server}};
   if(name==='classroom_teach_control'){server={...server,revision:server.revision+1};if(args.p_stage){server.stage=args.p_stage;server.bring_revision++;}if(['attention','view','answer'].includes(args.p_action)){server.locked=true;server.mode=args.p_action;}if(['self','return','end'].includes(args.p_action)){server.locked=false;server.mode='self';server.demo={open:false,demo_revision:(server.demo.demo_revision||0)+1};}if(args.p_action==='return')server.return_revision++;return{data:{...server,ended:args.p_action==='end'}};}
   if(name==='classroom_demo_save'){server.demo={...args.p_demo,demo_revision:(server.demo.demo_revision||0)+1};return{data:{...server.demo}};}
   throw Error(name);
   }}),channel:name=>{const callbacks={};const channel={name,on(type,filter,callback){callbacks[filter.event]=callback;return this;},subscribe(callback){w.setTimeout(()=>callback('SUBSCRIBED'),0);return this;},send:async message=>{sent.push(message);return'ok';},track:async value=>{tracked.push(value);return'ok';},presenceState:()=>isTeacher?{'00000000-0000-4000-8000-000000000003':[{v:2,revision:server.revision,mode:server.mode}]}:{},emit(event,payload){assert(callbacks[event],`missing ${event} callback on ${name}`);callbacks[event]({payload});}};channels.push(channel);return channel;},removeChannel:async()=>{}};
 w.supabase={createClient:()=>client};
 w.eval(['content.js','week5-content.js','fact-slides.js','app.js','lesson.js','fact-integration.js','classroom-config.js','live-demo.js','classroom.js'].map(file=>fs.readFileSync(root+'/'+file,'utf8')).join('\n'));
 const flush=async()=>{for(let round=0;round<30;round++){await Promise.resolve();const jobs=[...timers.entries()].filter(([,job])=>job.delay<=2000);for(const[id]of jobs)timers.delete(id);for(const[,job]of jobs)await job.fn();await Promise.resolve();}};await flush();
 const control=()=>channels.find(channel=>channel.name.endsWith(':control'));
 return{w,d,sent,tracked,control,flush,server:()=>server,setServer:next=>{server={...server,...next}},close:()=>w.close()};
}
function enter(env,name='Student',className='9T'){const {w,d}=env;const set=(selector,value)=>{const element=d.querySelector(selector);assert(element,selector);element.value=value;element.dispatchEvent(new w.Event('input',{bubbles:true}));};set('[data-identity="name"]',name);set('[data-identity="className"]',className);d.querySelector('#entry-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));}
const keepAlive=setInterval(()=>{},1000);
(async()=>{
 const student=await boot(false);enter(student);student.w.LessonClassroom.navigate('program');const own=student.d.querySelector('[data-code="core"]');own.value='print("my own work")';own.dispatchEvent(new student.w.Event('input',{bubbles:true}));
 student.control().emit('state',{...student.server(),stage:'program',locked:true,mode:'view',revision:1,bring_revision:1});
 assert(student.d.querySelector('[data-code="core"]').disabled,`show-only must block editing; mode=${student.w.ClassroomMode.mode()} locked=${student.w.ClassroomMode.locked()}`);
 student.control().emit('demo',{open:true,program:'core',title:'Laptop loan adviser',code:'message = "Live"\nprint(message)',output:'Live\n',line:2,selectionStart:17,selectionEnd:17,running:false,seq:1});
 assert.equal(student.d.querySelector('#live-demo h1').textContent,'Laptop loan adviser');assert(student.d.querySelector('#live-demo .current').textContent.includes('print(message)'));assert(student.d.querySelector('#live-demo .live-output').textContent.includes('Live'));
 student.control().emit('demo',{open:false,seq:2});assert.equal(student.d.querySelector('#live-demo'),null);assert.equal(student.d.querySelector('[data-code="core"]').value,'print("my own work")');
 assert(student.tracked.every(value=>!('name'in value)&&!('className'in value)&&!('code'in value)),'presence must stay anonymous');student.close();

 const teacher=await boot(true);assert(teacher.d.querySelector('[data-cm="start"]')||teacher.d.querySelector('[data-cm="attention"]'));
 if(teacher.d.querySelector('[data-cm="start"]')){teacher.d.querySelector('[data-cm="start"]').click();await teacher.flush();}
 const picker=teacher.d.querySelector('#cm-demo-program');picker.value='core';teacher.d.querySelector('[data-cm="demo-start"]').click();await teacher.flush();
 const editor=teacher.d.querySelector('[data-code="core"]');assert(editor);editor.value='x = 2\nprint(x)';editor.selectionStart=editor.selectionEnd=6;editor.dispatchEvent(new teacher.w.Event('input',{bubbles:true}));editor.dispatchEvent(new teacher.w.Event('select',{bubbles:true}));await teacher.flush();
 const messages=teacher.sent.filter(message=>message.event==='demo');assert(messages.length);const latest=messages.at(-1).payload;assert.equal(latest.code,'x = 2\nprint(x)');assert.equal(latest.line,2);assert.equal(latest.open,true);
 teacher.d.querySelector('[data-cm="demo-stop"]').click();await teacher.flush();assert(teacher.sent.some(message=>message.event==='demo'&&message.payload.open===false));teacher.close();
 console.log('PASS live demonstration mirror, highlighted line, anonymous presence, read-only viewing, protected student code, teacher broadcast and stop.');clearInterval(keepAlive);
})().catch(error=>{process.stdout.write('FAIL '+(error?.stack||error)+'\n');clearInterval(keepAlive);process.exitCode=1;});
