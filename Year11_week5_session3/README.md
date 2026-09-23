# Year 11 · Week 5 Session 3

Open index.html in a modern browser, or upload this entire folder to GitHub Pages. All fonts and PDF dependencies are local; no build step is required. No external database or student account service is used.

## Teacher
Enter `teacher` as the name (class may be blank) to review the lesson. Navigation is open for all students so that they can revisit reading. On Review answers, use the passcode `Y11isawesome`. This is a classroom reveal control, NOT secure authentication: a static website cannot keep answers secret from someone inspecting its source. Do not use this for a secure assessment. Changing student locks the review again.

The timings total 60 minutes: reading 5, starter 4, types of learning 3, design 15, SQL reading 5, SQL task 18, pitstop 3, plenary 5, submission 2. Extension/review are within task time or follow-up.

## Save and resume
Full backup and Save PDF are pinned top-right throughout the lesson. On the landing page they are visible but disabled until a student starts/restores work. Backup includes answers, all saved SQL attempts, table design, example records and resized evidence photos. Restore validates the file and asks for confirmation before replacing a saved profile. Work is also saved locally in IndexedDB under name/class. Browser/device clearing removes local work: keep backups. The PDF reports every lesson section, not just the current screen. Review answers themselves are not exported; student corrections are.

Submit the PDF manually to Teams. There is no live teacher dashboard and nothing is uploaded automatically. Keep backups private. JPG/PNG/WebP photographs are supported; convert HEIC first.

## SQL practice
This is a restricted SELECT interpreter, not a full SQL engine. Supports Club, named fields or *, comparisons = > < >= <= <> !=, AND, quoted text and Boolean True/False. It rejects unsupported syntax rather than pretending to execute it. Text matching is case-sensitive in this simulator. Keywords and field names are case-insensitive. Feedback compares requested output fields (in requested order) and records, but does not prove a query is general for every future dataset. Ask students to explain their conditions.

The extension is paper-only: students collect the printed June 2023 9210/2 Questions 07.1 and 07.4 (5 original marks) from the teacher and return their completed paper for feedback. Separate question and original mark-scheme PDFs are supplied outside the website folder. There are no extension answer boxes, uploads or exam answers in the student app. Lesson readings are original explanations aligned to OxfordAQA 9210 3.7.2–3.7.3, not attributed textbook quotations.

## Dependencies
Raleway font: SIL Open Font License (assets/OFL.txt).
jsPDF: MIT license (license information in vendor file).
