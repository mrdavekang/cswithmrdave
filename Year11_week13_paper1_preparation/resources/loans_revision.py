# Equipment Loan Desk — Paper 1 revision
# Save your own copy before making any changes.

def TotalLateDays(LoanDays, DueDay):
    # Replace this temporary return with your calculation.
    return 0


# Put temporary print tests here, below the function.
# Remove the tests before checking the menu.


def DisplayMenu():
    print()
    print("EQUIPMENT LOAN DESK")
    print("1. Show loan records")
    print("Q. Quit")


def Main():
    LoanDays = [4, 7, 9, 12]
    DueDay = 7
    Choice = ""

    while Choice != "Q":
        DisplayMenu()
        Choice = input("Choose: ")

        if Choice == "1":
            print("Days kept:", LoanDays)
        elif Choice == "Q":
            print("Goodbye")


Main()
