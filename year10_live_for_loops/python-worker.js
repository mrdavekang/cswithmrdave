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
import builtins as _b, json as _j, traceback as _tb, linecache as _lc, sys as _sys, code as _code
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
        exec(compile(source, 'student.py', 'exec'), _ns, _ns)
        return {'ok': True}
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
