# Release checks — 14 September 2026

## Passed

- Syntax checks for application and report scripts; Node unit suite in the working copy.
- Every card has English and Chinese reading/action text.
- Name/class validation and case-insensitive `teacher` entry without a class.
- Teacher can select all stages; student stages unlock progressively.
- Full normal student journey: starter, all 10 command checkpoints, all 10 route checkpoints, peer check, two attempted extensions, learning phase, three plenary questions and export.
- Incorrect quiz attempt receives feedback and can proceed. Missing answer or next-action choice is highlighted with guidance.
- Code workspace separation, route persistence between cards, and refresh/resume using the same name and class.
- Full-width Chinese punctuation converted before genuine Python execution.
- Syntax-error correction, successful rerun, Stop during an endless loop, and recovery.
- Route created through point-selection buttons; start/finish/corridor/continuity feedback confirmed.
- Extension attempts preserved without overwriting route code.
- WAGBA, keywords and language support remain visible; no horizontal page overflow at 1024×768, 1366×768 and 768×1024 browser viewport sizes.
- Bilingual PDF produced and downloaded. Its 27 test pages were rendered and visually inspected: learning summary, actual route and code, answers, practice, extensions, run history and interaction appendix are present without clipping.
- The PDF contains a compact assessment section first, followed by detailed appendices. The test record included repeated QA actions; normal student report length depends on their attempts.
- Python `.py` downloaded. Submission ZIP inspected: PDF, Route.py, school_map.gif and attempted extension programs are included.

## Not verified on hardware / external services

- An actual iPad Safari native share sheet, Files saving, software keyboard and Teams upload were not available for end-to-end hardware testing. Device-specific instructions and native sharing fallbacks are implemented; trial these with a school iPad before class.
- Direct `file://` opening could not be tested in the available browser. HTTP static hosting was tested and is recommended.
- No claim is made that the website verifies Teams submission, centrally monitors pupils, or supplies a secure teacher login.
- Backup import/reset and print dialogue have implementation checks but were not destructively exercised against real student records.

No real pupil data was used. Test profiles are named QA Learner / 7QA and teacher.
