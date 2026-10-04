# Year 10 · Validation decisions and independent programming

Static, offline-capable HTML/CSS/JavaScript lesson. No build step, package install, online Python runner or student account. Open `index.html`, or host this whole folder in the existing GitHub Pages site. Keep `assets/` and `vendor/` with the HTML.

## The merged session

- Validation using selection; normal, boundary and erroneous data.
- Independent validated ticket program, with optional transfer to grades and usernames.

One school-fair ticket scenario is used through the core: accepted ages 5–18 inclusive; 5–12 cost RM8; 13–18 cost RM12; all other ages are rejected without a price. The guided five-line example models validation only; students independently add the price decision. Alternative correct protected selection structures are accepted. Each student's chosen support is recorded.

**Scope:** integer-format input and range validation. `int(input(...))` does not safely handle words, blank input or decimal text. No validation loop, exception handling, database, authentication system, logic-gate notation or subroutine is required. This is not a fully robust production program and not a complete Paper 1 skeleton-program examination.

## Verified curriculum references

OxfordAQA International GCSE Computer Science **9210**, not UK GCSE 8525:

- 3.1.1 — algorithm design and input/process/output.
- 3.2.2 — selection, including nested selection and meaningful identifiers.
- 3.2.4–3.2.5 — comparisons and Boolean operations in conditions.
- 3.2.7 — keyboard input and display output.
- 3.2.12 — simple validation routines; selecting and justifying normal, boundary and erroneous tests.

[Official specification](https://www.oxfordaqa.com/wp-content/uploads/2025/02/oxfordaqa-gcse-computer-science-specification.pdf). The assessment distinction is explained in the app: developing and testing support Paper 1; conceptual explanations and test-data reasoning also support Paper 2.

The supplied textbook was checked for the relevant sections: printed pp. 32–35 for selection (PDF pp. 36–39), pp. 92–93 for validation (PDF pp. 96–97), pp. 96–97 for testing (PDF pp. 100–101). The app contains original short explanations and scenarios, not reproduced textbook or exam questions. Repetition material on the validation spread is explicitly deferred. The extensions are ten original scenario-based exercises inspired by short programming-practice formats; they are not copied Helsinki MOOC exercises.

## Route and suggested timing

Prepare/recap 3; Do Now 6; Types of Learning 3; Fact 1 validation 4; Main Activity 1 plan 10; Fact 2 code tutor 4; Main Activity 2 build 16; Fact 3/testing 6; Learning Pit Stop 3; Plenary 3; export/submit 2 = **60 minutes**. Extensions are the early-finisher/follow-up window before the Pit Stop, not another compulsory timed block. Classroom timings are suggestions, not countdowns or restrictions.

## Access and support

- Single-column student content; large code, clear headings, restrained borders, black/white base and subtle school-green/lilac accents.
- WAGBA and Knowledge, Skills and Understanding remain in the sidebar (also visible on mobile).
- Stable core scenario, explicit acceptance vs price decisions, labelled range visual.
- Five-line deterministic walkthrough with current-line emphasis, values and explanation; no arbitrary code execution. Line numbers are never copied into the IDE.
- Eight supplied tests shown one at a time, plus one independently chosen and justified test. A rejection can be a successful test. Invalid boundary tests can also be erroneous.
- Optional progressive hints; independent practice and ten distinct extension notebooks remain available. No fixed requirement to finish ten challenges.
- Quiet support cards request an example, line help or an agreed pause. **They do not notify the teacher.** Students show the card or use their agreed signal. These adjustments should be agreed with the pupil and school support team, not assumed suitable for every autistic learner.
- Types of Learning after Do Now and Learning Pit Stop after extensions use six specific K/S/U targets. Evidence levels are not-yet / supported / independent; phases are new / consolidating / treading water / drowning-needing help. Counts are self-reflections, not marks, and not proof of mastery. The two measures are kept separate.

[National Autistic Society guidance](https://www.autism.org.uk/advice-and-guidance/education/getting-help-at-school/what-can-my-autistic-child-get-support-with-at-school) informed written steps, processing space and quiet help. Review individual sensory and communication preferences before classroom use.

## Teacher preview

Enter **teacher** as the name (class optional), or use `index.html?teacher=1`. Every page is open; teacher notes contain suggested responses and a Python model. A larger projector view is available within the notes (or `?teacher=1&projector=1`). This shortcut is not secure authentication. The static app has **no Supabase Classroom Mode, cross-device control, central student tracking or live help notifications**. None is simulated. Teacher preview uses its own local notebook. The previous lesson and its classroom service are unchanged.

## Saving and PDF evidence

Names/classes, answers, code, outputs, test predictions/results, individual extension work, reflection levels/phases, support records and screenshots save locally using IndexedDB, with a browser-local fallback. Storage failures are shown; export a backup if they occur. Nothing is automatically uploaded. Avoid shared-browser confidentiality issues; inspect your own notebook and follow school device/data policies.

Export PDF at any stage. All prompts/responses and all images are included without cropping, plus feedback/model comparisons, correction/check history, before/after KSU profiles and walkthrough history. Blank questions are labelled. Each extension retains its own code, output, explanation, status and images. Teacher review is still required: neither completion counts nor a student's selected test comparison automatically verify Python execution. Images are original PNG/JPEG; WebP is converted losslessly to PNG. Each attached image may be up to 10 MB. JSON backups include editable answers and images, and are lesson-identified so another lesson's backup is not silently imported. A restore asks before overwriting an existing notebook.

Students open the exported PDF, check all evidence, then attach it to the correct Teams **assignment** and select **Turn in**. Classwork/Files upload alone is not assignment submission. Confirmation checkboxes are self-reported. Use the final export after ticking them if the PDF should show them.

## Files

- `index.html` — entry point and notebook shell.
- `lesson.js` — all lesson content, question registry, references and teacher notes.
- `app.js` — saving, checks, walkthrough, support cards, screenshots, backups and PDF export.
- `styles.css` — responsive Raleway styling.
- `vendor/jspdf.umd.min.js` — locally bundled PDF library.
- `assets/` — school logo, Raleway font, embedded PDF font and font licence.
- `tests/` — reproducible interaction/content checks; not needed for hosting.

No changes are made to the earlier strings-and-validation lesson. No Git commit, push or hosting deployment is performed by creation of this folder.
