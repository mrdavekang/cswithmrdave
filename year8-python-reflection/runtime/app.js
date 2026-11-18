window.startCheckpointLesson = (providedLesson, options) => {
  "use strict";
  options = options || {};

  const DEMO = {
    mode: "demo", className: "8T", sessionId: "reflection-demo",
    names: [{id:"demo",name:"Alex"}], profile: {id:"demo",name:"Alex",route:"review",language:"en",rag:[]},
    cards: [
      {id:"demo-type",type:"type",phase:"Sample practice",title:"Try the typing screen",body:"This is a demonstration. No student assessment information is included.",sample:'print("Hello")'},
      {id:"demo-reflect",type:"reflect",phase:"Sample reflection",title:"Explain your example",body:"What does this line of Python do?",prompts:["It displays …"]},
      {id:"demo-end",type:"finish",title:"Show your learning",body:"Review your work before showing your teacher."}
    ]
  };

  const lesson = providedLesson || DEMO;
  const hosted = options.hosted === true;
  const profile = lesson.profile || {};
  const cards = Array.isArray(lesson.cards) ? lesson.cards.filter(c => c && typeof c.id === "string") : [];
  const className = lesson.className || "8T";
  const sessionId = lesson.sessionId || lesson.id || ("python-reflection-"+(lesson.date || "daily"));
  const sessionDate = lesson.date || lesson.sessionDate || null;
  const key = ["year8-python-reflection-v1", sessionId, className, profile.id || "demo"].join(":");
  const validStatuses = ["correct","recorded","help","attempted"];
  const activeStatuses = ["correct","recorded","help"];
  const checkTypes = ["type","mc","blank","code"];
  const reflectiveTypes = ["reflect","peer","rag","compare"];
  const peerChoices = [
    {label:"Clear and correct", description:"My partner gave a clear explanation and an example."},
    {label:"Nearly there", description:"My partner has the main idea but needs one more detail."},
    {label:"Try again together", description:"A short example or another explanation would help."}
  ];
  const i18n = {
    "Choose your class":"选择你的班级", "Find your first name":"查找你的名字",
    "Check":"检查", "Run Python":"运行 Python", "Save my answer":"保存答案",
    "Next":"下一步", "Back":"返回", "Show my teacher":"给老师看",
    "My explanation":"我的解释", "Practice on this device":"在本设备上练习"
  };
  const $ = id => document.getElementById(id);
  const cardHost = $("card");
  const teacherDialog = $("teacher-dialog");
  const teacherOpen = $("teacher-open");
  const pupilBadge = document.createElement("span");
  pupilBadge.className = "active-pupil";
  pupilBadge.hidden = true;
  document.querySelector(".brand-title")?.parentElement.appendChild(pupilBadge);
  let state = {index:0,responses:{}};
  let stage = "class";
  let selectedClass = "";
  let active = false;
  let searchTerm = "";
  let storageOkay = !hosted;
  let resumed = false;
  let currentWidget = null;
  const typeClocks = new Map();

  function element(tag, text, className, attrs) {
    const e = document.createElement(tag);
    if (text !== null && text !== undefined) e.textContent = String(text);
    if (className) e.className = className;
    for (const [name, value] of Object.entries(attrs || {})) {
      if (value !== null && value !== undefined) e.setAttribute(name, String(value));
    }
    return e;
  }
  const append = (target, ...children) => {
    for (const item of children) if (item) target.append(item);
    return target;
  };
  function label(text) {
    return profile.language === "zh" && Object.hasOwn(i18n,text) ? text+" · "+i18n[text] : text;
  }
  function button(text, fn, cls, attrs) {
    const e = element("button", text, "btn"+(cls?" "+cls:""), {type:"button",...attrs});
    if (fn) e.addEventListener("click", fn);
    return e;
  }
  function asText(x) {
    return Array.isArray(x) ? x.map(asText).join("\n") : x == null ? "" : String(x);
  }
  const nonempty = v => typeof v === "number" || typeof v === "string" && v.trim().length > 0;

  function loadProgress() {
    if (hosted) return;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (!saved || !saved.responses || typeof saved.responses !== "object") return;
      for (const c of cards) {
        if (!Object.hasOwn(saved.responses,c.id)) continue;
        const old = saved.responses[c.id];
        if (!old || typeof old!=="object") continue;
        const rec = {};
        if (typeof old.answer === "string") rec.answer = old.answer.slice(0,9000);
        if (typeof old.answer === "number" && Number.isInteger(old.answer)) rec.answer = old.answer;
        if (c.type==="code" && typeof old.checkedCode==="string") rec.checkedCode=old.checkedCode.slice(0,3000);
        if (peerChoices.some(option=>option.label===old.peerRating)) rec.peerRating=old.peerRating;
        if (typeof old.peerNote==="string") rec.peerNote=old.peerNote.slice(0,240);
        if (validStatuses.includes(old.status)) rec.status = old.status;
        for (const attr of ["attempts","accuracy","wpm","typeCorrect","typeInputs","typeEdits","checkedAt"]) {
          if (Number.isFinite(old[attr]) && old[attr]>=0) rec[attr] = Math.max(0, Math.min(Number.MAX_SAFE_INTEGER,old[attr]));
        }
        state.responses[c.id] = rec;
      }
      if (Number.isInteger(saved.index)) state.index = Math.min(Math.max(0,saved.index), Math.max(0,cards.length-1));
      resumed = Object.keys(state.responses).length > 0;
    } catch {
      storageOkay = false;
    }
  }

  function updateProgress() {
    $("progress").hidden = !active;
    teacherOpen.hidden = !active;
    const showPupilBadge = options.selfSelected || options.privatePreview;
    pupilBadge.hidden = !active || !showPupilBadge;
    pupilBadge.textContent = showPupilBadge ? "Working as: "+asText(profile.firstName || profile.name) : "";
    if (!active) return;
    const current = cards[state.index];
    const total = cards.length;
    const count = cards.filter(c=>activeStatuses.includes(state.responses[c.id]?.status)).length;
    $("step-label").textContent = "Card "+(state.index+1)+" of "+total+(current?.phase || current?.section ? " · "+asText(current.phase || current.section) : "");
    $("progress-label").textContent = count+" of "+total+" done";
    $("progress-track").value = Math.round(100*count/(total||1));
    const note = $("save-note");
    note.textContent = hosted ? "Keep this page open. Download your summary before closing." :
      storageOkay ? "Saved on this device" : "This browser may not save after closing. Use Show my teacher → Download summary.";
    note.classList.toggle("warning",!storageOkay);
  }

  function save() {
    if (storageOkay && active) {
      try { localStorage.setItem(key,JSON.stringify(state)); }
      catch { storageOkay = false; }
    }
    updateProgress();
  }

  function setResponse(c,next) {
    state.responses[c.id] = {...(state.responses[c.id] || {}),...next};
    save();
    return state.responses[c.id];
  }

  function tick() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB",
      {timeZone:"Asia/Kuala_Lumpur",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(new Date()).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
    const localDate = parts.year+"-"+parts.month+"-"+parts.day;
    const parse = (text, fallback) => /^\d{1,2}:\d{2}$/.test(text||"") ? text.split(":").reduce((a,v)=>a*60+Number(v),0)*60 : fallback;
    const now = 3600*Number(parts.hour)+60*Number(parts.minute)+Number(parts.second);
    const from = parse(lesson.sessionStart,14*3600);
    const to = parse(lesson.sessionEnd,15*3600);
    const main = $("clock-value");
    const note = $("clock-note");
    if ((!sessionDate || sessionDate===localDate) && now>=from && now<to) {
      const remaining=to-now;
      main.textContent = Math.floor(remaining/60)+":"+String(remaining%60).padStart(2,"0")+" left";
      note.textContent = remaining<=300 ? "Finish your current step" : "Class time remaining";
      main.parentElement.classList.toggle("soon",remaining<=300);
    } else {
      main.parentElement.classList.remove("soon");
      if ((sessionDate && localDate<sessionDate) || ((!sessionDate || localDate===sessionDate) && now<from)) {
        main.textContent = "Class starts at 2:00 pm";
        note.textContent = "You can practise now";
      } else {
        main.textContent = "Class time is over";
        note.textContent = "You can still save your work";
      }
    }
  }

  function shell(title, eyebrow, text) {
    cardHost.replaceChildren();
    if (eyebrow) cardHost.append(element("p",eyebrow,"eyebrow"));
    const h=element("h1",title,null,{id:"card-title",tabindex:"-1"});
    append(cardHost,h,text ? element("p",text,"card-copy") : null);
    cardHost.classList.remove("is-fresh");
    void cardHost.offsetWidth;
    cardHost.classList.add("is-fresh");
    return h;
  }
  function focusHeading() { $("card-title")?.focus({preventScroll:true}); window.scrollTo({top:0,behavior:"auto"}); }

  function drawClass(focus) {
    stage="class"; active=false; currentWidget=null; updateProgress();
    shell(label("Choose your class"), lesson.mode==="demo"?"PREVIEW · SAMPLE ONLY":"START HERE","Choose your Computer Science class.");
    const choices=element("div",null,"class-choices");
    for (const option of ["8T","8E"]) {
      const b=element("button",null,"class-tile",{type:"button"});
      append(b,element("strong",option),element("span","Year "+option));
      b.addEventListener("click",()=>{
        selectedClass=option;
        drawName(true);
      });
      choices.append(b);
    }
    cardHost.append(choices);
    $("footer-note").textContent = hosted ? "Only this lesson file’s own profile can open." : "For personal feedback, open the private file your teacher gave you.";
    if (focus) focusHeading();
  }

  function namesForClass() {
    if (selectedClass !== className || lesson.mode==="unreleased") return [];
    const items = Array.isArray(lesson.names) ? lesson.names : Array.isArray(lesson.roster) ? lesson.roster : [];
    const choices = items.map(item => ({
      id:asText(item.id), name:asText(item.firstName || item.name)
    })).filter(item => item.id && item.name);
    if (!choices.length && profile.id && (profile.firstName || profile.name)) {
      choices.push({id:String(profile.id),name:asText(profile.firstName||profile.name)});
    }
    return choices;
  }

  function drawName(focus) {
    stage="name"; active=false; updateProgress();
    const available = namesForClass();
    searchTerm="";
    const isReady = available.length>0;
    shell(isReady ? label("Find your first name") : "This class is not available in this file",selectedClass+" · START HERE",
      isReady ? "Use the dropdown or search. This file opens only the feedback it was issued for."
      : selectedClass==="8E" ? "There is no Year 8E feedback in this release. Check with your teacher for your class’s next step."
        : "Open the Year 8T file that your teacher shared with you.");
    if (isReady) {
      const wrap = element("div",null,"name-fields");
      const search=element("input",null,null,{id:"name-search",type:"search",placeholder:"Type a first name",autocomplete:"off"});
      const searchButton=button("Search",()=>filter(true));
      const row=append(element("div",null,"search-row"),search,searchButton);
      const labelSearch = element("label","Search by first name","form-label",{for:"name-search"});
      const select=element("select",null,null,{id:"name-choice"});
      const status=element("p",null,"status",{role:"status"});
      const start=button("Open my cards",()=>{
        if (select.value!==String(profile.id||"") || !cards.length) {
          notice(status,"This is not your file. Open your own private lesson file from Teams.","warning");
          return;
        }
        if (lesson.mode==="private" && typeof profile.id!=="string") {
          notice(status,"This file could not verify a pupil profile. Ask your teacher for your own file.","warning");
          return;
        }
        active=true; stage="lesson"; loadProgress(); drawCard(true);
      },"primary");
      function filter(choose) {
        searchTerm=search.value.toLowerCase().trim();
        const matches=available.filter(item=>item.name.toLowerCase().includes(searchTerm));
        const previous=select.value;
        const options=[element("option",matches.length?"Select your first name":"No names found",null,{value:""})];
        for (const m of matches) options.push(element("option",m.name,null,{value:m.id}));
        select.replaceChildren(...options);
        if (choose && matches.length===1) select.value=matches[0].id;
        else if (matches.some(x=>x.id===previous)) select.value=previous;
        start.disabled=!select.value;
        notice(status,matches.length ? choose ? matches.length+" "+(matches.length===1?"match":"matches") : "" : "No matches. Try a shorter first name.","neutral");
      }
      search.addEventListener("input",()=>filter(false));
      search.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();filter(true);}});
      select.addEventListener("change",()=>{start.disabled=!select.value;notice(status,"","neutral");});
      append(wrap,labelSearch,row,element("label","First name","form-label",{for:"name-choice"}),select,status,
        append(element("div",null,"card-actions"),button(label("Back"),()=>drawClass(true)),start));
      cardHost.append(wrap); filter(false);
    } else {
      cardHost.append(append(element("div",null,"card-actions"),button("Choose a different class",()=>drawClass(true),"primary")));
    }
    if (focus) focusHeading();
  }

  function notice(e,message,tone) {
    e.textContent=message;
    e.dataset.tone=tone || "neutral";
  }

  function details(title, content) {
    if (!asText(content).trim()) return null;
    return append(element("details"),element("summary",title),element("div",asText(content),"context-note"));
  }

  function renderPrompts(c, root) {
    const prompts = Array.isArray(c.prompts) ? c.prompts : c.prompts ? [c.prompts] : [];
    if (prompts.length) {
      const list=element("ul");
      prompts.forEach(item=>list.append(element("li",asText(item))));
      root.append(append(element("div",null,"wordbank"),element("strong","Start a sentence","cue-label"),list));
    }
    const tips = Array.isArray(c.keywords) ? c.keywords : [];
    const examples = Array.isArray(c.examples) ? c.examples : [];
    if (!tips.length && !examples.length) return;
    const choices=element("div",null,"coach-options");
    for (const [title,items,style] of [
      ["What could I try?",tips,"coach-strategies"],
      ["See example reflections",examples,"coach-examples"],
    ]) {
      if (!items.length) continue;
      const list=element("ul",null,style);
      items.forEach(item=>list.append(element("li",asText(item))));
      const panel=append(element("details"),element("summary",title),list);
      if (style==="coach-examples")panel.insertBefore(element("p","Borrow the sentence shape. Use your own experience.","helper-copy"),list);
      choices.append(panel);
    }
    root.append(choices);
  }

  function notes(c,root) {
    if ((profile.language==="zh" || options.selfSelected) && c.zh) root.append(details("中文提示 · Mandarin support",c.zh));
    if (c.help) root.append(details("Show a hint",c.help));
  }

  function renderText(c, root, saved, onEdit) {
    const focus=state.responses.focus?.answer;
    if (c.id==="strategy" && typeof focus==="string" && focus.trim()) {
      root.append(element("p","Your focus: "+focus,"coach-focus"));
    }
    if (c.prompt) root.append(element("p",asText(c.prompt),"primary-prompt",{id:"task-prompt"}));
    renderPrompts(c,root);
    const t=element("textarea",null,null,{id:"current-response",rows:4,maxlength:1500,placeholder:c.placeholder || "Write your answer here"});
    if (c.prompt) t.setAttribute("aria-describedby","task-prompt");
    t.value=asText(saved.answer);
    t.addEventListener("input",()=>onEdit(t.value));
    return append(root,element("label",label(c.answerLabel || (c.type==="compare"?"My explanation":"Your answer")),"form-label",{for:"current-response"}),t);
  }

  const statusName = s => {
    const k = asText(s).trim().toLowerCase();
    if (/green|secure|strong|confident|achieved/.test(k)) return ["Secure","secure"];
    if (/amber|yellow|develop|partial|some/.test(k)) return ["Developing","developing"];
    if (/red|revisit|needs support/.test(k)) return ["Revisit","revisit"];
    return ["No evidence","none"];
  };

  function renderRag(c, root, saved, onEdit) {
    const values = Array.isArray(profile.rag) ? profile.rag : [];
    if (!values.length) { renderText(c,root,saved,onEdit); return; }
    const group = element("fieldset",null,"choice-list",{id:"rag-choices", "aria-label":"Choose one topic to practise today"});
    const rows = element("div",null,"rag-list");
    for (const value of values) {
      const title=asText(value.title||value.topic);
      const [word,tone]=statusName(value.status);
      const input = element("input",null,null,{type:"radio",name:"rag-focus",value:title});
      input.checked=saved.answer===title;
      input.addEventListener("change",()=>{if(input.checked)onEdit(title);});
      const caption=append(element("span"),element("strong",title),value.description?element("small",asText(value.description),"small"):null,
        profile.language==="zh" && (value.zhTitle || value.zhDescription)?element("small",asText([value.zhTitle,value.zhDescription].filter(Boolean).join(" · ")),"small",{lang:"zh-Hans"}):null);
      rows.append(append(element("label",null,"rag-row"),append(element("span",null,"rag-control"),input,caption),element("span",word,"rag-chip",{"data-status":tone})));
    }
    root.append(append(group,rows));
    if (c.keywords || c.examples) renderPrompts({...c,prompts:[]},root);
  }

  function renderChoices(c,root,saved,onEdit) {
    renderPrompts(c,root);
    const peer=(c.type==="peer");
    const options=peer?peerChoices:c.choices || [];
    const fieldset=element("fieldset",null,"choice-list",{"aria-label":peer?"Peer rating":"Answer choices"});
    let rating = saved.peerRating || (options.some(x=>x?.label===saved.answer)?saved.answer:"");
    let note = saved.peerNote || "";
    function updatePeer() {
      const response=[rating,note.trim()].filter(Boolean).join(" — ");
      onEdit(response,{peerRating:rating,peerNote:note});
    }
    options.forEach((opt,i)=>{
      const val=peer?opt.label:i;
      const input=element("input",null,null,{type:"radio",name:"multiple-choice",value:val});
      input.checked=(peer ? rating : saved.answer)===val;
      input.addEventListener("change",()=>{if(input.checked) { if(peer){ rating=val;updatePeer(); } else onEdit(val); }});
      fieldset.append(append(element("label",null,"choice"),input,
        append(element("span",peer?opt.label:asText(opt),peer?"choice-col":""),
          peer?element("small",opt.description):null)));
    });
    root.append(fieldset);
    if (peer) {
      const input=element("input",null,null,{id:"peer-note",type:"text",maxlength:"240",placeholder:"I understood … / One thing to add is …"});
      input.value=note;
      input.addEventListener("input",()=>{note=input.value;updatePeer();});
      append(root,element("label",profile.language==="zh"?"Partner: type a short reason · 同伴：写一句理由":"Partner: type a short reason","form-label",{for:"peer-note"}),input,
        element("p","Say what was clear or give one thing to add. No names needed.","helper-copy"));
    }
  }

  function useTyping(c,root,saved,onEdit) {
    const target=asText(c.sample).replace(/\r\n/g,"\n");
    const board=element("div",null,"type-board",{"aria-label":"Code to type"});
    const exact=element("span",target,"sr-only");
    const visual=element("div",null,"type-target",{"aria-hidden":"true"});
    board.append(exact,visual);
    const stats=element("div",null,"type-stats",{"aria-label":"Typing statistics"});
    const counters=[];
    for (const [initial,word] of [["—","Words / min"],["—","Accuracy"],["0%","Characters matched"]]) {
      const value=element("strong",initial);
      counters.push(value);
      stats.append(append(element("div",null,"stat"),value,element("span",word)));
    }
    const t=element("textarea",null,"type-input"+(!target.includes("\n")?" one-line":""),{id:"current-response",rows:target.includes("\n")?3:1,maxlength:1500,spellcheck:"false",autocapitalize:"off",autocomplete:"off",autocorrect:"off",placeholder:"Start typing the code you see"});
    t.value=asText(saved.answer);
    function snapshot(typing, refresh=false) {
      const letters=Array.from(target);
      const typed=Array.from(typing);
      const elapsed=typeClocks.has(c.id)?(performance.now()-typeClocks.get(c.id))/60000:0;
      let correct=0;
      letters.forEach((v,i)=>{if(v===typed[i])correct++;});
      const accuracy = typed.length ? Math.round(100*correct/typed.length) : null;
      const completion = letters.length ? Math.min(100,Math.round(100*correct/letters.length)) : 0;
      const wpm = elapsed>1/60 ? Math.round((correct/5)/elapsed) : null;
      if (refresh) {
        const spans=letters.map((v,i)=>element("span",v, i===typed.length ? "current" : i<typed.length ? typed[i]===v?"typed-ok":"typed-wrong" : ""));
        if(typed.length>letters.length)spans.push(element("span",typed.slice(letters.length).join(""),"extra"));
        visual.replaceChildren(...spans);
        [wpm===null?"—":String(wpm),accuracy===null?"—":accuracy+"%",completion+"%"].forEach((v,i)=>{
          const node=counters[i];if(node.textContent!==v){node.textContent=v;node.classList.remove("bump");void node.offsetWidth;node.classList.add("bump");}
        });
      }
      return {accuracy,wpm,typeCorrect:correct,typeInputs:typed.length};
    }
    t.addEventListener("input",()=>{
      if(!typeClocks.has(c.id))typeClocks.set(c.id,performance.now());
      onEdit(t.value,snapshot(t.value,true));
    });
    append(root,board,stats,element("label","Type the code","form-label",{for:"current-response"}),t,
      target.includes("\n") ? indentControl(t) : null,
      element("p","Accuracy matters more than speed.","helper-copy"));
    snapshot(t.value,true);
    return {snapshot,target,input:t};
  }

  function codePanel(title,text) {
    return append(element("div",null,"code-panel"),element("div",title,"code-header"),element("pre",asText(text) || "No code was submitted."));
  }
  function indentControl(input) {
    return append(element("div",null,"editor-tools"),button("Insert 4 spaces",()=>{
      input.setRangeText("    ",input.selectionStart,input.selectionEnd,"end");
      input.dispatchEvent(new Event("input",{bubbles:true}));
      input.focus();
    }));
  }

  function drawCard(focus) {
    if (!active || !cards.length) return drawClass(focus);
    const c=cards[state.index];
    if(!c) return drawClass(focus);
    const saved=state.responses[c.id] || {};
    const eyebrow=asText(c.phase || c.section || "PYTHON PRACTICE");
    shell(asText(c.title) || "Your next step",eyebrow,asText(c.body));
    currentWidget=null;
    $("footer-note").textContent = "You can show your work to your teacher at any time.";
    if (resumed) {
      cardHost.append(element("p","Your last saved card and answers have been restored.","helper-copy"));
      resumed=false;
    }
    if (c.type==="finish") {
      if (!activeStatuses.includes(saved.status)) setResponse(c,{status:"recorded"});
      notes(c,cardHost);
      drawFinish(c);
      if(focus)focusHeading();
      updateProgress();
      return;
    }
    const root=element("div",null,"response");
    const status=element("p",null,"status",{role:"status","aria-live":"polite"});
    const runOutput=element("div",null,"code-result",{"aria-live":"polite"});
    runOutput.hidden=true;
    let busy=false;
    let check, next, needHelp;
    const rec=()=>state.responses[c.id] || {};
    const peerReady=()=>c.type!=="peer" || (nonempty(rec().peerRating) && nonempty(rec().peerNote));
    const updateControls=()=>{
      if (check) check.disabled=busy || !peerReady() || (c.type!=="code"&&!nonempty(rec().answer)) || (activeStatuses.includes(rec().status) && rec().status!=="help");
      if (next) next.disabled=busy || (c.type!=="instruction" && !activeStatuses.includes(rec().status));
      if (needHelp) needHelp.disabled=busy || rec().status==="help";
    };
    function edit(answer,meta={}) {
      const old=rec();
      const originally=old.status || "attempted";
      const changed=answer!==old.answer;
      setResponse(c,{answer,...meta,status:changed?"attempted":originally});
      if (changed) {
        notice(status,"","neutral");
        if (c.type==="code")runOutput.hidden=true;
      }
      updateControls();
    }

    if (c.type==="rag") renderRag(c,root,saved,edit);
    else if (["mc","peer"].includes(c.type)) renderChoices(c,root,saved,edit);
    else if (c.type==="type") currentWidget=useTyping(c,root,saved,edit);
    else if (c.type==="blank") {
      const field=element("input",null,"mono",{type:"text",id:"current-response",maxlength:420,spellcheck:"false",autocapitalize:"off",autocorrect:"off",placeholder:c.placeholder || "Type the missing code"});
      field.value=asText(saved.answer);
      field.addEventListener("input",()=>edit(field.value));
      append(root,element("label","Your missing code","form-label",{for:"current-response"}),field);
    } else if (c.type==="compare") {
      append(root,append(element("div",null,"compare-grid"),codePanel(c.submittedTitle || "Your assessment code",c.submitted),codePanel("Worked example",c.model)));
      if (c.feedback) root.append(details(lesson.mode === "practice" ? "Why the example works" : "Show marking feedback",c.feedback));
      renderText(c,root,saved,edit);
    } else if (c.type==="code") {
      if (c.sample) root.append(details("Show a worked example",c.sample));
      const input=element("textarea",null,"code-editor",{id:"current-response",rows:6,maxlength:3000,spellcheck:"false",autocapitalize:"off",autocorrect:"off",autocomplete:"off","aria-label":"Python practice editor"});
      input.value=typeof saved.answer==="string" ? saved.answer : asText(c.starter);
      append(root,append(element("div",null,"code-panel"),element("label","Python editor","code-header",{for:"current-response"}),input),indentControl(input),element("p","Run Python to check your answer.","helper-copy"),runOutput);
      input.addEventListener("input",()=>edit(input.value));
      input.addEventListener("keydown",e=>{
        if (e.key==="Enter" && (e.ctrlKey||e.metaKey)){e.preventDefault();performCheck();}
      });
      currentWidget={input};
    } else if (c.type!=="instruction") renderText(c,root,saved,edit);

    notes(c,root);
    append(cardHost,root,status);

    async function performCheck() {
      if (busy || (rec().status && rec().status!=="help" && activeStatuses.includes(rec().status))) return;
      const {answer}=rec();
      const checked=checkTypes.includes(c.type);
      let ok=false;
      let detail="";
      if (c.type==="code") {
        const code=currentWidget?.input.value || "";
        if (!code.trim()) { notice(status,"Write a line of Python before running it.","warning"); return; }
        if (!Array.isArray(c.tests)||!c.tests.length || typeof window.runPython!=="function") {
          notice(status,"The Python runner is unavailable for this card. Save your work and mark it for help.","warning"); return;
        }
        busy=true;
        updateControls();
        notice(status,"Running Python…","neutral");
        try {
          const result=await window.runPython(code,c.tests);
          if (!result || typeof result.passed!=="boolean") throw new Error("No Python result");
          ok=result.passed;
          detail=ok?"Your output matches the expected result.":"Compare the output with the expected result. Then edit and run again.";
          runOutput.replaceChildren();
          (result.results || []).slice(0,4).forEach((row,i)=>{
            const p=element("p",(result.results.length>1?"Test "+(i+1)+" · ":"")+(row.passed?"Matches":"Needs another try"));
            const out=row.error?"Python message: "+asText(row.error):"Output: "+(asText(row.output)||"(nothing printed)")+"\nExpected: "+asText(row.expected);
            append(runOutput,p,element("pre",out));
          });
          runOutput.hidden=!runOutput.childElementCount;
        } catch (e) {
          detail="Python could not run. Try a smaller change, or mark this card for help.";
          if (e instanceof Error && e.message) append(runOutput,element("pre",e.message));
          runOutput.hidden=!runOutput.childElementCount;
        } finally {
          busy=false;
        }
        setResponse(c,{answer:code,checkedCode:code.slice(0,3000),checkedAt:Date.now(),status:ok?"correct":"attempted",attempts:(rec().attempts||0)+1});
      } else {
        if (!nonempty(answer) || !peerReady()) {
          notice(status,c.type==="peer"?"Ask your partner to choose a rating and type a reason.":"Add a response first, or mark the card for help.","warning");
          return;
        }
        if (c.type==="type") {
          const normalized=asText(answer).replace(/\r\n/g,"\n");
          ok=normalized===currentWidget.target;
          detail=ok?"Exact match. Nice work!":"Look at the target again. Check spaces, brackets, quotes and capital letters.";
          setResponse(c,currentWidget.snapshot(asText(answer),true));
        } else if (c.type==="mc") {
          ok=Number(answer)===Number(c.correct);
          detail=ok?"That’s right.":"Not quite. Read the example again or open the hint.";
        } else if (c.type==="blank") {
          const clean=x=>asText(x).replace(/\r\n/g,"\n").trim();
          ok=(Array.isArray(c.answers)?c.answers:[c.answer]).some(x=>x!=null&&clean(x)===clean(answer));
          detail=ok?"Correct.":"Not yet. Check the exact Python spelling and punctuation.";
        } else {
          ok=true;detail=c.type==="peer"?"Peer rating saved.":"Saved.";
        }
        const keyedFeedback=ok?c.correctFeedback || c.feedbackOk:c.incorrectFeedback || c.feedbackWrong;
        if (keyedFeedback) detail=asText(keyedFeedback);
        else if (c.type==="mc" && ok && typeof c.feedback==="string") detail+=" "+c.feedback;
        setResponse(c,{status:ok?(checked?"correct":"recorded"):"attempted",attempts:(rec().attempts||0)+1});
      }
      notice(status,detail,ok?"positive":"warning");
      updateControls();
    }

    function move(delta) {
      if (busy) return;
      if (delta>0 && c.type==="instruction") setResponse(c,{status:"recorded"});
      state.index=Math.max(0,Math.min(cards.length-1,state.index+delta));
      save();
      drawCard(true);
    }

    const back=button(label("Back"),()=>{
      if(busy)return;
      if(state.index>0)move(-1);
      else if (options.beginDirect) window.location.reload();
      else drawName(true);
    },"",{id:"go-back"});
    const actions=element("div",null,"actions-right");
    if (c.type!=="instruction") {
      const action= c.type==="code"?"Run Python":checkTypes.includes(c.type)?"Check":"Save my answer";
      check=button(label(action),performCheck,"",{id:"check-answer"});
      const isShort = c.type==="type" || c.type==="blank";
      if (isShort) root.addEventListener("keydown",e=>{
        if(e.key==="Enter" && (e.ctrlKey||e.metaKey)) { e.preventDefault(); performCheck(); }
      });
      needHelp=button("Mark for help and continue",()=>{
        if(busy)return;
        setResponse(c,{status:"help"});
        move(1);
      },"subtle",{id:"mark-help"});
      append(actions,needHelp,check);
    }
    next=button(label("Next")+" →",()=>move(1),"primary",{id:"go-next"});
    append(actions,next);
    append(cardHost,append(element("div",null,"card-actions"),back,actions));
    if (saved.status==="correct") notice(status,"Checked and correct.","positive");
    if (saved.status==="recorded") notice(status,"Saved.","positive");
    if (saved.status==="help") notice(status,"Marked for help. You can still try again.","warning");
    if (saved.status==="attempted" && saved.attempts>0) notice(status,"Your previous answer is saved. You can check again or mark for help.","neutral");
    updateControls(); updateProgress();
    if(focus)focusHeading();
  }

  function encodeProgress() {
    const rows=cards.filter(c=>c.type!=="finish").map(c=>{
      const rec=state.responses[c.id]||{};
      const row={id:c.id,title:asText(c.title),topic:asText(c.topic||c.phase||c.section),type:c.type,status:rec.status||"unvisited"};
      if (rec.attempts>0)row.attempts=rec.attempts;
      if (reflectiveTypes.includes(c.type) && nonempty(rec.answer)) row.answer=asText(rec.answer).slice(0,1500);
      if (c.type==="type" && Number.isFinite(rec.accuracy)) row.accuracy=rec.accuracy;
      if (c.type==="type" && Number.isFinite(rec.wpm)) row.wpm=rec.wpm;
      return row;
    });
    const count=s=>rows.filter(r=>r.status===s).length;
    return {
      schema:"year8-python-reflection/v1",sessionId,sessionDate,className,...(options.selfSelected?{identityMode:"self-selected"}:{}),
      pupil:{id:String(profile.id||"demo"),firstName:asText(profile.firstName||profile.name),route:asText(profile.route)},
      createdAt:new Date().toISOString(),
      summary:{total:rows.length,completed:count("correct")+count("recorded")+count("help"),correct:count("correct"),recorded:count("recorded"),needsHelp:count("help"),unvisited:count("unvisited")},
      cards:rows
    };
  }

  function detailsSummary(root, pack, compact) {
    const m=pack.summary;
    const box=element("div",null,"summary-counters");
    for (const [value,body] of [[m.completed+"/"+m.total,"Cards completed"],[m.correct,"Checked correct"],[m.needsHelp,"Marked for help"],[m.unvisited,"Still to try"]]) {
      append(box,append(element("div",null,"summary-count"),element("strong",value),element("span",body)));
    }
    root.append(box);
    const practice=cards.filter(c=>c.type==="code" && asText(state.responses[c.id]?.checkedCode).trim())
      .sort((a,b)=>(state.responses[b.id].checkedAt||0)-(state.responses[a.id].checkedAt||0))[0];
    if (practice) {
      const dt=element("details");
      dt.append(element("summary","My most recent practice program"));
      dt.append(codePanel(practice.title,state.responses[practice.id].checkedCode));
      dt.append(element("p","Tell your teacher what this program does and why you used one line.","helper-copy"));
      root.append(dt);
    }
    const reflections=pack.cards.filter(x=>reflectiveTypes.includes(x.type)&& nonempty(x.answer));
    const flags=pack.cards.filter(x=>x.status==="help");
    if (flags.length) {
      const dt=element("details");
      if (!compact)dt.open=true;
      dt.append(element("summary","Where I asked for help ("+flags.length+")"));
      const list=element("ul");
      for (const f of flags)list.append(element("li",f.title));
      dt.append(list);
      root.append(dt);
    }
    if (reflections.length) {
      const dt=element("details");
      dt.open=true;
      dt.append(element("summary","My reflections and peer checks"));
      for (const row of reflections) {
        append(dt,append(element("div",null,"summary-answer"),
          element("strong",row.title),
          element("span",row.status==="recorded"?"Saved":"Draft","summary-chip",{"data-status":row.status}),
          element("p",row.answer)));
      }
      root.append(dt);
    } else root.append(element("p","No reflections have been entered yet.","helper-copy"));
  }

  function download() {
    const data=encodeProgress();
    const safe=(data.pupil.firstName||data.pupil.id).replace(/[^\p{L}\p{N}_-]+/gu,"-").slice(0,40)||"student";
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
    const a=element("a",null,null,{href:url,download:className+"-"+safe+"-reflection.json"});
    a.hidden=true;
    document.body.append(a);
    a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }

  function displayTeacher() {
    if (!active) return;
    const pack=encodeProgress(), root=$("teacher-content");
    root.replaceChildren();
    append(root,element("h2","My lesson summary",null,{id:"teacher-heading"}),element("p","Show one example to your teacher. Explain what your Python line does and why you used it.","card-copy"));
    detailsSummary(root,pack,true);
    append(root,
      append(element("div",null,"button-row"),button("Download summary",download,"primary"),button("Back to my card",()=>teacherDialog.close())));
    if (typeof teacherDialog.showModal==="function") teacherDialog.showModal();
    else teacherDialog.setAttribute("open","");
  }

  function drawFinish(c) {
    const m=encodeProgress();
    const root=element("div",null,"review-layout");
    root.append(element("p",m.summary.needsHelp?"Show one challenge you can explain and one place you want help.":"Choose one example. Tell your teacher what it does and why you used that syntax.","card-copy"));
    renderPrompts(c,root);
    detailsSummary(root,m,false);
    cardHost.append(root);
    append(cardHost,append(element("div",null,"card-actions"),
      button(label("Back"),()=>{state.index=Math.max(0,state.index-1);save();drawCard(true);}),
      append(element("div",null,"actions-right"),button("Download summary",download),button(label("Show my teacher"),displayTeacher,"primary"))));
  }

  teacherOpen.addEventListener("click",displayTeacher);
  if (profile.language==="zh") teacherOpen.textContent=label("Show my teacher");
  if (options.beginDirect && options.initialClass === className && cards.length) {
    selectedClass=className;active=true;stage="lesson";loadProgress();drawCard(true);
  }
  else if (options.initialClass === className) { selectedClass = className; drawName(true); }
  else drawClass(false);
  tick();
  setInterval(tick,1000);
};
if (!window.CHECKPOINT_HOSTED) window.startCheckpointLesson(window.LESSON);
