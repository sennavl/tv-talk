const mongoose = require('mongoose');

const SubEventSchema = mongoose.Schema({
  event_id: { type: String, required: true},
  title: { type: String, required: true },
  datetime_start: { type: Date, required: true },
  datetime_end: { type: Date, required: true }
}, { collection: 'subEvents'});

const SubEvent = mongoose.model('SubEvent', SubEventSchema);
module.exports = SubEvent;
