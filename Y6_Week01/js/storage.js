(function () {
  "use strict";
  const KEY = "y6ComputingLaunch_v2";
  const LEGACY_KEY = "labLaunch_v1";
  const DB_NAME = "labLaunchDB";
  const DB_STORE = "screenshots";

  function defaults() {
    return {
      version: 2,
      student: { name: "", className: "" },
      profile: { language: "en", responseMode: "guided", readAloud: true },
      settings: { muted: false },
      current: "welcome",
      steps: { starter: 0, main1: 0, main2: 0, extension: 0, plenary: 0 },
      completed: [],
      answers: {},
      checks: {},
      extensionDone: [],
      evidence: { folder: false, folderSkipped: false, scratch: false, scratchSkipped: false },
      confidence: "",
      startedAt: null,
      finishedAt: null
    };
  }

  function merge(raw) {
    const d = defaults();
    const out = Object.assign({}, d, raw || {});
    ["student", "profile", "settings", "steps", "answers", "checks", "evidence"].forEach(function (key) {
      out[key] = Object.assign({}, d[key], (raw && raw[key]) || {});
    });
    out.completed = Array.isArray(out.completed) ? out.completed : [];
    out.extensionDone = Array.isArray(out.extensionDone) ? out.extensionDone : [];
    return out;
  }

  let state;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? merge(JSON.parse(raw)) : defaults();
      if (!raw && localStorage.getItem(LEGACY_KEY)) state.migrationNotice = true;
    } catch (e) { state = defaults(); }
    return state;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function resetAll() {
    state = defaults();
    try { localStorage.removeItem(KEY); } catch (e) {}
    return deleteScreenshot();
  }

  function openDB() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error("Image storage is unavailable."));
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function putScreenshot(key, blob) {
    return openDB().then(function (db) { return new Promise(function (resolve, reject) {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).put(blob, key);
      tx.oncomplete = resolve; tx.onerror = function () { reject(tx.error); };
    }); });
  }
  function getScreenshot(key) {
    return openDB().then(function (db) { return new Promise(function (resolve, reject) {
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = function () { resolve(req.result || null); };
      req.onerror = function () { reject(req.error); };
    }); });
  }
  function deleteScreenshot(key) {
    return openDB().then(function (db) { return new Promise(function (resolve) {
      const tx = db.transaction(DB_STORE, "readwrite");
      if (key) tx.objectStore(DB_STORE).delete(key); else tx.objectStore(DB_STORE).clear();
      tx.oncomplete = resolve; tx.onerror = resolve;
    }); }).catch(function () {});
  }

  window.LabStore = { load: load, save: save, resetAll: resetAll, putScreenshot: putScreenshot, getScreenshot: getScreenshot, deleteScreenshot: deleteScreenshot };
})();
