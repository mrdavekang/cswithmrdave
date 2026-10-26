(() => {
  class PythonShell {
    constructor(root,options={}){
      this.root=root;this.options=options;this.transcript=options.transcript||'';this.more=false;this.busy=false;
      root.innerHTML='<div class="shell-log" tabindex="0" aria-label="Python Shell transcript"><span class="shell-text"></span><form class="shell-entry"><span class="shell-prompt">&gt;&gt;&gt; </span><input class="shell-input" aria-label="Python Shell command or input" autocomplete="off" spellcheck="false"></form></div><p class="shell-status" role="status">Run / F5 executes the Editor. Type answers here when Python asks.</p>';
      this.text=root.querySelector('.shell-text');this.form=root.querySelector('form');this.input=root.querySelector('input');this.prompt=root.querySelector('.shell-prompt');this.status=root.querySelector('.shell-status');
      this.runner=new PythonRunner({onOutput:text=>this.append(text),onStatus:s=>{this.status.textContent=s.message;if(s.state==='waiting'){this.prompt.textContent='';this.input.disabled=!this.allowed();this.input.focus();}else if(s.state==='running'||s.state==='loading'){this.input.disabled=true;}},onInput:()=>options.onWaiting?.()});
      this.form.onsubmit=e=>{e.preventDefault();if(!this.allowed())return;const line=this.input.value;if(this.runner.state==='waiting'){try{if(this.runner.provideInput(line)){this.options.onTypedInput?.(line,true);this.input.value='';this.input.disabled=true;}}catch(e){this.status.textContent=e.message;}return;}if(this.busy)return;this.options.onTypedInput?.(line,false);this.input.value='';this.append((this.more?'... ':'>>> ')+line+'\n');this.execute(line,'repl');};
      this.input.onkeydown=e=>{if(e.ctrlKey&&e.key.toLowerCase()==='c'&&(this.busy||this.more)){e.preventDefault();this.stop();}};this.draw();this.setEditable(this.allowed());
    }
    allowed(){return this.options.canEdit?.()!==false;}
    draw(){this.text.textContent=this.transcript;this.root.querySelector('.shell-log').scrollTop=1e9;}
    append(text){this.transcript=(this.transcript+text).slice(-40000);this.draw();this.options.onChange?.(this.transcript);}
    setEditable(value){this.input.disabled=!value||this.busy&&this.runner.state!=='waiting';}
    async execute(code,kind='module'){
      if(this.busy||!this.allowed())return;this.busy=true;this.options.onBusy?.(true);
      this.prompt.textContent='';
      if(kind==='module'){this.more=false;this.append('\n=== Run student.py ===\n');}
      let result;
      try{result=await this.runner.execute(code,kind);if(!result.ok&&!result.stderr)this.append((result.error||'Execution interrupted.')+'\n');this.more=result.more===true;this.prompt.textContent=this.more?'... ':'>>> ';this.options.onResult?.({...result,shellTranscript:this.transcript});}
      catch(e){this.append(e.message+'\n');this.status.textContent=e.message;}
      finally{this.busy=false;this.options.onBusy?.(false);this.setEditable(this.allowed());}return result;
    }
    stop(){if(this.busy)this.runner.stop();else if(this.more)this.execute('','cancel');}
    dispose(){this.runner.close();}
  }
  window.PythonShell=PythonShell;
})();
