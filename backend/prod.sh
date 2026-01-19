#!/bin/bash

source venv/bin/activate
gunicorn -w 4 -b localhost:5000 'app:app'
