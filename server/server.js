var io = require('socket.io')();
io.on('connection', (client) => {
	console.log('made socket connection', client.id);

	client.on('chat', function(data){
        console.log(data);
        //io.sockets.emit('chat', data);
    });
});
io.listen(4113);