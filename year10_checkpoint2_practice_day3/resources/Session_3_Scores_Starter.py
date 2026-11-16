# Session 3 independent practice. Save your own copy before editing.
scores = [8, 15, 6, 11]
choice = ""

print("Scores Practice")

while choice != "0":
    print("1 View all scores")
    print("3 Look up one score")
    print("0 Exit")
    choice = input("Choose an option: ")

    if choice == "1":
        print("Scores:", scores)

    elif choice == "3":
        index = int(input("Which score index? "))
        print("Practice placeholder")

print("Finished.")
