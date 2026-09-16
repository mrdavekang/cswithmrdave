# Verification — Week 3 Linear Edition

## Navigation and layout checks completed

- JavaScript syntax checked with Node for app.js, content.js and logic.js.
- All 22 screens reached in order using only the single footer Next button.
- All 21 backward transitions checked: Back returns to the immediately preceding screen, including beacon and radio substeps.
- Student DOM checked on every screen: no nested task tabs, build-step navigation, workshop jump buttons or activity jump dropdown.
- Teacher mode retains all-step jump navigation; blank class accepted when the name is teacher.
- Tested at 1440×1000 English, 768×1024 English–Korean and 390×844 English–Korean viewports.
- No horizontal document overflow. End-of-step content remains reachable above the fixed footer at each tested width.
- Forward/back navigation returns focus to the main activity. The current step number and next title stay visible in the footer.
- Representative desktop and phone-width screenshots visually reviewed.
- No uncaught JavaScript errors during navigation sweeps or behaviour tests.

## Behaviour checks completed

- Four-command and eight-command route solutions animate, pass and save their own evidence on separate screens.
- Five signal blocks reorder with up/down controls; the correct sequence passes on its own screen.
- Beacon-building checkboxes survive Back/Next.
- English–Korean switching keeps the current screen and saved answers.
- Radio group changes update the guide and generated receiver-starter project.
- The generated receiver starter downloaded successfully and contained the selected group number.
- Radio transfer help opens/closes without changing the current screen.
- Radio evidence choices and bilingual free-text explanations are retained.
- Sign-out and Resume return to the exact screen and language in the storage harness.
- A learning-record HTML download was generated and inspected for pupil details, route/radio evidence, group and bilingual explanation.
- v3 migration checked for both nested sequence positions, a beacon-building substep and the radio challenge. The original v3 storage entry was not changed.
- All supplied MakeCode .mkcd/.ts projects, image assets and logic.js are byte-for-byte unchanged from the preceding edition.
- 22 unique card IDs and a total teaching time of 90 minutes verified.
- Standalone HTML contains embedded scripts, styles and image assets; the ZIP includes the split-file equivalent.

## Test environment and limitations

The available system Chromium blocks direct file:// and localhost navigation. UI tests therefore rendered the actual generated standalone markup into an isolated Chromium document using Playwright. Storage-denied handling was checked there. Separate state/serialization/migration tests used an in-memory adapter implementing the Web Storage interface. This tests app logic, not durable storage across real browser restarts or hosting origins.

Physical iPad/Android use, school-hosted deployment and real-origin persistence were not exercised. Print-to-PDF pagination was not re-rendered in this navigation-only change; the existing print styles and record implementation are retained. HTML record generation/download was checked.

Live MakeCode import/compile, USB/Bluetooth flashing and communication between physical micro:bits were not tested. The source projects are unchanged from the previous edition. Import/compile them and check group numbers on your school setup before class. .mkcd files are editable source archives, not firmware.
