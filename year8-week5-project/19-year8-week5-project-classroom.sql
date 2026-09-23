-- Step 19: enable Year 8 Week 5 Project cards and shared slides.
-- Preserves prior lessons; no student work is stored in Supabase.
begin;
create or replace function classroom_private.valid_lesson_stage(p_lesson text,p_stage text)
returns boolean language sql immutable set search_path='' as $$
 select coalesce(case p_lesson
 when 'year9-week3-project' then classroom_private.valid_stage(p_stage)
 when 'year9-week5-theory' then p_stage in ('read','starter','types','nested-read','parsons','debug','program','validation-read','validation','pit','plenary','extension','submit','fact-nested','fact-validation','fact-boundary')
 -- read is the existing RPC's supported-lesson probe; actual Year 8 cards use the IDs below.
 when 'year8-week5-theory' then p_stage in ('read','mission','starter1','starter2','starter3','starter4','starter5','sp1','sp2','sp3','sp4','sp5','before','six','match','condition0','condition1','condition2','condition3','condition4','condition5','condition6','condition7','trace-model','path0','path1','path2','output1','output2','syntax-read','mp1','mp2','mp3','indent1','indent2','debug1','debug2','pp1','pp2','code1','code2','code3','ext1','ext2','ext3','after','exit-operators','exit-path','review')
 when 'Year11_week5_session2' then p_stage in ('intro','start','before','read','main1','creation','main2','pit','exit','extension','submit','fact1','fact2','fact3')
 when 'Year11_week5_session3' then p_stage in ('read','start','before','main1','sql','main2','pit','exit','extension','mark','submit','slide-read','slide-fact-key','slide-start','slide-before','slide-main1','slide-sql','slide-fact-sql','slide-fact-limit','slide-main2','slide-extension','slide-mark','slide-pit','slide-exit','slide-submit')
 when 'year7-week5-theory' then p_stage in ('read','loop','indent','starter','types','predict','investigate','modify','make','errors','debug1','debug2','debug3','debug-level','pitstop','plenary','extension','poster','export','slide-loop','slide-indent','slide-starter','slide-types','slide-predict','slide-investigate','slide-modify','slide-make','slide-errors','slide-debug1','slide-debug2','slide-debug3','slide-debug-level','slide-pitstop','slide-plenary','slide-extension','slide-poster','slide-export','slide-fact-loop','slide-fact-indent','slide-fact-debug')
 when 'year8-week5-project' then p_stage in ('read','read-check','predict','baseline','brief','setup','build','personalise','test-read','tests','feedback','transfer','extension','pitstop','plenary','review','slide-read','slide-read-check','slide-predict','slide-baseline','slide-brief','slide-setup','slide-build','slide-personalise','slide-test-read','slide-tests','slide-feedback','slide-transfer','slide-extension','slide-pitstop','slide-plenary','slide-review','slide-fact-event','slide-fact-boundary','slide-fact-test')
 else false end,false);
$$;
revoke all on function classroom_private.valid_lesson_stage(text,text) from public,anon,authenticated;
commit;
select classroom_private.valid_lesson_stage('year8-week5-project','read') as year8_project_classroom_ready;
