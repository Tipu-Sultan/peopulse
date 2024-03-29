// ChatMessage.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  senderUsername: { type: String, required: true },
  roomId: { type: String, required: true },
  receiverUsername: { type: String, required: true },
  contentType: { type: String, required: true },
  filepath: { type: String},
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
