#!/bin/sh

COMMAND="${1}"

if [ -z "${COMMAND}" ]; then
    COMMAND="start"
fi

cp -r /var/app/node_modules /app/ && npm run "${COMMAND}"
