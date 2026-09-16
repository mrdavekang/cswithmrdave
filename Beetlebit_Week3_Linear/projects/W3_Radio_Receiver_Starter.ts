radio.onReceivedString(function (receivedString) {
    if (receivedString == "HELP") {
        basic.showIcon(IconNames.Diamond)
    }
})
radio.setGroup(23)
basic.showIcon(IconNames.Yes)
