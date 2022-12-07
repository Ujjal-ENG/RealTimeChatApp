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
    console.log(`${user} has joined`);
  });

  socket.emit('welcome', { user: 'Admin', message: `Welcome to the chat` })
  
  socket.broadcast.emit('userJoined',{user:'Admin',message: `${users.socket.id} has Joined`})
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
