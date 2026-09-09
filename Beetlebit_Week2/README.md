# Microbit Inventors · Week 2: Send the Signal

A 90-minute, one-card-at-a-time lesson for mixed KS2/KS3 teams. Requires two micro:bits per pair/team, USB data cables, computers running MakeCode, and power for both boards. No BEETLE:BIT chassis, motors or external sensors are required.

## Learning focus

WAGBA: Build, download and test LEFT, RIGHT and STOP messages between two micro:bits.

- Knowledge: sender, receiver, radio group, string, event and condition.
- Skills: read, build, download, test and debug.
- Understanding: the receiver’s code gives a message its meaning.

The scenario is a no-touch-zone rescue. Use a paper battery/token for any role play. The receiver’s LEDs represent future robot actions; this is not a working motor controller.

## Teaching sequence

| Card | Stage and next learning step | Minutes |
| --- | --- | ---: |
| 1 | Starter: meet the mission | 3 |
| 2 | Do Now: retrieve a Week 1 button event | 5 |
| 3 | Set up roles, board labels and a teacher-assigned radio group | 5 |
| 4 | Types of Learning: knowledge, skills and understanding | 3 |
| 5 | Predict which board displays the message | 4 |
| 6 | Trace the message journey | 3 |
| 7 | Run the radio-group teaching model | 4 |
| 8 | Modify/build three controller commands | 4 |
| 9 | Make a receiver and test A → L on real boards | 7 |
| 10 | Learning Pit Stop with evidence and a next step | 5 |
| 11 | Decode L/R/other using selection | 6 |
| 12 | Download the updated programs to labelled boards | 6 |
| 13 | Record four physical hardware tests | 8 |
| 14 | Explain, create, repair and retest a fault | 7 |
| 15 | Peer-test and debrief the mission | 7 |
| 16 | Extension: program/play a docking game, or consolidate | 8 |
| 17 | Individual explanation and plenary | 5 |
| | Total | 90 |

Reading comes before construction. The cycle uses prediction, code tracing, a model, guided modification, hardware testing, debugging and explanation. Examples reduce copying demand; students swap Driver/Navigator roles. The new student has a Week 1 reminder. Consolidation and stretch are selected by current evidence, not fixed ability labels.

## Teacher review

Enter `teacher` as the first name; class may be blank. The mode is intentionally not advertised on the student landing page. It opens all cards and teacher notes without saving preview answers as learner evidence. This is a convenience mode, not password protection or a secure teacher dashboard. It does not expose other students’ records.

Assign different radio groups to teams (0–255). Matching groups are not private pairing or encryption. Both boards need the same group. Worked images use 7; downloaded examples use the number the team entered.

Students progress through checkpoints, can return to unlocked cards, and receive a next-step prompt. Hardware checkpoints are learner reports—not automatic device detection. Do not confirm them until the physical test has happened. Share a two-board testing station if needed. The first echo test happens before students add selection.

For a failed radio message, the receiver may retain its old output: its received event did not run. An unexpected string such as LEFT does run the event, but reaches the STOP square in the else branch. This distinction is deliberately assessed. Before later connecting motors, develop and physically test local stop and loss-of-signal behaviour; the current message prototype is not a motor failsafe.

## MakeCode examples

The single-signal, controller, echo receiver, command receiver and docking programs are in `programs.js`. Download buttons generate .mkcd project files locally. In MakeCode use Import → Import File. A project must then be downloaded from MakeCode to the appropriate board; the .mkcd itself is not firmware.

Block pictures are exported from the official MakeCode renderer for these exact programs. The docking code includes a position variable, left/right boundary conditions and a STOP target check. Its target is column 4 by default. The on-page radio model and docking game do not communicate with physical boards.

## Privacy and storage

No application server, accounts, analytics, student upload or teacher collection service is included. Names/classes are used for a device-local record and are not put in URLs. Session identity is held in session storage. Lesson progress is stored in local storage under a hash of the entered name/class; this is not encryption. Re-enter the same first name/class on the same device/browser to resume. On shared devices, use Change learner at the end. Browser data clearing/private browsing can remove the work.

The text learning record is generated only when the learner chooses to download it. Student work is not transmitted by the app. Hosting and third-party sites such as MakeCode or Google Fonts still receive normal page/resource requests. External links open separately with noopener.

## Sources and image credits

- [Microsoft MakeCode: received strings](https://makecode.microbit.org/reference/radio/on-received-string)
- [Microsoft MakeCode: radio groups](https://makecode.microbit.org/reference/radio/set-group)
- [Micro:bit Educational Foundation: transferring code](https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/)
- [Cytron BEETLE:BIT Hub: controller bonus activity](https://beetlebit-hub.cytron.io/chapter-resources/bonus)
- [Teach Computing: computing pedagogy principles](https://static.teachcomputing.org/pedagogy/Pedagogy-principles.pdf)
- [Microsoft MakeCode block renderer](https://makecode.microbit.org/blocks-embed)
- [MakeCode project import implementation](https://github.com/microsoft/pxt/blob/master/webapp/src/app.tsx)

School Types of Learning/Pit Stop images and Week 1 block picture are reused from the supplied Week 1 lesson. Robot image: Cytron. This is an independent classroom resource, not an official Cytron or Microsoft course.

## Delivery and checks

Static HTML/CSS/JavaScript, with no production packages or build step. Publish this directory at `Beetlebit_Week2/` in the existing GitHub Pages repository. The temporary MakeCode rendering helper is development-only and is excluded from publication.

Automated checks cover the 90-minute sequence, JavaScript syntax, example-program behaviour, radio mismatch semantics, directions/boundaries, full student card progression, hardware-evidence gates, escaping, local saving, downloads and agent-tool input contracts. Physical flashing/radio hardware has not been tested by the app author. Do a two-board rehearsal with the school’s devices before the session.

Optional WebMCP tools expose anonymous progress and navigation to unlocked cards through the same app actions. They never supply answers or mark hardware as tested. Browser support is feature-detected; ordinary interaction does not depend on it. Both tools were checked in a supporting browser: valid navigation, anonymous read-back, locked-card rejection and invalid-input rejection. Broader browser visual/responsive QA was not run.
