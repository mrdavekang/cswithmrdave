(() => {
  'use strict';
  const C=window.REVISION_CLOUD,L=window.REVISION_LESSON;
  const $=id=>document.getElementById(id);
  const e=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const client=window.supabase.createClient(C.config.url,C.config.publishableKey,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});
  const mapping=new Map(L.all.map(q=>[q.id,q]));
  const asText=(q,v)=>q?.kind==='choice'&&typeof v==='string'&&v!==''?(q.options[Number(v)]||v):v;
  const arr=x=>Array.isArray(x)?x:[];
  const stamp=x=>x?new Date(x).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'}):'—';
  const stat=(label,v)=>'<div class="box"><span class="stat">'+v+'</span><p>'+label+'</p></div>';
  let clazz='7T', rows=[], interval=0, active=false, fetching=false, currentDetail=null, requestId=0;
  function note(str='',kind='ok') {$('status').textContent=str;$('status').dataset.kind=kind;}
  async function teacher(action, data={}) {
    const {data:{session}}=await client.auth.getSession();
    if(!session) throw new Error('Your teacher session ended. Please sign in again.');
    return C.rpc(C.config.teacherRpc,{p_action:action,p_class:clazz,...data},session.access_token);
  }
  function render() {
    $('class-label').textContent=clazz;
    $('stats').innerHTML=stat('Pupils joined',rows.length)+stat('Core lesson complete',rows.filter(x=>x.submitted==='true').length)+stat('Quiz completed',rows.filter(x=>x.summary?.quizChecked===15).length);
    $('rows').innerHTML=rows.length?rows.map(r=>'<tr><td><strong>'+e(r.name)+'</strong></td><td>'+e(r.stage||'Joined')+'</td><td>'+Number(r.summary?.main||0)+' / 25 attempted</td><td>'+Number(r.summary?.quiz||0)+' correct · '+Number(r.summary?.quizChecked||0)+' attempted</td><td>'+e(stamp(r.updated_at))+'</td><td><button type="button" data-record="'+e(r.id)+'" aria-label="View responses for '+e(r.name)+'">View</button></td></tr>').join(''):'<tr><td colspan="6">No pupil records yet. Create the private link above to start collecting work.</td></tr>';
    const topics=[...new Set(L.all.map(q=>q.topic))];
    $('topics').innerHTML=topics.map(topic=>{
      const sum=(key)=>rows.reduce((n,r)=>n+(Number(r.summary?.byTopic?.[topic]?.[key])||0),0);
      return '<tr><th scope="row">'+e(topic)+'</th><td>'+Math.max(0,sum('checked')-sum('manual'))+'</td><td>'+sum('firstCorrect')+'</td><td>'+sum('correct')+'</td><td>'+sum('manual')+'</td></tr>';
    }).join('');
  }
  async function refresh() {
    if(!active||fetching)return;
    const c=clazz; fetching=true;
    try {
      const result=await teacher('list');
      if(!active||c!==clazz)return;
      rows=result; render();
      $('asof').textContent='Last refreshed: '+stamp(new Date());
      if(currentDetail)await detail(currentDetail,false);
    } catch(err){if(active)note(err.message,'retry');}
    finally {fetching=false;if(active&&c!==clazz)refresh();}
  }
  const signOut=async()=>{
    active=false; clearInterval(interval);requestId++;currentDetail=null;rows=[];
    $('dashboard').hidden=true;$('login').hidden=false;$('signout').hidden=true;
    $('detail').replaceChildren();$('detail').hidden=true;$('rows').replaceChildren();$('topics').replaceChildren();$('stats').replaceChildren();clearLink();note();
    await client.auth.signOut({scope:'local'});
  };
  $('signout').addEventListener('click',signOut);
  $('login-form').addEventListener('submit',async ev=>{
    ev.preventDefault();const form=ev.currentTarget,button=form.querySelector('button');button.disabled=true;note('Signing in…');
    const d=new FormData(form);
    try {
      const {error}=await client.auth.signInWithPassword({email:String(d.get('email')).trim(),password:String(d.get('password'))});
      form.elements.password.value='';
      if(error)throw error;
      await teacher('authorize');
      active=true;$('login').hidden=true;$('dashboard').hidden=false;$('signout').hidden=false;note();
      await refresh();
      clearInterval(interval);interval=setInterval(refresh,10000);
    } catch(err){await client.auth.signOut({scope:'local'});note(err.message,'retry');}
    finally {button.disabled=false;}
  });
  function clearLink(){$('link').value='';$('link-label').hidden=true;$('copy').hidden=true;}
  $('class-form').addEventListener('submit',ev=>{
    ev.preventDefault(); const next=$('class').value.trim().toUpperCase();if(!/^7[A-Z]{1,2}$/.test(next))return;
    if(next!==clazz){clazz=next;currentDetail=null;requestId++;rows=[];clearLink();$('detail').hidden=true;render();}
    note();refresh();
  });
  $('refresh').addEventListener('click',refresh);
  $('invite').addEventListener('click',async()=>{
    if(!active)return;
    if(location.protocol==='file:'){note('Use the http://localhost preview or a school-hosted HTTPS copy before creating a link. A file link can’t be opened by pupils.','retry');return;}
    const c=clazz; if(!confirm('Create a new private link for '+c+'? Existing devices keep access, but the previous link won’t accept new devices.'))return;
    const button=$('invite');button.disabled=true;
    try {
      const secret=C.randomHex(), r=await teacher('invite',{p_class:c,p_invite:secret});
      if(!active||c!==clazz)return;
      const url=new URL('index.html',location.href);url.hash=new URLSearchParams({class:c,join:secret}).toString();
      $('link').value=url.href;$('link-label').hidden=false;$('copy').hidden=false;
      const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
      note('Link created; new pupils can join until '+stamp(r.expires)+'. '+(local?'This localhost link only works on your device. Use the hosted app to share with pupils.':'Share it privately in Teams.'));
    } catch(err){note(err.message,'retry');}
    finally{button.disabled=false;}
  });
  $('copy').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText($('link').value);note('Pupil link copied. Share it only with this class.');}
    catch {$('link').select();note('Select and copy the pupil link above.');}
  });
  function evidence(q,a) {
    const marks=q.bits?arr(a.places).map(i=>2**(q.bits.length-1-i)).join(', '):'';
    const attempt=a.attemptCount?'<details><summary>'+Number(a.attemptCount)+' distinct attempt'+(a.attemptCount===1?'':'s')+' · '+(a.lastCorrect===true?'latest correct':a.lastCorrect===false?'latest needs practice':'teacher review')+'</summary><ol>'+arr(a.attempts).filter(x=>x&&typeof x==='object').map(x=>'<li>'+e(asText(q,x.answer))+' — '+(x.correct===true?'correct':x.correct===false?'needs practice':'written response')+' · '+e(stamp(x.at))+'</li>').join('')+'</ol></details>':'<p class="muted">Draft only · not checked</p>';
    return '<article class="box"><span class="eyebrow">'+e(q.id)+' · '+e(q.topic)+'</span><h3>'+e(q.en)+'</h3><p><b>Latest input:</b> '+e(asText(q,a.draft)||'—')+'</p>'+
      (a.working?'<p><b>Working:</b> '+e(a.working)+'</p>':'')+(marks?'<p><b>Marked places:</b> '+e(marks)+'</p>':'')+attempt+'</article>';
  }
  async function detail(id,focus=true){
    currentDetail=id;const request=++requestId,c=clazz;
    try {
      const result=await teacher('detail',{p_id:id});
      if(!active||c!==clazz||request!==requestId)return;
      const r=result[0];if(!r){note('This record is not available in '+clazz+'.','retry');return;}
      const s=r.snapshot||{}, answers=s.answers||{}, panel=$('detail');
      const open=new Set([...panel.querySelectorAll('article:has(details[open]) .eyebrow')].map(x=>x.textContent));
      const labels=['Knowledge','Skills','Understanding'], confidence=['Not yet','With an example','On my own'];
      panel.innerHTML='<div class="dash-top"><div><span class="eyebrow">'+e(clazz)+' · '+e(stamp(r.updated_at))+'</span><h2 tabindex="-1" id="detail-title">'+e(r.name)+'</h2></div><button id="close-detail">Close responses</button></div>'+
        '<div class="box"><h3>Learning reflections</h3><p>'+labels.map((l,i)=>l+': '+e(confidence[s.ksu?.[i]]||'—')).join(' · ')+'</p><p>Pitstop: '+e(s.pit?.phase||'—')+' · '+e(s.pit?.next||'—')+'</p></div>'+
        '<div class="detail-list">'+(L.all.filter(q=>answers[q.id]&&(answers[q.id].attemptCount||answers[q.id].working||answers[q.id].places?.length||answers[q.id].draft)).map(q=>evidence(q,answers[q.id])).join('')||'<p>No responses saved yet.</p>')+'</div>';
      panel.hidden=false;$('close-detail').addEventListener('click',()=>{currentDetail=null;requestId++;panel.hidden=true;});
      for(const item of panel.querySelectorAll('article')) if(open.has(item.querySelector('.eyebrow').textContent)&&item.querySelector('details'))item.querySelector('details').open=true;
      if(focus)$('detail-title').focus();
    }catch(err){if(active&&focus)note(err.message,'retry');}
  }
  $('rows').addEventListener('click',ev=>{const id=ev.target.closest('[data-record]')?.dataset.record;if(id)detail(id);});
  function csvCell(v){
    let str=String(v??'');
    if(/^[\s\uFEFF]*[=+@-]|^[\t\r\n]/.test(str)||/^0\d+([\s\d]+)?$/.test(str))str="'"+str;
    return '"'+str.replace(/"/g,'""')+'"';
  }
  async function exportRows(format){
    const c=clazz;
    try {
      const result=await teacher('export');
      if(!active||c!==clazz)return;
      if(format==='json'){C.download('Year7_Revision_'+c+'.json',JSON.stringify({className:c,exportedAt:new Date().toISOString(),pupils:result},null,2));return;}
      const matrix=[['Pupil','Class','Device record','Last saved','Current stage','Core complete','Question','Topic','Prompt','Latest input','Working','Marked places','First correct','Latest correct','Checked attempts','Knowledge','Skills','Understanding','Learning phase','Next step']];
      const confidence=['Not yet','With an example','On my own'];
      for(const r of result){
        const s=r.snapshot||{};
        const items=Object.entries(s.answers||{}).filter(([id,a])=>mapping.has(id)&&a&&typeof a==='object'&&(a.attemptCount||a.draft||a.working||arr(a.places).length));
        for(const [id,a] of items.length?items:[['',{}]]){
          const q=mapping.get(id);
          matrix.push([r.name,c,r.id,r.updated_at,s.stage,Boolean(s.submitted),id,q?.topic,q?.en,asText(q,a.draft),a.working,arr(a.places).map(i=>q?.bits?2**(q.bits.length-1-i):i).join(' '),a.firstCorrect,a.lastCorrect,a.attemptCount,...[0,1,2].map(i=>confidence[s.ksu?.[i]]),s.pit?.phase,s.pit?.next]);
        }
      }
      C.download('Year7_Revision_'+c+'.csv','\uFEFF'+matrix.map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
    }catch(err){if(active)note(err.message,'retry');}
  }
  $('export-csv').addEventListener('click',()=>exportRows('csv'));
  $('export-json').addEventListener('click',()=>exportRows('json'));
})();
