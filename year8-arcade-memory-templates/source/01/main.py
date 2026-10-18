def on_b_pressed():
    # STUDENT 3: Replace only the second clue. A will play the updated list.
    # STUDENT 3: Replace only the second clue. A will play the updated list.
    route[1] = "LEFT"
    memoryCrew.updated(route)
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

def on_a_pressed():
    global correctDirection
    # STUDENT 2: Retrieve the clue at answerIndex, not a typed answer.
    correctDirection = route[answerIndex]
    memoryCrew.play_round(route, correctDirection, answerIndex, 900)
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

correctDirection = ""
answerIndex = 0
route: List[str] = []
# STUDENT 1: Choose three directions. Use UP, RIGHT, DOWN or LEFT.
route = ["UP", "RIGHT", "DOWN"]
answerIndex = 1
# Prepared interface: leave this block in place.
memoryCrew.welcome()