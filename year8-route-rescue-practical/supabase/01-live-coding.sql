-- Route Rescue only. No changes to other lessons, Auth settings or Realtime.
begin;
create schema if not exists y8_route_private;
revoke all on schema y8_route_private from public, anon, authenticated;
create table if not exists y8_route_private.settings (
  singleton boolean primary key default true check(singleton), teacher_id uuid not null references auth.users(id)
);
insert into y8_route_private.settings(singleton,teacher_id)
values(true,'6901b13b-437c-4c79-ad01-a6bfc75f6a62') on conflict do nothing;
create table if not exists y8_route_private.rooms (
 id uuid primary key default gen_random_uuid(), code text unique not null, owner_id uuid not null,
 class_name text not null check(class_name in ('8T','8E')), created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '8 hours', ended boolean not null default false,
 phase text not null default 'work' check(phase in ('work','invite','response','discuss','retry','follow')),
 round_no int not null default 1 check(round_no in (1,2)), response_kind text not null default 'initial' check(response_kind in ('initial','revision')), revision int not null default 0,
 last_command uuid, heartbeat timestamptz not null default now(), deadline timestamptz,
 paused_seconds int, clock_seconds int not null default 0, clock_anchor timestamptz,
 revealed boolean not null default false, demo_code text not null default '', demo_output text not null default '',
 featured jsonb
);
alter table y8_route_private.rooms add column if not exists board_stage text;
alter table y8_route_private.rooms add column if not exists board_stage_anchor int not null default 0;
alter table y8_route_private.rooms add column if not exists board_stage_duration int not null default 180;
create table if not exists y8_route_private.students (
 id uuid primary key default gen_random_uuid(), room_id uuid not null references y8_route_private.rooms(id),
 token_hash text not null, name text not null check(length(name) between 1 and 80),
 status text not null default 'pending' check(status in ('pending','admitted','rejected')),
 ready_round int, help boolean not null default false, joined_at timestamptz not null default now(),
 last_seen timestamptz not null default now(), unique(room_id,token_hash)
);
create table if not exists y8_route_private.responses (
 student_id uuid not null references y8_route_private.students(id), round_no int not null check(round_no in (1,2)),
 kind text not null check(kind in ('initial','revision')), code text not null default '', output text not null default '',
 error text not null default '', saved_at timestamptz not null default now(), submitted_at timestamptz,
 primary key(student_id,round_no,kind)
);
create table if not exists y8_route_private.attempts (
 event_id uuid primary key, student_id uuid not null references y8_route_private.students(id),
 round_no int not null check(round_no in (1,2)), kind text not null check(kind in ('initial','revision')),
 event_type text not null check(event_type in ('run','submit')), code text not null, output text not null,
 error text not null, at timestamptz not null default now()
);
create table if not exists y8_route_private.awards (
 id uuid primary key, student_id uuid not null references y8_route_private.students(id), round_no int not null,
 amount int not null check(amount between 1 and 5), reason text not null check(length(reason) between 1 and 160),
 teacher_id uuid not null, at timestamptz not null default now(), undone_at timestamptz
);
alter table y8_route_private.settings enable row level security;
alter table y8_route_private.rooms enable row level security;
alter table y8_route_private.students enable row level security;
alter table y8_route_private.responses enable row level security;
alter table y8_route_private.attempts enable row level security;
alter table y8_route_private.awards enable row level security;
revoke all on all tables in schema y8_route_private from public,anon,authenticated;

create or replace function y8_route_private.hash_token(t text) returns text language sql immutable set search_path='' as $$
 select pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(t,'UTF8')),'hex')
$$;
create or replace function y8_route_private.snapshot(r y8_route_private.rooms) returns jsonb
language sql stable set search_path='' as $$
 select jsonb_build_object('id',r.id,'code',r.code,'className',r.class_name,'revision',r.revision,
 'round',r.round_no,'responseKind',r.response_kind,'phase',case when r.ended or r.expires_at<now() or r.heartbeat<now()-interval '120 seconds' then 'work'
 when r.phase in ('response','retry') and r.deadline<=now() then 'discuss' else r.phase end,
 'connected',not r.ended and r.expires_at>now() and r.heartbeat>now()-interval '120 seconds',
 'ended',r.ended,'boardStage',r.board_stage,'boardStageAnchor',r.board_stage_anchor,'boardStageDuration',r.board_stage_duration,'serverNow',now(),'deadline',r.deadline,'pausedSeconds',r.paused_seconds,
 'clockSeconds',r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,
 'clockRunning',r.clock_anchor is not null,'revealed',r.revealed,
 'demo',case when r.revealed then jsonb_build_object('code',r.demo_code,'output',r.demo_output) else null end,
 'featured',r.featured)
$$;
create or replace function public.y8_route_teacher(p_action text,p_room uuid default null,p_data jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y8_route_private.rooms; sid uuid; uid uuid:=auth.uid(); a uuid; n int; old int;
begin
 if uid is null or not exists(select 1 from y8_route_private.settings where teacher_id=uid) then raise exception 'Approved teacher sign-in required'; end if;
 if pg_column_size(p_data)>40000 then raise exception 'Request too large'; end if;
 if p_action='list' then
  return coalesce((select jsonb_agg(y8_route_private.snapshot(x) order by x.created_at desc) from (select * from y8_route_private.rooms where owner_id=uid order by created_at desc limit 30)x),'[]');
 end if;
 if p_action='create' then
  if p_data->>'className' not in ('8T','8E') or p_data->>'className' is null then raise exception 'Choose 8T or 8E'; end if;
  if (select count(*) from y8_route_private.rooms where owner_id=uid and not ended and expires_at>now())>=4 then raise exception 'End an older classroom first'; end if;
  insert into y8_route_private.rooms(code,owner_id,class_name) values(upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),uid,p_data->>'className') returning * into r;
 else
  select * into r from y8_route_private.rooms where id=p_room and owner_id=uid for update;
  if not found then raise exception 'Classroom not found'; end if;
  if p_action in ('read','heartbeat','history') then
   if p_action='heartbeat' and not r.ended and r.expires_at>now() then update y8_route_private.rooms set heartbeat=now() where id=r.id returning * into r; end if;
  else
   if r.ended or r.expires_at<now() then raise exception 'Classroom has ended'; end if;
   a:=(p_data->>'commandId')::uuid;
   if a is null then raise exception 'Command identifier required'; end if;
   if r.last_command=a then return jsonb_build_object('room',y8_route_private.snapshot(r)); end if;
   if (p_data->>'revision')::int is distinct from r.revision then raise exception 'Another control changed. Refresh and retry.'; end if;
   if p_action='admit' then
    update y8_route_private.students set status=case when p_data->>'status'='rejected' then 'rejected' else 'admitted' end
    where room_id=r.id and (id=(p_data->>'studentId')::uuid or (p_data->>'all')::boolean is true and status='pending');
   elsif p_action='resolveHelp' then
    update y8_route_private.students set help=false where id=(p_data->>'studentId')::uuid and room_id=r.id;
   elsif p_action='invite' then
    n:=(p_data->>'round')::int;if n not in (1,2) or n is null then raise exception 'Invalid round'; end if;
    if exists(select 1 from y8_route_private.responses x join y8_route_private.students s on s.id=x.student_id where s.room_id=r.id and x.round_no=n) then raise exception 'This round already has responses. Keep the original evidence; use discussion or follow along instead.'; end if;
    update y8_route_private.rooms set phase='invite',round_no=n,response_kind='initial',deadline=null,paused_seconds=null,revealed=false,demo_code='',demo_output='',featured=null where id=r.id;
   elsif p_action='follow' then
    if not r.revealed then raise exception 'Reveal and discuss before following along'; end if;
    update y8_route_private.rooms set phase='follow',response_kind='revision',deadline=null,paused_seconds=null where id=r.id;
   elsif p_action in ('start','retry') then
    if p_action='start' and r.phase<>'invite' then raise exception 'Invite the class first'; end if;
    if p_action='retry' and (not r.revealed or r.phase<>'discuss') then raise exception 'Reveal and discuss before correction'; end if;
    update y8_route_private.rooms set phase=case when p_action='retry' then 'retry' else 'response' end,response_kind=case when p_action='retry' then 'revision' else 'initial' end,
    deadline=now()+make_interval(secs=>case when p_action='retry' then 60 else 180 end),paused_seconds=null where id=r.id;
   elsif p_action='discuss' then
    update y8_route_private.rooms set phase='discuss',deadline=null,paused_seconds=null where id=r.id;
   elsif p_action='reveal' then
    update y8_route_private.rooms set phase='discuss',deadline=null,paused_seconds=null,revealed=true,
    demo_code=left(coalesce(p_data->>'code',''),8000),demo_output=left(coalesce(p_data->>'output',''),12000) where id=r.id;
   elsif p_action='demo' then
    if not r.revealed then raise exception 'Reveal the model first'; end if;
    update y8_route_private.rooms set demo_code=left(coalesce(p_data->>'code',''),8000),demo_output=left(coalesce(p_data->>'output',''),12000) where id=r.id;
   elsif p_action='feature' then
    n:=coalesce((p_data->>'round')::int,r.round_no);if n not in (1,2) then raise exception 'Invalid response round'; end if;
    select student_id into sid from y8_route_private.responses where student_id=(p_data->>'studentId')::uuid and round_no=n and kind=p_data->>'kind';
    if sid is null or not exists(select 1 from y8_route_private.students where id=sid and room_id=r.id) then raise exception 'Response not found'; end if;
    update y8_route_private.rooms set featured=(select jsonb_build_object('round',round_no,'code',code,'output',output,'error',error,'kind',kind) from y8_route_private.responses where student_id=sid and round_no=n and kind=p_data->>'kind') where id=r.id;
   elsif p_action='unfeature' then update y8_route_private.rooms set featured=null where id=r.id;
   elsif p_action='release' then update y8_route_private.rooms set phase='work',deadline=null,paused_seconds=null,featured=null where id=r.id;
   elsif p_action='extend' then
    n:=(p_data->>'seconds')::int;if n not in (30,60) or r.phase not in ('response','retry') then raise exception 'No active response timer'; end if;
    update y8_route_private.rooms set deadline=case when paused_seconds is null then greatest(coalesce(deadline,now()),now())+make_interval(secs=>n) else null end,paused_seconds=case when paused_seconds is null then null else paused_seconds+n end where id=r.id;
   elsif p_action='timer' then
    if r.phase not in ('response','retry') then raise exception 'No response timer'; end if;
    update y8_route_private.rooms set paused_seconds=case when r.paused_seconds is null then greatest(1,extract(epoch from coalesce(r.deadline,now())-now())::int) else null end,
    deadline=case when r.paused_seconds is null then null else now()+make_interval(secs=>r.paused_seconds) end where id=r.id;
   elsif p_action='stage' then
    if coalesce(p_data->>'stage','auto') not in ('auto','mission','starter','learning','main1','main2','pit','extension','plenary','report') then raise exception 'Unknown lesson stage'; end if;
    update y8_route_private.rooms set board_stage=nullif(p_data->>'stage','auto'),
    board_stage_anchor=r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,
    board_stage_duration=case p_data->>'stage' when 'starter' then 240 when 'learning' then 120 when 'main1' then 420 when 'main2' then 840 when 'extension' then 300 when 'report' then 120 else 180 end where id=r.id;
   elsif p_action='clock' then
    update y8_route_private.rooms set clock_seconds=r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,clock_anchor=case when r.clock_anchor is null then now() else null end where id=r.id;
   elsif p_action='award' then
    sid:=(p_data->>'studentId')::uuid;
    if not exists(select 1 from y8_route_private.students where id=sid and room_id=r.id and status='admitted') then raise exception 'Admitted student required'; end if;
    n:=coalesce((p_data->>'round')::int,r.round_no);if n not in (1,2) then raise exception 'Invalid award round'; end if;
    insert into y8_route_private.awards(id,student_id,round_no,amount,reason,teacher_id)
    values(a,sid,n,(p_data->>'amount')::int,btrim(p_data->>'reason'),uid) on conflict do nothing;
   elsif p_action='undoAward' then
    update y8_route_private.awards set undone_at=now() where id=(p_data->>'awardId')::uuid and teacher_id=uid and student_id in(select id from y8_route_private.students where room_id=r.id) and undone_at is null;
   elsif p_action='end' then update y8_route_private.rooms set ended=true,phase='work',deadline=null,paused_seconds=null,clock_seconds=r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,clock_anchor=null where id=r.id;
   else raise exception 'Unknown teacher command'; end if;
   update y8_route_private.rooms set revision=revision+1,last_command=a,heartbeat=now() where id=r.id returning * into r;
  end if;
 end if;
 return jsonb_build_object('room',y8_route_private.snapshot(r),
  'students',coalesce((select jsonb_agg(to_jsonb(s)-'token_hash') from y8_route_private.students s where room_id=r.id),'[]'),
  'responses',coalesce((select jsonb_agg(to_jsonb(x)) from y8_route_private.responses x join y8_route_private.students s on s.id=x.student_id where s.room_id=r.id),'[]'),
  'attempts',case when p_action='history' then coalesce((select jsonb_agg(to_jsonb(x)) from y8_route_private.attempts x join y8_route_private.students s on s.id=x.student_id where s.room_id=r.id and s.id=(p_data->>'studentId')::uuid),'[]') else '[]'::jsonb end,
  'awards',coalesce((select jsonb_agg(to_jsonb(x)) from y8_route_private.awards x join y8_route_private.students s on s.id=x.student_id where s.room_id=r.id),'[]'));
end $$;

create or replace function public.y8_route_student(p_action text,p_code text,p_token text,p_data jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y8_route_private.rooms; s y8_route_private.students; k text; ev uuid; h text;
begin
 if p_token is null or p_token !~ '^[a-f0-9]{64}$' or pg_column_size(p_data)>40000 then raise exception 'Invalid classroom request'; end if;
 h:=y8_route_private.hash_token(p_token);
 select * into r from y8_route_private.rooms where code=upper(trim(p_code)) for update;
 if not found or r.ended or r.expires_at<now() then raise exception 'Classroom is not open. Ask your teacher for the current code.'; end if;
 select * into s from y8_route_private.students where room_id=r.id and token_hash=h for update;
 if not found then
  if p_action<>'join' then raise exception 'Join this classroom first'; end if;
  if p_data->>'className' is distinct from r.class_name then raise exception 'This code is for a different class'; end if;
  if length(btrim(coalesce(p_data->>'name','')))=0 or length(p_data->>'name')>80 then raise exception 'Enter your name'; end if;
  if (select count(*) from y8_route_private.students where room_id=r.id)>=60 then raise exception 'Classroom is full'; end if;
  insert into y8_route_private.students(room_id,token_hash,name) values(r.id,h,btrim(p_data->>'name')) returning * into s;
 end if;
 if s.status='rejected' then raise exception 'Entry not admitted. Speak to your teacher.'; end if;
 if p_action not in ('join','read') then
  if s.status<>'admitted' then raise exception 'Waiting for teacher admission'; end if;
  if p_action='ready' then update y8_route_private.students set ready_round=r.round_no where id=s.id returning * into s;
  elsif p_action='help' then update y8_route_private.students set help=coalesce((p_data->>'help')::boolean,true) where id=s.id returning * into s;
  elsif p_action in ('save','run','submit') then
   if r.heartbeat<now()-interval '120 seconds' or r.phase not in ('response','retry','follow') or r.paused_seconds is not null or (r.phase<>'follow' and (r.deadline is null or r.deadline<=now())) then raise exception 'Response time is closed. Your draft is still on this device.'; end if;
   if (p_data->>'round')::int is distinct from r.round_no then raise exception 'Round changed. Keep this draft and join the current round'; end if;
   k:=case when r.phase in ('retry','follow') then 'revision' else 'initial' end;
   if p_data->>'kind' is distinct from k then raise exception 'Response stage changed. Draft kept locally'; end if;
   insert into y8_route_private.responses(student_id,round_no,kind,code,output,error,submitted_at)
   values(s.id,r.round_no,k,left(coalesce(p_data->>'code',''),8000),left(coalesce(p_data->>'output',''),12000),left(coalesce(p_data->>'error',''),2000),case when p_action='submit' then now() else null end)
   on conflict(student_id,round_no,kind) do update set code=excluded.code,output=excluded.output,error=excluded.error,saved_at=now(),submitted_at=excluded.submitted_at;
   if p_action in ('run','submit') then
    ev:=(p_data->>'eventId')::uuid;if ev is null then raise exception 'Attempt identifier required'; end if;
    if (select count(*) from y8_route_private.attempts where student_id=s.id)>300 then raise exception 'Attempt limit reached; latest draft remains saved'; end if;
    insert into y8_route_private.attempts(event_id,student_id,round_no,kind,event_type,code,output,error)
    values(ev,s.id,r.round_no,k,p_action,left(coalesce(p_data->>'code',''),8000),left(coalesce(p_data->>'output',''),12000),left(coalesce(p_data->>'error',''),2000)) on conflict do nothing;
   end if;
  else raise exception 'Unknown student command'; end if;
 end if;
 update y8_route_private.students set last_seen=now() where id=s.id;
 return jsonb_build_object('room',y8_route_private.snapshot(r),'student',to_jsonb(s)-'token_hash',
 'responses',coalesce((select jsonb_agg(to_jsonb(x)) from y8_route_private.responses x where student_id=s.id),'[]'),
 'awards',coalesce((select jsonb_agg(jsonb_build_object('amount',amount,'reason',reason,'undone',undone_at is not null)) from y8_route_private.awards where student_id=s.id),'[]'));
end $$;

create or replace function public.y8_route_board(p_code text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r y8_route_private.rooms;
begin
 select * into r from y8_route_private.rooms where code=upper(trim(p_code));
 if not found then raise exception 'Classroom not found'; end if;
 return y8_route_private.snapshot(r);
end $$;
revoke all on all functions in schema y8_route_private from public,anon,authenticated;
revoke all on function public.y8_route_teacher(text,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.y8_route_student(text,text,text,jsonb) from public,anon,authenticated;
revoke all on function public.y8_route_board(text) from public,anon,authenticated;
grant execute on function public.y8_route_teacher(text,uuid,jsonb) to authenticated;
grant execute on function public.y8_route_student(text,text,text,jsonb) to anon,authenticated;
grant execute on function public.y8_route_board(text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
