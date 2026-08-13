# Year 8 Week 2 Project — Smart Badge Mission 1

## Open locally

Open `index.html` in a modern browser. The app has no required server, account or installation.

## Student entry

Students enter their full name and class. Core stages unlock progressively. Text, choices, checklists and the current stage save automatically in browser local storage.

## Hidden testing route

Either type `teacher` as the full name (class may be left blank), or add `?teacher=1` to the address, for example:

`index.html?teacher=1`

This uses separate storage, pre-fills test details and unlocks all stages. There is no teacher control in the student interface.

## Editors

- MakeCode Blocks: https://makecode.microbit.org/
- micro:bit Python: https://python.microbit.org/v/3

Both links open in a new tab. If school filtering changes, edit the links in `index.html` and `app.js`.

## Saving and evidence

Progress is local to the browser and device. One uploaded screenshot or photo is stored as a browser data URL when storage permits. Keep evidence under 6 MB; smaller screenshots are more reliable. Browser storage is not a school submission system.

Students can upload an image file or paste a screenshot directly into the evidence area. They can download a JSON progress backup from the review page. The backup contains responses and completion state; the separately stored evidence image is not included, so students should keep their original screenshot or photo.

## PDF submission

Use **Print report** or **Print / Save as PDF**, then choose the browser’s **Save as PDF** destination. The print layout includes the student’s answers, unfinished-stage wording and uploaded evidence. Students then upload the PDF to the Microsoft Teams assignment **Week 2 Project**.

## Images

The eight lesson visuals are stored in `assets/images/`. Replace an image using the same filename, or update its `src` and alt text in `index.html`.

## Hosting

Upload the complete folder to GitHub Pages, Netlify, Vercel, a school web server or supported SharePoint static hosting. Preserve the folder structure.

## Limitations

- Progress does not follow a student automatically to another browser or computer.
- Private browsing or clearing site data removes locally saved work.
- Some browsers restrict local-file storage or printing; static hosting is more reliable.
- The Raleway font loads from Google Fonts when permitted and falls back to Arial when blocked.
