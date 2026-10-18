MEMORY CREW — Year 8 MakeCode Arcade templates

OPEN FIRST
Open START-HERE.html for links, editing guides and success checks.

WORKING DEMONSTRATION
https://makecode.com/_UjdPqP7m48LU

STUDENT STARTER
https://makecode.com/_7dfe3vL0R51X

Click Edit Code on the shared project page. Work in Blocks or use the language
dropdown beside JavaScript to select Python. Both routes are MakeCode Arcade.
The original share links are snapshots; students edit their own local copies.

IMPORT BACKUP
Open https://arcade.makecode.com/ → Import → Import File. Select the supplied
PNG cartridge or .mkcd project. Alternatively drag the original PNG into Arcade
on a computer. Do not resize/recompress the cartridge: it contains the code.
The large annotated PNGs under guides/ are instructions, NOT cartridges.

LANGUAGES
Blocks calls its list blocks Arrays. Arcade Python uses list[index] notation.
These templates are not compatible with micro:bit MakeCode Python, MicroPython,
or a desktop Python IDE. No micro:bit is needed. Do not replace only main.py in
an empty project: engine.ts must stay with it. Import the complete project.

WHAT IS SUPPLIED / WHAT STUDENTS DO
The interface, clue reveal, answer comparison and feedback are prepared.
Students create list data, retrieve an indexed value and update one element.
The starter compiles and reveals its UP placeholders. It deliberately displays
ENGINEER CHECK until A's empty correctDirection is replaced by list retrieval.
Completing that missing expression is a learning task, not a technical fault.
This is not a full sequence-entry memory game: recall one requested clue.

SAVE
Rename the project first. The disk icon saves an editable PNG. Browser storage
is device/browser specific; export a cartridge before changing devices.
On tablets use the on-screen D-pad/A/B. Direct physical hardware flashing and
tablet-specific save flows have not been tested; the browser simulator is used.

FILES
projects/ contains two importable .mkcd files and two editable PNG cartridges.
source/01 and source/02 contain original Arcade TypeScript + shared engine.
main.py is the actual Arcade-converted equivalent for reference. The import
package starts with TypeScript and converts to native Blocks/Python in Arcade.
The empty main.blocks in the source is intentional: Arcade generates it.
guides/ contains five annotated real screenshots.

TEACHER CHECKS
Ask: What data must stay in order? Why is clue 2 at index 1? What changes when B
updates route[1]? How can a test show the answer isn't hard-coded?
Do not assess the prepared engine as student-authored programming.
Stretch: 4–5 clues; ask a different valid index; reduce clue ms from 900 to 700.
Change one thing at a time and keep the second-clue update test.

LIMITS
Press B between rounds, not during clue reveal. Do not edit the prepared
engine.ts in the first lesson. Retain these exact native Arcade files when
sharing: the extra engine file supplies the teal Memory Crew blocks.
Arcade and shared links require internet; local source backups are included.

OFFICIAL REFERENCES
https://arcade.makecode.com/reference/arrays/get
https://arcade.makecode.com/reference/controller/button/on-event
https://arcade.makecode.com/courses/csintro2/arrays/intro
