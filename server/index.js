const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT;

app.use(cors());
const server = http.createServer(app);

const io = socketIO(server);

const users = [{}];

app.get("/", (req, res) => {
  res.send("This is the Home Page");
});

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has Joined`,
    });

    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message,id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", { user: "Admin", message: `User has left` });
    console.log("User Left");
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
