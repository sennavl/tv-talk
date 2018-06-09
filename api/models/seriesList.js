const mongoose = require('mongoose');

const SeriesListSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  serie_id: { type: Number, required: true },
  list_id: { type: String, required: true },
  date: { type: Date, default: new Date() },
  title: { type: String, required: true },
  poster_path: { type: String, required: true }
});

SeriesListSchema.index({ user_id: 1, serie_id: 1, list_id: 1 }, { unique: true });

const SeriesList = mongoose.model('SeriesList', SeriesListSchema);
module.exports = SeriesList;
