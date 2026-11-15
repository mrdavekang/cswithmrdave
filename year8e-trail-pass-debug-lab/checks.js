(() => {
  const norm=s=>String(s).replace(/\r/g,'').trim().split('\n').map(l=>l.trimEnd()).join('\n');
  function editForTest(code,[before,after]) {
    // Vary the stored data, not a matching hard-coded print line.
    const tokenize=s=>s.match(/"[^"\n]*"|'[^'\n]*'|\w+|[^\s]/g)||[];
    const normalizeToken=s=>/^["']/.test(s)?'"'+s.slice(1,-1)+'"':s;
    const key=s=>tokenize(s).map(normalizeToken).join('\0');
    const lines=code.split('\n');
    const at=lines.findIndex(line=>!/^\s/.test(line)&&key(line.split(/\s+#/)[0])===key(before));
    if(at<0)return null;
    lines[at]=after;
    return lines.join('\n');
  }
  function method(card,code) {
    const clean=code.split('\n').map(l=>l.replace(/("[^"\n]*"|'[^'\n]*')|#.*$/g,(_,value)=>value??'')).join('\n');
    const match={reverse:/\bif\s+height\s*<\s*120\s*:/,cutoff:/\bif\s+height\s*>=\s*cutoff\s*:/,reordered:/\bstatus\s*=\s*\[\s*['"]Ride open['"]\s*,\s*['"]Ask an adult['"]\s*\]/};
    if(card.criterion==='appendStop'&&!/\bstops\s*\.\s*append\s*\(/.test(clean))return 'Your output matches. Now use .append() to add Camp to the existing list.';
    if(card.criterion==='routeLength'&&!/\blen\s*\(\s*stops\s*\)/.test(clean.replace(/"[^"\n]*"|'[^'\n]*'/g,'')))return 'Your output matches. Calculate the count with len(stops) instead of printing a fixed 4.';
    if(card.criterion==='decisionBranches'&&(!/^\s*if\s/m.test(clean)||!/^\s*else\s*:/m.test(clean)))return 'Your output matches. Write an if and an else so both decision paths are visible.';
    if(match[card.criterion]&&!match[card.criterion].test(clean))return 'Check the requested method as well as the output.';
    return '';
  }
  function prepare(code,test) {
    if(test.edit){ code=editForTest(code,test.edit);if(code==null)return null; }
    if(test.probe)code+='\nprint("__trail_probe_ok__" if '+test.probe+' == '+JSON.stringify(test.value)+' else "__trail_probe_bad__")\n';
    return code;
  }
  function judge(data,test,used) {
    let output=norm(data.stdout),stored=true;
    if(test.probe){ const parts=output.split('\n');stored=parts.at(-1)==='__trail_probe_ok__';if(/^__trail_probe_(ok|bad)__$/.test(parts.at(-1)))parts.pop();output=parts.join('\n'); }
    const pass=!data.error&&stored&&used===test.input.length&&norm(test.output)===output;
    return {pass,output,error:data.error,stored,used};
  }
  function errorHint(error) {
    if(!error)return '';
    if(/IndentationError/.test(error))return 'Indent the lines inside if and else. Keep the two headers aligned.';
    if(/SyntaxError/.test(error))return 'Check the line number, then look for a missing colon, bracket, quote or comma.';
    if(/IndexError/.test(error))return 'Read from index 0. The last index is one less than the number of elements.';
    if(/NameError/.test(error))return 'Compare the name on the error line with the name you created above.';
    if(/TypeError/.test(error))return 'Check if a number is still text. Use int() for numeric input, and do not quote a numeric index.';
    if(/ValueError/.test(error))return 'For int(), type a whole number such as 120.';
    return 'Check the error and try one small change.';
  }
  window.TrailChecks={norm,prepare,judge,method,errorHint};
})();
