const express = require('express');
const Rating = require('./models/rating');
const Event = require('./models/event');
const SubEvent = require('./models/subEvent');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

// create database
mongoose.connect('mongodb://localhost/tvtalk');
const db = mongoose.connection;
db.on('error', () => console.error('connection error:'));
db.once('open', () => console.log('connected to database'));

// Enable CORS
app.use(cors());

// Create middleware for checking the JWT
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/ratings', checkJwt, (req, res) => {
	Rating
		.find()
		.then((ratings) => {
			res.json(ratings)
		})
		.catch(err => res.status(500, err.message).end());
});

app.get('/events', (req, res) => {
	Event
		.find()
		.then((events) => {
			res.json(events);
		})
		.catch(err => res.status(500, err.message).end());
})

app.get('/event/:id', (req, res) => {
	Event
		.findById(req.params.id)
		.then((event) => {
			res.json(event);
		})
		.catch(e => res.status(500, err.message).end());
})

app.get('/subEvents/:id', (req, res) => {
	SubEvent
		.find({ event_id: req.params.id})
		.then((subEvent) => {
			res.json(subEvent);
		})
		.catch(err => res.status(500, err.message).end());
})

app.post('/rating/add', checkJwt, (req, res) => {
	let ratingObj = req.body;
	ratingObj.date = new Date();
	let newRating = new Rating(req.body);
	newRating
		.save()
		.then((rating) => {
			res.json(rating);
		})
		.catch(err => {
			console.log(err.message)
			res.status(500, err.message).end();
		})
})

app.get('/rating', (req, res) => {
	Rating
		.findOne({ user_id: req.query.user_id, movie_id: req.query.movie_id })
		.then((rating) => {
			if (rating) {
				res.json(rating);
			} else {
				res.json(null);
			}
		})
})

app.get('/averageRating', (req, res) => {
	Rating
		.aggregate([
			{
				$match: {
					movie_id: parseInt(req.query.movie_id)
				}
			},
			{
				$group: {
					_id: '$movie_id',
					averageRating: { $avg: '$rating'}
				}
			}
		]).then((response) => {
			if (response.length > 0) {
				res.json(response[0].averageRating);
			} else {
				res.json('Not yet rated');
			}
		})
})

// launch the API Server at localhost:3001
app.listen(3001);
console.log('Listening on http://localhost:3001');
