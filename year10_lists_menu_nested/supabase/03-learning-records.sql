-- Additive passive learning records for THIS Lists/Menu lesson only.
-- Old classroom tables, pupils, permissions and Auth settings are untouched.
begin;
do $$ begin
 if not exists(select 1 from auth.users where id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Verified teacher account is missing'; end if;
end $$;
create schema if not exists y10_lists_records_private;
revoke all on schema y10_lists_records_private from public,anon,authenticated;
create table if not exists y10_lists_records_private.settings(
 lesson_id text primary key check(lesson_id='year10_lists_menu_nested'),
 owner_id uuid not null references auth.users(id)
);
insert into y10_lists_records_private.settings values('year10_lists_menu_nested','6901b13b-437c-4c79-ad01-a6bfc75f6a62') on conflict do nothing;
do $$ begin
 if not exists(select 1 from y10_lists_records_private.settings where lesson_id='year10_lists_menu_nested' and owner_id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Lesson ownership differs'; end if;
end $$;
create table if not exists y10_lists_records_private.sessions(
 id uuid primary key, token_hash text not null check(length(token_hash)=64),
 student_name text not null check(length(student_name) between 2 and 60),
 class_name text not null check(length(class_name) between 2 and 30),
 created_at timestamptz not null default clock_timestamp(),updated_at timestamptz not null default clock_timestamp(),
 snapshot jsonb not null default '{}'::jsonb,snapshot_client_at timestamptz
);
create table if not exists y10_lists_records_private.events(
 server_seq bigint generated always as identity primary key,
 session_id uuid not null references y10_lists_records_private.sessions(id) on delete cascade,
 event_id uuid not null,writer_id uuid not null,kind text not null,page_id text,
 client_at timestamptz not null,received_at timestamptz not null default clock_timestamp(),data jsonb not null,
 unique(session_id,event_id)
);
create table if not exists y10_lists_records_private.images(
 id uuid primary key,session_id uuid not null references y10_lists_records_private.sessions(id) on delete cascade,
 page_id text not null,name text not null,data text not null,client_at timestamptz not null,received_at timestamptz not null default clock_timestamp()
);
create index if not exists y10_lists_records_events_session on y10_lists_records_private.events(session_id,server_seq desc);
create index if not exists y10_lists_records_sessions_updated on y10_lists_records_private.sessions(updated_at desc);
alter table y10_lists_records_private.settings enable row level security;
alter table y10_lists_records_private.sessions enable row level security;
alter table y10_lists_records_private.events enable row level security;
alter table y10_lists_records_private.images enable row level security;
revoke all on all tables in schema y10_lists_records_private from public,anon,authenticated;
revoke all on all sequences in schema y10_lists_records_private from public,anon,authenticated;
create or replace function y10_lists_records_private.token_hash(p_token text)
returns text language plpgsql immutable set search_path='' as $$ begin
 if p_token is null or p_token !~ '^[0-9a-f]{64}$' then raise exception 'Invalid private session key' using errcode='22023'; end if;
 return pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex');
end $$;
create or replace function y10_lists_records_private.is_owner()
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from y10_lists_records_private.settings s where s.owner_id=auth.uid() and s.lesson_id='year10_lists_menu_nested');
$$;
create or replace function y10_lists_records_private.valid_stage(p_stage text)
returns boolean language sql immutable set search_path='' as $$
 select coalesce(p_stage in ('ready','starter-for','starter-while','types-k','types-s','types-u','types-focus','m1-positions','m1-compare','m1-create','m1-update','m1-traverse','m1-build','m2-menu-study','m2-model','m2-build','m2-update','m2-sequence','m2-explain','extension-menu','ex-clubs','ex-second','ex-lengths','ex-filter','ex-count','ex-number','ex-index','ex-option','ex-copies','ex-unknown','pit-k','pit-s','pit-u','pit-target','exit-index','exit-loops','finish'),false);
$$;
revoke all on function y10_lists_records_private.token_hash(text) from public,anon,authenticated;
revoke all on function y10_lists_records_private.is_owner() from public,anon,authenticated;
revoke all on function y10_lists_records_private.valid_stage(text) from public,anon,authenticated;
create or replace function public.y10_lists_records_join(p_session_id uuid,p_token text,p_name text,p_class_name text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s y10_lists_records_private.sessions; h text; n text;
begin
 h:=y10_lists_records_private.token_hash(p_token);n:=btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'));
 if p_session_id is null or length(n) not between 2 and 60 or lower(n)='teacher' or p_class_name is null or p_class_name !~ '^10[A-Z0-9 -]{0,28}$' then raise exception 'Enter your name and Year 10 class' using errcode='22023'; end if;
 perform 1 from y10_lists_records_private.settings where lesson_id='year10_lists_menu_nested' for update;
 select * into s from y10_lists_records_private.sessions where id=p_session_id;
 if found then
  if s.token_hash<>h or s.student_name<>n or s.class_name<>p_class_name then raise exception 'Private session key does not match' using errcode='42501'; end if;
 else
  if (select count(*) from y10_lists_records_private.sessions where created_at>clock_timestamp()-interval '24 hours')>=300 then raise exception 'Lesson registration limit reached; tell your teacher' using errcode='54000'; end if;
  insert into y10_lists_records_private.sessions(id,token_hash,student_name,class_name) values(p_session_id,h,n,p_class_name) returning * into s;
 end if;
 return jsonb_build_object('session_id',s.id,'server_now',clock_timestamp());
end $$;
create or replace function public.y10_lists_records_save(p_session_id uuid,p_token text,p_events jsonb,p_snapshot jsonb default null,p_snapshot_at timestamptz default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s y10_lists_records_private.sessions; item jsonb; accepted integer;
begin
 select * into s from y10_lists_records_private.sessions where id=p_session_id for update;
 if not found or s.token_hash<>y10_lists_records_private.token_hash(p_token) then raise exception 'Private session key does not match' using errcode='42501'; end if;
 if p_events is null or jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>40 or octet_length(p_events::text)>2000000 then raise exception 'Invalid learning-event batch' using errcode='22023'; end if;
 for item in select value from jsonb_array_elements(p_events) loop
  if jsonb_typeof(item)<>'object' or item->>'kind' is null or item->>'kind' not in ('join','resume','page_state','attempt','run','test','navigate','support','evidence','export','restore','console_input','complete')
   or jsonb_typeof(item->'data') is distinct from 'object' or octet_length((item->'data')::text)>1000000
   or item->>'event_id' is null or item->>'writer_id' is null or item->>'client_at' is null
   or (item->>'page_id' is not null and not y10_lists_records_private.valid_stage(item->>'page_id')) then raise exception 'Invalid learning event' using errcode='22023'; end if;
  perform (item->>'event_id')::uuid,(item->>'writer_id')::uuid,(item->>'client_at')::timestamptz;
 end loop;
 if p_snapshot is not null and (jsonb_typeof(p_snapshot)<>'object' or octet_length(p_snapshot::text)>4000000
  or p_snapshot->>'lesson' is distinct from 'year10_lists_menu_nested' or p_snapshot->>'name' is distinct from s.student_name
  or p_snapshot->>'className' is distinct from s.class_name or p_snapshot->>'role' is distinct from 'student'
  or jsonb_typeof(p_snapshot->'pages') is distinct from 'object' or p_snapshot_at is null or p_snapshot_at>clock_timestamp()+interval '5 minutes') then raise exception 'Invalid work snapshot' using errcode='22023'; end if;
 select count(*) into accepted from jsonb_array_elements(p_events) e where not exists(select 1 from y10_lists_records_private.events x where x.session_id=s.id and x.event_id=(e->>'event_id')::uuid);
 if accepted+(select count(*) from y10_lists_records_private.events where session_id=s.id)>20000 then raise exception 'Lesson history limit reached; tell your teacher' using errcode='54000'; end if;
 insert into y10_lists_records_private.events(session_id,event_id,writer_id,kind,page_id,client_at,data)
 select s.id,(e->>'event_id')::uuid,(e->>'writer_id')::uuid,e->>'kind',e->>'page_id',(e->>'client_at')::timestamptz,e->'data' from jsonb_array_elements(p_events) e on conflict(session_id,event_id) do nothing;
 update y10_lists_records_private.sessions set updated_at=clock_timestamp(),
 snapshot=case when p_snapshot is not null and (snapshot_client_at is null or p_snapshot_at>=snapshot_client_at) then p_snapshot else snapshot end,
 snapshot_client_at=case when p_snapshot is not null and (snapshot_client_at is null or p_snapshot_at>=snapshot_client_at) then p_snapshot_at else snapshot_client_at end where id=s.id;
 return jsonb_build_object('session_id',s.id,'accepted',accepted,'server_now',clock_timestamp());
end $$;
create or replace function public.y10_lists_records_image_save(p_session_id uuid,p_token text,p_image jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s y10_lists_records_private.sessions; image_id uuid;
begin
 select * into s from y10_lists_records_private.sessions where id=p_session_id for update;
 if not found or s.token_hash<>y10_lists_records_private.token_hash(p_token) then raise exception 'Private session key does not match' using errcode='42501'; end if;
 if p_image is null or jsonb_typeof(p_image)<>'object' or octet_length(p_image::text)>4500000 or p_image->>'id' is null or p_image->>'at' is null
  or not coalesce(y10_lists_records_private.valid_stage(p_image->>'pageId'),false) or length(coalesce(p_image->>'name',''))>100
  or coalesce(p_image->>'data','') !~ '^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$' then raise exception 'Invalid screenshot' using errcode='22023'; end if;
 image_id:=(p_image->>'id')::uuid;
 if exists(select 1 from y10_lists_records_private.images where id=image_id and session_id<>s.id) then raise exception 'Image key belongs to another record' using errcode='42501'; end if;
 if not exists(select 1 from y10_lists_records_private.images where id=image_id) and (select count(*) from y10_lists_records_private.images where session_id=s.id)>=8 then raise exception 'Eight screenshots already saved' using errcode='54000'; end if;
 insert into y10_lists_records_private.images(id,session_id,page_id,name,data,client_at) values(image_id,s.id,p_image->>'pageId',coalesce(p_image->>'name','Screenshot'),p_image->>'data',(p_image->>'at')::timestamptz) on conflict(id) do nothing;
 return jsonb_build_object('image_id',image_id,'server_now',clock_timestamp());
end $$;
create or replace function public.y10_lists_records_teacher_list(p_class_name text default null,p_limit integer default 100,p_offset integer default 0)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not y10_lists_records_private.is_owner() then raise exception 'Sign in with the approved lesson teacher account' using errcode='42501'; end if;
 if p_limit is null or p_limit not between 1 and 100 or p_offset is null or p_offset<0 then raise exception 'Invalid page' using errcode='22023'; end if;
 select coalesce(jsonb_agg(x.row order by x.updated_at desc),'[]'::jsonb) into result from(
 select s.updated_at,jsonb_build_object('id',s.id,'name',s.student_name,'className',s.class_name,'started',s.created_at,'updated',s.updated_at,'stage',s.snapshot->>'stage',
 'eventCount',(select count(*) from y10_lists_records_private.events e where e.session_id=s.id)) as row
 from y10_lists_records_private.sessions s where p_class_name is null or s.class_name=p_class_name order by s.updated_at desc limit p_limit offset p_offset) x;
 return result;
end $$;
create or replace function public.y10_lists_records_teacher_detail(p_session_id uuid,p_before bigint default null,p_limit integer default 100)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare s y10_lists_records_private.sessions; log jsonb; images jsonb;
begin
 if not y10_lists_records_private.is_owner() then raise exception 'Sign in with the approved lesson teacher account' using errcode='42501'; end if;
 if p_limit is null or p_limit not between 1 and 200 then raise exception 'Invalid limit' using errcode='22023'; end if;
 select * into s from y10_lists_records_private.sessions where id=p_session_id;
 if not found then raise exception 'Record unavailable' using errcode='P0002'; end if;
 select coalesce(jsonb_agg(to_jsonb(e) order by e.server_seq desc),'[]'::jsonb) into log from(select server_seq,event_id,kind,page_id,client_at,received_at,data from y10_lists_records_private.events where session_id=s.id and (p_before is null or server_seq<p_before) order by server_seq desc limit p_limit) e;
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'pageId',page_id,'name',name,'at',client_at)),'[]'::jsonb) into images from y10_lists_records_private.images where session_id=s.id;
 return jsonb_build_object('id',s.id,'name',s.student_name,'className',s.class_name,'started',s.created_at,'updated',s.updated_at,'snapshot',s.snapshot,'images',images,'events',log,'eventCount',(select count(*) from y10_lists_records_private.events where session_id=s.id));
end $$;
create or replace function public.y10_lists_records_teacher_image(p_image_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not y10_lists_records_private.is_owner() then raise exception 'Sign in with the approved lesson teacher account' using errcode='42501'; end if;
 select jsonb_build_object('id',id,'pageId',page_id,'name',name,'data',data,'at',client_at) into result from y10_lists_records_private.images where id=p_image_id;
 return result;
end $$;
revoke all on function public.y10_lists_records_join(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.y10_lists_records_save(uuid,text,jsonb,jsonb,timestamptz) from public,anon,authenticated;
revoke all on function public.y10_lists_records_image_save(uuid,text,jsonb) from public,anon,authenticated;
revoke all on function public.y10_lists_records_teacher_list(text,integer,integer) from public,anon,authenticated;
revoke all on function public.y10_lists_records_teacher_detail(uuid,bigint,integer) from public,anon,authenticated;
revoke all on function public.y10_lists_records_teacher_image(uuid) from public,anon,authenticated;
grant execute on function public.y10_lists_records_join(uuid,text,text,text) to anon;
grant execute on function public.y10_lists_records_save(uuid,text,jsonb,jsonb,timestamptz) to anon;
grant execute on function public.y10_lists_records_image_save(uuid,text,jsonb) to anon;
grant execute on function public.y10_lists_records_teacher_list(text,integer,integer) to authenticated;
grant execute on function public.y10_lists_records_teacher_detail(uuid,bigint,integer) to authenticated;
grant execute on function public.y10_lists_records_teacher_image(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
