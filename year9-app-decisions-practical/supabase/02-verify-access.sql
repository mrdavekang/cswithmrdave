-- Read-only deployment check. Apply 01 first. Every ok value should be true.
-- Run as the project administrator. Functional anon/non-owner/wrong-record-key
-- checks are also required before enabling config.js (see README).
with checks as (
 select 'private schema hidden from anon' as check_name,
   not has_schema_privilege('anon','y9_app_decisions_practical_private','USAGE') as ok
 union all select 'private schema hidden from authenticated',
   not has_schema_privilege('authenticated','y9_app_decisions_practical_private','USAGE')
 union all select 'RLS on all four private tables',
   (select count(*)=4 and bool_and(c.relrowsecurity) from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='y9_app_decisions_practical_private' and c.relkind='r')
 union all select 'anon cannot read records directly',
   not has_table_privilege('anon','y9_app_decisions_practical_private.records','SELECT')
 union all select 'authenticated cannot read records directly',
   not has_table_privilege('authenticated','y9_app_decisions_practical_private.records','SELECT')
 union all select 'anon can join a privately keyed record',
   has_function_privilege('anon','public.y9_decisions_practical_join(uuid,text,text,text)','EXECUTE')
 union all select 'anon cannot list teacher records',
   not has_function_privilege('anon','public.y9_decisions_practical_teacher_list(text,integer,integer)','EXECUTE')
 union all select 'anon cannot read teacher detail',
   not has_function_privilege('anon','public.y9_decisions_practical_teacher_detail(uuid,bigint,integer)','EXECUTE')
 union all select 'anon cannot review help',
   not has_function_privilege('anon','public.y9_decisions_practical_teacher_review(uuid,text)','EXECUTE')
 union all select 'authenticated may request owner-guarded teacher list',
   has_function_privilege('authenticated','public.y9_decisions_practical_teacher_list(text,integer,integer)','EXECUTE')
 union all select 'all three teacher functions include owner guard',
   (select count(*)=3 and bool_and(p.prosrc like '%if not y9_app_decisions_practical_private.owner()%')
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in
    ('y9_decisions_practical_teacher_list','y9_decisions_practical_teacher_detail','y9_decisions_practical_teacher_review'))
 union all select 'approved existing teacher is unchanged',
   (select count(*)=1 and bool_and(owner_id='6901b13b-437c-4c79-ad01-a6bfc75f6a62'::uuid)
    from y9_app_decisions_practical_private.settings where lesson='year9-app-decisions-practical')
)
select check_name,ok from checks order by check_name;
