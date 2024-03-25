// document.getElementById("login-btn").addEventListener("click", function (event){

//     let username = document.getElementById('fname').value;
//     let pword = document.getElementById('pword').value;
//     let msg = {
//         "username": username,
//         "password": pword
//     };
//     fetch("/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(msg),
//         keepalive: true
//     }).then(response => {
//         return response.json()
//     }).then(data => {
//         if (data["success"]) {
//             location.replace("http://localhost:5000/startpage")
//             //window.location = "https://localhost:8080/startpage";
//             //window.location.replace("http://localhost:8080/startpage");
//         }
//     });
// })