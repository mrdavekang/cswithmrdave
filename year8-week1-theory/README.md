# Year 8 Week 1 Theory Web App

## Lesson

**Year group:** Year 8  
**Week:** 1  
**Lesson:** Computer Science Foundations — expectations, algorithms and Python baseline  
**Normal student entry:** `index.html`  
**Hidden testing route:** `index.html?teacher=1`

The app is a static HTML/CSS/JavaScript lesson. It does not require a server, database, student account, build tool or external API.

## Extract and open locally

1. Extract the ZIP file.
2. Keep the folder structure unchanged.
3. Open `index.html` in a modern browser.

For the most reliable local behaviour, particularly on managed devices, serve the extracted folder with a simple static web server. The app can still open directly from the file system in current versions of Chrome, Edge, Firefox and Safari.

## Hosting

Upload the complete extracted folder to any static host:

- GitHub Pages
- Vercel
- Netlify
- a school web server
- SharePoint static hosting where HTML/JavaScript assets are permitted

Do not upload only `index.html`; the CSS, JavaScript and image folders are also required.

## Student route

Open:

`index.html`

Students enter their full name and class before beginning. Core sections unlock progressively. The optional extension does not block the plenary.

## Hidden teacher testing route

Open:

`index.html?teacher=1`

This route uses separate browser storage, relaxes required-field restrictions and pre-fills sample student details. No teacher controls or teacher-mode labels appear in the student interface.

Do not publish the testing route in student instructions.

## Progress saving and resuming

Progress is saved automatically in browser `localStorage`, including:

- full name and class
- current section
- task responses
- checked results and corrections
- section completion
- optional extension work
- plenary responses
- timestamps

When the normal route is opened again on the same browser and device, the landing page offers to resume the saved lesson.

Student and hidden teacher testing work use separate storage keys.

## Resetting progress

On the landing page, choose **Start as another student** to remove the current saved student work after confirmation.

On the final review page, choose **Reset all progress**. Deletion requires confirmation.

Browser storage is device- and browser-specific. Clearing browser site data also removes saved lesson progress.

## PDF export

The review page includes **Export lesson PDF**.

The app contains a dependency-free client-side PDF generator. It creates a multi-page A4 PDF using standard PDF fonts, structured headings and automatic page breaks. The PDF filename follows this format:

`Year8_Class_Full_Name_Week1_Theory.pdf`

After export, the app shows the Microsoft Teams submission instruction for **Week 1 Theory**.

## Print fallback

Choose **Print-friendly fallback** on the review page if direct PDF download is blocked. The browser print dialog will open a print-only version of the lesson evidence. Select **Save as PDF** in the browser or operating-system print dialog.

## Images

Lesson images are stored in:

`assets/images/`

Current image files:

- `starter-baseline-overview.png`
- `computer-science-learning-habits.png`
- `algorithm-rescue-name-badge.png`
- `plenary-reflection.png`

The images are inserted within the relevant activities. Students can select an image to enlarge it.

If an image is missing, the app displays an accessible fallback message and the activity remains usable.

## Replacing or adding images

1. Add the new image to `assets/images/`.
2. Use a descriptive, lowercase filename.
3. Update the relevant image path in `app.js`.
4. Provide accurate descriptive alt text in the corresponding `imageBlock(...)` call.
5. Preserve the folder structure when repackaging.

Avoid embedding large images as base64.

## Browser limitations

- Saved progress is available only in the same browser profile and device.
- Private browsing may remove progress when the window closes.
- School browser policies may block file downloads; use the print fallback in that case.
- Direct local opening can behave differently under strict managed-browser policies. Static hosting is recommended for deployment.
- PDF text uses standard PDF fonts and converts unusual symbols to readable ASCII equivalents.
- The app does not sync progress between devices.

## Accessibility

The app includes:

- keyboard-accessible controls
- visible focus indicators
- labelled form fields
- accessible alternatives to drag-and-drop through move-up/move-down controls
- responsive layouts
- descriptive image alt text
- reduced-motion support
- contrast-aware success, warning and error states
- a persistent or collapsible learning-focus panel
