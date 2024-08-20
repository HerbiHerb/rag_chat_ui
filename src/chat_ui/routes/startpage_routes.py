import os, signal
from typing import Dict, List, Tuple
import requests
import json
from flask import (
    jsonify,
    render_template,
    make_response,
    request,
    session,
)
import time
from ..init_flask_app import app
from ..output_utils.speaking import speak_the_answer


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
    conv_data = requests.post(
        url=os.environ["HOST_URL"] + "/get_chat_messages",
        data=json.dumps({"query": conv_id, "user_id": user_id}),
    )
    documents = requests.post(
        url=os.environ["HOST_URL"] + "/get_all_doument_meta_data",
        data=json.dumps({"user_id": user_id}),
    )
    documents = json.loads(documents.text)
    conv_data = json.loads(conv_data.text)
    chat_messages = conv_data["chat_messages"]
    sources = conv_data["sources"]
    chat_messages_with_sources = [
        list(entry) for entry in list(zip(chat_messages, sources))
    ]
    return render_template(
        "startpage.html",
        session=session,
        chat_messages=chat_messages_with_sources,
        documents=documents,
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
    selected_documents = request_data["selected_documents"]
    query_data = json.dumps(
        {
            "query": request_data["query"],
            "user_id": user_id,
            "selected_documents": selected_documents,
        }
    )
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


@app.route("/check_for_speech_queries", methods=["POST", "GET"])
def check_for_speech_queries():
    response = {"success": False}
    request_data = json.loads(request.data)
    user_id = session["user_id"] if "user_id" in session else None
    if not user_id:
        return jsonify(response)
    # check if there are new queries in the host database
    print("check for speech queries")
    try:
        selected_documents = request_data["selected_documents"]
        query_data = json.dumps(
            {"user_id": user_id, "selected_documents": selected_documents}
        )
        request_response = requests.post(
            url=os.environ["HOST_URL"] + "/process_speech_query", data=query_data
        )
        response_data = json.loads(request_response.text)
        response.update(response_data)
        if "answer" in response_data:
            os.environ["STOP_SPEAKING"] = "False"
            speak_the_answer(answer=response_data["answer"])
        response["success"] = response_data["success"]
    except Exception as e:
        print(e)
    return jsonify(response)


# @app.route("/start_test_speaking", methods=["GET"])
# def start_test_speaking():
#     long_text = """Intelligent Home Assistant on a Raspberry Pi: A DIY Project with LLMs, Vector Databases, and Microservices Introduction
# In today's digital world, intelligent assistants have become an integral part of our daily lives. The ability to perform complex tasks through voice commands has revolutionized the way we interact with technology. In this blog post, I want to share my latest project: the development of an intelligent home assistant powered by a Large Language Model (LLM) running on a Raspberry Pi. This project combines modern technologies like vector databases, email integration, and a microservice architecture. It was an exciting endeavor that I’m eager to share with you.

# The Idea Behind the Project
# The idea to develop my own home assistant stemmed from a desire to integrate the capabilities of modern AI technology into my smart home. While most commercial solutions are powerful, they often come with limitations when it comes to customization and the use of specific data sources. Hence, I decided to build my own assistant tailored to my personal needs and designed to work with my data.
# The Architecture: Microservices, Docker, and Raspberry Pi

# Microservice Architecture
# The assistant is based on a microservice architecture where the backend and frontend are decoupled. This approach offers the advantage of developing, testing, and maintaining different components independently. For example, the speech processing service can be updated independently of the database service without needing to restart the entire system."""
#     speak_the_answer(answer=long_text)
#     return jsonify({"success": True})


@app.route("/stop_speaking", methods=["GET"])
def stop_speaking():
    os.environ["STOP_SPEAKING"] = "True"
    print("Stop speaking!!")
    return jsonify({"success": True})


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


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"txt"}


@app.route("/upload_document", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file part"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No selected file"})

    if file and allowed_file(file.filename):
        # filename = secure_filename(file.filename)

        # Um den Textinhalt direkt zu lesen, ohne die Datei zu speichern:
        file_content = file.read().decode("utf-8")  # Dateiinhalt als Text

        user_id = session["user_id"]
        query_data = json.dumps({"user_id": user_id, "uploaded_text": file_content})
        request_response = requests.post(
            url=os.environ["HOST_URL"] + "/upload_document", data=query_data
        )
        response_data = json.loads(request_response.text)

        return jsonify({"success": response_data["success"]})
    else:
        return jsonify({"success": False, "error": "File type not allowed"})
