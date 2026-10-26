# Year 9 · One Tap, Two Results

A 60-minute app development theory lesson, following the homepage design and first working app lessons. Students follow a supplied MIT if/else decision, then design and preview one two-response feature for their own app.

## Open the lesson

Open `index.html` directly, or serve this folder with a local static web server. All lesson scripts, illustrations, complete Raleway fonts, screenshot guides and downloads are local. No build, account or network connection is needed for the core activities. MIT and Teams links need an internet connection.

Open `teacher.html` separately for the protected live dashboard. It has no link in the student lesson. The old `?teacher=1` address redirects to this sign-in page. Student navigation unlocks one step at a time. Students can revisit unlocked steps; unanswered checks are kept separate from incorrect responses.

## Lesson sequence

| Stage | Minutes | Outcome |
| --- | ---: | --- |
| Read first | 5 | See the difference between one fixed message and two possible responses. |
| Do now | 4 | Recall input, event and output through three visual MCQs. |
| Types of Learning | 3 | Six KSU checks identify familiar learning and new/help priorities. |
| Main Task 1 | 15 | Try both routes, read highlighted genuine MIT blocks and complete a tap-to-place Parsons activity. |
| Quiz break | 4 | Six short retrieval questions with explanatory feedback; no speed ranking. |
| Main Task 2 | 18 | Explore six visible examples or use an original idea; write two choices and messages and try the preview. |
| Keep creating | 2 | Improve useful detail or inspect the supplied MIT starter. |
| Learning Pit Stop | 3 | Choose a confidence phase separately for Knowledge, Skills and Understanding. |
| Plenary | 3 | Explain a false condition and describe one route through the student's own feature. |
| Save & submit | 3 | Save the learning record as a PDF and attach it to Teams manually. |

Exactly two Main Tasks. Each page focuses on one idea, question or action. The browser preview is a feature simulation, not a live MIT project editor. The feature card is the bridge into the next practical; students do not need to rebuild their previous app during this theory lesson.

## Support and accessibility

- English or English with Mandarin instructions, feedback, vocabulary and guidance.
- Extra guidance and starter words; starting words fill empty fields only, preserving existing work.
- Short responses, visual models, keyboard buttons and tap-to-place blocks; dragging is not required.
- Large text, visible focus, reduced-motion support and local full-Unicode Raleway regular/bold fonts. Mandarin uses the device's Chinese font.
- At tablet widths, WAGBA/KSU remain accessible through a compact expandable panel. Simulations stack on narrow screens.
- In-school use does not require a phone. Core activities work on one computer or iPad. The reference pack includes iPad Companion guidance for the later practical.
- A missed previous lesson is catered for through six openly visible example apps and starting words. Topics remain open-ended.

## Reflections and questions

The six Types of Learning checks use “I understand this”, “This is new to me” and “I need help understanding this”. The highest count of new/help choices identifies the KSU focus, explaining ties and recognising prior knowledge. Unselected checks are separate.

The Pit Stop asks only for a confidence phase in each KSU area. Its majority/tie summary uses those choices, never quiz correctness. It does not ask for a written evidence statement.

MCQ answer positions are randomised and balanced across the question set. Stable option IDs preserve marking, saved answers and order across reload, language changes and backup restores.

## Saving and privacy

The public HTTPS lesson saves the learner’s name, selected class (9E or 9T), current step, answers, checks, app-feature drafts, preview attempts, KSU reflections and help requests to the existing school Supabase service. A bilingual notice explains this before entry. There is no student sign-in. It does not monitor other websites, devices or MIT projects. The teacher page refreshes every five seconds while visible and offers class/name/support filters, individual responses, question patterns and downloads. Quiz correctness never determines confidence phases; unanswered and unchecked responses remain separate.

The dashboard uses the existing approved lesson-teacher email/password account, not the Supabase administration account. Authentication alone is insufficient: each teacher function checks the configured owner’s user ID. The SDK session is in tab memory, and signing out clears private responses from the page. The student page has no teacher-login link. Hiding the link is not the security control: anonymous and unrelated authenticated users cannot retrieve class responses.

Local progress remains under `mrdave-year9-app-decisions-theory-v1`. A durable IndexedDB outbox stores the private per-record resume key and unsent changes before network calls. The database stores its hash. Changes upload after a short pause; typing is grouped rather than recording each keystroke. Failed or offline uploads retry, with the save status reporting whether the school copy was acknowledged. Lost acknowledgements reuse the same write ID, preventing duplicate history. Concurrent-tab revision conflicts pause saving and offer restoration of the school-saved copy after a backup warning. A browser-storage failure is shown instead of claiming a successful school save.

Names/classes are self-entered labels, not verified student identities. A new device or learner record creates a separate dashboard entry. On shared devices use the confirmed “Start a new learner record” action. Keep one lesson tab open. Download a backup before replacing a record or clearing browser data; JSON backups omit the private resume key and tracking ID. Restoring on another device creates a new live record. PDF remains the main Teams hand-in, with readable HTML and JSON backup retained.

`supabase/01-live-learning.sql` documents the isolated lesson schema and narrowly granted functions. Raw tables have RLS and no pupil/teacher direct grants. Anonymous functions require a random private record key for own-record load/save/presence; teacher list/detail/review functions require the approved owner. No service-role secret is shipped. The public publishable key is intentionally public. Existing lessons and teacher grants are unchanged. Administrator-archived test records remain recoverable in the private database and do not appear in the roster.

## Included MIT materials

- `assets/MyChoice_W10.aia`: working Frame Finder starter with two choices, an if/else response, Reset and clearing stale output when the selection changes.
- `assets/Year9_MIT_Choice_Starter_Guide_EN_ZH.pdf`: 24 focused annotated guide pages, also available individually inside the app.
- `assets/Year9_App_Examples_Two_Paths_EN_ZH.pdf`: six illustrated examples with both responses.
- `assets/blocks/`: genuine MIT block crops used by the tutor and Parsons activity.

The starter was imported, saved/exported, reopened and compiled successfully in MIT before this app was built. The exported blocks were checked for both routes and Reset. A live iPad Companion check remains pending because a device was unavailable; expected-result drawings are labelled accordingly. The five other app themes illustrate adaptations, not separate downloadable MIT projects.

MIT App Inventor: https://appinventor.mit.edu/ . The starter remains a separate study project; keep previous student projects. Raleway is distributed with its Open Font License in `assets/OFL.txt`.

## Delivery

Student link: https://mrdavekang.github.io/cswithmrdave/year9-app-decisions-theory/

Teacher view: https://mrdavekang.github.io/cswithmrdave/year9-app-decisions-theory/teacher.html . Students can open the lesson without signing in. Refresh previously open student tabs once to load live saving. MIT and Teams still require their own sign-in when used. QA scripts, screenshots and test records are kept outside the public folder.
