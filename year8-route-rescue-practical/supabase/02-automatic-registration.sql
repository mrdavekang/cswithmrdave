-- Apply after 01-live-coding.sql. Route Rescue only; no other lesson changes.
begin;
alter table y8_route_private.rooms add column if not exists auto_join_enabled boolean not null default false;
alter table y8_route_private.rooms alter column auto_join_enabled set default true;
with latest as (
 select distinct on (class_name) id from y8_route_private.rooms
 where not ended and expires_at>now() and owner_id=(select teacher_id from y8_route_private.settings where singleton)
 order by class_name,created_at desc,id
)
update y8_route_private.rooms r set auto_join_enabled=true where r.id in(select id from latest);

create or replace function y8_route_private.activate_live_class() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if not new.auto_join_enabled then return new; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('y8-route-live:'||new.class_name)::bigint);
 update y8_route_private.rooms r set auto_join_enabled=false,ended=true,phase='work',deadline=null,paused_seconds=null,
 clock_seconds=r.clock_seconds+case when r.clock_anchor is null then 0 else greatest(0,extract(epoch from now()-r.clock_anchor)::int) end,
 clock_anchor=null,revision=revision+1
 where r.class_name=new.class_name and r.owner_id=new.owner_id and not r.ended;
 return new;
end $$;
drop trigger if exists route_activate_live_class on y8_route_private.rooms;
create trigger route_activate_live_class before insert on y8_route_private.rooms
for each row execute function y8_route_private.activate_live_class();

create or replace function public.y8_route_autojoin(p_token text,p_name text,p_class text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r y8_route_private.rooms; s y8_route_private.students; h text;
begin
 if p_token is null or p_token !~ '^[a-f0-9]{64}$' then raise exception 'Invalid learner connection'; end if;
 if p_class not in ('8T','8E') or p_class is null then return jsonb_build_object('waiting',true,'reason','choose-class'); end if;
 if length(btrim(coalesce(p_name,''))) not between 1 and 80 then raise exception 'Enter your name before starting'; end if;
 select * into r from y8_route_private.rooms where class_name=p_class and auto_join_enabled
 and not ended and expires_at>now() and heartbeat>now()-interval '120 seconds'
 and owner_id=(select teacher_id from y8_route_private.settings where singleton)
 order by created_at desc,id limit 1 for update;
 if not found then return jsonb_build_object('waiting',true,'reason','teacher-not-open'); end if;
 h:=y8_route_private.hash_token(p_token);
 select * into s from y8_route_private.students where room_id=r.id and token_hash=h for update;
 if found and s.status='rejected' then return jsonb_build_object('blocked',true); end if;
 if not found then
  if (select count(*) from y8_route_private.students where room_id=r.id and status<>'rejected')>=60
  or (select count(*) from y8_route_private.students where room_id=r.id)>=300 then
   raise exception 'The live class is full. Keep your practical open and tell your teacher.';
  end if;
  insert into y8_route_private.students(room_id,token_hash,name,status)
  values(r.id,h,btrim(p_name),'admitted') returning * into s;
 elsif s.status='pending' then
  update y8_route_private.students set status='admitted' where id=s.id;
 end if;
 return public.y8_route_student('read',r.code,p_token,'{}'::jsonb);
end $$;
revoke all on function y8_route_private.activate_live_class() from public,anon,authenticated;
revoke all on function public.y8_route_autojoin(text,text,text) from public,anon,authenticated;
grant execute on function public.y8_route_autojoin(text,text,text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
