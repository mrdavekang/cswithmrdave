# Year 9 · Improve the helpdesk adviser

This lesson follows the earlier Sam helpdesk project. The WAGBA is to improve the program so it handles unsuitable input, makes a nested decision, and passes planned tests. There are exactly two Main Tasks: build the improved program, then test and improve it.

Open over HTTP, for example `python3 -m http.server 8778`, then visit `http://127.0.0.1:8778/`. The bundled Python worker does not reliably start from `file://`. Teacher preview: `?teacher=1`; supported preview: `?teacher=1&guided=1`.

The student path is landing → Read first with line tutor → six Do Now checks → Types of Learning → Main Task 1 → Main Task 2 → further challenge → Learning Pit Stop → plenary/PDF submission. The app supports English, Bahasa Melayu and Simplified Chinese. A name containing **Ng Jun Kai**, ignoring case and punctuation, opens a supported route with shorter English, Mandarin prompts and a smaller code gap; the same lesson goal and tests remain.

Main Task 1 has a visual input table, a four-step sequence and a runnable Python editor. Main Task 2 has normal, boundary and erroneous test cases. Each test runs against the student's current program and compares actual output to the expected route. Functional output and the specificity of each error message are checked. The console accepts `input()` answers in the natural order when the student runs code manually. The runtime is a bundled Skulpt Python 3 subset, not full CPython.

Student work saves only in this browser. The full backup is editable JSON, the `.py` download contains Python code, and the PDF is the file students submit in Teams. No student code, name or answers are sent to a server by this app. The lesson includes Supabase Classroom Mode. The permanent student link is the plain GitHub Pages lesson URL. Teacher sign-in uses the same URL with `?teacher=1`; student names, answers and Python work remain in the browser and are never sent to Supabase. The teacher can see the anonymous device count, show a full-screen “Screens down” message, show a page without input, let students answer, return students to their own work, bring everyone to a page once, or keep locked devices following the teacher automatically. The bottom control dock can be collapsed and lesson content can be zoomed separately for projection.

The 8:50–9:50 lesson clock is draggable and only suggests the scheduled page. It does not move a self-paced student. Three teacher-only fact slides provide class questions and local answer boxes. Live Python demonstration mirrors the teacher’s current code, highlighted line and output as a read-only view on student devices.

Before first use, run `supabase/22-year9-week5-project-classroom.sql` once in the existing Supabase project. This registers this lesson’s page and fact-slide IDs while preserving the other classroom lessons.
