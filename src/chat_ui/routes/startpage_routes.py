import os, signal
from typing import Dict, List, Tuple
import requests
import yaml
from flask import (
    jsonify,
    render_template,
    redirect,
    request,
    session,
)
from ..init_flask_app import app
import json


@app.route("/startpage")
def startpage():
    if "user_id" not in session:
        return render_template("login.html")
    user_id = session["user_id"]
    request_response = requests.post(
        url=os.environ["HOST_URL"] + "/get_latest_conv_id",
        data=json.dumps({"user_id": user_id}),
    )
    response_data = json.loads(request_response.text)
    conv_id = response_data["conv_id"]
    chat_messages = requests.post(
        url=os.environ["HOST_URL"] + "/get_chat_messages",
        data=json.dumps({"query": conv_id, "user_id": user_id}),
    )
    chat_messages = json.loads(chat_messages.text)
    return render_template(
        "startpage.html", session=session, chat_messages=chat_messages
    )


@app.route("/enter_query", methods=["POST"])
def enter_query():
    """
    Handles the conversation with an AI agent. It processes the incoming query,
    retrieves or starts a new conversation, generates a response using the AI model,
    and returns the AI's response along with context information.

    Returns:
        JSON response containing the answer from the AI agent and any source information used.
    """
    response = {"success": False}
    request_data = json.loads(request.data)

    if not "query" in request_data:
        return "Request must contain a 'query' key"
    user_id = session["user_id"]
    query_data = json.dumps({"query": request_data["query"], "user_id": user_id})
    try:
        request_response = requests.post(
            url=os.environ["HOST_URL"] + "/execute_rag", data=query_data
        )
        response_data = json.loads(request_response.text)
        response.update(response_data)
        response["success"] = True
    except Exception as e:
        print(e)
    return jsonify(response)


@app.route("/start_new_conversation", methods=["POST"])
def start_new_conversation():
    response = {"success": False}
    user_id = session["user_id"]
    query_data = json.dumps({"user_id": user_id})
    new_conv_id = requests.post(
        url=os.environ["HOST_URL"] + "/create_new_conversation", data=query_data
    )
    new_conv_id = json.loads(new_conv_id.text)["conv_id"]
    response["success"] = True
    return response
