# Year 8 T1W1 Project — Mission 0: Meet the Micro:bit

This is a static, self-directed Year 8 physical-computing lesson. It requires no server-side code, accounts, database or build tools.

## Open the lesson

For a quick local preview, open `index.html` in a modern browser. For reliable image saving, clipboard access and downloads, host the complete folder or run it through a local web server.

Normal student entry:

1. Enter full name and class.
2. Choose optional language support.
3. Select **Start the lesson**.

Teacher testing entry:

1. Enter `teacher` as the full name.
2. Class is optional.
3. Select **Start the lesson**.

Teacher mode unlocks all pages, supplies sample responses and uses separate browser storage. It is intended only for reviewing and testing the lesson.

## Lesson journey

| Stage | Time | Purpose |
|---|---:|---|
| Student preparation | 4 min | Equipment, roles, photo privacy and safety agreements |
| Starter | 6 min | Sequence the workflow and classify safe/unsafe actions |
| Learning checkpoint | 3 min | Connect the starter to Knowledge, Skills and Understanding |
| Main Activity 1 | 14 min | Identify parts, connect safely and create a named project |
| Main Activity 2 | 20 min | Build, simulate, transfer and compare the welcome signal |
| Learning pitstop | 4 min | Select a learning phase, give evidence and choose a next action |
| Extension pathway | 5–15 min | Button A, two-button design, then systematic testing |
| Plenary | 6 min | Explain transfer, output, safety, testing and readiness |
| Review and export | 3 min | Review evidence and export for Microsoft Teams |

The extension is optional and never blocks the plenary.

## Editors and iPad setup (version 2.1)

The lesson now distinguishes **MakeCode Blocks**, **MakeCode Python**, and **MicroPython (micro:bit Python Editor)**. MakeCode Python works on computers too; it is the recommended typed-code route for iPad users in this lesson. These are not interchangeable sets of commands.

Students select **iPad (Bluetooth)** in preparation or Main Activity 1, then **MakeCode Python** when choosing the editor. In MakeCode, use the arrow beside **JavaScript** and select **Python** (select JavaScript first if needed). Rotating the iPad to landscape can make the controls easier to access.

Main Activity 2 shows a worked example and expected output for the selected editor. The MakeCode Python example is:

```python
basic.show_icon(IconNames.HEART)
basic.pause(1000)
basic.show_string("GO")
```

Students adapt the icon and short word. They must not paste `from microbit import *`, `display.show`, `sleep` or `display.scroll` into MakeCode. The separate MicroPython example remains available to students using `python.microbit.org`. Extension Level 1 includes a MakeCode Python Button A event example; Level 2 explains how to adapt it for Button B.

Each example has a Copy button and selectable, read-only code. If clipboard access is blocked, code is selected for manual copying. On iPad, use the selection menu; clipboard permissions depend on the browser and hosting context.

### Before an iPad lesson

- Ask school IT to install/update the official **micro:bit iOS app** and permit Bluetooth access. The lesson web app does not install software or change permissions.
- Provide teacher-approved power for each micro:bit. Pair with the correct numbered board; do not pair with another group's device.
- Test the complete workflow on the school's actual iPad, app and micro:bit combination before class. If a board was previously running MicroPython, the teacher may need to flash a fresh MakeCode HEX file from a computer before Bluetooth pairing will work. Back up existing device projects before replacing them.
- Start MakeCode inside the iOS app using **Create Code** for the simplest route. Select Python as above, build the project, test in the simulator, then select **Download** and follow the app's Bluetooth instructions.
- If a student starts MakeCode in **Chrome on iPad**, Download → Download in the “Download ready” prompt → Open in micro:bit app transfers the project into the app. Check the latest program is present, then follow the app's sending instructions. The documented hand-off does **not** work in Safari; keep existing work and use the official guide or teacher-assisted transfer into MakeCode inside the app.
- iPads do not flash a micro:bit through a USB `MICROBIT` drive. The app uses Bluetooth. Re-enter Bluetooth mode each time the app prompts; keep the board powered until transfer is confirmed.

iPad students have a separate connection checklist and are not required to invent a cable number. USB diagrams and transfer instructions are shown on the computer route; the relevant Blocks diagram is explicitly labelled when viewing Python guidance. Device route, editor choice and transfer method are included in progress, backups, review and PDF evidence. A teacher-approved hardware contingency is available if pairing or app access fails; it must not be recorded as successful physical transfer.

Existing saved work is retained: storage keys and schema version are unchanged. The legacy saved value `Python` still means **MicroPython**, never MakeCode Python. Computer and iPad connection checklist answers are kept separately.

Official references (checked 7 September 2026):

- [MakeCode Python and MicroPython compared](https://support.microbit.org/support/solutions/articles/19000111744-makecode-python-and-micropython)
- [Creating and sending programs on an iPad](https://support.microbit.org/support/solutions/articles/19000117215-micro-bit-ios-app-creating-and-sending-programs-on-an-apple-ipad-or-iphone)
- [micro:bit mobile apps and current Bluetooth advice](https://microbit.org/get-started/user-guide/mobile/)
- [MakeCode pause timing](https://makecode.microbit.org/reference/basic/pause)

## Language support

The landing page offers English, English + Bahasa Melayu, English + Simplified Chinese, and English + Korean.

English remains the main computing language. Each major stage displays a short translated guide. Code, filenames, `MICROBIT`, editor labels and technical terms remain in English.

The selected language is saved in progress, JSON backups, the review and PDF metadata. If a student types non-Latin characters in a response, the app opens the browser print system so the student can choose **Save as PDF** with full Unicode support.

## Progress saving

- Text, choices, attempts and completion metadata are stored in `localStorage`.
- Uploaded images are compressed and stored in `IndexedDB`.
- Student and teacher-test work use separate storage keys.
- Work resumes after refresh on the same browser and device.
- On shared computers, export work before another student starts and reset the saved record afterwards.

Use **Reset all progress** on the Review page to delete the current browser record and stored evidence. The app asks for confirmation before deletion.

## Evidence uploads and screenshot pasting

Students can upload JPG/PNG files, use **Paste screenshot**, or focus the dotted paste area and press Ctrl+V or Cmd+V. They can preview, replace, delete and caption each image.

Clipboard reading normally works on HTTPS hosting such as GitHub Pages. Browsers may block the one-click clipboard button on `file://`; the keyboard paste area remains available where the browser permits it.

Evidence photos should show the device or program, not faces, passwords, messages or personal information.

## Hardware contingency

If a device or data cable fails after troubleshooting, the student can select **Teacher-approved hardware contingency**. The student must explain the issue and complete the simulator work. The PDF records that physical transfer was not demonstrated.

## PDF and backups

- **Export current progress (PDF)** is available in the header.
- **Export final PDF** is available on the review page.
- The print fallback reveals all lesson sections before opening the browser print window.
- PDFs use `Year8_Class_FullName_T1W1_Microbit_Onboarding.pdf`.
- The final prompt directs students to Microsoft Teams assignment **Week 1 Project**.
- JSON backups include progress, responses, timestamps and compressed evidence.
- Import validates the lesson identity and schema before replacing current progress.

## GitHub Pages hosting

Upload the entire folder without changing its internal structure. In repository settings, enable GitHub Pages for the branch/folder containing `index.html`.

```text
year8-week1-project/
├── index.html
├── styles.css
├── app.js
├── README.md
├── assets/
│   └── images/
│       ├── 1.png ... 7.png
│       ├── types-of-learning.png
│       └── learning-pitstop.png
└── libraries/
    └── jspdf.umd.min.js
```

Do not move individual files after publishing. Relative paths allow the app to work in a repository subfolder or on a school web server.

## Replacing lesson images

Replace an image in `assets/images/` using the same filename. Images are responsive, enlargeable, have descriptive alternative text and a missing-image fallback.

## Browser notes

- Recommended: current Chrome, Edge, Firefox or Safari.
- GitHub Pages/HTTPS gives the most reliable clipboard and storage behaviour.
- Private browsing or disabled site storage may prevent progress and images from persisting.
- Direct PDF generation uses the included local jsPDF library and makes no network request.
- Nothing is automatically sent to Microsoft Teams or any third party.

## Learning-design changes in this version

- two evidence-based metacognitive checkpoints;
- contextual KSU reflection rather than passive definitions;
- targeted help for the Drowning phase;
- a useful next action for every phase;
- a three-level extension pathway;
- reduced compulsory onboarding evidence;
- explicit pair roles and safety-stop guidance;
- a teacher-approved hardware contingency;
- multilingual stage support;
- screenshot paste support;
- a compact nine-stage lesson navigator.
