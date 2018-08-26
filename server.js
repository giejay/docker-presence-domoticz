const mqtt = require('mqtt')
const fs = require('fs');
const prop = require('properties-parser');

prop.read('mqtt_preferences', (err, preferences) => {
    if (err) throw err;
    const room = preferences.mqtt_room.replace(/\"/g, '');
    const mqttClient = mqtt.connect('mqtt://' + preferences.mqtt_address.replace(/\"/g, ''));
    fs.readFile('owner_devices', (err, devices) => {
        if (err) throw err;
        const deviceIndexByMac = devices.toString().split("\n").reduce((previousValue, i) => {
            const mac = i.substring(0, i.indexOf(' '));
            const name = i.substring(i.indexOf('#') + 1, i.lastIndexOf(':'));
            const domoticzIndex = i.substring(i.lastIndexOf(':') + 1);
            console.log(mac)
            console.log(name)
            console.log(domoticzIndex);

            previousValue[mac] = domoticzIndex;
            return previousValue;
        }, {});

        for (key in deviceIndexByMac) {
            mqttClient.subscribe('location/owner/' + room + '/' + key);
        }

        mqttClient.on('connect', () => {
            console.log('connected to mqtt broker');
        });

        mqttClient.on('message', (topic, message) => {
            const mac = topic.substring(topic.lastIndexOf('/') + 1);
            const parsedMessage = JSON.parse(message.toString());
	    const domoticzCommand = {'command': 'switchlight', 'idx': parseInt(deviceIndexByMac[mac]), 'switchcmd': 'Set Level', 'level': parseInt(parsedMessage.confidence) + 1}; 
            mqttClient.publish('domoticz/in', JSON.stringify(domoticzCommand));
            console.log(parsedMessage);
        })
    });
});




