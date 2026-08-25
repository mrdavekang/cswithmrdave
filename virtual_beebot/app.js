'use strict'

const WORLD = { width: 1000, height: 620 }
const ROUND_SECONDS = 60
const obstacles = [
  { x: 270, y: 405, w: 160, h: 76 },
  { x: 605, y: 110, w: 82, h: 180 }
]

const el = id => document.getElementById(id)
const canvas = el('arena')
const ctx = canvas.getContext('2d')

const controls = { drive: 0, steer: 0, keyboardDrive: 0, keyboardSteer: 0 }
let robot, crate, phase, startedAt, lastFrame, lastCollision, score, reader

function newRobot() {
  return { x: 110, y: 316, angle: 0, speed: 0, carrying: false, gripClosed: false, collisions: 0, boostUntil: 0 }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function easyAxis(value) {
  const safe = clamp(value, -100, 100)
  const magnitude = Math.abs(safe)
  if (magnitude < 16) return 0
  const normalized = (magnitude - 16) / 84
  return Math.sign(safe) * Math.round(Math.pow(normalized, 1.45) * 62)
}

function setMessage(text) {
  el('message').textContent = text
}

function setPhase(next) {
  phase = next
  el('phase').textContent = next === 'ready' ? 'READY' : next === 'running' ? 'MISSION LIVE' : next === 'success' ? 'COMPLETE' : 'TIME UP'
  el('phase').className = `phase-pill ${next}`
}

function resetGame() {
  robot = newRobot()
  crate = { x: 500, y: 332 }
  Object.assign(controls, { drive: 0, steer: 0, keyboardDrive: 0, keyboardSteer: 0 })
  startedAt = 0
  score = 0
  el('time').textContent = ROUND_SECONDS
  el('score').textContent = '0'
  el('result').hidden = true
  setMessage('Collect the cube and deliver it to the green zone.')
  setPhase('ready')
}

function startIfNeeded() {
  if (phase === 'ready') {
    startedAt = performance.now()
    setPhase('running')
    setMessage('Find the energy cube.')
  }
}

function finish(success) {
  robot.speed = 0
  el('result').hidden = false
  if (success) {
    const remaining = Math.max(0, ROUND_SECONDS - (performance.now() - startedAt) / 1000)
    score = Math.max(0, 100 + Math.round(remaining * 2) - robot.collisions * 5)
    const previous = Number(localStorage.getItem('virtual-beetlebit-best') || 0)
    if (score > previous) {
      localStorage.setItem('virtual-beetlebit-best', String(score))
      el('best').textContent = score
    }
    el('score').textContent = score
    el('resultLabel').textContent = 'MISSION COMPLETE'
    el('resultScore').textContent = `${score} POINTS`
    el('resultText').textContent = 'The energy cube reached the delivery zone.'
    setMessage('Mission complete — brilliant robot control!')
    setPhase('success')
  } else {
    el('resultLabel').textContent = 'ROUND ENDED'
    el('resultScore').textContent = 'TRY AGAIN'
    el('resultText').textContent = 'Use a smoother route and watch the barriers.'
    setMessage('Time is up. Reset and try a quicker route!')
    setPhase('timeout')
  }
}

function toggleGrip() {
  if (phase === 'success' || phase === 'timeout') return
  startIfNeeded()
  robot.gripClosed = !robot.gripClosed
  const frontX = robot.x + Math.cos(robot.angle) * 74
  const frontY = robot.y + Math.sin(robot.angle) * 74

  if (robot.gripClosed && !robot.carrying) {
    if (Math.hypot(crate.x - frontX, crate.y - frontY) < 55) {
      robot.carrying = true
      setMessage('Cube secured! Take it to the delivery zone.')
    } else {
      setMessage('Move the open gripper closer to the cube.')
    }
  } else if (!robot.gripClosed && robot.carrying) {
    robot.carrying = false
    if (crate.x > 830 && crate.y > 75 && crate.y < 555) finish(true)
    else setMessage('Cube released. Pick it up again when ready.')
  }
}

function handleSerialMessage(line) {
  const [name, raw] = line.split(':')
  const value = Number(raw)
  if (!Number.isFinite(value)) return
  if (name === 'drive') {
    const next = easyAxis(value)
    controls.drive = next === 0 ? 0 : controls.drive * 0.65 + next * 0.35
  }
  if (name === 'steer') {
    const next = easyAxis(value)
    controls.steer = next === 0 ? 0 : controls.steer * 0.65 + next * 0.35
  }
  if (name === 'grip' && (value === 1) !== robot.gripClosed) toggleGrip()
  if (name === 'reset' && value === 1) resetGame()
  if (name === 'boost' && value === 1) {
    robot.boostUntil = performance.now() + 850
    startIfNeeded()
  }
  if (name === 'calibrate' && value === 1) setMessage('Easy controls calibrated. Use small, gentle tilts.')
}

async function readSerial(port) {
  if (!port.readable) return
  reader = port.readable.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    while (true) {
      const result = await reader.read()
      if (result.done) break
      buffer += decoder.decode(result.value, { stream: true })
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() || ''
      lines.forEach(line => handleSerialMessage(line.trim()))
    }
  } catch (_) {
    setMessage('The micro:bit was disconnected. Keyboard controls still work.')
  } finally {
    try { reader.releaseLock() } catch (_) {}
    reader = null
    el('statusDot').className = 'status-dot'
    el('connectText').textContent = 'Reconnect micro:bit'
    el('connectButton').disabled = false
    el('controllerStatus').textContent = 'Keyboard demo mode'
  }
}

async function connectMicrobit() {
  if (!navigator.serial) {
    el('statusDot').className = 'status-dot unsupported'
    setMessage('Use Chrome or Edge, or continue with the keyboard controls.')
    return
  }
  try {
    el('connectButton').disabled = true
    el('connectText').textContent = 'Connecting…'
    const port = await navigator.serial.requestPort()
    await port.open({ baudRate: 115200 })
    el('statusDot').className = 'status-dot connected'
    el('connectText').textContent = 'micro:bit connected'
    el('controllerStatus').textContent = 'Easy controller active'
    setMessage('micro:bit connected. Hold it level and press A+B.')
    readSerial(port)
  } catch (error) {
    el('connectButton').disabled = false
    el('connectText').textContent = 'Connect micro:bit'
    setMessage(error && error.name === 'NotFoundError' ? 'No device selected. Try again or use the keyboard.' : 'Could not connect. Check the USB data cable and try again.')
  }
}

function roundedRect(x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function drawCrate() {
  ctx.save(); ctx.translate(crate.x, crate.y)
  ctx.shadowColor = 'rgba(43,27,9,.22)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6
  ctx.fillStyle = '#e4862c'; roundedRect(-21, -21, 42, 42, 8); ctx.fill()
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#813a16'; ctx.lineWidth = 4; ctx.stroke()
  ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-11, -11); ctx.lineTo(11, 11); ctx.moveTo(11, -11); ctx.lineTo(-11, 11); ctx.stroke(); ctx.restore()
}

function drawRobot(now) {
  ctx.save(); ctx.translate(robot.x, robot.y); ctx.rotate(robot.angle)
  ctx.shadowColor = 'rgba(24,33,37,.22)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8
  ctx.fillStyle = '#1f2933'; roundedRect(-38, -36, 76, 72, 18); ctx.fill()
  ctx.shadowColor = 'transparent'; ctx.fillStyle = '#f7bd24'; roundedRect(-31, -31, 62, 62, 14); ctx.fill()
  ctx.fillStyle = '#ffd967'; roundedRect(-19, -22, 38, 44, 9); ctx.fill()
  ctx.fillStyle = '#1b2830'; [[-43,-31],[-43,7],[31,-31],[31,7]].forEach(([x,y]) => { roundedRect(x,y,12,24,5); ctx.fill() })
  ctx.fillStyle = '#0e6d78'; ctx.beginPath(); ctx.arc(-9,-5,4,0,Math.PI*2); ctx.arc(-9,8,4,0,Math.PI*2); ctx.fill()
  ctx.fillStyle = '#eafcff'; ctx.fillRect(3,-12,14,4); ctx.fillRect(8,-17,4,14)
  const jaw = robot.gripClosed ? 12 : 24
  ctx.strokeStyle = '#19343a'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(30,-17); ctx.lineTo(55,-jaw); ctx.lineTo(70,-jaw); ctx.moveTo(30,17); ctx.lineTo(55,jaw); ctx.lineTo(70,jaw); ctx.stroke()
  ctx.strokeStyle = '#f7bd24'; ctx.lineWidth = 4; ctx.stroke()
  if (robot.boostUntil > now) { ctx.fillStyle='#ef4f45';ctx.beginPath();ctx.moveTo(-42,-12);ctx.lineTo(-68-Math.random()*9,0);ctx.lineTo(-42,12);ctx.closePath();ctx.fill() }
  ctx.restore()
}

function drawArena(now) {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height)
  const floor = ctx.createLinearGradient(0,0,0,WORLD.height); floor.addColorStop(0,'#eef5eb'); floor.addColorStop(1,'#dce9d8'); ctx.fillStyle=floor; ctx.fillRect(0,0,WORLD.width,WORLD.height)
  ctx.strokeStyle='rgba(51,91,76,.09)';ctx.lineWidth=1
  for(let x=0;x<WORLD.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD.height);ctx.stroke()}
  for(let y=0;y<WORLD.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.width,y);ctx.stroke()}
  ctx.fillStyle='#f9fbf5';roundedRect(42,44,916,532,34);ctx.fill();ctx.strokeStyle='#2a5960';ctx.lineWidth=8;ctx.setLineDash([16,12]);ctx.stroke();ctx.setLineDash([])
  ctx.fillStyle='#e8f1ed';roundedRect(62,92,150,448,24);ctx.fill();ctx.fillStyle='#315f65';ctx.font='700 18px system-ui';ctx.textAlign='center';ctx.fillText('START BAY',137,125)
  const pulse=phase==='success'?.5+Math.sin(now/120)*.2:.16;ctx.fillStyle=`rgba(29,151,113,${pulse})`;roundedRect(842,92,100,448,24);ctx.fill();ctx.strokeStyle='#15966f';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#0b6d50';ctx.font='800 17px system-ui';ctx.save();ctx.translate(892,316);ctx.rotate(-Math.PI/2);ctx.fillText('DELIVERY ZONE',0,6);ctx.restore()
  obstacles.forEach((item,index)=>{ctx.fillStyle=index%2?'#dbe3dd':'#e4e9e3';roundedRect(item.x,item.y,item.w,item.h,15);ctx.fill();ctx.strokeStyle='#aab7ae';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#6f8176';ctx.font='800 15px system-ui';ctx.fillText('BARRIER',item.x+item.w/2,item.y+item.h/2+5)})
  if(!robot.carrying)drawCrate();drawRobot(now);if(robot.carrying)drawCrate()
  if(phase==='ready'){ctx.fillStyle='rgba(10,35,38,.72)';roundedRect(330,252,340,116,22);ctx.fill();ctx.fillStyle='#fff';ctx.font='800 25px system-ui';ctx.fillText('TILT OR PRESS ↑ TO START',500,301);ctx.font='500 16px system-ui';ctx.fillText('Collect the energy cube. Deliver it to the green zone.',500,334)}
}

function updateMeters(drive, steer) {
  el('driveValue').textContent = Math.round(drive)
  el('steerValue').textContent = Math.round(steer)
  el('driveMeter').style.width = `${Math.abs(drive)}%`
  el('steerMeter').style.width = `${Math.abs(steer)}%`
}

function frame(now) {
  const dt = Math.min(0.04, Math.max(0, (now - (lastFrame || now)) / 1000))
  lastFrame = now
  const drive = controls.keyboardDrive || controls.drive
  const steer = controls.keyboardSteer || controls.steer
  if (phase === 'ready' && Math.abs(drive) > 12) startIfNeeded()
  if (phase === 'running') {
    const target = (drive / 100) * 175 * (robot.boostUntil > now ? 1.45 : 1)
    robot.speed += (target - robot.speed) * Math.min(1, dt * 7)
    const direction = robot.speed >= 0 ? 1 : -1
    robot.angle += (steer / 100) * 2.15 * dt * direction * Math.min(1, Math.abs(robot.speed) / 45 + 0.25)
    const oldX = robot.x, oldY = robot.y
    robot.x = clamp(robot.x + Math.cos(robot.angle) * robot.speed * dt, 82, 918)
    robot.y = clamp(robot.y + Math.sin(robot.angle) * robot.speed * dt, 82, 538)
    const hit = obstacles.some(item => Math.hypot(robot.x-clamp(robot.x,item.x,item.x+item.w),robot.y-clamp(robot.y,item.y,item.y+item.h)) < 39)
    if (hit) {
      robot.x=oldX; robot.y=oldY; robot.speed*=-.22
      if(now-lastCollision>700){robot.collisions++;lastCollision=now;setMessage('Barrier touched: −5 points. Reverse and try another route.')}
    }
    if(robot.carrying){crate.x=robot.x+Math.cos(robot.angle)*78;crate.y=robot.y+Math.sin(robot.angle)*78}
    const remaining=Math.max(0,ROUND_SECONDS-(now-startedAt)/1000)
    el('time').textContent=Math.ceil(remaining)
    el('score').textContent=Math.max(0,30-robot.collisions*5)
    if(remaining<=0)finish(false)
  } else robot.speed*=.85
  updateMeters(drive,steer);drawArena(now);requestAnimationFrame(frame)
}

function setKey(key, pressed) {
  if(key==='arrowup'||key==='w')controls.keyboardDrive=pressed?100:0
  if(key==='arrowdown'||key==='s')controls.keyboardDrive=pressed?-70:0
  if(key==='arrowleft'||key==='a')controls.keyboardSteer=pressed?-100:0
  if(key==='arrowright'||key==='d')controls.keyboardSteer=pressed?100:0
  if(pressed&&['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key))startIfNeeded()
}

document.addEventListener('keydown',event=>{const key=event.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(key))event.preventDefault();setKey(key,true);if((key===' '||key==='enter')&&!event.repeat)toggleGrip();if(key==='r')resetGame();if(key==='b'&&!event.repeat){robot.boostUntil=performance.now()+850;startIfNeeded()}})
document.addEventListener('keyup',event=>setKey(event.key.toLowerCase(),false))
el('connectButton').addEventListener('click',connectMicrobit)
el('resetButton').addEventListener('click',resetGame)
el('newRound').addEventListener('click',resetGame)
el('gripButton').addEventListener('click',toggleGrip)

document.querySelectorAll('[data-control]').forEach(button=>{
  const start=()=>{const action=button.dataset.control;if(action==='left')controls.keyboardSteer=-100;if(action==='right')controls.keyboardSteer=100;if(action==='forward')controls.keyboardDrive=100;if(action==='reverse')controls.keyboardDrive=-70;startIfNeeded()}
  const stop=()=>{const action=button.dataset.control;if(action==='left'||action==='right')controls.keyboardSteer=0;else controls.keyboardDrive=0}
  button.addEventListener('pointerdown',start);button.addEventListener('pointerup',stop);button.addEventListener('pointerleave',stop);button.addEventListener('pointercancel',stop)
})

const lit = [7,8,11,13,17,18]
for(let i=0;i<25;i++){const dot=document.createElement('i');if(lit.includes(i))dot.className='lit';el('ledGrid').appendChild(dot)}
el('best').textContent=localStorage.getItem('virtual-beetlebit-best')||'0'
if(!navigator.serial){el('statusDot').className='status-dot unsupported';el('connectText').textContent='Use Chrome or Edge'}
resetGame();requestAnimationFrame(frame)
