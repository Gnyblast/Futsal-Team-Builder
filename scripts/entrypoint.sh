#!/bin/sh

COMMAND="${1}"

if [ -z "${COMMAND}" ]; then
    COMMAND="start"
fi

if [ ! -d "/app/node_modules" ]; then
    cp -r /var/app/node_modules /app/ && npm run "${COMMAND}"
    return
fi

npm run "${COMMAND}"
