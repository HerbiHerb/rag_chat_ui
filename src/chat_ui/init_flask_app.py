import pathlib
from flask import Flask
import redis

DESIRED_ROOT = pathlib.Path(__file__).parent
app = Flask(__name__)
app.secret_key = "140918"
# Use this if you start without docker-compose
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0)

# Use this if you start with docker-compose
# redis_client = redis.StrictRedis(host="redis", port=6379, db=0)
