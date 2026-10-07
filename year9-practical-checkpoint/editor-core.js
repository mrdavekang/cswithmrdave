'use strict';
// Pure editing operations; never insert inferred names, commands or corrections.
const EditorCore={
 newline(text,start,end){const before=text.slice(0,start);const line=before.slice(before.lastIndexOf('\n')+1);const spaces=(line.match(/^ */)||[''])[0];let quote=null,escaped=false,comment=line.length;for(let i=0;i<line.length;i++){const c=line[i];if(escaped){escaped=false;continue;}if(quote){if(c==='\\')escaped=true;else if(c===quote)quote=null;}else if(c==='"'||c==="'")quote=c;else if(c==='#'){comment=i;break;}}const code=line.slice(0,comment).trimEnd();const insert='\n'+spaces+(!quote&&code.endsWith(':')?'    ':'');return {text:text.slice(0,start)+insert+text.slice(end),start:start+insert.length,end:start+insert.length};},
 indent(text,start,end,dedent=false){
  if(start===end&&!dedent){const line=text.slice(0,start).split('\n').pop();const n=4-(line.length%4);return{text:text.slice(0,start)+' '.repeat(n)+text.slice(end),start:start+n,end:start+n};}
  const first=text.lastIndexOf('\n',start-1)+1;const selectedEnd=end>start&&text[end-1]==='\n'?end-1:end;let last=text.indexOf('\n',selectedEnd);if(last<0)last=text.length;
  const block=text.slice(first,last);let deltaStart=0,delta=0;const result=block.split('\n').map((line,i)=>{const remove=Math.min(4,(line.match(/^ */)||[''])[0].length);const d=dedent?-remove:4;if(!i)deltaStart=d;delta+=d;return dedent?line.slice(remove):'    '+line;}).join('\n');
  return{text:text.slice(0,first)+result+text.slice(last),start:Math.max(first,start+deltaStart),end:Math.max(first,end+delta)};
 },
 backspace(text,start,end){if(start!==end||!start)return null;const line=text.slice(0,start).split('\n').pop();if(!/^ +$/.test(line))return null;const n=line.length%4||4;return{text:text.slice(0,start-n)+text.slice(end),start:start-n,end:start-n};}
};
if(typeof module!=='undefined')module.exports=EditorCore;
