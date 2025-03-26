const express = require("express");
const ChatRoom = require("../models/ChatRoom");

const router = express.Router();

// Create Chat Room
router.post("/create-room", async (req, res) => {
  const { name } = req.body;
  const room = new ChatRoom({ name, members: [] });
  await room.save();
  res.json(room);
});

// Get All Rooms
router.get("/rooms", async (req, res) => {
  const rooms = await ChatRoom.find();
  res.json(rooms);
});

// Join Room
router.post("/join-room", async (req, res) => {
  const { roomId, username } = req.body;
  const room = await ChatRoom.findById(roomId);
  
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (!room.members.includes(username)) {
    room.members.push(username);
    await room.save();
  }

  res.json({ message: `Joined room: ${room.name}` });
});

// Get Room Messages
router.get("/rooms/:id/messages", async (req, res) => {
  const room = await ChatRoom.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  res.json(room.messages);
});

// Send Message
router.post("/rooms/:id/message", async (req, res) => {
  const { sender, content } = req.body;
  const room = await ChatRoom.findById(req.params.id);
  
  if (!room) return res.status(404).json({ message: "Room not found" });

  const message = { sender, content, timestamp: new Date() };
  room.messages.push(message);
  await room.save();

  res.json({ message: "Message sent", message });
});

module.exports = router;
