/* ==========================================================================
   LAB LAUNCH — TEACHER CONFIGURATION
   ==========================================================================
   Everything a teacher normally needs to change lives in this file.
   Edit the values between the quotation marks, save the file, and refresh
   the page in the browser. No other file needs to be touched.
   ========================================================================== */

const LAB_CONFIG = {

  /* The title shown on the landing page and in the header. */
  APP_TITLE: "Lab Launch: Year 6 Computing Quest",

  /* Shown on the landing page and on the printed completion report.
     Leave as "" to hide. */
  SCHOOL_NAME: "",

  /* Shown on the printed completion report. Leave as "" to hide. */
  TEACHER_NAME: "",

  /* List of class names students can choose from on the landing page.
     Example: CLASS_OPTIONS: ["6A", "6B", "6C"],
     Leave the list empty ( [] ) to let students type their class instead. */
  CLASS_OPTIONS: [],

  /* Paste the full link to the Scratch project students will investigate.
     Example: "https://scratch.mit.edu/projects/123456789/"
     The link opens in a new browser tab so this app stays open. */
  SCRATCH_PROJECT_URL: "https://scratch.mit.edu/projects/editor/",

  /* Passcode for the hidden teacher mode.
     Open the app with  ?teacher=1  added to the address, then enter this
     passcode. CHANGE THIS before using with a class. */
  TEACHER_PASSCODE: "year6ready",

  /* true = short original sound effects play for rewards and feedback.
     false = the app is silent. Students always have their own mute button. */
  ENABLE_SOUND: true,

  /* true = speaker buttons offer read-aloud using the browser's built-in
     speech (no internet service is used). false = speaker buttons hidden. */
  ENABLE_READ_ALOUD: true,

  /* false = the ?teacher=1 entrance is disabled completely. */
  ENABLE_TEACHER_MODE: true
};

/* Do not edit below this line. */
if (typeof window !== "undefined") { window.LAB_CONFIG = LAB_CONFIG; }
