-- Game Club only; additive. Apply as DB owner after permission review.
-- No changes to existing learning histories, Route Rescue, Auth or exposed schemas.
begin;
do $$ begin
 if not exists(select 1 from y8_gameclub_private.settings where lesson_id='y8-game-club-lists-v1') then
  raise exception 'Install the existing Game Club learning-record schema first';
 end if;
end $$;
create schema if not exists y8_gameclub_live;
revoke all on schema y8_gameclub_live from public,anon,authenticated;
create table if not exists y8_gameclub_live.rooms(
 id uuid primary key default gen_random_uuid(), board_key uuid unique not null default gen_random_uuid(),
 owner_id uuid not null references auth.users(id), class_name text not null check(class_name in ('8T','8E')),
 created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '8 hours',
 ended boolean not null default false, revision int not null default 0, heartbeat timestamptz not null default now(),
 phase text not null default 'work' check(phase in ('work','invite','response','discuss','retry','follow')),
 round_no int not null default 1 check(round_no in (1,2)), response_kind text not null default 'initial' check(response_kind in ('initial','revision')),
 response_epoch int not null default 0, deadline timestamptz, paused_seconds int, response_duration int not null default 180,
 revealed boolean not null default false, demo_code text not null default '', demo_output text not null default '',
 clock_seconds int not null default 0, clock_anchor timestamptz, board_stage text,
 share_first_names boolean not null default false
);
create unique index if not exists gc_live_one_open_class on y8_gameclub_live.rooms(owner_id,class_name) where not ended;
create table if not exists y8_gameclub_live.students(
 id uuid primary key default gen_random_uuid(), room_id uuid not null references y8_gameclub_live.rooms(id),
 token_hash text not null, name text not null check(length(name) between 2 and 80),
 status text not null default 'admitted' check(status in ('admitted','rejected')),
 joined_at timestamptz not null default now(), last_seen timestamptz not null default now(),
 ready_round int, help boolean not null default false, unique(room_id,token_hash)
);
create table if not exists y8_gameclub_live.responses(
 student_id uuid not null references y8_gameclub_live.students(id), round_no int not null check(round_no in (1,2)),
 kind text not null check(kind in ('initial','revision')), code text not null default '', output text not null default '', error text not null default '',
 version int not null default 1, saved_at timestamptz not null default now(), submitted_at timestamptz,
 primary key(student_id,round_no,kind)
);
create table if not exists y8_gameclub_live.events(
 id uuid primary key, student_id uuid not null references y8_gameclub_live.students(id),
 round_no int not null check(round_no in (1,2)), kind text not null check(kind in ('initial','revision')),
 event_type text not null check(event_type in ('save','run','submit')), code text not null, output text not null, error text not null, at timestamptz not null default now()
);
create index if not exists gc_live_events_student on y8_gameclub_live.events(student_id,at);
create table if not exists y8_gameclub_live.commands(
 id uuid primary key, room_id uuid not null references y8_gameclub_live.rooms(id), action text not null, at timestamptz not null default now()
);
create table if not exists y8_gameclub_live.awards(
 id uuid primary key references y8_gameclub_live.commands(id), student_id uuid not null references y8_gameclub_live.students(id),
 amount int not null check(amount between 1 and 5), reason text not null check(length(reason) between 1 and 160),
 teacher_id uuid not null references auth.users(id), at timestamptz not null default now(), undone_at timestamptz
);
alter table y8_gameclub_live.rooms enable row level security;
alter table y8_gameclub_live.students enable row level security;
alter table y8_gameclub_live.responses enable row level security;
alter table y8_gameclub_live.events enable row level security;
alter table y8_gameclub_live.commands enable row level security;
alter table y8_gameclub_live.awards enable row level security;
revoke all on all tables in schema y8_gameclub_live from public,anon,authenticated;

create or replace function y8_gameclub_live.snapshot(r y8_gameclub_live.rooms) returns jsonb
language sql stable set search_path='' as $$
 select jsonb_build_object('id',r.id,'className',r.class_name,'createdAt',r.created_at,'revision',r.revision,'round',r.round_no,'responseKind',r.response_kind,'responseEpoch',r.response_epoch,
 'phase',case when r.ended or r.expires_at<=now() or r.heartbeat<now()-interval '90 seconds' then 'work'
   when r.phase in ('response','retry') and r.paused_seconds is null and r.deadline<=now() then 'discuss' else r.phase end,
 'connected',not r.ended and r.expires_at>now() and r.heartbeat>now()-interval '90 seconds', 'ended',r.ended,
 'serverNow',now(),'deadline',r.deadline,'pausedSeconds',r.paused_seconds,'responseDuration',r.response_duration,
 'clockSeconds',r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,
 'clockRunning',r.clock_anchor is not null,'boardStage',r.board_stage,'revealed',r.revealed,
 'demo',case when r.revealed then jsonb_build_object('code',r.demo_code,'output',r.demo_output) else null end)
$$;
create or replace function y8_gameclub_live.own_view(r y8_gameclub_live.rooms,s y8_gameclub_live.students) returns jsonb
language sql stable set search_path='' as $$
 select jsonb_build_object('room',y8_gameclub_live.snapshot(r),'student',to_jsonb(s)-'token_hash',
 'responses',coalesce((select jsonb_agg(to_jsonb(x) order by round_no,kind) from y8_gameclub_live.responses x where student_id=s.id),'[]'),
 'awards',coalesce((select jsonb_agg(to_jsonb(a) order by at) from y8_gameclub_live.awards a where student_id=s.id),'[]'))
$$;

create or replace function public.y8_gc_live_teacher(p_action text,p_room uuid default null,p_data jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y8_gameclub_live.rooms; uid uuid:=auth.uid(); cmd uuid; sid uuid; n int; k text; duplicate boolean:=false;
begin
 if not y8_gameclub_private.is_owner() then raise exception 'Approved Game Club teacher sign-in required' using errcode='42501'; end if;
 if p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>40000 then raise exception 'Invalid request'; end if;
 if p_action='list' then
  return coalesce((select jsonb_agg(y8_gameclub_live.snapshot(x) order by created_at desc) from
    (select * from y8_gameclub_live.rooms where owner_id=uid order by created_at desc limit 50)x),'[]');
 end if;
 if p_action='create' then
  k:=p_data->>'className';if k is null or k not in ('8T','8E') then raise exception 'Choose 8T or 8E'; end if;
  -- Serialize the class opening. Reopening an active class never wipes its responses.
  perform pg_advisory_xact_lock(hashtext('gameclub-live:'||uid::text||':'||k));
  update y8_gameclub_live.rooms set ended=true,phase='work',clock_anchor=null where owner_id=uid and class_name=k and not ended and expires_at<=now();
  select * into r from y8_gameclub_live.rooms where owner_id=uid and class_name=k and not ended for update;
  if not found then
   if (select count(*) from y8_gameclub_live.rooms where created_at>now()-interval '24 hours')>=30 then raise exception 'Daily classroom limit reached'; end if;
   insert into y8_gameclub_live.rooms(owner_id,class_name) values(uid,k) returning * into r;
  else update y8_gameclub_live.rooms set heartbeat=now() where id=r.id returning * into r; end if;
 else
  select * into r from y8_gameclub_live.rooms where id=p_room and owner_id=uid for update;
  if not found then raise exception 'Classroom not found'; end if;
  if p_action='heartbeat' then
   if not r.ended and r.expires_at>now() then update y8_gameclub_live.rooms set heartbeat=now() where id=r.id returning * into r; end if;
  elsif p_action not in ('read','history') then
   if r.ended or r.expires_at<=now() then raise exception 'This class has ended. Open a new class; these records remain available.'; end if;
   cmd:=(p_data->>'commandId')::uuid;if cmd is null then raise exception 'Command ID required'; end if;
   select exists(select 1 from y8_gameclub_live.commands where id=cmd and room_id=r.id) into duplicate;
   if not duplicate then
    if (p_data->>'revision')::int is distinct from r.revision then raise exception 'Another teacher control changed. Refresh and try again.'; end if;
    insert into y8_gameclub_live.commands(id,room_id,action) values(cmd,r.id,p_action);
    if p_action='invite' then
     n:=(p_data->>'round')::int;if n is null or n not in (1,2) then raise exception 'Choose round 1 or 2'; end if;
     -- Keep initial submissions, revisions and revealed demos when reinviting.
     update y8_gameclub_live.rooms set phase='invite',round_no=n,response_kind='initial',deadline=null,paused_seconds=null,
      revealed=case when n=r.round_no then r.revealed else false end,
      demo_code=case when n=r.round_no then r.demo_code else '' end,demo_output=case when n=r.round_no then r.demo_output else '' end where id=r.id;
    elsif p_action in ('start','retry') then
     if p_action='start' and r.phase<>'invite' then raise exception 'Invite the class before starting'; end if;
     if p_action='retry' and not r.revealed then raise exception 'Reveal and discuss the model first'; end if;
     n:=case when p_action='retry' then 60 else 180 end;
     update y8_gameclub_live.rooms set phase=case when p_action='retry' then 'retry' else 'response' end,
      response_kind=case when p_action='retry' then 'revision' else 'initial' end,response_duration=n,response_epoch=response_epoch+1,
      deadline=now()+make_interval(secs=>n),paused_seconds=null where id=r.id;
    elsif p_action='discuss' then update y8_gameclub_live.rooms set phase='discuss',deadline=null,paused_seconds=null where id=r.id;
    elsif p_action='reveal' then
     update y8_gameclub_live.rooms set phase='discuss',deadline=null,paused_seconds=null,revealed=true,
      demo_code=left(coalesce(p_data->>'code',''),8000),demo_output=left(coalesce(p_data->>'output',''),16000) where id=r.id;
    elsif p_action='demo' then
     if not r.revealed then raise exception 'Reveal the model first'; end if;
     update y8_gameclub_live.rooms set demo_code=left(coalesce(p_data->>'code',''),8000),demo_output=left(coalesce(p_data->>'output',''),16000) where id=r.id;
    elsif p_action='follow' then
     if not r.revealed then raise exception 'Reveal the model first'; end if;
     update y8_gameclub_live.rooms set phase='follow',response_kind='revision',deadline=null,paused_seconds=null where id=r.id;
    elsif p_action='release' then update y8_gameclub_live.rooms set phase='work',deadline=null,paused_seconds=null where id=r.id;
    elsif p_action='timer' then
     if r.phase not in ('response','retry') or r.paused_seconds is null and r.deadline<=now() then raise exception 'No active response timer'; end if;
     update y8_gameclub_live.rooms set paused_seconds=case when r.paused_seconds is null then greatest(1,ceil(extract(epoch from r.deadline-now()))::int) else null end,
      deadline=case when r.paused_seconds is null then null else now()+make_interval(secs=>r.paused_seconds) end where id=r.id;
    elsif p_action='extend' then
     n:=(p_data->>'seconds')::int;if n is null or n not in (30,60) or r.phase not in ('response','retry') then raise exception 'No response timer to extend'; end if;
     update y8_gameclub_live.rooms set response_duration=response_duration+n,
      deadline=case when r.paused_seconds is null then greatest(coalesce(r.deadline,now()),now())+make_interval(secs=>n) else null end,
      paused_seconds=case when r.paused_seconds is null then null else r.paused_seconds+n end where id=r.id;
    elsif p_action='clock' then
     update y8_gameclub_live.rooms set clock_seconds=r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,
      clock_anchor=case when r.clock_anchor is null then now() else null end where id=r.id;
    elsif p_action='stage' then
     k:=p_data->>'stage';if k is null or k not in ('auto','Starting drill','Briefing','Do Now','Types of Learning','Main Task 1','Loop typing reset','Main Task 2','Extension','Learning Pit Stop','Plenary','Save & submit') then raise exception 'Unknown lesson stage'; end if;
     update y8_gameclub_live.rooms set board_stage=nullif(k,'auto') where id=r.id;
    elsif p_action='admit' then
     update y8_gameclub_live.students set status=case when p_data->>'status'='rejected' then 'rejected' else 'admitted' end where id=(p_data->>'studentId')::uuid and room_id=r.id;
    elsif p_action='helpResolved' then update y8_gameclub_live.students set help=false where id=(p_data->>'studentId')::uuid and room_id=r.id;
    elsif p_action='award' then
     sid:=(p_data->>'studentId')::uuid;
     if not exists(select 1 from y8_gameclub_live.students where id=sid and room_id=r.id and status='admitted') then raise exception 'Registered student required'; end if;
     insert into y8_gameclub_live.awards(id,student_id,amount,reason,teacher_id) values(cmd,sid,(p_data->>'amount')::int,btrim(p_data->>'reason'),uid);
    elsif p_action='undoAward' then
     update y8_gameclub_live.awards set undone_at=now() where id=(p_data->>'awardId')::uuid and teacher_id=uid and undone_at is null
      and student_id in(select id from y8_gameclub_live.students where room_id=r.id);
    elsif p_action='end' then
     update y8_gameclub_live.rooms set ended=true,phase='work',deadline=null,paused_seconds=null,
      clock_seconds=r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,clock_anchor=null where id=r.id;
    else raise exception 'Unknown teacher command'; end if;
    update y8_gameclub_live.rooms set revision=revision+1,heartbeat=now() where id=r.id returning * into r;
   end if;
  end if;
 end if;
 return jsonb_build_object('room',y8_gameclub_live.snapshot(r),'boardKey',r.board_key,
  'students',coalesce((select jsonb_agg(to_jsonb(s)-'token_hash' order by joined_at,id) from y8_gameclub_live.students s where room_id=r.id),'[]'),
  'responses',coalesce((select jsonb_agg(to_jsonb(x)) from y8_gameclub_live.responses x join y8_gameclub_live.students s on s.id=x.student_id where s.room_id=r.id),'[]'),
  'awards',coalesce((select jsonb_agg(to_jsonb(a) order by a.at) from y8_gameclub_live.awards a join y8_gameclub_live.students s on s.id=a.student_id where s.room_id=r.id),'[]'),
  'attempts',case when p_action='history' then coalesce((select jsonb_agg(to_jsonb(e) order by e.at) from y8_gameclub_live.events e join y8_gameclub_live.students s on s.id=e.student_id where s.room_id=r.id and s.id=(p_data->>'studentId')::uuid),'[]') else '[]'::jsonb end);
end $$;

create or replace function public.y8_gc_live_join(p_token text,p_name text,p_class text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y8_gameclub_live.rooms; s y8_gameclub_live.students; h text; n text;
begin
 h:=y8_gameclub_private.token_hash(p_token);n:=btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'));
 if length(n) not between 2 and 80 or lower(n)='teacher' or p_class is null or p_class not in ('8T','8E') then raise exception 'Enter your name and class'; end if;
 select * into r from y8_gameclub_live.rooms where class_name=p_class and not ended and expires_at>now() and heartbeat>now()-interval '90 seconds' order by created_at desc limit 1 for update;
 if not found then return jsonb_build_object('waiting',true,'serverNow',now()); end if;
 select * into s from y8_gameclub_live.students where room_id=r.id and token_hash=h;
 if not found then
  if (select count(*) from y8_gameclub_live.students where room_id=r.id)>=60 then raise exception 'Live class is full. Keep working and speak to your teacher.'; end if;
  insert into y8_gameclub_live.students(room_id,token_hash,name) values(r.id,h,n) returning * into s;
 elsif s.name<>n then raise exception 'Name changed. Return to entry and start with your own name.'; end if;
 if s.status='rejected' then return jsonb_build_object('blocked',true); end if;
 update y8_gameclub_live.students set last_seen=now() where id=s.id;
 return y8_gameclub_live.own_view(r,s);
end $$;

create or replace function public.y8_gc_live_student(p_action text,p_room uuid,p_token text,p_data jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y8_gameclub_live.rooms; s y8_gameclub_live.students; h text; k text; ev uuid; prior y8_gameclub_live.responses; previous boolean; txt text;
begin
 h:=y8_gameclub_private.token_hash(p_token);
 if p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>40000 then raise exception 'Invalid request'; end if;
 select * into r from y8_gameclub_live.rooms where id=p_room for update;
 select * into s from y8_gameclub_live.students where room_id=p_room and token_hash=h for update;
 if r.id is null or s.id is null or s.status<>'admitted' then raise exception 'Class membership required' using errcode='42501'; end if;
 if p_action<>'read' and (r.ended or r.expires_at<=now() or r.heartbeat<now()-interval '90 seconds') then raise exception 'Live class paused. Your draft stays on this device.'; end if;
 if p_action='ready' then update y8_gameclub_live.students set ready_round=r.round_no where id=s.id;
 elsif p_action='help' then update y8_gameclub_live.students set help=true where id=s.id;
 elsif p_action in ('save','run','submit') then
  ev:=(p_data->>'eventId')::uuid;if ev is null then raise exception 'Event ID required'; end if;
  if not exists(select 1 from y8_gameclub_live.events where id=ev and student_id=s.id) then
   if r.phase not in ('response','retry','follow') or r.paused_seconds is not null or (r.phase<>'follow' and (r.deadline is null or r.deadline<=now())) then raise exception 'Response time closed. Keep your draft and return when invited.'; end if;
   if (p_data->>'round')::int is distinct from r.round_no or p_data->>'kind' is distinct from r.response_kind then raise exception 'Round changed. Your earlier draft is kept.'; end if;
   k:=r.response_kind;txt:=left(coalesce(p_data->>'code',''),8000);
   select * into prior from y8_gameclub_live.responses where student_id=s.id and round_no=r.round_no and kind=k;
   previous:=found;
   if coalesce((p_data->>'baseVersion')::int,0)<>coalesce(prior.version,0) then raise exception 'This response was changed in another tab. Your local draft is kept; reopen the live question to compare.'; end if;
   if (select count(*) from y8_gameclub_live.events where student_id=s.id)>=1000 then raise exception 'Live save limit reached. Export your local report.'; end if;
   insert into y8_gameclub_live.responses(student_id,round_no,kind,code,output,error,submitted_at)
   values(s.id,r.round_no,k,txt,left(coalesce(p_data->>'output',''),16000),left(coalesce(p_data->>'error',''),2000),
    case when p_action='submit' then now() when previous and prior.code=txt then prior.submitted_at else null end)
   on conflict(student_id,round_no,kind) do update set code=excluded.code,output=excluded.output,error=excluded.error,
    saved_at=now(),version=y8_gameclub_live.responses.version+1,submitted_at=excluded.submitted_at;
   insert into y8_gameclub_live.events(id,student_id,round_no,kind,event_type,code,output,error)
   values(ev,s.id,r.round_no,k,p_action,txt,left(coalesce(p_data->>'output',''),16000),left(coalesce(p_data->>'error',''),2000));
  end if;
 elsif p_action<>'read' then raise exception 'Unknown student command'; end if;
 update y8_gameclub_live.students set last_seen=now() where id=s.id returning * into s;
 return y8_gameclub_live.own_view(r,s);
end $$;

create or replace function public.y8_gc_live_board(p_key uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r y8_gameclub_live.rooms; awards jsonb;
begin
 select * into r from y8_gameclub_live.rooms where board_key=p_key;
 if not found then raise exception 'Projector unavailable'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'at',a.at,'amount',a.amount,'firstName',
  case when r.share_first_names then split_part(btrim(s.name),' ',1) else 'A learner' end) order by a.at),'[]') into awards
 from y8_gameclub_live.awards a join y8_gameclub_live.students s on s.id=a.student_id
 where s.room_id=r.id and s.status='admitted' and a.undone_at is null and a.at>now()-interval '30 seconds' and not r.ended;
 -- No roster, full names, student code, responses, tokens or private history.
 return y8_gameclub_live.snapshot(r)||jsonb_build_object('celebrations',awards);
end $$;
revoke all on all functions in schema y8_gameclub_live from public,anon,authenticated;
revoke all on function public.y8_gc_live_teacher(text,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.y8_gc_live_join(text,text,text) from public,anon,authenticated;
revoke all on function public.y8_gc_live_student(text,uuid,text,jsonb) from public,anon,authenticated;
revoke all on function public.y8_gc_live_board(uuid) from public,anon,authenticated;
grant execute on function public.y8_gc_live_teacher(text,uuid,jsonb) to authenticated;
grant execute on function public.y8_gc_live_join(text,text,text) to anon;
grant execute on function public.y8_gc_live_student(text,uuid,text,jsonb) to anon;
grant execute on function public.y8_gc_live_board(uuid) to anon,authenticated;
notify pgrst,'reload schema';
commit;
