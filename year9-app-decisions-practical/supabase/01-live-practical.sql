-- Prepared, unapplied Year 9 practical records. Apply in the existing school project before enabling config.js. No browser key may bypass the approved teacher check. No changes to existing lessons or Auth.
begin;
do $$ begin
 if not exists(select 1 from auth.users where id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Existing approved teacher is missing'; end if;
end $$;
create schema if not exists y9_app_decisions_practical_private;
revoke all on schema y9_app_decisions_practical_private from public,anon,authenticated;
create table if not exists y9_app_decisions_practical_private.settings(lesson text primary key check(lesson='year9-app-decisions-practical'),owner_id uuid not null references auth.users(id));
insert into y9_app_decisions_practical_private.settings values('year9-app-decisions-practical','6901b13b-437c-4c79-ad01-a6bfc75f6a62') on conflict do nothing;
do $$ begin
 if not exists(select 1 from y9_app_decisions_practical_private.settings where owner_id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Lesson ownership differs'; end if;
end $$;
create table if not exists y9_app_decisions_practical_private.records(
 id uuid primary key,token_hash text not null check(length(token_hash)=64),
 student_name text not null check(length(student_name) between 2 and 90),class_name text not null check(class_name in ('9E','9T')),
 created_at timestamptz not null default clock_timestamp(),updated_at timestamptz not null default clock_timestamp(),last_seen_at timestamptz not null default clock_timestamp(),
 revision bigint not null default 0,snapshot jsonb not null default '{}'::jsonb,reviewed_help_at timestamptz,reviewed_help_key text
);
alter table y9_app_decisions_practical_private.records add column if not exists reviewed_help_key text;
alter table y9_app_decisions_practical_private.records add column if not exists archived_at timestamptz;
create table if not exists y9_app_decisions_practical_private.events(
 seq bigint generated always as identity primary key,record_id uuid not null references y9_app_decisions_practical_private.records(id) on delete cascade,
 event_id uuid not null,kind text not null,page_id text,client_at timestamptz not null,received_at timestamptz not null default clock_timestamp(),data jsonb not null,
 unique(record_id,event_id)
);
create table if not exists y9_app_decisions_practical_private.writes(
 record_id uuid not null references y9_app_decisions_practical_private.records(id) on delete cascade,write_id uuid not null,fingerprint text not null,revision bigint not null,received_at timestamptz not null default clock_timestamp(),primary key(record_id,write_id)
);
create index if not exists y9_app_decisions_practical_recent on y9_app_decisions_practical_private.records(class_name,updated_at desc);
create index if not exists y9_app_decisions_practical_history on y9_app_decisions_practical_private.events(record_id,seq desc);
alter table y9_app_decisions_practical_private.settings enable row level security;
alter table y9_app_decisions_practical_private.records enable row level security;
alter table y9_app_decisions_practical_private.events enable row level security;
alter table y9_app_decisions_practical_private.writes enable row level security;
revoke all on all tables in schema y9_app_decisions_practical_private from public,anon,authenticated;
revoke all on all sequences in schema y9_app_decisions_practical_private from public,anon,authenticated;
create or replace function y9_app_decisions_practical_private.owner() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from y9_app_decisions_practical_private.settings where lesson='year9-app-decisions-practical' and owner_id=auth.uid());
$$;
create or replace function y9_app_decisions_practical_private.hash(p_token text) returns text language plpgsql immutable set search_path='' as $$ begin
 if p_token is null or p_token !~ '^[0-9a-f]{64}$' then raise exception 'Invalid private record key' using errcode='22023';end if;
 return pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex');end $$;
create or replace function y9_app_decisions_practical_private.valid_page(p_page text) returns boolean language sql immutable set search_path='' as $$
 select coalesce(p_page in ('mission','starting-card','starting-words','now-input','now-event','now-else','learn-k1','learn-k2','learn-s1','learn-s2','learn-u1','learn-u2','focus','mit-open','mit-project','mit-download','mit-import','device','connect','predict','model-a','model-b','investigate','break-1','break-2','break-3','break-4','edit-title','edit-image','edit-choices','edit-comparison','edit-button','edit-first-message','edit-other-message','try-own-a','try-own-b','keep-creating','pit-k','pit-s','pit-u','pit-summary','exit-check','save-mit','reopen-mit','export-mit','submit'),false);
$$;
create or replace function public.y9_decisions_practical_join(p_record_id uuid,p_token text,p_name text,p_class text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_decisions_practical_private.records;h text;n text;begin
 h:=y9_app_decisions_practical_private.hash(p_token);n:=btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'));
 if p_record_id is null or length(n) not between 2 and 90 or p_class is null or p_class not in ('9E','9T') then raise exception 'Enter your name and choose 9E or 9T' using errcode='22023';end if;
 perform 1 from y9_app_decisions_practical_private.settings where lesson='year9-app-decisions-practical' for update;
 select * into r from y9_app_decisions_practical_private.records where id=p_record_id;
 if found then
  if r.token_hash<>h or r.student_name<>n or r.class_name<>p_class then raise exception 'Private record does not match' using errcode='42501';end if;
 else
  if (select count(*) from y9_app_decisions_practical_private.records where created_at>clock_timestamp()-interval '24 hours')>=300 then raise exception 'Registration limit reached. Tell your teacher.' using errcode='54000';end if;
  insert into y9_app_decisions_practical_private.records(id,token_hash,student_name,class_name) values(p_record_id,h,n,p_class) returning * into r;
 end if;
 return jsonb_build_object('id',r.id,'revision',r.revision,'server_now',clock_timestamp());end $$;
create or replace function public.y9_decisions_practical_save(p_record_id uuid,p_token text,p_expected_revision bigint,p_write_id uuid,p_snapshot jsonb,p_events jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_decisions_practical_private.records;w y9_app_decisions_practical_private.writes;item jsonb;fp text;begin
 select * into r from y9_app_decisions_practical_private.records where id=p_record_id for update;
 if not found or r.token_hash<>y9_app_decisions_practical_private.hash(p_token) then raise exception 'Private record does not match' using errcode='42501';end if;
 if p_write_id is null or p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or octet_length(p_snapshot::text)>524288
 or p_snapshot->>'lesson' is distinct from 'year9-app-decisions-practical' or p_snapshot->>'version' is distinct from '1'
 or p_snapshot#>>'{student,name}' is distinct from r.student_name or p_snapshot#>>'{student,form}' is distinct from r.class_name
 or not y9_app_decisions_practical_private.valid_page(p_snapshot->>'slide')
 or jsonb_typeof(p_snapshot->'practical') is distinct from 'object'
 or jsonb_typeof(p_snapshot->'answers') is distinct from 'object' or jsonb_typeof(p_snapshot->'feature') is distinct from 'object'
 or (p_snapshot ? 'trackingId') then raise exception 'Invalid lesson snapshot' using errcode='22023';end if;
 if p_events is null or jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>40 or octet_length(p_events::text)>200000 then raise exception 'Invalid update batch' using errcode='22023';end if;
 for item in select value from jsonb_array_elements(p_events) loop
  if jsonb_typeof(item)<>'object' or item->>'kind' is null or item->>'kind' not in ('join','resume','navigate','quiz-check','parsons-check','support','support-clear','preview','update','export','restore','mit-check','copy','source-download','reference-run','test-check','file-check')
   or not y9_app_decisions_practical_private.valid_page(item->>'page_id') or jsonb_typeof(item->'data') is distinct from 'object'
   or octet_length((item->'data')::text)>10000 or item->>'event_id' is null or item->>'client_at' is null then raise exception 'Invalid learning event' using errcode='22023';end if;
  perform (item->>'event_id')::uuid,(item->>'client_at')::timestamptz;
 end loop;
 fp:=pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(jsonb_build_array(p_snapshot,p_events)::text,'UTF8')),'hex');
 select * into w from y9_app_decisions_practical_private.writes where record_id=r.id and write_id=p_write_id;
 if found then
  if w.fingerprint<>fp then raise exception 'Update key reused with different work' using errcode='22023';end if;
  return jsonb_build_object('revision',w.revision,'server_now',w.received_at,'replayed',true);
 end if;
 if p_expected_revision is distinct from r.revision then raise exception 'Newer work is already saved. Close other lesson tabs, then restore the saved copy.' using errcode='PT409';end if;
 if (select count(*) from y9_app_decisions_practical_private.events where record_id=r.id)+jsonb_array_length(p_events)>15000 then raise exception 'Lesson history limit reached. Tell your teacher.' using errcode='54000';end if;
 insert into y9_app_decisions_practical_private.events(record_id,event_id,kind,page_id,client_at,data)
 select r.id,(e->>'event_id')::uuid,e->>'kind',e->>'page_id',(e->>'client_at')::timestamptz,e->'data' from jsonb_array_elements(p_events)e on conflict(record_id,event_id) do nothing;
 update y9_app_decisions_practical_private.records set snapshot=p_snapshot,revision=revision+1,updated_at=clock_timestamp(),last_seen_at=clock_timestamp() where id=r.id returning * into r;
 insert into y9_app_decisions_practical_private.writes(record_id,write_id,fingerprint,revision) values(r.id,p_write_id,fp,r.revision);
 return jsonb_build_object('revision',r.revision,'server_now',r.updated_at,'replayed',false);end $$;
create or replace function public.y9_decisions_practical_load(p_record_id uuid,p_token text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_decisions_practical_private.records;begin
 select * into r from y9_app_decisions_practical_private.records where id=p_record_id;
 if not found or r.token_hash<>y9_app_decisions_practical_private.hash(p_token) then raise exception 'Private record does not match' using errcode='42501';end if;
 return jsonb_build_object('snapshot',r.snapshot,'revision',r.revision,'updated',r.updated_at,'reviewed_help_at',r.reviewed_help_at,'reviewed_help_key',r.reviewed_help_key);end $$;
create or replace function public.y9_decisions_practical_ping(p_record_id uuid,p_token text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_decisions_practical_private.records;begin
 select * into r from y9_app_decisions_practical_private.records where id=p_record_id;
 if not found or r.token_hash<>y9_app_decisions_practical_private.hash(p_token) then raise exception 'Private record does not match' using errcode='42501';end if;
 if r.last_seen_at<clock_timestamp()-interval '20 seconds' then update y9_app_decisions_practical_private.records set last_seen_at=clock_timestamp() where id=r.id;end if;
 return jsonb_build_object('server_now',clock_timestamp());end $$;
create or replace function public.y9_decisions_practical_teacher_list(p_class text default null,p_limit integer default 100,p_offset integer default 0) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;begin
 if not y9_app_decisions_practical_private.owner() then raise exception 'Sign in with the approved teacher account' using errcode='42501';end if;
 if p_limit is null or p_limit not between 1 and 100 or p_offset is null or p_offset<0 or (p_class is not null and p_class not in ('9E','9T')) then raise exception 'Invalid filter' using errcode='22023';end if;
 select coalesce(jsonb_agg(x.item order by x.updated_at desc,x.id),'[]'::jsonb) into result from (
  select r.id,r.updated_at,jsonb_build_object('id',r.id,'name',r.student_name,'className',r.class_name,'created',r.created_at,'updated',r.updated_at,'seen',r.last_seen_at,'revision',r.revision,'reviewed_help_at',r.reviewed_help_at,'reviewed_help_key',r.reviewed_help_key,
   'stage',r.snapshot->>'slide','visited',coalesce(r.snapshot->'visited','[]'::jsonb),'answers',coalesce(r.snapshot->'answers','{}'::jsonb),'checked',coalesce(r.snapshot->'checked','{}'::jsonb),
   'learning',coalesce(r.snapshot->'learning','{}'::jsonb),'pit',coalesce(r.snapshot->'pit','{}'::jsonb),'parsons',r.snapshot->'parsons','parsonsChecked',r.snapshot->'parsonsChecked',
   'feature',coalesce(r.snapshot->'feature','{}'::jsonb),
   'practical',r.snapshot->'practical','support',r.snapshot->'support') as item
  from y9_app_decisions_practical_private.records r where r.archived_at is null and (p_class is null or r.class_name=p_class) order by r.updated_at desc,r.id limit p_limit offset p_offset
 )x;return result;end $$;
create or replace function public.y9_decisions_practical_teacher_detail(p_record_id uuid,p_before bigint default null,p_limit integer default 60) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r y9_app_decisions_practical_private.records;log jsonb;begin
 if not y9_app_decisions_practical_private.owner() then raise exception 'Sign in with the approved teacher account' using errcode='42501';end if;
 if p_limit is null or p_limit not between 1 and 200 then raise exception 'Invalid page size' using errcode='22023';end if;
 select * into r from y9_app_decisions_practical_private.records where id=p_record_id;
 if not found then raise exception 'Record unavailable' using errcode='P0002';end if;
 select coalesce(jsonb_agg(to_jsonb(x) order by x.seq desc),'[]'::jsonb) into log from(select seq,kind,page_id,client_at,received_at,data from y9_app_decisions_practical_private.events where record_id=r.id and (p_before is null or seq<p_before) order by seq desc limit p_limit)x;
 return jsonb_build_object('id',r.id,'name',r.student_name,'className',r.class_name,'created',r.created_at,'updated',r.updated_at,'seen',r.last_seen_at,'revision',r.revision,'reviewed_help_at',r.reviewed_help_at,'reviewed_help_key',r.reviewed_help_key,'snapshot',r.snapshot,'events',log,
 'eventCount',(select count(*) from y9_app_decisions_practical_private.events where record_id=r.id));end $$;
create or replace function public.y9_decisions_practical_teacher_review(p_record_id uuid,p_help_at text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_decisions_practical_private.records;begin
 if not y9_app_decisions_practical_private.owner() then raise exception 'Sign in with the approved teacher account' using errcode='42501';end if;
 select * into r from y9_app_decisions_practical_private.records where id=p_record_id for update;
 if not found or r.snapshot#>>'{support,at}' is distinct from p_help_at or r.snapshot#>>'{support,open}' is distinct from 'true' then raise exception 'This support request has changed. Refresh the record.' using errcode='PT409';end if;
 update y9_app_decisions_practical_private.records set reviewed_help_at=clock_timestamp(),reviewed_help_key=p_help_at where id=r.id;
 return jsonb_build_object('reviewed',true,'server_now',clock_timestamp());end $$;
revoke all on all functions in schema y9_app_decisions_practical_private from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_join(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_save(uuid,text,bigint,uuid,jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_load(uuid,text) from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_ping(uuid,text) from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_teacher_list(text,integer,integer) from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_teacher_detail(uuid,bigint,integer) from public,anon,authenticated;
revoke all on function public.y9_decisions_practical_teacher_review(uuid,text) from public,anon,authenticated;
grant execute on function public.y9_decisions_practical_join(uuid,text,text,text) to anon;
grant execute on function public.y9_decisions_practical_save(uuid,text,bigint,uuid,jsonb,jsonb) to anon;
grant execute on function public.y9_decisions_practical_load(uuid,text) to anon;
grant execute on function public.y9_decisions_practical_ping(uuid,text) to anon;
grant execute on function public.y9_decisions_practical_teacher_list(text,integer,integer) to authenticated;
grant execute on function public.y9_decisions_practical_teacher_detail(uuid,bigint,integer) to authenticated;
grant execute on function public.y9_decisions_practical_teacher_review(uuid,text) to authenticated;
notify pgrst,'reload schema';
commit;
select true as year9_app_decisions_practical_live_ready;
