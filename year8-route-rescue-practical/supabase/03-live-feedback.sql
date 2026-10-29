-- Route Rescue feedback only. No deletion or access to other lessons.
-- Projector rewards: first name, points, award ID and timestamp only.
begin;
alter table y8_route_private.rooms add column if not exists response_duration int not null default 180;
update y8_route_private.rooms set response_duration=60 where response_kind='revision' and response_duration=180;
create or replace function y8_route_private.track_response_duration() returns trigger
language plpgsql set search_path='' as $$
begin
 if new.phase in ('response','retry') then
  if new.phase is distinct from old.phase or new.response_kind is distinct from old.response_kind then
   new.response_duration:=case when new.response_kind='revision' then 60 else 180 end;
  elsif old.paused_seconds is not null and new.paused_seconds>old.paused_seconds then
   new.response_duration:=old.response_duration+new.paused_seconds-old.paused_seconds;
  elsif old.paused_seconds is null and new.paused_seconds is null and new.deadline>old.deadline+interval '1 second' then
   new.response_duration:=old.response_duration+ceil(extract(epoch from new.deadline-old.deadline))::int;
  end if;
 end if;
 return new;
end $$;
drop trigger if exists route_response_duration on y8_route_private.rooms;
create trigger route_response_duration before update on y8_route_private.rooms for each row execute function y8_route_private.track_response_duration();
create or replace function y8_route_private.snapshot(r y8_route_private.rooms) returns jsonb
language sql stable set search_path='' as $$
 select jsonb_build_object('id',r.id,'code',r.code,'className',r.class_name,'revision',r.revision,
 'round',r.round_no,'responseKind',r.response_kind,'phase',case when r.ended or r.expires_at<now() or r.heartbeat<now()-interval '120 seconds' then 'work'
 when r.phase in ('response','retry') and r.deadline<=now() then 'discuss' else r.phase end,
 'connected',not r.ended and r.expires_at>now() and r.heartbeat>now()-interval '120 seconds',
 'ended',r.ended,'boardStage',r.board_stage,'boardStageAnchor',r.board_stage_anchor,'boardStageDuration',r.board_stage_duration,'serverNow',now(),'deadline',r.deadline,'pausedSeconds',r.paused_seconds,'responseDuration',r.response_duration,
 'clockSeconds',r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,
 'clockRunning',r.clock_anchor is not null,'revealed',r.revealed,
 'demo',case when r.revealed then jsonb_build_object('code',r.demo_code,'output',r.demo_output) else null end,
 'featured',r.featured)
$$;

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
 'awards',coalesce((select jsonb_agg(jsonb_build_object('id',id,'at',at,'amount',amount,'reason',reason,'undone',undone_at is not null)) from y8_route_private.awards where student_id=s.id),'[]'));
end $$;


create or replace function public.y8_route_board(p_code text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r y8_route_private.rooms; celebrations jsonb;
begin
 select * into r from y8_route_private.rooms where code=upper(trim(p_code));
 if not found then raise exception 'Classroom not found'; end if;
 celebrations:='[]'::jsonb;
 if not r.ended and r.expires_at>now() and r.heartbeat>now()-interval '120 seconds' then
  select coalesce(jsonb_agg(x.event order by x.at),'[]'::jsonb) into celebrations from (
   select a.at,jsonb_build_object('id',a.id,'at',a.at,'amount',a.amount,'firstName',split_part(btrim(s.name),' ',1)) as event
   from y8_route_private.awards a join y8_route_private.students s on s.id=a.student_id
   where s.room_id=r.id and s.status='admitted' and a.undone_at is null and a.at>now()-interval '30 seconds'
   order by a.at desc limit 12
  ) x;
 end if;
 return y8_route_private.snapshot(r)||jsonb_build_object('celebrations',celebrations);
end $$;
revoke all on function y8_route_private.track_response_duration() from public,anon,authenticated;
revoke all on function y8_route_private.snapshot(y8_route_private.rooms) from public,anon,authenticated;
notify pgrst,'reload schema';
commit;
