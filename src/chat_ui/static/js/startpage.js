
//// Polling of new user queries //////
// function do_polling() {
//     fetch("/check_for_user_queries", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         keepalive: true
//     }).then(response => {
//         return response.json();
//     }).then(data => {
//         if (data["success"]) {
//             let messages_div = document.getElementById("chat-messages-startpage");
//             let job_dict = data["job_list"];
//             let user_query = job_dict["query"];
//             let answer = "";
//             if("agent_answer" in job_dict){
//                 answer = job_dict["agent_answer"];
//             }

//             let user_query_div = document.createElement("div");
//             user_query_div.style.width = "100%";
//             user_query_div.innerHTML = "User:";
//             var user_query_div_content = document.createElement('div');
//             user_query_div_content.setAttribute("class", "user-question-container-startpage")
//             user_query_div_content.innerHTML = user_query;

//             let model_answer_div = document.createElement("div");
//             model_answer_div.style.width = "100%";
//             model_answer_div.style.backgroundColor = "lightblue";
//             model_answer_div.innerHTML = "Model:";
//             var model_answer_div_content = document.createElement('div');
//             model_answer_div_content.setAttribute("class", "model-answer-container-startpage")
//             model_answer_div_content.style.width = "100%";
//             model_answer_div_content.style.backgroundColor = "lightblue";
//             model_answer_div_content.innerHTML = answer;
//             let user_msg_seperator = document.createElement("hr");
//             let answer_msg_seperator = document.createElement("hr");
//             messages_div.appendChild(user_query_div);
//             messages_div.appendChild(user_query_div_content);
//             messages_div.appendChild(user_msg_seperator);
//             messages_div.appendChild(model_answer_div);
//             messages_div.appendChild(model_answer_div_content);
//             messages_div.appendChild(answer_msg_seperator);
//         }
//     });
//     setTimeout(do_polling, 800);
// }

// document.addEventListener("DOMContentLoaded", function () {
//     do_polling();
// });

///////////////////////////////////////

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

function insert_chatgpt_answer_message(chat_div, response_message, sources) {
    let container_div = document.createElement("div");
    container_div.setAttribute("class", "model-answer-container-startpage");
    //container_div.addEventListener("click", handle_click_on_model_answer);

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
    //new_assistant_div_sources.className = "answer-sources";
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
            let sources = data["sources"];
            insert_chatgpt_answer_message(chat_div, response_message, sources);

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


function showHideButtonClickHandler(){

};


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

    // buttons.forEach(button => {
    //     button.addEventListener('click', function () {
    //         // Finde den nächsten Element-Sibling mit der Klasse 'answer-sources'
    //         const sourceContainer = this.parentElement.nextElementSibling;
    //         if (sourceContainer.style.display === 'none' || sourceContainer.style.display === '') {
    //             sourceContainer.style.display = 'block';
    //             this.innerText = 'Hide Sources';
    //         } else {
    //             sourceContainer.style.display = 'none';
    //             this.innerText = 'Show Sources';
    //         }
    //     });
    // });
});

