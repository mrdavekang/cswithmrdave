# Year 8 Term 1 Week 2 Theory

## Lesson

**Smart Badge Algorithm and Flowchart**

The app follows this learning spine:

`Smart Badge problem → decomposition → algorithm → flowchart`

It is designed for a 60-minute Year 8 lesson using these school stages:

1. Do Now
2. Types of Learning and How to Get Better
3. Main Task 1 — Learn and See
4. Main Task 2 — Create an A4 Smart Badge flowchart
5. Optional three-level extension
6. Learning Pitstop
7. Plenary
8. Review and PDF export

## Open locally

1. Keep all folders and files together.
2. Open `index.html` in a modern browser.
3. Enter a full name and class.

For the most reliable saving, image upload and PDF behaviour, host the folder or use a simple local web server rather than opening it as a `file://` page.

## GitHub Pages

This folder is suitable for GitHub Pages because it uses only HTML, CSS, JavaScript and local assets.

Upload the complete folder, including:

- `index.html`
- `styles.css`
- `app.js`
- `assets/`
- `libraries/`

In the repository settings, enable GitHub Pages for the branch and folder containing the app.

## Teacher review mode

Enter `teacher` in the Full name field. The class field may be left blank.

Teacher review mode:

- unlocks all lesson stages
- allows unrestricted navigation
- uses a separate saved-progress record
- does not alter student progress

## Saving and resuming

Responses, section completion and the compressed flowchart image are saved in browser local storage. Students must use the same browser and device to resume automatically.

Browser storage is local to the device. Clearing browser data or using private browsing may remove progress.

## Image evidence

Students can:

- choose an image file
- paste a screenshot with `Ctrl+V` or `Cmd+V`
- use the teacher-check alternative if uploading is unavailable

Images are resized and compressed in the browser before saving. They are not uploaded to a server.

## Backup

The Review page includes:

- **Download backup** — creates a JSON file containing responses, completion and compressed evidence
- **Import backup** — restores a valid backup for this lesson

Backup files containing image evidence may be large and should be treated as student work.

## PDF export

The app uses the local copy of `pdf-lib` in `libraries/` to generate the evidence PDF. The filename follows this pattern:

`Year8_Class_FullName_Week2_Theory.pdf`

Students can export partial progress at any time. Unanswered items appear as `Not completed`.

If direct PDF generation is restricted, use **Print / Save as PDF** on the Review page.

## Microsoft Teams

After export, students are instructed to upload the PDF to:

**Week 2 Theory**

## Language support

The landing page offers:

- English
- English + Mandarin Chinese
- English + Bahasa Melayu
- English + Korean

Support is provided at the point of need. English technical terms remain visible so students can use the same vocabulary as the teacher and specification.

## Images

Lesson images are stored in `assets/images/`. The core flowchart model is:

`assets/images/smart_badge_worked_flowchart.svg`

Images include alt text, responsive sizing, click-to-enlarge behaviour and a written-instruction fallback.

## Known limitations

- Work does not automatically move between different devices. Use the JSON backup.
- Private browsing may delete saved progress when the window closes.
- Some managed browsers block automatic downloads; use the print fallback.
- Very restrictive browsers may block clipboard image access. Use **Choose image** instead.
- The app does not send student data to a server.
