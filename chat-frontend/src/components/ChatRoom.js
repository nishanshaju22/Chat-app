import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import styles from "../ChatRoom.module.css";

const socket = io("http://localhost:5001");

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const username = "User" + Math.floor(Math.random() * 1000);  // This can be replaced with actual logged-in user data.

  // Fetch chat history when the component mounts or roomId changes
  useEffect(() => {
    // Join the room
    socket.emit("joinRoom", { username, room: roomId });

    // Fetch the chat history for the room
    axios.get(`http://localhost:5001/api/chat/rooms/${roomId}/messages`)
      .then((res) => {
        setMessages(res.data);  // Set the chat history to the state
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    // Listen for new messages from the server
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);  // Append new message to the history
      alert(`New message from ${msg.sender}: ${msg.content}`);  // Simple notification
    });

    // Clean up the socket connection when leaving the room
    return () => {
      socket.emit("leaveRoom", { room: roomId });
      socket.off();  // Remove any socket listeners
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message) return;  // Don't send empty messages
    socket.emit("sendMessage", { room: roomId, sender: username, content: message });  // Emit the message to the server
    setMessage("");  // Clear the input after sending the message
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages} id="messages">
        {/* Displaying all chat messages */}
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))
        ) : (
          <p>No messages yet</p>  // If no messages exist yet
        )}
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;
