# Year 9 practical — My app: make two choices work

Static MIT App Inventor lesson. Open `index.html` through a local web server or GitHub Pages. No build step. Use `?preview=1` to review all steps without creating a tracked learner record. The student route opens one step at a time and unlocks later steps progressively.

## Learning journey

**WAGBA:** Build and test an app feature that uses the user’s choice to decide which useful response to display.

- Read first: see two expected outcomes; find the theory feature card or choose starting words. Matching theory words can be brought in explicitly from the same browser, with the same name/class.
- Do now: three illustrated checks about input, event and ELSE.
- Types of Learning: six K/S/U starting checks, one per page; the largest new/help count identifies a practice focus. Ties and unselected checks remain visible.
- **Main Task 1 — Open and understand:** open/import `MyChoice_W10`, connect the school iPad, predict, run each starter choice and investigate the matching comparison.
- Short picture quiz break: four questions with feedback.
- **Main Task 2 — Make it your app:** change the title, picture, choices, matching comparison, button and two messages in the **same MIT project**. Each edit has its own page, a specific MIT target, copyable words and an annotated screenshot. Try both choices, then Reset.
- Keep creating: improve response detail or add a picture change inside each existing branch.
- Learning Pit Stop: a confidence phase for K, S and U, with a count summary. Correct quiz answers do not automatically assign a phase.
- Plenary, save, reopen and export the edited `.aia`; attach it in Teams and Turn in. Optional PDF/JSON lesson records are separate from the MIT project.

Suggested 60-minute pacing: Read first 0–4; Do now 4–7; Types of Learning 7–9; Main Task 1 9–23; picture break 23–26; Main Task 2 26–48; further challenge 48–52; Pit Stop/plenary 52–55; save/submit 55–60. The teacher can adjust this to device access and learners’ pace.

## Independent and bilingual support

English or English with Mandarin, enlarged references, vocabulary, optional extra hints, three ready-word examples and an open-ended topic route. Main content uses large local Raleway static fonts with ligatures disabled; Mandarin uses system CJK fonts. No dependency on Google Fonts.

At school use a computer plus school iPad, one iPad switching browser/Companion, or a shared iPad testing turn. Phones are not required at school. A no-device learner can continue building and explicitly record “Not run yet”. The browser model is labelled expected behaviour and never passes an actual MIT test.

`assets/starter/MyChoice_W10.aia` is the previously MIT-imported, exported, reopened and compiled starter. It contains a two-choice Spinner, Click IF/ELSE, two response messages, stale-response clearing and Reset. Reference screenshots are genuine MIT captures from 26 October 2026. Result illustrations are labelled expected. **A live iPad/Companion check of this particular two-choice starter remains pending.** Browser viewport checks are not device verification.

## Saving and privacy

The current release saves progress locally. Students see that school saving is not yet connected. Supabase integration is **prepared but disabled** in `config.js`; the migration has not been applied.

A separate `teacher.html` provides an approved-teacher sign-in and class overview. The student interface contains no teacher-dashboard link. Hiding a link is not the security boundary: database owner checks protect every teacher RPC. The public lesson and public browser key cannot read classmates’ records.

The prepared tracking records this lesson’s answers, app words, navigation, KSU selections, help requests and learner-reported MIT checks. It cannot see inside MIT, Companion, Teams or other tabs. Student names/classes are self-entered labels, not verified accounts. Records resume on the same browser/device; entering the same name elsewhere does not retrieve an existing record. Lesson backups omit the private school-record key.

### Activate Supabase separately

1. In the existing school Supabase project, inspect and apply `supabase/01-live-practical.sql`. It creates an isolated practical schema/RPCs and uses the existing approved lesson-teacher account. It fails if that account is absent or ownership differs. It does not change existing theory records or Auth accounts.
2. Run `supabase/02-verify-access.sql`. All rows should say `true`. This checks installed grants, row-level security and owner guards; it does not replace the functional checks below.
3. On a private local copy only, set `enabled:true` in `config.js`. Keep the existing public project URL/publishable key. Never put a service-role key in browser files.
4. Use a clearly labelled QA learner. Confirm a saved-to-teacher acknowledgement; check answers, help, both-choice reports and KSU appear in the authenticated teacher view. Verify offline/reconnect, refresh/resume and duplicate requests. A browser reference tap must not pass an MIT check; changed choices/messages must clear old test reports.
5. Check anonymous requests cannot call teacher RPCs, a non-owner authenticated account is rejected, and another learner’s ID with the wrong private key cannot load/save its record. Do not enable production tracking until these checks pass.
6. Set `enabled:true` in the final copy and publish only when authorised. Use HTTPS. Teacher sign-in uses the existing approved lesson-teacher account, separately from Supabase administration.

Tracking uses a durable IndexedDB outbox, grouped typing changes, bounded retries, server-confirmed save statuses, private per-record random keys stored only on that device, idempotent write IDs and revision conflict protection. Teacher refresh is polling every five seconds while visible. Student files/screenshots are not uploaded to Supabase.

## Verification for this build

The companion test suite is stored outside this public folder. It covers navigation, bilingual completeness, MCQ order, invalidated test evidence, restore validation, tracking payloads, disabled/preview isolation and asset/schema references. Browser QA checked all 46 pages in bilingual iPad landscape and portrait viewports, plus student entry, catch-up words, feedback, reference enlargement and file/report controls. No live database migration or on-device iPad runtime check has been completed for this build.

Public lesson URL: https://mrdavekang.github.io/cswithmrdave/year9-app-decisions-practical/

School live saving remains disabled until the separate database setup is completed and verified.
