# Year 8 Week 5 Project — Ready or not?

A static, self-directed 60-minute lesson based on the supplied **Year 8 Project Week 5** sketch. Students add a Button B threshold decision to their Smart Badge, test both branches, use feedback and explain their improvements.

## Open and teach

Extract the whole ZIP, then open **index.html**. Keep the assets and vendor folders alongside it. No installation or build step is required. For school use, host this entire folder on GitHub Pages, Netlify, Vercel or an ordinary static web server. Use HTTPS for reliable clipboard features. This package has not been published automatically.

Students enter name, class, language support, device and editor. Their previous MakeCode/MicroPython project is separate and must be saved in that editor. Students may resume browser-saved work or import a JSON backup.

Teacher review: enter **teacher** as the name (class may be blank), or open **index.html?teacher=1**. Teacher and student sessions use separate storage keys. This is a testing convenience, not authentication. Navigation is open for everyone; answers never trap a learner behind a keyword checker.

## Lesson journey

| Stage | Suggested time | Purpose |
|---|---:|---|
| Read first | 6 min | Scenario, if/else reference and three comprehension questions |
| Do Now | 5 min | Predict and compare >= 5 with > 5 at exactly five |
| Types of Learning | 3 min | KSU starting confidence and a specific practice goal |
| Main Task 1 | 15 min | Preserve previous work, add Button B and personalise outputs |
| Main Task 2 | 17 min | Test 4/5/6, get feedback, improve, retest and capture evidence |
| Extension | If time | New boundary, deliberate bug, then sound challenge |
| Learning Pit Stop | 4 min | Evidence-based KSU reflection and learning phase |
| Plenary | 5 min | Retrieval questions and an explanation of improvement |
| Review/PDF | 5 min | Check evidence, export and submit to Teams |

Extension is before the Pit Stop. It fits within spare practical time, not an extra compulsory task. If onboarding takes longer, prioritise a working decision and three test values; retain unfinished work for the next lesson.

## Editor routes

### Tablet app routing update

The landing page suggests iPad/iPhone or Android when detected; students can change this. All coding buttons on these routes now lead to the official **micro:bit** App Store or Google Play listing, not Safari/browser MakeCode. Students use **Open** if installed or install with school permission, then select **Create Code** inside the app. They can also open the installed app directly from its icon. Laptop links remain browser-editor links.

A supported general-purpose deep link into the installed micro:bit app could not be verified for either platform. Therefore this version does not invent a URL scheme, use unreliable install-detection timers, or promise automatic launching. The store is the explicit, verified fallback; managed devices may require teacher/IT help. The web app cannot detect whether installation succeeded. Official iOS instructions: https://support.microbit.org/support/solutions/articles/19000117215-micro-bit-ios-app-creating-and-sending-programs-on-an-apple-ipad-or-iphone

The unclear workspace screenshot has been removed from **Open and protect your project** and replaced by four concrete actions: open the existing project, save a separate copy, test the original features, then record the new name.

- **MakeCode Blocks:** actual screenshots from MakeCode plus explicit toolbox/placement instructions.
- **MakeCode Python:** `basic.show_string`, named button handlers and event registration; suitable for coding in MakeCode on laptop or iPad.
- **MicroPython:** `from microbit import *`, `display.scroll` and button checks in one loop; laptop route.

MakeCode and MicroPython are not interchangeable. Switching the app's guidance does not convert students' programs. Downloaded examples are source files, not directly flashable .hex files. Blocks examples contain JavaScript with explicit instructions for converting it into blocks in a new MakeCode project. Students can instead build directly from the screenshots.

Use a tested USB **data** cable on laptops. On iPad, use the school's approved micro:bit iOS app and pairing workflow. Browser simulation remains valid interim evidence when transfer is blocked. No physical iPad/Bluetooth or micro:bit hardware testing was possible during app development; test the school's equipment before class.

## Evidence and assessment

Responses, quiz feedback, changed answers, completion claims, test results, language/device choices and uploaded images are saved. Status is explicitly **self-reported**, not a mark. A student may record “Needs help” and continue. Teacher review should triangulate code, tests, explanation and a demonstration; ticking completion does not prove mastery.

The teaching model illustrates the rule but does **not** execute or verify student code. Code runs in the linked official editor. Photos are not mandatory: a teacher demonstration plus a written/code explanation is an alternative. Avoid photographing classmates, account details or personal information.

## Saving and backups

IndexedDB stores the session and compressed images on this browser; localStorage is a fallback. Browser clearing, private browsing, storage quotas and school policies may affect persistence. File URLs and hosted URLs have separate storage. Use **Backup** before changing device, browser or hosting address.

The JSON backup includes all responses and compressed image data. **Settings → Import backup** validates the lesson/version and asks before replacement. Reset asks for confirmation. Images: PNG/JPEG/WebP, up to 12 MB input, resized to 1600 px, maximum three on the evidence card. The compressed image limit is approximately 1.5 MB per image. Clipboard access may need HTTPS and user permission; file upload remains available.

## PDF and submission

**Export PDF** works at any stage. It includes identity, consistent WAGBA/KSU, responses, feedback, history, images and unfinished-stage labels. The filename includes name, class and Week5_Project. A locally bundled jsPDF library produces paginated A4 pages. Pages are rendered as images to preserve multilingual text using device fonts; they are not selectable/searchable text. Use the print fallback for a browser-generated text PDF when accessibility requires it.

On Review, **Print / Save as PDF** provides that fallback. Printing must be completed in the browser/OS dialog. The app then explains Downloads/Save to Files and Teams attachment/Turn in. “Week 5 Project” is a generic lesson label: confirm the exact Teams assignment title with the class, since calendar weeks may differ. No Teams access or automatic upload occurs. Submission is a student attestation only.

## Content, assets and accessibility

- `lesson.js`: lesson statements, card content, questions, translations and example programs.
- `app.js`: interaction, storage, evidence and report generation.
- `styles.css`: Raleway, green accents, responsive persistent learning sidebar, focus/print styles.
- `assets/images`: locally captured MakeCode screenshots; click to enlarge. Written alternatives remain available if an image fails.
- `assets/fonts`: local Raleway and its licence.
- `vendor`: local jsPDF and licence; no CDN needed for the lesson app.

Mandarin, Korean and Bahasa Melayu support covers stage directions, sentence frames and vocabulary alongside English. It is a scaffold rather than a complete translation of every assessment question. Teacher review of local language phrasing is recommended. Learning phases describe a current experience, not fixed abilities. Reduced motion, labelled controls and keyboard navigation are supported.

## Safety

Hold boards by edges, insert connectors straight, hold the plug when disconnecting, keep liquids away, wait for flashing to finish, and report damage. Sound requires teacher permission/low volume. V2 has a speaker; V1 requires approved external equipment. No speculative Grove wiring is supplied: consult the exact kit's guide. House points remain a teacher decision.

## Reference checks

- https://makecode.microbit.org/
- https://python.microbit.org/
- https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/
- https://support.microbit.org/support/solutions/articles/19000111744-makecode-python-and-micropython

See TESTING.md for checks and limitations. Developer-only content checks can be run with `node tests/content.cjs`; Node is not required to teach the lesson.

## Live classroom and teaching slides
Open `index.html?teacher=1` and sign in with your approved Supabase teacher account. The original name-based teacher preview remains a local convenience and does not grant classroom controls. Start classroom, Lock navigation, Bring Everyone Here, Unlock / Self-Paced and End classroom use this lesson’s existing plain URL. Students connect anonymously; their names, code, answers and images stay in local storage and exports, not Supabase. Other lessons have independent sessions.

Run `19-year8-week5-project-classroom.sql` in Supabase SQL Editor. Expect `year8_project_classroom_ready = true`. It preserves previous lessons and incorporates the earlier shared-slide allowlists, so steps 17 and 18 need not be run separately first. Avoid rerunning older allowlist scripts afterwards. Publish this updated folder separately to GitHub Pages.

After approved sign-in, **Open teacher presentation** shows 19 TTA-style slides: all 16 cards plus three facts about button events, equality at the threshold, and retesting. Topic, WAGBA, KSU, keywords and challenge appear alongside instructions. Mandarin, Korean and Bahasa Melayu scaffold the stage instructions and fact questions when that support language is selected in the lesson.

Preview slides with Previous/Next or the slide selector. **Bring everyone to this slide** sends just your selected slide; preview changes alone never move students. Close the presentation to send a normal lesson page with the existing classroom button. Students have no presentation menu or slide-navigation controls. Lock prevents closing a shared slide, including with Escape; Unlock permits returning to the lesson. Teacher-directed normal-page moves close the shared slide even while locked. A student still at entry receives the pending slide after starting/resuming their notebook.

Facts 1–3 each have a discussion answer box. Student answers save locally and appear in backup, report review, PDF and print fallback. Teacher discussion notes are separate local answers and are not broadcast. Static presentation files are public GitHub Pages assets; the teacher-only menu is interface visibility, not confidential file storage.

## Circular clock: 2:00–3:00 p.m.
Drag the circular clock to any corner; it snaps there and remembers the choice. Click to expand its activity guide and schedule. Four corner buttons provide a keyboard alternative. The circle shows device time, remaining activity time and the suggested page. Turn off Follow lesson clock for clock-only mode. It never moves students automatically; Open suggested page is an explicit action and respects navigation locks.

The schedule uses Asia/Kuala_Lumpur wall-clock time, repeats daily and works without an active classroom. The nine existing stage allocations still total 60 minutes; the plan splits multi-card stages into smaller guidance blocks. Fact discussions fit within their related blocks, and the extension uses spare practical time. Before 14:00 it counts down to the start; after 15:00 it shows that lesson time has ended.

Run `node tests/classroom.cjs` for classroom bridge, local response/report/restore and clock checks. Live operation still requires the Supabase update and an authenticated teacher test.
