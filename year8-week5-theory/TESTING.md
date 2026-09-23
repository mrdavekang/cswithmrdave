# Verification — 22 September 2026

## Passed

- Navigation regression: Continue follows Do Now 6 → 7 → 8 → 9 → 10 → Types of Learning; Back returns to question 10. Verified in the browser, and all ten forward/backward transitions are unit tested in both route modes.

- JavaScript syntax checks for lesson, app and runtime files.
- Content checks: 48 unique cards, 19 core learning cards, sketch question-bank counts, extension ordering, valid answer indices and local dependencies.
- Backup validator: compatible data accepted, invalid lesson rejected, history over 100 attempts preserved.
- Browser entry: blank required details do not start; filled details start the lesson.
- Incorrect MCQ feedback does not block navigation; opening cards alone does not count as completion.
- All 48 cards rendered through the visible interface without browser errors.
- Worked trace advances through all four steps.
- Teacher query route accepts blank class and uses a separate session; student test work remains available.
- Python: inline prompt, Enter input, echo and resumed output; two sequential prompts; integer conversion; both outcomes in example tests.
- Python: runaway loop terminated; waiting input can be stopped; code and run evidence retained.
- Refresh/resume restores code, output, language and recorded progress.
- Evidence image uploaded, compressed and previewed; appeared in exported PDF.
- JSON backup downloaded.
- PDF download and filename; all five pages of the test report rendered and visually inspected, including Mandarin/Korean text, code, console input and image evidence.
- Responsive inspection at 1366×768, 1920×1080, 1024×768 and 768×1024. No page-width overflow observed.
- Teams guidance appears after PDF export; makes no claim of automatic submission.

## Not fully verified

- Local file URL opening: blocked by testing-browser policy. Hosted localhost preview was tested instead; local fallback remains unverified in an actual browser.
- Physical iPad/iPhone, Safari, school filters and storage policies were not tested.
- JSON import validation was unit tested; full browser file-picker import round-trip was not completed.
- Screenshot upload was tested; clipboard image paste was not separately tested end to end.
- Browser-print fallback implementation and print stylesheet reviewed, but native print-dialog PDF output was not verified.
- No live Teams upload or GitHub publication was performed.
- Language support is authored scaffolding, not a professional translation certification.

## Teacher acceptance check

On one school laptop and one iPad: start a named session, run a two-prompt program, refresh and resume, export/import a backup, export the PDF, then confirm the correct Teams assignment is accessible. Use the 60-minute core route before considering additional practice.

## Classroom integration checks

- `node tests/content.test.cjs`: existing 48-card content, navigation and backup checks.
- `node tests/classroom.test.cjs`: anonymous bridge contains no identity, pending teacher movement waits for landing entry, End clears pending movement, exact-card movement, locked navigation, unlock, and name-based preview cannot claim teacher role.
- Development SQL fixture: 88 RPC checks passed against steps 6–13, including idempotent Year 8 upgrade, all 48 card IDs, unknown card rejection, anonymous/other-teacher denial, and isolation from Year 9.
- Browser preview: landing name/class preserved, plain URL exposes Teacher sign-in, student entry and Continue work, teacher form appears.
- Live Year 8 Start/Presence/Lock/Bring/Unlock/End must be checked after running step 13 and signing into the teacher preview. These have not yet been verified against the live Year 8 session.
