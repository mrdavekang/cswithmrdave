export const programs = {
  single: {name:'W2_First_Signal',code:`radio.setGroup(7)
input.onButtonPressed(Button.A, function () {
    radio.sendString("L")
})`},
  sender: {name:'W2_Controller',code:`radio.setGroup(7)
basic.showIcon(IconNames.Square)
input.onButtonPressed(Button.A, function () {
    radio.sendString("L")
})
input.onButtonPressed(Button.B, function () {
    radio.sendString("R")
})
input.onButtonPressed(Button.AB, function () {
    radio.sendString("S")
})`},
  echo: {name:'W2_Receiver_First_Message',code:`radio.setGroup(7)
basic.showString("S")
radio.onReceivedString(function (receivedString) {
    basic.showString(receivedString)
})`},
  receiver: {name:'W2_Receiver',code:`radio.setGroup(7)
basic.showIcon(IconNames.Square)
radio.onReceivedString(function (receivedString) {
    if (receivedString == "L") {
        basic.showArrow(ArrowNames.West)
    } else if (receivedString == "R") {
        basic.showArrow(ArrowNames.East)
    } else {
        basic.showIcon(IconNames.Square)
    }
})`},
  dock: {name:'W2_Radio_Docking',code:`let position = 2
let target = 4
radio.setGroup(7)
led.plot(position, 4)
radio.onReceivedString(function (receivedString) {
    if (receivedString == "L" && position > 0) {
        position += -1
    } else if (receivedString == "R" && position < 4) {
        position += 1
    } else if (receivedString == "S") {
        if (position == target) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
        basic.pause(500)
    }
    basic.clearScreen()
    led.plot(position, 4)
})`},
};
export function projectFiles(key, group=7) {
  const p=programs[key];
  if(!p) throw new Error('Unknown program');
  if(!Number.isInteger(group)||group<0||group>255) throw new Error('Choose a radio group from 0 to 255.');
  const code=p.code.replace('radio.setGroup(7)',`radio.setGroup(${group})`);
  const config={name:p.name,description:'Microbit Inventors Week 2 radio mission',dependencies:{core:'*',radio:'*'},files:['main.ts'],preferredEditor:'blocksprj'};
  return {name:p.name,files:{'pxt.json':JSON.stringify(config,null,2),'main.ts':code}};
}
export function mkcdContent(key,group=7) {
  const {name,files}=projectFiles(key,group);
  return JSON.stringify({meta:{cloudId:'ks/microbit',editor:'blocksprj',name},source:JSON.stringify(files)});
}
