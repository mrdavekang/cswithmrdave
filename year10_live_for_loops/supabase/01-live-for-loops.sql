-- Year 10 FOR loops: additive live lesson installation.
-- Run this WHOLE file in the SAME Supabase project as classroom-config.js.
-- Requires the existing classroom_private.teachers/classes and
-- public.classroom_is_teacher(). Nothing in that existing feature is changed.
-- Anonymous Auth and Realtime are NOT used or enabled.
begin;

do $preflight$
begin
  if to_regclass('classroom_private.classes') is null
     or to_regclass('classroom_private.teachers') is null
     or to_regprocedure('public.classroom_is_teacher()') is null then
    raise exception 'Install the existing permanent-classroom setup first';
  end if;
  if not exists (select 1 from classroom_private.classes
                 where id='c429701c-21c3-4e99-b84d-c2faadca7afb') then
    raise exception 'The existing Year 10 permanent class mapping is missing';
  end if;
end;
$preflight$;

create schema if not exists y10_for_private;
revoke all on schema y10_for_private from public, anon, authenticated;

-- Discover pgcrypto's EXISTING schema rather than moving/reinstalling it.
-- Supabase usually installs it in extensions, but this does not assume that.
do $crypto$
declare crypto_schema text;
begin
  select n.nspname into crypto_schema from pg_catalog.pg_extension e
  join pg_catalog.pg_namespace n on n.oid=e.extnamespace where e.extname='pgcrypto';
  if crypto_schema is null then
    raise exception 'Enable pgcrypto in Database > Extensions, then rerun this file';
  end if;
  execute format(
    'create or replace function y10_for_private.token_hash(p_token text) returns bytea language sql immutable set search_path = %L as %L',
    '', format('select %I.digest(p_token, ''sha256'')', crypto_schema));
end;
$crypto$;

create table if not exists y10_for_private.y10_for_rooms (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classroom_private.classes(id),
  teacher_id uuid not null references classroom_private.teachers(user_id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '4 hours'),
  ended boolean not null default false,
  stage text not null default 'ready' check (stage in
    ('ready','starter','types','model','task1','task2','extension','pit','plenary','submit')),
  mode text not null default 'present' check (mode in ('present','work','paused')),
  revision bigint not null default 0 check (revision>=0),
  released_stages text[] not null default '{}'::text[],
  demo jsonb not null default '{"code":"","line":1,"output":""}'::jsonb
    check (jsonb_typeof(demo)='object' and octet_length(demo::text)<=50000),
  check (expires_at>created_at and expires_at<=created_at+interval '4 hours'),
  check (released_stages <@ array['ready','starter','types','model','task1','task2','extension','pit','plenary','submit']::text[])
);
create index if not exists y10_for_rooms_class_created
  on y10_for_private.y10_for_rooms(class_id,created_at desc);

create table if not exists y10_for_private.y10_for_students (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references y10_for_private.y10_for_rooms(id) on delete cascade,
  token_hash bytea not null check (octet_length(token_hash)=32),
  name text not null check (length(name) between 2 and 80),
  status text not null default 'pending' check (status in ('pending','admitted','rejected')),
  joined_at timestamptz not null default clock_timestamp(),
  last_seen_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp(),
  work jsonb not null default '{}'::jsonb
    check (jsonb_typeof(work)='object' and octet_length(work::text)<=4000000),
  latest_stage text not null default 'ready' check (latest_stage in
    ('ready','starter','types','model','task1','task2','extension','pit','plenary','submit')),
  unlocked_stages text[] not null default '{}'::text[],
  feedback text not null default '' check (length(feedback)<=3000),
  feedback_at timestamptz,
  help_requested boolean not null default false,
  help_note text not null default '' check (length(help_note)<=400),
  submitted_at timestamptz,
  unique(room_id,token_hash),
  check (unlocked_stages <@ array['ready','starter','types','model','task1','task2','extension','pit','plenary','submit']::text[])
);
create index if not exists y10_for_students_room_joined
  on y10_for_private.y10_for_students(room_id,joined_at);
alter table y10_for_private.y10_for_rooms enable row level security;
alter table y10_for_private.y10_for_students enable row level security;
revoke all on all tables in schema y10_for_private from public,anon,authenticated;
-- No browser-role RLS policies: access is exclusively through bounded RPCs.

create or replace function y10_for_private.valid_stage(p_stage text)
returns boolean language sql immutable set search_path='' as $$
  select coalesce(p_stage in ('ready','starter','types','model','task1','task2','extension','pit','plenary','submit'),false);
$$;

create or replace function y10_for_private.owns_class(p_class_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select coalesce(p_class_id='c429701c-21c3-4e99-b84d-c2faadca7afb'::uuid
    and auth.uid() is not null and public.classroom_is_teacher()
    and exists(select 1 from classroom_private.classes c
               where c.id=p_class_id and c.teacher_id=auth.uid()),false);
$$;

create or replace function y10_for_private.room_snapshot(p_room y10_for_private.y10_for_rooms)
returns jsonb language sql stable set search_path='' as $$
  select jsonb_build_object('version',1,'lesson','year10_live_for_loops',
    'id',p_room.id,'class_id',p_room.class_id,'stage',p_room.stage,'mode',p_room.mode,
    'revision',p_room.revision,'released_stages',p_room.released_stages,'demo',p_room.demo,
    'ended',p_room.ended or p_room.expires_at<=statement_timestamp(),
    'created_at',p_room.created_at,'expires_at',p_room.expires_at,'server_now',statement_timestamp());
$$;

create or replace function y10_for_private.student_snapshot(p_student y10_for_private.y10_for_students)
returns jsonb language sql stable set search_path='' as $$
  -- Deliberately excludes token_hash. No credential appears in either view.
  select jsonb_build_object('id',p_student.id,'name',p_student.name,'status',p_student.status,
    'joined_at',p_student.joined_at,'last_seen_at',p_student.last_seen_at,'updated_at',p_student.updated_at,
    'work',p_student.work,'latest_stage',p_student.latest_stage,'unlocked_stages',p_student.unlocked_stages,
    'feedback',p_student.feedback,'feedback_at',p_student.feedback_at,
    'help_requested',p_student.help_requested,'help_note',p_student.help_note,'submitted_at',p_student.submitted_at);
$$;

create or replace function y10_for_private.check_token(p_token text)
returns void language plpgsql immutable set search_path='' as $$
begin
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid private device token' using errcode='22023';
  end if;
end;
$$;

create or replace function public.y10_for_is_teacher(p_class_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select y10_for_private.owns_class(p_class_id);
$$;

create or replace function public.y10_for_teacher_state(p_class_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; roster jsonb;
begin
  if not y10_for_private.owns_class(p_class_id) then
    raise exception 'This class requires its approved teacher' using errcode='42501';
  end if;
  select * into room from y10_for_private.y10_for_rooms
    where class_id=p_class_id and teacher_id=auth.uid() order by created_at desc limit 1;
  if not found then return jsonb_build_object('room',null,'students','[]'::jsonb); end if;
  select coalesce(jsonb_agg(y10_for_private.student_snapshot(s) order by s.joined_at),'[]'::jsonb)
    into roster from y10_for_private.y10_for_students s where s.room_id=room.id;
  return jsonb_build_object('room',y10_for_private.room_snapshot(room),'students',roster);
end;
$$;

create or replace function public.y10_for_teacher_start(p_class_id uuid,p_stage text default 'ready')
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; started timestamptz; roster jsonb;
begin
  if not y10_for_private.owns_class(p_class_id) then
    raise exception 'This class requires its approved teacher' using errcode='42501';
  end if;
  if not y10_for_private.valid_stage(p_stage) then
    raise exception 'Unknown lesson stage' using errcode='22023';
  end if;
  -- Existing mapping is only read/locked; never reassigned or altered.
  perform 1 from classroom_private.classes where id=p_class_id and teacher_id=auth.uid() for update;
  started:=clock_timestamp();
  select * into room from y10_for_private.y10_for_rooms
    where class_id=p_class_id and teacher_id=auth.uid() and not ended and expires_at>started order by created_at desc limit 1;
  if not found then
    insert into y10_for_private.y10_for_rooms(class_id,teacher_id,stage,created_at,expires_at)
      values(p_class_id,auth.uid(),p_stage,started,started+interval '4 hours') returning * into room;
  end if;
  -- Build from the row just returned by INSERT, not a STABLE RPC's earlier
  -- statement snapshot. This also returns the correct existing roster on retry.
  select coalesce(jsonb_agg(y10_for_private.student_snapshot(s) order by s.joined_at),'[]'::jsonb)
    into roster from y10_for_private.y10_for_students s where s.room_id=room.id;
  return jsonb_build_object('room',y10_for_private.room_snapshot(room),'students',roster);
end;
$$;

create or replace function public.y10_for_teacher_control(p_room_id uuid,p_expected_revision bigint,p_patch jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; demo_value jsonb; line_value integer;
begin
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id for update;
  if not found or not y10_for_private.owns_class(room.class_id) or room.teacher_id<>auth.uid() then
    raise exception 'This class requires its approved teacher' using errcode='42501';
  end if;
  if room.ended or room.expires_at<=clock_timestamp() then
    raise exception 'Classroom has ended; start a new session' using errcode='42501';
  end if;
  if p_expected_revision is null or p_expected_revision<>room.revision then
    raise exception 'Another teacher command arrived first; refresh and retry' using errcode='40001';
  end if;
  if p_patch is null or jsonb_typeof(p_patch)<>'object' or octet_length(p_patch::text)>50000
     or p_patch - array['stage','mode','demo','ended']::text[] <> '{}'::jsonb then
    raise exception 'Invalid classroom control' using errcode='22023';
  end if;
  if p_patch ? 'stage' then
    if jsonb_typeof(p_patch->'stage')<>'string' or not y10_for_private.valid_stage(p_patch->>'stage') then
      raise exception 'Unknown lesson stage' using errcode='22023'; end if;
    room.stage:=p_patch->>'stage';
  end if;
  if p_patch ? 'mode' then
    if jsonb_typeof(p_patch->'mode')<>'string' or p_patch->>'mode' not in ('present','work','paused') then
      raise exception 'Unknown classroom mode' using errcode='22023'; end if;
    room.mode:=p_patch->>'mode';
  end if;
  if p_patch ? 'ended' then
    if jsonb_typeof(p_patch->'ended')<>'boolean' then
      raise exception 'Invalid end control' using errcode='22023'; end if;
    room.ended:=(p_patch->>'ended')::boolean;
    if room.ended then room.mode:='paused'; end if;
  end if;
  if p_patch ? 'demo' then
    demo_value:=p_patch->'demo';
    if jsonb_typeof(demo_value)<>'object' or jsonb_typeof(demo_value->'code') is distinct from 'string'
       or jsonb_typeof(demo_value->'output') is distinct from 'string'
       or length(demo_value->>'code')>20000 or length(demo_value->>'output')>16000
       or not coalesce((demo_value->>'line') ~ '^[0-9]{1,4}$',false) then
      raise exception 'Invalid demonstration (code, output, line)' using errcode='22023'; end if;
    line_value:=(demo_value->>'line')::integer;
    if line_value<0 or line_value>2000 then raise exception 'Invalid demonstration line' using errcode='22023'; end if;
    room.demo:=jsonb_build_object('code',demo_value->>'code','output',demo_value->>'output','line',line_value);
  end if;
  if room.mode in ('present','work') and not room.stage=any(room.released_stages) then
    room.released_stages:=array_append(room.released_stages,room.stage);
  end if;
  update y10_for_private.y10_for_rooms set stage=room.stage,mode=room.mode,ended=room.ended,
    demo=room.demo,released_stages=room.released_stages,revision=revision+1
    where id=room.id returning * into room;
  return y10_for_private.room_snapshot(room);
end;
$$;

create or replace function public.y10_for_teacher_admit(p_room_id uuid,p_student_id uuid,p_admitted boolean default true)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students;
begin
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id for share;
  if not found or not y10_for_private.owns_class(room.class_id) or room.teacher_id<>auth.uid() then
    raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
  if room.ended or room.expires_at<=clock_timestamp() then raise exception 'Classroom has ended' using errcode='42501'; end if;
  if p_admitted is null then raise exception 'Choose admit or reject' using errcode='22023'; end if;
  update y10_for_private.y10_for_students set status=case when p_admitted then 'admitted' else 'rejected' end,
    updated_at=clock_timestamp() where id=p_student_id and room_id=p_room_id returning * into student;
  if not found then raise exception 'Student not in this session' using errcode='22023'; end if;
  return y10_for_private.student_snapshot(student);
end;
$$;

create or replace function public.y10_for_teacher_feedback(p_room_id uuid,p_student_id uuid,p_feedback text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students;
begin
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id for share;
  if not found or not y10_for_private.owns_class(room.class_id) or room.teacher_id<>auth.uid() then
    raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
  if p_feedback is null or length(p_feedback)>3000 then raise exception 'Feedback is too long' using errcode='22023'; end if;
  -- Feedback remains possible during after-lesson review of the retained room.
  update y10_for_private.y10_for_students set feedback=p_feedback,feedback_at=clock_timestamp(),updated_at=clock_timestamp()
    where id=p_student_id and room_id=p_room_id returning * into student;
  if not found then raise exception 'Student not in this session' using errcode='22023'; end if;
  return y10_for_private.student_snapshot(student);
end;
$$;

create or replace function public.y10_for_teacher_unlock(p_room_id uuid,p_student_id uuid,p_stage text,p_unlocked boolean default true)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students; stages text[];
begin
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id for share;
  if not found or not y10_for_private.owns_class(room.class_id) or room.teacher_id<>auth.uid() then
    raise exception 'This class requires its approved teacher' using errcode='42501'; end if;
  if room.ended or room.expires_at<=clock_timestamp() then raise exception 'Classroom has ended' using errcode='42501'; end if;
  if not y10_for_private.valid_stage(p_stage) or p_unlocked is null then raise exception 'Unknown lesson stage' using errcode='22023'; end if;
  select * into student from y10_for_private.y10_for_students where id=p_student_id and room_id=p_room_id for update;
  if not found then raise exception 'Student not in this session' using errcode='22023'; end if;
  stages:=array_remove(student.unlocked_stages,p_stage);
  if p_unlocked then stages:=array_append(stages,p_stage); end if;
  update y10_for_private.y10_for_students set unlocked_stages=stages,updated_at=clock_timestamp()
    where id=student.id returning * into student;
  return y10_for_private.student_snapshot(student);
end;
$$;

create or replace function public.y10_for_join(p_class_id uuid,p_room_id uuid,p_name text,p_token text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students; clean_name text;
begin
  perform y10_for_private.check_token(p_token);
  if p_class_id is distinct from 'c429701c-21c3-4e99-b84d-c2faadca7afb'::uuid then
    raise exception 'Classroom unavailable' using errcode='42501'; end if;
  clean_name:=btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'));
  if length(clean_name)<2 or length(clean_name)>80 then raise exception 'Enter a name between 2 and 80 characters' using errcode='22023'; end if;
  select r.* into room from y10_for_private.y10_for_rooms r
    join classroom_private.classes c on c.id=r.class_id and c.teacher_id=r.teacher_id
    where r.id=p_room_id and r.class_id=p_class_id and not r.ended and r.expires_at>clock_timestamp()
    order by r.created_at desc limit 1 for update of r;
  if not found then raise exception 'The shared classroom invite is unavailable or has ended. Ask your teacher for the current link.' using errcode='P0002'; end if;
  select * into student from y10_for_private.y10_for_students
    where room_id=room.id and token_hash=y10_for_private.token_hash(p_token);
  if not found then
    -- Bounded roster. Admission is still required: a name is not authentication.
    if (select count(*) from y10_for_private.y10_for_students where room_id=room.id)>=100 then
      raise exception 'Classroom join list is full; ask your teacher' using errcode='54000'; end if;
    insert into y10_for_private.y10_for_students(room_id,token_hash,name)
      values(room.id,y10_for_private.token_hash(p_token),clean_name) returning * into student;
  end if;
  return jsonb_build_object('room',y10_for_private.room_snapshot(room),'student',y10_for_private.student_snapshot(student));
end;
$$;

create or replace function public.y10_for_student_poll(p_room_id uuid,p_token text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students;
begin
  perform y10_for_private.check_token(p_token);
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id;
  if not found then raise exception 'Classroom unavailable' using errcode='42501'; end if;
  select * into student from y10_for_private.y10_for_students
    where room_id=p_room_id and token_hash=y10_for_private.token_hash(p_token);
  if not found then raise exception 'Private join not found; join this classroom again' using errcode='42501'; end if;
  -- A pupil can recover their own feedback/work after expiry, never a roster.
  if student.last_seen_at<clock_timestamp()-interval '10 seconds' then
    update y10_for_private.y10_for_students set last_seen_at=clock_timestamp()
      where id=student.id returning * into student;
  end if;
  return jsonb_build_object('room',y10_for_private.room_snapshot(room),'student',y10_for_private.student_snapshot(student));
end;
$$;

create or replace function public.y10_for_student_save(p_room_id uuid,p_token text,p_payload jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students;
  stage_value text; saved jsonb; run_value jsonb; runs_value jsonb; answers_value jsonb; code_value text;
  input_value jsonb; text_key text;
begin
  perform y10_for_private.check_token(p_token);
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id for share;
  if not found then raise exception 'Classroom unavailable' using errcode='42501'; end if;
  select * into student from y10_for_private.y10_for_students
    where room_id=p_room_id and token_hash=y10_for_private.token_hash(p_token) for update;
  if not found or student.status<>'admitted' then raise exception 'Wait for teacher admission before saving' using errcode='42501'; end if;
  if p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>760000
     or p_payload - array['stage','answers','code','runs','submitted']::text[] <> '{}'::jsonb then
    raise exception 'Invalid work payload' using errcode='22023'; end if;
  stage_value:=p_payload->>'stage';
  if not y10_for_private.valid_stage(stage_value) then raise exception 'Unknown lesson stage' using errcode='22023'; end if;
  if room.ended or room.expires_at<=clock_timestamp() or room.mode<>'work'
    or not (stage_value=any(room.released_stages) or stage_value=any(student.unlocked_stages)) then
    raise exception 'This work is not released now. Your local draft is still on this device.' using errcode='42501'; end if;
  saved:=coalesce(student.work->stage_value,'{}'::jsonb);
  answers_value:=case when p_payload ? 'answers' then p_payload->'answers' else coalesce(saved->'answers','{}'::jsonb) end;
  code_value:=case when p_payload ? 'code' then p_payload->>'code' else coalesce(saved->>'code','') end;
  runs_value:=case when p_payload ? 'runs' then p_payload->'runs' else coalesce(saved->'runs','[]'::jsonb) end;
  if jsonb_typeof(answers_value)<>'object' or octet_length(answers_value::text)>12000
    or (p_payload ? 'code' and jsonb_typeof(p_payload->'code') is distinct from 'string') or length(code_value)>20000
    or jsonb_typeof(runs_value)<>'array' or jsonb_array_length(runs_value)>8 or octet_length(runs_value::text)>720000 then
    raise exception 'Work is too large (code 20,000 characters, eight recent runs)' using errcode='22023'; end if;
  for run_value in select value from jsonb_array_elements(runs_value) loop
    if jsonb_typeof(run_value)<>'object' or octet_length(run_value::text)>90000
       or jsonb_typeof(run_value->'code') is distinct from 'string' or length(run_value->>'code')>20000
       or jsonb_typeof(run_value->'inputs') is distinct from 'array'
       or jsonb_typeof(run_value->'output') is distinct from 'string' or length(run_value->>'output')>8000
       or run_value - array['code','inputs','stdout','output','stderr','error','ok','line','at','durationMs','duration_ms']::text[] <> '{}'::jsonb then
      raise exception 'Invalid recent run' using errcode='22023'; end if;
    if jsonb_array_length(run_value->'inputs')>100 or octet_length((run_value->'inputs')::text)>8000 then
      raise exception 'Run inputs are too large' using errcode='22023'; end if;
    for input_value in select value from jsonb_array_elements(run_value->'inputs') loop
      if jsonb_typeof(input_value)<>'string' or length(input_value #>> '{}')>1000 then
        raise exception 'Invalid recorded run input' using errcode='22023'; end if;
    end loop;
    foreach text_key in array array['stdout','stderr','error']::text[] loop
      if run_value ? text_key and (jsonb_typeof(run_value->text_key) is distinct from 'string' or length(run_value->>text_key)>8000) then
        raise exception 'Recorded run output/error is too large' using errcode='22023'; end if;
    end loop;
    if run_value ? 'ok' and jsonb_typeof(run_value->'ok') is distinct from 'boolean' then
      raise exception 'Invalid recorded run status' using errcode='22023'; end if;
    if run_value ? 'at' and (jsonb_typeof(run_value->'at') is distinct from 'string' or length(run_value->>'at')>50) then
      raise exception 'Invalid recorded run time' using errcode='22023'; end if;
    if run_value ? 'line' and run_value->'line'<>'null'::jsonb and not coalesce((run_value->>'line') ~ '^[0-9]{1,4}$',false) then
      raise exception 'Invalid recorded run line' using errcode='22023'; end if;
    foreach text_key in array array['durationMs','duration_ms']::text[] loop
      if run_value ? text_key and not coalesce((run_value->>text_key) ~ '^[0-9]{1,7}$',false) then
        raise exception 'Invalid recorded run duration' using errcode='22023'; end if;
    end loop;
  end loop;
  if p_payload ? 'submitted' then
    if jsonb_typeof(p_payload->'submitted') is distinct from 'boolean' then
      raise exception 'Invalid submission flag' using errcode='22023'; end if;
    if (p_payload->>'submitted')::boolean and stage_value<>'submit' then
      raise exception 'Submission is only available at the submit stage' using errcode='22023'; end if;
    if (p_payload->>'submitted')::boolean then student.submitted_at:=clock_timestamp(); end if;
  end if;
  saved:=jsonb_build_object('answers',answers_value,'code',code_value,'runs',runs_value,'updated_at',clock_timestamp());
  update y10_for_private.y10_for_students set work=jsonb_set(work,array[stage_value],saved,true),
    latest_stage=stage_value,updated_at=clock_timestamp(),last_seen_at=clock_timestamp(),submitted_at=student.submitted_at
    where id=student.id returning * into student;
  return y10_for_private.student_snapshot(student);
end;
$$;

create or replace function public.y10_for_set_help(p_room_id uuid,p_token text,p_help boolean,p_note text default '')
returns jsonb language plpgsql security definer set search_path='' as $$
declare room y10_for_private.y10_for_rooms; student y10_for_private.y10_for_students;
begin
  perform y10_for_private.check_token(p_token);
  select * into room from y10_for_private.y10_for_rooms where id=p_room_id for share;
  if not found or room.ended or room.expires_at<=clock_timestamp() then raise exception 'Classroom has ended' using errcode='42501'; end if;
  if p_help is null or p_note is null or length(p_note)>400 then raise exception 'Help note is too long' using errcode='22023'; end if;
  update y10_for_private.y10_for_students set help_requested=p_help,help_note=case when p_help then p_note else '' end,
    updated_at=clock_timestamp(),last_seen_at=clock_timestamp()
    where room_id=p_room_id and token_hash=y10_for_private.token_hash(p_token) and status='admitted' returning * into student;
  if not found then raise exception 'Wait for teacher admission before requesting help' using errcode='42501'; end if;
  -- Help requests are allowed while paused/present; they cannot alter lesson work.
  return y10_for_private.student_snapshot(student);
end;
$$;

revoke all on all functions in schema y10_for_private from public,anon,authenticated;
revoke all on function public.y10_for_is_teacher(uuid) from public,anon,authenticated;
revoke all on function public.y10_for_teacher_state(uuid) from public,anon,authenticated;
revoke all on function public.y10_for_teacher_start(uuid,text) from public,anon,authenticated;
revoke all on function public.y10_for_teacher_control(uuid,bigint,jsonb) from public,anon,authenticated;
revoke all on function public.y10_for_teacher_admit(uuid,uuid,boolean) from public,anon,authenticated;
revoke all on function public.y10_for_teacher_feedback(uuid,uuid,text) from public,anon,authenticated;
revoke all on function public.y10_for_teacher_unlock(uuid,uuid,text,boolean) from public,anon,authenticated;
revoke all on function public.y10_for_join(uuid,uuid,text,text) from public,anon,authenticated;
revoke all on function public.y10_for_student_poll(uuid,text) from public,anon,authenticated;
revoke all on function public.y10_for_student_save(uuid,text,jsonb) from public,anon,authenticated;
revoke all on function public.y10_for_set_help(uuid,text,boolean,text) from public,anon,authenticated;
grant execute on function public.y10_for_is_teacher(uuid), public.y10_for_teacher_state(uuid),
  public.y10_for_teacher_start(uuid,text), public.y10_for_teacher_control(uuid,bigint,jsonb),
  public.y10_for_teacher_admit(uuid,uuid,boolean), public.y10_for_teacher_feedback(uuid,uuid,text),
  public.y10_for_teacher_unlock(uuid,uuid,text,boolean) to authenticated;
grant execute on function public.y10_for_join(uuid,uuid,text,text), public.y10_for_student_poll(uuid,text),
  public.y10_for_student_save(uuid,text,jsonb), public.y10_for_set_help(uuid,text,boolean,text) to anon,authenticated;

do $permissions$
begin
  if has_table_privilege('anon','y10_for_private.y10_for_students','SELECT')
     or has_table_privilege('authenticated','y10_for_private.y10_for_students','SELECT')
     or has_table_privilege('anon','y10_for_private.y10_for_rooms','SELECT')
     or has_function_privilege('anon','public.y10_for_teacher_control(uuid,bigint,jsonb)','EXECUTE')
     or has_function_privilege('anon','public.y10_for_teacher_state(uuid)','EXECUTE')
     or has_function_privilege('anon','y10_for_private.token_hash(text)','EXECUTE')
     or has_function_privilege('authenticated','y10_for_private.owns_class(uuid)','EXECUTE') then
    raise exception 'Unexpected browser permissions; installation rolled back';
  end if;
end;
$permissions$;

-- Disable the obsolete feature-specific class-only pre-release overload,
-- if an operator installed an earlier local draft. No existing lesson RPC
-- or policy is touched, and no function is dropped.
do $obsolete$
begin
  if to_regprocedure('public.y10_for_join(uuid,text,text)') is not null then
    execute 'revoke all on function public.y10_for_join(uuid,text,text) from public,anon,authenticated';
  end if;
end;
$obsolete$;

-- No purge, cron job, publication or existing policy is created/changed here.
-- Retention recommendation: retain named lesson work for 7 days, then have
-- an authorized operator remove only the selected y10_for_private room(s).
-- ON DELETE CASCADE removes their students. Review/export first; no automatic
-- destructive action is scheduled by this installation.
notify pgrst,'reload schema';
commit;
select true as y10_for_live_ready;
