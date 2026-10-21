# Eco-Budget Lab - Year 7 Week 9 Practical

A buildless, 60-minute introduction to a real Excel workbook. No Python, formulas, accounts, backend or paid service is required by this web app. Pupils need school-approved Excel access to complete the real workbook task.

## Open and deploy

Serve this folder on a static web host, or place its contents in a GitHub Pages subfolder. Keep `assets/`, `downloads/` and `videos/` beside `index.html`. No build or package installation is needed. A local HTTP server is recommended over `file://`, especially for video subtitles and iPads.

For a local preview: `python3 -m http.server 8823` from this folder, then open the printed local address. Another device cannot access the laptop's `127.0.0.1` address; use the deployed school-approved URL for pupils.

The supplied ZIP is GitHub-ready, but creating it does not push to the user's GitHub repository or publish Teams resources.

## Lesson flow and timing

| Stage | Minutes | Purpose |
|---|---|---|
| Welcome | 0-3 | Fictional RM120 class celebration scenario and clear end product |
| Do now | 3-8 | Labelled information and a B2 cell-finding warm-up |
| Types of learning | 8-12 | Learning definition, then separate knowledge, skills and understanding reflections |
| Main task 1 | 12-27 | Column, row, cell, address and input concepts; one check at a time |
| Main task 2 | 27-47 | Open Excel, name/store a copy, make four edits, save and reopen |
| Extra challenges | 47-52 | Repeatable Cell Hunter and Input Fixer rounds; leave when class time ends |
| Learning pitstop | 52-55 | Current phase and one useful next step |
| Plenary | 55-59 | Three short checks |
| Finish | 59-60 | Review the saved workbook and teacher hand-in instructions |

25 cards; 23 core steps. Opening a card is not completion. A checked attempt counts even if incorrect: feedback explains the idea and allows continuing. Reflections need a choice, not a particular opinion or keyword. No mandatory screenshots or written paragraphs. The Excel buttons record pupil confirmations, not automated workbook verification.

## Teacher preview

Enter `teacher` as the name, case-insensitive. No class is required. Every stage opens immediately, in a separate local preview record. Next also allows previewing cards without entering pupil answers; merely previewing a card does not complete it. Use a different test-pupil name to test pupil validation. This is a convenience for lesson review, not authentication or a protected teacher dashboard.

## Narrated lesson videos

Six local MP4s contain the teacher's English narration, quiet original sound effects, and English / Simplified Mandarin subtitle tracks. External WebVTT captions are also supplied, with an always-visible subtitle selector in each player. **English + Mandarin is the default:** each cue shows English above Simplified Mandarin at the same time. English-only, Mandarin-only and Off remain available. One combined native caption track avoids overlapping independent tracks and also works with native full-screen video. Existing profiles switch to the bilingual default once; subsequent choices are remembered, without resetting answers or video end checks. Videos never autoplay. Native controls allow pause, seeking and full screen; `playsinline` supports staying on the lesson page on iPad. Completed guides collapse to Watch again so the activity stays the main focus.

| Card | Video | Requirement |
|---|---|---|
| Welcome | Our Eco-Budget mission (3:34) | Not mandatory: pupils can continue without playing it |
| Do now: tiny grid warm-up | Guide 1: Find a cell (0:48) | Required on laptop and iPad before the grid activity |
| Main task 2: open workbook | Guide 2: Open starter (1:02) | Required for the laptop route |
| Main task 2: own copy | Guide 4: Give the workbook a home (1:04) | Required for the laptop route |
| Main task 2: first B2 edit | Guide 6: Edit and confirm (1:00) | Required for the laptop route |
| Main task 2: save check | Guide 8: Save and reopen (1:16) | Required for the laptop route |

Pupils first see the required video alone, with a clear next action. Once the player reaches the end, Start activity is enabled and reveals the original activity. This does **not** demand uninterrupted playback or a particular wall-clock viewing time. Seeking to the final moment counts, as requested. An `ended` event or a seek/playback position within the final fraction of a second records completion. It does not prove attention, comprehension or full-length viewing. Existing answer checks still require an attempted response and feedback, not a perfect answer.

The four laptop demonstrations are genuine Excel-for-web guides, not iPad footage. On the iPad route those four cards retain the written iPad-app instructions and a visible explanation that iPad videos are pending. Pupils are not blocked by missing files or forced to watch an inappropriate laptop guide. Do not replace this note with simulated iPad footage.

Video position, version, end status, completion method and activity-unlock status save per local pupil profile and in JSON backups. A refresh resumes progress; completed guides do not need repeating. Earlier backups remain compatible. Stage navigation and restored older progress cannot bypass an uncompleted required video. Choosing a different device applies the appropriate guide requirements. Teacher preview bypasses gates without completing any pupil record.

Video help offers retry, a separate player and an explicit **teacher-confirmed classroom viewing** route for playback/access problems. It requires a teacher confirmation checkbox and is logged as `teacher-alternative`, not as a player end event. Like the teacher-preview shortcut, this is a local classroom convenience, not authenticated access control. It prevents technical failures from permanently trapping pupils. There is no central watching dashboard or secure exam proctoring.

Deploy all six MP4 files, the six posters and the eighteen `.vtt` files under `videos/`. No Korean subtitle option or track is included. No pupil records, audio editing files, Blender projects or private screenshots belong in the public lesson folder.

## Real Excel workbook

`downloads/Year7_Week9_Eco_Budget_Starter.xlsx` is the unchanged original starter, with one Eco-Budget sheet. All cells remain editable. Today change B2 to 28; choose an activity in B7; change B8 to 28 and C4 to 4. Keep B9 at 120 and B4 at 2. B2 and B8 are independent, manually entered inputs. No formulas or totals are introduced today.

Prefer an individual editable copy in Teams. Do not ask pupils to duplicate that copy again. If distributing a download or shared starter, pupils need to create a named school-storage copy before editing. A workbook only saved locally in Downloads or On My iPad is not a school cloud copy.

`config.js` has an empty `teamsAssignmentUrl`. Add the genuine assignment URL after it exists. No fictional Teams assignment or location has been invented. The finish page otherwise tells pupils to follow the teacher's hand-in instructions. Do not put a shared editable whole-class workbook link there.

## Device and language support

English and English + Mandarin are available from the landing page and always-visible language menu. Core reading, goals, answers, feedback, hints, device steps and reflections have Mandarin support. Computing terms and workbook activity names remain in English alongside support so that pupils can locate them in Excel. Chinese glyphs use the device's built-in fonts; English uses the bundled Raleway font.

Pupils choose laptop or iPad guidance. The iPad route uses the Excel app and includes App Store / read-only troubleshooting in visible Device help. App menu labels can vary. Screenshots are genuine Excel-for-web captures, explicitly labelled as such, not simulated iPad screenshots. Core concepts are existing lesson diagrams. Every image can be enlarged; equivalent concepts are given as selectable HTML text.

Before class, test one pupil account on an actual iPad: opening, entering a value, confirming an edit, school storage and reopening. Native iPad Excel and laptop desktop Excel have not been controlled by this build's browser tests. Responsive browser checks do not constitute real iPad-app testing. Check school account licences and edit permissions separately.

## Progress and backup

### BlastRoom after plenary

The Finish page has a bilingual extra-challenge panel, enabled only when `config.js` contains a genuine verified `blastroomSetUrl` for the 15-question Eco-Budget set. Pupils use the large Join button and ask the teacher for a current room code; a separate expandable set link lets the teacher host it. This is not a permanently open assignment. The link must not gate lesson completion or require a full pupil name. If no game is running, pupils can return to Cell Quest. Only link openings are recorded locally; BlastRoom answers and scores are not imported. No quiz questions or image files are sent to BlastRoom by the local application.

If the set URL is empty, pupils see no unfinished quiz button; teacher preview explains that uploading/sign-in is still needed. Do not substitute a placeholder or unrelated quiz URL. No ChatGPT Site or GitHub deployment is made by editing these local files.

Practice, settings, reflections, meaningful help/image actions and challenge attempts save in localStorage under this lesson ID, name and class. Teacher storage is separate. Browser storage is not secure identity: pupils with the same name/class on the same browser share a record. On shared devices, choose only your own record and switch learner afterwards. No passwords, pupil lists, analytics, external scripts or central database are used.

The Backup button is always visible and exports a JSON learning record. Restore checks the lesson ID/schema and filters imported responses. Progress resumes from the same named local record. Private browsing, clearing browser storage, a different browser, device or origin can lose local progress; take the JSON backup when moving. An unavailable localStorage shows a warning instead of blocking the lesson.

Print / PDF backup uses the browser's print dialog on the same page. It is a backup, not a required submission. On iPad, saving a PDF still requires the operating system's share/save flow; automatic saving to an arbitrary folder is not promised.

The web app never reads Excel or uploads pupils' work. Submit the .xlsx workbook as directed by the teacher; a JSON or PDF practice backup is not a substitute.

## Resources and image placement

- Celebration illustration: landing, mission and activity choice.
- Column, row, cell and cell-address concept diagrams: corresponding Main task 1 cards.
- Labels/values/inputs diagram: before choosing a changed input.
- Real Excel starter / B2 edit captures: opening and first edit.
- Real copy menu / name-and-location captures: own-copy guide, one screenshot at a time.
- Completed workbook capture: B8, C4 and save/reopen target.
- Full eight-page screenshot / iPad instruction guide: Resources and Device help.

No pupil screenshots or uploads are required for this lesson.

## Reference guidance

- Microsoft, Excel for iPad Help: https://support.microsoft.com/en-us/excel/excel-for-ipad-help
- Microsoft, Save Office files automatically: https://support.microsoft.com/en-au/office/save-office-files-automatically?nochrome=true
- Microsoft, Edit a file in Teams: https://support.microsoft.com/en-us/teams/files/edit-a-file-in-microsoft-teams

Device instructions are based on the earlier live Excel-for-web test and these Microsoft references. The teacher should verify the final school-specific opening and hand-in route.
