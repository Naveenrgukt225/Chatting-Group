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
    origin: "http://localhost:5173",  // Frontend URL, update for Vercel when deployed
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Middleware for CORS
app.use(cors({
  origin: "http://localhost:5173",  // Frontend URL, update for Vercel when deployed
  methods: ["GET", "POST"],
  credentials: true,
}));

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Handling user connections and messages
io.on("connection", (socket) => {
//   console.log("User Connected:", socket.id);

  // Join room event
  socket.on("join-room", (room) => {
    socket.join(room);
    // console.log(`${socket.id} joined room ${room}`);
  });

  // Message event - broadcast to room
  socket.on("message", ({ message, room }) => {
    // console.log(`Message from ${socket.id}: ${message} to room: ${room}`);
    socket.to(room).emit("receive-message", { message });  // Emit message to all in room excluding sender
  });

  // User disconnect event
  socket.on("disconnect", () => {
    // console.log("User Disconnected:", socket.id);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
