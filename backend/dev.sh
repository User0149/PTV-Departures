#!/bin/bash

set -Eeuo pipefail

source ../.env

source venv/bin/activate
flask run --port=$BACKEND_PORT
