# node-red-contrib-wio-seeed-led-bar

My first attempt to write my own NODE-RED nodes for the Wio Link.  This code is based on the work of WarriorRocker located here:

![node-red-contrib-wio-seeed](https://github.com/WarriorRocker/node-red-contrib-wio-seeed)

## Sleep
A simple node to put your wio to sleep for the specified time.  Can take a manual input or a msg.payload.

## LEDBar

This node allows you to configure the Grove LED Bar using the Wio Link API.
It currently supports these function calls via hard-coded values (similar to the mobile app) as well as the ability to send a value via a msg.payload:

*   "GET /v1/node/GroveLEDBarUART0/bits -> uint16_t bits",
*   "POST /v1/node/GroveLEDBarUART0/toggle/{uint8_t led}",
*   "POST /v1/node/GroveLEDBarUART0/level/{float level}",
*   "POST /v1/node/GroveLEDBarUART0/single_led/{uint8_t led}/{float brightness}",
*   "POST /v1/node/GroveLEDBarUART0/bits/{uint16_t bits}",
*   "POST /v1/node/GroveLEDBarUART0/orientation/{uint8_t green_to_red}",

### Sample Flow

![Sample Flow](../images/LEDBarFlow.png)

![Sample Debug Output](../images/LEDBarFlowDebug.png)

The sample flow samples a light sensor and converts the reading to a value the LED Bar can understand.  The LEDBar Node is using the **"POST /v1/node/GroveLEDBarUART0/bits/{uint16_t bits}"** method.

Copy and paste the JSON below to recreate the flow:

```JSON
[{
  "id": "fc1e2382.988e8",
  "type": "inject",
  "z": "f41916a4.06bff8",
  "name": "Button",
  "topic": "",
  "payload": "true",
  "payloadType": "bool",
  "repeat": "",
  "crontab": "",
  "once": false,
  "x": 112,
  "y": 71,
  "wires": [
    ["c06c8f94.670eb"]
  ]
}, {
  "id": "c06c8f94.670eb",
  "type": "function",
  "z": "f41916a4.06bff8",
  "name": "Cycle 1 to 10",
  "func": "for (var i=1; i<=10; i++){\n    node.send({payload:i});\n}\nreturn null;",
  "outputs": 1,
  "noerr": 0,
  "x": 109,
  "y": 152,
  "wires": [
    ["94055325.9364c"]
  ]
}, {
  "id": "94055325.9364c",
  "type": "delay",
  "z": "f41916a4.06bff8",
  "name": "",
  "pauseType": "rate",
  "timeout": "5",
  "timeoutUnits": "seconds",
  "rate": "30",
  "rateUnits": "minute",
  "randomFirst": "1",
  "randomLast": "5",
  "randomUnits": "seconds",
  "drop": false,
  "x": 114,
  "y": 229,
  "wires": [
    ["2ca6f7dd.0873b8"]
  ]
}, {
  "id": "2ca6f7dd.0873b8",
  "type": "wio-sensor",
  "z": "f41916a4.06bff8",
  "name": "Light Sensor",
  "connection": "2ee26705.760ee8",
  "node": "e8fcd8ec4f0f5a4a1cddf8ed6cf94de3",
  "port": "GroveLuminance:A0",
  "method": "luminance:lux",
  "output": "value",
  "x": 105,
  "y": 309,
  "wires": [
    ["a3b18575.6d5828",
      "8fb09bd6.fe6298"
    ]
  ]
}, {
  "id": "295c2a79.41c976",
  "type": "wio-ledbar",
  "z": "f41916a4.06bff8",
  "name": "",
  "connection": "2ee26705.760ee8",
  "node": "e8fcd8ec4f0f5a4a1cddf8ed6cf94de3",
  "port": "GroveLEDBar:UART0",
  "mode": "bitconfig",
  "led": 1,
  "brightness": 1,
  "level": "3",
  "orient": 0,
  "bitconfig": "511",
  "x": 301,
  "y": 398,
  "wires": [
    ["cb3b7ba3.06e398"]
  ]
}, {
  "id": "a3b18575.6d5828",
  "type": "debug",
  "z": "f41916a4.06bff8",
  "name": "Light Sensor Msg",
  "active": true,
  "console": "false",
  "complete": "payload",
  "x": 345,
  "y": 302,
  "wires": []
}, {
  "id": "cb3b7ba3.06e398",
  "type": "debug",
  "z": "f41916a4.06bff8",
  "name": "Led Bar Msg",
  "active": true,
  "console": "false",
  "complete": "payload",
  "x": 481,
  "y": 398,
  "wires": []
}, {
  "id": "8fb09bd6.fe6298",
  "type": "function",
  "z": "f41916a4.06bff8",
  "name": "msg case",
  "func": "if (msg.payload > 0 && msg.payload <= 100) {\n    msg.payload = 1;\n} else if (msg.payload > 100 && msg.payload <= 200) {\n    msg.payload = 3;\n} else if (msg.payload >200 && msg.payload <= 300){\n    msg.payload = 7;\n}else if (msg.payload >300 && msg.payload <= 400){\n    msg.payload = 15;\n}else if (msg.payload >400 && msg.payload <= 500){\n    msg.payload = 31;\n}else if (msg.payload >500 && msg.payload <= 600){\n    msg.payload = 63;\n}else if (msg.payload >600 && msg.payload <= 700){\n    msg.payload = 127;\n}else if (msg.payload >700 && msg.payload <= 800){\n    msg.payload = 255;\n}else if (msg.payload >800 && msg.payload <= 900){\n    msg.payload = 511;\n}else if (msg.payload >900 && msg.payload <= 1000){\n    msg.payload = 1023;\n}\nreturn msg;",
  "outputs": 1,
  "noerr": 0,
  "x": 103,
  "y": 390,
  "wires": [
    ["295c2a79.41c976",
      "c3020ee4.967e9"
    ]
  ]
}, {
  "id": "c3020ee4.967e9",
  "type": "debug",
  "z": "f41916a4.06bff8",
  "name": "If Function Msg",
  "active": true,
  "console": "false",
  "complete": "payload",
  "x": 308,
  "y": 521,
  "wires": []
}, {
  "id": "2ee26705.760ee8",
  "type": "wio-config",
  "z": "f41916a4.06bff8"
}]
```
