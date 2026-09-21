# Verification — 20 September 2026

## Animation and applied drawing update — 21 September 2026

- Full student path re-tested through PDF export, including four animated sample drawings.
- Progressive line interpolation verified at intermediate positions; final geometry remains unchanged.
- Slow/Steady/Immediate selection; reduced-motion defaults to Immediate.
- Stop, editing during playback and leaving an extension cancel animation without delayed completion callbacks.
- Replay does not execute Python or add a run to the evidence record.
- Applied square, rectangle and wheel programs tested against challenge coordinates; no school map behind drawing work.
- Existing syntax-error, infinite-loop recovery, saved v01, local-file runtime, Mandarin, tablet-width and Gimkit tests pass.
- Physical iPad Safari performance and sharing remain teacher device checks.

Passed using a separate headless Chrome instance, without using real student data:

- Blank name/class validation and the normal student path through all 15 cards.
- Missing-answer links and checkbox completion; incorrect checked answers do not trap students.
- Automatic saving, refresh/resume, Mandarin written responses and separate teacher storage.
- Teacher entry without a class; every card available for review.
- Real Python `t.goto(80, 0)` regression test; normal two-command route; changed coordinate.
- Syntax error display with student-line number; infinite loop timeout; successful run after error/timeout.
- Local file:// runner and HTTP-hosted runner.
- Coordinate-map start, destination, safe-route and continuity checks.
- Automatic code/output capture, IndexedDB retrieval, evidence preview and version snapshot.
- Python file download including prepared map setup; exported Python parsed successfully using Python's AST parser.
- Extension run, explanation and attempt record; version 1 retained separately.
- PDF generation/download with code, map, reflections, attempts and Mandarin text.
- Rendered PDF visual checks. Short code sections kept together across pages.
- iPad-sized portrait (820×1180), landscape (1024×768) and laptop (1366×900) layouts, with no horizontal page overflow.
- Focus workspace hides reading temporarily; moving to another card restores that card's reading.
- Teams confirmation updates progress, while remaining explicitly self-reported.
- No browser JavaScript errors during the full scripted journey.

Drawing/Gimkit update:
- Square, rectangle, circle and two-shape samples execute using the real interpreter on a blank grid.
- Repeat attempts counted separately; route v01 remains unchanged.
- Drawing Python downloads start at (0,0) and contain no school-map setup.
- Drawings and attempt notes appear in the report alongside route evidence.
- Gimkit join link absent before Teams self-confirmation, visible afterward, hidden again if unchecked, and restored on refresh. Link opens a new tab.
- Both teacher CSVs match Gimkit's linked official template and round-trip with 10 questions and four distinct answers per question. Actual Gimkit import/hosting remains with the teacher.
- Legacy 14-card saved profiles keep their stage/code; migration runs only once. New optional drawing can be skipped.
- Unfinished drawing attempts retain code/output/note across refresh and appear as in progress in the report.
- Drawing images remain together on a PDF page; drawings, code and bilingual CSV previews were visually reviewed.

Limitations: viewport testing is not physical iPad Safari testing. File-sharing sheets, school-managed browser restrictions, real Teams upload and desktop Tkinter drawing require the teacher's device check. Desktop Python export was syntax-checked; its GUI was not launched. This app is not deployed publicly by creating this ZIP.
