import os
from pathlib import Path
from hashlib import sha1
import hmac

from flask import Flask, send_from_directory, request
from dotenv import load_dotenv
import requests

BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BACKEND_DIR.parent / "frontend" / "dist"

# load secrets from .env
load_dotenv(BACKEND_DIR / ".env")
PTV_DEVELOPER_ID = os.environ.get("PTV_DEVELOPER_ID")
PTV_DEVELOPER_KEY = os.environ.get("PTV_DEVELOPER_KEY")

app = Flask(__name__)

# api routes
@app.route("/api/<path:path>")
def api_query(path):
    queryString = request.query_string.decode("utf-8")
    fullRequestPath = path + ("?" if queryString != "" else "") + queryString

    apiBaseURL = "https://timetableapi.ptv.vic.gov.au"
    apiRequestPathWithDevId = f"/{fullRequestPath}{"&" if "?" in fullRequestPath else "?"}devid={PTV_DEVELOPER_ID}"
    
    # compute a signature to get the full request url to give to the PTV API
    apiFullRequestURL = f"{apiBaseURL}/{apiRequestPathWithDevId}&signature={hmac.new(PTV_DEVELOPER_KEY.encode("utf-8"), apiRequestPathWithDevId.encode("utf-8"), sha1).hexdigest()}"

    response = requests.get(apiFullRequestURL)

    return response.json(), response.status_code

# frontend routes
@app.route("/", defaults={"path": "/"})
@app.route("/<path:path>")
def serve_frontend(path):
    file_path = FRONTEND_DIR / path

    if file_path.exists() and file_path.is_file():
        return send_from_directory(FRONTEND_DIR, path)
    
    # allow frontend SPA to route
    return send_from_directory(FRONTEND_DIR, "index.html")
