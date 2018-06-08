const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true }
});

ListSchema.index({ user_id: 1, name: 1 }, { unique: true });

const List = mongoose.model('List', ListSchema);
module.exports = List;
