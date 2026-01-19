#!/bin/bash

pnpm install

cd frontend
pnpm install

cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
