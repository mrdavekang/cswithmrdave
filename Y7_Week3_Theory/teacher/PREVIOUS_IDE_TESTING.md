# Python Turtle IDE update · Verification

Checked 16 September 2026. This file describes the updated build, not native-device or authenticated-service certification.

## Executed in the updated build

50 browser/runtime regression checks and 5 additional finishing checks passed. These ran the actual bundled Skulpt worker and local app code, not mocked Python results.

- All six Main task 1 editors: deliberately malformed syntax, repaired syntax, exact starting position/direction/pen state, movement, turns, pen control, comments and hinge example.
- Main task 2: route starts at (0, -200) and finishes at (200, 100); comparison A finishes at (80, -40), B at (0, -120); checkpoint finishes at (40, -20), facing down.
- goto preserves heading; pen-up movement does not create a drawn stroke; full 360-degree turns and clockwise turns retain signed angle information for animation.
- Real Python variables, arithmetic, for, if, a user-defined function, math import and print output.
- Turtle class instances, module-level commands, colour, pen width, fills, circle, dot and write.
- Genuine Python SyntaxError, TypeError and AttributeError messages mapped to the student's editor line.
- Stop during an endless loop; a fresh successful run after Stop; interpreter/worker time limits and the 800-action drawing limit.
- Student prediction gate, no answer explanation before a first test, an incorrect original answer retained after running, and a separate correction history.
- Checkpoint execution locked before first submission, unlocked afterwards; executed output does not replace the original checkpoint snapshot.
- Step and rewind restore the correct position and pen state; optional .py export includes setup.
- Separate editor drafts survive stage navigation and language changes. The saved-state object contains code, test results, kept images and checkpoint records.
- Selected PDF test includes actual canvas output. Remove kept test appears immediately and removes only that snapshot, not the code.
- No document-level horizontal overflow at 1440×1000, 1024×768, 768×1024, 800×1280 and 390×844. Navigation strips intentionally scroll on small screens.
- Expanded workspace opens and closes with Escape; narrower layouts provide View drawing / Back to code navigation.
- A ten-page PDF generated from the actual in-browser Blob, containing original checkpoint evidence and three selected Python output images. Report sections fit within the page content area. PDF pages were rendered and inspected for clipping and multilingual text.
- Long extension code uses a bounded preview rather than overflowing its report section. Full code remains available through the optional .py export.
- No unexpected page JavaScript errors in the automated regression run.
- Local script/style references and package contents checked. No font files included.

## Preserved features and prior verification

The existing lesson sequence, teacher configuration, language support, local evidence saving, device-specific submission guide, PDF sharing controls, Gimkit launch and 15-question backup bank remain in the app. The original build's complete student flow, submission confirmations, configurable links/screenshots and quiz were checked before this IDE update. The current regression concentrates on the changed Python workspaces, prediction/assessment logic, saving and report export. It does not constitute a new authenticated end-to-end Teams/Gimkit test.

## Test-environment limits

The sandbox blocked ordinary Chromium file/HTTP navigation. Browser tests injected the local HTML, CSS and script contents into a browser document. A localStorage-compatible test shim exercised state writing and navigation restoration; actual browser persistence after closing/reopening under school cleanup or private-browsing policies was not verified. The Python interpreter really executed in a Blob-backed Web Worker during these tests.

Native Safari/iPadOS and Android share sheets, Windows/Mac/Chromebook file pickers, managed-browser policies, a hosted site's Content Security Policy, real school Teams uploads/turn-in status and authenticated Gimkit import were not executed here. Check those on representative school devices. Viewport testing is not native-device testing.

The default submission pictures remain labelled illustrations. Real school-device screenshots can still be added through Teacher tools. The packaged config contains no synthetic test links, screenshots or student answers. Teacher mode is a convenience, not authentication; this is a local formative-learning tool rather than a secure assessment platform or connected gradebook.
