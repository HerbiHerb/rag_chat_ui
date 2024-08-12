import pathlib
import os
from flask import Flask
from flask_cors import CORS
from flask_session import Session
import redis

DESIRED_ROOT = pathlib.Path(__file__).parent
app = Flask(__name__)
app.secret_key = "140918"
# app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
# CORS(app, supports_credentials=True)

# app.config["CORS_HEADERS"] = "Content-Type"

# app.config["SESSION_TYPE"] = "redis"
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_USE_SIGNER"] = True
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0)

# Initialisieren der Session-Erweiterung
# Session(app)
