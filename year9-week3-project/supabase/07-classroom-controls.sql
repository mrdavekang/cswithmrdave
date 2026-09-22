-- Step 7: server-checked classroom actions. Run this whole file.
-- Prerequisite: Steps 5 and 6. Safe to run again.
-- No website changes or student records are created by this script.
begin;

create index if not exists classroom_sessions_teacher_expiry
  on classroom_private.sessions (teacher_id, expires_at);

-- Internal helpers are not callable by website visitors.
create or replace function classroom_private.valid_stage(p_stage text)
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(p_stage in (
    'read', 'starter', 'types', 'reference', 'inputs', 'constants',
    'conditions', 'calculations-read', 'calculations', 'decisions',
    'pit', 'plenary', 'extension'
  ), false);
$$;

create or replace function classroom_private.snapshot(
  p_session classroom_private.sessions
) returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'version', 1,
    'lesson', 'year9-week3-project',
    'session_id', p_session.id,
    'stage', p_session.stage,
    'locked', p_session.locked,
    'revision', p_session.revision,
    'bring_revision', p_session.bring_revision,
    'expires_at', p_session.expires_at,
    'server_now', statement_timestamp(),
    'ended', false
  );
$$;

revoke all on function classroom_private.valid_stage(text)
  from public, anon, authenticated;
revoke all on function classroom_private.snapshot(classroom_private.sessions)
  from public, anon, authenticated;

-- This answers only whether the signed-in caller is an approved teacher.
create or replace function public.classroom_is_teacher()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from classroom_private.teachers where user_id = auth.uid()
  );
$$;

-- Only the owning teacher can recover their active session after a reload.
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
  where s.teacher_id = auth.uid() and s.expires_at > statement_timestamp()
  order by s.created_at desc limit 1;
  return result;
end;
$$;

-- Start once; repeated clicks/responses resume the existing session.
-- Locking the teacher row serializes concurrent Start requests.
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
  where teacher_id = caller and expires_at > started_at
  order by created_at desc limit 1;
  if not found then
    insert into classroom_private.sessions(teacher_id, stage, created_at, expires_at)
    values(caller, p_stage, started_at, started_at + interval '2 hours')
    returning * into session_row;
  end if;
  return classroom_private.snapshot(session_row);
end;
$$;

-- Anyone holding THIS random session link can get its current control state.
-- It does not list sessions or return teacher details or student information.
-- Missing, ended and expired links all return null.
create or replace function public.classroom_snapshot(p_session_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select classroom_private.snapshot(s)
  from classroom_private.sessions s
  where s.id = p_session_id and s.expires_at > statement_timestamp();
$$;

-- Every action independently verifies the account, owner and expiry.
-- expected_revision prevents delayed/retried commands overwriting newer ones.
-- Lock changes navigation only; Bring changes stage only; Unlock restores
-- navigation. None of these actions change students' lesson answers or code.
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
  if p_action = 'bring' and not classroom_private.valid_stage(p_stage) then
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

-- Prepared for the next setup step: automatically deleting expired metadata.
-- Creating this function alone does NOT schedule it.
create or replace function classroom_private.cleanup_expired_sessions()
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  removed bigint;
begin
  delete from classroom_private.sessions where expires_at <= clock_timestamp();
  get diagnostics removed = row_count;
  return removed;
end;
$$;
revoke all on function classroom_private.cleanup_expired_sessions()
  from public, anon, authenticated;

-- Function execution is granted individually; public defaults are removed.
revoke all on function public.classroom_is_teacher() from public, anon, authenticated;
revoke all on function public.classroom_current_session() from public, anon, authenticated;
revoke all on function public.classroom_start(text) from public, anon, authenticated;
revoke all on function public.classroom_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.classroom_control(uuid, text, bigint, text)
  from public, anon, authenticated;
grant execute on function public.classroom_is_teacher() to authenticated;
grant execute on function public.classroom_current_session() to authenticated;
grant execute on function public.classroom_start(text) to authenticated;
grant execute on function public.classroom_snapshot(uuid) to anon, authenticated;
grant execute on function public.classroom_control(uuid, text, bigint, text)
  to authenticated;

-- Abort installation if a browser role unexpectedly has admin/helper access.
do $$
begin
  if has_function_privilege('anon', 'public.classroom_start(text)', 'EXECUTE')
    or has_function_privilege('anon', 'public.classroom_control(uuid,text,bigint,text)', 'EXECUTE')
    or has_function_privilege('anon', 'public.classroom_current_session()', 'EXECUTE')
    or has_function_privilege('anon', 'classroom_private.cleanup_expired_sessions()', 'EXECUTE')
    or has_function_privilege('authenticated', 'classroom_private.cleanup_expired_sessions()', 'EXECUTE')
    or has_function_privilege('anon', 'classroom_private.snapshot(classroom_private.sessions)', 'EXECUTE')
    or has_function_privilege('authenticated', 'classroom_private.snapshot(classroom_private.sessions)', 'EXECUTE')
  then
    raise exception 'Unexpected classroom function permissions';
  end if;
end;
$$;

-- Refresh Supabase's API list after committing these functions.
notify pgrst, 'reload schema';
commit;
select true as classroom_controls_ready;

-- Integration contract for the later website update:
-- Send returned snapshots over the owning teacher's private control channel,
-- event "state", only AFTER an RPC succeeds. Do not fabricate local success.
-- On join/rejoin and periodically, read classroom_snapshot to recover missed
-- messages or a lost End notification. Ignore older revisions and wrong rooms.
-- At expiry, leave channels and restore self-navigation. Null snapshot means
-- unavailable/ended; disconnect. A network error is not proof a session ended.
-- Do not use database broadcast triggers: this design needs no message log.
