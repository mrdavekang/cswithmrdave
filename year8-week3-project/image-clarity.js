/* Local lesson image viewer: fit, zoom and keyboard-accessible close. */
(()=>{'use strict';
 const dialog=document.createElement('dialog');dialog.className='clarity-viewer';dialog.setAttribute('aria-label','Enlarged lesson guide');
 dialog.innerHTML='<div class="clarity-toolbar"><button type="button" data-zoom="fit">Fit image</button><button type="button" data-zoom="1">100%</button><button type="button" data-zoom="1.5">150%</button><button type="button" data-zoom="2">200%</button><a target="_blank" rel="noopener" class="clarity-original">Open original</a><button type="button" data-close>Close ✕</button></div><p class="clarity-description"></p><div class="clarity-scroll" tabindex="0" aria-label="Image area; scroll to inspect an enlarged guide"><img alt=""></div>';
 document.body.append(dialog);let returnFocus=null;
 const img=dialog.querySelector('img'),area=dialog.querySelector('.clarity-scroll');
 function zoom(value){const fit=Math.min(img.naturalWidth||1000,area.clientWidth||1000);img.style.width=(value==='fit'?fit:(img.naturalWidth||1000)*Number(value))+'px';dialog.querySelectorAll('[data-zoom]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zoom===value)));}
 img.onload=()=>zoom('fit');img.onerror=()=>{dialog.querySelector('.clarity-description').textContent='This image could not be opened. Close this guide and use the written instructions.';};
 dialog.addEventListener('click',e=>{const z=e.target.closest('[data-zoom]');if(z)zoom(z.dataset.zoom);if(e.target.closest('[data-close]'))dialog.close();});
 dialog.addEventListener('close',()=>returnFocus?.focus());
 const selector='.image-button[data-image], .guide-figure a, .guide-figure > img, img.picture';
 function prepare(){document.querySelectorAll('.guide-figure > img, img.picture').forEach(im=>{im.tabIndex=0;im.setAttribute('role','button');im.setAttribute('aria-label','Enlarge: '+im.alt);im.title='Select to enlarge';});}
 new MutationObserver(prepare).observe(document.getElementById('app'),{childList:true,subtree:true});prepare();
 document.addEventListener('keydown',e=>{if(e.target.matches('.guide-figure > img, img.picture')&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.click();}});
 document.addEventListener('click',e=>{const trigger=e.target.closest(selector);if(!trigger)return;const original=trigger.matches('img')?trigger:trigger.querySelector('img');if(!original||!original.getAttribute('src')?.startsWith('assets/'))return;e.preventDefault();e.stopImmediatePropagation();returnFocus=trigger;img.src=original.src;img.alt=original.alt;dialog.querySelector('.clarity-original').href=original.src;dialog.querySelector('.clarity-description').textContent=original.alt+' — Choose a zoom level, then scroll to see the whole guide.';dialog.showModal();zoom('fit');},true);
})();
