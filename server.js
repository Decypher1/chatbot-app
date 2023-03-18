const PATH = require('path')
const express = require('express');
const http = require("http");
const CONFIG = require('./config/config')
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server)
const session = require("express-session");


// Setting static folder
app.use(express.static(PATH.join(__dirname, 'public')));

const menu = {
	11: "Rice & Chicken",
	12: "HamBurger",
	13: "Meatpie",
	14: "Sharwarma",
	15: "Eba and Egusi"
} 


// Use session middleware
const sessionMW = session({
  secret: CONFIG.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});



const orderHistory = [];

io.use((socket, next) => {
	sessionMW(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
	console.log("User connected:", socket.id);

	// Get unique identifier for user's device
	const deviceId = socket.handshake.headers["user-agent"];

	// Check if user already has an existing session
	if (
		socket.request.session[deviceId] &&
		socket.request.session[deviceId].userName
	) {
		// If user already has a session, use existing username and current order
		socket.emit(
			"message",
			`Welcome back, ${
				socket.request.session[deviceId].userName
			}! You have a current order of ${socket.request.session[
				deviceId
			].currentOrder.join(", ")}`
		);
	} else {
		// If user does not have a session, create a new session for user's device
		socket.request.session[deviceId] = {
			userName: "",
			currentOrder: [],
			deviceId: deviceId, // store deviceId in session object
		};
	}

	// Ask for user's name if not provided already	
	if (!socket.request.session[deviceId].userName) {
		socket.emit("message", "Hello! Please enter your name");
		
	} else {
		socket.emit(
			"message",
			`Welcome back, ${
				socket.request.session[deviceId].userName
				}! You have a current order of ${socket.request.session[
					deviceId
					].currentOrder.join(", ")}`
		);
	}

	let userName = socket.request.session[deviceId].userName;

	//Listen for bot message
	socket.on("message", (message) => {
		console.log('message received:', message);
		socket.emit("message", message);
	});

	//Listening for incoming messages
	socket.on("user-message", (message) => {
		console.log('User message received:', message);

		if (!userName) {
			userName = message;
			socket.request.session[deviceId].userName = userName;
			socket.emit(
				"message",
				`Welcome to Cypher food ChatBot, ${userName}!\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
			);
		} else {
			switch (message) {
				case "1":
					const menuList = Object.keys(menu)
						.map((item) => `${item}. ${menu[item]}`)
						.join("\n");
					socket.emit(
						"message",
						`Please select an item from the menu using the number:\n${menuList}`
					);
					break;
					// Showing current order
				case "97":
					if (socket.request.session[deviceId].currentOrder.length > 0) {
						const currentOrder = socket.request.session[deviceId].currentOrder.join(', ');
						socket.emit(
							"message",
							`Your current order is: ${currentOrder}\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					} else {
						socket.emit(
							"message",
							`You have no current order.\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					}
					break;

				//checkout the order
				case "99":
					if (socket.request.session[deviceId].currentOrder.length > 0) {
						const currentOrder = socket.request.session[deviceId].currentOrder.join(', ');
						socket.emit(
							"message",
							`Your order of ${currentOrder} has been placed. Thank you for your patronage.`
						);
						orderHistory.push({
							deviceId: socket.request.session[deviceId].deviceId,
							userName: socket.request.session[deviceId].userName,
							order: socket.request.session[deviceId].currentOrder,
							date: new Date().toLocaleString(),
						});
						socket.request.session[deviceId].currentOrder = [];
					} else {
						socket.emit(
							"message",
							`You have no current order.\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					}
					break;
					//showing order history
				case "98":
					if (orderHistory.length > 0) {
						const orderHistoryList = orderHistory
							.map((item) => `Order: ${item.order.join(', ')}\nDate: ${item.date}\n`)
							.join("\n");
						socket.emit(
							"message",
							`Your order history is:\n${orderHistoryList}\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					} else {
						socket.emit(
							"message",
							`You have no order history.\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					}
					break;
					//cancel order
				case "0":
					const currentOrder = socket.request.session[deviceId].currentOrder.join(', ');
					if (currentOrder.length === 0 && orderHistory.length === 0) {
						socket.emit(
							"message",
							`You have no current order.\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					} else {
						socket.request.session[deviceId].currentOrder = [];
						orderHistory.length = 0;

						socket.emit(
							"message",
							`Your order of ${currentOrder.join(', ')} has been cancelled.`
						);
					}
					break;
				default:
					const itemNumber = parseInt(message);
					if (!isNaN(itemNumber) && menu[itemNumber]) {
						socket.request.session[deviceId].currentOrder.push(
							menu[itemNumber]
						);
						socket.emit(
							'message',
							`You have added ${menu[itemNumber]} to your order.\n1. Place an order \n99. Checkout order\n98. Order history\n97. Current order \n0. Cancel order`
						);
					} else {
						socket.emit(
							"message",
							`Invalid option. Please select a valid option.\n1. Place an order\n99. Checkout order\n98. Order history\n97. Current order\n0. Cancel order`
						);
					}
					break;
			}
		}
	});
	socket.on('disconnect', () => {
		delete socket.request.session[deviceId];
	
		console.log('User disconnected', socket.id);
	});
});

server.listen(CONFIG.PORT, () => {
	console.log(`Server running on port ${CONFIG.PORT}`);
});


















