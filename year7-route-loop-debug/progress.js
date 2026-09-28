/* One source of truth for student progression; correctness is not a navigation gate. */
(() => {
  const L = window.LOOP_LESSON;
  const filled = v => v !== undefined && v !== null && String(v).trim() !== '';
  const node = (page, cid, mi = 0) => ({page, cid, mi});
  const id = n => n.page === 'challenge' ? `${n.cid}:${n.mi}` : n.page;
  const cycle = cid => L.models.map((_, mi) => node('challenge', cid, mi));
  const core = ['square', 'countbug', 'indentbug'];
  const path = ['overview','starter','types','loop-guide','body-guide','task1'].map(p=>node(p))
    .concat(cycle('square'), [node('task2')], cycle('countbug').slice(1,5), cycle('indentbug').slice(1,5),
      ['feedback','extension','pitstop','plenary','export'].map(p=>node(p)));
  function requirements(s, n) {
    const a = s.answers || {}, result = [];
    const add = (label, done, selector) => result.push({label, done:!!done, selector});
    if(n.page === 'challenge') {
      const w = s.work?.[n.cid] || {}, m = L.models[n.mi], runs = w.runs?.[m] || [];
      if(m === 'parsons') add('Arrange the strips, then press Check my order.', w.checks?.parsons?.length, '[data-action="check-order"]');
      if(m === 'predict') add('Choose your prediction. A guess is OK.', filled(w.answers?.predict), '[name="predict"]');
      if(m === 'investigate') add('Choose an explanation for the code.', filled(w.answers?.investigate), '[name="investigate"]');
      if(['run','modify','make'].includes(m)) {
        add(m==='run'?'Run the prepared code.':'Run your latest code, even if it still has a bug.', runs.length && (m==='run' || runs.at(-1).code===w.codes?.[m]), '[data-action="run"]');
        if(m==='run') add('Choose how the output compared with your prediction.', filled(w.answers?.compare), '[name="compare"]');
        else if(m==='make'||n.cid!=='square') add(m==='modify'?'Write what you changed and what happened. A short phrase is enough.':'Explain one part of your code. A short phrase is enough.', filled(w.notes?.[m]), '#'+m);
        if(m==='make') add('Choose how your drawing matches the requirements. You can choose “I need help”.', filled(w.answers?.selfcheck), '[name="selfcheck"]');
        if(m==='modify') add('Compare your drawing with the target. “I need help” is accepted.', filled(w.answers?.targetCheck), '[name="targetCheck"]');
      }
    } else if(n.page==='starter') add('Choose the move-and-turn pair.', filled(a.start), '[name="start"]');
    else if(n.page==='types') ['k','s','u'].forEach((k,i)=>add('Choose your starting point for '+['Knowledge','Skills','Understanding'][i]+'.', filled(a['rating-'+k]), '#rating-'+k));
    else if(n.page==='feedback') {
      add('Write what your partner (or you) noticed.', filled(a.partner), '#partner');
      add('Write what you changed and tested.', filled(a.improvement), '#improvement');
    } else if(n.page==='pitstop') {
      add('Choose your learning phase. All four choices are accepted.', filled(a.phase), '[name="phase"]');
      add('Write one next step to help you learn.', filled(a.nextStep), '#nextStep');
    } else if(n.page==='plenary') ['exit1','exit2','exit3'].forEach(k=>add('Attempt final question '+k.slice(-1)+'.', filled(a[k]), '[name="'+k+'"]'));
    return result;
  }
  function done(s,n) {
    if(n.page==='export') return !!s.answers?.submitted;
    const r=requirements(s,n);
    return r.length ? r.every(x=>x.done) : !!s.read?.[id(n)];
  }
  const first = s => path.findIndex(n=>!done(s,n));
  function allowed(s,n) {
    if(s.teacher || n.page==='export') return true; // Draft report is always available.
    const i=path.findIndex(p=>id(p)===id(n)), f=first(s);
    if(i>=0) return f<0 || i<=f;
    if(n.page==='challenge' && L.challenges.some(c=>c.id===n.cid)) {
      const e=path.findIndex(p=>p.page==='extension');
      return (f<0 || f>=e) && L.models.slice(0,n.mi).every((_,mi)=>done(s,node('challenge',n.cid,mi)));
    }
    return false;
  }
  window.LessonProgress={path,core,id,node,requirements,done,allowed,first};
})();
