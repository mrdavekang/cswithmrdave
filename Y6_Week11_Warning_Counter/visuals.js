window.WarningVisuals={
  "S01": {
    "src": "assets/guides/S01.webp",
    "width": 886,
    "height": 664,
    "alt": "Read the real blocks. Tell someone what each script does. Start: begin at zero. A: add one. B: reset. Explain the program before choosing your answers. Keywords: variable, value, add, reset, display.",
    "manufacturer": false
  },
  "S02": {
    "src": "assets/guides/S02.webp",
    "width": 1054,
    "height": 664,
    "alt": "The count starts at 0. The guide presses A once for each visitor. Predict the number after the third press. Explain how change by 1 uses the previous total. Do not rebuild the program here. Read and explain it.",
    "manufacturer": false
  },
  "S03": {
    "src": "assets/guides/S03.webp",
    "width": 1000,
    "height": 664,
    "alt": "One group has finished. Read the B blocks before the next group arrives. What value is stored after B? Use: Button B is useful when... because... A short answer or an oral explanation is enough.",
    "manufacturer": false
  },
  "M1-01": {
    "src": "assets/guides/M1-01.webp",
    "width": 702,
    "height": 664,
    "alt": "Open Logic. Choose the block that has both then and else. Use if / else, not the smaller if-only block. Drag it into your A-button script. This is a choice between two outcomes.",
    "manufacturer": false
  },
  "M1-02": {
    "src": "assets/guides/M1-02.webp",
    "width": 1784,
    "height": 330,
    "alt": "Use the visitors value, the comparison sign and the number 5. The left side reads the stored visitor count. The right side is our threshold: 5. Read >= as five or more. It includes 5, 6 and higher numbers.",
    "manufacturer": false
  },
  "M1-03": {
    "src": "assets/guides/M1-03.webp",
    "width": 554,
    "height": 664,
    "alt": "Open the small comparison menu. Choose the last option: >=. Do not choose =. That means exactly five. A warning must still happen when the count reaches six. The check has a yes-or-no answer.",
    "manufacturer": false
  },
  "M1-04": {
    "src": "assets/guides/M1-04.webp",
    "width": 690,
    "height": 664,
    "alt": "Inside A, put change visitors by 1 above the decision. Yes: show the cross warning icon. Otherwise: show number visitors. Keep your on start and B scripts. Do not add a second A event.",
    "manufacturer": false
  },
  "M1-05": {
    "src": "assets/guides/M1-05.webp",
    "width": 690,
    "height": 664,
    "alt": "Use your finger to follow the two possible routes through this example. At 4: the check is false, so show 4. At 5 or 6: the check is true, so show the cross. Press A slowly. Wait for each result before pressing again.",
    "manufacturer": false
  },
  "M2-01": {
    "src": "assets/guides/M2-01.webp",
    "width": 1596,
    "height": 664,
    "alt": "The toolbox example starts at 4. Change that number to 3 in your program. The loop repeats only the blocks placed inside it. We want three flashes, not four. Do not use forever for this warning.",
    "manufacturer": false
  },
  "M2-02": {
    "src": "assets/guides/M2-02.webp",
    "width": 536,
    "height": 664,
    "alt": "Put all four blue blocks inside repeat 3 times. Show the icon. Pause. Clear the screen. Pause. Keep both pauses. They let us see on and off. 300 ms is 0.3 seconds. clear screen does not reset visitors.",
    "manufacturer": false
  },
  "M2-03": {
    "src": "assets/guides/M2-03.webp",
    "width": 417,
    "height": 664,
    "alt": "Keep show number visitors below the repeat, inside the true branch. Finish all three flashes before showing the number. In else, keep show number visitors too. Wait until the warning finishes before pressing A or B again.",
    "manufacturer": false
  },
  "M2-04": {
    "src": "assets/guides/M2-04.webp",
    "width": 1528,
    "height": 652,
    "alt": "These are actual simulator captures after each test has finished. Watch the flashes during the test, not just the final number. Then press B. Does counting start again from 0? Write what you actually saw. A different result is useful for debugging.",
    "manufacturer": false
  },
  "G01": {
    "src": "assets/guides/G01.webp",
    "width": 362,
    "height": 652,
    "alt": "This is a manufacturer example, not a photograph of our school kit. The micro:bit slots into the Grove shield. A Grove cable joins the shield to one module. Teacher check: match the actual shield version and module before use.",
    "manufacturer": true
  },
  "G02": {
    "src": "assets/guides/G02.webp",
    "width": 658,
    "height": 652,
    "alt": "Ask your teacher to check the board and cables before switching on. Do not pull on wires or force a connector. Use only the teacher-approved USB and power arrangement. Follow the school kit instructions. Never connect mains electricity.",
    "manufacturer": true
  },
  "LED-01": {
    "src": "assets/guides/LED-01.webp",
    "width": 624,
    "height": 664,
    "alt": "This manufacturer illustration shows the Grove Red LED module. The light is an output outside the micro:bit screen. Our purpose: make the group-size warning easier to notice. Use the LED module, not a bare LED connected directly to a pin.",
    "manufacturer": true
  },
  "LED-02": {
    "src": "assets/guides/LED-02.webp",
    "width": 366,
    "height": 646,
    "alt": "Use this socket only when your teacher confirms your shield matches. Find the socket labelled P0/P14. With power off, connect the Grove cable and LED module. The program controls P0. The label P0/P14 names the socket.",
    "manufacturer": true
  },
  "LED-03": {
    "src": "assets/guides/LED-03.webp",
    "width": 1784,
    "height": 478,
    "alt": "Open Advanced, then Pins. Choose digital write pin. Choose P0 to match the wiring. For this LED: 1 means on; 0 means off. clear screen switches off the board picture, not this separate light.",
    "manufacturer": false
  },
  "LED-04": {
    "src": "assets/guides/LED-04.webp",
    "width": 857,
    "height": 664,
    "alt": "Keep your counter and decision. Replace the screen-flash pattern with these pin blocks. Inside repeat: P0 to 1, pause, P0 to 0, pause. Try changing both pause values to 500. Test 4, 5 and 6. This sample has not been tested on school hardware.",
    "manufacturer": false
  },
  "LED-05": {
    "src": "assets/guides/LED-05.webp",
    "width": 1784,
    "height": 604,
    "alt": "Keep the LED off when starting and when B resets the counter. Use digital write P0 to 0 in both places. Test B after the warning has finished. Explain: My light is useful because...",
    "manufacturer": false
  },
  "DISPLAY-01": {
    "src": "assets/guides/DISPLAY-01.webp",
    "width": 1135,
    "height": 664,
    "alt": "This manufacturer illustration shows the display module, not a live test result. The display is an output that can show our stored count. Its sample picture says 88:88. Your program will show visitors. This is not an LCD1602 display. Use the correct module.",
    "manufacturer": true
  },
  "DISPLAY-02": {
    "src": "assets/guides/DISPLAY-02.webp",
    "width": 1543,
    "height": 729,
    "alt": "Follow the labelled connection map. No ultrasonic sensor is needed. Teacher check: display cable to the P1/P15 socket. Use P1 and P15 in the setup block too. Connection map based on Seeed diagrams. Not a photo of a school build.",
    "manufacturer": true
  },
  "DISPLAY-03": {
    "src": "assets/guides/DISPLAY-03.webp",
    "width": 1420,
    "height": 664,
    "alt": "With Grove installed, type 4-Digit in the toolbox Search box and press Enter. The default setup shows P0 and P1. Change them. Our wiring uses P1 and P15; do not copy the default pins. The teacher-prepared starter can already include the Grove extension.",
    "manufacturer": false
  },
  "DISPLAY-04": {
    "src": "assets/guides/DISPLAY-04.webp",
    "width": 1329,
    "height": 664,
    "alt": "Use one display variable and one visitors variable. They have different jobs. Set display to 4-Digit Display at P1 and P15. Set visitors to 0. Show visitors on both displays. display is the device controller. visitors stores the count.",
    "manufacturer": false
  },
  "DISPLAY-05": {
    "src": "assets/guides/DISPLAY-05.webp",
    "width": 1784,
    "height": 544,
    "alt": "Show visitors on the Grove display wherever you show the updated board number. Add display show number visitors in both A branches. Also update it after B sets visitors to 0. Hardware test: both outputs should agree at 0, 3 and after reset.",
    "manufacturer": false
  },
  "GESTURE-01": {
    "src": "assets/guides/GESTURE-01.webp",
    "width": 628,
    "height": 664,
    "alt": "This manufacturer picture shows the sensing face and example hand movements. It recognises a hand movement near the sensing face. It does not automatically count people entering a room. Teacher check: identify the matching sensor in your kit.",
    "manufacturer": true
  },
  "GESTURE-02": {
    "src": "assets/guides/GESTURE-02.webp",
    "width": 386,
    "height": 654,
    "alt": "The I2C socket is different from P0/P14 and P1/P15. With power off, connect the cable to I2C. Ask your teacher to check before powering on. Keep the sensor face clear. Test one slow movement at a time.",
    "manufacturer": true
  },
  "GESTURE-03": {
    "src": "assets/guides/GESTURE-03.webp",
    "width": 408,
    "height": 664,
    "alt": "Open the event dropdown. This example uses Right. Choose the same gesture in your code and your test. Try another gesture only after your first test works. The direction picture is a manufacturer reference; confirm it on the real sensor.",
    "manufacturer": false
  },
  "GESTURE-04": {
    "src": "assets/guides/GESTURE-04.webp",
    "width": 414,
    "height": 664,
    "alt": "Use the same count, decision and warning inside this new event. Move the counting job from A to this gesture event. Keep B as your reset. Do not keep two ways to count accidentally. No extra forever loop is needed for this gesture-event example.",
    "manufacturer": false
  },
  "GESTURE-05": {
    "src": "assets/guides/GESTURE-05.webp",
    "width": 1608,
    "height": 659,
    "alt": "Show one slow gesture. Wait for the display before trying again. Try three separate gestures. Record the actual count. Then test the threshold warning and B reset. If counts are missed or repeated, ask for help. Physical behaviour is not verified here.",
    "manufacturer": true
  },
  "R01": {
    "src": "assets/guides/R01.webp",
    "width": 1784,
    "height": 644,
    "alt": "Use this when your Week 10 project is not already in My Projects. Choose Import beside My Projects. Your MakeCode program is a HEX file, not the lesson JSON. Keep your existing file. We will save a new Week 11 copy.",
    "manufacturer": false
  },
  "R02": {
    "src": "assets/guides/R02.webp",
    "width": 1414,
    "height": 664,
    "alt": "Use the option for a file saved on your computer. Choose Import File. Do not choose Import URL for your saved HEX. This is separate from loading a lesson backup JSON.",
    "manufacturer": false
  },
  "R03": {
    "src": "assets/guides/R03.webp",
    "width": 1366,
    "height": 664,
    "alt": "Find the saved counter in Downloads or your Computing folder. Select your HEX, then Go ahead! Check A adds one and B resets before making changes. Save the improved project with Week11 in its name.",
    "manufacturer": false
  },
  "SAVE": {
    "src": "assets/guides/SAVE.webp",
    "width": 1830,
    "height": 710,
    "alt": "Actual MakeCode guide: project name and saving the HEX to your computer.",
    "manufacturer": false
  },
  "H2": {
    "src": "assets/guides/H2.webp",
    "width": 1830,
    "height": 710,
    "alt": "Actual MakeCode guide: H2 open connect device",
    "manufacturer": false
  },
  "H3": {
    "src": "assets/guides/H3.webp",
    "width": 1830,
    "height": 710,
    "alt": "Actual MakeCode guide: H3 select the purple pair button",
    "manufacturer": false
  },
  "H4": {
    "src": "assets/guides/H4.webp",
    "width": 1830,
    "height": 710,
    "alt": "Actual MakeCode guide: H4 choose your micro bit then connect",
    "manufacturer": false
  },
  "H5": {
    "src": "assets/guides/H5.webp",
    "width": 1830,
    "height": 710,
    "alt": "Actual MakeCode guide: H5 download wait then test a and b",
    "manufacturer": false
  }
};
