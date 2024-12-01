import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();

// Enable CORS for the frontend URL
app.use(cors({
  origin: "https://chatting-group-client.vercel.app",  // Replace with your frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));

// Simple route to test the backend
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// Create HTTP server and socket.io server
const server = createServer(app);
const io = new Server(server, {
  cors: {
<<<<<<< HEAD
    // origin: "http://localhost:5173",  // Frontend URL, update for Vercel when deployed
    origin: "https://chatting-group-client.vercel.app",  // Your frontend URL 
=======
    origin: "https://chatting-group-client.vercel.app",  // Replace with your frontend URL
>>>>>>> 76ccdec381112ab7bf35e0a5972cea17ac34b349
    methods: ["GET", "POST"],
    credentials: true,
  }
});

<<<<<<< HEAD
// Middleware for CORS
app.use(cors({
//   origin: "http://localhost:5173",  // Frontend URL, update for Vercel when deployed
  origin: "https://chatting-group-client.vercel.app",  // Your frontend URL 
  methods: ["GET", "POST"],
  credentials: true,
}));

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Hello world!");
});

=======
>>>>>>> 76ccdec381112ab7bf35e0a5972cea17ac34b349
// Handling user connections and messages
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room event
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  // Message event - broadcast to room
  socket.on("message", ({ message, room }) => {
    console.log(`Message from ${socket.id}: ${message} to room ${room}`);
    socket.to(room).emit("receive-message", { message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const port = process.env.PORT || 3000;  // Let Vercel handle the port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
