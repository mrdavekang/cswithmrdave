# Year 9 · Build Your App from Your Sketch

Two Main Tasks, continuing the student's existing MIT App Inventor project.

- Students: `index.html?class=9T` or `index.html?class=9E`.
- Teacher: `teacher.html?class=9T` or `teacher.html?class=9E`; approved existing teacher account required.
- Safe classroom screen: `lesson-screen.html`; Open the live class in the teacher dashboard, then copy its projector link to the classroom display. The linked display follows the slide and timer across devices.
- Private responses: `responses.html`, opened from the teacher dashboard. Authentication and approved-owner checks also apply there.

The mandatory sketch check precedes both Main Tasks. Compare the finished example, copy four short labels from your own paper, then confirm the drawing is beside you. Main Task 1 is a single scrollable workspace with a common layout guide and guides for 3–5 selected features. Main Task 2 has a complete, feature-specific block-building route for ONE response, followed by saving, reopening and exporting .aia. Designer-only inspection and unavailable runtime testing are separate from a successful run.

English and English–Mandarin modes use full static Raleway files for Latin text and device CJK fallback for Mandarin. Annotated screenshots come from a separate demonstration copy captured in the real MIT interface. Component names may differ in each student's existing project. Tutorial images exclude browser tabs and the signed-in account header. The concept diagrams are labelled teaching models, not fabricated MIT screenshots.

The 13 TTA lesson positions have a 60-minute plan. Once started, the timer advances and starts the next slide automatically. Discussion extensions add 30 or 60 seconds to the slide and any active response clock. Every teacher/projector position uses the shared TTA frame, including activity instructions. Both live discussion shortcuts remain pinned on the right. Each discussion has a two-minute initial response window; its speaker notes contain an expected answer. Students can return to their own saved workspace after responding.

Live saving uses lesson-specific private schemas and token-scoped student APIs. Existing teacher authorisation is unchanged. Student drafts, selected features, guide checks, help flags, KSU and plenary answers are saved; MIT project/media files and passwords are not collected. Local IndexedDB queues support interrupted connections and revision conflicts do not silently overwrite newer work. Class records refresh in the private responses window. Guide completion, runtime status and Blooket completion checkbox are self-reports; inspect the actual app and Blooket results separately.

`supabase/01-live-learning.sql` through `03-presenter-sync.sql` are owner-run setup scripts. Their isolated lesson setup is already activated. Do not expose private schemas, grant direct student table access, or place service-role keys in the browser.

The external Blooket has 15 bilingual questions, an enforced goal of 30 correct answers, and a one-week deadline of 10 November 2026. It appears after the plenary. The Teams practical hand-in is a separate assignment.

Authoritative component references: https://ai2.appinventor.mit.edu/reference/components/userinterface.html · https://ai2.appinventor.mit.edu/reference/components/layout.html · https://ai2.appinventor.mit.edu/reference/components/animation.html · https://ai2.appinventor.mit.edu/reference/components/media.html
