-- Year 11 fitness lesson only. No public table access; existing owner checks retained.
begin;
create table if not exists y11_fitness_private.feedback(
 id uuid primary key,record_id uuid not null references y11_fitness_private.records(id),
 teacher_id uuid not null references auth.users(id),message text not null check(length(message) between 1 and 2000),
 at timestamptz not null default clock_timestamp()
);
alter table y11_fitness_private.feedback enable row level security;
revoke all on y11_fitness_private.feedback from public,anon,authenticated;
create or replace function public.y11_fitness_records_feedback(p_record_id uuid,p_id uuid,p_message text)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not y11_fitness_private.owner() then raise exception 'Approved teacher sign-in required' using errcode='42501';end if;
 if p_id is null or not exists(select 1 from y11_fitness_private.records where id=p_record_id) then raise exception 'Record unavailable';end if;
 insert into y11_fitness_private.feedback(id,record_id,teacher_id,message) values(p_id,p_record_id,auth.uid(),btrim(p_message)) on conflict(id) do nothing;
 return jsonb_build_object('saved',true);
end $$;
create or replace function public.y11_fitness_records_messages(p_record_id uuid,p_token text default null)
returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not y11_fitness_private.owner() then
  if not exists(select 1 from y11_fitness_private.records where id=p_record_id and token_hash=y11_fitness_private.hash(p_token)) then raise exception 'Private record required' using errcode='42501';end if;
 end if;
 return coalesce((select jsonb_agg(to_jsonb(f)-'teacher_id' order by at) from y11_fitness_private.feedback f where record_id=p_record_id),'[]');
end $$;
revoke all on function public.y11_fitness_records_feedback(uuid,uuid,text) from public,anon,authenticated;
revoke all on function public.y11_fitness_records_messages(uuid,text) from public,anon,authenticated;
grant execute on function public.y11_fitness_records_feedback(uuid,uuid,text) to authenticated;
grant execute on function public.y11_fitness_records_messages(uuid,text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
