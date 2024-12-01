import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();

// Create server and Socket.IO server
const server = createServer(app);

// CORS setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Middleware for CORS
app.use(cors({
    origin: "http://localhost:5173",  // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
}));

// Simple route to check server
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// Authentication (dummy check)
const user = true;  // Assume authenticated for now
io.use((socket, next) => {
    if (user) {
        next();
    } else {
        next(new Error("Authentication error"));
    }
});

// Handling user connections and messages
io.on("connection", (socket) => {
    // console.log("User Connected:", socket.id);      //this is tells as per the who is connected

    // Join room event
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });

    // Message event - broadcast to room
    socket.on("message", ({ message, room }) => {
        console.log(`Message from ${socket.id}: ${message} to room: ${room}`);
        socket.to(room).emit("recive-message", { message });  // Emit message to all in room excluding sender
    });

    // User disconnect event
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});










// your still not giving the result what i want i was mentioned that i want that     when i send a message that message can be get at the senders side and also at recivers side alos but at senders side it should be with defferent color and different bg color and recevires also different like an whatsapp chat    in that give me a another button which is exit when a user can be clcik the exit then only he should be exit and he can get the another socked id but in you are given code when i referesh it is getting the another socked id give as per all this requirements please