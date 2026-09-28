# Year 9 · Improve the helpdesk adviser

This lesson follows the earlier Sam helpdesk project. The WAGBA is to improve the program so it handles unsuitable input, makes a nested decision, and passes planned tests. There are exactly two Main Tasks: build the improved program, then test and improve it.

Open over HTTP, for example `python3 -m http.server 8778`, then visit `http://127.0.0.1:8778/`. The bundled Python worker does not reliably start from `file://`. Teacher preview: `?teacher=1`; supported preview: `?teacher=1&guided=1`.

The student path is landing → Read first with line tutor → six Do Now checks → Types of Learning → Main Task 1 → Main Task 2 → further challenge → Learning Pit Stop → plenary/PDF submission. The app supports English, Bahasa Melayu and Simplified Chinese. A name containing **Ng Jun Kai**, ignoring case and punctuation, opens a supported route with shorter English, Mandarin prompts and a smaller code gap; the same lesson goal and tests remain.

Each Main Task now shows one focused card at a time, with Back/Next controls and saved step navigation. Parsons puzzles contain individual Python lines beside a different worked example: three lines for a calculation, then five lines for a blank-input decision. Students predict one output, run it, investigate one branch, modify one value or message, and make a program with one missing comparison. Instructions and the relevant editor appear together. English, Bahasa Melayu, Simplified Chinese and the supported Mandarin prompts are included.

Main Task 1 moves from a three-line calculation to a small nested decision before combining the pieces. Main Task 2 starts with a blank-input check. Type handling is explained and supplied rather than recalled from memory. The full scaffold provides validation and calculation; students complete the familiar inner comparison and improve one error message in separate cards. Normal, boundary, word and blank tests have their own cards, followed by the remaining cases. Previous code is retained when opening the full scaffold. Teacher live demo opens the full-program editing card directly.

The console accepts input() answers in the natural order. The runtime is a bundled Skulpt Python 3 subset, not full CPython. All ten planned tests remain available and run against the current program.

Student work saves only in this browser. The full backup is editable JSON, the `.py` download contains Python code, and the PDF is the file students submit in Teams. No student code, name or answers are sent to a server by this app. The lesson includes Supabase Classroom Mode. The permanent student link is the plain GitHub Pages lesson URL. Teacher sign-in uses the same URL with `?teacher=1`; student names, answers and Python work remain in the browser and are never sent to Supabase. The teacher can see the anonymous device count, show a full-screen “Screens down” message, show a page without input, let students answer, return students to their own work, bring everyone to a page once, or keep locked devices following the teacher automatically. The bottom control dock can be collapsed and lesson content can be zoomed separately for projection.

The 8:50–9:50 lesson clock is draggable and only suggests the scheduled page. It does not move a self-paced student. Three teacher-only fact slides provide class questions and local answer boxes. Live Python demonstration mirrors the teacher’s current code, highlighted line and output as a read-only view on student devices.

Before first use, run `supabase/22-year9-week5-project-classroom.sql` once in the existing Supabase project. This registers this lesson’s page and fact-slide IDs while preserving the other classroom lessons.
