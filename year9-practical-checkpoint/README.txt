YEAR 9 PRACTICAL CHECKPOINT — CREATE A HELPDESK ADVISER

Use with the separate six-page English or English–Mandarin student booklet.
60 minutes; 40 marks: collaborative 28 + individual 12.
Two Main Tasks build ONE program: make a calculator, then create an adviser.
Six cards: 1A ask queue length; 1B include Sam and calculate; 1C personalise
output; 2A ask available time; 2B add if/else advice; 2C choose one upgrade.
References and starter code are permitted without a mark deduction.

ASSESSMENT
Working program 24; two short actual-advice records 2; one useful upgrade 2.
Each student's own change/run 8 and short explanation 4 give 12 individual
marks. Change the service-time constant from 4 to 3; run with inputs 1 and 7.
Restore it to 4 before another student's turn or final download. No extra
written retest. Both advice paths and equality are checked without prediction
tables. Use the private teacher guide for partial credit and permitted support.

PUBLISHING
Keep all public app files and assets together. Host on the school-approved
static web host. Add its HTTPS URL to Microsoft Teams Classwork under the
practical checkpoint's Python Editor resource. This package does not create
or update a Teams module or submission. Create a practical submission separately.
Own device: each student uploads their final .py. Shared device: accept one
named team upload and record receipt for every member. Collect every student's
named booklet. Keep the teacher mark scheme, QA files and tests private.

LOCAL PREVIEW
From this folder run: python3 -m http.server 8795
Open http://127.0.0.1:8795/ on that computer. This is a local preview address,
not a student link for other devices. Runtime assets and fonts are bundled.
A file-opening fallback bundle is included; use HTTP/HTTPS for the classroom.

EDITOR
Starts blank, with an explicit Load starter code button supplying two lines.
Changing Main Tasks, build cards, upgrades or language preserves the same code.
References are readable examples, not automatic edits. Run executes in a
terminable worker. input() asks in the console when reached; answer with Enter
or Send. Stop ends a run, including while waiting for input.
Enter keeps indentation and adds four spaces after a block colon.
Tab/Shift+Tab and visible Indent/Dedent adjust indentation. After an indented
print, Enter then Dedent once allows else: to align with if.
Undo/Redo, .py open and download are provided. No predictive functions,
autocomplete, AI, automatic syntax repair or completed-solution button.

Python uses Skulpt, a Python 3 subset rather than desktop CPython or full IDLE.
Checkpoint input, arithmetic, if/else and print work; not all packages or Python
features are supported. Execution is limited to approximately four seconds
excluding input waits; output to 12,000 characters; code to 20,000 characters.

SAVING AND IPAD
Code saves in the same browser/origin where local storage is available.
Previous v1 work is migrated without deleting the old browser backup. A nonblank
Create program is preferred; otherwise existing Practice code is retained.
Private browsing, cleared storage or another device may lose local work.
Download .py before closing or changing devices. No cloud synchronisation.
For iPad, use Safari if the Teams browser restricts typing or downloads.
Use touch Indent/Dedent and Send. Find .py in Files/Downloads and attach in Teams.
820 px and 390 px layouts were browser-checked. A physical iPad keyboard,
Safari download and Teams attachment check is still needed before class.

LANGUAGES AND ACCESS
English, Mandarin and Bahasa Melayu interface; Python syntax stays unchanged.
One build card at a time, natural console input, brief evidence boxes and an
accessible starter reduce the writing and memory load. Support is available
to everyone. No hidden name-based assessment route or pupil labels.

VERIFICATION (PRIVATE WORKSPACE)
node --test tests/*.test.cjs
Checks cover indentation and safe migration. Browser runs verified calculator,
both advice paths, equality, the individual constant change, all three upgrades,
card/language preservation, reload persistence and Stop while waiting.
All 16 pages of both student booklets and the teacher guide were rendered and
visually inspected; assessment total checked at 40.

MAINTENANCE
After changing python-worker.js or Skulpt libraries run:
node build-python-offline.mjs
Skulpt licence: vendor/LICENSE.txt. Raleway licence: assets/OFL.txt.
