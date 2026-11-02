# Year 9E — explore an app, draw and label, then sketch your own

This is a separate, easier edition of the Year 9T design lesson in the same website folder. It does not replace the Year 9T lesson, its files, its local work or the earlier Year 9E decision-block lesson.

## Entry points

- `9e.html`: student lesson, two Main Tasks, English or English–Mandarin.
- `9e-teacher.html`: private linear teacher dashboard with the actual 9E student preview, contextual speaker notes, both live discussions, separate responses window and 60-minute stage timers.
- `9e-lesson-screen.html`: safe TTA projector; no student names or private records.
- `9e-responses.html`: existing approved teacher authentication, class filter set to 9E.
- `9e-testing-guide.html`: separate iPad, Windows and Mac preparation/testing reference, with a Gallery loading guide and an honest fallback when testing is unavailable.
- `9e-feature-guide.html`: extra-time building extension, Palette catalogue, Canvas/drawing recipe, Help/sound/choice recipes, and small-step AI prompts.

## Two outcomes

Main Task 1: study **one** example. Use a prepared live-testing route, original Gallery picture/description, or the explicitly labelled classroom drawing simulation. On paper Section A draw the sample, label real visible parts, show one action and result, and explain one user benefit. If the app was not run, label the result as a prediction. Record the research route separately. A second example is further challenge.

Main Task 2: keep the student's own topic. Section B shows before an action, after it, and Clear/Reset/Back. Circle the action, add arrows/labels and one benefit. A partner follows the paper plan. Building is placed after the sketch, as an extra-time extension, in the same existing MIT project after exporting an `.aia` backup.

Three KSU starting checks use concrete KS3 language. Both Main Tasks stay in one workspace. The same 60-minute allocation and TTA lesson structure are retained; device setup does not consume a new compulsory lesson stage. Teacher-led discussion can be oral if students need that support.

## Printable resources

`assets/9e/Year9E_Research_Draw_English.pdf` and `assets/9e/Year9E_Research_Draw_English_Mandarin.pdf`: four A3 landscape pages each. Page 1 is Section A, page 2 is Section B, pages 3–4 are explained WAGOLL examples. All new work and examples are labelled 9E. No code-writing response is required in the two core paper tasks.

## Device guidance and limits (official information checked 2 November 2026)

- iPad: official MIT App Inventor Companion, browser and fresh AI Companion connection code. No school phone use is needed.
- Apple-silicon Mac: the App Store listing specifies macOS 12 or later and Apple M1 or later. This is the iOS Companion available on compatible Macs; it needs a physical-device check before class.
- Windows: official 64-bit setup package, administrator-assisted installation and aiStarter/Connect → Emulator. The package is approximately 1.5 GB. Install and test before class.
- Intel Mac: teacher/IT review of the older setup route; no promise of compatibility with modern macOS.
- MIT marks its older emulator instructions “Under Revision: Not Recommended”. The guide makes this visible and gives a picture/demonstration fallback. It does not direct students to bypass device security warnings or install unofficial software.
- The teacher reported Web Test failures. Their cause and component support have not been verified. This edition never relies on Web Test, counts a screenshot as a successful run, or calls the classroom simulation a running MIT project.

References: [MIT emulator setup](https://appinventor.mit.edu/explore/ai2/setup-emulator.html), [Windows setup](https://appinventor.mit.edu/explore/ai2/windows.html), [older Mac setup](https://appinventor.mit.edu/explore/ai2/mac.html), [official Companion listing](https://apps.apple.com/us/app/mit-app-inventor/id1422709355), [MIT component catalogue](https://ai2.appinventor.mit.edu/reference/components/).

The Canvas recipe uses real component/event/method names: Touched → DrawCircle, ClearButton.Click → Canvas.Clear, Dragged → DrawLine with the event's previous/current coordinates, and PaintColor with Colors blocks. Clear keeps a background image. These are labelled block plans, not screenshots. New concept diagrams are labelled as diagrams; existing annotated classroom screenshots are labelled as earlier reference captures.

## Private tracking

The edition reuses the already approved `y9_decisions_*` and live-class APIs for class **9E**, with no schema, authentication or permission changes. It has a separate localStorage key, IndexedDB database, backup kind, lesson-position channel and timing channel from 9T. Evidence uses the existing supported page IDs. Research route/device choice and paper ticks are self-reported, not proof that an app was successfully tested or the teacher saw a drawing. The protected record view makes this explicit. Setup and feature guides do not collect names, logins, AI conversations or other-site activity.

New setup/extension instructions have been reviewed against official documentation. Actual Windows emulator, Intel Mac compatibility and Mac Companion testing still require the school's physical devices. No user software is installed by this change.


### Teacher slide view
The teacher centre shows the same TTA slide as the classroom screen at all 16 positions, including task instructions. Use Previous slide, Next slide or Go to slide below. The right panel names the selected slide and its countdown. Press Start this slide once; a running timer follows navigation automatically. Pausing keeps elapsed time, and returning to a slide keeps its earlier time. Reveal and Replay change the example only. Student responses and the student lesson preview open separately.
