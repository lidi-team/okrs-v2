#!/bin/bash
# pgrep -x node >/dev/null && echo "Process found" && killall node && yarn build || echo "Process not found" && yarn build
SERVICE="node"
if pgrep -x "$SERVICE" >/dev/null
then
    echo "$SERVICE is running"
    killall node
else    
    echo "$SERVICE stopped"
fi