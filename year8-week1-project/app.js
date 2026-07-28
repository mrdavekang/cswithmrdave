/* =============================================================================
   Mission 0 — Meet the Micro:bit
   Year 8 Computer Science · Term 1, Week 1 · Project Lesson
   Static single-page application. No server, no accounts, no build step.

   Storage model
     localStorage  -> settings, progress metadata, all text responses
     IndexedDB     -> uploaded evidence images (compressed data URLs)

   TEACHER MODE
     Enter "teacher" as the full name on the landing page.
     Uses a separate storage key and unlocks every section.
   ============================================================================= */
(function () {
  'use strict';

  /* ===========================================================================
     1. CONFIGURATION  — teachers can safely edit the values in this block
     =========================================================================== */

  /** Official micro:bit editors. Update these two links if your school uses
   *  a different version or a mirrored address. */
  var EDITOR_LINK_BLOCKS = 'https://makecode.microbit.org/';
  var EDITOR_LINK_PYTHON = 'https://python.microbit.org/v/3';

  /** Lesson identity — used to validate imported backup files. */
  var LESSON_ID      = 'y8-t1w1-microbit-onboarding';
  var SCHEMA_VERSION = 1;
  var LESSON_TITLE   = 'Mission 0 — Meet the Micro:bit';
  var LESSON_META    = 'Year 8 · Term 1, Week 1 · Project Lesson';
  var SCHOOL_HEADING = 'Computer Science Department';   // change to your school name
  var TEAMS_ASSIGNMENT = 'Week 1 Project';

  /** Storage keys — student and teacher work are kept completely separate. */
  var KEY_STUDENT = 'y8t1w1.progress.v1';
  var KEY_TEACHER = 'y8t1w1.teacher.v1';
  var IDB_NAME    = 'y8t1w1-evidence';
  var IDB_STORE   = 'images';

  /** Image handling. */
  var IMG_MAX_DIM       = 1600;   // longest edge stored, in pixels
  var IMG_QUALITY       = 0.85;
  var IMG_PDF_MAX_DIM   = 900;    // images are shrunk again for the PDF
  var IMG_PDF_QUALITY    = 0.72;
  var MAX_UPLOAD_BYTES  = 12 * 1024 * 1024;   // 12 MB before compression

  /** How many characters count as a "meaningful" written answer. */
  var MIN_TEXT  = 15;
  var MIN_SHORT = 8;

  var TEACHER_TRIGGER = 'teacher';

  /* ===========================================================================
     2. LESSON CONTENT
     =========================================================================== */

  var SECTIONS = [
    { id: 'prep',      num: 1, name: 'Student preparation', time: '4 min',  optional: false },
    { id: 'starter',   num: 2, name: 'Starter',             time: '8 min',  optional: false },
    { id: 'ma1',       num: 3, name: 'Main Activity 1',     time: '17 min', optional: false },
    { id: 'ma2',       num: 4, name: 'Main Activity 2',     time: '25 min', optional: false },
    { id: 'challenge', num: 5, name: 'Optional challenge',  time: 'extra',  optional: true  },
    { id: 'plenary',   num: 6, name: 'Plenary',             time: '8 min',  optional: false },
    { id: 'review',    num: 7, name: 'Review & export',     time: '3 min',  optional: false }
  ];

  var CHECKLISTS = {
    starter: {
      title: 'Starter completion checklist',
      items: [
        { id: 's1', text: 'I understand the editor-to-device workflow.' },
        { id: 's2', text: 'I know how to hold the micro:bit safely.' },
        { id: 's3', text: 'I know that the micro USB connector must be inserted straight.' },
        { id: 's4', text: 'I know that the cable should be removed by holding the connector.' }
      ]
    },
    connect: {
      title: 'Connection checklist',
      items: [
        { id: 'c1', text: 'I checked the connector orientation.' },
        { id: 'c2', text: 'I inserted the micro USB connector straight.' },
        { id: 'c3', text: 'I connected the computer end after the micro:bit end.' },
        { id: 'c4', text: 'The device or MICROBIT drive appeared.' },
        { id: 'c5', text: 'I did not force the connector.' }
      ]
    },
    ma1: {
      title: 'Main Activity 1 completion checklist',
      items: [
        { id: 'm1', text: 'I identified the main parts.' },
        { id: 'm2', text: 'I connected the micro:bit safely.' },
        { id: 'm3', text: 'I opened an editor.' },
        { id: 'm4', text: 'I named my project correctly.' },
        { id: 'm5', text: 'I uploaded evidence.' },
        { id: 'm6', text: 'I explained one successful check or problem encountered.' }
      ]
    },
    ma2: {
      title: 'Main Activity 2 completion checklist',
      items: [
        { id: 'w1', text: 'My program displays an icon.' },
        { id: 'w2', text: 'My program displays initials or a short message.' },
        { id: 'w3', text: 'I tested it in the simulator.' },
        { id: 'w4', text: 'I transferred it to the physical micro:bit.' },
        { id: 'w5', text: 'I checked the real output.' },
        { id: 'w6', text: 'I compared expected and actual results.' },
        { id: 'w7', text: 'I uploaded my code evidence.' },
        { id: 'w8', text: 'I uploaded physical-device evidence.' },
        { id: 'w9', text: 'I recorded a test, correction or successful result.' }
      ]
    }
  };

  /* Starter A — workflow sequencing */
  var SEQUENCE_ITEMS = [
    { id: 'q1', text: 'Create the program in the editor' },
    { id: 'q2', text: 'Test it in the simulator' },
    { id: 'q3', text: 'Download and transfer it to the micro:bit' },
    { id: 'q4', text: 'Observe the physical micro:bit output' }
  ];
  var SEQUENCE_CORRECT = ['q1', 'q2', 'q3', 'q4'];
  var SEQUENCE_START   = ['q3', 'q1', 'q4', 'q2'];   // deliberately out of order

  /* Starter B — safe or unsafe */
  var SAFETY_ITEMS = [
    { id: 'f1', text: 'Holding the micro:bit by its edges.', safe: true,
      why: 'Correct. Holding the board by its edges keeps your fingers off the components and reduces the chance of damage.' },
    { id: 'f2', text: 'Forcing the micro USB connector in at an angle.', safe: false,
      why: 'Unsafe. Forcing the connector bends the pins inside the micro USB port. If it does not slide in easily, take it out, look at the shape and try again straight.' },
    { id: 'f3', text: 'Removing the cable by holding the connector.', safe: true,
      why: 'Correct. Gripping the plastic connector puts the pulling force on the connector, not on the delicate solder joints of the port.' },
    { id: 'f4', text: 'Pulling the cable out by the wire.', safe: false,
      why: 'Unsafe. Pulling the wire stretches it away from the connector. This is the most common way school cables stop working.' },
    { id: 'f5', text: 'Keeping a drink beside the device on the desk.', safe: false,
      why: 'Unsafe. A spill can destroy the board and the laptop underneath it. Drinks stay off the work surface.' },
    { id: 'f6', text: 'Returning the numbered device and cable to the matching slot at the end.', safe: true,
      why: 'Correct. Matching numbers means faults can be traced and the next class receives a complete set.' }
  ];

  /* Main Activity 1 Step 1 — parts matching */
  var PART_PURPOSES = [
    { id: 'p_led',   text: 'Output: 25 red LEDs arranged in a 5 by 5 grid that display icons, letters and numbers.' },
    { id: 'p_btna',  text: 'Input: the left-hand button, marked A, that a program can react to when it is pressed.' },
    { id: 'p_btnb',  text: 'Input: the right-hand button, marked B, that a program can react to when it is pressed.' },
    { id: 'p_usb',   text: 'The small port on the top edge that carries power and receives the transferred program.' },
    { id: 'p_edge',  text: 'The gold strips along the bottom edge used for crocodile clips and add-on boards.' },
    { id: 'p_cable', text: 'The physical data link between the computer and the micro:bit.' },
    { id: 'p_board', text: 'The small programmable circuit board that stores and runs your program.' }
  ];
  var PART_TERMS = [
    { id: 't_board', term: 'micro:bit',         answer: 'p_board' },
    { id: 't_cable', term: 'USB cable',         answer: 'p_cable' },
    { id: 't_led',   term: 'LED matrix',        answer: 'p_led'   },
    { id: 't_btna',  term: 'Button A',          answer: 'p_btna'  },
    { id: 't_btnb',  term: 'Button B',          answer: 'p_btnb'  },
    { id: 't_usb',   term: 'micro USB port',    answer: 'p_usb'   },
    { id: 't_edge',  term: 'Edge connector pins', answer: 'p_edge' }
  ];

  /* Main Activity 1 Step 1 — retrieval questions */
  var RETRIEVAL = [
    { id: 'r1',
      q: 'The LED matrix is an example of a…',
      options: [
        { id: 'a', text: 'Output device' },
        { id: 'b', text: 'Input device' },
        { id: 'c', text: 'Storage device' },
        { id: 'd', text: 'Power supply' }
      ],
      answer: 'a',
      why: 'The LED matrix is an output because it displays information produced by the program.' },
    { id: 'r2',
      q: 'Buttons A and B are examples of…',
      options: [
        { id: 'a', text: 'Output devices' },
        { id: 'b', text: 'Input devices' },
        { id: 'c', text: 'Edge connectors' },
        { id: 'd', text: 'Simulators' }
      ],
      answer: 'b',
      why: 'Buttons are inputs: they send information into the program when a person presses them.' }
  ];

  var ICON_CHOICES = ['Heart', 'Small heart', 'Happy', 'Yes (tick)', 'Star / Diamond',
    'Square', 'Target', 'Duck', 'House', 'Umbrella', 'Ghost', 'Chessboard'];

  var TRANSFER_METHODS = [
    'Direct browser pairing (Connect device / WebUSB)',
    'Downloaded .hex file',
    'Drag-and-drop to the MICROBIT drive',
    'Another teacher-approved method'
  ];

  var PLENARY_QS = [
    { id: 'q1', text: 'One step required to move a program from the editor to the physical micro:bit is…' },
    { id: 'q2', text: 'The LED matrix is an output device because…' },
    { id: 'q3', text: 'One rule that protects the micro USB port is…' },
    { id: 'q4', text: 'One problem I encountered and how I responded was…' },
    { id: 'q5', text: 'The simulator helped me by…' }
  ];
  var READINESS = ['Ready independently', 'Ready with a reminder',
    'Need more connection practice', 'Need more transfer practice'];

  var FIGURES = {
    1: { file: '1.png', title: 'Figure 1 \u2014 Collect and identify parts',
         alt: 'Instructional diagram headed "Main Activity 1: collect and identify parts". A micro:bit board is drawn from the front. Labels point to the LED matrix in the centre, Button A on the left of it, Button B on the right of it, and the board itself. Along the bottom edge is the gold connector strip marked 0, 1, 2, 3V and GND. Beside the board is a USB cable with the large flat USB-A plug at one end and the small micro USB plug at the other.',
         cap: 'The micro:bit and its cable, with the parts you need to recognise labelled.' },
    2: { file: '2.png', title: 'Figure 2 \u2014 Handle with care: the micro USB connector',
         alt: 'Instructional diagram headed "Handle with care \u2013 micro USB connector", with a warning triangle and three rules: the port is small and fragile, push the connector in straight, and unplug by holding the connector. Below are four panels. Two ticked panels show the connector going straight into the port on the top edge of the micro:bit, and a hand gripping the connector and pulling it straight out. Two crossed panels show the connector being angled and forced into the port, with a burst symbol marking the damage, and a hand pulling the cable by the wire.',
         cap: 'Straight in, straight out, and always hold the connector \u2014 never the wire.' },
    3: { file: '3.png', title: 'Figure 3 \u2014 Open MakeCode and create a new project',
         alt: 'Three-panel instructional diagram headed "Open MakeCode and create a new project". Panel 1: a laptop with makecode.microbit.org typed into the address bar, and the micro:bit home page showing New Project and Import buttons. Panel 2: the MakeCode editor, with the simulator on the left, the block categories Basic, Input, Music, LED, Loops, Logic, Variables and Math in the middle, and a hand clicking the New Project button. Panel 3: a "Create a Project" dialogue with the name Y8_8T_Pair04_SmartBadge_W1 typed into the box and a Create button beneath it.',
         cap: 'Open the editor, choose New Project, then type your project name exactly.' },
    4: { file: '4.png', title: 'Figure 4 \u2014 Build the first icon and message',
         alt: 'Three-panel instructional diagram headed "Build the first icon/message in MakeCode". Panel 1: a show icon block being dragged into an empty on start block. Panel 2: the show icon block now inside on start, with its drop-down open showing a grid of icons including a heart and a smiley face. Panel 3: the finished stack, with on start containing a show icon block followed by a show string block holding the text "HI". A tip along the bottom reads: test your program in the simulator before downloading it.',
         cap: 'Drag show icon into on start, choose your icon, then add show string.' },
    5: { file: '5.png', title: 'Figure 5 \u2014 Test in the simulator',
         alt: 'Instructional diagram for step 5, "Test in the simulator". On the left are three numbered instructions: click the Play button, watch your icon or message appear in the simulator, and if it is not what you expected, edit your blocks and test again. A circular arrow shows the repeat cycle. On the right, the on-screen simulator micro:bit displays a heart shape lit on its LED grid, with the stop, restart, sound and full-screen controls underneath.',
         cap: 'Click Play, watch the output, then edit and re-test if it is not what you expected.' },
    6: { file: '6.png', title: 'Figure 6 \u2014 Download and transfer to the micro:bit',
         alt: 'Four-panel instructional diagram headed "Download and transfer to micro:bit". Panel 1: a hand clicking the Download button in the MakeCode editor. Panel 2: the browser saving a file named my-project.hex. Panel 3: a file manager window in which the hex file is dragged onto a drive named MICROBIT in the sidebar. Panel 4: the micro:bit connected by its USB cable with light lines around it, showing the LED flashing while the code is written. Tips at the bottom say to make sure the micro:bit is connected, not to unplug the cable while the LED is flashing, and to click Download again if the file does not appear.',
         cap: 'Download, save the .hex file, drag it onto the MICROBIT drive, then wait.' },
    7: { file: '7.png', title: 'Figure 7 \u2014 Check the real output on the device',
         alt: 'Four-panel instructional diagram headed "Check the real output on the device \u2014 compare the micro:bit display with what you expected". Panel 1: a hand holding the micro:bit by its edges with a face icon lit on the LED matrix. Panel 2: a laptop showing the simulator beside a box labelled "expected result", so the two can be compared. Panel 3: a large tick in a box with the word MATCH. Panel 4: the editor open with show icon, pause and show icon blocks, captioned "change something, then test again". Tips at the bottom say to check the display carefully, wait a few seconds for the program to finish loading, and test again making small improvements if it does not match.',
         cap: 'Compare the real LED output with the simulator and with what you predicted.' }
  };

  /* ===========================================================================
     3. SMALL UTILITIES
     =========================================================================== */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Strip accents and every character that is illegal in a Windows/macOS filename. */
  function sanitiseFilePart(s) {
    var t = String(s == null ? '' : s);
    try { t = t.normalize('NFKD').replace(/[̀-ͯ]/g, ''); } catch (e) { /* older browser */ }
    t = t.replace(/[^A-Za-z0-9]+/g, '_')   // covers \ / : * ? " < > | and spaces
         .replace(/_+/g, '_')
         .replace(/^_+|_+$/g, '')
         .slice(0, 40);
    return t || 'Unknown';
  }

  function nowISO() { return new Date().toISOString(); }

  function prettyDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function filled(v, min) { return String(v == null ? '' : v).trim().length >= (min || 1); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function getPath(obj, path) {
    var parts = path.split('.'), cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }
  function setPath(obj, path, value) {
    var parts = path.split('.'), cur = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function toast(msg, tone, ms) {
    var wrap = $('#toastWrap');
    var el = document.createElement('div');
    el.className = 'toast' + (tone ? ' ' + tone : '');
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
    }, ms || 3600);
  }

  /** Brief shake so a click on a locked control feels registered, not ignored. */
  function flashLocked(el) {
    if (!el) return;
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    setTimeout(function () { el.classList.remove('shake'); }, 450);
  }

  /* ===========================================================================
     4. STATE
     =========================================================================== */

  function blankState() {
    return {
      lessonId: LESSON_ID,
      schemaVersion: SCHEMA_VERSION,
      lessonTitle: LESSON_TITLE,
      teacherMode: false,
      student: { fullName: '', className: '' },
      currentSection: 'prep',
      startedAt: nowISO(),
      updatedAt: nowISO(),
      completedAt: null,
      lastBackupAt: null,
      lastPdfAt: null,
      data: {
        prep:      { deviceNumber: '', cableNumber: '', workMode: '', partnerName: '', projectFileName: '', ready: false },
        ma1:       { editorChoice: '', projectName: '', evidenceCaption: '', problemSolved: '' },
        ma2:       { icon: '', iconOther: '', message: '', prediction: '', reason: '',
                     simMatched: '', simChange: '', transferMethod: '',
                     cmpExpected: '', cmpSimulator: '', cmpPhysical: '',
                     allMatched: '', improvement: '',
                     capCode: '', capDevice: '', capExtra: '' },
        challenge: { attempted: false, buttonPlan: '', changeMade: '', worked: '', caption: '' },
        plenary:   { q1: '', q2: '', q3: '', q4: '', q5: '', readiness: '' }
      },
      checks: {},                 // "group.id" -> boolean
      activity: {
        sequence:  { order: SEQUENCE_START.slice(), checked: false, correct: false, attempts: 0 },
        safety:    { answers: {}, checked: false, attempts: 0 },
        parts:     { answers: {}, checked: false, attempts: 0 },
        retrieval: { answers: {}, checked: false, attempts: 0 },
        ledFeedbackSeen: false
      },
      evidenceMeta: {},           // slot -> { caption, stage, timestamp, w,h,bytes,name }
      sectionsComplete: {},       // id -> true
      sectionsVisited: {}
    };
  }

  var state = blankState();
  var storageKey = KEY_STUDENT;
  var saveTimer = null;
  var rendered = false;

  /* ---- localStorage ------------------------------------------------------ */

  function setSaveStatus(kind) {
    var el = $('#saveStatus'), t = $('#saveStatusText');
    if (!el) return;
    el.setAttribute('data-state', kind);
    t.textContent = kind === 'saving' ? 'Saving…' : kind === 'error' ? 'Save failed' : 'Saved';
  }

  function saveNow() {
    try {
      state.updatedAt = nowISO();
      localStorage.setItem(storageKey, JSON.stringify(state));
      setSaveStatus('ok');
      return true;
    } catch (e) {
      setSaveStatus('error');
      toast('Could not save your progress. Your browser storage may be full or private mode may be on.', 'bad', 6000);
      return false;
    }
  }

  function scheduleSave() {
    setSaveStatus('saving');
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { saveNow(); }, 450);
  }

  function loadState(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || obj.lessonId !== LESSON_ID) return null;
      return mergeState(obj);
    } catch (e) { return null; }
  }

  function mergeState(obj) {
    var base = blankState();
    var out = Object.assign(base, obj);
    out.student  = Object.assign(base.student, obj.student || {});
    out.data     = Object.assign({}, base.data);
    Object.keys(base.data).forEach(function (k) {
      out.data[k] = Object.assign({}, base.data[k], (obj.data || {})[k] || {});
    });
    out.activity = Object.assign({}, base.activity, obj.activity || {});
    out.activity.sequence  = Object.assign({}, base.activity.sequence,  (obj.activity || {}).sequence  || {});
    out.activity.safety    = Object.assign({}, base.activity.safety,    (obj.activity || {}).safety    || {});
    out.activity.parts     = Object.assign({}, base.activity.parts,     (obj.activity || {}).parts     || {});
    out.activity.retrieval = Object.assign({}, base.activity.retrieval, (obj.activity || {}).retrieval || {});
    out.checks           = Object.assign({}, obj.checks || {});
    out.evidenceMeta     = Object.assign({}, obj.evidenceMeta || {});
    out.sectionsComplete = Object.assign({}, obj.sectionsComplete || {});
    out.sectionsVisited  = Object.assign({}, obj.sectionsVisited || {});
    out.schemaVersion    = SCHEMA_VERSION;
    return out;
  }

  /* ---- IndexedDB --------------------------------------------------------- */

  var dbPromise = null;
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!('indexedDB' in window)) { reject(new Error('IndexedDB unavailable')); return; }
      var req;
      /* Opening IndexedDB can throw synchronously — Firefox and Safari raise a
         SecurityError on file:// pages and in some private-browsing modes. */
      try { req = indexedDB.open(IDB_NAME, 1); }
      catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE, { keyPath: 'key' });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror   = function () { reject(req.error); };
      req.onblocked = function () { reject(new Error('IndexedDB is blocked by another open tab.')); };
    });
    return dbPromise;
  }

  function idbKey(slot) { return (state.teacherMode ? 'teacher' : 'student') + ':' + slot; }

  function idbPut(slot, record) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        record.key = idbKey(slot);
        tx.objectStore(IDB_STORE).put(record);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror    = function () { reject(tx.error); };
      });
    });
  }

  function idbGet(slot) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readonly');
        var r = tx.objectStore(IDB_STORE).get(idbKey(slot));
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror   = function () { reject(r.error); };
      });
    }).catch(function () { return null; });
  }

  function idbDel(slot) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(idbKey(slot));
        tx.oncomplete = function () { resolve(true); };
        tx.onerror    = function () { reject(tx.error); };
      });
    }).catch(function () { return false; });
  }

  /* ---- image compression ------------------------------------------------- */

  function compressImage(file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        try {
          var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
          var scale = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
          var c = document.createElement('canvas');
          c.width = cw; c.height = ch;
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#ffffff';           // flatten transparency so JPEG stays readable
          ctx.fillRect(0, 0, cw, ch);
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, cw, ch);
          var dataUrl = c.toDataURL('image/jpeg', quality);
          URL.revokeObjectURL(url);
          resolve({ dataUrl: dataUrl, w: cw, h: ch, bytes: Math.round(dataUrl.length * 0.75) });
        } catch (e) { URL.revokeObjectURL(url); reject(e); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Not a readable image file.')); };
      img.src = url;
    });
  }

  function recompressDataUrl(dataUrl, maxDim, quality) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, maxDim / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
        var c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, cw, ch);
        resolve({ dataUrl: c.toDataURL('image/jpeg', quality), w: cw, h: ch });
      };
      img.onerror = function () { resolve(null); };
      img.src = dataUrl;
    });
  }

  /* ===========================================================================
     5. EVIDENCE SLOTS
     =========================================================================== */

  var EVIDENCE_SLOTS = [
    { slot: 'ma1_main',   section: 'ma1',       required: true,
      title: 'Main Activity 1 evidence', stage: 'Main Activity 1 — onboarding',
      desc: 'Upload ONE of: a screenshot showing the correctly named project, a photo showing the connected micro:bit, or a screenshot showing the editor open.',
      captionPath: 'ma1.evidenceCaption' },
    { slot: 'ma2_code',   section: 'ma2',       required: true,
      title: 'Code evidence', stage: 'Main Activity 2 — program',
      desc: 'Required: a screenshot of your program or blocks.',
      captionPath: 'ma2.capCode' },
    { slot: 'ma2_device', section: 'ma2',       required: true,
      title: 'Physical device evidence', stage: 'Main Activity 2 — physical output',
      desc: 'Required: a photo of your micro:bit showing the output on its LED matrix.',
      captionPath: 'ma2.capDevice' },
    { slot: 'ma2_extra',  section: 'ma2',       required: false,
      title: 'Extra evidence (optional)', stage: 'Main Activity 2 — extra',
      desc: 'Optional: simulator output, the MICROBIT drive, or debugging evidence.',
      captionPath: 'ma2.capExtra' },
    { slot: 'challenge',  section: 'challenge', required: false,
      title: 'Challenge evidence (optional)', stage: 'Optional challenge',
      desc: 'Optional: a screenshot or photo of your Button A behaviour working.',
      captionPath: 'challenge.caption' }
  ];

  function slotDef(slot) {
    for (var i = 0; i < EVIDENCE_SLOTS.length; i++) if (EVIDENCE_SLOTS[i].slot === slot) return EVIDENCE_SLOTS[i];
    return null;
  }
  function hasEvidence(slot) { return !!state.evidenceMeta[slot]; }

  /* ===========================================================================
     6. COMPLETION RULES
     =========================================================================== */

  function checkOn(group, id) { return !!state.checks[group + '.' + id]; }
  function groupComplete(group) {
    return CHECKLISTS[group].items.every(function (it) { return checkOn(group, it.id); });
  }

  function seqCorrect() {
    var o = state.activity.sequence.order;
    return o.length === SEQUENCE_CORRECT.length && o.every(function (id, i) { return id === SEQUENCE_CORRECT[i]; });
  }
  function safetyAllAnswered() {
    return SAFETY_ITEMS.every(function (it) { return state.activity.safety.answers[it.id] != null; });
  }
  function partsAllAnswered() {
    return PART_TERMS.every(function (t) { return filled(state.activity.parts.answers[t.id]); });
  }
  function partsAllCorrect() {
    return PART_TERMS.every(function (t) { return state.activity.parts.answers[t.id] === t.answer; });
  }
  function retrievalAllAnswered() {
    return RETRIEVAL.every(function (q) { return filled(state.activity.retrieval.answers[q.id]); });
  }

  /** Project name validation against Y8_Class_PairNumber_SmartBadge_W1 */
  function validateProjectName(name) {
    var n = String(name || '').trim();
    var out = { input: n, parts: [], ok: false };
    if (!n) { out.parts.push({ label: 'A project name has been entered', ok: false }); return out; }
    var compact = n.replace(/\s+/g, '');
    var y8    = /^y8/i.test(compact);
    var cls   = new RegExp('[_\\-]' + (state.student.className || '').replace(/[^A-Za-z0-9]/g, '') + '[_\\-]', 'i')
                  .test(compact) || /^y8[_\-][A-Za-z0-9]{1,5}[_\-]/i.test(compact);
    var pair  = /pair[_\-]?\d{1,2}/i.test(compact);
    var badge = /smart[_\-]?badge/i.test(compact);
    var wk    = /w1\b|w1$|_w1/i.test(compact);
    out.parts = [
      { label: 'Starts with Y8', ok: y8 },
      { label: 'Includes your class', ok: cls },
      { label: 'Includes a pair number, e.g. Pair04', ok: pair },
      { label: 'Includes SmartBadge', ok: badge },
      { label: 'Ends with W1', ok: wk }
    ];
    out.ok = y8 && pair && badge && wk;
    return out;
  }

  var RULES = {
    prep: function () {
      var d = state.data.prep;
      if (!filled(d.deviceNumber) || !filled(d.cableNumber) || !filled(d.workMode)) return false;
      if (d.workMode === 'With a partner' && !filled(d.partnerName, 2)) return false;
      return !!d.ready;
    },
    starter: function () {
      var a = state.activity;
      return a.sequence.checked && seqCorrect() &&
             a.safety.checked && safetyAllAnswered() &&
             groupComplete('starter');
    },
    ma1: function () {
      var d = state.data.ma1;
      return state.activity.parts.checked && partsAllAnswered() &&
             state.activity.retrieval.checked && retrievalAllAnswered() &&
             groupComplete('connect') &&
             filled(d.editorChoice) &&
             validateProjectName(d.projectName).ok &&
             hasEvidence('ma1_main') &&
             filled(d.problemSolved, MIN_TEXT) &&
             groupComplete('ma1');
    },
    ma2: function () {
      var d = state.data.ma2;
      return filled(d.icon) && filled(d.message) &&
             filled(d.prediction, MIN_SHORT) && filled(d.reason, MIN_SHORT) &&
             filled(d.simMatched) && filled(d.simChange, MIN_SHORT) &&
             filled(d.transferMethod) &&
             filled(d.cmpExpected, MIN_SHORT) && filled(d.cmpSimulator, MIN_SHORT) && filled(d.cmpPhysical, MIN_SHORT) &&
             filled(d.allMatched) &&
             hasEvidence('ma2_code') && hasEvidence('ma2_device') &&
             groupComplete('ma2');
    },
    challenge: function () {
      var d = state.data.challenge;
      return filled(d.buttonPlan, MIN_SHORT) && filled(d.changeMade, MIN_SHORT) && filled(d.worked);
    },
    plenary: function () {
      var d = state.data.plenary;
      return PLENARY_QS.every(function (q) { return filled(d[q.id], MIN_TEXT); }) && filled(d.readiness);
    },
    /* Review is only complete once every other core section is done AND a PDF
       has been exported. A partial export from the header must not tick it off. */
    review: function () {
      if (!state.lastPdfAt) return false;
      return SECTIONS.every(function (s) {
        return s.optional || s.id === 'review' || !!state.sectionsComplete[s.id];
      });
    }
  };

  function isComplete(id) { return !!state.sectionsComplete[id]; }

  function recomputeCompletion() {
    SECTIONS.forEach(function (s) {
      if (s.id === 'challenge') {
        state.data.challenge.attempted =
          filled(state.data.challenge.buttonPlan) || filled(state.data.challenge.changeMade) ||
          filled(state.data.challenge.worked) || hasEvidence('challenge');
      }
      state.sectionsComplete[s.id] = !!RULES[s.id]();
    });
    var coreDone = SECTIONS.filter(function (s) { return !s.optional; })
                           .every(function (s) { return state.sectionsComplete[s.id]; });
    if (coreDone && !state.completedAt) state.completedAt = nowISO();
    if (!coreDone) state.completedAt = null;
  }

  function isUnlocked(id) {
    if (state.teacherMode) return true;
    switch (id) {
      case 'prep':      return true;
      case 'starter':   return isComplete('prep');
      case 'ma1':       return isComplete('starter');
      case 'ma2':       return isComplete('ma1');
      case 'challenge': return isComplete('ma2');   // optional, never a gate
      case 'plenary':   return isComplete('ma2');   // NOT gated by the challenge
      case 'review':    return isComplete('plenary');
      default:          return false;
    }
  }

  function unlockMessage(id) {
    switch (id) {
      case 'starter':   return 'Finish the Student preparation section first.';
      case 'ma1':       return 'Finish the Starter section first.';
      case 'ma2':       return 'Finish Main Activity 1 first.';
      case 'challenge': return 'The optional challenge opens once Main Activity 2 is complete.';
      case 'plenary':   return 'Finish Main Activity 2 first. The optional challenge is not required.';
      case 'review':    return 'Answer the plenary questions first.';
      default:          return 'This section is not available yet.';
    }
  }

  /** What is still missing in a section — used for the pager hint. */
  function missingList(id) {
    var m = [], d = state.data;
    if (id === 'prep') {
      if (!filled(d.prep.deviceNumber)) m.push('device number');
      if (!filled(d.prep.cableNumber)) m.push('cable number');
      if (!filled(d.prep.workMode)) m.push('independent or with a partner');
      if (d.prep.workMode === 'With a partner' && !filled(d.prep.partnerName, 2)) m.push('partner name');
      if (!d.prep.ready) m.push('the equipment confirmation');
    } else if (id === 'starter') {
      if (!state.activity.sequence.checked || !seqCorrect()) m.push('the correct workflow order (check your answer)');
      if (!safetyAllAnswered() || !state.activity.safety.checked) m.push('all six safe/unsafe answers (check your answers)');
      if (!groupComplete('starter')) m.push('the starter checklist');
    } else if (id === 'ma1') {
      if (!partsAllAnswered() || !state.activity.parts.checked) m.push('the parts matching check');
      if (!retrievalAllAnswered() || !state.activity.retrieval.checked) m.push('the two retrieval questions');
      if (!groupComplete('connect')) m.push('the connection checklist');
      if (!filled(d.ma1.editorChoice)) m.push('which editor you opened');
      if (!validateProjectName(d.ma1.projectName).ok) m.push('a project name that matches the convention');
      if (!hasEvidence('ma1_main')) m.push('one piece of evidence');
      if (!filled(d.ma1.problemSolved, MIN_TEXT)) m.push('your successful check or problem (at least ' + MIN_TEXT + ' characters)');
      if (!groupComplete('ma1')) m.push('the Main Activity 1 checklist');
    } else if (id === 'ma2') {
      if (!filled(d.ma2.icon)) m.push('your chosen icon');
      if (!filled(d.ma2.message)) m.push('your initials or short word');
      if (!filled(d.ma2.prediction, MIN_SHORT) || !filled(d.ma2.reason, MIN_SHORT)) m.push('your prediction and reason');
      if (!filled(d.ma2.simMatched) || !filled(d.ma2.simChange, MIN_SHORT)) m.push('your simulator test result');
      if (!filled(d.ma2.transferMethod)) m.push('your transfer method');
      if (!filled(d.ma2.cmpExpected, MIN_SHORT) || !filled(d.ma2.cmpSimulator, MIN_SHORT) || !filled(d.ma2.cmpPhysical, MIN_SHORT))
        m.push('all three comparison columns');
      if (!filled(d.ma2.allMatched)) m.push('whether all three matched');
      if (!hasEvidence('ma2_code')) m.push('code evidence');
      if (!hasEvidence('ma2_device')) m.push('physical device evidence');
      if (!groupComplete('ma2')) m.push('the Main Activity 2 checklist');
    } else if (id === 'challenge') {
      if (!filled(d.challenge.buttonPlan, MIN_SHORT)) m.push('what Button A should do');
      if (!filled(d.challenge.changeMade, MIN_SHORT)) m.push('the change you made');
      if (!filled(d.challenge.worked)) m.push('whether it worked');
    } else if (id === 'plenary') {
      var missingQ = PLENARY_QS.filter(function (q) { return !filled(d.plenary[q.id], MIN_TEXT); });
      if (missingQ.length) m.push(missingQ.length + ' plenary answer' + (missingQ.length > 1 ? 's' : '') +
        ' (at least ' + MIN_TEXT + ' characters each)');
      if (!filled(d.plenary.readiness)) m.push('your readiness choice');
    } else if (id === 'review') {
      if (!state.lastPdfAt) m.push('your PDF export');
    }
    return m;
  }

  /* ===========================================================================
     7. HTML BUILDING HELPERS
     =========================================================================== */

  function figureHTML(n) {
    var f = FIGURES[n];
    return '' +
      '<figure class="figure" data-fig="' + n + '">' +
        '<button type="button" class="figure-btn" data-zoom="' + n + '" ' +
          'aria-label="Enlarge ' + esc(f.title) + '">' +
          '<img src="assets/images/' + f.file + '" alt="' + esc(f.alt) + '" ' +
            'onerror="window.__figFallback && window.__figFallback(this,' + n + ')">' +
        '</button>' +
        '<figcaption><span>' + esc(f.title) + ': ' + esc(f.cap) + '</span>' +
          '<span class="figcap-zoom" aria-hidden="true">Click to enlarge</span></figcaption>' +
      '</figure>';
  }

  window.__figFallback = function (img, n) {
    var f = FIGURES[n];
    var host = img.closest('.figure-btn');
    if (!host) return;
    host.outerHTML = '<div class="figure-missing"><strong>' + esc(f.title) + ' is not available</strong>' +
      'The file <code>assets/images/' + f.file + '</code> could not be loaded. ' +
      'The written instructions above contain everything you need.</div>';
  };

  function checklistHTML(group) {
    var cl = CHECKLISTS[group];
    return '<h3>' + esc(cl.title) + '</h3>' +
      '<ul class="checklist">' + cl.items.map(function (it) {
        return '<li><label class="check"><input type="checkbox" data-check="' + group + '.' + it.id + '">' +
          '<span class="check-text">' + esc(it.text) + '</span></label></li>';
      }).join('') + '</ul>';
  }

  function taHTML(id, path, label, hint, rows) {
    return '<div class="field">' +
      '<label for="' + id + '">' + esc(label) + '</label>' +
      '<textarea id="' + id + '" data-bind="' + path + '" rows="' + (rows || 3) + '"></textarea>' +
      (hint ? '<p class="hint">' + esc(hint) + '</p>' : '') + '</div>';
  }

  function inHTML(id, path, label, hint, placeholder) {
    return '<div class="field">' +
      '<label for="' + id + '">' + esc(label) + '</label>' +
      '<input type="text" id="' + id + '" data-bind="' + path + '"' +
      (placeholder ? ' placeholder="' + esc(placeholder) + '"' : '') + '>' +
      (hint ? '<p class="hint">' + esc(hint) + '</p>' : '') + '</div>';
  }

  function radiosHTML(name, path, options, stacked) {
    return '<div class="' + (stacked ? 'radio-stack' : 'radio-row') + '" role="radiogroup" aria-label="' + esc(name) + '">' +
      options.map(function (o, i) {
        var v = typeof o === 'string' ? o : o.value;
        var t = typeof o === 'string' ? o : o.text;
        return '<label class="radio-chip"><input type="radio" name="' + name + '" value="' + esc(v) + '" ' +
          'data-bind="' + path + '"> <span>' + esc(t) + '</span></label>';
      }).join('') + '</div>';
  }

  function evidenceHTML(slot) {
    var d = slotDef(slot);
    return '' +
    '<div class="ev-slot" data-slot="' + slot + '">' +
      '<div class="ev-head"><p class="ev-title">' + esc(d.title) + '</p>' +
        '<span class="' + (d.required ? 'ev-req">Required' : 'ev-opt">Optional') + '</span></div>' +
      '<p class="ev-desc">' + esc(d.desc) + '</p>' +
      '<div class="ev-thumb" data-thumb><p class="ev-empty">No image yet</p></div>' +
      '<p class="ev-file" data-file></p>' +
      '<label for="cap_' + slot + '">Caption</label>' +
      '<input type="text" id="cap_' + slot + '" data-bind="' + d.captionPath + '" placeholder="Describe what this shows">' +
      '<p class="upload-status" data-status role="status" aria-live="polite"></p>' +
      '<div class="ev-actions">' +
        '<input type="file" accept="image/*" class="visually-hidden-file" id="file_' + slot + '" data-file-input>' +
        '<button type="button" class="btn btn-secondary btn-sm" data-act="pick">Upload image</button>' +
        '<button type="button" class="btn btn-secondary btn-sm" data-act="replace" hidden>Replace</button>' +
        '<button type="button" class="btn btn-danger btn-sm" data-act="delete" hidden>Delete</button>' +
      '</div>' +
    '</div>';
  }

  /* ===========================================================================
     8. SECTION MARKUP
     =========================================================================== */

  function sectionShell(id, eyebrow, title, time, optional, intro, body) {
    return '<section class="section" id="sec-' + id + '" data-section="' + id + '" hidden>' +
      '<div class="section-head">' +
        '<p class="eyebrow">' + esc(eyebrow) + '</p>' +
        '<h2>' + esc(title) + '</h2>' +
        (intro ? '<p class="section-intro">' + intro + '</p>' : '') +
        '<div class="section-meta">' +
          '<span class="pill pill-time">Estimated time: ' + esc(time) + '</span>' +
          (optional ? '<span class="pill pill-opt">Optional — not required for the plenary</span>' : '') +
          '<span class="pill" data-status-pill>Not completed</span>' +
        '</div>' +
      '</div>' + body + '</section>';
  }

  function buildPrep() {
    var body =
    '<div class="card">' +
      '<h3>What you need on your desk</h3>' +
      '<ul>' +
        '<li>One micro:bit</li>' +
        '<li>One USB data cable</li>' +
        '<li>A laptop or computer</li>' +
        '<li>Access to a camera or an image file, for evidence</li>' +
        '<li>Access to the official micro:bit editor</li>' +
      '</ul>' +
      '<div class="note note-warn"><strong>Before you touch anything</strong>' +
      'No drinks on the desk. Hold the micro:bit by its edges. Do not pull cables out by the wire.</div>' +
    '</div>' +

    '<div class="card">' +
      '<h3>Project filename convention</h3>' +
      '<p>Every project you create this term uses the same naming pattern so that your teacher can find your work:</p>' +
      '<pre class="code">Y8_Class_PairNumber_SmartBadge_W1</pre>' +
      '<p>For example:</p>' +
      '<pre class="code">Y8_8T_Pair04_SmartBadge_W1</pre>' +
      '<p class="hint">You will type your project name in Main Activity 1. Work out now what yours will be.</p>' +
      inHTML('prepProjectName', 'prep.projectFileName', 'The project name I plan to use (optional at this stage)',
        'You can change this later.', 'Y8_8T_Pair04_SmartBadge_W1') +
    '</div>' +

    '<div class="card">' +
      '<h3>Record your equipment</h3>' +
      '<p class="card-sub">Numbered equipment means faults can be traced. Copy the numbers exactly as printed on the labels.</p>' +
      '<div class="ev-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' +
        '<div>' + inHTML('prepDevice', 'prep.deviceNumber', 'Device number', null, 'e.g. MB-12') + '</div>' +
        '<div>' + inHTML('prepCable', 'prep.cableNumber', 'Cable number', null, 'e.g. C-07') + '</div>' +
      '</div>' +
      '<div class="field"><label id="lblWorkMode">Are you working independently or with a partner?</label>' +
        radiosHTML('workMode', 'prep.workMode', ['Independently', 'With a partner']) + '</div>' +
      '<div class="field" data-partner-wrap hidden>' +
        '<label for="prepPartner">Partner name</label>' +
        '<input type="text" id="prepPartner" data-bind="prep.partnerName" placeholder="Your partner\'s full name">' +
      '</div>' +
      '<ul class="checklist"><li><label class="check">' +
        '<input type="checkbox" data-flag="prep.ready">' +
        '<span class="check-text">I have my micro:bit, my cable and a computer, and my desk is clear of drinks.</span>' +
      '</label></li></ul>' +
    '</div>';

    return sectionShell('prep', 'Section 1 of 7', 'Student preparation', '4 min', false,
      'Collect your equipment and record your numbers before you start.', body);
  }

  function buildStarter() {
    var body =
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Activity A</span><h3>Sequence the workflow</h3></div>' +
      '<p>A program does not travel from your screen to a physical device by itself. Put these four stages ' +
      'into the order a programmer actually works through them. Use the arrow buttons to move each stage up or down.</p>' +
      '<ul class="seq-list" id="seqList"></ul>' +
      '<div class="btn-row">' +
        '<button type="button" class="btn btn-primary" id="seqCheck">Check my order</button>' +
        '<button type="button" class="btn btn-secondary" id="seqReset">Shuffle again</button>' +
      '</div>' +
      '<div class="feedback" id="seqFeedback"></div>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Activity B</span><h3>Safe or unsafe?</h3></div>' +
      '<p>Classify each situation. Equipment that breaks in Week 1 is not available in Week 2.</p>' +
      '<div class="scenarios" id="safetyList"></div>' +
      '<div class="btn-row"><button type="button" class="btn btn-primary" id="safetyCheck">Check my answers</button></div>' +
      '<div class="feedback" id="safetyFeedback"></div>' +
    '</div>' +

    '<div class="card">' + checklistHTML('starter') + '</div>';

    return sectionShell('starter', 'Section 2 of 7', 'Starter — From Code to a Physical Device', '8 min', false,
      'Before the equipment is handed out, get the workflow and the handling rules straight.', body);
  }

  function buildMA1() {
    var body =
    /* ---- Step 1 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 1</span><h3>Collect and identify the parts</h3></div>' +
      '<div class="split"><div>' +
        '<p>Put your micro:bit on the desk in front of you with the LED side facing up. Find each of these:</p>' +
        '<ul>' +
          '<li><strong>micro:bit</strong> — the small board itself.</li>' +
          '<li><strong>USB cable</strong> — the data link to the computer.</li>' +
          '<li><strong>LED matrix</strong> — the 5 by 5 grid of red lights in the middle of the front.</li>' +
          '<li><strong>Button A</strong> — the button to the left of the LED grid.</li>' +
          '<li><strong>Button B</strong> — the button to the right of the LED grid.</li>' +
          '<li><strong>micro USB port</strong> — the small socket on the top edge.</li>' +
          '<li><strong>Edge connector pins</strong> — the gold strips along the bottom edge.</li>' +
        '</ul>' +
        '<div class="note note-info"><strong>You do not need to memorise every edge pin today.</strong>' +
        'You only need to know that the gold strip along the bottom is where extra components attach later in the project.</div>' +
      '</div>' + figureHTML(1) + '</div>' +

      '<h4>Match each part to its purpose</h4>' +
      '<div class="match-grid" id="partsGrid"></div>' +
      '<div class="btn-row"><button type="button" class="btn btn-primary" id="partsCheck">Check my matches</button></div>' +
      '<div class="feedback" id="partsFeedback"></div>' +

      '<h4 style="margin-top:1.2rem">Two quick questions</h4>' +
      '<div id="retrievalList"></div>' +
      '<div class="btn-row"><button type="button" class="btn btn-primary" id="retrievalCheck">Check my answers</button></div>' +
      '<div class="feedback" id="retrievalFeedback"></div>' +
    '</div>' +

    /* ---- Step 2 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 2</span><h3>Connect safely</h3></div>' +
      '<div class="split"><div>' +
        '<ol class="numsteps">' +
          '<li>Connect the <strong>micro USB end to the micro:bit first</strong>. The socket is on the top edge of the board.</li>' +
          '<li>Insert it <strong>straight, without forcing it</strong>. Look at the shape of the connector and the shape of the socket before you push.</li>' +
          '<li>Connect the <strong>USB-A end to the computer</strong>.</li>' +
          '<li>Check whether a drive named <code>MICROBIT</code> appears on the computer.</li>' +
          '<li><strong>Do not disconnect while a transfer light is flashing</strong> on the back of the board.</li>' +
        '</ol>' +
        '<div class="note note-warn"><strong>If it does not slide in, stop.</strong>' +
        'A connector that needs force is the wrong way round. Turn it over and try again.</div>' +
      '</div>' + figureHTML(2) + '</div>' +
      checklistHTML('connect') +
      '<div class="note note-tip" style="margin-top:1rem"><strong>Troubleshooting: nothing appeared?</strong>' +
        '<ol style="margin:.4rem 0 0">' +
          '<li>Reconnect the cable at both ends.</li>' +
          '<li>Try another USB port on the computer.</li>' +
          '<li>Try another cable — some USB cables only carry power, not data.</li>' +
          '<li>Ask for a spare device and record the new number.</li>' +
          '<li>Keep working in the simulator while you wait. You lose no time.</li>' +
        '</ol></div>' +
    '</div>' +

    /* ---- Step 3 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 3</span><h3>Open an editor and create a new project</h3></div>' +
      '<div class="split"><div>' +
        '<p>An <strong>editor</strong> is the program you write your code in. It also contains a <strong>simulator</strong>: ' +
        'an on-screen micro:bit that runs your code before it ever reaches the real board.</p>' +
        '<p>Choose <strong>one</strong> editor and open it in a new tab. You may use Blocks or Python — ' +
        'the required outcome is exactly the same.</p>' +
        '<div class="editor-grid">' +
          '<div class="editor-card"><h4>Blocks editor</h4>' +
            '<p>MakeCode. Drag blocks together. Recommended if this is your first time.</p>' +
            '<a class="btn btn-primary" href="' + EDITOR_LINK_BLOCKS + '" target="_blank" rel="noopener noreferrer" ' +
              'data-editor="Blocks (MakeCode)">Open the Blocks editor <span class="ext-icon" aria-hidden="true">↗</span>' +
              '<span class="sr-only">(opens in a new tab)</span></a></div>' +
          '<div class="editor-card"><h4>Python editor</h4>' +
            '<p>Type MicroPython code. Choose this if you are confident with typed code.</p>' +
            '<a class="btn btn-secondary" href="' + EDITOR_LINK_PYTHON + '" target="_blank" rel="noopener noreferrer" ' +
              'data-editor="Python">Open the Python editor <span class="ext-icon" aria-hidden="true">↗</span>' +
              '<span class="sr-only">(opens in a new tab)</span></a></div>' +
        '</div>' +
        '<div class="field"><label id="lblEditor">Which editor are you using?</label>' +
          radiosHTML('editorChoice', 'ma1.editorChoice', ['Blocks (MakeCode)', 'Python']) + '</div>' +
        '<p>Now select <strong>New Project</strong> and name it using the class convention:</p>' +
        '<pre class="code">Y8_Class_PairNumber_SmartBadge_W1</pre>' +
        '<div class="field"><label for="ma1ProjectName">Type the exact project name you used</label>' +
          '<input type="text" id="ma1ProjectName" data-bind="ma1.projectName" placeholder="Y8_8T_Pair04_SmartBadge_W1">' +
          '<div class="feedback" id="nameFeedback"></div></div>' +
      '</div>' + figureHTML(3) + '</div>' +
    '</div>' +

    /* ---- Evidence ---- */
    '<div class="card">' +
      '<h3>Evidence</h3>' +
      '<p class="card-sub">Upload one image. It is stored in this browser only — nothing is sent anywhere.</p>' +
      '<div class="ev-grid">' + evidenceHTML('ma1_main') + '</div>' +
      taHTML('ma1Problem', 'ma1.problemSolved',
        'Record one successful check, or one connection problem and how you solved it',
        'At least ' + MIN_TEXT + ' characters. For example: "The MICROBIT drive did not appear, so we swapped to cable C-11 and it worked."', 3) +
    '</div>' +

    '<div class="card">' + checklistHTML('ma1') + '</div>';

    return sectionShell('ma1', 'Section 3 of 7', 'Main Activity 1 — Micro:bit Onboarding', '17 min', false,
      'Identify the parts, connect the device safely, and create a correctly named project.', body);
  }

  function buildMA2() {
    var body =
    '<div class="card">' +
      '<h3>The brief</h3>' +
      '<div class="note note-info"><strong>Scenario</strong>' +
      'The Year 8 welcome desk needs a simple signal to confirm that each micro:bit is connected, ' +
      'programmed and ready for the Smart Badge project.</div>' +
      '<h4>Your program must:</h4>' +
      '<ol class="numsteps">' +
        '<li>display a chosen icon</li>' +
        '<li>pause briefly where appropriate</li>' +
        '<li>display your initials or a short welcome word</li>' +
        '<li>run correctly in the simulator</li>' +
        '<li>be downloaded and transferred</li>' +
        '<li>run successfully on the physical LED matrix</li>' +
      '</ol>' +
      '<div class="note note-warn"><strong>Keep it short.</strong>' +
      'Long scrolling text takes many seconds to display and makes testing slow. Initials or one short word only.</div>' +
    '</div>' +

    /* ---- Step 4 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 4</span><h3>Build the icon and message</h3></div>' +
      '<div class="split"><div>' +
        '<p>Whichever editor you chose, the structure is the same: <strong>show an icon</strong>, ' +
        '<strong>wait a moment</strong>, then <strong>show a short string</strong>.</p>' +
        '<h4>If you are using Blocks</h4>' +
        '<p>You will need these four block types. Drag them inside <code>on start</code> in the order you want them to run:</p>' +
        '<ul><li><code>on start</code> — the container that runs once when the program begins</li>' +
          '<li><code>show icon</code> — choose your icon from the drop-down</li>' +
          '<li><code>pause</code> — a short wait, measured in milliseconds</li>' +
          '<li><code>show string</code> — your initials or welcome word</li></ul>' +
        '<h4>If you are using Python</h4>' +
        '<p>Work out the commands yourself from the editor\'s reference panel. You will need one command for each job:</p>' +
        '<pre class="code">from microbit import *\n\n# 1. display an image  -> look up display.show(...)\n# 2. pause             -> look up sleep(...)\n# 3. scroll a string    -> look up display.scroll(...)</pre>' +
        '<div class="note note-tip"><strong>Work it out, do not copy it.</strong>' +
        'The reference panel in the editor lists every command with an example. Finding the right one is part of the task.</div>' +
      '</div>' + figureHTML(4) + '</div>' +

      '<h4>Plan your program</h4>' +
      '<div class="field"><label for="ma2Icon">Chosen icon</label>' +
        '<select id="ma2Icon" data-bind="ma2.icon"><option value="">Choose an icon…</option>' +
        ICON_CHOICES.map(function (i) { return '<option value="' + esc(i) + '">' + esc(i) + '</option>'; }).join('') +
        '<option value="Other">Other (write it below)</option></select></div>' +
      '<div class="field" data-icon-other hidden><label for="ma2IconOther">Which other icon?</label>' +
        '<input type="text" id="ma2IconOther" data-bind="ma2.iconOther"></div>' +
      inHTML('ma2Message', 'ma2.message', 'Chosen initials or short welcome word', 'Keep it under about 8 characters.', 'e.g. AO or READY') +
      taHTML('ma2Prediction', 'ma2.prediction', 'What do you predict will appear FIRST on the LED matrix?', null, 2) +
      taHTML('ma2Reason', 'ma2.reason', 'Why did you choose that sequence?', null, 2) +
    '</div>' +

    /* ---- Step 5 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 5</span><h3>Test in the simulator</h3></div>' +
      '<div class="split"><div>' +
        '<div class="note note-tip" style="margin-top:0"><strong>Predict → Test → Compare → Improve</strong>' +
        'This is the testing cycle you will use in every project this year. Testing in the simulator ' +
        'finds mistakes before you waste time transferring a broken program.</div>' +
        '<ol class="numsteps">' +
          '<li>Run the simulator on the left of the editor.</li>' +
          '<li>Watch the <strong>order</strong> of the outputs, not just the final state.</li>' +
          '<li>Compare what you see with the prediction you wrote in Step 4.</li>' +
          '<li>Record whether the result matched.</li>' +
          '<li>Describe one change you made — or state clearly that no correction was needed.</li>' +
        '</ol>' +
      '</div>' + figureHTML(5) + '</div>' +
      '<div class="field"><label id="lblSimMatch">Did the simulator output match your prediction?</label>' +
        radiosHTML('simMatched', 'ma2.simMatched', ['Yes, it matched', 'Partly', 'No, it did not match']) + '</div>' +
      taHTML('ma2SimChange', 'ma2.simChange', 'Describe one change you made, or state that no correction was required',
        'For example: "The word appeared before the icon, so I moved the show string block below the pause."', 3) +
    '</div>' +

    /* ---- Step 6 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 6</span><h3>Download and transfer</h3></div>' +
      '<div class="split"><div>' +
        '<p>Code sitting in an editor does nothing to a physical device. It has to be <strong>transferred</strong> ' +
        '(also called <strong>flashing</strong>) before the micro:bit can run it.</p>' +
        '<ol class="numsteps">' +
          '<li>Select <strong>Download</strong> in the editor.</li>' +
          '<li>Locate the downloaded program file — usually a <code>.hex</code> file in your Downloads folder.</li>' +
          '<li>Copy or drag it onto the <code>MICROBIT</code> drive.</li>' +
          '<li>Wait for the transfer to finish. The drive briefly disappears and reappears.</li>' +
          '<li><strong>Do not disconnect while the device is flashing.</strong></li>' +
        '</ol>' +
        '<div class="note note-info"><strong>Browser pairing</strong>' +
        'Some browsers let the editor send the program straight to the device after you use ' +
        '<em>Connect device</em>. If your editor offers it and it works, that is fine — record it below.</div>' +
      '</div>' + figureHTML(6) + '</div>' +
      '<div class="field"><label id="lblTransfer">Which transfer method did you use?</label>' +
        radiosHTML('transferMethod', 'ma2.transferMethod', TRANSFER_METHODS, true) + '</div>' +
    '</div>' +

    /* ---- Step 7 ---- */
    '<div class="card">' +
      '<div class="card-head"><span class="step-tag">Step 7</span><h3>Check the real output</h3></div>' +
      '<div class="split"><div>' +
        '<p>Hold the micro:bit by its edges and watch the LED matrix. Testing is not finished until you have ' +
        'compared the real device with what you expected.</p>' +
      '</div>' + figureHTML(7) + '</div>' +
      '<div class="cmp">' +
        '<div class="cmp-col"><h4>Expected</h4><p class="cmp-hint">What you predicted before testing</p>' +
          '<label class="sr-only" for="cmpE">What you expected</label>' +
          '<textarea id="cmpE" data-bind="ma2.cmpExpected"></textarea></div>' +
        '<div class="cmp-col"><h4>Simulator</h4><p class="cmp-hint">What the on-screen micro:bit showed</p>' +
          '<label class="sr-only" for="cmpS">What the simulator showed</label>' +
          '<textarea id="cmpS" data-bind="ma2.cmpSimulator"></textarea></div>' +
        '<div class="cmp-col"><h4>Physical device</h4><p class="cmp-hint">What the real LED matrix showed</p>' +
          '<label class="sr-only" for="cmpP">What the physical device showed</label>' +
          '<textarea id="cmpP" data-bind="ma2.cmpPhysical"></textarea></div>' +
      '</div>' +
      '<div class="field"><label id="lblAllMatch">Did all three match?</label>' +
        radiosHTML('allMatched', 'ma2.allMatched', ['Yes, all three matched', 'Two of the three matched', 'No, they were different']) + '</div>' +
      taHTML('ma2Improve', 'ma2.improvement', 'Any improvement you made after checking the real device (optional)', null, 2) +
    '</div>' +

    /* ---- Evidence ---- */
    '<div class="card">' +
      '<h3>Evidence</h3>' +
      '<p class="card-sub">Two images are required. A third is optional.</p>' +
      '<div class="ev-grid">' + evidenceHTML('ma2_code') + evidenceHTML('ma2_device') + evidenceHTML('ma2_extra') + '</div>' +
    '</div>' +

    '<div class="card">' + checklistHTML('ma2') + '</div>';

    return sectionShell('ma2', 'Section 4 of 7', 'Main Activity 2 — Welcome Signal', '25 min', false,
      'Build it, test it in the simulator, transfer it, then compare the real output with what you expected.', body);
  }

  function buildChallenge() {
    var body =
    '<div class="card">' +
      '<div class="note note-info" style="margin-top:0"><strong>This section is optional</strong>' +
      'It is not required to reach the plenary or to complete the lesson. Attempt it only if your ' +
      'welcome signal is already working on the physical device.</div>' +
      '<h3>The challenge</h3>' +
      '<p>Add a <strong>Button A</strong> behaviour that displays a second symbol or short message ' +
      '<strong>without removing the original welcome output</strong>.</p>' +
      '<div class="note note-tip"><strong>Think about this first</strong>' +
      'Your welcome output currently runs once when the program starts. A button press is an ' +
      '<strong>input</strong> that happens later. What kind of block or function reacts to an event ' +
      'rather than running at the start?</div>' +
      taHTML('chPlan', 'challenge.buttonPlan', 'What should Button A do?', null, 2) +
      taHTML('chChange', 'challenge.changeMade', 'What change did you make to your program?', null, 3) +
      '<div class="field"><label id="lblChWorked">Did it work?</label>' +
        radiosHTML('chWorked', 'challenge.worked', ['Yes, it worked', 'Partly — it needs more work', 'No, not yet']) + '</div>' +
      '<div class="ev-grid">' + evidenceHTML('challenge') + '</div>' +
    '</div>';

    return sectionShell('challenge', 'Section 5 of 7', 'Optional challenge — Button A', 'extra', true,
      'An extension for pairs who have finished the welcome signal.', body);
  }

  function buildPlenary() {
    var body =
    '<div class="card">' +
      '<h3>Show what you understand</h3>' +
      '<p class="card-sub">Write in full sentences. Your answers are saved as written — they are read by your teacher, ' +
      'not marked automatically.</p>' +
      PLENARY_QS.map(function (q, i) {
        return '<div class="field"><label for="pl_' + q.id + '">' + (i + 1) + '. ' + esc(q.text) + '</label>' +
          '<textarea id="pl_' + q.id + '" data-bind="plenary.' + q.id + '" rows="2"></textarea>' +
          (q.id === 'q2' ? '<div class="feedback" id="ledFeedback"></div>' +
            '<div class="btn-row"><button type="button" class="btn btn-secondary btn-sm" id="ledCheck">' +
            'Check my thinking on this one</button></div>' : '') +
          '</div>';
      }).join('') +
      '<div class="field"><label id="lblReadiness">6. My readiness for next week is:</label>' +
        radiosHTML('readiness', 'plenary.readiness', READINESS, true) + '</div>' +
      '<div class="note note-info"><strong>There is no wrong answer to question 6.</strong>' +
      'Saying you need more practice tells your teacher exactly where to start next week.</div>' +
    '</div>';

    return sectionShell('plenary', 'Section 6 of 7', 'Plenary — Ready for the Smart Badge Project', '8 min', false,
      'Six questions to close the lesson.', body);
  }

  function buildReview() {
    var body =
    '<div class="card export-panel">' +
      '<h3>Export your work</h3>' +
      '<p>Create your PDF, then upload it to Microsoft Teams. You can export at any time, even if some ' +
      'sections are unfinished — unfinished sections are clearly marked.</p>' +
      '<div class="btn-row">' +
        '<button type="button" class="btn btn-primary btn-lg" id="btnFinalPdf" style="width:auto">Export final PDF</button>' +
        '<button type="button" class="btn btn-secondary" id="btnPrint">Print / Save as PDF (fallback)</button>' +
        '<button type="button" class="btn btn-secondary" id="btnBackup2">Export JSON backup</button>' +
        '<button type="button" class="btn btn-secondary" id="btnImport">Import JSON backup</button>' +
        '<button type="button" class="btn btn-danger" id="btnReset">Reset all progress</button>' +
      '</div>' +
      '<p class="hint" id="exportMeta"></p>' +
    '</div>' +

    '<div class="teams-banner">' +
      '<h3>Upload your completed PDF to the Microsoft Teams Assignment named ' + esc(TEAMS_ASSIGNMENT) + '.</h3>' +
      '<p>Before you upload, check that:</p>' +
      '<ul>' +
        '<li>your name and class are visible on the first page</li>' +
        '<li>the required lesson sections are included</li>' +
        '<li>the PDF actually downloaded to your device</li>' +
        '<li>you are uploading the PDF itself, not a screenshot of it</li>' +
      '</ul>' +
    '</div>' +

    '<div class="card"><h3>Your details</h3><dl class="review-grid" id="rvDetails"></dl></div>' +
    '<div class="card"><h3>Section progress</h3><ul class="rv-status-list" id="rvSections"></ul>' +
      '<p class="hint">You can return to any incomplete section using the buttons above or the tabs at the top of the page.</p></div>' +
    '<div class="card"><h3>Checklists</h3><div id="rvChecklists"></div></div>' +
    '<div class="card"><h3>Your written responses</h3><div id="rvResponses"></div></div>' +
    '<div class="card"><h3>Your evidence</h3><div class="rv-thumbs" id="rvThumbs"></div></div>';

    return sectionShell('review', 'Section 7 of 7', 'Review and export', '3 min', false,
      'Check everything is there, then export your PDF for Teams.', body);
  }

  /* ===========================================================================
     9. RENDER + BIND
     =========================================================================== */

  function renderAll() {
    $('#sections').innerHTML =
      buildPrep() + buildStarter() + buildMA1() + buildMA2() + buildChallenge() + buildPlenary() + buildReview();
    renderSequence();
    renderSafety();
    renderParts();
    renderRetrieval();
    bindEverything();
    rendered = true;
  }

  function bindEverything() {
    /* text / textarea / select bound to state.data */
    $$('[data-bind]').forEach(function (el) {
      if (el.type === 'radio') {
        el.addEventListener('change', function () {
          if (el.checked) { setPath(state.data, el.getAttribute('data-bind'), el.value); afterInput(); }
        });
      } else {
        el.addEventListener('input', function () {
          setPath(state.data, el.getAttribute('data-bind'), el.value);
          afterInput();
        });
        el.addEventListener('change', function () {
          setPath(state.data, el.getAttribute('data-bind'), el.value);
          afterInput();
        });
      }
    });

    /* checklist checkboxes */
    $$('[data-check]').forEach(function (el) {
      el.addEventListener('change', function () {
        state.checks[el.getAttribute('data-check')] = el.checked;
        afterInput();
      });
    });

    /* boolean flags in state.data */
    $$('[data-flag]').forEach(function (el) {
      el.addEventListener('change', function () {
        setPath(state.data, el.getAttribute('data-flag'), el.checked);
        afterInput();
      });
    });

    /* figure zoom */
    document.addEventListener('click', function (e) {
      var z = e.target.closest && e.target.closest('[data-zoom]');
      if (z) openFigure(parseInt(z.getAttribute('data-zoom'), 10));
    });

    /* activity buttons */
    $('#seqCheck').addEventListener('click', checkSequence);
    $('#seqReset').addEventListener('click', function () {
      state.activity.sequence.order = shuffle(SEQUENCE_CORRECT);
      if (seqCorrect()) state.activity.sequence.order = SEQUENCE_START.slice();
      state.activity.sequence.checked = false;
      $('#seqFeedback').innerHTML = '';
      renderSequence(); afterInput();
    });
    $('#safetyCheck').addEventListener('click', checkSafety);
    $('#partsCheck').addEventListener('click', checkParts);
    $('#retrievalCheck').addEventListener('click', checkRetrieval);
    $('#ledCheck').addEventListener('click', function () {
      state.activity.ledFeedbackSeen = true;
      $('#ledFeedback').innerHTML =
        '<div class="note note-good" style="margin:.5rem 0 0"><strong>Model answer</strong>' +
        'The LED matrix is an output because it displays information produced by the program. ' +
        'Compare that with your own sentence and improve it if you need to.</div>';
      afterInput();
    });

    /* project name live validation */
    var pn = $('#ma1ProjectName');
    pn.addEventListener('input', renderNameFeedback);
    pn.addEventListener('blur', renderNameFeedback);

    /* editor link click records the choice as a convenience */
    $$('[data-editor]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (!state.data.ma1.editorChoice) {
          state.data.ma1.editorChoice = a.getAttribute('data-editor');
          applyStateToDom(); afterInput();
        }
      });
    });

    /* evidence slots */
    $$('.ev-slot').forEach(bindEvidenceSlot);

    /* review buttons */
    $('#btnFinalPdf').addEventListener('click', function () { exportPDF(true); });
    $('#btnPrint').addEventListener('click', printFallback);
    $('#btnBackup2').addEventListener('click', exportBackup);
    $('#btnImport').addEventListener('click', function () { $('#importFile').click(); });
    $('#btnReset').addEventListener('click', resetProgress);
  }

  function afterInput() {
    refreshConditionals();
    recomputeCompletion();
    scheduleSave();
    refreshChrome();
  }

  /** Fields that only appear once a related choice has been made. */
  function refreshConditionals() {
    var pw = $('[data-partner-wrap]');
    if (pw) pw.hidden = state.data.prep.workMode !== 'With a partner';
    var io = $('[data-icon-other]');
    if (io) io.hidden = state.data.ma2.icon !== 'Other';
  }

  /* ---- write state into the DOM ---- */
  function applyStateToDom() {
    $$('[data-bind]').forEach(function (el) {
      var v = getPath(state.data, el.getAttribute('data-bind'));
      if (el.type === 'radio') el.checked = (v != null && String(v) === el.value);
      else el.value = (v == null ? '' : v);
    });
    $$('[data-check]').forEach(function (el) { el.checked = !!state.checks[el.getAttribute('data-check')]; });
    $$('[data-flag]').forEach(function (el) { el.checked = !!getPath(state.data, el.getAttribute('data-flag')); });

    refreshConditionals();
    renderNameFeedback();
    EVIDENCE_SLOTS.forEach(function (d) { refreshEvidenceSlot(d.slot); });
  }

  /* ===========================================================================
     10. ACTIVITIES
     =========================================================================== */

  function renderSequence() {
    var list = $('#seqList');
    var order = state.activity.sequence.order;
    list.innerHTML = order.map(function (id, i) {
      var item = SEQUENCE_ITEMS.filter(function (s) { return s.id === id; })[0];
      var cls = '';
      if (state.activity.sequence.checked) cls = (SEQUENCE_CORRECT[i] === id) ? ' ok' : ' bad';
      return '<li class="seq-item' + cls + '" data-sid="' + id + '">' +
        '<span class="seq-label">' + esc(item.text) + '</span>' +
        '<span class="seq-ctrls">' +
          '<button type="button" class="seq-btn" data-move="up" ' + (i === 0 ? 'disabled' : '') +
            ' aria-label="Move &quot;' + esc(item.text) + '&quot; up">&#9650;</button>' +
          '<button type="button" class="seq-btn" data-move="down" ' + (i === order.length - 1 ? 'disabled' : '') +
            ' aria-label="Move &quot;' + esc(item.text) + '&quot; down">&#9660;</button>' +
        '</span></li>';
    }).join('');

    $$('#seqList [data-move]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.closest('.seq-item');
        var id = li.getAttribute('data-sid');
        var o  = state.activity.sequence.order;
        var i  = o.indexOf(id);
        var j  = btn.getAttribute('data-move') === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= o.length) return;
        o[i] = o[j]; o[j] = id;
        state.activity.sequence.checked = false;
        $('#seqFeedback').innerHTML = '';
        renderSequence();
        afterInput();
        var again = $$('#seqList .seq-item')[j];
        if (again) { var b = again.querySelector('[data-move="' + btn.getAttribute('data-move') + '"]'); if (b && !b.disabled) b.focus(); }
      });
    });
  }

  function checkSequence() {
    var s = state.activity.sequence;
    s.checked = true; s.attempts++;
    var ok = seqCorrect();
    s.correct = ok;
    renderSequence();
    $('#seqFeedback').innerHTML =
      '<div class="note ' + (ok ? 'note-good' : 'note-warn') + '">' +
      '<strong>' + (ok ? 'Correct order.' : 'Not quite — look at the highlighted rows and try again.') + '</strong>' +
      '<p>The order is: create the program → test it in the simulator → download and transfer it → ' +
      'observe the physical micro:bit output.</p>' +
      '<p><strong>Why test in the simulator before transferring?</strong> Transferring takes time and uses the ' +
      'cable and the port. If the program is wrong, you will have to do the whole transfer again. ' +
      'The simulator finds most mistakes in seconds and costs nothing.</p>' +
      '<p><strong>Why is observing the physical device part of testing?</strong> The simulator is a model, not the ' +
      'real thing. Only the real board tells you that the transfer worked, that the LEDs light as expected and ' +
      'that the timing looks right in the room. Testing is not finished until you have looked at the hardware.</p>' +
      '</div><p class="attempts">Attempts: ' + s.attempts + '</p>';
    afterInput();
  }

  function renderSafety() {
    $('#safetyList').innerHTML = SAFETY_ITEMS.map(function (it, i) {
      return '<div class="scenario" data-fid="' + it.id + '">' +
        '<p>' + (i + 1) + '. ' + esc(it.text) + '</p>' +
        '<div class="radio-row" role="radiogroup" aria-label="' + esc(it.text) + '">' +
          '<label class="radio-chip"><input type="radio" name="safe_' + it.id + '" value="safe" data-safety="' + it.id + '"> <span>Safe</span></label>' +
          '<label class="radio-chip"><input type="radio" name="safe_' + it.id + '" value="unsafe" data-safety="' + it.id + '"> <span>Unsafe</span></label>' +
        '</div><div data-fb></div></div>';
    }).join('');
    $$('[data-safety]').forEach(function (el) {
      el.addEventListener('change', function () {
        if (!el.checked) return;
        state.activity.safety.answers[el.getAttribute('data-safety')] = el.value;
        afterInput();
      });
    });
    applySafetyState();
  }

  function applySafetyState() {
    var a = state.activity.safety;
    $$('[data-safety]').forEach(function (el) {
      el.checked = a.answers[el.getAttribute('data-safety')] === el.value;
    });
    if (!a.checked) return;
    SAFETY_ITEMS.forEach(function (it) {
      var row = $('.scenario[data-fid="' + it.id + '"]');
      if (!row) return;
      var given = a.answers[it.id];
      var correct = (given === 'safe') === it.safe;
      row.classList.toggle('ok', !!given && correct);
      row.classList.toggle('bad', !!given && !correct);
      $('[data-fb]', row).innerHTML = given
        ? '<p class="fb"><strong>' + (correct ? 'Correct. ' : 'Not this time. ') + '</strong>' + esc(it.why) + '</p>'
        : '<p class="fb"><strong>Not answered. </strong>' + esc(it.why) + '</p>';
    });
  }

  function checkSafety() {
    var a = state.activity.safety;
    a.checked = true; a.attempts++;
    var right = SAFETY_ITEMS.filter(function (it) { return (a.answers[it.id] === 'safe') === it.safe && a.answers[it.id]; }).length;
    applySafetyState();
    $('#safetyFeedback').innerHTML =
      '<div class="note ' + (right === SAFETY_ITEMS.length ? 'note-good' : 'note-info') + '">' +
      '<strong>' + right + ' out of ' + SAFETY_ITEMS.length + ' correct.</strong>' +
      '<p>The pattern behind all six: <em>force and liquid break equipment, and the connector — never the wire — ' +
      'takes the strain.</em> Read the feedback under each one before you move on.</p></div>' +
      '<p class="attempts">Attempts: ' + a.attempts + '</p>';
    afterInput();
  }

  function renderParts() {
    var opts = shuffle(PART_PURPOSES);
    $('#partsGrid').innerHTML = PART_TERMS.map(function (t) {
      return '<div class="match-row" data-tid="' + t.id + '">' +
        '<label class="mr-term" for="sel_' + t.id + '">' + esc(t.term) + '</label>' +
        '<select id="sel_' + t.id + '" data-part="' + t.id + '">' +
          '<option value="">Choose the purpose…</option>' +
          opts.map(function (o) { return '<option value="' + o.id + '">' + esc(o.text) + '</option>'; }).join('') +
        '</select></div>';
    }).join('');
    $$('[data-part]').forEach(function (el) {
      el.addEventListener('change', function () {
        state.activity.parts.answers[el.getAttribute('data-part')] = el.value;
        afterInput();
      });
    });
    applyPartsState();
  }

  function applyPartsState() {
    var a = state.activity.parts;
    $$('[data-part]').forEach(function (el) { el.value = a.answers[el.getAttribute('data-part')] || ''; });
    if (!a.checked) return;
    PART_TERMS.forEach(function (t) {
      var row = $('.match-row[data-tid="' + t.id + '"]');
      if (!row) return;
      var ok = a.answers[t.id] === t.answer;
      row.classList.toggle('ok', ok);
      row.classList.toggle('bad', !ok);
    });
  }

  function checkParts() {
    var a = state.activity.parts;
    a.checked = true; a.attempts++;
    applyPartsState();
    var right = PART_TERMS.filter(function (t) { return a.answers[t.id] === t.answer; }).length;
    $('#partsFeedback').innerHTML =
      '<div class="note ' + (right === PART_TERMS.length ? 'note-good' : 'note-info') + '">' +
      '<strong>' + right + ' out of ' + PART_TERMS.length + ' matched correctly.</strong>' +
      '<p>Green rows are correct. Red rows need another look — check the labelled diagram above, ' +
      'then change your answer and check again.</p>' +
      '<p>The two that students most often swap are <strong>Button A</strong> (left of the LEDs) and ' +
      '<strong>Button B</strong> (right of the LEDs).</p></div>' +
      '<p class="attempts">Attempts: ' + a.attempts + '</p>';
    afterInput();
  }

  function renderRetrieval() {
    $('#retrievalList').innerHTML = RETRIEVAL.map(function (q, i) {
      return '<div class="scenario" data-rid="' + q.id + '">' +
        '<p>' + (i + 1) + '. ' + esc(q.q) + '</p>' +
        '<div class="radio-row" role="radiogroup" aria-label="' + esc(q.q) + '">' +
        q.options.map(function (o) {
          return '<label class="radio-chip"><input type="radio" name="rt_' + q.id + '" value="' + o.id +
            '" data-retr="' + q.id + '"> <span>' + esc(o.text) + '</span></label>';
        }).join('') + '</div><div data-fb></div></div>';
    }).join('');
    $$('[data-retr]').forEach(function (el) {
      el.addEventListener('change', function () {
        if (!el.checked) return;
        state.activity.retrieval.answers[el.getAttribute('data-retr')] = el.value;
        afterInput();
      });
    });
    applyRetrievalState();
  }

  function applyRetrievalState() {
    var a = state.activity.retrieval;
    $$('[data-retr]').forEach(function (el) { el.checked = a.answers[el.getAttribute('data-retr')] === el.value; });
    if (!a.checked) return;
    RETRIEVAL.forEach(function (q) {
      var row = $('.scenario[data-rid="' + q.id + '"]');
      if (!row) return;
      var ok = a.answers[q.id] === q.answer;
      row.classList.toggle('ok', ok);
      row.classList.toggle('bad', !!a.answers[q.id] && !ok);
      $('[data-fb]', row).innerHTML = '<p class="fb"><strong>' + (ok ? 'Correct. ' : 'Not quite. ') + '</strong>' + esc(q.why) + '</p>';
    });
  }

  function checkRetrieval() {
    var a = state.activity.retrieval;
    a.checked = true; a.attempts++;
    applyRetrievalState();
    var right = RETRIEVAL.filter(function (q) { return a.answers[q.id] === q.answer; }).length;
    $('#retrievalFeedback').innerHTML =
      '<div class="note ' + (right === RETRIEVAL.length ? 'note-good' : 'note-info') + '">' +
      '<strong>' + right + ' out of ' + RETRIEVAL.length + ' correct.</strong>' +
      '<p>Inputs send information <em>into</em> a program. Outputs send information <em>out</em> to the world. ' +
      'The LED matrix is the micro:bit\'s main output.</p></div>' +
      '<p class="attempts">Attempts: ' + a.attempts + '</p>';
    afterInput();
  }

  function renderNameFeedback() {
    var box = $('#nameFeedback');
    if (!box) return;
    var v = validateProjectName(state.data.ma1.projectName);
    if (!String(state.data.ma1.projectName || '').trim()) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="note ' + (v.ok ? 'note-good' : 'note-warn') + '">' +
      '<strong>' + (v.ok ? 'That matches the convention.' : 'Close, but check the highlighted parts.') + '</strong>' +
      '<ul style="margin:.3rem 0 0">' + v.parts.map(function (p) {
        return '<li>' + (p.ok ? '&#10004;' : '&#10006;') + ' ' + esc(p.label) + '</li>';
      }).join('') + '</ul>' +
      (v.ok ? '' : '<p style="margin:.4rem 0 0">Pattern: <code>Y8_Class_PairNumber_SmartBadge_W1</code> — ' +
        'for example <code>Y8_8T_Pair04_SmartBadge_W1</code>.</p>') + '</div>';
  }

  /* ===========================================================================
     11. EVIDENCE UPLOAD
     =========================================================================== */

  function bindEvidenceSlot(root) {
    var slot  = root.getAttribute('data-slot');
    var input = $('[data-file-input]', root);
    var status = $('[data-status]', root);

    function setStatus(msg, tone) { status.textContent = msg || ''; status.setAttribute('data-tone', tone || ''); }

    $$('[data-act]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var act = b.getAttribute('data-act');
        if (act === 'pick' || act === 'replace') { input.value = ''; input.click(); }
        else if (act === 'delete') {
          confirmDialog('Delete this image?', 'The uploaded image for "' + slotDef(slot).title + '" will be removed. This cannot be undone.',
            function () {
              idbDel(slot).then(function () {
                delete state.evidenceMeta[slot];
                refreshEvidenceSlot(slot);
                setStatus('Image deleted.', 'ok');
                afterInput();
              });
            });
        }
      });
    });

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) { setStatus('That is not an image file. Use a photo or a screenshot (JPG or PNG).', 'bad'); return; }
      if (file.size > MAX_UPLOAD_BYTES) {
        setStatus('That file is ' + (file.size / 1048576).toFixed(1) + ' MB. The limit is ' +
          (MAX_UPLOAD_BYTES / 1048576) + ' MB — take a smaller photo or crop the screenshot.', 'bad');
        return;
      }
      setStatus('Compressing and saving…', 'work');
      compressImage(file, IMG_MAX_DIM, IMG_QUALITY).then(function (res) {
        var meta = {
          slot: slot,
          stage: slotDef(slot).stage,
          name: file.name,
          type: 'image/jpeg',
          originalBytes: file.size,
          bytes: res.bytes,
          w: res.w, h: res.h,
          timestamp: nowISO()
        };
        return idbPut(slot, { dataUrl: res.dataUrl, meta: meta }).then(function () {
          state.evidenceMeta[slot] = meta;
          refreshEvidenceSlot(slot);
          setStatus('Saved (' + (res.bytes / 1024).toFixed(0) + ' KB, ' + res.w + '×' + res.h + ').', 'ok');
          afterInput();
        });
      }).catch(function (err) {
        setStatus('Could not save that image. ' + (err && err.message ? err.message : '') +
          ' Try a different file, or check that your browser allows storage.', 'bad');
      });
    });
  }

  function refreshEvidenceSlot(slot) {
    var root = $('.ev-slot[data-slot="' + slot + '"]');
    if (!root) return;
    var meta = state.evidenceMeta[slot];
    var thumb = $('[data-thumb]', root);
    var fileP = $('[data-file]', root);
    var def = slotDef(slot);

    root.classList.toggle('filled', !!meta);
    root.classList.toggle('required-empty', def.required && !meta);
    $('[data-act="pick"]', root).hidden    = !!meta;
    $('[data-act="replace"]', root).hidden = !meta;
    $('[data-act="delete"]', root).hidden  = !meta;

    if (!meta) {
      thumb.innerHTML = '<p class="ev-empty">No image yet</p>';
      fileP.textContent = '';
      return;
    }
    fileP.textContent = meta.name + ' · ' + (meta.bytes / 1024).toFixed(0) + ' KB · ' + prettyDate(meta.timestamp);
    idbGet(slot).then(function (rec) {
      if (!rec) { thumb.innerHTML = '<p class="ev-empty">Image data missing</p>'; return; }
      thumb.innerHTML = '';
      var img = new Image();
      img.src = rec.dataUrl;
      img.alt = 'Your uploaded evidence for ' + def.title +
        (getPath(state.data, def.captionPath) ? ': ' + getPath(state.data, def.captionPath) : '');
      img.addEventListener('click', function () {
        openImageModal(rec.dataUrl, def.title, getPath(state.data, def.captionPath) || '', img.alt);
      });
      thumb.appendChild(img);
    });
  }

  /* ===========================================================================
     12. MODALS
     =========================================================================== */

  var lastFocus = null;

  function openImageModal(src, title, caption, alt) {
    lastFocus = document.activeElement;
    $('#imgModalImg').src = src;
    $('#imgModalImg').alt = alt || title;
    $('#imgModalTitle').textContent = title;
    $('#imgModalCap').textContent = caption || '';
    $('#imgModal').hidden = false;
    $('#imgModalClose').focus();
  }
  function openFigure(n) {
    var f = FIGURES[n];
    openImageModal('assets/images/' + f.file, f.title, f.cap, f.alt);
  }
  function closeImageModal() {
    $('#imgModal').hidden = true;
    $('#imgModalImg').src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var confirmCb = null;
  function confirmDialog(title, body, cb) {
    lastFocus = document.activeElement;
    confirmCb = cb;
    $('#confirmTitle').textContent = title;
    $('#confirmBody').textContent = body;
    $('#confirmModal').hidden = false;
    $('#confirmNo').focus();
  }
  function closeConfirm() {
    $('#confirmModal').hidden = true;
    confirmCb = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ===========================================================================
     13. NAVIGATION + CHROME
     =========================================================================== */

  function goTo(id, focusMain) {
    if (!isUnlocked(id)) { toast(unlockMessage(id), 'warn'); return; }
    state.currentSection = id;
    state.sectionsVisited[id] = true;
    $$('#sections .section').forEach(function (s) { s.hidden = s.getAttribute('data-section') !== id; });
    if (id === 'review') renderReview();
    refreshChrome();
    scheduleSave();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (focusMain !== false) $('#main').focus();
  }

  function refreshChrome() {
    /* stepper
       Locked tabs are NOT given the native `disabled` attribute: a disabled
       button swallows the click event entirely in every browser, so the
       person gets zero feedback and it looks like the app is broken. Instead
       they stay clickable, are marked with aria-disabled and an .is-locked
       style, and the click handler below explains why. */
    var list = $('#stepperList');
    list.innerHTML = SECTIONS.map(function (s) {
      var done = isComplete(s.id), open = isUnlocked(s.id), cur = state.currentSection === s.id;
      var ico = done ? '&#10004;' : (open ? '&#9679;' : '&#128274;');
      return '<li><button type="button" class="step-btn' + (done ? ' is-done' : '') + (open ? '' : ' is-locked') +
        '" data-goto="' + s.id + '"' +
        (open ? '' : ' aria-disabled="true"') + (cur ? ' aria-current="step"' : '') +
        ' title="' + esc(open ? s.name : unlockMessage(s.id)) + '">' +
        '<span class="st-ico" aria-hidden="true">' + ico + '</span>' +
        '<span>' + s.num + '. ' + esc(s.name) + '</span>' +
        (s.optional ? '<span class="st-opt">opt</span>' : '') +
        '<span class="sr-only">' + (done ? ' — completed' : open ? ' — not yet completed' : ' — locked') + '</span>' +
        '</button></li>';
    }).join('');
    $$('#stepperList [data-goto]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-goto');
        if (!isUnlocked(id)) { flashLocked(b); toast(unlockMessage(id), 'warn', 4500); return; }
        goTo(id);
      });
    });

    /* progress */
    var core = SECTIONS.filter(function (s) { return !s.optional; });
    var done = core.filter(function (s) { return isComplete(s.id); }).length;
    $('#progressFill').style.width = Math.round(done / core.length * 100) + '%';
    $('#progressText').textContent = done + ' of ' + core.length + ' core sections complete' +
      (isComplete('challenge') ? ' · challenge attempted' : '');

    /* per-section status pill */
    $$('#sections .section').forEach(function (sec) {
      var id = sec.getAttribute('data-section');
      var pill = $('[data-status-pill]', sec);
      if (!pill) return;
      var c = isComplete(id);
      pill.textContent = c ? 'Completed' : 'Not completed';
      pill.className = 'pill' + (c ? ' pill-done' : '');
      pill.setAttribute('data-status-pill', '');
    });

    /* pager */
    var idx = SECTIONS.map(function (s) { return s.id; }).indexOf(state.currentSection);
    var prev = idx > 0 ? SECTIONS[idx - 1] : null;
    var next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
    var back = $('#btnBack'), nxt = $('#btnNext'), hint = $('#pagerHint');
    back.disabled = !prev || !isUnlocked(prev.id);
    back.textContent = prev ? '← ' + prev.name : '← Back';
    if (next) {
      nxt.hidden = false;
      nxt.textContent = next.name + ' →';
      var nextLocked = !isUnlocked(next.id);
      nxt.classList.toggle('is-locked', nextLocked);
      nxt.setAttribute('aria-disabled', nextLocked ? 'true' : 'false');
      nxt.disabled = false;   // stays clickable so the click handler can explain why
    } else {
      nxt.hidden = true;
    }

    var cur = state.currentSection;
    var miss = missingList(cur);
    if (isComplete(cur)) {
      hint.className = 'pager-hint ready';
      hint.textContent = 'Section complete. ' + (next ? 'You can move on.' : 'Well done.');
    } else if (miss.length) {
      hint.className = 'pager-hint blocked';
      hint.textContent = 'Still to do: ' + miss.join('; ') + '.';
    } else {
      hint.className = 'pager-hint';
      hint.textContent = '';
    }

    $('#hdrName').textContent  = state.student.fullName || '—';
    $('#hdrClass').textContent = state.student.className || '—';
    var em = $('#exportMeta');
    if (em) {
      em.textContent = 'Last saved: ' + prettyDate(state.updatedAt) +
        ' · Last backup: ' + (state.lastBackupAt ? prettyDate(state.lastBackupAt) : 'not yet') +
        ' · Last PDF: ' + (state.lastPdfAt ? prettyDate(state.lastPdfAt) : 'not yet');
    }
  }

  /* ===========================================================================
     14. REVIEW PAGE
     =========================================================================== */

  function allResponses() {
    var d = state.data;
    return [
      { g: 'Student preparation', q: 'Device number',  a: d.prep.deviceNumber },
      { g: 'Student preparation', q: 'Cable number',   a: d.prep.cableNumber },
      { g: 'Student preparation', q: 'Working',        a: d.prep.workMode },
      { g: 'Student preparation', q: 'Partner',        a: d.prep.workMode === 'With a partner' ? d.prep.partnerName : 'Not applicable' },
      { g: 'Starter',  q: 'Workflow order submitted',  a: state.activity.sequence.checked
          ? state.activity.sequence.order.map(function (id) {
              return SEQUENCE_ITEMS.filter(function (s) { return s.id === id; })[0].text; }).join('  →  ') +
            (seqCorrect() ? '  (correct)' : '  (not yet correct)')
          : '' },
      { g: 'Starter',  q: 'Safe/unsafe score', a: state.activity.safety.checked
          ? SAFETY_ITEMS.filter(function (it) { return (state.activity.safety.answers[it.id] === 'safe') === it.safe && state.activity.safety.answers[it.id]; }).length +
            ' out of ' + SAFETY_ITEMS.length + ' correct (' + state.activity.safety.attempts + ' attempt' +
            (state.activity.safety.attempts === 1 ? '' : 's') + ')' : '' },
      { g: 'Main Activity 1', q: 'Parts matching', a: state.activity.parts.checked
          ? PART_TERMS.filter(function (t) { return state.activity.parts.answers[t.id] === t.answer; }).length +
            ' out of ' + PART_TERMS.length + ' correct (' + state.activity.parts.attempts + ' attempt' +
            (state.activity.parts.attempts === 1 ? '' : 's') + ')' : '' },
      { g: 'Main Activity 1', q: 'Retrieval questions', a: state.activity.retrieval.checked
          ? RETRIEVAL.filter(function (q) { return state.activity.retrieval.answers[q.id] === q.answer; }).length +
            ' out of ' + RETRIEVAL.length + ' correct' : '' },
      { g: 'Main Activity 1', q: 'Editor chosen',   a: d.ma1.editorChoice },
      { g: 'Main Activity 1', q: 'Project name',    a: d.ma1.projectName },
      { g: 'Main Activity 1', q: 'Evidence caption', a: d.ma1.evidenceCaption },
      { g: 'Main Activity 1', q: 'Successful check or problem solved', a: d.ma1.problemSolved },
      { g: 'Main Activity 2', q: 'Chosen icon',     a: d.ma2.icon === 'Other' ? d.ma2.iconOther : d.ma2.icon },
      { g: 'Main Activity 2', q: 'Initials or short word', a: d.ma2.message },
      { g: 'Main Activity 2', q: 'Prediction — what appears first', a: d.ma2.prediction },
      { g: 'Main Activity 2', q: 'Reason for that sequence', a: d.ma2.reason },
      { g: 'Main Activity 2', q: 'Simulator matched the prediction?', a: d.ma2.simMatched },
      { g: 'Main Activity 2', q: 'Change made after simulator testing', a: d.ma2.simChange },
      { g: 'Main Activity 2', q: 'Transfer method used', a: d.ma2.transferMethod },
      { g: 'Main Activity 2', q: 'Expected output',  a: d.ma2.cmpExpected },
      { g: 'Main Activity 2', q: 'Simulator output', a: d.ma2.cmpSimulator },
      { g: 'Main Activity 2', q: 'Physical device output', a: d.ma2.cmpPhysical },
      { g: 'Main Activity 2', q: 'Did all three match?', a: d.ma2.allMatched },
      { g: 'Main Activity 2', q: 'Improvement made',  a: d.ma2.improvement },
      { g: 'Main Activity 2', q: 'Code evidence caption', a: d.ma2.capCode },
      { g: 'Main Activity 2', q: 'Device evidence caption', a: d.ma2.capDevice },
      { g: 'Main Activity 2', q: 'Extra evidence caption', a: d.ma2.capExtra },
      { g: 'Optional challenge', q: 'What Button A should do', a: d.challenge.buttonPlan, optional: true },
      { g: 'Optional challenge', q: 'Change made', a: d.challenge.changeMade, optional: true },
      { g: 'Optional challenge', q: 'Did it work?', a: d.challenge.worked, optional: true },
      { g: 'Optional challenge', q: 'Evidence caption', a: d.challenge.caption, optional: true },
      { g: 'Plenary', q: PLENARY_QS[0].text, a: d.plenary.q1 },
      { g: 'Plenary', q: PLENARY_QS[1].text, a: d.plenary.q2 },
      { g: 'Plenary', q: PLENARY_QS[2].text, a: d.plenary.q3 },
      { g: 'Plenary', q: PLENARY_QS[3].text, a: d.plenary.q4 },
      { g: 'Plenary', q: PLENARY_QS[4].text, a: d.plenary.q5 },
      { g: 'Plenary', q: 'Readiness for next week', a: d.plenary.readiness }
    ];
  }

  function renderReview() {
    var d = state.data;
    $('#rvDetails').innerHTML = [
      ['Name', state.student.fullName],
      ['Class', state.student.className],
      ['Device number', d.prep.deviceNumber],
      ['Cable number', d.prep.cableNumber],
      ['Working', d.prep.workMode + (d.prep.workMode === 'With a partner' && d.prep.partnerName ? ' — ' + d.prep.partnerName : '')],
      ['Editor', d.ma1.editorChoice],
      ['Project name', d.ma1.projectName],
      ['Last saved', prettyDate(state.updatedAt)]
    ].map(function (r) {
      return '<div class="rv-item"><dt>' + esc(r[0]) + '</dt><dd>' + esc(filled(r[1]) ? r[1] : 'Not completed') + '</dd></div>';
    }).join('');

    $('#rvSections').innerHTML = SECTIONS.map(function (s) {
      var done = isComplete(s.id);
      if (s.optional && !done && !state.data.challenge.attempted) {
        return '<li><span class="rv-ico" aria-hidden="true">—</span><span>' + esc(s.name) +
          ' <em>(optional — not attempted)</em></span>' +
          '<button type="button" class="btn btn-secondary btn-sm rv-jump" data-goto2="' + s.id + '">Open</button></li>';
      }
      return '<li class="' + (done ? 'done' : 'todo') + '">' +
        '<span class="rv-ico" aria-hidden="true">' + (done ? '&#10004;' : '&#9888;') + '</span>' +
        '<span>' + esc(s.name) + ' — ' + (done ? 'Completed' : 'Not completed') + '</span>' +
        '<button type="button" class="btn btn-secondary btn-sm rv-jump" data-goto2="' + s.id + '">' +
        (done ? 'Review' : 'Finish it') + '</button></li>';
    }).join('');
    $$('[data-goto2]').forEach(function (b) {
      b.addEventListener('click', function () { goTo(b.getAttribute('data-goto2')); });
    });

    $('#rvChecklists').innerHTML = Object.keys(CHECKLISTS).map(function (g) {
      return '<h4>' + esc(CHECKLISTS[g].title) + '</h4><ul class="rv-status-list">' +
        CHECKLISTS[g].items.map(function (it) {
          var on = checkOn(g, it.id);
          return '<li class="' + (on ? 'done' : 'todo') + '"><span class="rv-ico" aria-hidden="true">' +
            (on ? '&#10004;' : '&#9633;') + '</span><span>' + esc(it.text) + '</span></li>';
        }).join('') + '</ul>';
    }).join('');

    var groups = {};
    allResponses().forEach(function (r) {
      if (r.optional && !state.data.challenge.attempted) return;
      (groups[r.g] = groups[r.g] || []).push(r);
    });
    $('#rvResponses').innerHTML = Object.keys(groups).map(function (g) {
      return '<h4>' + esc(g) + '</h4>' + groups[g].map(function (r) {
        var has = filled(r.a);
        return '<div class="rv-answer"><p class="q">' + esc(r.q) + '</p>' +
          '<p class="a' + (has ? '' : ' empty') + '">' + esc(has ? r.a : 'Not completed') + '</p></div>';
      }).join('');
    }).join('');

    var thumbs = $('#rvThumbs');
    thumbs.innerHTML = '<p class="hint">Loading your evidence…</p>';
    Promise.all(EVIDENCE_SLOTS.map(function (def) {
      return state.evidenceMeta[def.slot] ? idbGet(def.slot).then(function (rec) { return { def: def, rec: rec }; })
                                          : Promise.resolve(null);
    })).then(function (list) {
      var have = list.filter(function (x) { return x && x.rec; });
      if (!have.length) { thumbs.innerHTML = '<p class="hint">No evidence images uploaded yet.</p>'; return; }
      thumbs.innerHTML = have.map(function (x) {
        var cap = getPath(state.data, x.def.captionPath) || '';
        return '<figure><img src="' + x.rec.dataUrl + '" alt="Evidence: ' + esc(x.def.title) + (cap ? '. ' + esc(cap) : '') +
          '" data-rvimg="' + x.def.slot + '"><figcaption><strong>' + esc(x.def.title) + '</strong><br>' +
          esc(cap || 'No caption') + '</figcaption></figure>';
      }).join('');
      $$('[data-rvimg]').forEach(function (img) {
        img.addEventListener('click', function () {
          var def = slotDef(img.getAttribute('data-rvimg'));
          openImageModal(img.src, def.title, getPath(state.data, def.captionPath) || '', img.alt);
        });
      });
    });
  }

  /* ===========================================================================
     15. PDF EXPORT
     =========================================================================== */

  function pdfFileName() {
    return 'Year8_' + sanitiseFilePart(state.student.className) + '_' +
           sanitiseFilePart(state.student.fullName) + '_T1W1_Microbit_Onboarding.pdf';
  }
  function backupFileName() {
    return 'Year8_' + sanitiseFilePart(state.student.className) + '_' +
           sanitiseFilePart(state.student.fullName) + '_T1W1_Microbit_Backup.json';
  }

  /** jsPDF's built-in fonts use WinAnsi encoding. Anything outside it (arrows,
   *  ticks, box-drawing) would come out as mojibake, so swap it for a safe
   *  equivalent before the text reaches the page. */
  function pdfSafe(s) {
    return String(s == null ? '' : s)
      .replace(/[\u2192\u21D2\u27A1]/g, '->')
      .replace(/[\u2190\u21D0]/g, '<-')
      .replace(/\u2191/g, '^').replace(/\u2193/g, 'v')
      .replace(/[\u2713\u2714]/g, '[x]')
      .replace(/[\u2717\u2718\u2716]/g, '[ ]')
      .replace(/[\u2022\u25CF\u25AA]/g, '\u00B7')
      .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2026/g, '...')
      .replace(/[\u2010-\u2013]/g, '-')
      .replace(/\u00A0/g, ' ')
      /* keep the em dash, drop anything else outside WinAnsi */
      .replace(/[^\u0020-\u00FF\u2014]/g, '');
  }

  function makeWriter(doc) {
    var M = 16, W = 210, H = 297, right = W - M;
    var y = M;
    var w = right - M;

    function ensure(h) {
      if (y + h > H - 16) { doc.addPage(); y = M; return true; }
      return false;
    }
    function setFont(size, style, colour) {
      doc.setFont('helvetica', style || 'normal');
      doc.setFontSize(size);
      var c = colour || [30, 32, 40];
      doc.setTextColor(c[0], c[1], c[2]);
    }
    return {
      get y() { return y; },
      set y(v) { y = v; },
      M: M, W: W, H: H, w: w, right: right,
      ensure: ensure,
      gap: function (h) { y += (h == null ? 3 : h); },
      rule: function () {
        ensure(4);
        doc.setDrawColor(210, 214, 225); doc.setLineWidth(0.3);
        doc.line(M, y, right, y); y += 3.5;
      },
      h1: function (t) {
        ensure(12); setFont(16, 'bold', [43, 26, 85]);
        doc.text(pdfSafe(t), M, y); y += 7;
      },
      h2: function (t) {
        ensure(14); y += 2;
        setFont(12.5, 'bold', [43, 26, 85]);
        doc.setFillColor(239, 234, 255);
        doc.rect(M, y - 4.6, w, 7.2, 'F');
        doc.text(pdfSafe(t), M + 2, y); y += 6.5;
      },
      h3: function (t) {
        ensure(9); y += 1.5; setFont(10.5, 'bold', [60, 64, 80]);
        doc.text(pdfSafe(t), M, y); y += 5;
      },
      p: function (t, opts) {
        opts = opts || {};
        setFont(opts.size || 9.5, opts.style || 'normal', opts.colour || [45, 48, 60]);
        var indent = opts.indent || 0;
        var lines = doc.splitTextToSize(pdfSafe(t), w - indent);
        for (var i = 0; i < lines.length; i++) {
          ensure(5);
          doc.text(lines[i], M + indent, y);
          y += (opts.size ? opts.size * 0.47 : 4.5);
        }
        y += opts.after == null ? 1 : opts.after;
      },
      kv: function (label, value) {
        setFont(9, 'bold', [90, 95, 112]);
        var lw = 42;
        var lines = doc.splitTextToSize(pdfSafe(value == null || value === '' ? 'Not completed' : value), w - lw);
        ensure(Math.max(5, lines.length * 4.4));
        doc.text(pdfSafe(label), M, y);
        setFont(9.5, 'normal', (value == null || value === '') ? [150, 100, 0] : [30, 32, 40]);
        for (var i = 0; i < lines.length; i++) {
          if (i > 0) ensure(5);
          doc.text(lines[i], M + lw, y);
          y += 4.4;
        }
        y += 0.6;
      },
      bullet: function (t) {
        setFont(9.5, 'normal', [45, 48, 60]);
        var lines = doc.splitTextToSize(pdfSafe(t), w - 6);
        for (var i = 0; i < lines.length; i++) {
          ensure(5);
          if (i === 0) doc.text('•', M + 1, y);
          doc.text(lines[i], M + 5.5, y);
          y += 4.4;
        }
      },
      tick: function (on, t) {
        setFont(9.5, 'normal', on ? [29, 107, 69] : [140, 90, 0]);
        var lines = doc.splitTextToSize(pdfSafe(t), w - 8);
        for (var i = 0; i < lines.length; i++) {
          ensure(5);
          if (i === 0) doc.text(on ? '[x]' : '[  ]', M + 1, y);
          doc.text(lines[i], M + 9, y);
          y += 4.4;
        }
      },
      qa: function (q, a) {
        var has = filled(a);
        setFont(9, 'bold', [90, 95, 112]);
        var ql = doc.splitTextToSize(pdfSafe(q), w);
        ensure(ql.length * 4.2 + 6);
        for (var i = 0; i < ql.length; i++) { ensure(5); doc.text(ql[i], M, y); y += 4.2; }
        setFont(9.5, has ? 'normal' : 'italic', has ? [30, 32, 40] : [150, 100, 0]);
        var al = doc.splitTextToSize(pdfSafe(has ? a : 'Not completed'), w - 4);
        for (var j = 0; j < al.length; j++) { ensure(5); doc.text(al[j], M + 4, y); y += 4.4; }
        y += 2;
      },
      img: function (dataUrl, iw, ih, caption) {
        var maxW = w * 0.62, maxH = 78;
        var scale = Math.min(maxW / iw, maxH / ih, 1);
        var dw = iw * scale, dh = ih * scale;
        ensure(dh + 9);
        try { doc.addImage(dataUrl, 'JPEG', M, y, dw, dh); } catch (e) { /* skip unreadable image */ }
        doc.setDrawColor(200, 204, 216); doc.setLineWidth(0.3);
        doc.rect(M, y, dw, dh);
        y += dh + 3.5;
        if (caption) { setFont(8.5, 'italic', [95, 100, 118]);
          var cl = doc.splitTextToSize(pdfSafe(caption), w);
          for (var i = 0; i < cl.length; i++) { ensure(4.5); doc.text(cl[i], M, y); y += 4; }
        }
        y += 2;
      }
    };
  }

  function exportPDF(isFinal) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      toast('The PDF library did not load. Use the Print / Save as PDF button instead.', 'bad', 6000);
      return Promise.resolve(false);
    }
    toast('Building your PDF…', null, 2000);

    var slots = EVIDENCE_SLOTS.filter(function (d) { return state.evidenceMeta[d.slot]; });
    return Promise.all(slots.map(function (d) {
      return idbGet(d.slot).then(function (rec) {
        if (!rec) return null;
        return recompressDataUrl(rec.dataUrl, IMG_PDF_MAX_DIM, IMG_PDF_QUALITY).then(function (small) {
          return small ? { def: d, img: small } : null;
        });
      });
    })).then(function (images) {
      var imgBySlot = {};
      images.forEach(function (x) { if (x) imgBySlot[x.def.slot] = x; });
      buildPDF(imgBySlot, isFinal);
      return true;
    }).catch(function (e) {
      toast('The PDF could not be created. Try the Print / Save as PDF button.', 'bad', 6000);
      return false;
    });
  }

  function buildPDF(imgBySlot, isFinal) {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    var W = makeWriter(doc);
    var d = state.data;
    var na = 'Not completed';

    /* ---- cover heading ---- */
    doc.setFillColor(43, 26, 85);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(255, 255, 255);
    doc.text(pdfSafe(LESSON_TITLE), 16, 13);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.setTextColor(205, 195, 240);
    doc.text(pdfSafe(SCHOOL_HEADING + '  \u00B7  ' + LESSON_META), 16, 19.5);
    W.y = 34;

    W.kv('Student name', state.student.fullName);
    W.kv('Class', state.student.className);
    W.kv('Year group', 'Year 8');
    W.kv('Term and week', 'Term 1, Week 1');
    W.kv('Lesson', LESSON_TITLE);
    W.kv('Date exported', prettyDate(nowISO()));
    W.kv('Lesson started', prettyDate(state.startedAt));
    W.kv('Device number', d.prep.deviceNumber);
    W.kv('Cable number', d.prep.cableNumber);
    W.kv('Working', d.prep.workMode + (d.prep.workMode === 'With a partner' && d.prep.partnerName ? ' — ' + d.prep.partnerName : ''));
    W.kv('Editor choice', d.ma1.editorChoice);
    W.kv('Project name', d.ma1.projectName);
    W.kv('Export type', isFinal ? 'Final export' : 'Progress export (work in progress)');
    if (state.teacherMode) W.kv('NOTE', 'Generated in TEACHER TEST MODE');
    W.gap(2); W.rule();

    /* ---- learning information ---- */
    W.h2('Lesson information');
    W.h3('Key Topic');
    W.p('Micro:bit onboarding and creating a first physical program.');
    W.h3('WAGBA');
    W.p('We are getting better at safely setting up a micro:bit, creating and transferring a program, and testing its LED output.');
    W.h3('Knowledge — students will know');
    ['the location and purpose of the LED matrix, Buttons A and B, USB port and edge connectors',
     'the purpose of a programming editor and simulator',
     'that a program must be transferred before it can run on the physical micro:bit',
     'that the LED matrix is an output device'].forEach(W.bullet);
    W.h3('Skills — students will be able to');
    ['connect and disconnect a micro:bit safely',
     'create and correctly name a project',
     'build a simple icon and short message',
     'test a program using the simulator',
     'download and transfer a program',
     'compare expected and actual output',
     'capture evidence of their work'].forEach(W.bullet);
    W.h3('Understanding — students will understand that');
    ['code in an editor does not automatically appear on a physical device',
     'testing in the simulator reduces avoidable mistakes',
     'the physical output should be compared with the expected output',
     'debugging involves making small changes, testing again and improving',
     'careful handling protects the micro USB port and cable'].forEach(W.bullet);
    W.h3('Keywords');
    W.p('micro:bit, LED matrix, Button A, Button B, input, output, USB, micro USB, editor, simulator, program, download, transfer, flash, test, debug');
    W.h3('Challenge');
    W.p('Add a Button A behaviour that displays a second symbol or short message without removing the original welcome output.');

    /* ---- completion summary ---- */
    W.h2('Completion summary');
    SECTIONS.forEach(function (s) {
      var done = isComplete(s.id);
      var label = s.num + '. ' + s.name + (s.optional ? ' (optional)' : '');
      if (s.optional && !done && !d.challenge.attempted) {
        W.tick(false, label + ' — Not attempted');
      } else {
        W.tick(done, label + ' — ' + (done ? 'Completed' : na));
      }
    });
    var core = SECTIONS.filter(function (s) { return !s.optional; });
    var doneCount = core.filter(function (s) { return isComplete(s.id); }).length;
    W.gap(1);
    W.p('Core sections complete: ' + doneCount + ' of ' + core.length + '.' +
        (state.completedAt ? ' Lesson completed at ' + prettyDate(state.completedAt) + '.' : ''), { style: 'bold' });

    /* ---- starter ---- */
    doc.addPage(); W.y = W.M;
    W.h1('Starter — From Code to a Physical Device');
    W.h3('Activity A: workflow order submitted');
    if (state.activity.sequence.checked) {
      state.activity.sequence.order.forEach(function (id, i) {
        var it = SEQUENCE_ITEMS.filter(function (s) { return s.id === id; })[0];
        W.tick(SEQUENCE_CORRECT[i] === id, (i + 1) + '. ' + it.text);
      });
      W.p('Result: ' + (seqCorrect() ? 'correct order' : 'not yet in the correct order') +
          '. Attempts: ' + state.activity.sequence.attempts + '.', { style: 'italic' });
    } else { W.p(na, { style: 'italic', colour: [150, 100, 0] }); }

    W.h3('Activity B: safe or unsafe');
    if (state.activity.safety.checked) {
      SAFETY_ITEMS.forEach(function (it) {
        var given = state.activity.safety.answers[it.id];
        var ok = !!given && ((given === 'safe') === it.safe);
        W.tick(ok, it.text + '  —  answered: ' + (given ? given : 'not answered') +
          '  (correct answer: ' + (it.safe ? 'safe' : 'unsafe') + ')');
      });
      W.p('Attempts: ' + state.activity.safety.attempts + '.', { style: 'italic' });
    } else { W.p(na, { style: 'italic', colour: [150, 100, 0] }); }

    W.h3(CHECKLISTS.starter.title);
    CHECKLISTS.starter.items.forEach(function (it) { W.tick(checkOn('starter', it.id), it.text); });

    /* ---- MA1 ---- */
    doc.addPage(); W.y = W.M;
    W.h1('Main Activity 1 — Micro:bit Onboarding');
    W.h3('Step 1: parts identification');
    if (state.activity.parts.checked) {
      PART_TERMS.forEach(function (t) {
        var given = state.activity.parts.answers[t.id];
        var gp = PART_PURPOSES.filter(function (p) { return p.id === given; })[0];
        W.tick(given === t.answer, t.term + ' → ' + (gp ? gp.text : 'not answered'));
      });
      W.p('Attempts: ' + state.activity.parts.attempts + '.', { style: 'italic' });
    } else { W.p(na, { style: 'italic', colour: [150, 100, 0] }); }

    W.h3('Step 1: retrieval questions');
    if (state.activity.retrieval.checked) {
      RETRIEVAL.forEach(function (q) {
        var given = q.options.filter(function (o) { return o.id === state.activity.retrieval.answers[q.id]; })[0];
        W.tick(state.activity.retrieval.answers[q.id] === q.answer,
          q.q + '  →  ' + (given ? given.text : 'not answered'));
      });
    } else { W.p(na, { style: 'italic', colour: [150, 100, 0] }); }

    W.h3('Step 2: ' + CHECKLISTS.connect.title);
    CHECKLISTS.connect.items.forEach(function (it) { W.tick(checkOn('connect', it.id), it.text); });

    W.h3('Step 3: editor and project');
    W.kv('Editor used', d.ma1.editorChoice);
    W.kv('Project name', d.ma1.projectName);
    W.kv('Matches convention', filled(d.ma1.projectName) ? (validateProjectName(d.ma1.projectName).ok ? 'Yes' : 'No — needs correcting') : '');

    W.h3('Evidence and reflection');
    W.qa('Successful check, or a connection problem and how it was solved:', d.ma1.problemSolved);
    if (imgBySlot.ma1_main) {
      W.img(imgBySlot.ma1_main.img.dataUrl, imgBySlot.ma1_main.img.w, imgBySlot.ma1_main.img.h,
        'Main Activity 1 evidence — ' + (d.ma1.evidenceCaption || 'no caption') +
        ' (uploaded ' + prettyDate(state.evidenceMeta.ma1_main.timestamp) + ')');
    } else { W.p('Main Activity 1 evidence image: ' + na, { style: 'italic', colour: [150, 100, 0] }); }

    W.h3(CHECKLISTS.ma1.title);
    CHECKLISTS.ma1.items.forEach(function (it) { W.tick(checkOn('ma1', it.id), it.text); });

    /* ---- MA2 ---- */
    doc.addPage(); W.y = W.M;
    W.h1('Main Activity 2 — Welcome Signal');
    W.h3('Step 4: plan');
    W.kv('Chosen icon', d.ma2.icon === 'Other' ? d.ma2.iconOther : d.ma2.icon);
    W.kv('Initials / word', d.ma2.message);
    W.qa('What did you predict would appear first?', d.ma2.prediction);
    W.qa('Why did you choose that sequence?', d.ma2.reason);

    W.h3('Step 5: simulator testing (Predict → Test → Compare → Improve)');
    W.kv('Matched prediction?', d.ma2.simMatched);
    W.qa('Change made, or confirmation that no correction was required:', d.ma2.simChange);

    W.h3('Step 6: download and transfer');
    W.kv('Transfer method', d.ma2.transferMethod);

    W.h3('Step 7: expected / simulator / physical comparison');
    W.qa('What the student expected:', d.ma2.cmpExpected);
    W.qa('What the simulator showed:', d.ma2.cmpSimulator);
    W.qa('What the physical device showed:', d.ma2.cmpPhysical);
    W.kv('Did all three match?', d.ma2.allMatched);
    W.qa('Improvement made after checking the real device:', d.ma2.improvement);

    W.h3('Evidence');
    ['ma2_code', 'ma2_device', 'ma2_extra'].forEach(function (slot) {
      var def = slotDef(slot);
      if (imgBySlot[slot]) {
        W.img(imgBySlot[slot].img.dataUrl, imgBySlot[slot].img.w, imgBySlot[slot].img.h,
          def.title + ' — ' + (getPath(d, def.captionPath) || 'no caption') +
          ' (uploaded ' + prettyDate(state.evidenceMeta[slot].timestamp) + ')');
      } else if (def.required) {
        W.p(def.title + ': ' + na, { style: 'italic', colour: [150, 100, 0] });
      } else {
        W.p(def.title + ': not uploaded (optional)', { style: 'italic', colour: [120, 125, 140] });
      }
    });

    W.h3(CHECKLISTS.ma2.title);
    CHECKLISTS.ma2.items.forEach(function (it) { W.tick(checkOn('ma2', it.id), it.text); });

    /* ---- challenge ---- */
    if (d.challenge.attempted) {
      doc.addPage(); W.y = W.M;
      W.h1('Optional challenge — Button A');
      W.p('Add a Button A behaviour that displays a second symbol or short message without removing the original welcome output.',
        { style: 'italic' });
      W.qa('What should Button A do?', d.challenge.buttonPlan);
      W.qa('What change was made?', d.challenge.changeMade);
      W.kv('Did it work?', d.challenge.worked);
      if (imgBySlot.challenge) {
        W.img(imgBySlot.challenge.img.dataUrl, imgBySlot.challenge.img.w, imgBySlot.challenge.img.h,
          'Challenge evidence — ' + (d.challenge.caption || 'no caption'));
      }
    }

    /* ---- plenary ---- */
    doc.addPage(); W.y = W.M;
    W.h1('Plenary — Ready for the Smart Badge Project');
    PLENARY_QS.forEach(function (q, i) { W.qa((i + 1) + '. ' + q.text, d.plenary[q.id]); });
    W.kv('6. Readiness for next week', d.plenary.readiness);
    W.gap(2);
    W.p('Teacher note: open responses are recorded exactly as the student wrote them and are not auto-marked.',
      { style: 'italic', colour: [110, 115, 132] });

    /* ---- testing and debugging notes ---- */
    W.h2('Testing and debugging notes');
    W.qa('Connection problem or successful check (Main Activity 1):', d.ma1.problemSolved);
    W.qa('Simulator correction (Main Activity 2, Step 5):', d.ma2.simChange);
    W.qa('Improvement after checking the physical device (Step 7):', d.ma2.improvement);
    W.kv('Sequencing attempts', String(state.activity.sequence.attempts));
    W.kv('Safety check attempts', String(state.activity.safety.attempts));
    W.kv('Parts matching attempts', String(state.activity.parts.attempts));

    /* ---- upload instruction ---- */
    W.gap(3);
    W.ensure(30);
    doc.setFillColor(43, 26, 85);
    doc.rect(W.M, W.y - 4, W.w, 22, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(255, 255, 255);
    doc.text(pdfSafe('Upload your completed PDF to the Microsoft Teams Assignment'), W.M + 3, W.y + 3);
    doc.text('named "' + TEAMS_ASSIGNMENT + '".', W.M + 3, W.y + 8.5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(210, 202, 245);
    doc.text(pdfSafe('Check your name and class are visible, all sections are included, and you upload the PDF - not a screenshot.'),
      W.M + 3, W.y + 14.5);
    W.y += 24;

    /* ---- page numbers + footer ---- */
    var total = doc.internal.getNumberOfPages();
    for (var p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setDrawColor(220, 223, 232); doc.setLineWidth(0.3);
      doc.line(16, 283, 194, 283);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120, 125, 142);
      doc.text(pdfSafe((state.student.fullName || 'Unknown') + '  \u00B7  Class ' +
               (state.student.className || '-') + '  \u00B7  Y8 T1W1  \u00B7  ' + LESSON_TITLE), 16, 288);
      doc.text('Page ' + p + ' of ' + total, 194, 288, { align: 'right' });
    }

    doc.save(pdfFileName());
    state.lastPdfAt = nowISO();
    recomputeCompletion();
    saveNow();
    refreshChrome();
    if (state.currentSection === 'review') renderReview();

    toast('PDF saved as ' + pdfFileName(), 'ok', 6000);
    showTeamsReminder();
  }

  function showTeamsReminder() {
    confirmDialogInfo('Now upload it to Teams',
      'Upload your completed PDF to the Microsoft Teams Assignment named "' + TEAMS_ASSIGNMENT + '".\n\n' +
      'Before you upload, check that:\n' +
      '• your name and class are visible\n' +
      '• the required lesson sections are included\n' +
      '• the PDF downloaded successfully\n' +
      '• you are uploading the PDF, not a screenshot');
  }

  function confirmDialogInfo(title, body) {
    lastFocus = document.activeElement;
    confirmCb = null;
    $('#confirmTitle').textContent = title;
    $('#confirmBody').textContent = body;
    $('#confirmBody').style.whiteSpace = 'pre-wrap';
    $('#confirmYes').textContent = 'Got it';
    $('#confirmNo').hidden = true;
    $('#confirmModal').hidden = false;
    $('#confirmYes').focus();
  }

  function printFallback() {
    var openSection = state.currentSection;
    $$('#sections .section').forEach(function (s) { s.hidden = false; });
    var banner = document.createElement('div');
    banner.className = 'print-only';
    banner.innerHTML = '<h1>' + esc(LESSON_TITLE) + '</h1><p>' + esc(SCHOOL_HEADING) + ' · ' + esc(LESSON_META) +
      '</p><p><strong>' + esc(state.student.fullName) + '</strong> · Class ' + esc(state.student.className) +
      ' · ' + esc(prettyDate(nowISO())) + '</p>';
    $('#sections').insertBefore(banner, $('#sections').firstChild);
    function after() {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
      $$('#sections .section').forEach(function (s) { s.hidden = s.getAttribute('data-section') !== openSection; });
      window.removeEventListener('afterprint', after);
    }
    window.addEventListener('afterprint', after);
    window.print();
    setTimeout(after, 1500);
  }

  /* ===========================================================================
     16. BACKUP EXPORT / IMPORT
     =========================================================================== */

  function exportBackup() {
    toast('Preparing your backup…', null, 2000);
    var slots = EVIDENCE_SLOTS.filter(function (d) { return state.evidenceMeta[d.slot]; });
    Promise.all(slots.map(function (d) {
      return idbGet(d.slot).then(function (rec) {
        if (!rec) return null;
        return { slot: d.slot, meta: rec.meta || state.evidenceMeta[d.slot], dataUrl: rec.dataUrl,
                 caption: getPath(state.data, d.captionPath) || '' };
      });
    })).then(function (imgs) {
      var payload = {
        lessonId: LESSON_ID,
        schemaVersion: SCHEMA_VERSION,
        lessonTitle: LESSON_TITLE,
        exportedAt: nowISO(),
        appVersion: '1.0.0',
        teacherMode: state.teacherMode,
        student: { fullName: state.student.fullName, className: state.student.className },
        currentSection: state.currentSection,
        startedAt: state.startedAt,
        updatedAt: state.updatedAt,
        completedAt: state.completedAt,
        lastPdfAt: state.lastPdfAt,
        checks: state.checks,
        responses: state.data,
        activity: state.activity,
        sectionsComplete: state.sectionsComplete,
        sectionsVisited: state.sectionsVisited,
        evidenceMeta: state.evidenceMeta,
        evidence: imgs.filter(Boolean)
      };
      var json = JSON.stringify(payload, null, 2);
      var sizeMB = json.length / 1048576;
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = backupFileName();
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);

      state.lastBackupAt = nowISO();
      saveNow(); refreshChrome();
      toast('Backup saved (' + sizeMB.toFixed(1) + ' MB). Keep it somewhere safe.', 'ok', 5000);
      if (sizeMB > 4) toast('That backup is large because it contains your photos. It may be slow to email.', 'warn', 6000);
    }).catch(function () {
      toast('The backup could not be created.', 'bad', 5000);
    });
  }

  function handleImportFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var payload;
      try { payload = JSON.parse(reader.result); }
      catch (e) { toast('That file is not valid JSON. It may be damaged or it may not be a backup file.', 'bad', 6000); return; }

      if (!payload || typeof payload !== 'object') { toast('That backup file could not be read.', 'bad', 6000); return; }
      if (payload.lessonId !== LESSON_ID) {
        toast('That backup is for a different lesson (' + (payload.lessonId || 'unknown') + '). It was not imported.', 'bad', 7000);
        return;
      }
      if (Number(payload.schemaVersion) !== SCHEMA_VERSION) {
        toast('That backup uses schema version ' + payload.schemaVersion + '. This app expects version ' +
          SCHEMA_VERSION + '. It was not imported.', 'bad', 7000);
        return;
      }

      var who = (payload.student && payload.student.fullName) || 'Unknown';
      var cls = (payload.student && payload.student.className) || '—';
      confirmDialog('Replace your current progress?',
        'This will replace everything currently saved in this browser with the backup for ' + who +
        ' (Class ' + cls + '), exported ' + prettyDate(payload.exportedAt) + '. This cannot be undone.',
        function () { applyImport(payload); });
    };
    reader.onerror = function () { toast('That file could not be opened.', 'bad', 5000); };
    reader.readAsText(file);
  }

  function applyImport(payload) {
    var fresh = blankState();
    fresh.student.fullName  = (payload.student && payload.student.fullName) || '';
    fresh.student.className = (payload.student && payload.student.className) || '';
    fresh.teacherMode = state.teacherMode;
    fresh.currentSection = payload.currentSection || 'prep';
    fresh.startedAt   = payload.startedAt || nowISO();
    fresh.completedAt = payload.completedAt || null;
    fresh.lastPdfAt   = payload.lastPdfAt || null;
    Object.keys(fresh.data).forEach(function (k) {
      fresh.data[k] = Object.assign(fresh.data[k], (payload.responses || {})[k] || {});
    });
    fresh.checks = Object.assign({}, payload.checks || {});
    fresh.activity = Object.assign(fresh.activity, payload.activity || {});
    fresh.sectionsComplete = Object.assign({}, payload.sectionsComplete || {});
    fresh.sectionsVisited  = Object.assign({}, payload.sectionsVisited || {});
    fresh.evidenceMeta     = Object.assign({}, payload.evidenceMeta || {});

    var oldState = state;
    state = fresh;

    var evidence = Array.isArray(payload.evidence) ? payload.evidence : [];
    var restore = evidence.map(function (e) {
      if (!e || !e.slot || !e.dataUrl || !slotDef(e.slot)) return Promise.resolve(false);
      state.evidenceMeta[e.slot] = e.meta || state.evidenceMeta[e.slot] || { slot: e.slot, timestamp: nowISO(), bytes: 0, name: 'restored' };
      if (e.caption) setPath(state.data, slotDef(e.slot).captionPath, e.caption);
      return idbPut(e.slot, { dataUrl: e.dataUrl, meta: state.evidenceMeta[e.slot] }).then(function () { return true; })
             .catch(function () { return false; });
    });

    /* remove any images that the backup did not contain */
    var stale = EVIDENCE_SLOTS.filter(function (dd) {
      return !evidence.some(function (e) { return e && e.slot === dd.slot; });
    }).map(function (dd) { delete state.evidenceMeta[dd.slot]; return idbDel(dd.slot); });

    Promise.all(restore.concat(stale)).then(function (res) {
      var restored = res.filter(function (r) { return r === true; }).length;
      recomputeCompletion();
      saveNow();
      applyStateToDom();
      renderSequence(); applySafetyState(); applyPartsState(); applyRetrievalState();
      goTo(isUnlocked(state.currentSection) ? state.currentSection : 'prep');
      toast('Backup imported for ' + (state.student.fullName || 'unknown student') + ' (Class ' +
        (state.student.className || '—') + '). ' + restored + ' image' + (restored === 1 ? '' : 's') + ' restored.', 'ok', 6000);
    }).catch(function () {
      state = oldState;
      toast('The backup could not be fully restored. Your previous work has been kept.', 'bad', 7000);
    });
  }

  function resetProgress() {
    confirmDialog('Reset all progress?',
      'Every answer, checklist tick and uploaded image saved in this browser for ' +
      (state.student.fullName || 'this student') + ' will be permanently deleted. ' +
      'Export a PDF or a JSON backup first if you want to keep it.',
      function () {
        Promise.all(EVIDENCE_SLOTS.map(function (dd) { return idbDel(dd.slot); })).then(function () {
          try { localStorage.removeItem(storageKey); } catch (e) {}
          location.reload();
        });
      });
  }

  /* ===========================================================================
     17. LANDING / TEACHER MODE / START-UP
     =========================================================================== */

  function teacherSeed() {
    var d = state.data;
    d.prep.deviceNumber = 'MB-TEST-01';
    d.prep.cableNumber  = 'C-TEST-01';
    d.prep.workMode     = 'Independently';
    d.prep.projectFileName = 'Y8_8T_Pair01_SmartBadge_W1';
    d.prep.ready = true;
    d.ma1.editorChoice = 'Blocks (MakeCode)';
    d.ma1.projectName  = 'Y8_8T_Pair01_SmartBadge_W1';
    d.ma1.evidenceCaption = 'Teacher test caption';
    d.ma1.problemSolved = 'Teacher test entry: the MICROBIT drive did not appear at first, so we swapped the cable and it worked.';
    d.ma2.icon = 'Heart'; d.ma2.message = 'READY';
    d.ma2.prediction = 'The heart icon should appear before the word READY.';
    d.ma2.reason = 'The show icon block is above the show string block inside on start.';
    d.ma2.simMatched = 'Yes, it matched';
    d.ma2.simChange = 'No correction was required on the first run.';
    d.ma2.transferMethod = TRANSFER_METHODS[2];
    d.ma2.cmpExpected  = 'Heart, short pause, then READY scrolling.';
    d.ma2.cmpSimulator = 'Heart, then READY scrolled once.';
    d.ma2.cmpPhysical  = 'Heart, then READY scrolled once on the real LEDs.';
    d.ma2.allMatched = 'Yes, all three matched';
    d.ma2.improvement = 'Increased the pause from 500 to 800 milliseconds.';
    d.ma2.capCode = 'Blocks screenshot'; d.ma2.capDevice = 'Photo of the device';
    d.plenary.q1 = 'You must download the program and copy the hex file onto the MICROBIT drive.';
    d.plenary.q2 = 'It is an output because it displays information produced by the program.';
    d.plenary.q3 = 'Always insert the micro USB connector straight and never force it.';
    d.plenary.q4 = 'The drive did not appear, so we tried a different USB port and it worked.';
    d.plenary.q5 = 'It let me see the order of the outputs before transferring anything.';
    d.plenary.readiness = READINESS[0];
    Object.keys(CHECKLISTS).forEach(function (g) {
      CHECKLISTS[g].items.forEach(function (it) { state.checks[g + '.' + it.id] = true; });
    });
    state.activity.sequence.order = SEQUENCE_CORRECT.slice();
    state.activity.sequence.checked = true; state.activity.sequence.attempts = 1;
    SAFETY_ITEMS.forEach(function (it) { state.activity.safety.answers[it.id] = it.safe ? 'safe' : 'unsafe'; });
    state.activity.safety.checked = true; state.activity.safety.attempts = 1;
    PART_TERMS.forEach(function (t) { state.activity.parts.answers[t.id] = t.answer; });
    state.activity.parts.checked = true; state.activity.parts.attempts = 1;
    RETRIEVAL.forEach(function (q) { state.activity.retrieval.answers[q.id] = q.answer; });
    state.activity.retrieval.checked = true; state.activity.retrieval.attempts = 1;
    state.data.challenge.buttonPlan = 'Show a star when Button A is pressed.';
    state.data.challenge.changeMade = 'Added an on button A pressed block with show icon star.';
    state.data.challenge.worked = 'Yes, it worked';
  }

  function startLesson() {
    $('#landing').hidden = true;
    $('#app').hidden = false;
    $('#teacherBadge').hidden = !state.teacherMode;
    if (!rendered) renderAll();
    applyStateToDom();
    renderSequence(); applySafetyState(); applyPartsState(); applyRetrievalState();
    recomputeCompletion();
    var target = isUnlocked(state.currentSection) ? state.currentSection : 'prep';
    goTo(target, false);
    saveNow();
    document.title = state.student.fullName + ' — ' + LESSON_TITLE;
  }

  function handleEntry(e) {
    e.preventDefault();
    var nameEl = $('#entryName'), classEl = $('#entryClass');
    var name = nameEl.value.trim(), cls = classEl.value.trim();
    var isTeacher = name.toLowerCase() === TEACHER_TRIGGER;
    var ok = true;

    if (!name) {
      $('#entryNameErr').textContent = 'Please enter your full name before you begin.';
      nameEl.setAttribute('aria-invalid', 'true'); ok = false;
    } else if (!isTeacher && name.length < 3) {
      $('#entryNameErr').textContent = 'Please enter your full name, not just an initial.';
      nameEl.setAttribute('aria-invalid', 'true'); ok = false;
    } else {
      $('#entryNameErr').textContent = ''; nameEl.removeAttribute('aria-invalid');
    }

    if (!cls && !isTeacher) {
      $('#entryClassErr').textContent = 'Please enter your class before you begin.';
      classEl.setAttribute('aria-invalid', 'true'); ok = false;
    } else {
      $('#entryClassErr').textContent = ''; classEl.removeAttribute('aria-invalid');
    }
    if (!ok) { (nameEl.getAttribute('aria-invalid') ? nameEl : classEl).focus(); return; }

    storageKey = isTeacher ? KEY_TEACHER : KEY_STUDENT;
    var existing = loadState(storageKey);

    if (existing && !isTeacher &&
        existing.student.fullName.toLowerCase() === name.toLowerCase() &&
        existing.student.className.toLowerCase() === cls.toLowerCase()) {
      state = existing;                       // resume
    } else if (existing && isTeacher) {
      state = existing;
    } else {
      state = blankState();
    }

    state.teacherMode = isTeacher;
    state.student.fullName  = isTeacher ? 'Teacher (test mode)' : name;
    state.student.className = isTeacher ? (cls || 'TEST') : cls;
    if (isTeacher && !filled(state.data.ma1.projectName)) teacherSeed();

    saveNow();
    startLesson();
  }

  function initLanding() {
    $('#entryForm').addEventListener('submit', handleEntry);
    refreshResumeBanner();
    $('#entryStartFresh').addEventListener('click', function () {
      var existingNow = loadState(KEY_STUDENT);
      var who = (existingNow && existingNow.student.fullName) || 'this student';
      confirmDialog('Start fresh instead?',
        'This clears the saved progress on this computer for ' + who + ' so the lesson begins from the ' +
        'very start. This cannot be undone — export a PDF first if you want to keep that work.',
        function () {
          try { localStorage.removeItem(KEY_STUDENT); } catch (e) {}
          $('#entryName').value = ''; $('#entryClass').value = '';
          $('#entryStart').textContent = 'Start the lesson';
          $('#entryResume').hidden = true;
          toast('Saved progress cleared. Enter your name and class to start fresh.', 'ok', 4000);
          $('#entryName').focus();
        });
    });
  }

  /** Shows the "saved work found" banner when the name+class typed on the
   *  landing page match — or when any saved student record already exists,
   *  so a returning student can see it before they even finish typing. */
  function refreshResumeBanner() {
    var existing = loadState(KEY_STUDENT);
    var r = $('#entryResume');
    if (!existing || !existing.student.fullName) { r.hidden = true; return; }
    var core = SECTIONS.filter(function (s) { return !s.optional; });
    var done = core.filter(function (s) { return existing.sectionsComplete[s.id]; }).length;
    $('#entryName').value  = existing.student.fullName;
    $('#entryClass').value = existing.student.className;
    r.hidden = false;
    $('#entryResumeText').textContent = 'Saved work found on this computer for ' + existing.student.fullName +
      ' (Class ' + existing.student.className + ') — ' + done + ' of ' + core.length +
      ' sections complete, last saved ' + prettyDate(existing.updatedAt) +
      '. Entering that same name and class below will carry on exactly where it left off — including ' +
      'which section you land on. If you want to begin again from Student preparation instead, use ' +
      '"Start fresh" below.';
    $('#entryStart').textContent = 'Continue the lesson';
  }

  /* ---- global listeners ---- */
  function initGlobal() {
    $('#btnBack').addEventListener('click', function () {
      var i = SECTIONS.map(function (s) { return s.id; }).indexOf(state.currentSection);
      if (i > 0) goTo(SECTIONS[i - 1].id);
    });
    $('#btnNext').addEventListener('click', function () {
      var i = SECTIONS.map(function (s) { return s.id; }).indexOf(state.currentSection);
      if (i < SECTIONS.length - 1) {
        var nxt = SECTIONS[i + 1];
        if (!isUnlocked(nxt.id)) { flashLocked($('#btnNext')); toast(unlockMessage(nxt.id), 'warn', 5000); return; }
        goTo(nxt.id);
      }
    });

    $('#btnExportPartial').addEventListener('click', function () { exportPDF(false); });
    $('#btnBackup').addEventListener('click', exportBackup);
    $('#importFile').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (f) handleImportFile(f);
      e.target.value = '';
    });

    /* learning panel drawer */
    function setPanel(open) {
      $('#learnPanel').classList.toggle('open', open);
      $('#btnPanelToggle').setAttribute('aria-expanded', open ? 'true' : 'false');
      $('#panelScrim').hidden = !open;
      if (open) $('#btnPanelClose').focus(); else $('#btnPanelToggle').focus();
    }
    $('#btnPanelToggle').addEventListener('click', function () {
      setPanel(!$('#learnPanel').classList.contains('open'));
    });
    $('#btnPanelClose').addEventListener('click', function () { setPanel(false); });
    $('#panelScrim').addEventListener('click', function () { setPanel(false); });

    /* modals */
    $('#imgModalClose').addEventListener('click', closeImageModal);
    $('#imgModal').addEventListener('click', function (e) { if (e.target === $('#imgModal')) closeImageModal(); });
    $('#confirmCloseX').addEventListener('click', closeConfirm);
    $('#confirmNo').addEventListener('click', closeConfirm);
    $('#confirmYes').addEventListener('click', function () {
      var cb = confirmCb;
      $('#confirmYes').textContent = 'Confirm';
      $('#confirmNo').hidden = false;
      closeConfirm();
      if (cb) cb();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!$('#imgModal').hidden) closeImageModal();
        else if (!$('#confirmModal').hidden) { $('#confirmYes').textContent = 'Confirm'; $('#confirmNo').hidden = false; closeConfirm(); }
        else if ($('#learnPanel').classList.contains('open')) setPanel(false);
      }
    });

    window.addEventListener('beforeunload', function () { if (saveTimer) { clearTimeout(saveTimer); saveNow(); } });
  }

  /** Shows a visible, dismiss-free banner instead of a silent blank/frozen
   *  page if something throws. Never fails silently on a school laptop. */
  function showFatalBanner(err, file, line) {
    try {
      var b = document.getElementById('fatalBanner');
      var m = document.getElementById('fatalBannerMsg');
      if (!b) return;
      var detail = (err && (err.message || err.name)) ? String(err.message || err.name) : '';
      if (file) detail += ' [' + String(file).split('/').pop() + (line ? ':' + line : '') + ']';
      if (m) m.textContent = detail ? '(' + detail + ')' : '';
      b.hidden = false;
      if (window.console && console.error) console.error('Y8T1W1 fatal:', err);
    } catch (e) { /* nothing more we can do */ }
  }
  /* Only genuine uncaught JavaScript exceptions raise the banner.
     Resource-load failures (a missing PNG) carry no `error` object and are
     already handled gracefully by the figure fallback, so they must not
     trigger a scary red bar. */
  window.addEventListener('error', function (e) {
    if (!e || !e.error) return;
    showFatalBanner(e.error, e.filename, e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason;
    /* Storage being unavailable (common on file:// in Firefox and Safari) is
       a known, survivable condition — warn, do not alarm. */
    if (r && /indexeddb|storage|quota|security/i.test(String(r.name || '') + String(r.message || ''))) {
      toast('This browser is blocking local storage, so images may not save. ' +
            'Ask your teacher to open the hosted version of this page.', 'warn', 8000);
      return;
    }
    showFatalBanner(r);
  });

  /* ---- boot (runs exactly once, however late the script is loaded) ---- */
  var booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    try {
      initLanding();
      initGlobal();
    } catch (err) {
      showFatalBanner(err);
      throw err;   // still surface it in the console for debugging
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* expose a tiny surface for teacher console testing */
  window.Y8T1W1 = {
    getState: function () { return state; },
    exportPDF: exportPDF,
    exportBackup: exportBackup,
    version: '1.0.0'
  };

})();
