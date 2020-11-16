#!/bin/bash
FILE=./dist
if test -d "$FILE"; then

    echo "file exists"
    killall node
    whoami
    docker container stop my-frontend
    docker container prune -f
    chmod 777 ./dist
    rm -rf ./dist
else 
    echo "file does not exist"
fi

