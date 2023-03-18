const socket = io();


const msgChat = document.querySelector('.chat-box');
const msgForm = document.querySelector(".msg-inputarea");
const msgInput = document.getElementById("msg-input");

const person_name = ""

socket.on("auto-response", (message) => {
    botResponse(message)
})


msgForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let msgText = msgInput.value;
    msgText = msgText.trim();
    if (!msgText) {
        return false;
    }
    socket.emit("chatMessage", msgText)
    appendMessage(person_name, "right", msgText);
    msgInput.value = "";

});

function appendMessage(name, side, text) {
    const msgHTML = `
    <div class="msg ${side}-msg">
        <div class="msg-bubble">
            <div class="msg-info">
                <div class="msg-info-name">${name}</div>
                <div class="msg-info-time">${formatDate(new Date())}</div>  
            </div>

            <div class="msg-text">${text}</div>
        </div>
    </div>
    `;

    msgChat.insertAdjacentHTML("beforeend", msgHTML);
    msgChat.scrollTop = msgChat.scrollHeight;
}

function botResponse(message) {
    setTimeout(() => {
        appendMessage("Cypher", "left", message);
    }, 1000);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

