# BEETLE:BIT · Week 9 Workshop

Static lesson app for Microbit Inventors, KS2/KS3. No build tool, account or server-side database is required. Open `index.html`, or serve the folder with a local static server. GitHub Pages can serve this folder unchanged after an explicitly authorised deployment.

## Classroom use

- Students enter a first name and class, then choose **Build Bench** or **Coding Lab**. They resume from their actual assembly, not step 1.
- Build Bench covers 36 booklet assembly steps, with separate parts, optional video, photo and physical-check cards.
- Coding Lab has 38 small cards: identify boards, power-off preparation, LED button events, real-board upload, ZOOMBIT extension, teacher-led motor checks, move–pause–brake, observation and one-variable modification.
- Parking Lab is a screen-only programming game. Pause lets the virtual motors continue; brake stops them. Screen distance is not a real-robot prediction.
- Enter `teacher` as the name to review any coding card and see the 08:30–09:50 teacher reference. This is a convenience preview, **not secure authentication**.
- Missing/faulty parts: pupils identify the part, issue, quantity, assembly step and box. They must show the report and actual part to Mr Kang so replacements or purchases can be arranged.
- Save & pack uses five short cards. Save both the MakeCode `.hex` and the separate workshop JSON backup.

## Safety and limitations

The app cannot inspect hardware or authorise power. Student-recorded checkpoints, restored progress and teacher preview never grant physical approval. Mr Kang must inspect fixings, wiring, cable clearance and battery polarity, then supervise each powered test. Start with securely supported raised wheels before a marked floor area. Disconnect all power before adjustment.

The example uses ZOOMBIT `move forward 100`, `pause 500 ms`, then `brake`; startup and B also brake. These are starting lesson settings, not certified safe values for every kit. **Physically bench-test your actual kit before class.** Press A only once and wait; B is a programmed brake, not a safety-rated emergency stop. The teacher retains physical power control. No gripper endpoint test is included: calibration must happen first.

Booklet differences are flagged: unspecified long motor fixing size; step 14 bolt size missing from inventory; short-stand quantities and gripper fixing revisions. Booklet p.40/p.41 reverse A/B turn descriptions; the app uses an explicitly adapted forward/brake example instead. The p.31 dual cable picture includes a barrel plug; this classroom LED-only test deliberately leaves it disconnected.

## Privacy and dependencies

Progress and part reports stay in the browser's local storage, separated by entered name/class. The app does not send reports, email the teacher, synchronise devices, or provide a central dashboard. Teacher CSV export covers **only this browser**. Anyone using that browser may access its records; use school-managed devices and first names only. Browser clearing/private browsing can erase progress. Keep private backups, CSVs and pupil responses out of the public repository.

Booklet photos and screenshots are local assets. Internet is needed for MakeCode, external help and videos. YouTube embeds load only after Play, with a direct-link fallback. Google Fonts are optional; system fonts are the fallback. Nothing autoplays.

## Sources and visual credits

- Cytron, *202602 BEETLEBIT Quick Start Guide*, user-supplied February 2026 edition. Included images are selected teaching reference pages/crops, not the complete PDF. Copyright remains with Cytron.
- [Official resource hub](https://beetlebit-hub.cytron.io/) and [setup guide](https://beetlebit-hub.cytron.io/chapter-resources/beetlebit-setup-guide).
- [Chapter 2: TT motors](https://beetlebit-hub.cytron.io/chapter-resources/chapter-2), [Chapter 3: servo gripper](https://beetlebit-hub.cytron.io/chapter-resources/chapter-3). Official video IDs: `uMzD8UFlGDc`, `lY3kOSvGrps`, `qlwQxpb_ivg`.
- [Cytron ZOOMBIT extension](https://github.com/CytronTechnologies/pxt-zoombit).
- [micro:bit upload instructions](https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/) and [safety](https://microbit.org/get-started/user-guide/safety/).
- MakeCode visuals are genuine browser screenshots captured 16 October 2026, cropped without redrawing the blocks. The screenshot code matches the app's optional source. Screenshots/Blocks conversion are software checks, not a physical robot test.
- Motor-fixing photo supplied by Mr Kang; no exact replacement diameter or length is claimed.

Lesson approach: predict–run–investigate–modify, short worked examples, paired checking, evidence-based checkpoints, one-variable testing and an independent extension while waiting for teacher attention. No school lesson-template headings or WAGPA are imposed.
