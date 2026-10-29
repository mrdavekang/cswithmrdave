def on_a_pressed():
    global answerIndex, correctDirection
    # EDIT 1: Pick a valid random index, then read its clue.
    answerIndex = randint(0, len(route) - 1)
    correctDirection = route[answerIndex]
    memoryCrew.play_round(route, correctDirection, answerIndex, clueMs)
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_b_pressed():
    global route
    # EDIT 2: Build a fresh route. Keep the display call last.
    route = []
    while len(route) < 4:
        route.append(directions._pick_random())
    memoryCrew.updated(route)
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

route = ["UP", "RIGHT", "DOWN"]
directions = ["UP", "RIGHT", "DOWN", "LEFT"]
answerIndex = 1
correctDirection = ""
clueMs = 900
pointsPerWin = 1
memoryCrew.set_win_reward(pointsPerWin)
memoryCrew.welcome()
