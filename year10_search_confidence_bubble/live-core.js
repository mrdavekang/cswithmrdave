/* Publishable key only. Private records are protected by the lesson RPCs. */
window.BubbleLive=(()=>{
 'use strict';
 const config={url:'https://qejimegoysblonawsoza.supabase.co',key:'sb_publishable_bWHlzeJJdgepYefUsc16zQ_93_TEYes'};
 const questions={
 'binary-boundary':{title:'Binary search: choose the new high index',prompt:'The sorted values are [5, 9, 13, 18, 24, 31, 42], at indexes 0–6. The target VALUE is 13. Low INDEX = 0, high INDEX = 6, midpoint INDEX = 3 and midpoint VALUE = 18. What should the new high INDEX be? Explain which indexes are ruled out and why.',expect:'Give the new high index, then explain using the target value, midpoint value and sorted order.',answer:'New high INDEX = 2. Set high to mid - 1: 3 - 1 = 2. The target value 13 is smaller than 18. In this sorted list, indexes 3–6 cannot contain 13, so keep indexes 0–2.'},
 'bubble-stop':{title:'Bubble sort: is one pass enough?',prompt:'After the first complete pass, the list is [3, 5, 2, 7]. The largest value, 7, is at the end. Can the bubble-sort program stop now? Explain what must happen before it can stop.',expect:'State whether it should stop, then name the evidence from a whole pass that allows it to stop.',answer:'No. Values 5 and 2 are still out of ascending order. Repeat complete passes. Only a complete pass with no swaps leaves swapped = False, which stops the outer WHILE loop.'}
 };
 async function rpc(name,args={},token=null){const abort=new AbortController(),time=setTimeout(()=>abort.abort(),12000);try{const headers={apikey:config.key,'Content-Type':'application/json'};if(token)headers.Authorization='Bearer '+token;const res=await fetch(config.url+'/rest/v1/rpc/'+name,{method:'POST',headers,body:JSON.stringify(args),signal:abort.signal});const d=await res.json();if(!res.ok)throw Error(d.message||'School connection failed');return d}finally{clearTimeout(time)}}
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clock=seconds=>{const n=Math.max(0,Math.ceil(seconds));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')};
 let clockOffset=0;const syncClock=state=>{if(state?.server_now)clockOffset=Date.parse(state.server_now)-Date.now()};
 const seconds=(state,discussion=false)=>discussion?(state.round?Math.max(0,(Date.parse(state.round.deadline)-Date.now()-clockOffset)/1000):0):state.paused?state.timer_remaining:Math.max(0,(Date.parse(state.timer_end)-Date.now()-clockOffset)/1000);
 function celebrate(text){const box=document.createElement('div');box.className='point-celebration';box.setAttribute('role','status');box.innerHTML='<strong>'+esc(text)+'</strong>'+Array.from({length:16},(_,i)=>`<i style="--n:${i}"></i>`).join('');document.body.append(box);setTimeout(()=>box.remove(),4200)}
 function authClient(){if(!window.supabase)throw Error('Teacher sign-in library did not load. Refresh this page.');return window.supabase.createClient(config.url,config.key,{auth:{storageKey:'y10-bubble-teacher-auth-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}})}
 return {config,questions,rpc,esc,clock,seconds,syncClock,celebrate,authClient};
})();
