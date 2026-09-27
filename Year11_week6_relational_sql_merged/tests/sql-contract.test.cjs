const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const sql=fs.readFileSync(path.join(__dirname,'../supabase/24-year11-week6-relational-sql-latest.sql'),'utf8');
assert.match(sql,/when 'Year11_week6_relational_sql_merged' then p_stage in/);
for(let i=0;i<12;i++){assert(sql.includes(`'page-${i}'`));assert(sql.includes(`'slide-lesson-${i}'`))}
for(const id of ['slide-fact-keys','slide-fact-where','slide-fact-safety','insert-student','update-email','update-returned','delete-loan'])assert(sql.includes(`'${id}'`),id);
for(const prior of ['year9-week3-project','year9-week5-theory','year8-week5-theory','Year11_week5_session2','Year11_week5_session3','year7-week5-theory','year8-week5-project','year8-week3-project'])assert(sql.includes(`'${prior}'`),prior);
assert.doesNotMatch(sql,/student_name|class_name|student_answer/i);
assert.match(sql,/year11_week6_relational_sql_latest_ready/);
console.log('SQL contract: Year 11 stages/demo allowlist added and prior lesson routes retained');
