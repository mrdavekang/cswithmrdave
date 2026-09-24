# Verification report — visual revision, 24 September 2026

## Verified this revision

- 297 card render combinations: 33 cards × 3 editors × 3 language settings, using jsdom DOM tests.
- Name/class validation; teacher profile isolation.
- Core build Open → Build → Try is linear.
- Learning Pitstop precedes Go Further, which precedes Plenary.
- Extension Explore → Build → Play & change navigation and direct plenary escape.
- Independent extension status: exploring one project does not complete another.
- Concept models: increment and saved-versus-current dial values.
- New fields survive autosave/resume and JSON validation/import path.
- Extension notes and readable preview records are included in PDF/print report content.
- Every referenced local image exists; missing-image fallback tested.
- All eight new MakeCode Python/MicroPython samples parse as Python.
- Core counter and four new extension programs converted successfully from JavaScript to real MakeCode blocks in the live editor; actual block screenshots captured and inspected.
- Both Grove diagrams rendered and inspected for clarity.
- JavaScript syntax checks passed.

## Limits — do not interpret these as passes

The local-app browser preview was unavailable under the browser access policy. Tests above exercise DOM/state logic, not an end-to-end browser layout engine. No replacement HTML injection or alternate browser/origin was used to bypass the restriction.

Responsive styles are included, but laptop/tablet screenshots of this revision were not captured. New report content was tested; direct PDF pagination, OS download dialogs, clipboard permissions and physical printer output were not re-verified visually in this revision.

No physical micro:bit, Grove kit, iPad Bluetooth or Android transfer was available for hardware testing. Python AST checks verify syntax, not the micro:bit runtime. MakeCode compilation of equivalent block programs is not proof of physical wiring or cross-editor timing equivalence. Test slowly, waiting for each display to finish.

Before class: open the hosted app on a student laptop/iPad, check one complete core flow, download a PDF, and test P2 LED/P0 rotary connections using the school's actual kit and teacher-approved power. Student fields are self-reports where not explicitly auto-checked. Concept previews do not execute student code.

## Repeatable regression check

Run test-visual.cjs with jsdom available (JSDOM_PATH may point to its installed directory). The test is developer-only; no installation is required for students.
