window.FitnessTeacherAuth=(()=>{
  const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const read=async key=>{const b=TEACHER_BUNDLE,data=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(b.iv)},key,bytes(b.data));return JSON.parse(new TextDecoder().decode(data));};
  const unlock=async pass=>{if(!crypto.subtle)throw Error('Open the lesson on GitHub Pages or localhost in a current browser.');const b=TEACHER_BUNDLE,raw=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']),key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(b.salt),iterations:b.iterations,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['decrypt']);return {key,guide:await read(key)};};
  return {bytes,read,unlock};
})();
