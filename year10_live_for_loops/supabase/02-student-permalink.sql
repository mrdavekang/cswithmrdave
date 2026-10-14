-- Student permalink: applies only to this existing Year 10 lesson.
-- Does not alter Auth, classroom ownership, table policies or teacher grants.
begin;
do $preflight$
begin
  if to_regprocedure('public.y10_for_join(uuid,uuid,text,text)') is null or
     to_regprocedure('public.y10_for_student_poll(uuid,text)') is null then
    raise exception 'Install 01-live-for-loops.sql first'; end if;
  if not exists(select 1 from classroom_private.classes c join classroom_private.teachers t on t.user_id=c.teacher_id where c.id='c429701c-21c3-4e99-b84d-c2faadca7afb') then
    raise exception 'Approved Year 10 class mapping is missing'; end if;
  if exists(select 1 from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and ((p.proname='y10_for_join' and md5(regexp_replace(p.prosrc,'[[:space:]]','','g')) not in ('25d6de5d91c260a14dfb2e2cbd56fb17','740861b364046307005efeabba4e4c75')) or (p.proname='y10_for_student_poll' and md5(regexp_replace(p.prosrc,'[[:space:]]','','g')) not in ('1935494a0362ea766e1ce4d977d30fa3','825ef97e6c67d12835f476a80d80aace')))) then
    raise exception 'A pupil function changed since this migration was prepared; review before replacing it'; end if;
end;
$preflight$;

-- A pending or declined pupil never receives live code or released stages.
create or replace function y10_for_private.pupil_room_snapshot(
  p_room y10_for_private.y10_for_rooms, p_status text
) returns jsonb language sql stable set search_path='' as $$
  select case when p_status='admitted' then y10_for_private.room_snapshot(p_room)
  else y10_for_private.room_snapshot(p_room) || jsonb_build_object(
    'stage','ready','mode','paused','released_stages','[]'::jsonb,
    'demo',jsonb_build_object('code','','line',0,'output','')) end;
$$;
revoke all on function y10_for_private.pupil_room_snapshot(y10_for_private.y10_for_rooms,text) from public,anon,authenticated;

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
  if not found or room.ended or room.expires_at<=clock_timestamp() then
    raise exception 'No live class is running yet. Your teacher needs to start the lesson.' using errcode='P0002'; end if;
  select * into student from y10_for_private.y10_for_students
    where room_id=room.id and token_hash=y10_for_private.token_hash(p_token);
  if not found then
    -- Bounded roster. Admission is still required: a name is not authentication.
    if (select count(*) from y10_for_private.y10_for_students where room_id=room.id)>=100 then
      raise exception 'Classroom join list is full; ask your teacher' using errcode='54000'; end if;
    insert into y10_for_private.y10_for_students(room_id,token_hash,name)
      values(room.id,y10_for_private.token_hash(p_token),clean_name) returning * into student;
  end if;
  return jsonb_build_object('room',y10_for_private.pupil_room_snapshot(room,student.status),'student',y10_for_private.student_snapshot(student));
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
  return jsonb_build_object('room',y10_for_private.pupil_room_snapshot(room,student.status),'student',y10_for_private.student_snapshot(student));
end;
$$;

-- One fixed lesson link finds only the current room of the existing owner.
-- This is a public admission request, not authentication or automatic admission.
create or replace function public.y10_for_open_lesson(p_class_id uuid,p_name text,p_token text)
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare target uuid;
begin
  if p_class_id is distinct from 'c429701c-21c3-4e99-b84d-c2faadca7afb'::uuid then
    raise exception 'Classroom unavailable' using errcode='42501'; end if;
  perform y10_for_private.check_token(p_token);
  if length(btrim(regexp_replace(coalesce(p_name,''),'[[:cntrl:]]','','g'))) not between 2 and 80 then
    raise exception 'Enter a name between 2 and 80 characters' using errcode='22023'; end if;
  select r.id into target from y10_for_private.y10_for_rooms r
    join classroom_private.classes c on c.id=r.class_id and c.teacher_id=r.teacher_id
    join classroom_private.teachers t on t.user_id=c.teacher_id
    where r.class_id=p_class_id and not r.ended and r.expires_at>clock_timestamp()
    order by r.created_at desc,r.id desc limit 1;
  if not found then
    raise exception 'No live class is running yet. Your teacher needs to start the lesson.' using errcode='P0002'; end if;
  -- Join revalidates the room under its existing exclusive lock and roster cap.
  return public.y10_for_join(p_class_id,target,p_name,p_token);
end;
$$;
revoke all on function public.y10_for_open_lesson(uuid,text,text) from public,anon,authenticated;
grant execute on function public.y10_for_open_lesson(uuid,text,text) to anon;

-- CREATE OR REPLACE retains the existing pupil ACLs; teacher ACLs are untouched.
notify pgrst,'reload schema';
commit;
