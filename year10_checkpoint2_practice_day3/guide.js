"use strict";
const {steps, fields, groups, wagba, ksu} = LESSON;
const el = id => document.getElementById(id);
const node = (tag, text, cls) => {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (cls) result.className = cls;
  return result;
};
const link = (href, text, cls) => {
  const anchor = node("a", text, cls);
  anchor.href = href;
  return anchor;
};
const block = text => {
  const pre = node("pre");
  pre.append(node("code", text));
  return pre;
};
const data = {donations:[4,6,2,9], scores:[8,15,6,11]};
const table = (headers, rows, label, rowHeader = false) => {
  const table = node("table", undefined, rowHeader ? "values" : "commands");
  table.setAttribute("aria-label", label);
  const top = table.createTHead().insertRow();
  headers.forEach(value => {
    const cell = node("th", value);
    cell.scope = "col";
    top.append(cell);
  });
  const body = table.createTBody();
  rows.forEach(values => {
    const row = body.insertRow();
    values.forEach((value, index) => {
      const cell = node(index === 0 && rowHeader ? "th" : "td", value);
      if (index === 0 && rowHeader) cell.scope = "row";
      row.append(cell);
    });
  });
  return table;
};
const chapterLinks = groups.map(([title, minutes], group) => {
  const a = link("#" + steps.find(step => step.group === group).id, title);
  a.append(node("small", minutes));
  el("chapters").append(a);
  return a;
});
el("goal-panel").append(node("h2","What are we getting better at?"),node("p",wagba),
  ...ksu.map(([name, value]) => {
    const p = node("p");
    p.append(node("strong",name + ": "),document.createTextNode(value));
    return p;
  }));
if (matchMedia("(max-width: 740px)").matches) el("route").open = false;
let shown = -1;
document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  el("step-title").focus();
});
function render() {
  const hash = location.hash.slice(1);
  const index = Math.max(0, steps.findIndex(step => step.id === hash));
  const step = steps[index];
  const moved = shown >= 0 && shown !== index;
  shown = index;
  el("stage").textContent = groups[step.group][0] + " · " + groups[step.group][1];
  el("progress").textContent = "Step " + (index+1) + " of " + steps.length;
  el("track").style.width = ((index+1)/steps.length*100).toFixed(2) + "%";
  const file = step.group === 3 ? "Working file: Book Donation Tracker Review" :
    step.group === 5 ? "Independent file: Session 3 Scores" : "";
  el("workfile").hidden = !file;
  el("workfile").textContent = file;
  el("step-title").textContent = step.title;
  document.title = step.title + " · Year 10 Session 3";
  const [page, field] = fields[step.field || step.nextField];
  const setup = step.id === "start";
  el("ead-box").replaceChildren(
    node("h2", setup ? "Set up your Word EAD" : step.field ? "Answer in your Word EAD" : "No EAD entry on this step"),
    node("p", setup ? "Page 1 · Name and Class" : (step.field ? "Page " : "Next answer: page ") + page + " · " + field, "ead-target"),
    node("p", setup ? "Keep your named copy open." : step.field ? "Use the box with this exact label." : "Keep your Word EAD open.", "secondary")
  );
  el("ead-box").firstElementChild.id = "ead-heading";
  const reading = READINGS[step.reading || step.field || step.id];
  const panel = el("reading-first");
  panel.hidden = !reading;
  panel.replaceChildren();
  if (reading) {
    const [title, explanation, code] = reading;
    panel.append(node("p", "READ FIRST  /  WORKED EXAMPLE", "read-label"),
      node("h2", title), node("p", explanation));
    if (code) panel.append(block(code));
  }
  el("action").textContent = step.action;
  const visual = [];
  if (step.map) visual.push(table(["Index",0,1,2,3],[[step.map === "scores" ? "Score" : "Books",...data[step.map]]],"Indexes and list values",true));
  if (step.code) visual.push(block(step.code));
  if (step.commands) {
    const headers = step.id === "c-brief" ? ["If", "Program behaviour"] :
      ["When you see", step.id === "bridge" ? "It asks for" : "Type"];
    visual.push(table(headers,step.commands,step.id === "c-brief" ? "Required paths" : "Prompts and responses"));
  }
  el("visual").replaceChildren(...visual);
  const extra = [];
  if (step.file) {
    const a = link("resources/" + step.file, step.button, "download");
    a.download = "";
    extra.push(a);
  }
  if (step.note) extra.push(node("p",step.note,"note"));
  if (step.hint) {
    const details = node("details",undefined,"hint");
    details.append(node("summary","Stuck? Show one hint"),node("p",step.hint));
    extra.push(details);
  }
  if (step.id === "c-run-first" || step.id === "c-run-second") {
    const recovery = node("details",undefined,"hint");
    const ref = link("#c-check","Go back to Add your check");
    recovery.append(node("summary","If the program does not run"),node("p","Keep your prediction. Check the condition, colons and indentation in the Editor before trying again."),ref);
    extra.push(recovery);
  }
  el("extra").replaceChildren(...extra);
  chapterLinks.forEach((a,i) => i === step.group ? a.setAttribute("aria-current","step") : a.removeAttribute("aria-current"));
  const prev = el("previous"), next = el("next");
  prev.hidden = index === 0;
  prev.href = index ? "#" + steps[index-1].id : "#start";
  next.hidden = index === steps.length-1;
  next.href = index+1 < steps.length ? "#" + steps[index+1].id : "#plenary";
  if (moved) {
    el("goals").open = false;
    if (matchMedia("(max-width: 740px)").matches) el("route").open = false;
    el("step-title").focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
window.addEventListener("hashchange",render);
render();
