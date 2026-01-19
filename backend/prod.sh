#!/bin/bash

source ../.env
source venv/bin/activate
gunicorn -w 4 -b 0.0.0.0:$BACKEND_PORT 'app:app'
