-- Synthetic checks only. All room/student writes are rolled back.
-- Run in the SQL editor after 01-while-classroom.sql.
begin;
do $tests$
declare
  owner_id uuid; rid uuid:=gen_random_uuid(); sid uuid; snap jsonb;
  state jsonb; revision_value bigint; rejected boolean; count_before integer;
begin
  select teacher_id into owner_id from classroom_private.classes
    where id='c429701c-21c3-4e99-b84d-c2faadca7afb';
  if owner_id is null then raise exception 'Missing existing class owner'; end if;
  perform set_config('request.jwt.claim.sub',owner_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',owner_id,'role','authenticated')::text,true);
  if not public.y10_while_is_teacher('c429701c-21c3-4e99-b84d-c2faadca7afb') then raise exception 'Existing teacher not recognized'; end if;
  insert into y10_while_private.y10_while_rooms(id,class_id,teacher_id)
    values(rid,'c429701c-21c3-4e99-b84d-c2faadca7afb',owner_id);
  snap:=public.y10_while_teacher_control(rid,0,jsonb_build_object('stage','m2-build','mode','work',
    'released_stages',jsonb_build_array('ready','m2-build','m2-sequence'),
    'demo',jsonb_build_object('code','print("QA model")','line',1,'output','QA model')));
  if (snap->>'bring_revision')::bigint<>1 then raise exception 'Page recall revision failed'; end if;
  state:=public.y10_while_join('c429701c-21c3-4e99-b84d-c2faadca7afb',rid,'QA synthetic pupil',repeat('a',64));
  sid:=(state->'student'->>'id')::uuid;
  if state->'room'->>'stage'<>'ready' or state->'room'->'demo'->>'code'<>'' or jsonb_array_length(state->'room'->'released_stages')<>0 then raise exception 'Pending pupil saw live content'; end if;
  rejected:=false;
  begin
    perform public.y10_while_student_save(rid,repeat('a',64),'{"stage":"m2-build","answers":{},"code":"print(1)","runs":[]}'::jsonb);
  exception when sqlstate '42501' then rejected:=true; end;
  if not rejected then raise exception 'Pending pupil save permitted'; end if;
  perform public.y10_while_teacher_admit(rid,sid,true);
  snap:=public.y10_while_student_save(rid,repeat('a',64),'{"stage":"m2-build","answers":{"_lesson":"while-slide-v1","answer":"QA"},"code":"print(1)","runs":[]}'::jsonb);
  if snap->'work'->'m2-build'->>'code'<>'print(1)' then raise exception 'Admitted pupil save failed'; end if;
  rejected:=false;
  begin
    perform public.y10_while_student_save(rid,repeat('a',64),'{"stage":"m2-upper","answers":{},"code":"print(1)","runs":[]}'::jsonb);
  exception when sqlstate '42501' then rejected:=true; end;
  if not rejected then raise exception 'Unreleased page save permitted'; end if;
  perform public.y10_while_teacher_feedback(rid,sid,'QA: check the condition.');
  state:=public.y10_while_student_poll(rid,repeat('a',64));
  if state->'student'->>'feedback'<>'QA: check the condition.' or state ? 'students' then raise exception 'Feedback or pupil isolation failed'; end if;
  snap:=public.y10_while_teacher_control(rid,(state->'room'->>'revision')::bigint,'{"mode":"paused"}'::jsonb);
  rejected:=false;
  begin
    perform public.y10_while_student_save(rid,repeat('a',64),'{"stage":"m2-build","answers":{},"code":"print(2)","runs":[]}'::jsonb);
  exception when sqlstate '42501' then rejected:=true; end;
  if not rejected then raise exception 'Paused save permitted'; end if;
  perform public.y10_while_set_help(rid,repeat('a',64),true,'QA: written help please');
  state:=public.y10_while_student_poll(rid,repeat('a',64));
  if not (state->'student'->>'help_requested')::boolean then raise exception 'Help request failed during pause'; end if;
  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('request.jwt.claims','{}',true);
  rejected:=false;
  begin perform public.y10_while_teacher_state('c429701c-21c3-4e99-b84d-c2faadca7afb');
  exception when sqlstate '42501' then rejected:=true; end;
  if not rejected then raise exception 'Unsigned teacher access permitted'; end if;
  if has_table_privilege('anon','y10_while_private.y10_while_students','SELECT')
    or has_table_privilege('authenticated','y10_while_private.y10_while_students','SELECT')
    or has_function_privilege('anon','public.y10_while_teacher_control(uuid,bigint,jsonb)','EXECUTE') then
    raise exception 'Unexpected direct browser access'; end if;
end;
$tests$;
select 'PASS: teacher ownership, page recall, pending masking, admission, own-work saving, page release, private feedback, pause, help and no unsigned teacher access' as while_classroom_checks;
rollback;
