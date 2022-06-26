#!/bin/bash

cd /opt/nodes/richelet/email/src/components/backends/backend-http
screen -dmS info-back  nodemon start server.js

cd /opt/nodes/richelet/email
screen -dmS info-front npm start

