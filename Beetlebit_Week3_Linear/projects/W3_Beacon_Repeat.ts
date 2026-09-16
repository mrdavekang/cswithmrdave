input.onButtonPressed(Button.A, function () {
    for (let index = 0; index < 2; index++) {
        basic.showIcon(IconNames.Diamond)
        basic.pause(500)
        basic.clearScreen()
        basic.pause(500)
    }
    basic.showIcon(IconNames.Yes)
})
basic.showIcon(IconNames.Yes)
