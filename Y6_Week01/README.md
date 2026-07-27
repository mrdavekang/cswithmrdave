# Lab Launch: Year 6 Computing Quest

An interactive, self-contained Year 6 (KS2) Computing lesson web app for the first lesson of the year. Students restore a futuristic Computing Lab through a gentle platform game, a routine-sorting activity, a simulated file-management task, a real Scratch investigation and modification, evidence capture, and a compulsory plenary — finishing with a printable completion report.

Everything runs in the browser. **No server, database, npm install or build step is required, and no student data ever leaves the computer.**

---

## 1. How to open the app locally

Double-click `index.html`, or right-click it and choose *Open with → Chrome / Edge*. That's it.

If your school network blocks Google Fonts, the app automatically falls back to system fonts — nothing breaks.

## 2. How to host it on a static web host

Upload the whole folder (keeping the folder structure) to any static host: a school web server, SharePoint static site, GitHub Pages, Netlify, etc. The app uses only relative paths, so it works in a subfolder such as `https://school.example/computing/lab-launch/`.

## 3. How to change the Scratch project link

Open `js/config.js` in any text editor and change:

```js
SCRATCH_PROJECT_URL: "https://scratch.mit.edu/projects/123456789/",
```

Save and refresh. The link opens in a new tab so the lesson app stays open. (You can also override it temporarily on one machine from teacher mode.)

## 4. How to change class options

In `js/config.js`:

```js
CLASS_OPTIONS: ["6A", "6B", "6C"],
```

Leave it as `[]` to give students a free-text class box instead. Also editable per-machine in teacher mode.

## 5. How to activate teacher mode

1. Open the app with `?teacher=1` added to the address, e.g. `index.html?teacher=1`.
2. Enter the passcode set in `js/config.js` (`TEACHER_PASSCODE` — **change the default before using with a class**).

Teacher mode lets you: unlock/jump to any stage, view model answers, change the Scratch URL and class list, disable sounds, fill the app with demonstration data, reset the current student, and clear all local data. Set `ENABLE_TEACHER_MODE: false` to disable the entrance entirely. Teacher access lasts for the browser session only.

## 6. How student data is stored

Everything is stored **locally in the browser on that computer**:

- Progress, answers, badges and settings → `localStorage`
- The uploaded screenshot → `IndexedDB` (browser image storage)

Nothing is transmitted anywhere. There are no cookies, no analytics and no accounts. Note this means a student who moves to a different computer will not see their earlier progress.

## 7. How to clear saved data

- **One student:** teacher mode → *Reset current student*, or the *Start Again* button on the completion report.
- **Everything (including teacher overrides):** teacher mode → *Clear ALL local data*.
- Clearing the browser's site data for the page also removes everything.

## 8. How students upload screenshots

The Evidence Station shows step-by-step screenshot instructions for **Windows** (Win+Shift+S), **Chromebook** (Ctrl+Show Windows) and **Mac** (Cmd+Shift+4). Students can then:

- click **Upload Screenshot** and choose the file,
- drag-and-drop the image onto the upload area, or
- simply **paste** (Ctrl+V / Cmd+V) a copied screenshot onto the page.

Accepted formats: PNG, JPG, JPEG, WEBP (up to ~10 MB). Preview, replace, rotate and delete buttons are provided. If a device cannot take screenshots, the teacher can allow the student to continue without one — the essential explanations are still required.

Students upload **two** screenshots during the lesson:

1. **File Management Centre** — after completing the practice simulation (which includes creating a folder with their own name), students are prompted to create the same folder structure *for real* on the school computer they are using, and upload a screenshot of their real folders as evidence.
2. **Evidence Station** — a screenshot of their modified Scratch project.

Both appear on the printed completion report.

## 9. How to print or save the report as PDF

On the completion report screen, click **Print / Save as PDF**, then choose *Save as PDF* as the printer destination. A print stylesheet removes all game visuals, navigation and backgrounds, leaving a clean document containing the student's name, class, date, support preferences, all responses, badges, the screenshot and the confidence rating.

## 10. Known browser limitations

- Tested for current **Chrome and Edge**; also usable on **iPad Safari** (touch controls and Guided Movement Mode are provided).
- **Read-aloud** uses the browser's built-in Web Speech API; voice quality varies and some locked-down browsers disable it (the speaker buttons simply do nothing harmful if unsupported).
- **Private/incognito windows** may block localStorage/IndexedDB — progress and screenshots then cannot be saved between refreshes.
- Screenshot **paste** requires the browser tab to be focused; Chromebook file upload works normally.
- If the canvas game cannot start on a device, the app automatically falls back to **Guided Movement Mode**, so all learning content remains accessible.

## 11. How the app protects student privacy

- No data (name, class, answers, screenshots) is ever sent to a server — everything stays in the local browser.
- No cookies, no analytics, no tracking, no accounts, no leaderboard.
- Support-profile choices are private to the student and shown to nobody else.
- Screenshot guidance explicitly tells students not to capture personal information or other students' names/accounts.
- All student-entered text is sanitised before being displayed anywhere in the app or report.

---

## File structure

```
index.html        app shell
css/styles.css    all styling, including the print stylesheet
js/config.js      ← everything the teacher edits
js/app.js         lesson logic, activities, differentiation, teacher mode
js/game.js        the original 2D platformer engine (canvas, no assets)
js/storage.js     localStorage + IndexedDB layer
js/report.js      completion-report builder
README.md         this file
assets/           (empty — all artwork is generated SVG/canvas code)
```

## Lesson flow (one 60-minute lesson)

Landing → Support selection → Mission briefing → **Safety Corridor** (7 min starter) → **Lab Operating System** routine sort (10 min) → **File Management Centre** (7 min: practice simulator including a personal name folder, then creating the folders for real with screenshot evidence) → **Scratch Laboratory** investigation (6 min) → **Modification Mission** in real Scratch (10 min) → **Evidence Station** (7 min) → optional **Extension Vault** → compulsory **Exit Terminal** plenary (8–10 min) → printable **Completion Report**.

Core stages unlock in order; the plenary cannot be skipped; the Extension Vault never blocks the plenary.
