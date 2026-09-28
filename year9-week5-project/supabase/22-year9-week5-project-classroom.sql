begin;
create or replace function classroom_private.valid_lesson_stage(p_lesson text,p_stage text)
returns boolean language sql immutable set search_path='' as $$
 select coalesce(case p_lesson
 when 'year9-week3-project' then classroom_private.valid_stage(p_stage)
 when 'year9-week5-theory' then p_stage in ('read','starter','types','nested-read','parsons','debug','program','validation-read','validation','pit','plenary','extension','submit','fact-nested','fact-validation','fact-boundary')
 when 'year9-week5-project' then p_stage in ('read','starter','types','main1','main2','challenge','pit','plenary','fact-validate','fact-nested','fact-tests')
 -- read is the existing RPC's supported-lesson probe; actual Year 8 cards use the IDs below.
 when 'year8-week5-theory' then p_stage in ('read','mission','starter1','starter2','starter3','starter4','starter5','sp1','sp2','sp3','sp4','sp5','before','six','match','condition0','condition1','condition2','condition3','condition4','condition5','condition6','condition7','trace-model','path0','path1','path2','output1','output2','syntax-read','mp1','mp2','mp3','indent1','indent2','debug1','debug2','pp1','pp2','code1','code2','code3','ext1','ext2','ext3','after','exit-operators','exit-path','review')
 when 'Year11_week5_session2' then p_stage in ('intro','start','before','read','main1','creation','main2','pit','exit','extension','submit','fact1','fact2','fact3')
 when 'Year11_week5_session3' then p_stage in ('read','start','before','main1','sql','main2','pit','exit','extension','mark','submit','slide-read','slide-fact-key','slide-start','slide-before','slide-main1','slide-sql','slide-fact-sql','slide-fact-limit','slide-main2','slide-extension','slide-mark','slide-pit','slide-exit','slide-submit')
 when 'year7-week5-theory' then p_stage in ('read','loop','indent','starter','types','predict','investigate','modify','make','errors','debug1','debug2','debug3','debug-level','pitstop','plenary','extension','poster','export','slide-loop','slide-indent','slide-starter','slide-types','slide-predict','slide-investigate','slide-modify','slide-make','slide-errors','slide-debug1','slide-debug2','slide-debug3','slide-debug-level','slide-pitstop','slide-plenary','slide-extension','slide-poster','slide-export','slide-fact-loop','slide-fact-indent','slide-fact-debug')
 when 'year8-week5-project' then p_stage in ('read','read-check','predict','baseline','brief','setup','build','personalise','test-read','tests','feedback','transfer','extension','pitstop','plenary','review','slide-read','slide-read-check','slide-predict','slide-baseline','slide-brief','slide-setup','slide-build','slide-personalise','slide-test-read','slide-tests','slide-feedback','slide-transfer','slide-extension','slide-pitstop','slide-plenary','slide-review','slide-fact-event','slide-fact-boundary','slide-fact-test')
 when 'year8-week3-project' then p_stage in ('read','do1','do2','do3','before0','before1','before2','focus','plan','build-open','build','build-try','trace','test','evidence','pit0','pit1','pit2','pitfocus','extension','ext-steps-code','ext-steps-try','ext-teams-brief','ext-teams-code','ext-teams-try','ext-signal-brief','ext-signal-code','ext-signal-try','ext-dial-brief','ext-dial-code','ext-dial-try','explain','review','slide-read','slide-fact-store','slide-do-now','slide-fact-update','slide-types','slide-main1','slide-main2','slide-fact-reset','slide-pitstop','slide-extension','slide-plenary')
 else false end,false);
$$;
revoke all on function classroom_private.valid_lesson_stage(text,text) from public,anon,authenticated;
alter table classroom_private.sessions add column if not exists presentation_mode text not null default 'self' check (presentation_mode in ('self','view','answer','attention'));
alter table classroom_private.sessions add column if not exists return_revision bigint not null default 0 check(return_revision>=0);
create or replace function classroom_private.snapshot(p_session classroom_private.sessions)
returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('version',1,'lesson',p_session.lesson,'class_id',p_session.class_id,'session_id',p_session.id,'stage',p_session.stage,'locked',p_session.locked,'revision',p_session.revision,'bring_revision',p_session.bring_revision,'expires_at',p_session.expires_at,'server_now',statement_timestamp(),'ended',false,'mode',p_session.presentation_mode,'return_revision',p_session.return_revision);
$$;
create or replace function public.classroom_teach_control(p_session_id uuid,p_action text,p_expected_revision bigint,p_stage text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s classroom_private.sessions; result jsonb;
begin
 if not public.classroom_is_teacher() then raise exception 'Teacher sign-in required' using errcode='42501'; end if;
 select * into s from classroom_private.sessions where id=p_session_id and teacher_id=auth.uid() for update;
 if not found or s.expires_at<=clock_timestamp() then raise exception 'Session unavailable' using errcode='42501'; end if;
 if p_expected_revision is null or p_expected_revision<>s.revision then raise exception 'Session changed' using errcode='40001'; end if;
 if p_action is null or p_action not in ('attention','view','answer','self','return','bring','end') then raise exception 'Invalid action' using errcode='22023'; end if;
 if p_action in ('attention','view','answer','bring') then
  if not classroom_private.valid_lesson_stage(s.lesson,p_stage) then raise exception 'Invalid stage' using errcode='22023'; end if;
  s.stage:=p_stage;s.bring_revision:=s.bring_revision+1;
 elsif p_stage is not null then raise exception 'Unexpected stage' using errcode='22023'; end if;
 s.revision:=s.revision+1;
 if p_action in ('attention','view','answer') then s.presentation_mode:=p_action;s.locked:=true;
 elsif p_action in ('self','return','end') then s.presentation_mode:='self';s.locked:=false;
 end if;
 if p_action='return' then s.return_revision:=s.return_revision+1; end if;
 if p_action='end' then
  result:=classroom_private.snapshot(s)||jsonb_build_object('ended',true);
  delete from classroom_private.sessions where id=s.id;return result;
 end if;
 update classroom_private.sessions set stage=s.stage,locked=s.locked,revision=s.revision,bring_revision=s.bring_revision,presentation_mode=s.presentation_mode,return_revision=s.return_revision where id=s.id returning * into s;
 return classroom_private.snapshot(s);
end;
$$;
revoke all on function classroom_private.snapshot(classroom_private.sessions) from public,anon,authenticated;
revoke all on function public.classroom_teach_control(uuid,text,bigint,text) from public,anon,authenticated;
grant execute on function public.classroom_teach_control(uuid,text,bigint,text) to authenticated;
notify pgrst,'reload schema';
commit;
select true as class_remote_ready;

-- Temporary live-code state. This contains teacher demonstration code/output only.
-- It is deleted with the two-hour classroom session and never stores learner work.
begin;
alter table classroom_private.sessions
  add column if not exists demo_state jsonb not null default '{"open":false}'::jsonb
  check (jsonb_typeof(demo_state)='object');
alter table classroom_private.sessions
  add column if not exists demo_revision bigint not null default 0
  check (demo_revision>=0);

create or replace function classroom_private.snapshot(p_session classroom_private.sessions)
returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object(
  'version',1,'lesson',p_session.lesson,'class_id',p_session.class_id,
  'session_id',p_session.id,'stage',p_session.stage,'locked',p_session.locked,
  'revision',p_session.revision,'bring_revision',p_session.bring_revision,
  'expires_at',p_session.expires_at,'server_now',statement_timestamp(),'ended',false,
  'mode',p_session.presentation_mode,'return_revision',p_session.return_revision,
  'demo',p_session.demo_state || jsonb_build_object('demo_revision',p_session.demo_revision)
 );
$$;

create or replace function public.classroom_demo_save(p_session_id uuid,p_demo jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 s classroom_private.sessions;
 clean jsonb;
 code_value text;
 output_value text;
 program_value text;
 seq_value bigint:=0;
 line_value integer:=1;
 start_value integer:=0;
 end_value integer:=0;
 running_value boolean:=false;
 title_value text;
begin
 if not public.classroom_is_teacher() then raise exception 'Teacher sign-in required' using errcode='42501'; end if;
 select * into s from classroom_private.sessions where id=p_session_id and teacher_id=auth.uid() for update;
 if not found or s.expires_at<=clock_timestamp() then raise exception 'Session unavailable' using errcode='42501'; end if;
 if p_demo is null or jsonb_typeof(p_demo)<>'object' or jsonb_typeof(p_demo->'open')<>'boolean' then raise exception 'Invalid demonstration state' using errcode='22023'; end if;
 if coalesce((p_demo->>'seq') ~ '^[0-9]{1,15}$',false) then seq_value:=(p_demo->>'seq')::bigint; end if;
 if (p_demo->>'open')::boolean then
  program_value:=p_demo->>'program';
  if program_value not in ('gap','syntax','indent','core','extension') then raise exception 'Invalid demonstration program' using errcode='22023'; end if;
  if jsonb_typeof(p_demo->'code')<>'string' or jsonb_typeof(p_demo->'output')<>'string' then raise exception 'Invalid demonstration text' using errcode='22023'; end if;
  code_value:=p_demo->>'code';output_value:=p_demo->>'output';
  if length(code_value)>20000 or length(output_value)>24000 then raise exception 'Demonstration is too large' using errcode='22023'; end if;
  if coalesce((p_demo->>'line') ~ '^[0-9]{1,4}$',false) then line_value:=greatest(1,least(2000,(p_demo->>'line')::integer)); end if;
  if coalesce((p_demo->>'selectionStart') ~ '^[0-9]{1,6}$',false) then start_value:=least(length(code_value),(p_demo->>'selectionStart')::integer); end if;
  if coalesce((p_demo->>'selectionEnd') ~ '^[0-9]{1,6}$',false) then end_value:=least(length(code_value),(p_demo->>'selectionEnd')::integer); end if;
  if jsonb_typeof(p_demo->'running')='boolean' then running_value:=(p_demo->>'running')::boolean; end if;
  title_value:=case program_value when 'gap' then 'Complete the missing condition' when 'syntax' then 'Repair the syntax' when 'indent' then 'Repair the indentation' when 'core' then 'Laptop loan adviser' else 'Ticket desk challenge' end;
  clean:=jsonb_build_object('open',true,'program',program_value,'title',title_value,'code',code_value,'output',output_value,'line',line_value,'selectionStart',start_value,'selectionEnd',greatest(start_value,end_value),'running',running_value,'seq',seq_value,'updated_at',clock_timestamp());
 else
  clean:=jsonb_build_object('open',false,'seq',seq_value,'updated_at',clock_timestamp());
 end if;
 update classroom_private.sessions set demo_state=clean,demo_revision=demo_revision+1 where id=s.id returning * into s;
 return s.demo_state || jsonb_build_object('demo_revision',s.demo_revision);
end;
$$;

-- Keep the existing control contract and also clear a demonstration whenever
-- the teacher releases learners or ends the classroom.
create or replace function public.classroom_teach_control(p_session_id uuid,p_action text,p_expected_revision bigint,p_stage text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare s classroom_private.sessions; result jsonb;
begin
 if not public.classroom_is_teacher() then raise exception 'Teacher sign-in required' using errcode='42501'; end if;
 select * into s from classroom_private.sessions where id=p_session_id and teacher_id=auth.uid() for update;
 if not found or s.expires_at<=clock_timestamp() then raise exception 'Session unavailable' using errcode='42501'; end if;
 if p_expected_revision is null or p_expected_revision<>s.revision then raise exception 'Session changed' using errcode='40001'; end if;
 if p_action is null or p_action not in ('attention','view','answer','self','return','bring','end') then raise exception 'Invalid action' using errcode='22023'; end if;
 if p_action in ('attention','view','answer','bring') then
  if not classroom_private.valid_lesson_stage(s.lesson,p_stage) then raise exception 'Invalid stage' using errcode='22023'; end if;
  s.stage:=p_stage;s.bring_revision:=s.bring_revision+1;
 elsif p_stage is not null then raise exception 'Unexpected stage' using errcode='22023'; end if;
 s.revision:=s.revision+1;
 if p_action in ('attention','view','answer') then s.presentation_mode:=p_action;s.locked:=true;
 elsif p_action in ('self','return','end') then s.presentation_mode:='self';s.locked:=false;s.demo_state:='{"open":false}'::jsonb;s.demo_revision:=s.demo_revision+1;
 end if;
 if p_action='return' then s.return_revision:=s.return_revision+1; end if;
 if p_action='end' then result:=classroom_private.snapshot(s)||jsonb_build_object('ended',true);delete from classroom_private.sessions where id=s.id;return result;end if;
 update classroom_private.sessions set stage=s.stage,locked=s.locked,revision=s.revision,bring_revision=s.bring_revision,presentation_mode=s.presentation_mode,return_revision=s.return_revision,demo_state=s.demo_state,demo_revision=s.demo_revision where id=s.id returning * into s;
 return classroom_private.snapshot(s);
end;
$$;

revoke all on function classroom_private.snapshot(classroom_private.sessions) from public,anon,authenticated;
revoke all on function public.classroom_demo_save(uuid,jsonb) from public,anon,authenticated;
revoke all on function public.classroom_teach_control(uuid,text,bigint,text) from public,anon,authenticated;
grant execute on function public.classroom_demo_save(uuid,jsonb) to authenticated;
grant execute on function public.classroom_teach_control(uuid,text,bigint,text) to authenticated;
notify pgrst,'reload schema';
commit;
select true as live_demo_ready;
