# Year 11 - Robust programming with a fitness application

Open `index.html` or host this folder on GitHub Pages. No build step, accounts or external services are required. All fonts, scripts, school reflection posters and student resources are local.

## Teacher access

Enter `teacher` in the name field (class can be blank), or open `index.html?teacher=1`. This opens a separate preview notebook and a teacher notes panel with a practice solution. There is no teacher-mode button on the student landing page. This is a convenience for reviewing a static lesson, not secure authentication. No examination question paper or official mark scheme is included.

## Lesson

The core activities total 60 minutes. Setup is before the timer. The extension is for early finishers. Students run Python in their own IDE; the website records evidence and does not execute Python.

Each activity names where to work, what to open or run, and where to record the result. Do Now asks students to open practice.txt and predict; the next syntax activity gives the steps for running file_practice.py and distinguishes console output from changes to the text file. Tracing is a manual reading activity. In Main Task 2 students edit fitness_working.py but run check_heart_rate.py to test their edits. The extension has its own check_validator.py file to run after the new function is written.

The supplied `fitness_working.py` retains the working program logic, with its series-identifying comment removed and a filename suitable for the small test launcher. `activity.txt` is unchanged. The browser source excerpts preserve the relevant program lines. The other Python resources are lesson support, not examination files.

Download `resources/Fitness_Student_Files.zip`, extract it and keep its files together. Set the Python IDE's working directory to that folder. Keep the ZIP as a clean original. The launcher imports `EnterHeartRate` without running the menu or changing the activity data.

Students can type the trace or ask for `resources/Trace_Worksheet.pdf`. The formats use identical questions. Paper evidence can be uploaded as images.

## Saving and submission

The app saves notebooks in this browser using IndexedDB, with localStorage as a fallback. Name and class identify a notebook on that device. It does not send records to the teacher or Teams. Use Full backup to move devices and Save PDF to export answers, code, reflections, test results and attached images. Upload the PDF to Teams manually.

Image uploads accept JPG, PNG and WebP (up to 15 MB each, four per section). Images are resized for readable evidence and manageable backups. Keep original photographs separately if needed. The full backup contains names and work; keep it in the student's usual school storage. It is never sent to a server by the app.

To publish later, copy this entire folder into the existing cswithmrdave repository and use its normal GitHub Pages process. This package has not itself been published.

Teacher answers are supplied separately as Teacher_Guide_and_Answers.pdf.

## Content references

- OxfordAQA 9210 specification: 3.2.7, 3.2.10 and 3.2.12.
- Supplied fitness program and activity data (teacher-provided).
- School Types of Learning and Learning Pit Stop posters (user-provided).
- Raleway font licence: assets/OFL.txt. jsPDF includes its licence in the bundled script.
