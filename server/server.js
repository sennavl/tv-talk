const mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(4113);
require('dotenv').config();

client.sockets.on('connection', (socket) => {
	client.sockets.emit('rooms', client.sockets.adapter.rooms)
})

// Connect to Mongo
mongo.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds153763.mlab.com:53763/tvtalk`, (err, dbClient) => {
	const db = dbClient.db('tvtalk');
	if(err) {
		throw err;
	}
	console.log('MongoDB connected');

	client.sockets.on('connection', (socket) => {

		socket.on('subscribe', function(room) {
			console.log('joining room', room);
			socket.join(room);
			client.sockets.emit('rooms', client.sockets.adapter.rooms)
		})

		socket.on('unsubscribe', function(room) {
			console.log('leaving room', room);
			socket.leave(room);
			client.sockets.emit('rooms', client.sockets.adapter.rooms)
		})

		let chat = db.collection('chats');

		sendStatus = function(s) {
			socket.emit('status', s);
		}

		chat.find({ chatroom_id: socket.handshake.query.chatroom_id }).toArray(function(err, res){
			if(err) {
				throw err;
			}
			socket.emit('initialOutput', res);
		});

		socket.on('input', function(data) {
			let name = data.name;
			let message = data.message;
			data.date = Date.now()

			if(name === '' || message === '') {
				sendStatus('Please enter a message and login');
			} else {
				chat.insert({name: name, message: message, date: data.date, chatroom_id: data.chatroom_id}, function() {
					client.sockets.to(socket.handshake.query.chatroom_id).emit('output', data);
					sendStatus({
						message: 'message sent',
						clear: true
					})
				})
			}
		})
	});
})
