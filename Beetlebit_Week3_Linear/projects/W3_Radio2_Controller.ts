input.onButtonPressed(Button.A, function () {
    radio.sendString("HELP")
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("SAFE")
})
radio.setGroup(23)
basic.showIcon(IconNames.Yes)
