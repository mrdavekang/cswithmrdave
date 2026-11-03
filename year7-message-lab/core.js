/* Pure lesson rules; no student records or credentials. */
(function(root){'use strict';
 const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!?.,';
 const bits=c=>c.codePointAt(0).toString(2).padStart(8,'0');
 const clean=v=>String(v??'').replace(/\s/g,'');
 const normalizeSignMessage=v=>String(v??'').trim().replace(/[a-z]/g,c=>c.toUpperCase());
 const groups=s=>String(s??'').trim().split(/\s+/).filter(Boolean);
 function decode(v){const b=clean(v);return /^[01]{8}$/.test(b)?String.fromCharCode(parseInt(b,2)):null;}
 function inspect(v,expected){const b=clean(v);if(/[^01]/.test(b))return {ok:false,kind:'digits',count:b.length};if(b.length!==8)return {ok:false,kind:'length',count:b.length};const char=decode(b);return {ok:expected===undefined||char===expected,kind:char===expected||expected===undefined?'correct':'character',char,count:8};}
 function inspectMessage(message,codes){const rows=[...message].map((c,i)=>({index:i,intended:c,code:codes[i]??'',...inspect(codes[i]??'',c)}));return {rows,ok:rows.length>0&&rows.every(r=>r.ok),output:rows.map(r=>r.kind==='length'||r.kind==='digits'?'□':r.char).join('')};}
 // Preserve the decoded character separately from the intended character.
 function preview(codes){return codes.map(v=>{const c=decode(v);return c===null?'□':c===' '?' ':/^[A-Za-z0-9!?.,]$/.test(c)?c:'□';}).join('');}
 function token(){const a=new Uint8Array(32);crypto.getRandomValues(a);return Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');}
 const stages=[['Start','开始'],['Do now','开始任务'],['Types of learning','学习类型'],['Main Task 1 · Reflection','主任务一：反思'],['Main Task 2 · Message Lab','主任务二：信息实验室'],['Extra challenges','额外挑战'],['Learning pitstop','学习加油站'],['Plenary','课堂回顾'],['Finish','完成']];
 function clockState(t,now=Date.now()) {const s=structuredClone(t||{slide:'welcome',spent:{},running:false,anchor:null});if(s.running&&s.anchor){s.spent[s.slide]=(s.spent[s.slide]||0)+Math.max(0,(now-s.anchor)/1000);s.anchor=now;}return s;}
 function timerAction(t,action,slide,now=Date.now()){const s=clockState(t,now);if(action==='select'){s.slide=slide;s.anchor=s.running?now:null;}else if(action==='toggle'){s.running=!s.running;s.anchor=s.running?now:null;}else if(action==='reset'){s.spent[s.slide]=0;s.anchor=s.running?now:null;}return s;}
 const api={CHARS,bits,clean,normalizeSignMessage,groups,decode,inspect,inspectMessage,preview,token,stages,clockState,timerAction};root.MessageCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:window);
