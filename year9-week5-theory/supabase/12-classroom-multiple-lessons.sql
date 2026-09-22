-- Step 12: use a permanent class ID across supported lesson URLs.
-- Run once after steps 10 and 11. Safe to rerun with active sessions.
-- A class ID identifies its teacher-owned class; session.lesson identifies the lesson.
-- No tables, accounts, student data or shared URLs are changed.
begin;
create or replace function public.classroom_class_snapshot(p_class_id uuid,p_lesson text)
returns jsonb language sql stable security definer set search_path='' as $$
 select classroom_private.snapshot(s) from classroom_private.sessions s
 join classroom_private.classes c on c.id=s.class_id and c.teacher_id=s.teacher_id
 where c.id=p_class_id and s.lesson=p_lesson and s.expires_at>statement_timestamp()
 order by s.created_at desc limit 1;
$$;
create or replace function public.classroom_class_current(p_class_id uuid,p_lesson text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.classroom_is_teacher() or not exists (
  select 1 from classroom_private.classes where id=p_class_id and teacher_id=auth.uid()
 ) then raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
 if not classroom_private.valid_lesson_stage(p_lesson,'read') then raise exception 'Unsupported lesson' using errcode='22023'; end if;
 return public.classroom_class_snapshot(p_class_id,p_lesson);
end;
$$;
create or replace function public.classroom_class_start(p_class_id uuid,p_lesson text,p_stage text default 'read')
returns jsonb language plpgsql security definer set search_path='' as $$
declare s classroom_private.sessions%rowtype; started_at timestamptz;
begin
 if not public.classroom_is_teacher() then raise exception 'Teacher sign-in required' using errcode='42501'; end if;
 -- Serialise concurrent starts on the permanent class, not on a student identity.
 perform 1 from classroom_private.classes where id=p_class_id and teacher_id=auth.uid() for update;
 if not found then raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
 if not classroom_private.valid_lesson_stage(p_lesson,p_stage) then raise exception 'Unknown lesson stage' using errcode='22023'; end if;
 started_at:=clock_timestamp();
 delete from classroom_private.sessions where class_id=p_class_id and lesson=p_lesson and expires_at<=started_at;
 select * into s from classroom_private.sessions where class_id=p_class_id and lesson=p_lesson and expires_at>started_at order by created_at desc limit 1;
 if not found then
  insert into classroom_private.sessions(teacher_id,class_id,lesson,stage,created_at,expires_at)
  values(auth.uid(),p_class_id,p_lesson,p_stage,started_at,started_at+interval '2 hours') returning * into s;
 end if;
 return classroom_private.snapshot(s);
end;
$$;

-- CREATE OR REPLACE preserves prior grants; state them explicitly for auditability.
revoke all on function public.classroom_class_snapshot(uuid,text) from public,anon,authenticated;
revoke all on function public.classroom_class_current(uuid,text) from public,anon,authenticated;
revoke all on function public.classroom_class_start(uuid,text,text) from public,anon,authenticated;
grant execute on function public.classroom_class_snapshot(uuid,text) to anon,authenticated;
grant execute on function public.classroom_class_current(uuid,text) to authenticated;
grant execute on function public.classroom_class_start(uuid,text,text) to authenticated;
notify pgrst,'reload schema';
commit;
select true as multiple_lessons_ready;
