'use strict';
(()=>{
 const V=window.EcoLessonVideos,select=document.querySelector('#videoChoice'),viewer=document.querySelector('#videoViewer');
 if(!V||!select||!viewer)return;
 let controller,language='both';
 for(const v of V.catalogue)select.add(new Option(v.title.en+' / '+v.title.zh,v.id));
 const requested=new URLSearchParams(location.search).get('video');if(V.catalogue.some(v=>v.id===requested))select.value=requested;
 function render(){
  controller?.destroy();const v=V.catalogue.find(v=>v.id===select.value)||V.catalogue[0];
  viewer.innerHTML=V.html(v,{teacher:true,captionLanguage:language});
  viewer.querySelector('details').open=true;
  const note=viewer.querySelector('.lesson-video>.muted');if(note)note.remove();
  viewer.querySelector('#lessonVideoStatus').textContent='Pause or seek as needed. Use Enlarge video for a larger picture. / 可以暂停或拖动进度条。点击“放大视频”观看更大的画面。';
  controller=V.attach(v,{records:{},recordProgress:false,captionLanguage:language,onUpdate(){},onReveal(){},onHelp(){alert('Press Play. Use Enlarge video for a larger picture with subtitles below it. / 点击播放，或使用“放大视频”。字幕会显示在画面下方。');},onLanguage(value){language=value;}});
 }
 if(document.body.dataset.bundle==='true')document.querySelector('#backToLesson').hidden=true;
 select.addEventListener('change',render);render();
})();
