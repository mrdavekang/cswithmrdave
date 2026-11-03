# Year 6 Week 11 — Warning Counter

## Open the lesson

- `index.html`: pupil lesson. Type a name and class (for example `6T` or `6E`). Partners are optional; pupils can continue alone at home.
- `teacher.html`: teacher presentation workspace, available immediately in preview.
- `teacher.html?demo=1`: synthetic classroom practice. No dummy names or answers are sent to Supabase.
- Student preview opens separately and uses its own device storage. It does not replace or overwrite pupil work.

## Teach from the dashboard

The 22 TTA teaching slides follow the core pupil sequence. Their allowances total exactly 60 minutes. The Learning Pitstop follows Main Task 2. Optional Grove branches remain in the separate student preview, not in the projected workspace.

The projected frames now use the original supplied TTA template artwork and
measured 1280 × 720 box positions. Do Now and Main Task retain their distinct
left Topic, WAGBA (KSU) and Keywords boxes, the broad bottom Challenge Task box
and original lower-right logos. Types of Learning retains the original
Definition of Learning panel with one active school KSU poster and today's
goal. Learning Pitstop retains the school wheel and four-phase poster. Plenary
retains the original background and characters. Teaching text stays live HTML,
with English, Mandarin and Korean support; the timer controls remain separate
from the template furniture. The original Do Now timer video placeholder is
replaced by the actual selected-slide countdown, not a fixed five-minute image.

Use Previous, Next or Go to slide. Once the slide timer is started, it follows navigation; revisiting a slide keeps the time already spent there. Pause freezes slide and lesson clocks. Refresh preserves the clock anchor and teaching position. Reset slide time restores only that slide’s allowance, not total lesson time. Overtime never advances slides or stops pupil programming.

Reveal next part and Replay explanation change only the explanation. Teacher models are deliberately revealed with a separate button. Neither action changes response windows or clocks.

## Protected live classroom

Protected Week 11 live storage was activated in the existing Supabase project on 3 November 2026. If the connection is unavailable, slides, local saving, MakeCode guides, backups and PDF export still work. No hidden button is treated as a security boundary.

1. Select **Teacher sign-in** in the header, or use the open sign-in panel at the top of the right-hand controls.
2. Sign in with the existing approved Year 6 Supabase account. This app does not create accounts or passwords.
3. Choose `6T` or `6E`, then **Open / resume class**. Students use their normal lesson URL and type the matching class. No student password or separate account.
4. **Open projector** opens the same shared TTA slide renderer with a short-lived, read-only presentation link. Only slides, deliberate models, class phase and timers are available to it.
5. **Student responses** opens a separate private window. Keep it on the teacher display, never the projector. It lists first and later responses, drafts versus submitted work, saved answers, help flags and progress. Positions do not rearrange as updates arrive. Not attempted is not scored as incorrect.

### Three live questions

Shortcuts select a slide and its allowance only. They do **not** invite, start response time, reveal an answer or interrupt independent work.

When ready, select **Invite pupils to this question**, then **Start student response time**. This separate timer is labelled Student response time. Reasons are optional and supported by sentence prompts and keywords. Pause / close responses explicitly. Reveal the model when appropriate; **Open an improvement round** explicitly allows a later answer without replacing the first. **Return pupils to their own lesson** dismisses the class prompt; pupils retain their place throughout.

The dashboard refreshes live state every 3 seconds; the responses window every 3.5 seconds. A missing connection keeps local pupil work and the last slide, without pretending it has synced. An open class expires after 8 hours; teacher heartbeat inactivity removes live invitations after 2 minutes. End a session to stop invitations while keeping records.

## Saving and privacy

- Pupil answers and progress save on the device, with queued cloud updates when tracking is active. Actual code remains in MakeCode. Clicking “I tried” is self-report, not proof of working code.
- First committed choices / written explanations are preserved separately from latest work. The first written answer is committed on leaving the field or moving to another card, not at the first keystroke.
- A JSON backup contains the pupil’s private recovery key for their own record. Keep it private; do not upload it to Teams or a public repository. The app never sends this key to the projector or private class export.
- If an older backup conflicts with a newer school copy, the app keeps local work and offers **Load my newer school copy**. It never silently overwrites either version. Download a local JSON first if needed.
- Pupil submission remains **PDF + MakeCode HEX** in Teams, followed by **Turn in**. Downloads and cloud syncing are not Teams submission.
- Approved teacher records are server-authorised. Public student calls require the individual record’s random 256-bit key. Public projector calls can return only safe presentation state. Database tables have RLS and no direct anonymous/authenticated table grants.
- No passwords, teacher email, pupil data, database scripts or test fixtures belong in public assets. Browser configuration contains only the public publishable key.

English is always visible; Mandarin and Korean support can be selected. Actual MakeCode block labels remain as shown in the editor. School KSU and Pitstop posters are reused unchanged.

## Live tracking — activated 3 November 2026

Open teacher.html and select **Teacher sign-in** in the header. The sign-in panel is also open at the top of the right-hand controls. Use the same approved Year 6 email/password as Week 10; this is a Supabase teacher account, not automatically a Teams account. Choose 6T or 6E and select **Open / resume class**. Then open **Student responses** in a private window, not on the projector.

Tracking saves pupil identity, lesson answers, progress and help requests to the protected Week 11 database. Pupils can access only their own capability-protected lesson record. Teacher records require the approved signed-in account. Existing lessons and their permissions are unchanged. No new account or password is created by the app.
