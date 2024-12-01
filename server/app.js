import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();

// Create HTTP server and socket.io server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",  // Frontend URL, update for Vercel when deployed
    origin: "https://chatting-group-client.vercel.app",  // Your frontend URL 
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Middleware for CORS
app.use(cors({
  // origin: "http://localhost:5173",  // Frontend URL, update for Vercel when deployed
  origin: "https://chatting-group-client.vercel.app",  // Your frontend URL 
  methods: ["GET", "POST"],
  credentials: true,
}));

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Handling user connections and messages
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room event
  socket.on("join-room", (room) => {
    console.log(`Socket ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  // Message event - broadcast to room
  socket.on("message", ({ message, room }) => {
    console.log(`Message from ${socket.id}: ${message} to room: ${room}`);
    try {
      socket.to(room).emit("receive-message", { message });
    } catch (err) {
      console.error(`Error broadcasting message: ${err.message}`);
    }
  });

  // User disconnect event
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });

  // Error event to catch unexpected errors in Socket.IO
  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

// Error handling for Express
app.use((err, req, res, next) => {
  console.error(`Express Error: ${err.message}`);
  res.status(500).send("Something went wrong!");
});

// Start server and log errors if any
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on("error", (err) => {
  console.error(`Server failed to start: ${err.message}`);
});
