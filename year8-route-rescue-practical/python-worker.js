importScripts('vendor/skulpt.min.js','vendor/skulpt-stdlib.js','analysis.js');
let inputResolve;
function analyse(code){
  const result={lists:[],updates:[],prints:[],reads:[],other:[]};
  const str=v=>v?.v??v;
  const kind=n=>n?._astname;
  const literal=n=>kind(n)==='Str'?str(n.s):kind(n)==='Num'?str(n.n):null;
  const sub=n=>({name:str(n?.value?.id),index:literal(n?.slice?.value)});
  const ast=Sk.astFromParse(Sk.parse('route.py',code).cst,'route.py');
  for(const n of ast.body||[]){
    if(kind(n)==='Assign'){
      for(const t of n.targets||[]){
        if(kind(t)==='Name'&&kind(n.value)==='List')result.lists.push({name:str(t.id),elements:n.value.elts.map(literal),line:n.lineno});
        if(kind(t)==='Subscript')result.updates.push({...sub(t),value:literal(n.value),source:kind(n.value)==='Subscript'?sub(n.value):null,line:n.lineno});
      }
    }
    if(kind(n)==='Expr'&&kind(n.value)==='Call'&&str(n.value.func?.id)==='print'){
      result.prints.push({line:n.lineno,args:n.value.args.map(a=>kind(a)==='Subscript'?{...sub(a),type:'index'}:kind(a)==='Name'?{name:str(a.id),type:'whole'}:{type:'literal',value:literal(a)})});
    }
  }
  return result;
}
onmessage=async({data})=>{
  if(data.type==='input'){inputResolve?.(data.value);inputResolve=null;return;}
  let stdout='';
  Sk.configure({output:s=>{stdout+=s;if(stdout.length>12000)throw new Error('Output limit reached.');postMessage({type:'output',text:s});},read:n=>{if(!Sk.builtinFiles?.files[n])throw new Error('Module unavailable in this classroom interpreter: '+n);return Sk.builtinFiles.files[n];},__future__:Sk.python3,execLimit:2500,yieldLimit:30,inputfun:p=>{postMessage({type:'input',prompt:String(p)});return new Promise(r=>{inputResolve=r;});},inputfunTakesPrompt:true});
  try{
    const analysis=RouteAnalyse(data.code);
    const module=await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<stdin>',false,data.code,true));
    const vars={};for(const[n,v]of Object.entries(module.$d))if(!n.startsWith('_'))try{const x=Sk.ffi.remapToJs(v);if(x===null||['string','number','boolean'].includes(typeof x)||Array.isArray(x))vars[n]=x;}catch{}
    postMessage({type:'done',stdout,vars,analysis,error:null});
  }catch(e){postMessage({type:'done',stdout,vars:{},analysis:null,error:String(e)});}
};
