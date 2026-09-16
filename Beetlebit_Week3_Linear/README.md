# BEETLE:BIT CCA — Week 3
## Make a Rescue Beacon · Linear Next/Back Edition

The existing three sequencing challenges, MakeCode beacon build and two radio challenges now follow **one linear, numbered path**. The content is divided into 22 smaller screens, not extra tasks. Pupils use the same fixed **Back** and **Next** buttons throughout; each radio build is separated into sender, receiver and test screens. Radio 2 also exposes its existing debugging activity as the next screen.

There are no required task tabs, inner building-step buttons, student activity dropdowns or jump-ahead shortcuts. The next screen is named beside the Next button. On every new step, the page returns to the top and keyboard focus moves to the activity. Teacher mode alone retains a jump menu and direct step navigation.

Device-transfer help opens in a dialog on the current radio step. Closing it returns to the same task, rather than moving pupils to an earlier lesson page. Optional hints can still expand in place. The “Change and play” and extension screens retain a clearly labelled **choose ONE** experiment; these are differentiation choices, not hidden required stages.

## Open

Extract the ZIP and open `index.html` in a full browser. For tablets and school-managed devices, publish the folder on school-approved static hosting and share its address. File-manager preview apps may not execute JavaScript. The separate standalone HTML embeds the same scripts, styles and images.

The lesson uses no external scripts, fonts, analytics or server. MakeCode and official documentation links open external services. The lesson's own activities work offline, but MakeCode itself needs to be available separately.

Enter `teacher` as the name, case-insensitive, for teacher notes and full demonstration projects under Tools. Class can be blank in teacher mode. Teacher mode is not password protection and cannot read other pupils' records.

## Main task 1 — three separate consecutive screens

1. **Fix the turn**: original supported four-command repair, F → R → F → S.
2. **Two turns**: an eight-command route around two blocked squares. Start bottom-left, facing up. Use five F, two R and one S. Teacher solution: F → F → R → F → F → R → F → S. Turns change heading on the same square; the second turn points down. STOP is last.
3. **Order the signal**: use up/down controls (no dragging required) to reorder five blocks into diamond → pause → clear screen → pause → tick. Both pause tiles are identical; either order is accepted.

All three have feedback, hints and saved test evidence. They are browser teaching models, not real MakeCode programs or motor tests. Each screen now records its own evidence. Next always exposes the next challenge. Correct answers are not required to unlock navigation; teachers may support, scaffold or defer a challenge without trapping pupils.

## Main task 2 — keep building, then control it remotely

The original local build remains: Button A → diamond, pause, clear, pause → repeat that sequence once → tick. Students construct it in the actual MakeCode editor, test, transfer and experiment.

### Radio 1: remote beacon

Use two powered standalone micro:bits. Label one **CONTROLLER** and the other **BEACON**.

- Controller: Button A sends the exact string `HELP`.
- Receiver: one `on radio received receivedString` event; `if receivedString = "HELP"` runs the earlier two-flash sequence, ending with a tick.
- Both boards set the same teacher-assigned group in `on start`.
- Retain the original local project. Create separate W3-Controller and W3-Receiver projects. Transfer each to the board with the correct label.
- On the receiver, move the old A-event flash blocks into the received-message condition, then remove the empty old A event. Pupils test the CONTROLLER's A button and watch the other board.

The receiver starter has the group, receive event and HELP condition already in place, but only shows a single diamond. Pupils add the flash sequence. This avoids forcing all KS2 beginners to construct the condition independently.

### Radio 2: two-button rescue controller

- Keep A → `HELP` → two flashes + tick.
- Add B → `SAFE` → Heart on the receiver.
- Add `else if receivedString = "SAFE"` within the ONE existing receive-string event. Use the if block's + control to add the branch. Do not create a second receive-string event.
- Transfer both edited projects. Test A, wait for the entire flash sequence to finish, then test B.
- `SAFE` is only an LED status message. It is NOT an emergency stop and does not cancel a running flash sequence. There are no motors in this lesson.

### Debugging questions and practice

Pupils predict which board's A button to press, diagnose group 23/24 mismatches, and explain why `HLEP` does not match `HELP`.

A readiness debugging task changes only the sender's `HELP` to `HLEP`, transfers it, tests, restores `HELP`, retransfers and retests. Do not alter multiple settings at once. Keep the group unchanged during this experiment.

HELP/SAFE is a **new Week 3 LED-message protocol**, not a redefinition of the earlier F/B/L/R/S movement messages. This radio work builds on the supplied curriculum's Week 2 sender, receiver, group and message-fault objectives. Original Week 3 assembly and motor tests remain deferred.

## Hardware and group setup

Each radio team needs two powered micro:bits. Two pairs may share a set. Each board needs its correct compiled program and a power source; radio communication itself does not require a wire between the boards. Prepare cables, transfer permissions and mobile apps beforehand.

The supplied static project files use **group 23** as an example. Assign different group numbers to different teams, in the 0–255 range. Both boards in one team must use the same number. Groups organise classroom traffic; they are not secure private channels or proof of delivery.

The app's group-number box updates the guide and projects downloaded through the app. It does NOT update an open MakeCode project or the firmware already on a board. After changing the group, edit/transfer both programs and record new evidence; the app clears old radio-test checkboxes when that number changes.

Without two boards, pupils can still build both projects and explain/peer-trace the message journey. They must choose **Peer trace only**, not claim a hardware radio test. The app does not simulate two communicating boards or inspect students' real hardware.

## Suggested 90-minute session

| Screen | Minutes | Activity |
|---|---|---|
| 1 | 0–5 | Read now — A signal the rescue team can see. |
| 2 | 5–10 | Do now — Find what starts the program. |
| 3 | 10–13 | Types of learning — Know it. Build it. Explain it. |
| 4 | 13–18 | Main task 1 · Sequence 1 of 3 — Fix the turn. |
| 5 | 18–23 | Main task 1 · Sequence 2 of 3 — Build a route with two turns. |
| 6 | 23–28 | Main task 1 · Sequence 3 of 3 — Put the signal in order. |
| 7 | 28–35 | Main task 2 · MakeCode — Open MakeCode. Light it up. |
| 8 | 35–39 | Main task 2 · Beacon build 1 of 3 — Make one flash. |
| 9 | 39–43 | Main task 2 · Beacon build 2 of 3 — Add the second flash and tick. |
| 10 | 43–45 | Main task 2 · Beacon build 3 of 3 — Test your two-flash program. |
| 11 | 45–53 | Main task 2 · Transfer and test — Put your code on the micro:bit. |
| 12 | 53–57 | Main task 2 · Change and play — Change it. Play. Test it again. |
| 13 | 57–60 | Main task 2 · Radio 1 · Sender — Radio 1: make the controller. |
| 14 | 60–64 | Main task 2 · Radio 1 · Receiver — Radio 1: make the beacon listen. |
| 15 | 64–67 | Main task 2 · Radio 1 · Test — Radio 1: test the remote signal. |
| 16 | 67–70 | Main task 2 · Radio 2 · Sender — Radio 2: give B a new message. |
| 17 | 70–73 | Main task 2 · Radio 2 · Receiver — Radio 2: make SAFE show a heart. |
| 18 | 73–75 | Main task 2 · Radio 2 · Test — Radio 2: test both buttons. |
| 19 | 75–77 | Main task 2 · Radio 2 · Debug — Radio 2: spot the message mistake. |
| 20 | 77–81 | Learning Pit Stop — Show your next step. |
| 21 | 81–85 | Extension or consolidation — One useful next challenge. |
| 22 | 85–90 | Plenary — Show your program—not another map. |

The 90-minute allowance is unchanged: 15 minutes for Main task 1, 49 minutes for building, transfer, experimentation and radio. The extra screens simply divide the same work into visible steps. Timing is a teacher guide, not a countdown or automatic progression. There is no assumption that KS2 beginners independently master every challenge; use the existing examples, starters and oral-response options. Both partners should take coding and testing roles.

## KS2 and Korean–English support

English and English + Korean are available throughout; switching keeps the work. Both languages use the same computing challenges. Pupils can discuss, point and explain in either or both languages; typed paragraphs are optional. Hints and the receiver starter support beginners. Both partners should change code and test.

Keep block names and literal messages `HELP` / `SAFE` in English exactly as shown. Korean explanations clarify their meaning without translating code strings. The new words and sentence frames cover controller, receiver, group and message.

## Included source projects

| File | Purpose |
|---|---|
| W3_Beacon_Starter.mkcd | Local A → diamond starter. |
| W3_Beacon_Two_Flashes.mkcd | Complete local beacon demonstration. |
| W3_Beacon_Repeat.mkcd | Optional loop-based local beacon. |
| W3_Radio_Receiver_Starter.mkcd | Group + receive event + HELP condition; one picture only. |
| W3_Radio1_Controller.mkcd | A sends HELP. |
| W3_Radio1_Receiver.mkcd | HELP produces two flashes and a tick. |
| W3_Radio2_Controller.mkcd | A sends HELP, B sends SAFE. |
| W3_Radio2_Receiver.mkcd | HELP flashes; SAFE shows a heart. |

Each also has a `.ts` source file. The `.mkcd` files are **editable source archives**, not compiled firmware. Import them in MakeCode; check the group and compile/download there. Manual block guides are provided if importing is unavailable. If a source project opens in JavaScript, switch to Blocks in MakeCode.

Live MakeCode importing/compiling and physical flashing were not verified in this environment. The JSON structure, dependencies and source behaviour were checked programmatically. Trial an import/compile on your school setup before class.

## Saving and evidence

Progress saves locally by name/class under a new v4 linear-edition key. On the same browser origin, entering the same name/class attempts to copy a compatible v3 sequences/radio record (or earlier v2 beacon record). Sequence-tab and beacon-substep positions are mapped to the corresponding new screen. Existing answers, test records and language choices are preserved; new checkboxes start empty. Previous-version storage is not overwritten. Resuming this edition restores the exact screen by its stable card ID. Browser storage is origin-dependent: changing the hosted address, browser, device or local-file path can prevent access to old work. Export a record before moving between them.

My record offers an HTML download and Print / Save as PDF. It includes the three sequence models and both radio attempts, alongside the original beacon evidence. It does not contain the actual MakeCode projects and does not submit anything to the teacher. Save your source projects separately.

Model tests are automatically evaluated. External editor, physical-board, radio and oral-explanation entries are learner reports for teacher review, not automatic certification. No audio is recorded and this lesson uploads no student information.

## Technical references

Reference links retained from the preceding edition; technical guidance was not re-researched for this navigation-only update:

- https://makecode.microbit.org/reference/radio/set-group
- https://makecode.microbit.org/reference/radio/send-string
- https://makecode.microbit.org/reference/radio/on-received-string
- https://makecode.microbit.org/blocks/logic/if
- https://makecode.microbit.org/courses/csintro/radio/activity
- https://makecode.microbit.org/reference/input/on-button-pressed
- https://makecode.microbit.org/reference/basic/show-icon
- https://makecode.microbit.org/reference/basic/pause
- https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/

See TESTING.md for verification and limitations.
