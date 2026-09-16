EDITING THIS LESSON

The student/teacher launch file is ../index.html, not the template in here.

lesson.js   Learning content, question wording, mark schemes, source notes,
            K/S/U checks and timings.
app.js      Rendering, interactions, profiles, IndexedDB saving, photos,
            backup/restore and all-stage PDF/report generation.
styles.css  Green responsive design. Uses a local Raleway font if available;
            no font files are included.
index.html  HTML template with insertion markers.
assets.js   Embedded original source PDFs and page images as base64 data.
jspdf.js    Locally bundled jsPDF dependency, with its licence retained.
build.py    Rebuilds the self-contained ../index.html from these source files.

After edits, run:
    python build.py

No npm dependencies or network requests are needed.

Keep the lesson ID stable when updating this same lesson to preserve profiles.
For a different lesson, give it a new ID and an appropriate backup schema;
never reuse the Session 1 database name for this Session 2+3 app.

The state and report are local. Do not add student JSON files to the package
or a public repository. Teacher preview is intentionally not authentication.
