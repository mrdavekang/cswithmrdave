window.FitnessLive=(()=>{
 'use strict';
 const cfg=FITNESS_LIVE_CONFIG;window.FITNESS_FIELD_LABELS||={starterRead:'Do Now · reading a line',starterAppend:'Do Now · appending text',learningFocus:'KSU · chosen focus',learningPlan:'KSU · improvement plan',read1Check:'Records and formatting · explanation',read2Check:'File to list · explanation',phase:'Learning Pit Stop · self-reported phase',phaseEvidence:'Learning Pit Stop · evidence',phaseAction:'Learning Pit Stop · next action',exitExplain:'Plenary · data journey',exitEvidence:'Plenary · improvement evidence',exitNext:'Plenary · next target'};
 const rounds={
  1:{title:'One record, one displayed value',titleZh:'一个记录，一个显示值',
   prompt:'A fitness record stores Distance as 6.247 km. Complete the final line so it reads the stored attribute and prints it to exactly two decimal places. Keep the class, object and stored value unchanged. Add a comment explaining whether formatting changes the stored attribute.',
   zh:'健身记录把 Distance 存为 6.247 公里。完成最后一行，读取对象属性并显示两位小数。不要改变类、对象或存储值。用注释解释格式化是否改变存储值。',
   steps:['Keep the supplied class and object. Complete the final print statement using .format().','Run and compare with the expected output. Explain the stored value in a # comment.','Send your first response; return to your EAD while others finish.'],
   stepsZh:['保留类与对象，用 .format() 完成最后的 print。','运行并比较输出，在 # 注释中解释存储值。','发送初次回答，继续自己的 EAD。'],
   starter:'class Activity:\n    def __init__(self, distance):\n        self.Distance = distance\n\nrun = Activity(6.247)\n# Complete the print statement below.\nprint()\n# Does formatting change run.Distance? Explain.',
   model:'class Activity:\n    def __init__(self, distance):\n        self.Distance = distance\n\nrun = Activity(6.247)\nprint("{:.2f}".format(run.Distance))\n# Formatting changes the displayed text, not run.Distance.\n# run.Distance still stores 6.247.',
   output:'6.25\n',target:'Print 6.25 on one line. Read run.Distance; do not replace the stored value with 6.25. Your comment must distinguish display from storage.',
   targetZh:'一行显示 6.25。读取 run.Distance，不要把存储值改为 6.25。注释应区别显示与存储。',
   explanation:'The attribute belongs to this object. {:.2f} formats its numeric value as text with two digits after the decimal point; it does not assign a new value to the attribute.',explanationZh:'属性属于此对象。{:.2f} 把数值格式化为两位小数的文字，并未给属性赋新值。'},
  2:{title:'Which records belong in the list?',titleZh:'哪些记录应进入列表？',
   prompt:'This small practice file contains two lines: person ID, then distance. The current person is 1001. Complete the loop so it splits each line at the comma, converts its distance to a real number, and appends that distance only for person 1001. Print the completed ActivityLog once, after the loop. This is a small practice model, not the full skeleton record format.',
   zh:'这个小练习用两行数据，每行为人员编号与距离。当前人员为 1001。循环内用逗号分割，距离转为实数，只有编号为 1001 时才加入列表。循环后只打印一次完整列表。这不是完整骨架程序的记录格式。',
   steps:['Use the two supplied text records as your practice file data. No file download is needed for this checkpoint.','Inside the loop, split, convert and compare the ID as a string before appending.','Run, compare with the target and Send. Explain why the other record is excluded in a comment.'],
   stepsZh:['使用给定的两条文字记录；此问题不用下载文件。','循环内分割、转换，按字符串比较编号，再决定加入。','运行、比较并发送；用注释解释为何另一条不加入。'],
   starter:'DataLines = ["1001,6.247", "1002,4.0"]\nPersonID = "1001"\nActivityLog = []\nfor DataLine in DataLines:\n    # Split the text, convert the distance and check the ID.\n    pass\nprint(ActivityLog)\n# Explain why one record is excluded.',
   model:'DataLines = ["1001,6.247", "1002,4.0"]\nPersonID = "1001"\nActivityLog = []\nfor DataLine in DataLines:\n    Items = DataLine.split(",")\n    Distance = float(Items[1])\n    if Items[0] == PersonID:\n        ActivityLog.append(Distance)\nprint(ActivityLog)\n# The second record has ID 1002, not the current ID 1001.',
   output:'[6.247]\n',target:'Print [6.247] once. The list must contain the matching numeric distance only, not both records and not the string "6.247".',targetZh:'只打印一次 [6.247]。列表只含匹配人员的数值距离，不能包含两条记录或字符串。',
   explanation:'split produces strings. float converts the distance, while the ID comparison remains a string comparison. The condition controls the append. In the full skeleton a complete activity object is appended instead.',explanationZh:'split 产生字符串；float 转换距离，编号仍按字符串比较。条件决定是否加入；完整骨架程序加入的是完整活动对象。'}
 };
 const cues=[
  [0,5,'Files & Do Now','Check files; compare read and append explanations.','Extract the files. Read the reminder and explain r and a without changing activity.txt.'],
  [5,7,'Types of Learning','Ask for a specific Knowledge, Skills or Understanding focus.','Choose your KSU focus and one action that will help you improve.'],
  [7,14,'Teach 1 · Records and formatting','Use slides. Optionally invite checkpoint 1 instead of the existing formatting discussion.','Read, study the object and formatting examples, and discuss display versus storage.'],
  [14,27,'Main Task 1 · Syntax EAD','Review predictions and syntax logs; use short precise feedback.','Complete Main Task 1 in Word, save and turn it in through Teams.'],
  [27,34,'Teach 2 · File to list','Use slides. Optionally invite checkpoint 2 instead of the existing filtering discussion.','Read and follow splitting, conversion, matching and appending.'],
  [34,52,'Main Task 2 · Program EAD','Sample a trace row and explanation. No need to inspect every keystroke.','Trace the unchanged program in the EAD or on paper. Save and submit the EAD.'],
  [52,56,'Learning Pit Stop','Compare self-reported phase with the pupil’s evidence.','Identify your current learning phase, evidence and next action. Extension if ready.'],
  [56,60,'Plenary & save','Check one complete explanation and Teams hand-in.','Explain one data journey. Save your PDF and full backup.']
 ];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const time=n=>{n=Math.max(0,Math.ceil(Number(n)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
 let teacher,anon;
 function db(){return teacher||=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{storageKey:'fitness-live-teacher',persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});}
 async function request(name,args={},privateAccess=false){const connection=privateAccess?db():(anon||=supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}}));const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const {data,error}=await connection.rpc(name,args).abortSignal(controller.signal);if(error){const e=Error(error.code==='PGRST202'?'Live setup is not active yet. Your independent work still saves.':error.message);e.code=error.code;throw e;}return data;}finally{clearTimeout(timeout);}}
 const rpc=(action,args)=>request('y11_fitness_live_'+action,args,action==='teacher');
 const effective=(room,now=Date.now())=>{if(!room)return null;const r={...room};if(!r.connected||r.ended)r.phase='work';else if(['response','retry'].includes(r.phase)&&r.pausedSeconds==null&&Date.parse(r.deadline)<=now)r.phase='discuss';return r;};
 const remaining=(r,now=Date.now())=>r?.pausedSeconds??Math.max(0,Math.ceil((Date.parse(r?.deadline)-now)/1000)||0);
 const writable=(r,now=Date.now())=>!!r?.connected&&(r.phase==='follow'||['response','retry'].includes(r.phase)&&r.pausedSeconds==null&&remaining(r,now)>0);
 function countdown(el,r,now=Date.now()){if(!el)return;el.hidden=!r?.connected||!['response','retry'].includes(r.phase);if(el.hidden)return;const left=remaining(r,now),urgent=!r.viewerSubmitted&&r.pausedSeconds==null&&left>0&&left<r.responseDuration/2;el.classList.toggle('urgent',urgent);const k=r.id+':'+r.round+':'+r.responseKind+':'+r.responseEpoch;if(urgent&&el.dataset.nudged!==k){el.dataset.nudged=k;el.classList.remove('nudge');void el.offsetWidth;el.classList.add('nudge');}el.querySelector('strong').textContent=time(left);el.querySelector('span').textContent=r.viewerSubmitted?'Response sent · keep working':r.pausedSeconds!=null?'Timer paused':urgent?'Respond now · less than half remains':'Live response time';el.querySelector('progress').max=r.responseDuration;el.querySelector('progress').value=left;}
 const clockHTML=()=>'<div class="gc-countdown" hidden><span>Live response time</span><strong>3:00</strong><progress aria-label="Response time remaining" max="180" value="180"></progress></div>';
 const cue=seconds=>cues.find(c=>seconds/60>=c[0]&&seconds/60<c[1])||cues.at(-1);
 const elapsed=(r,received,now=Date.now())=>(r?.clockSeconds||0)+(r?.clockRunning?Math.max(0,(now-received)/1000):0);
 function indent(el,e){if(e.key==='Tab'){e.preventDefault();el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');el.dispatchEvent(new Event('input',{bubbles:true}));}}
 function download(data,name){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,(k,v)=>/token|credential|password|boardKey|publishableKey/i.test(k)?undefined:v,2)],{type:'application/json'}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);}
 return {rounds,cues,esc,time,db,request,rpc,effective,remaining,writable,kind:r=>r?.responseKind||'initial',countdown,clockHTML,cue,elapsed,indent,download,stableStudents:s=>[...s].sort((a,b)=>a.joined_at.localeCompare(b.joined_at)||a.id.localeCompare(b.id))};
})();
