import {loadPyodide} from './vendor/python/pyodide.mjs';
let python,control,bytes,signal,current=null,request=0,inputs=0,size=0;
let decoders={stdout:new TextDecoder(),stderr:new TextDecoder()};
function write(stream,data){const text=decoders[stream].decode(data,{stream:true}),room=Math.max(0,12000-size);size+=text.length;if(current!==null&&room>0&&text)postMessage({type:'output',id:current,stream,text:text.slice(0,room)});if(size>12000&&room>0){signal[0]=2;python.checkInterrupt();}return data.length;}
function stdin(){
  if(++inputs>100)throw Error('This run reached the 100-input lesson limit.');
  const req=++request;Atomics.store(control,1,0);Atomics.store(control,2,current);Atomics.store(control,3,req);Atomics.store(control,0,0);
  postMessage({type:'input-request',id:current,request:req});
  while(true){python.checkInterrupt();const state=Atomics.load(control,0);if(state===1&&Atomics.load(control,2)===current&&Atomics.load(control,3)===req){const value=new TextDecoder().decode(bytes.slice(0,Atomics.load(control,1)));Atomics.store(control,0,4);postMessage({type:'input-used',id:current,value});write('stdout',new TextEncoder().encode(value+'\n'));return value;}Atomics.wait(control,0,0,50);}
}
const setup=String.raw`
import builtins as _b, json as _j, traceback as _tb, linecache as _lc, sys as _sys, code as _code, ast as _ast
_streams = (_sys.stdin, _sys.stdout, _sys.stderr)
_ns = {'__name__': '__main__', '__builtins__': dict(vars(_b))}
class _LessonConsole(_code.InteractiveConsole):
    failed = False
    def showsyntaxerror(self, filename=None):
        self.failed = True
        super().showsyntaxerror(filename)
    def showtraceback(self):
        self.failed = True
        super().showtraceback()
_console = _LessonConsole(locals=_ns, filename='<Shell>')
def _analyse(source):
    tree = _ast.parse(source)
    facts = {'lists': [], 'updates': [], 'loops': [], 'accumulators': [], 'counters': [], 'calls': []}
    constants = {}
    def literal(node):
        try: return _ast.literal_eval(node)
        except (ValueError, TypeError, SyntaxError): return constants.get(node.id) if isinstance(node, _ast.Name) else None
    def named(node, name): return isinstance(node, _ast.Name) and node.id == name
    def name(node): return node.id if isinstance(node, _ast.Name) else None
    for node in tree.body:
        if isinstance(node, _ast.Assign):
            for target in node.targets:
                if isinstance(target, _ast.Name):
                    value = literal(node.value)
                    constants[target.id] = value
                    if isinstance(value, list): facts['lists'].append({'name': target.id, 'values': value})
    facts['calls'] = list({name(n.func) for n in _ast.walk(tree) if isinstance(n, _ast.Call) and name(n.func)})
    def initialised_before(variable, loop):
        return any(isinstance(n, _ast.Assign) and n.lineno < loop.lineno and any(named(t, variable) for t in n.targets) and literal(n.value) == 0 for n in tree.body)
    def printed_after(variable, loop):
        return any(isinstance(n, _ast.Expr) and isinstance(n.value, _ast.Call) and named(n.value.func, 'print') and n.lineno > loop.end_lineno and any(named(a, variable) for a in n.value.args) for n in tree.body)
    for node in _ast.walk(tree):
        if isinstance(node, _ast.Assign):
            for target in node.targets:
                if isinstance(target, _ast.Subscript) and isinstance(target.value, _ast.Name):
                    facts['updates'].append({'list': target.value.id, 'index': literal(target.slice), 'value': literal(node.value), 'line': node.lineno})
        if not isinstance(node, _ast.For): continue
        current = name(node.target)
        facts['loops'].append({'target': current, 'iterable': name(node.iter), 'line': node.lineno})
        for item in _ast.walk(node):
            variable, increment = None, None
            if isinstance(item, _ast.Assign) and len(item.targets) == 1 and isinstance(item.targets[0], _ast.Name):
                variable = item.targets[0].id
                rhs = item.value
                if isinstance(rhs, _ast.BinOp) and isinstance(rhs.op, _ast.Add):
                    if named(rhs.left, variable): increment = rhs.right
                    elif named(rhs.right, variable): increment = rhs.left
            elif isinstance(item, _ast.AugAssign) and isinstance(item.op, _ast.Add) and isinstance(item.target, _ast.Name):
                variable, increment = item.target.id, item.value
            if not variable or increment is None: continue
            reset_inside = any(isinstance(x, _ast.Assign) and any(named(t, variable) for t in x.targets) and literal(x.value) == 0 for x in _ast.walk(node))
            base = {'name': variable, 'line': item.lineno, 'initialisedBefore': initialised_before(variable, node) and not reset_inside, 'printedAfter': printed_after(variable, node)}
            if named(increment, current): facts['accumulators'].append(base)
            if literal(increment) != 1: continue
            for selection in _ast.walk(node):
                if not isinstance(selection, _ast.If): continue
                condition = selection.test
                if not (isinstance(condition, _ast.Compare) and len(condition.ops) == 1 and isinstance(condition.ops[0], _ast.GtE) and named(condition.left, current)): continue
                # The update must be in the True body, not the ELSE body.
                if not any(item is part for statement in selection.body for part in _ast.walk(statement)): continue
                facts['counters'].append({**base, 'threshold': literal(condition.comparators[0])})
    return facts
def _execute(source, kind):
    global _ns, _console
    _sys.stdin, _sys.stdout, _sys.stderr = _streams
    try:
        if kind == 'repl':
            _console.failed = False
            more = _console.push(source)
            return {'ok': not _console.failed, 'more': more, 'error': 'Shell error: see the diagnostic above.' if _console.failed else ''}
        if kind == 'cancel':
            _console.resetbuffer()
            print('KeyboardInterrupt')
            return {'ok': False, 'stopped': True, 'error': 'Interrupted. Your variables are kept.'}
        _ns = {'__name__': '__main__', '__builtins__': dict(vars(_b))}
        _console = _LessonConsole(locals=_ns, filename='<Shell>')
        _lc.cache['student.py'] = (len(source), None, source.splitlines(True), 'student.py')
        facts = _analyse(source)
        exec(compile(source, 'student.py', 'exec'), _ns, _ns)
        return {'ok': True, 'analysis': facts}
    except BaseException as e:
        line = getattr(e, 'lineno', None)
        frames = [f for f in _tb.extract_tb(e.__traceback__) if f.filename == 'student.py']
        if frames: line = frames[-1].lineno
        if isinstance(e, KeyboardInterrupt):
            print('\nKeyboardInterrupt')
        elif isinstance(e, SyntaxError):
            _sys.stderr.write(''.join(_tb.format_exception_only(type(e), e)))
        else:
            _sys.stderr.write('Traceback (most recent call last):\n')
            _sys.stderr.write(''.join(_tb.format_list(frames)))
            _sys.stderr.write(''.join(_tb.format_exception_only(type(e), e)))
        return {'ok': False, 'error': type(e).__name__ + ': ' + str(e), 'line': line, 'stopped': isinstance(e, KeyboardInterrupt)}
    finally:
        for stream in _streams[1:]: stream.flush()
        _sys.stdin, _sys.stdout, _sys.stderr = _streams
`;
self.onmessage=async({data:d})=>{
  if(d.type==='init'){
    try{if(!crossOriginIsolated)throw Error('Python worker isolation is unavailable. Refresh this lesson directly in your browser.');control=new Int32Array(d.control);bytes=new Uint8Array(d.bytes);signal=new Uint8Array(d.signal);python=await loadPyodide({indexURL:new URL('./vendor/python/',import.meta.url).href});python.setStdout({write:b=>write('stdout',b)});python.setStderr({write:b=>write('stderr',b)});python.setInterruptBuffer(signal);python.setStdin({stdin,autoEOF:true});python.runPython(setup);postMessage({type:'ready',version:python.runPython('_sys.version.split()[0]')});}catch(e){postMessage({type:'init-error',error:String(e.message||e)});}return;
  }
  if(d.type!=='run'||!python||current!==null)return;
  current=d.id;inputs=size=0;decoders={stdout:new TextDecoder(),stderr:new TextDecoder()};signal[0]=0;
  try{python.setStdin({stdin,autoEOF:true});python.globals.set('_source',d.code);python.globals.set('_kind',d.kind);const result=JSON.parse(python.runPython('_j.dumps(_execute(_source, _kind))'));postMessage({type:'done',id:current,result});}catch(e){postMessage({type:'done',id:current,result:{ok:false,error:String(e.message||e)}});}finally{python.globals.delete('_source');python.globals.delete('_kind');current=null;}
};
