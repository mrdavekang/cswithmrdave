# Year 7 Week 2 Practical Web App

## Open the lesson

1. Extract the ZIP fully.
2. Open `index.html` in a modern browser.
3. Students enter their full name and class.

The app is deliberately built without modules or online services, so the core lesson, Turtle editor, images, saving and PDF tools can run directly from `file://` after extraction.

## Teacher review access

Enter `teacher` as the name (capitalisation does not matter). The class field becomes unavailable and all lesson pages unlock. Teacher review data is stored separately from student data. There are no visible teacher controls.

## Student progress

- Text, selections, checkboxes, navigation, Python code and significant actions are saved automatically in browser storage.
- Each name-and-class combination has a separate record on the same device.
- Large evidence images are compressed before saving.
- Progress remains on the current browser and device. It is not a central teacher-monitoring system.
- Clearing browser site data removes locally saved progress; students should export evidence before doing so.

## Python Turtle implementation

- The app bundles Skulpt locally and runs Python in the browser without sending code to an external editor.
- A transparent 800 × 600 Turtle canvas is placed over `assets/school_map_800x600.png`.
- Turtle coordinates use the centre of the map as `(0, 0)`, matching standard Turtle reasoning.
- The line `screen.bgpic("school_map.gif")` remains in the student’s downloaded `.py` file for desktop Python. Inside the browser, the app safely recognises this line and uses the web page’s background layer instead.
- `t.done()` remains in the downloaded file but is safely omitted during browser execution.
- The editor supports tab indentation and `Ctrl+Enter` to run.
- An execution time limit reduces the risk of an infinite loop freezing the lesson.

For the downloaded `.py` file to load its background in desktop Python, keep `school_map.gif` in the same folder as the Python file.

## Evidence and submission

Students can:

- add a screenshot or photo of an annotated route plan;
- capture combined Python code and Turtle-map evidence;
- download their `.py` file;
- export a PDF report containing their answers and evidence;
- use Print / Save as PDF if direct PDF creation is blocked.

The app instructs students to upload the PDF and `.py` file to the Microsoft Teams Assignment **Week 2 Practical**.

## Reading level and lesson visuals

- Student instructions use everyday examples before introducing Computer Science vocabulary.
- Necessary terms such as decomposition, abstraction, IPO and pseudocode appear beside a plain-language meaning.
- The starter begins with a first-day scenario and the actual working map, including its green start, blue finish and red restricted area.
- The map is repeated beside planning only when students need to refer to it.
- A worked pseudocode example shows how to plan Main Entrance to Reception before students write their own route.
- A short visual example shows that Python Turtle works like a digital pen drawing a blue line on the map.
- The project is now a First-Day School Tour with required stops at Reception, Library, Main Stairs, Science Corridor and CS Room C1. This makes decomposition necessary rather than artificial.
- Main Task 1 explicitly compares an overloaded map with a simplified abstraction and asks students what should be kept, removed and why.
- Main Task 2 contains a worked Journey 1 plus separate thinking instructions and writing areas for Journeys 2, 3 and 4.
- Longer teaching content is divided into numbered expandable cards so students focus on one step at a time.

## Hosting

Upload the whole extracted folder without changing its internal structure. It works on standard static hosts such as a school web server, GitHub Pages, Netlify or Vercel. No database, account, build step or CDN is required.

## Replace the map

To use a real school map:

1. Prepare a privacy-safe 800 × 600 PNG with no student information.
2. Replace `assets/school_map_800x600.png` using exactly the same filename.
3. Provide a matching GIF named `assets/school_map.gif` for the downloaded desktop-Python activity.
4. Update the route coordinates and location wording in `app.js`.
5. Test the start, destination and restricted-area alignment before deployment.

## Browser notes

- Current versions of Chrome, Edge, Safari and Firefox are recommended.
- Direct PDF generation and evidence capture require the local `html2canvas` and `jsPDF` files in `vendor/`.
- Browser privacy settings can block storage in unusual private-browsing modes.
- If a browser restricts a function under `file://`, serve the folder through a normal static host.
