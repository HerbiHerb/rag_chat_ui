
document.getElementById('question-prompt-all-documents').addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        handleKeyPress();
    }
});


function handleKeyPress() {
    let input_div = document.getElementById('question-prompt-all-documents');
    let input_text = input_div.textContent;
    let msg = {
        "query": input_text,
    };
    handle_chat(msg);
}

function insert_user_input_message(chat_div, input_div) {
    let input_text = input_div.textContent;
    let container_div = document.createElement("div");
    container_div.setAttribute("class", "user-question-container-startpage");

    // let close_span = document.createElement("span");
    // close_span.addEventListener("click", message_delete_event_handler);
    // close_span.innerHTML = '&times;';
    // close_span.setAttribute("class", "close");

    let new_user_div = document.createElement("div");
    new_user_div.style.width = "100%";
    new_user_div.innerHTML = "User:";
    let new_user_div_content = document.createElement("div");
    new_user_div_content.style.width = "100%";
    new_user_div_content.innerHTML = input_text;
    let hr_element = document.createElement("hr");

    let spinner_div = document.createElement("div");
    spinner_div.setAttribute("class", "spinner-border");
    spinner_div.setAttribute("role", "status");
    spinner_div.style.display = "block";
    spinner_div.style.marginLeft = "auto";
    spinner_div.style.marginRight = "auto";

    //container_div.appendChild(close_span);
    container_div.appendChild(new_user_div);
    container_div.appendChild(new_user_div_content);
    container_div.appendChild(hr_element);
    chat_div.appendChild(container_div);
    chat_div.appendChild(spinner_div);

    input_div.innerHTML = "";
    return spinner_div;
}

function insert_chatgpt_answer_message(chat_div, response_message, urls) {
    let container_div = document.createElement("div");
    container_div.setAttribute("class", "model-answer-container-startpage");
    // container_div.addEventListener("click", handle_click_on_model_answer);

    // let close_span = document.createElement("span");
    // close_span.addEventListener("click", message_delete_event_handler);
    // close_span.innerHTML = '&times;';
    // close_span.setAttribute("class", "close");

    // let assistant_message_idx_div = document.createElement("div");
    // assistant_message_idx_div.setAttribute("class", "message-index");
    // assistant_message_idx_div.style.display = "none";
    // assistant_message_idx_div.innerHTML = assistant_message_idx;
    // close_span.appendChild(assistant_message_idx_div)
    // user_message_idx_div.innerHTML = user_message_idx;

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

    // let empty_div = document.createElement("div");
    // empty_div.style.width = "100%";
    // empty_div.style.backgroundColor = "lightblue";
    // empty_div.innerHTML = "Sources:"
    // container_div.appendChild(empty_div);  

    let new_assistant_div_sources = document.createElement("div");
    new_assistant_div_sources.style.width = "100%";
    new_assistant_div_sources.style.backgroundColor = "lightblue";
    new_assistant_div_sources.innerHTML = "Sources:"
    container_div.appendChild(new_assistant_div_sources);

    for (let i = 0; i < urls.length; i++) {
        let url = urls[i]
        // let url_link_div = document.createElement("a");
        // url_link_div.style.width = "100%";
        // url_link_div.style.backgroundColor = "lightblue";
        // url_link_div.setAttribute("href", "url")
        // url_link_div.innerHTML = url
        let url_link_div = document.createElement("div");
        url_link_div.style.width = "100%";
        url_link_div.style.backgroundColor = "lightblue";
        let a_tag = document.createElement("a");
        a_tag.setAttribute("href", url);
        a_tag.innerHTML = url;
        url_link_div.appendChild(a_tag)
        //url_link_div.innerHTML = url
        container_div.appendChild(url_link_div);
    }

    let hr_element = document.createElement("hr");
    //container_div.appendChild(close_span);

    container_div.appendChild(hr_element);
    chat_div.appendChild(container_div);
}

function handle_chat(msg) {
    let chat_div = document.getElementById('chat-messages-startpage');
    let input_div = document.getElementById('question-prompt-all-documents');
    let spinner_div = insert_user_input_message(chat_div, input_div);
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
            let meta_data = data["meta"];
            let urls = meta_data.map(dict => dict.URL);
            //let urls = meta_data["url"]
            insert_chatgpt_answer_message(chat_div, response_message, urls);

        }
    });
}


// document.getElementById("start-btn").addEventListener("click", function (event){
//     fetch("/start_listening", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         keepalive: true
//     }).then(response => {
//         return response.json()
//     }).then(data => {
//         if (data["success"]) {
//         }
//     });
// })

// document.getElementById("stop-btn").addEventListener("click", function (event){
//     fetch("/stop_listening", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         keepalive: true
//     }).then(response => {
//         return response.json()
//     }).then(data => {
//         if (data["success"]) {
//         }
//     });
// })


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
            // let messages_div = document.getElementById("chat-messages-startpage");
            // messages_div.innerHTML = "";
            location.reload();
        }
    });
})