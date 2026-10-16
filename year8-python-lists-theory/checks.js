window.ListsChecks = (() => {
  const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
  // Remove comments without removing a # inside a quoted string.
  function clean(source) {
    let out='', quote='', escape=false, comment=false;
    for (const ch of source) {
      if(ch==='\n'){comment=false;out+=ch;continue;}
      if(comment)continue;
      if(quote){out+=ch;if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch===quote)quote='';}
      else if(ch==='"'||ch==="'"){quote=ch;out+=ch;}
      else if(ch==='#')comment=true;else out+=ch;
    }
    return out;
  }
  function lines(result){return (result.stdout||'').trim().split('\n').map(s=>s.trim()).filter(Boolean);}
  function listLine(line,expected){try{return same(JSON.parse(line.replace(/'/g,'"')),expected);}catch{return false;}}
  function evaluate(id, source, r) {
    if(r.error) return {ok:false, message:'Python reported an error. Read the last console line, make one change and run again. You can still save this attempt and continue for help.'};
    const c=clean(source), list=r.vars?.rescue_kit, out=lines(r);
    const original=['torch','map','water'], changed=['torch','compass','water'];
    const defined=/\brescue_kit\s*=\s*\[\s*["']torch["']\s*,\s*["']map["']\s*,\s*["']water["']\s*\]/.test(c);
    const update=/\brescue_kit\s*\[[^\]\n]+\]\s*=/.test(c);
    const indexedPrint=/\bprint\s*\(\s*rescue_kit\s*\[/.test(c);
    let ok=false, message='';
    switch(id){
      case 'create':ok=same(list,original);message='Create rescue_kit with exactly torch, map, water, in that order. Use quoted strings inside square brackets.';break;
      case 'print':ok=same(list,original)&&out.some(x=>listLine(x,original))&&/print\s*\(\s*rescue_kit\s*\)/.test(c);message='Keep the original three items and print the complete list using its name.';break;
      case 'read':ok=same(list,original)&&same(out,['torch','water'])&&indexedPrint;message='Print torch then water on separate lines. Read them through rescue_kit indexes, not hard-coded strings.';break;
      case 'replace':case 'order':ok=defined&&update&&same(list,changed)&&same(out.length?[out[out.length-1]]:[],out)&&out.length===1&&listLine(out[0],changed);message='Keep the original list, replace only map through an indexed assignment, then print the updated list once.';break;
      case 'independent':ok=defined&&update&&same(list,changed)&&out.length===3&&listLine(out[0],original)&&listLine(out[1],changed)&&out[2]==='compass'&&indexedPrint;message='Check the order: original list output, then updated list output, then compass read by index. Preserve torch and water.';break;
      case 'range':ok=same(list,['torch','map','water','radio'])&&same(out,['radio'])&&indexedPrint;message='Keep all four items and use an index to print only radio. The last valid index is 3.';break;
      case 'mountain':{
        const start=['torch','map','water','radio','blanket'], middle=['torch','compass','water','radio','medical kit'], end=['torch','compass','water','satellite phone','medical kit'];
        ok=out.length===3&&listLine(out[0],start)&&listLine(out[1],middle)&&listLine(out[2],end)&&same(list,end)&&update;
        message='Show three full-list outputs: original; compass + medical kit; then satellite phone. Use indexed replacements rather than rebuilding the list.';break;
      }
      case 'swap':ok=same(r.vars?.kit,['radio','map','water','torch'])&&out.length===1&&listLine(out[0],r.vars.kit)&&!/\bkit\s*=/.test(c);message='Keep the supplied kit. Swap only first and last, preserve the middle, then print kit. Save a value before overwriting it.';break;
      case 'while':ok=Array.isArray(list)&&list.length===4&&same(out,list.map(String))&&/\bwhile\b/.test(c)&&indexedPrint;message='Use a while loop with an index counter to print each of the four items exactly once. Stop before index 4.';break;
    }
    return {ok,message:ok?'Your code meets this card’s checks. Compare the output with the goal and make sure you can explain the index.':message};
  }
  return {clean,evaluate,same,listLine};
})();
