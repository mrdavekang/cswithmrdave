/* Real Python execution through Skulpt. Canvas Turtle subset; no student code is evaluated as JavaScript. */
(function(root){
  'use strict';
  function turtleModule(){
    return `var $builtinmodule = function(name) {
      var m={}, pos=[0,0], heading=0, down=true, colour='#176bba', width=4;
      function number(v){var n=Sk.ffi.remapToJs(v);if(typeof n!=='number'||!Number.isFinite(n))throw new Sk.builtin.TypeError('Use a number for the coordinate or distance.');return n;}
      function none(){return Sk.builtin.none.none$;}
      function move(x,y){if(Math.abs(x)>5000||Math.abs(y)>5000)throw new Sk.builtin.ValueError('This drawing is too far off the canvas. Use coordinates near the grid.');EngineDraw({from:pos.slice(),to:[x,y],pen:down,color:colour,width:width});pos=[x,y];return none();}
      m.goto=new Sk.builtin.func(function(x,y){if(y===undefined){var p=Sk.ffi.remapToJs(x);if(!Array.isArray(p)||p.length!==2)throw new Sk.builtin.TypeError('goto needs two coordinates: t.goto(x, y)');return move(number(Sk.ffi.remapToPy(p[0])),number(Sk.ffi.remapToPy(p[1])));}return move(number(x),number(y));});
      m.setpos=m.setposition=m.goto;m.goto_$rw$=m.goto;
      m.forward=new Sk.builtin.func(function(d){d=number(d);return move(pos[0]+d*Math.cos(heading*Math.PI/180),pos[1]+d*Math.sin(heading*Math.PI/180));});m.fd=m.forward;
      m.backward=new Sk.builtin.func(function(d){d=-number(d);return move(pos[0]+d*Math.cos(heading*Math.PI/180),pos[1]+d*Math.sin(heading*Math.PI/180));});m.bk=m.backward;
      m.right=new Sk.builtin.func(function(a){heading-=number(a);return none();});m.rt=m.right;
      m.left=new Sk.builtin.func(function(a){heading+=number(a);return none();});m.lt=m.left;
      m.setheading=new Sk.builtin.func(function(a){heading=number(a);return none();});
      m.penup=new Sk.builtin.func(function(){down=false;return none();});m.up=m.pu=m.penup;
      m.pendown=new Sk.builtin.func(function(){down=true;return none();});m.down=m.pd=m.pendown;
      m.pensize=new Sk.builtin.func(function(v){width=Math.max(1,Math.min(20,number(v)));return none();});m.width=m.pensize;
      m.color=new Sk.builtin.func(function(v){colour=String(Sk.ffi.remapToJs(v));return none();});m.pencolor=m.color;
      m.position=new Sk.builtin.func(function(){return new Sk.builtin.tuple(pos.map(Sk.ffi.remapToPy));});m.pos=m.position;
      m.xcor=new Sk.builtin.func(function(){return Sk.ffi.remapToPy(pos[0]);});m.ycor=new Sk.builtin.func(function(){return Sk.ffi.remapToPy(pos[1]);});
      m.heading=new Sk.builtin.func(function(){return Sk.ffi.remapToPy(((heading%360)+360)%360);});
      m.home=new Sk.builtin.func(function(){heading=0;return move(0,0);});
      m.clear=new Sk.builtin.func(function(){EngineDraw({clear:true});return none();});
      m.reset=new Sk.builtin.func(function(){pos=[0,0];heading=0;down=true;EngineDraw({clear:true});return none();});
      m.circle=new Sk.builtin.func(function(r,extent){r=number(r);var angle=extent===undefined?360:number(extent);var n=Math.max(1,Math.ceil(Math.abs(angle)/8));var start=pos.slice(),h=heading*Math.PI/180,c=[pos[0]-r*Math.sin(h),pos[1]+r*Math.cos(h)];for(var i=1;i<=n;i++){var a=(angle*i/n)*(r<0?-1:1)*Math.PI/180;move(c[0]+(start[0]-c[0])*Math.cos(a)-(start[1]-c[1])*Math.sin(a),c[1]+(start[0]-c[0])*Math.sin(a)+(start[1]-c[1])*Math.cos(a));}heading+=angle*(r<0?-1:1);return none();});
      m.done=m.mainloop=m.hideturtle=m.showturtle=m.speed=m.shape=new Sk.builtin.func(function(){return none();});
      return m;
    };`;
  }
  root.executePython=async function(code,send){
    var draws=[],output='',started=Date.now();
    root.EngineDraw=function(d){if(draws.length>=2000)throw new Sk.builtin.RuntimeError('Drawing limit reached. Stop and use a smaller program.');draws.push(d);};
    try{
      Sk.configure({__future__:Sk.python3,execLimit:1500,yieldLimit:30,output:function(t){if(output.length<12000)output+=t;},read:function(path){if(path==='src/lib/turtle.js')return turtleModule();if(/(?:^|\/)(?:js|document|webbrowser|urllib|requests|socket|os)(?:\.|\/)/.test(path))throw new Error('This browser lesson does not allow that module.');if(path==='src/builtin/sys.js')return Sk.builtinFiles.files[path]+';var originalSysModule=$builtinmodule;$builtinmodule=function(){var m=originalSysModule();delete m.setExecutionLimit;delete m.resetTimeout;delete m.setYieldLimit;return m;};';if(Sk.builtinFiles.files[path]!==undefined)return Sk.builtinFiles.files[path];throw new Error('Module not available: '+path);}});
      await Sk.misceval.asyncToPromise(function(){return Sk.importMainWithBody('<student>',false,code,true);});
      send({type:'result',ok:true,draws:draws,output:output,ms:Date.now()-started});
    }catch(e){send({type:'result',ok:false,draws:draws,output:output,error:String(e),line:e.traceback&&e.traceback[0]?e.traceback[0].lineno:null,ms:Date.now()-started});}
  };
})(typeof self!=='undefined'?self:globalThis);
