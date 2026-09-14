# Year 8 · Term 1 Week 3 Project
## Smart Badge — Mission 2: Make it remember

A static, English-first lesson app continuing the Week 2 Smart Badge and applying Week 3 Theory on variables. No build step, account system, server-side code or Python runtime is required by the lesson app.

## Open or publish

Extract this ZIP and keep `index.html`, `styles.css`, the four application JavaScript files, `assets/` and `libraries/` together. Open `index.html` in a computer browser, or serve this folder as a static website. Browser policies may restrict scripts, storage or downloads when opening local files.

For students using tablets, publish the folder over HTTPS and share its webpage address. An iPad Files/Quick Look preview is not a reliable way to run a JavaScript lesson. Test your managed devices before the class. GitHub Pages, Netlify, Vercel or an existing school static website can serve the folder without a build command. No deployment or repository change has been performed.

A separate `Year8_Week3_Project.html` is supplied as a single-file edition. It embeds the app's JavaScript, PDF library and school-guide images; it does not contain a testing harness or mock storage. The two editions use the same lesson version and backup format. Moving between file paths/origins may require JSON backup/restore; browser storage is not automatically shared between websites.

Raleway is requested from Google Fonts with system-font fallbacks. The lesson content and PDF library do not depend on that request succeeding. The external coding editors still require their own supported connection/workflow. No font files are bundled.

## Student entry

Enter a name, class, device and coding editor. Single-word names are accepted. Choose English, English + Simplified Chinese, or English + Korean. English remains visible alongside support text, prompts, feedback, sentence frames and glossary definitions. Students can use either language or a mixture in their own answers.

The device is an explicit choice, not a browser guess:

| Device | Lesson coding routes |
| --- | --- |
| iPad / iPhone | MakeCode Blocks or MakeCode Python |
| Windows / Mac / Chromebook | MakeCode Blocks, MakeCode Python or MicroPython |
| Supported Android setup | All three, with device-specific cable/browser guidance |
| Other tablet / not sure | MakeCode Blocks or MakeCode Python; ask the teacher about transfer |

The tablet restriction is a deliberate introductory lesson route, not a claim that every advanced iPad MicroPython workflow is impossible. Official micro:bit guidance differs between pages about newer iPad MicroPython support. This app preserves the reference lesson's MakeCode iPad route; verify any alternative on the actual school devices.

## Teacher mode

Enter `teacher` as the name, then Start. Spaces/capitalization do not matter; the class can be blank. The Teacher mode panel opens above the current activity. It includes a card jump selector, editor preview, answer guidance, teacher notes and per-card override notes. `index.html?teacher=1` pre-fills teacher entry; press Start.

Teacher mode is an instructional convenience, **not secure authentication**. It uses a separate local profile and does not invent student answers or turn an override into a correct response. All student cards are already accessible; missing evidence can be flagged without a hard lock. There is no live class dashboard, remote student monitoring, or automatic teacher notification.

## Exact lesson sequence

1. Read now
2. Do now
3. Types of learning
4. Main task 1
5. Main task 2
6. Extension
7. Learning Pitstop
8. Plenary

Subcards sit inside these eight stages, with one activity card on screen at a time. Report review, PDF export and pack-away are inside Plenary, not a ninth stage. Desktop uses a scrollable left journey/objectives sidebar; smaller screens put it above the activity.

## Approximate 60-minute use

| Stage | Minutes | Evidence / purpose |
| --- | ---: | --- |
| Read now | 3 | Variable name, assignment, changing value and reset |
| Do now | 4 | Three retrieval questions with explanatory feedback |
| Types of learning | 5 | Six matched starting-point K/S/U checks and one focus |
| Main task 1 | 16 | Recover/open Week 2 badge, plan a meaningful variable, build in the selected editor |
| Main task 2 | 18 | Trace, predict/test the core behaviour, transfer, capture and annotate evidence |
| Extension | Within practical time | Improve one input; diagnose a reset bug; justify two useful variables |
| Learning Pitstop | 4 | Revisit the same six statements, compare starting points and choose a next step |
| Plenary | 10 | Independent IPO explanation, transfer question, review/export/submit and pack away |

Extensions use spare practical time. They are optional and excluded from the core progress denominator.

## Programming correctness and lesson boundaries

The core variable starts at 0 and increases by 1 after a deliberate A press. Students retain their welcome icon. At startup the icon is shown, not necessarily the numeric 0. The four ordered output tests are: welcome icon; 1; 3 after two further A presses; 1 after restarting and pressing A once. The trace separately records 0 immediately after restart.

A focus-session counter means pressing A after completing a focus session. It is not an elapsed-time timer. Variables here are runtime state, not automatic permanent storage. The diagram keeps variables within processing rather than treating memory as a separate IPO stage.

MakeCode Blocks: startup assignment, a single A event, change-by-1 and show-number blocks. The block layouts are accessible HTML/CSS teaching guides, not screenshots or an embedded editing workspace. Students build in MakeCode.

MakeCode Python: event handler, `global`, `basic.show_icon`, and `basic.show_number`. No MicroPython imports or display commands are presented as runnable MakeCode Python.

MicroPython: `from microbit import *`, a supplied single listening loop, `button_a.was_pressed()`, `display.scroll`, and initialization outside the loop. Students press slowly and wait for the display, rather than treating the scaffold as a high-speed click counter. Event/loop scaffolding is supplied; independent mastery of event-handler syntax is not the assessment focus.

Students reuse their existing A handler/loop rather than appending a duplicate handler or a second infinite loop. Save a copy first. Extension B-decrease and B-reset are alternative jobs for B, not simultaneous commands. Keep the core tests before testing an extension's new rules.

## Evidence, feedback and progress

The app records variable choices, predictions, quiz checks, the trace, observed tests, transfer status, code/annotations, uploaded images with captions, optional extensions, matched K/S/U reflections and a final explanation. Relevant attempts and revisions are included in the report.

Images: JPEG, PNG or WebP, maximum four. They are resized and converted to JPEG in the browser to control storage. Upload, pasted screenshot, drag/drop and an optional device camera picker are supported. HEIC may need device-side conversion. A written alternative or own-code record is available when an upload cannot be made.

Quiz and trace checks are automatic. Free writing, photographs, user code, physical test claims and K/S/U self-reports require teacher review. The app does not compile or execute student code, connect to a micro:bit, or verify physical flashing. It does not retrieve code from an external editor automatically.

Progress means core evidence fields recorded, not a grade. Wrong answers can be recorded with a review flag. Missing work can be marked for review and continued. Hardware unavailability does not force a false success claim. Changing a device/editor or variable plan marks practical evidence for rechecking instead of silently treating old tests as current.

## Saving, PDF and submission

Work is saved in localStorage in the same browser/device profile. Same-name/class entry can resume work; the last saved profile also has a Resume button. Storage may be cleared or restricted by a browser, private mode, device policy or quota. A visible warning and JSON backup remain available if autosave fails, including on small screens.

Save JSON backup to move devices or preserve editable work. Restore only this lesson's compatible JSON format. The import validates fields and supported image data. Imported names/classes identify the destination profile; restoring the same profile replaces its local copy after a confirmation.

Export PDF generates a report using the locally bundled jsPDF library. Unicode answer text is rendered through the browser's font system to preserve Mandarin/Korean without bundling fonts. Direct-export text is image-rendered, so use **Print / Save as PDF** for browser-generated selectable text where supported. Check any downloaded file before submitting.

Exporting is not submission. Students must upload the PDF to the teacher-identified Week 3 Project assignment in Teams and finish the Teams submission. The app does not invent an assignment name or send files automatically. Save code separately in the coding editor.

Names, responses, photographs and exported files may be personal data. Use school-approved storage/sharing. On a shared device, save a backup before resetting the profile. Reset affects the current lesson profile, not unrelated students' profiles or previous lessons.

## Files

- `index.html`: entry document
- `styles.css`: responsive visual design
- `lesson.js`: lesson data, translations, editor routes, questions and code models
- `views.js`: landing, eight-stage activity views, bilingual helpers and teacher controls
- `app.js`: navigation, storage, checks, evidence, backup/restore and export actions
- `report.js`: report content, direct PDF and print fallback
- `assets/`: two school learning-guide images reused from the supplied reference app
- `libraries/`: jsPDF and its retained license
- `SOURCES.md`: reference and technical provenance
- `TEST_REPORT.md`: completed checks and remaining device checks

## Before class

Test the hosted lesson, actual school iPad/Android/desktop browsers, micro:bit app permissions, USB data cables, Bluetooth transfer, file downloads, image selection and PDF opening. Prepare a simulator-only fallback. For pairs, swap driver/navigator and collect an individual explanation from each student. Review bilingual terminology with a colleague familiar with the cohort.
