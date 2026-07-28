# Year 9 Computing - Term 1, Week 1
# Classroom Help Button - starter code
#
# Save this file as: Class_FullName_W1_HelpButton.py
# For example:       9T_DavidKang_W1_HelpButton.py
#
# Button A = I'M STUCK
# Button B = CHECK THIS

from microbit import *

display.show("?")

while True:
    if button_a.was_pressed():
        display.show(Image.CONFUSED)
        sleep(700)
        display.scroll("STUCK")
        display.clear()
    elif button_b.was_pressed():
        display.show(Image.HAPPY)
        sleep(700)
        display.scroll("CHECK?")
        display.clear()
