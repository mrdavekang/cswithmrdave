// Use a new key for each revision that will collect a separate set of answers.
export const test = {
  key: "computing-pilot-v1",
  title: "Computing Test",
  demo: true,
  demoNames: ["Demo Student A", "Demo Student B", "Demo Student C"],
  description: "Try a sequencing question and a Python exercise. Use a sample name and leave personal details out of your answers.",
  questions: [
    {
      id: "order",
      type: "order",
      title: "Put the instructions in order",
      prompt: "Arrange the four steps so a program asks for a distance in kilometres and displays the distance in metres.",
      items: [
        { id: "display", label: "Display the result in metres" },
        { id: "ask", label: "Ask for the distance in kilometres" },
        { id: "multiply", label: "Multiply the number by 1,000" },
        { id: "convert", label: "Convert the input to a number" },
      ],
    },
    {
      id: "python",
      type: "python",
      title: "Complete the Python program",
      prompt: "Change the program so it prints the distance in metres. With a distance of 3 kilometres, it should print 3000.",
      starter: 'kilometres = int(input("Kilometres: "))\n\n# Calculate and print the distance in metres\n',
      sampleInput: "3",
    },
    {
      id: "explain",
      type: "text",
      title: "Explain your code",
      prompt: "Why does the starter code use int() around input()?",
    },
  ],
};
