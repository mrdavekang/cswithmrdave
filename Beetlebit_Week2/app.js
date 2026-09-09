import {startLesson,resumeLesson} from './lesson.js';
const entry = document.querySelector('#entry');
entry?.addEventListener('submit', async event => {
  event.preventDefault();
  const name = document.querySelector('#student-name').value.trim();
  const klass = document.querySelector('#student-class').value.trim();
  if (!name || (name.toLowerCase() !== 'teacher' && !klass)) return;
  await startLesson({name,klass,teacher:name.toLowerCase()==='teacher'});
});
await resumeLesson();
document.querySelector('#student-name')?.addEventListener('input',event=>{
  document.querySelector('#student-class').required = event.target.value.trim().toLowerCase()!=='teacher';
});
