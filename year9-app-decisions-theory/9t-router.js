// Class-specific entry only. Existing Year 9E lesson files and stored work are preserved.
(()=>{'use strict';
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-action="join"]');if(!b||document.querySelector('#student-form')?.value!=='9T')return;
 ev.preventDefault();ev.stopImmediatePropagation();const name=document.querySelector('#student-name')?.value.trim()||'';
 try{sessionStorage.setItem('y9t-studio-entry',JSON.stringify({name,lang:document.querySelector('#language')?.value||'en'}));}catch(_){}
 const u=new URL('9t.html',location.href);u.search=location.search;location.assign(u.href);
},true);
if(new URLSearchParams(location.search).get('class')==='9T'){const u=new URL('9t.html',location.href);u.search=location.search;location.replace(u.href);}
})();
