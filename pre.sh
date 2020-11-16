#!/bin/bash
FILE=./dist
if test -d "$FILE"; then

    echo "file exists"
    killall node
    docker container stop my-frontend
    docker container prune -f
    rm -rf ./dist
else 
    echo "file does not exist"
fi

