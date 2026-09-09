/* Skulpt executes real Python syntax locally. An AST allow-list bounds this introductory lab. */
window.PythonLab=(()=>{
  let queue=Promise.resolve();
  const allowed=new Set(['Module','Assign','AugAssign','Expr','Call','Name','Str','Num','BinOp','UnaryOp']);
  function ast(code){
    if(!window.Sk)throw Error('The Python library did not load. Reopen the extracted app; you can still trace on paper and continue.');
    if(code.length>6000)throw Error('Keep this small program under 6,000 characters.');
    Sk.configure({__future__:Sk.python3});
    const parsed=Sk.parse('badge.py',code+'\n');const root=Sk.astFromParse(parsed.cst,'badge.py',parsed.flags);
    function walk(n){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(walk);return}if(!n._astname)return;
      if(!allowed.has(n._astname))throw Error('This Week 3 lab runs assignments, text, whole numbers, arithmetic and print(). Other Python features are outside this lesson; you can continue with support.');
      if(n._astname==='Call'&&(n.func._astname!=='Name'||n.func.id.v!=='print'))throw Error('Use print() for output in this lesson. You do not need input(), imports or device commands here.');
      if(n._astname==='Name'&&n.id.v.startsWith('__'))throw Error('Choose a simple meaningful variable name, such as score.');
      if(n._astname==='BinOp'&&!['Add','Sub'].includes(n.op?.prototype?._astname))throw Error('This short lab uses addition and subtraction. Other arithmetic is outside today’s tasks.');
      if(n._astname==='Num'&&Math.abs(n.n.v)>1000000)throw Error('Use a small whole-number score for this badge task.');
      if(n._astname==='Str'&&n.s.v.length>1000)throw Error('Use a short message for your badge.');
      for(const v of Object.values(n))walk(v);
    }walk(root);return root;
  }
  async function execute(code){
    try{ast(code);let output='';Sk.configure({__future__:Sk.python3,execLimit:1200,yieldLimit:100,output:s=>{output+=s;if(output.length>12000)throw Error('The output is too long for this short badge task.');},read:path=>{if(Sk.builtinFiles?.files[path]!==undefined)return Sk.builtinFiles.files[path];throw Error('The local Python file is unavailable: '+path);},inputfun:()=>{throw Error('Use the starting values supplied in the task.');}});
      const mod=await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<badge>',false,code+'\n',true));const values={};for(const [k,v] of Object.entries(mod.$d))if(!k.startsWith('__')){try{values[k]=Sk.ffi.remapToJs(v)}catch{}}
      return{ok:true,output,values};
    }catch(e){const raw=String(e);let hint='Check the highlighted line or compare it with the reference. You can revise your code and run again.';
      if(/NameError/.test(raw))hint='A name has not been assigned yet. Check spelling and capital letters; put the assignment before the line that uses it.';
      if(/TypeError/.test(raw))hint='Check your data types. A score used in addition should be an integer such as 2, not text such as "2".';
      if(/SyntaxError|TokenError/.test(raw))hint='Check quotation marks, brackets and the assignment sign (=). Ordinary spaces before print brackets are allowed.';
      return{ok:false,output:'',error:raw,hint};
    }
  }
  function serial(fn){const next=queue.then(fn,fn);queue=next.catch(()=>{});return next}
  const lines=s=>s.replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);
  function seed(root,name){return root.body.find(n=>n._astname==='Assign'&&n.targets.length===1&&n.targets[0].id?.v===name)}
  function replaceSeed(code,name,value){const root=ast(code),n=seed(root,name);if(!n)throw Error('Keep an initial assignment for '+name+' so the test can try another starting value.');
    const other=root.body.find(x=>x!==n&&x.lineno===n.lineno);if(other)throw Error('Put each instruction on its own line so you can trace and test it clearly.');
    const next=root.body[root.body.indexOf(n)+1],a=code.split('\n');const end=next?next.lineno-1:a.length;a.splice(n.lineno-1,end-(n.lineno-1),name+' = '+JSON.stringify(value));return a.join('\n');}
  async function check(id,code){
    const tests=[];const result=await execute(code);if(!result.ok)return{...result,passed:false,tests};
    const root=ast(code),nameSeed=seed(root,'badge_name');
    function add(label,pass,detail){tests.push({label,pass,detail})}
    if(id==='fix'){
      add('Display the stored nickname',lines(result.output).join('\n')==='NOVA','Expected NOVA. Quoted variable names print as text.');
      add('Keep badge_name as the supplied string',nameSeed?.value?.s?.v==='NOVA','Keep badge_name = "NOVA" at the start.');
      const variant=await execute(replaceSeed(code,'badge_name','ECHO'));
      add('Use the variable, not a fixed printout',variant.ok&&lines(variant.output).join('\n')==='ECHO','When the stored nickname changes to ECHO, the output should become ECHO too.');
    }else if(id==='award'||id==='bonus'){
      const scoreSeed=seed(root,'score'),nick=nameSeed?.value?.s?.v;
      add('Store a string nickname and integer starting score',typeof nick==='string'&&scoreSeed?.value?.n?.v===2,'Start with badge_name as text and score = 2 (without quotes).');
      if(id==='bonus')add('Store a bonus variable',seed(root,'bonus')?.value?.n?.v===3,'Begin with bonus = 3.');
      for(const [start,bonus]of(id==='bonus'?[[2,3],[2,5],[5,3]]:[[2,3],[5,3],[0,3]])){
        let variant=replaceSeed(code,'score',start);if(id==='bonus')variant=replaceSeed(variant,'bonus',bonus);
        const r=await execute(variant),want=[nick,String(start+bonus)],got=lines(r.output);
        add('Starting score '+start+(id==='bonus'?', bonus '+bonus:'')+' → '+(start+bonus),r.ok&&JSON.stringify(got)===JSON.stringify(want)&&r.values.score===start+bonus,r.ok?'Expected '+want.join(' / ')+'. Your program displayed '+(got.join(' / ')||'nothing')+'. Update the score variable before printing.':r.hint);
      }
    }else if(id==='message'){
      const msg=seed(root,'welcome_message')?.value?.s?.v;
      add('Store a short welcome_message string',typeof msg==='string'&&msg.trim().length>0,'Assign your own short string to welcome_message.');
      add('Display the stored message',typeof msg==='string'&&lines(result.output).includes(msg),'Use the variable in print(), not its name in quotation marks.');
      if(msg!==undefined){const r=await execute(replaceSeed(code,'welcome_message','HELLO YEAR 8'));add('Still work when the message changes',r.ok&&lines(r.output).includes('HELLO YEAR 8'),'Changing the stored message should change the output.');}
    }
    return{...result,tests,passed:tests.length>0&&tests.every(t=>t.pass)};
  }
  return{run:code=>serial(()=>execute(code)),test:(id,code)=>serial(async()=>{try{return await check(id,code)}catch(e){return{ok:false,passed:false,output:'',tests:[],error:String(e),hint:'Keep one instruction per line and the named starting variables. Ask for support if needed; navigation is not locked.'}}}),ast};
})();
