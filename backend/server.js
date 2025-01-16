const dotenv = require("dotenv");
dotenv.config(); // Load environment variables first
const express = require("express");
const connectDB = require("./config/db");
const chats = require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, erroEhandler } = require("./middileware/errorMiddleWare");
const path = require("path");
const cors = require("cors");

const app = express();
connectDB();
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: false, // Disable credentials since we're allowing all origins
  })
);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Deployement
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running");
  });
}

app.use(notFound);
app.use(erroEhandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console.log(`Server started on PORT ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*", // Allow all origins for WebSocket connections
    methods: ["GET", "POST"],
    credentials: false,
  },
});

io.on("connection", (socket) => {
  console.log("connected to sokect.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user Joined a room:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

   socket.on("new message", (newMessageRecieved) => {
    console.log("new message");
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

 
});
