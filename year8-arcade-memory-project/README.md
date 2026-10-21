# Memory Crew · Year 8 MakeCode Arcade practical

Static HTML/CSS/JavaScript lesson for local use and GitHub Pages. No build or
external video service is required. Keep the neighbouring
`year8-arcade-memory-templates` folder for its existing cartridges and guides.

## Required video cards

The three local MP4 guides are in `assets/videos/`:

- Introduction: before the mission, Do Now and Types of Learning.
- Main Task 1: before playing the demonstration and opening the student starter.
- Main Task 2: before updating the route, testing and saving evidence.

Each guide contains English, Mandarin (Simplified Chinese) and Korean subtitles.
The revised introduction uses rounded original 3D space crewmates, a forward
walk-and-turn entrance, natural greeting gestures and front-facing clue cards.
Its clue changes and captions are timed to the teacher's spoken directions.
The revised edition resets only the introduction's old video-end record; it
does not remove student answers or change the Main Task 1 and 2 videos.
The controls below the picture allow pausing, seeking forwards/backwards,
rewinding and full screen, without covering the three subtitle rows. The
native player remains the fallback if enhanced controls are unavailable.
The activity is locked until playback reaches the end, or the student
seeks to the end. This is an **end-reached check**, not proof of continuous
viewing or attention. Opening the MP4 in another tab does not unlock the card.
Video-loading errors offer a retry; they do not silently count as completion.

Completion and resume positions save in the existing named student profile in
localStorage, and are included in JSON backups and PDF reports. A completed
guide stays unlocked when replayed. Older saved lesson indexes are migrated by
card ID so the extra video cards do not overwrite previous answers. Returning
students encounter any newly required video before starting its activity.

Type `teacher` as the name for unrestricted preview. Teacher mode bypasses video
and editor-launch requirements; it does not automatically mark videos watched.
Students can always export a partial report, including unfinished video checks.

## Local preview / hosting

Open `index.html`, or serve the repository using a local static server. A server
with HTTP byte-range support is preferable when testing video seeking. Upload
the entire lesson folder, including `video.js` and `assets/videos/`, when
publishing to GitHub Pages. All video URLs are relative to this lesson folder.

The three MP4s total approximately 19 MB. None requires a CDN, YouTube embed,
ChatGPT Site, login or browser recording permission. Normal GitHub commit and
push are separate actions, not performed by saving these files locally.
