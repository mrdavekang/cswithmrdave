(() => {
  'use strict';
  const $=(q,el=document)=>el.querySelector(q), main=$('#main'), clock=$('#clock');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storage = {
    get(key, session=false) { try {return JSON.parse((session?sessionStorage:localStorage).getItem(key));} catch {return null;} },
    put(key,value,session=false) {try {(session?sessionStorage:localStorage).setItem(key,JSON.stringify(value));return true;}catch{return false;} },
    remove(key, session=false) {try{(session?sessionStorage:localStorage).removeItem(key);}catch{}}
  };
  let zh=!!storage.get('ecofair-language'), mode='demo', screen='loading', content, attempt, draft, selected, savedAt, error='', online=true, localOK=true, dirty=false, stamp=0, confirmedStamp=-1, writer, sending=false, finished, expired=false, recovery=null;
  const storagePrefix=window.ExamCloud?'ecofair-live-v4-':'ecofair-v4-', sessionKey=storagePrefix+'session';
  let session=storage.get(sessionKey,true);
  const calcState={}, calcOpen={}, workingOn=new Set(['B3','C3']), expandedSheets=new Set();
  let formulaMode=storage.get('ecofair-formula-mode')||(matchMedia('(pointer: coarse)').matches?'tap':'type');
  let tapKeyboard;
  const bi=(en,zhText)=>esc(en)+(zh&&zhText?'<span class="zh" lang="zh-Hans">'+esc(zhText)+'</span>':'');
  const btxt=(en,zhText)=>esc(zh?en+' / '+zhText:en);
  const btn=(id,en,z,cls='',attrs='')=>'<button type="button" class="btn '+cls+'" id="'+id+'" '+attrs+'>'+btxt(en,z)+'</button>';
  const ns=()=>({answers:{},cells:{},model:{},work:{},flags:{},modelTrail:[],index:0});
  const locale = new Intl.DateTimeFormat('en',{hour:'numeric',minute:'2-digit',second:'2-digit'});
  const localKey=()=> storagePrefix+'attempt-'+attempt.id;
  const pack=()=>({draft,stamp,updatedAt:Date.now(),finished,recovery});
  const timeText=()=>savedAt?locale.format(new Date(savedAt)):'';
  const displayLang=()=>$('#lang').setAttribute('aria-pressed',String(zh));
  let clockOffset=0, clockCheck, nextClockCheck=0;
  const deadline=()=>attempt?.deadline?attempt.deadline-clockOffset:0;
  const locked=()=>!!(finished||expired||(deadline() && Date.now()>=deadline()));
  const activeQuestion=()=>content.questions[draft.index];
  const answers=q=>draft.answers[q.id]??={};
  function setStatus(){
    let text='';
    if(finished) text=finished.receipt?(finished.kind==='submitted'?btxt('Submitted · receipt received','已提交，已收到回执'):btxt('Test closed · online receipt received','测验已结束，已收到在线回执')):btxt('Saved on this device · not submitted online','已保存在本机，尚未在线提交');
    else if(draft) text=mode==='secure'
      ? confirmedStamp===stamp&&online?btxt('Saved online · '+timeText(),'已在线保存'):localOK?btxt('Saved on this device · syncing not confirmed','已保存在本机，尚未确认同步'):btxt('Save not confirmed · tell your teacher','尚未确认保存，请告诉老师')
      : localOK?btxt('Saved on this device','已保存在本机'):btxt('Browser storage unavailable','无法使用浏览器存储');
    $('#save-status').textContent=decode(text);
  }
  function decode(s){const el=document.createElement('span');el.innerHTML=s;return el.textContent;}
  function persist(){if(attempt&&draft)localOK=storage.put(localKey(),pack());setStatus();}
  function change(){stamp++;dirty=true;persist();}
  function applyLang(){displayLang();storage.put('ecofair-language',zh);}
  function show(html,focus=true){
    tapKeyboard=null;main.innerHTML=html;setStatus();tick();
    if(focus){window.scrollTo(0,0);$('h1',main)?.focus({preventScroll:true});}
  }
  function card(body,cls='',sec=''){return '<section class="card '+cls+'" '+(sec?'data-section="'+sec+'"':'')+'>'+body+'</section>';}
  function banner(text,z){return '<p class="message warning" role="status">'+bi(text,z)+'</p>';}
  async function api(path, body, secret=session?.code) {
    if(window.ExamCloud)return path==='info'?{mode:'secure'}:ExamCloud.pupil(path,body,secret);
    const res=await fetch('/api/'+path,{cache:'no-store',method:body===undefined?'GET':'POST',
      headers:{...(secret?{Authorization:'Bearer '+secret}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},
      ...(body===undefined?{}:{body:JSON.stringify(body)})});
    let data;
    try{data=await res.json();}catch{throw Error('Cannot contact the assessment server.');}
    if(!res.ok){const e=Error(data.message || 'Request could not be completed.');e.status=res.status;throw e;}
    return data;
  }
  function installDeadline(data){
    if(+(data.deadline||0)>+(attempt?.deadline||0)){
      attempt.deadline=data.deadline;
      if(session?.data?.attempt){
        session.data.attempt.deadline=data.deadline;
        storage.put(sessionKey,session,true);
      }
    }
  }
  function acceptFinish(data){
    if(!data.finished||!data.draft)return false;
    if(data.stamp<stamp)recovery=draft;
    stamp=data.stamp;draft=data.draft;finished=data.finished;dirty=false;
    if(window.ExamCloud&&session){
      session.data={attempt,...data};storage.put(sessionKey,session,true);
    }
    screen='done';persist();render();return true;
  }
  async function checkClock(){
    if(!window.ExamCloud||!attempt||finished||sending||clockCheck)return;
    const id=attempt.id;
    clockCheck=(async()=>{
      try{
        const data=await api('status',{});
        if(attempt?.id!==id||finished)return;
        online=true;
        installDeadline(data);
        if(acceptFinish(data))return;
        if(expired&&deadline()>Date.now()){
          expired=false;screen='question';render();sync();
        }else setStatus();
      }catch{online=false;setStatus();}
    })();
    try{await clockCheck;}finally{clockCheck=null;}
  }
  async function sync(){
    if(mode!=='secure'||!attempt||finished||!dirty||locked())return;
    if(writer)return writer;
    const sendStamp=stamp;
    writer=(async()=>{try{
      const data=await api('save',{draft,stamp:sendStamp});confirmedStamp=data.stamp;savedAt=data.savedAt;online=true;
      installDeadline(data);
      if(acceptFinish(data))return;
      if(stamp===sendStamp)dirty=false;
    }catch{online=false;}finally{writer=null;setStatus();}})();
    return writer;
  }
  function enter(data, cache=null) {
    content=data.content;attempt=data.attempt;
    if(data.serverNow&&online)clockOffset=data.serverNow-Date.now();
    const local=storage.get(localKey());
    const allowedLocal=local && local.stamp>(data.stamp??-1);
    draft=allowedLocal?local.draft:data.draft||ns();
    if(content)draft.index=Math.min(content.questions.length-1, Math.max(0,+draft.index||0));
    stamp=allowedLocal?local.stamp:data.stamp??0; confirmedStamp=data.stamp??-1;
    savedAt=data.savedAt; finished=data.finished||local?.finished||null;
    recovery=local?.recovery??(data.finished&&local&&local.stamp>confirmedStamp?local.draft:null);
    if(data.finished&&data.draft){draft=data.draft;stamp=confirmedStamp;}
    if(cache)storage.put(sessionKey,cache,true);
    dirty=stamp>confirmedStamp&&!finished;expired=!!(deadline()&&Date.now()>=deadline());
    screen=finished?'done':expired?(window.ExamCloud?'clock-check':'review'):'question';persist();render();
    if(expired&&!finished)(window.ExamCloud?checkClock():submit());
  }
  function localContent() {
    if(window.ExamContent)return Promise.resolve(window.ExamContent);
    return new Promise((ok,no)=>{ const script=document.createElement('script');script.src='content.js';script.onload=()=>ok(window.ExamContent);script.onerror=()=>no(Error('The assessment questions could not be opened.'));document.head.append(script); });
  }
  function entry(){
    const local=storage.get(storagePrefix+'attempt-demo'), canContinue=!!local?.draft;
    show(card('<div class="hero-bar" aria-hidden="true"><i></i><i></i><i></i><i></i></div><p class="eyebrow">TERM 1.2 · '+btxt('ONLINE TEST','在线测验')+'</p>'+
      '<h1 tabindex="-1">'+bi('Year 7 Computing assessment','七年级计算机科学测验')+'</h1>'+
      '<div class="start-facts"><span class="badge">'+btxt('45 minutes','45 分钟')+'</span><span class="badge">'+btxt('40 marks','40 分')+'</span><span class="badge">'+btxt('21 questions','21 道题')+'</span></div>'+
      '<p class="intro">'+bi('Read each question and answer in the space provided. Use Next and Back to move between questions. Review your answers before you submit. No other app is needed.','阅读每道题，在指定的位置作答。用“下一题”和“上一题”切换题目。提交前检查答案。不需要使用其他应用。')+'</p>'+
      (window.ExamCloud?'<p class="message">'+bi('Wait for your teacher to start the shared 45-minute timer. Then enter your own private code.','请等老师启动全班共用的 45 分钟计时器，再输入你自己的测验代码。')+'</p>':'')+
      (mode==='demo'?banner('Local preview only. This build does not send answers to a teacher.','仅供本地预览。这个版本不会把答案发送给老师。'):'')+
      (error?banner(error,'请检查测验代码或告诉老师。'):'')+
      '<form id="entry-form">'+(mode==='secure'?'<div class="field"><label for="entry-code">'+bi('Your teacher-issued test code','老师发给你的测验代码')+'</label><input id="entry-code" class="textbox" type="password" required maxlength="64" autocapitalize="off" autocomplete="off" spellcheck="false"></div>':'')+
      '<div class="actions"><div class="left">'+btn('try-controls','Try the controls','试用操作','')+'</div><div class="right"><button class="btn primary" type="submit">'+btxt(mode==='demo'?(canContinue?'Resume preview':'Start preview'):'Start test',mode==='demo'?(canContinue?'继续预览':'开始预览'):'开始测验')+'</button></div></div></form>'));
    $('#try-controls').onclick=()=>{screen='try';render();};
    $('#entry-form').onsubmit=async e=>{
      e.preventDefault();if(sending)return;sending=true;error='';const button=e.currentTarget.querySelector('button[type=submit]');button.disabled=true;
      try {
        if(mode==='secure'){
          const code=$('#entry-code').value.trim();
          const data=await api('enter',{},code);
          session={code,data};enter(data,session);
        } else {
          const data=await localContent();
          enter({content:data,attempt:{id:'demo',deadline:local?.draft?local.deadline||0:0},draft:ns()});
        }
      } catch(e) {error=e.message;entry();} finally {sending=false;button.disabled=false;}
    };
  }
  function deviceCheck() {
    show(card('<p class="eyebrow">'+btxt('NOT MARKED','不计分')+'</p><h1 tabindex="-1">'+bi('Try the spreadsheet controls','试用电子表格操作')+'</h1>'+
      '<p class="intro">'+bi('Enter 7 in B2 and tap Apply. Swipe over the grid to scroll the page without changing the selected cell.','在 B2 输入 7，然后点击“应用”。在表格上滑动可滚动页面，不会改变选中的单元格。')+'</p>'+
      sheetFrame([{cell:'B2',mode:'value'}],'B2')+'<div class="actions">'+btn('back-entry','Back to instructions','返回说明','primary')+'</div>','question-card','D'));
    const demo={version:'controls',build:{A1:'Item',B1:'Number',A2:'Demo',A3:'Not part of the test'},buildZh:{A1:'物品',B1:'数量',A2:'演示',A3:'不属于测验'}};
    const scratch={cells:{}};
    mountSheet(demo,scratch,{sheet:'build',edits:[{cell:'B2',mode:'value'}]},'B2',()=>{});
    $('#back-entry').onclick=()=>{screen='entry';render();};
  }
  function bitsHTML(bits, key){
    return '<div class="bits visual" style="--count:'+bits.length+'">'+[...bits].map((x,i)=>{
      const p=2**(bits.length-i-1), label=zh?'位值 '+p+'，二进制位 '+x:'Place value '+p+', bit '+x;
      return '<div class="bitcol"><strong>'+p+'</strong>'+(key?'<button type="button" class="bit" data-switch="'+esc(key)+'" data-i="'+i+'" aria-label="'+esc(label)+'" aria-pressed="'+(x==='1')+'">'+x+'</button>':'<span class="bit '+(x==='1'?'on':'')+'" aria-label="'+esc(label)+'">'+x+'</span>')+'</div>';
    }).join('')+'</div>';
  }
  function pixelsHTML(bits,key){
    return '<div class="pixels visual" style="--count:'+bits.length+'">'+[...bits].map((x,i)=>{
      const label=(zh?'像素 ':'Pixel ')+(i+1)+(x==='1'?(zh?'，填色':', filled'):(zh?'，白色':', white'));
      return key?'<button type="button" class="pixel '+(x==='1'?'on':'')+'" data-switch="'+esc(key)+'" data-i="'+i+'" aria-label="'+esc(label)+'" aria-pressed="'+(x==='1')+'"></button>':'<span class="pixel '+(x==='1'?'on':'')+'" role="img" aria-label="'+esc(label)+'"></span>';
    }).join('')+'</div>';
  }
  function codeTable(rows){
    return '<table class="data-table"><thead><tr><th scope="col">'+bi('Character','字符')+'</th><th scope="col">'+bi('Eight-bit code','八位编码')+'</th></tr></thead><tbody>'+rows.map(([a,b])=>'<tr><td>'+esc(a)+'</td><td><code>'+esc(b)+'</code></td></tr>').join('')+'</tbody></table>';
  }
  function compareDisplays(q){
    const bitRow=[...q.displayBits],letter=q.referenceCodes.find(([,code])=>code===q.displayBits)?.[0]||'';
    const sequence=zh?bitRow.map(x=>x==='1'?'黑色':'白色').join('、'):bitRow.map(x=>x==='1'?'black':'white').join(', ');
    return '<div class="visual compare-displays">'+
      '<div class="shared-bits"><strong>'+bi('Same eight bits sent to both displays','发送到两个显示器的八位数据相同')+'</strong><code>'+esc(q.displayBits)+'</code></div>'+
      '<div class="display-rules"><section class="display-rule text-rule" aria-labelledby="display-a">'+
      '<h2 id="display-a">'+bi('Display A · Character','显示器 A · 字符')+'</h2>'+
      '<figure class="display-preview"><div class="character-output">'+esc(letter)+'</div><figcaption>'+bi('Letter shown on A','A 显示的字母')+'</figcaption></figure>'+
      '<p class="display-key-label">'+bi('Character-code table','字符编码表')+'</p>'+codeTable(q.referenceCodes)+'</section>'+
      '<section class="display-rule pixel-rule" aria-labelledby="display-b"><h2 id="display-b">'+bi('Display B · Pixel picture','显示器 B · 像素图')+'</h2>'+
      '<figure class="display-preview"><div class="picture-row" role="img" aria-label="'+esc((zh?'黑白像素图，从左到右：':'Black-and-white pixel picture, from left to right: ')+sequence)+'">'+
      bitRow.map(x=>'<span class="picture-pixel '+(x==='1'?'black':'white')+'" aria-hidden="true"></span>').join('')+'</div>'+
      '<div class="picture-bits" aria-hidden="true">'+bitRow.map(x=>'<span>'+x+'</span>').join('')+'</div>'+
      '<figcaption>'+bi('Picture shown on B','B 显示的图片')+'</figcaption></figure>'+
      '<p class="display-key-label">'+bi('Pixel key','像素对照表')+'</p><dl class="pixel-key"><div><dt>0</dt><dd><span class="key-square" aria-hidden="true"></span>'+bi('White pixel','白色像素')+'</dd></div>'+
      '<div><dt>1</dt><dd><span class="key-square filled" aria-hidden="true"></span>'+bi('Black pixel','黑色像素')+'</dd></div></dl></section></div></div>';
  }
  function visual(q){
    if(q.bits) return bitsHTML(q.bits);
    if(q.pixels) return pixelsHTML(q.pixels);
    if(q.visual==='arrivals')return '<div class="visual"><table class="data-table"><thead><tr><th scope="col">'+bi('Time slot','时段')+'</th><th scope="col">'+bi('New arrivals','到达人数')+'</th></tr></thead><tbody><tr><td>9:00–10:00</td><td>12</td></tr><tr><td>10:00–11:00</td><td>19</td></tr><tr><td>11:00–12:00</td><td>24</td></tr></tbody></table></div>';
    if(q.visual==='characters')return '<div class="visual"><p class="binary-line">01001111 01001011</p>'+codeTable([['I','01001001'],['K','01001011'],['N','01001110'],['O','01001111']])+'</div>';
    if(q.visual==='compare-displays')return compareDisplays(q);
    return '';
  }
  function field(q,f) {
    const id='ans-'+f.key, val=answers(q)[f.key];
    if(['radio','multi'].includes(f.kind)){
      const multi=f.kind==='multi';
      return '<div class="field"><fieldset><legend>'+bi(f.label,f.zh)+'</legend><div class="opt-list '+(multi?'multi':'')+'">'+f.options.map(o=>'<label><input type="'+(multi?'checkbox':'radio')+'" name="'+id+'" data-answer="'+esc(f.key)+'" value="'+esc(o.v)+'" '+((multi?val?.includes(o.v):val===o.v)?'checked':'')+'><span>'+bi(o.en,o.zh===o.en?'':o.zh)+'</span></label>').join('')+'</div></fieldset></div>';
    }
    if(f.kind==='bitgrid'||f.kind==='pixelgrid')return '<div class="field"><p>'+bi(f.label,f.zh)+'</p>'+(f.kind==='bitgrid'?bitsHTML(val||f.start||'0'.repeat(f.size),f.key):pixelsHTML(val||f.start||'0'.repeat(f.size),f.key))+'</div>';
    const label='<label for="'+id+'">'+bi(f.label,f.zh)+'</label>';
    const attrs='id="'+id+'" data-answer="'+esc(f.key)+'" autocomplete="off" spellcheck="false"';
    const input=f.kind==='area'?'<textarea class="textbox" maxlength="360" '+attrs+'>'+esc(val)+'</textarea>':
      '<input class="textbox '+(['number','binary'].includes(f.kind)?'narrow numeric':'')+'" maxlength="'+(f.kind==='binary'?12:170)+'" '+(['number','binary'].includes(f.kind)?'inputmode="numeric" ':'')+attrs+' value="'+esc(val)+'">';
    return '<div class="field">'+label+input+'</div>';
  }
  function bindFields(q){
    for(const el of main.querySelectorAll('[data-answer]')){
      const k=el.dataset.answer;
      if(el.type==='checkbox'||el.type==='radio'){
        el.onchange=()=>{answers(q)[k]=el.type==='checkbox'?Array.from(main.querySelectorAll('input[name="'+el.name+'"]:checked'),x=>x.value):el.value;change();};
      }else el.oninput=()=>{answers(q)[k]=el.value;change();};
    }
    for(const el of main.querySelectorAll('[data-switch]'))el.onclick=()=>{
      const k=el.dataset.switch,i=+el.dataset.i,f=q.fields.find(f=>f.key===k);
      const values=[...(answers(q)[k]||f.start||'0'.repeat(f.size))];values[i]=values[i]==='1'?'0':'1';
      answers(q)[k]=values.join('');const on=values[i]==='1';el.setAttribute('aria-pressed',String(on));
      if(f.kind==='bitgrid'){const p=2**(values.length-i-1);el.textContent=values[i];el.setAttribute('aria-label',zh?'位值 '+p+'，二进制位 '+values[i]:'Place value '+p+', bit '+values[i]);}
      else{el.classList.toggle('on',on);el.setAttribute('aria-label',(zh?'像素 ':'Pixel ')+(i+1)+(on?(zh?'，填色':', filled'):(zh?'，白色':', white')));}
      change();
    };
  }
  const calcKeys=[['clear','Clear','清除'],['back','⌫','退格'],['÷','÷','除'],['×','×','乘'],
    ['7','7'],['8','8'],['9','9'],['−','−','减'],['4','4'],['5','5'],['6','6'],['+','+','加'],
    ['1','1'],['2','2'],['3','3'],['=','=','等于'],['0','0'],['.','.','小数点']];
  const hasCalculator=q=>q.section==='B'||q.calculator===true;
  function calculator(q){
    return '<details class="working calculator" id="calc" '+(calcOpen[q.id]?'open':'')+'><summary>'+btxt('Calculator','计算器')+'</summary><div class="calc-pad">'+
      '<p class="calc-note">'+bi('Use it for arithmetic. Enter your answer in the question yourself.','可用它进行算术运算。请自行在题目中填写答案。')+'</p>'+
      '<output class="calc-display" id="calc-display" aria-live="polite" aria-label="'+btxt('Calculator display','计算器显示')+'"></output>'+
      '<div class="calc-keys">'+calcKeys.map(([key,label,z])=>'<button class="btn '+(key==='='?'primary equals':key==='0'?'zero':'')+'" type="button" data-calc="'+esc(key)+'" aria-label="'+btxt(key==='back'?'Backspace':key==='='?'Equals':label,z||label)+'">'+(key==='clear'?btxt(label,z):esc(label))+'</button>').join('')+'</div></div></details>';
  }
  function bindCalculator(q){
    const panel=$('#calc'), display=$('#calc-display');
    if(!panel)return;
    const draw=()=>{
      const state=calcState[q.id]||ExamCalculator.initial();
      display.textContent=state.error?decode(btxt('Cannot calculate','无法计算')):
        state.result!==null?state.expression+' = '+state.result:state.expression||'0';
    };
    const use=key=>{calcState[q.id]=ExamCalculator.press(calcState[q.id]||ExamCalculator.initial(),key);draw();};
    for(const k of panel.querySelectorAll('[data-calc]'))k.onclick=()=>use(k.dataset.calc);
    panel.ontoggle=()=>{calcOpen[q.id]=panel.open;};
    panel.onkeydown=e=>{
      if(!panel.open||e.ctrlKey||e.metaKey||e.altKey)return;
      const map={'*':'×','/':'÷','-':'−',Backspace:'back',Delete:'clear',Escape:'clear'};
      const key=map[e.key]||e.key;
      if(/^[0-9.+−×÷=]$/.test(key)||['back','clear'].includes(key)){e.preventDefault();use(key);}
      // Enter/Space retain native keyboard activation of whichever key has focus.
    };
    draw();
  }
  const formulaKeys=[['=','Start','开头'],['+','Add','加'],['-','Subtract','减'],['*','Multiply','乘'],['/','Divide','除'],
    ['SUM','Add a range','范围求和'],['(','Open bracket','左括号'],[')','Close bracket','右括号'],[':','Range colon','范围冒号'],['back','Delete last entry','删除最后一项']];
  const expectedResult=q=>q.expected?'<div class="expected-result"><p>'+bi('Expected result','预期结果')+'</p><strong>'+bi(q.expected.en,q.expected.zh)+'</strong>'+
    (q.expected.depends?'<p class="expected-note">'+bi('This assumes your earlier formulas are correct. You can continue if your result is different.','此结果假设之前的公式正确。如果你的结果不同，仍可继续。')+'</p>':'')+'</div>':'';
  function sheetFrame(edits,sel,q){
    const def=edits?.find(x=>x.cell===sel);
    const formula=!!def&&def.mode!=='value', tap=formula&&formulaMode==='tap';
    const full=q?.focusRows&&expandedSheets.has(q.id);
    const rowControl=q?.focusRows?'<div class="focused-sheet-note"><span>'+bi('Row numbers stay the same in this view.','此视图保留原有行号。')+'</span>'+
      btn('toggle-sheet-rows',full?'Show fewer rows':'Show full sheet',full?'显示较少行':'显示完整表格','link','aria-expanded="'+!!full+'"')+'</div>':'';
    return '<div class="sheet-work">'+(def?
      (edits.length>1?'<div class="sub-controls">'+edits.map((x,i)=>'<button type="button" class="btn '+(x.cell===sel?'primary':'')+'" data-edit="'+x.cell+'" aria-pressed="'+(x.cell===sel)+'">'+(i===0?'a. ':'b. ')+btxt('Edit '+x.cell,'编辑 '+x.cell)+'</button>').join('')+'</div>':'')+
      (def.en?'<p class="message">'+bi(def.en,def.zh)+'</p>':'')+
      (formula?'<div class="formula-modes" role="group" aria-label="'+btxt('Formula entry mode','公式输入方式')+'">'+
        '<button type="button" class="btn" data-formula-mode="tap" aria-pressed="'+tap+'">'+btxt('Tap cells','点选单元格')+'</button>'+
        '<button type="button" class="btn" data-formula-mode="type" aria-pressed="'+!tap+'">'+btxt('Type formula','键盘输入')+'</button></div>':'')+
      '<div class="editor"><label for="cell-entry">'+bi('Editing '+sel,'正在编辑 '+sel)+'</label>'+
      (formula?'<p class="formula-reminder" id="formula-reminder">'+bi('Start with =. Use cell addresses, not just the expected number.','以等号 = 开头。请使用单元格地址，不要只输入预期的数字。')+'</p>'+
      '<div class="formula-keys" role="group" aria-label="'+btxt('Formula symbols','公式符号')+'">'+formulaKeys.map(([key,hint,z],i)=>
        '<button type="button" class="btn" data-formula-key="'+esc(key)+'" aria-label="'+esc((key==='back'?'':key+' · ')+hint+(zh?' / '+z:''))+'">'+esc(key==='back'?'⌫':key)+(i<6?'<small>'+bi(hint,z)+'</small>':'')+'</button>').join('')+'</div>':'')+
      '<div class="edit-line"><input id="cell-entry" class="formula-field" maxlength="200" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off" enterkeyhint="done" '+(def.mode==='value'?'inputmode="decimal"':tap?'readonly inputmode="none"':'')+' aria-describedby="'+(formula?'formula-reminder ':'')+'edit-status"><button type="button" id="apply-cell" class="btn">'+btxt('Apply','应用')+'</button></div>'+
      '<p id="edit-status" class="edit-status" role="status"></p></div>':'')+
      rowControl+'<div class="sheet-wrap"><table class="sheet" aria-label="'+esc(zh?'预算电子表格':'Budget spreadsheet')+'"></table></div></div>';
  }
  function mountSheet(data, state, q, sel, store, switchCell){
    const model=q.sheet==='model', group=state[model?'model':'cells'], edits=q.edits||[], def=edits.find(x=>x.cell===sel);
    const editor=$('#cell-entry'), notice=$('#edit-status'), table=$('.sheet'), relevantRows=model?6:data.version==='controls'?3:9, labels=data[model?'modelZh':'buildZh']||{};
    const formula=!!editor&&def.mode!=='value', tap=formula&&formulaMode==='tap';
    let applyIssue=formula?ExamSheet.formulaRequirement(group[sel]?.raw):'';
    if(applyIssue==='blank')applyIssue='';
    const cols=['A','B','C','D'];
    table.innerHTML='<colgroup><col class="axis"><col class="label"><col class="value"><col class="price"><col></colgroup><thead><tr><th aria-label="Row and column"></th>'+cols.map(c=>'<th class="col-head" scope="col">'+c+'</th>').join('')+'</tr></thead><tbody>'+
      Array.from({length:relevantRows},(_,i)=>'<tr'+(q.focusRows&&!q.focusRows.includes(i+1)?' data-extra-row'+(expandedSheets.has(q.id)?'':' hidden'):'')+'><th class="row-head" scope="row">'+(i+1)+'</th>'+cols.map(c=>{
        const addr=c+(i+1), target=edits.some(d=>d.cell===addr);
        const button=tap?'<button type="button" class="source-cell" data-reference="'+addr+'" aria-label="'+esc(zh?'插入单元格 '+addr:'Insert cell '+addr)+'"></button>':
          target?'<button type="button" data-edit="'+addr+'" aria-label="'+esc(zh?'编辑单元格 '+addr:'Edit cell '+addr)+'"></button>':'<span></span>';
        return '<td data-cell="'+addr+'" class="'+(labels[addr]||i===0||c==='A'?'cell-label ':'')+(target?'target ':'')+(sel===addr?'selected ':'')+(model&&addr==='D5'?'output':'')+'">'+button+'</td>';
      }).join('')+'</tr>').join('')+'</tbody>';
    const read=()=>ExamSheet.applied(data,state,model);
    function draw(){
      const cells=read();const v=group?.[sel];
      for(const td of table.querySelectorAll('[data-cell]')){
        const a=td.dataset.cell, showingDraft=!applyIssue&&a===sel&&v&&typeof v.raw==='string'&&v.raw!==(v.applied??data[model?'model':'build'][a]??'');
        const result=ExamSheet.result(cells,a), control=td.firstElementChild;
        td.classList.toggle('draft',!!showingDraft);td.classList.toggle('error',!showingDraft&&!!result.error);
        control.textContent=showingDraft?v.raw:ExamSheet.fmt(result);
        if(zh&&labels[a]){const node=document.createElement('small');node.className='sheet-zh';node.lang='zh-Hans';node.textContent=labels[a];control.append(node);}
      }
    }
    draw();
    const toggle=$('#toggle-sheet-rows');
    if(toggle)toggle.onclick=()=>{
      const expand=!expandedSheets.has(q.id);
      if(expand)expandedSheets.add(q.id);else expandedSheets.delete(q.id);
      for(const row of table.querySelectorAll('[data-extra-row]'))row.hidden=!expand;
      toggle.setAttribute('aria-expanded',String(expand));
      toggle.textContent=decode(expand?btxt('Show fewer rows','显示较少行'):btxt('Show full sheet','显示完整表格'));
    };
    if(!editor)return;
    const starter=data[model?'model':'build'][sel]??'';
    editor.value=group[sel]?.raw??starter;
    function editStatus(){
      const e=group[sel];
      const messages=applyIssue==='equals'?['Enter a formula here, not just a number. Start with =.','请在这里输入公式，而不是只输入数字。以 = 开头。']:
        applyIssue==='reference'?['Include cell addresses from the table so the formula can update.','请使用表格中的单元格地址，这样结果才能自动更新。']:
        !e?(tap?['Tap cells to insert their addresses. Press Enter or tap Apply.','点选单元格以插入其地址。按 Enter 键或点击“应用”。']:['Type here, then tap Apply or press Enter.','在这里输入，然后点击“应用”或按 Enter 键。']):
        e.raw!==(e.applied??starter)?['Not yet applied. Press Enter or tap Apply.','尚未应用。按 Enter 键或点击“应用”。']:
        ExamSheet.result(read(),sel).error?['The sheet displays an error for this entry.','表格显示这次输入有错误。']:['Applied to '+sel+'.','已应用到 '+sel+'。'];
      notice.textContent=decode(btxt(...messages));notice.classList.toggle('error',!!(applyIssue||(e&&e.raw===e.applied&&ExamSheet.result(read(),sel).error)));
    }
    editStatus();
    const recordDraft=()=>{const e=group[sel]??={};applyIssue='';e.raw=editor.value;draw();editStatus();store();};
    editor.oninput=recordDraft;
    const addPart=part=>{
      if(!tap){
        const a=editor.selectionStart??editor.value.length,b=editor.selectionEnd??a;
        if(part==='back')editor.setRangeText('',a===b?Math.max(0,a-1):a,b,'end');
        else if(editor.value.length-(b-a)+part.length<=200)editor.setRangeText(part,a,b,'end');
        editor.focus({preventScroll:true});recordDraft();return;
      }
      if(part==='back'){
        const last=editor.value.match(/(?:[A-D][1-9]|SUM)$/i);
        editor.value=editor.value.slice(0,-(last?.[0].length||1));
      }else{
        if(editor.value.length+part.length>200)return;
        editor.value+=part;
      }
      recordDraft();
    };
    for(const b of main.querySelectorAll('[data-formula-key]'))b.onclick=()=>addPart(b.dataset.formulaKey);
    for(const b of main.querySelectorAll('[data-reference]'))b.onclick=()=>addPart(b.dataset.reference);
    const apply=()=>{
      const e=group[sel]??={}; const beforeRead=model?ExamSheet.fmt(ExamSheet.result(read(),'D5')):'';
      const beforeInput=e.applied??starter;
      const issue=formula?ExamSheet.formulaRequirement(editor.value):'';
      if(issue==='equals'||issue==='reference'){
        applyIssue=issue;e.raw=editor.value;draw();editStatus();store();return;
      }
      applyIssue='';
      e.raw=editor.value;e.applied=editor.value;
      if(model&&beforeInput!==e.applied&&state.modelTrail){
        state.modelTrail.push({beforeInput,afterInput:e.applied,beforeOutput:beforeRead,afterOutput:ExamSheet.fmt(ExamSheet.result(read(),'D5'))});
        state.modelTrail=state.modelTrail.slice(-30);
      }
      draw();editStatus();store();
    };
    $('#apply-cell').onclick=apply;
    if(!tap)editor.onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();apply();}};
    if(tap)tapKeyboard=e=>{
      if(!['Backspace','Delete','Enter'].includes(e.key)||e.isComposing||e.metaKey||e.ctrlKey||e.altKey)return;
      const target=e.target;
      if(target!==document.body&&!main.contains(target))return;
      if(target!==editor&&target.closest?.('input, textarea, select, [contenteditable]'))return;
      if(e.key==='Enter'){
        // Keep ordinary Enter activation on review, navigation and other non-entry controls.
        if(target.closest?.('button:not([data-reference]):not([data-formula-key]):not(#apply-cell)'))return;
        e.preventDefault();
        if(!e.repeat)apply();
      }else{
        e.preventDefault();addPart('back');
      }
    };
    for(const button of main.querySelectorAll('[data-edit]'))button.onclick=()=>{
      const a=button.dataset.edit;
      if(a===sel){if(!tap)editor.focus({preventScroll:true});editor.scrollIntoView({block:'nearest'});}
      else switchCell?.(a);
    };
  }
  function fieldCount(q){
    const stored=answers(q);
    const fields=q.fields.map(f=>stored[f.key]);
    if(q.edits)for(const d of q.edits){
      const raw=draft.cells[d.cell]?.raw;
      fields.push(d.mode==='value'?draft.model[d.cell]?.applied:!ExamSheet.formulaRequirement(raw)?raw:'');
    }
    return fields.map(x=>Array.isArray(x)?x.length>0:!!String(x??'').trim());
  }
  function status(q){
    const counts=fieldCount(q);
    return counts.every(Boolean)?['Answered','已作答','']:counts.some(Boolean)?['Partly answered','部分作答','part']:['Unanswered','未作答','not'];
  }
  function question(focus=true){
    if(locked()){screen=finished?'done':window.ExamCloud?'clock-check':'review';render();return;}
    const q=activeQuestion(), i=draft.index, sec=content.section[q.section];
    if(!q.edits?.some(x=>x.cell===selected))selected=q.edits?.[0]?.cell;
    const nav='<div class="actions"><div class="left">'+btn('back','Back','上一题','',i===0?'disabled':'')+btn('flag',draft.flags[q.id]?'Flagged':'Flag',draft.flags[q.id]?'已标记':'标记',draft.flags[q.id]?'flagged':'','aria-pressed="'+!!draft.flags[q.id]+'"')+'</div><div class="right">'+btn('review','Review questions','检查题目','link')+(i<content.questions.length-1?btn('next','Next','下一题','primary'):'')+'</div></div>';
    const fields='<div class="'+(q.sheet==='model'?'test-fields':'')+'">'+q.fields.map(f=>field(q,f)).join('')+'</div>';
    show(card('<div class="meta"><span class="badge">'+btxt(q.id+' · '+sec.en,q.id+' · '+sec.zh)+'</span><span class="marks">'+btxt('Question '+(i+1)+' / '+content.questions.length+' · '+q.marks+' '+(q.marks===1?'mark':'marks'),'第 '+(i+1)+' 题 · '+q.marks+' 分')+'</span></div>'+
      '<h1 tabindex="-1">'+bi(q.title,q.zh)+'</h1>'+(q.intro?'<p class="intro">'+bi(q.intro,q.introZh)+'</p>':'')+visual(q)+expectedResult(q)+
      (q.lookup?fields:'')+(q.sheet?sheetFrame(q.edits,selected,q):'')+(q.lookup?'':fields)+
      (hasCalculator(q)?calculator(q):'')+
      (workingOn.has(q.id)?'<details class="working"><summary>'+btxt('Working space (optional)','演算区（选填）')+'</summary><p class="message">'+bi('Use this for rough calculations if it helps. Put your final answer in the question above.','如有需要，可以在这里演算。请把最终答案填在上面的题目中。')+'</p><textarea id="scratch" class="textbox" maxlength="800" aria-label="'+esc(zh?'演算区（选填）':'Working space (optional)')+'">'+esc(draft.work[q.id])+'</textarea></details>':'')+nav,'question-card',q.section),focus);
    if(q.sheet) mountSheet(content,draft,q,selected,change,a=>{
      selected=a;question(false);const editor=$('#cell-entry');
      if(editor&&!editor.readOnly)editor.focus({preventScroll:true});
      editor?.scrollIntoView({block:'nearest'});
    });
    for(const b of main.querySelectorAll('[data-formula-mode]'))b.onclick=()=>{
      const mode=b.dataset.formulaMode;
      if(mode!==formulaMode){formulaMode=mode;storage.put('ecofair-formula-mode',mode);document.activeElement?.blur();question(false);}
      if(mode==='type')$('#cell-entry')?.focus({preventScroll:true});
      else main.querySelector('[data-formula-mode="tap"]')?.focus({preventScroll:true});
    };
    bindFields(q);
    if(hasCalculator(q))bindCalculator(q);
    if($('#scratch'))$('#scratch').oninput=e=>{draft.work[q.id]=e.target.value;change();};
    $('#back').onclick=()=>go(i-1);
    if($('#next'))$('#next').onclick=()=>go(i+1);
    $('#flag').onclick=()=>{draft.flags[q.id]=!draft.flags[q.id];change();const control=$('#flag');control.textContent=decode(btxt(draft.flags[q.id]?'Flagged':'Flag',draft.flags[q.id]?'已标记':'标记'));control.setAttribute('aria-pressed',String(!!draft.flags[q.id]));control.classList.toggle('flagged',!!draft.flags[q.id]);};
    $('#review').onclick=()=>{screen='review';render();sync();};
  }
  function go(i){if(locked())return;draft.index=Math.max(0,Math.min(content.questions.length-1,i));selected=null;screen='question';change();render();sync();}
  function summary(){
    const remaining=content.questions.filter(q=>status(q)[2]).length;
    show(card('<p class="eyebrow">'+btxt('FINAL CHECK','最后检查')+'</p><h1 tabindex="-1">'+bi('Review your answers','检查你的答案')+'</h1>'+
      '<p class="intro">'+(expired?bi('Time is up. Your answers are now read-only.','时间到，答案现在只能查看。'):
        bi(remaining?remaining+' '+(remaining===1?'question has':'questions have')+' missing answers. You can return to them or submit what you have.':'Every question has a response. You can still review your work or submit.',remaining?'有 '+remaining+' 道题未答完。你可以返回作答，也可以提交现有答案。':'每道题都有作答。你可以继续检查，也可以提交。'))+'</p>'+
      (error?banner(error,'请保留本页并告诉老师。'):'')+
      '<div class="actions">'+(expired?'':btn('return-q','Return to question','返回题目',''))+btn('submit',mode==='secure'?'Submit test':'Finish preview',mode==='secure'?'提交测验':'结束预览','primary','')+'</div>'+
      '<ul class="review-list">'+content.questions.map((q,i)=>{
        const [en,z,cls]=status(q);
        return '<li><button type="button" class="btn" data-go="'+i+'" '+(expired?'disabled':'')+'><span>'+q.id+' · '+bi(q.title,q.zh)+'</span><span><span class="q-state '+cls+'">'+btxt(en,z)+'</span>'+(draft.flags[q.id]?' <span class="q-state flag">'+btxt('Flagged','已标记')+'</span>':'')+'</span></button></li>';
      }).join('')+'</ul>'));
    for(const b of main.querySelectorAll('[data-go]'))b.onclick=()=>go(+b.dataset.go);
    if($('#return-q'))$('#return-q').onclick=()=>go(draft.index);
    $('#submit').onclick=()=>{if(expired)submit();else{screen='confirm';render();}};
  }
  function confirmScreen(){
    show(card('<p class="eyebrow">'+btxt('FINAL CHECK','最后检查')+'</p><h1 tabindex="-1">'+bi('Submit your answers?','提交你的答案？')+'</h1>'+
      '<p class="intro">'+bi('You won’t be able to edit your answers after submitting.','提交后不能修改答案。')+'</p>'+
      '<div class="actions">'+btn('cancel-submit','Keep reviewing','继续检查')+btn('confirm-submit',mode==='secure'?'Submit now':'Finish preview',mode==='secure'?'现在提交':'结束预览','primary')+'</div>'));
    $('#cancel-submit').onclick=()=>{screen='review';render();};
    $('#confirm-submit').onclick=submit;
  }
  async function submit(){
    if(sending||finished)return;
    sending=true;
    try{
      if(mode==='secure'){
        if(writer)await writer;
        const data=await api('submit',{draft,stamp});
        if(window.ExamCloud&&acceptFinish(data))return;
        finished=data.finished;
        if(data.draft){
          if(data.stamp<stamp)recovery=draft;
          draft=data.draft;stamp=data.stamp;
        }
      }else finished={receipt:null,at:Date.now(),kind:'preview'};
    }catch{
      finished={receipt:null,at:Date.now(),kind:'pending'};
    }finally{
      sending=false;screen='done';persist();render();
    }
  }
  function download(){
    const payload={format:'y7-term12-response-v1',assessment:content?.version||'y7-term12-2026-v4',attemptId:attempt.id,finished:recovery?{receipt:null,at:Date.now(),kind:'deadline-backup'}:finished,draft:recovery||draft};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='Year7-Term12-'+attempt.id+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function done(){
    const receipt=finished?.receipt;
    show(card('<div class="hero-bar" aria-hidden="true"><i></i><i></i><i></i><i></i></div><h1 tabindex="-1">'+(receipt?(finished.kind==='submitted'?bi('Test submitted','测验已提交'):bi('Test closed','测验已结束')):bi(mode==='demo'?'Preview complete':'Saved on this device','已保存在本机'))+'</h1>'+
      (receipt?'<p class="intro">'+(finished.kind==='submitted'?bi('Your teacher has received your test. Show the receipt if asked.','老师已收到你的测验。如有需要，请出示回执。'):bi('Your last online save was kept. Show the receipt to your teacher if asked.','已保留你最后一次在线保存的答案。如有需要，请出示回执。'))+'</p><p class="receipt message">'+esc(receipt)+'</p>':
        banner(mode==='demo'?'This preview did not send any answers. Download a copy to try the teacher viewer.':'No online receipt yet. Keep this page open and tell your teacher. You can retry or save a backup.',mode==='demo'?'预览不会发送答案。可下载副本以试用教师查看页面。':'尚未收到在线回执。请保留本页并告诉老师。可以重试或保存备份。'))+
      (receipt&&recovery?banner('The receipt covers the last online save. Some device changes were not included. Keep a backup and tell your teacher.','回执只包含最后一次在线保存的答案。有些本机修改未包含在内。请保留备份并告诉老师。'):'')+
      '<div class="actions">'+(receipt&&!recovery?'':btn('backup','Download backup','下载备份','primary'))+
      (finished?.kind==='pending'?btn('retry-submit','Retry submission','重新提交',''):'')+
      (receipt&&!recovery?btn('leave','Leave test','离开测验'):mode==='demo'?btn('new-preview','Reset this preview','重置本次预览',''):'')+'</div>'));
    if($('#backup'))$('#backup').onclick=download;
    if($('#retry-submit'))$('#retry-submit').onclick=()=>{finished=null;submit();};
    if($('#new-preview'))$('#new-preview').onclick=()=>{storage.remove(localKey());draft=attempt=finished=recovery=null;expired=false;screen='entry';render();};
    if($('#leave'))$('#leave').onclick=()=>{storage.remove(localKey());storage.remove(sessionKey,true);session=draft=attempt=finished=recovery=null;expired=false;screen='entry';render();};
  }
  function render(){
    displayLang();
    if(screen==='entry')entry();else if(screen==='try')deviceCheck();else if(screen==='question')question();
    else if(screen==='review')summary(); else if(screen==='confirm')confirmScreen();else if(screen==='done')done();
    else if(screen==='clock-check'){
      show(card('<h1 tabindex="-1">'+bi('Checking your test time','正在确认测验时间')+'</h1><p class="message">'+
        bi('Keep this page open. We’re checking whether you have extra time and confirming the last online save. If it cannot connect, tell your teacher.','请保持此页面打开。系统正在检查是否有延长时间，并确认最后一次在线保存。如果无法连接，请告诉老师。')+'</p><div class="actions">'+
        btn('clock-retry','Check again','重新检查')+btn('clock-backup','Download device backup','下载本机备份')+'</div>'));
      $('#clock-retry').onclick=checkClock;
      $('#clock-backup').onclick=()=>{recovery=draft;download();};
    }
  }
  function tick(){
    clock.hidden=!deadline()||finished||screen==='entry'||screen==='try';
    if(clock.hidden)return;
    const secs=Math.max(0,Math.ceil((deadline()-Date.now())/1000));
    clock.textContent=Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0');
    clock.classList.toggle('ending',secs<=300);
    if(window.ExamCloud){
      if(Date.now()>=nextClockCheck){nextClockCheck=Date.now()+(secs<=120?3000:9000);checkClock();}
      if(secs===0&&!expired){
        expired=true;queueMicrotask(()=>{if(!finished&&expired){screen='clock-check';render();checkClock();}});
      }
    }else if(secs===0&&!expired){expired=true;queueMicrotask(()=>{if(!finished){screen='review';render();submit();}});}
  }
  $('#lang').onclick=()=>{zh=!zh;applyLang();render();};
  document.addEventListener('keydown',e=>tapKeyboard?.(e));
  setInterval(tick,500);
  setInterval(sync,1800);
  window.addEventListener('online',()=>{online=true;sync();checkClock();});
  async function start(){
    if(window.ExamCloud||location.protocol!=='file:'){
      try{mode=(await api('info',undefined,'')).mode;}
      catch{mode=session?'secure':'demo';}
    }
    screen='entry';
    if(mode==='secure'&&session){
      try{const data=await api('enter',{},session.code);session={...session,data};enter(data,session);return;}
      catch(e){if(!e.status&&session.data){online=false;enter(session.data,session);return;}storage.remove(sessionKey,true);session=null;}
    }
    render();
  }
  start();
})();
