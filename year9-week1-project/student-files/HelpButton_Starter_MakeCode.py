def on_button_pressed_a():
    basic.show_icon(IconNames.CONFUSED)
    basic.pause(700)
    basic.show_string("STUCK")
    basic.show_icon(IconNames.HAPPY)


input.on_button_pressed(Button.A, on_button_pressed_a)


def on_button_pressed_b():
    basic.show_icon(IconNames.YES)
    basic.pause(700)
    basic.show_string("CHECK")
    basic.show_icon(IconNames.HAPPY)


input.on_button_pressed(Button.B, on_button_pressed_b)

basic.show_icon(IconNames.HAPPY)
