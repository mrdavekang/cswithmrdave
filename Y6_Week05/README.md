# Year 6 Term 1 Week 5 - Choose a route, make it flash

Open `index.html` in a current browser or publish this whole directory to GitHub Pages. There is no build step, account, database or server. Keep the `assets` and `vendor` folders beside the HTML file.

This lesson follows the layout, Raleway typeface and green/white palette of the supplied Year 11 Week 5 Session 3 app, but the reading and tasks are written for Year 6. The sidebar keeps the sequence visible. Future pages unlock as pupils move forward. Enter `teacher` as the name to preview every page without completing the route.

Supabase Classroom Mode provides **Screens down** only. Students use the ordinary lesson URL. The teacher opens the URL with `?teacher=1`, signs in, starts the classroom, and can cover or release every connected student screen. This does not send names, answers or Scratch work to Supabase. Run `supabase/30-screen-down-classrooms.sql` once and check that it returns `screen_down_classrooms_ready = true`.

## 60-minute sequence

| Stage | Time |
| --- | ---: |
| Do Now | 4 min |
| Types of Learning | 3 min |
| Read the choice | 5 min |
| Main Task 1: plan | 5 min |
| Main Task 1: Scratch | 9 min |
| Learning Pitstop | 3 min |
| Read the repeat | 4 min |
| Main Task 2: predict | 3 min |
| Main Task 2: Scratch | 12 min |
| Plenary | 5 min |
| Exit Reflection | 3 min |
| Save and submit | 4 min |

The extension is optional and fits within the practical-task time. The app deliberately does not include checkpoint corrections or post-checkpoint feedback.

## What pupils make

Pupils download `assets/Year6_T1W5_Choose_and_Repeat_Starter.sb3` and load it in Scratch. The project includes a two-route museum backdrop, an Explorer sprite and only an opening script. That opening script now starts with `show`, so the sprite appears again even if an earlier run was stopped while it was hidden. Pupils add an `ask`, an `if / else` branch, and a `repeat (3)` signal. They test left and right, then count three hide-and-show flashes. The three-level extension can improve the loop count, route messages, or response to unexpected input.

The code examples in the website are screenshots captured from Scratch Desktop 3.32.0, not imitations of its blocks. The choice, repeat and unexpected-answer models were opened in Scratch; the starter itself was opened and visually checked for its backdrop, sprite position, and opening script. The example screenshots show possible finished scripts, while the downloadable starter remains unfinished for pupils to complete. Select an image to open the full Scratch screen.

The extension now shows one level at a time rather than three sentence-only cards. Each level has a real Scratch block model, explicit build steps, named inputs to test, an expected outcome and a short result check. Level 1 changes the repeat count, Level 2 edits the two room messages, and Level 3 adds a second condition so an unexpected answer does not receive a room direction. The “Try next level” button moves pupils forward without asking them to find the level selector again. The Level 3 model is a focused view of the new choice section, not a replacement starter project; pupils keep their own opening and flash blocks.

For future KS2 coding extensions in this lesson series, use the same **look at real blocks → change one thing → test named cases → explain or debug** pattern. A sentence-only challenge is not sufficient guidance.

The website does not embed or control Scratch. It records planning, predictions, test notes and explanations. Pupils explicitly choose whether they completed each Scratch task or need help. This avoids presenting website answers as proof that Scratch code exists. Their saved `.sb3` is separate from the PDF.

The `.sb3` is created from the user's existing Year 6 Explorer sprite and an original two-route SVG backdrop. `build_starter.py` is included for reproducibility; the generated `.sb3` is already present.

## Save and restore

Answers are saved in this browser under the learner's name and class. The Full backup button downloads JSON for resuming on another device. Restoring asks before replacing saved progress. Save PDF creates an English summary of answers, task statuses and explanations. It does **not** include the Scratch project. Students should open the PDF and submit both the PDF and `.sb3` in their Teams assignment. This app does not upload files to Teams.

When a learner resumes with the same name and class, the landing-page alone/partner and language choices update for that session without deleting their answers. This lets a pupil continue alone at home after working with a partner in class.

Student names and answers remain in local browser storage; the app does not send them to a server. For home use, keep both the JSON backup and the separate Scratch `.sb3` file. The English + 中文 choice adds short Chinese reading support to key instructions; recorded answers may be in either language. The PDF uses English labels and records typed answers.

## Dependencies and limits

- `assets/Raleway-VariableFont_wght.ttf` is the Year 11 project's Raleway font; see `assets/OFL.txt` for its license.
- `vendor/jspdf.umd.min.js` is the Year 11 project's local PDF library.
- The Scratch editor and Teams links require an internet connection. Scratch Desktop can open the same `.sb3` offline.
- Entering a name of `teacher` is a convenient preview mode, **not** secure authentication. Do not use it for a confidential assessment.
