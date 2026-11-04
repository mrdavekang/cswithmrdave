(function (root) {
  'use strict';
  const ref = /^[A-Z][1-9]\d*$/;
  const blank = x => x == null || String(x).trim() === '';
  const numeric = x => /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(String(x).trim());
  function evaluate(cells, address, overrides = {}) {
    const path = new Set(), cache = new Map();
    const fail = message => { throw new Error(message); };
    const read = a => {
      if (cache.has(a)) return cache.get(a);
      if (path.has(a)) fail('This formula refers back to ' + a + '. Use a different cell.');
      if (!ref.test(a) || +a.slice(1) > 12 || a[0] > 'H') fail(a + ' is outside this worksheet.');
      const v = String(Object.hasOwn(overrides, a) ? overrides[a] : cells[a] ?? '').trim();
      if (!v.startsWith('=')) return blank(v) ? null : numeric(v) ? Number(v) : v;
      path.add(a);
      const answer = parse(v.slice(1));
      path.delete(a);
      cache.set(a, answer);
      return answer;
    };
    const number = v => {
      if (v === null) return 0;
      if (typeof v !== 'number') fail('A cell in this calculation contains words. Check the cell references.');
      return v;
    };
    function parse(source) {
      const s = source.toUpperCase().replace(/[−–]/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
      if (s.length > 256) fail('Keep this formula under 256 characters.');
      const tokens = [];
      let rest = s.trimStart();
      while (rest.length) {
        const token = rest.match(/^(?:[A-Z][1-9]\d*|[A-Z]+|\d+(?:\.\d*)?|\.\d+|[+*/(),:\-])/);
        if (!token) fail('Use numbers, cell names, +, -, *, /, brackets or SUM.');
        tokens.push(token[0]);
        rest = rest.slice(token[0].length).trimStart();
      }
      let i = 0;
      const peek = () => tokens[i];
      const take = t => peek() === t && (++i, true);
      const need = t => { if (!take(t)) fail('Expected ' + t + '. Check the formula bar.'); };
      function atom() {
        if (take('+')) return atom();
        if (take('-')) return -atom();
        if (take('(')) { const n = expression(); need(')'); return n; }
        if (take('SUM')) {
          need('(');
          let total = 0;
          do {
            if (ref.test(peek() || '') && tokens[i + 1] === ':') {
              const start = tokens[i++]; i++;
              const end = tokens[i++];
              if (!ref.test(end || '') || end[0] > 'H' || start[0] > 'H' ||
                  Math.max(+start.slice(1), +end.slice(1)) > 12) fail('Use a range on this sheet, for example B2:B4.');
              for (let c = Math.min(start.charCodeAt(0), end.charCodeAt(0)); c <= Math.max(start.charCodeAt(0), end.charCodeAt(0)); c++) {
                for (let r = Math.min(+start.slice(1), +end.slice(1)); r <= Math.max(+start.slice(1), +end.slice(1)); r++) {
                  const v = read(String.fromCharCode(c) + r);
                  if (typeof v === 'number') total += v;
                }
              }
            } else if (ref.test(peek() || '') && [',', ')'].includes(tokens[i + 1])) {
              const v = read(tokens[i++]); if (typeof v === 'number') total += v;
            } else total += expression();
          } while (take(','));
          need(')');
          return total;
        }
        const token = tokens[i++];
        if (ref.test(token || '')) return number(read(token));
        if (numeric(token)) return Number(token);
        fail('Enter a number or cell reference here. Example: =B2*C2');
      }
      function product() {
        let n = atom();
        for (;;) {
          if (take('*')) n *= atom();
          else if (take('/')) {
            const d = atom();
            if (d === 0) fail('You cannot divide by zero. Check the number you are dividing by.');
            n /= d;
          } else return n;
        }
      }
      function expression() {
        let n = product();
        for (;;) {
          if (take('+')) n += product();
          else if (take('-')) n -= product();
          else return n;
        }
      }
      const n = expression();
      if (i !== tokens.length) fail('There is extra text or a missing operator. Check the formula bar.');
      if (!Number.isFinite(n)) fail('This calculation is too large.');
      return n;
    }
    try { return { value: read(address) }; }
    catch (e) { return { error: e.message }; }
  }
  const shift = (value, delta) => /^\s*=/.test(value) ? value.replace(/\b([A-H])([1-9]\d*)\b/gi, (_, c, r) => c + (+r + delta)) : value;
  const api = { evaluate, shift, numeric };
  if (typeof module !== 'undefined') module.exports = api;
  else root.SheetEngine = api;
})(globalThis);
