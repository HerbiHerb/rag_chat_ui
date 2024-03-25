import pathlib
import os
from flask import Flask

DESIRED_ROOT = pathlib.Path(__file__).parent
app = Flask(__name__)
app.secret_key = "140918"
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
