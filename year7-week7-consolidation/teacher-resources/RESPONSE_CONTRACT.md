# Restricted Supabase connection · response contract

Connected on 30 September 2026 to cswithmrdave. Database actual-role tests passed; browser registration, answer/code/output saves, submission and refresh were verified using synthetic pupils only. See TEST_REPORT.md for remaining checks.

## Identity and scope

- Lesson ID: y7-t1-w7-consolidation-v1; lesson version 2; schema version 1.
- One current row per class, lesson and local learner UUID, not one row per click.
- Typed names are labels, not authentication, and may collide.
- A teacher's class invitation admits new attempts for a limited time. Launch URL fragments contain class UUID, lesson ID, label and invitation; no invitations are packaged or hard-coded.
- Before registration, the browser persists a learner UUID and cryptographically random 256-bit private resume key. The database stores only its SHA-256 digest. The key permits access to exactly one attempt, never a class roster.
- The private JSON backup includes the key for cross-device recovery. PDF reports and cloud response payloads omit it. Shared-browser physical access means access to device keys: use the leave-device workflow and private school storage.
- Typing teacher is preview only. teacher.html requires the existing approved Supabase Auth teacher and server-checked class ownership. Its session uses sessionStorage separately from pupil state.

## Payload and limits

Stable card/question IDs key answers, histories, arranged algorithms, code drafts, first/latest run evidence, progress, reflections and quiz rounds. The snapshot includes schema/lesson versions and client timestamps. Server metadata includes record/class IDs, name, revision, updated_at and submitted_at.

StudentWorkCloud.payload() allowlists fields, omits student/teacher/cloud credentials, rounds coordinates to two decimals and retains first/latest runs. No screenshots, image bucket, EAL tiers, CAT scores or grades are uploaded. Device backups can retain additional recent runs.

The frontend conservative JSON bound is 450,000 bytes. Server limits: 524,288 payload bytes, one update per second and 60 attempts per class/lesson by default. Revoked fixtures still count. Whole snapshots are sent, not partial patches. Pilot storage and bandwidth across realistic lesson/retention counts before scaling. No automatic retention deletion is installed.

## Saving and recovery

1. Save locally immediately; queue cloud sync after about five seconds idle. Network failures do not lock lesson navigation.
2. Persist an outbox containing payload, expected revision, finish flag and write UUID before sending. Retry the same UUID after a lost response, including after refresh.
3. Server revisions prevent delayed overwrites. A conflict offers the newer class copy or device draft after recommending a backup; neither is silently discarded.
4. Show device/pending/class-saved status accurately. Finish confirms submission only after server acknowledgement; delayed successful saves update its heading too.
5. Core response/code changes reopen the draft. Post-submission quiz practice also saves. Partial lessons can be submitted; missing activities remain visible for teacher review.
6. Switching pupils detaches pending callbacks. Same-browser resume uses its saved key; another device needs a private backup, not a name-only lookup.

## API

Student POST endpoints under /rest/v1/rpc/:

- student_work_register: class/lesson/invitation, local learner UUID, name and resume key.
- student_work_load: attempt UUID and resume key.
- student_work_save: attempt UUID/key, payload, expected revision, write UUID and finish flag.

Pupil requests use only the public publishable key, never a teacher JWT. teacher.html uses the authenticated JWT for student_work_teacher_classes, _create_class, _open, _close, _list and _load. The database also provides _revoke for approved-teacher operational use. Direct table/schema access for public clients is revoked; all four private tables have RLS. No service-role key or database password is bundled.

Errors: 40001 = revision conflict; P0001 = retry after rate limit; 54000 = size/cap limit; 42501 = unauthorized/closed/expired access; 22023 = invalid format/version. Device work remains available in each case.

Stop new entries invalidates invitations but permits existing saves. Closing saves or revoking an attempt is a deliberate teacher/database operation. Revocation preserves audit records. Do not casually rerun the separate foundation migration: it deliberately disables APIs before the enable migration.
