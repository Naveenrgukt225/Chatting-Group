import React, { useEffect, useState, useMemo } from 'react';
import { io } from "socket.io-client";
import './FloatLabel.css';

const ChatMsg = () => {
  const [messages, setMessages] = useState([]);  // for receiving messages from others
  const [message, setMessage] = useState("");  // for sending message
  const [room, setRoom] = useState("");  // for sending messages to a particular room
  const [socketID, setSocketId] = useState("");  // to send message to a particular person
  const [roomName, setRoomName] = useState("");  // for joining a room

  const socket = useMemo(() => io("http://localhost:3000"), []);
  useEffect(() => {
    socket.on("connect", () => {
        setSocketId(socket.id);
    });

    socket.on("recive-message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
        socket.disconnect();
    };
}, []);

const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (room && message) {
        socket.emit("message", { message, room });
        setMessage("");
    }
};

  return (
    <div className='outer-container'>
      <div className='container'>
        <h4 className='id-field'>{socketID}</h4>
        <br />
    
        <div className="messages-field">
          {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
        </div>
        <div className='join-label'>
          <form onSubmit={handleJoinRoom}>
            <div className='input-field'>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
              <label htmlFor="join-room">Enter Room Name</label>
            </div>
            <button type='submit'>Join</button>
          </form>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='Inner-field'>
            <div className='input-field'>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              />
              <label htmlFor="room">Enter Room ID</label>
            </div>

            <div className='input-field'>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <label htmlFor="message">Enter Message</label>
            </div>
            <button type='submit'>Send</button>
          </div>
        </form>

        {/* <div className="messages-field">
          {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
        </div> */}
      </div>
    </div>
  );
};

export default ChatMsg;
