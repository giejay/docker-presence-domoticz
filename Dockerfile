FROM hypriot/rpi-node

COPY server.js /presence-domoticz/server.js
COPY package.json /presence-domoticz/package.json
WORKDIR /presence-domoticz
RUN npm install

CMD ["node", "server.js"]
