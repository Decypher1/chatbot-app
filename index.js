const PATH = require('path');
const http = require('http');
const express = require ('express');
require("dotenv").config();
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server)
// Setting static folder
app.use(express.static(PATH.join(__dirname, 'public')));

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})