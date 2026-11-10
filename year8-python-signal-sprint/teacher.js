"use strict";
(() => {
 const $=s=>document.getElementById(s), cfg=window.SPRINT_CONFIG;
 const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 const c={intro:"Briefing",launch:"Launch Pad",dash:"Symbol Dash",learning:"Types of Learning",pit:"Learning Pit Stop",review:"Review relay","model-1":"Values demonstration","model-2":"Branches demonstration"};
 const cards={};
 for(const [prefix,bank] of [["starter-",starter],["value-start-",warm1],["value-",task1],["branch-start-",warm2],["branch-",task2],["stretch-",extensions],["exit-",plenary]])
   bank.forEach((item,i)=>{const id=prefix+(i+1);cards[id]=item;c[id]=item.title?.en||item.prompt?.en||id;});
 const date=d=>d?new Date(d).toLocaleString("en-MY",{timeZone:"Asia/Kuala_Lumpur",day:"numeric",month:"short",hour:"numeric",minute:"2-digit",second:"2-digit"}):"";
 let auth=null, renewal=null, roster=[], selected, report, history=[], inLoad=false, epoch=0, more=false;
 const status=s=>$("teacher-status").textContent=s;
 async function api(path,body,token){
   const r=await fetch(cfg.supabaseUrl+path,{method:"POST",headers:{apikey:cfg.publishableKey,"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:JSON.stringify(body)});
   const data=await r.json();
   if(!r.ok)throw Error(r.status===401||r.status===403?"Use your approved teacher account, or sign in again.":"Could not reach the lesson records. Please try again.");
   return data;
 }
 async function rpc(fn,body){
   if(!auth)throw Error("Sign in first.");
   if((auth.expires_at??(Date.now()/1000+300))<Date.now()/1000+60){
     const ticket=epoch;
     if(!renewal)renewal=api("/auth/v1/token?grant_type=refresh_token",{refresh_token:auth.refresh_token}).finally(()=>{renewal=null;});
     const refreshed=await renewal;
     if(!auth||ticket!==epoch)throw Error("Signed out.");
     auth=refreshed;
   }
   return api("/rest/v1/rpc/y8_signal_sprint_"+fn,body,auth.access_token);
 }
 async function load(){
  if(!auth||inLoad)return;
  inLoad=true;
  const ticket=epoch;
  try{
   const rows=[];for(let i=0;i<1000;i+=100){const page=await rpc("roster",{p_offset:i});rows.push(...page);if(page.length<100)break;}
   if(ticket!==epoch)return;
   roster=rows;$("login").hidden=true;$("dashboard").hidden=false;list();
   status(rows.length?rows.length+" student device records · refreshed "+date(Date.now())+" MYT":"No synced records yet. Ask students to enter their names and start the lesson.");
   if(selected)await detail(selected);
  }catch(e){if(ticket===epoch)status(e.message);}
  finally{inLoad=false;}
 }
 function list(){
  const term=$("filter").value.trim().toLowerCase();
  $("roster").innerHTML=roster.filter(x=>x.student_name.toLowerCase().includes(term)).map(x=>'<button type="button" class="nav-btn" data-id="'+E(x.id)+'" '+(selected===x.id?'aria-current="step"':'')+'><span>'+E(x.student_name)+'</span><small>'+E(c[x.current_card]||x.current_card||"Briefing")+' · '+E(date(x.updated_at))+'</small></button>').join("");
 }
 function readable(id,a){return typeof a.value==="number"?(cards[id]?.options?.[a.value]?.en??cards[id]?.options?.[a.value]??a.value+1):a.value;}
 function render(){
   if(!report)return;
   const entries=x=>x&&typeof x==="object"&&!Array.isArray(x)?Object.entries(x):[];
   const s=report.snapshot, attempts=entries(s.attempts).filter(([,a])=>a&&typeof a==="object"), code=entries(s.code), types=entries(s.typing).filter(([,a])=>a&&typeof a==="object"), refs=entries(s.refs);
   const response=attempts.map(([id,a])=>'<details><summary>'+E(c[id]||id)+' · '+(a.correct?"Matched":a.value==="run"?"Ran":"Not yet matched")+' · '+E(a.n)+' attempts</summary><p>Latest: '+E(readable(id,a))+'</p>'+(s.code?.[id]!=null?'<pre>'+E(s.code[id])+'</pre>':'')+'</details>').join("");
   const historic=history.map(e=>'<details><summary>'+E(e.body.kind.replace(/-/g," "))+' · '+E(c[e.body.card]||e.body.card)+' · '+E(date(e.received_at))+'</summary><pre>'+E(JSON.stringify(e.body.detail,null,2))+'</pre></details>').join("");
   $("student-detail").innerHTML='<div class="dash-bar"><h1>'+E(report.student_name)+'</h1><button class="secondary" id="export-student">Export full JSON</button></div><p class="quick-note">Last sync '+E(date(report.updated_at))+' MYT · Stage: '+E(c[s.current]||s.current)+'</p><div class="detail-metrics"><strong>'+attempts.length+' attempted</strong><strong>'+attempts.filter(([,a])=>a.correct).length+' matched</strong><strong>'+E(s.review?.count||0)+'/30 review</strong></div><div class="records"><h2>Answers and checks</h2>'+(response||'<p>No attempts yet.</p>')+
   '<h2>Current code drafts</h2>'+code.map(([id,v])=>'<details><summary>'+E(c[id]||id)+'</summary><pre>'+E(v)+'</pre></details>').join("")+
   '<h2>Typing practice</h2>'+types.map(([id,v])=>'<details><summary>'+E(drills[id]?.title?.en||id)+' · '+E(v.wpm||0)+' WPM · '+E(v.acc??"—")+'%</summary><pre>'+E(v.value||"")+'</pre></details>').join("")+
   '<h2>Reflections and short drafts</h2>'+refs.map(([id,v])=>'<details><summary>'+E(c[id]||id)+'</summary><pre>'+E(JSON.stringify(v,null,2))+'</pre></details>').join("")+
   '<div class="history-head"><h2>Activity and run history</h2>'+(more?'<button class="secondary" id="older">Load earlier activity</button>':'')+'</div>'+(historic||'<p>No synced history yet.</p>')+'</div>';
 }
 async function detail(id){
  selected=id;list();
  try{const d=await rpc("detail",{p_id:id});if(id!==selected||!auth)return;report=d;history=d.history;more=history.length===150;render();}catch(e){status(e.message);}
 }
 async function earlier(id,before){return (await rpc("detail",{p_id:id,p_before:before})).history;}
 async function fullRecord(record,ticket){
  const all=record.history.slice();let page=all;
  while(page.length===150&&auth&&ticket===epoch){page=await earlier(record.id,page.at(-1).seq);all.push(...page);}
  return {...record,history:all};
 }
 function download(filename,payload){
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 $("sign-in").addEventListener("submit",async e=>{
  e.preventDefault();const submit=e.target.querySelector("button");submit.disabled=true;status("Signing in…");
  try{auth=await api("/auth/v1/token?grant_type=password",{email:$("email").value.trim(),password:$("password").value});await load();if($("dashboard").hidden)auth=null;}
  catch(e){auth=null;status(e.message);}
  finally{$("password").value="";submit.disabled=false;}
 });
 $("sign-out").onclick=()=>{epoch++;auth=null;roster=[];selected=null;report=null;history=[];$("dashboard").hidden=true;$("login").hidden=false;$("roster").replaceChildren();$("student-detail").textContent="Choose a student to see their evidence.";status("Signed out.");};
 $("refresh").onclick=load;$("filter").oninput=list;
 $("class-export").onclick=async()=>{
  if(!auth)return;
  const btn=$("class-export"), ticket=epoch;btn.disabled=true;status("Preparing class export. Keep this tab open.");
  try{
   const rows=[];for(let i=0;i<1000;i+=100){const page=await rpc("roster",{p_offset:i});rows.push(...page);if(page.length<100)break;}
   const records=[];
   for(let i=0;i<rows.length;i+=4){
     if(!auth||ticket!==epoch)return;
     records.push(...await Promise.all(rows.slice(i,i+4).map(async row=>fullRecord(await rpc("detail",{p_id:row.id}),ticket))));
   }
   if(auth&&ticket===epoch){download("Year_8T_Python_Signal_Sprint_Records.json",{lesson:"y8-python-signal-sprint",exportedAt:new Date().toISOString(),records});status(records.length+" device records exported. Keep this file private.");}
  }catch(e){if(ticket===epoch)status(e.message);}finally{btn.disabled=false;}
 };
 $("roster").onclick=e=>{const id=e.target.closest("[data-id]")?.dataset.id;if(id)detail(id);};
 $("student-detail").onclick=async e=>{
  const btn=e.target.closest("button");if(!btn||!report)return;
  const original=report,id=original.id;
  btn.disabled=true;
  try{
   if(btn.id==="older"){const older=await earlier(id,history.at(-1)?.seq);if(id!==selected)return;history.push(...older);more=older.length===150;render();}
   if(btn.id==="export-student"){
    const ticket=epoch, payload=await fullRecord(original,ticket);
    if(!auth||selected!==id)return;
    download("Signal_Sprint_"+original.student_name.replace(/[^\p{L}\p{N}]+/gu,"_")+".json",payload);
   }
  }catch(e){status(e.message);}
  finally{btn.disabled=false;}
 };
 setInterval(()=>{if(auth&&!selected&&document.visibilityState==="visible")load();},15000);
})();
