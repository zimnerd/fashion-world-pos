#!/bin/bash

echo "Running the Fashion World application!"

docker-compose up -d

echo ""
echo "The application will now start on your default browser."
echo "If the application has not started after a few minutes,"
echo "Please open a browser tab at localhost to use the application!"

start "http://localhost"
