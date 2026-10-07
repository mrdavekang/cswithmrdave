# Beetle:bit Week 6 — Build & Code

Student app for continuing after the underside castor (steps 15–16) or programming an assembled robot. Preserves the Week 5 visual card design and all 36 assembly steps. Round support identification is a likely match that pupils verify against the picture.

Routes: after castor → front supports/pillars/battery → inspect remaining gripper/deck/join/wiring; assembled at home → inspection and MakeCode → LED upload → timed movement and stop → calibrated S1 gripper. Optional friend-checker route keeps time for own coding. Sensor extensions link to the official tutorials after basic controls.

MakeCode instructions include REKA:BIT installation, block locations, USB/HEX transfer, saving and reopening programs, bounded motor trials, S1 angle fields, downloadable source snippets, prediction/observation/trial records and pack-up evidence. The motor and gripper tasks use separate programs; the gripper source requires two distinct teacher-measured angles. No servo endpoint is assumed. The app never authorises powered tests.

Enter `teacher` as first name for unsaved preview; class may be blank. This is a preview shortcut, not authentication. Progress is local per first name/class. Week 6 JSON backups include programming notes and angles. Week 5 backups can be restored as history, resetting physical checkpoints for reinspection. Same-browser Week 5 history is imported only by the pupil's button; it does not overwrite current Week 6 work. No remote pupil records or automatic uploads.

Verified official sources on 7 October 2026:
- Cytron Chapter 1: https://beetlebit-hub.cytron.io/chapter-resources/chapter-1 (example https://makecode.microbit.org/_5ueMDfTd7ixT)
- Cytron Chapter 2: https://beetlebit-hub.cytron.io/chapter-resources/chapter-2 (example https://makecode.microbit.org/_chVFH5MpMWL9)
- Cytron resource hub curriculum: https://beetlebit-hub.cytron.io/ (Chapter 3 gripper; Chapter 4 ultrasonic; Chapter 5 line sensing)
- Exact REKA:BIT APIs, block labels, speed range and channels: https://github.com/CytronTechnologies/pxt-rekabit/blob/master/motor.ts
- Extension overview: https://github.com/CytronTechnologies/pxt-rekabit
- USB / file transfer: https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/
- Original assembly images: previously supplied February 2026 Cytron booklet, reused from Week 5. Teacher verifies revision-specific fixings, S1 wiring and p.49 servo calibration.

Static app: index.html, lesson.js, programming.js, app.js, styles.css and assets/. No build step. Tests/QA remain outside the public lesson destination. Syntax, behaviour and visual checks are software checks; physical motor/servo tests must occur with the actual kit in class.

Default repository destination: /Users/tenbywork/Documents/GitHub/cswithmrdave/Beetlebit_Week6/
Not published by this task unless explicitly requested.
