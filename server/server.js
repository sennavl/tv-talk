const mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(4113).sockets;

// Connect to Mongo
mongo.connect('mongodb://localhost', (err, dbClient) => {
	const db = dbClient.db('tvtalk');
	if(err) {
		throw err;
	}
	console.log('MongoDB connected');

	client.on('connection', (socket) => {
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
					client.emit('output', data);
					sendStatus({
						message: 'message sent',
						clear: true
					})
				})
			}
		})
	});
})
