const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
  user_id: { type: String, index: true, unique: true },
  movie_id: { type: Number, required: true },
  description: String,
  rating: { type: Number, required: true },
  date: { type: Date, required: true }
});

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
