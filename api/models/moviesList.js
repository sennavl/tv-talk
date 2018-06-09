const mongoose = require('mongoose');

const MoviesListSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  movie_id: { type: Number, required: true },
  list_id: { type: String, required: true },
  runtime: { type: Number, required: true },
  date: { type: Date, default: new Date() },
  title: { type: String, required: true },
  poster_path: { type: String, required: true }
});

MoviesListSchema.index({ user_id: 1, movie_id: 1, list_id: 1 }, { unique: true });

const MoviesList = mongoose.model('MoviesList', MoviesListSchema);
module.exports = MoviesList;
