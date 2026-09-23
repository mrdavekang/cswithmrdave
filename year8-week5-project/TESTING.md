# Verification — 23 September 2026

## Tablet routing revision

- Browser-checked iPad selection: coding action links to the official App Store listing and explains Open/Get → Create Code.
- Browser-checked Android selection: action links to Google Play package com.samsung.microbit.
- Verified the setup card has no image and now displays four actionable instructions.
- Automated assertions cover both store routes and unchanged laptop editor links. Syntax/content tests pass.
- No native app launch or app-store installation was performed; no verified generic app deep link is claimed. Store handoff depends on device/browser/MDM policy.

## Passed

- JavaScript syntax checks for application and lesson data.
- Automated lesson checks: unique cards, nine stage ordering, extension before Pit Stop, quiz answer indexes, language scaffold coverage and local asset presence.
- Executed the JavaScript examples with simulated micro:bit APIs: startup heart, original A initials, B outputs for 4/5/6, deliberate `> 5` error at five and both sound branches.
- Entered the complete MakeCode Python reference in the official editor and converted it successfully to Blocks. Verified the editor's Python conversion of both tone calls.
- Browser walkthrough of all 16 cards, from reading through review, with no console errors captured.
- Name/class entry and start transition; a normal blank entry was rejected. Teacher entry with a blank class succeeded and used separate saved work.
- Incorrect and unanswered quiz responses did not prevent continuation; explanatory feedback appeared below questions.
- Draft predictions and actual observations survived refresh and Resume.
- Mandarin and Korean stage support displayed; iPad choice displayed MakeCode Python placement instructions and the appropriate transfer caveat.
- Uploaded a code screenshot, added a caption and multilingual explanation, exported a JSON backup, then imported it and observed restored text/image evidence.
- Generated partial A4 PDF reports; inspected rendered pages for readable text, images, unfinished-stage labels and completion summary. Tested download filenames and the post-export Teams guidance modal.
- Responsive DOM checks at 1366×768, 1920×1080, 1024×768 and 768×1024 found no horizontal document overflow. Also inspected the compact 956×720 browser layout.
- Reviewed alt text, image fallback, confirmation and print handlers in the source.

## Not verified on physical equipment

- iPad Safari, Bluetooth pairing/transfer and school device restrictions.
- Physical micro:bit button/speaker behavior or specific Grove accessories.
- Operating-system Print → Save PDF dialog, every browser's clipboard permission/paste path, and assistive-technology testing.
- School Teams assignment titles, actual submission or live hosting. No publishing was requested/performed.

## Learning-experience review

- One consistent badge scenario reduces context switching. The comparison at exactly five exposes the key misconception without a lengthy planning form.
- Worked blocks/Python examples are followed by personalisation, boundary testing and feedback-based improvement. Students must explain evidence, not merely copy code.
- WAGBA/KSU remain visible in the desktop rail. On narrower screens the layout adapts; longer cards may still require some scrolling, especially with language scaffolds enabled.
- Open navigation and honest help/pending statuses avoid brittle answer gates. Teachers must review self-reported completion against evidence.
- The three comprehension questions, three build-brief questions and plenary are intentionally short. Practical time, rather than more written planning, is the main learning activity.
- The extension offers increasing depth, including sound, without blocking the Pit Stop or plenary.
- Translations are support scaffolds, not complete translations. Have a fluent colleague check local phrasing before broad rollout.

Run `node tests/content.cjs` for the repeatable content checks. No runtime tooling is required by students.

## Classroom additions
- Existing content/route/example tests passed unchanged.
- Bridge tests passed 16 normal cards, 19 shared slides, anonymous info, pending delivery, teacher-name privilege separation, lock/remote navigation, local fact responses, report inclusion and backup validation.
- Clock tests passed the 14:00–15:00 Malaysia schedule and every boundary.
- PostgreSQL-compatible tests passed all 35 destinations, rejected invalid IDs and anonymous/other-teacher control attempts, repeat migration and previous-lesson compatibility.
- Browser checked pending fact delivery after entry, Korean support, saved responses after reopening, report evidence, locked Escape/close, hidden student slide menu, teacher send UI in a local harness, 900px slide layout without horizontal overflow, and clock corner selection.
- Live Supabase sharing and GitHub deployment remain pending. Hardware and external editor restrictions above are unchanged.
