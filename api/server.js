const express = require('express');
const Rating = require('./models/rating');
const RatingTv = require('./models/ratingTv');
const Event = require('./models/event');
const SubEvent = require('./models/subEvent');
const Chatroom = require('./models/chatroom');
const Favorite = require('./models/favorite');
const FavoriteTv = require('./models/favoriteTv');
const List = require('./models/list');
const MoviesList = require('./models/moviesList');
const SeriesList = require('./models/seriesList');
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

// app.get('/ratings', checkJwt, (req, res) => {
// 	Rating
// 		.find()
// 		.then((ratings) => {
// 			res.json(ratings)
// 		})
// 		.catch(err => res.status(500, err.message).end());
// });

// add movie to favorites
app.post('/favorite/add', checkJwt, (req, res) => {
	let favoriteObj = req.body;
	favoriteObj.date = new Date();
	favoriteObj.user_id = req.user.sub.substring(6, req.user.sub.length);
	let newFavorite = new Favorite(req.body);
	newFavorite
		.save()
		.then((rating) => {
			res.json(rating);
		})
		.catch(err => {
			console.log(err.message)
			res.status(500, err.message).end();
		})
});

// add tv serie to favorites
app.post('/favoriteTv/add', checkJwt, (req, res) => {
	let favoriteObj = req.body;
	favoriteObj.date = new Date();
	favoriteObj.user_id = req.user.sub.substring(6, req.user.sub.length);
	let newFavorite = new FavoriteTv(req.body);
	newFavorite
		.save()
		.then((rating) => {
			res.json(rating);
		})
		.catch(err => {
			console.log(err.message)
			res.status(500, err.message).end();
		})
});

// Add list
app.post('/list/add', checkJwt, (req, res) => {
	let listObj = req.body;
	listObj.user_id = req.user.sub.substring(6, req.user.sub.length);
	let newList = new List(req.body);
	newList
		.save()
		.then((list) => {
			res.json(list);
		})
		.catch(err => {
			console.log(err.message)
			res.status(500, err.message).end();
		})
});

// Add movie to list
app.post('/list/addMovie', checkJwt, (req, res) => {
	let movieObj = req.body;
	movieObj.user_id = req.user.sub.substring(6, req.user.sub.length);
	let newMovie = new MoviesList(req.body);
	newMovie
		.save()
		.then((movie) => {
			res.json(movie);
		})
		.catch(err => {
			console.log(err.message)
			res.status(500, err.message).end();
		})
});

// Add movie to list
app.post('/list/addTvSerie', checkJwt, (req, res) => {
	let movieObj = req.body;
	movieObj.user_id = req.user.sub.substring(6, req.user.sub.length);
	let newMovie = new SeriesList(req.body);
	newMovie
		.save()
		.then((movie) => {
			res.json(movie);
		})
		.catch(err => {
			console.log(err.message)
			res.status(500, err.message).end();
		})
});

// Get lists
app.get('/lists', checkJwt, (req, res) => {
	List
		.find({ user_id: req.user.sub.substring(6, req.user.sub.length) })
		.then((lists) => {
			res.json(lists);
		})
		.catch(err => res.status(500, err.message).end());
});

// get movies from list
app.get('/list/movies', checkJwt, (req, res) => {
	MoviesList
		.find({ list_id: req.query.list_id })
		.then((movies) => {
			res.json(movies);
		})
		.catch(err => res.status(500, err.message).end());
})

// get series from list
app.get('/list/series', checkJwt, (req, res) => {
	SeriesList
		.find({ list_id: req.query.list_id })
		.then((movies) => {
			res.json(movies);
		})
		.catch(err => res.status(500, err.message).end());
})

app.get('/lists/movie', checkJwt, (req, res) => {
	MoviesList
		.find({ user_id: req.user.sub.substring(6, req.user.sub.length), movie_id: req.query.movie_id }, { list_id: 1})
		.then((listIds) => {
			res.json(listIds)
		})
		.catch(err => res.status(500, err.message).end());
})

app.get('/lists/serie', checkJwt, (req, res) => {
	SeriesList
		.find({ user_id: req.user.sub.substring(6, req.user.sub.length), serie_id: req.query.serie_id }, { list_id: 1})
		.then((listIds) => {
			res.json(listIds)
		})
		.catch(err => res.status(500, err.message).end());
})

// remove movie from list
app.delete('/list/delete/movie/:movie_id', checkJwt, (req, res) => {
	MoviesList
	  .deleteOne({ movie_id: req.params.movie_id, user_id: req.user.sub.substring(6, req.user.sub.length), list_id: req.query.list_id })
	  .then(() => res.status(200).end())
	  .catch(err => res.status(500, err.message).end())
});

// remove serie from list
app.delete('/list/delete/serie/:serie_id', checkJwt, (req, res) => {
	SeriesList
	  .deleteOne({ serie_id: req.params.serie_id, user_id: req.user.sub.substring(6, req.user.sub.length), list_id: req.query.list_id })
	  .then(() => res.status(200).end())
	  .catch(err => res.status(500, err.message).end())
});

// get favorite for a certain user and movie (to check if user already favorited the movie)
app.get('/favorite', checkJwt, (req, res) => {
	Favorite
		.findOne({ user_id: req.user.sub.substring(6, req.user.sub.length), movie_id: req.query.movie_id })
		.then((favorite) => {
			if (favorite) {
				res.json(favorite);
			} else {
				res.json(null);
			}
		})
		.catch(err => res.status(500, err.message).end());
})

// get favorite for a certain user and serie (to check if user already favorited the serie)
app.get('/favoriteTv', checkJwt, (req, res) => {
	console.log('fjeifjeif')
	FavoriteTv
		.findOne({ user_id: req.user.sub.substring(6, req.user.sub.length), serie_id: req.query.serie_id })
		.then((favorite) => {
			console.log(favorite)
			if (favorite) {
				res.json(favorite);
			} else {
				res.json(null);
			}
		})
		.catch(err => res.status(500, err.message).end());
})

// remove movie from favorites
app.delete('/favorite/delete/:movie_id', checkJwt, (req, res) => {
	Favorite
	  .deleteOne({ movie_id: req.params.movie_id, user_id: req.user.sub.substring(6, req.user.sub.length) })
	  .then(() => res.status(200).end())
	  .catch(err => res.status(500, err.message).end())
});

// remove list
app.delete('/list/delete/:list_id', checkJwt, (req, res) => {
	List
		.deleteOne({ _id: req.params.list_id, user_id: req.user.sub.substring(6, req.user.sub.length) })
		.then((response) => {
			MoviesList
				.deleteMany({ user_id: req.user.sub.substring(6, req.user.sub.length), list_id: req.params.list_id })
				.then((response) => {
					SeriesList
						.deleteMany({ user_id: req.user.sub.substring(6, req.user.sub.length), list_id: req.params.list_id })
						.then(() => {
							res.status(200).end();
						})
						.catch(err => res.status(500, err.message).end())
				})
				.catch(err => res.status(500, err.message).end())
	  })
	  .catch(err => res.status(500, err.message).end())
});

// remove tv serie from favorites
app.delete('/favoriteTv/delete/:serie_id', checkJwt, (req, res) => {
	FavoriteTv
	  .deleteOne({ serie_id: req.params.serie_id, user_id: req.user.sub.substring(6, req.user.sub.length) })
	  .then(() => res.status(200).end())
	  .catch(err => res.status(500, err.message).end())
});

// get favorite movies
app.get('/favorites/movies', checkJwt, (req, res) => {
	Favorite
		.find({ user_id: req.user.sub.substring(6, req.user.sub.length) })
		.then((favorites) => {
			res.json(favorites)
		})
		.catch(err => res.status(500, err.message).end());
})

// get favorite series
app.get('/favorites/series', checkJwt, (req, res) => {
	FavoriteTv
		.find({ user_id: req.user.sub.substring(6, req.user.sub.length) })
		.then((favorites) => {
			res.json(favorites)
		})
		.catch(err => res.status(500, err.message).end());
})

app.get('/events', (req, res) => {
	Event
		.find()
		.then((events) => {
			res.json(events);
		})
		.catch(err => res.status(500, err.message).end());
});

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
		.find({ event_id: req.params.id })
		.then((subEvent) => {
			res.json(subEvent);
		})
		.catch(err => res.status(500, err.message).end());
})

app.get('/chatrooms/:id', (req, res) => {
	Chatroom
		.find({ subEvent_id: req.params.id })
		.then((chatrooms) => {
			res.json(chatrooms);
		})
		.catch(err => res.status(500, err.message).end());
})

// add rating for movie
app.post('/rating/add', checkJwt, (req, res) => {
	let ratingObj = req.body;
	ratingObj.date = new Date();
	ratingObj.user_id = req.user.sub.substring(6, req.user.sub.length);
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

// Add rating for a tv series
app.post('/ratingTv/add', checkJwt, (req, res) => {
	let ratingObj = req.body;
	ratingObj.date = new Date();
	ratingObj.user_id = req.user.sub.substring(6, req.user.sub.length);
	let newRating = new RatingTv(req.body);
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

// get rating for a certain user and movie (to check if user already rated the movie)
app.get('/rating', checkJwt, (req, res) => {
	Rating
		.findOne({ user_id: req.user.sub.substring(6, req.user.sub.length), movie_id: req.query.movie_id })
		.then((rating) => {
			if (rating) {
				res.json(rating);
			} else {
				res.json(null);
			}
		})
})

// get rating for a certain user and tv show (to check if user already rated the show)
app.get('/ratingTv', (req, res) => {
	RatingTv
		.findOne({ user_id: req.query.user_id, serie_id: req.query.serie_id })
		.then((rating) => {
			if (rating) {
				res.json(rating);
			} else {
				res.json(null);
			}
		})
})

// get the average rating of a movie
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

// get the average rating of a tv show
app.get('/averageRatingTv', (req, res) => {
	RatingTv
		.aggregate([
			{
				$match: {
					serie_id: parseInt(req.query.serie_id)
				}
			},
			{
				$group: {
					_id: '$serie_id',
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
