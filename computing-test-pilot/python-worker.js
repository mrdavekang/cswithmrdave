"use strict";
importScripts("vendor/skulpt.min.js", "vendor/skulpt-stdlib.js");

self.onmessage = async ({ data }) => {
  let output = "";
  const input = data.input.replace(/\r/g, "").split("\n");
  try {
    Sk.configure({
      __future__: Sk.python3,
      execLimit: 3000,
      yieldLimit: 30,
      output(text) {
        output += text;
        if (output.length > 10000) throw Error("Output limit reached.");
      },
      read(name) {
        const source = Sk.builtinFiles?.files[name];
        if (source == null) throw Error("Module unavailable: " + name);
        return source;
      },
      inputfunTakesPrompt: true,
      inputfun(prompt) {
        const value = input.shift();
        if (value === undefined) throw Error("Enter another line of sample input.");
        output += prompt + value + "\n";
        return value;
      },
    });
    await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<student>", false, data.code, true));
    postMessage({ output });
  } catch (error) {
    postMessage({ output: output.slice(0, 10000), error: String(error) });
  }
};
