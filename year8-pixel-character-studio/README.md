# Pixel Character Studio

Year 8, Week 11 Theory: a 60-minute creative-computing lesson. Built locally for GitHub Pages; no ChatGPT Sites deployment.

## Open

Student: `index.html`. Teacher preview: enter `teacher` as the name or use `index.html?teacher=1`. Private dashboard: `teacher.html`, using the existing approved Supabase teacher account. Preview is not authorisation to pupil records. The safe projector opens from the signed-in dashboard and displays no pupil roster or answers.

No student account, MakeCode, micro:bit or installation is needed. Static HTTP hosting is recommended; basic drawing also works without a server, subject to browser restrictions. Libraries are bundled locally with licences.

## Learning journey

Mission → three short Do Now checks → Types of Learning evidence checks → Main Task 1 (original A4 16 × 16 paper plan) → Main Task 2 (tool tour, separate practice canvas, own character) → Learning Pit Stop → three increasingly challenging extensions → plenary → save and submit. All 18 steps are visible through the stage navigator and linear Next controls. A wrong answer never traps navigation. Creative completion requires student evidence/checklists; no automatic artistic-quality grade is claimed.

Main Task 1: 12 minutes; Main Task 2 and tool demonstration: 18 minutes. The full 60-minute plan is in `lesson.js`. Two short discussions are designed for 90 seconds of responses and 90 seconds of feedback each, not additional long written tasks.

## Editor

Exact 16 × 16 RGBA bitmap, maximum eight independently named layers. Pencil (1–3 pixels), Eraser, four-connected Fill, Dropper, Line, outlined Rectangle, rectangular selection, Copy/Cut/Paste, Undo/Redo (80 operations), layer visibility, opacity, reorder, duplicate/delete, flip/rotate/move, 1×/4× previews, light/dark backgrounds, image import fitted to 16 × 16, eight named design versions, native PNG and enlarged preview export.

Top layer in the list appears above the others. New layers appear above existing layers. Fill works on the selected layer, not the flattened image. Transparent pixels are not white. Moving a layer beyond the canvas crops pixels; Undo restores them. Copy/paste uses the studio's internal clipboard and has tablet buttons; it does not require system clipboard permission. Keyboard arrows and Space allow single-pixel drawing when the canvas has focus. Shortcuts are scoped to the editor and do not hijack text fields.

Import accepts PNG/JPG/WebP under 8 MB, maximum 8192 pixels on either side. Images are decoded in-browser, resized to 16 × 16 without smoothing and added to a new layer. Original photos are not uploaded by this feature. Students should use original/permitted references, never personal photos. Imported work is a reference, not a substitute for designing their own character.

## Visuals

All production visuals are deterministic 2D vectors or exact pixel drawings; no AI-generated 3D artwork is used. `sprites.js` contains six original family-friendly 16 × 16 designs (each string character is one pixel). The same source draws references, enlarged examples, previews and model imagery. Vector diagrams show the paper plan and editor layout. They remain sharp on zoom. Existing game characters are discussed as design examples, not supplied as copying templates.

Printable: `downloads/Year8_Pixel_Character_A4_Plan.pdf` (one A4 portrait page, 16 columns and 16 rows, large grid, colour key and concise check). The teacher narration is in `downloads/Pixel_Character_Studio_5_Minute_Narration.txt`. No video has been produced or embedded yet.

## EAL and accessibility

Choose English, English + Mandarin or English + Korean on entry; change it in the header. Core reading has Mandarin support; selected introduction/questions also have Korean. A bilingual tool/vocabulary reference remains available alongside the activity. This is targeted language support, not a claim that every sentence has a full professional translation. Home-language drafts, pointing and concise labels are accepted. Teachers can use the three Types of Learning checks and actual work to decide the next demonstration. Learning phases are self-reported experiences, not automatic ability labels.

Focus states, labelled controls, keyboard drawing, tablet-friendly controls, alt text, colour-independent selection borders and reduced-motion support are included. Confetti is suppressed for reduced motion. No flashing effects or speed ranking.

## Saving, tracking and privacy

IndexedDB autosaves state, layers, versions, answers and an acknowledged-event outbox. Fallback is localStorage, then memory with an explicit backup warning. Private browsing may clear storage when closed; download an editable backup first. Reconnect, online and foreground events retry without clearing code/art/progress. Background tabs pause polling. No browser can promise persistence after private browsing closes.

Students register by self-entered name/class. A cryptographically random device capability is hashed in the database; another pupil cannot read/write a session by knowing a name or ID. JSON backups deliberately exclude that capability, and importing starts a new private session. School tracking saves answers, checks, drafts, editor changes and the latest layered design. Drawing actions save the selected-layer pixels for reviewing changes, not a keystroke log. Teachers can export individual/full class evidence privately.

Only this lesson's private Supabase schema and tightly validated functions were added. Tables have RLS enabled and no direct grants to public/anon/authenticated. Teacher reads require the fixed approved account. The public frontend contains only a publishable key, never service credentials. Names are not verified school identities. No other lesson records, Auth accounts or existing permissions were changed.

Live controls: open/resume a class; invite; start 30–300 second answering timer; reveal; demonstrate a separate teacher drawing; follow/improve; return to work; end. Join is code-free and matches class. Original live answers and improvements remain in the student's saved work. Invitations do not automatically navigate students away from their current task. Submitted pupils can return to work before the timer ends. Reinviting preserves answers. Response tiles stay in join order, with explicit ★ +1 buttons. House-point celebrations appear on the pupil device and anonymously on the projector. This is not an iSAMS integration.

Student PDF export captures all scripts/answers/checks in readable rendered blocks, preserving Mandarin/Korean glyphs, plus the final image and named versions. Editable JSON retains layers and raw responses. PDF/PNG downloads do not submit to Teams. The final dialog guides attachment and Turn in; the final checkbox is self-confirmation, not verification through Microsoft APIs.

## Teaching dashboard

The central panel previews the same student lesson in order. Bottom controls advance lesson stages; the right column contains the lesson clock and discussion controls. Response/house-point work opens in a separate window. Teacher notes include suggested answers and cold-call questions. Stage changes affect the projector, not student navigation. The teacher's live example is separate from all pupil work.

Session authentication uses sessionStorage with memory fallback. A separately opened Responses window may need the same teacher sign-in again if the browser prevents session sharing. No credentials are placed in URLs or reports.

## Curriculum and sources

This lesson deliberately consolidates creative computing instead of introducing a new programming topic. It supports KS3 creating/revising digital artefacts for an audience, representation of bitmap images and design/usability reasoning. It is not presented as an OxfordAQA examination-paper lesson.

- [KS3 computing programme of study](https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study/national-curriculum-in-england-computing-programmes-of-study)
- [Microsoft MakeCode Arcade: sprites and image-editor activity](https://arcade.makecode.com/courses/csintro1/intro/sprites)
- [MakeCode art and images: palette and transparency](https://arcade.makecode.com/developer/images)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Limits

The custom editor can use any RGB colour; it is not constrained to the Arcade default 15 visible colours. Today’s four-to-six-colour brief is a teaching constraint. Native PNG export is 16 × 16; the separate enlarged preview is 512 × 512. Versions are design alternatives, not a playable animation timeline. No external art site is required and no student public gallery is created.
