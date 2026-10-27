-- Additive, lesson-only learning records. Does not change existing classrooms,
-- Auth accounts, teacher registrations, default grants, or exposed schemas.
-- Apply as the database owner after review. The existing teacher Auth ID was
-- verified on 22 October 2026. A typed name/preview flag is never teacher auth.
begin;
do $$ begin
 if not exists(select 1 from auth.users where id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then
  raise exception 'The verified existing teacher login is missing; review ownership';
 end if;
end $$;
create schema if not exists y8_gameclub_private;
revoke all on schema y8_gameclub_private from public,anon,authenticated;
create table if not exists y8_gameclub_private.settings(
 lesson_id text primary key check(lesson_id='y8-game-club-lists-v1'),
 owner_id uuid not null references auth.users(id)
);
insert into y8_gameclub_private.settings values('y8-game-club-lists-v1','6901b13b-437c-4c79-ad01-a6bfc75f6a62') on conflict do nothing;
do $$ begin
 if not exists(select 1 from y8_gameclub_private.settings where lesson_id='y8-game-club-lists-v1' and owner_id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Existing lesson ownership differs; nothing was reassigned'; end if;
end $$;
create table if not exists y8_gameclub_private.sessions(
 id uuid primary key, token_hash text not null check(length(token_hash)=64),
 lesson_id text not null references y8_gameclub_private.settings(lesson_id),
 student_name text not null check(length(student_name) between 2 and 80),
 class_name text not null check(class_name in ('8T','8E')),
 source_class_id uuid, created_at timestamptz not null default clock_timestamp(),
 updated_at timestamptz not null default clock_timestamp(),
 snapshot jsonb not null default '{}'::jsonb,
 snapshot_client_at timestamptz,
 evidence jsonb, evidence_client_at timestamptz
);
create index if not exists y8_gameclub_sessions_class on y8_gameclub_private.sessions(class_name,updated_at desc);
create table if not exists y8_gameclub_private.events(
 server_seq bigint generated always as identity primary key,
 session_id uuid not null references y8_gameclub_private.sessions(id) on delete cascade,
 event_id uuid not null, writer_id uuid not null,
 kind text not null, card_id text,
 client_at timestamptz not null, received_at timestamptz not null default clock_timestamp(),
 data jsonb not null,
 unique(session_id,event_id)
);
create index if not exists y8_gameclub_events_session on y8_gameclub_private.events(session_id,server_seq desc);
alter table y8_gameclub_private.settings enable row level security;
alter table y8_gameclub_private.sessions enable row level security;
alter table y8_gameclub_private.events enable row level security;
revoke all on all tables in schema y8_gameclub_private from public,anon,authenticated;
revoke all on all sequences in schema y8_gameclub_private from public,anon,authenticated;

create or replace function y8_gameclub_private.token_hash(p_token text)
returns text language plpgsql immutable set search_path='' as $$
begin
 if p_token is null or p_token !~ '^[0-9a-f]{64}$' then raise exception 'Invalid session key' using errcode='22023'; end if;
 return pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex');
end $$;
create or replace function y8_gameclub_private.is_owner()
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from y8_gameclub_private.settings where lesson_id='y8-game-club-lists-v1' and owner_id=auth.uid());
$$;
revoke all on function y8_gameclub_private.token_hash(text) from public,anon,authenticated;
revoke all on function y8_gameclub_private.is_owner() from public,anon,authenticated;

create or replace function public.y8_gameclub_join(p_session_id uuid,p_token text,p_name text,p_class_name text,p_source_class_id uuid default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s y8_gameclub_private.sessions; h text; n text;
begin
 h:=y8_gameclub_private.token_hash(p_token);
 n:=btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'));
 if p_session_id is null or length(n) not between 2 and 80 or lower(n)='teacher' or p_class_name is null or p_class_name not in ('8T','8E') then raise exception 'Enter a valid student name and class' using errcode='22023'; end if;
 -- Serialise registration/rate caps for this lesson. Names are self-entered,
 -- never used to overwrite another pupil's session or to grant access.
 perform 1 from y8_gameclub_private.settings where lesson_id='y8-game-club-lists-v1' for update;
 select * into s from y8_gameclub_private.sessions where id=p_session_id;
 if found then
  if s.token_hash<>h or s.student_name<>n or s.class_name<>p_class_name then raise exception 'Session key does not match' using errcode='42501'; end if;
 else
  if (select count(*) from y8_gameclub_private.sessions where created_at>clock_timestamp()-interval '24 hours')>=300 then raise exception 'Registration limit reached; ask your teacher' using errcode='54000'; end if;
  insert into y8_gameclub_private.sessions(id,token_hash,lesson_id,student_name,class_name,source_class_id)
   values(p_session_id,h,'y8-game-club-lists-v1',n,p_class_name,p_source_class_id) returning * into s;
 end if;
 return jsonb_build_object('session_id',s.id,'server_now',clock_timestamp());
end $$;

create or replace function public.y8_gameclub_save(p_session_id uuid,p_token text,p_events jsonb,p_snapshot jsonb default null,p_snapshot_at timestamptz default null,p_evidence_action text default 'keep',p_evidence jsonb default null,p_evidence_at timestamptz default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s y8_gameclub_private.sessions; item jsonb; n integer; accepted integer;
begin
 select * into s from y8_gameclub_private.sessions where id=p_session_id for update;
 if not found or s.token_hash<>y8_gameclub_private.token_hash(p_token) then raise exception 'Session key does not match' using errcode='42501'; end if;
 if p_events is null or jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>40 or octet_length(p_events::text)>900000 then raise exception 'Invalid event batch' using errcode='22023'; end if;
 for item in select value from jsonb_array_elements(p_events) loop
  if jsonb_typeof(item)<>'object' or item->>'kind' is null or item->>'kind' not in ('join','resume','field','attempt','action','navigate','support','evidence','export','teams','reset','restore','console_input')
   or jsonb_typeof(item->'data') is distinct from 'object' or octet_length((item->'data')::text)>400000
   or item->>'event_id' is null or item->>'writer_id' is null or item->>'client_at' is null
   or length(coalesce(item->>'card_id',''))>80 then raise exception 'Invalid event' using errcode='22023'; end if;
  perform (item->>'event_id')::uuid,(item->>'writer_id')::uuid,(item->>'client_at')::timestamptz;
 end loop;
 if p_snapshot is not null then
  if jsonb_typeof(p_snapshot)<>'object' or octet_length(p_snapshot::text)>4000000
   or p_snapshot->>'lessonId' is distinct from s.lesson_id or p_snapshot->>'name' is distinct from s.student_name
   or p_snapshot->>'className' is distinct from s.class_name or p_snapshot->'teacher' is distinct from 'false'::jsonb
   or jsonb_typeof(p_snapshot->'responses') is distinct from 'object' or p_snapshot_at is null or p_snapshot_at>clock_timestamp()+interval '5 minutes' then
   raise exception 'Invalid work snapshot' using errcode='22023'; end if;
 end if;
 if p_evidence_action is null or p_evidence_action not in ('keep','set','delete') then raise exception 'Invalid evidence action' using errcode='22023'; end if;
 if p_evidence_action<>'keep' and (p_evidence_at is null or p_evidence_at>clock_timestamp()+interval '5 minutes') then raise exception 'Invalid evidence time' using errcode='22023'; end if;
 if p_evidence_action='set' and (p_evidence is null or jsonb_typeof(p_evidence)<>'object' or octet_length(p_evidence::text)>6000000
  or coalesce(p_evidence->>'data','') !~ '^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$' or length(coalesce(p_evidence->>'caption',''))>300) then raise exception 'Invalid image evidence' using errcode='22023'; end if;
 select count(*) into n from y8_gameclub_private.events where session_id=s.id;
 select count(*) into accepted from jsonb_array_elements(p_events) e where not exists(select 1 from y8_gameclub_private.events x where x.session_id=s.id and x.event_id=(e->>'event_id')::uuid);
 if n+accepted>10000 then raise exception 'Learning log limit reached; ask your teacher' using errcode='54000'; end if;
 insert into y8_gameclub_private.events(session_id,event_id,writer_id,kind,card_id,client_at,data)
 select s.id,(e->>'event_id')::uuid,(e->>'writer_id')::uuid,e->>'kind',e->>'card_id',(e->>'client_at')::timestamptz,e->'data'
 from jsonb_array_elements(p_events) e on conflict(session_id,event_id) do nothing;
 -- An offline/retried older snapshot cannot replace a newer saved state.
 update y8_gameclub_private.sessions set updated_at=clock_timestamp(),
  snapshot=case when p_snapshot is not null and (snapshot_client_at is null or p_snapshot_at>=snapshot_client_at) then p_snapshot else snapshot end,
  snapshot_client_at=case when p_snapshot is not null and (snapshot_client_at is null or p_snapshot_at>=snapshot_client_at) then p_snapshot_at else snapshot_client_at end,
  evidence=case when p_evidence_action<>'keep' and (evidence_client_at is null or p_evidence_at>=evidence_client_at) then case when p_evidence_action='delete' then null else p_evidence end else evidence end,
  evidence_client_at=case when p_evidence_action<>'keep' and (evidence_client_at is null or p_evidence_at>=evidence_client_at) then p_evidence_at else evidence_client_at end
 where id=s.id;
 return jsonb_build_object('session_id',s.id,'accepted',accepted,'server_now',clock_timestamp());
end $$;

create or replace function public.y8_gameclub_teacher_records(p_class_name text default null,p_limit integer default 100,p_offset integer default 0)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not y8_gameclub_private.is_owner() then raise exception 'Sign in using the approved lesson teacher account' using errcode='42501'; end if;
 if p_limit is null or p_limit not between 1 and 100 or p_offset is null or p_offset<0 or (p_class_name is not null and p_class_name not in ('8T','8E')) then raise exception 'Invalid filter' using errcode='22023'; end if;
 select coalesce(jsonb_agg(x.row order by x.updated_at desc),'[]'::jsonb) into result from(
  select s.updated_at,jsonb_build_object('id',s.id,'name',s.student_name,'className',s.class_name,'started',s.created_at,'updated',s.updated_at,'current',s.snapshot->'current',
   'coreMet',(select count(*) from jsonb_each(coalesce(s.snapshot->'responses','{}'::jsonb)) r where r.key in ('m1-append','m1-compare','m1-repair','m1-build','m2-trace','m2-boundary','m2-loop','m2-captain') and r.value->>'status'='correct'),
   'eventCount',(select count(*) from y8_gameclub_private.events e where e.session_id=s.id)) as row
  from y8_gameclub_private.sessions s where p_class_name is null or s.class_name=p_class_name order by s.updated_at desc limit p_limit offset p_offset
 ) x;
 return result;
end $$;
create or replace function public.y8_gameclub_teacher_detail(p_session_id uuid,p_before bigint default null,p_limit integer default 100)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare s y8_gameclub_private.sessions; log jsonb;
begin
 if not y8_gameclub_private.is_owner() then raise exception 'Sign in using the approved lesson teacher account' using errcode='42501'; end if;
 if p_limit is null or p_limit not between 1 and 200 then raise exception 'Invalid limit' using errcode='22023'; end if;
 select * into s from y8_gameclub_private.sessions where id=p_session_id;
 if not found then raise exception 'Record unavailable' using errcode='P0002'; end if;
 select coalesce(jsonb_agg(to_jsonb(e) order by e.server_seq desc),'[]'::jsonb) into log from(
  select server_seq,event_id,kind,card_id,client_at,received_at,data from y8_gameclub_private.events
  where session_id=s.id and (p_before is null or server_seq<p_before) order by server_seq desc limit p_limit
 ) e;
 return jsonb_build_object('id',s.id,'name',s.student_name,'className',s.class_name,'started',s.created_at,'updated',s.updated_at,
  'snapshot',s.snapshot,'evidence',s.evidence,'events',log,'eventCount',(select count(*) from y8_gameclub_private.events where session_id=s.id));
end $$;
revoke all on function public.y8_gameclub_join(uuid,text,text,text,uuid) from public,anon,authenticated;
revoke all on function public.y8_gameclub_save(uuid,text,jsonb,jsonb,timestamptz,text,jsonb,timestamptz) from public,anon,authenticated;
revoke all on function public.y8_gameclub_teacher_records(text,integer,integer) from public,anon,authenticated;
revoke all on function public.y8_gameclub_teacher_detail(uuid,bigint,integer) from public,anon,authenticated;
grant execute on function public.y8_gameclub_join(uuid,text,text,text,uuid) to anon;
grant execute on function public.y8_gameclub_save(uuid,text,jsonb,jsonb,timestamptz,text,jsonb,timestamptz) to anon;
grant execute on function public.y8_gameclub_teacher_records(text,integer,integer) to authenticated;
grant execute on function public.y8_gameclub_teacher_detail(uuid,bigint,integer) to authenticated;
notify pgrst,'reload schema';
commit;
