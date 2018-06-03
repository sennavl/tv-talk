const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
  user_id: { type: String },
  movie_id: { type: Number, required: true },
  description: String,
  rating: { type: Number, required: true },
  date: { type: Date, required: true }
});

RatingSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
