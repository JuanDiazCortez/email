#!/bin/bash

cd /opt/richelet/email/src/components/backends/backend-http
screen -dmS info-back  nodemon start server.js

cd /opt/richelet/email
screen -dmS info-front npm start

