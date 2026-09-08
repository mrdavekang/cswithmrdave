# Year 8 · Term 1 Week 2 Project

## Smart Badge — Mission 1 (redesigned September 2026)

A static, one-card-at-a-time lesson. Students build a welcome icon and a Button A response, then test, explain and preserve evidence. There is no server, account system or build step for this lesson.

### Open or host

1. Extract the ZIP, retaining its folders.
2. Open `index.html` on a computer, or publish the folder to the existing school static site.
3. For GitHub Pages, keep these files together inside `year8-week2-project/`. With the repository’s existing Pages branch/folder deployment, the route is `…/year8-week2-project/`.
4. Commit/push using the school’s normal process when ready. This redesign does not publish or change Pages settings itself.

The existing repository also has unrelated framework starter folders (`app/`, `db/`, `worker/`, configuration and build files). They are not used by this static lesson and have been left unchanged. Do not configure a Next/Vinext build to serve this lesson. On Netlify/Vercel, use a static deployment with no build command and this folder as the publish directory.

Prefer HTTPS hosting for classroom iPads. Files opened through iPad Files/preview may not run JavaScript normally. Local-file storage and clipboard permissions also vary by managed browser. No guarantee of offline operation is made for the external editors.

### Student and teacher entry

- Students enter full name, class and support language, then select Start. Both name and class are required, but there is no inflexible two-word-name rule.
- Existing version 3 work can be resumed from the landing page or by using the same name and class.
- Enter `teacher` as the name to unlock all cards. Class may be blank. Teacher mode has separate storage and starts with sample device/editor choices, not fake learning results.
- `index.html?teacher=1` is an alternative hidden route. It pre-fills the entry fields; press Start.
- There are no teacher controls advertised in the student interface. This is a convenience route, not a secure authentication system.

### Lesson spine and approximate 60-minute use

| Time | Stage | What students do |
|---|---|---|
| 0–4 min | Do Now | Read the badge example; predict the A response. |
| 4–6 min | Types of learning / how to get better | Select one useful knowledge, skill or understanding strategy. |
| 6–20 min | Main Task 1 | Choose the correct route; run a tiny working model; choose an icon and initials. |
| 20–48 min | Main Task 2 | Add the A response; test restart and A; transfer; capture evidence. |
| 48–51 min | Learning Pitstop | Choose a current phase, cite a test and identify the next move. |
| 51–56 min | Plenary | Explain the event using the student’s program; predict a change. |
| 56–60 min | Review, submission and pack away | Save PDF/backup, submit to Teams, return equipment. |

The 12 core cards sit inside these stages; they are not 12 separate worksheets. Only one card is rendered at a time. Picture guides, full code explanations and the report expand on request. A little vertical scrolling is intentionally allowed for larger text, translations and code rather than clipping content to an exam-sized viewport.

Optional extensions open at the evidence card. Students choose Level 1 (another button event), Level 2 (diagnose a misplaced instruction, using A4 paper if helpful), or Level 3 (user test and improvement). After one, they can choose another. Extensions never block the pitstop or plenary. Budget 5–15 minutes from the practical window for early finishers; do not add all extension time on top of 60 minutes.

### Device and code routes

- **iPad + MakeCode Blocks:** micro:bit iOS app → Create Code → MakeCode Blocks. Physical transfer is via Bluetooth/app prompts.
- **iPad + MakeCode Python:** the same app/editor, then the menu beside JavaScript → Python. Uses `basic.show_icon`, `basic.show_string` and button-event functions.
- **Laptop + MakeCode Blocks/Python:** the same lesson outcome, using a USB data cable or supported browser pairing.
- **Laptop + MicroPython:** an optional separate Python editor. Uses `from microbit import *`, `display.show` and a supplied button-listening loop. The loop is explained as provided scaffolding; writing selection/loops independently is not a Week 2 success criterion.

MicroPython is deliberately not offered as the iPad route in this introductory lesson. This is a teaching simplification, not a claim that every advanced MicroPython/iPad transfer workflow is impossible.

The iPad transfer card links to current official guidance. The MakeCode app can prompt for Bluetooth mode for each transfer. The official guide describes triple reset or the A+B/reset alternative; follow the current app prompt. Browser-to-app handoff is documented for Chrome, not Safari. If a micro:bit previously ran MicroPython, a teacher may need to load a fresh MakeCode program from a computer before it will pair reliably.

Editor URLs are constants in `lesson.js` (`LINKS`). Instructions say exactly which editor area to use. Code is never entered into a lesson response box. A full small working model is intentional: students first experience success, then personalise, test and explain it.

### Before class

1. Test the school iPad app, Bluetooth permissions, battery packs and transfer on the actual managed devices. Use numbered devices and avoid pairing to a neighbour’s board.
2. Prepare fresh MakeCode programs on boards that previously used MicroPython, if pairing needs this.
3. Test laptop USB data cables. Prepare spares and a simulator-only contingency.
4. Provide A4 paper for extensions. Agree pair roles; swap after the first successful run.
5. Prepare the Teams Assignment **Week 2 Project**.
6. Demonstrate one tab/app switch and a single simulator test to the class. For first-time users, offer Blocks as the default starting route.
7. Remind students: dry table; hold board edges; insert the micro USB plug straight into the top port; do not pull the wire; do not interrupt transfer; report heat or damage; do not wear a bare board against skin.

### Assessment, progression and avoiding lockouts

- The starter and plenary each have one concept check, with specific feedback and another attempt available. Incorrect answers do not lock navigation.
- Free writing is saved for teacher review; there are no required keywords or minimum essay lengths. Short bilingual explanations are allowed.
- Continue points out missing evidence. Students can explicitly choose **Continue — mark for review**. This records an incomplete/needs-review status, not a fabricated pass.
- Opening a card is not completion. Editing an answer invalidates that card’s previous recorded status and any stale automatic feedback.
- Changing the device, editor or badge choices clears relevant current test selections, preserving the previous results in the history. Students are asked to retest.
- Hardware failure is separate from conceptual misunderstanding. A simulator-only or support-needed outcome is recorded honestly.
- Teachers assess the two observed behaviours, the student’s explanation, the change/test record and images/live demonstration. “Recorded” is not a mastery certificate.

### Language and accessibility

Entry offers English, English + Simplified Chinese, English + Korean, and English + Bahasa Melayu. Bilingual task support appears on every card and the two concept checks have translated explanations. The compact header language button and glossary remain available. These are authored classroom supports, not a live translation service; review wording with bilingual staff where possible. Code and official editor names stay unchanged.

The interface uses local Raleway (OFL licence included) with system fallbacks for CJK glyphs, labelled controls, native keyboard-operable choices/dialogs, visible focus, 44px touch controls, reduced-motion support and responsive layouts. KSU stays available through a small sticky-header button. No timed exam restrictions or inaccessible drag-and-drop are used.

### Saving, evidence and privacy

- Lightweight answers/history use `localStorage`; images use `IndexedDB`.
- Storage keys start `y8w2project.v3.`. Student profiles are separated by normalised name/class. Teacher storage uses a separate key.
- The old `y8-w2-project-student` / teacher storage is not deleted. Matching old text/checks are preserved as a labelled legacy appendix when a new profile starts. Old images remain in their old browser keys; use the old app/backup if you need those image records.
- Uploaded or pasted PNG/JPEG/WebP images up to 12 MB are resized to a maximum 1600px and saved as compressed JPEG. Check that code remains readable. HEIC/SVG files are not accepted; use screenshots or JPEG export.
- Captions, timestamps, responses, revised answers, concept-check attempts and submitted snapshots are retained. The app records learning inputs, not every keystroke or unrelated browsing.
- If storage fails, a visible warning replaces “Saved”. Evidence may survive only for the current tab; download a backup immediately.
- Paste uses the Clipboard API where permitted, with a keyboard-paste area and file-upload alternative. iPad/browser policies may prevent direct clipboard image access.
- No uploaded images or responses are sent to a server by the lesson. External editor links have their own service/privacy policies. Do not include faces, full names in badge output, passwords or other students’ private information in evidence.
- Same-browser storage is not encrypted or access-controlled. On shared devices, the school must manage sign-out/clearing and retention. A different browser, different hosting origin or cleared browser data will not share this progress.

### Backup and restore

Lesson menu → **Download progress backup** creates one JSON file containing lesson/version, student details, latest responses, history, statuses and the compressed image data. Keep the file private. This is the portable restore mechanism; a PDF cannot restore editable progress.

Use **Restore backup** on entry or in the menu. Lesson/version and image formats are validated, and confirmation is required before replacing that profile. Images are written into a new evidence session before the current profile is replaced. Wrong-lesson, damaged and oversized backups are rejected without replacing the current profile.

Reset requires confirmation and affects the active version 3 profile, not every student or the old app’s storage. A saved JSON backup can restore it. If browser storage itself is failing, deletion cannot always be confirmed; use managed browser controls for secure cleanup.

### PDF and Teams

Lesson menu → **Export current progress as PDF** works at any point; the review card also has a prominent export button. The app prepares a full print report, including unfinished stages, objectives, student details, answers, earlier attempts/corrections and image evidence.

The PDF method is the browser’s print engine (`window.print()`): choose **Save as PDF**. It supports Unicode text and avoids a CDN/PDF font dependency. On iPad, use the print preview/share options to save to Files. The ordinary browser Print command is also a fallback after entering the lesson.

Suggested filename: `Year8_Class_Full_Name_T1W2_Project.pdf`. The app sets the document title, but the final filename/location is controlled by the browser and must be checked. For page numbering, enable the browser’s print headers/footers if offered. A4 print styling uses readable fonts and flowing text; verify the print preview before saving, particularly for unusually long answers.

After export is requested, the app instructs students to upload the **PDF** to **Week 2 Project** in Microsoft Teams. The app cannot confirm that a PDF was saved or upload it to Teams automatically. It never reports an unverified download as successful.

### Files and images

- `index.html`: landing page and small app shell.
- `styles.css`: monochrome-first layout and print styles.
- `lesson.js`: learning intentions, card spine, route-specific examples, languages, progress/backup rules.
- `views.js`: focused card content and complete evidence-report template.
- `app.js`: navigation, entry, saving, evidence, import/export and feedback.
- `assets/`: existing artwork, school learning posters and local font.
- `tests/lesson-regression.cjs`: non-browser regression tests (optional developer tool; not needed by students).
- `DESIGN_REVIEW.md`: post-redesign pedagogical review and classroom checks.

Reused on screen: the badge scenario, the optional simulator-actions illustration and the two school learning posters. The remaining older images are retained as source assets, not displayed. In particular, the old transfer picture appears to depict a full-sized USB connector at the board; it is not used for safety instruction. The old multi-stage planning pictures and mixed-Python image are not put back into the focused cards.

### Verification and remaining checks

The bundled tests exercise state transitions, entry validation, teacher separation, saving, restore, invalid-backup protection, optional extensions, card markup, input/report coverage, safe escaping, language coverage and print-report preparation. They also parse all Python examples and exercise MakeCode event behaviour against API stubs.

These are **not** a browser, actual MakeCode compiler or hardware test. Browser navigation was restricted during this work, so no screenshot-based viewport, real clipboard, physical iPad/Bluetooth or print-pagination test is claimed. Before class, manually check 1366×768, 1920×1080, tablet landscape and portrait; keyboard navigation; a real uploaded/pasted screenshot; refresh; backup restore; and PDF preview on the managed devices.

### Sources consulted

- [MakeCode name badge project](https://makecode.microbit.org/projects/name-badge) — small steps, placement instructions and simulator testing.
- [MakeCode button events](https://makecode.microbit.org/reference/input/on-button-pressed) — event behaviour and simulator buttons.
- [MakeCode Python and MicroPython](https://support.microbit.org/support/solutions/articles/19000111744-makecode-python-and-micropython) — separate dialects/editors.
- [micro:bit iPad/iPhone app guidance](https://support.microbit.org/support/solutions/articles/19000117215-micro-bit-ios-app-creating-and-sending-programs-on-an-apple-ipad-or-iphone) — app, Bluetooth and browser-to-app handoff.
- [micro:bit mobile guide](https://microbit.org/get-started/user-guide/mobile/) — device route and troubleshooting.
- [Raspberry Pi Foundation: Explore, Design, Invent](https://www.raspberrypi.org/blog/free-coding-resources-children-young-people-digital-making-independence/) — scaffolded progression towards independent decisions.

The app is not affiliated with CAT4, Testwise, Khan Academy or Raspberry Pi. Its design borrows the general principle of focused steps, not proprietary assessment screens or a claim of equivalent measured effectiveness.
