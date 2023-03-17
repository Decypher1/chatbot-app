const socket = io();
const btn = document.querySelector('.btn');
const chatBody = document.querySelector('.chat-body');
const msg = document.getElementById('msg');


//function to append message to the chatbody

function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = "message-text";
    messageElement.id =sender;
    messageElement.textContent = message;

    const timestamp = new Date().toLocaleTimeString(); // timestamp
    const timestampElement = document.createElement('span');
    timestampElement.className = "timestamp";
    timestampElement.textContent = timestamp;

    const messageContainer = document.createElement('div');
    const messageContainer2 = document.createElement('div');
    messageContainer.className = "message-container " + sender;
    messageContainer2.className = "message-container2 " + sender;
    messageElement.innerHTML = message.replace(/\n/g, '<br>');
    messageContainer2.appendChild(messageContainer);
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(timestampElement);
    chatBody.appendChild(messageContainer2);
    chatBody.scrollTop = chatBody.scrollHeight;
}


//Handling sending messages
function sendMessage() {
    const message = msg.value;
    if (message) {
        return;
    }
    appendMessage(message, "user");
    socket.emit('message', message);
    msg.value = '';
}   


//Message from server
socket.on('message', message => {
    console.log(message);
    appendMessage(message);
})


//Event Listener
btn.addEventListener('click', sendMessage);
msg.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
