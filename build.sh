#!/bin/bash

echo "Building the Fashion World application!"

echo "Checking IP Host variable"

if [ -z "$DB_HOST" ]
then
      echo "IP Host variable has not been set, please set this to to continue."
      echo "E.g. export DB_HOST={the ip address of the MySQL server}"
      exit
fi

if [ -z "$DB_HOST_MAIN" ]
then
      echo "IP Host variable has not been set, please set this to to continue."
      echo "E.g. export DB_HOST_MAIN={the ip address of the MySQL server}"
      exit
fi

if [ -z "$DB_PASSWORD" ]
then
      echo "IP Host variable has not been set, please set this to to continue."
      echo "E.g. export DB_PASSWORD={the password to the MySQL server}"
      exit
fi

echo "Setting Docker Machine IP"
export MACHINE_IP=$(docker-machine ip)

if [ -z "$MACHINE_IP" ]
then
      echo "Docker Machine IP variable has not been set."
      exit
fi

echo "Docker machine IP is ${MACHINE_IP}"

echo "Copying application files from Fashion World directory"

mkdir app-data
cp -r /c/FW_Files/tilldir ./app-data/tilldir
cp -r /c/FW_Files/stylepics ./app-data/stylepics

docker-compose build --no-cache

echo ""
echo "Build is complete, run the run.sh script to start the application"
