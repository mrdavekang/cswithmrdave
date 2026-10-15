# Year 10 — WHILE loops and input validation

A buildless, static 60-minute OxfordAQA 9210 lesson. Keep this entire folder together. No Vercel, package installation, build command or pupil account is required.

## Open and teach

Publish the folder through the repository's existing GitHub Pages workflow when authorised. The student permalink is the folder's `index.html` served over HTTPS. Local preview also works over `http://localhost`; opening `index.html` directly as `file://` is not suitable for Python's interactive input.

Students enter their name and class, then choose **Start with my class**. The teacher first starts the WHILE classroom and admits each pupil. **Practise independently** is also available, with local evidence only. Names are labels, not verified identity: check the waiting list against your class. Use the same name, class, browser and device to resume a local notebook. Do not use a name as a security mechanism.

Choose **Teacher**, sign in using the existing approved Classroom teacher account, then:

1. Select **Start WHILE classroom**. This does not start or alter the FOR-loops classroom.
2. Open **Class responses**, select a waiting pupil, and admit them.
3. Preview a page, then select **Bring class to this page** to move student devices. Merely previewing never moves the class.
4. Use **Watch**, **Enable answers**, or **Pause**. **Release this activity for practice** releases its pages for pupil-paced work. An individual pupil can also be given an extra page release.
5. Inspect the class's saved responses beside the lesson, or select one pupil for code, actual run evidence and private written feedback. Last contact indicates recent connection, not guaranteed attention or typing.
6. Open **Live Python demonstration**, load/edit a model and select **Share code**. Shared edits and the teacher's pointer appear directly on the class page; pupils need not open a dropdown. The pointer is manually controlled, not an execution debugger. Their programs are never overwritten.
7. Use **Share-safe view** before screen-sharing. Keep the private response panel off the projector. End the WHILE classroom when finished.

Entering `teacher` as a student name, or choosing **Preview all pages**, opens a local rehearsal only. Neither grants teacher privileges nor reveals student data. Live controls require the existing approved account; all live requests are checked on the server.

## Lesson flow

| Activity | Minutes | Main evidence |
| --- | ---: | --- |
| Starter | 5 | Selection recap and why another input is needed |
| Types of Learning | 3 | Separate K, S and U starting points and one focus |
| Main Activity 1 | 17 | Read, predict and trace WHILE; compare start/end conditions |
| Main Activity 2 | 21 | Complete one persistent validator; test replacement inputs, 0 and 20; explain progress |
| Extension | 5 | Choose one of ten optional challenges, each with its own workspace |
| Learning Pit Stop | 4 | Revisit the same KSU statements using evidence; choose a phase and next action |
| Plenary | 5 | Zero iterations, OR reasoning and input-conversion limitation |

There are 30 core steps, including study-and-check, reflection and submission pages, plus ten optional challenge pages. Each teaching-information page now ends with one short understanding check on that same page; simply visiting it is not completion. There are 14 objective checks in total. A student checks an answer or flags the page for help before continuing; teacher page recall and release controls remain available. Use the help/return flag to avoid making a slower reader wait for an automatic correctness gate. Wrong attempts remain visible in the evidence; explanations are teacher-reviewed, not marked using keywords.

WAGBA, KSU, keywords and challenge remain consistent. The desktop learning rail stays visible; narrow screens place it above the task. Four original visuals have enlargement and always-visible written descriptions. Numbered model walkthroughs, their explanations and student-controlled pointers are visible without opening dropdowns. The flowchart and code walkthrough use separate existing pages, each with its own check, rather than one crowded page. The replacement-input example and worked-model support are also visible. Optional screenshot-upload and teacher-tool disclosures remain separate from the teaching content. The ten extensions are a practice bank, not a requirement to finish ten tasks in five minutes.

Scored MCQ options are shuffled per learner notebook, then kept stable across revisits, reloads and matching backup restores. Their saved order also syncs in live mode. Answers and marking use the option's identifier, never its screen position. Teacher feedback and PDF reports refer to the answer text, not A/B/C positions. KSU starting points and Learning Pit Stop scales retain their logical order.

## Python Editor and Shell

The local Pyodide worker runs real Python in the browser. This is an IDLE-style experience, not the desktop IDLE application: numbered Editor, Run/F5, editable text size, Python Shell, direct interactive `input()`, REPL commands, Stop and `.py` download. No separate input list or external online editor is used.

The **validator** workspace persists across build and all three test pages. Extension workspaces are separate. Each run records the executed source, entered inputs, output and errors. A later code edit invalidates an earlier test match until the current version is run again. The checks verify the stated examples only, not all possible program behaviour.

The core task accepts integer donations from **0 to 20 inclusive**. Its rejection condition is `books < 0 or books > 20`. Tests use **-2, 25, 12**, then separate runs of **0** and **20**. The core task deliberately checks numeric range only: `int(input(...))` can raise `ValueError` for `hello`. Safe conversion/exception handling is not taught or implied here.

Input waits in the Shell, including an empty entry. Stop interrupts loops; work is preserved. Use a modern desktop browser. The isolation service worker is scoped to this folder; refresh once if the browser requests it to enable interactive input. Browser/runtime failure is reported rather than generating invented results. Files/packages, graphics and every feature of desktop Python are not supported. Do not enter passwords or sensitive personal data in programs.

## Evidence, storage and PDF

- Responses, attempts, source, actual runs, reflections and optional screenshots are saved on the device. A text rescue copy reduces lost last edits; IndexedDB is the primary store, including images. Storage is not guaranteed on private/shared/cleared browsers.
- Live mode syncs admitted pupils' saved work and bounded recent run evidence to the separate WHILE backend. It is not a keystroke surveillance tool. A connection failure keeps local drafts and displays a sync-pending message.
- The cloud retains the latest eight runs per page and recent answer attempts; the notebook/PDF contains the history retained on the current device. Long code, transcripts and input histories have safety limits. Screenshots remain on-device, not in the teacher board.
- **Export PDF** works during the lesson, including unfinished work or a program waiting for input. It labels partial/error evidence honestly and fits complete screenshots proportionally, without cropping.
- Export does **not** upload to Teams. Pupils open their PDF, then attach it to the named assignment and select **Turn in**. The app gives those instructions.
- **Download notebook backup** exports a restorable JSON notebook. Keep it private. Restore accepts only this lesson/version and the current matching name/class. Back up the currently open version first if both versions matter. Do not put student PDF/JSON exports into this public repository.

## Live classroom setup

`supabase/01-while-classroom.sql` was installed, with approval, in the existing cswithmrdave project. It uses the separate `y10_while_private` schema and `y10_while_*` RPC functions. The existing teacher/class ownership check is reused. FOR-loop tables/functions and class permissions were not changed.

`config.js` contains only the browser-safe project URL, publishable key and class identifier. No service-role key is needed or included. Pupil access uses an admission-controlled, room-scoped device token. Direct pupil table access is denied and row-level security remains enabled. Rooms expire after four hours. Review pupil retention and shared-device practice according to school policy.

`supabase/02-smoke-tests.sql` is a rollback-only backend test: teacher ownership, page recall, hidden pending access, admission, own-work saving, release, private feedback, pause/help and unsigned teacher denial passed in the project. It does not retain synthetic pupils or rooms. Do not reinstall the setup as part of an ordinary lesson or edit existing classroom permissions.

## References and scope

Content is original lesson writing aligned to OxfordAQA 9210 **3.2.2**, **3.2.4**, **3.2.5** and **3.2.12**. Students read their own textbook: printed **46–47**, **50–53** and **92–94** (the supplied PDF's positions are four pages later). No textbook or past-paper pages are redistributed. REPEAT...UNTIL is OxfordAQA pseudocode, not native Python.

The design uses a read–predict–explain–build–test progression, one-response pages, explicit evidence requirements, written support, optional scaffolds and calm help/pause requests. Learning phases are self-reported support signals, not grades or diagnostic labels. Runtime/library licences are retained in `vendor/` and `assets/`.

## Verification status

The complete independent student journey was tested in-browser, including wrong-answer feedback, reload recovery, repeated and blank input, three program tests, stopping an infinite loop, reflection, screenshot evidence, PDF export and notebook backup. Seventeen local evidence/content/navigation/isolation/shuffle/study-check tests passed. PDF sample pages were rendered and visually checked. Teacher preview, image enlargement, stable shuffled-option marking, visible model pointers and study-question continuation were checked; live backend permissions/control operations passed rollback tests. Existing page IDs and the backend setup are unchanged. A real teacher-account sign-in with an admitted pupil on a second device is still recommended before the first class. GitHub Pages publication uses the existing repository workflow; no Teams changes are included.
