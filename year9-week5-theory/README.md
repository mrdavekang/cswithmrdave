# Year 9 Week 5 — Nested selection and validation

Built to the page order and card structure in `Year 9 Week 5 Theory.pdf`.

Serve this folder over HTTP (for example `python3 -m http.server 8777`). Open index.html through that server. Python workers do not reliably start from file://.

Teacher preview: `?teacher=1`. Supported teacher preview: `?teacher=1&guided=1`.

Languages: English, Bahasa Melayu, Simplified Chinese. The supported route activates for a full name containing Ng Jun Kai, ignoring case, punctuation and repeated spaces. It retains the same learning goals with bilingual prompts and completion starters.

Lesson order: landing; read first (5 MCQs); Do Now (2 Parsons + 6 checks); Types of Learning; nested reading (2 tutors + 3 MCQs); Main Task 1 Parsons (2); debugging (3 runnable repairs); full programming; validation reading (table, routine, 3 MCQs); Main Task 2 validation matching and scenarios; Learning Pit Stop; plenary (1 Parsons + 3 questions); competitive coding; PDF submission.

The interpreter is bundled Skulpt's Python 3 subset, not full CPython. Input appears inline in the console during execution. No account or server receives student code. Work saves per name in this browser; backups restore editable work. PDF uses the browser's Save as PDF option; Teams submission is manual.

The editor, notebook and report infrastructure is reused from the earlier helpdesk lesson. `week5-content.js` supplies this lesson's data; `lesson.js` supplies the sketch-specific pages. Teacher and student notebooks are separate. The previous lesson is not modified.
