-- Year 6 Week 10 only. No changes to other lessons, Auth users, keys or grants.
begin;
do $$ begin
 if not exists(select 1 from auth.users where id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Approved teacher account missing';end if;
end $$;
create schema if not exists y6_week10_private;
revoke all on schema y6_week10_private from public,anon,authenticated;
create table if not exists y6_week10_private.settings(lesson text primary key check(lesson='y6-week10-visitor-counter'),owner_id uuid not null references auth.users(id));
insert into y6_week10_private.settings values('y6-week10-visitor-counter','6901b13b-437c-4c79-ad01-a6bfc75f6a62') on conflict do nothing;
do $$ begin
 if not exists(select 1 from y6_week10_private.settings where lesson='y6-week10-visitor-counter' and owner_id='6901b13b-437c-4c79-ad01-a6bfc75f6a62') then raise exception 'Week 10 ownership differs';end if;
end $$;
create table if not exists y6_week10_private.records(
 id uuid primary key,token_hash text not null check(length(token_hash)=64),
 student_name text not null check(length(student_name) between 1 and 100),class_name text not null check(length(class_name) between 1 and 100),
 created_at timestamptz not null default clock_timestamp(),updated_at timestamptz not null default clock_timestamp(),last_seen_at timestamptz not null default clock_timestamp(),
 revision bigint not null default 0,snapshot jsonb not null default '{}'::jsonb,
 reviewed_help_at timestamptz,reviewed_help_key text,archived_at timestamptz
);
create table if not exists y6_week10_private.events(
 seq bigint generated always as identity primary key,record_id uuid not null references y6_week10_private.records(id) on delete cascade,
 event_id uuid not null,kind text not null,page_id text not null,client_at timestamptz not null,received_at timestamptz not null default clock_timestamp(),data jsonb not null,
 unique(record_id,event_id)
);
create table if not exists y6_week10_private.writes(
 record_id uuid not null references y6_week10_private.records(id) on delete cascade,write_id uuid not null,fingerprint text not null,
 revision bigint not null,received_at timestamptz not null default clock_timestamp(),primary key(record_id,write_id)
);
create index if not exists y6_week10_recent on y6_week10_private.records(class_name,updated_at desc);
create index if not exists y6_week10_history on y6_week10_private.events(record_id,seq desc);
create index if not exists y6_week10_write_rate on y6_week10_private.writes(record_id,received_at desc);
alter table y6_week10_private.settings enable row level security;
alter table y6_week10_private.records enable row level security;
alter table y6_week10_private.events enable row level security;
alter table y6_week10_private.writes enable row level security;
revoke all on all tables in schema y6_week10_private from public,anon,authenticated;
revoke all on all sequences in schema y6_week10_private from public,anon,authenticated;
create or replace function y6_week10_private.owner() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from y6_week10_private.settings where lesson='y6-week10-visitor-counter' and owner_id=auth.uid());
$$;
create or replace function y6_week10_private.hash(p_token text) returns text language plpgsql immutable set search_path='' as $$ begin
 if p_token is null or p_token !~ '^[0-9a-f]{64}$' then raise exception 'Invalid private record key' using errcode='22023';end if;
 return pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(p_token,'UTF8')),'hex');end $$;
create or replace function y6_week10_private.page(p_index integer) returns text language sql immutable set search_path='' as $$
 select (array['mission','recall','predict-unplugged','learn-knowledge','learn-skills','learn-understanding','variable','open','make-variable','start-zero','show-value','count-a','count-test','compare','reset-purpose','reset-build','reset-test','clear-fact','debug','pitstop','practice-choice','repair','pairs','welcome','hardware-choice','hardware-1','hardware-2','hardware-3','hardware-4','hardware-5','explain','reflect','save-hex','home','restore-23a','restore-23b','restore-23c','submit'])[p_index+1];
$$;
create or replace function y6_week10_private.valid_page(p_page text) returns boolean language sql immutable set search_path='' as $$
 select coalesce(exists(select 1 from pg_catalog.generate_series(0,37) i where y6_week10_private.page(i)=p_page),false);
$$;
create or replace function y6_week10_private.needs_support(p_snapshot jsonb,p_reviewed text) returns boolean language sql immutable set search_path='' as $$
 select coalesce((p_snapshot#>>'{support,open}'='true' and p_snapshot#>>'{support,at}' is distinct from p_reviewed)
 or p_snapshot#>>'{values,phase}'='help' or p_snapshot#>>'{values,learn-knowledge}'='2' or p_snapshot#>>'{values,learn-skills}'='2' or p_snapshot#>>'{values,learn-understanding}'='2',false);
$$;
create or replace function public.y6w10_join(p_record_id uuid,p_token text,p_name text,p_class text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y6_week10_private.records;h text;n text;c text;begin
 h:=y6_week10_private.hash(p_token);n:=btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'));c:=btrim(regexp_replace(coalesce(p_class,''),'[[:cntrl:]]','','g'));
 if p_record_id is null or length(n) not between 1 and 100 or length(c) not between 1 and 100 or lower(n)='teacher' then raise exception 'Enter your name and class' using errcode='22023';end if;
 perform 1 from y6_week10_private.settings where lesson='y6-week10-visitor-counter' for update;
 select * into r from y6_week10_private.records where id=p_record_id;
 if found then
  if r.token_hash<>h or r.student_name<>n or r.class_name<>c or r.archived_at is not null then raise exception 'Private record does not match' using errcode='42501';end if;
 else
  if (select count(*) from y6_week10_private.records where created_at>clock_timestamp()-interval '24 hours')>=300 then raise exception 'Registration limit reached. Tell your teacher.' using errcode='54000';end if;
  insert into y6_week10_private.records(id,token_hash,student_name,class_name) values(p_record_id,h,n,c) returning * into r;
 end if;
 return jsonb_build_object('id',r.id,'revision',r.revision,'server_now',clock_timestamp());end $$;
create or replace function public.y6w10_save(p_record_id uuid,p_token text,p_expected_revision bigint,p_write_id uuid,p_snapshot jsonb,p_events jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y6_week10_private.records;w y6_week10_private.writes;item jsonb;fp text;pair record;begin
 select * into r from y6_week10_private.records where id=p_record_id for update;
 if not found or r.token_hash<>y6_week10_private.hash(p_token) or r.archived_at is not null then raise exception 'Private record does not match' using errcode='42501';end if;
 if p_write_id is null or p_snapshot is null or jsonb_typeof(p_snapshot)<>'object' or octet_length(p_snapshot::text)>524288
 or p_snapshot->>'lesson' is distinct from 'y6-week10-visitor-counter' or p_snapshot->>'version' is distinct from '1'
 or p_snapshot#>>'{profile,name}' is distinct from r.student_name or p_snapshot#>>'{profile,className}' is distinct from r.class_name
 or p_snapshot#>>'{profile,mode}' is null or p_snapshot#>>'{profile,mode}' not in ('solo','pair')
 or length(coalesce(p_snapshot#>>'{profile,partner}',''))>100
 or coalesce(p_snapshot->>'card','') !~ '^[0-9]{1,2}$' then raise exception 'Invalid lesson snapshot' using errcode='22023';end if;
 if p_snapshot->>'page' is distinct from y6_week10_private.page((p_snapshot->>'card')::integer)
 or not y6_week10_private.valid_page(p_snapshot->>'page')
 or jsonb_typeof(p_snapshot->'values') is distinct from 'object' or jsonb_typeof(p_snapshot->'checks') is distinct from 'object'
 or jsonb_typeof(p_snapshot->'visited') is distinct from 'array' or jsonb_typeof(p_snapshot->'skipped') is distinct from 'array'
 or jsonb_typeof(p_snapshot->'support') is distinct from 'object'
 or jsonb_typeof(p_snapshot#>'{support,open}') is distinct from 'boolean'
 or length(coalesce(p_snapshot#>>'{support,at}',''))>64
 or (p_snapshot#>>'{support,open}'='true' and (not y6_week10_private.valid_page(p_snapshot#>>'{support,page}') or coalesce(p_snapshot#>>'{support,at}','')=''))
 or p_snapshot ?| array['liveId','trackingId','token','resumeKey','events'] then raise exception 'Invalid lesson fields' using errcode='22023';end if;
 if jsonb_array_length(p_snapshot->'visited')>100 or jsonb_array_length(p_snapshot->'skipped')>100 or (select count(*) from jsonb_each(p_snapshot->'values'))>250 or (select count(*) from jsonb_each(p_snapshot->'checks'))>250 then raise exception 'Lesson fields too large' using errcode='22023';end if;
 for pair in select * from jsonb_each(p_snapshot->'values') loop
  if pair.key !~ '^[A-Za-z0-9_-]{1,90}$' or jsonb_typeof(pair.value)<>'string' or length(pair.value#>>'{}')>3000 then raise exception 'Invalid answer field' using errcode='22023';end if;
 end loop;
 for pair in select * from jsonb_each(p_snapshot->'checks') loop
  if pair.key !~ '^[A-Za-z0-9_-]{1,90}$' or jsonb_typeof(pair.value)<>'boolean' then raise exception 'Invalid check field' using errcode='22023';end if;
 end loop;
 if p_events is null or jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>40 or octet_length(p_events::text)>200000 then raise exception 'Invalid update batch' using errcode='22023';end if;
 for item in select value from jsonb_array_elements(p_events) loop
  if jsonb_typeof(item)<>'object' or item->>'kind' is null or item->>'kind' not in ('join','navigate','update','choice','response','check','support','support-clear','export','restore','help-skip','continue','picture','mode','language','open','report','start','download')
   or not y6_week10_private.valid_page(item->>'page_id') or jsonb_typeof(item->'data') is distinct from 'object'
   or octet_length((item->'data')::text)>100000 or item->>'event_id' is null or item->>'client_at' is null then raise exception 'Invalid learning event' using errcode='22023';end if;
  perform (item->>'event_id')::uuid,(item->>'client_at')::timestamptz;
 end loop;
 fp:=pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(jsonb_build_array(p_snapshot,p_events)::text,'UTF8')),'hex');
 select * into w from y6_week10_private.writes where record_id=r.id and write_id=p_write_id;
 if found then
  if w.fingerprint<>fp then raise exception 'Update key reused with different work' using errcode='22023';end if;
  return jsonb_build_object('revision',w.revision,'server_now',w.received_at,'replayed',true);
 end if;
 if p_expected_revision is distinct from r.revision then raise exception 'Another tab saved newer work. Back up, then restore the school copy.' using errcode='PT409';end if;
 if (select count(*) from y6_week10_private.writes where record_id=r.id and received_at>clock_timestamp()-interval '1 minute')>=120 then raise exception 'Please pause a moment before saving again' using errcode='54000';end if;
 if (select count(*) from y6_week10_private.events where record_id=r.id)+jsonb_array_length(p_events)>15000 then raise exception 'Lesson history limit reached. Tell your teacher.' using errcode='54000';end if;
 insert into y6_week10_private.events(record_id,event_id,kind,page_id,client_at,data)
 select r.id,(e->>'event_id')::uuid,e->>'kind',e->>'page_id',(e->>'client_at')::timestamptz,e->'data' from jsonb_array_elements(p_events)e on conflict(record_id,event_id) do nothing;
 update y6_week10_private.records set snapshot=p_snapshot,revision=revision+1,updated_at=clock_timestamp(),last_seen_at=clock_timestamp() where id=r.id returning * into r;
 insert into y6_week10_private.writes(record_id,write_id,fingerprint,revision) values(r.id,p_write_id,fp,r.revision);
 return jsonb_build_object('revision',r.revision,'server_now',r.updated_at,'replayed',false);end $$;
create or replace function public.y6w10_load(p_record_id uuid,p_token text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y6_week10_private.records;begin
 select * into r from y6_week10_private.records where id=p_record_id;
 if not found or r.token_hash<>y6_week10_private.hash(p_token) or r.archived_at is not null then raise exception 'Private record does not match' using errcode='42501';end if;
 return jsonb_build_object('snapshot',r.snapshot,'revision',r.revision,'updated',r.updated_at,'reviewed_help_key',r.reviewed_help_key);end $$;
create or replace function public.y6w10_ping(p_record_id uuid,p_token text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y6_week10_private.records;begin
 select * into r from y6_week10_private.records where id=p_record_id;
 if not found or r.token_hash<>y6_week10_private.hash(p_token) or r.archived_at is not null then raise exception 'Private record does not match' using errcode='42501';end if;
 if r.last_seen_at<clock_timestamp()-interval '20 seconds' then update y6_week10_private.records set last_seen_at=clock_timestamp() where id=r.id;end if;
 return jsonb_build_object('server_now',clock_timestamp(),'reviewed_help_key',r.reviewed_help_key);end $$;
create or replace function public.y6w10_teacher_list(p_class text default null,p_search text default null,p_help_only boolean default false,p_limit integer default 100,p_offset integer default 0) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;begin
 if not y6_week10_private.owner() then raise exception 'Sign in with the approved teacher account' using errcode='42501';end if;
 if p_limit is null or p_limit not between 1 and 100 or p_offset is null or p_offset<0 or length(coalesce(p_class,''))>100 or length(coalesce(p_search,''))>100 or p_help_only is null then raise exception 'Invalid filter' using errcode='22023';end if;
 select coalesce(jsonb_agg(x.item order by x.updated_at desc,x.id),'[]'::jsonb) into result from (
  select r.id,r.updated_at,jsonb_build_object('id',r.id,'name',r.student_name,'className',r.class_name,'created',r.created_at,'updated',r.updated_at,'seen',r.last_seen_at,'revision',r.revision,'reviewed_help_key',r.reviewed_help_key,
   'page',r.snapshot->>'page','card',r.snapshot->'card','mode',r.snapshot#>>'{profile,mode}','partner',r.snapshot#>>'{profile,partner}',
   'phase',r.snapshot#>>'{values,phase}','readiness',jsonb_build_object('knowledge',r.snapshot#>>'{values,learn-knowledge}','skills',r.snapshot#>>'{values,learn-skills}','understanding',r.snapshot#>>'{values,learn-understanding}'),
   'quiz',jsonb_build_object('recall',r.snapshot#>>'{values,recall}','variable',r.snapshot#>>'{values,variable}','compare',r.snapshot#>>'{values,compare}','clear-fact',r.snapshot#>>'{values,clear-fact}'),
   'tests',jsonb_build_object('count1',r.snapshot#>>'{values,count1}','count2',r.snapshot#>>'{values,count2}','count3',r.snapshot#>>'{values,count3}','beforeReset',r.snapshot#>>'{values,beforeReset}','afterReset',r.snapshot#>>'{values,afterReset}','afterAgain',r.snapshot#>>'{values,afterAgain}'),
   'checks',jsonb_build_object('make-variable-done',r.snapshot#>'{checks,make-variable-done}','start-zero-done',r.snapshot#>'{checks,start-zero-done}','show-value-done',r.snapshot#>'{checks,show-value-done}','count-a-done',r.snapshot#>'{checks,count-a-done}','reset-build-done',r.snapshot#>'{checks,reset-build-done}'),
   'support',r.snapshot->'support','supportFlag',y6_week10_private.needs_support(r.snapshot,r.reviewed_help_key),'skipped',r.snapshot->'skipped') as item
  from y6_week10_private.records r where r.archived_at is null
   and (p_class is null or upper(regexp_replace(r.class_name,'[[:space:]]','','g'))=upper(regexp_replace(p_class,'[[:space:]]','','g')))
   and (p_search is null or strpos(lower(r.student_name),lower(p_search))>0)
   and (not p_help_only or y6_week10_private.needs_support(r.snapshot,r.reviewed_help_key))
  order by r.updated_at desc,r.id limit p_limit offset p_offset
 )x;return result;end $$;
create or replace function public.y6w10_teacher_detail(p_record_id uuid,p_before bigint default null,p_limit integer default 60) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r y6_week10_private.records;log jsonb;begin
 if not y6_week10_private.owner() then raise exception 'Sign in with the approved teacher account' using errcode='42501';end if;
 if p_limit is null or p_limit not between 1 and 200 then raise exception 'Invalid page size' using errcode='22023';end if;
 select * into r from y6_week10_private.records where id=p_record_id and archived_at is null;
 if not found then raise exception 'Record unavailable' using errcode='P0002';end if;
 select coalesce(jsonb_agg(to_jsonb(x) order by x.seq desc),'[]'::jsonb) into log from(select seq,kind,page_id,client_at,received_at,data from y6_week10_private.events where record_id=r.id and (p_before is null or seq<p_before) order by seq desc limit p_limit)x;
 return jsonb_build_object('id',r.id,'name',r.student_name,'className',r.class_name,'created',r.created_at,'updated',r.updated_at,'seen',r.last_seen_at,'revision',r.revision,'reviewed_help_key',r.reviewed_help_key,'snapshot',r.snapshot,'events',log,
  'eventCount',(select count(*) from y6_week10_private.events where record_id=r.id));end $$;
create or replace function public.y6w10_teacher_review(p_record_id uuid,p_help_at text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y6_week10_private.records;begin
 if not y6_week10_private.owner() then raise exception 'Sign in with the approved teacher account' using errcode='42501';end if;
 select * into r from y6_week10_private.records where id=p_record_id and archived_at is null for update;
 if not found or r.snapshot#>>'{support,at}' is distinct from p_help_at or r.snapshot#>>'{support,open}' is distinct from 'true' then raise exception 'This help request changed. Refresh first.' using errcode='PT409';end if;
 update y6_week10_private.records set reviewed_help_at=clock_timestamp(),reviewed_help_key=p_help_at where id=r.id;
 return jsonb_build_object('reviewed',true,'server_now',clock_timestamp());end $$;
revoke all on all functions in schema y6_week10_private from public,anon,authenticated;
revoke all on function public.y6w10_join(uuid,text,text,text) from public,anon,authenticated;
revoke all on function public.y6w10_save(uuid,text,bigint,uuid,jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.y6w10_load(uuid,text) from public,anon,authenticated;
revoke all on function public.y6w10_ping(uuid,text) from public,anon,authenticated;
revoke all on function public.y6w10_teacher_list(text,text,boolean,integer,integer) from public,anon,authenticated;
revoke all on function public.y6w10_teacher_detail(uuid,bigint,integer) from public,anon,authenticated;
revoke all on function public.y6w10_teacher_review(uuid,text) from public,anon,authenticated;
grant execute on function public.y6w10_join(uuid,text,text,text) to anon;
grant execute on function public.y6w10_save(uuid,text,bigint,uuid,jsonb,jsonb) to anon;
grant execute on function public.y6w10_load(uuid,text) to anon;
grant execute on function public.y6w10_ping(uuid,text) to anon;
grant execute on function public.y6w10_teacher_list(text,text,boolean,integer,integer) to authenticated;
grant execute on function public.y6w10_teacher_detail(uuid,bigint,integer) to authenticated;
grant execute on function public.y6w10_teacher_review(uuid,text) to authenticated;
notify pgrst,'reload schema';
commit;
select true as year6_week10_live_ready;
