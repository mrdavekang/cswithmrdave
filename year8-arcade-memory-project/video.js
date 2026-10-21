/* Native, seekable video guides. End reached is a progress check, not watch-time surveillance. */
(() => {
  'use strict';
  const lesson = () => window.MEMORY_LESSON;
  const config = card => lesson().videos?.[card?.video];
  const isComplete = (card, answer) => {
    const meta = config(card), data = answer?.data;
    return !!(meta && data?.videoVersion === meta.version &&
      typeof data.reachedEndAt === 'string' && Number.isFinite(Date.parse(data.reachedEndAt)));
  };
  const atEnd = video => Number.isFinite(video.duration) && video.duration > 0 &&
    Number.isFinite(video.currentTime) && video.currentTime >= video.duration - 0.05;

  function migrateNavigation(state) {
    const L = lesson();
    if (state.navigationVersion === L.navigationVersion) return state;
    const legacy = L.legacyCardIds;
    const convert = value => {
      const old = Math.min(legacy.length - 1, Math.max(0, Math.trunc(Number(value) || 0)));
      return Math.max(0, L.cards.findIndex(card => card.id === legacy[old]));
    };
    state.index = convert(state.index);
    state.furthest = convert(state.furthest);
    if (state.returnIndex !== undefined) state.returnIndex = convert(state.returnIndex);
    state.navigationVersion = L.navigationVersion;
    return state;
  }

  function markup(card, answer, teacher, escape) {
    const meta = config(card), complete = isComplete(card, answer);
    return `<section class="lesson-video" aria-label="${escape(card.title)}">
      <div class="video-heading"><strong>Video guide · ${escape(meta.length)}</strong><span>English · 中文 · 한국어 subtitles</span></div>
      <div id="video-shell" class="video-shell"><video id="lesson-video" controls playsinline preload="metadata" poster="${escape(meta.poster)}" aria-label="${escape(card.title)}. Pause, seek or replay using the video controls.">
        <source src="${escape(meta.src)}" type="video/mp4">
        Your browser cannot play this video. Ask your teacher for help opening the MP4.
      </video><div id="video-controls" class="video-controls" hidden>
        <div class="video-buttons"><button id="video-play" type="button" aria-label="Play video">▶ Play</button><button id="video-rewind" type="button">↶ 10 sec</button><button id="video-mute" type="button" aria-label="Mute video">Sound on</button><button id="video-full" type="button">Full screen</button></div>
        <label class="video-timeline" for="video-seek"><span>Video position</span><input id="video-seek" type="range" min="0" max="1" step="any" value="0" aria-label="Video position"><output id="video-time" for="video-seek">0:00</output></label>
      </div></div>
      <p class="video-controls-help">Press <strong>Play</strong>. Drag the timeline to revisit steps. Use <strong>Full screen</strong> for larger code and subtitles. Reach the end to continue.</p>
      <div id="video-error" class="video-error" role="alert" hidden><strong>The video could not load.</strong><p>Check your connection and try again. If it still will not play, ask your teacher. Your saved work has not been lost.</p><div class="action-row"><button id="video-retry" type="button">Try loading the video again</button><a class="button" href="${escape(meta.src)}" target="_blank" rel="noopener noreferrer">Open video in another tab ↗</a></div><p class="small">Watching in another tab does not unlock this card automatically. Return here and reach the end in this player.</p></div>
      <p id="video-status" class="video-status ${complete || teacher ? 'unlocked' : 'locked'}" role="status">${teacher && !complete ? 'Teacher preview · continue without finishing the video.' : complete ? 'End reached · your activity is unlocked. You can replay any part.' : 'Video required · reach the end to unlock the activity.'}</p>
      <p class="small">Progress saves automatically. After reaching the end once, you can replay any part without being locked again.</p>
    </section>`;
  }

  function attach({card, answer, teacher, save, onComplete, isProfileActive}) {
    const video = document.querySelector('#lesson-video');
    if (!video) return () => {};
    const meta = config(card), data = answer.data;
    if (data.videoVersion !== meta.version) {
      for (const key of ['position','duration','startedAt','reachedEndAt','completionMethod']) delete data[key];
      data.videoVersion = meta.version;
      answer.status = 'Not completed';
      answer.message = '';
    }
    const errorBox = document.querySelector('#video-error');
    const status = document.querySelector('#video-status');
    const retry = document.querySelector('#video-retry');
    const controls = document.querySelector('#video-controls');
    const playButton = document.querySelector('#video-play');
    const muteButton = document.querySelector('#video-mute');
    const seek = document.querySelector('#video-seek');
    const time = document.querySelector('#video-time');
    let disposed = false, restored = false, lastSaved = 0;
    const handlers = [];
    const on = (node, event, fn) => { node.addEventListener(event, fn); handlers.push([node, event, fn]); };
    const active = () => !disposed && isProfileActive();
    const clock = seconds => `${Math.floor(Math.max(0, seconds || 0) / 60)}:${String(Math.floor(Math.max(0, seconds || 0) % 60)).padStart(2, '0')}`;
    const updateControls = () => {
      playButton.textContent = video.paused ? '▶ Play' : 'Ⅱ Pause';
      playButton.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
      if (Number.isFinite(video.duration) && video.duration > 0) {
        seek.max = String(video.duration);
        if (document.activeElement !== seek) seek.value = String(video.currentTime || 0);
        seek.setAttribute('aria-valuetext', `${clock(video.currentTime)} of ${clock(video.duration)}`);
        time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
      }
    };
    const remember = (force = false) => {
      if (!active()) return;
      if (Number.isFinite(video.currentTime)) data.position = Math.max(0, Math.round(video.currentTime * 100) / 100);
      if (Number.isFinite(video.duration) && video.duration > 0) data.duration = Math.round(video.duration * 100) / 100;
      if (force || Date.now() - lastSaved >= 5000) { lastSaved = Date.now(); save(); }
    };
    const finish = method => {
      if (!active() || !atEnd(video) || isComplete(card, answer)) return;
      remember();
      data.videoVersion = meta.version;
      data.reachedEndAt = new Date().toISOString();
      data.completionMethod = method;
      answer.status = 'Video end reached';
      answer.message = 'The end of the video was reached. Seeking was allowed; continuous viewing was not verified.';
      answer.attempts.push({at: data.reachedEndAt, status: answer.status, data: {...data}});
      answer.attempts = answer.attempts.slice(-30);
      status.textContent = 'End reached · your activity is unlocked. You can replay any part.';
      status.className = 'video-status unlocked';
      seek.value = String(video.duration);
      save();
      onComplete();
    };

    on(video, 'loadedmetadata', () => {
      if (!active()) return;
      errorBox.hidden = true;
      if (!restored && !isComplete(card, answer) && data.videoVersion === meta.version && Number.isFinite(data.position) && data.position > 0) {
        // A refresh resumes before the end; restoring a position must not unlock an unwatched guide.
        video.currentTime = Math.min(data.position, Math.max(0, video.duration - 1));
      }
      restored = true;
      updateControls();
    });
    on(video, 'play', () => {
      if (!active()) return;
      if (data.videoVersion !== meta.version) {
        delete data.reachedEndAt; delete data.completionMethod; delete data.startedAt;
        data.videoVersion = meta.version;
      }
      if (!data.startedAt) data.startedAt = new Date().toISOString();
      if (!isComplete(card, answer)) answer.status = 'In progress';
      remember(true);
      updateControls();
    });
    on(video, 'timeupdate', () => { remember(); updateControls(); });
    on(video, 'pause', () => { remember(true); updateControls(); });
    on(video, 'seeked', () => { remember(true); if (atEnd(video)) finish('Seek reached end'); });
    on(video, 'ended', () => finish('Playback reached end'));
    on(video, 'error', () => { if (active()) errorBox.hidden = false; });
    on(retry, 'click', () => { if (active()) { errorBox.hidden = true; video.load(); } });
    const togglePlay = () => {
      if (!active()) return;
      if (!video.paused) video.pause();
      else video.play().catch(() => { status.textContent = 'Playback did not start. Press Play again, or ask your teacher for help.'; });
    };
    on(playButton, 'click', togglePlay);
    on(video, 'keydown', event => { if (event.code === 'Space' || event.key === 'Enter') { event.preventDefault(); togglePlay(); } });
    on(document.querySelector('#video-rewind'), 'click', () => { if (active()) video.currentTime = Math.max(0, video.currentTime - 10); });
    on(seek, 'input', () => { if (active() && Number.isFinite(video.duration)) video.currentTime = Math.min(video.duration, Math.max(0, Number(seek.value) || 0)); });
    on(muteButton, 'click', () => { if (active()) { video.muted = !video.muted; muteButton.textContent = video.muted ? 'Sound off' : 'Sound on'; muteButton.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video'); } });
    on(document.querySelector('#video-full'), 'click', () => {
      const shell = document.querySelector('#video-shell');
      if (shell.requestFullscreen) shell.requestFullscreen().catch(() => {});
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });
    // Controls below the picture keep the Mandarin/Korean subtitle rows visible even while paused.
    video.controls = false;
    video.tabIndex = 0;
    controls.hidden = false;
    updateControls();
    on(document, 'visibilitychange', () => { if (document.hidden) remember(true); });
    on(window, 'pagehide', () => remember(true));
    // A very fast cached load can finish before listeners are attached.
    if (video.readyState >= 1) video.dispatchEvent(new Event('loadedmetadata'));
    return () => {
      remember(true);
      disposed = true;
      for (const [node, event, fn] of handlers) node.removeEventListener(event, fn);
      video.pause();
    };
  }
  window.MemoryVideo = {config, isComplete, atEnd, migrateNavigation, markup, attach};
})();
