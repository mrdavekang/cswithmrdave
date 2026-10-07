YEAR 9 PRACTICAL CHECKPOINT — PYTHON EDITOR

Use with the separate English or English–Mandarin practical booklet.
60 minutes, 40 marks: 28 for collaborative tasks and 12 individual demonstration.
Collaboration is permitted; each student’s records and demonstration are marked.
Two Main Tasks: Explore/modify, then Create/test/improve a helpdesk adviser.

PUBLISHING
Keep all files and folders together. Host this folder on the school-approved
static web host. Add its HTTPS URL to Microsoft Teams Classwork:
Term 1 - Week 9 - Learning Checkpoint Practical > Python Editor.
This package does not create that Teams module or a submission assignment.
Create a practical submission separately. Own device: each student uploads the
final .py. Shared device: accept one named team upload and record receipt for
every member. Each student hands in their own booklet. Keep the teacher mark scheme private.

LOCAL PREVIEW
From this folder run: python3 -m http.server 8795
Open http://127.0.0.1:8795/ on that computer. This localhost address is a
local preview, not a link that students can access from their own devices.
All runtime assets and fonts are bundled; no CDN or account is required.
A file-opening fallback bundle is included, but file:// behaviour has not
been browser-verified here. Use HTTP/HTTPS for the classroom.

EDITOR
Starts blank. Each Main Task has a separate buffer and file name.
Run executes the selected buffer in a terminable worker; Stop ends it.
input() asks inside the console when reached. Answer with Enter or Send.
Enter keeps indentation and adds four spaces after a block colon.
Tab/Shift+Tab or visible Indent/Dedent controls adjust indentation.
Undo/Redo and .py open/download are provided. No predictive functions,
autocomplete, AI, automatic syntax repairs or completed solution button.
The starter code supplies only the constant and input lines. Three Create cards
match paper pages 4-5: inputs, total, advice. Each has a short stop-and-check
reminder. Loading the starter puts the cursor on its last blank line. After
the first print, press Enter, then Dedent, then type else: and press Enter.
No TODO jargon or complete solution.

Python runs through Skulpt, a Python 3 subset rather than desktop CPython
or full IDLE. Core checkpoint input, arithmetic, if/else and print work.
Not all packages or Python features are supported. Execution is limited
to approximately four seconds excluding time waiting for input; output
is limited to 12,000 characters and code to 20,000 characters.

SAVING AND IPAD
Code saves locally in the same browser and origin when storage is available.
Private browsing, storage clearing and another device may lose that work.
Download .py before closing or changing devices. No cloud synchronisation.
Restore the constant to 4 and rerun after EACH individual demonstration, before
the next student and final download. Submission help shows own-device and
shared-device routes; partners confirm one team upload with the teacher.
For iPad, open the Teams editor resource in Safari if the Teams embedded
browser restricts input or downloads. Use touch Indent/Dedent and Send.
Download to Files/Downloads, then attach the .py file in Teams.
Responsive widths 820 px and 390 px were browser-checked. A physical iPad
Safari / on-screen-keyboard / Teams upload check is still needed before class.

LANGUAGES AND ACCESS
English, Mandarin and Bahasa Melayu interface modes; Python stays unchanged.
The paper uses the helpdesk context throughout, with runnable build checkpoints,
short answer frames and discussion prompts. Permitted guides do not reduce marks. Do not use hidden name-based
routes or pupil labels in the assessment; the guides are available to everyone.

VERIFICATION
node --test tests/editor-core.test.cjs
Browser checks: printed sample, sequential natural input with Enter/Send,
both advice paths and equality, autoindent, touch indent/dedent, Stop while
waiting for input, Python error, tab separation, reload recovery, .py download
and reopening. Every page of both student papers and teacher guide was rendered
and visually checked; student totals were checked at 40 marks.

MAINTENANCE
After changing python-worker.js or Skulpt libraries run:
node build-python-offline.mjs
Skulpt licence: vendor/LICENSE.txt. Raleway licence: assets/OFL.txt.
