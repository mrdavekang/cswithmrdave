importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js');
let nextInput;
self.onmessage = async ({data}) => {
  if(data.kind === 'answer'){ if(nextInput) nextInput(data.value); return; }
  const testing = Array.isArray(data.inputs);
  let output = '';
  const inputs = testing ? data.inputs.slice() : [];
  Sk.configure({
    __future__: Sk.python3,
    output: value => { if(output.length + value.length > 20000) throw Error('Too much output. Check your loop.'); output += value; if(!testing) postMessage({kind:'write',value}); },
    read: file => { if(!Object.prototype.hasOwnProperty.call(Sk.builtinFiles.files,file)) throw Error('File unavailable: '+file); return Sk.builtinFiles.files[file]; },
    inputfunTakesPrompt: true,
    inputfun: prompt => {
      if(testing){
        if(!inputs.length) return Promise.reject(Error('The program asked for an extra input.'));
        return Promise.resolve(String(inputs.shift()));
      }
      postMessage({kind:'prompt',value:prompt});
      return new Promise(resolve=>{nextInput=value=>{nextInput=null;resolve(value);};});
    }
  });
  try{ await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,data.code,true)); postMessage({kind:'done',output}); }
  catch(e){ postMessage({kind:'error',value:String(e)}); }
};
