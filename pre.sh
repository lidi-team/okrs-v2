#!/bin/bash
FILE=./dist
if test -d "$FILE"; then

    echo "file exists"
    docker container stop my-frontend
    docker container prune -f
else 
    echo "file does not exist"
fi

