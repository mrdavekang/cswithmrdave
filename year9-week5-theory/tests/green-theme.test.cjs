const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),index=fs.readFileSync(root+'/index.html','utf8'),css=fs.readFileSync(root+'/green-theme.css','utf8');
assert(index.includes('green-theme.css?v=1'),'green theme must be loaded');assert(index.indexOf('green-theme.css')>index.indexOf('lesson-clock.css'),'green theme must load after component styles');
for(const token of ['--school-green:#00833c','--school-deep:#005229','--school-paper:#f4faf5'])assert(css.includes(token),token);
for(const selector of ['body{','#classroom-root{','.fact-slide{','#live-demo{','#lesson-clock{','.ide-toolbar{','.console-pane{'])assert(css.includes(selector),selector);
for(const oldBlue of ['#285fce','#336eaa','#102c3c','#17243a','#087ea4'])assert(!css.includes(oldBlue),`theme reintroduced old blue ${oldBlue}`);
const classroom=fs.readFileSync(root+'/classroom.css','utf8');assert(classroom.includes('body.cm-has-dock #app{zoom:var(--teacher-content-zoom,1)}'));assert(classroom.includes('#classroom-root.cm-collapsed'));assert(classroom.includes('.cm-dock-body{display:none}'));
console.log('PASS school-green theme covers lesson, IDE, facts, classroom remote, live demonstration and lesson clock.');
