# Verification report

Build: Year 8 · T1 Week 3 Project, version 1.

## Important test scope

Chromium in this container blocks navigation to local files, localhost and external URLs. The app was therefore rendered as its actual single-file HTML using Playwright `set_content`. A deterministic localStorage API mock was injected **only in the test harness** to test state/recovery logic. The delivered app contains no mock storage. Real origin persistence, school browser policies and OS file dialogs still need a hosted/on-device check.

The ordinary stylesheet font fallback was used during rendering. The direct PDF was generated with the bundled library and inspected after raster rendering. No physical micro:bit, iPad Safari, Android hardware or live MakeCode compiler was available.

## Results

43 browser/UI/failure-path assertions passed, plus 8 syntax/behaviour checks of the two Python-dialect models using stubbed micro:bit APIs. These are functional checks, not evidence of student learning gains.

- PASS: Landing renders
- PASS: iPad offers MakeCode only
- PASS: Computer offers all three routes
- PASS: Language change preserves entry
- PASS: English with Mandarin
- PASS: Eight exact stages
- PASS: Teacher controls absent for student
- PASS: Missing evidence reminder
- PASS: No-lockout progression
- PASS: Wrong answer explained
- PASS: Wrong answer can continue
- PASS: MicroPython has correct dialect
- PASS: Variable name adapts model
- PASS: MakeCode Python has global handler
- PASS: English with Korean
- PASS: Blocks route displays nesting
- PASS: Every card renders in en
- PASS: Every card renders in zh
- PASS: Every card renders in ko
- PASS: Trace checker correct
- PASS: Image stored with CJK caption
- PASS: Resume restores image and caption
- PASS: Help phase gives local support prompt
- PASS: No page overflow 1366x768
- PASS: No page overflow 1024x768
- PASS: No page overflow 768x1024
- PASS: No page overflow 390x844
- PASS: PDF generated
- PASS: Report includes eight stages
- PASS: Reject wrong backup type
- PASS: Reject unsafe image URL
- PASS: Teacher detected case/space insensitive
- PASS: Teacher class optional
- PASS: Teacher storage isolated
- PASS: Teacher guidance can be toggled
- PASS: No uncaught browser errors
- PASS: All extension panels render in all 3 coding routes and all 3 languages (36 combinations)
- PASS: Full core evidence gives 100% without extension
- PASS: All complete core cards show recorded
- PASS: Changing route invalidates stale practical status, keeps evidence
- PASS: Storage failure warning visible on mobile
- PASS: Print fallback renders report, hides lesson shell
- PASS: Extension and failure-path checks have no uncaught browser errors

## Program model checks

Both MicroPython and MakeCode Python examples were parsed as Python and run with controlled API/event stubs. After three A presses and (where present) one B press, the tested final values were:

| Variant | MicroPython | MakeCode Python |
| --- | ---: | ---: |
| Core | 3 | 3 |
| A adds 2 | 6 | 6 |
| B decreases by 1 | 2 | 2 |
| B resets | 0 | 0 |

This checks the program models and shared counter updates. It does not replace compilation/flashing in the actual editors and hardware.

## Visual review

Landing, desktop reading/build views, Korean/Chinese support, teacher panel and responsive views at 1366×768, 1024×768, 768×1024 and 390×844 were rendered and inspected. The app also rendered at 1440×960. No page-width overflow was detected in the checked build layouts. Primary-button translated labels were adjusted for contrast; the keyboard skip link is visually hidden until focused.

The PDF includes eight stages, explicit unfinished work, images/captions, both language scripts and useful learning history. Navigation-only history is omitted. Short answer blocks are kept together where practical. Direct-export text is image-rendered; the print fallback uses browser text.

## Remaining classroom checks

Use the actual hosted page on school-managed browsers. Confirm real localStorage/resume, copy/paste, camera/photo-picker permissions, JSON downloads/imports, direct PDF and print/save behaviour, and that the downloaded PDF opens correctly. Confirm editor switching, USB/Bluetooth transfer and hardware results. Bilingual wording should be reviewed with a colleague for the local cohort.
