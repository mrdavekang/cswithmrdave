# Year 8 Week 1 Theory — Redesigned Web App

## Lesson

**Computer Science Foundations: algorithms, programs, IPO and productive learning habits**

This is a static, self-directed lesson for Year 8. It includes:

- a short diagnostic starter;
- explicit teaching and a worked IPO example;
- immediate feedback beside each checked question;
- Algorithm Rescue application tasks;
- a three-level optional extension ladder;
- exact instructions for the Level 3 A4 paper design;
- a vocabulary drawer with Plain English, Bahasa Melayu and Simplified Chinese support;
- browser-based progress saving;
- A4 photograph upload, drag-and-drop and clipboard paste;
- a complete evidence review;
- direct PDF export and a print-friendly fallback.

## Open locally

1. Extract the complete folder.
2. Keep `index.html`, `styles.css`, `app.js`, `assets` and `libraries` together.
3. Open `index.html` in a modern browser.

For the most reliable clipboard and download behaviour, use static hosting or a local web server rather than opening the file directly.

## Student entry

Open:

```text
index.html
```

Students enter their full name and class. The landing page is hidden after the lesson begins.

## Teacher testing

Either:

- open `index.html?teacher=1`, or
- enter `teacher` as the full name.

Teacher mode uses separate saved progress, unlocks all lesson sections and relaxes completion gates. No teacher controls are shown in the normal student interface.

## Saving and privacy

Progress and the compressed A4 evidence image are saved in the browser on the current device. They are not uploaded to a server.

Students should use the same device and browser when returning to the lesson. Clearing browser data removes saved work. Uploaded photographs should contain lesson evidence only and should not include other students or unnecessary personal information.

If browser storage becomes full, the app displays a warning. Export a PDF before clearing any data.

## A4 paper evidence

Level 3 tells students to:

1. write their name, class and lesson title;
2. turn the A4 sheet to landscape;
3. divide it into six labelled sections;
4. complete the chosen system design;
5. photograph the whole page clearly;
6. upload, drag or paste the image into the app.

Images are resized and compressed before being stored.

## PDF export

The local `libraries/pdf-lib.min.js` file provides direct PDF export without a CDN. The PDF includes:

- student and lesson information;
- WAGBA, KSU, keywords and challenge;
- all current answers;
- automatic-check summaries;
- teacher-review responses;
- optional extension work;
- the A4 photograph when submitted;
- plenary evidence;
- completion states;
- the Microsoft Teams submission reminder.

Filename format:

```text
Year8_Class_FullName_Week1_Theory.pdf
```

If direct PDF export is blocked, use **Print-friendly fallback** and select **Save as PDF** in the browser print window.

## GitHub Pages

This app can run on GitHub Pages because it uses only HTML, CSS, JavaScript and local assets.

1. Copy the entire folder into the repository.
2. Commit and push every file, including `assets` and `libraries`.
3. In the repository settings, enable GitHub Pages for the required branch and folder.
4. Open the published `index.html` route.

Do not move the images or PDF library without also updating their paths in the HTML, CSS or JavaScript.

## Replacing lesson images

Images are stored in:

```text
assets/images/
```

The revised Algorithm Rescue image is:

```text
algorithm-rescue-ipo-scenario.png
```

Use the same filename to replace an image without changing code. Preserve the image proportions and keep instructional text out of the image wherever possible.

## Browser notes

- Current versions of Chrome, Edge, Firefox and Safari are recommended.
- Clipboard image access normally requires HTTPS, localhost or explicit browser permission.
- File selection remains available when clipboard access is blocked.
- PDF and image downloads may be restricted by managed-browser policies.
- Local browser saving is device-specific and is not a school-cloud backup.
- The vocabulary translations support meaning; students should still use the English computing keywords in their submitted answers.
