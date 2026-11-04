import {loadPyodide} from '../year8-week7-theory/vendor/python/pyodide.mjs';

let runtime;
self.onmessage=async ({data})=>{
 try{
  runtime ||= loadPyodide({indexURL:new URL('../year8-week7-theory/vendor/python/',import.meta.url).href});
  const py=await runtime;
  self.postMessage({type:'ready'});
  py.globals.set('_student_source',data.code);
  py.globals.set('_frame_count',data.count);
  const json=await py.runPythonAsync(`
import json as _json
import contextlib as _contextlib
import io as _io

class _Output(_io.StringIO):
    def write(self, text):
        if self.tell() < 1000:
            super().write(text[:1000 - self.tell()])
        return len(text)

def _animate(source, count):
    timeline = []
    def show(index, delay):
        if type(index) is not int or not 0 <= index < count:
            raise ValueError(f"Frame index must be a whole number from 0 to {count - 1}.")
        if type(delay) not in (int, float) or not 0.1 <= delay <= 2:
            raise ValueError("Use a delay between 0.1 and 2 seconds.")
        if len(timeline) >= 30:
            raise ValueError("Use one cycle with at most 30 frame steps. The preview repeats it for you.")
        timeline.append([index, delay])
    env = {"show": show}
    output = _Output()
    with _contextlib.redirect_stdout(output):
        exec(compile(source, "animation.py", "exec"), env)
    return _json.dumps({"timeline": timeline, "output": output.getvalue()[:1000]})

_animate(_student_source, _frame_count)
`);
  self.postMessage({type:'result',result:JSON.parse(json)});
 }catch(error){self.postMessage({type:'error',message:String(error.message||error).slice(-1400)});}
};
