# Beetle:bit Week 4 — Build Lab

Static learning-card app for GitHub Pages at `Beetlebit_Week4/`. No build step or server-side data collection.

## Teacher

- Enter `teacher` as the name (class can be blank) to review every card. Hidden review shortcut, not authentication. No private teacher/student data is hosted.
- Learners enter first name and class. Progress is stored in that browser, keyed by those values. JSON backup can be restored on another device. No analytics or roster submission. Students sharing a first name and class need distinct identifiers on shared devices.
- Do not expect all 36 assembly steps in 80 minutes. Suggested timing: 08:30 Read Now/inventory; 08:40 safety/Do Now; 08:48 preparation; 08:55 build; 09:30 inspect or record next step; 09:40 pack/reflect; finish 09:50. Aim for a careful checkpoint.
- Teacher physically approves before powered tests. A checkbox is not approval. Unfinished students use “Pause here and reflect”.
- Images/numbering: user-provided February 2026 Cytron guide, pp. 6–23 and 38. Student prompts adapted, not verbatim.
- Step 14 (4 mm bolt absent from inventory) and step 24 (5 mm stand quantities) discrepancies are flagged. No forced substitutions.
- Classroom adaptation: battery remains disconnected through wiring, despite booklet step 32. Servo calibration deferred to teacher support; don't force it.
- Videos verified from official Cytron hub embeds: setup `uMzD8UFlGDc`; Chapter 2 `lY3kOSvGrps`. No invented timestamps. YouTube loads on request; assembly pictures work without video.
- English + Bahasa Melayu option supplies a glossary, not a full translation.

## Deployment

Deploy `index.html`, `styles.css`, `lesson.js`, `app.js`, and these assets: `robot.png`, `page-06.webp`, `page-07.webp`, `page-09.webp` through `page-23.webp`, and `page-38.webp`. Build cards crop the original page in the browser; the same image opens at full-page size. This avoids downloading separate pictures for every step. Other generated images and `prepare_images.py` are local preparation files only. Source PDFs are not published in full.

Optional read-only WebMCP tool reports the current card and checked count, not names. It cannot mark tasks complete.
