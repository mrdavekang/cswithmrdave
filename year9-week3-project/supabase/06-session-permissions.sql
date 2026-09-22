-- Step 6: live classroom session permissions.
-- Run the WHOLE file in the Supabase SQL Editor after Step 5.
-- This installs permissions; it does not yet connect the website.
begin;

create table if not exists classroom_private.sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references classroom_private.teachers(user_id)
    on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours'),
  locked boolean not null default false,
  stage text not null default 'read',
  revision bigint not null default 0 check (revision >= 0),
  bring_revision bigint not null default 0 check (bring_revision >= 0),
  constraint classroom_session_duration check (
    expires_at > created_at
    and expires_at <= created_at + interval '2 hours'
  ),
  constraint classroom_stage_valid check (stage in (
    'read', 'starter', 'types', 'reference', 'inputs', 'constants',
    'conditions', 'calculations-read', 'calculations', 'decisions',
    'pit', 'plenary', 'extension'
  ))
);

alter table classroom_private.sessions enable row level security;
revoke all on table classroom_private.sessions
  from public, anon, authenticated;
revoke all on table classroom_private.teachers
  from public, anon, authenticated;

-- A session link contains a random UUID. Knowing that link grants student
-- access to that session only, never teacher command permissions.
-- No student identity, work, name, email, or device history is stored here.
-- Expiry rejects NEW channel authorizations. The client must also leave at
-- expiry because Realtime caches the permissions of existing connections.
create or replace function classroom_private.channel_allowed(
  requested_topic text,
  message_kind text,
  sending boolean
) returns boolean
language sql stable security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from classroom_private.sessions as session
    where session.expires_at > now()
      and (
        (
          requested_topic = 'classroom:' || session.id::text || ':control'
          and message_kind = 'broadcast'
          and (not sending or session.teacher_id = auth.uid())
        )
        or
        (
          requested_topic = 'classroom:' || session.id::text || ':presence'
          and message_kind = 'presence'
          and (
            (sending and auth.uid() is null)
            or (not sending and session.teacher_id = auth.uid())
          )
        )
      )
  );
$function$;

revoke all on function classroom_private.channel_allowed(text, text, boolean)
  from public, anon, authenticated;
grant usage on schema classroom_private to anon, authenticated;
grant execute on function classroom_private.channel_allowed(text, text, boolean)
  to anon, authenticated;

-- Replace only this feature's policies when the script is rerun.
-- Supabase already enables RLS on realtime.messages.
drop policy if exists classroom_receive on realtime.messages;
drop policy if exists classroom_send on realtime.messages;
drop policy if exists classroom_receive_guard on realtime.messages;
drop policy if exists classroom_send_guard on realtime.messages;

create policy classroom_receive on realtime.messages
  for select to anon, authenticated
  using (classroom_private.channel_allowed(
    realtime.topic(), extension, false
  ));

create policy classroom_send on realtime.messages
  for insert to anon, authenticated
  with check (classroom_private.channel_allowed(
    realtime.topic(), extension, true
  ));

-- Restrictive guards keep unrelated broad policies from granting students
-- extra permissions on a classroom channel.
create policy classroom_receive_guard on realtime.messages
  as restrictive for select to anon, authenticated
  using (
    realtime.topic() not like 'classroom:%'
    or classroom_private.channel_allowed(realtime.topic(), extension, false)
  );

create policy classroom_send_guard on realtime.messages
  as restrictive for insert to anon, authenticated
  with check (
    realtime.topic() not like 'classroom:%'
    or classroom_private.channel_allowed(realtime.topic(), extension, true)
  );

-- Check the permission logic using a temporary test session.
-- No Auth users are created. The test session is deleted before commit.
do $checks$
declare
  test_id uuid := gen_random_uuid();
  owner_id uuid := '6901b13b-437c-4c79-ad01-a6bfc75f6a62';
  control_topic text := 'classroom:' || test_id::text || ':control';
  presence_topic text := 'classroom:' || test_id::text || ':presence';
  old_claims text := current_setting('request.jwt.claims', true);
  old_sub text := current_setting('request.jwt.claim.sub', true);
begin
  insert into classroom_private.sessions(id, teacher_id)
  values(test_id, owner_id);

  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  if not classroom_private.channel_allowed(control_topic, 'broadcast', false)
    or classroom_private.channel_allowed(control_topic, 'broadcast', true)
    or not classroom_private.channel_allowed(presence_topic, 'presence', true)
    or classroom_private.channel_allowed(presence_topic, 'presence', false)
    or classroom_private.channel_allowed(presence_topic, 'broadcast', true)
    or classroom_private.channel_allowed(control_topic, 'presence', true)
    or classroom_private.channel_allowed('classroom:unknown:control', 'broadcast', false)
  then
    raise exception 'Student permission checks failed';
  end if;

  perform set_config('request.jwt.claim.sub', owner_id::text, true);
  perform set_config('request.jwt.claims',
    jsonb_build_object('role', 'authenticated', 'sub', owner_id)::text, true);
  if not classroom_private.channel_allowed(control_topic, 'broadcast', true)
    or not classroom_private.channel_allowed(control_topic, 'broadcast', false)
    or not classroom_private.channel_allowed(presence_topic, 'presence', false)
    or classroom_private.channel_allowed(presence_topic, 'presence', true)
  then
    raise exception 'Teacher permission checks failed';
  end if;

  perform set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
  if classroom_private.channel_allowed(control_topic, 'broadcast', true)
    or classroom_private.channel_allowed(presence_topic, 'presence', false)
  then
    raise exception 'Another account received teacher permissions';
  end if;

  update classroom_private.sessions
  set created_at = now() - interval '2 hours',
      expires_at = now() - interval '1 minute'
  where id = test_id;
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  if classroom_private.channel_allowed(control_topic, 'broadcast', false)
    or classroom_private.channel_allowed(presence_topic, 'presence', true)
  then
    raise exception 'Expired session permission checks failed';
  end if;

  if has_table_privilege('anon', 'classroom_private.sessions', 'SELECT')
    or has_table_privilege('anon', 'classroom_private.sessions', 'INSERT')
    or has_table_privilege('authenticated', 'classroom_private.sessions', 'UPDATE')
    or has_table_privilege('anon', 'classroom_private.teachers', 'SELECT')
    or has_table_privilege('authenticated', 'classroom_private.teachers', 'INSERT')
  then
    raise exception 'A private table has unexpected browser permissions';
  end if;

  delete from classroom_private.sessions where id = test_id;
  perform set_config('request.jwt.claim.sub', coalesce(old_sub, ''), true);
  perform set_config('request.jwt.claims', coalesce(old_claims, '{}'), true);
end;
$checks$;

commit;
select true as session_permissions_ready;
