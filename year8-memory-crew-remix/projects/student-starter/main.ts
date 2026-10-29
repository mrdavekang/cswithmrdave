let route = ["UP", "RIGHT", "DOWN"]
let directions = ["UP", "RIGHT", "DOWN", "LEFT"]
let answerIndex = 1
let correctDirection = ""
let clueMs = 900
let pointsPerWin = 1

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    // EDIT 1: Choose a valid random index. Then read that stored clue.
    answerIndex = 1
    correctDirection = route[answerIndex]
    memoryCrew.playRound(route, correctDirection, answerIndex, clueMs)
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    // EDIT 2: Build a fresh route. Keep the display call last.
    route = ["UP", "RIGHT", "DOWN"]
    memoryCrew.updated(route)
})

// Keep both prepared setup blocks.
memoryCrew.setWinReward(pointsPerWin)
memoryCrew.welcome()
