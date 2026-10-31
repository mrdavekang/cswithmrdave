# Year 9T live app-design discussions (31 October 2026)

## Status and access

The teacher approved activation and publication on 31 October 2026. The school database migration is active: six private tables have RLS enabled, anonymous teacher access is denied, and direct pupil table reads are denied. The Year 9T student entry for GitHub Pages is `/cswithmrdave/year9-app-decisions-theory/9t.html`. The regular student entry remains `9t.html` (or choose 9T on the original landing page); the private dashboard remains `teacher.html`. The original Year 9E student app, all independent lesson records and the English/Mandarin research/drawing tasks and WAGOLL packs are preserved.

Teacher sign-in is still the existing approved Supabase teacher account. Preview URLs never grant access. The dashboard uses the approved independent-record API as its initial access check, so **All lesson answers & progress remains available even before the new classroom migration is activated**. The two main dashboard areas are live class/discussions and existing independent evidence. Do not project the dashboard: use its separate safe TTA projector link.

## Two short discussions inside the existing Main Tasks

The 60-minute plan includes two teacher-controlled five-minute cycles, not two additional Main Tasks. Main Task 1 remains one research workspace (including its discussion); Main Task 2 remains one drawing workspace (including its discussion).

- Minutes 22–27: **A feature worth borrowing**. Suggest clear labels for three colour buttons and explain how they help a new user. K/U focus; short English or Mandarin phrases accepted.
- Minutes 50–55: **Make the tap and result clear**. Improve a vague music-app plan with a specific button, visible response and user benefit. S/U focus; return the method to the pupil's own drawing.
- Each cycle offers 3 minutes responding, about 1 minute comparing ideas and about 1 minute improving. The teacher starts every phase; the lesson clock only suggests stages. Discussion and follow-along can be left open or adjusted to the class pace.

This is design theory, so live answers are ordinary text, not Python code. There is no irrelevant Run/Stop step. The teacher can edit and broadcast a worked answer and the app response a user would see. Neither is executable MIT code or a runnable student app.

## Student experience

Students enter their name on the existing 9T route (class is already 9T), or choose 9T on the original landing page. No live join code or pupil account is added. A random device capability joins only the active class. Names remain self-entered and unverified. If no live class is open, they work independently; live errors do not block lesson navigation or the existing save outbox.

An invitation appears at the bottom without moving the student. Joining opens a separate dialog and preserves the exact independent workspace underneath. The response countdown is based on server time. Below half the allotted time it turns red and gives a brief nudge only to unsubmitted students. Submitted students see “Response sent · keep working” and can return immediately. The invitation remains available. Reopening retains answers. The first-response and model-supported improvement workspaces are separate; the teacher example never overwrites a student's draft.

The new prompts, success checks, support controls and examples include Mandarin. The updated English/Mandarin WAGOLL images and printable packs are unchanged by this feature. No school phone, Companion device or block editor is required for these discussions.

## Teacher workflow and evidence

Open/resume 9T; opening the same active session does not wipe it. Previous sessions remain selectable. Invite checkpoint 1 or 2, then start the response window. Pause/resume and +30/+60 seconds are available. Discuss gives an eyes-to-board cue. Reveal a worked model, then open Follow along or a timed one-minute improvement. Release returns pupils to independent work; End class retains the records.

The live grid uses permanent student IDs and joining order. Existing tile DOM nodes are updated instead of rebuilding/reordering the grid on polls. Search hides matches without changing their order. The +1 button is beside each name. Private details show first response, improvement and append-only draft/send events. The independent evidence tab shows actual digital answers, KSU, Pit Stop and help/history. Paper completion remains self-reported: inspect Sections A and B separately. Missing work, completion or typing speed never assigns attainment or a confidence phase.

House points are a classroom ledger, **not automatic iSAMS awards**. Commands have unique IDs; repeated delivery does not double-award. Undo reverses the ledger entry. A brief top-right pupil celebration can appear above the response dialog using the browser top layer. Reduced-motion CSS provides a static celebration. The projector uses anonymous “A learner”; database constraints keep name-sharing off.

## Saving, backup and privacy

Independent work keeps the existing durable IndexedDB outbox. Live text changes are grouped after an 800 ms pause, not keylogged. The dedicated live schema stores all acknowledged response versions and timestamps. Local work keeps up to eight checkpoint workspaces and twelve recent draft revisions per workspace, trimmed further only to keep the school snapshot below its size limit. A live draft is kept locally on errors and can be sent again when the window opens; there is no claim that a failed send reached the teacher.

The student PDF and JSON backup include first answers and improvements, but no membership capability, teacher credential or projector key. Restoring a backup creates fresh access and imports live responses as unsent drafts; it never claims a submission under another device's membership. The private teacher export combines independent events with full dedicated live histories where the stored student/room link is available. The safe projector receives only lesson state, teacher examples and recent anonymous celebrations—no roster, pupil responses or code. Sounds are off until explicitly enabled; mute and volume controls are supplied.

## Activation after approval

1. Review `supabase/02-live-classroom.sql` and apply it as the database owner only after approval. It reuses `y9_app_decisions_private.owner()` from the existing lesson migration.
2. The additive/idempotent migration creates the lesson-only `y9_app_design_live` schema and six private RLS tables. There are no destructive changes, new teacher accounts, broader teacher grants, Auth changes, exposed-schema changes or Realtime-publication changes. The raw tables have no anonymous/authenticated grants. Narrow RPCs validate teacher ownership and random pupil capabilities.
3. Sign in as the approved teacher, open/resume 9T, open the safe projector and verify with teacher-approved dummy identities before classroom use.
4. Commit/push/publish only when separately requested. No QA fixtures, pupil exports or service-role keys belong in GitHub.

## Verification

The implementation was exercised in a separate in-memory PostgreSQL/PGlite database with dummy identities. Checks cover permission denial, class separation, response versions, pause/extension/expiry, duplicate awards and Undo, anonymous projector data, reopen retention and backup sanitation. Browser review used that isolated database, not school records. It covered entry/invitations, sending and exact workspace return, a separate improvement, teacher broadcasts reaching pupil/projector, Mandarin text, refresh recovery, stable joining order/search and the existing evidence view. Responsive CSS stacks discussion cards below 950px; a physical iPad was not tested in this run.

---

# Year 9T theory revision (30 October 2026)

Year 9T entry: `9t.html`, or select 9T on the existing landing page. The `?class=9T` entry also routes to this version. Year 9E keeps the original lesson. Existing browser records are not overwritten. The new edition has a separate local-storage key and durable outbox, and reuses the existing secure lesson RPCs without database or authentication changes.

Seven directly accessible workspaces replace the fragmented Year 9T flow. Two Main Tasks only:

1. **Research**: study original MIT Gallery images/descriptions for two apps. Discuss purpose, controls and feedback. Complete **Section A, page 1**, of the paper pack. There is no block manipulation task.
2. **Draw**: continue the existing app topic; sketch one useful improvement. Complete **Section B, page 2, boxes 1–3 and the bottom explanation**. Both annotated WAGOLL examples are shown together; pages 3–4 of the pack contain their full versions. Every paper direction says to collect a copy from Mr Dave if missing.

English or English/Mandarin; full Unicode Raleway fonts retained; large text, touch targets and responsive layout. Main Tasks stay in one workspace. KSU starting points share one table; the Pit Stop shares another table. Their summaries use actual selections, not quiz correctness. Three short design MCQs have balanced shuffled positions saved across reload and language changes.

## Gallery and sign-in

Gallery pictures/descriptions are sufficient for the core research. Embedded images are original, small Gallery uploads and are labelled as such. They are not runnable apps. The school-email sign-in guidance explains the existing MIT account and separate MIT password. The signed-in Gallery-to-Designer handoff remains **pending the teacher’s live check**, as requested; the lesson does not claim it was tested. If a load link opens a guest/Google route, pupils return to the pictures and ask for help. No phone, Companion or MIT block editor is required for this theory lesson. A downloaded starter is not the required output.

## Paper and tracking

`assets/studio/Year9T_App_Research_and_Drawing_Pack_EN_ZH.pdf`: four A3 landscape pages. Student work is research plus an annotated drawing on paper. The website saves selection/check/confidence/help metadata. A completion tick is self-reported, **not proof the teacher has seen the drawing**. No paper image, MIT credentials or activity on external sites is captured. The protected dashboard labels this edition separately, uses the correct design questions and shows paper completion statuses. Existing Year 9E records use their original labels and questions.

Open `9t.html?preview=1` for QA. Preview uses separate local storage and never creates a school record or sends live requests. No student data or QA artefacts belong in the public lesson folder. Teacher authentication and database access controls are unchanged.

Original Gallery sources (MIT Gallery CC BY-SA):
- PaintPot1: https://gallery.appinventor.mit.edu/?galleryid=5486798015823872
- IHaveADream: https://gallery.appinventor.mit.edu/?galleryid=6405201777917952
- ColoredDots_with_background: https://gallery.appinventor.mit.edu/?galleryid=5560927104532480

WAGOLL pages are teacher-created concept drawings, not screenshots of a working MIT app.

---

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
