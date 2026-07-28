# Mission 0 — Meet the Micro:bit

**Year 8 Computer Science · Term 1, Week 1 · Project Lesson · approx. 60 minutes**

A self-directed, interactive web app that walks a Year 8 class through their first physical-computing
lesson: identifying the parts of a micro:bit, connecting it safely, creating a correctly named project,
building an icon-and-message program, testing it in the simulator, transferring it to the device, and
capturing evidence — finishing with a marking-ready PDF for Microsoft Teams.

This is the **onboarding and first-success** lesson. It deliberately does *not* teach the whole
Smart Badge project; it prepares students for it.

---

## Contents

1. [Quick start](#quick-start)
2. [Hosting it](#hosting-it)
3. [How students use it](#how-students-use-it)
4. [Teacher mode](#teacher-mode)
5. [Lesson structure](#lesson-structure)
6. [How saving works](#how-saving-works)
7. [Backups: export and import](#backups-export-and-import)
8. [PDF export and the print fallback](#pdf-export-and-the-print-fallback)
9. [Resetting progress](#resetting-progress)
10. [The instructional images](#the-instructional-images)
11. [Changing the editor links and other settings](#changing-the-editor-links-and-other-settings)
12. [Browser support and limitations](#browser-support-and-limitations)
13. [Storage limits](#storage-limits)
14. [Privacy](#privacy)
15. [Accessibility](#accessibility)
16. [File structure](#file-structure)
17. [Testing](#testing)

---

## Quick start

1. Extract the ZIP anywhere.
2. Open `index.html`.

That is the whole installation. There is nothing to build, install or configure, and no server,
database, student account or paid API is required.

> **One caveat when opening the file directly.** Some browsers restrict `IndexedDB` on `file://`
> pages. Chrome and Edge are fine; Firefox and Safari can be stricter, and image uploads may fail
> to save. If you plan to have a whole class upload evidence, **host it** (next section) rather
> than opening the file from a USB stick. Everything except image storage works from `file://`
> in all supported browsers.

---

## Hosting it

Copy the whole `year8-t1w1-microbit-onboarding/` folder — keeping the folder structure intact — to any
static host. No server-side code runs, so all of these work:

| Host | What to do |
|---|---|
| **GitHub Pages** | Commit the folder to a repo, then Settings → Pages → deploy from branch. |
| **Netlify** | Drag the folder onto the Netlify drop area. |
| **Vercel** | `vercel deploy` in the folder, or import the repo and set the framework to "Other". |
| **School web server** | Copy the folder into your web root (e.g. `/var/www/html/`) or a subfolder. |
| **SharePoint** | Upload to a document library configured for static hosting, keeping `assets/` and `libraries/` beside `index.html`. |
| **Local / USB** | Open `index.html` directly. See the caveat above. |

Give students the URL. Nothing else needs to be set up.

---

## How students use it

**On the landing page students must enter their full name and their class.** Neither field can be
left blank and the lesson will not start until both are filled in. The name and class then appear in:

- the lesson header, on every screen
- the saved progress record
- the evidence summaries on the review page
- the exported JSON backup
- imported progress
- both the partial and the final PDF
- the PDF filename itself

The PDF is named:

```
Year8_Class_FullName_T1W1_Microbit_Onboarding.pdf
```

for example `Year8_8T_Amara_Osei_T1W1_Microbit_Onboarding.pdf`. Characters that are illegal in a
filename (`/ \ : * ? " < > |`, spaces, accents) are replaced with underscores automatically.

If a student returns to the landing page on the same computer, a blue banner tells them saved work
was found and how far they got. **Entering the same name and class again resumes that work.** Entering
a different name and class starts fresh.

---

## Teacher mode

**Type `teacher` as the full name on the landing page and press Start.** The class field can be left
blank (it defaults to `TEST`).

Teacher mode:

- unlocks every section immediately, with unrestricted navigation
- relaxes required-field validation
- prefills realistic testing data across every section, so PDF and backup output can be checked instantly
- writes to a **separate storage key** (`y8t1w1.teacher.v1`), so it never touches or overwrites student work
- shows a small `TEACHER TEST MODE` chip in the header, and adds a `Generated in TEACHER TEST MODE`
  line to any PDF exported from it

There is deliberately **no checkbox or hint about teacher mode on the student landing page.**

To leave teacher mode, reload the page and enter a normal name.

---

## Lesson structure

| # | Section | Time | Notes |
|---|---|---|---|
| 1 | Student preparation | 4 min | Equipment, filename convention, device/cable numbers, partner |
| 2 | Starter — From Code to a Physical Device | 8 min | Workflow sequencing, safe/unsafe sorting |
| 3 | Main Activity 1 — Micro:bit Onboarding | 17 min | Parts, safe connection, editor, project naming, evidence |
| 4 | Main Activity 2 — Welcome Signal | 25 min | Build, simulate, transfer, compare, evidence |
| 5 | Optional challenge — Button A | extra | **Optional. Never blocks the plenary.** |
| 6 | Plenary — Ready for the Smart Badge Project | 8 min | Six closing questions |
| 7 | Review and export | 3 min | Summary, PDF, backup |

**Progressive unlocking.** Core sections unlock in order. Opening a section never marks it complete —
completion requires meaningful interaction *and* the section's checklist. The pager at the bottom of
every screen names exactly what is still outstanding.

**The optional challenge is genuinely optional.** It unlocks after Main Activity 2 alongside the
plenary, and a student who skips it can still reach the plenary, the review and a fully complete
6-of-6 progress bar.

Progress is shown as *X of 6 core sections complete*; the optional challenge is counted separately
and marked `opt` in the section tabs.

---

## How saving works

Work saves **automatically**, roughly half a second after each change. The header shows the state
at all times:

| Indicator | Meaning |
|---|---|
| `Saving…` (amber dot) | A save is in flight |
| `Saved` (green dot) | Everything is written to this browser |
| `Save failed` (red dot) | Storage is full, or the browser is in private mode |

Two storage mechanisms are used:

- **`localStorage`** — settings, progress metadata, checklist state, every written response, activity
  answers and attempt counts. Small and fast.
- **`IndexedDB`** — uploaded evidence images, which are far too large for `localStorage`.

Because both are per-browser and per-device, **a student must finish on the same computer and the
same browser they started on**, or import a backup (below). Closing the tab, closing the browser or
refreshing the page is safe — progress comes back.

### What happens to an uploaded image

1. The file type is checked (images only) and the size is checked (12 MB maximum).
2. It is resized so its longest edge is at most **1600 px**.
3. It is compressed to JPEG at quality 0.85, on a white background so screenshots stay readable.
4. It is stored in IndexedDB with its caption, timestamp, lesson stage, dimensions and file size.
5. A thumbnail appears immediately, which can be clicked to enlarge.

Every slot supports **replace**, **delete** and a **caption**, and shows the stored size so students
can see the compression worked.

---

## Backups: export and import

Both are on the review page; **Backup progress** is also in the header, on every screen.

**Export** writes one JSON file:

```
Year8_Class_FullName_T1W1_Microbit_Backup.json
```

It contains the lesson identifier, schema version, student name and class, current section, checklist
progress, every response, feedback attempt counts, completion status, extension work, plenary answers,
timestamps, and **every uploaded image as a compressed data URL** with its caption and metadata.

> **Backups containing photos are large** — typically 1–5 MB. The app tells you the size after export
> and warns above 4 MB. They may be too big for some email systems; use OneDrive or Teams instead.

**Import** (review page → *Import JSON backup*):

- asks for confirmation before replacing anything, naming the student in the backup and when it was made
- validates the lesson identifier — a backup from a different lesson is refused
- validates the schema version — a mismatch is refused with the version numbers shown
- restores text responses, checklists, activity answers and completion status
- restores image evidence back into IndexedDB
- reports damaged or invalid files clearly instead of failing silently

This is the supported way to move a student to a different computer.

---

## PDF export and the print fallback

**Students can export a PDF at any time**, not only at the end:

- **Export current progress (PDF)** — in the header, on every screen
- **Export final PDF** — the large button on the review page

Both produce the same document. Unfinished work is **not omitted**: every missing field, checklist item
and evidence slot is printed as `Not completed`, so a partial export is still a useful mark record.

The PDF includes the school and lesson heading, Year 8, Term 1 Week 1, the lesson title, the date,
student name and class, device and cable numbers, editor choice, the Key Topic, WAGBA, Knowledge,
Skills, Understanding, Keywords and Challenge, all starter responses, both main-activity checklists
and evidence images, the expected/simulator/physical comparison, testing and debugging notes, the
optional challenge **only when it was attempted**, the plenary responses, a completion summary and
timestamps. It is A4, uses readable body text, keeps image aspect ratios, breaks pages sensibly,
compresses the evidence images again (to 900 px, quality 0.72) and numbers every page `Page X of Y`
with a footer naming the student.

After exporting, a dialogue reminds students to:

> Upload your completed PDF to the Microsoft Teams Assignment named **Week 1 Project**.

with the four checks — name and class visible, required sections included, PDF actually downloaded,
and uploading the PDF rather than a screenshot.

**Print fallback.** The review page also has *Print / Save as PDF (fallback)*, which expands every
section and calls `window.print()`. Use it if the PDF library ever fails to load. Choose
"Save as PDF" as the printer destination; the print stylesheet hides navigation and buttons, keeps
cards from splitting across pages and prints A4.

The PDF library (**jsPDF 2.5.2**) is bundled in `libraries/` and loaded locally. **No CDN is used**,
so the app works on a filtered or offline school network. Its licence is in
`libraries/jspdf-LICENSE.txt`.

---

## Resetting progress

Review page → **Reset all progress**. A confirmation dialogue names the student and warns that
everything — answers, checklists and uploaded images — will be permanently deleted. Confirming clears
`localStorage`, deletes the images from IndexedDB and reloads the page.

Reset only affects the mode you are in: resetting in teacher mode leaves student work untouched, and
vice versa.

---

## The instructional images

The seven black-and-white instructional diagrams live in:

```
assets/images/1.png … 7.png
```

They are used inline, at the point of instruction — not in a separate gallery:

| File | Used in | Shows |
|---|---|---|
| `1.png` | MA1, Step 1 | The micro:bit and USB cable with parts labelled |
| `2.png` | MA1, Step 2 | Do / do not for the micro USB connector |
| `3.png` | MA1, Step 3 | Opening MakeCode and naming a project |
| `4.png` | MA2, Step 4 | Building the icon and message in blocks |
| `5.png` | MA2, Step 5 | Testing in the simulator |
| `6.png` | MA2, Step 6 | Download and transfer to the MICROBIT drive |
| `7.png` | MA2, Step 7 | Checking the real output on the device |

Every image resizes responsively, keeps its full proportions, opens in a larger modal when clicked,
and carries long descriptive alt text.

**The written instructions are complete on their own.** The images support visual learners; a student
using a screen reader, or working where the images fail to load, loses nothing. If an image is missing,
a hatched panel appears in its place naming the file and confirming the written instructions are
sufficient — no broken-image icon, no layout collapse.

### Replacing the images

Drop new files into `assets/images/` using the same names (`1.png` … `7.png`). Nothing else needs to
change. If you also want to update the captions or alt text, edit the `FIGURES` object near the top
of `app.js` — each entry has a `file`, `title`, `alt` and `cap`.

The supplied images total about 7.4 MB. That is fine for a school server or GitHub Pages, but if your
network is slow you may want to run them through an optimiser such as `pngquant` or Squoosh before
deploying.

---

## Changing the editor links and other settings

Open `app.js`. Everything a teacher is likely to change is in the clearly marked
**`1. CONFIGURATION`** block at the very top:

```js
var EDITOR_LINK_BLOCKS = 'https://makecode.microbit.org/';
var EDITOR_LINK_PYTHON = 'https://python.microbit.org/v/3';

var SCHOOL_HEADING   = 'Computer Science Department';   // appears on the PDF
var TEAMS_ASSIGNMENT = 'Week 1 Project';                // the Teams assignment name

var IMG_MAX_DIM      = 1600;   // longest edge stored, in pixels
var MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
var MIN_TEXT         = 15;     // characters that count as a meaningful answer
```

Both editor links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
Students may choose Blocks or Python; the required outcome is identical, and the app records which
they used.

If you change `SCHEMA_VERSION`, backups made with the old version will be refused on import — only
change it if you have altered the data shape on purpose.

---

## Browser support and limitations

Built with plain HTML, CSS and JavaScript. No framework, no build step, no bundler.

**Supported:** current Chrome, Edge, Firefox and Safari, on Windows, macOS, ChromeOS and iPad.

Known limitations, all inherent to a static browser app:

- **Work is tied to one browser on one device.** There is no server, so a student who moves computers
  must carry a JSON backup. This is by design — no accounts, no data leaving the room.
- **Private / incognito windows** discard everything when the window closes. The save indicator will
  show `Save failed` if storage is blocked; tell students to use a normal window.
- **Clearing browsing data** ("cookies and site data") deletes saved progress. Export a backup or PDF
  before doing this.
- **`file://` restrictions.** Opening `index.html` directly works, but some browsers block IndexedDB
  on local files, which breaks image upload. Host the folder for classroom use.
- **A browser page cannot write into the application folder.** Uploaded images are stored in the
  browser's own database and travel out via the PDF or the JSON backup. Nothing is written back into
  `assets/`, and nothing is uploaded anywhere.
- **Shared computers.** Two students using the same browser profile share one storage slot. The second
  student's entry will start a fresh record and overwrite the first — so the first student must export
  their PDF before handing the machine over.

---

## Storage limits

`localStorage` allows roughly 5 MB per site; this app uses a few tens of kilobytes for text, so it is
not a practical constraint. `IndexedDB` is much larger — typically hundreds of megabytes — and images
are compressed to roughly 150–400 KB each, so the five evidence slots use well under 2 MB.

If storage is full or blocked, the save indicator turns red, a message explains the problem, and no
work is silently lost — the data stays on screen so it can be exported as a PDF.

---

## Privacy

- **Nothing leaves the device.** There is no server, no analytics, no tracking and no third-party
  requests. The only outbound links are the two official micro:bit editors, which students open
  deliberately.
- **Student photos stay in the browser** until the student exports a PDF or JSON backup themselves.
- Photos of the physical micro:bit are the intended evidence. Remind students that **photos should
  show the device, not faces**, and school photography policy applies.
- Because evidence sits in the browser database, **clearing site data on a shared machine at the end
  of the day is good practice** — use the Reset control, or the browser's own clear-data option.
- Exported PDFs and backups contain the student's name, class and photographs. Treat them as you would
  any other piece of assessed pupil work: upload to Teams, do not email them around.

---

## Accessibility

- Every control is reachable and operable by keyboard, with a visible 3 px focus ring.
- **The sequencing activity uses move-up / move-down buttons**, each with a descriptive label. There is
  no drag-and-drop requirement anywhere in the app.
- Every input, textarea and select has an associated `<label>`; every button has a discernible name.
- Status is never conveyed by colour alone — correct/incorrect states also carry a tick or cross, a
  word, or a change of text.
- Validation messages are specific and appear in `role="alert"` regions; the save status and upload
  status are polite live regions.
- Section tabs expose *completed*, *not yet completed* and *locked* to screen readers, and mark the
  current section with `aria-current="step"`.
- All seven diagrams carry long descriptive alt text, and the written instructions stand alone.
- `prefers-reduced-motion` is respected — all transitions are reduced to nothing.
- Layouts are responsive for laptops and tablets in both orientations; below 1080 px the lesson
  information panel collapses into a labelled drawer button, and while closed it is removed from the
  tab order.
- A skip link jumps straight to the main content.

---

## File structure

```
year8-t1w1-microbit-onboarding/
│
├── index.html                  Landing page, app shell, all seven sections, modals
├── styles.css                  Design system, responsive layout, print stylesheet
├── app.js                      All logic. Configuration block is at the top.
├── README.md                   This file
│
├── assets/
│   └── images/
│       ├── 1.png … 7.png       The seven instructional diagrams
│
└── libraries/
    ├── jspdf.umd.min.js        jsPDF 2.5.2, bundled locally — no CDN
    └── jspdf-LICENSE.txt       MIT licence
```

---

## A note for anyone editing the CSS

`styles.css` opens with this rule, and it must stay:

```css
[hidden]{ display:none!important }
```

The `hidden` attribute works only because browsers ship a default
`[hidden] { display: none }` rule — and **any** author `display:` declaration overrides it,
because author styles beat the user-agent stylesheet regardless of specificity. Since this app
sets `display:flex` on `.landing`, `.app` and `.fatal-banner`, and `display:inline-flex` on `.btn`,
removing that guard silently breaks the hidden attribute on all of them: the landing page stops
disappearing, the whole lesson becomes scrollable before a name is entered, and the error banner
shows permanently. Nothing errors — it just looks broken.

`_test/csslint.js` checks for the guard specifically, because a DOM test cannot: jsdom's
`getComputedStyle` does not model this part of the cascade and reports the correct result either way.

---

## Testing

The build was exercised headlessly with a 135-assertion suite covering: full-name and class
validation; the `teacher` entry path and its separate storage key; progressive section unlocking;
the optional challenge never gating the plenary; checklist completion and un-completion logic; image
loading and the missing-image fallback; image upload, replacement, deletion, type and size rejection,
and downscaling to 1600 px; IndexedDB persistence and refresh recovery; JSON backup export, import,
image restoration and the rejection of damaged files, wrong lesson identifiers and wrong schema
versions; partial and final PDF export; the print fallback; PDF filename format and sanitisation of
awkward names; `Not completed` wording for unfinished stages; the Microsoft Teams instruction; reset
confirmation; keyboard labelling and ARIA state; and the absence of runtime errors.

Generated PDFs were verified as genuine A4 documents with correct page numbering, no text cut-off and
no overlapping content.

Responsive layouts are written for 1366 × 768, 1920 × 1080 and tablet landscape and portrait, with
breakpoints at 1180 px, 1080 px, 820 px and 480 px.
