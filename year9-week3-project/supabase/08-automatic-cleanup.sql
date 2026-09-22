-- Step 8: enable the pg_cron integration in the Dashboard first.
-- Run this as the default postgres role in the SQL Editor.
-- Only this feature's expired sessions and its own old job logs are deleted.
begin;

select cron.schedule(
  'classroom-expired-session-cleanup',
  '* * * * *',
  $job$
    select classroom_private.cleanup_expired_sessions();

    delete from cron.job_run_details
    where jobid in (
      select jobid from cron.job
      where jobname = 'classroom-expired-session-cleanup'
        and username = current_user
    )
    and end_time < now() - interval '1 day';
  $job$
);

-- Check that the cleanup function can execute now as well.
select classroom_private.cleanup_expired_sessions();

commit;

select jobname, schedule, active
from cron.job
where jobname = 'classroom-expired-session-cleanup'
  and username = current_user;
