// Only the arithmetic and SUM needed by this assessment. No JavaScript evaluation.
(function (root) {
  const cell = /^[A-D][1-9]$/;
  const number = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  const result = (cells, addr) => {
    const pending = new Set();
    function read(key) {
      if (!cell.test(key)) throw Error('#REF!');
      if (pending.has(key)) throw Error('#CYCLE!');
      const v = String(cells[key] ?? '').trim();
      if (!v) return null;
      if (number.test(v)) return Number(v);
      if (!v.startsWith('=')) return v;
      pending.add(key);
      const value = parse(v.slice(1).toUpperCase().replace(/[−–]/g,'-').replace(/×/g,'*').replace(/÷/g,'/'));
      pending.delete(key);
      return value;
    }
    function parse(raw) {
      if (raw.length > 200) throw Error('#ERROR!');
      const ts = raw.match(/SUM|[A-Z]+\d+|\d+(?:\.\d*)?|\.\d+|[^\s]/g) || [];
      let at = 0;
      const has = t => ts[at] === t;
      const take = t => has(t) && !!++at;
      const need = t => { if (!take(t)) throw Error('#ERROR!'); };
      function n(x) { if (x === null) return 0; if (typeof x !== 'number') throw Error('#VALUE!'); return x; }
      function atom() {
        if (take('+')) return atom();
        if (take('-')) return -atom();
        if (take('(')) { const v = expr(); need(')'); return v; }
        if (take('SUM')) {
          need('(');
          let total = 0;
          do {
            if (cell.test(ts[at] || '') && ts[at + 1] === ':') {
              const a = ts[at++]; at++; const b = ts[at++];
              if (!cell.test(b || '')) throw Error('#REF!');
              for (let c = Math.min(a.charCodeAt(0),b.charCodeAt(0)); c <= Math.max(a.charCodeAt(0),b.charCodeAt(0)); c++) {
                for (let r = Math.min(+a[1],+b[1]); r <= Math.max(+a[1],+b[1]); r++) {
                  const val = read(String.fromCharCode(c)+r);
                  if (typeof val === 'number') total += val;
                }
              }
            } else if (cell.test(ts[at] || '') && [',',')'].includes(ts[at+1])) {
              const val=read(ts[at++]); if(typeof val==='number') total+=val;
            } else total += expr();
          } while (take(','));
          need(')'); return total;
        }
        const t = ts[at++];
        if (number.test(t || '')) return Number(t);
        if (/^[A-Z]+\d+$/.test(t || '')) return n(read(t));
        throw Error('#ERROR!');
      }
      function prod() {
        let v=atom();
        for (;;) {
          if (take('*')) v *= atom();
          else if (take('/')) {const divisor=atom(); if (divisor===0) throw Error('#DIV/0!'); v /= divisor;}
          else return v;
        }
      }
      function expr() {
        let v=prod();
        for (;;) {
          if (take('+')) v+=prod();
          else if (take('-')) v-=prod();
          else return v;
        }
      }
      const value = expr();
      if (at !== ts.length) throw Error('#ERROR!');
      if (!Number.isFinite(value)) throw Error('#NUM!');
      return value;
    }
    try { return {value:read(addr)}; } catch (e) { return {error:e.message}; }
  };
  const BUILDCELLS = ['D2','B8','D5','D6'];
  function formulaRequirement(raw){
    const entered=String(raw??'').trim();
    if(!entered)return 'blank';
    if(!entered.startsWith('='))return 'equals';
    return /\b[A-D][1-9]\b/i.test(entered) ? '' : 'reference';
  }
  const fmt = ({value,error}) => error || (value == null ? '' : typeof value === 'number' ? String(Number(value.toFixed(8))) : value);
  const applied = (content, state, model = false, withDrafts = false) => {
    const base = {...content[model?'model':'build']};
    const keys = model ? ['B2'] : BUILDCELLS;
    for (const key of keys) {
      const s = state[model?'model':'cells']?.[key];
      if (!s) continue;
      if (typeof s.applied === 'string') base[key]=s.applied;
      if (withDrafts && typeof s.raw === 'string') base[key]=s.raw;
    }
    if(model){
      const qty=String(base.B2??'').trim();
      if(qty&&!number.test(qty))base.D2=base.D4=base.D5='Not a number';
      else{
        base.D2=Number(qty)*Number(base.C2);
        base.D4=base.D2+Number(base.D3);
        base.D5=Number(base.B5)+Number(base.B6)-base.D4;
      }
    }
    return base;
  };
  const api={result,fmt,applied,BUILDCELLS,formulaRequirement};
  if (typeof module !== 'undefined') module.exports=api;
  else root.ExamSheet=api;
})(globalThis);
