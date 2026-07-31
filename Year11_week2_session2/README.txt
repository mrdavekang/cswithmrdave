YEAR 11 EMBEDDED SYSTEMS — GITHUB PAGES PACKAGE
================================================

This folder is a complete static website. It does not need Vercel, a database,
an account system or a separate web server.

QUICK GITHUB PAGES SETUP
------------------------
1. Create a new GitHub repository.
2. Upload every item from this folder to the repository root. Keep the assets
   and vendor folders intact.
3. In the repository, open Settings > Pages.
4. Under Build and deployment, choose “Deploy from a branch”.
5. Choose the main branch and the /(root) folder, then Save.
6. GitHub will provide the published website address after the first build.

USING THE LESSON
----------------
- Students choose Student, enter their name and class, and complete the lesson.
- Work saves only in that browser on that device.
- Students can leave and return using the same name and class.
- The Finish & export page creates a PDF containing their answers, original
  past-paper responses, self-marks, improvements and completion status.
- Students upload the downloaded PDF to the relevant Microsoft Teams assignment.
- The student landing page does not display a teacher option.

PRIVATE TEACHER REVIEW LINK
---------------------------
Add the following to the end of the published lesson address:

?mode=teacher-review

Example:
https://your-school.github.io/embedded-systems/?mode=teacher-review

This opens every activity and the marking guidance on one reviewable page.
Bookmark the teacher address and give students only the normal website address.
Because GitHub Pages is a static website, this is hidden access rather than a
secure login; do not share the teacher review link with students.

IMPORTANT LIMITATION
--------------------
This is intentionally a private, static learning app. It does not send student
responses to a central teacher dashboard. The submitted PDF is the evidence of
completion and understanding.

FILES THAT MUST STAY TOGETHER
-----------------------------
- index.html
- styles.css
- app.js
- assets/ (three lesson images and the Raleway font)
- vendor/ (the local PDF-export library)

Lesson focus: OxfordAQA International GCSE Computer Science 9210
Topic: Embedded computer systems
Past-paper extension: November 2024 Paper 2, Question 04
