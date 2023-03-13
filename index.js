const PATH = require('path');
const http = require('http');
const express = require ('express');
const CONFIG = require('./config/config')
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server)

// Setting static folder
app.use(express.static(PATH.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {
    console.log('New WS Connection...');
})


server.listen(CONFIG.PORT, () => {
    console.log(`Server is running on ${CONFIG.PORT}`)
})