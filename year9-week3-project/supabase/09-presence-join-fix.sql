-- Live-test correction: Supabase requires a read permission to JOIN a channel,
-- even when a client only publishes its own Presence.
-- Allow receiving Broadcast on the Presence-only channel as a join gate.
-- No browser can SEND Broadcast on that channel, so it carries no broadcasts.
-- Students still CANNOT read Presence (the teacher's connection list), send
-- control broadcasts, call teacher actions, or access the private tables.
begin;

alter policy classroom_receive on realtime.messages
  using (
    classroom_private.channel_allowed(realtime.topic(), extension, false)
    or (
      extension = 'broadcast'
      and classroom_private.channel_allowed(realtime.topic(), 'presence', true)
    )
  );

alter policy classroom_receive_guard on realtime.messages
  using (
    realtime.topic() not like 'classroom:%'
    or classroom_private.channel_allowed(realtime.topic(), extension, false)
    or (
      extension = 'broadcast'
      and classroom_private.channel_allowed(realtime.topic(), 'presence', true)
    )
  );

commit;
select true as presence_join_ready;
