# Year 10: Linear and Binary Search

Static HTML/CSS/JavaScript for GitHub Pages. No build, Vercel, pupil email accounts or Python installation. This is a reading/tracing lesson; full Python search implementation belongs in the following session.

## Open the lesson

- `index.html`: student Name/Class entry and one-question-per-page lesson.
- **Teacher preview · no login**: inspect every page without answering or watching videos. Separate local preview notebook; not a real pupil session. Preview is a convenience, not secure assessment access control.
- `teacher.html`: existing approved teacher account for live controls and private records. **Rehearse controls** uses clearly labelled sample data and never reads school pupil records.
- Open the projector from teacher controls. Share only that projector window. The Topic, WAGBA/KSU, Keywords and Challenge remain visible while content changes. The read-only projector link uses a private, revocable four-hour capability; do not share it with students.

The projector follows the supplied TTA Lesson Template PowerPoint frame: a white 16:9 slide, the original square outlined Topic/WAGBA/Keywords boxes, the wide bottom Challenge Task box, Raleway type, green stage heading and the original Tenby/ISP logo at its original position. The starter keeps its taller WAGBA box. A shared timer occupies the template’s top-right timer area. The entire slide scales together and letterboxes on other screen ratios; school boxes never rearrange into a website sidebar. Long class responses can scroll or be enlarged without moving the branding frame. This changes only projector presentation, not lesson questions, records or permissions.

## Teacher workflow

1. Sign in, open the school-template projector, and click **Enable classroom sound** once if wanted. Sound comes from the teacher device; use the classroom audio output.
2. Select a stage to start its independent-work timer. **Main 1** and **Main 2** arm their discussion questions automatically at zero. Invitations appear 20 seconds before a scheduled question. Use **Hold next automatic question** if the class needs more teaching.
3. **Pause**, **+30 seconds** and **Bring class together** are immediately visible. The response-window selector applies to manually started questions; automatically armed questions default to three minutes.
4. Students can dismiss an invitation and rejoin via the labelled bottom button. Opening a question pauses their video without unlocking later pages. The website cannot bring a background tab to the front or control other applications.
5. View Submitted / Attempting responses privately. End the response window early or let it close at zero. Submitted answers then appear anonymously on the projector, with the model on the right. Hold/reveal the model as needed.
6. Select a response to discuss it; use **Show all responses** on the projector to return to the grid. Drafts never appear publicly.
7. After responses close, use **Award house point** directly on a submitted response card—no detail dialog required. The button changes to **House point awarded** and prevents duplicate awards. Existing private feedback is preserved. Correct MCQs receive one point automatically after closing; written responses are teacher-marked. The pupil and anonymous projector response show +1, with a brief celebration on each connected screen. These are **lesson recognition points, not official iSAMS entries**; enter official points separately. No speed scoring or public low-score rankings.
8. **Resume normal cue** ends the discussion signal and restores normal instructions without advancing the student’s personal page. Unused independent-work time resumes when available; otherwise choose the next stage or add time. Teacher stage controls do not silently bypass required video study.

Students see their own submitted answer, revealed model, private feedback and point award update on their device. A small non-blocking board-attention notice can be minimised, but remains available until the teacher resumes the normal cue (or deliberately starts a new normal stage). It never forces students away from their own work. **Look at the board** can also signal a teacher explanation without opening a question. It pauses independent-work time; normal cue resumes it. Point totals are personal and update after school confirmation. A short, silent celebration replaces the old badge-only highlight; reduced-motion users see a static congratulatory banner. Existing awards do not replay on first connection, and repeated polling does not repeat celebrations. Points are classroom recognition, not an automatic iSAMS entry.

## Learning and support

Starter → Types of Learning → Main 1 Linear → Main 2 Binary → Extension/supported completion → Learning Pit Stop → Plenary → Save/submit.

Use the same library-number list throughout: `[5,9,13,18,24,31,42]`. Distinguish index, current value and target. Linear model: early-stopping WHILE. Binary model: iterative, lower-midpoint integer division, original indexes retained. Six original SVG diagrams, visible descriptions, manual step pointers, readable numbered pseudocode and adjustable code size support tracing. Open questions have explicit sentence frames and thinking prompts. Corrected answers and model use are separate from first attempts. A paper-completion tick is not an automatic correctness mark.

Three-page paper booklet and teaching key are under `resources/`. Students can write on paper and add photos rather than retype a full trace. Digital tracing is an alternative, not compulsory duplicate work. Teachers review written decisions even when numerical trace values match.

Quiet written help/pause requests are saved, but a saved request is not proof the teacher has seen it. Use the agreed classroom signal for immediate help. No repeated invitation after dismissal, constant ticking, flashing countdown or forced audio on pupils’ devices. A visible response countdown appears in the invitation, the persistent/minimised notice and the joined question. Below half of the allotted response time, unsubmitted pupils see a red **Respond now · select Submit** reminder and one brief shake per round (no shake with reduced motion). The server supplies the full response-window duration, including extensions; pauses do not consume it. Submitting stops the urgency prompt. **Your task** and **Your answer should include** use matching readable headings and text; an optional sentence starter supports explanation without revealing the answer.

## Required YouTube study

- Linear: Craig ’n’ Dave, `0HXBo--PaAw` (full video, approximately 6 minutes).
- Binary: Craig ’n’ Dave, `Sa-4CObj8Ag` (full video, approximately 10 minutes).

These are AQA 8525 third-party videos, not OxfordAQA-produced 9210 films. Both full videos are required, **not just the earlier proposed excerpts**. Full playback includes their code/end sections; allow roughly 16 minutes in the flexible 60-minute lesson. The beginning introduction film has not been supplied and no unrelated timer video is included. No mid-session film automatically plays on the projector.

YouTube IFrame API tracks continuous playback at normal speed. Students can pause and rewind; forward seeks return to the last watched frontier. Hiding the page pauses playback. The next activity stays locked until the video duration has been covered; a forged ended event alone does not complete it. The assigned video ID is checked so a different suggested video cannot satisfy the requirement. This is a learning-flow check, not DRM or proof of attention, listening, identity or comprehension. A student controlling their browser can tamper with local code; do not use this as secure examination proctoring. School filters, connection failures and YouTube restrictions may prevent playback. The approved teacher can record a specific access adjustment, separately from watched completion.

## Saving, privacy and export

Name/Class identities are self-entered. The browser keeps a private random key in its separate IndexedDB records outbox. Only hashes are held server-side. A public publishable key is expected in `config.js`; never add a service-role key, password or JWT.

The landing page checks trimmed names and Year 10 class codes before opening a student notebook. A separate live-discussion status distinguishes connecting, connected, offline and failed connections. Teacher Preview explicitly does not receive classroom invitations. Legacy local records with invalid entry details remain on the device, but cannot block a different valid pupil's upload queue. Export any work needed before changing an old invalid identity.

School records use a new `y10_search_records_private` schema and `y10_search_*`/`y10_search_records_*` functions. Old lesson schemas, records and Auth settings remain unchanged. Tables have RLS and no direct browser-role grants. Student functions verify the device key and return only that student’s own work. Teacher functions verify the existing owner account. The projector capability returns a limited anonymous projection, not private drafts, names, photos or teacher controls.

Live updates use secured short polling (about 1.6 seconds), not a guaranteed instantaneous WebSocket broadcast. Deadlines are server-authoritative, with device clocks adjusted from server time. A due state is resolved on the next connected request; if everybody disconnects, transition is confirmed after reconnection. Private drafts/submissions and revisions are recorded separately. Expired/paused windows reject submission server-side; local drafts remain. Last contact is not attention or verified attendance.

Local saved state, queued school saves and confirmed school saves are distinguished. Offline edits cannot upload while the browser is closed. Keep the browser data and retry when connected. The projector’s branding/instructions remain available if its live connection fails; it shows a connection warning rather than inventing a confirmed transition.

**Export PDF** opens the browser print workflow: choose Save as PDF / Microsoft Print to PDF. The report contains all attempted sections, attempt history, corrections, support, video status, live discussion evidence, reflections and uploaded full paper photographs. Long text wraps; photos fit without cropping. It does not submit to Teams. Students must attach the PDF in the assignment, choose Turn in, and verify confirmation.

Private teacher records can download a pupil’s full event trace, photo evidence and discussion history. Retain/export records under school policy. QA names begin `QA`; exclude them from pupil analysis. Do not infer a learning phase from speed or a final corrected MCQ score alone.

## Curriculum and sources

- OxfordAQA 9210, 3.1.1 and 3.1.3: https://www.oxfordaqa.com/wp-content/uploads/2026/06/oxfordaqa-gcse-computer-science-specification.pdf
- Supplied textbook PDF pages 112–113 and 116–119 (PDF numbering, not verified printed-page numbering).
- Craig ’n’ Dave source videos above, embedded via the official YouTube player/API.
- Paper examples and visuals are original teaching materials, not reproduced past-paper questions. The public teaching key is not a secure test mark scheme.

## Deployment

Serve this folder over HTTP(S), not by double-clicking a `file:` URL. Keep all relative assets together. GitHub Pages needs no package installation. Administrative SQL, test outputs, private traces and delivery ZIPs are retained outside this public lesson folder. No changes to other lessons are required.
