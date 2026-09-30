# Verification · lesson version 2 · permanent-link build 1 October 2026

## Permanent-link update: prepared, not yet activated

The permanent-link app is a separate copy. The original working cloud app and its live database are unchanged. Browser connections timed out, so migration 06 has NOT been applied, rollback-only SQL suite 07 has NOT been executed and this update has NOT been tested against the live database or a real browser. Do not interpret the previous build's checks below as validation of the new database migration.

New local Node tests passed with mocked networking: permanent entry-token parsing, permanent URL retained after joining, legacy URL compatibility/removal, malformed-token local fallback, closed-entry explanation, same key/UUID on retry after reopening, no duplicate attempt and existing-pupil saving while intake is closed. All original cloud-client unit checks also passed.

New teacher-page unit tests passed with mocked DOM/Auth/network: fetching a permanent link while intake is closed, stable URL across open/close/reopen, entry-expiry display, closing without disabling saves, replacement confirmation/cancellation, delayed class-switch responses not showing the previous class's link, missing-migration notice and sign-out. JavaScript syntax checks passed. These are not real Supabase access-control tests.

Before publishing: install 06, execute rollback-only 07 and existing 04, then verify the hosted teacher dashboard with the approved account and a synthetic pupil. Confirm the same posted URL works after closing/reopening entry, closed entry denies a new pupil, and an already-joined pupil can still save with their own key. Check Safari/iPad and the hosting address. No actual pupil data or authentication credentials were used in these local tests.

## Earlier cloud build checks (30 September; carried forward, not rerun)

Live browser checks used Chrome and the local app UI, calling the real cswithmrdave Supabase API. Two synthetic pupils in a separate Connection test - 30 Sep class registered and saved different starter answers. One pupil ran a three-sided Turtle drawing; its code and compact output were saved. Finish received a server acknowledgement, and name-based same-device reopening after refresh restored the private-key-authorized work and submission. Database inspection confirmed separate records, bounded JSON and no student/teacher/cloud credential fields in payloads. No actual pupil work was uploaded.

Teacher preview showed no pupil work sent. The unsigned teacher page displayed a separate login, not a class roster. Database tests under actual anon/authenticated roles separately verified pupil-key isolation, denied public/unapproved teacher access, and approved-teacher ownership. Live sign-in with the teacher's own classroom account and dashboard actions still require user verification; no teacher password was retrieved or changed.

Node tests with mocked networking passed: persisted key before registration, same-name separation, credential exclusion, pupil/teacher transport separation, offline outbox, duplicate/idempotent writes, lost response after refresh, revision conflicts, explicit reconciliation, acknowledged submission, edits reopening a draft, remote recovery, preview isolation, no-link local fallback, storage failure and payload limits/coordinate compaction. These simulate interrupted-network conditions; they are not a claim of testing a real school network outage.

A real private JSON download was inspected: valid recovery capability and code/answers; the report-rendering data excludes the capability. Automated UI restore was blocked by the browser extension's file-URL permission, not an observed app error. That permission was not changed. Full cross-device/private-file recovery still needs a school-device check.

Both synthetic attempts were retained but revoked and their class intake/saving closed after the test. The real 7T lesson was left closed. No data was permanently deleted. Existing classroom mode and billing were unchanged.

## Prior lesson and colour-build verification

Automated tests used a separate Chromium browser, not the user's signed-in browser.

Passed:

- Name/class validation, case-insensitive teacher preview without a class, and no blank landing/lesson pages in the tested journeys.
- Complete student path across all 11 lesson stages, with grouped practice cards and one plenary question at a time.
- Visible stage navigation, current stage/card markers, progress bar and top-right JSON backup.
- Missing-answer guidance highlights the actual field; all stages remain reachable. Wrong answers, wrong arrangements, and a Python syntax error can continue after an attempt.
- Correct marking is green; wrong marking is amber; observation marking is neutral. Changing a checked answer removes stale feedback and marking. A cleared prediction remains unanswered.
- No help-reason panel or new help-reason/page-visit logging.
- Real Python output geometry: triangle closes after three sides, hexagon after six; four zigzag peaks finish at approximately (169.411, 0); pentagon/star close; fan has six outward/return ray pairs. All six target images load.
- Slow drawing animation and its completion message, including a complete triangle matching the reference. Stop interrupts ordinary infinite-loop execution without locking lesson navigation.
- Refresh/resume, current-profile reset without clearing another profile, and V1 backup migration preserving legacy evidence while restarting revised work at Welcome.
- JSON and PDF downloads, code/output evidence preview, and a complete 15-question practice round including wrong answers and revisions.
- Local file opening and hosted preview opening.
- Laptop/display/tablet/phone viewports: 1920×1080, 1366×768, 1024×768, 768×1024 and 390×844. No horizontal page overflow or header/stage overlap in the tested layouts. Phone stage navigation scrolls horizontally rather than hiding behind a button.
- No uncaught page errors in final test journeys.

Colour studio checks passed in the additive colour build:

- Preset, custom and rainbow choices change genuine Python output without altering movement geometry. Closing without Apply makes no code change; applying does not automatically run.
- Reapplying a style is idempotent. Switching rainbow to solid removes only managed colour instructions. CRLF inputs, alternate loop-counter names and nested-loop insertion were checked; manually authored colour commands remain intact.
- Colour choices work on both initially neutral and already-coloured lesson examples. Refresh/resume retains code and style. Unsupported rainbow use shows a precise local hint without losing code or locking lesson navigation.
- Seven upper half-circle arcs and eight out/back rays execute successfully with seven colours. Both new target images load. Existing core path, wrong-answer progression, quiz and local-opening tests also pass.
- .py, JSON and PDF evidence exports retain colour instructions, style choices and actual coloured drawing evidence.
- Colour dialog layouts checked at 1366×768, 1024×768, 768×1024 and 390×844, with no horizontal overflow. Palette buttons have names, visible swatches and pressed-state indicators. Screenshots visually inspected for the tablet dialog and art output.

During concurrent test browsers, one hosted loading attempt stalled; the full journey passed when repeated on its own. This does not replace testing the published URL and runtime on school devices.

Not independently verified: actual iPad hardware/Safari, native Share to Files, Microsoft Teams upload, school filtering/CSP, live Gimkit/Blooket imports or deployment-provider behaviour. Test the published app and teacher login on real school devices before class. The prior checks above predate the cloud integration; the new live/mocked checks are distinguished at the top.
