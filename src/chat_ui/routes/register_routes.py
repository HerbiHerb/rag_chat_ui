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
from ..init_flask_app import app
import json


def check_username_valid(username: str) -> bool:
    if type(username) == str and len(username) > 5:
        return True
    else:
        return False


def check_password_valid(password: str) -> bool:
    if type(password) == str and len(password) > 5:
        return True
    else:
        return False


@app.route("/register", methods=["GET", "POST"])
def register():
    return render_template("register.html")


@app.route("/register_user", methods=["GET", "POST"])
def register_user():
    response = {"success": False}
    login_data = request.form
    username = login_data["username"]
    password = login_data["password"]
    if not check_username_valid(username) or not check_password_valid(password):
        flash(
            "Please enter a valid username and password (at least 5 characters long)",
            "error",
        )
        return render_template("login.html")
    data = json.dumps({"username": username, "password": password})
    request_response = requests.post(
        url=os.environ["HOST_URL"] + "/register_new_user", data=data
    )
    response_data = json.loads(request_response.text)
    if "user_id" in response_data and response_data["user_id"] != None:
        session["user_id"] = response_data["user_id"]
        response["success"] = True
        flash("User was successfully registered", "success")
        return redirect(url_for("startpage"))
    elif "error" in response_data:
        flash(response_data["error"], "error")
        return render_template("login.html")
    else:
        return render_template("login.html")
