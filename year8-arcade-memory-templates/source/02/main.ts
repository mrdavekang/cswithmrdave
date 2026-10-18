// STUDENT 1: Choose three directions. Use UP, RIGHT, DOWN or LEFT.
let route = ["UP", "UP", "UP"]
let answerIndex = 1
let correctDirection = ""

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    // STUDENT 2: Retrieve the clue at answerIndex, not a typed answer.
    correctDirection = ""
    memoryCrew.playRound(route, correctDirection, answerIndex, 900)
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // STUDENT 3: Replace only the second clue. A will play the updated list.
    route[1] = "UP"
    memoryCrew.updated(route)
})

// Prepared interface: leave this block in place.
memoryCrew.welcome()
