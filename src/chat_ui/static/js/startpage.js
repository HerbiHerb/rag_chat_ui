
//// Polling of new user queries //////
function poll_speech_query_answers() {
    let selectedDocuments = getSelectedDocuments();
    let msg = {
        "selected_documents": selectedDocuments
    };
    fetch("/check_for_speech_queries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(msg),
        keepalive: true
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data["success"]) {
            query = data["query"]
            assistant_answer = data["answer"]
            sources = data["sources"]
            let chat_div = document.getElementById('chat-messages-startpage');
            insert_user_input_message(chat_div, query);
            insert_chatgpt_answer_message(chat_div, assistant_answer, sources);
        }
    });
    setTimeout(poll_speech_query_answers, 800);
}

document.addEventListener("DOMContentLoaded", function () {
    poll_speech_query_answers();
});

///////////////////////////////////////

document.getElementById('question-prompt-all-documents').addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        handleKeyPress();
    }
});

function getSelectedDocuments() {
    let selectedDocuments = [];
    let checkboxes = document.querySelectorAll('input[name="document"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedDocuments.push(checkbox.value);
    });
    return selectedDocuments;
}

function handleKeyPress() {
    let input_div = document.getElementById('question-prompt-all-documents');
    let input_text = input_div.textContent;
    let selectedDocuments = getSelectedDocuments();
    let msg = {
        "query": input_text,
        "selected_documents": selectedDocuments
    };
    handle_chat(msg);
}

function insert_user_input_message(chat_div, input_text) {
    let container_div = document.createElement("div");
    container_div.setAttribute("class", "user-question-container-startpage");

    let new_user_div = document.createElement("div");
    new_user_div.style.width = "100%";
    new_user_div.innerHTML = "User:";
    let new_user_div_content = document.createElement("div");
    new_user_div_content.style.width = "100%";
    new_user_div_content.innerHTML = input_text;
    let hr_element = document.createElement("hr");

    //container_div.appendChild(close_span);
    container_div.appendChild(new_user_div);
    container_div.appendChild(new_user_div_content);
    container_div.appendChild(hr_element);
    chat_div.appendChild(container_div);

}

function insert_chatgpt_answer_message(chat_div, response_message, sources) {
    let container_div = document.createElement("div");
    container_div.setAttribute("class", "model-answer-container-startpage");
    let new_assistant_div = document.createElement("div");
    new_assistant_div.style.width = "100%";
    new_assistant_div.style.backgroundColor = "lightblue";
    new_assistant_div.innerHTML = "Model:";
    let new_assistant_div_content = document.createElement("div");
    new_assistant_div_content.style.width = "100%";
    new_assistant_div_content.style.backgroundColor = "lightblue";
    new_assistant_div_content.innerHTML = response_message;

    container_div.appendChild(new_assistant_div);
    container_div.appendChild(new_assistant_div_content);

    let button_div = document.createElement("div");
    button_div.style.width = "100%";
    button_div.style.backgroundColor = "lightblue";
    button_div.style.display = "inline-block";
    let button = document.createElement("button");
    button.type = "button";
    button.style.float = "left";
    button.style.width = "200px";
    button.setAttribute("class", "show-hide-sources btn btn-info");
    //button.className = "show-hide-sources btn btn-info";
    button.innerText = 'Show Sources'; // Initialer Text des Buttons
    addToggleEventListener(button);
    button_div.appendChild(button);
    container_div.appendChild(button_div);

    let new_assistant_div_sources = document.createElement("div");
    new_assistant_div_sources.setAttribute("class", "answer-sources");
    new_assistant_div_sources.style.width = "100%";
    new_assistant_div_sources.style.backgroundColor = "lightblue";
    new_assistant_div_sources.style.display = "none";

    for (let i = 0; i < sources.length; i++) {
        let meta_data = sources[i]
        if ("text" in meta_data) {
            let source_text = meta_data["text"];
            let source_text_paragraph = document.createElement("p");
            source_text_paragraph.style.width = "100%";
            source_text_paragraph.style.backgroundColor = "lightblue";
            source_text_paragraph.innerHTML = source_text;
            new_assistant_div_sources.appendChild(source_text_paragraph);

        } 
    }
    container_div.appendChild(new_assistant_div_sources);
    let hr_element = document.createElement("hr");
    container_div.appendChild(hr_element);
    chat_div.appendChild(container_div);
}

function handle_chat(msg) {
    let chat_div = document.getElementById('chat-messages-startpage');
    let input_div = document.getElementById('question-prompt-all-documents');
    insert_user_input_message(chat_div, input_div.textContent);
    input_div.innerHTML = "";

    let spinner_div = document.createElement("div");
    spinner_div.setAttribute("class", "spinner-border");
    spinner_div.setAttribute("role", "status");
    spinner_div.style.display = "block";
    spinner_div.style.marginLeft = "auto";
    spinner_div.style.marginRight = "auto";
    chat_div.appendChild(spinner_div);

    fetch("/enter_query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(msg),
        keepalive: true
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data["success"]) {
            spinner_div.remove();
            let response_message = data["answer"];
            let sources = data["sources"];
            insert_chatgpt_answer_message(chat_div, response_message, sources);

        }
    });
}

document.getElementById("start-new-conversation-btn").addEventListener("click", function (event){
    fetch("/start_new_conversation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        keepalive: true
    }).then(response => {
        return response.json()
    }).then(data => {
        if (data["success"]) {
            location.reload();
        }
    });
})


function addToggleEventListener(button) {
    button.addEventListener('click', function () {
        const sourceContainer = this.parentElement.nextElementSibling;
        if (sourceContainer.style.display === 'none' || sourceContainer.style.display === '') {
            sourceContainer.style.display = 'block';
            this.innerText = 'Hide Sources';
        } else {
            sourceContainer.style.display = 'none';
            this.innerText = 'Show Sources';
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    // Selektiere alle Buttons mit der Klasse 'show-hide-sources'
    const buttons = document.querySelectorAll('.show-hide-sources');

    buttons.forEach(addToggleEventListener);
});

document.getElementById('upload-btn').addEventListener('click', function () {
    const form = document.getElementById('upload-form');
    const formData = new FormData(form);
    
    fetch('/upload_document', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        let statusDiv = document.getElementById('upload-status');
        if (data.success) {
            statusDiv.innerHTML = "<span style='color: green;'>Upload successful!</span>";
            window.location.reload();
        } else {
            statusDiv.innerHTML = "<span style='color: red;'>Upload failed: " + data.error + "</span>";
        }
    }).catch(error => {
        document.getElementById('upload-status').innerHTML = "<span style='color: red;'>An error occurred: " + error.message + "</span>";
    });
});