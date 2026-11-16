# Working Session 2 review copy. Run this file in IDLE without editing it.

TARGET = 6
donations = [4, 6, 2, 9]
choice = ""

print("Book Donation Tracker")

while choice != "0":
    print("1 Display each amount")
    print("2 Replace the first amount")
    print("3 View the list")
    print("4 Donation report")
    print("5 Show first N records")
    print("0 Exit")
    choice = input("Choose an option: ")

    if choice == "1":
        for index in range(len(donations)):
            print("Index:", index, "Books:", donations[index])

    elif choice == "2":
        books = int(input("Books donated: "))
        if books >= 0 and books <= 20:
            donations[0] = books
            print("Accepted:", books)
        else:
            print("Amount not saved.")

    elif choice == "3":
        print("Amounts:", donations)

    elif choice == "4":
        print("Number of groups:", len(donations))

    elif choice == "5":
        requested = int(input("How many records? "))
        if requested >= 1 and requested <= len(donations):
            for index in range(requested):
                print("Index:", index, "Books:", donations[index])
        else:
            print("Count out of range.")

print("Finished.")
