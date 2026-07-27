/* ==========================================================================
   LAB LAUNCH — LOCAL STORAGE LAYER
   All data stays on this device. Nothing is ever sent to a server.
   localStorage: progress, answers, settings.
   IndexedDB: uploaded screenshots (images are too large for localStorage).
   ========================================================================== */
(function () {
  "use strict";

  const LS_KEY = "labLaunch_v1";
  const DB_NAME = "labLaunchDB";
  const DB_STORE = "screenshots";

  function defaultState() {
    return {
      student: { name: "", className: "" },
      profile: { lang: null, typing: null },      // 'support' | 'full'
      settings: { muted: false, reducedMotion: false, guidedMode: false },
      stageIndex: 0,
      unlocked: ["landing"],
      completed: [],
      badges: [],
      chips: 0,
      answers: {},          // keyed by question id
      routineSort: {},      // cardId -> zone
      fileSim: { step: 0, done: false, tree: null },
      checklist: {},        // modification self-check
      extChecklist: {},
      evidence: { hasImage: false, rotation: 0 },
      plenary: {},
      confidence: null,
      extensionDone: [],
      startedAt: null,
      finishedAt: null,
      teacherUnlockedAll: false
    };
  }

  let state = null;

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(defaultState(), parsed);
        // deep-merge one level for nested objects
        const d = defaultState();
        ["student", "profile", "settings", "fileSim", "evidence"].forEach(function (k) {
          state[k] = Object.assign({}, d[k], parsed[k] || {});
        });
      } else {
        state = defaultState();
      }
    } catch (e) {
      state = defaultState();
    }
    return state;
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage full or blocked — the lesson continues without saving */
    }
  }

  function resetAll() {
    state = defaultState();
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    return deleteScreenshot().catch(function () {});
  }

  /* ---------- IndexedDB for screenshots ---------- */

  function openDB() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error("no idb")); return; }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(DB_STORE)) {
          req.result.createObjectStore(DB_STORE);
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function putScreenshot(key, blob) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).put(blob, key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function getScreenshot(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(DB_STORE, "readonly");
        const req = tx.objectStore(DB_STORE).get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function deleteScreenshot(key) {
    return openDB().then(function (db) {
      return new Promise(function (resolve) {
        const tx = db.transaction(DB_STORE, "readwrite");
        if (key) { tx.objectStore(DB_STORE).delete(key); }
        else { tx.objectStore(DB_STORE).clear(); }
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      });
    }).catch(function () {});
  }

  window.LabStore = {
    load: load,
    save: save,
    resetAll: resetAll,
    get state() { return state; },
    putScreenshot: putScreenshot,
    getScreenshot: getScreenshot,
    deleteScreenshot: deleteScreenshot
  };
})();
