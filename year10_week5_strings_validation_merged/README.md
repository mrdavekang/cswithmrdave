# Year 10 · Week 5 merged lesson · Strings and validation

Static, offline-capable lesson app for OxfordAQA International GCSE Computer Science 9210. Open `index.html` locally or publish the whole folder to GitHub Pages. No build step or student account is required. The lesson and student notebook work without a network connection; optional Classroom Mode uses the existing Supabase classroom service.

## Curriculum boundary

This merged lesson combines the first two sessions in the Week 5 scheme of learning:

- string concatenation, length, indexing/position and substring/slicing;
- validation decisions using selection, plus normal, boundary and erroneous test data.

The single username scenario moves from worked examples to an independent Python checker. The accepted rule is 5–8 characters inclusive. Validation loops are deliberately excluded and remain for the later indefinite-iteration unit.

Official OxfordAQA 9210 specification links:

- 3.2.2 — selection;
- 3.2.8 — length, position, substring and concatenation;
- 3.2.12 — simple validation routines and justified normal, boundary and erroneous test data.

Textbook connections: printed pp. 26–29 for strings/substrings, pp. 32–35 for selection and pp. 92–97 for validation and testing. The app paraphrases and applies these ideas; it does not reproduce textbook passages.

## Student experience

Students enter their name and class. Work saves locally in that browser. A full JSON backup supports resuming on another device. The PDF contains every prompt, an answer or a visible `Not answered` label, KSU profiles, test results and any uploaded code screenshots. Students must open the PDF, check it and upload it to Microsoft Teams themselves.

The app does not run arbitrary Python. Students use their own IDE. The two line-pointer tutors are deterministic walkthroughs of the supplied examples, and the teacher live demonstration is read-only on student devices.

The Types of Learning and Learning Pit Stop pages measure six specific targets. Starting points and final evidence use `not yet`, `with support` and `independently`; the pit stop separately records new learning, consolidating, treading water or needing help. These are self-reflections, not grades.

## Lesson route

The 60-minute classroom cue is set to 7:50–8:50 a.m. Malaysia time: Prepare 4; Do Now 5; Types of Learning 3; string reading 5; Main Activity 1 11; validation reading 5; Main Activity 2 14; testing 6; Pit Stop 3; Plenary 2; save/submit 2. The ten extensions are untimed early-finisher or follow-up work.

## Classroom Mode

Open the ordinary link for students. Add `?teacher=1` for teacher sign-in and controls. Available modes are Screens down, Show only, Let students answer and Self-paced. The teacher can bring devices to any lesson page or projector slide, return students to their own place, and broadcast a read-only Python walkthrough. Only anonymous presence and temporary control/demo state enter Supabase; student names, classes and answers remain in their browsers.

Before using Classroom Mode, run `supabase/25-year10-week5-strings-validation.sql` once in the existing Supabase project. This adds the permitted page, slide and Python-demonstration identifiers while retaining earlier lesson identifiers.

## Files

- `lesson.js` — student content and KSU targets
- `app.js` — saving, tutors, evidence, PDF, backups and teacher Python walkthrough
- `teacher-presentation.js` — lesson instruction slides and three fact slides
- `session-plan.js` / `lesson-clock.js` — 60-minute classroom cue
- `classroom*.js/css` — optional teacher-led classroom synchronisation
- `tests/` — offline content and interaction checks
