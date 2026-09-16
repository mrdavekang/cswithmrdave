radio.onReceivedString(function (receivedString) {
    if (receivedString == "HELP") {
        basic.showIcon(IconNames.Diamond)
        basic.pause(500)
        basic.clearScreen()
        basic.pause(500)
        basic.showIcon(IconNames.Diamond)
        basic.pause(500)
        basic.clearScreen()
        basic.pause(500)
        basic.showIcon(IconNames.Yes)
    } else if (receivedString == "SAFE") {
        basic.showIcon(IconNames.Heart)
    }
})
radio.setGroup(23)
basic.showIcon(IconNames.Yes)
