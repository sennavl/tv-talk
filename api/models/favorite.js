const mongoose = require('mongoose');

const FavoriteSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  movie_id: { type: Number, required: true },
  date: { type: Date, default: new Date() },
  title: { type: String, required: true },
  poster_path: { type: String, required: true }
});

FavoriteSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;
