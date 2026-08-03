# Skeleton Program for Oxford AQA International GCSE Computer Science Paper 1
# Developed using Python 3.10
# To be pre-released to centres
# Also available in C# and Visual Basic


import random

GRAPHICS = "\u0020\u2591\u2592\u2593\u2588"

def createImage(width, height):
    newImage = []
    for pixel in range(width * height):
        newImage.append(0)
    return newImage

def displayImage(width, height, image):
    for row in range(height):
        for col in range(width):
            print(GRAPHICS[image[row * width + col]], end="")
        print()

def loadImage():
    filename = input("Please enter the image name: ")
    filename = filename + ".txt"
    with open(filename) as f:
        width = int(f.readline())
        height = int(f.readline())
        newImage = createImage(width, height)
        for row in range(height):
            rowData = f.readline()
            for col in range(width):
                newImage[row * width + col] = int(rowData[col])
    return width, height, newImage

def darkenImage(image):
    for position in range(len(image)):
        image[position] = min(image[position] + 1, 4)
    return image

def lightenImage(image):
    for position in range(len(image)):
        image[position] = max(image[position] - 1, 0)
    return image

def stretchImage(width, height, image):
    factor = int(input("Please enter the stretch factor: "))
    newWidth = width * factor
    newHeight = height
    newImage = createImage(newWidth, newHeight)
    counter = 0
    for position in range(len(image)):
        for pixelRepeat in range(factor):
            newImage[counter] = image[position]
            counter += 1
    return newWidth, newHeight, newImage

def rleImage(width, height, image):
    current = image[0]
    count = 1
    for position in range(1, len(image)):
        item = image[position]
        if item != current:
            print(f"({count},{current})",end="")
            current = item
            count = 1
        else:
            count += 1
    print(f"({count},{current})")

def displayMenu():
    print()
    print("1..Load image")
    print("2..Display image")
    print("3..Run length encode image")
    print("4..Stretch image")
    print("5..Lighten image")
    print("6..Darken image")
    print("Q..Quit")
    print()

def main():
    image = []
    width = 0
    height = 0
    userChoice = ""
    while userChoice != "Q":
        displayMenu()
        userChoice = input("Please enter a choice: ").upper()
        match userChoice:
            case "1":
                width, height, image = loadImage()
            case "2":
                displayImage(width, height, image)
            case "3":
                rleImage(width, height, image)
            case "4":
                width, height, image = stretchImage(width, height, image)
            case "5":
                image = lightenImage(image)
            case "6":
                image = darkenImage(image)
            case "Q":
                message = random.randint(0,1)
                if message == 0:
                    print("Thanks for using this software")
                else:
                    print("Goodbye")
            case _:
                print()
                print("You did not enter a valid option")
    print("Press enter to continue")
    input()

if __name__ == "__main__":
    main()