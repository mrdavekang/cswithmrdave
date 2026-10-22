'use strict';
/* Local end-of-video checkpoints. Seeking is allowed; this is not attention tracking. */
((root)=>{
const VERSION='eco-video-2026-10-22-v1';
const CAPTION_PREFERENCE_VERSION=2;
const catalogue=[
 {id:'00_Introduction',card:'mission',required:false,devices:['laptop','ipad'],seconds:213.54,title:{en:'Our Eco-Budget mission',zh:'我们的 Eco-Budget 任务'},next:{en:'See the goal, tools and route into the lesson. You can begin without watching this introduction.',zh:'了解目标、工具和开始学习的步骤。不观看介绍也可以开始活动。'}},
 {id:'01_Find_a_Cell',card:'starter-find',required:true,devices:['laptop','ipad'],seconds:47.67,title:{en:'Guide 1 · Find a cell',zh:'指南 1 · 找到单元格'},next:{en:'Watch how to find B2. Then try the cell-finding activity.',zh:'先看怎样找到 B2，再尝试找单元格活动。'}},
 {id:'02_Open_Starter_Laptop',card:'open-excel',required:true,devices:['laptop'],seconds:61.50,title:{en:'Guide 2 · Open the starter on a laptop',zh:'指南 2 · 在电脑上打开起始文件'},next:{en:'Watch the Excel-for-web route. Then open your own workbook.',zh:'先看 Excel 网页版演示，再打开自己的工作簿。'}},
 {id:'04_Save_Your_Copy_Laptop',card:'own-copy',required:true,devices:['laptop'],seconds:64.00,title:{en:'Guide 4 · Give your workbook a home',zh:'指南 4 · 给工作簿一个固定的位置'},next:{en:'Watch the name-and-location check. Then prepare your school-storage copy.',zh:'先看如何检查名称和位置，再准备自己的学校存储副本。'}},
 {id:'06_Edit_B2_Laptop',card:'edit-cups',required:true,devices:['laptop'],seconds:59.75,title:{en:'Guide 6 · Edit and confirm B2',zh:'指南 6 · 编辑 B2 并确认'},next:{en:'Watch how to replace 30 with 28 and confirm the edit. Then try it in Excel.',zh:'先看怎样把 30 改为 28 并确认，再到 Excel 中尝试。'}},
 {id:'08_Save_and_Reopen_Laptop',card:'save-check',required:true,devices:['laptop'],seconds:76.29,title:{en:'Guide 8 · Save and reopen',zh:'指南 8 · 保存并重新打开'},next:{en:'Watch the save-and-reopen check. Then reopen and check your own workbook.',zh:'先看保存和重开的检查方法，再重开并检查自己的工作簿。'}}
];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const current=(records,v)=>records?.[v.id]?.version===VERSION?records[v.id]:{};
const getForCard=(card,device)=>catalogue.find(v=>v.card===card&&v.devices.includes(device))||null;
const completed=(records,v)=>current(records,v).completed===true;
const isGate=(v,records,teacher)=>Boolean(v?.required&&!teacher&&(!completed(records,v)||!current(records,v).activityStarted));
const pendingBefore=(slides,index,device,records)=>slides.slice(0,index).findIndex(s=>{const v=getForCard(s.id,device);return v?.required&&!completed(records,v);});
function cleanRecords(raw){
 const result={};if(!raw||typeof raw!=='object')return result;
 for(const v of catalogue){
  const r=raw[v.id];if(!r||r.version!==VERSION)continue;
  const method=['player-ended','seek-to-end','teacher-alternative'].includes(r.completionMethod)?r.completionMethod:'';
  result[v.id]={version:VERSION,position:Number.isFinite(r.position)?Math.max(0,Math.min(3600,r.position)):0,duration:Number.isFinite(r.duration)?Math.max(0,Math.min(3600,r.duration)):v.seconds,completed:r.completed===true&&Boolean(method),activityStarted:r.activityStarted===true&&r.completed===true&&Boolean(method)};
  if(method)result[v.id].completionMethod=method;
  for(const key of ['startedAt','completedAt','updatedAt'])if(typeof r[key]==='string'&&Number.isFinite(Date.parse(r[key])))result[v.id][key]=r[key].slice(0,40);
 }
 return result;
}
function reachedEnd(position,duration,ended=false){return Number.isFinite(duration)&&duration>0&&Number.isFinite(position)&&position>=duration-.25&&(ended||position/duration>=.995);}
function cleanLanguage(lang){return ['both','en','zh','off'].includes(lang)?lang:'both';}
function captionPreferences(raw={}){return {videoCaptions:raw.videoCaptionPreferenceVersion===CAPTION_PREFERENCE_VERSION?cleanLanguage(raw.videoCaptions):'both',videoCaptionPreferenceVersion:CAPTION_PREFERENCE_VERSION};}
function html(v,{lang='en',records={},teacher=false,captionLanguage}={}){
 const zh=lang==='zh',say=(en,cn)=>esc(en)+(zh?`<span class="zh" lang="zh-Hans">${esc(cn)}</span>`:''),done=completed(records,v),gate=isGate(v,records,teacher),r=current(records,v),captions=cleanLanguage(captionLanguage);
 const body=`<section class="lesson-video ${gate?'video-first':''}" data-video-id="${v.id}" aria-labelledby="lessonVideoTitle"><div class="video-heading"><div><span class="label">${say(gate?'Watch before this activity':v.required?'Guide for this activity':'Introduction · watch if helpful',gate?'先看指南，再做活动':v.required?'本活动的操作指南':'课程介绍 · 按需观看')}</span><h3 id="lessonVideoTitle">${say(v.title.en,v.title.zh)}</h3></div><span class="pill">${Math.floor(v.seconds/60)}:${String(Math.round(v.seconds%60)).padStart(2,'0')}</span></div><p class="video-next">${say(v.next.en,v.next.zh)}</p><video id="lessonVideo" controls playsinline preload="${gate?'metadata':'none'}" poster="videos/posters/${v.id}.jpg" aria-label="${esc(v.title.en)}"><source src="videos/${v.id}.mp4?v=caption-space-v2-20261022" type="video/mp4">${['both','en','zh'].map(code=>`<track data-caption-mode="${code}" kind="subtitles" src="videos/subtitles/${v.id}.${code}.vtt?v=caption-space-v2-20261022" srclang="${code==='both'?'mul':code==='zh'?'zh-Hans':'en'}" label="${code==='both'?'English + Mandarin / 英文 + 中文':code==='zh'?'Mandarin / 中文':'English'}" ${captions===code?'default':''}>`).join('')}<p>${say('Your browser cannot play this video here. Use Video help below.','浏览器无法在这里播放视频，请使用下方的视频帮助。')}</p></video><div class="video-controls"><label>${say('Subtitles','字幕')}<select id="videoCaptionLanguage" aria-label="Video subtitles"><option value="both" ${captions==='both'?'selected':''}>English + Mandarin / 英文 + 中文</option><option value="en" ${captions==='en'?'selected':''}>English</option><option value="zh" ${captions==='zh'?'selected':''}>Mandarin / 中文</option><option value="off" ${captions==='off'?'selected':''}>Off / 关闭</option></select></label><button type="button" data-video-help>${say('Video help','视频帮助')}</button></div><div class="video-status ${done?'done':''}" id="lessonVideoStatus" role="status">${done?say(r.completionMethod==='teacher-alternative'?'✓ Teacher-confirmed classroom viewing.':'✓ End reached. This guide is recorded.',r.completionMethod==='teacher-alternative'?'✓ 老师已确认课堂观看。':'✓ 已到达结尾，已记录本指南。'):say(v.required?'Press Play. You may pause or seek. Reach the end to unlock this activity.':'You may watch this introduction or continue to the activity.',v.required?'点击播放。可以暂停或拖动进度条。到达结尾后即可开始活动。':'可以观看介绍，也可以直接继续活动。')}</div><div class="video-error" id="lessonVideoError" role="alert" hidden></div>${gate?`<button type="button" class="primary video-start" id="videoStartActivity" ${done?'':'disabled'}>${say(done?'Start activity →':'Watch to the end to start →',done?'开始活动 →':'到达结尾后开始 →')}</button>`:''}${teacher?`<p class="muted">${say('Teacher preview: activities are unlocked. Pupil end checks are separate.','教师预览：活动全部开放，学生观看记录独立保存。')}</p>`:''}</section>`;
 return gate?body:`<details class="video-revisit"><summary>${say(v.required?'Guide · watch again':'Introduction · watch if helpful',v.required?'操作指南 · 再看一次':'课程介绍 · 按需观看')} · ${Math.floor(v.seconds/60)}:${String(Math.round(v.seconds%60)).padStart(2,'0')}${done?' · ✓':''}</summary>${body}</details>`;
}
function attach(v,{records,lang='en',captionLanguage,onUpdate,onReveal,onHelp,onLanguage}){
 const video=document.querySelector('#lessonVideo');if(!video)return null;
 const zh=lang==='zh',listeners=[],bind=(el,type,fn)=>{el?.addEventListener(type,fn);listeners.push(()=>el?.removeEventListener(type,fn));};
 let r={version:VERSION,...current(records,v)},restored=false,lastSave=0,caption=cleanLanguage(captionLanguage);
 function persist(reason){r.updatedAt=new Date().toISOString();onUpdate({...r},reason);}
 function applyCaptions(){const tracks=Array.from(video.textTracks);for(const tr of tracks)tr.mode='disabled';if(caption==='off')return;const chosen=Array.from(video.querySelectorAll('track')).find(el=>el.dataset.captionMode===caption)?.track||tracks.find(tr=>tr.language===(caption==='both'?'mul':caption==='zh'?'zh-Hans':'en'));if(chosen)chosen.mode='showing';}
 function updatePosition(){if(Number.isFinite(video.currentTime))r.position=video.currentTime;if(Number.isFinite(video.duration))r.duration=video.duration;}
 function endCheck(reason){
  updatePosition();if(!r.completed&&reachedEnd(video.currentTime,video.duration,video.ended)){
   r.completed=true;r.completedAt=new Date().toISOString();r.completionMethod=reason==='ended'?'player-ended':'seek-to-end';persist('end-reached');
   const status=document.querySelector('#lessonVideoStatus');status.classList.add('done');status.textContent=zh?'✓ 已到达结尾，已记录本指南。可以开始活动。':'✓ End reached. This guide is recorded. You can start the activity.';
   const start=document.querySelector('#videoStartActivity');if(start){start.disabled=false;start.textContent=zh?'Start activity → / 开始活动 →':'Start activity →';}
  }
 }
 bind(video,'loadedmetadata',()=>{
  applyCaptions();if(!restored){restored=true;if(r.position>0&&r.position<video.duration-.3)video.currentTime=r.position;}
 });
 bind(video,'play',()=>{if(!r.startedAt)r.startedAt=new Date().toISOString();updatePosition();persist('play');});
 bind(video,'pause',()=>{updatePosition();persist('pause');});
 bind(video,'timeupdate',()=>{endCheck('timeupdate');if(Date.now()-lastSave>2000){lastSave=Date.now();updatePosition();persist('position');}});
 bind(video,'seeked',()=>{updatePosition();endCheck('seeked');persist('seek');});
 bind(video,'ended',()=>endCheck('ended'));
 bind(video,'error',()=>{const e=document.querySelector('#lessonVideoError');e.hidden=false;e.textContent=zh?'视频未能载入。请打开“视频帮助”，重试或请老师安排课堂观看。活动和原有答案不会丢失。':'The video could not load. Open Video help to retry or ask your teacher for classroom viewing. Your answers have not been lost.';persist('playback-error');});
 bind(document.querySelector('#videoCaptionLanguage'),'change',e=>{caption=cleanLanguage(e.target.value);applyCaptions();onLanguage(caption);});
 for(const track of video.querySelectorAll('track'))bind(track,'load',applyCaptions);
 bind(video.textTracks,'addtrack',applyCaptions);
 bind(document.querySelector('[data-video-help]'),'click',()=>onHelp(v));
 bind(document.querySelector('#videoStartActivity'),'click',()=>{if(!r.completed)return;r.activityStarted=true;persist('activity-started');onReveal();});
 const details=video.closest('details');bind(details,'toggle',()=>{if(!details.open)video.pause();});
 if(video.readyState>=1)applyCaptions();
 return {destroy(){listeners.forEach(fn=>fn());},focus(){video.scrollIntoView({behavior:'smooth',block:'center'});video.focus();},retry(){document.querySelector('#lessonVideoError').hidden=true;video.load();}};
}
root.EcoLessonVideos={VERSION,CAPTION_PREFERENCE_VERSION,catalogue,getForCard,current,completed,isGate,pendingBefore,cleanRecords,reachedEnd,cleanLanguage,captionPreferences,html,attach};
})(typeof window!=='undefined'?window:globalThis);
