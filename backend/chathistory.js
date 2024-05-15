const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema({
  username: { type: String, required: true },
  chatSession: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);

module.exports = ChatHistory;
