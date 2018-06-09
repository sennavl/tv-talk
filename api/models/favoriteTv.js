const mongoose = require('mongoose');

const FavoriteTvSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  serie_id: { type: Number, required: true },
  date: { type: Date, default: new Date() },
  title: { type: String, required: true },
  poster_path: { type: String, required: true }
});

FavoriteTvSchema.index({ user_id: 1, serie_id: 1 }, { unique: true });

const FavoriteTv = mongoose.model('FavoriteTv', FavoriteTvSchema);
module.exports = FavoriteTv;
