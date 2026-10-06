/* A classroom control gate, not a server authentication system. */
window.verifyTeacherPin = async function(pin) {
  const salt='3270e358dfd217f5bfa614f757ce701d';
  const expected='6a4f450f1802959d2e551712d4161125742433f36549248eb819d17b80ca1b1e';
  if(!/^\d{6}$/.test(pin)||!window.crypto?.subtle)return false;
  const enc=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:210000,hash:'SHA-256'},key,256);
  const result=Array.from(new Uint8Array(bits),v=>v.toString(16).padStart(2,'0')).join('');
  let difference=0;for(let i=0;i<expected.length;i++)difference|=expected.charCodeAt(i)^result.charCodeAt(i);
  return difference===0;
};
