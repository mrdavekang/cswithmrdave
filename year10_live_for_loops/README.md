# Year 10 live FOR-loops lesson

A static GitHub Pages lesson for OxfordAQA International GCSE Computer Science 9210. No Vercel, build process or pupil account registration is needed. Real CPython runs locally in a Web Worker; Supabase stores private classroom work and control state.

## Before the online class

1. Open this lesson, select **Teacher**, and sign in with your existing approved Classroom teacher account. The Supabase dashboard login is separate from this teacher login. You see the same linear lesson pages as pupils, with a compact teacher control strip.
2. Select **Start lesson**. The **Class responses** pane opens beside the lesson; expand **Student invitation and admission** to copy the invitation. Share that invitation in Teams, not just the base lesson address. Admit only expected pupil names. **Share-safe view** hides all pupil responses and prevents reopening them until you exit that view.
3. **Previous / Preview next step** and the optional lesson outline browse your own view only. **Release this step** explicitly opens your viewed step to the class in **Watch** mode and clears the previous demonstration. Select **Work** when pupils should answer, or **Pause** to protect drafts. Mode buttons act on the current class step, not a different step you are previewing. Pupils use **Go to class step** when ready; they are never forcibly moved away from typing.
4. On a programming step, open **Teach with a live code demonstration**. Use your workspace code or load a prepared model, then share it, run it or move the line pointer. During Watch, pupils see the separate model instead of their editable workspace; Work restores their own saved program. Optional automatic sharing never replaces a pupil's program. Changing your preview step cancels pending automatic shares.
5. The class overview shows each pupil's saved response for the lesson step you are viewing. **Response view options** lets you compare another step or show written responses, Python code or actual run output on the cards. Click a pupil for their full response, source and run evidence without hiding the lesson. Use **Back to class responses** to see everyone again. In the individual view you can send a private written next step or unlock a task. Unsent feedback is kept separately per pupil in memory until you sign out, change rooms or close/reload the page; it is not sent automatically. Shared feedback is the latest message, not a conversation history. Your own rehearsal answers and code remain in a separate local teacher notebook and are never saved as pupil work.

The lesson has ten steps, displayed one at a time. The outline is optional and distinguishes the current, visited, available and unreleased steps; visited does not mean completed. Earlier released steps remain available, and individual unlocks still respect Watch/Pause.

Entering `teacher` as a pupil name opens all lesson pages for preview only. It cannot reveal the roster or grant teacher controls. Teacher credentials are not included in this repository.

## Suggested 60-minute route

| Stage | Minutes | Purpose |
|---|---:|---|
| Get ready | 2 | Join/admit, introduce the sponsored-run scenario |
| Starter | 5 | Retrieve integer input and the five-lap comparison |
| Types of Learning | 3 | Identify current KSU evidence and one small target |
| Teacher model | 9 | Read, predict and manually trace a running total |
| Main Task 1 | 13 | Repair the loop bounds, accumulate laps, test and match pseudocode |
| Main Task 2 | 12 | Add a certificate counter, selection and sponsorship calculation |
| Extension/core repair | 8 | Choose one of ten original challenges, or repair a core test |
| Learning Pit Stop | 3 | Reflect on each KSU and choose the next support/challenge |
| Plenary | 3 | Explain two structural choices using actual evidence |
| Export/hand in | 2 | Check the PDF and submit separately through Teams |

The ten extensions are a choice bank, not ten compulsory tasks in eight minutes. The organiser already knows the number of runners. Inputs are assumed to be valid positive runner counts and non-negative integer lap counts; the lesson does not introduce WHILE loops, lists, functions or complex validation.

## Python editor and support

- Enter input values **one per line before Run**, in the order the program asks for them. This is a real Python interpreter with a queued console, not a simulated answer checker or desktop IDE. Missing inputs produce a clear error rather than an endless wait.
- The built-in editor has line numbers, bracket matching, adjustable code size, Run, Stop, downloadable `.py` files and preserved run-source snapshots. A ten-second execution limit and an output cap prevent a stuck program blocking the page.
- The prepared line pointer explains a model at the pupil's own pace. It is explicitly **not** an automatic debugger for arbitrary pupil code.
- Help and pause requests can be written privately; no microphone response is required. Feedback should identify one line or concept and one small check to try next.
- Types of Learning/Pit Stop relate to six specific KSU statements. Evidence independence and the four learning phases are separate self-reports, not automatically awarded marks or fixed labels.

## Saving and evidence

Drafts save on the device immediately and sync about 1.4 seconds after an edit when the teacher permits Work. The board refreshes approximately every 2.5 seconds. These are near-live saved snapshots, **not** keystroke surveillance or a guaranteed instantaneous feed. A recently saved indicator is not an assessment of effort.

Each cloud stage keeps its latest answers/source and up to eight recent bounded runs; the device notebook preserves all recorded runs and separate extension drafts. Full screenshots stay on the pupil's device, not in the live board. The PDF includes all stages (unattempted ones are labelled), answers, source used for recorded runs, actual input/output/error evidence, extension work, reflections, complete attached images and available teacher feedback. It also gives Teams instructions. **Exporting or completing this app does not Turn in a Teams assignment.**

Use **Download notebook backup** before changing devices. The JSON backup includes images but no classroom tokens or teacher login. Restore from the student entry page; a new device must rejoin and be admitted. Only the most recent cloud run history can be recovered without that full backup. If device storage is blocked/full, the app warns to export immediately. On shared devices use separate browser profiles, or download the existing pupil backup before returning to entry and changing the name. Names are display labels, not verified identities.

Offline practice is available if instructed. It is not visible to the teacher and still needs a PDF hand-in. It works without the live connection after the page/engine have loaded; this is not a service-worker offline installation and a fresh load still requires the hosted files.

## Deployment and security

Host this complete folder unchanged under the existing GitHub Pages repository; all Python/editor/font/PDF assets are local. Serve via HTTPS (or localhost for tests), rather than opening `index.html` directly with `file://`. No npm build is necessary. The Python bundle is approximately 12 MB on the first visit.

The separate backend has been installed in the existing classroom Supabase project. Installation instructions and audit-friendly SQL are in [supabase/SETUP.md](supabase/SETUP.md). Do not enable global anonymous Auth or replace existing classroom migrations. Do not publish a service-role key, password, named pupil exports or teacher-board screenshots.

Live rooms expire after four hours. Named evidence is **not automatically deleted**. Review the school's retention policy; the setup guide recommends private export/review and authorised cleanup within seven days unless policy requires otherwise. No pupil work is public in GitHub. Joining requires the current invitation, an unguessable device token and teacher admission; tokens cannot prove a pupil's real-world identity.

## References and licences

Original scenarios/readings refer to OxfordAQA 9210 specification v3.4, relevant textbook printed pp.44–45 and p.50, and Python's documented `range` semantics. The textbook is not redistributed; this is not an official examination paper or a claim of endorsement. Optional exercises are original, not copied from Helsinki's question bank.

Vendor licence notices are included for Pyodide, CodeMirror, Supabase, jsPDF and Raleway. Do not remove those notices when hosting.
