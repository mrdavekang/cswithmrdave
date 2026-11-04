-- Share only the active room's lesson position and clock with its paired projector.
begin;
alter table y9_app_studio_live.rooms add column if not exists presenter_state jsonb;
alter table y9_app_studio_live.rooms add column if not exists presenter_revision int not null default 0;

create or replace function public.y9_studio_live_presenter(
 p_room uuid, p_expected int default null, p_position jsonb default null, p_timer jsonb default null
) returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_studio_live.rooms;
begin
 if not y9_app_studio_private.owner() then
  raise exception 'Approved teacher sign-in required' using errcode='42501';
 end if;
 select * into r from y9_app_studio_live.rooms
 where id=p_room and owner_id=(select auth.uid()) and not ended and expires_at>now() for update;
 if not found then raise exception 'Open the class before sharing the projector'; end if;
 if p_position is not null then
  if p_expected is distinct from r.presenter_revision then
   raise exception 'The presenter changed on another device' using errcode='40001';
  end if;
  if jsonb_typeof(p_position) is distinct from 'object' or jsonb_typeof(p_timer) is distinct from 'object'
   or octet_length(p_position::text)>256 or octet_length(p_timer::text)>4096
   or coalesce(p_position->>'id','') not in ('start','focus','paper','teach-layout','teach-media',
      'task-build','discussion-1','teach-action','task-respond','discussion-2','pit','finish','game')
   or p_position->>'id' is distinct from p_timer->>'id'
   or p_timer->>'version' is distinct from '1' then
   raise exception 'Invalid presenter state';
  end if;
  update y9_app_studio_live.rooms
  set presenter_state=jsonb_build_object('position',jsonb_build_object('id',p_position->'id','reveal',p_position->'reveal','lang',p_position->'lang'),
      'timer',jsonb_set(p_timer,'{anchor}',to_jsonb(floor(extract(epoch from clock_timestamp())*1000)::bigint))),
      presenter_revision=presenter_revision+1
  where id=r.id returning * into r;
 end if;
 return jsonb_build_object('revision',r.presenter_revision,'presenter',r.presenter_state,
     'serverNow',clock_timestamp());
end $$;

create or replace function public.y9_studio_live_projector(p_key uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y9_app_studio_live.rooms; live jsonb;
begin
 select * into r from y9_app_studio_live.rooms where board_key=p_key;
 if not found then raise exception 'Projector unavailable'; end if;
 if r.ended or r.expires_at<=now() then
  return jsonb_build_object('ended',true,'revision',r.presenter_revision);
 end if;
 live:=y9_app_studio_live.snapshot(r);
 return jsonb_build_object('ended',false,'revision',r.presenter_revision,'presenter',r.presenter_state,
   'serverNow',clock_timestamp(),'live',jsonb_build_object(
     'connected',live->'connected','round',live->'round','phase',live->'phase',
     'deadline',live->'deadline','pausedSeconds',live->'pausedSeconds',
     'revealed',live->'revealed','demo',live->'demo'));
end $$;

revoke all on function public.y9_studio_live_presenter(uuid,int,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.y9_studio_live_presenter(uuid,int,jsonb,jsonb) to authenticated;
revoke all on function public.y9_studio_live_projector(uuid) from public,anon,authenticated;
grant execute on function public.y9_studio_live_projector(uuid) to anon,authenticated;
notify pgrst,'reload schema';
commit;
