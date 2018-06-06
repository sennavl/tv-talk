const mongoose = require('mongoose');

const ChatroomSchema = mongoose.Schema({
  subEvent_id: { type: String, required: true },
  name: { type: String, required: true }
});

const Chatroom = mongoose.model('Chatroom', ChatroomSchema);
module.exports = Chatroom;
