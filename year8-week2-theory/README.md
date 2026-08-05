# Year 8 Term 1 Week 2 Theory Web App

## Lesson

**Planning a Smart Badge: Algorithms, Decomposition and Flowcharts**

This is a self-contained static lesson for a 60-minute Year 8 Computer Science theory lesson. It includes the starter, two main activities, an optional extension, a plenary, a final evidence review and PDF export.

## Open the app

1. Extract the ZIP before opening the lesson.
2. Open `index.html` in a current version of Microsoft Edge, Google Chrome, Firefox or Safari.
3. Students enter their full name and class, then select **Begin lesson**.

For the most reliable saving and file-upload behaviour, host the whole folder on a school web server, GitHub Pages, Netlify or Vercel. The app does not need a database or student account.

## Teacher review mode

Enter `teacher` in the **Full name** box. The class can be left blank.

All lesson pages will be unlocked and completion checks will be relaxed. Teacher review work is saved separately from student work. Remove or reset this progress before demonstrating student entry on the same browser.

## Student progress and evidence

- Answers are saved automatically in the browser.
- Uploaded screenshots are resized and stored in the browser with the lesson data.
- Evidence can be chosen as an image file or pasted directly from the clipboard. If the paste button is restricted, students can focus the dashed paste area and press `Ctrl+V` or `Command+V`.
- Students returning on the same browser and device can resume by entering the same full name and class.
- The header displays **Saving…**, **Saved** or a save warning.
- **Reset progress** asks for confirmation before deleting the current student's saved lesson.

Browser storage is local to the device and browser profile. Clearing browsing data, using a private window or changing device can remove access to saved progress.

## Backup and restore

The review page includes **Download backup** and **Import backup**.

The JSON backup contains the student's lesson responses, completion information and compressed evidence images. A student can save this file and import it on another device. Importing a backup replaces the current lesson state after confirmation.

This revised lesson uses backup schema version 2. Backups from the earlier single-check version are intentionally rejected because the staged-reading and individual-question checks use a different evidence structure.

Because backups can contain student names, class details and photographs, store and share them according to the school's privacy rules.

## PDF evidence report

Students can select **Export progress** at any time or **Download full evidence PDF** on the review page. The PDF contains:

- student name and class;
- the Week 2 learning information;
- all recorded core-task answers;
- automatically checked results;
- uploaded screenshots and captions;
- extension work when attempted;
- plenary answers; and
- a completed/not-completed summary for each lesson stage.

The filename follows:

`Year8_Class_FullName_Week2_Theory.pdf`

After export, the app displays the instruction to upload the PDF to the Microsoft Teams assignment named **Week 2 Theory**.

If direct PDF downloading is restricted, use **Print-friendly fallback** and choose **Save as PDF** in the browser print window.

## Images

The eight lesson visuals are stored in `assets/images/` and are positioned beside the relevant reading or task:

1. literal computer starter;
2. algorithm and program;
3. decomposition;
4. input–process–output;
5. flowchart symbol guide;
6. digital doorbell flowchart;
7. automatic light flowchart; and
8. Smart Badge mission.

Images 2–8 have PNG and SVG versions. The lesson uses SVG for sharp scaling and keeps PNG copies as convenient replacements. Image 1 is supplied as PNG. Keep filenames unchanged when replacing an image.

## Hosting

Upload the entire folder without changing its internal structure. `index.html`, `styles.css`, `app.js`, `assets/` and `libraries/` must remain together.

The PDF library is included locally in `libraries/pdf-lib.min.js`; the lesson does not rely on a CDN or paid service.

## Known limitations

- Browser storage is not a central teacher database and does not synchronise automatically between devices.
- Very restrictive school browser settings may block downloads, local file storage or printing.
- Opening the lesson directly from a shared network drive can result in inconsistent browser permissions; static hosting is preferred.
- Students should avoid uploading unrelated or sensitive photographs.
- Raleway is used when installed on the device; Arial is the built-in fallback so the app remains fully offline.
