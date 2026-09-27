const assert=require('node:assert/strict');
global.window=global;
require('../session-plan.js');
const p=window.SESSION_PLAN;
assert.equal(p.start,840);assert.equal(p.end,900);assert.equal(p.stages[0].start,840);assert.equal(p.stages.at(-1).end,900);
for(let i=1;i<p.stages.length;i++)assert.equal(p.stages[i-1].end,p.stages[i].start,`gap before ${p.stages[i].title}`);
assert.deepEqual(p.stages.map(s=>s.end-s.start),[6,5,3,14,7,16,3,4,2]);
assert.ok(p.stages.every(s=>s.steps.length===3));
console.log('session plan: 14:00–15:00, continuous 60 minutes');
