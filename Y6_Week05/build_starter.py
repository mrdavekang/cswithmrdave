"""Package a small Scratch 3 starter using the existing Year 6 Explorer sprite.

Run only when the supplied .sb3 needs to be regenerated. The delivered website
already includes the generated Scratch project.
"""
from pathlib import Path
from copy import deepcopy
import hashlib
import json
import zipfile

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / 'Y6_Week03/assets/scratch/Year6_T1W3_Coordinate_Quest_Starter.sb3'
if not BASE.exists():
    BASE = Path('/Users/tenbywork/Documents/GitHub/cswithmrdave/Y6_Week03/assets/scratch/Year6_T1W3_Coordinate_Quest_Starter.sb3')
OUT = HERE / 'assets/Year6_T1W5_Choose_and_Repeat_Starter.sb3'
svg = (HERE / 'assets/museum-stage.svg').read_bytes()
asset = hashlib.md5(svg).hexdigest()

with zipfile.ZipFile(BASE) as source:
    project = json.loads(source.read('project.json'))
    explorer = deepcopy(next(t for t in project['targets'] if t['name'] == 'Explorer'))
    sprite_asset = explorer['costumes'][0]['md5ext']
    sprite_svg = source.read(sprite_asset)

stage = deepcopy(next(t for t in project['targets'] if t['isStage']))
stage['name'] = 'Stage'
stage['costumes'] = [{
    'name': 'Glitch Museum - two routes', 'bitmapResolution': 1,
    'dataFormat': 'svg', 'assetId': asset, 'md5ext': asset + '.svg',
    'rotationCenterX': 240, 'rotationCenterY': 180
}]
stage['currentCostume'] = 0
explorer['x'], explorer['y'], explorer['size'] = 0, -105, 75
explorer['blocks']['start_event']['next'] = 'show_on_start'
explorer['blocks']['show_on_start'] = {
    'opcode': 'looks_show', 'next': 'reset_position', 'parent': 'start_event',
    'inputs': {}, 'fields': {}, 'shadow': False, 'topLevel': False
}
explorer['blocks']['reset_position']['parent'] = 'show_on_start'
explorer['blocks']['reset_position']['inputs']['X'] = [1, [4, '0']]
explorer['blocks']['reset_position']['inputs']['Y'] = [1, [4, '-105']]
explorer['blocks']['starter_message']['inputs']['MESSAGE'] = [1, [10, 'Help the visitor choose left or right!']]
explorer['comments'] = {}
project['targets'] = [stage, explorer]
project['monitors'] = []

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as result:
    result.writestr('project.json', json.dumps(project, separators=(',', ':')))
    result.writestr(asset + '.svg', svg)
    result.writestr(sprite_asset, sprite_svg)
print(OUT)
