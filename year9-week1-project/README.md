# Year 9 Computing — Week 1 Project

Static GitHub Pages lesson for the **Classroom Help Button** project.

## Learning journey

1. Do Now
2. Types of Learning and How to Get Better
3. Main Task 1 — create and test the first prototype
4. Main Task 2 — user-test, improve and retest
5. Learning Pitstop
6. Plenary
7. Exit Reflection and PDF submission

The WAGBA is: **Create, test and improve a micro:bit help button using Python.**

## Student use

- Open `index.html` through GitHub Pages or another static web server.
- Enter a name and class.
- Choose whether extra reading support is needed.
- Choose the coding route that matches the device:
  - **Laptop/desktop:** micro:bit Python Editor using MicroPython.
  - **iPad:** Microsoft MakeCode using its Python view.
- Work through the seven stages.
- Download the PDF report and upload it to the **Week 1 Project** assignment in Microsoft Teams.

Free-written answers accept students' own wording. A response can be short but meaningful; the app does not search for hidden keywords. Navigation is never blocked by an unsuccessful program. Students can record **worked**, **partly worked**, **error**, **not yet**, or **needs help** and continue.

## Two Python routes

The two editors use different Python commands, so the app must not mix their starter code.

- The **MicroPython** route uses `from microbit import *`, a continuous loop and `if`/`elif` button checks.
- The **MakeCode Python** route uses button event-handler functions, `input.on_button_pressed(...)` and `basic.show_*` commands.
- Both routes produce the same intended behaviour for buttons A and B. Students therefore complete the same prediction, user-testing, improvement and reflection evidence.
- The code display, editor link, run instructions, line-identification questions, editing tips and physical-transfer advice all change when the student changes route.
- Existing saved work without a route defaults safely to the MicroPython version.

Official references: [Microsoft MakeCode for micro:bit](https://makecode.microbit.org/), [supported browsers including iOS](https://makecode.microbit.org/browsers), and [MakeCode button-event reference](https://makecode.microbit.org/reference/input/on-button-pressed).

## Teacher preview

Enter `teacher` as the name. The class box may be left empty. Teacher-preview work is stored separately from student work.

## Saving and privacy

- Responses save locally in the browser using IndexedDB.
- Optional evidence images are resized and stored locally.
- No accounts, analytics or server are used.
- The PDF is created in the browser.

## Files

- `index.html` — lesson content and accessible structure
- `styles.css` — responsive black-and-white theme with purposeful learning colours
- `app.js` — navigation, flexible completion, autosave, reflections and evidence
- `storage.js` — local browser storage
- `export.js` — PDF report generation
- `libraries/jspdf.umd.min.js` — local PDF library
- `assets/images/` — micro:bit setup, testing and return guides
- `student-files/HelpButton_Starter.py` — MicroPython starter
- `student-files/HelpButton_Starter_MakeCode.py` — MakeCode Python starter

## Hosting

The project has no build step. Publish the folder directly with GitHub Pages. Keep the file and folder names unchanged.
