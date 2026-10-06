/* Real CPython/Pyodide. AST adapts top-level input() to asynchronous browser stdin.
   Unlike regex rewriting, strings/comments and original line numbers are retained. */
import {loadPyodide} from './vendor/python/pyodide.mjs';
let py=null,resolveInput=null,current=null,queue=[],silent=false,size=0,capture='',buffer='';
let decoder=new TextDecoder();
function flush(){if(buffer&&!silent)postMessage({type:'output',text:buffer});buffer='';}
self.requestInput=(prompt='')=>{
  flush();
  if(queue.length){const value=String(queue.shift()); if(!silent) postMessage({type:'auto-input',prompt:String(prompt),value}); return Promise.resolve(value);}
  if(silent) return Promise.reject(Error('The program requested another input after the test entries ran out.'));
  postMessage({type:'input',prompt:String(prompt)});
  return new Promise(resolve=>{resolveInput=resolve;});
};
const setup=String.raw`
import ast, inspect, traceback, sys, builtins, json
from js import requestInput
_mission_namespace = {}
_mission_trace = []
async def _mission_input(prompt=''):
    return str(await requestInput(str(prompt)))
class _InputAdapter(ast.NodeTransformer):
    def __init__(self): self.in_function = 0
    def visit_FunctionDef(self, node):
        if any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == 'input' for n in ast.walk(node)):
            raise ValueError('This classroom console supports input() in the main program, not inside functions. Move the input to the main program for this lesson.')
        return node
    visit_AsyncFunctionDef = visit_FunctionDef
    def visit_Call(self, node):
        node = self.generic_visit(node)
        if isinstance(node.func, ast.Name) and node.func.id == 'input':
            node.func = ast.copy_location(ast.Name(id='_mission_input', ctx=ast.Load()), node.func)
            return ast.copy_location(ast.Await(value=node), node)
        return node
def _mission_snapshot(frame=None):
    ns = frame.f_locals if frame else _mission_namespace
    result = {}
    for k,v in ns.items():
        if k.startswith('_') or len(result)>=16: continue
        if isinstance(v,(str,int,float,bool,type(None),list,tuple,dict)):
            result[k]=repr(v)[:180]
    return result
def _mission_tracer(frame,event,arg):
    if frame.f_code.co_filename == 'mission.py' and event == 'line' and len(_mission_trace)<400:
        _mission_trace.append({'line':frame.f_lineno,'values':_mission_snapshot(frame)})
    return _mission_tracer
def _mission_error(error):
    if isinstance(error,SyntaxError):
        line=error.lineno
        text='  File "mission.py", line '+str(line)+'\n'
        if error.text: text+='    '+error.text.strip()+'\n'
        if error.offset: text+='    '+' '*max(0,error.offset-1)+'^\n'
        text+=type(error).__name__+': '+str(error.msg)
    else:
        frames=[f for f in traceback.extract_tb(error.__traceback__) if f.filename=='mission.py']
        line=frames[-1].lineno if frames else None
        text='Traceback (most recent call last):\n' if frames else ''
        for f in frames: text+='  File "mission.py", line '+str(f.lineno)+'\n'
        text+=type(error).__name__+': '+str(error)
    return {'ok':False,'error':text,'line':line,'values':_mission_snapshot(),'trace':_mission_trace.copy()}
async def _mission_execute(source, fresh=True, shell=False, tracing=False, overrides=None, check=False):
    global _mission_namespace, _mission_trace
    _mission_trace=[]
    if fresh:
        _mission_namespace={'__name__':'__main__','__builtins__':builtins.__dict__,'_mission_input':_mission_input}
    try:
        tree=ast.parse(source,filename='mission.py')
        compile(tree,'mission.py','exec')
        while_count=sum(isinstance(n,ast.While) for n in ast.walk(tree))
        has_while=while_count>0
        if check: return {'ok':True,'hasWhile':has_while,'whileCount':while_count,'values':{},'trace':[]}
        # Test boundary substitutions affect the first assignment only; student code is not saved over.
        for name,value in (overrides or {}).items():
            for statement in tree.body:
                if isinstance(statement,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in statement.targets):
                    statement.value=ast.copy_location(ast.Constant(value=value),statement.value)
                    break
        if shell and tree.body and isinstance(tree.body[-1],ast.Expr):
            old=tree.body[-1]
            tree.body[-1]=ast.copy_location(ast.Assign(targets=[ast.Name(id='_shell_result',ctx=ast.Store())],value=old.value),old)
            _mission_namespace['_shell_result']=None
        tree=_InputAdapter().visit(tree)
        ast.fix_missing_locations(tree)
        compiled=compile(tree,'mission.py','exec',flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
        if tracing: sys.settrace(_mission_tracer)
        outcome=eval(compiled,_mission_namespace)
        if inspect.isawaitable(outcome): await outcome
        if shell and _mission_namespace.get('_shell_result') is not None:
            print(repr(_mission_namespace['_shell_result']))
        return {'ok':True,'values':_mission_snapshot(),'trace':_mission_trace.copy(),'hasWhile':has_while,'whileCount':while_count}
    except Exception as error:
        return _mission_error(error)
    finally: sys.settrace(None)
`;
async function init(){
 try{
  py=await loadPyodide({indexURL:new URL('./vendor/python/',import.meta.url).href});
  py.setStdout({raw:n=>{const s=decoder.decode(new Uint8Array([n]),{stream:true});size++;capture+=s;buffer+=s;if(size>24000)throw Error('Output limit reached. Check whether a print is repeating.');if(s==='\n'||buffer.length>=256)flush();}});
  py.setStderr({batched:s=>{if(!silent)postMessage({type:'output',text:String(s)+'\n',error:true});}});
  await py.runPythonAsync(setup);
  postMessage({type:'ready',version:py.runPython('sys.version.split()[0]')});
 }catch(error){postMessage({type:'init-error',error:String(error)});}
}
onmessage=async({data})=>{
 if(data.type==='input'){if(resolveInput){const resolve=resolveInput;resolveInput=null;resolve(String(data.value));}return;}
 if(!py||current)return;
 if(data.type!=='execute')return;
 current=data.id;queue=[...(data.inputs||[])];silent=!!data.silent;size=0;capture='';buffer='';decoder=new TextDecoder();resolveInput=null;
 try{
  py.globals.set('_browser_source',String(data.code));
  py.globals.set('_browser_settings',JSON.stringify({fresh:data.fresh!==false,shell:!!data.shell,tracing:!!data.tracing,overrides:data.override||{},check:!!data.check}));
  const json=await py.runPythonAsync('json.dumps(await _mission_execute(_browser_source, **json.loads(_browser_settings)))');
  flush();postMessage({type:'done',id:current,result:{...JSON.parse(json),output:capture}});
 }catch(error){flush();postMessage({type:'done',id:current,result:{ok:false,error:String(error),output:capture,trace:[],values:{}}});}
 finally{current=null;resolveInput=null;queue=[];silent=false;}
};
init();
