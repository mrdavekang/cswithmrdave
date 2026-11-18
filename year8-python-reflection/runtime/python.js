(() => {
  const originalSkulpt = window.__BUNDLED_SKULPT__;
  const hostedSys = window.__HOSTED_SKULPT_SYS__;
  if (typeof originalSkulpt !== "string" && typeof hostedSys !== "string") return;
  delete window.__BUNDLED_SKULPT__;
  delete window.__HOSTED_SKULPT_SYS__;
  const program = String.raw`
    self.onmessage = async ({data}) => {
      let output = "";
      const inputs = data.input === "" ? [] : data.input.split(/\r?\n/);
      let next = 0;
      try {
        self.Sk.configure({
          __future__: self.Sk.python3, execLimit: 1500, yieldLimit: 35,
          read: file => {
            if (file === "src/builtin/sys.js") return self.Sk.builtinFiles.files[file];
            throw Error("Imports are not needed in this lesson.");
          },
          output: text => { if ((output += text).length > 2500) throw Error("Too much output."); },
          inputfunTakesPrompt: true, inputfun: prompt => {
            if (output.length + String(prompt || "").length > 2500) throw Error("Too much output.");
            if (prompt) output += String(prompt);
            if (next >= inputs.length) throw Error("No more test input is available.");
            return inputs[next++];
          },
        });
        await self.Sk.misceval.asyncToPromise(() => self.Sk.importMainWithBody("<your code>", false, data.code, true));
        self.postMessage({output});
      } catch (error) { self.postMessage({output: output.slice(0,2500), error: String(error).slice(0,500)}); }
    };
  `;
  const workerFrom = library => new Blob([library, "\n", program], {type:"text/javascript"});
  const workerAsset = typeof originalSkulpt === "string" ? Promise.resolve(workerFrom(originalSkulpt)) :
    fetch("../vendor/skulpt.min.js", {credentials:"omit", redirect:"error", referrerPolicy:"no-referrer"})
      .then(r => { if (!r.ok) throw new Error("Python is not available yet."); return r.text(); })
      .then(library => workerFrom(library+"\nSk.builtinFiles="+JSON.stringify({files:{"src/builtin/sys.js":hostedSys}})+";"), () => null)
      .catch(() => null);
  async function execute(code,input) {
    const asset = await workerAsset;
    if (!asset) return {output:"",error:"Python did not load. Reopen this page, or use the private HTML lesson offline."};
    const url = URL.createObjectURL(asset);
    try {
      return await new Promise(resolve => {
        let w;
        try { w = new Worker(url); }
        catch { resolve({output:"",error:"This viewer cannot run Python. Download this file and open it in a supported browser."}); return; }
        let timeout;
        const finish = result => { clearTimeout(timeout); w.terminate(); resolve(result); };
        timeout = setTimeout(()=>finish({output:"",error:"This run took too long. Try a shorter program."}),2800);
        w.onmessage = event => finish(event.data);
        w.onerror = () => finish({output:"",error:"Could not start Python. Open the downloaded lesson in Chrome, Edge or Safari."});
        w.postMessage({code,input});
      });
    } finally { URL.revokeObjectURL(url); }
  }
  const clean = text => String(text ?? "").replace(/\r\n/g,"\n").replace(/[ \t]+$/gm,"").trim();
  window.runPython = async (code, tests) => {
    if (String(code).length > 8000) return {passed:false,results:[{output:"",expected:"",error:"Please use a short program.",passed:false}]};
    const results = [];
    for (const {input = "", output: expected = ""} of tests.slice(0,4)) {
      const result = await execute(code,input);
      results.push({input,expected,...result,passed:!result.error&&clean(result.output)===clean(expected)});
    }
    return {passed:results.length>0&&results.every(r=>r.passed),results};
  };
})();

