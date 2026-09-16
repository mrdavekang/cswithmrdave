# Automatic screen fitting — validation

Checked 16 September 2026. These are automated/emulated browser checks, not physical-device or authenticated Teams/Gimkit certification.

## Current update: 496 assertions passed

The final layout matrix completed with **496 passed / 0 failed**, with no JavaScript page errors. It covers:

- Windows, Mac, Chromebook, iPad and Android user-agent/touch profiles. Desktop-site iPad detection was tested with a Mac-style user agent, MacIntel platform and five touch points. The device suggestion is a heuristic; users can correct it.
- Browser viewports from 320 to 1920 CSS px, including 1366×768, 1280×800, 1024×768, 820×1180, 1180×820, 800×1280, 600×820, 390×844 and 320×740.
- Every lesson stage, all six Main Task 1 subsections, all three Main Task 2 subsections, language-independent code input size, no horizontal document overflow and correct Turtle canvas aspect ratio.
- Portrait/landscape and narrow split-view equivalents. Normal desktop/tablet and 200% in-app reading-size checks, including 320 CSS px wide views.
- Actual Python execution in the existing bundled Skulpt worker. A completed test's code, observation, live canvas and full lesson state remain unchanged across four viewport transitions. The exact textarea DOM node survives resizing and changes to text size.
- The compact stage picker preserves the existing progression gates; first-prediction locking, checkpoint locking and saved answer history remain in place.
- Manually selected PDF-saving devices are not overwritten by resizing. Optional display settings restore independently from lesson data.
- Pinch magnification retains the base reading font. An explicitly simulated visual-viewport/keyboard reduction triggers the keyboard-aware layout and leaves checkpoint locks intact. This is not a real OS keyboard test.

## PDF and preview regression

A seven-page report containing a checkpoint, plotted prediction and kept Python test was generated from the current app. At normal and 200% in-app reading sizes, report geometry, page count and page contents were identical. Every report page fitted within its content area. The PDF was successfully created with the existing bundled libraries and rendered with PyMuPDF for visual inspection.

The report-preview Fit width mode had matching client/scroll widths (751 CSS px); Actual size intentionally permitted internal scrolling of the original 794 CSS px paper width. These preview settings did not alter the saved A4 file. No JavaScript errors were recorded in the export/preview checks.

## Harness / limitations

Chromium in the build environment blocks URL navigation. Tests loaded the unchanged local app scripts and styles into an about:blank test harness. The school-map image was supplied as a data URI and Web Storage was replaced by an in-memory equivalent solely in the test harness. The deliverable itself contains neither of these harness modifications. Python execution used the real bundled worker, not mocked results. Persistence was checked by restoring the stored key/value data into a fresh harness; native localStorage retention after real reloads or a hosted deployment was not exercised in this environment.

The tests emulate device capabilities inside Chromium; they do not run Safari/WebKit on an actual iPad. Native iPad/Android keyboards, school-managed browsers, authenticated Teams submission and Gimkit remain deployment checks. No claim is made that this is a full accessibility audit or that every historical Python command regression was rerun. Prior IDE test notes are retained separately in teacher/PREVIOUS_IDE_TESTING.md as historical information.
