-- Step 10: Permanent Week 5 classroom link. Run the whole file once (safe to rerun).
-- Requires the previously installed classroom setup, steps 5–9.
-- Keeps only the class-to-teacher mapping permanently; no student records.
begin;
create table if not exists classroom_private.classes (
 id uuid primary key,
 teacher_id uuid not null references classroom_private.teachers(user_id) on delete cascade,
 lesson text not null check (lesson in ('year9-week5-theory'))
);
alter table classroom_private.classes enable row level security;
revoke all on classroom_private.classes from public, anon, authenticated;
-- Preserve the exact link already shared in Teams. Never reassign an existing class.
insert into classroom_private.classes(id,teacher_id,lesson)
values ('c429701c-21c3-4e99-b84d-c2faadca7afb','6901b13b-437c-4c79-ad01-a6bfc75f6a62','year9-week5-theory')
on conflict (id) do nothing;
do $$ begin
 if not exists (select 1 from classroom_private.classes where id='c429701c-21c3-4e99-b84d-c2faadca7afb' and teacher_id='6901b13b-437c-4c79-ad01-a6bfc75f6a62' and lesson='year9-week5-theory') then
  raise exception 'This permanent class belongs to a different teacher or lesson';
 end if;
end $$;
alter table classroom_private.sessions add column if not exists class_id uuid references classroom_private.classes(id) on delete cascade;
alter table classroom_private.sessions add column if not exists lesson text not null default 'year9-week3-project';
create index if not exists classroom_sessions_class_expiry on classroom_private.sessions(class_id,expires_at);
create or replace function classroom_private.valid_lesson_stage(p_lesson text,p_stage text)
returns boolean language sql immutable set search_path='' as $$
 select coalesce(case p_lesson
 when 'year9-week3-project' then classroom_private.valid_stage(p_stage)
 when 'year9-week5-theory' then p_stage in ('read','starter','types','nested-read','parsons','debug','program','validation-read','validation','pit','plenary','extension','submit')
 else false end,false);
$$;
revoke all on function classroom_private.valid_lesson_stage(text,text) from public,anon,authenticated;
alter table classroom_private.sessions drop constraint if exists classroom_stage_valid;
alter table classroom_private.sessions add constraint classroom_stage_valid check (classroom_private.valid_lesson_stage(lesson,stage));
create or replace function classroom_private.snapshot(p_session classroom_private.sessions)
returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('version',1,'lesson',p_session.lesson,'class_id',p_session.class_id,
 'session_id',p_session.id,'stage',p_session.stage,'locked',p_session.locked,
 'revision',p_session.revision,'bring_revision',p_session.bring_revision,
 'expires_at',p_session.expires_at,'server_now',statement_timestamp(),'ended',false);
$$;
create or replace function public.classroom_current_session()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  result jsonb;
begin
  if not public.classroom_is_teacher() then
    raise exception 'Teacher sign-in required' using errcode = '42501';
  end if;
  select classroom_private.snapshot(s) into result
  from classroom_private.sessions s
  where s.teacher_id = auth.uid() and s.class_id is null and s.expires_at > statement_timestamp()
  order by s.created_at desc limit 1;
  return result;
end;
$$;
create or replace function public.classroom_start(p_stage text default 'read')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  session_row classroom_private.sessions%rowtype;
  caller uuid := auth.uid();
  started_at timestamptz;
begin
  perform 1 from classroom_private.teachers where user_id = caller for update;
  if not found then
    raise exception 'Teacher sign-in required' using errcode = '42501';
  end if;
  if not classroom_private.valid_stage(p_stage) then
    raise exception 'Unknown lesson stage' using errcode = '22023';
  end if;
  started_at := clock_timestamp();
  delete from classroom_private.sessions
  where teacher_id = caller and expires_at <= started_at;
  select * into session_row from classroom_private.sessions
  where teacher_id = caller and class_id is null and expires_at > started_at
  order by created_at desc limit 1;
  if not found then
    insert into classroom_private.sessions(teacher_id, stage, created_at, expires_at)
    values(caller, p_stage, started_at, started_at + interval '2 hours')
    returning * into session_row;
  end if;
  return classroom_private.snapshot(session_row);
end;
$$;
create or replace function public.classroom_control(
  p_session_id uuid,
  p_action text,
  p_expected_revision bigint,
  p_stage text default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  session_row classroom_private.sessions%rowtype;
  result jsonb;
begin
  if not public.classroom_is_teacher() then
    raise exception 'Teacher sign-in required' using errcode = '42501';
  end if;
  select * into session_row from classroom_private.sessions
  where id = p_session_id and teacher_id = auth.uid() for update;
  if not found or session_row.expires_at <= clock_timestamp() then
    raise exception 'Classroom session unavailable' using errcode = '42501';
  end if;
  if p_action is null or p_action not in ('lock', 'bring', 'unlock', 'end') then
    raise exception 'Unknown classroom action' using errcode = '22023';
  end if;
  if p_expected_revision is null or p_expected_revision <> session_row.revision then
    raise exception 'Session changed; refresh its state before trying again'
      using errcode = '40001';
  end if;
  if p_action = 'bring' and not classroom_private.valid_lesson_stage(session_row.lesson, p_stage) then
    raise exception 'Choose a valid lesson stage' using errcode = '22023';
  end if;
  if p_action <> 'bring' and p_stage is not null then
    raise exception 'Only Bring Everyone Here changes the stage'
      using errcode = '22023';
  end if;

  session_row.revision := session_row.revision + 1;
  if p_action = 'end' then
    session_row.locked := false;
    result := classroom_private.snapshot(session_row)
      || jsonb_build_object('ended', true);
    delete from classroom_private.sessions where id = session_row.id;
    return result;
  elsif p_action = 'bring' then
    session_row.stage := p_stage;
    session_row.bring_revision := session_row.bring_revision + 1;
  elsif p_action = 'lock' then
    session_row.locked := true;
  elsif p_action = 'unlock' then
    session_row.locked := false;
  end if;

  update classroom_private.sessions
  set stage = session_row.stage, locked = session_row.locked,
      revision = session_row.revision, bring_revision = session_row.bring_revision
  where id = session_row.id returning * into session_row;
  return classroom_private.snapshot(session_row);
end;
$$;

-- Public lookup is limited to this exact, unguessable class ID and lesson.
-- Inactive/missing classrooms return null; no roster, identity or history is exposed.
create or replace function public.classroom_class_snapshot(p_class_id uuid,p_lesson text)
returns jsonb language sql stable security definer set search_path='' as $$
 select classroom_private.snapshot(s) from classroom_private.sessions s
 join classroom_private.classes c on c.id=s.class_id and c.teacher_id=s.teacher_id and c.lesson=s.lesson
 where c.id=p_class_id and c.lesson=p_lesson and s.expires_at>statement_timestamp()
 order by s.created_at desc limit 1;
$$;
create or replace function public.classroom_class_current(p_class_id uuid,p_lesson text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not public.classroom_is_teacher() or not exists (
  select 1 from classroom_private.classes where id=p_class_id and lesson=p_lesson and teacher_id=auth.uid()
 ) then raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
 return public.classroom_class_snapshot(p_class_id,p_lesson);
end;
$$;
create or replace function public.classroom_class_start(p_class_id uuid,p_lesson text,p_stage text default 'read')
returns jsonb language plpgsql security definer set search_path='' as $$
declare s classroom_private.sessions%rowtype; started_at timestamptz;
begin
 if not public.classroom_is_teacher() then raise exception 'Teacher sign-in required' using errcode='42501'; end if;
 -- Serialise concurrent starts on the permanent class, not on a student identity.
 perform 1 from classroom_private.classes where id=p_class_id and lesson=p_lesson and teacher_id=auth.uid() for update;
 if not found then raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
 if not classroom_private.valid_lesson_stage(p_lesson,p_stage) then raise exception 'Unknown lesson stage' using errcode='22023'; end if;
 started_at:=clock_timestamp();
 delete from classroom_private.sessions where class_id=p_class_id and expires_at<=started_at;
 select * into s from classroom_private.sessions where class_id=p_class_id and expires_at>started_at order by created_at desc limit 1;
 if not found then
  insert into classroom_private.sessions(teacher_id,class_id,lesson,stage,created_at,expires_at)
  values(auth.uid(),p_class_id,p_lesson,p_stage,started_at,started_at+interval '2 hours') returning * into s;
 end if;
 return classroom_private.snapshot(s);
end;
$$;
revoke all on function public.classroom_class_snapshot(uuid,text) from public,anon,authenticated;
revoke all on function public.classroom_class_current(uuid,text) from public,anon,authenticated;
revoke all on function public.classroom_class_start(uuid,text,text) from public,anon,authenticated;
grant execute on function public.classroom_class_snapshot(uuid,text) to anon,authenticated;
grant execute on function public.classroom_class_current(uuid,text) to authenticated;
grant execute on function public.classroom_class_start(uuid,text,text) to authenticated;
notify pgrst,'reload schema';
commit;
select true as permanent_classroom_ready;
