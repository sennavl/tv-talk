const mongoose = require('mongoose');

const RatingTvSchema = mongoose.Schema({
  user_id: { type: String },
  serie_id: { type: Number, required: true },
  description: String,
  rating: { type: Number, required: true },
  date: { type: Date, required: true }
}, { collection: 'ratingsTv'});

RatingTvSchema.index({ user_id: 1, serie_id: 1 }, { unique: true });

const RatingTv = mongoose.model('RatingTv', RatingTvSchema);
module.exports = RatingTv;
