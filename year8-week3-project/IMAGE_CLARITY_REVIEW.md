# Image clarity review — 24 September 2026

- Replaced all five active code-only MakeCode captures (core, movement, teams, Grove signal and dial) with native SVG block captures exported from the actual editor. These retain the real block shapes, labels, values and connections at any zoom.
- Recaptured the Pins toolbox at a larger readable editor scale; no enlargement of the old bitmap was used.
- Removed image-height caps that made wide references tiny. Kept image proportions intact.
- Added a local, keyboard-accessible enlarged viewer with Fit, 100%, 150%, 200%, original-image link and Close. Images can be panned by scrolling. The school learning-guide images are also accessible through this viewer.
- Existing wiring diagrams already use SVG. The kit photograph and school posters remain their original raster sources; zoom cannot create detail absent from those originals.
- Preserved the previous PNG files for compatibility, but the active code cards use SVG.

Validation: visually inspected every replacement vector in a rendered contact sheet, and inspected the actual editor/toolbox captures. 297 card/editor/language renders and the existing saved-progress, navigation, report and asset tests passed. The image viewer passed DOM tests for opening, fit, zoom, closing and accessible triggers. Live lesson browser rendering was not retested because the browser had blocked the local preview; DOM tests are not a substitute for device-layout tests.

No curriculum, assessment gates or student storage keys were changed. No GitHub push or deployment was performed.
