#!/bin/bash

source ../.env
source venv/bin/activate
gunicorn -w 4 -b localhost:$BACKEND_PORT 'app:app'
