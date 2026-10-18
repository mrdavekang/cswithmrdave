/** Prepared game interface. Students edit main.ts / main.py / Blocks, not this file. */
//% color=#087f8c weight=90 icon="\uf135" block="Memory Crew"
namespace memoryCrew {
    let busy = false
    let waiting = false
    let expected = ""
    let wins = 0
    let registered = false
    let board: Image = null

    function base(title: string) {
        board = image.create(160, 120)
        board.fill(15)
        for (let star = 0; star < 22; star++) {
            board.setPixel((star * 37 + 13) % 160, (star * 19 + 23) % 120, 11)
        }
        board.fillRect(0, 0, 160, 16, 8)
        board.print("MEMORY CREW", 6, 4, 9)
        board.print("W:" + wins, 130, 4, 7)
        board.fillRect(6, 20, 148, 80, 8)
        board.drawRect(6, 20, 148, 80, 9)
        board.print(title, 12, 25, 5)
        scene.setBackgroundImage(board)
    }

    function arrow(direction: string, x: number, y: number, colour: number) {
        if (direction == "UP") {
            board.fillRect(x - 3, y - 3, 7, 18, colour)
            board.fillTriangle(x - 12, y - 2, x + 12, y - 2, x, y - 15, colour)
        } else if (direction == "DOWN") {
            board.fillRect(x - 3, y - 15, 7, 18, colour)
            board.fillTriangle(x - 12, y + 2, x + 12, y + 2, x, y + 15, colour)
        } else if (direction == "LEFT") {
            board.fillRect(x - 3, y - 3, 18, 7, colour)
            board.fillTriangle(x - 2, y - 12, x - 2, y + 12, x - 15, y, colour)
        } else if (direction == "RIGHT") {
            board.fillRect(x - 15, y - 3, 18, 7, colour)
            board.fillTriangle(x + 2, y - 12, x + 2, y + 12, x + 15, y, colour)
        }
    }

    function crew(x: number, y: number) {
        board.drawImage(img`
            . . . . f f f f f . . . . .
            . . . f 6 6 6 6 6 f . . . .
            . . f 6 6 6 6 6 6 6 f . . .
            . . f 6 6 9 9 9 9 9 9 f . .
            . . f 6 9 1 1 9 9 9 9 f . .
            . f f 6 9 9 9 9 9 9 9 f . .
            f 6 f 6 6 f f f f f f . . .
            f 6 f 6 6 6 6 6 6 6 f . . .
            f 6 f 6 6 6 6 6 6 6 f . . .
            f 6 f 6 6 6 6 6 6 6 f . . .
            . f f 6 6 6 6 6 6 6 f . . .
            . . f 6 6 6 f 6 6 6 f . . .
            . . f 6 6 f . f 6 6 f . . .
            . . f f f . . . f f f . . .
        `, x, y)
    }

    function valid(direction: string): boolean {
        return direction == "UP" || direction == "RIGHT" || direction == "DOWN" || direction == "LEFT"
    }

    function setup(line1: string, line2: string, line3: string) {
        base("ENGINEER CHECK")
        board.print(line1, 13, 43, 1)
        board.print(line2, 13, 56, 1)
        board.print(line3, 13, 69, 1)
        crew(126, 78)
        board.print("Edit code, restart.", 10, 106, 9)
    }

    function answer(direction: string) {
        if (!waiting || busy) return
        waiting = false
        if (direction == expected) {
            wins += 1
            base("ROUTE RECOVERED!")
            board.print("Correct - nice memory!", 12, 44, 7)
        } else {
            base("TRY ANOTHER ROUND")
            board.print("Not this time.", 12, 44, 4)
        }
        board.print("You chose: " + direction, 12, 59, 1)
        board.print("Stored clue: " + expected, 12, 73, 9)
        crew(126, 81)
        board.print("A: replay B: upgrade", 10, 106, 1)
    }

    /** Prepared welcome screen and keyboard/touch answer controls. */
    //% blockId=memory_crew_welcome block="show Memory Crew welcome" weight=100
    export function welcome() {
        if (!registered) {
            registered = true
            controller.up.onEvent(ControllerButtonEvent.Pressed, function () { answer("UP") })
            controller.right.onEvent(ControllerButtonEvent.Pressed, function () { answer("RIGHT") })
            controller.down.onEvent(ControllerButtonEvent.Pressed, function () { answer("DOWN") })
            controller.left.onEvent(ControllerButtonEvent.Pressed, function () { answer("LEFT") })
        }
        base("REPAIR THE NAV")
        board.print("Watch the clues.", 12, 43, 1)
        board.print("Remember their order.", 12, 56, 1)
        board.print("A: play  B: upgrade", 12, 73, 9)
        crew(126, 81)
        board.print("Use arrows to answer.", 10, 106, 1)
    }

    /** Display and hide the list; check the answer supplied by the student's code. */
    //% blockId=memory_crew_round block="play route $route answer $correctDirection index $answerIndex clue ms $clueMs" weight=90
    //% clueMs.defl=900 clueMs.min=300 clueMs.max=3000
    //% inlineInputMode=external
    export function playRound(route: string[], correctDirection: string, answerIndex: number, clueMs: number) {
        if (busy) return
        waiting = false
        if (route.length < 3 || route.length > 5) {
            setup("Use 3 to 5 clues.", "Edit the route list.", "Then restart the game.")
            return
        }
        for (let clue of route) {
            if (!valid(clue)) {
                setup("Directions must be:", "UP RIGHT DOWN LEFT", "Use CAPITAL letters.")
                return
            }
        }
        if (answerIndex < 0 || answerIndex >= route.length || answerIndex != Math.floor(answerIndex)) {
            setup("Index outside list.", "First index is 0.", "Check answerIndex.")
            return
        }
        busy = true
        base("READY, CREW?")
        board.print("Watch all " + route.length + " clues.", 12, 54, 1)
        pause(650)
        let step = 0
        while (step < route.length) {
            base("CLUE " + (step + 1) + " OF " + route.length)
            arrow(route[step], 80, 59, 5)
            board.print(route[step], 67, 83, 1)
            board.print("LOOK - remember order", 10, 106, 9)
            pause(Math.max(300, Math.min(3000, clueMs)))
            base("NEXT CLUE...")
            pause(250)
            step += 1
        }
        busy = false
        if (!valid(correctDirection)) {
            setup("Finish A button code.", "Replace empty text", "with list get value.")
            return
        }
        if (correctDirection != route[answerIndex]) {
            setup("Answer code mismatch.", "Read the route list", "at answerIndex.")
            return
        }
        expected = correctDirection
        base("YOUR TURN")
        board.print("Which was clue " + (answerIndex + 1) + "?", 12, 44, 1)
        board.print("Press its direction.", 12, 59, 9)
        board.print("UP RIGHT DOWN LEFT", 12, 79, 1)
        board.print("A: replay the clues", 10, 106, 1)
        waiting = true
    }

    /** Show the changed route before the next round, without resetting it. */
    //% blockId=memory_crew_updated block="show upgraded route $route" weight=80
    export function updated(route: string[]) {
        if (busy) return
        waiting = false
        base("ROUTE UPDATED")
        for (let item = 0; item < route.length; item++) {
            board.print("Index " + item + ": " + route[item], 14, 41 + item * 10, 1)
        }
        board.print("A: play the new route", 10, 106, 9)
    }
}
