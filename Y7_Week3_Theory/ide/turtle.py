"""Classroom Turtle adapter for Skulpt, standard mode / degrees.
Python executes in a Worker. Drawing events are rendered by the lesson UI.
This is a documented subset, not Tkinter or the complete desktop turtle API.
"""
import math
from _lesson_bridge import emit as _emit

_turtles = []
_default = None
_background = 'white'
_color_mode = 1.0

def _number(n):
    if not isinstance(n, (int, float)):
        raise TypeError('Use a number for a coordinate, distance or angle.')
    if not math.isfinite(float(n)):
        raise ValueError('Use a finite number.')
    return float(n)

def _clean(n):
    return 0.0 if abs(n) < 0.000000001 else round(n, 8)

def _colour(args):
    if len(args) == 1 and isinstance(args[0], str):
        return args[0]
    if len(args) == 1 and isinstance(args[0], (tuple, list)):
        args = args[0]
    if len(args) == 3:
        values = [_number(v) for v in args]
        if any(v < 0 or v > _color_mode for v in values):
            raise ValueError('Colour components must be between 0 and the colour mode.')
        return 'rgb(%d, %d, %d)' % tuple(int(round(v * 255 / _color_mode)) for v in values)
    raise TypeError('Use a colour name, a hex colour, or an RGB tuple.')

class Turtle:
    def __init__(self, shape='classic', visible=True):
        if len(_turtles) >= 8:
            raise RuntimeError('Use no more than eight turtles in this classroom editor.')
        self._id = len(_turtles)
        _turtles.append(self)
        self._x = 0.0
        self._y = 0.0
        self._h = 0.0
        self._pen = True
        self._penc = 'black'
        self._fillc = 'black'
        self._width = 1.0
        self._visible = visible
        self._shape = shape
        self._speed = 3
        self._fill = None
        self.screen = Screen()
        self._send('new')

    def _state(self):
        return {'id': self._id, 'x': self._x, 'y': self._y, 'h': self._h,
                'pen': self._pen, 'color': self._penc, 'fill': self._fillc,
                'width': self._width, 'visible': self._visible, 'shape': self._shape}

    def _send(self, kind, data=None):
        _emit(self._state(), kind, data or {})

    def _move(self, x, y):
        x, y = _clean(_number(x)), _clean(_number(y))
        if abs(x) > 10000 or abs(y) > 10000:
            raise ValueError('Keep coordinates between -10000 and 10000 in this editor.')
        old = [self._x, self._y]
        self._x, self._y = x, y
        if self._fill is not None:
            self._fill.append([x, y])
        self._send('move', {'from': old, 'to': [x, y]})

    def goto(self, x, y=None):
        if y is None:
            if not isinstance(x, (tuple, list)) or len(x) != 2:
                raise TypeError('goto needs two coordinates: t.goto(x, y).')
            x, y = x
        self._move(x, y)
    setpos = setposition = goto

    def forward(self, distance):
        d = _number(distance)
        a = math.radians(self._h)
        self._move(self._x + d * math.cos(a), self._y + d * math.sin(a))
    fd = forward

    def backward(self, distance):
        self.forward(-_number(distance))
    back = bk = backward

    def left(self, angle):
        angle = _number(angle)
        self._h = _clean((self._h + angle) % 360)
        self._send('turn', {'angle': angle})
    lt = left

    def right(self, angle):
        angle = _number(angle)
        self._h = _clean((self._h - angle) % 360)
        self._send('turn', {'angle': -angle})
    rt = right

    def setheading(self, angle):
        self._h = _clean(_number(angle) % 360)
        self._send('turn')
    seth = setheading

    def setx(self, x):
        self._move(x, self._y)
    def sety(self, y):
        self._move(self._x, y)
    def home(self):
        self._move(0, 0)
        self.setheading(0)
    def position(self):
        return (self._x, self._y)
    pos = position
    def xcor(self):
        return self._x
    def ycor(self):
        return self._y
    def heading(self):
        return self._h
    def isdown(self):
        return self._pen
    def penup(self):
        self._pen = False
        self._send('pen')
    pu = up = penup
    def pendown(self):
        self._pen = True
        self._send('pen')
    pd = down = pendown
    def pensize(self, width=None):
        if width is None:
            return self._width
        width = _number(width)
        if width <= 0 or width > 40:
            raise ValueError('Use a pen width greater than 0 and no more than 40.')
        self._width = width
        self._send('style')
    width = pensize
    def pencolor(self, *args):
        if not args:
            return self._penc
        self._penc = _colour(args)
        self._send('style')
    def fillcolor(self, *args):
        if not args:
            return self._fillc
        self._fillc = _colour(args)
        self._send('style')
    def color(self, *args):
        if not args:
            return (self._penc, self._fillc)
        if len(args) == 2:
            self._penc, self._fillc = _colour((args[0],)), _colour((args[1],))
        else:
            self._penc = self._fillc = _colour(args)
        self._send('style')
    def begin_fill(self):
        self._fill = [[self._x, self._y]]
        self._send('begin_fill')
    def end_fill(self):
        if self._fill is not None:
            self._send('fill', {'points': self._fill})
            self._fill = None
    def filling(self):
        return self._fill is not None
    def circle(self, radius, extent=None, steps=None):
        r = _number(radius)
        extent = 360.0 if extent is None else _number(extent)
        if steps is not None and (not isinstance(steps, int) or steps < 1 or steps > 180):
            raise ValueError('circle steps must be a whole number from 1 to 180.')
        n = steps if steps is not None else max(1, min(180, int(math.ceil(abs(extent) / 6))))
        h = math.radians(self._h)
        sx, sy, sh = self._x, self._y, self._h
        cx, cy = sx - r * math.sin(h), sy + r * math.cos(h)
        sweep = extent if r >= 0 else -extent
        for i in range(1, n + 1):
            a = math.radians(sweep * i / n)
            self._h = _clean((sh + sweep * i / n) % 360)
            self._move(cx + (sx - cx) * math.cos(a) - (sy - cy) * math.sin(a),
                       cy + (sx - cx) * math.sin(a) + (sy - cy) * math.cos(a))
    def dot(self, size=None, *color):
        if isinstance(size, str):
            color, size = (size,), None
        d = max(self._width + 4, self._width * 2) if size is None else _number(size)
        if d <= 0 or d > 400:
            raise ValueError('Use a dot size from 1 to 400.')
        self._send('dot', {'size': d, 'color': _colour(color) if color else self._penc})
    def write(self, arg, move=False, align='left', font=('Arial', 10, 'normal')):
        if move:
            raise NotImplementedError('write(move=True) is not available. Use a separate movement command.')
        if align not in ('left', 'center', 'right'):
            raise ValueError('Use left, center or right for text alignment.')
        self._send('write', {'text': str(arg)[:250], 'align': align, 'font': list(font)})
    def speed(self, speed=None):
        if speed is None:
            return self._speed
        self._speed = speed
        # The lesson playback control sets the display speed; positions are unchanged.
    def shape(self, name=None):
        if name is None:
            return self._shape
        if name not in ('classic', 'arrow', 'turtle', 'circle', 'square', 'triangle', 'blank'):
            raise ValueError('Choose a built-in turtle shape; image shapes are not supported.')
        self._shape = name
        self._send('style')
    def hideturtle(self):
        self._visible = False
        self._send('style')
    ht = hideturtle
    def showturtle(self):
        self._visible = True
        self._send('style')
    st = showturtle
    def isvisible(self):
        return self._visible
    def clear(self):
        self._send('clear')
    def reset(self):
        self._x = self._y = self._h = 0.0
        self._pen = True
        self._penc = self._fillc = 'black'
        self._width = 1.0
        self._fill = None
        self._send('clear')
    def distance(self, x, y=None):
        if isinstance(x, Turtle):
            x, y = x.position()
        elif y is None:
            x, y = x
        return math.hypot(_number(x) - self._x, _number(y) - self._y)
    def towards(self, x, y=None):
        if isinstance(x, Turtle):
            x, y = x.position()
        elif y is None:
            x, y = x
        return math.degrees(math.atan2(_number(y) - self._y, _number(x) - self._x)) % 360
    def getturtle(self):
        return self
    getpen = getturtle
    def getscreen(self):
        return Screen()

class _Screen:
    def bgcolor(self, *args):
        global _background
        if not args:
            return _background
        _background = _colour(args)
        _emit({}, 'background', {'color': _background})
    def title(self, text):
        _emit({}, 'title', {'text': str(text)[:100]})
    def setup(self, *args, **kwargs):
        # The responsive lesson canvas owns the viewport size.
        pass
    def screensize(self, canvwidth=None, canvheight=None, bg=None):
        if bg is not None:
            self.bgcolor(bg)
        return (480, 400)
    def tracer(self, n=None, delay=None):
        return 1
    def update(self):
        pass
    def mainloop(self):
        pass
    def exitonclick(self):
        pass
    def colormode(self, mode=None):
        global _color_mode
        if mode is None:
            return _color_mode
        if mode not in (1.0, 255):
            raise ValueError('Colour mode must be 1.0 or 255.')
        _color_mode = mode
    def turtles(self):
        return list(_turtles)
    def clear(self):
        for t in _turtles:
            t.clear()
        self.bgcolor('white')
    def mode(self, mode=None):
        if mode not in (None, 'standard'):
            raise NotImplementedError('This classroom editor uses standard Turtle mode.')
        return 'standard'

_screen = _Screen()
def Screen():
    return _screen

def _default_turtle():
    global _default
    if _default is None:
        _default = Turtle()
    return _default

def _delegate(name):
    def fn(*args, **kwargs):
        return getattr(_default_turtle(), name)(*args, **kwargs)
    return fn

goto = _delegate('goto')
setpos = _delegate('setpos')
setposition = _delegate('setposition')
forward = _delegate('forward')
fd = _delegate('fd')
backward = _delegate('backward')
back = _delegate('back')
bk = _delegate('bk')
left = _delegate('left')
lt = _delegate('lt')
right = _delegate('right')
rt = _delegate('rt')
setheading = _delegate('setheading')
seth = _delegate('seth')
setx = _delegate('setx')
sety = _delegate('sety')
home = _delegate('home')
position = _delegate('position')
pos = _delegate('pos')
xcor = _delegate('xcor')
ycor = _delegate('ycor')
heading = _delegate('heading')
isdown = _delegate('isdown')
penup = _delegate('penup')
pu = _delegate('pu')
up = _delegate('up')
pendown = _delegate('pendown')
pd = _delegate('pd')
down = _delegate('down')
pensize = _delegate('pensize')
width = _delegate('width')
pencolor = _delegate('pencolor')
fillcolor = _delegate('fillcolor')
color = _delegate('color')
begin_fill = _delegate('begin_fill')
end_fill = _delegate('end_fill')
filling = _delegate('filling')
circle = _delegate('circle')
dot = _delegate('dot')
write = _delegate('write')
speed = _delegate('speed')
shape = _delegate('shape')
hideturtle = _delegate('hideturtle')
ht = _delegate('ht')
showturtle = _delegate('showturtle')
st = _delegate('st')
isvisible = _delegate('isvisible')
clear = _delegate('clear')
reset = _delegate('reset')
distance = _delegate('distance')
towards = _delegate('towards')
getturtle = _delegate('getturtle')
getpen = _delegate('getpen')
getscreen = _delegate('getscreen')

def done():
    pass
mainloop = done
bgcolor = _screen.bgcolor
setup = _screen.setup
title = _screen.title
tracer = _screen.tracer
update = _screen.update
colormode = _screen.colormode
clearscreen = _screen.clear
mode = _screen.mode
