(() => {
  const norm=s=>String(s).replace(/\r/g,'').trim().split('\n').map(l=>l.trimEnd()).join('\n');
  const casesFor=cases=>cases.filter(t=>!t.edit);
  const items=/(?:'([^'\\]*)'|"([^"\\]*)")/g;
  function matchingLine(actual,expected){
    if(actual===expected)return true;
    // Allow ordinary quote and separator spacing differences for flat text lists.
    const list=/^\[\s*(?:(?:'[^'\\]*'|"[^"\\]*")(?:\s*,\s*(?:'[^'\\]*'|"[^"\\]*"))*\s*,?)?\s*\]$/;
    if(!list.test(actual)||!list.test(expected))return false;
    const values=line=>JSON.stringify(Array.from(line.matchAll(items),m=>m[1]??m[2]));
    return values(actual)===values(expected);
  }
  function judge(data,test) {
    const output=norm(data.stdout??'');
    const lines=s=>norm(s).split('\n').map(l=>l.trim()).filter(Boolean);
    const actual=lines(output),expected=lines(test.output);
    const pass=!data.error&&actual.length===expected.length&&actual.every((line,i)=>matchingLine(line,expected[i]));
    return {pass,output,error:data.error};
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
  window.TrailChecks={norm,casesFor,judge,errorHint};
})();
