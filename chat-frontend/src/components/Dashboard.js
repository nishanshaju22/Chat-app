import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Dashboard.module.css";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5001/api/chat/rooms").then((res) => setRooms(res.data));
  }, []);

  const createRoom = async () => {
    if (!newRoom) return;
    await axios.post("http://localhost:5001/api/chat/create-room", { name: newRoom });
    setNewRoom("");
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3>Rooms</h3>
        <input type="text" placeholder="New Room" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
        <button onClick={createRoom}>Create</button>
        <ul>
          {rooms.map((room) => (
            <li key={room._id} onClick={() => navigate(`/chat/${room._id}`)}>{room.name}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Dashboard;
