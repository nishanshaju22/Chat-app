require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Store connected users
const users = {};
const chatRooms = {};

// Socket.io Chat Functionality
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    if (!chatRooms[room]) chatRooms[room] = [];
    
    io.to(room).emit("message", { sender: "System", content: `${username} joined the chat` });
    
    // Send previous chat history
    io.to(socket.id).emit("chatHistory", chatRooms[room]);
  });

  socket.on("sendMessage", ({ room, sender, content }) => {
    const message = { sender, content, timestamp: new Date() };
    chatRooms[room].push(message); // Store messages in memory

    io.to(room).emit("message", message);
  });

  socket.on("leaveRoom", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", { sender: "System", content: `${user.username} left the chat` });
      socket.leave(user.room);
      delete users[socket.id];
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("message", { sender: "System", content: `${user.username} disconnected` });
      delete users[socket.id];
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 5001, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
