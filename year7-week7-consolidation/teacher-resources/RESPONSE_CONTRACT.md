# Future Supabase integration · response contract

**Design document only. No database is connected or modified in this build.**

**30 September 2026 setup update:** A separate private student-work database foundation and restricted RPC functions have now been installed and tested in `cswithmrdave`. The lesson app itself is still local-only: cloud sync and the signed-in teacher review/launch interface have not been integrated. Refer to `../../supabase-student-work/SETUP_NOTES.txt` for the actual class/lesson registration, API contract and security/recovery requirements. The proposal below describes the intended frontend connection, not a claim that this app is already connected.

## Revised build (lesson version 2)

The lesson ID stays stable for local recovery. New drawing cards have distinct IDs; legacy answers/runs remain in a migrated backup. Old quiz attempts are archived separately because question meanings changed. No new help-reason or page-visit data is collected. A top-right JSON backup is always available.

## Why app design comes first

The lesson now defines stable `cardId` and `questionId` values. The database need not have a separate column for every question box. Store a versioned JSON response payload, with a few indexed fields for teacher filtering. Question wording can change without changing the database shape.

## Proposed compact record

One row per learner, lesson and attempt:

- `id`: server-generated record ID.
- `learner_id`: school-approved stable opaque identifier, not a typed name alone.
- `class_id` and `lesson_id`: teacher-approved scope.
- `attempt_id`: distinct attempt identifier.
- `schema_version` and `lesson_version`.
- `responses`: JSON keyed by card/question ID, including first/latest answer where retained.
- `code_drafts`: JSON keyed by coding card ID.
- `run_evidence`: compact coordinates/pen settings, code, error/output and run time; no screenshots/base64.
- `progress`: completed cards, unfinished fields, response-based completion and local finish state.
- `reflection`: K/S/U self-ratings and pitstop responses.
- `quiz`: first/latest choices and round summaries.
- `interaction_summary`: meaningful action counts and a bounded recent event list.
- `revision`, `updated_at`, `submitted_at`: server-managed synchronization/status fields.

The app's local record already exposes these parts via `ConsolidationApp.exportRecord()`. Local UUIDs are convenient local identities, not evidence of a pupil's identity. Do not treat imported JSON as trusted authorization.

## Identity and access must be decided before connection

Names and classes are not secrets and can collide or be mistyped. Do not permit unrestricted read/update of records by matching a name. For a no-visible-login workflow, consider a school-approved class-entry mechanism plus a server-issued private resume capability for that learner/attempt. Alternatively use managed school sign-in. A class code by itself must not allow pupils to browse classmates' work. Changing device/browser requires a deliberate recovery process.

The `teacher` preview shortcut must never grant database access. Teachers need authenticated authorization restricted to their classes. Keep pupil tables private with Row Level Security and narrow server-side functions. Do not put a service-role key or database password in the app. Avoid broad anonymous SELECT policies. Rate-limit and size-limit writes, validate lesson/class IDs and test cross-pupil/class access.

## Recommended save behaviour

1. Save locally immediately.
2. Queue a debounced cloud save after a short idle period or card transition, not after every tap.
3. Send only changed text/code/progress where practical; do not resend the entire history on every character.
4. Keep an outbox during network loss; retry with backoff and clear “Saved on device / Sync pending / Saved to class” states.
5. Use revision numbers/idempotent write IDs to prevent delayed writes overwriting newer work. Handle cross-device conflicts explicitly.
6. On Finish, confirm a durable server save before showing “Submitted to teacher”. If offline, show “Finished on device, waiting to sync” and keep JSON/PDF backup available.

## Data size and retention

Text and coordinate records are much smaller than image screenshots. Actual size depends on code length, number of retained runs and lesson count. Measure serialized UTF-8 bytes after a representative pilot, then estimate pupils × lessons × average bytes with headroom for indexes, metadata and provider overhead. Do not promise a free-tier guarantee from pupil numbers alone; check the project's current database, bandwidth and platform limits before rollout.

Choose school-approved retention/deletion periods and collect only necessary pupil details. This build does not collect EAL tiers, grades or CAT scores. Limit action logs to evidence needed for teaching, not all taps. Keep PDF/image evidence outside the primary text payload if later required, with separate access controls and retention.

## Integration acceptance tests

- Correct learner/class/lesson restored without exposing other pupils.
- Anonymous/public clients cannot list class records.
- Student A cannot read or overwrite Student B's work, even by changing local IDs.
- Teacher sees only authorized classes; typing `teacher` does not bypass authentication.
- Offline changes, reloads and reconnects do not lose answers.
- Delayed/duplicate saves do not overwrite newer revisions.
- Finish confirms the database save, not just a button click.
- Local backup import cannot escalate permissions.
- Storage/network failure has clear feedback and a working backup.

Review the existing classroom-mode tables/functions before adding a migration. This app does not assume those presence tables already store lesson responses. Do not replace or weaken existing policies while adding student work.
