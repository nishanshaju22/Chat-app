const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  members: [String],
  messages: [
    {
      sender: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
