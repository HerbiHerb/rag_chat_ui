import os, signal
from typing import Dict, List, Tuple
import requests
import yaml
from flask import (
    jsonify,
    flash,
    render_template,
    redirect,
    url_for,
    request,
    session,
)
import redis
from ..init_flask_app import app, redis_client
import json


@app.route("/", methods=["GET", "POST"])
def login_start():
    return render_template("login.html", session=session)


@app.route("/login", methods=["GET", "POST"])
def login():
    response = {"success": False}
    login_data = request.form
    username = login_data["username"]
    password = login_data["password"]
    data = json.dumps({"username": username, "password": password})
    request_response = requests.post(
        url=os.environ["HOST_URL"] + "/check_username_and_password", data=data
    )
    response_data = json.loads(request_response.text)
    if "user_id" in response_data and response_data["user_id"] != None:
        session["user_id"] = response_data["user_id"]
        redis_client.set("user_id", response_data["user_id"])
        response["success"] = True
        flash("You were successfully logged in", "success")
        return redirect(url_for("startpage"))
    else:
        flash("Wrong username or password", "error")
        return render_template("login.html")


@app.route("/logout", methods=["GET", "POST"])
def logout():
    if "user_id" in session:
        del session["user_id"]
    return render_template("login.html")
