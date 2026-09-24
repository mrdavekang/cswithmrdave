# Class Remote verification

- Existing regression suite: 297 card renders (33 cards × 3 languages × 3 editors), saved work and report checks passed.
- Classroom integration: show-only input lock, answer mode, attention overlay, navigation lock, retained answers, PDF/report blocks, return page and scroll, automatic teacher following and private-reference exclusion passed.
- PostgreSQL/PGlite: migration repeatability; all modes; return revisions; stale-revision rejection; anonymous and other-teacher denial; private-reference rejection; end; prior lesson compatibility passed.
- Browser visual verification was blocked by the browser tool's admin-policy verification failure. No live Supabase classroom was started or changed.

Before class, apply SQL20 and publish files. Test with a teacher tab and a separate student browser: Start → Show only → change page → Let students answer → fact slide → Screens down → Return to own work → End. Confirm that the dock fits your projector and tablet screens, scrolling exposes every answer box, and the original student answer/page remains intact.
