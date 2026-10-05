(function (root) {
  'use strict';
  const map = { width: 6, height: 5, start: [0, 4], key: [3, 2], portal: [5, 0],
    walls: new Set(['1,4', '1,3', '3,3', '2,1', '4,1', '4,3']) };
  const moves = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const names = { N: 'Up', E: 'Right', S: 'Down', W: 'Left' };
  const chinese = { N: '上', E: '右', S: '下', W: '左' };
  const arrows = { N: '↑', E: '→', S: '↓', W: '←' };
  const angles = { N: -90, E: 0, S: 90, W: 180 };

  function initial(commands) {
    return { commands: [...commands], position: [...map.start], direction: 'E', index: 0,
      trail: [[...map.start]], hasKey: false, finished: false, outcome: 'ready', collision: null,
      message: 'Robot ready at START. Add moves, then run your route.',
      messageZh: '机器人在起点准备好了。添加移动指令，再运行路线。' };
  }
  function advance(previous) {
    if (previous.finished || !previous.commands.length) return previous;
    const next = { ...previous, position: [...previous.position], trail: previous.trail.map(p => [...p]) };
    const command = next.commands[next.index], delta = moves[command];
    if (!delta) throw new Error('Unknown robot move');
    next.direction = command;
    next.index++;
    const x = next.position[0] + delta[0], y = next.position[1] + delta[1];
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
      next.finished = true; next.outcome = 'edge'; next.collision = [...next.position];
      next.message = `Move ${next.index} (${names[command]}) would leave the map. The robot stayed in its square. Change this move and try again.`;
      next.messageZh = `第 ${next.index} 步（向${chinese[command]}）会离开地图。机器人留在原来的一格。修改这一步，再试一次。`;
      return next;
    }
    if (map.walls.has(`${x},${y}`)) {
      next.finished = true; next.outcome = 'wall'; next.collision = [x, y];
      next.message = `Move ${next.index} (${names[command]}) hits a wall. The robot stayed in its square. Change this move and try again.`;
      next.messageZh = `第 ${next.index} 步（向${chinese[command]}）碰到墙。机器人留在原来的一格。修改这一步，再试一次。`;
      return next;
    }
    next.position = [x, y]; next.trail.push([x, y]);
    const collectedNow = !next.hasKey && x === map.key[0] && y === map.key[1];
    if (collectedNow) next.hasKey = true;
    next.message = collectedNow ? `Move ${next.index}: key collected! Keep going to the portal.` : `Move ${next.index}: the robot moved ${names[command].toLowerCase()} one square.`;
    next.messageZh = collectedNow ? `第 ${next.index} 步：拿到钥匙了！继续前往传送门。` : `第 ${next.index} 步：机器人向${chinese[command]}移动了一格。`;
    next.outcome = 'moving';
    if (x === map.portal[0] && y === map.portal[1]) {
      next.finished = true; next.outcome = next.hasKey ? 'success' : 'locked';
      next.message = next.hasKey ? 'You did it! The key opened the portal. The robot finished its mission.' : 'The portal is still locked. Your robot must collect the key first. Change the route and try again.';
      next.messageZh = next.hasKey ? '成功了！钥匙打开了传送门。机器人完成了任务。' : '传送门还锁着。机器人必须先拿到钥匙。修改路线，再试一次。';
    } else if (next.index === next.commands.length) {
      next.finished = true; next.outcome = 'short';
      next.message = next.hasKey ? 'Your moves have ended. The robot has the key, but still needs to reach the portal. Add more moves.' : 'Your moves have ended before the robot collected the key. Add more moves.';
      next.messageZh = next.hasKey ? '指令用完了。机器人已拿到钥匙，但还没有到达传送门。请添加移动指令。' : '指令用完了，机器人还没有拿到钥匙。请添加移动指令。';
    }
    return next;
  }
  function simulate(commands) {
    let frame = initial(commands);
    while (!frame.finished && frame.index < commands.length) frame = advance(frame);
    return frame;
  }
  const api = { map, moves, names, chinese, arrows, angles, initial, advance, simulate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RobotRoute = api;
})(typeof window !== 'undefined' ? window : globalThis);
