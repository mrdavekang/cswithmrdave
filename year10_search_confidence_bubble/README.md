# Year 10 - Search confidence and bubble sort (blended responses)

New, separate, buildless lesson. Open `index.html`; keep its JS, CSS, fonts and resources beside it. It works from local files and on GitHub Pages without a build step.

## Classroom use

- 60-minute plan: starter 0-6; Types of Learning 6-8; Main Task 1 8-20; three bubble-sort facts 20-30; Main Task 2 30-50; extension/support 50-54; Learning Pit Stop 54-57; plenary 57-60.
- Only Main Tasks 1 and 2 (Q2-Q7) go in the six-page printed booklet. Print A4, actual size; duplex long edge if preferred (three sheets per pupil).
- Starter Q1, Types of Learning, extension Q8, Learning Pit Stop and plenary Q9 have on-screen responses. Each page clearly labels its response mode. Question numbers are retained across the app, booklet and teacher key.
- Students enter Name and Class (10E or 10T), with no password. Digital answers save locally under that identity in this browser; re-enter the same name and class to resume. No database connection or live teacher control is added.
- Start the lesson for student study. Teacher view gives linear navigation plus a page selector, reset and reveal controls. It changes this screen only: no live locking or invitations.
- Main-task worked answers are hidden until a learner says they have attempted the paper question. This is a self-check, not proof that an answer was written. Starter checks require an entry first and retain first/latest checked attempts. Written explanations require teacher review. Independent Q3/Q5b/Q6/Q7 answers remain in the separate teacher PDF.
- Use a pencil for initial paper answers and a different colour for corrections. Hand in the booklet. Digital work uses Export on-screen answers PDF, then Save as PDF in the browser print dialog. The export includes all entered digital answers, attempts and reflections without truncation; it explicitly excludes handwritten paper evidence. Attach the PDF to the teacher's Teams lesson assignment and select Turn in. Exporting is not submission.
- Teacher preview uses isolated temporary data and cannot overwrite a pupil's saved responses. It is a navigation mode, not authenticated access to class records.
- No student names or private learning profiles are embedded in this package.

## Technical / curriculum choices

- Fixed index/value cells and prepared boundary states avoid renumbering or counting errors.
- The binary-search model uses target 13 in [5,9,13,18,24,31,42]. A fresh independent task uses target 26 in [4,8,12,19,26,33,40].
- Bubble sort uses a swap-controlled WHILE loop and a definite FOR loop, aligned to OxfordAQA 9210 3.1.4. Every pass checks all adjacent pairs, including the final pass with no swaps. No shrinking-end optimisation is introduced.
- Paper Python completion develops algorithm implementation but is not independent IDE execution. The walkthrough is a prepared trace, not an executable Python runtime.
- Teacher key is intentionally not included in the student website folder. The teacher should keep the separately delivered PDF private.
- Raleway fonts are included under the accompanying OFL licence. Program code uses the device monospace font.

Student lesson URL: https://mrdavekang.github.io/cswithmrdave/year10_search_confidence_bubble/

Only student-facing files belong in this folder. The separate teacher mark scheme stays outside the public repository. No Teams publication is included.
