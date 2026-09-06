# Year 7 Week 2 Theory — redesigned guided lesson

Open `index.html`, or upload the folder unchanged to the existing static host. No installation, accounts, server or external libraries are required. Do not upload student backups or test data to the public website. The main lesson does not need screenshots or Python.

## Lesson and teacher review

Student: enter name and class. Use the same browser and details to resume.
Teacher: enter `teacher` as the name; no class is required. Every card is available through the stage navigation and card list. This is a review shortcut, NOT authentication. It does not expose a teacher dashboard or other students' work.

The 60-minute lesson includes two school learning pitstops. Tasks use one fictional, single-floor school map: Entrance → Reception (collect timetable) → Library (return book) → junction → C1. It is a planning exercise, not a real school route or permission to leave the classroom. The diagram is drawn from consistent geometry in `map.js`; the inaccurate old illustrations are no longer displayed.

Core evidence: journey sections; useful/unnecessary detail; IPO checks; six student-written pseudocode steps after two model steps; flowchart understanding; peer/self test; reflection. Extension is optional. A reviewed explanation permits progression and is distinguished from independently correct work. Written answers are not keyword-matched or graded automatically. Completion is not mastery.

## Navigation and feedback

Version 4.1 adds visible language/device choices on the welcome page and on every lesson card. Blue labelled panels contain reading; yellow labelled panels contain questions. Scenarios explain who the guide is for and what students will make. The map stays open on route-related cards, beside the work on wide screens and above it on tablets; enlargement is optional. The highlighted starting place changes with the active writing instruction. On a short screen (including many on-screen-keyboard views), the map stops sticking so it cannot cover the writing area.

Each writing card now shows one instruction at a time. Students may insert a sentence starter, replace its ___ gaps, or write their own short answer. Word banks remain visible. A starter cannot overwrite an existing answer. Continue opens the first missing instruction and focuses its field. Only blank answers or unreplaced ___ gaps block written work; spelling, language and specific keywords are not graded. The report records inserted sentence starters separately from final answers. Old saved profiles still use the same storage keys and retain their answers.

Flowchart-symbol samples appear on the worked-example card, before students write their route, and again before the flowchart checks. Input/process/output has a labelled visual example. The generated flowchart is open on its card, and the peer-testing card shows the full written guide. No new required questions or lesson stages were added.

Continue remains clickable. It lists missing answers and takes the student to the first one. Questions are grouped into small expandable checks. Required answers must be attempted; unsupported blank work cannot silently complete a card. Students may correct previous cards. Clearing a required answer removes that card's completion mark. The unlocked route remains available for review.

## Language and devices

Plain English is the default. Optional Chinese and Malay key-word glosses supplement the English definitions, not a full translation of the lesson. Review these terms against school language preferences. Spoken English help depends on the device's available speech service. No student answers are sent to a translation API. The browser may supply its own translation option for selected text.

Touch controls have generous targets; movement questions use selects and buttons, not drag-only gestures. On tablets, short learning statements stay accessible in a sticky expandable panel. The optional photo input accepts images the browser can decode, normally JPG/PNG; unsupported HEIC produces a helpful message. Maximum two compressed photos, 15 MB source limit each.

## Saving, privacy and previous work

Responses are saved to localStorage under a versioned Unicode-safe name/class key. Photos use IndexedDB. No central teacher monitoring or cross-device synchronisation is provided. A shared device profile is not password-protected: students must not open another person's work. Do not use private browsing for work that must be resumed.

The older v3 storage is never removed by this version. If matching old name/class data is found, its answers are preserved separately in the report. Old answers do not auto-complete the new tasks. The original app files have been backed up separately before replacement.

The optional .json lesson backup contains personal details, answers and photos. Keep it private; restore through the landing page or Words & help. Reset asks for confirmation and targets only the active redesigned profile; it leaves older-version storage untouched.

## PDF and Teams

Prepare my PDF creates a real local PDF using bundled html2canvas and jsPDF. Report pages are rendered as high-resolution images, preserving characters supported by the device's fonts (including student names). Consequently the PDF text is not selectable/searchable; the print-friendly fallback may retain selectable text. The app builds pages before capture and includes full question wording, selected answers, attempts, support, pseudocode, flowchart and revisions. Raw click logs remain in the private backup rather than filling the marking PDF.

After preparation, Download requests a file download. Save / share uses native file sharing only where `navigator.canShare({files})` permits it, with a direct student tap. Native sharing normally requires HTTPS. `file://` can be used for lesson work and ordinary export, but some browser features may be restricted. Do not promise that websites can silently save into a specific folder.

iPad: Save / share → Save to Files → choose a folder → Save. If Safari opens the PDF, use Share → Save to Files. Opening a PDF is not saving it. The Google app/in-app browsers may limit sharing; back up before changing browsers, since browser storage is separate.

Teams: class → Assignments → Week 2 Theory → Add work/Attach → select the saved PDF → Turn in. A file in a chat or an attached-but-not-turned-in assignment is not the intended submission. The two checkboxes are student confirmations, not verified Teams status. No re-export is needed after confirming submission.

If export fails: retain the page, retry or open the print-friendly report. On a computer select Save as PDF. On iPad use the print preview's sharing option where available. A private lesson backup is an additional recovery route.

## Validation and deployment checks

Version 4.0.1 fixes a missing closing brace in the school-map script that caused a blank screen immediately after sign-in. The entry page requests fresh script versions without changing the student storage keys. An unexpected card-rendering error now displays a reload message instead of an empty page; recovery does not delete saved work.

Sign-in regression checks also ran with the real bundled React code in a test DOM: student and teacher entry, a non-Latin name, resume, quiz progression, every lesson card, map/word-help dialogs and recovery after a simulated missing map. This is not a physical Safari/iPad test.

Run `node test.cjs` for the regression tests. The development review checks rule logic, component output and handlers without launching a browser. It is not a live Safari/iPad verification. Before classroom deployment, test actual PDF preparation, file sharing, opening a saved file and Teams Turn in on one school iPad and one laptop, including cancellation and retry. Check portrait, landscape, 200% text enlargement, and the on-screen keyboard.

No website publication or Git push is performed by this file update.

## Local libraries

`libraries/react-runtime.js`: React 18 runtime retained from the original app with its embedded licence notices.
`libraries/jspdf.umd.min.js`: jsPDF, retained locally from the school's existing Week 1 app (MIT; licence in file).
`libraries/html2canvas.min.js`: html2canvas, retained locally from the school's existing Week 1 app (MIT; licence in file).

References: https://teachcomputing.org/pedagogy ; https://www.bell-foundation.org.uk/resources/great-ideas/scaffolding/ ; https://support.apple.com/en-ie/guide/ipad/ipade2917f90/ipados ; https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
