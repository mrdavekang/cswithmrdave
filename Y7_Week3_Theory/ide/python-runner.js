/* Genuine Python evaluation using the bundled Skulpt interpreter.
   This source runs only in a disposable Web Worker, never in the lesson window. */
(function(root){
  'use strict';
  root.executeTurtlePython = async function(message, send) {
    let events = [], output = '', currentLine = 0, recording = false;
    const started = Date.now(), start = message.start || {x:0,y:0,h:0,pen:true};
    const prefix = ['import turtle', 'from _lesson_bridge import begin as _begin',
      't = turtle.Turtle()', 't.penup()', `t.goto(${Number(start.x)||0}, ${Number(start.y)||0})`,
      `t.setheading(${Number(start.h)||0})`, start.pen === false ? 't.penup()' : 't.pendown()',
      'turtle._default = t', '_begin()', ''];
    const offset = prefix.length - 1;
    function add(kind, state, data) {
      if (!recording) return;
      if(events.length >= 800) throw new Sk.builtin.RuntimeError('Drawing limit reached (800 actions). Try a smaller program.');
      events.push({kind, state, data, line: Math.max(0,currentLine - offset)});
    }
    root.TurtleBridgeEmit = function(state, kind, data) { add(kind, state, data); };
    root.TurtleBridgeBegin = function(){recording = true; events=[];};
    const bridge = `var $builtinmodule = function(name) { return {
      emit: new Sk.builtin.func(function(state,kind,data){
        TurtleBridgeEmit(Sk.ffi.remapToJs(state),Sk.ffi.remapToJs(kind),Sk.ffi.remapToJs(data));
        return Sk.builtin.none.none$;
      }),
      begin: new Sk.builtin.func(function(){TurtleBridgeBegin();return Sk.builtin.none.none$;})
    }; };`;
    function result(ok, error=null, line=null){
      send({type:'result', ok, events, output, error, line, ms:Date.now()-started});
    }
    try {
      if(typeof message.code !== 'string' || message.code.length > 12000 || message.code.split('\n').length > 200)
        throw new Error('Use no more than 200 lines or 12000 characters in this classroom editor.');
      Sk.configure({__future__:Sk.python3, execLimit:2200, yieldLimit:25, debugging:true,
        breakpoints:function(file,line){if(String(file).includes('<student>'))currentLine=line;return false;},
        output:function(text){
          if(output.length + text.length > 12000) throw new Sk.builtin.RuntimeError('Console limit reached. Print fewer items.');
          output += text;
        },
        inputfun:function(){throw new Sk.builtin.NotImplementedError('input() is not enabled in this Turtle lesson. Set a variable in your code instead.');},
        read:function(path){
          if(path==='src/lib/turtle.js')throw new Error('Use the Python Turtle adapter.');
          if(path==='src/lib/turtle.py')return root.TURTLE_MODULE;
          if(path==='src/lib/_lesson_bridge.js')return bridge;
          if(/(?:^|\/)(?:js|document|webbrowser|urllib|urllib2|requests|socket|os|subprocess)(?:\.|\/)/.test(path))
            throw new Error('That module is not available in this classroom editor.');
          if(path==='src/builtin/sys.js')return Sk.builtinFiles.files[path]+`;var baseSys=$builtinmodule;$builtinmodule=function(){var m=baseSys();delete m.setExecutionLimit;delete m.resetTimeout;delete m.setYieldLimit;return m;};`;
          if(Object.prototype.hasOwnProperty.call(Sk.builtinFiles.files,path))return Sk.builtinFiles.files[path];
          throw new Error('Module not available: '+path);
        }
      });
      await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody('<student>',false,prefix.join('\n')+message.code,true));
      result(true);
    } catch(err) {
      let line=null;
      if(err.traceback){const f=err.traceback.find(x=>String(x.filename).includes('<student>'));
        if(f)line=Math.max(1,f.lineno-offset);}
      if(!line && currentLine>offset)line=currentLine-offset;
      let text=String(err);
      text=text.replace(/on line \d+/g, line ? 'on editor line '+line : '');
      result(false, text, line);
    }
  };
  root.onmessage=function(e){if(e.data?.type==='run')root.executeTurtlePython(e.data,r=>root.postMessage(r));};
})(self);
