# Year 10 · Week 9 Session 3 · Lists and nested menus

A static, buildless 60-minute OxfordAQA 9210 lesson. Keep this folder together, including local fonts and Python libraries. No Vercel or pupil sign-up is needed. Publish through the existing GitHub Pages workflow only when authorised; this creation does not publish it or change Teams.

## Teaching sequence

| Stage | Minutes | Evidence |
| --- | ---: | --- |
| Starter | 5 | Recall FOR stop values and WHILE exit behaviour |
| Types of Learning | 3 | Separate K/S/U starting points and one chosen focus |
| Main Activity 1 | 20 | Access, replace and traverse book titles; three actual Python checks |
| Main Activity 2 | 20 | Rehearse a model, complete two scaffolded branches, test persistence and explain the two loops |
| Extension | 5 | Choose one of ten separate programming challenges |
| Learning Pit Stop | 3 | Compare evidence with the same KSU goals; select phases and one action |
| Plenary and export | 4 | Transfer the index rule; explain returning to the menu; export evidence |

There are 27 core pages and ten optional challenges. Each information page includes one check. Each programming page has one goal, exact expected evidence and a separate or clearly named persistent workspace. Students submit an attempt or flag for written help before continuing; they do not have to be correct to proceed. Scored MCQ choices shuffle once per notebook and remain stable on revisits/restoration. Reflection scales stay in a meaningful order.

Five reviewed visuals show positions, string versus list indexing, replacement, traversal and nested menu loops. Each has an always-visible written description and enlargement. WAGBA, KSU, keywords and challenge remain visible in the learning rail. Code is numbered with adjustable Editor text size; the model pointer is manual and never auto-advances. Written hints, private help and an agreed-pause request support different learners without attaching diagnostic labels.

## Student entry and Python

Students enter a name and class. **Start with my class** finds the active Lists/Menu room; the teacher admits them. **Practise independently** keeps work on the current device only. Use the same name, class, browser and route to resume that notebook. Names are labels, not verified identity; teachers must check admissions against the class.

The Editor and Shell run real Python through the bundled Pyodide worker. Run/F5, direct `input()` in the Shell, REPL, Stop and `.py` download are provided. There is no separate input queue. This is an IDLE-style interface, not the desktop IDLE application. Use HTTPS or a localhost server; `file://` is not suitable for interactive Python input. On first load the scoped isolation service worker may refresh once. Modern desktop browsers are recommended. Runtime failures are shown, not replaced with invented results. Do not put passwords or personal information into programs.

The three list exercises have separate workspaces so their original evidence remains clear. The menu workspace persists across Display, Update and the final test. The complete rehearsal model and ten extensions are separate. `pass` is explained as a placeholder. List creation remains outside WHILE; the persistence test displays the edited list twice. Unknown menu options silently redisplay the prompt in the core model; improving this is an extension.

Five automatic checks compare real inputs and printed lines with stated cases. Prompt/input echoes are distinguished from printed results. A check does not prove every possible case or verify the source structure: teachers review the recorded source as well. The summary counts matching **saved run versions**, not a claim that every subsequent edit is correct. Check a fresh run whenever the current code changes.

## Teacher controls

Entering `teacher` as a student name or selecting **Preview all pages** opens a local rehearsal only. It cannot see pupil data or control devices. Live controls require the existing approved Classroom account.

1. Choose **Teacher**, sign in and **Start Lists/Menu classroom**.
2. Open **Class responses**, inspect the pending roster and admit pupils.
3. Preview any page without moving pupils; select **Bring class to this page** to recall their devices.
4. Use **Watch**, **Enable answers** or **Pause**. Release an activity for pupil-paced practice, or grant an individual an extra page.
5. View the class response grid alongside the lesson; select a pupil for code, run evidence and private written feedback. Last contact is connection evidence, not proof of attention or typing.
6. Open **Live Python demonstration**, load a list/traversal/menu model and share it. Shared code appears directly on pupils’ current class page; their own source is never overwritten. The line pointer is teacher-controlled, not a debugger. Use **Share-safe view** before projecting.
7. End this room when finished. Rooms also expire after four hours.

## Separate live backend

With the user's approval, `supabase/01-lists-classroom.sql` was installed in the existing cswithmrdave Supabase project. It adds `y10_lists_private` and bounded `y10_lists_*` functions, reusing the existing approved teacher/class ownership check. No FOR/WHILE tables, functions or classroom permissions are changed. No anonymous Auth or Realtime is enabled; updates use polling.

`config.js` contains a browser-safe publishable key, public project URL and class identifier only. No service-role secret is included. Room-scoped device tokens, teacher admission, server ownership checks, row-level security and denied direct browser table access protect live work. Local screenshots are not uploaded. Follow school retention and shared-device policies.

The rollback-only `supabase/02-smoke-tests.sql` passed teacher ownership, page recall, pending-content masking, admission, own-work saving, page release, feedback isolation, pause/help and unsigned teacher denial. Synthetic room/pupil changes are rolled back. Do not reinstall the setup as part of starting an ordinary lesson.

## Evidence and submission

Local IndexedDB stores answers, attempts, source, actual runs, reflections and screenshots; a text rescue copy reduces lost edits. Storage can be lost if a browser/device is cleared. Live mode synchronises admitted pupils’ bounded saved work and recent runs; it is not keystroke surveillance. Sync failures leave local drafts and show a pending message. The cloud retains up to eight recent runs per page; the device notebook may retain more. Code/output/input limits prevent runaway storage. Screenshots stay on the device.

**Export PDF** is available throughout, including unfinished attempts and a pending run. The report includes all sections, actual run source, inputs, output/errors, self-reflections and whole uploaded images fitted without cropping. Missing/unchecked work is labelled honestly. Students open the PDF, then attach it in Teams and select **Turn in**; exporting alone does not submit it. Notebook JSON backups are private and restore only to the matching lesson/version and name/class. Never place pupil PDFs/JSON in this public folder.

## Curriculum and reading

OxfordAQA 9210: **3.2.2** programming concepts including nested iteration; **3.2.6** one-dimensional arrays (Python lists accepted); **3.2.8** string indexing/slicing as retrieval only. Creating/accessing/updating/traversing a list and combining known selection/FOR/WHILE are this lesson's scope. Two-dimensional lists, list methods and full menu validation are not implied as taught.

Class textbook, printed **48–49** (nested loops), **54–55** (create/access/update lists), **56–57** (traversal), with **28–29** for earlier string retrieval. PDF page numbers are four higher. Explanations and exercises are original; textbook and past-paper pages are not redistributed. Source links appear in the lesson and PDF.

## Verification

The private QA folder outside this public lesson contains content/evidence tests and preview evidence. Twenty automated checks passed, including all five model cases in real Python, rejecting unwanted output, detecting resetting the list, stale-code rejection, stable option shuffle, backup isolation and the separate server page whitelist. The full student route was exercised through entry, wrong-answer feedback, help flags, baseline choices, study checks, KSU reflection and plenary. Browser Python ran list access, Display/Exit and Update/two Displays/Exit with direct Shell input and no EOF error. Reload restored saved work. The manual pointer, image enlargement and 390px overflow check passed. A PDF containing actual source, runs, written explanation, reflection and an uploaded image was exported; code and whole-image pages were rendered and visually checked. The separate live backend passed rollback-only permission/control checks. A real teacher sign-in and admitted pupil on two devices should still be rehearsed before class. No GitHub/Teams publication was performed.
