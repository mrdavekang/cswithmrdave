// Virtual BEETLE:BIT controller for Microsoft MakeCode
let gripClosed = false
let neutralRoll = 0
let neutralPitch = 0

input.onButtonPressed(Button.A, function () {
    gripClosed = !gripClosed
    serial.writeValue("grip", gripClosed ? 1 : 0)
})

input.onButtonPressed(Button.B, function () {
    serial.writeValue("reset", 1)
})

input.onButtonPressed(Button.AB, function () {
    neutralRoll = input.rotation(Rotation.Roll)
    neutralPitch = input.rotation(Rotation.Pitch)
    serial.writeValue("calibrate", 1)
    basic.showIcon(IconNames.Yes)
})

input.onGesture(Gesture.Shake, function () {
    serial.writeValue("boost", 1)
})

serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate115200)
basic.showIcon(IconNames.Happy)

basic.forever(function () {
    let roll = input.rotation(Rotation.Roll) - neutralRoll
    let pitch = input.rotation(Rotation.Pitch) - neutralPitch
    let steer = Math.constrain(Math.map(roll, -45, 45, -100, 100), -100, 100)
    let drive = Math.constrain(Math.map(pitch, -45, 45, 100, -100), -100, 100)
    if (Math.abs(steer) < 10) steer = 0
    if (Math.abs(drive) < 10) drive = 0
    serial.writeValue("steer", steer)
    serial.writeValue("drive", drive)
    // Repeat the gripper state so a single missed button message self-corrects.
    serial.writeValue("grip", gripClosed ? 1 : 0)
    basic.pause(50)
})
