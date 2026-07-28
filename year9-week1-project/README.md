# Year 9 Computing — Term 1, Week 1: Classroom Help Button

A self-contained web app for one 60-minute KS3 project lesson. Students design a help signal,
build a micro:bit Python program, test it in the simulator, send it to a real micro:bit, get
partner feedback, improve it, and export everything as a PDF for Microsoft Teams.

No server, no database, no accounts, no build step. Plain HTML, CSS and JavaScript.

---

## 1. Files

```
year9-t1w1-help-button/
├── index.html          all lesson sections
├── styles.css          monochrome + yellow theme, responsive layout, print rules
├── app.js              lesson journey, validation, uploads, review (CONFIG at the top)
├── storage.js          IndexedDB saving (with a localStorage fallback)
├── export.js           PDF export (jsPDF) and print-friendly fallback
├── README.md
├── assets/
│   ├── images/
│   │   ├── Image 1.png   connect the micro:bit
│   │   ├── Image 2.png   send your code
│   │   ├── Image 3.png   test the real micro:bit
│   │   └── Image 4.png   disconnect and return the equipment
│   └── icons/            (empty — all icons are CSS/text)
├── libraries/
│   ├── jspdf.umd.min.js  jsPDF 4.2.1, bundled locally (no CDN)
│   └── LICENSE           jsPDF MIT licence
└── student-files/
    └── HelpButton_Starter.py
```

## 2. The four instructional images

The images ship inside `assets/images/` with their original filenames, spaces included.
If you replace them, keep the same names — or change the `src` values in `index.html`.

| File | Where it appears | Alt text |
|---|---|---|
| `Image 1.png` | Main Activity 2, Part A — beside **Connect the micro:bit** | Four-step guide showing how to check, connect and recognise a micro:bit on a laptop. |
| `Image 2.png` | Main Activity 2, Part A — beside **Send your code** | Visual guide showing how to send Python code from the micro:bit editor to a connected micro:bit. |
| `Image 3.png` | Main Activity 2, Part A — beside **Test your real micro:bit** | Visual guide showing how to test buttons A and B and compare the physical micro:bit with the simulator. |
| `Image 4.png` | Before You Finish — Return the Equipment Safely (after the Plenary) | Four-step guide showing how to disconnect a micro:bit safely and return the numbered device and cable. |

Every picture can be clicked (or focused and opened with Enter) to enlarge it.
If a picture fails to load, a written summary of the same steps appears in its place, and the
numbered written steps beside it always stand on their own.

## 3. Opening the app

- **Locally:** double-click `index.html`. Chrome and Edge allow IndexedDB on `file://`, so
  saving works. Firefox restricts storage on `file://` — serve it instead.
- **Local web server (recommended for testing):**
  `python3 -m http.server 8000` in this folder, then open `http://localhost:8000`.

## 4. Hosting

The app is fully static — upload the whole folder as it is.

- **GitHub Pages:** push the folder contents to a repo, Settings → Pages → deploy from branch.
- **Netlify / Vercel:** drag the folder in, or point at the repo. No build command, no output
  directory setting.
- **School web server:** copy the folder into the web root.

Serve over `https://` if you can — the Clipboard API used by the *Copy code* button needs a
secure context (there is a fallback, but it is less reliable).

## 5. How saving works

- Everything is saved on **the student's own computer**. Nothing is uploaded anywhere.
- Answers save automatically about half a second after typing stops, and immediately after an
  upload. The header shows *Saving… / Saved 10:41 / Not saved*.
- The main record and all evidence pictures live in **IndexedDB** (database
  `y9-t1w1-helpbutton`, stores `records` and `images`).
- If IndexedDB is blocked, the app falls back to `localStorage` for the written answers and
  warns the student to download a progress file. Pictures are large and may not fit in
  `localStorage`, so IndexedDB is the supported route.
- Records are keyed by profile: `student` for normal use, `teacher` for the teacher preview.
- Returning to the app on the same computer shows a **Carry on** panel on the front page.

## 6. Evidence pictures

Students can **paste a screenshot** or choose a file — both routes end up in the same place.

- **Pasting:** take a screenshot (Windows: `Win` + `Shift` + `S`; Mac: `⌘` + `Shift` + `4`,
  or add `Ctrl` to copy instead of saving to the desktop), then press `Ctrl` + `V`
  (`⌘` + `V`). It lands in the uploader on the page; if the page has more than one, students
  click the box first — it turns yellow and says *Ready — press Ctrl + V to paste*. A short
  message confirms which box received it.
- The **Paste a screenshot** button reads the clipboard directly where the browser allows it
  (Chrome and Edge over https), and otherwise tells the student to press `Ctrl` + `V`.
- Pasting an image while typing in an answer box still sends the picture to the uploader;
  pasting text into an answer box behaves normally.
- Pasted screenshots are recorded with `pasted: true` in the saved data, so you can see which
  evidence was pasted and which was uploaded.

- PNG, JPG and JPEG only. Anything else is refused with a plain-English message.
- Pictures are resized in the browser before storage: longest side about 1600 px.
  Photographs are saved as JPEG at quality 0.8; screenshots stay PNG so the text stays
  readable (a very large PNG falls back to JPEG at 0.85).
- Each picture shows a preview, an editable label, and Replace / Remove buttons.
- Two uploads are required — the Part C simulator screenshot and the Part C improvement
  evidence in Main Activity 2. The rest are optional.
- Pictures survive a refresh, appear in the final review, and are embedded in the PDF.

## 7. Progress file (JSON) export and import

- **Download progress file** (Final Review page) writes
  `Year9_Class_Name_T1W1_HelpButton_Progress.json`, e.g.
  `Year9_9T_DavidKang_T1W1_HelpButton_Progress.json`.
  It contains the student's details, every answer, section completion, timestamps, the current
  section, and all evidence pictures as data URLs.
- **Load progress file** (front page or Final Review) checks the file really is a Week 1
  Classroom Help Button file, shows the name, class, save date and picture count, and asks for
  confirmation before replacing the work on that computer. Pictures and progress are restored.
- A file over about 8 MB triggers a warning that it is large because it holds many pictures.
- The file never leaves the computer.

## 8. PDF export

- **Export my work as a PDF** builds the document in the browser with the bundled jsPDF and
  downloads `Year9_Class_Name_T1W1_HelpButton.pdf`, e.g.
  `Year9_9T_DavidKang_T1W1_HelpButton.pdf`.
- Contents: school-style heading, date, name, class, Key Topic, WAGBA, Knowledge, Skills,
  Understanding, Keywords, Challenge, then every section's answers, the uploaded pictures,
  the extension (only if attempted) and a completion summary. Every page is footed with the
  student's name and class and a page number.
- Pictures keep their proportions (maximum 150 mm wide, 105 mm tall) and move to the next page
  rather than being cut off.
- After a successful export the **Submit Your Work** panel appears with the Teams checklist.
- **Print / save as PDF (backup)** builds a print-friendly version of the same content and
  calls `window.print()`. Use it if the main export ever fails.

## 9. Changing the micro:bit Python Editor link

One place only — the top of `app.js`:

```js
var CONFIG = {
  MICROBIT_EDITOR_URL: "https://python.microbit.org/v/3",
  ...
```

Both **Open the micro:bit Python Editor** buttons (Main 1 Part B and Main 2 Part C) use it.
The address was checked against the Micro:bit Educational Foundation's current editor (V3).

## 10. Teacher preview (not shown to students)

Type **teacher** (any capitalisation) as the full name on the front page and press Start.
The class box may be left blank; it is filled in as *Teacher Preview*.

The teacher preview:

- unlocks every section immediately, in any order
- relaxes the required-answer checks, so Next never blocks
- allows the Final Review and the PDF export to be previewed
- saves under its own key (`teacher`), so it never touches student work

There is deliberately no visible button or hint for this in the student interface.

**Clearing teacher-preview data only:** open the app, enter `teacher`, then use *Reset
progress* and confirm. That deletes the `teacher` record and its pictures and leaves the
student record untouched. (From DevTools you can also delete just the `teacher` key from the
`records` store.)

## 11. Resetting student progress

*Reset progress* in the header or at the foot of the Final Review. It asks for confirmation,
warns that everything will be deleted, and suggests downloading a progress file first. It
clears only the profile currently in use.

## 12. Known limitations

- **Storage is per browser, per computer.** A different laptop, a different browser, or a
  cleared browsing history means the work is gone. Students moving computers should use the
  progress file.
- **Private / incognito windows** discard storage when the window closes.
- **Firefox on `file://`** blocks IndexedDB; host the app or use Chrome/Edge locally.
- Browsers usually allow well over 100 MB per site, but a very large number of full-resolution
  photographs can still hit a quota. The app reports a clear message and the answers are kept.
- The PDF uses the standard PDF fonts, so a few typographic characters (curly quotes, dashes)
  are converted to plain equivalents. Emoji in student answers will not appear in the PDF.
- There is no built-in Python interpreter — that is deliberate. Students use the official
  micro:bit Python Editor and its simulator in a second tab.

## 13. Recommended browsers

Chrome or Edge (current versions) on Windows school laptops; Safari 16+ and Firefox 115+ also
work when the app is served over http(s). Designed for 1366 × 768 upwards, and usable on
tablets in both orientations — the lesson information panel collapses into a tap-to-open
summary below 1000 px wide.

## 14. Accessibility

Keyboard navigation throughout, visible focus outlines, labels on every field, colour never
used as the only signal (ticks, locks and words carry the meaning too), descriptive alt text
plus written fallbacks for the four guide pictures, `aria-live` messages for saving and upload
results, and `prefers-reduced-motion` support.
