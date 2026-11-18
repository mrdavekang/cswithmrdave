const SENSOR_STOP_CHAPTER = 'https://beetlebit-hub.cytron.io/chapter-resources/chapter-4';
const SENSOR_STOP_FIELDS = ['sensor14','sensor15','sensor16','sensorNear','sensorFar','sensorDebrief'];

const SENSOR_STOP_SOURCE = `let driveEnabled = false
let running = false
let startedAt = 0
let runId = 0
let distance = 0
let threshold = 15
let speed = 50
zoombit.brake()
input.onButtonPressed(Button.A, function () {
    if (driveEnabled && !(running)) {
        runId += 1
        startedAt = input.runningTime()
        running = true
    }
})
input.onButtonPressed(Button.B, function () {
    running = false
    zoombit.brake()
})
basic.forever(function () {
    if (running) {
        let readingForRun = runId
        distance = zoombit.readUltrasonic()
        if (running && readingForRun == runId) {
            let tooClose = distance <= threshold
            let noEcho = distance <= 0 || distance >= 255
            let timedOut = input.runningTime() - startedAt >= 1500
            if (tooClose || noEcho || timedOut) {
                running = false
                zoombit.brake()
            } else {
                zoombit.move(MotorDirection.Forward, speed)
            }
        }
    }
    basic.pause(40)
})`;

const SENSOR_STOP_CARDS = [
  {id:'ready', tag:'Choose your starting point', title:'Where is your Beetle today?', text:'Keep motor power off. Choose the option that matches your latest test.'},
  {id:'measure', tag:'Read the sensor', title:'Make A show a distance.', text:'Open a separate MakeCode project and add the Cytron ZOOM:BIT extension. Copy this starter into JavaScript, then switch to Blocks to read it.'},
  {id:'measure-check', tag:'Teacher check · stationary', title:'Show Mr Kang the distance program.', text:'Mr Kang checks the ultrasonic connection, keeps the drive and claw isolated, and supervises transfer and testing. Leave the robot still on the bench.'},
  {id:'14', tag:'Measure', title:'Try a 14 cm gap.', text:'Put a flat piece of cardboard squarely in front of the ultrasonic sensor. Measure from the face of the sensor. Wait one second, press A and record what the LEDs show.', field:'sensor14', label:'Reading in cm, or X'},
  {id:'15', tag:'Measure', title:'Try a 15 cm gap.', text:'Move only the cardboard. Wait one second, then press A and record the reading.', field:'sensor15', label:'Reading in cm, or X'},
  {id:'16', tag:'Measure', title:'Try a 16 cm gap.', text:'Move the cardboard 1 cm farther away. Wait one second, then press A and record the reading.', field:'sensor16', label:'Reading in cm, or X'},
  {id:'predict', tag:'Read the rule', title:'What should happen at exactly 15 cm?', text:'The brake rule is distance ≤ 15 cm. The symbol ≤ means “at or below.”'},
  {id:'code', tag:'Build the stop program', title:'Give your Beetle a brake rule.', text:'Use a new MakeCode project with ZOOM:BIT. Keep driveEnabled false while you review the code. A starts an enabled run. B brakes and cancels it.'},
  {id:'teacher', tag:'Teacher check · before motor power', title:'Show Mr Kang the code and robot.', text:'Ask Mr Kang to inspect the fasteners, motor direction, sensor, speed and code with motor power off. He changes driveEnabled to true, checks the upload and controls power for the wheels-up test.'},
  {id:'raised', tag:'Teacher-led test · wheels up', title:'Check the brakes with wheels raised.', text:'With the robot secured and the claw idle, check that it moves only on a clear reading. Test the close target, invalid reading, timeout and B. Switch off if any result is unexpected.'},
  {id:'near', tag:'Teacher-led floor test · run 1', title:'Try the first barrier position.', text:'With Mr Kang’s approval, put the barrier about 25 cm from the sensor in a clear lane. Stand back while he controls power. Record the gap if the robot stops safely.', field:'sensorNear', label:'Final gap or what happened'},
  {id:'far', tag:'Teacher-led floor test · run 2', title:'Move the barrier farther away.', text:'Switch off while moving the barrier to about 35 cm. Use the same code. If the timeout stops the robot early, record that result. After the run, Mr Kang disconnects motor power.', field:'sensorFar', label:'Final gap or what happened'},
  {id:'debrief', tag:'Mission debrief', title:'What told your Beetle to stop?', text:'Use your readings or test results to explain one stop. Show your explanation to Mr Kang.', field:'sensorDebrief', label:'My explanation'},
  {id:'extend', tag:'Early finisher · plan first', title:'Can it follow a line and still stop?', text:'Sketch a program that checks for an obstacle before making a line-following correction. Use Cytron’s Chapter 5 to see how the line sensors work. Show Mr Kang your plan before changing or powering the robot.'}
];

let sensorPrediction = '';
let sensorOwner = null;
let sensorCheckpoint = '';
const sensorIndex = id => SENSOR_STOP_CARDS.findIndex(card => card.id === id);

function sensorGo(id) {
  state.sensorCard = sensorIndex(id);
  go('sensor-stop');
}

function startSensorStop() {
  sensorPrediction = '';
  sensorCheckpoint = '';
  sensorGo('ready');
}

function sensorSource(source) {
  return `<details class="delivery-source"><summary>Copy the MakeCode starter</summary>
    <label class="field">MakeCode JavaScript<textarea id="sensor-source" readonly rows="9" spellcheck="false">${esc(source)}</textarea></label>
    <button id="sensor-copy" type="button">Copy code</button> ${link(SOURCES.editor,'Open MakeCode')}</details>`;
}

function sensorContent(card) {
  if (card.field) return `${card.id==='debrief'&&state.answers.sensorNear&&state.answers.sensorFar
    ? `<p class="small">Run 1 · ${esc(state.answers.sensorNear)}<br>Run 2 · ${esc(state.answers.sensorFar)}</p>` : ''}<label class="field">${card.label}<input id="sensor-evidence" maxlength="240" value="${esc(state.answers[card.field])}"></label>${['14','15','16'].includes(card.id)?`<div class="support-links">${btn('Reading does not change','data-trouble-start="ultrasonic"')}</div>`:''}`;
  switch (card.id) {
    case 'ready': {
      const current = SENSOR_STOP_CARDS[state.sensorResume || 0];
      const resume = current && current.id !== 'ready' ? btn('Resume · '+esc(current.title),`data-sensor-go="${current.id}"`) : '';
      return `<div class="choices">
        ${btn('I’m still building','data-view="build-pick"')}
        ${btn('I’m missing a screw, nut or part','id="sensor-part"')}
        ${btn('My motor needs a fix','data-trouble-start="motor"')}
        ${btn('My claw needs a fix','data-trouble-start="claw"')}
        ${btn('My motor and claw work · try Mini Delivery','data-delivery-start')}
        ${btn('Mini Delivery passed · start Sensor Stop','data-sensor-go="measure"')}
        ${btn('I can show my sensor readings · try the rule','data-sensor-go="predict"')}
        ${resume}
      </div>`;
    }
    case 'measure':
      return deliveryArt('sensor') + sensorSource(DISTANCE_SOURCE);
    case 'measure-check':
      return `<p class="warning">Wait for Mr Kang before connecting power. If you’re waiting, trace the blocks on screen.</p><div class="support-links">${link(SOURCES.transfer,'How to transfer to the micro:bit')}${link(SENSOR_STOP_CHAPTER,'Cytron · ultrasonic guide')}</div>`;
    case 'predict':
      return `<div class="choices">${btn('Brake','data-sensor-answer="brake"')}${btn('Keep moving','data-sensor-answer="drive"')}</div>${sensorPrediction?`<p class="instruction" role="status">${sensorPrediction==='brake'?'15 is included. The robot brakes.':'15 equals the threshold. Read the rule again.'}</p>`:''}`;
    case 'code':
      return `${figure('sensor-stop-rule.jpg','MakeCode blocks. When the run is active, read distance. Brake at or below the threshold, on an invalid reading, or after 1.5 seconds. Otherwise move forward.','MakeCode · Sensor Stop rule','delivery-example sensor-blocks')}
        <p class="small">A reading of 0 cm or 255 cm and above counts as invalid. The 1.5-second limit ends the run even if the robot never reaches the barrier.</p>${sensorSource(SENSOR_STOP_SOURCE)}`;
    case 'teacher':
      return '<p class="warning">Teacher approval happens in person. Keep wheels clear and fingers out of the claw.</p>';
    case 'raised':
      return `<div class="support-links">${btn('Distance problem','data-trouble-start="ultrasonic"')}${btn('Wheel direction problem','data-trouble-start="motor"')}</div>`;
    case 'extend':
      return link('https://beetlebit-hub.cytron.io/chapter-resources/chapter-5','Cytron · Maker Line guide');
    default:
      return '';
  }
}

function sensorStopCard() {
  const index = state.sensorCard || 0;
  const card = SENSOR_STOP_CARDS[index];
  const next = index < SENSOR_STOP_CARDS.length-1 ? SENSOR_STOP_CARDS[index+1].id : '';
  const actions = {
    'measure-check':'Mr Kang is here · start readings',
    teacher:'Mr Kang is here · wheels-up test',
    raised:'Checks passed with Mr Kang · floor test',
    debrief:'Show my evidence · extension'
  };
  const forward = card.id === 'ready' ? '' : next
    ? btn((actions[card.id]||'Next card')+' →',`data-sensor-go="${next}" id="sensor-next" ${(card.id==='predict'&&sensorPrediction!=='brake')||(card.field&&!state.answers[card.field]?.trim())?'disabled':''}`,'primary')
    : btn('Save & pack →','data-view="pack"','primary');
  return frame(head(card.tag,card.title,card.text)+sensorContent(card), {
    tag:'NEXT MISSION · SENSOR STOP',
    count:`${index+1} / ${SENSOR_STOP_CARDS.length}`,
    progress:index,
    total:SENSOR_STOP_CARDS.length,
    back:index?btn('← Back',`data-sensor-go="${SENSOR_STOP_CARDS[index-1].id}"`):btn('← My route','data-view="hub"'),
    next:forward
  });
}

function bindSensorStop() {
  if (sensorOwner !== state) {
    sensorOwner = state;
    sensorPrediction = '';
  }
  app.querySelectorAll('[data-sensor-start]').forEach(button=>button.onclick=startSensorStop);
  if (view !== 'sensor-stop') {
    sensorCheckpoint = '';
    return;
  }
  app.querySelectorAll('[data-sensor-go]').forEach(button=>button.onclick=()=>{
    const target = button.dataset.sensorGo;
    const current = SENSOR_STOP_CARDS[state.sensorCard || 0].id;
    if (button.id==='sensor-next'&&['measure-check','teacher','raised'].includes(current)) sensorCheckpoint = current;
    // Returning from a different route or a new session requires a fresh in-person check.
    const gate = ['14','15','16'].includes(target)&&sensorCheckpoint!=='measure-check' ? 'measure-check'
      : target==='raised'&&!['teacher','raised'].includes(sensorCheckpoint) ? 'teacher'
      : ['near','far'].includes(target)&&sensorCheckpoint!=='raised' ? 'teacher' : target;
    if (target!=='ready') state.sensorResume=sensorIndex(target);
    sensorGo(gate);
  });
  app.querySelectorAll('[data-sensor-answer]').forEach(button=>button.onclick=()=>{
    sensorPrediction=button.dataset.sensorAnswer;
    render();
    app.querySelector(`[data-sensor-answer="${sensorPrediction}"]`).focus();
  });
  if ($('#sensor-part')) $('#sensor-part').onclick=()=>{
    returnView='sensor-stop';
    startReport('unknown','unknown');
  };
  if ($('#sensor-evidence')) $('#sensor-evidence').oninput=event=>{
    const field=SENSOR_STOP_CARDS[state.sensorCard].field;
    state.answers[field]=event.target.value;
    $('#sensor-next').disabled=!event.target.value.trim();
    save();
  };
  if ($('#sensor-copy')) $('#sensor-copy').onclick=async()=>{
    const field=$('#sensor-source');
    try {
      await navigator.clipboard.writeText(field.value);
      say('MakeCode starter copied.');
    } catch {
      field.focus();
      field.select();
      say('Copy the selected code.');
    }
  };
}
