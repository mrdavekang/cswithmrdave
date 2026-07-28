/* ==========================================================================
   storage.js — saving on the student's own computer.
   Main record + evidence images live in IndexedDB.
   localStorage is only used as a small fallback if IndexedDB is unavailable.
   Student data and teacher-preview data are kept under separate keys.
   ========================================================================== */
(function (global) {
  "use strict";

  var DB_NAME = "y9-t1w1-helpbutton";
  var DB_VERSION = 1;
  var STORE_RECORDS = "records";
  var STORE_IMAGES = "images";

  var LS_PREFIX = "y9t1w1:";

  var db = null;
  var idbUsable = false;
  var readyPromise = null;

  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!global.indexedDB) { reject(new Error("no-indexeddb")); return; }
      var req;
      try {
        req = global.indexedDB.open(DB_NAME, DB_VERSION);
      } catch (e) { reject(e); return; }
      req.onupgradeneeded = function (ev) {
        var d = ev.target.result;
        if (!d.objectStoreNames.contains(STORE_RECORDS)) {
          d.createObjectStore(STORE_RECORDS, { keyPath: "key" });
        }
        if (!d.objectStoreNames.contains(STORE_IMAGES)) {
          d.createObjectStore(STORE_IMAGES, { keyPath: "id" });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error("idb-open-failed")); };
      req.onblocked = function () { reject(new Error("idb-blocked")); };
    });
  }

  function ready() {
    if (readyPromise) return readyPromise;
    readyPromise = openDb().then(function (d) {
      db = d;
      idbUsable = true;
      return true;
    }).catch(function () {
      idbUsable = false;
      return false;
    });
    return readyPromise;
  }

  function tx(storeName, mode) {
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  function reqToPromise(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  /* ---------- localStorage fallback helpers ---------- */
  function lsSet(key, value) {
    try { global.localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }
  function lsGet(key) {
    try {
      var raw = global.localStorage.getItem(LS_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function lsRemove(key) {
    try { global.localStorage.removeItem(LS_PREFIX + key); } catch (e) { /* ignore */ }
  }
  function lsKeys() {
    var out = [];
    try {
      for (var i = 0; i < global.localStorage.length; i++) {
        var k = global.localStorage.key(i);
        if (k && k.indexOf(LS_PREFIX) === 0) out.push(k.slice(LS_PREFIX.length));
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  var Storage = {
    /** true when IndexedDB is being used for storage */
    usingIndexedDb: function () { return idbUsable; },

    init: function () { return ready(); },

    /* ---------------- lesson record ---------------- */
    saveRecord: function (key, record) {
      return ready().then(function () {
        if (idbUsable) {
          var store = tx(STORE_RECORDS, "readwrite");
          return reqToPromise(store.put({ key: key, record: record, savedAt: new Date().toISOString() }));
        }
        var ok = lsSet("record:" + key, record);
        if (!ok) throw new Error("storage-full");
        return true;
      });
    },

    loadRecord: function (key) {
      return ready().then(function () {
        if (idbUsable) {
          var store = tx(STORE_RECORDS, "readonly");
          return reqToPromise(store.get(key)).then(function (row) {
            return row ? row.record : null;
          });
        }
        return lsGet("record:" + key);
      });
    },

    deleteRecord: function (key) {
      return ready().then(function () {
        if (idbUsable) {
          var store = tx(STORE_RECORDS, "readwrite");
          return reqToPromise(store.delete(key));
        }
        lsRemove("record:" + key);
        return true;
      });
    },

    /* ---------------- evidence images ----------------
       Image ids are prefixed with the profile key, e.g. "student:img-abc123",
       so teacher-preview evidence can be cleared on its own.            */
    putImage: function (image) {
      return ready().then(function () {
        if (idbUsable) {
          var store = tx(STORE_IMAGES, "readwrite");
          return reqToPromise(store.put(image));
        }
        var ok = lsSet("image:" + image.id, image);
        if (!ok) throw new Error("storage-full");
        return true;
      });
    },

    getImage: function (id) {
      return ready().then(function () {
        if (idbUsable) {
          var store = tx(STORE_IMAGES, "readonly");
          return reqToPromise(store.get(id));
        }
        return lsGet("image:" + id);
      });
    },

    getImages: function (ids) {
      var jobs = (ids || []).map(function (id) { return Storage.getImage(id); });
      return Promise.all(jobs).then(function (list) {
        return list.filter(Boolean);
      });
    },

    deleteImage: function (id) {
      return ready().then(function () {
        if (idbUsable) {
          var store = tx(STORE_IMAGES, "readwrite");
          return reqToPromise(store.delete(id));
        }
        lsRemove("image:" + id);
        return true;
      });
    },

    /** Remove every image belonging to one profile ("student" or "teacher"). */
    deleteImagesForProfile: function (profileKey) {
      return ready().then(function () {
        if (idbUsable) {
          return new Promise(function (resolve, reject) {
            var store = tx(STORE_IMAGES, "readwrite");
            var cursorReq = store.openCursor();
            cursorReq.onsuccess = function (ev) {
              var cursor = ev.target.result;
              if (!cursor) { resolve(true); return; }
              if (String(cursor.value.id).indexOf(profileKey + ":") === 0) cursor.delete();
              cursor.continue();
            };
            cursorReq.onerror = function () { reject(cursorReq.error); };
          });
        }
        lsKeys().forEach(function (k) {
          if (k.indexOf("image:" + profileKey + ":") === 0) lsRemove(k);
        });
        return true;
      });
    },

    /** Wipe one profile completely (record + its images). */
    clearProfile: function (profileKey) {
      return Storage.deleteRecord(profileKey).then(function () {
        return Storage.deleteImagesForProfile(profileKey);
      });
    },

    /** Rough estimate of how much space the browser has granted / used. */
    estimate: function () {
      if (global.navigator && global.navigator.storage && global.navigator.storage.estimate) {
        return global.navigator.storage.estimate().catch(function () { return null; });
      }
      return Promise.resolve(null);
    }
  };

  global.LessonStorage = Storage;
})(window);
