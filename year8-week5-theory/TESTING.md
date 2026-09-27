# Verification — 27 September 2026

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
- `node tests/lesson-clock.test.cjs`: continuous 1:00–2:00 schedule, valid lesson destinations, WAGBA guidance, 11 cue stages and four corner positions.
- `node tests/latest-features.test.cjs`: three fact slides, local response evidence, PDF inclusion, Year 8 live-code validation, highlighted line, anonymous Presence and the fixed green dock.
- Development SQL fixture: 15 latest-feature checks passed, including repeat migration, fact destinations, live-demo ownership, allowed-program and size checks, presentation modes, return, end and legacy compatibility.
- JavaScript syntax checks passed for the lesson, classroom controller, fact slides, live demonstration and clock.
- Projector layout was visually checked in both compact and hidden states. Compact controls keep every classroom action available in three shallow rows; Hide controls leaves only a small status-and-device pill in the bottom corner.
- Live Supabase acceptance remains required after running step 22: use one teacher and one student browser to check device count, all four presentation modes, automatic following, return to own work, all three fact slides, code broadcast and End classroom.
