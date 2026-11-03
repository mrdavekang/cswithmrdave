(() => {
  const $=s=>document.querySelector(s),q=new URLSearchParams(location.search);
  if(q.get('embedded')==='1')document.body.classList.add('teacher-slide-embedded');
  const set=Number(q.get('set')),slides=set?LESSON.slides.filter(s=>s.set===set):LESSON.slides;
  let index=Math.min(slides.length-1,Math.max(0,Number(q.get('slide'))||0)),mandarin=q.get('zh')!=='0';
  const following=q.get('follow')==='1';
  function render(){document.body.classList.toggle('no-zh',!mandarin);$('#slide-root').innerHTML=FitnessUI.slide(slides[index]);$('#slide-count').textContent=`${index+1} of ${slides.length}`;$('#prev').disabled=index===0;$('#next').disabled=index===slides.length-1;$('#toggle-zh').setAttribute('aria-pressed',String(mandarin));document.title=slides[index].title+' · TTA teaching';const visual=document.querySelector('[data-enlarge]');const enlarge=()=>{const im=$('#large-image');im.src=visual.dataset.enlarge;im.alt=visual.getAttribute('aria-label');$('#image-view').showModal();};visual?.addEventListener('click',enlarge);visual?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enlarge();}});if(parent!==window)parent.postMessage({type:'fitness-slide',slideId:slides[index].id},location.origin);}
  function choose(id){const i=slides.findIndex(s=>s.id===id);if(i>=0){index=i;render();}}
  $('#prev').onclick=()=>{if(index>0){index--;render();}};$('#next').onclick=()=>{if(index<slides.length-1){index++;render();}};
  $('#toggle-zh').onclick=()=>{mandarin=!mandarin;render();};$('#close-image').onclick=()=>$('#image-view').close();
  $('#fullscreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{alert('Use your browser full-screen command if this window does not allow full screen.');}};
  window.addEventListener('keydown',e=>{if(e.key==='ArrowRight')$('#next').click();if(e.key==='ArrowLeft')$('#prev').click();});
  window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data)return;if(e.data.type==='fitness-select')choose(e.data.slideId);if(e.data.type==='fitness-language'){mandarin=e.data.mandarin;render();}});
  if(following){window.addEventListener('storage',e=>{if(e.key==='fitness-projection'){try{const s=JSON.parse(e.newValue);mandarin=s.mandarin!==false;choose(s.slideId);}catch{}}});try{const s=JSON.parse(localStorage.getItem('fitness-projection'));if(s){mandarin=s.mandarin!==false;choose(s.slideId);}}catch{}}
  render();
})();
