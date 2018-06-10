var axios = require('axios')
var Agenda = require('agenda');

var mongoConnectionString = 'mongodb://localhost/agenda';

var agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('checkEventsOpen', function(job, done) {
	console.log('checkeventsOpen', new Date())
	axios.get(`http://localhost:3001/subEvents/runningEvents`)
        .then((response) => {
		  if (response.data.length > 0) {
			  // there are running events so check if they already have chatrooms open
			  // if they don't -> add chatroom
			  console.log('there are running events, checking if they have chatrooms')
			  response.data.forEach(element => {
				axios.get(`http://localhost:3001/chatrooms/${element._id}`)
					.then((response) => {
						if (response.data.length > 0) {
							// There are chatrooms of the running subevents so it's not needed to create a chatroom
							console.log('There are chatrooms for the running events')
						} else {
							// There are no chatrooms so it's necessary to create one
							console.log('There are no chatrooms for the running events')
							axios.post(`http://localhost:3001/chatroom/add`, {
								subEvent_id: element._id,
								name: 'Chatroom 1'
							})
							.then(() => {
								console.log('Added chatroom')
							})
							.catch(err => console.log(err))
						}
					})
					.catch(err => console.log(err))
			  });
		  }
        })
        .catch(e => {
          console.log(e)
		})
	// request all events that just ended and close them
	done()
});

agenda.define('checkEventsClose', function(job, done) {
	console.log('checkeventsClose', new Date())
	axios.get('http://localhost:3001/subEvents/ended')
		.then((response) => {
			console.log(response.data.length)
		})
		.catch(err => console.log(err))
	done();
})

agenda.on('ready', function() {
	console.log('ready')
	// agenda.now('checkEventsOpen')
	agenda.every('*/5 * * * * *', 'checkEventsOpen');
	agenda.every('*/5 * * * * *', 'checkEventsClose');

	agenda.start();
});
