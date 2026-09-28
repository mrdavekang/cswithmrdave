# Year 9 · Improve the helpdesk adviser

This lesson follows the earlier Sam helpdesk project. The WAGBA is to improve the program so it handles unsuitable input, makes a nested decision, and passes planned tests. There are exactly two Main Tasks: build the improved program, then test and improve it.

Open over HTTP, for example `python3 -m http.server 8778`, then visit `http://127.0.0.1:8778/`. Opening `index.html` directly also supports Run and planned tests: a local bundle starts Python inside a Blob worker. Keep the entire lesson folder together. Regenerate that bundle with `node build-python-offline.mjs` after editing the worker or Skulpt libraries. Teacher preview: `?teacher=1`; supported preview: `?teacher=1&guided=1`.

The student path is landing → Read first with Sam’s worked time example and a 12-line tutor → six guided Do Now checks → Types of Learning → Main Task 1 → Main Task 2 → further challenge → Learning Pit Stop → plenary/PDF submission. The app supports English, Bahasa Melayu and Simplified Chinese. A name containing **Ng Jun Kai**, ignoring case and punctuation, opens a supported route with shorter English, Mandarin prompts and a smaller code gap; the same lesson goal and tests remain.

Each Main Task now shows one focused card at a time, with Back/Next controls and saved step navigation. Parsons puzzles contain individual Python lines beside a different worked example: three lines for a calculation, then five lines for a blank-input decision. Students predict one output, run it, investigate one branch, modify one value or message, and make a program with one missing comparison. Instructions and the relevant editor appear together. English, Bahasa Melayu, Simplified Chinese and the supported Mandarin prompts are included.

Read first shows the 2-person, 12-minute boundary, examples of valid and unsuitable input, and the one-condition Sam program. Do Now groups its six checks into knowledge, skills and understanding, with a worked reminder and a short context hint for each question. It checks one condition only; OR and AND are first taught in Challenge 2.

Main Task 1 moves from a three-line calculation to a small nested decision with one condition at a time. It then has a separate **Challenge 2 PRIMM model**: predict and run an `or` check, compare it with `and`, change the operator to see why a lone negative value must not pass, and select the safe rule. The full two-input program uses that rule only afterwards. Main Task 2 starts with a blank-input check. Type handling is explained and supplied rather than recalled from memory. The full scaffold provides validation and calculation; students complete the familiar inner comparison and improve one error message in separate cards. Normal, boundary, word and blank tests have their own cards, followed by the remaining cases. Previous code is retained when opening the full scaffold. Teacher live demo opens the full-program editing card directly.

The console accepts input() answers in the natural order. The runtime is a bundled Skulpt Python 3 subset, not full CPython. All ten planned tests remain available and run against the current program.

Student work saves only in this browser. The full backup is editable JSON, the `.py` download contains Python code, and the PDF is the file students submit in Teams. No student code, name or answers are sent to a server by this app.

Classroom Mode now has one pacing feature only: **Screens down**. Students use the ordinary permanent lesson URL and navigate normally. The teacher opens the same URL with `?teacher=1`, signs in, starts the classroom, and can select **Screens down** or **Release screens**. Screens down covers the student lesson and prevents input until the teacher releases it. There are no page-pushing, slide, live-code, answer-locking or student leave controls.

The 8:50–9:50 lesson clock is draggable and only suggests the scheduled page. It does not move a self-paced student. Three teacher-only fact slides remain local presentation resources and are not classroom controls.

Before first use, run `supabase/30-screen-down-classrooms.sql` once in the existing Supabase project. The result must show `screen_down_classrooms_ready = true`. The script preserves the existing lesson routes and adds only temporary Screen Down sessions for the four registered lesson sites.
