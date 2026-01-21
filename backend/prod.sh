#!/bin/bash

set -Eeuo pipefail

# if we are using a hosting service and manually injecting environment variables, then the .env file will not exist
if [ -f ../.env ]; then
    source ../.env
fi

source venv/bin/activate
gunicorn -w 4 -b 0.0.0.0:$BACKEND_PORT 'app:app'
