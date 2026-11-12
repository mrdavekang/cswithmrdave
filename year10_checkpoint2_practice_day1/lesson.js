window.LESSON = {
  "title": "Read the Book Donation Tracker",
  "wagba": "Trace a program one step at a time and use the code to explain what happened.",
  "ksu": [
    ["Knowledge", "Tell a menu choice, a list index and a stored value apart."],
    ["Skills", "Follow a menu choice to its branch, predict the result and check it in IDLE."],
    ["Understanding", "Use a line of code to explain why something changed or stayed the same."]
  ],
  "keywords": "Skeleton program, menu choice, branch, index, value, source code, screen capture",
  "challenge": "Point to the line that explains why one value changed and another stayed the same.",
  "traceSequence": "Choose 2, enter 7, then choose 1.",
  "extracts": {
    "list": "donations = [4, 6, 2, 9]",
    "predict": "    elif choice == \"3\":\n        print(\"Amounts:\", donations)",
    "investigate": "    elif choice == \"2\":\n        books = int(input(\"Books donated: \"))\n        if books >= 0 and books <= 20:\n            donations[0] = books",
    "display": "    if choice == \"1\":\n        for index in range(len(donations)):\n            print(\"Index:\", index, \"Books:\", donations[index])",
    "stretch": "boxes = [8, 3, 5]",
    "exit": "boxes = [9, 4]"
  },
  "prompts": {
    "now": ["Do Now", "Find the first value in donations. What is its index and what value is stored there?", "In a Python list, the first index is 0.", "", "Index: ___   Value: ___"],
    "types": ["Types of Learning", "Choose one focus for today. What did the Do Now tell you about what you need to practise?", "Knowledge: tell index from value. Skills: follow a choice to its branch. Understanding: explain a result using a line of code.", "I will practise ___ because in the Do Now I ___.", "My focus and reason: ___"],
    "prediction": ["01.1 Prediction", "Before you run the skeleton, predict the one line option 3 will display. Write it as you expect to see it in the Shell.", "Find the print line under choice == \"3\". Look back at the starting list.", "", "My prediction: ___"],
    "check": ["01.2 Check your prediction", "What actually appeared? Which line produced the output, and where did it get the values it displayed?", "Look at the indented print line and the name it uses.", "The program displays ___ because the print line uses ___.", "Actual output: ___\nMy explanation: ___"],
    "trace": ["02.1 Trace", "Start from the original list. Complete the value-after entry for index 1 before you run the sequence.", "A list index is a position, not the number stored at that position.", "", "Index 0: before 4, after 7 (worked row).\nIndex 1: before 6, after ___"],
    "explain": ["02.2 Explain your trace", "After entering 7, did the value at index 1 change? Use the assignment line to explain what you saw.", "Look at the number in square brackets on the assignment line.", "Index 1 ___ because the assignment writes to index ___.", "My explanation: ___"],
    "source": ["03.1 Program source code", "Paste the whole amended option 1 branch from the IDLE Editor. Include its opening if line and the indented lines underneath it. Stop before the next elif.", "Keep the spaces at the start of the lines. Paste as text, not as an image.", "", "[Paste your amended branch here.]"],
    "capture": ["03.2 Screen capture", "Run your edited copy and choose 1. Paste one readable capture from the IDLE Shell showing the menu choice you entered and the output with your new label.", "Capture the relevant prompt and output together. Check they can be read at normal size.", "", "[Replace this line with your IDLE Shell capture.]"],
    "modifyReflection": ["Modify Reflection", "Why did the output label change but the donation values stay the same? Point to the part of the line you edited.", "Compare the text inside quotation marks with the expression that gets a donation value.", "I changed ___. The values stayed the same because ___.", "My explanation: ___"],
    "extension": ["Extension Make", "In a new IDLE file, make a small shelf tracker. Start with boxes = [8, 3, 5] and display each shelf index and its box count. Predict what happens if the list becomes [8, 3], then check.", "Reuse the indexed loop pattern from option 1. Use boxes as the list name.", "", "My code: ___\nWhat changed when the list got shorter: ___"],
    "pit": ["Learning Pit Stop", "Which phase describes your work on today’s focus? Name one answer that supports your choice and one step you can try next.", "New Learning: I’m working out a new idea. Consolidating: I’m getting steadier with it. Treading Water: I can do this comfortably and need a stretch. Drowning: I’m stuck and need support.", "My phase is ___ for ___. In answer ___ I ___. Next I’ll try ___.", "My phase, evidence and next step: ___"],
    "plenary": ["Plenary", "With boxes = [9, 4], what does boxes[1] return? How do you know? Try this independently before you use a cue.", "", "", "My value and explanation: ___"]
  },
  "demos": {
    "display": {
      "title": "Display a list of shelf labels",
      "source": "shelves = [\"Art\", \"Science\"]\nprint(\"Shelves:\", shelves)",
      "note": "Notice how print displays the label and the current list on one line."
    },
    "update": {
      "title": "Replace the box count at one index",
      "source": "boxes = [3, 8, 5]\nboxes[2] = 10\nprint(\"Boxes:\", boxes)",
      "note": "Compare the output with the starting list. The assignment writes to index 2; the other positions are unchanged."
    }
  }
};
