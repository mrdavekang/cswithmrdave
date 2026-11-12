const DELIVERY_CHAPTER = 'https://beetlebit-hub.cytron.io/chapter-resources/chapter-6';
const DISTANCE_CHAPTER = 'https://beetlebit-hub.cytron.io/chapter-resources/chapter-4';
const DELIVERY_SOURCE = `let teacherChecked = false
let closeAngle = -1
let openAngle = -1
let speed = 0
let driveTime = 0
let running = false
let cancelled = false

function configureDelivery() {
    teacherChecked = false
    closeAngle = -1
    openAngle = -1
    speed = 0
    driveTime = 0
}

function gripCargo() {
    zoombit.brake()
    rekabit.setServoPosition(ServoChannel.S1, closeAngle)
    basic.pause(600)
}

function moveAndBrake() {
    zoombit.move(MotorDirection.Forward, speed)
    basic.pause(driveTime)
    zoombit.brake()
    basic.pause(300)
}

function releaseCargo() {
    rekabit.setServoPosition(ServoChannel.S1, openAngle)
    basic.pause(600)
    rekabit.disableServo(ServoChannel.S1)
}

input.onButtonPressed(Button.A, function () {
    if (teacherChecked && !running && closeAngle >= 0 && closeAngle <= 180 && openAngle >= 0 && openAngle <= 180 && closeAngle != openAngle && speed > 0 && speed <= 255 && driveTime > 0 && driveTime <= 500) {
        running = true
        cancelled = false
        gripCargo()
        if (!cancelled) {
            moveAndBrake()
        }
        if (!cancelled) {
            releaseCargo()
        }
        running = false
    }
})

input.onButtonPressed(Button.B, function () {
    cancelled = true
    teacherChecked = false
    zoombit.brake()
    rekabit.disableServo(ServoChannel.S1)
})

configureDelivery()
zoombit.brake()
basic.showIcon(IconNames.Diamond)
`;

const DISTANCE_SOURCE = `input.onButtonPressed(Button.A, function () {
    let distance = zoombit.readUltrasonic()
    if (distance <= 0 || distance >= 255) {
        basic.showIcon(IconNames.No)
    } else {
        basic.showNumber(distance)
    }
})
basic.showIcon(IconNames.Target)
`;

const DELIVERY_CARDS = [
  {
    tag: 'The mission',
    title: 'Deliver one parcel.',
    text: 'A tiny parcel needs to reach the taped delivery bay. One press of A should grip it, move forward, stop and let it go inside the bay.',
    visual: 'sequence',
    next: 'Check my robot'
  },
  {
    tag: 'Ready to combine?',
    title: 'Check the motor and claw separately.',
    text: 'Use results from your last supervised tests. Both wheels must drive forward and brake, and the empty claw must open and close smoothly at two known S1 angles. If either result is missing or wrong, keep power off and return to that check with Mr Kang.',
    visual: 'readiness',
    next: 'Open MakeCode'
  },
  {
    tag: 'MakeCode · Setup',
    title: 'Make a fresh delivery project.',
    text: 'Open MakeCode and name a new project Mini Delivery. In Extensions, search for ZOOMBIT and add Cytron’s extension. It also gives you the REKA:BIT S1 servo blocks.',
    visual: 'setup',
    next: 'Read the grip blocks'
  },
  {
    tag: 'MakeCode · Grip',
    title: 'Grip while the wheels are stopped.',
    text: 'Brake first. Set S1 to your kit’s checked close angle. The pause gives the claw time to move before the wheels start.',
    visual: 'grip',
    next: 'Read the drive blocks'
  },
  {
    tag: 'MakeCode · Drive',
    title: 'Move briefly, then brake.',
    text: 'The driveTime pause sets how long the motors run. The brake block stops them. The next pause gives them time to settle before release. Check the real wheels during the empty run.',
    visual: 'drive',
    next: 'Read the release blocks'
  },
  {
    tag: 'MakeCode · Release',
    title: 'Open only after stopping.',
    text: 'Use your kit’s checked open angle. After the claw has time to open, disable S1 so it stops holding that position.',
    visual: 'release',
    next: 'Build the program'
  },
  {
    tag: 'MakeCode · Build',
    title: 'Put the three parts together.',
    text: 'Copy the starter into MakeCode’s JavaScript tab, replacing the default code. Switch back to Blocks and trace button A. In configureDelivery, leave teacherChecked false while you work with the robot disconnected.',
    visual: 'starter',
    next: 'Predict the result'
  },
  {
    tag: 'Predict before you run',
    title: 'What if you remove the brake before release?',
    text: 'Trace the code on screen with your partner.',
    visual: 'prediction',
    next: 'Show Mr Kang'
  },
  {
    tag: 'Teacher check · Keep power off',
    title: 'Show Mr Kang before powering up.',
    text: 'Ask him to check the robot and your Blocks project in person. Keep the battery and USB disconnected while you wait.',
    visual: 'teacher',
    next: 'See the empty test'
  },
  {
    tag: 'Supervised test · Empty claw',
    title: 'Test the sequence with wheels raised.',
    text: 'Mr Kang supervises the upload and power, then sets the robot on a secure support with wheels clear. With the USB unplugged and the claw empty, press A once when he says to. Watch for grip → forward → full stop → open.',
    visual: 'empty',
    next: 'See the parcel test'
  },
  {
    tag: 'Supervised test · Parcel',
    title: 'Make one delivery.',
    text: 'With power disconnected, mark a clear lane and delivery bay. Ask Mr Kang to set up a small, light foam parcel in the open claw at the start line. Once everyone is clear, he restores power and cues one press of A.',
    visual: 'cargo',
    next: 'Compare the runs'
  },
  {
    tag: 'Improve one thing',
    title: 'Can you land in the bay twice?',
    text: 'If you stopped short or went too far, predict one change to driveTime. Keep the other settings the same. Mr Kang rechecks any edited program and repeats the raised-wheel test before a floor retry. If you already hit the bay, repeat with the same settings.',
    visual: 'evidence',
    next: 'Finish the mission'
  },
  {
    tag: 'Mission debrief',
    title: 'Show what made your delivery work.',
    text: 'Switch off, save your MakeCode project and show Mr Kang where the code stops the wheels before opening the claw.',
    visual: 'debrief',
    next: 'Try the sensor challenge'
  },
  {
    tag: 'Early finisher · Ultrasonic',
    title: 'Can Beetle:BIT measure the distance to a parcel?',
    text: 'Make a separate project called Parcel Distance and add ZOOMBIT. Button A reads the ultrasonic sensor once. The LEDs show centimetres or an X for a reading outside the usable range.',
    visual: 'sensor',
    next: 'Get a sensor test check'
  },
  {
    tag: 'Teacher check · Sensor only',
    title: 'Keep the wheels and claw still.',
    text: 'With the battery and USB disconnected, Mr Kang isolates both drive motors and the servo. Show him the new program before he powers the sensor and helps you transfer it. Look for the target icon after upload.',
    visual: 'sensorCheck',
    next: 'Measure three distances'
  },
  {
    tag: 'Early finisher · Test your sensor',
    title: 'Compare the ruler with the display.',
    text: 'Under supervision, place a flat card at 10, 20 and 30 cm from the sensor. At each position hold still for a moment, predict the result and press A. Try one more reading with the target removed.',
    visual: 'sensorResults',
    next: 'Plan a warning'
  },
  {
    tag: 'Early finisher · Add a decision',
    title: 'Give a warning when a parcel is near.',
    text: 'Inside the valid-reading branch, add an if block. If distance is less than 15 cm, show a warning icon. Otherwise show a different icon. Keep the X for an invalid reading. Predict and check what happens at 14, 15 and 16 cm with Mr Kang.',
    visual: 'sensorDecision',
    next: 'Finish and pack away'
  }
];

const DELIVERY_CHECKS = [
  'Both separate tests passed. Wires and fixings are secure.',
  'Mr Kang checked the S1 angles, speed and time, and reviewed A and B.',
  'Mr Kang has the raised-wheel support ready and will control power.'
];
let delivery = null;

function startDelivery() {
  delivery = {owner:state, index:0, checks:[], ready:false, prediction:'', empty:false, sensor:false, evidence:'', distances:{}};
  go('delivery');
}

function deliveryReturn(topic) {
  delivery = null;
  returnView = 'hub';
  troubleStart(topic);
}

function deliveryChoices() {
  return '<div class="plain-actions"><button data-delivery-trouble="motor">Check the motors</button><button data-delivery-trouble="claw">Check the claw</button><button data-delivery-trouble="stopNow">Stop and get help</button></div>';
}

function deliveryCheck(key, label, checked) {
  return `<label class="delivery-check"><input type="checkbox" data-delivery-check="${key}" ${checked?'checked':''}> <span>${label}</span></label>`;
}

function deliverySource(kind) {
  const source = kind === 'sensor' ? DISTANCE_SOURCE : DELIVERY_SOURCE;
  return `<details class="delivery-source"><summary>Copy the MakeCode starter</summary><label class="field">MakeCode JavaScript<textarea id="delivery-source" rows="7" readonly spellcheck="false">${esc(source)}</textarea></label><button id="delivery-copy">Copy code</button> ${link(SOURCES.editor,'Open MakeCode')}</details>`;
}

function deliveryArt(kind) {
  const examples = {
    grip:['delivery-grip.jpg','MakeCode function gripCargo brakes, sets servo S1 to closeAngle and pauses'],
    drive:['delivery-drive.jpg','MakeCode function moveAndBrake moves forward at speed, pauses for driveTime, brakes and pauses'],
    release:['delivery-release.jpg','MakeCode function releaseCargo sets S1 to openAngle, pauses and disables S1'],
    sensor:['delivery-sensor.jpg','MakeCode button A reads ultrasonic distance, shows an X for invalid distance or displays centimetres']
  };
  const [file, alt] = examples[kind];
  return figure(file,alt,'Microsoft MakeCode · ZOOM:BIT and REKA:BIT blocks','delivery-example');
}

function deliveryContent(kind) {
  switch (kind) {
    case 'sequence':
      return '<ol class="delivery-sequence"><li>Grip</li><li>Move</li><li>Brake</li><li>Release</li></ol><p class="instruction">Success looks like this: the wheels stop before the claw opens and the parcel lands inside the bay.</p>';
    case 'readiness':
      return deliveryCheck('ready','Both tests passed with Mr Kang.',delivery.ready)+deliveryChoices();
    case 'setup':
      return figure('makecode-extension.jpg','Cytron ZOOMBIT extension in MakeCode','Find ZOOMBIT in Extensions','delivery-example')+link(SOURCES.editor,'Open MakeCode');
    case 'grip':
    case 'drive':
    case 'release':
      return deliveryArt(kind);
    case 'starter':
      return '<p class="instruction"><strong>A</strong> runs the mission once when checked and idle. <strong>B</strong> cancels, brakes and blocks another run until restart. Mr Kang controls physical power.</p>'+deliverySource('mission');
    case 'prediction':
      return `<div class="choices"><button data-delivery-answer="move" aria-pressed="${delivery.prediction==='move'}">It could release while moving.</button><button data-delivery-answer="stop" aria-pressed="${delivery.prediction==='stop'}">The pause will stop it.</button></div>${delivery.prediction?`<p class="instruction" role="status">${delivery.prediction==='move'?'Yes. The motors keep the last drive command until the brake runs.':'Read the move and pause again. The pause waits while the motors keep their last command.'}</p>`:''}`;
    case 'teacher':
      return `<fieldset class="delivery-checks"><legend>Record the check together</legend>${DELIVERY_CHECKS.map((label,i)=>deliveryCheck(i,label,delivery.checks[i])).join('')}</fieldset><p class="small">In configureDelivery, Mr Kang enters the verified angles, speed and driveTime (up to 500 ms in this starter), then sets teacherChecked true. He supervises USB transfer with the micro:bit removed and the robot supply disconnected. Check with him before every powered run.</p>${link(SOURCES.transfer,'micro:bit transfer guide','')}`;
    case 'empty':
      return '<p class="warning">If the wheels reverse, fail to stop or the claw catches, step back. Mr Kang cuts power. Keep hands clear.</p>'+deliveryCheck('empty','Mr Kang saw the empty test pass and approved a floor test.',delivery.empty)+deliveryChoices();
    case 'cargo':
      return '<p class="warning">Keep hands and feet outside the lane. Let Mr Kang switch off before anyone retrieves the parcel or repositions the robot.</p>'+deliveryChoices();
    case 'evidence':
      return `<label class="field">Where did each run stop?<textarea id="delivery-evidence" maxlength="240" placeholder="Example: Run 1 stopped short. Run 2 landed inside the bay.">${esc(delivery.evidence)}</textarea></label>`;
    case 'debrief':
      return `<p class="instruction">${delivery.evidence?esc(delivery.evidence):'Tell Mr Kang one thing you learned from the test.'}</p><div class="support-links">${link(DELIVERY_CHAPTER,'Cytron · Chapter 6','')}${btn('Save & pack','data-view="pack"')}</div>`;
    case 'sensor':
      return deliveryArt('sensor')+deliverySource('sensor');
    case 'sensorCheck':
      return deliveryCheck('sensor','Mr Kang isolated the actuators, checked the code and is ready to supervise.',delivery.sensor)+link(DISTANCE_CHAPTER,'Cytron · Chapter 4','');
    case 'sensorResults':
      return `<div class="delivery-readings">${[10,20,30,'No target'].map(target=>`<label class="field">${typeof target==='number'?target+' cm target':target}<input data-delivery-reading="${target}" maxlength="8" value="${esc(delivery.distances[target])}" placeholder="Reading"></label>`).join('')}</div><p class="small">255 can mean no echo or out of range. An X means you have no usable distance.</p>`;
    case 'sensorDecision':
      return '<p class="instruction"><strong>Invalid → X</strong> · <strong>Below 15 cm → warning</strong> · <strong>15 cm or more → other icon</strong></p><p class="small">Keep the actuators disconnected. Mr Kang checks your update before you transfer and test it.</p>';
  }
}

function deliveryCanAdvance() {
  switch (DELIVERY_CARDS[delivery.index].visual) {
    case 'readiness': return delivery.ready;
    case 'prediction': return delivery.prediction === 'move';
    case 'teacher': return DELIVERY_CHECKS.every((_,i)=>delivery.checks[i]);
    case 'empty': return delivery.empty;
    case 'sensorCheck': return delivery.sensor;
    default: return true;
  }
}

function deliveryCard() {
  if (delivery?.owner !== state) return hub();
  const {index} = delivery;
  const card = DELIVERY_CARDS[index];
  return frame(head(card.tag,card.title,card.text)+deliveryContent(card.visual), {
    tag:'MINI DELIVERY MISSION',
    count:`${index+1} / ${DELIVERY_CARDS.length}`,
    progress:index,
    total:DELIVERY_CARDS.length,
    back:index?btn('← Back','id="delivery-back"'):btn('← My route','data-view="hub"'),
    next:btn(card.next+' →',`id="delivery-next" ${deliveryCanAdvance()?'':'disabled'}`,'primary')
  });
}

function bindDelivery() {
  if (delivery?.owner !== state) delivery = null;
  app.querySelectorAll('[data-delivery-start]').forEach(b=>b.onclick=startDelivery);
  if (view !== 'delivery' || !delivery) return;
  app.querySelectorAll('[data-delivery-trouble]').forEach(b=>b.onclick=()=>deliveryReturn(b.dataset.deliveryTrouble));
  app.querySelectorAll('[data-delivery-check]').forEach(input=>input.onchange=()=>{
    const key = input.dataset.deliveryCheck;
    if (/^\d+$/.test(key)) delivery.checks[Number(key)] = input.checked;
    else delivery[key] = input.checked;
    $('#delivery-next').disabled = !deliveryCanAdvance();
  });
  app.querySelectorAll('[data-delivery-answer]').forEach(b=>b.onclick=()=>{
    delivery.prediction = b.dataset.deliveryAnswer;
    render();
    app.querySelector(`[data-delivery-answer="${delivery.prediction}"]`).focus();
  });
  if ($('#delivery-evidence')) $('#delivery-evidence').oninput=e=>delivery.evidence=e.target.value;
  app.querySelectorAll('[data-delivery-reading]').forEach(input=>input.oninput=()=>delivery.distances[input.dataset.deliveryReading]=input.value);
  if ($('#delivery-copy')) $('#delivery-copy').onclick=async()=>{
    const field = $('#delivery-source');
    try {
      await navigator.clipboard.writeText(field.value);
      say('MakeCode starter copied.');
    } catch {
      field.focus();
      field.select();
      say('Copy the selected code.');
    }
  };
  if ($('#delivery-back')) $('#delivery-back').onclick=()=>{
    const current = DELIVERY_CARDS[delivery.index].visual;
    if (current === 'empty') {
      delivery.checks = [];
      delivery.empty = false;
    }
    if (current === 'sensorResults') delivery.sensor = false;
    delivery.index--;
    go('delivery');
  };
  $('#delivery-next').onclick=()=>{
    if (!deliveryCanAdvance()) return;
    if (delivery.index === DELIVERY_CARDS.length - 1) {
      returnView = 'hub';
      delivery = null;
      go('pack');
    } else {
      delivery.index++;
      go('delivery');
    }
  };
}
