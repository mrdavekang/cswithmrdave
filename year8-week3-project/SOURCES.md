# Design and technical sources

## Visual revision — 24 September 2026

- [micro:bit Step counter](https://microbit.org/projects/make-it-code-it/step-counter/): movement-triggered variable update. Classroom adaptation adds a visible reset and a controlled increment change. Original project material is credited to Micro:bit Educational Foundation (CC BY-SA 4.0 where specified).
- [MakeCode Activity: Scorekeeper](https://makecode.microbit.org/courses/csintro/variables/activity): inspiration for independent player totals; this adaptation uses two variables, labels and tabletop targets rather than the original three-variable game.
- [Seeed Studio Grove Inventor Kit](https://wiki.seeedstudio.com/Grove_Inventor_Kit_for_microbit/): kit/module reference. P2 red LED and P0 rotary instructions follow the kit examples. Kit photograph: https://files.seeedstudio.com/wiki/Grove_kit_for_microbit/img/first_im.jpg — Seeed Studio; retain attribution and manufacturer rights.
- [MakeCode analog read](https://makecode.microbit.org/reference/pins/analog-read-pin) and [MicroPython pins](https://microbit-micropython.readthedocs.io/en/v2-docs/pin.html): distinct pin APIs and raw range 0–1023.
- Five new PNGs named core/steps/teams/signal/dial-blocks.png are actual MakeCode editor screenshots captured from purpose-built sample programs. Microsoft MakeCode/micro:bit branding belongs to its owners. They are not AI-generated block approximations.
- signal-wiring.svg and dial-wiring.svg are original simplified connection schematics, explicitly not literal socket-position layouts. The kit photo, keyed-plug guide and Pins toolbox capture were reused from the revised Week 5 lesson.
- No YouTube player is required for these challenges. All essential visual instructions are local, so no embedded-player error 153 dependency is introduced.

The four extension programs are separate saved projects; they do not replace the core Smart Badge learning intention. Sources below describe the original release and are retained for provenance.

## User-provided references

- `year8week2project.zip`: one-card-at-a-time Smart Badge project, sidebar and WAGBA/KSU, device-specific editor routes, six matched before/after reflection statements, local evidence/backup/report workflow, optional extension placement, no-lockout progression. Reviewed the root README, design review and lesson/view/reflection/controller/styles source.
- `year8week3theory.zip`: variables, assignment, identifier/type/trace language, English-first translanguaging, PDF handling, school Types of Learning and Learning Pitstop images, and the bundled jsPDF dependency.
- The Week 3 Project content and exact eight-stage structure agreed in this conversation. The implementation continues the Smart Badge rather than starting a separate project.

The school guide images are reused from the user's supplied lesson files for this teaching context. No school guide artwork, student photographs or font files were retrieved from an unrelated source. This package contains no real student work.

## Official technical documentation checked on 14 September 2026

- micro:bit mobile apps and device-specific transfer: https://microbit.org/get-started/user-guide/mobile/
- micro:bit transfer guidance: https://microbit.org/get-started/user-guide/transfer-code-to-the-microbit/
- MakeCode button event handler / count-button-click example: https://makecode.microbit.org/reference/input/on-button-pressed
- MakeCode number output: https://makecode.microbit.org/reference/basic/show-number
- MakeCode Python language reference: https://makecode.microbit.org/python
- MicroPython display / scrolling behaviour: https://microbit-micropython.readthedocs.io/en/v2-docs/display.html
- MicroPython button state and was_pressed: https://microbit-micropython.readthedocs.io/en/v2-docs/button.html

Official mobile guidance mentions newer iPad/V2/Python-editor workflows, while the general transfer page still says Python-editor iPad transfer is unavailable. The teaching route therefore remains MakeCode on iPad as in the Week 2 reference, without claiming all advanced MicroPython/iPad workflows are impossible. Device and app prompts should be checked on the school's managed devices.

## Dependencies and visual assets

- jsPDF: reused from the supplied Week 3 Theory app. Its existing source/license notices and `jsPDF-LICENSE.txt` are retained. https://github.com/parallax/jsPDF
- Raleway: optional runtime CSS request from Google Fonts; system fonts are fallbacks. No font files are included in either deliverable.
- Block examples: purpose-built HTML/CSS layout guides with MakeCode block names and nesting. They are explicitly labelled as guides, not claimed to be actual editor screenshots or a live MakeCode workspace.
- The small memory model is an interactive concept illustration. It is not a micro:bit emulator or a test of student code.
