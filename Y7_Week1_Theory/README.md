# Year 7 Week 1 Theory — Redesigned Web App

## Open the app

Open `index.html` in a modern browser. For school hosting, upload the complete folder without changing its structure and use `index.html` as the home page.

The app uses only local HTML, CSS, JavaScript and images. It does not require a server, database, account or external library.

## Student entry

Students enter their full name and class, then choose either:

- English
- English with optional language support

Language support is available in Bahasa Melayu, Simplified Chinese, Korean and Arabic. The assessed lesson remains in English. Support adds short concept translations and bilingual vocabulary definitions; it never supplies translated answers.

Students can change this setting at any time using **Language help**. The **Vocabulary** window remains available throughout the lesson. Read-aloud uses the browser's built-in English speech feature when supported.

## Teacher review

Enter `teacher` as the name. The class field becomes optional, every lesson section is unlocked and a separate teacher-testing storage area is used.

The query route `?teacher=1` is also retained for convenient testing. Teacher status is not displayed as a student-facing control.

## Progress and privacy

- All answers, meaningful selections, algorithm commands, tests, reflections and submission confirmations save in the browser.
- Progress is separated by student name, class and lesson.
- Refreshing or closing the page does not remove saved work.
- **Reset** permanently clears only the current learner's local lesson record after confirmation.
- No response is sent to an external service.
- On shared devices, students should confirm their own name before continuing.

## Lesson structure

1. Welcome and expectations
2. Starter: Computer Science or digital creativity
3. Main Task 1: Human Robot algorithms
4. Main Task 2: sequencing, Scratch, IPO and digital safety
5. Optional extension choice board
6. Plenary
7. Evidence review, PDF export and Teams checklist

Long sections use short lesson cards. Students can use Previous/Next card controls without losing their work.

### Completion guidance

- Each core section shows how many required items remain.
- Green card dots indicate completed cards; red dots identify earlier cards that still need attention.
- If a student selects **Continue** too early, the app opens the first incomplete card, outlines the exact field in red and gives a plain-language instruction.
- Checked Scratch and IPO questions remain checked when students subsequently write the related open response.
- A completed section turns the Continue button green.

### Extension choice board

Early completers can choose one or more activities and reopen them to improve:

- debug an everyday morning algorithm;
- complete three progressively harder robot missions with multiple stars and blocked squares;
- request paper, make vocabulary flashcards and practise with a partner;
- complete and retry a 20-question knowledge quiz.

The app records which choices were opened, visit counts, submitted attempts, robot tests and successes, flashcard evidence, quiz scores and selected answers. Extension work is optional and never prevents access to the plenary.

## PDF and Teams

The direct PDF contains student details, WAGBA, attempted answers, scores, the final robot algorithm, testing evidence, optional extension choices and attempt histories, reflections and a learning-interaction summary.

The filename follows:

`Year7_CLASS_NAME_Week1_Theory.pdf`

Students must upload the PDF to Microsoft Teams assignment **Week 1 Theory**. A print-friendly **Print / Save as PDF** fallback is included.

## Images

The `assets` folder contains ten lesson images:

- four starter classification images
- Human Robot worked example
- Robot command reference
- Scratch prediction source
- IPO printer worked example
- IPO camera assessment
- digital-safety situations

Task images provide source information without revealing the assessed answer. Selecting a lesson image opens an enlarged view. Missing images show an accessible fallback message.

## Browser notes

- Use a current version of Safari, Chrome, Edge or Firefox.
- Direct downloads may be restricted by managed-browser settings; use the print fallback if needed.
- Read-aloud voice and pronunciation depend on the voices installed on the device.
- iPad or iPhone text selection may offer the system **Translate** command when allowed by school settings.
