/* Matched before/after reflections: self-reports, never marks or learning styles. */
(function (root) {
  'use strict';
  const p = (en, zh) => ({ en, zh });
  const topics = [
    {
      id: 'knowledge', group: p('Knowledge', '知识'), short: p('Read a command', '读懂指令'),
      meaning: p('Facts and words I can remember.', '我能记住的事实和词语。'),
      statement: p('I can say what goto does and find the x and y numbers in t.goto(80, 0).', '我能说出 goto 的作用，并找出 t.goto(80, 0) 中的 x 和 y 数字。'),
      before: p('The starter asked what we are making. It did not teach this command yet. It is fine if this is new.', '热身问的是我们要制作什么，还没有教这条指令。第一次接触它很正常。'),
      evidence: p('Think about Learn commands. Point to a goto line. Can you name what it does and which number is x?', '回想“学习指令”。指着一行 goto 代码：你能说出它的作用，以及哪个数字是 x 吗？'),
      say: p('“goto means ___. The first number is ___. The second number is ___.”', '“goto 的意思是___。第一个数字是___，第二个数字是___。”'),
      actions: {
        new: p('Read one goto example. Point to x, then y. Say the command’s meaning before you run it.', '读一条 goto 例子。先指 x，再指 y。运行前说出指令的意思。'),
        consolidating: p('Cover the example. Say what goto, x and y mean, then uncover it to check.', '遮住例子，说出 goto、x 和 y 的意思，再打开例子检查。'),
        treading: p('Predict how t.goto(-80, 40) differs from t.goto(80, 40). Explain before testing.', '预测 t.goto(-80, 40) 与 t.goto(80, 40) 有什么不同。先解释，再测试。'),
        drowning: p('Show your teacher t.goto(80, 0). Ask: “Can we read the command and the two numbers together?”', '向老师出示 t.goto(80, 0)，问：“能和我一起读这条指令及两个数字吗？”'),
        notyet: p('Start with Learn commands, practice 1. Run the ready-made line, then point to its numbers.', '从“学习指令”的练习 1 开始。运行现成的代码，再指出其中的数字。')
      }
    },
    {
      id: 'skills', group: p('Skills', '技能'), short: p('Write and test', '编写与测试'),
      meaning: p('Something I get better at by practising.', '通过练习逐渐做好的事情。'),
      statement: p('I can type a Turtle command, press Run, change one number and test it again.', '我能输入一条 Turtle 指令，点击运行，修改一个数字，再测试一次。'),
      before: p('Looking at code is not the same as running it. Choose “This is new” if you have not used a Python editor.', '看过代码不等于运行过代码。如果你没用过 Python 编辑器，可以选择“这是新内容”。'),
      evidence: p('Think about your code and drawing. Did you change a number and press Run again to check the change?', '想想你的代码和图形：你是否修改了一个数字，再点击运行来检查变化？'),
      say: p('“I changed ___ to ___. When I ran it again, the line ___.”', '“我把___改成___。再次运行时，线条___。”'),
      actions: {
        new: p('Copy one short goto line into Learn commands. Run it. Change only x, then run again.', '在“学习指令”中输入一条简短的 goto 指令并运行。只修改 x，再运行一次。'),
        consolidating: p('Write one goto line without copying. Predict where it ends, then Run and compare.', '不照抄，自己写一条 goto 指令。预测终点，再运行并比较。'),
        treading: p('Try extension 1: choose your own points for a shape. Predict it, run it and fix one difference.', '尝试拓展 1：自己选择坐标来画图形。先预测，再运行，修改一个不同之处。'),
        drowning: p('Show your teacher the first line you cannot run. Ask to check the dot, brackets and comma together.', '向老师出示第一行无法运行的代码，请老师一起检查点号、括号和逗号。'),
        notyet: p('Open Learn commands, practice 1. Press Run on the ready-made code before trying any typing.', '打开“学习指令”的练习 1。先运行现成代码，再尝试输入。')
      }
    },
    {
      id: 'understanding', group: p('Understanding', '理解'), short: p('Explain my route', '解释我的路线'),
      meaning: p('Why it works, and how I use it in a new task.', '为什么有效，以及如何用在新任务中。'),
      statement: p('I can explain why my route needs points at the turns, not just one line straight to the room.', '我能解释为什么路线要在转弯处设置坐标点，而不是直接画一条线到房间。'),
      before: p('You have seen the map, but have not drawn a Python route yet. “Not sure / not checked” is an honest answer.', '你已经看过地图，但还没有用 Python 画路线。“不确定／还没检查”是诚实的答案。'),
      evidence: p('Look at your map route. Find a turn. Explain how the next point keeps the line in a corridor, not through a wall.', '看看你的地图路线，找一个转弯处。解释下一个坐标点怎样让线条沿走廊前进，而不是穿过墙。'),
      say: p('“I used this point before turning because a straight line to the room would ___.”', '“我在转弯前用了这个坐标点，因为直接连到房间会___。”'),
      actions: {
        new: p('Trace your route with a finger. Stop at one corner and explain why you put a point there.', '用手指沿路线移动，在一个转角停下，解释为什么在那里设置坐标点。'),
        consolidating: p('Ask a partner to point to a route command. Explain which part of the drawing it makes and why it is there.', '请同伴指一条路线指令。解释它画出了哪一段，以及为什么需要这一段。'),
        treading: p('Choose a different room on the map in your discussion. Explain which points could stay and which must change.', '讨论时选择地图上的另一个房间。解释哪些坐标点可以保留，哪些必须改变。'),
        drowning: p('Show your teacher one turn on the map. Ask them to trace the two lines with you before looking at the code.', '指给老师看地图上的一个转弯处。先请老师和你一起沿两段线移动手指，再看代码。'),
        notyet: p('Start Draw my route. Find the entrance and the first corridor point before adding a line.', '从“画路线”开始。在添加线条前，先找到正门和走廊上的第一个坐标点。')
      }
    }
  ];
  const beforeOptions = [
    { id: 'independent', label: p('I already know / can do this', '我已经知道／会做'), detail: p('I can show it without an example.', '不用例子，我也能展示。') },
    { id: 'prompt', label: p('I can with an example or help', '有例子或帮助时，我可以'), detail: p('A reminder helps me get started.', '提示能帮助我开始。') },
    { id: 'new', label: p('This is new to me', '这是新内容'), detail: p('I need to learn or try it first.', '我需要先学习或尝试。') },
    { id: 'unsure', label: p('Not sure / not checked yet', '不确定／还没检查'), detail: p('I do not have evidence yet.', '我还没有证据可以判断。') }
  ];
  const phases = [
    { id: 'new', label: p('New learning', '新学习'), detail: p('It takes effort, but I am making progress.', '需要努力，但我在进步。') },
    { id: 'consolidating', label: p('Consolidating', '巩固'), detail: p('Practice is making me more confident.', '练习让我更有信心。') },
    { id: 'treading', label: p('Treading water', '原地踏步'), detail: p('This is too easy. I need a challenge.', '这太容易了，我需要挑战。') },
    { id: 'drowning', label: p('Drowning — I need help', '感到困难——我需要帮助'), detail: p('I feel stuck. I need a smaller step.', '我卡住了，需要更小的步骤。') },
    { id: 'notyet', label: p('Not attempted yet', '还没有尝试'), detail: p('I have not tried enough to judge.', '我还没充分尝试，无法判断。') }
  ];
  const evidenceOptions = [
    { id: 'command', label: p('I pointed to and explained a command.', '我指出并解释了一条指令。') },
    { id: 'test', label: p('I showed a change and its result after Run.', '我展示了一处修改和运行后的结果。') },
    { id: 'route', label: p('I showed a turn on my map and explained it.', '我指出地图上的一个转弯并解释了它。') },
    { id: 'help', label: p('I can show the part where I am stuck.', '我能指出自己卡住的部分。') },
    { id: 'notyet', label: p('I have no example yet. I need a first try.', '我还没有例子，需要先尝试。') }
  ];
  const mode = c => c?.kind === 'learning-before' ? 'before' : c?.kind === 'learning-after' ? 'after' : null;
  function get(s) {
    // Add a new record without overwriting earlier generic answers, code or navigation.
    if (!s.reflections || s.reflections.version !== 1) s.reflections = { version: 1, before: {}, after: {}, focus: '', priority: '', evidence: '', note: '', pages: { before: 0, after: 0 } };
    return s.reflections;
  }
  const options = m => m === 'before' ? beforeOptions : phases;
  const valid = (m, value) => options(m).some(o => o.id === value);
  function action(s, m, id) {
    const topic = topics.find(t => t.id === id); if (!topic) return null;
    const r = get(s), value = r[m][id]?.value;
    if (m === 'after') return topic.actions[valid(m, value) ? value : 'notyet'];
    return topic.actions[value === 'independent' ? 'treading' : value === 'prompt' ? 'consolidating' : value === 'new' ? 'new' : 'notyet'];
  }
  function missing(s, m) {
    const r = get(s), out = topics.filter(t => !valid(m, r[m][t.id]?.value)).map(t => t.id);
    if (!topics.some(t => t.id === r[m === 'before' ? 'focus' : 'priority'])) out.push('focus');
    if (m === 'after' && !evidenceOptions.some(o => o.id === r.evidence)) out.push('evidence');
    return out;
  }
  const label = (m, value) => options(m).find(o => o.id === value)?.label || p('Not recorded', '未记录');
  function render(s, m, { both, t, text, esc, B }) {
    const r = get(s), page = Math.min(topics.length, Math.max(0, r.pages[m] || 0)), after = m === 'after';
    const focus = topics.find(v => v.id === r.focus);
    let out = '<div class="reflection-cards">';
    out += `<p class="reflection-location">${after ? t('After extension choices · Before plenary · About 3 minutes','拓展选择之后 · 课堂小结之前 · 约 3 分钟') : t('After the starter · Before Learn commands · About 2 minutes','热身之后 · 学习指令之前 · 约 2 分钟')}</p>`;
    out += `<nav class="reflection-tabs" aria-label="${text('Reflection checks','反思检查')}">${topics.map((v,i) => `<button data-reflection-page="${i}" ${page===i?'aria-current="step"':''}>${i+1}. ${both(v.group)}${valid(m,r[m][v.id]?.value)?'<span class="reflection-tick" aria-label="Saved"> ✓</span>':''}</button>`).join('')}<button data-reflection-page="3" ${page===3?'aria-current="step"':''}>4. ${t('My next step','我的下一步')}</button></nav>`;
    if (page < topics.length) {
      const topic = topics[page], value = r[m][topic.id]?.value;
      if (page === 0) out += `<p class="reflection-intro">${after ? t('Review the same three checks using your code or drawing. Skipping an extension is fine. These are feelings about this task, not grades.','用你的代码或图形回顾同样的三个检查。没做拓展也可以。这些是对本任务的感受，不是成绩。') : t('Our WAGBA is to draw, test and improve a Turtle route. We will remember facts, practise skills and explain why it works. These are not fixed types of learner.','我们的目标是画出、测试并改进 Turtle 路线。我们要记住知识、练习技能，并解释原因。这不是给学生分成固定的类型。')}</p>`;
      const advice = valid(m,value) ? `<section class="reflection-advice ${value==='drowning'?'needs-help':''}" role="status"><strong>${t('A useful next step','有用的下一步')}</strong><p>${both(action(s,m,topic.id))}</p>${value==='drowning'?`<p>${t('Tell your teacher or show this card. Saving does not send an alert.','请告诉老师，或向老师展示这张卡片。保存不会自动通知老师。')}</p>`:''}</section>` : '';
      out += `<div class="reflection-layout"><div><section class="reading"><span class="tag">${both(topic.group)} · ${both(topic.meaning)}</span><h2 id="reflection-statement">${both(topic.statement)}</h2><p>${both(after?topic.evidence:topic.before)}</p>${after?`<p class="reflection-before"><strong>${t('At the start I chose:','开始时我选择了：')}</strong> ${both(label('before',r.before[topic.id]?.value))}</p>`:''}</section>${after?B('Look at my code and drawing','查看我的代码和图形','reflection-work','reflection-work-link'):''}${advice}</div><fieldset class="question reflection-question" id="reflection-question" aria-describedby="reflection-statement"><legend>${after?t('Where am I with this today?','今天，我在这一项处于什么状态？'):t('What is my starting point? Choose one.','我的起点是什么？选择一项。')}</legend><div class="reflection-options">${options(m).map(o=>`<label class="choice reflection-option"><input type="radio" name="reflection-choice" data-reflection-choice="${o.id}" value="${o.id}" ${o.id===value?'checked':''}><span><strong>${both(o.label)}</strong><span class="reflection-definition">${both(o.detail)}</span></span></label>`).join('')}</div></fieldset></div>`;
    } else {
      out += `<p>${after?t('You may feel different about each topic. Choose ONE thing to work on next.','你对每个主题的感受可能不同。选择接下来要练习的一项。'):t('Choose ONE focus to help you reach today’s WAGBA. You will still practise all three.','选择一项重点，帮助你达到今天的学习目标。三项内容都会练习。')}</p>`;
      if(after&&focus)out+=`<p class="reflection-before">${t('My starting focus was:','我开始时的重点是：')} <strong>${both(focus.group)} · ${both(focus.short)}</strong></p>`;
      out+=`<div class="reflection-summary">${topics.map((v,i)=>`<button data-reflection-page="${i}" class="reflection-summary-item"><strong>${both(v.group)} · ${both(v.short)}</strong><span>${after?t('Before: ','开始：')+both(label('before',r.before[v.id]?.value))+'<br>'+t('Now: ','现在：'):''}${both(label(m,r[m][v.id]?.value))}</span></button>`).join('')}</div>`;
      const chosen=r[after?'priority':'focus'];
      out+=`<label class="form-line" for="reflection-focus">${after?t('My next focus','我的下一个重点'):t('My focus for today','我今天的重点')}</label><select id="reflection-focus" class="reflection-select"><option value="">${text('Choose one topic','选择一个主题')}</option>${topics.map(v=>`<option value="${v.id}" ${v.id===chosen?'selected':''}>${text(v.group.en+' · '+v.short.en,v.group.zh+' · '+v.short.zh)}</option>`).join('')}</select>`;
      if(chosen&&topics.some(v=>v.id===chosen))out+=`<div class="reflection-advice"><strong>${t('How I can get better','我可以怎样进步')}</strong><p>${both(action(s,m,chosen))}</p><p class="muted">${both(topics.find(v=>v.id===chosen).say)}</p></div>`;
      if(after){out+=`<label class="form-line" for="reflection-evidence">${t('Point to your work and say one sentence. What can you show?','指着你的作品，说一句话。你能展示什么？')}</label><select id="reflection-evidence" class="reflection-select"><option value="">${text('Choose what you can show — help or not tried is OK','选择你能展示的内容——需要帮助或还没尝试也可以')}</option>${evidenceOptions.map(o=>`<option value="${o.id}" ${r.evidence===o.id?'selected':''}>${text(o.label.en,o.label.zh)}</option>`).join('')}</select><label class="form-line" for="reflection-note">${t('Optional: a short note for your teacher','选填：给老师的一句简短说明')}</label><textarea id="reflection-note" class="reflection-select" rows="2" maxlength="350" placeholder="${text('I changed… / Please help me with…','我修改了……／请帮助我……')}">${esc(r.note)}</textarea>`;}
      out+=`<p class="reflection-footnote">${t('No right or wrong rating. Your choices and next step go in your PDF. If you need help now, tell your teacher; this app cannot alert them.','自评没有对错。你的选择和下一步会写入 PDF。如果现在需要帮助，请告诉老师；本应用不会自动通知老师。')}</p>`;
    }
    return out+'</div>';
  }
  const api = { topics, beforeOptions, phases, evidenceOptions, mode, get, options, valid, action, missing, label, render };
  root.LearningChecks = api; if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
