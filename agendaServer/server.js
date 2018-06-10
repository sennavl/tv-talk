var axios = require('axios')
var Agenda = require('agenda');

var mongoConnectionString = 'mongodb://localhost/agenda';

var agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('checkEvents', function(job, done) {
	console.log('checkevents', new Date())
	axios.get(`http://localhost:3001/subEvents/runningEvents`)
        .then((response) => {
		  console.log(response.data)
		  if (response.data.length > 0) {
			  // there are running events so check if they already have chatrooms open
			  // if they don't -> add chatroom
		  }
        })
        .catch(e => {
          console.log(e)
		})
	// request all events that just ended and close them
	done()
});

agenda.on('ready', function() {
	console.log('ready')
	agenda.now('checkEvents')
	agenda.every('*/5 * * * * *', 'checkEvents');

	agenda.start();
});
