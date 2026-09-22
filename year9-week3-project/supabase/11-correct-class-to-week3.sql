-- Correct the existing permanent class to Year 9 Week 3.
-- Run after step 10. No new project, account, key or class link is needed.
begin;
alter table classroom_private.classes drop constraint if exists classes_lesson_check;
alter table classroom_private.classes add constraint classes_lesson_check
 check (lesson in ('year9-week3-project','year9-week5-theory'));
do $$
declare registered classroom_private.classes%rowtype;
begin
 select * into registered from classroom_private.classes
 where id='c429701c-21c3-4e99-b84d-c2faadca7afb' for update;
 if not found or registered.teacher_id<>'6901b13b-437c-4c79-ad01-a6bfc75f6a62' then
  raise exception 'Expected class/teacher registration not found. Do not create a new class; check step 10.';
 end if;
 if registered.lesson <> 'year9-week3-project' then
  if exists(select 1 from classroom_private.sessions where class_id=registered.id and expires_at>clock_timestamp()) then
   raise exception 'End the current Week 5 classroom first, then run this correction again.';
  end if;
  update classroom_private.classes set lesson='year9-week3-project' where id=registered.id;
 end if;
end $$;
commit;
select id as class_id, lesson, true as week3_classroom_ready
from classroom_private.classes where id='c429701c-21c3-4e99-b84d-c2faadca7afb';
