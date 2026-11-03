/* Edited-line guidance only. No recording, database fields or pupil-code mutation. */
window.GameCodeFocus = (() => {
  'use strict';
  const editors=new WeakMap(),readers=new Map();
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function changed(before,after){
    if(before===after)return [];
    const a=String(before).split('\n'),b=String(after).split('\n');let first=0,oldEnd=a.length-1,newEnd=b.length-1;
    while(first<=oldEnd&&first<=newEnd&&a[first]===b[first])first++;
    while(oldEnd>=first&&newEnd>=first&&a[oldEnd]===b[newEnd]){oldEnd--;newEnd--;}
    if(newEnd<first)return [Math.min(first+1,b.length)];
    return Array.from({length:newEnd-first+1},(_,i)=>first+i+1);
  }
  function caret(el){const start=el.selectionStart||0,end=el.selectionEnd||start,from=el.value.slice(0,start).split('\n').length,to=el.value.slice(0,end>start&&el.value[end-1]==='\n'?end-1:end).split('\n').length;return Array.from({length:Math.max(1,to-from+1)},(_,i)=>from+i);}
  const label=(lines,verb)=>lines.length?verb+' '+(lines.length===1?'line '+lines[0]:'lines '+lines[0]+'–'+lines.at(-1)):'Teacher code · line numbers';
  function update(el,edited=false){
    const s=editors.get(el);if(!s)return;
    if(s.code!==el.value){s.lines=edited?changed(s.code,el.value):caret(el);s.code=el.value;}else if(!edited)s.lines=caret(el);
    const cs=getComputedStyle(el);for(const p of ['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','paddingTop','paddingBottom','paddingLeft','paddingRight','borderTopWidth','borderLeftWidth','borderRightWidth','borderBottomWidth'])s.mirror.style[p]=cs[p];
    s.mirror.style.width=(el.clientWidth+(parseFloat(cs.borderLeftWidth)||0)+(parseFloat(cs.borderRightWidth)||0))+'px';s.mirror.style.height=(el.clientHeight+(parseFloat(cs.borderTopWidth)||0)+(parseFloat(cs.borderBottomWidth)||0))+'px';
    s.mirror.innerHTML=el.value.split('\n').map((line,i)=>'<span class="gc-focus-mirror-row '+(s.lines.includes(i+1)?'is-editing':'')+'">'+esc(line||' ')+'</span>').join('');
    s.mirror.scrollTop=el.scrollTop;s.mirror.scrollLeft=el.scrollLeft;
    const text=label(s.lines,'Editing');if(s.caption.textContent!==text)s.caption.textContent=text;
  }
  function attach(el){
    if(!el||editors.has(el))return;
    const wrap=document.createElement('div'),mirror=document.createElement('pre'),caption=document.createElement('small'),cs=getComputedStyle(el);
    wrap.className='gc-focus-editor';wrap.style.margin=cs.margin;mirror.className='gc-focus-mirror';mirror.setAttribute('aria-hidden','true');caption.className='gc-focus-caption';caption.setAttribute('role','status');
    el.before(wrap);wrap.append(mirror,el);wrap.after(caption);el.style.margin='0';el.wrap='off';el.classList.add('gc-focus-input');
    editors.set(el,{mirror,caption,code:el.value,lines:caret(el)});
    el.addEventListener('input',()=>update(el,true));for(const name of ['click','focus'])el.addEventListener(name,()=>update(el));
    el.addEventListener('select',()=>{if(el.selectionStart!==el.selectionEnd)update(el);});
    el.addEventListener('keyup',e=>{if(/^(Arrow|Home|End|Page)/.test(e.key))update(el);});
    el.addEventListener('scroll',()=>{mirror.scrollTop=el.scrollTop;mirror.scrollLeft=el.scrollLeft;});
    if(typeof ResizeObserver!=='undefined')try{const observer=new ResizeObserver(()=>update(el,true));observer.observe(el);editors.get(el).observer=observer;}catch{/* Focus/input still refresh the overlay in restricted webviews. */}update(el);
  }
  function paint(pre,code,{key='teacher-demo',lines}={}){
    if(!pre)return;code=String(code||'');const previous=readers.get(key);
    let marks=Array.isArray(lines)?lines:previous?(previous.code===code?previous.lines:changed(previous.code,code)):[];
    const count=code.split('\n').length;marks=[...new Set(marks)].filter(n=>Number.isInteger(n)&&n>0&&n<=count);
    readers.set(key,{code,lines:marks});if(readers.size>40)readers.delete(readers.keys().next().value);
    const signature=JSON.stringify([code,marks]);if(pre.dataset.focusSignature===signature)return;pre.dataset.focusSignature=signature;pre.classList.add('gc-focus-reader');
    pre.innerHTML=code.split('\n').map((line,i)=>'<span class="gc-focus-line '+(marks.includes(i+1)?'is-edited':'')+'" data-line="'+(i+1)+'">'+esc(line||' ')+'</span>').join('\n');
    let caption=pre.previousElementSibling;if(!caption?.classList.contains('gc-focus-caption')){caption=document.createElement('small');caption.className='gc-focus-caption';caption.setAttribute('role','status');pre.before(caption);}caption.textContent=label(marks,Array.isArray(lines)?'Teacher focus ·':'Teacher edited');
  }
  return {attach,update,paint,changed,activeLines:el=>{update(el,true);return [...(editors.get(el)?.lines||caret(el))];}};
})();
