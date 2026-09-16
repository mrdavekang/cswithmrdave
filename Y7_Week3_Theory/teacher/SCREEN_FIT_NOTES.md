# Automatic screen fitting — teacher / maintainer notes

## Student use
The layout is automatic before and after sign-in. Students do not need to know screen size, screen resolution or device model. **Your device** remains the separate choice for matching PDF / Teams saving instructions. A browser-based suggestion can be changed.

**Aa Display** opens the optional reading controls. Text size starts at the comfortable default and can increase to 200%. The optional single-column setting keeps the editor above the drawing even on a wide display. Preferences are per browser, not synced to student accounts. On a shared device the next student can use Reset display settings. Clearing browser storage clears those preferences; private or managed browsing may prevent persistence.

## Layout behaviour
The responsive module uses layout-viewport width for column decisions, touch capability for control sizing, ResizeObserver for actual editor/card widths and the visual viewport for available height. It does not identify the physical monitor, measure viewing distance or claim certainty about a device model. Screen data is used on the page and not uploaded.

A goals sidebar appears only with sufficient width and height. Each Python lab separately chooses stacked or side-by-side panes. An editor inside a narrow comparison card can therefore stack even on a laptop. The text controls increase font size; content reflows to retain legibility rather than using a whole-page transform to fit everything into one view. Only the fixed-paper report preview uses a visual scale, with an Actual size alternative.

Portrait/landscape rotation, browser window resizing and tablet split view do not call the lesson render function. No resize handler runs the Python, resets the Turtle, changes the student's selected answers or modifies the saved checkpoint. The canvas remains in its original logical coordinate system, and code line-number spacing follows the chosen font size. Long code lines may scroll inside the editor; ordinary lesson text does not require sideways page scrolling in the tested sizes.

## Keyboard / zoom boundaries
Where available, visualViewport supplies the visible area after the on-screen keyboard appears. Keyboard state is inferred from focus, touch support and a reduction in available height. This is not guaranteed for floating keyboards or every vendor browser. The expanded workspace stays scrollable and reduces editor height when appropriate. Pinch zoom is not cancelled; it does not trigger automatic text shrinkage. Native hardware and school-managed browsers require a short test before teaching.

## Files and update safety
- screen-fit.js: display preferences, viewport events, content measurement, compact navigation and optional display dialog.
- screen-fit.css: typography, reflow, touch targets, stacked tables, IDE sizing and report preview.
- index.html: loads these files after the existing styles and before app.js.
- app.js: mounts screen-fit helpers after lesson rendering and report preview creation.
- ide/turtle-ide.js: offers Display inside the editor and notifies screen fitting when expansion changes.

The original lesson storage key and schema, teacher config format, question bank, Python worker/interpreter and PDF report generator are unchanged. Keep your config.js when deploying. Use the same origin/path for browser-local progress and export important evidence before a live update. This build contains no student records.

## Primary technical references
Reviewed 16 September 2026:
- MDN responsive design: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- MDN ResizeObserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
- MDN VisualViewport: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport
- MDN pointer media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
- W3C reflow: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html
- W3C resize text: https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html

These references informed the implementation. This is not a claim of a formal accessibility audit or certification.
