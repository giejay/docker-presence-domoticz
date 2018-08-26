# docker-presence-domoticz

Dockerfile for setting up a listener for the presence project: https://github.com/andrewjfreyer/presence, which can push changes to Domoticz. 

1. Clone: https://github.com/giejay/docker-presence
2. Create container: docker build -t rpi-presence .
3. Clone this repo.
4. Create container: docker build -t rpi-presence-domoticz .
5. Create mqtt-config folder
6. Create 'mqtt_preference' file in folder presence-config, example:
```
mqtt_address="localhost"
mqtt_user=""
mqtt_password=""
mqtt_topicpath="location"
mqtt_room="Living room"
```
7. Create 'owner_devices' file same presence-config folder, example:
```
AA:BB:81:5D:BB:AA #giejay:211
```
8. Copy this docker-compose.yaml: 

```version: '2'
services:
    mosquitto:
        image: 'pascaldevink/rpi-mosquitto'
        restart: unless-stopped
        ports:
            - '0.0.0.0:1883:1883'
            - '0.0.0.0:9001:9001'
        volumes:
            - './mqtt-config/config:/mqtt/config:ro'
            - './mqtt-config/log:/mqtt/log'
            - './mqtt-config/data:/mqtt/data'
    presence:
        image: rpi-presence
        network_mode: host
        volumes:
            - './presence-config/mqtt_preferences:/presence/mqtt_preferences'
            - './presence-config/owner_devices:/presence/owner_devices'
        depends_on:
            - mosquitto
    presence-domoticz:
        image: rpi-presence-domoticz
        network_mode: host
        volumes:
            - './presence-config/mqtt_preferences:/presence-domoticz/mqtt_preferences'
            - './presence-config/owner_devices:/presence-domoticz/owner_devices'
        depends_on:
            - mosquitto
```
9. Optionally, put in your mosquitto.conf inside mqtt-config/config/mosquitto.conf.
10. Run docker-compose: docker-compose up -d
