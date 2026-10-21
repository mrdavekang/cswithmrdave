# Year 9 - Make It Yours: first MIT practical

A static lesson web app for a 60-minute independent practical. It continues the open-ended homepage designs from theory and imports the working `MyApp_W9.aia` starter.

## Run

Open `index.html`, or serve this folder with a static web server. No build step, framework, API key or lesson login is required. The student needs their separate MIT account to edit the actual app.

Teacher view: append `?teacher=1`. This unlocks all lesson stages and reveals teaching notes; it is a presentation aid, not an authenticated staff area. Reviewing steps in teacher mode does not automatically mark MIT work complete.

## Two Main Tasks

1. **My homepage:** choose components and change the app title, short introduction, supplied picture and main-button text.
2. **My button:** read the supplied event handler, personalise the message, connect Companion and check the main button and Reset.

Students retain the same imported project throughout. Their first feature displays a useful message on the same homepage. App topics are open-ended; the six illustrated topics and Gear Room are starting examples.

The complete sequence has 41 focused slides (40 when the theory-sketch route skips the topic catch-up card). Most slides are a practical action, not a written question. Next remains accessible while comparing the screenshot with MIT.

## Independent routes and support

- A student with a theory sketch uses that sketch. A student who missed theory chooses an illustrated example or their own idea, then names the app.
- Setup follows that initial idea. Students use MIT's school-email login, download the starter and import it before Main Task 1.
- Each MIT action names the component and property, shows a focused genuine screenshot, provides the full annotated card on enlargement and states what should be visible afterwards.
- English plus Mandarin is available throughout. English interface labels remain visible to match MIT.
- Extra guidance is available to everyone. The established local learner-name rule also enables that support and Mandarin. It does not transmit a name or create an account.
- Short, editable starting phrases can be copied into MIT. These are explicitly labelled build notes rather than a second app editor.
- Students who need access help can retain that status and prepare their words. The record keeps MIT work as awaiting access. A student without Companion can build and save; live tests remain not tried.
- School routes are one iPad, a computer with a teacher-approved iPad, or a computer only. Phones are not used in school. Testing on a suitable phone at home is an extra opportunity with access and permission, not a school-lesson requirement. Without Companion, students edit and export their project and record live checks as Not tried yet.
- Help cards cover school-email access, file selection, Text/Picture, connected blocks, Reset, Companion and save/export/reopen. iPad routes include Files and one-device testing.

## Reflection

The six Types of Learning checks distinguish familiar knowledge, new content, help needed and untried work. The highest count of new/help checks identifies the lesson-specific K/S/U focus, with ties explained and untried checks counted separately.

Learning Pit Stop asks one confidence question for each K/S/U area using New learning, Consolidating, Treading water and Drowning. It explains the most selected phase while preserving different phases across areas. It does not infer a confidence phase from quiz marks or ask for extra written evidence.

## Saving and privacy

Progress is stored locally under a lesson-specific browser key. Nothing is sent to a class dashboard or external analytics service. Use a new learner record when sharing a device.

The main finish action prints the learning record for saving as PDF. A readable report and validated JSON backup/restore are secondary tools. The report labels MIT checks as student-reported and separates unsuccessful, untried, help and awaiting-access states. It does not inspect MIT or contain the app source. Students must also keep the actual edited `.aia` exported from MIT.

## Starter and device verification

The bundled `.aia` is byte-identical to the supplied tested neutral starter: six components, seven images and two connected click handlers. Desktop import, editing, save, export, reopen, restore and Android compilation were checked during preparation. The teacher confirmed that the personalised example loaded and both buttons worked in iPad Companion connected to the computer editor.

Single-iPad import, touch editing and simultaneous browser/Companion use still need a school-device pilot. The web app's responsive layout is checked separately from the behaviour of MIT on that hardware. Teacher notes retain this limitation. The one-iPad reference frame is from MIT's official older demonstration and is labelled accordingly.

## Assets and sources

- Genuine MIT screenshot guides and neutral starter: prepared for this lesson, 16-17 October 2026.
- MIT iPad guidance: <https://appinventor.mit.edu/ios_tips>
- MIT official single-iPad video: <https://www.youtube.com/watch?v=u0ry5xwtR9Q>
- School-email login: <https://login.appinventor.mit.edu/login/>
- MIT project import name-handling source: <https://github.com/mit-cml/appinventor-sources/blob/master/appinventor/appengine/src/com/google/appinventor/client/wizards/ProjectUploadWizard.java>
- MIT interface/tutorial material: Massachusetts Institute of Technology, CC BY-SA 4.0; cropped and annotated. <https://creativecommons.org/licenses/by-sa/4.0/>
- Topic artwork comes from the existing Year 9 app-design lesson. Raleway is bundled with its OFL licence.

Private raw captures, test-account exports, learner test records, QA outputs and delivery ZIPs are kept outside this public lesson folder.

This is prepared for the repository's static/GitHub Pages workflow. No commit, push, publication or Teams post is performed by saving this lesson.

## Tablet font rendering

The regular and bold Raleway files use full Unicode character maps and separate static 400/700 CSS faces. The former bold file was a PDF subset with only a Macintosh character map, causing missing letters on iPad browsers. Versioned stylesheet and font URLs refresh cached assets; Arial and Chinese system fonts provide fallbacks. The learning record shares these fonts. This change preserves lesson content, the browser storage key and saved student progress.
