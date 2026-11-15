# Year 10 Session 2 practice copy. The released skeleton is unchanged.
# Use File > Save As before amending option 5.

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
        print("Practice placeholder")

print("Finished.")
