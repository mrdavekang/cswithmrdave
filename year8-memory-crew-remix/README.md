# Memory Crew Remix — Year 8 Week 10 Practical

A static, local/GitHub Pages tutorial. This is a separate lesson from the original Week 9 Memory Crew app; that app and its saved records are unchanged. No ChatGPT Site is created.

## Learning design

The Scheme of Learning’s Term 1 Week 10 practical is a core game loop, random prompt/pattern and score display. This Arcade adaptation builds on Week 9’s indexed route: students make A choose a valid random clue, then make B generate a fresh list with a while loop. The prepared engine draws the screen, checks answers and awards points. Students do not claim to have written that engine. A loop that grows a list illustrates progress towards a false condition without an extra counter.

One continuous tutorial, with a contents rail and no card-by-card unlocking. Screenshots, expected behaviour and instructions stay together. Code view switches all relevant examples between Blocks and Arcade Python. There are no sentence-matching gates. Self-reported test results do not prove the separate Arcade project works; teacher observation and the editable project provide that evidence.

Suggested 60 minutes: Mission 3; Do Now 4; Types of Learning 3; starter/editor setup 8; Main Task 1 12; Main Task 2 15; further challenge 5; Pit Stop 3; Plenary 3; export/submission 4. Fast finishers can start extensions during the main tasks. The review games and mascot are after-plenary / remaining-time choices, not extra core requirements to squeeze into 60 minutes.

## Student / teacher entry

Students enter a name, class, reading support and code choice. Enter `teacher` or use `?teacher=1` for separate preview storage and visible hosting links. This is a convenience mode, not secure teacher authentication or permission to read private records. No Supabase tracking is activated for this new lesson.

English remains visible. Mandarin and Korean provide core readings, task instructions and reflection support. Not every screenshot, English distractor or browser label is translated. Language support is independent of ability. Code remains valid Arcade Python, not standard CPython or micro:bit MicroPython.

## Arcade projects and guides

`links.js` holds the verified model and starter share links. `projects/` contains `.mkcd` import fallbacks and editable source. Model: random A question and B loop already complete. Starter: working fixed-index A and fixed-route B so learners can begin successfully. The prepared engine supports 3–5 clues, 300–3000 ms clue display and 1–5 points per correct answer. Random values and directions can repeat.

Every guide in `assets/` is based on a real Arcade/editor or simulator capture, with annotations. Image dimensions reserve layout space so lazy loading does not shift navigation targets. The starter editor is reused while the lesson stays open. After refresh, reopening asks for confirmation to avoid accidentally replacing ongoing work with a fresh starter.

The mascot task uses Sprites → sprite image editor and a 16 × 16 canvas. It is separate from the core list tasks. Meeting its criteria lets a pupil request teacher review; the page does not award house points automatically.

## Save, evidence and PDF

Lightweight responses and meaningful input history save in localStorage per name/class. Screenshot evidence saves compressed in IndexedDB. Screenshot file upload and paste are supported, with a 12 MB input limit and 1600-pixel maximum stored dimension. Avoid photographs of pupils or other personal information. A pupil can instead ask the teacher to observe their code.

JSON export/import includes the responses and screenshot, not the separate Arcade source. Import validates the lesson/version and confirms replacement. Browser clearing or private browsing can lose work; download a backup before changing devices.

PDF export uses local jsPDF with direct canvas text layout and installed device fonts to retain Mandarin/Korean without slow screenshot cloning. It includes unfinished answers, current responses, evidence and activity history. Very long histories can make long reports. A print-to-PDF fallback is available. The app cannot verify an operating-system download or Teams submission. Turn-in confirmation is the pupil’s own report.

Students retain both the lesson PDF and Arcade editable PNG cartridge, and attach them to the teacher’s Teams practical assignment when available. A screenshot or PDF is not a substitute for the editable Arcade project.

## Review games

Two separately authored, public 15-question sets cover the lesson. Gimkit focuses on core concepts; Blooket focuses on applying/debugging them. Teacher preview shows set/host links; pupils see normal join-by-code links. Nothing automatically starts a live game or creates homework. Creator accounts are not required for pupil join-by-code participation.

## Hosting and dependencies

Serve this folder unchanged as static files. Offline tutorial reading works locally, but opening Arcade and the hosted review games requires internet access. Image storage and download behaviour depend on the browser. No essential script/font library uses a CDN. Do not add private pupil records or QA exports to this public folder.

References: [Arcade arrays](https://arcade.makecode.com/types/array), [random array item](https://arcade.makecode.com/reference/arrays/pick-random), [score changes](https://arcade.makecode.com/reference/info/change-score-by), [while loops](https://arcade.makecode.com/blocks/loops/while).

Original teaching code and annotations by CS with Mr Dave. Raleway uses the SIL Open Font License, included in assets. jsPDF and html2canvas license notices are included in vendor.
