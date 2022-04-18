#!/bin/bash

cd /opt/nodes/richelet/richelet-info/src/components/backends/backend-http
screen -dmS info-back  nodemon start server.js

cd /opt/nodes/richelet/richelet-info
screen -dmS info-front npm start

